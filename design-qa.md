# Design QA — Harness Engineering relay animation

Date: 2026-07-24  
Final result: **PASSED**

## Scope

- Standalone concept page: `/Users/aaronguo/Work/ag/aaron-studio/src/brain/concepts/pages/harness-engineering.html`
- Public Vue visual: `/Users/aaronguo/Work/ag/aaron-studio/src/content/concepts/harness-engineering/visual.vue`
- Reviewed interaction: the five-stage comparison inside “让差异在眼前发生”
- Reviewed state: stage 05, `evaluate`, where the thin lane ends at `LOOKS DONE` and the engineered lane runs `FAIL → 修正 → PASS`

## Evidence

- Source visual: `/Users/aaronguo/.codex/generated_images/019f8fc6-5471-7030-870b-9ad3f38548e6/call_4QtNcEGoGay5RtbYvXW7jbOz.png` (`1487 × 1058`)
- Desktop implementation: `/tmp/harness-relay-focused-final.png` (`1280 × 1200`, focused comparison at stage 05)
- Mobile implementation: `/tmp/harness-relay-mobile-390x844-v2.png` (`390 × 844`, current-frame-only layout)
- Normalized side-by-side comparison: `/tmp/harness-design-qa-comparison-final.png` (`2600 × 1090`)

## Comparison result

| Surface | Result | Notes |
| --- | --- | --- |
| Core metaphor | Pass | One shared target becomes two horizontal relay lanes with five handoffs and visibly different system states. |
| Harness coverage | Pass | The five stages visibly encode persistent target, permission boundary, integration feedback, checkpoint recovery, and independent verification. |
| Final contrast | Pass | Thin Harness ends visually complete but with a stopped signal; engineered Harness exposes a fail/fix/pass loop and verified output. |
| Layout and hierarchy | Pass | Target, stage controls, two lanes, current explanation, and evidence sources read in that order without a dashboard-like detour. |
| Imagery | Pass | All target, stage, thin-lane, and engineered-lane states use the prepared raster illustration family; no placeholder or CSS-drawn replacement art. |
| Typography and color | Pass | Pattern Atlas display/body hierarchy is preserved; orange and violet/blue consistently separate the two outcomes. |
| Responsiveness | Pass | `390 px` and `320 px` tests have no horizontal overflow; mobile shows one current frame per lane while retaining the direct comparison. |
| Interaction states | Pass | Play, pause, continue, replay, direct stage selection, and left/right keyboard navigation were exercised in-browser. |
| Accessibility | Pass | Semantic buttons and regions, live narration, explicit mobile stage labels, restored keyboard focus after rerender, visible focus styles, practical tap targets, and reduced-motion overrides are present. |
| Public component | Pass | Prettier check and Vue SFC script/template/scoped-style compilation pass with zero errors. |

## Resolved findings

1. **P2 · The desktop artifacts were too small to carry the metaphor.**  
   Increased target and system-box scale, made the current frame a bordered focal card, increased past-state legibility, and added color-coded relay arrows.

2. **P2 · Stage controls were text-heavy and visually detached from the system change.**  
   Added the five matching stage illustrations to the stage controls and reduced mobile controls to icon plus number while preserving the full accessible label.

3. **P2 · Re-rendering the standalone stage buttons could drop keyboard focus.**  
   The active stage button now regains focus without scrolling, so arrow-key navigation remains continuous.

4. **P2 · The mobile play control was slightly below a practical tap target.**  
   Raised its minimum height to `44 px`; stage controls remain `58 px` high.

## Deliberate differences from the source visual

- The implementation keeps the existing Pattern Atlas page typography and card shell rather than reproducing the source mock as a separate full-screen composition.
- The source mock’s large support artifacts below each engineered stage are condensed into the stage icon and current-stage caption. This preserves the user-requested low-text, immediate comparison while keeping the same five concepts.

No open P0, P1, or P2 findings remain.
