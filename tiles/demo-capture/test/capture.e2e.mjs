// End to end (npm run test:e2e): the real CLI drives a headless Chromium through the fixture
// app on 127.0.0.1, and the walkthrough renderer's own validator checks the folder it writes.
// Needs `npm ci` here (Playwright; its Chromium comes from the machine's cache), ffprobe, and
// npx (for bun).
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { after, before, test } from 'node:test'
import { chromium } from 'playwright'
import { launchArgs } from '../scripts/cli.mjs'
import { saveState, sessionPaths } from '../scripts/session.mjs'
import { FIXTURE_LOGIN, startFixture } from './fixture/server.mjs'

const TILE = resolve(import.meta.dirname, '..')
const CLI = join(TILE, 'scripts', 'cli.mjs')
const PROJECT = join(TILE, 'test', 'fixture')
const RENDERER = resolve(TILE, '..', 'aaron-video-gen', 'scripts', 'walkthrough', 'render-walkthrough.ts')

let app
let root

// Async on purpose: the fixture server runs in this process and must keep answering.
function run(command, args, env = {}) {
  return new Promise((done, fail) => {
    const child = spawn(command, args, { env: { ...process.env, ...env } })
    let output = ''
    child.stdout.on('data', (chunk) => (output += chunk))
    child.stderr.on('data', (chunk) => (output += chunk))
    const timer = setTimeout(() => child.kill('SIGKILL'), 120_000)
    child.on('error', fail)
    child.on('close', (code) => {
      clearTimeout(timer)
      done({ code, output })
    })
  })
}

const runCapture = (args) =>
  run(process.execPath, [CLI, '--project', PROJECT, ...args], { DEMO_CAPTURE_HOME: root, DEMO_CAPTURE_FIXTURE_URL: app.url })
const renderDryRun = (dir) => run('npx', ['-y', 'bun', RENDERER, dir, '--dry-run'])
const outDir = (name) => join(root, 'out', name)
const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))

// The requests the fixture received since `before` (a hostCounts() snapshot), by Host header. The
// fixture counts what reached it, so this is what got past the browser's own DNS rules.
function receivedSince(before) {
  const seen = {}
  for (const [host, count] of Object.entries(app.hostCounts()))
    if (count > (before[host] ?? 0)) seen[host] = count - (before[host] ?? 0)
  return seen
}

// The renderer's own validator refuses a capture that did not pass: exit 3, and it says why.
async function assertRendererRefuses(dir) {
  const rendered = await renderDryRun(dir)
  assert.equal(rendered.code, 3, rendered.output)
  assert.match(rendered.output, /only a passed walk gets a video/)
}

// The test signs in by itself: a local fixture with test values. A real project's sign-in is
// always done by a person, in the window the engine opens.
async function seedSession() {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto(`${app.url}/login`)
    await page.getByLabel('User').fill(FIXTURE_LOGIN.username)
    await page.getByLabel('Password').fill(FIXTURE_LOGIN.password)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForURL(`${app.url}/home`)
    await saveState(context, sessionPaths(root, 'fixture-app', 'local').state)
  } finally {
    await browser.close()
  }
}

before(async () => {
  app = await startFixture()
  root = await mkdtemp(join(tmpdir(), 'demo-capture-e2e-'))
  await seedSession()
})

after(async () => {
  await app?.close()
  if (root) await rm(root, { recursive: true, force: true })
})

