# Postmortem

## Prediction (2026-09-30, pre-publish)

- Growth rubric `blog-writing-v1`: 78/100 (thesis 4, evidence 5, mechanism 4, stakes 3, nuance 4, frame 4, ending 3, voice 4, distribution 4). Stored via `blog-growth.mjs evaluate-content`.
- Hypothesis: the personal-receipt title ("I priced my own AI bill") earns higher CTR and read depth than news framing, matching the insider-test pattern of the top post.
- Expected strongest signal: read depth reaching "The real price is the re-read"; YouTube 30-s retention above recent uploads because the meter/verdict appear in the first 30 s.
- Risk: news cycle is fast; by the time the video is public, "Pro 200 halved" recaps will be saturated. The cache-read angle is the differentiator.

## 24h

Pending.

## 7d

Pending.

## Workflow lessons (this run)

- TTS cache keys include neighbor context: editing one segment re-voices its neighbors. For a one-word fix after approval, splice the approved segment files instead of re-running the pipeline.
- A linked prior post ("I Stopped Renting Intelligence") existed locally but was never published; always verify internal link targets against production (soft 404s return 200).
- Charts made from a brief with Pro-account numbers exposed a 77% vs 78% mismatch with all-account prose; keep one numeric basis per claim across prose, charts and narration.
