import bpy, math, random
from mathutils import Vector
from pathlib import Path
P=Path(__file__).resolve().parent
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=64;scene.cycles.adaptive_threshold=.025;scene.cycles.use_denoising=True
scene.render.resolution_x=1920;scene.render.resolution_y=1080;scene.render.resolution_percentage=100
scene.render.fps=24;scene.frame_start=1;scene.frame_end=432
scene.world.color=(.025,.035,.045)
scene.view_settings.view_transform='AgX'
def mat(name,color,metal=0,rough=.4):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True;n=m.node_tree.nodes.get('Principled BSDF');n.inputs['Base Color'].default_value=(*color,1);n.inputs['Metallic'].default_value=metal;n.inputs['Roughness'].default_value=rough;return m
cream=mat('Warm silicone',(.54,.39,.19),0,.48);metal=mat('Brushed aluminium',(.16,.2,.24),.8,.23);red=mat('Glazed terracotta',(.28,.055,.018),0,.24);floor=mat('Midnight studio',(.014,.03,.039),.15,.35)
colors=[mat('Grain '+str(i),c,0,.45) for i,c in enumerate([(.36,.19,.055),(.63,.4,.15),(.21,.09,.025)])]
# Fine scale surface relief is visible under grazing studio light.
def texture(ma, scale, strength, distance):
 n=ma.node_tree.nodes;l=ma.node_tree.links;p=n.get('Principled BSDF')
 noise=n.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=scale;noise.inputs['Detail'].default_value=3
 bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=strength;bump.inputs['Distance'].default_value=distance
 l.new(noise.outputs['Fac'],bump.inputs['Height']);l.new(bump.outputs['Normal'],p.inputs['Normal'])
texture(cream,180,.22,.006);texture(metal,220,.18,.008);texture(red,110,.1,.004)
cream.node_tree.nodes.get('Principled BSDF').inputs['Subsurface Weight'].default_value=.09
for ma in colors:texture(ma,95,.45,.015)
def smooth(o):
 for f in o.data.polygons:f.use_smooth=True

def uv(name,loc,scale,ma):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=40,ring_count=24,location=loc);o=bpy.context.object;o.name=name;o.scale=scale;o.data.materials.append(ma);smooth(o);return o
bpy.ops.mesh.primitive_plane_add(size=2000);bpy.context.object.data.materials.append(floor)
ball=uv('Object',(0,0,.75),(.75,.75,.75),red)
# A shaped shell with a front cutaway makes the granules visible.
N=128;R=64;verts=[];faces=[]
for j in range(R+1):
 th=.08+(math.pi-.08)*j/R
 for i in range(N+1):
  a=-.02+(2*math.pi-1.55)*i/N
  rad=1.05*math.sin(th)*(1+.008*math.sin(a*23)*math.sin(th)**3);verts.append((rad*math.cos(a),rad*math.sin(a),2.12+1.12*math.cos(th)))
for j in range(R):
 for i in range(N):
  q=j*(N+1)+i;faces.append((q,q+1,q+N+2,q+N+1))
mesh=bpy.data.meshes.new('Silicone shell');mesh.from_pydata(verts,[],faces);mesh.update();bag=bpy.data.objects.new('Cutaway flexible bag',mesh);bpy.context.collection.objects.link(bag);bag.data.materials.append(cream);smooth(bag)
bag.shape_key_add(name='Unloaded');shape=bag.shape_key_add(name='Conform')
for v in shape.data:
 r=(v.co.x*v.co.x+v.co.y*v.co.y)**.5
 if v.co.z<1.7:v.co.z+=.75*math.exp(-(r/.48)**2)
