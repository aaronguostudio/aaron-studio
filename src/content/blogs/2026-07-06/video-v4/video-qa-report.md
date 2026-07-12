# FDE Video V4 QA Report

**Master:** `fde-full-film-v4.mp4`  
**Rendered:** 2026-07-11  
**Format:** 1920x1080, 30 fps, H.264 video, AAC stereo  
**Duration:** 07:31.669

## Result

Pass for review. The V4 master resolves the specific V3 issues raised during review and was inspected both from Remotion source frames and from frames decoded from the final MP4.

## Verified fixes

| Concern | Verification |
| --- | --- |
| `FDE` split across captions | Caption token normalization merges adjacent spelled acronym timings. The final encoded caption reads `FDE` as one word. |
| Workflow rail obscured by gates | The registered `workflow-gates` layout reserves separate vertical bands for gate cards, workflow rail, pattern line, and captions. |
| Learning-loop nodes out of sync | Each node illumination is tied to the corresponding path-arrival interval, rather than to the end of the whole SVG stroke. |
| Comparison title crowded into a side column | The question now receives a dedicated full-screen statement beat before the split comparison enters. |
| Uncontrolled card/title overlap | Title, support copy, and captions are assigned to non-overlapping registered layout slots. |
| Flat visual rhythm | Two selective conceptual stills create pauses in the factory and ownership beats; structured Remotion scenes remain the dominant visual language. |

## Encoded-frame checks

The following timestamps were decoded from the final MP4 after rendering:

| Approx. time | Check |
| --- | --- |
| 00:32 | Full-screen hook question has no company-card overlap. |
| 00:56 | Conceptual factory establishing image is labeled and does not masquerade as evidence. |
| 01:48 | Workflow gates, lower workflow rail, and caption zone are visually separate. |
| 04:10 | Caption keeps `FDE` intact. |
| 04:29 | Comparison question has its own full-screen statement. |
| 04:43–04:49 | Production, field-learning, and product nodes light in path-arrival order. |
| 05:10 | Ownership split uses a fixed media/analysis layout with protected caption space. |

## Automated checks

- Remotion project validation: pass.
- Video generation scripts test suite: 58 passing, 0 failing.
- Director-plan audit: pass.
- Editorial-layout engine tests: pass.

## Media decision

The director plan budgets generated video for at most one short atmospheric beat. A Seedance render was requested for the factory establishing beat, but the provider returned an account-overdue response. V4 therefore uses a clearly conceptual static fallback. This preserves the story and makes the delivery independent of an external render queue.

## Remaining deliberate constraint

The director plan is production-ready, while the reusable scene registry remains marked as planning/prototype until its templates have been independently exercised across more than this FDE film. V4 itself is source- and encoded-frame verified; the conservative registry label prevents this one successful film from being overstated as universal proof.
