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
  assert.equal(plan.endpoint, 'overview/time-series');
  assert.equal(new URL(plan.url).pathname, '/api/sites/site123/overview/time-series');
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

test('buildCommandPlan supports channel post registration summaries', () => {
  const plan = buildCommandPlan({
    command: 'register-channel-posts',
    options: {
      file: 'distribution.json',
      dryRun: true,
    },
    env: {
      TURSO_URL: 'libsql://example',
      TURSO_AUTH_TOKEN: 'token',
    },
  });

  assert.deepEqual(plan, {
    mode: 'dry-run',
    source: 'manual',
    hasFile: true,
    hasTursoUrl: true,
    hasTursoAuthToken: true,
  });
});

test('buildCommandPlan supports YouTube ingestion summaries', () => {
  const plan = buildCommandPlan({
    command: 'ingest-youtube',
    options: {
      start: '2026-06-15',
      end: '2026-06-22',
      slugs: 'fable-5-managing-ai-autonomy',
      dryRun: true,
    },
    env: {
      TURSO_URL: 'libsql://example',
      TURSO_AUTH_TOKEN: 'token',
    },
  });

  assert.deepEqual(plan, {
    mode: 'dry-run',
    source: 'youtube',
    hasStart: true,
    hasEnd: true,
    hasSlugs: true,
    hasTursoUrl: true,
    hasTursoAuthToken: true,
  });
});

test('buildCommandPlan supports LinkedIn CSV import summaries', () => {
  const plan = buildCommandPlan({
    command: 'import-linkedin',
    options: {
      file: 'linkedin.csv',
      dryRun: true,
    },
    env: {
      TURSO_URL: 'libsql://example',
      TURSO_AUTH_TOKEN: 'token',
    },
  });

  assert.deepEqual(plan, {
    mode: 'dry-run',
    source: 'linkedin',
    hasFile: true,
    hasTursoUrl: true,
    hasTursoAuthToken: true,
  });
});

test('buildCommandPlan supports LinkedIn auth URL summaries', () => {
  const plan = buildCommandPlan({
    command: 'linkedin-auth-url',
    options: {
      scopes: 'openid,profile,rw_organization_admin',
    },
    env: {
      LINKEDIN_CLIENT_ID: 'client-123',
      LINKEDIN_REDIRECT_URI: 'http://localhost:4173/linkedin/callback',
    },
  });

  assert.deepEqual(plan, {
    mode: 'live',
    source: 'linkedin',
    endpoint: 'oauth/authorization',
    hasClientId: true,
    hasRedirectUri: true,
    scopeCount: 3,
  });
});

test('buildCommandPlan supports LinkedIn diagnostic summaries', () => {
  const plan = buildCommandPlan({
    command: 'linkedin-diagnose',
    options: {
      shareUrn: 'urn:li:share:1',
    },
    env: {
      LINKEDIN_ACCESS_TOKEN: 'token',
      LINKEDIN_ORGANIZATION_URN: 'urn:li:organization:1',
    },
  });

  assert.deepEqual(plan, {
    mode: 'live',
    source: 'linkedin',
    endpoint: 'diagnostics',
    hasAccessToken: true,
    hasOrganizationUrn: true,
    hasShareUrn: true,
  });
});

test('buildCommandPlan supports LinkedIn code exchange summaries', () => {
  const plan = buildCommandPlan({
    command: 'linkedin-exchange-code',
    options: {
      code: 'auth-code',
    },
    env: {
      LINKEDIN_CLIENT_ID: 'client-123',
      LINKEDIN_CLIENT_SECRET: 'secret-456',
      LINKEDIN_REDIRECT_URI: 'http://localhost:4173/linkedin/callback',
    },
  });

  assert.deepEqual(plan, {
    mode: 'live',
    source: 'linkedin',
    endpoint: 'oauth/accessToken',
    hasCode: true,
    hasClientId: true,
    hasClientSecret: true,
    hasRedirectUri: true,
  });
});

test('buildCommandPlan supports automated LinkedIn ingestion summaries', () => {
  const plan = buildCommandPlan({
    command: 'ingest-linkedin',
    options: {
      slugs: 'one-person-project-ai-coding',
      dryRun: true,
    },
    env: {
      LINKEDIN_ACCESS_TOKEN: 'token',
      LINKEDIN_ORGANIZATION_URN: 'urn:li:organization:1',
      TURSO_URL: 'libsql://example',
      TURSO_AUTH_TOKEN: 'token',
    },
  });

  assert.deepEqual(plan, {
    mode: 'dry-run',
    source: 'linkedin',
    endpoint: 'organizationalEntityShareStatistics',
    hasAccessToken: true,
    hasOrganizationUrn: true,
    hasSlugs: true,
    hasTursoUrl: true,
    hasTursoAuthToken: true,
  });
});

test('buildCommandPlan supports postmortem summaries', () => {
  const plan = buildCommandPlan({
    command: 'postmortem',
    options: {
      slug: 'fable-5-managing-ai-autonomy',
      window: '7d',
      dryRun: true,
    },
    env: {
      TURSO_URL: 'libsql://example',
      TURSO_AUTH_TOKEN: 'token',
    },
  });

  assert.deepEqual(plan, {
    mode: 'dry-run',
    source: 'turso',
    hasSlug: true,
    window: '7d',
    hasTursoUrl: true,
    hasTursoAuthToken: true,
  });
});

test('buildCommandPlan supports content evaluation summaries', () => {
  const plan = buildCommandPlan({
    command: 'evaluate-content',
    options: {
      slug: 'one-person-project-ai-coding',
      stage: 'prepublish',
      dryRun: true,
    },
    env: {
      TURSO_URL: 'libsql://example',
      TURSO_AUTH_TOKEN: 'token',
    },
  });

  assert.deepEqual(plan, {
    mode: 'dry-run',
    source: 'turso',
    hasSlug: true,
    stage: 'prepublish',
    rubricVersion: 'blog-writing-v1',
    hasTursoUrl: true,
    hasTursoAuthToken: true,
  });
});

test('buildCommandPlan supports manual lesson registration summaries', () => {
  const plan = buildCommandPlan({
    command: 'register-lessons',
    options: {
      file: 'lessons.json',
      dryRun: true,
    },
    env: {
      TURSO_URL: 'libsql://example',
      TURSO_AUTH_TOKEN: 'token',
    },
  });

  assert.deepEqual(plan, {
    mode: 'dry-run',
    source: 'manual',
    hasFile: true,
    hasTursoUrl: true,
    hasTursoAuthToken: true,
  });
});

test('buildCommandPlan supports next brief context summaries', () => {
  const plan = buildCommandPlan({
    command: 'next-brief-context',
    options: {
      limit: '5',
    },
    env: {
      TURSO_URL: 'libsql://example',
      TURSO_AUTH_TOKEN: 'token',
    },
  });

  assert.deepEqual(plan, {
    mode: 'live',
    source: 'turso',
    limit: 5,
    hasTursoUrl: true,
    hasTursoAuthToken: true,
  });
});

test('buildCommandPlan supports reward version seeding summaries', () => {
  const plan = buildCommandPlan({
    command: 'seed-reward-version',
    options: {
      version: 'v0.1',
      dryRun: true,
    },
    env: {
      TURSO_URL: 'libsql://example',
      TURSO_AUTH_TOKEN: 'token',
    },
  });

  assert.deepEqual(plan, {
    mode: 'dry-run',
    source: 'turso',
    version: 'v0.1',
    hasTursoUrl: true,
    hasTursoAuthToken: true,
  });
});
