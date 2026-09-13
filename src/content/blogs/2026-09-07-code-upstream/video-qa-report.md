## Current V5 review — 2026-09-08

Simplified full film: `video-v5.mp4` (8:00.833). Delivery: `delivery-v5/`; review: http://127.0.0.1:4332/film-v5.html. Exact V4 narration/music and timing; fewer words, larger type, no agenda or footer. Technical and sampled visual checks passed; author review remains pending. See `video-production/v5/qa-report.md`. Nothing published. Older records below are retained for comparison.

---

## Current V4 review — 2026-09-08

Full V4 master: `video-v4.mp4` (8:00.833). Current delivery: `delivery-v4/`; archive: `code-upstream-video-v4-review.zip`. Review: http://127.0.0.1:4332/film-v4.html. Technical and sampled visual QA passed; author listening remains pending. See `video-production/v4/qa-report.md` and `technical-qa.json`. No publishing authorized. Earlier V3 records below are historical and retained for comparison.

---

# Video V3 QA — sound direction B + voice B

Full 1920×1080 / 30 fps H.264/AAC master, 469.733 seconds.

Aaron selected the sound-direction B prototype and same-PVC voice B. The approved ending take is reused exactly at the raw asset level; the remaining narration uses the same candidate settings. Article, spoken script, illustrations, previous audio and V2 master remain unchanged.

Six musical cues, 143.7 seconds total. New inquiry, fieldwork and product-choice cues extend the selected chamber-electronic palette; the selected reflection and possibility cues return at the close. Four small additions bring measured sentence gaps to their target rather than stacking over existing TTS pauses.

The voice stem is retained at gain 1 in the mix. No sidechain or master compressor. Encoded loudness -16.95 LUFS, true peak -2.78 dBTP. Ending's final second is silent. Captions and scene boundaries use the shared word timing map; YouTube chapters were updated.

All automated technical checks pass. Forty-two encoded frames cover both sides of fifteen section boundaries, music entrances and inserted holds. All six contact sheets were inspected. Full ASR found no missing clause; minor article/phonetic spelling differences are recorded, and are not claimed as exact word-for-word audio equivalence.

Author preference applies to the B prototypes. Uninterrupted full viewing and headphone listening of V3 have not been performed by the agent or newly confirmed by Aaron. Nothing has been uploaded or published.

Evidence: `video-production/v3/technical-qa.json`, `time-map.json`, `sound-plan.json`, `asr-differences.json`, and `encoded-review/`.

## Complete delivery — 2026-09-08

Aaron now reports the new version is good across aspects and requests the complete film and follow-up materials, explicitly without publishing. The current V3 master already covers the full spoken script; it was copied byte-for-byte into `delivery/video.mp4`. This is not a new audiovisual render.

Full FFmpeg video+audio decode completed with exit 0. The standalone SRT previously used the earlier timing; it is now regenerated from the same final timeline as the burned-in captions. SRT and VTT each parse as 154 cues covering all 893 words, including the opening offset and inserted pauses. The original subtitle file is retained in the dated revision. The delivery archive passes its CRC integrity check; served master and subtitles match disk hashes.

The old Python preview server could not seek because it ignored byte ranges. The replacement localhost-only server returns correct 206 responses for bounded/open-ended/suffix ranges and 416 for an unsatisfiable range. Browser chapter seek to 04:00 now resolves to exactly 240 seconds with readyState 4 and no media error.

The package quality check passes. Timestamp warnings point to the unchanged script and retained v1 `video.mp4`; source-lock hashes and the explicit V3 canonical pointer establish the current dependency state. Complete human viewing remains the user's next step. No upload, scheduling, social post or deployment performed.
