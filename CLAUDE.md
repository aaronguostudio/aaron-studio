# CLAUDE.md — Aaron Studio Agent Guide

> Read this first, every session. This repo is Aaron's "personal life clone" — a private knowledge system. Your job is to **understand Aaron**, then help him **grow over time**.

---

## Who is Aaron

Aaron Guo — Senior Manager & Partner at **Mawer** (day job, leading dev+QA, Head of Products), simultaneously building **OrgNext** as CEO (AI-native firm management software, big bet). Long-termist. 生酮 + 间歇性断食 + routine-driven. Core identity: *"I don't care what tools, I want to solve business problems."*

> **The Brain lives in Notion (since 2026-09-06).** `src/brain/` is **legacy evidence, read-only** — never write a second copy there. Destinations are in `brainCapture` in [config/aaron-studio.json](config/aaron-studio.json); the migration maps in [src/projects/brain-notion-migration/](src/projects/brain-notion-migration/) resolve an old file path to its Notion page. See [brain-ingest](tiles/brain-ingest/SKILL.md) for the write rules.

**Always read for current state:**
1. Notion **Aaron Brain** → `World · 我身边的人与关系` → `人物 / 组织 / 项目背景 / 长期主题` (`brainCapture.worldPageId`) — people, orgs, projects, themes
2. Notion **Projects Registry** (`brainCapture.projectsDataSourceId`) — active project records and their execution updates
3. Notion **知识库** inbox (`brainCapture.knowledgeDataSourceId`) — recent captures, newest thinking
4. [src/brain/goals/current-quarter.md](src/brain/goals/current-quarter.md) — active OKRs (not yet migrated)
5. [src/brain/life/routine.md](src/brain/life/routine.md) — weekly cadence (not yet migrated)
6. Latest [src/brain/reviews/weekly/](src/brain/reviews/weekly/) entry — most recent state delta (not yet migrated)

When in doubt about *what's going on*, traverse the Notion World pages via their `哪些记录提到了这里` backlinks. Fall back to `src/brain/world/` only to read history the migration left behind, and say so when you do.

---

## Repo map

```
src/
├── brain/         ← LEGACY evidence, read-only. Live Brain is in Notion (see above).
│   ├── world/     ← people, orgs, projects, themes (digital twin)
│   ├── goals/     ← north star, yearly themes, current OKRs
│   ├── reviews/   ← weekly / monthly / quarterly retrospectives
│   ├── decisions/ ← life ADRs (why, not what)
│   ├── journal/   ← daily entries
│   ├── reading/   ← book/article notes
│   ├── notes/     ← personal cheatsheets
│   ├── life/      ← routine, identity-level docs
│   └── logs/      ← work hour tracking (cf, oc)
├── content/       ← everything Aaron publishes
│   ├── blogs/     ← published blog posts (YYYY-MM-DD/)
│   ├── shorts/, videos/  ← multimedia
│   ├── writing/   ← drafts
│   └── strategy/  ← content strategy (x.md is canonical)
├── projects/      ← active work-in-progress projects
├── inbox/         ← single capture point. Process weekly.
├── news-radar/    ← independent JS data collector (tooling)
└── _archive/      ← inactive content kept for git history
```

See [src/brain/README.md](src/brain/README.md) for brain/ structure detail.

---

## Where to put new things — decision tree

| If Aaron says... | Put it in |
|------------------|-----------|
| "Today I..." (daily log) | `src/brain/journal/YYYY/MM/YYYY-MM-DD.md` (daily-log not yet migrated) |
| Observation about a person/org/project | Append a dated section to the **Notion** World page (`brainCapture.worldPageId`) — never to `src/brain/world/` |
| Idea / knowledge / reading note ("帮我记下来") | **Notion** 知识库 inbox via [brain-ingest](tiles/brain-ingest/SKILL.md) |
| Project execution update | **Notion** Projects Registry record for that project |
| New blog post | `src/content/blogs/YYYY-MM-DD/<slug>.md` (see existing convention) |
| Major life/career decision | `src/brain/decisions/YYYY-MM-DD-<slug>.md` (use ADR template) |
| Book/article notes | `src/brain/reading/` |
| Cheatsheet / how-to | `src/brain/notes/` |
| Action item ("I need to do X") | `src/inbox/todo.md` |
| Random idea / scratch | `src/inbox/scratch.md` |
| Don't know? | `src/inbox/scratch.md` — sort it during weekly review |

---

## Frontmatter (new files)

```yaml
---
type: journal | review | decision | node | reading | note | goal | log
date: 2026-04-13
tags: [career, mawer]
status: draft | active | archived
related:
  - "[[brain/world/people/keri]]"
---
```

`type` is required so future-you (Claude) can route it. Don't backfill old files.

---

## Continuous ingest — the fastest update path

Inspired by Karpathy's second-brain pattern (see [reading note](src/brain/reading/2026/2026-04-13-karpathy-second-brain.md)). When new evidence arrives — a Slack screenshot, meeting transcript, message, article, observation Aaron drops in chat — **don't wait for Friday review**. Process it now.

