# V7 sound and pacing review

Status: local experiment ready for author review. Technical and sampled visual checks passed. No publication.

## Result
- `video-v7.mp4`: 1920×1080, 30 fps, 15384 frames, 512.8 seconds (8:33), chaptered score.
- `video-v7-nomusic.mp4`: same visual edit with the unchanged-gain voice stem and inserted pauses.
- `video-sound-preview-v7.mp4`: 98-second montage of the two middle turns and the full ending.
- V6 files and renderer remain intact. The new pauses and music have not been marked author-approved.

## Sound direction
The old closing cue entered with only a one-second fade. Its code did not explicitly duck the voice, but the rapid music entry could mask the unchanged narration. V7 uses only music-side raised-cosine envelopes: 4–8 seconds in, 6–7 seconds out. There is no speech-triggered ducking, master compressor, limiter, vocal volume curve or time stretch.

Two new Google Lyria Clip cues — Turning the Page (29.675 seconds) and Common Ground (28.735 seconds) — accompany the existing Paper Moon opening and closing. Five score windows total 150.3 seconds, about 29% of runtime. Both new sources were checked for unwanted leading/trailing silence; no intervals over 0.2 seconds below -50 dB were found. Prompts and provider manifests are retained. This is an internal scored preview; commercial-use clearance is not asserted.

## Pacing direction
Three extra rests are inserted inside verified source silence: 3.2 seconds between the interview reflection and Aaron's project; 2.8 seconds between team concerns and a proposed shared exercise; 3.6 seconds before the conclusion. The existing natural gaps also remain. Approved lamp, shared-draft and plant-care illustrations carry the thought through each rest. These are deliberate still image beats, not claimed animation. No new narration or factual content.

## Verification
- Original bilingual articles, spoken script, and source MP3 hashes unchanged; all 1060 word strings preserved.
- Four contiguous source voice segments copied with exact PCM equality, gain 1.0. Only new silence is inserted; no source word or breathing sample is cut out.
- Ten windows in the final AAC master were regressed against the known voice/music stems. Largest estimated voice gain deviation: 0.0132 dB (limit 0.15 dB). See encoded-sound-qa.json. This corroborates the exact lossless-stem check; it is not a perceptual listening claim.
- Encoded integrated loudness -17.03 LUFS; true peak -3.91 dBTP; final-second RMS -240.0 dBFS. Ending fades completely inside the file.
- Renderer typecheck/static audit and production director/storyboard/evidence preflight pass; prior quiet-hold/template-classification warnings documented.
- Prototype review caught and fixed old captions flashing after the new pauses. V7 uses independently retimed captions, with the old 120 ms hold disabled. All 171 caption text groups retained.
- 117 frames sequentially extracted from 39 scenes. Inspected all scene midpoint sheets and all exact new boundaries, including before/after the fractional visual carry and the final frame. No observed black gap, stale subtitle flash, caption overlap or clipped bridge content in those samples.
- Updated draft chapter timestamps from the new scene timeline.

## Limits and decision
The agent inspected encoded frames and measured the sound, but did not perform a human uninterrupted viewing or headphone/phone-speaker listening session. Whether the pauses feel natural and whether the music sits well remains Aaron's acceptance decision. V6 is retained for immediate comparison or rollback. Do not promote V7 to canonical or publish it based only on these technical checks.


## Author acceptance — 2026-09-06

Aaron approved the completed package and explicitly requested publication. V7 is now the canonical approved video; the earlier pending-review text records the pre-acceptance QA state. YouTube upload awaits renewed OAuth authorization and confirmation of the older Paper Moon source record.
