# Video QA Report

## Result

`PASS — creative-review prototype`

The master is technically and editorially ready for Aaron's review. It is not
marked publication-cleared because the SpaceX excerpts are commentary-review
assets rather than licensed footage, and the active commercial-use terms for
the ElevenLabs music cue still need verification.

## Master

- File: `starship-flight-13-en-prototype.mp4`
- SHA-256: `edfe9d48ea69736ef350a8ee7f48c93fca2c9e90f5cf67d2c247428b2082b96c`
- Duration: `59.050667` seconds
- Video: H.264, 1080x1920, 30 fps
- Audio: AAC, 48 kHz, stereo
- Size: 17,434,659 bytes

## Technical checks

- TypeScript/Remotion validation: pass; only pre-existing warnings in unrelated
  compositions.
- Full render: pass, 1,770 frames encoded.
- Black-frame detection: pass; no intervals at 0.20 seconds or longer.
- Integrated loudness: `-16.8 LUFS`.
- Loudness range: `3.9 LU`.
- True peak: `-3.6 dBFS`.
- Silence detection: one intentional 1.356-second narration/music breath around
  39.87–41.23 seconds; no unintended trailing silence after the music fix.

## Visual and editorial checks

- Reviewed eight source frames plus an encoded 10-frame contact sheet.
- Light ivory editorial system remains consistent across every scene.
- Titles, evidence cards, source labels, and progress chrome remain inside the
  9:16 safe area.
- Four official SpaceX excerpts are muted and source-labelled.
- The launch excerpt is explicitly labelled `ARCHIVE · NOT FLIGHT 13`.
- FAA findings are rendered as original typography, not copied page imagery.
- Planned mission objectives are labelled as plans, not achievements.
- The story has a complete arc: date -> failure context -> verified causes ->
  three observable tests -> repeatability payoff.

## Rights check

- SpaceX footage: short, transformed, muted, source-labelled commentary
  excerpts recorded in `asset-decision-log.md`; this reduces ambiguity but does
  not remove copyright or platform-claim risk.
- FAA facts: primary government source, restated in original graphics.
- NASA HLS connection: factual primary-source reference.
- Music: local library asset derived from ElevenLabs output; terms verification
  remains a publication blocker.
- Narration: Aaron production voice profile, generated specifically for this
  prototype.

## Final review gate

Before publishing, confirm the target launch date has not slipped, verify the
music license/plan terms, and make a final platform-specific judgment on the
four SpaceX commentary excerpts. The narration-only and owned-graphic fallbacks
are already documented.
