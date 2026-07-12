# Remotion Video Engineering

## Required Rules

- Use Remotion frame primitives: `useCurrentFrame`, `interpolate`, `Sequence`, `Series`, `TransitionSeries`.
- Do not use CSS transitions, CSS animations, or Tailwind animation classes inside Remotion compositions.
- Prefer `Easing.bezier(0.16, 1, 0.3, 1)` for crisp UI entrance and balanced `Easing.bezier(0.45, 0, 0.55, 1)` for editorial fades.
- Use `TransitionSeries` for between-scene transitions and subtract transition overlaps from duration calculations.
- Keep captions phrase-level and stable unless a short-form format explicitly needs word highlighting.
- Check text overflow for title cards, captions, chapter indicators, and thumbnail-like frames.
- Treat `tiles/aaron-video-gen/config/scene-registry.json` as the capability source of truth.
- Do not add an unregistered production scene or motion recipe.
- Port Motion or React Bits behavior to frame-driven Remotion values; do not import autonomous browser timing, hover, cursor, scroll, or wall-clock animation.
- Use deterministic seeds for canvas, particles, shaders, and procedural layouts.
- Give every structured scene a meaningful entry state, visible scaffold, or bridge from the prior scene.
- Derive destination nodes and arrowheads from late parent-path progress. Do not
  show an endpoint before the relationship that supports it is visually complete.
- Use shared layout primitives for equal peers; scene code should not hand-tune
  separate padding, type, and dimensions for comparable columns or cards.
- A bridge must make its first meaningful change within one second.
- Keep content within each registered template's item and duration limits.
- Provide an available static or image-sequence fallback for prototype and experimental scenes.
- Use music and sound from the approved treatment; do not add a continuous bed by default.
- For information-bearing 3D planes, declare a transform envelope. Default to a
  maximum `36deg` Y rotation, at least `80%` projected width, and `64px` clearance
  from protected text or result zones. Verify 0/25/50/75/100% progress states.

## Scene Development

Before implementing a new scene:

1. Add it to the registry as `prototype` or `experimental`.
2. Select a realistic 20-40 second narration slice.
3. Implement entry, peak, exit, and fallback states.
4. Render stills at all three states and a motion sample with real audio.
5. Test long titles, maximum content, captions, and safe areas.
6. Run typecheck and the Remotion source audit.
7. Promote the registry status to `available` only after visual review.

For 3D, WebGL, or canvas scenes, check rendered pixels at desktop and mobile-like
review sizes. A compiling canvas is not evidence that the scene is visible or
correctly framed.

Do not infer transformed layout from the element's static width and height.
Perspective and rotation change projected bounds; reserve adjacent space from
the worst sampled state, not the resting state.

For encoded-master threshold checks, decode a short frame range sequentially.
Do not diagnose a path or 3D animation from one frame extracted with input-side
fast seek; inter-frame decoding can return an inexact or misleading partial image.

## Renderer Audit

Run the static Remotion audit before changing renderer code and after changing renderer code.
Run entry, peak, and exit still checks before accepting a full render when
layout or timing changed. Review a 60-90 second prototype before a full
essay-length render when a new scene or music treatment is involved.
