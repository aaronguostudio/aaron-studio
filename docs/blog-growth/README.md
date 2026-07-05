# Blog Growth Analytics

This folder defines the first data model for treating Aaron's blog as a content
product with a self-improving feedback loop.

The first version is intentionally not a full reinforcement-learning system.
It is a measurable loop:

1. publish a content item
2. distribute it through channels
3. ingest web, social, and video metrics
4. calculate a quality-weighted reward score
5. run postmortems and weekly reviews
6. feed the learnings back into topic, writing, visual, and video workflows

The V1 feedback loop is intentionally deterministic:

1. store a pre-publish evaluation as a prediction
2. store post-publish metrics as outcomes
3. convert postmortem insights into reusable lessons
4. require the next content brief to use or reject those lessons

## Files

| File | Purpose |
|------|---------|
| `schema.sql` | SQLite/Turso schema, metric catalog, and KPI views |

## CLI

Run these from `/Users/aaronguo/Work/ag/aaron-studio`.

```bash
# Scan published blog markdown from the configured blog repo.
node scripts/blog-growth.mjs scan-content --dry-run --limit 5

# Confirm the Turso schema plan without writing to the database.
node scripts/blog-growth.mjs init-schema --dry-run

# Confirm the Rybbit URL/env without making an API request.
node scripts/blog-growth.mjs rybbit-preview \
  --start 2026-06-08 \
  --end 2026-06-15 \
  --dry-run

# Make a read-only Rybbit API request and print a sanitized summary.
node scripts/blog-growth.mjs rybbit-preview \
  --start 2026-06-08 \
  --end 2026-06-15

# Update the content catalog after publishing.
node scripts/blog-growth.mjs ingest-after-publish --dry-run
node scripts/blog-growth.mjs ingest-after-publish

# Store a pre-publish rubric evaluation for one article.
node scripts/blog-growth.mjs evaluate-content \
  --slug one-person-project-ai-coding \
  --dry-run
node scripts/blog-growth.mjs evaluate-content \
  --slug one-person-project-ai-coding

# Update a new post plus its first Rybbit window.
node scripts/blog-growth.mjs ingest-after-publish \
  --start 2026-06-15 \
  --end 2026-06-22 \
  --slugs fable-5-managing-ai-autonomy

# Generate a tracked distribution URL.
node scripts/blog-growth.mjs utm-url \
  --url https://www.aaronguo.com/blogs/fable-5-managing-ai-autonomy \
  --channel linkedin \
  --campaign fable-5-managing-ai-autonomy \
  --content brief

# Read the context that the next blog brief should use.
node scripts/blog-growth.mjs next-brief-context --limit 5
```

The CLI reads env from `aaron-studio/.env` first, then the configured blog repo
`.env`. It redacts secret values in output.

## Core Objects

| Table | Meaning |
|-------|---------|
| `growth_content_items` | The canonical content asset, usually a blog post |
| `growth_channel_posts` | A distribution object linked to the content item: LinkedIn post, YouTube video, newsletter, X post |
| `growth_metric_snapshots` | Daily normalized metric facts from Rybbit, LinkedIn, YouTube, Beehiiv, or manual import |
| `growth_metric_catalog` | Canonical metric names, definitions, units, and reward weights |
| `growth_rubric_versions` | Versioned editorial rubric definitions for pre-publish evaluation |
| `growth_content_evaluations` | Pre-publish or post-publish rubric evaluations for one content item |
| `growth_lessons` | Reusable lessons generated from postmortems or manual editorial review |
| `growth_experiments` | Hypotheses about topic, hook, CTA, visuals, video, cadence, or distribution |
| `growth_ai_reviews` | AI-generated postmortems, weekly reviews, and strategy updates |
| `growth_ingest_runs` | Audit trail for ingestion jobs |

## Canonical Metric Names

Ingestion scripts should translate source-specific fields into these names before
writing to `growth_metric_snapshots`.

### Rybbit

| Metric | Entity | Notes |
|--------|--------|-------|
| `pageviews` | `content_item` | Blog page views by path |
| `unique_visitors` | `content_item` | Unique readers by path |
| `scroll_75` | `content_item` | Existing custom scroll event |
| `scroll_100` | `content_item` | Existing custom scroll event |
| `newsletter_subscribes` | `content_item` or `site` | Existing newsletter event when attributable |
| `outbound_clicks` | `content_item` or `site` | Social / channel outbound clicks |

`ingest-rybbit` now writes pageviews, unique visitors, `scroll_75`,
`scroll_100`, and `outbound_clicks` for selected paths. Use `--all` to process
the whole catalog, or use `--slugs`/`--paths` for focused post windows.

## UTM Defaults

Generated distribution links should use these defaults:

| Channel | UTM source | UTM medium | Example content |
|---------|------------|------------|-----------------|
| LinkedIn | `linkedin` | `social` | `brief` |
| YouTube | `youtube` | `video` | `description` |
| Newsletter | `newsletter` | `email` | `teaser` |
| X | `x` | `social` | `reply` |
| Blog | `blog` | `owned` | `internal` |

Use `scripts/blog-growth.mjs utm-url` instead of hand-building links.

### LinkedIn

