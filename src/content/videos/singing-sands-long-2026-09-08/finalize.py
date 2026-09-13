from pathlib import Path
import json, subprocess, hashlib, html
P=Path(__file__).resolve().parent
d=json.loads((P/'timeline.json').read_text()); scenes={s['id']:s for s in d['scenes']}
def run(args): subprocess.run(args,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
def mux(pic,out,start,duration,total):
 run(['ffmpeg','-y','-i',str(pic),'-ss',str(start),'-t',str(duration),'-i',str(P/'film-mix.wav'),'-filter_complex',f'[1:a]apad,afade=t=out:st={max(0,total-1.5)}:d=1.5[a]','-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-t',str(total),'-movflags','+faststart',str(out)])
full=d['durationFrames']/30
mux(P/'film-picture.mp4',P/'film.mp4',0,full,full)
shorts=[dict(id='SandVoiceShort',title='This sound is sand.',start=0,end=scenes['conditions']['end']),dict(id='SandLabShort',title='A song without a dune.',start=next(w['start'] for w in scenes['lab']['words'] if w['word']=='Researchers'),end=scenes['method']['end']),dict(id='SandGripperShort',title='A robot gripper made of grains.',start=next(w['start'] for w in scenes['gripper']['words'] if w['word']=='Researchers'),end=scenes['gripper']['end'])]
for s in shorts:
 s['duration']=round((s['end']-s['start']+2.5)*30)/30
 s['file']='shorts/'+s['id']+'.mp4'
 mux(P/'shorts'/(s['id']+'-picture.mp4'),P/s['file'],s['start'],s['end']-s['start'],s['duration'])
(P/'shorts/manifest.json').write_text(json.dumps({'language':'en','master':'film.mp4','method':'Word-boundary source selection, portrait re-layout, original master soundtrack, 2.5-second closing tail','shorts':shorts},indent=2)+'\n')
files=[P/'film.mp4']+[P/s['file'] for s in shorts]
report=[]
for f in files:
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(f)]))
 report.append(dict(file=str(f.relative_to(P)),sha256=hashlib.file_digest(f.open('rb'),'sha256').hexdigest(),bytes=f.stat().st_size,duration=float(probe['format']['duration']),streams=[{k:s.get(k) for k in ['codec_type','codec_name','width','height','sample_rate','channels']} for s in probe['streams']]))
(P/'qa/artifacts.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
