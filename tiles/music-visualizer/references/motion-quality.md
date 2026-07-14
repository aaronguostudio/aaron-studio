# Motion Quality Contract

The product promise is calm attention, not constant reaction. Treat audio
analysis as a musical state signal, not as a request to animate every transient.

## Mapping rules

- Use precomputed, frame-indexed analysis; do not use wall-clock animation or
  an always-on browser audio equalizer.
- Map smoothed energy and low-band envelopes to slow amplitude, light, depth, or
  opacity changes.
- Let spectral flux and onset pulse affect only a small halo or highlight. Never
  map an onset directly to scale, position, or repeated shaking.
- Give every continuous motion a long period: roughly 90–240 seconds for a
  full cycle in a 10-minute video.
- Keep the number of simultaneous moving focal elements low. One primary form
  plus one secondary signal is usually enough.
- Crossfade visual chapters over a musical handoff; do not hard-cut on a loud
  frame unless the music clearly asks for it.

## Style-specific motion budgets

- Paper Moon: one path, one attached motif, one low-contrast light response.
- Midnight Lo-Fi Wave: two or three wave ribbons, one 2.5D capsule, one slow
  signal point.
- Coffee Room: one repeated gesture and one parallax layer; keep beat response
  below the viewer's conscious attention.
- Glass Tide: one volume, one depth turn, one traveling highlight.
- Neon Strands: one woven light field and a slow atmospheric bloom; keep the
  filaments coupled so they feel like one luminous object, not an equalizer.
- Neon Orb: one centered material object with a quiet outer halo. Map bass to
  a slow material breath plus a contained pressure wave and brief internal
  energy bloom only at strong, short-lived low-frequency transients (not the
  decaying beat envelope), mids to the color journey, and highs to a small
  rim-brightness change; never use beat-driven scale or drift.
- Prism Chamber / Wave Grid / Signal Bloom: make the space itself respond to
  short low transients through refraction, crest light, or aperture bloom. Do
  not pan a virtual camera per beat, turn the field into an equalizer, or let
  a spatial effect obscure the music-led hierarchy.
- Clay Atlas / Pigment Tide / Paper Atlas are archived failed studies. Do not
  use them as a calm-motion fallback; their abstract material language does not
  meet the channel's world-building and organic-motion bar.
- Cinematic Cloud Desk: make the world carry the motion. Keep the camera stable
  or nearly stable; give the figure one restrained cyclical task and let clouds,
  foliage, haze, water, shadows, or sunlight provide the low-frequency movement.
  Do not make the person perform a visibly incomplete action, walk out of frame,
  or turn dramatically if the clip must reconnect to its first frame.
- Landscape Photo Essay: default to a still frame. Let the dissolve between
  photographs provide the visual rhythm; use one occasional centered 2–5% zoom
  only when it serves a particular composition. Do not pan an image in either
  direction without an explicit, composition-specific approval.

## QA gate

Review a 45–90 second sample before scaling. Inspect frame 0, first meaningful
change, midpoint, final fade, and a mobile-sized contact sheet. Reject a version
if the viewer can predict every beat from the geometry, if an object jitters in
place, or if a transition reads as a broken layout rather than a handoff.

For a long render, create a 30–60 second interval contact sheet and sequential
transition windows. Verify resolution, frame rate, audio duration, and that no
temporary `.render.mp4` remains beside the final master.

For a generated cinematic loop, also create a 3-second seam preview containing
the last 1.5 seconds immediately followed by the first 1.5 seconds. Reject it
if a hand, cloud bank, lighting direction, horizon, camera pose, or subject
silhouette jumps at the join.
