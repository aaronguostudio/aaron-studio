"""Build a local reading preview for this article's small Markdown subset."""
from pathlib import Path
import html
import json
import re
import shutil

root = Path(__file__).parent
slug = "code-is-cheap-opportunity-moves-upstream"
out = root / "preview"
out.mkdir(exist_ok=True)


def inline(text):
    text = html.escape(text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", lambda m: '<a href="' + ("https://www.aaronguo.com" if m[2].startswith("/") else "") + m[2] + '" target="_blank" rel="noopener noreferrer">' + m[1] + "</a>", text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    return re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", text)


def render(name, lang):
    source = (root / name).read_text()
    body = re.sub(r"\A---\n.*?\n---\n", "", source, flags=re.S)
    content, toc = [], []
    for block in re.split(r"\n\s*\n", body.strip()):
        if re.fullmatch(r"!\[([^\]]*)\]\(([^)]+)\)", block):
            alt, src = re.fullmatch(r"!\[([^\]]*)\]\(([^)]+)\)", block).groups()
            content.append(f'<figure><img src="{html.escape(src, quote=True)}" alt="{html.escape(alt, quote=True)}" loading="lazy"></figure>')
        elif block.startswith("## "):
            title = block[3:]
            anchor = f"{lang}-{len(toc)}"
            content.append(f'<h2 id="{anchor}">{inline(title)}</h2>')
            toc.append(f'<a href="#{anchor}">{inline(title)}</a>')
        elif block.startswith("# "):
            content.append(f"<h1>{inline(block[2:])}</h1>")
        else:
            content.append(f"<p>{inline(block)}</p>")
    return "\n".join(content), "\n".join(toc)


