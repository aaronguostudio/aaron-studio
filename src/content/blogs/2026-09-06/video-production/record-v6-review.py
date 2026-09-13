from pathlib import Path
import json,datetime
p=Path(__file__).resolve().parents[1];out=p/'video-production';m=json.loads((out/'v6-revision-manifest.json').read_text());q=json.loads((out/'v6-qa/master-technical-qa.json').read_text());state=json.loads((p/'package-state.json').read_text())
assert m['article_hashes_unchanged'];assert q['selected_frames']==108
v=state['artifacts']['video'];v.update(status='v6_local_visual_revision_review_ready',review_candidates={'scored':'video-v6.mp4','narration_only':'video-v6-nomusic.mp4','visual_highlights':'video-visual-preview-v6.mp4'},human_review='v5 content/style approved; v6 assembly pending author review',technical_qa='pass_108_encoded_frames_audio_stream_identity_locked_text_and_timing',qa='video-qa-report-v6.md')
v['prior_baseline']={'scored':'video-v5.mp4','narration_only':'video-v5-nomusic.mp4','approval':'Aaron liked content, clean style and restraint; requested richer illustrations and layouts'}
state['phase']='video_visual_revision_ready_for_author_review';state['video_revision'].update(version='v6',visual_only=True,changed_scenes=10,new_illustrations=3,body_regenerated=False,ending_regenerated=False)
state['music']['dry_alternative']='video-v6-nomusic.mp4';state['updated_at']=datetime.datetime.now(datetime.timezone.utc).isoformat();state['change_since_article_lock']='v6: author-delegated visual enrichment only; three new illustrations and ten changed scenes. Articles, narration, script, subtitles and total duration unchanged.'
state['skill_improvement']={'files':['tiles/blog-production/SKILL.md','tiles/aaron-video-gen/references/director-pass.md'],'status':'local_updated_validated_synced','basis':'v5/v6 sampled comparison; user review of v6 remains pending'}
(p/'package-state.json').write_text(json.dumps(state,ensure_ascii=False,indent=2)+'\n')
text=f'''# V6 video QA

Status: local review candidate; technical and sampled visual QA passed. V5 content, style and voice were approved by Aaron. V6 assembly awaits author review. Not published.

## Deliverables
- video-v6.mp4: 1920×1080, 30 fps, {float(q['duration']):.1f} seconds. Prior bookend music reused exactly, internal review only; existing music-rights status remains unverified.
- video-v6-nomusic.mp4: same video stream with the approved narration-only audio.
- video-visual-preview-v6.mp4: 102.233 seconds, six complete changed passages at 1280×720.
- video-production/v5-v6-comparison.png: corresponding six-frame before/after comparison.

## Changes
Three warm graphite illustrations integrated beside text: duplicate forms, shared draft inspection, and a review tray. Ten scenes changed. Other geometry includes a manuscript with feedback, a review sheet, paired claim documents, and review cards. Native underline/focus animation keeps text stationary. All registered layouts retain protected caption space. No new narration or factual claims were added; the native feedback sentence is a summary, not a quotation.

## Verification
- Typecheck and renderer audit pass; pre-existing timing-primitive warnings retained.
- Director-plan, production storyboard, and production content-evidence audits pass. Storyboard warnings are intentional quiet holds and broad template classifications; actual layout variety checked visually.
- 18 sequentially decoded prototype entry/middle/exit frames inspected; six before/after pairs compared; s19 review-sheet still inspected at full size.
- Full master: 108 sequentially decoded frames across all 36 scenes. Three midpoint contact sheets and changed-scene entry/exit sheet inspected for content, clipping, caption separation and terminal frame. No observed overlap, blank transition or missing new media in those samples.
- Both final AAC audio streams exactly match their v5 counterparts. Both v6 files share the same video stream. Source audio, script, caption and bilingual article hashes unchanged. See v6-revision-manifest.json.
- Narration-only loudness: {q['audio_loudness']['input_i']} LUFS; true peak {q['audio_loudness']['input_tp']} dBTP. Last-second mean: {q['last_second_mean_db']} dB.
- No claim of a full human playback or headphone listening pass. Visual verification is sampled, while stream identity is exact.

## Workflow improvement
Updated the blog-production richness gate to assess narrative jobs and composition variety, replacing its old image-count rule. Added a visual-enrichment-after-approval pass to the director reference: preserve locks, choose useful imagery, vary registered geometry, compare encoded passages, retain provenance and version history. Both skill folders validate and their local agent links are synced. These methods are documented from the comparison; v6 is not marked author-approved.
'''
(p/'video-qa-report-v6.md').write_text(text)
print('V6 state and review report recorded')
