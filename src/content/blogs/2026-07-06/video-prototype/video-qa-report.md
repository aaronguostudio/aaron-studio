# Video QA Report: FDE Field Signal Prototype

## Deliverable

- Master: `fde-field-signal-prototype.mp4`
- Composition: `FdeFieldSignalPrototype`
- Duration: 84.10 seconds
- Video: H.264, 1920x1080, 30 fps, yuv420p
- Audio: AAC, 48 kHz, stereo
- File size: approximately 7.4 MB

## Workflow Gates

- Short-script audit: PASS.
- Storyboard planning audit: PASS with expected prototype warnings for scenes
  `s01` through `s04`.
- Remotion typecheck and source audit: PASS. The only warnings concern the
  pre-existing `TitleCard` and `GradientOverlay` timing checks.
- Prototype render: PASS for technical review.
- Production promotion: NOT RUN. Prototype and experimental scene statuses must
  remain unchanged until Aaron approves the complete viewing experience.

## Visual Review

| Scene               | Entry                                            | Peak                              | Exit                                             | Result |
| ------------------- | ------------------------------------------------ | --------------------------------- | ------------------------------------------------ | ------ |
| Prelude             | FDE is visible on frame zero                     | Music brightens the title         | Route hands into the signal rail                 | PASS   |
| Company convergence | Prior FDE field remains as bridge                | Four company cards converge       | Central question holds cleanly                   | PASS   |
| Deployment reveal   | Model card is already visible                    | 3D turn exposes operating layers  | Deployment gap resolves before the next scene    | PASS   |
| Consulting vs FDE   | Both comparison lanes are visible immediately    | Handoff and learning loop coexist | Old content recedes before ACTOR enters          | PASS   |
| ACTOR               | Five dim framework slots are visible immediately | Cards build with narration        | Recursive loop resolves into customer capability | PASS   |

The entry/peak/exit still sheet and a separate 17-frame contact sheet extracted
from the encoded master were inspected. Text fits its containers, captions stay
inside the safe area, and the final render contains no detected black segment
longer than 0.25 seconds at the selected threshold.

## Audio Review

- Narration: `aaron-pvc-identity-v1`, 80.88 seconds, no long silence, source QA
  approximately -16.94 LUFS.
- Music: original ElevenLabs Music API instrumental, song ID
  `xuarOSGzAdKuBw7D6PCF`; request and edit manifests are preserved.
- First mix finding: the source music's opening silence plus conservative gain
  produced 2.12 seconds below -45 dB. This failed the sound-led opening intent.
- Correction: trimmed source silence, extended the musical body to 84 seconds,
  strengthened the prelude, and kept the speech bed restrained.
- Final mix: approximately -16.95 LUFS, -3.81 dBTP, 3.10 LU loudness range.
- Final silence check: 0.35 seconds at the opening fade and 0.91 seconds at the
  final fade. Both are intentional.

## Product Review

The encoded master passes technical and visual QA. Human listening for musical
taste, emotional energy, narration/music balance on headphones and phone
speakers, and uninterrupted pacing remains Aaron's approval gate.

## Reusable Learnings

1. Plan Aaron's current production voice at roughly 110-115 words per minute,
   then lock motion only after real audio exists.
2. A meaningful first frame may begin quietly, but it must already communicate
   the scene's subject.
3. Fade old content before a new scene reaches the boundary; do not crossfade
   two complete editorial layouts on top of one another.
4. Inspect encoded-master frames in addition to source stills, especially for
   3D layers and font rasterization.
5. Generated music needs its own silence and ending inspection before it enters
   the video mix.
