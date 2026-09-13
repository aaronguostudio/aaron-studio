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

Use the user's path if provided. Otherwise use the active package from this task and `package-state.json`; do not select by recency alone. Choose the relevant source in this order:

1. `argument-memo.md`
2. `editorial-brief.md`
3. `research-dossier.md`
4. `claim-ledger.md`
5. `memory-reflection.md`
6. `content-plan.md`
7. `idea.md`
8. existing `plan.md`
9. a rough idea from the user message

Always read `src/content/strategy/x.md` and `config/aaron-studio.json` if present.

### 2. Ground in Aaron's voice

Read `tiles/blog-production/references/editorial-system.md` and `src/content/strategy/blog-writing-language.md`. Use the brief's author intent and article form. If a recurring expression problem needs calibration, read one relevant example from `tiles/blog-production/references/editorial-examples.md`. Read prior posts only when they help the current article; do not force a callback or copy a previous structure.

Keep private project context local; never copy private Brain content into web tools.

### 2b. Build The Argument Memo

For serious essays, write `argument-memo.md` before `plan.md`.

Write it in Chinese by default because it is an internal review artifact. Use this structure:

```markdown
# 论证备忘录

## 核心论点

写清本篇想表达的判断或变化，不强制反常识或可反驳论点。

## 为什么现在值得写

## 机制解释

## 证据地图

## 需要承认的反方观点

## 对反方的回应

## 可复用框架

## 对读者的启发
```

Adapt the memo to the selected form in the shared editorial contract; mechanism, counterargument and framework sections are optional when they do not help the reader. Distinguish sourced fact from Aaron's inference. If the claim ledger does not support the thesis, revise the thesis before creating `plan.md`.

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
<The main judgment or change this article helps the reader understand.>

## Personal Anchor
<Relevant experience or author stance; public examples remain attributed to their source.>

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

Choose section count and length by the material. Each part must add something; merge repetitive points.

Set tone from the author's intent and language strategy. Preserve grounded enthusiasm, concern or reflection when it belongs to the article.

### 4. Quality bar

Before finishing:
- The thesis is one sentence.
- Personal experience, sourced examples and hypothetical illustrations are clearly distinguished.
- Every section has a job; no generic filler section.
- The plan moves through a reader experience rather than mirroring the research dossier or listing sources company by company.
- The original judgment appears in the first 15% and the opening earns the title within roughly 150 words.
- The outline delivers the selected form's reader promise and preserves the author's attitude.
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
