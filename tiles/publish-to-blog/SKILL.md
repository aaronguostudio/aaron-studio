# Publish to Blog

Publishes blog posts from the aaron-studio content repository to the aaronguoblog Nuxt 3 site. Handles frontmatter generation, image copying, path rewriting, and sequential numbering.

## Source & Destination

| Location | Path |
|----------|------|
| Content repo | `/Users/aguo/aaron/aaron-studio/src/blogs/` |
| Blog site | `/Users/aguo/Work/ag/aaronguoblog/` |
| Blog posts dir | `/Users/aguo/Work/ag/aaronguoblog/content/blogs/en/` |
| Blog images dir | `/Users/aguo/Work/ag/aaronguoblog/public/blogs-img/` |

## Workflow

### Step 1: Identify the source post

The user will provide a path to a blog post markdown file in `src/blogs/YYYY-MM-DD/`. Read the file and identify:
- The article title (from the `#` heading)
- The date (from the directory name `YYYY-MM-DD`)
- Associated images in the `imgs/` subdirectory

### Step 2: Determine the next post number

List files in the blog site's `content/blogs/en/` directory. Posts are named `{number}.{slug}.md`. Find the highest number and increment by 1.

### Step 3: Copy and rename images

Copy all illustration images (`.png`, `.jpg`, `.webp`) from the source `imgs/` directory to the blog site's `public/blogs-img/` directory.

**Naming convention:**
- Cover image: `{YYYY-MM-DD}-{short-slug}-cover.png`
- Other images: `{YYYY-MM-DD}-{short-slug}-{NN}.png` (sequential: 01, 02, 03...)

Where `{short-slug}` is a 1-2 word kebab-case identifier for the post (e.g., `marriott`, `ai-native`).

**Skip non-illustration files** like `outline.md` and the `prompts/` directory.

### Step 4: Create the English blog post

Create `{nextNumber}.{slug}.md` in the blog site's `content/blogs/en/` directory.

**Required YAML frontmatter:**

```yaml
---
title: 'Post Title Here'
date: DDth MMM YYYY
description: 1-2 sentence description of the post
image: /blogs-img/{cover-image-filename}
alt: Descriptive alt text for the cover image
ogImage: /blogs-img/{cover-image-filename}
tags: ['tag1', 'tag2', 'tag3']
published: true
---
```

**Date format:** Use ordinal suffixes — `1st`, `2nd`, `3rd`, `4th`...`11th`, `12th`, `13th`, `21st`, `22nd`, `23rd`, `31st`. Month abbreviated to 3 letters. Example: `14th Feb 2026`.

**Content transformations:**
1. Remove the `# Title` heading (title comes from frontmatter)
2. **Remove the cover image from body content.** The cover image (`00-cover.*`) is already displayed as the blog banner via the `image` frontmatter field. Do NOT include it again in the markdown body — it creates a repetitive experience for readers.
3. Rewrite all remaining image paths from `imgs/{filename}` to `/blogs-img/{new-filename}`
4. Keep all other markdown content as-is

### Step 5: Create the Chinese translation

**Always create a Chinese version** alongside the English post.

#### 5a: Create the Chinese source file in the content repo

Save as `src/blogs/YYYY-MM-DD/{slug}-zh.md`. This is a full Chinese translation of the article:
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
description: 1-2 句中文描述
image: /blogs-img/{cover-image-filename}
alt: 中文图片描述
ogImage: /blogs-img/{cover-image-filename}
tags: ['中文标签1', '中文标签2']
published: true
---
```

**Content transformations (same as English):**
1. Remove the `# Title` heading
2. Rewrite image paths from `imgs/` to `/blogs-img/`
3. Translate image alt text to Chinese

### Step 6: Verify

1. Confirm both English and Chinese post files exist with valid frontmatter
2. Confirm both use the same post number
3. Confirm all referenced images exist in `public/blogs-img/`
4. Report the post number, slug, and image count

## Example

**Input:** `src/blogs/2026-02-14/marriott-timeshare-las-vegas.md`

**Output:**
- English post: `content/blogs/en/14.marriott-timeshare-las-vegas.md`
- Chinese source: `src/blogs/2026-02-14/marriott-timeshare-las-vegas-zh.md`
- Chinese post: `content/blogs/zh/14.marriott-timeshare-las-vegas.md`
- Images: `public/blogs-img/2026-02-14-marriott-cover.png`, `2026-02-14-marriott-01.png`, etc.

## Notes

- The blog site is a Nuxt 3 app using `@nuxt/content` v3
- Posts are deployed automatically when pushed to `main` via GitHub Actions
- Do NOT push to the blog repo unless the user explicitly asks
- Always set `published: true` unless the user says otherwise
- Generate a meaningful description from the article content for SEO
- Choose relevant tags based on article content (English: lowercase kebab-case; Chinese: Chinese terms)
