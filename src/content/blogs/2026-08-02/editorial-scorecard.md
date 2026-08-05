# Editorial Scorecard

## Editorial Contract

- Reader: Experienced developers, tech leads, independent builders, and engineering/product leaders responsible for AI-generated code in real systems.
- Reader's job to be done: Decide how deeply a human must understand an AI-generated change.
- One-sentence promise: Replace the read / don't-read binary with a practical rule: review depth follows what the code is allowed to change.
- Opening: A current disagreement between Mitchell Hashimoto and Uncle Bob, followed by the two claims it exposed in the engineering community.
- Personal anchor: Aaron does not have a dramatic incident; he has a standing boundary that changes his review behavior whenever AI touches a critical system or system of record.
- Original contribution: Critical systems are defined by consequences, systems of record by authority, and rolling back code is not the same as restoring reality.
- Scope boundary: A concise operator essay, not an industry survey, safety standard, or controlled comparison of two workflows.

## Score

| Dimension | Weight | Score | Evidence in the draft | Required change |
|---|---:|---:|---|---|
| Hook earns attention and title | 10 | 8 | The first line names the current debate; Mitchell and Uncle Bob provide immediate conflict. The title gives Aaron's answer before the body deliberately earns it. | No blocker. |
| Thesis is specific, original, and arguable | 15 | 14 | Review depth follows the authority and consequences of a change, not author identity or diff size. | No required change. |
| Mechanism explains why | 15 | 13 | Local CSV versus authoritative write shows propagation; rollback is separated from restoring records, downstream copies, audit history, and prior decisions. | No required change. |
| Evidence is primary, sufficient, and honest | 15 | 12 | Mitchell's workflow, quality answer, and human-boundary post plus Uncle Bob's original thread are primary sources. Personal evidence is explicitly a standing rule, not a fabricated incident. | No blocker; the piece intentionally avoids becoming a research roundup. |
| Aaron's operator judgment is visible | 10 | 10 | Aaron states an explicit system-of-record floor and a no-release rule for authoritative writes. | No required change. |
| Counterargument changes or sharpens the claim | 10 | 8 | The article grants the strongest case for both reading and testing, then adds the shared-system-model cost of reading less. | No required change. |
| Reader leaves with a usable decision or framework | 15 | 15 | Four compact review levels route from disposable outcome checking to critical source-path understanding, followed by a concrete release gate. | No required change. |
| Structure is compressed and every section earns its place | 10 | 10 | Roughly 900 words; the sequence is debate → competing views → work challenge → Aaron's judgment → operating rule. | No required change. |

Final score: 90/100

All dimensions meet the 70% minimum.

## Approved Structural Exception

The default editorial rule asks for the explicit original judgment in the first 15%. Aaron explicitly requested a different sequence: establish the live debate, present both views, show the work problem, and only then state his position.

The active draft follows that instruction. The title gives the answer immediately; the body deliberately delays the full thesis until the work context has earned it. Independent audit found this acceptable and scored the structure 10/10.

## Revision Delta

### Added

- Direct debate-first opening.
- Mitchell's human-boundary distinction in one sentence.
- Aaron's attention-allocation challenge before his explicit thesis.
- One clear objection: less source reading can erode the team's shared system model.

### Cut

- About 60% of the English draft and 60% of the Chinese draft.
- Godot and research-roundup material from the main article.
- Three internal self-links.
- Senior / junior learning branch.
- Repeated Mitchell / Uncle Bob synthesis.
- Separate four-question diagnostic list.
- Newsletter CTA and repeated conclusion.

### Reframed

- The article now presents two competing community claims instead of declaring two exhaustive camps.
- The Review Depth Ladder is four compact rules rather than a long framework section.
- Aaron's operating boundary now arrives after the debate, exactly as requested.

### Intentionally Kept

- No invented failure story.
- Critical system / system of record distinction.
- Rollback-code versus restore-reality mechanism.
- Reading and testing as complementary, fallible evidence.
- Same-context AI blind spot.
- Four cumulative review depths and the authoritative-write release gate.
- Final green-tests / wrong-world question.

## Production Locks

- Argument Lock: **PASS**
  - Claim ledger remains valid.
  - The thesis, mechanism, evidence boundary, counterargument, and operating rule survived the compression.
- Article Lock: **PASS**
  - English and Chinese editions exist and are aligned.
  - Both style gates pass 100/100.
  - Frontmatter alignment passes.
  - Aaron approved the concise v2 on 2026-08-02; title, section order, claims, framework, and conclusion are now content-locked.
  - Formal image positions are recorded in `imgs/visual-strategy.md` and `imgs/outline.md`.
  - Aaron confirmed Direction A — Field Signal Control, Controlled Mix, and minimal two-body-image density on 2026-08-02.
  - Any later change to the article's claims, framework, or section order makes images, distribution copy, and video/audio derivatives stale.
- Package Lock: **PASS**
  - Accepted cover and two body illustrations are present in both source editions and the numbered blog-repo copies.
  - Distribution drafts are complete; no social publishing is implied by the blog release.
  - Blog package, style, and local link validators pass.
  - The blog production build passes.
  - Browser-rendered QA passes for English and Chinese at 1280px and 390px: correct H1, description, category, language routes, one cover, two loaded body images, three article sections, no horizontal overflow, and no console warning or error.
  - External blog publishing authorized by Aaron on 2026-08-02.

## Preliminary Package QA

- Serious-essay + distribution validation: **PASS**
- Distribution artifacts: complete local drafts for X, LinkedIn, Facebook, and Newsletter.
- Validator warnings: the English article is about 850 editorial words with three H2 sections, below the workflow's normal serious-essay length.
- Warning decision: **intentionally accepted**. Aaron explicitly requested a concise article with no repeated argument; independent editorial scoring remained 90/100 after compression.
- Visual validation: **PASS**. Direction A — Field Signal Control / Controlled Mix was selected; independent QA accepted the cover, thumbnail, authority-ripple illustration, and review-depth ladder.

## Gate

Pass at 85/100 or higher, with no dimension below 70% of its weight.

Decision: PASS — editorial gate, Article Lock, and Package Lock.
