from pathlib import Path
import json, subprocess, sys
from PIL import Image, ImageDraw
D=Path(__file__).resolve().parent
mode=sys.argv[1] if len(sys.argv)>1 else 'prototype'
t=json.loads((D/'timeline.json').read_text());offset=5284 if mode=='prototype' else 0
source=D/'prototype.mp4' if mode=='prototype' else D.parent.parent/'video-v5.mp4'
indices=[];labels={}
def add(sec,label):
 i=round(sec*30)-offset
 if i>=0 and (mode!='prototype' or i<2562):indices.append(i);labels[i]=label
for s in t['scenes']:
 if s['kind']=='chapter' and (mode!='prototype' or s['id'] in ['bridge-customers','bridge-product']):
  for delta in [-1/30,0,.2,.4,.6,.8,s['end']-s['start']-1/30,s['end']-s['start']+1/30]:add(s['start']+delta,s['id']+f' {delta:+.2f}s')
 elif mode!='prototype':add((s['start']+s['end'])/2,s['id']+' midpoint')
 elif s['id'] in ['s16','s17','s18','s20']:add(s['start']+1.3,s['id'])
if mode!='prototype':
 for scene in t['scenes']:
  if scene['kind']=='flow':
   for j,cue in enumerate(scene['cues'][1:],1):
    for fraction in [0,.25,.5,.75,1]:
     add(scene['start']+cue-.65+.65*fraction,scene['id']+f' connector {j} {fraction:.2f}')
indices=sorted(set(indices));out=D/(mode+'-frames');out.mkdir(exist_ok=True)
def balanced(items):
 if len(items)==1:return items[0]
 split=len(items)//2
 return '('+balanced(items[:split])+'+'+balanced(items[split:])+')'
expr=balanced([f'eq(n,{i})' for i in indices])
subprocess.run(['ffmpeg','-v','error','-y','-i',str(source),'-vf',f"select='{expr}',scale=640:360",'-vsync','0',str(out/'%03d.jpg')],check=True)
dump=[{'frame':i,'seconds':(i+offset)/30,'label':labels[i]} for i in indices]
(out/'frames.json').write_text(json.dumps(dump,indent=2)+'\n')
for page in range((len(indices)+11)//12):
 chunk=indices[page*12:(page+1)*12];canvas=Image.new('RGB',(1920,4*388),(245,242,234));draw=ImageDraw.Draw(canvas)
 for j,i in enumerate(chunk):
  x=(j%3)*640;y=(j//3)*388
  with Image.open(out/f'{page*12+j+1:03}.jpg') as im:canvas.paste(im,(x,y+26))
  draw.text((x+10,y+5),f'{(i+offset)/30:.2f}s  {labels[i]}',fill=(25,30,25))
 canvas.save(out/f'contact-{page+1:02}.jpg',quality=90)
print(mode,len(indices),'frames',len(list(out.glob('contact-*.jpg'))),'contact sheets')
