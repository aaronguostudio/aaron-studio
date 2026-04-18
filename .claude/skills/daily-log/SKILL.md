---
name: daily-log
description: Generate today's daily journal Facts section for Aaron — reads git log, world/_archive, world/ observation deltas, inbox, logs, content changes since local midnight, writes to src/brain/journal/YYYY/MM/YYYY-MM-DD.md. Preserves any existing Reflection section Aaron wrote. Designed to be both manually invoked ("daily log", "今日日志") AND runnable headlessly via launchd at 22:00 nightly. Idempotent on same day.
---

# daily-log

Drives Aaron's daily journaling cadence. Splits the journal into two layers:

- **Facts (auto)** — this skill writes it: what shifted in the repo today
- **Reflection (human)** — Aaron fills in: mood, tensions, insight, tomorrow's top 1

Per [CLAUDE.md](../../../CLAUDE.md) anti-sycophancy principle (cf. Thiago), the skill MUST NOT write the Reflection section. Value of journaling is in self-examination — don't take it away from Aaron.

## When to invoke

- Manual: "daily log", "今日日志", "write today's journal", "log today"
- Headless: Launched by `~/Library/LaunchAgents/com.aaron.daily-log.plist` nightly at 22:00 via `claude -p` invocation of this skill.

If the user asks for yesterday / a specific date, accept that scope — but default is today (local time).

## Hard rules

1. **Write the Facts section only. Never populate Reflection.** If Reflection already has content, leave it untouched.
2. **Idempotent.** If today's journal file already has a `## Facts (auto)` section, REPLACE only that section's contents. Don't create duplicates.
3. **Empty day is still a day.** If git log + archive + observations are all empty, still write the file with "Quiet day — no repo activity detected." Aaron may still want to reflect.
4. **No confirm gate.** Unlike `brain-ingest` and `weekly-review`, this runs headless. Must be safe to auto-write. Scope is bounded (one file, one section, same day, idempotent).
5. **Privacy.** Same rules as [CLAUDE.md](../../../CLAUDE.md) — no external APIs, no web search, local-only.
6. **Local time.** Use `date +%Y-%m-%d` for the target date. Cron fires at 22:00 local; the skill trusts that.

## Workflow

### Step 1: Determine target date + file path

```bash
TODAY=$(date +%Y-%m-%d)       # e.g. 2026-04-18
YEAR=$(date +%Y)              # 2026
MONTH=$(date +%m)             # 04
DOW=$(date +%A)               # Friday
```

Target: `src/brain/journal/$YEAR/$MONTH/$TODAY.md`

Ensure parent directory exists (`mkdir -p src/brain/journal/$YEAR/$MONTH`).

### Step 2: Gather evidence in parallel

1. **Git log (since local midnight):**
   ```bash
   git log --since="$TODAY 00:00" --until="$TODAY 23:59" \
     --pretty=format:"- %h %s" \
     -- src/brain/ src/inbox/ src/content/ src/projects/
   ```

2. **New archive files today:**
   ```bash
   ls src/brain/world/_archive/$TODAY/ 2>/dev/null
   ```

3. **World/ observation deltas today:**
   Grep `src/brain/world/` files for observation lines added today (pattern: `- **$TODAY**` or `- $TODAY:`). For each hit, note the node and the first line of the observation.

4. **Inbox current state:**
   Read `src/inbox/todo.md` and `src/inbox/scratch.md` fully. Diff against what they looked like at start of today (use `git show HEAD:src/inbox/todo.md` if there were commits today touching it — otherwise skip diff and just note current state).

5. **Logs updates today:**
   Check if `src/brain/logs/cf.md` or `src/brain/logs/oc.md` have commits from today. If yes, note delta.

6. **Content shipped today:**
   Anything in `src/content/` committed today — list the file paths.

### Step 3: Check existing journal file

If `src/brain/journal/$YEAR/$MONTH/$TODAY.md` exists:
- Read it.
- Find `## Facts (auto)` section boundary (next `---` or `##` or EOF).
- Note whether `## Reflection` section exists and what it contains.

If file doesn't exist: create fresh.

### Step 4: Compose Facts section

Use this template:

