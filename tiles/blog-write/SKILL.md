---
name: blog-write
description: Use when drafting a full blog article or content package from a plan, outline, rough notes, or content-plan.
---

# Blog Write

Draft the article and companion distribution files from a writing plan. This skill fills the old missing middle of the blog workflow.

## Output

| File | Path | Purpose |
|------|------|---------|
| English article | `src/content/blogs/YYYY-MM-DD/<slug>.md` | Primary source article |
| Chinese article | `src/content/blogs/YYYY-MM-DD/<slug>-zh.md` | Natural Simplified Chinese version |
| X post | `src/content/blogs/YYYY-MM-DD/x-post.md` | Native long-form X post |
| X standalone | `src/content/blogs/YYYY-MM-DD/x-standalone-tweet.md` | Follow-up single insight |
| Newsletter teaser | `src/content/blogs/YYYY-MM-DD/newsletter-teaser.md` | Beehiiv / LinkedIn teaser |
| YouTube script | `src/content/blogs/YYYY-MM-DD/youtube-script.md` | Slide-based script for `aaron-video-gen` |
| YouTube metadata | `src/content/blogs/YYYY-MM-DD/youtube-metadata.md` | Title, description, chapters, tags |

## Workflow

### 1. Locate the plan

Use the user's path if provided. Otherwise use the newest blog directory with one of:

1. `plan.md`
2. `content-plan.md`
3. `idea.md`

Read `src/content/strategy/x.md` and `config/aaron-studio.json` if present.

### 2. Determine the package scope

Default package:
- English article
- Chinese article
- X post
- X standalone tweet
- newsletter teaser
- YouTube script
- YouTube metadata

If the user asks for "just the article", write only the article and Chinese version.

### 3. Draft the English article

Use this frontmatter:

```yaml
---
title: "<Title>"
date: YYYY-MM-DD
slug: <slug>
tags: [tag-one, tag-two]
---
```

Writing rules:
- Lead with a concrete scene, tension, or result.
- Use "I" voice when the plan has personal evidence.
- Preserve the plan's thesis but improve phrasing.
- Avoid generic AI-influencer language.
- Sections should be readable without the plan.
- Use local image paths only after images already exist; otherwise leave no image placeholders.
- End with the CTA from the plan/content-plan.

### 4. Draft the Chinese version

Create a natural Simplified Chinese adaptation, not a literal translation.

Rules:
- Keep technical proper nouns in English when natural.
- Preserve examples, argument order, and CTA.
- Translate image alt text if images are present.
- Keep frontmatter fields aligned with the English source.

### 5. Draft distribution files

`x-post.md`:
- Native long-form post.
- No link in the main post.
- Strong hook in first 2 lines.
- Same CTA rotation as the plan.

`x-standalone-tweet.md`:
- One sharp insight from the post.
- Include an image idea.

`newsletter-teaser.md`:
- Short plain-text teaser.
- Ends with the blog URL placeholder if the final URL is not known.

`youtube-script.md`:
- Use the `aaron-video-gen` slide format, not the `yt-script-writer` scene format.
- Include `## [HOOK]`.
- Use meaningful slide titles.
- Reference likely images in `imgs/` when present; otherwise use planned filenames.

`youtube-metadata.md`:
- Title options.
- Description.
- Tags.
- Chapter timestamps as approximate if the final video does not exist yet.

### 6. Quality checks

Before finishing:
- No `TBD`, `TODO`, or `[...]` placeholders except an explicit `[blog URL]` in social copy.
- English and Chinese slugs match.
- Every generated file is under the same date directory.
- `youtube-script.md` has at least one `## [SLIDE:` section.
- `x-post.md` does not put the blog link in the main post.

### 7. Handoff

Report:

```text
Blog package drafted
Article: src/content/blogs/YYYY-MM-DD/<slug>.md
Chinese: src/content/blogs/YYYY-MM-DD/<slug>-zh.md
Distribution: x-post.md, x-standalone-tweet.md, newsletter-teaser.md
Video: youtube-script.md, youtube-metadata.md
Next: run blog-illustrate, then aaron-video-gen, then publish-to-blog.
```

## Codex Compatibility

Use local file reads and plain-text confirmations. Do not depend on Claude-only `AskUserQuestion`. If a tool-specific confirmation UI exists, it may be used, but the workflow must still work in Codex without it.
