# Aaron Editorial Visual System

## Status

This is a working visual baseline, not a permanently frozen brand palette.
Version it, test it across several essays, and change it only from rendered
evidence rather than from an isolated color preference.

Current candidate: `signal-editorial-v0.1`.

## Design Intent

The video should feel like a precise editorial product: quiet enough to trust,
structured enough to learn from, and distinctive without looking like a generic
AI interface. Information hierarchy does most of the work. Motion and color
clarify meaning; they do not compensate for an unresolved layout.

## Semantic Color Roles

| Role | Baseline | Meaning |
|---|---|---|
| Canvas | `#090c0b` | Stable editorial field |
| Surface | `#111714` | Structured working area |
| Paper | `#f1eee6` | A document, recommendation, or model surface |
| Text | `#f7f5ee` | Primary reading color |
| Muted | `#9ca69f` | Secondary context |
| Signal | `#58d1a3` | Learning, flow, retained capability, progress |
| Tension | `#ef765f` | Break, handoff, risk, unresolved gap |

Rules:

- Use one dominant accent in a scene. The default is Signal.
- Tension is semantic punctuation, not a second decorative palette.
- Do not assign a different color to each company, framework letter, system
  layer, or card unless color carries a stable category across the whole film.
- Neutral structure should remain legible when both accents are removed.
- Do not introduce a new hex value inside a scene component. Add a semantic
  token first and explain its role.

## Grid And Type

- Canvas: `1920 x 1080`.
- Horizontal safe area: `112px` per side; content width `1696px`.
- Reserve the bottom `154px` for captions and delivery chrome.
- Use a 12-column mental grid with `20-24px` gutters.
- Spacing scale: `8, 12, 20, 28, 40, 64`.
- Corner radius: `4px` by default, never above `8px` without a treatment reason.
- Scene title: about `60-64px`; panel title: about `44-48px`; body: `22-26px`;
  labels: `18-20px`; captions: about `31px`.
- Equal concepts receive equal type, dimensions, padding, and baselines.
- Never solve overflow by shrinking one peer independently.

## Canonical Layouts

### Statement

One claim or question owns a dedicated stage. Previous dense content must leave
before the statement enters. A small evidence rail may remain only when it is
visually subordinate and cannot collide with the claim.

### Progressive Evidence To Statement

Use two mutually exclusive phases:

1. Evidence accumulates and resolves.
2. Evidence compresses into a quiet summary rail or exits.
3. The statement enters only after phase two is complete.

Do not fade a large question directly over a card grid.

### Chapter Transition

- Never crossfade two complete information layouts. Text, diagrams, and captions
  remain readable only when one information hierarchy owns the frame.
- Prefer a clean cut when music or narration already provides continuity.
- A wipe, shared-object transition, or transition plate is acceptable when its
  geometry has a registered safe area and a deterministic endpoint.
- Sample the encoded frame before and after the boundary, not only the source
  composition.

### Split Comparison

- Two equal columns with one shared baseline system.
- Same eyebrow size, title size, content-zone height, and node component.
- A central divider may separate the lanes, but it must not become decoration.
- Put the conclusion in a full-width result band. Do not float a third card over
  the boundary between columns.

### Framework

- Show the full scaffold immediately in a muted state.
- Activate peers through the same component and one accent system.
- Preserve stable card dimensions throughout the build.
- Place the final payoff in its own lower stage rather than on top of the cards.

### Brand End Card

- End the argument before the lockup begins; an end card is a closing surface,
  not another point in the argument.
- Hide the persistent header and captions. The author mark, name, site, and one
  identity line must become the only reading hierarchy. Do not force a website
  into the card when it reads as an advertisement rather than a signature.
- Keep it for roughly four to six seconds with a calm frame-driven entrance and
  a clean final fade. Do not leave a black screen with stale chapter metadata.
- Use the current Aaron identity system: the soft blue/purple mark plus
  `AI-NATIVE BUILDER` and `Human-first thinker`. It should resemble the vlog's
  established sign-off, not inherit the essay's operational chrome.

### System Reveal

- A surface may open to reveal the operating layer behind it.
- Internal items should use rows or an unframed grid; avoid cards inside a
  framed card.
- The surface and the system must remain readable at the peak frame.

### Registered Layout Engine

Major content geometry belongs to a registered layout, not to ad hoc coordinates
invented inside a scene. The current implementation is
`remotion/src/editorial/EditorialLayoutEngine.tsx`.

