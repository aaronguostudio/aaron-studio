# Audit: Video production — aaron-video-gen and the path to 老高/小林说-level explainers

> Generated 2026-08-22 by a multi-agent audit of tiles/blog-production and its chain. Evidence cites working-tree file:line at audit time.

## Summary

The video skill is a serious, unusually disciplined editorial-motion doctrine (director plan, storyboard, narration-fidelity gate, loudness gate, style baseline) wrapped around a renderer that does not actually implement that doctrine as reusable code. The golden sample (08-19, 10:06) was produced by a 1,582-line bespoke composition (remotion/src/LedgerHarnessFilm.tsx) that imports zero lines from remotion/src/editorial/, was rendered by an ad-hoc `npx remotion render LedgerHarnessFullFilm` that no script in the repo issues (scripts/main.ts still renders the legacy `SlideshowVideo`, remotion-render.ts:215), with scene timing copied from a scratchpad file that is not in the repo and a music envelope hand-written in vol-expr*.txt. Of the 16 registered scene templates, only 4 have any implementation and 9 exist solely as JSON vocabulary; the next film therefore costs roughly what this one did (~10 hours of agent time on 08-15 from treatment 15:35 to v3 23:18, after a rejected 12:42 legacy render at 14:38) because nothing amortizes. Measured against the stated 老高/小林说 target the film is the opposite product: 57% of one-second intervals are pixel-identical to the next, 452 of 606 sampled seconds have under 5% non-canvas pixels, there are 13 large visual changes in ten minutes, ffmpeg scene detection at threshold 0.03 finds zero cuts, and the frames at 60s/180s/450s are a single line of serif text on cream. That calm is by design (motion-craft-gate.md:63 "default to no overshoot", editorial-motion-system.md:27 "quiet frames give the viewer time to think") and has now been promoted to the mandatory baseline for the next film (video-style-baseline.md:10), so the skill is actively locking in the style that contradicts the target. There is no Chinese-narration path at all (zero hits for zh/Chinese/CJK across SKILL.md, references, config, renderer fonts; whisper hard-defaults to "en"), the script audit measures banned words and brief headings rather than retention density (script-audit.ts:19-31, retention beats only a warning at :84), and packaging stops at title/description/tags/thumbnail (no SRT upload, pinned comment, playlist, Shorts cut-down). The strengths worth protecting are real: the narration-fidelity gate, the audio loudness/ending gates, the director-plan/fact-pack provenance discipline, and the baseline-review ritual. The decision Aaron must make is whether ledger-editorial is the brand or whether he wants a second "story-explainer" treatment family with its own density rules, co-host option, Ken Burns over illustrated scenes, and ZH narration; the current doctrine cannot gate both.

## Strengths

- **Narration-fidelity gate caught three silent audio failure modes and became a permanent machine check** — tiles/aaron-video-gen/scripts/verify-narration-fidelity.ts:1-24 documents dropped, leaked-delimiter, and duplicated segments found 2026-08-15/16; src/content/blogs/2026-08-19/audio-generation.md:41-43 records ~2 minutes of duplicated narration in v1 that tail inspection missed. Gate exits 1 on any word-stream mismatch.
  - Why it matters: This is the model for the whole skill: a failure in production converted into a cheap deterministic gate. It is the single most productizable piece of QA in the tile.
- **Audio technical gates are real, scripted, and measured on the encoded master** — scripts/audio-review.ts:68 loudnorm I=-16 TP=-1.5 LRA=7; :245 silencedetect -40dB/2s; references/video-qa.md:188-198 requires ending to reach true zero inside the file (caught on 08-19). Measured video-v3.mp4: -16.7 LUFS integrated, -4.1 dBTP, LRA 4.1, one silence >1.5s.
  - Why it matters: Audio is where TTS films usually embarrass themselves. This part is at professional broadcast-delivery standard already.
- **Director-plan / fact-pack / asset-decision-log discipline gives every visual a provenance and a fallback** — src/content/blogs/2026-08-19/director-plan.json: 10 beats each with entry_visual, first_visual_change_sec, asset_provenance, sound_cue, fallback; asset-decision-log.md lists every non-typographic asset with rights and a text-only fallback and records rejected candidates. director-plan-audit.ts blocks when style_reference is absent.
  - Why it matters: This is what separates a repeatable system from one-shot generation. It is the layer that would survive a change of renderer or style.
- **Style-baseline ritual forces a conscious inherit/deviate decision per film** — src/content/strategy/video-style-baseline.md:27-32 protocol; SKILL.md:34 and :412 make the baseline review mandatory and auditable; package-state.json records promotion ("visual_style": ledger-editorial-v1, "promoted").
  - Why it matters: Prevents style drift across films and is the right mechanism for the moment Aaron decides to open a second treatment family.
