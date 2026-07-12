# Legacy Script And Renderer Contract

`youtube-script.md` is the narration and legacy asset contract. The richer
directorial contract lives in `video-storyboard.json`.

## Markdown Shape

```markdown
# Video Title

## [HOOK]

Short cold-open narration.

---

## [SLIDE: Meaningful Chapter Title — first-image.png]

Narration for the first visual state.

[IMAGE: second-image.png]

Narration after the image switch.

---
```

The slide title becomes a visible chapter indicator. Use an argument label such
as `The Deployment Clue`, not `Illustration 01` or `Section 3`.

## Hook

- Place `[HOOK]` before the first slide.
- Keep it to the concrete mystery, contradiction, scene, or result.
- Use `[HOOK: image.png]` only when the cold open needs a different image.
- ElevenLabs word timings drive stable phrase captions.

## Image Sequences

- The image in the slide header is the first state.
- `[IMAGE:]` begins another state at that narration boundary.
- Use markers only when the storyboard selects `image-sequence`.
- Keep all images consistent with the approved video treatment.
- Name video-only assets `sNN-MM-name.png` when that ordering is useful.

Changing image markers changes narration segmentation and may invalidate
rewrite and TTS caches. Remove affected `rewrite-*.txt` files from
`.video-gen-cache/` before regenerating.

## Motion Marker

The only supported structured marker is currently:

```markdown
<!-- motion: actorFramework -->
```

Do not invent other markers. Plan future templates in the storyboard, implement
and prototype them, then add parser support only after their registry status is
`available`.

## Current Renderer Features

- Optional cover, narrated hook, brand intro, and outro.
- Stable phrase captions from ElevenLabs word timings.
- Image-sequence crossfades.
- ACTOR framework structured scene.
- Progress bar and chapter labels.
- One optional music track with narration ducking.
- Generic slideshow transitions as a compatibility fallback.

The current music option does not implement multiple chapter cues. The current
generic transition cycle is not the Video 2.0 target.

## Matching Images

The text after the em dash in a slide header resolves in this order:

1. Exact filename.
2. Number prefix.
3. Description matched by ordered appearance.

Prefer exact filenames for production stability.
