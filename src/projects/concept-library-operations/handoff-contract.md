# Content-to-Distribution Handoff Contract

The handoff artifact is `src/content/concepts/<slug>/social-brief.json`.

## Required fields

```json
{
  "schemaVersion": 1,
  "slug": "progressive-disclosure",
  "seriesNumber": 4,
  "status": "eligible",
  "canonicalPath": "/learn/progressive-disclosure",
  "zhCanonicalPath": "/zh/learn/progressive-disclosure",
  "audience": ["product builders"],
  "hook": {
    "en": "A sharp, defensible tension.",
    "zh": "同一判断的中文表达。"
  },
  "mentalModel": {
    "en": "The concept compressed into one sentence.",
    "zh": "一句中文心智模型。"
  },
  "guardrail": {
    "en": "The limitation that must survive compression.",
    "zh": "压缩后仍然必须保留的边界。"
  },
  "card": {
    "language": "en",
    "hook": ["The poster-level tension.", "The sharp turn."],
    "thesis": ["The mental model, line one.", "The memorable resolution."]
  },
  "visual": {
    "primitive": "layers",
    "theme": "sleek-dark",
    "background": "#0b0b0f",
    "accent": "#6d5dfc"
  },
  "atoms": [
    { "type": "mental-model", "status": "ready" },
    { "type": "misconception", "status": "ready" }
  ],
  "cadence": {
    "minimumDaysSinceLastConceptPost": 2,
    "minimumDaysBeforeRepeat": 30
  }
}
```

## Ownership boundary

The content employee owns factual accuracy, the mental model, public safety,
concept relationships, and the visual primitive's meaning.

The distribution employee owns channel selection, hook adaptation, card
composition, CTA, UTM values, cadence, publication, and measurement. It may
compress the handoff, but it may not strengthen claims or remove important
limitations without returning the item for editorial review.

## State transitions

```text
draft -> reviewed -> public-ready -> published -> distribution-eligible
                                              \-> library-only

distribution-eligible -> selected -> packaged -> approved -> scheduled
                                                \-> rejected
scheduled -> published -> measured-24h -> measured-7d -> reusable-learning
```

Content and distribution status are deliberately stored separately. Publishing
to Learn never implies that a social campaign is approved or due.
