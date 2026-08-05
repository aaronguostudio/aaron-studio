# Video QA Report — Codex Research First (English)

Status: **PASSED**

## Deliverable

- File: `codex-research-first-en.mp4`
- Duration: 18.56 seconds
- Video: 1920×1080, 60 fps, H.264, yuv420p
- Audio: AAC, 48 kHz, stereo
- File size: 1,369,755 bytes
- SHA-256: `dffda12d3f90e2432c0d451cf2df0574bd2f571b0fcce54387c0b573bccc734c`

## Visual QA

- Frame-zero hook is present and readable.
- Prompt, research rows, recommendation, and end card remain readable in 640×360 mobile-scale checks.
- Encoded scene-boundary frames contain meaningful content with no black gaps or accidental double exposure.
- Motion samples confirm cursor focus, research-row reveals, recommendation build, and end-card settle.
- Required disclosure is visible: `RECREATED DEMO · SOURCE-BACKED`.

## Audio QA

- Original project-owned music cue; no third-party music asset was used.
- Integrated loudness: -16.2 LUFS.
- True peak: -1.4 dBTP.
- Loudness range: 0.5 LU.
- Music source SHA-256: `293d531280a78e0c7c50de142d01b019754376cc008dd2c42577e4679e334637`.

## Technical QA

- TypeScript validation passed.
- Remotion project validation passed with warnings only in pre-existing/shared files and the timing-free project entry file.
- Full decode test completed without errors.
- Official GitHub repository pages were used to verify the five named open-source examples.

## Supporting Artifacts

- `qa/source-contact-sheet.jpg`
- `qa/encoded-boundary-contact-sheet.jpg`
- `qa/motion-sample-contact-sheet.jpg`
- `qa/mobile-prompt.png`
- `qa/mobile-research.png`
- `qa/mobile-recommendation.png`

