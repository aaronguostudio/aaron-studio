import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCommandPlan, parseArgs } from '../cli.mjs';

test('parseArgs identifies command, flags, and options', () => {
  const parsed = parseArgs([
    'rybbit-preview',
    '--start',
    '2026-06-01',
    '--end',
    '2026-06-07',
    '--dry-run',
  ]);

  assert.deepEqual(parsed, {
    command: 'rybbit-preview',
    options: {
      start: '2026-06-01',
      end: '2026-06-07',
      dryRun: true,
    },
  });
});

test('buildCommandPlan creates safe dry-run summaries', () => {
  const plan = buildCommandPlan({
    command: 'rybbit-preview',
    options: {
      start: '2026-06-01',
      end: '2026-06-07',
      dryRun: true,
    },
    env: {
      RYBBIT_SITE_ID: 'site123',
      RYBBIT_API_KEY: 'secret',
    },
  });

  assert.equal(plan.mode, 'dry-run');
  assert.equal(plan.source, 'rybbit');
  assert.equal(plan.url.includes('RYBBIT_API_KEY'), false);
  assert.equal(plan.url.includes('secret'), false);
  assert.equal(plan.hasApiKey, true);
});

test('buildCommandPlan supports post-publish ingestion summaries', () => {
  const plan = buildCommandPlan({
    command: 'ingest-after-publish',
    options: {
      start: '2026-06-01',
      end: '2026-06-07',
      dryRun: true,
    },
    env: {
      RYBBIT_SITE_ID: 'site123',
      RYBBIT_API_KEY: 'secret',
      TURSO_URL: 'libsql://example',
      TURSO_AUTH_TOKEN: 'token',
    },
  });

  assert.deepEqual(plan, {
    mode: 'dry-run',
    source: 'post_publish',
    hasApiKey: true,
    hasSiteId: true,
    hasTursoUrl: true,
    hasTursoAuthToken: true,
    includesRybbit: true,
  });
});

test('buildCommandPlan supports content date normalization summaries', () => {
  const plan = buildCommandPlan({
    command: 'normalize-content-dates',
    options: { dryRun: true },
    env: {
      TURSO_URL: 'libsql://example',
      TURSO_AUTH_TOKEN: 'token',
    },
  });

  assert.deepEqual(plan, {
    mode: 'dry-run',
    source: 'content_repo',
    hasTursoUrl: true,
    hasTursoAuthToken: true,
  });
});
