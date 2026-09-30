"""Write director-plan.json, video-storyboard.json and asset-plan.json for the ai-bill package.

Reads scene-spec.json (written by build-data.py) so every plan shares the renderer's clock.
Run build-data.py first.
"""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[5]
BLOG = ROOT / 'src/content/blogs/2026-09-30-ai-bill'
# --out <dir> writes the plans somewhere else (e.g. a scratch dir for a planning-mode audit).
OUT = Path(sys.argv[sys.argv.index('--out') + 1]) if '--out' in sys.argv else BLOG
OUT.mkdir(parents=True, exist_ok=True)
spec = json.loads((HERE / 'scene-spec.json').read_text())
V2 = spec.get('version') in ('v2', 'v3')
V3 = spec.get('version') == 'v3'
LEAD = spec.get('lead_in', 0.0)
scenes = spec['scenes']
FILM_END = spec['film_end']
TITLE = 'OpenAI Halved My $200 Plan. So I Priced My Own AI Bill.'
SPINE = 'receipt-ledger-editorial-v1'

EVIDENCE = {
    's01-cold-open-3d': (['f-meter', 'f-cut', 'f-bill'], ['local-peaks', 'email', 'local-bill']),
    's18-reread-3d': (['f-17b'], ['local-bill']),
    's01-cover-hero': (['f-meter', 'f-cut'], ['local-peaks', 'email']),
    's02-the-email': (['f-cut'], ['email', 'tnw']),
    's03-priced-every-token': (['f-bill'], ['local-bill']),
    's04-plan-terms': (['f-cut', 'f-credits'], ['email', 'tnw']),
    's05-tibo-quote': (['f-tibo'], ['tibo-reopen']),
    's06-the-unit': (['f-tibo'], ['tibo-reopen']),
    's07-per-unit': (['f-per-unit'], ['email', 'tnw']),
    's08-flat-rate': (['f-pro500'], ['tnw']),
    's09-five-words': (['f-timing', 'f-hn'], ['x-horwitz', 'hn-reopen']),
    's10-other-side': (['f-miu'], ['x-miu']),
    's11-my-setup': (['f-setup'], ['aaron-account', 'local-bill']),
    's12-totals': (['f-bill'], ['local-bill']),
    's13-meter-exhibit': (['f-meter'], ['local-peaks']),
    's14-caveats': (['f-bill'], ['local-bill']),
    's15-which-meter': (['f-meter', 'f-cut'], ['local-peaks', 'email']),
    's16-line-items': (['f-prices', 'f-cache-share'], ['openai-pricing', 'local-bill']),
    's17-the-reveal': (['f-cache-share'], ['local-bill']),
    's18-the-loop': ([], []),
    's19-seventeen-billion': (['f-17b'], ['local-bill']),
    's20-astra-callback': (['f-astra-post'], ['astra-post']),
    's21-cache-price': (['f-prices'], ['openai-pricing', 'anthropic-pricing']),
    's22-verdict': (['f-bill'], ['local-bill']),
    's23-bill-exhibit': (['f-bill', 'f-cache-share'], ['local-bill']),
    's24-the-model': (['f-repricing'], ['local-bill']),
    's25-repricing': (['f-repricing'], ['local-bill', 'openai-pricing', 'anthropic-pricing']),
    's26-openai-bet': (['f-repricing'], ['local-bill']),
    's27-three-moves': (['f-decisions', 'f-credits'], ['aaron-account', 'email']),
    's28-guesses': (['f-forecast'], ['aaron-account']),
    's29-prepaid': (['f-forecast'], ['aaron-account']),
    's30-price-your-own': (['f-worked-example'], ['local-bill', 'anthropic-pricing']),
    's31-habits': (['f-decisions'], ['aaron-account']),
    's32-meter-callback': (['f-meter'], ['local-peaks']),
    's33-read-the-bill': ([], ['aaron-account']),
    's34-exchange-rate': (['f-tibo'], ['tibo-reopen']),
    's35-final': ([], []),
    's36-end-card': ([], []),
}

PROTOTYPE_TEMPLATES = {'ledger-3d-explainer'}
FALLBACK_2D = {'s01-cold-open-3d': 'image-sequence', 's18-reread-3d': 'system-map'}

