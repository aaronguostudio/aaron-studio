import subprocess,json,re
from pathlib import Path
p=Path(__file__).resolve().parent;src=p/'film-mix.wav'
r=subprocess.run(['ffmpeg','-hide_banner','-i',str(src),'-af','loudnorm=I=-16:TP=-2:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True);m=json.loads(re.findall(r'\{[^{}]+\}',r.stderr)[-1]);(p/'qa/mix-normalization.json').write_text(json.dumps(m,indent=2))
f='loudnorm=I=-16:TP=-2:LRA=11:measured_I={input_i}:measured_TP={input_tp}:measured_LRA={input_lra}:measured_thresh={input_thresh}:offset={target_offset}:linear=true'.format(**m)
subprocess.run(['ffmpeg','-v','error','-y','-i',str(src),'-af',f,'-ar','48000','-c:a','pcm_s24le',str(p/'film-mix-normalized.wav')],check=True)
print('Raw mix',m['input_i'],'LUFS,',m['input_tp'],'dBTP; normalized master created')
