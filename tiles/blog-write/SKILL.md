---
name: blog-write
description: Use when drafting or revising a full blog article or content package from a plan, outline, rough notes, or content-plan.
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
| Video brief | `src/content/blogs/YYYY-MM-DD/video-brief.md` | Video-native angle, story spine, retention plan |
| YouTube script | `src/content/blogs/YYYY-MM-DD/youtube-script.md` | Slide-based script for `aaron-video-gen` |
| YouTube script audit | `src/content/blogs/YYYY-MM-DD/youtube-script-audit.md` | Scriptwriting gate result before rendering |
| YouTube metadata | `src/content/blogs/YYYY-MM-DD/youtube-metadata.md` | Title, description, chapters, tags |

## Workflow

### 1. Locate the plan

Use the user's path if provided. Otherwise use the newest blog directory with one of:

1. `plan.md`
2. `content-plan.md`
3. `idea.md`

Read `src/content/strategy/x.md` and `config/aaron-studio.json` if present.

When producing video assets, also read `src/content/strategy/youtube-video-language.md`. If it is missing, create or restore it before writing `video-brief.md` or `youtube-script.md`.

Also run or inspect this when available:

```bash
node scripts/blog-growth.mjs next-brief-context --limit 5
```

Use recent blog-growth review lessons when drafting or revising. The draft must state the article hypothesis, target audience, expected distribution channel, success metric, and which recent lesson it is applying or intentionally rejecting. If there are no reviews yet, use top-performing content as directional context and mark the lesson source as sparse.

### Aaron's default writing style

Use this style unless the user explicitly asks for a diary, literary essay, soft reflection, or another named voice:
- Write from an entrepreneur/operator perspective. The piece should deliver insight, point of view, and commercial value.
- Start from a concrete business/work observation, then name the underlying shift. Prefer claims like "AI lowers execution cost; judgment becomes more valuable."
- Focus on incentives, cost structure, leverage, judgment, customers, markets, product sense, strategy, and decision quality.
- Keep poetic phrases grounded. For example, "仰望星空" should mean strategic altitude, cognitive radius, and direction, not romantic mood.
- Use structured article paragraphs: each section should usually have 2-3 coherent paragraphs carrying point, mechanism, and implication. Avoid turning the main article into one-sentence slide notes.
- Be crisp and direct. Cut soft self-help, intellectual wandering, "AI influencer" cliches, and teacherly "you should" advice.
- Chinese should be tighter and more operator-grade; English should be native and concise. Keep natural terms like `AI`, `prompt`, `workflow`, and `context`.

### Canonical blog taxonomy

Every public article must include exactly one `category` from this controlled list. Do not invent new category IDs.

| Category ID | Use for |
|-------------|---------|
| `ai-native-systems` | AI-native tools, agents, models, AI work systems, prompt/workflow/control surfaces |
| `product-execution` | Product building, engineering execution, workflow implementation, shipping systems |
| `business-strategy` | Markets, customers, sales, finance, strategy, judgment, leadership, commercial insight |
| `personal-operating-system` | Personal systems, learning, career, attention, energy, long-term capability building |
| `creation-media` | Writing, content production, creator work, blog/video/media workflows |

Use `tags` for 2-4 specific keywords only. Tags are for search and semantic detail; they are not reader-facing navigation categories. Keep category IDs in English for both English and Chinese articles.

### 2. Determine the package scope

