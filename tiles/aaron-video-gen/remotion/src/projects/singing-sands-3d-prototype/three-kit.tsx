import React, {useEffect, useLayoutEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {useFrame, useThree} from '@react-three/fiber';
import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {BloomEffect, DepthOfFieldEffect, EffectComposer, EffectPass, RenderPass, ToneMappingEffect, ToneMappingMode} from 'postprocessing';
import {Easing, interpolate} from 'remotion';

export type Vec3 = [number, number, number];
// `range` is the in-focus depth in world units and `bokeh` the blur scale; both follow the camera keys.
export type CamKey = {t: number; pos: Vec3; target: Vec3; fov: number; range?: number; bokeh?: number; linear?: boolean};
export type CamState = {pos: Vec3; target: Vec3; fov: number; range: number; bokeh: number};

export const WIDTH = 1920;
export const HEIGHT = 1080;
export const INK = '#201b16';
export const CREAM = '#fff0d1';
export const GOLD = '#d8a657';
// Weighted toward pale quartz and tan, with a few darker lithic grains.
export const SAND_TONES = ['#ead3a6', '#d9b57d', '#c79c64', '#f1e0bd', '#b98b56', '#e2c392', '#f6ecd8', '#d2ab72', '#ead3a6', '#dcbc88', '#a8794a', '#7a624b'];

const editorial = Easing.bezier(0.45, 0, 0.55, 1);
const entrance = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const fade = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {...clamp, easing: editorial});
export const enter = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {...clamp, easing: entrance});
export const deg = (d: number) => THREE.MathUtils.degToRad(d);

