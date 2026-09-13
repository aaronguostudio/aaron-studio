from pathlib import Path
import json,copy
p=Path(__file__).resolve().parent;d=json.loads((p/'timeline.json').read_text());old=p.parent/'singing-sands-long-2026-09-08';maps={'pressure':'air','control':'method','gripforces':'gripper','release':'gripper'}
for name,key in [('director-plan.json','beats'),('asset-plan.json','beats'),('video-storyboard.json','scenes')]:
 doc=json.loads((old/name).read_text());prior={s['id']:s for s in doc[key]};entries=[]
 for s in d['scenes']:
  a=copy.deepcopy(prior[maps.get(s['id'],s['id'])]);a.update(id=s['id'],start_sec=s['start'],end_sec=s['end']);
  for k in ['title','entry_visual','copy']:
   if k in a:a[k]=s['title']
  if name=='asset-plan.json':
   a['asset_path']='assets/gripper-refined.mp4' if s['id']=='gripper' else 'assets/gripper-hero.png' if s['id']in ['gripforces','release'] else '../../../../tiles/aaron-video-gen/remotion/src/projects/visual-sound-full/index.tsx' if s['visual']not in ['field','photo'] else a['asset_path']
   if s['id']=='gripforces':a['fact_ids']=['f15'];a['source_ids']=['gripper']
   if s['id']=='release':a['fact_ids']=['f16'];a['source_ids']=['gripper-release']
   if s['id'] in ['gripper','gripforces','release']:a['rights']='owned';a['asset_type']='generated-layout';a['provenance']='Author-approved Blender explanatory model and render; not experimental footage.'
  if name=='video-storyboard.json':
   a['content']=[s['title'],'English caption'];a['beats']=[x for x in a['beats']if x['at_sec']<s['end']-s['start']];a['prototype_required']=False
  if name=='director-plan.json':a['asset_id']=s['id'];a['asset_provenance']='Inherited recorded source chain; production explanations and credits are kept off the picture and in review documentation.'
  entries.append(a)
 end=copy.deepcopy(prior['end-card']);end.update(start_sec=d['endCardStart'],end_sec=d['durationFrames']/30)
 for k in ['title','entry_visual']:
  if k in end:end[k]='Visual & Sound'
 if 'content'in end:end['content']=['Visual & Sound','Look closer. Listen differently.']
 if 'asset_path'in end:end['asset_path']='../../../../tiles/aaron-video-gen/remotion/src/projects/visual-sound-full/index.tsx'
 entries.append(end);doc[key]=entries;doc['duration_sec']=d['durationFrames']/30;doc['title']='This Sand Sings'
 if 'style_reference'in doc:doc['style_reference'].update(baseline_id='visual-sound-approved-refinement',reference_package='src/content/videos/visual-sound-refinement-2026-09-09',reference_video='src/content/videos/visual-sound-refinement-2026-09-09/gripper-refined.mp4',reference_qa='src/content/videos/visual-sound-refinement-2026-09-09/qa/artifacts.json',inherited_system='Approved cover A, American Brian voice F, tactile Blender model with purposeful camera movement, previously accepted documentary music and scene mix.',deliberate_deviation='Explicit author approval replaces Aaron branding and clone voice with Visual & Sound. On-screen provenance removed; source records retained. Full production requested for next-day review.',review_status='reviewed')
 (p/name).write_text(json.dumps(doc,indent=2))
(p/'video-treatment.md').write_text('# Approved treatment\n\nAuthor approved cover A, voice F (Brian, American), refined Blender model and camera on 2026-09-10 and requested the complete film. The established documentary remains the visual and musical reference. Changes are the channel identity, approved voice, cleaner image presentation, corrected lab layout and approved 3D segment. New concise explanation beats preserve long-form substance at the measured voice pace.\n')
(p/'director-memo.md').write_text('# Final direction\n\nVisual & Sound identity only. Cover A at frame zero. Pure English narration, labels and captions. No recurring AI or explanatory-animation overlays. Source and scientific qualifications remain in the spoken argument where meaningful and in the review/source files. Caption safe area protected below 920px; 3D stage limited to 900px. Approved gripper animation is retimed against actual narration action words.\n')
(p/'asset-decision-log.md').write_text('# Reuse and integration\n\nReused the approved cover A, 18-second Blender render, 4K hero still, NPS film/recording, Kurt Moses / NPS photo, original generated illustrations and approved chapter score. No new external footage or score was needed. Removed the 1.22x digital zoom on the already-soft NPS clip; retained its native detail instead of claiming a resolution improvement. Provenance remains in the inherited manifests and review page.\n\nVoice F is explicitly approved. Exact new requests, previous/next section context, original audio and alignment are preserved. Narrator identity is scoped to this channel package; Aaron personal voice profile is untouched.\n')
(p/'video-brief.md').write_text('# This Sand Sings\n\nViewer promise: hear a real dune, understand the controlled questions behind its sound, and explore related granular engineering. Channel Visual & Sound. English edition. Completed for local author review; no publishing authorized.\n')
r=json.loads((p/'research-evidence.json').read_text());r['bundle_id']=p.name
for fact in json.loads((p/'fact-pack.json').read_text())['facts'][-2:]:r['claims'].append({'id':fact['id'],'kind':'source_fact','text':fact['claim'],'source_ids':fact['source_ids'],'verification_status':'verified','confidence':'high'})
(p/'research-evidence.json').write_text(json.dumps(r,indent=2))
