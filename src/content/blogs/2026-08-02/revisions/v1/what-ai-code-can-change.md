---
title: "Should You Read AI-Generated Code? Ask What It Is Allowed to Change"
date: 2026-08-02
slug: what-ai-code-can-change
category: ai-native-systems
tags: [ai-coding, code-review, software-engineering, accountability]
---

I review AI-generated changes differently when they touch a critical system or a system of record.

I don't have a dramatic failure story behind this rule. That is the point. The boundary has to exist before the incident. On private, short-lived, reversible work, I am often comfortable judging the outcome and the evidence around it. But once code can change authoritative state—something a customer, a business process, or another system will treat as fact—green tests are no longer enough. I need to understand the write path, the invariants it can break, how an error will propagate, and whether we can restore the truth rather than merely roll back the code.

So the question I ask is not simply, “Did I read the code?”

It is: **What is this code allowed to change?**

A critical system and a system of record are not quite the same. A critical system demands attention because failure has serious consequences. A system of record demands attention because its state has authority. They often overlap, but each creates a different reason to look deeper.

This is why the debate over whether engineers should read AI-generated code is more interesting than the yes-or-no version suggests.

Mitchell Hashimoto's quality-control answer was concise: [“I read the code.”](https://x.com/mitchellh/status/2072738025344565262) Uncle Bob has described almost the opposite practice. He does not read the implementation his agents produce. Instead, he surrounds them with specifications, tests, mutation testing, quality metrics, QA, and final verification.

At first, those positions seem incompatible. Yet neither engineer delegates accountability to the model. Mitchell keeps human judgment close to the implementation; Uncle Bob moves it into constraints and evidence. Their real disagreement is what accountability requires a human to understand.

## What each workflow asks the human to understand

Mitchell's four-word answer came after he [described a new multi-model workflow](https://x.com/mitchellh/status/2072715852944957531): one model planned, another implemented, and another judged the result. At that point he had been using the setup for less than a day. “I read the code” was not a universal manifesto. It was his answer to a practical question about how he controlled quality in that experiment.

