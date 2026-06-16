# Blog Plan: Fable 5 Changed the Unit of AI Work

## Meta

- **Author:** Aaron Guo
- **Target:** aaronguo.com blog (EN + ZH bilingual)
- **Tone:** Entrepreneurial, operator-grade, concrete, mechanism-driven. Less hype, more "what changed in the work system."
- **Length:** 1,700-2,300 English words
- **Audience:** Tech professionals, product leaders, AI builders, and operators using agents for real work
- **CTA:** newsletter

## Hook

Open with the Fable 5 run, but make the key observation sharper: the impressive thing was not that the model produced better pages. It was that the unit of AI work changed. Instead of a prompt-response loop, Aaron handed over a multi-hour work block and got back a deliverable.

## Thesis

When agents can run for hours, coordinate subagents, and use tools, the unit of AI work shifts from prompt to run; the scarce skill becomes designing the operating contract that makes each run bounded, inspectable, and reversible.

## Personal Anchor

Aaron ran Fable 5 on a multi-hour task and felt the shift from prompting a model to managing a temporary work system. The experience connected to his daily use of Opus 4.8 / Codex 5.5 with `obra/superpowers`, where a skills-based methodology lets agents spec, plan, execute, review, and verify longer blocks of work. This also connects to Aaron's journal theme: AI makes him more powerful because more projects can move in parallel, but only if the work is planned clearly enough to separate low-focus delegated work from high-engagement judgment work.

## Deepening Notes

- Current draft problem: it states "manage autonomy" but does not explain the mechanism deeply enough.
- Stronger framing: the unit of work changes from "answer" to "run." A run has duration, permissions, cost, state, checkpoints, evidence, and rollback needs.
- Counterargument to answer: "Isn't this just project management?" Response: partly, but agents add three new properties - machine-speed execution, tool access, and probabilistic reliability. That makes the operating contract more important than ordinary task delegation.
- Fable evidence: Anthropic's Fable docs discuss long runs, parallel subagents, boundaries, progress claim grounding, effort levels, memory systems, and scaffolding updates.
- Superpowers evidence: `obra/superpowers` is an open-source skills framework and software development methodology for coding agents; it encodes a process into skills like brainstorming, writing plans, subagent-driven development, TDD, review, and verification.
- Governance evidence: Gartner warns that binary governance fails because autonomy level and access scope must be separated. This maps cleanly to the individual builder's problem.

## Outline

### Part 1: The surprising thing was the run

- Point: Fable 5 felt different because it consumed a block of work, not because it wrote prettier text.
- Evidence/example: Aaron gave it a multi-hour task; it planned, delegated, researched, and produced polished pages.
- Personal beat: The feeling was not "I got a better answer." It was "I launched a temporary work system."
- Mechanism: In prompt mode, the user controls every step. In run mode, the human designs the conditions before launch and audits the result after.

### Part 2: The unit of AI work is changing

- Point: AI work is moving from response to run.
- Evidence/example: Anthropic's Fable docs describe work that may take hours, days, or weeks; long runs, effort levels, progress claims, boundaries, parallel subagents, and memory.
- Business value: Once the unit is a run, the bottleneck becomes not prompt wording but run design.
- Mechanism: A run has objective, context, tools, authority, budget, checkpoints, evidence, and rollback. Bad direction compounds over time.

### Part 3: Superpowers is an operating contract, not another tool

- Point: Superpowers should be introduced clearly as `obra/superpowers`, an open-source skills framework and software development methodology for coding agents.
- Evidence/example: It makes agents clarify/spec, plan, execute, use subagents or structured phases, review, and verify.
- Personal beat: Aaron already experiences smaller one-to-two-hour runs with Codex/Opus + Superpowers.
- Strategic implication: The model is the engine; skills are the operating discipline around the engine. This is why Superpowers is a practical rehearsal for the Fable-style future.

### Part 4: This is not just project management

- Point: The obvious objection is that this sounds like normal management or project planning. It is related, but not the same.
- Evidence/example: Human delegation assumes social accountability, stable identity, and slower execution. Agent delegation involves probabilistic reliability, tool access, fast iteration, and no native accountability.
- Mechanism: Agent runs need operating contracts because autonomy amplifies both correct work and wrong trajectories.
- Business value: The operator's job becomes designing the work system: what can be delegated, what must be reviewed, where judgment must remain human.

### Part 5: Governance is the same problem at larger scale

- Point: Fable's suspension and enterprise governance discussions are not separate from daily workflow practice. They are the same pattern at different scales.
- Evidence/example: Anthropic discussed safeguards, red-teaming, monitoring, and defense-in-depth; Databricks framed Fable with governance, audit trails, tool-call policies, and cost controls; Gartner separates autonomy level from access scope.
- Mechanism: Agent risk is created when autonomy and permissions are mismatched.
- Builder-level translation: For every agent run, ask: What can it do? How will I know what it did? How do I stop or undo it?

### Part 6: The new skill is designing operating contracts

- Point: The next AI-native skill is not merely prompting, and not vague "agent management." It is designing operating contracts for runs.
- Framework:
  - Objective: what outcome matters?
  - Context: what information is authoritative?
  - Authority: what can the agent read, write, call, spend, or publish?
  - Checkpoints: where should it pause or report?
  - Evidence: what proof must support progress claims?
  - Budget: how much time, cost, and exploration is allowed?
  - Rollback: what happens if it goes wrong?
- Personal beat: This maps to Aaron's realization that AI makes him more powerful only when project work is routed clearly: some work can be handed over, some work needs deep engagement.

### Part 7: Ending

- Point: Fable 5 may come back, be replaced, or become normal. The product cycle is not the durable lesson.
- Close on a sharp implication: The durable edge is the ability to turn intelligence into repeatable, inspectable runs.
- Ending line direction: "The future does not belong to the best prompter. It belongs to the builder who can let execution run ahead without letting judgment fall behind."

## Visual Ideas

- Cover: a prompt box expanding into a control room for agent runs.
- Inline visual: "Prompt -> Response" vs. "Objective -> Run -> Evidence -> Review."
- Inline visual: Operating contract stack: Objective, Context, Authority, Checkpoints, Evidence, Budget, Rollback.
- Inline visual: Autonomy vs. access matrix.

## Distribution Plan

- Blog: Rewrite as a deeper operator essay grounded in Fable, Superpowers, and governance mechanics.
- X: Long-form post around "the unit of AI work changed from prompt to run."
- Newsletter / LinkedIn: Position as a practical essay about what to learn from Fable even if access is unavailable.
- YouTube: Slide script should emphasize the mechanism: prompt-response loop vs. long-running agent run.

## Open Questions

- Exact Fable run details and agent count should remain softly phrased unless Aaron provides screenshots or logs.