export const mulberry32 = (seed: number) => () => {
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Subangular grains: a merged icosphere whose vertices are pushed in or out by a seeded amount.
export const VARIANTS = 4;
export const grainGeometries = (seed: number) => {
	const rand = mulberry32(seed);
	return Array.from({length: VARIANTS}, () => {
		const geometry = new THREE.IcosahedronGeometry(1, 1);
		geometry.deleteAttribute('normal');
		geometry.deleteAttribute('uv');
		const merged = mergeVertices(geometry);
		const position = merged.attributes.position;
		const lumps = Array.from({length: 7}, () => new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize());
		const weights = lumps.map(() => (rand() - 0.5) * 0.7);
		const v = new THREE.Vector3();
		for (let i = 0; i < position.count; i++) {
			v.fromBufferAttribute(position, i);
			const k = 0.9 + lumps.reduce((sum, lump, j) => sum + weights[j] * Math.max(0, v.dot(lump)) ** 2, 0) + (rand() - 0.5) * 0.2;
			position.setXYZ(i, v.x * k * 1.08, v.y * k * 0.8, v.z * k);
		}
		merged.computeVertexNormals();
		return merged;
	});
};

const DEFAULT_RANGE = 1.2;
const DEFAULT_BOKEH = 2;
const settled = (k: CamKey): CamState => ({pos: k.pos, target: k.target, fov: k.fov, range: k.range ?? DEFAULT_RANGE, bokeh: k.bokeh ?? DEFAULT_BOKEH});

export const cameraAt = (keys: CamKey[], t: number): CamState => {
	if (t <= keys[0].t) return settled(keys[0]);
	for (let i = 0; i < keys.length - 1; i++) {
		const a = settled(keys[i]);
		const b = settled(keys[i + 1]);
		if (t > keys[i + 1].t) continue;
		const raw = (t - keys[i].t) / (keys[i + 1].t - keys[i].t);
		const p = keys[i + 1].linear ? raw : editorial(raw);
		const mix = (u: Vec3, v: Vec3): Vec3 => [u[0] + (v[0] - u[0]) * p, u[1] + (v[1] - u[1]) * p, u[2] + (v[2] - u[2]) * p];
		const lerp = (u: number, v: number) => u + (v - u) * p;
		return {pos: mix(a.pos, b.pos), target: mix(a.target, b.target), fov: lerp(a.fov, b.fov), range: lerp(a.range, b.range), bokeh: lerp(a.bokeh, b.bokeh)};
	}
	return settled(keys[keys.length - 1]);
};

// Keys are authored in a scene's local frame; `toWorld` maps them into the rendered frame.
export const worldCamera = (state: CamState, toWorld: (v: THREE.Vector3) => THREE.Vector3): CamState => {
	const p = toWorld(new THREE.Vector3(...state.pos));
	const q = toWorld(new THREE.Vector3(...state.target));
	return {...state, pos: [p.x, p.y, p.z], target: [q.x, q.y, q.z]};
};

// Depth of field focused on the camera target, a restrained bloom, then ACES tone mapping in post.
// The composer is built synchronously: @remotion/three advances R3F exactly once per frame, so a
// composer created in an effect (as @react-three/postprocessing does) would miss a mount's first frame.
export const PostFX: React.FC<{camera: CamState; bloom?: number; width?: number; height?: number}> = ({camera: state, bloom = 0.55, width = WIDTH, height = HEIGHT}) => {
	const {gl, scene, camera} = useThree();
	const fx = useMemo(() => {
		gl.toneMapping = THREE.NoToneMapping;
		const composer = new EffectComposer(gl, {multisampling: 4, frameBufferType: THREE.HalfFloatType});
		composer.addPass(new RenderPass(scene, camera));
		const dof = new DepthOfFieldEffect(camera, {focusDistance: 3, focusRange: 1.2, bokehScale: 2, resolutionScale: 0.75});
		dof.target = new THREE.Vector3();
		const glowFx = new BloomEffect({mipmapBlur: true, luminanceThreshold: 0.86, luminanceSmoothing: 0.18, intensity: bloom, radius: 0.72});
		composer.addPass(new EffectPass(camera, dof));
		composer.addPass(new EffectPass(camera, glowFx, new ToneMappingEffect({mode: ToneMappingMode.ACES_FILMIC})));
		composer.setSize(width, height);
		return {composer, dof};
	}, [gl, scene, camera, bloom, width, height]);
	useLayoutEffect(() => {
		fx.dof.target!.set(...state.target);
		fx.dof.cocMaterial.focusRange = state.range;
		fx.dof.bokehScale = state.bokeh;
	}, [fx, state]);
	useEffect(() => () => fx.composer.dispose(), [fx]);
	useFrame(() => fx.composer.render(), 1);
	return null;
};

// Unlit accents are tone-mapped in post, so they are authored above 1.0 to stay bright and bloom.
export const glow = (hex: string, strength: number) => new THREE.Color(hex).multiplyScalar(strength);

export const CameraRig: React.FC<{state: CamState; aspect?: number}> = ({state, aspect = WIDTH / HEIGHT}) => {
	const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
	useLayoutEffect(() => {
		camera.position.set(...state.pos);
		camera.fov = state.fov;
		camera.near = 0.03;
		camera.far = 80;
		camera.aspect = aspect;
		camera.updateProjectionMatrix();
		camera.lookAt(...state.target);
		camera.updateMatrixWorld();
	}, [camera, state, aspect]);
	return null;
};

// Screen position of a world point for 2D labels drawn over the canvas.
export const project = (state: CamState, point: THREE.Vector3, width = WIDTH, height = HEIGHT) => {
	const camera = new THREE.PerspectiveCamera(state.fov, width / height, 0.03, 80);
	camera.position.set(...state.pos);
	camera.lookAt(...state.target);
	camera.updateMatrixWorld();
	camera.updateProjectionMatrix();
	const v = point.clone().project(camera);
	return {x: ((v.x + 1) / 2) * width, y: ((1 - v.y) / 2) * height};
};

export type Placement = (i: number, position: THREE.Vector3, rotation: THREE.Quaternion, scale: THREE.Vector3) => void;

export type Paint = (i: number, color: THREE.Color) => void;

export const Grains: React.FC<{count: number; paint: Paint; paintKey: number; place: Placement; frame: number; seed: number}> = ({count, paint, paintKey, place, frame, seed}) => {
	const geometries = useMemo(() => grainGeometries(seed), [seed]);
	const material = useMemo(() => new THREE.MeshStandardMaterial({roughness: 0.86, metalness: 0.0}), []);
	const meshes = useRef<(THREE.InstancedMesh | null)[]>([]);
	const counts = geometries.map((_, v) => Math.ceil((count - v) / VARIANTS));

	useLayoutEffect(() => {
		const color = new THREE.Color();
		for (let i = 0; i < count; i++) {
			paint(i, color);
			meshes.current[i % VARIANTS]!.setColorAt(Math.floor(i / VARIANTS), color);
		}
		meshes.current.forEach((mesh) => mesh && (mesh.instanceColor!.needsUpdate = true));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paintKey, count]);

	useLayoutEffect(() => {
		const matrix = new THREE.Matrix4();
		const position = new THREE.Vector3();
		const rotation = new THREE.Quaternion();
		const scale = new THREE.Vector3();
		for (let i = 0; i < count; i++) {
			place(i, position, rotation, scale);
			matrix.compose(position, rotation, scale);
			meshes.current[i % VARIANTS]!.setMatrixAt(Math.floor(i / VARIANTS), matrix);
		}
		meshes.current.forEach((mesh) => mesh && (mesh.instanceMatrix.needsUpdate = true));
	}, [frame, place, count]);

	return (
		<>
			{geometries.map((geometry, v) => (
				<instancedMesh
					key={v}
					ref={(el) => {
						meshes.current[v] = el;
					}}
					args={[geometry, material, counts[v]]}
					castShadow
					receiveShadow
					frustumCulled={false}
				/>
			))}
		</>
	);
};

// A thin mesh between two points; used for leader lines and velocity arrows inside the 3D frame.
export const orientBetween = (mesh: THREE.Object3D, from: THREE.Vector3, to: THREE.Vector3, thickness: number) => {
	const direction = to.clone().sub(from);
	const length = Math.max(direction.length(), 1e-4);
	mesh.position.copy(from).addScaledVector(direction, 0.5);
	mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
	mesh.scale.set(thickness, length, thickness);
};