```markdown
## Facts (auto)

_Generated {{TODAY HH:MM}} by daily-log skill._

### Commits ({{N}})
{{git log bullets, or "None"}}

### Brain activity
- Archived to `world/_archive/{{TODAY}}/`: {{N}} file{{s}}
{{- bullet for each archive slug, with 1-line summary if available from frontmatter title}}
- World nodes with new observations today: {{N}}
{{- node path — first-line observation snippet}}

### Inbox
- `todo.md`: {{current line count}} items ({{delta if known}})
- `scratch.md`: {{current line count}} lines

### Work hour logs
{{- cf.md: +Xh today (if committed)}}
{{- oc.md: +Xh today (if committed)}}
{{(omit section entirely if no log changes)}}

### Content shipped
{{- file path (if content/ committed today)}}
{{(omit section entirely if no content changes)}}
```

If a subsection has no data, omit it entirely. Don't write "None" everywhere — keep the output scannable.

### Step 5: Compose Reflection section (scaffold only)

**Only write this scaffold if the file doesn't exist yet.** If file exists and Reflection already has content, leave it alone.

```markdown
## Reflection

_Aaron: fill in tomorrow morning over coffee. The scaffold is prompts, not a form — answer what resonates, skip what doesn't._

### How did today go?

### What surprised me?

### What's bothering me?

### What's compounding?

### Energy (1-10):

### Tomorrow's top 1:
```

### Step 6: Compose frontmatter

If file doesn't exist:

```yaml
---
type: journal
date: {{TODAY}}
status: draft
tags: []
generated_by: daily-log skill
---

# {{TODAY}} — {{DOW}}
```

If file exists: keep existing frontmatter untouched.

### Step 7: Write

**File doesn't exist:** Write full file (frontmatter + H1 + Facts + Reflection scaffold).

**File exists with Facts section:** Replace only the Facts section contents. Use Edit tool with old_string = current Facts section, new_string = fresh Facts section.

**File exists without Facts section** (Aaron wrote reflection first): Insert Facts section BEFORE Reflection. If no Reflection either, append Facts after the H1.

### Step 8: Report

Interactive mode (Aaron ran manually):
```
Daily log → src/brain/journal/2026/04/2026-04-18.md
Facts: {{N}} commits, {{N}} archives, {{N}} node obs, {{N}} inbox items
Reflection: {{untouched | scaffold written}}
```

Headless mode (launchd): print the same report to stdout. launchd captures to a log file.

## Safety checks

Before writing, verify:
- Target path is inside `src/brain/journal/` (not elsewhere).
- Facts section is less than 2000 chars. If it's bigger, something went wrong (runaway git log?) — truncate and flag in report.
- Never write images, never call external APIs.

## What this skill does NOT do

- Does not write the Reflection content (only scaffold).
- Does not modify observation entries in world/ nodes — it reports them, doesn't change them.
- Does not update `goals/` or `decisions/`.
- Does not run on dates other than today unless explicitly asked.
- Does not invoke other skills (self-contained for headless reliability).
- Does not commit to git — leaves the file unstaged for Aaron to review.

## Example output (file doesn't exist yet)

```markdown
---
type: journal
date: 2026-04-18
status: draft
tags: []
generated_by: daily-log skill
---

# 2026-04-18 — Friday

## Facts (auto)

_Generated 2026-04-18 22:02 by daily-log skill._

### Commits (3)
- a6f96c2 feat: document observations and decisions from April 18 meetings
- c2cccd5 feat: add observations and decisions from W16 review
- b258048 refactor: remove brain-ingest skill and related configurations

### Brain activity
- Archived to `world/_archive/2026-04-18/`: 1 file
  - jon-vgbt-sync-client-portal-db-security
- World nodes with new observations today: 3
  - people/justin-anderson.md — Aaron locks Nova decline externally in Jon 1:1
  - projects/nova.md — external articulation of decline
  - people/aaron.md — declined Justin's final 50/50 offer

### Inbox
- `todo.md`: 7 items
- `scratch.md`: 14 lines

## Reflection

_Aaron: fill in tomorrow morning over coffee. The scaffold is prompts, not a form — answer what resonates, skip what doesn't._

### How did today go?

### What surprised me?

### What's bothering me?

### What's compounding?

### Energy (1-10):

### Tomorrow's top 1:
```
