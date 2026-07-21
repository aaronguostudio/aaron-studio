export const AMBIENT_REFERENCE_SIZE = { width: 1920, height: 1080 };

export const AMBIENT_SCENES = {
  focus: {
    id: "focus",
    title: "Signal Loom",
    purpose: "Attention gathers into a legible system.",
    durationSec: 18,
    palette: "signal",
  },
  sleep: {
    id: "sleep",
    title: "Moon Tides",
    purpose: "Orbital motion lowers visual urgency.",
    durationSec: 24,
    palette: "lunar",
  },
  relax: {
    id: "relax",
    title: "Breath Field",
    purpose: "Coupled waves create a slow breathing field.",
    durationSec: 20,
    palette: "signal",
  },
};

export const AMBIENT_PALETTES = {
  mono: {
    background: "#040504",
    backgroundAlt: "#0b0d0c",
    primary: "#f2f5f1",
    muted: "#93a099",
    accent: "#d9e4dd",
    accentAlt: "#a7b3ac",
  },
  signal: {
    background: "#030706",
    backgroundAlt: "#0a1512",
    primary: "#effff8",
    muted: "#87a198",
    accent: "#63e6b5",
    accentAlt: "#8ca8ff",
  },
  lunar: {
    background: "#040510",
    backgroundAlt: "#101329",
    primary: "#f7f4ef",
    muted: "#858da8",
    accent: "#a996ff",
    accentAlt: "#7ed8ef",
  },
};

const W = AMBIENT_REFERENCE_SIZE.width;
const H = AMBIENT_REFERENCE_SIZE.height;
const TAU = Math.PI * 2;

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const mix = (from, to, amount) => from + (to - from) * amount;
const smoothstep = (edge0, edge1, value) => {
  const t = clamp((value - edge0) / Math.max(edge1 - edge0, 0.00001));
  return t * t * (3 - 2 * t);
};

const hash = (seed, index) => {
  const value = Math.sin(seed * 17.173 + index * 91.731) * 47453.5453;
  return value - Math.floor(value);
};

