# 002 — Deepen the harness comparison into an evidence-led documentary

- **Status**: DONE
- **Commit**: 6fd7428
- **Severity**: HIGH
- **Category**: Explanatory motion · research-backed interaction
- **Estimated scope**: 5 source files, approximately 900–1,400 changed lines

## Problem

The six-phase comparison successfully makes the no-harness / harness distinction
visible, but it moves from task to output in roughly four seconds:

```ts
const comparisonPhases: ComparisonPhase[] = [
  "ready",
  "interpret",
  "act",
  "interrupt",
  "resume",
  "output",
];

comparisonTimer = setTimeout(() => {
  comparisonTimer = null;
  advanceComparison(false);
}, 720);
```

This is enough to communicate that a harness matters, but not enough to teach **why**
the output changes. Several different mechanisms are collapsed into the same frame:

- a task contract and a repository map appear together;
- isolation, reproduction, tools, and the first patch happen together;
- independent evaluation, iteration, and permission gating appear only in final prose;
- the final `0 / 4` versus `4 / 4` contrast arrives before the reader has watched the
  evidence accumulate.

The current left lane also risks overstating the claim. Neither OpenAI nor Anthropic
has published a controlled experiment proving that an identical model without an
engineered harness must fail. The evidence supports a more precise distinction:

> A thin loop can produce a completion claim. An engineered harness can make that
> claim inspectable through contracts, environment evidence, durable state,
> independent evaluation, and bounded authority.

The animation should therefore compare **unknown reliability** with an
**evidence-bearing result**, not “wrong model” with “right model.”

## Research basis

Use only the following first-party material for claims shown inside the interaction:

| Source key            | First-party practice the animation may depict                                                                                                                                                  | Boundary                                                                                                             |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `openai-harness`      | A short repository map pointing to structured sources of truth; per-worktree app instances; browser, logs, metrics, and traces made legible to Codex; agent-to-agent review and feedback loops | Describes one OpenAI internal product and its custom repository harness, not Codex defaults                          |
| `openai-safety`       | Filesystem/network sandbox boundaries, approvals for boundary crossings, command rules, external credential storage, agent-aware logs                                                          | Describes OpenAI's own Codex deployment posture; controls reduce risk but do not guarantee safety                    |
| `openai-durable`      | Externalized agent state, snapshotting, rehydration, and continuation in a new sandbox                                                                                                         | Agents SDK infrastructure; it is not identical to conversation history or application-level idempotency              |
| `anthropic-long`      | Initializer/coding-agent split, structured feature list, progress file, Git history, baseline app test, one increment per session                                                              | A full-stack web-app experiment, not a universal recipe                                                              |
| `anthropic-evaluator` | Planner–generator–evaluator roles, a negotiated sprint contract, Playwright testing of UI/API/database state, hard thresholds, and feedback to the generator                                   | A Labs experiment with materially greater runtime and cost; the evaluator required calibration and remained fallible |
| `anthropic-managed`   | Session as an append-only event log separated from harness and sandbox; `wake(sessionId)`-style recovery; credentials kept outside generated-code execution                                    | Session durability does not automatically preserve every external side effect                                        |
| `anthropic-sandbox`   | Filesystem plus network isolation, sandbox-external credentials, and a scoped Git proxy                                                                                                        | Sandboxing limits blast radius; it is not proof that every permitted action is correct                               |
| `anthropic-evals`     | Grading the final environment outcome rather than trusting the transcript or the agent's assertion                                                                                             | Model graders should be combined with deterministic state checks and human calibration where appropriate             |

First-party URLs:

- https://openai.com/index/harness-engineering/
- https://openai.com/index/running-codex-safely/
- https://openai.com/index/the-next-evolution-of-the-agents-sdk/
- https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- https://www.anthropic.com/engineering/harness-design-long-running-apps
- https://www.anthropic.com/engineering/managed-agents
- https://www.anthropic.com/engineering/claude-code-sandboxing
- https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents

The interaction must say that the right lane is a **synthesis of public practices**, not
a frame-by-frame reproduction of either company's product and not a claim that every
installation includes every mechanism.

## Target

Replace the current six-frame demo with a 12-chapter, synchronized, two-lane
interactive documentary:

