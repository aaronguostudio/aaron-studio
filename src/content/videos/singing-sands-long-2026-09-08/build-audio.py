from pathlib import Path
import json,subprocess
p=Path(__file__).resolve().parent;d=json.loads((p/'timeline.json').read_text());duration=d['durationFrames']/30
music=p/'music/music.mp3';normalized=p/'music/music-normalized.wav'
subprocess.run(['ffmpeg','-v','error','-y','-i',str(music),'-af','loudnorm=I=-18:TP=-2:LRA=8','-ar','48000','-ac','2',str(normalized)],check=True)
files=list(dict.fromkeys(a['file'] for a in d['audio']));files+=[str(normalized),str(p.parent/'singing-sands-pilot-2026-09-08/assets/field-recording.wav')]
args=['ffmpeg','-v','error','-y']
for f in files:args+=['-i',f]
filters=[];voice=[]
for i,a in enumerate(d['audio']):
 label=f'v{i}';filters.append(f"[{files.index(a['file'])}:a]atrim={a['sourceStart']}:{a['sourceEnd']},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,adelay={round(a['start']*1000)}|{round(a['start']*1000)}[{label}]");voice.append(f'[{label}]')
filters.append(''.join(voice)+f'amix=inputs={len(voice)}:normalize=0,apad,atrim=duration={duration},asplit=2[voice][duck]')
chs=[s for s in d['scenes'] if s['chapter']];offsets=[0,45,90,30,85,150];mus=[];cues=[]
for i,s in enumerate(chs):
 end=chs[i+1]['start'] if i+1<len(chs) else d['scenes'][-1]['start']-1.0;dur=end-s['start'];off=offsets[i];label=f'm{i}'
 filters.append(f'[{len(files)-2}:a]atrim={off}:{off+dur},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1.1,afade=t=out:st={max(0,dur-2.2)}:d=2.2,volume=0.36,adelay={round(s["start"]*1000)}|{round(s["start"]*1000)}[{label}]');mus.append(f'[{label}]');cues.append(dict(chapter=s['chapter'],start=s['start'],end=end,sourceStart=off,sourceEnd=off+dur,baseGain=.36,duck='sidechain threshold .025 ratio 6 attack 15ms release 500ms',job=s['chapterTitle']))
filters.append(''.join(mus)+f'amix=inputs={len(mus)}:normalize=0,apad,atrim=duration={duration}[score]')
filters.append('[score][duck]sidechaincompress=threshold=0.025:ratio=6:attack=15:release=500:makeup=1[ducked]')
field=len(files)-1
filters.append(f'[{field}:a]atrim=0:7,asetpts=PTS-STARTPTS,afade=t=out:st=4.5:d=2.5[open]')
a=d['audio'][-1];fieldstart=a['end']+.15
filters.append(f'[{field}:a]atrim=0:6,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.3,afade=t=out:st=4.4:d=1.6,adelay={round(fieldstart*1000)}|{round(fieldstart*1000)}[close]')
filters.append(f'[voice][ducked][open][close]amix=inputs=4:normalize=0,atrim=duration={duration}[out]')
(p/'audio-filter.txt').write_text(';\n'.join(filters));(p/'music/cues.json').write_text(json.dumps(cues,indent=2)+'\n')
subprocess.run(args+['-filter_complex_script',str(p/'audio-filter.txt'),'-map','[out]','-ar','48000','-c:a','pcm_s16le',str(p/'film-mix.wav')],check=True)
print('Mixed',duration,'seconds; 6 scored chapter arcs with voice-driven ducking')
