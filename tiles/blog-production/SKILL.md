---
name: blog-production
description: Use when running or resuming Aaron's end-to-end blog workflow, especially when the user wants one entry point for idea, article, images, video, social, and publishing.
---

# Blog Production

Run the blog workflow as the single orchestrator. This is the default entry point when Aaron says to start, continue, GO, publish, or finish a blog package. It decides the next missing step, applies quality gates, and hands off to the focused skill for that step.

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
| `x-post.md` | social teaser for X with link in reply | blog-write |
| `x-standalone-tweet.md` | follow-up single-insight social teaser | blog-write |
| `newsletter-teaser.md` | Beehiiv / LinkedIn teaser | blog-write |
| `linkedin-brief.md` | LinkedIn-native teaser when requested | blog-write |
| `imgs/outline.md` | illustration plan | blog-illustrate |
| `imgs/web/00-cover.webp` | blog cover | blog-illustrate |
| `video-brief.md` | video-native angle, story spine, retention plan | blog-write |
| `youtube-script.md` | slide video script | blog-write |
| `youtube-script-audit.md` | scriptwriting gate result | blog-write / aaron-video-gen |
| `video.mp4` | generated YouTube video | aaron-video-gen |
| `youtube-metadata.md` | YouTube title/description/tags | blog-write / aaron-video-gen |

## Workflow

### 1. Pick the post directory

Use the user's path if provided. Otherwise choose the newest directory under `src/content/blogs/`.

Read:
- `config/aaron-studio.json`
- `src/content/strategy/x.md`
- `src/content/strategy/blog-writing-language.md`
- all files in the chosen post directory

Before brainstorm, outline, or writing begins, run or inspect:

```bash
node scripts/blog-growth.mjs next-brief-context --limit 5
```

Use the result to name:
- one pattern to reuse
- one pattern to avoid
- one measurement caveat
- the current next experiment

### Aaron's default blog style

Unless the user explicitly asks for a literary essay, diary, or soft reflection, keep the whole workflow aligned to Aaron's default public writing style:
- Entrepreneur/operator perspective, not intellectual essay or self-help.
- Lead with a business observation, then name the insight and commercial value.
- Prefer crisp claims about incentives, cost structure, leverage, judgment, customers, markets, product, and strategy.
- Treat poetic phrases such as "仰望星空" as strategic altitude or cognitive radius, not literary mood.
- Keep article sections structured: 2-3 coherent paragraphs per section, not slide-like one-sentence fragments.
- Avoid teacherly "you should" energy, AI-influencer cliches, soft emotional wandering, and over-explaining.
- Use `src/content/strategy/blog-writing-language.md` as the natural writing and anti-AI style reference.

### 2. Detect the next step

Use the first matching missing artifact:

| Missing | Next action |
|---------|-------------|
| no directory or only rough prompt | use `muse` or create `idea.md` |
| no `content-plan.md` | use `blog-brainstorm` |
| no `plan.md` | use `blog-outline` |
| no `<slug>.md` or no `*-zh.md` | use `blog-write` |
| no `x-post.md` / `newsletter-teaser.md` | use `blog-write` package completion |
| article exists but fails depth gate | use `blog-write` revision pass |
| no `imgs/web/00-cover.webp` | use `blog-illustrate` |
| images exist but fail image quality gate | use `blog-illustrate` regeneration pass |
| `youtube-script.md` exists but no `video-brief.md` | use `blog-write` video adaptation pass |
| `youtube-script.md` exists but no `youtube-script-audit.md` | use `aaron-video-gen --audit-only` or `blog-write` video adaptation pass |
| `youtube-script-audit.md` fails | use `blog-write` video adaptation pass |
| `youtube-script.md` fails video adaptation gate | use `blog-write` video adaptation pass |
| `youtube-script.md` has too few image references | use `aaron-video-gen` visual enrichment workflow before rendering |
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

### 4. Quality gates

Run these gates before moving downstream. Do not rely on the user to discover quality issues after the fact.

**Article depth gate** — before illustration, video, or publishing, read the article as a skeptical editor. The article passes only if it has:
- a non-obvious thesis that a smart reader could disagree with
- concrete personal or market evidence, not only abstract claims
- mechanism: why the shift happens, not just that it happens
- stakes: why it matters for builders, operators, or companies
- at least one counterargument, limitation, or risk
- a useful operating frame, checklist, or decision lens
- a conclusion that sharpens the thesis rather than repeating it

If the article fails any item, run a `blog-write` revision pass before continuing.

**Anti-AI style gate and Story craft gate** — before illustration, video, or publishing, run:

```bash
npx -y bun tiles/blog-write/scripts/blog-style-quality.ts <blog-dir>/<slug>.md --require-personal-anchor --require-story-craft
npx -y bun tiles/blog-write/scripts/blog-style-quality.ts <blog-dir>/<slug>-zh.md --language zh
```

Use the report as an editorial gate for naturalness, Aaron voice, and story craft. Revise through `blog-write` if the article has clustered AI slop vocabulary, weak hook, missing narrative tension, missing story payoff, formulaic contrast, weak rhythm, missing lived evidence, a generic ending, or mechanical Chinese translation tone. A scanner flag can be intentionally accepted only after reading the surrounding section and confirming the phrase is natural in context.

**Reinforcement gate** — before accepting the article package, read the current feedback context when growth env is available:

```bash
node scripts/blog-growth.mjs next-brief-context --limit 5
```

Confirm the draft has a clear article hypothesis, target audience, expected distribution channel, success metric, and one recent blog-growth lesson it applies or intentionally rejects. If `next-brief-context` has no reviews or lessons yet, use the top-content list and state that the lesson source is still sparse. Treat missing env/schema as a measurement gap, not as a writing blocker.

**Pre-publish evaluation gate** — before or immediately after publishing, persist the rubric prediction when growth env is available:

```bash
node scripts/blog-growth.mjs evaluate-content --slug <slug>
```

This creates the prediction side of the feedback loop. The 24h and 7d postmortems should compare outcome metrics with this prediction before changing future workflow defaults.

**Image quality gate** — before accepting images, confirm `blog-illustrate` loaded `.baoyu-skills/baoyu-article-illustrator/EXTEND.md` when present and used the baoyu image generator path. Covers and thumbnails need at least two candidates or a clear reason for only one. Reject generic glowing-AI imagery, unreadable text, cluttered diagrams, stock-photo vibes, and body images that do not add a distinct idea.

**Video adaptation gate** — before visual enrichment or rendering, confirm `video-brief.md` exists and the script is a video-native adaptation rather than a blog read-through. It passes only if it has:
- a specific video promise;
- a cold open that starts with story, tension, or surprise, not meta-introduction;
- a story spine that does not simply mirror article headings;
- at least 3 places where the video adds something beyond the article;
- retention beats every 20-35 seconds;
- no obvious repeated filler phrases such as "right", "you know", "basically", or repeated "what's interesting is";
- an ending that lands a payoff instead of summarizing the article.

If the script fails any item, run a `blog-write` video adaptation pass before continuing.

**Video script audit gate** — before TTS or rendering, confirm `youtube-script-audit.md` exists and passes. If it is missing, run:

```bash
npx -y bun tiles/aaron-video-gen/scripts/main.ts --script <blog-dir>/youtube-script.md --audit-only
```

If the audit fails, run a `blog-write` video adaptation pass before visual enrichment or rendering.

**Video richness gate** — before rendering, count unique image assets referenced by `youtube-script.md`. A video longer than 4 minutes should normally use 20-30 total images with `[IMAGE:]` switches about every 15-20 seconds. If it only reuses the blog illustrations, generate video-only `sNN-MM-*.png` images and update the script first.

**Taxonomy gate** — before publishing, every public article must include exactly one `category` from:
- `ai-native-systems`
- `product-execution`
- `business-strategy`
- `personal-operating-system`
- `creation-media`

Use `tags` only for 2-4 specific search keywords. Do not invent ad hoc category names, and do not let tags become reader-facing navigation categories.

**Publishing gate** — before external side effects, verify the blog repo build passes and the target artifacts are present. Push, YouTube upload, LinkedIn posting, and other external posts require explicit user approval unless already clearly authorized in the active thread.

### 5. Recovery behavior

If a post has mixed historical formats, normalize forward rather than rewriting history:
- Prefer `plan.md` as the writing outline.
- Prefer `x-post.md` over `x-teaser.md` for new posts, but keep it teaser-first unless Aaron explicitly asks for a thread or long-form X essay.
- Prefer `youtube-script.md` for slide-based videos.
- Keep old files unless the user asks to clean them.

### 6. Completion report

Report the current package status:

```text
Blog production status: YYYY-MM-DD/<slug>
Idea: yes/no
Plan: yes/no
Article: yes/no
Chinese: yes/no
Images: yes/no
Video script: yes/no
Video brief: yes/no
Video file: yes/no
Blog published: yes/no
YouTube uploaded: yes/no
Next recommended step: <skill>
```

## Codex Compatibility

This orchestrator works in Codex, Claude, Cursor, and Gemini as long as agent skill symlinks have been synced with `scripts/sync-agent-skills.sh`. Avoid Claude-only tool names; use ordinary file reads and shell commands where possible.
