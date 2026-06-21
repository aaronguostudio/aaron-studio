---
title: "I Gave Codex a Task From a Moving Tesla"
date: 2026-06-20
slug: ai-became-my-operating-system
category: personal-operating-system
tags: [ai-agents, codex, claude-code, ai-workflow]
cover: imgs/web/00-cover-v2.webp
---

![A personal AI operating system running from a phone inside a car on the road to California](imgs/web/00-cover-v2.webp)

The Tesla was driving us toward California when I opened Codex on my phone and spoke a task into the app.

Go into my Notion task tracker. Work on the blog analysis task. Use the Superpowers skill to execute it.

I was not sitting at my desk. I was not in an IDE. I was with my family, moving down the highway, watching the road unfold through the windshield. At the same time, in another thread, Claude Code had just finished my latest development task after about 1.5 hours of work.

Some of the work was happening on my machines. Some of it was happening in cloud environments. Some agents were reading local files. Some were searching docs, APIs, and websites. Some were writing plans, editing code, generating content, or turning earlier results into feedback for the next run.

That sounds like a future-of-work demo.

It is not. It is what my work already looks like.

Over the last two months, Claude Code and Codex changed more than my coding workflow. They changed the interface between my intent and the work itself. I started with programming, because programming was the obvious door. But the pattern quickly escaped the IDE. It moved into writing, image generation, video production, analytics, admin, Notion tasks, scheduled jobs, and the way I manage my day.

The biggest productivity change was not that AI made each task faster.

The bigger change was that the unit of work changed. It moved from "I do a task" to "I design a work system that can execute, report back, and learn."

That is the moment AI stopped feeling like a tool and started feeling like an operating system.

![A comparison between an isolated AI tool and a layered AI operating system](imgs/web/01-metaphor-tool-to-environment-v2.webp)

## Coding was the first door

Coding was where the shift became obvious first because software work already has the shape agents need: files, specs, tests, diffs, branches, logs, and reviewable artifacts.

When I use Claude Code or Codex now, I am rarely asking for a snippet. I am giving it a work objective. Read this repo. Understand the existing conventions. Write a plan. Implement the change. Run the checks. Tell me what changed. Stop if the task becomes ambiguous or risky.

One recent task was an Excel add-in UI consolidation. The work was not "make this prettier." It involved adopting the web app's design system into the add-in panel, porting design tokens, restyling chat surfaces, improving the first-run state, reorganizing settings, cleaning up login behavior, changing ribbon grouping, bundling assets, and preserving a benchmark gate.

That is not a one-prompt task. It is a run.

![A long-running coding task shown as an agent execution lane with review gates](imgs/web/02-scene-coding-run-continues-v2.webp)

A run has duration. It has context. It touches files. It makes intermediate assumptions. It may start by reading, then planning, then editing, then testing, then revising. When it is done, I do not only care whether the final answer sounds good. I care what it changed, what evidence supports the result, what it skipped, and where I still need to apply judgment.

