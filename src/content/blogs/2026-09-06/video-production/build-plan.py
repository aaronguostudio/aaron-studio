from pathlib import Path
import json,re,shutil
p=Path(__file__).resolve().parents[1]; root=p.parents[3]; project=root/'tiles/aaron-video-gen/remotion/src/projects/dhh-ai-enthusiasm'; project.mkdir(parents=True,exist_ok=True)
m=json.loads((p/'audio-generation-manifest.json').read_text()); words=m['timeline']['wordTimings']; norm=lambda s:re.sub('[^a-z0-9]','',s.lower()); tokens=[norm(w['word']) for w in words]
def at(phrase):
 q=[norm(x) for x in phrase.split()]
 for i in range(len(tokens)-len(q)+1):
  if tokens[i:i+len(q)]==q:return words[i]['start']+3
 raise ValueError(phrase)
# Cue, layout, title, nodes, supporting line, media, source fact.
rows=[
('In my own team','portrait','Different experiences.\nOne team.',[], 'Why I share DHH’s enthusiasm for AI','04-dhh-portrait-v1.png',None),
('Three ideas stayed','map','Three ideas worth bringing back',['Update the judgment','Choose what matters','Keep creating'],'From an interview to everyday work',None,None),
('First the tool','map','01 / Update the judgment',['Autocomplete','Agents using tools','Results he could use'],'DHH describes a change in his own experience',None,'f1'),
('I find that attitude','statement','One attempt has a scope.',[],'A disappointing result is a reason to learn.',None,None),
('The same applies','map','Confidence can stay open',['A useful result','Know its limits','Look again'],'Good experience also needs a boundary.',None,None),
('Second being able','map','02 / Choose what matters',['Who is it for?','What should it do?','What comes first?'],'DHH on product judgment',None,'f2'),
('That connects directly','map','Notice the friction first',['Repeated entry','Confusing screen','A useful improvement'],'Illustrative workflow problems',None,None),
('If AI gives','statement','More options need better choices.',[],'Understand the person who might use it.',None,None),
('Third the joy','portrait','03 / Keep the joy\nof creating',[],'Optimism about building; uncertainty about jobs.','04-dhh-portrait-v1.png','f3'),
('My own excitement','image','An idea becomes useful.',[],'The product is the point.','01-first-version-v1.png',None),
('I also admire','statement','Ambition to make\na preference real',[],'Omarchy is one expression of that ambition.',None,None),
('Those three ideas','map','My blog workflow',['Research','Outline','Draft','Review'],'Reusable guidance · files I can inspect',None,None),
('This piece is','map','This article made the gap visible',['Earlier draft: Linux','My feedback','Revised focus: AI'],'Actual revision in this project',None,None),
('The draft helped','statement','I keep shaping the meaning.',[],'A concrete draft gives me something to respond to.',None,None),
('Inside a company','map','Confidence does not transfer by itself',['Enthusiastic use','A shared project','Reservations'],'Different levels of trust in my team',None,None),
("I don't want to turn",'portrait','A useful reference.\nOur own evidence.',[],'DHH’s experience cannot decide our project.','04-dhh-portrait-v1.png',None),
('I would like the people','map','Make experience inspectable',['Show the method','Name the concern','Examine the result'],'A proposed way to work together',None,None),
('Here is a small','statement','Start with one familiar task.',[],'A practice I would like us to try.',None,None),
('Take a paragraph','map','Agree on what good looks like',['Readable','Matches the source','Separates interpretation'],'One interview-based paragraph',None,None),
('The person using','map','Show how the result was made',['Instructions','Source material','Accepted changes'],'Make the method available to a colleague.',None,None),
('That makes the discussion','statement','Which edit helped?',[],'A specific result gives us a specific discussion.',None,None),
('Consider a possible','map','Two claims, different jobs',['SOURCE: agents do useful work','MY VIEW: more ideas worth trying'],'Illustrative comparison, not a reported team error',None,None),
('But if a rewrite','statement','“Everyone is more productive now.”',[],'An unsupported leap in this example',None,None),
('The enthusiastic person','map','Both views can improve the result',['Show where it helped','Point to claim drift'],'Two contributions to the same task',None,None),
('If the paragraph improved','map','Keep or change the method',['Useful result → keep','Claim drift → revise'],'Instructions and review can both improve.',None,None),
('This is a practice','statement','A proposed practice.',[],'Not a team success story.',None,None),
('A writing exercise','map','Trust belongs to a context',['A writing task','A shared business system'],'The consequences change the evidence we need.',None,None),
('I have written before','map','Output can move the bottleneck',['More changes','Understanding','Verification'],'QA remains part of delivery.',None,None),
('I still want to delegate','map','Give responsibility a clear boundary',['Who depends on it?','How do we detect failure?','How do we recover?'],'I still want AI to take on more work.',None,None),
('Trust can grow','image','Trust can grow\nwith experience.',[],'Ask for evidence that fits the consequences.','03-maintenance-v1.png',None),
('For my team','map','One piece of work together',['A familiar task','Agree on good','Inspect the result'],'We can begin with different levels of confidence.',None,None),
('If we finish with','statement','One method worth keeping.',[],'Something we can use the next morning.',None,None),
('So what I take','map','What I bring back from DHH',['Stay curious','Build thoughtfully','Keep the joy'],'Why I share his enthusiasm for AI',None,None),
('I hope we can turn','image','Trust we earn together.',[],'Products that make someone’s day a little better.','00-cover.png',None),
]
scenes=[dict(id='s00',start=0,end=3,kind='cover',title='AI TRUST / AT WORK',nodes=[],sub='Aaron Guo',media='00-thumbnail-v3-a.png',fact=None)]
for i,(cue,kind,title,nodes,sub,media,fact) in enumerate(rows):scenes.append(dict(id=f's{i+1:02}',start=at(cue),end=0,kind=kind,title=title,nodes=nodes,sub=sub,media=media,fact=fact))
end=m['qa']['durationSeconds']+3
scenes.append(dict(id='s35',start=end,end=end+5,kind='end',title='Aaron Guo',nodes=[],sub='AI-NATIVE BUILDER · HUMAN-FIRST THINKER',media=None,fact=None))
for i in range(len(scenes)-1):scenes[i]['end']=scenes[i+1]['start']
# Quantize once, shared by renderer and audits; no sequential duration drift.
for s in scenes:s['start']=round(s['start']*30)/30;s['end']=round(s['end']*30)/30
story=[];direct=[];assets=[]
for s in scenes:
 kind=s['kind'];template={'cover':'image-sequence','portrait':'image-sequence','image':'image-sequence','map':'system-map','statement':'editorial-statement','end':'brand-end-card'}[kind];d=s['end']-s['start'];content=s['nodes'] or [s['title'],s['sub']];intensity='structured' if kind=='map' else 'calm';role='evidence' if s['fact'] and kind=='map' else ('emphasis' if kind in ['cover','statement','end'] else 'explanation');recipe='focus-shift' if kind in ['map','statement'] else 'crossfade';first=.5
 if kind=='map':
  n=len(s['nodes']); step=min(6,max(.4,(d-3)/max(n,1))); cues=[round(.5+i*step,3) for i in range(n)]; detail=round((cues[-1]+d)/2,3)
 elif kind in ['portrait','image']:
  cues=[];detail=round(min(8,d/2),3);first=detail
 else:
  cues=[];detail=.5
 s['focus_cues']=cues;s['detail_cue']=detail
 beats=[dict(at_sec=0,visual=s['title'],action='Complete readable scaffold')]
 for n,t in enumerate(cues):beats.append(dict(at_sec=t,visual=s['nodes'][n],action='Focus and underline the next peer in the fixed row'))
 beats.append(dict(at_sec=detail,visual=s['sub'],action='Resolve the supporting conclusion without moving text'))
 beats.sort(key=lambda b:b['at_sec'])
 provenance='Illustrative generated scene media; imgs/generation-manifest.md' if s['media'] else ('Typeset paraphrase of the official Lex transcript' if s['fact'] else 'Original explanation of author-confirmed experience or explicitly proposed practice')
 purpose='Recognize the speaker or make usefulness tangible' if s['media'] else 'Expose the relationship and limits in the spoken argument'
 sound='Dry narration; bookended music audition is internal only, rights unverified.'
 story.append(dict(id=s['id'],title=s['title'].replace('\n',' '),start_sec=s['start'],end_sec=s['end'],role=role,template=template,intensity=intensity,purpose=purpose,entry_mode='meaningful',entry_visual=s['title'],first_change_sec=first,motion_recipes=[recipe],content=content,beats=beats,music_cue=sound,prototype_required=False,fallback_template='image-sequence'))
 direct.append(dict(id=s['id'],start_sec=s['start'],end_sec=s['end'],narrative_role='evidence' if s['fact'] and role=='evidence' else ('hook' if s['start']<32.6 else 'explain'),visual_mode='generated-still' if s['media'] else 'motion',intensity=intensity,entry_mode='meaningful',entry_visual=s['title'],first_visual_change_sec=first,visual_reason=purpose,camera_or_motion=recipe+' within a stable registered layout',asset_id=s['id'],asset_provenance=provenance,generated_video_sec=0,sound_cue=sound,transition_out='Clean cut; same ivory field and caption baseline',fallback='Fully visible static composition'))
 assets.append(dict(id=s['id'],start_sec=s['start'],end_sec=s['end'],copy=' / '.join(content),visual_role=role,asset_type='generated-still' if s['media'] else 'generated-layout',fact_ids=[s['fact']] if s['fact'] and role=='evidence' else [],source_ids=['lex-dhh'] if s['fact'] and role=='evidence' else [],asset_path='imgs/'+s['media'] if s['media'] else None,usage_role='primary',status='ready',provenance=provenance,rights='generated' if s['media'] else 'owned',fallback='Static typography with source labels retained'))
