# 003 — Rebuild the harness comparison as a kinetic paired stage

- **Status**: DONE
- **Commit**: 6fd7428
- **Severity**: HIGH
- **Category**: Missed opportunity · explanatory motion / Purpose & cohesion
- **Estimated scope**: 2 files, roughly 700–1000 changed lines

## Problem

The comparison currently presents five small, flattened output images per lane and
only highlights the current thumbnail. That communicates a sequence of screenshots,
not the causal difference between a thin harness and an engineered harness.

In the standalone page, the current and inactive states are inserted in the same DOM
write. The new node is born with its final `active` class, so there is no prior
transform or opacity state for the browser to interpolate:

```css
/* src/brain/concepts/pages/harness-engineering.html:1334 — current */
.relay-frames {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  min-width: 0;
}

.relay-frame {
  position: relative;
  z-index: 1;
  display: grid;
  min-width: 0;
  min-height: 112px;
  place-items: center;
  opacity: .18;
  overflow: visible;
  padding: 4px;
  border: 1px solid transparent;
  border-radius: 11px;
  background: rgba(255, 253, 248, .94);
  transform: translate3d(0, 0, 0) scale(.92);
  transition:
    transform var(--motion-step) var(--motion-ease-in-out),
    opacity 180ms var(--motion-ease-out),
    border-color var(--motion-fast) ease,
    box-shadow var(--motion-fast) ease;
}

.relay-frame.active {
  opacity: 1;
  transform: translate3d(0, -4px, 0) scale(1.04);
}
```

```js
// src/brain/concepts/pages/harness-engineering.html:2228 — current
function relayFrames(lane) {
  return comparisonFrames.map((item, index) => {
    const position = index < comparisonPhase ? "past" : index === comparisonPhase ? "active" : "future";
    const suffix = String(index + 1).padStart(2, "0");
    return `<article class="relay-frame ${position}" aria-hidden="${index !== comparisonPhase}">
      <span class="relay-frame-index">${suffix}</span>
      <img
        src="../../../content/concepts/harness-engineering/assets/system-box-${lane}-${suffix}.png"
        alt=""
      >
    </article>`;
  }).join("");
}

thinRelay.innerHTML = relayFrames("thin");
engineeredRelay.innerHTML = relayFrames("engineered");
```

The Vue implementation mirrors the same filmstrip architecture:

```vue
<!-- src/content/concepts/harness-engineering/visual.vue:1392 — current -->
<div class="relay-filmstrip">
  <figure
    v-for="(phase, index) in comparisonPhases"
    :key="`thin-${phase}`"
    class="relay-frame"
    :class="{
      past: index < comparisonIndex,
      current: index === comparisonIndex,
      future: index > comparisonIndex,
    }"
  >
    <img :src="relayAssets.thin[index]" alt="" aria-hidden="true" />
  </figure>
</div>
```

Only recovery and evaluation have phase-specific motion in Vue. The most important
evaluation sequence is conditional on `.is-playing`, but normal autoplay sets
`isPlaying` to false as soon as it reaches the last phase, making that sequence
unreachable:

```css
/* src/content/concepts/harness-engineering/visual.vue:2634 — current */
.is-playing.phase-evaluate .verification-loop .fail {
  animation: relay-fail 5.2s ease both;
}

.is-playing.phase-evaluate .verification-loop .repair {
  animation: relay-repair 5.2s ease both;
}

.is-playing.phase-evaluate .verification-loop .pass {
  animation: relay-pass 5.2s ease both;
}

.phase-recover .thin-lane .relay-frame.current img {
  animation: relay-state-break 1.2s var(--motion-ease-in-out) both;
}
```

The phase holds are 3.2–5.6 seconds while the little visible motion lasts under
roughly 520ms. The resulting dead air makes the control feel broken. More
importantly, users never see permission close a boundary, an integration return a
signal, a checkpoint restore state, or a failed evaluation trigger a repair.

## Target

