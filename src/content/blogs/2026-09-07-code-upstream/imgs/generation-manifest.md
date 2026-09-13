# Image generation manifest — revision 2

Backend: built-in image_gen. Exact backend model/cost not exposed. No CLI fallback. Author requests style preservation with different imagery. Original v1 images, prompts and critique remain preserved.

Concept: diagnose the missing business step; hypothetical business-document workflow, not real-client evidence. Cohesion: Controlled Mix, existing paper editorial family retained. Old cover is a style-only reference. Exact prompts in imgs/prompts/v2-*.md; candidate execution paths and selections appended after generation. Intended assets: two covers, two thumbnails, three body images. No publication rights/real-client claims inferred from generated scenes.

## Execution and selection

All seven original outputs are 1672×941. Reference for both cover candidates and all body images: imgs/00-cover-v1.png, style only. Thumbnail references: imgs/00-cover-v2.png. All outputs from the built-in image tool; provider model and billing not exposed. No source photo or external asset used.

| Prompt file | Output | Built-in output basename | Decision |
|---|---|---|---|
| v2-00-cover-a.md | 00-cover-v2-a.png | exec-6f79de61-0226-46fd-b5a3-cd28f1ebb67a.png | Selected, copied to 00-cover-v2.png |
| v2-00-cover-b.md | 00-cover-v2-b.png | exec-b0c2687d-e7d2-4ae1-91b7-d73a0ece030d.png | Retained alternative |
| v2-01-watch-the-work.md | 01-watch-the-work-v2.png | exec-ef675c4d-4e15-4380-a2a6-cdc67c3849a2.png | Selected |
| v2-02-choose-the-path.md | 02-choose-the-path-v2.png | exec-f7f33620-c8f3-4e79-8543-0f08f6a20e13.png | Selected |
| v2-03-used-in-the-world.md | 03-used-in-the-world-v2.png | exec-cef5c503-955f-404e-88f2-9eb134b9c16c.png | Selected |
| v2-00-thumbnail-a.md | 00-thumbnail-v2-a.png | exec-f5429c10-4580-47ab-b6b1-f330df58c0f7.png | Retained alternative |
| v2-00-thumbnail-b.md | 00-thumbnail-v2-b.png | exec-130358d7-6b2f-4f01-a17f-fc63d7a5ab39.png | Selected, copied to 00-cover-thumbnail-v2.png |

Prompts are under imgs/prompts/. Outputs originated under /Users/aaronguo/.codex/generated_images/01a07783-fe60-7981-bda5-07ed04daee08/ and were copied into the project. Post-processing only: accepted-image WebP compression and YouTube JPEG resize; no manual raster edits. Detailed byte sizes in asset-sizes-v2.json. Thumbnail mobile test in thumbnail-mobile-v2.jpg. All remain conceptual, project-specific illustrations; not yet author-approved reusable stock.
