---
title: "I Gave Codex a Task From a Moving Tesla"
slug: ai-became-my-operating-system
date: 2026-06-20
pillar: ai-native-execution
target_audience: Builders, product leaders, and operators trying to move from AI tool usage to AI-native work systems
tone: Personal narrative, operator-grade, commercially useful, optimistic but bounded
content_goal: Build authority around Aaron's lived AI-native workflow and spark discussion about the next layer of personal productivity
estimated_word_count: 1800-2400
publish_day: Wednesday, 2026-06-24
cta_rotation: newsletter
---

# Content Plan: I Gave Codex a Task From a Moving Tesla

## Voice Check

**Positioning:** Ship with AI, not about AI - builder who ships, not commentator.

**Voice rule:** Use "I" and lived examples. Do not make it a generic guide or tool ranking.

**Default style:** Entrepreneur/operator perspective. Lead with a concrete work observation, then name the shift in leverage, judgment, and work design.

**This post's personal anchor:** Aaron was in a Tesla on the way to California with family, speaking into Codex mobile to ask it to work through a Notion task tracker item using the Superpowers skill. At the same time, Claude Code had just completed a roughly 1.5-hour development task. Other agents and workflows were running across local and cloud environments: blog growth analytics, content workflows, Seedance video experiments, scheduled jobs, and AI workstation tasks.

## Hook / Opening

**Blog hook:**

The Tesla was driving us toward California when I opened the Codex mobile app and spoke a task into my phone: go into my Notion task tracker, work on the blog analysis task, and use the Superpowers skill to execute it. While I was still on the road with my family, Claude Code had just finished my latest development task after about 1.5 hours of work.

That sounds like a future-of-work demo. It is not. It is what my work already looks like.

**X post hook:**

I was in a Tesla on the way to California when I told Codex mobile to work through a Notion task with Superpowers.

At the same time, Claude Code had just finished a 1.5-hour dev task.

That was the moment I realized AI was no longer a tool.

It had become my operating system.

## Core Argument / Thesis

AI's biggest productivity change is not that it makes individual tasks faster; it changes the unit of work from "I do a task" to "I design a work system that can execute, report back, and learn." Over the last two months, Claude Code, Codex, Notion, Superpowers, scheduled jobs, content workflows, and video generation moved from separate tools into one personal AI operating system.

## Evidence And Personal Material

### Notion As The Task Surface

- Notion has a `Tasks Tracker` database with projects such as `blog`, `aaron-studio`, `vgpt`, and `self-imp`.
- Relevant pages found:
  - `aaronguo.com 的 self-enhancement 学习` under `aaron-studio`
  - `video lab 的搭建` under `aaron-studio`
  - `Excel UI 升级` under `vgpt`
  - `在游轮上面编程` under `blog`
  - `如何构架一个可以自我学习的系统` under `blog`
- Important nuance: Notion often holds the task shell, while the detailed execution memory lives in repo docs, plans, skills, metrics, and agent sessions. This supports the article's "operating system" claim.

### Long-Running Development Work

- The `Excel UI 升级` task is concrete and safe to describe at a high level:
  - consolidate Excel add-in UI/UX into a polished product;
  - adopt the vgpt web frontend design system;
  - port design tokens, restyle chat panel, improve first-run state, reorganize settings, unify login, update ribbon, bundle assets, run benchmark gate.
- It references `docs/superpowers/specs/2026-06-15-excel-ui-consolidation-design.md` on a feature branch outside this repo, so do not claim exact implementation details unless verified from that repo. In the article, describe it as a development task involving an Excel add-in UI consolidation.

### Blog Growth / Self-Enhancement

- `docs/blog-growth/README.md` defines the loop:
  publish content -> distribute -> ingest metrics -> calculate reward score -> run postmortems/reviews -> feed learnings back into topic, writing, visual, and video workflows.
