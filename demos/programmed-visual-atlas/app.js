const glCanvas = document.querySelector("#gl-canvas");
const paintCanvas = document.querySelector("#paint-canvas");
const ctx = paintCanvas.getContext("2d", { alpha: false });
const studyList = document.querySelector("#study-list");
const title = document.querySelector("#study-title");
const medium = document.querySelector("#study-medium");
const description = document.querySelector("#study-description");
const interaction = document.querySelector("#study-interaction");
const counter = document.querySelector("#counter");

const TAU = Math.PI * 2;
const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, impulse: 0, active: false };
let width = 0;
let height = 0;
let dpr = 1;
let active = 0;
let last = performance.now();
let currentStudy = null;

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function smooth(current, target, amount) {
  return current + (target - current) * amount;
}

function hash(value) {
  const x = Math.sin(value * 91.341) * 47453.5453;
  return x - Math.floor(x);
}

function seeded(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function setCanvasSize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  for (const canvas of [paintCanvas, glCanvas]) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  studies.forEach((study) => study.reset?.());
  webgl?.resize();
}

function drawNoise(alpha = 0.035, spacing = 4) {
  ctx.save();
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  for (let y = 1; y < height; y += spacing) {
    for (let x = ((y / spacing) % 2) * 2; x < width; x += spacing) {
      if (hash(x * 0.13 + y * 3.71) > 0.84) ctx.fillRect(x, y, 1, 1);
    }
  }
  ctx.restore();
}

function clear(color = "#080a10") {
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

function radial(color, x, y, radius, alpha = 1) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color.replace("ALPHA", String(alpha)));
  gradient.addColorStop(1, color.replace("ALPHA", "0"));
  return gradient;
}

