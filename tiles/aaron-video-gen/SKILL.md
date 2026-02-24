---
name: aaron-video-gen
description: Generate YouTube videos from a script markdown file and slide images. Parses youtube-script.md format, generates TTS narration, applies fade transitions between slides, and outputs MP4. Also generates YouTube metadata (title, description, chapters, tags) and thumbnails. Use when user asks to "generate video", "create YouTube video", "make video from images", "make slideshow video", or "generate YouTube metadata".
---

# Video Generation

Generate YouTube-ready MP4 videos from a script markdown file and slide images.

## Pipeline

1. **Parse** the youtube-script.md — extract slide sections, detect `[IMAGE:]` markers for image switches
2. **Rewrite narration** (optional) — LLM rewrites narration conversationally (pauses, humor, natural rhythm). Tracks used openings and transition phrases across slides to avoid repetition (e.g., "You know what's interesting" won't appear multiple times)
3. **Generate narration** — TTS audio for each slide section (edge-tts, OpenAI, or ElevenLabs)
4. **Compute image switch timings** — sync image changes to word-level timestamps from ElevenLabs
5. **Build video** — Remotion renders slides with image switches, captions, transitions, and branding
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
  --website aaronguo.com \
  --cover <path-to-thumbnail.png>
```

Key defaults for Aaron's videos:
- **TTS**: ElevenLabs, Henry voice (991lF4hc0xxfec4Y6B0i), speed 1.1x
- **Renderer**: Remotion (motion graphics, image switches, word-level captions)
- **Branding**: ag-logo.png + slogan + website in intro and outro
- **Cover**: Thumbnail image with bold title shown at video start (also uploaded as YouTube thumbnail)
- **Transitions**: 1.2s between slides (fade, slide, wipe, flip, etc.)
- **Images**: Static within slides (no Ken Burns), image switches via `[IMAGE:]` markers

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
| `--cover` | Path to cover/thumbnail image (shown at video start, also usable as YouTube thumbnail) | none |
| `--dry-run` | Print the command without executing | `false` |

## Script Format

The skill parses markdown files with this structure:

```markdown
# Video Title

## [HOOK]

A short, attention-grabbing teaser that plays before the branding intro.
Keeps viewers from scrolling past. 2-4 sentences max.

---

## [SLIDE: The Promise vs Reality — cover.png]

Narration text for this slide.

---

## [SLIDE: The Pattern — 01a-pattern-history.png]

First part of narration...

[IMAGE: 01-full.png]

Second part of narration after image change...

---
```

### Slide Titles — Chapter Indicators

**IMPORTANT**: The title in `## [SLIDE: Title — image.png]` becomes the chapter indicator shown in the video's progress bar. Titles MUST be meaningful and descriptive — they are visible to viewers throughout each section.

**Good titles**: "The Pattern", "The Effort Shift", "The Amplifier", "The Real Data"
**Bad titles**: "Cover Image", "Illustration 01", "Section 3", "My Experience"

When writing a youtube-script.md from a blog post, derive titles from the blog's section headings or core concept of each slide.

### Content Hook with `[HOOK]`

Add an optional `## [HOOK]` section before the first slide to create an attention-grabbing teaser at the start of the video. The hook plays before the branding intro (logo + slogan + title).

- **Placement**: Must appear before the first `## [SLIDE:]` section
- **Narration**: Gets its own TTS audio (same voice/provider as slides)
- **Image**: Displays over the cover image (first slide's image) by default
- **Custom image**: Use `## [HOOK: specific-image.png]` to specify a different image
- **Duration**: Driven by TTS audio length + 1s padding
- **Captions**: Word-level captions appear during the hook (with ElevenLabs)
- **Optional**: If no `[HOOK]` section is present, the video starts with the branding intro as before

**Example:**
```markdown
## [HOOK]

Every few decades, a new technology promises to make everyone a creator.
The camera. Auto-Tune. Now AI. And every single time, the same result.

---
```

### Image Switches with `[IMAGE:]` Markers

To keep viewers engaged, add `[IMAGE:]` markers inline in the narration. The system crossfades to a different illustration synced to the narration — each image depicts a distinct concept or sub-topic:

- The initial image comes from the `[SLIDE:]` header
- `[IMAGE: filename.png]` triggers a crossfade to a new illustration at that narration point
- Multiple markers per slide are supported (3-5 images per slide is typical, ~1 switch every 15-20s of narration)
- ElevenLabs word-level timings enable precise sync; other TTS providers use proportional estimation
- Each image is a **standalone illustration** — no visual consistency between images is required

**Example — 4 images per slide:**
```markdown
## [SLIDE: The 6 Rules — s02-01-six-nodes-overview.png]

Most summaries list 6 independent tips. They miss the point — these rules protect the same thing.

[IMAGE: s02-02-rule1-never-stop.png]

Rule 1: Never Stop. Commit to continuous learning, not "work 80 hours."

[IMAGE: s02-03-rule2-no-debt.png]

Rule 2: No Debt. Debt forces short-term optimization over long-term learning.

[IMAGE: 02-six-rules-system.png]

Together, they form an operating system for sustained excellence.

---
```

**Image naming convention:**
- `NN-name.png` — blog illustration (reused in video as anchor image per section)
- `sNN-MM-name.png` — video-only illustration (slide NN, image MM within that slide)

### Slide Matching Rules

The text after `—` (em dash) in the slide header is used to find the image:
1. If it's a full filename (e.g., `cover.png`), use that file directly
2. If it's a number prefix (e.g., `01`), find the first image starting with that prefix
3. If it's a description, images are matched in order of appearance

## Video Features

### Branding (Hook + Intro + Outro)
When `--logo`, `--slogan`, or `--website` are provided:
- **Cover Card** (optional, `--cover`): Full-bleed thumbnail/cover image with title baked in (~2.5s). Replaces the black screen opening.
- **Content Hook** (optional): Attention-grabbing teaser with narration over cover image, plays before branding
- **Intro**: Logo + slogan + website fade in. When a cover is present, the intro is shortened to 2s (no title, since the cover already shows it). Without cover: 3.5s with animated title.
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

**Important**: Changing `[IMAGE:]` markers (adding, removing, or moving them) changes the segment structure of slides, which invalidates the rewrite cache. When loading a cached rewrite with a mismatched segment count, the rebuilt narration text differs, breaking TTS cache lookups. If you modify `[IMAGE:]` markers after a video has been generated, **delete `rewrite-*.txt` from `.video-gen-cache/`** and re-run without `--skip-tts` to regenerate rewrites and TTS.

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

## Blog-to-Video Workflow

When generating a video from a blog post, follow these steps in order. Every step is required — skipping video illustrations or using generic titles will produce a low-quality video.

### Step 1: Write youtube-script.md

Convert the blog post into a narration script. For each major section:
- Create a `## [SLIDE: Title — image.png]` header with a **meaningful title** (not "Illustration 01")
- Write conversational narration text (the pipeline's LLM rewrite will polish it further)
- Add `[IMAGE:]` markers at natural concept boundaries (~1 every 15-20s of narration)

Add a `## [HOOK]` section at the top — 2-4 sentences that tease the video's core insight.

### Step 2: Generate additional video illustrations

Blog posts typically have 5-6 illustrations. Videos need 20-30 unique images to maintain visual engagement. Generate 15-20 additional standalone illustrations depicting specific concepts from the narration.

Each illustration is independent — no need for visual consistency between images. Use `baoyu-image-gen` to generate standalone concept images:

```bash
npx -y bun ${BAOYU_IMAGE_GEN_DIR}/scripts/main.ts \
  --prompt "[Concept description]. [Visual metaphor]. [Style notes]." \
  --image <blog-dir>/imgs/sNN-MM-name.png \
  --ar 16:9 --quality 2k
```

**Naming convention:**
- `NN-name.png` — blog illustration (reused from article, one per section)
- `sNN-MM-name.png` — video-only illustration (slide NN, image MM)
- `cover.png` / `thumbnail.png` — cover and thumbnail

**Planning:** Before generating, list all images needed per slide based on narration segments. Target ~1 image per 15-20 seconds of narration. Blog images serve as "anchor" images within their respective slides.

### Step 3: Place `[IMAGE:]` markers in the script

Insert `[IMAGE:]` markers at concept boundaries where the narration shifts to a new sub-topic:

```markdown
## [SLIDE: The 6 Rules — s02-01-six-nodes-overview.png]

Overview narration (viewer sees overview image)...

[IMAGE: s02-02-rule1-never-stop.png]

Rule 1 narration (viewer sees Rule 1 image)...

[IMAGE: s02-03-rule2-no-debt.png]

Rule 2 narration (viewer sees Rule 2 image)...

[IMAGE: 02-six-rules-system.png]

Synthesis narration (viewer sees blog's anchor illustration)...
```

### Step 4: Generate thumbnail/cover image

Generate a YouTube thumbnail with the video title in bold text. This same image is used as:
- The video's opening frame (via `--cover`)
- The YouTube thumbnail (uploaded separately)

```bash
npx -y bun ${BAOYU_IMAGE_GEN_DIR}/scripts/main.ts \
  --prompt "YouTube thumbnail, [description with bold title text]. Minimalist line art, high contrast, bold sans-serif typography." \
  --image <blog-dir>/imgs/thumbnail.png \
  --ar 16:9 --quality 2k
```

### Step 5: Run the pipeline

```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts \
  --script <blog-dir>/youtube-script.md \
  --renderer remotion --tts elevenlabs \
  --voice 991lF4hc0xxfec4Y6B0i --speed 1.1 \
  --logo assets/aaron-logo-assets/ag-logo.png \
  --slogan "AI-native builder. Human-first thinker." \
  --website aaronguo.com \
  --cover <blog-dir>/imgs/thumbnail.png
```

### Step 6: Verify

- Video opens with thumbnail/cover image (not black screen)
- Chapter indicators show meaningful titles (not generic labels)
- Image switches crossfade at the right narration points (~every 15-20s)
- Hook plays before branding intro
- Word captions are in sync

### Step 7: Generate YouTube metadata

Create `<blog-dir>/youtube-metadata.md` with title, description (with chapters), tags. See the "YouTube Metadata Generation" section below for the full format. Compute chapter timestamps from the pipeline's TTS audio durations + cover card (2.5s) + hook duration + intro (2s with cover, 3.5s without) + transition overlaps (1.2s).

## Image Generation Workflow

For each blog post video, generate 20-30 images total:
1. **Blog illustrations** (5-7): Reused from the article as "anchor" images within each slide section
2. **Video-only illustrations** (15-20): Standalone concept images, each depicting a specific sub-topic from the narration. Named with `sNN-MM-` prefix.

Use the `baoyu-image-gen` skill to generate images. Match the art style used in the blog's illustrations (style varies per article). Each image is independent — no visual consistency between images is required. Target ~1 image per 15-20 seconds of narration for good visual pacing.

Common settings:
- 16:9 aspect ratio, 2K quality
- Generate in parallel batches of 4-5 for efficiency

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
Calculate from slide audio durations + content hook duration + intro hook (3.5s) + transitions (1.2s overlap):
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

Generate 2 thumbnail options using the `baoyu-image-gen` skill. YouTube thumbnails must be eye-catching at small sizes. The best thumbnail also serves as the video's opening frame via `--cover` (see Blog-to-Video Workflow Step 4).

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
| Images (20-30) | Google Gemini | ~$1.00-1.50 |
| Thumbnails (2) | Google Gemini | ~$0.10 |
| TTS narration (~8 min) | ElevenLabs | ~$2.40 |
| Narration rewrite | OpenAI GPT-4o-mini | ~$0.10 |
| **Total** | | **~$3-4** |
