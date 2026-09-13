# SkillDev × Blog Production · Iteration 1

2026-09-07 · Implemented and locally verified

This iteration turns the earlier review into a usable revision loop. Blog skills
now share a form-sensitive editorial contract; SkillDev captures and compares the
actual files and author feedback used to inspect a revision.

## Use it

[Open SkillDev Editorial review](http://127.0.0.1:5178/?view=editorial).

The local dataset contains five comparisons: DHH author intent; Astra background;
Astra writing experience; Astra ending; and this iteration's skill changes.
Historical cases open at the relevant passage. Toggle full text/changed paragraphs,
inspect supplied rule files, choose a preference and export the review JSON.
The exported file can be re-imported and read directly by an agent.

Canonical local review location and ID are in [latest.json](./latest.json).
The author does not need to prepare the files manually: the workflow guide gives
the agent capture/pack steps for substantial revisions. Small edits can continue
without SkillDev. This is not an automatic recorder of every Codex tool call.

## Blog skill changes

- Author intent, reader promise, article form and lead language belong in one brief.
- Personal responses, cases and explainers can use different structures; no universal
  framework, contrarian thesis, personal experiment or commercial-value requirement.
- Examples establish task context before introducing component names.
- Endings can synthesize the experience, acknowledge costs and retain real emotion.
- Four grounded before/after examples calibrate recurring editorial problems.
- Passage-linked review replaces numeric quality totals for new work. The package
  validator supports `evidence-v1` and preserves legacy scorecard compatibility.
- Actual package state drives routing; failed upstream review precedes distribution,
  and archives are read only for an explicit comparison.
- Source/privacy checks, sibling-language consistency, audio acceptance, asset
  invalidation and production-release rules remain in place.

Skills and templates were updated together and synchronized across agent surfaces.
The source patch contains only changes made in this iteration, relative to the
preserved pre-edit working files: [skill-changes.patch](./skill-changes.patch).
The Studio checkout already contained earlier work, so it has not been bundled into
an unrelated commit. Canonical article files checked against the audit snapshot are unchanged.

## SkillDev capabilities delivered

- `review-snapshot`: immutable named-file capture, unique IDs, capture times and SHA-256 hashes.
- `review-pack`: portable review JSON combining snapshots, feedback, checks and decisions.
- Source-root containment, size/text checks, overwrite refusal and integrity validation.
- Editorial review UI with focused passages, paragraph differences, rule comparisons,
  preference/reason recording, export and re-import.
- Distinct provenance for historical revisions, controlled comparisons and skill changes.
- Local review data is gitignored and removed from shareable static builds.
- Correct section-scoped rubric matching, including peer/ancestor boundaries,
  heading formatting, CRLF and fenced-code heading cases.
- The bundled synthetic adapter comparison is labeled as an example in the UI.

SkillDev is committed locally at `b085768` on `codex/editorial-review-iteration`.
No push, merge or deployment was performed.

## Validation

- SkillDev: 14 tests passed, 1 existing lighthouse check skipped; typecheck and build passed.
- Schemas: 10 schemas and 18 example/generated records validated.
- Blog package/bootstrap: 11 tests passed; all workflow validations passed.
- Five modified skill entrypoints passed the skill validator; skill sync passed.
- The original cross-section false positive now correctly fails, with controls preserved.
- CLI capture and pack succeeded; attempted snapshot overwrite was rejected without changing the original.
- Browser round-trip retained a test review reason, view switching retained unsaved state,
  and tampered content was rejected without losing the prior review. Original data was restored.

Evidence: [verification.json](./verification.json), [CLI checks](./qa/cli-verification.json),
[evaluator before/after](./qa/evaluator-after.json). QA exports are marked automated
verification and are separate from author judgments in the canonical dataset.

## What remains to learn

This proves that the recording, comparison and validation mechanisms work locally.
It does not prove that the new rules improve future writing. The historical articles
were accepted before this iteration; their improvement cannot be attributed to it.

For the next fresh topic, preserve the initial brief and a pre-revision draft,
record the author's actual feedback, and compare the resulting version. For an
explicit skill A/B experiment, keep inputs/model settings comparable and record
confounders. Ask whether the tool helped find a real issue or make a better decision
without adding a material recording burden. Continue product development only if
those benefits appear in real use.

Full runtime event capture, interruption recovery and cross-provider execution remain
outside this iteration. Unknown historical context, time and cost stay unknown.
