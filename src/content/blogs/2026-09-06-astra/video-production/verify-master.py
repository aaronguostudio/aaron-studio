"""Verify the delivered encode and create an auditable scene contact sheet.

Technical measurements do not stand in for a human listening/full-playback review.
"""
from pathlib import Path
import hashlib
import json
import math
import subprocess
import numpy as np
from PIL import Image, ImageDraw

P = Path(__file__).resolve().parents[1]
OUT = P / 'video-production'
timeline = json.loads((OUT / 'timeline.json').read_text())
scenes = timeline['scenes']
video = P / 'video.mp4'

def run(args):
    result = subprocess.run(args, capture_output=True)
    if result.returncode:
        raise RuntimeError(result.stderr.decode(errors='replace')[-5000:])
    return result.stdout

def probe(path):
    return json.loads(run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)]))

metadata = probe(video)
vs = next(s for s in metadata['streams'] if s['codec_type'] == 'video')
aus = next(s for s in metadata['streams'] if s['codec_type'] == 'audio')
assert (vs['width'], vs['height'], vs['r_frame_rate']) == (1920, 1080, '30/1')
assert int(vs['nb_frames']) == round(timeline['duration'] * 30)
assert abs(float(metadata['format']['duration']) - timeline['duration']) < .1
assert all(abs(a['end'] - b['start']) < .001 for a, b in zip(scenes, scenes[1:]))
manifest = json.loads((P / 'audio-generation-manifest.json').read_text())
assert ' '.join(x['text'] for x in timeline['captions']) == ' '.join(x['word'] for x in manifest['timeline']['wordTimings'])
assert all(c['start'] >= 3 and c['end'] <= scenes[-1]['start'] for c in timeline['captions'])

# Three encoded frames per scene: entry, middle and last visible frame.
samples = []
for scene in scenes:
    a, b = round(scene['start'] * 30), round(scene['end'] * 30)
    for role, f in [('entry', a), ('middle', (a + b) // 2), ('exit', b - 1)]:
        samples.append({'scene': scene['id'], 'role': role, 'frame': f, 'seconds': f / 30, 'title': scene['title']})
frames = OUT / 'frames'
frames.mkdir(exist_ok=True)
def balanced(items):
    if len(items) == 1:
        return items[0]
    mid = len(items) // 2
    return '(' + balanced(items[:mid]) + '+' + balanced(items[mid:]) + ')'
expression = balanced(['eq(n,%d)' % s['frame'] for s in samples])
run(['ffmpeg', '-v', 'error', '-y', '-i', str(video), '-vf', "select='" + expression + "',scale=960:-1", '-fps_mode', 'vfr', '-q:v', '3', str(frames / '%03d.jpg')])
for idx, sample in enumerate(samples, 1):
    sample['image'] = 'frames/%03d.jpg' % idx
    assert (OUT / sample['image']).exists()
(OUT / 'frame-index.json').write_text(json.dumps(samples, indent=2))

# Each sheet shows entry/middle/exit across, one scene per row.
for page in range(math.ceil(len(scenes) / 8)):
    selection = samples[page * 24:(page + 1) * 24]
    rows = math.ceil(len(selection) / 3)
    sheet = Image.new('RGB', (1920, rows * 392), '#e2dfd7')
    draw = ImageDraw.Draw(sheet)
    for idx, sample in enumerate(selection):
        x, y = (idx % 3) * 640, (idx // 3) * 392
        pic = Image.open(OUT / sample['image']).resize((640, 360))
        sheet.paste(pic, (x, y))
        label = '%s | %s | %.2fs' % (sample['scene'], sample['role'], sample['seconds'])
        draw.text((x + 12, y + 367), label, fill='#242b2b')
    sheet.save(OUT / ('contact-%02d.jpg' % (page + 1)), quality=90)

def pcm(path):
    return np.frombuffer(run(['ffmpeg', '-v', 'error', '-i', str(path), '-ar', '48000', '-ac', '2', '-f', 'f32le', '-']), dtype='<f4').reshape(-1, 2)

decoded = pcm(video)
voice = pcm(OUT / 'voice-stem.wav')
music = pcm(OUT / 'music-stem.wav')
length = min(len(decoded), len(voice), len(music))
decoded, voice, music = decoded[:length], voice[:length], music[:length]
# Fit the AAC signal against the actual stems, including scored and quiet windows.
fits = []
for start in [8, 60, 120, 155, 220, 272, 340, 398, 455, 470]:
    a, b = int(start * 48000), int((start + 2) * 48000)
    y = decoded[a:b].reshape(-1).astype(np.float64)
    v = voice[a:b].reshape(-1).astype(np.float64)
    m = music[a:b].reshape(-1).astype(np.float64)
    has_music = np.max(np.abs(m)) > .00001
    X = np.column_stack([v, m]) if has_music else v[:, None]
    gain = np.linalg.lstsq(X, y, rcond=None)[0]
    fits.append({'start_seconds': start, 'voice_gain_after_aac': float(gain[0]), 'music_gain_after_aac': float(gain[1]) if has_music else None})
    assert .97 < gain[0] < 1.03, (start, gain)
last_peak = float(np.max(np.abs(decoded[-48000:])))
assert last_peak < .0001, last_peak
report = {
    'technical_status': 'pass', 'video_sha256': hashlib.sha256(video.read_bytes()).hexdigest(),
    'duration_seconds': float(metadata['format']['duration']), 'video_frames': int(vs['nb_frames']),
    'resolution': [1920, 1080], 'fps': 30, 'audio_codec': aus['codec_name'],
    'audio_channels': aus['channels'], 'audio_sample_rate': int(aus['sample_rate']),
    'scene_coverage_contiguous': True, 'exact_caption_word_sequence': True,
    'caption_count': len(timeline['captions']), 'scene_count': len(scenes),
    'encoded_frame_samples': len(samples), 'aac_voice_gain_windows': fits,
    'final_second_peak_dbfs': 20 * math.log10(max(last_peak, 1e-12)),
    'full_human_playback_and_listening': 'not_claimed; author review pending',
    'contact_sheet_visual_review': 'pending inspection; recorded separately in video-qa-report.md'
}
(OUT / 'technical-qa.json').write_text(json.dumps(report, indent=2))
print(json.dumps({k: v for k, v in report.items() if k != 'aac_voice_gain_windows'}, indent=2))
