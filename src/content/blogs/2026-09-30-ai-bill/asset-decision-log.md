# Asset Decision Log: OpenAI Halved My $200 Plan. So I Priced My Own AI Bill.

Everything not listed here is Remotion typography (receipt rows, tables, statements) built from `fact-pack.json`. Renderer copies live in `tiles/aaron-video-gen/remotion/public/ai-subscription-cloud-bill/`.

| Asset | Beat(s) | Narrative reason | Provenance | Rights | Fallback |
|---|---|---|---|---|---|
| `imgs/00-cover.png` (approved article cover) | s01 cover-hero (0:00), s35 closing (9:05) | Frame-zero identity: the receipt with one amber line running off the paper *is* the thesis. It returns under the final three sentences as the bookend. | Generated illustration (article package, no text); title, promise and identity are typeset over it | Project-owned generated art | Typeset title card on porcelain with a static amber rule |
| `imgs/charts/02-codex-meter.png` | s13 (3:15), s32 (8:35) | Shows the ceiling being hit five times; returns at the close as "What was 100% worth?" | Rendered from Aaron's Codex session logs (`charts/render_charts.py`, claim C11) | Owned | Typeset six-row meter ledger |
| `imgs/charts/03-bill-by-model.png` | s23 (5:40) | The whole bill as evidence: both totals, with amber cache-read share on every big bar | Rendered from Aaron's logs and official list prices (C8, C9) | Owned | Typeset totals card |
| `imgs/charts/05-model-vs-vendor.png` | s25 (5:56) | Two before/after pairs on one scale prove the model lever | Rendered from Aaron's logs and list prices (C10) | Owned | Typeset repricing rows |
| `2026-09-06-astra/imgs/00-cover-v3-launch-style.png` | s20 (4:41) | Image-rich reset and self-callback: the capability praised three weeks ago is what the bill is made of | Cover of Aaron's own published post (generated illustration), labeled on screen as such | Owned (Aaron's published cover) | Typeset callback card |
| Tibo quotation (text) | s05 (0:49) | Sourced sentence that reframes the plan in API dollars | Exact substring of the X post (fact-pack `tibo-reopen`), shown with ellipses and attribution | Short attributed quotation | Paraphrase with attribution |
| Hacker News quotation (text) | s09 (2:00) | The community reaction in its own words | Exact text from the HN thread, attributed to "Hacker News commenter" | Short attributed quotation | Paraphrase with attribution |
| `assets/aaron-logo-assets/ag-logo.png` | s36 end card | Established soft-mark sign-off | Brand asset | Owned | Name-only end card |

## Chart treatment (deliberate)

The package charts use one orange to mean four different things: the lost discount (01), capped weeks (02), cache reads (03) and the repriced amount (05). The film reserves amber for cache reads only. So 02 and 05 are shown desaturated (`grayscale(1)`) as graphite exhibits, labeled "SHOWN IN GRAPHITE · AMBER IN THIS FILM MEANS CACHE READS". 03 keeps its colour, and 01 and 04 are rebuilt natively as the $20-per-1× table and the cache-read price table. No chart data, labels or files were changed; the PNGs are byte-identical copies.

## Rejected candidates

- **OpenAI email screenshot** (`imgs/evidence/openai-pro-email-zh.png`): a private account artifact in Chinese localization; the plan terms are typeset from it instead.
- **Charts 01 and 04 as exhibits:** native rows say it better (row-by-row appends on the narration cue) and avoid the orange-means-discount conflict.
- **A terminal/log-scroll visual for "I opened my logs":** fake UI, and a privacy risk (paths, project names).
- **Generated video or new stills:** nothing in the argument needs footage; no generation budget for a same-day film.
- **Semantic sprite:** budget stays 0. The amber overflow line already does the mnemonic job with typography.
- **`imgs/thumbnail-youtube.jpg` as an in-film card:** the typeset cover-hero carries the same promise at frame zero without repeating "HALF" as a full-frame slide.

## Music decision

- **Searches (asset-library, 2026-09-30):**
  1. "calm editorial instrumental bed, patient, precise, no vocals, 9-10 minutes" (music, approved+candidate) returned 10 candidates, all `candidate` status with rights `needs-verification` (for example Luminous Tides, Prism Breaks I/II, Quiet Forms — Long Night, Mosslight).
  2. "editorial score bed piano cello" (music, approved only) returned no matching assets.
  3. "calm" (music, rights owned or licensed) returned no matching assets.
  4. Library stats: 128 assets; 0 `approved`; music rights are `needs-verification` or `unknown`.
- **Best register match:** `music:acbc0b82e70ac777` "Quiet Forms — Long Night" (felt upright piano, low energy, 600.0 s, which covers 565 s). Rejected for the master because its status is `candidate` and its rights are `needs-verification` (Eleven Music paid-plan terms unconfirmed). Only approved, rights-cleared assets may pass to a final render, and no new music may be generated for this pass.
- **Decision:** the master `video.mp4` is **narration only** (`music_strategy: none`). This is a rights and approval block, not a taste decision.
- **V5 audition rule:** to satisfy it, a 45 s internal scored prototype was mixed: `music-audition-quiet-forms-45s.mp3` (cold open narration with the bed about 25 dB under the voice, sidechain-ducked, -16.3 LUFS). It is internal only and not for publication. If Aaron clears the Eleven Music rights and approves the bed, it can be muxed under the finished picture without a re-render (stream-copy the video, then mix at the same level with a fade into the end card). No `asset-library use` event was recorded, because nothing was selected.

