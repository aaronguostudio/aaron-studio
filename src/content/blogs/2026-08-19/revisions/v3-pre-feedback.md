---
title: "The Harness Is the Product Now"
date: 2026-08-19
slug: deepseek-harness-is-the-product
category: ai-native-systems
tags: [ai-agent-harness, deepseek, claude-code, ai-strategy]
---

# The Harness Is the Product Now

When an agent botches a task, the reflex is to blame the model. I've done it more times than I'd like to admit: stare at a failed run, decide the model isn't smart enough, and start thinking about switching subscriptions.

[Composio](https://composio.dev/content/best-agent-harness-deepseek-v4-flash) just published numbers showing how often that reflex points at the wrong layer. On August 11 they ran the same model — DeepSeek V4-Flash — through eight different agent harnesses on thirty real SaaS workflows. 240 runs, graded by checking the actual state of the connected apps, not by asking another LLM how it went. Success rates ranged from 46.7% to 66.7% depending only on the harness. Cost per completed task ranged from $0.028 to $0.195 — a 7x spread. [Seven of the thirty tasks](https://x.com/composio/status/2085330850300797394) passed or failed purely on harness choice. The model didn't change a word.

Two days later, DeepSeek open-sourced its own harness under MIT — on the same day V4-Pro went GA. Read together, those two events are one story: the harness is the product now, and the companies that make models have decided they can't leave it to anyone else.

## Seven tasks flipped, and nobody touched the model

The Composio numbers deserve one paragraph of honesty before I build on them. This is one benchmark: thirty tasks, one model family, a 900-second limit per run. Composio flags its own caveats — the top performer used a different reasoning setting and two model providers, and six runs of another harness were excluded over scoring difficulties. If you read their table as a leaderboard, you're overreading it.

But the spread survives every caveat. Throw out the winner entirely and the remaining seven harnesses still differ by margins no one would accept in any other part of their stack. Twenty percentage points of success rate and a multiple on cost, from the layer most teams treat as an interchangeable wrapper. That's not a ranking claim. It's an existence proof: the thing between you and the model moves outcomes as much as the model does.

Which raises the obvious question: what exactly is that thing doing?

## A harness is the operating contract, shipped as software

Strip the branding and a harness makes a short list of decisions, over and over: what enters the context window and in what order, which tools the model sees and how their schemas read, what requires approval, what happens on failure, when the loop keeps going and when it stops, and what evidence survives the run. Models emit tokens; harnesses complete tasks. Everything in that gap belongs to the harness.

In June I wrote that [Fable 5 changed the unit of AI work](/blogs/fable-5-managing-ai-autonomy) from a response to a run, and that the scarce skill was no longer prompting — it was designing the operating contract that makes a run bounded, inspectable, and reversible. A harness is that operating contract, productized. Composio's spread is what it looks like when eight teams write eight different contracts for the same worker.

I see a small version of this at my desk. I run Claude Code and Codex side by side most days, often against the same repository, and the levers I actually watch them pull are the harness's levers: which files each one reads into context before acting, how long each is willing to keep a run going, what each does with a failing step. Those are contract decisions, not intelligence decisions. Same worker, different manager.

## A model company just gave the harness away

DeepSeek's release on August 13 was not a toy drop. The repo lands with 219 packages and 12,293 commits over 64 days of development — about nine weeks — with a web UI, a headless runner, and a Python SDK. It's a developer preview and says so loudly; the README warns in capital letters that compatibility will break. On Hacker News, [a company that spends its life accused of copying got an unusual review](https://news.ycombinator.com/item?id=49285244): "this time it looks pretty much original."

I cloned the repo the week it dropped and ran a full teardown — fourteen analysis agents over the source tree, pinned at commit 47f9438, with a few hundred file-level checks. The claims that follow are things I verified in the code, not things I read in coverage.

One reconciliation before the strategy read, because I argued a version of this in July. In [that piece](/blogs/why-ai-companies-are-becoming-deployment-companies), the evidence for "deployment capability beats model access" was vendors spending billions on people — forward-deployed engineers embedded with customers. This launch is the same bet in a different form. Services are the human form of deployment capability; a harness is the software form. The vendors are now betting both ends of it.

## Three moves you can check in the repo

**Format surrender.** DeepSeek's harness adopts Claude Code's SKILL.md format field for field — and the repo's design notes show they built their own skill format first, then deleted it in favor of the competitor's. It reads your `~/.agents/skills` directory with zero configuration. It loads `AGENTS.md` instruction files first and falls back to `CLAUDE.md`. Your skills and instruction files work on day one, unmodified — the two asset types that matter most.

**Honest subsets.** The bridge for Claude Code's hooks doesn't pretend to be a clone. Its own README documents that 23 of Claude Code's 30 hook events are unsupported, and names which fields get logged but not executed. Partial compatibility, declared as such, is a design stance — most compatibility layers die of silent gaps instead.

**Rival absorption.** The strangest one: Claude Code and Codex are mounted as subagent providers. Inside this harness, a competitor's entire product is a node you can delegate a task to. The rival isn't blocked; it's plumbing.

Here's my read of what those three moves add up to — and I'm labeling it as a read, because intent doesn't sit in a repo. Anthropic keeps its harness closed and wires it to a subscription: the harness is a moat around the model. DeepSeek inverts it: give the harness away, make it read everyone's formats, and the harness becomes a funnel for the thing it actually sells: tokens. And there's a sharper edge underneath: when a vendor adopts its competitor's file formats, the competitor's users suddenly own portable assets. Lock-in only works if the assets don't travel. Portability is a knife that cuts both ways, and DeepSeek just paid to sharpen it.

## The case against taking this seriously

A smart skeptic has three good objections, and I half-agree with all of them.

First: one benchmark is noise. Fair — I've kept the ranking out of this piece and used only the spread, which holds under Composio's own caveats. And there's a boundary worth conceding plainly: on short, single-shot tasks the harness has few decisions to make, so the spread should shrink — Composio's tasks were long, multi-tool workflows, exactly where the contract does the most work. If someone runs the counter-experiment showing harness choice doesn't matter there either, that would genuinely change my conclusion. I haven't seen one.

Second: the thing DeepSeek shipped is rough. Also true. An early developer with repo access [put it plainly](https://x.com/jiayuan_jy/status/2087911060154314963): the experience trails Claude Code and Codex, interfaces are still moving, plugin quality is uneven. If you want work done this week, Claude Code is still the more polished tool — nothing in this piece says otherwise. But notice where the roughness points: straight at the thesis. A layer this unsettled — a major vendor nine weeks in, commoditizing it at nearly two hundred commits a day — is still moving. You don't anchor assets to moving ground.

Third: the harness war might consolidate fast, the way the JavaScript framework wars eventually did. Maybe. But consolidation with an unknown winner is precisely the condition under which deep customization of any one harness turns into sunk cost. Which is the practical point of all of this.

## Rent the model. Expect the harness to churn. Own your skills.

Here's the asset test I now apply to my own stack, and the frame I'd offer any builder reading the same news.

**Rent the model.** Models are swappable by design — that's what the harness layer exists to guarantee, and both vendors' behavior confirms it. Any workflow welded to a single model is hostage to someone else's pricing power.

**Expect the harness to churn.** Invest in using harnesses well. Be slow to invest in deep customization of any one of them — proprietary config, vendor-specific extensions, workflow logic that lives inside one tool's plugin system. The war for this layer started in earnest this month, and every combatant's breaking-changes warning means your customization is the least durable thing you own.

**Own your skills and your evidence.** Skills, instruction files, and your evaluation and feedback records are now the layer every harness reads. DeepSeek deleting its own format to adopt SKILL.md made that literal: these files are becoming the cross-vendor standard, which means they're the only layer that compounds for you no matter who wins. I keep my skills and AGENTS.md-style instructions in portable form, and I keep records of what worked and what I rejected — the loop only compounds because I decide what gets written back into it. What I deliberately don't do is build deep on any single harness's proprietary surface.

The one-day version: make two columns. Portable — skills, instruction files, evals, feedback records. Locked-in — everything that only means something inside one vendor's tool. That list is your position in this war, and most builders have never written it down.

The vendors will spend the next year fighting over the layer that turns model capability into finished work. You don't have to pick the winner. You have to know which layer is yours.

---

*Next in this series: the first-request bill. Before you type a word to an agent, you're paying a fixed entry fee — I'm reproducing the token-level measurement on my own stack to find out what mine costs. Subscribe to get it.*
