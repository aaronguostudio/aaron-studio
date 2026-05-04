---
name: weekly-review
description: Generate a weekly review draft for Aaron — gathers state from git log (journal, logs, world, inbox), cross-references goals/current-quarter.md, optionally enriches with web search for themes touched, then writes to src/brain/reviews/weekly/YYYY-Wnn.md and updates affected world/ node Observations. Use when Aaron says "weekly review", "review last week", "recap", "总结一下最近的工作", "周回顾", "what did I do this week", "draft my review".
---

# weekly-review

Drives Aaron's Friday-evening reflection cadence (per [reviews/README.md](../../../src/brain/reviews/README.md)). Default scope: last 7 days (ISO week). Override on request ("last 2 weeks", "since Monday", "this month").

A review is **shallow** if it doesn't produce at least one `world/` node update OR one `decisions/` ADR. Drive toward depth.

## When to invoke

User actions that should trigger this skill:
- "weekly review" / "周回顾" / "review last week" / "recap"
- "总结一下最近的工作" / "what have I been doing"
- "draft my review" / "Friday review"
- Aaron asks for a state-of-the-week or progress check

If the user wants a different cadence (monthly / quarterly), DO NOT use this skill — read [reviews/README.md](../../../src/brain/reviews/README.md) and use the matching template.

## Hard rules

1. **Always confirm before writing.** Show the full draft + proposed `world/` updates + filename. Wait for explicit OK.
2. **One review per week.** Filename `YYYY-Wnn.md` (ISO week). If file already exists for the target week, ask whether to overwrite, append, or pick a different week.
3. **Drive toward depth.** Per [reviews/README.md](../../../src/brain/reviews/README.md), every review must produce ≥1 world/ node update OR ≥1 ADR. If your draft has neither, surface that gap to Aaron — don't quietly ship a shallow review.
4. **External enrichment is opt-in & light.** Default = no web search. If Aaron says "include web context" or "what's happening in X", do focused searches (max 2-3 queries, 1 per top theme). Never random news scraping.
5. **Privacy.** Per [CLAUDE.md](../../../CLAUDE.md), `brain/` content is private. If using web search, search ABOUT topics ("AI-native firm management trends Q2 2026"), never paste private observations or names into queries.

## Workflow

### Step 1: Determine scope

- Default: ISO week containing today's date - 7 days. Compute current ISO week with `date +%G-W%V`.
- Confirm scope with Aaron in 1 line: *"Reviewing week 2026-W15 (Apr 6–12). OK?"*
- If user gave a custom range, use it.

### Step 2: Gather internal evidence

Run in parallel:

1. **Git log** — `git log --since="<scope-start>" --until="<scope-end>" --pretty=format:"%h %ad %s" --date=short -- src/brain/journal/ src/brain/logs/ src/brain/world/ src/inbox/ src/content/`
2. **New raw evidence** — list files in `src/brain/world/_archive/` whose date dir falls in scope.
3. **Journal entries** — read `src/brain/journal/YYYY/MM/` files in scope.
4. **Logs** — read `src/brain/logs/cf.md` and `src/brain/logs/oc.md` for hour deltas in scope.
5. **Inbox state** — read `src/inbox/todo.md` and `src/inbox/scratch.md` (full current state).
6. **Goals** — read `src/brain/goals/current-quarter.md`.
7. **Last review** — read most recent file in `src/brain/reviews/weekly/` (for continuity / what was deferred).

### Step 3: Identify themes & affected nodes

From the gathered evidence, extract:

- **Top 3-5 themes** this week (e.g., "OrgNext launch prep", "Mawer team transition", "blog series on AI agents").
- **People mentioned** → match to `src/brain/world/people/` nodes.
- **Projects touched** → match to `src/brain/world/projects/` nodes (note tier: 🟢🟡🔴⚪).
- **Decisions made** → did anything qualify for an ADR? If yes, flag for `src/brain/decisions/`.
- **Goal drift signals** → which OKRs in `current-quarter.md` were touched (advanced / slipped / ignored)?

### Step 4: External enrichment (optional)

