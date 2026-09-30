"""Build the render data for the ai-subscription-cloud-bill film.

Single source of truth for scene boundaries, cue times, captions and chapters.
Every cue is resolved from the locked retimed word timeline, so the renderer,
storyboard and director plan all share the same clock.
"""
import json
import re
import sys
from pathlib import Path

# Usage: python3 build-data.py [--v1 | --v2] [--no-3d]
#   default  v3: v2 plus a 2.2 s musical lead-in before the first narration word
#   --v2     paced 1.10x narration (audio-paced-1.10.mp3) with the two 3D scenes, voice at 0.0 s
#   --no-3d  same timing with the 2D fallback scenes in place of the 3D cold open / re-read
#   --v1     the v1 master (audio-retimed-1.05.mp3), 2D only
V1 = '--v1' in sys.argv
V2 = '--v2' in sys.argv
V3 = not V1 and not V2
USE_3D = not V1 and '--no-3d' not in sys.argv
LEAD_IN = 2.2 if V3 else 0.0     # seconds of cover-hero + score before the first word

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[5]
BLOG = ROOT / 'src/content/blogs/2026-09-30-ai-bill'
TIMELINE_FILE = 'audio-timeline-retimed-1.05.json' if V1 else 'audio-timeline-paced-1.10.json'
AUDIO_FILE = 'narration.mp3' if V1 else 'narration-paced-1.10.mp3'
timeline = json.loads((BLOG / TIMELINE_FILE).read_text())['timeline']
# The narration (and everything derived from it) is shifted by LEAD_IN on the film clock.
WORDS = [dict(w, start=w['start'] + LEAD_IN, end=w['end'] + LEAD_IN) for w in timeline['wordTimings']]
SEGMENTS = [dict(sg, start=sg['start'] + LEAD_IN, end=sg['end'] + LEAD_IN) for sg in timeline['segments']]
NARRATION_END = min(timeline['duration'], timeline['wordTimings'][-1]['end']) + LEAD_IN
if V1:
    FINAL_HOLD_END = 559.0      # final line breathes ~1.15s before the end card
    FILM_END = FINAL_HOLD_END + 6.0
else:
    FINAL_HOLD_END = 505.0 + LEAD_IN   # final line breathes ~0.9s, then a 5s end card
    FILM_END = 510.0 + LEAD_IN         # the 510.0s score, aligned to the voice, ends with the film
FPS = 30


def norm(token: str) -> str:
    return re.sub(r'[^a-z0-9]', '', token.lower())


NORMED = [norm(w['word']) for w in WORDS]


def find(phrase: str, after: float = 0.0) -> int:
    """Index of the first word of `phrase` starting at or after `after` seconds."""
    target = [norm(x) for x in phrase.split() if norm(x)]
    for i in range(len(WORDS)):
        if WORDS[i]['start'] < after - 0.001:
            continue
        if NORMED[i:i + len(target)] == target:
            return i
    raise SystemExit(f'phrase not found after {after:.2f}s: {phrase!r}')


def t(phrase: str, after: float = 0.0) -> float:
    return round(WORDS[find(phrase, after)]['start'], 3)


def boundary(phrase: str, after: float = 0.0) -> float:
    """Cut point just before a phrase: inside the preceding pause, at most 0.3s early."""
    i = find(phrase, after)
    start = WORDS[i]['start']
    prev_end = WORDS[i - 1]['end'] if i > 0 else 0.0
    return round(max(prev_end + 0.02, start - 0.3), 3)


# ---------------------------------------------------------------- chapters
CHAPTER_LABELS = {
    'hook': 'THE METER',
    'slide-01': 'THE SENTENCE THAT MATTERS',
    'slide-02': 'TWENTY DOLLARS PER UNIT',
    'slide-03': 'FIVE WORDS',
    'slide-04': 'MY THIRTY-DAY BILL',
    'slide-05': 'THE RE-READ',
    'slide-06': 'THE PRICE THAT MATTERS',
    'slide-07': 'MODEL BEATS VENDOR',
    'slide-08': 'BEFORE OCTOBER 29',
    'slide-09': 'WHAT COMES NEXT',
    'slide-10': 'PRICE YOUR OWN BILL',
    'slide-11': 'A BILL I CAN FINALLY READ',
}
YT_TITLES = {
    'hook': 'The meter hit 100%',
    'slide-01': 'What actually changed',
    'slide-02': '$20 per unit: the bulk discount is gone',
    'slide-03': '"Five words": the reaction',
    'slide-04': 'My 30-day bill at API list price',
    'slide-05': 'The re-read: where the money goes',
    'slide-06': 'The price that matters: cache reads',
    'slide-07': 'Model beats vendor',
    'slide-08': 'What I\'m doing before Oct 29',
    'slide-09': 'What comes next',
    'slide-10': 'Price your own bill in four steps',
    'slide-11': 'A bill I can finally read',
}

# ---------------------------------------------------------------- scenes
# Each scene: id, kind, start phrase (cut point), chapter, planning metadata and cues.
# cues: (name, phrase-or-seconds, visual, action). Phrases resolve after the scene start.
S = []


def scene(id, kind, start, *, chapter, template, role, intensity, narrative, visual_mode,
          recipes, title, entry, reason, content, provenance, fallback, cues,
          asset=None, fade=True, header=True, captions=True):
    S.append(dict(id=id, kind=kind, start_spec=start, chapter=chapter, template=template, role=role,
                  intensity=intensity, narrative=narrative, visual_mode=visual_mode, recipes=recipes,
                  title=title, entry=entry, reason=reason, content=content, provenance=provenance,
                  fallback=fallback, cue_specs=cues, asset=asset, fade=fade, header=header,
                  captions=captions))


TYPE = 'Original typeset scene (Remotion), Aaron Studio.'
PERSONAL = 'Original typeset scene; numbers from the author\'s own session logs priced at API list (evidence/ai-bill-output-2026-09-30.txt).'

