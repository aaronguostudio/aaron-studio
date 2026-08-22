# Editorial Scorecard

## Editorial Contract

- Reader: A technical operator who uses coding agents daily (Claude Code / Codex class), follows AI infra news, and is deciding where their own tooling investment should live.
- Reader's job to be done: Diagnose which layer failed when an agent fails, and decide which AI assets to build portable vs accept as locked-in — using the DeepSeek launch as the occasion, not the subject.
- One-sentence promise: After reading, you can name the layer that decides whether agent work completes, read the DeepSeek/Anthropic harness moves as strategy rather than news, and sort your own AI assets into rent / churn / own.
- Opening scene or bottleneck: Composio's 2026-08-11 experiment — same DeepSeek V4-Flash, eight harnesses, thirty real workflows, 240 verified runs: success 46.7%→66.7%, cost per completed task $0.028→$0.195 (7x), seven tasks flipping on harness choice alone. Two days later DeepSeek open-sources its harness, MIT, same day as V4-Pro GA. (Timely market event carries the first claim; personal attribution moment appears only as a one-line entry point.)
- Original contribution: (1) The repo-verified three-move strategy read — format surrender / honest subsets / rival absorption — which no existing English coverage has; (2) the closed-moat vs open-funnel mirror between Anthropic and DeepSeek, labeled as interpretation; (3) the rent / churn / own asset test as the builder's decision lens; (4) the "harness = productized operating contract" bridge to Aaron's June thesis.
- Scope boundary: No hands-on DSH production verdict (not yet used in anger — UX judgments defer to quoted insiders); no harness ranking (Composio's caveats forbid it — the article uses the spread only); strategic intent framings are marked as Aaron's read; no prediction of who wins the harness war.
- Success hypothesis: Deep-reader signal — the attribution problem is a felt pain with a fresh number attached, the strategy read is genuinely unavailable elsewhere in English, and rent/churn/own is quotable; expected outcome is above-median read time, builder replies about their own asset split, and the piece becoming the cited operator reference for the DSH launch.

(v5+ teardown restatement, 2026-08-15: the bullets above are the v4-era contract, kept as record. After the Argument Lock reopen, the reader is unchanged, but the promise became: you can name the four verified designs inside DeepSeek's harness — with their costs; read DeepSeek's strategy from its code rather than its press; and know which layer of your own AI stack to own. The v12 score below is judged against this restatement.)

## Score (v12, 2026-08-15)

Method: three independent judges — skeptical senior editor, target reader (daily coding-agent operator), evidence auditor — each scored the full bilingual pair against the locked teardown thesis ("here is what's actually inside, verified, with its costs"), blind to each other. Independent totals: 89 / 90 / 88, all passing, no dimension below 80% of weight. Synthesis takes the median per dimension except Evidence, which follows the auditor's specific findings rather than the median.

| Dimension | Weight | Score | Evidence in the draft | Required change |
|---|---:|---:|---|---|
| Hook earns attention and title | 10 | 9 | Composio spread lands in sentence two; the Ronacher winner-revises-homework anchor carries ¶2; title earned by ¶3 ("the four designs most worth learning from it"). Editor's dissent (8/10): date-first news lede risks feed-skim bounce before the differentiated material appears | none in article (opening is Aaron's locked choice); carry the Ronacher angle into distribution headlines/social copy |
| Thesis is specific, original, and arguable | 15 | 13 | Finding 4's "operating manual in public" claim exists nowhere else in English coverage; the closing rule (models swappable / don't bind the harness / own the portable layer) is attackable. "With its costs" lands unevenly: findings 1-2 carry explicit cost ledgers, finding 3 reads as pure win | P1 (scope "first public specimen"); optional one cost sentence in finding 3 |
| Mechanism explains why | 15 | 14 | derive/refuse sketch makes the invariant concrete; lawyer analogy → "the provider holds the safe, the harness holds the key"; the findings-1↔3 interlock ("It can dare to assert that because of the log design") is the piece's best mechanistic move | optional: one clause on why the loader drops deps in crash story 2 |
| Evidence is primary, sufficient, and honest | 15 | 13 | Pinned commit, first-person branch counts, date-scoped pricing, exemption-carrying quantifiers. Auditor's three findings: Pi named "top scorer" without the C2 caveat the ledger itself mandates; "Exactly one rule in the whole system is not automated" is falsifiable by a repo-literate reader; the Anthropic persistent-execution contrast is the only load-bearing external claim with no link and no ledger row | P2, P3, P4 |
| Aaron's operator judgment is visible | 10 | 9 | "Here's the detail that stopped me"; "If I could take only one thing"; "My take... For the rest of us"; "My read — and it's a read"; personal adoption list with "my agents also re-pitch last month's dead ideas". Gap: which repo practices Aaron declines goes unsaid | optional: one calibration clause in "What I learned" claiming the everything-is-config non-adoption as a decision |
| Counterargument changes or sharpens the claim | 10 | 8 | Anthropic contrast converts finding 1 into line-drawing; crash stories + 27-check bill price finding 2; honest-limits narrows the recommendation to "not your first choice this week". Gap (all three judges): moat-vs-funnel has no rival reading; finding 4's cheap-docs objection ("when writing costs nothing, volume proves nothing") is unstaged | P5, P6 |
| Reader leaves with a usable decision or framework | 15 | 14 | Three same-week adoptables, each concrete; decision rule plus the one-hour two-column exercise. Locked column unexemplified; "work on day one" mildly over-claims the field subset; "add five lines" presupposes an event log | optional: two locked-in examples; "load on day one"; one concession clause on the log prerequisite |
| Structure is compressed and every section earns its place | 10 | 9 | Section openings are claims ("Start with the money"); ending converts findings into adoptions and closes on a decision, not a summary. Finding 1 runs ~15% long; the lawyer analogy carries two spare setup sentences | optional trims only |