MOTION_CONTRACTS = {
    ('s01-cold-open-3d', 'expensive'): dict(
        recipe='path-trace', purpose='emphasize', duration_sec=3.9, easing='ease-in', loop=False,
        translate_px=0, rotation_deg=0,
        continuity_anchor='The receipt stays in place on the desk; only the amber line item grows, right along the desk and out of frame (the article cover).',
        why_not_static='The line that keeps extending is the thesis: one item is bigger than the bill.'),
    ('s18-reread-3d', 'every'): dict(
        recipe='highlight-scan', purpose='explain', duration_sec=1.8, easing='linear', loop=False,
        translate_px=0, rotation_deg=0,
        continuity_anchor='The page stack stays fixed; the amber beam travels bottom to top at a constant pages-per-second rate, so a taller stack takes longer.',
        why_not_static='The cost is the repetition: each turn re-reads everything below it, and a growing sweep makes that visible.'),
    ('s17-the-reveal', 'amber'): dict(
        recipe='focus-shift', purpose='emphasize', duration_sec=1.4, easing='ease-in-out', loop=False,
        translate_px=0, rotation_deg=0,
        continuity_anchor='Same receipt, same CACHE READS row as s16; the bar echoes the amber line on the cover.',
        why_not_static='The reveal is the film\'s thesis: the one line that runs off the bill. Growth from the row to the frame edge carries that.'),
    ('s18-the-loop', 'arc'): dict(
        recipe='connector-draw', purpose='explain', duration_sec=1.4, easing='ease-in-out', loop=False,
        translate_px=0, rotation_deg=0,
        continuity_anchor='Five loop nodes stay fixed; only the amber return path draws, arrowhead at p >= 0.98.',
        why_not_static='The re-read is a return trip on every turn; drawing the path back to node 1 shows repetition, not a sixth step.'),
}


def transition_for(i, s):
    if s['id'] == 's16-line-items':
        return 'No cut: the same receipt carries into the reveal (continuity anchor).'
    if s['id'] == 's36-end-card':
        return 'Fades to porcelain 0.5s before the file ends.'
    nxt = scenes[i + 1]
    if nxt['kind'] in ('meter', 'billchart', 'repricing', 'metercallback', 'astra', 'final'):
        return 'Clean cut; the next exhibit crossfades up from porcelain (0.45s).'
    return 'Clean cut to porcelain; the next layout fades up over 8 frames (no double exposure).'


def first_change(s):
    offsets = sorted(v - s['start'] for v in s['cues'].values())
    first_cue = offsets[0] if offsets else 0.4
    if s['fade']:
        return round(min(0.3, first_cue), 2)
    return round(max(0.1, first_cue), 2)


MUSIC = V2  # v2 carries the original Eleven Music score, ducked under the voice


def MUSIC_CUE(s):
    if V3 and s['id'] == 's01-cold-open-3d':
        return f'score heard first: a lead-in from its own opening texture from 0.3 s, voice at {LEAD:.1f} s; the voice-aligned score then continues ~20 dB under the narration'
    if s['kind'] == 'end':
        return 'score resolves and fades to silence inside the file' if MUSIC else 'none; silent brand card'
    return 'original score bed, ducked ~20 dB under the narration' if MUSIC else 'none; locked narration only'


# ---------------------------------------------------------------- director plan
beats = []
for i, s in enumerate(scenes):
    mode = s['visual_mode']
    camera = {
        'cover': 'Full-bleed approved cover, 1.8% slow scale from frame zero; ledger row appends at 0.6s.',
        'receipt': 'Fixed receipt layout; rows gain ink, then the cache-read bar grows past the paper edge.',
        'loop': 'Connector-draw between fixed nodes; amber return arc draws last.',
        'coldopen3d': ('Lead-in (0-' + f'{LEAD:.1f}' + ' s, no voice): linear camera drift toward the meter and a pulsing printer idle light. Then: ' if V3 else '') + '3D (@remotion/three): slow camera on the weekly-meter bars filling to the 100% cap, a push to the printer as the receipt prints, then a wide settle as the amber line runs off the paper and out of frame; depth of field on the subject, restrained bloom.',
        'reread3d': '3D (@remotion/three): pages drop onto the stack on the spoken words; an amber scan beam sweeps the whole stack each turn; time-lapse as turns accelerate while the camera pulls back and up; depth of field on the stack, restrained bloom on the amber.',
        'end': 'Brand card fades up; no chrome, no captions.',
    }.get(s['kind'], 'Static exhibit plate with appending margin notes.' if s['kind'] in ('meter', 'billchart', 'repricing', 'metercallback') else
          'Framed still with appending serif lines.' if s['kind'] in ('astra', 'final') else
          'Ledger rows append on narration cues (opacity + 10px settle); strikes mark what is going away.')
    beats.append(dict(
        id=s['id'], start_sec=round(s['start'], 3), end_sec=round(s['end'], 3),
        narrative_role=s['narrative'], visual_mode=mode, intensity=s['intensity'],
        entry_mode='bridge' if s['id'] == 's17-the-reveal' else 'meaningful',
        entry_visual=s['entry'], first_visual_change_sec=first_change(s),
        visual_reason=s['reason'], camera_or_motion=camera, asset_id=s['id'],
        asset_provenance=s['provenance'], generated_video_sec=0,
        sound_cue=((('Score lead-in from 0.3 s (its own opening texture), voice from ' + f'{LEAD:.1f}' + ' s; then ' if (V3 and s['id'] == 's01-cold-open-3d') else '') + 'Locked narration (audio-paced-1.10.mp3) over the original score, ducked ~20 dB under the voice.' if MUSIC else 'Locked narration only (audio-retimed-1.05.mp3); no music bed.') if s['kind'] != 'end' else ('Score alone, fading to silence before the file ends.' if MUSIC else 'Silence after the final line; narration ended 1.15s before the card.')),
        transition_out=transition_for(i, s), fallback=s['fallback']))

