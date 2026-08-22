---
type: reading
date: 2026-08-15
tags: [ai-native, harness, deepseek, agent-infrastructure]
status: active
related:
  - "[[concepts/harness-engineering]]"
---

# DeepSeek Harness Teardown — Research Substrate

Source material for the DSH blog series (2026-08-19 / 2026-08-26 / 2026-09-02 / 2026-09-09).

## Provenance

- Produced 2026-08-15 by a 14-agent parallel analysis (11 subsystem readers + 3 critique lenses: cost, competitive comparison, orange-book gap analysis) over the local clone `/Users/aaronguo/Work/lab/deepseek-harness` at HEAD `47f943859b`, with 378 source/doc verifications.
- Published synthesis: https://claude.ai/code/artifact/568d98c8-bfcb-46f7-ba97-1931d2908387 (《DeepSeek Harness 工程拆解》).
- `orange-book-full-text.txt` is the plain-text extraction of HuaShu's《DeepSeek Harness：从开机到拆开》v260814 (CC BY-NC-SA 4.0, source clone `/Users/aaronguo/Work/lab/deepseek-harness-orange-book`). His measurements are pinned to dsh 0.1.0-rc.6 and pre-2026-08-17 pricing — always re-check before citing.

## Files

- `00`–`10`: subsystem deep-reads (Cordis kernel, agent loop, session log, tools pipeline, capability seams, ecosystem compat, multi-agent/modes, persistence, quality infra, process artifacts, API surface).
- `11-cost-critic.md`, `12-compare-critic.md`, `13-orange-book-critic.md`: critique lenses.
- Each file: summary / key designs with file:line evidence / tradeoffs / learnables / questionable.

## Caveats

- Evidence paths reference the lab clone at commit 47f9438; the repo moves ~200 commits/day — re-verify any file:line before publishing it.
- These are internal working notes (agent-written), not publishable prose.
