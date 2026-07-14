import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NeonStrands } from "./NeonStrands";
import { NeonOrb } from "./NeonOrb";
import { ExperimentalFields, type ExperimentalFieldVariant } from "./ExperimentalFields";
import { MaterialStudies, type MaterialStudyVariant } from "./MaterialStudies";

export type MusicVisualizerTheme = "paper-moon" | "deep-ink" | "soft-slate";
export type MusicVisualizerStyle = "ink-current" | "paper-resonance" | "soft-relic" | "lofi-wave" | "coffee-room" | "folded-light" | "neon-strands" | "neon-orb" | "prism-chamber" | "wave-grid" | "signal-bloom" | "clay-atlas" | "pigment-tide" | "paper-atlas" | "audio-mix";

export type AudioMixWeights = [number, number, number];

export interface AudioAnalysisFrame {
  t: number;
  rms: number;
  low: number;
  mid: number;
  high: number;
  centroid: number;
  flux: number;
  pulse: number;
  energy: number;
  calmEnergy: number;
  calmLow: number;
  calmHigh: number;
  mix: AudioMixWeights;
}

export interface AudioAnalysis {
  analysisVersion: number;
  sampleRate: number;
  fps: number;
  durationSec: number;
  frameCount: number;
  features: string[];
  sections: Array<{
    startFrame: number;
    endFrame: number;
    startSec: number;
    endSec: number;
    style: MusicVisualizerStyle;
  }>;
  frames: AudioAnalysisFrame[];
}

export interface MusicVisualizerProps {
  title: string;
  artist?: string;
  trackLabel?: string;
  audioFile: string;
  durationSec: number;
  seed?: number;
  theme?: MusicVisualizerTheme;
  visualStyle?: MusicVisualizerStyle;
  volume?: number;
  audioAnalysis?: AudioAnalysis;
}

export const defaultMusicVisualizerProps: MusicVisualizerProps = {
  title: "Paper Moon",
  artist: "Quiet Hours",
  trackLabel: "study / focus",
  audioFile: "music-visualizer/music.mp3",
  durationSec: 45,
  seed: 42,
  theme: "paper-moon",
  visualStyle: "ink-current",
  volume: 0.92,
};

type Palette = {
  background: string;
  surface: string;
  surfaceAlt: string;
  ink: string;
  mutedInk: string;
  accent: string;
};

const PALETTES: Record<MusicVisualizerTheme, Palette> = {
  "paper-moon": {
    background: "#e9e4dc",
    surface: "#f7f3ec",
    surfaceAlt: "#d6cec2",
    ink: "#25231f",
    mutedInk: "#79736a",
    accent: "#9d765d",
  },
  "deep-ink": {
    background: "#15171b",
    surface: "#272c33",
    surfaceAlt: "#3b434b",
    ink: "#f0e9dc",
    mutedInk: "#a5a9af",
    accent: "#caa979",
  },
  "soft-slate": {
    background: "#cfd7d8",
    surface: "#eef2f0",
    surfaceAlt: "#a7b7b9",
    ink: "#233238",
    mutedInk: "#64747a",
    accent: "#9b7464",
  },
};

const hash = (value: number): number => {
  const x = Math.sin(value * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const TWO_PI = Math.PI * 2;
const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));
const smoothstep = (value: number): number => value * value * (3 - 2 * value);
const slowOscillation = (timeSec: number, periodSec: number, phase = 0): number => (
  Math.sin((timeSec / Math.max(periodSec, 1)) * TWO_PI + phase) * 0.5 + 0.5
);

const chapterProgress = (timeSec: number, durationSec: number): number => {
  const normalized = clamp01(timeSec / Math.max(durationSec, 1));
  return smoothstep((normalized * 4) % 1);
};

const energyAt = (timeSec: number, durationSec: number): number => {
  const normalized = clamp01(timeSec / Math.max(durationSec, 1));
  const chapters = [0.28, 0.48, 0.36, 0.62, 0.25];
  const scaled = normalized * (chapters.length - 1);
  const index = Math.min(chapters.length - 2, Math.floor(scaled));
  const local = smoothstep(scaled - index);
  return chapters[index] + (chapters[index + 1] - chapters[index]) * local;
};

const fallbackAudioFrame = (timeSec: number, durationSec: number, seed: number): AudioAnalysisFrame => {
  const energy = clamp01(0.38 + 0.22 * Math.sin(timeSec * 0.22 + seed) + 0.12 * Math.sin(timeSec * 0.63));
  const pulse = clamp01(0.18 + 0.2 * Math.max(0, Math.sin(timeSec * 1.4 + seed)));
  return {
    t: timeSec,
    rms: energy,
    low: clamp01(0.38 + 0.15 * Math.sin(timeSec * 0.16)),
    mid: clamp01(0.46 + 0.18 * Math.sin(timeSec * 0.31 + seed)),
    high: clamp01(0.32 + 0.2 * Math.sin(timeSec * 0.57)),
    centroid: clamp01(0.52 + 0.14 * Math.sin(timeSec * 0.27 + seed)),
    flux: pulse,
    pulse,
    energy: Math.max(energy, energyAt(timeSec, durationSec)),
    calmEnergy: Math.max(energy, energyAt(timeSec, durationSec)),
    calmLow: 0.38,
    calmHigh: 0.32,
    mix: [1, 0, 0],
  };
};