Final score: 89/100 — gate PASS (lowest dimension 80% of weight; floor is 70%).

### Panel follow-ups (Aaron approved all six in session; applied as v13, 2026-08-15 — v12 preserved in revisions/v12-fact-fix{,-zh}.md)

- P1 — Scope "the first public specimen": → "the first at this scale that I know of" / 「我见过的第一个这种规模的」. Most quotable and most falsifiable claim in the piece; one counterexample repo in the comments dents finding 4's frame. (2 judges + risk lists)
- P2 — Add Composio's caveat where Pi is named top scorer (one clause: "Composio itself cautions Pi ran a different reasoning setting — take the order loosely"). Required by the ledger's own C2 instruction ("always cite alongside"), currently unmet at that spot. (auditor)
- P3 — "Exactly one rule in the whole system is not automated" → "the rule they conspicuously left to humans" / 「他们刻意留给人的那条」. Removes a sentence falsifiable by repo-literate readers. (auditor)
- P4 — Anthropic persistent code-execution environment claim: add source link in both editions + a ledger row + a pre-publish check. The only load-bearing external claim with neither. (editor + auditor)
- P5 — One steelman sentence before "My read" in the strategy section: name the cheaper reading (giving away a trailing harness costs little — commoditize-your-complement) and show the funnel read absorbing it. (editor + auditor)
- P6 — Stage finding 4's cheap-docs objection and answer it with the retention rule + verified-red gates. (target reader)
- Optional smaller: locked-column examples; "work on day one" → "load on day one"; hedge "Most of this code was not typed by humans" as inference; trim lawyer-analogy setup; trim finding 1 ~15%.

### Superseded score (v4 market-frame era)

