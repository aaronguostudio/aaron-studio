# Guizang Hybrid Pass

Use this pass when an editorial video needs stronger typographic hierarchy and
layout discipline than a free-form motion composition can safely provide.

## Division Of Labor

- Guizang contributes a visual treatment: theme rhythm, typography roles,
  palette semantics, named layout families, and static keyframes.
- Remotion rebuilds the selected layouts as live React components, then owns
  timing, animation, audio, captions, source media, and frame-level QA.
- Never use a recorded or screen-captured deck as the primary text-heavy scene.
  It cannot remain responsive to narration timing or layout QA.

## Required Artifacts

Create these before implementation:

1. `layout-manifest.json` with canvas safe area, palette roles, typography,
   named layout families, motion rules, and QA checks.
2. `visual-direction.md` explaining the chosen Guizang influence, what the
   film borrows, and what it intentionally excludes.
3. One static keyframe for every new layout family before rendering a motion
   version.

## Layout Contract

Every scene selects one named layout family before copy is placed. The manifest
must declare:

- title axis and maximum content area;
- supporting-copy zone;
- media or evidence slot;
- caption-safe zone;
- transform envelope for any animated object;
- allowed motion recipes and their dependencies.

Do not treat an existing deck's CSS class names as runtime components. Rebuild
the composition with the same hierarchy in React, using Aaron's design tokens
and a bounded set of scene templates.

## Visual Rhythm

One video may borrow editorial and Swiss principles, but it must still have one
visual spine. Keep typography, spacing, border behavior, and accent semantics
consistent. A mode change is appropriate for evidence or a diagram; an
unexplained style swap is not.

For Aaron's current editorial direction:

- use warm paper and deep ink as the primary fields;
- reserve cyan for field connection, coral for friction or gaps, and amber for
  evidence or caution;
- avoid generic dark dashboards, permanent green signal bars, and decorative
  chrome that does not encode narrative state.

## Motion Rules

- The first meaningful frame of a cover is complete: article identity, title,
  subtitle, and brand lockup are visible without waiting for an entrance.
- A title always owns a full reading axis. Never create a narrow title column
  simply to preserve a symmetric split layout.
- Nodes establish before connector lines draw. A line may not outrun either
  endpoint.
- Information-heavy stages transition through a clean cut or brief paper field,
  never a long crossfade.
- Any transform that could alter projected bounds must remain inside the layout
  slot and away from captions.

## Promotion Gate

An experimental Guizang hybrid should become a registered production template
only after it has:

1. passed a keyframe review at first frame, full information frame, and each
   transition boundary;
2. passed a full-motion review with final audio;
3. shown a reusable content contract that does not depend on one article's copy;
4. been added to `scene-registry.json` with an available fallback.
