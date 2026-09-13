import subprocess,json,hashlib
from pathlib import Path
p=Path(__file__).resolve().parent
frames=list((p/'blender'/'frames').glob('frame_*.png'));assert len(frames)==432,len(frames)
subprocess.run(['ffmpeg','-v','error','-y','-framerate','24','-i',str(p/'blender/frames/frame_%04d.png'),'-c:v','libx264','-preset','slow','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',str(p/'gripper-refined.mp4')],check=True)
report={}
for f in [p/'gripper-refined.mp4',*[p/'audio'/f'{k}.mp3' for k in 'DEF']]:
 subprocess.run(['ffmpeg','-v','error','-i',str(f),'-f','null','-'],check=True)
 meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(f)]));report[f.name]={'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'bytes':f.stat().st_size,'duration':meta['format']['duration'],'streams':[{k:s[k] for k in ['codec_name','width','height','r_frame_rate','sample_rate'] if k in s} for s in meta['streams']]}
(p/'qa/artifacts.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))

assert abs(float(report['gripper-refined.mp4']['duration'])-18)<.05
assert (p/'blender/hero-4k.png').is_file()
(p/'ready.json').write_text(json.dumps({'ready':True,'duration':18,'frames':432,'width':1920,'height':1080}))
