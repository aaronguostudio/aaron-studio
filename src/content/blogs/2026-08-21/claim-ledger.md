# Claim Ledger

Verified on: 2026-08-21

## Claims

| ID | Claim | Type | Source | Source date | Confidence | Article use |
|----|-------|------|--------|-------------|------------|-------------|
| C1 | This article was produced by DeepSeek Harness 0.1.0-rc.8 + Qwen3.8-27B (Unsloth GGUF Q8_0 via Ollama) on a MacBook Pro, Apple M5 Max, 128GB unified memory. | fact (own measurement) | local checkout (HEAD 141eb6fef8; release commit f1f7dc36fa), ~/.dsh/settings.yaml, system_profiler | 2026-08-21 | high | core receipt; version-pinned in body |
| C2 | DeepSeek Harness released 0.1.0-rc.8 on 2026-08-19 (23:00 +0800); repo holds 12,940 commits since 2026-06-10. | fact (own measurement) | local clone git log, 2026-08-21 | 2026-08-21 | high | "the harness layer is still churning this week" |
| C3 | Qwen3.8-27B open-sourced in mid-August 2026; #1 HF global trending; 1M+ downloads within ~2 days; Cline developers' most-chosen local model within 4 days; Artificial Analysis Intelligence Index 52, community nickname "local Opus 4.6". | fact (second-hand, multi-source) | pingwest 2026-08; pandaily 2026-08; orcarouter listing 2026-08-17 | 2026-08 | medium-high | market timing section; always with outlet+date; release day written as "mid-August" (8/14 vs 8/15 varies by source) |
| C4 | DeepSeek V4-Pro peak-hour output price rose 6 -> 27 yuan/million tokens in mid-August 2026, with peak/off-peak billing introduced; Zhipu and Kimi had already raised prices. | fact (second-hand) | pingwest 2026-08 | 2026-08 | medium-high | cloud inflation paragraph; cite outlet |
| C5 | Qwen3.8-27B still has gaps on high-difficulty tasks (Terminal-Bench, HLE); model "overthinks" (Simon Willison: 21 min of default-reasoning SVG pelican). | fact (second-hand) | pingwest 2026-08; orcarouter 2026-08-17 | 2026-08 | medium-high | counterargument / where local loses |
| C6 | A single coding-agent task consuming hundreds of thousands of tokens is now common; China daily token calls >140 trillion, >1000x since early 2024. | fact (second-hand) | pingwest 2026-08 | 2026-08 | medium | recurring-cost argument; avoid exactness |
| C7 | Local Ollama + DSH has no billing surface in this configuration; marginal cost of agent work is ~0 (electricity ignored). | fact (own observation) | ~/.dsh/settings.yaml (ollama provider, no billing config) | 2026-08-21 | high | "no meter" claim; bounded to this configuration |
| C8 | The session runs as an append-only zstded event log (session.jsonl.zstd), 9,000+ lines in this session; gate system fired during production (style scanner, claim exclusion, fact-check correction). | fact (own observation) | DSH session storage, this session's artifacts | 2026-08-21 | high | harness-as-environment evidence |
| C9 | The crossover from "renting intelligence" to "owning the environment" — once a local model clears the daily-task bar, the differentiator is the harness (gates, skills, memory, audit), not model access. | judgment (Aaron) | synthesis of C1-C8 + DSH series (2026-08-19, 08-26, 09-02) | 2026-08-21 | n/a (labeled as judgment) | thesis; never presented as measured fact |
| C10 | The local crossover test (capability per work class / recurrence / audit) decides which workloads move local. | framework (Aaron, design proposal) | this post's analysis | 2026-08-21 | n/a | reusable frame; label as a test to run, not a law |
| C11 | This post is the first in the DSH line produced by the stack it describes (self-referential). | inference + fact | prior post inventory (2026-08-19..09-09 all produced on cloud stacks) | 2026-08-21 | high | stated in body as both device and conflict of interest |
| C12 | 4-bit quantized Qwen3.8-27B weights ~17GB, runnable on 24GB-class GPU; long context is memory-hungry. | fact (second-hand) | pingwest 2026-08; orcarouter 2026-08-17 | 2026-08 | medium-high | hardware section, one sentence, no tuning advice |

## Unsupported Or Excluded Claims

- "Qwen3.8-27B matches Claude Opus 4.6." Excluded: source itself says "接近不等于追平"; we only claim it enters the same AA-Index band.
- "Local is free." Excluded: false — 128GB unified memory has a purchase price; the claim is amortized vs recurring cost.
- "This one session proves local works for every team's workloads." Excluded: single-pipeline evidence; the post argues per workload class.
- "Qwen3.8-27B released exactly 2026-08-14." Excluded: source discrepancy (8/13 free tier, 8/14, 8/15); written as "mid-August 2026" with the most-cited date flagged.
- "Cline top local model" with exact share/percentages. Excluded: no first-hand data; written qualitatively with outlet attribution.
- Any VRAM tuning, GGUF quant-picking, or install instructions. Excluded: not our lane, install guides own that space.

## Inference Boundaries

- Crossover point is an operating hypothesis from one pipeline on one machine, offered as a test (C10) to run against the reader's own workloads, not as a measured universal.
- "The differentiator is the harness" extends the DSH series' prior findings (completion/cost/audit decided by the harness) to the zero-billing case; that extension is Aaron's inference, labeled as such.

## Verification Summary

- Local facts (C1, C2, C7, C8): read directly from local checkout git log, settings.yaml, session store. Verified 2026-08-21.
- Market facts (C3-C6, C12): cross-checked across pingwest / pandaily / orcarouter / 网易; release-day discrepancy recorded and neutralized; all second-hand figures carry outlet + date in the article.
- No promotional numbers used without label; no benchmark comparisons beyond public sourced figures.

Decision: PASS
