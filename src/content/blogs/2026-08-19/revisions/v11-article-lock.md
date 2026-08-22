---
title: "What I Learned From DeepSeek's Harness"
date: 2026-08-19
slug: deepseek-harness-teardown
category: ai-native-systems
tags: [ai-agent-harness, deepseek, agent-architecture, ai-strategy]
---

# What I Learned From DeepSeek's Harness

On August 13, DeepSeek open-sourced its agent harness — MIT license, the same day V4-Pro went GA. Two days earlier, [Composio's experiment](https://composio.dev/content/best-agent-harness-deepseek-v4-flash) had set the stage for why this layer matters: the same model, run through eight harnesses on thirty real workflows, swings from 46.7% to 66.7% success and 7x in cost per completed task.

The reaction that got my attention came from the person with the most right to be dismissive. The top scorer in that Composio test was Pi, and Armin Ronacher — co-founder of Earendil, the company behind Pi — [said after reading the repo](https://www.theregister.com/ai-and-ml/2026/08/14/deepseeks-innovative-harness-treats-everything-as-a-plug-in/5288095): "I don't think the DeepSeek Harness is perfect but this is for sure the first time I have been looking at something new in the space and felt quite inspired to revisit some of our choices." When the winner reads a rival's homework and says he wants to go revise his own, that carries more weight than any launch post.

So I didn't stop at other people's takes. I spent a week inside the repo: fourteen analysis agents over the source tree, pinned at commit 47f9438, a few hundred claims checked file by file. In June I wrote that [the unit of AI work had shifted from a response to a run](/blogs/fable-5-managing-ai-autonomy), and that the scarce skill was setting the rules a run operates under — this repo is the first chance to read one vendor's complete rulebook end to end. Here are the four designs most worth learning from it.

## 1. The model is only allowed to see what's in the log

Every DeepSeek Harness session is an append-only event log. The repo defines 44 event types, and exactly 3 are visible to the model: your messages, its messages, and tool results. The other 41 — approvals, turn boundaries, config changes, billing — are bookkeeping for humans and audits. Sketched out:

```text
seq 101  user/message       your instruction              → model sees it
seq 102  assistant/message  the reply (incl. tool calls)  → model sees it
seq 103  approval/decision  you clicked "allow"           → log only
seq 104  tool/result        what the tool returned        → model sees it
seq 105  turn/end           the turn's token accounting   → log only
```

Here's the detail that stopped me: the system never stores the conversation it sends to the model as a thing of its own. Only the log is stored — the conversation is recomputed from it before every request. If you know how blockchains work, this will look familiar: the ledger is the only truth and balances are derived by replaying it; nobody records "Alice has five coins" as a separate fact. This borrows exactly that one idea — state as a pure function of history — without any of the consensus or cryptography machinery. And "anything the model sees must be reconstructable from the log" isn't a docs promise — it's a runtime check that will actually block you. The mechanism, stripped to its logic:

```text
before every model call:
    expected = derive_messages(session_log)
    if expected != outgoing_request.messages:
        refuse to send  # error: log-reconstruction desync
```

In other words, no code can quietly slip the model extra context. If it isn't in the log, it doesn't ship.

What does this buy? Two situations you've probably lived through.

First: the agent does something inexplicable — quotes a piece of old code you never gave it, or ignores a file that's sitting right there and invents its own. In most tools you're down to guessing: did compaction eat the key context? Did some plugin inject something? Here there's no guessing. Derive the log to that step and the exact context the model saw is in front of you, byte for byte — whether a summary swallowed the information or an injection went wrong is settled in one look.

Second: a two-hour task dies at step 80 — the process crashed, or you closed the laptop. Since the context is computed from the log anyway, a restart recomputes it from the same log, the model sees exactly what it saw before the break, and the task continues. Want to fork at step 50 and try a different path? Copy the log prefix. The side benefits keep stacking: token usage is stamped on each event, so when the month-end bill surprises you, the log itself tells you which step the money went to; and their test system rides on the same property — record one real session and the log is the replay script, with no API key needed in CI.

The cost is just as real, and worth slowing down for, because Anthropic chose the opposite direction on the same question. Their code execution API supports a persistent execution environment: the model's program finishes a step and its variables stay in memory for the next one — like a Jupyter notebook that stays open, where a variable computed in one cell is right there for the next. The benefit is direct: when the model is working through a large dataset, the parsed result stays in memory, and the next ten steps neither reload it nor drag intermediate results through the context window. Faster, and cheaper.

DeepSeek's design notes record why they refused that path: state living in memory means part of the agent's state is not in the log — a broken session can't resume cleanly, replay stops matching, and "why did the model do that" becomes a cold case again. Holding the line on "every request reconstructable from the log" means every intermediate result that matters has to pass through the log, costing tokens and time.

Both sides of the ledger are legible. Anthropic's API serves developers running computation, where performance wins; DeepSeek is building a product-grade agent platform, where resumability and auditability are the promise itself. Neither is wrong — but when you pick for your own system, this is the line being drawn: the performance you save is paid for in "we can't explain what happened." And the log only grows: compaction masks old context from the model but deletes nothing. It saves tokens, never disk.

If I could take only one thing, it's the assertion. Add five lines to your own system: before each request, compare the context you're about to send against what your log says it should be, and fail on mismatch. What it gives you is specific: when the model misbehaves, you can look up exactly what it saw; when a long task breaks, you can resume it in place; and when some code quietly mutates the context, it surfaces immediately — not after launch, by guesswork.

## 2. The agent loop is one line of configuration

"Everything is a plugin" sounds like marketing. Here it's literal. The loop that drives the agent — the thing that decides to call the model, run tools, continue or stop — sits in the default config as an ordinary row:

```yaml
# packages/bundle/base/cordis.patch.yml
- id: agent-loop
  name: '@deepseek-ai/dsh-agent-loop'
  config:
    agents: []   # pre-configured standing agents; empty = created on demand
```

Turning it off takes no code. `disabled: true` is a switch every config row understands: put it on a row and that plugin never mounts. And this isn't a theoretical ability — the factory config uses it itself. In the same file, the bash sandbox and the PowerShell sandbox mount on opposite platform conditions, and one plugin ships turned off:

```yaml
- id: bash-sandbox
  name: '@deepseek-ai/dsh-bash-sandbox'
  disabled: !!js process.platform === 'win32'   # skip on Windows

- id: pwsh-sandbox
  name: '@deepseek-ai/dsh-pwsh-sandbox'
  disabled: !!js process.platform !== 'win32'   # Windows only

- id: skill-badge
  name: '@deepseek-ai/dsh-skill-badge'
  disabled: true                                # shipped, but off by default
```

Put that same switch on the agent-loop row and there is no agent. The main loop and a little badge plugin are peers, as far as the config system is concerned.

What this means for you: building a custom agent is configuration work, not development work. The minimal mode is a complete working agent in 62 lines, and it opens like this:

```yaml
- id: persona
  name: '@deepseek-ai/dsh-persona'
  config:
    text: You are a helpful software engineer assistant.
```

One persona row, one persistent bash, one file editor — a working agent. Different personality, fewer tools, another model route: all edits to rows like these. To see what your machine actually runs, `dsh --dump-config` prints the real boot tree, with a comment above each block naming which file it came from and which patch layers touched it — and every printed line is a valid target for your own override. The strongest demonstration of how far the swapping goes: replace the two provider rows for filesystem and subprocess with the E2B remote implementations, and Bash, the terminal, and LSP all move into a remote sandbox together — without touching a line of the tools themselves.

The four "modes" in the UI — standard, code, minimal, creator — are four such YAML files. The sharpest comparison is code mode against standard: the first 251 lines of the two files are identical — same bash, file tools, skills, compaction — and the difference is one appended row:

```yaml
- id: tool-presentation
  name: '@deepseek-ai/dsh-agent-tool-presentation'
  config:
    mode: code
```

What that row changes is how tools are presented to the model. In standard mode, the model sees the schemas of twenty-odd tools and calls them one by one. With `mode: code`, it sees a single run_code tool plus a generated TypeScript interface to the same tools — so it writes a program to orchestrate them, and intermediate results stay inside the program instead of filling the context window. The whole interaction style flips on one row, because "how tools are shown to the model" is itself a swappable plugin here.

All this flexibility runs into one blunt question: what happens when the config is wrong? Bad code gets caught by a compiler; bad YAML gets caught by nobody, and it fails quietly. DeepSeek crashed on this twice. Once, a conditional expression sat in the wrong field and the file read/write tools vanished in every mode — no error, just gone. Once, an extra `export default` made the loader silently drop a plugin's dependency declarations: 178 green tests, 100% coverage, and the product died the moment a real editor connected. Their response is equally blunt: after each crash, add a pre-release static check that catches that class of mistake. There are 27 of those checks now — the compiler's job, bought back one script at a time. If you adopt the everything-is-config idea, that bill comes with it.

My take: for a platform betting on an ecosystem, the trade is coherent. For the rest of us, the parts worth learning are the transparency and the switch discipline — what your system runs, visible in one command; every component, one line from off; and a machine check for every class of config mistake that has burned you before.

## 3. Cache discipline, enforced by CI

Start with the money. At launch-week list prices, a DeepSeek cache hit cost roughly 1/50th (V4-Flash) to 1/120th (V4-Pro) of a miss — the company switched to time-of-day pricing on August 17, but the magnitude is the point. For a vendor selling tokens, whether your requests hit the cache isn't a performance detail. It's gross margin.

First, some background that a lot of people — me included, before writing this — have only fuzzy ideas about: who manages this cache, and how it works. Picture the model reading your prompt the way a lawyer bills by the hour to read a contract. First time, front to back, full rate. Second time you bring the same contract with one new clause at the end — he skips straight to the new clause and charges a token fee for what he remembers. But change one word on page one and he re-reads everything from there, because his understanding of each section builds on everything before it. LLMs work exactly like this: the provider stores the computation for the prefix your last request already "read"; if the next request starts with byte-identical content, the stored part is billed at a discount, and full price only kicks in from the first byte that differs.

So the division of labor is this: **the caching happens on the model provider's side, but whether you hit it is decided by the harness.** Providers open the door differently — DeepSeek and OpenAI cache prefixes automatically, Anthropic asks you to mark cache points explicitly — but the principle is the same: storing is the provider's job; whether what you send matches is entirely a function of how the harness assembles the request. The provider holds the safe. The harness holds the key — and it's very easy to lose.

The most common way to lose it: many frameworks' default templates write the current time into the top of the system prompt —

```text
bad:  system prompt line 1: "Current time: 2026-08-19 09:32:07"
      → changes every second, the prefix mismatches from line one,
        every request pays full price for everything

good: no clock in the system prompt
      → time is an ordinary message, appended only when it changes
      → the prefix stays byte-identical; only the new tail costs full price
```

DSH does it the "good" way. Second way to lose the key: tool schemas ordered by plugin load order — load order shifts, the schema list reshuffles, the prefix shatters. So DSH ignores load order and sorts tools in a fixed, canonical order. The third way is the sneakiest: any new plugin quietly puts something changeable into the prompt and everyone's cache breaks, with no one knowing whose fault it is — which is why every package README must carry a "KV Cache effect" section declaring its impact on the prefix, and CI fails without it. And the sharpest piece: a live-API test that flatly asserts caching must work —

```ts
// packages/core/agent-loop/tests/request-cache.e2e.ts
// every request after a session's first must report a cache hit
for (const usage of usages.slice(1)) {
  expect(usage!.cacheReadTokens ?? 0).toBeGreaterThan(0)
}
```

It can dare to assert that because of the log design from lesson 1: every request is an extension of the previous one, so the prefix is stable by construction — the two designs interlock here. Any regression that shatters the prefix turns CI red before it burns money.

What the discipline is worth becomes obvious over one long session. A request's prefix — system prompt plus tool schemas plus the whole history — easily runs to five figures of tokens, and a task of a few dozen steps resends that prefix a few dozen times. Hit the cache, and those sends bill at a token fee; miss, and every one is full price. Same task, an order of magnitude apart on the bill. In most frameworks nobody owns this: the template carries a timestamp, tool order drifts with loading, and hits are luck. DSH manages it as an invariant with a test. It's also the clearest fingerprint of who built this and why — only a model company engineers its harness around its own pricing table. And all three techniques — fixed ordering, volatile-out-of-prefix, a cache-hit assertion — are things you can put to work this week, whoever's model you run.

## 4. It's the first public specimen of AI building a complex system

This repo was built in 64 days with 12,293 commits. Of its 37 named authors, the top one made 5,235 commits — 42.6% of the total. It contains more markdown files than TypeScript files. And I counted the branch names in the merge history myself: `worktree/` appears 210 times, `codex/` 209 times, `agent/` 15, `claude/` 3. `codex/` is the default branch naming of a coding agent; two hundred occurrences is not a slip. Most of this code was not typed by humans.

[Sawyer Hood's joke](https://x.com/sawyerhood/status/2087930588582093033) — "2026 is the year of the harnesses building themselves" — has a physical exhibit now. What's worth studying is the operating system they built around that fact.

A process note from day two states the theory outright: agents follow enforced gates far more reliably than written conventions, and "a lot of work" stops being a cost argument when agents do the labor. Everything else follows. Every non-trivial change must land with a design note — there are 683. A `rejected/` directory freezes the proposals they turned down, with reasoning attached and a standing rule: future re-proposals must defeat the recorded argument. Anyone who works with AI recognizes what that is — an immune system against your agent re-pitching last month's dead idea. And postmortems can't end in lessons; they must end in machine checks, verified to turn red when the original bug is restored.

I spent the most time on this part, because it answers a question bigger than harnesses: **AI building complex software at industrial scale has quietly become normal operations — and this repo left the operating manual in public.** Three layers of it.

The shape of the team changed. Thirty-seven people, two months, twelve thousand commits: the human jobs moved from writing code to setting rules, judging evidence, and approving merges. This is the [one-person project](/blogs/one-person-project-ai-coding-v2) I wrote about in July, at industrial scale — one accountable owner holding context while AI executes and the team owns boundaries and evidence. Except here the "one person" runs a fleet.

The economics of process flipped. "A design note for every change" is bureaucracy in a human team — it dies in the first meeting. In an agent team it's a guardrail against drift, because the writer never gets tired. So the rules can be far denser than before. And the line they drew is worth taking as-is: if a machine can check it, a machine checks it; humans keep only the calls that need judgment. Exactly one rule in the whole system is not automated — deciding whether a change matters enough to need a design note. A machine can't judge importance, so that one stays with people.

And the definition of quality moved. Coverage and green tests were discredited inside this very repo by its own incident (the 178-green-tests story above), so they bet quality on other things: end-to-end tests through the real loading path, gates verified to turn red, frozen rejection records. None of that is engineering vanity. It's a management structure that translates "mistakes AI makes" into system constraints.

Even if DSH stays as imperfect as Ronacher says and never becomes the popular choice, the manual is already public. For any team building with AI, it's the most valuable thing in the repository.

## Reading DSH's strategy in the code

Three moves, all checkable in the repo. First, it adopted its rival's standards: field-for-field SKILL.md compatibility (the design notes show they built their own format first, then deleted it), zero-config reading of `~/.agents/skills`, `AGENTS.md` loaded first with `CLAUDE.md` accepted — your skills and instruction files work on day one. Second, it says plainly what it doesn't support: the Claude Code hooks bridge documents 23 of 30 events as unsupported rather than posing as a clone. Third, it turned competitors into plugins: Claude Code and Codex are wired in as subagents you can hand a task to.

My read — and it's a read, because intent doesn't sit in a repo: Anthropic keeps its harness closed and wired to a subscription, a moat around the model. DeepSeek gives its harness away and makes it read everyone's formats, a funnel for the thing it actually sells: tokens. In July I argued that [deployment capability, not model access, is the scarce layer](/blogs/why-ai-companies-are-becoming-deployment-companies) — the evidence then was billions spent on deployment engineers; this is the same bet in software form. There's another layer here: when a vendor adopts its competitor's file formats, the competitor's users end up holding portable assets. Portability cuts both ways, and DeepSeek chose to sharpen it.

One last thing about its current state — all of it written in DSH's own docs. The loop-runaway protection only sends reminders; it can't force a stop, and after enough reminders it stops trying. Bash commands have no timeout. The Claude Code hooks bridge records a "block" instruction (`continue: false`) without actually blocking. An early tester with repo access [puts it plainly](https://x.com/jiayuan_jy/status/2087911060154314963): the daily experience still trails Claude Code and Codex. Ronacher's "not perfect" is accurate — if you need work done this week, this isn't your first choice.

## What I learned

Three things go straight into my own systems. First, the pre-request assertion: five lines that check the outgoing context against the log before every model call, so problems surface on the spot. Second, the cache trio: fixed tool ordering, changeable facts kept out of the prompt prefix, and one test watching for cache hits. Third, a `rejected/` directory in my own repos, keeping the ideas I turned down and why — my agents also re-pitch last month's dead ideas.

Zooming out, my conclusions got clearer too. Models are rented — they're designed to be swapped. The harness layer is still going to change a lot — the repo itself warns in all caps that compatibility will break, so binding deeply to any one harness right now will likely be wasted effort. What actually belongs to you, and grows more valuable as you add to it, is the layer every harness reads: your skills, your instruction files, your notes on what worked and what you turned down.

So the rule I set for myself, and recommend: keep models swappable, don't bind deeply to any harness, and put your effort into the asset layer every harness understands. Spend an hour this week listing your AI assets in two columns — what you can take with you, and what's locked in. That list will tell you better than any benchmark where your time should go next.

---

*Next in this series: the first-request bill. Before you type a word to an agent, you're paying a fixed entry fee — I'm reproducing the token-level measurement on my own stack to find out what mine costs. Subscribe to get it.*