if USE_3D:
    scene('s01-cold-open-3d', 'coldopen3d', 0.0, chapter='hook', template='ledger-3d-explainer', role='emphasis',
          intensity='structured', narrative='hook', visual_mode='motion', recipes=['focus-shift', 'path-trace'],
          title='OpenAI Halved My $200 Plan. So I Priced My Own AI Bill.',
          entry='3D desk at frame zero: six graphite weekly-meter bars beside a thermal receipt printer, with the title, one-line promise and AARON GUO · AI-NATIVE BUILDER overlaid and legible.',
          reason='Cold open made physical: the meter caps out five times, the email halves the plan, then the bill prints and one amber line item runs off the paper across the frame (the cover, in 3D).',
          content=['OpenAI Halved My $200 Plan. So I Priced My Own AI Bill.', "One heavy user's 30-day AI coding bill, priced line by line at API list.", 'AARON GUO · AI-NATIVE BUILDER', 'Codex weekly meter: 99 / 59 / 99 / 99 / 100 / 100%', 'Conceptual · not to scale'],
          provenance='Original @remotion/three scene (Aaron Studio): meter bars use the Pro-account weekly peaks (claim C11); the printer and receipt are conceptual.',
          fallback='2D cover-hero, email and priced-every-token scenes (s01-s03 of v1, rendered with build-data.py --no-3d).',
          fade=False, header=False,
          cues=[('drift', 0.1, 'lead-in: slow camera drift, printer idle light pulsing, score enters; no voice yet', 'drift'),
            ('lead', max(LEAD_IN, 0.3), 'first narration word; drift hands over to the meter framing', 'hold'),
            ('meter', LEAD_IN + 0.6, 'weekly-meter bars begin filling toward the 100% cap line', 'fill'),
                ('hit', 'hit one hundred percent', 'fifth capped bar touches the cap; 5 OF 6 WEEKS label', 'reveal'),
                ('email', 'Then OpenAI emailed me', 'title block clears; email row settles; camera drifts toward the printer', 'reveal'),
                ('half', 'half as much', '20× struck to 10× on the email row', 'strike'),
                ('logs', 'So I opened my logs', 'printer starts feeding paper; grey line items print', 'print'),
                ('priced', 'priced every token', 'line items keep printing; focus on the receipt', 'print'),
                ('expensive', 'The expensive part', 'one amber line item prints and starts extending off the paper', 'overflow'),
                ('expected', "wasn't what I expected", 'amber line crosses the frame edge; camera settles wide', 'overflow')])
else:
    scene('s01-cover-hero', 'cover', 0.0, chapter='hook', template='image-sequence', role='emphasis',
          intensity='calm', narrative='hook', visual_mode='hybrid', recipes=['crossfade'],
          title='OpenAI Halved My $200 Plan. So I Priced My Own AI Bill.',
          entry='Approved receipt cover (amber line running off the paper) with title, one-line promise and AARON GUO · AI-NATIVE BUILDER visible at frame zero.',
          reason='The approved article cover carries the film identity and the thesis (one line bigger than the bill) before any explanation.',
          content=['OpenAI Halved My $200 Plan. So I Priced My Own AI Bill.', 'One heavy user\'s 30-day AI coding bill, priced line by line at API list.', 'AARON GUO · AI-NATIVE BUILDER'],
          provenance='Approved article cover imgs/00-cover.png (generated illustration, no text) with typeset title overlay.',
          fallback='Typeset title card on porcelain with a static amber rule.', asset='imgs/00-cover.png',
          fade=False, header=False,
          cues=[('meter', 0.6, 'SEP · CODEX WEEKLY METER · 100% ledger row settles above the amber line', 'reveal'),
                ('five', 'hit one hundred percent', '×5 stamp appends to the meter row', 'append')])
    
    scene('s02-the-email', 'email', 'Then OpenAI emailed me', chapter='hook', template='editorial-statement',
          role='explanation', intensity='structured', narrative='challenge', visual_mode='motion', recipes=['focus-shift'],
          title='The same $200 buys half as much.',
          entry='Mono row FROM OPENAI · EMAIL TO PRO SUBSCRIBERS · 2026-09-29 visible at cut.',
          reason='States the news in one line before any context; the struck 20× is the change.',
          content=['From Oct 30, the same $200 buys half as much.', '20× Plus → 10× Plus'],
          provenance=TYPE + ' Terms from the OpenAI subscriber email (claim C1).',
          fallback='Static statement card.',
          cues=[('email', 0.35, 'email source row settles', 'reveal'),
                ('headline', 'Starting October thirtieth', 'serif headline lands', 'reveal'),
                ('strike', 'half as much', '20× struck, 10× appended', 'strike')])
    
    scene('s03-priced-every-token', 'priced', 'So I opened my logs', chapter='hook', template='editorial-statement',
          role='emphasis', intensity='structured', narrative='hook', visual_mode='motion', recipes=['focus-shift'],
          title='I priced every token.',
          entry='Receipt slip scaffold with header 30 DAYS · EVERY TOKEN · API LIST PRICE visible at cut.',
          reason='Promise beat: the viewer sees the bill forming and one amber line held back as the question.',
          content=['I priced every token I used in 30 days.', 'The expensive part wasn\'t what I expected.'],
          provenance=TYPE, fallback='Static statement card with the unlabeled amber row.',
          cues=[('rows', 'opened my logs', 'session-log row appends', 'append'),
                ('priced', 'priced every token', 'priced-at-list row appends', 'append'),
                ('mystery', 'The expensive part', 'one unlabeled amber row appends; serif question lands', 'reveal')])

scene('s04-plan-terms', 'terms', "Here's what changed", chapter='slide-01', template='chapter-editorial',
      role='evidence', intensity='structured', narrative='evidence', visual_mode='motion', recipes=['focus-shift'],
      title="Here's what changed.",
      entry="Serif title Here's what changed. with the empty receipt table rule visible.",
      reason='The plan terms are the factual base of the film; ledger rows let each term land as it is spoken.',
      content=['PRO 200 · CODEX + CHATGPT WORK · 20× → 10× PLUS', 'PRICE · $200 / MONTH · UNCHANGED', 'EXISTING SUBSCRIBERS · OLD LIMITS THROUGH OCT 29', 'ONE-TIME CREDITS · WORTH $2,500 · EXPIRE DEC 31'],
      provenance=TYPE + ' Source: OpenAI email 2026-09-29 (C1, C2).', fallback='Static four-row ledger.',
      cues=[('r1', 'Pro 200 drops', 'allowance row appends at 20×', 'append'),
            ('r1b', 'to ten times', '20× struck, 10× appended', 'strike'),
            ('r2', 'Same price', 'price row appends', 'append'),
            ('r3', 'Existing subscribers', 'grace-period row appends', 'append'),
            ('r4', 'plus a one-time grant', 'credits row appends', 'append')])

scene('s05-tibo-quote', 'tibo', 'But the line I keep coming back', chapter='slide-01', template='minimal-editorial',
      role='evidence', intensity='calm', narrative='evidence', visual_mode='motion', recipes=['focus-shift'],
      title='“will net out at half the dollar in API spend”',
      entry='Attribution rows (TIBO · LEADS CODEX · POST ON X · 2026-09-28) visible at cut; quote space reserved.',
      reason='The sourced sentence that reframes the plan as API dollars; attributed exactly.',
      content=['the new plan “will net out at half the dollar in API spend.”', 'Tibo (Thibault Sottiaux), leads Codex · post on X · 2026-09-28'],
      provenance=TYPE + ' Exact quotation from Tibo\'s X post (claim C4).', fallback='Static quote card with attribution.',
      cues=[('attr', 'from Tibo', 'attribution row gains ink focus', 'focus'),
            ('quote', 'will net out', 'quotation settles', 'reveal'),
            ('echo', 'Half the dollar in API spend', 'API spend underlined', 'focus')])

