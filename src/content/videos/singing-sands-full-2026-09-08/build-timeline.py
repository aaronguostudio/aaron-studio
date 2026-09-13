from pathlib import Path
import json,re,math
p=Path(__file__).resolve().parent
m=json.loads((p/'extension/audio-generation-manifest.json').read_text())
zh=['那么，到底是什么在振动？','从沙子的滑落开始。','沙粒滚动、滑行，从彼此身边经过。','研究者把声音与这种相对运动联系起来。','风能推动沙子，但这并不是风在吹奏一支巨大的笛子。','一种有影响力的解释，是同步。','想象一群人一起拍手。','零散的掌声，听起来杂乱无章。','当大家进入共同的节奏，清晰的脉动就出现了。','这只是一个类比。','它帮助我们理解：许多沙粒的运动，如何形成持续音，而不只是沙沙声。','接着，一个实验带来了重要线索。','研究者把会唱歌的沙子，带进了实验室。','他们让沙子沿着倾斜的硬底实验槽滑落。','沙子依然发出了声音。','在这些实验条件下，沙子不需要下面有一整座沙丘，也能发声。','他们还研究了沙粒的大小。','粒径混杂的沙子，发出的声音更宽杂、更嘈杂。','筛出粒径范围更窄的沙子后，音调变得更加明确。','改变沙粒，也改变了声音。','这是一个很有力的线索。','但研究中，并不只有一种解释。','野外研究强调，沙丘内部的分层能够引导并增强振动。','另一些实验，则强调流动的沙粒。','让沙子在实验室里唱歌，回答了一个问题。','但它没有解决整片山坡轰鸣的每一个细节。','可以这样理解：滑落让具备条件的沙子运动起来。','集体运动，可以把这些运动组织成声音。','颗粒的性质、沙子的流动，以及周围的条件，都很重要。','微小的东西一起运动，也能让一片风景发声。']
words=m['timeline']['wordTimings'];chunks=[];chunk=[]
for w in words:
 chunk.append(w)
 if re.search(r'[.!?]$',w['word']):chunks.append(chunk);chunk=[]
assert not chunk and len(chunks)==len(zh),(len(chunks),len(zh))
start=1477/30;endframe=math.ceil((start+m['timeline']['duration']+.6)*30)
caps=[dict(start=start+c[0]['start'],end=start+c[-1]['end'],text=z,en=' '.join(w['word'] for w in c)) for c,z in zip(chunks,zh)]
credits=['解释动画 · AI 沙粒插画背景','同步类比 · 非实验影像','实验原理重绘 · Dagois-Bohy 等，2012','筛分原理示意 · Dagois-Bohy 等，2012','实景 · Kurt Moses / NPS · 分层为示意','实景照片 · Kurt Moses / NPS · Eureka Dunes']
scenes=[dict(id=f'science-{i+1}',title=s['title'],start=start+s['start'],end=start+s['end'],credit=credits[i]) for i,s in enumerate(m['timeline']['segments'])]
scenes[-1]['end']=endframe/30
d=dict(durationFrames=endframe+435,introFrames=1477,endStartFrame=endframe,scenes=scenes,captions=caps)
(p/'timeline.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
Path('tiles/aaron-video-gen/remotion/src/projects/singing-sands-full/data.ts').write_text('export const data = '+json.dumps(d,ensure_ascii=False,indent=2)+';\n')
(p/'audio-assembly.json').write_text(json.dumps(dict(duration=(endframe+435)/30,voice=m['tts'],segments=[dict(source='../singing-sands-pilot-2026-09-08/pilot-mix.wav',source_start=0,source_end=start,timeline_start=0,approval='author-approved 2026-09-08'),dict(source='extension/audio.mp3',timeline_start=start),dict(source='../singing-sands-pilot-2026-09-08/pilot-mix.wav',source_start=59.5,source_end=74,timeline_start=endframe/30,approval='author-approved 2026-09-08')]),indent=2)+'\n')
print(json.dumps({'duration':d['durationFrames']/30,'scenes':scenes},ensure_ascii=False,indent=2))
