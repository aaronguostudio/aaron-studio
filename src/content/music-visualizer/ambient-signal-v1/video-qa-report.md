# Ambient Signal Engine v1 — prototype QA

## Scope

The prototype covers three original scene families rendered by one shared
Canvas engine in a browser and Remotion: Signal Loom, Moon Tides, and Breath
Field. No external image, video, component, or music asset is used.

## Static review

- Rendered 1920×1080 entry, peak, and exit frames for all three scenes.
- All scenes preserve large negative space and remain legible at contact-sheet
  scale.
- Focus keeps its routed module system inside the central safe field.
- Sleep preserves a single moon/constellation hierarchy with no bright edge
  collisions.
- Relax distributes motion across the width without introducing a dominant
  high-frequency focal point.

## Loop review

Entry and final-frame comparisons were measured with FFmpeg PSNR. Higher means
less visible difference across the loop boundary:

| Scene | Cycle | Entry/exit PSNR |
|---|---:|---:|
| Signal Loom | 18s | 47.20 dB |
| Moon Tides | 24s | 47.21 dB |
| Breath Field | 20s | 37.53 dB |

Signal Loom's attention sweep uses a cosine return rather than a linear reset.
Breath Field's moving particles fade at the horizontal edges before wrapping.
The encoded 18-second Signal Loom master was decoded sequentially at frames 0
and 539; its boundary measured 45.38 dB PSNR after H.264 compression.

## Engineering review

- `npm run validate` passes.
- Browser JavaScript syntax checks pass.
- The local interactive preview reports no browser console errors.
- The Remotion wrapper derives time from `useCurrentFrame()` and contains no
  CSS animation, hover, pointer, scroll, or wall-clock dependency.
- Seeds, palettes, intensity, programme duration, and loop duration are public
  props.
- Long renders repeat the short cycle; they do not duplicate or decode a long
  video asset.

## Remaining production gate

The scene remains `prototype`. Before promotion, review one 20–40 second motion
sample with the intended music, test audio-analysis modulation, and inspect the
encoded master at mobile review size.
