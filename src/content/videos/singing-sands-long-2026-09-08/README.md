# The desert has a voice — extended English edition

An 8:57 documentary with three independently composed 9:16 shorts. This is a local review package, not a published release.

- `film.mp4`: 1920×1080, 30 fps, English narration and on-screen text.
- `shorts/`: three English portrait videos; exact source ranges and durations in `manifest.json`.
- `review.html`: long film, chapter navigation, shorts, scientific and visual sources.
- `youtube-script.md`, `captions.en.srt`, `timeline.json`: narration and measured caption timing.
- `film-mix.wav`, `build-audio.py`, `music/cues.json`: reproducible voice, music and real-recording mix.
- `fact-pack.json`, `research-evidence.json`: primary source support and claim boundaries.
- `qa/artifacts.json`: final sizes, durations, stream metadata and hashes.

The original approved voice profile and accepted narration segments are preserved. New voice lines use the same profile. Six chapter cues add an original score with narration-triggered ducking; the opening and closing genuine NPS sound excerpts remain unscored. New scientific graphics are explanatory illustrations, not calibrated simulations. Silo vibration and vacuum granular gripping are bounded related examples; the film does not present the gripper as an invention derived directly from singing-dune research.

English is the completed edition for this round. A future Chinese edition should share research and assets but receive its own script, narration, timing, labels, captions and render. No channel or publishing action has been taken.

Music was generated with Eleven Music v2. Current subscription lookup returned 401, so plan eligibility remains unverified; inspect `music/rights-review.json` before any commercial publication. This does not affect local review.

Rebuild the measured timeline with `build-timeline.py`, the mix with `build-audio.py`, render the registered project compositions in `tiles/aaron-video-gen/remotion/src/projects/singing-sands-long/index.tsx`, then run `finalize.py`. `serve.py` hosts local review on port 8772 with byte-range seeking support.
