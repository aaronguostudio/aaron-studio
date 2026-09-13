from pathlib import Path
import subprocess
p=Path(__file__).resolve().parents[2];out=Path(__file__).resolve().parent
for name,audio in [('video-v7.mp4','mix.wav'),('video-v7-nomusic.mp4','voice-retimed.wav')]:
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(out/'full-silent.mp4'),'-i',str(out/audio),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','256k','-t','512.8','-movflags','+faststart',str(p/name)],check=True)
print('V7 scored and dry masters ready')
