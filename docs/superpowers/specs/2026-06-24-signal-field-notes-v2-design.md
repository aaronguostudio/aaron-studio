# Signal Field Notes V2 Design

## Goal

Create a second concept sample for the Signal/Radar video format that is easier to listen to and lower in visual information density than the first dashboard sample.

## Format

The V2 sample is a 16:9 Remotion-rendered video named `SignalFieldNotesSample`. It uses the same Perplexity release-note topic as V1 so the comparison isolates format and style rather than content.

## Viewer Promise

The video should feel like an operator field note: one signal, one plain-language implication, one judgment. A viewer should understand the point while mostly listening, without needing to read dense on-screen text.

## Style Rules

- One idea per screen.
- No tables or multi-metric scorecards.
- Each screen uses one dominant phrase of 3-8 words.
- Supporting text is optional and short.
- Motion is calm: editorial fades, slow drift, small reveals.
- Use more negative space and fewer simultaneous UI objects than V1.
- Keep captions phrase-level and stable.

## Story Structure

1. Signal found an update.
2. The feature name is not the point.
3. The workflow implication is removing copy-paste loops.
4. The verdict is use for drafts, review before publishing.
5. The next test is same brief, same sources, stopwatch on.

## Audio Direction

Use temporary macOS TTS for pacing only. The real pilot should use Aaron's recorded narration or a licensed voice clone. Script should sound like a person making a practical judgment, not reading release notes.

## Output

- `src/content/videos/2026-06-24-signal-field-notes-v2/script.md`
- `src/content/videos/2026-06-24-signal-field-notes-v2/narration.txt`
- `src/content/videos/2026-06-24-signal-field-notes-v2/video.mp4`
- Remotion V2 composition and public narration asset under `tiles/aaron-video-gen/remotion/`

## Non-Goals

- Do not delete or overwrite V1.
- Do not build the reusable production generator yet.
- Do not use external TTS or image APIs in this pass.
