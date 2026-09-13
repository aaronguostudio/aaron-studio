from pathlib import Path
import subprocess,json,hashlib
p=Path(__file__).resolve().parent
files=[p/'lab-revision.mp4',p/'gripper-study.mp4']+[p/'audio'/f'{x}.mp3' for x in 'ABC'];out=[]
for f in files:
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(f)]));subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(f),'-f','null','-'],check=True,capture_output=True)
 row=dict(path=str(f.relative_to(p)),duration=float(probe['format']['duration']),sha256=hashlib.file_digest(f.open('rb'),'sha256').hexdigest(),streams=[{k:s.get(k) for k in ['codec_type','width','height','r_frame_rate','sample_rate']} for s in probe['streams']],decode='pass')
 if f.suffix=='.mp3':
  r=subprocess.run(['ffmpeg','-hide_banner','-i',str(f),'-af','loudnorm=print_format=json','-f','null','-'],check=True,capture_output=True,text=True);s=r.stderr;row['loudness']=json.loads(s[s.rfind('{'):s.rfind('}')+1]);assert float(row['loudness']['input_tp'])<=-1.4
 out.append(row)
(p/'qa/artifacts.json').write_text(json.dumps(out,indent=2)+'\n');print([(x['path'],x['duration']) for x in out])
