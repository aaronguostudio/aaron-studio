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
  -> blog-canon-alignment
  -> blog-write
  -> blog-prose-editor
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
| `memory-reflection.md` | prior-post reflection, internal link candidates, continuity thesis | blog-production / blog-brainstorm |
| `editorial-brief.md` | reader pain, sharp thesis, evidence need, counterargument, kill criteria | blog-brainstorm |
| `research-dossier.md` | sources, cases, facts, counterarguments, open questions | blog-brainstorm |
| `claim-ledger.md` | fact / inference / judgment map with source dates, confidence, and verification | blog-brainstorm / blog-production |
| `content-plan.md` | researched content plan | blog-brainstorm |
| `argument-memo.md` | thesis, mechanism, evidence map, counterargument, reusable frame | blog-outline |
| `canon-alignment.md` | prior-post alignment, viewpoint continuity, internal link candidates, ideas to upgrade or avoid | blog-canon-alignment |
| `plan.md` | writing-ready outline | blog-outline |
| `<slug>.md` | English article | blog-write |
| `<slug>-zh.md` | Chinese article | blog-write |
| `red-team-review.md` | skeptical editorial review and required revisions | blog-write |
| `prose-polish-review.md` | EN/ZH prose polish goals, edits, boundaries, validation result | blog-prose-editor |
| `editorial-scorecard.md` | editorial contract, weighted final score, and revision delta | blog-production / blog-write |
| `postmortem.md` | prediction, 24h/7d outcomes, workflow lesson, next experiment | blog-production |
| `workflow-retrospective.md` | optional deep-revision summary, durable lessons, lock failures, and next-run protocol | blog-production |
| `canon-note.md` | canonical idea, reusable frame, claim updates, internal link map | blog-write / blog-production |
| `distribution-plan.md` | platform jobs, assets, CTA, UTM links, and launch experiments | blog-write |
| `x-post.md` | social teaser for X with link in reply | blog-write |
| `x-standalone-tweet.md` | follow-up single-insight social teaser | blog-write |
| `linkedin-brief.md` | LinkedIn-native professional operator post | blog-write |
| `facebook-post.md` | Facebook-native personal-network post | blog-write |
| `newsletter-teaser.md` | Beehiiv teaser | blog-write |
| `imgs/outline.md` | illustration plan | blog-illustrate |
| `imgs/generation-manifest.md` | image backend, prompt, candidate, selection, and provenance record | blog-illustrate |
| `imgs/web/00-cover.webp` | blog cover | blog-illustrate |
| `video-brief.md` | video-native angle, story spine, retention plan | blog-write |
| `youtube-script.md` | slide video script | blog-write |
| `youtube-script-audit.md` | scriptwriting gate result | blog-write / aaron-video-gen |
| `audio-transcript.md` | exact approved spoken text plus resolved voice profile | aaron-video-gen |
| `audio.mp3` | normalized full narration review file | aaron-video-gen |
| `audio-raw.mp3` | untouched concatenated TTS output | aaron-video-gen |
| `audio-sample-60s.mp3` | fast listening sample from the opening | aaron-video-gen |
| `audio-generation-manifest.json` | TTS identity, hashes, output paths, and technical QA | aaron-video-gen |
| `audio-generation.md` | human listening decision and unresolved issues | aaron-video-gen / manual review |
| `video.mp4` | generated YouTube video | aaron-video-gen |
| `youtube-metadata.md` | YouTube title/description/tags | blog-write / aaron-video-gen |

## Workflow

### 0. Bootstrap Workflow 3 Artifacts

For serious essays, create missing manual-first Workflow 3 artifacts before writing begins:

```bash
npx -y bun tiles/blog-production/scripts/workflow3-artifacts.ts --dir src/content/blogs/YYYY-MM-DD
```

Never overwrite an existing artifact. If a file already exists, read and preserve it.

