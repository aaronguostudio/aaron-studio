import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CaptureRefusal, RunGuard, classifyRequest, describeRequest, matchesRule } from '../scripts/guards.mjs'

const policy = (extra = {}) => ({ hosts: ['app.example.com', 'cdn.example.com'], readOnly: true, ...extra })
const get = (url) => ({ method: 'GET', url })

test('describeRequest names the method, host and path, never the query', () => {
  assert.equal(describeRequest('post', 'https://app.example.com/items?token=abc'), 'POST app.example.com/items')
  assert.equal(describeRequest('GET', 'not a url'), 'GET (unreadable URL)')
})

test('a rule matches on method and URL, and on the body when it has one', () => {
  const rule = { method: 'GET', url: /\/items\?mode=recount/ }
  assert.equal(matchesRule(rule, get('https://app.example.com/items?mode=recount')), true)
  assert.equal(matchesRule(rule, { method: 'get', url: 'https://app.example.com/items?mode=recount' }), true)
  assert.equal(matchesRule(rule, { method: 'POST', url: 'https://app.example.com/items?mode=recount' }), false)
  assert.equal(matchesRule(rule, get('https://app.example.com/items')), false)
  // A global flag does not make matching depend on the previous call.
  const global = { method: 'GET', url: /recount/g }
  assert.equal(matchesRule(global, get('https://a.example.com/recount')), true)
  assert.equal(matchesRule(global, get('https://a.example.com/recount')), true)
  const withBody = { method: 'POST', url: /\/brief$/, body: /^\{"date":"[\d-]+"\}$/ }
  assert.equal(matchesRule(withBody, { method: 'POST', url: 'https://a.example.com/brief', body: '{"date":"2026-10-05"}' }), true)
  assert.equal(matchesRule(withBody, { method: 'POST', url: 'https://a.example.com/brief', body: '{"date":"2026-10-05","refresh":true}' }), false)
  assert.equal(matchesRule(withBody, { method: 'POST', url: 'https://a.example.com/brief' }), false)
})

test('the host lock refuses every host outside the list, and lets listed hosts through', () => {
  assert.equal(classifyRequest(get('https://app.example.com/home'), policy()).action, 'continue')
  assert.equal(classifyRequest(get('https://APP.example.com/home'), policy()).action, 'continue')
  assert.equal(classifyRequest(get('wss://cdn.example.com/live'), policy()).action, 'continue')
  const outside = classifyRequest(get('https://tracker.example.net/pixel?id=1'), policy())
  assert.equal(outside.action, 'abort')
  assert.equal(outside.kind, 'host')
  assert.equal(outside.reason, "GET tracker.example.net/pixel was refused: tracker.example.net is not in this environment's hosts.")
  // The lock also holds for a walk that writes.
  assert.equal(classifyRequest(get('https://tracker.example.net/'), policy({ readOnly: false })).action, 'abort')
})

test('pages the browser makes itself are not network requests', () => {
  for (const url of ['data:image/png;base64,AAAA', 'blob:https://app.example.com/1', 'about:blank'])
    assert.equal(classifyRequest(get(url), policy()).action, 'continue')
  const unreadable = classifyRequest(get('not a url'), policy())
  assert.equal(unreadable.action, 'abort')
  assert.equal(unreadable.reason, 'A request with an unreadable URL was refused.')
})

test('a read-only walk refuses every non-read; HEAD and OPTIONS are reads', () => {
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
    const verdict = classifyRequest({ method, url: 'https://app.example.com/items' }, policy())
    assert.equal(verdict.action, 'abort', method)
    assert.equal(verdict.kind, 'write')
    assert.equal(verdict.reason, `${method} app.example.com/items was refused: this walk is read-only.`)
  }
  for (const method of ['GET', 'HEAD', 'OPTIONS'])
    assert.equal(classifyRequest({ method, url: 'https://app.example.com/items' }, policy()).action, 'continue', method)
  assert.equal(classifyRequest({ method: 'POST', url: 'https://app.example.com/items' }, policy({ readOnly: false })).action, 'continue')
})

test('a read the project lists as writing is refused in a read-only walk only', () => {
  const forbidden = [{ method: 'GET', url: /\/items\?mode=recount/ }]
  const verdict = classifyRequest(get('https://app.example.com/items?mode=recount'), policy({ forbidden }))
  assert.equal(verdict.action, 'abort')
  assert.equal(verdict.kind, 'forbidden')
  assert.equal(verdict.reason, 'GET app.example.com/items was refused: the project lists it as a read that writes.')
  assert.equal(classifyRequest(get('https://app.example.com/items?mode=recount'), policy({ forbidden, readOnly: false })).action, 'continue')
})

test('an allowed non-read passes in a read-only walk, but never on an unlisted host and never when forbidden', () => {
  const allowed = [{ method: 'POST', url: /\/session\/token$/ }]
  assert.equal(classifyRequest({ method: 'POST', url: 'https://app.example.com/session/token' }, policy({ allowed })).action, 'continue')
  assert.equal(classifyRequest({ method: 'POST', url: 'https://other.example.net/session/token' }, policy({ allowed })).kind, 'host')
  const forbidden = [{ method: 'POST', url: /\/session\/token$/ }]
  assert.equal(classifyRequest({ method: 'POST', url: 'https://app.example.com/session/token' }, policy({ allowed, forbidden })).kind, 'forbidden')
})

