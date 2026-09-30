import React, {useEffect, useLayoutEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {useFrame, useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {BloomEffect, DepthOfFieldEffect, EffectComposer, EffectPass, RenderPass, ToneMappingEffect, ToneMappingMode} from 'postprocessing';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {CamKey, CamState, CameraRig, cameraAt, mulberry32, project} from '../singing-sands-3d-prototype/three-kit';

/**
 * ledger-3d-explainer (prototype): two 3D scenes for AiBillFilm, in the film's ledger palette.
 * Warm paper world, graphite objects, amber reserved for cache reads / the re-read.
 * Depth of field on the subject, restrained bloom (only the amber glows cross the threshold),
 * Khronos neutral tone mapping so the paper stays paper. Kinematics are conceptual, not to scale.
 */

export const W = 1920;
export const H = 1080;
const PAPER_BG = '#F3F1EB';
const DESK = '#EEECE6';
const PAPER = '#FBFAF6';
const CONTEXT_PAPER = '#F1EBDD';
const GRAPHITE = '#454A47';
const LINE_GREY = '#8D908D';
const AMBER = '#D2701C';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const editorial = Easing.bezier(0.45, 0, 0.55, 1);
const entrance = Easing.bezier(0.16, 1, 0.3, 1);
const ramp = (t: number, a: number, b: number, easing = editorial) => interpolate(t, [a, b], [0, 1], {...clamp, easing});
const rise = (t: number, a: number, b: number) => ramp(t, a, b, entrance);
const hdr = (hex: string, k: number) => new THREE.Color(hex).multiplyScalar(k);

// ---------------------------------------------------------------- post
// Same synchronous composer pattern as the singing-sands kit (R3F advances once per frame),
// with neutral tone mapping and a high bloom threshold for a light editorial scene.
const LedgerPostFX: React.FC<{camera: CamState}> = ({camera: state}) => {
	const {gl, scene, camera} = useThree();
	const fx = useMemo(() => {
		gl.toneMapping = THREE.NoToneMapping;
		const composer = new EffectComposer(gl, {multisampling: 4, frameBufferType: THREE.HalfFloatType});
		composer.addPass(new RenderPass(scene, camera));
		const dof = new DepthOfFieldEffect(camera, {focusDistance: 3, focusRange: 1.2, bokehScale: 2, resolutionScale: 0.75});
		dof.target = new THREE.Vector3();
		const bloom = new BloomEffect({mipmapBlur: true, luminanceThreshold: 1.0, luminanceSmoothing: 0.12, intensity: 0.55, radius: 0.65});
		composer.addPass(new EffectPass(camera, dof));
		composer.addPass(new EffectPass(camera, bloom, new ToneMappingEffect({mode: ToneMappingMode.NEUTRAL})));
		composer.setSize(W, H);
		return {composer, dof};
	}, [gl, scene, camera]);
	useLayoutEffect(() => {
		fx.dof.target!.set(...state.target);
		fx.dof.cocMaterial.focusRange = state.range;
		fx.dof.bokehScale = state.bokeh;
	}, [fx, state]);
	useEffect(() => () => fx.composer.dispose(), [fx]);
	useFrame(() => fx.composer.render(), 1);
	return null;
};

const Room: React.FC = () => (
	<>
		<color attach="background" args={[PAPER_BG]} />
		<fog attach="fog" args={[PAPER_BG, 7, 19]} />
		<hemisphereLight args={['#ffffff', '#e2dfd8', 1.7]} />
		<ambientLight intensity={0.25} color="#ffffff" />
		<directionalLight
			position={[-3.5, 6.5, 4.5]}
			intensity={2.1}
			color="#fffdf8"
			castShadow
			shadow-mapSize={[4096, 4096]}
			shadow-bias={-0.0004}
			shadow-normalBias={0.012}
			shadow-radius={6}
			shadow-camera-left={-5}
			shadow-camera-right={5}
			shadow-camera-top={5}
			shadow-camera-bottom={-5}
			shadow-camera-near={0.5}
			shadow-camera-far={20}
		/>
		<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
			<planeGeometry args={[40, 40]} />
			<meshStandardMaterial color={DESK} roughness={0.92} />
		</mesh>
	</>
);

const Stage3D: React.FC<{camera: CamState; children: React.ReactNode}> = ({camera, children}) => (
	<ThreeCanvas width={W} height={H} shadows gl={{antialias: true, preserveDrawingBuffer: true}}>
		<CameraRig state={camera} aspect={W / H} />
		<Room />
		{children}
		<LedgerPostFX camera={camera} />
	</ThreeCanvas>
);

const mono = "'SF Mono', Menlo, 'Courier New', monospace";
const serif = "Georgia, 'Times New Roman', serif";
const sans = "-apple-system, 'Helvetica Neue', Arial, sans-serif";
const INK = '#1E2124';
const INK2 = '#565A60';
const MUTED = '#7E8287';
const settle = (p: number): React.CSSProperties => ({opacity: p, transform: `translateY(${(1 - p) * 10}px)`});

const Scrim: React.FC<{opacity?: number; at?: string}> = ({opacity = 1, at = '0% 0%'}) => (
	<AbsoluteFill style={{opacity, background: `radial-gradient(ellipse 1250px 560px at ${at}, rgba(244,241,233,.94) 0%, rgba(244,241,233,.72) 48%, rgba(244,241,233,0) 100%)`}} />
);

const Tag: React.FC<{children: React.ReactNode; p: number; style?: React.CSSProperties; color?: string}> = ({children, p, style, color = MUTED}) => (
	<div style={{position: 'absolute', fontFamily: mono, fontSize: 18, letterSpacing: 2, color, whiteSpace: 'nowrap', ...settle(p), ...style}}>{children}</div>
);

// ================================================================= COLD OPEN
// Weekly meter (Pro-account peaks, claim C11) and a thermal receipt that prints its line items,
// then one amber line that keeps extending off the paper across the frame (the article cover, in 3D).
const METER = [99, 59, 99, 99, 100, 100];
const BAR_H = 0.95;
const BAR_X = (i: number) => 0.25 + i * 0.36;
const BAR_Z = -0.75;
const PRINTER_X = -1.35;
const PAPER_W = 0.64;
const PX0 = PRINTER_X - PAPER_W / 2 + 0.05; // left print margin
const PX1 = PRINTER_X + PAPER_W / 2 - 0.05; // right print margin
// Receipt content, measured as distance u from the leading edge of the paper.
const RECEIPT = (() => {
	const rand = mulberry32(930);
	const lines: {u: number; item: number; amber?: boolean}[] = [];
	for (let k = 0; k < 11; k++) lines.push({u: 0.14 + k * 0.074, item: 0.2 + rand() * 0.16});
	lines.push({u: 1.0, item: 0, amber: true});
	lines.push({u: 1.1, item: 0.24});
	lines.push({u: 1.174, item: 0.3});
	return lines;
})();
const AMBER_U = 1.0;
const PAPER_END = 1.34;

export type ColdCues = {drift: number; lead: number; meter: number; hit: number; email: number; half: number; logs: number; priced: number; expensive: number; expected: number; end: number};

const meterFill = (t: number, c: ColdCues, i: number) => rise(t, c.meter + i * 0.8, c.meter + i * 0.8 + 1.05);
// Paper fed out of the slot, in world units: a short leader, the 11 grey lines, the amber line, the tail.
const printed = (t: number, c: ColdCues) => {
	const lead = 0.06;
	const greys = interpolate(t, [c.logs, c.expensive - 0.15], [lead, 0.94], {...clamp, easing: editorial});
	const amber = interpolate(t, [c.expensive - 0.15, c.expensive + 0.45], [0, AMBER_U + 0.06 - 0.94], clamp);
	const tail = interpolate(t, [c.expected - 0.4, c.expected + 0.9], [0, PAPER_END - AMBER_U - 0.06], {...clamp, easing: editorial});
	return greys + amber + tail;
};
const amberReach = (t: number, c: ColdCues) => {
	// Starts as a line item inside the paper, then keeps running right, off the paper and out of frame.
	const p = interpolate(t, [c.expensive + 0.35, c.end + 0.6], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.75, 0.6)});
	return PX1 + p * 11;
};

