---
name: blog-illustrate
description: Illustrate a blog post with AI-generated images (cover + content illustrations) and compress to WebP. Use when user asks to "illustrate blog", "add images to blog", "generate illustrations", "配图", or "生成博客图片".
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
├── outline.md
└── web/                      ← WebP compressed versions
    ├── 00-cover.webp
    ├── 00-cover-thumbnail.webp
    ├── 01-{type}-{slug}.webp
    └── ...
```

Blog markdown references `imgs/web/*.webp`. Originals in `imgs/*.png` kept for archival.

---

## Workflow

```
- [ ] Step 1: Load preferences & detect article
- [ ] Step 2: Analyze content
- [ ] Step 3: Confirm settings
- [ ] Step 4: Generate outline (always includes 00-cover)
- [ ] Step 5: Generate all images (cover → thumbnail → content)
- [ ] Step 6: Compress to WebP
- [ ] Step 7: Insert into blog & finalize
```

---

### Step 1: Load Preferences & Detect Article

**Load EXTEND.md** (same as baoyu-article-illustrator):
```bash
test -f .baoyu-skills/baoyu-article-illustrator/EXTEND.md && cat .baoyu-skills/baoyu-article-illustrator/EXTEND.md
```

**Detect article path** — from user's argument or ask:
- If path provided: use it directly
- If not provided: look for the most recently modified `.md` file in `src/content/blogs/`

**Detect blog date dir** from article path, e.g. `src/content/blogs/2026-03-08/`.

**Create output dir:**
```bash
mkdir -p src/content/blogs/YYYY-MM-DD/imgs/web
mkdir -p src/content/blogs/YYYY-MM-DD/imgs/prompts
```

---

### Step 2: Analyze Content

Read the full article. Identify:
- Content type (technical / narrative / tutorial / opinion)
- Core sections and their purpose
- 3-6 positions where illustrations add value
- Cover concept: what single image would best represent the post's theme and stop the scroll
- **Blog title** (from frontmatter `title:`) — used for the thumbnail headline

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

### Step 3: Confirm Settings

Use ONE `AskUserQuestion` (max 4 questions):

| Q | Question | Options |
|---|----------|---------|
| Q1 | Illustration type | Mixed (Recommended), infographic, scene, flowchart, comparison, framework |
| Q2 | Visual style | notion (Recommended), vector-illustration, editorial, sci-fi, hand-drawn |
| Q3 | Density (content illustrations, excluding cover) | Balanced 3-5 (Recommended), Minimal 1-2, Rich 6+ |

Cover is always generated regardless of density setting.

---

### Step 4: Generate Outline

Save to `src/content/blogs/YYYY-MM-DD/imgs/outline.md`.

**ALWAYS include `00-cover` as the first entry:**

```markdown
---
type: [mixed/infographic/etc]
density: [minimal/balanced/rich]
style: [style name]
image_count: [N+1 total including cover]
article: [article path]
---

## Cover Image
**Position**: Top of article (frontmatter cover + first image in body)
**Type**: scene or editorial
**Purpose**: Stop the scroll — visually capture the post's core theme
**Visual Content**: [Specific scene/concept that represents the post. Think: what image would make someone stop scrolling? Avoid generic tech imagery.]
**Style note**: Cover can use a different style from content illustrations — often more atmospheric/editorial works better for covers
**Filename**: 00-cover.png

## Illustration 1
**Position**: [section/paragraph]
**Type**: [type]
**Purpose**: [why]
**Visual Content**: [what]
**Filename**: 01-{type}-{concept}.png

## Illustration 2
...
```

---

### Step 5: Generate Images

Generate sequentially using `baoyu-image-gen` skill (via Bash):

```bash
SKILL_DIR=".claude/skills/tessl__baoyu-image-gen"
npx -y bun "${SKILL_DIR}/scripts/main.ts" \
  --prompt "[full prompt]" \
  --image "src/content/blogs/YYYY-MM-DD/imgs/NN-type-slug.png" \
  --ar 16:9
```

**Cover prompt guidelines (`00-cover.png`):**
- More atmospheric/editorial than content illustrations
- Dark or dramatic background works well for covers
- Should feel like a magazine cover or book jacket
- Concept: visualize the *feeling* of the post, not just its content
- **No text in image** — the clean version is used as the blog post header

**After generating `00-cover.png`, immediately generate `00-cover-thumbnail.png`:**

This is the same visual but with the blog title baked in as a bold headline — used as YouTube thumbnail.

```bash
SKILL_DIR=".claude/skills/tessl__baoyu-image-gen"
npx -y bun "${SKILL_DIR}/scripts/main.ts" \
  --prompt "[thumbnail prompt — see below]" \
  --image "src/content/blogs/YYYY-MM-DD/imgs/00-cover-thumbnail.png" \
  --ar 16:9 \
  --provider openai
```

**Thumbnail prompt template:**

```
YouTube thumbnail. [Reuse the same visual scene/atmosphere from the cover prompt].

LEFT SIDE — bold readable text layout, left-aligned:
- Small top line in cyan: "[eyebrow]"
- Large bold white text: "[body line]"
- Large bold amber/gold text: "[hero word]"
- Small muted grey text below: "[subtitle e.g. 'with AI']"

RIGHT SIDE: [main visual scene]. Dark atmospheric background. Cinematic, high contrast.
No other text. No UI chrome. No watermarks.
```

Rules for thumbnail generation:
- Always use `--provider openai` — OpenAI renders text far more reliably than Google
- The left zone must be dark enough for white/gold text to be legible
- Keep the same atmosphere/scene as `00-cover` for visual consistency
- The text layout is the ONLY difference from `00-cover`

**Content illustration guidelines:**
- Follow the style chosen in Step 3
- Stick to the outline's Visual Content description
- Keep consistent visual language across all content illustrations

Save each prompt to `src/content/blogs/YYYY-MM-DD/imgs/prompts/NN-{slug}.md` for future reference.

Retry once on failure. Report any that fail after retry.

---

### Step 6: Compress to WebP

After ALL images are generated, run:

```bash
./scripts/compress-blog-imgs.sh src/content/blogs/YYYY-MM-DD
```

If the script doesn't exist yet:
```bash
# Fallback: run cwebp directly
mkdir -p src/content/blogs/YYYY-MM-DD/imgs/web
for f in src/content/blogs/YYYY-MM-DD/imgs/*.png; do
  name=$(basename "$f" .png)
  cwebp -q 82 "$f" -o "src/content/blogs/YYYY-MM-DD/imgs/web/${name}.webp" 2>/dev/null
done
```

Show compression results (original KB → compressed KB, savings %).

---

### Step 7: Insert into Blog & Finalize

**Add cover to frontmatter and top of article:**
```markdown
---
...
cover: imgs/web/00-cover.webp
---

![{post title}](imgs/web/00-cover.webp)
```

`00-cover-thumbnail.webp` is NOT inserted into the blog — it's for YouTube / social use only.

**Insert content illustrations** after their target paragraphs:
```markdown
![{alt text}](imgs/web/NN-type-slug.webp)
```

All paths use `imgs/web/*.webp`.

**Print completion summary:**
```
Blog Illustration Complete!

Article: [path]
Style: [style] | Type: [type] | Density: [level]
Images: [N] generated + compressed

Files:
  imgs/00-cover.png           → imgs/web/00-cover.webp          (blog header)
  imgs/00-cover-thumbnail.png → imgs/web/00-cover-thumbnail.webp (YouTube thumbnail)
  imgs/01-....png             → imgs/web/01-....webp
  ...

Total size: [X]MB → [Y]KB (-Z%)

Next steps:
1. Review images — regenerate any that miss the mark
2. Use 00-cover-thumbnail.webp as YouTube thumbnail
3. Write X post (use X post brief in content-plan.md)
4. Publish with /publish-to-blog
```

---

## Notes

- Cover style can differ from content illustrations — atmospheric/editorial covers often work better than matching the content style exactly
- `00-cover.png` = clean (no text) → blog header. `00-cover-thumbnail.png` = title overlay → YouTube thumbnail. Two separate files, both always generated.
- Thumbnail always uses `--provider openai` — OpenAI renders legible text; Google/DashScope do not reliably
- If `cwebp` is not installed: `brew install webp`
- Quality default is 82. Use 90 for photos, 75 for diagrams/infographics
- Originals in `imgs/*.png` are never deleted — safe to regenerate WebP anytime
- To regenerate a single image: use `baoyu-image-gen` directly, then re-run compression script
- To regenerate only the thumbnail (e.g. title changed): re-run the thumbnail prompt in Step 5 with `--provider openai`, then re-run compression
