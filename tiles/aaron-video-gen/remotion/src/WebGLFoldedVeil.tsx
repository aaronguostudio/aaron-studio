import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, Mesh, Plane, Program, Renderer, Transform, Triangle, Vec3 } from "ogl";
import type { AudioAnalysis, AudioAnalysisFrame } from "./MusicVisualizer";

/**
 * A single asymmetric textile sculpture. The camera and silhouette are fixed;
 * only the light inside the folds changes with the precomputed music analysis.
 */
export type WebGLFoldedVeilProps = {
  audioAnalysis?: AudioAnalysis;
  durationSec: number;
  seed?: number;
};

export const defaultWebGLFoldedVeilProps: WebGLFoldedVeilProps = {
  durationSec: 16,
  seed: 4418,
};

type Signal = Pick<AudioAnalysisFrame, "calmEnergy" | "calmHigh" | "calmLow" | "flux" | "low">;
type Impact = { strength: number; time: number };

const BACKGROUND_VERTEX = `
precision highp float;
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const BACKGROUND_FRAGMENT = `
precision highp float;
uniform vec3 iResolution;
uniform float uEnergy;
uniform float uTime;
varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 p = (vUv - 0.5) * vec2(iResolution.x / max(iResolution.y, 1.0), 1.0);
  float left = exp(-dot((p - vec2(-0.44, 0.08)) / vec2(0.92, 0.96), (p - vec2(-0.44, 0.08)) / vec2(0.92, 0.96)) * 2.2);
  float right = exp(-dot((p - vec2(0.52, -0.14)) / vec2(0.88, 0.80), (p - vec2(0.52, -0.14)) / vec2(0.88, 0.80)) * 2.5);
  vec3 color = vec3(0.0024, 0.0033, 0.0080);
  color += vec3(0.004, 0.013, 0.029) * left;
  color += vec3(0.012, 0.003, 0.023) * right;
  color += (hash21(gl_FragCoord.xy + vec2(uTime * 0.17, -uTime * 0.11)) - 0.5) * 0.005;
  color = 1.0 - exp(-color * (1.24 + uEnergy * 0.08));
  gl_FragColor = vec4(max(color, 0.0), 1.0);
}`;

const VEIL_VERTEX = `
precision highp float;
attribute vec3 position;
attribute vec2 uv;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
varying float vFold;
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vec3 p = position;
  float broadA = sin(p.y * 2.35 + p.x * 1.26 + 0.50);
  float broadB = sin(p.y * 4.80 - p.x * 2.55 - 1.10);
  float narrow = sin(p.y * 9.60 + p.x * 3.80 + 0.70);
  p.z += broadA * 0.42 + broadB * 0.14 + narrow * 0.045;
  p.x += sin(p.y * 2.15 - 0.25) * 0.30 + broadB * 0.075;
  p.y += sin(p.x * 2.8 + p.y * 2.1) * 0.065;
  // The mesh itself barely evolves; this prevents a frozen CG card while
  // preserving a stable sculptural silhouette.
  p.z += sin(p.y * 5.1 + p.x * 2.4 + uTime * 0.085) * 0.018;
  vFold = broadA * 0.62 + broadB * 0.27 + narrow * 0.11;
  vUv = uv;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorldPosition = world.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const VEIL_FRAGMENT = `
precision highp float;
uniform vec3 cameraPosition;
uniform float uEnergy;
uniform float uHigh;
uniform float uImpactAge;
uniform float uImpactStrength;
uniform float uLow;
uniform float uTime;
varying float vFold;
varying vec2 vUv;
varying vec3 vWorldPosition;

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

void main() {
  float y = vUv.y - 0.5;
  float centerline = sin(y * 5.4 - 0.9) * 0.052 + sin(y * 11.5 + 0.4) * 0.020;
  float taper = smoothstep(0.50, 0.09, abs(y));
  float breadth = (0.105 + taper * 0.205) * (0.86 + 0.14 * sin(y * 9.2 + 1.0));
  float lateral = abs(vUv.x - 0.5 - centerline);
  float silhouette = 1.0 - smoothstep(breadth - 0.006, breadth + 0.022, lateral);
  float top = smoothstep(0.006, 0.070, vUv.y);
  float bottom = 1.0 - smoothstep(0.930, 0.994, vUv.y);
  float mask = silhouette * top * bottom;
  if (mask < 0.012) discard;

  // A hand-shaped normal approximation makes the folds read as textile rather
  // than as a flat gradient, without relying on platform-sensitive derivatives.
  float normalX = cos(vWorldPosition.y * 2.35 + vWorldPosition.x * 1.26) * 0.40 + cos(vWorldPosition.y * 4.8 - vWorldPosition.x * 2.55) * 0.17;
  float normalY = sin(vWorldPosition.y * 5.3 + vWorldPosition.x * 1.7) * 0.15;
  vec3 normal = normalize(vec3(normalX, normalY, 0.88));
  vec3 view = normalize(cameraPosition - vWorldPosition);
  vec3 key = normalize(vec3(-2.2, 2.8, 3.0) - vWorldPosition);
  vec3 fill = normalize(vec3(2.8, -0.4, 2.1) - vWorldPosition);
  float keyDiffuse = max(dot(normal, key), 0.0);
  float fillDiffuse = max(dot(normal, fill), 0.0);
  float fresnel = pow(1.0 - max(dot(normal, view), 0.0), 2.7);
  float silkSpecular = pow(max(dot(reflect(-key, normal), view), 0.0), 78.0);

  float grain = noise(vUv * vec2(9.0, 16.0) + vec2(uTime * 0.028, -uTime * 0.043));
  float weave = 0.5 + 0.5 * sin(vUv.y * 16.0 - vUv.x * 4.5 + vFold * 4.0 + uTime * 0.26);
  float seam = pow(max(0.0, sin(vUv.y * 25.0 + vUv.x * 8.4 + vFold * 7.0 - uTime * 0.17)), 14.0);
  vec3 indigo = vec3(0.055, 0.19, 0.56);
  vec3 violet = vec3(0.62, 0.12, 0.83);
  vec3 coral = vec3(1.0, 0.25, 0.32);
  vec3 pearl = vec3(0.76, 0.93, 1.0);
  vec3 pigment = mix(indigo, violet, weave * 0.78 + grain * 0.16);
  pigment = mix(pigment, coral, smoothstep(0.68, 0.96, grain) * 0.35);

  // A strong low transient becomes a single diagonal refraction travelling
  // through the existing folds; the textile never scales, shakes, or drifts.
  float progress = clamp(uImpactAge / 1.82, 0.0, 1.0);
  float passY = mix(-0.18, 1.18, progress);
  float passCurve = passY + (vUv.x - 0.5) * 0.24 + sin(vUv.x * 8.0) * 0.018;
  float impactFade = smoothstep(0.0, 0.10, uImpactAge) * (1.0 - smoothstep(1.42, 1.82, uImpactAge));
  float refraction = exp(-pow((vUv.y - passCurve) / 0.048, 2.0)) * uImpactStrength * impactFade;

  float density = 0.13 + uLow * 0.12;
  float internalLight = 0.10 + uEnergy * 0.16;
  vec3 color = pigment * (density + keyDiffuse * 0.46 + fillDiffuse * 0.15);
  color += pigment * internalLight * (0.44 + weave * 0.56);
  color += pearl * silkSpecular * (0.52 + uHigh * 0.23);
  color += mix(indigo, violet, weave) * fresnel * (0.34 + uHigh * 0.12);
  color += mix(violet, coral, weave) * seam * (0.06 + uHigh * 0.13);
  color += mix(pearl, coral, weave) * refraction * 0.82;
  color = 1.0 - exp(-color * (1.46 + uEnergy * 0.10));
  gl_FragColor = vec4(max(color, 0.0), mask * (0.80 + fresnel * 0.12));
}`;

