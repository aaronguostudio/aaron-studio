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

// HEAD and OPTIONS cannot change data, and browsers send OPTIONS by themselves (CORS preflight).
const READS = new Set(['GET', 'HEAD', 'OPTIONS'])

// "POST api.example.com/items": the method, host and path. Never the query or the body, which
// can hold ids and tokens.
export function describeRequest(method, url) {
  try {
    const parsed = new URL(url)
    return `${method.toUpperCase()} ${parsed.hostname}${parsed.pathname}`
  } catch {
    return `${method.toUpperCase()} (unreadable URL)`
  }
}

// A { method, url, body? } rule: the method matches exactly, `url` (a RegExp) is found in the
// full URL, and `body`, when the rule has one, is found in the request body.
export function matchesRule(rule, { method, url, body = '' }) {
  if (rule.method.toUpperCase() !== method.toUpperCase()) return false
  if (url.search(rule.url) < 0) return false
  return rule.body === undefined || String(body ?? '').search(rule.body) >= 0
}

// What the network guard does with one request. `policy`:
//   hosts      the environment's hosts; any other host is refused
//   readOnly   the walk declares writes: false
//   forbidden  readOnlyForbidden rules: reads that write
//   allowed    non-GET rules a read-only walk may send because they change no data
//   learning   --learn-hosts: unlisted hosts are let through and remembered
export function classifyRequest(request, { hosts, readOnly, forbidden = [], allowed = [], learning = false }) {
  let host
  try {
    const parsed = new URL(request.url)
    if (!/^(https?|wss?):$/.test(parsed.protocol)) return { action: 'continue', kind: 'local' }
    host = parsed.hostname.toLowerCase()
  } catch {
    return { action: 'abort', kind: 'unreadable', host: null, where: '(unreadable URL)', reason: 'A request with an unreadable URL was refused.' }
  }
  const where = describeRequest(request.method, request.url)
  const verb = request.method.toUpperCase()
  if (readOnly && forbidden.some((rule) => matchesRule(rule, request)))
    return { action: 'abort', kind: 'forbidden', host, where, reason: `${where} was refused: the project lists it as a read that writes.` }
  if (readOnly && !READS.has(verb) && !allowed.some((rule) => matchesRule(rule, request)))
    return { action: 'abort', kind: 'write', host, where, reason: `${where} was refused: this walk is read-only.` }
  if (!hosts.includes(host)) {
    if (learning) return { action: 'continue', kind: 'unlisted', host, where }
    return { action: 'abort', kind: 'host', host, where, reason: `${where} was refused: ${host} is not in this environment's hosts.` }
  }
  return { action: 'continue', kind: 'listed', host, where }
}

// Applies classifyRequest to every request and WebSocket of a recording context. A refusal is
// aborted at once and fails the run at the next check (before each step, and at the end). While
// learning, refusals are aborted and listed, and the walk goes on.
export class RunGuard {
  constructor(policy, { currentStep = () => null } = {}) {
    this.policy = policy
    this.currentStep = currentStep
    this.violations = []
    this.unlisted = new Set()
    this.refused = new Set()
  }

  check(request) {
    const verdict = classifyRequest(request, this.policy)
    if (verdict.kind === 'unlisted') this.unlisted.add(verdict.host)
    if (verdict.action === 'abort') {
      if (this.policy.learning) this.refused.add(verdict.where)
      else this.fail(verdict.reason)
    }
    return verdict.action
  }

  fail(reason) {
    this.violations.push({ reason, step: this.currentStep() })
  }

  async handleRoute(route) {
    const request = route.request()
    const action = this.check({ method: request.method(), url: request.url(), body: request.postData() ?? '' })
    if (action === 'abort') return route.abort('blockedbyclient').catch(() => undefined)
    return route.continue().catch(() => undefined)
  }

  // A WebSocket opens with a GET (the upgrade), so it is a read.
  handleWebSocket(ws) {
    if (this.check({ method: 'GET', url: ws.url() }) === 'abort') return ws.close()
    ws.connectToServer()
  }

  assertClean() {
    const first = this.violations[0]
    if (first) throw new CaptureRefusal(first.reason, { step: first.step })
  }

  learned() {
    return { unlisted: [...this.unlisted].sort(), refused: [...this.refused].sort() }
  }
}
