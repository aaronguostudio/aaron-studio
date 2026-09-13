from pathlib import Path
from datetime import datetime,timezone
import hashlib,json,urllib.request,zipfile
D=Path(__file__).resolve().parent;P=D.parent.parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def dump(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
t=json.loads((D/'timeline.json').read_text());frames=json.loads((D/'full-frames/frames.json').read_text())
locks={n:sha(P/n)==h for n,h in json.loads((D/'source-lock.json').read_text()).items()};assert all(locks.values())
manifest=json.loads((P/'delivery-v5/manifest.json').read_text());assert all(sha(P/'delivery-v5'/n)==a['sha256'] for n,a in manifest['files'].items())
with zipfile.ZipFile(P/'code-upstream-video-v5-review.zip') as z:assert z.testzip() is None
request=urllib.request.Request('http://127.0.0.1:4332/delivery-v5/video.mp4',headers={'Range':'bytes=0-1023'})
with urllib.request.urlopen(request) as r:
 range_info={'status':r.status,'contentRange':r.headers.get('Content-Range'),'bytes':len(r.read())};assert r.status==206
with urllib.request.urlopen('http://127.0.0.1:4332/critique.html') as r:
 page=r.read().decode();assert 'film-v5.html' in page and 'video-v5.mp4' in page
q={'version':5,'checkedAt':datetime.now(timezone.utc).isoformat(),'decision':'PASS technical and sampled visual; author review pending','masterSha256':sha(P/'video-v5.mp4'),'durationSeconds':t['duration'],'probe':json.loads((D/'encoded-probe.json').read_text()),'fullAvDecode':'pass ffmpeg -xerror','audio':json.loads((D/'audio-stream-check.json').read_text()),'inheritedAudioQa':{'source':'video-production/v4/technical-qa.json','reason':'Exact encoded AAC bitstreams verified identical; no remix, generation or timing change','lufs':-16.96,'truePeakDbtp':-3.14},'sourceLocks':locks,'captions':{'cues':len(t['captions']),'words':893,'clock':'unchanged V4, source captions hash verified'},'readability':json.loads((D/'readability-audit.json').read_text()),'sampledVisual':{'frames':len(frames),'sheets':len(list((D/'full-frames').glob('contact-*.jpg'))),'coverage':'Every scene midpoint; six chapter entry/exit sequences; every flow connector at 0/25/50/75/100 percent','observed':'No content/caption overlap; aligned peer baselines; primary text fully readable. No footer/agenda. Phone-scale sheets and full-resolution stress stills inspected.','fullHumanViewing':False},'range':range_info,'deliveryManifest':'all file hashes match','archiveCrc':'pass','publishing':'not authorized; no publication'}
dump(D/'technical-qa.json',q)
(D/'qa-report.md').write_text(f'''# V5 full-film QA

PASS for local author review; not author acceptance or publication approval.

Full film: 8:00.833, 1920×1080 / 30 fps, H.264 + 48 kHz AAC. Master SHA-256: `{q['masterSha256']}`.

Visual revision: removed persistent left agenda, competing chapter/page titles, repeated outcome sentence, top author chrome and every bottom provenance/footer line. Chapters have number and title only; body pages have a short chapter cue and one primary message or a headline with one content group. Hero text is 92px, headings 72px, body 48–60px, captions 34px. All reading text stays fully opaque. Primary contrast 13.1:1. Average 10.8 words per non-brand frame excluding captions, maximum 21.

Inspected {len(frames)} sequentially decoded frame samples across {q['sampledVisual']['sheets']} contact sheets: every scene midpoint, six chapter transition sequences, and every flow connector at five progress points. No missing content, caption collision, unreadable emphasis or layout overlap observed. Five full-resolution stress frames and the 85.4-second prototype's 20 frame samples also reviewed. A flow baseline defect was corrected before the full render; text peers now share equal fixed-height slots.

Audio: V4 and V5 scored AAC hashes match exactly; V4 and V5 voice-only AAC hashes also match. No TTS regeneration, remix or timing change. Therefore the verified V4 audio measurements remain applicable: −16.96 LUFS, −3.14 dBTP. No new listening quality claim is made. All 154 captions / 893 words use the unchanged V4 clock, and all scene boundaries and chapter holds match V4.

Full AV decode, source locks, registered layout geometry, TypeScript/Remotion audit, planning and production preflights, delivery hashes and ZIP CRC passed. HTTP range requests return 206. Browser check is recorded in package-state after page inspection.

Limit: sampled visual and technical review is not uninterrupted human watching or listening. The author chooses whether this simpler direction meets the intended quality. V4 remains available for comparison. Nothing has been published.

Evidence: technical-qa.json, audio-stream-check.json, readability-audit.json, full-frames/frames.json, source-lock.json, prototype-review.md.
''')
state=json.loads((P/'package-state.json').read_text());state['checks']['visualV5']=f"pass: {len(frames)} encoded frames inspected; no agenda/footer; larger high-contrast text";state['checks']['soundV5']='exact V4 AAC bitstreams; no changes';state['checks']['delivery']='V5 full decode, audio identity, subtitle clock, file hashes, ZIP and HTTP range passed';dump(P/'package-state.json',state)
for name in ['video-qa-report.md','package-validation.md','distribution-plan.md']:
 p=P/name;old=p.read_text() if p.exists() else ''
 block='## Current V5 review — 2026-09-08\n\nSimplified full film: `video-v5.mp4` (8:00.833). Delivery: `delivery-v5/`; review: http://127.0.0.1:4332/film-v5.html. Exact V4 narration/music and timing; fewer words, larger type, no agenda or footer. Technical and sampled visual checks passed; author review remains pending. See `video-production/v5/qa-report.md`. Nothing published. Older records below are retained for comparison.\n\n---\n\n'
 if not old.startswith('## Current V5 review'):p.write_text(block+old)
print(json.dumps({'qa':'pass','frames':len(frames),'sheets':q['sampledVisual']['sheets'],'sha256':q['masterSha256']},indent=2))
