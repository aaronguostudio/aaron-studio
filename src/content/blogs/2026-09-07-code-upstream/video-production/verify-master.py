"""Verify the delivered encode and create an auditable scene contact sheet.

Technical measurements do not stand in for a human listening/full-playback review.
"""
from pathlib import Path
import hashlib
import json
import math
import subprocess
import numpy as np

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

samples=json.loads((OUT / 'frame-index.json').read_text())

def pcm(path):
    return np.frombuffer(run(['ffmpeg', '-v', 'error', '-i', str(path), '-ar', '48000', '-ac', '2', '-f', 'f32le', '-']), dtype='<f4').reshape(-1, 2)

decoded = pcm(video)
voice = pcm(OUT / 'voice-stem.wav')
music = pcm(OUT / 'music-stem.wav')
length = min(len(decoded), len(voice), len(music))
decoded, voice, music = decoded[:length], voice[:length], music[:length]
# Fit the AAC signal against the actual stems, including scored and quiet windows.
fits = []
for start in [8, 60, 120, 183, 220, 300, 340, 398, 440, 455]:
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
# Verify the picture samples taken from the silent encode also apply to both delivered muxes.
def picture_hash(path):
 data=run(['ffmpeg','-v','error','-i',str(path),'-map','0:v:0','-c','copy','-f','hash','-hash','sha256','-'])
 return data.decode().strip()
report['picture_stream_hash']=picture_hash(video)
assert report['picture_stream_hash']==picture_hash(OUT/'video-silent.mp4')==picture_hash(P/'video-nomusic.mp4')
report['scored_and_unscored_picture_identical']=True
proc=subprocess.run(['ffmpeg','-hide_banner','-i',str(video),'-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,check=True)
text=proc.stderr.decode();stats=json.loads(text[text.rfind('{'):text.rfind('}')+1])
report['measured_integrated_lufs']=float(stats['input_i']);report['measured_true_peak_dbtp']=float(stats['input_tp'])
assert report['measured_true_peak_dbtp'] <= -1.5
(OUT / 'technical-qa.json').write_text(json.dumps(report, indent=2))
print(json.dumps({k: v for k, v in report.items() if k != 'aac_voice_gain_windows'}, indent=2))
