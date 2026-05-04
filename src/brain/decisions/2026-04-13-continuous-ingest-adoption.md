---
type: decision
date: 2026-04-13
status: stub
tags: [brain, infrastructure, workflow]
related:
  - "[[../reading/2026/2026-04-13-karpathy-second-brain]]"
  - "[[../reviews/weekly/2026-W16]]"
---

# Adopt Karpathy continuous-ingest workflow for brain/

## Context
Karpathy second-brain reading note (Apr 13). Pattern: human owns raw + schema, LLM owns wiki maintenance, one source at a time, no batching.

## Decision
- Raw evidence → `src/brain/world/_archive/YYYY-MM-DD/` (one file per source).
- Wiki updates happen immediately, not at weekly review.
- Per-node Observations + `git log` are the audit trail — no global ingest log.

## Why
_TBD by Aaron._

(prompts to address: Why reject the batched weekly-review writeup pattern? What concrete failure of batching motivated this? Why trust LLM with wiki maintenance but not with raw capture?)

## Consequences
- Weekly review's role shifts from "state capture" to "trajectory assessment" — cleanly validated in W16, which surfaced goal-layer gap rather than restating events.
- Requires discipline: one source at a time, no batching. Breaks if Aaron lets raw evidence queue up.
- No separate audit log to maintain / drift from.
- If the pattern starts failing (e.g., Observations drift from raw, nodes contradict each other), the tell will be in contradictions surfaced during weekly review.
