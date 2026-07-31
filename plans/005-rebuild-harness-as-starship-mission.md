# 005 — Turn the Harness comparison into one Starship-class mission

- **Status**: DONE
- **Commit**: 6fd7428
- **Severity**: HIGH
- **Category**: Missed opportunity · explanatory motion / Purpose & cohesion
- **Estimated scope**: 4 files, roughly 1800–2600 handwritten changed lines plus one regenerated self-contained Three.js runtime
- **Supersedes**: Plan 004 scene metaphor and five isolated stage dioramas

## Problem

Plan 004 proved that a 3D comparison is more engaging than the earlier card-based
animation, but the generic spacecraft and mission-table props still require the
caption to explain what is happening. The five stages use five independent bay
factories:

```js
// src/content/concepts/harness-engineering/harness-engineering-three.source.js:1297 — current
const stages = {
  coordinates: makeStage(makeCoordinateBay),
  permission: makeStage(makePermissionBay),
  handshake: makeStage(makeHandshakeBay),
  recovery: makeStage(makeRecoveryBay),
  verification: makeStage(makeVerificationBay),
};
Object.values(stages).forEach((stage) => value.add(stage.root));
```

Each stage therefore introduces a new pair of spacecraft and a new miniature world.
Even though the controller autoplays them in order, the viewer experiences five
demonstrations rather than one mission whose consequences accumulate.

The current recovery scene is especially difficult to carry into a recognizable
launch metaphor. It physically hides and reconstructs the right spacecraft at a
checkpoint:

```js
// src/content/concepts/harness-engineering/harness-engineering-three.source.js:1600 — current
if (time >= 1230) {
  const ghostReveal = range(time, 1230, 1430, easeOut);
  bay.ghost.root.visible = true;
  setGhostOpacity(bay.ghost, ghostReveal);
}
if (time >= 1050 && time < 1700) bay.craft.root.visible = false;
if (time >= 1700) {
  bay.craft.root.visible = true;
  const restore = range(time, 1700, 2200, easeOut);
  bay.craft.root.scale.setScalar(0.9 * lerp(0.95, 1, restore));
  bay.craft.root.position.set(
    0.65,
    lerp(0.42, 0, restore),
    lerp(-0.25, 0.15, restore),
  );
}
```

That is an acceptable software checkpoint abstraction, but it becomes misleading
when the vehicle is recognizably rocket-like: physical rockets cannot roll back and
resume from a saved pose. For a Starship-class mission, recovery must mean preserving
mission state, rejecting a stale plan, entering a safe contingency, and carrying
evidence into the next run.

The public copy also describes five generic, separate comparisons:

```ts
// src/content/concepts/harness-engineering/visual.vue:700 — current
const MISSION_COPY: Record<Locale, MissionCopy> = {
  en: {
    accessibleHeading: "Same spacecraft, two mission systems",
    eyebrow: "01 · Same capability, different control",
    heading:
      "Same spacecraft. Same mission. The only difference is the Harness.",
    description:
      "Five mission stages reveal what changes when coordinates, authority, feedback, recovery, and verification surround the same capable model.",
```

The resulting motion is technically correct but visually under-specified. The
highest-leverage fix is not to replace the craft mesh with a more famous rocket. It
is to replace the five dioramas with one continuous, recognizable launch story.

## Target

Replace the generic five-diorama comparison with a single continuous
Starship-inspired mission titled:

> 如果 AI 来执行一场星舰级任务

The mental model is:

> 同一枚飞船、同一组发动机、同一个任务。差别只在任务控制 Harness。

The mission contract is:

> 将载荷送入指定轨道，并在回收条件不满足时进入安全预案，留下可独立验收的证据。

This is an educational analogy, not a claim about SpaceX's internal software. Show
this disclosure beneath the scene in both hosts:

> 概念演示：借用公开的 Starship 试飞与航天任务控制作为隐喻，并非 SpaceX 实际软件架构或产品复刻。

English:

> Conceptual demonstration inspired by public Starship flight-test and mission-control practices; not a reconstruction of SpaceX's internal software.

Use an original silver reusable heavy-lift vehicle silhouette. Do not use the
SpaceX wordmark, logo, official mission badges, official footage, copied geometry,
textures, or branded launch graphics. `Starship` may appear in the explanatory
title, disclosure, and source labels because the page is explicitly discussing the
public example.

### Continuous scene architecture

Preserve the existing public controller API and stage keys:

```js
globalThis.HarnessMission3D = Object.freeze({
  VERSION: "0.184.0",
  STAGES,
  create(options) {},
});
```

Keep these keys so the standalone and Vue hosts do not need a new controller
contract:

```text
coordinates · permission · handshake · recovery · verification
```

Change their durations to:

```js
const STAGES = Object.freeze([
  { key: "coordinates", duration: 7200 },
  { key: "permission", duration: 7200 },
  { key: "handshake", duration: 7600 },
  { key: "recovery", duration: 8400 },
  { key: "verification", duration: 8600 },
]);
```

Total autoplay duration is 39 seconds. The duration is justified because this is a
rare explanatory animation, not repeated UI feedback. Each stage includes a
1.0–1.6 second settled hold so the causal result can be read before the next camera
move.

Replace the five stage-specific spacecraft pairs with one persistent mission pair:

```js
const mission = makeMissionPair();
scene.add(mission.root);
return { scene, mission, stars };
```

`makeMissionPair()` creates two Groups:

- left: `只有模型 / Model only`;
- right: `模型 + Harness / Model + Harness`;
- both receive spacecraft from the same `makeReusableHeavyVehicle()` factory;
- both spacecraft share identical geometry, neutral materials, dimensions, engine
  count abstraction, flap layout, initial transforms, and movement curves;
- Harness differences are represented only by mission definitions, scoped command
  tokens, return acknowledgements, telemetry state, contingency routes, and
  external evaluators;
- the same spacecraft objects persist across all five stages. Do not instantiate
  another craft when the stage changes.

Autoplay must also satisfy this continuity invariant:

```text
stage[n].settledPose === stage[n + 1].initialPose
```

That equality applies to spacecraft position, orientation, separated/attached state,
mission-route state, and the causal result already established. If story time must
be compressed between locations, communicate it with an authored camera move and a
retained trajectory trail. Never teleport a vehicle between adjacent autoplay
stages. Only direct stage selection may deterministically reposition the persistent
objects, and that reposition must finish before the selected stage's first rendered
frame.

Create all props once:

- one reusable heavy-lift stack per bay, made from a booster cylinder, upper-stage
  cylinder/cone, four restrained flap primitives, a dark thermal strip, engine-light
  circles, and one detachable interstage ring;
- an Earth arc, target orbit rings, launch corridor, return corridor, and offshore
  contingency zone;
- one original launch/catch tower per bay with clamp arms and three abstract control
  nodes: propellant, ignition, and payload;
- request, acknowledgement, `GO`, `NO-GO`, and scoped-command actors with distinct
  shapes and directions;
- telemetry trails and a retained mission-state packet;
- two small external camera-satellite observers and one ground-radar sweep;
- one next-flight simulation ghost used only after the physical mission has ended.

The camera remains fixed-control with no orbit/zoom UI. It may move between five
authored views:

1. orbital mission brief;
2. launch-pad close view;
3. high-altitude hot-staging view;
4. booster return and tower/offshore view;
5. wide evidence and mission-review view.

Camera movement within a stage uses:

```js
const easeOut = cubicBezier(0.23, 1, 0.32, 1);
const easeInOut = cubicBezier(0.77, 0, 0.175, 1);
```

The camera settles within the first 800ms. There is one `PerspectiveCamera`, one
Scene, one renderer, and one canvas. Desktop stays side by side; widths at or below
680px stack the bays along the camera's screen-up plane so both vehicles remain at
equal depth and apparent scale.

### Five exact mission timelines

