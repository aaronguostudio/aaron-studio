# Blog Illustration Workflow 2.0 Design

## Objective

Upgrade Aaron's blog illustration workflow from a prompt-first image generation pipeline into a judgment-first visual editorial system.

The goal is not to make every image look more polished. The goal is to make each image know its job: stop the scroll, create emotional rhythm, clarify a framework, support a business argument, or become reusable visual memory.

This design covers Phase 1:

- define Aaron's reusable visual modes;
- upgrade `blog-illustrate` with visual strategy, mode mix, critique, and postmortem artifacts;
- use the FDE article image set as the first regression case for clutter, heaviness, and visual fatigue.

It also defines Phase 2 boundaries for future integration with `/Users/aaronguo/Work/lab/images-stock`, without requiring that integration in the first implementation.

## Problem

The current blog image workflow can generate a complete set of images: cover, thumbnail, body illustrations, prompts, and WebP outputs. It already has useful quality rules, but it still behaves mostly like a production pipeline:

```text
article -> style brief -> outline -> prompts -> images -> review -> compress
```

The missing layer is visual judgment before generation.

The FDE article showed the gap clearly:

- Some images had decent material quality but felt heavy because glass, route lines, process objects, and diagrams were all used at once.
- Some hand-drawn images looked dirty or visually noisy because the prompt tried to explain too many concepts in one frame.
- The ACTOR framework image contained the right idea but overloaded each tile with small symbols, making the framework harder to read from a distance.
- The set did not have enough pacing. Several images carried medium or loud visual weight, so the article did not get enough quiet reading relief.
- The workflow recorded prompts, but not enough structured rejection reasoning, style fatigue signals, or reusable aesthetic lessons.

The current workflow can answer "what should we generate?" It needs to answer "what visual experience should this article have?"

## Core Principle

```text
Style is pacing, not skin.
```

Aaron's blog should not apply one visual treatment to an entire article. A good post should use a coordinated mix of visual modes, chosen by:

1. the article's editorial character;
2. the image's role in the reading experience;
3. the visual weight the image should carry at that moment.

Liquid glass, Fluent-like hierarchy, editorial illustration, real photo texture, and diagrams can all belong in Aaron's system. The problem is not any one of those ingredients. The problem is using a strong material language everywhere until the article feels visually tired.

## Success Criteria

The workflow succeeds when a serious blog post has:

- a visual strategy before any image prompt is written;
- a planned mix of visual modes, not a single style pasted across every image;
- explicit visual weight for each image: quiet, medium, or loud;
- one clear visual predicate per image;
- a critique gate that can reject images for clutter, heaviness, generic AI texture, or role mismatch;
- a postmortem that writes lessons back into the visual system;
- generated images that improve the article's rhythm instead of turning it into a slide deck.

## Non-Goals

Phase 1 does not implement full image-stock synchronization.

Phase 1 does not require every lightweight post to run the full process. Quick notes can use a lighter path. This workflow is for serious essays where images affect perception, distribution, or long-term brand quality.

Phase 1 does not force every article into one house style. It creates a controlled visual vocabulary that can be recombined.

## Aaron Visual Modes

### 1. Editorial Minimal

Purpose: create a strong first impression or a clean conceptual turn.

Best for:

- cover images;
- opening images;
- section-break visuals;
- thesis moments;
- high-conflict opinion posts.

Visual character:

- one strong metaphor;
- generous negative space;
- low element count;
- crisp composition;
- minimal diagramming;
- no need to explain every sub-claim.

Visual weight: medium to loud.

Use when the reader should feel: "This is sharp, deliberate, and worth reading."

Anti-patterns:

- consulting-slide composition;
- too many icons;
- background scenery that does not carry meaning;
- concept collage;
- weak generic office symbolism.

Prompt grammar:

```text
A high-end editorial image built around one strong metaphor: [metaphor].
Use generous negative space, a restrained palette, and no more than three major visual elements.
The image should imply [thesis] without explaining the whole argument.
Avoid diagrams, dashboards, fake UI, text labels, and decorative clutter.
```

### 2. Human-Scale Metaphor

Purpose: give the essay emotional rhythm, lived texture, and reader relief.

Best for:

- body images after dense argument sections;
- personal workflow examples;
- reflective or human-centered paragraphs;
- moments where AI should recede into the background.

Visual character:

- people, desks, rooms, roads, windows, books, lamps, notebooks, paper, light, ordinary objects;
- AI as a quiet secondary layer;
- warm but not beige-only;
- metaphor before interface.

Visual weight: quiet to medium.

Use when the reader should feel: "I can see this in real work or real life."

Anti-patterns:

- every image becoming a workflow map;
- glowing AI dashboards;
- artificial business people smiling at screens;
- over-rendered 3D rooms;
- too much liquid glass over realistic photography.

