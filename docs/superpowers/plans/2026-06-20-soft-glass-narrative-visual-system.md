# Soft Glass Narrative Visual System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Update Aaron's blog illustration workflow from dense AI-system diagrams toward a lighter, human-scale Soft Glass Narrative visual language.

**Architecture:** Keep `blog-illustrate` as the workflow orchestrator and `src/content/strategy/visual-language.md` as the brand-level source of truth. Preserve generated v1 image assets for traceability, and add v2 style/outline files for the current article before regenerating images.

**Tech Stack:** Markdown workflow docs, Aaron Studio blog content structure, baoyu-image-gen prompt workflow, WebP compression script.

---

## File Structure

- Modify `src/content/strategy/visual-language.md`: make Soft Glass Narrative the default brand visual language.
- Modify `tiles/blog-illustrate/SKILL.md`: lower default density, add the 70/20/10 image mix rule, and reject over-complex AI dashboard imagery.
- Create `src/content/blogs/2026-06-20/imgs/style-v2.md`: article-specific Soft Glass Narrative brief.
- Create `src/content/blogs/2026-06-20/imgs/outline-v2.md`: revised image plan with 2 mechanism images and 6 narrative/metaphor images.
- Leave existing generated v1 assets and `style.md`/`outline.md` intact for comparison.

---

### Task 1: Update Brand Visual Language

- [x] Replace the default design name in `src/content/strategy/visual-language.md` with `Soft Glass Narrative`.
- [x] Add design principles for human-scale anchors, one idea per image, and the 70/20/10 density budget.
- [x] Add rules for `Soft Glass Editorial`, `Humanized System Fables`, and `Neo Diagram Minimal`.
- [x] Preserve useful Signal Glass motifs as secondary vocabulary, not the default image structure.

### Task 2: Update Blog Illustration Workflow

- [x] In `tiles/blog-illustrate/SKILL.md`, change the default style from `Signal Glass Atlas` to `Soft Glass Narrative`.
- [x] Add a quality rule: most body images should be narrative/metaphor, not diagrams.
- [x] Add an image mix rule: typical body set should be 70% narrative/metaphor, 20% light diagrams, 10% dense mechanism.
- [x] Update anti-patterns to reject dense chart walls, glowing AI dashboards, and full 3D sci-fi HUD imagery.

### Task 3: Add Current Article v2 Style

- [x] Create `src/content/blogs/2026-06-20/imgs/style-v2.md`.
- [x] Define the article's v2 style as `Roadside Soft Glass OS`.
- [x] Specify that the AI layer should appear as quiet glass, light paths, symbolic objects, or background infrastructure.
- [x] Limit mechanism diagrams to the Notion/memory layer and the intent-skill-run-review-memory framework.

### Task 4: Add Current Article v2 Outline

- [x] Create `src/content/blogs/2026-06-20/imgs/outline-v2.md`.
- [x] Keep the cover and thumbnail as Soft Glass Editorial.
- [x] Plan 8 body images:
  - 6 narrative/metaphor images;
  - 1 light architecture diagram;
  - 1 clean framework diagram.
- [x] Mark existing v1 images as `superseded_by_v2_plan`, not deleted.

### Task 5: Verify

- [x] Run `rg -n "Signal Glass Atlas|Soft Glass Narrative|70 / 20 / 10|Roadside Soft Glass OS" src/content/strategy/visual-language.md tiles/blog-illustrate/SKILL.md src/content/blogs/2026-06-20/imgs`.
- [x] Confirm v2 files exist:

```bash
test -f src/content/blogs/2026-06-20/imgs/style-v2.md
test -f src/content/blogs/2026-06-20/imgs/outline-v2.md
```

- [x] Confirm no existing v1 image files were deleted:

```bash
test -f src/content/blogs/2026-06-20/imgs/00-cover.png
test -f src/content/blogs/2026-06-20/imgs/08-scene-life-bigger.png
```
