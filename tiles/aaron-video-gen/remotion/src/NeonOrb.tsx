import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Mesh, Program, Renderer, Triangle, Vec3 } from "ogl";

// Deterministic Remotion adaptation of React Bits' Orb component.
// Source reference: https://reactbits.dev/backgrounds/orb
// The interaction loop is intentionally removed: every visual state is derived
// from Remotion's frame and precomputed audio analysis so renders are repeatable.
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

uniform float iTime;
uniform vec3 iResolution;
uniform float uHue;
uniform float uCoreBreath;
uniform float uEnergy;
uniform float uHigh;
uniform float uPulse;
uniform float uKick;
uniform float uFlow;
uniform float uPhase;
uniform vec3 backgroundColor;
varying vec2 vUv;

vec3 rgb2yiq(vec3 c) {
  float y = dot(c, vec3(0.299, 0.587, 0.114));
  float i = dot(c, vec3(0.596, -0.274, -0.322));
  float q = dot(c, vec3(0.211, -0.523, 0.312));
  return vec3(y, i, q);
}

vec3 yiq2rgb(vec3 c) {
  float r = c.x + 0.956 * c.y + 0.621 * c.z;
  float g = c.x - 0.272 * c.y - 0.647 * c.z;
  float b = c.x - 1.106 * c.y + 1.703 * c.z;
  return vec3(r, g, b);
}

vec3 adjustHue(vec3 color, float hueDeg) {
  float hueRad = hueDeg * 3.14159265 / 180.0;
  vec3 yiq = rgb2yiq(color);
  float cosA = cos(hueRad);
  float sinA = sin(hueRad);
  float i = yiq.y * cosA - yiq.z * sinA;
  float q = yiq.y * sinA + yiq.z * cosA;
  yiq.y = i;
  yiq.z = q;
  return yiq2rgb(yiq);
}

vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
  p3 += dot(p3, p3.yxz + 19.19);
  return -1.0 + 2.0 * fract(vec3(
    p3.x + p3.y,
    p3.x + p3.z,
    p3.y + p3.z
  ) * p3.zyx);
}

float snoise3(vec3 p) {
  const float K1 = 0.333333333;
  const float K2 = 0.166666667;
  vec3 i = floor(p + (p.x + p.y + p.z) * K1);
  vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
  vec3 e = step(vec3(0.0), d0 - d0.yzx);
  vec3 i1 = e * (1.0 - e.zxy);
  vec3 i2 = 1.0 - e.zxy * (1.0 - e);
  vec3 d1 = d0 - (i1 - K2);
  vec3 d2 = d0 - (i2 - K1);
  vec3 d3 = d0 - 0.5;
  vec4 h = max(0.6 - vec4(
    dot(d0, d0),
    dot(d1, d1),
    dot(d2, d2),
    dot(d3, d3)
  ), 0.0);
  vec4 n = h * h * h * h * vec4(
    dot(d0, hash33(i)),
    dot(d1, hash33(i + i1)),
    dot(d2, hash33(i + i2)),
    dot(d3, hash33(i + 1.0))
  );
  return dot(vec4(31.316), n);
}

vec4 extractAlpha(vec3 colorIn) {
  float alpha = max(max(colorIn.r, colorIn.g), colorIn.b);
  return vec4(colorIn.rgb / (alpha + 1e-5), alpha);
}

const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078);
const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725);
const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000);
const float innerRadius = 0.6;
const float noiseScale = 0.65;

float light1(float intensity, float attenuation, float distanceToLight) {
  return intensity / (1.0 + distanceToLight * attenuation);
}

float light2(float intensity, float attenuation, float distanceToLight) {
  return intensity / (1.0 + distanceToLight * distanceToLight * attenuation);
}

