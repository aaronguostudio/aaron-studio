# Codex First-Request Experiment

Measured: 2026-08-16  
Machine: Aaron's local Mac  
CLI: `codex-cli 0.147.0-alpha.6.5`  
Model: `gpt-5.6-sol`  
Reasoning effort: `xhigh`  
Prompt: `Reply with exactly: OK. Do not use tools.`  
Output: five or six output tokens; no tool calls

## Question

How many input tokens does Codex send before completing a trivial first request, and how much of that footprint comes from the core harness, the current workspace, and installed plugin/app surfaces?

This experiment measures the first request's **gross input footprint**. It does not claim that every input token was billed at the uncached rate, and it does not convert ChatGPT/Codex subscription usage into a dollar invoice.

## Controls

Every run used:

- a new ephemeral session;
- the same model, reasoning effort, prompt, and read-only sandbox;
- `--ignore-user-config` and `--ignore-rules`;
- no tool calls and a one-word answer;
- the CLI-reported `turn.completed.usage` object as the measurement source.

Three configurations isolate the layers:

1. **Core harness:** empty temporary directory, plugin/app surfaces disabled.
2. **Core + workspace:** Aaron Studio as the working directory, plugin/app surfaces disabled.
3. **Full project stack:** Aaron Studio as the working directory with installed plugin/app surfaces enabled.

Representative commands:

```bash
# Core harness
codex exec --json --ephemeral --ignore-user-config --ignore-rules \
  --skip-git-repo-check -C "$EMPTY_DIR" -s read-only \
  -m gpt-5.6-sol -c model_reasoning_effort='xhigh' \
  --disable plugins --disable apps --disable recommended_plugins \
  "Reply with exactly: OK. Do not use tools."

# Core + Aaron Studio workspace
codex exec --json --ephemeral --ignore-user-config --ignore-rules \
  -C /Users/aaronguo/Work/ag/aaron-studio -s read-only \
  -m gpt-5.6-sol -c model_reasoning_effort='xhigh' \
  --disable plugins --disable apps --disable recommended_plugins \
  "Reply with exactly: OK. Do not use tools."

# Full Aaron Studio stack
codex exec --json --ephemeral --ignore-user-config --ignore-rules \
  -C /Users/aaronguo/Work/ag/aaron-studio -s read-only \
  -m gpt-5.6-sol -c model_reasoning_effort='xhigh' \
  "Reply with exactly: OK. Do not use tools."
```

## Result

| Layer | First-request input tokens | Increment | Share of full median |
|---|---:|---:|---:|
| Core Codex harness, protocol, core tools, and the small user prompt | 12,867 | — | 73.1% |
| Aaron Studio workspace context | 15,813 | +2,946 | 16.7% |
| Installed plugin/app surface | 17,606 median | +1,793 | 10.2% |

The plugin-disabled controls were stable across repeated runs: three empty-directory runs each reported 12,867 input tokens, and five project-directory runs each reported 15,813. Five full-stack runs reported 17,606, 17,755, 17,755, 17,547, and 16,738 input tokens (median 17,606; range 16,738-17,755).

The first request in the existing desktop thread was larger still: 22,573 input tokens, including 11,008 cached input tokens. That thread was not a clean control because it included the user's real request, the desktop tool surface, project instructions, and session-specific context, so it is supporting observation rather than the headline measurement.

## Cache Observation

Cache reads were not deterministic across fresh CLI processes. Identical-looking trials reported `cached_input_tokens` values of 0, 5,888, or 9,984. The controlled comparison therefore uses gross `input_tokens` for the footprint and treats cached input as a separate economic variable.

This distinction is central:

- **Context footprint:** how much context occupies the request and the model's attention budget.
- **Marginal input bill:** how much of that footprint is a cache miss, cache write, or discounted cache read under the provider's current policy.

Prompt caching can reduce the second number without reducing the first.

## What The Experiment Supports

- A trivial first request on this stack carries a five-figure input footprint.
- On this setup, the core harness is the largest layer; the workspace and plugin/app surfaces add meaningful but smaller increments.
- The capability tax is architectural, not proportional to the length of the user's question.
- Gross input tokens and uncached billable input must be reported separately.

## What It Does Not Support

