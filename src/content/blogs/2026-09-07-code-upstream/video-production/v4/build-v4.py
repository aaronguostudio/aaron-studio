"""Chapter-led revision. Keep every accepted voice sample at unity gain."""
from pathlib import Path
import copy, hashlib, json, math, re, subprocess
import numpy as np

D=Path(__file__).resolve().parent; P=D.parent.parent; R=P.parents[3]
V3=P/'video-production/v3'; SR=48000; FPS=30
D.mkdir(exist_ok=True)
def run(args): return subprocess.check_output(args)
def read(name): return json.loads((P/name).read_text())
def dump(path,data): path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
def sha(f): return hashlib.sha256(f.read_bytes()).hexdigest()
def decode(f): return np.frombuffer(run(['ffmpeg','-v','error','-i',str(f),'-ar',str(SR),'-ac','2','-f','f32le','-']),dtype='<f4').reshape(-1,2).copy()
def wav(f,a): subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','pipe:0','-c:a','pcm_f32le',str(f)],input=a.astype('<f4').tobytes(),check=True)
def loud(f):
 r=subprocess.run(['ffmpeg','-hide_banner','-i',str(f),'-af','loudnorm=I=-17:TP=-1.5:LRA=11:print_format=json','-f','null','-'],text=True,capture_output=True,check=True)
 return json.loads(r.stderr[r.stderr.rfind('{'):r.stderr.rfind('}')+1])
old=read('video-production/v3/timeline.json'); base=decode(V3/'voice-stem.wav')
words=[{**w,'start':w['start']+3,'end':w['end']+3} for w in read('video-production/v3/word-timings.json')]
lock_names=['youtube-script.md','audio-v3.mp3','video-v3.mp4','code-is-cheap-opportunity-moves-upstream.md','code-is-cheap-opportunity-moves-upstream-zh.md']
dump(D/'source-lock.json',{n:sha(P/n) for n in lock_names})

chapters=[
 {'id':'opening','number':None,'first':'s01','last':'s11','title':'The opportunity around the code','short':'The argument','agenda':['An Amazon judgment','What changed','Where to invest'],'purpose':'Use stronger tools to get closer to real needs.','groups':[['s01','s02','s03','s04'],['s05','s06','s07'],['s08','s09','s10','s11']]},
 {'id':'industry','number':1,'first':'s12','last':'s14','title':'Learn an industry deeply','short':'Industry','agenda':['Understand the roles','Learn the obligations','Notice unmet needs'],'purpose':'The business gives a feature its meaning.','groups':[['s12'],['s13'],['s14']]},
 {'id':'customers','number':2,'first':'s15','last':'s18','title':'Spend time with customers','short':'Customers','agenda':['Watch real work','Follow the exception','Return after delivery'],'purpose':'Let observation change the next feature.','groups':[['s15','s16'],['s17'],['s18']]},
 {'id':'product','number':3,'first':'s19','last':'s22','title':'Practice product decisions','short':'Product','agenda':['Try alternatives','Test one question','Choose what belongs'],'purpose':'Spend cheaper code on better choices.','groups':[['s19','s20'],['s21'],['s22']]},
 {'id':'commercial','number':4,'first':'s23','last':'s27','title':'Test commercial value','short':'Value','agenda':['Understand switching','Meet the market','Count the whole cost'],'purpose':'Find out why someone would change.','groups':[['s23','s24','s25'],['s26'],['s27']]},
 {'id':'delivery','number':5,'first':'s28','last':'s32','title':'Follow the project into use','short':'Delivery','agenda':['Connect the work','Define completion','Earn trust in use'],'purpose':'Carry the work beyond implementation.','groups':[['s28','s29'],['s30'],['s31','s32']]},
 {'id':'closing','number':None,'first':'s33','last':'s37','title':'Build what matters','short':'Looking ahead','agenda':['Stay close to needs','Learn through projects','Begin with the next one'],'purpose':'Let each project build your judgment.','groups':[['s33'],['s34','s35'],['s36','s37']]},
]
byid={s['id']:s for s in old['scenes']}
holds=[]
for c in chapters[1:]:
 s=byid[c['first']]
 i=min(range(len(words)),key=lambda i:abs(words[i]['start']-s['start']))
 assert abs(words[i]['start']-s['start'])<.3
 previous,following=words[i-1],words[i]
 gap=following['start']-previous['end']
 target=3.1 if c['id'] in ['industry','closing'] else 2.8
 extra=math.ceil(max(0,target-gap)*FPS)/FPS
 lo=math.ceil((previous['end']+.06)*FPS);hi=math.floor((following['start']-.06)*FPS)
 assert hi>=lo,(c['id'],gap)
 cuts=list(range(lo,hi+1));rms=[float(np.mean(base[max(0,f*1600-240):f*1600+240]**2)) for f in cuts]
 cut=cuts[int(np.argmin(rms))]/FPS
 h={'chapter':c['id'],'at':cut,'transition_at':round((previous['end']+.18)*FPS)/FPS,'duration':extra,'existing_gap':gap,'target_gap':target,'cut_rms_dbfs':10*math.log10(max(min(rms),1e-24)),'after':previous['word'],'before':following['word']}
 assert h['cut_rms_dbfs']<-48,h
 holds.append(h)
