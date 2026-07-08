# Blog Illustration Workflow 2.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Phase 1 of Blog Illustration Workflow 2.0: a judgment-first visual workflow with Aaron visual modes, strategy artifacts, critique gates, and FDE regression notes.

**Architecture:** Keep `tiles/blog-illustrate/SKILL.md` as the workflow orchestrator, add `src/content/strategy/blog-visual-system.md` as the operational visual system, and add reusable artifact templates under `tiles/blog-illustrate/templates/`. The implementation is manual-first: instructions, templates, and tests before automation or image-stock integration.

**Tech Stack:** Markdown skills/templates, Bun tests using `bun:test`, existing Aaron Studio file conventions, existing `scripts/sync-agent-skills.sh` for skill propagation.

---

## File Structure

Create:

- `src/content/strategy/blog-visual-system.md` — operational visual system with five modes, pacing rules, quality gates, and FDE regression lessons.
- `tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts` — workflow contract tests for the visual system, templates, and skill instructions.
- `tiles/blog-illustrate/templates/visual-strategy.md` — per-post visual strategy template.
- `tiles/blog-illustrate/templates/mode-mix.md` — per-post image role/mode/weight template.
- `tiles/blog-illustrate/templates/visual-critique.md` — accepted/rejected/regenerate review template.
- `tiles/blog-illustrate/templates/visual-postmortem.md` — learning and memory template.
- `src/content/blogs/2026-07-06/imgs/visual-critique.md` — FDE regression critique using existing generated images.
- `src/content/blogs/2026-07-06/imgs/visual-postmortem.md` — FDE visual lessons to feed future work.

Modify:

- `src/content/strategy/visual-language.md` — clarify that it is brand-level and delegates article-level orchestration to `blog-visual-system.md`.
- `tiles/blog-illustrate/SKILL.md` — require visual strategy, mode mix, outline v2 fields, prompt pack fields, critique, postmortem, and optional image-stock Phase 2 notes.
- `scripts/sync-agent-skills.sh` output files, if the script updates checked-in skill mirrors. Inspect `git status` after running it and only commit relevant generated skill sync changes.

Do not modify:

- `/Users/aaronguo/Work/lab/images-stock` in Phase 1.
- Existing image PNG/WebP files.
- Unrelated working-tree changes such as `src/brain/logs/cf/2026-07-cf.md`.

---

### Task 1: Add Failing Workflow Contract Tests

**Files:**
- Create: `tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts`

- [ ] **Step 1: Create the test file**

Create `tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts` with this content:

```ts
import { existsSync, readFileSync } from "fs";
import { describe, expect, test } from "bun:test";

const visualSystemPath = "src/content/strategy/blog-visual-system.md";
const skillPath = "tiles/blog-illustrate/SKILL.md";

function read(path: string): string {
  return readFileSync(path, "utf-8");
}

describe("blog illustration workflow 2.0", () => {
  test("documents Aaron visual modes and pacing rules", () => {
    expect(existsSync(visualSystemPath)).toBe(true);

    const visualSystem = read(visualSystemPath);

    expect(visualSystem).toContain("Style is pacing, not skin");
    expect(visualSystem).toContain("Editorial Minimal");
    expect(visualSystem).toContain("Human-Scale Metaphor");
    expect(visualSystem).toContain("Operator Diagram");
    expect(visualSystem).toContain("Real Photo Collage");
    expect(visualSystem).toContain("Glass / Fluent Artifact");
    expect(visualSystem).toContain("FDE regression lessons");
    expect(visualSystem).toContain("one visual predicate");
  });

  test("provides templates for every new visual artifact", () => {
    const templatePaths = [
      "tiles/blog-illustrate/templates/visual-strategy.md",
      "tiles/blog-illustrate/templates/mode-mix.md",
      "tiles/blog-illustrate/templates/visual-critique.md",
      "tiles/blog-illustrate/templates/visual-postmortem.md",
    ];

    for (const path of templatePaths) {
      expect(existsSync(path)).toBe(true);
      expect(read(path).length).toBeGreaterThan(300);
    }

    expect(read("tiles/blog-illustrate/templates/visual-strategy.md")).toContain("## Recommended Mode Mix");
    expect(read("tiles/blog-illustrate/templates/mode-mix.md")).toContain("Visual weight");
    expect(read("tiles/blog-illustrate/templates/visual-critique.md")).toContain("## Regeneration Requests");
    expect(read("tiles/blog-illustrate/templates/visual-postmortem.md")).toContain("## Anti-Patterns To Add To Global System");
  });

  test("requires the visual strategy workflow in blog-illustrate skill", () => {
    const skill = read(skillPath);

    expect(skill).toContain("src/content/strategy/blog-visual-system.md");
    expect(skill).toContain("visual-strategy.md");
    expect(skill).toContain("mode-mix.md");
    expect(skill).toContain("visual-critique.md");
    expect(skill).toContain("visual-postmortem.md");
    expect(skill).toContain("Visual predicate");
    expect(skill).toContain("visual weight");
    expect(skill).toContain("Style is pacing, not skin");
  });

  test("keeps images-stock integration optional in phase 1", () => {
    const skill = read(skillPath);
    const visualSystem = read(visualSystemPath);

    expect(skill).toContain("Phase 2");
    expect(skill).toContain("image stock");
    expect(skill).toContain("optional");
    expect(visualSystem).toContain("/Users/aaronguo/Work/lab/images-stock");
    expect(visualSystem).toContain("blog illustration should still run with local artifacts");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npx -y bun test tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts
```

Expected: FAIL because `src/content/strategy/blog-visual-system.md` and the templates do not exist yet, and `blog-illustrate` does not contain the new workflow terms.

- [ ] **Step 3: Commit the failing test**

```bash
git add tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts
git commit -m "test: add blog illustration workflow contract"
```

---

### Task 2: Add The Global Blog Visual System

**Files:**
- Create: `src/content/strategy/blog-visual-system.md`
- Modify: `src/content/strategy/visual-language.md`
- Test: `tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts`

- [ ] **Step 1: Create `blog-visual-system.md`**

Create `src/content/strategy/blog-visual-system.md` with this content:

```md
# Aaron Blog Visual System

## Purpose

This is the operational visual system for Aaron's blog illustrations. It decides how a specific article should combine visual modes, visual weight, image roles, and critique gates.

Use `src/content/strategy/visual-language.md` for the brand-level visual language. Use this file for article-level orchestration.

## Core Principle

Style is pacing, not skin.

A blog post should not apply one treatment to every image. Choose the visual mode by article character, image role, and visual weight.

## Visual Modes

### Editorial Minimal

Use for covers, thesis moments, section breaks, and high-conflict opinion posts.

Traits:

- one strong metaphor;
- generous negative space;
- low element count;
- crisp composition;
- minimal diagramming.

Visual weight: medium to loud.

Avoid:

- consulting-slide composition;
- too many icons;
- weak generic office symbolism;
- concept collage.

Prompt grammar:

```text
A high-end editorial image built around one strong metaphor.
Use generous negative space, a restrained palette, and no more than three major visual elements.
The image should imply the thesis without explaining the whole argument.
Avoid diagrams, dashboards, fake UI, text labels, and decorative clutter.
```

### Human-Scale Metaphor

Use for body images, personal workflow examples, reflective sections, and reading relief after dense argument.

Traits:

- people, desks, rooms, roads, windows, books, lamps, notebooks, paper, light, and ordinary objects;
- AI as a quiet secondary layer;
- warm but not beige-only;
- metaphor before interface.

Visual weight: quiet to medium.

Avoid:

- every image becoming a workflow map;
- glowing AI dashboards;
- fake business people smiling at screens;
- heavy liquid glass over realistic photography.

Prompt grammar:

```text
A human-scale editorial scene built around one ordinary anchor.
The AI/system layer appears only as one subtle motif, secondary to the human scene.
Keep the composition calm, readable, and warm, with enough negative space.
Avoid dashboards, dense UI, fake text, extra symbolic objects, and heavy glowing glass.
```

### Operator Diagram

Use for frameworks, comparisons, operating models, and concise process diagrams.

Traits:

- low-density product or strategy artifact;
- strong hierarchy;
- large shapes;
- few labels or no labels;
- one visual predicate;
- readable at mobile size.

Visual weight: medium.

Avoid:

- five cards full of small symbols;
- chart walls;
- nested flows;
- fake UI labels;
- hand-drawn diagrams with too many sketch marks.

Prompt grammar:

```text
A clean operator-grade diagram for the framework or mechanism.
Use large simple shapes, strong spacing, and one visual predicate.
Each major element should be readable at thumbnail size.
Avoid tiny icons, dense arrows, fake text, decorative backgrounds, and chart-wall energy.
```

### Real Photo Collage

Use when a topic needs business reality, place, object texture, or less AI-illustration sameness.

Traits:

- realistic or photo-collage base;
- restrained graphic overlay;
- documentary or editorial atmosphere;
- real objects, rooms, and materials.

Visual weight: medium to loud for covers; quiet to medium for body.

Avoid:

- generic stock-photo meetings;
- staged corporate smiles;
- random city skylines;
- heavy neon annotation layers.

Prompt grammar:

```text
A grounded editorial photo-collage scene built around one real-world anchor.
Use realistic materials and restrained composition, with only one subtle graphic overlay.
Avoid generic stock meetings, staged smiles, heavy glass overlays, logos, fake text, and sci-fi lighting.
```

### Glass / Fluent Artifact

Use as a high-emphasis material mode for product artifacts, framework cards, clean interface moments, thumbnails, and invisible infrastructure.

Traits:

- translucent panels;
- soft depth;
- Fluent-like spacing and hierarchy;
- limited cyan, amber, and green accents;
- material detail as emphasis, not wallpaper.

Visual weight: medium to loud.

Avoid:

- every image using glass ribbons;
- heavy glass pasted over realistic photos;
- glowing route lines everywhere;
- sci-fi HUDs.

Prompt grammar:

```text
A premium product-artifact image using restrained glass and Fluent-like hierarchy.
Use glass only for the specific artifact or layer, not the whole scene.
Keep the scene simple, with clear spacing, soft depth, and no more than two accent colors.
Avoid neon HUDs, excessive glow, dense panels, and full-scene glass treatment.
```

## Two-Layer Selection

First classify the article character:

| Article character | Default mode mix |
|---|---|
| Personal AI workflow essay | Human-Scale Metaphor + Editorial Minimal + one Operator Diagram |
| Enterprise / market argument | Editorial Minimal + Real Photo Collage + Operator Diagram |
| Technical framework / know-how | Operator Diagram + Human-Scale Metaphor + limited Glass Artifact |
| Reflective essay | Human-Scale Metaphor + Editorial Minimal |
| Product/tool/process post | Glass / Fluent Artifact + Operator Diagram + Human-Scale Metaphor |

Then assign image role:

| Image role | Default mode | Visual weight |
|---|---|---|
| Cover | Editorial Minimal or Real Photo Collage | loud |
| Thumbnail | Editorial Minimal + typography, sometimes Glass Artifact | loud |
| Body narrative | Human-Scale Metaphor | quiet or medium |
| Framework | Operator Diagram, optionally 10-20% Glass Artifact | medium |
| Comparison | Operator Diagram or Editorial Minimal | medium |
| Closing image | Human-Scale Metaphor or Editorial Minimal | quiet to medium |

## Quality Gates

Set-level gates:

- A set with three or more body images must include at least one quiet image.
- No more than one or two images should carry loud visual weight.
- A normal post should have no more than one dense mechanism diagram.
- If more than half the images use glass, glow, or route-line effects, the set fails style pacing.
- If more than half the images are diagrams, the set fails editorial rhythm unless the post is explicitly a tutorial or reference guide.

Image-level gates:

- one visual predicate;
- planned visual mode;
- planned visual weight;
- no fake readable text unless the image is an approved thumbnail;
- no generic stock-photo energy;
- no irrelevant symbolic clutter;
- readable at mobile width.

## FDE regression lessons

Use the 2026-07-06 FDE image set as a regression case.

- `01-scene-platforms-converge` failed because it explained too much through roads, landscape, platform symbols, desk objects, workflow map, and gates.
- `03-comparison-fde-center-of-gravity` failed because it compressed consulting comparison, embedded work, transfer artifacts, and workflow diagram into one image.
- `04-framework-actor-loop` failed because every tile contained multiple symbols, so ACTOR became noisy instead of memorable.
- `02-metaphor-demo-to-operating-loop` was closer to successful, but it shows how glowing route/glass language can become a repeated trope if used too often.

## Images Stock Phase 2

Future integration target:

```text
/Users/aaronguo/Work/lab/images-stock
```

Phase 2 can use image stock as a reference library, reuse library, quality memory, and style profile store.

Potential future operations:

- `blog:image:search-stock`
- `blog:image:import-stock`
- `blog:image:publish-to-stock`

This integration is optional. Blog illustration should still run with local artifacts when image stock is unavailable.
```

