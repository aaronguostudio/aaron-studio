import hashlib,json,math,subprocess
from pathlib import Path
import numpy as np
D=Path(__file__).resolve().parent;P=D.parent.parent
def run(a):return subprocess.run(a,check=True,capture_output=True).stdout
def pcm(f):return np.frombuffer(run(['ffmpeg','-v','error','-i',str(f),'-ar','48000','-ac','2','-f','f32le','-']),dtype='<f4').reshape(-1,2)
def loud(f):
 r=subprocess.run(['ffmpeg','-hide_banner','-i',str(f),'-af','loudnorm=I=-17:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True);return json.loads(r.stderr[r.stderr.rfind('{'):r.stderr.rfind('}')+1])
manifest=json.loads((P/'audio-v3-generation-manifest.json').read_text());timeline=json.loads((D/'timeline.json').read_text());lock=json.loads((D/'source-lock.json').read_text())
checks={str(name)+' unchanged':hashlib.sha256((P/name).read_bytes()).hexdigest()==value for name,value in lock.items()}
checks['approved_closing_raw_reused']=hashlib.sha256((D/'chunk-07-raw.mp3').read_bytes()).hexdigest()==hashlib.sha256((P/'revisions/sound-direction-06/pvc-directed-raw.mp3').read_bytes()).hexdigest()
voice=pcm(D/'voice-stem.wav');music=pcm(D/'music-stem.wav');mix=pcm(D/'mix.wav')
checks['voice_gain_one']=float(np.max(np.abs(mix-music-voice)))<1e-6
checks['last_second_silent']=float(np.max(np.abs(mix[-48000:])))<1e-6
checks['captions_in_bounds']=all(0<=c['start']<c['end']<=manifest['film_duration'] for c in timeline['captions'])
checks['captions_nonoverlapping']=all(a['end']<=b['start'] for a,b in zip(timeline['captions'],timeline['captions'][1:]))
checks['scenes_contiguous']=all(abs(a['end']-b['start'])<.001 for a,b in zip(timeline['scenes'],timeline['scenes'][1:]))
checks['quiet_hold_boundaries']=all(h['boundary_rms_dbfs']<-45 for h in manifest['holds'])
checks['music_cues_nonoverlapping']=all(a['start']+a['length']<=b['start'] for a,b in zip(manifest['cues'],manifest['cues'][1:]))
meta=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(P/'video-v3.mp4')]))
checks['encoded_duration_matches']=abs(float(meta['format']['duration'])-manifest['film_duration'])<.05
encoded_loud=loud(P/'video-v3.mp4');checks['encoded_peak_headroom']=float(encoded_loud['input_tp'])<=-1.5
del voice,music,mix
old=json.loads((P/'audio-generation-manifest.json').read_text());anchors=np.array(json.loads((D/'time-map.json').read_text())['old_new_anchor_pairs']);sample_frames={0,round(manifest['film_duration']*30)-1}
chapter_times=[]
for s in old['timeline']['segments'][1:]:
 t=float(np.interp(s['start']+3,anchors[:,0],anchors[:,1]));chapter_times.append(t);f=round(t*30);sample_frames.update([max(0,f-1),f])
for i,h in enumerate(manifest['holds']):
 t=h['at']+3+sum(x['duration'] for x in manifest['holds'][:i]);sample_frames.add(round((t+h['duration']/2)*30))
for c in manifest['cues']:sample_frames.add(round((c['start']+2)*30))
frames=sorted(sample_frames);out=D/'encoded-review';out.mkdir(exist_ok=True)
select='+'.join(f'eq(n\\,{f})' for f in frames)
run(['ffmpeg','-v','error','-y','-i',str(P/'video-v3.mp4'),'-vf',f'select={select},scale=960:540','-fps_mode','vfr',str(out/'frame-%03d.jpg')])
run(['ffmpeg','-v','error','-y','-framerate','1','-i',str(out/'frame-%03d.jpg'),'-vf','tile=2x4','-fps_mode','vfr',str(out/'contact-%02d.jpg')])
(out/'frame-map.json').write_text(json.dumps([{'file':f'frame-{i+1:03d}.jpg','frame':f,'time':f/30} for i,f in enumerate(frames)],indent=2))
report={'checks':checks,'encoded_loudness':encoded_loud,'duration':float(meta['format']['duration']),'encoded_frames_sampled':len(frames),'chapter_boundaries_sampled':len(chapter_times),'asr':'No missing clause detected. Six differences: articles and phonetic Jassy/Jesse spelling; see asr-differences.json. ASR is not a listening judgment.','author_approval':'B sound direction and B voice audition selected; extended full film available for review','uninterrupted_full_watch':'not performed by agent','headphone_listening':'not performed by agent'}
(D/'technical-qa.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2));assert all(checks.values())
