# Pattern Atlas visual system

Read this file only when creating or materially revising a visual concept page.

## Design character

Aim for an editorial field guide rather than a dashboard: warm paper, dark ink, oversized serif display type, small monospaced annotations, thin technical lines, and a few high-energy color accents.

Core palette:

```css
--paper: #f4efe5;
--paper-2: #ebe3d4;
--ink: #171713;
--muted: #69645a;
--lime: #d9ff66;
--orange: #ff735a;
--blue: #83d9ff;
--violet: #b7a5ff;
```

- Display: `Georgia, "Times New Roman", serif`
- Body: `Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Metadata: `ui-monospace, SFMono-Regular, Menlo, monospace`
- Prefer 1–1.5 px ink borders, 18–28 px corner radii, and restrained shadows.
- Use a subtle grid or paper field. Keep contrast WCAG-friendly.

## Public theme token contract

Standalone private HTML may own its entire palette. A public Blog Learn `visual.vue`
must instead inherit the blog's live light/dark theme tokens:

```css
.learn-visual {
  --visual-ink: var(--foreground);
  --visual-muted: var(--muted-foreground);
  --visual-surface: var(--card);
  --visual-soft: var(--secondary);
  --visual-border: var(--line-card);
  --visual-accent: color-mix(in srgb, #6d5dfc 82%, var(--foreground));

  color: var(--visual-ink);
}
```

- Use `--foreground`, `--muted-foreground`, `--background`, `--card`,
  `--secondary`, `--line-subtle`, `--line-card`, `--line-control`, and
  `--notes-accent` as the public theme contract.
- Never use the retired `--color-text`, `--color-text-muted`,
  `--color-surface`, or `--color-surface-soft` names. They are not runtime site
  variables; a light fallback such as `#171717` silently becomes black text on
  the dark theme.
- Fixed colors are for accents and deliberately invariant diagrams, not primary
  text, muted text, page surfaces, or card surfaces.
- For inverse sections, define foreground/background as a pair and verify both
  themes. Do not assume that an `ink` token always means a dark physical color.
- In `.dark`, section headings must resolve to `--foreground`, supporting copy
  to `--muted-foreground`, and ordinary cards to `--card` or `--secondary`.
- Browser QA must cover both light and dark mode. Inspect computed colors on at
  least one section heading, one description, and one card; verify readable
  contrast and no console errors at desktop and 360 px width.

## Narrative blueprint

Choose 6–9 of these beats; do not force all of them when the concept does not need them:

1. Hero: English concept name + short Chinese mental model
2. Intuition: what problem exists without it?
3. Interactive demonstration of the central mechanism
4. Mechanism in 3–5 explicit stages
5. Core implementation or protocol example
6. Comparison with the closest alternative
7. Concept-neighborhood cards
8. Trade-offs and failure modes
9. Scenario judgment exercise
10. Five-item pocket memory

## Pick the interaction from the concept

| Concept shape              | Preferred interaction                             |
| -------------------------- | ------------------------------------------------- |
| State changes or conflicts | Step-through simulator                            |
| Two competing strategies   | Toggle with a shared visual                       |
| Lifecycle or protocol      | Timeline / staged message flow                    |
| Hierarchy or layers        | Expandable stack                                  |
| Network or adjacent terms  | Relationship cards or map                         |
| Operational judgment       | Clickable scenarios with explanations             |
| Parameter trade-off        | Slider only when a continuous value is meaningful |

Avoid interactions that merely decorate the page. Every click should reveal a causal relationship, boundary, or decision.

## Acronym treatment

Every standalone concept card must contain:

```html
<h3>MVCC <small>STORAGE MODEL</small></h3>
<span class="full-name">Multi-Version Concurrency Control · 多版本并发控制</span>
<p>...</p>
```

- Keep the acronym visually dominant.
- Put the English expansion and Chinese translation directly below it.
- Use the small category label to distinguish strategy, mechanism, model, protocol, primitive, and UX pattern.
- Expand acronyms again in a comparison summary if that summary can be read independently.

## Interaction and accessibility

- Use semantic `button`, `nav`, `section`, `article`, and heading order.
- Give every interactive state a visible explanation and an `aria-live` output.
- Ensure the page works without hover and at 360 px width.
- Support `prefers-reduced-motion`.
- Keep JS local, deterministic, and small; no network requests.
- Provide a clear link back to `../index.html`.

## Quality bar

Inspect `src/brain/concepts/pages/optimistic-concurrency.html` for the expected polish. Reuse its principles, not its topic-specific wording. The finished page should make the concept easier to reason about than the Markdown alone.
