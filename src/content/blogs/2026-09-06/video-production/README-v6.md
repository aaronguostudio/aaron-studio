# V6 visual-only revision

Renderer: tiles/aaron-video-gen/remotion/src/projects/dhh-ai-enthusiasm-v6/index.tsx
Compositions: DhhFilm (503.2 s), DhhVisualPreview (102.233 s).

The v6 renderer reuses the frozen v5 data, narration and public image directory. VisualScenes.tsx overrides ten named beats using registered layout slots. New media files use the v6- prefix. The v5 renderer remains unchanged.

`revise-v6.py` rebuilds the v6 planning records from the archived v5 records, without modifying the script/audio. Do not run the old `build-plan.py` over the active v6 plans: it describes v5. `render-data-v6.json` documents the v6 visual overrides.

`qa-prototype-v6.py` extracts an entry/middle/exit sheet and a v5/v6 comparison from the encoded preview. `qa-master-v6.py` checks the master streams, audio levels and 108 sequentially decoded frames. `v6-revision-manifest.json` records locked source hashes.
