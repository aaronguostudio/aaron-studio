---
title: "The 17,606-Token First Request"
date: 2026-09-02
slug: agent-first-request-entry-fee
category: ai-native-systems
tags: [agent-harness, prompt-caching, tool-search, codex]
draft: true
---

# The 17,606-Token First Request

I asked Codex to do almost nothing:

> Reply with exactly: OK. Do not use tools.

It returned `OK.` The answer used six output tokens. Before it could answer, the first request carried a median of **17,606 input tokens**.

I measured the same fresh session five times, then removed one layer at a time:

```text
12,867  baseline Codex control: base harness, core tools, and tiny prompt
 2,946  Aaron Studio workspace context
 1,793  installed plugin and app surface
------
17,606  median first request
```

Those 17,606 tokens are an X-ray of what an agent loads before the task begins, not a dollar invoice or proof of waste.

That distinction changed the article I thought I was going to write. After [tearing down DeepSeek Harness](/blogs/deepseek-harness-teardown), I expected my shared skill catalog to be the largest cost. It wasn't. On my stack, nearly three quarters of the first request existed before Codex loaded my project context or installed plugin surface.

My conclusion is broader than “install fewer skills.” An agent's first request is an architecture bill, not a conversation bill. Caching can discount parts of that bill, but it doesn't remove them from context. Prompt length and the smallest possible boot sequence are the wrong targets. The useful operating metric is cache-adjusted input per successful completed task.

## The largest line item was the agent itself

I ran the experiment on August 16 with Codex CLI `0.147.0-alpha.6.5`, `gpt-5.6-sol`, and `xhigh` reasoning. Every trial started an ephemeral session, used the same read-only sandbox and the same eight-word instruction, and made no tool calls.

The first control ran in an empty temporary directory with plugin and app surfaces disabled. Three runs each reported exactly 12,867 input tokens. Then I changed only the working directory to Aaron Studio, still with plugins and apps disabled. Five runs each reported 15,813. That isolates a 2,946-token workspace layer: project instructions and other context Codex discovers by entering this repository.

Here is the full-project command. The other controls changed only the working directory and the plugin/app flags:

```bash
codex exec --json --ephemeral --ignore-user-config --ignore-rules \
  -C /path/to/aaron-studio -s read-only \
  -m gpt-5.6-sol -c model_reasoning_effort='xhigh' \
  "Reply with exactly: OK. Do not use tools."
```

Finally, I enabled the installed plugin and app surface. Five first requests ranged from 16,738 to 17,755 input tokens; the median was 17,606. I don't know which dynamic element caused that range, so the median is the claim and the range stays beside it. Using the median, the stack breaks down to 73.1% baseline control, 16.7% workspace increment, and 10.2% plugin/app increment.

I can't honestly split the baseline 12,867 any further. It includes Codex's base instructions, protocol, core tool definitions, runtime context, and my small prompt, but the CLI doesn't expose the rendered provider request as an itemized receipt. Calling all 12,867 “system prompt” would be fake precision.

The boundary is still useful. The baseline control was more than four times the workspace increment. If I had started by shortening `AGENTS.md` or deleting skills, I would have optimized the smaller side of the bill without seeing the larger one.

This is also why a universal number such as “a Codex session costs 17,606 tokens” would be wrong. Change the CLI version, model, tool surface, repository, or plugin catalog and the number moves. The measurement that travels is the ablation: hold the task constant, remove one layer, and let usage show where the footprint came from.

## DeepSeek's receipt had the opposite shape

The experiment I was reproducing came from HuaShu's [DeepSeek Harness Orange Book](https://github.com/alchaincyf/deepseek-harness-orange-book), measured on DSH `0.1.0-rc.6` at commit `47f9438` on August 13.

HuaShu extracted the first request from the session log, sent its components through the DeepSeek API with output capped at one token, and used differences in `prompt_tokens` to weigh each part. The logged first request contained 13,838 uncached input tokens. His actual question used 29. That left a 13,809-token entry fee.

