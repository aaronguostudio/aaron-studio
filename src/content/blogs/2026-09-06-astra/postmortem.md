# Postmortem — v2 prediction and editorial learning
Prediction: a real-work title plus a concrete cross-environment deployment will earn qualified interest beyond launch-demo browsing. Six short sections and useful source screenshots should make the article easier to finish and remember. These are hypotheses, not measured CTR or retention results.

Aaron’s v2 feedback: the first draft lacked deployment context, used long headings, over-centered corrections in the writing section, and forced old-article references. Response: explain the actual job; shorten to six points; make writing about natural expression; use prior-work continuity only where it earns a place.

Published on September 6, 2026 (America/Edmonton). 24-hour and 7-day audience outcomes remain pending; no automation created.

## V3 ending revision
Aaron found the improved six-point article still ended abruptly. The previous payoff rule overemphasized an operating action and explicitly opposed summary. Updated the shared writing strategy plus blog-write, blog-prose-editor and blog-production: give the conclusion room to connect evidence to the author’s judgment; allow grounded emotion and brief synthesis; do not force a CTA or earlier-article callback. The article and narration now close with trust, verification/audit and cost questions, then anticipation. This is an editorial response, not evidence of improved audience retention.

## Release and follow-up

The bilingual article and V6 video are public. PR #18 merged to main at `1213e460e64537c51f64812fe35f9c31feceb94c`; production source and live assets were verified. YouTube: https://youtu.be/_12kx0AFhCM.

Run these after the observation windows mature (September 7 and September 13, around 20:23 Edmonton):

```bash
node scripts/blog-growth.mjs postmortem --slug gpt-6-astra-real-work --window 24h
node scripts/blog-growth.mjs postmortem --slug gpt-6-astra-real-work --window 7d
```

Compare qualified article interest, video retention and subscriber change. No CTR or audience-retention improvement has been measured yet.