def shift(t): return t+sum(h['duration'] for h in holds if t>=h['at']-1e-8)
def q(t): return round(t*FPS)/FPS
pieces=[];spans=[];last=0;cursor=0
for h in holds+[{'at':len(base)/SR,'duration':0}]:
 cut=round(h['at']*SR);a=base[last:cut];pieces.append(a)
 spans.append({'source_start':last,'source_end':cut,'output_start':cursor});cursor+=len(a)
 z=np.zeros((round(h['duration']*SR),2),np.float32);pieces.append(z);cursor+=len(z);last=cut
voice=np.concatenate(pieces)
assert all(np.array_equal(base[s['source_start']:s['source_end']],voice[s['output_start']:s['output_start']+s['source_end']-s['source_start']]) for s in spans)
duration=len(voice)/SR
mapped=[]
for s in old['scenes']:
 n=copy.deepcopy(s);n['start']=q(shift(s['start']));n['end']=q(shift(s['end']))
 n['cues']=[shift(s['start']+x)-n['start'] for x in s['cues']]
 n['detailCue']=shift(s['start']+s['detailCue'])-n['start']
 for c in chapters:
  for j,group in enumerate(c['groups']):
   if s['id'] in group: n['chapterId']=c['id'];n['subsection']=j
 mapped.append(n)
for h in holds:
 start=q(h['transition_at']+sum(a['duration'] for a in holds if a['at']<h['at']))
 c=next(c for c in chapters if c['id']==h['chapter']);first=next(s for s in mapped if s['id']==c['first'])
 prev=next(s for s in mapped if s['start']<start<s['end']);prev['end']=start
 bridge={'id':'bridge-'+c['id'],'start':start,'end':first['start'],'kind':'chapter','title':c['title'],'sub':c['purpose'],'nodes':c['agenda'],'media':None,'facts':[],'sources':[],'rail':'CHAPTER TRANSITION','tension':False,'cues':[.3,.65,1.0],'detailCue':.3,'chapterId':c['id'],'subsection':0}
 mapped.append(bridge);c['start']=start;c['voiceStart']=first['start']
chapters[0]['start']=3.;chapters[0]['voiceStart']=3.
mapped.sort(key=lambda s:s['start']);mapped[-1]['end']=duration
for i,c in enumerate(chapters):c['end']=chapters[i+1]['start'] if i+1<len(chapters) else next(s['start'] for s in mapped if s['kind']=='end')
captions=[{**c,'start':shift(c['start']),'end':shift(c['end'])} for c in old['captions']]
timedwords=[{**w,'start':shift(w['start']),'end':shift(w['end'])} for w in words]
assert all(abs(a['end']-b['start'])<.001 for a,b in zip(mapped,mapped[1:]))
assert all(a['end']<=b['start'] for a,b in zip(captions,captions[1:]))
assert all(not any(x['start']<c['end'] and x['end']>c['start'] for x in captions) for c in mapped if c['kind']=='chapter')
timeline={'version':4,'duration':duration,'fps':FPS,'chapters':chapters,'scenes':mapped,'captions':captions}
dump(D/'timeline.json',timeline);dump(D/'word-timings.json',timedwords);dump(D/'time-map.json',{'holds':holds,'spans':spans,'source':'video-production/v3/voice-stem.wav','sample_rate':SR})
(R/'tiles/aaron-video-gen/remotion/src/projects/code-upstream/data-v4.ts').write_text('export const filmData = '+json.dumps(timeline)+';\n')
wav(D/'voice-stem.wav',voice)

