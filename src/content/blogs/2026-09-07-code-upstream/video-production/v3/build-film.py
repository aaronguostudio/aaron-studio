"""Extend author-selected sound direction and voice B across the locked film."""
import hashlib,json,math,re,subprocess
from pathlib import Path
import numpy as np

D=Path(__file__).resolve().parent;P=D.parent.parent;R=P.parents[3];S=P/'revisions/sound-direction-06'
SR=48000;FPS=30
def cmd(args):return subprocess.run(args,check=True,capture_output=True).stdout
def decode(f):return np.frombuffer(cmd(['ffmpeg','-v','error','-i',str(f),'-ar',str(SR),'-ac','2','-f','f32le','-']),dtype='<f4').reshape(-1,2).copy()
def wav(f,a):subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','pipe:0','-c:a','pcm_f32le',str(f)],input=a.astype('<f4').tobytes(),check=True)
def measure(f):
    r=subprocess.run(['ffmpeg','-hide_banner','-i',str(f),'-af','loudnorm=I=-18:TP=-2:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
    return json.loads(r.stderr[r.stderr.rfind('{'):r.stderr.rfind('}')+1])
def digest(f):return hashlib.sha256(f.read_bytes()).hexdigest()
def normword(w):return re.sub(r'[^a-z0-9]','',w.lower())
def tokens(text):return [x for x in re.findall(r'\S+',text) if normword(x)]
def gainmatch(raw,out):
    m=measure(raw)
    af=f"loudnorm=I=-18:TP=-2:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
    cmd(['ffmpeg','-v','error','-y','-i',str(raw),'-af',af,'-ar',str(SR),'-ac','2','-c:a','pcm_f32le',str(out)])
    return m

plan=json.loads((D/'voice-plan.json').read_text());chunks=[];words=[];cursor=0;normalizations=[];chunk_ranges=[]
for i,c in enumerate(plan['chunks']):
    raw=D/(c['id']+'-raw.mp3');normalized=D/(c['id']+'-normalized.wav')
    if i==7:
        a=decode(S/'pvc-directed.wav');m=measure(S/'pvc-directed.wav');kind='approved audition B; constant gain only'
    else:
        if not normalized.exists():gainmatch(raw,normalized)
        a=decode(normalized);m=measure(normalized);kind='same two-pass listening normalization as audition'
    gain=10**((-17-float(m['input_i']))/20);a*=gain
    assert np.max(np.abs(a))<10**(-1.5/20),'Voice normalization lacks headroom'
    chunks.append(a);offset=cursor/SR
    if i<7:
        al=json.loads((D/(c['id']+'.alignment.json')).read_text())['normalized_alignment'];text=''.join(al['characters']);cw=[]
        for match in re.finditer(r'\S+',text):
            if normword(match.group()):cw.append({'word':match.group(),'start':al['character_start_times_seconds'][match.start()],'end':al['character_end_times_seconds'][match.end()-1]})
    else:cw=[{'word':w['text'],'start':w['start'],'end':w['end']} for w in json.loads((S/'pvc-directed.transcript.json').read_text())['words'] if w['type']=='word']
    expected=tokens(c['text']);assert [normword(w['word']) for w in cw]==list(map(normword,expected)),f"Timed text mismatch in {c['id']}"
    for w,spelling in zip(cw,expected):words.append({'word':spelling,'start':offset+w['start'],'end':offset+w['end'],'chunk':i})
    cursor+=len(a);chunk_ranges.append({'chunk':i,'start':offset,'end':cursor/SR});normalizations.append({'chunk':i,'method':kind,'static_gain_db':20*math.log10(gain),'before_gain_lufs':m['input_i']})
voice_base=np.concatenate(chunks);wav(D/'voice-before-holds.wav',voice_base)

# Set a total pause target; do not stack editorial holds over existing TTS breaks.
pause_targets=[('work becomes useful.',1.0),('what changed.',1.0),('original task.',1.0),('deserve to continue.',1.1),('real needs.',1.45),('next project.',1.35)]
holds=[]
for phrase,target in pause_targets:
    needle=list(map(normword,tokens(phrase)));hay=[normword(w['word']) for w in words]
    matches=[i+len(needle)-1 for i in range(len(hay)-len(needle)+1) if hay[i:i+len(needle)]==needle]
    assert len(matches)==1,(phrase,matches)
    i=matches[0];gap=words[i+1]['start']-words[i]['end'];extra=max(0,target-gap)
    if extra<.12:continue
    # Locate a quiet cut inside the actual interword gap, not the aligned word tail.
    lo=round((words[i]['end']+.03)*SR);hi=round((words[i+1]['start']-.03)*SR)
    assert hi>lo,phrase
    candidates=np.arange(lo,hi,240);rms=[np.mean(voice_base[max(0,c-240):c+240]**2) for c in candidates];cut=int(candidates[int(np.argmin(rms))])
    holds.append({'phrase':phrase,'at':cut/SR,'duration':round(extra*SR)/SR,'original_gap':gap,'target_gap':target,'boundary_rms_dbfs':float(10*np.log10(max(min(rms),1e-24)))})
holds.sort(key=lambda h:h['at'])
def shifted(t):return t+sum(h['duration'] for h in holds if t>=h['at'])
pieces=[];last=0;spans=[];pos=0
for h in holds+[{'at':len(voice_base)/SR,'duration':0}]:
    cut=round(h['at']*SR);piece=voice_base[last:cut];pieces.append(piece);spans.append({'source_start_sample':last,'source_end_sample':cut,'output_start_sample':pos});pos+=len(piece)
    if h['duration']:z=np.zeros((round(h['duration']*SR),2),dtype=np.float32);pieces.append(z);pos+=len(z)
    last=cut
voice=np.concatenate(pieces)
assert all(np.array_equal(voice_base[x['source_start_sample']:x['source_end_sample']],voice[x['output_start_sample']:x['output_start_sample']+x['source_end_sample']-x['source_start_sample']]) for x in spans)
for w in words:w['start']=shifted(w['start']);w['end']=shifted(w['end'])
wav(D/'narration.wav',voice)
cmd(['ffmpeg','-v','error','-y','-i',str(D/'narration.wav'),'-c:a','libmp3lame','-b:a','192k',str(P/'audio-v3.mp3')])

# Retime the accepted renderer from matching words, preserving scene content.
oldmanifest=json.loads((P/'audio-generation-manifest.json').read_text());oldwords=oldmanifest['timeline']['wordTimings']
assert [normword(w['word']) for w in oldwords]==[normword(w['word']) for w in words], 'Old/new word sequence differs'
anchors=[(0.,0.),(3.,3.)]
for old,new in zip(oldwords,words):anchors.append((3+(old['start']+old['end'])/2,3+(new['start']+new['end'])/2))
anchors.append((3+oldmanifest['timeline']['duration'],3+len(voice)/SR));anchors=sorted(anchors)
xp=np.array([p[0] for p in anchors]);yp=np.array([p[1] for p in anchors]);assert np.all(np.diff(xp)>0) and np.all(np.diff(yp)>0)
oldtimeline=json.loads((P/'video-production/timeline.json').read_text())
oldvoiceend=3+oldmanifest['timeline']['duration'];newvoiceend=3+len(voice)/SR
def remap(t):return float(np.interp(t,xp,yp)) if t<=oldvoiceend else newvoiceend+t-oldvoiceend
duration=math.ceil((newvoiceend+5)*FPS)/FPS
timeline={'duration':duration,'fps':FPS,'audioOffset':3,'scenes':[],'captions':[]}
for old in oldtimeline['scenes']:
    s=dict(old);s['start']=round(remap(old['start'])*FPS)/FPS;s['end']=round(remap(old['end'])*FPS)/FPS
    if s['kind']=='end':s['end']=duration
    s['cues']=[max(0,remap(old['start']+c)-s['start']) for c in old['cues']];s['detailCue']=max(0,remap(old['start']+old['detailCue'])-s['start']);timeline['scenes'].append(s)
group=[]
for i,w in enumerate(words):
    group.append(w)
    if re.search(r'[.!?:,]$',w['word']) or len(group)>=9 or i==len(words)-1:
        timeline['captions'].append({'start':group[0]['start']+3,'end':group[-1]['end']+3,'text':' '.join(x['word'] for x in group)});group=[]
for a,b in zip(timeline['captions'],timeline['captions'][1:]):a['end']=min(a['end'],b['start'])
(D/'timeline.json').write_text(json.dumps(timeline,indent=2));(D/'word-timings.json').write_text(json.dumps(words,indent=2));(D/'time-map.json').write_text(json.dumps({'old_new_anchor_pairs':anchors,'holds':holds,'retained_spans':spans},indent=2))
renderer=R/'tiles/aaron-video-gen/remotion/src/projects/code-upstream'
(renderer/'data-v3.ts').write_text('export const filmData = '+json.dumps(timeline)+';\n')
(renderer/'index-v3.tsx').write_text((renderer/'index.tsx').read_text().replace("from './data'","from './data-v3'"))

# Music follows narrative anchors. No automatic voice ducking or master limiter.
n=round(duration*SR);voice_stem=np.zeros((n,2),np.float32);voice_stem[3*SR:3*SR+len(voice)]=voice;music=np.zeros_like(voice_stem)
sc={s['id']:s for s in timeline['scenes']}
cues=[
 {'id':'question','source':D/'inquiry.mp3','start':0,'length':26,'role':'Personal observation, questioning an assumption'},
 {'id':'observe','source':D/'fieldwork.mp3','start':sc['s15']['start']-1.5,'length':27,'role':'Curiosity as the customer example begins'},
 {'id':'try','source':D/'possibilities.mp3','start':sc['s19']['start']-.8,'length':27,'role':'Forward motion while considering two product approaches'},
 {'id':'market','source':S/'reflection.mp3','start':sc['s26']['start']+.8,'length':17,'role':'A quieter question: will someone try or pay for the idea?'},
 {'id':'return','source':S/'reflection.mp3','start':sc['s33']['start']+2.5,'length':17.5,'role':'Return to the personal judgment, then let action speak dry'},
 {'id':'resolve','source':S/'possibility.mp3','start':max(sc['s35']['start']+.6,duration-31),'length':None,'role':'Earned optimism; final sentence has room; music responds after speech'}
]
def env(points,length):
    t=np.arange(length)/SR;out=np.zeros(length)
    for (a,x),(b,y) in zip(points,points[1:]):
        if b<=a:continue
        m=(t>=a)&(t<b);u=(t[m]-a)/(b-a);out[m]=x+(y-x)*(.5-.5*np.cos(np.pi*u))
    return out
for c in cues:
    a=decode(c['source']);source_lufs=float(measure(c['source'])['input_i']);source_duration=len(a)/SR
    length=min(c['length'] or duration-c['start']-1,source_duration-.05);start=round(c['start']*SR)/SR;c['start']=start;c['length']=length
    if c['id']=='resolve':
        finalstart=next(w['start']+3 for i,w in enumerate(words) if ' '.join(z['word'] for z in words[i:i+7])=='I want to use that opportunity to')-start
        speechend=words[-1]['end']+3-start
        points=[(0,0),(min(4,finalstart-3),.38),(max(5,finalstart-3),.48),(finalstart-.4,.22),(speechend,.22),(min(speechend+1.3,length-2),.75),(length,0)]
    elif c['id']=='return':points=[(0,0),(3,.4),(8.6,.4),(10.2,.7),(12,.42),(14,.32),(length,0)]
    elif c['id']=='market':points=[(0,0),(3,.34),(length-5,.38),(length,0)]
    else:points=[(0,0),(3.5,.42),(length*.52,.48),(length-6,.38),(length,0)]
    points=sorted(points);count=round(length*SR);gain=10**((-24-source_lufs)/20);at=round(start*SR)
    music[at:at+count]+=a[:count]*gain*env(points,count)[:,None]
    c.update({'source':str(c['source'].relative_to(P)),'source_sha256':digest(P/c['source'].relative_to(P)),'source_lufs':source_lufs,'music_normalization_gain':gain,'envelope':points})
mix=voice_stem+music;assert np.max(np.abs(mix))<10**(-1.5/20)
wav(D/'voice-stem.wav',voice_stem);wav(D/'music-stem.wav',music);wav(D/'mix.wav',mix)
for label,start in [('opening',0),('middle',len(voice)/SR/2-30),('late',len(voice)/SR-60)]:cmd(['ffmpeg','-v','error','-y','-ss',str(max(0,start)),'-i',str(D/'narration.wav'),'-t','60','-c:a','libmp3lame','-b:a','192k',str(P/f'audio-v3-{label}-60s.mp3')])
manifest={'version':3,'voice_selection':'video-production/v3/author-selection.md','voiceProfile':'aaron-pvc-directed-code-upstream-v1','settings':plan['chunks'][0]['settings'],'global_default_unchanged':True,'spoken_script_sha256':plan['scriptSha256'],'word_count':len(words),'narration_duration':len(voice)/SR,'film_duration':duration,'closing_reused_from':'revisions/sound-direction-06/pvc-directed-raw.mp3','normalizations':normalizations,'holds':holds,'cues':cues,'voice_gain_in_mix':1,'voice_pcm_retained_after_holds':True,'master_compression':False,'sidechain':False,'narration_loudness':measure(D/'narration.wav'),'mix_loudness':measure(D/'mix.wav'),'chapters':[{**x,'start':shifted(x['start']),'end':shifted(x['end'])} for x in chunk_ranges],'full_film_listening':'pending'}
(P/'audio-v3-generation-manifest.json').write_text(json.dumps(manifest,indent=2));(D/'sound-plan.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps({'narration_seconds':len(voice)/SR,'film_seconds':duration,'words':len(words),'holds':holds,'music_cues':len(cues),'music_seconds':sum(c['length'] for c in cues)},indent=2))
