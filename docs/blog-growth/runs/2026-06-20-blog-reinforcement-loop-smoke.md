# Blog Reinforcement Loop Smoke Test - 2026-06-20

## Scope

Verified the first usable reinforcement loop for Aaron's blog growth system:

1. Normalize content dates into ISO dates.
2. Register a YouTube distribution artifact for the Fable post.
3. Ingest YouTube Analytics into `growth_metric_snapshots`.
4. Generate and write a deterministic 7-day postmortem.
5. Read that postmortem back through `next-brief-context`.

## Commands Run

```bash
node --test scripts/blog-growth/test/*.test.mjs
node scripts/blog-growth.mjs init-schema
node scripts/blog-growth.mjs seed-reward-version
node scripts/blog-growth.mjs normalize-content-dates
node scripts/blog-growth.mjs register-channel-posts --file src/content/blogs/2026-06-15/distribution.json
node scripts/blog-growth.mjs ingest-youtube --start 2026-06-15 --end 2026-06-22 --slugs fable-5-managing-ai-autonomy
node scripts/blog-growth.mjs postmortem --slug fable-5-managing-ai-autonomy --window 7d
node scripts/blog-growth.mjs next-brief-context --limit 5
```

## Results

- Test suite: 45 passing tests.
- Content catalog: 38 posts normalized, 0 unparseable dates.
- Reward version: `v0.1` seeded.
- Distribution registration: Fable YouTube video `jPHR-73HJa8` registered.
- YouTube ingestion: 18 metric rows written for the Fable 7-day window.
- Postmortem: one `postmortem_7d` review written to `growth_ai_reviews`.
- Next brief context: returned `deep_reader_signal` as a winning pattern and `linkedin_manual_import_missing` as a weak pattern/caveat.

## Current Caveats

- LinkedIn metrics are still missing until a post id or export is added.
- YouTube metrics are now ingested for the Fable post, but the broader catalog still needs channel manifests.
- The first postmortem is deterministic and compact; future agent reviews can add richer qualitative interpretation on top of this stored context.
