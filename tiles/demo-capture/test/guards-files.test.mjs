import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, realpathSync, symlinkSync, writeFileSync } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { CaptureRefusal, acquireRunLock, assertOutsideRepos, enclosingRepo } from '../scripts/guards.mjs'

const refuses = (fn, pattern) => assert.throws(fn, (e) => e instanceof CaptureRefusal && pattern.test(e.message))
const rejects = (promise, pattern) =>
  assert.rejects(promise, (e) => e instanceof CaptureRefusal && pattern.test(e.message))

test('a folder inside a git working tree is refused, found through symlinks and from paths that do not exist yet', () => {
  const base = realpathSync(mkdtempSync(join(tmpdir(), 'repo-check-')))
  mkdirSync(join(base, 'repo', '.git'), { recursive: true })
  mkdirSync(join(base, 'worktree'))
  writeFileSync(join(base, 'worktree', '.git'), 'gitdir: /elsewhere\n')
  mkdirSync(join(base, 'plain'))
  symlinkSync(join(base, 'repo'), join(base, 'link'))
  assert.equal(enclosingRepo(join(base, 'repo', 'a', 'b')), join(base, 'repo'))
  assert.equal(enclosingRepo(join(base, 'worktree', 'runs', 'x')), join(base, 'worktree'))
  assert.equal(enclosingRepo(join(base, 'link', 'run')), join(base, 'repo'))
  assert.equal(enclosingRepo(join(base, 'plain', 'run')), null)
  refuses(() => assertOutsideRepos(join(base, 'repo', 'run'), 'The run folder'), /The run folder .* is inside the git working tree/)
  assert.doesNotThrow(() => assertOutsideRepos(join(base, 'plain', 'run'), 'The run folder'))
})

test('the repo is found above an existing folder, however deep, and the nearest one wins', () => {
  const base = realpathSync(mkdtempSync(join(tmpdir(), 'repo-deep-')))
  mkdirSync(join(base, 'repo', '.git'), { recursive: true })
  mkdirSync(join(base, 'repo', 'runs', 'one'), { recursive: true })
  mkdirSync(join(base, 'repo', 'inner', '.git'), { recursive: true })
  mkdirSync(join(base, 'repo', 'inner', 'runs'))
  assert.equal(enclosingRepo(join(base, 'repo', 'runs', 'one')), join(base, 'repo'))
  assert.equal(enclosingRepo(join(base, 'repo', 'runs', 'one', 'new')), join(base, 'repo'))
  assert.equal(enclosingRepo(join(base, 'repo', 'inner', 'runs', 'new')), join(base, 'repo', 'inner'))
})

test('the run lock admits one run, refuses a live holder, and takes over from a dead one', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'lock-'))
  const lock = join(dir, 'session', 'lock')
  const release = await acquireRunLock(lock, { pid: 111, isAlive: () => true })
  assert.equal(await readFile(lock, 'utf8'), '111')
  assert.equal((await stat(lock)).mode & 0o777, 0o600)
  await rejects(acquireRunLock(lock, { pid: 222, isAlive: (pid) => pid === 111 }), /Another run \(pid 111\) is using this session/)
  const takeover = await acquireRunLock(lock, { pid: 333, isAlive: () => false })
  assert.equal(await readFile(lock, 'utf8'), '333')
  await takeover()
  await assert.rejects(stat(lock), { code: 'ENOENT' })
  await release()
  // A lock file without a pid in it is stale.
  writeFileSync(lock, '')
  const again = await acquireRunLock(lock, { pid: 444, isAlive: () => true })
  assert.equal(await readFile(lock, 'utf8'), '444')
  await again()
})

test('the run lock treats a process it may not signal as alive', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'lock-'))
  const lock = join(dir, 'lock')
  // pid 1 always exists and belongs to root: signalling it fails with EPERM.
  writeFileSync(lock, '1')
  await rejects(acquireRunLock(lock), /Another run \(pid 1\)/)
  writeFileSync(lock, String(process.pid))
  await rejects(acquireRunLock(lock), /Another run/)
  // No process has this pid (macOS and Linux stop well below it), so the lock is stale.
  writeFileSync(lock, '9999999')
  const release = await acquireRunLock(lock)
  assert.equal(await readFile(lock, 'utf8'), String(process.pid))
  await release()
})
