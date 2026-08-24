# Visual Postmortem

## What Worked
- Backend: baoyu-image-gen CLI → openai / gpt-image-2, first-attempt success on all 6 assets, no fallback.
- Dimensions: all 6 at 2048x1152 (16:9), ≥1200px, no byte-identical duplicates.
- Style family selection: Field Signal Editorial (primary) + Paper System Sketch (frame) — a deliberate departure from Soft Glass Narrative to match the post's evidence-led, "claim ledger" texture.
- Tight prompt contract: one predicate per image, zero-text budget on cover + body, exact-text budget on thumbnail.

## What Failed / Gap
- **Visual inspection could not be performed**: the running model (deepseek-v4-pro) has no image-input capability. Candidate comparison, thumbnail-text correctness, style coherence, and semantic predicate correctness are all UNVERIFIED and deferred to Aaron's eyeball before publish.

## Reusable Patterns
- "The tool surface becomes a programming language" (toolbox → code ribbon) is a strong, reusable cover predicate for AI-native-systems essays.
- The four-gift body (hands / competence / continuity / memory) maps cleanly to four single-predicate human-scale scenes; it generalizes to any "what changes when X" essay.

## Anti-Patterns To Watch
- gpt-image-2 text drift on the thumbnail: must be human-verified at ~320px width.
- Do not let "Field Signal Editorial" drift into retro-industrial nostalgia (dirty halftone, safety-orange overload).

## Backend Caveats
- Cost/quality: gpt-image-2 at quality 2k produced 2048x1152 PNGs (3–4 MB each), compressed to 116–317 KB WebP at q82.
- If thumbnail text is wrong, regenerate with a narrower exact-text contract and re-inspect.

## Guidance For Next Article
- Prefer this Field Signal Print direction for operator/evidence-led posts; reserve Soft Glass Narrative for warm reflective essays to avoid sameness.
- If a human-in-the-loop review step is available, run it before compression, not after.
