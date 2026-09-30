# Visual Postmortem

## What Worked

- Three probe concepts in one parallel batch (about 1 minute) made the choice obvious; the receipt route won on thumbnail legibility.
- Making the cover's accent the same amber as the charts' "cache reads" bar tied the cover to the evidence.
- Deterministic charts and a deterministic thumbnail headline removed all generated-text risk.

## What Failed

- "Thick amber bar" was not enough for gpt-image-2: v1 and v2 rendered thin lines. A size relation ("about five times taller than the rows") fixed it.
- First chart render: group headers overlapped labels, one right-side label clipped, one long title clipped. Fixed by setting axis limits before placing measured text and auto-fitting titles.

## Reusable Patterns

- Cover prompt: "one line item swallows the bill" is reusable for cost and pricing posts.
- Chart system: warm-white ground, Helvetica Neue, neutral bars, one amber accent, direct labels, title = claim, footnote = source.

## Anti-Patterns To Add To Global System

- Describe accent weight as a ratio to neighboring elements; adjectives like "thick" get ignored.
- In matplotlib, place measured or right-aligned text only after the final axis limits are set.

## Images Stock Candidates

00-cover (v3), probe-a-receipt, probe-b-card-meter.

## Next Article Guidance

For data-led posts, decide early which tables become charts so the blog does not show the same numbers twice.