zh, zhtoc = render(slug + "-zh.md", "zh")
en, entoc = render(slug + ".md", "en")
page = '''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>代码越来越便宜，程序员的机会在前移 · 阅读稿</title>
<style>
:root{color-scheme:light;--paper:#faf8f3;--ink:#242b29;--muted:#727970;--line:#dedfd6;--green:#375c46}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:95px}body{margin:0;background:var(--paper);color:var(--ink);font-family:system-ui,-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}a{color:var(--green);text-decoration-thickness:1px;text-underline-offset:4px}button,a{touch-action:manipulation}button{font:inherit;cursor:pointer}.top{position:sticky;top:0;z-index:2;background:#faf8f3f5;border-bottom:1px solid var(--line);backdrop-filter:blur(12px)}.bar{max-width:1210px;margin:auto;min-height:68px;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:12px 32px}.brand{font-size:13px;letter-spacing:.12em;font-weight:650}.badge{font-size:12px;color:var(--muted);margin-left:14px}.controls{display:flex;align-items:center;gap:6px}.controls button{border:0;background:transparent;border-radius:6px;padding:8px 13px;color:#596358}.controls button[aria-pressed=true]{color:white;background:var(--green)}.controls a{font-size:13px;margin-left:15px;text-decoration:none}.layout{display:grid;grid-template-columns:minmax(0,760px) 235px;gap:78px;max-width:1180px;margin:auto;padding:58px 32px 100px}.eyebrow{color:var(--green);font-size:12px;letter-spacing:.15em;font-weight:650}.meta{color:var(--muted);font-size:13px;margin-top:14px;margin-bottom:33px}h1{text-wrap:balance;font-size:clamp(32px,3.8vw,47px);line-height:1.35;font-weight:650;letter-spacing:-.035em;margin:0 0 35px}h2{font-size:26px;line-height:1.45;margin:55px 0 20px;letter-spacing:-.02em;font-weight:650}article p{font-size:18px;line-height:1.95;letter-spacing:.01em;margin:0 0 24px}article[lang=en] p{font-size:19px;line-height:1.85;letter-spacing:0}article strong{font-weight:650;color:#203f2f}article p:last-child{font-size:13px;line-height:1.8;color:var(--muted);border-top:1px solid var(--line);padding-top:24px;margin-top:36px}aside{align-self:start;position:sticky;top:105px}.side-title{font-size:11px;color:var(--muted);letter-spacing:.13em;font-weight:650;margin:0 0 20px}.toc a{display:block;color:#626b61;text-decoration:none;font-size:13px;line-height:1.6;margin:0 0 16px}.toc a:hover{color:var(--green)}.note{margin-top:35px;border-top:1px solid var(--line);padding-top:25px;font-size:12px;line-height:1.85;color:var(--muted)}.note a{display:block;margin-top:12px}details{margin-top:56px;border-top:1px solid var(--line);padding-top:22px;font-size:14px;line-height:1.9}summary{cursor:pointer;color:var(--green);font-weight:600}details ul{padding-left:22px}details li{margin-bottom:12px}.pill{display:inline-block;background:#e9eee5;color:var(--green);font-size:11px;border-radius:20px;padding:3px 10px;margin-top:18px}[hidden]{display:none!important}:focus-visible{outline:2px solid #537b5b;outline-offset:5px}@media(max-width:950px){.layout{grid-template-columns:minmax(0,760px);gap:0;justify-content:center}aside{display:none}}@media(max-width:600px){.bar{padding:10px 20px;flex-wrap:wrap;gap:7px}.brand{font-size:11px}.badge{margin-left:8px}.controls button{font-size:12px;padding:6px 10px}.controls a{font-size:12px;margin-left:8px}.layout{padding:34px 22px 65px}article p{font-size:17px;line-height:1.95}h2{font-size:23px;margin-top:40px}h1{font-size:33px}.meta{margin-bottom:25px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style></head><body>
<header class="top"><div class="bar"><div><span class="brand">AARON GUO / NOTES</span><span class="badge">阅读草稿</span></div><nav class="controls" aria-label="阅读版本"><button id="zh-btn" aria-pressed="true" onclick="setLang('zh')">中文</button><button id="en-btn" aria-pressed="false" onclick="setLang('en')">English</button><a href="#review-notes">本次修订</a></nav></div></header>
<div class="layout"><main><div class="eyebrow">PRODUCT &amp; ENGINEERING</div><div class="meta">Aaron Guo · 2026.09.07 · 六个建议</div>
<article id="zh" lang="zh-CN">{{ZH}}</article><article id="en" lang="en" hidden>{{EN}}</article>
<details id="review-notes"><summary>这次试写，具体修改了什么</summary><ul><li>把“工程师是否要转岗”的适用范围移到前面，给结尾留出完整表达。</li><li>分开历史事实与后续解释，明确来源能支持到哪里。</li><li>补充“规格随反馈更新”，避免把需求前移理解为先写一份厚文档。</li><li>最后一条建议增加具体起点：回看过去因成本而搁置的小需求。</li></ul><p>原始字幕已核对关键段落。三场访谈是本次研究选材，尚未与您原来想到的视频匹配。以上修改理由为模型编辑判断，您的偏好尚待反馈；没有旧 skill 控制组。</p><a href="review.json" download>下载 SkillDev 对照包</a> · <a href="http://127.0.0.1:5178/?view=editorial" target="_blank" rel="noopener">在 SkillDev 中评审</a></details>
</main><aside><div class="side-title">IN THIS ARTICLE</div><nav class="toc" id="zh-toc" aria-label="中文目录">{{ZHTOC}}</nav><nav class="toc" id="en-toc" aria-label="English contents" hidden>{{ENTOC}}</nav><div class="note">3 场访谈 · 6 个原始来源<br>中文先行，英文自然改写。<br>文章待审，尚未发布。<a href="#review-notes">查看修改理由 ↓</a><span class="pill">新 skill · 第一次真实试写</span></div></aside></div>
<script>function setLang(lang){for(const x of ['zh','en']){document.getElementById(x).hidden=x!==lang;document.getElementById(x+'-toc').hidden=x!==lang;document.getElementById(x+'-btn').setAttribute('aria-pressed',String(x===lang));}document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.title=lang==='zh'?'代码越来越便宜，程序员的机会在前移 · 阅读稿':'Code Is Getting Cheaper · Reading Draft';window.scrollTo({top:0,behavior:'instant'});}document.querySelectorAll('a[href="#review-notes"]').forEach(a=>a.addEventListener('click',()=>document.getElementById('review-notes').open=true));</script>
</body></html>'''
for token, value in [("ZH", zh), ("EN", en), ("ZHTOC", zhtoc), ("ENTOC", entoc)]:
    page = page.replace("{{" + token + "}}", value)