- [ ] **Step 2: Update `visual-language.md`**

Add this paragraph near the top of `src/content/strategy/visual-language.md`, after the `## Purpose` section:

```md
## Relationship To Blog Visual System

This file defines Aaron's brand-level visual language. For article-level decisions such as visual mode, visual weight, image role, visual predicate, critique gates, and style pacing, use `src/content/strategy/blog-visual-system.md`.
```

- [ ] **Step 3: Run the contract test**

Run:

```bash
npx -y bun test tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts
```

Expected: still FAIL because templates and skill updates are not implemented yet.

- [ ] **Step 4: Commit the visual system**

```bash
git add src/content/strategy/blog-visual-system.md src/content/strategy/visual-language.md
git commit -m "docs: add blog visual system"
```

---

### Task 3: Add Visual Artifact Templates

**Files:**
- Create: `tiles/blog-illustrate/templates/visual-strategy.md`
- Create: `tiles/blog-illustrate/templates/mode-mix.md`
- Create: `tiles/blog-illustrate/templates/visual-critique.md`
- Create: `tiles/blog-illustrate/templates/visual-postmortem.md`
- Test: `tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts`

- [ ] **Step 1: Create `visual-strategy.md` template**

Create `tiles/blog-illustrate/templates/visual-strategy.md`:

```md
# Visual Strategy

## Article Character

Classify the post as one primary article character:

- Personal AI workflow essay
- Enterprise / market argument
- Technical framework / know-how
- Reflective essay
- Product/tool/process post

## Reader Emotion

Name what the reader should feel while moving through the image set.

## Visual Risk

List the specific risks for this post, such as clutter, heavy glass, generic AI texture, stock-photo energy, too many diagrams, or weak cover tension.

## Recommended Mode Mix

State the planned mix of Aaron visual modes:

- Editorial Minimal
- Human-Scale Metaphor
- Operator Diagram
- Real Photo Collage
- Glass / Fluent Artifact

## Cover Direction

Describe the cover as a scroll-stopping visual idea, not a full explanation of the article.

## Body Image Direction

Describe how body images should support reading rhythm.

## Framework / Diagram Direction

Describe how diagrams should stay clean, useful, and low-clutter.

## What To Avoid

Write concrete anti-patterns for this post.
```

- [ ] **Step 2: Create `mode-mix.md` template**

Create `tiles/blog-illustrate/templates/mode-mix.md`:

```md
# Mode Mix

## Set-Level Pacing

State how the image set balances quiet, medium, and loud images.

## Image Plan

| Image | Role | Visual mode | Visual weight | Reason | Reuse candidate? |
|---|---|---|---|---|---|
| 00-cover | Cover | Editorial Minimal | loud | The cover needs a strong scroll-stopping thesis image. | no |
| 00-cover-thumbnail | Thumbnail | Editorial Minimal + typography | loud | The thumbnail needs readable distribution text. | no |

## Density Budget

List the intended count of narrative/metaphor images, light diagrams, and dense mechanism diagrams.

## Style Fatigue Guardrail

State how many images may use Glass / Fluent Artifact or glowing route-line effects.
```

