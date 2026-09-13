from pathlib import Path
from datetime import datetime,timezone
import hashlib,json,shutil,subprocess,zipfile
D=Path(__file__).resolve().parent;P=D.parent.parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def dump(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def run(a):return subprocess.check_output(a)
t=json.loads((D/'timeline.json').read_text());v4=json.loads((D.parent/'v4/timeline.json').read_text())
assert t['captions']==v4['captions'] and t['duration']==v4['duration']
assert [(s['id'],s['start'],s['end']) for s in t['scenes']]==[(s['id'],s['start'],s['end']) for s in v4['scenes']]
for n,h in json.loads((D/'source-lock.json').read_text()).items():assert sha(P/n)==h,n
for target,source in [('video-v5.mp4','video-v4.mp4'),('video-v5-nomusic.mp4','video-v4-nomusic.mp4')]:
 run(['ffmpeg','-v','error','-y','-i',str(D/'silent.mp4'),'-i',str(P/source),'-map','0:v:0','-map','1:a:0','-c','copy','-movflags','+faststart',str(P/target)])
run(['ffmpeg','-v','error','-xerror','-i',str(P/'video-v5.mp4'),'-map','0:v:0','-map','0:a:0','-f','null','-'])
probe=json.loads(run(['ffprobe','-v','error','-show_entries','stream=codec_name,codec_type,width,height,r_frame_rate,sample_rate:format=duration','-of','json',str(P/'video-v5.mp4')]))
assert abs(float(probe['format']['duration'])-t['duration'])<1/30
audio={}
for name in ['video-v4.mp4','video-v5.mp4','video-v4-nomusic.mp4','video-v5-nomusic.mp4']:
 audio[name]=hashlib.sha256(run(['ffmpeg','-v','error','-i',str(P/name),'-map','0:a:0','-c:a','copy','-f','adts','-'])).hexdigest()
assert audio['video-v4.mp4']==audio['video-v5.mp4'] and audio['video-v4-nomusic.mp4']==audio['video-v5-nomusic.mp4']
dump(D/'audio-stream-check.json',{'aacIdentical':True,'sha256':audio,'retimed':False,'remixed':False})
dump(D/'encoded-probe.json',probe)
out=P/'delivery-v5';out.mkdir(exist_ok=True)
for file in (P/'delivery-v4').iterdir():
 if file.is_file() and file.name not in ['video.mp4','manifest.json','README.md']:shutil.copy2(file,out/file.name)
shutil.copy2(P/'video-v5.mp4',out/'video.mp4')
(out/'README.md').write_text('''# V5 visual simplification — local review

8:00.833, 1920×1080 / 30 fps. One primary message per frame, larger high-contrast type, compact chapter context, no sidebar agenda, duplicate summary, author chrome or provenance footer. Established illustrations remain; chapter plates retain their existing timing.

The narration and music are the exact V4 AAC streams. No new TTS, remix or retiming. Captions, chapters, transcript, article and thumbnail are unchanged. Source boundaries remain in narration and the evidence package. V4 is preserved for comparison. Not published; author viewing is pending.

Includes video.mp4, thumbnail.jpg, captions.en.srt/vtt, chapters.txt, title/description/tags, transcript.en.txt and manifest.json.
''')
manifest={'version':5,'status':'local-review-only','preparedAt':datetime.now(timezone.utc).isoformat(),'masterSha256':sha(P/'video-v5.mp4'),'durationSeconds':t['duration'],'captions':len(t['captions']),'audioSameAsV4':True,'files':{f.name:{'bytes':f.stat().st_size,'sha256':sha(f)} for f in out.iterdir() if f.is_file() and f.name!='manifest.json'}}
dump(out/'manifest.json',manifest)
archive=P/'code-upstream-video-v5-review.zip'
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=3) as z:
 for f in sorted(out.iterdir()):
  if f.is_file():z.write(f,'code-upstream-video-v5/'+f.name)
with zipfile.ZipFile(archive) as z:assert z.testzip() is None
preview=P/'preview'
for name,path in [('delivery-v5',out),(archive.name,archive),('chapter-sample-v5.mp4',D/'prototype.mp4')]:
 link=preview/name
 if link.is_symlink():link.unlink()
 if not link.exists():link.symlink_to(path,target_is_directory=path.is_dir())
page=(preview/'film-v4.html').read_text().replace('delivery-v4/','delivery-v5/').replace('code-upstream-video-v4-review.zip',archive.name).replace('chapter-sample-v4.mp4','chapter-sample-v5.mp4').replace('build-what-matters-v4.mp4','build-what-matters-v5.mp4')
page=page.replace('V4 · 章节与节奏审片','V5 · 精简画面审片')
page=page.replace('V4 · 五个章节各自有固定标题与小节导航。章节之间留出呼吸，音乐随转场进入；旁白内容与插画保持一致。','V5 · 去掉侧边目录和底部标注，放大关键文字。每页只突出一个观点，配图更醒目。旁白、配乐和节奏沿用 V4。')
page=page.replace('href="film.html">对照之前的完整 V3','href="film-v4.html">对照之前的完整 V4')
(preview/'film-v5.html').write_text(page)
state=json.loads((P/'package-state.json').read_text());dump(D/'previous-package-state.json',state)
state['updatedAt']=datetime.now(timezone.utc).isoformat();state['scope']='V5: simplify visual hierarchy throughout; exact V4 audio and clock. Local author review only.'
state['artifacts']['video'].update({'version':5,'canonical':'video-v5.mp4','noMusic':'video-v5-nomusic.mp4','status':'simplified-visual-candidate-for-author-review','sha256':sha(P/'video-v5.mp4'),'qa':'video-production/v5/qa-report.md','technicalQa':'video-production/v5/technical-qa.json','previousMaster':'video-v4.mp4','delivery':'delivery-v5/video.mp4'})
state['artifacts']['delivery']={'directory':'delivery-v5','archive':archive.name,'manifest':'delivery-v5/manifest.json','status':'local-review-only'}
state['review'].update({'url':'http://127.0.0.1:4332/film-v5.html','previousUrl':'http://127.0.0.1:4332/film-v4.html','latestFeedback':'V4 is visually dense: remove agenda, redundant text and Personal Judgment/provenance footer; simplify full film and improve legibility.','mediaLoad':{'status':'v5-browser-check-pending'},'fullWatchAndListening':'V5 visual revision awaits author review; V4 audio bitstream unchanged.'})
state['checks']['authorMediaReview']='V5 pending';state['checks']['delivery']='V5 AV decode, byte-identical V4 audio, subtitle clock, manifest and ZIP passed; browser QA follows'
dump(P/'package-state.json',state)
metadata=(P/'youtube-metadata.md').read_text();(D/'previous-youtube-metadata.md').write_text(metadata);(P/'youtube-metadata.md').write_text(metadata.replace('V4','V5').replace('video-v4','video-v5').replace('delivery-v4','delivery-v5').replace('Full chapter revision','Simplified visual revision'))
print(json.dumps({'video':str(P/'video-v5.mp4'),'duration':t['duration'],'sha256':sha(P/'video-v5.mp4'),'audioIdentical':True,'review':state['review']['url']},indent=2))
