# Audit: Images, covers, thumbnails, visual identity

> Generated 2026-08-22 by a multi-agent audit of tiles/blog-production and its chain. Evidence cites working-tree file:line at audit time.

## Summary

The blog-illustrate chain is judgment-heavy and genuinely above average on concept discipline: the 2026-08-19 package proves the "concept before style, one predicate per image, exact-text budget" method can yield a clean six-image set plus 15 video cards on first pass with a complete manifest and an honest critique. The 08-19 paper-craft world (Field Signal Editorial) is the strongest visual work in the repo and the body images there are information-bearing, not decoration. However, there is no visual identity across posts: covers for 06-20 (dark Tesla-HUD photoreal), 07-06 (dark workbench with glowing threads), 08-19 (warm paper), 08-21 (procedural Pillow flat vector), 09-16 (Mediterranean photo-collage), 10-07 (Greek engraving) share no palette, material, typography, or lockup; the strategy files themselves declare three competing baselines. The thumbnail system is a per-post prompt to gpt-image with a 3-line text recipe, no brand wordmark, no reusable template, no Remotion still pipeline for blog thumbnails (the Remotion thumbnail components exist only as hard-coded one-offs), and no A/B mechanism; the 2 MB PNG rejection is now auto-fixed in youtube-upload.ts but the asset is still stored as a 3.7 MB byte-identical copy in two places. Diagrams are rendered as non-editable raster from an image model even when the same mechanism is re-authored in Remotion for the film, so the "one family" promise between blog cover, cover-hero, and thumbnail is broken in the golden sample: the film opens on the gpt-image thumbnail card, then cuts to a porcelain typographic cover-hero that looks like a different brand. Most of the 13-step SKILL.md workflow is prose that nothing enforces; the only test checks that strings exist in markdown. The 08-21 package shows the process can "PASS" with zero human or model eyes on the image. Missing professional steps: contact-sheet tooling, mobile/list-scale preview, text-safe-zone template, brand lockup on thumbnails, OG/social crop variants, alt-text quality checks, and a versioned brand token file shared by blog, video, and thumbnail.

## Strengths

- **Concept-before-style discipline produced a coherent, information-bearing set in the golden sample** — src/content/blogs/2026-08-19/imgs/visual-strategy.md routes A/B/C; imgs/outline.md records one predicate, anti-clutter rule, removal test per image; imgs/visual-critique.md inspects each asset and records accepted wrinkles; visual-postmortem.md: all six finals accepted on first pass, zero re-rolls. Viewed 00-cover.webp, 01-diagram, 02-contract, 03-fleet: each reads in one sentence and matches its predicate.
  - Why it matters: This is the part of the system that is actually professional and should be protected: the artifacts are specific, honest, and reusable as regression lessons (blog-visual-system.md 'Workflow 3 v7 lessons').
- **Exact-text thumbnail budget works and is mobile-legible** — imgs/prompts/00-cover-thumbnail.md lists the six permitted words and bans all other text; 320px downscale of 00-cover-thumbnail.png: all three lines legible, dark zone calm, amber hero word dominant.
  - Why it matters: Solves the most common image-model thumbnail failure (invented captions) with a prompt contract rather than luck.
- **Manifest honesty, including on failure** — 2026-08-19/imgs/generation-manifest.md records backend (baoyu CLI, gpt-image-2, 2k, 16:9), every candidate, selection reason, rejection reason, actual dimensions. 2026-08-21/imgs/generation-manifest.md states the image was made by Pillow with 'no human eyes and no model eyes' and flags the open human gate.
  - Why it matters: Provenance is the precondition for productizing; most AI image pipelines have none.
- **Blog stills reuse into video as bounded scene media** — video-treatment.md:42,64 names 02/03/04 and s05-01 as scene media; film frame at 600s shows 04-metaphor-two-shelves inside the image-evidence layout with chrome intact; Video Cards section of visual-critique.md covers 15 extra s0x assets.
  - Why it matters: Shows the image set was planned as a two-surface asset (article + film), which is the right production model.
- **Thumbnail size failure was turned into a tooling fix with proof** — tiles/aaron-yt-pipeline/scripts/youtube-upload.ts:195-210 prepareThumbnail() converts >2 MB to 1280x720 JPEG via ffmpeg and logs it; video-qa-report.md:65-66 documents both halves tested against the live endpoint.
  - Why it matters: Correct instinct: failures become code, not another sentence in a SKILL.md.

## Gaps

### [high/structure/M] No cross-post visual identity; the strategy layer declares three competing baselines

