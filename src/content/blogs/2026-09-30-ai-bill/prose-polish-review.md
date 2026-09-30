# Prose Polish Review

## Goals

- EN: keep sentences short around numbers; one idea per paragraph in the bill section; make the hook's turn ("The cut isn't the part I keep thinking about. The unit is.") land fast.
- ZH: adaptation, not translation; ordinary terms in Chinese (计量器, 缓存读取, 标价, 下限); keep product names and API/token in English.

## Edits made

- EN hook tightened to two short sentences for the turn.
- EN "Ultrafast is nice" → "Faster generation might be nice" (no implied first-hand use).
- ZH: "cache reads" → 缓存读取; "meter" → 计量器; "floor" → 下限; "exchange rate" → 汇率 (kept as the ending metaphor); avoided 首先/其次/综上所述.
- ZH ending rendered "we're changing how we calculate usage" as a paraphrase rather than quoting the English.

## Boundaries

No facts added or changed during polish. Numbers identical across EN and ZH (checked: 20×/10×, 200/100, 62,500 / $2,500, $9,400, $3,600, $2,900→$350, $6,600→$3,250, 77/76/58%, 17 billion, 8×).

## Validation

- `blog-style-quality.ts` EN: 100, 0 slop markers.
- `blog-style-quality.ts --language zh`: 100, 0 slop markers.

Decision: PASS