type Runtime = {
  backgroundProgram: Program;
  camera: Camera;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  renderer: Renderer;
  scene: Transform;
  veilProgram: Program;
};

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));
const lerp = (left: number, right: number, amount: number): number => left + (right - left) * amount;

const signalAt = (analysis: AudioAnalysis | undefined, frame: number, fps: number): Signal => {
  const fallback: Signal = { calmEnergy: 0.42, calmHigh: 0.32, calmLow: 0.40, flux: 0.20, low: 0.42 };
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
    if (!isPeak || current.flux < 0.62 || current.low < 0.52 || current.t - lastImpact < 2.15) continue;
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

export const WebGLFoldedVeil: React.FC<WebGLFoldedVeilProps> = ({ audioAnalysis, seed = 4418 }) => {
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
    gl.clearColor(0.0024, 0.0033, 0.0080, 1);
    const scene = new Transform();
    const camera = new Camera(gl, { aspect: width / Math.max(height, 1), far: 20, fov: 42, near: 0.1 });
    camera.position.set(0, 0.04, 5.15);
    camera.lookAt([0, 0.05, 0]);

    const backgroundProgram = new Program(gl, {
      vertex: BACKGROUND_VERTEX,
      fragment: BACKGROUND_FRAGMENT,
      cullFace: null,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        iResolution: { value: new Vec3(width, height, width / Math.max(height, 1)) },
        uEnergy: { value: 0.42 },
        uTime: { value: 0 },
      },
    });
    const background = new Mesh(gl, { frustumCulled: false, geometry: new Triangle(gl), program: backgroundProgram });
    background.setParent(scene);

    const veilProgram = new Program(gl, {
      vertex: VEIL_VERTEX,
      fragment: VEIL_FRAGMENT,
      cullFace: null,
      depthTest: true,
      depthWrite: true,
      transparent: true,
      uniforms: {
        uEnergy: { value: 0.42 },
        uHigh: { value: 0.32 },
        uImpactAge: { value: 3 },
        uImpactStrength: { value: 0 },
        uLow: { value: 0.40 },
        uTime: { value: 0 },
      },
    });
    const veil = new Mesh(gl, {
      geometry: new Plane(gl, { height: 2.70, heightSegments: 168, width: 2.50, widthSegments: 168 }),
      program: veilProgram,
      renderOrder: 1,
    });
    veil.rotation.set(-0.06, -0.38, 0.045);
    veil.position.set(-0.04, 0.03, 0);
    veil.setParent(scene);

    renderer.setSize(width, height);
    Object.assign(gl.canvas.style, { display: "block", height: "100%", left: "0", position: "absolute", top: "0", width: "100%" });
    host.appendChild(gl.canvas);
    runtimeRef.current = { backgroundProgram, camera, gl, renderer, scene, veilProgram };

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
    runtime.backgroundProgram.uniforms.uEnergy.value = 0.20 + signal.calmEnergy * 0.72;
    runtime.backgroundProgram.uniforms.uTime.value = time + seed * 0.00013;
    runtime.veilProgram.uniforms.uEnergy.value = 0.20 + signal.calmEnergy * 0.72;
    runtime.veilProgram.uniforms.uHigh.value = 0.12 + signal.calmHigh * 0.76;
    runtime.veilProgram.uniforms.uLow.value = 0.18 + signal.calmLow * 0.74;
    runtime.veilProgram.uniforms.uImpactAge.value = impact.age;
    runtime.veilProgram.uniforms.uImpactStrength.value = impact.strength;
    runtime.veilProgram.uniforms.uTime.value = time + seed * 0.00013;
    runtime.renderer.render({ camera: runtime.camera, scene: runtime.scene, sort: false });
  }, [fps, frame, impacts, seed, signal.calmEnergy, signal.calmHigh, signal.calmLow]);

  return (
    <AbsoluteFill style={{ background: "#010208", overflow: "hidden" }}>
      <div ref={hostRef} style={{ bottom: 0, left: 0, overflow: "hidden", position: "absolute", right: 0, top: 0 }} />
    </AbsoluteFill>
  );
};
