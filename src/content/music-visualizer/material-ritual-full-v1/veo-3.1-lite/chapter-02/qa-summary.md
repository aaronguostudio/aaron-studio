# Veo 3.1 Lite — Material Ritual / Smoke Basin

Generated: 2026-07-14

## Test contract

- model: `veo-3.1-lite-generate-preview` through the Gemini API;
- 8 seconds, native 1920×1080, 24fps, 16:9;
- same approved `anchor.png` supplied as the first and final frame;
- no provider audio used in the review preview; it was stripped and replaced
  with the first eight seconds of the approved Material Ritual Lyria master.

## Visual review

The locked macro composition, dark slate basin, smoke-glass disc, cool light,
and restrained water activity survive well. It does not introduce objects or
camera travel. The generated scene is visually coherent at 1080p, although it
adds faint airborne-looking texture to the background despite the prompt's
exclusions.

The loop is not yet production-equivalent to the Seedance strict loop. Frame
0-to-final-frame SSIM is `0.959881`, compared with `0.986350` for the existing
Seedance chapter-two 720p prototype from the same anchor. The beginning and
ending composition still agree broadly, but the lower score reflects changes
in water brightness and background texture that could become perceptible in a
long repeated loop.

## Decision

Keep Veo 3.1 Lite as a cost-conscious option for short, calm tests and
non-critical ambient inserts. Do not use this take as a 10-minute production
loop or replace the Seedance chapter with it. Any future Veo candidate must
pass the same seam comparison before assembly.

## Artifacts

- `output-1080p.mp4`: raw Veo generation, including its native audio.
- `output-1080p-silent.mp4`: visual-only source for assembly.
- `material-ritual-veo-lite-1080p-preview.mp4`: eight-second review preview
  with the project Lyria music.
- `qa/contact-sheet.jpg`: five-frame visual check.
- `qa/loop-seam-preview.mp4`: final 1.5 seconds followed by first 1.5 seconds.
- `qa/anchor-veo-seedance-comparison.jpg`: approved anchor, Veo start/end, and
  Seedance start/end in that order.
