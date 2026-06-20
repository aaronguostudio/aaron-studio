# Blog Reinforcement Loop v0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the first blog self-improvement loop so each published article can be registered, measured, reviewed, written back to `growth_ai_reviews`, and used by the next article brief.

**Architecture:** Extend the existing `scripts/blog-growth` CLI and focused helper modules. Keep Turso as the persistence boundary, use dry-run output for safe inspection, and update blog workflow skills so the next writing run reads `next-brief-context`.

**Tech Stack:** Node.js ESM, Node built-in `node:test`, Turso/libSQL HTTP pipeline, Rybbit API, existing YouTube OAuth helper, local markdown/JSON/CSV files, Aaron Studio skills.

---

## File Structure

- Modify `docs/blog-growth/schema.sql`: add `growth_reward_versions` and a small unique index for URL-based channel post fallback.
- Modify `scripts/blog-growth/lib/content.mjs`: normalize frontmatter dates to ISO and preserve raw dates.
- Modify `scripts/blog-growth/lib/ingest.mjs`: add channel post upsert builders, LinkedIn metric builders, YouTube metric builders, postmortem review builders, next-brief context helpers, and reward version seed SQL helpers.
- Modify `scripts/blog-growth/lib/sql.mjs`: add a reusable Turso result-row parser for CLI commands that read query output.
- Modify `scripts/blog-growth/cli.mjs`: add command-plan summaries for new commands.
- Modify `scripts/blog-growth/main.mjs`: add `normalize-content-dates`, `register-channel-posts`, `ingest-youtube`, `import-linkedin`, `postmortem`, and `next-brief-context`.
- Create `scripts/blog-growth/lib/csv.mjs`: parse simple CSV for LinkedIn import without adding dependencies.
- Create `scripts/blog-growth/lib/youtube.mjs`: isolate YouTube Analytics/Data API request shaping and metric normalization.
- Add tests under `scripts/blog-growth/test/`.
- Modify `tiles/blog-production/SKILL.md`, `tiles/blog-write/SKILL.md`, and `tiles/publish-to-blog/SKILL.md`: make the reinforcement loop part of normal blog workflow.

---

### Task 1: Normalize Content Dates

**Files:**
- Modify: `scripts/blog-growth/lib/content.mjs`
- Modify: `scripts/blog-growth/lib/ingest.mjs`
- Modify: `scripts/blog-growth/main.mjs`
- Test: `scripts/blog-growth/test/content.test.mjs`
- Test: `scripts/blog-growth/test/ingest.test.mjs`

- [ ] **Step 1: Write failing date parser tests**

Add these tests to `scripts/blog-growth/test/content.test.mjs`:

```js
test('parseBlogMarkdown normalizes common publication date formats', () => {
  const iso = parseBlogMarkdown({
    filePath: 'src/content/blogs/2026-06-15/fable.md',
    text: `---
title: Fable
date: 15th Jun 2026
---

Body.
`,
  });

  const long = parseBlogMarkdown({
    filePath: 'src/content/blogs/2026-06-16/example.md',
    text: `---
title: Example
date: June 16, 2026
---

Body.
`,
  });

  assert.equal(iso.date, '2026-06-15');
  assert.equal(iso.rawDate, '15th Jun 2026');
  assert.equal(long.date, '2026-06-16');
  assert.equal(long.rawDate, 'June 16, 2026');
});

test('parseBlogMarkdown keeps invalid raw date and returns null normalized date', () => {
  const parsed = parseBlogMarkdown({
    filePath: 'src/content/blogs/example.md',
    text: `---
title: Example
date: next someday
---

Body.
`,
  });

  assert.equal(parsed.date, null);
  assert.equal(parsed.rawDate, 'next someday');
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
node --test scripts/blog-growth/test/content.test.mjs
```

Expected: FAIL because `rawDate` does not exist and display dates are not normalized.

- [ ] **Step 3: Implement date normalization**

In `scripts/blog-growth/lib/content.mjs`, add `normalizeBlogDate(raw)` and call it from `parseBlogMarkdown`.

Expected behavior:

```js
const rawDate = meta.date || null;
const normalizedDate = normalizeBlogDate(rawDate);

return {
  filePath,
  slug,
  title: meta.title || slug,
  date: normalizedDate,
  rawDate,
  tags: Array.isArray(meta.tags) ? meta.tags : [],
  youtube: meta.youtube || null,
  language,
  canonicalPath: language === 'zh' ? `/zh/blogs/${slug}` : `/blogs/${slug}`,
  wordCount: countWords(body),
  rawMetadata: meta,
};
```

The helper should support ISO, ordinal day month year, non-ordinal day month year, and month day year. It should return `null` for invalid values.

- [ ] **Step 4: Preserve raw date in content ingest metadata**

Update `buildContentItemUpsertStatement()` in `scripts/blog-growth/lib/ingest.mjs` so `raw_metadata_json` includes `rawDate` when present and `published_at` uses the normalized `item.date`.

Add an assertion to `buildContentIngestStatements upserts content and maps canonical paths`:

```js
assert.match(statements[0], /'2026-06-15'/);
```

- [ ] **Step 5: Add dry-run command summary**

Add `normalize-content-dates` to `buildCommandPlan()` in `scripts/blog-growth/cli.mjs` and `main()` in `scripts/blog-growth/main.mjs`.

Dry-run output should include:

```json
{
  "command": "normalize-content-dates",
  "mode": "dry-run",
  "total": 38,
  "normalized": 38,
  "nullDates": 0,
  "unparseable": []
}
```

- [ ] **Step 6: Run tests**

Run:

```bash
node --test scripts/blog-growth/test/content.test.mjs scripts/blog-growth/test/ingest.test.mjs scripts/blog-growth/test/cli.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add scripts/blog-growth/lib/content.mjs scripts/blog-growth/lib/ingest.mjs scripts/blog-growth/main.mjs scripts/blog-growth/cli.mjs scripts/blog-growth/test/content.test.mjs scripts/blog-growth/test/ingest.test.mjs scripts/blog-growth/test/cli.test.mjs
git commit -m "Fix blog growth publication date normalization"
```

---

### Task 2: Register Channel Posts

**Files:**
- Modify: `docs/blog-growth/schema.sql`
- Modify: `scripts/blog-growth/lib/ingest.mjs`
- Modify: `scripts/blog-growth/main.mjs`
- Modify: `scripts/blog-growth/cli.mjs`
- Test: `scripts/blog-growth/test/ingest.test.mjs`
- Test: `scripts/blog-growth/test/cli.test.mjs`

- [ ] **Step 1: Write failing channel post builder tests**

Add to `scripts/blog-growth/test/ingest.test.mjs`:

```js
import { buildChannelPostUpsertStatements } from '../lib/ingest.mjs';

test('buildChannelPostUpsertStatements upserts registered distribution posts', () => {
  const statements = buildChannelPostUpsertStatements({
    slug: 'fable-5-managing-ai-autonomy',
    posts: [
      {
        channel: 'youtube',
        channel_post_id: 'jPHR-73HJa8',
        channel_url: 'https://www.youtube.com/watch?v=jPHR-73HJa8',
        title: 'Fable 5 Changed the Unit of AI Work',
        language: 'en',
        post_type: 'video',
        cta_type: 'blog_click',
        published_at: '2026-06-15',
      },
    ],
  });

  assert.equal(statements.length, 1);
  assert.match(statements[0], /INSERT INTO growth_channel_posts/);
  assert.match(statements[0], /SELECT id FROM growth_content_items WHERE slug = 'fable-5-managing-ai-autonomy'/);
  assert.match(statements[0], /'youtube'/);
  assert.match(statements[0], /'jPHR-73HJa8'/);
  assert.match(statements[0], /ON CONFLICT\(channel, channel_post_id\) DO UPDATE SET/);
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
node --test scripts/blog-growth/test/ingest.test.mjs
```

Expected: FAIL because `buildChannelPostUpsertStatements` is not exported.

- [ ] **Step 3: Implement channel post upsert SQL builder**

Add `buildChannelPostUpsertStatements(distribution)` to `scripts/blog-growth/lib/ingest.mjs`.

Rules:

- Validate `distribution.slug`.
- Validate `posts` is an array.
- Use `contentIdentitySlug` for slug matching only when a `language`-specific slug is supplied by caller; otherwise use the manifest slug exactly.
- Allow channels already accepted by schema.
- Normalize missing `language` to `en`.
- Use SQL `ON CONFLICT(channel, channel_post_id)` when `channel_post_id` exists.
- For URL-only rows, use a new unique index in schema:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_growth_channel_posts_content_url
  ON growth_channel_posts(content_item_id, channel, channel_url)
  WHERE channel_post_id IS NULL AND channel_url IS NOT NULL;
```

- [ ] **Step 4: Add CLI command planning and dry-run**

Add `register-channel-posts` to `buildCommandPlan()` with:

```js
{
  mode: options.dryRun ? 'dry-run' : 'live',
  source: 'manual',
  hasFile: Boolean(options.file),
  hasTursoUrl: Boolean(env.TURSO_URL),
  hasTursoAuthToken: Boolean(env.TURSO_AUTH_TOKEN)
}
```

Add `main()` behavior:

- Require `--file`.
- Parse JSON.
- Build statements.
- In dry-run, print statement count and sanitized post summary.
- In live mode, execute statements through Turso.

- [ ] **Step 5: Run tests**

Run:

```bash
node --test scripts/blog-growth/test/ingest.test.mjs scripts/blog-growth/test/cli.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add docs/blog-growth/schema.sql scripts/blog-growth/lib/ingest.mjs scripts/blog-growth/main.mjs scripts/blog-growth/cli.mjs scripts/blog-growth/test/ingest.test.mjs scripts/blog-growth/test/cli.test.mjs
git commit -m "Add blog growth channel post registration"
```

---

### Task 3: Ingest YouTube Metrics

**Files:**
- Create: `scripts/blog-growth/lib/youtube.mjs`
- Modify: `scripts/blog-growth/lib/ingest.mjs`
- Modify: `scripts/blog-growth/lib/sql.mjs`
- Modify: `scripts/blog-growth/main.mjs`
- Modify: `scripts/blog-growth/cli.mjs`
- Test: `scripts/blog-growth/test/youtube.test.mjs`
- Test: `scripts/blog-growth/test/sql.test.mjs`

- [ ] **Step 1: Write failing YouTube normalization tests**

Create `scripts/blog-growth/test/youtube.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildYoutubeAnalyticsUrl, normalizeYoutubeAnalyticsRows } from '../lib/youtube.mjs';

test('buildYoutubeAnalyticsUrl creates day and video query', () => {
  const url = buildYoutubeAnalyticsUrl({
    start: '2026-06-15',
    end: '2026-06-22',
    videoId: 'jPHR-73HJa8',
  });

  assert.equal(url.origin, 'https://youtubeanalytics.googleapis.com');
  assert.equal(url.searchParams.get('ids'), 'channel==MINE');
  assert.equal(url.searchParams.get('filters'), 'video==jPHR-73HJa8');
  assert.equal(url.searchParams.get('dimensions'), 'day,video');
});

