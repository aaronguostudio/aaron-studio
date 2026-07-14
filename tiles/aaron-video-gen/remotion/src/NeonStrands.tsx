import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Mesh, Program, Renderer, Triangle } from "ogl";

// Deterministic Remotion adaptation of React Bits' Strands component.
// Source reference: https://reactbits.dev/animations/strands
const MAX_COLORS = 8;
const MAX_STRANDS = 12;

const VERT = `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColors[${MAX_COLORS}];
uniform int uColorCount;
uniform int uStrandCount;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uHueShift;
uniform float uIntensity;
uniform float uOpacity;
uniform float uScale;
uniform float uSaturation;
uniform float uColorDrift;

out vec4 fragColor;

const float PI = 3.14159265;

vec3 palette(float t) {
  t = fract(t);
  float scaled = t * float(uColorCount);
  int index = int(floor(scaled));
  float blend = fract(scaled);
  int nextIndex = index + 1;
  if (nextIndex >= uColorCount) nextIndex = 0;
  return mix(uColors[index], uColors[nextIndex], blend);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  uv /= max(uScale, 0.0001);
  float energy = 0.06 + uIntensity * 0.94;
  float envelope = pow(max(cos(uv.x * PI * 1.3), 0.0), uTaper);
  vec3 color = vec3(0.0);

  for (int i = 0; i < ${MAX_STRANDS}; i++) {
    if (i >= uStrandCount) break;

    float index = float(i);
    float phase = index * 1.7 * uSpread;
    float frequency = (2.0 + index * 0.35) * uWaviness;
    float speed = 1.4 + index * 1.2;
    float time = uTime * uSpeed;
    float wave = sin(uv.x * frequency + time * speed + phase) * 0.60
      + sin(uv.x * frequency * 1.1 - time * speed * 0.7 + phase * 1.7) * 0.40;
    float amplitude = (0.1 + 0.02 * energy) * envelope * uAmplitude;
    float y = wave * amplitude;
    float distanceToStrand = abs(uv.y - y);
    float thickness = (0.001 + 0.05 * energy) * (0.35 + envelope) * uThickness;
    float glow = thickness / (distanceToStrand + thickness * 0.45);
    glow = glow * glow;
    float colorProgress = index / float(uStrandCount) + uv.x * 0.30 + uTime * uColorDrift + uHueShift;
    color += palette(colorProgress) * glow * envelope;
  }

  color *= 0.45 + 0.7 * energy;
  color = 1.0 - exp(-color * uGlow);
  float gray = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = max(mix(vec3(gray), color, uSaturation), 0.0);
  float luminance = max(max(color.r, color.g), color.b);
  float alpha = clamp(luminance, 0.0, 1.0) * uOpacity;
  fragColor = vec4(color * uOpacity, alpha);
}`;

type AudioSignal = {
  calmEnergy: number;
  calmLow: number;
  calmHigh: number;
};

type StrandsRuntime = {
  renderer: Renderer;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  program: Program;
  mesh: Mesh;
};

const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace("#", "");
  const expanded = normalized.length === 3
    ? normalized.split("").map((part) => `${part}${part}`).join("")
    : normalized;
  const value = Number.parseInt(expanded, 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
};

const basePalette = ["#F97316", "#7C3AED", "#06B6D4"].map(hexToRgb);
const palette = Array.from({ length: MAX_COLORS }, (_, index) => basePalette[index] ?? basePalette[basePalette.length - 1]);

