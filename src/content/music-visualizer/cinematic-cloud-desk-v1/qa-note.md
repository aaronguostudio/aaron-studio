# Cinematic Cloud Desk v1 — Prototype QA

## Status

Candidate only. Do not extend to 10 minutes or upload until Aaron approves the
world, the loop, and the music relationship.

## Provenance

- Original text-to-video anchor generated with Seedance 2.0; no reference image,
  reference audio, copyrighted clip, named artist, named director, or named
  composer was supplied to the model.
- The strict loop uses that original `anchor.png` as both first and last frame.
- Provider audio is disabled. `music-preview/music.mp3` is a separate original
  Eleven Music track.

## Visual review

- Contact sheet: `seedance/contact-sheet.jpg`.
- Seam preview: `seedance/loop-seam-preview.mp4`, assembled as last 1.5 seconds
  followed by first 1.5 seconds.
- Frame review: `seam-contact-sheet.jpg` samples the join at 1.40, 1.49, 1.51,
  1.60, and 1.90 seconds. No structural jump was observed in the table, canopy,
  canyon, cloud bank, light direction, or subject silhouette.
- First/last frame image comparison: average PSNR 40.21 dB. This is visually
  close enough for a quiet loop prototype, but not evidence of a perfect pixel
  loop.

## Technical check

- Seedance loop: 1280×720, 24 fps, 15.04 s.
- Combined preview: 1280×720, 24 fps, 46.04 s, H.264 video plus AAC audio.

## Next gate

The next version may be 1080p and 10 minutes only if the viewer judges the
world as compelling and the loop as calm rather than merely technically clean.
