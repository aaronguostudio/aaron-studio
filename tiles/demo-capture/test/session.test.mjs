import assert from 'node:assert/strict'
import { mkdtempSync } from 'node:fs'
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { CaptureRefusal } from '../scripts/guards.mjs'
import {
  SIGNED_IN_STABLE_MS,
  SIGN_IN_TIMEOUT_MS,
  captureRoot,
  defaultRunDir,
  deleteState,
  ensurePrivateDir,
  hasState,
  isSignedInAt,
  runWithSession,
  saveState,
  sessionPaths,
  signIn,
  SignedOut,
  waitUntilSignedIn
} from '../scripts/session.mjs'

const rejects = (promise, pattern) =>
  assert.rejects(promise, (e) => e instanceof CaptureRefusal && pattern.test(e.message))
const mode = async (path) => (await stat(path)).mode & 0o777
const isSignedOut = (url) => new URL(url).pathname.startsWith('/login')
const ORIGIN = 'https://app.example.com'

test('sessions live in ~/.demo-capture/<name>/<env>/, and a test can move the root', () => {
  assert.equal(captureRoot({ env: {}, home: '/home/me' }), join('/home/me', '.demo-capture'))
  assert.equal(captureRoot({ env: { DEMO_CAPTURE_HOME: '/tmp/x/../y' }, home: '/home/me' }), '/tmp/y')
  assert.deepEqual(sessionPaths('/r', 'my-app', 'dev'), {
    dir: join('/r', 'my-app', 'dev'),
    state: join('/r', 'my-app', 'dev', 'state.json'),
    lock: join('/r', 'my-app', 'dev', 'lock')
  })
  assert.equal(
    defaultRunDir('/r', 'my-app', 'tour', new Date(2026, 9, 5, 9, 7, 3)),
    join('/r', 'my-app', 'runs', '20261005-090703-tour')
  )
  assert.equal(SIGN_IN_TIMEOUT_MS, 600_000)
  assert.equal(SIGNED_IN_STABLE_MS, 3000)
})

test('the session folder is 0700 even when it already exists', async () => {
  const dir = join(mkdtempSync(join(tmpdir(), 'session-')), 'my-app', 'dev')
  await mkdir(dir, { recursive: true, mode: 0o755 })
  await ensurePrivateDir(dir)
  assert.equal(await mode(dir), 0o700)
})

test('saveState writes the storage state, with IndexedDB, as a 0600 file in a 0700 folder', async () => {
  const state = join(mkdtempSync(join(tmpdir(), 'session-')), 'my-app', 'dev', 'state.json')
  const asked = []
  const context = { storageState: async (options) => (asked.push(options), { cookies: [{ name: 's' }], origins: [] }) }
  assert.equal(await hasState(state), false)
  await saveState(context, state)
  assert.deepEqual(asked, [{ indexedDB: true }])
  assert.deepEqual(JSON.parse(await readFile(state, 'utf8')), { cookies: [{ name: 's' }], origins: [] })
  assert.equal(await mode(state), 0o600)
  assert.equal(await mode(join(state, '..')), 0o700)
  assert.equal(await hasState(state), true)
  // No temporary file is left behind.
  assert.deepEqual(await readdir(join(state, '..')), ['state.json'])
  // A second save replaces it and keeps the mode.
  await writeFile(state, '{}', { mode: 0o644 })
  await saveState(context, state)
  assert.equal(await mode(state), 0o600)
  await deleteState(state)
  assert.equal(await hasState(state), false)
  await deleteState(state)
})

test('signed in means on the app origin and not signed out', () => {
  assert.equal(isSignedInAt('https://app.example.com/home', { origin: ORIGIN, isSignedOut }), true)
  assert.equal(isSignedInAt('https://app.example.com/login', { origin: ORIGIN, isSignedOut }), false)
  // An identity provider's page is not the app, whatever its path.
  assert.equal(isSignedInAt('https://id.example.net/authorize', { origin: ORIGIN, isSignedOut }), false)
  assert.equal(isSignedInAt('about:blank', { origin: ORIGIN, isSignedOut }), false)
  assert.equal(isSignedInAt('https://app.example.com/x', { origin: ORIGIN, isSignedOut: () => { throw new Error('bad') } }), false)
})

// A sign-in window whose URL follows a script over a clock the test drives.
function signInWindow(urlAt) {
  let clock = 0
  let closed = false
  return {
    page: { url: () => urlAt(clock), isClosed: () => closed },
    now: () => clock,
    sleep: async (ms) => {
      clock += ms
    },
    close: () => (closed = true),
    get clock() {
      return clock
    }
  }
}
const waitFor = (w, extra = {}) =>
  waitUntilSignedIn(w.page, { origin: ORIGIN, isSignedOut, now: w.now, sleep: w.sleep, ...extra })

test('sign-in waits until the app has been signed in for 3 s', async () => {
  const w = signInWindow((t) => (t < 5000 ? `${ORIGIN}/login` : `${ORIGIN}/home`))
  await waitFor(w)
  assert.equal(w.clock, 8000)
})

test('a bounce back to the sign-in page starts the 3 s again', async () => {
  const w = signInWindow((t) => (t < 1000 ? `${ORIGIN}/login` : t < 3000 ? `${ORIGIN}/home` : t < 4000 ? `${ORIGIN}/login` : `${ORIGIN}/home`))
  await waitFor(w)
  assert.equal(w.clock, 7000)
})

