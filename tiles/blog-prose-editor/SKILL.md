---
name: blog-prose-editor
description: Use when an Aaron blog article has a stable argument and needs final English or Chinese prose polish for naturalness, rhythm, human voice, hook strength, operator-grade clarity, or reduced AI-written texture.
---

# Blog Prose Editor

Polish the language layer after the argument is stable. This skill improves rhythm, clarity, and reader pull without changing the thesis, evidence, or source-backed claims.

## Inputs

Read:
- the English article and Chinese article
- `argument-memo.md`
- `canon-alignment.md` when present
- `red-team-review.md` when present
- `src/content/strategy/blog-writing-language.md`

Use `research-dossier.md` only to verify claims. Do not add new evidence during this pass unless the user explicitly asks for another research pass.

## Workflow

1. Diagnose before editing: hook, section rhythm, paragraph movement, jargon, translation tone, generic AI phrasing, weak ending, and title/subtitle fit.
2. Edit the article files directly when the improvement is clear and low-risk.
3. Preserve meaning. If a sentence needs a new claim to become stronger, leave a note instead of inventing it.
4. Keep English and Chinese separate:
   - English should read like native operator prose: concrete, concise, not over-polished.
   - Chinese should be natural and sharp: fewer translation-shaped sentences, less academic connective tissue, more direct judgment.
5. Write `prose-polish-review.md` in Chinese by default.
6. Run the style gates after editing:

```bash
npx -y bun tiles/blog-write/scripts/blog-style-quality.ts <blog-dir>/<slug>.md --require-personal-anchor --require-story-craft
npx -y bun tiles/blog-write/scripts/blog-style-quality.ts <blog-dir>/<slug>-zh.md --language zh
```

## `prose-polish-review.md` Structure

```markdown
# Prose Polish Review

## 修改目标

## 英文润色重点

## 中文润色重点

## 保留不改的地方

## 风险与边界

## 验证结果
```

## Boundaries

- Do not make the prose smoother by removing the point of view.
- Do not add facts, examples, quotes, or links.
- Do not rewrite every paragraph. Prefer high-leverage edits around hook, transitions, thesis sentences, section openings, and ending.
- Do not turn the article into generic consulting or AI influencer prose.
- Stop after one deep polish pass unless the user explicitly asks for another pass.
