# Design candidate QA

Status: technical checks passed; author selection pending. This does not promote a visual or narration baseline.

| File | Seconds | Full decode |
|---|---:|---|
| lab-revision.mp4 | 18.05 | pass |
| gripper-study.mp4 | 18.00 | pass |
| audio/A.mp3 | 36.22 | pass |
| audio/B.mp3 | 35.94 | pass |
| audio/C.mp3 | 42.63 | pass |

- Remotion TypeScript check passed.
- Laboratory animation: four temporal samples inspected; shortened raised gate to keep it clear of the title. Equipment labels separated from geometry. Conservative grain bounds checked over all 540 frames: minimum clearance 1.1 px.
- Blender: 432 frames rendered, camera widened to preserve the raised bag silhouette, release path adjusted to rise before fully relaxing. Contact and release geometry sanity checks passed; not a physics validation. Nine decoded temporal samples inspected. Contact/lift/release visibly present.
- All three normalized voice audition files fully decoded and meet the true peak gate. No human listening approval is claimed.
- Browser: loaded covers at display and 320 px sizes, activated and paused voice A, jumped to gripper lift and observed playback. HTTP byte-range checks return 206 with requested byte count for audio and 3D video.
- No full-film replacement, publishing or global voice changes. Original review server restarted when found unavailable.
