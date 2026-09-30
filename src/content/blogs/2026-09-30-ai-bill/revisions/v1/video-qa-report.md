# Video QA Report: OpenAI Halved My $200 Plan. So I Priced My Own AI Bill.

Status: **local review master complete (2026-09-30).** Nothing was uploaded, published or committed. Aaron has not yet watched the film or heard the re-voiced "The Re-Read" segment.

## Master

- `video.mp4`: 1920×1080, 30 fps, H.264 (CRF 18) with AAC 48 kHz stereo. Video 565.000 s, audio 565.013 s (A/V difference 13 ms, one AAC frame). 41,897,229 bytes.
- SHA-256: `d58d42a03f09d9ffa12e87803be00ad7085164b12a57c7bb415efe949d545858`
- Timeline: narration 0–557.85 s (locked `audio-retimed-1.05.mp3`, starting at frame 0). The final line holds until 559.0 s, then the silent brand end card runs 559.0–565.0 s.
- Composition: `tiles/aaron-video-gen/remotion/src/projects/ai-subscription-cloud-bill/index.tsx` (`AiBillFilm`). Rendered with `npx remotion render src/projects/ai-subscription-cloud-bill/index.tsx AiBillFilm … --crf=18` from `tiles/aaron-video-gen/remotion`.
- Superseded local render (before the fixes below): kept only in the session scratchpad, not in the package.

## Gates

- `director-plan-audit.md`: PASS (36 beats, style reference `ledger-editorial-v1` reviewed, 0 s generated video, 0 sprites).
- `content-evidence-audit.md` (production): PASS (12 sources, 19 facts, 36 asset beats).
- `video-storyboard-audit.md` (production): PASS (36 scenes, 565 s, no prototype capabilities, no warnings).
- `production-preflight-report.md` (`--production`): PASS.
- `npm run validate` (tsc + remotion-audit): PASS. The only warnings are pre-existing ones in unrelated files; none are in this project.

## Prototype slice

- `video-prototype-slice.mp4` (72.04 s, 228.0–300.0 s of the real composition; SHA-256 `c9833b05…aa15aa`) covers the structured line-item receipt, the signature amber overflow (s17), the connector-draw loop, the 17-billion number, the calm earlier-post still, and entry into the price table, with narration and captions.
- Inspection: frames every 3 s, plus a sequential strip at 0/25/50/75/100% of the overflow (242.87–244.5 s) and the loop arc (263.95–265.6 s).
  - The receipt holds across the s16→s17 boundary with no cut. s16's right-side copy clears in 0.3 s before the s17 headline settles, so there is no double exposure.
  - The amber bar grows from the CACHE READS row past the paper to the frame edge and stays in its own band. The share rows (78/76/58%) sit below it with clearance (moved from y 600 to 650 after the first still pass).
  - Each loop connector draws before its arrowhead, and each node activates on its spoken word.
- One defect found and fixed before the full render: the arc label ("EVERY TURN · RE-READ THE CONVERSATION SO FAR") appeared while the arc was still about 64% drawn. It now waits until the arc completes (+1.4 s). The slice file predates this fix and two later tweaks, so it is a review artifact, not a cut of the final master.

## Contact sheet and visual checks (encoded master)

- `video-contact-sheet.png`: 58 frames, one every 10 s from 0:00 to 9:20, plus 9:24, taken from the encoded master with exact timestamps. Every scene shows a meaningful layout. No missing media, blank stages, clipped text, or collisions between captions and content.
- Stills from every scene (38 source stills) were reviewed during the build. Defects fixed from those passes:
  - $20 values touching the column box: padded.
  - 5× bracket drawn below the table: position fixed.
  - Verdict and "prepaid budget" lines wrapping badly: explicit line breaks.
  - Share rows too close to the amber band: moved down.
  - A stray 8 px strike stub on unstruck "20× PLUS" cells: now zero-width at p=0.
  - Near-empty entry stages on the email and Tibo scenes: the headline and quote now sit as light placeholders and ink in on their cue.
- Chapter cuts: frames immediately before and after all 11 chapter cuts, the end-card cut and the s16→s17 continuity point were decoded from the master. Each outgoing layout is intact to the cut, and the incoming one fades up from porcelain over 8 frames. There are no black frames, no double exposure, and no partially initialized layouts.
- Black detection (`blackdetect d=0.3 pix_th=0.10`): no black interval.
- Text fit and caption safe area:
  - Captions are 216 stable phrase captions (white on graphite, no karaoke), all inside the protected band (y ≥ 926). The longest (68 characters) fits on one line.
  - No layout places content below y 890.
  - Captions and chapter chrome are hidden on the closing scene (the three final sentences are typeset verbatim over the cover) and on the end card.
