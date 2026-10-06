// record() against a browser that is only a record of what it was asked to do: no Playwright, so
// these run wherever Node does. They cover what an end-to-end run cannot make happen (a recording
// that is not saved, a session that cannot be saved, a browser that will not start) and how the
// run is wired to the network guard.
import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'
import { CaptureRefusal } from '../scripts/guards.mjs'
import { sessionPaths } from '../scripts/session.mjs'
import { LEARNING_FAILURE, main, record } from '../scripts/cli.mjs'

// record() makes its temporary video folder in os.tmpdir(), which follows TMPDIR. Pointing TMPDIR at
// a folder of this file's own makes "nothing was left behind" a statement about this file alone.
const SAVED_TMPDIR = process.env.TMPDIR
const TMP = mkdtempSync(join(tmpdir(), 'demo-capture-record-tmp-'))
process.env.TMPDIR = TMP
after(() => {
  if (SAVED_TMPDIR === undefined) delete process.env.TMPDIR
  else process.env.TMPDIR = SAVED_TMPDIR
})
const videoFolders = () => readdirSync(TMP).filter((name) => name.startsWith('demo-capture-video-'))

const CACHE_SENTENCE = "Playwright's browsers come from the machine's cache; do not run npx playwright install."

// A fake Playwright chromium. What it was asked is kept on the returned object.
//   videoSaved   false: video.saveAs writes nothing; 'throws': it rejects
//   stateError   what context.storageState rejects with
//   launchError  what chromium.launch rejects with
function fakeChromium({ videoSaved = true, stateError, launchError } = {}) {
  const fake = {
    launches: [],
    handlers: {},
    contexts: 0,
    stateSaves: 0,
    videoSaves: 0,
    browserClosed: false,
    url: 'about:blank'
  }
  const video = {
    async saveAs(path) {
      fake.videoSaves++
      if (videoSaved === 'throws') throw new Error('The video was not finished.')
      if (videoSaved) writeFileSync(path, 'video')
    }
  }
  const page = {
    on() {},
    async setContent() {},
    async waitForTimeout() {},
    async evaluate() {},
    async goto(url) {
      fake.url = url
      fake.visited?.(url)
    },
    async waitForLoadState() {},
    url: () => fake.url,
    // The fixture adapter's setup waits for a heading; this page has it at once.
    getByRole: () => ({ waitFor: async () => {} }),
    async screenshot() {
      return Buffer.from('shot')
    },
    video: () => video
  }
  const context = {
    async route() {},
    async routeWebSocket() {},
    async addInitScript() {},
    on(event, handler) {
      fake.handlers[event] = handler
    },
    async newPage() {
      return page
    },
    async storageState() {
      fake.stateSaves++
      if (stateError) throw stateError
      return { cookies: [], origins: [] }
    },
    async close() {}
  }
  const browser = {
    async newContext(options) {
      fake.contexts++
      fake.contextOptions = options
      return context
    },
    async close() {
      fake.browserClosed = true
    }
  }
  fake.page = page
  fake.chromium = {
    async launch(options) {
      fake.launches.push(options)
      if (launchError) throw launchError
      return browser
    }
  }
  return fake
}

const lookStep = async ({ rec }) => {
  await rec.step('look', 'Look at the page', 'action', async () => {})
}

// One run of record() with fresh folders; `overrides` replaces any argument.
async function go(fake, overrides = {}) {
  const base = mkdtempSync(join(tmpdir(), 'demo-capture-record-run-'))
  const runDir = join(base, 'run')
  mkdirSync(runDir)
  const statePath = join(base, 'session', 'state.json')
  const lines = []
  const { walk: walkOverrides, config: configOverrides, ...rest } = overrides
  const args = {
    chromium: fake.chromium,
    config: { isSignedOut: (url) => new URL(url).pathname.startsWith('/login'), ...configOverrides },
    env: { name: 'local', baseUrl: 'http://127.0.0.1:9', production: false, hosts: ['127.0.0.1'] },
    walk: { name: 'look', title: 'Look', writes: false, startPath: '/home', run: lookStep, ...walkOverrides },
    params: {},
    runDir,
    statePath,
    learnHosts: false,
    headed: false,
    log: (line) => lines.push(line),
    ...rest
  }
  const result = await record(args)
  return { result, lines, runDir, statePath }
}

const readCapture = (runDir) => JSON.parse(readFileSync(join(runDir, 'capture.json'), 'utf8'))

test('a walk that ran and whose video was saved is a passed capture, and nothing is left running', async () => {
  const fake = fakeChromium()
  const { result, runDir, statePath } = await go(fake)
  assert.equal(result.capture.status, 'passed')
  assert.equal(readCapture(runDir).status, 'passed')
  assert.ok(existsSync(join(runDir, 'video.webm')))
  assert.ok(existsSync(statePath), 'the session is saved again')
  assert.equal(fake.browserClosed, true)
  assert.deepEqual(videoFolders(), [])
})

