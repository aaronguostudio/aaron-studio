from pathlib import Path
import argparse
import html
import re
import json

ROOT = Path(__file__).parent
parser = argparse.ArgumentParser()
parser.add_argument('--duration', type=float)
parser.add_argument('--revision', type=int, default=3)
args = parser.parse_args()


def inline(text):
    text = html.escape(text)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2" target="_blank" rel="noopener">\1</a>', text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    return text


def article(filename, video=False):
    text = (ROOT / filename).read_text()
    text = re.sub(r'^---\n.*?\n---\n', '', text, flags=re.S)
    blocks = []
    for block in re.split(r'\n\s*\n', text.strip()):
        if block.startswith('# '):
            continue
        if block.startswith('## '):
            title = block[3:].strip()
            if video:
                title = title.replace('[HOOK]', 'Opening')
                title = re.sub(r'^\[SLIDE: (.*?) — [^\]]+\]$', r'\1', title)
            blocks.append('<h2>' + inline(title) + '</h2>')
        elif block.startswith('!['):
            match = re.fullmatch(r'!\[([^\]]*)\]\(([^)]+)\)', block)
            if match:
                blocks.append('<figure><a href="' + html.escape(match[2]) + '" target="_blank"><img loading="lazy" src="' + html.escape(match[2]) + '" alt="' + html.escape(match[1]) + '"></a></figure>')
        elif block.startswith('*') and block.endswith('*') and not block.startswith('**'):
            blocks.append('<p class="caption">' + inline(block[1:-1]) + '</p>')
        else:
            blocks.append('<p>' + inline(block.replace('\n', ' ')) + '</p>')
    return '\n'.join(blocks)


audio = '<div class="audio-box"><h2>新版旁白</h2><p>六点版脚本已更新，旁白正在同步制作。上一版旁白已存档。</p></div>'
if args.duration is not None:
    duration = f'{round(args.duration)//60}:{round(args.duration)%60:02d}'
    audio = f'''<div class="audio-box"><h2>六点版 · 先听开头 60 秒</h2><p>V{args.revision} 旁白 · 结尾已补充 · 完整时长 {duration} · 沿用 Aaron 的声音</p><audio controls preload="metadata" src="audio-sample-60s.mp3?v={args.revision}"></audio><details><summary>完整旁白 · {duration}</summary><audio controls preload="none" src="audio.mp3?v={args.revision}"></audio></details><details><summary>中段与结尾试听</summary><p>中段</p><audio controls preload="none" src="audio-sample-middle-60s.mp3?v={args.revision}"></audio><p>结尾</p><audio controls preload="none" src="audio-sample-late-60s.mp3?v={args.revision}"></audio></details></div>'''

page = '''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>我把 Astra 用进真实工作 · Aaron Studio</title><link rel="stylesheet" href="review.css?v=__REVISION__"></head><body><header><b>AARON STUDIO</b><span>06 SEP 2026 · REVISION __REVISION_PADDED__</span></header><main><div class="hero"><div class="eyebrow">GPT-6 ASTRA / REAL WORK</div><h1>我把 GPT-6 Astra<span>用进了真实工作。</span></h1><p class="deck">从 Azure、Linux 与 Windows 的复杂部署，到更自然的日常写作。六个值得关注的变化。</p></div><nav class="nav" aria-label="审阅内容"><button data-view="zh" aria-pressed="true">中文文章</button><button data-view="en" aria-pressed="false">English</button><button data-view="video" aria-pressed="false">视频与旁白</button><button data-view="direction" aria-pressed="false">视觉方向</button></nav><div class="layout"><div><article id="zh">'''
page += article('gpt-6-astra-real-work-zh.md')
page += '</article><article id="en" hidden>' + article('gpt-6-astra-real-work.md') + '</article>'
film = ''
if (ROOT / 'video.mp4').exists():
    length = json.loads((ROOT / 'video-production/timeline.json').read_text())['duration']
    film_duration = f'{int(length)//60}:{int(length)%60:02d}'
    film = f'<div class="film"><h2>完整视频 · {film_duration}</h2><video controls playsinline preload="metadata" poster="imgs/thumbnail-youtube.jpg?v={args.revision}" src="video.mp4?v={args.revision}"></video><p class="media-note">1080p · 英文旁白与字幕 · 五段克制的音乐 · 人声保持稳定</p><p class="media-note"><a href="video.mp4" download>下载完整视频</a> · <a href="video-nomusic.mp4" download>纯旁白版</a> · <a href="imgs/thumbnail-youtube.jpg" target="_blank">YouTube 缩略图</a></p></div>'