- The 2026-06-15 research run found:
  - 38 blog content items scanned;
  - Turso schema ready and seeded;
  - Rybbit live read succeeded;
  - 876 metric snapshots written after expanded ingestion;
  - `scroll_75`, `scroll_100`, and outbound clicks included;
  - UTM helper implemented for LinkedIn, YouTube, newsletter, X, and blog-owned links.
- Use this as the article's best example of self-improvement: not full reinforcement learning, but a practical content feedback loop.

### Seedance / AI Video Lab

- Seedance PoC session:
  - model: `doubao-seedance-2-0-260128`;
  - 4s / 480p / 9:16 smoke test;
  - estimated 40,176 tokens, about 1.85 RMB;
  - succeeded task `cgt-20260616123213-z6pk7`;
  - output saved at `/Users/aaronguo/Work/lab/apple-mlx/runs/seedance-smoke-live-001/output.mp4`.
- Later AI video lab work generated:
  - `ytv-glass-desert-librarian-001-1080p15s-audio.mp4`;
  - `ytv-neon-reef-mechanic-001-1080p15s-audio.mp4`;
  - `ytv-aurora-shrine-drummer-001-1080p15s-audio.mp4`;
  - plus a one-minute `ytv-neon-reef-minute-prototype-001-polished-v1-1-1080p62s-audio.mp4`.
- Important mechanism: the system did not only generate video; it created prompts, run records, critiques, and lessons for future iterations.

### Persistent Agent / Scheduled Jobs

- The 2026-02-18 Mac mini article provides context:
  - Mac mini agent setup;
  - WhatsApp interface;
  - scheduled jobs for morning briefing, content research, nightly report;
  - first failure due to missing CLI auth;
  - deep blog analysis, creator research, newsletter setup, X strategy, homepage review;
  - key lesson: persistent agents compound context.
- This article should treat that as the earlier version of the current operating system, not repeat the whole story.

## Research References

- https://openai.com/index/work-with-codex-from-anywhere/ - OpenAI says Codex can be used through the ChatGPT mobile app to monitor, steer, and approve coding tasks across devices and environments.
- https://openai.com/codex/ - OpenAI positions the Codex app as a command center for agentic coding with worktrees, cloud environments, parallel agents, skills, and automations.
- https://docs.anthropic.com/en/docs/claude-code/sub-agents - Claude Code docs for specialized subagents and context management.
- https://www.anthropic.com/news/enabling-claude-code-to-work-more-autonomously - Anthropic discusses subagents, hooks, and background tasks for more autonomous Claude Code work.
- https://docs.anthropic.com/en/docs/claude-code/overview - Claude Code can kick off long-running tasks, check back when done, run multiple tasks in parallel, and is available on desktop browsers and Claude iOS.
- https://developers.notion.com/guides/mcp/overview - Notion MCP gives AI tools secure access to a Notion workspace.
- https://developers.notion.com/guides/mcp/mcp-supported-tools - Notion MCP tools can search, fetch, create, and manage workspace content.
- https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents - Useful framing for long-running agent harnesses: context, planning, execution, and tool use.

## Outline

### Section 1: This Is Not A Demo

- Open with Tesla / Codex mobile / Notion task tracker / Superpowers.
- Mention Claude Code completing a 1.5-hour dev task in parallel.
- Name the shift: I was not "using AI"; I was dispatching work.
- Make the scene concrete and restrained; avoid sounding like science fiction.

### Section 2: Coding Was The First Door

- Claude Code and Codex first changed development work.
- Use the Excel add-in UI consolidation as a concrete example.
- The agent can read specs, plan, modify code, run tests, and return artifacts.
- Human role moves from typing every line to defining outcome, standards, constraints, and review.

### Section 3: Then The Pattern Escaped The IDE

- Writing and publishing: blog workflow creates article, Chinese version, X post, newsletter teaser, video script, metadata.
- Video: Seedance lab converts prompts/storyboards into video, then records critique and lessons.
- Notion: tasks become routing surfaces.
- Scheduled jobs: content/growth/review tasks become background processes.
- The common pattern is not "AI makes content"; it is "AI turns intent into a work run."