test('a walk that ran but whose video was not saved is a failed capture, never a passed one', async () => {
  for (const videoSaved of [false, 'throws']) {
    const fake = fakeChromium({ videoSaved })
    const { result, runDir } = await go(fake)
    const expected = { status: 'failed', failedStep: null, failure: 'The recording was not saved.' }
    assert.equal(fake.videoSaves, 1)
    assert.equal(result.capture.status, expected.status, `videoSaved ${videoSaved}`)
    assert.equal(result.capture.failedStep, expected.failedStep)
    assert.equal(result.capture.failure, expected.failure)
    const onDisk = readCapture(runDir)
    assert.equal(onDisk.status, expected.status)
    assert.equal(onDisk.failure, expected.failure)
    assert.equal(existsSync(join(runDir, 'video.webm')), false)
  }
})

test('a missing video does not replace the reason a walk already failed', async () => {
  const fake = fakeChromium({ videoSaved: false })
  const { result } = await go(fake, {
    walk: {
      run: async ({ rec }) => {
        await rec.step('look', 'Look at the page', 'action', async () => {
          throw new Error('The heading never appeared')
        })
      }
    }
  })
  assert.equal(result.capture.status, 'failed')
  assert.equal(result.capture.failedStep, 'look')
  assert.equal(result.capture.failure, 'The heading never appeared')
  assert.equal(fake.browserClosed, true)
  assert.deepEqual(videoFolders(), [])
})

test('a learning run keeps its own failure line, which the report reads, whatever became of the video', async () => {
  for (const videoSaved of [true, false]) {
    const { result } = await go(fakeChromium({ videoSaved }), { learnHosts: true })
    assert.equal(result.capture.failure, LEARNING_FAILURE, `videoSaved ${videoSaved}`)
    assert.equal(result.capture.failedStep, null)
  }
})

test('a run found signed out keeps nothing: no capture, no video, no session saved again', async () => {
  const fake = fakeChromium()
  const { result, runDir, statePath } = await go(fake, { walk: { startPath: '/login' } })
  assert.deepEqual(result, { signedOut: true })
  assert.equal(existsSync(join(runDir, 'capture.json')), false)
  assert.equal(existsSync(join(runDir, 'video.webm')), false)
  assert.equal(fake.stateSaves, 0)
  assert.equal(fake.videoSaves, 0)
  assert.equal(existsSync(statePath), false)
  assert.equal(fake.browserClosed, true)
  assert.deepEqual(videoFolders(), [])
})

test('a session that cannot be saved again is said in one line that holds none of the error', async () => {
  const fake = fakeChromium({ stateError: new Error('cookie SESSION-SECRET-VALUE could not be written') })
  const { result, lines, statePath } = await go(fake)
  assert.deepEqual(lines, ['Could not save the session again; the next run may ask you to sign in.'])
  assert.equal(result.capture.status, 'passed', 'the walk itself did not fail')
  assert.equal(existsSync(statePath), false)
})

test('a browser that will not start is a refusal naming the first line of why, and leaves no temp folder', async () => {
  const launchError = new Error(
    "browserType.launch: Executable doesn't exist at /cache/chromium-1234\n╔═══════╗\n║ Looks like Playwright was just installed or updated. ║"
  )
  const fake = fakeChromium({ launchError })
  await assert.rejects(go(fake), (error) => {
    assert.ok(error instanceof CaptureRefusal, String(error))
    assert.equal(
      error.message,
      `The browser did not start (browserType.launch: Executable doesn't exist at /cache/chromium-1234). ${CACHE_SENTENCE}`
    )
    return true
  })
  assert.equal(fake.launches.length, 1)
  assert.equal(fake.contexts, 0)
  assert.deepEqual(videoFolders(), [])
})

test('a network policy the guard refuses is refused before a temp folder or a browser exists', async () => {
  const fake = fakeChromium()
  // learning needs a read-only walk: a policy that cannot be guarded with
  await assert.rejects(go(fake, { learnHosts: true, walk: { writes: true } }), (error) => {
    assert.ok(error instanceof CaptureRefusal, String(error))
    assert.match(error.message, /read-only/)
    return true
  })
  assert.equal(fake.launches.length, 0)
  assert.deepEqual(videoFolders(), [])
})

test('the browser starts headless with every name outside the environment unresolvable, headed on request', async () => {
  const fake = fakeChromium()
  await go(fake)
  await go(fake, { headed: true })
  assert.deepEqual(fake.launches, [
    { headless: true, args: ['--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE 127.0.0.1'] },
    { headless: false, args: ['--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE 127.0.0.1'] }
  ])
})