// ---------------------------------------------------------------------------
// 01 · native WebGL material field
// ---------------------------------------------------------------------------
function createWebgl() {
  const gl = glCanvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
  if (!gl) return null;

  const vertex = `attribute vec2 a_position; void main(){ gl_Position=vec4(a_position,0.0,1.0); }`;
  const fragment = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform vec2 u_pointer;
    uniform float u_time;
    uniform float u_impulse;
    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
    }
    float fbm(vec2 p){
      float v=0.; float a=.54;
      for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.04+13.1; a*=.49; }
      return v;
    }
    void main(){
      vec2 uv=(gl_FragCoord.xy*2.-u_resolution.xy)/min(u_resolution.x,u_resolution.y);
      vec2 p=uv;
      vec2 m=(u_pointer*2.-1.)*vec2(u_resolution.x/u_resolution.y,1.);
      float distanceToPointer=length(p-m);
      float lens=exp(-distanceToPointer*distanceToPointer*2.8)*(0.16+u_impulse*.25);
      float t=u_time*.055;
      p+=vec2(fbm(p*1.4+t),fbm(p*1.4-t))*0.36;
      float bands=sin((p.x+p.y*.68)*5.5 + fbm(p*3.0+t)*4.2 + lens*8.0);
      float pool=fbm(p*2.2-t*.4)+lens;
      float edge=smoothstep(.18,.92,abs(bands));
      float fluid=pow(1.0-edge,2.25);
      float tint=smoothstep(.24,.86,pool*.78+bands*.12);
      vec3 deep=vec3(.007,.011,.029);
      vec3 cobalt=vec3(.035,.17,.40);
      vec3 orchid=vec3(.48,.16,.62);
      vec3 cyan=vec3(.10,.69,.88);
      vec3 peach=vec3(.98,.42,.48);
      vec3 col=mix(deep,cobalt,.26+fluid*.32);
      col+=mix(orchid,cyan,tint)*fluid*.38;
      col+=peach*pow(max(0.,sin(p.x*3.2+p.y*2.1+t)),10.)*.16;
      col+=cyan*pow(max(0.,cos(p.x*2.5-p.y*3.4-t)),13.)*.15;
      col+=vec3(.99,.79,.63)*lens*.22;
      float vignette=1.-smoothstep(.35,1.32,length(uv));
      col*=.54+.46*vignette;
      col+=.015*(hash(gl_FragCoord.xy+u_time)-.5);
      gl_FragColor=vec4(col,1.0);
    }`;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_position");
  const uniforms = {
    resolution: gl.getUniformLocation(program, "u_resolution"),
    pointer: gl.getUniformLocation(program, "u_pointer"),
    time: gl.getUniformLocation(program, "u_time"),
    impulse: gl.getUniformLocation(program, "u_impulse"),
  };
  return {
    draw(time) {
      gl.viewport(0, 0, glCanvas.width, glCanvas.height);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(uniforms.resolution, glCanvas.width, glCanvas.height);
      gl.uniform2f(uniforms.pointer, pointer.x, 1 - pointer.y);
      gl.uniform1f(uniforms.time, time * 0.001);
      gl.uniform1f(uniforms.impulse, pointer.impulse);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    resize() { gl.viewport(0, 0, glCanvas.width, glCanvas.height); },
  };
}

let webgl;
try { webgl = createWebgl(); } catch (error) { console.warn("WebGL study disabled", error); }

function renderFerrofield(time) {
  if (webgl) {
    webgl.draw(time);
    return;
  }
  clear("#0b0b1c");
  const gradient = radial("rgba(88,190,222,ALPHA)", pointer.x * width, pointer.y * height, Math.max(width, height) * .8, .22);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

// ---------------------------------------------------------------------------
// 02 · quiet luminous strands
// ---------------------------------------------------------------------------
function renderVellumStrands(time) {
  clear("#08090e");
  const t = time * 0.00012;
  const centerY = height * 0.52;
  const colors = ["#5fe8f0", "#a66cf5", "#f6ab7e", "#73a9ff"];
  const pointerX = pointer.x * width;
  const pointerY = pointer.y * height;
  const phase = (pointerX / width - .5) * .35;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  colors.forEach((color, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    const base = centerY + (index - 1.5) * 5;
    const amplitude = height * (.105 + index * .012);
    const drift = Math.sin(t * .6 + index) * 0.11;
    for (const pass of [15, 4, 1.05]) {
      ctx.beginPath();
      for (let x = -20; x <= width + 20; x += 9) {
        const u = x / width;
        const focus = Math.exp(-Math.pow((x - pointerX) / (width * .19), 2));
        const slow = Math.sin(u * TAU * (1.05 + index * .13) + t * direction + phase);
        const second = Math.sin(u * TAU * (2.1 + index * .1) - t * .33) * .16;
        const y = base + amplitude * (slow * .72 + second + focus * (pointerY / height - .5) * .28 + drift);
        if (x < 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.lineWidth = pass;
      ctx.shadowColor = color;
      ctx.shadowBlur = pass * 1.6;
      ctx.strokeStyle = color;
      ctx.globalAlpha = pass === 1.05 ? .92 : pass === 4 ? .23 : .045;
      ctx.stroke();
    }
  });
  ctx.restore();
  ctx.globalAlpha = 1;
  drawNoise(.025, 5);
}

// ---------------------------------------------------------------------------
// 03 · hand-built 3D glass geometry
// ---------------------------------------------------------------------------
function rotate3(point, yaw, pitch) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const x = point.x * cy - point.z * sy;
  const z = point.x * sy + point.z * cy;
  return { x, y: point.y * cp - z * sp, z: point.y * sp + z * cp };
}

function project(point) {
  const distance = 4.3;
  const scale = Math.min(width, height) * .86 / (distance - point.z);
  return { x: width * .5 + point.x * scale, y: height * .5 - point.y * scale, z: point.z };
}

function polygon(points, fill, stroke, alpha = 1) {
  ctx.beginPath();
  points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
  ctx.closePath();
  ctx.globalAlpha = alpha;
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}

function renderGlassOrbit(time) {
  clear("#070a12");
  const yaw = -0.32 + (pointer.x - .5) * .78 + Math.sin(time * .00005) * .08;
  const pitch = .14 + (pointer.y - .5) * .23;
  const horizon = height * .63;

  ctx.save();
  ctx.lineWidth = 1;
  ctx.globalCompositeOperation = "screen";
  for (let depth = 0; depth < 20; depth += 1) {
    const z = -1.9 + depth * .18;
    const a = project(rotate3({ x: -2.7, y: -.72, z }, yaw, pitch));
    const b = project(rotate3({ x: 2.7, y: -.72, z }, yaw, pitch));
    ctx.strokeStyle = `rgba(112,166,222,${.012 + depth * .002})`;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }
  for (let column = -12; column <= 12; column += 1) {
    const x = column * .22;
    const a = project(rotate3({ x, y: -.72, z: -2 }, yaw, pitch));
    const b = project(rotate3({ x, y: -.72, z: 2.1 }, yaw, pitch));
    ctx.strokeStyle = "rgba(122,168,225,.055)";
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }
  ctx.restore();

  const plates = [
    { x: -1.08, y: .22, z: -.15, w: 1.05, h: 1.85, c: [95, 237, 240] },
    { x: .35, y: .36, z: .42, w: 1.45, h: 1.18, c: [204, 130, 249] },
    { x: .65, y: -.82, z: -.28, w: 1.62, h: .42, c: [245, 179, 121] },
  ];
  plates.forEach((plate, index) => {
    const offsets = [
      { x: -plate.w / 2, y: -plate.h / 2, z: 0 }, { x: plate.w / 2, y: -plate.h / 2, z: 0 },
      { x: plate.w / 2, y: plate.h / 2, z: 0 }, { x: -plate.w / 2, y: plate.h / 2, z: 0 },
    ];
    const points = offsets.map((offset) => project(rotate3({ x: plate.x + offset.x, y: plate.y + offset.y, z: plate.z + offset.z }, yaw, pitch)));
    const [r, g, b] = plate.c;
    polygon(points, `rgba(${r},${g},${b},.06)`, `rgba(${r},${g},${b},.77)`, 1);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowColor = `rgb(${r},${g},${b})`;
    ctx.shadowBlur = 24;
    ctx.lineWidth = 1.4;
    polygon(points, null, `rgba(${r},${g},${b},.64)`, .8);
    ctx.restore();
    if (index === 0) {
      const center = points.reduce((acc, item) => ({ x: acc.x + item.x / 4, y: acc.y + item.y / 4 }), { x: 0, y: 0 });
      ctx.fillStyle = radial(`rgba(${r},${g},${b},ALPHA)`, center.x, center.y, width * .23, .12);
      ctx.fillRect(0, 0, width, height);
    }
  });
  ctx.globalAlpha = 1;
  drawNoise(.018, 4);
}

// ---------------------------------------------------------------------------
// 04 · a slow field of particles, persistent and non-jittery
// ---------------------------------------------------------------------------
const flow = { particles: [], ready: false };
function resetFlow() { flow.ready = false; }
function initFlow() {
  const random = seeded(8181);
  const count = Math.min(2100, Math.max(900, Math.floor(width * height / 690)));
  flow.particles = Array.from({ length: count }, (_, index) => ({
    x: random() * width,
    y: random() * height,
    px: 0,
    py: 0,
    age: random() * 380,
    life: 240 + random() * 510,
    hue: index % 5,
  }));
  clear("#070a0d");
  flow.ready = true;
}
function renderFlowCensus(time, dt) {
  if (!flow.ready) initFlow();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(7,10,13,.045)";
  ctx.fillRect(0, 0, width, height);
  const t = time * .00013;
  const palette = ["#a8e9ea", "#8eaaf6", "#d9a1ef", "#f1bb90", "#ffffff"];
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineWidth = .72;
  for (const particle of flow.particles) {
    particle.px = particle.x;
    particle.py = particle.y;
    const nx = particle.x / width - .5;
    const ny = particle.y / height - .5;
    const dx = nx - (pointer.x - .5);
    const dy = ny - (pointer.y - .5);
    const pull = Math.exp(-(dx * dx + dy * dy) * 10) * (pointer.active ? 1 : .25);
    const angle = Math.sin(nx * 6.1 + ny * 2.4 + t) * 1.62 + Math.cos(ny * 7.3 - t * .7) * 1.26 + pull * Math.atan2(dy, dx);
    const speed = 0.34 + pull * .42 + pointer.impulse * .12;
    particle.x += Math.cos(angle) * speed * dt * .055;
    particle.y += Math.sin(angle) * speed * dt * .055;
    particle.age += dt * .06;
    if (particle.x < -8 || particle.x > width + 8 || particle.y < -8 || particle.y > height + 8 || particle.age > particle.life) {
      particle.x = hash(particle.age * 1.1 + particle.hue) * width;
      particle.y = hash(particle.age * 2.3 + particle.hue * 9) * height;
      particle.age = 0;
    }
    ctx.strokeStyle = palette[particle.hue];
    ctx.globalAlpha = .26;
    ctx.beginPath();
    ctx.moveTo(particle.px, particle.py);
    ctx.lineTo(particle.x, particle.y);
    ctx.stroke();
    ctx.globalAlpha = .19;
    ctx.fillStyle = palette[particle.hue];
    ctx.fillRect(particle.x - .45, particle.y - .45, .9, .9);
  }
  ctx.restore();
  drawNoise(.015, 6);
}

// ---------------------------------------------------------------------------
// 05 · real reaction-diffusion-style pixel material
// ---------------------------------------------------------------------------
const diffusion = { w: 0, h: 0, a: null, b: null, na: null, nb: null, offscreen: document.createElement("canvas"), offCtx: null, image: null };
diffusion.offCtx = diffusion.offscreen.getContext("2d");
function resetDiffusion() { diffusion.w = 0; }
function initDiffusion() {
  diffusion.w = Math.max(120, Math.floor(width / 5.5));
  diffusion.h = Math.max(80, Math.floor(height / 5.5));
  const size = diffusion.w * diffusion.h;
  diffusion.a = new Float32Array(size).fill(1);
  diffusion.b = new Float32Array(size);
  diffusion.na = new Float32Array(size);
  diffusion.nb = new Float32Array(size);
  const seed = seeded(2203);
  for (let i = 0; i < 36; i += 1) {
    const cx = Math.floor(seed() * diffusion.w);
    const cy = Math.floor(seed() * diffusion.h);
    for (let y = -4; y <= 4; y += 1) for (let x = -4; x <= 4; x += 1) {
      const px = (cx + x + diffusion.w) % diffusion.w;
      const py = (cy + y + diffusion.h) % diffusion.h;
      if (x * x + y * y < 15) diffusion.b[py * diffusion.w + px] = .86;
    }
  }
  diffusion.offscreen.width = diffusion.w;
  diffusion.offscreen.height = diffusion.h;
  diffusion.image = diffusion.offCtx.createImageData(diffusion.w, diffusion.h);
  for (let step = 0; step < 160; step += 1) diffuseStep(0);
}
function diffuseStep(feedShift) {
  const { w, h, a, b, na, nb } = diffusion;
  const da = 1.0, db = .52, feed = .022 + feedShift * .002, kill = .051;
  for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) {
    const index = y * w + x;
    const top = ((y - 1 + h) % h) * w;
    const bottom = ((y + 1) % h) * w;
    const left = (x - 1 + w) % w;
    const right = (x + 1) % w;
    const lapA = a[index] * -1 + (a[y * w + left] + a[y * w + right] + a[top + x] + a[bottom + x]) * .2 + (a[top + left] + a[top + right] + a[bottom + left] + a[bottom + right]) * .05;
    const lapB = b[index] * -1 + (b[y * w + left] + b[y * w + right] + b[top + x] + b[bottom + x]) * .2 + (b[top + left] + b[top + right] + b[bottom + left] + b[bottom + right]) * .05;
    const reaction = a[index] * b[index] * b[index];
    na[index] = clamp(a[index] + (da * lapA - reaction + feed * (1 - a[index])), 0, 1);
    nb[index] = clamp(b[index] + (db * lapB + reaction - (kill + feed) * b[index]), 0, 1);
  }
  diffusion.a = na; diffusion.na = a;
  diffusion.b = nb; diffusion.nb = b;
}
function seedDiffusion() {
  const cx = Math.floor(pointer.x * diffusion.w), cy = Math.floor(pointer.y * diffusion.h);
  for (let y = -6; y <= 6; y += 1) for (let x = -6; x <= 6; x += 1) {
    if (x * x + y * y > 42) continue;
    const px = (cx + x + diffusion.w) % diffusion.w;
    const py = (cy + y + diffusion.h) % diffusion.h;
    diffusion.b[py * diffusion.w + px] = .92;
  }
}
function renderCellularBloom(time) {
  if (!diffusion.w) initDiffusion();
  if (pointer.impulse > .18) seedDiffusion();
  for (let i = 0; i < 6; i += 1) diffuseStep(pointer.x - .5);
  const data = diffusion.image.data;
  for (let index = 0; index < diffusion.a.length; index += 1) {
    const value = clamp(diffusion.b[index] * 1.72 - diffusion.a[index] * .12);
    const body = Math.pow(value, .52);
    const rim = Math.pow(clamp(value * 1.9), 2.6);
    data[index * 4] = Math.floor(7 + body * 74 + rim * 126);
    data[index * 4 + 1] = Math.floor(10 + body * 88 + rim * 90);
    data[index * 4 + 2] = Math.floor(25 + body * 150 + rim * 62);
    data[index * 4 + 3] = 255;
  }
  diffusion.offCtx.putImageData(diffusion.image, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(diffusion.offscreen, 0, 0, width, height);
  const wash = radial("rgba(185,115,241,ALPHA)", pointer.x * width, pointer.y * height, Math.max(width, height) * .55, .13);
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = wash; ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "source-over";
  drawNoise(.017, 4);
}

// ---------------------------------------------------------------------------
// 06 · dithered topographic surface
// ---------------------------------------------------------------------------
function renderDitherTopography(time) {
  clear("#0a0d12");
  const t = time * .00011;
  const cols = Math.ceil(width / 18);
  const rows = Math.ceil(height / 18);
  const originX = width * .5;
  const originY = height * .56;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < cols; column += 1) {
      const x = (column / cols - .5) * 2;
      const y = (row / rows - .5) * 2;
      const px = column / cols * width;
      const py = row / rows * height;
      const dx = px / width - pointer.x;
      const dy = py / height - pointer.y;
      const lens = Math.exp(-(dx * dx + dy * dy) * 18);
      const wave = Math.sin(x * 5.2 + t) * .35 + Math.cos(y * 4.1 - t * .7) * .28 + Math.sin((x + y) * 7.2 + t * .4) * .16 + lens * .55;
      const depth = (wave + 1) * .5;
      const horizon = (py - originY) * .21;
      const size = Math.max(.7, 1.2 + depth * 5.8 - Math.abs(horizon) * .012);
      const cool = Math.floor(135 + depth * 100);
      const warm = Math.floor(150 + (1 - depth) * 75);
      ctx.fillStyle = row % 2 ? `rgba(${warm},${cool},255,${.05 + depth * .38})` : `rgba(255,${warm},${cool},${.035 + depth * .25})`;
      ctx.fillRect(px - size * .5, py - size * .5, size, size);
    }
  }
  ctx.restore();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = radial("rgba(114,238,245,ALPHA)", pointer.x * width, pointer.y * height, Math.max(width, height) * .46, .14);
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "source-over";
  drawNoise(.024, 4);
}

const studies = [
  {
    title: "Ferrofield",
    medium: "01 / native WebGL material study",
    description: "A dense, liquid chroma field rendered entirely in a fragment shader. The cursor opens a slow pressure lens rather than throwing the surface around.",
    interaction: "pointer / a local change in viscosity and reflected light",
    mode: "webgl",
    render: renderFerrofield,
  },
  {
    title: "Vellum Strands",
    medium: "02 / luminous spline installation",
    description: "Coupled ribbons share one calm gesture, so the light reads as a single suspended object instead of an equalizer or a bundle of unrelated lines.",
    interaction: "pointer / a soft, local curvature in the shared field",
    mode: "canvas",
    render: renderVellumStrands,
  },
  {
    title: "Glass Orbit",
    medium: "03 / hand-built projected geometry",
    description: "A camera-stable glass room made from projected planes and light edges. It has genuine depth without needing an image, a model, or a fake 3D filter.",
    interaction: "pointer / changes the viewing angle of the architectural volume",
    mode: "canvas",
    render: renderGlassOrbit,
  },
  {
    title: "Flow Census",
    medium: "04 / deterministic particle field",
    description: "A large field of fine particles follows a continuous potential flow. It leaves a quiet trace and makes the viewer feel the current before they see the equation.",
    interaction: "pointer / a contained attractor in the flow, click to add energy",
    mode: "canvas",
    render: renderFlowCensus,
    reset: resetFlow,
  },
  {
    title: "Cellular Bloom",
    medium: "05 / reaction-diffusion pixel material",
    description: "A small chemical simulation is scaled into a deep, living texture. It is computational and tactile, but not illustrative or literal.",
    interaction: "pointer / seeds new pigment into the live substrate",
    mode: "canvas",
    render: renderCellularBloom,
    reset: resetDiffusion,
  },
  {
    title: "Dither Topography",
    medium: "06 / pixel landscape",
    description: "A single dot field becomes a low-relief surface through density, palette, and perspective. It has a retro computational texture without becoming a gimmick.",
    interaction: "pointer / a local elevation and colour-temperature shift",
    mode: "canvas",
    render: renderDitherTopography,
  },
];

function applyStudy(index) {
  active = (index + studies.length) % studies.length;
  currentStudy = studies[active];
  glCanvas.style.display = currentStudy.mode === "webgl" && webgl ? "block" : "none";
  paintCanvas.style.display = currentStudy.mode === "webgl" && webgl ? "none" : "block";
  title.textContent = currentStudy.title;
  medium.textContent = currentStudy.medium;
  description.textContent = currentStudy.description;
  interaction.textContent = currentStudy.interaction;
  counter.textContent = `${String(active + 1).padStart(2, "0")} / ${String(studies.length).padStart(2, "0")}`;
  [...studyList.children].forEach((button, buttonIndex) => button.setAttribute("aria-current", String(buttonIndex === active)));
  currentStudy.reset?.();
}

studies.forEach((study, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = String(index + 1).padStart(2, "0");
  button.title = study.title;
  button.addEventListener("click", () => applyStudy(index));
  studyList.append(button);
});

document.querySelector("#previous").addEventListener("click", () => applyStudy(active - 1));
document.querySelector("#next").addEventListener("click", () => applyStudy(active + 1));
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") applyStudy(active - 1);
  if (event.key === "ArrowRight") applyStudy(active + 1);
  if (/^[1-6]$/.test(event.key)) applyStudy(Number(event.key) - 1);
});
window.addEventListener("pointermove", (event) => {
  pointer.tx = event.clientX / width;
  pointer.ty = event.clientY / height;
  pointer.active = true;
});
window.addEventListener("pointerleave", () => { pointer.active = false; });
window.addEventListener("pointerdown", (event) => {
  pointer.tx = event.clientX / width;
  pointer.ty = event.clientY / height;
  pointer.impulse = 1;
  pointer.active = true;
});
window.addEventListener("resize", setCanvasSize);

function loop(now) {
  const dt = Math.min(33, now - last);
  last = now;
  pointer.x = smooth(pointer.x, pointer.tx, .045);
  pointer.y = smooth(pointer.y, pointer.ty, .045);
  pointer.impulse = smooth(pointer.impulse, 0, .018);
  currentStudy.render(now, dt);
  requestAnimationFrame(loop);
}

setCanvasSize();
applyStudy(0);
requestAnimationFrame(loop);