The two lanes always share the same vehicle capability, initial condition, anomaly,
and camera. Only the mission Harness differs.

#### 01 · 目标 / 飞行走廊

Visible result labels:

```text
只有模型：目标模糊
模型 + Harness：目标可判定
```

Narration:

> 一句“把载荷送上去”可以产生合理路线；任务契约把轨道、时间窗、载荷与安全边界变成可判定目标。

| Time | 只有模型 | 模型 + Harness |
| --- | --- | --- |
| 0–800ms | Reveal the same silver launch stack and Earth arc. Camera settles into the mission-brief view. | Identical reveal. |
| 800–1800ms | One broad mission token appears: payload → space. | The same broad token appears. |
| 1800–4200ms | A dotted amber route immediately selects one plausible neighboring orbit band. | Target orbit, launch window, payload, and return-zone markers lock one at a time with 60ms visual stagger; only then does a blue corridor draw. |
| 4200–6000ms | Route ends in the wrong band but remains physically plausible. No crash or joke failure. | Route closes through the specified orbit and the safe return zone. |
| 6000–7200ms | Freeze with `目标模糊`. | Freeze with `目标可判定`. |

The planning view is a mission preview. The physical rocket has not launched yet, so
stage 02 may naturally move to the pad without implying that time reversed.
The two plans become durable mission state: the left lane's plausible neighboring
orbit and the right lane's specified corridor must be inherited by the actual
ascent, upper-stage trajectory, and final evidence review. They are not decorative
preview lines that disappear after stage 01.

#### 02 · 权限 / 分阶段授权

Visible result labels:

```text
只有模型：权限过宽
模型 + Harness：权限有边界
```

Narration:

> 能点火不等于能同时操作所有系统；Harness 只授权当前阶段、当前对象和当前时间窗。

| Time | 只有模型 | 模型 + Harness |
| --- | --- | --- |
| 0–800ms | Camera settles at the same pad and tower. | Identical setup. |
| 800–1600ms | The same launch instruction arrives. | The same instruction arrives. |
| 1600–3600ms | One wildcard wave unlocks propellant, ignition, clamps, and payload door together. The payload door opens early and the stack rocks slightly, but does not explode. | Three capability tokens run in sequence: `FUEL ONLY → IGNITION ONLY → CLAMPS ONLY`. Each token visibly expires as its window closes. The payload control is never inside any token's scope. Separate differently shaped `READY/GO` actors report state; they are not authorization tokens. |
| 3600–6000ms | The rocket leaves the pad with the early-open payload door still visible as unresolved risk. | Engine lights stabilize, then clamps release and the identical rocket leaves vertically. |
| 6000–7200ms | Freeze with `权限过宽`. | Freeze with `权限有边界`. |

The `GO` poll and staged authorization are a teaching abstraction. Do not imply that
the animation reproduces SpaceX's network permission architecture.

#### 03 · 握手 / 热分级

Visible result labels:

```text
只有模型：默认已执行
模型 + Harness：工具会回话
```

Narration:

> 命令发出去只完成了一半；点火状态、分离确认与下一阶段必须沿协议返回执行循环。

| Time | 只有模型 | 模型 + Harness |
| --- | --- | --- |
| 0–900ms | Both stacks ascend at the same speed and attitude. | Identical ascent. |
| 900–2200ms | An outbound separation command travels from the controller to the interstage. | The same outbound command travels. |
| 2200–3800ms | The command is physically executed, but no return actor appears. The controller assumes success too early and emits one repeated command. | The request reaches the interstage; upper-stage engines reach a confirmable state; a distinct `ENGINE READY` pulse returns. Only then does physical separation begin. |
| 3800–6100ms | Booster cutoff and upper-stage ignition are slightly out of sequence; the repeated command contributes to a restrained off-axis separation that remains recoverable. | The ring releases; a second, separately shaped `SEPARATED` acknowledgement returns; then the booster flips. The order must remain request → engine ready → `ENGINE READY` → separation → `SEPARATED` → flip. |
| 6100–7600ms | Freeze with `默认已执行`. | Freeze with `工具会回话`. |

