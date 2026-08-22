# Red-Team Review

## Issues (verified 2026-08-21, pre-companion-assets)

1. **[Fact, revised] "a 178-line green test suite"** — the 2026-08-26 post says "178 green tests and 100 percent line coverage," not a 178-line suite. Fixed to "178 green tests once shipped a real loader failure."
2. **[Honesty, revised] Opening "an invoice line I did not know how to audit"** — overclaim: Aaron's 2026-09-02 post shows he can instrument envelopes; the real gap is mapping per-token invoices to work units. Fixed to "I could not map back to the work it bought."
3. **[Internal consistency, revised] "the fact-check flipped a detail I had written confidently" + "The fact-check corrected one of my dates"** — no article date was ever written then corrected; what actually happened: the claim ledger excluded a precise Qwen release date because outlets disagreed (8/13-8/15), and the draft's ending was rejected by the style scanner. Both self-referential passages now describe the checks that actually fired, which makes the section's claim verifiable against the working artifacts.
4. **[Attribution, accepted with tighten] market-data sentences** — download/trending/Cline/AA-Index figures are single-outlet (pingwest) with pandaily corroboration; Willison's 21-minute pelican and "thinks longer than peers" now explicitly carry "per the coverage" / "at launch, per the coverage" so the second-hand boundary is visible in-body.
5. **[Mechanism gap, acceptable by design] "the subscription just paid for it on my behalf"** — the "quality cost hidden by the invoice" claim is an argument, not a measurement; the sentence is positioned as inference immediately before the session evidence. Kept, flagged here so the scorecard records the boundary.
Paragraphs to cut: none (each section earns ~250-350 words; cuts would hurt the six-part argument). Structure: kept.

## Revisions Completed

- Substantive revision applied: opening rephrasing (honesty), 178-green-tests fact fix, and both self-referential sections rewritten to cite the checks that actually fired (scanner rejection of the first ending, ledger exclusion of the release date). These change evidence, not wording.

## Residual, Acceptable

- "about 28GB at Q8" is a computation (27B × ~8.1 bits ≈ 28.4GB), not a sourced figure; marked "about".
- "thousands of lines this session wrote" — session log verified >9,000 lines, so "thousands" understates, which is safe.
- Q8_0 served via Ollama is Aaron's configuration, presented as his choice, not Qwen's default.
