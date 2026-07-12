---
name: blog-illustrate
description: Use when a blog workflow needs cover, thumbnail, or content illustrations, or when the user asks to illustrate a blog, add images, generate illustrations, 配图, or 生成博客图片.
---

# Blog Illustrate

Generate a full illustration set for a blog post: cover image, content illustrations, and automatic WebP compression. Follows Aaron Studio conventions.

## What This Skill Does vs baoyu-article-illustrator

| | baoyu-article-illustrator | blog-illustrate (this skill) |
|---|---|---|
| Output dir | `illustrations/{slug}/` | `src/content/blogs/YYYY-MM-DD/imgs/` ✅ |
| Cover image | Not generated | Always generates `00-cover` ✅ |
| Cover thumbnail | Not generated | Always generates `00-cover-thumbnail` with title ✅ |
| WebP compression | Not included | Auto-runs after generation ✅ |
| Blog MD paths | `illustrations/...png` | `imgs/web/...webp` ✅ |

## Output

```
src/content/blogs/YYYY-MM-DD/imgs/
├── 00-cover.png              ← clean cover (no text) — used as blog header
├── 00-cover-thumbnail.png    ← cover + bold title text — used as YouTube thumbnail
├── 01-{type}-{slug}.png
├── 02-{type}-{slug}.png
├── ...
├── visual-strategy.md        ← article-level visual judgment
├── style-directions.md       ← recommended style menu and cohesion decision
├── mode-mix.md               ← per-image visual mode, style family, and weight plan
├── style.md                  ← post-specific visual direction
├── outline.md                ← image outline with visual predicates
├── visual-critique.md        ← accepted/rejected/regenerate decisions
├── generation-manifest.md    ← backend, prompt, candidate, selection, and provenance record
├── visual-postmortem.md      ← reusable visual lessons
├── prompts/
│   └── NN-{slug}.md
└── web/                      ← WebP compressed versions
    ├── 00-cover.webp
    ├── 00-cover-thumbnail.webp
    ├── 01-{type}-{slug}.webp
    └── ...
```

Blog markdown references `imgs/web/*.webp`. Originals in `imgs/*.png` kept for archival.

---

## Quality Standard

Images are not decoration. Each accepted image must either clarify an argument, make an abstract mechanism visible, or create a strong first impression.

Blog Illustration 3.0 is judgment-first, not prompt-first. Before writing image prompts, load `src/content/strategy/blog-visual-system.md`, load `src/content/strategy/blog-visual-style-library.md`, create `visual-strategy.md`, compare three genuinely different concept routes, create `style-directions.md`, and create `mode-mix.md`.

Concept comes before style. A style menu cannot rescue a weak or generic metaphor. Compare different predicates and compositions first; only then decide how the selected concept should look.

Core rule: Style is pacing, not skin. Do not apply one visual treatment to every image. Choose visual modes by article character, image role, and visual weight.

Style is a collaborative decision. For each article, recommend a Style Direction Menu before writing prompts. Aaron should be able to choose whether the set uses one coherent style, a controlled mix, or an experimental mix. Do not silently choose one style family for the whole article unless Aaron already specified it or explicitly delegated that decision.

Style family is not the same as visual mode. Visual mode decides the image job, such as `Operator Diagram` or `Human-Scale Metaphor`. Style family decides the language, such as `Infographic Editorial`, `Cartoon Briefing`, `Executive Brief`, `Data Poster`, or `Cutaway System Map`. Hard rule: do not treat visual mode as style family.

When Aaron asks to explore, compare, test, or make styles more different, enter **Style Probe Mode** before producing a final set. Generate 3-6 visibly different probes using the style library, keep prior final images untouched, and write a short style-probe critique before recommending winners.

Every body image needs one visual predicate: the single action or relation the image is allowed to show. If an image needs two predicates, split it or simplify it.