const COLD_KEYS = (c: ColdCues): CamKey[] => [
	// Lead-in (no voice yet): a slow, linear drift in toward the meter framing, visible from frame 0.
	{t: 0, pos: [2.62, 1.44, 4.3], target: [0.72, 0.74, -0.5], fov: 34, range: 1.9, bokeh: 1.8},
	{t: Math.max(c.lead, 0.3), pos: [2.25, 1.3, 3.75], target: [0.78, 0.72, -0.55], fov: 34, range: 1.8, bokeh: 1.9, linear: true},
	{t: c.logs, pos: [2.15, 1.27, 3.55], target: [0.8, 0.72, -0.58], fov: 34, range: 1.7, bokeh: 1.9},
	{t: c.logs + 0.95, pos: [0.95, 2.1, 3.7], target: [-0.35, 0.3, 0.1], fov: 34, range: 1.6, bokeh: 2.0},
	{t: c.logs + 1.9, pos: [-0.42, 2.05, 2.8], target: [-1.3, 0.0, 0.62], fov: 34, range: 1.1, bokeh: 2.5},
	{t: c.expensive, pos: [-0.5, 1.95, 2.7], target: [-1.32, 0.0, 0.72], fov: 34, range: 1.05, bokeh: 2.5},
	{t: c.expected + 0.6, pos: [0.7, 3.0, 3.95], target: [-0.05, 0.1, 0.35], fov: 38, range: 2.6, bokeh: 1.5},
	{t: c.end, pos: [0.8, 3.06, 4.05], target: [0.02, 0.1, 0.35], fov: 38, range: 2.8, bokeh: 1.4},
];

