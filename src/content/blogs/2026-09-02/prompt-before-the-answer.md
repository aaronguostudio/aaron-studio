---
title: "Learning DeepSeek Harness: What Happens Before a Prompt Becomes an Answer?"
date: 2026-09-02
slug: prompt-before-the-answer
category: ai-native-systems
tags: [deepseek-harness, coding-agents, prompt-caching, compaction]
cover: imgs/web/00-cover-v1.webp
draft: true
---

# Learning DeepSeek Harness: What Happens Before a Prompt Becomes an Answer?

![A shipping incident passes through the hidden harness toolchain and emerges as a verified answer](imgs/web/00-cover-v1.webp)

I wanted to see how DeepSeek Harness actually differs from Codex, Claude Code, and Grok.

So I gave all four the same checkout incident: a Canadian order worth $79.99 should have been charged $12.99 shipping. Instead, it received free shipping.

The bug was here:

```js
return order.subtotalCents >= rule.freeShippingThresholdDollars
  ? 0
  : rule.baseRateCents
```

The order contains `7999` cents. The config contains `80` dollars. The direct comparison says `7999 >= 80`, so shipping becomes free.

The targeted test made the failure unambiguous:

```text
✖ INC-2047 charges shipping below the Alberta free-shipping threshold

AssertionError: Expected values to be strictly equal:
0 !== 1299

tests 1  pass 0  fail 1
```

The task was still small, but it required incident search, fixture and config reads, and one targeted test. I asked every agent to remain read-only, run that test once, then report the root cause, smallest fix, regression risk, and tool sequence.

All four got the diagnosis right. How they reached it was more revealing.

## Turn one: what they actually called

| Harness | Sequence observed in this run |
|---|---|
| Codex | code graph/discovery → incident search → symbol lookup → source read → targeted test → threshold search → config and fixture reads |
| Claude Code | workspace inventory → fixture, source, config, test, and README reads → targeted test |
| Grok | directory list → incident/fixture search → six file reads → targeted test |
| DeepSeek Harness | directory/file discovery → source, config, fixture, and test reads → targeted test → conclusion |

![The first-turn tool traces left by four harnesses](imgs/web/01-tool-sequences-v1.webp)

Claude and DSH are easy to flatten into the same story: both read files and ran a test. The difference is not the `read` call. It is who assembles the agent.

Claude Code is an opinionated product runtime. Global rules, permission mode, tools, and automatic context management arrive as a working system. I explicitly used plan mode here, so that governance was part of the route from the start.

DSH is closer to a box of separable parts. Model routing, tools, safety, session persistence, and compaction are explicit composition points. That does not make it lighter or smarter. It makes a different question possible: what was mounted for this run, which events became durable, and how can the loop be replayed?

On my machine, Codex reached for its configured code graph before discovering how small the repository was. That looks heavy for three files and sensible for a real codebase. Grok stayed closest to a conventional terminal rhythm: list, search, read.

The first turn therefore exposed four defaults: map the repository, carry the governance environment, gather evidence with ordinary file tools, or make the whole agent loop a composable and replayable object.

## The prompt does not go straight to the model

Before the first model call, the harness decides:

- which system and repository instructions to include;
- which tool schemas to load immediately;
- which capabilities remain deferred;
- which permission mode and session state apply.

After that call, it owns the loop: execute tools, return results to the model, record state, and continue until a final answer appears.

The same visible prompt is therefore not the same request inside four products. The harness is the layer between the input box and the answer.

## Turn two: remembering is not a cache hit

A first-turn test misses the main reason prompt caches exist: later conversation.

In the same session, I asked each product not to rerun the test or reread unchanged files. It had to compare converting the config to cents with multiplying by 100 at the comparison boundary, then name one regression test.

| Harness | New tool calls | Follow-up | Product-reported cache fields |
|---|---:|---|---|
| Codex | 0 | Reused evidence and preferred the comparison-code fix | `cached_input_tokens: 41,728` |
| Claude Code | 0 | Reused evidence and proposed a BC boundary case | `cache_read: 15,903`; `cache_creation: 24,104` |
| Grok | 0 | Reused evidence correctly | `cache_read_input_tokens: 0` |
| DSH + local Qwen | 0 | The session admitted turn two, but the local model reached its 1,536-token output cap without final text | The Ollama route exposed no cache read/write counters |

![Turn two: session, cache, and outcome are separate receipts](imgs/web/02-follow-up-receipts-v1.webp)

This produced a more useful result than a token leaderboard:

> A resumed session does not imply a provider cache hit.

