---
title: "Every Coding Agent Makes Four Decisions Before You Ask Anything"
date: 2026-09-02
slug: coding-agent-default-decisions
category: ai-native-systems
tags: [agent-harness, coding-agents, prompt-caching, deepseek-harness]
draft: true
---

# Every Coding Agent Makes Four Decisions Before You Ask Anything

I gave four coding agents the same job: find a one-line bug in an eleven-line file, run the test once, and do not touch the code.

The bug was embarrassingly small. A function called `finalPrice(10_000, 20)` returned `2_000`; it had calculated the discount rather than the price after the discount. Every agent found it. Every agent proposed the same repair.

So this is not a story about which model is smartest.

It is a story about what happened before the answer. One agent started by reaching for a code graph. One arrived with a roomful of global machinery and a plan-mode contract. One took a quick inventory, then gathered evidence in parallel. DeepSeek Harness (DSH) laid down a replayable trail: list, locate, test, read, conclude.

The visible answer was the same. The operating system around it was not.

That is the part of coding agents we still talk about too casually. We say “write a better prompt,” as if the prompt enters an empty room. It doesn’t. Before you type anything, the harness has already made four decisions for you:

1. What will it **carry** into this task?
2. What will it **discover** only when needed?
3. What will it **reuse** cheaply next time?
4. What will it **persist** after the task ends?

Those decisions explain more of the experience than the first sentence you type.

## The smallest bug is a good x-ray

Big repository tasks hide the harness. There are too many legitimate reasons to read lots of files, use search, start subagents, or call an external service. A tiny bug is less forgiving. It forces the question: what does the agent do when there is almost nothing to do?

My fixture had a package manifest, one source file, and one test. The instruction was deliberately narrow: run the test once, inspect only what is necessary, make no edits, answer in under 90 words. I used the locally installed Codex CLI, Claude Code, Grok Build, and DSH.

All four diagnoses were right. Their first moves were the interesting part.

| Harness | What I saw in one controlled local run | The default it revealed |
|---|---|---|
| Codex | It reached for configured code discovery before settling the tiny failure. | Bring an engineering environment that is ready for a real repository. |
| Claude Code | Its configured runtime and plan-mode rules were already part of the route through a three-file task. | Bring the operating context and governance with you. |
| Grok Build | It oriented itself, then ran the test while reading the two relevant files in parallel. | Keep orientation brief; gather independent evidence concurrently. |
| DSH | It made its tool contract and session steps visible: locate, test, inspect, conclude. | Make the assembled agent and its history inspectable. |

This is a portrait, not a leaderboard. The installed versions, models, permissions, and personal defaults were different. It tells us nothing honest about universal quality, latency, or price. But it does show something practical: “the agent” is not just a model plus tools. It is a policy for when to commit context, capability, and state.

## 1. Carry: what is already in the room?

Codex gave me the clearest image. For a three-file bug, its first instinct touched the configured code-discovery surface. It was not being foolish. A daily coding environment should be prepared to understand a large repository, trace ownership, and connect a task to its surrounding system. That preparedness is useful on a real job.

It is also a choice. General readiness means some amount of system instruction, tools, project knowledge, rules, and safety policy are already in the room when the user asks a tiny question.

Claude made the same truth visible from another angle. A coding agent can enter an empty folder while still carrying home with it: global hooks, skills, plugins, connector policy, and an interaction mode. In my run, plan mode was not a cosmetic switch. It shaped how the session thought about completion even though the task only required a diagnosis.

This is not criticism. A pilot’s checklist is not clutter just because the flight is short. It becomes clutter only when it cannot be inspected, bounded, or changed.

The operator question is therefore not “why does this agent have so much stuff?” It is:

> Which of these things must be present before it can safely begin, and which have merely become habitual luggage?

DSH is a useful entrance to this question because its answer is unusually concrete. The agent is an assembled profile: model route, instructions, tools, session storage, safety policy, and plugins. You can see the pieces. In a local read-only run, I could also see the loop they produced: first orient, then find files, then test, then read the two relevant files.

That visibility is not the same thing as being light. It is better: it gives you a place to have an argument with the weight.

## 2. Discover: what should stay outside until it matters?

Grok’s run had the tidiest rhythm: list the directory, read the manifest, then run the test and read source plus test together. For this small job, that was enough. It did not need an elaborate project map to know where to look.

This is the principle behind lazy capability loading. Do not put every possible tool, skill, or repository summary in the opening context merely because it might become useful. Give the agent a way to find the right thing when the task proves it needs it.

The difference sounds minor, but it is architectural.

Prompt caching says: *we expect to reread this menu, so please make rereading cheaper.*

Deferred discovery says: *do not bring the whole menu to the table yet.*

