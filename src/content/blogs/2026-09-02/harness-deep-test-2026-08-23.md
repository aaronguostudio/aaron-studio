# Four Harnesses, Two Turns, One Shipping Incident

Tested: 2026-08-23 (America/Edmonton)

Status: publication-safe field note. Raw JSONL, local paths, session IDs, account details, and installed private capability names remain outside the article source.

## What this test can and cannot show

This is a harness-behavior experiment, not a model leaderboard. The four products used their installed model routes and personal defaults, so their token totals, speed, and answer quality are not numerically comparable.

The useful observations are narrower:

- which visible tools each harness called;
- whether a same-session follow-up reused prior evidence without tools;
- which cache fields the product exposed for that turn;
- what the product documents or implements for compaction.

## Environment

| Product | Tested build / route |
|---|---|
| Codex CLI | `0.149.0-alpha.4.1`; existing local product authentication and configured workspace surface |
| Claude Code | `2.1.241`; plan permission mode; existing local product authentication |
| Grok Build | `1.0.5 (5115b46bc909)`; read-only sandbox, web and subagents disabled |
| DeepSeek Harness | source `141eb6fef834`; local Ollama `0.32.14`; Qwen3.8 27B Q8_0 route; read-only policy |

## Fixture

The incident is small enough to inspect, but it requires search, file reads, a config lookup, and a targeted test.

```js
// src/shipping.js
export function quoteShipping(order, rules) {
  const rule = rules.find(
    (candidate) => candidate.country === order.country && candidate.region === order.region,
  )
  if (!rule) throw new Error('Unsupported shipping region')

  return order.subtotalCents >= rule.freeShippingThresholdDollars
    ? 0
    : rule.baseRateCents
}
```

For incident `INC-2047`, `subtotalCents` is `7999`. The Alberta config says `freeShippingThresholdDollars: 80` and `baseRateCents: 1299`. The bug compares cents directly with dollars, so `7999 >= 80` incorrectly returns free shipping.

The relevant test fails consistently:

```text
✖ INC-2047 charges shipping below the Alberta free-shipping threshold

AssertionError: Expected values to be strictly equal:

0 !== 1299

tests 1
pass 0
fail 1
```

## Turn 1 prompt

> Checkout incident INC-2047 is reproduced by fixtures/order-INC-2047.json. Run only the relevant test file once, use repository search and file-reading tools to trace which config field affects the result, and do not modify anything. In 180 words or fewer, give: the failing assertion, root cause with file:line evidence, the smallest fix, one regression risk, and the tool actions you used in order.

All four harnesses identified the unit mismatch and proposed converting the configured dollars to cents at the comparison boundary. None modified the fixture.

### Visible tool sequence

| Harness | Publication-safe sequence observed in this run |
|---|---|
| Codex | configured code discovery → incident search → symbol lookup → source read → targeted test → threshold search → config read → fixture read |
| Claude Code | workspace inventory → fixture/source/config/test/README reads → targeted test |
| Grok Build | directory list → incident/fixture search → six file reads → targeted test |
| DSH headless | directory orientation → file discovery → source/config/fixture/test reads → targeted test → conclusion |

The counts are less important than the first commitment. Codex used a configured code graph before it knew the repository was tiny. Claude entered with plan-mode governance and then used ordinary shell/read tools. Grok stayed close to directory/search/read. DSH exposed the assembled tool contract and retained the call/result sequence in its session log.

Claude and DSH can look similar in a final transcript because both read files and run a test. Their product boundary differs: Claude Code supplies an opinionated runtime and documented automatic context lifecycle; DSH exposes model routing, tools, safety, persistence, and compaction as separately composable packages.

## Turn 2 prompt

> Follow-up: without rerunning tests or rereading unchanged files, would changing the config field from dollars to cents be safer than changing the comparison code? Compare blast radius, name the one additional test you would add, and state which previous evidence you reused. Answer in 140 words or fewer.

### Follow-up result