The shape of his receipt was striking:

| Component | Tokens | Share |
|---|---:|---:|
| 25 tool definitions | 6,510 | 47.0% |
| Catalog of 57 local skills | 6,242 | 45.1% |
| System prompt | 844 | 6.1% |
| Runtime snapshot | 129 | 0.9% |
| Protocol overhead | 82 | 0.6% |
| User question | 29 | 0.2% |

The six differential measurements add to 13,836, two tokens below the logged truth, which he attributes to rounding in the method. More important, the skills were his own portable assets under `~/.agents/skills`, automatically discovered and listed even though the task used none of them. Removing their measured 6,242 tokens produces an estimated baseline of about 7,600, so the catalog increased the first request by roughly 82%. HuaShu is explicit that this baseline was subtraction, not a second run on a clean machine.

The comparison with my stack is more valuable than either number alone, but the categories are not identical: DSH exposed tool and skill blocks directly, while my Codex experiment could only ablate broader surfaces. In DSH, tools plus skills occupied 92% of the first request. In my Codex control, disabling the installed plugin and app surface removed about 10% of the full median, while the baseline control remained much larger.

Neither result invalidates the other. They expose a design choice. A harness decides which capabilities become fixed context, which live in project memory, and which arrive only when needed. There is no natural 13k or 17k “agent overhead.” The request assembler creates it.

This adds a cost dimension to the argument from my previous piece. The harness changes more than whether the model completes a task. It determines how much operating system the model must read before it can try.

## One request creates two different bills

Yet 17,606 doesn't tell me what I paid on any one run. Logical size and marginal price aren't the same thing.

The **context footprint** is the full input the model receives. It occupies the context window and gives the model more instructions, tools, and choices to process. The **marginal input bill** depends on how much of that footprint is a cache miss, a cache write, or a discounted cache read under the provider's current rules.

My trials made this separation impossible to ignore. Across repeated fresh-process trials, closely matched variants reported `cached_input_tokens` of 0, 5,888, or 9,984. The gross first-request input remained five figures, but the amount served from cache changed. I didn't control a provider cache key, so I won't invent a reason for each hit. The defensible conclusion is narrower: one cache-hit screenshot cannot tell me how large my agent is.

The providers expose the same split in different ways. DeepSeek's [context caching](https://api-docs.deepseek.com/guides/kv_cache) is automatic and best effort. It reports hit and miss tokens separately, and reuse depends on matching complete prefix units. Its original [disk-cache launch note](https://api-docs.deepseek.com/news/news0802) says storage is allocated in 64-token units. HuaShu's observed hit counts were all multiples of 64, and one fresh process launched 2 minutes 21 seconds later hit 13,824 of the 13,838-token opening request.

OpenAI makes the assembly rule equally plain in its explanation of the [Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/): cache hits require exact prefix matches. Static instructions and examples belong at the beginning; variable information belongs at the end. Images and tools must also remain identical. The provider stores the reusable computation, but the harness decides whether the bytes line up.

Anthropic's documentation draws the economic boundary even more sharply. A five-minute cache write is currently priced at 1.25 times base input, while a cache read is 0.1 times base input. Its guide to [managing tool context](https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context) states the important part directly: prompt caching reduces what you pay for repeated tool definitions; it does not reduce the number of tokens in context.

That is the two-ledger rule. A stable 17k prefix may become inexpensive to reread. It is still a 17k prefix. Cache discipline protects the bill. It doesn't return the context space or reduce the number of capabilities competing for the model's attention.

## Moving tool definitions is not removing them

DeepSeek's Code mode, called PTC in its Chinese interface, provides a clean counterexample to a common optimization story.

In standard mode, the model sees roughly 25 native tools and calls them one by one. In Code mode, it sees one `run_code` entry and writes a TypeScript program that can call the underlying tools internally. Looking only at the visible tool list, 25 became one. It appears that the fixed cost should collapse.

