# V7 sound and pacing experiment

- `build-sound.py`: decode the v6 dry audio once, insert silence at three verified points, preserve four voice segments exactly, normalize music sources, apply slow music-only envelopes and write lossless stems. Run with the bundled Python runtime (NumPy is required).
- `sound-plan.json`: source gains, cue positions, generated track provenance, silence inserts, hashes and voice sample checks.
- `retime-plans.py`: derive 39 scenes and 171 captions from archived v6 plans. The v7 renderer uses independent captions to avoid stale flashes after a breath.
- Remotion entry: `tiles/aaron-video-gen/remotion/src/projects/dhh-ai-enthusiasm-v7/index.tsx`; compositions `DhhFilmV7` and `DhhSoundPreviewV7`.
- `mux-preview.py` / `mux-master.py`: attach the explicit score or dry stem to the silent video without a master limiter or normalizer.
- `verify-encoded-sound.py`: estimate the voice coefficient in ten AAC-encoded windows against the known stems; verify loudness, headroom, silence and video dimensions.
- `qa-frames.py`: sequentially decode all scene entry/middle/exit samples and exact new boundaries.

The v6 renderer and videos are unchanged. Restoring the prior timing means selecting `video-v6.mp4`; no source regeneration or rollback operation is needed. V7 remains an author-review candidate. Do not label the generated scores commercially cleared or publish without the normal approval and rights checks.
