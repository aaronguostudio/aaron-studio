from pathlib import Path
import subprocess,json,hashlib
p=Path(__file__).resolve().parent
video=p/'pilot.mp4'
def run(args):
 r=subprocess.run(args,capture_output=True,text=True,check=True);return r.stdout+r.stderr
probe=json.loads(run(['ffprobe','-v','error','-show_entries','format=duration,size:stream=codec_name,width,height,r_frame_rate,sample_rate,channels','-of','json',str(video)]))
(p/'qa'/'probe.json').write_text(json.dumps(probe,indent=2))
filters={
 'pilot-contact.jpg':'fps=1/6,scale=480:-1,tile=4x3',
 'wipe-frames.jpg':"select='between(n,1248,1268)',scale=320:-1,tile=7x3",
 'boundaries.jpg':"select='"+'+'.join(f'eq(n,{n})' for a in [270,552,723,1010,1136,1477,1785,1920,2175] for n in [a-1,a])+"',scale=320:-1,tile=6x3",
 'ending.jpg':"select='eq(n,2140)+eq(n,2160)+eq(n,2180)+eq(n,2219)',scale=480:-1,tile=4x1"}
for file,vf in filters.items():run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(video),'-vf',vf,'-frames:v','1',str(p/'qa'/file)])
log=run(['ffmpeg','-hide_banner','-nostats','-i',str(video),'-af','loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json','-f','null','-']);(p/'qa'/'loudness.txt').write_text(log)
tail=run(['ffmpeg','-hide_banner','-nostats','-sseof','-1','-i',str(video),'-af','volumedetect','-f','null','-']);(p/'qa'/'tail-volume.txt').write_text(tail)
print('Duration',probe['format']['duration'],'bytes',probe['format']['size'],'sha256',hashlib.sha256(video.read_bytes()).hexdigest());print(log[log.rfind('{'):log.rfind('}')+1]);print('\n'.join(x for x in tail.splitlines() if 'volume:' in x))