Replace the filmstrips with two large synchronized, persistent canvases:

- left: `薄 Harness`, warm/orange accent;
- right: `工程化 Harness`, blue accent;
- desktop: side by side;
- mobile: stacked, with each canvas still large enough to read;
- one real system-box image is visible per lane, not five thumbnails;
- the five existing stage controls remain above the canvases;
- the active stage icon acts inside each canvas instead of sitting as a static
  caption illustration;
- lane text is limited to the lane label, one status pill, and one short sentence.
  The existing source chips and live narration stay below the canvases.

Use the existing raster assets. Do not draw replacement illustrations:

```text
src/content/concepts/harness-engineering/assets/
  system-box-target.png
  harness-stage-01.png … harness-stage-05.png
  system-box-thin-01.png … system-box-thin-05.png
  system-box-engineered-01.png … system-box-engineered-05.png
```

The system-box PNGs are stage endpoint layers. The stage icons are the visible
actors. Simple paths, dots, pulses, masks, status pills, and flashes may be HTML/CSS
overlays. Never replace a real icon with custom SVG or CSS illustration.

### Scene architecture

Both implementations must use the same scene structure and class vocabulary:

```html
<div class="kinetic-stage phase-contract" data-phase="contract">
  <div class="kinetic-pair">
    <section class="kinetic-lane thin-scene">
      <header><!-- label + status --></header>
      <div class="kinetic-canvas">
        <div class="kinetic-box-stack" aria-hidden="true">
          <img class="box-layer box-before" />
          <img class="box-layer box-impact" />
          <img class="box-layer box-after" />
        </div>
        <div class="kinetic-actor" aria-hidden="true">
          <img class="actor-full" />
          <!-- Stage 03 only: two clipped copies of the same real plug asset. -->
          <span class="actor-half actor-left"><img /></span>
          <span class="actor-half actor-right"><img /></span>
        </div>
        <div class="signal-track" aria-hidden="true">
          <i class="signal signal-out"></i>
          <i class="signal signal-return"></i>
        </div>
        <span class="beat-pill beat-fail"></span>
        <span class="beat-pill beat-repair"></span>
        <span class="beat-pill beat-pass"></span>
      </div>
      <footer><!-- one short sentence --></footer>
    </section>
    <section class="kinetic-lane engineered-scene">…same shape…</section>
  </div>
</div>
```

The scene may be recreated for a stage rerun, but the stage container must receive a
new revision key before animation begins. It must never be inserted already frozen
in a final class with only a transition:

- standalone: increment `comparisonSceneRevision`, render
  `data-scene-revision="<revision>"`, and rely on stage-specific keyframe
  animations that begin on insertion;
- Vue: add `comparisonSceneRevision` and key the scene with
  ``:key="`${comparisonPhase}-${comparisonSceneRevision}`"``.

Use individual named keyframes with `animation-delay` and `animation-fill-mode:
both`. Do not implement one giant five-stage keyframe. Predetermined CSS animation
is preferred over JavaScript per-frame updates.

### Motion tokens

Reuse or define these exact tokens locally in both files:

```css
--motion-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--motion-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--motion-fast: 180ms;
--motion-step: 240ms;
--motion-travel: 480ms;
```

Animate `transform` and `opacity` for moving visual layers. Color/background
changes may animate on status pills. Do not use `transition: all`, `ease-in`, or
`scale(0)`. Use `translate3d` for moving layers.

### Five stage timelines

Each stage must contain at least three visibly different beats—setup, causal action
or feedback, and a frozen result. Stages 01–04 settle by approximately 2.2 seconds;
stage 05 settles by approximately 3.2 seconds. Any remaining phase hold is stillness
for reading.

#### 01 · 固定目标 (`contract`)

Use `system-box-target.png`, both `system-box-*-01.png` endpoints, and
`harness-stage-01.png`.

