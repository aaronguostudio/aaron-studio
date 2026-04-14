---
name: brain-ingest
description: Ingest any raw input — meeting notes, screenshots, emails, messages, articles, file paths — into Aaron's brain (src/brain/). Routes to the right subdir, parses images to text, updates affected world/ nodes, and always confirms before writing. Use when Aaron pastes content with no specified destination, or says "save this", "ingest", "remember this", "put this in the brain".
---

# brain-ingest

The single capture point for Aaron's brain. Removes the "where does this go?" decision.

## When to invoke

User actions that should trigger this skill:
- Pastes meeting notes, message screenshots, email content, transcripts
- Drops a file path or image attachment with no instruction
- Says "save this", "remember this", "ingest this", "put this in my brain", "存进 brain"
- Provides any raw evidence about a person, project, org, or topic without saying where to file it

If the user gives an explicit destination ("add this to keri's node", "save to reading"), DO NOT invoke this skill — just write directly.

## Hard rules

1. **Always confirm before any write.** Show the user the parsed content + target file path + node updates. Wait for explicit OK.
2. **No external APIs for image parsing.** Use Claude's native vision only (already in-session). Per [CLAUDE.md](../../CLAUDE.md) privacy rule, brain content never leaves the machine.
3. **One source per ingest.** Never batch. If the user pastes 3 things, run the workflow 3 times.
4. **Text only by default.** Don't save images to the repo. Parse to text. Add a note in the file: `> Originally captured as image; parsed via Claude vision on YYYY-MM-DD.`
5. **Image originals (rare):** Only if user explicitly says "keep the original" — save to `~/.aaron-studio-attachments/YYYY-MM-DD/<slug>.<ext>` (outside the repo, not synced) and reference the path in the parsed file.

## Workflow

### Step 1: Read the raw

- If text → use directly.
- If image (path or attachment) → use the Read tool to get vision parse. Extract:
  - Verbatim quotes (preserve exactly — names, numbers, code).
  - Speaker / sender if visible.
  - Timestamp if visible.
  - Channel / context (Slack channel, email thread, meeting title).
- If file path → Read it.

### Step 2: Classify destination

Decide which `src/brain/` subdir is the right home. Pick exactly one:

| Type of input | Destination | Filename |
|--------------|-------------|----------|
| Observation about a person/org/project (message, screenshot, transcript snippet, behavior signal) | `src/brain/world/_archive/YYYY-MM-DD/` | `<slug>.md` (descriptive: `justin-redis-pushback.md`) |
| Article, book excerpt, external resource Aaron read | `src/brain/reading/YYYY/` | `YYYY-MM-DD-<slug>.md` |
| Personal cheatsheet, snippet, how-to | `src/brain/notes/` | `<slug>.md` |
| Daily reflection, mood, stream-of-consciousness | `src/brain/journal/YYYY/MM/` | `YYYY-MM-DD.md` (append if exists) |
| Routine, identity-level, lifestyle | `src/brain/life/` | `<slug>.md` |
| Action item or scratch | `src/inbox/todo.md` or `scratch.md` (append) | n/a |

If unsure between two destinations → ask the user, don't guess.

### Step 3: Draft the file

