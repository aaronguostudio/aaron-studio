# Visual Postmortem

## What Worked

- A real incident object—parcel and receipt—made a technical harness article feel concrete.
- Deterministic HTML rendering kept tool order and cache fields exact.
- The cover and evidence cards share color and material cues without forcing one mode onto every asset.

## What Failed

- The first thumbnail render used a local file URL inside `setContent`; Chromium omitted the background. Embedding the cover as a data URI fixed it.
- Cover candidate A looked too much like a scanner product advertisement and introduced a logo-like leaf.

## Reusable Patterns

- For technical field reports, generate the narrative cover but render evidence and exact text deterministically.
- Use one decisive field per vendor rather than a normalized token leaderboard.
- Keep the outcome boundary visible when one sample fails; do not hide incomplete results.

## Anti-Patterns To Add To Global System

- Do not present designed evidence cards as raw screenshots; label their provenance.
- Do not use image generation for exact terminal receipts.

## Images Stock Candidates

- `00-cover-v1.png`: possible cover reference.
- `01-tool-sequences-v1.png`: reusable comparison-card reference.
- `02-follow-up-receipts-v1.png`: reusable receipt-layer reference.

## Next Article Guidance

If the next harness article tests forced compaction, retain the same evidence-card grammar and add only one before/after transcript survival diagram.
