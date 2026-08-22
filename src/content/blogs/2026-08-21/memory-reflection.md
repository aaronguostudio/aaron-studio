# Memory Reflection

## Related Past Posts

1. **2026-08-19 / deepseek-harness-teardown** (series anchor) — established the harness as append-only event log (44 event types, 3 model-visible), cache discipline, "own your skills," rent/churn/own. This post answers from the opposite side: what the harness does when the model is local and unbilled.
2. **2026-08-26 / ai-made-process-cheaper-judgment-is-still-expensive** — DSH's loader failure escaped 178 green tests; process cheap, judgment expensive. Reuse: on a 27B local model the gates matter MORE, because the model's raw capability margin is smaller; density of enforced checks is the difference between output and slop.
3. **2026-09-02 / agent-first-request-entry-fee** — the harness request envelope (92% tools/skills) is the real cost of a first request. Reuse lightly: on local, the envelope's billing disappears but its discipline still decides what completes; don't re-teach cost math that post already did.

## Ideas To Reuse

- rent / churn / own → applied to the model layer: model is no longer rented, it is owned on the shelf; the churn layer (harness) is still real.
- "机器能查的交机器，判断力留人" — enforced gates over prose; this session's style scanner + claim ledger live example.
- ACTOR's "Outcome" step: on local, outcome evidence = the audit log, not an invoice.

## Ideas To Update

- "Harnesses churn / don't bind deeply" — now tested from a builder side: if the model is local and the harness churns, the migration cost lands on your machine and session store, not your bill. Sharpen, don't drop.
- "DSH is the clearest public specimen yet of AI building a complex system" — extend: and its default demo machine can be your own desktop.

## Internal Link Candidates

- /blogs/deepseek-harness-teardown (series anchor — required)
- /blogs/agent-first-request-entry-fee (envelope framing)
- /blogs/ai-made-process-cheaper-judgment-is-still-expensive (gates vs model margin)
- /blogs/one-person-project-ai-coding-v2 (solo builder economics)

## Continuity Thesis

The series asked "what does the harness decide?" This post answers the operator question left open: **when the model stops being rented, what do I invest in instead?** The answer: the portable layer (skills, gate density, memory, audit) now carries the whole quality bar, plus a crossover test for which work classes move local.