test('a learning run starts a browser that resolves every name, so unlisted hosts load and are listed', async () => {
  const fake = fakeChromium()
  await go(fake, { learnHosts: true })
  assert.deepEqual(fake.launches, [{ headless: true, args: [] }])
})

test('a redirect hop to an unlisted host fails the run at the step it happened in', async () => {
  const fake = fakeChromium()
  const hop = (url, from) => ({
    redirectedFrom: () => from,
    method: () => 'GET',
    url: () => url,
    postData: () => null
  })
  const { result } = await go(fake, {
    walk: {
      run: async ({ rec }) => {
        await rec.step('look', 'Look at the page', 'action', async () => {
          assert.equal(typeof fake.handlers.request, 'function', 'the context reports requests to the guard')
          fake.handlers.request(hop('https://elsewhere.example.net/next', { redirect: true }))
        })
      }
    }
  })
  assert.equal(result.capture.status, 'failed')
  assert.equal(result.capture.failedStep, 'look')
  assert.equal(
    result.capture.failure,
    "GET elsewhere.example.net/next was refused: elsewhere.example.net is not in this environment's hosts."
  )
})

test('a request that is not a redirect hop is left to the route handler, and a hop to a listed host is fine', async () => {
  const fake = fakeChromium()
  const request = (url, from) => ({ redirectedFrom: () => from, method: () => 'GET', url: () => url, postData: () => null })
  const { result } = await go(fake, {
    walk: {
      run: async ({ rec }) => {
        await rec.step('look', 'Look at the page', 'action', async () => {
          fake.handlers.request(request('https://elsewhere.example.net/first', null))
          fake.handlers.request(request('http://127.0.0.1:9/next', { redirect: true }))
        })
      }
    }
  })
  assert.equal(result.capture.status, 'passed', result.capture.failure)
})

test('the hooks get the context the spec names, in the order the spec names', async () => {
  const fake = fakeChromium()
  const calls = []
  fake.visited = (url) => calls.push(`goto ${url}`)
  const keys = (value) => Object.keys(value).sort().join(',')
  const { result } = await go(fake, {
    params: { heading: 'Details' },
    config: {
      revision: async (context) => {
        calls.push(`revision ${keys(context)}`)
        return 'fixture-1'
      },
      setup: async (context) => {
        calls.push(`setup ${keys(context)}`)
      },
      beforeStep: async (context) => {
        calls.push(`beforeStep ${keys(context)} ${context.stepId}`)
      }
    },
    walk: {
      run: async (context) => {
        calls.push(`walk ${keys(context)}`)
        await context.rec.step('look', 'Look at the page', 'action', async () => {
          calls.push('step look')
        })
      }
    }
  })
  assert.deepEqual(calls, [
    'goto http://127.0.0.1:9/home',
    'revision baseUrl',
    'setup baseUrl,page,params',
    'walk baseUrl,page,params,rec',
    'beforeStep page,params,stepId look',
    'step look'
  ])
  assert.equal(result.capture.appRevision, 'fixture-1')
})

// The whole command on the fixture project, a saved session and a fake browser: what record() says
// has to come out of main() as an exit code and lines on the screen.
async function runMain(fake) {
  const root = mkdtempSync(join(tmpdir(), 'demo-capture-record-main-'))
  const session = sessionPaths(root, 'fixture-app', 'local')
  mkdirSync(session.dir, { recursive: true })
  writeFileSync(session.state, '{}')
  const lines = []
  const code = await main(['--project', join(import.meta.dirname, 'fixture'), '--env', 'local', '--walk', 'outside-host'], {
    root,
    chromium: fake.chromium,
    log: (line) => lines.push(line),
    error: (line) => lines.push(line)
  })
  return { code, output: lines.join('\n') }
}

test('main exits 1 and says FAILED for a walk whose video was not saved', async () => {
  const { code, output } = await runMain(fakeChromium({ videoSaved: false }))
  assert.equal(code, 1, output)
  assert.match(output, /\nFAILED: .*\n {2}before the first step: The recording was not saved\.\n {2}No video should be made from this capture\./)
})

test('main prints the line about a session that could not be saved again, and the walk still passes', async () => {
  const fake = fakeChromium({ stateError: new Error('cookie SESSION-SECRET-VALUE could not be written') })
  const { code, output } = await runMain(fake)
  assert.equal(code, 0, output)
  assert.match(output, /^Could not save the session again; the next run may ask you to sign in\.$/m)
  assert.match(output, /\nCaptured: /)
  assert.doesNotMatch(output, /SESSION-SECRET-VALUE/)
})
