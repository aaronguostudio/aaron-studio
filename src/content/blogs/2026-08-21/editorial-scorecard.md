# Editorial Scorecard

## Editorial Contract

- Reader: Operators and builders running agents daily who feel recurring token bills and are curious — but burned by homelab noise — about what local would actually change.
- Reader's job to be done: Decide which recurring agent workloads move to a 27B-class local model, and what that flips in the cost structure.
- One-sentence promise: I ran my full blog production pipeline on a fully local stack — DSH 0.1.0-rc.8 + Qwen3.8-27B on my M5 Max — and this post is the receipt: what local bought, what it gave up, and where quality responsibility moved.
- Opening scene or bottleneck: The invoice I could not map back to the work it bought, versus the same work now running on my own chips through a harness with no billing surface. Version-pinned receipt in the first 150 words.
- Original contribution: The self-referential production receipt — the first DSH-series post produced by the stack it describes — plus the three-question local crossover test as an operable decision lens the reader runs on their own workloads.
- Scope boundary: No claim that 27B beats frontier anywhere; no install/tuning advice; single-pipeline evidence kept honest as a per-workload-class test, not a universal; self-referential conflict of interest stated in the body.
- Success hypothesis: The decision lens + honest self-reference beats a generic "local AI is here" launch; measured as qualified operator replies (24h), UTM reads (24h), and newsletter CTA clicks (7d), compared against the 09-02 entry-fee post's baseline.

## Score

| Dimension | Weight | Score | Evidence in the draft | Required change |
|---|---:|---:|---|---|
| Hook earns attention and title | 10 | 9 | Opens on the invoice bottleneck; the title "I Stopped Renting Intelligence" is earned by the second paragraph, where the version-pinned receipt and "No cloud tokens. No meter." land. | None. |
| Thesis is specific, original, and arguable | 15 | 14 | "When the meter leaves the room, what you buy is the environment, and quality responsibility lives in the machine around the model" — a smart operator can disagree (work-class selection bias is the live attack, named in Part 5). | None. |
| Mechanism explains why | 15 | 14 | Chain: zero marginal cost resurfaces the quality cost the invoice covered -> local model has less margin (21-minute pelican; hard-band gaps) -> enforced gates become the difference between output and slop -> log replaces the invoice as the audit. Cost-structure arithmetic: recurring invoice vs amortized purchase. | None. |
| Evidence is primary, sufficient, and honest | 15 | 13 | Primary: version-pinned session receipt (rc.8, Q8_0, M5 Max, no billing surface), the checks that actually fired this session (scanner rejected the first ending; ledger excluded the release date). Secondary: pingwest/pandaily market facts with outlet+date, explicitly labeled "per the coverage"; 178-green-tests mirror from the 08-26 post. Boundary recorded in the claim ledger and red-team review. | Market facts are single-outlet with corroboration; acceptable for a dated, attributed paragraph — recheck if sources change before publish. |
| Aaron's operator judgment is visible | 10 | 10 | Investment-order flip ("the harness becomes the product"), the deliberate-rent rule, the "I am not betting on the price sheet" decision, and the per-class arithmetic claim. | None. |
| Counterargument changes or sharpens the claim | 10 | 9 | COI stated and addressed with receipts in Part 4; Part 5 concedes the hard band, the hardware purchase price, and the per-workload-class boundary, which sharpens the thesis into the test. | None. |
| Reader leaves with a usable decision or framework | 15 | 15 | The three-question local crossover test (capability / recurrence / audit) plus the one-hour validation protocol, explicitly framed as the reader's test, not the author's conclusion. | None. |
| Structure is compressed and every section earns its place | 10 | 9 | Six sections, ~250-350 words each; no section restates another; Part 2 (market timing) is the only section without first-person material, and it earns its place as the "why now" evidence. | None. |

Final score: 93/100

## Revision Delta

### Added

- The exact checks that fired this session (scanner rejecting the first ending; ledger excluding the release date) — added during red-team so the self-referential section is verifiable against working artifacts.
- The Q8 (~28GB) figure so the 128GB machine makes arithmetic sense for Q8 serving.
- The "I am not betting on the price sheet" decision line, making the capability-side bet an explicit operator choice.

### Cut

- A first-draft ending that landed on a generic CTA; replaced with the operating rule as the final prose beat, CTA demoted to a post-note.
- "178-line green test suite" corrected to "178 green tests" against the 08-26 source.
- The overclaim "an invoice I did not know how to audit" tightened to "could not map back to the work it bought".

### Reframed

- The audit argument (log vs invoice) from "visibility is the product" to "the log is the vendor's product, and the invoice is its evidence".
- Self-referential honesty from abstract ("the fact-check corrected my date") to the specific checks that actually fired.

### Intentionally Kept

- The market-timing paragraph with outlet-attributed second-hand figures: the "why now" needs the dated public record and every number carries its source.
- "No cloud tokens. No meter." as a two-line beat: the rhythm break is the thesis in four words.
- The deliberate-rent conclusion: the post refuses the unconditional "local wins" position in both languages.

## Production Locks

- Argument Lock: PASS
  - Evidence: claim ledger PASS (12 claims, 6 exclusions, verification 2026-08-21); argument memo and canon alignment coherent; red-team completed with 5 documented issues and one substantive revision; scorecard gate passed.
  - Caveat: The crossover test is Aaron's design proposal, not a measured universal; the 27B capability claim is bounded to "daily-task bar", never "frontier parity".
- Article Lock: PENDING
  - Trigger: set after cover image is generated and article text is final; no downstream media requested for this post (no video/audio in scope).
- Package Lock: PENDING
  - Trigger: set after local publish to the blog repo passes build + browser QA; external publishing not authorized yet.

## Gate

Pass at 85/100 or higher, with no dimension below 70% of its weight. A passing score does not override factual, link, or image failures.

Decision: PASS (score 93/100; weakest dimension Evidence at 13/15 = 87% of weight)
