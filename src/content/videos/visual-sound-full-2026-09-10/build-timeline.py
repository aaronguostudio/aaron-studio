from pathlib import Path
import json,subprocess,math,re
p=Path(__file__).resolve().parent;root=p.parents[3];specs=json.loads((p/'script-segments.json').read_text());scenes=[];caps=[];audio=[];t=0
for s in specs:
 f=p/'audio'/f"{s['id']}.mp3";duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(f)]))
 a=json.loads(f.with_suffix('.json').read_text());a=a.get('normalized_alignment')or a['alignment'];chars=''.join(a['characters']);words=[]
 for m in re.finditer(r'\S+',chars):words.append(dict(word=m.group(),start=a['character_start_times_seconds'][m.start()],end=a['character_end_times_seconds'][m.end()-1]))
 lead=6 if s['id']=='intro' else 3 if s['chapter'] else .5
 voice=round((t+lead)*30)/30;end=math.ceil((voice+duration+.25)*30)/30
 if s['id']=='listen':end+=6
 mapped=[dict(word=w['word'],start=voice+w['start'],end=voice+w['end'])for w in words];groups=[];g=[]
 for w in mapped:
  if g and (len(' '.join(x['word']for x in g+[w]))>64 or len(g)>=11):groups.append(g);g=[]
  g.append(w)
  if re.search(r'[.!?]$',w['word']):groups.append(g);g=[]
 if g:groups.append(g)
 merged=[]
 for group in groups:
  if merged and len(group)<=2 and not re.search(r'[.!?]$',merged[-1][-1]['word']) and len(' '.join(w['word'] for w in merged[-1]+group))<83:merged[-1]+=group
  else:merged.append(group)
 groups=merged
 caps += [dict(start=g[0]['start'],end=g[-1]['end'],text=' '.join(w['word']for w in g),scene=s['id'])for g in groups]
 scenes.append({**s,'start':t,'end':end,'voiceStart':voice,'words':mapped})
 audio.append(dict(id=s['id'],file=str(f),sourceStart=0,sourceEnd=duration,start=voice,end=voice+duration,retained=False));t=end
out=dict(fps=30,durationFrames=round((t+4)*30),endCardStart=t,scenes=scenes,captions=caps,audio=audio,language='en-US',voice='F / Brian',chapterNames={s['chapter']:s['chapterTitle']for s in scenes if s['chapter']})
(p/'timeline.json').write_text(json.dumps(out,indent=2));(root/'tiles/aaron-video-gen/remotion/src/projects/visual-sound-full/data.ts').write_text('export const data = '+json.dumps(out)+';\n')
(p/'youtube-script.md').write_text('# This Sand Sings\n\n'+'\n\n'.join('## '+s['title']+'\n\n'+s['text']for s in scenes)+'\n')
def ts(t):
 ms=round(t*1000);return f'{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}'
(p/'captions.en.srt').write_text('\n\n'.join(f"{i+1}\n{ts(c['start'])} --> {ts(c['end'])}\n{c['text']}"for i,c in enumerate(caps))+'\n')
print('Duration',out['durationFrames']/30,'seconds; words',sum(len(s['words'])for s in scenes))
print([(s['id'],round(s['start'],1),round(s['end']-s['start'],1))for s in scenes])
