# 001 — Animate the no-harness vs harness output comparison

- **Status**: DONE
- **Commit**: 6fd7428
- **Severity**: HIGH
- **Category**: Missed opportunity · explanatory motion
- **Estimated scope**: 2 source files, approximately 450–650 changed lines

## Problem

The current Harness Engineering explainer asks readers to assemble layers and then
advance one shared timeline. It explains the components accurately, but it makes the
reader infer the most important contrast: **what materially changes in the output
when the same model has no harness versus a complete harness**.

The private explainer renders only one timeline and one output at a time:

```html
<!-- src/brain/concepts/pages/harness-engineering.html:819 — current -->
<div class="timeline" id="timeline" role="list" aria-label="任务运行事件"></div>

<div class="event" id="event" aria-live="polite">
  <div><p class="mono-label">Run status</p><strong id="run-status">等待运行</strong></div>
  <div class="event-copy" id="event-copy">
    <span>MODEL → HARNESS → ENVIRONMENT</span>
    <p>点击“开始运行”，逐步观察每个 Harness 层怎样改变同一个任务。</p>
  </div>
</div>
```

The private page advances a single `runIndex`, so the reader sees one branch instead
of a synchronized comparison:

```js
// src/brain/concepts/pages/harness-engineering.html:1066 — current
if (runIndex >= steps.length - 1) runIndex = 0;
else if (runIndex === 3 && !enabled.state) return;
else if (runIndex === 4 && (!enabled.state || !enabled.recovery)) return;
else runIndex += 1;
```

The public Vue component repeats the same one-track structure:

```vue
<!-- src/content/concepts/harness-engineering/visual.vue:783 — current -->
<div class="timeline" role="list" aria-label="Agent run events">
  <article
    v-for="(step, index) in copy.runSteps"
    :key="step.label"
    role="listitem"
    :class="{
      reached: index <= runIndex,
      current: index === runIndex,
      failed: index === runIndex && !currentStepSatisfied,
    }"
  >
```

Because state changes mostly teleport between text blocks, the current interaction
feels like a configuration dashboard rather than an explanatory sequence. The
highest-leverage change is not more decorative motion. It is a synchronized,
causal animation that gives both systems the same task and lets their outputs diverge
in front of the reader.

## Target

Replace the current single-track run section in both the private HTML and public Vue
component with a **two-lane comparison film**:

```text
                    SAME TASK
       ┌────────────────┴────────────────┐
       │                                 │
  NO HARNESS                        WITH HARNESS
       │                                 │
  guesses context                  reads contract + map
       │                                 │
  edits plausible file             edits isolated worktree
       │                                 │
  crash → loses state              crash → restores checkpoint
       │                                 │
  “Fix complete”                   “Pull request ready”
  no evidence                      tests + trace + scoped delivery
```

The two lanes must always share the same phase clock so the comparison is causal, not
two unrelated demos.

### Story phases

Use exactly these six phases and branch outcomes:

| Phase | Shared event | No Harness lane | With Harness lane |
| --- | --- | --- | --- |
| `0 · ready` | Same checkout-bug task waits at the input gate | Empty lane | Empty lane |
| `1 · interpret` | Task enters both systems | “Find something checkout-related” | Contract appears: non-negative total, regression test, verified pull request |
| `2 · act` | Both systems begin work | Guesses `checkout.ts`; produces a plausible patch | Context map, isolated tools, and failing regression test become visible |
| `3 · interrupt` | Sandbox/process crash is injected | Patch drops out of the lane; state label becomes `LOST` | Checkpoint moves into durable state; state label becomes `SAVED` |
| `4 · resume` | Both systems attempt to continue | Starts over with incomplete context | Rebuilds a clean sandbox and resumes after the checkpoint |
| `5 · output` | Both systems declare an output | Output card: `FIX COMPLETE` with `0/4 evidence checks`; badges `not reproduced`, `not tested`, `no trace`, `broad/unknown authority` | Output card: `PULL REQUEST READY` with `4/4 evidence checks`; badges `failure reproduced`, `regression passed`, `trace preserved`, `scoped delivery` |

The final frame must keep both outputs on screen simultaneously for direct comparison.
Do not summarize the difference only in prose below the stage.

