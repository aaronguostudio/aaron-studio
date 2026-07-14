# Visual And Sound Photo Essay

Use this named profile when Aaron asks for a `Visual And Sound Photo Essay`, a
`照片散文版`, or the established ten-minute photography-and-music format. Treat
it as a calm editorial work, not a slideshow or a generic ambient visualizer.

## One-line invocation

Interpret this as enough direction to begin a proposal or render:

```text
做一支 Visual And Sound Photo Essay：<listening job>，<subject / visual world>。
```

Examples: `night reading, quiet winter stations`; `deep work, desert forms at
first light`; `morning focus, rural green geometry`. Preserve the format while
changing the subject, color journey, and music palette. Do not repeat a prior
image unless the callback is intentional.

## Locked format

- Deliver one 10-minute 4K master: 3840×2160, 30fps, H.264, AAC 256 kb/s.
- Use 13 source photographs, each 48 seconds, joined by 12 two-second fades.
  This produces a 600-second timeline exactly.
- Use static framing for every photograph by default. Permit at most one
  composition-specific centered zoom of 1–5% in the full piece. Never add
  constant drift, bobbing, vertical/horizontal pan, beat-synced scale, or a
  camera move merely to make a still image feel animated.
- Build one coherent journey of light, color, and spatial density. Sequence
  contrast deliberately: open/contained, light/shadow, wide/detail, then a
  quiet release. Do not make a random stock-photo montage.
- Show a refined lower-left two-line credit after each image settles. Keep it
  visible long enough to read; fade it in and out only. It must not slide,
  bounce, overlap the next credit, or dominate the photograph.

## Music master

- Start from the listening job, then select the visual family; never add motion
  to compensate for a weak music/visual match.
- Use instrumental-only music. State instrumentation, tempo/energy ceiling,
  section shape, and exclusions in the prompt. Never name a living artist,
  studio, song, or copyrighted character as a style target.
- Prefer four compatible Lyria Pro chapters of roughly 150–180 seconds: arrival,
  settling, a restrained harmonic opening, and release. Keep key, BPM,
  instrumentation, palette, and energy ceiling compatible; stitch with
  six-second equal-power crossfades and an eight-second final fade.
- Use a structured continuous Eleven Music master only when its plan and terms
  support the intended publication. Keep the prompt, provider/model, source
  files, and stitch manifest beside the output.
- Never pad a public-ready master by visibly repeating one short clip. If a
  provider is blocked, label a temporary fallback honestly and replace it before
  public release when it does not meet the original-music standard.

## Source and rights gate

- Read `src/content/music-visualizer/photo-source-registry.json` before source
  selection; run `photo-source-registry.mjs --check` before downloads and
  `--record` after final approval.
- Use 13 new Unsplash source pages by default. Download from the original
  endpoint at 5120 px and verify every landscape image supports a 4K 16:9 crop
  without upscaling.
- Reject people, prominent logos, legible brand/signage clutter, derivative
  artwork, weak crops, or a visual flaw that would become distracting during a
  48-second hold.
- Keep `photo-sources.json`, including source page, photographer, known camera
  and location, license, local filename, and original dimensions. Generate the
  exact same credits in `youtube-description.md`.

## Review and delivery

1. For an untested pairing, render a 45–90 second sample first. Once Aaron has
   approved a direction or explicitly requests a full piece, go directly to the
   master.
2. Before final output, inspect a full-duration contact sheet plus the early,
   midpoint, chapter-handoff, and closing frames. Check crop, composition,
   caption legibility, source originality, and repetition.
3. Verify exact duration, 3840×2160 resolution, 30fps, audio/video alignment,
   and a final audio peak at or below -1 dB. Preserve the unmodified render and
   create a delivery master with a safe audio ceiling.
4. Create a title, YAML metadata, source-complete YouTube description, and a
   local upload record. Do not upload by default. When explicitly asked,
   verify the active channel is `Visual And Sound` and upload as `unlisted`
   unless Aaron explicitly requests another privacy setting.

## Rejection checklist

Reject and revise a render if it contains any of the following:

- nervous micro-movement, perpetual Ken Burns panning, or a mechanical zoom;
- text that fades too quickly or uses a loose title/detail gap;
- repeating images or a thematically incoherent source sequence;
- low-resolution stills, cropped subjects, obvious signage, or visible
  watermarks/logos;
- abrupt musical seams, a visibly looped short music segment, clipping, or a
  visual cut that ignores the musical handoff.
