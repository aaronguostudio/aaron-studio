from pathlib import Path
import subprocess,json,hashlib,math
import numpy as np
p=Path(__file__).resolve().parents[2];out=Path(__file__).resolve().parent;sr=48000
pauses=[{'old':197.2,'duration':3.2,'id':'breath-ideas','image':'01-first-version-v1.png','title':'Give ideas a chance.'},{'old':292.7,'duration':2.8,'id':'breath-shared','image':'v6-shared.png','title':'Look at it together.'},{'old':473.26666666666665,'duration':3.6,'id':'breath-trust','image':'03-maintenance-v1.png','title':'Something useful tomorrow.'}]
old_duration=503.2;duration=old_duration+sum(x['duration'] for x in pauses);N=round(duration*sr)
def decode(path):
 b=subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-vn','-ac','2','-ar',str(sr),'-f','f32le','-']);return np.frombuffer(b,dtype='<f4').reshape(-1,2)
def wav(name,data):
 raw=out/(name+'.f32');data.astype('<f4').tofile(raw)
 subprocess.run(['ffmpeg','-y','-v','error','-f','f32le','-ar',str(sr),'-ac','2','-i',str(raw),'-c:a','pcm_f32le',str(out/(name+'.wav'))],check=True);raw.unlink()
def loudness(path):
 r=subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-vn','-af','loudnorm=I=-23:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
 return json.loads(r[r.rfind('{'):r.rfind('}')+1])
source=decode(p/'video-v6-nomusic.mp4')[:round(old_duration*sr)];voice=np.zeros((N,2),np.float32);old_cursor=0;new_cursor=0;pieces=[];shift=0
for pause in pauses+[{'old':old_duration,'duration':0}]:
 end=round(pause['old']*sr);n=end-old_cursor;voice[new_cursor:new_cursor+n]=source[old_cursor:end]
 assert np.array_equal(voice[new_cursor:new_cursor+n],source[old_cursor:end])
 pieces.append({'old_start_sample':old_cursor,'new_start_sample':new_cursor,'samples':n,'sha256':hashlib.sha256(source[old_cursor:end].tobytes()).hexdigest(),'gain':1.0})
 new_cursor+=n
 if pause['duration']:
  pause['new']=new_cursor/sr;pause['frames']=round(pause['duration']*30);pause['source_frame']=round(pause['old']*30)
 new_cursor+=round(pause['duration']*sr);old_cursor=end
assert new_cursor==N
tracks={'paper':p.parents[1]/'music-visualizer/paper-moon-pilot/music.mp3','turning':out/'music/turning-page.mp3','shared':out/'music/common-ground.mp3'}
# p is blogs/date; parents[1] is content. All tracks receive a constant source normalization, then a music-only envelope.
material={};info={}
for key,path in tracks.items():
 l=loudness(path);gain=10**((-23-float(l['input_i']))/20);material[key]=decode(path)*gain;info[key]={'path':str(path),'source_duration':len(material[key])/sr,'source_loudness':l,'normalization_db':-23-float(l['input_i']),'normalized_target_lufs':-23}
# No speech sidechain, no pause bumps: fixed low bed with slow, smooth zero-slope envelopes.
cues=[{'id':'opening','track':'paper','start':0,'length':28,'offset':0,'fade_in':4,'fade_out':7,'gain':.25}, {'id':'creating','track':'turning','start':132,'length':25.5,'offset':0,'fade_in':6,'fade_out':7,'gain':.23}, {'id':'into-my-work','track':'turning','start':188,'length':28,'offset':0,'fade_in':6,'fade_out':7,'gain':.26}, {'id':'common-ground','track':'shared','start':285.2,'length':28,'offset':0,'fade_in':6,'fade_out':7,'gain':.26}, {'id':'closing','track':'paper','start':471,'length':40.8,'offset':0,'fade_in':8,'fade_out':7,'gain':.25}]
music=np.zeros((N,2),np.float32)
for c in cues:
 start=round(c['start']*sr);n=round(c['length']*sr);offset=round(c['offset']*sr);a=material[c['track']][offset:offset+n];assert len(a)==n
 t=np.arange(n,dtype=np.float64)/sr
 # raised-cosine easing has zero derivative at each boundary
 fadein=.5-.5*np.cos(np.pi*np.clip(t/c['fade_in'],0,1));fadeout=.5-.5*np.cos(np.pi*np.clip((c['length']-t)/c['fade_out'],0,1));env=(fadein*fadeout*c['gain']).astype(np.float32)
 music[start:start+n]+=a*env[:,None];c['bed_target_lufs']=-23+20*math.log10(c['gain']);c['end']=c['start']+c['length']
mix=voice+music;peak=float(np.abs(mix).max());assert peak<10**(-1.5/20),f'Headroom failed {peak}; lower only the music'
assert np.max(np.abs(mix-voice-music))<1e-7
wav('voice-retimed',voice);wav('music-stem',music);wav('mix',mix)
# Windowed voice evidence, measured at the old and retimed ending rather than inferred from a master fader.
checks=[]
for old_t in [188,198,284,294,465,471,476,485,494]:
 shift=sum(x['duration'] for x in pauses if old_t>=x['old']);a=source[round(old_t*sr):round((old_t+2)*sr)];b=voice[round((old_t+shift)*sr):round((old_t+shift+2)*sr)]
 # Sample windows may not span an inserted pause.
 if any(old_t<x['old']<old_t+2 for x in pauses):continue
 checks.append({'old_start':old_t,'new_start':old_t+shift,'exact_pcm_match':bool(np.array_equal(a,b))})
assert all(x['exact_pcm_match'] for x in checks)
report={'version':'v7','sample_rate':sr,'channels':2,'duration':duration,'pauses':pauses,'voice_source':'video-v6-nomusic.mp4','voice_gain':1.0,'narration_regenerated':False,'compression':False,'sidechain':False,'limiter':False,'source_segments':pieces,'voice_checks':checks,'music_sources':info,'music_cues':cues,'music_coverage_seconds':sum(c['length'] for c in cues),'peak_dbfs':20*math.log10(peak),'last_second_peak_dbfs':20*math.log10(max(1e-12,float(np.abs(mix[-sr:]).max()))),'original_script_sha256':hashlib.sha256((p/'youtube-script.md').read_bytes()).hexdigest(),'original_audio_sha256':hashlib.sha256((p/'audio.mp3').read_bytes()).hexdigest(),'rights':'Internal preview; provider/source commercial-use clearance not asserted','subjective_listening':'Author review pending; numerical checks do not substitute for headphone listening'}
(out/'sound-plan.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:report[k] for k in ['duration','voice_gain','voice_checks','music_coverage_seconds','peak_dbfs','last_second_peak_dbfs']},indent=2))
