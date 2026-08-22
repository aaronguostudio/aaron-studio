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
