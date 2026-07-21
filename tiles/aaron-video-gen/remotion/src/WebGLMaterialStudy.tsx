import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Box, Camera, Mesh, Program, Renderer, Transform, Triangle, Vec3 } from "ogl";
import type { AudioAnalysis, AudioAnalysisFrame } from "./MusicVisualizer";

/**
 * A native WebGL technical study for high-resolution rendering.
 *
 * This intentionally has a stable camera and silhouette. Audio does not move
 * the object, alter its scale, or trigger any rings. It only affects the
 * optical material: transmitted light, internal density, and rim chroma.
 */
export type WebGLMaterialStudyProps = {
  audioAnalysis?: AudioAnalysis;
  durationSec: number;
  seed?: number;
};

export const defaultWebGLMaterialStudyProps: WebGLMaterialStudyProps = {
  durationSec: 15,
  seed: 902,
};

type MaterialSignal = Pick<AudioAnalysisFrame, "calmEnergy" | "calmHigh" | "calmLow" | "pulse">;

const FULLSCREEN_VERTEX = `
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
uniform float uHigh;
uniform float uTime;
varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float softLight(vec2 point, vec2 center, vec2 scale) {
  vec2 q = (point - center) / scale;
  return exp(-dot(q, q) * 2.2);
}

void main() {
  vec2 uv = (vUv - 0.5) * vec2(iResolution.x / max(iResolution.y, 1.0), 1.0);
  vec3 color = vec3(0.0045, 0.0065, 0.015);

  // Large, quiet environmental light. These are deliberately diffuse rather
  // than defined circular glows, so the background never reads as a ring.
  float cyan = softLight(uv, vec2(-0.52, 0.17), vec2(1.05, 0.92));
  float violet = softLight(uv, vec2(0.46, -0.14), vec2(1.18, 0.84));
  float amber = softLight(uv, vec2(0.08, 0.53), vec2(0.90, 0.60));
  color += vec3(0.010, 0.070, 0.105) * cyan * (0.46 + uHigh * 0.20);
  color += vec3(0.072, 0.026, 0.120) * violet * (0.42 + uEnergy * 0.20);
  color += vec3(0.082, 0.030, 0.014) * amber * 0.26;

  // Nearly imperceptible temporal grain prevents 8-bit banding in dark 4K gradients.
  float grain = hash21(gl_FragCoord.xy + vec2(uTime * 0.13, -uTime * 0.11)) - 0.5;
  color += grain * 0.006;
  color *= 0.93 + 0.07 * smoothstep(-0.85, 0.85, uv.y);
  color = 1.0 - exp(-color * 1.34);
  gl_FragColor = vec4(max(color, 0.0), 1.0);
}`;

const SCULPTURE_VERTEX = `
precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float uTime;
uniform float uLayer;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vFold;

float hash33(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash33(i + vec3(0.0, 0.0, 0.0));
  float n100 = hash33(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash33(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash33(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash33(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash33(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash33(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash33(i + vec3(1.0, 1.0, 1.0));
  return mix(mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y), mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y), f.z);
}

void main() {
  vUv = uv;
  vec3 p = position;
  float micro = noise(position * 3.15 + vec3(uLayer * 7.0, 0.0, uTime * 0.035)) - 0.5;
  float foldA = sin(position.x * 3.0 + position.y * 3.2 + 0.68) * 0.085;
  float foldB = sin(position.x * 6.4 - position.z * 4.2 - 1.4) * 0.030;
  p += normal * (micro * 0.045 + foldB);
  p.z += foldA;
  p.y += sin(position.x * 2.8 - position.z * 4.0) * 0.048;
  p.x += sin(position.y * 4.6 + position.z * 3.2) * 0.038;
  vFold = micro + foldA * 3.2;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorldPosition = world.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const SCULPTURE_FRAGMENT = `
precision highp float;

uniform vec3 cameraPosition;
uniform float uEnergy;
uniform float uHigh;
uniform float uLow;
uniform float uPulse;
uniform float uTime;
uniform float uLayer;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vFold;

vec3 saturate(vec3 value) {
  return clamp(value, 0.0, 1.0);
}

