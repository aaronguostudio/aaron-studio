# Audit: Writing pipeline quality — brainstorm, outline, canon alignment, write, prose edit

> Generated 2026-08-22 by a multi-agent audit of tiles/blog-production and its chain. Evidence cites working-tree file:line at audit time.

## Summary

The writing chain produced one genuinely excellent article (2026-08-19), but the package's own timestamps show the skill pipeline did not produce it: the full pre-draft stack (brief, dossier, ledger, memo, canon, plan — all built 01:38-04:36 on 08-15) encoded a "market-frame / rent-churn-own" angle that Aaron rejected in 15 minutes at v4 (07:17), and the winning "teardown" angle came from his feedback, not from any gate. Red-team (06:02) and prose-polish (06:23) were run on the discarded v1-v3 draft and never re-run on the v5-v13 article that shipped; the plan, argument memo, and canon-alignment still describe the dead article. What actually added quality was (a) the claim ledger plus the 08-15 head-recheck (68 checks, 9 mismatches, 7 factual corrections to the article, including a false "deleted its own skill format" claim that had passed the ledger's own Decision: PASS), (b) the 3-judge scorecard panel, and (c) Aaron's four review rounds, whose five concrete writing rules mostly live only in handoff.md. The style scanner is saturated: 08-19 EN 88/100, ZH 100/100, and 08-26 and 09-16 both 100/100; its tension check fires on the word "but", its lived-evidence check on "I" plus "review", so it no longer discriminates between a 4,200-word verified teardown and a 1,290-word essay with ten "It is/That is" sentence-openers. Bilingual quality is real on 08-19 (idiomatic, localized pricing) but regresses to translation-shaped prose with untranslated "proxy/ratio/measurement system" on the Greece series. Research was a one-off 14-agent run whose replay script sits outside the repo; there is no teardown-research skill, so the rigor does not generalize. For productization the core blocker is that every judgment gate is self-certified by the same agent in free-form markdown, checked only by regex for "Decision: PASS" and "Final score: N/100", with no staleness tracking between upstream artifacts and the article.

## Strengths

- **Claim ledger + independent head-recheck is the one mechanism that verifiably raised quality** — src/content/blogs/2026-08-19/claim-ledger.md rows C5 (adversarial 3-angle re-verification), C24 (branch prefixes counted first-hand), C28 (27 checks counted two ways); head-recheck-2026-08-15.md:15 '68 项检查: 56 VERIFIED / 9 MISMATCH / 3 AMBIGUOUS', A1-A7 corrections applied as v12; cited by 10 downstream artifacts (argument-memo, plan, scorecard, video-brief, video-treatment, distribution-plan)
  - Why it matters: This is the only step where the pipeline caught a published-grade error (A2: 'built their own format first, then deleted it' existed nowhere in the repo; A1: bash timeout claim was false). It is the seed of a fact-check desk and should be protected and made a skill.