Default quality bar:
- Before the outline, define a post-specific style brief from `src/content/strategy/visual-language.md`. Do not skip directly from article analysis to image prompts.
- In Codex, use the built-in image generator by default and save accepted project assets into the post directory. Use the baoyu CLI path when the built-in tool is unavailable or Aaron explicitly asks for the reusable CLI/batch path. Record the backend and any fallback in `generation-manifest.md`.
- Cover and thumbnail need at least two candidates, then choose the strongest one after visual inspection.
- Before those candidates, compare at least three distinct cover concepts. Different palettes or render styles do not count as different concepts.
- Body illustrations need distinct jobs, but most should be narrative/metaphor images rather than diagrams.
- Use a 70 / 20 / 10 density budget for normal blog posts: roughly 70% narrative or metaphor, 20% light conceptual diagrams, 10% dense mechanism diagrams.
- Reject images with unreadable text, cluttered diagrams, awkward hands/faces, generic stock-photo energy, dense chart walls, glowing AI dashboards, sci-fi HUDs, or no clear connection to the surrounding section.
- Prefer human-scale scenes, symbolic metaphors, light editorial diagrams, and moments tied to Aaron's lived example.
- Treat the 2026-06-20 `ai-became-my-operating-system` set as the current default baseline for Aaron's visual brand: flat editorial composition, human-scale metaphor, restrained liquid-glass accents, and only occasional diagrams.
- If a family scene is generated, match Aaron's known family shape by default: Aaron, his wife, and their daughter. Do not add a fourth person unless requested.

## Workflow

```
- [ ] Step 1: Load preferences, visual language, blog visual system, and style library
- [ ] Step 2: Detect article and analyze content
- [ ] Step 3: Create visual-strategy.md
- [ ] Step 3a: Compare three concept routes and record the selected visual predicate
- [ ] Step 4: Create style-directions.md and record Aaron's style cohesion decision
- [ ] Step 5: Create mode-mix.md
- [ ] Step 6: Define post-specific visual direction in style.md
- [ ] Step 7: Generate outline.md with visual mode, visual weight, visual style family, and visual predicate
- [ ] Step 8: Write prompt pack
- [ ] Step 9: Generate candidates
- [ ] Step 9a: Record backend, prompts, candidates, and selections in generation-manifest.md
- [ ] Step 10: Write visual-critique.md and regenerate failed images
- [ ] Step 11: Compress to WebP
- [ ] Step 12: Insert accepted images into blog
- [ ] Step 13: Write visual-postmortem.md
```

---

### Step 1: Load Preferences, Visual Language, and Blog Visual System

**Load EXTEND.md** (same as baoyu-article-illustrator):
```bash
test -f .baoyu-skills/baoyu-article-illustrator/EXTEND.md && cat .baoyu-skills/baoyu-article-illustrator/EXTEND.md
```

This load is mandatory when the file exists. If it is missing, state that explicitly and continue with Aaron's defaults. Do not skip this check.

**Choose and record the generation backend.** In Codex, prefer the built-in `image_gen` tool. Read the installed `imagegen` skill before generation. For other hosts, or when Aaron explicitly requests CLI/batch generation, resolve the baoyu image generator directory from the first existing path:
```bash
for d in \
  .claude/skills/tessl__baoyu-image-gen \
  .codex/skills/tessl__baoyu-image-gen \
  .agents/skills/tessl__baoyu-image-gen \
  .baoyu-skills/baoyu-image-gen; do
  test -d "$d" && echo "$d" && break
done
```

Use the resolved directory as `BAOYU_IMAGE_GEN_DIR`. If neither built-in image generation nor a baoyu path exists, report the missing dependency before continuing. Do not switch providers silently.

**Load Aaron visual language:**
```bash
test -f src/content/strategy/visual-language.md && cat src/content/strategy/visual-language.md
```

This file is mandatory for Aaron Studio blog work. If it is missing, create or restore it before generating image prompts.

**Load Aaron blog visual system:**
```bash
test -f src/content/strategy/blog-visual-system.md && cat src/content/strategy/blog-visual-system.md
```

This file is mandatory for Blog Illustration 2.0. If it is missing, create or restore it before generating image prompts.

**Load Aaron visual style library:**
```bash
test -f src/content/strategy/blog-visual-style-library.md && cat src/content/strategy/blog-visual-style-library.md
```

This file is mandatory for style-family selection and Style Probe Mode. If it is missing, create or restore it before generating image prompts.

---

### Step 2: Detect Article and Analyze Content

**Detect article path** — from user's argument or ask:
- If path provided: use it directly
- If not provided: choose the most recently modified published article markdown file, not workflow artifacts
  - Search only top-level files matching `src/content/blogs/YYYY-MM-DD/*.md`
  - Exclude `imgs/**`, `video/**`, `prompts/**`, and internal workflow artifacts such as `research-dossier.md`, `argument-memo.md`, `content-plan.md`, `editorial-brief.md`, `plan.md`, `postmortem.md`, `youtube-script.md`, and social teaser files
  - Prefer files with article frontmatter such as `title:` and a slug-like filename; when both `<slug>.md` and `<slug>-zh.md` exist, default to `<slug>.md` unless the user asked for Chinese
  - If multiple candidates remain, ask the user to choose rather than guessing from generated artifact timestamps

