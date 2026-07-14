# Mosslight v2 — motion QA

Status: approved as the preferred 60-second photo-essay sample, pending Aaron's taste review.

- Runtime: 60.000 seconds; H.264 1920×1080 at 30 fps with the unchanged original guitar track.
- Motion allocation: scenes 1–3 are static; scene 4 has a single centered 3% slow zoom-in. No image is panned vertically or horizontally.
- Transitions: three 2-second cross-dissolves carry all scene changes.
- Review: sampled contact sheet shows stable framing, no black edges, no aggressive crop, and no text or overlay.
- Workflow guardrail: `static` is now the renderer default; panning requires an explicit `allowPanning: true` override and is prohibited by the default photo-essay guidance.