test('a read-only tour passes on the saved session, re-saves it, and passes the renderer validator', async () => {
  const { dir, state } = sessionPaths(root, 'fixture-app', 'local')
  const savedBefore = (await stat(state)).mtimeMs
  const result = await runCapture(['--env', 'local', '--walk', 'tour', '--out', outDir('tour')])
  assert.equal(result.code, 0, result.output)
  assert.match(result.output, /Captured: /)
  const capture = await readJson(join(outDir('tour'), 'capture.json'))
  assert.equal(capture.status, 'passed')
  assert.equal(capture.walk, 'tour')
  assert.equal(capture.env, 'local')
  assert.equal(capture.appRevision, 'fixture-1')
  assert.equal(capture.subtitle, 'Search, open the details, read them')
  assert.deepEqual(capture.viewport, { w: 1440, h: 900 })
  const steps = await readJson(join(outDir('tour'), 'steps.json'))
  assert.deepEqual(steps.map((step) => step.id), ['search', 'open', 'details'])
  assert.equal(steps[1].clicks.length, 1)
  assert.ok((await stat(state)).mtimeMs > savedBefore, 'the session is saved again after the run')
  assert.equal((await stat(state)).mode & 0o777, 0o600)
  assert.equal((await stat(dir)).mode & 0o777, 0o700)
  const rendered = await renderDryRun(outDir('tour'))
  assert.equal(rendered.code, 0, rendered.output)
  assert.match(rendered.output, /chapters: /)
})

test('a read-only walk that posts fails at that step, and the renderer refuses the folder', async () => {
  const result = await runCapture(['--env', 'local', '--walk', 'posts-while-read-only', '--out', outDir('posts')])
  assert.equal(result.code, 1, result.output)
  assert.match(result.output, /FAILED: .*\n {2}at step "add": POST 127\.0\.0\.1\/items was refused: this walk is read-only\./)
  const capture = await readJson(join(outDir('posts'), 'capture.json'))
  assert.equal(capture.status, 'failed')
  assert.equal(capture.failedStep, 'add')
  assert.equal(capture.failure, 'POST 127.0.0.1/items was refused: this walk is read-only.')
  await assertRendererRefuses(outDir('posts'))
})

test('a read the project lists as writing is refused', async () => {
  const result = await runCapture(['--env', 'local', '--walk', 'forbidden-read', '--out', outDir('recount')])
  assert.equal(result.code, 1, result.output)
  const capture = await readJson(join(outDir('recount'), 'capture.json'))
  assert.equal(capture.failedStep, 'recount')
  assert.equal(capture.failure, 'GET 127.0.0.1/items was refused: the project lists it as a read that writes.')
})

test('a request to an unlisted host fails the run before the first step', async () => {
  const result = await runCapture(['--env', 'local', '--walk', 'outside-host', '--out', outDir('outside')])
  assert.equal(result.code, 1, result.output)
  const capture = await readJson(join(outDir('outside'), 'capture.json'))
  assert.equal(capture.failedStep, null)
  assert.equal(capture.failure, "GET localhost/logo.svg was refused: localhost is not in this environment's hosts.")
})

test('--learn-hosts lets the unlisted host through, names it, and never yields a video', async () => {
  const result = await runCapture(['--env', 'local', '--walk', 'outside-host', '--learn-hosts', '--out', outDir('learn')])
  assert.equal(result.code, 0, result.output)
  assert.match(result.output, /Learning run \(no video\): /)
  assert.match(result.output, /Hosts the walk used that are not in environments\.local\.hosts:\n {2}localhost\n/)
  const capture = await readJson(join(outDir('learn'), 'capture.json'))
  assert.equal(capture.status, 'failed')
  assert.equal(capture.failure, 'Learning run, no video.')
  await assertRendererRefuses(outDir('learn'))
})

test('a walk that declares writes may post', async () => {
  const result = await runCapture(['--env', 'local', '--walk', 'adds-item', '--out', outDir('adds')])
  assert.equal(result.code, 0, result.output)
  assert.equal((await readJson(join(outDir('adds'), 'capture.json'))).status, 'passed')
})

// The redirect tests. A route handler sees only the first URL of a request, so a hop of a redirect
// is judged from the context's request events, and the browser's own DNS rules (launchArgs) stand
// behind that: the hop is on the wire already when the event fires. The fixture counts requests by
// their Host header, so these tests settle what each layer really does, not what it should do.
//
// Observed here (Chromium 1234 from Playwright 1.62.1, macOS, headless): with the rules on, a
// redirect to localhost or to an IP literal ([::1]) never reaches the server (the browser's own
// error is net::ERR_NAME_NOT_RESOLVED, asserted below for the literal). The browser does not
// resolve localhost by itself, and IP literals do not skip the rules; that is why a listed IP
// literal has to be excluded by name. With no rules (--learn-hosts) both reach the server.