**Detect blog date dir** from article path, e.g. `src/content/blogs/2026-03-08/`.

**Create output dir:**
```bash
mkdir -p src/content/blogs/YYYY-MM-DD/imgs/web
mkdir -p src/content/blogs/YYYY-MM-DD/imgs/prompts
```

Read the full article. Identify:
- Content type (technical / narrative / tutorial / opinion)
- Core sections and their purpose
- 3-6 positions where illustrations add value
- Cover concept: what single image would best represent the post's theme and stop the scroll
- **Blog title** (from frontmatter `title:`)
- **Thumbnail title language** — Aaron usually publishes and distributes the main article in English. If the blog date dir contains an English article for the same slug (`<slug>.md`, not `*-zh.md`), default the thumbnail headline to that English article's title even when the current article path is Chinese. Use a Chinese headline only when no English article exists or Aaron explicitly asks for a Chinese thumbnail. Use bilingual only when Aaron explicitly asks for bilingual or when the distribution target is clearly bilingual.

**Design the thumbnail headline** — split the title into 3 lines for visual impact:

| Line | Role | Style | Example |
|------|------|-------|---------|
| Eyebrow | Short action/context phrase | Small, cyan | "I Engineered" |
| Body | The subject | Large, white bold | "the Law of" |
| Hero | The most impactful word or phrase | Largest, amber/gold | "Attraction" |

Rules for splitting:
- Hero word = the noun or concept that carries the most emotional/intellectual weight
- Eyebrow = a short verb phrase (1-3 words) — the "I did X" part
- Body = whatever connects eyebrow to hero
- If the title doesn't split naturally into 3, use 2 lines (body + hero)

---

### Step 3: Create Visual Strategy

Create `src/content/blogs/YYYY-MM-DD/imgs/visual-strategy.md` from `tiles/blog-illustrate/templates/visual-strategy.md`.

The strategy must classify article character, reader emotion, visual risk, recommended mode mix, cover direction, body image direction, framework/diagram direction, and what to avoid.

It must also map the argument beats that actually need images and propose three different concept routes. Each route must use a different central predicate and composition. Record Aaron's selection, or `Agent-selected` with rationale when Aaron delegated the decision. Cut any planned image that cannot explain what the reader loses without it.

Do not write image prompts before this file exists.

---

### Step 4: Create Style Direction Menu

Create `src/content/blogs/YYYY-MM-DD/imgs/style-directions.md` from `tiles/blog-illustrate/templates/style-directions.md`.

Use the article, visual strategy, and Aaron's visual system to recommend 3-5 style directions. Each direction must include:
- style family name;
- visual character;
- best use in this article, such as cover, body metaphor, framework, diagram, or thumbnail;
- why it fits the article;
- risks or failure modes;
- whether it can carry the whole post or should only be used as an accent.

Only recommend styles for the concept already selected in `visual-strategy.md`. Do not present the same metaphor in different palettes as strategic diversity.

Use `src/content/strategy/blog-visual-style-library.md` to populate `Style Library Candidates`. Candidate families may include `Infographic Editorial`, `Cartoon Briefing`, `Executive Brief`, `Data Poster`, `Cutaway System Map`, `Paper System Sketch`, `Editorial Photo Collage`, `Bento Product Artifact`, `Print / Risograph Accent`, or other article-specific families.

If Aaron asks for style exploration or very different alternatives, add a `Style Probe Menu` with 3-6 visibly different probes. The probes should differ in composition, material language, density, and tone, not merely palette. Do not replace final article images during Style Probe Mode.

Then recommend one style cohesion model:

| Cohesion model | Use when |
|---|---|
| Unified | The article needs one calm, coherent visual world and the risk of style fatigue is low. |
| Controlled Mix | The article needs one primary style plus 1-2 functional variants, usually for diagrams, thumbnails, or framework images. |
| Experimental Mix | The article is explicitly exploratory, visual, or concept-heavy enough to justify multiple distinct styles. |

In normal blog work, prefer `Controlled Mix`: one primary style family, with deliberate variants for diagrams, thumbnails, or frameworks.

Do not write `style.md`, `outline.md`, or prompt files before this style decision is recorded.

If Aaron has not already specified the style direction or delegated the decision, stop and ask Aaron to choose from the Style Direction Menu. In Codex, ask with concise plain text. Record the chosen cohesion model and selected style families in `style-directions.md`.

If Aaron explicitly delegates the decision, record `Agent-selected` in `style-directions.md`, explain why, and continue.

