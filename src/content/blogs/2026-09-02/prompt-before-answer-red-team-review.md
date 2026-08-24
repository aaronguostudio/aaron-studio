# Red-Team Review — Prompt Before the Answer

Reviewed: 2026-08-23

## Strongest Objections

### 1. This is one run, not a benchmark

Valid. The article reports observed sequences and receipts, not rates or rankings. Every product claim is scoped to “this run” or to official/source documentation. Replication is required before any latency, quality, cost, or hit-rate claim.

### 2. The four models and defaults differ

Valid and material. DSH used local Qwen/Ollama; cloud tools used their installed routes and Aaron's personal configuration. Raw token totals therefore remain unnormalized. The article compares categorical lifecycle behavior only.

### 3. DSH used different compositions for turn one and the SDK follow-up

Valid. The headless profile supplies the DSH first-turn tool path. The SDK composition is used only to verify same-session admission and follow-up outcome. The article and field note state this explicitly.

### 4. Grok cache read zero could be a telemetry quirk

Possible. The narrow claim survives: the product emitted a zero cache-read field in this run while still answering from resumed state without tools. The article does not infer Grok's general hit rate or internal cache policy.

### 5. Inspectable compaction does not mean accurate compaction

Correct. The DSH source inspection supports configurability, auditability, and explicit lifecycle claims only. The article expressly rejects the claim that DSH's summary is better.

### 6. Tool paths can reflect the model, not only the harness

Correct. The transcript is produced by model plus harness plus configuration. The article calls the paths observed product-harness behavior, not immutable harness algorithms.

## Claims Removed or Narrowed

- Removed universal “defaults” language for the personal Codex/Claude/Grok environments.
- Removed any raw token leaderboard.
- Kept DSH's empty follow-up as a failure sample rather than substituting an inferred answer.
- Distinguished session persistence, provider cache, and compaction throughout.
- Described evidence cards as designed, sanitized receipts rather than documentary terminal screenshots.

## Remaining Risk

Readers may still read the four-row tables as a winner comparison. The surrounding copy and method note repeatedly state the boundary. The figures avoid scores, timing, and totals that would amplify the wrong interpretation.

## Decision

PASS for a qualitative field essay. FAIL for any quantitative product ranking without replicated, matched-model trials.
