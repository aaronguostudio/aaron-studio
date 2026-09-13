# Extended singing-sands video QA

Status: technical and sampled visual checks passed; new edition awaits author review.

All four final MP4s fully decoded with FFmpeg error-on-failure. H.264/AAC, 30 fps; full film 1920×1080 and shorts 1080×1920. Production preflight passed, TypeScript and renderer source checks passed with unrelated pre-existing warnings. English renderer text contains no Chinese characters.

| Output | Seconds | LUFS | True peak dBTP |
|---|---:|---:|---:|
| film.mp4 | 536.77 | -16.87 | -3.95 |
| shorts/SandVoiceShort.mp4 | 52.37 | -16.80 | -3.95 |
| shorts/SandLabShort.mp4 | 50.17 | -15.68 | -4.45 |
| shorts/SandGripperShort.mp4 | 40.73 | -17.18 | -4.44 |

Visual review: scored 90-second engineering prototype; nine distinct full-film stills; actual decoded portrait frames; final-film contact sheet. Corrected vacuum annotation overlap. Music chapters and narrated sections were aligned to measured word timing. True NPS sound excerpts remain unscored. No claim of human listening approval is made for new lines or generated music.

Browser review: loaded local review page, jumped to the gripper chapter and observed corresponding actual playback; played laboratory short; range request returned 206 with exactly 1000 requested bytes. Review page prevents overlapping player audio. Narrow-grid columns use minmax(0,1fr).

Scientific boundaries: illustrative waves, particles, silos and gripper; sources listed in fact pack and review page. Granular gripper is not claimed as a direct singing-sand invention. Registry repetition warnings reflect a shared project capability, while the rendered scenes contain different experiments, diagrams, photographs and chapter cards.

Publication: none. Active music plan verification is pending following a 401 subscription lookup. Chinese edition is future scope. Hashes and final metadata are in qa/artifacts.json; short extraction boundaries and master hash in shorts/manifest.json.
