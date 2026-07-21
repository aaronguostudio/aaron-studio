# Concept Library Operations

This project separates concept creation from concept distribution so Aaron's
Learn library can grow continuously without turning every new entry into an
immediate social post.

## Operating model

```text
signals, work, reading, life
          |
          v
Concept Research & Library Curator
  research -> explain -> connect -> validate -> blog-ready
          |
          | social-brief.json (public-safe handoff)
          v
Aaron Blog Brand Sales & Distribution Lead
  select -> package -> approve -> schedule -> publish -> measure
          |
          v
qualified readers -> aaronguo.com/learn
```

The employees do not share a clock:

- The content employee may add several concepts to the library in one week.
- The distribution employee starts with a 48-hour minimum interval and selects
  only the strongest eligible concept for the current audience and channel.
- A concept can remain in the library indefinitely without ever being promoted.
- One concept can produce several independent social atoms over time: the
  mental model, a misconception, a comparison, a failure mode, or a self-test.

## Sources of truth

- Private concept knowledge: `src/brain/concepts/<slug>.md`
- Public blog package: `src/content/concepts/<slug>/`
- Employee handoff: `src/content/concepts/<slug>/social-brief.json`
- Content employee state: `content-employee/`
- Distribution employee: `../aaronguoblog-brand-sales/`
- Generated campaign drafts:
  `../aaronguoblog-brand-sales/concept-campaigns/`

## Bounded autonomy

The content employee may research, draft, connect, and validate concepts
autonomously. Production publication remains approval-gated until Aaron grants a
separate standing approval for low-risk Learn entries.

The distribution employee may prepare cards, copy, UTMs, and schedules
autonomously. Its existing `A-001` voice-calibration approval still blocks all
public posting. This project does not weaken that guardrail.

## Initial experiment

`Progressive Disclosure` is the first end-to-end concept handoff. Its social
brief drives a deterministic SVG-to-PNG 4:5 card and a three-platform draft
campaign. The experiment tests the system and visual language; it does not
authorize posting.

The calibrated social-card direction is English-first and `sleek-dark`: a
solid near-black background, high-contrast typography, one concept-specific
visual primitive, and no bilingual duplication inside the image. The Learn
article remains bilingual; the social asset follows the audience of the chosen
distribution channel.

Prepare or refresh the local package with:

```bash
node tiles/pattern-atlas/scripts/prepare-concept-campaign.mjs \
  --slug progressive-disclosure \
  --date 2026-07-18
```

The command has no publishing, scheduling, Git, or deployment side effects.
