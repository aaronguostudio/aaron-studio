# Red-Team Review

## AI-Like Or Generic Sections

1. **Risk:** The conclusion originally restated all four review levels after the framework had already done the work. This read like a generated summary rather than a final implication.
   - **Action:** Cut the repeated ladder paragraph. The ending now moves directly from the attention constraint to the accountability standard.
2. **Risk:** “The cost did not disappear. It moved across the boundary.” is a compressed contrast that could become formulaic if repeated.
   - **Decision:** Keep this single instance because it names the Godot / OSS externality precisely. Do not use the same sentence pattern elsewhere.
3. **Risk:** “Understanding can move up an abstraction layer” is abstract language.
   - **Decision:** Keep it only as the final payoff because the article has already made the layers concrete through the ladder and system-of-record example.

## News Summary Without Original Judgment

4. **Risk:** The Mitchell / Uncle Bob section could become a recap of two X threads.
   - **Action:** Keep the source reconstruction below 20% of the article and state Aaron's interpretation before the first heading: the disagreement is where understanding sits, not whether a human remains accountable.
   - **Action:** Mark the shared “do not export verification debt” conclusion as Aaron's reading, not as a direct joint claim by the two engineers.
5. **Risk:** Adding Sonar, METR, Cloudflare, c-CRAB, and multiple practitioner essays would turn the piece into a research roundup.
   - **Action:** Exclude their numbers from the draft. Use only Mitchell, Uncle Bob, and one short Godot organizational receipt in the main argument.

## Claims That Need Stronger Evidence

6. **Issue:** “AI has made generation cheap” sounded universal.
   - **Revision:** Narrowed to “in agent-heavy workflows, generation can become cheap,” with Godot supporting the external review-cost mechanism.
7. **Issue:** “A test suite proves only…” overstated what testing proves.
   - **Revision:** Changed to repeatable evidence for encoded cases and expectations; the article now says tests cannot by themselves establish that those expectations match reality.
8. **Issue:** An “independently prompted reviewer” is not necessarily independent.
   - **Revision:** Independence now requires a materially different context, method, model, dataset, or human owner.
9. **Issue:** Same-model implementation, tests, and review sharing a blind spot is a plausible correlated-error mechanism, not measured universal behavior.
   - **Decision:** Keep conditional language: they “can share” an assumption. Do not attach an unsupported frequency.
10. **Issue:** “Review produces several products” is Aaron's synthesis, not an established taxonomy.
    - **Revision:** Recast in first person: “I think of review as doing more than defect detection.”
11. **Issue:** “Authorship does not matter” would be too strong.
    - **Revision:** The article now says authority and consequences set the minimum review depth, while authorship and provenance may raise the evidence required.

## Paragraphs To Cut Or Merge

12. **Cut:** Removed the ladder recap from the conclusion.
13. **Compression decision:** Keep the three-stage normalization example because it demonstrates that nearly identical logic can move from L1 to L4 as its authority changes. It is illustrative and never presented as Aaron's personal incident.
14. **Compression decision:** Keep the senior / junior learning objection to one paragraph. It prevents the expert black-box workflow from becoming generic training advice without opening a second argument.
15. **Watch during prose polish:** The three internal links appear within the ownership section. Each has a distinct job, but one can be removed if the paragraph reads as self-promotion.

## Weak Counterargument Handling

16. **Issue:** The first version risked treating “tests cannot prove the specification” as a complete answer to Uncle Bob.
    - **Revision:** The article now gives the gauntlet its strongest case—repeatable executable skepticism—before explaining specification and correlated-error limits.
17. **Issue:** Risk-based review can become permission to stop reading shared code.
    - **Revision:** Added two guardrails: levels are cumulative, and classifications expire when a tool becomes shared, persistent, privileged, or authoritative.
18. **Issue:** Reduced source reading can erode the team's shared system theory.
    - **Revision:** The article agrees with the objection and uses it to justify L3 / L4 rather than dismissing it.

## Missing Personal Or Operator Judgment

19. **Risk:** No dramatic incident could leave the article without lived evidence.
    - **Decision:** Do not invent one. Aaron's confirmed operating boundary is the evidence: any critical-system or system-of-record change raises his minimum review depth.
20. **Action:** Put “What is this code allowed to change?” within the first 150 words and state Aaron's own L3 / L4 floor inside the framework.
21. **Action:** Make the distinction operational: critical systems are defined by failure consequences; systems of record are defined by authority over facts.

## Ending Quality

22. **Strength:** The ending advances beyond “responsibility matters” to the recovery asymmetry: restoring the previous commit may not restore reality.
23. **Risk:** The newsletter CTA interrupts two strong closing questions.
    - **Revision:** Keep one short CTA before the final question, remove the repeated rollback paragraph and generic final aphorism, and let the “green tests / wrong world” question become the single final landing.
