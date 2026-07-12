---
name: aaron-video-gen
description: Use when planning, prototyping, generating, or reviewing Aaron's YouTube videos from a blog, video brief, narration, images, or motion scenes. Covers video-native adaptation, director treatments, constrained Remotion storyboards, audio and music, scene templates, visual QA, thumbnails, metadata, and final rendering.
---

# Video Generation

Generate YouTube-ready editorial videos from a video-native script, approved
narration, evidence, motion scenes, music, and reusable Remotion templates.

## Pipeline

1. **Adapt** — create `video-brief.md` and a spoken, video-native `youtube-script.md`.
2. **Direct** — deconstruct references, recommend two or three treatments, then lock the story, media, sound, and fallback decisions in a director plan before implementation.
3. **Storyboard** — assign every semantic beat a visual role, registered scene template, motion recipe, intensity, music cue, and fallback in `video-storyboard.json`.
4. **Audit** — validate the script and storyboard before spending on assets or a full render.
5. **Lock audio** — resolve the approved Aaron voice profile, generate TTS with cross-section context, and pass the listening gate.
6. **Prototype** — render a 60-90 second slice when any scene is new, planned, or experimental.
7. **Build** — combine evidence, static images, structured scenes, captions, music, sound, and branding in Remotion.
8. **Review** — inspect contact sheets, full-motion pacing, layout, audio, and the complete product before publishing.

Read these references when the corresponding stage begins:

- `references/editorial-motion-system.md` for direction, pacing, music, and reference deconstruction;
- `references/aaron-editorial-visual-system.md` for palette roles, grid, canonical layouts, and animation dependencies;
- `references/director-pass.md` before selecting images, generated video, or signature motion;
- `references/scene-catalog.md` before selecting or implementing scene templates;
- `references/video-qa.md` before prototype review or a full render;
- `references/aaron-voice-profile.md` before changing narration voice or settings.

## Recommended Workflow

For Aaron's YouTube channel, the standard command is:

```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts \
  --script <path-to-youtube-script.md> \
  --renderer remotion \
  --voice-profile aaron-pvc-identity-v1 \
  --logo assets/aaron-logo-assets/ag-logo.png \
  --slogan "AI-native builder. Human-first thinker." \
  --website aaronguo.com \
  --cover <path-to-thumbnail.png>
```

Key defaults for Aaron's videos:
- **TTS**: ElevenLabs Professional Voice Clone profile `aaron-pvc-identity-v1`
- **Voice ID**: `R2DWp7zZuWmGxk3r8GIA`, selected through a blind identity-first listening test
- **Delivery**: Multilingual v2, speed 1.0, with the full approved settings stored in `config/voice-profiles.json`
- **Renderer**: Remotion (motion graphics, image switches, word-level captions)
- **Branding**: ag-logo.png + slogan + website in intro and outro
- **Cover**: Thumbnail image with bold title shown at video start (also uploaded as YouTube thumbnail)
- **Transitions**: 1.2s between slides (fade, slide, wipe, flip, etc.)
- **Images**: Static within slides (no Ken Burns), image switches via `[IMAGE:]` markers

### Video Workflow 2.0 Standard

For a serious essay, require:

- `video-brief.md`: viewer promise, story, retention beats, and ending;
- `youtube-script.md`: the locked spoken argument, not a blog read-through;
- `video-treatment.md`: references, selected visual spine, scene mix, motion budget, music strategy, and prototype slice;
- `director-plan.json`: each beat's narrative role, visual mode, entry state, motion, sound, provenance, and fallback;
- `director-memo.md`: the human-readable visual story and explicit exclusions;
- `asset-decision-log.md`: why every source, still, screen capture, or generated clip belongs in the film;
- `video-storyboard.json`: audited scene roles, templates, beats, fallbacks, and timing;
- `audio-generation-manifest.json`: exact voice request and audio QA;
- an approved prototype whenever the storyboard uses a capability not marked `available`;
- `video-qa-report.md`: contact-sheet, motion, audio, and full-watch findings.

Use the files in `templates/` as starting points. Do not render the full video
until the treatment, director plan, and storyboard have been reviewed.

