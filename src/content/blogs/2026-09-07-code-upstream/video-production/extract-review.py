from pathlib import Path
import json,subprocess
p=Path(__file__).resolve().parent
frames=sorted(set(x['frame'] for x in json.loads((p/'frame-index.json').read_text())))
terms=[f'eq(n\\,{n})' for n in frames]
while len(terms)>1:
 terms=['('+terms[i]+'+'+terms[i+1]+')' if i+1<len(terms) else terms[i] for i in range(0,len(terms),2)]
expr=terms[0];d=p/'frames';d.mkdir(exist_ok=True)
subprocess.run(['ffmpeg','-v','error','-y','-i',str(p/'video-silent.mp4'),'-vf',f'select={expr},scale=640:360','-fps_mode','vfr',str(d/'frame-%03d.jpg')],check=True)
for i in range(0,len(frames),9):
 subprocess.run(['ffmpeg','-v','error','-y','-start_number',str(i+1),'-i',str(d/'frame-%03d.jpg'),'-vf','tile=3x3','-frames:v','1',str(p/f'contact-{i//9+1:02}.jpg')],check=True)
print('Encoded samples:',len(frames))
