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

## Topic Selection — The Golden Zone 🎯

The best topics live in the sweet spot: **有趣但不傻，蹭热点但不正经**。

### Tone
- NOT hard science / too serious / "educational YouTube"
- NOT random WTF / absurd / 无厘头
- YES: "我靠真的假的？" — makes people curious, slightly uneasy, want to share
- Target emotions: **贪**（钱、利益）、**嗔**（恐惧、焦虑）、**痴**（好奇、被骗了不自知）

### Topic Formula
1. **Find today's hot trend** (HN, X, news headlines)
2. **DON'T cover the news itself** — find the fascinating adjacent story
3. The topic should make someone stop scrolling AND want to tell a friend

### Examples of Good Angles
- Trend: "Amazon price manipulation" → Topic: "Casinos have no clocks or windows — on purpose" (大公司操控行为)
- Trend: "AI coding goes mainstream" → Topic: "Netflix paid $1M to anyone who could beat their algorithm" (算法操控)
- Trend: "Data breach" → Topic: "90% of people reuse the same password" (每个人看完都心虚)

### Hint-Based Topics
Aaron may drop casual hints from daily life (e.g. "my colleague went to Tulum"). When this happens:
1. Research the hint — find the most fascinating, non-obvious fact related to it
2. Spin it into a knowledge short with the same tone (curious, slightly dark, shareable)
3. Add it to the batch alongside trend-based topics
- Example hint: "Justin went to Tulum" → "The Maya predicted the end of the world... and they were only off by 14 years" or "Tulum was the only Maya city with a beach — because it was a trading port for obsidian"

### Anti-Patterns (Avoid)
- ❌ Pure hard science ("Your brain uses 20 watts")
- ❌ Random gross facts ("Your mattress doubles in weight")  
- ❌ Too dark / violent without a clever angle
- ❌ Generic listicle energy ("5 things you didn't know")

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
- **Title banner:** `top: 320px` (below status bar + Shorts nav + Subscriptions/Live/Lens row)
- **Captions:** `bottom: 380px` (above channel name + video title + nav bar + potential tags)

If text gets clipped, adjust these values in `KnowledgeShort.tsx`.

## Title Banner Guidelines

- Short (2-6 words)
- English
- Can include one emoji
- Acts as the "hook" — visible for the entire video
- Should make viewers curious enough to keep watching

## YouTube Upload & Scheduling

After generation, upload to YouTube with scheduled publishing:

```bash
cd /Users/aaron/Work/aaron-studio && npx -y bun tiles/aaron-yt-pipeline/scripts/youtube-upload.ts \
  --video output/short-final.mp4 \
  --metadata output/metadata.yaml \
  --schedule "2026-02-25T08:00:00-07:00"
```

### Scheduling Strategy
- Generate videos today → schedule for **tomorrow** at staggered times
- Best time slots (MST): **8:00 AM**, **12:00 PM**, **5:00 PM**
- Max 3 shorts per day (avoid flooding subscribers)
- Aaron reviews in YouTube Studio before publish time; cancel any he doesn't like
- `--schedule` uses ISO 8601 format with timezone (MST = -07:00, MDT = -06:00)

### Metadata YAML format
```yaml
title: "Casino Tactics Exposed! 🎰 #casino #shorts"
description: |
  Discover the secrets behind casino design.
  
  #casino #psychology #shorts #funfact #aiart
tags:
  - "casino"
  - "shorts"
category: "28"
language: en
privacy: private
```

## ⚠️ iCloud Sync — Script Handles It

The generate script automatically syncs the final video to `iCloud/Aaron-Studio/shorts-ready/` with a slug-based filename. **Do NOT manually copy/sync files to iCloud** — this causes duplicates. The script's sync is the single source of truth.

If you need a custom filename, pass `--output` with a meaningful directory name — the script uses `--topic` to generate the iCloud filename.

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