| Harness | Tool calls | Outcome | Product-reported cache fields for the follow-up |
|---|---:|---|---|
| Codex | 0 | Reused prior evidence; recommended changing comparison code; proposed a BC below-threshold regression | `input_tokens: 49,347`; `cached_input_tokens: 41,728`; `cache_write_input_tokens: 0` |
| Claude Code | 0 | Reused prior evidence; recommended changing comparison code; proposed the BC case | `input_tokens: 2`; `cache_creation_input_tokens: 24,104`; `cache_read_input_tokens: 15,903` |
| Grok Build | 0 | Reused prior evidence; recommended changing comparison code; proposed the BC case | `input_tokens: 20,108`; `cache_read_input_tokens: 0`; `cache_creation_input_tokens: 0` |
| DSH SDK composition | 0 | Same session admitted the prompt, but the local model produced no final text before the 1,536-token output cap | `inputTokens: 4,629`; no provider cache read/write counters exposed by the local Ollama route |

The raw counters are deliberately not normalized. Each product may aggregate provider calls differently, and DSH used a different local model route.

The defensible finding is categorical: all four preserved enough session state to accept a follow-up without new tool calls, but only Codex and Claude reported cache reads in this sample. Grok resumed correctly with `cache_read_input_tokens: 0`. Session persistence and provider prompt-cache reuse are not the same mechanism.

Claude's follow-up also reported both cache reads and cache creation. A warm conversation can reuse one stable prefix while writing a newer suffix into cache; “warm” is not an all-or-nothing state.

## Compaction: what happens when exact history becomes too large?

Prompt cache and compaction solve different problems:

- cache keeps an exact repeated prefix cheaper to process;
- compaction replaces or reduces older history so the conversation can continue inside a context window.

| Harness | Verified mechanism or control | What is inspectable |
|---|---|---|
| Codex | exposes an auto-compaction token limit and a `thread/compact/start` operation; the Responses API can return an opaque encrypted compaction item | compaction controls and events are visible; the compacted item is designed for continuation rather than human inspection |
| Claude Code | clears older tool outputs first, then summarizes older conversation; root instructions and auto-memory are re-injected, while some path-scoped context must be re-read | documented survival rules and `/compact`; not a replayable exact transcript after summarization |
| Grok Build | exposes `/context`, `/compact`, and `/resume` in the interactive product | user-visible control exists; the public product docs do not provide the same detailed survival contract as Claude's docs |
| DSH | `BasicCompactionEngine` checks model-specific pressure, optionally prunes tool results, retains a configured tail, summarizes a selected span with an LLM, and durably checkpoints the replacement | threshold, retained tail, summarization route, usage, marker events, and append-only session history are code-level composition points |

DSH source evidence at `141eb6fef834`:

- `packages/compaction/compaction-basic/src/index.ts:258` — pressure/overflow trigger, optional tool-result pruning, threshold check, retained-tail range, bounded retries;
- `packages/compaction/compaction-basic/src/config.ts:133` — model-window ratio becomes `thresholdTokens`; retention must remain below the threshold;
- `packages/compaction/compaction-basic/src/summarizer.ts:121` — chooses the summary model route, adds a compaction instruction, marks the request purpose as `compaction`, and records usage;
- `packages/compaction/compaction-basic/src/index.ts:368` — manual compaction requires an idle agent and flushes the result durably.

## The deeper result

The comparison unit is not the first prompt. It is the state transition between turns.

A harness makes at least five decisions that affect the next answer:

1. What entered before the user prompt?
2. What was discovered with tools?
3. What exact prefix was reused by the provider cache?
4. What state was persisted by the product?
5. What detail was eventually pruned or summarized away?

The first-turn tool path tells us how the harness seeks evidence. The follow-up tells us whether it can reuse that evidence. The cache receipt tells us whether reuse was cheaper at the provider boundary. Compaction tells us what happens when the exact past no longer fits.

Those are separate receipts. A product can pass one and fail another.

## Method and limitations

- One main run and one same-session follow-up per product; this is not a replicated benchmark.
- Different models, subscriptions, defaults, and token-accounting boundaries; no cost, speed, or intelligence ranking is supported.
- Cloud products used existing local authentication. No credential value was read, copied, or stored.
- DSH's headless run and SDK follow-up composition used the same local model but different exposed tool surfaces; only the SDK run is used to test the same-session API. It is not used in the first-turn tool-path comparison.
- DSH's SDK composition issued a broad filesystem metadata search despite the narrow fixture scope. Read-only prevented writes, but it did not by itself confine reads. This is a safety-boundary observation from one composition, not a universal DSH claim.
- Raw machine events are retained privately. The article should show only sanitized output and receipts.
