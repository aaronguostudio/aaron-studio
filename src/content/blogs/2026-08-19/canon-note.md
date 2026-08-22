# Canon Note

## Canonical Idea

The harness layer decides whether agent work completes — the same model swings 46.7% → 66.7% task success and 7x cost depending on which harness runs it — and DeepSeek open-sourcing DSH made this layer readable for the first time: a complete vendor rulebook, verified at a pinned commit. The durable position for builders follows: models are rented, harnesses churn (the repo itself warns compatibility will break), and what you own is the layer every harness reads — skills, instruction files, and your recorded decisions.

## Reusable Frame

- **rent / churn / own** — models are rented (designed to be swapped); the harness layer is churning (don't bind deeply); own the portable asset layer. Executable test: the one-hour two-column inventory — what you can take with you vs what's locked in.
- **服务商负责存，harness 负责命中** ("the provider holds the safe, the harness holds the key") — prompt caching is stored provider-side, but whether requests hit it is entirely a function of how the harness assembles the request. Cache discipline is a harness property, and for a token vendor it is gross margin.
- **机器能查的交机器，判断力留人** — agents follow enforced gates far more reliably than prose conventions; every mechanically checkable rule becomes a machine check, and humans keep only the calls that need judgment (in DSH, conspicuously: whether a change deserves a design note).
- **Model-visible ⟺ logged** — the session is an append-only event log, state is a pure function of history, and a five-line pre-request assertion (derive expected context from the log, refuse on mismatch) buys replayability, resumability, and per-step cost attribution.
- **可携带性双刃剑 / dependency inversion** — when a vendor adopts its rival's file formats, the rival's users end up holding portable assets. Portability cuts both ways, and an open challenger sharpens it deliberately.

## Claims Added

- Harness choice alone flips task outcomes: 46.7% → 66.7% success, ~7x cost per completed task, same model (Composio 2026-08-11, spread only — never the ranking, per Composio's own caveats).
- DSH logs 44 session event types; exactly 3 are model-visible; the conversation is recomputed from the log before every request and a runtime invariant refuses to send anything the log can't reconstruct (C15).
- The agent loop is one config row; the four run modes are four YAML files; code/PTC mode is standard plus one appended tool-presentation row (C16).
- Cache discipline can be machine-enforced: canonical tool ordering, volatile content out of the prefix, a live-API CI test asserting cache hits — and only a model company engineers its harness around its own price list (C17).
- AI building complex software at industrial scale is now normal operations, and DSH is the clearest public specimen yet: 12,293 commits in 64 days, most code not typed by humans, governed by 683 design notes, a rejected/ directory, verified-red postmortems, and 27 pre-release checks (C6/C19/C20/C24/C28).
- Process economics flip in agent teams: rule density that would be bureaucracy for humans becomes a guardrail when the writer never gets tired.

## Claims Updated

- Extends 2026-06-15 (fable-5): "the unit of AI work shifted from a response to a run" → the harness is where a run's operating rules live, and DSH is the first chance to read one vendor's complete rulebook end to end.
- Extends 2026-07-06 (deployment companies): "deployment capability, not model access, is the scarce layer" → the same bet in software form — closed harness as moat (Anthropic) vs open compatible harness as token funnel (DeepSeek), explicitly labeled as Aaron's read.
- Extends 2026-07-01 (one-person project): the owner/boundary/evidence model at industrial scale — 37 people supervising an agent fleet; human jobs move to setting rules, judging evidence, approving merges.

## Internal Link Map

- Outbound (in the article): `/blogs/fable-5-managing-ai-autonomy`, `/blogs/one-person-project-ai-coding-v2`, `/blogs/why-ai-companies-are-becoming-deployment-companies`.
- Inbound (future posts should link here for): the log/assertion design, the cache-discipline trio, the DSH process OS, and the rent/churn/own frame.

## Future Branches

- **C — 制度经济学篇 (2026-08-26):** the rejected/-directory economics; prerequisite experiment — land a rejected/ directory in aaron-studio or agents-system first.
- **B — 成本解剖篇 (2026-09-02):** the first-request entry fee; prerequisite — measure Aaron's own pipeline token cost (named in the article's closing pointer and the newsletter teaser).
- **D — 日志深潜篇 (2026-09-09):** the pre-request assertion in practice; prerequisite — implement it in Aaron's own pipeline.
- **Pending Aaron's call (E1–F):** rules-for-agents (sandbox honesty, ladders at walls, defining "stuck"); main-loop deepening (effect/disposer, the creator mode where the agent modifies itself); tool-pipeline power design; one-execution-world; the eight-small-designs list.
