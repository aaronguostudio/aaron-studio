import bpy
from pathlib import Path
p=Path(bpy.data.filepath).parent
prefs=bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type='METAL';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='METAL'
s=bpy.context.scene;s.cycles.device='GPU';s.cycles.samples=64;s.cycles.adaptive_threshold=.025
s.render.filepath=str(p/'frames'/'frame_')
bpy.ops.render.render(animation=True)
s.frame_set(190);s.render.resolution_x=3840;s.render.resolution_y=2160;s.cycles.samples=128;s.cycles.adaptive_threshold=.012;s.render.filepath=str(p/'hero-4k.png');bpy.ops.render.render(write_still=True)