- It is not a model-quality comparison.
- It does not prove that smaller first requests produce cheaper completed tasks; richer context may reduce retries and improve success.
- It does not attribute every token inside the core 12,867 without access to the rendered provider request.
- It does not establish a universal Codex number. Results are pinned to the CLI version, model, installed surfaces, date, and machine above.
- It does not prove why a particular cache read did or did not occur. Fresh-process cache behavior was observed, not controlled through a provider cache key.

## Reproduction Rule For Publication

Re-run the three configurations immediately before publication. If the full-stack median moves materially, update the title, opening, table, claim ledger, and any derived percentages together.

---

# Four-Harness Benchmark Protocol (planned 2026-08-23)

## Research Question

When the same person begins the same small coding task in **DeepSeek Harness (DSH)**, **Codex CLI**, **Claude Code**, and **Grok Build**, what can be observed about:

1. the first request's input footprint;
2. reuse in a continued session and a fresh process;
3. the visible cache counters and time-to-first-token; and
4. the harness policy for project instructions, tools, skills, plugins, and MCP capabilities?

This is a harness comparison, not a model-intelligence, API-price, or subscription-price ranking. Each product keeps its normal provider and model identity. The article may compare **shapes, controls, and observed behavior**, but must not turn unequal token counters into a single vendor leaderboard.

## Evidence Plan

Every result row must retain a private raw artifact and a publishable summary.

| Record | Private raw artifact | Publishable summary |
|---|---|---|
| Environment | CLI `--version`, OS, date/time, selected model, working directory mode, relevant non-secret flags | Versions, date, model label, `clean` or `project` workspace |
| Request | Machine-readable CLI/debug output or DSH event log | Prompt ID, session state, input/output/cache counters that the product actually exposed |
| Timing | Monotonic start time and first output event where the CLI exposes it | Median and range, never a single anecdotal latency |
| Capability surface | Explicit configured tools/skills/plugins/MCP and their count where inspectable | `default`, `minimal`, or `opaque`; never an invented count |

Raw logs stay outside the publishable article and are redacted for account identifiers, filesystem paths, repository content, and credentials before any excerpt is used. A missing usage field is a result: write `not exposed`, not an estimate.

## Controlled Conditions

- Run in a dedicated, non-sensitive fixture workspace and in Aaron Studio as two separate workspace modes.
- For each harness, separate a **personal-default** cohort (the daily installed configuration) from a documented **minimal** cohort (for example, no user config, bare mode, or disabled extension surface). An empty working directory does not by itself remove globally loaded hooks, plugins, skills, or connectors.
- Use a fixed, no-tool prompt: `Reply with exactly: OK. Do not use tools.`
- Pin the exact CLI version and selected model for each harness. Do not claim model equality where product access prevents it.
- Disable automatic writes and use the least-permissive available mode. Terminate a run if it tries to call a tool, read a non-fixture file, or write a file.
- Run each cold/warm condition five times when its usage telemetry is exposed. If a product does not expose input usage, run three times for timing and session behavior only.
- Run the products serially, rather than concurrently, so local CPU, network, and account concurrency do not obscure the results.
- Preserve the earlier 2026-08-16 Codex result above as a historical baseline. Do not merge it with this new versioned benchmark.

## Test Cards

| ID | Question | Sequence | Primary observation |
|---|---|---|---|
| H0 | What exactly was tested? | Capture versions, model labels, safe-mode flags, workspace mode, and enabled extensions before each run. | Reproducibility boundary |
| H1 | What is the cold-start receipt? | New process and new session; fixed no-tool prompt. | Input footprint, cache write/read if exposed, first-output latency |
| H2 | What changes on the next turn? | Continue the same session; append `Reply with exactly: READY. Do not use tools.` | Cache reuse, added input, continuation semantics |
| H3 | Does a new process retain reusable context? | New process, new session, same H1 prompt after a short controlled delay. | Cross-process cache reuse only if the product exposes it |
| H4 | What does the workspace add? | Repeat H1 and H2 in the fixture workspace and Aaron Studio. | Project-instruction and discovered-context increment, if measurable |
| H5 | What does the capability surface add? | Use the product's documented minimal/bare/disabled-extension mode where it exists; otherwise record `not independently controllable`. | Eager versus deferred/opaque capability loading |
| H6 | What breaks reuse? | Only where the product gives a documented request-context control, repeat H2 after changing one stable instruction or tool description. | Cache invalidation sensitivity; not inferred from an opaque CLI |

