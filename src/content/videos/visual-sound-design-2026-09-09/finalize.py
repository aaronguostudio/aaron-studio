from pathlib import Path
import subprocess,json,zipfile
p=Path(__file__).resolve().parent
frames=p/'blender/frames'
assert all((frames/f'frame_{i:04}.png').exists() for i in range(1,433))
subprocess.run(['ffmpeg','-y','-v','error','-framerate','24','-start_number','1','-i',str(frames/'frame_%04d.png'),'-frames:v','432','-c:v','libx264','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(p/'gripper-study.mp4')],check=True)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(p/'gripper-study.mp4'),'-vf','fps=1/2,scale=426:-1,tile=3x3','-frames:v','1',str(p/'qa/gripper-contact.jpg')],check=True)
subprocess.run(['python3',str(p/'verify.py')],check=True)
with zipfile.ZipFile(p/'visual-sound-review-pack.zip','w',zipfile.ZIP_DEFLATED) as z:
 for f in [p/'review.html',p/'README.md',p/'design-plan.json',p/'asset-manifest.json',p/'lab-revision.mp4',p/'gripper-study.mp4',p/'blender/gripper.blend',p/'blender/gripper.py',p/'blender/preview.png',*list((p/'assets').glob('*.png')),*list((p/'audio').glob('*.mp3')),p/'audio/manifest.json',p/'audio/qa.json',p/'audio/script.txt']:
  z.write(f,str(f.relative_to(p)))
print('Finalized design review pack.')