```text
ACT I · MAKE THE TASK LEGIBLE
same task → define done → find the source of truth

ACT II · LET THE MODEL TOUCH REALITY
bound action → reproduce → make a first patch

ACT III · SURVIVE FAILURE
same crash → persist state → resume in a clean environment

ACT IV · EARN COMPLETION
independent evaluation → revise → authorize → deliver evidence
```

The full automatic story should take approximately **17–20 seconds** before reaching
the final frame. This is achieved with longer settled holds, not long animation
durations.

### Accurate lane labels

Use:

- English: `No engineered harness` / `Engineered harness`
- Chinese: `没有工程化 Harness` / `有工程化 Harness`

Add a concise clarification:

- English: `The left lane is a capable model in a thin tool loop—not a claim that an
agent can literally run without software.`
- Chinese: `左侧代表有能力的模型加最薄工具循环，并不是说智能体可以完全脱离运行代码。`

## Story chapters and final copy

Both locales must preserve the same semantics. Keep lane copy short enough to scan in
one settled hold.

| #   | Phase key / label                         | Shared event                                       | No engineered harness                                                                                                                          | Engineered harness                                                                                                                                   | Narration                                                                                                                                                  |
| --- | ----------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 00  | `ready` · Same task / 同题                | Identical model and checkout task enter both lanes | `MODEL + THIN LOOP` / `模型 + 最薄循环`; waiting                                                                                               | `MODEL + SYSTEM` / `模型 + 运行系统`; waiting                                                                                                        | `Same model. What changes is what it can see, do, preserve, and prove.` / `同一个模型；改变的是它能看到、做到、保存和证明什么。`                           |
| 01  | `contract` · Define done / 定义完成       | Turn intent into an observable finish line         | `Fix the checkout bug` / `修复结账 Bug`; “done” remains self-interpreted; state `AMBIGUOUS` / `目标模糊`                                       | `Write the finish line first` / `先写完成条件`; `total ≥ 0 · reproduce · regression · reviewed PR`; state `CONTRACT` / `契约已定`                    | `A harness makes “good” judgeable before work begins.` / `Harness 在开工前，先把“做好”变成可以判定的终态。`                                                |
| 02  | `orient` · Find truth / 找到事实          | Both lanes search the repository                   | `Search what looks familiar` / `搜索熟悉的文件`; the nearest filename becomes temporary truth; state `GUESSING` / `猜路径`                     | `Follow map → source of truth` / `沿地图找到事实`; entry → checkout domain → tests → run command; state `ORIENTED` / `已定位`                        | `A map is not more context; it is a route to authoritative context.` / `地图不是更多上下文，而是通往权威上下文的路径。`                                    |
| 03  | `contain` · Bound action / 限定行动       | Create the work environment                        | `Boundary unknown` / `边界不可见`; writable paths, network, and credentials are unclear; state `BROAD / UNKNOWN` / `宽泛或未知`                | `Isolated workspace ready` / `隔离工作区已就绪`; workspace write · network allowlist · credentials outside; state `BOUNDED` / `边界生效`             | `Inside the boundary, the agent can move; crossing it requires a gate.` / `边界内可以连续行动；越界才停下来。`                                             |
| 04  | `reproduce` · Observe reality / 观察现实  | Both lanes inspect the bug                         | `Patch before observing` / `先改再看`; guesses a root cause without running checkout; state `ASSUMED` / `基于假设`                             | `Reproduce −$8` / `复现 −$8`; browser + logs + trace point to the discount path; state `REPRODUCED` / `故障已复现`                                   | `The running system becomes feedback the model can read.` / `Harness 把运行中的系统变成模型可读取的反馈。`                                                 |
| 05  | `patch` · First patch / 第一版补丁        | Both lanes edit code                               | `Clamp the displayed value` / `把显示值夹到 0`; the UI looks fixed while the API may still be negative; state `SURFACE PATCH` / `表面补丁`     | `Patch + regression candidate` / `补丁 + 回归候选`; change, test, and decision enter a checkpoint; state `CHECKPOINT` / `检查点`                     | `The first patch may still be incomplete; the difference is whether the system keeps testing it.` / `第一版补丁仍可能不完整；差别在于系统是否继续检验它。` |
| 06  | `interrupt` · Same crash / 同一次崩溃     | Inject one identical process/sandbox failure       | `Only copy died with the process` / `唯一副本随进程消失`; state `LOST` / `状态丢失`                                                            | `State outlives the sandbox` / `状态活在沙箱之外`; events, files, and progress remain; state `SAVED` / `检查点保留`                                  | `A component can die without killing the task.` / `组件可以死亡，任务不必死亡。`                                                                           |
| 07  | `recover` · Resume / 恢复                 | Both lanes receive a fresh process                 | `New run, old uncertainty` / `新运行，旧的不确定`; cannot distinguish completed work from an unverified guess; state `START OVER` / `重新开始` | `Fresh sandbox, same run` / `新沙箱，同一个任务`; resume after the last durable event without repeating completed work; state `RESUMED` / `继续运行` | `A session is not a context window; recovery depends on external state.` / `Session 不是 Context Window；恢复依靠外部状态。`                               |
| 08  | `evaluate` · Independent check / 独立验证 | A second judge exercises the result                | `Looks fixed to me` / `看起来修好了`; the generator is its only judge; state `SELF-APPROVED` / `自评通过`                                      | `Evaluator plays checkout` / `评审者实际操作结账`; UI passes, API still returns −$8 → `FAIL`; state `REVISION` / `退回修改`                          | `An evaluator tests the environment; “I finished” is not evidence.` / `独立评审测试环境结果；“我完成了”不算证据。`                                         |
| 09  | `revise` · Close the loop / 闭合反馈      | Feed the failed check back into work               | `No failure signal, no second pass` / `没有失败信号，也没有第二轮`; state `STOPPED AT CLAIM` / `停在声明`                                      | `Feedback returns to the loop` / `反馈回到执行环`; fix the shared pricing invariant; UI + API + regression pass; state `PASSED` / `验证通过`         | `Harness value is not never being wrong; it is turning errors into the next action.` / `Harness 的价值不是永不犯错，而是让错误变成下一次行动。`            |
| 10  | `authorize` · Gate consequence / 约束后果 | Prepare the pull request                           | `Ready to deliver` / `准备交付`; destination, credential scope, and authority remain unclear; state `AUTHORITY UNKNOWN` / `权限未知`           | `Permission gate` / `权限闸门`; reading and tests are automatic, branch-scoped PR creation requires explicit authority; state `SCOPED` / `受限批准`  | `Autonomy comes from hard boundaries, not from removing every confirmation.` / `自主性来自硬边界，而不是取消所有确认。`                                    |
| 11  | `output` · Deliver / 交付                 | Both lanes announce completion                     | `FIX COMPLETE`; `0 / 6 evidence checks`; `A completion claim; reliability remains unknown.` / `一句完成声明；可靠性仍然未知。`                 | `PULL REQUEST READY`; `6 / 6 evidence checks`; `Patch + tests + trace + review + authority record` / `补丁 + 测试 + 轨迹 + 评审 + 权限记录`          | `The final difference is not confidence. It is a claim versus an evidence package.` / `最后的差异不是语气更自信，而是一个说法与一份证据包。`               |