Grok retained enough prior evidence to answer without tools while reporting zero cache-read tokens. A product can reconstruct conversation from its own session store and send it as fresh model input. Reusing product state and reusing a provider-side prefix are separate mechanisms.

Claude's receipt showed both cache reads and cache creation. Part of the stable prefix was reused while a newer suffix was written. A warm conversation is not a binary hit-or-miss state.

I am not comparing the raw totals. The products have different accounting boundaries, Claude's stream may aggregate several internal model iterations, and DSH used a local Ollama route. The fields answer a narrower question: did this product report reuse in this turn, and at which layer?

## Cache and compaction pull in opposite directions

A prompt cache preserves an identical prefix so processing it again can be cheaper.

Compaction removes old tool output or rewrites history as a summary when the conversation grows too large. It trades exact history for room to continue.

A long-running agent eventually has to decide when to keep reusing an exact but heavy past, and when to replace it with a smaller, lossy state.

| Harness | Compaction mechanism | What remains inspectable |
|---|---|---|
| Codex | automatic threshold plus manual compact operation; the Responses API can return an opaque encrypted compaction item | controls and events are visible, while the compacted item is designed for continuation rather than human review |
| Claude Code | clears older tool output, then summarizes history; root instructions and auto-memory are re-injected, while some path-scoped context must be read again | the clearest documented survival rules of the four |
| Grok | exposes `/context`, `/compact`, and `/resume` | explicit user control, but less public detail about what survives |
| DSH | calculates model-specific pressure, can prune tool results, retains a configured tail, summarizes a selected span, and checkpoints the replacement | threshold, retained tail, summary route, usage, and session events are composition points |

Codex's compaction controls and events appear in its official [config schema](https://github.com/openai/codex/blob/main/codex-rs/core/config.schema.json) and [app-server documentation](https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md). OpenAI describes the compacted Responses result as an opaque encrypted item for continued reasoning, not an ordinary human-readable summary. [Responses compact reference](https://developers.openai.com/api/reference/java/resources/responses/methods/compact)

Claude Code documents that automatic compaction clears old tool output before summarizing history. Root `CLAUDE.md` and auto-memory return; some path-scoped rules return only after the relevant file is read again. [Claude Code context-window documentation](https://code.claude.com/docs/en/context-window) That is operationally useful because it tells you what to re-verify after compaction.

Grok Build exposes [`/context`, `/compact`, and `/resume`](https://docs.x.ai/build/modes-and-commands), though its public guide focuses more on the controls than a detailed survival contract.

DSH is especially useful to study because compaction itself can be opened up. In source revision `141eb6fef834`, `BasicCompactionEngine`:

1. derives a threshold from the target model's context window;
2. optionally prunes tool results first;
3. selects an older span while retaining a configured tail;
4. uses a configurable provider and model to summarize it, marking the request purpose as `compaction`;
5. persists the replacement and usage, with bounded retries if the session remains too large.

Source inspection cannot prove that DSH produces better summaries. It does show how DSH turns compaction from a product behavior into an engineering component that can be configured, tested, and audited.

## Compare the transition between turns

After this experiment, I no longer think the right unit of harness comparison is one prompt—or even one request.

It is the state transition between turns:

```text
user prompt
  → harness adds rules, tools, and permissions
  → model selects tools
  → harness executes and records evidence
  → session persists state
  → provider may reuse a stable prefix
  → compaction decides what survives when history no longer fits
```

When the next answer goes wrong, I want five receipts:

1. What entered at the start?
2. What was discovered through tools?
3. What did the provider cache actually reuse?
4. What did the product persist?
5. What did compaction remove or summarize?

We often collapse all five into one word: context. Their failure modes are different.

A wrong tool is a discovery problem. Rereading unchanged files may be a session problem. A healthy session with a cache miss is an economics problem. Forgetting an early constraint after summarization is a compaction problem.

DSH makes those decisions unusually inspectable. Its open agent runtime exposes what enters, survives, gets reused, and is eventually allowed to disappear.

The $12.99 shipping mistake needed a one-line repair. The experiment changed a larger habit.

My operating rule now is simple: before I trust a long-running harness, I look for those five receipts. If I cannot tell what entered, what was discovered, what was cached, what persisted, and what compaction erased, then a correct first answer tells me less than I thought.

---

*Method: one read-only first turn and one same-session follow-up per product on 2026-08-23. Models, defaults, and accounting boundaries differed, so no intelligence, speed, price, or total-token ranking is supported. The adjacent field note records the full protocol and limits.*