---

### Step 5: Create Mode Mix

Create `src/content/blogs/YYYY-MM-DD/imgs/mode-mix.md` from `tiles/blog-illustrate/templates/mode-mix.md`.

Every planned image must include role, visual mode, style family, visual weight, reason, and reuse candidate status.

Use the five Aaron visual modes:

- Editorial Minimal
- Human-Scale Metaphor
- Operator Diagram
- Real Photo Collage
- Glass / Fluent Artifact

---

### Step 6: Define Visual Style Brief

Before generating an outline, create `src/content/blogs/YYYY-MM-DD/imgs/style.md`.

Use `src/content/strategy/visual-language.md`, `imgs/style-directions.md`, and the recorded style cohesion decision as the base. Then define the post-specific style:
- base visual language;
- post-specific style name;
- selected style cohesion model;
- selected style families and which image roles they apply to;
- article thesis;
- intended reader emotion;
- real-world anchor;
- data layer meaning;
- palette;
- recurring motifs;
- image set rules;
- anti-patterns;
- quality checklist.

Use Aaron's visual language as continuity, not a mandatory preset. Select the base family from the chosen concept and article role. `Soft Glass Narrative` remains one available baseline, but do not default to it when another family makes the argument clearer or prevents visual fatigue. Preserve recognizable qualities through restraint, hierarchy, negative space, and one visual predicate rather than repeating glass, glow, or the same palette.

Do not collapse every image into the same style unless `style-directions.md` records `Unified`. If `Controlled Mix` is selected, define the primary style and the allowed variants. If `Experimental Mix` is selected, define the boundary that prevents the article from feeling random.

The image outline must reference `imgs/style.md` and every prompt must preserve that style brief.

The style brief must name the successful baseline it is adapting from or deliberately departing from, for example:

```text
Baseline: Depart from Soft Glass Narrative for this post; keep its restraint and human scale while using an editorial print system as the primary family.
```

### Confirm Settings

Ask only when the article or user request does not already determine these settings. In Codex, ask concise plain-text questions; in Claude Code, a single `AskUserQuestion` is acceptable.

| Q | Question | Options |
|---|----------|---------|
| Q1 | Illustration type | Mixed (Recommended), infographic, scene, flowchart, comparison, framework |
| Q2 | Illustration style family | Use the chosen `style-directions.md` decision; do not replace the Style Direction Menu with a generic style preset |
| Q3 | Density (content illustrations, excluding cover) | Balanced 3-5 (Recommended), Minimal 1-2, Rich 6+ |

Cover is always generated regardless of density setting.

If the user has already specified a custom style direction, use it directly and record the decision in both `imgs/style-directions.md` and `imgs/style.md` instead of asking.

---

### Steps 7-13: Generate And Deliver

Before writing `outline.md` or any prompt, read `references/generation-and-delivery.md` completely. Follow its contracts for:

- outline schema and density checks;
- prompt packs and exact-text budgets;
- generation manifest and backend selection;
- concept probes, cover candidates, and thumbnail candidates;
- semantic visual critique and contact sheets;
- accepted-only WebP compression;
- English/Chinese article insertion;
- visual postmortem and final package validation.

Do not compress, insert, or promote an image until `visual-critique.md` records `Decision: PASS`.

---

## Notes

## Phase 2: Optional Image Stock Integration

Future integration may connect blog images with `/Users/aaronguo/Work/lab/images-stock` for search, import, and publish-to-stock workflows. This is optional. Blog illustration must still run with local artifacts when image stock is unavailable.

- Cover style can differ from content illustrations — atmospheric/editorial covers often work better than matching the content style exactly
- `00-cover.png` = clean (no text) → blog header. `00-cover-thumbnail.png` = title overlay → YouTube thumbnail. Two separate files, both always generated.
- Built-in generation does not require `OPENAI_API_KEY`. On the explicit baoyu CLI path, prefer its OpenAI provider for thumbnail text; record any `codex-cli` fallback in `generation-manifest.md` and inspect text carefully.
- If `cwebp` is not installed: `brew install webp`
- Quality default is 82. Use 90 for photos, 75 for diagrams/infographics
- Originals in `imgs/*.png` are never deleted — safe to regenerate WebP anytime
- To regenerate a single image: use the backend recorded in `generation-manifest.md`, save a versioned candidate, then re-run compression.
- To regenerate only the thumbnail: reuse its recorded prompt and selected cover world, save a versioned candidate, inspect mobile readability, then re-run compression.