scene('s06-the-unit', 'unit', "That's the unit now", chapter='slide-01', template='editorial-statement',
      role='emphasis', intensity='structured', narrative='framework', visual_mode='motion', recipes=['focus-shift'],
      title='The unit is now the API dollar.',
      entry='Serif statement The unit is now the API dollar. visible at cut.',
      reason='Names the frame the rest of the film prices in.',
      content=['The unit is now the API dollar.', 'Your subscription is a prepaid budget, measured in API dollars.'],
      provenance=TYPE, fallback='Static statement card.',
      cues=[('sub', 'Your subscription is a prepaid', 'explanation line settles', 'reveal')])

scene('s07-per-unit', 'perunit', 'Once you see the unit', chapter='slide-02', template='chapter-editorial',
      role='explanation', intensity='structured', narrative='framework', visual_mode='motion', recipes=['focus-shift'],
      title='Every tier: $20 per unit.',
      entry='Price-list table header (TIER · PRICE · × PLUS · PER 1×) and serif lead visible at cut.',
      reason='Native ledger makes the flat $20-per-1× rate and the lost $10 discount readable row by row.',
      content=['Plus · $20 · 1× · $20', 'Pro 100 · $100 · 5× · $20', 'Pro 200 from Oct 30 · $200 · 10× · $20', 'Pro 500 · $500 · 25× · $20', 'Pro 200 until Oct 29 · $200 · 20× · $10'],
      provenance=TYPE + ' Arithmetic from plan multipliers (C1, C5, C6).', fallback='Chart imgs/charts/01-price-per-unit.png as a static exhibit.',
      cues=[('r1', 'Plus is twenty', 'Plus row appends', 'append'),
            ('r2', 'Pro 100 is', 'Pro 100 row appends', 'append'),
            ('r3', 'The new Pro 200 is', 'new Pro 200 row appends', 'append'),
            ('r4', 'Pro 500 is twenty-five', 'Pro 500 row appends', 'append'),
            ('col', 'Every tier is', 'per-unit column bolds; EVERY TIER · $20 label', 'focus'),
            ('old', 'The old Pro 200 was', 'old Pro 200 row appends below the rule', 'append'),
            ('ten', 'Ten dollars a unit', '$10 cell boxed', 'focus'),
            ('gone', 'That was the bulk discount', 'old row struck: the discount going away', 'strike')])

scene('s08-flat-rate', 'flatrate', "Pro 500 doesn't bring it back", chapter='slide-02', template='editorial-statement',
      role='explanation', intensity='structured', narrative='explain', visual_mode='motion', recipes=['focus-shift'],
      title='A flat rate, with a premium for performance.',
      entry='PRO 500 · $500 · 25× · $20 PER 1× row visible at cut.',
      reason='Closes the pricing argument with the cloud-pricing analogy.',
      content=['PRO 500 · $500 · 25× PLUS · $20 PER 1×', 'A flat rate, with a premium for performance.', 'That\'s how cloud providers price.'],
      provenance=TYPE + ' Pro 500 terms per TNW (C5).', fallback='Static statement card.',
      cues=[('speed', 'It sells a higher ceiling', 'HIGHER CEILING · ULTRAFAST row appends', 'append'),
            ('flat', 'A flat rate', 'serif statement lands', 'reveal'),
            ('cloud', "That's how cloud providers", 'cloud line settles', 'reveal')])

scene('s09-five-words', 'fivewords', 'A lot of the reaction', chapter='slide-03', template='minimal-editorial',
      role='evidence', intensity='calm', narrative='evidence', visual_mode='motion', recipes=['focus-shift'],
      title='“Five words.”',
      entry='Serif lead The reaction was about delivery. with the Hacker News source row visible at cut.',
      reason='Stages the community reaction as an exact, attributed quotation.',
      content=['“Simply say ‘we\'re cutting limits in half.’ Five words.”', 'Hacker News commenter · 2026-09-28', 'Several replies: already moved to Claude Opus 5.5'],
      provenance=TYPE + ' Exact quotation from the Hacker News thread (C12).', fallback='Static quote card.',
      cues=[('timing', 'The cut went out', 'timing row appends', 'append'),
            ('quote', 'Simply say', 'quotation settles', 'reveal'),
            ('five', 'Five words', 'Five words. gains ink weight', 'focus'),
            ('moved', 'Several people said', 'switching row appends', 'append')])

scene('s10-other-side', 'otherside', 'The most-engaged post', chapter='slide-03', template='chapter-editorial',
      role='evidence', intensity='structured', narrative='challenge', visual_mode='motion', recipes=['focus-shift'],
      title='The other side, in API dollars.',
      entry="Label ONE X USER'S ESTIMATE · API VALUE PER MONTH with an empty three-row ledger visible at cut.",
      reason='Shows the contrarian math as a clearly labeled, unverified estimate; both sides now argue in API dollars.',
      content=["One X user's estimate · API value / month", 'Old Pro 200 ≈ $14k · New Pro 200 ≈ $7k · Claude Max ≈ $8k', "Unverified · methodology not shown"],
      provenance=TYPE + " Community estimate attributed to one X user (C13); labeled unverified.",
      fallback='Static three-row ledger with the unverified label.',
      cues=[('r1', 'fourteen thousand', 'old Pro 200 ≈ $14k row appends', 'append'),
            ('r2', 'the new one seven', 'new Pro 200 ≈ $7k row appends', 'append'),
            ('r3', 'Claude Max about eight', 'Claude Max ≈ $8k row appends', 'append'),
            ('barely', 'Barely a difference', "their verdict 'barely a difference' settles", 'reveal'),
            ('verify', "I can't verify that", 'UNVERIFIED stamp', 'stamp'),
            ('both', 'But notice both sides', 'serif line: both sides argue in API dollars', 'reveal'),
            ('mine', 'So I stopped reading', 'SO I PULLED MY OWN row appends', 'append')])

scene('s11-my-setup', 'setup', 'I pay two hundred a month', chapter='slide-04', template='chapter-editorial',
      role='explanation', intensity='structured', narrative='explain', visual_mode='motion', recipes=['focus-shift'],
      title='What I pay, and how I priced it.',
      entry='Receipt header MY SETUP · 30 DAYS with the first subscription row visible at cut.',
      reason='Establishes method and the honesty labels before any personal number appears.',
      content=['ChatGPT Pro $200 / mo · Claude Max $200 / mo', 'Session logs on disk · tokens per turn', '30 days · main machine · every token × API list price'],
      provenance=PERSONAL, fallback='Static setup ledger.',
      cues=[('r1', 0.2, 'ChatGPT Pro row', 'append'),
            ('r2', 'two hundred for Claude Max', 'Claude Max row appends', 'append'),
            ('r3', 'I use both every day', 'daily-use row appends', 'append'),
            ('r4', 'Both tools keep session logs', 'session-log row appends', 'append'),
            ('r5', 'I took thirty days', 'method row appends; honesty label', 'append')])