### Section 4: The Operating Model

- Introduce the five-part loop:
  1. Intent
  2. Skill
  3. Agent run
  4. Review gate
  5. Memory / feedback
- Explain why skills matter: they encode repeatable judgment, not only prompts.
- Explain why Notion alone is insufficient: the task database is the front door, but the work memory lives across repo docs, metrics, generated assets, and session logs.

### Section 5: Self-Enhancement Is The Next Layer

- Use blog-growth as the concrete example.
- The system now tracks published content, distribution, Rybbit metrics, scroll depth, outbound clicks, UTM links, and reward scores.
- This makes content production less subjective: each post can teach the next post.
- The important caveat: this is not magic self-improvement or full RL. It is a practical feedback loop that makes the human-agent system less forgetful.

### Section 6: The Human Role Got More Important

- Counterargument: is this just more work, more dashboards, more automation?
- Answer: bad delegation creates bad output faster; AI increases the value of judgment.
- The human is still accountable for goals, taste, priorities, permissions, and final review.
- The bottleneck moves from execution to routing and judgment.

### Section 7: The Point Is To Make Life Bigger

- Close with the user's stated belief: AI should free time for social connection, exercise, reading, travel, family, and solving bigger problems.
- Avoid generic self-help. Make it operator-grade: the purpose of leverage is not to fill every freed hour with more low-quality work.
- Final claim: the people who benefit most will not merely be the best prompters; they will be the people who design better human-agent operating systems.

## SEO Notes

**Primary keyword:** AI operating system

**Secondary keywords:** AI agents, Claude Code, Codex mobile, long-running AI tasks, personal AI workflow

**Search intent:** Informational / thought leadership. Readers want a concrete explanation of how AI agents change daily work beyond chatbots and coding assistants.

## Distribution Plan

### X Post Brief

**Format:** Single long-form post. No blog link in main post.

**Hook:** Tesla / Codex mobile / Claude Code 1.5-hour dev task.

**Key points:**
- AI stopped being a tool and became a work system.
- Coding was the first door, but the pattern moved into writing, video, Notion, admin, and analytics.
- The new workflow is intent -> skill -> agent run -> review -> memory.
- The next edge is not prompting; it is designing personal AI operating systems.

**CTA:** Newsletter.

**Visual:** Diagram of the personal AI operating system: mobile/Notion as control surface; Codex/Claude as agents; home workstation/cloud as compute; repo/docs/metrics as memory; review gates as control.

### X Standalone Tweet Brief

**Insight:** A Notion task tracker is not the operating system. It is only the dispatch surface. The real operating system is the moving context across tasks, code, docs, metrics, media, and agent sessions.

**Image idea:** Simple diagram showing "task shell" vs. "work memory."

### Newsletter / LinkedIn Teaser Brief

**Structure:** Open with the Tesla scene, contrast AI-as-tool vs AI-as-work-system, share one concrete data point from Seedance or blog-growth, invite readers to think about where their work still depends on them being physically at the desk.

**Link destination:** `https://www.aaronguo.com/blogs/ai-became-my-operating-system`

### Chinese Version

Translate as a natural Chinese adaptation. Keep technical terms like `Codex`, `Claude Code`, `Superpowers`, `Notion`, `AI agent`, `workflow`, and `feedback loop` where natural.

## Personal Experience Notes

- Preserve the opening in Chinese spirit even though the English article is primary.
- Do not over-describe family or travel; use it to establish "away from desk" context.
- Mention that Notion task pages can be thin. This is a feature of the story: the task tracker is the doorway, while the real execution memory lives elsewhere.
- Mention the earlier Mac mini / GG story only as historical progression: persistent agent -> long-running agents -> personal operating system.
- Use Seedance as proof that AI workflows now extend into media production, but avoid making the article about video.
- Use blog-growth as the clearest self-enhancement mechanism.
