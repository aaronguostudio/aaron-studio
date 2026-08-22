# Visual Postmortem

## Reusable Lessons

1. **Local-stack covers are achievable, model review is not.** The procedural PIL backend (paper bg + card + die + dither dissolve) produced a defensible Field Signal Editorial cover with no image model at all. When the production model is a text-only GGUF, the cover shifts to code-composed illustration; the style system (Field Signal Editorial) constrains it so the output stays on-brand.
2. **Structural QA (palette ratios, content bbox, margins) is a floor, not a gate.** It verifies composition bounds and color discipline; it cannot verify taste, legibility, or thumbnail behavior. The human review gate is non-optional when no model can see the image.
3. **One predicate per cover held up.** The dissolve concept survived because the brief forbade a second predicate (no "before/after" scene). Future covers: write the predicate sentence before any generation.
4. **Manifest honesty about backend capability** (why procedural, what was checked, what remains unverified) is the same discipline as the claim ledger — it is the audit for the image.

## Next Run

- If an image-capable model is reachable (API or multimodal local GGUF), run A1/A2 alongside one raster-AI candidate per concept and let the model critique + human select.
- Consider copying /tmp/cover_gen.py into the post or tiles/ if Aaron keeps the cover (script is the real reproducible asset).