scene('s12-totals', 'totals', 'Claude Code: about nine', chapter='slide-04', template='minimal-editorial',
      role='evidence', intensity='structured', narrative='evidence', visual_mode='motion', recipes=['focus-shift'],
      title='≈ $9,400 vs ≈ $3,600',
      entry='CLAUDE CODE label and the ≈ $9,400 total settle within 0.4s of the cut; honesty label visible.',
      reason='The two totals are the film\'s first personal evidence; typeset large with the list-price label.',
      content=['Claude Code ≈ $9,400', 'Codex, Pro account ≈ $3,600', 'API list price, not what I paid · one machine'],
      provenance=PERSONAL + ' Claim C8.', fallback='Chart imgs/charts/03-bill-by-model.png.',
      cues=[('n1', 0.15, 'Claude Code ≈ $9,400 settles', 'reveal'),
            ('n2', 'Codex, on my Pro account', 'Codex ≈ $3,600 settles', 'reveal')])

scene('s13-meter-exhibit', 'meter', 'And Codex is the one', chapter='slide-04', template='image-sequence',
      role='evidence', intensity='calm', narrative='evidence', visual_mode='source-evidence', recipes=['crossfade'],
      title='My Codex weekly meter, September',
      entry='Weekly-meter chart exhibit (graphite) with source label visible after a 0.4s crossfade.',
      reason='Shows the ceiling being hit; the chart says it faster than rows.',
      content=['Exhibit · Codex weekly meter · Pro account', 'Five of six windows at 99–100%'],
      provenance='Chart rendered from the author\'s Codex session logs (charts/render_charts.py; claim C11). Shown desaturated so amber keeps one meaning.',
      fallback='Typeset six-row meter ledger.', asset='imgs/charts/02-codex-meter.png',
      cues=[('label', 0.5, 'exhibit label settles', 'reveal'),
            ('five', 'Five of six weekly', 'FIVE OF SIX AT 99–100% label appends', 'append')])

scene('s14-caveats', 'caveats', 'Two caveats', chapter='slide-04', template='editorial-statement',
      role='explanation', intensity='structured', narrative='challenge', visual_mode='motion', recipes=['focus-shift'],
      title='Two caveats.',
      entry='Serif Two caveats. with numbered rule visible at cut.',
      reason='Keeps the personal numbers honest in one breath.',
      content=['01 · API list price — what the work would have cost, not what I paid', '02 · One machine — so Codex is a floor', "One heavy user's receipt, not a benchmark."],
      provenance=TYPE, fallback='Static caveat card.',
      cues=[('c1', 'This is what the work', 'caveat 01 appends', 'append'),
            ('c2', "And it's one machine", 'caveat 02 appends', 'append'),
            ('receipt', "One heavy user's receipt", 'serif line lands', 'reveal')])

scene('s15-which-meter', 'whichmeter', 'Still, both plans', chapter='slide-04', template='editorial-statement',
      role='emphasis', intensity='structured', narrative='framework', visual_mode='motion', recipes=['focus-shift'],
      title='Which meter runs out first?',
      entry='BOTH PLANS · HEAVILY SUBSIDIZED row visible at cut.',
      reason='Turns the totals into the decision question that frames the verdict.',
      content=['Both plans are heavily subsidized.', 'The question is which meter runs out first.', "For me: Codex — the one getting cut in half."],
      provenance=TYPE, fallback='Static statement card.',
      cues=[('q', 'The question is which meter', 'serif question lands', 'reveal'),
            ('codex', 'For me it was Codex', 'answer row appends', 'append')])

scene('s16-line-items', 'receipt', 'Now the part that surprised', chapter='slide-05', template='chapter-editorial',
      role='explanation', intensity='structured', narrative='explain', visual_mode='motion', recipes=['focus-shift'],
      title='I split the bill by line item.',
      entry='Raised receipt with four line items (fresh input, cache writes, cache reads, output) visible at cut.',
      reason='Sets up the reveal: the viewer expects output to be the big line.',
      content=['Fresh input · Cache writes · Cache reads · Output', 'I expected output to be the big cost.', 'Astra output: $50 per 1M — a small slice.'],
      provenance=TYPE, fallback='Static four-line receipt.',
      cues=[('split', 'I split the bill', 'line items gain ink', 'focus'),
            ('expect', 'I expected output', 'OUTPUT row highlighted as the expected cost', 'focus'),
            ('astra', 'On Astra, output is', 'ASTRA OUTPUT · $50 / 1M note appends', 'append'),
            ('small', 'It was a small slice', 'output bar resolves small', 'reveal')])

scene('s17-the-reveal', 'receipt', 'The big number was cache reads', chapter='slide-05', template='system-map',
      role='explanation', intensity='structured' if USE_3D else 'signature', narrative='evidence', visual_mode='motion', recipes=['focus-shift'],
      title='The big number was cache reads.',
      entry='Same receipt continues without a cut; the CACHE READS row turns amber within 0.2s.',
      reason='Signature beat: the amber cache-read line overflows the receipt exactly like the cover, then the three shares append.',
      content=['Cache reads: the big number', 'GPT-6 Astra 78% · Claude Opus 5 76% · Claude Opus 5.5 58%', 'share of each model\'s list-price cost'],
      provenance=PERSONAL + ' Claim C9; Astra 78% on the Pro account.', fallback='Chart imgs/charts/03-bill-by-model.png.',
      fade=False,
      cues=[('amber', 0.2, 'CACHE READS row turns amber; bar overflows the paper to the frame edge', 'overflow'),
            ('astra', 'Seventy-eight percent', 'GPT-6 ASTRA · 78% appends', 'append'),
            ('opus5', 'Seventy-six percent', 'CLAUDE OPUS 5 · 76% appends', 'append'),
            ('opus55', 'Fifty-eight percent', 'CLAUDE OPUS 5.5 · 58% appends', 'append')])

