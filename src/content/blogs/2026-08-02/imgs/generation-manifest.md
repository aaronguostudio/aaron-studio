# Image Generation Manifest

## Run

- Article: `src/content/blogs/2026-08-02/what-ai-code-can-change.md`
- Generated on: 2026-08-02
- Backend: built-in `image_gen`
- Model or provider when known: Codex built-in image generation; provider/model not exposed
- Cohesion model: Controlled Mix
- Selected concept route: Aaron-confirmed Route A — Authority Gate
- Selected style families: Field Signal Editorial primary; Executive Brief framework variant; Cutaway System Map influence only

## Assets

| Asset | Role | Prompt file | Candidate(s) | Selected | Why selected | Rejected failure | Stock candidate |
|---|---|---|---|---|---|---|---|
| 00-cover | cover | `prompts/00-cover-candidate-a.md`, `prompts/00-cover-candidate-b.md` | `00-cover-v1-candidate-a.png`, `00-cover-v1-candidate-b.png` | candidate A → `00-cover.png` | Clearest three-group threshold composition; transformation remains legible at mobile size | B used too many record cards and introduced pseudo-microcopy / dashboard texture | no |
| 00-cover-thumbnail | thumbnail | `prompts/00-thumbnail-candidate-a.md`, `prompts/00-thumbnail-candidate-b.md` | `00-cover-thumbnail-v1-candidate-a.png`, `00-cover-thumbnail-v1-candidate-b.png` | candidate A → `00-cover-thumbnail.png` | Exact headline, calm two-column safe zone, strongest mobile hierarchy | B had exact text but the diagonal crop crowded the hand and code strip beneath the headline | yes — distribution only |
| 01-authority-ripple | body metaphor | `prompts/01-authority-ripple.md`; targeted edit recorded below | `01-authority-ripple-v1-candidate-a.png`, `01-authority-ripple-v1-candidate-b.png` | candidate B → `01-authority-ripple.png` | Preserves persistent downstream state while removing fake code texture and unrelated green patch | A contained pseudo-code-like marks and an unexplained green corner patch | yes — video candidate |
| 02-review-depth-ladder | framework | `prompts/02-review-depth-ladder.md` | `02-review-depth-ladder-v1-candidate-a.png` | candidate A → `02-review-depth-ladder.png` | Exact six labels, correct cumulative order, correct reversible-to-authoritative arrow, mobile readable | none | yes — social/video candidate |

## Provenance Notes

- All assets are newly generated editorial illustrations; none should be treated as documentary evidence.
- Thumbnail candidates were edits derived from `00-cover-v1-candidate-a.png` using that single local reference image.
- `01-authority-ripple-v1-candidate-b.png` is a targeted edit of candidate A. Only the left strip's pseudo-text and the unrelated pale-green paper patch were replaced; the state-propagation composition was preserved.
- Built-in output dimensions were 1672 × 941 for every generated candidate; prompted dimensions were not assumed.
- Selected-candidate contact sheet: `visual-contact-sheet-v1.png` (1672 × 940).
- Rejected candidates remain versioned siblings unless Aaron later asks to clean them.
- After `visual-critique.md` recorded `Decision: PASS`, selected candidates were promoted non-destructively to `00-cover.png`, `00-cover-thumbnail.png`, `01-authority-ripple.png`, and `02-review-depth-ladder.png`.
- Accepted WebP derivatives were created with `cwebp`: quality 82 for cover, thumbnail, and ripple; quality 80 for the framework diagram.
- PNG → WebP sizes: cover 1,995,091 → 52,390 bytes; thumbnail 2,009,819 → 62,296 bytes; ripple 2,292,887 → 110,516 bytes; ladder 1,985,287 → 51,770 bytes.
- No provider fallback or external stock asset is authorized or planned.

## Integrity

- Every accepted asset has a prompt or source record: yes
- Existing final assets were preserved or versioned: yes
- Cover concepts were compared before style lock: yes — Authority Gate, Small Key / Large Ledger, and State Ripple
- Accepted images passed visual critique: yes — see `visual-critique.md`