const audioFrameAt = (
  analysis: AudioAnalysis | undefined,
  frame: number,
  timeSec: number,
  durationSec: number,
  seed: number,
): AudioAnalysisFrame => {
  if (!analysis?.frames?.length) return fallbackAudioFrame(timeSec, durationSec, seed);
  const index = Math.max(0, Math.min(analysis.frames.length - 1, Math.round(frame * analysis.fps / 30)));
  return analysis.frames[index] || fallbackAudioFrame(timeSec, durationSec, seed);
};

const cubicPoint = (
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  t: number,
): [number, number] => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};

const routePoint = (progress: number): [number, number] => {
  const first: [[number, number], [number, number], [number, number], [number, number]] = [
    [380, 690],
    [590, 310],
    [875, 350],
    [1060, 560],
  ];
  const second: [[number, number], [number, number], [number, number], [number, number]] = [
    [1060, 560],
    [1260, 790],
    [1430, 760],
    [1540, 390],
  ];
  const t = ((progress % 1) + 1) % 1;
  return t < 0.5
    ? cubicPoint(...first, t * 2)
    : cubicPoint(...second, (t - 0.5) * 2);
};

const wavePath = (timeSec: number, amplitude: number, baseline: number, phase: number, harmonic: number): string => {
  const left = 260;
  const right = 1660;
  const segments = 12;
  const points = Array.from({ length: segments + 1 }, (_, index) => {
    const progress = index / segments;
    const envelope = Math.sin(Math.PI * progress) ** 0.7;
    const x = left + (right - left) * progress;
    const y = baseline + Math.sin(progress * TWO_PI * harmonic + timeSec * 0.045 + phase) * amplitude * envelope;
    return [x, y] as [number, number];
  });

  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point[0]} ${point[1]}`;
    const previous = points[index - 1];
    const midpoint = (previous[0] + point[0]) / 2;
    return `${path} C ${midpoint} ${previous[1]} ${midpoint} ${point[1]} ${point[0]} ${point[1]}`;
  }, "");
};

const introOpacity = (frame: number, fps: number, durationSec: number): number => {
  const intro = interpolate(frame, [0, fps * 1.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const outro = interpolate(frame, [Math.max(0, durationSec * fps - fps * 1.6), durationSec * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(intro, outro);
};

const Grain: React.FC<{ color: string; seed: number }> = ({ color, seed }) => (
  <>
    {Array.from({ length: 120 }, (_, index) => (
      <circle
        key={index}
        cx={hash(index + seed + 1) * 1920}
        cy={hash(index + seed + 101) * 1080}
        r={0.45 + hash(index + seed + 201) * 1.1}
        fill={color}
        opacity={0.014 + hash(index + seed + 301) * 0.028}
      />
    ))}
  </>
);

const Chrome: React.FC<{
  colors: Palette;
  title: string;
  artist?: string;
  trackLabel?: string;
  opacity: number;
}> = ({ colors, title, artist, trackLabel, opacity }) => (
  <g opacity={opacity} fontFamily="Georgia, 'Times New Roman', serif" fill={colors.ink}>
    <text x="88" y="100" fontSize="23" letterSpacing="2.1" opacity="0.86">
      {artist || "Quiet Hours"}
    </text>
    <text x="1832" y="100" textAnchor="end" fontSize="15" letterSpacing="1.5" fill={colors.mutedInk}>
      {(trackLabel || "study / focus").toUpperCase()}
    </text>
    <text x="88" y="965" fontSize="42" letterSpacing="-0.8">
      {title}
    </text>
    <text x="88" y="1002" fontSize="15" letterSpacing="1.8" fill={colors.mutedInk}>
      QUIET HOURS · VISUAL STUDY 01
    </text>
  </g>
);

const InkCurrent: React.FC<{ colors: Palette; timeSec: number; durationSec: number; seed: number; opacity: number; audio: AudioAnalysisFrame }> = ({
  colors,
  timeSec,
  durationSec,
  seed,
  opacity,
  audio,
}) => {
  const reveal = interpolate(timeSec, [0, Math.min(7, durationSec * 0.3)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const drift = timeSec * (0.003 + audio.calmEnergy * 0.0011);
  const nodes = [0.04, 0.17, 0.31, 0.46, 0.61, 0.77, 0.92];
  const pulsePeriod = Math.max(150, durationSec * 0.34);
  const pulseProgress = (timeSec / pulsePeriod + 0.04) % 1;
  const [pulseX, pulseY] = routePoint(pulseProgress);
  const longBreath = slowOscillation(timeSec, Math.max(112, durationSec * 0.22), seed);

  return (
    <g opacity={opacity}>
      <path
        d="M 380 690 C 590 310 875 350 1060 560 S 1430 760 1540 390"
        fill="none"
        stroke={colors.ink}
        strokeWidth="2"
        opacity="0.17"
      />
      <path
        d="M 380 690 C 590 310 875 350 1060 560 S 1430 760 1540 390"
        fill="none"
        stroke={colors.accent}
        strokeWidth={2 + audio.calmEnergy * 0.45}
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - reveal}
        opacity={0.7 + audio.calmEnergy * 0.12}
      />
      <path
        d="M 430 744 C 650 392 900 420 1070 610 S 1400 790 1500 450"
        fill="none"
        stroke={colors.ink}
        strokeWidth="1"
        opacity="0.12"
      />

      {nodes.map((node, index) => {
        const progress = node + drift + Math.sin(timeSec * 0.045 + index + seed) * 0.004;
        const [x, y] = routePoint(progress);
        const depth = 0.68 + 0.22 * Math.sin(progress * Math.PI * 2);
        const radius = 12 + (index % 3) * 2;
        const active = clamp01(0.72 + audio.calmEnergy * 0.12 + (longBreath - 0.5) * 0.05 + Math.sin(timeSec * 0.04 + index) * 0.02);
        return (
          <g key={index} opacity={depth * active}>
            <circle cx={x} cy={y} r={radius + 9} fill="none" stroke={colors.ink} strokeWidth="1" opacity="0.16" />
            <circle cx={x} cy={y} r={radius} fill={index % 2 ? colors.surface : colors.ink} stroke={colors.ink} strokeWidth="2" />
            <circle cx={x - radius * 0.28} cy={y - radius * 0.28} r="2.5" fill={colors.accent} opacity={0.52 + audio.calmHigh * 0.18} />
          </g>
        );
      })}

      <circle cx={pulseX} cy={pulseY} r="17" fill="none" stroke={colors.accent} strokeWidth="1.5" opacity={0.1 + audio.pulse * 0.12} />
      <circle cx={pulseX} cy={pulseY} r="3.5" fill={colors.accent} opacity={0.5 + audio.pulse * 0.2} />

      <g fontFamily="Georgia, 'Times New Roman', serif" fill={colors.mutedInk} fontSize="13" letterSpacing="2">
        <text x="380" y="770">MOTIF / 01</text>
        <text x="1540" y="350" textAnchor="end">A QUIET LINE IN MOTION</text>
      </g>
    </g>
  );
};

const PaperResonance: React.FC<{ colors: Palette; timeSec: number; durationSec: number; seed: number; opacity: number; audio: AudioAnalysisFrame }> = ({
  colors,
  timeSec,
  durationSec,
  seed,
  opacity,
  audio,
}) => {
  const energy = audio.calmEnergy;
  const sweepPeriod = Math.max(140, durationSec * 0.26);
  const sweepProgress = (timeSec % sweepPeriod) / sweepPeriod;
  const sweepX = interpolate(sweepProgress, [0, 1], [420, 1510], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const longBreath = slowOscillation(timeSec, Math.max(118, durationSec * 0.2), seed + 1);
  const barXs = [510, 650, 790, 930, 1070, 1210, 1350, 1490];

  return (
    <g opacity={opacity}>
      <path d="M 390 625 C 690 555 1030 690 1530 575" fill="none" stroke={colors.ink} strokeWidth="2" opacity="0.2" />
      <path d="M 390 625 C 690 555 1030 690 1530 575" fill="none" stroke={colors.accent} strokeWidth="2" opacity="0.62" />
      <path d="M 420 360 H 1500" fill="none" stroke={colors.ink} strokeWidth="1" opacity="0.12" />
      <path d="M 420 820 H 1500" fill="none" stroke={colors.ink} strokeWidth="1" opacity="0.12" />

      {barXs.map((x, index) => {
        const baseline = 612 + Math.sin(index * 0.7) * 26;
        const height = 54 + energy * 64 + audio.calmLow * 14 + (longBreath - 0.5) * 12 + Math.sin(timeSec * 0.045 + index * 0.68 + seed) * (2 + energy * 3);
        const width = 23 + energy * 3;
        const y = baseline - Math.max(30, height);
        const sweepDistance = Math.abs(index - sweepProgress * (barXs.length - 1));
        const sweepLift = Math.exp(-sweepDistance * 0.8);
        return (
          <g key={index}>
            <line x1={x} y1={baseline + 18} x2={x} y2={y - 20} stroke={colors.ink} strokeWidth="1" opacity="0.13" />
            <rect x={x - width / 2} y={y} width={width} height={height} rx={width / 2} fill={index % 3 === 0 ? colors.accent : colors.ink} opacity={0.2 + energy * 0.2 + audio.calmLow * 0.08} stroke={colors.accent} strokeWidth="1.5" strokeOpacity={sweepLift * 0.22} />
            <circle cx={x} cy={baseline} r="5" fill={colors.surface} stroke={colors.ink} strokeWidth="2" opacity="0.9" />
          </g>
        );
      })}

      <line x1={sweepX} y1="330" x2={sweepX} y2="845" stroke={colors.accent} strokeWidth="1.5" opacity={0.26 + audio.pulse * 0.1} />
      <circle cx={sweepX} cy="625" r="5" fill={colors.accent} opacity={0.7 + audio.pulse * 0.12} />

      <g fontFamily="Georgia, 'Times New Roman', serif" fill={colors.mutedInk} fontSize="13" letterSpacing="2">
        <text x="420" y="315">BREATH / 02</text>
        <text x="1500" y="875" textAnchor="end">A SMALL FIELD OF RESONANCE</text>
      </g>
    </g>
  );
};

const SoftRelic: React.FC<{ colors: Palette; timeSec: number; durationSec: number; seed: number; opacity: number; audio: AudioAnalysisFrame }> = ({
  colors,
  timeSec,
  durationSec,
  seed,
  opacity,
  audio,
}) => {
  const energy = audio.calmEnergy;
  const rotation = (slowOscillation(timeSec, Math.max(180, durationSec * 0.36), seed) - 0.5) * 1.1 + audio.centroid * 0.15;
  const scale = 1 + (slowOscillation(timeSec, Math.max(150, durationSec * 0.3), seed + 2) - 0.5) * 0.008 + (energy - 0.5) * 0.004;
  const lightPhase = slowOscillation(timeSec, Math.max(160, durationSec * 0.32), seed + 3);
  const lightX = 900 + lightPhase * 130 + audio.calmHigh * 14;
  const foldPhase = slowOscillation(timeSec, Math.max(130, durationSec * 0.24), seed + 4);
  const relicPath = "M 960 285 C 1090 288 1182 420 1142 575 C 1106 718 1018 818 878 790 C 748 764 704 616 748 476 C 788 350 852 282 960 285 Z";

  return (
    <g opacity={opacity} transform={`rotate(${rotation} 960 560) scale(${scale})`}>
      <path d={relicPath} transform="translate(-42 28)" fill={colors.ink} opacity="0.12" />
      <path d={relicPath} transform="translate(32 -16)" fill={colors.surfaceAlt} opacity="0.4" />
      <path d={relicPath} fill={colors.surface} stroke={colors.ink} strokeWidth="2" opacity="0.92" />
      <path d="M 900 320 C 1000 370 1060 482 1028 602 C 1000 704 930 756 850 740" fill="none" stroke={colors.accent} strokeWidth="3" opacity="0.52" />
      <path d="M 1002 340 C 1065 420 1088 502 1062 590" fill="none" stroke={colors.ink} strokeWidth="1" opacity="0.32" />
      <ellipse cx={lightX} cy="400" rx="58" ry="18" fill={colors.accent} opacity={0.13 + energy * 0.08 + audio.calmHigh * 0.08} transform={`rotate(-24 ${lightX} 400)`} />
      <path d="M 812 674 C 876 700 942 700 1008 662" fill="none" stroke={colors.accent} strokeWidth="2" opacity={0.18 + foldPhase * 0.12 + audio.calmLow * 0.06} />
      <path d="M 826 690 C 874 708 922 708 964 686" fill="none" stroke={colors.ink} strokeWidth="1" opacity={0.12 + (1 - foldPhase) * 0.1} />
    </g>
  );
};

const LofiWave: React.FC<{ colors: Palette; timeSec: number; durationSec: number; seed: number; opacity: number; audio: AudioAnalysisFrame }> = ({
  colors,
  timeSec,
  durationSec,
  seed,
  opacity,
  audio,
}) => {
  const energy = audio.calmEnergy;
  const waveAmplitude = 26 + energy * 34 + audio.calmLow * 16;
  const slowPhase = slowOscillation(timeSec, Math.max(96, durationSec * 1.5), seed + 1);
  const orbX = 960 + (slowOscillation(timeSec, Math.max(120, durationSec * 1.8), seed + 2) - 0.5) * 250;
  const orbY = 430 + (slowOscillation(timeSec, Math.max(150, durationSec * 2.1), seed + 3) - 0.5) * 70;
  const tilt = (slowPhase - 0.5) * 4 + audio.centroid * 0.2;
  const glowId = `lofi-glow-${seed}`;
  const surfaceId = `lofi-surface-${seed}`;

  return (
    <g opacity={opacity}>
      <defs>
        <linearGradient id={glowId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={colors.accent} stopOpacity="0.05" />
          <stop offset="0.5" stopColor={colors.accent} stopOpacity="0.24" />
          <stop offset="1" stopColor={colors.surface} stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id={surfaceId} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor={colors.surface} stopOpacity="0.92" />
          <stop offset="0.55" stopColor={colors.surfaceAlt} stopOpacity="0.68" />
          <stop offset="1" stopColor={colors.background} stopOpacity="0.34" />
        </linearGradient>
      </defs>

      <path d="M 260 700 H 1660" fill="none" stroke={colors.ink} strokeWidth="1" opacity="0.2" />
      <path d="M 420 700 V 360 M 720 700 V 360 M 1020 700 V 360 M 1320 700 V 360" fill="none" stroke={colors.ink} strokeWidth="1" opacity="0.08" />
      <path d={wavePath(timeSec, waveAmplitude, 580, 0.2, 1)} fill="none" stroke={colors.accent} strokeWidth="3" opacity={0.72 + energy * 0.1} />
      <path d={wavePath(timeSec * 0.86, waveAmplitude * 0.58, 580, 2.1, 2)} fill="none" stroke={colors.ink} strokeWidth="1.5" opacity={0.28 + audio.calmHigh * 0.12} />
      <path d={wavePath(timeSec * 0.64, waveAmplitude * 0.34, 580, 4.2, 3)} fill="none" stroke={colors.surface} strokeWidth="1" opacity="0.48" />

      <g transform={`rotate(${tilt} ${orbX} ${orbY})`}>
        <ellipse cx={orbX + 22} cy={orbY + 34} rx="210" ry="74" fill={colors.ink} opacity="0.16" />
        <ellipse cx={orbX} cy={orbY} rx="210" ry="74" fill={`url(#${surfaceId})`} stroke={colors.ink} strokeWidth="2" opacity="0.94" />
        <ellipse cx={orbX - 8} cy={orbY - 10} rx="182" ry="48" fill={`url(#${glowId})`} opacity={0.55 + audio.calmHigh * 0.12} />
        <path d={`M ${orbX - 138} ${orbY + 18} C ${orbX - 60} ${orbY - 34} ${orbX + 46} ${orbY - 38} ${orbX + 132} ${orbY + 8}`} fill="none" stroke={colors.accent} strokeWidth="2" opacity="0.48" />
        <path d={`M ${orbX - 116} ${orbY + 34} C ${orbX - 38} ${orbY - 3} ${orbX + 42} ${orbY - 8} ${orbX + 104} ${orbY + 23}`} fill="none" stroke={colors.ink} strokeWidth="1" opacity="0.28" />
        <circle cx={orbX + 128} cy={orbY - 8} r="5" fill={colors.accent} opacity={0.42 + audio.pulse * 0.12} />
      </g>

      <g fontFamily="Georgia, 'Times New Roman', serif" fill={colors.mutedInk} fontSize="13" letterSpacing="2">
        <text x="260" y="320">LOFI WAVE / 03</text>
        <text x="1660" y="745" textAnchor="end">A SOFT SIGNAL FOR DEEP WORK</text>
      </g>
    </g>
  );
};

