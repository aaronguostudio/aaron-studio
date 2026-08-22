# Generation Manifest

## Run

- Article: src/content/blogs/2026-08-21/local-crossover-point.md
- Generated on: 2026-08-21
- Backend: **local procedural generation** — Pillow (PIL) running on the same local machine (M5 Max, Python via system python3).
  - Reason: this production session runs on Qwen3.8-27B GGUF (text-only; no image-input or image-output capability) under DeepSeek Harness, and no image model (local or API) is available in this environment: Ollama serves text GGUFs only; no image API keys in the environment; baoyu/tessl image-gen installs not present (checked .agents/skills, .claude/skills, ~/.baoyu-skills, HF free inference = unauthorized 401 path).
  - Consequence: the cover is a flat editorial illustration composed in code, in Field Signal Editorial. Raster-AI cover candidates (photographic / painterly / 3D) are out of reach from this stack; no fallback CLI exists to call.
- Selected concept route: Route A — Receipt Stop (see imgs/visual-strategy.md)
- Selected style families: Field Signal Editorial (unified)
- Palette: paper 242/237/227, card 250/247/240, graphite 58/58/62, muted 176/170/158, orange 224/92/40 (single signal color)

## Candidates

- `00-cover-a1.png` (A1): receipt + dotted leader + die. Retained for archive. Structural QA: paper 91.9%, graphite 6.8%, orange 0.33%, content bbox inside margins.
- `00-cover-a2.png` (A2, SELECTED): receipt whose post-stop tail dissolves into a dither field drifting toward the die; 26 orange specks among the gray drift. Structural QA: paper 79.8%, graphite 7.3%, orange 0.51%, content bbox inside margins.
- Selection reason: A2 enacts the thesis — the invoice is what dies, the machine takes over — in one gesture; A1 keeps the two objects separate, which is less faithful to the actual claim.

## Accepted

- `imgs/00-cover.png` (= A2), 1672x941 PNG
- `imgs/web/00-cover.webp` quality 82, ~62KB
- Thumbnail: not generated — no video requested for this post; the blog shell uses the cover.

## QA Method And Limitation

- **No visual review was possible by the model**: Qwen3.8-27B GGUF declares no image input; no other image-capable model is reachable from this session. QA was therefore structural (Pillow pixel statistics: palette ratios, content bbox vs margins, size) — composition, legibility, and taste were NOT model-verified.
- This is the cost boundary of the local stack, stated for the record: this cover passes no human eyes and no model eyes. **Aaron should look at the image before publish** (the human review gate for images remains with him).
- If Aaron rejects the cover: the routes in visual-strategy.md (A1 preserved; B/C documented) give the regeneration paths, each requiring the same procedural backend or an available image model.

## Reuse

- This procedural backend (paper bg + card + die + dither dissolve, all in one PIL script) is reusable for future Field Signal Editorial covers; the script lives at /tmp/cover_gen.py during this session (copy to project if kept — not part of the package).
