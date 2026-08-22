# Red-Team Review

Reviewed: 2026-08-16  
Draft: `agent-first-request-entry-fee.md`

## AI-Like Or Generic Sections

No section reads as generic AI commentary after the first draft. The phrase “The receipt is the architecture” is compressed, but it follows a specific PTC mechanism and earns the line. Keep it.

## News Summary Without Original Judgment

The provider material is organized around Aaron's two-account mechanism rather than company-by-company recap. The risk is the cache section becoming a pricing explainer. Do not add a provider price table or more models.

## Claims That Need Stronger Evidence

1. **“Core” implied an internal attribution the experiment did not produce.** The 12,867-token control combines base instructions, protocol, core tools, runtime context, and the tiny prompt. Rename it “baseline Codex control.”
2. **The article called the experiment reproducible without showing a command.** Add the representative full-project invocation and state what changes in the controls.
3. **The full-stack median hid meaningful variance.** Keep the 16,738-17,755 range beside 17,606 and do not invent a cause.
4. **The DSH and Codex categories are not identical.** DSH exposed individual tool and skill blocks; Codex ablated broader plugin/app and workspace surfaces. Compare assembly policy, not product efficiency or per-skill weight.
5. **Cache observations do not establish why a hit occurred.** The experiment did not control provider routing or a cache key. Keep the observation only to justify separate gross and cache-adjusted reporting.
6. **Anthropic's 55k and 85%+ are vendor figures.** Preserve “Anthropic says,” the typical-case wording, and its small-toolset exception.

## Paragraphs To Cut Or Merge

- Do not add a separate subagent-tax section without a controlled inheritance experiment.
- Keep PTC performance to one bounded paragraph. The schema-relocation mechanism matters; the dramatic speed ratio is not the claim.
- Do not expand the DeepSeek comparison into another teardown of the repo.

## Weak Counterargument Handling

The counterargument correctly changes the denominator: richer context can be rational when it prevents retries and raises success. The remaining weakness was that the equation covered entry input while sounding like full agent economics. Name the omitted output tokens, tool/API charges, latency, and human review.

## Missing Personal Or Operator Judgment

No missing personal anchor. The strongest Aaron-specific update is already present: he expected shared skills to dominate, but the experiment showed a much larger baseline harness surface. Keep that changed mind visible.

## Ending Quality

The ending returns to the measured `OK` and lands on an operating rule: every default capability must earn its place. It advances the thesis. Keep the newsletter/series CTA short so it does not dilute the final sentence.

## Required Revisions

- Rename “core” to a measured baseline control.
- Add the exact representative CLI command.
- Add unexplained run variance beside the median.
- Correct the DSH/Codex category boundary.
- Limit the formula to entry economics and name full-task costs outside it.

## Revision Notes

All five required revisions completed on 2026-08-16.

## Revision Delta

### Added

- Reproduction command.
- Full-stack variance and no-causal-attribution boundary.
- Full-task cost categories omitted by the entry equation.

### Cut

- No new sections cut; expansion into provider pricing and subagent generalization was deliberately prevented.

### Reframed

- “Core agent” -> “baseline Codex control.”
- DSH-versus-Codex percentage comparison -> non-identical layer ablations revealing different assembly policies.
- Per-success equation -> explicitly entry-layer economics.

### Intentionally Kept

- Exact title and opening receipt, subject to publication-day rerun.
- PTC as a mechanism counterexample, with the small-task performance boundary.
- Skills as valuable portable assets whose delivery mechanism still has carrying cost.

Decision: PASS TO PROSE POLISH