This is why [Claude Code's own documentation](https://docs.anthropic.com/en/docs/claude-code/overview) talks about long-running tasks, parallel work, browser and iOS access, and checking back when work is done. Anthropic has also written about [subagents, hooks, and background tasks](https://www.anthropic.com/news/enabling-claude-code-to-work-more-autonomously) as ways to make Claude Code work more autonomously. OpenAI describes Codex as a command center for agentic coding, with [mobile access for monitoring, steering, and approving tasks across devices](https://openai.com/index/work-with-codex-from-anywhere/).

The product direction matches the lived experience: the interface is moving away from "chat with a model" and toward "manage work across agents."

That changes my role. I still need to understand the code. I still need to review the output. I still need taste, standards, and risk awareness. But I am no longer the person typing every line. More often, I am the person designing the conditions under which the work can move without me watching every keystroke.

## Then the pattern escaped the IDE

Once that clicked in coding, I started seeing the same structure everywhere.

My blog workflow is no longer just "write an article." It is a pipeline. A rough idea becomes an `idea.md`. That becomes a researched content plan. The plan becomes a writing outline. The outline becomes an English article, Chinese adaptation, X post, standalone tweet, newsletter teaser, YouTube script, and metadata. Later, illustration and video workflows can turn the piece into visuals and a narrated video.

![A map of AI work moving beyond coding into writing, video, analytics, admin, and daily workflows](imgs/web/03-metaphor-work-leaves-desk-v2.webp)

That sounds like content production, but the deeper point is workflow design. Each step has a contract. The brainstorm skill should produce a content plan, not a draft. The outline skill should produce writing structure, not social copy. The writing skill should create a package and run a depth check before handing the piece downstream. The publishing skill should enforce taxonomy and growth-tracking requirements.

The same thing happened with video.

I recently worked through a Seedance video lab. The first goal was modest: prove that the Ark China endpoint could submit a Seedance 2.0 job, poll asynchronously, download an MP4, and estimate cost. That smoke test ran at 4 seconds, 480p, 9:16, with no audio or watermark, and cost about 1.85 RMB.

Then the workflow grew. We generated storyboard-grid first frames, sent them to Seedance, produced 15-second vertical videos with audio, synced the results to iCloud, checked media properties, created contact sheets, and wrote critiques and lessons. Later, one direction became a one-minute prototype.

The important part was not just that AI generated video. The important part was that the video system started to remember what happened. It stored prompts, requests, summaries, outputs, critiques, and next variations. That is the difference between playing with a model and building a creative machine.

![A creative video lab contact sheet showing prompts, generated worlds, critique marks, and next variations](imgs/web/07-scene-creative-lab-memory-v2.webp)

The same pattern showed up in Notion.

Notion is useful as a task surface. I have a task tracker with projects for blog work, Aaron Studio, VGPT, self-improvement, and other work streams. There are tasks like "video lab 的搭建," "aaronguo.com 的 self-enhancement 学习," "Excel UI 升级," and "如何构架一个可以自我学习的系统."

But the honest detail is that Notion is not the whole system. Many Notion pages are thin task shells. The real execution memory lives across repos, docs, specs, plans, metrics, generated assets, and agent sessions. Notion is the dispatch layer. The work memory is distributed.

![A layered architecture diagram showing Notion as a thin task shell above distributed work memory](imgs/web/04-light-architecture-dispatch-memory-v2.webp)

That is why I think "personal operating system" is a better frame than "task manager."

A task manager stores what needs to happen. An operating system routes intent into execution, gives processes access to resources, maintains state, logs what happened, and decides what gets control next.

That is much closer to how my AI workflow now behaves.

## The new loop: intent, skill, run, review, memory

The simplest version of my current operating model has five parts.

First, intent. I define the outcome, not every step. "Improve this UI." "Analyze the blog." "Write this post." "Generate a video concept." "Turn this idea into a content package." The quality of the intent matters because vague delegation creates vague work faster than before.

Second, skill. I route the task into a repeatable workflow. Superpowers gives that workflow discipline: clarify first, plan before execution, dispatch subagents when useful, verify evidence before saying the work is done, and leave behind an artifact that future runs can reuse.

Third, run. The agent reads, searches, edits, generates, calls tools, or asks for more context. Some runs take minutes. Some take an hour or two. Some involve background processes, dev servers, external APIs, or multiple agents working in parallel.

Fourth, review. I inspect the output, but also the evidence. What changed? What sources did it use? What files did it touch? What tests ran? What assumptions did it make? Did it stop where it should have stopped?

Fifth, memory. The result should teach the system something. A blog post should create metrics. A video experiment should create critique notes. A failed scheduled job should create a setup lesson. A good workflow should become a better skill.

![A five-part loop of intent, skill, agent run, review gate, and memory](imgs/web/05-clean-framework-intent-skill-run-review-memory-v2.webp)

This loop is the practical difference between "AI helped me" and "AI changed how I work."

One-off assistance is useful. But it does not compound much. A work system compounds because every run can leave behind structure: a better prompt, a better test, a better checklist, a better metric, a better default, a better sense of what to do next.

## Self-enhancement is the next layer

This is the part I am most interested in right now.

I do not want an AI system that only produces more output. I want a system that gets better from the consequences of its output.

The blog is becoming the first real example. We now have a blog growth model that treats the site like a content product, not just a folder of posts. The loop is simple:

Publish a content item. Distribute it. Ingest metrics. Calculate a quality-weighted reward score. Run postmortems and weekly reviews. Feed the lessons back into topic selection, writing, visuals, video, and distribution.

The first version is intentionally not a full reinforcement-learning system. It is more practical than that. It scans content, writes to Turso, ingests Rybbit metrics, tracks pageviews, unique visitors, scroll depth, outbound clicks, and UTM-tagged distribution links. It creates a foundation for asking better questions after each post:

Did people actually read?

Did they scroll?

Which channels brought them here?

Which topics created engaged audience instead of shallow traffic?

Which hook converted attention into depth?

The value is not the dashboard. The value is that the next article does not have to start from vibes alone.

![A blog growth feedback loop turning distribution metrics into the next content plan](imgs/web/06-metaphor-feedback-garden-v2.webp)

This is where AI gets genuinely interesting for personal productivity. Most productivity tools help you capture tasks. Some help you automate tasks. Very few help you learn from the results of your work and change the next run.

That is the gap AI agents can fill.

The system can read the metrics. It can compare posts. It can update the content plan. It can suggest a sharper hook. It can notice that practical AI explainers outperform vague reflections. It can remember that a video experiment worked better when the storyboard-grid had a clear winner. It can turn that memory into the next workflow.

This is not magic. It is not "the AI improves itself" in some sci-fi sense. It is a human-agent feedback loop with better memory than I have on my own.

And that is enough to matter.

## The human role got more important

The obvious objection is that this sounds like more tooling, more dashboards, more automation, and more ways to avoid doing the actual work.

That risk is real.

An AI operating system can become a maze. It can create the feeling of motion without the discipline of direction. It can produce more artifacts than anyone has time to review. It can make weak judgment more dangerous because weak judgment now has more leverage.

That is why I do not think AI reduces the importance of the human. It increases it.

When execution is expensive, the bottleneck is often doing the work. When execution becomes cheaper, the bottleneck moves upward: deciding what matters, setting standards, choosing what not to do, knowing when to stop, and having enough taste to reject polished but wrong output.

Bad delegation used to waste an afternoon. With agents, bad delegation can waste compute, create wrong branches of work, publish mediocre content, or fill your system with noisy memory.

So the operator skill changes.

The best AI user is not the person who asks the cleverest prompt. It is the person who can design work so that the low-judgment parts move without them and the high-judgment parts come back for review.

That means constraints. Permissions. Checkpoints. Evidence. Rollback paths. Quality gates. It also means taste.

The more powerful the agent, the less I want to treat it like a magic box. I want it to work inside a system that makes its behavior observable enough for me to trust and bounded enough for me to repair.

## The point is not to work forever

There is another trap here.

If AI gives me back time, the worst use of that time is to immediately fill every minute with more low-quality work.

The point of leverage is not to become a machine. It is to make life bigger.

![A quiet family road-trip scene where AI task routes recede into the background](imgs/web/08-closing-life-foreground-v2.webp)

If an agent can research while I am traveling, I can be present with my family. If a background job can ingest blog metrics, I can go exercise. If a writing workflow can turn a rough idea into a structured plan, I can spend more time reading, thinking, and talking to people. If video workflows can reduce the cost of experimentation, I can explore creative directions that would have been unrealistic before.

That is the part I do not want to lose.

AI productivity often gets framed as a race: do more, ship more, automate more, outcompete everyone. There is truth in that. Leverage matters. But the more human framing is this: AI can remove enough friction that individuals and small teams can attempt work that used to require organizations.

There are too many unsolved problems in the world. Too many ideas never get built because execution cost is too high. Too many people spend their best hours on coordination, formatting, searching, copying, and administrative drag.

AI agents do not solve judgment. They do not solve taste. They do not solve courage. They do not decide what a good life is.

But they can give us more room to practice those things.

That is why I am optimistic. Not because AI will replace the human operator, but because it can make more humans capable of operating at a higher level.

The edge will not belong only to the people with the strongest model. Models will change. Interfaces will change. Today's tool will be replaced by tomorrow's platform.

The durable edge is learning how to build a better human-agent operating system: one that can execute, report back, learn, and still leave the human with the work that most deserves a human life.

The moment in the Tesla mattered because I was not choosing between work and life in the old way.

The work was moving.

And I was still there, on the road, with my family, watching California get closer.
