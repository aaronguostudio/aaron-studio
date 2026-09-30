# Image Generation Manifest

## Run

- Article: `src/content/blogs/2026-09-30-ai-bill/ai-subscription-cloud-bill.md`
- Generated on: 2026-09-30
- Backend (cover): baoyu CLI (`.baoyu-skills/baoyu-image-gen/scripts/main.ts` via `npx -y bun`), provider `openai`, model `gpt-image-2`, `--ar 16:9 --quality 2k`. Codex built-in `image_gen` was not available in this Claude Code host; baoyu is the skill's documented path for other hosts. Its project `EXTEND.md` sets openai / gpt-image-2 as default. No fallback used.
- Backend (charts): deterministic matplotlib 3.11.2 via `charts/render_charts.py` (Helvetica Neue). No image model involved.
- Backend (thumbnail text): deterministic Pillow 12.3 overlay via `thumbnail_compose.py` (Helvetica Neue Condensed Black). The image model drew no text.
- Cohesion model: Controlled Mix.
- Selected concept route: A, receipt with one overflowing line item (see `visual-strategy.md`).
- Selected style families: Field Signal Editorial (cover/thumbnail), Editorial Data Chart (charts).

## Assets

| Asset | Role | Prompt / source | Candidate(s) | Selected | Why selected | Rejected failure | Stock candidate |
|---|---|---|---|---|---|---|---|
| 00-cover | cover | `prompts/00-cover-v3-receipt-thick-overflow.md` | probe-a-receipt, probe-b-card-meter, probe-c-reread-stack, v1-receipt-spill, v2-receipt-overflow, v3-receipt-thick-overflow | `candidates/00-cover-v3-receipt-thick-overflow.png` → `00-cover.png` (2048x1152) → `web/00-cover.webp` (q82, 2048x1152, 38 KB) | Heaviest, clearest "one line item outweighs the bill"; reads at 320px; horizontal amber band matches the charts' cache-read bars; large calm text zone upper right | probe-a: good, photographic, but diagonal composition crowds the thumbnail text zone; v1: amber bar too thin, dominance lost; v2: right idea, amber a hairline at mobile size (v3 is its narrower regeneration); probe-b: strong utility-meter metaphor but not about the re-read and card reads as a bank card; probe-c: re-read loop needs explanation, weak at thumbnail size | yes |
| thumbnail-youtube | thumbnail | `thumbnail_compose.py` on `00-cover.png` | `candidates/thumbnail-youtube-candidate-a-half.jpg` ("$200 → HALF"), `candidates/thumbnail-youtube-candidate-b-bill.jpg` ("I PRICED MY AI BILL") | candidate A → `thumbnail-youtube.jpg` (1280x720, JPEG q92, 110 KB) | Three large tokens beat four smaller words at 320px; number hook; the receipt already says "bill" | B: legible but smaller glyphs and repeats the title's second half verbatim | no |
| 01-price-per-unit | chart | `charts/render_charts.py` | n/a (deterministic) | `charts/01-price-per-unit.png` 1920x1080; `web/01-price-per-unit.webp` 1600x900 (q80, sharp_yuv, 33 KB) | exact data | n/a | no |
| 02-codex-meter | chart | same | n/a | `charts/02-codex-meter.png`; `web/02-codex-meter.webp` (33 KB) | exact data | n/a | no |
| 03-bill-by-model | chart | same | n/a | `charts/03-bill-by-model.png`; `web/03-bill-by-model.webp` (53 KB) | exact data | first render had overlapping group headers and a clipped label; fixed before acceptance | no |
| 04-cache-read-price | chart | same | n/a | `charts/04-cache-read-price.png`; `web/04-cache-read-price.webp` (32 KB) | exact data | n/a | no |
| 05-model-vs-vendor | chart | same | n/a | `charts/05-model-vs-vendor.png`; `web/05-model-vs-vendor.webp` (42 KB) | exact data | first render clipped the title; title now auto-fits width | no |

## Prompts

- Concept probes: `prompts/00-cover-probe-a-receipt.md`, `prompts/00-cover-probe-b-card-meter.md`, `prompts/00-cover-probe-c-reread-stack.md`
- Refined candidates: `prompts/00-cover-v1-receipt-spill.md`, `prompts/00-cover-v2-receipt-overflow.md`, `prompts/00-cover-v3-receipt-thick-overflow.md`
- Each prompt file was passed whole via `--promptfiles`.

## Provenance Notes

- All six generated images are 2048x1152 PNG (actual, inspected). No reference images, no edits, no stock imports.
- `00-cover.png` is a byte copy of the v3 candidate (same SHA-256 prefix `d1a7bc809e84e75f`).
- Thumbnail = v3 cover resized to 1280x720 (exact 16:9, no crop) + deterministic headline.
- Chart WebPs: PNG → Lanczos resize to 1600x900 → `cwebp -q 80 -sharp_yuv -m 6` (sharp_yuv keeps text edges clean). Cover WebP: `cwebp -q 82 -m 6`, full size.
- Chart derived annotations: "5×" on chart 04 is $1.00 / $0.20 from the brief and appears in the article text. Chart 03 segment lengths are total × given percentage; no derived dollar values are printed. "Others $93" has no cache split in the brief and is drawn as a single light bar labeled "not split".
- The cover is an illustration, not documentary evidence; the receipt carries no real data.

## Integrity

- Every accepted asset has a prompt or source record: yes
- Existing final assets were preserved or versioned: yes (no prior finals existed; all candidates kept in `candidates/`)
- Cover concepts were compared before style lock: yes (three probes)
- Accepted images passed visual critique: yes (`visual-critique.md`)