Prompt grammar:

```text
A human-scale editorial scene showing [ordinary anchor].
The AI/system layer appears only as [one subtle motif], secondary to the human scene.
Keep the composition calm, readable, and warm, with enough negative space.
The image communicates one idea: [takeaway].
Avoid dashboards, dense UI, fake text, extra symbolic objects, and heavy glowing glass.
```

### 3. Operator Diagram

Purpose: explain a framework, comparison, or mechanism clearly.

Best for:

- ACTOR-style frameworks;
- concise process diagrams;
- before/after comparisons;
- operating models;
- technical or strategic artifacts.

Visual character:

- low-density product/strategy artifact;
- strong hierarchy;
- large shapes;
- few labels or no labels;
- one visual predicate;
- no tiny unreadable detail.

Visual weight: medium.

Use when the reader should feel: "I can use this."

Anti-patterns:

- five cards full of little symbols;
- chart walls;
- nested flows;
- fake UI labels;
- hand-drawn diagrams with too many sketch marks;
- mixing framework, comparison, and narrative scene in one image.

Prompt grammar:

```text
A clean operator-grade diagram for [framework/mechanism].
Use large simple shapes, strong spacing, and one visual predicate: [predicate].
Each major element should be readable at thumbnail size.
Limit the diagram to [N] primary elements and one feedback path.
Avoid tiny icons, dense arrows, fake text, decorative backgrounds, and chart-wall energy.
```

### 4. Real Photo Collage

Purpose: reduce AI-illustration sameness and bring business, place, or object reality into the article.

Best for:

- covers for enterprise, finance, workplace, technology, or market topics;
- posts that need more grounded realism;
- thumbnails that should feel less like AI art;
- sections where a real-world anchor matters.

Visual character:

- realistic or photo-collage base;
- restrained graphic overlay;
- documentary or editorial atmosphere;
- real objects, real rooms, real materials;
- minimal stylization.

Visual weight: medium to loud for covers; quiet to medium for body.

Use when the reader should feel: "This is about real work, not just an AI concept."

Anti-patterns:

- generic stock-photo meetings;
- fake smiling executives;
- overly staged corporate scenes;
- random city skylines;
- photo plus too many neon annotation layers.

Prompt grammar:

```text
A grounded editorial photo-collage scene built around [real-world anchor].
Use realistic materials and restrained composition, with only one subtle graphic overlay: [overlay].
The image should feel specific, credible, and modern.
Avoid generic stock meetings, staged smiles, heavy glass overlays, logos, fake text, and sci-fi lighting.
```

### 5. Glass / Fluent Artifact

Purpose: preserve the high-quality material language Aaron likes, but only where visual emphasis is worth the cost.

Best for:

- product-like artifacts;
- framework cards;
- clean interface moments;
- thumbnails;
- one or two high-impact body images;
- visualizing invisible infrastructure.

Visual character:

- translucent panels;
- soft depth;
- Fluent-like spacing and hierarchy;
- limited cyan, amber, green accents;
- material detail as emphasis, not wallpaper.

Visual weight: medium to loud.

Use when the reader should feel: "This system has a premium, designed interface."

Anti-patterns:

- every body image using glass ribbons;
- heavy glass pasted over realistic photos;
- glowing route lines everywhere;
- sci-fi HUDs;
- visual effects that overpower the idea.

Prompt grammar:

```text
A premium product-artifact image using restrained glass and Fluent-like hierarchy.
Use glass only for [specific artifact or layer], not the whole image.
Keep the scene simple, with clear spacing, soft depth, and no more than two accent colors.
The material language should clarify [concept], not decorate it.
Avoid neon HUDs, excessive glow, dense panels, and full-scene glass treatment.
```

## Two-Layer Mode Selection

### Layer 1: Article Character

Before choosing image modes, classify the article:

| Article character | Default mode mix |
|---|---|
| Personal AI workflow essay | Human-Scale Metaphor + Editorial Minimal + one Operator Diagram |
| Enterprise / market argument | Editorial Minimal + Real Photo Collage + Operator Diagram |
| Technical framework / know-how | Operator Diagram + Human-Scale Metaphor + limited Glass Artifact |
| Reflective essay | Human-Scale Metaphor + Editorial Minimal |
| Product/tool/process post | Glass / Fluent Artifact + Operator Diagram + Human-Scale Metaphor |

### Layer 2: Image Role

Then assign a role-specific mode:

| Image role | Default mode | Visual weight |
|---|---|---|
| Cover | Editorial Minimal or Real Photo Collage | loud |
| Thumbnail | Editorial Minimal + typography, sometimes Glass Artifact | loud |
| Body narrative | Human-Scale Metaphor | quiet or medium |
| Framework | Operator Diagram, optionally 10-20% Glass Artifact | medium |
| Comparison | Operator Diagram or Editorial Minimal | medium |
| Closing image | Human-Scale Metaphor or Editorial Minimal | quiet to medium |