if USE_3D:
    scene('s18-reread-3d', 'reread3d', "Here's why", chapter='slide-05', template='ledger-3d-explainer',
          role='explanation', intensity='signature', narrative='explain', visual_mode='motion', recipes=['focus-shift', 'highlight-scan'],
          title='The re-read: every turn scans the whole stack',
          entry='3D desk with the repo-context page stack in focus and the title An agent doesn\'t answer once. It runs a loop. overlaid at cut.',
          reason='Signature beat: the agent loop made physical. Each turn adds a thin page and an amber scan beam re-reads the entire stack bottom to top, so every sweep is longer; the time-lapse and the ≈17 billion figure make the volume physical.',
          content=['repo context · tool call · result · think · go again', 'every turn re-reads the whole stack (amber = cache reads)', 'turn counter and pages re-read so far (conceptual)', '≈ 17 billion tokens re-read from cache · Claude Code · 30 days', 'Conceptual · not to scale'],
          provenance='Original @remotion/three scene (Aaron Studio). Page counts and turn counter are conceptual; only the ≈17 billion figure is data (claim f-17b, one machine).',
          fallback='2D loop system-map and 17-billion statement (s18-s19 of v1, rendered with build-data.py --no-3d).',
          cues=[('loop', 'It runs a loop', 'loop label; stack scaffold sharpens', 'focus'),
                ('ctx', 'Load the repo context', 'REPO CONTEXT stack highlighted', 'focus'),
                ('tool', 'call a tool', 'thin TOOL CALL page drops on top', 'append'),
                ('result', 'read the result', 'thin RESULT page drops on top', 'append'),
                ('think', 'think', 'THINK label pulses beside the stack', 'focus'),
                ('again', 'go again', 'GO AGAIN label; turn counter reads 01', 'focus'),
                ('every', 'And every turn', 'first amber scan beam sweeps the whole stack bottom to top', 'scan'),
                ('cache', 'Caching makes each', 'turns 2-3: pages drop, each sweep a little longer; CACHED row', 'scan'),
                ('volume', 'But the volume is enormous', 'time-lapse: turns accelerate, stack grows, camera pulls back', 'scan'),
                ('thirty', 'In thirty days, my Claude Code', 'stack glows under continuous re-reads', 'scan'),
                ('num', 'seventeen billion', '≈ 17 billion resolves over the stack', 'reveal')])
else:
    scene('s18-the-loop', 'loop', "Here's why", chapter='slide-05', template='system-map',
          role='explanation', intensity='structured', narrative='explain', visual_mode='motion', recipes=['connector-draw', 'focus-shift'],
          title="An agent doesn't answer once. It runs a loop.",
          entry='Five muted loop nodes scaffolded with the title visible at cut.',
          reason='Explains why cache reads dominate: every turn re-reads the conversation.',
          content=['load repo context', 'call a tool', 'read the result', 'think', 'go again', 'every turn: re-read the conversation so far', 'cached re-reads are cheaper than fresh input', 'but the volume is enormous'],
          provenance=TYPE, fallback='Static five-node loop with the amber return arc drawn.',
          cues=[('title', "An agent doesn't answer", 'title gains ink', 'focus'),
                ('n1', 'Load the repo context', 'node 1 activates', 'activate'),
                ('n2', 'call a tool', 'connector draws, node 2 activates', 'draw'),
                ('n3', 'read the result', 'connector draws, node 3 activates', 'draw'),
                ('n4', 'think', 'connector draws, node 4 activates', 'draw'),
                ('n5', 'go again', 'connector draws, node 5 activates', 'draw'),
                ('arc', 'And every turn', 'amber return arc draws back to node 1', 'draw'),
                ('cache', 'Caching makes each', 'cached row appends', 'append'),
                ('volume', 'But the volume is enormous', 'volume row appends', 'append')])
    
    scene('s19-seventeen-billion', 'billion', 'In thirty days, my Claude Code', chapter='slide-05', template='editorial-statement',
          role='emphasis', intensity='structured', narrative='evidence', visual_mode='motion', recipes=['focus-shift'],
          title='≈ 17 billion tokens read from cache',
          entry='Label CLAUDE CODE · 30 DAYS · READ FROM CACHE visible at cut.',
          reason='One enormous number makes the re-read volume physical.',
          content=['≈ 17 billion tokens', 'read from cache · Claude Code · 30 days · one machine'],
          provenance=PERSONAL + ' Sum of cache-read tokens across Claude models (17.44B).', fallback='Static number card.',
          cues=[('num', 'seventeen billion', '≈ 17 billion lands in amber', 'reveal')])

scene('s20-astra-callback', 'astra', 'Three weeks ago I praised', chapter='slide-05', template='image-sequence',
      role='explanation', intensity='calm', narrative='resolve', visual_mode='generated-still', recipes=['crossfade'],
      title='Carrying the whole job means re-reading it.',
      entry='Framed cover of the earlier post (I Put GPT-6 Astra to Work, 2026-09-06) with its source label visible after a 0.4s crossfade.',
      reason='Image-rich reset and self-callback: the capability praised three weeks ago is what the bill is made of.',
      content=['From my post · I Put GPT-6 Astra to Work · 2026-09-06', 'Carrying the whole job means re-reading it, hundreds of times.', 'The capability I praised is exactly what the bill is made of.'],
      provenance="Aaron's own published article cover (generated illustration, 2026-09-06 package); shown as a labeled callback, not evidence.",
      fallback='Typeset callback card without the image.', asset='../2026-09-06-astra/imgs/00-cover-v3-launch-style.png',
      cues=[('label', 0.5, 'source label settles', 'reveal'),
            ('carry', 'Carrying the whole job', 'serif line lands with re-reading in amber', 'reveal'),
            ('praised', 'The capability I praised', 'second serif line lands', 'reveal')])

scene('s21-cache-price', 'price', 'So for agent work', chapter='slide-06', template='chapter-editorial',
      role='evidence', intensity='structured', narrative='evidence', visual_mode='motion', recipes=['focus-shift'],
      title='The price that matters is the cache-read price.',
      entry='Price table header (MODEL · INPUT · CACHE READ · OUTPUT, per 1M tokens) and serif lead visible at cut.',
      reason='Native price rows isolate the cache-read column; the 5× bracket lands on the spoken comparison.',
      content=['GPT-6 Astra · $10 · $1.00 · $50', 'Claude Opus 5 · $5 · $0.50 · $25', 'Claude Fable 5.1 · $10 · $0.25 · $50', 'Claude Opus 5.5 · $4 · $0.20 · $20', 'GPT-6.1 Sol · $2 · $0.10 · $10', 'Astra cache reads = 5× Opus 5.5'],
      provenance=TYPE + ' Official list prices retrieved 2026-09-30 (C7, C14).', fallback='Chart imgs/charts/04-cache-read-price.png as a static exhibit.',
      cues=[('col', "It's the cache-read price", 'cache-read column turns amber; input/output dim', 'focus'),
            ('r1', 'GPT-6 Astra: one dollar', 'Astra row appends', 'append'),
            ('r2', 'Claude Opus 5: fifty', 'Opus 5 row appends', 'append'),
            ('r3', 'Fable 5.1: twenty-five', 'Fable 5.1 row appends', 'append'),
            ('r4', 'Opus 5.5: twenty cents', 'Opus 5.5 row appends', 'append'),
            ('r5', 'GPT-6.1 Sol: ten cents', 'GPT-6.1 Sol row appends', 'append'),
            ('landed', "This is where September's", 'WHERE SEPTEMBER\'S PRICE CUTS LANDED label', 'reveal'),
            ('five', "On a workload that's three-quarters", '5× bracket draws between Astra and Opus 5.5', 'draw')])

