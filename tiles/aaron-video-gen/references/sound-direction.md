# Sound direction through listening comparisons

Use when Aaron wants stronger delivery, less repetitive scoring, or a closer
relationship between narration, music and picture. Keep technical feasibility,
listening preference and a promoted production choice separate.

## Diagnose the layer

Flat delivery can come from prose, paragraph generation, voice training style,
model controls or edit pacing. Repetitive music can come from selecting a familiar
asset before deciding what the scene needs. Neither complaint alone establishes
that the voice must be retrained or a new provider installed.

Choose a short passage containing a real change of thought. Make two independent
comparisons when both voice and score are under review:

- **Sound direction:** preserve the original voice performance and gain; change
  only motivated gaps, music and corresponding picture/caption timing.
- **Voice performance:** use the same spoken words without music. Match listening
  loudness, retain raw files, and disclose any normalization or processing that
  could influence preference. First ask which sounds like Aaron, then which
  carries the thought. Faster, louder and more expressive are separate qualities.

If several controls change together, call it a candidate direction, not evidence
that one parameter caused an improvement. Do not silently promote the winner of
an automated score into the default voice profile.

## Give music a job before selecting a track

For each meaningful turn, name what the listener should understand or feel, what
the voice does, when music enters/leaves, and what remains visible during a gap.
Assign different jobs such as questioning, movement, holding or resolution;
`music: calm` is not enough. Silence is a deliberate option. New music should be
requested with an instrumental palette and an internal phrase arc, not only a
genre label. Prompted timings are intentions; measure the generated result.

Search reuse history as well as asset suitability. If the author explicitly
identifies reuse fatigue, carry that rejection into the selection; the familiar
track is no longer the default merely because it is available. A recurring sonic
identity can keep a palette while varying motifs, arrangement and musical roles.

Short-form skills can contribute pacing and sound-bridge ideas. Do not transfer
their effect density, promotional impact statistics or broad licensing claims
into an essay. Read actual source instructions before borrowing a technique.

## Separate identity from performance when useful

Consult current provider documentation before using model-specific controls.
ElevenLabs v2 break tags and v3 audio tags are different interfaces; check current
PVC support before treating a model upgrade as an upgrade to Aaron's voice.

Voice Changer is an optional experiment: a directed guide performance can be
converted into an authorized target voice. Use a provider voice available in the
account or Aaron's own guide recording; retain source, request and output. Test
whether accent, pace or personality leaked from the guide. The guide is a
reference, not a decision to replace the author's voice.

Text-equivalent requests and a matching ASR transcript help detect omissions or
spoken stage directions. They do not establish naturalness, emphasis, pronunciation
quality or voice identity. Keep that review pending if it has not been heard.

## Preserve a fair and reversible comparison

Keep the prior master and profile, source hashes, generated raw assets and a cue
manifest. Use one time mapping for retained narration spans, inserted holds,
scenes, animation cues, captions and eventual chapter timestamps. Put a hold
after a complete thought, check the actual audio around the cut, and avoid
showing the next sentence during the gap.

Fade and automate the music bus, not the entire mix. A quieter final sentence
should result from the score making space, not the speaker being turned down.
When the task preserves voice, compare aligned PCM spans at unity gain. Check
the encoded result for peak headroom, timing and a finished decay. If dry
auditions require dynamic normalization to compare them fairly, document it
separately; never apply it silently to the preserved film voice.

Offer a compact review surface: original/new film passage, a few same-text dry
voices, optionally concealed method labels, and space for a timestamped reaction.
Do not autoplay multiple tracks. Preserve author feedback as feedback, not a
technical PASS. Extend a selected direction through the remaining film with a
whole-film sound map, rather than repeating the prototype cue everywhere.

## Working example and sources

The code-upstream experiment in
`src/content/blogs/2026-09-07-code-upstream/revisions/sound-direction-06/`
demonstrates reproducible raw assets, voice-span comparison, two motivated holds,
fresh cues and a listening page. Aaron selected sound direction B and same-PVC
voice B for this film; `video-production/v3/author-selection.md` records the scope.
The full-film extension has its own review status. Its instrumentation, pause
lengths and gain values are examples, not defaults. When combining an approved
edit direction with a newly selected voice, measure the voice's existing gaps
and add only the missing time toward a meaningful pause; do not stack both sets
of pauses blindly.

- [ElevenLabs delivery controls](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices)
- [ElevenLabs Voice Changer](https://elevenlabs.io/docs/api-reference/speech-to-speech/convert)
- [Remotion official skills](https://github.com/remotion-dev/skills)