Read `tiles/blog-production/references/editorial-system.md` for serious essays and substantial rewrites. Lock the editorial contract before drafting, then maintain the claim ledger and final scorecard as evidence of the revision.

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
| serious essay and no `memory-reflection.md` | bootstrap Workflow 3 artifacts, then run Memory Reflection pass |
| serious essay and no `editorial-brief.md` | use `blog-brainstorm` to create editorial brief |
| serious essay and no `research-dossier.md` | use `blog-brainstorm` to create research dossier |
| serious essay and no `claim-ledger.md` | build a fact / inference / judgment ledger before drafting |
| serious essay and no `argument-memo.md` | use `blog-outline` to create argument memo and plan |
| serious essay and no `canon-alignment.md` | use `blog-canon-alignment` before drafting or finalizing |
| no `content-plan.md` | use `blog-brainstorm` |
| no `plan.md` | use `blog-outline` |
| no `<slug>.md` or no `*-zh.md` | use `blog-write` |
| no `distribution-plan.md`, `x-post.md`, `linkedin-brief.md`, `facebook-post.md`, or `newsletter-teaser.md` | use `blog-write` package completion |
| article exists but fails depth gate | use `blog-write` revision pass |
| article exists but no `red-team-review.md` | use `blog-write` red-team revision pass |
| article exists but no `prose-polish-review.md` | use `blog-prose-editor` final language polish pass |
| article exists but no passing `editorial-scorecard.md` | score the final draft, revise weak dimensions, and record the delta |
| article exists but no `canon-note.md` | use `blog-write` canon note pass |
| published or ready-to-publish article has no `postmortem.md` | create postmortem template and record prediction |
| no `imgs/web/00-cover.webp` | use `blog-illustrate` |
| images exist but fail image quality gate | use `blog-illustrate` regeneration pass |
| `youtube-script.md` exists but no `video-brief.md` | use `blog-write` video adaptation pass |
| `youtube-script.md` exists but no `youtube-script-audit.md` | use `aaron-video-gen --audit-only` or `blog-write` video adaptation pass |
| `youtube-script-audit.md` fails | use `blog-write` video adaptation pass |
| `youtube-script.md` fails video adaptation gate | use `blog-write` video adaptation pass |
| passing script exists but no `audio-generation-manifest.json` | run `aaron-video-gen --audio-only` with the default Aaron voice profile |
| narration exists but `audio-generation.md` is not approved | stop for human listening review before rendering |
| `youtube-script.md` has too few image references | use `aaron-video-gen` visual enrichment workflow before rendering |
| no `video.mp4` but narration is approved | use `aaron-video-gen` rendering workflow |
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

**Workflow 3 editorial gates** — for serious essays, do not draft until these artifacts exist and are coherent:
- `memory-reflection.md` checks at least three prior posts when relevant and records internal link candidates or explains why no useful connection exists.
- `editorial-brief.md` names reader pain, sharp thesis, opening bottleneck, original contribution, authority boundary, evidence needed, counterargument, reusable frame, distribution hook, and kill criteria.
- `research-dossier.md` contains source-backed evidence, cases, facts, counterarguments, and open questions.
- `claim-ledger.md` separates facts, inferences, judgments, and personal observations; records source and verification dates; and ends with `Decision: PASS` only after verification.
- `argument-memo.md` maps thesis -> why now -> mechanism -> evidence -> counterargument -> reusable frame -> implication.

If any artifact is missing or weak, stop and run the focused phase instead of drafting.

**Editorial contract gate** — before a serious draft or structural rewrite, write the reader, reader job, one-sentence promise, opening scene or bottleneck, original contribution, scope boundary, and success hypothesis into `editorial-scorecard.md`. Put the article's original judgment in the first 15% and earn the title within the first 150 words. Do not let the article mirror the research dossier or summarize companies one by one.

**Canon alignment gate** — before drafting or finalizing a serious essay, create `canon-alignment.md` with `blog-canon-alignment`. It should name prior-post connections, ideas being upgraded, ideas not to force, internal link candidates, and the Aaron judgment that should be present. Alignment must not become self-quotation or ideological flattening.

**Article depth gate** — before illustration, video, or publishing, read the article as a skeptical editor. The article passes only if it has:
- a non-obvious thesis that a smart reader could disagree with
- concrete personal or market evidence, not only abstract claims
- mechanism: why the shift happens, not just that it happens
- stakes: why it matters for builders, operators, or companies
- at least one counterargument, limitation, or risk
- a useful operating frame, checklist, or decision lens
- a conclusion that sharpens the thesis rather than repeating it

If the article fails any item, run a `blog-write` revision pass before continuing.

**Red-team gate** — before final article package, create `red-team-review.md` and record at least five issues across generic prose, unsupported claims, weak structure, unfair counterargument, missing operator judgment, weak ending, or unnecessary paragraphs. Complete at least one substantive revision before moving to media assets.

**Prose polish gate** — after red-team revision and before final distribution/media, use `blog-prose-editor` to create `prose-polish-review.md` and make one scoped EN/ZH language pass. This pass may improve hook, rhythm, transitions, section openings, translation tone, and ending, but must not add facts or change the argument.