- Evidence: visual-language.md:29-33 names 'Soft Glass Narrative' + the 2026-06-20 set as default baseline; blog-illustrate/SKILL.md:77 repeats it; blog-visual-style-library.md and 08-19/08-21/09-16 all pick 'Field Signal Editorial' instead; aaron-editorial-visual-system.md uses a dark #090c0b canvas, 08-19 layout-manifest.json overrides to porcelain #f4f1e9 'ledger-editorial-v0.1'; AuthorityBoundaryLongformThumbnails.tsx hard-codes a third palette (#0a2346 ink, Georgia serif). Viewed covers: 06-20 = dark photoreal Tesla HUD with glowing threads (exactly what visual-language.md:84-90 bans), 07-06 = dark workbench with cyan light streaks, 08-19 = warm paper, 08-21 = flat vector with orange, 09-16 = saturated Mediterranean collage, 10-07 = Greek engraving. No shared typeface, wordmark, corner mark, or palette.
- Recommendation: Create one machine-readable brand token file (e.g. src/content/strategy/brand-tokens.json: paper/ink/signal/tension hex, display serif + mono faces, wordmark asset path, corner-lockup rules) and make visual-language.md, aaron-editorial-visual-system.md, layout-manifest.json and the thumbnail templates import from it. Retire 'Soft Glass Narrative' as default in SKILL.md:77 and visual-language.md:29 since the last four packages departed from it; declare Field Signal / ledger-editorial as the canonical family and keep per-post variation inside it (material, scene) rather than palette and medium.

### [high/product/M] Thumbnail is a per-post image-model prompt, not a system; no brand, no template, no A/B

