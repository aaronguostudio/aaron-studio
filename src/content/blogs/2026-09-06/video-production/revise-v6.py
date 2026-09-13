from pathlib import Path
import json,hashlib
p=Path(__file__).resolve().parents[1]
old=p/'revisions/video-v5-before-director-enrichment'
read=lambda name:json.loads((old/name).read_text())
write=lambda name,d:(p/name).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
changes={
's07':('media-split','forms','Make duplicate entry tangible; inspect the workflow before choosing a feature.'),
's13':('media-split',None,'Show the actual editorial correction as a marked-up manuscript, with feedback beside it.'),
's17':('media-split','shared','Make a proposed shared inspection concrete; anonymous hands are illustration, not a reported meeting.'),
's19':('ownership-map',None,'Place three reading criteria on one review sheet with a margin note.'),
's22':('split-loop',None,'Separate a source paraphrase from Aaron’s interpretation on two documents.'),
's23':('split-loop',None,'Underline the jump to everyone; clearly mark the sentence as an unsupported illustrative generalization.'),
's24':('media-split','shared','Return to the same draft to show two useful contributions, preserving object continuity.'),
's28':('media-split','queue','Show a modest review queue while attention moves from output to understanding and verification.'),
's29':('workflow-gates',None,'Make responsibility questions tangible as delivery review cards.'),
's31':('workflow-gates',None,'Return to review-card geometry to resolve the proposed shared practice.')}
director=read('director-plan.json'); board=read('video-storyboard.json'); assets=read('asset-plan.json')
for b in director['beats']:
 if b['id'] not in changes:continue
 layout,image,reason=changes[b['id']]
 b.update(visual_reason=reason,layout_id=layout,visual_mode='hybrid' if image else 'motion',camera_or_motion='Stable illustration or manuscript; frame-driven underline and focus, no camera movement',asset_provenance='Generated editorial illustration, not evidence; imgs/video-v6/generation-manifest.md' if image else 'Native typeset summary of approved argument; examples labeled',fallback='Original v5 registered composition; preserved in revisions/video-v5-before-director-enrichment')
 if b['id']=='s13':b['first_visual_change_sec']=1.2
 if b['id']=='s23':b['first_visual_change_sec']=2
for s in board['scenes']:
 if s['id'] not in changes:continue
 layout,image,reason=changes[s['id']]; s.update(layout_id=layout,purpose=reason,template='system-map',intensity='structured',motion_recipes=['focus-shift'],prototype_required=False)
 s['beats']=[b for b in s['beats'] if 'Resolve the supporting' not in b['action']]
 for b in s['beats']:
  if b['at_sec']>0:b['action']='Underline or focus an existing text region without moving the layout'
 if s['id']=='s13':
  s['first_change_sec']=1.2
  s['beats']=[{'at_sec':0,'visual':'Earlier and revised manuscript focus with feedback summary','action':'Complete readable scaffold'},{'at_sec':1.2,'visual':'Earlier Linux focus','action':'Coral underline'},{'at_sec':5.667,'visual':'My feedback','action':'Focus fixed annotation'},{'at_sec':10.833,'visual':'AI and trust at work','action':'Teal underline revised focus'}]
 if s['id']=='s23':
  s['first_change_sec']=2
  s['title']='Where the claim goes too far'
  s['role']='explanation'
  s['beats']=[{'at_sec':0,'visual':'Specific experience beside unsupported generalization','action':'Both claims and evidence boundary visible'},{'at_sec':2,'visual':'Everyone exceeds the evidence','action':'Coral underline reveals scope jump'}]
for a in assets['beats']:
 if a['id'] not in changes:continue
 layout,image,reason=changes[a['id']];a['narrative_reason']=reason;a['layout_id']=layout
 if image:a.update(asset_type='generated-still',asset_path=f'imgs/video-v6/{image}-v1.png',rights='generated',provenance='Built-in imagegen; imgs/video-v6/generation-manifest.md; conceptual illustration, not documentary evidence')
write('director-plan.json',director);write('video-storyboard.json',board);write('asset-plan.json',assets)
data=read('video-production/render-data.json');data['visual_revision']={'version':'v6','renderer':'tiles/aaron-video-gen/remotion/src/projects/dhh-ai-enthusiasm-v6/index.tsx','overrides':{k:{'layout':v[0],'media':v[1],'reason':v[2]} for k,v in changes.items()}}
write('video-production/render-data-v6.json',data)
manifest={'version':'v6','audio_sha256':hashlib.sha256((p/'audio.mp3').read_bytes()).hexdigest(),'script_sha256':hashlib.sha256((p/'youtube-script.md').read_bytes()).hexdigest(),'captions_sha256':hashlib.sha256((p/'video-captions-en.srt').read_bytes()).hexdigest(),'changed_scene_ids':list(changes),'unchanged_timing':True,'unchanged_narration':True,'baseline':'video-v5-nomusic.mp4','renderer':'tiles/aaron-video-gen/remotion/src/projects/dhh-ai-enthusiasm-v6/index.tsx'}
write('video-production/v6-revision-manifest.json',manifest)
print('Updated 10 scene decisions; audio and timeline retained')
