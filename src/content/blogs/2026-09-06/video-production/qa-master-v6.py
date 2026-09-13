from pathlib import Path
import subprocess,json,math,re
p=Path(__file__).resolve().parents[1];out=p/'video-production'/'v6-qa';out.mkdir(exist_ok=True);d=json.loads((p/'video-production'/'render-data-v6.json').read_text())
video=p/'video-v6-nomusic.mp4'
meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)]));v=next(s for s in meta['streams'] if s['codec_type']=='video');assert(v['width'],v['height'])==(1920,1080);assert v['r_frame_rate']=='30/1';assert abs(float(meta['format']['duration'])-d['duration'])<.1
# Select every scene's entry, midpoint and exit in a single sequential decode.
frames={}
for s in d['scenes']:
 start=round(s['start']*30);end=round(s['end']*30)-1
 for label,f in [('entry',start),('mid',(start+end)//2),('exit',end)]:frames.setdefault(f,[]).append((s['id'],label))
def balanced(items):
 if len(items)==1:return items[0]
 mid=len(items)//2;return '('+balanced(items[:mid])+'+'+balanced(items[mid:])+')'
indices=sorted(frames);expr=balanced([f'eq(n\\,{n})' for n in indices]);folder=out/'encoded-frames';folder.mkdir(exist_ok=True)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(video),'-vf',f'select={expr},scale=480:-1','-vsync','0',str(folder/'frame-%03d.png')],check=True)
from PIL import Image,ImageDraw
frame_paths={idx:folder/f'frame-{i+1:03}.png' for i,idx in enumerate(indices)}
for page in range(3):
 sheet=Image.new('RGB',(1440,1200),'#f4f1e9');draw=ImageDraw.Draw(sheet)
 for i,s in enumerate(d['scenes'][page*12:(page+1)*12]):
  idx=(round(s['start']*30)+round(s['end']*30)-1)//2;im=Image.open(frame_paths[idx]);x=(i%3)*480;y=(i//3)*300;sheet.paste(im,(x,y));draw.text((x+10,y+276),f"{s['id']}  {s['start']:.1f}–{s['end']:.1f}s",fill='#2b2e2c')
 sheet.save(out/f'master-contact-{page+1}.png')
selected=['s01','s09','s12','s23','s33','s35'];sheet=Image.new('RGB',(960,1800),'#f4f1e9');draw=ImageDraw.Draw(sheet)
for i,sid in enumerate(selected):
 s=next(s for s in d['scenes'] if s['id']==sid);start=round(s['start']*30);left=start-1;right=start
 for j,k in enumerate([left,right]):
  im=Image.open(frame_paths[k]);sheet.paste(im,(j*480,i*300));draw.text((j*480+10,i*300+278),f'{sid} '+('before' if j==0 else 'after'),fill='#2b2e2c')
sheet.save(out/'master-boundaries.png')
probe=subprocess.run(['ffmpeg','-hide_banner','-i',str(video),'-af','loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
levels=json.loads(probe[probe.rfind('{'):probe.rfind('}')+1]);tail=subprocess.run(['ffmpeg','-hide_banner','-sseof','-1','-i',str(video),'-af','volumedetect','-f','null','-'],capture_output=True,text=True,check=True).stderr
mean=re.search(r'mean_volume: ([\-\w.]+) dB',tail).group(1)
report={'video':str(video.name),'duration':meta['format']['duration'],'width':v['width'],'height':v['height'],'frame_rate':v['r_frame_rate'],'frames':v['nb_frames'],'audio_loudness':levels,'last_second_mean_db':mean,'selected_frames':len(indices),'checks':'36 scenes entry/mid/exit decoded sequentially, technical stream checks passed; image sheets pending visual inspection'}
(out/'master-technical-qa.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
