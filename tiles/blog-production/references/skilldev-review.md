# Review A Real Revision With SkillDev

Use this only for a substantial skill/draft revision or an explicit comparison.
The author should not have to duplicate their feedback or maintain another form.
If SkillDev is unavailable, preserve the normal versioned draft and review notes
and continue. It is not a publishing dependency.

Resolve `skillDevRepo` from `config/aaron-studio.json` relative to the Studio root.
Build its CLI with `npm run build:packages` in that checkout if needed. The CLI
entrypoint is `packages/cli/dist/cli.js` under the resolved checkout.

## Before A Revision

Use `review-snapshot <artifact>` with `--root <studio-root>`, a new `--out` JSON
path under the article's revision directory, and a meaningful `--label`.
Supply repeated `--context <file>` arguments for the actual rule files being
compared. Model identity is optional; use `--model` only when known.

Snapshots contain the named text files and hashes. They refuse overwrites.
They record capture time, not execution time, and do not claim the supplied
rules were all loaded by the runtime. Do not include credentials or irrelevant
private context. Do not fabricate historical rule versions after the fact.

## After A Revision

Capture the changed version, then prepare the small review spec described in
SkillDev's `docs/editorial-review.md`. Reuse the author's existing feedback,
clearly labeling quotation versus paraphrase and its source. Keep editorial
preference separate from automated checks. Use `historical-revision` for old
drafts, `skill-change` for rule changes and `controlled-comparison` only for a
real matched-input experiment with its limitations recorded.

Run `review-pack <spec.json> --root <studio-root> --out <new-review.json>`.
Import the resulting file in SkillDev's Editorial review view, or place it in
the checkout's gitignored `apps/web/public/editorial-local/review.json` for the
local viewer. No model call or publication occurs during capture or packing.

The user can select before/after/tie/uncertain, add a reason and export the
reviewed JSON. An exported author judgment can inform a later skill correction;
the interface itself does not rewrite skills or mark a hypothesis proven.

For prospective evidence, use a fresh topic and matched input/model settings.
Historical accepted articles demonstrate what the author preferred then, not
that today's updated skill produced them. Unknown timing, costs and execution
paths stay unknown.
