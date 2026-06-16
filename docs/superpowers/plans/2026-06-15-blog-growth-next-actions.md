# Blog Growth Next Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute the approved blog-growth next actions: enable richer Rybbit ingestion, keep content ingestion current after publishing, add UTM defaults, and attempt YouTube Analytics API enablement.

**Architecture:** Keep the local feedback loop in the existing dependency-light `scripts/blog-growth` ESM CLI. Add small pure helpers with `node:test` coverage, then wire them into `main.mjs`; update skill docs so future publishing agents run the new command and use UTM defaults. Treat Google Cloud API enablement as an external setup step with browser/API verification.

**Tech Stack:** Node ESM, `node:test`, Turso/libSQL HTTP pipeline, Rybbit Stats API, Bun TypeScript scripts for YouTube publishing, Codex skill Markdown.

---

### Task 1: Rybbit Event Ingestion

**Files:**
- Modify: `scripts/blog-growth/lib/rybbit.mjs`
- Modify: `scripts/blog-growth/lib/ingest.mjs`
- Modify: `scripts/blog-growth/main.mjs`
- Test: `scripts/blog-growth/test/rybbit.test.mjs`
- Test: `scripts/blog-growth/test/ingest.test.mjs`

- [ ] **Step 1: Write failing tests for event aggregation**

Add tests showing `buildEventsUrl` builds `/events`, `normalizeEventRowsByDay` counts `scroll_75`, `scroll_100`, and `outbound_click`, and `buildRybbitPathMetricStatements` emits `scroll_75`, `scroll_100`, and `outbound_clicks` SQL when event rows are provided.

- [ ] **Step 2: Run red tests**

Run: `node --test scripts/blog-growth/test/rybbit.test.mjs scripts/blog-growth/test/ingest.test.mjs`
Expected: FAIL because the new helpers/parameters do not exist.

- [ ] **Step 3: Implement event helpers and SQL mapping**

Add:
- `eventsPathFilter(pathname)` for Rybbit filters.
- `buildRybbitEventsUrl(...)` for `/events?page_size=...`.
- `normalizeEventRowsByDay(rows, eventNameMap)` returning daily metric counts.
- Extend `buildRybbitPathMetricStatements({ path, raw, eventRows })`.

- [ ] **Step 4: Wire `ingest-rybbit`**

For every selected content item, fetch overview bucketed plus paginated events. Use event names:
- `scroll_75` -> `scroll_75`
- `scroll_100` -> `scroll_100`
- `outbound_click` -> `outbound_clicks`

Include dry-run request counts and metric categories.

- [ ] **Step 5: Run green tests**

Run: `node --test scripts/blog-growth/test/*.test.mjs`
Expected: all tests pass.

### Task 2: Post-Publish Ingestion Command

**Files:**
- Modify: `scripts/blog-growth/main.mjs`
- Modify: `scripts/blog-growth/cli.mjs`
- Modify: `scripts/blog-growth/test/cli.test.mjs`
- Modify: `tiles/publish-to-blog/SKILL.md`
- Modify: `docs/blog-growth/README.md`

- [ ] **Step 1: Write failing CLI tests**

Add `ingest-after-publish` to `buildCommandPlan` tests and verify it requires Turso env.

- [ ] **Step 2: Run red test**

Run: `node --test scripts/blog-growth/test/cli.test.mjs`
Expected: FAIL because the command is not implemented.

- [ ] **Step 3: Implement command**

`ingest-after-publish` should run content ingestion for all posts, then optionally run Rybbit ingestion when `--start` and `--end` are provided. It should support `--dry-run`, `--slugs`, `--paths`, and default to content-only if no Rybbit window is passed.

- [ ] **Step 4: Update publish workflow docs**

Add a mandatory post-publish step to run:

```bash
node scripts/blog-growth.mjs ingest-after-publish --dry-run
node scripts/blog-growth.mjs ingest-after-publish
```

For a new post review window, run with `--start YYYY-MM-DD --end YYYY-MM-DD --slugs <slug>`.

### Task 3: UTM Defaults

**Files:**
- Create: `scripts/blog-growth/lib/utm.mjs`
- Create: `scripts/blog-growth/test/utm.test.mjs`
- Modify: `scripts/blog-growth/main.mjs`
- Modify: `scripts/blog-growth/cli.mjs`
- Modify: `tiles/blog-write/SKILL.md`
- Modify: `tiles/aaron-yt-pipeline/scripts/youtube-upload.ts`
- Modify: `tiles/aaron-yt-pipeline/skills/yt-publish/SKILL.md`
- Modify: `docs/blog-growth/README.md`

- [ ] **Step 1: Write failing UTM tests**

Test default mappings:
- LinkedIn -> `utm_source=linkedin&utm_medium=social`
- YouTube -> `utm_source=youtube&utm_medium=video`
- Newsletter -> `utm_source=newsletter&utm_medium=email`
- X -> `utm_source=x&utm_medium=social`
- Blog -> `utm_source=blog&utm_medium=owned`

Campaign defaults to a slug-like value.

- [ ] **Step 2: Run red tests**

Run: `node --test scripts/blog-growth/test/utm.test.mjs`
Expected: FAIL because `utm.mjs` is missing.

- [ ] **Step 3: Implement UTM helper and CLI**

Add `buildUtmUrl(url, { source, medium, campaign, content })` and CLI command:

```bash
node scripts/blog-growth.mjs utm-url --url https://www.aaronguo.com/blogs/example --source linkedin --campaign example
```

- [ ] **Step 4: Update distribution docs/scripts**

Update `blog-write` to require UTM-tagged final blog links in `linkedin-brief.md`, `newsletter-teaser.md`, and `youtube-metadata.md` once the post is live. Update YouTube upload parsing to support optional `blogUrl` and `campaign` YAML fields and append a tracked link when present.

### Task 4: YouTube Analytics API Enablement

**Files:**
- No repo file edits expected unless documenting status.

- [ ] **Step 1: Check local CLI options**

Check whether `gcloud` is installed. If not, try browser enablement.

- [ ] **Step 2: Try enablement path**

Open:

```text
https://console.developers.google.com/apis/api/youtubeanalytics.googleapis.com/overview?project=245465686932
```

Use Chrome if available because it has the user's Google login state.

- [ ] **Step 3: Verify**

Run YouTube analytics check again. If blocked by permission/UI, report exact user action needed.

### Task 5: Verification

**Files:**
- All touched files.

- [ ] **Step 1: Run full tests**

Run: `node --test scripts/blog-growth/test/*.test.mjs`
Expected: all tests pass.

- [ ] **Step 2: Run dry-runs**

Run:

```bash
node scripts/blog-growth.mjs ingest-after-publish --dry-run
node scripts/blog-growth.mjs ingest-rybbit --start 2026-05-16 --end 2026-06-15 --slugs fable-5-managing-ai-autonomy --dry-run
node scripts/blog-growth.mjs utm-url --url https://www.aaronguo.com/blogs/fable-5-managing-ai-autonomy --source linkedin --campaign fable-5-managing-ai-autonomy
```

- [ ] **Step 3: Summarize verified completion and gaps**

Report exact commands run, pass/fail evidence, and any external Google Cloud action still requiring the user.
