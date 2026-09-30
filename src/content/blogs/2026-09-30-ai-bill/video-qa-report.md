# Video QA Report — v3: OpenAI Halved My $200 Plan. So I Priced My Own AI Bill.

**Status:** v3 publication master complete (2026-09-30). Nothing was uploaded, published or committed. v2 (`video-v2.mp4`, 8:30) is superseded, and its QA report, chapters and plans are archived in `revisions/v2/`. v1 is archived in `revisions/v1/`.

## What changed from v2

Aaron watched v2 as an unlisted upload and asked for one change: v2 started talking at 0.0 s, which felt abrupt. Everything else in v2 was approved as is.

- **2.2 s musical lead-in.**
  - Frame 0 is unchanged: the full cover-hero (title, promise, AARON GUO · AI-NATIVE BUILDER over the 3D desk).
  - During the lead-in the camera drifts in slowly (linear, so the motion is visible from frame 0), and a status light on the printer pulses slowly.
  - The meter fill starts at 2.8 s, and the receipt print still lands on its words.
- **Timing.** The narration and every timing derived from it (cuts, cues, captions, chapter starts, 3D beats) are shifted by +2.2 s. `build-data.py` applies the shift to the word timeline, so everything moves on one clock. There are no captions before 2.2 s.
- **Length.** The film is now 512.2 s. The last line ends at 506.27 s and holds to 507.2 s, then the end card runs 507.2–512.2 s.
- **One small fix while checking the opening.** In v2 the title block and the "From October 30…" email block overlapped for about 0.3 s. The title now clears completely before the email block enters, so the two text stages no longer overlap.

### Score handling: voice-aligned score plus a lead-in cut from its own opening

I kept the score aligned to the voice and prepended a lead-in taken from its own opening texture. I did not shift the score 1.4 s earlier. The score was generated in one pass as a composition plan whose section changes sit on the narration boundaries. At the first eight boundaries the change is smooth (≤ 2 dB either side), so anticipating them would have been harmless. Two places would have gone wrong:

1. **The chapter 11 breath.** At the start of "A bill I can finally read" the score deliberately drops about 12 dB. Shifted 1.4 s early, that drop would land mid-sentence under "…a pricing decision, not a migration."
2. **The ending.** The score's tail would fade to silence at about 507.1 s. That is before the end card, so it would no longer resolve into it.

With the score aligned, its 5.5 s tail fade finishes 1.3 s into the end card, exactly as in v2.

The lead-in itself:
- Source: the score at 10.0–13.2 s, from the cold-open "sparse pulse" section.
- Placement: from 0.3 s, at -6.1 dB (7 dB above the bed level, since there is no voice yet), with a 0.8 s fade-in.
- Hand-off: it fades out over 2.2–3.5 s while the voice-aligned score's own opening swell rises underneath. The overlap is the same texture, about 20 LU below the voice.
- The lead-in measures -37.3 LUFS over 0–2.2 s. That is a gentle pre-narration lift, the same device the ledger baseline used.

## Masters

| File | Audio | SHA-256 | Duration | Loudness |
|---|---|---|---|---|
| `video-v3.mp4` (**publication master**) | narration + score | `8876a3d3631f355886e711bc73845db61aeea8705f29da04c25bcb431e4c2841` | 512.200 s (8:32), video and audio | -14.0 LUFS integrated, LRA 3.3 LU, true peak -1.5 dBTP |
| `video-v3-nomusic.mp4` (fallback) | narration only | `b31c87f602ef7334e580f852cea6f9e0114d24596afdacc6538fcb1c0a71fb1e` | 512.200 s | -14.0 LUFS, true peak -1.8 dBTP |
| `video-v3-opening-20s.mp4` (review clip, 0–20 s of the scored master) | narration + score | `3c5a5690b9249dfe8a6463f2a4889fff600d1c958df9e0692660b1c124ddfb18` | 20.000 s | -14.3 LUFS, true peak -1.8 dBTP |

- Both masters are 1920×1080 at 30 fps (15,366 frames), H.264 CRF 18, with AAC 256 kbps at 48 kHz stereo.
- Both use the same picture: one narration-free Remotion render (`--muted --gl=angle`), stream-copied.
- **Audio, mixed in ffmpeg from the locked sources:**
  - Voice: `audio-paced-1.10.mp3`, dual-mono at unity, delayed 2.2 s.
  - Score: `score/score-master.wav` at a fixed -13.1 dB, delayed 2.2 s.
  - Lead-in: as described above.
  - The three are summed without normalization.
- **Loudness target (agreed with Aaron):** voice at unity, about -14 LUFS, true peak ≤ -1 dBTP.

## Gates (production mode, v3 plans)

All four gates were rerun after the final render:

- `director-plan-audit.md`: PASS. 33 beats; the cold-open first visual change is at 0.1 s.
- `content-evidence-audit.md` (production): PASS. 12 sources, 19 facts, 33 asset beats.
- `video-storyboard-audit.md` (production): PASS. 33 scenes, 512.2 s, no warnings.
- `production-preflight-report.md` (`--production`): PASS.

`npm run validate` (tsc + remotion-audit) also passes; its only warnings are pre-existing ones in unrelated files. The registry is unchanged since v2: `ledger-3d-explainer`, `highlight-scan` and `path-trace` are available, each with a note citing Aaron's approval.

## First 5 seconds (checked on the encoded master)

| Time | What happens | How it was checked |
|---|---|---|
| **Frame 0** | Full cover-hero: identity line, the two-line title and the promise over the 3D desk. The printer's idle light is lit. No captions. | Decoded frame |
| **First visual change** | The camera drift and the idle-light pulse begin on frame 0. | Mean absolute pixel difference against frame 0: 0.32 at 0.1 s, 1.44 at 0.5 s, 2.79 at 1.0 s (the changed region spans the desk, printer and bars) |
| **Music entry** | Audible from 0.22 s and settles near -37 LUFS by about 0.6 s. There is no voice before 2.2 s. | First 10 ms window above -50 dBFS in `video-v3.mp4` |
| **Voice** | First word "Five" at 2.20 s. | Measured onset 2.23 s in `video-v3-nomusic.mp4` (first 10 ms window above -45 dBFS; the word's attack) |
| **Captions** | First caption "Five times in September," from 2.20 s. | Caption data |
| **Meter** | Bars start filling at 2.8 s. | Decoded frames |

After 5 s the opening continues as approved in v2, shifted by 2.2 s:
- 7.8 s: 5 OF 6 WEEKS stamp.
- 9.88 s: email line.
- 15.7 s: 20× struck to 10×.
- 17.1–22.9 s: the bill prints.
- 22.9 s: the amber line runs off the paper.

The title and thumbnail promise lands by about 16 s.

## Visual QA (encoded v3 master)

- **Contact sheet:** `video-v3-contact-sheet.png` has 54 frames, one every 10 s from 0:00 to 8:30, plus 8:29 and 8:31.5, all from the encoded master. Every scene reads, the 3D frames rendered at every sampled time, and there is no missing media and no text colliding with captions.
- **Cut frames:** exact frames n-2 to n+2 were decoded by frame index around all 11 chapter cuts (26.27, 68.20, 109.51, 150.35, 207.83, 270.33, 301.99, 355.61, 385.67, 420.98, 468.42 s), into and out of the 3D re-read (230.42, 255.70 s), and into the end card (507.20 s).
  - Each outgoing layout stays intact up to the cut, then the incoming one fades up from porcelain over 8 frames. The exhibits and the Astra still use a 0.45 s crossfade.
  - There is no double exposure and no half-initialized 3D canvas.
- **Black detection** (`d=0.3`, `pix_th=0.10`): no black interval in either master or in the opening clip.
- **Caption safe area:** 216 stable phrase captions, all in the protected band (y ≥ 926). There are none before 2.2 s. Captions are hidden on the closing scene and the end card. The 3D overlays end at about y 895.
- **Privacy scan** (all on-screen strings and captions, including the new lead-in): clean. There are no file paths, account IDs, client or project names, or second Codex account.

## Audio QA

- **Sync:** envelope cross-correlation of each master against the locked narration offset by +2.2 s gives 0 ms lag at 0.5, 250 and 500 s (correlation 1.000 for the no-music master, 0.993–1.000 for the scored one).
- **Voice-to-score gap:** unchanged from v2, since the score stays aligned to the voice. It is 20–22.7 LU per chapter, and about 27 LU in the cold open once the lead-in has handed over. There is no phrase pumping.
- **Silence** (-50 dB, ≥1.5 s):
  - `video-v3.mp4`: only 507.53–512.2 s. The score's tail fades into the end card and reaches true silence inside the file (last 1.0 s at -90 dB).
  - `video-v3-nomusic.mp4`: 0–2.22 s (the lead-in, intentionally silent without the score) and 506.14–512.2 s. The last 1.0 s is at -91 dB.
- **Score rights:** `score/score-manifest.json` rights are `cleared` (paid plan, Creator or higher, confirmed by Aaron on 2026-09-30). Do not register the score with YouTube Content ID, and do not upload it to music libraries.

## Open items and accepted variances

1. `youtube-metadata.md` still carries the old chapter estimates. Use `youtube-chapters.md` (v3).
2. The package has no `package-state.json`; none was created. The canonical v3 record is this report plus the SHA-256 values above.
3. Carried over from v2 and accepted:
   - The meter and repricing charts are shown in graphite.
   - About 0.3 s of porcelain appears as the Astra still crossfades in.
4. Aaron has not yet watched v3 or the 20 s opening clip. The only other change from v2 is the title/email text overlap fix at about 9.9 s.