const rgba = (hex, alpha) => {
  const normalized = hex.replace("#", "");
  const expanded = normalized.length === 3
    ? normalized.split("").map((part) => `${part}${part}`).join("")
    : normalized;
  const value = Number.parseInt(expanded, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${clamp(alpha)})`;
};

const roundedRect = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

const resolvePalette = (palette) => {
  if (typeof palette === "object" && palette) return { ...AMBIENT_PALETTES.signal, ...palette };
  return AMBIENT_PALETTES[palette] ?? AMBIENT_PALETTES.signal;
};

const drawBackdrop = (ctx, palette, phase, intensity, seed) => {
  const base = ctx.createLinearGradient(0, 0, W, H);
  base.addColorStop(0, palette.backgroundAlt);
  base.addColorStop(0.44, palette.background);
  base.addColorStop(1, palette.backgroundAlt);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  const driftX = 960 + Math.sin(phase) * 170;
  const driftY = 500 + Math.cos(phase) * 64;
  const glow = ctx.createRadialGradient(driftX, driftY, 20, driftX, driftY, 760);
  glow.addColorStop(0, rgba(palette.accent, 0.075 * intensity));
  glow.addColorStop(0.42, rgba(palette.accentAlt, 0.035 * intensity));
  glow.addColorStop(1, rgba(palette.background, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = rgba(palette.primary, 0.022 * intensity);
  const grainCount = 210;
  for (let index = 0; index < grainCount; index += 1) {
    const x = hash(seed + 3, index) * W;
    const y = hash(seed + 19, index) * H;
    const size = hash(seed + 41, index) > 0.9 ? 1.8 : 1;
    ctx.fillRect(x, y, size, size);
  }

  const vignette = ctx.createRadialGradient(960, 520, 260, 960, 520, 1110);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(0.72, "rgba(0,0,0,0.12)");
  vignette.addColorStop(1, "rgba(0,0,0,0.72)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);
};

const drawFocusGrid = (ctx, palette, phase, intensity) => {
  const horizon = 262 + Math.sin(phase) * 8;
  ctx.save();
  ctx.strokeStyle = rgba(palette.muted, 0.18 * intensity);
  ctx.lineWidth = 1;

  for (let row = 0; row < 10; row += 1) {
    const progress = row / 9;
    const y = horizon + Math.pow(progress, 1.58) * 780;
    ctx.globalAlpha = 0.25 + progress * 0.7;
    ctx.beginPath();
    ctx.moveTo(118, y);
    ctx.lineTo(W - 118, y);
    ctx.stroke();
  }

  for (let column = -8; column <= 8; column += 1) {
    const bottomX = 960 + column * 122;
    const topX = 960 + column * 49;
    ctx.globalAlpha = 0.42 + Math.abs(column) * 0.025;
    ctx.beginPath();
    ctx.moveTo(topX, horizon);
    ctx.lineTo(bottomX, H + 40);
    ctx.stroke();
  }

  ctx.restore();
};

const focusModules = [
  { x: 650, y: 346, width: 244, height: 176, phase: 0.2 },
  { x: 934, y: 300, width: 306, height: 204, phase: 1.1 },
  { x: 1242, y: 390, width: 190, height: 144, phase: 2.2 },
  { x: 726, y: 584, width: 224, height: 164, phase: 3.2 },
  { x: 1010, y: 552, width: 278, height: 218, phase: 4.1 },
  { x: 1320, y: 640, width: 158, height: 132, phase: 5.3 },
];

const drawFocus = (ctx, palette, phase, progress, intensity, seed, audio) => {
  drawFocusGrid(ctx, palette, phase, intensity);
  const energy = clamp(audio.calmEnergy ?? audio.energy ?? 0.42);
  const low = clamp(audio.calmLow ?? audio.low ?? 0.44);
  const high = clamp(audio.calmHigh ?? audio.high ?? 0.34);
  const transient = clamp(audio.pulse ?? 0);
  const centers = [];

  ctx.save();
  ctx.translate(960, 540);
  ctx.scale(1.1, 1.1);
  ctx.translate(-960, -540);
  ctx.translate(Math.sin(phase) * 14, Math.cos(phase) * 7);

  for (let index = 0; index < focusModules.length; index += 1) {
    const item = focusModules[index];
    const local = phase + item.phase;
    const driftX = Math.sin(local) * (14 + index * 1.8);
    const driftY = Math.cos(local * 2) * (8 + index * 0.7);
    const pulse = 0.5 + 0.5 * Math.sin(local * 2);
    const x = item.x + driftX;
    const y = item.y + driftY;
    centers.push({ x: x + item.width / 2, y: y + item.height / 2 });

    roundedRect(ctx, x, y, item.width, item.height, 6);
    const fill = ctx.createLinearGradient(x, y, x + item.width, y + item.height);
    fill.addColorStop(0, rgba(palette.backgroundAlt, 0.44));
    fill.addColorStop(1, rgba(index % 2 ? palette.accentAlt : palette.accent, 0.028 + pulse * 0.03 + low * 0.024));
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = rgba(
      index % 2 ? palette.accentAlt : palette.primary,
      (0.25 + pulse * 0.25 + high * 0.11 + transient * 0.025) * intensity,
    );
    ctx.lineWidth = index === 4 ? 2 : 1.35;
    ctx.stroke();

    ctx.strokeStyle = rgba(palette.primary, (0.13 + pulse * 0.15 + high * 0.07) * intensity);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 22, y + item.height * 0.5);
    ctx.lineTo(x + item.width - 22, y + item.height * 0.5);
    ctx.stroke();

    const nodeRadius = 3.2 + pulse * 2.2;
    ctx.save();
    ctx.shadowColor = rgba(index % 2 ? palette.accentAlt : palette.accent, 0.42 + low * 0.18);
    ctx.shadowBlur = 7 + low * 12;
    ctx.fillStyle = rgba(
      index % 2 ? palette.accentAlt : palette.accent,
      (0.44 + pulse * 0.34 + energy * 0.08 + transient * 0.035) * intensity,
    );
    ctx.beginPath();
    ctx.arc(x + item.width * (index % 2 ? 0.72 : 0.3), y + item.height * 0.5, nodeRadius, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  const links = [[0, 1], [1, 2], [0, 3], [1, 4], [3, 4], [4, 5], [2, 5]];
  ctx.setLineDash([12, 16]);
  ctx.lineDashOffset = -progress * 28;
  ctx.lineWidth = 1.4;
  for (let index = 0; index < links.length; index += 1) {
    const [fromIndex, toIndex] = links[index];
    const from = centers[fromIndex];
    const to = centers[toIndex];
    const bend = (hash(seed, index) - 0.5) * 90;
    const controlX = (from.x + to.x) / 2 + bend;
    const controlY = (from.y + to.y) / 2 - bend * 0.34;
    ctx.strokeStyle = rgba(index % 3 === 0 ? palette.accent : palette.primary, (0.16 + energy * 0.12) * intensity);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.quadraticCurveTo(controlX, controlY, to.x, to.y);
    ctx.stroke();

    const routeProgress = (progress * (0.58 + index * 0.035) + hash(seed + 89, index)) % 1;
    const inverse = 1 - routeProgress;
    const routeX = inverse * inverse * from.x + 2 * inverse * routeProgress * controlX + routeProgress * routeProgress * to.x;
    const routeY = inverse * inverse * from.y + 2 * inverse * routeProgress * controlY + routeProgress * routeProgress * to.y;
    ctx.save();
    ctx.shadowColor = rgba(index % 3 === 0 ? palette.accent : palette.primary, 0.54);
    ctx.shadowBlur = 8 + low * 10;
    ctx.fillStyle = rgba(
      index % 3 === 0 ? palette.accent : palette.primary,
      (0.34 + high * 0.24 + transient * 0.05) * intensity,
    );
    ctx.beginPath();
    ctx.arc(routeX, routeY, 2.7 + (index % 2) * 0.6, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
  ctx.setLineDash([]);

  const sweepProgress = 0.5 - 0.5 * Math.cos(phase);
  const sweepX = 650 + sweepProgress * 820;
  const sweep = ctx.createLinearGradient(sweepX - 150, 0, sweepX + 150, 0);
  sweep.addColorStop(0, rgba(palette.accent, 0));
  sweep.addColorStop(0.5, rgba(palette.accent, (0.09 + energy * 0.08 + low * 0.045) * intensity));
  sweep.addColorStop(1, rgba(palette.accent, 0));
  ctx.fillStyle = sweep;
  ctx.fillRect(sweepX - 150, 286, 300, 540);

  ctx.restore();

  const focusPulse = 0.5 + 0.5 * Math.sin(phase);
  ctx.strokeStyle = rgba(palette.accent, (0.12 + focusPulse * 0.14 + energy * 0.045) * intensity);
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(1044, 538, 268 + focusPulse * 18, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = rgba(palette.primary, 0.08 * intensity);
  ctx.beginPath();
  ctx.arc(1044, 538, 358 - focusPulse * 12, 0, TAU);
  ctx.stroke();
};

const constellation = [
  [-0.62, -0.18], [-0.38, -0.45], [-0.08, -0.36], [0.18, -0.58],
  [0.46, -0.28], [0.33, 0.04], [0.58, 0.3], [0.2, 0.5], [-0.12, 0.28],
];

const drawCrescent = (ctx, x, y, radius, palette, intensity) => {
  ctx.save();
  ctx.shadowColor = rgba(palette.accentAlt, 0.42);
  ctx.shadowBlur = 30;
  const moon = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
  moon.addColorStop(0, rgba(palette.primary, 0.96));
  moon.addColorStop(0.56, rgba(palette.accentAlt, 0.72));
  moon.addColorStop(1, rgba(palette.accent, 0.28));
  ctx.fillStyle = moon;
  ctx.globalAlpha = intensity;
  ctx.beginPath();
  ctx.arc(x, y, radius, Math.PI * 0.42, Math.PI * 1.58, false);
  ctx.arc(x + radius * 0.48, y, radius * 0.82, Math.PI * 1.55, Math.PI * 0.45, true);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

const drawSleep = (ctx, palette, phase, _progress, intensity, seed, audio) => {
  const high = clamp(audio.high ?? 0.28);
  const centerX = 1000 + Math.sin(phase) * 22;
  const centerY = 550 + Math.cos(phase) * 12;

  for (let index = 0; index < 128; index += 1) {
    const x = hash(seed + 101, index) * W + Math.sin(phase + index) * 5;
    const y = 90 + hash(seed + 211, index) * 820 + Math.cos(phase * 2 + index) * 4;
    const harmonic = 1 + (index % 3);
    const twinkle = 0.5 + 0.5 * Math.sin(phase * harmonic + hash(seed + 313, index) * TAU);
    const radius = 0.6 + hash(seed + 401, index) * 1.7;
    ctx.fillStyle = rgba(index % 11 === 0 ? palette.accentAlt : palette.primary, (0.08 + twinkle * 0.42 + high * 0.05) * intensity);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(Math.sin(phase) * 0.025);
  const orbitRadii = [[410, 188], [330, 246], [246, 318]];
  orbitRadii.forEach(([rx, ry], index) => {
    ctx.strokeStyle = rgba(index === 1 ? palette.accent : palette.muted, (0.08 + index * 0.035) * intensity);
    ctx.lineWidth = index === 1 ? 1.5 : 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, index * 0.32 - 0.24, 0, TAU);
    ctx.stroke();

    const orbitPhase = phase * (index + 1) + index * 1.9;
    const px = Math.cos(orbitPhase) * rx;
    const py = Math.sin(orbitPhase) * ry;
    ctx.fillStyle = rgba(index === 1 ? palette.accent : palette.primary, (0.5 + high * 0.2) * intensity);
    ctx.beginPath();
    ctx.arc(px, py, 3.2 + index, 0, TAU);
    ctx.fill();
  });
  ctx.restore();

  drawCrescent(ctx, 820 + Math.sin(phase) * 16, 540 + Math.cos(phase) * 9, 138, palette, 0.78 * intensity);

  const rotation = Math.sin(phase) * 0.08;
  const scale = 340;
  const points = constellation.map(([x, y]) => {
    const px = x * Math.cos(rotation) - y * Math.sin(rotation);
    const py = x * Math.sin(rotation) + y * Math.cos(rotation);
    return { x: centerX + 160 + px * scale, y: centerY + py * scale };
  });
  ctx.strokeStyle = rgba(palette.accentAlt, 0.34 * intensity);
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0 || index === 6) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  points.forEach((point, index) => {
    const pulse = 0.5 + 0.5 * Math.sin(phase * (1 + index % 2) + index * 0.9);
    ctx.fillStyle = rgba(index === 3 ? palette.accent : palette.primary, (0.54 + pulse * 0.34) * intensity);
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3 + pulse * 2.4, 0, TAU);
    ctx.fill();
  });

  ctx.strokeStyle = rgba(palette.muted, 0.08 * intensity);
  for (let band = 0; band < 4; band += 1) {
    ctx.lineWidth = 1;
    ctx.beginPath();
    const baseY = 250 + band * 180;
    for (let x = 80; x <= W - 80; x += 18) {
      const y = baseY + Math.sin((x / W) * TAU * 1.5 + phase + band) * (14 + band * 4);
      if (x === 80) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
};

const drawRelax = (ctx, palette, phase, progress, intensity, seed, audio) => {
  const energy = clamp(audio.energy ?? 0.4);
  const low = clamp(audio.low ?? 0.44);
  const high = clamp(audio.high ?? 0.32);
  const field = ctx.createRadialGradient(960, 540, 80, 960, 540, 680);
  field.addColorStop(0, rgba(palette.accent, (0.06 + low * 0.04) * intensity));
  field.addColorStop(0.48, rgba(palette.accentAlt, 0.024 * intensity));
  field.addColorStop(1, rgba(palette.background, 0));
  ctx.fillStyle = field;
  ctx.fillRect(0, 0, W, H);

  const layers = 13;
  for (let layer = 0; layer < layers; layer += 1) {
    const normalized = layer / (layers - 1);
    const baseY = mix(230, 850, normalized);
    const frequency = 1 + (layer % 3);
    const speed = 1 + (layer % 2);
    const amplitude = 38 + (1 - Math.abs(normalized - 0.5) * 1.4) * 70 + low * 14;
    const localPhase = phase * speed + layer * 0.66;
    const bright = layer % 4 === 1;
    ctx.strokeStyle = rgba(
      bright ? palette.accent : layer % 3 === 0 ? palette.accentAlt : palette.primary,
      (bright ? 0.32 : 0.08 + high * 0.04) * intensity,
    );
    ctx.lineWidth = bright ? 2.1 : 1.1;
    ctx.beginPath();
    for (let x = -20; x <= W + 20; x += 10) {
      const u = x / W;
      const envelope = 0.72 + Math.sin(u * Math.PI) * 0.28;
      const primary = Math.sin(u * TAU * frequency + localPhase) * amplitude;
      const secondary = Math.sin(u * TAU * (frequency + 1) - localPhase * 0.5) * amplitude * 0.22;
      const y = baseY + (primary + secondary) * envelope;
      if (x === -20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  for (let index = 0; index < 28; index += 1) {
    const speed = 1 + (index % 3);
    const base = hash(seed + 601, index);
    const u = (base + progress * speed) % 1;
    const x = -40 + u * (W + 80);
    const band = index % 7;
    const baseY = 280 + band * 92;
    const y = baseY + Math.sin(u * TAU * (1 + band % 3) + phase * (1 + index % 2) + index) * (24 + band * 3);
    const edgeFade = smoothstep(0, 0.08, u) * (1 - smoothstep(0.92, 1, u));
    const size = 2 + hash(seed + 701, index) * 4;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(phase + index);
    ctx.fillStyle = rgba(index % 5 === 0 ? palette.accent : palette.primary, edgeFade * (0.22 + energy * 0.3) * intensity);
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.restore();
  }

  const breath = 0.5 + 0.5 * Math.sin(phase);
  ctx.strokeStyle = rgba(palette.accent, (0.1 + breath * 0.13) * intensity);
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(960, 540, 238 + breath * 30, 102 + breath * 15, 0, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = rgba(palette.accentAlt, 0.07 * intensity);
  ctx.beginPath();
  ctx.ellipse(960, 540, 370 - breath * 22, 162 - breath * 10, 0, 0, TAU);
  ctx.stroke();
};

export const getAmbientSceneMeta = (scene) => AMBIENT_SCENES[scene] ?? AMBIENT_SCENES.focus;

export function drawAmbientScene(ctx, options = {}) {
  if (!ctx) return;
  const scene = AMBIENT_SCENES[options.scene] ? options.scene : "focus";
  const meta = getAmbientSceneMeta(scene);
  const width = Math.max(1, options.width ?? ctx.canvas?.width ?? W);
  const height = Math.max(1, options.height ?? ctx.canvas?.height ?? H);
  const durationSec = Math.max(1, options.durationSec ?? meta.durationSec);
  const timeSec = Number.isFinite(options.timeSec) ? options.timeSec : 0;
  const progress = ((timeSec % durationSec) + durationSec) % durationSec / durationSec;
  const phase = progress * TAU;
  const intensity = clamp(options.intensity ?? 0.82, 0.2, 1.4);
  const seed = Number.isFinite(options.seed) ? options.seed : 2718;
  const palette = resolvePalette(options.palette ?? meta.palette);
  const audio = options.audio ?? {};

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.scale(width / W, height / H);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  drawBackdrop(ctx, palette, phase, intensity, seed);

  if (scene === "sleep") drawSleep(ctx, palette, phase, progress, intensity, seed, audio);
  else if (scene === "relax") drawRelax(ctx, palette, phase, progress, intensity, seed, audio);
  else drawFocus(ctx, palette, phase, progress, intensity, seed, audio);

  ctx.restore();
}
