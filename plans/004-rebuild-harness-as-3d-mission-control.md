# 004 — Rebuild the Harness comparison as a 3D mission

- **Status**: DONE
- **Commit**: 6fd7428
- **Severity**: HIGH
- **Category**: Missed opportunity · explanatory motion / Purpose & cohesion
- **Estimated scope**: 5 files, roughly 1400–2000 handwritten changed lines plus one generated self-contained Three.js runtime
- **Supersedes**: Plan 003 comparison UI and metaphor

## Problem

Plan 003 replaced the filmstrip with two larger kinetic lanes, but the result still
behaves like a collection of decorated cards. The user cannot see what is happening
at each step, and the "system box / checkout repair" metaphor is too narrow to
explain target constraints, least-privilege authorization, integration handshakes,
state recovery, and independent verification as one coherent system.

The standalone page still presents a target card followed by an empty stage that is
filled with two image-heavy lanes:

```html
<!-- src/brain/concepts/pages/harness-engineering.html:2458 — current -->
<div class="relay-stage">
  <div class="relay-target">
    <span>Shared target</span>
    <img
      src="../../../content/concepts/harness-engineering/assets/system-box-target.png"
      alt="共享目标系统盒"
    >
    <strong>修复结账问题，并把真实结果送到可验证输出。</strong>
  </div>
  <div class="kinetic-stage phase-contract" id="kinetic-stage" data-phase="contract"></div>
</div>
```

Every phase destroys and recreates that stage. A WebGL scene cannot be added on top
of this lifecycle:

```js
// src/brain/concepts/pages/harness-engineering.html:2876 — current
if (rerenderScene) {
  kineticStage.className = `kinetic-stage phase-${phaseName}`;
  kineticStage.dataset.phase = phaseName;
  kineticStage.dataset.sceneRevision = String(comparisonSceneRevision);
  kineticStage.dataset.skipMotion = String(comparisonSkipMotion);
  kineticStage.innerHTML = `<div class="kinetic-pair">
    ${kineticLane("thin", frame)}
    ${kineticLane("engineered", frame)}
  </div>`;
  comparisonSkipMotion = false;
}
```

The Vue implementation repeats the same scene-recreation pattern with a changing
key and two long DOM lanes:

```vue
<!-- src/content/concepts/harness-engineering/visual.vue:1603 — current -->
<div
  :key="`${comparisonPhase}-${comparisonSceneRevision}`"
  class="kinetic-stage"
  :class="[
    `phase-${comparisonPhase}`,
    { 'skip-motion': skipComparisonMotion },
  ]"
  :data-phase="comparisonPhase"
  :data-scene-revision="comparisonSceneRevision"
  :data-skip-motion="skipComparisonMotion"
>
  <div class="kinetic-pair">
    <!-- two image-based lanes -->
  </div>
</div>
```

The current implementation also has two independent phase timers, one in the
standalone page and one in Vue. Adding a third requestAnimationFrame clock would
make pause, resume, manual phase selection, reduced motion, and unmount behavior
diverge further.

## Target

Replace the complete Plan 003 comparison stage and its metaphor with one persistent
Three.js scene titled:

> 同一艘飞船，同一个任务。差别只在 Harness。

The scene contains two synchronized mission bays:

- left: `只有模型`, warm orange failure accent;
- right: `模型 + Harness`, blue infrastructure and lime success accent;
- both bays use the exact same neutral spacecraft geometry, material, scale,
  starting pose, movement speed, arm animation, and task;
- the Harness is never a more powerful spacecraft. It is represented only by
  coordinates, authorization gates, protocol adapters, checkpoints, and an
  independent verifier;
- desktop uses one 16:9 canvas with the bays side by side;
- mobile uses the same canvas with the bays stacked vertically. Do not turn the
  comparison into tabs;
- the camera is a fixed, lightly elevated 35-degree mission-table view. There are no
  orbit controls, zoom controls, dashboard panels, log consoles, or cockpit chrome;
