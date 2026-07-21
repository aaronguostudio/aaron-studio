# FDE Guizang-Hybrid Full Film: QA Report

## Render

- Output: `fde-guizang-hybrid-full-private.mp4`
- Runtime: 07:31.67
- Video: H.264, 1920 x 1080, 30 fps
- Audio: AAC stereo, 48 kHz
- Narration: approved FDE V5 voice track, beginning at 00:02.50
- Music: approved FDE full-film score
- Distribution: private local review only; not published or uploaded.

## Visual Checks

The source composition and final encoded MP4 were inspected at the following points:

| Timestamp | Frame | Result |
| --- | --- | --- |
| 00:01 | `qa/encoded-001-cover.png` | Immediate branded cover, title and subtitle are present without a blank opening frame. |
| 03:22 | `qa/encoded-202-workflow.png` | Editorial workflow layout holds a dedicated title axis; image and stage cards do not collide. |
| 06:30 | `qa/encoded-390-actor-loop.png` | ACTOR cards remain aligned; the recursive connector appears after the cards establish. |
| 07:19 | `qa/encoded-439-final.png` | Closing operating rule and Aaron Guo signature card are legible and complete. |

## Rules Carried Forward

1. Start with a completed cover composition, not an empty title field.
2. Choose from finite layout families before animating a scene.
3. Reserve a full reading axis for long titles; never force them into an incidental side column.
4. Reveal diagram connectors only after the connected objects are visually established.
5. Treat captions as a protected lower-third system, not as a floating visual element.
6. Use the editorial paper/ink palette for explanation-heavy sequences; change the visual field only at intentional chapter cuts.
