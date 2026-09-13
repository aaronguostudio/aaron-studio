from pathlib import Path
import argparse
import html
import re

ROOT = Path(__file__).parent
parser = argparse.ArgumentParser()
parser.add_argument('--duration', type=float)
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


audio = '<div class="audio-box"><h2>新版旁白</h2><p>六点版脚本已更新，旁白正在同步制作。上一版八点旁白已存档。</p></div>'
if args.duration is not None:
    duration = f'{round(args.duration)//60}:{round(args.duration)%60:02d}'
    audio = f'''<div class="audio-box"><h2>六点版 · 先听开头 60 秒</h2><p>V2 新旁白 · 完整时长 {duration} · 沿用 Aaron 的声音</p><audio controls preload="metadata" src="audio-sample-60s.mp3?v=2"></audio><details><summary>完整旁白 · {duration}</summary><audio controls preload="none" src="audio.mp3?v=2"></audio></details><details><summary>中段与结尾试听</summary><p>中段</p><audio controls preload="none" src="audio-sample-middle-60s.mp3?v=2"></audio><p>结尾</p><audio controls preload="none" src="audio-sample-late-60s.mp3?v=2"></audio></details></div>'''

page = '''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>我把 Astra 用进真实工作 · Aaron Studio</title><link rel="stylesheet" href="review.css?v=2"></head><body><header><b>AARON STUDIO</b><span>06 SEP 2026 · REVISION 02</span></header><main><div class="hero"><div class="eyebrow">GPT-6 ASTRA / REAL WORK</div><h1>我把 GPT-6 Astra<span>用进了真实工作。</span></h1><p class="deck">从 Azure、Linux 与 Windows 的复杂部署，到更自然的日常写作。六个值得关注的变化。</p></div><nav class="nav" aria-label="审阅内容"><button data-view="zh" aria-pressed="true">中文文章</button><button data-view="en" aria-pressed="false">English</button><button data-view="video" aria-pressed="false">视频与旁白</button><button data-view="direction" aria-pressed="false">视觉方向</button></nav><div class="layout"><div><article id="zh">'''
page += article('gpt-6-astra-real-work-zh.md')
page += '</article><article id="en" hidden>' + article('gpt-6-astra-real-work.md') + '</article>'
page += '<article id="video" hidden>' + audio + '<p class="meta">GPT-6 Astra in Real Work: 6 Things That Changed<br>六点版视频脚本。成片尚未渲染。</p>' + article('youtube-script.md', video=True) + '</article>'
page += '''<article id="direction" hidden><h2>推荐：跟着一件真实工作走</h2><p>用干净的编辑版面、克制的插画和少量真实来源截图，讲清楚任务怎样跨过几个工具。保留之前喜欢的留白和音乐处理，标题与画面都转向“ASTRA AT WORK”。</p><div class="options"><div class="option"><strong>A / 真实工作的旅程 · 推荐</strong>先交代 Linux 系统为什么需要 Windows 服务，再逐渐加入 Azure、网络、证书和验证。两张公开展示截图穿插在工具讨论中；写作段落用连贯的段落排版表现自然表达。</div><div class="option"><strong>B / 发布解读</strong>更快的六点索引和公开案例切换，技术发布感更强，个人经历更紧凑。</div><div class="option"><strong>C / 安静的工作台</strong>更注重桌面物件、质感与留白，用较少的流程图讲述个人使用体验。</div></div><h2>已经加入文章的来源画面</h2><figure><img src="imgs/evidence/openai-blender.png" alt="OpenAI 的 Blender 房屋展示"></figure><p class="caption">OpenAI 官方 Blender model 展示。<a href="https://openai.com/index/gpt-6-astra/" target="_blank" rel="noopener">查看来源</a></p><figure><img src="imgs/evidence/openai-google-maps.png" alt="OpenAI 的 Google Maps 路线演示"></figure><p class="caption">OpenAI 官方 Pediatrician search 展示。截图呈现展示内容，不代表独立复现或耗时测量。</p><p>音乐缓慢进入和退出，人声保持稳定；停顿放在完整意思之后。示意图与公开证据分开标注。</p></article></div><aside><div class="note"><h3>这次的主线</h3>把更完整的一段工作交给 Astra：它能够跨过工具、环境和问题，让实际任务继续推进。</div><div class="note"><h3>六个要点</h3><ol class="point-list"><li>复杂部署，接得住</li><li>工具之间，连起来了</li><li>长任务，接着做</li><li>更自主，也要听劝</li><li>文字更自然</li><li>值不值，算总账</li></ol></div><div class="note"><h3>V2 更新</h3>补充部署背景、公开案例和截图。删除独立的第七、八点，去掉牵强的旧文呼应。<p><a href="revision-v2.md">修改说明</a></p></div></aside></div><div class="footer">Local review · V2 · 未发布 · 公开展示、作者自述与个人体验均注明来源和性质。</div></main><script>document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('article').forEach(a=>a.hidden=a.id!==button.dataset.view);}));</script></body></html>'''
(ROOT / 'review.html').write_text(page)
print('Rendered six-point review page' + (' with v2 audio' if args.duration else ' while v2 audio is prepared'))