- all scene objects are programmatic Three.js primitives. Do not load GLB, textures,
  fonts, SVG, or the existing system-box PNGs;
- the visible DOM contains only the title, the two bay labels, one short result label
  per bay, five stage buttons, Play/Pause, a thin overall progress track, the existing
  evidence/source chips, and the existing aria-live explanation.

The five stage labels are:

```text
01 坐标 · 02 权限 · 03 握手 · 04 恢复 · 05 验收
```

The final conclusion appears only after the complete autoplay sequence:

> Harness 不让飞船更聪明，它让任务可控、可恢复、可验收。

### Runtime architecture

Create one readable scene source and one generated, self-contained runtime:

```text
src/content/concepts/harness-engineering/
  harness-engineering-three.source.js
  harness-engineering-three.runtime.js
```

`harness-engineering-three.source.js` imports `three` only for the build and assigns
one frozen public API to `globalThis.HarnessMission3D`.

`harness-engineering-three.runtime.js` is an IIFE bundle containing
`three@0.184.0` and the controller. It must be a classic script with no import,
network request, or external asset at runtime, so the standalone HTML still works
when opened directly with `file://`. Include a legal banner identifying Three.js
r184 and its MIT license. Do not hand-edit the generated runtime after it is built.

The standalone HTML loads the runtime with a normal deferred local script. Vue loads
the same runtime only inside `onMounted()`:

```js
await import("./harness-engineering-three.runtime.js");
```

Do not statically import Three or the runtime at the top of `visual.vue`. The public
Learn route eagerly discovers concept components, so the 3D code must remain a
lazy-loaded chunk.

The public controller contract is:

```js
globalThis.HarnessMission3D = Object.freeze({
  VERSION: "0.184.0",
  STAGES: [
    { key: "coordinates", duration: 4000 },
    { key: "permission", duration: 4000 },
    { key: "handshake", duration: 4000 },
    { key: "recovery", duration: 4000 },
    { key: "verification", duration: 4600 },
  ],
  create(options) {
    // Returns the controller below.
  },
});

// Controller returned by create()
controller.play({ from: "coordinates" });
controller.pause();
controller.resume();
controller.select(stageKey, { animate: true, autoplay: false, reason: "pointer" });
controller.select(stageKey, { animate: false, autoplay: false, reason: "keyboard" });
controller.reset({ animate: false });
controller.setReducedMotion(boolean);
controller.resize();
controller.getState();
controller.destroy();
```

`create(options)` accepts:

```js
{
  canvas,
  host,
  initialStage: "coordinates",
  reducedMotion: false,
  locale: "zh" | "en",
  onReady(),
  onStateChange({
    stage,
    index,
    playback,       // "idle" | "playing" | "paused" | "complete"
    progress,       // update at a throttled 10Hz maximum
    stageSettled,
    completed,
    reason,
  }),
  onUnsupported(error),
}
```

The controller is the only owner of requestAnimationFrame, stage timing, autoplay,
pause/resume, visibility pause, reduced motion, and the Three scene. Hosts may mirror
the discrete state into DOM/Vue, but must not start their own advance timer.

Use `renderer.setAnimationLoop()`. Stop the loop when the stage is settled and
autoplay is not active. Internally use absolute stage time and a deterministic
`applyStage(stage, elapsed)` function; never integrate physics from the previous
frame. Pause stores elapsed time and resume continues from the same value.

Use a cubic-bezier solver for these exact motion curves:

```js
const easeOut = cubicBezier(0.23, 1, 0.32, 1);
const easeInOut = cubicBezier(0.77, 0, 0.175, 1);
```

DOM control feedback remains under 300ms:

```css
--motion-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--motion-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--motion-fast: 180ms;
--motion-step: 240ms;
```

Do not use `transition: all`, `ease-in`, or `scale(0)`.

### Scene and performance contract