24. **Issue:** The ladder described four levels but did not give a hard-enough routing rule between L2 and L3.
    - **Revision:** Added explicit promotion triggers: private / disposable work may stay L1; external dependence moves to L2; consequential shared behavior, production state, or a system of record moves to L3; authoritative or unacceptable critical paths move to L4.
25. **Issue:** Aaron's judgment stopped at “someone accountable should understand,” which could diffuse ownership.
    - **Revision:** Added a first-person release gate for authoritative writes: named domain owner, reviewed critical path, explicit invariants, and credible reconciliation / recovery are required.
26. **Issue:** The synthesis made Mitchell and Uncle Bob agree too neatly.
    - **Revision:** Preserve the unresolved disagreement over whether an executable constraint system creates enough understanding to replace source reading.

## Required Revisions

- [x] Make authority—not author identity—the first review-routing question.
- [x] Soften universal generation and testing claims.
- [x] Define evidence independence more rigorously.
- [x] Mark Aaron's syntheses and interpretations as such.
- [x] Preserve the critical-system / system-of-record distinction.
- [x] Cut the conclusion's repeated ladder summary.
- [x] Confirm the article contains one primary framework only.
- [x] Add an executable L1–L4 routing rule and first-person release gate.
- [x] Preserve the real Mitchell / Uncle Bob disagreement.
- [x] Make clear that a different prompt alone is not independent evidence.
- [x] Run English style and story-craft scanner after revision.

## Revision Notes

The substantive revision changed the framework's routing logic from `Boundary / Blast radius / Reversibility / Evidence independence` to `Authority / Exposure / Recovery / Independence`. This better earns the title and makes system-of-record authority the first decision rather than one example among many. The revision also narrowed claims, strengthened the objection, and compressed the ending.

## Revision Delta

### Added

- Authorship / provenance caveat: they may raise evidence requirements but do not lower the authority-based floor.
- A compact sentence distinguishing what reading and tests each contribute.
- Explicit first-person labeling for Aaron's review taxonomy.
- A hard release gate for authoritative writes.
- Explicit routing triggers between ladder levels.

### Cut

- Repeated four-level summary from the conclusion.
- Repeated rollback / restore paragraph and the second final aphorism.
- Main-article use of vendor survey and benchmark numbers.

### Reframed

- Verification debt as Aaron's interpretation of Mitchell and Uncle Bob, not their joint language.
- Testing from “proof” to bounded, repeatable evidence.
- Independent review from a different prompt to a materially different context, method, model, dataset, or human owner.
- Review routing from generic risk to authority, exposure, recovery, and independence.
- Mitchell / Uncle Bob from apparent agreement to shared accountability plus a real disagreement about sufficient understanding.

### Intentionally Kept

- The honest absence of a dramatic incident.
- The illustrative CSV-to-system-of-record sequence.
- One brief Godot example.
- One paragraph on the junior-learning objection.
- Three candidate internal links, pending prose polish.

## V2 User-Directed Structural Redraft

### New editorial problem

Aaron judged the first accepted draft too indirect and too long. He requested a debate-first sequence, followed by his work challenge and only then his position.

### Substantive revision

- Replaced the personal-boundary opening with the current Mitchell / Uncle Bob dispute.
- Moved Aaron's critical-system / system-of-record experience ahead of the explicit thesis.
- Cut the English article from roughly 2,350 words to roughly 900.
- Cut the Chinese article from roughly 6,360 characters to roughly 2,470.
- Compressed the four-level framework to one line per level.
- Removed Godot, three internal links, the senior / junior branch, repeated synthesis, and the Newsletter CTA.

### V2 red-team findings

1. “Community split into two camps” was too absolute and weakly sourced.
   - **Revision:** Changed to two competing claims / two visible positions.
2. Compression risked dropping Mitchell's human-boundary reasoning.
   - **Revision:** Restored it in one source-linked sentence.
3. Compression weakened the best objection to reduced source reading.
   - **Revision:** Added one sentence on losing the team's shared system model and tied it to L3 / L4.
4. The explicit thesis now arrives later than the default first-15% rule.
   - **Decision:** Intentional user-approved exception. The title supplies the answer; the body earns it through debate and lived work context.
5. The shorter draft could have lost the recovery mechanism.
   - **Decision:** Keep the distinction between reverting code and restoring authoritative records, downstream copies, audit history, and prior decisions.

### V2 decision

**PASS.** Independent scorecard: 90/100. The shorter version preserves the thesis, mechanism, evidence boundary, objection, framework, and release gate.
