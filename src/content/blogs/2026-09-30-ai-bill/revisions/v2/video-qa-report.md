# Video QA Report — v2: OpenAI Halved My $200 Plan. So I Priced My Own AI Bill.

Status: **v2 publication master complete (2026-09-30).** Nothing was uploaded, published or committed. v1 (`video.mp4`, 9:25, narration only) is superseded; its QA report and plan records are archived in `revisions/v1/`.

## What changed from v1 (Aaron's decisions after watching the unlisted v1)

1. **Pacing:** the narration is now `audio-paced-1.10.mp3` (504.0 s; pauses trimmed, then 1.10×; approved by Aaron after two samples). Every cut, cue and phrase caption was rebuilt from `audio-timeline-paced-1.10.json` by `build-data.py`.
2. **Two 3D scenes** (`ledger-3d-explainer`, in `ledger-3d.tsx`) replace v1's 2D cold open (s01–s03) and loop/17-billion scenes (s18–s19). Everything else in the film is the v1 composition on the new clock.
   - Cold open: weekly-meter bars, a printing receipt, and the amber line running off the paper.
   - The re-read: a page stack re-read by an amber beam each turn, then a time-lapse.
3. **Music:** the original Eleven Music score (`score/score-master.wav`, rights `cleared` in its manifest) sits under the voice.

## Masters

| File | Audio | SHA-256 | Duration | Loudness |
|---|---|---|---|---|
| `video-v2.mp4` (**publication master**) | narration + score | `7ea4b5fe04f8e2fbc67512d6df228cd89f53781a6cf3db35b0f1512b9010b4bc` | 510.000 s (8:30) video and audio | -14.0 LUFS, LRA 3.3 LU, true peak -1.6 dBTP |
| `video-v2-nomusic.mp4` (fallback) | narration only | `28bbf125a6ce573fb173af15f2dbc349b44a7f710a6e8818f9ca67ad8935c69b` | 510.000 s | -14.0 LUFS, true peak -1.8 dBTP |

- Both files: 1920×1080, 30 fps (15,300 frames), H.264 CRF 18, AAC 256 kbps at 48 kHz stereo, faststart.
- The picture is byte-identical in both (one narration-free Remotion render, `--muted --gl=angle`, then stream-copied).
- Timeline:
  - Narration runs 0–504.0 s, starting at frame 0.
  - The final line holds to 505.0 s.
  - The brand end card runs 505.0–510.0 s, which matches the score's 510.0 s.
- The audio was mixed in ffmpeg from the locked sources:
  - Voice: `audio-paced-1.10.mp3`, upmixed to dual-mono at unity (no gain, EQ or compression).
  - Score: `score/score-master.wav` at a fixed -13.1 dB. No sidechain pumping.
  - The two were summed without normalization.