- One WebGL canvas, one renderer, one context, and one Scene.
- The two mission bays are Groups within the same Scene.
- Use shared geometries and materials. Both spacecraft are produced by the same
  factory and share the exact neutral materials.
- Palette: backdrop `#080b13`; neutral craft `#e9edf2`; left accent `#ff6b35`;
  right accent `#647cff`; success `#c9ff64`; danger `#ff4f64`; dim structure
  `#30384b`.
- `PerspectiveCamera` FOV between 36 and 42. The per-stage camera dolly may move by
  no more than 0.45 world units and must settle within 800ms using `easeOut`.
- Use ambient and directional light only. No shadows, bloom, postprocessing,
  environment map, physics engine, particles above 180 points, or perpetual idle
  rotation.
- Pixel ratio is `Math.min(devicePixelRatio, 1.5)`.
- `ResizeObserver` updates renderer size and camera aspect.
- `IntersectionObserver` and `document.visibilitychange` freeze the clock while the
  scene is offscreen or the page is hidden.
- A context loss calls `onUnsupported`, reveals the fallback, and stops the loop.
- `destroy()` cancels the loop, disconnects observers, removes all listeners,
  traverses and disposes geometries and materials, disposes the renderer, and removes
  any controller-owned DOM.

### Five exact 3D timelines

Each stage starts with both bays in the same condition. The right bay may introduce
infrastructure, but may not change the spacecraft's ability.

#### 01 · 坐标

| Time | 只有模型 | 模型 + Harness |
| --- | --- | --- |
| 0–350ms | Reveal three visually similar satellites and the same spacecraft. | Identical reveal. |
| 350–900ms | The target reticle oscillates among all three satellites. | A coordinate frame locks one satellite and draws a thin blue route. |
| 900–2350ms | The craft chooses the nearest plausible satellite and drifts toward it. | The craft follows the route toward the specified interface. |
| 2350–3200ms | It reaches the wrong satellite; the reticle resolves into a red cross. Do not crash it. | It docks at the correct interface; the coordinate frame tightens and emits one lock pulse. |
| 3200–4000ms | Freeze with `目标漂移`. | Freeze with `坐标锁定`. |

#### 02 · 权限

The station has three clearly distinct doors: maintenance, cargo, and a red core
door.

| Time | 只有模型 | 模型 + Harness |
| --- | --- | --- |
| 0–350ms | Camera settles on the same three doors. | Identical setup. |
| 350–900ms | The craft emits a broad wildcard authorization wave. | A small hexagonal capability token travels only to maintenance. |
| 900–2150ms | All three doors open, including the red core. | Only maintenance turns blue and opens; the other two remain visibly locked. |
| 2150–3200ms | The craft crosses the wrong boundary and the core flashes one alarm. | The craft enters one narrow, explicit permitted lane. |
| 3200–4000ms | Freeze with `全门开放`. | Freeze with `仅此一门`. |

#### 03 · 握手

| Time | 只有模型 | 模型 + Harness |
| --- | --- | --- |
| 0–400ms | Both craft approach the same relay interface. | Identical approach. |
| 400–1200ms | The plug approaches while its alignment ring remains mismatched. | An adapter ring rotates into the correct protocol alignment. |
| 1200–2100ms | An amber request pulse leaves the craft, reaches the loose interface, and disappears. | The interface locks and a blue request pulse enters the relay. |
| 2100–3100ms | The plug separates slightly; the connection light remains gray. | A distinct green ACK pulse returns along the same path in the opposite direction. |
| 3100–4000ms | Freeze with `发出，无回音`. | Freeze with `收到确认`. |

The request and ACK must be visibly different moving actors and directions. A color
change without return movement does not satisfy this stage.

#### 04 · 恢复

