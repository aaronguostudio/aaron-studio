import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Mesh, Program, Renderer, Triangle, Vec3 } from "ogl";

type AudioSignal = {
  calmEnergy: number;
  calmHigh: number;
  calmLow: number;
  flux: number;
  low: number;
  pulse: number;
};

export type MaterialStudyVariant = "clay-atlas" | "pigment-tide" | "paper-atlas";

type MaterialRuntime = {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  mesh: Mesh;
  program: Program;
  renderer: Renderer;
};

const VERT = `
precision highp float;
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// A material study rather than a UI background. The shader is intentionally
// built around diffuse surfaces, paper-like pigment, and slow camera/light
// changes; it has no line field or equalizer geometry.
const FRAG = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform float uEnergy;
uniform float uHigh;
uniform float uKick;
uniform float uLow;
uniform float uPhase;
uniform float uVariant;
varying vec2 vUv;

const float PI = 3.14159265;

mat2 rotate2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 41.31);
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
  float amplitude = 0.5;
  for (int index = 0; index < 5; index += 1) {
    value += noise(p) * amplitude;
    p = rotate2d(0.54) * p * 2.04 + vec2(12.7, -8.9);
    amplitude *= 0.5;
  }
  return value;
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float sdRoundBox(vec3 p, vec3 b, float radius) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - radius;
}

float clayForm(vec3 p, float time) {
  p.xz *= rotate2d(0.12 * sin(time * 0.11 + uPhase));
  vec3 folded = p;
  folded.x += sin(folded.y * 2.35 + time * 0.13) * (0.12 + uEnergy * 0.06);
  folded.z += cos(folded.y * 1.75 - time * 0.10) * 0.09;
  float body = sdRoundBox(folded, vec3(0.46, 0.68, 0.34), 0.23);
  float shoulder = length(p - vec3(0.18 * sin(time * 0.09), 0.22, 0.03)) - 0.43;
  float foot = length(p - vec3(-0.16, -0.52, 0.06)) - 0.36;
  return smin(smin(body, shoulder, 0.24), foot, 0.22);
}

vec2 mapClay(vec3 p, float time) {
  float object = clayForm(p, time);
  float floorPlane = p.y + 0.92;
  return object < floorPlane ? vec2(object, 1.0) : vec2(floorPlane, 2.0);
}

vec3 clayNormal(vec3 p, float time) {
  vec2 offset = vec2(0.002, 0.0);
  float distance = mapClay(p, time).x;
  return normalize(vec3(
    mapClay(p + offset.xyy, time).x - distance,
    mapClay(p + offset.yxy, time).x - distance,
    mapClay(p + offset.yyx, time).x - distance
  ));
}

vec3 clayAtlas(vec2 uv, float time, float kick) {
  vec3 ro = vec3(0.0, 0.04, 3.15);
  vec3 target = vec3(0.0, -0.02, 0.0);
  vec3 forward = normalize(target - ro);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
  vec3 up = cross(forward, right);
  vec3 rd = normalize(forward * 1.72 + uv.x * right + uv.y * up);
  float travel = 0.0;
  float material = 0.0;
  vec3 point = ro;

  for (int index = 0; index < 56; index += 1) {
    point = ro + rd * travel;
    vec2 scene = mapClay(point, time);
    material = scene.y;
    if (scene.x < 0.001 || travel > 7.0) break;
    travel += scene.x * 0.78;
  }

  vec3 background = mix(vec3(0.075, 0.09, 0.11), vec3(0.16, 0.19, 0.21), 0.5 + 0.5 * uv.y);
  if (travel > 7.0) return background;

  vec3 normal = clayNormal(point, time);
  vec3 lightDirection = normalize(vec3(-0.54, 0.78, 0.64));
  vec3 fillDirection = normalize(vec3(0.68, 0.18, 0.42));
  float mainLight = max(0.0, dot(normal, lightDirection));
  float fill = max(0.0, dot(normal, fillDirection));
  float rim = pow(1.0 - max(0.0, dot(normal, -rd)), 2.8);
  float shadow = material < 1.5 ? 1.0 : clamp(0.58 + point.z * 0.18, 0.35, 0.82);
  vec3 clay = mix(vec3(0.54, 0.50, 0.43), vec3(0.33, 0.44, 0.50), smoothstep(-0.62, 0.70, point.y));
  vec3 floorTone = vec3(0.16, 0.18, 0.18);
  vec3 surface = material < 1.5 ? clay : floorTone;
  surface *= 0.38 + mainLight * 0.72 + fill * 0.16;
  surface += vec3(0.45, 0.66, 0.74) * rim * (0.08 + uHigh * 0.08 + kick * 0.11);
  surface *= shadow;
  surface += vec3(0.20, 0.28, 0.32) * exp(-travel * 0.36) * 0.08;
  return surface;
}

vec3 pigmentTide(vec2 uv, float time, float kick) {
  vec2 p = uv;
  p.x *= iResolution.x / max(iResolution.y, 1.0);
  vec2 driftA = vec2(time * 0.026, -time * 0.018);
  vec2 driftB = vec2(-time * 0.014, time * 0.021);
  float first = fbm(p * 1.15 + driftA + vec2(uPhase, 0.0));
  float second = fbm(p * 1.85 + driftB - vec2(0.0, uPhase));
  float woven = fbm(p * 3.1 + vec2(first * 1.8, second * 1.4) + driftA * 1.6);
  float pigmentA = smoothstep(0.46 - uEnergy * 0.06, 0.72, first + woven * 0.24);
  float pigmentB = smoothstep(0.54, 0.80 - uLow * 0.05, second + first * 0.21);
  float paper = 0.84 + noise(p * 145.0) * 0.075;
  vec3 base = vec3(0.84, 0.80, 0.72) * paper;
  vec3 deepInk = vec3(0.035, 0.11, 0.16);
  vec3 vermilion = vec3(0.70, 0.20, 0.14);
  vec3 ultramarine = vec3(0.10, 0.27, 0.55);
  vec3 color = mix(base, deepInk, pigmentA * 0.78);
  color = mix(color, ultramarine, pigmentB * 0.64);
  color = mix(color, vermilion, smoothstep(0.70, 0.96, woven + first * 0.16) * 0.34);
  float bloom = smoothstep(0.58, 0.90, first * second + woven * 0.32);
  color += mix(ultramarine, vermilion, 0.46) * bloom * (0.020 + kick * 0.070);
  color += vec3(0.12, 0.08, 0.04) * (noise(p * 27.0 + time * 0.05) - 0.5) * 0.07;
  return color;
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float kick = smoothstep(0.06, 0.88, uKick);
  float time = iTime + uPhase;
  vec3 color = uVariant < 0.5 ? clayAtlas(uv, time, kick) : pigmentTide(uv, time, kick);
  float vignette = 1.0 - smoothstep(0.48, 1.52, length(uv * vec2(0.78, 1.0)));
  color *= 0.82 + vignette * 0.25;
  color = pow(max(color, 0.0), vec3(0.94));
  gl_FragColor = vec4(color, 1.0);
}`;

