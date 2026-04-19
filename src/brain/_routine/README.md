# _routine/ — Autonomous routine reports

Output directory for Anthropic Routines (cloud-scheduled Claude) running the brain-maintenance routine defined in [`.claude/routines/brain-maintenance.md`](../../../.claude/routines/brain-maintenance.md).

## What ends up here

- `YYYY-MM-DD-maintenance.md` — nightly brain maintenance report with proposals + pattern observations. Written automatically at ~22:00 local.
- `YYYY-MM-DD-CONFLICT.md` — only written if the routine hit a git conflict and couldn't proceed.

## How to use it

Each morning over coffee, open the newest maintenance report. For each proposal:
- **Accept** → do the suggested write yourself (via `/brain-ingest` or manual).
- **Defer** → move to `src/inbox/scratch.md` for weekly review consideration.
- **Reject** → just close; the next run won't re-propose identical things unless the underlying signal changes.

After triage, you can delete the report or let it accumulate as a paper trail. Weekly review already reads from this directory (optional — add if you want the paper trail in reviews).

## What this directory does NOT contain

- Human-authored content. If you find yourself editing a report here, move the edit to the proper target (`world/`, `decisions/`, `goals/`) and delete the report entry.
- Decisions, goals, or reviews — those stay in their canonical directories.
