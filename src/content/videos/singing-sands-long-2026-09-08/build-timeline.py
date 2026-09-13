from pathlib import Path
import json,math,re
p=Path(__file__).resolve().parent;root=p.parents[3]
old=p.parent/'singing-sands-pilot-2026-09-08';full=p.parent/'singing-sands-full-2026-09-08'
sources={'p':(old/'audio-generation-manifest.json',old/'audio.mp3'),'e':(full/'extension/audio-generation-manifest.json',full/'extension/audio.mp3'),'n':(p/'new-narration/audio-generation-manifest.json',p/'new-narration/audio.mp3')}
ms={k:json.loads(v[0].read_text()) for k,v in sources.items()}
# source, segment, id, visual, title, chapter number; chapter leaders are music-only.
specs=[('p',0,'intro','field','The desert has a voice',0),('p',1,'avalanche','photo','A whole hillside, making sound',0),('p',2,'conditions','dry','The conditions matter',0),('n',0,'note','frequency','A pattern in the noise',1),('e',0,'flow','flow','Motion between grains',0),('e',1,'sync','sync','Finding a shared rhythm',0),('n',1,'air','air','From movement to your ears',0),('e',2,'lab','lab','A song without a dune',2),('n',2,'method','method','Change the conditions. Measure the result.',0),('e',3,'sort','sort','Selecting the singers',0),('n',3,'pitch','pitch','Pitch is not loudness',0),('e',4,'debate','layers','One sound. Different explanations.',3),('n',4,'later','burps','Burps and booms',0),('n',5,'questions','questions','Ask a sharper question',0),('n',6,'silo','silo','When a factory sings',4),('n',7,'engineering','silo-detail','The engineering problem',0),('n',8,'gripper','gripper','Grains that grip',5),('n',9,'meaning','meaning','Beyond the first surprise',0),('e',5,'resolve','resolve','Back to the landscape',6)]
chapnames={1:'A pattern in the noise',2:'Bring it into the laboratory',3:'Why the debate continues',4:'When a factory sings',5:'Grains that grip',6:'Listen differently'}
t=0;scenes=[];caps=[];audio=[]
for key,idx,id,visual,title,ch in specs:
 m=ms[key];seg=m['timeline']['segments'][idx];lead=5 if id=='intro' else 3 if ch else .3
 start=t;voice=round((start+lead)*30)/30;duration=seg['duration'];end=math.ceil((voice+duration)*30)/30
 words=[w for w in m['timeline']['wordTimings'] if w['start']>=seg['start']-.01 and w['start']<seg['end']-.01]
 mapped=[dict(word=w['word'],start=voice+w['start']-seg['start'],end=voice+w['end']-seg['start']) for w in words]
 groups=[];g=[]
 for w in mapped:
  if g and (len(' '.join(a['word'] for a in g+[w]))>70 or len(g)>=13):groups.append(g);g=[]
  g.append(w)
  if re.search(r'[.!?]$',w['word']):groups.append(g);g=[]
 if g:groups.append(g)
 caps.extend(dict(start=g[0]['start'],end=g[-1]['end'],text=' '.join(w['word'] for w in g),scene=id) for g in groups)
 scenes.append(dict(id=id,start=start,end=end,voiceStart=voice,title=title,visual=visual,chapter=ch,chapterTitle=chapnames.get(ch,''),words=mapped,source=key,sourceSegment=idx))
 audio.append(dict(id=id,file=str(sources[key][1]),sourceStart=seg['start'],sourceEnd=seg['end'],start=voice,end=voice+duration,retained=key!='n'))
 t=end
# Exact accepted last line from the pilot, selected using word timings.
m=ms['p'];listen=next(w['start'] for w in m['timeline']['wordTimings'] if w['word']=='Listen');last=m['timeline']['duration'];v=t+.7;end=math.ceil((v+last-listen+6)*30)/30
words=[dict(word=w['word'],start=v+w['start']-listen,end=v+w['end']-listen) for w in m['timeline']['wordTimings'] if w['start']>=listen]
scenes.append(dict(id='listen',start=t,end=end,voiceStart=v,title='Listen again.',visual='field',chapter=0,chapterTitle='',words=words,source='p',sourceSegment=3))
g=[]
for w in words:
 g.append(w)
 if re.search(r'[.!?]$',w['word']):caps.append(dict(start=g[0]['start'],end=g[-1]['end'],text=' '.join(x['word'] for x in g),scene='listen'));g=[]
audio.append(dict(id='listen',file=str(sources['p'][1]),sourceStart=listen,sourceEnd=last,start=v,end=v+last-listen,retained=True))
d=dict(fps=30,durationFrames=round((end+4)*30),endCardStart=end,scenes=scenes,captions=caps,audio=audio,language='en',chapterNames=chapnames)
(p/'timeline.json').write_text(json.dumps(d,indent=2)+'\n');(root/'tiles/aaron-video-gen/remotion/src/projects/singing-sands-long/data.ts').write_text('export const data = '+json.dumps(d,indent=2)+';\n')
# Canonical spoken script and captions share the exact audio requests.
script='# The desert has a voice\n\n'
for i,s in enumerate(scenes):script+=('## [HOOK]\n' if i==0 else f"## [SLIDE: {s['title']} — {s['visual']}.png]\n")+' '.join(w['word'] for w in s['words'])+'\n\n'
(p/'youtube-script.md').write_text(script)
print('duration',d['durationFrames']/30,'word count',sum(len(s['words']) for s in scenes));print([(s['id'],round(s['start'],2),round(s['end'],2)) for s in scenes])