| Metric | Entity | Notes |
|--------|--------|-------|
| `linkedin_impressions` | `channel_post` | Post impressions |
| `linkedin_members_reached` | `channel_post` | Unique reach, if available |
| `linkedin_reactions` | `channel_post` | Reactions |
| `linkedin_comments` | `channel_post` | Comments |
| `linkedin_reshares` | `channel_post` | Reshares / reposts |
| `linkedin_link_clicks` | `channel_post` | Link clicks, if available |
| `linkedin_followers_gained` | `channel_post` | Followers gained from content, if available |

### YouTube

| Metric | Entity | Notes |
|--------|--------|-------|
| `youtube_views` | `channel_post` | Video views |
| `youtube_impressions` | `channel_post` | Thumbnail impressions |
| `youtube_impressions_ctr` | `channel_post` | Decimal ratio, e.g. `0.052` |
| `youtube_watch_minutes` | `channel_post` | Estimated minutes watched |
| `youtube_average_view_duration_seconds` | `channel_post` | Average view duration |
| `youtube_subscribers_gained` | `channel_post` | Subscribers gained from a video |
| `youtube_likes` | `channel_post` | Likes |
| `youtube_comments` | `channel_post` | Comments |

## Main Views

| View | Use |
|------|-----|
| `growth_content_daily_scorecard` | One row per content item per metric day |
| `growth_content_lifetime_scorecard` | Lifetime performance by content item |
| `growth_content_7d_postmortem` | First-seven-days postmortem metrics |
| `growth_weekly_scorecard` | Weekly content product scorecard |
| `growth_topic_scorecard` | Topic/pillar performance comparison |

## Pre-Publish Evaluation

`evaluate-content` creates the prediction side of the loop. It writes a
`growth_content_evaluations` row with:

- rubric version, defaulting to `blog-writing-v1`
- stage, defaulting to `prepublish`
- 0-100 `overall_score`
- per-criterion scores for thesis, evidence, mechanism, stakes, nuance, frame,
  ending, voice, and distribution
- hypothesis, target audience, and success metrics

This score is not the truth. It is a structured prediction that should be
compared against the 24h, 7d, and 30d outcomes.

## Reward Score

`qualified_engaged_audience_score` is an intentionally opinionated starting
score. It weights owned audience and deep engagement more heavily than shallow
reach:

- newsletter subscriptions are much stronger than pageviews
- 75% and 100% scroll depth are stronger than pageviews
- comments and reshares beat reactions
- watch time and subscribers gained matter more than raw video views

The weights live in `growth_metric_catalog` and are duplicated explicitly in
`growth_content_daily_scorecard` so the first version is transparent and easy to
debug.

## Data Needed

### Already Present

The blog already has Rybbit installed with site ID in the Nuxt head script, plus
custom events for scroll depth, newsletter subscription, outbound clicks, and
channel clicks.

### Needed For Automated Ingestion

Use environment variable names, not raw secrets, in repo files.

| Source | Needed |
|--------|--------|
| Rybbit | `RYBBIT_API_KEY` and `RYBBIT_SITE_ID` |
| Turso | existing `TURSO_URL` and `TURSO_AUTH_TOKEN` |
| YouTube | existing OAuth client can be reused, but analytics read needs the `yt-analytics.readonly` OAuth scope |
| LinkedIn | OAuth token/app with member post analytics permission; manual CSV export is a practical fallback if approval is slow |
| Beehiiv | optional `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` if we want subscriber/source attribution beyond Rybbit events |

## Current Integration Status

As of 2026-06-15:

- Rybbit env is present and a live read-only smoke test returned HTTP 200.
- Turso env is present; schema dry-run sees 34 SQL statements.
- Blog content scan defaults to `config/aaron-studio.json` -> `blogRepo/content/blogs`.
- YouTube upload auth exists, and the auth script now requests
  `https://www.googleapis.com/auth/yt-analytics.readonly`; analytics ingestion
  still needs one re-auth run so the saved token receives the new scope.
- LinkedIn analytics still needs either OAuth/API access or a CSV fallback.

## First Ingestion Strategy

Start with a conservative version:

1. scan local blog markdown to upsert `growth_content_items`
2. manually or semi-automatically register published LinkedIn and YouTube URLs in `growth_channel_posts`
3. ingest Rybbit daily path metrics into `growth_metric_snapshots`
4. ingest YouTube Analytics for linked videos
5. add LinkedIn either through API or CSV export
6. run `SELECT * FROM growth_content_7d_postmortem ORDER BY qualified_engaged_audience_score_7d DESC;`

That gives the agent enough signal to write weekly postmortems before we build a
larger dashboard.

## Lesson Loop

Postmortems now emit reusable lessons into `growth_lessons`. A lesson has a type:

| Type | Meaning |
|------|---------|
| `keep` | Repeat this pattern when the context fits |
| `change` | Avoid or repair this pattern |
| `experiment` | Try this as a measurable hypothesis |
| `measurement_gap` | Fix instrumentation or attribution before judging content |

`next-brief-context` reads recent postmortems, top content, and active lessons.
Future writing workflows should explicitly use or reject at least one lesson
before drafting the next article. This prevents the system from merely recording
metrics without changing behavior.
