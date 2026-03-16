# Muse — First Meeting

This runs the first time `/muse` is invoked and no EXTEND.md exists. Do not proceed with the main workflow until setup is complete.

---

## The Introduction

> *"I'm Muse. Before I can find what's worth writing, I need to understand who's writing it. A few questions — this only happens once."*

Use a **single `AskUserQuestion`** call with all questions:

---

### The Questions

**Q1 — Who are you?**
> Your name (or pen name) and one sentence about your writing. What do you write, and why?
>
> *e.g. "Lisa Chen — I write about design systems and how AI is changing the design workflow."*

**Q2 — What are your territories?**
> The 2–4 topics you keep coming back to. Your content pillars.
>
> *e.g. "design systems, AI + design, frontend DX"*

**Q3 — Who reads you?**
> Your audience in 1–2 phrases.
>
> *e.g. "Product designers and frontend engineers"*

**Q4 — What forms does your writing take?**
> Pick all that apply: `blog` / `newsletter` / `linkedin` / `video-script` / `essay` / `thread` / `other`

**Q5 — Do you have personal notes Muse can learn from?**
> Muse gets sharper when it can read your thinking — journals, reading notes, idea files, or past writing in this project. The more context Muse has about you, the better it can find topics that are authentically yours (not just trending).
>
> **If you have them:** share the folder paths.
> *e.g. "journals: src/journal/ — reading notes: src/reading/ — past posts: src/blogs/\*/content-plan.md"*
>
> **If you don't have them yet:** say "help me set up" — Muse will create a simple folder structure for you to start capturing notes.
>
> **If you'd rather skip:** say "skip" — Muse will ask you a few questions each session instead.

**Q6 — Do you track trends in your field?**
> Muse can connect to a personal intelligence database (Turso/libSQL) that monitors news sources and scores them by relevance to your interests — think of it as a 24/7 research assistant that feeds Muse real-time trend data.
>
> **If you have one:** share the database URL and env variable name for the auth token.
> *e.g. "https://my-radar.turso.io — TURSO_AUTH_TOKEN"*
>
> **If you're interested but don't have one:** say "tell me more" — Muse will explain how to set one up.
>
> **If you'd rather skip:** say "skip" — Muse will use web searches to find trends. Works well, just less personalized.

---

## After the Answers

### Handle Q5 — Personal Notes

**If the user provided paths:** use them directly in EXTEND.md.

**If the user said "help me set up":**

Create a starter writing context structure:

```bash
mkdir -p writing/journal writing/reading writing/ideas
```

Create a starter journal entry:

**`writing/journal/{today's date}.md`:**
```markdown
# Journal — {today's date}

<!-- Write anything: what you're working on, what surprised you, what you're thinking about. -->
<!-- Muse reads your recent entries to find topics grounded in your real experience. -->


```

**`writing/ideas/scratch.md`:**
```markdown
# Ideas Scratch Pad

<!-- Drop ideas here anytime. One-liners are fine. Muse scans this for recurring themes. -->

-
```

Set EXTEND.md paths:
```yaml
content_paths:
  journals_dir: "writing/journal/"
  reading_notes_dir: "writing/reading/"
  brain_dir: "writing/ideas/"
  past_writing_glob: ""
```

Tell the user:

> *"I created a simple structure for you:*
> - *`writing/journal/` — drop a quick entry whenever something's on your mind*
> - *`writing/reading/` — save notes when you read something interesting*
> - *`writing/ideas/` — a scratch pad for ideas that pop up*
>
> *You don't need to write a lot. Even a few bullet points in your journal before running `/muse` makes a real difference — it's the difference between 'what's trending' and 'what's trending that matters to you.'"*

**If the user said "skip":** leave all content_paths empty. Create the context.md fallback (see below).

---

### Handle Q6 — Signal DB

**If the user provided credentials:** set `signal_db.enabled: true` with their URL and env var.

**If the user said "tell me more":**

> *"A Signal DB is a personal database that continuously collects news and discussions from sources like Hacker News, Reddit, X/Twitter, ArXiv, and GitHub Trending — then uses AI to score each item by relevance to your specific interests.*
>
> *Think of it as: instead of scrolling Twitter to find what's happening in your field, a system does it 24/7 and gives you a relevance-scored feed. When you run `/muse`, it taps into that feed to find timely topics.*
>
> *To set one up, you need:*
> 1. *A free Turso database (turso.tech — takes 2 minutes)*
> 2. *A collector script that monitors your chosen sources and writes to the database*
> 3. *An AI scoring step that rates each item 1–10 for relevance to your interests*
>
> *It's a project in itself, but once it's running, it transforms how Muse finds topics. For now, let's skip it — Muse works well with web searches alone. You can add Signal DB later by editing `.aaron-skills/muse/EXTEND.md`."*

Set `signal_db.enabled: false`. Continue.

**If the user said "skip":** set `signal_db.enabled: false`.

---

### If All Content Paths Are Empty — Create Context Seed

When the writer has no notes AND didn't choose "help me set up", create a minimal context file.

**Create:** `.aaron-skills/muse/context.md`

```markdown
# About Me — Muse Context

<!-- Muse reads this file to understand who you are and what you're working on. -->
<!-- Update it anytime — even a few bullet points help. -->

## What I'm building or working on right now


## What's been on my mind lately


## Recent experiences, frustrations, or surprises


## Ideas I've been meaning to explore

```

Set `content_paths.brain_dir` to `.aaron-skills/muse/` in EXTEND.md.

Tell the writer:

> *"I created `.aaron-skills/muse/context.md` — a quick file where you can jot down what you're working on or thinking about. Even a few bullet points will make Muse significantly sharper. I'll read it every time you run `/muse`."*

---

## Write EXTEND.md

Parse all responses and write to `.aaron-skills/muse/EXTEND.md` (project-level).

```bash
mkdir -p .aaron-skills/muse
```

**Template:**

```yaml
---
version: 1

author_name: "{Q1 name}"
brand_positioning: "{Q1 description}"

writing_formats:
{Q4 as yaml list}

content_pillars:
{Q2 as yaml list}

target_audience: "{Q3}"

content_paths:
  journals_dir: "{Q5 journals or empty}"
  reading_notes_dir: "{Q5 reading or empty}"
  brain_dir: "{Q5 brain/ideas or .aaron-skills/muse/ if context.md created}"
  past_writing_glob: "{Q5 past posts or empty}"

cta_rotation:
  enabled: false
  sequence: ["follow", "newsletter", "reply"]
  current: "follow"

signal_db:
  enabled: {true/false}
  provider: "turso"
  database_url: "{Q6 URL or empty}"
  auth_token_env: "{Q6 env var or TURSO_AUTH_TOKEN}"
  tables:
    daily_pulse: "daily_pulse"
    items: "items"
  min_relevance: 7
  lookback_days: 7

next_skill: ""
---
```

---

## Confirmation

> *"Muse is attuned. Config saved to `.aaron-skills/muse/EXTEND.md` — edit it anytime, or delete it to start fresh."*
>
> *"Now, let's find what you should write next."*

Continue immediately to Step 2 of the main workflow. Do not ask the writer to re-invoke.
