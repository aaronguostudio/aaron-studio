import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { CaptureRefusal } from '../scripts/guards.mjs'
import { sessionPaths } from '../scripts/session.mjs'
import { isEntryPoint, launchArgs, loadChromium, main } from '../scripts/cli.mjs'

const PROJECT = join(import.meta.dirname, 'fixture')

// The fixture's walks, read from its folder so that adding a walk there changes no number here.
const WALK_NAMES = readdirSync(join(PROJECT, 'demo-capture', 'walks'))
  .filter((file) => file.endsWith('.mjs'))
  .map((file) => file.slice(0, -'.mjs'.length))
// --list pads every walk name to the longest one (at least 4 wide), then adds two spaces.
const NAME_WIDTH = Math.max(4, ...WALK_NAMES.map((name) => name.length))
const gap = (name) => NAME_WIDTH - name.length + 2

// Runs main() with its output captured; none of these reach a browser.
async function cli(args) {
  const lines = []
  const root = mkdtempSync(join(tmpdir(), 'demo-capture-cli-'))
  const code = await main(args, { root, log: (line) => lines.push(line), error: (line) => lines.push(line) })
  return { code, output: lines.join('\n') }
}

test('--list shows the walks, the environments and the params without opening a browser', async () => {
  assert.ok(WALK_NAMES.length >= 2, 'the plural below needs at least two fixture walks')
  const { code, output } = await cli(['--project', PROJECT, '--list'])
  assert.equal(code, 0, output)
  assert.match(output, new RegExp(`^fixture-app: ${WALK_NAMES.length} walks \\(--walk\\)`))
  assert.match(output, new RegExp(`\\n {2}tour {${gap('tour')}}read-only {2}Fixture tour\\n`))
  assert.match(output, new RegExp(`\\n {2}adds-item {${gap('adds-item')}}writes {5}Add an item\\n`))
  assert.match(output, /\n {2}live {2}https:\/\/app\.example\.com {2}production: every run needs --prod-go-ahead/)
  assert.match(output, /\n {2}heading {2}default "Details"/)
})

test('--help prints the usage; a bad argument prints it with the reason and exits 2', async () => {
  const help = await cli(['--help'])
  assert.equal(help.code, 0)
  assert.match(help.output, /--learn-hosts/)
  const bad = await cli(['--env'])
  assert.equal(bad.code, 2)
  assert.match(bad.output, /^demo-capture: --env needs a value\n\ndemo-capture: record/)
})

test('every refusal exits 2 with one plain sentence, before any browser opens', async () => {
  const base = mkdtempSync(join(tmpdir(), 'demo-capture-repo-'))
  mkdirSync(join(base, 'repo', '.git'), { recursive: true })
  const notEmpty = join(base, 'used')
  mkdirSync(notEmpty)
  writeFileSync(join(notEmpty, 'capture.json'), '{}')
  const cases = [
    [['--project', join(base, 'nowhere'), '--list'], /has no demo-capture\/config\.mjs/],
    [['--project', PROJECT, '--env', 'uat', '--walk', 'tour'], /unknown --env "uat"; this project declares local, stage, live/],
    [['--project', PROJECT, '--env', 'local', '--walk', 'missing'], /unknown walk "missing"/],
    [['--project', PROJECT, '--env', 'local', '--walk', '../config'], /walk names are lowercase/],
    [['--project', PROJECT, '--env', 'local', '--walk', 'tour', '--set', 'colour=red'], /unknown param "colour"; this project takes heading/],
    [['--project', PROJECT, '--env', 'live', '--walk', 'tour'], /live is a production environment: it needs --prod-go-ahead/],
    [['--project', PROJECT, '--env', 'stage', '--walk', 'adds-item'], /This walk writes, and stage needs a go-ahead/],
    [['--project', PROJECT, '--env', 'local', '--walk', 'adds-item', '--learn-hosts'], /--learn-hosts runs read-only walks only/],
    [['--project', PROJECT, '--env', 'live', '--walk', 'tour', '--prod-go-ahead', '--learn-hosts'], /--learn-hosts is refused on live/],
    [['--project', PROJECT, '--env', 'local', '--walk', 'tour', '--out', join(base, 'repo', 'run')], /The run folder .* is inside the git working tree/],
    [['--project', PROJECT, '--env', 'local', '--walk', 'tour', '--out', notEmpty], /is not empty; pick another --out/]
  ]
  for (const [args, pattern] of cases) {
    const { code, output } = await cli(args)
    assert.equal(code, 2, `${args.join(' ')}\n${output}`)
    assert.match(output, pattern)
    assert.match(output, /^demo-capture: /)
  }
})

test('the session folder must be outside every repo too', async () => {
  const base = mkdtempSync(join(tmpdir(), 'demo-capture-repo-'))
  mkdirSync(join(base, '.git'))
  const lines = []
  const code = await main(['--project', PROJECT, '--env', 'local', '--walk', 'tour'], {
    root: join(base, 'sessions'),
    log: (line) => lines.push(line),
    error: (line) => lines.push(line)
  })
  assert.equal(code, 2)
  assert.match(lines.join('\n'), /The session folder .* is inside the git working tree/)
})