- [ ] **Step 3: Create `visual-critique.md` template**

Create `tiles/blog-illustrate/templates/visual-critique.md`:

```md
# Visual Critique

## Set-Level Review

Review whether the image set has the right pacing, mode mix, and visual weight.

## Accepted Images

For each accepted image, explain why it matches its role, visual mode, visual weight, and one visual predicate.

## Rejected Images

For each rejected image, name the exact failure: clutter, heavy glass, dirty texture, generic AI texture, stock-photo energy, role mismatch, repeated metaphor, unreadable text, or excessive diagramming.

## Regeneration Requests

Write concrete regeneration instructions. Each request must include the rejection reason and the new constraint.

## Style Fatigue Notes

State whether the set overuses glass, route lines, dashboards, diagrams, or any other repeated device.

## Stock / Memory Candidates

List images that should later be sent to image stock as accepted references or rejected negative examples.
```

- [ ] **Step 4: Create `visual-postmortem.md` template**

Create `tiles/blog-illustrate/templates/visual-postmortem.md`:

```md
# Visual Postmortem

## What Worked

List the strongest images and why they worked.

## What Failed

List weak images and the reason each failed.

## Reusable Patterns

Capture prompt patterns, mode mixes, or compositions worth reusing.

## Anti-Patterns To Add To Global System

Capture mistakes that should become future workflow warnings.

## Images Stock Candidates

List accepted images, rejected images, and style references that should be considered for image stock Phase 2.

## Next Article Guidance

Write one to three concrete visual lessons for the next blog post.
```

- [ ] **Step 5: Run the contract test**

Run:

```bash
npx -y bun test tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts
```

Expected: still FAIL because `tiles/blog-illustrate/SKILL.md` is not updated yet.

- [ ] **Step 6: Commit the templates**

```bash
git add tiles/blog-illustrate/templates/visual-strategy.md tiles/blog-illustrate/templates/mode-mix.md tiles/blog-illustrate/templates/visual-critique.md tiles/blog-illustrate/templates/visual-postmortem.md
git commit -m "docs: add blog illustration templates"
```

---

### Task 4: Upgrade `blog-illustrate` Skill Instructions

**Files:**
- Modify: `tiles/blog-illustrate/SKILL.md`
- Test: `tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts`

- [ ] **Step 1: Update the Output tree**

In `tiles/blog-illustrate/SKILL.md`, update the `## Output` tree so it includes:

```text
src/content/blogs/YYYY-MM-DD/imgs/
├── visual-strategy.md       ← article-level visual judgment
├── mode-mix.md              ← per-image visual mode and weight plan
├── style.md                 ← post-specific visual direction
├── outline.md               ← image outline with visual predicates
├── visual-critique.md       ← accepted/rejected/regenerate decisions
├── visual-postmortem.md     ← reusable visual lessons
├── prompts/
│   └── NN-{slug}.md
```

Keep the existing PNG and `web/` entries.

- [ ] **Step 2: Update the Quality Standard**

Add this text under `## Quality Standard`:

```md
Blog Illustration 2.0 is judgment-first, not prompt-first. Before writing image prompts, load `src/content/strategy/blog-visual-system.md`, create `visual-strategy.md`, and create `mode-mix.md`.

Core rule: Style is pacing, not skin. Do not apply one visual treatment to every image. Choose visual modes by article character, image role, and visual weight.

Every body image needs one visual predicate: the single action or relation the image is allowed to show. If an image needs two predicates, split it or simplify it.
```

- [ ] **Step 3: Update the Workflow checklist**

Replace the existing workflow checklist with:

```text
- [ ] Step 1: Load preferences, visual language, and blog visual system
- [ ] Step 2: Detect article and analyze content
- [ ] Step 3: Create visual-strategy.md
- [ ] Step 4: Create mode-mix.md
- [ ] Step 5: Define post-specific visual direction in style.md
- [ ] Step 6: Generate outline.md with visual mode, visual weight, and visual predicate
- [ ] Step 7: Write prompt pack
- [ ] Step 8: Generate candidates
- [ ] Step 9: Write visual-critique.md and regenerate failed images
- [ ] Step 10: Compress to WebP
- [ ] Step 11: Insert accepted images into blog
- [ ] Step 12: Write visual-postmortem.md
```

- [ ] **Step 4: Update Step 1 loading instructions**

In Step 1, after loading `src/content/strategy/visual-language.md`, add:

```md
**Load Aaron blog visual system:**

```bash
test -f src/content/strategy/blog-visual-system.md && cat src/content/strategy/blog-visual-system.md
```

This file is mandatory for Blog Illustration 2.0. If it is missing, create or restore it before generating image prompts.
```

- [ ] **Step 5: Add Visual Strategy and Mode Mix steps**

Insert new sections before the current style brief step:

```md
### Step 3: Create Visual Strategy

Create `src/content/blogs/YYYY-MM-DD/imgs/visual-strategy.md` from `tiles/blog-illustrate/templates/visual-strategy.md`.

The strategy must classify article character, reader emotion, visual risk, recommended mode mix, cover direction, body image direction, framework/diagram direction, and what to avoid.

Do not write image prompts before this file exists.

### Step 4: Create Mode Mix

Create `src/content/blogs/YYYY-MM-DD/imgs/mode-mix.md` from `tiles/blog-illustrate/templates/mode-mix.md`.

Every planned image must include role, visual mode, visual weight, reason, and reuse candidate status.

Use the five Aaron visual modes:

- Editorial Minimal
- Human-Scale Metaphor
- Operator Diagram
- Real Photo Collage
- Glass / Fluent Artifact
```

Renumber later steps.

- [ ] **Step 6: Update outline requirements**

In the outline template section, require each image entry to include:

```md
**Role**:
**Visual mode**:
**Visual weight**:
**Visual predicate**:
**Anti-clutter rule**:
**Reuse candidate?**:
```

Also add:

```md
Before generation, scan `imgs/outline.md` and confirm every image has exactly one visual predicate.
```

- [ ] **Step 7: Update prompt pack requirements**

In the prompt-saving instructions, require each prompt file to include:

```md
# Prompt: NN-name

## Role

## Visual Mode

## Visual Weight

## Positive Prompt

## Negative Prompt

## Mode Constraints

## Density Budget

## Prior Failure To Avoid
```

- [ ] **Step 8: Update visual review section**

Rename `### Step 7: Visual Quality Review` to:

```md
### Step 9: Visual Critique Gate
```

Add:

```md
Before compressing or inserting images, create `src/content/blogs/YYYY-MM-DD/imgs/visual-critique.md` from `tiles/blog-illustrate/templates/visual-critique.md`.

Reject or regenerate images that are cluttered, dirty, too heavy, too generic, too stock-like, role-mismatched, or carrying more than one visual predicate.
```

- [ ] **Step 9: Add visual postmortem**

Before completion summary, add:

```md
### Step 12: Visual Postmortem

Create `src/content/blogs/YYYY-MM-DD/imgs/visual-postmortem.md` from `tiles/blog-illustrate/templates/visual-postmortem.md`.

Record what worked, what failed, reusable patterns, anti-patterns to add to the global system, image stock candidates, and next article guidance.
```

- [ ] **Step 10: Add optional image stock note**

In `## Notes`, add:

```md
## Phase 2: Optional Image Stock Integration

Future integration may connect blog images with `/Users/aaronguo/Work/lab/images-stock` for search, import, and publish-to-stock workflows. This is optional. Blog illustration must still run with local artifacts when image stock is unavailable.
```

- [ ] **Step 11: Run the contract test**

Run:

```bash
npx -y bun test tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts
```

Expected: PASS.

- [ ] **Step 12: Commit the skill update**

