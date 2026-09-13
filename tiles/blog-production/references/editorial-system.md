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
When the author describes a considered judgment, keep it as a judgment. Do not
invent discomfort, anxiety or surprise to make the opening feel personal.

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

Give a personal example space in proportion to what it proves. An unfamiliar
small project may earn one contextual sentence and a link, not recurring
technical detail throughout a broad argument. Reuse it only when the next
appearance adds a different, necessary inference. Specificity should help the
reader understand the point, not merely certify that the author has experience.

## Opinion-Led Essays: Make The Judgment Worth Reading

When the author wants to argue, advise or inspire, establish the choice they
recommend and why it matters before polishing the prose. A reasonable topic
such as "understand the business" is not yet a developed argument. Explain what
changed, which consequence follows and why the reader should change a decision.
This is a reasoning check, not a required paragraph sequence or section quota.

For a trend-driven recommendation, ask whether the same advice could have been
published before the trend. If so, explain why its priority, feasibility or
consequences have changed; otherwise narrow or cut the generic advice. Headings
should convey distinct recommendations the reader can remember and act on.

Use evidence to carry that reasoning. Preserve the consequential detail of a
source: the changed practice, constraint, tradeoff or observed result. A famous
name and a link are not enough. A hypothetical example can explain a mechanism,
but cannot establish that a trend exists. Go back to the source when a stronger
argument needs stronger evidence.

Write the author's considered judgment directly. Qualify uncertain facts and
forecasts where needed; do not weaken every recommendation with an automatic
opposite. Include objections that change its scope or the reader's decision.
Keep limits that affect meaning beside the claim; move procedural sourcing
detail to notes. Clarity must not come from hiding contrary evidence.

When a longer horizon matters, connect today's change to a plausible future
working situation and a capability worth building now. Label forecasts as the
author's inference; do not promise job outcomes or invent a five-year certainty.
The author's enthusiasm should emerge from what they value and want to make
possible. Extra adjectives, slogans and manufactured drama do not supply it.

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

1. Does the title and opening express the author's actual judgment, rather
   than merely identify the topic?
2. Do examples have enough background and support what they are used to claim?
3. Does each part develop that judgment with a reason, evidence or consequence,
   rather than restate agreeable advice?
4. Do the author's emotion, reservations and judgment survive the editing?
5. Do the title, opening and ending form a complete expression?

Name the passage, its effect on the reader, and the change needed. A genuine
problem justifies revision; there is no issue quota or mandatory rewrite.
If the argument is weak, reopen the brief and outline before a prose pass or
sibling-language adaptation. Smooth sentences and completed records do not
resolve an undeveloped viewpoint.
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

If the author rejects a draft that passed model review, preserve the original
PASS and the author's feedback as an editorial miss, then update the current
decision. A rule patch or new sample remains unproven until reviewed; do not
record the author's rejection as approval of the proposed replacement.
