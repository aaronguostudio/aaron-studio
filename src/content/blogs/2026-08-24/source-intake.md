# Source Intake: AI Makes Slow Feedback Loops More Expensive

**Seed:** [Ryan Peterman's X post](https://x.com/ryanlpeterman/status/2089336448889868420) linking to his [interview with Anders Hejlsberg](https://www.developing.dev/p/creator-of-typescript-10x-faster).  
**Evidence bundle:** `research-evidence.json` — `partial`, because the publisher-hosted, timecoded transcript is inspectable but direct YouTube retrieval was throttled.  
**Greenlight status:** `GO` — flipped from `HOLD FOR PERSONAL PROOF` on 2026-08-24 after the bounded validation-loop observation was executed; receipt in [personal-proof.md](personal-proof.md).

## Source map

- Peterman's Aug. 17, 2026 episode covers the TypeScript compiler's native Go port, the limited role of LLMs in that migration, and Hejlsberg's view of AI-assisted engineering.
- At 10:35-13:27, Hejlsberg describes a **port**, not a blank-slate rewrite: semantic compatibility constrained the language choice. Go was chosen for this compiler's needs, including native generation, garbage collection, and shared-memory concurrency.
- At 15:16-18:23, he says a better use of AI in a large migration may be to help build a deterministic transformation program. That makes repeated output stable and contracts the human validation surface; it does not remove the need to validate the program.
- At 49:30-50:00, he argues that more code-writing agents make slow checks more costly: a two-minute type check after each generated change becomes a serious workflow problem.

### What the source does not establish

- It does not prove a 10x result for every TypeScript project, compiler port, or Go migration.
- It does not establish that a deterministic transformer is always safer or cheaper than a direct AI-assisted migration.
- It does not measure an agent-count multiplier, prescribe a CI/type-check target, or show that every team should prioritize tooling speed over another constraint.
- The interview is a strong expert account of a specific project, not a controlled productivity study.

### Separate evidence required before an article

- An Aaron-owned baseline must show the actual wait introduced by a validation command on a real repository and what work is blocked while it runs.
- A bounded repeat or parallel-attempt check must distinguish shared-resource contention from ordinary command duration.
- Any performance claim must name its machine, repository, command, cold/warm state, and run count. A single local number is an illustration, not a market benchmark.

## Candidate angles

### A. Your agent fleet is only as fast as the feedback loop

- **Reader problem:** Teams add more AI coding attempts while review, type checks, and CI remain serial or slow. The dashboard says more work is happening; the delivery system feels slower.
- **Aaron judgment:** When AI cheapens code generation, the useful unit to optimize is not agent count. It is the shortest trustworthy loop from attempted change to a decision someone can act on.
- **Opening it could earn:** An agent produces a patch in seconds; the type check takes two minutes; before the result lands, another agent has already produced the next dependency on an unverified assumption.
- **Why it is distinct:** It turns the source into an operating constraint—feedback-loop throughput—not another argument about whether agents are trustworthy.

### B. Ask AI to build the repeatable tool, not just perform the repeatable action

- **Reader problem:** A team can receive a plausible one-off AI migration and still face a giant review surface every time it runs.
- **Aaron judgment:** The highest-leverage AI deliverable is often a small, inspectable transformer or checker whose repeated behavior is deterministic; AI's value is in helping create that tool, not in making every run look clever.
- **Opening it could earn:** A half-million-line migration is not safer because an AI generated it. It is safer only if the part that repeats has a contract you can run again.
- **Risk:** This overlaps the recent proof/evidence work and must earn a concrete project example to avoid becoming a restatement of "watch the state, not the prose."

### C. Staying hands-on is how an operator samples reality

- **Reader problem:** Leaders try to delegate all implementation as AI makes delegation cheaper, then lose the sensory data needed to notice design drift.
- **Aaron judgment:** Hands-on work is no longer a status signal. It is a sampling strategy: touch enough of the output to update the architecture before a large automated stream compounds the wrong assumption.
- **Opening it could earn:** The dangerous moment is not when an agent makes one mistake; it is when nobody close to the work can recognize the second mistake as the same class of problem.
- **Risk:** This can become a generic career essay and has a weaker, less falsifiable connection to Aaron's current public work.

## Distinctness test

| Related post | Existing thesis | What this candidate changes |
| --- | --- | --- |
| [The Model Got a Body](../2026-08-22/the-model-got-a-body.md) | Agent systems should be judged by their held state, evidence trail, and completion contract—not by polished prose alone. | Candidate A is about the throughput of the validation loop after the contract exists: which wait now limits delivery when AI can produce attempts faster than a team can verify them. |
| [AI Made Code Cheap. It Made Proof the Work.](../2026-08-23/source-intake.md) | The cost shift lets owners make proof explicit, using observable evidence rather than trust in the agent's prose. | Candidate B would be a narrow implementation pattern inside that thesis; it should not proceed unless a fresh transform/replay experiment produces a different receipt. |
| [The agent's first request is an entry fee](../2026-09-02/agent-first-request-entry-fee.md) | Agent economics begin with the request envelope a harness loads before task work begins. | Candidate A follows the request into execution: even a well-priced initial context becomes expensive if each generated attempt waits behind an unmeasured validation loop. |

**Sentence that earns a new article:** *The agent era does not just change who writes the code. It turns every slow validation step into a shared queue, so the operating metric moves from output per agent to trustworthy decisions per unit of elapsed time.*

## Personal-proof plan for Candidate A

> **Status: EXECUTED 2026-08-24.** Full receipt in [personal-proof.md](personal-proof.md). Summary: the publishing-gate build costs ~40 s per attempt and is flat (cold ≈ warm + ~3 s — caching recovers almost nothing); one working copy is a single validation lane whose output had a live consumer; two isolated concurrent attempts raised throughput 1.54× while degrading each attempt's latency 33% at ~4.5 of 18 cores. No stop condition triggered.

- **Baseline:** In one Aaron-owned codebase with a repeatable static check or focused test, record five warm runs and five cold-ish runs of the normal validation command. Capture elapsed wall time, command result, and the smallest unit of work the command gates.
- **Deterministic signal:** Run two independent, unchanged validation attempts sequentially and then concurrently where safe. Record whether each result remains interpretable and whether concurrent execution changes elapsed time or introduces resource contention.
- **Expected result:** The run will identify whether the bottleneck is command duration, queueing, shared resources, or a false premise. It does not need to prove that concurrency is harmful.
- **Stop condition:** Stop if the command mutates project state, cannot be safely repeated, needs production credentials, or the result is dominated by uncontrollable network work. Record `inconclusive` rather than forcing a story.
- **Article boundary:** Do not derive a universal performance claim. The evidence would illustrate one local feedback loop and give the article a real operating receipt.

## Media proof map

| Source moment / article claim | Visual job | Asset concept |
| --- | --- | --- |
| Several agents can write much more code (49:30) | Show why more attempts can create a queue rather than more delivery | A clear queue diagram: multiple generated patches converge on one validation lane; no generic robot imagery. |
| A two-minute type check after each attempt (50:00) | Make wait time visible as an operating cost | A timing strip contrasting fast generation with a slower verification cycle and the decisions held behind it. |
| AI helps build a deterministic transformer (17:04) | Explain the smaller validation surface | Before/after diagram: stochastic one-off transformations versus an AI-assisted transformer with repeatable output and an explicit test boundary. |
| Aaron-owned timing check (observed 2026-08-24, [personal-proof.md](personal-proof.md)) | Supply the article's proprietary receipt | A small table or trace with command, warm/cold time, sequential/concurrent result, and the observed limitation. |

For a companion video, the interview is the original long-form source. A useful Aaron video would need the local timing trace, a queue mechanism walkthrough, and one counterexample where speeding a check was not the limiting factor; a narrated interview recap would not pass.

## Decision

**GO** — Candidate A (updated 2026-08-24; original decision on the same date was `HOLD FOR PERSONAL PROOF`)

The hold condition is met: the bounded validation-loop observation now exists as an owned receipt ([personal-proof.md](personal-proof.md)), executed by Claude on Aaron's machine against the aaronguoblog publishing-gate build, with commands recorded for rerun. The observed mechanism matches Candidate A's thesis: the ~40 s loop is flat (cold ≈ warm), a single working copy serializes attempts by construction, and 2× parallelism degraded per-attempt latency 33% while the machine's cores were mostly idle. Candidate B remains too close to the already-greenlit proof/evidence work without a separate transform/replay receipt; Candidate C stays unspecific.

Aaron has not yet reviewed this receipt. Start the serious package build (memory reflection → editorial brief → dossier → claim ledger) only after he confirms the GO and the Candidate A angle.
