# Motion Craft Gate

This is a Remotion adaptation of the animation discipline in
[Emil Kowalski's skills repository](https://github.com/emilkowalski/skills),
especially `find-animation-opportunities`, `emil-design-eng`,
`review-animations`, and `improve-animations`. It adopts the repository's
purposeful restraint and review method without copying interaction-specific UI
rules into a fixed video timeline.

Source snapshot: [`da80201`](https://github.com/emilkowalski/skills/tree/da80201b64de7d608a6dc5f723797ce6c65b692b), including the
[`find-animation-opportunities`](https://github.com/emilkowalski/skills/blob/da80201b64de7d608a6dc5f723797ce6c65b692b/skills/find-animation-opportunities/SKILL.md),
[`review-animations`](https://github.com/emilkowalski/skills/blob/da80201b64de7d608a6dc5f723797ce6c65b692b/skills/review-animations/SKILL.md), and
[`improve-animations`](https://github.com/emilkowalski/skills/blob/da80201b64de7d608a6dc5f723797ce6c65b692b/skills/improve-animations/SKILL.md) contracts.

## Decide Whether To Move

Every candidate passes four questions before implementation:

1. **Recurrence:** how often will the viewer encounter it? Repeated chrome,
   motifs, and scene furniture should move less than a rare narrative event.
2. **Purpose:** does it orient, explain, emphasize, bridge, or provide a rare
   moment of delight? If none apply, keep it static.
3. **Cognitive load:** can the movement finish without competing with dense
   narration, reading, or evidence?
4. **Function:** does it preserve continuity, expose a state change, explain a
   relationship, or prevent a jarring boundary?

Record deliberately rejected candidates as well as accepted ones. A still
state or clean cut is often the best motion decision.

## Plan With Precise Vocabulary

Do not write “smooth transition.” Name the behavior:

- `reveal`, `mask reveal`, `settle`, `stagger`;
- `continuity transition`, `shared element`, `bridge`;
- `origin-aware`, `connector draw`, `focus shift`, `crossfade`.

For each accepted beat, record its purpose, continuity anchor, registered
recipe, cue time, duration, curve, movement envelope, and why the static state
was insufficient. A scene normally uses one primary recipe and no more than two
supporting recipes.

## Video Motion Tokens

Use narration-synced seconds as the portable contract, then derive frames from
the composition FPS. The frame counts below are 30fps reference values, not a
promise that should silently change on a 24fps composition:

- micro feedback or small reveal: 0.2–0.33 seconds (6–10 frames at 30fps);
- semantic accent: 0.3–0.5 seconds (9–15 frames at 30fps);
- bridge or hierarchy change: 0.47–0.8 seconds (14–24 frames at 30fps);
- peer stagger: 0.03–0.1 seconds (1–3 frames at 30fps) when the order must be legible;
- longer explanatory movement only when the narration and relationship earn it.

Use curves by role:

- entrance and settle: `Easing.bezier(0.16, 1, 0.3, 1)`;
- movement, morph, or editorial fade: `Easing.bezier(0.45, 0, 0.55, 1)`;
- exit: shorter than the entrance and chosen for the boundary;
- continuous motion: linear only when a continuous process is the content.

Serious editorial films default to no overshoot or bounce. Movement amplitude
must match the work's tone.

## Geometry And Continuity

- Derive all changing values from the Remotion frame clock.
- Prefer transform and opacity for standalone marks and imagery.
- Use a mask or clip for a text-bearing panel reveal. Never scale an ancestor
  that compresses its text or evidence children.
- Do not introduce an object from `scale(0)` when a small settle or reveal is
  sufficient.
- Keep entry and exit directions consistent with spatial meaning.
- Preserve an axis, object, color field, or explicit rhetorical cut across a
  scene boundary. A missing continuity anchor is not fixed by adding a flashy
  transition.
- Do not add motion to every screen. Use quiet states to protect comprehension.

## Review

Review motion after rendering, not only from source code:

1. Watch the whole piece at normal speed without stopping.
2. Review every motion interval at 25% speed.
3. Decode start, 25%, 50%, 75%, and end frames from the encoded interval.
4. For masks, nested transforms, paths, and shared elements, inspect a
   sequential frame strip rather than isolated fast-seek frames.
5. Check purpose, continuity, timing, geometry, and distraction independently.
6. Remove or weaken movement when its contribution is uncertain.

## UI Rules We Deliberately Do Not Copy

The source skills also cover hover, pointer capture, keyboard frequency,
gesture velocity, interruptibility, momentum, and runtime
`prefers-reduced-motion`. Those are valuable for interactive products but do
not map directly to a pre-rendered MP4. Likewise, a universal UI duration cap
does not replace narration-synced frame timing. For video, keep the transferable
principles—purpose, continuity, controlled curves, deterministic frames, and
slow-motion QA—and leave interaction mechanics in UI work.
