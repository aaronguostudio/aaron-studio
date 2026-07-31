---
title: "Harness Engineering"
fullName: "Artificial Intelligence Harness Engineering"
shortName: "Harness Engineering"
description: "Design the task contracts, context, tools, state, verification, permissions, and recovery that turn model capability into dependable work."
mentalModel: "The model supplies capability. The harness turns it into dependable work."
date: "2026-07-24"
updated: "2026-07-24"
domain: "Artificial intelligence systems & software engineering"
domainKey: "ai-systems"
tags:
  ["agents", "context", "tools", "state", "evals", "permissions", "recovery"]
maturity: "growing"
published: true
featured: true
translationKey: "harness-engineering"
interaction: "harness-engineering"
socialImage: "/learn-img/harness-engineering/og-1200x627.jpg"
socialImageAlt: "An English editorial diagram showing a model surrounded by six harness layers—context, tools, state, evals, permissions, and recovery—leading to verifiable work."
cardImage: "/learn-img/harness-engineering/card-4x5.jpg"
cardImageAlt: "An English editorial card titled Harness Engineering, with a model core surrounded by context, tools, state, evals, permissions, and recovery."
neighbors:
  - name: "Prompt Engineering"
    fullName: "Prompt Engineering"
    category: "instruction technique"
    summary: "Shapes how intent is expressed to the model in a run; harness engineering designs the complete task lifecycle."
  - name: "Context Engineering"
    fullName: "Context Engineering"
    category: "subsystem practice"
    summary: "Selects, organizes, and refreshes what the model sees; it is one layer of a broader harness."
  - name: "Agent Harness"
    fullName: "Agent Harness"
    category: "runtime artifact"
    summary: "The actual loop and infrastructure; harness engineering is the practice of designing and improving it."
  - name: "Agent Framework"
    fullName: "Agent Framework or Software Development Kit"
    category: "toolkit"
    summary: "Provides reusable primitives, but not the task-specific contracts, evidence, permissions, and recovery policy."
  - name: "MCP"
    fullName: "Model Context Protocol"
    category: "integration protocol"
    summary: "Standardizes connections to tools and context; it does not define completion, authority, or recovery."
  - name: "Evaluation Harness"
    fullName: "Evaluation Harness"
    category: "measurement infrastructure"
    summary: "Runs and grades controlled tasks; a production agent harness performs real work."
  - name: "Durable Execution"
    fullName: "Durable Execution"
    category: "runtime guarantee"
    summary: "Provides checkpoints, retries, and resumption underneath the harness state layer."
  - name: "Capability Security"
    fullName: "Capability-Based Security"
    category: "permission model"
    summary: "Grants only the narrow powers required for a task and limits the blast radius of mistakes."
sources:
  - title: "OpenAI · Harness engineering: leveraging Codex in an agent-first world"
    url: "https://openai.com/index/harness-engineering/"
  - title: "OpenAI · Running Codex safely at OpenAI"
    url: "https://openai.com/index/running-codex-safely/"
  - title: "OpenAI · The next evolution of the Agents SDK"
    url: "https://openai.com/index/the-next-evolution-of-the-agents-sdk/"
  - title: "Anthropic · Effective harnesses for long-running agents"
    url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
  - title: "Anthropic · Harness design for long-running application development"
    url: "https://www.anthropic.com/engineering/harness-design-long-running-apps"
  - title: "Anthropic · Beyond permission prompts: Claude Code sandboxing"
    url: "https://www.anthropic.com/engineering/claude-code-sandboxing"
  - title: "Anthropic · Demystifying evals for AI agents"
    url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
  - title: "Anthropic · Scaling Managed Agents: Decoupling the brain from the hands"
    url: "https://www.anthropic.com/engineering/managed-agents"
  - title: "Zhong and Zhu · AI Harness Engineering"
    url: "https://arxiv.org/abs/2605.13357"
  - title: "Ahn and Kim · From Prompts to Contracts"
    url: "https://arxiv.org/abs/2607.08028"
---

# Harness Engineering

Why can the same model work for hours, verify a change, and recover from failure in one environment—yet guess at the repository, forget its progress, and declare victory too early in another?

The difference is often not the model alone. It is the system around the model.

**Harness Engineering designs that system:** the task contract, context, tools, state, verification, permissions, and recovery that turn model capability into dependable work.

Here, an artificial intelligence (AI) agent means software in which a model can use tools to observe and change an environment.

The term is still emerging rather than fully standardized. Teams may use _agent infrastructure_, _scaffolding_, _runtime_, _orchestration_, or _context engineering_ for overlapping parts. Here, Harness Engineering means the practice of building the runtime system around a replaceable model so an agent can perform real work reliably.

## An everyday analogy: a machine tool and its fixtures

A high-performance computer numerical control machine has enormous cutting capability. A factory still does not hand it a metal block and say, “make a correct part.”

Reliable production also needs:

- a drawing and tolerances that define a correct result;
- fixtures that put the material in a known position;
- tools and travel limits that constrain action;
- process records that preserve progress;
- gauges that measure the part instead of trusting “done”;
- guards and authorization for dangerous operations;
- a reset procedure after a power loss or collision.

