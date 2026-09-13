"""Build a reversible 60s sound-direction prototype; no canonical files changed."""
import json, hashlib, math, re, subprocess
from pathlib import Path
import numpy as np

HERE=Path(__file__).resolve().parent
PACKAGE=HERE.parent.parent
ROOT=PACKAGE.parents[3]
RATE=48000
START=411.8
END=469.6666666666667
HOLDS=[{'at':424.2,'duration':1.0,'reason':'Let the claim about real needs land.'},
       {'at':452.9,'duration':0.7,'reason':'A breath between the next project and optimism.'}]
DURATION=END-START+sum(h['duration'] for h in HOLDS)

def run(args):
    return subprocess.run(args,check=True,capture_output=True).stdout
def decode(path):
    return np.frombuffer(run(['ffmpeg','-v','error','-i',str(path),'-f','f32le','-ac','2','-ar',str(RATE),'-']),dtype='<f4').reshape(-1,2).copy()
def write(name,a):
    subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(RATE),'-ac','2','-i','pipe:0','-c:a','pcm_f32le',str(HERE/name)],input=a.astype('<f4').tobytes(),check=True)
def measure(path):
    p=subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-af','loudnorm=I=-18:TP=-1:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
    return json.loads(p.stderr[p.stderr.rfind('{'):p.stderr.rfind('}')+1])
def time_map(t):
    return t-START+sum(h['duration'] for h in HOLDS if t>=h['at'])
def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()

lock={str(f.relative_to(PACKAGE)):sha(f) for f in [PACKAGE/'audio.mp3',PACKAGE/'video-v2.mp4',PACKAGE/'youtube-script.md',PACKAGE/'video-production/timeline.json',ROOT/'tiles/aaron-video-gen/config/voice-profiles.json'] if f.is_relative_to(PACKAGE)}
lock['voice_profile_sha256']=sha(ROOT/'tiles/aaron-video-gen/config/voice-profiles.json')
(HERE/'preserve-lock.json').write_text(json.dumps(lock,indent=2)+'\n')

# Film uses the exact existing stereo voice stem at unit gain; only silence is inserted.
src=decode(PACKAGE/'video-production/voice-stem.wav')
parts=[]; previous=START; mappings=[]; offset=0
for h in HOLDS+[{'at':END,'duration':0}]:
    a,b=round(previous*RATE),round(h['at']*RATE)
    part=src[a:b]; parts.append(part)
    mappings.append({'source_start':previous,'source_end':h['at'],'output_start':offset/RATE,'samples':len(part)})
    offset+=len(part)
    if h['duration']: parts.append(np.zeros((round(h['duration']*RATE),2),np.float32));offset+=round(h['duration']*RATE)
    previous=h['at']
voice=np.concatenate(parts);music=np.zeros_like(voice)
assert len(voice)==round(DURATION*RATE)
checks=[]
for m in mappings:
    a=src[round(m['source_start']*RATE):round(m['source_end']*RATE)]
    b=voice[round(m['output_start']*RATE):round(m['output_start']*RATE)+m['samples']]
    checks.append(bool(np.array_equal(a,b)))
write('voice-reference.wav',voice)

def envelope(points,n):
    # Smooth cosine interpolation only on the music bus.
    ts=np.arange(n)/RATE; env=np.zeros(n)
    for (ta,va),(tb,vb) in zip(points,points[1:]):
        mask=(ts>=ta)&(ts<tb);u=(ts[mask]-ta)/(tb-ta)
        env[mask]=va+(vb-va)*(0.5-0.5*np.cos(np.pi*u))
    return env
cue_specs=[
 {'id':'reflection','start':2.5,'length':17.5,'points':[(0,0),(3,.4),(8.6,.4),(10.2,.75),(12,.42),(14,.32),(17.5,0)],'role':'A question takes shape, then leaves the product-learning passage dry.'},
 {'id':'possibility','start':29,'length':DURATION-30,'points':[(0,0),(4,.38),(11,.48),(13.1,.72),(14.2,.48),(17.6,.44),(20.3,.22),(23.3,.22),(26,.75),(DURATION-30,0)],'role':'Open toward the future; make room for the last sentence; resolve after it.'}
]
for c in cue_specs:
    path=HERE/(c['id']+'.mp3');a=decode(path);loud=measure(path); gain=10**((-24-float(loud['input_i']))/20)
    n=round(c['length']*RATE);assert len(a)>=n
    env=envelope(c['points'],n);part=a[:n]*gain*env[:,None]
    at=round(c['start']*RATE);music[at:at+n]+=part
    c.update({'source_sha256':sha(path),'measured_lufs':float(loud['input_i']),'normalization_gain':gain})