vec4 draw(vec2 uv) {
  vec3 color1 = adjustHue(baseColor1, uHue);
  vec3 color2 = adjustHue(baseColor2, uHue);
  vec3 color3 = adjustHue(baseColor3, uHue);
  float flow = iTime * uFlow + uPhase;

  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  float inverseRadius = radius > 0.0 ? 1.0 / radius : 0.0;
  float bgLuminance = dot(backgroundColor, vec3(0.299, 0.587, 0.114));

  float noise = snoise3(vec3(uv * (noiseScale + uHigh * 0.035), flow * 0.52)) * 0.5 + 0.5;
  float contourRadius = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), noise);
  contourRadius += (uCoreBreath - 0.5) * 0.012;
  float contourDistance = distance(uv, (contourRadius * inverseRadius) * uv);
  float contourLight = light1(1.0, 10.0, contourDistance);

  contourLight *= smoothstep(contourRadius * 1.05, contourRadius, radius);
  float innerFade = smoothstep(contourRadius * 0.8, contourRadius * 0.95, radius);
  contourLight *= mix(innerFade, 1.0, bgLuminance * 0.7);

  float colorSweep = cos(angle + flow * 0.82) * 0.5 + 0.5;
  float satelliteAngle = -flow * 0.42;
  vec2 satellitePosition = vec2(cos(satelliteAngle), sin(satelliteAngle)) * contourRadius;
  float satelliteDistance = distance(uv, satellitePosition);
  float kick = smoothstep(0.03, 0.84, uKick);
  float satelliteLight = light2(1.42 + uEnergy * 0.18 + kick * 0.32, 5.2, satelliteDistance);
  satelliteLight *= light1(1.0, 54.0, contourDistance);

  float outerMask = smoothstep(1.0, mix(innerRadius, 1.0, noise * 0.5), radius);
  float innerMask = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), radius);
  vec3 colorBase = mix(color1, color2, colorSweep);
  float fadeAmount = mix(1.0, 0.1, bgLuminance);

  vec3 darkColor = mix(color3, colorBase, contourLight);
  darkColor = (darkColor + satelliteLight) * outerMask * innerMask;
  darkColor += colorBase * contourLight * uPulse * 0.028;
  darkColor = clamp(darkColor, 0.0, 1.0);

  vec3 lightColor = (colorBase + satelliteLight) * mix(1.0, outerMask * innerMask, fadeAmount);
  lightColor = mix(backgroundColor, lightColor, contourLight);
  lightColor += colorBase * contourLight * (uHigh * 0.055 + uPulse * 0.022);
  lightColor = clamp(lightColor, 0.0, 1.0);

  vec3 finalColor = mix(darkColor, lightColor, bgLuminance);

  // Strong low-frequency onsets are translated into a contained pressure wave,
  // not a geometric jump: the edge briefly thickens and the dark center gains
  // a small amount of internal energy.
  float pressureBand = exp(-pow((radius - contourRadius * 1.02) / (0.028 + kick * 0.022), 2.0));
  float corePressure = exp(-pow(radius / max(contourRadius * 0.72, 0.001), 2.0));
  vec3 impactColor = mix(color3, colorBase, 0.68);
  finalColor += colorBase * pressureBand * kick * 0.205;
  finalColor += impactColor * corePressure * kick * 0.14;
  return extractAlpha(finalColor);
}