solid=bag.modifiers.new('Silicone thickness','SOLIDIFY');solid.thickness=.045
sub=bag.modifiers.new('Smooth shell','SUBSURF');sub.levels=2
# Motion is a directed demonstration, not a calibrated physics simulation.
keys=[(1,1.5,0),(48,1.5,0),(100,0,1),(168,0,1),(240,1.0,1),(288,1.0,1),(340,0,1),(385,.65,0),(432,1.5,0)]
for f,z,c in keys:bag.location.z=z;bag.keyframe_insert('location',frame=f);shape.value=c;shape.keyframe_insert('value',frame=f)
# A full membrane establishes the device before the section is revealed.
pverts=[];pfaces=[];PN=48
for j in range(R+1):
 th=.08+(math.pi-.08)*j/R
 for i in range(PN+1):
  a=(2*math.pi-1.57)+1.55*i/PN
  rad=1.05*math.sin(th)*(1+.008*math.sin(a*23)*math.sin(th)**3)
  pverts.append((rad*math.cos(a),rad*math.sin(a),2.12+1.12*math.cos(th)))
for j in range(R):
 for i in range(PN):
  q=j*(PN+1)+i;pfaces.append((q,q+1,q+PN+2,q+PN+1))
pm=bpy.data.meshes.new('Removable section mesh');pm.from_pydata(pverts,[],pfaces);pm.update()
panel=bpy.data.objects.new('Animated explanatory cutaway',pm);bpy.context.collection.objects.link(panel);smooth(panel)
panel.shape_key_add(name='Unloaded');ps=panel.shape_key_add(name='Conform')
for v in ps.data:
 r=(v.co.x*v.co.x+v.co.y*v.co.y)**.5
 if v.co.z<1.7:v.co.z+=.75*math.exp(-(r/.48)**2)
for f,z,c in keys:panel.location.z=z;panel.keyframe_insert('location',frame=f);ps.value=c;ps.keyframe_insert('value',frame=f)
mod=panel.modifiers.new('Membrane thickness','SOLIDIFY');mod.thickness=.045
mod=panel.modifiers.new('Membrane smoothing','SUBSURF');mod.levels=2
pmat=cream.copy();pmat.name='Section reveal';panel.data.materials.append(pmat)
n=pmat.node_tree.nodes;l=pmat.node_tree.links;out=n.get('Material Output');bs=n.get('Principled BSDF');trans=n.new('ShaderNodeBsdfTransparent');mix=n.new('ShaderNodeMixShader')
l.new(bs.outputs[0],mix.inputs[1]);l.new(trans.outputs[0],mix.inputs[2]);l.new(mix.outputs[0],out.inputs['Surface'])
for f,v in [(1,0),(94,0),(132,1),(344,1),(390,0),(432,0)]:mix.inputs[0].default_value=v;mix.inputs[0].keyframe_insert('default_value',frame=f)
def cylinder(name,r,d,z,ma):
 bpy.ops.mesh.primitive_cylinder_add(vertices=96,radius=r,depth=d,location=(0,0,z));o=bpy.context.object;o.name=name;o.data.materials.append(ma);smooth(o)
 mod=o.modifiers.new('Machined edge radii','BEVEL');mod.width=.014;mod.segments=3
 for f,lift,c in keys:o.location.z=z+lift;o.keyframe_insert('location',frame=f)
 return o
rubber=mat('Charcoal rubber',(.009,.012,.014),0,.65);texture(rubber,170,.25,.01)
cylinder('Anodized coupling',.205,.4,3.27,metal)
for z,r in [(3.1,.245),(3.15,.24),(3.39,.225),(3.43,.225)]:cylinder('Precision collar ring',r,.035,z,metal)
cylinder('Flexible vacuum line',.082,1.4,4.12,rubber)
for j in range(30):cylinder('Hose reinforcement rib',.092,.016,3.55+j*.041,rubber)
for j in range(12):
 angle=j*math.tau/12
 o=cylinder('Collar grip detail',.018,.18,3.27,metal);o.location.x=.203*math.cos(angle);o.location.y=.203*math.sin(angle)
 # Preserve the radial positions in every transform key.
 for f,lift,c in keys:o.location=(.203*math.cos(angle),.203*math.sin(angle),3.27+lift);o.keyframe_insert('location',frame=f)
