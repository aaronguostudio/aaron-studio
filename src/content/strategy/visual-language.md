# Aaron Blog Visual Language

## Purpose

Aaron's blog visuals should be recognizable across posts, but they should not make a blog feel like a research deck. The visuals need to feel modern, artistic, human, and easy to understand while still carrying the sense that Aaron works with AI-native systems.

## Relationship To Blog Visual System

This file defines Aaron's brand-level visual language. For article-level decisions such as visual mode, visual weight, image role, visual predicate, critique gates, and style pacing, use `src/content/strategy/blog-visual-system.md`.

The default style is not Microsoft Fluent, Apple Liquid Glass, Notion illustration, or generic AI art. It borrows useful qualities from those references:

- liquid glass as a material accent;
- Fluent-like hierarchy and spacing;
- editorial illustration's clarity and rhythm;
- light system diagrams only where they help the reader.

## Default Design Name

**Soft Glass Narrative**

One-line definition:

```text
Flat editorial scenes, human-scale metaphors, and restrained liquid-glass accents that make AI-native work feel understandable, personal, and premium.
```

## Current Default Baseline

The 2026-06-20 `ai-became-my-operating-system` image set is the current default reference for new Aaron blog visuals.

What worked:

- flat editorial composition first;
- soft dimensionality and liquid glass as accents, not the whole image;
- one clear idea per body image;
- mostly metaphorical or human-scale scenes, with only a few diagrams;
- warm life scenes where AI recedes into the background;
- enough negative space for the reader to rest;
- recognizable repeated motifs without making the post feel like a slide deck.

Carry this forward unless Aaron explicitly asks for a different visual direction.

## Core Principles

### 1. Human-Scale First

Start from a concrete human scene, object, gesture, or metaphor:

- a hand holding a phone;
- a desk, notebook, window, car, road, room, book, door, bridge, garden, or light;
- a person reviewing work rather than watching every keystroke;
- a family or life scene where AI is background infrastructure.

AI should usually appear as a quiet second layer, not the dominant subject.

When showing Aaron's family, use three people by default: Aaron, his wife, and their daughter. Do not add an extra fourth family member unless the user says so.

### 2. One Idea Per Image

Each body image should communicate one sentence. If the prompt needs to explain six mechanisms, split the idea or simplify the image.

Good:

```text
Delegated work can keep moving while life stays in the foreground.
```

Too dense:

```text
Codex routes Notion tasks through skills, agents, subagents, local machines, cloud nodes, metrics, review gates, and memory graphs.
```

If the image starts to look like an infographic, ask whether the surrounding section truly needs a diagram. Most blog body images should carry mood, metaphor, or narrative relief rather than dense information.

### 3. 70 / 20 / 10 Density Budget

For a typical article image set:

- 70% narrative or metaphor images;
- 20% light conceptual diagrams;
- 10% dense framework or architecture diagrams.

For an 8-image body set, this usually means:

- 5-6 narrative/metaphor images;
- 1-2 light diagrams;
- 0-1 dense mechanism diagram.

### 4. Flat Editorial Base, Liquid Glass Accent

The default base should be flat or softly dimensional editorial illustration. Liquid glass should be an accent material, not the whole image.

Use:

- clean silhouettes;
- large calm areas;
- soft layered shapes;
- restrained gradients;
- broad translucent sheets;
- small light paths;
- simple symbolic objects.

Avoid:

- full 3D dashboard rooms;
- neon bloom;
- sci-fi HUD overlays;
- isometric SaaS explosions;
- glowing blue grids;
- dozens of micro-panels.

### 5. AI As Atmosphere, Not Always UI

The AI layer can appear as:

- a soft glass ribbon;
- a quiet cyan thread;
- a small amber route;
- papers arranging themselves;
- a window reflection;
- a soft green checkpoint;
- a background path that continues while the person is elsewhere.

Do not always show AI as screens, charts, or command centers.

## Sub-Modes

### Soft Glass Editorial

Default for covers and most body images.

Human-scale scene plus one symbolic AI layer. This should feel like a high-end magazine illustration for modern work.

### Humanized System Fables

Use for reflective or philosophical sections.

More metaphorical and lightly surreal: doors, bridges, rooms, gardens, roads, shadows, lamps, shelves, or maps that imply systems without drawing a system diagram.

### Neo Diagram Minimal

Use only when the reader needs a mechanism.

One clean diagram, large shapes, low density, no chart wall, no fake labels, no tiny UI.

## Palette

Use warm, balanced, low-noise colors:

- Ink graphite: contrast and depth.
- Warm white: paper, glass, calm surfaces.
- Soft cyan: delegated AI traces.
- Warm amber: human intent, road, life direction.
- Soft green: review, trust, completion.
- Muted coral: risk or friction, sparingly.
- Dusty violet: creative/media branch, sparingly.

