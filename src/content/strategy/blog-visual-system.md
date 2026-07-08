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