**Editorial scorecard gate** — after prose polish, score the draft using `editorial-scorecard.md`. Passing requires 85/100 or higher and no dimension below 70% of its weight. Every score needs draft evidence. Record what was added, cut, reframed, and intentionally kept. A score never overrides unsupported claims, a misleading title, broken links, or missing images.

**Production lock gate** — for serious essays, use the three locks defined in `references/editorial-system.md`:
- `Argument Lock` before final prose and formal visual planning;
- `Article Lock` before final image generation, audio, or video;
- `Package Lock` before external publishing.

Record each decision and its caveats in `editorial-scorecard.md` or `postmortem.md`. If the article changes after `Article Lock`, mark the affected images, script, audio, video, social copy, and published copy stale; re-run their gates instead of assuming existing files remain valid.

**Distribution plan gate** — before any external social publishing, read `tiles/blog-write/references/social-distribution.md` and ensure `distribution-plan.md` exists. It must distinguish X discovery, LinkedIn professional credibility, and Facebook relationship-led sharing; name the selected asset, CTA, unique UTM link, success metric, and one follow-up atom per platform. Keep launch copy as drafts until Aaron explicitly approves external publishing. Record real social post IDs or canonical URLs in `distribution.json` only after they exist.

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

**Image quality gate** — before accepting images, confirm `blog-illustrate` loaded Aaron's visual strategy files and recorded the image backend in `imgs/generation-manifest.md`. In Codex, prefer the built-in image generator; use the baoyu path when the built-in tool is unavailable or the user explicitly wants the reusable CLI/batch path. Compare at least three genuinely different cover concepts before committing to a style, then generate at least two candidates for the selected cover and thumbnail. Reject generic glowing-AI imagery, unreadable text, cluttered diagrams, stock-photo vibes, repeated compositions, and body images that do not add a distinct idea.

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

**Audio identity and listening gate** — before video rendering, run the audio-only pipeline with the versioned default profile from `aaron-video-gen/config/voice-profiles.json`. Do not pass an ad hoc voice ID for routine production.

The gate passes only when:
- the transcript preserves the approved script's claims, numbers, framework labels, and technical terms;
- the manifest records the selected profile, voice ID, model, settings, script hash, and transcript hash;
- raw, normalized, and 60-second sample files exist and decode;
- technical QA records duration, sample rate, bitrate, loudness, true peak, and long silence count;
- Aaron approves voice identity, naturalness, pronunciation, pacing, authority, and long-form comfort.

When evaluating a new voice or model, compare the same locked 45-60 second script under blind labels. Do not generate the full narration until Aaron selects a winner. Do not render video while `audio-generation.md` is pending.

**Video richness gate** — before rendering, count unique image assets referenced by `youtube-script.md`. A video longer than 4 minutes should normally use 20-30 total images with `[IMAGE:]` switches about every 15-20 seconds. If it only reuses the blog illustrations, generate video-only `sNN-MM-*.png` images and update the script first.

**Taxonomy gate** — before publishing, every public article must include exactly one `category` from:
- `ai-native-systems`
- `product-execution`
- `business-strategy`
- `personal-operating-system`
- `creation-media`

Use `tags` only for 2-4 specific search keywords. Do not invent ad hoc category names, and do not let tags become reader-facing navigation categories.

**Memory update gate** — before publishing a serious essay, create or update `canon-note.md` with canonical idea, reusable frame, claims added, claims updated, internal link map, and future branches. Add useful internal links to the article only when they help the reader.

**Publishing gate** — before external side effects, verify the blog repo build passes and the target artifacts are present. The local blog copy must also pass browser-rendered QA in both languages: correct title and route, cover plus lazy-loaded body images, working language switch, no broken internal links, no horizontal overflow, and no console errors. Push, YouTube upload, LinkedIn posting, and other external posts require explicit user approval unless already clearly authorized in the active thread.

**Package integrity gate** — before illustration handoff, publishing, or reporting a serious package complete, run:

```bash
npx -y bun tiles/blog-production/scripts/blog-package-quality.ts \
  --dir src/content/blogs/YYYY-MM-DD \
  --slug <slug> \
  --serious \
  --require-images \
  --require-distribution
```

Fix all errors. Review warnings, especially stale video/audio assets after an article rewrite. Publishing still requires the target-blog link validator and build check.

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
Claim ledger: pass/fail
Article: yes/no
Chinese: yes/no
Editorial scorecard: score/pass/fail
Argument lock: pass/pending
Article lock: pass/pending
Package lock: pass/pending
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
