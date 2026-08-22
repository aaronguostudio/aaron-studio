# Editorial Scorecard

## Editorial Contract

- Reader: Builders and engineering/product leads operating Codex, Claude Code, MCP, or custom agent stacks.
- Reader's job to be done: Itemize the first-request footprint, separate it from cache-adjusted cost, and decide which capabilities load eagerly.
- One-sentence promise: The reader can reproduce Aaron's ablation and evaluate boot context against successful completed work.
- Opening scene or bottleneck: An eight-word instruction produces a one-word answer after 17,606 input tokens.
- Original contribution: Aaron's own five-run measurement, three-layer ablation, and the footprint-versus-marginal-bill distinction.
- Scope boundary: One CLI/model/date/stack; no universal Codex number, model-quality claim, or subscription-dollar conversion.
- Success hypothesis: The concrete receipt earns qualified builder attention; official tool-context evidence makes the operator rule reusable beyond Aaron's stack.

## Score

| Dimension | Weight | Score | Evidence in the draft | Required change |
|---|---:|---:|---|---|
| Hook earns attention and title | 10 | 10 | First screen names the exact no-tool prompt, `OK.` output, 17,606 median, and three-line receipt. | Re-run before publish so the number still earns the title. |
| Thesis is specific, original, and arguable | 15 | 14 | “First request is an architecture bill” plus cache-adjusted input per successful task rejects prompt-length and boot-minimization framing. | No argument change required. |
| Mechanism explains why | 15 | 15 | Separates baseline/workspace/plugin layers, then context footprint from marginal cache price, then eager from deferred tool delivery. | None. |
| Evidence is primary, sufficient, and honest | 15 | 14 | Five-run Aaron measurement, stable controls, exact command, DSH version pin, provider docs, variance and non-identical-category caveats. | Publication-day rerun and pricing freshness check remain mandatory. |
| Aaron's operator judgment is visible | 10 | 10 | Aaron reports the experiment changed his prior belief that skills would dominate and preserves skills as assets with carrying cost. | None. |
| Counterargument changes or sharpens the claim | 10 | 9 | A richer 17k request may beat a failing 5k agent; the article changes the denominator to successful work and names omitted full-task costs. | Future work could test success-rate effects; do not add unsupported data now. |
| Reader leaves with a usable decision or framework | 15 | 14 | Reader can reproduce the one-word run, ablate layers, report gross/cached/uncached, test deferred loading, and keep context that improves completion. | None. |
| Structure is compressed and every section earns its place | 10 | 9 | Seven sections move receipt -> ablation -> DSH comparison -> cache mechanism -> PTC counterexample -> deferred architecture -> operator rule. | Cache section is the densest; keep provider recap at current length. |

Final score: 95/100

## Revision Delta

### Added

- Reproducible Codex first-request command and five-run range.
- Explicit gross-footprint versus marginal-input distinction.
- Anthropic 55k tool-surface case and deferred-loading boundary.
- Full-task cost caveat after the entry equation.

### Cut

- Universal “skills are the largest tax” premise from the initial idea.
- Universal subagent multiplier claim.
- Provider pricing-table direction.
- Generalized “PTC is 14x slower” claim.

### Reframed

- 12,867 “core” -> baseline Codex control with no false internal itemization.
- Portable skills -> valuable assets whose eager delivery has carrying cost.
- Cache optimization -> separate from footprint reduction.
- Lowest boot cost -> cache-adjusted entry input per successful task.

### Intentionally Kept

- Exact 17,606 title, contingent on pre-publication rerun.
- DSH 13,809 comparison with version, rounding, and clean-machine caveats.
- One primary executable frame: boot footprint, cache share, fresh sessions, with successful work as denominator.

## Production Locks

- Argument Lock: PASS (2026-08-16)
  - Evidence: Verified claim ledger; red-team revisions complete; prose scanner 100/100; scorecard 95/100; thesis, mechanism, counterargument, evidence boundaries, and one operating rule are stable.
  - Caveat: Headline number and time-sensitive provider cache/pricing details must be re-run/re-checked immediately before publication.
- Article Lock: PENDING
  - Evidence: English and Chinese sibling drafts now exist; title, section sequence, image positions, and conclusion have not yet been accepted by Aaron.
  - Stale downstream assets: Any future social, visual, audio, or video asset must be generated from this version or marked stale after upstream edits.
- Package Lock: PENDING
  - Evidence: No bilingual transformed package, public images, or browser-rendered validation yet.
  - External publishing authorized: no

## Gate

Pass at 85/100 or higher, with no dimension below 70% of its weight. A passing score does not override factual, link, or image failures.

Decision: PASS FOR ARGUMENT LOCK ONLY
