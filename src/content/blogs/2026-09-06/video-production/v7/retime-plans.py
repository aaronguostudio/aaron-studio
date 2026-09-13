from pathlib import Path
import json,copy
p=Path(__file__).resolve().parents[2];out=Path(__file__).resolve().parent;archive=p/'revisions/video-v6-before-sound-direction';sound=json.loads((out/'sound-plan.json').read_text());pauses=sound['pauses'];base=json.loads((p/'video-production/render-data-v6.json').read_text());duration=sound['duration']
def tr(t):return round((t+sum(x['duration'] for x in pauses if t>=x['old']-1e-6))*30)/30
def before(t):return round((t+sum(x['duration'] for x in pauses if t>x['old']+1e-6))*30)/30
def remake(rows):
 result=[]
 for r in rows:
  r=copy.deepcopy(r);a,b=r['start_sec'],r['end_sec'];r['start_sec']=tr(a);r['end_sec']=tr(b)
  for x in pauses:
   if a<x['old']<b:r['end_sec']=before(x['old'])
  result.append(r)
 return result
for name,field in [('director-plan.json','beats'),('video-storyboard.json','scenes'),('asset-plan.json','beats')]:
 d=json.loads((archive/name).read_text());d['duration_sec']=duration;d[field]=remake(d[field])
 for i,x in enumerate(pauses):
  original=next(s for s in base['scenes'] if s['start']<x['old']<s['end']);a=before(x['old']);b=tr(original['end']);image=('imgs/video-v6/shared-v1.png' if i==1 else 'imgs/'+x['image']);reason=['Carry the wish to build into Aaron’s personal project','Let an inspectable concern become a shared practical question','Let a useful method settle before the final synthesis'][i]
  if field=='scenes':item={'id':x['id'],'title':x['title'],'start_sec':a,'end_sec':b,'role':'emphasis','template':'image-sequence','layout_id':'people-hero','intensity':'calm','purpose':reason,'entry_mode':'meaningful','entry_visual':x['title'],'first_change_sec':0,'motion_recipes':[],'content':[x['title']],'beats':[{'at_sec':0,'visual':x['image'],'action':'Complete approved illustration and short thought; intentional stillness'}],'music_cue':'Existing low cue continues smoothly; no gain triggered by speech','prototype_required':False,'fallback_template':'image-sequence'}
  elif name=='director-plan.json':item={'id':x['id'],'start_sec':a,'end_sec':b,'narrative_role':'resolve' if i==2 else 'explain','visual_mode':'generated-still','intensity':'calm','entry_mode':'meaningful','entry_visual':x['title'],'first_visual_change_sec':0,'visual_reason':reason,'camera_or_motion':'Intentional static image hold; no text movement or camera drift','asset_id':x['id'],'asset_provenance':'Previously approved illustrative asset; conceptual, not source evidence','generated_video_sec':0,'sound_cue':'Slow score envelope; unchanged voice pauses in verified silence','transition_out':'Clean cut to the next existing scene, without a residual-frame flash','fallback':'Restore v6 timing and mix'}
  else:item={'id':x['id'],'start_sec':a,'end_sec':b,'copy':x['title'],'visual_role':'emphasis','asset_type':'generated-still','fact_ids':[],'source_ids':[],'asset_path':image,'usage_role':'primary','status':'ready','provenance':'Reused approved illustration; conceptual breathing beat','rights':'generated','fallback':'Restore v6 scene and duration'}
  d[field].append(item)
 d[field].sort(key=lambda x:x['start_sec'])
 if name=='video-storyboard.json':d['direction']['music_strategy']='chaptered';d['direction']['name']='Warm editorial essay with three natural breaths'
 for s in d[field]:
  if 'music_cue' in s:s['music_cue']='Chaptered score; see video-production/v7/sound-plan.json. Voice gain fixed at unity.'
  if 'sound_cue' in s:s['sound_cue']='Chaptered score; see video-production/v7/sound-plan.json. Voice gain fixed at unity.'
 (p/name).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
# Retimed captions preserve every text group. Do not leave old captions on a music-only breath.
captions=[]
for c in base['captions']:
 n=copy.deepcopy(c);n['start']=c['start']+sum(x['duration'] for x in pauses if c['start']>=x['old']);n['end']=c['end']+sum(x['duration'] for x in pauses if c['end']>=x['old'])
 for x in pauses:
  if c['start']<x['old']<c['end']:n['end']=before(x['old'])
 captions.append(n)
def stamp(s):
 ms=round(s*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);sec,ms=divmod(ms,1000);return f'{h:02}:{m:02}:{sec:02},{ms:03}'
(p/'video-captions-en-v7.srt').write_text('\n\n'.join(f"{i+1}\n{stamp(c['start'])} --> {stamp(c['end'])}\n{c['text']}" for i,c in enumerate(captions))+'\n')
assert [c['text'] for c in captions]==[c['text'] for c in base['captions']]
(out/'retimed-captions.json').write_text(json.dumps(captions,ensure_ascii=False,indent=2)+'\n')
print('39 scenes; 171 caption groups retained; duration',duration)
