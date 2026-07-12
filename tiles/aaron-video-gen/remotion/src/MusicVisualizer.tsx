import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type MusicVisualizerTheme = "paper-moon" | "deep-ink" | "soft-slate";
export type MusicVisualizerStyle = "ink-current" | "paper-resonance" | "soft-relic" | "audio-mix";

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

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));
const smoothstep = (value: number): number => value * value * (3 - 2 * value);

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
  const drift = timeSec * (0.009 + audio.energy * 0.006);
  const nodes = [0.04, 0.17, 0.31, 0.46, 0.61, 0.77, 0.92];
  const pulseProgress = (timeSec * (0.034 + audio.energy * 0.018 + audio.high * 0.008) + 0.04) % 1;
  const [pulseX, pulseY] = routePoint(pulseProgress);

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
        strokeWidth={2 + audio.energy * 1.25 + audio.pulse * 1.5}
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - reveal}
        opacity={0.64 + audio.energy * 0.22 + audio.pulse * 0.14}
      />
      <path
        d="M 430 744 C 650 392 900 420 1070 610 S 1400 790 1500 450"
        fill="none"
        stroke={colors.ink}
        strokeWidth="1"
        opacity="0.12"
      />

      {nodes.map((node, index) => {
        const progress = node + drift + Math.sin(timeSec * 0.11 + index + seed) * 0.006;
        const [x, y] = routePoint(progress);
        const depth = 0.68 + 0.22 * Math.sin(progress * Math.PI * 2);
        const radius = 11 + (index % 3) * 3 + audio.pulse * (index % 2 ? 5 : 3);
        const active = clamp01(0.36 + audio.energy * 0.62 + audio.pulse * 0.28 + audio.mid * 0.1 + Math.sin(timeSec * 0.8 + index) * 0.1);
        return (
          <g key={index} opacity={depth * active}>
            <circle cx={x} cy={y} r={radius + 9} fill="none" stroke={colors.ink} strokeWidth="1" opacity="0.16" />
            <circle cx={x} cy={y} r={radius} fill={index % 2 ? colors.surface : colors.ink} stroke={colors.ink} strokeWidth="2" />
            <circle cx={x - radius * 0.28} cy={y - radius * 0.28} r={2.5 + audio.high * 2.5} fill={colors.accent} opacity={0.55 + audio.high * 0.3} />
          </g>
        );
      })}

      <circle cx={pulseX} cy={pulseY} r={18 + audio.energy * 12 + audio.pulse * 18} fill="none" stroke={colors.accent} strokeWidth={1.5 + audio.pulse * 1.5} opacity={0.2 + audio.pulse * 0.24} />
      <circle cx={pulseX} cy={pulseY} r={3 + audio.pulse * 3} fill={colors.accent} opacity={0.62 + audio.pulse * 0.3} />

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
  const energy = audio.energy;
  const sweepX = interpolate((timeSec * (0.026 + audio.high * 0.022) + audio.flux * 0.12) % 1, [0, 1], [420, 1510]);
  const barXs = [510, 650, 790, 930, 1070, 1210, 1350, 1490];

  return (
    <g opacity={opacity}>
      <path d="M 390 625 C 690 555 1030 690 1530 575" fill="none" stroke={colors.ink} strokeWidth="2" opacity="0.2" />
      <path d="M 390 625 C 690 555 1030 690 1530 575" fill="none" stroke={colors.accent} strokeWidth="2" opacity="0.62" />
      <path d="M 420 360 H 1500" fill="none" stroke={colors.ink} strokeWidth="1" opacity="0.12" />
      <path d="M 420 820 H 1500" fill="none" stroke={colors.ink} strokeWidth="1" opacity="0.12" />

      {barXs.map((x, index) => {
        const baseline = 612 + Math.sin(index * 0.7) * 26;
        const height = 54 + energy * 92 + audio.mid * 26 + Math.sin(timeSec * 0.62 + index * 0.68 + seed) * (12 + energy * 22 + audio.pulse * 20);
        const width = 24 + energy * 8;
        const y = baseline - Math.max(30, height);
        return (
          <g key={index}>
            <line x1={x} y1={baseline + 18} x2={x} y2={y - 20} stroke={colors.ink} strokeWidth="1" opacity="0.13" />
            <rect x={x - width / 2} y={y} width={width} height={height} rx={width / 2} fill={index % 3 === 0 ? colors.accent : colors.ink} opacity={0.2 + energy * 0.32 + audio.low * 0.14} />
            <circle cx={x} cy={baseline} r="5" fill={colors.surface} stroke={colors.ink} strokeWidth="2" opacity="0.9" />
          </g>
        );
      })}

      <line x1={sweepX} y1="330" x2={sweepX} y2="845" stroke={colors.accent} strokeWidth={1.5 + audio.high * 1.5} opacity={0.24 + audio.pulse * 0.25} />
      <circle cx={sweepX} cy="625" r={6 + audio.pulse * 5} fill={colors.accent} opacity={0.72 + audio.pulse * 0.22} />

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
  const energy = audio.energy;
  const rotation = Math.sin(timeSec * 0.12 + seed) * 2.3 + audio.centroid * 1.3;
  const scale = 1 + Math.sin(timeSec * 0.28) * 0.012 + energy * 0.012 + audio.pulse * 0.018;
  const lightX = 825 + clamp01(Math.sin(timeSec * 0.18) * 0.5 + 0.5 + audio.high * 0.14) * 270;
  const relicPath = "M 960 285 C 1090 288 1182 420 1142 575 C 1106 718 1018 818 878 790 C 748 764 704 616 748 476 C 788 350 852 282 960 285 Z";

  return (
    <g opacity={opacity} transform={`rotate(${rotation} 960 560) scale(${scale})`}>
      <path d={relicPath} transform="translate(-42 28)" fill={colors.ink} opacity="0.12" />
      <path d={relicPath} transform="translate(32 -16)" fill={colors.surfaceAlt} opacity="0.4" />
      <path d={relicPath} fill={colors.surface} stroke={colors.ink} strokeWidth="2" opacity="0.92" />
      <path d="M 900 320 C 1000 370 1060 482 1028 602 C 1000 704 930 756 850 740" fill="none" stroke={colors.accent} strokeWidth="3" opacity="0.52" />
      <path d="M 1002 340 C 1065 420 1088 502 1062 590" fill="none" stroke={colors.ink} strokeWidth="1" opacity="0.32" />
      <ellipse cx={lightX} cy="400" rx={58 + audio.high * 18} ry={18 + audio.pulse * 5} fill={colors.accent} opacity={0.14 + energy * 0.12 + audio.high * 0.12} transform={`rotate(-24 ${lightX} 400)`} />
      <circle cx="826" cy="650" r={9 + energy * 5 + audio.pulse * 4} fill={colors.ink} opacity={0.62 + audio.low * 0.22} />
      <circle cx="826" cy="650" r={20 + audio.pulse * 8} fill="none" stroke={colors.accent} strokeWidth={1 + audio.pulse} opacity={0.28 + audio.pulse * 0.22} />
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
