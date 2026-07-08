---
name: blog-canon-alignment
description: Use when writing or revising a serious Aaron blog post that needs alignment with Aaron's prior posts, long-term canon, internal links, worldview, reusable frames, or evolving personal/operator judgment.
---

# Blog Canon Alignment

Align a serious blog post with Aaron's accumulated thinking without forcing every article into the same ideology. This is a judgment pass, not a prose polish pass.

## Inputs

Read the current post directory first:
- `idea.md`, `memory-reflection.md`, `editorial-brief.md`, `research-dossier.md`, `argument-memo.md`, `content-plan.md`, `plan.md`
- the draft article and Chinese version when present
- `canon-note.md` if it already exists

Also read:
- `src/content/strategy/blog-memory.md` when present
- 3-5 related prior finished posts when `memory-reflection.md` or the current topic suggests them

## Workflow

1. Identify the article's live thesis, target reader, and promised practical value.
2. Compare it with Aaron's prior ideas: what it reuses, upgrades, contradicts, or should not force.
3. Name the alignment risk: news summary, generic AI commentary, borrowed hot take, overfitted old belief, weak personal judgment, or missing internal link.
4. Write `canon-alignment.md` in Chinese by default, because it is an internal review artifact.
5. If a draft exists, make only scoped edits that strengthen Aaron's judgment or internal continuity. Do not add new facts or source claims without evidence.

## `canon-alignment.md` Structure

```markdown
# Canon Alignment

## 文章当前判断

## 与旧文章的呼应

## 观点升级

## 需要避免的惯性

## 可以加入的 Aaron 判断

## 站内链接建议

## Alignment Decision
```

## Rules

- Do not turn alignment into self-quotation. Internal links must help the reader.
- Do not flatten nuance to match old posts. Tension with older thinking is valuable when named clearly.
- Do not introduce values that are not supported by the current article.
- Keep the output reviewable: explain what should change and why.
- Update `canon-note.md` only after the article's final argument is stable.
