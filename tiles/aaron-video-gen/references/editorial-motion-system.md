# Editorial Motion System

## Contents

1. Product standard
2. Director model
3. Visual coherence and variation
4. Pacing and density
5. Music and sound
6. Reference deconstruction
7. Web animation adaptation
8. Production stages
9. Anti-patterns

## Product Standard

Treat each video as a finished editorial product, not a narrated article and not
an animated slide deck. The viewer should be able to enjoy the piece, understand
the argument, and remember its operating insight.

The target is not maximum motion. The target is authored attention:

- sound establishes mood and expectation;
- evidence makes the argument credible;
- layouts make relationships legible;
- motion reveals change, causality, sequence, or emphasis;
- quiet frames give the viewer time to think;
- one or two signature moments create visual memory.

Remotion remains the deterministic render engine. The editorial system decides
what the engine should render.

## Director Model

Assign every scene one primary visual role.

### Evidence

Show what happened or what exists: a source, photograph, product screen,
document, quote, real object, or specific illustration. Evidence scenes can be
static when the image itself carries information.

### Explanation

Show how parts relate: comparison, process, system map, timeline, framework,
handoff, feedback loop, or changing state. These scenes earn structured motion.

### Emphasis

Make one idea impossible to miss: a number, contradiction, title, question, or
payoff. Emphasis scenes should be short and visually decisive.

Do not make one scene perform all three roles. Split overloaded scenes.

## Visual Coherence And Variation

Use one visual spine across the whole video:

- one typography system;
- one grid and safe-area system;
- one dominant background logic;
- one accent color at a time;
- one texture and image-treatment family;
- a small set of motion timings and easings.

Color must have a semantic job. Do not distribute unrelated accent colors
across companies, framework letters, cards, or system layers merely to create
variety. Use the current baseline in `aaron-editorial-visual-system.md` as a
versioned candidate, not as an unchangeable brand palette.

Within that spine, mix two or three scene families. A serious essay may combine
documentary evidence, Swiss editorial layouts, and a small number of technical
motion scenes. Coherence comes from the spine, not from making every scene look
identical.

Use three intensity levels:

- `calm`: evidence, reading, reflection, or breathing room;
- `structured`: cards, comparisons, timelines, diagrams, and frameworks;
- `signature`: bespoke 3D, shader, camera, or pixel motion used as a peak.

As a starting point, keep signature motion below 20% of runtime. Do not place
two signature scenes back to back. A signature scene should feel earned by the
argument, not inserted to prove technical ability.

## Pacing And Density

Edit around semantic beats, not paragraph boundaries.

- Typical scene: 8-30 seconds.
- Dense explanation: one meaningful visual beat every 3-8 seconds.
- Calm evidence: one meaningful visual beat every 8-12 seconds.
- A visual beat can be a focus shift, count, connector, state change, crop,
  comparison, or new asset. It does not need to be a cut.
- Do not cut on every sentence. Let a visual state finish before replacing it.
- Do not hold an unchanged, low-information frame merely because narration
  continues.

### No Blank Stage

Every scene must enter with a meaningful image, a visible scaffold, or a bridge
from the previous scene.

- A bridge scene must make its first change within one second.
- A framework should show its overall structure before individual parts become
  active.
- If narration introduces context before naming the framework, keep the prior
  evidence visible until the framework is ready.
- A title alone is not a meaningful entry state for a long explanation.
- A dense evidence layout must exit or compress before a large statement enters;
  never rely on a weak dark overlay to make both readable.

### Dependency-Safe Motion

Complex animations must expose only physically complete states. A connector
draws before its destination or arrowhead appears; a payoff waits for the
supporting evidence to settle; and a new stage waits for the previous stage to
exit. Derive child reveals from a late range of parent progress, normally the
last `6-18%`, rather than binding both to the same `0 -> 1` value.

## Music And Sound

Music is part of the treatment, not a default background layer.

Choose one strategy:

- `none`: narration and selective sound effects only;
- `bookended`: scored cold open and ending, with a mostly quiet body;
- `chaptered`: two to four cues that mark major turns;
- `continuous`: one restrained bed, used only when it improves the full piece.

For serious editorial videos, start with `bookended`. A low cello, restrained
piano, pulse, or textural bed can create expectation before the first claim.
Silence can then increase the authority of the narration.

Rules:

- narration always wins the mix;
- duck music during speech and restore it only for intentional transitions;
- use sound effects to clarify a visual event, not decorate every movement;
- record cue purpose, entry, exit, and source in `video-treatment.md`;
- use only music with known usage rights and retain license or attribution data;
- public-domain composition does not imply that a particular recording is free
  to use;
- review the final mix on headphones and a phone speaker.

## Reference Deconstruction

Study one to three strong references before selecting a new visual direction.
Do not ask the model to "make it like" a reference. Deconstruct it.

For each reference, record:

- what sound does before the first image;
- how the first ten seconds establish a visual contract;
- camera and spatial behavior;
- typography and layout hierarchy;
- average time between meaningful changes;
- how intensity rises and falls;
- what should be borrowed;
- what should not be copied.

### Current Reference Notes

William Candillon's *The Shader's Gambit* demonstrates that Remotion can feel
like a complete authored film rather than a template: music establishes the
world, 3D movement is used as a scene transition, and new compositions arrive
as chapters rather than arbitrary effects.

Reference:
https://x.com/wcandillon/status/2015345960491069718

Borrow the sound-led opening, spatial confidence, and product-level finish.
Do not copy its chess-specific visual language or sustain its peak intensity
through an essay.

Motion's `AnimateNumber` is a useful behavior reference for numeric scenes, but
the production implementation must be frame-driven in Remotion:
https://motion.dev/docs/react-animate-number

React Bits is an inspiration catalog for text, focus, stack, pixel, and
background motion:
https://github.com/DavidHDev/react-bits

Guizang's presentation skill is the workflow reference: limit layouts, make
content fit registered templates, and inspect rendered output rather than
trusting generated markup.

## Web Animation Adaptation

Motion and React Bits are not drop-in Remotion timelines. Port the visual
behavior, not the autonomous browser clock.

An adapted effect must:

- derive every changing value from `useCurrentFrame()`, `interpolate()`, or
  `spring()`;
- avoid CSS transitions, CSS animations, hover, cursor, scroll, and wall-clock
  timers;
- use deterministic random seeds;
- render the same frame when requested repeatedly;
- provide a static final state and a lower-complexity fallback;
- pass still checks at entry, peak, and exit frames.

Good early adaptations:

- count-up and odometer numbers;
- word or line mask reveals;
- focus shifts;
- staggered cards;
- connector and path drawing;
- comparison wipes;
- limited pixel transitions.

Keep shaders, camera orbits, 3D flips, and continuous generative backgrounds in
`custom-signature` scenes until they pass a prototype and canvas-pixel checks.

## Production Stages

1. Lock the spoken argument and viewer promise.
2. Deconstruct references and propose two or three treatments.
3. Record Aaron's selected treatment.
4. Build and audit `video-storyboard.json`.
5. Lock narration audio.
6. Prototype a 60-90 second slice containing calm, structured, and signature
   material.
7. Review the prototype for pacing, layout, music, and fatigue.
8. Promote successful scene templates in `config/scene-registry.json`.
9. Render the full video.
10. Run visual, audio, and product QA.

Do not build the full video before the prototype passes when a planned or
experimental scene is involved.

## Anti-Patterns

- Treating every paragraph as a slide.
- Generating 20 images because an image quota says so.
- Using a different visual style for every scene.
- Applying the same fade-up recipe to every layout.
- Making every scene a card grid.
- Hiding the whole layout until a late narration cue.
- Importing a web animation that depends on hover or real time.
- Using music continuously because the renderer supports it.
- Building a bespoke scene without a reusable lesson or fallback.
- Rendering seven minutes before reviewing the first minute.
