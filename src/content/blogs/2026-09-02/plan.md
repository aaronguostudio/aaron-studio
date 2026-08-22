# Blog Plan: The 17,606-Token First Request

## Meta

- **Author:** Aaron Guo
- **Target:** aaronguo.com blog (EN + ZH bilingual)
- **Tone:** Entrepreneurial, crisp, technically rigorous, insight-led, commercially useful; no pricing-table detour, soft self-help, or teacherly advice.
- **Length:** 2,000-2,400 English words
- **Audience:** Builders and engineering/product leads operating Codex, Claude Code, MCP, or custom agent stacks.
- **CTA:** Newsletter — continue the DeepSeek Harness series with the next experiment.

## Hook

I asked Codex to do almost nothing: “Reply with exactly: OK. Do not use tools.” It answered in five or six output tokens. The first request carried a median 17,606 input tokens.

Show the receipt immediately:

```text
12,867  core Codex harness, protocol, core tools, and tiny prompt
 2,946  Aaron Studio workspace context
 1,793  installed plugin/app surface
------
17,606  median first request
```

Then state the surprise: I started the experiment expecting my shared skill catalog to dominate, because that is what HuaShu found in DeepSeek Harness. On my stack, nearly three quarters of the first request existed before the project and plugin layers were added.

## Thesis

An agent's first request is an architecture bill, not a conversation bill: caching can discount repeated input but cannot remove its context footprint, so the number worth optimizing is cache-adjusted input per successful completed task, not prompt length or boot tokens alone.

## Personal Anchor

Aaron's 2026-08-16 Codex CLI ablation: same model, reasoning effort, one-line prompt, no tool calls, and ephemeral session across an empty directory, Aaron Studio with plugins disabled, and the full Aaron Studio stack. Five full runs establish the median and range; stable plugin-disabled controls isolate workspace and plugin/app increments.

## Reader Movement

Concrete receipt -> unexpected layer decomposition -> DeepSeek comparison -> two different cost ledgers -> eager versus deferred capability architecture -> credible objection -> completed-task operating rule.

## Outline

### 1. One word out, 17,606 tokens in

- Open with the exact prompt, response, model/CLI/date, and three-line receipt within the first 120 words.
- Clarify the unit: input tokens reported by the CLI, not a dollar invoice and not total run cost.
- State the original judgment early: the user's prompt is the smallest actor in the first request; the harness has already chosen most of the bill.
- Personal beat: Aaron expected his accumulated skills to be the culprit. The ablation changed that view.

### 2. The largest line item was the agent itself

- Explain the controlled experiment in plain language, not as a methodology appendix: same one-line task, then remove one architectural layer at a time.
- Present the full five-run range (16,738-17,755) and median (17,606); explain stable 12,867 and 15,813 controls.
- Translate the result: core 73.1%, workspace 16.7%, plugin/app 10.2%.
- Do not pretend to know every token inside the core. Name only what the control can support: core harness/protocol/core tools/runtime plus the tiny prompt.
- Strategic implication: capability catalogs matter, but the default agent product surface can be the larger fixed cost. “Disable a few skills” is too shallow an answer.

### 3. DeepSeek's receipt looked different — and that is the point

- Bring in HuaShu's DSH rc.6 differential weighing, pinned to 2026-08-13 and commit `47f9438`.
- Itemize 13,838 uncached input: tools 6,510; 57-skill catalog 6,242; system 844; runtime 129; protocol 82; question 29. Entry fee excluding the question: 13,809.
- Preserve the measurement caveat: component sum differs by two tokens; the ~7,600 no-skill baseline was subtraction, not a clean-machine run.
- Contrast, do not rank: DSH's skills were 45%; Aaron's plugin/app layer was about 10%. There is no universal “agent overhead” number. Harness assembly policy determines what becomes fixed.
- Carry forward the prior article: the same model can behave differently under another harness; now the same asset catalog can also have a different cost shape.

### 4. One request creates two bills

- Define the two accounts:
  - **Context footprint:** every token occupying the request and the model's attention budget.
  - **Marginal input bill:** cache miss/write/read after provider policy and prefix reuse.
- Use Aaron's observation: fresh CLI trials reported cached input of 0, 5,888, or 9,984. Therefore one cache-hit screenshot is not an architecture measurement.
- Use DeepSeek official mechanics and HuaShu's cross-process 13,824/13,838 hit as the contrasting case; explain complete prefix units and best-effort persistence.
- Use OpenAI's exact-prefix rule to connect cache eligibility back to harness assembly; static instructions/tools first, variable data later.
- Use Anthropic's explicit wording: prompt caching reduces what you pay for repeated tool definitions, but it does not reduce how many tokens sit in context. If useful, mention 1.25x five-minute write and 0.1x read to show why first write and subsequent read are different transactions.
- Land the section: cache hit is a billing optimization. It is not a cure for context bloat.

