// The rules of the demo-capture engine: arguments, the go-ahead gates, the network policy (host
// lock and read-only), the password refusal, the outside-repo check and the run lock. All but the
// last two are synchronous and browser-free, so node:test proves every refusal.
//
// A capture is a presentation tool, not a test: it drives a real app to record a walkthrough. It
// is never test evidence.

// A refusal fails the run with one plain sentence. `step` names the step it stopped, when known.
export class CaptureRefusal extends Error {
  constructor(message, { step = null } = {}) {
    super(message)
    this.name = 'CaptureRefusal'
    this.step = step
  }
}

export function usageText() {
  return `demo-capture: record a scripted walkthrough of a web app into a capture folder (contract 1)

  node scripts/cli.mjs --project <dir> --list
  node scripts/cli.mjs sign-in --project <dir> --env <name>
  node scripts/cli.mjs --project <dir> --env <name> --walk <name> [--set key=value]... [--out <dir>] [--headed]

  --project         the folder that holds demo-capture/config.mjs (default: the current folder)
  --env             required, no default: an environment the project's config declares
  --walk            a file in demo-capture/walks/, without .mjs (--list shows them)
  --set key=value   a param the config declares; repeat it for several
  --out             the run folder (default ~/.demo-capture/<project>/runs/<yyyymmdd-hhmmss>-<walk>)
  --headed          show the browser while recording
  --learn-hosts     run a read-only walk that lets unlisted hosts through and lists them (no video)
  --prod-go-ahead   needed for a production environment. An agent adds it only after the
                    person's go-ahead in chat for this run.
  --write-go-ahead  needed for a walk that writes, where the environment sets writeGoAhead. An
                    agent adds it only after the person's go-ahead in chat for this run.

The first run of an environment opens a browser for a person to sign in; nothing is typed for
them. The session is kept in ~/.demo-capture/<project>/<env>/, outside every repo, and reused.`
}

const VALUE_FLAGS = new Set(['--project', '--env', '--walk', '--out', '--set'])
const SET_KEY = /^[A-Za-z][A-Za-z0-9_-]*$/

// One --set value: "key=value", split at the first "=". The value may be empty or hold "=".
export function parseSet(value, existing = {}) {
  const eq = value.indexOf('=')
  if (eq <= 0) throw new CaptureRefusal(`--set takes key=value, not "${value}"`)
  const key = value.slice(0, eq)
  if (!SET_KEY.test(key))
    throw new CaptureRefusal(`--set key "${key}" must start with a letter and use letters, digits, - or _`)
  if (Object.hasOwn(existing, key)) throw new CaptureRefusal(`--set ${key} is given twice`)
  return { ...existing, [key]: value.slice(eq + 1) }
}

// --env is required and has no default: a default turns "I meant production" into a quiet
// success somewhere else.
export function parseArgs(argv) {
  const out = {
    command: 'run',
    project: undefined,
    env: undefined,
    walk: undefined,
    out: undefined,
    set: {},
    headed: false,
    learnHosts: false,
    prodGoAhead: false,
    writeGoAhead: false
  }
  const rest = [...argv]
  if (rest[0] === 'sign-in') {
    out.command = 'sign-in'
    rest.shift()
  }
  let list = false
  let help = false
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i]
    if (VALUE_FLAGS.has(a)) {
      const value = rest[++i]
      if (value === undefined || value.startsWith('--')) throw new CaptureRefusal(`${a} needs a value`)
      if (a === '--set') out.set = parseSet(value, out.set)
      else out[a.slice(2)] = value
    } else if (a === '--list') list = true
    else if (a === '--help' || a === '-h') help = true
    else if (a === '--headed') out.headed = true
    else if (a === '--learn-hosts') out.learnHosts = true
    else if (a === '--prod-go-ahead') out.prodGoAhead = true
    else if (a === '--write-go-ahead') out.writeGoAhead = true
    else throw new CaptureRefusal(`unknown argument: ${a}`)
  }
  if (help) return { ...out, command: 'help' }
  if (list) {
    if (out.command === 'sign-in') throw new CaptureRefusal('sign-in does not take --list')
    return { ...out, command: 'list' }
  }
  if (!out.env) throw new CaptureRefusal('--env is required and has no default')
  if (out.command === 'sign-in') {
    if (out.walk) throw new CaptureRefusal('sign-in takes no --walk; it only signs in')
    return out
  }
  if (!out.walk) throw new CaptureRefusal('--walk is required; --list shows the walks')
  return out
}

// `env` is an environment as selectEnvironment (project.mjs) returns it.
export function assertProdGoAhead(env, prodGoAhead) {
  if (env.production && !prodGoAhead)
    throw new CaptureRefusal(
      `${env.name} is a production environment: it needs --prod-go-ahead, which an agent adds only after the person's go-ahead in chat for this run.`
    )
}

// Production already needs --prod-go-ahead for every run, which covers its write walks.
export function assertWriteGoAhead(env, walk, writeGoAhead) {
  if (walk.writes && env.writeGoAhead && !env.production && !writeGoAhead)
    throw new CaptureRefusal(
      `This walk writes, and ${env.name} needs a go-ahead for every write walk: --write-go-ahead, which an agent adds only after the person's go-ahead in chat for this run.`
    )
}

export function assertLearnable(env, walk) {
  if (walk.writes) throw new CaptureRefusal('--learn-hosts runs read-only walks only, and this walk writes.')
  if (env.production)
    throw new CaptureRefusal(`--learn-hosts is refused on ${env.name}, a production environment.`)
}

export function assertTypable(inputType) {
  if (String(inputType ?? '').toLowerCase() === 'password')
    throw new CaptureRefusal('Typing into a password field is refused: sign-in is always done by a person.')
}
