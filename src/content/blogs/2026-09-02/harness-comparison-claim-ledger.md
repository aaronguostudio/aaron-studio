# Claim Ledger — Prompt Before the LLM

Verified: 2026-08-23. Status: bounded field experiment plus source inspection; suitable for a qualitative article, not a product or token leaderboard.

| ID | Claim | Type | Evidence | Confidence | Boundary |
|---|---|---|---|---|---|
| H1 | On the same shipping incident, all four harnesses found the cents-versus-dollars mismatch and ran the relevant test once without editing the fixture. | operator observation | `harness-deep-test-2026-08-23.md`; private raw JSONL | high | One run per product; different model routes and defaults. |
| H2 | The visible first-turn sequences differed: Codex began with configured code discovery, Claude used inventory plus ordinary reads under plan-mode governance, Grok used directory/search/read tools, and DSH retained a replayable call/result trail. | operator observation | `harness-deep-test-2026-08-23.md`; private raw JSONL | high | Describes these installed configurations, not universal defaults. |
| H3 | Codex, Claude, and Grok answered the follow-up with zero new tool calls; DSH admitted the follow-up with zero tools but the local model ended at its output cap without final text. | operator observation | `harness-deep-test-2026-08-23.md`; private raw JSONL and DSH append-only session | high | One same-session follow-up each. DSH used a local model and a separate SDK composition. |
| H4 | In this sample, Codex and Claude reported follow-up cache reads; Grok resumed the session while reporting zero cache-read tokens. | operator observation | raw usage receipts summarized verbatim in `harness-deep-test-2026-08-23.md` | high | Raw fields are product-specific and must not be normalized into a ranking. |
| H5 | A resumed session does not imply a provider prompt-cache hit. | inference | H3-H4 | high | Supported categorically by the observed Grok run; not a statement about every Grok session. |
| H6 | Claude's follow-up reported both cache reads and cache creation, showing that a later turn can reuse an older prefix while writing a newer suffix. | operator observation plus documented mechanism | local Claude receipt; [Anthropic prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) | high | Stream aggregation may include multiple internal model iterations. |
| H7 | Codex exposes automatic/manual compaction controls and events; the Responses API compaction result includes an opaque encrypted compaction item intended for continuation. | source fact | [Codex config schema](https://github.com/openai/codex/blob/main/codex-rs/core/config.schema.json), [Codex app-server README](https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md), [OpenAI compact reference](https://developers.openai.com/api/reference/java/resources/responses/methods/compact) | high | API mechanism is not proof of the exact internal compaction route used in every Codex CLI turn. |
| H8 | Claude Code documents that automatic compaction clears older tool outputs, summarizes history, re-injects root instructions and auto-memory, and may require path-scoped rules to be re-read. | source fact | [Claude Code context window](https://code.claude.com/docs/en/context-window), [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) | high | Documentation may evolve with product versions. |
| H9 | Grok Build exposes `/context`, `/compact`, and `/resume`. | source fact | [Grok Build modes and commands](https://docs.x.ai/build/modes-and-commands) | high | Public docs do not establish the exact survival rules for every compacted session. |
| H10 | DSH's `BasicCompactionEngine` implements model-specific pressure thresholds, optional tool-result pruning, retained-tail selection, LLM summarization, bounded retries, and durable manual compaction. | source fact | local source `141eb6fef834`: `index.ts:258`, `config.ts:133`, `summarizer.ts:121`, `index.ts:368` | high | Source inspection of a pinned checkout, not a hosted-product guarantee. |
| H11 | Cache, persistence, and compaction are distinct layers: exact-prefix reuse, durable product state, and lossy context reduction. | synthesis | H3-H10 | high | Conceptual distinction; implementation details vary by product and provider. |
| H12 | The most revealing comparison unit is the state transition between turns: what entered, was discovered, was cached, was persisted, and was compressed away. | editorial thesis | H1-H11 | high | Framing, not an independently measurable product score. |

## Prohibited claims

- Do not rank model intelligence, answer quality, speed, cost, or total prompt size.
- Do not compare raw token totals across vendors as if their aggregation boundaries were identical.
- Do not describe the personal Codex/Claude/Grok capability surface as a clean-install product default.
- Do not claim DSH's local Qwen/Ollama cache counters were zero; that route did not expose them.
- Do not claim DSH completed the second answer. It preserved/admitted the turn, used no tools, and ended with an empty `max-tokens` result.
