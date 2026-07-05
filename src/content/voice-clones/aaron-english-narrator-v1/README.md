# Aaron Voice Clone Recording Kit

Voice: Aaron English Narrator v1
Target: 50 minutes of clean, consistent English narration

## Folder Layout

- `recording-script.md`: what to read or freestyle from.
- `recordings/`: put raw exported audio here when you are ready. This folder is gitignored.
- `eval-plan.json`: ElevenLabs A/B sample matrix for the cloned voice.
- `samples/`: generated ElevenLabs test samples. This folder is gitignored.
- `scorecard.md`: manual listening rubric.

## Recording Standard

- Record with the same microphone, room, distance, and gain for every take.
- Leave natural pauses between ideas; silence can be trimmed later.
- Do not perform a perfect American accent; aim for clear, relaxed English with Aaron's natural identity.
- Restart a sentence if needed, but do not chase a flawless performance.
- Keep background noise, keyboard sound, chair movement, and mouth clicks as low as possible.

## Later Commands

Create or refresh this kit:

```bash
npx -y bun tiles/aaron-video-gen/scripts/voice-clone-workflow.ts kit \
  --output src/content/voice-clones/aaron-english-narrator-v1
```

Audit recordings after you export audio:

```bash
npx -y bun tiles/aaron-video-gen/scripts/voice-clone-workflow.ts audit \
  --audio-dir src/content/voice-clones/aaron-english-narrator-v1/recordings \
  --output src/content/voice-clones/aaron-english-narrator-v1/recording-audit.md
```

Generate A/B samples after ElevenLabs gives you a voice ID:

```bash
ELEVENLABS_API_KEY=... npx -y bun tiles/aaron-video-gen/scripts/voice-clone-workflow.ts samples \
  --plan src/content/voice-clones/aaron-english-narrator-v1/eval-plan.json \
  --output src/content/voice-clones/aaron-english-narrator-v1/samples
```

## ElevenLabs Notes

- Preferred path: Use Professional Voice Clone for the final Aaron narration voice. Use Instant Voice Clone only for quick experiments.
- Fallback path: If Professional Voice Clone is not ready, use the existing Henry voice ID until the clone passes the scorecard.

Sources:
- https://elevenlabs.io/docs/eleven-creative/voices/voice-cloning
- https://elevenlabs.io/docs/eleven-api/concepts/voice-cloning
- https://elevenlabs.io/docs/api-reference/text-to-speech/convert