| Time | 只有模型 | 模型 + Harness |
| --- | --- | --- |
| 0–550ms | Both craft are at the same 70% mission position. | The right bay also leaves a blue checkpoint beacon and a translucent pose ghost. |
| 550–1050ms | One solar-storm plane sweeps through both bays simultaneously; both lose thrust and path lights. | Identical interruption. |
| 1050–1700ms | On restart, the craft snaps back to the origin and its old trail is gone. | The beacon reappears first and the pose ghost shows the previous position and attitude. |
| 1700–2900ms | The craft restarts from the origin. | The craft returns to the ghost, aligns, and continues from the checkpoint. |
| 2900–4000ms | Freeze with `状态归零`. | Freeze with `从断点继续`. |

Do not use a progress bar inside the 3D scene. The physical return to origin versus
return to the pose ghost is the explanation.

#### 05 · 验收

This is the climax and receives 600ms more than the other stages.

| Time | 只有模型 | 模型 + Harness |
| --- | --- | --- |
| 0–550ms | Both mechanical arms insert the same glowing energy core into a station socket. | Identical insertion. |
| 550–1150ms | The craft projects its own green check and stops; the station stays dark. | An independent inspection drone leaves the station and circles the socket. |
| 1150–1750ms | The self-check remains visible while a loose rear latch flashes red. | The drone finds the loose latch and sends a red feedback pulse to the craft. |
| 1750–2500ms | No further action. | The arm presses the latch closed. |
| 2500–3300ms | The station remains dark. | The drone rescans; the station powers on and returns a green ACK. |
| 3300–4600ms | Freeze with `自称完成`. | Freeze with `独立通过`; then reveal the final conclusion. |

The right sequence must visibly be `FAIL → feedback → fix → PASS`, and FAIL/PASS
must come from the separate inspection drone, not from the craft itself.

### Interaction, accessibility, and fallback

- Play starts stage 01 immediately, then autoplays all five stages with no additional
  host timer. On completion, the button becomes Replay.
- Pointer selection stops autoplay and replays that one stage once.
- Arrow keys move between stage buttons. Home/End select first/last. Keyboard
  selection calls `select(..., { animate: false })` and lands on the settled result;
  do not force motion on keyboard navigation.
- Pause freezes the exact 3D time. Resume continues from that exact elapsed time.
- The canvas is `aria-hidden="true"`. The current stage, both outcomes, and one
  sentence of explanation are always available in the existing `aria-live` DOM.
- With `prefers-reduced-motion: reduce`, do not animate the camera, craft, doors,
  pulses, storm, or drone. Do not initialize WebGL automatically; show the static DOM
  fallback for the selected stage. Stage selection still updates text and outcomes.
- The fallback is visible by default and contains five compact paired diagrams made
  from semantic HTML/CSS primitives: satellite target, three doors, request/ACK,
  origin/checkpoint, and self-check/independent-check. It is not an error box and does
  not restore the old system-box metaphor.
- Hide the fallback only after Three has initialized and rendered its first frame.
  Import failure, WebGL2 absence, context loss, CSP failure, or offline failure leaves
  the selected fallback diagram usable.
- The fallback and aria-live copy are bilingual in `visual.vue`; the private
  standalone page remains Chinese-first.
- At 1280px the viewport is 16:9 and at least 620px high. At 390px the two bays stack
  in a 580–620px viewport. At 320px no control, label, canvas, or source chip causes
  horizontal overflow.

## Repo conventions to follow

- Follow the Pattern Atlas visual system already used in
  `src/brain/concepts/pages/optimistic-concurrency.html`: editorial paper shell,
  semantic buttons/nav, visible explanations, `aria-live`, responsive behavior, and
  reduced-motion support.
- Keep the standalone page self-contained at runtime. No CDN, telemetry, remote
  texture, remote font, or build step is allowed when viewing the finished HTML.
- In `visual.vue`, continue using live public tokens including
  `var(--foreground)`, `var(--muted-foreground)`, `var(--card)`, and
  `var(--line-card)`. Do not introduce retired `--color-text*` tokens.
