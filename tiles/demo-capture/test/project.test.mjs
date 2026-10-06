import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { CaptureRefusal } from '../scripts/guards.mjs'
import {
  appRevision,
  configProblems,
  describeProject,
  loadConfig,
  loadWalk,
  loadWalks,
  resolveParams,
  selectEnvironment,
  walkNames,
  walkProblems
} from '../scripts/project.mjs'

const rejects = (promise, pattern) =>
  assert.rejects(promise, (e) => e instanceof CaptureRefusal && pattern.test(e.message))

const valid = () => ({
  contract: 1,
  name: 'my-app',
  environments: {
    dev: { url: 'https://dev.example.com', production: false, hosts: ['dev.example.com', 'api-dev.example.com'] },
    prod: { url: 'https://example.com/', production: true, hosts: ['example.com'], writeGoAhead: false }
  },
  signInPath: '/login',
  isSignedOut: (url) => new URL(url).pathname.startsWith('/login'),
  params: { centre: { default: 'Main', describe: 'which site the demo uses' } },
  readOnlyForbidden: [{ method: 'GET', url: /\/items\?mode=recount/ }],
  sameTabLinks: true,
  setup: async () => {},
  beforeStep: async () => {},
  revision: async () => 'abc123'
})

// A config with one field changed (undefined removes it), and the problems it has.
const problemsWith = (change) => {
  const config = { ...valid(), ...change }
  for (const [key, value] of Object.entries(change)) if (value === undefined) delete config[key]
  return configProblems(config)
}
const envProblems = (env) => problemsWith({ environments: { dev: env } })
const devEnv = () => ({ url: 'https://dev.example.com', production: false, hosts: ['dev.example.com'] })

test('a complete config has no problems; the optional fields may be left out', () => {
  assert.deepEqual(configProblems(valid()), [])
  const minimal = valid()
  for (const key of ['params', 'readOnlyForbidden', 'sameTabLinks', 'setup', 'beforeStep', 'revision']) delete minimal[key]
  assert.deepEqual(configProblems(minimal), [])
})

test('the required fields are checked', () => {
  assert.deepEqual(configProblems(null), ['config.mjs must export default an object'])
  assert.deepEqual(configProblems([]), ['config.mjs must export default an object'])
  assert.deepEqual(problemsWith({ contract: 2 }), ['contract must be 1'])
  assert.deepEqual(problemsWith({ contract: undefined }), ['contract must be 1'])
  assert.deepEqual(problemsWith({ name: 'My App' }), ['name must be lowercase letters, digits and dashes'])
  assert.deepEqual(problemsWith({ name: undefined }), ['name must be lowercase letters, digits and dashes'])
  assert.deepEqual(problemsWith({ environments: {} }), ['environments must declare at least one environment'])
  assert.deepEqual(problemsWith({ environments: undefined }), ['environments must declare at least one environment'])
  assert.deepEqual(problemsWith({ signInPath: 'login' }), ['signInPath must be a path starting with /'])
  assert.deepEqual(problemsWith({ signInPath: undefined }), ['signInPath must be a path starting with /'])
  assert.deepEqual(problemsWith({ isSignedOut: '/login' }), ['isSignedOut must be a function of the page URL'])
})

test('an unknown field is refused, so a typo never drops a guard silently', () => {
  assert.deepEqual(problemsWith({ readOnlyForbiden: [] }), ['unknown field "readOnlyForbiden"'])
  assert.deepEqual(envProblems({ ...devEnv(), host: 'dev.example.com' }), ['environments.dev: unknown field "host"'])
})