### 5. Moving a tool definition is not removing it

- Use DSH PTC/Code mode as the hard counterexample: the visible tool parameter list shrank, but the 25 tool definitions moved into generated TypeScript/system text; first input rose about 9%.
- Keep the performance result bounded to one sentence: in one three-small-files run, PTC was dramatically slower and produced far more output because there were almost no large intermediate results to hide. Do not headline 14x.
- Mechanism: programmatic calling can save repeated intermediate tool results; it does not automatically erase the fixed capability description.
- Operator lesson: inspect the rendered request/usage, not the UI count of tools or the marketing label “code mode.”

### 6. The real architectural move is to stop loading the menu

- Scale from the personal stack to Anthropic's official multi-server example: GitHub + Slack + Sentry + Grafana + Splunk can consume about 55k tokens in tool definitions before work begins.
- Show the second problem: tool choice degrades above roughly 30-50 available tools. This makes eager loading a product-quality problem, not only a cost problem.
- Explain deferred loading/tool search: start with one search surface, load only 3-5 relevant tools; Anthropic says this typically reduces upfront definitions by 85%+.
- State the boundary in the same paragraph: fewer than ten small, frequently used tools may be better eagerly loaded; discovery adds a round trip and latency.
- Preserve Aaron's asset thesis: skills remain owned, portable assets. The design question is delivery — default context or on-demand retrieval — not whether the skill should exist.

### 7. Optimize completed work, not an empty hello

- State the strongest objection: a 17k first request might be cheap if it prevents retries and raises success; a 5k request might be expensive if it fails twice.
- Accept it and change the denominator. Count:
  1. gross boot footprint;
  2. cached versus uncached share;
  3. fresh sessions created per successful task.
- One-line equation, framed as Aaron's operating rule rather than universal finance model:

  `entry cost per successful task ≈ fresh sessions × cache-adjusted first-request input / success rate`

- Give the reader a concrete audit:
  - Run a one-word/no-tool first request and save usage.
  - Disable workspace and plugin/MCP layers one at a time.
  - Report gross, cached, and uncached input separately.
  - Test deferred loading when tool definitions become five figures or selection becomes noisy.
  - Keep eager context only when it improves success or removes downstream work.
- End by returning to the opening: the 17,606-token “OK” was not evidence that Codex was wasteful; it was an X-ray of the operating system Aaron had chosen to start. The new rule is that every default capability must prove why it belongs in every first request.
- Series CTA: next piece applies another DSH invariant in Aaron's stack rather than only describing it.

## Visual Ideas

- **Cover:** A narrow receipt printer produces a long three-line bill before a tiny green `OK` card can exit; industrial, precise, no dashboard collage.
- **Inline 1 — measured stack:** One stacked horizontal bar with exact segments 12,867 / 2,946 / 1,793 and percentages; label it as Aaron's 2026-08-16 stack.
- **Inline 2 — two bills:** Same 17,606-token block shown twice: once as full context footprint, once split into miss/read/write pricing states. The visual must make clear that caching changes color/price, not block length.
- **Inline 3 — eager vs deferred:** A wall of ~55k tool schemas on the left; one search gate selecting 3-5 tools on the right. Include the small-toolset exception in a caption, not the diagram.
- Avoid decorative personal blog/video imagery; every visual must carry a quantitative or architectural relationship.

## Distribution Plan

- **Blog:** Full experiment, receipts, provider mechanisms, counterargument, and audit rule.
- **X:** Lead with the three-line 17,606-token receipt. Follow with the surprise that core harness, not Aaron's skills, was the largest layer. Put the blog link in a self-reply as the current experiment.
- **Newsletter / LinkedIn:** “Your prompt is not the request” as the hook; summarize footprint vs marginal bill and link to the reproducible protocol.
- **YouTube:** 5-7 minute visual teardown built around the receipt, ablation, two-bill diagram, and 55k-tool case. Must use the current `aaron-video-gen` visual contract, not legacy video style.

## Drafting Locks

- Keep `17,606` only if the publication-day rerun supports it; otherwise update title, opening, table, and percentages together.
- Do not turn the article into OpenAI-versus-Anthropic-versus-DeepSeek pricing comparison.
- Do not call installed plugins “skills” in Aaron's experiment unless separately measured.
- Do not claim every subagent pays an identical fee; use “fresh sessions” and state that inheritance differs by harness.
- Do not recommend minimizing tokens without the success-rate denominator.

## Open Questions

No question blocks drafting. Publication requires a fresh rerun and current cache/pricing verification.
