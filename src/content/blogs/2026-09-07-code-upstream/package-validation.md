## Current V5 review — 2026-09-08

Simplified full film: `video-v5.mp4` (8:00.833). Delivery: `delivery-v5/`; review: http://127.0.0.1:4332/film-v5.html. Exact V4 narration/music and timing; fewer words, larger type, no agenda or footer. Technical and sampled visual checks passed; author review remains pending. See `video-production/v5/qa-report.md`. Nothing published. Older records below are retained for comparison.

---

## Current V4 review — 2026-09-08

Full V4 master: `video-v4.mp4` (8:00.833). Current delivery: `delivery-v4/`; archive: `code-upstream-video-v4-review.zip`. Review: http://127.0.0.1:4332/film-v4.html. Technical and sampled visual QA passed; author listening remains pending. See `video-production/v4/qa-report.md` and `technical-qa.json`. No publishing authorized. Earlier V3 records below are historical and retained for comparison.

---

# Package validation — complete V3 delivery

Decision: PASS for local complete-film review. Not release approval.

Canonical master: `video-v3.mp4`, 469.733333 seconds, 1920×1080 / 30 fps. `delivery/video.mp4` is a byte-identical copy. The master, accepted articles, script, selected voice and illustrations are preserved.

Serious package gate with images and distribution: PASS. Its age warnings are reviewed: the old `video.mp4` is retained history; source hashes confirm that the script and article prose are unchanged. The authoritative current video pointer is in package-state.json.

Standalone subtitles now match V3: 154 cues, 893 words; SRT/VTT parse successfully. Full AV decode, ZIP CRC, delivery hashes and localhost asset HTTP checks pass. The dedicated page supports chapter navigation and file downloads; the server supports byte ranges for seeking.

Author says the current version is good across aspects. Complete delivery is prepared for final viewing; publication is explicitly outside the current authorization. See `revisions/final-film-delivery-07/delivery-checks.json` and `video-qa-report.md`.
