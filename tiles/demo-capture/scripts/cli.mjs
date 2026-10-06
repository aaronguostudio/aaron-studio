// demo-capture: record a scripted walkthrough of a web app into a capture folder (contract 1) for
// the walkthrough renderer in ../aaron-video-gen. A project joins with demo-capture/config.mjs and
// demo-capture/walks/*.mjs; nothing app-specific lives in this tile. A presentation tool, not a
// test: a walk that breaks yields status "failed", and the renderer makes no video from it.
//
//   node scripts/cli.mjs --project <dir> --list
//   node scripts/cli.mjs sign-in --project <dir> --env <name>
//   node scripts/cli.mjs --project <dir> --env <name> --walk <name>
//
// Exit codes: 0 captured (or a learning run that reached its end), 1 the walk failed, 2 refused.
import { existsSync, realpathSync } from 'node:fs'
import { mkdir, mkdtemp, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  CaptureRefusal,
  RunGuard,
  acquireRunLock,
  assertLearnable,
  assertOutsideRepos,
  assertProdGoAhead,
  assertWriteGoAhead,
  parseArgs,
  usageText
} from './guards.mjs'
import {
  appRevision,
  describeProject,
  loadConfig,
  loadWalk,
  loadWalks,
  resolveParams,
  selectEnvironment
} from './project.mjs'
import { Recorder, VIEWPORT } from './recorder.mjs'
import {
  SignedOut,
  captureRoot,
  defaultRunDir,
  deleteState,
  ensurePrivateDir,
  hasState,
  runWithSession,
  saveState,
  sessionPaths,
  signIn
} from './session.mjs'

const TILE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const LEARNING_FAILURE = 'Learning run, no video.'
const SECOND_TAB =
  'The walk opened a second tab, and a capture records one tab. Set sameTabLinks: true in the config if the app opens links in new tabs.'

const plain = (error) =>
  String(error?.message ?? error)
    .split('\n')[0]
    .replace(/\s+/g, ' ')
    .slice(0, 300)

// Whether this module is the script node was asked to run. Node resolves the main module through
// symlinks but leaves process.argv[1] as typed, so both are resolved before comparing.
export function isEntryPoint(moduleUrl, argv1 = process.argv[1]) {
  if (!argv1) return false
  try {
    return realpathSync(argv1) === realpathSync(fileURLToPath(moduleUrl))
  } catch {
    return false
  }
}

// Loaded only when a browser is needed, so --list and every refusal work before `npm ci`. The
// first line of the import error says what is wrong (a missing package, a broken install).
export async function loadChromium(importPlaywright = () => import('playwright')) {
  try {
    return (await importPlaywright()).chromium
  } catch (error) {
    throw new CaptureRefusal(`The engine's dependency is missing: run npm ci in ${TILE} (${plain(error)})`)
  }
}

const BROWSERS_FROM_CACHE = "Playwright's browsers come from the machine's cache; do not run npx playwright install."

// chromium.launch, where a browser that will not start is a refusal (exit 2) with one plain
// sentence, not a stack trace: the first line of why, and what not to do about it.
async function launchBrowser(chromium, options) {
  try {
    return await chromium.launch(options)
  } catch (error) {
    throw new CaptureRefusal(`The browser did not start (${plain(error)}). ${BROWSERS_FROM_CACHE}`)
  }
}

// A hosts entry as the guard reads it: "name", "name:port" or "[v6]:port", any letter case, with
// an optional trailing dot on the name.
const HOST_ENTRY = /^(?:\[([0-9a-f:.]+)\]|([a-z0-9_-]+(?:\.[a-z0-9_-]+)*))(?::[0-9]{1,5})?$/

// The browser's own DNS rules: while recording, no name resolves except the environment's hosts.
// This is the backstop behind the route guard, for what the route handler never sees: the hops of
// a redirect and the sockets of workers. IP literals such as 127.0.0.1 are treated as skipping the
// resolver, so the route guard stays the first line of defence, and the only one that judges a
// request by its method as well as its host.
// A learning run (--learn-hosts) must let unlisted hosts load, to list them, so it gets no rules.
// The names are the entries without their port, lower-cased, each once, in the order first listed.
export function launchArgs({ hosts, learning }) {
  if (learning) return []
  const names = new Set()
  for (const entry of hosts) {
    const match = typeof entry === 'string' ? HOST_ENTRY.exec(entry.trim().toLowerCase().replace(/\.(:[0-9]+)?$/, '$1')) : null
    // The entry is not repeated: a rule built from a bad one could say anything.
    if (!match) throw new CaptureRefusal('The environment lists a host that is not a host name, so no browser was started.')
    names.add(match[1] ?? match[2])
  }
  return [`--host-resolver-rules=${['MAP * ~NOTFOUND', ...[...names].map((name) => `EXCLUDE ${name}`)].join(' , ')}`]
}