mix=voice+music
assert np.max(np.abs(mix))<1,'Do not limit the voice to fix an over-loud score'
write('music-stem.wav',music);write('directed-mix.wav',mix)

# Map all scene boundaries/cues; keep registered geometry and images. Captions
# follow complete thoughts and go away during the inserted reflection holds.
timeline=json.loads((PACKAGE/'video-production/timeline.json').read_text())
out={'duration':DURATION,'fps':30,'audioOffset':0,'scenes':[],'captions':[]}
for original in timeline['scenes']:
    if original['end']<=START:continue
    s=dict(original);s['start']=max(0,time_map(original['start']));s['end']=time_map(original['end'])
    s['cues']=[time_map(original['start']+c)-s['start'] for c in original['cues']]
    s['detailCue']=time_map(original['start']+original['detailCue'])-s['start'];out['scenes'].append(s)
words=[w for w in json.loads((PACKAGE/'audio-generation-manifest.json').read_text())['timeline']['wordTimings'] if w['start']+3>=START]
group=[]
for w in words:
    group.append(w)
    if re.search(r'[.!?:,]$',w['word']) or len(group)>=9 or w is words[-1]:
        out['captions'].append({'start':time_map(group[0]['start']+3),'end':time_map(group[-1]['end']+3),'text':' '.join(x['word'] for x in group)})
        group=[]
for i,c in enumerate(out['captions'][:-1]):c['end']=min(c['end'],out['captions'][i+1]['start'])
(HERE/'timeline.json').write_text(json.dumps(out,indent=2)+'\n')
renderer=ROOT/'tiles/aaron-video-gen/remotion/src/projects/code-upstream'
(renderer/'sound-review-data.ts').write_text('export const filmData = '+json.dumps(out)+';\n')
original=(renderer/'index.tsx').read_text()
(renderer/'sound-review.tsx').write_text(original.replace("from './data'","from './sound-review-data'"))

# Dry blind candidates use the same two-pass listening normalization, without
# speed/pitch changes. This is separate from the untouched voice in the film.
dry=decode(PACKAGE/'audio.mp3')[round(408.81052*RATE):]
write('original-raw.wav',dry)
auditions=[]
for file in ['original-raw.wav','pvc-directed-raw.mp3','aaron-performance-transfer-raw.mp3','commercial-guide-raw.mp3']:
    srcfile=HERE/file;m=measure(srcfile)
    name=file.replace('-raw','').replace('.mp3','.wav')
    af=f"loudnorm=I=-18:TP=-2:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true:print_format=json"
    normalized=subprocess.run(['ffmpeg','-hide_banner','-y','-i',str(srcfile),'-af',af,'-ar',str(RATE),'-ac','2','-c:a','pcm_f32le',str(HERE/name)],check=True,capture_output=True,text=True)
    report=json.loads(normalized.stderr[normalized.stderr.rfind('{'):normalized.stderr.rfind('}')+1])
    a=decode(HERE/name);assert np.max(np.abs(a))<1
    auditions.append({'source':file,'output':name,'duration':len(a)/RATE,'normalization':report,'loudness':measure(HERE/name)})
(HERE/'audition-manifest.json').write_text(json.dumps({'status':'prototype; listening pending','duration':DURATION,'excerpt_source_start':START,'source_master':'video-v2.mp4','holds':HOLDS,'mapping':mappings,'voice_gain':1,'voice_pcm_equal_on_all_spans':all(checks),'music_cues':cue_specs,'peak_dbfs':float(20*np.log10(np.max(np.abs(mix)))),'final_second_peak':float(np.max(np.abs(mix[-RATE:]))),'dry_auditions':auditions,'mixed_loudness':measure(HERE/'directed-mix.wav')},indent=2)+'\n')
print(json.dumps({'duration':DURATION,'voice_pcm_equal':all(checks),'peak_dbfs':float(20*np.log10(np.max(np.abs(mix)))),'auditions':len(auditions)}))