state = json.loads((root / "package-state.json").read_text())
if state.get("phase") == "argument-revision":
    page = page.replace("阅读草稿", "原稿 · 已退回")
    page = page.replace('<article id="zh"', '<p style="padding:18px 22px;border-left:3px solid var(--green);background:#edf0e7;line-height:1.8">这版文章已被作者退回，保留用于复盘。<a href="critique.html">阅读新的方向样段 →</a></p><article id="zh"')
    page = re.sub(r'<details id="review-notes">.*?</details>', '<details id="review-notes"><summary>作者反馈与本次修订</summary><p>原稿的模型自评曾通过，但作者指出：主张不鲜明，论据没有展开，缺少长期思考与个人热情。本次已重新打开论证阶段，保留原稿，并调整了写作规则。</p><p>新的内容仅为开头、一节正文与结尾的方向样段，尚未替换全文，也尚未得到作者评价。</p><a href="critique.html">阅读方向样段</a> · <a href="review.json" download>下载 SkillDev 对照包</a> · <a href="http://127.0.0.1:5178/?view=editorial">在 SkillDev 中评审</a></details>', page, flags=re.S)
    page = page.replace("文章待审，尚未发布。", "原稿已退回，论证重写中。")
    probe, probetoc = render(state["artifacts"]["directionProbe"], "probe")
    style = re.search(r"<style>(.*?)</style>", page, flags=re.S)[1]
    critique = '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI 与程序员的未来 · 方向样段</title><style>' + style + 'article p:last-child{font-size:18px;line-height:1.95;color:var(--ink);border:0;padding:0;margin:0 0 24px}article h1+p{font-size:14px;color:var(--muted)}@media(max-width:600px){article p:last-child{font-size:17px}}</style></head><body><header class="top"><div class="bar"><div><span class="brand">AARON GUO / NOTES</span><span class="badge">方向样段 · 待评价</span></div><nav class="controls"><a href="review.html">查看原稿</a><a href="http://127.0.0.1:5178/?view=editorial">SkillDev 对照</a></nav></div></header><div class="layout"><main><div class="eyebrow">A CLEARER POINT OF VIEW</div><div class="meta">Aaron Guo · 2026.09.07 · 开头 / 正文一节 / 结尾</div><article lang="zh-CN">' + probe + '</article></main><aside><div class="side-title">方向试写</div><nav class="toc">' + probetoc + '</nav><div class="note">这次先检验主张与论证。<br>原稿保持原样，完整文章仍待重写。<br>样段尚未获得作者评价。<a href="review.json" download>下载对照包</a></div></aside></div></body></html>'
    (out / "critique.html").write_text(critique)
elif state.get("phase") in ("article-review", "media-production", "media-review"):
    page = page.replace("阅读草稿", "全文草稿 · 待审")
    page = page.replace("代码越来越便宜，程序员的机会在前移", "AI 越能写代码，程序员越该走进业务")
    page = page.replace("Code Is Getting Cheaper · Reading Draft", "As AI Takes On More Coding, Get Closer to the Business · Reading Draft")
    page = page.replace("六个建议", "五个建议")
    page = page.replace("3 场访谈 · 6 个原始来源", "3 场访谈 · 9 个原始来源")
    page = page.replace("新 skill · 第一次真实试写", "方向已确认 · 全文重写")
    page = re.sub(r'<details id="review-notes">.*?</details>', '<details id="review-notes"><summary>按已确认方向完成的全文</summary><ul><li>开头用“我就有这样一个判断”，通过“我并不惊讶”衔接组织调整和裁员消息。</li><li>五项建议分别展开行业、客户、产品取舍、商业价值和完整交付。</li><li>个人报表项目只保留一句及旧文链接；结尾回到未来五到十年的投入与期待。</li></ul><p>方向已获作者认可，这次中英文全文仍待阅读。来源和措辞检查通过；模型审读不是作者偏好。旧稿、反馈与样段已保留。</p><a href="review.json" download>下载 SkillDev 对照包</a> · <a href="http://127.0.0.1:5178/?view=editorial">在 SkillDev 中评审</a></details>', page, flags=re.S)
    # Keep the author's current reading URL useful after moving from samples to the full draft.
    (out / "critique.html").write_text(page)
