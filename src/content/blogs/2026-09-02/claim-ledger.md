# Claim Ledger

Verified on: 2026-08-16

## Claims

| ID | Claim | Type | Source | Source date | Confidence | Article use | Freshness / caveat |
|---|---|---|---|---|---|---|---|
| C1 | With Codex CLI 0.147.0-alpha.6.5, `gpt-5.6-sol`, `xhigh`, and an eight-word no-tool prompt, Aaron's full Aaron Studio stack reported a five-run median of 17,606 first-request input tokens (range 16,738-17,755). | personal observation | `entry-fee-experiment.md` | 2026-08-16 | high | Opening and headline receipt | Pin title to this version/date; re-run before publish. |
| C2 | With plugin/app surfaces disabled in an empty directory, three repeated runs each reported 12,867 input tokens. | personal observation | `entry-fee-experiment.md` | 2026-08-16 | high | Core harness layer | This layer still includes the small user prompt and unitemized core instructions/protocol/tools. |
| C3 | Moving the same plugin-disabled run into Aaron Studio raised input to 15,813, an increment of 2,946 tokens. | personal observation | `entry-fee-experiment.md` | 2026-08-16 | high | Workspace layer | Call this workspace context, not AGENTS.md alone. Repo metadata and discovered workspace surfaces may also contribute. |
| C4 | Re-enabling installed plugin/app surfaces raised the full-stack median from 15,813 to 17,606, an increment of 1,793 tokens. | personal observation | `entry-fee-experiment.md` | 2026-08-16 | high | Plugin/app layer | The full surface varied across runs; use median and range. Do not attribute the whole delta to skill descriptions alone. |
| C5 | The controlled full median decomposes to roughly 73.1% core, 16.7% workspace increment, and 10.2% plugin/app increment. | inference | C1-C4 arithmetic | 2026-08-16 | high | Itemized table | Percentages describe this stack only. |
| C6 | Fresh CLI trials reported cache reads of 0, 5,888, or 9,984 tokens, so gross footprint and cache-adjusted marginal input must be reported separately. | personal observation + inference | `entry-fee-experiment.md` | 2026-08-16 | high | Two-account mechanism | Experiment did not control a provider cache key and cannot explain individual hits. |
| C7 | In HuaShu's DSH rc.6 run, the first request contained 13,838 uncached input tokens; the 29-token user question leaves a 13,809-token entry fee. | fact (third-party measurement) | [Orange Book v260814](https://github.com/alchaincyf/deepseek-harness-orange-book), §06 | 2026-08-14 (snapshot 2026-08-13) | high | External comparison | User experiment, not official benchmark; pinned to DSH rc.6 and commit `47f9438`. |
| C8 | HuaShu's differential weighing attributed 6,510 tokens to 25 tool definitions, 6,242 to a 57-skill catalog, 844 to system prompt, 129 to runtime, 82 to protocol, and 29 to the question; component sum differs from logged total by two tokens because of differential-measurement rounding. | fact (third-party measurement) | Orange Book §06; local cross-check `13-orange-book-critic.md` | 2026-08-14 | high | DSH receipt | Keep the ±2 caveat. |
| C9 | The DSH skill catalog increased the estimated boot footprint from about 7,600 to 13,838 (+82%), but the lower baseline was subtraction rather than a clean-machine run. | fact (third-party measurement) | Orange Book §06 | 2026-08-14 | high | Portable assets have carrying cost | The author also found two catalog provenance mismatches; do not overstate exact per-skill attribution. |
| C10 | DeepSeek caching is default-on, exposes cache-hit and cache-miss token counts, uses complete matching prefix units, and is best effort rather than guaranteed. | fact | [DeepSeek Context Caching](https://api-docs.deepseek.com/guides/kv_cache) | verified 2026-08-16 | high | Cache mechanism | Cache behavior may evolve; re-check before publish. |
| C11 | DeepSeek's cache launch documentation states that cache storage uses 64-token units; HuaShu's observed hit counts were multiples of 64. | fact + corroborating observation | [DeepSeek cache launch note](https://api-docs.deepseek.com/news/news0802); Orange Book §06 | 2024-08-02 / 2026-08-14 | high | Concrete cache example | Current caching implementation later added prefix-unit persistence rules; use 64 only as documented storage granularity, not the complete modern algorithm. |
| C12 | OpenAI says prompt-cache hits require exact prefix matches; static instructions and examples should come first, variable data later, and tools/images must remain identical between requests. | fact | [Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/) | 2026 | high | Harness controls cache eligibility | Do not attach current pricing without current model pricing. |
| C13 | OpenAI usage reports cached input tokens; the original automatic caching design applied to prompts over 1,024 tokens in 128-token increments. | fact | [Prompt Caching in the API](https://openai.com/index/api-prompt-caching/) | 2024-10-01 | high for mechanism, medium for current thresholds | Usage explanation | Threshold statement is historical; omit if current docs cannot be re-verified at publication. |
| C14 | Anthropic says tool definitions and accumulated tool results consume context; a typical GitHub/Slack/Sentry/Grafana/Splunk setup can consume about 55k tokens in definitions before work begins. | fact (vendor documentation/example) | [Tool search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) | verified 2026-08-16 | high | Production-scale case | Label 55k as Anthropic's typical multi-server example, not an independent benchmark. |
| C15 | Anthropic says tool search typically reduces that upfront definition load by more than 85%, loading only 3-5 tools; it recommends eager calling for fewer than 10 tools or very small/frequently used toolsets. | fact (vendor documentation) | Anthropic Tool search tool | verified 2026-08-16 | high | Deferred loading solution and boundary | “Typically” is not a universal guarantee. |
| C16 | Anthropic's `defer_loading` removes a tool from the initial system-prompt tool section and can add deferred tools without invalidating the existing prompt cache. | fact | [Anthropic Tool reference](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-reference) | verified 2026-08-16 | high | Distinguish footprint reduction from caching | Provider-specific implementation, used as a concrete design pattern. |
| C17 | Anthropic states that prompt caching reduces what is paid for repeated definitions but does not reduce the number of tokens in context. | fact | [Manage tool context](https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context) | verified 2026-08-16 | high | Central two-account claim | None beyond provider specificity. |
| C18 | Anthropic's current pricing docs list 5-minute writes at 1.25x base input, one-hour writes at 2x, and cache reads at 0.1x. | fact | [Anthropic pricing](https://docs.anthropic.com/en/docs/about-claude/pricing) | verified 2026-08-16 | high | Show why first write and later read are economically different | Pricing is time-sensitive; re-check on publication day or use ratios without model dollar amounts. |
| C19 | In HuaShu's same-model, same-task DSH comparison, Code/PTC mode moved tool definitions into generated SDK/system text rather than eliminating them, increasing first input by about 9%; on one three-small-files task it was much slower and used much more output. | fact (third-party single experiment) | Orange Book §08 | 2026-08-14 | high for mechanism, medium for performance magnitude | Counterintuitive “moving is not removing” case | Performance result is one run in the regime where intermediate outputs are tiny; never generalize “PTC is 14x slower.” |
| C20 | A lower first-request footprint is not necessarily a lower completed-task cost because richer context may improve success or reduce retries. | inference / counterargument | Mechanism plus Anthropic eager-vs-search boundary | 2026-08-16 | high | Prevent token-minimization conclusion | Requires outcome denominator; not directly measured in Aaron's experiment. |
| C21 | The operator metric should be cache-adjusted input per successful completed task, with fresh-session count and success rate in the denominator. | judgment | Aaron's synthesis of C1-C20 and prior canon | 2026-08-16 | high | Conclusion and reusable rule | Present as Aaron's decision rule, not a provider fact. |

## Unsupported Or Excluded Claims

Record claims considered but removed because the evidence was weak, stale, circular, or too promotional.

- “Every Codex session costs 17,606 tokens.” Excluded: the number is stack/version/date-specific and full runs ranged by 1,017 tokens.
- “Aaron's skills cost 1,793 tokens.” Excluded: the ablation disables plugin/app surfaces as a group; it does not isolate skill descriptions.
- “Every subagent repays the complete entry fee.” Excluded as universal: inheritance/fork behavior differs by harness. May state conditionally for fresh sessions.
- “Prompt caching saves 50x/120x on the total bill.” Excluded: those are historical input-token price ratios for specific DeepSeek models; output and misses remain.
- “PTC/Code mode is 14x slower.” Excluded as a general claim: one small-task run only.
- “Tool search improves accuracy in every stack.” Excluded: Anthropic states degradation above 30-50 tools and provides a typical result, not a universal independent evaluation.
- “17,606 tokens equals a specific dollar amount.” Excluded: Codex subscription usage and model API pricing are not directly mapped by this experiment.

## Inference Boundaries

State which conclusions are Aaron's interpretation rather than direct claims made by the sources.

- “The first request is an architecture bill” is Aaron's interpretation of the measured layer decomposition.
- “Portable assets have carrying cost” combines Aaron's prior asset thesis with eager-loading measurements; it does not argue that the assets are waste.
- “Cache hit is billing optimization; deferred discovery is architecture optimization” is a synthesis of provider docs.
- “Uncached input per successful completed task” is Aaron's operator judgment and should be introduced as such.
- The article may infer that fresh sessions multiply fixed cost only when the harness starts them with a new first-request envelope; it must not claim identical inheritance across products.

## Verification Summary

- Primary-source claims checked against the linked page: yes
- Numbers and dates checked: yes; time-sensitive prices require publication-day refresh
- Promotional sources labeled and balanced: yes
- Article distinguishes fact, inference, and judgment: yes

Decision: PASS FOR OUTLINE, subject to publication-day rerun and freshness check
