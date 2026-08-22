# Video QA Report — Ledger Harness Film (v2)

Status: COMPLETE (2026-08-16, overnight delegated run) — deliverables `video-v2.mp4` (scored) and `video-v2-nomusic.mp4` (rights-safe fallback); v1 slide render retained untouched as `video.mp4` baseline.

## Prototype Slice (log chapter, 219.1–301.6s → 82.56s)

- File: `video-prototype-ledger-log-chapter.mp4` (5.7 MB, 82.56s, 1080p30) — retained for Aaron's morning review.
- **Approval basis:** Aaron delegated overnight continuation in session, 2026-08-16 ("我希望你能够运行直到视频生成结束"). The prototype gate was executed as an agent frame-inspection pass in his stead; all inspection artifacts retained.
- Frame inspection (motion-craft + preflight checks):
  - Ink-page punctuation (SEQ 04) reads as intended; the film's only dark frame.
  - Cascade texture accumulates row-major; exactly three rows cyan; archive dim applies; the three advanced rows enter after cascade settles (dependency-safe).
  - System-map connector draws before its arrowhead (arrowhead only at p≥0.98); downstream nodes scaffolded muted before activation; mismatch branch blocked before the gate.
  - Five-lines card enters as a visible scaffold with first line landing at 0.6s (no-blank-stage: first change within 1s).
  - Captions stay in the protected zone across statement, map, and ledger scenes; header rail legible on porcelain, intentionally quiet on the ink page.

## Scene Stills Sweep (all 27 scenes, midpoint frames)

- 27/27 rendered and inspected at 0.34 scale; full-res spot checks on s01/s02/s11/s24.
- Defects found and fixed before the full render: mono indentation collapsed in the five-lines and disabled:true cards (whiteSpace: pre applied).
- Notables: quote page (s03), evidence stills with margin labels (s06/s15/s19/s26), 178-tally tear (s17), 27-stamp rail (s18), two-lane read (s23) all match the storyboard's entry visuals and accent discipline (cyan dominant, coral only at refusal/cost, zero green).

## Music

- asset-library searched first (reusable-asset gate): 5 candidates, all ambient/lofi register with rights `needs-verification` — rejected (wrong register per treatment; rights unverified). Recorded here.
- Original continuous score generated via Eleven Music (music_v2, force_instrumental): full-length request exceeded the API maximum; fallback to two arc-scripted segments (302.0s + 305.0s), stitched with a 2.0s tri crossfade at the 301.6s chapter seam → 605.1s master (`music-score/score-stitched.wav`; generation-manifest.json records song ids).
- Mix design (treatment: narration ~20dB above score): chapter gain envelope — pre-narration lift (0–2.2s), −22.5dB body, −30dB dry zone under the 44/3 signature (219–239s), −27dB under the catch (465–492s), end-card swell (599.7s+) fading to silence at 605.7s. Broad chapter-level curves only; no phrase pumping.
- Rights: Eleven Music paid-plan commercial-rights review previously recorded 2026-08-03 (08-02 production). Confirm account standing before YouTube publication; until confirmed, treat the scored master as publication-gated (the no-music master `video-v2-nomusic.mp4` is retained as the rights-safe fallback).

## Full Film — Final Checks (2026-08-16)

- Duration 605.72s (10:06) at 1080p30; video stream identical between scored and no-music masters (stream-copied mux).
- Narration fidelity gate: PASS (all nine sections word-stream-identical to the approved script; gate re-run after the final render).
- Loudness: -16.7 LUFS integrated, -4.1 dBTP. Envelope verified by segment measurement: body mix ≈ -20.5 dB mean; the 44/3 dry zone keeps the score at -30dB under narration; end card carries an audible held chord at -26 dB mean fading to silence.
- End-card fix recorded: Eleven's generated tail self-faded below usability (-36 dB), so a dedicated 8s held-chord slice (from the score's resolved region, 568–576s) is layered under the brand card with its own fades — deterministic, no re-render (mux only).
- Encoded preflight stills: cold open (identity at frame zero + 47%), lawyer evidence page, cascade, machine still, shelves close, end card — all match source compositions.
- Known accepted variances vs the v1 audio Aaron sampled: four sections are fresh takes with identical text under the approved profile (v1's takes contained the duplication defect); total narration 599.7s vs v1's 603s.

## Aaron Review Fixes (2026-08-16 morning)

Two defects from Aaron's first watch, both fixed and re-verified:

1. **Missing opening cover card** (a repeat-class miss — the V5 first-frame rule prefers the approved cover): a 3.0s cover card using the approved exact-text thumbnail now opens the film; narration, scenes, chrome, and score all shift +3s; chapters updated. Film is now 608.70s (10:09).
2. **Unwrapped ending audio**: the end-chord track previously extended past the file end and was hard-cut mid-fade. Fixed: 5.6s chord that reaches true zero 0.5s before the file end, score envelope ducks to zero at the end card (the chord track owns the ending), plus a 0.8s master tail fade. Verified: last 0.5s measures -91 dB (silence); end-card chord audible at -12 dB peak; overall -16.6 LUFS / -4.1 dBTP.

## Accuracy Correction (2026-08-16, post-publication)

Aaron flagged that "a week inside the repo" overstated the work: the teardown spanned 2026-08-13 (repo public) → 08-16 (publication). Corrected to "a few days" across nine surfaces — article EN/ZH (live, republished at main@548b63f), X / LinkedIn / newsletter / YouTube description / video brief / upload metadata, and the film narration itself ("convinced me to take a few days for this").

Film consequences, all executed:
- Slide 00 narration regenerated under the approved profile; its neighbour (hook) was invalidated by the pipeline's continuity-context rule and regenerated too — text word-identical, duration differs by −0.74s. Narration fidelity gate: PASS (nine sections).
- Total narration 599.7s → 597.22s. All 27 scene times remapped per-slide (linear within each slide, so intra-scene beat design is preserved), captions regenerated from the new word timings, chapter marks recomputed.
- Re-rendered and re-mixed with a rebuilt envelope (dry zone now 216.7–236.5s narration time, catch 462.8–489.7s). Final: 606.25s (10:06), -16.7 LUFS / -4.1 dBTP, end-card chord at -12 dB peak, last 0.4s at -91 dB (true silence). Corrected caption verified on an encoded frame at 58.5s.
- Release-date claim independently re-verified the same day (3 angles incl. adversarial): 2026-08-13 confirmed by GitHub API `created_at 2026-08-13T11:56:32Z`, earliest Wayback capture, HN submission time, and DeepSeek's own changelog. Ledger C5 upgraded to primary evidence.

## Deliberate Article/Film Divergence (2026-08-16, post-publication)

Aaron asked to add the prompt-cache lifetime point to the article's Finding 3 and explicitly scoped the film and narration out ("视频和语音就不用了"). The article (live, main@5a29515) therefore carries three paragraphs the film does not: the cache-has-a-clock limit, DSH's written disclaimer of cache lifetime, and the corrected DeepSeek pricing-cutover instant (16:00 UTC 08-16 = 00:00 Beijing 08-17, ~30x post-cutover ratio, where the film and its metadata still say "August 17" and the launch-week 1/50–1/120 figures).

This is an accepted divergence, not a defect: the film's claims remain true under their own "launch-week list prices" qualifier, and no film claim is contradicted by the new article text. Do NOT treat the missing cache-lifetime beat as a narration-fidelity failure — the gate compares narration to youtube-script.md, which is unchanged and still passes. If the film is ever re-cut, the natural insertion is after the 4:40 "bill" beat, and ledger rows C29–C31 carry the verified facts.

## Upload Record (2026-08-16)

- Uploaded v3 to YouTube after Aaron re-authorized OAuth: **https://youtu.be/5vEEBhbfUWw**, privacy `unlisted` (reversible; flip with `youtube-upload.ts --make-public 5vEEBhbfUWw`).
- Verified live via the Data API: title, category 28, 12 tags, duration PT10M7S, description carries the UTM link, the v3 chapter list, and the corrected "a few days inside the repo".
- Thumbnail initially rejected (`invalidImage`, 400). Root cause was size, not format: the approved cover is a 3.56 MB 2048×1152 PNG and YouTube's ceiling is 2 MB. Converted to a 1280×720 JPEG (0.11 MB) and set via the thumbnails endpoint; the live `hqdefault.jpg` was downloaded and visually confirmed to be the designed exact-text cover.
- Tooling fix so this cannot recur silently: `tiles/aaron-yt-pipeline/scripts/youtube-upload.ts` now measures the thumbnail and auto-converts anything above 2 MB to a 1280×720 JPEG before upload, logging the conversion. Both halves are proven — the oversized PNG failed on the old path, and the converted JPEG was accepted by the same endpoint.

## Ship List

- `video-v2.mp4` — scored master (publication-gated on Eleven Music rights confirmation).
- `video-v2-nomusic.mp4` — rights-safe fallback master.
- `video-prototype-ledger-log-chapter.mp4` — the 82.6s log-chapter prototype for Aaron's review.
- `music-score/` — generation manifest (song ids), stitched score, end-chord, mix envelope.
- Morning review asks for Aaron: (1) watch the prototype or full film — the delegated prototype approval stands in your name; (2) confirm Eleven Music account rights before YouTube upload; (3) chapters updated in youtube-metadata.md for the 10:06 cut.