- Mixing in ffmpeg rather than Remotion drops Remotion's -3 dB pan law on the voice (v1 measured -17 LUFS) and removes v1's 43 ms audio lag.
- Loudness target agreed with Aaron: voice at unity, about -14 LUFS (YouTube's playback reference), true peak ≤ -1 dBTP.

## Gates (production, v2 plans)

- `director-plan-audit.md`: PASS (33 beats, style reference `ledger-editorial-v1` reviewed, 0 s generated video, 0 sprites; the signature beat is s18, about 5% of runtime).
- `content-evidence-audit.md` (production): PASS (12 sources, 19 facts, 33 asset beats).
- `video-storyboard-audit.md` (production): PASS (33 scenes, 510 s, no warnings).
- `production-preflight-report.md` (`--production`): PASS.
- `npm run validate` (tsc + remotion-audit): PASS. The only warnings are pre-existing ones in unrelated files.
- **Registry promotions** (`tiles/aaron-video-gen/config/scene-registry.json`), each citing Aaron's approval on 2026-09-30 after the prototype review:
  - `ledger-3d-explainer`: prototype → available.
  - Motion recipes `highlight-scan` and `path-trace`, which the two scenes use: prototype → available.
  - The pre-existing uncommitted `granular-3d-explainer` entry is untouched.
- The v1 plan and audit records are archived in `revisions/v1/`.

## Prototype (approved)

- `video-v2-prototype-3d-scored.mp4` (53.9 s, 720p; SHA-256 `42730c75…73036d`) and `video-v2-prototype-3d.mp4` (narration only) contain both 3D scenes with about 1.5 s either side, narration and captions.
- Stills and a 1-second contact sheet are in `video-v2-prototype-stills/`.
- Aaron reviewed it and approved both scenes as they are ("Both pass, render the full video").
- Build fixes before the prototype:
  - Warm/dark tone: relit with neutral light and neutral tone mapping.
  - Meter labels colliding with the title and caption band: moved to fixed slots.
  - Hidden instanced pages casting stray shadows: fixed with instance count.
  - Stack labels off-frame: moved to the stack's right side.
  - "≈ 17 billion" wrapping: set to one line.

## Visual QA (encoded v2 master)

- **Contact sheet:** `video-v2-contact-sheet.png` has 53 frames, one every 10 s from 0:00 to 8:20, plus 8:27 and 8:29, all from the encoded master.
  - Every scene has a meaningful layout. The 3D frames rendered on every sampled frame, with no blank or black canvas.
  - There is no missing media and no text colliding with captions.
- **Chapter cuts:** exact frames n-2 … n+2 around all 11 chapter cuts plus the s17→s18 (into 3D), s18→s20 (out of 3D) and end-card cuts were decoded by frame index.
  - Each outgoing layout is intact up to the cut. The incoming one fades up from porcelain over 8 frames; exhibits and the Astra still use a 0.45 s crossfade.
  - There is no double exposure and no half-initialized 3D canvas. The 3D scenes are full on their first frame; the frame after a cut is porcelain by design.
- **3D motion intervals** were sampled from the master at 0/25/50/75/100%:
  - Amber overflow (20.70–24.07 s): the line prints on the receipt, then grows right across the desk and exits frame right, while the camera settles wide with the meter behind.
  - First beam sweep (237.84–239.61 s): the beam climbs the stack bottom to top, and the pages it has passed glow and decay.
  - Time-lapse (245.14–253.50 s): the stack grows as the camera pulls back and up, and "≈ 17 billion" resolves at the right.
  - No label crosses into the header or caption band at any sampled frame.
- **Black detection** (`d=0.3`, `pix_th=0.10`): no black interval in either master.
- **First 20 seconds:**
  - Frame 0 shows the title, the promise line ("One heavy user's 30-day AI coding bill, priced line by line at API list.") and `AARON GUO · AI-NATIVE BUILDER` over the 3D desk.
  - The first change is at 0.6 s, when the meter bars start filling. The bars reach the 100% cap by 5.6 s and the "5 OF 6 WEEKS AT 99–100%" stamp appears.
  - 7.7–14 s: "From October 30, the same $200 buys half as much." appears, with 20× struck to 10×.
  - 14.9–20 s: the bill prints.
  - At 20.7 s the amber line prints and runs off the paper.
  - The title and thumbnail promise lands within 14 s.
- **Caption safe area:**
  - 216 stable phrase captions sit in the protected band (y ≥ 926); the longest (68 characters) fits on one line.
  - The 3D overlays end at y ≈ 895 (conceptual label at y 868).
  - Captions and chrome are hidden on the closing scene (the final sentences are typeset verbatim) and on the end card.
- **Privacy scan** of on-screen strings (including the new 3D overlays) and captions: no file paths, account IDs, client or project names, or second Codex account.
  - The meter is labeled "PRO ACCOUNT".
  - Step 01 names folders in words only.
  - The 3D turn counter and "pages re-read so far" are labeled conceptual.

## Audio QA

- **A/V sync:** envelope cross-correlation against the locked narration gives 0 ms lag at 9.5, 210, 240 and 500 s in both masters (correlation 1.000 no-music, 0.987–1.000 scored).
- **Voice-to-score gap** per chapter (integrated LUFS; voice dual-mono vs score after -13.1 dB):

  | Chapter | Gap |
  |---|---|
  | hook | 26.9 LU (the score's quiet opening) |
  | slide-01 | 21.1 LU |
  | slide-02 | 20.3 LU |
  | slide-03 | 21.1 LU |
  | slide-04 | 20.3 LU |
  | slide-05 | 20.0 LU |
  | slide-06 | 21.4 LU |
  | slide-07 | 21.7 LU |
  | slide-08 | 21.6 LU |
  | slide-09 | 21.1 LU |
  | slide-10 | 21.8 LU |
  | slide-11 | 22.7 LU |

  That is the requested ~20 LU under the voice, with a fixed gain and no phrase pumping.
- **Silence:**
  - `video-v2.mp4`: silence detection (-50 dB, ≥1.5 s) finds only 505.33–510.0 s. The score self-fades into the end card and is at -57.7 LUFS between 504.1 and 506.4 s.
  - `video-v2-nomusic.mp4`: only 503.94–510.0 s.
  - The last 1.0 s of both files measures -90 dB or lower, so each file ends in true silence.
- **Re-voiced segment `slide-05`:** the pacing pass cut only inside silences and did not change the takes. The v1 signal check (no click, no level jump at either join) still applies; the new section levels are consistent (voice -14.6 LUFS in slide-04 and slide-05, -13.7 in slide-06).
- **Score provenance:** Eleven Music `music_v2`, composition plan aligned to the 12 narration sections.
  - `score/score-manifest.json` rights: `cleared` (paid plan, Creator or higher, confirmed by Aaron on 2026-09-30).
  - Terms notes to respect: do not register the score with YouTube Content ID; do not upload it to music libraries.
  - It sits in the asset inbox and is not yet catalogued, so no asset-library `use` event was recorded.

## Open items and accepted variances

1. The meter and repricing charts are still shown in graphite (so amber keeps one meaning), and the bill chart in colour. This is unchanged from v1 and labeled on screen.
2. The cut into the Astra still shows about 0.3 s of near-empty porcelain while the plate crossfades up. This is unchanged from v1 and accepted.
3. `youtube-metadata.md` still carries old chapter estimates. Use `youtube-chapters.md` (v2).
4. The package has no `package-state.json`. None was created; the canonical v2 record is this report plus the SHA-256 above.
5. Aaron has watched the 3D prototype, not the full v2 master. The rest of the picture is the approved v1 composition on the new clock.