- Retain the existing official OpenAI, Anthropic, and Model Context Protocol source
  registry and source chips. Rewrite only the five stage labels/narration/outcomes
  so the sources still support the nearby claim; never invent a citation.
- The controller must be identical for standalone and Vue. Hosts differ only in
  localization, DOM state binding, and theme tokens.
- Update `tiles/pattern-atlas/scripts/publish-to-blog.mjs` to copy the optional
  `harness-engineering-three.runtime.js` beside the published concept component, so
  the lazy relative import remains valid. Generalize this as an optional
  `<slug>-three.runtime.js` mapping rather than hard-coding one concept in the
  publisher.

## Steps

1. In `src/content/concepts/harness-engineering/harness-engineering-three.source.js`,
   build the shared scene/controller described above. Create all primitives once,
   keep one persistent Scene, implement deterministic absolute timelines for all five
   stages, and expose exactly the documented global API.
2. Build
   `src/content/concepts/harness-engineering/harness-engineering-three.runtime.js`
   from that source with `three@0.184.0`, IIFE format, browser target ES2020,
   minification, inline legal comments, and a Three.js r184 MIT banner. Record the
   reproducible build command in the source file header. Confirm the runtime contains
   no `import`, `fetch`, remote URL, image URL, or source-map path.
3. In `src/brain/concepts/pages/harness-engineering.html`, remove Plan 002/003 dead
   comparison CSS at approximately lines 569–1968 and their old responsive/reduced
   rules. Keep the comparison outer shell, controls, five-step nav, inspector,
   sources, and clarification. Replace the target card and kinetic lanes with the
   single persistent mission viewport, canvas, two DOM lane labels, result overlays,
   progress track, and default-visible fallback. Load the local runtime as a classic
   script. Replace host phase timers and scene injection with thin controller calls
   and state mirroring. Destroy the controller on `pagehide`.
4. In `src/content/concepts/harness-engineering/visual.vue`, remove `relayAssets`,
   KineticLane/layer types, old scene revision/skip-motion/timer state, the entire
   target/fork/two-lane template, old kinetic CSS/keyframes, and their responsive and
   reduced-motion branches. Add the same persistent viewport and fallback. Lazy-load
   the local runtime in `onMounted()`, guard against late async resolution after
   unmount, mirror `onStateChange` into Vue, forward reduced-motion changes, and call
   `destroy()` in `onBeforeUnmount()`. Preserve bilingual captions, sources,
   clarification, and public theme tokens.
5. Rewrite the five local phase data objects in both hosts to keys
   `coordinates`, `permission`, `handshake`, `recovery`, and `verification`, with the
   exact minimal labels and outcome pairs from this plan. Remove obsolete filmstrip,
   checkout, target-card, evaluator-status, and PNG copy fields that the new template
   no longer reads.
6. In `tiles/pattern-atlas/scripts/publish-to-blog.mjs`, when a package contains
   `<slug>-three.runtime.js`, add a mapping to
   `components/learn/concepts/<slug>-three.runtime.js`. Preserve dry-run/check
   behavior and do not copy source-only `.source.js` files.
7. Validate the implementation mechanically and in the browser. Do not mark this
   plan DONE until an independent animation review returns APPROVE with no blocker or
   warning findings.

## Boundaries

- Do not touch the hero, research documentary, lab, conclusion, private Markdown,
  indexes, social assets, or any unrelated dirty worktree files.
- Do not install dependencies into this repository or commit `node_modules`,
  `package.json`, or a lockfile. Use a temporary build directory for
  `three@0.184.0`; only the source and generated runtime belong in the repository.
- Do not use a CDN in the finished implementation.
- Do not add GLB, textures, images, SVG, external fonts, OrbitControls, a physics
  engine, shader libraries, postprocessing, or a second WebGL canvas.