## Blog Illustration Workflow 2.0

### Step 1: Load Visual System

Read:

```text
src/content/strategy/visual-language.md
src/content/strategy/blog-visual-system.md
```

`visual-language.md` remains the brand-level visual language.

`blog-visual-system.md` becomes the operational design system for blog illustration: modes, pacing rules, density rules, anti-patterns, and prior lessons.

### Step 2: Visual Strategy Brief

Create:

```text
src/content/blogs/YYYY-MM-DD/imgs/visual-strategy.md
```

Required sections:

```markdown
# Visual Strategy

## Article Character

## Reader Emotion

## Visual Risk

## Recommended Mode Mix

## Cover Direction

## Body Image Direction

## Framework / Diagram Direction

## What To Avoid
```

This file should be written before `imgs/style.md` and before any image prompts.

### Step 3: Mode Mix Plan

Create:

```text
src/content/blogs/YYYY-MM-DD/imgs/mode-mix.md
```

Each planned image must include:

- image id;
- article position;
- image role;
- visual mode;
- visual weight: quiet, medium, or loud;
- reason for that mode;
- whether it can use stock/reference assets later.

Example:

```markdown
| Image | Role | Mode | Weight | Reason |
|---|---|---|---|---|
| 00-cover | Cover | Editorial Minimal | loud | Needs a strong scroll-stopping thesis image |
| 02-demo-loop | Body narrative | Human-Scale Metaphor | quiet | Reader needs relief after dense enterprise details |
| 04-actor | Framework | Operator Diagram + light Glass Artifact | medium | Needs reusable clarity, not mood |
```

### Step 4: Post-Specific Visual Direction

Adjust the existing:

```text
src/content/blogs/YYYY-MM-DD/imgs/style.md
```

Its role changes from "single style brief" to "post-specific visual direction." It should cite:

- `visual-language.md`;
- `blog-visual-system.md`;
- `visual-strategy.md`;
- `mode-mix.md`.

It should not imply that every image must share the same material treatment.

### Step 5: Image Outline v2

Create or update:

```text
src/content/blogs/YYYY-MM-DD/imgs/outline.md
```

Each image entry must include:

```markdown
## Illustration N

**Position**:
**Role**:
**Visual mode**:
**Visual weight**:
**Purpose**:
**One-sentence takeaway**:
**Visual predicate**:
**Density class**:
**Anti-clutter rule**:
**Reuse candidate?**:
**Filename**:
```

The new field is `Visual predicate`.

A visual predicate is the one action or relation the image is allowed to show.

Examples:

- "Separate AI platforms converge into one deployment layer."
- "A demo expands into an operating loop."
- "ACTOR forms a learning loop."

If the image needs two predicates, split the image or simplify it.

### Step 6: Prompt Pack

Save prompts to:

```text
src/content/blogs/YYYY-MM-DD/imgs/prompts/
```

Each prompt file should include:

```markdown
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

Prompt files should mention why the image exists, not only what to draw.

### Step 7: Candidate Generation

Candidate rules:

- Cover: at least 2 candidates.
- Thumbnail: at least 2 candidates.
- Framework / Operator Diagram: at least 2 candidates.
- Body narrative images: 1 candidate is acceptable, but regenerate once if role mismatch or clutter appears.

Candidates should be preserved for traceability.

### Step 8: Visual Critique Gate

Create:

```text
src/content/blogs/YYYY-MM-DD/imgs/visual-critique.md
```

Required sections:

```markdown
# Visual Critique

## Set-Level Review

## Accepted Images

## Rejected Images

## Regeneration Requests

## Style Fatigue Notes

