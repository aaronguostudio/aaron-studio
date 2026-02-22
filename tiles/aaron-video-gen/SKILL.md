---
name: aaron-video-gen
description: Generate YouTube videos from a script markdown file and slide images. Parses youtube-script.md format, generates TTS narration, applies fade transitions between slides, and outputs MP4. Use when user asks to "generate video", "create YouTube video", "make video from images", or "make slideshow video".
---

# Video Generation

Generate YouTube-ready MP4 videos from a script markdown file and slide images.

## Pipeline

1. **Parse** the youtube-script.md — extract slide sections (image reference + narration text)
2. **Generate narration** — TTS audio for each slide section (edge-tts or OpenAI)
3. **Calculate timing** — each slide's duration matches its narration audio length + padding
4. **Build video** — FFmpeg composites slides with fade transitions, synced with narration
5. **Mix music** (optional) — layer background music at configurable volume
6. **Output** — MP4 file (1920x1080 by default)

## Prerequisites

- **FFmpeg** must be installed (`brew install ffmpeg` on macOS)
- **edge-tts** for free TTS (`pip install edge-tts`), OR
- **OpenAI API key** for premium TTS (set `OPENAI_API_KEY` env var), OR
- **ElevenLabs API key** for high-quality / voice-cloned TTS (set `ELEVENLABS_API_KEY` env var)
- **Whisper** for auto-captioning (`pip install openai-whisper`) — optional, used with `--captions`

## Script Directory

Scripts are located at `${SKILL_DIR}/scripts/main.ts`

## Usage

```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts --script <path-to-youtube-script.md> [options]
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--script`, `-s` | Path to youtube-script.md file | (required) |
| `--output`, `-o` | Output video file path | `<script-dir>/video.mp4` |
| `--images-dir` | Directory containing slide images | `<script-dir>/imgs/` |
| `--tts` | TTS provider: `edge-tts`, `openai`, or `elevenlabs` | `edge-tts` |
| `--voice` | TTS voice name/ID | `en-US-AndrewMultilingualNeural` (edge-tts) / `alloy` (openai) / voice ID (elevenlabs) |
| `--resolution` | Video resolution | `1920x1080` |
| `--transition` | Transition type: `fade`, `fadeblack`, `wipeleft`, `slideright`, `dissolve`, `varied` | `fade` |
| `--ken-burns` | Enable Ken Burns zoom/pan effect on slides | `true` |
| `--no-ken-burns` | Disable Ken Burns effect (static slides) | |
| `--captions` | Generate and burn in subtitles via Whisper | `false` |
| `--no-captions` | Disable caption generation | |
| `--transition-duration` | Transition duration in seconds | `2` |
| `--music` | Path to background music file (optional) | none |
| `--music-volume` | Background music volume (0.0-1.0) | `0.1` |
| `--padding` | Extra seconds of padding per slide | `1` |
| `--fps` | Frames per second | `24` |
| `--dry-run` | Print the FFmpeg command without executing | `false` |

## Script Format

The skill parses markdown files with this structure:

```markdown
## [SLIDE: Title — filename.png]

Narration text for this slide goes here.
Multiple paragraphs are supported.

---

## [SLIDE: Another Slide — 01]

More narration text.

---
```

### Slide Matching Rules

The text after `—` (em dash) in the slide header is used to find the image:
1. If it's a full filename (e.g., `00-cover.png`), use that file directly
2. If it's a number prefix (e.g., `01`), find the first image in `--images-dir` starting with that prefix
3. If it's a description, the images are matched in order of appearance

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Required for OpenAI TTS provider |
| `ELEVENLABS_API_KEY` | Required for ElevenLabs TTS provider |

Environment variables are loaded with this priority:
1. CLI environment
2. `process.env`
3. `<cwd>/.env` (project root)
4. `<cwd>/.baoyu-skills/.env`
5. `~/.baoyu-skills/.env`

## Preferences (EXTEND.md)

Create `<cwd>/.aaron-skills/aaron-video-gen/EXTEND.md` or `~/.aaron-skills/aaron-video-gen/EXTEND.md`:

```yaml
---
version: 1
tts_provider: edge-tts
voice: en-US-AndrewMultilingualNeural
resolution: 1920x1080
transition: fade
transition_duration: 2
music_volume: 0.1
padding: 1
fps: 24
---
```

## Examples

Generate video with default settings (free edge-tts):
```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts --script src/blogs/2026-02-12/youtube-script.md
```

Generate with OpenAI TTS and background music:
```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts \
  --script src/blogs/2026-02-12/youtube-script.md \
  --tts openai --voice nova \
  --music assets/ambient-bg.mp3 \
  --music-volume 0.08
```

Dry run to preview the FFmpeg command:
```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts \
  --script src/blogs/2026-02-12/youtube-script.md \
  --dry-run
```
