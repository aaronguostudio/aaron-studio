# Director Pass

The Director Pass turns a good script into a coherent screen experience before
implementation begins. It is not a request for generic cinematic effects. It
decides why each visual belongs, what the viewer sees from the first frame, how
attention moves, when music earns a change, and what happens if an asset fails.

## Required Artifacts

For a serious essay, create these alongside the treatment and storyboard:

1. `director-plan.json`: the machine-audited beat map.
2. `director-memo.md`: a short human explanation of the central visual idea,
   reference lessons, scene rhythm, and exclusions.
3. `asset-decision-log.md`: every source, screen capture, generated still, or
   generated clip with its narrative reason, provenance, and fallback.

Run before a prototype:

```bash
bun tiles/aaron-video-gen/scripts/director-plan-audit.ts \
  --plan <video-dir>/director-plan.json \
  --output <video-dir>/director-plan-audit.md
```

## What the Director Must Decide

Each beat needs a single answer for each question:

- **Narrative role:** is this the hook, evidence, explanation, challenge,
  framework, or resolution?
- **Visual mode:** should it be structured Remotion motion, source evidence,
  a screen capture, a generated still, a generated video insert, or a hybrid?
- **First frame:** what meaningful thing is already visible before the next
  sentence starts? The first frame must establish article identity with an
  approved cover, factual artifact, or meaningful action; a chapter label alone
  is not an opening.
- **Attention:** where should the eye move, and why? Use a clean cut when an
  old information hierarchy must leave before a new one arrives.
- **Sound:** does music establish mood, hold, lift, release, or stay quiet?
- **Fallback:** what available, legible version preserves the argument if the
  preferred asset is weak, late, or visually redundant?

## Editorial Budget

Remotion is the master timeline and the default surface for explanation. A
strong long-form essay should generally use:

- 60-70% structured, frame-driven Remotion scenes;
- 20-30% source evidence, screen captures, or selected stills;
- no more than 10-15% generated video, normally one or two short inserts.

Generated media may establish an atmosphere or make a conceptual transition
more physical. It must never impersonate factual evidence, contain essential
text, or carry a claim that needs a source. Record it as generated and retain a
still or Remotion fallback.

## Layout Rule

Do not ask a model to invent page geometry on every scene. Choose a registered
layout family first. A layout declares its slots, safe areas, protected caption
zone, content capacity, and what can animate inside it. The scene may vary its
content and timing, not its core geometry.

For the current editorial system, use:

- `statement` for one idea that owns the screen;
- `cover-hero` for an article-branded opening with bounded title and metadata;
- `people-hero` when people or operating capacity is the actual argument, not
  filler around a title;
- `decision-row` for four equal decision states and one bounded payoff;
- `ownership-map` and `ownership-assets` for ownership risk and retained
  capability without improvised asymmetric panels;
- `workflow-gates` for a header, five primary cards, and a lower rail;
- `split-loop` for a two-column comparison and one outcome band;
- an image/evidence layout only when the media itself adds information.

Long headlines own one full-width reading axis. Do not use a side aside to
reduce the available title width and then accept a wrap; place the aside below
the headline or move it to a later beat.

## Generated Clip Reliability

Generated video is an insert, not a fragile dependency hidden in a scene. For
every selected clip, retain its prompt and source output, declare its maximum
screen time, and choose a fallback before the full render. If live video
decoding makes a long Remotion render unstable or slow, extract a fixed-rate
image sequence and play that sequence from the frame clock. The image sequence
keeps the clip's camera motion while making its frames deterministic.

## Hyperframes And React Bits

Use Hyperframes as an experimental scene lab, not a replacement for the
Remotion master. A Hyperframes or React Bits-inspired scene must be rendered as
a bounded insert with a clear fallback. Its value is a distinctive 10-20 second
moment, not an excuse to add persistent shaders, infinite effects, or fragile
freeform layout to the whole film.

## Review Questions

Before a full render, watch the animatic without narration and then with it.

- Can a viewer identify the topic before a title-only screen lingers?
- Does the visual mode change when the story changes from evidence to
  explanation, rather than merely changing colors?
- Are sourced facts visibly distinguished from generated atmosphere?
- Does each generated insert earn its cost and screen time?
- Does a signature effect create one remembered beat without flattening the
  rest of the film into constant spectacle?
