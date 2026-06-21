# Remotion Video Engineering

## Required Rules

- Use Remotion frame primitives: `useCurrentFrame`, `interpolate`, `Sequence`, `Series`, `TransitionSeries`.
- Do not use CSS transitions, CSS animations, or Tailwind animation classes inside Remotion compositions.
- Prefer `Easing.bezier(0.16, 1, 0.3, 1)` for crisp UI entrance and balanced `Easing.bezier(0.45, 0, 0.55, 1)` for editorial fades.
- Use `TransitionSeries` for between-scene transitions and subtract transition overlaps from duration calculations.
- Keep captions phrase-level and stable unless a short-form format explicitly needs word highlighting.
- Check text overflow for title cards, captions, chapter indicators, and thumbnail-like frames.

## Renderer Audit

Run the static Remotion audit before changing renderer code and after changing renderer code.
Run a still/frame check before accepting a full render when layout or timing changed.