Write the file content as a markdown buffer (don't save yet):

**Standard frontmatter:**
```yaml
---
type: <reading | note | journal | observation | life>
date: YYYY-MM-DD
status: active
tags: [...]
captured_via: brain-ingest skill
source: <slack | email | meeting | screenshot | article-url | manual | etc.>
related:
  - "[[../../world/people/<name>]]"   # if applicable
  - "[[../../world/projects/<name>]]" # if applicable
---
```

**Body sections (for world/_archive entries):**
```markdown
# <Title>

**Date:** YYYY-MM-DD
**Source:** <where this came from>
**Captured by:** brain-ingest skill (Claude vision parse) | manual paste
**Related:** [[people/X]], [[projects/Y]]

## Raw Content

<verbatim quote / parse / paste>

## Context

<2-4 sentences: why this matters, what surrounds it, why Aaron shared it now>
```

For other destinations, match the existing format in that subdir (read 1 example file first).

### Step 4: Identify world/ node impacts

If destination is `world/_archive/` OR if the content references a known world entity:

- Grep `src/brain/world/` for mentioned names / projects / orgs.
- For each matched node, draft a 1-3 sentence Observation entry to append:
  ```markdown
  - **YYYY-MM-DD** — <observation> (source: [[../_archive/YYYY-MM-DD/<slug>]])
  ```
- Identify whether this contradicts existing content in any node. If yes, flag for an ADR in `src/brain/decisions/`.

### Step 5: Confirm with Aaron — REQUIRED GATE

Show the user, in this order:

1. **Parsed text** (if from image) — full extracted content. Ask: *"Did I parse this correctly? Any names/numbers/code I should fix?"*
2. **Target file path** — where you propose to write.
3. **Draft file content** — the markdown buffer.
4. **Node updates** — for each affected `world/` node, the proposed Observation entry to append.
5. **Contradiction flags** — if any.

Then: *"OK to write? (y / edit / cancel)"*

Do not write any file before this confirmation. If the user says "edit", apply the change and re-confirm.

### Step 6: Write

On confirm:
- Write the new raw file.
- Append Observation entries to each affected world node (use Edit tool, not Write — preserve existing content).
- Update the affected node's `Last updated:` field if present.
- If contradictions flagged: stub an ADR in `src/brain/decisions/YYYY-MM-DD-<slug>.md` and tell the user to fill in the "Why" section.

### Step 7: Verify the audit trail

Per [CLAUDE.md](../../CLAUDE.md) continuous-ingest rule: confirm the new raw file path is cited in at least one updated node's Observations. If destination was non-`world/`, this step is skipped.

Report back to the user:
```
Ingested → src/brain/.../<file>
Updated → world/people/X.md, world/projects/Y.md
Flagged → 1 contradiction → src/brain/decisions/YYYY-MM-DD-<slug>.md (needs Why)
```

## Examples

### Example 1: Slack screenshot dropped in chat

```
User: [drops image of a Slack message from Justin]

Skill:
  1. Reads image via vision tool
  2. Extracts: "From Justin Anderson, posted in #nova-builders, 2026-04-09:
     'Dear Nova Builders, I was proud of what the team accomplished...'"
  3. Classifies → world/_archive/2026-04-09/justin-post-retreat-message.md
  4. Drafts file with frontmatter + Raw Content + Context sections
  5. Greps world/ → finds matches: justin-anderson, nova, duncan-mountford, narek
  6. Drafts Observations for each
  7. SHOWS ALL OF THE ABOVE TO USER
  8. User: "looks good, but Alex's name is misspelled — it's Alex not Aleks"
  9. Skill applies edit, re-confirms
  10. User: "y"
  11. Writes file + appends to 4 world nodes
  12. Reports paths
```

### Example 2: Pasted article URL + summary

```
User: just read this https://example.com/post — Karpathy on second brain. Save it.

Skill:
  1. Treats as reading note (URL + summary intent)
  2. Classifies → src/brain/reading/2026/2026-04-13-karpathy-second-brain.md
  3. Drafts using existing reading note format (read prior example first)
  4. No world/ updates expected (informational)
  5. Confirms → writes
```

### Example 3: Quick action item

```
User: remember to follow up with Keri about the org refactor next week

Skill:
  1. Classifies → inbox/todo.md (action item)
  2. Drafts append: "- Follow up with Keri about org refactor (next week)"
  3. Confirms → appends
  4. Suggests: "Want me to also add an Observation to world/people/keri.md noting this pending discussion?"
```

## What this skill does NOT do

- Does not auto-process content without confirmation.
- Does not write images to the repo.
- Does not call external APIs.
- Does not invent destinations — if it can't classify cleanly, it asks.
- Does not handle batch ingests — one source per invocation.
- Does not modify [goals/](../../src/brain/goals/), [reviews/](../../src/brain/reviews/), [decisions/](../../src/brain/decisions/) — those are human-authored or generated by the weekly review workflow, not raw capture.
