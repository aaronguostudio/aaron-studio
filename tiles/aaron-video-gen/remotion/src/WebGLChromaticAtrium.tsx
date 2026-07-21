import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Mesh, Program, Renderer, Triangle, Vec3 } from "ogl";
import type { AudioAnalysis, AudioAnalysisFrame } from "./MusicVisualizer";

/**
 * Chromatic Atrium is a code-authored light installation, not a faux-real
 * environment: three fixed architectural planes receive slow, refracted light.
 * The music changes luminance, density, and a rare travelling caustic only.
 */
export type WebGLChromaticAtriumProps = {
  audioAnalysis?: AudioAnalysis;
  durationSec: number;
  renderResolution?: "1080p" | "4k";
  seed?: number;
};

export const defaultWebGLChromaticAtriumProps: WebGLChromaticAtriumProps = {
  durationSec: 14,
  renderResolution: "1080p",
  seed: 6187,
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
    value += amplitude * noise(p);
    p = mat2(0.79, -0.61, 0.61, 0.79) * p * 2.04 + vec2(7.8, -4.6);
    amplitude *= 0.48;
  }
  return value;
}

vec3 cameraRay(vec2 uv, vec3 origin, vec3 target) {
  vec3 forward = normalize(target - origin);
  vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, forward);
  return normalize(forward * 1.58 + right * uv.x + up * uv.y);
}

// A tall arched aperture gives the room a single architectural subject. It is
// intentionally a construction in the wall, not an outlined UI card.
float archDistance(vec2 p, float radius, float base, float spring) {
  float shaft = max(abs(p.x) - radius, max(p.y - spring, base - p.y));
  float crown = max(length(p - vec2(0.0, spring)) - radius, spring - p.y);
  return min(shaft, crown);
}

float positivePlaneHit(float numerator, float denominator) {
  float hit = numerator / denominator;
  return hit > 0.0 ? hit : 1000.0;
}

// Soft, refracted projection. The shapes are colour interactions on material,
// rather than independent graphic elements or animated UI objects.
vec3 projectedLight(vec2 point, float planeIndex) {
  vec2 q = point;
  q += vec2(uTime * 0.004, -uTime * 0.003);
  float structure = fbm(q * 0.72 + vec2(1.3, planeIndex * 3.2));
  float warmSheet = exp(-dot(q - vec2(0.44, -0.36), q - vec2(0.44, -0.36)) / 2.6);
  float coolSheet = exp(-dot(q - vec2(-0.42, 0.10), q - vec2(-0.42, 0.10)) / 2.2);
  float violetSheet = exp(-dot(q - vec2(0.06, 0.66), q - vec2(0.06, 0.66)) / 3.3);
  vec3 amber = vec3(1.0, 0.39, 0.17);
  vec3 cyan = vec3(0.05, 0.70, 0.96);
  vec3 violet = vec3(0.57, 0.14, 0.90);
  vec3 ivory = vec3(1.0, 0.80, 0.56);
  vec3 light = amber * warmSheet * (0.020 + uEnergy * 0.024);
  light += cyan * coolSheet * (0.018 + uHigh * 0.020);
  light += violet * violetSheet * (0.010 + uLow * 0.016);
  light *= 0.84 + structure * 0.16;
  return light;
}

vec3 plaster(vec3 point, vec3 normal, float planeIndex) {
  vec2 p = point.xz + point.yx * 0.34;
  float grain = fbm(p * 1.75 + planeIndex * 6.1);
  float fine = noise(p * 12.0 + planeIndex * 9.0);
  vec3 coolStone = vec3(0.029, 0.038, 0.058);
  vec3 warmStone = vec3(0.048, 0.035, 0.047);
  vec3 base = mix(coolStone, warmStone, grain * 0.46 + fine * 0.18);
  vec3 key = normalize(vec3(-1.4, 2.8, 1.7));
  vec3 fill = normalize(vec3(2.4, 0.8, -1.5));
  float diffuse = max(dot(normal, key), 0.0) * 0.26 + max(dot(normal, fill), 0.0) * 0.09;
  return base * (0.74 + diffuse);
}

vec3 portalField(vec2 p) {
  vec2 q = p * vec2(0.76, 0.95);
  q += vec2(-uTime * 0.052, uTime * 0.030);
  float folds = fbm(q * 1.65 + 5.4);
  float whorl = fbm(q * 3.10 - vec2(3.2, 1.8));
  float current = sin(q.y * 2.4 + uTime * 0.40 + folds * 2.2) * 0.11;
  float amberBand = exp(-pow((q.x + q.y * 0.48 - 0.14 - folds * 0.20 + current) / 0.26, 2.0));
  float blueBand = exp(-pow((q.x - q.y * 0.72 + 0.17 + whorl * 0.14 - current) / 0.22, 2.0));
  float orchidBand = exp(-pow((q.y + q.x * 0.36 + 0.12 - folds * 0.18 + current * 0.8) / 0.31, 2.0));
  float spark = pow(max(0.0, sin(q.x * 5.4 - q.y * 3.5 + folds * 6.0 + uTime * 0.34)), 20.0);
  float progress = clamp(uImpactAge / 1.84, 0.0, 1.0);
  float movingRefraction = exp(-pow((q.x + q.y * 0.32 - mix(-1.10, 1.10, progress)) / 0.09, 2.0));
  float impactFade = smoothstep(0.0, 0.10, uImpactAge) * (1.0 - smoothstep(1.42, 1.84, uImpactAge));
  vec3 colour = vec3(0.006, 0.009, 0.017);
  colour += vec3(1.0, 0.29, 0.11) * amberBand * (0.17 + uEnergy * 0.18);
  colour += vec3(0.03, 0.62, 0.96) * blueBand * (0.16 + uHigh * 0.18);
  colour += vec3(0.56, 0.10, 0.78) * orchidBand * (0.10 + uLow * 0.12);
  colour += vec3(0.74, 0.94, 1.0) * spark * (0.018 + uHigh * 0.038);
  colour += vec3(0.76, 0.96, 1.0) * movingRefraction * impactFade * uImpactStrength * 0.52;
  colour += vec3(0.12, 0.36, 0.56) * movingRefraction * impactFade * uImpactStrength * 0.20;
  return colour;
}

