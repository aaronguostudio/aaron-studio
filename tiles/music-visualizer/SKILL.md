---
name: music-visualizer
description: Create original music-led YouTube videos with Eleven Music or Google Lyria, curated licensed photo essays, deterministic Remotion motion graphics, or Seedance cinematic loops. Use when Aaron wants study/work background music, piano, ambient, lo-fi wave, coffee music, slow landscape photography videos, the named Visual And Sound Photo Essay 10-minute 4K format, minimalist or 2.5D/3D React visualizers, high-resolution exports, repeatable production, or channel-specific YouTube packaging.
---

# Music Visualizer

Create an original soundtrack, choose a visual language that follows its mood,
render a curated photo essay, a calm deterministic Remotion visualizer, or a
Seedance cinematic loop, and preserve the music, prompt, visual config, render,
source provenance, and QA evidence together.

This skill supports divergent directions, not one fixed look. Read
[music-directions.md](references/music-directions.md) when choosing a new music
or visual family, and read [motion-quality.md](references/motion-quality.md)
before changing motion behavior.

## Named production profile: Visual And Sound Photo Essay

When Aaron says `Visual And Sound Photo Essay`, `照片散文版`, or asks for a new
10-minute video in the established photo-and-music style, read
[visual-and-sound-photo-essay.md](references/visual-and-sound-photo-essay.md).
Treat it as the default production contract for that named format. It fixes the
calm motion, 4K source, music continuity, provenance, QA, and packaging bar
while leaving the listening job, subject, palette, and instrumentation free to
change. Do not apply this profile to a different visual format merely because it
also uses music.

This is a separate long-form music-video workflow. Do not route it through the
Kling-based music Shorts pipeline unless the user explicitly asks for a
generated cinematic clip.

## Non-negotiable visual selection gate

Do not force a bespoke cinematic world out of HTML, SVG, shader, or a generic
React component. Reject a code-authored direction when the brief depends on a
believable environment, a person or creature, natural weather, foliage, cloud,
light, atmospheric depth, or organic micro-action. A handful of drifting
geometry, glowing lines, a single orb, or a weak material study is not an
acceptable substitute for that visual job.

Treat line fields, orbs, and WebGL/React Bits-like effects as explicit opt-in
styles only. Never choose them as the default follow-on to a visual reference,
and never present several cosmetic variants of the same component as distinct
creative directions.

Use the Seedance cinematic-loop path for those briefs. Read
[seedance-cinematic-loops.md](references/seedance-cinematic-loops.md) before
writing a prompt or spending on a generation. It owns the first/last-frame
loop contract, visual QA, and original-world constraints.

Use the photo-essay path when carefully selected, licensed still photography is
the visual medium. Read [photo-essays.md](references/photo-essays.md) before
downloading sources or rendering; it owns provenance, sequencing, motion limits,
and photo-specific QA.

For a Seedance anchor containing a person, reject cropped or incomplete bodies,
wrong desk/device orientation, close foreground framing, and any composition
where the subject no longer belongs clearly inside the intended environment.

## Workflow

### 0. Choose the listening job and direction

Lock the use case before generating anything: deep work, reading, coffee room,
evening reflection, or sleep preparation. Then choose a direction such as
`paper-moon`, `midnight-lofi-wave`, `coffee-room`, `folded-light`, `glass-tide`,
`cinematic-cloud-desk`, `landscape-photo-essay`, `visual-and-sound-photo-essay`,
`neon-strands`, `neon-orb`, or `neon-afterhours`. Preserve one visual spine while allowing the scene family,
palette, depth treatment, and instrumentation to diverge.

### 1. Direct the music before designing motion

Decide the listening use case first: deep work, reading, evening reflection,
sleep, or general ambience. Then lock:

- instrumental/vocal choice;
- piano, synth, field texture, or other instrumentation;
- tempo and energy range;
- section shape and duration;
- negative constraints such as no vocals, no drums, no abrupt climax;
- a visual theme and deterministic seed.

Read [style-and-music.md](references/style-and-music.md) when selecting a
palette or writing an Eleven Music prompt. Read [music-directions.md](references/music-directions.md)
for lo-fi wave, coffee, and 2.5D/3D variants.