Anthropic’s tool-search documentation is unusually explicit about the second move: it describes starting with a small search interface and loading matching tool definitions only when needed, rather than stuffing a large multi-server tool catalog into initial context. That can shrink the up-front tool-definition load materially, at the cost of an extra discovery step. [Anthropic’s guide makes both the benefit and trade-off clear.](https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context)

The lesson travels beyond Claude. A tool count in a UI does not tell you what the model received. Fifty installed integrations could mean a chaotic first request—or a clean, searchable catalog. One visible “tool” could conceal a huge generated interface. We need to ask when the definition enters, not merely whether the logo appears in a sidebar.

## 3. Reuse: a cache hit is not a smaller backpack

This is where comparisons become misleading fastest.

In the same local experiments, Codex, Claude, and Grok all surfaced cache-shaped usage fields—but they did not give them the same names or guarantee the same accounting boundary. That is why I am not publishing a fake token leaderboard. A counter with the word `cache` in it is not automatically a universal unit of prompt size, cost, or quality.

The reliable idea is simpler. A prompt cache makes a stable prefix cheaper to process again. It does not make that prefix disappear from the model’s working environment.

DeepSeek describes context caching as default, prefix-based, best-effort reuse with separate hit and miss usage. [Its documentation is direct about those constraints.](https://api-docs.deepseek.com/guides/kv_cache) xAI likewise describes caching from the beginning of the message list: alter an earlier message and the reusable boundary moves. [The same prefix rule appears in its API guide.](https://docs.x.ai/developers/advanced-api-usage/prompt-caching/multi-turn)

So the practical cache rule is boring but powerful: keep the stable parts actually stable. Don’t casually reorder a system prefix, regenerate an enormous tool schema, or put time-varying trivia above everything else if you expect repeated tasks to reuse context.

But do not confuse that with a context-design victory. A cached sixty-thousand-token toolbox may be cheap to reread and still be the wrong toolbox for a one-line bug. Caching improves the economics of carrying; discovery decides whether you carry it at all.

## 4. Persist: what becomes the next task’s invisible past?

The fourth decision is the least glamorous and, in practice, often the most consequential.

After one task ends, what remains? A transcript? A compacted summary? A repository index? A durable approval? A learned preference? Nothing at all?

DSH makes the question hard to ignore because the session record is part of the product’s shape. In my run, the record preserved the model route, permission preset, tool calls, results, and final response. That is valuable when you want to replay a strange behavior, audit why a command ran, or distinguish a model failure from a harness failure.

Other products make different bets. A fresh ephemeral run can be excellent for a narrow diagnosis. A persistent working session can be excellent for a long-lived codebase. Neither is universally correct. The danger is forgetting that persistence is a product decision before it is a user preference.

This is also where safety lives. A harness that remembers a broad approval, a connector, or an instruction can be wonderfully fluid tomorrow—and surprisingly powerful in a new context. The cleanest agents are not necessarily those that remember least. They are the ones that let you see what survived and revoke it deliberately.

## The useful way to compare harnesses

We keep trying to ask a consumer question: Which coding agent wins?

For an operator, the better question is four smaller ones:

| Before you enable it broadly, ask | Why it changes the experience |
|---|---|
| What does it carry by default? | This determines the first-request envelope, safety posture, and the amount of irrelevant capability competing for attention. |
| What can it discover lazily? | This determines whether large tool and knowledge surfaces arrive only for tasks that need them. |
| What can it reuse predictably? | This determines repeated-task cost and latency—but only if the prefix is stable. |
| What does it persist, and can I inspect it? | This determines debugging, governance, continuity, and surprise. |

These are not four scoring columns. They are four places to design your own operating model.

If you work in a large, regulated codebase, you may gladly pay for a harness that carries governance and leaves an auditable trail. If you are triaging small issues, you may prefer a tiny, disposable starting point. If your team has a huge tool ecosystem, lazy discovery may matter more than heroic caching. If work happens across days, persistence can be an advantage—provided the state has clear borders.

The point is not to make every agent minimal. It is to make the weight intentional.

## What I am taking from the DSH moment

DeepSeek Harness is still the best hook for this conversation—not because it secretly wins the comparison, but because it gives the most literal version of the question. A harness is a composition. You choose what is mounted, what is retained, what is permitted, and what can be replayed.

The others make the same choices, often with much better defaults for particular jobs. The mistake is treating those defaults as neutral plumbing.

Your prompt is only the visible tip of the request. The real prompt begins earlier, in the four choices the harness has already made: **carry, discover, reuse, persist**.

That is where the next generation of coding-agent craft will live—not in ever more ornate instructions, but in better arguments about what deserves to be present before the work begins.

---

*Method note: This essay is based on one read-only local run per installed harness, on the same tiny fixture, on 2026-08-23. It deliberately does not rank products, models, latency, costs, or token totals. See the private field note in the source repository for the bounded protocol and sanitized observations.*
