# Aaron blog writing language

## Purpose

Aaron's blog should read like an operator with lived judgment, not like a generic AI essay generator. The goal is not to fool AI detectors. The goal is to publish work that has concrete experience, sharp claims, natural rhythm, and commercial usefulness.

Default shape:

```text
Concrete work observation -> tension -> mechanism -> operator frame -> objection -> implication.
```

## External skill inputs

These outside skills were reviewed as references, not installed as controlling templates:

- `pr-pm/prpm@human-writing` - useful for concrete openings, specific evidence, anti-corporate language, and endings that move to action rather than summary.
- `hairyf/skills@writing-humanizer` - useful for detecting inflated significance, vague attribution, formulaic structure, and generic conclusions.
- `oakoss/agent-skills@de-slopify` - useful for compact scanner rules: slop vocabulary, formulaic contrast, rhythm, and read-aloud checks.
- `mike-coulbourn/claude-vibes@ai-writing-detection` - useful as a probabilistic reference only. Do not accuse or reject from one signal; use multiple signals and context.
- `wentorai/research-plugins@chinese-text-humanizer` - useful for Chinese version checks: avoid mechanical transitions, translation tone, and evenly balanced paragraph formulas.

## Anti-AI style gate

Reject or revise a draft when several of these appear together:

- AI slop phrases: "in today's fast-paced world", "ever-evolving landscape", "at its core", "it is important to note", "let's dive in".
- Inflated words without evidence: "robust", "seamless", "holistic", "paradigm", "game-changing", "cutting-edge", "pivotal", "underscore".
- Formulaic contrast: "not just X, it is Y" or repeated "it is not about X; it is about Y".
- Vague claims with no receipt: "teams will improve alignment", "AI unlocks potential", "this changes everything".
- Low rhythm variation: every sentence is similar length and every paragraph has the same shape.
- Generic ending: "In conclusion", "to summarize", "future looks bright", "exciting times lie ahead".
- Chinese mechanical tone: "首先/其次/最后", "综上所述", "具有重要意义", "一定程度上", "积极拥抱", "不断提升" clustered together.

Use the scanner:

```bash
npx -y bun tiles/blog-write/scripts/blog-style-quality.ts <article.md> --require-personal-anchor --require-story-craft
npx -y bun tiles/blog-write/scripts/blog-style-quality.ts <article-zh.md> --language zh
```

The scanner is a candidate detector, not a final judge. A clean score does not guarantee a good article; a flagged issue means the section needs editorial attention.

## Story craft gate

Aaron's blog is not fiction, but it still needs narrative force. A useful operator essay usually has a story problem:

```text
something changed -> the old process failed -> the real constraint appeared -> a new operating rule emerged.
```

Reject or revise when:

- the opening starts with a generic topic intro such as "AI is transforming..." or "In this article...";
- there is no tension: no constraint, bottleneck, tradeoff, failure, objection, risk, or before/after conflict;
- the article only explains a concept and never shows the moment where the concept became necessary;
- the ending says the topic matters but does not land a payoff;
- the conclusion does not name what the reader should see differently, decide differently, or operate differently.

Good blog hooks start with a concrete disturbance:

- a queue grew faster than review capacity;
- a meeting exposed a knowledge gap;
- a project shipped faster than the team could align;
- a metric moved in the wrong direction;
- a workflow worked until AI changed the cost structure.

Good narrative tension is not fake drama. It is the real friction in the system: time, judgment, ownership, review, quality, customer risk, market timing, or execution cost.

Good payoff is not a summary. It is an operating rule, implication, or decision lens the reader can reuse.

## Aaron voice craft gate

A strong Aaron post usually has:

- a concrete opening: a project, meeting, bottleneck, customer, metric, failure, or workflow change;
- a thesis that a smart operator could disagree with;
- mechanism: why the shift happens, not only what changed;
- lived evidence: first-person experience or specific operational evidence with dates, numbers, systems, teams, or constraints;
- commercial value: cost structure, leverage, judgment, product, customers, market, execution, or strategy;
- a counterargument or risk so the piece does not read as hype;
- section rhythm that mixes short punch lines with longer explanations;
- an ending that advances the thesis with an implication, operating rule, or decision lens.

Bad revision adds adjectives. Good revision adds receipts.

## English standard

Write native, crisp English. Use contractions when natural. Prefer plain words over formal synonyms: use "use", not "utilize"; "also", not "furthermore"; "important", not "pivotal" unless the sentence proves why.

Subheadings should be scannable claims, not generic labels:

- weak: `Introduction`, `Background`, `Conclusion`
- stronger: `The bottleneck moved to review`, `Ownership is the new interface`, `The team still matters`

## Chinese standard

The Chinese version is an adaptation, not a literal translation. It should preserve the operator judgment while sounding natural in Chinese.

Prefer direct phrasing:

- weak: `综上所述，我们应该积极拥抱这一趋势。`
- stronger: `真正要改的不是态度，而是工作流。AI 把执行成本打下来以后，人的判断必须更早进入系统。`

Keep natural technical terms such as `AI`, `prompt`, `workflow`, `context`, `QA`, and `UAT` when that is how Aaron would say them.

## Feedback loop

When Aaron says a draft sounds too AI-like, too flat, or more natural than before:

1. Save the before/after excerpt.
2. Identify the exact pattern: phrase, structure, rhythm, missing evidence, weak ending, translation tone.
3. Add or update a scanner test when the pattern is repeatable.
4. Update this file only when the lesson is general enough to reuse.