- Do not layer the 3D canvas over the old kinetic lanes. Delete the superseded target
  card, system-box stage UI, Plan 003 keyframes, and host phase timers.
- Do not change the spacecraft geometry/material/scale between the two bays.
- Do not make the no-Harness side incompetent or catastrophic. Its failures should
  be plausible: wrong target, excessive access, no ACK, lost state, and premature
  self-approval.
- Do not commit, push, publish, or deploy.
- If the current source no longer matches the cited structures at commit `6fd7428`,
  stop and report drift instead of improvising around it.

## Verification

- **Mechanical**
  - Run `git diff --check` with no whitespace errors.
  - Confirm the generated runtime has no runtime dependency:
    `rg -n "https?://|fetch\\(|from ['\\\"]three|import\\(" src/content/concepts/harness-engineering/harness-engineering-three.runtime.js`
    must return no functional match other than the legal banner if it includes a URL.
  - Extract every classic inline script from the standalone HTML and compile each
    with `new Function(...)`; expected: no syntax error.
  - Run the repository's existing Vue formatter and SFC parser/compiler against
    `visual.vue`; expected: no parse or compile error.
  - Run
    `node tiles/pattern-atlas/scripts/publish-to-blog.mjs --slug harness-engineering --dry-run`;
    expected: both `visual.vue` and the runtime appear in the mapping and no file is
    written.
  - Check the controller state after 20 complete replay cycles; renderer object
    counts and scene child count must remain stable.
- **Standalone delivery**
  - Open the exact finished HTML through both a local HTTP server and
    `file:///Users/aaronguo/Work/ag/aaron-studio/src/brain/concepts/pages/harness-engineering.html`.
    Both must render the first 3D frame without a network request or console error.
  - Block WebGL2 or force `webglcontextlost`; the selected DOM fallback remains
    visible and the controls/caption continue to work.
- **Feel check**
  - At 1280×900, capture setup, causal-action, and settled frames for every stage.
    Each of the 15 frames must be distinguishable without reading the caption.
  - In every setup frame, visually compare both spacecraft: geometry, scale, material,
    starting pose, and speed are identical.
  - `坐标`: left arrives at a plausible but wrong satellite without crashing; right
    visibly follows a locked path.
  - `权限`: left visibly opens all three doors including the red core; right opens
    only the token-authorized door.
  - `握手`: right shows an outbound request and a separately moving reverse ACK; left
    shows no return actor.
  - `恢复`: the storm hits both bays on the same frame; left returns to origin while
    right restores to the translucent checkpoint pose.
  - `验收`: right visibly performs FAIL, feedback, physical latch repair, rescan, and
    PASS from the independent drone; left's self-check remains contradicted by the
    dark station and loose latch.
  - Pause twice at different points in one stage and wait at least one second each
    time. Object transforms and stage elapsed time must remain unchanged. Resume must
    not jump or restart.
  - Pointer-select every stage; each replays once and stops. Use keyboard arrows and
    Home/End; each keyboard selection lands in the settled state without movement.
  - Enable `prefers-reduced-motion: reduce`; no WebGL flight/camera motion starts, but
    all five static comparisons, labels, captions, sources, and controls remain
    understandable.
  - Test 390×844 and 320×720: bays are stacked, spacecraft remain legible, labels do
    not collide, and `document.documentElement.scrollWidth === window.innerWidth`.
  - In Vue, check light and dark themes. Section title uses `--foreground`, supporting
    text uses `--muted-foreground`, cards use `--card`/`--secondary`, and the 3D
    backdrop remains deliberately invariant and readable.
- **Done when**
  - A first-time viewer can identify all five causal differences from the 3D motion
    before reading the caption.
  - The standalone page works from `file://` with zero network requests.
  - Standalone and Vue use the same bundled scene controller and show the same stage,
    pause, replay, fallback, reduced-motion, and mobile behavior.
  - Independent `review-animations` review returns APPROVE with zero blockers and
    zero warnings.