test('isEntryPoint compares the script and the module through symlinks', () => {
  assert.equal(isEntryPoint(import.meta.url, process.argv[1]), true)
  assert.equal(isEntryPoint(import.meta.url, ''), false)
  assert.equal(isEntryPoint(import.meta.url, '/no/such/file.mjs'), false)
  // The case this exists for: node was started through a link to the script.
  const folder = mkdtempSync(join(tmpdir(), 'demo-capture-link-'))
  const link = join(folder, 'linked.mjs')
  symlinkSync(fileURLToPath(import.meta.url), link)
  assert.equal(isEntryPoint(import.meta.url, link), true)
})

test('launchArgs leaves only the environment\'s own names resolvable, and nothing blocked while learning', () => {
  assert.deepEqual(launchArgs({ hosts: ['app.example.com', 'api.example.net'], learning: false }), [
    '--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE app.example.com , EXCLUDE api.example.net'
  ])
  assert.deepEqual(launchArgs({ hosts: ['app.example.com', 'api.example.net'], learning: true }), [])
  assert.deepEqual(launchArgs({ hosts: [], learning: false }), ['--host-resolver-rules=MAP * ~NOTFOUND'])
})

test('launchArgs names a host:port entry by its host, a host listed twice once, in the order first listed', () => {
  assert.deepEqual(
    launchArgs({
      hosts: ['b.example.com:8443', 'a.example.com', 'b.example.com', 'A.Example.com.', 'a.example.com:9000'],
      learning: false
    }),
    ['--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE b.example.com , EXCLUDE a.example.com']
  )
  assert.deepEqual(launchArgs({ hosts: ['[::1]:4100', 'localhost:4100'], learning: false }), [
    '--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE ::1 , EXCLUDE localhost'
  ])
})

test('launchArgs refuses an entry that is not a host name, so no rule is built from it', () => {
  for (const entry of ['app.example.com , MAP * evil.example.net', 'a b', '', 'app.example.com:99999x', 5, null]) {
    assert.throws(
      () => launchArgs({ hosts: ['app.example.com', entry], learning: false }),
      (error) => {
        assert.ok(error instanceof CaptureRefusal, String(entry))
        assert.doesNotMatch(error.message, /evil/)
        return true
      },
      String(entry)
    )
  }
})

test('a missing dependency says to run npm ci, and keeps the first line of the import error only', async () => {
  const importer = async () => {
    throw new Error("Cannot find package 'playwright' imported from /x/cli.mjs\n    at somewhere (/x/y.mjs:1:1)")
  }
  await assert.rejects(loadChromium(importer), (error) => {
    assert.ok(error instanceof CaptureRefusal)
    assert.match(
      error.message,
      /^The engine's dependency is missing: run npm ci in \S+ \(Cannot find package 'playwright' imported from \/x\/cli\.mjs\)$/
    )
    return true
  })
  const chromium = { launch() {} }
  assert.equal(await loadChromium(async () => ({ chromium })), chromium)
})

// A chromium that cannot start, handed to main() so that no real browser is involved.
const broken = {
  async launch() {
    throw new Error("browserType.launch: Executable doesn't exist at /cache/chromium-1234\nLooks like Playwright was just installed")
  }
}
const NOT_STARTED = /^demo-capture: The browser did not start \(browserType\.launch: Executable doesn't exist at \/cache\/chromium-1234\)\. Playwright's browsers come from the machine's cache; do not run npx playwright install\.$/

test('sign-in with a browser that will not start exits 2 with one sentence and releases the lock', async () => {
  const root = mkdtempSync(join(tmpdir(), 'demo-capture-cli-'))
  const lines = []
  const code = await main(['sign-in', '--project', PROJECT, '--env', 'local'], {
    root,
    chromium: broken,
    log: (line) => lines.push(line),
    error: (line) => lines.push(line)
  })
  assert.equal(code, 2, lines.join('\n'))
  assert.equal(lines.length, 1)
  assert.match(lines[0], NOT_STARTED)
  assert.equal(existsSync(sessionPaths(root, 'fixture-app', 'local').lock), false)
})

test('a recording with a browser that will not start exits 2 with the same sentence, and releases the lock', async () => {
  const root = mkdtempSync(join(tmpdir(), 'demo-capture-cli-'))
  const session = sessionPaths(root, 'fixture-app', 'local')
  mkdirSync(session.dir, { recursive: true })
  writeFileSync(session.state, '{}') // a saved session, so the run goes straight to recording
  const lines = []
  const code = await main(['--project', PROJECT, '--env', 'local', '--walk', 'outside-host'], {
    root,
    chromium: broken,
    log: (line) => lines.push(line),
    error: (line) => lines.push(line)
  })
  assert.equal(code, 2, lines.join('\n'))
  assert.equal(lines.length, 1)
  assert.match(lines[0], NOT_STARTED)
  assert.equal(existsSync(session.lock), false)
})
