import assert from 'node:assert/strict'
import { mkdtemp, readFile, readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { CaptureRefusal } from '../scripts/guards.mjs'
import { Recorder } from '../scripts/recorder.mjs'

// A page and locators that only record what the recorder asks of them, on a clock the test drives.
function harness() {
  let clock = 1000
  const events = []
  let shots = 0
  const page = {
    async waitForTimeout(ms) {
      events.push(`wait ${ms}`)
      clock += ms
    },
    async screenshot() {
      shots++
      events.push(`screenshot@${clock}`)
      return Buffer.from(`shot-${shots}`)
    }
  }
  const locator = (name, box, element = { tagName: 'INPUT', type: 'text' }) => ({
    async scrollIntoViewIfNeeded() {},
    async boundingBox() {
      return box
    },
    async evaluate(fn) {
      return fn(element)
    },
    async click(options = {}) {
      if (options.trial) return events.push(`trial ${name}@${clock}`)
      events.push(`click ${name}@${clock}`)
      clock += 100
    },
    async pressSequentially(text) {
      events.push(`type ${text}`)
    }
  })
  return { page, locator, events, tick: (ms) => (clock += ms), now: () => clock }
}

test('steps record times from the first frame, clicks with their box, and a shot before the first click', async () => {
  const h = harness()
  const runDir = await mkdtemp(join(tmpdir(), 'capture-'))
  const rec = new Recorder({ page: h.page, runDir, now: h.now, minClickGapMs: 0 })
  rec.start()
  h.tick(500)
  await rec.step('open', 'Open the form', 'action', async () => {
    h.tick(200)
    await rec.click(h.locator('open', { x: 10.4, y: 20.6, width: 100, height: 40 }))
  })
  await rec.step('saving', 'Wait while it saves', 'wait', async () => h.tick(3000))
  const capture = await rec.finish({ walk: 'w', env: 'dev', title: 'T', viewport: { w: 1440, h: 900 } })

  assert.equal(capture.version, 1)
  assert.equal(capture.status, 'passed')
  const steps = JSON.parse(await readFile(join(runDir, 'steps.json'), 'utf8'))
  assert.deepEqual(steps[0], {
    id: 'open',
    caption: 'Open the form',
    kind: 'action',
    startMs: 500,
    endMs: 800,
    clicks: [{ tMs: 700, x: 60, y: 41, box: { x: 10, y: 21, w: 100, h: 40 } }],
    shot: 'shots/01-open.png'
  })
  assert.equal(steps[1].startMs, 800)
  assert.equal(steps[1].endMs, 3800)
  assert.equal(steps[1].shot, 'shots/02-saving.png')
  // The kept shot is the pre-click one (the second screenshot), not the one taken at step start.
  assert.equal(await readFile(join(runDir, 'shots/01-open.png'), 'utf8'), 'shot-2')
  assert.deepEqual(h.events.slice(0, 4), ['screenshot@1500', 'trial open@1700', 'screenshot@1700', 'click open@1700'])
  assert.deepEqual((await readdir(join(runDir, 'shots'))).sort(), ['01-open.png', '02-saving.png'])
})

test('a guard runs before every step and can stop the walk', async () => {
  const h = harness()
  const rec = new Recorder({ page: h.page, runDir: await mkdtemp(join(tmpdir(), 'capture-')), now: h.now })
  rec.start()
  const seen = []
  rec.onBeforeStep(async (id) => {
    seen.push(id)
    if (id === 'two') throw new Error('guard says no')
  })
  await rec.step('one', 'One', 'action', async () => {})
  await assert.rejects(rec.step('two', 'Two', 'action', async () => {}), /guard says no/)
  assert.deepEqual(seen, ['one', 'two'])
  assert.equal(rec.steps.length, 1)
  assert.equal(rec.attempting, 'two')
})

test('a failed walk records where and why, and a step that throws still closes', async () => {
  const h = harness()
  const runDir = await mkdtemp(join(tmpdir(), 'capture-'))
  const rec = new Recorder({ page: h.page, runDir, now: h.now })
  rec.start()
  await assert.rejects(
    rec.step('upload', 'Upload the file', 'action', async () => {
      h.tick(50)
      throw new Error('upload button missing')
    })
  )
  assert.equal(rec.steps[0].endMs, 50)
  const capture = await rec.finish(
    { walk: 'w', env: 'dev', title: 'T', viewport: { w: 1440, h: 900 } },
    { status: 'failed', failedStep: 'upload', failure: 'upload button missing' }
  )
  assert.equal(capture.failedStep, 'upload')
  assert.equal(JSON.parse(await readFile(join(runDir, 'capture.json'), 'utf8')).status, 'failed')
})

test('click and kind are refused outside the contract', async () => {
  const h = harness()
  const rec = new Recorder({ page: h.page, runDir: await mkdtemp(join(tmpdir(), 'capture-')), now: h.now })
  assert.throws(() => rec.ms(), /start\(\) must run/)
  rec.start()
  await assert.rejects(rec.click(h.locator('x', { x: 0, y: 0, width: 1, height: 1 })), /outside a step/)
  await assert.rejects(rec.step('s', 'S', 'pause', async () => {}), /kind must be action or wait/)
})

test('clicks are paced so the drawn cursor has time to travel', async () => {
  const h = harness()
  const rec = new Recorder({ page: h.page, runDir: await mkdtemp(join(tmpdir(), 'capture-')), now: h.now })
  rec.start()
  const box = { x: 0, y: 0, width: 10, height: 10 }
  await rec.step('two', 'Two clicks', 'action', async () => {
    await rec.click(h.locator('a', box))
    await rec.click(h.locator('b', box))
  })
  const [first, second] = rec.steps[0].clicks
  assert.ok(second.tMs - first.tMs >= 700, `clicks ${second.tMs - first.tMs} ms apart`)
})

test('a step id is used once per walk', async () => {
  const h = harness()
  const rec = new Recorder({ page: h.page, runDir: await mkdtemp(join(tmpdir(), 'capture-')), now: h.now })
  rec.start()
  await rec.step('open', 'Open', 'action', async () => {})
  await assert.rejects(rec.step('open', 'Open again', 'action', async () => {}), /step open: step ids must be unique/)
  assert.equal(rec.steps.length, 1)
})

test('type clicks the field, then types at a readable pace', async () => {
  const h = harness()
  const rec = new Recorder({ page: h.page, runDir: await mkdtemp(join(tmpdir(), 'capture-')), now: h.now, minClickGapMs: 0 })
  rec.start()
  await rec.step('search', 'Search', 'action', async () => {
    await rec.type(h.locator('q', { x: 0, y: 0, width: 200, height: 30 }), 'blue')
  })
  assert.deepEqual(h.events.filter((e) => !e.startsWith('screenshot')), ['trial q@1000', 'click q@1000', 'type blue'])
  assert.equal(rec.steps[0].clicks.length, 1)
})

test('type refuses a password field, and works only inside a step', async () => {
  const h = harness()
  const rec = new Recorder({ page: h.page, runDir: await mkdtemp(join(tmpdir(), 'capture-')), now: h.now })
  rec.start()
  const password = h.locator('pw', { x: 0, y: 0, width: 200, height: 30 }, { tagName: 'INPUT', type: 'password' })
  await assert.rejects(rec.type(password, 'x'), /outside a step/)
  await assert.rejects(
    rec.step('sign-in', 'Sign in', 'action', async () => rec.type(password, 'secret')),
    (error) => error instanceof CaptureRefusal && /password field is refused/.test(error.message)
  )
  assert.equal(h.events.some((e) => /^(trial|click|type) /.test(e)), false)
})
