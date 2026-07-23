---
name: pattern-atlas
description: "Create, refine, or publish Aaron Studio Pattern Atlas entries across technology, finance, economics, science, psychology, history, philosophy, and everyday life. Produces durable Markdown explanations, named pattern and concept-neighbor maps, vivid interactive pages, and public-safe bilingual Blog Learn packages. Use when Aaron asks to add, capture, analyze, accumulate, explain visually, or publish a concept, term, pattern, or mental model, or requests a rich page like the Optimistic Concurrency explainer. Also use whenever `$pattern-atlas` or the legacy `$concept-garden` is invoked with a concept name."
---

# Pattern Atlas

Turn an idea from any domain into a connected mental model that remains useful after the definition is forgotten.

## Paths and source of truth

- Work from the Aaron Studio repository root.
- Read `config/aaron-studio.json`; resolve the brain root from `brainRoot` rather than hard-coding a user path.
- Store entries in `<brainRoot>/concepts/`.
- Treat each concept's Markdown file as the semantic source of truth.
- Store visual explainers in `<brainRoot>/concepts/pages/`.
- Use `<brainRoot>/concepts/index.html` as the visual catalog and `<brainRoot>/concepts/README.md` as the text index.
- Stage public-safe bilingual derivatives in `<contentRoot>/concepts/<slug>/`; never publish directly from private brain files.
- Store the concept's durable share asset at `<contentRoot>/concepts/<slug>/social/card-4x5.jpg` and its manual distribution copy at `social/linkedin-manual.md`.
- Read `<brainRoot>/concepts/_template.md` before creating a new Markdown entry.
- For a visual page, read [references/visual-system.md](references/visual-system.md) completely and inspect `<brainRoot>/concepts/pages/optimistic-concurrency.html` as the canonical quality reference.
- For domain-specific evidence standards, read [references/domain-evidence.md](references/domain-evidence.md).
- For a blog derivative or publication request, read [references/blog-publishing.md](references/blog-publishing.md) completely.

Keep `src/brain/` local and private. Do not send private brain content to external services. Public-source research about the concept is allowed.

## Non-negotiable content rules

1. Expand every acronym at first meaningful use in both Markdown and HTML: `MVCC (Multi-Version Concurrency Control, 多版本并发控制)`. Repeat the expansion in a standalone card when readers can land there without seeing the earlier occurrence.
2. Name the relationship between neighbors. Depending on the domain, distinguish strategy, mechanism, model, protocol, indicator, instrument, theory, effect, evidence, analogy, and application. Do not present adjacent terms as synonyms.
3. Explain the problem before the textbook definition.
4. Include one plain-language analogy and one concrete technical example.
5. State where the concept works well, where it degrades, and what failure looks like.
6. Define conflict, retry, error, or recovery behavior when the concept has one. Do not hide the unhappy path.
7. Prefer primary sources appropriate to the domain: standards and official documentation; regulators and audited filings; original papers and systematic reviews; archival or institutional sources. Link them in `Further reading`.
8. Never invent a citation or claim that a source says more than it does.
9. For finance, health, law, or other high-stakes domains, label educational explanation versus personal advice, date-sensitive fact versus durable mechanism, and evidence versus interpretation.
10. Keep Pattern Atlas concept-first and context-neutral by default. Never name Aaron's employer, clients, internal projects, or distinctive professional context—including Mawer—in a title, example, citation, metadata field, visual label, or publication package unless Aaron explicitly asks for that organization to appear in the finished entry. When work motivates a question, generalize it to durable field-level language such as `long-term financial planning` or `company valuation`; do not preserve a combination of labels that can reconstruct an identifiable internal context.

## Workflow

### 1. Frame the concept

- Identify the one durable question the concept answers in Aaron's life or judgment, phrased without employer, client, or internal-project context unless the user explicitly requests it.
- Write a one-sentence mental model in ordinary Chinese while retaining the English term.
- Select 3–8 concept neighbors that expose boundaries or dependencies.
- Decide the maturity: `seedling`, `growing`, or `evergreen`.
- Ask only when the term is genuinely ambiguous; otherwise proceed with the most standard technical meaning and name the assumption.

### 2. Research the boundaries

- Read the matching section of [references/domain-evidence.md](references/domain-evidence.md).
- Search primary sources when the concept is niche, implementation-sensitive, high-stakes, disputed, or likely to have changed.
- Verify names, mechanisms, formulas, protocol behavior, guarantees, limitations, and trade-offs as applicable.
- Separate strict examples from analogies. Label analogies such as Git when they are not literal implementations.

### 3. Write the Markdown source

Start from `<brainRoot>/concepts/_template.md` and include:

1. One-sentence definition
2. Problem / failure without it
3. Everyday analogy
4. Step-by-step mechanism
5. Concrete implementation, calculation, historical case, experiment, or lived example
6. Suitable and unsuitable conditions
7. Related-concept map with explicit distinctions
8. Common misconceptions
9. Minimal memory card
10. Self-test questions
11. Primary-source further reading

Use frontmatter `type: concept`, bilingual aliases, domains, tags, maturity, and future wikilinks for related concepts. Keep the private entry comprehensive; do not prematurely flatten it into public copy.

### 4. Build the visual explainer

Build a visual page by default when the user requests the established format, invokes `$pattern-atlas`, or the concept benefits from state, comparison, sequence, hierarchy, or a relationship map. Skip it only when the user explicitly wants a quick text entry.