const ColdOpenWorld: React.FC<{t: number; c: ColdCues}> = ({t, c}) => {
	const P = printed(t, c);
	const reach = amberReach(t, c);
	const amberOnPaper = P > AMBER_U + 0.02;
	const amberZ = P - AMBER_U; // paper runs +z from the slot at z=0
	const amberGlow = 0.2 + 0.35 * ramp(t, c.expensive + 0.3, c.expected + 1.2);
	return (
		<group>
			{/* weekly meter */}
			{METER.map((v, i) => {
				const h = Math.max(0.002, (v / 100) * BAR_H * meterFill(t, c, i));
				const capped = v >= 99;
				return (
					<mesh key={i} position={[BAR_X(i), h / 2, BAR_Z]} castShadow receiveShadow>
						<boxGeometry args={[0.22, h, 0.22]} />
						<meshStandardMaterial color={capped ? '#5B605D' : '#D3CFC6'} roughness={0.55} metalness={0.05} />
					</mesh>
				);
			})}
			{Array.from({length: 22}, (_, k) => (
				<mesh key={`d${k}`} position={[BAR_X(0) - 0.2 + k * 0.1, BAR_H + 0.004, BAR_Z]} castShadow>
					<boxGeometry args={[0.06, 0.012, 0.012]} />
					<meshStandardMaterial color={GRAPHITE} roughness={0.5} />
				</mesh>
			))}
			{/* printer */}
			<mesh position={[PRINTER_X, 0.17, -0.39]} castShadow receiveShadow>
				<boxGeometry args={[1.0, 0.34, 0.78]} />
				<meshStandardMaterial color={GRAPHITE} roughness={0.45} metalness={0.15} />
			</mesh>
			<mesh position={[PRINTER_X, 0.345, -0.42]} castShadow>
				<boxGeometry args={[0.9, 0.02, 0.66]} />
				<meshStandardMaterial color="#3C403E" roughness={0.35} metalness={0.2} />
			</mesh>
			<mesh position={[PRINTER_X, 0.035, 0.002]}>
				<boxGeometry args={[0.74, 0.016, 0.006]} />
				<meshStandardMaterial color="#141615" roughness={0.6} />
			</mesh>
			{/* status light: slow idle pulse before the print, steady while printing */}
			<mesh position={[PRINTER_X + 0.4, 0.2, 0.004]}>
				<boxGeometry args={[0.05, 0.022, 0.006]} />
				<meshBasicMaterial color={hdr('#F4F6F2', t < c.logs ? 0.45 + 0.75 * (0.5 - 0.5 * Math.cos((t * 2 * Math.PI) / 1.6)) : 1.15)} toneMapped={false} />
			</mesh>
			{/* paper */}
			<mesh position={[PRINTER_X, 0.004, P / 2]} castShadow receiveShadow>
				<boxGeometry args={[PAPER_W, 0.003, Math.max(0.001, P)]} />
				<meshStandardMaterial color={PAPER} roughness={0.8} />
			</mesh>
			{RECEIPT.filter((l) => !l.amber && P > l.u + 0.02).map((l) => {
				const z = P - l.u;
				return (
					<group key={l.u}>
						<mesh position={[PX0 + l.item / 2, 0.0062, z]}>
							<boxGeometry args={[l.item, 0.0015, 0.02]} />
							<meshStandardMaterial color={LINE_GREY} roughness={0.8} />
						</mesh>
						<mesh position={[PX1 - 0.045, 0.0062, z]}>
							<boxGeometry args={[0.09, 0.0015, 0.02]} />
							<meshStandardMaterial color={LINE_GREY} roughness={0.8} />
						</mesh>
					</group>
				);
			})}
			{amberOnPaper && (
				<mesh position={[(PX0 + reach) / 2, 0.0068, amberZ]} castShadow>
					<boxGeometry args={[reach - PX0, 0.002, 0.07]} />
					<meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={amberGlow} roughness={0.7} toneMapped />
				</mesh>
			)}
		</group>
	);
};