test('while learning, unlisted hosts pass and are named, and non-reads are still refused', () => {
  const learning = policy({ learning: true })
  const verdict = classifyRequest(get('https://fonts.example.org/a.woff2'), learning)
  assert.deepEqual([verdict.action, verdict.kind, verdict.host], ['continue', 'unlisted', 'fonts.example.org'])
  assert.equal(classifyRequest({ method: 'POST', url: 'https://beacon.example.org/b' }, learning).action, 'abort')
})

// A route as Playwright hands it to a context.route handler.
function fakeRoute(method, url, body = null) {
  const calls = []
  return {
    calls,
    request: () => ({ method: () => method, url: () => url, postData: () => body }),
    abort: async (code) => calls.push(`abort ${code}`),
    continue: async () => calls.push('continue')
  }
}

test('RunGuard aborts a refused request at once and fails the run at the next check, naming the step', async () => {
  let step = 'add'
  const guard = new RunGuard(policy(), { currentStep: () => step })
  const ok = fakeRoute('GET', 'https://app.example.com/list')
  await guard.handleRoute(ok)
  assert.deepEqual(ok.calls, ['continue'])
  assert.doesNotThrow(() => guard.assertClean())
  const bad = fakeRoute('POST', 'https://app.example.com/items', '{"name":"x"}')
  await guard.handleRoute(bad)
  assert.deepEqual(bad.calls, ['abort blockedbyclient'])
  step = 'after'
  assert.throws(
    () => guard.assertClean(),
    (e) => e instanceof CaptureRefusal && e.step === 'add' && /POST app\.example\.com\/items was refused: this walk is read-only\./.test(e.message)
  )
})

test('RunGuard hands the request body to the rules', async () => {
  const allowed = [{ method: 'POST', url: /\/brief$/, body: /^\{"date":"[\d-]+"\}$/ }]
  const guard = new RunGuard(policy({ allowed }))
  const plain = fakeRoute('POST', 'https://app.example.com/brief', '{"date":"2026-10-05"}')
  await guard.handleRoute(plain)
  assert.deepEqual(plain.calls, ['continue'])
  const refresh = fakeRoute('POST', 'https://app.example.com/brief', '{"date":"2026-10-05","refresh":true}')
  await guard.handleRoute(refresh)
  assert.deepEqual(refresh.calls, ['abort blockedbyclient'])
})

test('RunGuard closes a WebSocket to an unlisted host and connects a listed one', () => {
  const guard = new RunGuard(policy())
  const calls = []
  const ws = (url) => ({ url: () => url, close: () => calls.push(`close ${url}`), connectToServer: () => calls.push(`connect ${url}`) })
  guard.handleWebSocket(ws('wss://app.example.com/hub'))
  guard.handleWebSocket(ws('wss://push.example.net/hub'))
  assert.deepEqual(calls, ['connect wss://app.example.com/hub', 'close wss://push.example.net/hub'])
  assert.throws(() => guard.assertClean(), /push\.example\.net is not in this environment's hosts/)
})

test('a learning RunGuard never fails: it lists unlisted hosts and refused requests', async () => {
  const guard = new RunGuard(policy({ learning: true }))
  // Two unlisted hosts and two refused requests, each fed out of sorted order, so that only
  // learned()'s own sorting can produce the order asserted below. fonts is seen twice: one entry.
  await guard.handleRoute(fakeRoute('GET', 'https://zeta.example.org/z.woff2'))
  await guard.handleRoute(fakeRoute('GET', 'https://fonts.example.org/a.woff2'))
  await guard.handleRoute(fakeRoute('GET', 'https://fonts.example.org/b.woff2'))
  await guard.handleRoute(fakeRoute('GET', 'https://cdn.example.com/app.js'))
  const post = fakeRoute('POST', 'https://beacon.example.org/b?id=7')
  await guard.handleRoute(post)
  assert.deepEqual(post.calls, ['abort blockedbyclient'])
  const del = fakeRoute('DELETE', 'https://app.example.com/session?id=7')
  await guard.handleRoute(del)
  assert.deepEqual(del.calls, ['abort blockedbyclient'])
  assert.doesNotThrow(() => guard.assertClean())
  assert.deepEqual(guard.learned(), {
    unlisted: ['fonts.example.org', 'zeta.example.org'],
    refused: ['DELETE app.example.com/session', 'POST beacon.example.org/b']
  })
})

test('RunGuard.fail records a reason against the current step', () => {
  const guard = new RunGuard(policy(), { currentStep: () => 'open' })
  guard.fail('The walk opened a second tab.')
  assert.throws(() => guard.assertClean(), (e) => e.step === 'open' && e.message === 'The walk opened a second tab.')
})