```bash
git add tiles/blog-illustrate/SKILL.md
git commit -m "docs: upgrade blog illustration workflow"
```

---

### Task 5: Add FDE Visual Regression Artifacts

**Files:**
- Create: `src/content/blogs/2026-07-06/imgs/visual-critique.md`
- Create: `src/content/blogs/2026-07-06/imgs/visual-postmortem.md`

- [ ] **Step 1: Create FDE visual critique**

Create `src/content/blogs/2026-07-06/imgs/visual-critique.md`:

```md
# Visual Critique

## Set-Level Review

The FDE set has useful concepts but uneven visual pacing. The cover is controlled and credible, but the body set becomes visually heavy because multiple images try to explain too many parts of the argument at once.

The main failure pattern is not low image quality. It is over-explanation: too many objects, routes, gates, symbols, and small artifacts inside a single frame.

## Accepted Images

### 00-cover.png

Accepted with reservations. It is grounded, credible, and not noisy. It feels like enterprise deployment work rather than generic AI. The reservation is that it is safe and somewhat cold; it does not fully carry the article's conflict.

### 02-metaphor-demo-to-operating-loop.png

Accepted as the strongest body image. It has a single scene, clear lighting, and a readable idea: a demo becomes an operating loop. The risk is that it leans on glowing route lines and glass gates, so future sets should not repeat this device too often.

## Rejected Images

### 01-scene-platforms-converge.png

Rejected as too cluttered. It explains platform convergence through roads, landscape, platform symbols, desk objects, workflow maps, trust gates, and industry artifacts at the same time. The visual predicate should have been only: separate platforms converge into deployment.

### 03-comparison-fde-center-of-gravity.png

Rejected as too slide-like. It compresses the consulting handoff chain, embedded collaboration, workflow diagram, green gate, transfer artifacts, and comparison structure into one image. The comparison is conceptually useful but visually overbuilt.

### 04-framework-actor-loop.png

Rejected for framework readability. ACTOR should be memorable from a distance, but every tile contains multiple tiny objects. The framework becomes a collection of small illustrations instead of a clean operator diagram.

## Regeneration Requests

- Regenerate platform convergence as Editorial Minimal: four abstract source marks converge into one deployment layer, with no landscape and no desk map.
- Regenerate FDE vs consulting as Operator Diagram: one long handoff line versus one embedded loop, with no extra artifacts below the main comparison.
- Regenerate ACTOR as Operator Diagram + light Glass / Fluent Artifact: five large letter tiles, one feedback path from R to A, no internal icon clusters.

## Style Fatigue Notes

The set alternates between hand-drawn field notes and glowing glass workflow scenes. Both can work, but the set needs stronger pacing: one or two loud conceptual images, more quiet human-scale images, and cleaner diagrams.

## Stock / Memory Candidates

- Use `02-metaphor-demo-to-operating-loop.png` as a positive reference for single-scene clarity.
- Use `01-scene-platforms-converge.png`, `03-comparison-fde-center-of-gravity.png`, and `04-framework-actor-loop.png` as negative examples for clutter and over-explanation.
```

- [ ] **Step 2: Create FDE visual postmortem**

Create `src/content/blogs/2026-07-06/imgs/visual-postmortem.md`:

```md
# Visual Postmortem

## What Worked

- The cover's real-paper / deployment-desk direction felt more credible than generic AI imagery.
- `02-metaphor-demo-to-operating-loop.png` worked because it used one scene and one idea.
- The article benefited from having at least one framework image, even though the ACTOR execution was too dense.

## What Failed

- The set over-explained the article. Several images tried to show the whole argument instead of one visual predicate.
- The hand-drawn texture became visually dirty when paired with many tiny symbols.
- The ACTOR image lost framework clarity by turning every letter tile into a mini illustration.
- Glass and glowing route lines remained useful, but they started to feel like a repeated trick rather than a deliberate accent.

## Reusable Patterns

- Real desk / paper / artifact environments can ground enterprise AI topics.
- Demo-to-operating-loop works as a metaphor when kept inside one coherent scene.
- Framework images should use large simple elements and one feedback path.

## Anti-Patterns To Add To Global System

- Do not show platform convergence with four full roads, background landscape, desk objects, workflow maps, and gates in one image.
- Do not turn framework tiles into icon clusters.
- Do not use hand-drawn field-note style for dense diagrams unless the element count is extremely low.
- Do not let glowing route lines become the default representation of AI.

## Images Stock Candidates

- Positive reference: `02-metaphor-demo-to-operating-loop.png`.
- Negative references: `01-scene-platforms-converge.png`, `03-comparison-fde-center-of-gravity.png`, `04-framework-actor-loop.png`.

## Next Article Guidance

Start with the visual predicate before writing prompts. For serious essays, plan at least one quiet body image that gives the reader emotional rest. Use Glass / Fluent Artifact as a highlight material, not a whole-post skin.
```

- [ ] **Step 3: Commit FDE regression artifacts**

```bash
git add src/content/blogs/2026-07-06/imgs/visual-critique.md src/content/blogs/2026-07-06/imgs/visual-postmortem.md
git commit -m "docs: add fde visual regression notes"
```

---

### Task 6: Sync Skills And Validate

**Files:**
- Modify: generated skill mirrors only if `scripts/sync-agent-skills.sh` updates checked-in files.
- Test: `tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts`

- [ ] **Step 1: Run illustration workflow tests**

```bash
npx -y bun test tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run existing workflow tests**

```bash
npx -y bun test tiles/blog-write/scripts/blog-write-workflow.test.ts tiles/blog-production/scripts/workflow2-artifacts.test.ts
```

Expected: PASS.

- [ ] **Step 3: Sync local skills**

Run:

```bash
scripts/sync-agent-skills.sh
```

Expected: exits 0. Inspect output and `git status`.

- [ ] **Step 4: Inspect generated sync changes**

Run:

```bash
git status --short
```

Expected: only intended blog illustration workflow files, generated skill mirror files, and the pre-existing `src/brain/logs/cf/2026-07-cf.md` user change.

Do not stage `src/brain/logs/cf/2026-07-cf.md`.

- [ ] **Step 5: Run diff check**

```bash
git diff --check
```

Expected: no whitespace errors.

- [ ] **Step 6: Commit sync changes if any**

If `scripts/sync-agent-skills.sh` changed checked-in mirror files, commit only those files:

```bash
git add <generated-skill-mirror-files>
git commit -m "chore: sync blog illustration skill"
```

If no sync files changed, skip this commit and record that no sync commit was needed.

---

## Final Verification

Run:

```bash
npx -y bun test tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts tiles/blog-write/scripts/blog-write-workflow.test.ts tiles/blog-production/scripts/workflow2-artifacts.test.ts
git diff --check
git status --short
```

Expected:

- all tests pass;
- `git diff --check` returns no output;
- the only remaining unstaged/uncommitted file is the pre-existing user change `src/brain/logs/cf/2026-07-cf.md`, unless the user has made additional changes during execution.

## Self-Review

Spec coverage:

- Five visual modes are implemented by Task 2.
- Visual strategy, mode mix, critique, and postmortem artifacts are implemented by Tasks 3 and 4.
- FDE regression lessons are implemented globally in Task 2 and concretely in Task 5.
- Phase 2 image-stock boundaries are documented in Task 2 and Task 4.
- Manual-first implementation boundary is preserved: no image generation and no image-stock code changes.

Placeholder scan:

- The plan uses concrete file paths, concrete test code, concrete template text, and concrete commands.
- Bracketed strings appear only inside prompt grammar examples, where they are literal reusable prompt slots rather than incomplete implementation requirements.

Type consistency:

- The test checks the same artifact names used by the skill and templates: `visual-strategy.md`, `mode-mix.md`, `visual-critique.md`, and `visual-postmortem.md`.
- The workflow vocabulary is consistent across tasks: visual mode, visual weight, visual predicate, style pacing, and image stock Phase 2.
