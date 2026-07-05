# Blog Feedback Loop V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first usable evaluation and feedback loop for Aaron's blog workflow, connecting pre-publish rubric evaluation, post-publish outcomes, reusable lessons, and next-brief context.

**Architecture:** Extend the existing `blog-growth` SQLite/Turso model instead of creating a separate system. Add deterministic helper functions and CLI paths that can store content evaluations, extract lessons from postmortems, and feed those lessons into `next-brief-context` for future `blog-write` runs.

**Tech Stack:** Node ESM CLI, SQLite/Turso SQL strings, `node:test`, existing `scripts/blog-growth` modules, markdown skill docs.

---

### Task 1: Add Failing Tests For Evaluations And Lessons

**Files:**
- Modify: `scripts/blog-growth/test/ingest.test.mjs`
- Modify: `scripts/blog-growth/test/cli.test.mjs`

- [ ] **Step 1: Write failing ingest helper tests**

Add tests that import and assert:
- `buildContentEvaluationInsertStatement` writes to `growth_content_evaluations`.
- `buildLessonUpsertStatements` converts postmortem insights/actions into `growth_lessons`.
- `buildNextBriefContext` includes `lessons` and uses the highest-priority lesson for `next_experiment`.

- [ ] **Step 2: Write failing CLI plan tests**

Add tests that assert `buildCommandPlan` supports:
- `evaluate-content`
- `register-lessons`

- [ ] **Step 3: Run tests to verify RED**

Run:

```bash
node --test scripts/blog-growth/test/*.test.mjs
```

Expected: failure because the new exported functions and command plans do not exist yet.

### Task 2: Extend Schema And Docs

**Files:**
- Modify: `docs/blog-growth/schema.sql`
- Modify: `docs/blog-growth/README.md`

- [ ] **Step 1: Add tables**

Add:
- `growth_rubric_versions`
- `growth_content_evaluations`
- `growth_lessons`

- [ ] **Step 2: Document the loop**

Update README with:
- pre-publish evaluation command
- postmortem-to-lessons behavior
- next-brief context behavior
- caveat that the scoring is deterministic V1, not statistical causality

### Task 3: Implement Evaluation And Lesson Helpers

**Files:**
- Modify: `scripts/blog-growth/lib/ingest.mjs`

- [ ] **Step 1: Implement minimal helper exports**

Add:
- `DEFAULT_RUBRIC_SCORES`
- `buildContentEvaluation`
- `buildContentEvaluationInsertStatement`
- `buildLessonUpsertStatements`

- [ ] **Step 2: Enhance next brief context**

Change `buildNextBriefContext` to accept `lessons = []`, return normalized lesson records, and choose `next_experiment` from high-confidence/high-priority lessons before fallback actions.

- [ ] **Step 3: Run tests to verify GREEN**

Run:

```bash
node --test scripts/blog-growth/test/*.test.mjs
```

Expected: tests for helper functions pass.

### Task 4: Implement CLI Commands

**Files:**
- Modify: `scripts/blog-growth/cli.mjs`
- Modify: `scripts/blog-growth/main.mjs`

- [ ] **Step 1: Add command plans**

Support `evaluate-content` and `register-lessons` in `buildCommandPlan`.

- [ ] **Step 2: Add `evaluate-content`**

Implement a deterministic CLI path that accepts `--slug`, optional `--file`, `--stage`, and `--rubric-version`, builds an evaluation payload, and writes it to `growth_content_evaluations` unless `--dry-run` is set.

- [ ] **Step 3: Add lesson persistence to `postmortem`**

After writing a postmortem review, also write lesson upserts derived from the review. Dry-run should show the lesson records without writing.

- [ ] **Step 4: Add `register-lessons`**

Read a small JSON file with `slug` and `lessons`, then upsert them into `growth_lessons`. This is the manual fallback for editorial lessons that do not come from metrics.

- [ ] **Step 5: Update `next-brief-context` query**

Query recent active lessons and pass them into `buildNextBriefContext`.

### Task 5: Connect Blog Writing Workflow

**Files:**
- Modify: `tiles/blog-write/SKILL.md`
- Modify: `tiles/blog-production/SKILL.md`
- Modify: `docs/blog-growth/runs/2026-07-01-blog-feedback-loop-v1.md`

- [ ] **Step 1: Update workflow rules**

Require future blog runs to call `next-brief-context` before the outline/depth pass when growth env is available, and to explicitly use or reject at least one lesson.

- [ ] **Step 2: Add smoke run notes**

Create a run note documenting commands, behavior, verification, and remaining caveats.

### Task 6: Verify

**Files:**
- Test: `scripts/blog-growth/test/*.test.mjs`
- Test: `tiles/blog-write/scripts/*.test.ts`

- [ ] **Step 1: Run Node tests**

```bash
node --test scripts/blog-growth/test/*.test.mjs
```

- [ ] **Step 2: Run blog-write tests**

```bash
npx -y bun test tiles/blog-write/scripts/*.test.ts
```

- [ ] **Step 3: Run workflow validation**

```bash
scripts/validate-workflows.sh
```

- [ ] **Step 4: Smoke dry-run**

```bash
node scripts/blog-growth.mjs evaluate-content --slug one-person-project-ai-coding --dry-run
node scripts/blog-growth.mjs next-brief-context --limit 5
```
