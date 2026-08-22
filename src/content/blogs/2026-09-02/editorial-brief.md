# Editorial Brief

## Reader Pain

Builders see short prompts and surprisingly large usage, but their tools do not show which part came from the core harness, workspace instructions, skill/plugin catalogs, or cache misses. They optimize wording while the fixed architecture stays invisible.

## Reader Job To Be Done

Measure the first-request footprint of an agent stack, separate context size from marginal cache cost, and decide which capabilities should load eagerly, load on demand, or remain out of the session.

## One-Sentence Promise

By the end, the reader can itemize an agent's first-request bill and evaluate it against successful completed work rather than blaming the user's prompt.

## Sharp Thesis

An agent's first request is an architecture bill, not a conversation bill: the core harness, workspace memory, and capability catalog are loaded before the task arrives; caching can discount repeated input but cannot remove its context footprint, so the operator metric that matters is uncached input per successful completed task.

## Concrete Opening

Name one scene, contradiction, bottleneck, result, or decision. Do not open with the topic in general.

Aaron asked Codex for one word: “OK.” The model used five or six output tokens, but the first request carried a median 17,606 input tokens. A controlled ablation found 12,867 in the core harness, +2,946 from the Aaron Studio workspace, and +1,793 from the installed plugin/app surface.

## Original Contribution

State what this article adds beyond the source material and Aaron's prior posts.

- A five-run, reproducible measurement on Aaron's own Codex stack rather than a retelling of HuaShu's DeepSeek number.
- An ablation that separates core harness, workspace, and plugin/app layers.
- A distinction between gross context footprint and marginal cached/uncached input cost.
- A decision rule: measure boot footprint, cache reuse, and fresh-session multiplication, then divide by successful completed tasks.
- A counterintuitive result: on Aaron's stack the largest layer was the harness itself, not the skill/plugin catalog.

## Why Aaron Can Write This

Aaron runs Codex, Claude Code, shared skills, and a local content operating system daily; he has both the actual stack and its usage logs. The experiment is performed on that stack, pinned to a CLI version, model, configuration, and date.

## Authority And Scope Boundary

State what Aaron knows directly, what is inferred, and what the article will not claim.

Directly known: CLI usage fields, controlled configuration differences, local installed plugin count, and the observed cache-read variability. Externally verified: DSH measurements and provider cache/tool-loading mechanics. Inferred: what the layers imply for agent operations. The article will not convert a Codex subscription into a dollar invoice, compare model quality, claim a universal Codex entry fee, or imply that the smallest prompt always produces the cheapest completed task.

## Evidence Needed

- Own-stack experiment protocol, repetitions, results, and caveats.
- HuaShu/DSH differential-weighing result pinned to rc.6 and commit `47f9438`.
- DeepSeek's official 64-token cache units, prefix rules, best-effort persistence, and usage fields.
- OpenAI's exact-prefix requirement and cached-token reporting.
- Anthropic's explicit statement that tool definitions consume context, its ~55k-token multi-server example, >85% tool-search reduction, and prompt-cache pricing mechanics.
- The PTC/Code mode counterexample showing that moving schemas does not necessarily remove them.

## Counterargument

A large first request may be rational. Rich instructions, tools, and skills can improve task success, reduce retries, and save more downstream tokens than they cost. Tool search also adds latency and can be worse when the toolset is small or frequently used.

Response: agree and change the objective. Do not minimize boot tokens in isolation. Remove or defer capabilities only when they do not improve completed-task economics, and measure success rate and total run cost alongside the first request.

## Reusable Frame

Count three things without inventing a new acronym:

1. **Boot footprint:** gross first-request input tokens.
2. **Cache reuse:** cached versus uncached share and the provider's write/read policy.
3. **Fresh-session multiplication:** how many new sessions or agents are created per successful completed task.

The decision denominator is successful completed work.

## Distribution Hook

“I asked Codex for one word. It loaded 17,606 input tokens first. I turned the receipt into three lines: 12,867 for the harness, 2,946 for my workspace, 1,793 for plugins.”

## Success Hypothesis

The concrete self-measurement should earn deep-reader attention from builders because it exposes a hidden cost they can reproduce immediately. The provider/tool-search evidence raises it from a personal optimization anecdote to a general agent-architecture argument.

## Kill Criteria

- Kill or delay if the measurement cannot be reproduced immediately before publication.
- Kill if 17,606 is presented as a universal Codex number or a dollar bill.
- Cut any provider comparison that becomes a pricing-table detour.
- Cut claims that every subagent necessarily repays the same fee; state the inheritance boundary.
- Do not publish if the conclusion is “install fewer skills.” The conclusion must preserve the value side of the tradeoff.
