# Aaron Long-Form Video Style Baseline

## Current Baseline

- **Baseline ID:** `ledger-editorial-v1`
- **Accepted package:** `src/content/blogs/2026-08-19`
- **Canonical master:** `video-v3.mp4`
- **QA record:** `video-qa-report.md`
- **Public reference:** https://youtu.be/5vEEBhbfUWw
- **Status:** accepted for the next serious editorial video unless Aaron selects a new direction.

## System To Inherit

- Start on a meaningful cover-hero at frame zero: title, promise, and Aaron identity already visible. The first visual change must land within the first second.
- Give the film one visual grammar that expresses the argument. For this baseline it is an append-only ledger: sequence rails, evidence rows, a rare ink punctuation page, and cyan reserved for model-visible or confirmed state.
- Use a finite set of authored layouts. Typography carries claims; source pages, diagrams, or illustrative stills appear only when they change the reader's understanding or reset attention.
- Preserve a clear role for every scene: evidence, explanation, or emphasis. Use phrase-level captions inside the protected lower region.
- Keep motion functional and calm: visible entry state, one meaningful change, continuity across cuts, and no blank waiting stage. End with the quiet brand card after the argument resolves.

## Legacy Patterns To Reject

- Generic slide decks that place blog illustrations full-frame behind narration.
- Empty title cards, dashboard/terminal collages, fake UI, or decorative motion without an argument job.
- Using a succession of images as a substitute for a visual system.
- Reverting to a legacy renderer or template merely because a new treatment has not been selected.

## Baseline Review Protocol

1. Before planning, inspect this package's canonical master and QA report.
2. In the new package's `director-plan.json`, complete `style_reference`: baseline paths, inherited rules, rejected legacy grammar, and a specific reason for any departure.
3. Run `director-plan-audit.ts`; it fails when the review record is absent.
4. A later video becomes the new baseline only after Aaron accepts the final QA. Update this file and record the supersession in the new package's `package-state.json`.