Never request an imitation by naming a living artist, song, or copyrighted
lyrics. Describe musical properties instead. Preserve the original source
track only as a reference; do not copy its melody, audio, or visual assets.

### 2. Generate or accept audio

Use `scripts/music-visualizer.mjs` as the Eleven Music entry point. It can:

- generate instrumental audio with the Eleven Music API;
- accept a local audio file for testing;
- create an output folder and generation manifest;
- render the silent `MusicVisualizer` composition and mux the source audio
  into the final MP4 with ffmpeg;
- clean temporary Remotion props after rendering.

Load `ELEVENLABS_API_KEY` from the shell or the repo `.env`. Use a paid plan
for commercial publishing and retain the manifest with the source artifact.

Use `scripts/generate-lyria.mjs` to test Google Lyria with `GOOGLE_API_KEY` or
`GEMINI_API_KEY`. Use the 30-second Clip model for prompt auditions and the
Pro model for multi-minute sections. Lyria does not provide native continuation:
lock key, BPM, palette, and energy ceiling across independently generated
sections; prove a three-section continuity test first; then use
`scripts/stitch-lyria.mjs` with six-second `qsin` crossfades and an explicit
final fade. Inspect actual returned durations before setting the final timeline.
Keep the stitch manifest beside the master. Do not publish a Lyria-derived work
until the current provider terms permit the intended commercial use.

### 3. Bind sound to the right visual medium

Use the `MusicVisualizer` composition in
`tiles/aaron-video-gen/remotion/src/MusicVisualizer.tsx`. It intentionally uses
frame-driven values only:

- slow frame-driven motion and one clear visual relationship;
- circles attached to a path, breathing bars on a baseline, or one layered
  sculptural form;
- subtle depth ordering for a 2.5D feeling;
- one of the registered visual systems: `ink-current`, `paper-resonance`,
`soft-relic`, `lofi-wave`, `coffee-room`, `folded-light`, `neon-strands`, `neon-orb`; or the `audio-mix`
  composition that blends the
  paper-moon systems from the track's precomputed analysis;
- paper grain, restrained typography, and large negative space;
- music muxed into the rendered MP4 after the visual render, keeping the audio
  source and final video duration aligned.

Choose the visual direction from the music. Felt piano and quiet ambient
tracks default to `paper-moon`; nocturnal or spacious tracks can use
`deep-ink`; cool reflective tracks can use `soft-slate`.

For a generated cinematic world, use Seedance instead of trying to recreate the
scene in code. Generate without provider audio, then marry the approved visual
loop to original Eleven Music. Prefer one stable wide frame, one small human
gesture, and two or three environmental motions such as cloud drift, foliage,
curtain, water, or travelling light. Use strict first-and-last-frame image to
video with the same original anchor frame when the goal is a seamless loop.

For a still-photography essay, use four to eight high-resolution images for a
45–90 second sample, or roughly 12–18 photographs for a ten-minute piece;
keep them within one light-and-color journey. Before selecting sources, read
`src/content/music-visualizer/photo-source-registry.json` and avoid its source
pages unless a deliberate callback is more valuable than novelty. Render with
`scripts/render-photo-essay.mjs`; use 10–20 second shots, 1.5–3 second fade
transitions, and static frames by default. Use only an occasional centered
2–5% zoom; never pan a photo unless the composition has been explicitly
approved. Add a small, temporary photographic credit only when its provenance
is complete, then generate the matching YouTube description from the same
source data. Keep a source manifest containing the photo page, photographer,
location/camera when known, license, and local file name. Before the render,
run `scripts/photo-source-registry.mjs --check`; after an approved render, run
it again with `--record` to preserve reuse history.

When the named `Visual And Sound Photo Essay` profile applies, its exact
timeline, image count, music-master, and QA rules override these generic
photo-essay defaults. Read its reference before selecting a source or writing a
prompt.

Do not add CSS transitions, CSS keyframes, wall-clock animation, random values
without a seed, or an always-on attention-grabbing equalizer.

### 4. Prototype before scaling

Start with a 30–60 second test. Review:

