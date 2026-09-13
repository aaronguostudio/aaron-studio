from pathlib import Path
import subprocess,json,math
import numpy as np
p=Path(__file__).resolve().parents[2];out=Path(__file__).resolve().parent;sr=48000
video=p/'video-v7.mp4'
def decode(path):return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-vn','-ac','2','-ar',str(sr),'-f','f32le','-']),dtype='<f4').reshape(-1,2)
y=decode(video);v=decode(out/'voice-retimed.wav');m=decode(out/'music-stem.wav');n=min(len(y),len(v));y=y[:n];v=v[:n];m=m[:n]
checks=[]
for t in [5,137,190,201,287,299,473,484,496,505]:
 a=round(t*sr);b=a+2*sr;x=v[a:b].reshape(-1).astype(np.float64);z=m[a:b].reshape(-1).astype(np.float64);target=y[a:b].reshape(-1).astype(np.float64)
 coeff=np.linalg.lstsq(np.stack([x,z],axis=1),target,rcond=None)[0];gain=float(coeff[0]);checks.append({'start':t,'estimated_voice_gain':gain,'voice_gain_db':20*math.log10(max(1e-9,gain)),'music_gain_coefficient':float(coeff[1])})
assert all(abs(x['voice_gain_db'])<.15 for x in checks),'Unexpected encoded voice attenuation'
r=subprocess.run(['ffmpeg','-hide_banner','-i',str(video),'-vn','-af','loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr;l=json.loads(r[r.rfind('{'):r.rfind('}')+1]);assert float(l['input_tp'])<=-1.5
last=y[-sr:];tail=20*math.log10(max(1e-12,float(np.sqrt(np.mean(last.astype(np.float64)**2)))));assert tail<-60
meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)]));stream=next(s for s in meta['streams'] if s['codec_type']=='video');assert (stream['width'],stream['height'],stream['r_frame_rate'],int(stream['nb_frames']))==(1920,1080,'30/1',15384)
report={'encoded_file':video.name,'duration':meta['format']['duration'],'frames':15384,'voice_projection_checks':checks,'loudness':l,'last_second_rms_dbfs':tail,'meaning':'Voice coefficients are estimated against the known voice and music stems after AAC encoding; exact unity and unmodified samples separately verified in the lossless voice stem. Human listening review is still pending.'}
(out/'encoded-sound-qa.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