export const ColdOpen3D: React.FC<{g: number; c: ColdCues; header: React.ReactNode}> = ({g, c, header}) => {
	const cam = cameraAt(COLD_KEYS(c), g);
	// The title clears completely before the email block enters (no two text stages overlap).
	const titleOut = 1 - ramp(g, c.email - 0.45, c.email - 0.05);
	const emailIn = ramp(g, c.email + 0.05, c.email + 0.6) * (1 - ramp(g, c.logs + 0.2, c.logs + 0.8));
	const strike = ramp(g, c.half, c.half + 0.5);
	const meterLabels = 1 - ramp(g, c.email + 1.0, c.email + 1.8);
	const tagP = ramp(g, c.priced, c.priced + 0.6) * (1 - ramp(g, c.expensive, c.expensive + 0.5));
	const paperTag = project(cam, new THREE.Vector3(PRINTER_X + PAPER_W / 2 + 0.05, 0.01, 0.5));
	return (
		<AbsoluteFill style={{background: PAPER_BG}}>
			<Stage3D camera={cam}>
				<ColdOpenWorld t={g} c={c} />
			</Stage3D>
			<Scrim opacity={Math.max(titleOut, emailIn)} />
			{/* meter labels, projected from the bars */}
			{METER.map((v, i) => {
				const p = rise(g, c.meter + i * 0.8 + 0.7, c.meter + i * 0.8 + 1.2) * meterLabels;
				const top = project(cam, new THREE.Vector3(BAR_X(i), (v / 100) * BAR_H + 0.1, BAR_Z));
				return (
					<div key={i} style={{position: 'absolute', left: top.x - 60, width: 120, top: top.y - 30, textAlign: 'center', fontFamily: mono, fontSize: 21, color: v >= 99 ? INK : MUTED, fontWeight: v >= 99 ? 700 : 400, ...settle(p)}}>
						{v}%
					</div>
				);
			})}
			{(() => {
				const cap = project(cam, new THREE.Vector3(BAR_X(5) + 0.2, BAR_H, BAR_Z));
				return (
					<>
						<Tag p={ramp(g, c.meter, c.meter + 0.6) * meterLabels} style={{left: cap.x + 16, top: cap.y - 12, color: INK}}>
							100% · WEEKLY LIMIT
						</Tag>
						<Tag p={ramp(g, c.meter + 0.3, c.meter + 0.9) * meterLabels * titleOut} color={INK2} style={{left: 112, top: 470}}>
							MY CODEX WEEKLY METER · SEPTEMBER · PRO ACCOUNT
						</Tag>
						<div style={{position: 'absolute', left: 112, top: 508, ...settle(ramp(g, c.hit, c.hit + 0.45) * titleOut)}}>
							<span style={{display: 'inline-block', border: `2px solid ${INK}`, padding: '6px 14px', fontFamily: mono, fontSize: 20, letterSpacing: 3, color: INK}}>5 OF 6 WEEKS AT 99–100%</span>
						</div>
					</>
				);
			})()}
			{/* frame-zero identity: title, promise, AARON GUO */}
			<div style={{position: 'absolute', left: 112, top: 104, width: 1000, opacity: titleOut}}>
				<div style={{fontFamily: mono, fontSize: 22, letterSpacing: 4, color: INK}}>AARON GUO · AI-NATIVE BUILDER</div>
				<div style={{fontFamily: serif, fontSize: 66, lineHeight: 1.12, color: INK, marginTop: 24, letterSpacing: -0.5}}>
					OpenAI Halved My $200 Plan.
					<br />
					So I Priced My Own AI Bill.
				</div>
				<div style={{fontFamily: sans, fontSize: 29, lineHeight: 1.4, color: INK2, marginTop: 22}}>One heavy user's 30-day AI coding bill, priced line by line at API list.</div>
			</div>
			{/* the email, in one line */}
			<div style={{position: 'absolute', left: 112, top: 118, width: 1150, opacity: emailIn}}>
				<div style={{fontFamily: mono, fontSize: 20, letterSpacing: 2, color: MUTED}}>FROM OPENAI · EMAIL TO PRO SUBSCRIBERS · 2026-09-29</div>
				<div style={{fontFamily: serif, fontSize: 58, lineHeight: 1.14, color: INK, marginTop: 18}}>From October 30, the same $200 buys half as much.</div>
				<div style={{marginTop: 22, fontFamily: mono, fontSize: 24, color: INK, display: 'flex', gap: 22}}>
					<span>PRO 200 · CODEX + CHATGPT WORK</span>
					<span style={{position: 'relative', color: strike > 0.5 ? MUTED : INK}}>
						20× PLUS
						<span style={{position: 'absolute', left: -3, top: '52%', height: 3, width: `${strike * 100}%`, background: INK, opacity: strike > 0 ? 1 : 0}} />
					</span>
					<span style={{fontWeight: 700, opacity: ramp(g, c.half + 0.3, c.half + 0.8)}}>10× PLUS</span>
				</div>
			</div>
			<Tag p={tagP} style={{left: paperTag.x + 18, top: paperTag.y - 10, color: INK2}}>
				30 DAYS · EVERY TOKEN · API LIST PRICE
			</Tag>
			<Tag p={ramp(g, c.email + 0.6, c.email + 1.2)} style={{left: 112, top: 868}}>
				CONCEPTUAL · NOT TO SCALE · METER VALUES FROM MY SESSION LOGS
			</Tag>
			{g > c.email + 0.3 ? header : null}
		</AbsoluteFill>
	);
};

