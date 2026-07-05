# Blog Feedback Loop V1 - 2026-07-01

## Scope

Implemented the first practical evaluation and feedback loop for the blog system:

1. Store pre-publish rubric predictions in Turso.
2. Store reusable lessons from postmortems or manual editorial review.
3. Feed active lessons into `next-brief-context`.
4. Require future blog writing workflows to use or reject a recent lesson.

## Commands Run

```bash
node --test scripts/blog-growth/test/*.test.mjs
node scripts/blog-growth.mjs init-schema --dry-run
node scripts/blog-growth.mjs init-schema
node scripts/blog-growth.mjs evaluate-content --slug one-person-project-ai-coding --dry-run
node scripts/blog-growth.mjs evaluate-content --slug one-person-project-ai-coding
node scripts/blog-growth.mjs register-lessons --file docs/blog-growth/runs/2026-07-01-feedback-loop-seed-lessons.json --dry-run
node scripts/blog-growth.mjs register-lessons --file docs/blog-growth/runs/2026-07-01-feedback-loop-seed-lessons.json
node scripts/blog-growth.mjs next-brief-context --limit 5
```

## Results

- Schema: 45 SQL statements applied; new tables are available in Turso.
- Evaluation: `one-person-project-ai-coding` received a pre-publish prediction of `84/100`.
- Lessons: 2 manual editorial lessons registered with clear `editorial_review` evidence.
- Next brief context: now returns 2 active lessons and uses the concrete bottleneck opening as `next_experiment`.
- Tests: `node --test scripts/blog-growth/test/*.test.mjs` passed with 50 tests.

## Current Caveats

- Pre-publish scoring is deterministic and heuristic. It is a prediction record, not a learned model.
- LinkedIn/X analytics are still incomplete unless channel posts are registered and metrics are imported manually or through a future API path.
- The current article needs 24h and 7d Rybbit windows before the system can compare prediction vs outcome.
- Manual lessons must keep their evidence source explicit so they are not mistaken for metric-derived findings.
