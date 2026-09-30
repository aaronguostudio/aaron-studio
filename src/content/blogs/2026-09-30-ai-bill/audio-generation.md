# Audio Generation

Status: APPROVED (retimed)

- Profile: `aaron-pvc-identity-v1` (voice `R2DWp7zZuWmGxk3r8GIA`, eleven_multilingual_v2, speed 1.0)
- Source take: `audio.mp3` (584.0 s, -16.64 LUFS, -1.56 dBTP, 0 long silences); raw preserved as `audio-raw.mp3`.
- Listening review: Aaron heard the opening, middle and late 60-second samples on 2026-09-30 and chose "Pass, retime 1.05x" (voice identity, pronunciation and pacing accepted; length over the 7-8 min target).
- Production master: `audio-retimed-1.05.mp3` (556.2 s, -17.0 LUFS, -1.8 dBTP), made with ffmpeg `atempo=1.05` on the normalized take. Word timings and segment boundaries divided by 1.05 in `audio-timeline-retimed-1.05.json` (1,257 words).
- Unresolved: none. Score (if any) must be timed to the 556.2 s master, not the original take.

## Revision 2 (2026-09-30, after chart QA)

- Changed "Seventy-seven percent of my Astra cost" → "Seventy-eight" so narration matches the Pro-account chart (77.69%).
- The TTS cache key includes neighbor context, so a normal re-run re-voiced segments 3-5. Instead, the master was spliced from the approved take-1 segment files for every segment except "The Re-Read" (new take `narration-04-f1286b3d5fe4`, 73.0 s), then normalized (two-pass loudnorm I=-16, TP=-1.5, LRA=7) and retimed 1.05×.
- New master: `audio.mp3` 585.7 s (-16.7 LUFS, -1.5 dBTP) → `audio-retimed-1.05.mp3` 557.9 s (-17.0 LUFS, -1.8 dBTP). Timeline: `audio-timeline-retimed-1.05.json`. Take 1 preserved as `audio-take1-77.mp3`.
- Listening: the re-voiced 73 s segment has not been separately heard by Aaron; it will be reviewed in the unlisted upload before the video goes public.

## Revision 3 (2026-09-30, pacing after watching the unlisted v1)

- Aaron found the 1× YouTube playback slow. Diagnosis: 129 wpm source; pauses ≥0.25 s were ~22% of runtime (196 pauses, 97 over 0.6 s).
- Aaron heard two 68 s samples and chose "Trim pauses + 1.10x".
- Method: from the spliced 1.0× `audio.mp3`, 114 in-silence cuts cap in-sentence gaps at 0.42 s and section gaps at 0.80 s (31 s removed at 1×), then `atempo=1.10`. Words, voice and takes are unchanged.
- New production master: `audio-paced-1.10.mp3` 504.0 s (-17.0 LUFS, -1.7 dBTP), timeline `audio-timeline-paced-1.10.json`. Supersedes `audio-retimed-1.05.mp3` for video v2.
