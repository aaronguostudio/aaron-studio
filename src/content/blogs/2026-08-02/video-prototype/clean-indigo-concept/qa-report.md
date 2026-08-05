# Clean Indigo Concept Prototype QA

## Status

**TECHNICAL, INDEPENDENT AUDIO, AND CONTINUOUS-MOTION PASS — AARON CONTINUOUS-PLAYBACK APPROVAL PENDING.**

This report covers the 55.68-second concept prototype created after Aaron's
feedback on the Indigo Field Journal version. It does not approve or trigger a
full-film render, upload, or publication.

## Artifact

| File | Video | Audio | Duration | Size | SHA-256 |
| --- | --- | --- | ---: | ---: | --- |
| `authority-boundary-clean-concept.mp4` | H.264 High, 1920×1080, 30 fps, 1670 frames, `yuv420p`, limited-range BT.709 | AAC-LC, 48 kHz, stereo, 192 kb/s | 55.680000 s container / 55.666667 s video | 3,513,885 bytes | `7daadbb0142d7cb81871f5da6db2912f2958a506be543da14213792a41a3bad7` |

The deterministic Remotion encode is retained as
`authority-boundary-clean-concept-remotion-master.mp4` (4,671,823 bytes,
SHA-256 `36f8988e1a7085f3f327e5e2367bd547cc232d5e8244efb585bb5e7388cf8ac1`).

## Planning And Renderer Gates

- Director plan: PASS, 5 beats, no warnings.
- Content evidence: PASS, 6 sources, 10 facts, 5 asset beats, no warnings.
- Storyboard: PASS, 5 scenes; expected prototype-readiness warnings only, with
  deterministic `image-sequence` fallbacks.
- Narration script audit: PASS, 115 tokens.
- Remotion typecheck and source audit: PASS. Five pre-existing static-module
  warnings remain non-blocking.
- Music strategy is `none`; no third-party visual or audio asset entered the
  render.

## Encoded Technical QA

- Full video and audio decode: PASS.
- Video: H.264 High, 1920×1080, progressive, 30/1 fps, 1670 decoded frames,
  `yuv420p`, limited-range BT.709.
- Audio: AAC-LC, 48 kHz, stereo, 192 kb/s.
- `blackdetect` at `d=0.5:pix_th=0.02:pic_th=0.98`: no events.
- `silencedetect` at both `-60 dB` and `-45 dB` for two seconds: no events.
- Encoded audio: `-16.63 LUFS` integrated, `-4.68 dBTP`, `2.90 LU` LRA.
- Independent audio regression: PASS. All joins remain below local transient
  thresholds; the click found in narration v2 is absent.
- First frame contains the complete opening question; last frame contains both
  ownership questions. Neither boundary is blank or stale.

## Visual And Content QA

- `FIELD JOURNAL` and the permanent header rule are removed; the header contains
  only `AARON GUO`.
- The canvas is a solid porcelain field. Ruled lines, texture, dashboard cards,
  report tables, glow, and persistent dark theme are absent.
- Deep indigo is used as an accent and for one brief ownership panel, not as the
  default background.
- The old state-mapping case, line-level implementation detail, and downstream
  system inventory are removed. The film now develops one concept: review depth
  should follow what code is authorized to change.
- At 13–14 seconds, the authority axis and marker persist while the old claim
  clears and the low-consequence claim enters. Dense 10 fps review strips show
  continuous ownership with no black gap or page cut.
- At 49–51 seconds, the indigo panel clears before it narrows into the shared
  center line; the final two questions then enter on the same axis. No clipped
  panel text or double hierarchy remains.
- Independent sequential-frame review: PASS across 13 seconds, 24–25 seconds,
  30 seconds, 44–45 seconds, and 50 seconds. Every old headline fully exits
  before the next headline enters.

Review surfaces:

- `contact-sheet-encoded.png`
- `transition-13s-contact.png`
- `transition-30s-contact.png`
- `transition-45s-contact.png`
- `transition-50s-contact.png`
- `stills/source/`
- `stills/encoded/`

## Remaining Gate

Aaron should watch this prototype continuously and approve the art direction,
pacing, and information density before any longer film is redesigned or
rendered.