page += '<article id="video" hidden>' + film + '<details><summary>旁白试听与视频脚本</summary>' + audio + article('youtube-script.md', video=True) + '</details></article>' 
page += '''<article id="direction" hidden><h2>跟着一件真实工作走</h2><p>用干净的编辑版面、克制的插画和少量真实来源截图，讲清楚任务怎样跨过几个工具。保留之前喜欢的留白和音乐处理，标题与画面都转向“ASTRA AT WORK”。</p><figure><img src="imgs/web/00-cover.webp" alt="跨工具的连续工作台插画"></figure><p>部署段落用逐步连起来的流程，长任务用留着工作记录的纸页，写作用散落想法汇入文章，结尾回到安静的检查与思考。全片保留同一套暖白、石墨和低饱和蓝绿色。</p><h2>YouTube 缩略图</h2><figure><img src="imgs/thumbnail-youtube.jpg?v=__REVISION__" alt="ASTRA AT WORK 视频缩略图"></figure><h2>已经加入文章的来源画面</h2><figure><img src="imgs/evidence/openai-blender.png" alt="OpenAI 的 Blender 房屋展示"></figure><p class="caption">OpenAI 官方 Blender model 展示。<a href="https://openai.com/index/gpt-6-astra/" target="_blank" rel="noopener">查看来源</a></p><figure><img src="imgs/evidence/openai-google-maps.png" alt="OpenAI 的 Google Maps 路线演示"></figure><p class="caption">OpenAI 官方 Pediatrician search 展示。截图呈现展示内容，不代表独立复现或耗时测量。</p><p>音乐缓慢进入和退出，人声保持稳定；停顿放在完整意思之后。示意图与公开证据分开标注。</p></article></div><aside><div class="note"><h3>这次的主线</h3>把更完整的一段工作交给 Astra：它能够跨过工具、环境和问题，让实际任务继续推进。</div><div class="note"><h3>六个要点</h3><ol class="point-list"><li>复杂部署，接得住</li><li>工具之间，连起来了</li><li>长任务，接着做</li><li>更自主，也要听劝</li><li>文字更自然</li><li>值不值，算总账</li></ol></div><div class="note"><h3>V__REVISION__ 更新</h3>封面采用你提供的浅黄色 ASTRA 字样与轻微彩色边缘，右上方加入白色 OpenAI 标识。视频片头同步更新，正文和声音沿用已认可的版本。<p><a href="revision-v__REVISION__.md">修改说明</a></p></div></aside></div><div class="footer">Local review · V__REVISION__ · 未发布 · 公开展示、作者自述与个人体验均注明来源和性质。</div></main><script>document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('article').forEach(a=>a.hidden=a.id!==button.dataset.view);history.replaceState(null,'','#'+button.dataset.view);document.querySelector('.nav').scrollIntoView({block:'start'});}));const initial=location.hash.slice(1);if(['zh','en','video','direction'].includes(initial))document.querySelector('[data-view='+initial+']').click();</script></body></html>'''
page = page.replace('__REVISION_PADDED__', f'{args.revision:02d}').replace('__REVISION__', str(args.revision))
(ROOT / 'review.html').write_text(page)
print(f'Rendered revision {args.revision} review page' + (' with aligned audio' if args.duration else ' while audio is prepared'))