| Time | Thin harness | Engineered harness |
| --- | --- | --- |
| 0–220ms | Blueprint actor enters from `translate3d(0,-18%,0) scale(.96)` to rest. | Same synchronized entrance. |
| 320–900ms | Blueprint presses toward the system, then drifts `translate3d(12%,8%,0)` while fading to `.18`; the target imprint fades. | Blueprint presses onto the box; crossfade target to engineered stage 01, with a short blue imprint pulse. |
| 1050–1300ms | Status settles to `TARGET DRIFT`. | Status settles to `PINNED`. |

The thin result should visibly lose the target; the engineered result must keep a
recognizable blueprint/pin attached.

#### 02 · 限定权限 (`contain`)

Use stage 02 endpoints and `harness-stage-02.png`.

| Time | Thin harness | Engineered harness |
| --- | --- | --- |
| 0–240ms | Lock/gate actor descends into the path. | Same synchronized entrance. |
| 360–1000ms | The gate shifts aside; a red signal crosses the boundary and the protected region flashes once. | The first signal reaches the gate and stops. A small authorization token drops into the lock; only one green signal passes while the gate remains in place. |
| 1120–1380ms | Status settles to `BOUNDARY UNKNOWN`. | Status settles to `SCOPED`. |

The viewer must see “unrestricted crossing” versus “explicit stop, authorization,
and limited passage,” without reading the footer.

#### 03 · 接通反馈 (`reproduce`)

Use stage 03 endpoints and `harness-stage-03.png`. For independent plug movement,
render two copies of the real stage 03 PNG in clipped left and right wrappers.

| Time | Thin harness | Engineered harness |
| --- | --- | --- |
| 0–360ms | Plug halves approach but retain a small gap. | Plug halves meet with a 160ms settle. |
| 520–1120ms | An outbound signal travels to the interface and fades outside it. There is no return. | An outbound pulse travels across the connected plugs; a second pulse returns along the same path after 180ms. |
| 1280–1540ms | Status settles to `NO RETURN`. | The system receives the return pulse, briefly pulses, and status settles to `FEEDBACK CLOSED`. |

The two pulses must be distinguishable by direction. A color change alone is not
enough.

#### 04 · 保存进度 (`recover`)

Use stage 03 as the stable before state, stage 04 as the impact state,
`harness-stage-04.png`, and stage 03/04 engineered endpoints for recovery.

| Time | Thin harness | Engineered harness |
| --- | --- | --- |
| 0–180ms | Both lanes receive the same lightning flash and crossfade to their stage 04 impact state. | Same synchronized interruption. |
| 300–880ms | Checkpoint/anchor actor passes through and fades; the cavity stays empty. | Anchor catches below the cavity and emits one checkpoint pulse. |
| 980–1660ms | The thin box stays broken with a missing element. | Crossfade engineered stage 04 back to engineered stage 03; the signal resumes from the checkpoint rather than restarting from the left edge. |
| 1720–1980ms | Status settles to `STATE LOST`. | Status settles to `RESTORED`. |

The interruption must happen at the same time on both sides so the different
recovery behavior is the comparison, not different initial conditions.

#### 05 · 独立验证 (`evaluate`)

Use stage 03 as the stable before state, stage 05 endpoints, and
`harness-stage-05.png`.

| Time | Thin harness | Engineered harness |
| --- | --- | --- |
| 0–360ms | Verifier rings enter from the output side and sweep the box. | Same synchronized scan. |
| 520–1080ms | An outbound signal moves toward the output but stops inside. The shell glows and status reads `LOOKS DONE`. | First test reaches the output and flashes `FAIL` red. |
| 1120–1840ms | Remains stopped with no return path. | A red feedback pulse moves right-to-left; `修正` appears at the system; the box crossfades from engineered 03 toward engineered 05. |
| 1960–2800ms | Remains in its premature success state. | A green retest pulse moves left-to-right and exits the output; `PASS` replaces the repair state. |
| 2860–3140ms | Final status stays `LOOKS DONE`. | Final status settles to `VERIFIED`. |

