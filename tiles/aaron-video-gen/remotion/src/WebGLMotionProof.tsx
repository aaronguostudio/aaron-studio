import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Mesh, Program, Renderer, Triangle, Vec3 } from "ogl";
import type { AudioAnalysis, AudioAnalysisFrame } from "./MusicVisualizer";

/**
 * A compact motion proof for the Visual And Sound pipeline.
 *
 * The spatial composition is fixed. All visible movement is contained in the
 * optical field: long material currents plus infrequent, audio-triggered
 * refraction passes. This is deliberately not a beat-synced equalizer.
 */
export type WebGLMotionProofProps = {
  audioAnalysis?: AudioAnalysis;
  durationSec: number;
  seed?: number;
};

export const defaultWebGLMotionProofProps: WebGLMotionProofProps = {
  durationSec: 12,
  seed: 1204,
};

type MotionSignal = Pick<AudioAnalysisFrame, "calmEnergy" | "calmHigh" | "calmLow" | "flux" | "low">;
type Impact = { strength: number; time: number };

const VERT = `
precision highp float;
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;

uniform vec3 iResolution;
uniform float uEnergy;
uniform float uHigh;
uniform float uImpactAge;
uniform float uImpactStrength;
uniform float uLow;
uniform float uTime;
varying vec2 vUv;

mat2 rotate2d(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.52;
  for (int index = 0; index < 5; index += 1) {
    value += noise(p) * amplitude;
    p = rotate2d(0.53) * p * 2.02 + vec2(9.2, -6.4);
    amplitude *= 0.49;
  }
  return value;
}

float roundedBox(vec2 p, vec2 extent, float radius) {
  vec2 q = abs(p) - extent + radius;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
}

float softLight(vec2 p, vec2 center, vec2 scale) {
  vec2 q = (p - center) / scale;
  return exp(-dot(q, q) * 2.0);
}

void main() {
  vec2 p = (vUv - 0.5) * vec2(iResolution.x / max(iResolution.y, 1.0), 1.0);
  vec3 color = vec3(0.003, 0.005, 0.013);

  // Static spatial architecture: two offset panes form the depth relationship.
  vec2 rearPoint = rotate2d(-0.14) * (p - vec2(0.05, 0.035));
  float rearSdf = roundedBox(rearPoint, vec2(0.58, 0.27), 0.13);
  float rear = 1.0 - smoothstep(-0.028, 0.028, rearSdf);
  float rearEdge = exp(-pow(rearSdf / 0.018, 2.0));
  vec2 frontPoint = rotate2d(0.075) * (p - vec2(-0.025, -0.025));
  float frontSdf = roundedBox(frontPoint, vec2(0.68, 0.32), 0.16);
  float front = 1.0 - smoothstep(-0.024, 0.024, frontSdf);
  float frontEdge = exp(-pow(frontSdf / 0.014, 2.0));

  // The environment stays quiet and spacious while the panes carry the action.
  color += vec3(0.010, 0.056, 0.094) * softLight(p, vec2(-0.50, 0.14), vec2(1.12, 0.94));
  color += vec3(0.065, 0.020, 0.105) * softLight(p, vec2(0.50, -0.10), vec2(1.06, 0.82));
  color += vec3(0.020, 0.011, 0.060) * softLight(p, vec2(0.06, 0.54), vec2(0.90, 0.58));

  float rearFlow = fbm(rearPoint * 1.55 + vec2(-uTime * 0.10, uTime * 0.065));
  vec3 rearColor = mix(vec3(0.12, 0.18, 0.42), vec3(0.36, 0.12, 0.55), rearFlow);
  color += rearColor * rear * (0.045 + uLow * 0.075);
  color += vec3(0.20, 0.64, 0.96) * rearEdge * (0.055 + uHigh * 0.065);

  // One long, readable material current moves through a fixed object. It is a
  // continuous optical process, not a moving object, camera, line field, or orb.
  vec2 currentPoint = frontPoint + vec2(
    (fbm(frontPoint * 1.2 + vec2(uTime * 0.075, -uTime * 0.04)) - 0.5) * 0.22,
    (fbm(frontPoint * 1.7 + vec2(-uTime * 0.055, uTime * 0.095)) - 0.5) * 0.12
  );
  float current = fbm(currentPoint * 2.25 + vec2(uTime * 0.34, -uTime * 0.22));
  float tide = 0.5 + 0.5 * sin(currentPoint.x * 3.1 + currentPoint.y * 2.0 + uTime * 0.68);
  float filament = pow(max(0.0, sin(currentPoint.x * 7.0 - currentPoint.y * 4.8 + uTime * 0.46)), 13.0);
  vec3 cyan = vec3(0.06, 0.92, 1.0);
  vec3 violet = vec3(0.74, 0.16, 1.0);
  vec3 ember = vec3(1.0, 0.30, 0.18);
  vec3 material = mix(cyan, violet, current);
  material = mix(material, ember, smoothstep(0.70, 1.0, tide) * (0.12 + uHigh * 0.24));
  float depth = 0.07 + uLow * 0.13;
  float luminance = 0.07 + uEnergy * 0.13;
  float rippleY = sin(frontPoint.x * 4.2 + current * 3.3 + uTime * 0.74) * 0.115;
  float caustic = exp(-pow((frontPoint.y - rippleY) / 0.030, 2.0)) * (0.32 + tide * 0.68);
  float softWake = exp(-pow((frontPoint.y - rippleY) / 0.115, 2.0)) * (0.14 + current * 0.16);
  color += material * front * (depth + luminance * (0.34 + tide * 0.28));
  color += mix(cyan, violet, tide) * front * softWake * (0.07 + uEnergy * 0.13);
  color += mix(cyan, ember, tide) * front * caustic * (0.20 + uEnergy * 0.34);
  color += mix(cyan, violet, tide) * front * filament * (0.045 + uHigh * 0.125);
  color += material * frontEdge * (0.095 + uHigh * 0.14);

  // Strong low-frequency events receive a 1.8s refractive pass across the
  // interior. The pass is broad and contained—no outline, scale, translation,
  // screen shake, or repeated circular pulse.
  float progress = clamp(uImpactAge / 1.82, 0.0, 1.0);
  float passX = mix(-0.78, 0.78, progress);
  float passWidth = 0.115 + (1.0 - uHigh) * 0.065;
  float pressure = exp(-pow((frontPoint.x - passX) / passWidth, 2.0));
  float wake = exp(-pow((frontPoint.x - (passX - 0.24)) / 0.31, 2.0));
  float impactFade = smoothstep(0.0, 0.10, uImpactAge) * (1.0 - smoothstep(1.40, 1.82, uImpactAge));
  float impact = uImpactStrength * impactFade;
  color += mix(cyan, ember, tide) * front * pressure * impact * 1.12;
  color += material * front * wake * impact * 0.26;

  float grain = hash21(gl_FragCoord.xy + vec2(uTime * 0.17, -uTime * 0.11)) - 0.5;
  color += grain * 0.008;
  color = 1.0 - exp(-color * (1.30 + uEnergy * 0.26));
  gl_FragColor = vec4(max(color, 0.0), 1.0);
}`;