// ================================================================= THE RE-READ
// A stack of context pages; each turn adds thin pages and an amber scan beam re-reads the whole
// stack bottom to top, so every sweep is longer. Then a time-lapse: turns accelerate, the stack grows.
const PAGE_T = 0.02;
const PAGE_X = 1.05;
const PAGE_Z = 1.46;
const BASE_PAGES = 14;
const SPEED = 9; // pages per second for the first, readable sweeps

export type RereadCues = {start: number; loop: number; ctx: number; tool: number; result: number; think: number; again: number; every: number; cache: number; volume: number; thirty: number; num: number; end: number};
type Turn = {drop: number; pages: number; beam: number; speed: number; height: number; n: number};

const buildTurns = (c: RereadCues) => {
	const turns: Turn[] = [];
	// Turn 1: tool call and result pages arrive on the spoken words; the first sweep on "every turn".
	let height = BASE_PAGES + 2;
	turns.push({drop: c.tool, pages: 2, beam: c.every, speed: SPEED, height, n: 1});
	let at = c.every + height / SPEED + 0.15;
	// Readable turns until "the volume is enormous": two pages drop, then a (longer) sweep.
	while (at + 0.4 < c.volume) {
		height += 2;
		turns.push({drop: at, pages: 2, beam: at + 0.4, speed: SPEED, height, n: turns.length + 1});
		at = at + 0.4 + height / SPEED + 0.15;
	}
	// Time-lapse: turns arrive faster and faster, sweeps speed up and overlap.
	let gap = 0.8;
	let k = 0;
	at = Math.max(at, c.volume + 0.1);
	while (at < c.end) {
		height += 2;
		const speed = Math.min(70, SPEED * (1 + 0.32 * k));
		turns.push({drop: at, pages: 2, beam: at + 0.12, speed, height, n: turns.length + 1});
		k += 1;
		gap = Math.max(0.075, gap * 0.85);
		at += gap;
	}
	return turns;
};

// Turn 1's second page (the result) lands on "read the result", not with the tool call.
const turn1ResultOffset = (c: RereadCues) => c.result - c.tool;

