---
title: 'Progressive Disclosure'
fullName: 'Progressive Disclosure'
shortName: 'Progressive Disclosure'
description: 'Show the smallest complete interface for the current goal, then reveal complexity as intent and context deepen.'
mentalModel: 'Do not delete complexity; let users pay for it in installments as their intent deepens.'
date: '2026-07-17'
updated: '2026-07-17'
domain: 'Interaction design'
domainKey: 'interaction-design'
tags: ['Interaction design', 'Complexity', 'Information architecture', 'Discoverability']
maturity: 'growing'
published: true
featured: false
translationKey: 'progressive-disclosure'
interaction: 'progressive-disclosure'
neighbors:
  - name: 'Disclosure Widget'
    fullName: 'Disclosure Widget'
    category: 'implementation mechanism'
    summary: 'Shows and hides content; progressive disclosure decides what should appear, when, and why.'
  - name: 'Contextual Disclosure'
    fullName: 'Contextual Disclosure'
    category: 'triggered variant'
    summary: 'Reveals content in place when a choice or environmental state makes it relevant.'
  - name: 'Staged Disclosure'
    fullName: 'Staged Disclosure'
    category: 'flow variant'
    summary: 'Distributes information across sequential steps or pages, emphasizing order and transitions.'
  - name: 'Information Architecture'
    fullName: 'Information Architecture'
    category: 'structural foundation'
    summary: 'Classifies and connects information; disclosure decides which layer appears first in an interaction.'
  - name: 'Defaults'
    fullName: 'Defaults'
    category: 'decision shortcut'
    summary: 'Preselect common answers so the first layer works, though hidden defaults can also create surprises.'
  - name: 'Feature Gating'
    fullName: 'Feature Gating'
    category: 'access policy'
    summary: 'Decides whether someone may use a feature; disclosure usually changes only when it is visible.'
sources:
  - title: 'Apple Human Interface Guidelines · Disclosure controls'
    url: 'https://developer.apple.com/design/human-interface-guidelines/disclosure-controls'
  - title: 'IBM Documentation · Progressive Disclosure'
    url: 'https://www.ibm.com/docs/en/technical-content?topic=practices-progressive-disclosure'
  - title: 'W3C WAI-ARIA Authoring Practices Guide · Disclosure Pattern'
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/'
  - title: 'Carbon Design System · Accordion usage'
    url: 'https://carbondesignsystem.com/components/accordion/usage/'
  - title: 'Carroll & Carrithers (1984) · Blocking learner error states in a training-wheels system'
    url: 'https://doi.org/10.1177/001872088402600402'
---

# Progressive Disclosure

Feature-rich products tend to put every capability in front of everyone at once. Each setting may be reasonable, yet the collection makes the most common task harder to begin.

Progressive Disclosure offers a different way to arrange complexity: **show the smallest complete interface required for the current goal, then reveal secondary or advanced options as intent and context deepen.**

It does not remove complexity. It decides when complexity earns its place.

## Auto and Pro camera modes

Most people who pick up a camera need to frame a scene and press the shutter. Auto mode handles exposure, focus, and white balance so the first photograph can happen immediately.

Someone who needs to control motion blur can reveal shutter speed. Someone who needs precise control can enter Pro mode and manage aperture, shutter speed, and sensitivity together.

The professional capability remains available. It simply does not charge every person for its complexity before the first photograph.

But “this will permanently delete the photograph” must not be hidden in an advanced layer. **Low frequency does not mean low importance; risk and consequence belong in the layering decision.**

## The first layer must be small and complete

Suppose someone only wants to export a report. The first layer might contain:

```text
File name     quarterly-report
Format        PDF (Portable Document Format)
Save to       Downloads
              [ Advanced options ] [ Export ]
```

The common task can be completed without opening anything, and the outcome is predictable. A second layer can expose page range, image quality, and metadata. A third can expose color profiles, font embedding, and compression algorithms.

The layers answer different questions:

1. What am I trying to complete?
2. How should the result be adjusted?
3. How should the underlying implementation be controlled?

If the first layer is only a vague button while consequential defaults remain hidden, the interface is concealing decisions rather than managing complexity.

## How to choose what appears first

Do not begin by asking which controls can collapse. Evaluate every piece of information along four dimensions:

| Dimension  | Question                                                                     |
| ---------- | ---------------------------------------------------------------------------- |
| Necessity  | Can the current task succeed without it?                                     |
| Frequency  | How many people and task instances need it?                                  |
| Risk       | Could hiding it change cost, permission, safety, or an irreversible outcome? |
| Dependency | Does it matter only after another choice is made?                            |

