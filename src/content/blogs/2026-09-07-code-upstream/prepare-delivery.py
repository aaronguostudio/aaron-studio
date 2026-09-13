"""Package the selected V3 master without re-encoding or regenerating media."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import html
import json
import re
import shutil
import textwrap
import zipfile

root = Path(__file__).resolve().parent
out = root / 'delivery'
out.mkdir(exist_ok=True)
history = root / 'revisions/final-film-delivery-07'
history.mkdir(parents=True, exist_ok=True)
preview = root / 'preview'
state = json.loads((root / 'package-state.json').read_text())
timeline = json.loads((root / 'video-production/v3/timeline.json').read_text())
stamp = datetime.now(timezone.utc).isoformat()


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def backup(name):
    destination = history / ('previous-' + name)
    if not destination.exists() and (root / name).exists():
        shutil.copy2(root / name, destination)


def clock(seconds, decimal=','):
    ms = round(seconds * 1000)
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f'{h:02}:{m:02}:{s:02}{decimal}{ms:03}'


master = root / state['artifacts']['video']['canonical']
assert sha(master) == state['artifacts']['video']['sha256']
locked = json.loads((root / 'video-production/v3/source-lock.json').read_text())
assert all(sha(root / file) == digest for file, digest in locked.items())
caps = timeline['captions']
words = json.loads((root / 'video-production/v3/word-timings.json').read_text())
assert ' '.join(c['text'] for c in caps).split() == [w['word'] for w in words]
assert all(0 <= c['start'] < c['end'] <= timeline['duration'] for c in caps)
assert all(a['end'] <= b['start'] for a, b in zip(caps, caps[1:]))
srt = '\n\n'.join(f"{i}\n{clock(c['start'])} --> {clock(c['end'])}\n" +
                  '\n'.join(textwrap.wrap(c['text'], width=42, break_long_words=False))
                  for i, c in enumerate(caps, 1)) + '\n'
vtt = 'WEBVTT\n\n' + '\n\n'.join(
    f"{clock(c['start'], '.')} --> {clock(c['end'], '.')}\n{c['text']}" for c in caps) + '\n'
backup('video-captions-en.srt')
(root / 'video-captions-en.srt').write_text(srt)
(root / 'video-captions-v3-en.srt').write_text(srt)
(root / 'video-captions-v3-en.vtt').write_text(vtt)
(out / 'captions.en.srt').write_text(srt)
(out / 'captions.en.vtt').write_text(vtt)
shutil.copy2(master, out / 'video.mp4')
shutil.copy2(root / state['artifacts']['images']['thumbnail'], out / 'thumbnail.jpg')
chapter_text = (root / 'video-production/v3/chapters.txt').read_text()
(out / 'chapters.txt').write_text(chapter_text)
chapters = []
for line in chapter_text.strip().splitlines():
    at, name = line.split(' ', 1)
    m, s = map(int, at.split(':'))
    chapters.append({'at': at, 'seconds': m * 60 + s, 'title': name})
assert chapters[0]['seconds'] == 0
assert all(b['seconds'] - a['seconds'] >= 10 for a, b in zip(chapters, chapters[1:]))
assert chapters[-1]['seconds'] < timeline['duration']

original_metadata = history / 'previous-youtube-metadata.md'
old_meta = (original_metadata if original_metadata.exists() else root / 'youtube-metadata.md').read_text()
sources = old_meta.split('## Sources\n', 1)[1].split('\n## ', 1)[0].strip()
title = 'AI Can Write More Code. What Should Engineers Learn Next?'
description = '''AI is taking on more implementation. I want engineers to use that capacity to get closer to customers, make stronger product decisions, and carry worthwhile work into actual use.

A judgment from my years at Amazon stayed with me: a company can afford roles without needing a team of that size to create its business value. Recent engineering interviews sharpened the question for me: what should our next project teach us?

This film explores five investments for the next five to ten years: industry knowledge, customer contact, product judgment, commercial understanding, and complete delivery.

CHAPTERS
''' + chapter_text.strip() + '''

FIVE INVESTMENTS
• Learn the business behind the feature.
• Watch customers do the work.
• Use cheaper prototypes to make better product decisions.
• Understand what would make someone switch.
• Follow a project into real use.

SOURCES
''' + sources + '''

The document-processing tool is a hypothetical example. My Amazon observations are personal judgments; company statements do not establish what any individual contributed.

Narration uses my approved AI voice clone. Illustrations and music are generated.

More writing: https://www.aaronguo.com

#SoftwareEngineering #AI #ProductThinking
'''
tags = ['AI coding', 'software engineering', 'engineering careers', 'AI agents',
        'product thinking', 'customer discovery', 'business understanding',
        'product judgment', 'commercial value', 'software delivery', 'agentic engineering',
        'Claude Code', 'Boris Cherny', 'Kent Beck', 'Simon Willison', 'future of work', 'Aaron Guo']
assert len(', '.join(tags)) < 500
assert len(description) < 5000
(out / 'youtube-title.txt').write_text(title + '\n')
(out / 'youtube-description.txt').write_text(description)
(out / 'youtube-tags.txt').write_text(', '.join(tags) + '\n')
backup('youtube-metadata.md')
(root / 'youtube-metadata.md').write_text('# YouTube metadata — local review, not uploaded\n\n## Title\n' + title +
    '\n\n## Description\n' + description + '\n## Tags\n' + ', '.join(tags) +
    '\n\n## Thumbnail\nimgs/thumbnail-youtube-v2.jpg (1280×720), selected illustration v2.\n\n'
    '## Delivery state\nCanonical master: video-v3.mp4; packaged byte-for-byte as delivery/video.mp4. '
    'English narration with burned-in captions; matching standalone SRT and VTT exported from the final timeline. '
    'No upload, scheduling, social post, or blog deployment is authorized in this phase. '
    'Add the companion article link only after its future release is verified. '
    'Confirm generated-score release evidence before an authorized public upload.\n')

script = (root / 'youtube-script.md').read_text()
paragraphs = [p.strip() for p in re.split(r'\n\s*\n', script) if p.strip() and not p.startswith('#')]
(out / 'transcript.en.txt').write_text('\n\n'.join(paragraphs) + '\n')
(out / 'README.md').write_text('''# Build what matters — review package

Full film: **7:49.733**, 1920×1080, 30 fps, H.264/AAC.

`video.mp4` is the selected V3 master copied without re-encoding. It includes the complete English narration, selected illustrations, captions, six score cues, natural pauses and closing brand card.

- `thumbnail.jpg`: selected 1280×720 YouTube cover.
- `captions.en.srt` / `captions.en.vtt`: all 893 words in 154 cues, including the 3-second opening offset and revised pauses.
- `chapters.txt`: chapter markers from the final film.
- `youtube-title.txt`, `youtube-description.txt`, `youtube-tags.txt`: editable upload drafts.
- `transcript.en.txt`: complete spoken script.
- `manifest.json`: source master and file integrity record.

The video already has visible English captions. Keep an optional player caption track off unless needed, to avoid displaying two copies.

Status: prepared locally for Aaron's complete viewing. Nothing has been uploaded, scheduled, posted or deployed. The article URL and generated-music release evidence remain checks for a later authorized release. Technical checks and sampled frames do not represent uninterrupted human viewing.
''')
manifest = {'preparedAt': stamp, 'status': 'local-review-only', 'sourceMaster': master.name,
            'sourceSha256': sha(master), 'durationSeconds': timeline['duration'],
            'video': {'width': 1920, 'height': 1080, 'fps': 30},
            'captions': {'source': 'video-production/v3/timeline.json', 'count': len(caps),
                         'words': len(words), 'audioOffsetSeconds': timeline['audioOffset']},
            'files': {p.name: {'bytes': p.stat().st_size, 'sha256': sha(p)}
                      for p in sorted(out.iterdir()) if p.is_file() and p.name != 'manifest.json'}}
(out / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
assert sha(out / 'video.mp4') == sha(master)
archive = root / 'code-upstream-video-review.zip'
with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=3) as z:
    for p in sorted(out.iterdir()):
        if p.is_file(): z.write(p, 'code-upstream-video/' + p.name)
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None

for name, target in [('delivery', out), ('code-upstream-video-review.zip', archive)]:
    link = preview / name
    if link.is_symlink(): link.unlink()
    if not link.exists(): link.symlink_to(target, target_is_directory=target.is_dir())

chapter_buttons = ''.join(f'<button class="chapter" data-time="{c["seconds"]}"><span>{c["at"]}</span>{html.escape(c["title"])}</button>' for c in chapters)
transcript_html = ''.join('<p>' + html.escape(p) + '</p>' for p in paragraphs)
page = '''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Build what matters · 完整视频审片</title>
<style>
:root{color-scheme:light;--paper:#f7f3e9;--ink:#252b26;--green:#355e58;--line:#dad8cc;--muted:#69716b}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
main{max-width:1136px;margin:0 auto;padding:28px 28px 64px}header{display:flex;justify-content:space-between;align-items:center;margin-bottom:34px;gap:16px}
a{color:var(--green);text-underline-offset:4px}header a{text-decoration:none}.brand{letter-spacing:.15em;font-size:12px;font-weight:700}.status{font-size:12px;border:1px solid var(--line);padding:4px 12px;border-radius:99px}
.eyebrow{color:var(--green);letter-spacing:.13em;font-size:12px;font-weight:700}h1{font-size:clamp(26px,3.5vw,39px);line-height:1.3;letter-spacing:-.03em;margin:10px 0 8px}p.lead{color:var(--muted);margin:0 0 24px;max-width:800px}
video{display:block;width:100%;aspect-ratio:16/9;background:#242821;border-radius:5px}.under{display:flex;justify-content:space-between;align-items:center;gap:16px;margin:13px 0 26px;color:var(--muted);font-size:13px}
.actions{display:flex;gap:12px;flex-wrap:wrap}.actions a{padding:10px 17px;border:1px solid var(--line);border-radius:4px;text-decoration:none;font-size:14px}.actions .primary{color:white;background:var(--green);border-color:var(--green)}
.chapters{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 28px;margin:28px 0 32px}.chapter{display:flex;gap:18px;text-align:left;background:none;border:0;border-top:1px solid var(--line);padding:13px 0;color:var(--ink);font:inherit;font-size:14px;cursor:pointer}.chapter span{font-variant-numeric:tabular-nums;color:var(--green)}.chapter:hover,.chapter[aria-current=true]{color:var(--green);font-weight:600}
details{border-top:1px solid var(--line);padding:19px 0}summary{cursor:pointer;font-weight:600}details>div{margin-top:18px}.materials{display:grid;grid-template-columns:320px 1fr;gap:30px}.materials img{max-width:100%;border-radius:4px}.files{display:flex;flex-wrap:wrap;gap:12px 22px}.draft{white-space:pre-wrap;overflow-wrap:anywhere;font-family:inherit;font-size:14px;line-height:1.75;max-height:450px;overflow:auto}.transcript{max-width:740px}.transcript p{margin:0 0 20px}.foot{font-size:13px;color:var(--muted);margin-top:28px}button:focus-visible,a:focus-visible,summary:focus-visible{outline:2px solid var(--green);outline-offset:4px}
@media(max-width:650px){main{padding:20px 16px 40px}header{margin-bottom:26px}.chapters,.materials{grid-template-columns:1fr}.under{align-items:flex-start;flex-direction:column;gap:2px}.chapter{font-size:13px}}
</style>
<main><header><a href="critique.html" class="brand">AARON GUO / FILM</a><span class="status">本地审片 · 尚未发布</span></header>
<div class="eyebrow">BUILD WHAT MATTERS</div><h1>AI 越能写代码，程序员越该走进业务</h1>
<p class="lead">沿用已选定的声音、配乐和插画，从亚马逊时期的判断，讲到工程师未来值得投入的五种能力。</p>
<video id="film" controls playsinline preload="metadata" poster="delivery/thumbnail.jpg"><source src="delivery/video.mp4" type="video/mp4"><track kind="subtitles" srclang="en" label="English · optional" src="delivery/captions.en.vtt"></video>
<div class="under"><span>完整成片 · 7 分 50 秒 · 1080p / 30 fps · 英文旁白与字幕</span><span id="position" aria-live="off">00:00 / 07:50</span></div>
<div class="actions"><a class="primary" href="delivery/video.mp4" download="build-what-matters.mp4">下载完整视频</a><a href="code-upstream-video-review.zip" download>下载全部素材</a><a href="critique.html">查看中英文文章</a></div>
<nav class="chapters" aria-label="视频章节">CHAPTER_BUTTONS</nav>
<details><summary>封面、字幕与章节文件</summary><div class="materials"><div><img src="delivery/thumbnail.jpg" alt="Build what matters，工程师观察业务流程的封面"><br><a href="delivery/thumbnail.jpg" download>下载封面</a></div><div><p>独立字幕已按最终配音和停顿重新导出。视频画面中已带英文字幕。</p><div class="files"><a href="delivery/captions.en.srt" download>英文 SRT</a><a href="delivery/captions.en.vtt" download>英文 VTT</a><a href="delivery/chapters.txt" download>章节时间</a><a href="delivery/transcript.en.txt" download>完整口播稿</a></div></div></div></details>
<details><summary>YouTube 标题、简介与标签草稿</summary><div><strong>VIDEO_TITLE</strong><p class="foot">文案已备齐。文章链接将在实际发布并验证后添加。</p><pre class="draft">DESCRIPTION</pre><div class="files"><a href="delivery/youtube-title.txt" download>标题</a><a href="delivery/youtube-description.txt" download>简介</a><a href="delivery/youtube-tags.txt" download>标签</a></div></div></details>
<details><summary>阅读全文口播稿</summary><div class="transcript">TRANSCRIPT</div></details>
<p class="foot">这次交付停在完整审片。视频、博客和社交文案均未发布。</p></main>
<script>
const film=document.querySelector('#film');
const chapters=[...document.querySelectorAll('.chapter')];
const fmt=n=>`${Math.floor(n/60).toString().padStart(2,'0')}:${Math.floor(n%60).toString().padStart(2,'0')}`;
chapters.forEach(b=>b.addEventListener('click',()=>{film.currentTime=Number(b.dataset.time);film.scrollIntoView({block:'center',behavior:'smooth'});}));
film.addEventListener('timeupdate',()=>{document.querySelector('#position').textContent=`${fmt(film.currentTime)} / ${fmt(film.duration||469.733333)}`;chapters.forEach((b,i)=>b.setAttribute('aria-current',film.currentTime>=Number(b.dataset.time)&&(!chapters[i+1]||film.currentTime<Number(chapters[i+1].dataset.time))?'true':'false'));});
film.addEventListener('error',()=>{document.querySelector('#position').textContent='播放遇到问题，可下载完整视频查看。';});
</script></html>'''
page = page.replace('CHAPTER_BUTTONS', chapter_buttons).replace('VIDEO_TITLE', html.escape(title)).replace('DESCRIPTION', html.escape(description)).replace('TRANSCRIPT', transcript_html)
(preview / 'film.html').write_text(page)

backup('package-state.json')
state['updatedAt'] = stamp
state['scope'] = 'Prepare the complete selected film and follow-up assets for local author review. User explicitly says do not publish.'
state['artifacts']['video']['status'] = 'full-film-prepared-for-final-viewing'
state['artifacts']['video']['delivery'] = 'delivery/video.mp4'
state['artifacts']['captions'] = {'canonical': 'video-captions-v3-en.srt', 'vtt': 'video-captions-v3-en.vtt', 'status': 'matches-final-render-timeline', 'cues': len(caps)}
state['artifacts']['delivery'] = {'directory': 'delivery', 'archive': archive.name, 'manifest': 'delivery/manifest.json', 'status': 'local-review-only'}
state['review']['previousUrl'] = state['review']['url']
state['review']['url'] = 'http://127.0.0.1:4332/film.html'
state['review']['latestFeedback'] = 'Author says the new version is good across aspects and requests the complete video and follow-up assets, without publishing, for viewing.'
state['review']['fullWatchAndListening'] = 'Author accepted the new version overall; complete delivery is available for viewing. No claim of uninterrupted agent listening or author completion.'
state['checks']['authorMediaReview'] = 'Current direction accepted; complete delivery awaiting final viewing'
state['checks']['captionsV3'] = '154 cues / 893 words match the final timeline, including opening offset and inserted pauses'
state['publishing']['authorization'] = 'explicitly-not-authorized-this-phase'
(root / 'package-state.json').write_text(json.dumps(state, ensure_ascii=False, indent=2) + '\n')
(history / 'feedback.md').write_text('''# Complete film delivery — 2026-09-08

Aaron: “好的，我觉得新的这个版本各方面都不错，可以帮我做一个完整的视频了。然后包括这些视频的后续，先不用发布，先把整个视频都做出来，然后我看一下。”

Action: preserve the complete selected V3 film, correct the stale standalone captions using its exact render timeline, prepare the cover/chapters/transcript/upload-copy bundle, and provide a dedicated full-film page. Do not interpret this as upload, deployment, scheduling or social-post authorization.

The complete V3 already contained all narration and closing material; no new stochastic voice, score or image generation was needed.
''')
print(json.dumps({'review': state['review']['url'], 'masterSha256': sha(master), 'subtitleCues': len(caps), 'words': len(words), 'archiveBytes': archive.stat().st_size, 'files': len(manifest['files'])}, indent=2))