const seedUnit = (seed: number): number => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const shaderVariant = (variant: MaterialStudyVariant): number => variant === "pigment-tide" ? 1 : 0;

const MaterialShader: React.FC<{
  audio: AudioSignal;
  seed: number;
  variant: Extract<MaterialStudyVariant, "clay-atlas" | "pigment-tide">;
}> = ({ audio, seed, variant }) => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const hostRef = React.useRef<HTMLDivElement>(null);
  const runtimeRef = React.useRef<MaterialRuntime | null>(null);

  React.useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const renderer = new Renderer({ alpha: false, antialias: true, dpr: 1, premultipliedAlpha: false });
    const gl = renderer.gl;
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(width, height, width / Math.max(height, 1)) },
        uEnergy: { value: 0.5 },
        uHigh: { value: 0.5 },
        uKick: { value: 0 },
        uLow: { value: 0.5 },
        uPhase: { value: seedUnit(seed + 7) * Math.PI * 2 },
        uVariant: { value: shaderVariant(variant) },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    renderer.setSize(width, height);
    Object.assign(gl.canvas.style, { display: "block", height: "100%", left: "0", position: "absolute", top: "0", width: "100%" });
    host.appendChild(gl.canvas);
    runtimeRef.current = { gl, mesh, program, renderer };
    return () => {
      runtimeRef.current = null;
      if (gl.canvas.parentNode === host) host.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [height, seed, variant, width]);

  React.useLayoutEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    const transient = Math.min(1, Math.max(0, (audio.flux - 0.60) / 0.22));
    const kick = Math.min(1, Math.pow(transient, 1.2) * (0.42 + audio.low * 0.58));
    runtime.program.uniforms.iTime.value = frame / fps;
    runtime.program.uniforms.uEnergy.value = 0.24 + audio.calmEnergy * 0.66;
    runtime.program.uniforms.uHigh.value = 0.18 + audio.calmHigh * 0.68;
    runtime.program.uniforms.uKick.value = kick;
    runtime.program.uniforms.uLow.value = 0.22 + audio.calmLow * 0.70;
    runtime.renderer.render({ scene: runtime.mesh });
  }, [audio.calmEnergy, audio.calmHigh, audio.calmLow, audio.flux, audio.low, fps, frame]);

  return <div ref={hostRef} style={{ bottom: 0, left: 0, overflow: "hidden", position: "absolute", right: 0, top: 0 }} />;
};