Avoid dominant dark-blue AI palettes, pure purple gradients, beige-only creator palettes, and high-saturation neon.

## Material Rules

Liquid glass is an accent:

- one to three glass elements per image;
- broad translucent shapes instead of dozens of micro-panels;
- glass should clarify hierarchy or metaphor;
- the main subject should remain readable without the glass layer;
- avoid interface clutter inside glass unless the image is intentionally a diagram.

## Recurring Motifs

These motifs may recur across Aaron's blog, but they should stay quiet:

- **Amber road line:** human life and direction.
- **Soft cyan thread:** delegated AI work.
- **Green gate:** review, verification, human judgment.
- **Warm white memory object:** docs, repos, metrics, session history.
- **Muted coral boundary:** permissions, risk, stop condition.
- **Glass sheet:** task surface, reflection, or invisible infrastructure.
- **Open door / window / bridge:** movement from intent into execution.

Do not let the motifs become visual noise. One or two recurring signals per image is usually enough.

## Image Types

### Cover

Purpose: make readers feel the central story.

Rules:

- Editorial scene or strong metaphor.
- Human-scale anchor must be obvious.
- AI layer should be subtle.
- No text in the clean cover.
- No generic robot, brain, cloud, glowing orb, or abstract network.
- Avoid dense maps.

### Thumbnail

Purpose: clickable and readable at mobile size.

Rules:

- Same world as cover.
- Left or top dark zone reserved for text.
- 2-4 lines maximum.
- One hero phrase in amber.
- Background complexity must be low enough for text to dominate.
- No labels outside the headline/subtitle.

### Narrative Body Images

Purpose: give the reader rhythm and emotional clarity.

Rules:

- One scene, one metaphor, one idea.
- Prefer people, objects, rooms, roads, books, windows, desks, or everyday surfaces.
- AI is a quiet material layer or light path.
- High negative space.
- The image should feel like a pause inside the essay, not a second essay compressed into pixels.

### Light Diagrams

Purpose: explain one reusable concept.

Rules:

- Use large shapes.
- No fake readable text.
- No more than 5 major elements.
- Use icons and spacing rather than tiny labels.

### Dense Mechanism Diagrams

Purpose: explain a necessary architecture or loop.

Rules:

- Maximum one per normal article.
- Must have a clear reason to exist.
- Must be calmer than the first version of `Personal AI Operating System Atlas`.
- If it looks like a SaaS analytics dashboard, reject it.

### Closing Image

Purpose: connect leverage back to human life.

Rules:

- Warm palette.
- Low UI density.
- Real life in foreground.
- AI system quiet in background.

## Default Blog Workflow

Before generating any image outline:

1. Read this file.
2. Create `src/content/blogs/YYYY-MM-DD/imgs/style.md`.
3. Define the post-specific series style:
   - style name;
   - article thesis;
   - reader emotion;
   - human-scale anchor;
   - AI/material layer;
   - palette;
   - image mix;
   - motifs;
   - allowed image types;
   - anti-patterns;
   - quality checklist.
4. Create `imgs/outline.md`.
5. Confirm the outline has a healthy density mix before generating images.

## Style Brief Template

```markdown
# Visual Style Brief: <Post Title>

## Base Language

Soft Glass Narrative

## Post-Specific Style Name

<Name>

## Article Thesis

<One sentence>

## Reader Should Feel

<3-5 adjectives>

## Human-Scale Anchor

<Concrete scene, object, gesture, or metaphor>

## AI / Glass Layer

<How the AI system appears without dominating the image>

## Palette

<Base + accents>

## Image Mix

<Narrative/metaphor count + diagram count + dense mechanism count>

## Recurring Motifs

<Motifs from the visual language plus post-specific motifs>

## Image Set Rules

<Rules for cover, thumbnail, body images>

## Anti-Patterns

<What to reject>

## Quality Checklist

- [ ] The image can be described in one sentence.
- [ ] It has a human-scale anchor or strong metaphor.
- [ ] The AI layer is secondary unless this is the one allowed mechanism diagram.
- [ ] It has enough negative space.
- [ ] It avoids fake UI text and chart clutter.
- [ ] It belongs to the same series as the other images.
```

## Prompt Rule

Every final prompt should name:

- `Soft Glass Narrative`;
- the post-specific style name;
- the human-scale anchor;
- the AI/glass layer meaning;
- the intended density class: narrative, light diagram, or dense mechanism;
- explicit anti-patterns.

This makes generation easier to evaluate and prevents a drift back into generic glowing AI dashboards.
