---
title: "Your Prompt Is Not the Request"
date: 2026-09-02
slug: your-prompt-is-not-the-request
category: ai-native-systems
tags: [agent-harness, prompt-caching, coding-agents, tool-context]
draft: true
---

# Your Prompt Is Not the Request

I asked three coding agents the least interesting question I could think of:

> Reply with exactly: OK. Do not use tools.

Codex CLI, Claude Code, and Grok Build all did it. No tool-call event appeared. Each returned the tiny answer I asked for.

Then I looked at the receipts.

Codex reported `input_tokens`, `cached_input_tokens`, and `cache_write_input_tokens`. Claude Code reported `input_tokens` alongside `cache_creation_input_tokens` and `cache_read_input_tokens`. Grok Build exposed another cache-shaped receipt, but through a different product path and a different model.

That sounds like a bookkeeping detail. It isn't.

I had started this as the follow-up to my [DeepSeek Harness teardown](/blogs/deepseek-harness-teardown): measure the first-request “entry fee” in a few popular coding agents and see who was carrying the heaviest backpack. Instead, the first useful result was more awkward. The three receipts could not honestly be put into one ranking.

Even `input_tokens` was not a universal noun.

That is not a failure of the experiment. It is the experiment. The prompt I typed was the same. The request each product assembled before the model saw it was not. A coding agent has already made a long list of architectural decisions before you write the first line of work.

Here is the only comparison table I think the calibration has earned so far:

| Product | What the local calibration made visible | What I refuse to infer from it |
|---|---|---|
| DSH | A named default assembly of agent, instructions, tools, skills, persistence, and safety policy | A live first-request token total; no model request was sent |
| Codex CLI | Input, cached-input, and cache-write fields in a JSON receipt | That cached and cache-write fields are extra prompt size to add together |
| Claude Code | Input, cache-creation, and cache-read fields; a personal-default surface can survive an empty directory | That this one event is a whole-product cost ledger |
| Grok Build | Input and cache fields remain visible even after a restricted no-tool run | That disabling web search and subagents creates a true minimal agent |

It is not a leaderboard. It is a map of what each product lets an operator see.

## DeepSeek made the backpack inspectable

DeepSeek Harness is a good entry point because it makes that assembly unusually visible.

In the local headless configuration I inspected, the default agent is not a single black box. It is a composition: a model route, session persistence, safety policy, tools, filesystem search, instruction loading, skills, compaction, goals, and more. The configuration names the pieces and the order they are mounted. It also states where session records live and what permission mode is in force.

That does **not** tell us the live token bill. I did not send a live DSH request: this machine had no headless profile, and I was not going to create, copy, or inspect credentials just to fill a comparison cell. But the isolated config dump did make one important fact concrete. Before DSH can answer a task, it must decide what kind of agent exists, what it can touch, what it remembers, and what the model is allowed to see.

Every serious harness does this. DSH simply makes it easier to point at the backpack.

That distinction matters because the market often talks as if a prompt travels directly from a human hand into a model. In practice, the prompt joins an envelope already packed by the harness: policy, instructions, tool definitions, skills, workspace knowledge, history, and sometimes a whole connector ecosystem.

The model is not responding to your sentence alone. It is responding to the operating environment that arrived with it.

## An empty directory is not an empty agent

To make that visible, I ran a deliberately narrow calibration. Each installed product received the same no-tool instruction in a new empty temporary directory, with the most restrictive safe mode the CLI exposed. The goal was not to measure intelligence, latency, or price. It was to see what remained when there was no repository to read.

The answer was: quite a lot can remain.

Codex has a useful minimal direction: ignore user config and rules, then disable plugin and app surfaces. In one current calibration, that was visibly leaner than my daily personal-default setup. But it was still a functioning coding agent with a read-only policy and a non-trivial request envelope. The correct conclusion is not that the remaining tokens are “system prompt.” They include an unitemized mix of harness protocol, built-in capability, runtime context, and the tiny request itself.

Claude Code made the boundary sharper. Its personal-default probe started in an empty directory, yet its startup trace still initialized globally configured hooks, skills, plugins, and a tool/connector surface. I am not publishing that private list or pretending its count is a universal fact. The public lesson is simpler: changing folders does not necessarily remove what your agent carries from home.

I then tried Claude's true bare mode. It refused to use the existing OAuth/keychain path by design and required an API-key route instead. That is a good example of why a fair benchmark needs the humility to say `not run`. A zero-token pre-authentication failure is not a minimal agent result. And silently reaching for another credential would make the experiment less clean, not more.

Grok Build landed in the same broad category. I disabled web search and subagents, set plan permission, and capped it at one turn. The one-word task completed without a tool call. Its startup still showed a default global capability surface. Disabling one visible ability did not prove the rest of the backpack had disappeared.

This is the first operator rule I am taking from the exercise:

> An empty project is not the same thing as an empty agent.

That sounds obvious once stated. It is easy to forget when a product's customization lives across user config, extensions, shared skills, connectors, desktop state, and a repo. Most “prompt tests” change only the smallest part of that system.

## A cache hit is a cheaper reread, not a smaller bag

The receipts created a second trap. It is tempting to see cached tokens and conclude that the agent has become small. It has not.

Take OpenAI's documented Responses API shape. `cached_tokens` appears inside the input-token breakdown: it tells you how much of the input was reused, not that the input was absent. OpenAI also exposes cache-write tokens, which are another reason not to add every cache number together and call the sum a prompt size. [The reference is explicit about the separate usage fields and cache controls.](https://developers.openai.com/api/reference/cli/resources/responses/methods/create)