scene('s22-verdict', 'verdict', 'So which plan is the better deal', chapter='slide-07', template='editorial-statement',
      role='emphasis', intensity='structured', narrative='resolve', visual_mode='motion', recipes=['focus-shift'],
      title='For my September workload: Claude Max.',
      entry='Serif question Which plan is the better deal? visible at cut.',
      reason='States the verdict plainly before the evidence exhibit.',
      content=['Which plan is the better deal?', 'For my September workload: Claude Max.', 'By more than I expected.'],
      provenance=TYPE, fallback='Static statement card.',
      cues=[('answer', 'For my September workload', 'answer lands', 'reveal'),
            ('more', 'by more than I expected', 'qualifier settles', 'reveal')])

scene('s23-bill-exhibit', 'billchart', 'Same two hundred dollars', chapter='slide-07', template='image-sequence',
      role='evidence', intensity='calm', narrative='evidence', visual_mode='source-evidence', recipes=['crossfade'],
      title='30 days of AI coding, priced at API list',
      entry='Bill-by-model chart exhibit (amber = cache reads) visible after a 0.4s crossfade.',
      reason='The full bill as evidence: both totals and the amber cache-read share of every big bar.',
      content=['Exhibit · 30 days at API list · by model', 'Same $200 each · ≈ $9,400 vs ≈ $3,600 of work'],
      provenance='Chart rendered from the author\'s session logs and official list prices (charts/render_charts.py; C8, C9).',
      fallback='Typeset totals card.', asset='imgs/charts/03-bill-by-model.png',
      cues=[('label', 0.5, 'exhibit label settles', 'reveal'),
            ('capped', 'before the meter capped out', 'BEFORE THE METER CAPPED OUT label appends', 'append')])

scene('s24-the-model', 'lever', "But here's the bigger lever", chapter='slide-07', template='editorial-statement',
      role='emphasis', intensity='structured', narrative='framework', visual_mode='motion', recipes=['focus-shift'],
      title='It wasn\'t the vendor. It was the model.',
      entry='Label THE BIGGER LEVER IN MY LOGS visible at cut.',
      reason='A short pivot that sets up the repricing exhibit.',
      content=['The bigger lever in my logs', "It wasn't the vendor.", 'It was the model.'],
      provenance=TYPE, fallback='Static statement card.',
      cues=[('vendor', "It wasn't the vendor", 'first line lands', 'reveal'),
            ('model', 'It was the model', 'second line lands', 'reveal')])

scene('s25-repricing', 'repricing', 'Take the exact tokens', chapter='slide-07', template='image-sequence',
      role='evidence', intensity='calm', narrative='evidence', visual_mode='source-evidence', recipes=['crossfade'],
      title='Picking the model moved my bill more than picking the vendor',
      entry='Model-vs-vendor chart exhibit (graphite) with source label visible after a 0.4s crossfade.',
      reason='Two before/after pairs on one scale prove the model lever.',
      content=['Exhibit · same tokens, repriced', 'Astra tokens at GPT-6.1 Sol ≈ 12% · Opus 5 at Opus 5.5 ≈ half', 'Price only — quality not compared'],
      provenance='Chart rendered from the author\'s session logs and official list prices (C10). Shown desaturated so amber keeps one meaning.',
      fallback='Typeset repricing rows.', asset='imgs/charts/05-model-vs-vendor.png',
      cues=[('label', 0.5, 'exhibit label settles', 'reveal'),
            ('twelve', 'Twelve percent', '≈ 12% label appends', 'append'),
            ('half', 'Inside Claude', 'OPUS 5 → OPUS 5.5 ≈ HALF label appends', 'append')])

scene('s26-openai-bet', 'bet', "That's OpenAI's bet", chapter='slide-07', template='editorial-statement',
      role='explanation', intensity='structured', narrative='challenge', visual_mode='motion', recipes=['focus-shift'],
      title="That's OpenAI's bet with this plan.",
      entry="Label OPENAI'S BET and serif lead visible at cut.",
      reason='Names the bet and marks the Sol quality question as untested.',
      content=["Move the work to the cheaper model, and the halved allowance covers the same work.", 'Can Sol do the work I\'ve been giving Astra?', 'Untested · a hypothesis'],
      provenance=TYPE, fallback='Static statement card.',
      cues=[('move', 'Move the work', 'serif statement lands', 'reveal'),
            ('q', 'Can Sol do the work', 'question row appends', 'append'),
            ('untested', "I don't know yet", 'UNTESTED stamp', 'stamp')])

scene('s27-three-moves', 'moves', "So here's what I'm actually doing", chapter='slide-08', template='chapter-editorial',
      role='explanation', intensity='structured', narrative='resolve', visual_mode='motion', recipes=['focus-shift'],
      title="What I'm doing before October 29",
      entry='Serif title and three empty numbered slots (01 02 03) visible at cut.',
      reason='The three decisions as a checklist the viewer can copy.',
      content=['01 Claude Max stays my main tool', '02 Keep Pro 200 through Dec 31 to use the credits · not buying Pro 500', '03 October: a week of Codex on GPT-6.1 Sol, watching the meter'],
      provenance=TYPE, fallback='Static three-row checklist.',
      cues=[('m1', 'Claude Max stays', 'move 01 fills', 'append'),
            ('m2', 'I keep Pro 200 through', 'move 02 fills', 'append'),
            ('m2b', "I'm not buying Pro 500", 'NOT BUYING PRO 500 sub-row appends', 'append'),
            ('m2c', 'Same unit price', 'same-unit-price reason appends to the sub-row', 'append'),
            ('m3', 'In October, I run Codex', 'move 03 fills', 'append'),
            ('m3b', 'If Sol carries most', 'IF SOL CARRIES IT, 10× MAY BE ENOUGH sub-row appends', 'append')])