The machine is like the model. The fixtures, gauges, records, and safety system are like the harness.

A better model can choose a smarter cutting strategy. It does not automatically define the tolerance, preserve the batch record, or decide who may open the safety guard. A great fixture cannot make an incapable machine universal either. The dependable result comes from the **model × harness × environment** system.

## A technical example: fix a checkout bug and open a pull request

The task:

> Fix the checkout path that produces a negative order total when a coupon and gift card are combined. Add a regression test and open a pull request.

With only a model, the agent may guess which file matters, change plausible code, write a shallow test, and report success without running the real checkout flow.

A harness turns the same request into an evidence-bearing loop.

### 1. Task contract

The harness translates intent into observable acceptance criteria:

- reproduce the negative total;
- prevent totals below zero;
- preserve the existing discount rules;
- make the new regression test fail before the fix and pass after it;
- open a pull request only after verification succeeds.

The contract fixes the result boundary and evidence requirements. It does not prescribe every implementation step.

### 2. Context map

The agent starts with a short map, then retrieves deeper sources only when relevant:

```text
agent entry point
→ architecture map
→ checkout-domain guidance
→ relevant tests and run commands
→ task history and constraints
```

This is different from packing every document into one huge instruction. The entry point says where to look; versioned sources say what is authoritative; executable code and tests show what remains true now.

### 3. Tools and isolated environment

The agent reads and edits files, runs tests, boots the app, and drives a browser inside an isolated worktree or sandbox. Tools have typed inputs, useful errors, timeouts, and task-scoped authority. Production credentials never enter an environment where generated code can read them.

### 4. Durable state

The plan, completed steps, evidence, decisions, and external side effects live outside the model’s context window. If context is compacted, the process crashes, or a later session continues the work, the next run can resume from the last durable event.

**A session is not a context window.** The session can be a persistent, append-only event history. Context is the smaller working set selected for this model call.

### 5. Verification

The harness checks the environment, not just the final prose:

- did the regression test go from failing to passing?
- do existing tests still pass?
- does the browser checkout path produce the correct total?
- are logs free of new errors?
- do static and security checks pass?
- does the patch satisfy the actual contract?

Good verification combines deterministic checks, calibrated model review, and human judgment where necessary. The process that generated an answer should not be the only judge of its success.

### 6. Permission gates

Reading the repository and running local tests may be automatic. Pushing a branch, opening a pull request, or touching real customer data crosses a higher boundary. The agent receives only the capabilities needed for the task, and consequential actions have explicit gates.

### 7. Delivery or recovery

If browser verification fails, the loop returns to observe, attribute, change, and verify. If the sandbox dies, a clean one is rebuilt and the session resumes from durable state. If the pull-request response is lost, the harness queries the external system before retrying, avoiding a duplicate side effect.

## The seven responsibilities

### Task contract

Defines observable outcomes, constraints, and evidence. It constrains the boundary without micromanaging the reasoning path.

### Context

Selects what the model needs now and provides a map to authoritative knowledge. More context is not automatically better; relevant, navigable, fresh context is.

### Tools and environment

Translate model intent into actions on code, browsers, databases, or external services. Clear interfaces and isolation make failures attributable.

### State

Preserves progress, events, artifacts, and side effects beyond a context window. Durable state makes long tasks resumable.

### Verification

Judges observable outcomes with reproducible evidence. “The tool returned success” and “the business result exists” are separate claims.

### Permissions

Limits what the agent can see and change. Credentials, scopes, confirmations, and human gates define authority.

### Recovery and trace

Records what happened and where to resume. Recovery must understand side effects; blindly rerunning a step can duplicate a payment, message, or deployment.

## From prompts to contracts

Prompt Engineering still matters. It shapes how intent is expressed for a particular run. Harness Engineering asks how the entire task lifecycle operates.

| Layer                   | Best home for                                              |
| ----------------------- | ---------------------------------------------------------- |
| Prompt                  | Task context, tone, run-specific judgment                  |
| Versioned documentation | Architecture, product rules, durable knowledge             |
| Tool schema             | Executable actions and parameter boundaries                |
| Code or policy          | Hard constraints, permissions, routing, state transitions  |
| Evaluator               | Completion evidence, quality thresholds, regression checks |
| Session log             | Events, decisions, outputs, recovery position              |

When a rule must execute consistently, can be mechanically checked, affects safety, or needs an audit trail, it should usually not live only in natural-language instructions.

## A harness is a loop, not a checklist

```text
Specify → Observe → Act → Verify
    ↑                     ↓
    └──── Recover / Escalate
```

Tools without feedback amplify mistakes. Context without a contract gives the model more material with which to optimize the wrong target. Components create reliability only when they close the loop.

## Match depth to risk

Not every task needs a production-grade harness.

