# Builder Notes Visual Contract

Use this contract when finishing or publishing a Builder Note. Use `blog-illustrate` for visual judgment and the installed `imagegen` skill with the built-in generator for image creation.

## Brand baseline

Read these files before generating:

- `src/content/strategy/visual-language.md`
- `src/content/strategy/blog-visual-system.md`
- `src/content/strategy/blog-visual-style-library.md`
- the most recent approved image in `<blogRepo>/public/notes-img/`

Builder Notes should feel like small editorial artifacts from the same world as Aaron's essays: warm, calm, premium, human-scale, and lightly AI-native.

Default direction:

- visual mode: `Editorial Minimal` or `Human-Scale Metaphor`;
- primary family: `Editorial Workbench` or `Soft Glass Narrative`;
- one ordinary anchor such as a desk, notebook, paper, tool, room, shelf, window, bridge, or modular object;
- one restrained AI/system motif such as a soft cyan thread, translucent sheet, amber path, or green checkpoint;
- warm white, natural wood, graphite, soft cyan, and limited amber or green;
- one predicate, three major elements at most, and generous negative space.

Reject generic robots, glowing brains, neon dashboards, sci-fi HUDs, fake UI, stock-office scenes, text inside the image, excessive glass, and metaphors that try to explain the entire Note.

## Notes-specific deliverables

Unlike a full essay illustration package, create one visual world:

1. Compare three distinct cover concepts in a short visual strategy.
2. Record `Agent-selected` when Aaron delegated the choice; otherwise ask him to choose.
3. Generate at least two refined clean-cover candidates for the selected concept.
4. Inspect both and select one. Regenerate once if neither passes.
5. Create two derivatives from the same approved master:
   - `public/notes-img/<slug>.webp` — clean 16:9 cover, no text;
   - `public/notes-img/<slug>-social.jpg` — same clean composition for social metadata.

Aim for 2400 × 1350 or larger. Preserve the accepted source PNG in `src/content/notes/YYYY-MM-DD/<slug>/imgs/`. Compress the WebP at quality 82 and the JPEG at quality 90. Do not create a title-overlay thumbnail unless Aaron explicitly asks for one.

## Frontmatter

Add localized `alt` text and identical asset paths to both language files:

```yaml
image: '/notes-img/<slug>.webp'
socialImage: '/notes-img/<slug>-social.jpg'
alt: '<localized concise description of the visual metaphor>'
```

## Visual QA

Use `view_image` on the approved master and both final derivatives. Verify:

- the image communicates one sentence within five seconds;
- the metaphor matches the Note rather than generic AI work;
- it feels continuous with the latest approved Builder Note image without copying its composition;
- no text, logo, watermark, fake UI, distorted person, or irrelevant object appears;
- the focal subject survives the homepage crop and mobile width;
- final files exist, have the intended 16:9 dimensions, and are not accidental duplicates of rejected candidates.

Record the selected concept, prompt, candidate decision, backend, dimensions, and compression in the current Note's visual artifacts. Only set `published: true` after this gate passes.
