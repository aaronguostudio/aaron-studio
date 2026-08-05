# Motion Gate V2 QA

## Decision

**PASS for prototype use.** The approved ledger accent now uses the reusable
`SemanticSprite` component, and the final ownership panel uses a mask reveal
instead of scaling text. The visual result remains restrained and narration-led.

## Build

- Render: `authority-boundary-clean-concept-motion-gate-v2-remotion-master.mp4`
- SHA-256: `3f4d842763d8031dce5a6e9bfe83531c2b4358a8fe15d19dc9ca1212c5614d2e`
- Size: 4,618,277 bytes
- Video: H.264 High, 1920×1080, 30 fps, 55.68 seconds
- Audio: AAC-LC, 48 kHz, stereo
- Full decode: PASS, no reported errors
- Remotion validation: PASS
- Final workflow-hardening rerender after the shared runtime motion binding:
  byte-identical to the approved master (same SHA-256; PSNR infinite, SSIM 1.0).

## Semantic Sprite

- Director budget: one explicitly approved beat; zero remains the workflow default.
- Role: explanation, not evidence.
- Motion contract: 0.4-second entrance, 0.367-second exit, 10-pixel settle;
  the exit is explicitly shorter and the timing remains FPS-derived.
- Asset and manifest audit: PASS.
- The exact renderer-loaded public copy is path-bound and SHA-bound to the
  canonical audited PNG through the runtime registry used by `staticFile()`;
  a stale or differently referenced copy now fails preflight.
- Manifest entrance and exit endpoints are bound to the storyboard cue and
  asset-targeted clear beat at the composition's registered 30 fps, with at
  most one frame of rounding tolerance.
- The renderer reads those endpoints, entrance/exit durations, translation,
  and opacity from the same registry; runtime motion drift now fails preflight.
- Alpha: 0–255; 1,060,685 transparent pixels; 3,040 partially transparent pixels.
- Light and dark composite review: PASS. The automated dark-edge warning is an
  intentional indigo/charcoal illustration outline, not a matte halo.
- Encoded entrance and exit strips: PASS. The ledger appears once with the
  “system of record” phrase, uses opacity plus a small settle, and clears before
  the question changes.
- Previous-approved versus componentized 20.5–24.5s interval:
  PSNR 62.92 dB, SSIM 0.999969. The refactor is visually equivalent.

QA artifacts:

- `sprite-asset-audit.md`
- `sprite-qa/authority-ledger-v1-on-light.png`
- `sprite-qa/authority-ledger-v1-on-dark.png`
- `motion-gate-qa/sprite-entry-strip.png`
- `motion-gate-qa/sprite-exit-strip.png`
- `motion-gate-qa/sprite-25pct.mp4`

## Ownership Panel

- Previous defect: the indigo panel used parent `scaleX()`, compressing its
  visible child text during 46.8–47.8 seconds.
- Fix: fixed-size panel with a right-origin `clipPath` reveal.
- Sequential 10 fps strip: PASS. Letterform proportions remain fixed at every
  partial reveal; no flash or one-frame edge jump.

QA artifacts:

- `motion-gate-qa/panel-mask-strip.png`
- `motion-gate-qa/panel-mask-25pct.mp4`

## Workflow Verification

- 110 video-workflow tests: PASS.
- Director plan audit: PASS.
- Content and evidence audit: PASS.
- Storyboard planning audit: PASS with expected prototype warnings.
- Aggregate prototype preflight: PASS; it now cross-checks the sprite's source,
  output, and renderer-copy hashes, decoded alpha metrics, scene, role, style
  family, FPS, entrance cue, and exit cue across the director, asset,
  storyboard, and manifest lanes.
- Production remains intentionally blocked until the prototype scene templates
  are promoted or replaced by available fallbacks. The separately bounded
  `semantic-settle` recipe has passed this prototype and is now available.