### V5 Delivery Rules

Treat the following as production constraints, not as optional style notes:

- The first meaningful frame must carry the article's visual identity. Prefer
  the approved article cover or a deliberately authored hero; never open a
  serious essay on a taxonomy label or an empty title stage.
- For a `cover-hero`, the article title, subtitle, and Aaron brand lockup must
  all be visible at frame zero. The background may move gently, but the viewer
  must not wait for identity or the central promise to animate in.
- Select a registered layout before writing a scene. Long display titles own
  one full-width reading axis; supporting copy moves below the title rather
  than forcing a two-column wrap.
- Frame chrome and captions are delivery utilities, not decoration. Keep the
  header compact and quiet, and never add a colored rule above captions unless
  it encodes a real state in the story.
- Close a serious essay with the registered `brand-end-card` after the argument
  resolves. Hide chapter chrome and captions there; use Aaron's established
  soft-mark / `AI-NATIVE BUILDER` identity instead of ending on a stale black
  frame. A website is optional, not a required CTA.
- A generated still or clip needs a narrative job, a provenance label, and a
  deterministic fallback. For a long Remotion render, pre-extract a generated
  clip into a bounded image sequence when live video decoding compromises
  repeatability or throughput.
- Audio is a timed contract: retain the voice request, chapter audio, exact
  word timings, and final retime report together. Re-encode chapter joins;
  do not stream-copy MP3 segments with encoder padding into a long-form master.
- A voice-setting experiment remains a candidate until Aaron has heard it in
  a representative opening, middle, and late section. Do not silently replace
  the selected production voice profile.

### Director And Storyboard Gate

Before implementation:

1. Deconstruct one to three strong references. Record what to borrow and what
   to avoid; do not merely request "the same style."
2. Recommend two or three treatments that fit the argument. Explain the scene
   mix, signature opportunity, music approach, and tradeoff of each.
3. Ask Aaron to select or combine a direction unless he has already made that
   decision explicitly.
4. Create `director-plan.json`, `director-memo.md`, and `asset-decision-log.md`.
   Every beat needs a narrative role, a visual mode, a meaningful first frame,
   its first change, sound intent, provenance, and an available fallback.
5. Give each scene one role: `evidence`, `explanation`, or `emphasis`.
6. Select only templates and motion recipes registered in
   `config/scene-registry.json`.
7. Keep one visual spine across typography, grid, color, texture, and image
   treatment while varying scene families.
8. Mark any non-available capability `prototype_required` and provide an
   available fallback.
9. For any rotation, perspective, scale, or translation that changes projected
   bounds, record a transform envelope and protected zones in the storyboard.

Run the planning audit:

```bash
bun ${SKILL_DIR}/scripts/storyboard-audit.ts \
  --storyboard <blog-dir>/video-storyboard.json \
  --output <blog-dir>/video-storyboard-audit.md

bun ${SKILL_DIR}/scripts/director-plan-audit.ts \
  --plan <video-dir>/director-plan.json \
  --output <video-dir>/director-plan-audit.md
```

Before the full render, rerun with `--production`. Production mode must contain
only capabilities marked `available` in the registry.

For a new or changed voice, use the audio-only gate before rendering:

```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts \
  --script <path-to-youtube-script.md> \
  --audio-only \
  --audio-output <path-to-audio.mp3> \
  --transcript-output <path-to-audio-transcript.md> \
  --voice-profile aaron-pvc-identity-v1
```

This still runs the script audit and conversational spoken-language pass, but skips image resolution and video rendering. It preserves the raw audio, writes a normalized review file, creates a 60-second sample, runs technical QA, and records the exact request identity in `audio-generation-manifest.json`.

### Voice Production