The no-harness final card must explicitly add:

- English: `No evidence does not prove failure. It means reliability is unknown.`
- Chinese: `没有证据不等于已经失败；它意味着可靠性未知。`

### Evidence ledger

Show the same six checks beneath both lanes throughout the story, not only at the end:

1. Acceptance contract / 验收契约
2. Failure reproduced / 故障复现
3. Regression passed / 回归通过
4. Independent evaluation / 独立评审
5. Durable trace / 持久轨迹
6. Scoped authority / 受限权限

The right ledger fills at causal milestones:

| Check                  | Becomes verified at |
| ---------------------- | ------------------- |
| Acceptance contract    | `contract`          |
| Failure reproduced     | `reproduce`         |
| Durable trace          | `patch`             |
| Regression passed      | `revise`            |
| Independent evaluation | `revise`            |
| Scoped authority       | `authorize`         |

The left ledger stays open/missing. This is a statement about available evidence in
the demo, not proof that the patch is wrong.

## Information design

### Four-act chapter rail

Replace the six-item passive progress list with four labeled acts and 12 clickable
chapter buttons:

1. `Make the task legible` / `让任务可理解`: 00–02
2. `Touch reality` / `接触真实环境`: 03–05
3. `Survive failure` / `穿过故障`: 06–07
4. `Earn completion` / `赢得完成`: 08–11

Each chapter button:

- is a native `<button>`;
- shows its two-digit index and short label;
- uses `aria-current="step"` when active;
- pauses automatic playback when selected;
- can retarget directly without replaying earlier chapters.

The rail may scroll horizontally inside its own container below `680px`; it must not
cause body overflow.

