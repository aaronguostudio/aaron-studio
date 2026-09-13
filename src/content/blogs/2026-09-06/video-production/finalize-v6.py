from pathlib import Path
import json,subprocess,hashlib,datetime
p=Path(__file__).resolve().parents[1];out=p/'video-production';manifest=json.loads((out/'v6-revision-manifest.json').read_text())
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def streamhash(path,kind):
 return subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-map','0:'+kind+':0','-c','copy','-f','hash','-hash','sha256','-'],text=True).strip()
for f,key in [('audio.mp3','audio_sha256'),('youtube-script.md','script_sha256'),('video-captions-en.srt','captions_sha256')]:assert digest(p/f)==manifest[key],f+' changed'
state=json.loads((p/'package-state.json').read_text())
for lang,sha in state['artifacts']['article']['sha256'].items():assert digest(p/state['artifacts']['article'][lang])==sha,lang+' article changed'
# The movie has identical timing. Preserve each accepted encoded audio stream exactly.
old=streamhash(p/'video-v5-nomusic.mp4','a');new=streamhash(p/'video-v6-nomusic.mp4','a')
if old!=new:
 tmp=out/'v6-audio-preserved.mp4'
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(p/'video-v6-nomusic.mp4'),'-i',str(p/'video-v5-nomusic.mp4'),'-map','0:v:0','-map','1:a:0','-c','copy','-movflags','+faststart',str(tmp)],check=True)
 tmp.replace(p/'video-v6-nomusic.mp4')
subprocess.run(['ffmpeg','-y','-v','error','-i',str(p/'video-v6-nomusic.mp4'),'-i',str(p/'video-v5.mp4'),'-map','0:v:0','-map','1:a:0','-c','copy','-movflags','+faststart',str(p/'video-v6.mp4')],check=True)
assert streamhash(p/'video-v6-nomusic.mp4','a')==old
assert streamhash(p/'video-v6.mp4','a')==streamhash(p/'video-v5.mp4','a')
assert streamhash(p/'video-v6.mp4','v')==streamhash(p/'video-v6-nomusic.mp4','v')
manifest.update(audio_stream_preservation='Both v6 audio streams exactly match their corresponding v5 AAC streams',nomusic_audio_sha256=old,scored_audio_sha256=streamhash(p/'video-v6.mp4','a'),video_stream_sha256=streamhash(p/'video-v6.mp4','v'),article_hashes_unchanged=True,completed_at=datetime.datetime.now(datetime.timezone.utc).isoformat())
(out/'v6-revision-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps(manifest,indent=2))