## Thumbnail

`imgs/thumbnail-youtube.jpg` (1280×720 JPEG, 112 KB, under the 2 MB upload ceiling) was re-checked at 320×180 and at list scale (168×94). "$200 →" and "HALF" stay legible, the receipt with the amber line remains the focal object, and contrast holds. No change.

## Music (2026-09-30, original Eleven Music score, candidate)

- **Decision:** Aaron chose "generate an original Eleven Music score" today. This supersedes the narration-only stance above for the scored cut only. The existing narration-only `video.mp4` is unchanged.
- **Asset:** `score/score-master.wav` (48 kHz stereo, 510.000 s, -22.0 LUFS integrated, -7.0 dBTP, unducked). It is one continuous `music_v2` composition-plan generation (song-id `h9knWPMmeFOInQpXa3kV`) with 11 chunks cut on the paced-narration section boundaries plus a 5.93 s end-card tail. There are no stitches or crossfades. The bed is restrained felt piano, a soft plucked pulse and a warm low pad, centered on D throughout, with no vocals or drum kit. Full provenance, QA and rights are in `score/score-manifest.json`.
- **Takes:** three full takes were generated. B was rejected for a near-silent cold open. C was rejected for 29.7 s of silence and heavy chord swells.
- **Taste check:** `score/audition-under-voice-60s.mp3` covers 200-260 s, the "30-day bill" into "the re-read" lift, with the score 20 LU under the voice.
- **Known trade-offs:** the score is very dark, with almost nothing above 4 kHz. That keeps the speech band clear, but soloed it reads warm and muffled. At 466 s the bed takes a ~4 s breath, dipping to about 19 dB below the bed, at the ending section change. Hear 460-475 s before approving.
- **Rights:** the Eleven Music terms (updated 26 May 2026) allow online commercial use, including monetized YouTube, on every self-serve tier. Attribution is required only on Free. Music libraries are prohibited. The plan tier could not be read through the API because the key lacks `user_read`. Status is `needs-verification` until Aaron confirms a paid plan.
- **Library:** registered in the Asset Inbox as candidate `candidate:45863b1e05db3394` (policy `suggest`, pending), with intended status `candidate` until approved. No `use` event has been recorded yet.

## v2 decisions (2026-09-30)

| Asset | Beat(s) | Narrative reason | Provenance | Rights | Fallback |
|---|---|---|---|---|---|
| 3D cold-open scene (`ledger-3d.tsx`, `ColdOpen3D`) | s01 (0:00–0:24) | Makes the hook physical: the meter hits the cap, the bill prints, and the amber line runs off the paper (the cover's gesture) | Original @remotion/three scene. Meter values are the Pro-account weekly peaks (C11); printer and receipt are conceptual and labeled so | Owned | v1 2D cover-hero, email and priced scenes (`build-data.py --no-3d`) |
| 3D re-read scene (`Reread3D`) | s18 (3:48–4:14) | Shows why cache reads dominate: every turn re-reads the whole stack, and the sweeps grow | Original @remotion/three scene. Counts are conceptual; the ≈17 billion figure is data (f-17b) | Owned | v1 2D loop system-map and 17-billion statement |
| `score/score-master.wav` (original score) | whole film | The continuous bed Aaron approved by ear after two under-voice auditions | Eleven Music `music_v2` composition plan aligned to the 12 narration sections; manifest `score/score-manifest.json` (SHA-256 `9f32f68e…aae4a`) | **Cleared**: paid plan (Creator or higher) confirmed by Aaron on 2026-09-30. Do not register with Content ID; do not upload to music libraries | `video-v2-nomusic.mp4` |

**Music decision (supersedes the v1 "narration only" decision):**
- The score is used in the publication master `video-v2.mp4`.
- It sits at a fixed -13.1 dB: about 20–22 LU under the voice per chapter, and about 27 LU under in the quiet opening.
- The voice is left at unity, and nothing in the mix pumps.
- The score is not in the asset-library catalog (it sits in the asset inbox), so there is no `library_asset_id` and no `use` event. The earlier Quiet Forms audition is no longer relevant.

## v3 decision (2026-09-30): the score's lead-in

- **Lead-in source:** the score at 10.0–13.2 s (its own cold-open texture).
  - Placed from 0.3 s at -6.1 dB with a 0.8 s fade-in.
  - It fades out over 2.2–3.5 s under the first words.
- **Alignment:** the rest of the score stays aligned to the voice (delayed 2.2 s), at -13.1 dB as in v2.
- **Why not shift the whole score:** moving it 1.4 s earlier was rejected. It would move the deliberate ~12 dB breath at "A bill I can finally read" under the previous sentence, and it would end the tail before the end card.
- No new music was generated.
