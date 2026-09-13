import bpy, math, random
from mathutils import Vector
from pathlib import Path
P=Path(__file__).resolve().parent
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=12;scene.cycles.use_denoising=True
scene.render.resolution_x=1280;scene.render.resolution_y=720;scene.render.resolution_percentage=100
scene.render.fps=24;scene.frame_start=1;scene.frame_end=432
scene.world.color=(.025,.035,.045)
scene.view_settings.view_transform='AgX'
def mat(name,color,metal=0,rough=.4):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True;n=m.node_tree.nodes.get('Principled BSDF');n.inputs['Base Color'].default_value=(*color,1);n.inputs['Metallic'].default_value=metal;n.inputs['Roughness'].default_value=rough;return m
cream=mat('Warm silicone',(.73,.61,.37),0,.3);metal=mat('Brushed aluminium',(.16,.2,.24),.8,.23);red=mat('Coral ceramic',(.42,.045,.025),.1,.26);floor=mat('Midnight studio',(.014,.03,.039),.15,.35)
colors=[mat('Grain '+str(i),c,0,.45) for i,c in enumerate([(.73,.4,.1),(.95,.71,.3),(.45,.25,.07)])]
def smooth(o):
 for f in o.data.polygons:f.use_smooth=True

def uv(name,loc,scale,ma):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=40,ring_count=24,location=loc);o=bpy.context.object;o.name=name;o.scale=scale;o.data.materials.append(ma);smooth(o);return o
bpy.ops.mesh.primitive_plane_add(size=200);bpy.context.object.data.materials.append(floor)
ball=uv('Object',(0,0,.75),(.75,.75,.75),red)
# A shaped shell with a front cutaway makes the granules visible.
N=64;R=40;verts=[];faces=[]
for j in range(R+1):
 th=.08+(math.pi-.08)*j/R
 for i in range(N+1):
  a=-.05+(2*math.pi-1.8)*i/N
  rad=1.05*math.sin(th);verts.append((rad*math.cos(a),rad*math.sin(a),2.12+1.12*math.cos(th)))
for j in range(R):
 for i in range(N):
  q=j*(N+1)+i;faces.append((q,q+1,q+N+2,q+N+1))
mesh=bpy.data.meshes.new('Silicone shell');mesh.from_pydata(verts,[],faces);mesh.update();bag=bpy.data.objects.new('Cutaway flexible bag',mesh);bpy.context.collection.objects.link(bag);bag.data.materials.append(cream);smooth(bag)
bag.shape_key_add(name='Unloaded');shape=bag.shape_key_add(name='Conform')
for v in shape.data:
 r=(v.co.x*v.co.x+v.co.y*v.co.y)**.5
 if v.co.z<1.7:v.co.z+=.61*math.exp(-(r/.48)**2)
solid=bag.modifiers.new('Silicone thickness','SOLIDIFY');solid.thickness=.045
sub=bag.modifiers.new('Smooth shell','SUBSURF');sub.levels=1
# Motion is a directed demonstration, not a calibrated physics simulation.
keys=[(1,1.5,0),(48,1.5,0),(100,0,1),(168,0,1),(240,1.0,1),(288,1.0,1),(340,0,1),(385,.65,0),(432,1.5,0)]
for f,z,c in keys:bag.location.z=z;bag.keyframe_insert('location',frame=f);shape.value=c;shape.keyframe_insert('value',frame=f)
bpy.ops.mesh.primitive_cylinder_add(vertices=48,radius=.23,depth=.46,location=(0,0,3.27));collar=bpy.context.object;collar.data.materials.append(metal);smooth(collar)
bpy.ops.mesh.primitive_cylinder_add(vertices=48,radius=.1,depth=1.25,location=(0,0,4.05));hose=bpy.context.object;hose.data.materials.append(metal)
for o in [collar,hose]:
 base=o.location.z
 for f,z,c in keys:o.location.z=base+z;o.keyframe_insert('location',frame=f)
for f,z in [(1,.75),(168,.75),(240,1.75),(288,1.75),(340,.75),(432,.75)]:ball.location.z=z;ball.keyframe_insert('location',frame=f)
random.seed(41)
# Shared low-poly granule mesh; separated particles occupy the visible volume.
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=1);seed=bpy.context.object;gm=seed.data.copy();bpy.data.objects.remove(seed,do_unlink=True)
count=0
for iz in range(11):
 for ix in range(-6,7):
  for iy in range(-6,7):
   x=ix*.145+(iz%2)*.06;y=iy*.145;z=1.5+iz*.14;r=(x*x+y*y)**.5
   if (r/ .9)**2+((z-2.1)/.96)**2>.9 or x*x+y*y+(z-.75)**2<.87**2:continue
   count+=1;o=bpy.data.objects.new('Grain %03d'%count,gm);bpy.context.collection.objects.link(o);o.scale=(.061,.059,.063);o.rotation_euler=(random.random()*3,random.random()*3,random.random()*3);o.data=gm.copy();o.data.materials.append(colors[count%3])
   for f,lift,c in keys:
    jitter=.012 if f<168 or f>340 else 0
    o.location=(x+random.uniform(-jitter,jitter),y+random.uniform(-jitter,jitter),z+lift);o.keyframe_insert('location',frame=f)
# Studio lighting.
def area(name,loc,power,color,size):
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.color=color;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((0,0,2))-o.location).to_track_quat('-Z','Y').to_euler()
area('Soft key',(1,-5,7),1200,(1,.8,.57),5);area('Cyan rim',(-4,2,5),1500,(.22,.7,1),4);area('Warm edge',(4,3,4),950,(1,.54,.22),3)
bpy.ops.object.camera_add(location=(6,-9,5.8));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,2.65))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=9.5;scene.camera=cam
scene.render.image_settings.file_format='PNG';scene.render.filepath=str(P/'frames'/'frame_');(P/'frames').mkdir(exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(P/'gripper.blend'))
# Single frame quality check first; render animation with a later command.
scene.frame_set(190);scene.render.filepath=str(P/'preview.png');bpy.ops.render.render(write_still=True)