for f,z in [(1,.75),(168,.75),(240,1.75),(288,1.75),(340,.75),(432,.75)]:ball.location.z=z;ball.keyframe_insert('location',frame=f)
random.seed(41)
# Irregular linked mineral meshes with random, non-lattice packing.
meshes=[]
for j in range(12):
 bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2,radius=1);seed=bpy.context.object
 for v in seed.data.vertices:v.co*=random.uniform(.88,1.08)
 gm=seed.data.copy();gm.materials.append(colors[j%3]);meshes.append(gm);bpy.data.objects.remove(seed,do_unlink=True)
points=[];grid={};cell=.11
for attempt in range(80000):
 x=random.uniform(-.92,.92);y=random.uniform(-.92,.92);z=random.uniform(1.35,3.05);r=random.uniform(.035,.047)
 if (x/.97)**2+(y/.97)**2+((z-2.12)/1.02)**2>.87 or x*x+y*y+(z-.75)**2<(.77+r)**2:continue
 key=tuple(math.floor(v/cell) for v in (x,y,z));valid=True
 for dx in (-1,0,1):
  for dy in (-1,0,1):
   for dz in (-1,0,1):
    for px,py,pz,pr in grid.get((key[0]+dx,key[1]+dy,key[2]+dz),[]):
     if (x-px)**2+(y-py)**2+(z-pz)**2<(r+pr+.003)**2:valid=False;break
 if not valid:continue
 grid.setdefault(key,[]).append((x,y,z,r));points.append((x,y,z,r))
 if len(points)>=2300:break
for count,(x,y,z,r) in enumerate(points):
 o=bpy.data.objects.new('Mineral grain %04d'%count,meshes[count%12]);bpy.context.collection.objects.link(o);o.scale=(r,r,r);o.rotation_euler=tuple(random.random()*6 for _ in range(3))
 for f,lift,c in keys:o.location=(x,y,z+lift);o.keyframe_insert('location',frame=f)
print('GRAINS',len(points))
# Shared linear lift curves prevent spline overshoot at release.
for action in bpy.data.actions:
 for layer in action.layers:
  for strip in layer.strips:
   for channelbag in strip.channelbags:
    for fc in channelbag.fcurves:
     for k in fc.keyframe_points:k.interpolation='LINEAR'
# Studio lighting.
def area(name,loc,power,color,size):
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.color=color;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((0,0,2))-o.location).to_track_quat('-Z','Y').to_euler()
area('Soft key',(1,-5,7),1200,(1,.8,.57),5);area('Cyan rim',(-4,2,5),1100,(.65,.8,1),4);area('Warm edge',(4,3,4),1000,(1,.75,.48),3)
bpy.ops.object.camera_add();cam=bpy.context.object;scene.camera=cam;cam.data.type='PERSP';cam.data.lens=40
# Slow three-quarter arc and push-in follow the mechanism's meaningful action.
for f,loc,target in [(1,(7,-11,6.7),(0,0,2.9)),(80,(6,-10,5.8),(0,0,2.5)),(168,(4.2,-7.7,4.7),(0,0,2.1)),(250,(3.6,-8.5,5.6),(0,0,2.9)),(300,(3.1,-8.4,5.2),(0,0,2.8)),(360,(4.2,-9,5.2),(0,0,2.2)),(432,(6,-11,6.5),(0,0,2.9))]:
 cam.location=loc;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler();cam.keyframe_insert('location',frame=f);cam.keyframe_insert('rotation_euler',frame=f)
cam.data.dof.use_dof=True;cam.data.dof.aperture_fstop=8
bpy.ops.object.empty_add(location=(0,0,2.3));focus=bpy.context.object;cam.data.dof.focus_object=focus
scene.render.image_settings.file_format='PNG';scene.render.filepath=str(P/'frames'/'frame_');(P/'frames').mkdir(exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(P/'gripper.blend'))
# Single frame quality check first; render animation with a later command.
scene.frame_set(190);scene.cycles.samples=32;scene.render.filepath=str(P/'preview.png');bpy.ops.render.render(write_still=True)