**Workflow on any new raw evidence (all writes go to Notion):**
1. Read the source fully. Capture Aaron's own words verbatim before interpreting them.
2. Identify which Notion World pages (人物 / 组织 / 项目背景 / 长期主题) are affected. Use `brainCapture.worldMigrationMap` to resolve an old `src/brain/world/*.md` path to its page.
3. **Fetch the live page first**, then append a dated section at the end: `## YYYY-MM-DD · <short title>`, with **Aaron 原话** (blockquote) and **解读** kept visibly separate, ending with a source-and-date line. Preserve everything already on the page; never rewrite migrated history.
4. Long raw material (a transcript, a research bundle) goes to the 知识库 inbox as its own capture, and the World page links to it — no `_archive/` files.
5. Flag contradictions with the page's migrated content in the same dated section rather than silently correcting it.
6. **Read the page back** after writing and report the Notion URL. On an ambiguous write, search before retrying — never blindly create a second page.

**Rules:**
- One source at a time. Batching destroys emphasis. (Karpathy's discipline.)
- Never write a second copy into `src/brain/`. If Notion is unavailable, keep the draft in the reply and report **not saved** — do not silently fall back to local.
- Explicit capture intent authorizes the write; ordinary pasted content does not. Actionable tasks go through [notion-task-intake](tiles/notion-task-intake/SKILL.md), not the knowledge inbox.
- The human owns raw + schema (this CLAUDE.md). Claude owns wiki maintenance. The LLM doesn't get bored; that's the leverage.
- No global ingest log file — the dated per-page sections are the receipt.

---

## Growth loop — the trajectory layer

Continuous ingest keeps state fresh. The growth loop drives **trajectory** — what's compounding, what's drifting, what to drop.

```
raw evidence ──► continuous ingest ──► Notion World pages + 知识库 inbox
                                          │
daily journal ──┐                         │
                ├─► weekly review ────────┤──► decisions/ ADRs
goals/ ─────────┤                         ▼
inbox ──────────┘                  monthly → quarterly → goals/ update
```

**Every Friday** (or when Aaron asks), generate a weekly review draft from:
- Recently edited Notion World pages and 知识库 captures (sort by last-edited; the dated `## YYYY-MM-DD ·` sections are the week's deltas)
- This week's `git log` on `src/brain/journal/`, `src/brain/logs/` (still local)
- New entries in `src/inbox/`
- The current [src/brain/reviews/weekly/.template.md](src/brain/reviews/weekly/.template.md)

Then ask Aaron to react/edit. Use the result to:
1. Append dated observations to the affected **Notion** World pages
2. Propose ADRs for any decisions
3. Re-check `goals/current-quarter.md` for drift

> The weekly-review and daily-log skills have **not** been migrated; they still read and write local files. Their World-node update step must go to Notion.

Read [src/brain/reviews/README.md](src/brain/reviews/README.md) for cadence rules.

---

## How to interact with Aaron

- **Terse.** No narration of internal deliberation. State results, not process.
- **Bilingual.** Aaron switches EN ↔ 中文 fluently. Match his language; brain/ uses both.
- **Push back on AI sycophancy.** Aaron explicitly values [[brain/world/people/thiago]]'s habit of pushing back on AI. Don't agree just to agree. If a goal feels rationalized or a project tier feels off, say so.
- **Privacy.** This repo is private and **must stay private**. Never paste `brain/` content (especially `world/people/`, `world/orgs/`, political analysis) into external tools (image gen, web upload, public APIs) without redacting names. When using Tessl skills that hit external APIs, redact first.
- **Don't auto-commit.** Aaron commits manually. Stage work but ask before committing.

---

## Skills inventory

Active skills in this repo (see [tessl.json](tessl.json) and `tiles/` for source-of-truth workflows, [.claude/skills/](.claude/skills/) and [.codex/skills/](.codex/skills/) for agent symlinks):
- **`brain-ingest`** (private, source in [tiles/brain-ingest/](tiles/brain-ingest/)) — capture requested ideas, knowledge and observations into the Notion Brain inbox. Explicit capture intent authorizes saving; ordinary pasted content does not. Uses destinations in `config/aaron-studio.json`.
- **`daily-log`** (private, source in [tiles/daily-log/](tiles/daily-log/)) — generate today's journal Facts section without touching Reflection.
- **`weekly-review`** (private, source in [tiles/weekly-review/](tiles/weekly-review/)) — draft weekly reviews from local brain evidence with confirmation gates.
- `blog-production` — orchestrate the blog workflow end-to-end: idea → plan → outline → article package → images → video → publishing.
- `blog-outline` — generate `plan.md` from a topic, rough notes, or `content-plan.md`.
- `blog-write` — generate the missing middle: EN/ZH article, X post, standalone tweet, newsletter teaser, YouTube script, and YouTube metadata.
- `tessl__blog-brainstorm` — generate `content-plan.md` (NOT full posts)
- `tessl__baoyu-article-illustrator` — generate blog images → `imgs/web/*.webp`
- `tessl__baoyu-image-gen` — standalone image generation
- `tessl__aaron-video-gen` (local in `tiles/`) — YouTube video assembly
- `publish-to-blog` (local) — blog publishing

Blog-specific conventions are in user memory `MEMORY.md` (directory naming, image compression, CTA rotation order).

Run `scripts/sync-agent-skills.sh` after adding or changing local skills so Claude, Codex, Cursor, and Gemini expose the same workflow set. Use `config/aaron-studio.json` for local paths.

---

## When you don't know something

1. Check [src/brain/world/INDEX.md](src/brain/world/INDEX.md) first.
2. `git log` the relevant directory — recent commits often explain context faster than re-reading.
3. Ask Aaron via AskUserQuestion rather than guessing — esp. for goals, decisions, and trust-level questions.

@AGENTS.md
