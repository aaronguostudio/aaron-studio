# Spectrum visualizer library v1

This folder is a reusable library of 15 deterministic audio visualizers derived from a frame-by-frame geometry review of the referenced YouTube Short. Avee Player and Motion Ninja were used only as research references; no template files, graphics, music, or source assets were copied.

The source video's color, glow, particle, and decoration variations were deduplicated into distinct geometry families. Palette changes remain available through the existing `deep-ink`, `paper-moon`, and `soft-slate` themes.

## Start here

- `spectrum-library-showcase.mp4` — 42-second continuous-audio overview of all 15 styles
- `catalog-contact-sheet.jpg` — all styles at the same active audio frame
- `showcase-contact-sheet.jpg` — frames sampled from the actual overview video
- `catalog.json` — stable style IDs, order, family, and source evidence
- `library-manifest.json` — generated paths and render provenance
- `qa-report.json` — machine-readable media and consistency checks

## Catalog

| # | Style ID | Preview video | Family | Suggested use |
| --- | --- | --- | --- | --- |
| 01 | `spectrum-bars` | `linear/linear.mp4` | Linear | Parameter tuning and explainers |
| 02 | `mirrored-spectrum` | `mirrored/mirrored.mp4` | Linear | Balanced long-form default |
| 03 | `waveform-line` | `waveform-line/waveform-line.mp4` | Linear | Minimal editorial overlays |
| 04 | `mirrored-waveform` | `mirrored-waveform/mirrored-waveform.mp4` | Linear | Symmetrical ambient tracks |
| 05 | `filled-spectrum` | `filled-spectrum/filled-spectrum.mp4` | Linear | Stronger energy silhouette |
| 06 | `spectrum-dots` | `spectrum-dots/spectrum-dots.mp4` | Linear | Quiet, technical, restrained motion |
| 07 | `twin-spectrum` | `twin-spectrum/twin-spectrum.mp4` | Linear | Split-channel or layered arrangements |
| 08 | `radial-spectrum` | `radial/radial.mp4` | Radial | General hero visual |
| 09 | `radial-waveform` | `radial-waveform/radial-waveform.mp4` | Radial | Organic, breathing contour |
| 10 | `radial-dots` | `radial-dots/radial-dots.mp4` | Radial | Minimal orbital identity |
| 11 | `spectrum-arc` | `spectrum-arc/spectrum-arc.mp4` | Radial | Lower-third and portrait reframing |
| 12 | `filled-radial-spectrum` | `filled-radial-spectrum/filled-radial-spectrum.mp4` | Radial | Bold hero moments and thumbnails |
| 13 | `triangle-spectrum` | `triangle-spectrum/triangle-spectrum.mp4` | Shape | Geometric electronic music |
| 14 | `x-spectrum` | `x-spectrum/x-spectrum.mp4` | Shape | Graphic transitions and short inserts |
| 15 | `side-burst-ring` | `side-burst-ring/side-burst-ring.mp4` | Radial | Directional composition with side copy |

Each style folder contains the source audio copy, `render-config.json`, resolved `config.json`, `audio-analysis.json`, generation manifest, preview still, dynamic contact sheet, and final MP4.

## Reuse workflow

Render the complete library against a different track:

```bash
node tiles/music-visualizer/scripts/render-spectrum-library.mjs \
  --audio <music.mp3> \
  --output-dir <library-output> \
  --scale 1
```

Useful options:

- `--only waveform-line,radial-dots` renders selected IDs or slugs.
- `--force` replaces existing videos.
- `--force-analysis` recomputes analysis instead of reusing a shared result.
- `--no-render` prepares folders, configs, audio, and manifests only.

Rebuild previews, the overview video, and QA evidence:

```bash
node tiles/music-visualizer/scripts/render-spectrum-contact-sheet.mjs --force
node tiles/music-visualizer/scripts/build-spectrum-showcase.mjs
node tiles/music-visualizer/scripts/qa-spectrum-library.mjs
```

## Shared analysis parameters

| Parameter | Value |
| --- | --- |
| Analysis | Precomputed, frame-indexed JSON |
| Sample rate | 22,050 Hz |
| Video rate | 30 fps |
| FFT size | 1,024 samples |
| Spectrum | 48 logarithmic bands |
| Frequency range | 43 Hz–10 kHz |
| Display range | 38 dB below each frame peak |
| Spectral tilt | -12 dB from low to high bands |
| Attack / release | 0.46 / 0.14 |
| Spatial smoothing | 18% previous + 64% current + 18% next band |

RMS supplies a quiet-passage gate. Spectral flux/onset affects only small markers or halos, avoiding full-frame beat flashes.

## QA result

- All 15 renders decode without errors.
- Every style is 1,920×1,080 at 30 fps with 1,260 H.264 video frames and AAC stereo audio.
- Audio/video duration delta is 24 ms, below one 33.3 ms frame.
- All styles use byte-identical source audio and byte-identical 1,261-frame analysis data.
- Every style has frame 0, first-change, midpoint, active, release, and final-frame contact-sheet evidence.
- The 42-second overview decodes correctly and contains all 15 ordered styles.
- No temporary `.render.mp4` files remain.
- Remotion TypeScript validation passes. Presentational spectrum components receive timing from the parent `MusicVisualizer`, which explains the audit's timing-primitive warning.

The common `Prism Pulse` demo track originated from Eleven Music v2. Verify the active paid-plan terms before commercial publication; the visualizer code itself adds no paid dependency.