H1-H5 are the article's required core. H6 is optional: a product that does not expose a controlled prefix must be described as opaque rather than reverse-engineered from a single cache miss.

## Telemetry Normalization Gate

Before any cross-harness number appears in prose or a chart, build a raw-field dictionary for the exact CLI version used. Preserve each product's field names first; normalize only when its documentation or a trace proves the relationship.

- Do **not** assume `input_tokens` means gross request size. It may be uncached input, total input, or one phase of a multi-request cache warm-up.
- Do **not** sum `cache_read`, `cache_write`, and `input` counters unless the product documents them as disjoint for that exact event type.
- A CLI can pre-warm or reuse a cache during startup. In that case report the event sequence, not an invented one-request total.
- Do not compare one product's cache-write tokens with another product's cache-read tokens as if they were the same unit of work.
- The first publishable comparison table has two layers: raw reported counters (always) and normalized footprint (only where supported). `Not derivable` is an acceptable value.

## Stateful Continuation Gate

H2 measures a continued session, so it cannot belong to the fully ephemeral H1/H3 cohort. Keep the two evidence paths distinct.

- **Ephemeral cohort:** H1 and H3 only. Codex uses `--ephemeral`; Claude uses `--no-session-persistence`. These runs deliberately cannot resume.
- **Stateful product cohort:** H2 uses a newly created, explicitly selected session under the product's normal persistence behavior. Do not use a convenience selector such as `--last`; retain the exact session identifier only in the private run manifest, never in this repository or the article.
- **Isolation boundary:** Codex, Claude Code, and Grok Build currently persist resumable sessions in their own product state. Treat those as opted-in product-state tests, not temporary-workspace tests. DSH's headless session store can instead be pointed at its temporary `DSH_HOME`.
- A product without a safe, observable resume path receives `H2: not run`, rather than a fabricated warm-session result.

## Per-Harness Observability Contract

| Harness | Current local entry point | Expected evidence | Boundary to preserve |
|---|---|---|---|
| DSH | local clone, pinned commit at run time | Append-only session event log and separate uncached/cache token fields when the selected provider returns them | Use a temporary `DSH_HOME` and explicit headless profile; provider cache availability remains external and best-effort |
| Codex CLI | `codex exec --json` | JSONL event stream and completion usage when emitted | API cache controls are not presumed to be Codex CLI controls |
| Claude Code | `claude -p --output-format stream-json` with a debug file when needed | Stream events, session behavior, and any usage fields actually emitted | Claude API prompt-caching and tool-search documentation do not prove Code defaults |
| Grok Build | `grok --single --output-format streaming-messages-json` with a debug file when needed | Native/Anthropic-wire-format stream events, session behavior, and exposed usage | xAI API cache-key behavior is not presumed to be set by Grok Build |

The exact command lines belong in the run manifest after a read-only preflight has verified their flags. Do not put live account tokens, cookies, or a copied full system prompt in this document.

## Interpretation Rules

- Report **gross input**, **cached input**, **cache write**, and **uncached input** as separate fields whenever a product exposes them. Do not subtract one vendor's counters from another vendor's differently defined total.
- A cache hit reduces marginal processing or billing under the provider policy; it does not prove the cached text disappeared from the model context.
- A lower first-request total is not a win unless the task-completion check remains equal. This initial benchmark therefore makes no quality ranking.
- Tool/skill counts may be compared only when the harness exposes the rendered definitions or a documented configuration count. UI menus and installed-package counts are not a proxy for model context.
- Treat changes in CLI version, model, reasoning effort, enabled extensions, workspace instructions, or provider account state as a new benchmark cohort.

## Stop Conditions

- Stop a harness run immediately if it attempts a tool call, file write, browser action, or access outside the fixture workspace.
- Stop and label the row `telemetry unavailable` if a product does not emit usage that can be cleanly attributed to the test turn.
- Do not make direct API calls merely to force cache behavior unless the account, exact per-run budget, and provider-specific credentials are explicitly approved for that second phase.
- Suspend publication if results cannot be reproduced within the same versioned cohort, if raw artifacts contain unredactable private context, or if the story becomes a price or model-quality ranking.

## Publication Shape

The article should open with DeepSeek Harness making the invisible receipt legible, then show the surprise that the same question enters three other harnesses through different doors. The main visual is four compact receipts, not a giant API matrix. The reader leaves with one practical audit: inspect what your agent loads before the task, what it can reuse, and what it only needs on demand.