HuaShu inspected the rendered inputs and found something else. The native tool parameter text shrank from 26,894 characters to 897, but the system text grew from about 4,100 characters to 35,643. The definitions had been converted into a generated SDK and moved into the system prompt. In his comparison of the first-request shape, Code mode used about 9% more input, not less.

Code mode can still save money later. Its program can read several files, filter large intermediate results, and return only the final slice to the model. What it can avoid is the repeated transport of intermediate tool output. It doesn't automatically avoid describing the tools.

On one same-model task involving three small files, HuaShu's Code-mode run was dramatically slower and generated far more output than standard mode. That result has a hard boundary: it was one run on a tiny task with almost no large intermediate data to hide, the exact regime where programmatic orchestration has little to win. The durable finding is that the UI's one-tool surface still carried the underlying schemas. The dramatic speed ratio belongs to that one small task.

This is a recurring failure in agent cost discussions. We count tool names, MCP servers, or config entries instead of measuring the rendered request. The receipt is the architecture. The label is not.

## The architectural move is to stop loading the entire menu

Caching is the right answer when a large capability surface is stable and frequently reused. When most capabilities are irrelevant to the current task, cheaper rereading solves the wrong problem. Defer them.

Anthropic's [tool search documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) gives a production-scale example: a typical setup combining GitHub, Slack, Sentry, Grafana, and Splunk can consume about 55,000 tokens in definitions before Claude does any work. Anthropic also says tool-selection accuracy degrades once the model must choose among roughly 30 to 50 tools.

Its tool-search design keeps those definitions out of the initial context. The model begins with a search tool, discovers what the task needs, and receives three to five relevant definitions. Anthropic says this typically cuts upfront tool-definition tokens by more than 85%. The `defer_loading` mechanism also preserves the stable cache prefix when a new deferred tool is added to the catalog.

Those are vendor figures, not an independent benchmark, and Anthropic publishes the exception beside the recommendation. With fewer than ten small tools, or when every tool is used frequently, eager loading can be simpler and faster. Search adds a round trip. Dynamic discovery is not free.

The deeper decision is about capability delivery. My skills remain valuable because they capture judgment I can carry between Codex, Claude Code, and other harnesses. Their portability is an asset. But an owned asset doesn't need to appear in every model request. A company can keep a thousand runbooks without making every employee read all thousand before answering an email.

The same rule should govern an agent stack: keep common, high-value capabilities in the default surface; retrieve the long tail when the task calls for it.

## Optimize completed work, not an empty hello

There is an obvious objection to my experiment. A 17,606-token first request could be a bargain if it prevents two failed attempts. A 5,000-token minimalist agent could cost more if it lacks the rules and tools to finish.

I agree. That objection changes the denominator.

I would not optimize my stack for the cheapest possible `OK.` I would measure three things: the gross boot footprint, the cached and uncached share, and the number of fresh sessions created per successful task. A new subagent only multiplies the entry cost when the harness starts it with a fresh request envelope; inheritance differs across products, so raw agent count isn't enough.

The operating equation I now use is deliberately simple:

```text
entry cost per successful task
≈ fresh sessions × cache-adjusted first-request input ÷ success rate
```

It isn't an accounting standard, and it isolates only the entry layer. Full task economics still need output tokens, tool or service charges, latency, and human review. The equation is a way to prevent a local boot-token saving from making the overall system worse.

The practical audit takes less than an hour. Run a one-word, no-tool request and save the usage receipt. Disable workspace context, plugins, and MCP surfaces one layer at a time. Report gross, cached, and uncached input separately. When tool definitions reach five figures or selection becomes noisy, test deferred loading. Then put the capabilities back when they measurably improve completion or remove downstream work.

My 17,606-token `OK` was not proof that Codex is bloated. It was proof that I had never itemized the operating system I asked Codex to load.

That is the rule I am carrying forward: every capability in the default context must earn the right to appear in every first request by improving the economics of completed work.

---

*Next in this series: what changes when AI makes process cheap but leaves judgment expensive. Subscribe to follow the DeepSeek Harness experiments.*