const DeterministicStrands: React.FC<{ audio: AudioSignal; seed: number }> = ({ audio, seed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps, width, height } = useVideoConfig();
  const hostRef = React.useRef<HTMLDivElement>(null);
  const runtimeRef = React.useRef<StrandsRuntime | null>(null);

  React.useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new Renderer({ alpha: true, antialias: true, dpr: 1 });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [width, height] },
        uColors: { value: palette },
        uColorCount: { value: basePalette.length },
        uStrandCount: { value: 3 },
        uSpeed: { value: 0.5 },
        uAmplitude: { value: 1 },
        uWaviness: { value: 1 },
        uThickness: { value: 0.7 },
        uGlow: { value: 2.6 },
        uTaper: { value: 3 },
        uSpread: { value: 1 },
        uHueShift: { value: 0 },
        uIntensity: { value: 0.6 },
        uOpacity: { value: 1 },
        uScale: { value: 1.5 },
        uSaturation: { value: 2 },
        uColorDrift: { value: 0.04 },
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
    runtimeRef.current = { renderer, gl, program, mesh };

    return () => {
      runtimeRef.current = null;
      if (gl.canvas.parentNode === host) host.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [height, seed, width]);

  React.useLayoutEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;

    const { program, renderer, mesh } = runtime;
    const durationSec = durationInFrames / fps;
    const longForm = durationSec >= 180;
    const journey = frame / Math.max(durationInFrames, 1);
    program.uniforms.uTime.value = frame / fps;
    program.uniforms.uSpeed.value = longForm
      ? 0.012 + audio.calmEnergy * 0.007
      : 0.16 + audio.calmEnergy * 0.10;
    program.uniforms.uAmplitude.value = longForm
      ? 0.80 + audio.calmLow * 0.16
      : 0.88 + audio.calmLow * 0.18;
    program.uniforms.uWaviness.value = longForm
      ? 0.88 + audio.calmHigh * 0.09
      : 0.92 + audio.calmHigh * 0.10;
    program.uniforms.uThickness.value = longForm
      ? 0.66 + audio.calmEnergy * 0.10
      : 0.68 + audio.calmEnergy * 0.10;
    program.uniforms.uGlow.value = 2.58 + audio.calmHigh * 0.34;
    program.uniforms.uIntensity.value = longForm
      ? 0.54 + audio.calmEnergy * 0.11
      : 0.56 + audio.calmEnergy * 0.10;
    program.uniforms.uColorDrift.value = longForm ? 0.0034 : 0.04;
    program.uniforms.uHueShift.value = longForm
      ? Math.sin(journey * Math.PI * 2 + seed * 0.03) * 0.045
      : 0;
    renderer.render({ scene: mesh });
  }, [audio.calmEnergy, audio.calmHigh, audio.calmLow, durationInFrames, fps, frame, seed]);

  return <div ref={hostRef} style={{ bottom: 0, left: 0, overflow: "hidden", position: "absolute", right: 0, top: 0 }} />;
};

export const NeonStrands: React.FC<{
  artist?: string;
  audio: AudioSignal;
  opacity: number;
  seed: number;
  title: string;
  trackLabel?: string;
}> = ({ artist, audio, opacity, seed, title, trackLabel }) => {
  return (
    <AbsoluteFill style={{ background: "#080810", color: "#f8f5ff", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 54%, #11101c 0%, #0a0912 42%, #080810 76%)" }} />

      <AbsoluteFill style={{ opacity }}>
        <DeterministicStrands audio={audio} seed={seed} />
      </AbsoluteFill>

      <div style={{ bottom: 72, display: "flex", justifyContent: "space-between", left: 78, position: "absolute", right: 78 }}>
        <div>
          <div style={{ color: "rgba(231, 231, 249, 0.58)", fontFamily: "Helvetica Neue, Arial, sans-serif", fontSize: 13, letterSpacing: "0.19em", marginBottom: 14, textTransform: "uppercase" }}>
            {artist || "Visual And Sound"}
          </div>
          <div style={{ fontFamily: "Helvetica Neue, Arial, sans-serif", fontSize: 48, fontWeight: 500, letterSpacing: "-0.045em", lineHeight: 1 }}>
            {title}
          </div>
        </div>
        <div style={{ alignSelf: "flex-end", color: "rgba(231, 231, 249, 0.52)", fontFamily: "Helvetica Neue, Arial, sans-serif", fontSize: 12, letterSpacing: "0.16em", textAlign: "right", textTransform: "uppercase" }}>
          {trackLabel || "night focus / visual study"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