Anthropic makes the distinction from the other direction. Its API usage accounting treats uncached input, cache creation, and cache reads as separate parts of input when caching is used. That helps explain why Claude Code can emit all three kinds of numbers. It still does not prove that one CLI event is a complete accounting of every internal operation the product performed, so the local result stays a calibration rather than a league table. [Anthropic's pricing documentation defines that accounting relationship.](https://docs.anthropic.com/en/docs/about-claude/pricing)

The architecture point survives the caveat: cache reuse changes the marginal cost of rereading a stable prefix. It does not make the prefix disappear from the model's context. The model still has the tools, instructions, and history to process as part of its working environment.

DeepSeek says the same thing in its own idiom. Context caching is on by default, matches complete prefix units, exposes hit and miss usage, and remains best effort because entries can be evicted. [Its documentation is refreshingly direct about all four.](https://api-docs.deepseek.com/guides/kv_cache) The provider holds the cache; the harness decides whether it keeps sending an identical enough prefix to use it.

xAI's guidance has the same shape: caching works from the start of the message list, and a stable conversation ID or prompt cache key makes a hit more likely. Change, remove, or reorder an earlier message and the reuse boundary moves. [That is a prefix rule, not a magic discount switch.](https://docs.x.ai/developers/advanced-api-usage/prompt-caching/multi-turn)

So there are two questions, not one:

- How much capability did the agent carry into the request?
- How much of that capability could it reread cheaply this time?

One is a context and selection problem. The other is an economics problem. Mixing them produces very confident nonsense.

## The real move is sometimes to leave the menu outside

If caching is not the same as shrinking context, what does shrink the initial request?

Sometimes: not loading the capability yet.

Anthropic's tool-search documentation gives the clearest public example. A multi-server setup can put roughly 55,000 tokens of tool definitions in context before work begins. Tool search starts with a small search surface, then brings in only the handful of tool definitions that match the task. Anthropic says this can reduce the up-front definition load by more than 85% in its typical example. [The same guide is careful about the trade: discovery adds a step, and small frequently used toolsets may be better loaded eagerly.](https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context)

This is a different architectural move from prompt caching.

Caching says: “You will reread this menu, but the kitchen may remember it.”

Deferred discovery says: “Do not bring the whole menu to the table.”

That difference is why tool counts in a UI are such a weak proxy for model context. A harness can show one visible tool while injecting a large generated interface elsewhere. It can show fifty installed tools while loading three only when a task calls for them. It can cache a huge fixed catalog brilliantly and still make tool selection noisier than it needs to be.

The right design is not “always minimal.” A coding agent that never sees the repository rule that prevents a destructive change is not efficient; it is under-equipped. A product team that loads its five common internal tools up front may be making a sensible latency trade.

The decision is more practical: keep a capability in the default envelope only when it reliably improves completed work enough to justify arriving on every task. Everything else is a candidate for discovery.

## A fair comparison needs four separate tests

The hardest thing here is resisting a clean spreadsheet too early.

I originally imagined one column called “first prompt tokens,” a row for each harness, and a winner. The calibration killed that format. The products expose different raw fields, run different model routes, and draw their boundaries in different places. A single number would look scientific while erasing the mechanism we are trying to understand.

The test bench now has four distinct questions:

1. **What follows a fresh task by default?** Run a no-tool first turn in a dedicated empty workspace. Preserve the product's raw field names.
2. **What can arrive later?** Use a documented minimal, bare, or extension-disabled mode where it exists. If it changes authentication or cannot be isolated, say so.
3. **What can be reused?** Separate a continued session from a fresh process. Cache reuse across those two cases is not the same claim.
4. **What cannot be observed honestly?** Mark it opaque. A missing counter is not an invitation to reverse-engineer a story from one run.

That third line is especially important. An ephemeral Codex run and a no-session-persistence Claude run are good clean first-turn tests precisely because they cannot resume. A continued-session test needs product persistence and an explicitly selected session ID. That belongs in a separate stateful cohort, not smuggled into a supposedly disposable benchmark. DSH is unusual here because its headless session store can be redirected into a temporary home; other products keep resumable state in their own product stores.

The full benchmark will require five serial first-turn samples for any eligible cohort, and a separate, labelled continuation test. That is slower than filling a table today. It is also the difference between a field note and an unsupported vendor comparison.

## Before you rewrite a prompt, audit the room

The useful outcome of this work is not a verdict on Codex, Claude, Grok, or DSH. I use all of them for different jobs. It is a small audit I now want before arguing about prompt quality:

1. What rules, tools, skills, connectors, and workspace instructions follow every task into the room?
2. Which of those can be discovered only when the work makes them relevant?
3. Which parts of the stable prefix are actually being reused, and what breaks the reuse?
4. What is opaque enough that I should stop claiming to measure it?

There is a sensible objection: a larger default envelope can prevent bad decisions, avoid retries, and improve task completion. Absolutely. The target is not the smallest possible request. The target is a visible trade: enough capability to finish safely, no habitual luggage that cannot earn its seat.

DeepSeek Harness remains the reason I started looking. It made the hidden assembly process feel inspectable rather than mystical. But the broader lesson travels well: before comparing prompts, compare what your agent has already decided to carry.

Your prompt is the last thing that entered the room.

---

*This is a work-in-progress field note in the DeepSeek Harness series. I will publish the replicated four-harness receipts only after the raw fields and cohort boundaries can survive a fair comparison.*
