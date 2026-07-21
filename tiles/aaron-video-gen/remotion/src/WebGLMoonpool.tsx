import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Mesh, Program, Renderer, Triangle, Vec3 } from "ogl";
import type { AudioAnalysis, AudioAnalysisFrame } from "./MusicVisualizer";

/**
 * Moonpool is a still, gallery-like object: an obsidian basin carrying a
 * shallow iridescent liquid surface. It is intentionally one object rather
 * than a collection of animated UI panels or a beat-driven visualizer.
 */
export type WebGLMoonpoolProps = {
  audioAnalysis?: AudioAnalysis;
  durationSec: number;
  seed?: number;
};

export const defaultWebGLMoonpoolProps: WebGLMoonpoolProps = {
  durationSec: 16,
  seed: 2841,
};

type Signal = Pick<AudioAnalysisFrame, "calmEnergy" | "calmHigh" | "calmLow" | "flux" | "low">;
type Impact = { strength: number; time: number };

const VERTEX = `
precision highp float;
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT = `
precision highp float;

uniform vec3 iResolution;
uniform float uEnergy;
uniform float uHigh;
uniform float uImpactAge;
uniform float uImpactStrength;
uniform float uLow;
uniform float uTime;
varying vec2 vUv;

const float FAR = 8.0;
const float EPS = 0.0015;

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
  float amplitude = 0.55;
  for (int index = 0; index < 4; index += 1) {
    value += noise(p) * amplitude;
    p = rotate2d(0.52) * p * 2.03 + vec2(8.1, -5.6);
    amplitude *= 0.48;
  }
  return value;
}

float sdTorus(vec3 p, vec2 torus) {
  vec2 q = vec2(length(p.xz) - torus.x, p.y);
  return length(q) - torus.y;
}

// The horizontal scale makes a physical oval basin, not a UI card.
float basinSdf(vec3 point) {
  vec3 p = point;
  p.x /= 1.32;
  return sdTorus(p, vec2(0.84, 0.108));
}

float marchBasin(vec3 ro, vec3 rd) {
  float travel = 0.0;
  for (int index = 0; index < 72; index += 1) {
    float distance = basinSdf(ro + rd * travel);
    if (distance < EPS || travel > FAR) break;
    travel += distance * 0.78;
  }
  return travel;
}

vec3 basinNormal(vec3 point) {
  vec2 epsilon = vec2(EPS, 0.0);
  return normalize(vec3(
    basinSdf(point + epsilon.xyy) - basinSdf(point - epsilon.xyy),
    basinSdf(point + epsilon.yxy) - basinSdf(point - epsilon.yxy),
    basinSdf(point + epsilon.yyx) - basinSdf(point - epsilon.yyx)
  ));
}

float poolRadius(vec3 point) {
  return length(vec2(point.x / 1.32, point.z));
}

float waterHeight(vec2 point) {
  vec2 drift = vec2(uTime * 0.058, -uTime * 0.036);
  float broad = fbm(point * 1.45 + drift);
  float fine = fbm(point * 3.15 - drift * 1.5);
  float fold = sin(point.x * 4.6 + point.y * 3.1 + uTime * 0.34) * 0.5 + 0.5;
  return (broad - 0.5) * 0.018 + (fine - 0.5) * 0.006 + (fold - 0.5) * 0.0045;
}

vec3 waterNormal(vec2 point) {
  float epsilon = 0.006;
  float hx = waterHeight(point + vec2(epsilon, 0.0)) - waterHeight(point - vec2(epsilon, 0.0));
  float hz = waterHeight(point + vec2(0.0, epsilon)) - waterHeight(point - vec2(0.0, epsilon));
  return normalize(vec3(-hx / (epsilon * 2.0), 1.0, -hz / (epsilon * 2.0)));
}