if state.get("phase") in ("media-production", "media-review"):
    page = page.replace("全文草稿 · 待审", "文章已确认 · 配图与视频")
    media_ready = state.get("phase") == "media-review"
    page = page.replace("文章待审，尚未发布。", "文章已确认，配图与视频待审。" if media_ready else "文章已确认，媒体制作中。")
    page = page.replace("方向已确认 · 全文重写", "完整视频 · 待审阅" if media_ready else "作者已确认 · 媒体制作")
    page = page.replace("方向已获作者认可，这次中英文全文仍待阅读。来源和措辞检查通过；模型审读不是作者偏好。旧稿、反馈与样段已保留。", "作者认为全文已有提高，并同意继续制作。现已加入封面和三张正文插图；旧稿、反馈与已接受的全文仍保留用于对照。")
    page = page.replace("</style>", "figure{margin:34px 0 44px}figure img{display:block;width:100%;height:auto;border-radius:3px}.media-review{margin:48px 0;padding-top:30px;border-top:1px solid var(--line)}video{width:100%;background:#f4f1e9}audio{width:100%}</style>")
    media = '<section class="media-review" id="video"><h2>视频预览</h2>'
    if state.get("artifacts", {}).get("delivery"):
        review_page = state.get('review', {}).get('url', 'film.html').rsplit('/', 1)[-1]
        media += f'<p><a href="{html.escape(review_page, quote=True)}"><strong>打开完整审片页面 →</strong></a> · 全片、章节跳转、字幕、封面与下载素材</p>'
    video_info = state.get("artifacts", {}).get("video", {})
    video_file = video_info.get("canonical") or "video.mp4"
    no_music_file = video_info.get("noMusic") or "video-nomusic.mp4"
    audio_file = state.get("artifacts", {}).get("audio", {}).get("canonical") or "audio.mp3"
    poster_file = state.get("artifacts", {}).get("images", {}).get("thumbnail") or "imgs/thumbnail-youtube.jpg"
    if (root / video_file).exists():
        media += f'<video controls preload="metadata" poster="{html.escape(poster_file, quote=True)}"><source src="{html.escape(video_file, quote=True)}" type="video/mp4"></video><p>完整制作稿 · 待作者审阅</p><a href="{html.escape(no_music_file, quote=True)}">纯人声版本</a>'
        if state.get("artifacts", {}).get("soundSelection"):
            if video_info.get('version', 0) >= 4:
                if video_info.get('version') == 5:
                    media += '<p>V5 精简版：去掉侧边目录和底部标注，放大关键文字。每页只突出一个观点；声音和节奏沿用 V4。</p><p><a href="film-v4.html">对照上一版完整视频</a></p>'
                else:
                    media += '<p>V4 章节版：固定大标题与小节导航，章节之间留出停顿，配乐随转场进入。沿用已选定的声音 B 和插画。</p><p><a href="film.html">对照上一版完整视频</a></p>'
            else:
                media += '<p>声音与配乐 V3：已采用你选择的视频 B 与声音 B，扩展到全片。</p><p><a href="sound-review.html">回看一分钟试听对照</a></p>'
            for sample in state.get("artifacts", {}).get("audio", {}).get("samples", []):
                media += f'<details><summary>{html.escape(sample["label"])} · 60 秒人声</summary><audio controls preload="none" src="{html.escape(sample["path"], quote=True)}"></audio></details>'
    elif (root / audio_file).exists():
        media += f'<p>旁白已生成，视频画面制作中。</p><audio controls preload="metadata" src="{html.escape(audio_file, quote=True)}"></audio>'
    else:
        media += '<p>旁白与视频正在制作，文章配图可先阅读。</p>'
    media += '</section>'
    page = page.replace('<details id="review-notes">', media + '<details id="review-notes">')
    page = page.replace('<a href="#review-notes">本次修订</a>', '<a href="#video">视频</a><a href="#review-notes">本次修订</a>')
    if state.get("artifacts", {}).get("visualFeedback"):
        page = page.replace('<summary>按已确认方向完成的全文</summary>', '<summary>文章与配图修订</summary><p>这轮保留纸感画风，重新设计配图内容：工程师定位业务缺口、现场观察单据异常、比较产品方案，以及工具进入日常运营。人物的职责通过工作动作和业务对象表达。文章正文、旁白和配乐保持原样。</p>')
    if state.get("artifacts", {}).get("soundSelection"):
        page = page.replace('文章正文、旁白和配乐保持原样。', '文章正文与配图保持原样；声音和配乐已按选中的 B 方向更新。')
    sample_files = [sample["path"] for sample in state.get("artifacts", {}).get("audio", {}).get("samples", [])]
    for name in ("imgs", audio_file, video_file, no_music_file, *sample_files):
        target = out / name
        if (root / name).exists() and not target.exists():
            target.symlink_to((root / name).resolve(), target_is_directory=(name == "imgs"))
    (out / "critique.html").write_text(page)
(out / "review.html").write_text(page)
shutil.copyfile(root / state["artifacts"]["editorialReview"], out / "review.json")
print(json.dumps({"html": str(out / "review.html"), "bytes": len(page.encode())}))
