# Visual Postmortem: FDE Workflow 3 v8

## What Worked

- Concept-first exploration produced three genuinely different cover ideas before style lock. The selected final was a hybrid, not the first plausible output.
- Field Signal Editorial removed the liquid-glass fatigue while retaining Aaron's preferred clarity, material quality, and restrained palette.
- The contact sheet made set-level pacing obvious. Cover, mechanism, framework, and quiet images have different silhouettes.
- Semantic critique caught an ACTOR diagram that looked excellent but encoded the wrong sequence.
- The exact-text regeneration for the four-output image proved that a failed image can often be repaired with a narrower typography contract.
- Built-in image generation produced consistent 1672x941 assets without requiring `OPENAI_API_KEY`; accepted files were copied into the project and versioned.
- The v8 FDE replacement became more useful when it stopped explaining a loop and started showing two people solving a visible factory disruption.
- The v8 Token replacement became sharper when customer ownership was represented by a physical key controlling the workflow press.
- The consulting/FDE comparison became more accurate when it showed complementary contributions and made the field-to-product loop the distinction, rather than using a versus layout.

## What Failed

- The first four-output candidate treated the style name as content and invented several labels.
- The first ACTOR candidate followed the requested visual mood but not the requested sequence.
- All accepted images still use a warm-white ground. The varied composition prevents immediate fatigue, but future sets should test a controlled background shift where the article supports it.
- Candidate A for FDE was visually polished but still too diagrammatic; the field collage carried more operational credibility.
- Candidate B for the Token ending was informative but introduced too much blueprint detail for a quiet conclusion.
- The generated images are 1672x941 rather than the requested 2048x1152. The aspect ratio is correct and the resolution is sufficient for the blog, but backend-native size should be recorded instead of assumed.

## Reusable Patterns

- Separate concept probes from final candidates. Concept diversity means different predicates and composition, not different colors.
- For diagrams, critique semantic correctness before aesthetic quality.
- Use an exact-text budget: name every allowed word and explicitly ban all other text.
- A controlled mix can remain coherent through palette, typography, and line weight while changing composition by role.
- When prose becomes more concrete, the image should move from conceptual boxes toward people, decisions, and physical consequences.
- Preserve rejected candidates with reasons. They become more useful visual memory than a prompt alone.
- For comparisons between professions, visualize where work happens and where learning accumulates; avoid winner/loser symbolism unless the argument genuinely supports it.

## Anti-Patterns To Add To Global System

- Reject diagrams with correct labels but incorrect arrows or order.
- Reject style names, headers, captions, and microcopy invented by the model unless explicitly requested.
- Do not infer requested pixel dimensions from prompt compliance; inspect actual output dimensions.
- Do not promote a concept probe directly into the final set without comparing at least one refined candidate.

## Images Stock Candidates

- Accepted in final article: cover, blog workflow, v8 FDE field work, consulting/FDE comparison, ACTOR, and v8 keyed workflow press.
- Archived after v8 replacement: three-zone human backpropagation diagram and check-card/lever closing image.
- Editorial cut: four-output final. The image passed visual QA but the underlying checklist competed with ACTOR.
- Rejected negative examples: extra-text four outputs, wrong-path ACTOR.
- Candidate tags: `enterprise-ai`, `human-backpropagation`, `deployment`, `editorial-print`, `operator-diagram`, `actor-framework`.

## Next Article Guidance

Keep concept-first selection and semantic diagram critique. Test one image with a darker or documentary background only when the article's emotional beat earns it. Continue using versioned filenames until the set passes, then update article references rather than overwriting historical assets.
