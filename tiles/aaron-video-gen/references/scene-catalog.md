# Scene Catalog

## Source Of Truth

`config/scene-registry.json` is the machine-readable source of truth. Read it
before planning or implementing scenes. Never claim a `prototype` or
`experimental` template is production-ready.

Use `scripts/storyboard-audit.ts` to verify template compatibility, pacing,
blank-stage rules, fallback coverage, and production readiness.

## Scene Selection

| Template | Best use | Current status |
|---|---|---|
| `image-sequence` | Photos, sources, illustrations, screenshots | available |
| `tutorial-short` | Vertical text-led tutorial with source proof and review gates | prototype |
| `licensed-footage-insert` | Short real-world B-roll with visible source and warm editorial overlay | prototype |
| `actor-framework` | ACTOR framework build | available |
| `brand-end-card` | Author identity, website, and a quiet closing lockup | available |
| `editorial-statement` | Claim, question, title, payoff | prototype |
| `data-hero` | One dominant number with supporting evidence | prototype |
| `split-comparison` | Two ideas, states, or operating models | prototype |
| `progressive-cards` | A small set that accumulates into a system | prototype |
| `process-flow` | Stages, handoffs, and work progression | prototype |
| `system-map` | Connected systems, actors, data, or decisions | prototype |
| `timeline` | Chronology, convergence, before and after | prototype |
| `quote-source` | Quotation with visible provenance | prototype |
| `custom-signature` | Rare 3D, shader, camera, or pixel peak | experimental |
| `ambient-signal-loop` | Deterministic, loop-ready Focus/Sleep/Relax visual field | prototype |
| `digital-space-study` | Loop-ready 2.5D music-led ambient space | experimental |

## Director Selection

Before picking a template, choose the visual mode in `director-plan.json`.

- `motion`: the relationship itself is the information.
- `source-evidence`: a real announcement, document, quote, product screen, or
  data artifact is the proof.
- `screen-capture`: an actual working artifact gives a personal or operational
  claim credibility.
- `licensed-footage`: real-world action or setting from a recorded license;
  illustrative footage must never be presented as factual proof of a claim.
- `generated-still`: a quiet conceptual reset; it must not pretend to be proof.
- `generated-video`: one brief, text-free atmospheric or spatial insert with a
  still/Remotion fallback.
- `hybrid`: a deliberate handoff between media and structured explanation.

Do not select an image or clip because a scene seems visually empty. Select it
when it establishes a setting, proves a claim, or creates an earned reset in
attention.

## Selection Rules

- Select by information shape, not by preferred visual effect.
- Use `image-sequence` when the evidence is already visually strong.
- Use `tutorial-short` for a bounded 9:16 tutorial whose copy is the spine and
  whose evidence can be linked beat by beat to a fact pack. Keep a static
  `image-sequence` fallback until the template completes prototype review.
- Use `licensed-footage-insert` when a real-world action makes a beat more
  legible than another card. Keep it brief, source-labelled, silent beneath
  narration, and paired with a deterministic still or Remotion fallback.
- Use `editorial-statement` only for one concise idea.
- Use `data-hero` only when a real number carries the argument.
- Use `split-comparison` when both sides share comparable dimensions.
- Use `progressive-cards` for two to six peers, not long prose.
- Use `process-flow` for ordered work; use `system-map` for relationships that
  are not strictly sequential.
- Use `timeline` only when chronology or convergence matters.
- Use `custom-signature` for one memorable peak and always provide an available
  fallback.
- Use `ambient-signal-loop` for a calm music-led or focus background whose
  source must remain editable in both a browser preview and Remotion. Keep the
  loop deterministic, reserve geometry for the selected cognitive role, and
  retain an `image-sequence` fallback until motion QA passes.
- Use the canonical geometry in `aaron-editorial-visual-system.md`; a template
  is not permission to invent new padding, type sizes, or peer dimensions for
  every scene.
- When a scene changes from evidence to emphasis, use mutually exclusive stages
  instead of placing the emphasis statement on top of the evidence layout.

## Motion Recipes

Motion recipes are semantic verbs. A scene should usually use one primary
recipe and at most two supporting recipes.

| Recipe | Meaning |
|---|---|
| `crossfade` | Replace one piece of evidence with another |
| `bridge-reveal` | Preserve prior context while a new system enters |
| `card-build` | Accumulate parts into a whole |
| `connector-draw` | Reveal a relationship or return path |
| `mask-reveal` | Introduce a concise statement without layout movement |
| `word-mask` | Reveal words or lines as a unit, not per-character flicker |
| `focus-shift` | Move attention within a stable layout |
| `count-up` | Show magnitude or progression in a number |
| `stagger` | Establish order among peers |
| `highlight-scan` | Call out one existing element |
| `compare-wipe` | Change from one state or side to another |
| `path-trace` | Show chronology, flow, or movement along a route |
| `three-d-flip` | Change spatial plane or chapter within a declared transform envelope |
| `pixel-transition` | Resolve one state into another through a grid |
| `camera-orbit` | Reveal structure through controlled 3D camera movement |
| `shader-field` | Establish a rare generative visual world |
| `ambient-cycle` | Sustain a periodic visual state without a visible loop seam |

## React Bits And Motion Mapping

Use React Bits and Motion as reference implementations only.

| Inspiration | Editorial use | Remotion adaptation |
|---|---|---|
| Count Up / AnimateNumber | Data Hero | frame-driven number formatting |
| Split Text / Blur Text | Statement | word or line masks; no character opacity flicker |
| True Focus | Comparison or map | frame-driven focus shift |
| Stack / Animated List | Progressive cards | fixed layout with staged visibility |
| Pixel Transition | Chapter peak | deterministic grid reveal |
| Shape/Grid backgrounds | Signature scene | seeded canvas or shader, never default body background |

Reject cursor, hover, scroll, draggable, and infinite-loop components for
rendered video unless they are rewritten around frame time.

## Prototype Contract

Before promoting a template to `available`:

1. Implement it with frame-driven motion.
2. Render at least one realistic long-title and high-content case.
3. Render entry, peak, and exit stills.
4. Check overflow, collision, safe areas, and captions.
5. Review a 20-40 second motion sample with narration and music.
6. Add a static or `image-sequence` fallback.
7. Add tests or audit coverage for its main failure modes.
8. Render frames immediately before and after every connector, endpoint, and
   stage-transition dependency.
9. Change its registry status only after the prototype passes.