test('each environment needs a URL, a production flag and its hosts, its own host among them', () => {
  assert.deepEqual(envProblems(devEnv()), [])
  assert.deepEqual(envProblems({ ...devEnv(), url: 'ftp://dev.example.com' }), ['environments.dev.url must be an http(s) URL'])
  assert.deepEqual(envProblems({ ...devEnv(), url: 'nope' }), ['environments.dev.url must be an http(s) URL'])
  assert.deepEqual(envProblems({ ...devEnv(), production: undefined }), ['environments.dev.production must be true or false'])
  assert.deepEqual(envProblems({ ...devEnv(), writeGoAhead: 'yes' }), ['environments.dev.writeGoAhead must be true or false'])
  assert.deepEqual(envProblems({ ...devEnv(), hosts: [] }), ['environments.dev.hosts must list every host the app uses'])
  assert.deepEqual(envProblems({ ...devEnv(), hosts: undefined }), ['environments.dev.hosts must list every host the app uses'])
  assert.deepEqual(envProblems({ ...devEnv(), hosts: ['dev.example.com', 'https://cdn.example.com'] }), [
    'environments.dev.hosts: "https://cdn.example.com" must be lowercase host names (no scheme, port or path)'
  ])
  assert.deepEqual(envProblems({ ...devEnv(), hosts: ['Dev.example.com'] }), [
    'environments.dev.hosts: "Dev.example.com" must be lowercase host names (no scheme, port or path)'
  ])
  assert.deepEqual(envProblems({ ...devEnv(), hosts: ['api.example.com'] }), [
    "environments.dev.hosts must include dev.example.com, the environment's own host"
  ])
  assert.deepEqual(problemsWith({ environments: { dev: 'https://dev.example.com' } }), ['environments.dev must be an object'])
})

// R-T5a: a host that passes here must also pass the network guard's grammar, so a bad entry fails
// before any browser opens. An empty label is refused: a double dot and a lone dot are not host
// names to the guard, and a trailing dot is one the guard would strip, which config does not do.
test('host names with an empty label are refused', () => {
  for (const host of ['a..b', 'dev.example.com.', '.'])
    assert.deepEqual(envProblems({ ...devEnv(), hosts: ['dev.example.com', host] }), [
      `environments.dev.hosts: "${host}" must be lowercase host names (no scheme, port or path)`
    ])
})

test('environment names follow the project name rule and never shadow the runs folder', () => {
  assert.deepEqual(problemsWith({ environments: { Dev: devEnv() } }), [
    'environments.Dev: environment names are lowercase letters, digits and dashes, and not "runs"'
  ])
  assert.deepEqual(problemsWith({ environments: { runs: devEnv() } }), [
    'environments.runs: environment names are lowercase letters, digits and dashes, and not "runs"'
  ])
})

test('params, rules, flags and hooks have their shapes', () => {
  assert.deepEqual(problemsWith({ params: [] }), ['params must be an object'])
  assert.deepEqual(problemsWith({ params: { centre: { default: 'Main' } } }), ['params.centre must be { default: string, describe: string }'])
  assert.deepEqual(problemsWith({ params: { centre: { default: 1, describe: 'x' } } }), ['params.centre must be { default: string, describe: string }'])
  assert.deepEqual(problemsWith({ params: { '1st': { default: '', describe: 'x' } } }), [
    'params.1st: names start with a letter and use letters, digits, - or _'
  ])
  assert.deepEqual(problemsWith({ readOnlyForbidden: { method: 'GET' } }), ['readOnlyForbidden must be a list of { method, url } rules'])
  assert.deepEqual(problemsWith({ readOnlyForbidden: ['GET /items'] }), ['readOnlyForbidden[0] must be an object'])
  assert.deepEqual(problemsWith({ readOnlyForbidden: [{ method: 'GET', url: '/items' }] }), ['readOnlyForbidden[0].url must be a regular expression'])
  assert.deepEqual(problemsWith({ readOnlyForbidden: [{ method: '', url: /x/ }] }), ['readOnlyForbidden[0].method must be an HTTP method'])
  assert.deepEqual(problemsWith({ readOnlyForbidden: [{ method: 'GET', url: /x/, why: 'y' }] }), ['readOnlyForbidden[0]: unknown field "why"'])
  assert.deepEqual(problemsWith({ sameTabLinks: 'yes' }), ['sameTabLinks must be true or false'])
  for (const hook of ['setup', 'beforeStep', 'revision'])
    assert.deepEqual(problemsWith({ [hook]: 'later' }), [`${hook} must be a function`])
})

