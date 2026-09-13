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

### Medium Mix: Editorial Image Resets

For a 5–10 minute serious essay, audit two to four moments where selected scene
media could add information or recognition: a person under discussion, a
tangible object, a source artifact, or a conceptual reset. This is not a quota.
Reject every candidate that merely fills space, but require an explicit image
decision when typography and diagrams have carried the film for roughly 60–90
seconds without a change of medium.

Portraits, object studies, and larger editorial stills are **scene media**, not
semantic sprites. They may own a `people-hero`, image, or hybrid composition and
may be reused only when continuity gives the reuse a clear job. A generated
portrait must be visibly illustrative, recorded as generated, subordinate to
verified attribution, and removable through a text-only fallback. Generated
scene media cannot serve as source evidence.

Semantic sprite accents have a separate zero-default budget. Begin with
`max_semantic_sprite_beats: 0`; raise it to `1` only when one unambiguous object
makes an abstract phrase easier to retain, matches real negative space and the
selected visual spine, and can disappear without changing the argument. Record
why the accepted candidate earned the beat and why alternatives were rejected.
Never use a semantic accent as evidence.

## Visual Enrichment After Content Approval

When Aaron approves the argument, voice and restraint but asks for richer images
or layouts, treat this as a visual-only revision. His explicit delegation of
art direction is sufficient to select a continuation of the approved style;
do not restart cover exploration or request the same approval again.

1. Preserve the approved renderer, media, narration, script, caption timings and
   scene boundaries. Record hashes for the locked audio and text. Give the new
   renderer and outputs versioned paths so the comparison is reproducible.
2. Find repetition at the **composition** level, not only the template name.
   Several system-map scenes can legitimately use different registered layouts;
   several differently named scenes can still repeat the same three-column row.
3. Write one concrete job for each proposed image: make repeated entry tangible,
   show people inspecting one draft, or make waiting review work visible. These
   are examples, not a reusable quota or mandatory object set. Reject images
   that only restate the topic. Keep generated scenes explicitly illustrative.
4. Vary the relationship between media and text: an object with side notes, a
   manuscript with a margin correction, a shared review sheet, or two claims on
   facing documents. Choose registered geometry first. Preserve the established
   palette, typography, caption zone and visual restraint.
5. Give small motion a reading job: draw an underline under a corrected scope,
   move focus between existing review criteria, or reveal the relation between
   source and interpretation. Keep the scaffold legible from entry. Do not add
   drifting cameras, text scaling, character acting or decorative motion merely
   to create activity. Reuse an image only when returning to it has a story job.
6. Render representative changed passages before the full film. Compare the same
   source moments with the prior version, including entry, middle and exit;
   inspect all remaining changed layouts in the encoded master. A contact sheet
   supports layout review, not a claim of full playback or headphone listening.
7. Retain only changes that improve recognition, comprehension or rhythm while
   preserving the approved argument. Record unresolved author-review status.
   If asked to improve the skill, capture these demonstrated decision rules;
   do not promote one film’s illustration count or subject matter into policy.

If the approved soundtrack is reused on an unchanged timeline, verify the final
encoded audio stream as well as the source file. A visual revision should not
silently regenerate the voice or alter a previously accepted ending.

## Sound and pauses after approval

When the complaint is repetitive music, flat delivery, or weak integration of
voice, image and score, use [sound-direction.md](sound-direction.md) to isolate
the cause and build a bounded listening comparison before replacing the master.

Treat an approved voice track as a stable reference. Fade the **music bus**, keeping narration gain constant; do not fade or normalize the entire mix to make room for an entrance. Music should emerge and recede gradually, without a perceived drop in the speaker's voice. Choose fades and levels by listening, not a universal duration or dB target.

Place sparse music changes at meaningful transitions. Give a pause a story purpose: a completed thought, a visual detail to absorb, or a shift from the interview to personal experience. Do not insert silence mid-phrase or add a hold merely to lengthen the film. Combine a motivated image, restrained motion, and a gentle musical transition when useful.

If adding holds changes the timeline, maintain one time mapping for narration segments, scenes, captions, music cues, and chapter timestamps. Verify they remain aligned in the encoded master. Preserve the previous approved version so the experiment is reversible.

Listen across every changed entrance, exit, and hold, including the final ending. Check aligned speech segments against the approved voice track for unintended gain changes; inspect the final encoded audio for clipping and abrupt transitions. A waveform or contact sheet alone cannot establish that a pause feels natural.

Record music source and reuse evidence when generating or selecting it. Keep author confirmation distinct from independently verified provider/license evidence, carry forward resolved approvals, and investigate only material unresolved gaps.

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