This last stage is the climax. `FAIL → 修正 → PASS` must work for autoplay and
direct pointer selection. It must not depend on `.is-playing` still being true when
the phase starts.

### Playback and interaction

- Clicking Play immediately runs stage 01; do not wait for the first phase hold
  before showing motion.
- Autoplay advances only after the current stage timeline and reading hold.
- Use these total phase holds:
  - contract: 3000ms
  - contain: 3200ms
  - reproduce: 3400ms
  - recover: 3600ms
  - evaluate: 4300ms
- On the last phase, mark the sequence complete only after the evaluation timeline
  has settled.
- Pointer selection of a stage stops autoplay and reruns that one stage once.
- Pause adds `.is-paused` to the comparison root and applies
  `animation-play-state: paused` to all animated descendants. Clear the advance
  timer. Resume removes the class and schedules the remaining stage time if
  practical; restarting the current stage from beat zero is acceptable only if it
  is labeled Replay rather than Resume.
- Prevent stale timers from advancing after manual selection or replay.
- Keep the current keyboard navigation semantics, but keyboard-initiated stage
  selection must not animate transforms. Set a one-render `data-skip-motion` state
  and show the settled endpoint immediately. Pointer selection and Play animate.
- Keep the existing live narration and update it once per phase. Do not announce
  every decorative beat.

### Reduced motion

Under `@media (prefers-reduced-motion: reduce)`:

- remove translate and scale animation;
- preserve 180ms opacity/color crossfades for state understanding;
- show the same final endpoint and status;
- shorten automatic phase holds to approximately 900ms, or disable autoplay and
  let the user step through settled states;
- hide or freeze traveling signal dots in their destination state;
- do not leave users waiting through the normal 17+ second sequence.

## Repo conventions to follow

- Motion tokens already live locally in both implementation files. Reuse their
  names and exact strong easing curves:

```css
--motion-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--motion-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
```

- Reuse the existing `comparisonFrames` / `comparisonPhases` data as the single
  source for labels, status copy, narration, and sources. Add compact scene metadata
  there if necessary.
- Reuse the current play button, five stage buttons, ArrowLeft/ArrowRight,
  Home/End, `aria-live`, source chips, and responsive breakpoints.
- Continue using `mix-blend-mode: multiply` for the light-background PNG assets,
  matching the current image treatment.
- Keep Vue and standalone in behavioral and visual parity. Neither is a prototype
  of the other.
- No dependencies are required.

## Steps

1. In `src/brain/concepts/pages/harness-engineering.html`, remove the comparison
   filmstrip markup and CSS (`relay-tracks`, `relay-filmstrip`, five per-lane
   `relay-frame` thumbnails) and replace it with the two-canvas kinetic stage
   architecture above.
2. In the standalone script, keep the stage navigation and copy data but replace
   `relayFrames()` with scene metadata/rendering. Add a monotonically increasing
   `comparisonSceneRevision` so every animated stage receives a fresh scene
   insertion. Separate `isPlaying`, `isPaused`, `comparisonCompleted`, and
   `skipMotion` responsibilities.
3. Add stage-specific keyframes and delayed animation assignments for all five
   timelines. Use the existing assets as box layers and stage actors; implement
   signal travel, flashes, and pills as simple HTML/CSS overlays.
4. In `src/content/concepts/harness-engineering/visual.vue`, mirror the same
   architecture, stage data, timing, state model, key names, and motion. Add
   `comparisonSceneRevision` and key the scene so pointer stage selection replays
   it reliably.
5. Remove the unreachable `.is-playing.phase-evaluate` dependency. Evaluation
   animations should be scoped to the phase scene’s insertion/run state.
6. Implement real pause/freeze, pointer replay, no-transform keyboard settled
   state, and the reduced-motion behavior in both files.
7. Preserve the surrounding article, research citations, sources, section order,
   and all unrelated page behavior.
8. Format the Vue file with the repository’s existing formatter and run the
   standalone JavaScript parse check and Vue SFC compile check.