test('a walk needs a title and a run function; the rest is optional and checked', () => {
  const run = async () => {}
  assert.deepEqual(walkProblems({ title: 'Tour', run }), [])
  assert.deepEqual(walkProblems({ title: 'Tour', description: 'Long', writes: true, startPath: '/home', run }), [])
  assert.deepEqual(walkProblems(null), ['it must export default an object'])
  assert.deepEqual(walkProblems({ run }), ['title must be a non-empty string'])
  assert.deepEqual(walkProblems({ title: ' ', run }), ['title must be a non-empty string'])
  assert.deepEqual(walkProblems({ title: 'T', description: '', run }), ['description must be a non-empty string'])
  assert.deepEqual(walkProblems({ title: 'T', writes: 'no', run }), ['writes must be true or false'])
  assert.deepEqual(walkProblems({ title: 'T', startPath: 'home', run }), ['startPath must be a path starting with /'])
  assert.deepEqual(walkProblems({ title: 'T' }), ['run must be an async function'])
  assert.deepEqual(walkProblems({ title: 'T', run, steps: [] }), ['unknown field "steps"'])
})

// A project folder in the temp dir, with these files under demo-capture/.
function projectWith(files) {
  const dir = mkdtempSync(join(tmpdir(), 'project-'))
  for (const [path, text] of Object.entries(files)) {
    const full = join(dir, 'demo-capture', path)
    mkdirSync(dirname(full), { recursive: true })
    writeFileSync(full, text)
  }
  return dir
}

const CONFIG = `export default {
  contract: 1,
  name: 'my-app',
  environments: { dev: { url: 'https://dev.example.com/', production: false, hosts: ['dev.example.com'], writeGoAhead: true } },
  signInPath: '/login',
  isSignedOut: (url) => new URL(url).pathname === '/login',
  params: { centre: { default: 'Main', describe: 'which site' } },
}
`
const WALK = (fields) => `export default { ${fields}, async run() {} }\n`

test('loadConfig finds demo-capture/config.mjs and refuses a missing, broken or invalid one', async () => {
  const project = projectWith({ 'config.mjs': CONFIG })
  assert.equal((await loadConfig(project)).name, 'my-app')
  await rejects(loadConfig(mkdtempSync(join(tmpdir(), 'empty-'))), /has no demo-capture\/config\.mjs; pass --project/)
  await rejects(loadConfig(projectWith({ 'config.mjs': 'export default {' })), /demo-capture\/config\.mjs did not load/)
  await rejects(
    loadConfig(projectWith({ 'config.mjs': 'export default { contract: 1 }' })),
    /config\.mjs is not valid:\n- name must be/
  )
})

test('walks are the .mjs files in walks/, loaded by name and checked', async () => {
  const project = projectWith({
    'config.mjs': CONFIG,
    'walks/tour.mjs': WALK("title: 'Tour', description: 'Look around'"),
    'walks/add-item.mjs': WALK("title: 'Add an item', writes: true, startPath: '/items'"),
    'walks/notes.txt': 'not a walk'
  })
  assert.deepEqual(await walkNames(project), ['add-item', 'tour'])
  const tour = await loadWalk(project, 'tour')
  assert.deepEqual({ ...tour, run: typeof tour.run }, {
    name: 'tour',
    title: 'Tour',
    description: 'Look around',
    writes: false,
    startPath: '/',
    run: 'function'
  })
  assert.equal((await loadWalk(project, 'add-item')).writes, true)
  assert.deepEqual((await loadWalks(project)).map((walk) => walk.name), ['add-item', 'tour'])
  await rejects(loadWalk(project, 'nope'), /unknown walk "nope"; --list shows the walks/)
  await rejects(loadWalk(project, '../config'), /walk names are lowercase letters, digits and dashes, not "\.\.\/config"/)
  assert.deepEqual(await walkNames(projectWith({ 'config.mjs': CONFIG })), [])
})

test('a broken or invalid walk is refused with its file name', async () => {
  const project = projectWith({
    'config.mjs': CONFIG,
    'walks/broken.mjs': 'export default {',
    'walks/untitled.mjs': WALK("writes: false")
  })
  await rejects(loadWalk(project, 'broken'), /walks\/broken\.mjs did not load/)
  await rejects(loadWalk(project, 'untitled'), /walks\/untitled\.mjs is not a valid walk:\n- title must be/)
})