- frame 0, the first meaningful change, midpoint, and final fade;
- title and metadata fit at 16:9 and mobile-like review sizes;
- audio starts at frame 0, has no clipping, and ends with the visual;
- the 3D treatment stays subtle rather than looking like a game HUD;
- motion fatigue over a full minute.
- for a Seedance loop, the final 1.5 seconds followed by the first 1.5 seconds
  reads as one continuous moment at normal speed and at 0.5x.

Only after the prototype works should you generate a 10-minute version or
15–120 minute compilation. A 10-minute piece should have broad chapters and
low-frequency internal variation, not dozens of hard scene changes.

### 5. Package and publish deliberately

Create a thumbnail from the selected visual family, metadata YAML, and a local
upload record. For the `Visual And Sound` channel, read
[publishing-profile.md](references/publishing-profile.md). Verify the runtime
OAuth channel before every upload because Aaron maintains multiple YouTube
accounts. Present an upload preview and default to `unlisted`; do not publish
or schedule automatically.

### 6. Verify and package

Run the Remotion validator after composition changes:

```bash
cd tiles/aaron-video-gen/remotion
npm run validate
```

Run the pipeline from the repository root:

```bash
node tiles/music-visualizer/scripts/music-visualizer.mjs \
  --config tiles/music-visualizer/references/example-config.json \
  --duration 45 \
  --output src/content/music-visualizer/paper-moon-pilot/paper-moon-pilot.mp4
```

To use an existing local audio file:

```bash
node tiles/music-visualizer/scripts/music-visualizer.mjs \
  --config <config.json> \
  --audio <audio.mp3> \
  --output <video.mp4>
```

To audition or build a Lyria master:

```bash
node tiles/music-visualizer/scripts/generate-lyria.mjs \
  --model lyria-3-pro-preview \
  --prompt-file <section.prompt.txt> \
  --output <section.mp3>

node tiles/music-visualizer/scripts/stitch-lyria.mjs \
  --inputs <section-01.mp3>,<section-02.mp3>,<section-03.mp3> \
  --duration 600 --crossfade 6 --fade-out 8 \
  --output <master.m4a>
```

For a landscape photo essay, create a JSON config with `slides`, `durationSec`,
`motion`, `transitionSec`, `width`, `height`, and `fps`. Add a per-slide
`credit` object for on-screen attribution and automatic description generation,
then run:

```bash
node tiles/music-visualizer/scripts/render-photo-essay.mjs \
  --config <photo-essay.json> \
  --audio <music.mp3> \
  --output <video.mp4>
```

For a high-resolution delivery master, choose the output preset explicitly:

```bash
node tiles/music-visualizer/scripts/music-visualizer.mjs \
  --config <config.json> \
  --audio <audio.mp3> \
  --resolution 4k \
  --output <video-4k.mp4>
```

Supported presets are `1080p`, `2k`, and `4k`; custom `WIDTHxHEIGHT` output is
also accepted.

The 4K preset performs a native 2× Remotion render of the authored SVG scene,
then muxes the original audio into a 3840×2160 MP4. Use 4K for a YouTube master
when the source art benefits from clean lines and large negative space.

`neon-strands` and `neon-orb` use deterministic WebGL light-fields and default
to Remotion's `angle` renderer rather than `swiftshader`. They render
more slowly, so prove the 45–90 second sample before committing to a 10-minute
or 4K master.

Keep these artifacts together:

- `config.json`;
- `music.mp3` or the source audio;
- `audio-analysis.json` for an audio-reactive render;
- `generation-manifest.json`;
- `photo-sources.json` and `photo-essay-render.json` for a photography essay;
- generated `youtube-description.md` when credits are shown on screen;
- rendered `.mp4`;
- a short QA note or contact sheet when reviewing a new direction.

## Scope boundaries

- This skill owns music-led visualizers, not narration-led essays.
- Use Remotion for authored vector/typographic motion and final assembly; use
  Seedance for original generated cinematic worlds. Do not substitute either
  with unrelated geometry when the brief calls for the other medium.
- Do not publish automatically. Publishing requires a separate explicit request
  and the appropriate YouTube workflow.
