import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Mesh, Program, Renderer, Triangle, Vec3 } from "ogl";

export type ResonanceFabricAudio = {
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

// A suspended set of translucent veils. The composition is intentionally a
// finite object in a void—not a landscape, waveform, or a UI panel. Audio
// only changes the light travelling through the material.
const FRAG = `
precision highp float;
uniform float uPhase;
uniform vec3 iResolution;
uniform float uEnergy;
uniform float uLow;
uniform float uHigh;
uniform float uPulse;
varying vec2 vUv;

const float PI = 3.14159265;

float hash21(vec2 p) {
  p = fract(p * vec2(321.42, 153.13));
  p += dot(p, p + 31.73);
  return fract(p.x * p.y);
}

mat2 rotate2d(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float sdRoundedBox(vec2 p, vec2 halfExtents, float radius) {
  vec2 q = abs(p) - halfExtents + radius;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
}

// A single, off-round Mobius fold. It has a stable silhouette and real volume:
// not an audio waveform, looped orbit, or a collection of moving primitives.
float foldedSculpture(vec3 p) {
  p.xy = rotate2d(-0.16) * p.xy;
  p.xz = rotate2d(0.12) * p.xz;
  float theta = atan(p.y, p.x);
  float ringRadius = 1.20 + 0.14 * sin(theta * 3.0 + 0.48) + 0.055 * cos(theta * 5.0 - 0.34);
  vec2 crossSection = vec2(length(p.xy) - ringRadius, p.z);
  crossSection = rotate2d(theta * 0.5 + 0.20) * crossSection;
  return sdRoundedBox(crossSection, vec2(0.43, 0.062), 0.034);
}

float scene(vec3 p) {
  return foldedSculpture(p);
}

vec3 normalAt(vec3 p) {
  vec2 e = vec2(0.0025, 0.0);
  return normalize(vec3(
    scene(p + e.xyy) - scene(p - e.xyy),
    scene(p + e.yxy) - scene(p - e.yxy),
    scene(p + e.yyx) - scene(p - e.yyx)
  ));
}

mat3 camera(vec3 origin, vec3 target) {
  vec3 forward = normalize(target - origin);
  vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, forward);
  return mat3(right, up, forward);
}

float trace(vec3 ro, vec3 rd) {
  float t = 0.0;
  for (int index = 0; index < 96; index++) {
    vec3 p = ro + rd * t;
    float distanceToScene = scene(p);
    if (distanceToScene < 0.0014) return t;
    t += max(distanceToScene * 0.68, 0.009);
    if (t > 9.0) break;
  }
  return -1.0;
}

void main() {
  vec2 uv = (vUv - 0.5) * vec2(iResolution.x / iResolution.y, 1.0);
  vec3 background = vec3(0.006, 0.007, 0.016);
  background += vec3(0.030, 0.010, 0.072) * exp(-dot(uv - vec2(-0.42, 0.13), uv - vec2(-0.42, 0.13)) * 1.65);
  background += vec3(0.006, 0.055, 0.085) * exp(-dot(uv - vec2(0.40, -0.17), uv - vec2(0.40, -0.17)) * 1.82);
  background += vec3(0.070, 0.028, 0.022) * exp(-dot(uv - vec2(0.08, 0.42), uv - vec2(0.08, 0.42)) * 2.6);

  float backHalo = exp(-dot(uv * vec2(0.94, 1.08), uv * vec2(0.94, 1.08)) * 2.25);
  background += vec3(0.060, 0.035, 0.13) * backHalo * (0.42 + uLow * 0.10);

  vec3 ro = vec3(0.23, 0.10, 4.35);
  vec3 rd = camera(ro, vec3(0.0, 0.0, 0.0)) * normalize(vec3(uv * 1.06, 1.42));
  float travelled = trace(ro, rd);
  if (travelled < 0.0) {
    vec3 emptyColour = 1.0 - exp(-background * 1.62);
    emptyColour += (hash21(gl_FragCoord.xy) - 0.5) * 0.004;
    gl_FragColor = vec4(max(emptyColour, 0.0), 1.0);
    return;
  }

  vec3 point = ro + rd * travelled;
  vec3 normal = normalAt(point);
  vec3 view = normalize(ro - point);
  vec3 cyanLight = normalize(vec3(-2.2, 2.5, 3.0) - point);
  vec3 roseLight = normalize(vec3(2.8, -0.5, 2.2) - point);
  vec3 goldLight = normalize(vec3(0.4, 3.6, -1.3) - point);
  float cyanDiffuse = max(dot(normal, cyanLight), 0.0);
  float roseDiffuse = max(dot(normal, roseLight), 0.0);
  float goldDiffuse = max(dot(normal, goldLight), 0.0);
  float cyanSpecular = pow(max(dot(reflect(-cyanLight, normal), view), 0.0), 82.0);
  float roseSpecular = pow(max(dot(reflect(-roseLight, normal), view), 0.0), 48.0);
  float goldSpecular = pow(max(dot(reflect(-goldLight, normal), view), 0.0), 92.0);
  float fresnel = pow(1.0 - max(dot(normal, view), 0.0), 2.35);

  float theta = atan(point.y, point.x);
  float thinFilm = 0.5 + 0.5 * sin(theta * 2.0 - point.z * 7.0 + uPhase * 0.18);
  float contour = 0.5 + 0.5 * sin(theta * 4.0 + point.z * 3.0);
  vec3 pearl = mix(vec3(0.35, 0.84, 0.98), vec3(0.84, 0.43, 1.0), thinFilm);
  pearl = mix(pearl, vec3(1.0, 0.56, 0.38), contour * 0.28);
  float internalBloom = 0.5 + 0.5 * sin(theta * 6.0 + point.z * 10.0 - uPhase * 0.25);
  vec3 colour = pearl * (0.18 + cyanDiffuse * 0.50 + roseDiffuse * 0.34 + goldDiffuse * 0.26);
  colour += vec3(0.36, 0.92, 1.0) * cyanSpecular * (0.65 + uHigh * 0.17);
  colour += vec3(1.0, 0.40, 0.74) * roseSpecular * 0.50;
  colour += vec3(1.0, 0.80, 0.48) * goldSpecular * 0.68;
  colour += pearl * fresnel * (0.52 + uPulse * 0.15);
  colour += pearl * internalBloom * (0.08 + uEnergy * 0.06);

  // The object slightly illuminates the surrounding void at its contour.
  background += pearl * fresnel * 0.055;
  colour = mix(background, colour, exp(-travelled * 0.10));
  colour = 1.0 - exp(-colour * 1.48);
  colour += (hash21(gl_FragCoord.xy) - 0.5) * 0.006;
  gl_FragColor = vec4(max(colour, 0.0), 1.0);
}`;

type Runtime = {
  renderer: Renderer;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  mesh: Mesh;
  program: Program;
};

export const ResonanceFabric: React.FC<{ audio: ResonanceFabricAudio }> = ({ audio }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, height, width } = useVideoConfig();
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
        uPhase: { value: 0 },
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
    runtime.program.uniforms.uPhase.value = (frame / Math.max(durationInFrames, 1)) * Math.PI * 2;
    runtime.program.uniforms.uEnergy.value = 0.28 + audio.calmEnergy * 0.5;
    runtime.program.uniforms.uLow.value = 0.24 + audio.calmLow * 0.44;
    runtime.program.uniforms.uHigh.value = 0.18 + audio.calmHigh * 0.5;
    runtime.program.uniforms.uPulse.value = Math.min(0.56, 0.08 + audio.pulse * 0.25);
    runtime.renderer.render({ scene: runtime.mesh });
  }, [audio.calmEnergy, audio.calmHigh, audio.calmLow, audio.pulse, durationInFrames, frame]);

  return <div ref={hostRef} style={{ bottom: 0, left: 0, overflow: "hidden", position: "absolute", right: 0, top: 0 }} />;
};