Read `references/aaron-voice-profile.md` for the listening gate, clone recording
workflow, blind comparison rules, and promotion process. The current production
winner remains `aaron-pvc-identity-v1`. Use `--voice` only for an explicit
experiment; routine production must resolve the versioned profile.

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
| `--audio-only` | Run audit, spoken rewrite, and TTS; skip image resolution and video rendering | `false` |
| `--audio-output` | Final concatenated audio path for `--audio-only` | `<script-dir>/audio.mp3` |
| `--transcript-output` | Exact post-rewrite transcript sent to TTS | `<script-dir>/audio-transcript.md` |
| `--audio-manifest-output` | Request identity, output paths, hashes, and audio QA | `<script-dir>/audio-generation-manifest.json` |
| `--images-dir` | Directory containing slide images | `<script-dir>/imgs/` |
| `--tts` | TTS provider: `edge-tts`, `openai`, or `elevenlabs` | selected profile (`elevenlabs`) |
| `--voice-profile` | Versioned voice profile from `config/voice-profiles.json` | `aaron-pvc-identity-v1` |
| `--voice` | Explicit TTS voice override for an experiment | selected profile voice ID |
| `--speed` | TTS speech speed (ElevenLabs: 0.7-1.2, OpenAI: 0.25-4.0) | selected profile (`1.0`) |
| `--tts-model` | ElevenLabs model override | selected profile (`eleven_multilingual_v2`) |
| `--tts-output-format` | ElevenLabs MP3 output format | selected profile (`mp3_44100_192`) |
| `--tts-stability` | ElevenLabs stability override (0-1) | selected profile (`0.5`) |
| `--tts-similarity` | ElevenLabs similarity override (0-1) | selected profile (`0.75`) |
| `--tts-style` | ElevenLabs style override (0-1) | selected profile (`0.5`) |
| `--tts-speaker-boost`, `--no-tts-speaker-boost` | Override speaker boost | selected profile (`true`) |
| `--tts-seed` | Optional unsigned 32-bit seed for repeatable evaluation | none in production |
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
| `--audit-only` | Write `youtube-script-audit.md` and exit before image resolution, TTS, or rendering | `false` |
| `--skip-script-audit` | Explicitly bypass the scriptwriting audit gate | `false` |
| `--audit-output` | Custom path for the audit markdown report | `<script-dir>/youtube-script-audit.md` |
| `--dry-run` | Print the command without executing | `false` |

## Script Format

`youtube-script.md` remains the narration contract. It does not carry the full
directorial plan; `video-storyboard.json` does. Read
`references/legacy-script-format.md` for the parser shape, hook, image markers,
the current ACTOR marker, asset matching, and cache behavior.

## Video Features

### Branding (Hook + Intro + Outro)
When `--logo`, `--slogan`, or `--website` are provided:
- **Cover Card** (optional, `--cover`): Full-bleed thumbnail/cover image with title baked in (~2.5s). Replaces the black screen opening.
- **Content Hook** (optional): Attention-grabbing teaser with narration over cover image, plays before branding
- **Intro**: Logo + slogan + website fade in. When a cover is present, the intro is shortened to 2s (no title, since the cover already shows it). Without cover: 3.5s with animated title.
- **Outro**: Fade to black, logo + slogan + website appear (4s)

### Stable Phrase Captions
With ElevenLabs TTS, word-level timestamps drive precise subtitle timing, but
the visual treatment should stay stable:
- Phrase-level subtitle overlay at the bottom of the screen
- White text only; no karaoke-style current-word highlight
- No per-word dimming/brightening, opacity pulsing, scale animation, or blur
- Captions grouped into short readable phrases so the text changes calmly

### Scene Transitions
The legacy slideshow composition cycles through generic transitions. Treat this
as a compatibility fallback, not the Video 2.0 target. A directed storyboard
should select transitions by continuity: preserve an object, camera direction,
spatial axis, color field, or musical phrase across the cut.

Do not crossfade two full typography-heavy or diagram-heavy layouts. Use a clean
cut, a mask or wipe, or clear the outgoing stage before the next layout enters.
Only crossfade when the outgoing information has already become visually
subordinate. Verify the encoded frame immediately before and after every chapter
boundary; source stills alone are not sufficient.

### Background Music Auto-Ducking
When `--music` is provided, the current renderer supports one music track and automatically:
- Ducks down during narration
- Rises during transitions between slides
- Fades in at the start and out at the end

Choose `none`, `bookended`, `chaptered`, or `continuous` in
`video-treatment.md`. `bookended` is the default experiment for serious essays.
If the treatment needs multiple cues or precise stings, prototype and mix them
explicitly rather than pretending the single-track option implements the score.

