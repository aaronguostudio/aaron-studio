"""Publish only to the local review surface; preserve V3 delivery unchanged."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib, html, json, re, shutil, subprocess, zipfile
D=Path(__file__).resolve().parent;P=D.parent.parent
def dump(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def run(a):return subprocess.check_output(a)
timeline=json.loads((D/'timeline.json').read_text());duration=timeline['duration']
master=P/'video-v4.mp4';dry=P/'video-v4-nomusic.mp4'
for dest,track in [(master,'mix.wav'),(dry,'voice-stem.wav')]:
 run(['ffmpeg','-v','error','-y','-i',str(D/'silent.mp4'),'-i',str(D/track),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-t',str(duration),'-movflags','+faststart',str(dest)])
run(['ffmpeg','-v','error','-xerror','-i',str(master),'-map','0:v:0','-map','0:a:0','-f','null','-'])
probe=json.loads(run(['ffprobe','-v','error','-show_entries','stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate:format=duration','-of','json',str(master)]))
assert abs(float(probe['format']['duration'])-duration)<1/30
for n,h in json.loads((D/'source-lock.json').read_text()).items():assert sha(P/n)==h,n

out=P/'delivery-v4';out.mkdir(exist_ok=True)
shutil.copy2(master,out/'video.mp4');shutil.copy2(P/'imgs/thumbnail-youtube-v2.jpg',out/'thumbnail.jpg')
def timestamp(sec,mark=','):
 ms=round(sec*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000)
 return f'{h:02}:{m:02}:{s:02}{mark}{ms:03}'
caps=timeline['captions']
srt='\n\n'.join(f"{i}\n{timestamp(c['start'])} --> {timestamp(c['end'])}\n{c['text']}" for i,c in enumerate(caps,1))+'\n'
vtt='WEBVTT\n\n'+'\n\n'.join(f"{timestamp(c['start'],'.')} --> {timestamp(c['end'],'.')}\n{c['text']}" for c in caps)+'\n'
for name,text in [('captions.en.srt',srt),('captions.en.vtt',vtt)]:
 (out/name).write_text(text)
 run(['ffprobe','-v','error','-show_entries','stream=codec_name','-of','json',str(out/name)])
(P/'video-captions-v4-en.srt').write_text(srt);(P/'video-captions-v4-en.vtt').write_text(vtt)
chapters=[]
for i,c in enumerate(timeline['chapters']):
 sec=0 if i==0 else c['start'];text='The opportunity around the code' if i==0 else c['title']
 chapters.append({'at':f'{int(sec//60):02}:{int(sec%60):02}','seconds':sec,'title':text})
chapter_text='\n'.join(c['at']+' '+c['title'] for c in chapters)+'\n'
(out/'chapters.txt').write_text(chapter_text);(D/'chapters.txt').write_text(chapter_text)
description=(P/'delivery/youtube-description.txt').read_text()
description=re.sub(r'CHAPTERS\n.*?\n\nFIVE INVESTMENTS', 'CHAPTERS\n'+chapter_text+'\nFIVE INVESTMENTS',description,flags=re.S)
(out/'youtube-description.txt').write_text(description)
for name in ['youtube-title.txt','youtube-tags.txt','transcript.en.txt']:shutil.copy2(P/'delivery'/name,out/name)
(out/'README.md').write_text('''# V4 — complete chapter revision, local review only

Full film: 8:00.833, 1920×1080 / 30 fps. All accepted narration samples and spoken text are preserved; added silence only at chapter boundaries. Stable numbered headings, a three-topic agenda, unboxed explanations, six chapter plates, and seven motivated score entrances.

The optional SRT/VTT matches the burned-in captions and new chapter timing. The prior V3 delivery remains in its original folder. Nothing has been uploaded to YouTube, scheduled, posted or deployed.

Files: video.mp4, thumbnail.jpg, captions.en.srt/vtt, chapters.txt, transcript.en.txt, YouTube title/description/tags, manifest.json. Keep optional player subtitles off when the burned-in text is sufficient.

Before any later authorized public release, verify the article destination and generated-score release evidence. Listening preference belongs to Aaron; technical QA does not claim a full human viewing.
''')
manifest={'version':4,'status':'local-review-only','preparedAt':datetime.now(timezone.utc).isoformat(),'masterSha256':sha(master),'durationSeconds':duration,'captions':len(caps),'files':{p.name:{'bytes':p.stat().st_size,'sha256':sha(p)} for p in out.iterdir() if p.is_file() and p.name!='manifest.json'}}
dump(out/'manifest.json',manifest)
archive=P/'code-upstream-video-v4-review.zip'
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=3) as z:
 for f in sorted(out.iterdir()):
  if f.is_file():z.write(f,'code-upstream-video-v4/'+f.name)
with zipfile.ZipFile(archive) as z:assert z.testzip() is None
end=next(s['start'] for s in timeline['scenes'] if s['kind']=='end')
run(['ffmpeg','-v','error','-y','-ss','3','-i',str(D/'voice-stem.wav'),'-t',str(end-3),'-c:a','libmp3lame','-b:a','192k',str(P/'audio-v4.mp3')])
for label,start in [('opening',0),('middle',(end-3)/2-30),('late',end-63)]:
 run(['ffmpeg','-v','error','-y','-ss',str(start),'-i',str(P/'audio-v4.mp3'),'-t','60','-c:a','libmp3lame','-b:a','192k',str(P/f'audio-v4-{label}-60s.mp3')])
dump(P/'audio-v4-generation-manifest.json',{'method':'No TTS regeneration; exact V3 PCM plus chapter silence','sourceManifest':'audio-v3-generation-manifest.json','sourcePcm':'video-production/v3/voice-stem.wav','timeMap':'video-production/v4/time-map.json','voiceGain':1,'soundPlan':'video-production/v4/sound-plan.json'})

preview=P/'preview'
for name,path in [('delivery-v4',out),('code-upstream-video-v4-review.zip',archive),('chapter-sample-v4.mp4',D/'prototype.mp4')]:
 link=preview/name
 if link.is_symlink():link.unlink()
 if not link.exists():link.symlink_to(path,target_is_directory=path.is_dir())
page=(preview/'film.html').read_text().replace('delivery/','delivery-v4/').replace('code-upstream-video-review.zip',archive.name)
page=page.replace('完整视频审片','V4 · 章节与节奏审片').replace('7 分 50 秒','8 分 01 秒').replace('07:50','08:01').replace('469.733333','480.833333').replace('build-what-matters.mp4','build-what-matters-v4.mp4')
page=page.replace('沿用已选定的声音、配乐和插画，从亚马逊时期的判断，讲到工程师未来值得投入的五种能力。','V4 · 五个章节各自有固定标题与小节导航。章节之间留出呼吸，音乐随转场进入；旁白内容与插画保持一致。')
buttons=''.join(f'<button class="chapter" data-time="{c["seconds"]}"><span>{c["at"]}</span>{html.escape(c["title"])}</button>' for c in chapters)
page=re.sub(r'(<nav class="chapters"[^>]*>).*?(</nav>)',lambda m:m[1]+buttons+m[2],page,flags=re.S)
page=re.sub(r'<pre class="draft">.*?</pre>',lambda m:'<pre class="draft">'+html.escape(description)+'</pre>',page,flags=re.S)
page=page.replace('<details><summary>封面、字幕与章节文件</summary>','<details><summary>先看 85 秒样段 · 包含两次章节切换</summary><div><video controls playsinline preload="none" src="chapter-sample-v4.mp4"></video><p><a href="film.html">对照之前的完整 V3 →</a></p></div></details><details><summary>封面、字幕与章节文件</summary>')
(preview/'film-v4.html').write_text(page)
state=json.loads((P/'package-state.json').read_text());dump(D/'previous-package-state.json',state)
state['updatedAt']=datetime.now(timezone.utc).isoformat();state['scope']='V4 refinement: accepted content/voice/images; chapter hierarchy, transitions and motivated score. Local review only; do not publish.'
state['artifacts']['video'].update({'version':4,'canonical':'video-v4.mp4','noMusic':'video-v4-nomusic.mp4','status':'chapter-rhythm-candidate-for-author-review','sha256':sha(master),'durationSeconds':duration,'qa':'video-production/v4/qa-report.md','technicalQa':'video-production/v4/technical-qa.json','previousMaster':'video-v3.mp4','delivery':'delivery-v4/video.mp4'})
state['artifacts']['audio'].update({'canonical':'audio-v4.mp3','manifest':'audio-v4-generation-manifest.json','previous':'audio-v3.mp3','status':'same-selected-performance-with-chapter-holds','samples':[{'label':label,'path':f'audio-v4-{part}-60s.mp3'} for label,part in [('开头','opening'),('中段','middle'),('结尾','late')]]})
state['artifacts']['captions']={'canonical':'video-captions-v4-en.srt','vtt':'video-captions-v4-en.vtt','cues':len(caps),'status':'matches-v4-clock'}
state['artifacts']['delivery']={'directory':'delivery-v4','archive':archive.name,'manifest':'delivery-v4/manifest.json','status':'local-review-only'}
state['review']['previousUrl']='http://127.0.0.1:4332/film.html';state['review']['url']='http://127.0.0.1:4332/film-v4.html'
state['review']['latestFeedback']='Author heard V3: content and pictures OK; music entries feel arbitrary, section rhythm and title/subsection hierarchy need refinement.'
state['review']['fullWatchAndListening']='Author heard the full V3. V4 is a new chapter and score edit, awaiting author viewing.'
state['review']['mediaLoad']={'status':'v4-browser-check-pending'}
state['checks']['authorMediaReview']='V4 chapter/rhythm candidate pending';state['checks']['delivery']='Full AV decode, subtitles and ZIP checks passed; browser check follows'
dump(P/'package-state.json',state)
oldmeta=(P/'youtube-metadata.md').read_text();(D/'previous-youtube-metadata.md').write_text(oldmeta)
title=(out/'youtube-title.txt').read_text().strip();tags=(out/'youtube-tags.txt').read_text().strip()
(P/'youtube-metadata.md').write_text('# YouTube metadata — V4 local review, not uploaded\n\n## Title\n'+title+'\n\n## Description\n'+description+'\n## Tags\n'+tags+'\n\n## Thumbnail\nimgs/thumbnail-youtube-v2.jpg\n\n## Delivery\nCanonical: video-v4.mp4; delivery-v4/video.mp4. Full chapter revision awaiting author review. No external release authorized.\n')
dump(D/'encoded-probe.json',probe)
print(json.dumps({'video':str(master),'duration':duration,'sha256':sha(master),'review':state['review']['url'],'zipBytes':archive.stat().st_size},indent=2))
