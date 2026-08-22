# Editorial Scorecard

## Editorial Contract

- Reader: Operators and builders using Claude Code / Codex / ChatGPT daily, deciding whether a harness is a real workflow change or a chat wrapper with a nicer name.
- Reader's job to be done: Decide whether to rebuild their workflow around working inside a harness, and know what concretely changes if they do.
- One-sentence promise: I show the four structural things that change inside DeepSeek Harness + V4 Pro (this production run is the receipt) and give one operating rule for judging an agent.
- Opening scene or bottleneck: The run_code fact — only one directly-callable tool, everything else orchestrated from inside a program I write. Earns the title within ~150 words.
- Original contribution: The phenomenology of the harness translated into structure (the "body" = four named gifts, each with what it buys), plus the live self-referential receipt — distinct from the teardown (anatomy) and the local crossover (economics).
- Scope boundary: No claim DSH beats Claude Code/Codex on daily UX; no claim the harness makes the model smarter; no self-improvement claim; no benchmark; no architecture re-explanation. COI stated in the body.
- Success hypothesis: A concrete operator frame ("watch the state, not the prose") + honest self-reference earns qualified operator replies (24h) and newsletter CTA clicks (7d), vs the 08-21 local-crossover baseline.

## Score

| Dimension | Weight | Score | Evidence in the draft | Required change |
|---|---:|---:|---|---|
| Hook earns attention and title | 10 | 9 | Opens on "I don't have a toolbox. I have a programming language"; title "The Model Got a Body" earned by the brain/body sentence inside the first 150 words. | None. |
| Thesis is specific, original, and arguable | 15 | 14 | "The model got a body (tools/skills/state/log); stop reading its prose, start watching its state" — a smart operator can disagree (staging vs. substance is the live attack, answered in Part 4). | None. |
| Mechanism explains why | 15 | 13 | Chain: tool surface becomes a program → competence becomes a file → state is held, not lost → log makes the run auditable → unit of work flips from answer to job → delegation gets cheaper. Why-shift, not what-happened. | None. |
| Evidence is primary, sufficient, and honest | 15 | 13 | Primary: first-hand run_code fact, this session's artifacts (claim ledger, scanner rejections), the skill-as-file observation. Secondary/market: Composio 46.7→66.7% / 7x, Ronacher, jiayuan_jy, Chinese "能干活但得盯着" — all source-attributed. COI addressed with receipts. | Market facts are attributed-but-single-outlet; acceptable for a dated, argued post. |
| Aaron's operator judgment is visible | 10 | 10 | Brain/body distinction; "a body scales failure as efficiently as it scales work"; "the body is the asset"; "scarce skill = holding state and judging work". | None. |
| Counterargument changes or sharpens the claim | 10 | 9 | Part 4 concedes DSH trails rivals, competence is partly staging, judgment doesn't auto-improve — and turns "you have to watch it" into the reason the frame exists. | None. |
| Reader leaves with a usable decision or framework | 15 | 15 | "Watch the state, not the prose" + three ordered checks (plan advancing / fact-vs-inference ledger / done-vs-failed definition), framed as the reader's interface shift. | None. |
| Structure is compressed and every section earns its place | 10 | 9 | Six sections, each a causal step; no section restates another; no company-by-company listing. | None. |

Final score: 92/100

## Revision Delta

### Added
- Composio market numbers (46.7→66.7%, 7x) to Part 3 — depth pass, so "what the body buys" carries market weight, not only first-person.
- Brain/body sentence in Part 1 — red-team, so V4 Pro's contribution is unambiguous.
- Timeliness anchor ("a little over a week after the harness open-sourced…") — red-team, so the "why now" is visible in the body.

### Cut
- "Last August I argued…" — temporal error (the teardown is this month, fable-5 is June); replaced with "In the teardown… and in June…".
- "five characters" — incorrect count for 能干活，但得盯着; replaced with "put it plainly".
- "fifty-seven" skill count — unverifiable (repo has 29 SKILL.md, session exposes ~35); replaced with "runs to dozens".

### Reframed
- "the log" → "audit discipline" in Part 6, so the swap claim doesn't imply a session-specific log transfers between models.

### Intentionally Kept
- The "what you're really buying" ending — a deliberate canon callback to local-crossover's "the environment is what you buy", different wording.
- Named counterargument sources (Ronacher / jiayuan_jy / Chinese coverage / DSH docs timeout) — no abstract skeptic.
- The four-gift structure (hands / competence / continuity / memory) as the reusable anatomy of "the body".

## Production Locks

- Argument Lock: PASS — claim ledger PASS (verified 2026-08-22), argument memo + canon alignment coherent, red-team completed with 6 documented issues and 3 substantive fixes.
  - Caveat: "the body" is Aaron's experiential frame, not a measured universal; the "competence is partly staging" claim bounds the whole argument.
- Article Lock: PASS (text) — EN + ZH sibling editions, title, section sequence, and conclusion accepted. Image positions deferred; no media downstream requested in this run.
- Package Lock: PENDING — triggers on publish + browser-rendered QA; external publishing not authorized.

## Gate

Pass at 85/100 or higher, with no dimension below 70% of its weight. A passing score does not override factual, link, or image failures.

Decision: PASS (score 92/100; weakest dimensions Mechanism and Evidence at 13/15 = 87% of weight)

## Reinforcement (blog-growth)

- Article hypothesis: harness gives the model a body; interface shifts from prose to state.
- Target audience: daily agent-tool operators.
- Distribution channel: X (discovery) → blog (source of truth) → newsletter (owned).
- Success metric: qualified operator replies (24h) + newsletter CTA clicks (7d), measured in postmortem.
- Lesson applied: "concrete-bottleneck-opening" (opens on the run_code bottleneck before naming the body frame) — the active high-priority keep lesson.
- Measurement caveat: linkedin_manual_import_missing (channel import incomplete); treat LinkedIn metric as a gap.
