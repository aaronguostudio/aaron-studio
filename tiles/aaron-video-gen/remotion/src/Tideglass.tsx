import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Mesh, Program, Renderer, Triangle, Vec3 } from "ogl";

export type TideglassAudio = {
  calmEnergy: number;
  calmLow: number;
  calmHigh: number;
  pulse: number;
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

// A bespoke "tideglass" field: large, soft planes of coloured light rather
// than independent objects. Its visual state is always derived from frame time.
const FRAG = `
precision highp float;
uniform float iTime;
uniform vec3 iResolution;
uniform float uEnergy;
uniform float uLow;
uniform float uHigh;
uniform float uPulse;
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
  float sum = 0.0;
  float amplitude = 0.52;
  for (int i = 0; i < 4; i++) {
    sum += amplitude * noise(p);
    p = p * 2.03 + vec2(7.1, 3.7);
    amplitude *= 0.48;
  }
  return sum;
}

float band(vec2 p, float offset, float phase, float width) {
  float warp = sin(p.x * 2.1 + phase) * 0.18 + sin(p.x * 5.4 - phase) * 0.035;
  warp += (fbm(p * 2.2 + vec2(sin(phase), cos(phase)) * 0.16) - 0.5) * 0.19;
  float distanceToCenter = abs(p.y - offset - warp);
  return exp(-pow(distanceToCenter / width, 2.0));
}

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 uv = (vUv - 0.5) * vec2(iResolution.x / iResolution.y, 1.0);
  float t = iTime;
  vec2 p = uv;
  p.x += sin(p.y * 2.1 + t) * 0.025;
  p.y += sin(p.x * 1.7 - t) * 0.018;

  float blue = band(p, 0.18, t + 0.4, 0.16);
  float violet = band(p, -0.06, -t + 2.1, 0.2);
  float peach = band(p, -0.31, t + 4.2, 0.145);
  float lower = band(p, 0.49, -t + 0.8, 0.23);

  vec3 color = vec3(0.007, 0.009, 0.021);
  color += vec3(0.08, 0.72, 1.0) * blue * (0.42 + uHigh * 0.25);
  color += vec3(0.55, 0.18, 1.0) * violet * (0.42 + uEnergy * 0.22);
  color += vec3(1.0, 0.36, 0.24) * peach * (0.34 + uLow * 0.2);
  color += vec3(0.16, 0.3, 0.94) * lower * 0.24;

  float enclosing = smoothstep(0.02, -0.045, roundedBox(uv, vec2(0.79, 0.37), 0.07));
  float glassGlow = exp(-pow(abs(roundedBox(uv, vec2(0.79, 0.37), 0.07)) / 0.006, 2.0));
  color *= mix(0.42, 1.0, enclosing);
  color += vec3(0.44, 0.73, 1.0) * glassGlow * (0.08 + uHigh * 0.08);

  float sheen = exp(-pow((p.x + p.y * 0.72 - sin(t) * 0.13) / 0.06, 2.0));
  color += vec3(0.75, 0.92, 1.0) * sheen * (0.035 + uPulse * 0.025);
  color *= 0.86 + uEnergy * 0.2;
  color = 1.0 - exp(-color * 1.35);
  color += (hash21(gl_FragCoord.xy) - 0.5) * 0.012;
  gl_FragColor = vec4(color, 1.0);
}`;

type Runtime = {
  renderer: Renderer;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  mesh: Mesh;
  program: Program;
};

export const Tideglass: React.FC<{ audio: TideglassAudio }> = ({ audio }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps, height, width } = useVideoConfig();
  const hostRef = React.useRef<HTMLDivElement>(null);
  const runtimeRef = React.useRef<Runtime | null>(null);

  React.useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new Renderer({ alpha: false, antialias: true, dpr: 1, premultipliedAlpha: false });
    const gl = renderer.gl;
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(width, height, width / Math.max(height, 1)) },
        uEnergy: { value: 0.5 },
        uLow: { value: 0.5 },
        uHigh: { value: 0.5 },
        uPulse: { value: 0.2 },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
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
  }, [height, width]);

  React.useLayoutEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    runtime.program.uniforms.iTime.value = (frame / Math.max(durationInFrames, 1)) * Math.PI * 2;
    runtime.program.uniforms.uEnergy.value = 0.28 + audio.calmEnergy * 0.58;
    runtime.program.uniforms.uLow.value = 0.22 + audio.calmLow * 0.48;
    runtime.program.uniforms.uHigh.value = 0.2 + audio.calmHigh * 0.5;
    runtime.program.uniforms.uPulse.value = Math.min(0.58, 0.12 + audio.pulse * 0.28);
    runtime.renderer.render({ scene: runtime.mesh });
  }, [audio.calmEnergy, audio.calmHigh, audio.calmLow, audio.pulse, durationInFrames, frame]);

  return <div ref={hostRef} style={{ bottom: 0, left: 0, overflow: "hidden", position: "absolute", right: 0, top: 0 }} />;
};