Frequent, necessary, or high-consequence information usually belongs in the first layer. Low-frequency, low-risk, conditional information is a better candidate for later disclosure.

## An Artificial Intelligence (AI) agent example

AI agent configuration can quickly accumulate model, tool, context, budget, memory, runtime, and approval settings.

A useful starting arrangement might be:

- Layer one: goal, input, and expected output;
- Layer two: audience, tone, length, and allowed sources;
- Layer three: model, retry, budget, and tool configuration.

But tool permissions, external writes, cost ceilings, and destructive actions carry high consequences. Even if they are infrequent, they should be visible or explicitly confirmed before execution. “Advanced” is not permission to conceal risk.

The real layering model is therefore not merely novice versus expert:

```text
disclosure layer = task relevance × frequency × dependency × consequence
```

## The trigger is part of the design

“Show formatting settings” creates a better expectation than an isolated plus sign or ellipsis. A disclosure trigger should sit near the content it controls and describe what will appear.

On the web, a Disclosure widget normally combines a button with the content it controls. The Web Accessibility Initiative – Accessible Rich Internet Applications (WAI-ARIA) Authoring Practices Guide recommends a real button, `aria-expanded` for state, Enter and Space support, and an experience that does not depend on hover.

## When it works well

- The product has many capabilities, but common tasks use a stable subset.
- Options have natural dependencies, such as revealing compression level only after custom compression is selected.
- New users need a quick start while experts still need complete control.
- Space is limited in mobile screens, sidebars, and property panels.
- Detail is valuable but not necessary for every person on every visit.

## When it degrades

- People need to compare prices, permissions, or plans simultaneously.
- Total cost, renewal, deletion consequences, or visibility are hidden.
- Two lines of explanation are collapsed merely to make the page shorter.
- Experts must reopen the same layer during every task.
- Hidden content becomes difficult to scan, find, print, or understand as a whole.
- The trigger is so vague that people never discover the capability.

Common failure shapes include:

- **Click tunnel:** a common control lives under `More → Advanced → Customize → Details`.
- **Mystery trigger:** an icon gives no clue that it expands or what it contains.
- **Hidden risk:** visual simplicity conceals cost, permission, or irreversible consequences.
- **State amnesia:** the interface forgets an expert's expanded state or clears values on collapse.
- **Hidden dependency:** a visible decision depends on an undisclosed default with no summary.

## Know the neighboring concepts

- **A Disclosure Widget is an implementation mechanism.** Buttons, triangles, `details/summary`, and accordions show and hide; progressive disclosure is the strategy that decides what, when, and why.
- **Contextual Disclosure is a triggered variant.** Selecting “Schedule” reveals a date and time zone because they have become relevant.
- **Staged Disclosure is a flow variant.** It distributes content across a sequence or wizard and emphasizes task order.
- **Information Architecture is the structural foundation.** It handles classification, naming, and connection. A collapsing animation cannot repair a bad taxonomy.
- **Defaults are decision shortcuts.** They make the first layer immediately useful, but invisible defaults can also create surprises.
- **Feature Gating is an access policy.** It decides whether a capability can be used; progressive disclosure normally changes only when it is visible.

## Remember these six things

1. Do not delete complexity; let users pay for it in installments as their intent deepens.
2. The first layer must be small but complete: the task works and the outcome is visible.
3. Layering considers necessity, frequency, dependency, and consequence together.
4. Low-frequency risks must not be hidden for visual simplicity.
5. A disclosure control is a mechanism; progressive disclosure is a strategy.
6. If people are always searching, reopening, or being surprised by hidden defaults, the layers are wrong.

## Self-test

1. Can someone complete and predict the common task without expanding anything?
2. Which low-frequency facts must remain visible because they affect cost, permission, or irreversibility?
3. Does the trigger explain what it will reveal?
4. Does each deeper layer add new decision value?
5. Can keyboard and assistive-technology users perceive and change the state?
6. Are experts repeatedly reopening the same layer?

## Further reading

- [Apple Human Interface Guidelines · Disclosure controls](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls)
- [IBM Documentation · Progressive Disclosure](https://www.ibm.com/docs/en/technical-content?topic=practices-progressive-disclosure)
- [W3C WAI-ARIA Authoring Practices Guide · Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- [Carbon Design System · Accordion usage](https://carbondesignsystem.com/components/accordion/usage/)
- [Carroll & Carrithers (1984) · Blocking learner error states in a training-wheels system](https://doi.org/10.1177/001872088402600402)