test('a redirect to an unlisted host fails with the host lock sentence, and never reaches that host', async () => {
  const before = app.hostCounts()
  const result = await runCapture(['--env', 'local', '--walk', 'redirects-to-localhost', '--out', outDir('redirect')])
  assert.equal(result.code, 1, result.output)
  const sentence = "GET localhost/logo.svg was refused: localhost is not in this environment's hosts."
  assert.match(result.output, /FAILED: .*\n {2}at step "leave": GET localhost\/logo\.svg was refused: localhost is not in this environment's hosts\./)
  const capture = await readJson(join(outDir('redirect'), 'capture.json'))
  assert.equal(capture.status, 'failed')
  assert.equal(capture.failedStep, 'leave')
  assert.equal(capture.failure, sentence)
  assert.doesNotMatch(capture.failure, /ERR_|Timeout/)
  const seen = receivedSince(before)
  assert.ok(seen[`127.0.0.1:${app.port}`] >= 1, 'the link that redirects was reached')
  assert.equal(seen[`localhost:${app.port}`], undefined, `a request with Host localhost reached the server: ${JSON.stringify(seen)}`)
  await assertRendererRefuses(outDir('redirect'))
})

test('--learn-hosts follows the redirect, names localhost, and the request then does reach the server', async () => {
  const before = app.hostCounts()
  const result = await runCapture(['--env', 'local', '--walk', 'redirects-to-localhost', '--learn-hosts', '--out', outDir('redirect-learn')])
  assert.equal(result.code, 0, result.output)
  assert.match(result.output, /Hosts the walk used that are not in environments\.local\.hosts:\n {2}localhost\n/)
  const capture = await readJson(join(outDir('redirect-learn'), 'capture.json'))
  assert.equal(capture.failure, 'Learning run, no video.')
  // The contrast with the test above: without the rules the same hop gets through.
  assert.ok(receivedSince(before)[`localhost:${app.port}`] >= 1, 'a learning run lets the redirect through')
  await assertRendererRefuses(outDir('redirect-learn'))
})

test('a redirect to an IP literal that is not listed is refused the same way: the rules cover IP literals', async (t) => {
  if (!app.ipv6) return t.skip('this machine does not answer on [::1]')
  const before = app.hostCounts()
  const result = await runCapture(['--env', 'local', '--walk', 'redirects-to-loopback6', '--out', outDir('literal')])
  assert.equal(result.code, 1, result.output)
  const capture = await readJson(join(outDir('literal'), 'capture.json'))
  assert.equal(capture.failedStep, 'leave')
  assert.equal(capture.failure, "GET [::1]/logo.svg was refused: [::1] is not in this environment's hosts.")
  const seen = receivedSince(before)
  assert.equal(seen[`[::1]:${app.port}`], undefined, `a request with Host [::1] reached the server: ${JSON.stringify(seen)}`)
  const learn = await runCapture(['--env', 'local', '--walk', 'redirects-to-loopback6', '--learn-hosts', '--out', outDir('literal-learn')])
  assert.equal(learn.code, 0, learn.output)
  assert.match(learn.output, /Hosts the walk used that are not in environments\.local\.hosts:\n {2}\[::1\]\n/)
  // The server does answer on [::1]; only the rules kept the first run from it.
  assert.ok(receivedSince(before)[`[::1]:${app.port}`] >= 1, 'a learning run reaches [::1]')
})

test('launchArgs excludes a listed IPv6 literal by its bare address, not by its brackets', async (t) => {
  if (!app.ipv6) return t.skip('this machine does not answer on [::1]')
  const visit = async (hosts) => {
    const browser = await chromium.launch({ args: launchArgs({ hosts, learning: false }) })
    try {
      const page = await browser.newPage()
      await page.goto(`http://[::1]:${app.port}/logo.svg`)
      return 'loaded'
    } catch (error) {
      return String(error.message).split('\n')[0]
    } finally {
      await browser.close()
    }
  }
  assert.equal(await visit(['[::1]']), 'loaded')
  assert.match(await visit(['127.0.0.1']), /net::ERR_NAME_NOT_RESOLVED/)
})
