from pathlib import Path
import subprocess
p=Path(__file__).resolve().parents[2];out=Path(__file__).resolve().parent
clips=[(188.6,27),(283.7,26),(467.8,45)]
filters=';'.join(f'[1:a]atrim=start={a}:duration={b},asetpts=PTS-STARTPTS[a{i}]' for i,(a,b) in enumerate(clips))+';'+''.join(f'[a{i}]' for i in range(len(clips)))+'concat=n=3:v=0:a=1[a]'
subprocess.run(['ffmpeg','-y','-v','error','-i',str(out/'prototype-silent.mp4'),'-i',str(out/'mix.wav'),'-filter_complex',filters,'-map','0:v:0','-map','[a]','-c:v','copy','-c:a','aac','-b:a','256k','-t','98','-movflags','+faststart',str(p/'video-sound-preview-v7.mp4')],check=True)
print('98-second scored prototype ready')