### TTS Caching
TTS audio is cached in `<script-dir>/.video-gen-cache/`. On subsequent runs:
- If narration, neighboring context, provider, profile, voice ID, model, output format, all voice settings, speed, and seed match, the cached audio is reused automatically
- If the narration changed (e.g., after editing the script), only the changed slides regenerate TTS
- If a neighboring section changes, continuity context invalidates that section's cache as well
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
voice_profile: aaron-pvc-identity-v1
resolution: 1920x1080
transition_duration: 1.2
music_volume: 0.1
padding: 1
fps: 24
renderer: remotion
conversational: true
---
```

Do not duplicate the production voice ID or settings in `EXTEND.md`. Keep those in `config/voice-profiles.json`; use preference fields only for deliberate local overrides.

## Examples

Generate video with full branding (recommended):
```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts \
  --script src/content/blogs/2026-02-22/youtube-script.md \
  --renderer remotion \
  --voice-profile aaron-pvc-identity-v1 \
  --logo assets/aaron-logo-assets/ag-logo.png \
  --slogan "AI-native builder. Human-first thinker." \
  --website aaronguo.com
```

Generate with free TTS (no API key needed):
```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts \
  --script src/content/blogs/2026-02-22/youtube-script.md
```

Generate with OpenAI TTS:
```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts \
  --script src/content/blogs/2026-02-22/youtube-script.md \
  --tts openai --voice nova \
  --renderer remotion
```

## Blog-to-Video Workflow

When generating a video from a blog post, follow these stages in order. The
workflow is hybrid: some beats should remain photographic or illustrative,
some need structured layouts, and a small number may earn bespoke motion.

### Step 0: Load video language and brief

Read these before judging or rendering:

- `src/content/strategy/youtube-video-language.md`;
- `references/editorial-motion-system.md`;
- `references/aaron-editorial-visual-system.md`;
- `references/director-pass.md`;
- `references/scene-catalog.md`;
- `config/scene-registry.json`.

Expect `video-brief.md`, `video-treatment.md`, `video-storyboard.json`,
`director-plan.json`, `director-memo.md`, `asset-decision-log.md`, and
`youtube-script.md` beside one another. If the brief or script is missing, run a
`blog-write` video adaptation pass. If treatment or storyboard is missing, stop
before visual production and create them from the templates in this skill.

`video-brief.md` must define these exact `##` headings so the audit parser can read it:
- target audience and what they already believe;
- desired emotion;
- core promise;
- title/thumbnail expectation;
- 5-10 high-shock facts;
- hook type, with target/transformation/stakes;
- story structure;
- retention beat map every 20-35 seconds;
- audit status: story flow, comprehension, speed-to-value;
- cold open, what the video adds beyond the article, banned phrases, and ending.

Required heading names:
- `## Target Audience`
- `## Desired Emotion`
- `## Core Promise`
- `## Title/Thumbnail Expectation`
- `## High-Shock Facts`
- `## Hook Type`
- `## Story Structure`
- `## Retention Beat Map`
- `## What The Video Adds`
- `## Banned Phrases`
- `## Ending`
- `## Audit Status`

Before TTS, run the script audit. Before visual production, run the storyboard
audit in planning mode. Rendering without either gate should be reported to
Aaron.

Before editing Remotion renderer code, read
`src/content/strategy/remotion-video-engineering.md`. After renderer changes,
run `cd tiles/aaron-video-gen/remotion && npm run validate`.

### Step 1: Write or review youtube-script.md