- Evidence: blog-illustrate/SKILL.md:196-210 thumbnail recipe = eyebrow cyan / body white / hero amber, generated by gpt-image from prompts/00-cover-thumbnail.md; no AARON GUO mark on any blog thumbnail (08-19, 06-20, 07-06, 08-02 viewed at 320px), while the film's cover-hero and the Remotion thumbnail components do carry 'AARON GUO'. AuthorityBoundaryLongformThumbnails.tsx is four hand-coded one-offs with literal strings ('AI WROTE IT.', portrait paths) and a local palette, not a parameterized template; remotion-render.ts has no still/thumbnail entry. grep for A/B, 'Test & compare', CTR across tiles/ and strategy: only postmortem.md:9 mentions 'thumbnail CTR' as a metric to check; yt-publish SKILL.md has no thumbnail-variant upload or CTR readback.
- Recommendation: Build a Remotion `BlogThumbnail` composition (props: headline lines, hero word, background image path, accent, lockup on/off) rendered via `remotion still` from the clean cover, producing 3 variants (text-left dark zone, full-bleed object + text band, number-led) at 1280x720 JPEG <2 MB with a 320x180 and a YouTube-list-scale contact sheet. Faceless CTR substitutes: one oversized concrete object from the cover world (the 3 cards, the receipt, the contract fan), a big number ('44 → 3', '47% vs 67%'), and a consistent corner wordmark so the channel is recognizable in the feed. Add a `yt-publish` step that records which variant was uploaded and a 7-day CTR readback into distribution.json so variants can be compared across uploads (YouTube's Test & compare is Studio-UI only; record it manually as a field).

### [medium/craft/M] Mechanism diagrams are rendered as non-editable raster by an image model, then re-authored from scratch in Remotion

- Evidence: 2026-08-19/imgs/prompts/01-diagram-log-derive-refuse.md asks gpt-image for a 5-element flow; visual-critique.md notes 'cards thread through the gate's side posts' (model geometry error, accepted); the same log→derive→gate mechanism is rebuilt independently as the 'ledger-cascade' and 'system-map' layouts in layout-manifest.json and LedgerHarnessFilm.tsx. blog-visual-system.md:'Workflow 3 v7 lessons' admits 'a diagram can be beautiful and still fail... wrong path'.
- Recommendation: Route every Operator Diagram / dense mechanism image through an authored path: a Remotion still (reusing EditorialLayoutEngine layouts) or SVG/mermaid rendered with the brand tokens, exported to PNG/WebP for the blog and reused as a scene in the film. Keep the image model for Human-Scale Metaphor and cover scenes only. Add this as a rule in generation-and-delivery.md section 5 and a check in blog-package-quality.ts (diagram-role assets must have a source .tsx/.svg sibling).

### [medium/craft/S] Golden sample breaks its own 'one family' promise: the film opens on two different visual identities

- Evidence: LedgerHarnessFilm.tsx:1513-1523 CoverCard shows staticFile('harness-teardown/cover-card.png') = the gpt-image thumbnail (dark left panel, sans-serif, amber) for 3 s; frame at 4 s is the porcelain cover-hero (Georgia serif, mono marginalia, 'AARON GUO' header) with no trace of the paper/cards world. video-qa-report.md:42 calls the cover card a fix for a 'repeat-class miss'. Strategy text says 'The first meaningful frame must carry the article's visual identity' (aaron-video-gen/SKILL.md:86-91) but identity here means two unrelated designs back-to-back.
- Recommendation: Make the thumbnail a render of the cover-hero layout (same serif, same paper, cover object composited in the protected media slot) so the YouTube thumbnail, the 0-3 s card, and the frame-zero hero are literally the same composition at different text densities. Add a QA check in video-qa.md: extract frame 0 and frame at cover-card exit, place beside thumbnail, reject if palette/typeface differ.

### [high/automation/M] Process gates are prose; the only test asserts that strings exist in markdown

- Evidence: tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts checks toContain('Style is pacing, not skin') etc. on SKILL.md and templates; no script validates a package's imgs/ dir (manifest completeness, candidate count >= 2 for cover/thumbnail, critique Decision: PASS before web/ exists, dimensions). blog-package-quality.ts:468-505 only checks webp path, >=1200px, 16:9, duplicates. 2026-08-21/imgs/visual-critique.md records 'Decision: PASS' while stating no one looked at the image; 2026-09-16 and 10-07 manifests cite generator ids ('exec-4351258a...') that are not in the repo, so rejected candidates are unrecoverable despite generation-and-delivery.md:70 'keep rejected candidates'.
- Recommendation: Write tiles/blog-illustrate/scripts/illustration-package-check.ts run by blog-production's image gate: parse generation-manifest.md (backend, model, per-asset candidates with on-disk paths), require >=2 on-disk candidates for cover and thumbnail, require visual-critique.md Decision: PASS with a 'reviewed_by: human|model' field before imgs/web/ may be populated, require prompts/NN.md per accepted asset, verify dimensions and 2 MB thumbnail ceiling. Fail the 08-21 pattern (PASS with no viewer) explicitly.

### [medium/measurement/M] Generation backend is host-dependent and undocumented at the model level; cost and candidate counts are not tracked

- Evidence: SKILL.md:70,111-122 and generation-and-delivery.md:86-105: 'In Codex use built-in image_gen; else baoyu CLI; do not switch silently'. 08-19 manifest: baoyu/gpt-image-2 2k; 09-16, 10-07: 'OpenAI built-in image generator' with no model name; 08-21: Pillow because the host was a text-only local model. No manifest records cost, latency, or total candidates generated; 07-06 imgs/ holds 72 PNGs and 10-07 holds 14 cover probes with no roll-up of spend.
- Recommendation: Make the image backend a single CLI the skill always calls (wrap baoyu or a small scripts/image-gen.ts with provider/model/size/quality flags) so output is host-independent and the manifest is written by the tool, not by hand; include model id, seed/request id, cost estimate, elapsed time, and candidate index. Add a per-package 'images generated / accepted / cost' line to postmortem.md.

### [medium/automation/S] No contact-sheet, mobile-preview, or safe-zone tooling despite being required in prose

- Evidence: generation-and-delivery.md:149 'create a contact sheet when practical'; aaron-video-gen/SKILL.md:119-123 'review both candidates at 320x180 and at YouTube Studio list scale beside Aaron's recent uploads'; no script in tiles/blog-illustrate/scripts or aaron-video-gen/scripts produces either. 08-19 critique says 'legible at 320px (verified by downscale viewing)' with no artifact saved. visual-language.md:227 requires a 'left or top dark zone reserved for text' but there is no overlay/guide image for the YouTube duration badge (bottom-right) or the timestamp corner.
- Recommendation: Add scripts/contact-sheet.ts (ffmpeg/sharp montage of all candidates at 320x180 + 168x94 with a simulated duration badge and channel avatar row) and save it as imgs/contact-sheet.png; make it a required input to visual-critique.md. Publish a thumbnail safe-zone PNG overlay in tiles/blog-illustrate/templates/.

### [low/quality/S] OG image, social crops, and alt text are unmanaged

- Evidence: publish-to-blog/SKILL.md:79-80 sets ogImage to the cover filename (16:9 2048px WebP, ~185 KB) with no 1200x630 crop, no square for LinkedIn/X cards; 07-06 has a one-off '00-social-cover-v6-square.png' with no rule behind it. Alt text exists in 08-19 article (lines 12,43,121,172,196) and is good, but blog-package-quality.ts never checks alt presence/length, and the EN/ZH alt parity rule (generation-and-delivery.md section 8) is unenforced.
- Recommendation: Extend blog-package-quality.ts --require-images to fail on empty alt, alt > 200 chars, and EN/ZH image-count mismatch; add an OG derivative step (1200x630 crop + 1080x1080 square with wordmark) generated from the clean cover via the same Remotion still pipeline and referenced by publish-to-blog.

### [low/structure/S] Duplicate multi-MB PNG copies of the thumbnail in two trees; candidate naming drifts per package

- Evidence: md5 identical: 2026-08-19/imgs/00-cover-thumbnail.png, 00-cover-thumbnail-v1-candidate-a.png, src/videos/2026-08-16-.../assets/thumbnail.png (3.7 MB each); filenames across packages: 00-cover.png vs 00-cover-v1/v2.png vs 00-cover-v3-clean.png vs 00-cover-a2.png; yt-publish expects src/videos/.../assets/thumbnail.png while aaron-video-gen SKILL.md:708 expects <blog-dir>/imgs/thumbnail.png.
- Recommendation: Define one canonical naming contract in generation-and-delivery.md and enforce it in the package check: imgs/00-cover.png (clean), imgs/00-thumbnail.png (text), imgs/candidates/… for everything else; video assets reference the blog path instead of copying; ship the 1280x720 JPEG next to the PNG as imgs/00-thumbnail-yt.jpg.

## Metrics observed

- tiles/blog-illustrate/SKILL.md: 330 lines, 13 workflow steps, 9 required markdown artifacts per package
- Strategy visual files: visual-language.md 350 lines, blog-visual-system.md 247, blog-visual-style-library.md 89 (13 style families), aaron-editorial-visual-system.md 230
- 2026-08-19/imgs: 25 PNG (6 finals + 4 candidates + 15 video cards), 6 WebP, all 2048x1152; PNGs 2.5-4.0 MB each; cover WebP 184 KB, diagram WebP 42 KB; imgs dir ~165 MB
- Thumbnail 00-cover-thumbnail.png 3,728,350 bytes, byte-identical in 3 locations; YouTube limit 2,097,152 bytes; auto-converted to 1280x720 JPEG (~0.11 MB per video-qa-report.md)
- 2026-08-21/imgs: 3 PNG (1672x941, procedural Pillow), 1 WebP 63 KB, 0 body images, 0 thumbnail
- 2026-09-16/imgs: 4 PNG covers/probes (2.6-3.5 MB), 2 WebP (182 KB, 263 KB), 3 revisions recorded in one manifest
- 2026-07-06/imgs: 72 PNG / 55 WebP; 2026-10-07/imgs: 14 cover probe PNGs across v1-v4
- Packages with imgs but zero WebP (never finalized through the skill): 2026-02-12, 02-14, 02-16, 02-18, 02-20, 02-22, 02-23, 02-26
- Remotion thumbnail components: 4 hard-coded compositions in AuthorityBoundaryLongformThumbnails.tsx (531 lines), zero parameterized; no `still` target in remotion-render.ts
- Film final.mp4: 35.5 MB, 10:09; cover card 3.0 s uses thumbnail PNG; frame at 4 s is typographic cover-hero with no cover imagery
- Test coverage for illustration workflow: 1 test file, string-presence assertions only; blog-package-quality.ts image checks: path, >=1200px width, ~16:9, duplicates

## Open questions

- Which single visual family do you want as the channel identity going forward: the 08-19 warm paper / ledger-editorial world, or something else? Three files currently disagree and each post re-decides.
- Are you willing to put a persistent corner wordmark (AARON GUO) on blog covers and thumbnails, or should the identity stay typographic inside the film only?
- Do you want a faceless channel permanently, or would a stylized paper-craft avatar of yourself (consistent across thumbnails, like the s08 closing still) be acceptable as a recurring 'face' substitute?
- Have you looked at YouTube Studio's Test & compare results for 5vEEBhbfUWw, and is thumbnail CTR data being captured anywhere outside Studio?
- What is the monthly image-generation budget, and should the skill cap candidates per package (10-07 generated 14 cover probes)?
- For the local/offline production mode (08-21 ran on a text-only local model), is a procedural/Remotion-only cover acceptable as a first-class path, or should image work always wait for an image-capable host?