Default package:
- English article
- Chinese article
- X post
- X standalone tweet
- newsletter teaser
- video brief
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
category: business-strategy
tags: [specific-keyword, second-keyword]
---
```

Writing rules:
- Lead with a concrete scene, tension, or result.
- Use "I" voice when the plan has personal evidence.
- Preserve the plan's thesis but improve phrasing.
- Avoid generic AI-influencer language.
- For Aaron's default public posts, make the thesis commercially useful and opinionated enough to disagree with.
- Prefer section bodies with coherent paragraphs over many isolated one-line paragraphs.
- Sections should be readable without the plan.
- Use local image paths only after images already exist; otherwise leave no image placeholders.
- End with a sharp implication or CTA from the plan/content-plan; avoid vague motivational endings.

### 3b. Depth revision pass

After the first English draft, do one skeptical editor pass before writing companion assets. Do not wait for Aaron to ask for "more depth."

Score the article against this checklist:
- **Thesis**: Is the main claim non-obvious, specific, and worth disagreeing with?
- **Evidence**: Does it include concrete lived experience, product behavior, market facts, or source-backed examples?
- **Mechanism**: Does it explain why the change happens, not only describe what happened?
- **Stakes**: Does it make clear what changes for builders, operators, teams, or companies?
- **Nuance**: Does it include a counterargument, risk, or limitation?
- **Frame**: Does it give readers a reusable operating lens, checklist, or decision model?
- **Ending**: Does the ending advance the thesis instead of adding a generic CTA?
- **Reinforcement**: Does it explicitly use or reject a recent blog-growth lesson, and is the success metric measurable in a 24h or 7d postmortem?

If any item is weak, revise the article once before continuing. The revision should add substance, not just polish wording. Prefer adding mechanism, examples, counterarguments, and sharper framing over adding more adjectives.

When reporting completion, mention the two or three most important depth fixes made.

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
- Short punchy paragraphs are acceptable for X, but keep the same entrepreneur/operator thesis.

`x-standalone-tweet.md`:
- One sharp insight from the post.
- Include an image idea.

`newsletter-teaser.md`:
- Short plain-text teaser.
- Ends with the blog URL placeholder if the final URL is not known.
- When the final blog URL is known, use the growth UTM helper instead of a bare link:
  `node scripts/blog-growth.mjs utm-url --url <blog-url> --channel newsletter --campaign <slug> --content teaser`

`linkedin-brief.md` when requested:
- LinkedIn-native, not a copy of the newsletter teaser.
- 8-14 short paragraphs or bullets.
- Include the final blog URL only after the blog is actually live, or use a clear placeholder before publishing.
- When the final blog URL is known, use:
  `node scripts/blog-growth.mjs utm-url --url <blog-url> --channel linkedin --campaign <slug> --content brief`
- Explain the practical insight in a professional operator voice.

`video-brief.md`:
- Must be created before `youtube-script.md`.
- Use `src/content/strategy/youtube-video-language.md`.
- Define the video angle in this form:
  `This video is not "the blog in narration form." It is about <specific viewer-facing tension>, told through <specific story spine>, so the viewer leaves with <specific operating insight>.`
- Include the expanded scriptwriting schema:
  - target audience: specific viewer and what they already believe;
  - desired emotion: one primary feeling the video should transfer;
  - core promise: the value the viewer gets;
  - title/thumbnail expectation: what the viewer thinks they clicked for;
  - high-shock facts or lived moments: 5-10 bullets with score or rationale;
  - hook type: one of the playbook hook types, with target/transformation/stakes;
  - story structure: one selected structure and why;
  - retention beat map: timestamp/beat/image idea every 20-35 seconds;
  - audit status: story flow, comprehension, speed-to-value.
- Also include: cold open, story spine, what the video adds beyond the article, banned phrases, and ending.
- The story spine should be 5-8 video beats, not a copy of article headings.
- The brief must name at least 3 places where the video adds something beyond the article: behind-the-scenes detail, sharper example, objection, demo moment, or story beat.

`youtube-script.md`:
- Use the `aaron-video-gen` slide format, not the `yt-script-writer` scene format.
- Write from `video-brief.md`, not directly from the blog outline.
- Include `## [HOOK]`.
- Use meaningful slide titles.
- Reference likely images in `imgs/` when present; otherwise use planned filenames.
- Video scripts may use short lines, but should still lead with the business insight rather than reflective narration.
- The script must adapt the article into a video-native story: cold open, promise, context, model, proof, objection, payoff.
- Avoid repeated filler and obvious TTS crutches: "right", "you know", "what's interesting is" repeated across slides, "basically", "let's dive in", "in today's video", and repeated sentence frames.
- Add retention beats every 20-35 seconds: contrast, reveal, concrete example, objection, callback, or visual reset.
- If the script can be read as a lightly shortened version of the blog, revise before handing off to `aaron-video-gen`.

`youtube-script-audit.md`:
- Must be generated before rendering.
- Must pass story flow, comprehension, and speed-to-value gates.
- If it fails, revise `video-brief.md` or `youtube-script.md`; do not rely on the TTS rewrite to fix it.

`youtube-metadata.md`:
- Title options.
- Description.
- Tags.
- Chapter timestamps as approximate if the final video does not exist yet.
- When the final blog URL is known, the description's article link must use:
  `node scripts/blog-growth.mjs utm-url --url <blog-url> --channel youtube --campaign <slug> --content description`

### 6. Quality checks

Before finishing:
- No `TBD`, `TODO`, or `[...]` placeholders except an explicit `[blog URL]` in social copy.
- English and Chinese slugs match.
- Every generated file is under the same date directory.
- `youtube-script.md` has at least one `## [SLIDE:` section.
- `video-brief.md` exists when `youtube-script.md` exists.
- `youtube-script-audit.md` exists when `youtube-script.md` exists and reports a passing gate before rendering.
- `youtube-script.md` follows the video brief and is not a section-by-section blog recap.
- `x-post.md` does not put the blog link in the main post.
- LinkedIn, newsletter, and YouTube metadata links use UTM-tagged URLs once the final blog URL is known.
- Main articles match Aaron's default style unless the user explicitly requested a different voice.
- The English article passed the depth revision checklist.
- Distribution files inherit the revised thesis; they must not summarize an earlier, weaker draft.

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