scene('s28-guesses', 'guesses', 'Now, my guesses', chapter='slide-09', template='chapter-editorial',
      role='explanation', intensity='structured', narrative='framework', visual_mode='motion', recipes=['focus-shift'],
      title='What comes next',
      entry='Serif title What comes next with three empty numbered slots visible at cut.',
      reason='Forecasts typeset as clearly labeled inferences.',
      content=["My inferences, not anything either company has said", '01 The 20× language fades; the dollar budget becomes visible', '02 The price war moves to what agents consume: cheaper cache reads, a premium for speed', '03 Heavy-user subsidies keep shrinking'],
      provenance=TYPE + ' Labeled forecast (C15).', fallback='Static three-row list.',
      cues=[('label', 'These are my inferences', 'INFERENCES label settles', 'reveal'),
            ('g1', 'First, the', 'guess 01 fills', 'append'),
            ('g1b', 'OpenAI has already done', 'conversion sub-row appends', 'append'),
            ('g2', 'Second, the price war', 'guess 02 fills', 'append'),
            ('g2a', 'Cheaper cache reads', 'cheaper cache reads in amber', 'focus'),
            ('g2b', 'A premium for speed', 'premium-for-speed chip appends', 'append'),
            ('g3', 'Third, heavy-user', 'guess 03 fills', 'append'),
            ('g3b', 'A company that publishes', 'exchange-rate dial sub-row appends', 'append')])

scene('s29-prepaid', 'prepaid', 'Plan as if your subscription', chapter='slide-09', template='editorial-statement',
      role='emphasis', intensity='structured', narrative='resolve', visual_mode='motion', recipes=['focus-shift'],
      title='A prepaid API budget, not an unlimited pass.',
      entry='Serif line Plan as if your subscription is a prepaid API budget visible at cut.',
      reason='The practical rule of the forecast chapter.',
      content=['Plan as if your subscription is a prepaid API budget,', 'not an unlimited pass.'],
      provenance=TYPE, fallback='Static statement card.',
      cues=[('pass', 'not an unlimited pass', 'second line lands', 'reveal')])

scene('s30-price-your-own', 'steps', 'If you want to do this yourself', chapter='slide-10', template='chapter-editorial',
      role='explanation', intensity='structured', narrative='framework', visual_mode='motion', recipes=['focus-shift'],
      title='Price your own bill in four steps',
      entry='Serif title and four numbered step slots visible at cut.',
      reason='Adds the walkthrough the article only gestures at, including one worked multiplication.',
      content=['01 Find the logs', '02 Pull four numbers per model', '03 Multiply by list price', '04 Find your biggest line'],
      provenance=TYPE + ' Worked example from the author\'s Opus 5 cache reads (9.96B tokens × $0.50 / 1M).',
      fallback='Static four-step list.',
      cues=[('s1', 'Find the logs', 'step 01 fills', 'append'),
            ('codex', 'Codex keeps session files', 'CODEX: SESSION FILES sub-row', 'append'),
            ('claude', 'Claude Code keeps them', 'CLAUDE CODE: PROJECT LOGS sub-row', 'append'),
            ('s1b', 'Both record tokens per turn', 'TOKENS PER TURN sub-row', 'append'),
            ('s2', 'Pull four numbers', 'step 02 fills', 'append'),
            ('chips', 'Fresh input, cache writes', 'four number chips; cache reads amber', 'append'),
            ('s3', 'Multiply each', 'step 03 fills with the worked example', 'append'),
            ('s4', 'Then find your biggest line', 'step 04 fills', 'append'),
            ('mine', 'For me, it was the re-read', 'FOR ME: THE RE-READ in amber', 'focus')])

scene('s31-habits', 'habits', 'Then three habits', chapter='slide-10', template='chapter-editorial',
      role='explanation', intensity='structured', narrative='resolve', visual_mode='motion', recipes=['focus-shift'],
      title='Then three habits',
      entry='Serif title Then three habits with three empty slots visible at cut.',
      reason='Turns the bill into working habits.',
      content=['Route by task, not loyalty', 'Treat context as a cost', 'Stay portable'],
      provenance=TYPE, fallback='Static three-row list.',
      cues=[('h1', 'Route by task', 'habit 01 fills', 'append'),
            ('h2', 'Treat context as a cost', 'habit 02 fills', 'append'),
            ('h2b', 'because long sessions', 'stale-context sub-row appends', 'append'),
            ('h3', 'And stay portable', 'habit 03 fills', 'append'),
            ('h3b', 'My workflows run in both', 'pricing-decision sub-row appends', 'append')])

scene('s32-meter-callback', 'metercallback', 'That meter hit one hundred', chapter='slide-11', template='image-sequence',
      role='emphasis', intensity='calm', narrative='resolve', visual_mode='source-evidence', recipes=['crossfade'],
      title='What was 100% worth?',
      entry='The weekly-meter exhibit returns (graphite) after a 0.4s crossfade.',
      reason='Returns to the cold open: the meter that capped out, now with a known unit.',
      content=['Five times at 100%', 'What was 100% worth?'],
      provenance='Same chart as the earlier meter exhibit (C11).', fallback='Typeset meter ledger.',
      asset='imgs/charts/02-codex-meter.png',
      cues=[('label', 0.5, 'FIVE TIMES AT 100% label settles', 'reveal'),
            ('worth', 'I never asked what', 'WHAT WAS 100% WORTH? label appends', 'append')])

scene('s33-read-the-bill', 'readbill', 'Now I know the unit', chapter='slide-11', template='editorial-statement',
      role='emphasis', intensity='structured', narrative='resolve', visual_mode='motion', recipes=['focus-shift'],
      title="Now I know the unit. I've read the bill.",
      entry="Serif Now I know the unit. visible at cut.",
      reason='The emotional turn: clarity after irritation.',
      content=["Now I know the unit. I've read the bill.", "I'm not angry about the change.", 'The timing was clumsy.'],
      provenance=TYPE, fallback='Static statement card.',
      cues=[('read', "and I've read the bill", 'second clause lands', 'reveal'),
            ('angry', "I'm not angry", 'not-angry line settles', 'reveal'),
            ('clumsy', 'The timing was clumsy', 'timing line settles', 'append'),
            ('worse', 'was a worse sentence', 'plain-words line settles', 'append')])

scene('s34-exchange-rate', 'exchange', 'But a subscription with a published', chapter='slide-11', template='editorial-statement',
      role='emphasis', intensity='structured', narrative='resolve', visual_mode='motion', recipes=['focus-shift'],
      title='A published exchange rate is more honest than a magic multiple.',
      entry='Serif line A subscription with a published exchange rate visible at cut.',
      reason='The judgment the film lands on.',
      content=['A subscription with a published exchange rate', 'is more honest than a magic multiple.'],
      provenance=TYPE, fallback='Static statement card.',
      cues=[('honest', 'is more honest', 'second line lands', 'reveal')])

