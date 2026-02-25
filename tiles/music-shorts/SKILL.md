---
name: music-shorts
description: Generate "If This Song Was a Painting" YouTube Shorts. AI video (Kling v3) + hook text overlay (ffmpeg). Use when user asks to "make a music short", "song painting video", "if this song was a painting", or "music AI video".
---

# Music Shorts — "If This Song Was a Painting"

Generate 15-second vertical YouTube Shorts that visualize songs as cinematic paintings.

## Pipeline

1. **Song Selection** — Pick a song + identify the emotional peak moment
2. **Script** — Write hook text, Kling prompt (emotion-first, 4 scenes), YouTube metadata
3. **Generate** — Kling v3 (15s, 9:16, pro, multi_shot)
4. **Overlay** — ffmpeg adds hook text to first 2.5s (fade in/out)
5. **Output** — 1080x1920 MP4, synced to iCloud
6. **Human step** — Aaron adds music via YouTube app (set start time from metadata)

## Quick Start

```bash
npx -y bun ${SKILL_DIR}/scripts/generate.ts \
  --song "Bohemian Rhapsody — Queen" \
  --output src/content/shorts/music-bohemian-rhapsody/
```

All fields auto-generated from the song name. Or provide everything:

```bash
npx -y bun ${SKILL_DIR}/scripts/generate.ts \
  --song "Bohemian Rhapsody — Queen" \
  --hook "If this song was the last\nthing you ever heard 🎭" \
  --music-start "4:07" \
  --output src/content/shorts/music-bohemian-rhapsody/
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--song` | Song name + artist | (required) |
| `--hook` | Hook text overlay (2 lines, use `\n`) | auto-generated |
| `--video-prompt` | Kling v3 prompt | auto-generated |
| `--music-start` | Timestamp to start music in YouTube | auto-generated |
| `--music-note` | Why this timestamp matters | auto-generated |
| `--yt-title` | YouTube title | auto-generated |
| `--yt-desc` | YouTube description | auto-generated |
| `--output`, `-o` | Output directory | `./output/` |
| `--skip-video` | Reuse cached Kling video | `false` |

## Script Format (music-short.json)

```json
{
  "song": "Bohemian Rhapsody — Queen",
  "hook": "If this song was the last\nthing you ever heard 🎭",
  "musicStart": "4:07",
  "musicNote": "Operatic section climax — 'Galileo' crescendo",
  "videoPrompt": "Cinematic vertical video...",
  "ytTitle": "If Bohemian Rhapsody was the last thing you heard 🎭",
  "ytDesc": "Queen didn't write songs. They wrote universes. #queen #bohemianrhapsody #aiart #shorts",
  "lyrics": "Galileo, Galileo, Galileo figaro"
}
```

## Hook Text Guidelines

- **Two lines max** — short, punchy, emotional
- Patterns that work:
  - "If this song was a painting..." (classic)
  - "POV: [emotional scenario]" 
  - "The sound of [feeling]"
  - "Play this at [dramatic moment]"
- One emoji at the end
- Must create curiosity in first 0.5s

## Video Prompt Guidelines

- Emotion-first, not beauty-first
- 4 scenes with build-up → payoff arc
- Human stories > pure landscapes
- Match the song's emotional peak, not just the genre
- End with: color palette + "Photorealistic" + mood descriptor
- NO text in the video (text comes from ffmpeg overlay)

## Song Selection Strategy

Best performers by category:
- **Classics with huge audiences**: Dream On, Stairway to Heaven, Hotel California
- **Emotional instrumentals**: Interstellar, Experience (Einaudi), Time (Inception)
- **Current trending songs**: Check Billboard/Spotify weekly
- **Nostalgia plays**: 80s/90s hits that trigger memories
- **Sad/emotional**: songs that make people feel something → higher engagement

## Batch Generation

```bash
npx -y bun ${SKILL_DIR}/scripts/batch.ts \
  --songs songs.json \
  --output src/content/shorts/
```

Where `songs.json`:
```json
[
  { "song": "Dream On — Aerosmith" },
  { "song": "Stairway to Heaven — Led Zeppelin" },
  { "song": "Hotel California — Eagles" }
]
```

## Output Files

| File | Description |
|------|-------------|
| `music-short.json` | Full script definition |
| `raw-video.mp4` | Kling v3 video (no overlay) |
| `short-final.mp4` | Final with hook text overlay |

## Upload Guide (Aaron's manual step)

After generation, Aaron uploads via YouTube app:
1. Select video from iCloud `shorts-ready/`
2. Add title + description from metadata
3. **Add music**: search song → set start time from `musicStart`
4. Publish or schedule

## Prerequisites

- **Kling API keys**: `KLING_ACCESS_KEY` + `KLING_SECRET_KEY`
- **OpenAI API key**: `OPENAI_API_KEY` (for auto-generation)
- **ffmpeg**: `brew install ffmpeg`