- Privacy scan of on-screen strings and captions: no file paths, account IDs, client or project names, or second Codex account. Step 01 says "Codex: session files · Claude Code: project logs" in words only.

## First 20 seconds (promise check)

- 0.0 s: the approved receipt cover with the full title, the promise line and `AARON GUO · AI-NATIVE BUILDER` are all visible at frame zero.
- 0.6 s: the first visual change, as the meter row (`SEP 2026 · CODEX WEEKLY METER · 99–100%`) settles in, alongside the 1.8% cover scale.
- ~5.9 s: the `5 OF 6 WEEKS` stamp.
- 8–15 s: "From October 30, the same $200 buys half as much." with 20× struck to 10×.
- 15–25 s: "I priced every token I used in the last 30 days." and the unlabeled amber row: "The expensive part wasn't what I expected."
- The title and thumbnail promise (the $200 plan halved, a real bill) is delivered within 15 s, and the bill tease by 22 s. The first numbers ($9,400 vs $3,600) land at 3:06; the cache-read reveal lands at 4:03.

## Audio

- Integrated loudness is -17.0 LUFS, LRA 3.7 LU, true peak -4.9 dBTP.
  - The locked narration is -16.9 LUFS / -1.8 dBTP mono.
  - Remotion upmixes mono to stereo at -3 dB per channel, which keeps LUFS and lowers the per-channel peak.
  - The master was not normalized further, because the narration is locked. It sits about 1 LU under the ~-16 LUFS house target. That is acceptable; a +1 dB gain at mux time is safe (it would give about -3.9 dBTP) if Aaron wants parity.
- Silence detection (-50 dB, ≥1.5 s): exactly one interval, 557.71–565.01 s (the intended final-line hold plus the silent end card). The last 1.0 s measures -91 dB, so the file ends in true silence.
- Sync: master audio against the locked narration shows a constant +43 ms offset (about 1.3 frames) at 10 s, 228 s, 297 s and 555 s, with no drift. This is consistent with mp3/AAC priming handling. It is below one caption-perceptible frame and is accepted.
- **Re-voiced segment `slide-05` ("The Re-Read", 228.09–297.57 s), join check** (signal analysis on both the locked narration and the encoded master; not an ear test):
  - Join 1 (slide-04 → slide-05, 3:48.09):
    - The join falls in room tone at -55 to -61 dB (50 ms RMS). The largest sample-to-sample step within the 280 ms before the join is 0.003, so there is no discontinuity.
    - The largest step within ±150 ms is a speech transient at +108 ms, 0.38–0.57× the window's 99.9th-percentile step.
  - Join 2 (slide-05 → slide-06, 4:57.57): the same result. Room tone is -54 to -62 dB, the maximum pre-join step is 0.003, and the largest near-join step is a speech onset at +108 ms (1.2–1.5× the p99.9 of the window, normal for a plosive).
  - Level:
    - slide-04 tail: -17.9 LUFS (-18.0 in the master).
    - slide-05: -17.6 LUFS.
    - slide-06: -16.5 LUFS (-16.6 in the master).
    - Across all 12 sections the level ranges from -16.4 to -17.6 LUFS. slide-05 sits 0.1 LU from its predecessor and 1.1 LU under its successor, which is within the take-1 section-to-section spread (hook and slide-04 are also about -17.5).
  - Verdict: no click and no level jump attributable to the splice. Timbre and voice continuity still need Aaron's ear before public release, as `audio-generation.md` already notes.
- Music: none in the master. There is no approved, rights-cleared bed in the asset library; the full record is in `asset-decision-log.md`. The internal 45 s audition `music-audition-quiet-forms-45s.mp3` (candidate bed, rights unverified, -16.3 LUFS) is included for Aaron's ear only.

## Thumbnail

- `imgs/thumbnail-youtube.jpg` (1280×720 JPEG, 112 KB) re-checked at 320×180 and at 168×94 list scale.
- "$200 →" and "HALF" stay legible, the receipt and amber line remain the focal object, and it passes. It is under YouTube's 2 MB ceiling.

## Open items and accepted variances

1. Aaron has not yet heard the re-voiced slide-05 segment or watched the full film. Review is recommended in the unlisted upload before the video goes public.
2. The bill-by-model chart keeps its colour (its amber means cache reads). The meter and repricing charts are shown in graphite by design. A viewer may notice that the colour exhibit and the graphite exhibits differ; this is labeled on screen.
3. The chart palette's orange (#D2701C) and the cover's amber (#E89C27) are two slightly different ambers. The film uses the chart orange for all typeset amber so that exhibits and rows match.
4. `youtube-metadata.md` still holds the pre-render chapter estimates. Use `youtube-chapters.md`.
5. Loudness is -17.0 LUFS, about 1 LU under the house target; see Audio above.
6. The package has no `package-state.json`. None was created; the video canonical record is this report plus the SHA-256 above.
