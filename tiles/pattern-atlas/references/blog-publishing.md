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
  └── manifest.json
                 ↓ publish-to-blog.mjs
<blogRepo>/content/learn/{en,zh}/<slug>.md
<blogRepo>/components/learn/concepts/<slug>.vue
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
- `neighbors` with `name`, `fullName`, `category`, and `summary`
- `sources` with `title` and `url`

Use the same slug, translation key, neighbor identities, and source URLs in both languages.

`visual.vue` must:

- accept `locale: 'en' | 'zh'`;
- contain only public-safe copy;
- use the blog's theme variables, typography, and responsive conventions;
- include the concept-specific interactions, not duplicate the entire Markdown article;
- expose every changing explanation through visible text and `aria-live`;
- avoid external requests.

`manifest.json` must include `slug`, `source`, `status`, `updated`, and `files`.

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
3. Check H1, full names, interaction, source links, language switch, mobile width, and console errors.
4. Review the blog diff and stage only intended Learn files.
5. Commit on `main` only after Aaron approves release.
6. Push `main` only after explicit authorization.
7. Verify the resulting production deployment provenance is Git on `main` at the expected commit and the real domain serves it.

Never deploy a local worktree, preview branch, or manual alias to production.
