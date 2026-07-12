---
name: music-visualizer
description: Create original music-led YouTube videos with Eleven Music and deterministic Remotion motion graphics. Use when Aaron wants study/work background music, minimalist album visualizers, piano or ambient tracks, 2D/3D-feeling React/Remotion animation, or a repeatable pipeline for generating and rendering music videos.
---

# Music Visualizer

Create an original soundtrack, choose a visual language that follows its mood,
render a calm deterministic visualizer in Remotion, and preserve the music,
prompt, visual config, render, and QA evidence together.

This is a separate long-form music-video workflow. Do not route it through the
Kling-based music Shorts pipeline unless the user explicitly asks for a
generated cinematic clip.

## Workflow

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
palette or writing an Eleven Music prompt.

Never request an imitation by naming a living artist, song, or copyrighted
lyrics. Describe musical properties instead. Preserve the original source
track only as a reference; do not copy its melody, audio, or visual assets.

### 2. Generate or accept audio

Use `scripts/music-visualizer.mjs` as the single entry point. It can:

- generate instrumental audio with the Eleven Music API;
- accept a local audio file for testing;
- create an output folder and generation manifest;
- render the silent `MusicVisualizer` composition and mux the source audio
  into the final MP4 with ffmpeg;
- clean temporary Remotion props after rendering.

Load `ELEVENLABS_API_KEY` from the shell or the repo `.env`. Use a paid plan
for commercial publishing and retain the manifest with the source artifact.

### 3. Bind sound to motion

Use the `MusicVisualizer` composition in
`tiles/aaron-video-gen/remotion/src/MusicVisualizer.tsx`. It intentionally uses
frame-driven values only:

- slow frame-driven motion and one clear visual relationship;
- circles attached to a path, breathing bars on a baseline, or one layered
  sculptural form;
- subtle depth ordering for a 2.5D feeling;
- one of the registered visual systems: `ink-current`, `paper-resonance`, or
  `soft-relic`; or the `audio-mix` composition that blends them from the
  track's precomputed analysis;
- paper grain, restrained typography, and large negative space;
- music muxed into the rendered MP4 after the visual render, keeping the audio
  source and final video duration aligned.

Choose the visual direction from the music. Felt piano and quiet ambient
tracks default to `paper-moon`; nocturnal or spacious tracks can use
`deep-ink`; cool reflective tracks can use `soft-slate`.

Do not add CSS transitions, CSS keyframes, wall-clock animation, random values
without a seed, or an always-on attention-grabbing equalizer.

### 4. Prototype before scaling

Start with a 30–60 second test. Review:

- frame 0, the first meaningful change, midpoint, and final fade;
- title and metadata fit at 16:9 and mobile-like review sizes;
- audio starts at frame 0, has no clipping, and ends with the visual;
- the 3D treatment stays subtle rather than looking like a game HUD;
- motion fatigue over a full minute.

Only after the prototype works should you generate 15–120 minute compilations
from several original tracks with gentle audio crossfades.

### 5. Verify and package

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

Keep these artifacts together:

- `config.json`;
- `music.mp3` or the source audio;
- `audio-analysis.json` for an audio-reactive render;
- `generation-manifest.json`;
- rendered `.mp4`;
- a short QA note or contact sheet when reviewing a new direction.

## Scope boundaries

- This skill owns music-led visualizers, not narration-led essays.
- Use Remotion for authored vector/typographic motion; use Kling only when the
  user wants generated cinematic footage.
- Do not publish automatically. Publishing requires a separate explicit request
  and the appropriate YouTube workflow.
