---
name: publish-to-blog
description: Publishes blog posts from aaron-studio to the aaronguoblog Nuxt 3 site. Handles frontmatter generation, image copying, path rewriting, and sequential numbering.
---

# Publish to Blog

Publishes blog posts from the aaron-studio content repository to the aaronguoblog Nuxt 3 site. Handles frontmatter generation, image copying, path rewriting, and sequential numbering.

## Source & Destination

Prefer `config/aaron-studio.json` when present. Current default paths:

| Location | Path |
|----------|------|
| Content repo | `src/content/blogs/` |
| Blog site | `/Users/aaronguo/Work/ag/blog/aaronguoblog/` |
| Blog posts dir | `/Users/aaronguo/Work/ag/blog/aaronguoblog/content/blogs/en/` |
| Blog zh posts dir | `/Users/aaronguo/Work/ag/blog/aaronguoblog/content/blogs/zh/` |
| Blog images dir | `/Users/aaronguo/Work/ag/blog/aaronguoblog/public/blogs-img/` |

## Workflow

### Step 1: Identify the source post

The user will provide a path to a blog post markdown file in `src/content/blogs/YYYY-MM-DD/`. Read the file and identify:
- The article title (from the `#` heading)
- The date (from the directory name `YYYY-MM-DD`)
- The canonical `category` from frontmatter when present
- Associated images in the `imgs/` subdirectory

### Canonical blog taxonomy

Every published post must include exactly one `category` from this controlled list. Preserve a valid source category; if it is missing, infer the closest one from the article thesis. Do not invent new category IDs.

| Category ID | Use for |
|-------------|---------|
| `ai-native-systems` | AI-native tools, agents, models, AI work systems, prompt/workflow/control surfaces |
| `product-execution` | Product building, engineering execution, workflow implementation, shipping systems |
| `business-strategy` | Markets, customers, sales, finance, strategy, judgment, leadership, commercial insight |
| `personal-operating-system` | Personal systems, learning, career, attention, energy, long-term capability building |
| `creation-media` | Writing, content production, creator work, blog/video/media workflows |

Use `tags` as 2-4 specific search keywords. Tags are not reader-facing navigation categories.

### Step 2: Determine the next post number

First search both language directories for the target slug.

- If the slug already exists, preserve its current post number and stable public route. Update the existing English and Chinese files in place.
- If the slug does not exist, list files in `content/blogs/en/`. Posts are named `{number}.{slug}.md`; find the highest number and increment by 1.

Never create a second post number merely because a previously copied article is being rewritten.

### Step 3: Copy and rename images

Copy the accepted cover and the images actually referenced by the final English/Chinese articles from the source `imgs/web/` directory to the blog site's `public/blogs-img/` directory. Copy distribution-only assets such as social or video covers only when the user asks for them.

**Naming convention:**
- Cover image: `{YYYY-MM-DD}-{short-slug}-cover.webp`
- Other images: `{YYYY-MM-DD}-{short-slug}-{NN}.webp` (sequential: 01, 02, 03...)

Where `{short-slug}` is a 1-2 word kebab-case identifier for the post (e.g., `marriott`, `ai-native`).

Do not copy rejected candidates, archived replacements, contact sheets, prompt files, or unreferenced historical images into the public blog directory.

### Step 4: Create the English blog post

Create `{nextNumber}.{slug}.md` in the blog site's `content/blogs/en/` directory.

**Required YAML frontmatter:**

```yaml
---
title: 'Post Title Here'
date: DDth MMM YYYY
description: '1-2 sentence description of the post'
image: /blogs-img/{cover-image-filename}
alt: 'Descriptive alt text for the cover image'
ogImage: /blogs-img/{cover-image-filename}
category: business-strategy
tags: ['tag1', 'tag2', 'tag3']
published: true
---
```

Quote all human-written YAML strings (`title`, `description`, `alt`, and Chinese equivalents), especially when they may contain colons, commas, apostrophes, or non-ASCII punctuation. If a value contains an apostrophe, use double quotes or escape it so Nuxt Content can parse the file.

**Date format:** Use ordinal suffixes — `1st`, `2nd`, `3rd`, `4th`...`11th`, `12th`, `13th`, `21st`, `22nd`, `23rd`, `31st`. Month abbreviated to 3 letters. Example: `14th Feb 2026`.

**Content transformations:**
1. Remove the `# Title` heading (title comes from frontmatter)
2. **Remove the cover image from body content.** The cover image (`00-cover.*`) is already displayed as the blog banner via the `image` frontmatter field. Do NOT include it again in the markdown body — it creates a repetitive experience for readers.
3. Rewrite all remaining image paths from `imgs/{filename}` to `/blogs-img/{new-filename}`
4. Rewrite internal source-post markdown links such as `../YYYY-MM-DD/source-slug.md` to public blog routes:
   - English posts use `/blogs/{published-slug}`
   - Chinese posts use `/zh/blogs/{published-slug}`
   - If the linked source post has not been published into the blog repo, do not leave a broken link. Either remove the markdown link while keeping the reference text, or stop and ask whether to publish/link that source.
5. Keep all other markdown content as-is