director = dict(
    schema_version=1, title=TITLE, duration_sec=FILM_END,
    product_promise=('In eight and a half minutes:' if V2 else 'In nine minutes:') + ' what changed (the unit, not just the quota), one heavy user\'s 30-day AI coding bill priced at list, why cache reads dominate it, which plan wins for that workload, and how to price your own before October 29.',
    style_reference=dict(
        baseline_id='ledger-editorial-v1',
        reference_package='src/content/blogs/2026-08-19',
        reference_video='src/content/blogs/2026-08-19/video-v3.mp4',
        reference_qa='src/content/blogs/2026-08-19/video-qa-report.md',
        inherited_system='Cover-hero with title, promise and identity at frame zero; porcelain field; serif claims, sans explanation, monospace ledger rows that append and are never erased; AARON GUO header with an appending chapter marker; phrase captions in the protected lower band; functional calm motion (settle, focus-shift, connector-draw); the quiet brand end card with captions and chrome hidden.',
        rejected_legacy_pattern='Legacy SlideshowVideo renderer: blog charts full-frame behind narration, empty title cards, decorative motion, and chart-after-chart slide decks.',
        deliberate_deviation='The single accent changes from ledger cyan to receipt amber (#D2701C, matching the article charts) and means only one thing: cache reads / the re-read. The coral tension accent and the ink page are dropped; tension is carried by ink strikes and stamps. Chapter markers read LINE 00-11 (a receipt), not SEQ. Charts whose own highlight colour means something else (meter, repricing) are shown desaturated as graphite exhibits so amber keeps one meaning. Narration starts at frame zero over the cover-hero rather than after a separate 3s cover card, because the locked narration master must stay aligned to its word timeline.' + (' v2 adds two ledger-3d-explainer scenes (Aaron-requested after watching v1): the cold open and the re-read become @remotion/three scenes in the same palette, with depth of field, restrained bloom and conceptual labels; their v1 2D versions remain the fallback.' if V2 else '') + (f' v3 (Aaron, after watching v2) opens on a {LEAD:.1f} s musical lead-in: frame 0 is still the full cover-hero, the 3D desk drifts and the printer idles, the score is heard from 0.3 s and the first word lands at {LEAD:.1f} s; every narration-derived timing is shifted by the same amount.' if V3 else ''),
        review_status='reviewed'),
    visual_budget=dict(remotion_motion_target_ratio=0.75, evidence_or_still_target_ratio=0.2,
                       max_generated_video_ratio=0, max_generated_video_beats=0, max_semantic_sprite_beats=0),
    beats=beats)
(OUT / 'director-plan.json').write_text(json.dumps(director, ensure_ascii=False, indent=2) + '\n')

# ---------------------------------------------------------------- storyboard
story = []
for s in scenes:
    sb = [dict(at_sec=0, visual=s['entry'], action='hold')]
    for b in s['beats']:
        beat = dict(at_sec=round(b['at'] - s['start'], 2), visual=b['visual'], action=b['action'])
        for (sid, cue), contract in MOTION_CONTRACTS.items():
            if sid == s['id'] and abs(s['cues'][cue] - b['at']) < 1e-6:
                beat['motion'] = contract
        sb.append(beat)
    sb.sort(key=lambda x: x['at_sec'])
    story.append(dict(
        id=s['id'], title=s['title'], start_sec=round(s['start'], 3), end_sec=round(s['end'], 3),
        role=s['role'], template=s['template'], intensity=s['intensity'], purpose=s['reason'],
        entry_mode='bridge' if s['id'] == 's17-the-reveal' else 'meaningful', entry_visual=s['entry'],
        first_change_sec=first_change(s), motion_recipes=s['recipes'], content=s['content'], beats=sb,
        assets=[s['asset']] if s['asset'] else [],
        music_cue=MUSIC_CUE(s),
        fallback_template=FALLBACK_2D.get(s['id'], 'minimal-editorial' if s['template'] != 'minimal-editorial' else 'image-sequence')))
    if s['template'] in PROTOTYPE_TEMPLATES:
        # Promoted to available after Aaron approved the prototype (2026-09-30); keep the record.
        story[-1]['prototype_review'] = 'video-v2-prototype-3d-scored.mp4 approved by Aaron 2026-09-30'

