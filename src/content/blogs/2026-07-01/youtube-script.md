# The One-Person Project

## [HOOK]

Last year, our QA queue started telling us something was wrong.

Not because QA was weaker.

Because AI coding had changed the speed of development without changing the speed of human judgment.

That is when I started thinking: a lot of software work is becoming a one-person project again.

---

## [SLIDE: The Old Handoff Tax — 00-cover.png]

The old software process was familiar.

A business analyst clarifies the requirement.

A designer shapes the solution.

A developer implements it.

QA tests it.

UAT validates it.

Then the team deploys.

[IMAGE: s01-01-old-handoff-chain.png]

That process was not stupid. It solved the problem of its time.

Execution was expensive.

Writing code was slow. Changing code was slow. Understanding a large system was slow.

So we split the work across roles, and used handoffs to distribute risk.

[IMAGE: 01-narrative-old-pipeline-shift.png]

But AI changed the cost structure.

Now one developer, working with AI, can often do several of those steps in the same working session.

Clarify the requirement. Compare solution options. Generate the implementation. Write tests. Draft docs. Explain the diff. Prepare a review summary.

[IMAGE: s01-02-ai-compresses-loop.png]

The process did not disappear.

It compressed into a smaller unit of responsibility.

And once that happens, every old handoff starts to feel heavier.

---

## [SLIDE: The New Bottleneck — 02-narrative-review-bottleneck.png]

The obvious story is that AI makes coding faster.

That is true, but it is not the most important part.

The important part is that AI moves the bottleneck.

It is no longer typing code.

It is understanding change.

[IMAGE: s02-01-ai-output-flood.png]

AI can produce hundreds of lines of code, multiple tests, a migration note, and a pull request description in minutes.

A human cannot safely review all of that in minutes.

Review is not just reading text on a screen.

Review means rebuilding context, checking intent, seeing risk, and asking whether this change fits the system.

[IMAGE: s02-02-mental-model-rebuild.png]

So if every engineer on the same project uses AI to generate more work, the team may not become faster.

It may just move the queue from development to review.

And this is where the knowledge gap grows.

The person who worked with AI has all the local context.

The reviewer sees a diff.

[IMAGE: s02-03-dora-amplifier.png]

DORA's research points in the same direction.

AI can improve individual productivity, flow, and satisfaction.

But if the team does not have strong tests, small batches, clear ownership, and fast feedback, AI can also expose downstream problems in throughput and stability.

The lesson is not that AI is bad for delivery.

The lesson is that AI amplifies the system it enters.

---

## [SLIDE: What One Person Project Means — 03-editorial-owner-agent-loop.png]

This is why I use the phrase "one-person project."

But the phrase is easy to misunderstand.

It does not mean one person works alone.

It does not mean QA disappears.

It does not mean teams stop mattering.

[IMAGE: s03-01-owner-holds-context.png]

It means a bounded project or module has one accountable owner who holds the full context.

The user intent.

The codebase constraints.

The quality bar.

The release risk.

The tradeoffs that are too subtle to live inside a ticket.

[IMAGE: s03-02-agents-execution-radius.png]

AI becomes that owner's execution radius.

One agent compares designs.

One drafts tests.

One investigates the code.

One writes docs.

One reviews the diff before a human reviewer ever sees it.

[IMAGE: s03-03-owner-not-hero.png]

But the owner still owns judgment.

The agents own tasks.

They do not own responsibility.

That distinction matters because generation is not accountability.

AI can open a pull request.

A human accepts the risk.

AI can write tests.

A human decides whether those tests are evidence.

AI can explain a diff.

A human decides whether that explanation is true enough.

---

## [SLIDE: The Operating Model — 04-diagram-owner-agents-boundary-evidence.png]

The most useful model I have found is four words.

Owner.

Agents.

Boundary.

Evidence.

[IMAGE: s04-01-boundary-rails.png]

Owner is the human who holds continuous context and accountability.

Agents expand execution.

Boundary is what the team defines together.

Architecture rules. API contracts. Repo instructions. Security limits. Release policy.

Boundary lets one person move quickly without turning speed into system risk.

[IMAGE: s04-02-evidence-pack.png]

Evidence is what makes speed trustworthy.

Tests. Logs. Screenshots. Risk notes. Rollback plans. Production signals.

The more AI output grows, the more evidence matters, because humans cannot manually reconstruct every detail.

[IMAGE: s04-03-risk-based-review.png]

This also changes review.

Not every change deserves the same process weight.

A small, low-risk change with strong evidence should move quickly.

A cross-boundary change, a migration, a permission change, or an architecture shift should slow down and pull the team in.

That is not bureaucracy.

That is how speed stays safe.

---

## [SLIDE: The Wrong Version — s05-01-hero-culture-risk.png]

There is a bad version of the one-person project.

The bad version says: AI is powerful, so let one strong person run fast.

Reduce QA.

Reduce review friction.

Treat process as the enemy.

Optimize for visible speed.

[IMAGE: s05-02-system-drift.png]

That creates local speed and global mess.

Duplicated code increases.

Interfaces drift.

Tests cover the happy path.

Security and permission boundaries get bypassed.

Business rules hide in prompts, temporary decisions, and half-reviewed code.

[IMAGE: s05-03-qa-shift-left.png]

So QA does not become less important.

QA moves earlier.

It becomes risk and evidence design.

Acceptance criteria before implementation.

High-risk paths before the PR.

Generated test drafts from requirements and past bugs.

Exploratory testing where human judgment matters.

Production monitoring after release.

The question changes from:

Did QA check this at the end?

To:

What evidence would make us confident enough to ship?

---

## [SLIDE: The Four Questions — s06-01-four-questions.png]

The deeper change is not headcount.

It is accountability architecture.

The old organization design broke responsibility across roles, then used process to stitch the pieces back together.

AI makes that stitching more expensive, because execution is no longer the scarcest resource.

Context and judgment are.

[IMAGE: s06-02-question-owner-agents.png]

So my current answer is:

Single owner, shared boundary.

Give one person the full loop.

Give the team the boundary.

Make every important decision leave evidence.

[IMAGE: s06-03-question-boundary-evidence.png]

Without an owner, AI output drifts.

Without a boundary, owner speed becomes system risk.

Without evidence, trust collapses into opinion.

[IMAGE: s06-04-team-alignment-system.png]

That is not the decline of teamwork.

It is teamwork moving to a higher level of abstraction.

The strongest AI-era software teams will stop asking only:

What does each role do in this process?

They will ask sharper questions.

Who owns this end to end?

Which agents can they use?

Where are the team boundaries?

What evidence would make us trust this enough to ship?

The teams that can answer those questions will keep individual speed without losing team quality.
