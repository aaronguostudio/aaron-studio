# V5 full-film QA

PASS for local author review; not author acceptance or publication approval.

Full film: 8:00.833, 1920×1080 / 30 fps, H.264 + 48 kHz AAC. Master SHA-256: `9b5debc0ea6a734f16581bd58fa159ee047e2856ea0f2eadbfea777a85b1c56b`.

Visual revision: removed persistent left agenda, competing chapter/page titles, repeated outcome sentence, top author chrome and every bottom provenance/footer line. Chapters have number and title only; body pages have a short chapter cue and one primary message or a headline with one content group. Hero text is 92px, headings 72px, body 48–60px, captions 34px. All reading text stays fully opaque. Primary contrast 13.1:1. Average 10.8 words per non-brand frame excluding captions, maximum 21.

Inspected 127 sequentially decoded frame samples across 11 contact sheets: every scene midpoint, six chapter transition sequences, and every flow connector at five progress points. No missing content, caption collision, unreadable emphasis or layout overlap observed. Five full-resolution stress frames and the 85.4-second prototype's 20 frame samples also reviewed. A flow baseline defect was corrected before the full render; text peers now share equal fixed-height slots.

Audio: V4 and V5 scored AAC hashes match exactly; V4 and V5 voice-only AAC hashes also match. No TTS regeneration, remix or timing change. Therefore the verified V4 audio measurements remain applicable: −16.96 LUFS, −3.14 dBTP. No new listening quality claim is made. All 154 captions / 893 words use the unchanged V4 clock, and all scene boundaries and chapter holds match V4.

Full AV decode, source locks, registered layout geometry, TypeScript/Remotion audit, planning and production preflights, delivery hashes and ZIP CRC passed. HTTP range requests return 206. Browser check is recorded in package-state after page inspection.

Limit: sampled visual and technical review is not uninterrupted human watching or listening. The author chooses whether this simpler direction meets the intended quality. V4 remains available for comparison. Nothing has been published.

Evidence: technical-qa.json, audio-stream-check.json, readability-audit.json, full-frames/frames.json, source-lock.json, prototype-review.md.

Phone delivery: V5 cloud copy SHA-256 matches the master. Foundation confirms uploaded=true, uploading=false and no upload error. Prior cloud versions remain intact. See icloud-copy.json.