type Runtime = {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  program: Program;
  renderer: Renderer;
  scene: Mesh;
};

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));
const lerp = (left: number, right: number, amount: number): number => left + (right - left) * amount;

const signalAt = (analysis: AudioAnalysis | undefined, frame: number, fps: number): MotionSignal => {
  const fallback: MotionSignal = { calmEnergy: 0.44, calmHigh: 0.36, calmLow: 0.42, flux: 0.2, low: 0.42 };
  if (!analysis?.frames?.length) return fallback;
  const position = (frame * analysis.fps) / fps;
  const lowerIndex = Math.max(0, Math.min(analysis.frames.length - 1, Math.floor(position)));
  const upperIndex = Math.max(0, Math.min(analysis.frames.length - 1, lowerIndex + 1));
  const amount = clamp01(position - lowerIndex);
  const lower = analysis.frames[lowerIndex] ?? fallback;
  const upper = analysis.frames[upperIndex] ?? lower;
  return {
    calmEnergy: lerp(lower.calmEnergy, upper.calmEnergy, amount),
    calmHigh: lerp(lower.calmHigh, upper.calmHigh, amount),
    calmLow: lerp(lower.calmLow, upper.calmLow, amount),
    flux: lerp(lower.flux, upper.flux, amount),
    low: lerp(lower.low, upper.low, amount),
  };
};

