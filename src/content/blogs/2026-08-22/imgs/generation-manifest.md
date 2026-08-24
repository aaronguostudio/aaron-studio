# Generation Manifest

## Backend
- Engine: baoyu-image-gen CLI (`npx -y bun .baoyu-skills/baoyu-image-gen/scripts/main.ts`)
- Provider: openai
- Model: gpt-image-2
- Generation date: 2026-08-22

## Concept & Style
- Selected cover concept route: **A — "the toolbox opens into code"** (Agent-selected; Routes B and C recorded in visual-strategy.md).
- Style cohesion: **Controlled Mix** — Field Signal Editorial (primary) + Paper System Sketch (frame image only).

## Assets

| Asset | Prompt file | Candidate(s) | Selected | Dimensions | Rejection reason (other candidates) |
|---|---|---|---|---|---|
| 00-cover | prompts/00-cover.md | 00-cover-candidate-a | 00-cover.png | 2048x1152 | n/a (single candidate; visual comparison deferred) |
| 00-cover-thumbnail | prompts/00-cover-thumbnail.md | — | 00-cover-thumbnail.png | 2048x1152 | n/a |
| 01-hands | prompts/01-hands.md | — | 01-hands.png | 2048x1152 | n/a |
| 02-competence | prompts/02-competence.md | — | 02-competence.png | 2048x1152 | n/a |
| 03-continuity | prompts/03-continuity.md | — | 03-continuity.png | 2048x1152 | n/a |
| 04-state-vs-prose | prompts/04-state-vs-prose.md | — | 04-state-vs-prose.png | 2048x1152 | n/a |

## Provenance & Caveats
- No reference images; no edits; no fallback (openai gpt-image-2 succeeded on first attempt for all six).
- **Visual inspection limitation**: the running model (deepseek-v4-pro) does not accept image input, so candidate comparison and thumbnail-text correctness could not be verified by sight. Metadata QA (dimensions 2048x1152 = 16:9, ≥1200px, no byte-identical duplicates, non-zero size) passed. Human visual review required before publish.
