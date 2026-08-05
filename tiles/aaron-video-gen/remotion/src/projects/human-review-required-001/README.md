# Human Review Required 001

Deterministic 23-second Remotion pilot at 30 fps.

## Compositions

- `HumanReviewRequired001Vertical` — 1080 × 1920
- `HumanReviewRequired001Landscape` — 1920 × 1080

Both compositions share `HumanReviewRequired001.tsx`; no center crop or
separate timeline is used.

## Timing

| Beat | Time | Registered template / recipe |
|---|---:|---|
| Real source video + QA | 0.0–7.8s | `image-sequence` / `crossfade` |
| Then Aaron watched it | 7.8–10.7s | `image-sequence` / `crossfade` |
| Two translated quotes | 10.7–14.8s | `editorial-statement` / `focus-shift` |
| Machine pass, human block | 14.8–16.5s | `editorial-statement` / `focus-shift` |
| Taste, trust, truth | 16.5–20.6s | `editorial-statement` / `focus-shift` |
| Release rule | 20.6–23.0s | `brand-end-card` / `crossfade` |

## Public assets

- `source-codex-demo.mp4` — exact copy of the previously delivered encoded demo
- `narration.mp3` — production narration, 19.505 seconds
- `music-selected.mp3` — selected AI-generated editorial score

Set `includeAudio` to `false` when rendering layout-only QA stills before the
score is present.

Final masters are written to `public/human-review-required-001/masters/`. The
delivery copies and publishable frame-zero covers live in
`src/content/shorts/human-review-required-001/`.