test('time on an identity provider does not count as signed in', async () => {
  const w = signInWindow((t) => (t < 6000 ? 'https://id.example.net/authorize' : `${ORIGIN}/home`))
  await waitFor(w)
  assert.equal(w.clock, 9000)
})

test('sign-in gives up after its timeout, or when the window is closed', async () => {
  const stuck = signInWindow(() => `${ORIGIN}/login`)
  await rejects(waitFor(stuck), /Nobody finished signing in within 10 minutes/)
  assert.equal(stuck.clock, SIGN_IN_TIMEOUT_MS)
  const closed = signInWindow(() => `${ORIGIN}/login`)
  closed.close()
  await rejects(waitFor(closed), /The sign-in window was closed/)
})

// A browser type whose browser, context and page only record what they are asked.
function fakeBrowserType() {
  const calls = []
  const page = {
    goto: async (url) => calls.push(`goto ${url}`),
    waitForLoadState: async () => calls.push('networkidle')
  }
  const context = { newPage: async () => page, storageState: async () => ({ cookies: [], origins: [] }) }
  const browser = {
    newContext: async (options) => (calls.push(`context ${options.viewport.width}x${options.viewport.height}`), context),
    close: async () => calls.push('close')
  }
  return { calls, page, browserType: { launch: async (options) => (calls.push(`launch headless=${options.headless}`), browser) } }
}

test('signIn opens a visible browser at the sign-in page, waits for the person, saves the state and closes', async () => {
  const { calls, page, browserType } = fakeBrowserType()
  const state = join(mkdtempSync(join(tmpdir(), 'session-')), 'my-app', 'dev', 'state.json')
  const logs = []
  let waited
  await signIn({
    browserType,
    baseUrl: `${ORIGIN}/app`,
    signInPath: '/login',
    isSignedOut,
    statePath: state,
    log: (line) => logs.push(line),
    wait: async (p, options) => (waited = { p, options })
  })
  assert.deepEqual(calls, ['launch headless=false', 'context 1440x900', `goto ${ORIGIN}/app/login`, 'networkidle', 'close'])
  assert.equal(waited.p, page)
  assert.deepEqual(waited.options, { origin: ORIGIN, isSignedOut })
  assert.equal(await mode(state), 0o600)
  assert.match(logs[0], /Sign in there yourself; nothing is typed for you/)
})

test('signIn closes the browser even when nobody signs in', async () => {
  const { calls, browserType } = fakeBrowserType()
  const state = join(mkdtempSync(join(tmpdir(), 'session-')), 'state.json')
  await rejects(
    signIn({ browserType, baseUrl: ORIGIN, signInPath: '/login', isSignedOut, statePath: state, log: () => {}, wait: async () => {
      throw new CaptureRefusal('Nobody finished signing in within 10 minutes.')
    } }),
    /Nobody finished/
  )
  assert.equal(calls.at(-1), 'close')
  assert.equal(await hasState(state), false)
})

// The steps runWithSession takes, recorded in order; `results` is what each record() returns.
function sessionSteps({ exists = true, results }) {
  const calls = []
  let n = 0
  return {
    calls,
    deps: {
      stateExists: async () => (calls.push('exists?'), exists),
      promptSignIn: async () => calls.push('sign-in'),
      record: async () => (calls.push('record'), results[n++]),
      dropState: async () => calls.push('drop-state'),
      resetRunDir: async () => calls.push('reset-run-dir'),
      log: (line) => calls.push(`log ${line}`)
    }
  }
}

test('a run with a saved state records once and signs nobody in', async () => {
  const s = sessionSteps({ results: [{ capture: 'ok' }] })
  assert.deepEqual(await runWithSession(s.deps), { capture: 'ok' })
  assert.deepEqual(s.calls, ['exists?', 'record'])
})

test('a run without a saved state signs in first', async () => {
  const s = sessionSteps({ exists: false, results: [{ capture: 'ok' }] })
  await runWithSession(s.deps)
  assert.deepEqual(s.calls, ['exists?', 'sign-in', 'record'])
})

test('signed out once: the state is deleted, the person signs in, and the walk is recorded once more', async () => {
  const s = sessionSteps({ results: [{ signedOut: true }, { capture: 'second' }] })
  assert.deepEqual(await runWithSession(s.deps), { capture: 'second' })
  assert.deepEqual(s.calls, [
    'exists?',
    'record',
    'log Sign-in needed: the saved session is signed out. Opening the sign-in window again.',
    'drop-state',
    'reset-run-dir',
    'sign-in',
    'record'
  ])
})

test('signed out twice stops the run; there is no loop', async () => {
  const s = sessionSteps({ results: [{ signedOut: true }, { signedOut: true }, { capture: 'never' }] })
  await rejects(runWithSession(s.deps), /Still signed out after signing in again/)
  assert.equal(s.calls.filter((c) => c === 'record').length, 2)
  assert.equal(s.calls.filter((c) => c === 'sign-in').length, 1)
})

test('SignedOut is its own kind of error, so a run can tell it from a walk failure', () => {
  const e = new SignedOut()
  assert.ok(e instanceof Error)
  assert.ok(!(e instanceof CaptureRefusal))
  assert.equal(e.name, 'SignedOut')
  assert.match(e.message, /Sign-in needed: the saved session is signed out/)
})
