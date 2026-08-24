# Image Generation Manifest

## Run

- Article: `prompt-before-the-answer.md` / `prompt-before-the-answer-zh.md`
- Generated on: 2026-08-23
- Backend: built-in imagegen for cover candidates; deterministic HTML/Playwright renderer for exact-text evidence cards and thumbnail typography
- Model or provider when known: built-in image generator; local Chromium renderer
- Cohesion model: Controlled Mix
- Selected concept route: Route A — shipping receipt enters a hidden inspection layer
- Selected style families: Editorial Workbench, Executive Brief, Field Signal Editorial

## Assets

| Asset | Role | Prompt file | Candidate(s) | Selected | Why selected | Rejected failure | Stock candidate |
|---|---|---|---|---|---|---|---|
| 00-cover | cover | `prompts/00-cover-candidate-a.md`, `prompts/00-cover-candidate-b.md` | A, B | `00-cover-v1.png` from B | stronger state-transition story | A felt like a scanner ad and contained a logo-like leaf | yes |
| 00-cover-thumbnail | thumbnail | deterministic title layout derived from selected cover | A, B | `00-cover-thumbnail-v1.png` from A | strongest mobile hierarchy and preserves parcel trace | B obscured the parcel and wasted left space | no |
| 01-tool-sequences | body evidence | `prompts/01-tool-sequences.md` | `01-tool-sequences-v1.png` | same | exact observed sequence and test output | none | yes |
| 02-follow-up-receipts | body evidence | `prompts/02-follow-up-receipts.md` | `02-follow-up-receipts-v1.png` | same | exact raw field boundary and honest DSH failure | none | yes |

## Provenance Notes

The body cards are designed evidence graphics, not documentary screenshots of a terminal. They reproduce sanitized values from private machine-readable outputs. No private path, session identifier, credential, account detail, or installed plugin name is rendered.

## Integrity

- Every accepted asset has a prompt or source record: yes
- Existing final assets were preserved or versioned: yes
- Cover concepts were compared before style lock: yes
- Accepted images passed visual critique: yes
