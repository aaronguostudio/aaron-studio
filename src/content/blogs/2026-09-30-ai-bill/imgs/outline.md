---
type: mixed
density: rich
style: Itemized Receipt
style_cohesion: Controlled Mix
image_count: 7
article: src/content/blogs/2026-09-30-ai-bill/ai-subscription-cloud-bill.md
style_brief: imgs/style.md
style_directions: imgs/style-directions.md
---

# Image Outline

All chart numbers come verbatim from the chart brief. Charts are rendered by `charts/render_charts.py` (1920x1080 PNG for video slides) and downscaled to 1600x900 WebP for the blog.

## 00 Cover — `00-cover.png` / `web/00-cover.webp`

- **Position:** article header (frontmatter `cover: imgs/web/00-cover.webp` already set). Do not also insert it in the body unless the site template needs it.
- **Claim served:** the thesis: price your AI subscription like a bill and one line item (the re-read) dominates.
- **Visual job:** scroll-stopping first impression; set the amber "dominant line" token the charts reuse.
- **Mode / family / weight:** Editorial Minimal / Field Signal Editorial / loud.
- **Predicate:** one line item overflows the whole bill.
- **Anti-clutter:** receipt, amber band, paper surface only; no text or numbers.
- **Density:** narrative/metaphor. **Reuse:** candidate.
- **Takeaway:** one line on the bill is bigger than the bill.

## Thumbnail — `thumbnail-youtube.jpg` (1280x720)

- **Position:** YouTube only; not inserted in the article.
- **Claim served:** the news hook: the $200 plan's allowance was halved.
- **Visual job:** mobile-legible hook in the cover's world; headline "$200 → HALF" set deterministically.
- **Mode / family / weight:** Editorial Minimal + typography / Field Signal Editorial + Data Poster type / loud.
- **Predicate:** $200 becomes half, printed above the overflowing line item.
- **Anti-clutter:** exactly the words "$200", an arrow, "HALF"; nothing else.

## 01 — `charts/01-price-per-unit.png` / `web/01-price-per-unit.webp`

- **Position:** "The bulk discount is gone", after the plan table and the paragraph ending "a flat rate, plus a premium for performance."
- **Claim served:** the old Pro 200 was the only tier where buying more made each unit cheaper; after Oct 30 every tier is $20 per 1×.
- **Visual job:** make the flat-rate shape visible; the single amber $10 bar is the lost discount.
- **Mode / family / weight:** Operator Diagram (data chart) / Editorial Data Chart / quiet. **Predicate:** one bar is lower than the rest.
- **Editorial note:** duplicates the Markdown table. Either replace the table with the chart in the blog, or keep the table and use the chart only in the video.

## 02 — `charts/02-codex-meter.png` / `web/02-codex-meter.webp`

- **Position:** "My bill at list price", after the three bullets (the meter bullet), before "Two caveats matter."
- **Claim served:** the Codex weekly meter, not money, was the constraint: five of six windows hit 99-100%.
- **Visual job:** show the ceiling being hit repeatedly.
- **Mode / family / weight:** data chart / Editorial Data Chart / medium. **Predicate:** bars pinned at the 100% line.

## 03 — `charts/03-bill-by-model.png` / `web/03-bill-by-model.webp`

- **Position:** "The real price is the re-read", after the first paragraph ("...76% of Opus 5, 58% of Opus 5.5.").
- **Claim served:** cache reads are most of every large line item; about $9,400 of Claude Code and $3,600 of Codex at list.
- **Visual job:** the core evidence; amber segments visibly dominate the big bars.
- **Mode / family / weight:** data chart / Editorial Data Chart / medium. **Predicate:** amber (cache reads) is most of each big bar.
- **Data note:** the brief gives Astra at 78% cache reads; the article text says 77%. Reconcile one or the other before publishing.

## 04 — `charts/04-cache-read-price.png` / `web/04-cache-read-price.webp`

- **Position:** "The real price is the re-read", after the price table and its source line, before "Look at the middle column."
- **Claim served:** for agent work the price that matters is the cache-read price; Astra's is 5× Opus 5.5's.
- **Visual job:** isolate the middle column of the table; highlight Astra and Opus 5.5 with a 5× bracket.
- **Mode / family / weight:** data chart / Editorial Data Chart / quiet. **Predicate:** Astra's bar is five Opus 5.5 bars long.
- **Editorial note:** partly duplicates the table (cache-read column only). Keeping both is defensible because the table carries input/output prices.

## 05 — `charts/05-model-vs-vendor.png` / `web/05-model-vs-vendor.webp`

- **Position:** "So which plan is the better deal?", after the paragraph ending "...so for now that's a hypothesis."
- **Claim served:** picking the model moved the bill more than picking the vendor.
- **Visual job:** two before/after pairs on one shared scale.
- **Mode / family / weight:** data chart / Editorial Data Chart / medium. **Predicate:** the same tokens shrink when repriced.

## Density Check

- Every image has one predicate: yes.
- Families match `style-directions.md` and `mode-mix.md`: yes.
- Narrative/metaphor majority: no. Accepted exception: evidence-led receipt post, charts double as video slides, and only one generated image is used.
- Adjacent images repeat composition: charts share a system by design; alternating vertical (01, 02) and horizontal (03, 04, 05) bars.
