from pathlib import Path
import json,subprocess
p=Path(__file__).resolve().parent;d=json.loads((p/'timeline.json').read_text());frames=[0]+[round((s['voiceStart']+min(5,(s['end']-s['voiceStart'])/2))*30)for s in d['scenes']]+[round((d['endCardStart']+2)*30)]
for i in range(0,len(frames),12):
 fs=frames[i:i+12];select='+'.join(f'eq(n,{f})'for f in fs)
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(p/'film-picture.mp4'),'-vf',f"select='{select}',scale=480:270,tile=4x3",'-frames:v','1',str(p/'qa'/f'encoded-board-{i//12}.png')],check=True)
(p/'qa/picture-samples.json').write_text(json.dumps({'frames':frames,'method':'Sequential decode of final encoded picture'},indent=2))
