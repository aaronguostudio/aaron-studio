# Visual & Sound refinement — 2026-09-09

Author direction: cover A approved. Previous voices rejected. American English only, natural and grounded without theatrical delivery. Improve material fidelity and purposeful camera motion in the 3D demonstration.

## Deliverables

- `review.html`: local review, served by `python3 serve.py` on port 8774.
- `assets/cover-approved.png`: approved cover A, unchanged.
- `audio/D.mp3`, `E.mp3`, `F.mp3`: same-text American voice auditions. Eric, Roger, Brian, respectively. Voice identities and exact requests retained in `audio/manifest.json`; original generated files preserved.
- `gripper-refined.mp4`: 18-second 1080p/24fps Cycles render; `blender/hero-4k.png`: 3840×2160 material still.
- `blender/gripper.py` and `.blend`: editable procedural model and animation. `render.py`: 64-sample adaptive GPU animation render and 128-sample 4K still.

## Visual changes

Irregular randomly packed mineral geometry replaces the former lattice. Twelve linked mesh variations produce 2,300 grains. The soft membrane has physical thickness and small surface relief, while the coupling, collar rings, and reinforced hose add manufactured detail. Studio lighting emphasizes material separation. A full shell introduces the device before an animated cutaway reveals its contents. A perspective camera slowly approaches and follows the lift, replacing the fixed orthographic view.

The demonstration is directed animation, not a calibrated granular simulation. Internal packing is not a physically simulated jamming solver. The particle gripper illustrates related granular behavior; it is not presented as an invention directly derived from singing-sand research. This production context belongs in the review and provenance, not as repetitive labels over the video.

## Voice treatment

All three voices have current provider metadata identifying their accent as American. Eleven multilingual v2, stability 0.55, similarity 0.75, style 0, speed 1. The text uses neutral conversational sentences. Auditions contain no music. Final measured loudness is recorded in `qa/voice-qa.json`; the three samples are within half a LU of each other. Technical checks do not substitute for the author's listening judgment.

## Scope

This refinement package does not replace the full 8:57 film or publish to YouTube. Cover choice is locked; narrator choice remains open until Aaron reviews the new auditions. Previous design and long-film packages remain available.