ref=json.loads((p/'director-plan.json').read_text())['style_reference'];ref['inherited_system']='Warm ivory, graphite hierarchy, stable registered layout geometry, source rails, protected captions and calm focus changes.';ref['deliberate_deviation']='Use the author-approved warm DHH illustration; coral denotes a concern or correction, cyan denotes a retained useful step. Preserve the accepted ledger grammar.'
write=lambda n,v:(p/n).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
write('video-storyboard.json',dict(schema_version=1,title='Why I Share DHH’s Enthusiasm for AI',duration_sec=scenes[-1]['end'],fps=30,direction=dict(name='Warm editorial notes on AI trust',style_family_id='ledger-editorial-v1',visual_spine=ref['inherited_system'],motion_density='balanced',music_strategy='bookended',references=[dict(id='accepted-ledger-baseline',url='https://youtu.be/5vEEBhbfUWw',borrow=ref['inherited_system'],avoid=ref['rejected_legacy_pattern'])]),scenes=story))
write('director-plan.json',dict(schema_version=1,title='Why I Share DHH’s Enthusiasm for AI',duration_sec=scenes[-1]['end'],product_promise='Three interview ideas, then personal experience and a proposed team practice.',style_reference=ref,visual_budget=dict(remotion_motion_target_ratio=.7,evidence_or_still_target_ratio=.3,max_generated_video_ratio=0,max_generated_video_beats=0,max_semantic_sprite_beats=0),beats=direct))
write('asset-plan.json',dict(schema_version=1,title='DHH AI trust',duration_sec=scenes[-1]['end'],aspect_ratio='16:9',visual_spine_id='ledger-editorial-v1',asset_library=dict(queries=['warm restrained editorial piano short bookend'],selected_asset_ids=['music:b161e820cd4f5741']),beats=assets))
# Stable phrase captions; preserve exact timing words, break at punctuation/8 words/56 chars.
captions=[];group=[]
for w in words:
 group.append(w)
 if len(group)>=8 or len(' '.join(x['word'] for x in group))>=56 or re.search(r'[.!?]$',w['word']):
  captions.append(dict(start=group[0]['start']+3,end=group[-1]['end']+3,text=' '.join(x['word'] for x in group)));group=[]
if group:captions.append(dict(start=group[0]['start']+3,end=group[-1]['end']+3,text=' '.join(x['word'] for x in group)))
(project/'data.ts').write_text('export const filmData = '+json.dumps(dict(scenes=scenes,captions=captions,duration=scenes[-1]['end'],audioStart=3),ensure_ascii=False,indent=2)+';\n')
write('video-production/render-data.json',dict(scenes=scenes,captions=captions,duration=scenes[-1]['end']))
public=root/'tiles/aaron-video-gen/remotion/public/dhh-ai-enthusiasm';public.mkdir(parents=True,exist_ok=True)
for name in ['00-thumbnail-v3-a.png','04-dhh-portrait-v1.png','01-first-version-v1.png','03-maintenance-v1.png','00-cover.png']:shutil.copy2(p/'imgs'/name,public/name)
shutil.copy2(p/'audio.mp3',public/'audio.mp3');shutil.copy2(root/'assets/aaron-logo-assets/ag-logo.png',public/'ag-logo.png')
print('Prepared',len(scenes),'scenes;',scenes[-1]['end'],'seconds; captions',len(captions))
for s in scenes:
 if s['kind']=='statement' and s['end']-s['start']>20:print('OVERLONG',s['id'],s['end']-s['start'])
