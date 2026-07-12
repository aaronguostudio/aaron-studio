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
| X post | `src/content/blogs/YYYY-MM-DD/x-post.md` | Teaser-first social post with reply-link placeholder |
| X standalone | `src/content/blogs/YYYY-MM-DD/x-standalone-tweet.md` | Follow-up single-insight teaser |
| LinkedIn post | `src/content/blogs/YYYY-MM-DD/linkedin-brief.md` | Professional operator post with a direct-link or native-media plan |
| Facebook post | `src/content/blogs/YYYY-MM-DD/facebook-post.md` | Relationship-native launch post for Aaron's personal network |
| Distribution plan | `src/content/blogs/YYYY-MM-DD/distribution-plan.md` | Platform jobs, assets, CTA, UTM links, and 7-day experiments |
| Newsletter teaser | `src/content/blogs/YYYY-MM-DD/newsletter-teaser.md` | Beehiiv teaser |
| Video brief | `src/content/blogs/YYYY-MM-DD/video-brief.md` | Video-native angle, story spine, retention plan |
| YouTube script | `src/content/blogs/YYYY-MM-DD/youtube-script.md` | Slide-based script for `aaron-video-gen` |
| YouTube script audit | `src/content/blogs/YYYY-MM-DD/youtube-script-audit.md` | Scriptwriting gate result before rendering |
| YouTube metadata | `src/content/blogs/YYYY-MM-DD/youtube-metadata.md` | Title, description, chapters, tags |
| Red-team review | `src/content/blogs/YYYY-MM-DD/red-team-review.md` | Skeptical editorial review and required revisions |
| Prose polish review | `src/content/blogs/YYYY-MM-DD/prose-polish-review.md` | Final EN/ZH language polish goals, edits, and boundaries |
| Canon note | `src/content/blogs/YYYY-MM-DD/canon-note.md` | Canonical idea, reusable frame, claim updates, internal link map |

## Workflow

### 1. Locate the plan

Use the user's path if provided. Otherwise use the newest blog directory with one of:

1. `plan.md`
2. `content-plan.md`
3. `idea.md`

For serious essays using Blog Workflow 3, also read `memory-reflection.md`, `editorial-brief.md`, `research-dossier.md`, `claim-ledger.md`, `argument-memo.md`, `canon-alignment.md`, and `editorial-scorecard.md` when present. Read `tiles/blog-production/references/editorial-system.md`. Treat these as editorial source material. If they are missing for a serious essay, report the gap and ask whether to continue with the lighter workflow.

Read `src/content/strategy/x.md`, `src/content/strategy/blog-writing-language.md`, and `config/aaron-studio.json` if present.

Before writing distribution copy, read `tiles/blog-write/references/social-distribution.md`. Treat platform reach advice as a hypothesis to test with Aaron's own post data, not as a permanent algorithm rule.

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
- Apply `src/content/strategy/blog-writing-language.md` as the style authority for natural prose, anti-AI writing patterns, and Aaron voice craft.

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
- distribution plan
- X post
- X standalone tweet
- LinkedIn post
- Facebook post
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
- Lead with the editorial contract's concrete scene, contradiction, bottleneck, or result. Earn the title within the first 150 words.
- Concrete does not mean autobiographical. When a timely event or market move is the reason to read, name the subject first. Move a personal example later when it illustrates the mechanism but cannot support the opening claim by itself.
- Use "I" voice when the plan has personal evidence.
- Preserve the plan's thesis but improve phrasing.
- Avoid generic AI-influencer language.
- For Aaron's default public posts, make the thesis commercially useful and opinionated enough to disagree with.
- Prefer section bodies with coherent paragraphs over many isolated one-line paragraphs.
- Sections should be readable without the plan.
- Use local image paths only after images already exist; otherwise leave no image placeholders.
- End with a sharp implication or CTA from the plan/content-plan; avoid vague motivational endings.
- Put the article's original judgment in the first 15%. Do not make readers finish a news recap before discovering the point.
- Do not structure the article as one company or source per section. Sources prove the argument; they are not the argument.
- Keep fact, inference, judgment, and personal observation distinguishable. Do not let prose smooth over an evidence boundary recorded in `claim-ledger.md`.
- When claiming that an AI workflow learns or improves recursively, name the human participation still required and show how that judgment becomes a reusable rule, eval, runbook, tool, or product change. A loop in a diagram is not evidence of self-improvement.

