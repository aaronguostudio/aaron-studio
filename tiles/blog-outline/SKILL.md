---
name: blog-outline
description: Use when turning a topic, rough idea, notes, muse direction, or content-plan into a structured blog outline before drafting.
---

# Blog Outline

Turn an idea into a writing-ready outline. This is the bridge between `muse`/`blog-brainstorm` and `blog-write`.

## Output

| File | Path | Purpose |
|------|------|---------|
| Argument memo | `src/content/blogs/YYYY-MM-DD/argument-memo.md` | internal Chinese memo: thesis, mechanism, evidence map, counterargument, reusable frame, implication |
| Outline | `src/content/blogs/YYYY-MM-DD/plan.md` | writing-ready structure, story beats, examples, and distribution intent |

## Workflow

### 1. Locate the source

Use the user's path if provided. Otherwise inspect the newest blog directory under `src/content/blogs/` and choose the best available source in this order:

1. `argument-memo.md`
2. `editorial-brief.md`
3. `research-dossier.md`
4. `memory-reflection.md`
5. `content-plan.md`
6. `idea.md`
7. existing `plan.md`
8. a rough idea from the user message

Always read `src/content/strategy/x.md` and `config/aaron-studio.json` if present.

### 2. Ground in Aaron's voice

Read the 2-3 most recent finished English posts under `src/content/blogs/*/*.md`, skipping `*-zh.md`, `content-plan.md`, `plan*.md`, and social/video files.

Extract only reusable style signals:
- opening pattern
- section rhythm
- level of personal detail
- CTA style

Do not copy private `brain/` content into web tools. If personal context is needed, use local files only.

Default public-blog style unless the user explicitly asks otherwise:
- Entrepreneur/operator voice with clear commercial value.
- Insight-led, not literary, confessional, or teacherly.
- Thesis should describe how value moves: cost, leverage, judgment, customers, markets, product, strategy.
- "仰望星空" style ideas should be framed as strategic altitude / cognitive radius, not romantic mood.
- Prefer structured article sections with 2-3 coherent paragraphs, not one-sentence fragments.
- Avoid generic "lifelong learning", "you should", "become better", and AI-influencer language.

### 2b. Build The Argument Memo

For serious essays, write `argument-memo.md` before `plan.md`.

Write it in Chinese by default because it is an internal review artifact. Use this structure:

```markdown
# 论证备忘录

## 核心论点

用一句足够具体、可以被聪明读者反驳的话写清楚。

## 为什么现在值得写

## 机制解释

## 证据地图

## 需要承认的反方观点

## 对反方的回应

## 可复用框架

## 对读者的启发
```

The memo must map thesis -> why now -> mechanism -> evidence -> counterargument -> reusable frame -> implication. If the research does not support the thesis, revise the thesis before creating `plan.md`.

### 3. Build the outline

Write `plan.md` with:

```markdown
# Blog Plan: <Title>

## Meta
- **Author:** Aaron Guo
- **Target:** aaronguo.com blog (EN + ZH bilingual)
- **Tone:** <specific tone>
- **Length:** <target word count>
- **Audience:** <reader>
- **CTA:** <follow | newsletter | reply | custom>

## Hook
<Opening tension, question, or story moment.>

## Thesis
<One sentence. Specific enough that someone could disagree.>

## Personal Anchor
<The lived experience, project, experiment, or observation that makes this Aaron's piece.>

## Outline

### Part 1: <section title>
- Point
- Evidence/example
- Personal beat

### Part 2: <section title>
- Point
- Evidence/example
- Personal beat

### Part 3: <section title>
- Point
- Evidence/example
- Personal beat

## Visual Ideas
- <cover idea>
- <inline image idea>

## Distribution Plan
- Blog:
- X:
- Newsletter / LinkedIn:
- YouTube:

## Open Questions
- <only questions that block drafting; omit if none>
```

Prefer 5-7 sections for a 1,500-2,500 word post. Use a tighter 3-section outline for short posts.

For Aaron's default style, set `Tone` to something like: "Entrepreneurial, crisp, insight-led, commercially useful; no soft self-help, literary emotion, or teacherly advice."

### 4. Quality bar

Before finishing:
- The thesis is one sentence.
- The personal anchor is concrete.
- Every section has a job; no generic filler section.
- The outline names the business value or strategic implication, not only a personal feeling.
- There are no `TBD`, `TODO`, or placeholder brackets.
- If `content-plan.md` exists, `plan.md` preserves its core thesis and CTA.

### 5. Handoff

Report:

```text
Blog outline complete
Plan: src/content/blogs/YYYY-MM-DD/plan.md
Next: run blog-write to draft the article package.
```

## Codex Compatibility

Claude-only tools such as `AskUserQuestion` are not required. In Codex, ask concise plain-text questions only when the outline cannot be completed from local context.
