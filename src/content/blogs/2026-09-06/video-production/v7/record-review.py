from pathlib import Path
import json,hashlib,datetime
p=Path(__file__).resolve().parents[2];out=Path(__file__).resolve().parent;sound=json.loads((out/'sound-plan.json').read_text());qa=json.loads((out/'encoded-sound-qa.json').read_text());frames=json.loads((out/'frame-extraction.json').read_text());state=json.loads((p/'package-state.json').read_text());digest=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()
assert digest(p/'youtube-script.md')==sound['original_script_sha256'];assert digest(p/'audio.mp3')==sound['original_audio_sha256']
for lang,sha in state['artifacts']['article']['sha256'].items():assert digest(p/state['artifacts']['article'][lang])==sha
max_voice_delta=max(abs(c['voice_gain_db']) for c in qa['voice_projection_checks'])
report=f'''# V7 sound and pacing review

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
- Ten windows in the final AAC master were regressed against the known voice/music stems. Largest estimated voice gain deviation: {max_voice_delta:.4f} dB (limit 0.15 dB). See encoded-sound-qa.json. This corroborates the exact lossless-stem check; it is not a perceptual listening claim.
- Encoded integrated loudness {qa['loudness']['input_i']} LUFS; true peak {qa['loudness']['input_tp']} dBTP; final-second RMS {qa['last_second_rms_dbfs']:.1f} dBFS. Ending fades completely inside the file.
- Renderer typecheck/static audit and production director/storyboard/evidence preflight pass; prior quiet-hold/template-classification warnings documented.
- Prototype review caught and fixed old captions flashing after the new pauses. V7 uses independently retimed captions, with the old 120 ms hold disabled. All 171 caption text groups retained.
- {frames['sampled_frames']} frames sequentially extracted from 39 scenes. Inspected all scene midpoint sheets and all exact new boundaries, including before/after the fractional visual carry and the final frame. No observed black gap, stale subtitle flash, caption overlap or clipped bridge content in those samples.
- Updated draft chapter timestamps from the new scene timeline.

## Limits and decision
The agent inspected encoded frames and measured the sound, but did not perform a human uninterrupted viewing or headphone/phone-speaker listening session. Whether the pauses feel natural and whether the music sits well remains Aaron's acceptance decision. V6 is retained for immediate comparison or rollback. Do not promote V7 to canonical or publish it based only on these technical checks.
'''
(p/'video-qa-report-v7.md').write_text(report);(p/'video-qa-report.md').write_text(report)
state['phase']='v7_sound_and_pacing_experiment_ready_for_author_review';v=state['artifacts']['video'];v.update(status='v7_local_experiment_ready',review_candidates={'scored':'video-v7.mp4','narration_only':'video-v7-nomusic.mp4','sound_and_pacing_highlights':'video-sound-preview-v7.mp4'},duration_seconds=512.8,qa='video-qa-report-v7.md',human_review='V6 imagery/music character liked; V7 mix and pauses await author listening',technical_qa='pass_retained_voice_pcm_encoded_gain_checks_39_scene_sampled_visual_qa');v['prior_baseline']={'scored':'video-v6.mp4','narration_only':'video-v6-nomusic.mp4','approval':'Author likes illustrations and music character; asks to fix ending entry and try natural rests'}
state['artifacts']['storyboard'].update(scenes=39,planned_duration_seconds=512.8,status='production_pass_with_documented_quiet_holds');state['video_revision'].update(version='v7',visual_only=False,sound_and_pacing_experiment=True,film_duration_seconds=512.8,added_silence_seconds=9.6,new_music_cues=2,body_regenerated=False,ending_regenerated=False);state['music'].update(status='internal_chaptered_review_v7',dry_alternative='video-v7-nomusic.mp4',cue_plan='video-production/v7/sound-plan.json',voice_gain=1.0);state['updated_at']=datetime.datetime.now(datetime.timezone.utc).isoformat();state['change_since_article_lock']='V7: fixed voice gain, slow music-only fades, two new Google Lyria cues, three silence inserts totaling 9.6s; approved narration and articles unchanged.';state['artifacts']['captions']={'current_video':'video-captions-en-v7.srt','original':'video-captions-en.srt','text_groups':171,'words':1060,'status':'retimed_without_text_changes'};state['release']['authorization']='No external publishing requested in this visual/audio experiment';(p/'package-state.json').write_text(json.dumps(state,ensure_ascii=False,indent=2)+'\n')
(out/'delivery-manifest.json').write_text(json.dumps({'version':'v7','duration':512.8,'files':{name:digest(p/name) for name in ['video-v7.mp4','video-v7-nomusic.mp4','video-sound-preview-v7.mp4','video-captions-en-v7.srt']},'source_articles_and_voice_unchanged':True,'human_acceptance':'pending'},indent=2)+'\n');print('V7 review and package checkpoint recorded')