const RereadWorld: React.FC<{t: number; c: RereadCues; turns: Turn[]}> = ({t, c, turns}) => {
	const pages = useRef<THREE.InstancedMesh>(null);
	const glows = useRef<THREE.InstancedMesh>(null);
	const MAX = 260;
	const jitter = useMemo(() => {
		const rand = mulberry32(2026);
		return Array.from({length: MAX}, () => ({x: (rand() - 0.5) * 0.045, z: (rand() - 0.5) * 0.045, r: (rand() - 0.5) * 0.035}));
	}, []);
	const drops = useMemo(() => {
		// Explicit arrival time per page index beyond the base stack.
		const list: {index: number; at: number; dur: number}[] = [];
		let index = BASE_PAGES;
		for (const turn of turns) {
			for (let j = 0; j < turn.pages; j++) {
				const fast = turn.speed > SPEED;
				const at = turn.n === 1 ? (j === 0 ? turn.drop : turn.drop + turn1ResultOffset(c)) : turn.drop + j * (fast ? 0.03 : 0.16);
				list.push({index, at, dur: fast ? 0.12 : 0.35});
				index += 1;
			}
		}
		return list;
	}, [turns, c]);
	const count = BASE_PAGES + drops.filter((d) => t >= d.at).length;

	useLayoutEffect(() => {
		const m = new THREE.Matrix4();
		const q = new THREE.Quaternion();
		const e = new THREE.Euler();
		const pos = new THREE.Vector3();
		const scale = new THREE.Vector3(1, 1, 1);
		const glowScale = new THREE.Vector3(1.012, 1.35, 1.008);
		const color = new THREE.Color();
		const amber = hdr(AMBER, 1.3);
		const amberPaper = hdr('#DB7A24', 1.15);
		const base = new THREE.Color(CONTEXT_PAPER);
		const fresh = new THREE.Color(PAPER);
		const black = new THREE.Color(0, 0, 0);
		for (let i = 0; i < MAX; i++) {
			const drop = i >= BASE_PAGES ? drops[i - BASE_PAGES] : undefined;
			const p = drop ? Math.min(1, Math.max(0, (t - drop.at) / drop.dur)) : 1;
			const fall = (1 - entrance(p)) * 0.55;
			const j = jitter[i];
			pos.set(j.x, PAGE_T * (i + 0.5) + fall, j.z);
			e.set(0, j.r + (1 - p) * 0.25, 0);
			q.setFromEuler(e);
			scale.set(1, 1, 1);
			m.compose(pos, q, scale);
			pages.current!.setMatrixAt(i, m);
			// Glow: strongest where a beam passed most recently; decays over ~0.55 s.
			let heat = 0;
			for (const turn of turns) {
				if (t < turn.beam || i >= turn.height) continue;
				const passed = turn.beam + i / turn.speed;
				const dt = t - passed;
				if (dt < -0.05) continue;
				const h = dt < 0 ? 1 + dt / 0.05 : Math.exp(-dt / 0.55);
				if (h > heat) heat = h;
			}
			pages.current!.setColorAt(i, color.copy(i < BASE_PAGES ? base : fresh).lerp(amberPaper, 0.78 * Math.min(1, heat)));
			glowScale.set(1.03, 0.5, 1.022);
			m.compose(pos, q, glowScale);
			glows.current!.setMatrixAt(i, m);
			glows.current!.setColorAt(i, heat > 0.01 ? color.copy(amber).multiplyScalar(heat) : black);
		}
		pages.current!.count = count;
		glows.current!.count = count;
		pages.current!.instanceMatrix.needsUpdate = true;
		pages.current!.instanceColor!.needsUpdate = true;
		glows.current!.instanceMatrix.needsUpdate = true;
		glows.current!.instanceColor!.needsUpdate = true;
	}, [t, count, drops, turns, jitter]);

	// Active beams: a thin amber plane at the scan height of each sweep still in progress.
	const beams = turns
		.filter((turn) => t >= turn.beam && t <= turn.beam + turn.height / turn.speed + 0.05)
		.map((turn) => ({key: turn.n, y: Math.min(turn.height, (t - turn.beam) * turn.speed) * PAGE_T + 0.004}));

	return (
		<group>
			<instancedMesh ref={pages} args={[undefined, undefined, MAX]} castShadow receiveShadow frustumCulled={false}>
				<boxGeometry args={[PAGE_X, PAGE_T * 0.82, PAGE_Z]} />
				<meshStandardMaterial roughness={0.85} />
			</instancedMesh>
			<instancedMesh ref={glows} args={[undefined, undefined, MAX]} frustumCulled={false}>
				<boxGeometry args={[PAGE_X, PAGE_T * 0.82, PAGE_Z]} />
				<meshBasicMaterial transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
			</instancedMesh>
			{beams.map((b) => (
				<group key={b.key} position={[0, b.y, 0]}>
					<mesh rotation={[-Math.PI / 2, 0, 0]}>
						<planeGeometry args={[PAGE_X + 0.22, PAGE_Z + 0.22]} />
						<meshBasicMaterial color={hdr(AMBER, 1.2)} transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
					</mesh>
					{[
						[0, (PAGE_Z + 0.22) / 2, PAGE_X + 0.22, 0.012],
						[0, -(PAGE_Z + 0.22) / 2, PAGE_X + 0.22, 0.012],
					].map(([x, z, w, d], k) => (
						<mesh key={k} position={[x, 0, z]}>
							<boxGeometry args={[w, 0.006, d]} />
							<meshBasicMaterial color={hdr(AMBER, 3.2)} toneMapped={false} />
						</mesh>
					))}
				</group>
			))}
		</group>
	);
};

