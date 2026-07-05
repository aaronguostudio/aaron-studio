# Voice Recommendation: The One-Person Project

## Recommendation

Do not use the generic ElevenLabs Rachel/Henry-style voice for the final public render.

This video is personal and operator-led. The voice should feel like Aaron explaining a real workflow lesson, not like a generic narrated explainer. Prepare the video package now, then render the final MP4 after a custom ElevenLabs voice is available.

## Best Option

Use ElevenLabs Professional Voice Cloning for the final voice if the account supports it.

Why:

- It is designed for a more faithful, stable personal voice than a quick instant clone.
- It fits long-form YouTube better, where small voice mismatches become more noticeable over five minutes.
- It turns the channel voice into a reusable asset for future blog-to-video work.

Instant Voice Cloning is still useful for a quick proof, but I would treat it as draft quality for this channel.

## Recording Checklist

- Record in English, since this video is English.
- Use the same mic/setup you would be comfortable using for the channel.
- Record in a quiet room with minimal echo, no music, no background noise, and no heavy noise suppression artifacts.
- Speak in your natural explanatory style: measured, thoughtful, slightly energetic.
- Keep the performance consistent. Do not mix whispering, reading voice, podcast voice, and meeting voice in the same dataset.
- If using Instant Voice Cloning, start with about 1-2 minutes of clean audio.
- If using Professional Voice Cloning, aim for at least 1 hour of clean material; closer to 3 hours is better if available.
- Read material that resembles your channel: AI engineering, product thinking, software delivery, decision making.

## Suggested Sample Script

Record 10-15 minutes first, then repeat with a second take if needed:

> One thing I have been thinking about is how AI coding changes the shape of collaboration. The obvious story is that developers can write code faster. But in real teams, the more interesting change is where the bottleneck moves. It moves from typing code to reviewing context, risk, and system fit. That is why I do not think the future is simply smaller teams or less QA. I think the future is clearer ownership, better evidence, and stronger boundaries.

Then add a few natural explanations from your own recent work:

- Why the QA strategy changed.
- What a normal BA/design/dev/QA/UAT/deploy workflow used to feel like.
- A concrete example of AI generating more work than humans can review.
- How you would explain "one-person project" to an engineering manager.

## Render Command After Voice ID Exists

Replace `YOUR_ELEVENLABS_VOICE_ID` with the voice ID from ElevenLabs:

```bash
npx -y bun tiles/aaron-video-gen/scripts/main.ts \
  --script src/content/blogs/2026-07-01/youtube-script.md \
  --output src/content/blogs/2026-07-01/video.mp4 \
  --tts elevenlabs \
  --voice YOUR_ELEVENLABS_VOICE_ID \
  --speed 1.08 \
  --logo assets/aaron-logo-assets/ag-logo.png \
  --slogan "AI-native software engineering" \
  --website "aaronguo.com"
```

The current pipeline already uses ElevenLabs speech timing when `--tts elevenlabs` is selected, so image timing can follow the narration more precisely.

## References

- ElevenLabs Instant Voice Cloning: https://elevenlabs.io/docs/product-guides/voices/voice-cloning/instant-voice-cloning
- ElevenLabs Professional Voice Cloning: https://elevenlabs.io/docs/product-guides/voices/voice-cloning/professional-voice-cloning
- ElevenLabs speech with timing API: https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps
