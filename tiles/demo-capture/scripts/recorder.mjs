// tiles/demo-capture/scripts/recorder.mjs
// Writes a capture folder, contract version 1 (../../aaron-video-gen/references/walkthrough-capture.md):
//
//   <run>/capture.json   manifest: walk, env, title, viewport, status, sync (the black-to-white flash)
//   <run>/video.webm     the Playwright recording, exactly viewport-sized (saved by cli.mjs)
//   <run>/steps.json     ordered steps: caption, kind, times, clicks (centre + box), shot
//   <run>/shots/NN-<id>.png
//
// Times are ms from the video's first frame: start() is called right after context.newPage(),
// where Playwright starts recording. Playwright videos show no cursor, so every click is logged
// (with the clicked element's box) for the renderer to draw one. A step's shot is taken just
// before its first click, so the element to click is on it; a step with no clicks keeps the shot
// taken when it started. `wait` steps mark server work that the renderer fast-forwards.
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { assertTypable } from './guards.mjs'

export const CONTRACT_VERSION = 1
// Even sizes, as H.264 needs. 1440 keeps desktop layouts out of their collapsed breakpoints.
export const VIEWPORT = Object.freeze({ width: 1440, height: 900 })

const round = (n) => Math.round(n)

export class Recorder {
  // minClickGapMs paces the clicks, so the cursor drawn later has time to travel between them.
  constructor({ page, runDir, now = () => performance.now(), minClickGapMs = 700 }) {
    this.page = page
    this.minClickGapMs = minClickGapMs
    this.lastClickMs = -Infinity
    this.runDir = runDir
    this.now = now
    this.t0 = undefined
    this.steps = []
    this.ids = new Set()
    this.current = null
    this.attempting = null
    this.beforeStep = async () => {}
  }

  start() {
    this.t0 = this.now()
  }

  ms() {
    if (this.t0 === undefined)
      throw new Error('Recorder.start() must run right after context.newPage()')
    return round(this.now() - this.t0)
  }

  // Runs fn as one step. A guard set with onBeforeStep runs first, so every step re-checks it.
  async step(id, caption, kind, fn) {
    if (kind !== 'action' && kind !== 'wait')
      throw new Error(`step ${id}: kind must be action or wait`)
    if (this.ids.has(id)) throw new Error(`step ${id}: step ids must be unique within a walk`)
    this.ids.add(id)
    // Named before the guard runs, so a refusal is reported against the step it stopped.
    this.attempting = id
    await this.beforeStep(id)
    const index = this.steps.length + 1
    const step = { id, caption, kind, startMs: this.ms(), endMs: 0, clicks: [], shot: null }
    this.steps.push(step)
    this.current = step
    const shotPath = `shots/${String(index).padStart(2, '0')}-${id}.png`
    // Taken now and kept in memory; replaced by the pre-click shot if the step clicks anything.
    this.pending = { path: shotPath, buffer: await this.page.screenshot() }
    try {
      return await fn(this)
    } finally {
      step.endMs = Math.max(step.startMs, this.ms())
      if (!step.shot) await this.writeShot(this.pending.path, this.pending.buffer)
      this.current = null
    }
  }

  onBeforeStep(fn) {
    this.beforeStep = fn
  }

  async writeShot(path, buffer) {
    await mkdir(join(this.runDir, 'shots'), { recursive: true })
    await writeFile(join(this.runDir, path), buffer)
    this.current.shot = path
  }

  // Click a locator, logging where it is first. Works only inside step().
  async click(locator, options = {}) {
    if (!this.current) throw new Error('click() outside a step')
    await locator.scrollIntoViewIfNeeded()
    // A trial click waits until the element can take the click (not covered by a toast or an
    // overlay) without clicking, so the shot and the logged box show it as the reader will.
    await locator.click({ ...options, trial: true })
    const box = await locator.boundingBox()
    if (!box) throw new Error('The element to click is not visible')
    const gap = this.ms() - this.lastClickMs
    if (gap < this.minClickGapMs) await this.page.waitForTimeout(this.minClickGapMs - gap)
    if (!this.current.shot) await this.writeShot(this.pending.path, await this.page.screenshot())
    this.lastClickMs = this.ms()
    this.current.clicks.push({
      tMs: this.lastClickMs,
      x: round(box.x + box.width / 2),
      y: round(box.y + box.height / 2),
      box: { x: round(box.x), y: round(box.y), w: round(box.width), h: round(box.height) }
    })
    await locator.click(options)
  }

  // Click a field, then type into it at a pace a viewer can follow. Never a password field:
  // sign-in is always done by a person.
  async type(locator, text) {
    if (!this.current) throw new Error('type() outside a step')
    assertTypable(await locator.evaluate((el) => (el.tagName === 'INPUT' ? String(el.type) : '')))
    await this.click(locator)
    await locator.pressSequentially(text, { delay: 35 })
  }

  async finish(manifest, { status, failedStep, failure } = { status: 'passed' }) {
    const capture = {
      version: CONTRACT_VERSION,
      ...manifest,
      status,
      ...(status === 'failed'
        ? { failedStep: failedStep ?? null, failure: failure ?? 'The walk stopped.' }
        : {})
    }
    await mkdir(this.runDir, { recursive: true })
    await writeFile(join(this.runDir, 'capture.json'), JSON.stringify(capture, null, 2) + '\n')
    await writeFile(join(this.runDir, 'steps.json'), JSON.stringify(this.steps, null, 2) + '\n')
    return capture
  }
}