const REREAD_KEYS = (c: RereadCues): CamKey[] => [
	{t: c.start, pos: [3.0, 1.75, 3.35], target: [1.05, 0.3, 0.05], fov: 34, range: 1.3, bokeh: 2.4},
	{t: c.every, pos: [2.75, 1.6, 3.05], target: [1.0, 0.3, 0.05], fov: 34, range: 1.25, bokeh: 2.4},
	{t: c.volume, pos: [2.95, 1.8, 3.3], target: [1.05, 0.42, 0.05], fov: 34, range: 1.4, bokeh: 2.2},
	{t: c.num, pos: [5.3, 3.55, 6.9], target: [1.7, 1.35, 0.0], fov: 36, range: 2.9, bokeh: 1.5},
	{t: c.end, pos: [5.5, 3.7, 7.2], target: [1.75, 1.45, 0.0], fov: 36, range: 3.1, bokeh: 1.4},
];

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

export const Reread3D: React.FC<{g: number; c: RereadCues}> = ({g, c}) => {
	const turns = useMemo(() => buildTurns(c), [c]);
	const cam = cameraAt(REREAD_KEYS(c), g);
	const started = turns.filter((turn) => g >= turn.drop);
	const turnNo = g >= c.again ? Math.max(1, started.length) : 0;
	const reread = turns.reduce((sum, turn) => (g < turn.beam ? sum : sum + Math.min(turn.height, (g - turn.beam) * turn.speed)), 0);
	const steps: {at: number; text: string}[] = [
		{at: c.ctx, text: 'LOAD REPO CONTEXT'},
		{at: c.tool, text: 'CALL A TOOL'},
		{at: c.result, text: 'READ THE RESULT'},
		{at: c.think, text: 'THINK'},
		{at: c.again, text: 'GO AGAIN'},
	];
	const current = [...steps].reverse().find((s) => g >= s.at);
	const stepsOut = 1 - ramp(g, c.num - 0.6, c.num);
	const num = ramp(g, c.num, c.num + 0.8);
	const topPage = project(cam, new THREE.Vector3(PAGE_X / 2, (BASE_PAGES + 2) * PAGE_T, PAGE_Z / 2));
	const ctxPoint = project(cam, new THREE.Vector3(PAGE_X / 2, BASE_PAGES * 0.5 * PAGE_T, PAGE_Z / 2));
	const ctxP = ramp(g, c.ctx, c.ctx + 0.5) * (1 - ramp(g, c.every, c.every + 0.6));
	const newP = (at: number) => ramp(g, at + 0.2, at + 0.6) * (1 - ramp(g, at + 1.2, at + 1.6));
	return (
		<AbsoluteFill style={{background: PAPER_BG}}>
			<Stage3D camera={cam}>
				<RereadWorld t={g} c={c} turns={turns} />
			</Stage3D>
			<Scrim opacity={0.9} />
			<Scrim opacity={0.85} at="100% 40%" />
			<div style={{position: 'absolute', left: 112, top: 104, width: 1000}}>
				<div style={{fontFamily: serif, fontSize: 52, lineHeight: 1.14, color: INK, opacity: 1 - ramp(g, c.volume + 1.0, c.volume + 1.6)}}>An agent doesn't answer once.</div>
				<div style={{fontFamily: serif, fontSize: 52, lineHeight: 1.14, color: INK, ...settle(ramp(g, c.loop, c.loop + 0.5) * (1 - ramp(g, c.volume + 1.0, c.volume + 1.6)))}}>It runs a loop.</div>
			</div>
			{/* leader labels on the stack */}
			<div style={{opacity: ctxP}}>
				<div style={{position: 'absolute', left: ctxPoint.x + 6, top: ctxPoint.y - 1, width: 64, height: 2, background: INK, opacity: 0.7}} />
				<div style={{position: 'absolute', left: ctxPoint.x - 5, top: ctxPoint.y - 5, width: 10, height: 10, borderRadius: 5, background: INK}} />
				<Tag p={1} color={INK} style={{left: ctxPoint.x + 80, top: ctxPoint.y - 12}}>REPO CONTEXT</Tag>
			</div>
			{[
				{at: c.tool, text: 'TOOL CALL'},
				{at: c.result, text: 'RESULT'},
			].map((l) => (
				<Tag key={l.text} p={newP(l.at)} color={INK} style={{left: topPage.x + 24, top: topPage.y - 34}}>
					+ {l.text} PAGE
				</Tag>
			))}
			{/* the loop, as ledger rows; then the re-read */}
			<div style={{position: 'absolute', left: 1260, top: 250, width: 548, opacity: stepsOut}}>
				{steps.map((s) => {
					const p = ramp(g, s.at, s.at + 0.35);
					const on = current?.text === s.text && g < c.every;
					return (
						<div key={s.text} style={{fontFamily: mono, fontSize: 24, lineHeight: 1.85, letterSpacing: 1, color: on ? INK : MUTED, fontWeight: on ? 700 : 400, borderBottom: '1px solid #D9D5CC', ...settle(p)}}>
							{s.text}
						</div>
					);
				})}
				<div style={{marginTop: 26, fontFamily: mono, fontSize: 23, lineHeight: 1.5, letterSpacing: 1, color: AMBER, fontWeight: 700, ...settle(ramp(g, c.every, c.every + 0.5))}}>EVERY TURN · RE-READ THE WHOLE STACK</div>
				<div style={{marginTop: 14, fontFamily: mono, fontSize: 21, lineHeight: 1.5, color: INK2, ...settle(ramp(g, c.cache, c.cache + 0.5))}}>CACHED · EACH RE-READ IS CHEAPER THAN FRESH INPUT</div>
				<div style={{marginTop: 10, fontFamily: mono, fontSize: 22, lineHeight: 1.5, color: INK, fontWeight: 700, ...settle(ramp(g, c.volume, c.volume + 0.5))}}>BUT THE VOLUME IS ENORMOUS</div>
			</div>
			{/* the data point: resolves over the grown stack */}
			<div style={{position: 'absolute', left: 1100, top: 330, width: 720, ...settle(num)}}>
				<div style={{fontFamily: mono, fontSize: 22, letterSpacing: 2, color: INK}}>CLAUDE CODE · 30 DAYS · READ FROM CACHE</div>
				<div style={{fontFamily: serif, fontSize: 132, lineHeight: 1.1, color: AMBER, marginTop: 10, whiteSpace: 'nowrap'}}>≈ 17 billion</div>
				<div style={{fontFamily: sans, fontSize: 36, color: INK, marginTop: 6}}>tokens re-read from cache</div>
				<div style={{fontFamily: mono, fontSize: 17, letterSpacing: 2, color: MUTED, marginTop: 18}}>ONE MACHINE · FROM MY SESSION LOGS</div>
			</div>
			{/* conceptual readout */}
			<div style={{position: 'absolute', right: 112, top: 84, textAlign: 'right', fontFamily: mono, fontSize: 19, letterSpacing: 2, color: INK2, ...settle(ramp(g, c.again, c.again + 0.4))}}>
				TURN {String(turnNo).padStart(3, '0')} · PAGES RE-READ SO FAR {fmt(reread)}
				<div style={{fontSize: 15, color: MUTED, marginTop: 6, opacity: ramp(g, c.volume, c.volume + 0.4)}}>TIME-LAPSE ›››</div>
			</div>
			<Tag p={ramp(g, c.start + 0.3, c.start + 0.9)} style={{left: 112, top: 868}}>
				CONCEPTUAL · NOT TO SCALE · AMBER = THE RE-READ (CACHE READS)
			</Tag>
		</AbsoluteFill>
	);
};
