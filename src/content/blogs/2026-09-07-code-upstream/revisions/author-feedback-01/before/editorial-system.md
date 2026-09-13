# Blog Production Editorial System

The shared editorial contract for brainstorm, outline, writing and review. Keep
these decisions here; focused skills own their work, not a competing rubric.
For language and endings, use `src/content/strategy/blog-writing-language.md`.

## Author Intent And Reader Promise

Keep one brief in `editorial-brief.md`:

- Author intent: a few relevant original phrases, the central attitude or change,
  and the interesting side topics that should remain peripheral.
- Reader and promise: who will care, and what makes this article worth reading.
- Form and lead language: personal response, real-work case, sourced explainer,
  or a deliberate combination. Draft first in the language that best preserves
  the author's intent; Chinese and English are sibling editions.
- Material: the scene, observation or evidence that can carry the promise;
  distinguish personal experience, public examples, inference and uncertainty.

Use what the author already provided. Ask only a missing question that would
materially change the article, such as which moment changed their expectation.
Do not replace the author's excitement, doubt or preference with a generic
productivity claim. Read only relevant current inputs; archived drafts are for
an explicit comparison, not routine context loading.

## Choose A Shape That Fits

| Form | What earns the reader's attention | Optional, not a universal requirement |
|---|---|---|
| Personal response to an interview or reading | The ideas that resonate, a meaningful connection to work or life, the author's resulting attitude | Commercial value, contrarian thesis, operating framework, personal experiment |
| Real-work case | Task context, constraints, choices, outcome, changed judgment | Measured ROI, dramatic failure, universal claim |
| Sourced launch or topic explainer | What changed, thoughtful selection, understandable examples, evidence and limits | Personally testing every feature, fixed number of points, fixed recap percentage |

Choose sections by their contribution. Explain the task before naming its
technical components. Merge sections that repeat one judgment. A source-backed
example can be concrete without being autobiographical; label hypothetical
examples and never invent a personal result. Prior posts belong only where they
help the reader understand evidence or a changed view. No forced callbacks.

## Evidence Discipline

Maintain `claim-ledger.md` for material claims: fact, inference, judgment or
personal observation; source and verification dates; authority and freshness
limits. Prefer primary sources. A vendor claim proves what was announced, not
neutral customer outcomes. Remove, qualify or narrow unsupported claims.

Hold for personal proof only when the article's claim specifically depends on
a result the author has not observed. An honest response or sourced explanation
does not require inventing or performing a personal experiment. Source and
privacy validation remain necessary where applicable.

## Editorial Review

Use `editorial-scorecard.md` as the review record; retain its filename for
existing tools, but use `Review format: evidence-v1` instead of a quality total.
The package validator checks that a decision and its basis are recorded. It
does not verify editorial taste or the truth of a self-reported PASS.

Separate mechanical checks (sources, numbers, links, privacy, bilingual claims,
asset state) from passage-linked editorial judgment:

1. Does the title and opening deliver the intended topic and author stance?
2. Do examples have enough background and support what they are used to claim?
3. Does each part add something worth continuing for?
4. Do the author's emotion, reservations and judgment survive the editing?
5. Do the title, opening and ending form a complete expression?

Name the passage, its effect on the reader, and the change needed. A genuine
problem justifies revision; there is no issue quota or mandatory rewrite.
Record `Decision: PASS` only when material blockers are resolved, with concrete
`Review evidence:` and known limits. FAIL or PENDING remain valid outcomes.
Historical numeric scorecards stay readable; never interpret their scores as
measured writing quality or silently re-score an already approved article.

The language scanner is a wording signal, not a story or quality judge. Read
flags in context. A clean scan is not a 100-quality article. Use personal-anchor
or story-craft heuristics only when relevant to the chosen form; do not distort
the article to satisfy a keyword rule.

## Three Production Locks

- **Argument Lock:** the intended contribution, evidence boundaries and section
  jobs are stable. Final prose and visual planning can proceed.
- **Article Lock:** sibling editions, title, sequence, image positions and ending
  are accepted. Final images, audio and video can proceed.
- **Package Lock:** transformed files, metadata, links, images and browser-rendered
  pages pass their checks. External publishing follows existing authorization.

Record locks with canonical file versions or hashes and caveats in the review
and `package-state.json`. Existing authorization persists; these locks do not
create a new permission request at every phase. If an upstream file changes,
invalidate only affected downstream assets. A cover-only revision should not
regenerate approved narration. Preserve audio review, account verification and
production provenance requirements.

## Learn From Actual Revisions

Classify feedback as local sentence, article lesson, reusable principle or
detectable check. Apply reusable changes in one owning file, removing conflicting
versions instead of accumulating exceptions. For a relevant recurring issue,
read one example from `references/editorial-examples.md`; do not imitate all
examples or load old articles by default.

For a substantial revision, preserve the original text and compare it with the
result alongside the author's feedback. When SkillDev is available, use
`references/skilldev-review.md` for portable snapshots and review bundles; this
must not become a dependency or a new manual chore for the author.

Historical comparisons calibrate judgment. They do not establish that newly
written rules caused an old improvement. Test a workflow hypothesis on a fresh
topic with matched materials and model settings; record confounders, preference,
reasons and uncertainty. Model review assists; it does not replace author choice.
CTR, retention and subscriptions are separate post-publication observations.
