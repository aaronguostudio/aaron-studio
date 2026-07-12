# Video QA

## Review Surfaces

Review the video through four progressively more expensive surfaces.

1. `video-treatment.md`: direction, references, scene mix, music, and prototype.
2. `director-plan.json`: narrative role, visual mode, first frame, sound,
   provenance, and fallback for every beat.
3. `video-storyboard.json`: timing, templates, motion recipes, and fallbacks.
4. Prototype: 60-90 seconds with calm, structured, and signature material.
5. Full render: final editorial, visual, audio, and delivery check.

Do not use the full render as the first visual review.

## Storyboard Gate

Run:

```bash
bun tiles/aaron-video-gen/scripts/storyboard-audit.ts \
  --storyboard <blog-dir>/video-storyboard.json \
  --output <blog-dir>/video-storyboard-audit.md
```

Planning mode may pass with prototype scenes when they are explicitly marked
and have an available fallback. Before the full render, run production mode:

```bash
bun tiles/aaron-video-gen/scripts/storyboard-audit.ts \
  --storyboard <blog-dir>/video-storyboard.json \
  --production \
  --output <blog-dir>/video-storyboard-audit.md
```

Production mode must not contain `prototype` or `experimental` capabilities.

## Director Gate

Before spending on generated media or a long render, create a director plan and
run:

```bash
bun tiles/aaron-video-gen/scripts/director-plan-audit.ts \
  --plan <blog-dir>/video-v4/director-plan.json \
  --output <blog-dir>/video-v4/director-plan-audit.md
```

Reject the plan when a beat begins blank, a bridge has no immediate change,
media has no narrative reason or fallback, generated material is presented as
evidence, or generated-video duration exceeds its declared budget.

## Contact Sheet Gate

For each structured or signature scene, render three stills:

- entry: what the viewer sees immediately;
- peak: the densest or most important frame;
- exit: the state handed to the next scene.

Build a contact sheet with scene ID and timecode. Inspect it at full size and a
small mobile-like size.

After encoding, extract a second contact sheet from the rendered master. Source
stills prove layout intent; encoded frames prove that fonts, 3D layers, canvas,
captions, and scene boundaries survived the real renderer. When a 3D or canvas
scene produces nondeterministic pixels, render the prototype with concurrency
`1` and compare repeated frames before acceptance.

For dependency thresholds, 3D scenes, and path animation, decode a short frame
range sequentially from the encoded master. Do not trust a single frame
extracted with input-side fast seek (`-ss` before `-i`): inter-frame codecs may
return a misleading partial or inexact image. When a suspect frame appears,
compare the Remotion source still and a sequential encoded-frame window before
changing the animation.

Reject when:

- the entry state is mostly blank;
- the first frame lacks the article's visual identity or opens on a bare
  taxonomy label;
- the title is the only meaningful content for more than one second;
- a long headline wraps because the header was divided into arbitrary columns;
- text overflows or becomes too small;
- captions collide with diagrams, logos, or navigation;
- a dense frame cannot be understood within two seconds;
- consecutive scenes have the same composition and motion;
- generated assets contain unreadable text or distorted subjects;
- a 3D or canvas scene is blank, clipped, or incorrectly framed.
- a generated clip is used without a narrative role, provenance note, or
  deterministic static/image-sequence fallback.

## Motion Gate

- All time-varying values are frame-driven.
- Entry motion settles before the next explanation begins.
- Motion clarifies sequence, causality, comparison, or emphasis.
- Calm scenes remain calm; signature motion does not leak into every chapter.
- No unexplained wait occurs before the first visual change.
- No structured scene goes more than eight seconds without a meaningful beat.
- No calm scene goes more than twelve seconds without a meaningful beat unless
  the hold is deliberately justified.
- Scene transitions preserve continuity instead of cycling through arbitrary
  effects.
- Typography-heavy and diagram-heavy scenes do not crossfade as complete
  layouts; one information hierarchy owns each boundary frame.
- Inspect the encoded frame immediately before and after every chapter cut for
  black gaps, double exposure, and partially initialized layouts.
- Endpoint markers, labels, and arrowheads never precede the connector or parent
  animation that makes them meaningful.
- Intermediate nodes activate when the animated path reaches their specific
  location; do not use a terminal-only reveal helper for every node.
- Dense evidence and large statements use mutually exclusive stages unless the
  storyboard explicitly proves that the overlap remains legible.
- Rotation, perspective, scale, and translation stay inside a declared transform
  envelope. Sample projected bounds at 0, 25, 50, 75, and 100 percent progress.

## Layout Gate

- Use a stable 16:9 grid and explicit safe areas.
- Constrain title size by both width and height.
- Set content limits per registered template.
- Prefer a fallback layout over shrinking text below the readable threshold.
- Keep images in stable aspect-ratio containers.
- Do not place framed cards inside other framed cards.
- Avoid gradients, glass, or effects unless the selected treatment calls for
  them and they remain subordinate to information.
- Equal comparison lanes use the same type scale, content height, node geometry,
  padding, and baseline.
- Accent colors have documented semantic roles; peer items do not receive
  arbitrary rainbow differentiation.
- Headers, captions, conclusions, and result bands own protected zones. Animated
  projected bounds may not enter those zones at any sampled frame.
- Major information regions come from registered layouts with tested slot
  capacity and overlap rules. A scene may not invent a second primary region
  merely because an earlier animation changed its apparent bounds.
- Peer rows must use registered node widths and gaps. Check both outer margins
  from the encoded master rather than relying on CSS intent.
- Captions and frame chrome must remain subordinate; reject a decorative line
  or active treatment that creates a second visual headline.

## Audio And Music Gate

- Narration identity and language already passed the audio-only gate.
- Music has a recorded source and usage right.
- Inspect generated music for leading and trailing silence before mixing. A
  track on the timeline is not evidence that a sound-led opening is audible.
- The cold open establishes mood without delaying the promise.
- Narration remains clear on headphones and a phone speaker.
- Music ducks smoothly under speech and does not pump between short phrases.
- Section stings align with real structural turns.
- Sound effects are sparse and synchronized to visible events.
- The ending resolves both the argument and the score.
- Measure the final encoded mix, not only its source tracks. Target roughly
  `-16 LUFS`, keep true peak at or below `-1.5 dBTP`, and confirm that any long
  silence is an intentional prelude or ending.
- When a narration candidate changes delivery settings, create and listen to
  opening, middle, and late samples. Technical loudness parity is not evidence
  that long-form energy or identity survived.

## Product Gate

Watch once without stopping.

- Does the first 20 seconds deliver the title and thumbnail promise?
- Can a viewer explain the main argument afterward?
- Do visuals add information rather than duplicate narration?
- Is there at least one memorable visual sequence?
- Does any scene feel like a template demo rather than part of the film?
- Does the video feel tiring because too much is moving?
- Does the quietest scene still feel intentional?

Record failures in `video-qa-report.md`. Convert recurring failures into the
scene registry, audit script, or engineering rules rather than fixing only one
render.