# All entrances belong to a visible chapter, never to an arbitrary mid-scene time.
music=np.zeros_like(voice);cue_log=[]
source_loud={}
def smooth(points,count):
 t=np.arange(count)/SR;out=np.zeros(count)
 for (a,x),(b,y) in zip(points,points[1:]):
  mask=(t>=a)&(t<b);u=(t[mask]-a)/(b-a);out[mask]=x+(y-x)*(.5-.5*np.cos(np.pi*u))
 return out
def addcue(cid,source,start,length,points,role):
 a=decode(source);a=a[:round(length*SR)]
 if str(source) not in source_loud:source_loud[str(source)]=float(loud(source)['input_i'])
 gain=10**((-24-source_loud[str(source)])/20);at=round(start*SR)
 music[at:at+len(a)]+=a*gain*smooth(points,len(a))[:,None]
 cue_log.append({'id':cid,'chapter':cid,'source':str(source.relative_to(P)),'sha256':sha(source),'start':start,'end':start+len(a)/SR,'role':role,'envelope':points,'source_lufs':source_loud[str(source)]})
addcue('opening',V3/'inquiry.mp3',0,12,[(0,0),(1.3,.45),(3,.45),(5,.17),(8,.17),(12,0)],'Cover establishes the inquiry; recedes after the first claim.')
choices={'industry':V3/'inquiry.mp3','customers':V3/'fieldwork.mp3','product':V3/'possibilities.mp3','commercial':P/'revisions/sound-direction-06/reflection.mp3','delivery':P/'revisions/sound-direction-06/possibility.mp3'}
for c in chapters[1:-1]:
 lead=c['voiceStart']-c['start'];length=lead+9
 points=[(0,0),(.8,.56),(max(.9,lead-.3),.56),(lead+1.6,.16),(lead+4,.16),(length,0)]
 addcue(c['id'],choices[c['id']],c['start'],length,points,'Audible punctuation as chapter '+str(c['number'])+' appears; settles under the opening sentence, then leaves the explanation dry.')
# One continuous closing arc replaces the old stop/start pairs. Preserve both sources.
a=decode(P/'revisions/sound-direction-06/reflection.mp3');b=decode(P/'revisions/sound-direction-06/possibility.mp3')
def trim(a):
 blocks=np.array([np.sqrt(np.mean(a[i:i+2400]**2)) for i in range(0,len(a),2400)])
 good=np.flatnonzero(blocks>10**(-45/20));return a[max(0,int(good[0])*2400-2400):min(len(a),int(good[-1]+2)*2400)]
a=trim(a);b=trim(b);n=3*SR;fade=np.linspace(0,1,n)[:,None]
joined=np.concatenate([a[:-n],a[-n:]*np.cos(fade*np.pi/2)+b[:n]*np.sin(fade*np.pi/2),b[n:]])
wav(D/'closing-joined.wav',joined)
c=chapters[-1];length=duration-c['start']-1
tempo=(len(joined)/SR)/length
run(['ffmpeg','-v','error','-y','-i',str(D/'closing-joined.wav'),'-af',f'atempo={tempo},apad','-t',str(length),'-ar',str(SR),'-c:a','pcm_f32le',str(D/'closing-score.wav')])
lead=c['voiceStart']-c['start'];speechend=timedwords[-1]['end']-c['start']
addcue('closing',D/'closing-score.wav',c['start'],length,[(0,0),(1.2,.4),(lead+.8,.14),(length-12,.18),(speechend-2,.12),(speechend,.12),(speechend+1.2,.5),(length,0)],'One uninterrupted reflective-to-optimistic arc begins at the closing chapter; final response comes after speech.')
mix=voice+music
assert np.max(np.abs(mix))<10**(-1.5/20)
assert np.max(np.abs(mix[-SR:]))<1e-7
wav(D/'music-stem.wav',music);wav(D/'mix.wav',mix)
dump(D/'sound-plan.json',{'strategy':'chapter-led','duration':duration,'voiceGain':1,'masterCompression':False,'sidechain':False,'holds':holds,'cues':cue_log,'closingSources':['revisions/sound-direction-06/reflection.mp3','revisions/sound-direction-06/possibility.mp3'],'closingTempo':tempo,'mixLoudness':loud(D/'mix.wav'),'listening':'requires author review'})

