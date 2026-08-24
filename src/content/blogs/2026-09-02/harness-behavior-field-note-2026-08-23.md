---
title: "Four Harnesses, One 11-Line Bug — Field Note"
date: 2026-08-23
draft: true
private: true
---

# Four Harnesses, One 11-Line Bug — Field Note

## Purpose

This is a qualitative, single-machine observation for the companion article, not a benchmark. Four locally installed coding harnesses received the same request in a fresh three-file JavaScript fixture:

> Run the test once, inspect only the files needed to identify the failure, and do not modify anything. In under 90 words, state the failing test, root cause, and smallest source change.

The bug was deliberately trivial: `finalPrice(10_000, 20)` returned `2_000` rather than `8_000` because the source returned the discount amount rather than the post-discount price. The test suite was independently verified as failing before each run. No agent was permitted to modify the fixture.

## Controlled boundary

- One local run per product on 2026-08-23, on the same machine and fixture.
- Each product used its currently installed version and its own locally available authentication/configuration. No credential value was read, copied, exported, or changed.
- Codex used a read-only ephemeral run; Claude Code used plan mode with no session persistence; Grok used read-only sandboxing with web search and subagents disabled; DSH used an isolated temporary home, read-only policy, and a local Ollama model.
- These are different products, versions, models, and personal defaults. This records *behavioral portraits*, not speed, cost, quality, or a universal token ranking.
- Raw event streams and local paths are private. The notes below preserve only publication-safe action sequences.

## What happened

All four produced the correct diagnosis and proposed the same one-line repair: calculate `cents * (1 - percentOff / 100)`.

| Harness | Publication-safe observed path | What is interesting about it |
|---|---|---|
| Codex CLI | Tried the configured code-graph/discovery capability, then listed files, read the manifest, ran the test, and consulted its code-discovery surface before answering. | A tiny task still entered a general-purpose engineering environment. |
| Claude Code | Initialized its configured global runtime surface, listed the workspace, inspected the manifest and files, ran the test, and navigated its plan-mode completion contract. | Governance and installed global context can shape a task before the bug itself does. |
| Grok Build | Listed the workspace, read the manifest, then ran the test while reading source and test files in parallel. | It favored quick orientation followed by concurrent evidence gathering. |
| DeepSeek Harness | Listed the workspace, read the manifest and globbed source/test, ran the test, then read source and test together. Its session preserved the tool contract and each turn. | The composition and the replayable record made the work path unusually inspectable. |

## Interpreting the difference

The shared answer matters less than the different routes. Each route represents a prior decision made by the harness: what it carries into a task, what it discovers only after the task begins, what it makes cheap to reread, and what it leaves behind as state.

The DSH result is particularly important for the article because it was a real local run, not merely a configuration inspection. The temporary DSH profile used an explicit local model route and a read-only workspace. Its event record showed a tool-using loop rather than a hidden one-shot call: orient, locate, test, inspect, conclude. That does not make DSH universally better; it makes its composition and history visible enough to discuss.

## Cache note

This run was not used to compare token totals. Each CLI exposes different fields and can span different provider requests. Provider documentation supports only the architectural comparison: prompt caching makes a stable prefix cheaper to reuse; deferred tool discovery keeps some definitions out of the initial context. Neither fact alone describes what a given coding CLI sent in a particular request.

## Article-safe conclusion

Do not ask "which agent has the best prompt?" Ask: "what does this harness decide before the task begins, and can I inspect or change that decision?" The four useful verbs are **carry, discover, reuse, and persist**.
