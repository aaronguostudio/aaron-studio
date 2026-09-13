from pathlib import Path
import json,subprocess
from PIL import Image,ImageDraw
p=Path(__file__).resolve().parents[2];out=Path(__file__).resolve().parent;d=json.loads((p/'video-storyboard.json').read_text());scenes=d['scenes'];frames={}
for s in scenes:
 a=round(s['start_sec']*30);b=round(s['end_sec']*30)-1
 for f in [a,(a+b)//2,b]:frames.setdefault(f,[]).append(s['id'])
# Exact boundary windows also cover the four/five-frame visual carry after each inserted pause.
critical=[5915,5916,6016,6017,8876,8877,8964,8965,14377,14378,14489,14490,15383]
for f in critical:frames.setdefault(f,[])
def balanced(a):
 if len(a)==1:return a[0]
 k=len(a)//2;return '('+balanced(a[:k])+'+'+balanced(a[k:])+')'
indices=sorted(frames);expr=balanced([f'eq(n\\,{n})' for n in indices]);folder=out/'encoded-frames';folder.mkdir(exist_ok=True)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(p/'video-v7.mp4'),'-vf',f'select={expr},scale=480:-1','-vsync','0',str(folder/'frame-%03d.png')],check=True)
def frame(f):return Image.open(folder/f'frame-{indices.index(f)+1:03}.png')
for page in range(3):
 sheet=Image.new('RGB',(1920,1200),'#f4f1e9');draw=ImageDraw.Draw(sheet)
 for i,s in enumerate(scenes[page*13:page*13+13]):
  f=(round(s['start_sec']*30)+round(s['end_sec']*30)-1)//2;x=i%4*480;y=i//4*300;sheet.paste(frame(f),(x,y));draw.text((x+8,y+277),s['id']+' / '+str(round(s['start_sec'],2))+' s',fill='#2b2e2c')
 sheet.save(out/f'master-contact-{page+1}.png')
sheet=Image.new('RGB',(960,1800),'#f4f1e9');draw=ImageDraw.Draw(sheet)
for i,f in enumerate(critical[:-1]):
 x=i%2*480;y=i//2*300;sheet.paste(frame(f),(x,y));draw.text((x+8,y+277),f'{f/30:.3f}s / frame {f}',fill='#2b2e2c')
sheet.save(out/'master-boundaries.png');frame(15383).save(out/'last-frame.png')
(out/'frame-extraction.json').write_text(json.dumps({'scenes':len(scenes),'sampled_frames':len(indices),'critical_frames':critical,'method':'single sequential decode'},indent=2)+'\n');print('Extracted',len(indices),'frames from',len(scenes),'scenes')
