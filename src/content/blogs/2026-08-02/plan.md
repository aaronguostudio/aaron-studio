# Blog Plan: Should You Read AI-Generated Code? Ask What It Is Allowed to Change

## Meta

- **Author:** Aaron Guo
- **Target:** aaronguo.com blog (EN + ZH bilingual)
- **Tone:** Entrepreneurial, crisp, insight-led, and operationally useful; intellectually honest, with no AI-influencer certainty, invented drama, or teacherly advice
- **Length:** 2,000–2,500 English words; Chinese version adapted rather than mechanically translated
- **Audience:** Experienced developers, tech leads, independent builders, and engineering/product leaders responsible for AI-generated code
- **CTA:** follow
- **Category at draft:** `ai-native-systems`
- **Tags at draft:** `ai-coding`, `code-review`, `software-engineering`, `accountability`

## Hook

Begin with Aaron's honest personal line:

> I cannot point to one dramatic incident that settled this for me. The line appears earlier—in the kind of system being changed. If an agent touches a critical system or a system of record, I stop asking only whether the output works. I need to understand how it changes authoritative state, which invariants it touches, how a wrong value propagates, and whether we can actually restore the truth.

Earn the title within 150 words with this turn: the question is not whether every line deserves equal human attention; it is how a change becomes something a business, customer, or system will treat as fact.

Then bring in the public contradiction: Mitchell Hashimoto's quality control was “I read the code.” Uncle Bob said he no longer reads the implementation his agents write; he surrounds it with specifications, tests, metrics, and QA instead. The original judgment must arrive immediately: they are not divided over whether humans remain responsible. They are divided over where human understanding should sit.

## Thesis

AI code-review depth should be determined not by who wrote the code or how many lines changed, but by what the code is allowed to change: the closer it gets to a critical system or system of record, the more human understanding must descend from outcomes into system invariants, recovery paths, and source.

## Personal Anchor

Aaron has no single cautionary failure story and should say so. His lived evidence is a standing operating boundary: any AI modification to a critical system or system of record creates concern and raises the minimum review depth.

This is concrete because it changes his behavior. Low-risk, private, reversible work may be judged through outcomes and evidence. A system-of-record change requires understanding the authoritative data model, write path, permissions, invariants, downstream consumers, observability, rollback, and data recovery. Do not add an incident, timing claim, defect count, or financial impact.

## Reader Journey

The reader should move through four beliefs:

1. “One expert reads AI code; another does not.”
2. “Both methods produce evidence, but neither alone produces ownership.”
3. “The missing variable is how the change crosses a boundary and becomes authoritative.”
4. “I can now choose a minimum review depth for my own changes.”

## Outline

### Part 1: Two answers that are less opposed than they look

**Section job:** Establish the live debate, correct its original context, and reveal the shared principle within the first 15%.

- Open with Aaron's pre-incident rule, then introduce the two answers as a way to test it.
- Mitchell's “I read the code” came as the quality answer for a new multi-model workflow, not a universal manifesto.
- His OSS human-boundary post is more revealing: private risk can remain private; submitting code to another human creates a review obligation.
- Uncle Bob does not blindly merge. He reads or judges higher-level specifications, Gherkin, QA, metrics, and final behavior, then owns the result through accountability.
- Aaron's inference: both reject exporting verification debt. Their disagreement is whether understanding must live in implementation or can move into constraints and evidence.
- Introduce Aaron's critical-system / system-of-record boundary. No invented anecdote.
- **Transition:** If both reading and constraint systems can be responsible practices, what does each actually buy us?

### Part 2: Reading is not proof. Tests are not understanding.

**Section job:** Give both sides their strongest case, then show why neither is a universal quality mechanism.

- Reading matters because software maintenance depends on a mental model that can survive the unexpected, not only known test cases.
- Reading every line still cannot prove correctness; humans miss difficult bugs, especially when output volume turns review into scanning.
- Uncle Bob's gauntlet scales executable skepticism: tests, mutation testing, coverage, QA, and metrics can attack more paths than one pass through a diff.
- But tests validate encoded expectations, not the completeness or correctness of the expectations themselves.
- Explain evidence independence: one model using one context can reproduce the same misunderstanding in implementation, tests, and checker.
- Compress the “four products of review” into one paragraph: defect discovery, personal mental model, shared team model, and responsibility. Automation most directly helps with the first.
- Use c-CRAB only as bounded support for the shape of current AI-review strengths and gaps; do not lead with benchmark numbers.
- **Transition:** The correct review method cannot be chosen from the author label “AI.” It depends on where the code is going.

### Part 3: The real dividing line is how code becomes truth

**Section job:** Introduce the article's original mechanism and make system of record more than a generic “high risk” label.

- A disposable local script can be wrong without becoming anyone else's reality. Its owner can throw it away.
- A shared PR transfers maintenance and debugging costs to other humans. Use Mitchell and Godot to show how cheap generation externalizes expensive review.
- A system of record does something categorically different: it establishes the authoritative state that reporting, permissions, customer interactions, financial decisions, and downstream workflows believe.
- Distinguish it from a critical system: criticality is defined by the consequence of failure; a system of record is defined by authority over facts. They often overlap but create different reasons for deeper review.
- A small code change can therefore have a larger semantic blast radius than a large UI refactor.
- Rollback is asymmetric: reverting code may stop new damage while leaving changed records, downstream copies, audit history, and customer trust unresolved.
- State Aaron's operating floor: system-of-record modifications begin at System Model review; critical write paths normally descend to Source review.
- Include other L4 triggers so the framework is not mistaken for a database-only rule: permissions, money, privacy, deletion, migrations, concurrency, security, and core infrastructure.
- **Key line:** The unit of review is no longer just the diff. It is the path by which a change becomes fact.

### Part 4: The Review Depth Ladder

**Section job:** Give the reader one usable decision tool, not a general checklist dump.

Ask four questions:

1. **Boundary:** Who inherits the consequences?
2. **Blast radius:** How far can wrong behavior or wrong state propagate?
3. **Reversibility:** Can we detect it in time, and does rollback restore the data as well as the code?
4. **Evidence independence:** Did the checks bring an independent way of being wrong?

Then choose the minimum cumulative level:

1. **Outcome** — Private, short-lived, isolated, easily discarded. Verify the visible result.
2. **Evidence** — Bounded risk. Inspect tests, logs, CI, screenshots, static checks, and an independently prompted reviewer.
3. **System Model** — Shared or production change. Explain interfaces, data flow, dependencies, invariants, failure modes, observability, and recovery.
4. **Source** — Critical systems, system-of-record write paths, permissions, money, privacy, deletion, migrations, concurrency, security, and core architecture. Read the critical diff, trace the path, and validate business invariants, permissions, transactions, idempotency, reconciliation, audit history, rollback / compensation, and downstream recovery.

Use one explicitly illustrative sequence, not a personal anecdote: the same normalization logic begins as a disposable local script, becomes a shared internal tool, and finally writes into a system of record. The code can remain similar while the required understanding changes radically.

State two protections against misuse:

- Levels are cumulative; green tests do not cancel system understanding, and source reading does not cancel runtime evidence.
- Risk classifications expire. A “temporary” script that becomes shared, persistent, privileged, or authoritative automatically moves up the ladder.

### Part 5: What engineering ownership becomes

**Section job:** Resolve the identity question without replacing it with a slogan.

- An engineer is not defined by personally typing or observing every implementation step.
- Nor is an engineer simply the person whose name appears on an AI-generated PR.
- Ownership means being able to explain the intended change, the invariant that must survive, the evidence that could falsify confidence, the failure path, and the recovery plan.
- Connect briefly to Aaron's prior work: AI compresses execution, not responsibility; long-running agents need operating contracts, evidence, stopping conditions, and rollback.
- Preserve the learning objection: senior engineers may safely black-box familiar patterns because earlier code reading built their judgment. Junior development may require deeper source reading even when immediate shipping risk is low.
- Organizational implication: teams need a review policy by change class, not one vague rule for “AI code.” Define which changes force L3/L4, who may approve them, and what independent evidence is required.
- **Transition to close:** AI can move understanding up a layer, but it cannot remove the need for an accountable layer.

### Conclusion: Code can be cheap. Responsibility cannot.

**Section job:** Return to the opening contradiction and leave one operating question.

- Mitchell reads implementation. Uncle Bob reads constraints and evidence. Neither delegates accountability to a model.
- Restate the sharper conclusion: the future is not “nobody reads code.” It is that not all code receives equal human attention—and the allocation of that attention becomes a core engineering decision.
- Before accepting an AI change, ask: What reality can this rewrite? Who inherits it? If every test is green and the world is still wrong, who can explain why and restore the truth?
- Final-line candidate: “Understanding can move up an abstraction layer. It cannot disappear from the chain of responsibility.”
- **Blog CTA:** Newsletter invitation for field notes on building accountable AI-native systems.
- **X CTA:** “Follow if you're figuring out how to use AI without outsourcing judgment.”

## Evidence Discipline

- Attribute all methods to the person or organization describing them; do not turn anecdotes into outcome data.
- Call OpenAI and Cloudflare company-reported internal cases.
- Call Sonar a vendor survey and c-CRAB / Human-AI Synergy preprints.
- Keep Sonar, METR, Cloudflare, and c-CRAB numbers out of the main narrative unless a specific factual gap requires them. Prefer Mitchell, Uncle Bob, Aaron, and one brief Godot or OpenAI receipt.
- Do not quote any video paraphrase that was not verified in the original post.
- Do not use “nobody will read code,” “tests replace review,” or any universal AI quality claim.
- Keep numbers sparse. The article's value comes from the mechanism and decision framework, not a parade of statistics.

## Internal Links

Use no more than three, only where they advance the reader:

1. [The One-Person Project](/blogs/one-person-project-ai-coding) — generation throughput versus accountable review.
2. [I Gave Codex a Task From a Moving Tesla](/blogs/ai-became-my-operating-system) — not typing every line does not remove ownership.
3. [Fable 5 Changed the Unit of AI Work](/blogs/fable-5-managing-ai-autonomy) — operating contract, evidence, stopping conditions, and rollback.

## Visual Ideas

- **Cover:** A clean split image: on the left, a dense diff fading into noise; on the right, a narrow red line entering a labeled “System of Record.” The visual question is not “can you read all this?” but “what is allowed to cross this line?” No robot, glowing brain, or generic neon code.
- **Primary inline visual:** Review Depth Ladder. Horizontal risk progression from `private / reversible` to `shared / authoritative / hard to reverse`; vertical levels `Outcome → Evidence → System Model → Source`. Mark `critical system / system of record` as a minimum-L3 zone with L4 for critical write paths.
- **Secondary inline visual:** Responsibility chain: `Intent → Spec → Invariants → Implementation → Independent Evidence → Authoritative Write → Downstream Effects → Recovery`.

## Distribution Plan

- **Blog:** Long-form English article first, Chinese adaptation second. The title answers an active search question; the original “how code becomes truth” mechanism earns depth.
- **X:** Open with Mitchell versus Uncle Bob, reveal their hidden agreement, then share the four-level ladder. Link only in the reply.
- **Newsletter / LinkedIn:** Lead with Aaron's system-of-record boundary as a professional operating rule. One contrast, one mechanism, one question; no vendor statistics in the teaser.
- **YouTube:** If adapted later, use a visual story of one identical data-normalization function moving from local script to authoritative write path. The code barely changes; the responsibility chain expands.

## Open Questions

None block drafting. The article must preserve the distinction between a confirmed operating rule and a concrete incident, and must label the normalization sequence as illustrative.
