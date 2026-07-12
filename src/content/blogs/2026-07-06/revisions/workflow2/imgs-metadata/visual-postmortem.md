# Visual Postmortem

## What Worked

- Writing `visual-strategy.md` before prompts changed the outcome. The prompts stayed focused on one visual predicate per image.
- The cover improved because it visualized the article's conflict instead of the whole market map.
- `02-metaphor-demo-to-operating-loop.png` worked best because it used one ordinary desk scene and one quiet connection.
- `04-framework-actor-loop.png` worked because ACTOR became five large readable tiles with one feedback path.
- The v2 prompt files make the regeneration traceable without deleting the earlier prompt history.

## What Failed

- OpenAI generation could not run because the local key was rejected by the API, so the workflow fell back to `codex-cli`.
- The thumbnail is readable but somewhat dense. It works for now, but a future pass could make the token side calmer.
- `03-comparison-fde-center-of-gravity.png` is clean, but it may read as abstract unless paired with the article's table and surrounding section.

## Reusable Patterns

- For enterprise AI topics, a real workbench plus paper/runbook/checkpoint objects grounds the idea better than generic AI infrastructure.
- Platform convergence works when source marks are abstract and the destination is a single deployment layer.
- Framework images should start with large letter tiles, then add only one relationship path.
- A quiet body metaphor after a dense argument helps the article breathe.

## Anti-Patterns To Add To Global System

- Do not make a cover visually similar to the first body image; the cover needs a stronger emotional predicate.
- Do not let thumbnail prompts drift too far from the article title unless the distribution strategy explicitly calls for a new hook.
- Do not use an invalid or stale `.env` image key without a provider fallback path.

## Images Stock Candidates

- Accepted references: `00-cover.png`, `02-metaphor-demo-to-operating-loop.png`, `04-framework-actor-loop.png`.
- Candidate for manual thumbnail review: `00-cover-thumbnail.png`.
- Negative cover reference: `00-cover-v2-candidate-b.png`.

## Next Article Guidance

Start image work by writing the visual predicate for each image. For serious tech/business essays, keep at least one body image quiet and object-based. Use diagram language only when the reader needs a reusable model.