Request and acknowledgement must be different moving actors with opposite
directions. A color swap without reverse movement does not satisfy this stage.

#### 04 · 恢复 / NO-GO → DIVERT

Visible result labels:

```text
只有模型：继续旧计划
模型 + Harness：失败可收敛
```

Narration:

> 恢复不是让物理世界回滚；它是保留当前状态、拒绝过期计划，并进入预先定义的安全路径。

| Time | 只有模型 | 模型 + Harness |
| --- | --- | --- |
| 0–1200ms | The same booster approaches an identical catch tower on the same return path. | Identical approach. |
| 1200–2500ms | The same tower-health actor turns red in both lanes. | Identical anomaly. |
| 2500–4300ms | The controller still shows a stale green tower state and continues the old catch trajectory. | A red `NO-GO` pulse returns, the current mission-state packet remains visible, and a blue contingency corridor opens toward the offshore zone. |
| 4300–6800ms | The booster reaches the closed catch envelope too late, misses the arms, and performs a rough emergency water landing outside the planned marker. Do not explode it. | The booster follows the pre-authorized divert, performs a controlled landing burn, and reaches the marked offshore zone. |
| 6800–8400ms | Freeze with `继续旧计划`; its telemetry trail ends ambiguously. | Freeze with `失败可收敛`; the retained state packet and complete trail remain visible. |

This stage is inspired by the public Flight 6 account in which automated health
checks stopped a catch attempt and a pre-planned divert was executed. It must never
show a destroyed rocket reassembling, teleporting, or resuming from a physical
checkpoint.

#### 05 · 验收 / 外部证据

Visible result labels:

```text
只有模型：自报成功
模型 + Harness：完成有证据
```

Narration:

> Harness 不保证每次任务完美；它让轨迹、载荷、改道和异常由独立观察者形成可复查证据。

| Time | 只有模型 | 模型 + Harness |
| --- | --- | --- |
| 0–1000ms | The vehicle emits its own green `DONE` check. | The same internal check appears but is not accepted as final evidence. |
| 1000–3200ms | No external observer connects. The inherited neighboring-orbit result and ambiguous landing stay dim behind the self-check. | Two camera satellites, representing the public camera-satellite concept at a readable scale, make one clear inspection pass; after they leave the focal area, a ground-radar sweep checks the inherited trajectory and offshore landing zone. Do not animate a complete orbit. |
| 3200–5100ms | Self-check remains bright even though observable rows are missing. | Evidence resolves one row at a time: `ORBIT PASS`, `PAYLOAD PASS`, `CATCH NO-GO`, `DIVERT PASS`. The overall result is `SAFE · VERIFIED`, not a dishonest all-green mission. |
| 5100–6900ms | No new action. | The evidence packet moves into a small next-flight simulation ghost, where the failed catch condition is reproduced. This is a feedback loop for the next run, not a physical rewind. |
| 6900–8600ms | Freeze with `自报成功`. | Freeze with `完成有证据`, then reveal the final conclusion. |

Final conclusion:

> 好的 Harness 不保证飞船一定成功。它让错误被看见、权限被限制、失败可收敛、结果有证据。

Then show the shorter memory line:

> 同一枚飞船。差别不是能力，而是任务系统。

### Interaction and UI

- Keep the existing five semantic stage buttons, Play/Pause/Resume/Replay, progress
  track, source chips, clarification, `aria-live`, and controller-owned clock.
- Change visible stage labels to:

```text
01 目标 · 02 权限 · 03 握手 · 04 恢复 · 05 验收
```

- The viewport contains only the canvas, the two bay labels, one short result label
  per bay, and the fallback. Do not add a countdown console, telemetry dashboard,
  cockpit UI, code log, explanatory paragraph, or paragraph-sized text over the
  canvas.
- During autoplay, stage transitions remain part of the controller timeline.
  Hosts must not create their own timers.
- Pointer stage selection plays the selected stage once and stops at its settled
  result.
