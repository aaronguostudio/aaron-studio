# Blog Plan: Your Prompt Is Not the Request

## Meta

- **Author:** Aaron Guo
- **Target:** aaronguo.com blog (EN + ZH bilingual)
- **Tone:** Entrepreneurial, crisp, curious, evidence-led; a field report rather than a vendor leaderboard or API manual.
- **Length:** 1,800-2,200 English words for the first publishable draft; a later evidence update may add the replicated receipt table.
- **Audience:** Builders and engineering/product leads who use coding agents daily and assume their typed prompt is the relevant unit of analysis.
- **CTA:** Newsletter — follow the DeepSeek Harness field notes and reproduce the four-question audit on one agent stack.
- **Growth hypothesis:** A concrete, counterintuitive opening and a reusable operator audit should produce deep-reader signal from AI-native builders. This deliberately applies the current growth lesson: open with a real operating bottleneck before introducing the framework.
- **Success metric:** 24-hour qualified reads and replies that include a reader's own receipt; 7-day newsletter conversions attributed to the article.

## Hook

I asked three installed coding agents to reply with one word and use no tools. All three did. The interesting difference arrived before the word: each returned a different kind of receipt. One treated cached input as a subset; another showed separate cache creation and cache reads; the third exposed a different cache field again. The first discovery was not a winner. It was that “input tokens” is not a universal noun.

## Thesis

Your prompt is not the request: a coding harness decides what capabilities arrive before the task, what it discovers later, and what it can reuse through caching — so the useful comparison is the harness's visible carrying strategy, not an unsupported token leaderboard.

## Personal Anchor

Aaron ran one read-only, no-tool calibration in an empty temporary directory against the locally installed Codex CLI, Claude Code, and Grok Build, then inspected DSH's isolated headless default configuration without starting a model request. The prompt was deliberately boring; the receipts were not. The exercise exposed a method problem before it produced a comparison number.

## Outline

### 1. I asked for `OK`; I got three incompatible receipts

- Open with the empty-directory test and one-word response.
- Use a small visual of three receipts, with field names rather than a value leaderboard.
- State the real tension early: the user prompt is identical, but the products do not agree on what “input” represents.
- Explain why this is interesting rather than embarrassing: it reveals where an agent product's architecture becomes visible.

### 2. DSH made the hidden backpack visible

- Use DeepSeek Harness as the topical lead and continuity from the prior post.
- Explain its composable default stack in human terms: an agent needs instructions, tools, skills, session persistence, safety rules, and an LLM route before it can work.
- DSH's contribution is inspectability: its headless default config makes the assembled backpack readable. Do not claim a live DSH token number from the config dump.
- Use the distinction from the prior article: provider stores cache; harness preserves or breaks the prefix.

### 3. Four products, four ways to carry ability

- Organize by architectural behavior, not one vendor per section:
  - **Carry it:** globally loaded default surfaces can still exist in an empty project. Codex, Claude Code, and Grok Build calibration traces each provide a bounded observation.
  - **Find it later:** Anthropic's official tool-search architecture is the cleanest public example of deferred definitions. It is an API mechanism, not a claim that Claude Code automatically enables it.
  - **Read it cheaply:** DeepSeek, OpenAI, Anthropic, and xAI all document prefix-based cache reuse in provider-specific forms. Cache is an economic change, not automatic context reduction.
  - **Resume it somewhere:** H2 continuation must be labelled separately from a clean ephemeral run. The current products have different persistence boundaries.
- Include one compact table that says `observed`, `documented API behavior`, or `not derivable` rather than pretending all cells are comparable.

### 4. The trap: confusing a cheaper reread with a smaller backpack

- Explain that a cache hit reduces marginal processing/billing under provider rules while the prompt's content remains part of the model context.
- Use Anthropic's distinction between tool search and caching to make it tangible: discovery can reduce initial definitions; caching can reduce the repeat cost of definitions already there.
- Explain why moving tool descriptions to code/system scaffolding does not automatically remove them; the rendered request is what matters.

### 5. A fair test has to be stranger than a spreadsheet

- Show the unexpectedly useful calibration result: test design is the story.
- Preserve raw field names first. Do not add unlike cache fields. Separate personal-default, minimal, ephemeral, and stateful cohorts.
- Explain the Claude `--bare` finding without implying product failure: a truly minimal mode changes its auth boundary, so “not run” is an honest result.
- Establish next evidence threshold: five serial no-tool H1 samples for an eligible cohort; H2 separately, with explicit session persistence and IDs kept private.

### 6. The four questions I will keep asking every agent

- Present the reusable audit in plain language:
  1. What follows every task in by default?
  2. What can be found only when it becomes relevant?
  3. What part of a stable prefix gets reused, and what breaks it?
  4. What is opaque enough that I should stop pretending to measure it?
- Counterargument: more defaults can make an agent more successful. Agree. The point is not minimum context; it is making the trade visible and tying it to completed work.
- End with the new reader perception: before arguing about prompts, audit what already entered the room.

## Visual Ideas

- **Cover:** Four carry-on bags at an airport X-ray; each contains a different mix of folded instruction cards, tool shapes, a cache stamp, and a tiny `OK` ticket. Editorial, precise, no product logos.
- **Inline 1:** Four compact receipts whose headers preserve each product's raw field naming. A clear footer: “raw receipts, not a leaderboard.”
- **Inline 2:** Two paths: “carry every tool” versus “search, then carry 3–5”; the cache stamp re-prices the first path but does not shrink the bag.
- **Inline 3:** Session timeline: clean H1 -> stateful H2 -> new-process H3, with the instruction “these are different tests.”

## Distribution Plan

- **Blog:** Field report and method, using DSH as the hook and four products as evidence of a general architecture problem.
- **X:** `I asked three coding agents for “OK.” The first thing I learned: input_tokens is not a universal noun.` Then show raw receipt labels; link in self-reply.
- **Newsletter / LinkedIn:** “Your prompt is not the request” with the carry/discover/reuse audit as the practical takeaway.
- **YouTube:** A 5-minute visual desk test: one word, three receipts, four bags, one fair-comparison rule. It should show the method limitations as part of the story, not hide them.

## Open Questions

- A replicated H1 receipt table is not yet publication-ready; the article must label the present samples as calibration until five serial eligible samples exist.
- DSH requires an explicitly approved isolated provider-auth path before a live H1. Do not create, copy, or inspect credentials merely to fill that cell.