void main() {
  vec2 center = iResolution.xy * 0.5;
  float size = min(iResolution.x, iResolution.y);
  vec2 uv = (vUv * iResolution.xy - center) / size * 2.0;
  float flow = iTime * uFlow + uPhase;
  float rotation = sin(flow * 0.24) * 0.045;
  float s = sin(rotation);
  float c = cos(rotation);
  uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
  vec4 color = draw(uv);
  gl_FragColor = vec4(color.rgb * color.a, color.a);
}`;

type AudioSignal = {
  calmEnergy: number;
  calmHigh: number;
  calmLow: number;
  flux: number;
  low: number;
  pulse: number;
};

type OrbRuntime = {
  renderer: Renderer;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  mesh: Mesh;
  program: Program;
};

const seedUnit = (seed: number): number => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const DeterministicOrb: React.FC<{ audio: AudioSignal; seed: number }> = ({ audio, seed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps, height, width } = useVideoConfig();
  const hostRef = React.useRef<HTMLDivElement>(null);
  const runtimeRef = React.useRef<OrbRuntime | null>(null);

  React.useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new Renderer({ alpha: true, antialias: true, dpr: 1, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(width, height, width / Math.max(height, 1)) },
        uHue: { value: 0 },
        uCoreBreath: { value: 0.5 },
        uEnergy: { value: 0.5 },
        uHigh: { value: 0.5 },
        uPulse: { value: 0 },
        uKick: { value: 0 },
        uFlow: { value: 0.18 },
        uPhase: { value: seedUnit(seed + 11) * Math.PI * 2 },
        backgroundColor: { value: new Vec3(0.024, 0.026, 0.055) },
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
    runtimeRef.current = { renderer, gl, mesh, program };

    return () => {
      runtimeRef.current = null;
      if (gl.canvas.parentNode === host) host.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [height, seed, width]);

  React.useLayoutEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;

    const durationSec = durationInFrames / fps;
    const longForm = durationSec >= 180;
    const journey = frame / Math.max(durationInFrames, 1);
    const baseHue = -12 + seedUnit(seed) * 18;
    const hueJourney = Math.sin(journey * Math.PI * 2 + seedUnit(seed + 5) * Math.PI * 2) * (longForm ? 9 : 5);

    runtime.program.uniforms.iTime.value = frame / fps;
    runtime.program.uniforms.uFlow.value = longForm
      ? 0.016 + audio.calmEnergy * 0.004
      : 0.14 + audio.calmEnergy * 0.035;
    runtime.program.uniforms.uHue.value = baseHue + hueJourney + audio.calmHigh * 2.5;
    runtime.program.uniforms.uCoreBreath.value = 0.28 + audio.calmLow * 0.54;
    runtime.program.uniforms.uEnergy.value = 0.34 + audio.calmEnergy * 0.58;
    runtime.program.uniforms.uHigh.value = 0.2 + audio.calmHigh * 0.58;
    // Use the short transient signal, rather than the decaying pulse envelope,
    // so a low kick produces a contained response but the orb never appears to
    // be continuously breathing at the beat rate. The object never moves.
    const transientGate = Math.min(1, Math.max(0, (audio.flux - 0.56) / 0.18));
    const kick = Math.min(1, Math.pow(transientGate, 1.15) * (0.35 + audio.low * 0.65));
    runtime.program.uniforms.uPulse.value = Math.min(1, Math.max(0, audio.pulse));
    runtime.program.uniforms.uKick.value = kick;
    runtime.renderer.render({ scene: runtime.mesh });
  }, [audio.calmEnergy, audio.calmHigh, audio.calmLow, audio.flux, audio.low, audio.pulse, durationInFrames, fps, frame, seed]);

  return <div ref={hostRef} style={{ bottom: 0, left: 0, overflow: "hidden", position: "absolute", right: 0, top: 0 }} />;
};

export const NeonOrb: React.FC<{
  artist?: string;
  audio: AudioSignal;
  opacity: number;
  seed: number;
  title: string;
  trackLabel?: string;
}> = ({ artist, audio, opacity, seed, title, trackLabel }) => {
  return (
    <AbsoluteFill style={{ background: "#060711", color: "#f8f6ff", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 51%, rgba(35, 32, 88, 0.11) 0%, rgba(18, 19, 56, 0.045) 35%, transparent 70%)",
        }}
      />
      <AbsoluteFill style={{ opacity }}>
        <DeterministicOrb audio={audio} seed={seed} />
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
          {trackLabel || "orbital focus / visual study"}
        </div>
      </div>

      <AbsoluteFill style={{ background: "#060711", opacity: 1 - opacity }} />
    </AbsoluteFill>
  );
};