const paperPath = (index: number): string => {
  const paths = [
    "M -118 114 L 448 34 L 634 128 L 548 222 L 150 304 L -72 244 L -118 114 Z",
    "M 864 82 L 1378 58 L 1574 176 L 1448 306 L 1052 276 L 788 178 L 864 82 Z",
    "M 140 594 L 548 468 L 762 566 L 658 794 L 340 820 L 154 690 L 140 594 Z",
    "M 1010 548 L 1460 494 L 1612 640 L 1484 834 L 1168 784 L 950 654 L 1010 548 Z",
  ];
  return paths[index] || paths[0];
};

const PaperAtlas: React.FC<{ audio: AudioSignal; durationSec: number; opacity: number; seed: number }> = ({ audio, durationSec, opacity, seed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const chapter = Math.min(1, Math.max(0, time / Math.max(durationSec, 1)));
  const motion = Easing.bezier(0.22, 0.80, 0.22, 1);
  const phraseProgress = (start: number, end: number): number => interpolate(chapter, [start, end], [0, 1], { easing: motion, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phrases = [
    phraseProgress(0.02, 0.52),
    phraseProgress(0.16, 0.68),
    phraseProgress(0.30, 0.84),
    phraseProgress(0.44, 0.98),
  ];
  const layerTransforms = [
    { x: interpolate(phrases[0], [0, 1], [-128, 132]), y: interpolate(phrases[0], [0, 1], [-46, 68]), r: interpolate(phrases[0], [0, 1], [-10, 5]) },
    { x: interpolate(phrases[1], [0, 1], [112, -142]), y: interpolate(phrases[1], [0, 1], [84, -74]), r: interpolate(phrases[1], [0, 1], [9, -8]) },
    { x: interpolate(phrases[2], [0, 1], [-96, 174]), y: interpolate(phrases[2], [0, 1], [72, -92]), r: interpolate(phrases[2], [0, 1], [12, -7]) },
    { x: interpolate(phrases[3], [0, 1], [96, -172]), y: interpolate(phrases[3], [0, 1], [-68, 108]), r: interpolate(phrases[3], [0, 1], [-10, 9]) },
  ];
  const colors = ["#d95e43", "#253b58", "#d2a92f", "#69888c"];
  const shadowOpacity = 0.24 + audio.calmLow * 0.11;
  const grainId = `paper-grain-${seed}`;
  const shadowId = `paper-shadow-${seed}`;

  return (
    <AbsoluteFill style={{ background: "#e7e0d3", opacity, overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id={grainId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" seed={seed} result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" />
          </filter>
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          <pattern id={`hatch-${seed}`} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
            <line x1="0" y1="0" x2="0" y2="18" stroke="#211e18" strokeWidth="1" opacity="0.12" />
          </pattern>
        </defs>

        <rect width="1920" height="1080" fill="#e7e0d3" />
        <rect width="1920" height="1080" filter={`url(#${grainId})`} opacity="0.13" />
        <rect x="40" y="40" width="1840" height="1000" fill="none" stroke="#2b2821" strokeWidth="2" opacity="0.22" />
        <path d="M 80 902 C 420 820 716 940 1020 866 C 1310 794 1590 842 1832 720" fill="none" stroke="#2b2821" strokeWidth="2" opacity="0.26" />

        {layerTransforms.map((transform, index) => (
          <g key={index} transform={`translate(${transform.x} ${transform.y}) rotate(${transform.r} 960 540)`}>
            <path d={paperPath(index)} transform="translate(18 26)" fill="#2d2820" opacity={shadowOpacity} filter={`url(#${shadowId})`} />
            <path d={paperPath(index)} fill={colors[index]} />
            <path d={paperPath(index)} fill={`url(#hatch-${seed})`} opacity={0.52 + audio.calmHigh * 0.10} />
            <path d={paperPath(index)} fill="none" stroke="#f6efe4" strokeWidth="3" opacity="0.72" />
          </g>
        ))}

        <rect x="824" y="280" width="280" height="520" fill="#efe8dc" opacity="0.85" transform={`rotate(${interpolate(chapter, [0, 1], [-6, 5])} 964 540)`} />
        <rect x="846" y="302" width="236" height="476" fill="none" stroke="#28231b" strokeWidth="2" opacity="0.28" transform={`rotate(${interpolate(chapter, [0, 1], [-6, 5])} 964 540)`} />
      </svg>
    </AbsoluteFill>
  );
};

export const MaterialStudies: React.FC<{
  artist?: string;
  audio: AudioSignal;
  durationSec: number;
  opacity: number;
  seed: number;
  title: string;
  trackLabel?: string;
  variant: MaterialStudyVariant;
}> = ({ artist, audio, durationSec, opacity, seed, title, trackLabel, variant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dark = variant !== "paper-atlas";
  const titleOpacity = interpolate(frame, [0, Math.round(fps * 0.45), Math.round(fps * 5.4), Math.round(fps * 7.1)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleOffset = interpolate(frame, [0, Math.round(fps * 0.7), Math.round(fps * 7.1)], [16, 0, -12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: dark ? "#0c1015" : "#e7e0d3", color: dark ? "#f7f5ef" : "#242018", overflow: "hidden" }}>
      {variant === "paper-atlas" ? (
        <PaperAtlas audio={audio} durationSec={durationSec} opacity={opacity} seed={seed} />
      ) : (
        <AbsoluteFill style={{ opacity }}>
          <MaterialShader audio={audio} seed={seed} variant={variant} />
        </AbsoluteFill>
      )}

      <div style={{ bottom: 72, display: "flex", justifyContent: "space-between", left: 78, opacity: titleOpacity, position: "absolute", right: 78, transform: `translateY(${titleOffset}px)` }}>
        <div>
          <div style={{ color: dark ? "rgba(245, 242, 232, 0.58)" : "rgba(36, 32, 24, 0.62)", fontFamily: "Helvetica Neue, Arial, sans-serif", fontSize: 13, letterSpacing: "0.19em", marginBottom: 14, textTransform: "uppercase" }}>
            {artist || "Visual And Sound"}
          </div>
          <div style={{ fontFamily: "Helvetica Neue, Arial, sans-serif", fontSize: 48, fontWeight: 500, letterSpacing: "-0.045em", lineHeight: 1 }}>
            {title}
          </div>
        </div>
        <div style={{ alignSelf: "flex-end", color: dark ? "rgba(245, 242, 232, 0.52)" : "rgba(36, 32, 24, 0.54)", fontFamily: "Helvetica Neue, Arial, sans-serif", fontSize: 12, letterSpacing: "0.16em", textAlign: "right", textTransform: "uppercase" }}>
          {trackLabel || variant.replace("-", " ")}
        </div>
      </div>

      <AbsoluteFill style={{ background: dark ? "#0c1015" : "#e7e0d3", opacity: 1 - opacity }} />
    </AbsoluteFill>
  );
};
