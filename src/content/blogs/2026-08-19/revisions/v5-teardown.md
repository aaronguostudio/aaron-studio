---
title: "I Tore Down DeepSeek's Harness"
date: 2026-08-19
slug: deepseek-harness-teardown
category: ai-native-systems
tags: [ai-agent-harness, deepseek, agent-architecture, ai-strategy]
---

# I Tore Down DeepSeek's Harness

You've probably seen the headlines. DeepSeek open-sourced its agent harness on August 13 — MIT license, the same day V4-Pro went GA — and it collected tens of thousands of GitHub stars within hours. Two days earlier, [Composio had published an experiment](https://composio.dev/content/best-agent-harness-deepseek-v4-flash) showing that the same model, run through eight different harnesses on thirty real workflows, swings from 46.7% to 66.7% success and 7x in cost per completed task. Harness matters, model company ships harness, big story. That part everyone has written.

What I couldn't find anywhere was an answer to the question that actually matters if you build with agents: what's inside the thing? So I spent the week inside the repo. I ran fourteen analysis agents over the source tree, pinned at commit 47f9438, and checked a few hundred claims file by file. In June I wrote that [the unit of AI work had shifted from a response to a run](/blogs/fable-5-managing-ai-autonomy), and that the scarce skill was designing the operating contract around a run — this repo is the first chance to read one vendor's complete contract, end to end, in public.

Four things inside genuinely changed how I think about agent systems. None of them are in the launch coverage.

## The model is only allowed to see what's in the log

Every DeepSeek Harness session is an append-only event log. The repo defines 44 event types — turn boundaries, tool calls, approvals, config changes — and exactly 3 of them are visible to the model: your messages, its messages, and tool results. Everything else is bookkeeping for humans and audits.

Here's the part that stopped me. The conversation the model sees is not stored anywhere. It's recomputed from the log before every single request. And the rule "anything the model sees must be reconstructable from the log" isn't a line in the docs — it's a runtime check. A watchdog plugin recomputes the projection from the log before each LLM call and compares it, byte for byte, against what's about to be sent. If they don't match, the request is refused.

Think about what that buys. Every builder I know has hit the un-debuggable moment: the agent did something bizarre and there is no way to know what context it actually received. In this design, that question always has an exact answer. Session fork, resume, and replay stop being features — they're three ways of reading the same log. Cost accounting comes free, because token usage is stamped onto the same events. Even their test system rides on it: record one real session, and the log itself becomes a deterministic replay script — no API key needed in CI, with real tools and real subprocesses running.

The bill for this is real, and DeepSeek paid it knowingly. A persistent code-execution kernel — where the model's program keeps variables alive across calls — would be faster and cheaper, and the repo's design notes show they rejected it because cross-call state can't be rebuilt from the log. Anthropic added exactly that feature to its code execution API. The two companies looked at the same trade and walked in opposite directions: one bet on performance, one bet on reconstructability. And the log only ever grows — compaction masks old context from the model but deletes nothing, so it saves tokens, never disk.

This is the one design from the repo I'd copy tomorrow, even in miniature: before each request, assert that your outgoing context matches what your own records say it should be. Five lines, and silent context drift becomes a loud crash in development instead of a mystery in production.

## The agent loop is one line of configuration

"Everything is a plugin" sounds like every framework's marketing. Here it's literal in a way I haven't seen shipped before. The loop that drives the agent — the thing that decides to call the model, run tools, continue or stop — is a row in a YAML file. Add `disabled: true` and there is no agent. The product's default setup isn't privileged code either: it's the first patch layer applied to an empty tree, and your own config patches use the same syntax, at the same level, as the vendor's.

Two details show how far this goes. Run `dsh --dump-config` and it prints the actual tree your machine boots — and every printed line is a legal target for your own replacement patch. And the four "modes" in the UI (standard, code, minimal, creator) are just four YAML files. The code mode — where the model writes programs to orchestrate its tools instead of calling them one by one — differs from standard mode by exactly one line.

The cost of this flexibility is written into the repo's own incident reports. When composition happens at runtime, the compiler can no longer save you. Of the four postmortems DeepSeek published, two are pure composition failures: one misplaced config expression silently disabled the file tools across every mode, and one stray `export default` made the loader silently drop a plugin's dependency declarations — 178 green unit tests and 100% line coverage shipped alongside a product that failed the moment a real editor connected. Their fix, both times, was another machine check. The repo now runs 27 of them, standing where a compiler used to stand.

My take: for a platform betting its future on an ecosystem, that trade is coherent. For most of us, the thing worth stealing isn't the plugin tree — it's `--dump-config` transparency: one command that prints exactly what your system actually runs, with every line overridable.

## Cache discipline, enforced by CI

At launch-week list prices, a DeepSeek cache hit cost roughly 1/50th (V4-Flash) to 1/120th (V4-Pro) of a cache miss — the company moved to time-of-day pricing on August 17, but the ratio is the point. For a vendor selling tokens, whether your requests reuse a stable prefix is not a performance detail. It's gross margin.

