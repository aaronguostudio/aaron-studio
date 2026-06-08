---
name: blog-production
description: Use when running or resuming Aaron's end-to-end blog workflow from idea to article, images, video, and publishing.
---

# Blog Production

Run the blog workflow as an orchestrator. This skill decides the next missing step and hands off to the focused skill for that step.

## Pipeline

```text
muse
  -> blog-brainstorm
  -> blog-outline
  -> blog-write
  -> blog-illustrate
  -> aaron-video-gen
  -> publish-to-blog
  -> yt-publish
```

## Artifact Contract

Each post lives in `src/content/blogs/YYYY-MM-DD/`.

| Artifact | Meaning | Producing skill |
|----------|---------|-----------------|
| `idea.md` | Raw idea or seed | manual / muse |
| `content-plan.md` | researched content plan | blog-brainstorm |
| `plan.md` | writing-ready outline | blog-outline |
| `<slug>.md` | English article | blog-write |
| `<slug>-zh.md` | Chinese article | blog-write |
| `x-post.md` | long-form X post | blog-write |
| `x-standalone-tweet.md` | follow-up X post | blog-write |
| `newsletter-teaser.md` | Beehiiv / LinkedIn teaser | blog-write |
| `imgs/outline.md` | illustration plan | blog-illustrate |
| `imgs/web/00-cover.webp` | blog cover | blog-illustrate |
| `youtube-script.md` | slide video script | blog-write |
| `video.mp4` | generated YouTube video | aaron-video-gen |
| `youtube-metadata.md` | YouTube title/description/tags | blog-write / aaron-video-gen |

## Workflow

### 1. Pick the post directory

Use the user's path if provided. Otherwise choose the newest directory under `src/content/blogs/`.

Read:
- `config/aaron-studio.json`
- `src/content/strategy/x.md`
- all files in the chosen post directory

### 2. Detect the next step

Use the first matching missing artifact:

| Missing | Next action |
|---------|-------------|
| no directory or only rough prompt | use `muse` or create `idea.md` |
| no `content-plan.md` | use `blog-brainstorm` |
| no `plan.md` | use `blog-outline` |
| no `<slug>.md` or no `*-zh.md` | use `blog-write` |
| no `x-post.md` / `newsletter-teaser.md` | use `blog-write` package completion |
| no `imgs/web/00-cover.webp` | use `blog-illustrate` |
| no `video.mp4` but `youtube-script.md` exists | use `aaron-video-gen` |
| article ready but not copied to blog repo | use `publish-to-blog` |
| `video.mp4` ready and user wants upload | use `yt-publish` |

If the user requests a specific phase, run that phase even if earlier artifacts are missing, but report the gap.

### 3. Execute one phase at a time

For each phase:
- State the artifact you found.
- State the next artifact you will create.
- Load the focused skill's `SKILL.md`.
- Follow that skill.
- Stop after the phase if human review is needed.

### 4. Recovery behavior

If a post has mixed historical formats, normalize forward rather than rewriting history:
- Prefer `plan.md` as the writing outline.
- Prefer `x-post.md` over `x-teaser.md` for new posts.
- Prefer `youtube-script.md` for slide-based videos.
- Keep old files unless the user asks to clean them.

### 5. Completion report

Report the current package status:

```text
Blog production status: YYYY-MM-DD/<slug>
Idea: yes/no
Plan: yes/no
Article: yes/no
Chinese: yes/no
Images: yes/no
Video script: yes/no
Video file: yes/no
Blog published: yes/no
YouTube uploaded: yes/no
Next recommended step: <skill>
```

## Codex Compatibility

This orchestrator works in Codex, Claude, Cursor, and Gemini as long as agent skill symlinks have been synced with `scripts/sync-agent-skills.sh`. Avoid Claude-only tool names; use ordinary file reads and shell commands where possible.