## Stock / Memory Candidates
```

Each image review should answer:

- Does the image match its role?
- Does it follow its visual mode?
- Is the visual weight appropriate?
- Is there exactly one visual predicate?
- Is it cluttered, dirty, heavy, generic, too AI-like, or too stock-like?
- Does it improve the reading experience?

Reject or regenerate when:

- the image explains too many ideas;
- visual density is higher than planned;
- glass/fluent effects overpower the scene;
- the image repeats a prior metaphor without reason;
- small symbols or fake labels are not readable;
- the image looks like a consulting slide instead of an editorial blog image.

### Step 9: Regenerate If Needed

Regeneration prompts must include the critique reason.

Example:

```text
Regenerate because the prior candidate used five visual sub-scenes and felt like a consulting slide.
Keep only one predicate: ACTOR forms a learning loop.
Use five large letter tiles with one feedback path. Remove all small document icons.
```

### Step 10: Compress, Insert, And Finalize

Keep the existing compression and insertion behavior:

```text
scripts/compress-blog-imgs.sh
imgs/web/*.webp
```

Only accepted images should be inserted into the blog article.

### Step 11: Visual Postmortem

Create:

```text
src/content/blogs/YYYY-MM-DD/imgs/visual-postmortem.md
```

Required sections:

```markdown
# Visual Postmortem

## What Worked

## What Failed

## Reusable Patterns

## Anti-Patterns To Add To Global System

## Images Stock Candidates

## Next Article Guidance
```

This is the learning layer. It prevents each article from starting from zero.

## Quality Gates

### Set-Level Gates

Before final acceptance:

- The set must include at least one quiet image if there are three or more body images.
- No more than 1-2 images should carry loud visual weight.
- No more than one image in a normal post should be a dense mechanism diagram.
- If more than half the images use glass/glow/route-line effects, the set fails style pacing.
- If more than half the images are diagrams, the set fails editorial rhythm unless the post is explicitly a tutorial or reference guide.

### Image-Level Gates

Each image must pass:

- one visual predicate;
- planned visual mode;
- planned visual weight;
- no fake readable text unless the image is a thumbnail with approved title text;
- no generic stock-photo energy;
- no irrelevant symbolic clutter;
- readable at mobile width.

### FDE Regression Gates

The FDE image set becomes a regression case:

- `01-scene-platforms-converge` failed because it explained too much through roads, landscape, platform symbols, desk objects, workflow map, and gates.
- `03-comparison-fde-center-of-gravity` failed because it compressed consulting comparison, embedded work, transfer artifacts, and workflow diagram into one image.
- `04-framework-actor-loop` failed because every tile contained multiple symbols, so ACTOR became noisy instead of memorable.
- `02-metaphor-demo-to-operating-loop` was closer to successful, but still shows how glowing route/glass language can become a repeated trope if used too often.

Future workflow should use these as examples of what to avoid.

## Phase 2: Images Stock Integration

The future `images-stock` integration should be useful but optional.

Repository:

```text
/Users/aaronguo/Work/lab/images-stock
```

Existing useful capabilities:

- asset gallery;
- accepted/rejected asset metadata;
- feedback and favorites;
- style-library profiles;
- scheduled generation;
- Codex Studio prepare/import;
- prompt and evaluation records.

Phase 2 should connect blog images through three operations:

### 1. Search Stock

Potential command:

```text
blog:image:search-stock
```

Purpose:

- search by article topic, visual mode, role, style family, aspect ratio, and use case;
- return reference candidates or reuse candidates;
- avoid regenerating assets that already exist.

### 2. Import From Stock

Potential command:

```text
blog:image:import-stock
```

Purpose:

- copy or link selected stock assets into `src/content/blogs/YYYY-MM-DD/imgs/`;
- preserve source asset id;
- record reuse in `visual-critique.md` or `visual-postmortem.md`.

### 3. Publish To Stock

Potential command:

```text
blog:image:publish-to-stock
```

Purpose:

- send accepted blog images, prompts, mode metadata, critique, and post slug into image stock;
- optionally send rejected images as negative examples;
- map the five Aaron visual modes to image-stock style profiles:
  - `aaron-editorial-minimal`
  - `aaron-human-scale-metaphor`
  - `aaron-operator-diagram`
  - `aaron-real-photo-collage`
  - `aaron-glass-fluent-artifact`

Phase 2 must not make blog illustration dependent on image stock being online. If image stock is unavailable, blog illustration should still run with local artifacts.

## Files To Add In Phase 1

Global:

```text
src/content/strategy/blog-visual-system.md
```

Per post:

```text
src/content/blogs/YYYY-MM-DD/imgs/visual-strategy.md
src/content/blogs/YYYY-MM-DD/imgs/mode-mix.md
src/content/blogs/YYYY-MM-DD/imgs/visual-critique.md
src/content/blogs/YYYY-MM-DD/imgs/visual-postmortem.md
```

Existing files to update:

```text
tiles/blog-illustrate/SKILL.md
src/content/strategy/visual-language.md
```

Optional future tests:

```text
tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts
```

## Implementation Boundary

The first implementation should be manual-first:

- update strategy docs;
- update `blog-illustrate` workflow instructions;
- add templates for new artifacts;
- add lightweight tests that ensure the workflow mentions visual strategy, mode mix, critique, postmortem, and the five modes;
- do not generate new images yet;
- do not implement image-stock commands yet.

After the workflow is in place, the FDE article can be rerun as the first practical test.

## Spec Self-Review

Placeholder scan: no unresolved placeholder requirements remain.

Internal consistency: the design keeps Phase 1 focused on visual judgment and leaves image stock for Phase 2.

Scope check: this is a single workflow upgrade, not a full image-stock integration project.

Ambiguity check: the key operating concepts are defined: visual mode, visual weight, visual predicate, critique gate, and postmortem.
