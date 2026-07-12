# Blog Illustration Generation And Delivery

Read this reference after `visual-strategy.md`, `style-directions.md`, `mode-mix.md`, and `style.md` are complete. It defines the deterministic output contract for outline, prompts, generation, critique, compression, and article insertion.

## 1. Outline Contract

Write `imgs/outline.md` with this frontmatter:

```yaml
---
type: mixed | infographic | scene | flowchart | comparison | framework
density: minimal | balanced | rich
style: <post-specific style>
style_cohesion: Unified | Controlled Mix | Experimental Mix
image_count: <total including cover and thumbnail>
article: <article path>
style_brief: <style path>
style_directions: <style-directions path>
---
```

Always include a cover first. For every cover, thumbnail, and body image record:

- position;
- type and purpose;
- role;
- visual mode;
- style family;
- visual weight: quiet / medium / loud;
- one visual predicate;
- anti-clutter rule;
- reuse-candidate status;
- one-sentence takeaway;
- density class: narrative/metaphor, light diagram, or dense mechanism;
- visual content;
- versioned filename.

Before prompts, confirm:

- every image has exactly one predicate;
- every style family matches `style-directions.md` and `mode-mix.md`;
- most body images are narrative/metaphor unless the article is a tutorial;
- normal posts have at most two light diagrams and one dense mechanism diagram;
- adjacent images do not repeat composition or metaphor;
- every image explains what the reader loses if it is removed.

## 2. Prompt Pack Contract

Save prompts under `imgs/prompts/NN-name.md` with:

```markdown
# Prompt: NN-name

## Role
## Visual Mode
## Visual Weight
## Style Family
## Positive Prompt
## Negative Prompt
## Mode Constraints
## Density Budget
## Prior Failure To Avoid
```

Name the article section, the local insight, and the image's job. Use the installed `imagegen` prompt schema when the built-in generator is selected.

For exact-text assets, list every permitted word verbatim and explicitly ban all other text. For diagrams, specify node order and every allowed arrow. Treat semantic correctness as a hard constraint.

## 3. Generation Manifest

Create `imgs/generation-manifest.md` from the template before generation. Record:

- backend and provider/model when known;
- generation date;
- selected concept route and cohesion model;
- prompt path for each asset;
- all candidates;
- selected candidate and reason;
- rejection reason;
- reference images, edits, fallbacks, and post-processing;
- image-stock candidacy.

Never overwrite an existing final asset during exploration. Use versioned siblings such as `00-cover-v7-candidate-a.png` and keep rejected candidates unless Aaron asks to clean up.

## 4. Generation Backends

### Codex built-in

Use built-in `image_gen` by default in Codex. Generate one distinct asset or candidate per call. Save or copy project-bound outputs from the default generator directory into the post's `imgs/` directory. Record actual dimensions after generation; prompted dimensions are not proof.

For edits or derivatives, use a local reference path when available or include only the minimum recent images needed. Preserve the source and write a versioned output.

### Baoyu CLI

Use the resolved baoyu path when Aaron explicitly requests CLI/batch generation or built-in generation is unavailable:

```bash
npx -y bun "${BAOYU_IMAGE_GEN_DIR}/scripts/main.ts" \
  --prompt "<full prompt>" \
  --image "src/content/blogs/YYYY-MM-DD/imgs/<versioned-name>.png" \
  --ar 16:9 \
  --quality 2k
```

Do not switch provider silently. Record any fallback. On the explicit baoyu path, OpenAI generally handles thumbnail text more reliably; `codex-cli` is a fallback when configured and must be recorded.

## 5. Concept And Candidate Rules

Before final cover generation, compare at least three concepts that differ in predicate and composition. A palette change is not a new concept. Record the winner or `Agent-selected` rationale in `visual-strategy.md`.

After concept selection:

- generate at least two refined cover candidates;
- visually inspect both;
- promote the winner to a versioned final filename;
- generate at least two thumbnail candidates from the selected cover world;
- inspect thumbnail text at mobile size;
- preserve all candidates.

Cover rules:

- no text in the clean cover;
- one strong metaphor or relation;
- generous negative space;
- no vendor logos or generic AI imagery;
- more editorial than explanatory.

Thumbnail rules:

- same visual world as the cover;
- a calm high-contrast text zone;
- two to four headline lines;
- exact text only;
- no labels elsewhere;
- legible around 320px width.

Body image rules:

- follow `style.md` and the local section insight;
- use distinct composition by role;
- prefer mood and meaning over fake labels for metaphors;
- use large shapes for diagrams;
- regenerate a generic, repetitive, or semantically wrong image once with a narrower contract.

## 6. Visual Critique Gate

Create `imgs/visual-critique.md` before compression or insertion.

Inspect cover, thumbnail, and every body image. For four or more accepted images, create a contact sheet when practical.

Check:

- one predicate per image;
- correct role, mode, weight, and style family;
- semantic correctness of labels, arrows, order, and mechanism;
- exact-text compliance;
- no distorted people, irrelevant UI, logos, or fake documentary evidence;
- no clutter, heavy glass, stock energy, or repeated metaphor;
- mobile readability;
- set-level pacing and composition diversity;
- actual dimensions, aspect ratio, and duplicate files.

Reject attractive images that encode the wrong argument. Record the rejection and narrower regeneration request. End with `Decision: PASS` only when all accepted images and the set pass.

## 7. Compress Accepted Finals

Compress only accepted final assets into `imgs/web/`; do not recompress a historical directory blindly when it contains many old candidates.

Preferred:

```bash
cwebp -quiet -q 82 "imgs/<accepted>.png" -o "imgs/web/<accepted>.webp"
```

Use quality 90 for photographic detail and 75-82 for diagrams/infographics. If `cwebp` is unavailable, use an ffmpeg build with libwebp. Preserve PNG originals.

Report original and compressed sizes. Do not assume the generator returned the requested dimensions.

## 8. Insert Into Both Editions

Update English and Chinese frontmatter:

```yaml
cover: imgs/web/<versioned-cover>.webp
```

Insert the clean cover once near the top and body images after the paragraphs they support:

```markdown
![Specific alt text](imgs/web/<versioned-image>.webp)
```

Use natural English and Chinese alt text. Do not insert the thumbnail into the article. Keep image order aligned across editions unless a language-specific layout requires a documented exception.

## 9. Visual Postmortem

Create `imgs/visual-postmortem.md`. Record:

- what worked;
- what failed;
- reusable prompt and composition patterns;
- anti-patterns to add to the global visual system;
- accepted and rejected image-stock candidates;
- actual backend behavior, dimensions, fallbacks, and cost/quality caveats;
- guidance for the next article.

Promote durable lessons into `src/content/strategy/blog-visual-system.md` or the style library. Keep article-specific details in the post directory.

## 10. Final Verification

Run the package validator after article insertion:

```bash
npx -y bun tiles/blog-production/scripts/blog-package-quality.ts \
  --dir src/content/blogs/YYYY-MM-DD \
  --slug <slug> \
  --serious \
  --require-images
```

Fix errors and review stale-media warnings. Do not publish, push, or upload without the user's authorization.