scene('s35-final', 'final', 'Engineers learned to read', chapter='slide-11', template='image-sequence',
      role='emphasis', intensity='calm', narrative='resolve', visual_mode='hybrid', recipes=['crossfade'],
      title='Reading yours is now part of the job.',
      entry='The approved receipt cover returns with the first closing line visible after a 0.4s crossfade.',
      reason='Bookend: the bill image returns while the final three sentences land verbatim; captions and chrome step back.',
      content=['Engineers learned to read cloud bills because the bill decided what they could build.', 'AI coding bills are becoming that same kind of document.', 'Reading yours is now part of the job.'],
      provenance='Approved article cover imgs/00-cover.png with typeset lines (verbatim narration).',
      fallback='Typeset closing lines on porcelain.', asset='imgs/00-cover.png',
      header=False, captions=False,
      cues=[('l1', 0.3, 'first closing line settles', 'reveal'),
            ('l2', 'AI coding bills are becoming', 'second line lands; first dims', 'reveal'),
            ('l3', 'Reading yours is now', 'final line lands', 'reveal')])

scene('s36-end-card', 'end', FINAL_HOLD_END, chapter='slide-11', template='brand-end-card',
      role='emphasis', intensity='calm', narrative='resolve', visual_mode='motion', recipes=['crossfade'],
      title='AARON GUO',
      entry='Soft-mark logo, AARON GUO and AI-NATIVE BUILDER · HUMAN-FIRST THINKER fade up on porcelain.',
      reason='Quiet brand close after the argument resolves; no captions or chapter chrome.',
      content=['AARON GUO', 'AI-NATIVE BUILDER · HUMAN-FIRST THINKER', 'aaronguo.com'],
      provenance='Aaron brand end card (assets/aaron-logo-assets/ag-logo.png).', fallback='Static brand card.',
      asset=None, fade=False, header=False, captions=False,
      cues=[('mark', 0.0, 'soft-mark and name fade up', 'reveal'),
            ('line', 0.7, 'identity line settles', 'reveal')])

# ---------------------------------------------------------------- resolve times
prev_start = -1.0
for i, s in enumerate(S):
    spec = s['start_spec']
    if isinstance(spec, (int, float)):
        start = float(spec)
    else:
        start = boundary(spec, after=max(0.0, prev_start))
    s['start'] = start
    prev_start = start
for i, s in enumerate(S):
    s['end'] = S[i + 1]['start'] if i + 1 < len(S) else FILM_END
for s in S:
    cues = {}
    beats = []
    for name, spec, visual, action in s['cue_specs']:
        at = s['start'] + spec if isinstance(spec, (int, float)) else t(spec, after=s['start'])
        if not (s['start'] - 0.001 <= at < s['end']):
            raise SystemExit(f"cue {s['id']}.{name} at {at:.2f} outside {s['start']:.2f}-{s['end']:.2f}")
        cues[name] = round(at, 3)
        beats.append(dict(at=round(at, 3), visual=visual, action=action))
    s['cues'] = cues
    s['beats'] = beats

# ---------------------------------------------------------------- captions
no_caption = [(s['start'], s['end']) for s in S if not s['captions']]
SENTENCE_END = re.compile(r'[.?!]["”\']?$')
sentences, cur = [], []
for w in WORDS:
    cur.append(w)
    if SENTENCE_END.search(w['word']) and not re.search(r"half\.'$", w['word']):
        sentences.append(cur)
        cur = []
if cur:
    sentences.append(cur)

chunks = []
for sent in sentences:
    parts, group = [], []
    for w in sent:
        if group and (len(group) >= 7 or w['end'] - group[0]['start'] > 3.1):
            parts.append(group)
            group = []
        group.append(w)
        if w['word'].endswith((',', ':', ';')) and len(group) >= 4:
            parts.append(group)
            group = []
    if group:
        parts.append(group)
    # never leave a one- or two-word orphan: merge into the previous chunk of the same sentence
    if len(parts) > 1 and len(parts[-1]) <= 2 and len(parts[-2]) + len(parts[-1]) <= 9:
        tail = parts.pop()
        parts[-1] = parts[-1] + tail
    chunks.extend(parts)

captions = [{'start': round(g[0]['start'], 3), 'end': round(g[-1]['end'], 3),
             'text': ' '.join(x['word'] for x in g)} for g in chunks]
captions = [c for c in captions if not any(a <= c['start'] < b for a, b in no_caption)]

# ---------------------------------------------------------------- chapters
chapters = []
for seg in SEGMENTS:
    first = next(s for s in S if s['chapter'] == seg['id'])
    at = 0.0 if seg['id'] == 'hook' else first['start']
    n = 0 if seg['id'] == 'hook' else int(seg['id'].split('-')[1])
    chapters.append({'id': seg['id'], 'at': round(at, 3), 'seq': f'LINE {n:02d}',
                     'label': CHAPTER_LABELS[seg['id']], 'youtube': YT_TITLES[seg['id']]})

render_scenes = [{k: s[k] for k in ('id', 'kind', 'start', 'end', 'fade', 'header', 'captions', 'cues')} for s in S]
output = {'fps': FPS, 'audio': AUDIO_FILE, 'audioOffset': LEAD_IN, 'narrationEnd': round(NARRATION_END, 3), 'finalHoldEnd': FINAL_HOLD_END,
          'filmEnd': FILM_END, 'chapters': [{k: c[k] for k in ('at', 'seq', 'label')} for c in chapters],
          'captions': captions, 'scenes': render_scenes}
HEADER = '''// Generated by build-data.py — do not edit by hand.
export type Cues = Record<string, number>;
export interface SceneData { id: string; kind: string; start: number; end: number; fade: boolean; header: boolean; captions: boolean; cues: Cues }
export interface FilmData {
  fps: number; audio: string; audioOffset: number; narrationEnd: number; finalHoldEnd: number; filmEnd: number;
  chapters: { at: number; seq: string; label: string }[];
  captions: { start: number; end: number; text: string }[];
  scenes: SceneData[];
}
export const data: FilmData = '''
(HERE / 'data.ts').write_text(HEADER + json.dumps(output, ensure_ascii=False, indent=1) + ';\n')
spec = {'version': 'v1' if V1 else ('v2' if V2 else 'v3'), 'lead_in': LEAD_IN, 'use_3d': USE_3D, 'timeline': TIMELINE_FILE, 'narration_end': NARRATION_END, 'film_end': FILM_END, 'chapters': chapters,
        'scenes': [{k: v for k, v in s.items() if k not in ('cue_specs', 'start_spec')} for s in S]}
(HERE / 'scene-spec.json').write_text(json.dumps(spec, ensure_ascii=False, indent=1) + '\n')
print(f'{len(captions)} captions, {len(S)} scenes, film {FILM_END:.2f}s')
for s in S:
    print(f"{s['start']:8.2f} {s['end'] - s['start']:6.2f}s {s['id']:24s} {s['template']:20s} {s['intensity']}")
