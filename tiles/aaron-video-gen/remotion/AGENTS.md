# Remotion Renderer Rules

Before changing renderer code, consult `src/content/strategy/remotion-video-engineering.md`.

Required checks:

- Use Remotion frame primitives instead of CSS transitions or CSS animations.
- Keep caption display stable and phrase-level unless explicitly building a short-form karaoke caption style.
- Account for `TransitionSeries` overlap when computing durations.
- Run `npm run validate` from this directory after renderer changes.
