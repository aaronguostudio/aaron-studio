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