The repo treats it that way, mechanically. Tool schemas are sorted in a canonical, locale-independent order so the prompt prefix is byte-stable across machines and restarts. Volatile facts — the clock, the environment — are kept out of the system prompt entirely and injected as logged messages only when they change, so they can't shatter the cached prefix. Every package README is required to carry a "KV Cache effect" section declaring what it does to the prefix; a CI gate fails if the section is missing. And a real-API end-to-end test asserts that every request after a session's first reports cache-read tokens greater than zero. A regression that breaks prefix stability — a timestamp sneaking into the system prompt, a tool list that reorders itself — turns CI red before it burns anyone's money.

Most agent frameworks treat cache hits as weather. This one treats them as an invariant with a test. It's also the clearest fingerprint of who built this and why: only a model company engineers its harness around its own pricing table. All three techniques — canonical ordering, volatile-out-of-prefix, a cache-hit assertion — are copyable this week in any stack, and they'll cut your bill regardless of whose model you run.

## The repo itself might be the most valuable artifact

DeepSeek's harness was built in 64 days with 12,293 commits — and the repo contains more markdown files than TypeScript files. That's not sloppiness. It's the first public look at industrial-scale engineering where agents write most of the code, and the process they built around it is, for my money, the best thing in the repository.

A process note written on day two states the operating theory: agents follow enforced gates far more reliably than written conventions, and "a lot of work" stops being a cost argument when agents do the labor. So the rule density goes way up — every non-trivial change must land with a design note (there are 683), every claim a gate can check gets a gate — and the one thing left to human judgment is deciding what's non-trivial.

Two mechanisms stand out. There's a `rejected/` directory holding the proposals they decided against, each with its reasoning frozen — and a standing rule that future re-proposals must defeat the recorded argument, not just re-litigate it. Anyone who has watched an AI (or a new hire) confidently re-propose last month's dead idea will recognize what this is: an immune system. And postmortems here can't end in lessons — they must end in machine checks, verified to turn red when the original bug is restored. The coverage-theater incident above produced exactly that: a keyless test that boots the real loader path, proven to fail if the bug comes back.

Even if this harness loses the war, that process layer is loot worth carrying off. It's the most concrete public answer yet to a question every AI-native team is quietly asking: what should engineering discipline look like when the marginal cost of labor collapses?

## The strategy is readable in the code, too

Three moves, all checkable in the repo. First, it adopted its rival's standards: field-for-field SKILL.md compatibility (the design notes show they built their own format, then deleted it), zero-config reading of `~/.agents/skills`, `AGENTS.md` loaded first with `CLAUDE.md` accepted. Your skills and instruction files work on day one. Second, it says plainly what it doesn't support: the Claude Code hooks bridge documents that 23 of 30 hook events are unsupported rather than posing as a clone. Third, it turned competitors into plugins: Claude Code and Codex are wired in as subagents you can hand a task to.

My read — and it's a read, because intent doesn't sit in a repo: Anthropic keeps its harness closed and wired to a subscription, a moat around the model. DeepSeek gives its harness away and makes it read everyone's formats, a funnel for the thing it actually sells: tokens. In July I argued that [deployment capability, not model access, is the scarce layer](/blogs/why-ai-companies-are-becoming-deployment-companies) — the evidence then was vendors spending billions on deployment engineers. This is the same bet in software form. And there's an edge on it: when a vendor adopts its competitor's file formats, the competitor's users suddenly hold portable assets. Portability is a knife that cuts both ways, and DeepSeek just paid to sharpen it.

Honesty about the current state, from the repo's own mouth: the loop-safety guard is advisory only and goes silent past its top threshold; bash commands carry no timeout budget; the hooks bridge logs a blocking `continue: false` but doesn't honor it. An early tester with repo access [says the daily experience still trails Claude Code and Codex](https://x.com/jiayuan_jy/status/2087911060154314963). Rough today is the fair summary — if you need work done this week, this isn't yet the tool.

## What I'm taking from it

Three things go straight into my own stack. The pre-request assertion from the log design — five lines that turn context drift into a loud failure. The cache discipline — canonical tool ordering, volatile facts out of the prefix, one test asserting cache hits. And a `rejected/` directory in my own repos, because my agents re-propose dead ideas too.

And the teardown sharpened one bigger frame. The model layer is rented — swappable by design, and both vendors' behavior confirms it. The harness layer will churn — this repo's own all-caps breaking-changes warning is the testimony, and deep customization of any one harness today is likely to end up as sunk cost. The layer that compounds is the one every harness now reads: your skills, your instruction files, your record of what worked and what you rejected. DeepSeek deleting its own format to adopt its rival's made that concrete.

So the operating rule I'm walking away with — and the one I'd hand you — is this: rent the model, expect the harness to churn, and own what every harness reads. Sort your AI assets into two columns this week, portable and locked-in. That list is your position in the harness war, whoever ends up winning it.

---

*Next in this series: the first-request bill. Before you type a word to an agent, you're paying a fixed entry fee — I'm reproducing the token-level measurement on my own stack to find out what mine costs. Subscribe to get it.*
