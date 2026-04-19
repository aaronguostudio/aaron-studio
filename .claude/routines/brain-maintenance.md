# Routine: Nightly Brain Maintenance

**Schedule:** Daily at 22:00 local (America/Edmonton MDT).
**Triggered by:** Anthropic Routines (cloud) — pulls repo, runs this spec, commits/pushes back.
**Author identity:** Routine commits should be signed as a clearly distinguishable author (see Commit Rules).

This spec is the authoritative definition of what the nightly routine does. The Routine UI prompt is intentionally minimal and delegates here so behavior iteration happens via `git diff` on this file, not via UI edits.

---

## Context — READ BEFORE EVERY RUN

Read in order:
1. [CLAUDE.md](../../CLAUDE.md) — project-wide conventions, privacy rules, continuous-ingest workflow.
2. [src/brain/world/INDEX.md](../../src/brain/world/INDEX.md) — relationships, project tiers, themes.
3. Latest file in [src/brain/reviews/weekly/](../../src/brain/reviews/weekly/) — most recent state delta.
4. [.claude/skills/daily-log/SKILL.md](../skills/daily-log/SKILL.md) — daily-log workflow.
5. [.claude/skills/weekly-review/SKILL.md](../skills/weekly-review/SKILL.md) — understand what weekly ingests (so you know what it already covers and you don't duplicate).

---

## Three Principles

1. **Capture + propose, never decide.** Low-risk, bounded writes get committed (daily log, stub proposals). Anything that would shape direction gets written to `_routine/` as a proposal, NOT to the canonical structure.
2. **Red-line directories — never touch:** `src/brain/goals/`, `src/brain/decisions/`, `src/brain/reviews/`. These are human-authored. Surface observations about them, never write to them.
3. **Privacy.** Same as CLAUDE.md — no external API calls with brain content. No web search. Local synthesis only.

---

## Workflow

### Phase 1 — Daily log (Tier 1: direct commit)

Invoke the [daily-log skill](../skills/daily-log/SKILL.md) for today. Follow its workflow verbatim.

Target: `src/brain/journal/YYYY/MM/YYYY-MM-DD.md`
- Write Facts section.
- Scaffold Reflection section (empty, prompts only) — only if file doesn't exist.
- Preserve any existing Reflection content if Aaron wrote it earlier.

### Phase 2 — Brain maintenance scan (Tier 2: write proposals)

Compute scope: since yesterday 22:00 local (the previous routine run). Use `git log --since="<24h ago>"` on `src/brain/`.

Collect signals:

1. **Orphaned archives** — files in `src/brain/world/_archive/<recent dates>/` that mention people/projects/orgs with no corresponding `world/people|projects|orgs/<slug>.md` node. Each → proposal to stub a node.

2. **Shallow repeat-mentions** — people/projects/orgs mentioned in ≥3 archives in the last 14 days whose `world/` node is still "stub-level" (body < ~40 lines, missing sections like `## Observations Timeline`, `## What to Watch`, or filled mostly with `(TBD)`). Each → proposal to deepen the node with specific content pulled from the recent archives.

3. **Implied decisions** — observations across `world/` in the last 7 days where the pattern reads "Aaron decided to X" or "Aaron is no longer pursuing Y" but no ADR exists in `src/brain/decisions/` for it. Each → proposal to stub an ADR (you propose; Aaron writes).

4. **Stale-but-revived nodes** — `world/` nodes whose `Last updated:` is >30 days old, but recent archives/observations mention them. Each → proposal to refresh.

5. **Contradiction candidates** — observation X from last 7 days appears to conflict with an earlier observation Y on the same node. Each → flag for Aaron review, don't attempt resolution.

### Phase 3 — Write maintenance report (Tier 2)

Target: `src/brain/_routine/YYYY-MM-DD-maintenance.md`

Create parent directory if missing: `mkdir -p src/brain/_routine`.

Template:

```markdown
---
type: routine-report
date: YYYY-MM-DD
status: awaiting-triage
generated_by: brain-maintenance routine
---

# Brain Maintenance — YYYY-MM-DD

## Daily log
- Written: `src/brain/journal/YYYY/MM/YYYY-MM-DD.md`
- Facts summary: <1-2 lines — N commits, N archives, N obs added>

## Proposals ({{count}})

### 1. <short title>
- **Type:** stub-node | deepen-node | stub-ADR | refresh-stale | contradiction
- **Target file:** <path>
- **Rationale:** <2-3 sentences: why this surfaced, what evidence>
- **Suggested content / next step:** <terse draft or question for Aaron>
- **Sources:** <list of archive/obs files supporting this>

### 2. ...

## Patterns noticed
- <2-3 sentences of trajectory observations — NOT action items. E.g., "Nova references dropped from 6/week to 1/week over last 3 weeks — clean exit is showing up in the data.">

## Red-line flags
- <only if something looks like it needs an ADR/goal update Aaron should know about. Otherwise omit section.>
```

**Length cap:** 2000 words max. If you hit the cap, keep top-priority proposals and drop the rest. Note the drop count at the bottom.

### Phase 4 — Commit & push

**Policy: always commit.** Every run leaves a trace in git log, even on quiet days. This is intentional — the daily commit IS the signal that the routine is alive. If nothing substantive changed, the maintenance report still records that fact (see "Quiet day handling" below).

```bash
git add src/brain/journal/ src/brain/_routine/
git -c user.name="Brain Routine" -c user.email="routine+brain@aaron-studio.local" \
  commit -m "routine: daily log + brain maintenance YYYY-MM-DD"
git push origin main
```

If `git diff --cached` is somehow empty at commit time (shouldn't happen — journal file is always written), create the commit with `--allow-empty` and note "nothing to write today" in the message body. This preserves the heartbeat.

**Quiet day handling:** If Phase 2 produced no proposals AND no pattern observations, the maintenance report still gets written with:

```markdown
---
type: routine-report
date: YYYY-MM-DD
status: quiet-day
generated_by: brain-maintenance routine
---

# Brain Maintenance — YYYY-MM-DD

## Daily log
- Written: `src/brain/journal/YYYY/MM/YYYY-MM-DD.md`
- Facts summary: <1-2 lines or "No repo activity since last run.">

## Proposals (0)

Quiet day — no proposals surfaced.

## Patterns noticed

<at minimum, one 1-sentence observation about what the quiet means — e.g., "No world/ observations added; likely deep-work or offline day.">
```

---

## Commit Rules

- **Author identity:** `Brain Routine <routine+brain@aaron-studio.local>` — clearly distinguishable from Aaron's commits via `git log --author=routine`.
- **One commit per run.** Don't split phase 1 / phase 2 — they're one logical unit.
- **Never force-push.** Never rebase. Never touch other branches.
- **If conflicts:** abort, write a minimal `_routine/YYYY-MM-DD-CONFLICT.md` explaining what happened, commit only that, push. Don't try to resolve conflicts autonomously.

---

## What this routine does NOT do

- Does not edit files in `src/brain/goals/`, `src/brain/decisions/`, `src/brain/reviews/`.
- Does not modify existing observations in world/ nodes (only proposes, never rewrites).
- Does not make web calls.
- Does not invoke other skills beyond `daily-log` (for reliability — self-contained).
- Does not create branches or PRs (keep simple: commit to main, Aaron reviews via git diff).
- Does not write the Reflection section of the daily journal (anti-sycophancy principle).
- Does not touch `src/inbox/` (that's Aaron's capture space).
- Does not touch `src/content/` (that's publishing, separate flow).

---

## Debugging / self-check before commit

Before `git push`, verify:

- [ ] Daily log file exists at correct path.
- [ ] Maintenance report length < 2000 words.
- [ ] No files written outside `src/brain/journal/` or `src/brain/_routine/`.
- [ ] No goals/decisions/reviews modified.
- [ ] If no meaningful proposals: report has "Patterns noticed" filled + explicit "Proposals (0)" note + `status: quiet-day` in frontmatter.
- [ ] Commit exists (option A — always commit, even quiet days).

If any check fails: print the failure reason, do NOT commit, exit nonzero so the Routine surfaces an error.

---

## Evolution

This is v1. When Aaron wants to expand scope (e.g., auto-PR for proposals with confidence >X), update this spec and iterate. The UI prompt should NOT change — only this file does.
