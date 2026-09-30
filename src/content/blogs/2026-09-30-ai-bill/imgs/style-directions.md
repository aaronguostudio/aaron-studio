# Style Directions

Concept is locked in `visual-strategy.md` (Route A: one overflowing line item).

## Article Fit Summary

Evidence-led, numerate essay. Needs one calm visual world that makes numbers feel trustworthy, plus a single loud cover/thumbnail. Low tolerance for decoration.

## Style Library Candidates

| Candidate | Source style family | Best role | Why it deserves consideration | Main risk |
|---|---|---|---|---|
| A | Field Signal Editorial | cover / thumbnail | Warm-white print, graphite structure, one safety-color signal: exactly a receipt with one amber line | Can look too sparse |
| B | Data Poster | thumbnail / charts | One metric, high-contrast type | Decorative numbers without substance |
| C | Infographic Editorial | charts | Large numbers, direct labels, magazine restraint | Consulting-slide clutter |
| D | Editorial Workbench | cover | Tactile desk still life with a real receipt | Finance-luxury energy |

## Style Direction Menu

| Direction | Visual character | Best use in this article | Why it fits | Risks | Whole post or accent? |
|---|---|---|---|---|---|
| Field Signal Editorial | Warm-white paper, graphite rows, one amber signal, soft daylight | cover, thumbnail | Receipt metaphor lives natively in print | Sparse | Cover world |
| Editorial Data Chart (Infographic Editorial, restrained) | Warm-white ground, Helvetica Neue, neutral bars, one amber accent, direct labels | five charts | Numbers must be exact and readable on a phone and in video | Five charts risks a chart wall | Body |
| Data Poster thumbnail | Cover world plus 2-4 huge condensed words | thumbnail | Mobile legibility | Shouting | Accent |

## Style Probe Menu

Not requested; not run.

## Style Cohesion Decision

| Cohesion model | Decision | Notes |
|---|---|---|
| Unified |  |  |
| Controlled Mix | Selected | Field Signal Editorial cover/thumbnail + deterministic Editorial Data Chart body. Shared tokens: warm white #F6F4EF-ish ground, graphite ink, amber #D2701C accent. |
| Experimental Mix |  |  |

## Recommendation

Controlled Mix. The cover sets the metaphor (one amber line item dominates); every chart reuses the same amber to mark the dominant or decisive value.

## Aaron's Decision

Agent-selected. The production brief delegated concept and style choice and specified the chart style (restrained palette, one accent, no gradients/3D).

## Prompt Implications

- Cover prompts: three elements max (receipt, amber line, surface); abstract bars only; explicit ban on letters, numbers, currency symbols, barcodes, logos.
- Thumbnail: headline set deterministically with Helvetica Neue Condensed Black; image model draws no text.
- Charts: rendered by `charts/render_charts.py`, never by an image model.
