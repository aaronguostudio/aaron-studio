# Visual Postmortem

## What Worked

- **Concept-before-style paid off in one round**: all six finals accepted on the first generation pass, zero re-rolls. The three-route comparison (44/3 gate vs one-row machine vs contract re-read) made the cover decision explicit, and Route C's runner-up became the finding-3 body image instead of being discarded.
- **Field Signal Editorial as primary was the right departure**: the paper world (ledger strips, stamps, paper-cut figures) matches a repo whose own texture is documents, and it produced zero glowing-AI imagery without needing negative-prompt fights.
- **The distribution-cover interlock**: choosing the 44/3 gate for the cover means the X hook, the article's signature number, and the visual identity all tell one story.
- **Exact-text thumbnail on first try**: listing the six permitted words verbatim and banning all other text produced a clean three-line hierarchy (cyan/white/amber) with no invented captions — the Workflow-3 v7 lesson applied preventively.
- **gpt-image-2 renders "paper craft" reliably**: 2048×1152 on every asset (prompted 16:9 honored), consistent warm-white/graphite palette across six independent generations — the series held together without a shared reference image.

## What Failed / Wrinkles Accepted

- 01 diagram: cards thread the gate's side posts rather than the opening — accepted (semantics intact). Lesson: for gate/portal diagrams, specify "through the opening, not overlapping the frame".
- 02 contract: two green "remembered" stamps appear after the coral mark — a soft semantic contradiction accepted to preserve an exceptional composition. Lesson: when a scene encodes a before/after boundary, state "no <before-marker> may appear after <boundary>" explicitly.
- 04 shelves: the cyan thread spool didn't render (amber-only accents). Harmless here; lesson: items listed deep inside a container description get dropped — promote must-have props to their own sentence.

## Reusable Patterns

- "Strictly avoid:" appended as a single sentence at the prompt end worked as a de-facto negative prompt through the baoyu CLI (no separate negative-prompt flag needed).
- The graphite ledger strip + narrow aperture is now the series identity motif — B/C/D posts should reuse it (C: rejected/ freezer drawer in the same wall; B: a toll booth on the amber line; D: the aperture itself close-up).
- Paper-cut uniform fleet + few distinct humans reads "agents vs judgment" without a single robot.

## Backend Behavior

- baoyu CLI + openai/gpt-image-2, quality 2k, ar 16:9: six assets, six successes, no fallbacks, no dimension surprises (all 2048×1152). Two parallel background jobs (each sequential) stayed inside the provider's concurrency-2 config. PNG originals 2.4–4.0 MB; WebP finals 42–185 KB (q82; diagram q75).

## Image-Stock Candidacy

All six accepted finals are stock candidates (recorded in generation-manifest.md); the cover and 03-fleet are the strongest series-reuse assets.

## Guidance For The Next Article

Start from this set as the Paper Machine Teardown baseline for the DSH series; keep Soft Glass Narrative as the default for non-series posts. The 2026-06-20 set remains the general brand baseline.