For a substantial rewrite, create a structural redraft rather than line-editing the old draft in place. Preserve the prior version in a versioned revision folder or versioned sibling file before replacing the active article. A structural redraft must change at least two of: opening, thesis expression, section sequence, mechanism, counterargument, framework use, or ending.

### 3b. Depth revision pass

After the first English draft, do one skeptical editor pass before writing companion assets. Do not wait for Aaron to ask for "more depth."

Before this pass, read the blog feedback context when growth env is available:

```bash
node scripts/blog-growth.mjs next-brief-context --limit 5
```

Use the returned context as editorial memory, not as a command to blindly optimize for old metrics. The draft must explicitly use or reject at least one active lesson or recommended action. If the command cannot run because env or schema is unavailable, continue and record the measurement gap in the workflow notes.

Score the article against this checklist:
- **Thesis**: Is the main claim non-obvious, specific, and worth disagreeing with?
- **Evidence**: Does it include concrete lived experience, product behavior, market facts, or source-backed examples?
- **Mechanism**: Does it explain why the change happens, not only describe what happened?
- **Stakes**: Does it make clear what changes for builders, operators, teams, or companies?
- **Nuance**: Does it include a counterargument, risk, or limitation?
- **Frame**: Does it give readers a reusable operating lens, checklist, or decision model?
- **Framework economy**: Is there one primary executable framework? Fold supporting diagnostics into it instead of adding a competing checklist or acronym.
- **Ending**: Does the ending advance the thesis instead of adding a generic CTA?
- **Reinforcement**: Does it explicitly use or reject a recent blog-growth lesson from `next-brief-context`, and is the success metric measurable in a 24h or 7d postmortem?

If any item is weak, revise the article once before continuing. The revision should add substance, not just polish wording. Prefer adding mechanism, examples, counterarguments, and sharper framing over adding more adjectives.

When reporting completion, mention the two or three most important depth fixes made.

Before publishing, store a pre-publish prediction when growth env is available:

```bash
node scripts/blog-growth.mjs evaluate-content --slug <slug>
```

If the article is not yet in the published blog repo, run the same command with `--root <draft-root>` or record the evaluation gap and run it immediately after publish.

### 3c. Anti-AI style gate and Story craft gate

After the depth revision, run the blog style scanner before writing companion assets:

```bash
npx -y bun tiles/blog-write/scripts/blog-style-quality.ts <blog-dir>/<slug>.md --require-personal-anchor --require-story-craft
```

Use `src/content/strategy/blog-writing-language.md` to interpret the report. The scanner is a candidate detector, not a final judge, but a failing report means the article needs one revision pass before continuing.

Revise for:
- concrete lived evidence instead of generic claims;
- a hook that starts with a concrete scene, contradiction, bottleneck, result, or decision;
- real narrative tension: constraint, tradeoff, failure, objection, risk, or before/after conflict;
- a story payoff: operating rule, implication, or decision lens;
- natural sentence rhythm instead of metronomic paragraphs;
- plain operator language instead of AI slop vocabulary;
- a conclusion that advances the thesis instead of summarizing.

After creating the Chinese version, run:

```bash
npx -y bun tiles/blog-write/scripts/blog-style-quality.ts <blog-dir>/<slug>-zh.md --language zh
```

If it fails, revise the Chinese adaptation so it reads like natural Chinese writing, not a literal translation or formulaic academic prose.

During Chinese review, translate ordinary business and engineering terms such as `vendor`, `enterprise product`, `people layer`, `consulting`, and `deployment test`. Preserve English when it is a proper noun, a stable acronym such as FDE or ACTOR, or genuinely clearer than the Chinese equivalent.