### Controls

Provide three controls:

1. **Play comparison** — starts at phase 0 and auto-advances through phase 5.
2. **Pause / Resume** — pauses between phases without resetting the current frame.
3. **Next step** — advances exactly one phase and is always usable, including when
   reduced motion is enabled.

After phase 5, the primary control label becomes **Replay comparison**.

Controls must be native `<button>` elements, keyboard accessible, and show press
feedback:

```css
.comparison-control {
  transition:
    transform 160ms var(--motion-ease-out),
    background-color 160ms ease,
    border-color 160ms ease;
}

.comparison-control:active {
  transform: scale(0.97);
}
```

### Motion tokens

Define the same local tokens in both source files. Do not introduce a dependency or a
global token file for this one concept:

```css
--motion-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--motion-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--motion-fast: 160ms;
--motion-step: 240ms;
--motion-stagger: 60ms;
```

Use:

- `240ms var(--motion-ease-in-out)` for objects moving along a lane;
- `180ms var(--motion-ease-out)` for cards and evidence badges entering or exiting;
- `160ms ease` for color and border feedback;
- `60ms` stagger between evidence badges in the final output frame.

All animation durations remain below 300ms. The story may hold a completed phase on
screen for `720ms` before advancing; the hold is not an animation duration.

Do not use `transition: all`. Animate only `transform`, `opacity`, `background-color`,
`border-color`, and `box-shadow`.

### State model and timing

Do not implement the sequence as one long CSS keyframe. It must be interruptible.

Use phase-driven rendering with CSS transitions:

```ts
type ComparisonPhase =
  | 'ready'
  | 'interpret'
  | 'act'
  | 'interrupt'
  | 'resume'
  | 'output'
```

The private HTML may use string values; the Vue component should use the type above.

Auto-play implementation:

- keep one timer handle;
- wait `720ms` after each phase settles before advancing;
- clear the timer before replay, manual step, unmount, or pause;
- never allow two timers to run concurrently;
- manual `Next step` must retarget from the current phase without replaying earlier
  transitions.

In Vue, use `onBeforeUnmount()` to clear the timer. In the private HTML, clear the timer
before every new run and on `pagehide`.

### Spatial animation

The stage contains:

- one shared task card centered above both lanes;
- a fork line leading to two equal lanes;
- a fixed model node in each lane;
- small work artifacts that move through the lane as the phase changes;
- one final output card per lane.

Movement must use `transform: translate3d(...)` and `opacity`, never animated `top`,
`left`, `width`, `height`, `margin`, or `padding`.

The crash phase should be explanatory rather than theatrical:

- both lanes receive the same brief orange interruption marker;
- the no-harness artifact moves downward `translate3d(0, 16px, 0)` and fades to
  `opacity: 0`;
- the harness artifact moves `translate3d(0, 10px, 0)` into a visible durable-state
  shelf, remains at `opacity: 1`, and receives a `SAVED` label;
- no shaking, bouncing, flashing, or infinite loops.

The resume phase reverses the harness artifact from the durable-state shelf into the
work lane with a `240ms var(--motion-ease-in-out)` transition. The no-harness lane
shows a new empty artifact with a `STARTING OVER` label rather than restoring the old
one.

### Output design

The final cards must make evidence legible at phone width.

No Harness:

```text
FIX COMPLETE
0 / 4 evidence checks
○ Failure reproduced
○ Regression passed
○ Trace preserved
○ Scoped delivery
```

With Harness:

```text
PULL REQUEST READY
4 / 4 evidence checks
● Failure reproduced
● Regression passed
● Trace preserved
● Scoped delivery
```

Use muted/orange treatment for missing evidence and lime/violet treatment for present
evidence. Do not rely on color alone: use open versus filled markers and explicit
`missing` / `verified` screen-reader text.

### Responsive behavior

- At `min-width: 680px`, render the two lanes side by side.
- Below `680px`, keep a two-column comparison rather than stacking the complete runs.
  Compress lane labels and artifact copy so both outputs remain visible together.
- At `360px`, each lane may be approximately `150px` wide. Output evidence labels
  should use `font-size: clamp(0.58rem, 2.6vw, 0.72rem)` and may wrap to two lines.
- The page must have no horizontal overflow at `360px`.
- The shared task card stays above both lanes and must not duplicate.

### Reduced motion

The current private page removes every transition:

```css
/* src/brain/concepts/pages/harness-engineering.html:723 — current */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { transition: none !important; animation: none !important; }
}
```

Replace that broad removal for the comparison stage with a gentler mode:

```css
@media (prefers-reduced-motion: reduce) {
  .comparison-stage * {
    transition-duration: 180ms !important;
    transition-timing-function: var(--motion-ease-out) !important;
  }

  .comparison-artifact,
  .comparison-output,
  .comparison-crash-marker {
    transform: none !important;
  }
}
```

In JavaScript:

- detect `window.matchMedia('(prefers-reduced-motion: reduce)')`;
- do not auto-play when reduced motion is true;
- `Play comparison` becomes a phase-by-phase fade sequence only if the user explicitly
  starts it;
- `Next step` remains available;
- preserve opacity and color feedback so the causal state change is still readable.

### Accessibility

- Add a visually hidden heading: `Same task, two execution systems`.
- Each lane is a `<section>` with an accessible name.
- The changing explanation uses one `aria-live="polite"` region outside the lanes.
  Announce only the current shared phase and one-sentence contrast; do not announce
  every decorative badge separately.
- Add `aria-current="step"` to the active phase indicator.
- Play/Pause uses `aria-pressed`.
- The animation must remain fully understandable when paused on any phase.
- Decorative fork lines, motion rails, and particles use `aria-hidden="true"`.

### Placement

Make the comparison the first major interaction after the problem framing:

1. hero;
2. problem / durable question;
3. animated no-harness versus harness comparison;
4. existing layer builder, reframed as “Explore what created the difference”;
5. analogy and concept-neighbor sections.

Remove the old single-track timeline after the comparison replaces it. Do not leave two
competing run simulators on the page.

## Repo conventions to follow

- The private explainer is self-contained HTML, CSS, and JavaScript:
  `src/brain/concepts/pages/harness-engineering.html`.
- The public derivative is a Vue Single-File Component with a `locale` prop and
  bilingual `COPY` object:
  `src/content/concepts/harness-engineering/visual.vue`.
- Reuse the existing Pattern Atlas palette in the private page:
  `--paper`, `--ink`, `--muted`, `--violet`, `--orange`, `--lime`, and `--blue`.
- Reuse blog runtime tokens in the Vue component:
  `var(--foreground)`, `var(--muted-foreground)`, `var(--background)`, `var(--card)`,
  `var(--secondary)`, `var(--orange)`, `var(--violet)`, and `var(--lime)`.
- The current component already handles reduced-motion media queries near
  `src/content/concepts/harness-engineering/visual.vue:1755`; extend that section
  instead of creating a second unrelated media block.
- Preserve the established crisp editorial personality: geometric rails, restrained
  color, no playful bounce, no decorative continuous animation.
- Preserve the existing layer builder and scenario judgment interaction. Only replace
  the old run timeline and reposition the comparison as specified.

## Steps

1. In `src/brain/concepts/pages/harness-engineering.html`, insert the animated comparison
   section immediately after `.problem` and before `.lab`.
2. In the same file, add local motion tokens to `:root`; implement the two-lane stage,
   fork, artifacts, crash marker, state shelf, output cards, phase indicator, and three
   controls with the exact durations and easings in this plan.
3. Replace `steps`, `runIndex`, `renderTimeline()`, `renderRun()`, and the `#run-button`
   handler with a six-phase comparison state machine. Use a single clearable timer and a
   `720ms` hold between settled phases.
4. Delete the old `.run`, `.timeline`, `.event`, and related mobile styles and markup
   once the comparison covers their teaching purpose.
5. Update the private reduced-motion block so the comparison drops positional movement
   but retains `180ms` opacity/color feedback. Keep `scroll-behavior: auto`.
6. In `src/content/concepts/harness-engineering/visual.vue`, add bilingual copy for all
   comparison labels, phases, outputs, evidence checks, controls, and live-region
   sentences. Keep English and Chinese phase semantics identical.
