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

// Pages the browser builds itself, with no network behind them. Every scheme that is neither one
// of these nor in NETWORK_PORTS (file:, ftp: and the rest) is refused.
const LOCAL_SCHEMES = new Set(['data:', 'blob:', 'about:'])

// The schemes that reach the network, and the port each uses when a URL leaves it out (a URL
// reports an empty `port` for its scheme's default).
const NETWORK_PORTS = new Map([
  ['http:', '80'],
  ['https:', '443'],
  ['ws:', '80'],
  ['wss:', '443']
])

// A `hosts` entry is "hostname" or "hostname:port" ("[::1]:4100" for IPv6). Returns
// { host, port } with the entry lower-cased, trimmed and stripped of a trailing dot (port is null
// when the entry has none), or null when the entry is not one of those.
const HOST_ENTRY = /^(\[[0-9a-f:.]+\]|[a-z0-9_-]+(?:\.[a-z0-9_-]+)*)(?::([0-9]{1,5}))?$/
function parseHostEntry(entry) {
  if (typeof entry !== 'string') return null
  const match = HOST_ENTRY.exec(entry.trim().toLowerCase().replace(/\.(:[0-9]+)?$/, '$1'))
  if (!match) return null
  if (match[2] === undefined) return { host: match[1], port: null }
  const port = Number(match[2])
  return port >= 1 && port <= 65535 ? { host: match[1], port: String(port) } : null
}

// "POST api.example.com/items": the method, host and path. Never the query, the fragment, the
// userinfo or the body, which can hold ids and tokens.
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
//   hosts      the environment's hosts; any other host is refused. An entry is "hostname" or
//              "hostname:port". An entry with a port matches only that host on that port; an
//              entry without one matches the hostname on any port. A URL that leaves its port out
//              has its scheme's default (80 for http and ws, 443 for https and wss).
//   readOnly   the walk declares writes: false
//   forbidden  readOnlyForbidden rules: reads that write
//   allowed    non-GET rules a read-only walk may send because they change no data
//   learning   --learn-hosts: unlisted hosts are let through and remembered. A non-read is never
//              sent to an unlisted host, even when `allowed` lists it: the host is remembered and
//              the request is aborted.
// `kind`: local (a page the browser builds itself), scheme (not http, https, ws or wss), listed,
// unlisted, host (refused: not in the list), write, forbidden, unreadable.
export function classifyRequest(request, { hosts, readOnly, forbidden = [], allowed = [], learning = false }) {
  let host
  let port
  try {
    const parsed = new URL(request.url)
    if (LOCAL_SCHEMES.has(parsed.protocol)) return { action: 'continue', kind: 'local' }
    // The reason names the scheme only: the rest of the URL can hold ids, tokens and credentials.
    if (!NETWORK_PORTS.has(parsed.protocol))
      return {
        action: 'abort',
        kind: 'scheme',
        host: null,
        where: `(${parsed.protocol} URL)`,
        reason: `A request with the ${parsed.protocol} scheme was refused.`
      }
    host = parsed.hostname.toLowerCase()
    port = parsed.port || NETWORK_PORTS.get(parsed.protocol)
  } catch {
    return { action: 'abort', kind: 'unreadable', host: null, where: '(unreadable URL)', reason: 'A request with an unreadable URL was refused.' }
  }
  const where = describeRequest(request.method, request.url)
  const verb = request.method.toUpperCase()
  const isRead = READS.has(verb)
  const entries = hosts.map(parseHostEntry).filter(Boolean)
  const listed = entries.some((entry) => entry.host === host && (entry.port === null || entry.port === port))
  // A host that is listed, but not on this port, is named with its port so the refusal is not
  // mistaken for a typo.
  const named = entries.some((entry) => entry.host === host) ? `${host}:${port}` : host
  if (readOnly && forbidden.some((rule) => matchesRule(rule, request)))
    return { action: 'abort', kind: 'forbidden', host, where, reason: `${where} was refused: the project lists it as a read that writes.` }
  if (readOnly && !isRead && !allowed.some((rule) => matchesRule(rule, request)))
    return { action: 'abort', kind: 'write', host, where, reason: `${where} was refused: this walk is read-only.` }
  if (!listed) {
    if (learning) {
      // A non-read only gets here when `allowed` lists it: the host is remembered, nothing is sent.
      if (!isRead)
        return { action: 'abort', kind: 'unlisted', host, where, reason: `${where} was refused: ${named} is not in this environment's hosts.` }
      return { action: 'continue', kind: 'unlisted', host, where }
    }
    return { action: 'abort', kind: 'host', host, where, reason: `${where} was refused: ${named} is not in this environment's hosts.` }
  }
  return { action: 'continue', kind: 'listed', host, where }
}