- `statement`: a single headline and a bounded supporting line.
- `cover-hero`: a branded cover identity, bounded title, and compact metadata.
- `people-hero`: a left editorial claim, a protected generated/source-media
  zone, and a small role rail.
- `decision-row`: one full-width header, four equal nodes, and a bounded
  explanation or outcome slot.
- `ownership-map`: a symmetric system map with one customer workflow and
  semantic risk boundaries.
- `ownership-assets`: stable customer-owned and provider-replaceable panels
  with equal outer margins.
- `workflow-gates`: header, five gate panels, a lower workflow rail, and a
  separate pattern line.
- `split-loop`: a compact stage label, two equal comparison lanes, and one
  conclusion band.

Each layout declares slots, capacity, safe areas, and caption protection. Scene
code may animate *inside* a slot, but it may not create a competing primary
region. Add a layout only when it has a reusable information shape, tests for
slot overlap and capacity, and one realistic long-content render.

### Cover Hero First-Frame Contract

A cover hero is a title card, not a background waiting room. At frame zero it
must already show the article title, a useful subtitle, and the Aaron brand
lockup (soft mark, name, and `AI-NATIVE BUILDER · HUMAN-FIRST THINKER`). Motion
may add depth to the background only after that promise is readable. Do not
fade the primary title or brand in after the viewer has already arrived.

### Transform Envelope

Treat the projected bounds of an animated object as part of layout. Static CSS
bounds are not enough when rotation, perspective, scale, or translation changes
what the viewer sees.

- Information-bearing planes should normally stay within `36deg` of Y rotation
  and retain at least `80%` projected width.
- Declare protected zones for headers, captions, conclusions, and result bands.
  A transformed object may not enter them at any animation progress.
- Keep at least `64px` between a transformed object's projected bounds and the
  next protected information zone at the target canvas size.
- Sample projected bounds at `0`, `0.25`, `0.5`, `0.75`, and `1` progress, plus
  every moment when another label or band enters.
- A full-frame signature plane may exceed these limits only when it carries no
  text that must remain readable and the storyboard explicitly prototypes it.

## Component Contract

Reusable components own dimensions, alignment, padding, and type hierarchy.
Scene code owns content, semantic tone, and frame-driven progress.

Use shared primitives for:

- scene headers;
- flow nodes;
- framework cards;
- evidence rails;
- comparison result bands;
- captions and frame chrome.

If a layout requires custom padding on every item, it is not yet a stable
template.

## Header And Caption Restraint

The persistent header exists to orient the viewer, not to compete with the
scene. Use a compact mark, author, section, and time/progress treatment. Avoid
a permanent full-width divider unless it carries a real chapter boundary.

Captions occupy a protected bottom zone. Their container may provide contrast,
but it should remain visually quiet: no decorative accent rule, karaoke effect,
or independent motion that competes with the sentence. A caption treatment is
accepted only after it has been inspected against a diagram, an image, and a
quiet statement scene.

## Animation Dependencies

Treat complex motion as a dependency graph.

- A destination node cannot appear before its connector reaches it.
- An intermediate node activates at its documented path-arrival fraction. An
  endpoint marker can use a late threshold (normally `0.94`) and an arrowhead
  should normally wait until about `0.98`.
- A conclusion cannot enter before the evidence state has exited or compressed.
- A child animation derives from its parent progress; it does not reuse the
  parent's full `0 -> 1` opacity directly.
- Keep the scaffold visible in a quiet state when the viewer needs spatial
  context before activation.

Use a helper such as `dependentReveal(parentProgress, 0.94)` only for endpoint
elements. For intermediate nodes, declare a short `progress(path, arrival,
arrival + window)` range that matches the actual geometry. Review frames
immediately before, during, and after every arrival threshold.

## Preflight

Before a full render:

1. Render entry, peak, exit, and every dependency threshold.
2. Inspect at full resolution and at `640 x 360`.
3. Confirm that no dense layout and large statement coexist unintentionally.
4. Confirm equal peers share the same component geometry.
5. Confirm captions never cover the conclusion or diagram.
6. Confirm no endpoint, arrowhead, label, or payoff appears in a partial state.
7. Confirm transformed objects stay inside their envelope at all sampled states.
8. Extract the same frames from the encoded master and compare them with source
   stills.

Promote a layout only after it passes with a long title, dense content, and real
narration timing.