void main() {
  // An analytic micro-normal keeps the folded surface legible on ANGLE's
  // WebGL1 path, where screen-derivative shaders are not consistently linked.
  float wrinkleX = cos(vWorldPosition.x * 6.2 + vWorldPosition.y * 3.1 + vFold * 4.0) * 0.13;
  float wrinkleY = sin(vWorldPosition.y * 7.1 - vWorldPosition.x * 2.3 - vFold * 3.0) * 0.11;
  vec3 normal = normalize(vNormal + vec3(wrinkleX, wrinkleY, 0.0) * 0.56);
  vec3 view = normalize(cameraPosition - vWorldPosition);
  vec3 key = normalize(vec3(-2.6, 2.2, 3.1) - vWorldPosition);
  vec3 fill = normalize(vec3(2.1, -0.3, 2.6) - vWorldPosition);
  vec3 rimLight = normalize(vec3(0.2, 3.4, -1.9) - vWorldPosition);
  float keyDiffuse = max(dot(normal, key), 0.0);
  float fillDiffuse = max(dot(normal, fill), 0.0);
  float rimDiffuse = max(dot(normal, rimLight), 0.0);
  float fresnel = pow(1.0 - max(dot(normal, view), 0.0), 2.35);
  float keySpecular = pow(max(dot(reflect(-key, normal), view), 0.0), 72.0);
  float fillSpecular = pow(max(dot(reflect(-fill, normal), view), 0.0), 46.0);

  float film = 0.5 + 0.5 * sin(vWorldPosition.x * 2.7 - vWorldPosition.z * 7.2 + vWorldPosition.y * 3.1 + vFold * 3.8 + uTime * 0.045);
  float thread = 0.5 + 0.5 * sin(vWorldPosition.y * 8.0 + vWorldPosition.x * 2.1 - vWorldPosition.z * 4.6);
  vec3 cyan = vec3(0.05, 0.94, 1.0);
  vec3 lavender = vec3(0.73, 0.16, 1.0);
  vec3 peach = vec3(1.0, 0.34, 0.14);
  vec3 pearl = mix(cyan, lavender, film);
  pearl = mix(pearl, peach, smoothstep(0.72, 1.0, thread) * (0.28 + uHigh * 0.16));
  float caustic = pow(max(0.0, sin(vWorldPosition.x * 8.4 - vWorldPosition.y * 5.8 + vFold * 7.0)), 18.0);

  // The sound only changes optics: density, transmitted energy, and rim chroma.
  float density = 0.34 + uLow * 0.30;
  float internal = 0.12 + uEnergy * 0.24;
  float pulseTint = uPulse * 0.035;
  vec3 color = pearl * (density + keyDiffuse * 0.64 + fillDiffuse * 0.26 + rimDiffuse * 0.18);
  color += cyan * keySpecular * (1.25 + uHigh * 0.24);
  color += vec3(1.0, 0.52, 0.76) * fillSpecular * 0.72;
  color += pearl * fresnel * (0.68 + uHigh * 0.30);
  color += mix(cyan, lavender, film) * internal * (0.78 + 0.55 * thread);
  color += mix(cyan, peach, film) * caustic * (0.06 + uHigh * 0.12);
  color += peach * pulseTint * (0.45 + 0.55 * film);
  color *= mix(0.92, 1.08, uLayer);
  color = 1.0 - exp(-color * (1.62 + uEnergy * 0.20));

  // Two translucent material layers make the form read as a volume, without
  // an outline, halo, aperture, or any beat-triggered geometric response.
  float alpha = 0.76 + fresnel * 0.14;
  gl_FragColor = vec4(saturate(color), alpha);
}`;

type Runtime = {
  backgroundProgram: Program;
  camera: Camera;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  outerProgram: Program;
  renderer: Renderer;
  scene: Transform;
};

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));
const lerp = (a: number, b: number, amount: number): number => a + (b - a) * amount;

const signalAt = (analysis: AudioAnalysis | undefined, frame: number, fps: number): MaterialSignal => {
  const fallback: MaterialSignal = { calmEnergy: 0.45, calmHigh: 0.36, calmLow: 0.42, pulse: 0 };
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
    pulse: lerp(lower.pulse, upper.pulse, amount),
  };
};

export const WebGLMaterialStudy: React.FC<WebGLMaterialStudyProps> = ({ audioAnalysis, seed = 902 }) => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const signal = signalAt(audioAnalysis, frame, fps);
  const hostRef = React.useRef<HTMLDivElement>(null);
  const runtimeRef = React.useRef<Runtime | null>(null);

  React.useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new Renderer({ alpha: false, antialias: true, dpr: 1, premultipliedAlpha: false, preserveDrawingBuffer: true });
    const gl = renderer.gl;
    gl.clearColor(0.004, 0.006, 0.015, 1);
    const scene = new Transform();
    const camera = new Camera(gl, { aspect: width / Math.max(height, 1), far: 20, fov: 34, near: 0.1 });
    camera.position.z = 4.75;
    camera.position.y = 0.03;
    camera.lookAt([0, 0, 0]);

    const backgroundProgram = new Program(gl, {
      vertex: FULLSCREEN_VERTEX,
      fragment: BACKGROUND_FRAGMENT,
      cullFace: null,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        iResolution: { value: new Vec3(width, height, width / Math.max(height, 1)) },
        uEnergy: { value: 0.45 },
        uHigh: { value: 0.36 },
        uTime: { value: 0 },
      },
    });
    const background = new Mesh(gl, { frustumCulled: false, geometry: new Triangle(gl), program: backgroundProgram });
    background.setParent(scene);

    const geometry = new Box(gl, {
      depth: 0.38,
      depthSegments: 24,
      height: 1.24,
      heightSegments: 92,
      width: 2.15,
      widthSegments: 160,
    });
    const createMaterial = (layer: number) => new Program(gl, {
      vertex: SCULPTURE_VERTEX,
      fragment: SCULPTURE_FRAGMENT,
      cullFace: gl.BACK,
      depthTest: true,
      depthWrite: false,
      transparent: true,
      uniforms: {
        uEnergy: { value: 0.45 },
        uHigh: { value: 0.36 },
        uLayer: { value: layer },
        uLow: { value: 0.42 },
        uPulse: { value: 0 },
        uTime: { value: 0 },
      },
    });
    const outerProgram = createMaterial(0);
    const outer = new Mesh(gl, { geometry, program: outerProgram, renderOrder: 1 });
    outer.rotation.set(-0.16, -0.34, 0.08);
    outer.setParent(scene);

    renderer.setSize(width, height);
    Object.assign(gl.canvas.style, {
      display: "block",
      height: "100%",
      left: "0",
      position: "absolute",
      top: "0",
      width: "100%",
    });
    host.appendChild(gl.canvas);
    runtimeRef.current = { backgroundProgram, camera, gl, outerProgram, renderer, scene };

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
    const phase = seed * 0.00013;
    const updateMaterial = (program: Program) => {
      program.uniforms.uEnergy.value = 0.26 + signal.calmEnergy * 0.58;
      program.uniforms.uHigh.value = 0.18 + signal.calmHigh * 0.62;
      program.uniforms.uLow.value = 0.22 + signal.calmLow * 0.62;
      // Kept deliberately tiny: an onset can warm a highlight, never create a beat flash.
      program.uniforms.uPulse.value = Math.min(0.40, signal.pulse) * 0.14;
      program.uniforms.uTime.value = time + phase;
    };
    runtime.backgroundProgram.uniforms.uEnergy.value = 0.26 + signal.calmEnergy * 0.58;
    runtime.backgroundProgram.uniforms.uHigh.value = 0.18 + signal.calmHigh * 0.62;
    runtime.backgroundProgram.uniforms.uTime.value = time + phase;
    updateMaterial(runtime.outerProgram);
    runtime.renderer.render({ camera: runtime.camera, scene: runtime.scene, sort: false });
  }, [fps, frame, seed, signal.calmEnergy, signal.calmHigh, signal.calmLow, signal.pulse]);

  return (
    <AbsoluteFill style={{ background: "#01020a", overflow: "hidden" }}>
      <div ref={hostRef} style={{ bottom: 0, left: 0, overflow: "hidden", position: "absolute", right: 0, top: 0 }} />
    </AbsoluteFill>
  );
};
