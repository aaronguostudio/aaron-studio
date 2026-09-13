from pathlib import Path
import json,subprocess,hashlib
import numpy as np
P=Path(__file__).resolve().parents[1]; R=P.parents[3]; O=P/'video-production'; rate=48000
m=json.loads((O/'timeline.json').read_text());duration=m['duration'];size=round(duration*rate)
def decode(path):
 raw=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','f32le','-ac','2','-ar',str(rate),'-'],stdout=subprocess.PIPE,check=True).stdout
 return np.frombuffer(raw,dtype='<f4').reshape(-1,2).copy()
def save(path,samples):
 subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ac','2','-ar',str(rate),'-i','-','-c:a','pcm_f32le',str(path)],input=samples.astype('<f4').tobytes(),check=True)
voice=decode(P/'audio.mp3');stem=np.zeros((size,2),np.float32);offset=round(m['audioOffset']*rate);stem[offset:offset+len(voice)]=voice
sources={'paper':{'path':str(R/'src/content/music-visualizer/paper-moon-pilot/music.mp3'),'lufs':-22.83},'turning':{'path':str(R/'src/content/blogs/2026-09-06/video-production/v7/music/turning-page.mp3'),'lufs':-10.52},'shared':{'path':str(R/'src/content/blogs/2026-09-06/video-production/v7/music/common-ground.mp3'),'lufs':-10.99}}
cues=[dict(id='opening',track='paper',start=0,length=28,fade_in=4,fade_out=7,gain=.24),dict(id='from-deployment-to-tools',track='turning',start=142,length=28,fade_in=6,fade_out=7,gain=.24),dict(id='memory-to-direction',track='shared',start=260,length=28,fade_in=6,fade_out=7,gain=.24),dict(id='natural-writing',track='turning',start=329,length=28,fade_in=6,fade_out=7,gain=.23),dict(id='closing',track='paper',start=444,length=40,fade_in=8,fade_out=7,gain=.24)]
score=np.zeros_like(stem);decoded={}
for key,source in sources.items():
 raw=decode(source['path']);source['sha256']=hashlib.sha256(Path(source['path']).read_bytes()).hexdigest();source['duration_seconds']=len(raw)/rate;decoded[key]=raw*10**((-23-source['lufs'])/20)
for cue in cues:
 n=round(cue['length']*rate);audio=decoded[cue['track']][:n].copy();assert len(audio)==n
 t=np.arange(n)/rate;fade=np.ones(n);enter=t<cue['fade_in'];fade[enter]=.5-.5*np.cos(np.pi*t[enter]/cue['fade_in']);exit=t>cue['length']-cue['fade_out'];fade[exit]=.5-.5*np.cos(np.pi*(cue['length']-t[exit])/cue['fade_out']);audio*=fade[:,None]*cue['gain'];a=round(cue['start']*rate);score[a:a+n]+=audio
mix=stem+score
assert np.array_equal(stem[offset:offset+len(voice)],voice)
save(O/'voice-stem.wav',stem);save(O/'music-stem.wav',score);save(O/'mix.wav',mix)
plan={'sample_rate':rate,'channels':2,'duration':duration,'voice_gain':1.,'voice_source':'audio.mp3','voice_offset_seconds':m['audioOffset'],'voice_source_sha256':hashlib.sha256((P/'audio.mp3').read_bytes()).hexdigest(),'voice_pcm_exact_match':True,'narration_regenerated':False,'sidechain':False,'limiter':False,'compression':False,'sources':sources,'cues':cues,'coverage_seconds':sum(c['length'] for c in cues),'peak_dbfs':float(20*np.log10(np.max(np.abs(mix)))),'final_second_peak_dbfs':float(20*np.log10(max(np.max(np.abs(mix[-rate:])),1e-12))),'rights_status':'Internal scored review; retain prior author music choices and provider provenance. Publication clearance is checked at release, not asserted by this mix.'}
(O/'sound-plan.json').write_text(json.dumps(plan,indent=2)+'\n');print(json.dumps({k:v for k,v in plan.items() if k not in ['sources','cues']},indent=2))
