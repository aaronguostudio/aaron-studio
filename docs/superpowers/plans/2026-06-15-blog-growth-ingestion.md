# Blog Growth Ingestion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first executable ingestion layer for Aaron's blog growth loop: load env safely, scan local content, initialize the Turso schema, and preview Rybbit metrics.

**Architecture:** Keep the growth loop in `aaron-studio` because it is the content operating system. Use dependency-light Node ESM scripts with pure functions covered by `node:test`; use the existing SQL schema in `docs/blog-growth/schema.sql`; use Rybbit and Turso HTTP APIs only behind explicit CLI commands and support `--dry-run` first.

**Tech Stack:** Node 22 ESM, built-in `node:test`, built-in `fetch`, SQLite/Turso SQL, Rybbit Stats API.

---

### Task 1: Environment And SQL Utilities

**Files:**
- Create: `scripts/blog-growth/lib/env.mjs`
- Create: `scripts/blog-growth/lib/sql.mjs`
- Create: `scripts/blog-growth/test/env.test.mjs`
- Create: `scripts/blog-growth/test/sql.test.mjs`

- [ ] **Step 1: Write failing tests**

```js
// scripts/blog-growth/test/env.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadEnvText, mergeEnv } from '../lib/env.mjs';

test('loadEnvText parses comments, quoted values, and empty values', () => {
  const parsed = loadEnvText(`
    # comment
    RYBBIT_SITE_ID=82289e0e12a1
    RYBBIT_API_KEY="secret"
    EMPTY=
  `);

  assert.deepEqual(parsed, {
    RYBBIT_SITE_ID: '82289e0e12a1',
    RYBBIT_API_KEY: 'secret',
    EMPTY: '',
  });
});

test('mergeEnv preserves earlier values by default', () => {
  const merged = mergeEnv([{ A: 'first' }, { A: 'second', B: 'two' }]);
  assert.deepEqual(merged, { A: 'first', B: 'two' });
});
```

```js
// scripts/blog-growth/test/sql.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { splitSqlStatements } from '../lib/sql.mjs';

test('splitSqlStatements drops comments and empty chunks', () => {
  const statements = splitSqlStatements(`
    -- comment
    CREATE TABLE demo(id INTEGER);

    INSERT INTO demo VALUES (1);
  `);

  assert.deepEqual(statements, [
    'CREATE TABLE demo(id INTEGER)',
    'INSERT INTO demo VALUES (1)',
  ]);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
node --test scripts/blog-growth/test/env.test.mjs scripts/blog-growth/test/sql.test.mjs
```

Expected: fails because `lib/env.mjs` and `lib/sql.mjs` do not exist.

- [ ] **Step 3: Implement minimal utilities**

Create the functions used by the tests:

- `loadEnvText(text)`
- `mergeEnv(envObjects)`
- `splitSqlStatements(sql)`

- [ ] **Step 4: Verify tests pass**

Run:

```bash
node --test scripts/blog-growth/test/env.test.mjs scripts/blog-growth/test/sql.test.mjs
```

Expected: pass.

### Task 2: Content Scanner

**Files:**
- Create: `scripts/blog-growth/lib/content.mjs`
- Create: `scripts/blog-growth/test/content.test.mjs`

- [ ] **Step 1: Write failing test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBlogMarkdown } from '../lib/content.mjs';

