# 001 — Reveal the ownership panel without scaling its text

- **Status**: DONE
- **Commit**: eb02afe
- **Severity**: HIGH
- **Category**: Transform origin and geometry integrity
- **Estimated scope**: 1 file, about 20 lines

## Problem

The final scene reveals a fixed-width indigo panel by scaling its parent container on the x-axis. The white statement is nested inside that same container, so its letterforms are horizontally compressed while they are already visible. At 47.2 seconds the panel is about 32% open while the statement is about 58% opaque; at 47.3 seconds the panel is about 50% open while the statement is about 83% opaque. This produces a visible “thin text growing wider” artifact and must not become a reusable workflow pattern.

```tsx
/* before: tiles/aaron-video-gen/remotion/src/AuthorityBoundaryConceptPrototype.tsx */
<div
  style={{
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 650,
    backgroundColor: palette.ink,
    transform: `scaleX(${panel * (1 - reset)})`,
    transformOrigin: "right center",
  }}
>
  <div
    style={{
      position: "absolute",
      left: 66,
      right: 66,
      top: 280,
      color: palette.white,
      fontFamily: type.serif,
      fontSize: 66,
      fontWeight: 700,
      lineHeight: 0.98,
      opacity: ramp(time, 47.1, 47.9) * (1 - statementExit),
    }}
  >
    Cannot own
    <br />
    the consequence.
  </div>
</div>
```

## Target

Keep the panel and its text at their final geometry for every rendered frame. Reveal the panel with a right-origin clipping mask, then fade the text inside the already-visible portion. The exact target is:

```tsx
/* target */
<div
  style={{
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 650,
    backgroundColor: palette.ink,
    clipPath: `inset(0 0 0 ${(1 - panel * (1 - reset)) * 100}%)`,
  }}
>
  <div
    style={{
      position: "absolute",
      left: 66,
      right: 66,
      top: 280,
      color: palette.white,
      fontFamily: type.serif,
      fontSize: 66,
      fontWeight: 700,
      lineHeight: 0.98,
      opacity: ramp(time, 47.1, 47.9) * (1 - statementExit),
    }}
  >
    Cannot own
    <br />
    the consequence.
  </div>
</div>
```

The reveal continues to use the existing `panel` and `reset` progress values and the existing `easeInOut` curve. Do not change the narration timing, copy, panel dimensions, typography, color, or the later reset.

## Repo conventions to follow

- Time is deterministic and comes from the scene’s `time` prop; do not introduce CSS transitions or animations.
- The existing `ramp()` helper and `easeInOut` curve in `AuthorityBoundaryConceptPrototype.tsx:35-48` remain the timing source.
- Mask reveals are appropriate for geometry-bearing containers; transforms are appropriate for standalone marks and imagery, not for text-bearing parents.
- The reusable rule is: reveal a text-bearing panel with a mask or clipping boundary, never by scaling the text’s ancestor.

## Steps

1. In `tiles/aaron-video-gen/remotion/src/AuthorityBoundaryConceptPrototype.tsx`, replace the panel’s `transform` and `transformOrigin` declarations with the exact `clipPath` expression shown above.
2. Keep the nested statement markup and opacity timing unchanged.
3. Render the existing `AuthorityBoundaryConcept` composition to a temporary MP4 using the existing project command.
4. Extract frames at 46.8s, 47.05s, 47.2s, 47.3s, 47.55s, and 47.8s from the encoded MP4. Confirm the letterforms have identical horizontal geometry at every partially visible frame.

## Boundaries

- Do NOT touch any other scene or its timing.
- Do NOT change the statement copy, font, font size, panel width, or opacity interval.
- Do NOT add dependencies.
- Do NOT use `scaleX()` on a parent that contains text.
- If the current file no longer contains the cited parent transform and nested statement, STOP and report drift instead of improvising.

## Verification

- **Mechanical**: from `tiles/aaron-video-gen/remotion`, run `npm run validate` and expect a zero exit code; then render `AuthorityBoundaryConcept` with the existing Remotion render command and expect successful H.264 output.
- **Feel check**: inspect the encoded output at 25% playback speed and compare the six extracted frames. Confirm:
  - the panel still opens from the right edge;
  - the text never looks narrow, stretched, or rescaled;
  - there is no flash or one-frame edge jump at the beginning or end of the reveal;
  - the text fade remains subordinate to the panel reveal.
- **Done when**: the encoded frame strip shows fixed letterform proportions throughout 46.8–47.8s and the full-speed transition retains the original restrained editorial rhythm.
