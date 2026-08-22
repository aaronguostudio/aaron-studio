# Red-Team Review

Reviewed: 2026-08-15, against draft v1 (post style-gate 100/100 — the scanner catches slop, not argument weakness; this pass attacks the argument).

## AI-Like Or Generic Sections

- R6: "Which raises the obvious question: what exactly is that thing doing?" — one-line transition paragraph. Read aloud it works as a rhythm break before the mechanism section; borderline but natural. Verdict: keep intentionally (recorded below).

## News Summary Without Original Judgment

- Launch-facts section stays under two paragraphs and pivots to the teardown and reconciliation; within the sub-20% recap budget. No violation. The HN quote is reception color, not argument — acceptable at one sentence.

## Claims That Need Stronger Evidence

- R1 (**required fix**): "Your existing assets work on day one, unmodified." Overclaim, and internally inconsistent — the very next paragraph documents 23/30 hook events unsupported. The verified claim (C7) covers skills and instruction files, not "assets" broadly; HuaShu's testing also showed hooks silently failing on name-casing. Scope the sentence to skills and instruction files.
- R2 (**required fix**): "nine weeks of two-hundred-commits-a-day effort" — 12,293/64 ≈ 192/day. "Two hundred" rounds up an actual number that's load-bearing for credibility. Use "nearly two hundred."
- R3 (**required fix**): "If someone runs the counter-experiment... Nobody has." Asserts absence I haven't verified — a null-result study could exist unpublished or unindexed. Downgrade to personal epistemic state: "I haven't seen one."

## Paragraphs To Cut Or Merge

- R4 (**required fix**): The Part 2 personal beat ("has never felt like a difference in raw intelligence... Same worker, different manager") is the weakest evidence in the piece — an unfalsifiable feel-claim a skeptic dismisses in one line ("name the task"). Options: (a) add a dated concrete incident — rejected, no verified incident to cite and inventing one violates the ledger; (b) compress the paragraph to what is honestly observable (which layer's levers differ across daily use) and let the verified anchors (July workflow experience, the teardown) carry personal authority. Choose (b): smaller claim, honestly held, merged tighter into the mechanism section. Keep "Same worker, different manager" — it's the section's earned line if the claim above it is honest.

## Weak Counterargument Handling

- R5 (**required fix**): Objection 1's concession is missing the boundary condition that makes it genuinely fair: harness choice matters least on short, single-shot tasks and most on long multi-tool runs — Composio's tasks were the latter. Adding one clause makes the concession specific instead of ritual.
- The "consolidation" objection response is sound (unknown winner → don't sink customization) — no change.

## Missing Personal Or Operator Judgment

- Operator judgment is present and labeled (the "my read" paragraph, the asset test, the two-column inventory action). The reconciliation with the July piece prevents the "you changed your answer" attack. Adequate after R4 lands.

## Ending Quality

- Ending advances the thesis (you don't have to pick the winner; know which layer is yours) and lands an executable action. Series hook + subscribe matches the plan's CTA. No change.

## Required Revisions

1. R1 — scope the "day one" compatibility claim to skills/instruction files. (evidence accuracy)
2. R2 — "nearly two hundred commits a day." (number accuracy)
3. R3 — "I haven't seen one" replaces "Nobody has." (epistemic honesty)
4. R4 — compress/recast the Part 2 personal beat into an honestly-observable claim. (evidence + structure)
5. R5 — add the task-length boundary clause to objection 1's concession. (counterargument fairness)

## Revision Notes

All five applied to the draft in this same session (v2). R4 is the substantive revision required by the gate: it changes evidence handling and paragraph structure in Part 2, not wording. R1/R3 tighten claim hygiene consistent with claim-ledger.md inference boundaries. No new facts introduced; no thesis change; Argument Lock unaffected.

## Revision Delta

### Added

- Task-length boundary condition in objection 1 (harness spread grows with run length; Composio's tasks were long multi-tool workflows).

### Cut

- "has never felt like a difference in raw intelligence" unfalsifiable framing; "Your existing assets work on day one, unmodified" overclaim.

### Reframed

- Part 2 personal beat: from feel-claim to observable-levers claim; compatibility claim scoped to skills + instruction files; "Nobody has" → "I haven't seen one"; commits/day to accurate "nearly two hundred."

### Intentionally Kept

- One-line transition paragraph before the mechanism section (rhythm break, reads naturally aloud).
- "Same worker, different manager" closing line of Part 2 — earned once the claim above it is honest.
- The ranking-refusal stance (spread only) even though a leaderboard would be more shareable — accuracy over virality, consistent with the ledger.
