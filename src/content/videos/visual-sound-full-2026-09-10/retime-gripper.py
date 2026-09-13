import json,subprocess,re
from pathlib import Path
p=Path(__file__).resolve().parent;root=p.parents[3];d=json.loads((p/'timeline.json').read_text());s=next(s for s in d['scenes']if s['id']=='gripper');w=s['words'];v=s['voiceStart']
def at(word):return next(x['start']-v for x in w if re.sub(r'[^a-z]','',x['word'].lower())==word)
# Match semantic stages from the approved 18-second animation to the actual F take.
anchors=[(0,0),(2,max(.5,at('press')-1)),(4.2,at('conforms')),(7,at('apply')),(10,at('hold')),(12,at('release')),(16,at('again')),(18,at('again')+2)]
assert all(b[1]>a[1]for a,b in zip(anchors,anchors[1:])),anchors
filt=[]
for i,((a,ta),(b,tb))in enumerate(zip(anchors,anchors[1:])):filt.append(f'[0:v]trim=start={a}:end={b},setpts=(PTS-STARTPTS)*{(tb-ta)/(b-a)},fps=30,setsar=1[v{i}]')
filt.append(''.join(f'[v{i}]'for i in range(len(anchors)-1))+f'concat=n={len(anchors)-1}:v=1:a=0,tpad=stop_mode=clone:stop_duration=40,trim=duration={s["end"]-v}[out]')
(p/'qa/gripper-retime.json').write_text(json.dumps({'anchors':anchors,'duration':s['end']-v,'voice':'F'},indent=2));(p/'qa/gripper-filter.txt').write_text(';'.join(filt))
subprocess.run(['ffmpeg','-v','error','-y','-i',str(p/'assets/gripper-refined.mp4'),'-filter_complex_script',str(p/'qa/gripper-filter.txt'),'-map','[out]','-c:v','libx264','-crf','17','-preset','fast','-pix_fmt','yuv420p',str(root/'tiles/aaron-video-gen/remotion/public/visual-sound-full/gripper-timed.mp4')],check=True)
