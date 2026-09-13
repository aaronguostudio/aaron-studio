import bpy
from pathlib import Path
p=Path(bpy.data.filepath).parent.parent/'qa';s=bpy.context.scene;s.render.resolution_percentage=50;s.cycles.samples=12;s.cycles.device='CPU'
for f in [94,132,240,288,340,370,432]:
 s.frame_set(f);s.render.filepath=str(p/f'check-{f}.png');bpy.ops.render.render(write_still=True)
