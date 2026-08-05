# Clean Indigo Concept — Sprite V1 QA

## Status

**PASS — OPTIONAL ENHANCEMENT CANDIDATE.**

This report covers the restrained transparent-ledger variant of the approved
Clean Indigo Concept prototype. The original clean render is preserved for an
A/B decision; this variant does not replace it automatically and does not
trigger upload or publication.

## Artifact

| File | Video | Audio | Duration | Size | SHA-256 |
| --- | --- | --- | ---: | ---: | --- |
| `authority-boundary-clean-concept-sprite-v1.mp4` | H.264 High, 1920×1080, 30 fps, 1670 frames, `yuv420p`, limited-range BT.709 | AAC-LC, 48 kHz, stereo, 192 kb/s | 55.680000 s | 3,144,360 bytes | `3eeaa8da1d538796c1e281e67ddfd9d1fce6181e782e334a886d6d64079919c6` |

The deterministic Remotion encode is retained as
`authority-boundary-clean-concept-sprite-v1-remotion-master.mp4`
(4,712,807 bytes, SHA-256
`b0b652ada11df9e05d111c76fc3cfacb68814d6b8d8488e0948f54356f925e54`).

## Sprite Decision

- One sprite only: a mature indigo clothbound ledger representing “system of
  record.” No other scene received decorative media.
- It begins at 20.7 seconds, reaches its stable state near 21.1 seconds, starts
  clearing at 23.55 seconds, and is gone by 23.9 seconds.
- Motion is limited to a 12-frame fade and 10-pixel upward settle. There is no
  rotation, bounce, loop, or recurrence.
- The object sits in the right-side negative space and remains clear of the
  headline, authority axis, labels, and subtitle safe zone.
- Exact generation prompt, source and output hashes, alpha metrics, rights,
  and usage are recorded in
  `../../imgs/video/sprites/authority-ledger-v1-manifest.json`.
- The asset is project-specific and excluded from automatic reusable-library
  intake. The post-generation scan retained 128 catalog assets and did not add
  this sprite.

## Visual QA

- Encoded sequential review passed across 20.3–24.0 seconds. Review surfaces:
  `sprite-keyframes-sequential.png`, `sprite-20-24s-contact.png`, and
  `sprite-21.7s-encoded.png`.
- The sprite appears with the “system of record” phrase, holds through the
  decision-change clause, and exits before the next question takes ownership.
- No green-dominant pixels were found in the encoded sprite region
  (0 of 192,700 inspected pixels), and no green, black, or dirty matte fringe
  is visible at full resolution.
- The visible object occupies roughly 10% of frame width. The headline remains
  the first visual hierarchy.
- Independent visual review: PASS. It found the semantic binding accurate,
  placement safe, opacity continuous, and realism restrained enough to avoid
  reading as a product image or decorative gimmick.

## Planning And Technical QA

- Director plan: PASS, 5 beats, no warnings.
- Content evidence: PASS, 6 sources, 10 facts, 5 asset beats, no warnings.
- Storyboard planning audit: PASS. The custom Remotion prototype exists and is
  the reviewed implementation for the registry's prototype scene templates.
- Remotion typecheck and source audit: PASS; five pre-existing static-module
  warnings remain non-blocking.
- Full encoded video and audio decode: PASS.
- `blackdetect` at `d=0.5:pix_th=0.02:pic_th=0.98`: no events.
- `silencedetect` at both `-60 dB` and `-45 dB` for two seconds: no events.
- Encoded audio: `-16.63 LUFS` integrated, `-4.68 dBTP`, `2.90 LU` LRA.
- Decoded audio MD5 is identical to the approved clean version:
  `a412a49fc2c0b1620639105c72e0015d`.

## Decision Gate

Aaron should compare this variant with the original clean prototype and decide
whether the ledger adds enough semantic value to become the selected render.
The base version remains untouched.
