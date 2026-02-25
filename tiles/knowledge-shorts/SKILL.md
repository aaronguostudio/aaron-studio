---
name: knowledge-shorts
description: Generate 15-second YouTube Shorts that teach one fun fact per video. AI-generated video (Kling v3) + narration (ElevenLabs) + word-level captions (Remotion). Use when user asks to "make a knowledge short", "generate fun fact video", "create a 15s short", "knowledge video", or "did you know short".
---

# Knowledge Shorts

Generate 15-second vertical YouTube Shorts that teach one interesting fact per video.

## Pipeline

1. **Topic** — Pick a topic + research the key fact (with source)
2. **Script** — Write narration (~40-45 words for 14s of speech at 1.2x speed)
3. **Video prompt** — Cinematic Kling v3 prompt matching the topic (15s, 9:16, pro, multi_shot)
4. **Generate** — Kling video + ElevenLabs TTS (in parallel where possible)
5. **Render** — Remotion composites: video background + title banner + word-level captions + audio
6. **Output** — 1080x1920 MP4, synced to iCloud

## Quick Start

```bash
npx -y bun ${SKILL_DIR}/scripts/generate.ts \
  --topic "AI electricity consumption" \
  --title "How Much Power Does AI Use? ⚡" \
  --narration "Every ChatGPT query uses ten times more electricity than a Google search. One prompt burns three watt-hours. Google? Just zero point three. If everyone switched to AI, we'd need new power plants just to keep up. Your AI has a bigger electricity bill than your fridge." \
  --video-prompt "Cinematic vertical video, dramatic tech documentary style..." \
  --output src/content/shorts/knowledge-01/
```

Or let the agent handle everything (recommended):

```bash
npx -y bun ${SKILL_DIR}/scripts/generate.ts \
  --topic "AI electricity consumption" \
  --output src/content/shorts/knowledge-01/
```

When `--narration` and `--video-prompt` are omitted, the script uses OpenAI to generate them from the topic.

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--topic` | Topic / fun fact to cover | (required) |
| `--title` | Title banner text (English, short) | auto-generated |
| `--narration` | Narration text (~40-45 words) | auto-generated |
| `--video-prompt` | Kling v3 video prompt | auto-generated |
| `--output`, `-o` | Output directory | `./output/` |
| `--yt-title` | YouTube title | auto-generated |
| `--yt-desc` | YouTube description + hashtags | auto-generated |
| `--voice` | ElevenLabs voice ID | `991lF4hc0xxfec4Y6B0i` (Henry) |
| `--speed` | TTS speed | `1.2` |
| `--skip-video` | Skip Kling generation (reuse cached) | `false` |
| `--skip-tts` | Skip TTS generation (reuse cached) | `false` |

## Script Format (knowledge-short.json)

Each short is defined by a JSON file saved in the output directory:

```json
{
  "topic": "AI electricity consumption",
  "title": "How Much Power Does AI Use? ⚡",
  "narration": "Every ChatGPT query uses ten times more electricity...",
  "videoPrompt": "Cinematic vertical video...",
  "ytTitle": "Your AI uses 10x more electricity than Google ⚡",
  "ytDesc": "Every ChatGPT query burns 10x more power. #ai #shorts",
  "source": "Goldman Sachs Research, 2024",
  "voice": "991lF4hc0xxfec4Y6B0i",
  "speed": 1.2
}
```

## Narration Guidelines

- **~40-45 words** — fits in ~14 seconds at 1.2x speed
- **Structure:** Hook (surprising fact) → Context (scale it) → Punchline (memorable closer)
- **No filler** — every word earns its place
- **Conversational** — sounds natural spoken aloud
- **Factual** — include verifiable claims with source

## Video Prompt Guidelines

- Always include: `"Cinematic vertical video"`, `"multi-scene transitions"`
- 3-4 scenes that visually tell the story
- End with: `"Photorealistic"` + mood/color palette
- Match the emotional arc of the narration

## YouTube Shorts Safe Zones

On mobile, YouTube overlays UI elements (status bar, search, channel info, music, nav bar) that cover the top ~160px and bottom ~280px of a 1920-tall frame. The Remotion `KnowledgeShort` composition positions:
- **Title banner:** `top: 160px` (below status bar + search)
- **Captions:** `bottom: 280px` (above channel/music/nav)

If text gets clipped, adjust these values in `KnowledgeShort.tsx`.

## Title Banner Guidelines

- Short (2-6 words)
- English
- Can include one emoji
- Acts as the "hook" — visible for the entire video
- Should make viewers curious enough to keep watching

## Output Files

| File | Description |
|------|-------------|
| `knowledge-short.json` | Script definition |
| `kling-video.mp4` | Raw Kling v3 video (15s, 9:16) |
| `narration.mp3` | ElevenLabs audio |
| `timings.json` | Word-level timestamps |
| `short-final.mp4` | Final rendered video (Remotion) |

## Batch Generation

To generate multiple shorts at once:

```bash
npx -y bun ${SKILL_DIR}/scripts/batch.ts \
  --topics topics.json \
  --output src/content/shorts/
```

Where `topics.json` is:

```json
[
  { "topic": "AI electricity consumption" },
  { "topic": "Octopus has three hearts" },
  { "topic": "Honey never expires" },
  { "topic": "GPS satellites need Einstein's relativity" },
  { "topic": "Voyager 1 is still sending data" }
]
```

## Prerequisites

- **Kling API keys**: `KLING_ACCESS_KEY` + `KLING_SECRET_KEY` in `.env`
- **ElevenLabs API key**: `ELEVEN_LABS` in `.env`
- **OpenAI API key**: `OPENAI_API_KEY` in `.env` (for auto-generation)
- **Remotion**: installed in `tiles/aaron-video-gen/remotion/`
- **FFmpeg**: `brew install ffmpeg`

## Architecture

This skill reuses the `aaron-video-gen` Remotion project's `KnowledgeShort` composition (1080x1920, 9:16). It does NOT affect the blog video pipeline (`SlideshowVideo` composition).

```
knowledge-shorts/          ← this skill (topic → script → orchestration)
  └── uses → aaron-video-gen/remotion/
                └── KnowledgeShort composition (render only)
```