### Persistent chapter inspector

Add a compact inspector directly under the lanes. It is the explanation layer that
allows lane cards to stay concise:

```text
08 / 11 · INDEPENDENT CHECK
An evaluator tests the environment; “I finished” is not evidence.

PUBLIC PRACTICE · SYNTHESIS, NOT A PRODUCT REPLICA
[OpenAI · agent-to-agent review] [Anthropic · Playwright evaluator]
```

For every phase:

- show the current narration sentence;
- show one or two linked first-party practice chips from the source registry;
- include organization, concise practice label, and an accessible full source title;
- open external sources in a new tab with `rel="noreferrer"`;
- never imply that the named company endorses the synthesis.

For `ready` and `output`, the source label may say `Synthesis from the practices below`
and link to the most directly relevant OpenAI/Anthropic sources.

### Visible harness modules

Inside the engineered lane, add a compact seven-module tray:

`CONTRACT · MAP · SANDBOX · TOOLS · STATE · EVAL · GUARD`

Chinese may retain these short English system labels if accompanied by localized
accessible text. Each module changes from dormant to active at the chapter where it
first matters. The thin lane shows the same positions as dashed absences, so the
reader sees the system assembling around the same model.

Do not turn this into a decorative dashboard. The active module, current artifact,
ledger, and narration must all point to the same causal event.

### Evaluation feedback loop

At `evaluate`, show a separate `EVALUATOR` node on the engineered lane and a concise
`FAIL · API −$8` return artifact. At `revise`, move that return artifact back toward
the work card using transform/opacity, then change it to `PASS · UI + API + TEST`.

The no-engineered-harness lane shows `SELF REVIEW` at the same location. Do not claim
that self-review is useless; show that it is the only judge in that lane.

### Crash and recovery

Preserve the successful crash teaching moment from plan 001:

- the same orange interruption marker appears in both lanes;
- the thin-loop artifact fades and moves down by at most `16px`;
- the engineered artifact moves into a visible state shelf and remains;
- the next phase brings a fresh sandbox shell into view and restores the artifact;
- no shake, flash, bounce, or theatrical explosion.

## Controls and timing

Provide:

1. `Play the story` / `播放完整过程`
2. `Pause` / `暂停` and `Resume` / `继续`
3. `Previous` / `上一步`
4. `Next` / `下一步`
5. Direct chapter selection through the chapter rail

At the final frame, the primary control becomes `Replay the story` / `重播完整过程`.

Use one clearable timer. Automatic settled holds:

```ts
const comparisonHolds: Record<ComparisonPhase, number> = {
  ready: 1000,
  contract: 1500,
  orient: 1500,
  contain: 1600,
  reproduce: 1800,
  patch: 1600,
  interrupt: 1800,
  recover: 1600,
  evaluate: 2000,
  revise: 1700,
  authorize: 1600,
  output: 0,
};
```

Rules:

- no autoplay on page load;
- Play starts at `ready`, then follows the table;
- manual Previous, Next, or chapter selection pauses playback;
- Pause freezes the settled chapter without resetting it;
- Replay clears the old timer before starting;
- the final frame remains until the user acts;
- never allow more than one pending timer;
- clear the timer on private-page `pagehide` and Vue `onBeforeUnmount()`.

## Motion system

Keep the existing local motion tokens and add no dependency:

```css
--motion-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--motion-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--motion-fast: 160ms;
--motion-step: 240ms;
--motion-stagger: 60ms;
```

Use a maximum authored transition duration of `260ms`. Long chapter holds are not
animation durations.

Allowed animated properties:

- `transform`
- `opacity`
- `background-color`
- `border-color`
- text color where needed

Do not animate:

- width, height, top, left, margin, padding, or grid/flex layout;
- box-shadow;
- filters;
- CSS custom properties that trigger layout;
- `transition: all`.

Use phase classes or data attributes and interruptible CSS transitions. Do not use one
12-step keyframe.

Recommended movement vocabulary:

- chapter content enters with `translate3d(0, 8px, 0)` → `0`;
- state checkpoint moves at most `10px`;
- evaluation feedback moves horizontally at most `18px`;
- evidence dots use opacity plus scale `0.92` → `1`;
- controls press to `scale(0.97)`.

No infinite animation, parallax, shaking, bounce, confetti, or ambient particles.

## Responsive behavior