## Boundaries

- Modify only:
  - `src/brain/concepts/pages/harness-engineering.html`
  - `src/content/concepts/harness-engineering/visual.vue`
- Do not modify the research/citation content below the comparison, except to remove
  text duplicated inside the old lane filmstrips.
- Do not resurrect the earlier 12-chapter documentary, evidence ledger, terminal
  dashboard, or dense per-event copy.
- Do not add new images unless an existing asset is technically unusable; report
  that blocker instead of improvising replacement artwork.
- Do not add dependencies.
- Do not use canvas, WebGL, Lottie, GSAP, or JavaScript `requestAnimationFrame`.
- Do not add decorative perpetual motion after a stage settles.
- Do not change other concept pages, indexes, README files, or publishing metadata.
- Preserve all unrelated uncommitted user changes.
- If this structure no longer matches the two files at commit `6fd7428`, stop and
  report drift instead of rewriting unrelated sections.

## Verification

- **Mechanical**
  - Extract the standalone inline script and parse it with `new Function(...)`;
    expected: no syntax error.
  - Run Prettier on
    `src/content/concepts/harness-engineering/visual.vue`; expected: no formatting
    diff after the final pass.
  - Compile the Vue SFC with the blog toolchain’s installed Vue compiler; expected:
    no template or script errors.
- **Desktop feel check — 1280×900**
  - Click each stage individually and inspect at least an early, middle, and final
    frame. Each stage must show at least three distinct visual states.
  - Confirm the large canvases, not stage thumbnails, dominate the section.
  - Confirm stage 01 begins moving immediately after Play.
  - Confirm stages 02–05 visually communicate, respectively: unrestricted versus
    scoped crossing; outbound-only versus return feedback; shared interruption
    followed by loss versus restore; premature success versus fail/repair/pass.
  - Confirm the phase settles before its reading hold ends; no unexplained 3–5
    second blank wait occurs.
  - Pause during signal travel and compare computed transforms twice; they must
    remain unchanged. Resume must continue or deliberately replay according to the
    button label.
  - Replay repeatedly; no stale timer may skip a phase or double-advance.
- **Interaction feel check**
  - Mouse-click a stage: its animation reruns once.
  - Focus a stage and use ArrowLeft/ArrowRight/Home/End: the selected final state
    appears immediately without transform movement, while focus remains visible.
  - Trigger the final stage through autoplay and direct pointer selection:
    `FAIL → 修正 → PASS` must appear in both paths.
- **Responsive feel check**
  - At 390×844, canvases stack, actors are not clipped, status pills remain
    readable, and stage controls remain usable.
  - At 320px width, the document has no horizontal overflow.
- **Reduced-motion feel check**
  - Emulate `prefers-reduced-motion: reduce`. Movement disappears, 180ms
    opacity/color feedback remains, final meanings are preserved, and no long
    static autoplay wait remains.
- **Console**
  - Load the standalone page, run Play, click all stages, and resize between desktop
    and mobile; expected: no errors or warnings caused by the comparison.
- **Done when**
  - A viewer can identify the action and outcome in every stage without reading the
    paragraph below it.
  - There are two large synchronized canvases and no five-thumbnail per-lane
    filmstrip.
  - Every stage contains a visible setup, causal action/feedback, and settled
    result.
  - Standalone and Vue tell the same visual story and pass all checks above.

## Completion

- Implemented in both scoped source files with the existing 16 PNG assets.
- Standalone browser QA passed at 1280×900, 390×844, and 320px.
- All five stages produced three distinct sampled states; full autoplay reached
  `FAIL → 修正 → PASS → VERIFIED` before completion.
- Pause/resume, pointer replay, keyboard settled-state navigation, and explicit
  reduced-motion endpoints passed review.
- Standalone inline JavaScript parsing, Vue SFC compilation, and Vue Prettier check
  passed.
- Final `review-animations` verdict: **Pass / Approve**.