- **Post-publication corrections were propagated across nine surfaces with the gate re-run** — video-qa-report.md:45-53: narration regenerated, 27 scene times remapped, captions regenerated, chapters recomputed, re-mixed, fidelity gate PASS, final loudness re-measured.
  - Why it matters: Shows the pipeline can absorb a late factual correction without a from-scratch rebuild, which is what a productized system must do.

## Gaps

### [high/structure/L] The golden film is a one-off: bespoke 1,582-line composition that uses none of the reusable editorial system

- Evidence: remotion/src/LedgerHarnessFilm.tsx:1-19 imports only remotion + ./data/*; `grep -c editorial/` returns 0. It defines its own tokens (T at :37), SAFE_L/SAFE_W (:51-54), LedgerRow/MarginLabel/SerifTitle/Connector/MapNode primitives (:85-284) and 26 hand-written scene components S01..S26 (:373-1398). Prior films repeat the pattern: FdeFullFilmV1.tsx 3,148 lines, AuthorityBoundaryLongformVideo.tsx 1,889 lines; 7,542 LOC across four bespoke films; Root.tsx is 692 lines registering ~40 compositions.
- Recommendation: Extract the ledger primitives (LedgerRow, MarginLabel, SerifTitle, EvidenceStill, Connector, MapNode, HeaderRail, CaptionBar, SceneHost) into remotion/src/editorial/ledger/ as the first real implementation of the registry, parametrised by a theme token object so ledger-editorial and clean-indigo are two themes of one component set. Then make the next film a data file (scenes.json + captions.json) driving those components, not a new .tsx.

### [high/structure/M] Scene registry is a planning vocabulary, not code: 9 of 16 templates have zero implementation

- Evidence: config/scene-registry.json lists data-hero, split-comparison, progressive-cards, process-flow, timeline, quote-source as prototype; grep for those ids across remotion/src finds no implementer (only harnessTeardownScenes.ts data labels for image-sequence/editorial-statement/system-map/brand-end-card). storyboard-audit.ts validates storyboards against this registry, so a film can "pass" using templates that do not exist.
- Recommendation: Add a `component` field to each registry entry pointing at a real export, and make remotion-audit.ts fail when an `available` template has no component. Implement the three the target format needs most first: timeline, split-comparison, quote-source.

### [high/structure/M] No script in the repo can reproduce the golden render; the documented command produces the rejected legacy slideshow

- Evidence: SKILL.md:38-48 "standard command" runs main.ts which renders composition "SlideshowVideo" (scripts/remotion-render.ts:215); that path produced the 12:42 v1 (video.mp4, 24fps, 08-15 14:38) which video-treatment.md:5 says was editorially rejected. No file under tiles/ or the package references LedgerHarnessFullFilm; audio-generation.md:44 says timing came from "scratchpad/timing-v2.json" (not in repo); music-score/vol-expr*.txt are hand-written ffmpeg volume expressions with no generator.
- Recommendation: Write scripts/render-film.ts that takes a package dir, reads video-storyboard.json + verified narration manifest, generates the scenes/captions data modules, renders the named composition, applies the music envelope from a JSON cue map (like 08-02's sound-cue-map-v5.json), and muxes. Delete or quarantine the SlideshowVideo path from the "standard command" block.

### [high/craft/M] Measured visual density is slide-like and contradicts the skill's own pacing rules and the 老高/小林说 target

- Evidence: Measured on video-v3.mp4 at 1 fps / 192x108 gray: 346 of 605 one-second intervals have mean abs diff <0.5/255 (57% static); 452/606 seconds have <5% non-canvas pixels (mean ink coverage 7.4%, median 3.5%); 13 intervals with diff >8; ffmpeg select=gt(scene,0.03) finds 0 cuts in 606s; longest static run 9s at 420s. Frames at 60s/180s/450s are one serif line plus chrome on cream. Yet youtube-video-language.md:145-146 demands a beat every 3-8s (dense) / 8-12s (calm), and video-storyboard-audit.md:13-29 logged 17 warnings (scenes over template max duration, 9-14s beat gaps) that did not block.
- Recommendation: Decide explicitly (ADR) whether ledger-editorial is the brand or a calm mode. If the target is story-explainer density, create a second treatment family ("illustrated-story") with its own rules: continuous slow camera (Ken Burns/parallax) on every illustrated scene, a visual change every 4-6s, 2-3 layers per frame. Keep ledger-editorial for argument essays. Do not try to retrofit one gate for both.

### [high/product/L] The Remotion+stills model can deliver most of the target format, but the skill forbids the cheapest wins

- Evidence: SKILL.md:59 "Images: Static within slides (no Ken Burns)"; motion-craft-gate.md:63 "default to no overshoot or bounce"; editorial-motion-system.md:256 anti-pattern "using music continuously". Achievable with current stack: Ken Burns/parallax on AI illustrations (trivial frame-driven interpolate), character continuity via ai-video-lab's "Character Bible Plus Shot" mode (tiles/ai-video-lab/SKILL.md:35-37), 5-10s AI b-roll inserts via the pre-extracted image-sequence rule (director-pass.md:105-112) which has no script. Needs a different model: co-host dialogue (parse-script.ts has no speaker field), 15-30 min runtime (TTS cost ~3x, render ~3x), on-screen persona.
- Recommendation: For an illustrated-story family: (1) register `illustrated-scene` template with mandatory slow camera + 2-layer parallax, (2) add a character-bible step to blog-illustrate/ai-video-lab so a recurring narrator avatar and scene cast stay consistent across 30-60 stills, (3) write scripts/extract-clip-frames.ts implementing the image-sequence rule so Seedance/Kling inserts are deterministic, (4) add optional `[SPEAKER:]` to the script format and a second voice profile for a co-host.

### [medium/product/M] max_generated_video_ratio: 0 is a capability gap presented as principle

- Evidence: director-plan.json:19-20 sets generated video to 0; asset-decision-log.md:20 "cost and fragility unjustified"; director-pass.md:51 allows 10-15%; licensed-footage-insert is still `prototype` (scene-registry.json:27-37); no script exists for the "extract a fixed-rate image sequence" fallback; ai-video-lab is a separate lab tile not wired into the storyboard/asset-plan flow (tiles/ai-video-lab/SKILL.md:8 "a creative lab, not a publishing autopilot").
- Recommendation: Wire ai-video-lab output into asset-plan.json as `generated-video` beats with prompt, song-id-style provenance, and an auto-extracted image sequence; run one 8-second insert through the full preflight on the next film so the budget can be raised on evidence rather than fear.

### [high/product/L] No Chinese-narration or Chinese-edition path exists despite a bilingual article and a Chinese-language target format

- Evidence: grep -i "chinese|中文|zh-|mandarin" across SKILL.md, references/, config/ returns nothing; scripts/captions.ts:17 language default "en"; rewrite-narration.ts prompt is English-only; LedgerHarnessFilm.tsx:47-49 fonts are Georgia / Helvetica Neue / SF Mono with no CJK fallback; voice-profiles.json has only an English clone (selection_reason :20); aaron-voice-profile.md:42 "Use this profile for Aaron's English blog narration". The package has deepseek-harness-teardown-zh.md but no ZH script/audio.
- Recommendation: Add a ZH lane: (1) record a Mandarin PVC sample set using the existing voice-clone-workflow.ts kit, (2) add `language` to voice profiles and script frontmatter, (3) CJK font stack + caption line-length rules (ZH captions need ~14-18 chars/line, larger size), (4) whisper/ElevenLabs alignment with language passed through, (5) a youtube-script-zh.md produced by blog-write from the ZH article, not a translation of the EN script. Run the first ZH edition as a re-timing of an existing film to isolate the language problem from the visual problem.

### [medium/craft/M] Voice delivery is flat by configuration and has no prosody controls; the listening gate is three 60-second samples

- Evidence: voice-profiles.json:12-16 stability 0.5 / style 0.5 / speed 1.0 on eleven_multilingual_v2; measured pace 110-115 wpm (aaron-voice-profile.md:50-55); audio-generation.md:17 approval from three 60s samples; tts.ts exposes no pause/emphasis/break markup and the script format has no delivery annotations; the v5 "editorial energy" candidate has sat at "pending V5 listening review" since 2026-07-11 (voice-profiles.json:36).
- Recommendation: Close the v5 decision. Add a light delivery markup layer to youtube-script.md (pause, emphasis, question lift) compiled per provider (ElevenLabs v3 tags or SSML-like breaks), and add an "energy" metric to audio-review.ts (pitch variance / pause distribution per minute) so delivery can be compared numerically across takes. For a story channel also test a second, warmer profile for asides.

### [medium/measurement/S] Script audit measures banned words and headings, not retention; its duration model contradicts the voice profile

- Evidence: script-audit.ts:19-31 banned patterns; :84 retentionBeats<3 is only a warning; :52 estimates duration at 150 wpm, producing "Estimated duration: 515s" (youtube-script-audit.md:5) for a script that ran 597s; aaron-voice-profile.md:54 says plan at 110-115 wpm. video-brief.md:48-65 beat map was written for a 7:25 film and still sits beside a 10:06 film; video-brief.md:103 "20-30 unique images with switches every 15-20 seconds" contradicts the treatment that used 4 stills.
- Recommendation: Rewrite script-audit.ts to (a) use the calibrated wpm from the selected voice profile, (b) map each retention beat in the brief to a script paragraph and fail when any 35s window (at calibrated pace) has no beat, (c) check the cold open contains the title promise nouns within the first 120 words, (d) flag brief/treatment contradictions on image count. Make the brief's beat map timestamps derive from the verified narration timings post-audio.

### [high/automation/M] QA is prose-gated and manual where it could be pixel-measured; storyboard gates check JSON intent, not the encoded master

- Evidence: storyboard-audit.ts:372-384 computes beat gaps from storyboard beats, not frames; video-qa.md:64-92 contact sheets, 25% playback, sequential strips are manual; video-qa-report.md:16-19 "27/27 rendered and inspected at 0.34 scale"; no script exists for frame-diff density, caption safe-zone pixel check, first-change-within-1s on encoded frames, black-frame at chapter cuts, or end-silence (done by hand in QA report :43). Existing automation: audio-review.ts, production-preflight.ts, sprite-asset-audit.ts, verify-narration-fidelity.ts.
- Recommendation: Add scripts/encoded-master-audit.ts: 1-fps gray sample → per-second diff and ink coverage, static-run length, big-change count, first change within 1s of each scene start (from storyboard), luma at chapter boundaries (black/double-exposure), caption band occupancy vs protected zone, end-tail RMS, and a density score per scene compared to its intensity. Emit the numbers into video-qa-report.md. Keep eyes for: typography taste, metaphor legibility, thumbnail, full watch.

### [medium/structure/S] SKILL.md is two generations of pipeline in one 775-line file

- Evidence: SKILL.md:38-60 and :219-392 document the legacy slideshow flags (1.2s fade/slide/wipe/flip transitions :58, progress bar :329-330, `--fps 24` default :260, `[IMAGE:]` markers :59) that video-style-baseline.md:21-25 rejects; :61-210 and :394-737 describe Video 2.0. SKILL.md:34 says do not fall back to the legacy renderer, while the "Recommended Workflow" block invokes exactly that renderer.
- Recommendation: Split: SKILL.md ≤250 lines (Video 2.0 stages, gates, commands), references/legacy-slideshow.md for the old path, references/audio-pipeline.md for TTS/caching/voice flags. Every command block in SKILL.md must be one that produces a baseline-compliant film.

### [medium/product/M] Music is a per-film hand-built score with unresolved rights and no reusable cue system

- Evidence: music-score/generate.mjs: full-length Eleven Music request failed, two 302s/305s segments stitched at 301.6s; vol-expr.txt/v3/v4 are hand-written ffmpeg volume expressions; video-qa-report.md:27 "Confirm account standing before YouTube publication; until confirmed, treat the scored master as publication-gated" while the film is live; asset-library search returned 5 candidates all `needs-verification` (:24).
- Recommendation: Record the Eleven Music commercial-rights determination once in asset-library with the plan tier and date, then treat generated scores as library assets (register score-a/score-b). Replace vol-expr hand files with a sound-cue-map.json (08-02 already has sound-cue-map-v5.json) consumed by the render script. Build a small reusable stem set (cello bed, felt piano, pulse, held chord) so scores are assembled, not regenerated, per film.

### [medium/product/M] Packaging stops at upload: no SRT/caption upload, pinned comment, playlist, Shorts cut-down, or localisation

- Evidence: tiles/aaron-yt-pipeline/scripts/youtube-upload.ts supports title/description/tags/category/language/privacy/schedule/thumbnail/make-public only (grep for caption|srt|playlist|comment|localizations returns nothing beyond defaultLanguage :132); package contains no .srt/.vtt; captions exist only burned-in (harnessTeardownCaptions.ts). No shorts cut-down artifact in the package despite knowledge-shorts/music-shorts tiles existing. End screens/cards cannot be set via Data API and need a manual Studio checklist.
- Recommendation: Extend youtube-upload.ts with captions.insert (export the phrase captions as SRT from the caption data; ZH track later), commentThreads.insert for a pinned comment with the article link, playlistItems.insert, and a printed manual checklist for end screen + cards. Add a `shorts-cut.md` stage that picks 2-3 45-60s vertical excerpts from the storyboard for the short tiles.

### [medium/measurement/S] Baseline promotion happened before any audience measurement

- Evidence: package-state.json: video published, postmortem "pending"; postmortem.md:15-19 Actual 24h/7d pending; video-style-baseline.md:10 already says ledger-editorial-v1 is "accepted for the next serious editorial video". No retention/AVD data appears anywhere in the repo for 08-02 or 08-19.
- Recommendation: Make baseline promotion require a 7-day YouTube Analytics pull (AVD, 30s retention, CTR) recorded in postmortem.md; add scripts/yt-analytics.ts using the Analytics API. Compare the two published films' retention curves against the storyboard to learn whether calm pages actually lose viewers.

### [low/quality/S] Video encode bitrate is very low for 1080p delivery

- Evidence: ffprobe video-v3.mp4: h264 1920x1080 30fps video stream 208,872 b/s (total 468 kb/s). The cream canvas compresses well, but fine serif strokes and mono text will band/smear after YouTube's re-encode at this input quality.
- Recommendation: Render with CRF ~18 (or target 8-12 Mb/s) and consider a 4K upscale for typography-led films so YouTube assigns the VP9/AV1 ladder; add bitrate to the technical checks in video-qa.md.

## Metrics observed

- SKILL.md: 775 lines; references/: 11 files, 1,558 lines; scripts/: 47 files (23 .ts + tests); templates/: 7; scene-registry.json: 16 templates (5 available, 9 prototype, 2 experimental), 19 motion recipes (7 available)
- remotion/src: 44,042 total lines; LedgerHarnessFilm.tsx 1,582 lines with 0 imports from editorial/; editorial/ = 4 files, 1,118 lines; Root.tsx 692 lines; four bespoke full films total 7,542 lines; package.json deps remotion ^4, react 19, ogl
- Golden film video-v3.mp4: 606.25s, 1920x1080, 30fps, h264 video 208,872 b/s, aac 48kHz stereo, -16.7 LUFS, -4.1 dBTP, LRA 4.1 LU, 1 silence >1.5s; 27 storyboard scenes; 3 registry template ids used (+brand-end-card); 4 illustrative stills; 0 generated video
- Density measurement (1 fps, 192x108 gray): 57% of second-to-second intervals static (diff <0.5/255); 452/606 seconds <5% non-canvas pixels; mean ink 7.4%, median 3.5%; 13 intervals with diff >8; longest static run 9s; ffmpeg scene detection at 0.03 threshold: 0 cuts
- Production timeline 2026-08-15: audio.mp3 13:04 → legacy v1 render video.mp4 14:38 (12:42, 24fps, rejected) → video-treatment.md 15:35 → prototype 16:02 → video-v2.mp4 21:58 → video-v3.mp4 23:18; upload 08-16; .video-gen-cache holds 82 files; package dir 600 MB
- Script: 1,408 words, audit estimated 515s at 150 wpm, actual narration 597s (~115 wpm); storyboard-audit: PASS with 17 warnings; director-plan-audit: PASS; video-brief retention map planned 7:25 vs actual 10:06
- Voice: one profile aaron-pvc-identity-v1 (stability 0.5 / style 0.5 / speed 1.0, eleven_multilingual_v2); v5 candidate pending since 2026-07-11; ZH mentions in tile: 0
- youtube-upload.ts capabilities: title, description, tags, category, language, privacy, schedule, thumbnail (auto-resize >2MB), make-public; no captions/playlist/comment endpoints
- Prior baseline film 2026-08-02: 584s; its video-longform/ QA dir holds 4 contact sheets, 3 prototypes, 11 QA subdirs, sound-cue-map-v5.json

## Open questions

- Is ledger-editorial the brand (a calm, typographic argument-essay channel) or a stepping stone? The 老高/小林说 target and the current motion-craft doctrine are mutually exclusive; which one should the next film's gates enforce?
- Is a Chinese-language YouTube edition a real goal with a Mandarin voice clone, or is the Chinese audience served by the ZH article only? Would Aaron record a Mandarin PVC sample set?
- Would Aaron accept an on-screen persona (illustrated narrator avatar, or a second co-host voice) or must the channel stay faceless and single-voice?
- What was the actual wall-clock and API cost of the 08-19 film (TTS regenerations, Eleven Music, GPT-image stills, agent hours)? The repo shows timestamps, not cost.
- Has the Eleven Music commercial-rights confirmation flagged in video-qa-report.md:27 been completed? The film is public with the scored master.
- What do the YouTube Analytics retention curves for 08-02 and 08-19 show at the calm pages (quote page, catch chapter)? No analytics data exists in the repo.
- Which target runtime is wanted: keep 10 min, or go to 15-30 min like the references (which triples TTS/render cost and raises the density problem)?