7. Add `ComparisonPhase`, `comparisonPhase`, `isPlaying`, `comparisonTimer`,
   `advanceComparison()`, `playComparison()`, `togglePause()`, `resetComparison()`, and
   timer cleanup via `onBeforeUnmount()`.
8. Replace the public `.run-panel` timeline and `.event-window` template with the same
   two-lane comparison structure and move it above the `.builder` section.
9. Implement the same CSS motion tokens, transform/opacity transitions, responsive
   two-column layout, and reduced-motion behavior in the scoped Vue styles using blog
   theme tokens only.
10. Change the layer builder heading/subheading copy to “Explore what created the
    difference” / “拆开刚才的差异”, while leaving layer toggles and scenario logic intact.
11. Format only the two touched source files. Do not regenerate social cards; the
    requested change concerns the interaction, not campaign artwork.
12. Run all verification below and visually inspect every comparison phase in both
    locales before marking the plan complete.

## Boundaries

- Do NOT change `src/brain/concepts/harness-engineering.md`, the bilingual article body,
  concept neighbors, sources, social assets, manifest, or atlas index.
- Do NOT add a motion library or any other dependency.
- Do NOT use decorative authored Scalable Vector Graphics; use CSS geometry and HTML.
- Do NOT use a canvas, video, or pre-rendered animation.
- Do NOT use infinite animation, shaking, bounce, parallax, or confetti.
- Do NOT animate layout properties or use `transition: all`.
- Do NOT autoplay on page load. Motion begins only after the user activates Play.
- Do NOT remove the layer builder or scenario judgment interaction.
- If either source file has drifted enough that the cited run-section structure no
  longer exists, STOP and report the mismatch instead of improvising.

## Verification

- **Mechanical**:
  - Run `git diff --check -- src/brain/concepts/pages/harness-engineering.html src/content/concepts/harness-engineering/visual.vue`; expect no output.
  - Extract the private inline script and compile it with Node `new Function(...)`;
    expect no syntax error.
  - Parse and compile the Vue Single-File Component using the blog repository's
    installed `@vue/compiler-sfc`; expect no parse, script, template, or style errors.
  - Run Prettier check on
    `src/content/concepts/harness-engineering/visual.vue`; expect a clean result.
  - At viewport widths `1440`, `768`, `390`, and `360`, assert
    `document.body.scrollWidth <= window.innerWidth`.
  - In a headless browser, run the comparison to phase 5 and assert both final cards are
    simultaneously visible with `0 / 4` and `4 / 4`.
  - Pause at phase 3, wait at least `1500ms`, and assert the phase does not advance.
  - Resume, then replay twice quickly and assert only one timer advances the sequence.
  - Emulate `prefers-reduced-motion: reduce`; assert positional transforms are `none`,
    both final states remain reachable with Next step, and no autoplay begins on load.
  - Assert no console errors in the private page and public component.
- **Feel check**: run the interaction and confirm:
  - the task visibly forks from one shared input into two systems;
  - both lanes advance together, so every difference has the same causal moment;
  - the crash marker appears once and does not feel theatrical;
  - the no-harness artifact disappears while the harness checkpoint visibly remains;
  - resume feels like continuation on the harness side and a restart on the other;
  - the final `0 / 4` versus `4 / 4` evidence contrast is readable without explanatory
    prose;
  - clicking Pause freezes the story between phases rather than resetting it;
  - clicking Replay during motion retargets cleanly and never creates overlapping runs;
  - in browser developer tools, set animation playback to 10% and confirm that moving
    artifacts animate only through transforms and opacity;
  - with reduced motion enabled, movement disappears but phase and evidence changes
    remain clear.
- **Done when**: a first-time reader can answer “what changes in the output when a
  harness exists?” after watching one run, without opening the layer definitions.

## Completion

Completed on 2026-07-24.

- Implemented the synchronized six-phase comparison in both authorized source files.
- Verified final `0 / 4` and `4 / 4` outputs, pause/resume, rapid replay, reduced motion,
  responsive widths, private JavaScript syntax, Vue compilation, and console cleanliness.
- Animation review approved after removing animated `box-shadow` transitions and hiding
  pre-output result cards from assistive technology.
