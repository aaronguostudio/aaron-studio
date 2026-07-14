# Landscape Photo Essays

Use this path for an original music video made from licensed, high-resolution
still photography. It is not a generic slideshow: sequence a small visual
journey and keep all motion subordinate to the photographs.

For the named `Visual And Sound Photo Essay` 10-minute format, read
[visual-and-sound-photo-essay.md](visual-and-sound-photo-essay.md). Its
specific timing and packaging rules override these generic defaults.

## Source gate

- Keep the original image page, photographer, local filename, and license in
  `photo-sources.json` beside the render.
- Treat `src/content/music-visualizer/photo-source-registry.json` as the
  cross-project reuse record. Before a new selection, compare each candidate
  photo page against it; use new sources by default and reuse only when the
  callback is intentional. Record every approved render with:

  ```bash
  node tiles/music-visualizer/scripts/photo-source-registry.mjs --record \
    --registry src/content/music-visualizer/photo-source-registry.json \
    --config <photo-essay.json> --project <project-slug>
  ```

- Prefer horizontal images at least 3000 px wide; use portrait images only when
  an intentional crop preserves the photograph's subject.
- For a 4K master, verify the downloaded source still has at least 3840×2160
  effective pixels after its 16:9 crop. Reserve a 2–5% pixel margin for any
  approved zoom; download a larger Unsplash rendition before rendering rather
  than upscaling a 1080p or 3840px preview.
- For commercial publishing, choose landscape-only photos without recognizable
  people, trademarks, logos, private-property restrictions, or artwork.
- Use an official download route or API. If an API is used, meet its attribution
  requirements; include photographer credits in the YouTube description when
  practical even if the license does not require them.

## Visual direction

- Curate four to eight photographs around one coherent progression of light,
  palette, and spatial density—never a random stock-photo mix.
- Hold each shot for 10–20 seconds. Use 1.5–3 second fades on musical handoffs.
- Make `static` the default motion. Only choose a center-anchored `zoom-in` or
  `zoom-out` when the composition benefits from it; limit that move to 2–5%
  over the whole shot. Do not pan vertically or horizontally unless Aaron has
  explicitly approved a specific panoramic image.
- Do not add captions, progress bars, logos, or decorative overlays to the
  viewing field unless the user explicitly asks for a title treatment.

## Credit layer and YouTube disclosure

- When a source record is complete, show a two-line lower-left photographic
  credit: editorial image title plus sequence number; photographer, location,
  and camera only when known. Do not invent missing camera data.
- Fade the credit in after the photograph is stable, hold it briefly, then fade
  it out just before the next transition (or the end of the final photograph).
  Do not slide, track, bounce, or let it overlap the next photograph's credit.
- Put the same `credit` object in the render config and automatically write a
  `youtube-description.md` listing the photo title, photographer, available
  location/camera data, and source page. This is a separate full disclosure,
  not a replacement for source records.

## Render and review

Use `scripts/render-photo-essay.mjs` with a JSON config containing an ordered
`slides` array. Match the timeline to the selected original music, then review
a 45–90 second sample for horizon crops, black edges, transition timing, color
continuity, credit legibility, source resolution, and audio/video duration.