### 3d. Red-Team Review

Before writing companion assets for a serious essay, create `red-team-review.md`.

It must include:
- AI-like or generic sections;
- news summary without original judgment;
- claims that need stronger evidence;
- paragraphs to cut or merge;
- weak counterargument handling;
- missing personal or operator judgment;
- ending quality;
- required revisions;
- revision notes.

Record at least five issues and complete at least one substantive revision before proceeding. A substantive revision changes argument, evidence, structure, rhythm, or the ending. It is not only wording polish.

### 3e. Prose Polish Handoff

For serious essays, the final language polish belongs to `blog-prose-editor`, not to an unbounded rewrite inside `blog-write`.

After the red-team revision and before final distribution/media:
- read `canon-alignment.md` again if present;
- run or hand off to `blog-prose-editor`;
- ensure `prose-polish-review.md` exists;
- keep any polish scoped to expression, rhythm, translation tone, hook, transitions, and ending;
- do not add new facts or change the argument during prose polish.

### 3f. Editorial Scorecard

After prose polish, complete `editorial-scorecard.md` using the weighted rubric in `tiles/blog-production/references/editorial-system.md`.

- Cite concrete draft evidence for each score.
- Record what was added, cut, reframed, and intentionally kept.
- Require 85/100 or higher, with no dimension below 70% of its weight.
- If the score fails, revise the weak dimension once and rescore. Do not raise the number without changing the draft.

### 4. Draft the Chinese version

Create a natural Simplified Chinese adaptation, not a literal translation.

Rules:
- Keep technical proper nouns in English when natural.
- Preserve examples, argument order, and CTA.
- Translate image alt text if images are present.
- Keep frontmatter fields aligned with the English source.

### 5. Draft distribution files

Social distribution is value-first by default. The shared thesis should appear across the package, but each platform needs a different reason to care and a different job in the reader journey. Do not mechanically translate one social post into three forms.

First create `distribution-plan.md` using `tiles/blog-write/references/social-distribution.md`. It must define the target reader, launch hypothesis, platform job, asset, CTA, UTM link, primary metric, and one follow-up atom for X, LinkedIn, and Facebook. Use the plan to decide whether the launch should optimize for a direct blog click, a native conversation, or a video view.

The cross-platform package should share one core hook while adapting it to the platform:
- X: discovery and conversation; shortest, sharpest, and usually under 280 characters.
- LinkedIn: professional credibility; a concise operator argument with one real implication.
- Facebook: real relationships; personal context, direct relevance, and an honest invitation to respond.
- Newsletter: owned-reader follow-up; a warmer, complete teaser.

`x-post.md`:
- A self-contained launch post, not a long-form post unless Aaron explicitly asks for a thread or long-form X essay.
- Strong hook in the first 1-2 lines and one tension readers can recognize from work.
- Usually include `## Main Post`, `## Reply With Link`, and `## Publishing Notes`.
- Main post should fit 280 characters unless the file is clearly a thread.
- Use a self-reply link as the initial launch variant when it preserves a stronger main post. Do not claim that direct links are always penalized; record link placement as an experiment in `distribution-plan.md`.
- Name the selected visual or captioned short clip and ask one specific question that brings in practitioners rather than generic engagement.

`x-standalone-tweet.md`:
- One sharp insight from the post.
- Fit 280 characters unless Aaron asks for a thread.
- Include a specific visual or short-clip idea only when it helps the user post.
- It should work 2-5 days after launch without requiring the reader to have seen the first post.

`linkedin-brief.md`:
- LinkedIn-native operator post, usually 150-260 words, not a mini article or corporate announcement.
- Open with a professional tension, add Aaron's judgment and one practical implication, then end with a question an experienced reader can answer.
- Choose either a direct article link with preview or a native video/document post. Do not plan a custom image and external URL in the same LinkedIn post.
- When the final blog URL is known, use:
  `node scripts/blog-growth.mjs utm-url --url <blog-url> --channel linkedin --campaign <slug> --content launch-operator`