board = dict(
    schema_version=1, title=TITLE, duration_sec=FILM_END, fps=30,
    direction=dict(
        name='Receipt Ledger Editorial (inherits ledger-editorial-v1)' + (' · v3: two 3D scenes and a 2.2 s lead-in' if V3 else ' · v2 with two 3D scenes' if V2 else ''), style_family_id=SPINE,
        visual_spine='Porcelain field (#F6F4EF, the article charts\' ground), graphite ink, serif claims, sans explanation, monospace receipt rows with dotted leaders that append and are never erased; one accent, receipt amber, reserved for cache reads / the re-read; tension by ink strike and stamp; charts appear only as framed exhibits with appending margin notes; the approved receipt cover bookends the film.',
        motion_density='restrained', music_strategy='continuous' if MUSIC else 'none', treatment='video-treatment.md',
        references=[
            dict(id='ledger-editorial-v1', url='src/content/blogs/2026-08-19/video-v3.mp4',
                 borrow='Append-only mono ledger rows, porcelain field, serif claims, header rail with appending chapter marker, phrase captions, one accent with one meaning, quiet brand end card.',
                 avoid='Cyan/coral palette, the ink punctuation page, generated metaphor stills, and its 44/3 cascade as a stock effect.'),
            dict(id='article-cover-receipt', url='src/content/blogs/2026-09-30-ai-bill/imgs/00-cover.png',
                 borrow='The amber line item that runs off the receipt: reused as the film\'s one signature motion at the cache-read reveal.',
                 avoid='Holding the cover full-frame behind narration beyond the opening and closing bookends.'),
            dict(id='school-fair-stall-process', url='tiles/aaron-video-gen/remotion/src/projects/school-fair-stall/index.tsx',
                 borrow='Project-scoped composition with a Python data builder that derives scenes and captions from locked word timings.',
                 avoid='Illustration-led field-note layouts; this film is typography- and evidence-led.'),
        ]),
    scenes=story)
(OUT / 'video-storyboard.json').write_text(json.dumps(board, ensure_ascii=False, indent=2) + '\n')

# ---------------------------------------------------------------- asset plan
asset_beats = []
for s in scenes:
    facts, sources = EVIDENCE[s['id']]
    kind = s['kind']
    if kind in ('cover', 'final', 'astra'):
        asset_type, rights = 'generated-still', 'generated'
    elif kind in ('meter', 'billchart', 'repricing', 'metercallback'):
        asset_type, rights = 'generated-layout', 'owned'
    else:
        asset_type, rights = 'generated-layout', 'owned'
    beat = dict(
        id=s['id'], start_sec=round(s['start'], 3), end_sec=round(s['end'], 3),
        copy=' / '.join(s['content'][:3]), visual_role=s['role'], asset_type=asset_type,
        fact_ids=facts, source_ids=sources, usage_role='primary', status='ready',
        provenance=s['provenance'] + ' Implemented in the project-scoped Remotion composition.',
        rights=rights, fallback=s['fallback'])
    if s['asset']:
        beat['asset_path'] = s['asset']
    asset_beats.append(beat)

asset_plan = dict(
    schema_version=1, title=TITLE, duration_sec=FILM_END, aspect_ratio='16:9', visual_spine_id=SPINE,
    asset_library=dict(
        queries=['calm editorial instrumental bed, patient, precise, no vocals, 9-10 minutes (music, approved+candidate)',
                 'editorial score bed piano cello (music, approved only)',
                 'calm (music, rights owned or licensed)'],
        selected_asset_ids=[]),
    beats=asset_beats)
(OUT / 'asset-plan.json').write_text(json.dumps(asset_plan, ensure_ascii=False, indent=2) + '\n')
print(f'director beats {len(beats)}, storyboard scenes {len(story)}, asset beats {len(asset_beats)}; film {FILM_END}s')
