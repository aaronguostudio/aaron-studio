# Indigo Field Journal Prototype QA

## Status

**TECHNICAL AND INDEPENDENT FRAME-LEVEL VISUAL PASS — AARON CONTINUOUS-PLAYBACK APPROVAL PENDING.**

This report covers only the selected 87.853306-second redesign prototype. It
does not approve the full film or promote any prototype scene capability in the
registry.

## Artifact

| File | Video | Audio | Duration | Size | SHA-256 |
| --- | --- | --- | ---: | ---: | --- |
| `authority-boundary-indigo-prototype.mp4` | H.264 High, 1920×1080, 30 fps, 2636 frames, `yuv420p`, limited-range BT.709 | AAC-LC, 48 kHz, stereo, 192 kb/s | 87.914000 s container / 87.866667 s video | 5,003,800 bytes | `def40737b6658c86dcb74384e8603c9c285dc018a8f1f5875d6546d061508434` |

The deterministic Remotion encode is retained separately as
`authority-boundary-indigo-prototype-remotion-master.mp4` (6,389,816 bytes,
SHA-256 `37afeb28d85657766846bc2702b61f102dc88c0fa23504bc0a2e03b5379f7f08`).
The review artifact is a standards-oriented `yuv420p` / BT.709 master derived
from it.

## Planning And Renderer Gates

- Director plan: PASS, no warnings.
- Content evidence: PASS, no warnings.
- Storyboard planning: PASS; only the expected registry-readiness warnings for
  prototype templates remain.
- Remotion typecheck: PASS.
- Remotion source audit: PASS for the new component; the five reported static
  module warnings predate this prototype and are non-blocking.
- Approved narration and existing word timings were reused without regeneration.
- Music strategy remains `none`; no unresolved-rights media entered the render.

## Encoded Technical QA

- Video stream: H.264, 1920×1080, 30/1 fps, 2636 decoded frames.
- Audio stream: AAC-LC, 48 kHz, stereo.
- `blackdetect` at `d=0.10:pix_th=0.10:pic_th=0.98`: no events.
- Strict `blackdetect` at `d=0.05:pix_th=0.05:pic_th=0.99`: no events.
- `silencedetect` at `-50 dB` for two seconds: no events.
- Encoded audio: `-16.4 LUFS` integrated, `-4.6 dBTP`, `4.1 LU` LRA.
- First frame contains the two customer states and article identity.
- Last frame contains the complete source-reading / repeatable-evidence
  comparison; it is neither blank nor stale.

## Visual And Boundary QA

- Reviewed source and encoded key frames at 1920×1080 and as 640×360 cells.
- Source and encoded contact sheets match in layout, typography, crop, indigo
  value, and caption placement.
- Clean-cut pairs reviewed at frames `404/405`, `998/999`, `1230/1231`, and
  `2056/2057`; none contains a black gap, double exposure, or partially
  initialized layout.
- The prototype uses porcelain as the default field and deep indigo as its only
  accent. Green, coral, neon, glow, rounded cards, dashboard chrome, and a black
  subtitle bar are absent.
- Dense status layouts use clean cuts rather than crossfading two complete
  reading hierarchies.
- The article illustration is shown as a first-class grayscale/indigo figure,
  then replaced by a masked ledger reveal.
- The ledger surface now finishes unfolding before its title and rows appear;
  the clipped-title artifact caught at frame 1510 in independent review is
  resolved.
- A focused independent recheck of frames `1495–1540` passed: the surface
  covers the illustration first, text begins only after the wipe, and no
  clipping, jump, collision, or double hierarchy remains.
- The dark indigo field is limited to the brief `ROLLBACK ≠ RESTORATION`
  punctuation beat.
- Captions stay in the protected bottom rail and do not collide with diagrams,
  figures, or conclusions.

Review surfaces:

- `contact-sheet-source-key.png`
- `contact-sheet-encoded-key.png`
- `contact-sheet-source.png`
- `stills/source/`
- `stills/encoded/`

## Remaining Gate

Aaron must watch the prototype continuously and approve the new art direction,
pacing, and typography before the 290.305125-second full film is redesigned or
rendered. The full-film treatment must also vary its chapter compositions rather
than repeat the ruled-ledger structure continuously. The rejected dark/green
prototypes remain technical baselines only.