- Arrow/Home/End keyboard selection lands immediately on the settled state with no
  camera or vehicle movement.
- Pause freezes the exact stage time and all transforms. Resume continues from the
  same absolute time without a jump.
- The canvas remains `aria-hidden="true"`. One atomic live region states the current
  stage, both outcomes, and the one-sentence narration.
- At completion, the DOM conclusion appears outside the canvas. It is not rendered
  as a 3D text mesh.

### Responsive, reduced-motion, and fallback

- At 1280px, use side-by-side bays and keep each rocket at least 150 CSS pixels tall
  in the pad and staging shots.
- At widths `<= 680px`, stack the bays vertically inside the same canvas. Both
  vehicles must remain at equal camera depth and apparent scale.
- Target viewport height: 620–680px desktop and 600–640px mobile. At 320px no label,
  source chip, button, or canvas may create horizontal overflow.
- With `prefers-reduced-motion: reduce`, do not initialize WebGL automatically.
  Do not initialize WebGL after the user presses a control either. Disable Play,
  label it `静态浏览 / Static view`, and let the five stage buttons switch only the
  static semantic fallback.
- Rewrite the fallback diagrams around the same five rocket events:
  1. vague route vs locked corridor;
  2. wildcard controls vs staged tokens;
  3. one-way command vs request/ACK;
  4. stale catch route vs `NO-GO → DIVERT`;
  5. self-check vs external radar/camera evidence.
- Do not use movement in reduced motion. Opacity/color feedback may use at most a
  200ms transition.
- Runtime import failure, WebGL2 absence, context loss, CSP failure, or `file://`
  delivery must leave the fallback and controls understandable.

### Evidence and source chips

Retain the OpenAI and Anthropic Harness sources already present. Add these official
analogy sources to the source registries in both hosts:

```text
SpaceX · Starship Flight 13
https://www.spacex.com/launches/starship-flight-13

SpaceX · Starship Flight 6
https://www.spacex.com/launches/starship-flight-6

SpaceX · Starship Flight 5
https://www.spacex.com/launches/starship-flight-5

NASA · Spaceflight Operations / Mission Control
https://www.nasa.gov/reference/jsc-spaceflight-operations/

FAA · Starship licensing and permitting
https://www.faa.gov/space/stakeholder_engagement/spacex_starship/license_review_process
```

Use the sources only for claims they support:

- Flight 13: the official page's planned objectives and published timeline,
  including staged `GO` checks, hot-staging, in-space relight, payload deployment,
  camera satellites, and controlled return. Describe the animation's two camera
  satellites as an abstraction of the six V3 satellites identified publicly as
  carrying camera suites; never present a planned objective as a completed result;
- Flight 6: automated health checks, catch abort, and pre-planned divert;
- Flight 5: the catch depended on thousands of vehicle and pad criteria;
- NASA Mission Control: mission planning, trajectory, standardized interfaces,
  communications, data storage, security, redundancy, contingency, and recovery;
- FAA: public-safety review and external launch authorization.

Never describe these sources as documentation of an AI Harness or as evidence of
SpaceX's internal software architecture.

## Repo conventions to follow

- Preserve the Pattern Atlas editorial paper shell, semantic headings, thin
  technical lines, local deterministic JavaScript, and source chips.
- Standalone private HTML may keep its owned palette.
- Public `visual.vue` must use live tokens:

```css
--visual-ink: var(--foreground);
--visual-muted: var(--muted-foreground);
--visual-surface: var(--card);
--visual-soft: var(--secondary);
--visual-border: var(--line-card);
```

- Do not introduce retired `--color-text*` tokens.
- Keep control feedback under 300ms:

```css
--motion-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--motion-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--motion-fast: 180ms;
--motion-step: 240ms;
```

- Do not use `transition: all`, `ease-in`, or `scale(0)`.
- The explanatory 3D mission may run for 39 seconds, but buttons, selection,
  focus, hover, and result-label changes remain under 300ms.