### Step 5: Create the Chinese translation

**Always create a Chinese version** alongside the English post.

#### 5a: Create the Chinese source file in the content repo

Save as `src/content/blogs/YYYY-MM-DD/{slug}-zh.md`. This is a full Chinese translation of the article:
- Translate the title, all body text, image alt text, and closing text
- Keep image references using the local `imgs/` paths (same as the English source)
- Keep all markdown formatting (headers, bold, lists, etc.)
- Use natural, fluent Simplified Chinese — not word-for-word translation
- Keep English proper nouns (brand names, technical terms) as-is when appropriate

#### 5b: Publish the Chinese version to the blog site

Create `{nextNumber}.{slug}.md` in the blog site's `content/blogs/zh/` directory.

**Same post number as the English version** so they are linked as translations.

**Chinese frontmatter:**

```yaml
---
title: 中文标题
date: DDth MMM YYYY
description: '1-2 句中文描述'
image: /blogs-img/{cover-image-filename}
alt: '中文图片描述'
ogImage: /blogs-img/{cover-image-filename}
category: business-strategy
tags: ['中文标签1', '中文标签2']
published: true
---
```

**Content transformations (same as English):**
1. Remove the `# Title` heading
2. Rewrite image paths from `imgs/` to `/blogs-img/`
3. Rewrite internal source-post markdown links to `/zh/blogs/{published-slug}` routes, and validate that the target Chinese post exists.
4. Translate image alt text to Chinese

### Step 6: Verify

1. Confirm both English and Chinese post files exist with valid frontmatter
2. Confirm both use the same post number
3. Confirm all referenced images exist in `public/blogs-img/`
4. Confirm all internal markdown links use public blog routes, not source-relative paths like `../YYYY-MM-DD/*.md`
5. Run the local link validator **from the aaron-studio content repo**, where `config/aaron-studio.json` is available:

```bash
node scripts/validate-blog-links.mjs \
  <blog-repo>/content/blogs/en/{number}.{slug}.md \
  <blog-repo>/content/blogs/zh/{number}.{slug}.md
```

The validator must pass before reporting that the local blog copy is ready.
6. Start or reuse the blog dev server. Reuse an existing process only after confirming it belongs to the target blog repo and returns a healthy page; restart a stale process rather than accepting a cached 500 response.
7. Run browser-rendered QA for both public routes:
   - the expected H1, description, category, and language switch render;
   - the cover appears once and is not duplicated in the Markdown body;
   - every body image loads after normal lazy-loading scroll and has non-zero natural dimensions;
   - the expected section count and table/framework content render;
   - internal links resolve in the matching language;
   - there is no horizontal overflow at the checked viewport and no browser console error.
8. Leave the requested local preview page open and report the post number, slug, image count, link-validation result, browser-QA result, and preview URLs.

### Step 8: Update growth analytics catalog

After the post files have been written and verified, update the blog growth
catalog from the configured blog repo:

```bash
node scripts/blog-growth.mjs ingest-after-publish --dry-run
node scripts/blog-growth.mjs ingest-after-publish
```

If the user wants an immediate new-post Rybbit window, include the published
slug and date window:

```bash
node scripts/blog-growth.mjs ingest-after-publish \
  --start YYYY-MM-DD \
  --end YYYY-MM-DD \
  --slugs <slug>
```

After publish, continue the reinforcement loop:

1. Run `node scripts/blog-growth.mjs ingest-after-publish`.
2. Create or update `distribution.json` when LinkedIn, YouTube, newsletter, or X artifacts exist. Include `slug`, plus a `posts` array with channel, channel post id or URL, title, language, post type, CTA type, and publish date.
3. Run `node scripts/blog-growth.mjs register-channel-posts --file <distribution.json>` when the manifest exists.
4. Plan the 24h and 7d postmortem commands:

```bash
node scripts/blog-growth.mjs postmortem --slug <slug> --window 24h
node scripts/blog-growth.mjs postmortem --slug <slug> --window 7d
```

Use dry-run first if channel data is incomplete:

```bash
node scripts/blog-growth.mjs postmortem --slug <slug> --window 7d --dry-run
```

## Example

**Input:** `src/content/blogs/2026-02-14/marriott-timeshare-las-vegas.md`

**Output:**
- English post: `content/blogs/en/14.marriott-timeshare-las-vegas.md`
- Chinese source: `src/content/blogs/2026-02-14/marriott-timeshare-las-vegas-zh.md`
- Chinese post: `content/blogs/zh/14.marriott-timeshare-las-vegas.md`
- Images: `public/blogs-img/2026-02-14-marriott-cover.png`, `2026-02-14-marriott-01.png`, etc.

## Notes

- The blog site is a Nuxt 3 app using `@nuxt/content` v3
- Posts are deployed automatically when pushed to `main` via GitHub Actions
- Do NOT push to the blog repo unless the user explicitly asks
- Always set `published: true` unless the user says otherwise
- Generate a meaningful description from the article content for SEO
- Choose one canonical `category` from the controlled taxonomy; never invent ad hoc category names
- Choose relevant tags based on article content (English: lowercase kebab-case; Chinese: Chinese terms)
