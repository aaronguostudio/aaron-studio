import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { AudioAnalysis, AudioAnalysisFrame } from "./MusicVisualizer";

export type AudioMaterialVariant = "ferrofield" | "glass-orbit";

export type AudioMaterialStudiesProps = {
  variant: AudioMaterialVariant;
  title: string;
  artist?: string;
  trackLabel?: string;
  durationSec: number;
  seed?: number;
  audioAnalysis?: AudioAnalysis;
};

export const defaultAudioMaterialStudiesProps: AudioMaterialStudiesProps = {
  variant: "ferrofield",
  title: "Ferrofield",
  artist: "Visual And Sound",
  trackLabel: "audio material study",
  durationSec: 45,
  seed: 317,
};

const W = 1920;
const H = 1080;
const TAU = Math.PI * 2;

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));
const smoothstep = (value: number): number => {
  const clamped = clamp01(value);
  return clamped * clamped * (3 - 2 * clamped);
};

const fallbackSignal = (frame: number, fps: number, seed: number): AudioAnalysisFrame => {
  const time = frame / fps;
  const low = clamp01(0.46 + Math.sin(time * 0.11 + seed) * 0.12);
  const mid = clamp01(0.5 + Math.sin(time * 0.16 + 1.4) * 0.11);
  const high = clamp01(0.36 + Math.sin(time * 0.21 + 2.1) * 0.08);
  const energy = clamp01(low * 0.42 + mid * 0.38 + high * 0.2);
  return {
    t: time,
    rms: energy,
    low,
    mid,
    high,
    centroid: high,
    flux: 0,
    pulse: 0,
    energy,
    calmEnergy: energy,
    calmLow: low,
    calmHigh: high,
    mix: [1, 0, 0],
  };
};

const signalAt = (
  analysis: AudioAnalysis | undefined,
  frame: number,
  fps: number,
  seed: number,
): AudioAnalysisFrame => {
  if (!analysis?.frames?.length) return fallbackSignal(frame, fps, seed);
  const index = Math.max(0, Math.min(analysis.frames.length - 1, Math.round((frame * analysis.fps) / fps)));
  return analysis.frames[index] ?? fallbackSignal(frame, fps, seed);
};

const FilmGrain: React.FC<{ id: string; opacity?: number }> = ({ id, opacity = 0.055 }) => (
  <>
    <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.66" numOctaves="2" seed="91" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width={W} height={H} filter={`url(#${id}-grain)`} opacity={opacity} />
  </>
);

const IntroChrome: React.FC<{
  frame: number;
  durationInFrames: number;
  artist?: string;
  title: string;
  label?: string;
  variant: AudioMaterialVariant;
}> = ({ artist, durationInFrames, frame, label, title, variant }) => {
  const fadeIn = smoothstep(frame / 22);
  const fadeOut = smoothstep((durationInFrames - frame) / 24);
  const chrome = fadeIn * fadeOut;
  const titleOpacity = chrome * (1 - smoothstep((frame - 118) / 42));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute" }}>
      <g opacity={chrome} fill="#f2eee7">
        <text x="54" y="58" fontFamily="Helvetica Neue, Arial, sans-serif" fontSize="13" letterSpacing="3.3" opacity="0.7">
          {artist || "VISUAL AND SOUND"} / AUDIO MATERIAL STUDY
        </text>
        <text x="1866" y="58" textAnchor="end" fontFamily="Helvetica Neue, Arial, sans-serif" fontSize="12" letterSpacing="2.8" opacity="0.5">
          {variant === "ferrofield" ? "01 / FLUID SIGNAL" : "02 / GLASS SIGNAL"}
        </text>
      </g>
      <g opacity={titleOpacity} fill="#f4f0e9">
        <text x="78" y="878" fontFamily="Georgia, 'Times New Roman', serif" fontSize="96" letterSpacing="-4.4">
          {title}
        </text>
        <text x="83" y="922" fontFamily="Helvetica Neue, Arial, sans-serif" fontSize="14" letterSpacing="3.2" opacity="0.65">
          {label?.toUpperCase() || "PRECOMPUTED AUDIO RESPONSE"}
        </text>
      </g>
    </svg>
  );
};

