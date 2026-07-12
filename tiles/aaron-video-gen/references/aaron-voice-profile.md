# Aaron Narration Voice Profile

## Production Default

- Profile ID: `aaron-pvc-identity-v1`
- ElevenLabs voice ID: `R2DWp7zZuWmGxk3r8GIA`
- Voice type: Professional Voice Clone
- Model: `eleven_multilingual_v2`
- Output format: `mp3_44100_192`
- Stability: `0.5`
- Similarity boost: `0.75`
- Style: `0.5`
- Speaker boost: enabled
- Speed: `1.0`

The machine-readable source of truth is `config/voice-profiles.json`.

## Selection Decision

Aaron selected blind sample B on 2026-07-11 after comparing:

- the current Multilingual v2 identity-first settings;
- a tuned Multilingual v2 candidate;
- Eleven v3 Natural with sparse delivery tags;
- a short Eleven v3 Creative stress test.

Aaron found sample B the closest to his real voice. Sample A sounded more natural, but preserving a recognizable personal voice and long-term IP was more important than maximizing model expressiveness.

The source test package is `src/content/blogs/2026-07-06/audio-tests/`.

## V5 Editorial Candidate

`aaron-pvc-editorial-v5-candidate` keeps the same Professional Voice Clone and
Multilingual v2 model while using a lower stability, slightly higher style, and
`1.04` speed. It was created to test a more active long-form editorial delivery
without sacrificing Aaron's recognizable voice. It is intentionally **not** the
production default: the V5 master is a listening review, and Aaron must approve
opening, middle, and late passages before the profile is promoted.

## Operating Rule

Use this profile for Aaron's English blog narration and YouTube essays unless Aaron explicitly chooses another profile.

Do not automatically migrate the production voice when ElevenLabs releases a newer model. A new model, clone, remix, or parameter set must pass a blind listening comparison on the same locked 45-60 second script.

Score identity first, followed by naturalness, authority, technical clarity, pacing, and long-form fatigue. Keep the current profile when a candidate sounds more polished but materially less like Aaron.

## Duration Calibration

Do not estimate this voice with a generic 145-155 words-per-minute presenter
rate. The FDE field-signal prototype measured 155 timed word tokens across
80.88 seconds, or about 115 tokens per minute, with the approved speed at `1.0`.

Use `110-115` spoken words per minute for planning until a larger sample changes
the calibration. Generate narration before locking scene timing. When a script
misses its target duration, edit the language first; do not accelerate Aaron's
voice merely to rescue the storyboard. Add music prelude and ending time after
the measured narration duration.

## Change Gate

Re-evaluate the profile only when:

- Aaron records or trains a new clone;
- a model materially improves Professional Voice Clone fidelity;
- the current profile develops repeatable pronunciation or pacing problems;
- the narration format changes substantially;
- Aaron explicitly requests another voice direction.

Promote a winner by updating `config/voice-profiles.json`, this reference, automated tests, and the skill defaults together.

## Audio Listening Gate

Treat narration as a listening product before it becomes a video track.

- Preserve the raw ElevenLabs output.
- Inspect duration, sample rate, channels, integrated loudness, true peak, and
  long silence.
- Create a normalized review copy around `-16 LUFS`, with true peak at or below
  `-1.5 dB`.
- Create a 60-second opening sample for fast comparison.
- Review the exact post-rewrite transcript sent to TTS.
- Skip LLM rewriting when the manually written source already passes the spoken
  transcript gate.
- Compare model or setting changes on the same locked 45-60 second script under
  blind labels.
- Score identity, naturalness, pronunciation, pace consistency, technical-term
  clarity, authority, and fatigue.

Do not render the video until a new voice passes this gate.

## Voice Clone Workflow

Generate the recording kit:

```bash
npx -y bun ${SKILL_DIR}/scripts/voice-clone-workflow.ts kit \
  --output src/content/voice-clones/aaron-english-narrator-v1 \
  --voice-name "Aaron English Narrator v1" \
  --target-minutes 50
```

After recordings are exported to `recordings/`, audit them:

```bash
npx -y bun ${SKILL_DIR}/scripts/voice-clone-workflow.ts audit \
  --audio-dir src/content/voice-clones/aaron-english-narrator-v1/recordings \
  --output src/content/voice-clones/aaron-english-narrator-v1/recording-audit.md \
  --target-minutes 45
```

After ElevenLabs returns a `voice_id`, add it to `eval-plan.json` and generate
blind samples:

```bash
ELEVENLABS_API_KEY=... npx -y bun ${SKILL_DIR}/scripts/voice-clone-workflow.ts samples \
  --plan src/content/voice-clones/aaron-english-narrator-v1/eval-plan.json \
  --output src/content/voice-clones/aaron-english-narrator-v1/samples
```

Prefer Professional Voice Clone for production. Use Instant Voice Clone only
for fast experiments. Do not promote a clone until the selected setting scores
4+ on identity, naturalness, clarity, pacing, and fatigue.
