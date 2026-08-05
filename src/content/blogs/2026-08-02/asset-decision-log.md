# Asset Decision Log: What AI Code Can Change

## Selected Assets

- `audio.mp3` — Aaron PVC narration, approved take retimed by 1.03× within the
  workflow's transparent post-production limit.
- `audio-generation-manifest.json` — word-level timing source used by captions.
- `imgs/00-cover-thumbnail-longform-a.png` — selected YouTube thumbnail.
- `imgs/00-cover-thumbnail-longform-b.png` — alternate thumbnail.
- `imgs/video/editorial/mitchell-portrait-v1.png` — visibly illustrated
  opening portrait; recognition and human presence, not evidence.
- `imgs/video/editorial/uncle-bob-portrait-v1.png` — matching opening portrait;
  recognition and human presence, not evidence.
- `imgs/video/editorial/read-verify-instruments-v1.png` — one tactile
  composition that makes the community's two legitimate costs concrete.
- `imgs/video/sprites/authority-ledger-longform-v1.png` — the one semantic
  accent, bound to the phrase “system of record.”
- Native Remotion typography, diagrams, rules, and editorial geometry — the
  primary visual body of the film.

The three new editorial assets were generated on a flat chroma background and
converted locally to transparent PNGs with a soft matte and despill. Source,
prompt, hashes, render copy, and alpha QA are recorded in
`imgs/video/editorial/editorial-assets-manifest.json`; all visible corner and
green-fringe checks pass. The image tool did not expose its model identity, so
the manifest does not claim GPT Image 1.5 or 2.

## Evidence Sources

The film cites or discusses public posts by Mitchell Hashimoto and Robert C.
Martin, plus first-party material from OpenAI, Cloudflare, and Godot. Supporting
survey, preprint, and community-thread sources remain recorded in
`fact-pack.json` with explicit evidence limits.

## Music And Effects

Selected: `music-score-v1/authority-in-the-loop-score-v1.m4a`, an original
continuous documentary score generated with Eleven Music `music_v2` for this
film's exact 09:44 arc. It uses low cello for consequence, sparse felt piano for
judgment, and a soft analog pulse for AI workflow. The service returned a
07:37.512 first movement, so a 02:12.912 continuation was generated and joined
with a six-second equal-power crossfade; the final master is exactly 584.384
seconds and fades cleanly.

- Library search: no approved, rights-cleared track matched the brief.
- Source hashes and prompts: `music-score-v1/generation-manifest.json` and
  `music-score-v1/continuation/generation-manifest.json`.
- Final score manifest: `music-score-v1/score-stitch-manifest.json`.
- Mix: broad chapter curves from `0.065` to `0.085` under narration, with a
  short `0.13` lift into the end card before the score fades to silence.
- Sound effects: none.
- Rights: PASS on 2026-08-03. Both score movements were generated through the
  Eleven Music API, which is available on paid subscriptions. ElevenLabs states
  that paid-plan generations include a commercial license when they are not
  Beta Services, and describes Eleven Music as cleared for broad commercial
  use. References: `https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform`
  and `https://help.elevenlabs.io/hc/en-us/articles/37780368848785-What-is-Eleven-Music`.

### V4 music revision

The continuous V3 score remains preserved as the historical master but is not
selected for V4. Aaron found its analog-pulse texture too busy, too quiet, and
fatiguing when sustained across the whole film.

V4 reuses `src/content/blogs/2026-07-06/video-full/music-full-v1.mp3`, the
project-owned low-cello and restrained-piano score from the approved, published
FDE film. The asset-library search found no approved general-library substitute
with an equally strong fit; this project-specific source is selected because it
is the exact sound reference Aaron named. It is edited into four bounded cues
with three narration-only passages. Exact timings and gain intent live in
`video-longform/v4-score-plan.json`.

### V5 authored sound arc

V5 preserves the accepted opening cue but replaces V4's repeated-source chapter
switches with three distinct musical functions: a warm chamber cue for common
ground, a newly generated string movement that grows only through the industry
evidence, and a separate piano-and-strings resolution for the closing framework.
Aaron approved the scored prototype and the generated tracks passed the final
rights review on 2026-08-03. Their manifests record `music_v2` generation via
the Eleven Music API. ElevenLabs states that Music API access is available to
paid subscribers, that Music v2 is covered by the current model-specific terms,
and that self-serve media rights permit online commercial use; this YouTube
essay is neither music streaming nor a music library/repository. References:
`https://elevenlabs.io/docs/overview/capabilities/music`,
`https://elevenlabs.io/eleven-music-model-specific-terms`, and
`https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform`.

Three restrained effect candidates were generated because the library contained
no approved effects with the required editorial fit: a muted pizzicato
confirmation, an airy thread transition, and a soft node settle. Aaron's
prototype review found that even selective accents felt less natural than the
music-and-silence treatment, so every spot effect is rejected for V5 and the
renderer uses none. The candidate files remain preserved as unused production
history. Electronic pulses and cinematic tension beds found during library
review were also rejected because they created pressure through rhythm rather
than meaning. The selected cue map lives in
`video-longform/sound-cue-map-v5.json`.

## Semantic Sprites

One selected. The earlier ledger was non-destructively cropped for long-form
scale and appears once beside the system-of-record definition. Its semantic job
is narrow, the layout retains meaning when it is removed, and its entry and exit
use the shared `semantic-settle` runtime. Other sprite candidates were rejected
because portraits and the read-versus-verify composition need to function as
scene media rather than small stickers.

## Rejected Assets And Patterns

- Old dark/coral thumbnail and the previous dark/green video language.
- Fake social screenshots, logos, product UIs, photorealistic reenactments, or
  generated documentary-style evidence.
- Decorative Sticker Book accents without a unique semantic job.
- Music candidates whose rights or editorial value did not justify use.

All selected production assets are owned, generated for this project, or
native to the renderer. No third-party media is embedded in the final master.