Default: SKIP. Only do this if Aaron explicitly asked for external context, OR you suspect a theme has timely external signal worth surfacing (e.g., a competitor announcement, a trend Aaron's content addresses).

If enriching:
- Pick the **top 1-2 themes** only.
- WebSearch with neutral queries — topic only, no private context.
- Surface 2-4 sentences per theme: what's happening externally, how it intersects Aaron's work this week.
- Cite URLs in the review draft.

**Future hooks** (not implemented yet — flag to Aaron when he wires these up):
- Calendar (Google Calendar MCP) — pull meetings from scope window, cross-reference with journal entries
- Slack / X / GitHub — activity surface
- Newsletter / inbox emails — what's caught Aaron's attention

### Step 5: Draft the review

Use [src/brain/reviews/weekly/.template.md](../../../src/brain/reviews/weekly/.template.md). Fill every section with concrete content (no placeholder `_TBD_` left behind unless genuinely no data).

**Quality bar per section:**

- **What changed (state)** — concrete numbers (hours, file counts, commits), specific people/projects. Not vague.
- **What I learned (insight)** — 3 *non-obvious* things. If you can only list "I worked on X" tier observations, push back — go deeper or admit the week was mostly tactical.
- **What's next (intent)** — top 3 + anti-list. Anti-list is required (forces priority).
- **Goals/OKR check** — explicit on track / slipping / drop, mapped to `current-quarter.md` items.
- **Inbox processed** — list each item touched + its destination.
- **Energy/mood** — single number + one sentence. Don't skip.

If external enrichment ran, add a section:
```markdown
## External context
- **Theme A**: <2-4 sentence summary, with URL citation>
```

### Step 6: Identify world/ node updates

For each affected `world/` node, draft a 1-3 sentence Observation entry to append:
```markdown
- **YYYY-MM-DD** — <observation about this week's activity affecting this node> (source: [[../reviews/weekly/YYYY-Wnn]])
```

For decisions surfaced, stub an ADR file path: `src/brain/decisions/YYYY-MM-DD-<slug>.md` (don't write content yet, just propose).

### Step 7: Confirm with Aaron — REQUIRED GATE

Show, in this order:
1. **Draft review** (full markdown buffer)
2. **Target filename**: `src/brain/reviews/weekly/YYYY-Wnn.md`
3. **Proposed world/ Observations** (one per affected node — show diff-style)
4. **Proposed ADRs** (filenames + 1-line "Why" per ADR — Aaron fills in body later)
5. **Depth check**: confirm review has ≥1 world/ update OR ≥1 ADR. If neither, flag: *"This review is shallow — no node updates or decisions. Want to dig deeper or ship as-is?"*

Then: *"OK to write? (y / edit / cancel)"*

### Step 8: Write

On confirm:
- Write the review file.
- Append Observation entries to each affected world node (use Edit, not Write — preserve existing content).
- Stub ADR files (frontmatter + "Why: TBD by Aaron" placeholder).
- If goals drifted, do NOT auto-edit `current-quarter.md` — surface the drift in the review and let Aaron decide.

### Step 9: Report

```
Review written → src/brain/reviews/weekly/2026-W15.md
Updated → world/people/X.md, world/projects/Y.md (2 nodes)
Stubbed → decisions/2026-04-15-<slug>.md (Aaron: fill in Why)
Goal drift flagged → O2.KR1 slipping (see review § Goals/OKR check)
```

## Examples

### Example 1: Default Friday review

```
Aaron: 总结一下最近的工作

Skill:
  1. Scope: 2026-W15 (Apr 6–12). Confirms.
  2. Git log + reads journal/logs/inbox/goals.
  3. Identifies themes: OrgNext beta prep (heavy), Mawer team handoff (medium), 1 blog post shipped.
  4. No external enrichment (not requested).
  5. Drafts review with state/insight/intent.
  6. Identifies updates: world/projects/orgnext.md, world/people/keri.md.
  7. Flags 1 ADR: "Decided to push OrgNext beta from Apr 20 → May 4".
  8. Shows full draft + updates to Aaron.
  9. Aaron: "looks good but Energy was 6 not 7"
  10. Skill applies edit, re-confirms.
  11. Writes everything.
```

### Example 2: Review with external context

```
Aaron: weekly review, and check what's happening with Anthropic's agent SDK — I've been building on it

Skill:
  1. Scope: current week.
  2. Same internal gathering.
  3. Top theme: agent SDK work.
  4. WebSearch: "Anthropic Claude Agent SDK April 2026 updates".
  5. Surfaces 2-3 relevant updates with citations.
  6. Drafts review with "External context" section.
  7. Confirms → writes.
```

### Example 3: Shallow week pushback

```
Aaron: review last week

Skill:
  1. Gathers — finds mostly tactical work (no decisions, no notable observations).
  2. Drafts a thin review.
  3. Step 7: surfaces depth gap: "No world/ updates or ADRs surfaced. Want to think harder about what shifted, or ship as a 'maintenance week' review?"
  4. Aaron: "Honestly maintenance week. Ship as-is."
  5. Writes the thin review (Aaron's call, not auto-deepened).
```

## What this skill does NOT do

- Does not auto-write without confirmation.
- Does not edit `goals/current-quarter.md` (surfaces drift, Aaron decides).
- Does not write ADR bodies (only stubs them — Aaron fills in Why).
- Does not handle monthly/quarterly reviews (different templates, different cadence).
- Does not paste private `brain/` content into web search queries.
- Does not silently ship shallow reviews — always surfaces the depth gap first.
