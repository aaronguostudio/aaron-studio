# Blog Learn publishing contract

Use this only when creating, updating, or publishing a public concept derivative.

## Architecture

```text
src/brain/concepts/<slug>.md                 private semantic source
src/brain/concepts/pages/<slug>.html         private standalone explainer
                 ↓ editorial derivation
src/content/concepts/<slug>/                 public package
  ├── en.md
  ├── zh.md
  ├── visual.vue
  ├── social/
  │   ├── og-1200x627.jpg
  │   └── card-4x5.jpg                       optional native social asset
  └── manifest.json
                 ↓ publish-to-blog.mjs
<blogRepo>/content/learn/{en,zh}/<slug>.md
<blogRepo>/components/learn/concepts/<slug>.vue
<blogRepo>/public/learn-img/<slug>/
```

The blog's generic `/learn` and `/learn/[slug]` routes discover new content and visual components automatically. Adding a concept must not require route or registry edits.

## Public package contract

Both Markdown files must include:

- `title`
- `fullName`
- `shortName`
- `description`
- `mentalModel`
- `date` and `updated`
- `domain` and `domainKey`
- `tags`
- `maturity`
- `published`
- `featured`
- `translationKey`
- `interaction`
- `socialImage` and `socialImageAlt` when the concept has a static share image
- `cardImage` and localized `cardImageAlt` when the concept has a native 4:5 card
- `neighbors` with `name`, `fullName`, `category`, and `summary`
- `sources` with `title` and `url`

Use the same slug, translation key, neighbor identities, and source URLs in both languages.

`visual.vue` must:

- accept `locale: 'en' | 'zh'`;
- contain only public-safe copy;
- use the blog's theme variables, typography, and responsive conventions;
- inherit `--foreground`, `--muted-foreground`, `--card`, `--secondary`, and
  `--line-*` tokens; never fall back to fixed light-theme text or surfaces;
- include the concept-specific interactions, not duplicate the entire Markdown article;
- expose every changing explanation through visible text and `aria-live`;
- avoid external requests.

`manifest.json` must include `slug`, `source`, `status`, `updated`, and `files`.

## Social image contract

### Choose the card mode

Choose the mode before composing the portrait card:

| Mode | Use when | Direction |
| --- | --- | --- |
| `editorial-explainer` | Default for Learn and ordinary blog sharing | Make the article's real thinking object—the chart, relationship, model, sequence, or comparison—the hero. The result should feel like a page saved from a thoughtful publication, not an advertisement. |
| `editorial-metaphor` | A physical analogy materially clarifies an otherwise abstract mechanism | Use tactile paper sculpture, cut-paper objects, or another restrained editorial illustration. Let the metaphor carry a specific mechanism; do not add people, decorative scenes, or extra colors unless they are necessary to the explanation. |
| `campaign-poster` | Aaron explicitly requests a campaign, promotion, or high-impact distribution treatment | High contrast, dark fields, neon accents, and poster-like statements are allowed. This mode is opt-in and must never become the automatic Learn card. |

Prefer `editorial-explainer` when either of the first two modes could work. A
recognizable illustration is not enough reason to choose `editorial-metaphor`;
the object must make the concept easier to reconstruct from memory.

For `social-brief.json`, use `visual.theme: "editorial-explainer"` or omit the
theme to accept the default. Use `visual.theme: "campaign-poster"` only for an
explicit campaign. The renderer still accepts the legacy aliases
`editorial-light` and `sleek-dark`. `editorial-metaphor` requires a
concept-specific artwork source and visual QA rather than the generic campaign
renderer.

Across all modes:

- Treat `<blogRepo>/components/main/header.vue` as the logo source of truth.
  Resolve the public asset referenced by the `Logo/Site Title` block before
  every render. At present that component references
  `<blogRepo>/public/android-chrome-192x192.png`; if the component changes, the
  new reference wins automatically.
- The current Aaron Studio mirror is
  `assets/aaron-logo-assets/aaron-guo-website-logo.png`. Before using the mirror,
  verify that its SHA-256 hash matches the public asset resolved from the blog
  header. A filename such as `final`, a cached social card, or a previous
  screenshot is not evidence that a mark is current.
- Preserve the official asset's own rounded tile and background. Do not redraw
  the mark, recolor it, crop it, or place it inside an invented black tile.
- Run the publisher's source-image check before rendering final derivatives.
  A brand image mismatch is a release blocker, even when the card otherwise
  looks correct.
- Avoid ad cues on ordinary Learn cards: CTA buttons, product claims,
  testimonials, urgency language, performance promises, and decorative
  spectacle that competes with the teaching object.
- Keep stable brand anchors—mark, series label, type hierarchy, canonical URL,
  and 4:5 geometry—while allowing the concept to determine the composition.

- Use `social/og-1200x627.jpg` for Open Graph and link-preview distribution. Keep it a
  static JPEG so LinkedIn, Facebook, and other crawlers do not depend on runtime image
  generation.
- Use `social/card-4x5.jpg` when a native portrait social post is prepared. It is a
  separate composition, not a crop of the link-preview image. The same original JPEG
  is the durable source for the Learn index thumbnail and detail-page memory card;
  Nuxt Image must produce smaller responsive WebP derivatives for browser delivery.
- Render Learn index thumbnails in a true `4 / 5` frame with `object-contain` so the
  complete card, including its designed padding, remains visible. Do not stretch the
  grid item and compensate with `object-cover`; that silently crops the card edges.
- Compose the portrait card natively at 1080×1350 with 72–88 px horizontal padding
  as the default standard. This keeps the title and teaching copy large enough at
  phone-feed size. Do not scale a 2:3 source down to fit inside 4:5 and accept the
  resulting side gutters; reflow or regenerate the composition for the target canvas.
- Wider margins are an intentional exception for unusually sparse artwork, not a
  second default specification. Review exceptions at a 50% phone-sized preview and
  confirm they improve the concept rather than merely adding empty space.
- Keep brand anchors consistent, but let the concept determine the visual metaphor and
  composition. Do not force every concept into one fixed card layout.
- Put the public URL in frontmatter, for example
  `/learn-img/<slug>/og-1200x627.jpg`, and localize `socialImageAlt`.
- Put the portrait URL in `cardImage`, for example
  `/learn-img/<slug>/card-4x5.jpg`, and localize `cardImageAlt`. When the JPEG exists,
  the publisher treats both fields as required in English and Chinese.
- Keep source artwork in the public package when it is useful for future recomposition,
  but list only publishable derivatives in `manifest.files`.

## Commands

From Aaron Studio:

```bash
node tiles/pattern-atlas/scripts/publish-to-blog.mjs --slug <slug> --dry-run
node tiles/pattern-atlas/scripts/publish-to-blog.mjs --slug <slug>
node tiles/pattern-atlas/scripts/publish-to-blog.mjs --slug <slug> --check
```

The script only synchronizes local files. It never commits, pushes, deploys, or changes a production alias.

## Release gate

After sync:

1. Run the blog unit tests and production build.
2. Start the blog dev server and verify `/learn/<slug>` and `/zh/learn/<slug>`.
3. Check H1, full names, interaction, source links, language switch, mobile
   width, light/dark computed colors, and console errors.
4. Review the blog diff and stage only intended Learn files.
5. Commit on `main` only after Aaron approves release.
6. Push `main` only after explicit authorization.
7. Verify the resulting production deployment provenance is Git on `main` at the expected commit and the real domain serves it.

Never deploy a local worktree, preview branch, or manual alias to production.
