"""Check the scoped visual revision and extract exact encoded review frames."""
from pathlib import Path
import hashlib
import json
import subprocess

P = Path(__file__).resolve().parents[1]
R = P / 'revisions/visual-feedback-05'


def run(args):
    return subprocess.check_output(args, text=True).strip()


def probe(path):
    return json.loads(run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)]))


def stream_hash(path, stream):
    return run(['ffmpeg', '-v', 'error', '-i', str(path), '-map', stream,
                '-c', 'copy', '-f', 'hash', '-hash', 'sha256', '-'])


def balanced(items):
    if len(items) == 1:
        return items[0]
    mid = len(items) // 2
    return '(' + balanced(items[:mid]) + '+' + balanced(items[mid:]) + ')'


new = P / 'video-v2.mp4'
plain = P / 'video-v2-nomusic.mp4'
old = R / 'video.mp4'
old_plain = R / 'video-nomusic.mp4'
info = probe(new)
video = next(s for s in info['streams'] if s['codec_type'] == 'video')
audio = next(s for s in info['streams'] if s['codec_type'] == 'audio')
assert (video['width'], video['height'], video['r_frame_rate']) == (1920, 1080, '30/1')
assert int(video['nb_frames']) == 14090
assert abs(float(info['format']['duration']) - 469.666667) < .01
checks = {
    'scored_audio_stream_identical': stream_hash(new, '0:a:0') == stream_hash(old, '0:a:0'),
    'plain_audio_stream_identical': stream_hash(plain, '0:a:0') == stream_hash(old_plain, '0:a:0'),
    'scored_plain_picture_identical': stream_hash(new, '0:v:0') == stream_hash(plain, '0:v:0'),
}
old_audio = next(s for s in probe(old)['streams'] if s['codec_type'] == 'audio')
checks['audio_timing_identical'] = all(audio.get(k) == old_audio.get(k) for k in ['start_time', 'duration', 'nb_frames', 'sample_rate'])
locks = json.loads((R / 'preserve-lock.json').read_text())
checks['source_locks_unchanged'] = all(hashlib.sha256((P / f).read_bytes()).hexdigest() == sha for f, sha in locks.items())
assert all(checks.values()), checks

scenes = json.loads((R / 'changed-scenes.json').read_text())
samples = {}
for s in scenes:
    start, end = round(s['start'] * 30), round(s['end'] * 30)
    for frame, phase in [(start-1, 'preceding-cut'), (start, 'entry'), (s['frame'], 'middle'), (end-1, 'exit'), (end, 'following-cut')]:
        if 0 <= frame < 14090:
            samples.setdefault(frame, []).append(s['id'] + '/' + phase)
samples[14089] = ['final-frame']
frames = sorted(samples)
out = R / 'encoded-frames'
out.mkdir(exist_ok=True)
selection = balanced([f'eq(n,{frame})' for frame in frames])
subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', str(new),
                '-vf', f"select='{selection}',scale=640:360", '-fps_mode', 'vfr', '-q:v', '2',
                str(out / 'frame-%03d.jpg')], check=True)
actual = sorted(out.glob('frame-*.jpg'))
assert len(actual) == len(frames)
for batch in range((len(frames) + 8) // 9):
    subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-start_number', str(batch*9+1),
                    '-i', str(out / 'frame-%03d.jpg'), '-vf', 'tile=3x3:padding=6:margin=6:color=white',
                    '-frames:v', '1', str(R / f'encoded-contact-{batch+1:02}.jpg')], check=True)
(R / 'encoded-frame-index.json').write_text(json.dumps([{'file': f'frame-{n+1:03}.jpg', 'frame': frame, 'time': frame/30, 'roles': samples[frame]} for n, frame in enumerate(frames)], indent=2) + '\n')
report = {
    'status': 'technical-pass-visual-inspection-pending',
    'video': 'video-v2.mp4',
    'sha256': hashlib.sha256(new.read_bytes()).hexdigest(),
    'durationSeconds': float(info['format']['duration']),
    'resolution': [1920, 1080], 'fps': 30, 'frames': 14090,
    'changedScenes': len(scenes), 'encodedSamples': len(frames),
    'checks': checks,
    'scoredAudioHash': stream_hash(new, '0:a:0'),
    'fullWatchAndListening': 'not re-performed; exact previous audio copied, scoped image revision',
}
(R / 'technical-qa.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report))
