---
title: "AI Made Process Cheaper. Judgment Is Still Expensive."
date: 2026-08-26
slug: ai-made-process-cheaper-judgment-is-still-expensive
category: ai-native-systems
tags: [harness-engineering, organizational-capital, agentic-coding]
---

# AI Made Process Cheaper. Judgment Is Still Expensive.

Three engineers. Five months. Roughly one million lines of code. About 1,500 pull requests. Zero lines written directly by a human.

Those are [OpenAI’s reported numbers](https://openai.com/index/harness-engineering/) from an internal product built with Codex. The company estimates that the team built it in a tenth of the time manual coding would have required.

But the million lines aren’t the most interesting part of the story. The revealing choice was how the team organized the work around them: it introduced architectural constraints that most companies postpone until they have hundreds of engineers. Strict dependency directions, custom linters, structural tests, repository-local knowledge, and feedback loops weren’t late-stage governance. They were early prerequisites.

Execution became cheaper, so structure moved earlier.

I had just seen the same inversion in a very different place. [DeepSeek Harness](/blogs/deepseek-harness-teardown) accumulated 12,293 commits in 64 days. Behind that output sat 683 decision notes, mechanical gates, documentation budgets, archived reasoning, and postmortems designed to end in executable checks. A process note written on the project’s second day stated the principle directly: agents follow enforced gates more reliably than prose conventions, and “a lot of work” is no longer a cost argument when agents do the labor.

Two agent-native systems arrived at the same conclusion. AI doesn’t remove process. It changes its economics.

Good process can now become organizational capital: expensive to judge once, cheap to apply across thousands of future actions. That shifts the scarce input upward. The hard work becomes deciding which judgments deserve to be encoded, which exceptions still require a person, and which old rules have stopped earning their keep.

## Cheap execution pulled structure forward

The old software process was built around scarce execution. Code took time to write. Tests took time to build. Documentation competed with delivery. Every new rule created another obligation for the same people already doing the work.

That made “this is too much process” a legitimate economic objection. A design note for every meaningful change might improve memory, but it could also consume the team that was supposed to ship the product. Architecture governance, custom linters, and exhaustive decision records usually arrived after the organization was large enough to pay for them.

Agents weaken that trade-off. They can write the implementation, draft the test, update the design record, review the diff, and repair a failing check. A rule encoded once can be applied at machine speed without another meeting. The marginal cost of executing process falls with the marginal cost of producing code.

OpenAI’s experiment makes the inversion visible. The team didn’t simply use Codex as a faster programmer. Its engineers redesigned the repository so an agent could understand the business domain, launch the application, inspect logs and metrics, drive the interface, review its own work, and recover from failure. Constraints became leverage because the agent could consume and execute them directly.

This is also what changed my view of DeepSeek Harness. I went into the repository looking for clever agent architecture. I spent several days tracing it with fourteen analysis agents and checking hundreds of source-level claims. The code was interesting. The operating system around the code was more important.

The repository records rejected ideas so a future agent has to defeat the old reasoning rather than unknowingly reopen the debate. It freezes obsolete history outside default search so stale facts don’t outrank current ones. Its postmortems are expected to produce a new verifier or test, then demonstrate that the protection turns red when the original failure is restored.

This is not documentation as a record of work. It is documentation, tests, and history becoming part of the production system.

## A harness is organizational capital made executable

Economists have a useful way to think about this. New general-purpose technologies rarely create their full value through the technology alone. In [*The Productivity J-Curve*](https://www.aeaweb.org/articles?id=10.1257/mac.20180386), Erik Brynjolfsson, Daniel Rock, and Chad Syverson describe the complementary investments required around technologies such as AI: new processes, products, business models, and human capabilities.

Those investments often look like cost before they look like output. A company buys a new technical capability, then has to redesign how work moves before the productivity gains arrive. Much of what it builds is intangible organizational capital—real assets that conventional accounting struggles to see.

That distinction changes the investment question. Model access is rented capability: every competitor can buy another subscription or API call. The acceptance criteria, evaluation sets, operating rules, decision history, and recovery paths built around that capability accumulate inside the organization. One is a recurring input cost. The other can become an owned asset that improves the return on every future run.

A harness is that organizational capital made executable.

It tells an agent what the organization knows, which tools it can use, what boundaries it must respect, what evidence counts, and when it must return a decision to a human. It turns part of the company’s operating model into an environment the agent can read and act inside.

That definition is broader than a prompt and more useful than a tool list. A prompt expresses intent for one run. A harness preserves operating judgment across runs. It includes the context assembly, permissions, skills, tests, evaluations, decision history, observability, and recovery paths that make useful work repeatable.

This also explains why AI adoption often disappoints when it is treated as tool access. The [2025 DORA report](https://dora.dev/research/2025/dora-report/) describes AI primarily as an amplifier of an organization’s existing strengths and weaknesses. Put a capable agent inside a clear system with strong feedback, and it can compound that system. Put the same agent inside ambiguous ownership, fragmented knowledge, and weak evidence, and it produces more ambiguity at higher speed.

The model is part of the production function. It isn’t the whole production function.

The cases in this essay sit at the frontier: an OpenAI team describing its own internal product, Anthropic analyzing its own product data, and a young DeepSeek repository built around unusually high agent throughput. They don’t establish a universal return on harness investment. Their value is narrower and still important: under very different implementations, they expose the same bottleneck migration early.

## The work moved from execution to judgment

Once execution gets cheaper, the remaining work becomes easier to see.

[Anthropic studied roughly 400,000 Claude Code sessions](https://www.anthropic.com/research/claude-code-expertise) from October 2025 through April 2026. In a typical session, people made about 70 percent of the planning decisions but only 20 percent of the execution decisions. The person mostly decided what to do, which approach to take, and what counted as complete. Claude mostly decided which files to change, what code to write, and which commands to run.

The same study found that task-specific expertise still mattered. People who understood the domain more deeply were more likely to reach a verified result, recovered more effectively when the work went wrong, and triggered longer chains of useful agent activity with each instruction.

This is an early, vendor-owned dataset, not a permanent law of work. Models may absorb more planning over time. But it captures the current division with unusual clarity: AI expands the reach of judgment before it replaces the need for judgment.

The human contribution moves up a layer. Instead of deciding how every line gets written, people choose the objective, define the acceptance boundary, resolve trade-offs, and recognize failures the existing tests don’t know how to name. When a pattern repeats, they can push that judgment back down into the harness as a rule, evaluation, skill, or tool.

That creates a compounding loop:

```text
human judgment
      ↓
encoded constraint or feedback
      ↓
cheap agent execution at scale
      ↓
new evidence and exceptions
      ↓
refined human judgment
```

The loop isn’t self-improving by default. A person still has to notice the important failure, decide whether it generalizes, and choose what should change. The gain comes when that participation leaves an asset behind, so the next run starts from a higher baseline instead of asking another person to rediscover the same lesson.

In July, I described this as the [one-person project](/blogs/one-person-project-ai-coding): one accountable owner holds the full context of a bounded project, agents expand the execution radius, and the team owns the shared boundary and evidence. Harness engineering is the system-level version of the same idea. The owner’s judgment becomes more valuable because the system can apply it more widely.

## Cheap process can become expensive clutter

There is an obvious danger in this argument. If agents make tests, documentation, and rules cheap to produce, teams can generate a forest of process that nobody understands.

Both major examples contain that warning.

OpenAI’s team reported that full agent autonomy amplified uneven patterns already present in the repository. For a period, the engineers spent every Friday—20 percent of the workweek—cleaning up “AI slop.” They eventually encoded a smaller set of preferred patterns and assigned background agents to find and repair deviations continuously. The cleanup work had to become a system because manual cleanup couldn’t keep pace with generation.

DeepSeek Harness contains an even sharper counterexample. A real loader-path failure escaped despite 178 green tests and 100 percent line coverage. The tests mounted plugins by hand and never exercised the path the product used in reality. Every check passed because the missing question had never been encoded.

That failure matters because it puts a limit on the claim. A gate doesn’t contain judgment in general. It contains one judgment about one world the author managed to specify. Unknown paths, changing conditions, and bad assumptions can still sit outside it.

Rules also carry maintenance cost. DeepSeek’s decision notes have explicit states for implementation, rejection, and archive. Its gates don’t have an equally visible retirement system. Each incident can add another verifier, another exception list, and another concept a future contributor has to understand. Individually sensible protections can accumulate into institutional drag.

This is why ordinary teams shouldn’t copy the process density of an AI lab or a 12,000-commit experiment. The lesson is not “add more gates.” It is “recalculate which gates are now worth buying.” A small team should encode fewer judgments, with a higher threshold for each one.

AI makes good process cheaper. It also makes bad process easier to multiply.

## The Process Capital Test

I now use three questions to decide whether a new rule, evaluation, skill, or decision record is likely to become an asset.

### 1. Does it capture a recurring, expensive judgment?

A useful constraint prevents a mistake people are likely to repeat or removes a decision that repeatedly consumes scarce attention. A real production bug that escaped because tests bypassed the application’s entry path qualifies. A tempting architecture proposal that agents keep rediscovering may qualify. One reviewer’s stylistic preference usually does not.

If the underlying judgment is rare, cheap, or highly contextual, encoding it may cost more than deciding it again. That is bureaucracy: preserving process without preserving meaningful value.

### 2. Can the system apply it, check it, or surface the exception?

The rule needs an operating path. A structural invariant can become a linter. A quality requirement can become an evaluation with visible evidence. A rejected decision can be stored where the agent searches before proposing the same change. A production expectation can become a metric or acceptance test. When a decision can’t be automated safely, the system can still assemble the relevant evidence and route the exception to the right owner.

If every application still requires a person to read a long document and decide what the rule means, the organization hasn’t reduced judgment cost. It has hidden human toil behind a new artifact.

The same logic applies outside software. A finance team might encode its reconciliation tolerances, evidence requirements, and escalation thresholds so an agent can prepare the close and isolate exceptions. The agent executes the repeatable checks. The controller still decides whether an unusual variance reflects an error, a business event, or a rule that needs to change.

Not every important decision should become mechanical. Product direction, customer trade-offs, and architectural exceptions often need human interpretation. The point is to separate those decisions deliberately instead of surrounding them with checks that create false confidence.

### 3. Who owns its depreciation?

Organizational capital gets old. Models improve. Products change. A protection against yesterday’s failure can become tomorrow’s obstruction.

Every durable rule needs someone—or at least a scheduled process—responsible for revising, merging, or deleting it. A decision record should state what evidence could overturn it. A gate should have a reason for existing that a future maintainer can inspect. A skill should be tested against current behavior, not preserved because it once helped. If a rule generates more exceptions, explanation, and bypass work than the recurring judgment it removes, it has started to depreciate.

Without an owner or retirement condition, process turns into an institutional fossil: visible, expensive, and no longer alive.

The test is intentionally demanding. Failing the first question creates bureaucracy. Failing the second creates hidden toil. Failing the third creates fossils. Passing all three doesn’t guarantee a good rule, but it makes clear what the investment is supposed to return.

## Management moves to the judgment layer

The first wave of AI adoption focused on access: which model, which subscription, which coding agent. The next advantage will come from the system around that access.

That doesn’t mean the company with the longest instruction file wins. It means the company that can turn repeated experience into better boundaries, evidence, and feedback without burying itself in obsolete rules will get more value from the same underlying intelligence.

The management question changes with it. Instead of asking only, “How much work can the agent do?” leaders need to ask, “Which parts of our judgment should compound through the system?”

The place to look is where review repeatedly stops. If different runs keep returning the same ambiguity, correction, or risk decision, that judgment is a candidate for the harness. If an existing rule keeps producing exceptions that require more interpretation than the rule saves, it is a candidate for deletion. The work is not maximizing process. It is moving repeated judgment downward and protecting human attention for what remains genuinely new.

Some judgment will move downward as it becomes clear and repeatable. New exceptions will move upward because the system can’t yet see them. The harness is the interface between those two movements.

DeepSeek Harness makes that interface unusually visible. OpenAI’s experiment shows the same economics inside a shipping product. Anthropic’s data shows where the work currently divides. None of them proves that human judgment will remain scarce forever. Together, they show why adding agent labor without investing in the surrounding organization is an incomplete production strategy.

The operating rule is simple: when review keeps stopping on the same decision, encode it; when a rule creates more exceptions than it removes, retire it. Use agents to scale execution, but spend human judgment on the boundary between what should repeat and what must remain open.

AI made process cheaper. The opportunity is to turn the right process into capital. The discipline is deleting the rest.
