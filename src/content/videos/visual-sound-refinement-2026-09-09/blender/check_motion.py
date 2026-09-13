import bpy,json,math
from pathlib import Path
from bpy_extras.object_utils import world_to_camera_view
p=Path(bpy.data.filepath).parent;s=bpy.context.scene;bag=bpy.data.objects['Cutaway flexible bag'];ball=bpy.data.objects['Object'];report=[]
for f in range(1,433,6):
 s.frame_set(f);deps=bpy.context.evaluated_depsgraph_get();ob=bag.evaluated_get(deps);mesh=ob.to_mesh();vs=[ob.matrix_world@v.co for v in mesh.vertices];distance=min((v-ball.location).length for v in vs)
 points=vs[::16]+[ball.matrix_world@v.co for v in list(ball.data.vertices)[::8]];screen=[world_to_camera_view(s,s.camera,v)for v in points]
 report.append({'frame':f,'surface_clearance':distance-.75,'frame_bounds':[min(v.x for v in screen),min(v.y for v in screen),max(v.x for v in screen),max(v.y for v in screen)]});ob.to_mesh_clear()
(p.parent/'qa/motion-geometry.json').write_text(json.dumps(report,indent=2));print('MIN_CLEARANCE',min(x['surface_clearance']for x in report));print('BOUNDS',*[min(x['frame_bounds'][i]for x in report)if i<2 else max(x['frame_bounds'][i]for x in report)for i in range(4)])
