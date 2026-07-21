# Ambient Signal Engine

A web-first, deterministic ambient animation prototype with three original
scene families: Signal Loom, Moon Tides, and Breath Field.

The page reuses the canonical `Luminous Tides` music asset and its version-2
precomputed analysis. Click `Play music` once to satisfy the browser's audio
permission; the track, timeline, and light response then share one clock.

## View locally

Serve the repository root so the demo and Remotion wrapper can import the same
engine module:

```bash
python3 -m http.server 4174 --directory .
```

Open <http://127.0.0.1:4174/demos/ambient-signal-lab/>.

## Shared architecture

- `tiles/aaron-video-gen/remotion/src/ambient/ambient-engine.js` contains the
  dependency-free drawing engine.
- This page supplies browser time with `requestAnimationFrame`.
- `AmbientSignal.tsx` supplies deterministic Remotion time with
  `useCurrentFrame()`.
- `durationSec` controls the finished programme; `cycleDurationSec` controls
  the seamless short loop. A two-hour render does not require a two-hour asset.

All motion is periodic, seeded, and independent of browser wall-clock state.
The precomputed audio analysis modulates luminance and density, but never
introduces geometry jitter. The demo references the music's canonical project
path instead of copying the MP3.

## Remotion usage

The composition is registered as `AmbientSignal`. For example, render a
one-hour Sleep programme from the 24-second Moon Tides cycle:

```bash
cd tiles/aaron-video-gen/remotion
npx remotion render src/index.ts AmbientSignal moon-tides-1h.mp4 \
  --props='{"scene":"sleep","durationSec":3600,"cycleDurationSec":24,"seed":2718,"intensity":0.82,"palette":"lunar"}'
```

The same props work when `AmbientSignal` is composed inside another Remotion
timeline. Optional frame-indexed `audioAnalysis` can be supplied later without
changing the scene geometry contract.