His fuller position appears in a different post about open-source contributions. Mitchell said he did not care whether someone reviewed code that stayed inside their own boundary. But once they submitted AI-generated work to an open-source project, they were crossing a human boundary. Another person would inherit the cost of understanding, reviewing, maintaining, and possibly repairing it. [Some human review was therefore basic courtesy](https://x.com/mitchellh/status/2067970516951150721).

Uncle Bob places the boundary elsewhere. In his [original thread](https://x.com/unclebobmartin/status/2080257779395154409), he argued that reading all agent implementation would prevent him from capturing the agents' productivity. His alternative is an unusually demanding gauntlet: unit tests, Gherkin acceptance tests, QA procedures, coverage, mutation testing, and quality metrics. He spends human effort on the initial specification and the final testing. When someone challenged whether that still made him the engineer, his answer was direct: “I am the engineer because I am accountable.”

They agree on who is accountable but disagree on what accountability requires. Mitchell uses source comprehension as the quality gate. Uncle Bob trusts a demanding constraint system to replace much of that reading. No short thread tells us which approach will age better. Both, however, try to keep unfinished verification work from landing on the next human.

That last point matters because, in agent-heavy workflows, generation can become cheap without making qualified review abundant. The Godot Foundation recently described exactly this problem in its [2026 contribution policy](https://godotengine.org/article/contribution-policy-2026/): AI lowered the cost of producing pull requests, but it did not lower the cost of reviewing them. Godot now expects contributors to understand, explain, maintain, and repair the code they submit.

The cost did not disappear. It moved across the boundary.

## Code becomes dangerous when it can change truth

Diff size is a poor proxy for risk.

A thousand lines of generated UI for a disposable internal prototype may deserve less attention than five lines that change a permission check, migration, account balance, or customer status. The first change may be large but isolated. The second may be tiny while altering what the system believes to be true.

Imagine the same piece of data-normalization logic moving through three contexts.

First, it is a local script that cleans a copied CSV. If it produces the wrong output, I can inspect the result, discard the file, and run it again. Outcome-level verification may be enough.

Then it becomes a shared internal tool. Other people depend on its output. Now I need stronger evidence: representative tests, logs, an explanation of the transformation, and a way to detect unexpected records. The code has crossed a human boundary even if it has not reached production.

Finally, the same logic writes directly into a system of record. That system may feed reporting, permissions, customer communications, financial decisions, or other automated workflows. A wrong value no longer stays inside one file. It propagates because other systems trust the source.

At that point, rolling back the deployment is not the same as restoring reality. The old code may be back while corrupted records remain. Downstream systems may already have copied the data. An audit trail may show actions taken from the wrong state. A customer or employee may have made a decision based on it. Recovery can require reconciliation, compensation, and explicit repair—not merely a previous commit.

This is the mechanism that the simple “read or do not read” debate misses. Code becomes more dangerous when it gains authority over state or creates consequences that are hard to reverse.

The unit of review is no longer just the diff. It is the path by which a change becomes fact.

## Reading and tests fail in different ways

Reading source code matters because maintenance depends on a system model. When the failure is unusual, the engineer needs more than a passing test suite. They need to understand why the system was built this way, which assumptions hold it together, and where an unexpected state could travel.

But reading is not proof. A reviewer can inspect every line and still miss a bug. Large AI-generated diffs make this worse: “I looked at it” can become review theater, a ritual that produces confidence without comprehension.

Tests fail differently. They can exercise far more paths than a human can hold in working memory. Mutation testing can reveal weak assertions. Acceptance tests can express behavior in language closer to the business. Static checks can enforce known structural rules. Uncle Bob's gauntlet is valuable because it turns skepticism into something repeatable and executable.

Yet a test suite provides repeatable evidence only for the cases and expectations encoded in the suite. It cannot, by itself, tell us whether those expectations describe the right reality.

Reading can expose a question we forgot to ask. Tests can keep checking the answer once we have asked it.

When AI writes the implementation, tests, and review comments from the same context, all three can repeat the same mistaken assumption. More artifacts do not necessarily mean more independent evidence. I therefore look for checks grounded in a different method, dataset, system, or human owner: a human-written business invariant, a production replay, a security policy, a reconciliation query, or observed behavior from outside the implementation's own logic. A different prompt alone is not enough.

The strongest objection to reading less source is that teams may lose their shared model of the system. That objection is right. Review does more than detect defects: it builds understanding, aligns the team's language and architecture, and makes ownership visible. Tests and AI reviewers help most directly with defect detection. They only partially cover the rest.

Risk-based review is therefore not permission to accept opaque code. It is a way to reserve deep human attention for the places where opacity would be most expensive.

## The review depth should follow authority

I use four questions to decide how far the review needs to descend. A change's authority and consequences set the minimum depth; authorship and provenance can raise the evidence required, but they should not lower that floor.

1. **Authority:** What can this code change, and what people or systems will treat its output as fact?
2. **Exposure:** Who inherits the consequences, and how far can a wrong result or state propagate?
3. **Recovery:** How quickly would we detect failure, and can we restore the state—not merely revert the code?
4. **Independence:** Did the evidence bring a materially different context, method, model, dataset, or human owner, or did every check inherit the same assumptions?

Those questions lead to a four-level Review Depth Ladder. The levels are cumulative. Going deeper does not remove the need for the checks above it.

The routing rule is simple. Work stays at Level 1 only while it is private, isolated, disposable, and non-authoritative. It moves to Level 2 when another person or process depends on the output but the effect remains bounded and recoverable. It moves to Level 3 when the change can alter consequential shared behavior, production state, or a system of record. Level 4 is for the critical path that creates an authoritative or unacceptable consequence.

### Level 1: Outcome

For private, short-lived, isolated, easily discarded work, I may verify the visible result and stop there. A one-off analysis script or prototype can live at this level when I own the bounded consequences and can throw the work away.

This is not a license to submit opaque output to someone else. The level changes when the boundary changes.

### Level 2: Evidence

For bounded changes that other people may use, I want a case for confidence: tests, logs, CI results, screenshots, static checks, and review that brings a materially different context or method. I care about what was tested, what was not, and whether the evidence could expose the implementation's assumptions rather than merely repeat them.

### Level 3: System model

When a change enters consequential shared or production behavior, someone accountable should be able to explain the interfaces, data flow, dependencies, invariants, failure modes, observability, and recovery plan. This is where “the tests are green” stops being a sufficient explanation.

A system-of-record modification starts here. If nobody can describe how a state change becomes authoritative and where it travels next, the team does not yet understand enough to release it.

### Level 4: Critical source path

For critical systems, system-of-record write paths, permissions, money movement, privacy, deletion, migrations, concurrency, security, and core architecture, I want source-level understanding of the path that can create the consequence.

That does not mean reading every generated helper with equal intensity. It means tracing the critical diff and establishing confidence in the things that matter: business invariants, authorization, transaction boundaries, idempotency, reconciliation, audit history, rollback versus compensation, and downstream repair.

For my own work, changes to critical systems or systems of record begin at Level 3 and usually descend into Level 4 for the write path.

For authoritative writes, my release rule is simple: no named domain owner, no reviewed critical write path, no explicit business invariants, and no credible reconciliation and recovery plan means no release.

The classification also expires. A “temporary” script that becomes scheduled, shared, privileged, persistent, or authoritative has changed categories. It should not inherit the lightweight review standard it received as a prototype.

## Ownership means owning the state transition

I have written before that [AI compresses work without compressing responsibility](/blogs/one-person-project-ai-coding). Agents can produce implementation, tests, documentation, and review summaries in parallel. Human understanding remains scarce and largely serial. Asking people to read everything at equal depth throws away AI's leverage; pretending every generated artifact has been understood creates a more dangerous illusion.

The engineer's role is not defined by typing every line or watching every implementation step. But it is also not satisfied by having a name attached to an AI-generated pull request.

Ownership means being able to explain the intended state transition, the invariant that must survive, the evidence that could prove confidence wrong, the failure path, and the recovery plan.

That is consistent with how my own [AI operating system](/blogs/ai-became-my-operating-system) has evolved. I can move execution away from myself, but the high-judgment work still has to return. When an agent can run for longer and do more, the unit of control becomes the [operating contract around the run](/blogs/fable-5-managing-ai-autonomy): authority, evidence, checkpoints, stopping conditions, and rollback.

There is also a learning boundary. A senior engineer may safely treat familiar, well-bounded implementation as a partial black box because years of reading code built the judgment needed to recognize risk. That does not make “skip the source” a sensible training method for someone still building that judgment.

For teams, the practical policy should not be one rule for “AI code.” It should be a policy by change class. Which changes force system-model review? Which require a domain owner to inspect the critical path? What evidence must come from outside the implementation's own context? Who can approve an authoritative write? What must be rehearsed before rollback is believable?

These questions make review heavier in a few places so it can become lighter in many others.

## The question I ask now

AI will keep lowering the cost of implementation, but human attention will stay scarce. Teams cannot read every generated line, and they cannot treat unread code as somebody else's problem.

The engineering decision is how to allocate understanding.

That is the standard I want to preserve. I do not need to understand every line an AI writes. But if that code can rewrite what a business treats as true—or create consequences the business cannot accept—someone accountable must be able to explain what changes, what must remain invariant, how confidence could be proven wrong, and how the system will recover.

If you are working through the same questions, I write about building accountable AI-native systems in [Ship with AI](https://shipwithai.beehiiv.com).

Before accepting an AI-generated change, ask one question: if every test is green and the world is still wrong, who can explain why—and restore the truth?