const buildImpacts = (analysis: AudioAnalysis | undefined): Impact[] => {
  if (!analysis?.frames?.length) return [];
  const impacts: Impact[] = [];
  let lastImpact = -Infinity;
  for (let index = 1; index < analysis.frames.length - 1; index += 1) {
    const previous = analysis.frames[index - 1];
    const current = analysis.frames[index];
    const next = analysis.frames[index + 1];
    const isPeak = current.flux >= previous.flux && current.flux > next.flux;
    const qualifies = isPeak && current.flux >= 0.62 && current.low >= 0.52;
    if (!qualifies || current.t - lastImpact < 2.15) continue;
    impacts.push({
      strength: clamp01((current.flux - 0.54) / 0.30) * (0.54 + current.low * 0.46),
      time: current.t,
    });
    lastImpact = current.t;
  }
  return impacts;
};

const impactAt = (impacts: Impact[], time: number): { age: number; strength: number } => {
  for (let index = impacts.length - 1; index >= 0; index -= 1) {
    const impact = impacts[index];
    const age = time - impact.time;
    if (age >= 0 && age <= 1.82) return { age, strength: impact.strength };
    if (age > 1.82) break;
  }
  return { age: 3, strength: 0 };
};

export const WebGLMotionProof: React.FC<WebGLMotionProofProps> = ({ audioAnalysis, seed = 1204 }) => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const signal = signalAt(audioAnalysis, frame, fps);
  const impacts = React.useMemo(() => buildImpacts(audioAnalysis), [audioAnalysis]);
  const hostRef = React.useRef<HTMLDivElement>(null);
  const runtimeRef = React.useRef<Runtime | null>(null);

  React.useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const renderer = new Renderer({ alpha: false, antialias: true, dpr: 1, premultipliedAlpha: false, preserveDrawingBuffer: true });
    const gl = renderer.gl;
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      cullFace: null,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        iResolution: { value: new Vec3(width, height, width / Math.max(height, 1)) },
        uEnergy: { value: 0.44 },
        uHigh: { value: 0.36 },
        uImpactAge: { value: 3 },
        uImpactStrength: { value: 0 },
        uLow: { value: 0.42 },
        uTime: { value: 0 },
      },
    });
    const scene = new Mesh(gl, { geometry: new Triangle(gl), program });
    renderer.setSize(width, height);
    Object.assign(gl.canvas.style, { display: "block", height: "100%", left: "0", position: "absolute", top: "0", width: "100%" });
    host.appendChild(gl.canvas);
    runtimeRef.current = { gl, program, renderer, scene };

    return () => {
      runtimeRef.current = null;
      if (gl.canvas.parentNode === host) host.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [height, seed, width]);

  React.useLayoutEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    const time = frame / fps;
    const impact = impactAt(impacts, time);
    runtime.program.uniforms.uEnergy.value = 0.20 + signal.calmEnergy * 0.72;
    runtime.program.uniforms.uHigh.value = 0.14 + signal.calmHigh * 0.76;
    runtime.program.uniforms.uLow.value = 0.18 + signal.calmLow * 0.74;
    runtime.program.uniforms.uImpactAge.value = impact.age;
    runtime.program.uniforms.uImpactStrength.value = impact.strength;
    runtime.program.uniforms.uTime.value = time + seed * 0.00017;
    runtime.renderer.render({ scene: runtime.scene });
  }, [fps, frame, impacts, seed, signal.calmEnergy, signal.calmHigh, signal.calmLow]);

  return (
    <AbsoluteFill style={{ background: "#02030a", overflow: "hidden" }}>
      <div ref={hostRef} style={{ bottom: 0, left: 0, overflow: "hidden", position: "absolute", right: 0, top: 0 }} />
    </AbsoluteFill>
  );
};