test('normalizeYoutubeAnalyticsRows maps API rows to canonical metric rows', () => {
  const rows = normalizeYoutubeAnalyticsRows({
    channelPostId: 12,
    videoId: 'jPHR-73HJa8',
    report: {
      columnHeaders: [
        { name: 'day' },
        { name: 'video' },
        { name: 'views' },
        { name: 'estimatedMinutesWatched' },
        { name: 'averageViewDuration' },
        { name: 'subscribersGained' },
        { name: 'likes' },
        { name: 'comments' },
      ],
      rows: [['2026-06-15', 'jPHR-73HJa8', 5, 2, 24, 1, 1, 0]],
    },
  });

  assert.deepEqual(rows.map((row) => row.metric_name), [
    'youtube_views',
    'youtube_watch_minutes',
    'youtube_average_view_duration_seconds',
    'youtube_subscribers_gained',
    'youtube_likes',
    'youtube_comments',
  ]);
  assert.equal(rows[0].entity_type, 'channel_post');
  assert.equal(rows[0].entity_id, 12);
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
node --test scripts/blog-growth/test/youtube.test.mjs
```

Expected: FAIL because `lib/youtube.mjs` does not exist.

- [ ] **Step 3: Implement YouTube helper**

Create `scripts/blog-growth/lib/youtube.mjs` with:

- `buildYoutubeAnalyticsUrl({ start, end, videoId })`
- `normalizeYoutubeAnalyticsRows({ channelPostId, videoId, report })`
- `fetchYoutubeJson({ accessToken, url, fetchImpl = fetch })`

Map Analytics names to canonical metric names:

```js
const YOUTUBE_METRIC_MAP = {
  views: ['youtube_views', 'count'],
  estimatedMinutesWatched: ['youtube_watch_minutes', 'minutes'],
  averageViewDuration: ['youtube_average_view_duration_seconds', 'seconds'],
  subscribersGained: ['youtube_subscribers_gained', 'count'],
  likes: ['youtube_likes', 'count'],
  comments: ['youtube_comments', 'count'],
};
```

- [ ] **Step 4: Add SQL row parsing helper**

Add to `scripts/blog-growth/lib/sql.mjs`:

```js
export function rowsFromTursoResult(result) {
  const payload = result?.response?.result || result?.result || result;
  const cols = (payload?.cols || []).map((col) => col.name);
  const rows = payload?.rows || [];
  return rows.map((row) => Object.fromEntries(row.map((cell, index) => [cols[index], cell?.value ?? null])));
}
```

Add a test in `sql.test.mjs` for this helper.

- [ ] **Step 5: Add metric statement builder**

Add `buildMetricSnapshotUpsertStatement()` reuse in `ingest.mjs` for rows returned by `normalizeYoutubeAnalyticsRows`.

- [ ] **Step 6: Add `ingest-youtube` CLI**

In `main.mjs`:

- Query registered YouTube posts:

```sql
SELECT cp.id, cp.channel_post_id, cp.content_item_id, ci.slug
FROM growth_channel_posts cp
JOIN growth_content_items ci ON ci.id = cp.content_item_id
WHERE cp.channel = 'youtube'
```

- Filter by `--slugs` when provided.
- Import `getAccessToken` dynamically from `tiles/aaron-yt-pipeline/scripts/youtube-auth.ts` only in live mode.
- Query each video with `buildYoutubeAnalyticsUrl`.
- Convert rows to metric statements.
- Execute Turso statements.
- In dry-run, print selected videos and date window without calling YouTube.

- [ ] **Step 7: Run tests**

Run:

```bash
node --test scripts/blog-growth/test/youtube.test.mjs scripts/blog-growth/test/sql.test.mjs scripts/blog-growth/test/cli.test.mjs
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add scripts/blog-growth/lib/youtube.mjs scripts/blog-growth/lib/sql.mjs scripts/blog-growth/lib/ingest.mjs scripts/blog-growth/main.mjs scripts/blog-growth/cli.mjs scripts/blog-growth/test/youtube.test.mjs scripts/blog-growth/test/sql.test.mjs scripts/blog-growth/test/cli.test.mjs
git commit -m "Add YouTube analytics ingestion for blog growth"
```

---

### Task 4: Import LinkedIn Metrics From CSV

**Files:**
- Create: `scripts/blog-growth/lib/csv.mjs`
- Modify: `scripts/blog-growth/lib/ingest.mjs`
- Modify: `scripts/blog-growth/main.mjs`
- Modify: `scripts/blog-growth/cli.mjs`
- Test: `scripts/blog-growth/test/csv.test.mjs`
- Test: `scripts/blog-growth/test/ingest.test.mjs`

- [ ] **Step 1: Write failing CSV parser test**

Create `scripts/blog-growth/test/csv.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsvText } from '../lib/csv.mjs';

test('parseCsvText parses quoted commas and blank metric cells', () => {
  const rows = parseCsvText('slug,channel_post_id,metric_date,impressions,comments\\n\"fable,post\",abc,2026-06-15,120,\\n');
  assert.deepEqual(rows, [
    {
      slug: 'fable,post',
      channel_post_id: 'abc',
      metric_date: '2026-06-15',
      impressions: '120',
      comments: '',
    },
  ]);
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
node --test scripts/blog-growth/test/csv.test.mjs
```

Expected: FAIL because `lib/csv.mjs` does not exist.

- [ ] **Step 3: Implement CSV parser**

Create `parseCsvText(text)` in `scripts/blog-growth/lib/csv.mjs`. Support headers, quoted fields, escaped quotes, commas in quoted fields, and blank cells.

- [ ] **Step 4: Write LinkedIn metric builder test**

Add to `scripts/blog-growth/test/ingest.test.mjs`:

```js
import { buildLinkedInMetricStatements } from '../lib/ingest.mjs';

test('buildLinkedInMetricStatements maps CSV row values to canonical metrics', () => {
  const statements = buildLinkedInMetricStatements({
    channelPostId: 22,
    channelPostExternalId: 'urn:li:share:123',
    row: {
      metric_date: '2026-06-15',
      impressions: '100',
      members_reached: '80',
      reactions: '5',
      comments: '',
      reshares: '1',
      link_clicks: '3',
      followers_gained: '0',
    },
  });

  const sql = statements.join('\\n');
  assert.match(sql, /'linkedin_impressions'/);
  assert.match(sql, /'linkedin_members_reached'/);
  assert.match(sql, /'linkedin_reactions'/);
  assert.doesNotMatch(sql, /'linkedin_comments'/);
  assert.match(sql, /'linkedin_reshares'/);
  assert.match(sql, /'linkedin_link_clicks'/);
  assert.match(sql, /'linkedin_followers_gained'/);
});
```

- [ ] **Step 5: Implement LinkedIn builder and CLI**

Add `buildLinkedInMetricStatements()` to `ingest.mjs`.

Add `import-linkedin` to `main.mjs`:

- Parse CSV.
- Query registered LinkedIn posts by `channel_post_id`.
- Fail unmatched rows with a clear message.
- Dry-run prints row count, matched count, unmatched rows, and statement count.
- Live mode executes metric statements.

- [ ] **Step 6: Run tests**

Run:

```bash
node --test scripts/blog-growth/test/csv.test.mjs scripts/blog-growth/test/ingest.test.mjs scripts/blog-growth/test/cli.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add scripts/blog-growth/lib/csv.mjs scripts/blog-growth/lib/ingest.mjs scripts/blog-growth/main.mjs scripts/blog-growth/cli.mjs scripts/blog-growth/test/csv.test.mjs scripts/blog-growth/test/ingest.test.mjs scripts/blog-growth/test/cli.test.mjs
git commit -m "Add LinkedIn CSV metrics import"
```

---

### Task 5: Generate and Store Postmortems

**Files:**
- Modify: `scripts/blog-growth/lib/ingest.mjs`
- Modify: `scripts/blog-growth/main.mjs`
- Modify: `scripts/blog-growth/cli.mjs`
- Test: `scripts/blog-growth/test/ingest.test.mjs`

- [ ] **Step 1: Write failing postmortem builder test**

Add to `scripts/blog-growth/test/ingest.test.mjs`:

```js
import { buildAiReviewInsertStatement, buildPostmortemReview } from '../lib/ingest.mjs';

test('buildPostmortemReview creates compact review from metrics', () => {
  const review = buildPostmortemReview({
    slug: 'fable-5-managing-ai-autonomy',
    title: 'Fable 5 Changed the Unit of AI Work',
    window: '7d',
    periodStart: '2026-06-15',
    periodEnd: '2026-06-22',
    scorecard: {
      pageviews: 16,
      unique_visitors: 9,
      scroll_75: 4,
      scroll_100: 4,
      qualified_engaged_audience_score: 29,
    },
    channelMetrics: [],
    knownGaps: ['linkedin_manual_import_missing'],
    rewardVersion: 'v0.1',
  });

  assert.match(review.summary, /Fable 5 Changed the Unit of AI Work/);
  assert.equal(review.review_type, 'postmortem_7d');
  assert.equal(review.raw_context.reward_version, 'v0.1');
  assert.equal(review.insights.some((item) => item.type === 'content_pattern'), true);
  assert.equal(review.recommended_actions.some((item) => item.owner === 'blog-growth'), true);
});

test('buildAiReviewInsertStatement writes postmortem JSON fields', () => {
  const sql = buildAiReviewInsertStatement({
    review_type: 'postmortem_7d',
    period_start: '2026-06-15',
    period_end: '2026-06-22',
    content_item_id_sql: "(SELECT id FROM growth_content_items WHERE slug = 'fable-5-managing-ai-autonomy')",
    summary: 'Review summary',
    insights: [{ type: 'content_pattern' }],
    recommended_actions: [{ action: 'Repeat pattern' }],
    raw_context: { reward_version: 'v0.1' },
  });

  assert.match(sql, /INSERT INTO growth_ai_reviews/);
  assert.match(sql, /'postmortem_7d'/);
  assert.match(sql, /'Review summary'/);
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
node --test scripts/blog-growth/test/ingest.test.mjs
```

Expected: FAIL because postmortem helpers do not exist.

- [ ] **Step 3: Implement postmortem helpers**

Add:

- `buildPostmortemReview(input)`
- `buildAiReviewInsertStatement(review)`
- `windowToReviewType(window)`
- `metricWindowFromPublishedAt(publishedAt, window)`

Keep the generated review deterministic and compact. Do not call a model API.

- [ ] **Step 4: Add `postmortem` CLI**

Command:

```bash
node scripts/blog-growth.mjs postmortem --slug <slug> --window 7d
```

Behavior:

- Query content item.
- Calculate metric window from ISO `published_at`.
- Query aggregate content scorecard metrics.
- Query linked channel metrics.
- Build review.
- Dry-run prints review JSON.
- Live mode inserts into `growth_ai_reviews`.

- [ ] **Step 5: Run tests**

Run:

```bash
node --test scripts/blog-growth/test/ingest.test.mjs scripts/blog-growth/test/cli.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/blog-growth/lib/ingest.mjs scripts/blog-growth/main.mjs scripts/blog-growth/cli.mjs scripts/blog-growth/test/ingest.test.mjs scripts/blog-growth/test/cli.test.mjs
git commit -m "Add blog growth postmortem writeback"
```

---

### Task 6: Add Next-Brief Context

**Files:**
- Modify: `scripts/blog-growth/lib/ingest.mjs`
- Modify: `scripts/blog-growth/main.mjs`
- Modify: `scripts/blog-growth/cli.mjs`
- Test: `scripts/blog-growth/test/ingest.test.mjs`

- [ ] **Step 1: Write failing next-brief context test**

Add to `scripts/blog-growth/test/ingest.test.mjs`:

```js
import { buildNextBriefContext } from '../lib/ingest.mjs';

test('buildNextBriefContext summarizes recent reviews and top content', () => {
  const context = buildNextBriefContext({
    reviews: [
      {
        review_type: 'postmortem_7d',
        summary: 'Practical AI explainers performed best.',
        insights_json: JSON.stringify([{ type: 'content_pattern', label: 'practical_ai_explainer' }]),
        recommended_actions_json: JSON.stringify([{ action: 'Write another concrete AI explainer', priority: 'high' }]),
      },
    ],
    topContent: [
      {
        slug: 'chatgpt-explained-kitchen-metaphor',
        title: 'No Magic: How ChatGPT Actually Works, Explained in One Kitchen',
        qualified_engaged_audience_score: 69,
      },
    ],
    caveats: ['LinkedIn manual import missing'],
  });

  assert.equal(context.winning_patterns.includes('practical_ai_explainer'), true);
  assert.equal(context.recommended_actions[0], 'Write another concrete AI explainer');
  assert.equal(context.top_content[0].slug, 'chatgpt-explained-kitchen-metaphor');
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
node --test scripts/blog-growth/test/ingest.test.mjs
```

Expected: FAIL because `buildNextBriefContext` does not exist.

- [ ] **Step 3: Implement next-brief context builder**

Add `buildNextBriefContext({ reviews, topContent, caveats })`.

The returned object should include:

- `winning_patterns`
- `weak_patterns`
- `recommended_actions`
- `top_content`
- `measurement_caveats`
- `next_experiment`

- [ ] **Step 4: Add `next-brief-context` CLI**

Command:

```bash
node scripts/blog-growth.mjs next-brief-context --limit 5
```

Behavior:

- Read recent `growth_ai_reviews`.
- Read top lifetime scorecard rows.
- Return compact JSON.
- No live external APIs.

- [ ] **Step 5: Run tests**

Run:

```bash
node --test scripts/blog-growth/test/ingest.test.mjs scripts/blog-growth/test/cli.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/blog-growth/lib/ingest.mjs scripts/blog-growth/main.mjs scripts/blog-growth/cli.mjs scripts/blog-growth/test/ingest.test.mjs scripts/blog-growth/test/cli.test.mjs
git commit -m "Add next brief context for blog reinforcement"
```

---

### Task 7: Update Blog Workflow Skills

**Files:**
- Modify: `tiles/blog-production/SKILL.md`
- Modify: `tiles/blog-write/SKILL.md`
- Modify: `tiles/publish-to-blog/SKILL.md`

- [ ] **Step 1: Update `blog-production` start gate**

Add a required reinforcement-memory step near the start of `tiles/blog-production/SKILL.md`:

```md
Before outline or writing begins, run or inspect:

`node scripts/blog-growth.mjs next-brief-context --limit 5`

Use the result to name:
- one pattern to reuse
- one pattern to avoid
- one measurement caveat
- the current next experiment
```

- [ ] **Step 2: Update `blog-write` depth gate**

Add a drafting gate:

```md
When drafting or revising, use recent blog-growth review lessons when available. The draft must state the article hypothesis, target audience, expected distribution channel, success metric, and which recent lesson it is applying or intentionally rejecting.
```

- [ ] **Step 3: Update `publish-to-blog` post-publish gate**

Add post-publish reinforcement steps:

```md
After publish:
1. Run `node scripts/blog-growth.mjs ingest-after-publish`.
2. Create or update `distribution.json` when LinkedIn, YouTube, newsletter, or X artifacts exist.
3. Run `node scripts/blog-growth.mjs register-channel-posts --file <distribution.json>` when the manifest exists.
4. Plan the 24h and 7d postmortem commands.
```

- [ ] **Step 4: Run skill sync**

Run:

```bash
scripts/sync-agent-skills.sh
```

Expected: completes without errors.

- [ ] **Step 5: Commit**

```bash
git add tiles/blog-production/SKILL.md tiles/blog-write/SKILL.md tiles/publish-to-blog/SKILL.md
git commit -m "Wire blog reinforcement loop into publishing skills"
```

---

### Task 8: End-to-End Verification

**Files:**
- No new source files unless a smoke artifact is useful under `docs/blog-growth/runs/`.

- [ ] **Step 1: Run full blog-growth test suite**

Run:

```bash
node --test scripts/blog-growth/test/*.test.mjs
```

Expected: PASS.

- [ ] **Step 2: Run dry-run CLI checks**

Run:

```bash
node scripts/blog-growth.mjs normalize-content-dates --dry-run
node scripts/blog-growth.mjs register-channel-posts --file src/content/blogs/2026-06-15/distribution.json --dry-run
node scripts/blog-growth.mjs ingest-youtube --start 2026-06-15 --end 2026-06-22 --slugs fable-5-managing-ai-autonomy --dry-run
node scripts/blog-growth.mjs postmortem --slug fable-5-managing-ai-autonomy --window 7d --dry-run
node scripts/blog-growth.mjs next-brief-context --limit 5
```

Expected:

- Date command reports zero unparseable dates after live normalization.
- Register command reports selected channel posts or a clear missing-file message if no manifest exists yet.
- YouTube dry-run selects registered videos without calling external API.
- Postmortem dry-run prints a structured review or a clear missing-data finding.
- Next brief context prints compact JSON.

- [ ] **Step 3: Run safe live checks where data exists**

Run only when matching manifests and credentials exist:

```bash
node scripts/blog-growth.mjs normalize-content-dates
node scripts/blog-growth.mjs register-channel-posts --file <real distribution.json>
node scripts/blog-growth.mjs ingest-youtube --start 2026-06-15 --end 2026-06-22 --slugs fable-5-managing-ai-autonomy
node scripts/blog-growth.mjs postmortem --slug fable-5-managing-ai-autonomy --window 7d
```

Expected: Turso writes succeed and output redacts secrets.

- [ ] **Step 4: Commit final verification artifact if created**

If a run note is created:

```bash
git add docs/blog-growth/runs/<run-note>.md
git commit -m "Record blog reinforcement loop smoke test"
```

