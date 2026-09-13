from pathlib import Path
import subprocess,json,hashlib
p=Path(__file__).resolve().parent;video=p/'film.mp4';d=json.loads((p/'timeline.json').read_text())
def run(args):
 r=subprocess.run(args,capture_output=True,text=True,check=True);return r.stdout+r.stderr
probe=json.loads(run(['ffprobe','-v','error','-show_entries','format=duration,size:stream=codec_name,width,height,r_frame_rate,sample_rate,channels','-of','json',str(video)]));(p/'qa/probe.json').write_text(json.dumps(probe,indent=2))
assert abs(float(probe['format']['duration'])-d['durationFrames']/30)<.1
filters={'full-contact.jpg':'fps=1/8,scale=480:-1,tile=5x6','science-contact.jpg':"select='"+'+'.join(f'eq(n,{round(s*30)})' for s in [51,57,66,73,80,89,98,103,111,120,126,133,143,149,158,168,176,183])+"',scale=480:-1,tile=3x6",'boundaries.jpg':"select='"+'+'.join(f'eq(n,{n})' for a in [d['introFrames']]+[round(s['start']*30) for s in d['scenes'][1:]]+[d['endStartFrame']] for n in [a-1,a])+"',scale=480:-1,tile=4x4",'ending.jpg':"select='"+'+'.join(f'eq(n,{n})' for n in [d['durationFrames']-100,d['durationFrames']-60,d['durationFrames']-30,d['durationFrames']-1])+"',scale=480:-1,tile=4x1"}
for file,vf in filters.items():run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(video),'-vf',vf,'-frames:v','1',str(p/'qa'/file)])
log=run(['ffmpeg','-hide_banner','-nostats','-i',str(video),'-af','loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json','-f','null','-']);(p/'qa/loudness.txt').write_text(log)
tail=run(['ffmpeg','-hide_banner','-nostats','-sseof','-1','-i',str(video),'-af','volumedetect','-f','null','-']);(p/'qa/tail-volume.txt').write_text(tail)
sha=hashlib.sha256(video.read_bytes()).hexdigest();measure=json.loads(log[log.rfind('{'):log.rfind('}')+1]);assert float(measure['input_tp'])<=-1.0
result=dict(duration=probe['format']['duration'],bytes=probe['format']['size'],sha256=sha,loudness=measure)
(p/'qa/summary.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2));print('\n'.join(x for x in tail.splitlines() if 'volume:' in x))
