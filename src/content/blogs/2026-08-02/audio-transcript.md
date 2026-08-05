# Audio Transcript: Should You Read AI-Generated Code?

Provider: elevenlabs
Voice profile: aaron-pvc-identity-v1
Voice ID: R2DWp7zZuWmGxk3r8GIA
Model: eleven_multilingual_v2
Output format: mp3_44100_192
Stability: 0.5
Similarity boost: 0.75
Style: 0.5
Speaker boost: true
Speed: 1
Post-production retime: 1.03x transparent tempo adjustment

## Hook

Two respected programmers recently gave almost opposite answers to one question.

Mitchell Hashimoto said: “I read the code.”

Uncle Bob said he does not read the implementation produced by his agents.

That sounds like a fight between engineering discipline and blind faith. It is not. Both men insist that the human remains accountable. The real disagreement is where human understanding should live when machines can produce more code than we can comfortably read.

That is no longer a philosophical question. It is becoming the daily operating question of software teams.

## Two Engineers, Two Gates

Mitchell described a workflow where different models plan, implement, and judge a change. Someone asked how he knows the final result is good. His answer was four words: “I read the code.”

That answer fits the kind of boundary he has also defended in open source: if you submit a change, you should understand it well enough to explain it, maintain it, and fix it. The code remains the shared object that future humans inherit.

Uncle Bob takes a different route. He says his agents work from specifications, unit tests, Gherkin scenarios, mutation testing, QA, metrics, and final verification. He does not treat the generated implementation as the primary interface. His sharper line is: “I am the engineer because I am accountable.”

So this is not responsibility versus irresponsibility. It is source comprehension versus an assurance system built around intent and evidence.

## What They Actually Agree On

Both positions reject the same bad habit: shipping something you cannot defend and blaming the model when it fails.

Mitchell keeps understanding close to the implementation. Uncle Bob moves much of it into specifications, tests, observable behavior, and acceptance criteria.

Their disagreement is narrower, and more useful, than the internet version of it. What must a human understand: every relevant line, or the contract, evidence, boundaries, and failure modes around those lines?

## Why the Community Exploded

The community argument became intense because code review has never done only one job.

Yes, it finds defects. But it also gives the reviewer a mental model of the system. It creates shared language inside a team. And it makes responsibility explicit: another person has looked at this change and is willing to let the organization inherit it.

Automation can replace part of defect finding. It does not automatically replace those other functions.

The “read it” camp worries about maintenance. If nobody understands the implementation, the same agent that built the system becomes the only guide capable of explaining it. That is a fragile loop, especially during an unusual failure.

The “verify outcomes” camp sees a different trap. If AI can create a large change in minutes, then manually reading every generated line may erase most of the leverage. Humans also miss bugs. Better specifications, independent tests, runtime checks, and observability can sometimes provide stronger evidence than a tired reviewer scanning a diff.

A third concern is learning. Reading and changing code is how junior engineers build judgment. A workflow optimized only for throughput may produce software faster while producing fewer people capable of maintaining it.

None of these concerns is imaginary. They are different costs, paid at different times.

## The Industry Is Already Running the Experiment

This is already happening at scale.

OpenAI described an internal product built from an empty repository with no manually written implementation code. After five months, the company reported roughly a million lines and about fifteen hundred merged pull requests. Humans shifted toward specifying intent, building the environment, and creating feedback loops. OpenAI also says human pull-request review became optional in that experiment. It is impressive, but it is still a company-reported greenfield experiment, not proof that every mature system should work this way.

Cloudflare built another kind of answer: up to seven specialized AI reviewers, coordinated into one review, with different depth for different risk tiers. Even there, database migrations are explicitly exempted from the “generated file” shortcut because generated does not mean unimportant.

And Godot exposed the organizational cost. Its maintainers said AI lowered the effort required to create pull requests, while reviewer capacity did not increase. Their response was not simply “ban AI.” It was to insist on human approval and a contributor who can take responsibility and fix the work.

The common pattern is clear: code generation is becoming abundant. Verification, attention, and ownership are becoming the scarce resources.

## What Changes in My Work

In my own work, I do not use one rule for every artifact.

A disposable script, a private prototype, or a copied data file can often be judged by its result. If it fails, the consequence is small and the work is easy to discard.

My posture changes when AI touches a critical system or a system of record.

A critical system is defined by consequence: permissions, money, privacy, deletion, security, or an operation that is hard to recover from.

A system of record is defined by authority: it is where the organization decides what is true about a customer, an order, a balance, or a contractual state.

Those categories often overlap, but not always. The important point is that five lines which write authoritative state can deserve more attention than a thousand lines of disposable interface code.

And rollback is not the whole recovery plan. Reverting code may stop the next bad write. It may not restore records already changed, messages already sent, access already granted, or decisions already made from the wrong state.

## Review Depth Follows Authority

My rule is simple: review depth follows authority.

For disposable work, verify the outcome and move on.

For shared or production work, add independent evidence and make sure someone has a usable model of the system.

For a critical system or system-of-record write, inspect the relevant source path, state the invariant that must remain true, identify the signal that reveals divergence, and name the recovery path and the human owner.

These are cumulative. Tests do not cancel the need for understanding, and reading does not cancel the need for tests.

The unit of review is no longer just the diff. It is the responsibility chain: intent, implementation, independent evidence, authoritative effect, and recovery.

## The Objection

The obvious objection is that risk tiers can become bureaucracy, or an excuse for sloppy work below the line.

That is true if the boundary never moves. A private prototype can become a team dependency. A temporary script can start writing production data. When its authority changes, the review level must change with it.

And learning is a separate axis. A low-risk task may not need deep review for safety, but a junior engineer may still need to read it to build judgment.

## The Better Question

So, should you read AI-generated code?

Sometimes every relevant line. Sometimes only the critical path. Sometimes the outcome is enough.

Before deciding, ask four questions.

What can this code change? Who or what inherits the result? If the commit is reverted, can reality also be restored? And who can explain and repair the failure without asking the same agent to grade its own work?

AI can generate implementation. It can generate tests. It can even generate a review.

It cannot own the consequence.

That is still our job.
