# The One-Person Project

## [HOOK]

Last year, we revised our QA strategy. 

Not because QA was any less important. 

AI coding disrupted our established software delivery rhythm. 

That’s when I realized that much of the software work is reverting to a one-person project model.

---

## [SLIDE: The Old Rhythm Broke — 00-cover.png]

That was the old pattern. 

First, the business analyst clarified the requirements. 

Then, the designer shaped the solution. 

Next, the developer implemented it. 

QA tested the build. 

UAT validated the results. 

Finally, the team deployed.

[IMAGE: s01-01-old-handoff-chain.png]

That flow worked well when execution had a high cost.

Writing code was time-consuming. Making changes took time. Understanding the system required careful thought.

So, the work moved through defined roles, advancing one stage at a time.

[IMAGE: s01-02-ai-compresses-loop.png]

Once AI stepped into the process, a single developer could clarify requirements, evaluate solution options, implement changes, generate tests, write documentation, and produce a first review summary all in one session. 

The process didn’t vanish. 

It got compressed. 

As the work condenses, those old handoffs begin to feel cumbersome.

---

## [SLIDE: The New Bottleneck — 02-narrative-review-bottleneck.png]

AI does speed up coding. That part is accurate.

However, a more pressing issue is how AI shifts the bottleneck. 

It’s not about typing code anymore. 

The real constraint now lies in review bandwidth.

[IMAGE: s02-01-ai-output-flood.png]

AI can generate hundreds of lines of code, multiple tests, a migration note, and a PR description in just a few minutes. 

A human can't review that in the same timeframe. 

Reviewing isn't just scanning text. 

It requires reconstructing context, understanding intent, assessing risk, and ensuring everything aligns with the system.

[IMAGE: s02-02-mental-model-rebuild.png]

When every developer on a project leverages AI to produce more code, the team doesn’t necessarily speed up. 

The workload simply shifts from development to review.

[IMAGE: s02-03-dora-amplifier.png]

DORA highlights an important truth: AI amplifies the existing system.

Strong tests, small batches, clear ownership, and fast feedback can benefit significantly from AI. It builds on what's already working well.

On the flip side, if a team struggles with weak boundaries and slow reviews, AI will only magnify those issues.

---

## [SLIDE: What One Person Project Means — 03-editorial-owner-agent-loop.png]

I find the term "one-person project" useful. 

However, it's easy to misinterpret. 

It doesn’t mean that one person works alone. 

Quality assurance is still essential. 

And teams definitely still play a crucial role.

[IMAGE: s03-01-owner-holds-context.png]

A one-person project means one accountable owner handles a specific module or project. This person has complete context.

They understand the product intent.

They know the codebase constraints.

They set the quality standards.

They also take on the release risk.

[IMAGE: s03-02-agents-execution-radius.png]

AI broadens what that owner can do.

One agent compares designs.

One drafts the tests.

One checks the code.

One produces the documentation.

One reviews the changes before a human sees them.

[IMAGE: s03-03-owner-not-hero.png]

The owner retains the final judgment. 

Agents handle specific tasks. 

However, they don't bear the responsibility. 

This distinction is crucial.

---

## [SLIDE: The Model — 04-diagram-owner-agents-boundary-evidence.png]

The model I use has four key components: 

Owner. 

Agents. 

Boundary. 

Evidence.

[IMAGE: s04-01-boundary-rails.png]

The owner maintains context and accountability.

Agents facilitate execution.

Boundary consists of what the team agrees on: architecture rules, API contracts, repository instructions, security limits, and release policies.

[IMAGE: s04-02-evidence-pack.png]

Evidence is what makes speed reliable.

Tests. 

Logs.

Screenshots.

Risk notes.

Rollback plans.

Production signals.

[IMAGE: s04-03-risk-based-review.png]

Not every change requires the same level of review. 

For a small, low-risk change backed by solid evidence, the process should be quick. 

In contrast, changes that cross boundaries—like migrations, permission adjustments, or architectural shifts—need more scrutiny. 

This isn’t about adding unnecessary layers. 

It’s a way to keep speed safe.

---

## [SLIDE: The Wrong Version — s05-01-hero-culture-risk.png]

There's a flawed perspective at play. 

The idea is that AI's power means we should let one strong individual make decisions quickly. This usually results in less quality assurance, fewer reviews, and a focus on speed over substance. 

In the short term, you might achieve efficiency. But looking at the bigger picture, it leads to chaos.

[IMAGE: s05-02-system-drift.png]

Duplicated code keeps piling up. 

Interfaces change without warning. 

Tests often only cover success cases. 

Business rules can get hidden behind prompts and quick fixes. 

In the end, no one can explain the system's behavior.

[IMAGE: s05-03-qa-shift-left.png]

QA remains crucial, but its role shifts earlier in the process. Now, the focus is on risk and evidence design. This involves defining clear acceptance criteria, identifying high-risk areas, generating test drafts, and applying exploratory testing more strategically.

After the product is released, monitoring in production is critical. The question shifts from "did QA check it at the end?" to "what evidence supports our confidence that this is safe to ship?"

---

## [SLIDE: The Four Questions — s06-01-four-questions.png]

Here’s the takeaway. 

The most effective AI-era software teams won’t begin by defining what each role does in the process. 

Instead, they will focus on four critical questions.

[IMAGE: s06-02-question-owner-agents.png]

Who owns the entire process? 

What agents can they use?

[IMAGE: s06-03-question-boundary-evidence.png]

We define team boundaries with clear roles and responsibilities. What proof do we need to confirm we can ship this?

[IMAGE: s06-04-team-alignment-system.png]

The shift is clear.  

The team is here to stay.  

They’re evolving into a system that empowers individuals with high ownership to work faster with AI.  

We have fewer handoffs.  

Ownership is increasing.  

Process control is decreasing.  

Now, there’s a stronger focus on evidence control.  

I refer to this as the one-person project.

---
