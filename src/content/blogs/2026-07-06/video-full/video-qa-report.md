# FDE Full Film V1 - Encoded Master QA

## Artifact

- File: `fde-full-film-v1.mp4`
- Duration: `451.669333s` (`07:31.67`)
- Video: H.264 High, `1920x1080`, `30 fps`, 16:9
- Audio: AAC LC, `48 kHz`, stereo, `317 kb/s`
- Size: `33,690,492 bytes`
- SHA-256: `93b434e412d768a944af7c939f98b49843b3e093d0b6490bbdf5ad54f5c70fc3`

## Build Gate

- Remotion typecheck: PASS
- Remotion composition audit: PASS
- Known audit notices: two existing static utility components do not contain
  their own timing primitive; neither controls this composition's motion.
- Render: PASS, `13,549 / 13,549` frames encoded without error.

## Layout And Motion Gate

- Full encoded contact sheet: PASS (`encoded-contact-sheet-v1.png`)
- Eight chapter boundaries sampled immediately before and after the cut: PASS
  (`qa-encoded/boundary-contact-sheet.png`)
- Chapter transitions use clean cuts so two complete information layouts never
  share a frame.
- Model-card rotation is bounded to `36deg`, retains at least about 80% of its
  projected width, and stays above a `64px` protected gap.
- Encoded deployment turn and deployment-band windows: PASS
  (`qa-encoded/deployment-turn-window.png`,
  `qa-encoded/deployment-gap-window.png`)
- ACTOR recursive connector: PASS. The arrowhead appears only after the path is
  complete (`qa-encoded/actor-arrow-window.png`).
- ACTOR label: `My deployment framework`; no `test` framing remains.

## Audio Gate

- Integrated loudness: `-16.90 LUFS`
- True peak: `-3.79 dBTP`
- Loudness range: `4.00 LU`
- Silence longer than two seconds at `-40 dB`: `0`
- The opening uses the approved quiet cello-led score before narration begins;
  narration enters at 2.5 seconds.

## Remaining Human Gate

- A continuous, start-to-finish listening watch remains the final subjective
  approval step. Automated measurements, full-film sampling, chapter-boundary
  sampling, and the two highest-risk motion windows all pass.