void main() {
  vec2 uv = (vUv - 0.5) * vec2(iResolution.x / max(iResolution.y, 1.0), 1.0);
  vec3 ro = vec3(0.22, 0.18, 2.86);
  vec3 rd = cameraRay(uv, ro, vec3(-0.16, -0.34, -2.42));

  // A quiet architectural corner: rear wall, left reveal, and floor.
  float tRear = positivePlaneHit(-2.40 - ro.z, rd.z);
  float tFloor = positivePlaneHit(-1.02 - ro.y, rd.y);
  float tLeft = positivePlaneHit(-2.05 - ro.x, rd.x);
  float t = tRear;
  float surface = 0.0;
  if (tFloor < t) { t = tFloor; surface = 1.0; }
  if (tLeft < t) { t = tLeft; surface = 2.0; }
  vec3 point = ro + rd * t;
  vec3 normal = surface < 0.5 ? vec3(0.0, 0.0, 1.0) : (surface < 1.5 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0));

  vec2 projectionPoint = surface < 0.5 ? point.xy : (surface < 1.5 ? point.xz : point.zy);
  vec3 color = plaster(point, normal, surface);
  vec3 light = projectedLight(projectionPoint, surface);

  // The floor accepts a little more bloom, while the deep wall retains the
  // tactile matte quality that keeps this from reading as a neon HUD.
  float acceptance = surface < 0.5 ? 0.82 : (surface < 1.5 ? 1.14 : 0.46);
  color += light * acceptance;

  if (surface < 0.5) {
    // An inset aperture is cut into the rear wall. A mineral rim catches a
    // little reflected light, while the interior has true depth through a
    // separate, restrained light field.
    vec2 aperturePoint = point.xy - vec2(0.22, -0.10);
    float outerArch = archDistance(aperturePoint, 0.78, -1.00, 0.18);
    float innerArch = archDistance(aperturePoint, 0.61, -0.93, 0.18);
    float portalMask = smoothstep(0.018, -0.018, innerArch);
    float rimMask = smoothstep(0.022, -0.012, outerArch) * (1.0 - portalMask);
    float innerEdge = 1.0 - smoothstep(-0.026, 0.028, abs(innerArch));
    vec3 field = portalField(aperturePoint);
    vec3 rim = vec3(0.032, 0.039, 0.055) + field * 0.18;
    color = mix(color, rim, rimMask);
    color = mix(color, field, portalMask);
    color += field * innerEdge * 0.62;
  } else if (surface < 1.5) {
    // An imperfect, soft reflection grounds the aperture in the floor. It is
    // a material response, not a second graphic object.
    vec2 reflected = vec2(point.x - 0.22, -point.z * 0.52 - 0.16);
    float reflectedArch = archDistance(reflected, 0.64, -0.87, 0.12);
    float reflectionMask = smoothstep(0.12, -0.10, reflectedArch);
    vec3 reflection = portalField(reflected) * reflectionMask;
    color += reflection * (0.065 + uEnergy * 0.055);
    color += light * 0.10 * reflectionMask;
    float spill = exp(-pow((point.x - 0.22) / 1.18, 2.0) - pow((point.z + 1.72) / 2.25, 2.0));
    color += vec3(0.035, 0.060, 0.085) * spill * (0.68 + uHigh * 0.22);
    color += vec3(0.060, 0.025, 0.020) * spill * (0.34 + uEnergy * 0.18);
  }
  float cornerOcclusion = exp(-max(0.0, length(point.xz) - 2.65) * 1.35);
  color *= 0.80 + cornerOcclusion * 0.20;

  // Subtle airborne grain breaks the overly-perfect digital surface without
  // becoming visual noise at normal playback speed.
  float dither = hash21(gl_FragCoord.xy + vec2(uTime * 0.16, -uTime * 0.12)) - 0.5;
  color += dither * 0.0045;
  float vignette = 1.0 - smoothstep(0.42, 1.36, length(uv * vec2(0.90, 1.0)));
  color *= 0.70 + vignette * 0.30;
  color = 1.0 - exp(-color * (1.70 + uEnergy * 0.14));
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
    if (age >= 0 && age <= 1.84) return { age, strength: impact.strength };
    if (age > 1.84) break;
  }
  return { age: 3, strength: 0 };
};

export const WebGLChromaticAtrium: React.FC<WebGLChromaticAtriumProps> = ({
  audioAnalysis,
  renderResolution = "1080p",
  seed = 6187,
}) => {
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
  }, [height, renderResolution, seed, width]);

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
    runtime.program.uniforms.uTime.value = time + seed * 0.00011;
    runtime.renderer.render({ scene: runtime.scene });
  }, [fps, frame, impacts, seed, signal.calmEnergy, signal.calmHigh, signal.calmLow]);

  return (
    <AbsoluteFill style={{ background: "#010208", overflow: "hidden" }}>
      <div ref={hostRef} style={{ bottom: 0, left: 0, overflow: "hidden", position: "absolute", right: 0, top: 0 }} />
    </AbsoluteFill>
  );
};
