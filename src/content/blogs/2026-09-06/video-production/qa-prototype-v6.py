from pathlib import Path
import json,subprocess
from PIL import Image,ImageDraw
p=Path(__file__).resolve().parents[1];out=p/'video-production';clips=json.loads((out/'v6-preview-clips.json').read_text());d=json.loads((out/'render-data.json').read_text());ids=['s07','s13','s17','s22','s23','s28'];folder=out/'prototype-v6-frames';folder.mkdir(exist_ok=True)
frames=[]
for c in clips:frames.extend([c['from'],c['from']+c['frames']//2,c['from']+c['frames']-1])
def balanced(a):
 if len(a)==1:return a[0]
 n=len(a)//2;return '('+balanced(a[:n])+'+'+balanced(a[n:])+')'
expr=balanced([f'eq(n\\,{f})' for f in frames]);subprocess.run(['ffmpeg','-y','-v','error','-i',str(p/'video-visual-preview-v6.mp4'),'-vf',f'select={expr},scale=640:-1','-vsync','0',str(folder/'frame-%03d.png')],check=True)
sheet=Image.new('RGB',(1920,2340),'#f4f1e9');draw=ImageDraw.Draw(sheet)
for i,sid in enumerate(ids):
 for j in range(3):
  im=Image.open(folder/f'frame-{i*3+j+1:03}.png');sheet.paste(im,(640*j,390*i));draw.text((640*j+10,390*i+366),sid+' / '+['entry','middle','exit'][j],fill='#2b2e2c')
sheet.save(out/'prototype-v6-sequence.png')
# Compare corresponding source midpoints. All v5 frames were extracted sequentially.
indices=sorted({f for s in d['scenes'] for f in [round(s['start']*30),(round(s['start']*30)+round(s['end']*30)-1)//2,round(s['end']*30)-1]})
compare=Image.new('RGB',(1280,2340),'#f4f1e9');draw=ImageDraw.Draw(compare)
for i,sid in enumerate(ids):
 s=next(x for x in d['scenes'] if x['id']==sid);mid=(round(s['start']*30)+round(s['end']*30)-1)//2
 a=Image.open(out/'encoded-frames'/f'frame-{indices.index(mid)+1:03}.png').resize((640,360));b=Image.open(folder/f'frame-{i*3+2:03}.png');compare.paste(a,(0,390*i));compare.paste(b,(640,390*i));draw.text((10,390*i+366),sid+' / v5',fill='#2b2e2c');draw.text((650,390*i+366),sid+' / v6',fill='#2b2e2c')
compare.save(out/'v5-v6-comparison.png')
print('18 prototype frames and six before/after compositions extracted')
