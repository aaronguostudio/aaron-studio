# Video Redesign Directions: What AI Code Can Change

## Decision Status

**SELECTED: Direction A — Indigo Field Journal.** Aaron selected this redesign on 2026-08-03. The original `Field Signal / Controlled Mix` visual direction is technically complete but editorially rejected and retained only as a baseline. The full render remains blocked until the new prototype passes. Narration, exact timing, factual sources, story structure, captions, and QA infrastructure stay locked; only the art direction and layout layer will be rebuilt.

## What We Borrow From Guizang

Borrow the method, not the template code or its finished skin:

- choose from a finite layout vocabulary before animating;
- use one visual spine, one dominant reading hierarchy, and one anchor color;
- create rhythm through materially different page states rather than more cards;
- bind image proportions and safe areas to the selected layout;
- reveal dependencies in the correct order;
- inspect rendered frames instead of trusting markup or source composition.

The canonical Guizang repository currently uses AGPL-3.0. This redesign therefore reimplements general design principles inside Remotion and does not copy its HTML, CSS, shader, runtime, or bundled assets.

## Why The Current Prototype Feels Like A Dashboard

- A near-black canvas is the default state for almost the entire runtime.
- Green is simultaneously brand accent, success signal, active border, ladder state, and keyword emphasis.
- Debate, status, consequences, evidence, ladder, and release contract are all expressed as bordered cards or panels.
- Persistent author/chapter/time chrome and a thick caption bar make every frame feel like an application shell.
- Type hierarchy clusters around medium-size bold sans serif instead of allowing one display idea to own the frame.
- Most scenes share the same silhouette: title above, card grid below, result bar at the bottom.
- Images behave as darkened background texture rather than primary editorial evidence.

Changing the canvas to white and the accent to blue would only create a light dashboard. The components and composition grammar must change too.

## Direction A — Indigo Field Journal (SELECTED)

**Guizang basis:** Style A, Editorial Magazine × Electronic Ink, using the `Indigo Porcelain` preset as one coherent visual system.

### Visual Spine

- Porcelain paper field, deep indigo ink, pale paper tint, and no green/coral/neon accents.
- Serif display type for claims and questions; neutral sans for explanation; monospace only for sources, folios, timestamps, and system records.
- Report spreads, proof slips, ledgers, marginal notes, running heads, image crops, and full-width editorial statements replace UI panels.
- Hairlines and whitespace establish structure. Bordered surfaces are reserved for actual artifacts or records.
- Dark ink pages are rare chapter punctuation, not the default canvas.

### Scene Mix

- Evidence 30%: attributed positions, source reading, test evidence, and record residue.
- Explanation 55%: authority crossing, state propagation, rollback, and cumulative review.
- Emphasis 15%: hidden variable, 12:01, objection, and final release question.
- Intensity: 45% calm, 50% structured, 5% signature.

### Motion Language

- editorial crop, mask reveal, baseline shift, rule extension, marginal annotation, and ink accumulation;
- no 3D page turn, paper-flip gimmick, glow, floating card, or per-character animation;
- signature beat: implementation text can disappear while the indigo record impression remains, making rollback and restored reality visibly different.

### Sound

- Prototype remains narration-only so visual judgment is isolated.
- A restrained bookended cue can be reconsidered only after a rights-cleared track is selected.

### Tradeoff

This is the strongest authorial and thematic fit. It can express debate, evidence, judgment, and irreversible records without another system diagram. It requires a new magazine-spread layout family and careful density control, so it must remain a prototype with an `image-sequence` fallback until approved.

## Direction B — IKB Authority Ledger (NOT SELECTED)

**Guizang basis:** Style B, Swiss International, using the single `IKB` anchor-color preset.

### Visual Spine

- Warm off-white paper, near-black type, grey hairlines, and one IKB blue accent.
- Inter/Helvetica-style sans serif only; giant light-weight display type, compact medium-weight metadata.
- A strict 12-column grid, asymmetric whitespace, statement plates, ledgers, timelines, and unframed comparisons.
- IKB means “the system treats this as authoritative,” not “correct” or “successful.”
- No gradients, shadows, rounded cards, green, or multi-color peer categories.

### Scene Mix

- Evidence 20%, explanation 65%, emphasis 15%.
- Intensity: 35% calm, 60% structured, 5% signature.

### Motion Language

- clean cuts, compare wipes, grid shifts, rule-line traces, typographic scale changes, and one authority-boundary transition;
- the complete scaffold is visible before individual states activate;
- no generic card-build choreography.

### Sound

- Narration-only prototype; the same optional bookended rights gate applies.

### Tradeoff

This direction is exceptionally clear and reusable, with lower implementation risk. Its danger is becoming a consulting deck or a light dashboard if panels and cards return. It must use columns, type, rules, and whitespace as the primary structure.

## Beat Mapping

| Beat | Indigo Field Journal | IKB Authority Ledger |
| --- | --- | --- |
| Two small patches | Two proof slips cross a magazine gutter; one leaves an indigo record impression. | Two equal code strips; only one crosses an IKB authority line. |
| Public debate | Report-style two-column positions collapse into one central ownership statement. | Unframed duo comparison on shared baselines; both paths converge on ownership, then authority. |
| Wrong status | A proofing correction changes `paused` to `inactive`; consequences accumulate as marginal record notes. | One state axis and one authority boundary feed a clean system diagram without action cards. |
| 12:01 rollback | Source text is struck out, while ledger impressions remain on the page. | Implementation path retracts; authoritative states remain fixed on the opposite side of the timeline. |
| Reading and tests | Annotated diptych: source model on one page, repeatable evidence on the other. | Equal unframed columns with one shared premise line exposing correlated error. |
| Four review levels | A cumulative editorial index/foldout; each level retains the prior rule line. | Four oversized numerals; one IKB underline accumulates from level 1 to 4. |
| Objection | Op-ed spread: large italic objection, compact reply, authority measure along the foot. | One statement plus a continuous reversible-to-authoritative axis. |
| Release question | Five editorial clauses recede into the margin; the final question owns the last spread. | A numbered technical specification resolves into one full-field closing question. |

## Non-Negotiable Redesign Rules

- Default field is light; no persistent dark canvas.
- One anchor color across the film; no green, coral, neon, or peer-by-peer colors.
- No persistent timer or application-style chrome. Chapter folios appear only when useful.
- Captions use a quiet paper rail or unframed text aligned to the grid; no thick black UI bar.
- Unless it represents a real artifact, a frame may contain at most two bordered surfaces.
- Every scene has one primary reading hierarchy; on-screen copy must not repeat title, graphic, result band, and caption simultaneously.
- At least five representative frames must have visibly different silhouettes.
- Images become primary evidence or full editorial resets, not darkened wallpaper.
- Structure must remain understandable in grayscale.
- Existing scene registry entries are not promoted from the rejected prototypes.

## Next Prototype Gate

Build one contiguous Indigo Field Journal prototype from `60.418322–148.271628` (87.853306 seconds). It includes:

1. the authority/state-propagation signature scene;
2. the calm 12:01 rollback consequence;
3. the opening of the reading-versus-evidence comparison.

This slice tests signature, calm, and structured states with real narration, captions, and transitions. The existing Core and Contract renders remain baseline references only. Full-film rendering stays blocked until the redesign prototype passes continuous playback and encoded-frame QA.
