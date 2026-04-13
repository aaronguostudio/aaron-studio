# CLAUDE.md — Aaron Studio Agent Guide

@AGENTS.md

> Read this first, every session. This repo is Aaron's "personal life clone" — a private knowledge system. Your job is to **understand Aaron**, then help him **grow over time**.

---

## Who is Aaron

Aaron Guo — Senior Manager & Partner at **Mawer** (day job, leading dev+QA, Head of Products), simultaneously building **OrgNext** as CEO (AI-native firm management software, big bet). Long-termist. 生酮 + 间歇性断食 + routine-driven. Core identity: *"I don't care what tools, I want to solve business problems."*

**Always read for current state:**
1. [src/brain/world/people/aaron.md](src/brain/world/people/aaron.md) — self node, identity anchors
2. [src/brain/world/INDEX.md](src/brain/world/INDEX.md) — relationships, project tiers (🟢🟡🔴⚪), themes
3. [src/brain/goals/current-quarter.md](src/brain/goals/current-quarter.md) — active OKRs
4. [src/brain/life/routine.md](src/brain/life/routine.md) — weekly cadence (when Aaron is in deep work vs. family time)
5. Latest [src/brain/reviews/weekly/](src/brain/reviews/weekly/) entry — most recent state delta

When in doubt about *what's going on*, traverse [src/brain/world/](src/brain/world/) via `[[wikilinks]]` — it's a graph, follow relationships.

---

## Repo map

```
src/
├── brain/         ← Aaron's operating system. READ FIRST.
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
| "Today I..." (daily log) | `src/brain/journal/YYYY/MM/YYYY-MM-DD.md` |
| Observation about a person/org/project | Update Observations in [src/brain/world/](src/brain/world/) node |
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

## Growth loop — your most important job

Aaron didn't build this repo to chat. He built it to **grow over time**. The loop:

```
daily journal ──┐
                ├─► weekly review ─► world/ deltas + decisions/ ADRs
world/ ─────────┤                          │
goals/ ─────────┤                          ▼
inbox ──────────┘                  monthly → quarterly → goals/ update
```

**Every Friday** (or when Aaron asks), generate a weekly review draft from:
- This week's `git log` on `src/brain/journal/`, `src/brain/logs/`, `src/brain/world/`
- New entries in `src/inbox/`
- The current [src/brain/reviews/weekly/.template.md](src/brain/reviews/weekly/.template.md)

Then ask Aaron to react/edit. Use the result to:
1. Update relevant `world/` node Observations
2. Propose ADRs for any decisions
3. Re-check `goals/current-quarter.md` for drift

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

Active skills in this repo (see [tessl.json](tessl.json) and `tiles/`):
- `tessl__blog-brainstorm` — generate `content-plan.md` (NOT full posts)
- `tessl__baoyu-article-illustrator` — generate blog images → `imgs/web/*.webp`
- `tessl__baoyu-image-gen` — standalone image generation
- `tessl__aaron-video-gen` (local in `tiles/`) — YouTube video assembly
- `publish-to-blog` (local) — blog publishing

Blog-specific conventions are in user memory `MEMORY.md` (directory naming, image compression, CTA rotation order).

---

## When you don't know something

1. Check [src/brain/world/INDEX.md](src/brain/world/INDEX.md) first.
2. `git log` the relevant directory — recent commits often explain context faster than re-reading.
3. Ask Aaron via AskUserQuestion rather than guessing — esp. for goals, decisions, and trust-level questions.
