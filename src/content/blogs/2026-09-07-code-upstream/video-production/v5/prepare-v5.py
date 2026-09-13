from pathlib import Path
import json,hashlib,copy,shutil
D=Path(__file__).resolve().parent;P=D.parent.parent;V4=D.parent/'v4';REPO=Path.cwd()
def dump(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
t=copy.deepcopy(json.loads((V4/'timeline.json').read_text()))
heroes={
's01':'A company can fund a role.\nThat doesn’t prove its value.',
's04':'An organization can become\nbusy with its own work.',
's06':'Andy Jassy expected\na smaller corporate workforce.',
's07':'Fewer layers.\nLess bureaucracy.',
's08':'I see AI accelerating\nthe reassessment.',
's11':'What is worth building?',
's14':'Notice the need\nbefore it becomes a ticket.',
's18':'Go back.\nLet the work change your next idea.',
's21':'Write the question\nbefore building.',
's23':'A useful product still\nasks someone to change.',
's28':'Microsoft Digital:\nfaster people, not yet a faster team.',
's31':'Carry the whole task\nthrough verification.',
's32':'Make the result\ntrustworthy.',
's33':'A role can be given.\nJudgment has to be built.',
's35':'Understand more deeply\nwhat people need.'}
titles={'s03':'Organizations create internal work.','s05':'Amazon · 2024','s09':'Invest beyond the code.','s10':'Two ways to use cheaper code.','s12':'Learn who needs what.','s13':'Payroll is more than math.','s15':'A convincing demo is a start.','s19':'Try another approach.','s20':'Same task. Two approaches.','s22':'Choose what belongs.','s24':'Switching has a cost.','s26':'Ask for a real commitment.','s27':'Test the whole equation.','s30':'Follow through.','s34':'Build judgment through projects.','s36':'Start with the next project.'}
for s in t['scenes']:
 s['displayContext']=''
 if s['id'] in heroes:s.update(kind='statement',title=heroes[s['id']],nodes=[],sub='')
 elif s['id'] in titles:s['title']=titles[s['id']]
 if s['id']=='s06':s['displayContext']='AMAZON · 2025'
 if s['id']=='s07':s['displayContext']='AMAZON · 2026'
 if s['id']=='s09':s.update(kind='row',media=None,nodes=['Industry · Customers','Product · Value · Delivery'])
 if s['id']=='s10':s['nodes']=['Boris Cherny\nAI writes; he reviews','Simon Willison\nTry alternatives']
 if s['id']=='s13':s['nodes']=['Calculate the amount','Understand the obligations']
 if s['id']=='s20':s['nodes']=['Verify every item','Highlight exceptions']
 if s['id']=='s22':s['nodes']=['Build now','Leave for later','Understand the complexity']
 if s['id']=='s27':s['nodes']=['What will it cost?','What will customers change?']
 # Provenance remains in the audit package, not on the video frame.
 s['sub']=''
 if s['kind']=='chapter':s['nodes']=[]
dump(D/'timeline.json',t)
(REPO/'tiles/aaron-video-gen/remotion/src/projects/code-upstream/data-v5.ts').write_text('export const filmData = '+json.dumps(t,ensure_ascii=False,separators=(',',':'))+';\n')
lock={n:hashlib.sha256((P/n).read_bytes()).hexdigest() for n in ['youtube-script.md','video-v4.mp4','audio-v4.mp3','code-is-cheap-opportunity-moves-upstream.md','code-is-cheap-opportunity-moves-upstream-zh.md','video-captions-v4-en.srt']}
lock['video-production/v4/mix.wav']=hashlib.sha256((V4/'mix.wav').read_bytes()).hexdigest();dump(D/'source-lock.json',lock)
for name in ['fact-pack.json','word-timings.json','sound-plan.json']:shutil.copy2(V4/name,D/name)
plan=json.loads((V4/'director-plan.json').read_text());story=json.loads((V4/'video-storyboard.json').read_text());assets=json.loads((V4/'asset-plan.json').read_text())
plan['style_reference']['v5_departure']='Author rejected persistent agenda, competing titles, low contrast and provenance footer. Each page now has one primary message, max one content group, readable black type. Context is a short top label; chapter plates contain title only. Provenance kept off-screen in evidence files; necessary names remain in main text or context.'
plan['style_reference']['inherited_system']='Warm paper, dark ink, restrained ochre/green accents, protected subtitles, approved business illustrations and V4 audio/timing. Baseline rendered still and report re-inspected; full viewing not claimed.'
plan['style_reference']['rejected_legacy_pattern']='V4 permanent chapter agenda, duplicate headings and outcome sentence, footer provenance; competing panels and low-opacity reading text.'
plan['style_reference']['deliberate_deviation']=plan['style_reference']['v5_departure']
story['direction']['name']='One idea per frame'
story['direction']['visual_spine']='One primary message, short chapter context, high-contrast large type, generous spacing; optional illustration or a single bounded group.'
for i,s in enumerate(t['scenes']):
 b=plan['beats'][i];sb=story['scenes'][i];a=assets['beats'][i]
 visible=[s['title'],*s['nodes']]
 motion='connector-draw' if s['kind']=='flow' else 'focus-shift'
 if s['kind'] in ['cover','end']:motion='crossfade'
 cues=s['cues'];kind=s['kind']
 first=.25 if kind=='cover' else 0 if kind=='end' else (cues[1]-.65 if kind=='flow' and len(cues)>1 else cues[0] if kind=='compare' else cues[1] if kind=='row' and len(cues)>1 else 0 if kind=='row' else .15)
 b.update(entry_visual=s['title'],visual_reason='One primary message and at most one supporting visual group; narration carries detail.',camera_or_motion='Read-ready text; bounded underline focus only. No opacity loss, text masks, scaling or agenda animation.',transition_out='Clean cut on the locked narration clock; short chapter context stays anchored.',first_visual_change_sec=first)
 if s['kind']=='flow':b['camera_or_motion']='Stable readable labels; connector reaches next dot before the dot activates.'
 sb.update(title=s['title'],purpose=b['visual_reason'],entry_visual=s['title'],content=visible,first_change_sec=first,motion_recipes=[motion])
 if s['kind'] not in ['cover','end']:sb.update(template='minimal-editorial',prototype_required=True,fallback_template='editorial-statement')
 sb['beats']=[{'at_sec':0,'visual':s['title'],'action':'One readable message at entry; no competing navigation or footer.'},{'at_sec':first,'visual':s['title'],'action':'Bounded accent begins; text itself remains static and fully readable.'}]
 for j,n in enumerate(s['nodes']):sb['beats'].append({'at_sec':0 if j==0 else s['cues'][min(j,len(s['cues'])-1)],'visual':n,'action':'Concept is already readable; focus marker follows the narration.'})
 sb['beats'].sort(key=lambda beat:beat['at_sec'])
 a['copy']=' / '.join(visible)
 if s['id']=='s09':a.update(asset_type='generated-layout',asset_path=None,rights='owned')
 a['provenance_display']='Off-screen evidence manifest; no provenance footer in rendered video.'
dump(D/'director-plan.json',plan);dump(D/'video-storyboard.json',story);dump(D/'asset-plan.json',assets)
R=REPO/'tiles/aaron-video-gen/config/scene-registry.json';registry=json.loads(R.read_text())
if not any(x['id']=='minimal-editorial' for x in registry['templates']):
 registry['templates'].append({'id':'minimal-editorial','status':'prototype','description':'One primary message with a short chapter context; statement, image, unframed list, comparison or flow. No persistent agenda or provenance footer.','roles':['evidence','explanation','emphasis'],'intensities':['calm','structured'],'motion_recipes':['focus-shift','connector-draw'],'max_duration_sec':50,'max_content_items':5})
text=json.dumps(registry,ensure_ascii=False,indent=2)+'\n'
# Keep primitive registry lists compact, matching the existing file style.
import re
text=re.sub(r'\[\n\s*((?:"[^"\n]*"\s*,?\s*)+)\]',lambda m:json.dumps(json.loads(m[0]),ensure_ascii=False),text)
R.write_text(text)
(D/'author-feedback.md').write_text('Author rejected V4 visual density: persistent agenda, full chapter title plus headline, split content and repeated summary. Remove the Personal Judgment/provenance line throughout. Simplify the full film and enlarge readable type. Keep the accepted words/performance/illustration style.\n')
(D/'director-memo.md').write_text('V5: one idea per frame. Remove agenda, redundant header, outcome line and footer. Strong claims use a large single reading axis; useful comparisons get one headline and two equal phrases. Illustrations regain a full, bounded media zone. Chapter plates show only number/title. All speech and music are the exact V4 stream, with no timing change. Source boundaries remain in manifests and narration; names essential to meaning remain on-screen.\n')
(D/'video-treatment.md').write_text('''# V5 visual simplification

Selected by the author: preserve warm editorial style, remove text clutter, make the dominant point immediately readable. No new stylistic choice or generated assets required.

Reference: current author screenshot (V4) identifies the failure; accepted Ledger baseline supplies paper, space and captions; current illustrations retain the business setting. Rejected alternative: keeping a smaller agenda would preserve the competing hierarchy. Selected: single claim, or headline plus one body group; compact chapter label only. Chapter plates hold number/title in the existing gap.

Use 92px hero text, 72px scene headings, 52–58px group content, 34px captions. All content stays fully opaque. No persistent author chrome, metadata footer, result sentence, decorative boxes or text mask reveal. Small underlines indicate narrative focus. Use the same V4 audio without regeneration, remix or retiming.

Prototype: 176.13–261.53s, 85.4 seconds across customer/product chapters; additionally render the rejected opening, source-aware statement, longest comparison, flow and image at full and phone scales. Production starts after internal layout/motion QA, under author's delegated request to refine the whole film. Author taste and publishing approval remain pending.
''')
print('Prepared',len(t['scenes']),'scenes; audio/timing unchanged')