const Ferrofield: React.FC<{
  audio: AudioAnalysisFrame;
  durationInFrames: number;
  frame: number;
  id: string;
  seed: number;
}> = ({ audio, durationInFrames, frame, id, seed }) => {
  const progress = frame / Math.max(1, durationInFrames);
  const longWave = 0.5 - 0.5 * Math.cos(TAU * (progress * 0.46 + 0.08));
  const slowDrift = Math.sin(TAU * (progress * 0.32 + 0.19));
  const viscosity = 0.42 + audio.calmLow * 0.46;
  const body = 0.16 + audio.calmEnergy * 0.24;
  const rim = 0.16 + audio.calmHigh * 0.24;
  const transient = Math.pow(audio.pulse, 2.3);
  const turbulenceX = (0.0038 + viscosity * 0.0046).toFixed(4);
  const turbulenceY = (0.018 + viscosity * 0.010).toFixed(4);
  const coreX = 960 + slowDrift * 88;
  const coreY = 560 - longWave * 84;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-base`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#050716" />
          <stop offset="0.46" stopColor="#0a1130" />
          <stop offset="1" stopColor="#04050e" />
        </linearGradient>
        <radialGradient id={`${id}-violet`} cx="50%" cy="45%" r="66%">
          <stop offset="0" stopColor="#c56fe6" stopOpacity="0.68" />
          <stop offset="0.23" stopColor="#6e49d8" stopOpacity="0.34" />
          <stop offset="0.64" stopColor="#1b3e8a" stopOpacity="0.12" />
          <stop offset="1" stopColor="#070918" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-sheen`} x1="0.12" y1="0" x2="0.88" y2="1">
          <stop offset="0" stopColor="#98f2ff" stopOpacity="0" />
          <stop offset="0.25" stopColor="#74d9fc" stopOpacity="0.44" />
          <stop offset="0.49" stopColor="#e5a1fa" stopOpacity="0.56" />
          <stop offset="0.72" stopColor="#ff9b91" stopOpacity="0.34" />
          <stop offset="1" stopColor="#79e2f4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-band`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#48d9f0" stopOpacity="0" />
          <stop offset="0.31" stopColor="#8ceffc" stopOpacity="0.52" />
          <stop offset="0.58" stopColor="#ed9ae9" stopOpacity="0.62" />
          <stop offset="0.77" stopColor="#f8ad83" stopOpacity="0.38" />
          <stop offset="1" stopColor="#8fdaf7" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-core`} cx="50%" cy="46%" r="58%">
          <stop offset="0" stopColor="#fff0d5" stopOpacity="0.82" />
          <stop offset="0.18" stopColor="#df90f1" stopOpacity="0.42" />
          <stop offset="0.52" stopColor="#57cce7" stopOpacity="0.12" />
          <stop offset="1" stopColor="#0c173d" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-fluid`} x="-18%" y="-22%" width="136%" height="144%">
          <feTurbulence type="fractalNoise" baseFrequency={`${turbulenceX} ${turbulenceY}`} numOctaves="4" seed={seed} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={54 + viscosity * 58} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={`${id}-bloom`} x="-40%" y="-45%" width="180%" height="190%">
          <feGaussianBlur stdDeviation={46 + audio.calmEnergy * 22} />
        </filter>
        <filter id={`${id}-edge`} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation={7 + audio.calmHigh * 4} />
        </filter>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      <rect width={W} height={H} fill={`url(#${id}-base)`} />
      <ellipse cx={coreX - 285} cy={coreY + 126} rx={628} ry={376} fill="#1b65bb" opacity={body * 0.48} filter={`url(#${id}-bloom)`} />
      <ellipse cx={coreX + 246} cy={coreY - 108} rx={508} ry={310} fill="#9a3bc4" opacity={body * 0.44} filter={`url(#${id}-bloom)`} />
      <ellipse cx={coreX + 54} cy={coreY + 42} rx={690} ry={422} fill={`url(#${id}-violet)`} opacity={0.72 + audio.calmEnergy * 0.16} filter={`url(#${id}-soft)`} />

      <g filter={`url(#${id}-fluid)`} opacity={0.64 + audio.calmEnergy * 0.18}>
        <path
          d={`M -90 ${620 + slowDrift * 54} C 302 ${315 - longWave * 82}, 556 ${804 + longWave * 48}, 957 ${508 - slowDrift * 72} S 1584 ${330 + longWave * 84}, 2050 ${570 - longWave * 44} L 2050 1180 L -90 1180 Z`}
          fill={`url(#${id}-sheen)`}
          opacity="0.72"
        />
        <path
          d={`M -90 ${524 - longWave * 58} C 274 ${690 + slowDrift * 68}, 622 ${376 - longWave * 100}, 946 ${602 + longWave * 54} S 1642 ${746 - slowDrift * 88}, 2050 ${386 + longWave * 74}`}
          fill="none"
          stroke={`url(#${id}-band)`}
          strokeWidth={88 + audio.calmLow * 48}
          opacity="0.46"
        />
      </g>

      <ellipse cx={coreX} cy={coreY} rx={262 + audio.calmLow * 54} ry={168 + audio.calmEnergy * 38} fill={`url(#${id}-core)`} opacity={0.42 + audio.calmEnergy * 0.22} filter={`url(#${id}-bloom)`} />
      <path
        d={`M -60 ${498 - longWave * 28} C 314 ${628 + slowDrift * 32}, 574 ${370 - longWave * 56}, 961 ${554 + longWave * 28} S 1652 ${690 - slowDrift * 36}, 1980 ${432 + longWave * 40}`}
        fill="none"
        stroke="#d7f8ff"
        strokeWidth={2.2 + audio.calmHigh * 1.2}
        opacity={rim}
        filter={`url(#${id}-edge)`}
      />
      <ellipse cx={coreX} cy={coreY} rx="364" ry="220" fill="none" stroke="#fff0d6" strokeWidth="2" opacity={transient * 0.18} filter={`url(#${id}-edge)`} />
      <rect width={W} height={H} fill="#01020a" opacity="0.16" />
      <FilmGrain id={id} opacity={0.052} />
    </svg>
  );
};

