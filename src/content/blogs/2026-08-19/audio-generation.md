# Audio Generation — Human Listening Decision

## Technical QA (machine-verified, 2026-08-15)

- Profile: `aaron-pvc-identity-v1` (voice R2DWp7zZuWmGxk3r8GIA, eleven_multilingual_v2, stability 0.5 / similarity 0.75 / style 0.5 / speaker boost, speed 1.0, mp3 44.1kHz 192k)
- Duration ~603s (10:03); loudness -16.64 LUFS, true peak -1.43 dBTP; long silences: 0
- Files: audio.mp3 (normalized review copy), audio-raw.mp3 (untouched concat), three 60s samples (opening / middle / late), audio-generation-manifest.json (hashes + per-slide records)

## Transcript Fidelity (checked against youtube-script.md)

- All claims, numbers, and framework labels preserved verbatim: 30 tasks / factor of seven; 1/50th–1/120th (launch-week qualified); 44 events / 3 visible; 178 green tests; 27 checks; 12,293 commits / 64 days; worktree 210 / codex 209; five-line assertion; cache trio; rent-churn-own sort.
- One noted spoken rounding (present in the script itself, not introduced by TTS): top contributor "five thousand of them" for 5,235 — rounds down; defensible in speech, flag if you want "more than five thousand" instead.
- Duration 10:03 vs brief target 7–8 min: the spoken rewrite added natural pauses; judge pacing in the samples before deciding whether to tighten slides 2/4/6.

## Aaron's Listening Review — APPROVED

Reviewed via the three 60s samples (opening / middle / late) and full transcript; approved in session 2026-08-15 ("没问题，渲染"):

- [x] Voice identity (sounds like the approved Aaron profile)
- [x] Naturalness (no TTS artifacts, no odd emphasis)
- [x] Pronunciation (DeepSeek, Ronacher, Codex, harness, cache)
- [x] Pacing (speed 1.0 at 10:03 accepted)
- [x] Authority (measured, engineering-minded, not salesy)
- [x] Long-form comfort

Decision: APPROVED — rendering unblocked.

## Unresolved Issues

- None. The 5,235→"five thousand" spoken rounding and the 10:03 duration were both surfaced in review and accepted as-is.

## Render-Time Regeneration Record (2026-08-15)

- The render re-segmented slides for [IMAGE:] switches, invalidating the TTS cache; all sections regenerated with the IDENTICAL approved text and profile (word-stream equality against this transcript machine-verified before rendering).
- Render 1 defects caught by post-render QA (word-timing inspection, not by ear): slide "Who Actually Built This" truncated (the conversational-rewrite step emitted 4 segments for a 3-segment slide and assembly dropped the 4th — the day-two-note and closing paragraphs); slide "The Test..." leaked a literal "---SEGMENT---" delimiter into TTS from a stale run-1 rewrite cache.
- Deterministic fix applied directly to the rewrite cache (segment merge + trailing-delimiter strip across all cached rewrites), bad narration caches deleted, re-render issued. Only the two affected slides re-billed TTS.
- Lesson for the skill (promote later): after any render, verify each narration JSON's final words against the approved transcript — the rewrite step can silently drop or leak segments when segment counts drift.

## v2 Full-Stream Verification (2026-08-16)

- A full word-stream comparison (not tail-only) found a THIRD failure mode in the v1 render's audio: four slides (Winner/44-3/Catch/Hour) had trailing segments DUPLICATED (~2 minutes of repeated narration) — the assembler repeats tail segments when the rewrite chunk count is below the segment count. The v1 video (12:42) contains these duplicates; it is baseline-only.
- Clean master regenerated: `audio-v2.mp3`, 600s narration, -16.60 LUFS / -1.60 dBTP, 0 long silences; all nine sections verified word-for-word identical to the approved script (four sections are fresh takes under the approved profile with identical text; samples available on request).
- Permanent machine gate added: `tiles/aaron-video-gen/scripts/verify-narration-fidelity.ts` — selects per-slide cache takes by full word-stream equality, exits 1 with a diff on any mismatch. Verified green on the clean set and verified to turn red against a mismatched script. Run it after EVERY audio or render pass, before QA.
- The v2 film's master timing source is the verified take set (599.7s narration; timing table in scratchpad/timing-v2.json).