- **Red-team and scorecard revision deltas are specific, falsifiable, and actually applied** — red-team-review.md:15-17 R1-R3 (overclaim scoped, 192/day rounding, 'Nobody has' downgraded to 'I haven't seen one'); editorial-scorecard.md:34-39 P1-P6 from a 3-judge panel with independent totals 89/90/88, each tied to a draft location and applied as v13
  - Why it matters: The form of the review is right: named issue, draft location, required change, recorded delta. The problem is when it ran (see gaps), not how.
- **Aaron's review rounds produced transferable writing rules** — handoff.md:48-50 '本轮沉淀的写作规则': 抄→学习/拿来用; metaphors must be common or explained in place; counterarguments must name their source; numbered claims must be first-hand counted; fairness check on characterizations. One of these landed in src/content/strategy/blog-writing-language.md:104-111
  - Why it matters: These five rules are the closest thing in the repo to a positive voice spec; they explain why v11 reads better than v4.
- **The ZH edition of 08-19 is an adaptation, not a translation** — deepseek-harness-teardown-zh.md:117 pricing cutover localized to '北京时间 8 月 17 日 00:00' vs EN '16:00 UTC on August 16' (ledger C31 records the deliberate split); idioms 翻车/手滑/说破就破/摊得开; numbered 一、二、 headings; code comments translated, code untouched (head-recheck D: 8 blocks parity)
  - Why it matters: Shows the bilingual rule in editorial-system.md ('sibling editions') can be executed at native quality when effort is spent.
- **Package-level lock discipline prevented downstream waste** — editorial-scorecard.md:87-94 Argument Lock reopened at v5, Article Lock v11 with 'stale downstream assets: none exist yet'; blog-package-quality.ts:354-366 checks canonical video sha256
  - Why it matters: The video/image phases were not started against a moving article; this is a real process win to keep.

## Gaps

### [high/structure/S] Red-team and prose-polish gates were satisfied on the discarded draft and never re-run on the shipped article

- Evidence: File mtimes: red-team-review.md 08-15 06:02, prose-polish-review.md 06:23; v4 rejected 07:17, v5 teardown 07:47, v11 lock 10:23, final 08-16 01:26. red-team-review.md:3 'against draft v1'; its R4/R5 target 'Part 2 personal beat' and 'objection 1' which do not exist in the final. prose-polish-review.md:34 defends the title 'The Harness Is the Product Now' which was replaced. tiles/blog-production/SKILL.md:135-136 detects only file existence, so the gate showed green.
- Recommendation: Make review artifacts version-bound: each must carry `reviews: <slug>.md@<sha256 or revision id>`; blog-package-quality.ts should fail when the reviewed hash does not match the current article. Re-run red-team and prose-polish on the 08-19 final before treating it as the golden sample.

### [high/structure/M] Pre-draft artifacts go stale after a structural pivot with no detection; the golden sample's plan, memo, and canon describe a dead article

- Evidence: plan.md:1 'Blog Plan: The Harness Is the Product Now' with Parts 1-6 (rent/churn/own) vs final six sections of the teardown; argument-memo.md:5 core thesis is the v4 thesis; editorial-scorecard.md:13 admits 'the bullets above are the v4-era contract, kept as record'; handoff.md:26,28 warns content-plan and plan.md visual ideas 'predate the v5 pivot'
- Recommendation: Add a `structural-redraft` step in blog-write that, on a >=2-of-7 change (SKILL.md:129 already defines it), regenerates argument-memo.md and plan.md from the new draft and marks the old ones superseded. Package-quality should compare the article's H2 list against plan.md section titles and warn on <50% overlap.

### [high/quality/S] No angle-selection step between research substrate and brief; the brief actively steered away from the angle that won

- Evidence: idea.md:5 fixed the title 'DeepSeek Just Proved the Harness Is the Product' before research; editorial-brief.md:61 kill criteria: 'Kill or rewrite if the draft becomes: a DSH feature walkthrough'; research-dossier.md:52 locked the coined labels (格式投降/诚实子集/本体收编) Aaron later deleted; the 14-note substrate (src/brain/reading/deepseek-harness-teardown/, 500KB) existed at 08-15 but the brief's 'Original Contribution' (line 25) was strategy-read + rent/churn/own; Aaron's rejection reason (scorecard:87) '缺少硬核对 deepseek harness 的深度研究和解读'
- Recommendation: Insert an `angle-memo.md` step after research-dossier and before editorial-brief: 3-5 candidate angles, each scored on (a) evidence density the dossier uniquely supports, (b) what existing coverage lacks, (c) Aaron's first-hand share. Require Aaron to pick before the brief is written. For teardown-class sources, the default angle is 'what the substrate uniquely knows', not the pre-existing thesis.

### [medium/automation/M] Style scanner is saturated and mis-weighted; it no longer discriminates

- Evidence: blog-style-quality.ts:131 TENSION_PATTERN matches bare 'but'; :207-216 hasLivedEvidence passes on first-person + 'review'/'process'; :133 PAYOFF checks last 900 chars for 'should/must/means'; :67 penalizes 'leverage' while blog-write SKILL.md:61 names leverage as a core topic; :63 'landscape' flagged as slop regardless of context. Scores: 08-19 EN 88 (one formulaic-contrast), ZH 100; 08-26 EN/ZH 100/100 (prose-polish-review.md); 09-16 100/100. Missing: 'It is/This is/That is' sentence-opener tic (10 in greece-debt-didnt-disappear.md vs 1 in 08-19), one-line-paragraph staccato, aphorism endings, hedge density, em-dash density, cross-post heading/ending template sameness.
- Recommendation: Turn the scanner into a diff-aware profile rather than pass/fail: report sentence-opener repetition, % one-sentence paragraphs, em-dash per 100 words, hedge words per 500, and compare against a corpus baseline built from src/content/blogs/*/*.md. Add a cross-post structural check (ending pattern 'The rule...' + italic series teaser appears in 08-17, 08-21, 09-02, 09-16, 09-23, 09-30). Demote 'leverage'/'landscape' to context-gated.

### [high/structure/M] Judgment gates are self-certified prose; package-quality only greps for 'Decision: PASS' and 'Final score: N/100'

- Evidence: blog-package-quality.ts:274 `/Decision:\s*PASS\b/`; :463 `Final score:\s*(\d+)`; templates/workflow3/claim-ledger.md ships with 'Decision: PENDING' and nothing prevents the drafting agent from flipping it; the 08-19 ledger was PASS on 08-15 with C7 wrong (head-recheck A2/A3) and only the ad hoc 22-agent recheck caught it; 09-16 scorecard 88/100 and 08-26 91/100 were scored by the same session that wrote the drafts
- Recommendation: Separate author and judge: scorecard and ledger verification must be produced by a subagent with a different system prompt that receives only the article + ledger (not the drafting context), and must write `judge: independent` plus its issue list; package-quality rejects scorecards lacking that marker. Keep the 3-judge panel pattern from 08-19 as the canonical implementation.

### [high/automation/L] Teardown research has no reusable harness; the 14-agent run and the 68-check recheck live outside the repo

- Evidence: src/brain/reading/deepseek-harness-teardown/README.md:11 'Produced 2026-08-15 by a 14-agent parallel analysis ... over the local clone'; head-recheck-2026-08-15.md:11 replay script path is `~/.claude/projects/-Users-aaronguo-Work-lab-deepseek-harness/.../workflows/scripts/dsh-head-recheck-wf_43638681-a0a.js`; tiles/blog-brainstorm/SKILL.md:68-80 research step is 6-10 web searches of reddit/X/HN (trend scouting, not primary-source analysis); no tile for subsystem teardown, claim extraction with file:line, or pinned-commit recheck
- Recommendation: Create `tiles/source-teardown/`: inputs = repo path + pinned commit + subsystem list; outputs = NN-<subsystem>.md notes with file:line evidence, a generated claim-ledger.md seed (one row per evidenced claim), and a `recheck.ts` that re-verifies every file:line at HEAD and reports VERIFIED/MISMATCH. Move the dsh-head-recheck script into the tile as the first implementation.

### [medium/craft/S] Voice is codified only as prohibitions; no positive exemplars, so the Greece series drifts into a different (staccato, aphoristic) voice the gates approve

- Evidence: blog-writing-language.md:23-58 is entirely anti-patterns plus 3 weak/stronger pairs; no sentence-level exemplars from 08-19. greece-debt-didnt-disappear.md:16-22 'It is a satisfying story... It is also too neat. ... It is not only a story about Greece. It is a story about...' ; eurozone-failure-domain.md ending 'Happy paths show performance. Failure modes show architecture.'; every post since 08-17 ends with an italic series teaser. 08-19 voice markers (first-hand counting, 'Here's the detail that stopped me', explained metaphors, named sources for objections) are not in any strategy file except one rule at :104
- Recommendation: Add `src/content/strategy/voice-samples.md`: 15-20 sentences/paragraphs lifted from 08-19 EN and ZH with a one-line note on the move each makes (first-hand count, cost-of-the-design paragraph, source-named objection, explained analogy), plus a banned-moves list (aphorism couplet closers, 'It is X. It is Y.' triplets, unexplained coined labels). Promote the four unpromoted rules from handoff.md:50 into blog-writing-language.md. Require blog-prose-editor to cite which sample each hook/ending edit is modeled on.

### [medium/quality/S] ZH quality regresses off the golden sample; the code-switching detector covers five words

- Evidence: blog-style-quality.ts:99-105 list = vendor, enterprise product, people layer, consulting, deployment test. greece-debt-didnt-disappear-zh.md leaves 'measurement system', 'ratio', 'proxy', 'cross-currency swaps', 'Debt/GDP' in English and opens with translation-shaped '它和家庭旅行的行程一点关系都没有'; storyCraftIssues is EN-only (:329), so ZH has no hook/payoff check at all. 08-19 ZH :49 '骑在同一条性质上' is a literal render of 'rides on the same property'.
- Recommendation: Replace the fixed list with a rule: any Latin token not in an allowlist (proper nouns, AI/API/Token/QA/prompt/workflow/context) appearing >=2 times is flagged; add ZH hook/payoff patterns; add a ZH-native reader pass to blog-prose-editor with explicit 'would a 得到/少数派 editor change this' question and require 3 rewritten sentences per pass.

### [medium/structure/S] Artifact ceremony is fixed-cost regardless of post weight; several artifacts are never read downstream

- Evidence: Cross-ref grep in 2026-08-19: research-dossier.md and memory-reflection.md cited only by handoff.md; editorial-brief.md only by scorecard+handoff; red-team/prose-polish only by scorecard. 2026-09-16 (1,290 words) carries 20 files: plan.md is 428 bytes (six headings), argument-memo.md 1.4KB, research-dossier 4 sources. workflow3-artifacts.ts bootstraps 12 empty templates unconditionally.
- Recommendation: Tier the workflow: `light` (idea, claim-ledger, article, red-team, scorecard) for <1,500-word pieces; `serious` adds dossier/memo/canon; `teardown` adds source-teardown outputs. Merge memory-reflection into canon-alignment (they overlap: both list prior posts and link candidates). Delete the unused content-plan.md from the serious path (plan.md supersedes it per SKILL.md:321).

### [medium/product/S] No editorial-desk functions: headline variants, pull-quotes, SEO title/description, post-publish correction check

- Evidence: Final title 'What I Learned From DeepSeek's Harness' chosen in-session (scorecard:65 'de-clickbaited'), no variants recorded; content-plan.md:62-66 SEO notes target the dead slug; no pull-quote or TL;DR artifact anywhere in tiles/; pricing claim C18/C31 is date-qualified and DeepSeek changed prices 08-17 — postmortem.md 'Actual 24h: pending', no scheduled re-verification of dated claims after publish; youtube-metadata.md has title options but the blog does not
- Recommendation: Add `headline-sheet.md` (5 EN + 5 ZH title variants scored for promise/specificity/curiosity, SEO title <=60 chars, meta description, 3 pull-quotes with locations) to blog-write; add a `corrections` section to postmortem.md that lists ledger rows with freshness caveats and a re-check date; blog-package-quality warns when such rows exist without a re-check entry after publish.

### [medium/quality/S] The 11-round draft loop was a brief failure, not a drafting failure; signal came only from Aaron

- Evidence: Rounds: v1-v3 = red-team + polish on market frame (06:02-07:02); v4 = Aaron's 6 directives (scorecard:67: compress caveat, cut HN framing, kill coined labels, ground skeptic); v5 = Aaron's rejection → structural pivot (07:47); v6-v10 = per-section deepening from the substrate; v11 = plain-language pass; v12 = head-recheck; v13 = panel P1-P6. Zero rounds were triggered by an automated gate; blog-write SKILL.md:133 'Do not wait for Aaron to ask for more depth' was not met.
- Recommendation: Write the depth gate as a falsifiable check on the brief: before drafting, the brief must list >=3 first-hand verified facts not present in any cited coverage and the 'concrete opening' must be one of them. For 08-19 this would have forced the 44/3 event-visibility fact into the brief on 08-15 at 04:21 instead of 07:47.

## Metrics observed

- 2026-08-19 package: 76 files; writing artifacts: claim-ledger.md 21,668 bytes (31 rows C1-C31), editorial-scorecard.md 19,812 bytes, head-recheck 13,394 bytes, handoff 6,167 bytes
- Timeline 08-15: idea 01:38 → editorial-brief 04:21 → plan 04:31 → red-team 06:02 → prose-polish 06:23 → v3 07:02 → v4 07:17 → v5 07:47 → v11 10:23 → v12 11:12 → final 08-16 01:26 (≈24h idea-to-final; ≈9h to Article Lock; 13 revisions, 5 preserved pairs in revisions/)
- Head-recheck: 22 agents, 68 checks, 56 VERIFIED / 9 MISMATCH / 3 AMBIGUOUS; 7 article corrections in both editions
- Research substrate: src/brain/reading/deepseek-harness-teardown/ = 14 notes + orange-book text, 501,577 bytes total; README claims 378 source/doc verifications
- Scanner runs today: EN deepseek-harness-teardown.md 88/100 pass (4,193 words, 180 sentences, 0 slop, 1 formulaic-contrast); ZH 100/100 (6,468 Han chars, 166 sentences); 08-26 EN/ZH 100/100 (2,507 words); 09-16 EN/ZH 100/100 (1,290 words)
- Scanner: 517 lines, 12 issue kinds, 22 slop phrases, 10 ZH mechanical phrases, 5 ZH code-switch terms; test file 348 lines / 23 tests
- Skill prose: blog-production SKILL.md 352 lines (~20 named gates), blog-write 402, blog-brainstorm 318, blog-outline 168, prose-editor 63, canon-alignment 55; editorial-system.md 98
- Artifact cross-citation in 08-19: claim-ledger cited by 10 files, plan.md by 13 (mostly video), research-dossier by 1, memory-reflection by 1, editorial-brief by 2, red-team by 1, prose-polish by 1
- Article lengths: 08-19 4,215 words (package-quality warns >2,800), 08-26 2,528, 09-02 2,264, 08-21 1,491, 09-16 1,290, 09-23 1,189, 09-30 1,233
- 'It is/This is/That is' sentence starts: 09-16 = 10, 08-26 = 6, 08-19 = 1
- Per-post artifact count: 09-16 = 20 files for 1,290 words; workflow3-artifacts.ts bootstraps 12 templates

## Open questions

- Was the v4→v5 pivot (teardown angle) something Aaron had in mind from the start, or discovered on reading v4? If the former, the brief step should capture it; if the latter, an angle-memo with evidence-density scoring is the right fix.
- Which of the four unpromoted handoff.md rules (抄→学习, explained metaphors, source-named objections, first-hand counts, fairness check) does Aaron consider universal vs specific to the DSH piece?
- Does Aaron read research-dossier.md, memory-reflection.md, argument-memo.md himself, or only the article and scorecard? If he never reads them, they are agent-to-agent scaffolding and can be merged or made machine-readable.
- Is the Greece series (09-16/09-23/09-30) meant to share the 08-19 voice, or is the shorter, more aphoristic register intentional for a non-technical reader? The gates cannot tell the difference today.
- For productization: should the judge role run on a different model/vendor than the author (true independence) or is a separately-prompted subagent on the same model acceptable?
- How much of the 14-agent teardown and 22-agent recheck cost (tokens/time) is Aaron willing to spend per post? That sets whether 'teardown' is a tier for a few posts a quarter or the default.