- Keep the two lanes synchronized and side by side at every supported width.
- At `680px` and above, show full lane title and one short explanatory sentence.
- Below `680px`, keep state, title, module tray, and evidence marks in each lane; move
  the full explanatory sentence to the shared inspector so the two tracks remain
  directly comparable.
- The 12-chapter rail may use contained horizontal scrolling with an obvious active
  item.
- At `360px`, evidence labels may wrap to two lines; use no font smaller than
  `0.58rem`.
- Final `0 / 6` and `6 / 6` cards must be visible together without horizontal
  scrolling.
- No body overflow at `1440`, `768`, `390`, or `360` pixels.

## Reduced motion

With `prefers-reduced-motion: reduce`:

- keep every spatial transform at `none`;
- retain `160–180ms` opacity and color changes;
- Play may advance only because the reader explicitly activated it;
- Previous, Next, Pause, and chapter selection remain fully functional;
- the crash is expressed through labels and opacity, not movement;
- the evaluation return is expressed through `FAIL` → `PASS` state change, not travel;
- do not remove the evidence accumulation or explanatory inspector.

## Accessibility

- Keep one visually hidden comparison heading.
- Use one `aria-live="polite"` region containing only index, chapter label, and the
  narration sentence.
- Do not announce decorative rails, module geometry, or every evidence dot.
- Give both lanes stable accessible names.
- Mark final output cards `aria-hidden="true"` until `output`.
- Mark source chips as normal links, outside the live region.
- Chapter buttons use `aria-current="step"`; Play/Pause uses `aria-pressed` only where
  semantically appropriate.
- Preserve a complete understanding when the story is paused on any chapter.

## Source provenance updates

Update source provenance without rewriting the article body:

- In `src/brain/concepts/harness-engineering.md`, add concise annotated Further
  reading entries for:
  - OpenAI · Running Codex safely at OpenAI
  - OpenAI · The next evolution of the Agents SDK
  - Anthropic · Harness design for long-running application development
  - Anthropic · Beyond permission prompts: Claude Code sandboxing
- Add the same four sources to `sources` and Further reading in both public locale
  files.
- Do not add uncited numerical claims such as throughput, cost, or prompt-reduction
  percentages to the animation. They are unnecessary for the causal lesson.

## Repo conventions

- Private explainer:
  `src/brain/concepts/pages/harness-engineering.html`
- Public bilingual component:
  `src/content/concepts/harness-engineering/visual.vue`
- Private canonical note:
  `src/brain/concepts/harness-engineering.md`
- Public article sources:
  `src/content/concepts/harness-engineering/en.md`
  and `src/content/concepts/harness-engineering/zh.md`
- Reuse the existing Pattern Atlas private palette and the existing blog-runtime tokens.
- Preserve the layer builder, presets, and scenario interaction below the comparison.
- Keep English and Chinese state semantics aligned.
- Keep the private page self-contained and the public component dependency-free.

## Steps

1. Expand `ComparisonPhase` in the public component and its private-page equivalent to
   the exact 12 keys in this plan.
2. Replace the fixed `720ms` timer with the per-phase hold map, add previous/direct
   selection, and preserve one-timer cleanup.
3. Rewrite bilingual comparison copy to the exact causal story above. Refactor
   duplicated copy fields only if the result stays local and readable.
4. Replace the six-item progress list with the four-act, 12-button chapter rail.
5. Add the seven-module tray, persistent evidence ledger, evaluator node/feedback
   artifact, and persistent chapter inspector.
6. Keep the shared task, synchronized two-lane geometry, crash shelf, and paired final
   outputs from the existing implementation.
7. Expand final evidence from four to six items and implement right-lane milestone
   accumulation.
8. Add the local first-party source registry and phase-to-source mapping in both
   implementations.
9. Update responsive and reduced-motion styles without introducing layout animation or
   a library.
10. Update only the source lists / Further reading sections of the three Markdown
    files.
11. Format the five changed source files only.
12. Run the complete verification matrix and capture key visual checkpoints before
    marking the plan complete.

## Boundaries

- Do NOT change the concept definition, article argument, neighbors, manifest, social
  assets, atlas index, or unrelated sections.
- Do NOT imply an OpenAI-versus-Anthropic competition; the right lane is a synthesis of
  complementary public practices.
- Do NOT imply that every Codex or Claude installation includes the depicted full
  harness.
- Do NOT say the left result is definitely wrong. Say it is unverified or of unknown
  reliability.