test('parseBlogMarkdown extracts frontmatter and canonical blog paths', () => {
  const parsed = parseBlogMarkdown({
    filePath: 'src/content/blogs/2026-06-15/fable-5-managing-ai-autonomy.md',
    text: `---
title: "Fable 5 Changed the Unit of AI Work"
date: 2026-06-15
slug: fable-5-managing-ai-autonomy
tags: [ai, agents]
youtube: https://youtu.be/example
---

Body text here.
`,
  });

  assert.equal(parsed.slug, 'fable-5-managing-ai-autonomy');
  assert.equal(parsed.title, 'Fable 5 Changed the Unit of AI Work');
  assert.equal(parsed.language, 'en');
  assert.equal(parsed.canonicalPath, '/blogs/fable-5-managing-ai-autonomy');
  assert.equal(parsed.wordCount, 3);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test scripts/blog-growth/test/content.test.mjs
```

Expected: fails because `lib/content.mjs` does not exist.

- [ ] **Step 3: Implement minimal parser**

Parse YAML-ish frontmatter for scalar strings and inline arrays. Derive language from `-zh.md` suffix or path segment.

- [ ] **Step 4: Verify test passes**

Run:

```bash
node --test scripts/blog-growth/test/content.test.mjs
```

Expected: pass.

### Task 3: Rybbit Client And Normalizers

**Files:**
- Create: `scripts/blog-growth/lib/rybbit.mjs`
- Create: `scripts/blog-growth/test/rybbit.test.mjs`

- [ ] **Step 1: Write failing tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRybbitUrl, normalizeOverviewBucketed } from '../lib/rybbit.mjs';

test('buildRybbitUrl builds an authenticated stats endpoint URL without leaking the key', () => {
  const url = buildRybbitUrl({
    baseUrl: 'https://app.rybbit.io',
    siteId: 'site123',
    endpoint: '/overview-bucketed',
    query: {
      bucket: 'day',
      start_date: '2026-06-01',
      end_date: '2026-06-02',
      time_zone: 'America/Edmonton',
    },
  });

  assert.equal(
    url.toString(),
    'https://app.rybbit.io/api/sites/site123/overview-bucketed?bucket=day&start_date=2026-06-01&end_date=2026-06-02&time_zone=America%2FEdmonton',
  );
});

test('normalizeOverviewBucketed converts Rybbit rows into metric snapshots', () => {
  const snapshots = normalizeOverviewBucketed({
    contentItemId: 7,
    raw: {
      data: [
        { time: '2026-06-01T00:00:00.000Z', pageviews: 10, users: 4 },
      ],
    },
  });

  assert.deepEqual(snapshots.map((row) => [row.metric_date, row.metric_name, row.metric_value]), [
    ['2026-06-01', 'pageviews', 10],
    ['2026-06-01', 'unique_visitors', 4],
  ]);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
node --test scripts/blog-growth/test/rybbit.test.mjs
```

Expected: fails because `lib/rybbit.mjs` does not exist.

- [ ] **Step 3: Implement Rybbit URL builder and normalizer**

Use Bearer headers at fetch time; do not put API keys into URLs.

- [ ] **Step 4: Verify test passes**

Run:

```bash
node --test scripts/blog-growth/test/rybbit.test.mjs
```

Expected: pass.

### Task 4: CLI Skeleton

**Files:**
- Create: `scripts/blog-growth.mjs`
- Create: `scripts/blog-growth/test/cli.test.mjs`

- [ ] **Step 1: Write failing CLI behavior tests**

Test argument parsing and dry-run command construction without hitting network.

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test scripts/blog-growth/test/cli.test.mjs
```

Expected: fails because the CLI module does not exist.

- [ ] **Step 3: Implement CLI commands**

Commands:

- `scan-content --dry-run`
- `init-schema --dry-run`
- `rybbit-preview --start YYYY-MM-DD --end YYYY-MM-DD --dry-run`

- [ ] **Step 4: Verify all tests pass**

Run:

```bash
node --test scripts/blog-growth/test/*.test.mjs
```

Expected: pass.

### Task 5: Documentation

**Files:**
- Modify: `docs/blog-growth/README.md`

- [ ] **Step 1: Document commands and current integration status**

Add exact commands for dry-run and live runs, plus required env names.

- [ ] **Step 2: Verify docs mention no secret values**

Run:

```bash
rg -n "(RYBBIT_API_KEY|TURSO_AUTH_TOKEN|LINKEDIN_ACCESS_TOKEN)=.+" docs/blog-growth scripts/blog-growth scripts/blog-growth.mjs
```

Expected: no output.
