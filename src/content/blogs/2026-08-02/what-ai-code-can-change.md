---
title: "Should You Read AI-Generated Code? Ask What It Is Allowed to Change"
date: 2026-08-02
slug: what-ai-code-can-change
category: ai-native-systems
tags: [ai-coding, code-review, software-engineering, accountability]
cover: imgs/web/00-cover.webp
---

![A human hand guides a provisional code strip through an authority gate where it becomes trusted records](imgs/web/00-cover.webp)

A recent [argument about whether engineers should read AI-generated code](https://www.youtube.com/watch?v=Hh3AmV46epI) caught my attention.

Mitchell Hashimoto's answer was four words: [“I read the code.”](https://x.com/mitchellh/status/2072738025344565262) He had just [described a workflow](https://x.com/mitchellh/status/2072715852944957531) in which one model planned, another implemented, and another judged the result. His final quality gate was still source comprehension.

Elsewhere, he drew a broader boundary: unread private code is one thing; [handing AI-generated work to another maintainer is another](https://x.com/mitchellh/status/2067970516951150721).

Uncle Bob took nearly the opposite position. He said he does not read the implementation his agents produce. Instead, he invests in specifications, unit tests, Gherkin acceptance tests, mutation testing, quality metrics, QA, and final verification. His definition of the engineer's role was equally direct: [“I am the engineer because I am accountable.”](https://x.com/unclebobmartin/status/2080257779395154409)

The discussion quickly exposed two competing claims.

One side argued that unread code cannot be responsibly maintained or debugged. The other asked what productivity AI provides if an engineer still has to inspect every generated line.

Both arguments are reasonable. Mitchell keeps human understanding close to the implementation. Uncle Bob moves much of it into the specification and evidence. They agree that a human owns the result, but disagree about how much source comprehension that ownership requires.

That disagreement is not theoretical for me.

## The question changes at work

I do not read every line of every AI-generated artifact.

AI lets me delegate more implementation than I can inspect at equal depth. The practical challenge is deciding where outcome-level confidence is enough and where I need a system model.

For a private prototype, a one-off analysis, or a script I can discard, I may inspect the output, run the tests, and move on. The consequences are bounded and recovery is simple.

My behavior changes when AI touches a critical system or a system of record.

A critical system matters because failure has serious consequences. A system of record matters because other people and systems treat its state as authoritative. The two often overlap, but they create different risks.

Five lines that change a permission, account balance, customer status, or migration can deserve more attention than a thousand lines of disposable interface code. The size of the diff tells me little about the size of the consequence.

Consider a normalization function. If it cleans a copied CSV, a bad result can be discarded. If the same function writes into a system of record, the value may flow into reports, permissions, customer communication, and automated decisions.

Reverting the code may stop the next bad write. It does not necessarily restore corrupted records, downstream copies, audit history, or decisions already made.

![A retracted code strip beside a ledger whose marked state has already propagated to three downstream records](imgs/web/01-authority-ripple.webp)

I do not have a dramatic incident behind this rule. That is the point. The boundary needs to exist before the incident.

## My view: review depth should follow authority

The wrong question is whether engineers should read AI-generated code.

My question is: **What is this code allowed to change?**

Review depth should not be set by who wrote the code or how many lines changed. It should follow the authority of the change, who inherits the consequences, and whether failure can be detected and repaired.

Reading and testing both matter, but they fail differently. Reading builds the system model needed for maintenance and unusual failures; it does not prove correctness. Tests create repeatable evidence at scale; they only exercise expectations we encoded. If the implementation, tests, and review all come from the same AI context, they can also repeat the same mistaken assumption.

Reading less has another cost: a team can lose its shared model of the system. That is why production and critical changes cannot rely on test evidence alone.

So I use four levels of review:

- **Outcome:** For private, disposable, reversible work, verify the result.
- **Evidence:** When another person or process depends on the output, inspect tests, logs, CI, and checks that bring a different method or context.
- **System model:** For production behavior or authoritative state, someone accountable must explain the data flow, business invariants, failure propagation, observability, and recovery.
- **Critical path:** For permissions, money, privacy, deletion, migrations, security, or system-of-record writes, understand the relevant source path.

![Review depth rises from Outcome to Evidence, System Model, and Critical Path as changes become more authoritative](imgs/web/02-review-depth-ladder.webp)

The levels are cumulative. Reading the critical path does not replace testing, and green tests do not replace understanding the state transition.

In my work, a system-of-record change starts at the system-model level. Its critical write path usually requires source-level understanding.

My release rule is simple: no named owner, no reviewed write path, no explicit business invariants, and no credible reconciliation and recovery plan means no release.

## Ownership means owning the state transition

AI lowers the cost of implementation. It does not lower the cost of consequences.

We cannot read every generated line with equal intensity. We also cannot let unread code become somebody else's problem. The practical decision is where human understanding must be deepest.

I do not need to understand every line an AI writes. But if the code can rewrite what a business treats as true—or create consequences the business cannot accept—someone accountable must understand how the state changes, what must remain invariant, how it can fail, and how reality will be restored.

Before accepting an AI-generated change, I now ask: if every test is green and the world is still wrong, who can explain why—and restore the truth?