`facebook-post.md`:
- Write for Aaron's real network: personal, direct, and free of corporate announcement language.
- Explain why Aaron made the piece before naming its wider operator relevance.
- Use a direct article link with preview and an intentional audience setting. State whether `Public` or `Friends` is the recommended launch choice and why.
- End with one honest, specific question rather than engagement bait.
- When the final blog URL is known, use:
  `node scripts/blog-growth.mjs utm-url --url <blog-url> --channel facebook --campaign <slug> --content launch-friends`

`newsletter-teaser.md`:
- Short plain-text teaser.
- Usually 80-140 words.
- Use the same core hook as the X post, with a slightly more complete setup.
- Ends with the blog URL placeholder if the final URL is not known.
- When the final blog URL is known, use the growth UTM helper instead of a bare link:
  `node scripts/blog-growth.mjs utm-url --url <blog-url> --channel newsletter --campaign <slug> --content teaser`

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
  - high-shock facts: 5-10 bullets with score or rationale;
  - hook type: one of the playbook hook types, with target/transformation/stakes;
  - story structure: one selected structure and why;
  - retention beat map: timestamp/beat/image idea every 20-35 seconds;
  - audit status: story flow, comprehension, speed-to-value.
- Also include: cold open, story spine, what the video adds, banned phrases, and ending.
- Use exact `##` heading names expected by the audit parser:
  `Target Audience`, `Desired Emotion`, `Core Promise`, `Title/Thumbnail Expectation`, `High-Shock Facts`, `Hook Type`, `Story Structure`, `Retention Beat Map`, `What The Video Adds`, `Banned Phrases`, `Ending`, `Audit Status`.
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

### 5b. Canon Note

For serious essays, create `canon-note.md` before reporting the package complete.

Use this structure:

```markdown
# Canon Note

## Canonical Idea

## Reusable Frame

## Claims Added

## Claims Updated

## Internal Link Map

## Future Branches
```

The canon note should capture what this article adds to Aaron's long-term public writing memory. It should also record useful internal link opportunities without forcing links into the article.

### 6. Quality checks

Before finishing:
- No `TBD`, `TODO`, or `[...]` placeholders except an explicit `[blog URL]` in social copy.
- English and Chinese slugs match.
- Every generated file is under the same date directory.
- `youtube-script.md` has at least one `## [SLIDE:` section.
- `video-brief.md` exists when `youtube-script.md` exists.
- `youtube-script-audit.md` exists when `youtube-script.md` exists and reports a passing gate before rendering.
- `youtube-script.md` follows the video brief and is not a section-by-section blog recap.
- Social distribution files are teaser-first: same core hook, clear tension, no full article recap.
- `distribution-plan.md` gives X, LinkedIn, and Facebook distinct platform jobs, assets, CTAs, UTM links, success signals, and a testable launch hypothesis.
- Social copy is not mechanically duplicated across platforms and does not present unverified algorithm folklore as fact.
- `x-post.md` does not put the blog link in the main post.
- `x-post.md` main post fits 280 characters unless it is explicitly a thread.
- `linkedin-brief.md`, when present, is not a mini article unless Aaron explicitly requested one.
- LinkedIn, newsletter, and YouTube metadata links use UTM-tagged URLs once the final blog URL is known.
- Main articles match Aaron's default style unless the user explicitly requested a different voice.
- The English article passed the depth revision checklist.
- Serious essays have `canon-alignment.md` before final draft acceptance, or a clear reason it was skipped.
- Serious essays have `prose-polish-review.md` after red-team revision, or a clear reason it was skipped.
- Serious essays have a verified `claim-ledger.md` and a passing `editorial-scorecard.md`.
- The English article passed the Anti-AI style gate and Story craft gate (`blog-style-quality.ts --require-personal-anchor --require-story-craft`), or any remaining scanner flags were reviewed and intentionally accepted.
- The Chinese article passed the Chinese style gate (`blog-style-quality.ts --language zh`), or any remaining scanner flags were reviewed and intentionally accepted.
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