| Scenario                                              | Proportionate harness                                                     |
| ----------------------------------------------------- | ------------------------------------------------------------------------- |
| Rewrite one nonsensitive paragraph                    | Clear prompt + human reading                                              |
| Change a low-risk component in a familiar repository  | Context map + isolation + tests                                           |
| Implement a multi-file feature over several hours     | Add durable state, progress artifacts, and recovery                       |
| Operate accounts, payments, email, or production data | Add least authority, confirmation, idempotency, and audit                 |
| Run a repeated enterprise workflow                    | Add output contracts, continuous evals, regression suites, and monitoring |

The common mistakes are under-designing a long, consequential workflow as one chat prompt—or overbuilding a distributed runtime for a harmless one-off draft.

## Failure and recovery

### Stale context

The agent follows an obsolete architecture document. Version authoritative sources; mechanically check structure, links, and freshness; verify the current environment before acting.

### A successful tool call with no business result

The application programming interface responds successfully, but the external object is absent or incorrect. Separate invocation success from outcome success, then query the environment again.

### Premature victory

The agent writes a confident summary without reproducing the failure or running the right test. Bind acceptance criteria to executable checks and preserve failed evidence.

### State loss after context compaction

A later run repeats investigation or reverses a settled decision. Persist decisions and events outside context; select only the relevant slice for each model call.

### Sandbox or harness crash

The run stops and its status is uncertain. Decouple the sandbox, harness process, and session log; rebuild the disposable environment from a recipe and resume from the last durable event.

### Duplicate side effects on retry

A retry creates a second pull request, sends a second email, or charges twice. Use an idempotency key or business-unique identifier, record side effects, and inspect external state before retrying.

### Prompt injection

Untrusted content tries to redirect the agent or exfiltrate secrets. Treat content as data, keep credentials outside the sandbox, grant narrow tools, and require structured confirmation for consequential actions.

### Harness debt

Rules created for old model weaknesses accumulate after models improve. Version and evaluate the harness itself; use traces to remove controls that no longer add value.

## What it is—and is not

- **Prompt Engineering is an instruction technique.** It improves what a run asks the model to do.
- **Context Engineering is a subsystem practice.** It manages what the model sees.
- **An Agent Harness is the runtime artifact.** Harness Engineering is the practice of designing it.
- **An Agent Framework is a toolkit.** It supplies parts, not a finished task-specific operating system.
- **Model Context Protocol is an integration protocol.** It connects tools and context; it does not define completion or authority.
- **An Evaluation Harness is measurement infrastructure.** It runs controlled tasks and grades results.
- **Durable Execution is a runtime guarantee.** It supports checkpoints, retries, and resumption.
- **Capability-Based Security is a permission model.** It grants the smallest useful powers.

## Remember these seven ideas

1. The same model with a different harness can behave like a different product.
2. A prompt expresses intent; a contract defines a verifiable result.
3. A session is durable history; context is the working set selected for now.
4. Tools increase agency; verification and permissions make that agency dependable.
5. Invocation success is not outcome success.
6. Recovery must understand side effects, not just rerun steps.
7. Harnesses also decay: version, evaluate, and simplify them.

## Check your understanding

1. Why can the same model perform so differently across two teams?
2. How is a task contract different from a more detailed prompt?
3. Why should a session log live outside the context window?
4. Why can a successful tool response still leave the task incomplete?
5. What minimum verification and permission boundaries should surround an agent that can open pull requests?
6. Which harmless, one-off tasks do not need a full harness?
7. Why should harness rules be reevaluated after a model upgrade?

## Further reading

- [OpenAI, “Harness engineering: leveraging Codex in an agent-first world”](https://openai.com/index/harness-engineering/)
- [OpenAI, “Running Codex safely at OpenAI”](https://openai.com/index/running-codex-safely/) — describes filesystem and network boundaries, scoped approvals, command rules, credential isolation, and audit trails in OpenAI’s Codex deployment.
- [OpenAI, “The next evolution of the Agents SDK”](https://openai.com/index/the-next-evolution-of-the-agents-sdk/) — describes externalized state, snapshots, rehydration, and continuation in replaceable sandboxes.
- [Anthropic, “Effective harnesses for long-running agents”](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic, “Harness design for long-running application development”](https://www.anthropic.com/engineering/harness-design-long-running-apps) — describes planner–generator–evaluator roles, sprint contracts, Playwright checks, and feedback loops.
- [Anthropic, “Beyond permission prompts: Claude Code sandboxing”](https://www.anthropic.com/engineering/claude-code-sandboxing) — describes filesystem and network isolation, external credentials, and scoped Git access.
- [Anthropic, “Demystifying evals for AI agents”](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [Anthropic, “Scaling Managed Agents: Decoupling the brain from the hands”](https://www.anthropic.com/engineering/managed-agents)
- [Zhong and Zhu, “AI Harness Engineering”](https://arxiv.org/abs/2605.13357) — a 2026 preprint proposing a model–harness–environment framework.
- [Ahn and Kim, “From Prompts to Contracts”](https://arxiv.org/abs/2607.08028) — a 2026 preprint on moving deterministic guarantees into code and validation artifacts.