const GlassOrbit: React.FC<{
  audio: AudioAnalysisFrame;
  durationInFrames: number;
  frame: number;
  id: string;
}> = ({ audio, durationInFrames, frame, id }) => {
  const progress = frame / Math.max(1, durationInFrames);
  const turn = Math.sin(TAU * (progress * 0.34 + 0.08));
  const drift = Math.sin(TAU * (progress * 0.52 + 0.36));
  const horizon = 632;
  const view = turn * 36;
  const depth = audio.calmLow * 0.22 + audio.calmEnergy * 0.14;
  const rim = 0.28 + audio.calmHigh * 0.28;
  const internalLight = 0.16 + audio.calmEnergy * 0.22;
  const aperture = Math.pow(audio.pulse, 2.1) * 0.18;
  const causticX = 500 + (progress * 0.48 + audio.calmHigh * 0.1) * 920;
  const gridOpacity = 0.075 + audio.calmLow * 0.05;
  const floorLines = Array.from({ length: 13 }, (_, index) => {
    const t = (index + 1) / 14;
    const y = horizon + Math.pow(t, 1.72) * 380;
    return { key: index, y, opacity: gridOpacity * (0.42 + t * 0.72) };
  });
  const floorRays = Array.from({ length: 17 }, (_, index) => {
    const bottomX = 96 + index * 108;
    const startX = 960 + (bottomX - 960) * 0.15;
    return { key: index, startX, bottomX };
  });

  const left = 630 + view;
  const right = 1290 + view;
  const top = 244 + drift * 12;
  const bottom = 780 + drift * 9;
  const backLeft = 735 + view * 0.58;
  const backRight = 1182 + view * 0.58;
  const backTop = 326 + drift * 8;
  const backBottom = 718 + drift * 6;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-background`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#050813" />
          <stop offset="0.48" stopColor="#0c1430" />
          <stop offset="1" stopColor="#04050e" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0.1" y1="0" x2="0.88" y2="1">
          <stop offset="0" stopColor="#aef7ff" stopOpacity="0.22" />
          <stop offset="0.34" stopColor="#4d87d7" stopOpacity="0.08" />
          <stop offset="0.7" stopColor="#bd7ce3" stopOpacity="0.15" />
          <stop offset="1" stopColor="#0a1024" stopOpacity="0.07" />
        </linearGradient>
        <linearGradient id={`${id}-warm-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe5bd" stopOpacity="0.22" />
          <stop offset="0.42" stopColor="#df91e5" stopOpacity="0.1" />
          <stop offset="1" stopColor="#57d8ef" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id={`${id}-volume`} cx="50%" cy="46%" r="56%">
          <stop offset="0" stopColor="#d7f8f0" stopOpacity="0.62" />
          <stop offset="0.2" stopColor="#72d1e1" stopOpacity="0.28" />
          <stop offset="0.54" stopColor="#754dd1" stopOpacity="0.13" />
          <stop offset="1" stopColor="#050811" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-travel`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b2eefa" stopOpacity="0" />
          <stop offset="0.46" stopColor="#ffe0af" stopOpacity="0.7" />
          <stop offset="0.55" stopColor="#e892e8" stopOpacity="0.62" />
          <stop offset="1" stopColor="#9be9f8" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-bloom`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={48 + audio.calmEnergy * 24} />
        </filter>
        <filter id={`${id}-edge`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={5 + audio.calmHigh * 4} />
        </filter>
        <filter id={`${id}-soft`} x="-30%" y="-35%" width="160%" height="170%">
          <feGaussianBlur stdDeviation="20" />
        </filter>
      </defs>

      <rect width={W} height={H} fill={`url(#${id}-background)`} />
      <ellipse cx={960 + view * 0.22} cy="550" rx={590 + audio.calmLow * 82} ry="342" fill={`url(#${id}-volume)`} opacity={0.68 + audio.calmEnergy * 0.14} filter={`url(#${id}-bloom)`} />

      <g stroke="#b8d4ef" strokeWidth="1">
        {floorLines.map((line) => <path key={line.key} d={`M 120 ${line.y} H 1800`} opacity={line.opacity} />)}
        {floorRays.map((ray) => <path key={ray.key} d={`M ${ray.startX} ${horizon} L ${ray.bottomX} 1052`} opacity={gridOpacity * 0.72} />)}
      </g>

      <path d={`M ${left} ${top} L ${right} ${top + 48} L ${right - 34} ${bottom} L ${left - 42} ${bottom - 36} Z`} fill={`url(#${id}-glass)`} opacity={0.48 + depth} />
      <path d={`M ${backLeft} ${backTop} L ${backRight} ${backTop + 28} L ${backRight - 24} ${backBottom} L ${backLeft - 28} ${backBottom - 22} Z`} fill={`url(#${id}-warm-glass)`} opacity={0.52 + audio.calmEnergy * 0.12} />
      <path d={`M ${left} ${top} L ${backLeft} ${backTop} L ${backLeft - 28} ${backBottom - 22} L ${left - 42} ${bottom - 36} Z`} fill="#54d3e7" opacity={0.07 + audio.calmLow * 0.08} />
      <path d={`M ${right} ${top + 48} L ${backRight} ${backTop + 28} L ${backRight - 24} ${backBottom} L ${right - 34} ${bottom} Z`} fill="#e492dc" opacity={0.07 + audio.calmHigh * 0.09} />

      <g fill="none" strokeLinecap="round">
        <path d={`M ${left} ${top} L ${right} ${top + 48} L ${right - 34} ${bottom} L ${left - 42} ${bottom - 36} Z`} stroke="#d6f6fb" strokeWidth="3" opacity={rim} filter={`url(#${id}-edge)`} />
        <path d={`M ${backLeft} ${backTop} L ${backRight} ${backTop + 28} L ${backRight - 24} ${backBottom} L ${backLeft - 28} ${backBottom - 22} Z`} stroke="#f1b5f0" strokeWidth="2.3" opacity={0.3 + audio.calmHigh * 0.26} filter={`url(#${id}-edge)`} />
        <path d={`M ${left} ${top} L ${backLeft} ${backTop} M ${right} ${top + 48} L ${backRight} ${backTop + 28} M ${left - 42} ${bottom - 36} L ${backLeft - 28} ${backBottom - 22} M ${right - 34} ${bottom} L ${backRight - 24} ${backBottom}`} stroke="#b9edf4" strokeWidth="1.4" opacity="0.32" />
      </g>

      <rect x={causticX} y="258" width="94" height="520" fill={`url(#${id}-travel)`} opacity={internalLight} filter={`url(#${id}-soft)`} transform={`skewX(${-10 + view * 0.05})`} />
      <ellipse cx={960 + view * 0.38} cy="798" rx={360 + audio.calmLow * 56} ry="72" fill="#76dbe8" opacity={0.07 + audio.calmEnergy * 0.08} filter={`url(#${id}-bloom)`} />
      <ellipse cx={960 + view * 0.38} cy="514" rx="280" ry="190" fill="none" stroke="#fff0c5" strokeWidth="2" opacity={aperture} filter={`url(#${id}-edge)`} />
      <rect width={W} height={H} fill="#02030a" opacity="0.12" />
      <FilmGrain id={id} opacity={0.048} />
    </svg>
  );
};

export const AudioMaterialStudies: React.FC<AudioMaterialStudiesProps> = ({
  artist,
  audioAnalysis,
  durationSec,
  seed = 317,
  title,
  trackLabel,
  variant,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const audio = signalAt(audioAnalysis, frame, fps, seed);
  const id = `${variant}-${seed}`;

  return (
    <AbsoluteFill style={{ background: "#050611", overflow: "hidden" }}>
      {variant === "ferrofield" ? (
        <Ferrofield audio={audio} durationInFrames={durationInFrames} frame={frame} id={id} seed={seed} />
      ) : (
        <GlassOrbit audio={audio} durationInFrames={durationInFrames} frame={frame} id={id} />
      )}
      <IntroChrome
        artist={artist}
        durationInFrames={durationInFrames}
        frame={frame}
        label={trackLabel}
        title={title}
        variant={variant}
      />
      <div data-duration-sec={durationSec} style={{ display: "none" }} />
    </AbsoluteFill>
  );
};