Convert the blog post into a narration script. For each major section:
- Create a `## [SLIDE: Title — image.png]` header with a **meaningful title** (not "Illustration 01")
- Write conversational narration text (the pipeline's LLM rewrite will polish it further)
- Add `[IMAGE:]` markers only where the storyboard calls for `image-sequence`

Add a `## [HOOK]` section at the top — 2-4 sentences that tease the video's core insight.

The script must adapt the article into a video-native story. Do not simply map each article heading to one slide and paraphrase the paragraphs. The default story shape is:

```text
cold open -> promise -> context -> model -> proof -> objection -> payoff
```

The first 30 seconds must deliver on the title/thumbnail promise. Start with story, contradiction, or a concrete result; do not start with "in today's video", "let's dive in", or a generic topic summary.

### Step 1b: Video adaptation quality gate

Generate or refresh the audit before rendering:

```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts \
  --script <blog-dir>/youtube-script.md \
  --audit-only
```

Before rendering, reject or revise `youtube-script.md` if:
- it can be pasted back into the blog as normal prose;
- slide titles mirror the article headings one-for-one;
- it has no specific video promise;
- the hook is generic or meta;
- it lacks retention beats every 20-35 seconds;
- it has fewer than 3 moments that add something beyond the blog;
- it ends by summarizing instead of landing a payoff.

Also scan for repeated filler. Remove or rewrite:
- "right";
- "you know";
- "basically";
- "let's dive in";
- "in today's video";
- repeated "what's interesting is";
- repeated "the real shift is".

The LLM conversational rewrite is a polish step, not a substitute for this gate. If the original script is a blog read-through, fix the script first.

The rewrite must be a light edit, not a new performance. It should keep the source close when the source already works, and it must avoid:
- generic YouTube hype such as "crazy, right", "game changer", "here's the kicker", "picture this";
- fake casualness and repeated rhetorical questions;
- formalized transcript language such as "consequently", "moreover", "conversely", "when it comes to", "robust", "enhance";
- replacing plain words with formal synonyms, especially `QA`, `UAT`, `like`, `important`, and concrete engineering terms;
- expanding narration beyond the source unless meaning would be lost.

The script-level rewrite scanner lives in `scripts/spoken-transcript-quality.ts`. If it flags output, `rewrite-narration.ts` repairs the segment before TTS.

### Step 2: Direct the treatment

Create `video-treatment.md` from the template. Deconstruct one to three
references and recommend two or three visual directions based on the argument.
Each recommendation must state:

- the visual spine that will keep the film coherent;
- the mix of evidence, explanation, and emphasis scenes;
- the calm, structured, and signature intensity balance;
- the one signature opportunity, if the story earns one;
- the music strategy and likely cue points;
- the implementation tradeoff.

Ask Aaron to select or combine a direction before generating new visual assets.
Do not make a silent style decision unless he already specified it.

### Step 3: Build and audit the storyboard

Create `video-storyboard.json` from the selected treatment and locked narration.
For every scene, record:

- start and end time;
- one primary role: `evidence`, `explanation`, or `emphasis`;
- a template and intensity from `config/scene-registry.json`;
- the meaningful entry visual and first change time;
- semantic visual beats and motion recipes;
- content items, assets, music cue, and purpose;
- `prototype_required` and an available fallback for any non-available capability.

Run:

```bash
bun ${SKILL_DIR}/scripts/storyboard-audit.ts \
  --storyboard <blog-dir>/video-storyboard.json \
  --output <blog-dir>/video-storyboard-audit.md
```

Revise until planning mode passes. A warning about a prototype is expected only
when the scene is deliberately part of the prototype slice.

### Step 4: Lock narration audio

Generate the audio-only build using the production voice profile. Review the
exact post-rewrite transcript and the 60-second sample before designing precise
motion. Word timings become the master timing source for visual beats.

Do not regenerate approved narration merely to accommodate a visual idea. Move
or redesign the visual unless the spoken argument itself is wrong.

When Aaron approves the voice identity and performance but asks for only a
slightly tighter pace, test a transparent `1.03-1.05x` retime before paying for
a new stochastic TTS take. Preserve the original audio, retime word-level
captions from the same ratio, and retime the score separately to the exact new
master duration. For future recordings, prefer the TTS `speed` parameter only
after a short listening test confirms that identity and phrasing remain intact.

### Step 5: Prototype and prepare assets

When the storyboard uses a `prototype` or `experimental` capability, render a
60-90 second slice before building the full film. Include:

- one calm evidence scene;
- one structured explanation scene;
- the signature or newest scene;
- narration, intended music treatment, captions, and the real transitions
  surrounding those scenes.

Review pacing, layout, musical energy, comprehensibility, and fatigue. Promote a
template to `available` only after it passes the prototype contract in
`references/scene-catalog.md`.

For information-bearing 3D motion, render 0/25/50/75/100% progress states and
every frame range where a label, caption, or result band enters. Static entry,
peak, and exit stills alone do not prove that the intervening layout is safe.

Prepare only assets demanded by the storyboard. Possible assets include source
screenshots, photographs, generated illustrations, logos, diagrams, textures,
music, sound effects, and 3D models. There is no image quota. Inspect every
generated or captured asset in its final crop.

Once the visual spine is stable, generate or select two thumbnail candidates and
review them at mobile size. The strongest candidate may also serve as the cover
frame, but the video cold open does not have to remain on it.

### Step 6: Run the pipeline

Run the production storyboard audit first. It must pass without planned or
experimental capabilities. If renderer code changed, run the Remotion validator
before rendering.

```bash
bun ${SKILL_DIR}/scripts/storyboard-audit.ts \
  --storyboard <blog-dir>/video-storyboard.json \
  --production \
  --output <blog-dir>/video-storyboard-audit.md

cd ${SKILL_DIR}/remotion && npm run validate
```

Then render:

```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts \
  --script <blog-dir>/youtube-script.md \
  --renderer remotion \
  --voice-profile aaron-pvc-identity-v1 \
  --logo assets/aaron-logo-assets/ag-logo.png \
  --slogan "AI-native builder. Human-first thinker." \
  --website aaronguo.com \
  --cover <blog-dir>/imgs/thumbnail.png
```

### Step 7: Verify

Use `references/video-qa.md` and create `video-qa-report.md`.

- Review entry, peak, and exit stills for every structured or signature scene.
- Confirm no scene begins mostly blank or waits on narration before showing useful content.
- Check text fit, captions, safe areas, 3D/canvas pixels, and final crops.
- Check dynamic projected bounds against declared transform envelopes and
  protected zones throughout the animation, not only at the resting frame.
- Check dependency thresholds: connectors before endpoints, evidence before
  conclusions, and dense layouts before statements.
- Watch the prototype and full render without stopping to judge pacing and fatigue.
- Confirm meaningful visual beats follow the storyboard rather than an image quota.
- Verify music rights, cue timing, narration clarity, ducking, and ending resolution.
- Confirm the first 20 seconds deliver the title and thumbnail promise.
- Record reusable failures as registry, template, audit, or engineering changes.

### Step 8: Generate YouTube metadata

Create `<blog-dir>/youtube-metadata.md` with title, description, chapters, and
tags. Derive chapter timestamps from the final storyboard and rendered master,
not estimated slide duration. Use the legacy duration formula only when the
video remains an unmodified slideshow composition.

## Image Generation Workflow

Generate images only for storyboard beats that need evidence, illustration, or a
static fallback. Reuse approved blog images when they fit the selected treatment;
generate new images when the video requires a new composition or crop.

Rules:

- Match the treatment's visual spine across all generated assets.
- Generate to the final scene container ratio and safe area.
- Prefer real evidence when the viewer needs to inspect a product, source, or
  place.
- Avoid generic atmosphere, repeated metaphors, fake UI text, and image walls.
- Inspect every asset before rendering.
- A visual beat may be created through layout or motion; it does not require a
  new bitmap.

## YouTube Metadata Generation

Read `references/youtube-packaging.md` after the final render for title,
thumbnail, description, chapter, tag, and output rules.

## Narration Rewrite Caching

Conversational narration rewrites are cached in `<script-dir>/.video-gen-cache/` alongside TTS cache:
- Cache key is based on the original (pre-rewrite) narration text hash
- If the original text hasn't changed, the cached rewrite is reused (deterministic output)
- This ensures TTS cache keys remain stable across runs (same rewrite → same hash → TTS cache hit)
- Delete `rewrite-*.txt` files in the cache directory to force re-rewriting

## Cost Estimate Per Video

Estimate cost from the approved storyboard: narration length, generated image
count, music licensing, external footage, and rendering complexity now vary by
treatment. Do not optimize the treatment around an obsolete fixed image quota.