| Dimension | Weight | Score | Evidence in the draft | Required change |
|---|---:|---:|---|---|
| Hook earns attention and title | 10 | 9 | Opens on the blame reflex (felt pain), lands the Composio numbers by sentence four, and earns the title inside paragraph three ("those two events are one story: the harness is the product now") — inside the 150-word window | none |
| Thesis is specific, original, and arguable | 15 | 13 | One-sentence thesis a smart operator can attack (and Part 6's objections show how); the rent/churn/own conclusion inverts the news framing rather than repeating it | none |
| Mechanism explains why | 15 | 13 | Part 2 names the harness's actual decisions (context assembly, tool exposure, loop control, evidence), bridges to the June operating-contract idea, and explains the spread as eight different contracts for one worker | none |
| Evidence is primary, sufficient, and honest | 15 | 14 | Composio page fetched and quoted with its own caveats inline; repo claims verified at pinned commit 47f9438; epistemic downgrades applied in revision ("I haven't seen one"; commits/day exact); ranking refused, spread only | none |
| Aaron's operator judgment is visible | 10 | 9 | "Here's my read... because intent doesn't sit in a repo" explicitly owns the strategy interpretation; the July前判 stated with dates; personal portable-vs-locked split disclosed | none |
| Counterargument changes or sharpens the claim | 10 | 9 | Three steelmanned objections; R5 added the task-length boundary that genuinely narrows the claim; the roughness objection is conceded and then inverted into churn evidence | none |
| Reader leaves with a usable decision or framework | 15 | 13 | Rent / churn / own with one concrete same-day action (two-column asset inventory = "your position in this war") | none |
| Structure is compressed and every section earns its place | 10 | 9 | Seven sections, each adding a causal step/proof/objection/decision; launch recap held under two paragraphs (<20%); one transition paragraph kept deliberately for rhythm | none |

Final score (v4, superseded): 89/100

## Revision Delta

(v12 → v13, 2026-08-15, panel follow-ups P1-P6, Aaron approved all six; v12 preserved in revisions/. Both editions: "first public specimen" → "clearest public specimen yet" (heading, P1); Composio's Pi caveat added where the top-scorer edge is named (P2, closing the C2 always-cite-alongside gap); "exactly one rule is not automated" → "the rule they conspicuously left to humans" (P3); Anthropic code-execution claim linked to platform.claude.com docs + new ledger row C27, page fetched and quote-verified same day (P4); one cheaper-reading steelman added before "My read" in the strategy section (P5); finding 4's cheap-docs objection staged and answered with the notes lifecycle rules + verified-red requirement (P6 — adversarial verify caught the first draft over-generalizing the rejected-note retention rule to all 683 notes; the shipped wording separates rejected-pruned / superseded-archived-frozen / postmortem-verified-red). The recorded panel score (89) was given to v12; P2/P3/P4 address the auditor's docked evidence points and P5/P6 the counterargument gap all three judges named — re-scoring deferred since 89 already passes and the fixes only close named gaps. Scanners re-run post-edit: EN and ZH results recorded below the v12 entry stand unchanged.)

(v11 → v12, 2026-08-15, post-Article-Lock fact-precision pass from the repo-side head-recheck — head-recheck-2026-08-15.md; Aaron approved applying the corrections in session; v11 preserved in revisions/v11-article-lock.md and revisions/v11-article-lock-zh.md. Seven corrections, both editions, none touching structure, thesis, or section sequence: bash-timeout claim rescoped to read/write/edit (bash has a 120s shell-executor default); "built their own skill format first, then deleted it" replaced with the verified spelling-migration story (2026-07-28 note); "field-for-field SKILL.md compatibility" reduced to same-format; "first 251 lines identical" reworded to configuration-identical-comments-aside; time-injection sketch corrected (no change-detection exists; DSH ships with the clock off by default); KV-Cache-effect quantifier scoped (four audited model-agnostic packages exempt); rejected/ "standing rule" replaced with the notes README's actual retention rule. Ledger rows C7/C16/C17/C21 corrected in step. Scanners re-run post-edit: EN 88/100 pass with the same single reviewed-and-accepted formulaic-contrast flag as at lock; ZH 100/100 — no new flags introduced.)

(v1 → v3: red-team pass R1-R5, then a three-reviewer prose-polish pass, 26 edits across both editions. Details in red-team-review.md and prose-polish-review.md.)

(v5 → v6, 2026-08-15, from Aaron's second review — six directives, all applied to both editions; v5 preserved in revisions/: title de-clickbaited to 「我从 DeepSeek Harness 学到的」/ "What I Learned From DeepSeek's Harness"; opening's "not in the coverage" stance replaced with the Armin Ronacher anchor (C22 — Earendil co-founder, company behind Composio's top-scoring Pi, quote fetched verbatim from The Register 2026-08-14); four findings numbered; real repo excerpts added to findings 2-3 and labeled schematics to finding 1 (C25); finding 4 expanded into the "first public specimen of AI building complex systems" discussion with first-party branch-prefix counts (C24), the Sawyer Hood line (C23), and the one-person-project canon link. EN scanner 88/100 pass with one medium formulaic-contrast flag reviewed and intentionally accepted (single occurrence, carries the section's core reframe); ZH 100/100. Score pending Aaron's re-read.)

(v3 → v4, 2026-08-15, from Aaron's review — six directives, all applied to both editions; v3 preserved in revisions/: methodology-caveat paragraph compressed to one plain sentence (detail lives in claim-ledger C2); HN quote cut entirely — its setup framing was unfair to DeepSeek (C11 marked NOT USED); the three coined section labels (Format surrender / Honest subsets / Rival absorption) replaced with plain bolded statements; objections section retitled "Where my read could be wrong" with an explicit transition and a named source for each doubt, replacing the ungrounded "smart skeptic" device. Lessons promoted to blog-writing-language.md (直接陈述优先于自造标签). Scanners re-passed 100/100 both editions. Score unchanged pending Aaron's re-read.)

### Added

- Task-length boundary condition to objection 1 (harness spread grows with run length — Composio's tasks were long multi-tool workflows).

### Cut

- "Your existing assets work on day one" overclaim (scoped to skills + instruction files); unfalsifiable "never felt like raw intelligence" framing; "as the next move shows" meta-signposting; "Nobody has" unverified absence claim.

### Reframed

- Part 2 personal beat from feel-claim to observable-levers claim; "paying rent" metaphor conflict → "hostage to pricing power"; densest not-X/it's-Y cluster (objection 2) → "You don't anchor assets to moving ground" / 「还在动的地面，不适合下锚」; seven-plus Chinese literal-translation skeletons rebuilt (诚实一段→老实交代、专有表面盖深楼→私有地基、缺口→局限、完成的工作→干完的活); EN borrowed ZH's stronger knife line for portability.

### Intentionally Kept

- Ranking refusal (spread only) despite lower shareability; the one-line transition paragraph before the mechanism section; "Same worker, different manager" closer; title 「Harness 才是产品」 (alternatives recorded in prose-polish-review.md for distribution use).

## Production Locks

- Argument Lock: REOPENED then re-locked as v5 (2026-08-15) — Aaron's review judged the market-frame version too surface-level ("缺少硬核对 deepseek harness 的深度研究和解读"). Structural redraft: title/slug changed to the teardown framing (deepseek-harness-teardown), body rebuilt around four repo-verified findings (log-only truth + runtime assertion C15; loop-as-config C16; CI-enforced cache discipline C17/C18; the repo as process artifact C19/C20), strategy read and asset frame compressed into the tail, honest-limits paragraph sourced from the repo's own admissions (C21). v4 preserved in revisions/. Thesis evolved from "the harness is the product" to "here is what's actually inside, verified, with its costs."
- Prior Argument Lock (v4, superseded): PASS (2026-08-15)
  - Evidence: thesis stable across editorial-brief/argument-memo/plan and survives the four steelman objections in argument-memo.md; claim-ledger.md Decision: PASS with all load-bearing numbers recomputed from primary sources (Composio page fetched in full; repo facts counted at pinned commit 47f9438); mechanism (context assembly/tool exposure/loop control determine outcomes) and the one executable framework (rent / churn / own) fixed; canon-alignment.md PASS with three binding execution notes (operating-contract bridge in Part 2; services-vs-product reconciliation sentence; ACTOR excluded).
  - Caveat: three pre-publish re-verifications remain open and do not block prose (C5 official announcement wording; C7/C8 repo paths at publish-time HEAD; any Anthropic/OpenAI public response after 2026-08-15 — would add a paragraph to Part 5, not change the thesis).
- Article Lock: PASS (2026-08-15) — Aaron accepted both editions at v11 ("文章可以了") after four review rounds (v4 market-frame rejection → v5 teardown pivot → v6-v10 per-section deepening → v11 plain-language pass). Title, section sequence, and conclusion are final: 「我从 DeepSeek Harness 学到的」/ "What I Learned From DeepSeek's Harness".
  - Evidence: Aaron's explicit acceptance in session, 2026-08-15; scanners EN 88/100 pass (one reviewed-and-accepted formulaic-contrast flag), ZH 100/100.
  - Stale downstream assets: none exist yet (no images, no video, no distribution files). NOTE: plan.md's visual ideas and content-plan.md's distribution briefs predate the v5 teardown pivot — refresh them against the final article before use. The v4 scorecard score (89) predates the rewrite; re-score against v12 before Package Lock.
  - Post-lock fact-precision pass (v12, 2026-08-15): seven repo-fact corrections from head-recheck-2026-08-15.md applied to both editions with Aaron's in-session approval; structure, thesis, and section sequence unchanged; scanners re-passed at lock-time scores (EN 88 with the same accepted flag, ZH 100); no downstream assets existed to go stale — lock maintained.
- Package Lock: PENDING
  - Evidence:
  - External publishing authorized: no

## Gate

Pass at 85/100 or higher, with no dimension below 70% of its weight. A passing score does not override factual, link, or image failures.

Decision (v12, 2026-08-15): PASS — 89/100 by three-judge panel + synthesis (independent totals 89/90/88), lowest dimension at 80% of weight. Score does not override the open pre-publish re-verifications: C5 wording, publish-day pull, C22/C23/C26 web checks, and (new, from this panel) the Anthropic persistent-execution source link (P4). Panel follow-ups P1-P6 are post-lock micro-edits pending Aaron's call; none blocks this score, but P1-P4 are the cheapest insurance against the comment-section attacks the judges predicted.

(Superseded v4 decision: PASS — 89/100; its "Article Lock remains PENDING" note predates Aaron's v11 acceptance.)