- Do NOT add a motion, charting, or icon dependency.
- Do NOT use authored Scalable Vector Graphics, canvas, video, or pre-rendered motion.
- Do NOT autoplay on page load.
- Do NOT remove the builder, presets, layer definitions, or scenario judgment section.
- Do NOT commit, push, publish, sync to the blog repository, or deploy.
- If the existing six-phase comparison has materially drifted from plan 001, STOP and
  report the mismatch instead of replacing a different interaction.

## Verification

### Mechanical

- `git diff --check` on the five authorized source files; expect no output.
- Compile the private inline script with Node `new Function(...)`.
- Parse and compile the Vue script, template, and scoped styles with the blog
  repository's installed `@vue/compiler-sfc`.
- Run Prettier check on the Vue and Markdown files.
- Run the concept publisher in dry-run mode; expect the package to remain public-ready.
- Confirm all eight first-party URLs return successful pages.
- Audit source links for `target="_blank"` plus `rel="noreferrer"` where rendered.

### Interaction

- Play from `ready` and assert all 12 phases are visited once in order.
- Measure automatic time from Play to `output`; expect 17–20 seconds within normal
  timer tolerance.
- Pause on `evaluate`, wait at least 2.5 seconds, and assert the phase remains fixed.
- Resume and confirm it advances once.
- Use Previous, Next, and a non-adjacent chapter button; each must land exactly once and
  pause playback.
- Trigger Replay at least three times quickly and assert that one timer owns the
  sequence.
- Assert the evaluator shows `FAIL · API −$8` at `evaluate` and
  `PASS · UI + API + TEST` at `revise`.
- Assert the right evidence count reaches milestones in order and ends at `6 / 6`;
  assert the left stays `0 / 6`.
- At `output`, assert both final cards are simultaneously visible.
- Before `output`, assert both final cards are hidden from assistive technology.

### Responsive and accessibility

- At `1440`, `768`, `390`, and `360` pixels, assert
  `document.body.scrollWidth <= window.innerWidth`.
- At `390` and `360`, assert both lanes are still side by side, the current chapter
  remains understandable through the inspector, and the chapter rail scrolls inside
  itself.
- Emulate reduced motion; assert artifact, crash, feedback, and evidence transforms are
  `none`, while all 12 phases remain reachable.
- Assert one live region only, stable lane labels, native buttons, and
  `aria-current="step"` on exactly one chapter.
- Assert no browser console errors.

### Feel check

- A first-time reader can see the harness assemble, not merely read that it exists.
- The first patch is allowed to be imperfect; the engineered lane wins through feedback,
  not magic.
- The crash feels consequential but restrained.
- Recovery reads as continuation in a replaceable environment, not as a reversed
  animation.
- Evaluation produces a visible failure and a visible corrective loop.
- The permission chapter slows the story at the right moment without implying that every
  action needs approval.
- The final frame reads immediately as “claim versus evidence package.”
- Source chips add credibility without turning the interaction into a bibliography.

## Done when

After one automatic viewing, a reader can explain:

1. which concrete harness mechanisms changed the run;
2. why a process crash did not erase the engineered task;
3. why the first patch was not accepted;
4. why the final pull request is more trustworthy;
5. which parts came from publicly documented OpenAI and Anthropic practices.

## Completion

Completed on 2026-07-24.

- Expanded the synchronized comparison from six phases to four acts and twelve
  chapters, with a measured automatic runtime of 17.78–18.05 seconds.
- Added direct chapter selection, Previous / Next, pause / resume, per-phase holds,
  seven visible harness modules, a six-item evidence ledger, an evaluator
  `FAIL → PASS` loop, and first-party source chips.
- Preserved the accurate claim boundary: the thin-loop output is unverified rather
  than asserted to be wrong, and the engineered lane is explicitly a synthesis of
  public OpenAI and Anthropic practices rather than a product replica.
- Added four first-party sources to private and bilingual public provenance.
- Verified private JavaScript, Vue script/template/scoped-style compilation,
  Prettier, publisher dry-run, whitespace, 12-phase timing, pause/resume, direct
  navigation, rapid replay, evidence milestones, final paired outputs, source links,
  reduced motion, console cleanliness, and responsive widths down to 360 pixels.
- Animation review approved after increasing the core module-label size and correcting
  the Anthropic source chip to cover both sprint contracts and independent evaluation.
