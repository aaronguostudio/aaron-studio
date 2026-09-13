from pathlib import Path
import json,subprocess,re
p=Path(__file__).resolve().parent;arts=json.loads((p/'qa/artifacts.json').read_text());tails={}
for a in arts:
 r=subprocess.run(['ffmpeg','-hide_banner','-sseof','-1','-i',str(p/a['file']),'-vn','-af','volumedetect','-f','null','-'],capture_output=True,text=True,check=True);m=re.search(r'mean_volume: ([\-\w.]+) dB',r.stderr);tails[a['file']]=m.group(1);assert float(m.group(1))<-60
(p/'qa/endings.json').write_text(json.dumps(tails,indent=2))
d=json.loads((p/'timeline.json').read_text());assert d['durationFrames']/30>=450
assert all(c['start']<c['end']<=d['durationFrames']/30 for c in d['captions'])
assert all(a['end']<=b['start']+.05 for a,b in zip(d['captions'],d['captions'][1:]))
for s in d['scenes']:
 assert all(s['voiceStart']<=w['start']<=w['end']<=s['end']for w in s['words'])
print('Caption timing, duration and encoded ending-silence gates passed:',tails)
