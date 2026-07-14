import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Mesh, Program, Renderer, Triangle, Vec3 } from "ogl";

type AudioSignal = {
  calmEnergy: number;
  calmHigh: number;
  calmLow: number;
  flux: number;
  low: number;
  pulse: number;
};

export type ExperimentalFieldVariant = "prism-chamber" | "wave-grid" | "signal-bloom";

type ExperimentalRuntime = {
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

// This is an original field system: it borrows only high-level lessons from
// contemporary WebGL work (large negative space, layered light, and material
// response) rather than reproducing a component or its shader.
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

float saturate(float value) {
  return clamp(value, 0.0, 1.0);
}

float softLine(float value, float width) {
  return exp(-pow(abs(value) / max(width, 0.0001), 2.0));
}

float hash21(vec2 value) {
  value = fract(value * vec2(123.34, 345.45));
  value += dot(value, value + 34.345);
  return fract(value.x * value.y);
}

vec3 hue(float amount) {
  vec3 a = vec3(0.15, 0.80, 1.00);
  vec3 b = vec3(0.77, 0.24, 1.00);
  vec3 c = vec3(1.00, 0.48, 0.78);
  float wave = 0.5 + 0.5 * sin(amount * PI * 2.0);
  return mix(mix(a, b, wave), c, wave * wave * 0.28);
}

vec3 prismChamber(vec2 p, float time, float kick) {
  vec3 color = vec3(0.004, 0.006, 0.020);
  vec2 q = p;
  q.x += sin(time * 0.19 + uPhase) * 0.045;
  q.y += cos(time * 0.13 + uPhase * 0.7) * 0.024;

  float prismGlow = 0.0;
  vec3 prismColor = vec3(0.0);
  for (int index = 0; index < 6; index += 1) {
    float layer = float(index);
    float angle = -0.72 + layer * 0.294 + sin(time * 0.15 + layer * 1.77) * 0.045;
    vec2 normal = vec2(cos(angle), sin(angle));
    float offset = (layer - 2.5) * 0.16 + sin(time * 0.12 + layer * 2.31) * 0.026;
    float distanceToPlane = dot(q, normal) - offset;
    float edge = softLine(distanceToPlane, 0.010 + uHigh * 0.008);
    float panel = smoothstep(0.52, 0.08, abs(distanceToPlane));
    float vignette = smoothstep(1.46, 0.15, length(q - normal * offset * 0.4));
    vec3 layerColor = hue(layer * 0.147 + time * 0.017 + uPhase * 0.07);
    prismGlow += edge * (0.46 + kick * 0.52) * vignette;
    prismColor += layerColor * (edge * (0.62 + kick * 0.42) + panel * vignette * 0.035);
  }

  vec2 lensPoint = q - vec2(0.10 * sin(time * 0.11), -0.04 * cos(time * 0.13));
  float hexRadius = max(
    abs(lensPoint.x),
    max(abs(lensPoint.x * 0.5 + lensPoint.y * 0.8660254), abs(-lensPoint.x * 0.5 + lensPoint.y * 0.8660254))
  );
  float aperture = softLine(hexRadius - 0.36 - uEnergy * 0.025, 0.024 + kick * 0.022);
  float apertureHalo = exp(-pow(hexRadius / 0.54, 2.0));
  float facet = 0.5 + 0.5 * sin(atan(lensPoint.y, lensPoint.x) * 3.0 + time * 0.14);
  vec3 lensColor = mix(hue(0.08 + time * 0.02), hue(0.60 + time * 0.016), facet);

  color += prismColor;
  color += lensColor * aperture * (0.62 + kick * 0.38);
  color += lensColor * apertureHalo * (0.032 + uEnergy * 0.032 + kick * 0.048);
  color += vec3(0.02, 0.035, 0.09) * prismGlow * 0.12;
  return color;
}

vec3 waveGrid(vec2 p, float time, float kick) {
  vec3 color = vec3(0.004, 0.008, 0.018);
  float horizon = -0.19 + sin(time * 0.05 + uPhase) * 0.018;
  float floorMask = smoothstep(horizon - 0.015, horizon + 0.065, p.y);
  float depth = 1.0 / max(p.y - horizon + 0.12, 0.12);
  float worldX = p.x * depth * 0.72;
  float worldZ = depth * 0.42;
  float wave = sin(worldX * 1.42 + time * 0.16) * 0.46
    + sin(worldZ * 2.05 - time * 0.12) * 0.34
    + sin((worldX + worldZ) * 0.75 + time * 0.07) * 0.28;
  float displacedZ = worldZ + wave * (0.16 + uLow * 0.11);
  float vertical = softLine(fract(worldX * 0.54) - 0.5, 0.018 + 0.012 / depth);
  float horizontal = softLine(fract(displacedZ * 0.38) - 0.5, 0.018 + 0.010 / depth);
  float grid = max(vertical, horizontal) * floorMask;
  float crest = smoothstep(0.36, 0.92, wave * 0.5 + 0.5);
  float distantFog = exp(-p.y * 2.4) * floorMask;
  float centerLight = exp(-pow(p.x * 0.82, 2.0) - pow((p.y - horizon) * 1.6, 2.0));
  vec3 gridColor = mix(vec3(0.08, 0.52, 0.94), vec3(0.77, 0.28, 0.98), crest);
  vec3 sky = mix(vec3(0.004, 0.010, 0.028), vec3(0.025, 0.055, 0.12), smoothstep(-1.0, horizon, p.y));

  color += sky;
  color += gridColor * grid * (0.42 + uEnergy * 0.34 + kick * 0.48);
  color += gridColor * crest * floorMask * 0.045;
  color += mix(vec3(0.12, 0.76, 1.0), vec3(0.92, 0.38, 1.0), 0.42) * centerLight * (0.035 + kick * 0.12);
  color += gridColor * distantFog * 0.024;

  float horizonBeam = softLine(p.y - horizon, 0.010 + uHigh * 0.01);
  color += vec3(0.20, 0.70, 1.0) * horizonBeam * (0.15 + uEnergy * 0.10);
  return color;
}

vec3 signalBloom(vec2 p, float time, float kick) {
  vec3 color = vec3(0.005, 0.005, 0.018);
  vec2 q = p;
  float angle = atan(q.y, q.x);
  float radius = length(q);
  float travel = time * 0.10 + uPhase;

  vec3 foldColor = vec3(0.0);
  float folds = 0.0;
  for (int index = 0; index < 4; index += 1) {
    float layer = float(index);
    float offset = (layer - 1.5) * 0.17;
    float curve = q.y - offset - sin(q.x * (1.55 + layer * 0.18) + travel * (0.72 + layer * 0.09) + layer * 1.7) * (0.13 + layer * 0.012);
    float ribbon = softLine(curve, 0.026 + uHigh * 0.014);
    float envelope = smoothstep(1.25, 0.12, abs(q.x)) * smoothstep(0.95, 0.18, radius);
    vec3 ribbonColor = hue(0.20 + layer * 0.17 + travel * 0.075);
    folds += ribbon * envelope;
    foldColor += ribbonColor * ribbon * envelope;
  }

  float diamond = abs(q.x) + abs(q.y) * 0.92;
  float gate = softLine(diamond - (0.46 + uEnergy * 0.025), 0.030 + kick * 0.022);
  float gateCore = exp(-pow(diamond / 0.56, 2.0));
  float spokes = pow(max(0.0, cos(angle * 5.0 + travel * 0.45)), 14.0) * smoothstep(0.86, 0.18, radius);
  vec3 gateColor = mix(hue(0.06 + travel * 0.08), hue(0.68 + travel * 0.04), 0.5 + 0.5 * sin(angle * 2.0));

  color += foldColor * (0.45 + kick * 0.28);
  color += gateColor * gate * (0.55 + kick * 0.38);
  color += gateColor * gateCore * (0.025 + uEnergy * 0.025 + kick * 0.10);
  color += gateColor * spokes * (0.018 + uHigh * 0.030 + kick * 0.045);
  color += vec3(0.02, 0.01, 0.06) * folds * 0.20;
  return color;
}

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  p.x *= iResolution.x / max(iResolution.y, 1.0);
  float kick = smoothstep(0.06, 0.88, uKick);
  float time = iTime + uPhase;
  vec3 color;

  if (uVariant < 0.5) {
    color = prismChamber(p, time, kick);
  } else if (uVariant < 1.5) {
    color = waveGrid(p, time, kick);
  } else {
    color = signalBloom(p, time, kick);
  }

  float vignette = 1.0 - smoothstep(0.56, 1.42, length(p * vec2(0.78, 1.0)));
  color *= 0.74 + vignette * 0.42;
  color = pow(max(color, 0.0), vec3(0.92));
  gl_FragColor = vec4(color, 1.0);
}`;

const variantValue = (variant: ExperimentalFieldVariant): number => {
  if (variant === "wave-grid") return 1;
  if (variant === "signal-bloom") return 2;
  return 0;
};

const seedUnit = (seed: number): number => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const ExperimentalField: React.FC<{
  audio: AudioSignal;
  seed: number;
  variant: ExperimentalFieldVariant;
}> = ({ audio, seed, variant }) => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const hostRef = React.useRef<HTMLDivElement>(null);
  const runtimeRef = React.useRef<ExperimentalRuntime | null>(null);

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
        uPhase: { value: seedUnit(seed + 17) * Math.PI * 2 },
        uVariant: { value: variantValue(variant) },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
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

    const transientGate = Math.min(1, Math.max(0, (audio.flux - 0.56) / 0.18));
    const kick = Math.min(1, Math.pow(transientGate, 1.1) * (0.38 + audio.low * 0.62));
    runtime.program.uniforms.iTime.value = frame / fps;
    runtime.program.uniforms.uEnergy.value = 0.24 + audio.calmEnergy * 0.68;
    runtime.program.uniforms.uHigh.value = 0.18 + audio.calmHigh * 0.72;
    runtime.program.uniforms.uKick.value = kick;
    runtime.program.uniforms.uLow.value = 0.20 + audio.calmLow * 0.74;
    runtime.renderer.render({ scene: runtime.mesh });
  }, [audio.calmEnergy, audio.calmHigh, audio.calmLow, audio.flux, audio.low, fps, frame]);

  return <div ref={hostRef} style={{ bottom: 0, left: 0, overflow: "hidden", position: "absolute", right: 0, top: 0 }} />;
};

export const ExperimentalFields: React.FC<{
  artist?: string;
  audio: AudioSignal;
  opacity: number;
  seed: number;
  title: string;
  trackLabel?: string;
  variant: ExperimentalFieldVariant;
}> = ({ artist, audio, opacity, seed, title, trackLabel, variant }) => {
  return (
    <AbsoluteFill style={{ background: "#05050f", color: "#f8f6ff", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity }}>
        <ExperimentalField audio={audio} seed={seed} variant={variant} />
      </AbsoluteFill>

      <div style={{ bottom: 72, display: "flex", justifyContent: "space-between", left: 78, position: "absolute", right: 78 }}>
        <div>
          <div style={{ color: "rgba(233, 232, 255, 0.58)", fontFamily: "Helvetica Neue, Arial, sans-serif", fontSize: 13, letterSpacing: "0.19em", marginBottom: 14, textTransform: "uppercase" }}>
            {artist || "Visual And Sound"}
          </div>
          <div style={{ fontFamily: "Helvetica Neue, Arial, sans-serif", fontSize: 48, fontWeight: 500, letterSpacing: "-0.045em", lineHeight: 1 }}>
            {title}
          </div>
        </div>
        <div style={{ alignSelf: "flex-end", color: "rgba(233, 232, 255, 0.52)", fontFamily: "Helvetica Neue, Arial, sans-serif", fontSize: 12, letterSpacing: "0.16em", textAlign: "right", textTransform: "uppercase" }}>
          {trackLabel || variant.replace("-", " ")}
        </div>
      </div>

      <AbsoluteFill style={{ background: "#05050f", opacity: 1 - opacity }} />
    </AbsoluteFill>
  );
};