void main() {
  vec2 screen = (vUv - 0.5) * vec2(iResolution.x / max(iResolution.y, 1.0), 1.0);

  // A fixed gallery camera and low-key atmosphere hold the composition still.
  vec3 ro = vec3(0.0, 1.34, 3.12);
  vec3 target = vec3(0.0, -0.025, 0.0);
  vec3 forward = normalize(target - ro);
  vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
  vec3 up = normalize(cross(right, forward));
  vec3 rd = normalize(forward * 1.65 + right * screen.x + up * screen.y);

  vec3 color = vec3(0.0025, 0.0040, 0.0090);
  float atmosphereA = exp(-dot((screen - vec2(-0.28, 0.08)) / vec2(1.18, 0.84), (screen - vec2(-0.28, 0.08)) / vec2(1.18, 0.84)) * 2.1);
  float atmosphereB = exp(-dot((screen - vec2(0.48, -0.12)) / vec2(1.08, 0.72), (screen - vec2(0.48, -0.12)) / vec2(1.08, 0.72)) * 2.2);
  color += vec3(0.004, 0.016, 0.035) * atmosphereA;
  color += vec3(0.019, 0.006, 0.034) * atmosphereB;

  float basinTravel = marchBasin(ro, rd);
  bool basinHit = basinTravel < FAR;

  // Intersect a shallow liquid surface independently, then choose the first
  // physically visible surface. Its silhouette is constrained by the basin.
  float waterTravel = (-ro.y) / rd.y;
  vec3 waterPoint = ro + rd * waterTravel;
  float waterRadial = poolRadius(waterPoint);
  bool waterHit = waterTravel > 0.0 && waterRadial < 0.798 && waterTravel < basinTravel;

  vec3 view = normalize(ro - (waterHit ? waterPoint : ro + rd * basinTravel));
  vec3 keyLight = normalize(vec3(-2.2, 3.1, 1.6));
  vec3 coolLight = normalize(vec3(2.0, 1.2, -2.4));
  vec3 warmLight = normalize(vec3(0.0, 2.4, -1.6));
  vec3 cyan = vec3(0.04, 0.78, 1.0);
  vec3 violet = vec3(0.60, 0.12, 0.90);
  vec3 rose = vec3(1.0, 0.27, 0.36);
  vec3 ivory = vec3(1.0, 0.83, 0.70);

  if (waterHit) {
    vec2 poolPoint = vec2(waterPoint.x / 1.32, waterPoint.z);
    vec3 normal = waterNormal(poolPoint);
    float energy = clamp(uEnergy, 0.0, 1.0);
    float low = clamp(uLow, 0.0, 1.0);
    float high = clamp(uHigh, 0.0, 1.0);
    float field = fbm(poolPoint * 1.60 + vec2(uTime * 0.055, -uTime * 0.037));
    float pearl = 0.5 + 0.5 * sin(poolPoint.x * 4.4 - poolPoint.y * 3.0 + field * 4.0 + uTime * 0.22);
    float vein = pow(max(0.0, sin(poolPoint.x * 8.3 + poolPoint.y * 6.0 + field * 5.6 - uTime * 0.42)), 18.0);
    vec3 liquid = mix(cyan, violet, pearl);
    liquid = mix(liquid, rose, smoothstep(0.68, 1.0, field) * 0.36);
    float keySpecular = pow(max(dot(reflect(-keyLight, normal), view), 0.0), 112.0);
    float coolSpecular = pow(max(dot(reflect(-coolLight, normal), view), 0.0), 64.0);
    float fresnel = pow(1.0 - max(dot(normal, view), 0.0), 3.0);

    // Strong lows release one contained pressure wave in the liquid. It has a
    // beginning and an end; it never turns into a perpetual ring visualizer.
    float progress = clamp(uImpactAge / 1.72, 0.0, 1.0);
    float ringRadius = mix(0.07, 0.79, progress);
    float impactFade = smoothstep(0.0, 0.08, uImpactAge) * (1.0 - smoothstep(1.32, 1.72, uImpactAge));
    float pressure = exp(-pow((waterRadial - ringRadius) / 0.020, 2.0)) * uImpactStrength * impactFade;
    float interior = smoothstep(0.80, 0.08, waterRadial);

    color += liquid * interior * (0.11 + energy * 0.14 + low * 0.10);
    color += liquid * vein * interior * (0.11 + high * 0.16);
    color += mix(cyan, ivory, pearl) * keySpecular * (0.70 + high * 0.24);
    color += mix(violet, cyan, pearl) * coolSpecular * 0.28;
    color += liquid * fresnel * (0.18 + high * 0.12);
    color += mix(ivory, rose, pearl) * pressure * interior * 0.74;
  } else if (basinHit) {
    vec3 point = ro + rd * basinTravel;
    vec3 normal = basinNormal(point);
    float keyDiffuse = max(dot(normal, keyLight), 0.0);
    float coolDiffuse = max(dot(normal, coolLight), 0.0);
    float fresnel = pow(1.0 - max(dot(normal, view), 0.0), 2.2);
    float polished = pow(max(dot(reflect(-keyLight, normal), view), 0.0), 96.0);
    float tint = 0.5 + 0.5 * sin(point.x * 2.6 - point.z * 3.4 + uTime * 0.03);
    vec3 obsidian = vec3(0.010, 0.014, 0.026);
    vec3 edge = mix(cyan, violet, tint);
    color += obsidian * (0.42 + keyDiffuse * 0.46 + coolDiffuse * 0.22);
    color += edge * fresnel * (0.36 + uHigh * 0.12);
    color += mix(ivory, cyan, tint) * polished * 0.72;
  }

  // Filmic response and very light grain prevent a sterile digital gradient.
  float vignette = 1.0 - smoothstep(0.36, 1.22, length(screen * vec2(0.88, 1.0)));
  color *= 0.68 + vignette * 0.32;
  float grain = hash21(gl_FragCoord.xy + vec2(uTime * 0.13, -uTime * 0.09)) - 0.5;
  color += grain * 0.006;
  color = 1.0 - exp(-color * (1.44 + uEnergy * 0.12));
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
    if (age >= 0 && age <= 1.72) return { age, strength: impact.strength };
    if (age > 1.72) break;
  }
  return { age: 3, strength: 0 };
};

export const WebGLMoonpool: React.FC<WebGLMoonpoolProps> = ({ audioAnalysis, seed = 2841 }) => {
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
      vertex: VERTEX,
      fragment: FRAGMENT,
      cullFace: null,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        iResolution: { value: new Vec3(width, height, width / Math.max(height, 1)) },
        uEnergy: { value: 0.42 },
        uHigh: { value: 0.32 },
        uImpactAge: { value: 3 },
        uImpactStrength: { value: 0 },
        uLow: { value: 0.40 },
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
    runtime.program.uniforms.uHigh.value = 0.12 + signal.calmHigh * 0.76;
    runtime.program.uniforms.uLow.value = 0.18 + signal.calmLow * 0.74;
    runtime.program.uniforms.uImpactAge.value = impact.age;
    runtime.program.uniforms.uImpactStrength.value = impact.strength;
    runtime.program.uniforms.uTime.value = time + seed * 0.00013;
    runtime.renderer.render({ scene: runtime.scene });
  }, [fps, frame, impacts, seed, signal.calmEnergy, signal.calmHigh, signal.calmLow]);

  return (
    <AbsoluteFill style={{ background: "#010208", overflow: "hidden" }}>
      <div ref={hostRef} style={{ bottom: 0, left: 0, overflow: "hidden", position: "absolute", right: 0, top: 0 }} />
    </AbsoluteFill>
  );
};