// Runs in every page while recording when the config sets sameTabLinks: a link that would open a
// new tab (window.open, or a link with a target) opens in this tab instead.
function sameTabLinks() {
  window.open = function open(url) {
    if (url !== undefined && url !== null && String(url) !== '')
      window.location.assign(new URL(String(url), window.location.href).href)
    return window
  }
  document.addEventListener(
    'click',
    (event) => {
      const link = event.target instanceof Element ? event.target.closest('a[target]') : null
      if (link && link.target !== '_self') link.target = '_self'
    },
    true
  )
}

// Records one walk. Returns { signedOut: true } when the session turned out to be signed out
// (nothing is kept), else { capture, learned }. A browser that will not start is a CaptureRefusal.
export async function record({ chromium, config, env, walk, params, runDir, statePath, learnHosts, headed, log = console.log }) {
  let rec = null
  let signedOut = false
  let capture = null
  // The guard comes first: a policy it refuses leaves no temporary folder and no browser behind.
  const guard = new RunGuard(
    {
      hosts: env.hosts,
      readOnly: !walk.writes,
      forbidden: config.readOnlyForbidden ?? [],
      learning: learnHosts
    },
    { currentStep: () => rec?.attempting ?? null }
  )
  const videoDir = await mkdtemp(join(tmpdir(), 'demo-capture-video-'))
  let browser = null
  try {
    browser = await launchBrowser(chromium, {
      headless: !headed,
      args: launchArgs({ hosts: env.hosts, learning: learnHosts })
    })
    const context = await browser.newContext({
      viewport: VIEWPORT,
      recordVideo: { dir: videoDir, size: VIEWPORT },
      storageState: statePath,
      acceptDownloads: true,
      // A service worker's own fetches would bypass the network guard.
      serviceWorkers: 'block'
    })
    await context.route(() => true, (route) => guard.handleRoute(route))
    await context.routeWebSocket(() => true, (ws) => guard.handleWebSocket(ws))
    // A route handler sees the first URL of a request, never the hops of a redirect.
    context.on('request', (request) => {
      if (request.redirectedFrom()) guard.handleRedirectHop(request)
    })
    if (config.sameTabLinks) await context.addInitScript(sameTabLinks)
    const page = await context.newPage()
    context.on('page', (other) => {
      if (other === page) return
      guard.fail(SECOND_TAB)
      other.close().catch(() => undefined)
    })
    // Playwright dismisses dialogs by default, and a dismissed "leave this page?" keeps the walk
    // where it is. A capture always means to go on.
    page.on('dialog', (dialog) =>
      (dialog.type() === 'beforeunload' ? dialog.accept() : dialog.dismiss()).catch(() => undefined)
    )
    rec = new Recorder({ page, runDir })
    rec.start() // Playwright's video starts with the page.
    const manifest = {
      walk: walk.name,
      env: env.name,
      title: walk.title,
      ...(walk.description ? { subtitle: walk.description } : {}),
      appRevision: 'unknown',
      startedAt: new Date().toISOString(),
      viewport: { w: VIEWPORT.width, h: VIEWPORT.height }
    }
    let outcome = { status: 'passed' }
    const assertSignedIn = () => {
      if (config.isSignedOut(page.url())) throw new SignedOut()
    }
    try {
      // A sync flash: the screencast starts a few hundred ms after the page, so the logged clock
      // runs ahead of the video. Black, then white at a logged moment; the renderer finds that frame.
      await page.setContent('<body style="margin:0;height:100vh;background:#000"></body>')
      await page.waitForTimeout(700)
      const before = rec.ms()
      await page.evaluate(() => {
        document.body.style.background = '#fff'
      })
      manifest.sync = { tMs: Math.round((before + rec.ms()) / 2) }
      await page.waitForTimeout(300)
      // A freshly deployed app can take a while to answer its first request after a cold start.
      await page.goto(`${env.baseUrl}${walk.startPath}`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
      await page.waitForLoadState('networkidle').catch(() => undefined)
      guard.assertClean()
      assertSignedIn()
      manifest.appRevision = await appRevision(config, env.baseUrl)
      if (config.setup) await config.setup({ page, params, baseUrl: env.baseUrl })
      guard.assertClean()
      assertSignedIn()
      rec.onBeforeStep(async (stepId) => {
        guard.assertClean()
        assertSignedIn()
        if (config.beforeStep) await config.beforeStep({ page, params, stepId })
      })
      await walk.run({ page, rec, params, baseUrl: env.baseUrl })
      guard.assertClean()
      if (learnHosts) outcome = { status: 'failed', failedStep: null, failure: LEARNING_FAILURE }
    } catch (error) {
      signedOut = error instanceof SignedOut
      outcome = { status: 'failed', failedStep: error?.step ?? rec.attempting ?? null, failure: plain(error) }
    } finally {
      // Tokens can rotate on use, so the state is saved again whatever the outcome, unless the
      // run found it signed out (that state is deleted). A failed save is said without its cause:
      // the error could carry a piece of the state.
      if (!signedOut)
        await saveState(context, statePath).catch(() =>
          log('Could not save the session again; the next run may ask you to sign in.')
        )
      const video = page.video()
      await context.close()
      if (video && !signedOut) await video.saveAs(join(runDir, 'video.webm')).catch(() => undefined)
    }
    if (!signedOut) {
      // A capture never says passed without its video, whatever went wrong with saving it.
      if (outcome.status === 'passed' && !existsSync(join(runDir, 'video.webm')))
        outcome = { status: 'failed', failedStep: null, failure: 'The recording was not saved.' }
      capture = await rec.finish(manifest, outcome)
    }
  } finally {
    try {
      await browser?.close()
    } finally {
      await rm(videoDir, { recursive: true, force: true })
    }
  }
  return signedOut ? { signedOut: true } : { capture, learned: guard.learned() }
}

function report({ capture, learned }, { runDir, env, learnHosts, log }) {
  if (learnHosts) {
    const complete = capture.failure === LEARNING_FAILURE
    log(`\nLearning run (no video): ${runDir}`)
    if (learned.unlisted.length)
      log(`Hosts the walk used that are not in environments.${env.name}.hosts:\n${learned.unlisted.map((h) => `  ${h}`).join('\n')}`)
    else log(`Every host the walk used is already in environments.${env.name}.hosts.`)
    if (learned.refused.length)
      log(`Requests refused because the walk is read-only:\n${learned.refused.map((r) => `  ${r}`).join('\n')}`)
    log('Add a host to the config only after a person approves it.')
    if (!complete) log(`The walk stopped early, so these lists may be incomplete: ${capture.failure}`)
    return complete ? 0 : 1
  }
  if (capture.status === 'passed') {
    log(`\nCaptured: ${runDir}`)
    return 0
  }
  log(`\nFAILED: ${runDir}`)
  log(`  ${capture.failedStep ? `at step "${capture.failedStep}"` : 'before the first step'}: ${capture.failure}`)
  log('  No video should be made from this capture.')
  return 1
}

// Returns the exit code. `chromium` stands in for Playwright's chromium (the tests hand in a fake
// one); the command line never sets it, and without it Playwright is loaded when a browser is needed.
export async function main(
  argv = process.argv.slice(2),
  { root = captureRoot(), log = console.log, error = console.error, chromium: injected } = {}
) {
  let args
  try {
    args = parseArgs(argv)
  } catch (refusal) {
    if (!(refusal instanceof CaptureRefusal)) throw refusal
    error(`demo-capture: ${refusal.message}\n\n${usageText()}`)
    return 2
  }
  if (args.command === 'help') {
    log(usageText())
    return 0
  }
  try {
    const project = resolve(args.project ?? process.cwd())
    const config = await loadConfig(project)
    if (args.command === 'list') {
      log(describeProject(config, await loadWalks(project)))
      return 0
    }
    const env = selectEnvironment(config, args.env)
    const session = sessionPaths(root, config.name, env.name)
    assertOutsideRepos(session.dir, 'The session folder')
    const signInWith = (chromium) => () =>
      signIn({
        // The same refusal when the sign-in window cannot open; its launch options are signIn's own.
        browserType: { launch: (options) => launchBrowser(chromium, options) },
        baseUrl: env.baseUrl,
        signInPath: config.signInPath,
        isSignedOut: config.isSignedOut,
        statePath: session.state,
        log
      })
    if (args.command === 'sign-in') {
      const chromium = injected ?? (await loadChromium())
      await ensurePrivateDir(session.dir)
      const release = await acquireRunLock(session.lock)
      try {
        await signInWith(chromium)()
      } finally {
        await release()
      }
      return 0
    }
    const walk = await loadWalk(project, args.walk)
    const params = resolveParams(config.params, args.set)
    assertProdGoAhead(env, args.prodGoAhead)
    assertWriteGoAhead(env, walk, args.writeGoAhead)
    if (args.learnHosts) assertLearnable(env, walk)
    const runDir = resolve(args.out ?? defaultRunDir(root, config.name, walk.name))
    assertOutsideRepos(runDir, 'The run folder')
    if (existsSync(runDir) && (await readdir(runDir)).length)
      throw new CaptureRefusal(`${runDir} is not empty; pick another --out`)
    const chromium = injected ?? (await loadChromium())
    await ensurePrivateDir(session.dir)
    const release = await acquireRunLock(session.lock)
    try {
      await mkdir(runDir, { recursive: true })
      if (env.production) log(`Production run on ${env.baseUrl}, with the go-ahead given for this run.`)
      const result = await runWithSession({
        stateExists: () => hasState(session.state),
        promptSignIn: signInWith(chromium),
        record: () =>
          record({
            chromium,
            config,
            env,
            walk,
            params,
            runDir,
            statePath: session.state,
            learnHosts: args.learnHosts,
            headed: args.headed,
            log
          }),
        dropState: () => deleteState(session.state),
        resetRunDir: async () => {
          await rm(runDir, { recursive: true, force: true })
          await mkdir(runDir, { recursive: true })
        },
        log
      })
      return report(result, { runDir, env, learnHosts: args.learnHosts, log })
    } finally {
      await release()
    }
  } catch (refusal) {
    if (!(refusal instanceof CaptureRefusal)) throw refusal
    error(`demo-capture: ${refusal.message}`)
    return 2
  }
}

if (isEntryPoint(import.meta.url)) process.exit(await main())
