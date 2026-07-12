# FDE Field Signal V3 QA Report

## Result

Status: PASS for review delivery.

The full 82-second V3 render fixes the projected-boundary failure in the
deployment scene and presents ACTOR as Aaron's deployment framework.

## Encoded Master

- File: `fde-field-signal-full-v3.mp4`
- Duration: `82.389333s`
- Video: H.264, `1920x1080`, `30fps`
- Audio: AAC, stereo, `48kHz`
- Size: `6,637,544 bytes`
- SHA-256: `50f90f9a212d5ddf83b3090c317091fcc4dc5a4e9fc105e9e3b435690c15f3c5`

## Motion And Layout

| Check | Result |
|---|---|
| Model card maximum Y rotation is 36 degrees | PASS |
| Minimum projected width remains above 80 percent | PASS |
| Card and operating panel stay outside the deployment result zone | PASS |
| Deployment turn sampled at 0/25/50/75/100 percent | PASS |
| Encoded deployment band window contains no overlap or partial layer | PASS |
| ACTOR arrowhead waits for the return path | PASS |
| ACTOR payoff uses a separate stage and stays clear of captions | PASS |

Source stills are in `qa-v3/`. Sequentially decoded encoded-master checks are
in `qa-v3/encoded-deployment-turn-sequence.png`,
`qa-v3/encoded-deployment-band-sequence.png`, and
`qa-v3/encoded-actor-loop-sequence.png`. The full encoded contact sheet is
`rendered-contact-sheet-v3.png`.

## Audio

- Regenerated only the ACTOR section with `aaron-pvc-identity-v1`.
- Applied the approved `1.04x` editorial retime.
- Preserved the first `56.048s` of the V2 score; stretched only the ACTOR tail.
- Final mix: `-17.24 LUFS`, `-4.02 dBTP`, loudness range `3.5 LU`, no long silence.

## Automated Checks

- Remotion TypeScript validation: PASS.
- Remotion source audit: PASS with two pre-existing timing-primitive warnings in
  `TitleCard.tsx` and `GradientOverlay.tsx`.
- Aaron video generator tests: `51 passed, 0 failed`.
- Skill validation: PASS.
- Storyboard planning audit: PASS. Four capabilities remain prototype-labeled
  until Aaron approves this V3 render for promotion.

## Delivery

The local master and iCloud copy have identical SHA-256 hashes. The iCloud path
is `Aaron Studio/Blog Videos/2026-07-06/fde-field-signal-full-v3.mp4`.
