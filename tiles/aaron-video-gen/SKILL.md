---
name: aaron-video-gen
description: Generate YouTube videos from a script markdown file and slide images. Parses youtube-script.md format, generates TTS narration, applies fade transitions between slides, and outputs MP4. Also generates YouTube metadata (title, description, chapters, tags) and thumbnails. Use when user asks to "generate video", "create YouTube video", "make video from images", "make slideshow video", or "generate YouTube metadata".
---

# Video Generation

Generate YouTube-ready MP4 videos from a script markdown file and slide images.

## Pipeline

1. **Parse** the youtube-script.md — extract slide sections, detect `[IMAGE:]` markers for progressive builds
2. **Rewrite narration** (optional) — LLM rewrites narration conversationally (pauses, humor, natural rhythm). Tracks used openings and transition phrases across slides to avoid repetition (e.g., "You know what's interesting" won't appear multiple times)
3. **Generate narration** — TTS audio for each slide section (edge-tts, OpenAI, or ElevenLabs)
4. **Compute progressive build timings** — sync image changes to word-level timestamps from ElevenLabs
5. **Build video** — Remotion renders slides with progressive reveals, captions, transitions, and branding
6. **Mix music** (optional) — layer background music with auto-ducking during narration
7. **Output** — MP4 file (1920x1080 by default)

## Recommended Workflow

For Aaron's YouTube channel, the standard command is:

```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts \
  --script <path-to-youtube-script.md> \
  --renderer remotion \
  --tts elevenlabs \
  --voice 991lF4hc0xxfec4Y6B0i \
  --speed 1.1 \
  --logo assets/aaron-logo-assets/ag-logo.png \
  --slogan "AI-native builder. Human-first thinker." \
  --website aaronguo.com
```

Key defaults for Aaron's videos:
- **TTS**: ElevenLabs, Henry voice (991lF4hc0xxfec4Y6B0i), speed 1.1x
- **Renderer**: Remotion (motion graphics, progressive builds, word-level captions)
- **Branding**: ag-logo.png + slogan + website in intro and outro
- **Transitions**: 1.2s between slides (fade, slide, wipe, flip, etc.)
- **Images**: Static within slides (no Ken Burns), progressive builds via `[IMAGE:]` markers

## Prerequisites

- **Node.js** >= 18 (required for Remotion renderer)
- **FFmpeg** must be installed (`brew install ffmpeg` on macOS)
- **ElevenLabs API key** for high-quality TTS with word timings (set `ELEVENLABS_API_KEY` env var) — recommended
- **OpenAI API key** for narration rewrite and optional TTS (set `OPENAI_API_KEY` env var)
- **edge-tts** for free TTS (`pip install edge-tts`) — fallback option

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
| `--voice` | TTS voice name/ID | provider-dependent |
| `--speed` | TTS speech speed (ElevenLabs: 0.7-1.2, OpenAI: 0.25-4.0) | `1.1` |
| `--renderer` | Video renderer: `remotion` (recommended) or `ffmpeg` (legacy) | `remotion` |
| `--logo` | Path to logo image for intro/outro branding | none |
| `--slogan` | Slogan text for intro/outro branding | none |
| `--website` | Website URL for intro/outro branding | none |
| `--skip-tts` | Skip TTS generation, reuse cached audio from previous runs | `false` |
| `--transition-duration` | Transition duration in seconds | `1.2` |
| `--music` | Path to background music file | none |
| `--music-volume` | Background music volume (0.0-1.0) | `0.1` |
| `--padding` | Extra seconds of padding per slide | `1` |
| `--fps` | Frames per second | `24` |
| `--conversational` | Enable LLM rewrite for natural tone | `true` |
| `--no-conversational` | Disable LLM narration rewrite | |
| `--resolution` | Video resolution (legacy FFmpeg only) | `1920x1080` |
| `--dry-run` | Print the command without executing | `false` |

## Script Format

The skill parses markdown files with this structure:

```markdown
# Video Title

## [SLIDE: Cover Image — cover.png]

Narration text for this slide.

---

## [SLIDE: Slide Title — 01a-partial.png]

First part of narration...

[IMAGE: 01-full.png]

Second part of narration after image change...

---
```

### Progressive Builds with `[IMAGE:]` Markers

To make slides more engaging (like PowerPoint builds), add `[IMAGE:]` markers inline in the narration. The system crossfades between images synced to the narration:

- The initial image comes from the `[SLIDE:]` header (e.g., `01a-partial.png` — a partial version)
- `[IMAGE: 01-full.png]` triggers a crossfade to the full version at that narration point
- Multiple markers per slide are supported (2-4 images per slide is typical)
- ElevenLabs word-level timings enable precise sync; other TTS providers use proportional estimation

**Example — 3 images per slide:**
```markdown
## [SLIDE: Two Modes — 04a-two-modes.png]

Scatter Mode is parallel, exploratory, and AI-amplified.

[IMAGE: 04-two-modes.png]

Laser Mode is sequential, focused, and human-led.

[IMAGE: 04b-two-modes.png]

The insight that changed my workflow: the mode matters more than the tool.

---
```

**Image naming convention:**
- `01a-name.png` — partial/progressive build (shown first)
- `01-name.png` — main/full illustration
- `01b-name.png` — second progressive build (shown after main)

### Slide Matching Rules

The text after `—` (em dash) in the slide header is used to find the image:
1. If it's a full filename (e.g., `cover.png`), use that file directly
2. If it's a number prefix (e.g., `01`), find the first image starting with that prefix
3. If it's a description, images are matched in order of appearance

## Video Features

### Branding (Intro + Outro)
When `--logo`, `--slogan`, or `--website` are provided:
- **Intro**: Logo + slogan + website fade in, then video title appears (3.5s)
- **Outro**: Fade to black, logo + slogan + website appear (4s)

### Word-Level Captions
With ElevenLabs TTS, word-level timestamps enable:
- Real-time caption overlay at the bottom of the screen
- Current word highlighted in yellow, past words in white, upcoming words dimmed
- Captions grouped into lines of ~8 words with smooth fade in/out

### Scene Transitions
Between-slide transitions cycle through: fade, slide, wipe, flip, clock-wipe, iris. Each transition is 1.2s by default.

### Background Music Auto-Ducking
When `--music` is provided, the music volume automatically:
- Ducks down during narration
- Rises during transitions between slides
- Fades in at the start and out at the end

### TTS Caching
TTS audio is cached in `<script-dir>/.video-gen-cache/`. On subsequent runs:
- If the narration text + voice + speed match a cached file, the cached audio is reused automatically (no API call)
- If the narration changed (e.g., after editing the script), only the changed slides regenerate TTS
- Use `--skip-tts` to explicitly skip all TTS generation (errors if cache is missing)
- The cache persists across runs — delete `.video-gen-cache/` to force full regeneration

This means visual-only changes (transitions, branding, images) won't re-incur TTS costs.

### Progress Bar
A thin progress indicator at the top shows the current section and overall progress. Uses a dark gradient backdrop for visibility on both light and dark slide backgrounds.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Required for conversational narration rewrite and OpenAI TTS |
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
tts_provider: elevenlabs
voice: 991lF4hc0xxfec4Y6B0i
resolution: 1920x1080
transition_duration: 1.2
music_volume: 0.1
padding: 1
fps: 24
renderer: remotion
conversational: true
speed: 1.1
---
```

## Examples

Generate video with full branding (recommended):
```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts \
  --script src/blogs/2026-02-22/youtube-script.md \
  --renderer remotion \
  --tts elevenlabs \
  --voice 991lF4hc0xxfec4Y6B0i \
  --speed 1.1 \
  --logo assets/aaron-logo-assets/ag-logo.png \
  --slogan "AI-native builder. Human-first thinker." \
  --website aaronguo.com
```

Generate with free TTS (no API key needed):
```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts \
  --script src/blogs/2026-02-22/youtube-script.md
```

Generate with OpenAI TTS:
```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts \
  --script src/blogs/2026-02-22/youtube-script.md \
  --tts openai --voice nova \
  --renderer remotion
```

## Image Generation Workflow

For each blog post, generate 10-20 images total:
1. **Base illustrations** (5-7): Main concept images for each slide section, matching the blog's existing art style
2. **Progressive builds** (5-10): Partial versions that reveal content step by step, named with `a`/`b` suffixes

Use the `baoyu-image-gen` skill to generate images. For Aaron's style:
- Notion-style minimalist hand-drawn line art
- Simple doodle-style with intentional wobble, stick figures
- Clean black outlines (#1A1A1A) on white background (#FFFFFF)
- Pastel accents: soft blue (#A8D4F0), soft yellow (#F9E79F), soft pink (#FADBD8)
- 16:9 aspect ratio, 2K quality

## YouTube Metadata Generation

After the video is generated, create a `youtube-metadata.md` file in the same directory as the script with optimized metadata for YouTube SEO.

### Title
- Use the video's main title — it should be compelling, include keywords, and stay under 70 characters
- Format: hook + tension (e.g., "AI Made Me 10x More Productive. Then I Almost Burned Out.")

### Description
Structure the description in this order:
1. **Hook** (first 2-3 lines) — visible in search results, must grab attention and include primary keywords
2. **Brief summary** — 2-3 sentences on what the video covers
3. **Chapters** — timestamps for each slide section (YouTube auto-generates chapter markers)
4. **Key takeaways** — bulleted list of main insights
5. **Research cited** — sources referenced in the video
6. **Links** — blog post URL, website, newsletter
7. **Hashtags** — 5-10 relevant hashtags at the end

#### Computing Chapter Timestamps
Calculate from slide audio durations + intro hook (3.5s) + transitions (1.2s overlap):
- Chapter 0 starts at `0:00`
- Each subsequent chapter: previous start + slide duration - transition overlap
- Round to nearest second for clean timestamps

### Tags
Include 15-20 comma-separated keywords covering:
- Primary topic keywords (e.g., "AI productivity", "AI burnout")
- Framework/concept names (e.g., "Kahneman thinking fast and slow", "scatter mode laser mode")
- Broad category tags (e.g., "artificial intelligence", "productivity tips", "deep work")
- Timely tags (e.g., "AI 2026")

### Example
```markdown
# YouTube Metadata

## Title
AI Made Me 10x More Productive. Then I Almost Burned Out.

## Description
I ran 5 AI agents in parallel — writing, generating images, building videos...
Then I hit a wall. Not because AI failed. Because I was using the wrong cognitive mode.

CHAPTERS
0:00 — Intro
0:28 — The 10x Trap
1:25 — What the Research Says
...

KEY TAKEAWAYS
- AI is the greatest System 1 accelerator ever built
- ...

READ THE FULL ARTICLE
https://aaronguo.com/blog/...

#AIProductivity #ArtificialIntelligence #Burnout ...

## Tags
AI productivity, AI burnout, artificial intelligence, ...
```

## YouTube Thumbnail Generation

Generate 2 thumbnail options using the `baoyu-image-gen` skill. YouTube thumbnails must be eye-catching at small sizes.

### Thumbnail Best Practices
- **Aspect ratio**: 16:9 (1920x1080 or 1280x720)
- **Bold text**: 3-5 words max, enormous and readable at mobile size
- **High contrast**: bright vs dark, split compositions work well
- **Emotional element**: stick figures with clear emotions, dramatic visuals
- **Simple composition**: one clear focal point, not cluttered

### For Aaron's Channel
Generate thumbnails that blend the minimalist illustration style with YouTube-optimized drama:
- Use stick figures consistent with the video's art style
- Bold sans-serif typography for any text overlay
- Split compositions (before/after, good/bad) create tension
- Pastel accents from the art style (#A8D4F0, #F9E79F, #FADBD8) for brand consistency
- Save to `<script-dir>/imgs/thumbnail-1.png` and `thumbnail-2.png`

### Example Prompts
**Option 1 — Split composition:**
```
YouTube thumbnail, split composition. Left: energized stick figure at desk
with glowing AI screens, bold "10x" text. Right: exhausted stick figure,
cracked screens, "BURNOUT" text. Dramatic diagonal split. Clean minimalist
line art, high contrast, bold sans-serif typography.
```

**Option 2 — Dramatic single focus:**
```
YouTube thumbnail, large cracked "10x" text in center with fire behind crack.
Exhausted stick figure below. AI robot icons floating above. White-to-dark
gradient background. Minimalist hand-drawn line art, bold typography.
```

## Narration Rewrite Caching

Conversational narration rewrites are cached in `<script-dir>/.video-gen-cache/` alongside TTS cache:
- Cache key is based on the original (pre-rewrite) narration text hash
- If the original text hasn't changed, the cached rewrite is reused (deterministic output)
- This ensures TTS cache keys remain stable across runs (same rewrite → same hash → TTS cache hit)
- Delete `rewrite-*.txt` files in the cache directory to force re-rewriting

## Cost Estimate Per Video

| Component | Provider | Estimated Cost |
|-----------|----------|---------------|
| Images (10-20) | Google Gemini | ~$0.50-1.00 |
| Thumbnails (2) | Google Gemini | ~$0.10 |
| TTS narration (~8 min) | ElevenLabs | ~$2.40 |
| Narration rewrite | OpenAI GPT-4o-mini | ~$0.10 |
| **Total** | | **~$3-4** |
