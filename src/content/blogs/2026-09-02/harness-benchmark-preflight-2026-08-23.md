# Four-Harness Benchmark Preflight — 2026-08-23

Status: **calibration only; not publishable benchmark data**

## Why this exists

Two single-turn, read-only probes established that the current local products can emit useful but differently shaped telemetry. They did not establish a cross-harness token ranking. The run transcript is available only in the active task history; no raw system prompts, connector lists, session IDs, or credentials are stored in this repository.

## Shared safety boundary

- Empty temporary working directory.
- Prompt: `Reply with exactly: OK. Do not use tools.`
- No tool-call events observed.
- No file writes requested or performed by the model.
- One probe per product; no medians, confidence interval, or quality conclusion.

## Codex CLI — personal-default cold probe

- CLI: `codex-cli 0.149.0-alpha.4.1`.
- Invocation mode: `exec --json --ephemeral`, read-only sandbox, empty non-repository directory.
- Completion usage fields emitted: `input_tokens: 20818`, `cached_input_tokens: 9984`, `cache_write_input_tokens: 0`, `output_tokens: 5`.
- Caveat: the current CLI also emitted a warning that an under-development `chronicle` feature was enabled. This run is therefore a personal-default observation, not a stable minimal-control result.
- Interpretation: record the field names exactly. The preflight does not derive a gross request total or compare this row numerically with another product.

## Claude Code — personal-default cold probe

- CLI: `2.1.241`; selected model reported by the CLI: `claude-opus-5`.
- Invocation mode: one-shot print mode, no session persistence, plan permission mode, empty temporary directory.
- Completion usage fields emitted: `input_tokens: 2`, `cache_creation_input_tokens: 15505`, `cache_read_input_tokens: 15908`, `output_tokens: 5`; reported first-token timing was about 1.9 seconds.
- Startup trace showed globally configured hooks, skills, plugins, and tool/connector surface were still initialized despite the empty directory. Do not publish their names or counts from this trace.
- Interpretation: this is a concrete counterexample to treating `input_tokens` as a universal first-request footprint. The event includes cache creation and cache read accounting whose relationship to a rendered product request must be established before normalization.

## Codex CLI — minimal cold probe

- CLI: `codex-cli 0.149.0-alpha.4.1`.
- Invocation mode: `exec --json --ephemeral`, empty non-repository directory, read-only sandbox, `--ignore-user-config`, `--ignore-rules`, and disabled plugin/app/recommended-plugin features.
- Completion usage fields emitted: `input_tokens: 12900`, `cached_input_tokens: 8960`, `cache_write_input_tokens: 0`, `output_tokens: 6`.
- No tool-call event was emitted.
- Interpretation: this is the current minimal Cohort H1 sample. It is close to, but not interchangeable with, the 2026-08-16 `12,867` historical control because the CLI version and cache state changed.

## Claude Code — minimal availability check

- Candidate minimal mode: `--bare --disable-slash-commands` with plan permission and no session persistence.
- Result: the process deliberately ignores OAuth/keychain credentials in bare mode and requires an API key or API-key helper. It returned `Not logged in` before any model request; all usage fields were zero.
- Interpretation: record this as `minimal auth unavailable`, not as a zero-token result. Do not change login state or read credentials to make the benchmark pass.

## Grok Build — restricted default cold probe

- CLI: `grok 1.0.5`; model reported by the CLI: `grok-4.6`.
- Invocation mode: headless single turn, empty temporary directory, plan permission, one maximum turn, no subagents, and web search disabled.
- Completion usage fields emitted: `input_tokens: 15137`, `cache_read_input_tokens: 1408`, `cache_creation_input_tokens: 0`, `output_tokens: 35`.
- No tool call was emitted. The startup event still reported a global tool, skill, slash-command, and MCP surface.
- Interpretation: this is a restricted personal-default cohort, not a minimal cohort. Disabling web search and subagents does not remove the other default prompt surface.

## DeepSeek Harness — headless availability check

- The checked-out DSH command documents `dsh --profile headless "task"` as the one-shot entry point and its source exposes append-only session evidence.
- Current machine state: only a `web` profile exists under `~/.dsh/profiles`; no headless profile is installed.
- A no-request configuration dump was run with a temporary `DSH_HOME`, `DSH_TELEMETRY_DISABLED=1`, and read-only permission. It selected the default `deepseek-official` / `deepseek-v4-flash` agent, local JSONL session persistence under that temporary home, and a visible default tool/skill/agent-instruction surface.
- Result: no DSH model request was made and no existing DSH profile, credential, or telemetry endpoint was used. A live DSH H1 still needs an isolated temporary profile and an explicitly approved provider-auth path; credentials will not be inspected or copied to make it work.

## Decision

The comparison is viable, but only under two explicit cohorts per product: **personal-default** and **minimal**. Current result: Codex has one safe minimal H1 sample; Claude minimal is intentionally blocked by its auth boundary; Grok has one restricted-default H1 sample; DSH has a safe, isolated configuration observation but no live model request. The next phase must complete raw-field dictionaries and collect five serial H1 repetitions only for cohorts whose telemetry can be normalized. H2 moves to a separate, explicitly labelled stateful-product cohort because the other three products resume from their product-level stores rather than the temporary workspace.
