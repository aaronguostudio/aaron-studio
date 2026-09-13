from pathlib import Path
import json,subprocess
p=Path(__file__).resolve().parent
arts=json.loads((p/'qa/artifacts.json').read_text())
for a in arts:
 f=p/a['file']; name=f.stem
 # Decode every video and audio frame; errors are fatal.
 with (p/'qa'/f'{name}-decode.log').open('w') as log:
  subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(f),'-f','null','-'],check=True,stdout=log,stderr=log)
 with (p/'qa'/f'{name}-loudness.log').open('w') as log:
  subprocess.run(['ffmpeg','-hide_banner','-i',str(f),'-vn','-af','loudnorm=print_format=json','-f','null','-'],check=True,stdout=log,stderr=log)
 last=(p/'qa'/f'{name}-loudness.log').read_text();metrics=json.loads(last[last.rfind('{'):last.rfind('}')+1]);a['loudness_lufs']=float(metrics['input_i']);a['true_peak_dbtp']=float(metrics['input_tp']);assert a['true_peak_dbtp']<=-1.5
 a['complete_decode']='pass'
(p/'qa/artifacts.json').write_text(json.dumps(arts,indent=2)+'\n')
subprocess.run(['ffmpeg','-y','-i',str(p/'film.mp4'),'-vf','fps=1/40,scale=480:-1,tile=4x4','-frames:v','1',str(p/'qa/final-contact.jpg')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
print('All four outputs fully decoded; audio peak gates passed.')