const CoffeeRoom: React.FC<{ colors: Palette; timeSec: number; durationSec: number; seed: number; opacity: number; audio: AudioAnalysisFrame }> = ({
  colors,
  timeSec,
  durationSec,
  seed,
  opacity,
  audio,
}) => {
  const lightPhase = slowOscillation(timeSec, Math.max(150, durationSec * 2.2), seed + 5);
  const steamPhase = slowOscillation(timeSec, Math.max(84, durationSec * 1.4), seed + 7);
  const lightX = 390 + lightPhase * 1190;
  const steamLift = (steamPhase - 0.5) * 8;
  const windowLightOpacity = 0.08 + audio.calmEnergy * 0.06 + audio.calmHigh * 0.025;
  const steamOpacity = 0.18 + audio.calmHigh * 0.12 + audio.calmEnergy * 0.04;
  const windowId = `coffee-window-${seed}`;
  const lightId = `coffee-light-${seed}`;
  const mugId = `coffee-mug-${seed}`;

  return (
    <g opacity={opacity}>
      <defs>
        <linearGradient id={windowId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors.surface} stopOpacity="0.96" />
          <stop offset="0.72" stopColor={colors.surfaceAlt} stopOpacity="0.46" />
          <stop offset="1" stopColor={colors.background} stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id={lightId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={colors.accent} stopOpacity="0" />
          <stop offset="0.5" stopColor={colors.accent} stopOpacity={windowLightOpacity} />
          <stop offset="1" stopColor={colors.accent} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={mugId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={colors.surface} stopOpacity="0.98" />
          <stop offset="0.62" stopColor={colors.surfaceAlt} stopOpacity="0.92" />
          <stop offset="1" stopColor={colors.accent} stopOpacity="0.52" />
        </linearGradient>
      </defs>

      <rect x="350" y="188" width="1220" height="492" rx="8" fill={`url(#${windowId})`} stroke={colors.ink} strokeWidth="2" opacity="0.56" />
      <rect x="378" y="216" width="1164" height="436" fill={colors.background} opacity="0.18" />
      <path d="M 860 216 V 652 M 1270 216 V 652" fill="none" stroke={colors.ink} strokeWidth="2" opacity="0.15" />
      <path d="M 378 432 H 1542" fill="none" stroke={colors.ink} strokeWidth="2" opacity="0.12" />
      <path d="M 410 620 C 620 546 820 566 1020 612 S 1370 660 1520 575" fill="none" stroke={colors.surface} strokeWidth="28" opacity="0.36" />
      <rect x={lightX - 250} y="218" width="500" height="430" fill={`url(#${lightId})`} opacity="0.78" transform={`rotate(-7 ${lightX} 430)`} />

      <path d="M 300 682 C 680 652 1160 682 1620 654 L 1692 846 C 1200 880 710 864 260 846 Z" fill={colors.ink} opacity="0.12" />
      <path d="M 270 666 C 700 640 1180 672 1650 642 L 1692 806 C 1210 842 680 822 232 808 Z" fill={colors.surfaceAlt} opacity="0.76" />
      <path d="M 250 674 C 680 646 1180 676 1650 650" fill="none" stroke={colors.ink} strokeWidth="2" opacity="0.24" />

      <g transform="rotate(-4 640 704)">
        <path d="M 444 690 L 690 675 L 822 758 L 566 776 Z" fill={colors.ink} opacity="0.12" />
        <path d="M 430 672 L 674 656 L 800 744 L 548 762 Z" fill={colors.surface} stroke={colors.ink} strokeWidth="2" opacity="0.94" />
        <path d="M 674 656 L 800 744 L 675 752 L 548 762 Z" fill={colors.surfaceAlt} opacity="0.46" />
        <path d="M 474 690 L 641 679 M 487 710 L 657 698 M 506 730 L 677 718" fill="none" stroke={colors.mutedInk} strokeWidth="3" strokeLinecap="round" opacity="0.28" />
        <path d="M 696 680 L 756 723 M 704 696 L 771 739" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" opacity="0.28" />
      </g>

      <g>
        <ellipse cx="1055" cy="778" rx="154" ry="24" fill={colors.ink} opacity="0.15" />
        <ellipse cx="1055" cy="766" rx="142" ry="19" fill={colors.surface} stroke={colors.ink} strokeWidth="2" opacity="0.92" />
        <path d="M 963 670 C 968 735 980 761 1058 766 C 1135 761 1144 735 1149 670 Z" fill={`url(#${mugId})`} stroke={colors.ink} strokeWidth="2" opacity="0.98" />
        <ellipse cx="1056" cy="669" rx="93" ry="22" fill={colors.surface} stroke={colors.ink} strokeWidth="2" opacity="0.98" />
        <ellipse cx="1056" cy="668" rx="72" ry="12" fill={colors.accent} opacity="0.56" />
        <path d="M 1143 694 C 1222 678 1230 754 1141 741" fill="none" stroke={colors.ink} strokeWidth="13" strokeLinecap="round" opacity="0.88" />
        <path d="M 1145 694 C 1199 686 1206 737 1144 730" fill="none" stroke={colors.surfaceAlt} strokeWidth="6" strokeLinecap="round" opacity="0.86" />
      </g>

      <g transform={`translate(${steamLift} 0)`} fill="none" stroke={colors.surface} strokeWidth="5" strokeLinecap="round" opacity={steamOpacity}>
        <path d="M 1018 632 C 984 590 1052 566 1018 522 C 992 488 1038 456 1028 420" />
        <path d="M 1063 632 C 1094 588 1037 564 1070 524 C 1099 489 1054 458 1072 424" opacity="0.72" />
        <path d="M 1100 626 C 1123 594 1094 570 1115 540" opacity="0.48" />
      </g>

      <g transform="translate(1370 558)">
        <ellipse cx="88" cy="212" rx="120" ry="17" fill={colors.ink} opacity="0.12" />
        <path d="M 18 128 L 158 128 L 142 204 L 34 204 Z" fill={colors.accent} stroke={colors.ink} strokeWidth="2" opacity="0.86" />
        <path d="M 36 132 C 46 82 58 28 84 0 C 93 56 84 104 67 134" fill={colors.surface} stroke={colors.ink} strokeWidth="2" opacity="0.88" />
        <path d="M 82 132 C 86 78 122 44 156 32 C 150 86 122 118 100 142" fill={colors.surfaceAlt} stroke={colors.ink} strokeWidth="2" opacity="0.8" />
        <path d="M 66 134 C 38 88 8 72 -16 70 C 0 121 32 142 62 151" fill={colors.surface} stroke={colors.ink} strokeWidth="2" opacity="0.86" />
        <path d="M 38 160 H 139" stroke={colors.ink} strokeWidth="2" opacity="0.18" />
      </g>

      <g fontFamily="Georgia, 'Times New Roman', serif" fill={colors.mutedInk} fontSize="13" letterSpacing="2">
        <text x="390" y="305">COFFEE ROOM / 04</text>
        <text x="1535" y="730" textAnchor="end">A SMALL PLACE TO BEGIN</text>
      </g>
    </g>
  );
};

const FoldedLight: React.FC<{ colors: Palette; timeSec: number; durationSec: number; seed: number; opacity: number; audio: AudioAnalysisFrame }> = ({
  colors,
  timeSec,
  durationSec,
  seed,
  opacity,
  audio,
}) => {
  const liftPhase = slowOscillation(timeSec, Math.max(132, durationSec * 1.9), seed + 11);
  const highlightPhase = slowOscillation(timeSec, Math.max(168, durationSec * 2.4), seed + 13);
  const lift = (liftPhase - 0.5) * 10 + (audio.calmLow - 0.5) * 3;
  const rotation = (liftPhase - 0.5) * 0.9;
  const highlightX = 520 + highlightPhase * 880;
  const frameId = `folded-frame-${seed}`;
  const paperId = `folded-paper-${seed}`;
  const glassId = `folded-glass-${seed}`;
  const clipId = `folded-clip-${seed}`;

  return (
    <g opacity={opacity}>
      <defs>
        <linearGradient id={frameId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors.surface} stopOpacity="0.9" />
          <stop offset="0.55" stopColor={colors.background} stopOpacity="0.72" />
          <stop offset="1" stopColor={colors.surfaceAlt} stopOpacity="0.34" />
        </linearGradient>
        <linearGradient id={paperId} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor={colors.surface} stopOpacity="0.98" />
          <stop offset="0.5" stopColor={colors.surfaceAlt} stopOpacity="0.78" />
          <stop offset="1" stopColor={colors.accent} stopOpacity="0.48" />
        </linearGradient>
        <linearGradient id={glassId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={colors.surface} stopOpacity="0" />
          <stop offset="0.46" stopColor={colors.surface} stopOpacity="0.38" />
          <stop offset="0.68" stopColor={colors.accent} stopOpacity="0.18" />
          <stop offset="1" stopColor={colors.surface} stopOpacity="0" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x="400" y="220" width="1120" height="640" rx="12" />
        </clipPath>
      </defs>

      <rect x="400" y="220" width="1120" height="640" rx="12" fill={colors.ink} opacity="0.12" transform="translate(0 16)" />
      <rect x="400" y="220" width="1120" height="640" rx="12" fill={`url(#${frameId})`} stroke={colors.ink} strokeWidth="2" opacity="0.76" />

      <g clipPath={`url(#${clipId})`}>
        <path d="M 462 760 C 690 688 818 626 1010 624 C 1204 622 1340 696 1476 782 L 1476 884 L 440 884 Z" fill={colors.ink} opacity="0.12" />
        <g transform={`translate(0 ${lift}) rotate(${rotation} 960 560)`}>
          <path d="M 516 646 C 680 542 800 424 974 398 C 1140 374 1252 464 1404 604 L 1336 734 C 1184 642 1050 586 886 656 C 744 716 626 714 516 646 Z" fill={colors.ink} opacity="0.16" transform="translate(18 20)" />
          <path d="M 516 626 C 680 522 800 404 974 378 C 1140 354 1252 444 1404 584 L 1336 714 C 1184 622 1050 566 886 636 C 744 696 626 694 516 626 Z" fill={`url(#${paperId})`} stroke={colors.ink} strokeWidth="2" opacity="0.96" />
          <path d="M 974 378 C 1012 468 1018 548 1000 602 C 984 648 952 654 886 636 C 936 564 954 476 974 378 Z" fill={colors.surface} opacity="0.42" />
          <path d="M 516 626 C 654 620 774 570 886 510 C 948 478 1008 464 1070 484 C 1178 518 1274 594 1336 714 C 1190 622 1052 566 886 636 C 744 696 626 694 516 626 Z" fill={`url(#${glassId})`} opacity={0.56 + audio.calmHigh * 0.1} />
          <path d="M 580 624 C 720 582 812 506 902 462 C 982 422 1046 430 1110 470" fill="none" stroke={colors.surface} strokeWidth="10" strokeLinecap="round" opacity="0.34" />
          <path d="M 612 654 C 736 624 824 564 912 526 C 1008 484 1088 498 1192 554" fill="none" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" opacity={0.34 + audio.calmEnergy * 0.12} />
          <path d="M 664 686 C 770 658 854 614 936 586 C 1026 556 1110 572 1216 620" fill="none" stroke={colors.ink} strokeWidth="2" strokeLinecap="round" opacity="0.2" />
          <path d="M 720 710 C 810 684 888 652 960 636 C 1040 620 1118 632 1188 664" fill="none" stroke={colors.surface} strokeWidth="2" strokeLinecap="round" opacity="0.36" />
        </g>

        <rect x={highlightX - 150} y="260" width="300" height="560" fill={`url(#${glassId})`} opacity={0.28 + audio.calmHigh * 0.12} transform={`rotate(8 ${highlightX} 540)`} />
        <path d={`M ${highlightX - 38} 326 C ${highlightX - 10} 438 ${highlightX + 16} 548 ${highlightX - 18} 730`} fill="none" stroke={colors.surface} strokeWidth="3" opacity={0.18 + audio.calmHigh * 0.1} />
        <path d={`M ${highlightX + 16} 334 C ${highlightX + 46} 448 ${highlightX + 60} 548 ${highlightX + 34} 714`} fill="none" stroke={colors.accent} strokeWidth="1.5" opacity={0.2 + audio.calmEnergy * 0.08} />
      </g>

      <rect x="400" y="220" width="1120" height="640" rx="12" fill="none" stroke={colors.ink} strokeWidth="2" opacity="0.72" />
    </g>
  );
};

export const MusicVisualizer: React.FC<MusicVisualizerProps> = ({
  title,
  artist,
  trackLabel,
  durationSec,
  seed = 42,
  theme = "paper-moon",
  visualStyle = "ink-current",
  audioAnalysis,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeSec = frame / fps;
  const colors = PALETTES[theme];
  const opacity = introOpacity(frame, fps, durationSec);
  const audio = audioFrameAt(audioAnalysis, frame, timeSec, durationSec, seed);

  if (visualStyle === "neon-strands") {
    return <NeonStrands artist={artist} audio={audio} opacity={opacity} seed={seed} title={title} trackLabel={trackLabel} />;
  }

  if (visualStyle === "neon-orb") {
    return <NeonOrb artist={artist} audio={audio} opacity={opacity} seed={seed} title={title} trackLabel={trackLabel} />;
  }

  if (visualStyle === "prism-chamber" || visualStyle === "wave-grid" || visualStyle === "signal-bloom") {
    return <ExperimentalFields artist={artist} audio={audio} opacity={opacity} seed={seed} title={title} trackLabel={trackLabel} variant={visualStyle as ExperimentalFieldVariant} />;
  }

  if (visualStyle === "clay-atlas" || visualStyle === "pigment-tide" || visualStyle === "paper-atlas") {
    return <MaterialStudies artist={artist} audio={audio} durationSec={durationSec} opacity={opacity} seed={seed} title={title} trackLabel={trackLabel} variant={visualStyle as MaterialStudyVariant} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
        <rect width="1920" height="1080" fill={colors.background} />
        <Grain color={colors.ink} seed={seed} />
        <rect x="28" y="28" width="1864" height="1024" fill="none" stroke={colors.ink} strokeWidth="1" opacity="0.14" />

        <Chrome colors={colors} title={title} artist={artist} trackLabel={trackLabel} opacity={opacity} />

        {visualStyle === "ink-current" && (
          <InkCurrent colors={colors} timeSec={timeSec} durationSec={durationSec} seed={seed} opacity={opacity} audio={audio} />
        )}
        {visualStyle === "paper-resonance" && (
          <PaperResonance colors={colors} timeSec={timeSec} durationSec={durationSec} seed={seed} opacity={opacity} audio={audio} />
        )}
        {visualStyle === "soft-relic" && (
          <SoftRelic colors={colors} timeSec={timeSec} durationSec={durationSec} seed={seed} opacity={opacity} audio={audio} />
        )}
        {visualStyle === "lofi-wave" && (
          <LofiWave colors={colors} timeSec={timeSec} durationSec={durationSec} seed={seed} opacity={opacity} audio={audio} />
        )}
        {visualStyle === "coffee-room" && (
          <CoffeeRoom colors={colors} timeSec={timeSec} durationSec={durationSec} seed={seed} opacity={opacity} audio={audio} />
        )}
        {visualStyle === "folded-light" && (
          <FoldedLight colors={colors} timeSec={timeSec} durationSec={durationSec} seed={seed} opacity={opacity} audio={audio} />
        )}
        {visualStyle === "audio-mix" && (
          <>
            <InkCurrent colors={colors} timeSec={timeSec} durationSec={durationSec} seed={seed} opacity={opacity * audio.mix[0]} audio={audio} />
            <PaperResonance colors={colors} timeSec={timeSec} durationSec={durationSec} seed={seed} opacity={opacity * audio.mix[1]} audio={audio} />
            <SoftRelic colors={colors} timeSec={timeSec} durationSec={durationSec} seed={seed} opacity={opacity * audio.mix[2]} audio={audio} />
          </>
        )}

        <text x="1832" y="1000" textAnchor="end" fontFamily="Georgia, 'Times New Roman', serif" fontSize="13" letterSpacing="2" fill={colors.mutedInk} opacity={opacity * 0.8}>
          {visualStyle.replace("-", " ").toUpperCase()}
        </text>
        <rect width="1920" height="1080" fill={colors.background} opacity={1 - opacity} />
      </svg>
    </AbsoluteFill>
  );
};