# Rebuild the three audit maps on the same V4 clock, keeping claim provenance.
director=read('director-plan.json');story=read('video-storyboard.json');assets=read('asset-plan.json')
original_director={s['id']:s for s in director['beats']};original_story={s['id']:s for s in story['scenes']};original_assets={s['id']:s for s in assets['beats']}
director['duration_sec']=story['duration_sec']=assets['duration_sec']=duration
director['style_reference']['v4_departure']='Author-requested chapter hierarchy: persistent chapter title, three subtopics and a visible chapter/music bridge. V3 card-row repetition rejected; accepted paper, images and voice inherited.'
director['beats']=[];story['scenes']=[];assets['beats']=[]
for s in mapped:
 sid=s['id'];bridge=s['kind']=='chapter';original=sid if not bridge else next(c['first'] for c in chapters if c['id']==s['chapterId'])
 dp=copy.deepcopy(original_director[original]);sb=copy.deepcopy(original_story[original]);ap=copy.deepcopy(original_assets[original])
 for item in [dp,sb,ap]:item.update({'id':sid,'start_sec':s['start'],'end_sec':s['end']})
 dp.update({'entry_visual':s['title'],'visual_reason':'Orient the viewer inside the chapter and then explain the current subtopic.','camera_or_motion':'Stable chapter header and agenda; body-only mask or sequential focus; no text scaling.','sound_cue':'Music enters only on a chapter plate; otherwise continued or dry narration.','transition_out':'Shared chapter title/agenda persist; only the body changes.','asset_id':sid,'first_visual_change_sec':.3})
 sb.update({'title':s['title'],'template':'chapter-editorial' if s['kind'] not in ['cover','end'] else sb['template'],'entry_visual':s['title'],'purpose':'Make chapter and active subtopic clear before reading the example.','first_change_sec':.3,'prototype_required':s['kind'] not in ['cover','end'],'content':[s['title'],*s['nodes'],s['sub']],'motion_recipes':['focus-shift'],'beats':[{'at_sec':0,'visual':s['title'],'action':'Visible chapter title and full agenda scaffold'},{'at_sec':.3,'visual':s['sub'],'action':'Body-only reveal or chapter focus settle'}]+[{'at_sec':x,'visual':s['nodes'][min(i,len(s['nodes'])-1)] if s['nodes'] else s['title'],'action':'Narration-matched focus on the visible concept'} for i,x in enumerate(s['cues']) if .4<x<s['end']-s['start']-.1]})
 if bridge:
  dp.update({'narrative_role':'hook','visual_mode':'motion','entry_mode':'meaningful','asset_provenance':'Owned chapter typography; no new factual claim','intensity':'calm'})
  sb.update({'role':'emphasis','intensity':'calm','music_cue':'Chapter '+s['chapterId']+' entrance','content':[s['title'],*s['nodes']]})
  ap.update({'copy':s['title'],'visual_role':'emphasis','asset_type':'generated-layout','fact_ids':[],'source_ids':[],'asset_path':None,'provenance':'Owned chapter typography','rights':'owned'})
 if s['kind'] in ['cover','end']:sb['motion_recipes']=original_story[original]['motion_recipes']
 if ap.get('asset_path') and not Path(ap['asset_path']).is_absolute():ap['asset_path']=str((P/ap['asset_path']).resolve())
 director['beats'].append(dp);story['scenes'].append(sb);assets['beats'].append(ap)
dump(D/'director-plan.json',director);dump(D/'video-storyboard.json',story);dump(D/'asset-plan.json',assets);dump(D/'fact-pack.json',read('fact-pack.json'))
dump(D/'timing-checks.json',{'voice_pcm_preserved':True,'all_original_voice_spans':len(spans),'scenes_contiguous':True,'no_caption_during_chapter_pause':True,'words':len(timedwords),'captions':len(captions),'duration':duration,'music_entrances_match_chapters':all(c['id']=='opening' or abs(c['start']-next(ch['start'] for ch in chapters if ch['id']==c['id']))<.001 for c in cue_log)})
print(json.dumps({'duration':duration,'holds':holds,'chapters':[(c['id'],c['start']) for c in chapters],'sample_start':chapters[2]['start']-6,'sample_end':chapters[3]['voiceStart']+16},indent=2))