test('params take their defaults unless --set gives a value; an undeclared param is refused', () => {
  const declared = valid().params
  assert.deepEqual(resolveParams(declared, {}), { centre: 'Main' })
  assert.deepEqual(resolveParams(declared, { centre: 'North' }), { centre: 'North' })
  assert.deepEqual(resolveParams(declared, { centre: '' }), { centre: '' })
  assert.deepEqual(resolveParams(undefined, {}), {})
  assert.throws(() => resolveParams(declared, { site: 'x' }), /unknown param "site"; this project takes centre/)
  assert.throws(() => resolveParams({}, { site: 'x' }), /unknown param "site"; this project takes no params/)
})

test('--env must name a declared environment; production always needs a write go-ahead', () => {
  const config = valid()
  assert.throws(() => selectEnvironment(config, undefined), /--env is required and has no default; this project declares dev, prod/)
  assert.throws(() => selectEnvironment(config, 'uat'), /unknown --env "uat"; this project declares dev, prod/)
  assert.throws(() => selectEnvironment(config, 'toString'), /unknown --env "toString"/)
  const dev = selectEnvironment(config, 'dev')
  assert.deepEqual({ ...dev, hosts: [...dev.hosts] }, {
    name: 'dev',
    url: 'https://dev.example.com',
    baseUrl: 'https://dev.example.com',
    production: false,
    hosts: ['dev.example.com', 'api-dev.example.com'],
    writeGoAhead: false
  })
  const prod = selectEnvironment(config, 'prod')
  assert.equal(prod.baseUrl, 'https://example.com')
  assert.equal(prod.writeGoAhead, true)
  const stage = selectEnvironment({ environments: { stage: { url: 'https://s.example.com', production: false, hosts: ['s.example.com'], writeGoAhead: true } } }, 'stage')
  assert.equal(stage.writeGoAhead, true)
})

test('the revision hook is optional and never breaks a run', async () => {
  assert.equal(await appRevision(valid(), 'https://dev.example.com'), 'abc123')
  let seen
  await appRevision({ revision: async (arg) => ((seen = arg), ' v2 ') }, 'https://dev.example.com')
  assert.deepEqual(seen, { baseUrl: 'https://dev.example.com' })
  assert.equal(await appRevision({ revision: async () => ' v2 ' }, 'x'), 'v2')
  assert.equal(await appRevision({}, 'x'), 'unknown')
  assert.equal(await appRevision({ revision: async () => '' }, 'x'), 'unknown')
  assert.equal(await appRevision({ revision: async () => 42 }, 'x'), 'unknown')
  assert.equal(await appRevision({ revision: async () => { throw new Error('offline') } }, 'x'), 'unknown')
})

test('--list shows each walk with whether it writes, the environments with their gates, and the params', () => {
  const walks = [
    { name: 'add-item', title: 'Add an item', description: 'Adds one item to the list', writes: true },
    { name: 'tour', title: 'Tour', writes: false }
  ]
  const config = valid()
  config.environments.stage = { url: 'https://stage.example.com', production: false, hosts: ['stage.example.com'], writeGoAhead: true }
  const text = describeProject(config, walks)
  assert.match(text, /^my-app: 2 walks \(--walk\)/)
  assert.match(text, /\n {2}add-item {2}writes {5}Add an item\n {23}Adds one item to the list\n/)
  assert.match(text, /\n {2}tour {6}read-only {2}Tour\n/)
  assert.match(text, /\n {2}dev {2}https:\/\/dev\.example\.com\n/)
  assert.match(text, /\n {2}prod {2}https:\/\/example\.com\/ {2}production: every run needs --prod-go-ahead\n/)
  assert.match(text, /\n {2}stage {2}https:\/\/stage\.example\.com {2}write walks need --write-go-ahead/)
  assert.match(text, /Params \(--set name=value\):\n {2}centre {2}default "Main" {2}which site the demo uses$/)
  assert.doesNotMatch(describeProject({ ...config, params: undefined }, walks), /Params/)
  assert.match(describeProject(config, [walks[1]]), /^my-app: 1 walk \(--walk\)/)
})
