# Image Generation Manifest

## Run

- Article: src/content/blogs/2026-08-19/deepseek-harness-teardown.md
- Generated on: 2026-08-15
- Backend: baoyu CLI (`.baoyu-skills/baoyu-image-gen`) — built-in image_gen unavailable in this host (Claude Code session)
- Model or provider when known: openai / gpt-image-2, quality 2k, ar 16:9 (from baoyu EXTEND.md defaults)
- Cohesion model: Controlled Mix (Field Signal Editorial primary + Neo Diagram Minimal variant)
- Selected concept route: Route A — The 44/3 gate (Aaron, 2026-08-15)
- Selected style families: Field Signal Editorial; Neo Diagram Minimal (image 01 only)

## Assets

| Asset | Role | Prompt file | Candidate(s) | Selected | Why selected | Rejected failure | Stock candidate |
|---|---|---|---|---|---|---|---|
| 00-cover | cover | prompts/00-cover.md | 00-cover-v1-candidate-a.png, 00-cover-v1-candidate-b.png | candidate-a → 00-cover.png | Left-to-right narrative flow (archive → aperture → reader) renders the predicate most clearly; the three cards visibly slice through the glass; warm human anchor | candidate-b: monumental central axis but the glass column reads as a display case and the trapezoid card shapes are odd | yes |
| 00-cover-thumbnail | thumbnail | prompts/00-cover-thumbnail.md | 00-cover-thumbnail-v1-candidate-a.png (wall + aperture right third), 00-cover-thumbnail-v1-candidate-b.png (aperture only, calmer) | candidate-a → 00-cover-thumbnail.png | Exact six-word headline, correct 3-line hierarchy, keeps the cover's 44/3 world, legible at 320px | candidate-b: dropped the ledger wall (story lost), cards near-transparent | yes |
| 01-diagram-log-derive-refuse | framework | prompts/01-diagram-log-derive-refuse.md | 01-diagram-log-derive-refuse.png (single) | accepted | Semantic order exact; stray card clearly blocked at coral bar before the gate; zero labels | note: cards thread the gate posts — accepted, does not invert semantics | yes |
| 02-metaphor-contract-reread | body | prompts/02-metaphor-contract-reread.md | 02-metaphor-contract-reread.png (single) | accepted | Predicate reads in one look; abstract bars only; one coral element | note: two green stamps after the coral mark — soft wrinkle, re-roll declined (composition risk > gain) | yes |
| 03-metaphor-rules-table-fleet | body | prompts/03-metaphor-rules-table-fleet.md | 03-metaphor-rules-table-fleet.png (single) | accepted | Three distinct human jobs, calm uniform fleet, green gate + cyan thread, no text | — | yes |
| 04-metaphor-two-shelves | closing | prompts/04-metaphor-two-shelves.md | 04-metaphor-two-shelves.png (single) | accepted | Matter-of-fact clamps, warm honest mood, amber line out of frame | note: cyan spool absent — amber-only accent, palette subset OK | yes |

| s01-01 … s08-01 (15 video cards) | video B-roll | composed prompts preserved in scratchpad during run; predicates recorded in video-brief.md retention map | single generation each | all accepted (visual-critique.md Video Cards section) | one-pass acceptance; notes on s03-01 (added burning money), mixed-media hands (s04-01/s05-01/s08-01), scenic drift (s03-03/s05-03/s06-01) | — | cover/fleet-quality cards yes; scenic cards no |

## Provenance Notes

All images are text-to-image generations from the recorded prompts; no reference images, no stock imports. Candidate A and B for the cover differ in composition (A: wall left / aperture center-right / reader lower right; B: frontal symmetric aperture center, cards toward a desk bottom center) — same concept, same style family. Composed generation prompts (positive + avoid-list merged) are stored beside each output under scratch during the run; canonical prompts live in prompts/.

## Integrity

- Every accepted asset has a prompt or source record: yes
- Existing final assets were preserved or versioned: yes (no pre-existing assets)
- Cover concepts were compared before style lock: yes (visual-strategy.md Routes A/B/C; Aaron selected A)
- Accepted images passed visual critique: yes (visual-critique.md Decision: PASS; all six finals 2048×1152 actual, compressed to imgs/web/ at q82, diagram at q75; inserted into both editions 2026-08-15)