- Make the page self-contained HTML/CSS/JavaScript with no build step or external dependency.
- Design the first viewport around the concept, not generic navigation.
- Use a concept-specific interaction: simulator for state transitions, toggle for comparisons, timeline for history or lifecycle, map for relationships, calculator for a meaningful formula, evidence ladder for confidence, or scenario cards for judgment.
- Include keyboard-accessible controls, `aria-live` for changing explanations, responsive layouts, and reduced-motion handling.
- Preserve the Pattern Atlas family resemblance without cloning the exact same composition for every topic.
- Do not use decorative model-authored SVG. Prefer typography, CSS geometry, and layout.
- Keep full names visible inside acronym cards; never rely on a footnote alone.

### 5. Connect the atlas

- Add or update the concept row in `<brainRoot>/concepts/README.md`.
- Add a catalog card in `<brainRoot>/concepts/index.html` when a visual page exists.
- Upgrade plain-text neighbors to local links when their entries exist.
- Update an existing entry rather than creating a duplicate alias.

### 6. Validate

- Run `git diff --check` on touched files.
- Confirm local HTML links and in-page anchors resolve.
- Compile inline JavaScript with Node's `new Function(...)` or equivalent syntax validation.
- Search the finished entry for unexplained all-caps acronyms.
- Confirm Markdown and HTML agree on the definition, terminology, and trade-offs.
- Do not alter or clean unrelated worktree changes.

### 7. Handoff

Return clickable absolute links to the visual catalog, visual explainer, Markdown source, and template when relevant. Summarize the mental model and named concept neighbors in a few lines.

## Public Blog Learn workflow

Pattern Atlas is the private authoring source; Blog Learn is a deliberate public derivative.

When Aaron requests a blog-ready or published concept:

1. Read [references/blog-publishing.md](references/blog-publishing.md).
2. Create `<contentRoot>/concepts/<slug>/en.md`, `zh.md`, `visual.vue`, and `manifest.json`.
3. Remove private context, personal identifiers, speculative claims, and unpublished project details.
4. Design a concept-specific `social/card-4x5.jpg` natively at 1080×1350. Use the card-mode routing in [references/blog-publishing.md](references/blog-publishing.md): default to a content-first editorial explainer; use tactile or paper-sculpture metaphor only when the physical analogy teaches the mechanism; use a high-impact campaign poster only when Aaron explicitly requests promotion or a campaign. Use standard horizontal padding of 72–88 px by default, English-first phone-readable typography, restrained color, and one visual device that teaches the concept. Before composing the card, resolve the active website mark from `<blogRepo>/components/main/header.vue` and the public asset it references; the live blog component is the source of truth, not an asset filename, a previous screenshot, or a file labelled `final`. Use an Aaron Studio mirror only after its SHA-256 hash matches that public asset. Preserve the mark's own tile and background treatment instead of inventing a black or colored container around it. Do not contain-fit a narrower portrait source into the 4:5 canvas, because the resulting side gutters shrink the title and explanation on phones. Use wider padding only when the concept-specific composition clearly benefits from it. Keep a family resemblance across the series, but do not force every concept into the same layout, timeline, or illustration style.
5. Add `cardImage` and localized `cardImageAlt` to both public Markdown files. Treat the original JPEG as the durable download/share asset; let the blog render responsive WebP derivatives for the Learn index and detail page.
6. Create `social/linkedin-manual.md` with concise post copy, accessible image alt text, the canonical Learn URL, and the campaign link defined by the manifest. The image is the visual hook; the post text should invite the click rather than repeat the whole article.
7. Run `node tiles/pattern-atlas/scripts/publish-to-blog.mjs --slug <slug> --dry-run`.
8. Run the publisher without `--dry-run`, then run it with `--check`. The sync must publish the bilingual content, interactive component, manifest metadata, and available card/OG assets together.
9. Validate targeted tests, the production build, and the English and Chinese routes. Browser QA the Learn index and concept detail in light/dark modes and at desktop/mobile widths; check image loading, localized alt text, language switching, overflow, and console errors.
10. Keep content publication and social distribution as separate states. A concept may be live in the Learn library before it enters the social cadence; record distribution status in the manifest instead of coupling it to the blog release.
11. Stop before commit or push unless Aaron explicitly authorizes the release. When authorized, commit only the intended concept and site files to `main`, push `main`, and verify that production was created by that Git revision and that the real domain serves it. Never use a local production deploy, promotion, or alias swap.

The reusable delivery chain is:

`private concept → public bilingual package → interactive Learn page → 4:5 visual memory card → responsive website integration → scheduled/manual social distribution`

Do not consider a published Pattern Atlas entry complete when the card only exists in a social folder. The same visual memory card should appear compactly in the Learn catalog, at useful reading size on the detail page, and as an original-file download for manual sharing.

## Example invocations

- `$pattern-atlas 帮我加入 Event Sourcing。`
- `$pattern-atlas What is a vector clock? Make it visual.`
- `$pattern-atlas 帮我理解复利、实际收益率和 sequence-of-returns risk，并准备发布到 Learn。`
- `$pattern-atlas 把 opportunity cost 做成一个能映射到工作和生活选择的互动页面。`
- `把 Backpressure 加到 Pattern Atlas，并解释它和 rate limiting 的区别。`
- `完善 Optimistic Concurrency 页面，把所有缩写补全。`