- Preserve the existing self-contained Three.js r184 build method and legal banner.
- `tiles/pattern-atlas/scripts/publish-to-blog.mjs` already copies an optional
  `<slug>-three.runtime.js`; do not change it unless its current behavior fails the
  dry run.

## Steps

1. In
   `src/content/concepts/harness-engineering/harness-engineering-three.source.js`,
   replace the five independent `makeStage(make*Bay)` pairs with one persistent
   `makeMissionPair()` and shared Starship-inspired vehicle factory. Create all
   geometry/materials once. Keep one Scene, camera, renderer, and canvas.
2. Implement the five deterministic timelines exactly as specified. Preserve the
   controller API, absolute active-time clock, pause/resume behavior, visibility
   freeze, settled manual stages, keyboard no-motion selection, resize observers,
   context-loss handling, and disposal.
3. Ensure the same vehicle objects survive stage transitions. Autoplay must not
   remove/recreate the spacecraft or flash the scene background between stages.
   Enforce `stage[n].settledPose === stage[n + 1].initialPose` across autoplay.
   Stage selection may deterministically reposition the persistent objects only
   before its first rendered frame.
4. Update the stage durations, settle thresholds, authored camera poses, and mobile
   screen-up layout. Keep the camera depth equal between bays.
5. Regenerate
   `src/content/concepts/harness-engineering/harness-engineering-three.runtime.js`
   from the readable source using the reproducible build command already documented
   at the source-file header. Do not hand-edit the generated runtime.
6. In `src/brain/concepts/pages/harness-engineering.html`, update only the 3D
   comparison section's heading, five labels/outcomes/narration, analogy source
   registry, disclosure, atomic live copy, and fallback diagrams/CSS. Preserve the
   rest of the Harness Engineering page.
7. In `src/content/concepts/harness-engineering/visual.vue`, mirror the same
   bilingual copy, source registry, disclosure, stage labels, final conclusion,
   fallback diagrams, and responsive behavior. Continue to lazy-load the local
   runtime only in `onMounted()`.
8. Validate source/runtime/hosts mechanically and in the browser. Do not mark this
   plan DONE until an independent `review-animations` reviewer returns APPROVE with
   no blocker or warning findings.

## Boundaries

- Do not touch the page hero, research sections, layer lab, concept-neighbor cards,
  private Markdown, catalog indexes, social assets, or unrelated dirty worktree
  files.
- Do not change the public controller method names, state object shape, stage keys,
  or runtime path.
- Do not install dependencies into this repository or add `node_modules`,
  `package.json`, or a lockfile. Use a temporary build directory.
- Do not load a CDN, GLB, texture, external font, video, SVG, official SpaceX asset,
  or second WebGL canvas.
- Do not use SpaceX logos, marks, mission patches, official footage, or imply
  endorsement.
- Do not represent the public Starship flight sequence as SpaceX's AI Harness
  architecture. The analogy disclosure is mandatory.
- Do not show an explosion, destroyed vehicle rebuilding, physical rollback,
  teleporting checkpoint recovery, or a magical same-flight retry.
- Do not make the Harness vehicle more powerful, faster, larger, more stable, or
  better equipped than the no-Harness vehicle.
- Do not make the Harness side artificially perfect. A correct `NO-GO`, safe divert,
  `PARTIAL`, or evidence-backed failure is a valid success state.
- Do not commit, push, publish, or deploy.
- If the current source no longer matches commit `6fd7428` and the Plan 004
  structures quoted above, stop and report drift instead of improvising.

## Verification

- **Mechanical**
  - Run `node --check` on the readable Three source, generated runtime, and publisher.
  - Extract every classic inline script from the standalone HTML and compile with
    `new Function(...)`.
  - Compile `visual.vue` script, template, and style with the blog repository's
    existing Vue Single-File Component compiler.
  - Run the existing formatter in check mode against `visual.vue`.
  - Run `git diff --check` or an equivalent no-index whitespace check on all touched
    files.
  - Confirm the runtime contains no network/runtime dependency:

```sh
rg -n "https?://|fetch\\(|from ['\\\"]three|import\\(|sourceMappingURL" \
  src/content/concepts/harness-engineering/harness-engineering-three.runtime.js
```

  - Run:

```sh
node tiles/pattern-atlas/scripts/publish-to-blog.mjs \
  --slug harness-engineering --dry-run
```

    Expected: `visual.vue` and
    `harness-engineering-three.runtime.js` appear; no file is written.
  - Replay the complete mission 20 times and compare renderer memory counts and
    Scene child count after every cycle. They must remain stable.

- **Standalone delivery**
  - Open the finished HTML through a local HTTP server and directly through
    `file:///Users/aaronguo/Work/ag/aaron-studio/src/brain/concepts/pages/harness-engineering.html`.
  - Both paths must initialize or show the usable fallback with zero runtime network
    requests and zero page errors.
  - Force WebGL failure/context loss; selected fallback, controls, caption, sources,
    and disclosure remain usable.

- **Timeline feel check**
  - Run the complete 39-second mission without touching controls. The same two
    spacecraft persist visually from mission brief through evidence review; no stage
    flashes to empty or silently swaps craft geometry.
  - At every autoplay boundary, compare the last frame of stage `n` with the first
    frame of stage `n + 1`. Vehicle pose, separated/attached state, route, and prior
    causal result must match. Camera movement may begin, but no vehicle may teleport.
  - Capture setup, causal-action, and settled frames for all five stages.
  - `目标`: wrong plausible route versus exact corridor is identifiable before
    reading the caption.
  - `权限`: left visibly unlocks multiple systems together; right visibly sequences
    propellant → ignition → clamps while payload remains locked.
  - `握手`: right follows request → engine ready → `ENGINE READY` → separation →
    `SEPARATED` → booster flip. Left executes the command without a return actor and
    repeats once.
  - `恢复`: both towers receive the same red health anomaly; left continues the stale
    catch path; right visibly receives `NO-GO`, switches to the offshore corridor,
    and lands in the marked zone. No craft vanishes, reconstructs, or rolls back.
  - `验收`: one camera-satellite inspection pass completes before the radar sweep.
    External observers remain visually separate from the vehicle. Right verifies
    orbit, payload, catch `NO-GO`, and divert; left's self-check remains contradicted
    by missing external evidence.
  - Pause twice in stages 03 and 04 for at least one second. Stage time, request/ACK
    actors, vehicles, camera, and progress remain unchanged. Resume does not jump.
  - Insert a 400ms main-thread stall; the absolute timeline catches up to wall time
    instead of permanently slowing.
  - Pointer-select every stage; each plays once and stops at settle. Arrow/Home/End
    selection lands instantly on the settled result.

- **Responsive and accessibility**
  - At 1280×900, both bays remain legible and each launch stack is at least 150 CSS
    pixels tall in pad/staging views.
  - At 390×844 and 320×720, bays are stacked, vehicle scale is equal, labels do not
    collide, and `document.documentElement.scrollWidth === window.innerWidth`.
  - With `prefers-reduced-motion: reduce`, WebGL motion does not start; all five
    static comparisons, outcomes, narration, sources, and disclosure remain clear.
  - The atomic `aria-live` text contains stage, left outcome, right outcome, and the
    causal sentence after every selection.
  - In Vue, verify light/dark theme computed colors for one heading, one description,
    one card, and the disclosure at desktop and 360px.

- **Done when**
  - A first-time viewer can explain the five differences as one mission without
    reading a paragraph over the canvas.
  - The Starship reference improves recognition without implying SpaceX endorsement
    or internal architectural knowledge.
  - Recovery is visibly safe-state preservation and contingency, never physical
    rollback.
  - Standalone and Vue use the same generated runtime and present the same story,
    controls, mobile layout, reduced-motion fallback, and evidence disclosure.
  - Independent `review-animations` review returns APPROVE with zero blockers and
    zero warnings.