// The policy a RunGuard guards with: checked, copied (so the caller cannot change it afterwards)
// and with the host list normalised. A policy that is not usable is refused rather than guarded
// with: a missing readOnly would read as false and let writes through, and a bad hosts list would
// guard nothing. The messages never repeat a hosts entry, which could hold credentials.
function checkedPolicy(policy) {
  if (policy === null || typeof policy !== 'object' || Array.isArray(policy))
    throw new CaptureRefusal('The network policy is missing.')
  const { hosts, readOnly, learning = false } = policy
  const forbidden = policy.forbidden ?? []
  const allowed = policy.allowed ?? []
  if (!Array.isArray(hosts)) throw new CaptureRefusal('The network policy needs hosts: a list of host names.')
  const normalised = hosts.map((entry, index) => {
    const parsed = parseHostEntry(entry)
    if (parsed === null) throw new CaptureRefusal(`The network policy's hosts[${index}] is not a host name or host:port.`)
    return parsed.port === null ? parsed.host : `${parsed.host}:${parsed.port}`
  })
  if (typeof readOnly !== 'boolean') throw new CaptureRefusal('The network policy needs readOnly to be true or false.')
  if (typeof learning !== 'boolean') throw new CaptureRefusal('The network policy needs learning to be true or false.')
  if (learning && !readOnly)
    throw new CaptureRefusal('Learning hosts runs read-only walks only, so the network policy cannot set learning without readOnly.')
  if (!Array.isArray(forbidden)) throw new CaptureRefusal('The network policy needs forbidden to be a list of rules.')
  if (!Array.isArray(allowed)) throw new CaptureRefusal('The network policy needs allowed to be a list of rules.')
  return { ...policy, hosts: normalised, readOnly, learning, forbidden, allowed }
}

// The name of a request for a "guard error" message, or a stand-in when even that cannot be read.
function nameOf(read) {
  try {
    return read()
  } catch {
    return '(unknown request)'
  }
}

// Applies classifyRequest to every request and WebSocket of a recording context. A refusal is
// aborted at once and fails the run at the next check (before each step, and at the end). While
// learning, refusals are aborted and listed, and the walk goes on.
//
// The caller wires three handlers: handleRoute from context.route, handleWebSocket from
// context.routeWebSocket, and handleRedirectHop from context.on('request'). A route handler sees
// only the first URL of a request, never the hops of a redirect, so handleRedirectHop classifies
// each hop the same way. A hop is already on the wire when the 'request' event fires, so it can
// only be recorded, never aborted: the run fails at the next assertClean(), and stopping the
// connection itself is the job of a rule at the network layer, not of this class.
//
// No request or socket is left unanswered and nothing throws into the page: one the guard cannot
// judge is aborted or closed and recorded as a violation ("guard error on ..."), also while
// learning. The constructor refuses a policy it cannot trust (see checkedPolicy).
export class RunGuard {
  constructor(policy, { currentStep = () => null } = {}) {
    this.policy = checkedPolicy(policy)
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
    let step = null
    try {
      step = this.currentStep()
    } catch {
      // The step name is only a label; the violation matters more than where it happened.
    }
    this.violations.push({ reason, step })
  }

  async handleRoute(route) {
    let send = false
    try {
      const request = route.request()
      send = this.check({ method: request.method(), url: request.url(), body: request.postData() ?? '' }) === 'continue'
    } catch {
      this.fail(
        `guard error on ${nameOf(() => {
          const request = route.request()
          return describeRequest(request.method(), request.url())
        })}`
      )
    }
    try {
      await (send ? route.continue() : route.abort('blockedbyclient'))
    } catch {
      // The page may already be gone; there is nothing left to answer.
    }
  }

  // A WebSocket opens with a GET (the upgrade), so it is a read.
  handleWebSocket(ws) {
    let connect = false
    try {
      connect = this.check({ method: 'GET', url: ws.url() }) === 'continue'
      if (connect) ws.connectToServer()
    } catch {
      connect = false
      this.fail(`guard error on ${nameOf(() => describeRequest('GET', ws.url()))}`)
    }
    if (connect) return
    try {
      Promise.resolve(ws.close()).catch(() => {})
    } catch {
      // Already closed.
    }
  }

  // For every request the context reports: a hop of a redirect (redirectedFrom() is set) is
  // classified like any request and recorded when denied; a first request was already judged by
  // handleRoute and is left alone. It cannot abort, so it returns nothing.
  handleRedirectHop(request) {
    try {
      if (!request.redirectedFrom()) return
      const body = typeof request.postData === 'function' ? request.postData() ?? '' : ''
      this.check({ method: request.method(), url: request.url(), body })
    } catch {
      this.fail(`guard error on ${nameOf(() => describeRequest(request.method(), request.url()))}`)
    }
  }

  assertClean() {
    const first = this.violations[0]
    if (first) throw new CaptureRefusal(first.reason, { step: first.step })
  }

  learned() {
    return { unlisted: [...this.unlisted].sort(), refused: [...this.refused].sort() }
  }
}
