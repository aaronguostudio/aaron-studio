import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Tideglass } from "./Tideglass";
import { ResonanceFabric } from "./ResonanceFabric";
import { SpectralSanctum } from "./SpectralSanctum";

export type DigitalSpaceVariant = "lightwell" | "aperture" | "prism-garden" | "tideglass" | "resonance-fabric" | "spectral-sanctum";

type AudioSignal = {
  energy: number;
  low: number;
  high: number;
  pulse: number;
  calmEnergy: number;
  calmLow: number;
  calmHigh: number;
};

export type DigitalSpacesProps = {
  variant: DigitalSpaceVariant;
  durationSec: number;
  seed?: number;
  audioAnalysis?: {
    fps: number;
    frames: AudioSignal[];
  };
};

export const defaultDigitalSpacesProps: DigitalSpacesProps = {
  variant: "lightwell",
  durationSec: 18,
  seed: 114,
};

const W = 1920;
const H = 1080;
const TAU = Math.PI * 2;

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const loopWave = (frame: number, durationInFrames: number, phase = 0): number => {
  const progress = (frame / Math.max(durationInFrames, 1) + phase) % 1;
  return 0.5 - 0.5 * Math.cos(progress * TAU);
};

const signalAt = (
  analysis: DigitalSpacesProps["audioAnalysis"],
  frame: number,
  durationInFrames: number,
  seed: number,
): AudioSignal => {
  if (analysis?.frames?.length) {
    const index = Math.max(0, Math.min(analysis.frames.length - 1, Math.round((frame * analysis.fps) / 30)));
    return analysis.frames[index];
  }

  const time = frame / 30;
  const energy = clamp01(0.36 + Math.sin(time * 0.3 + seed) * 0.1 + Math.sin(time * 0.09) * 0.06);
  return {
    energy,
    low: clamp01(0.42 + Math.sin(time * 0.16) * 0.12),
    high: clamp01(0.3 + Math.sin(time * 0.22 + 0.4) * 0.08),
    pulse: clamp01(0.2 + Math.max(0, Math.sin(time * 1.4 + seed)) * 0.14),
    calmEnergy: energy,
    calmLow: clamp01(0.42 + Math.sin(time * 0.08) * 0.08),
    calmHigh: clamp01(0.3 + Math.sin(time * 0.11 + 0.4) * 0.05),
  };
};

const Grain: React.FC<{ id: string; opacity: number }> = ({ id, opacity }) => (
  <rect x="0" y="0" width={W} height={H} fill={`url(#${id})`} opacity={opacity} />
);

const Lightwell: React.FC<{ audio: AudioSignal; cycle: number; id: string }> = ({ audio, cycle, id }) => {
  const glow = 0.54 + audio.calmEnergy * 0.18;
  const rim = 0.28 + audio.calmHigh * 0.16 + audio.pulse * 0.06;
  const reflectionX = -38 + cycle * 76;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-back`} x1="0.15" y1="0" x2="0.86" y2="1">
          <stop offset="0" stopColor="#323757" />
          <stop offset="0.46" stopColor="#17253a" />
          <stop offset="1" stopColor="#090d18" />
        </linearGradient>
        <linearGradient id={`${id}-left`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#73557b" stopOpacity="0.48" />
          <stop offset="0.75" stopColor="#1d2337" stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id={`${id}-right`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#44748d" stopOpacity="0.54" />
          <stop offset="0.8" stopColor="#101723" stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#26344d" />
          <stop offset="1" stopColor="#070a11" />
        </linearGradient>
        <radialGradient id={`${id}-light`} cx="50%" cy="48%" r="58%">
          <stop offset="0" stopColor="#fff1d9" stopOpacity="0.9" />
          <stop offset="0.28" stopColor="#a7e5ec" stopOpacity="0.42" />
          <stop offset="1" stopColor="#5e69c3" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-back-glow`} cx="50%" cy="44%" r="66%">
          <stop offset="0" stopColor="#d1e5eb" stopOpacity="0.58" />
          <stop offset="0.27" stopColor="#6d9fc0" stopOpacity="0.22" />
          <stop offset="0.68" stopColor="#263b6b" stopOpacity="0.06" />
          <stop offset="1" stopColor="#101726" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-shaft`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff2d7" stopOpacity="0" />
          <stop offset="0.48" stopColor="#edfbff" stopOpacity="0.34" />
          <stop offset="1" stopColor="#98d8e5" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-aurora`} x1="0" y1="0" x2="1" y2="0.88">
          <stop offset="0" stopColor="#2a93c4" stopOpacity="0" />
          <stop offset="0.3" stopColor="#70d8dc" stopOpacity="0.36" />
          <stop offset="0.5" stopColor="#b38ce7" stopOpacity="0.29" />
          <stop offset="0.72" stopColor="#f0a56d" stopOpacity="0.26" />
          <stop offset="1" stopColor="#263678" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-blur`} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="34" />
        </filter>
        <filter id={`${id}-bloom`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="86" />
        </filter>
        <filter id={`${id}-caustic`} x="-15%" y="-20%" width="130%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.021" numOctaves="3" seed="27" result="texture" />
          <feDisplacementMap in="SourceGraphic" in2="texture" scale="56" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <clipPath id={`${id}-back-clip`}>
          <rect x="329" y="175" width="1262" height="584" />
        </clipPath>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="2" seed="14" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <pattern id={`${id}-noise`} width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" filter={`url(#${id}-grain)`} opacity="0.18" />
        </pattern>
      </defs>

      <rect width={W} height={H} fill="#070a12" />
      <path d="M 328 174 H 1592 V 760 H 328 Z" fill={`url(#${id}-back)`} />
      <rect x="329" y="175" width="1262" height="584" fill={`url(#${id}-back-glow)`} opacity={0.64 + audio.calmHigh * 0.14} />
      <g clipPath={`url(#${id}-back-clip)`} opacity={0.62 + audio.calmEnergy * 0.12}>
        <ellipse cx="672" cy="458" rx="296" ry="216" fill="#4dc9e7" opacity="0.28" filter={`url(#${id}-bloom)`} />
        <ellipse cx="1102" cy="500" rx="356" ry="228" fill="#8952df" opacity="0.22" filter={`url(#${id}-bloom)`} />
        <ellipse cx="1258" cy="358" rx="180" ry="146" fill="#f3b06f" opacity="0.2" filter={`url(#${id}-bloom)`} />
        <g transform={`translate(${(cycle - 0.5) * 46} ${(cycle - 0.5) * -18})`} opacity={0.44 + audio.calmHigh * 0.12}>
          <rect x="390" y="225" width="1140" height="500" fill={`url(#${id}-aurora)`} filter={`url(#${id}-caustic)`} />
        </g>
      </g>
      <path d="M 164 866 L 328 174 V 760 L 522 968 Z" fill={`url(#${id}-left)`} />
      <path d="M 1592 174 L 1756 866 L 1398 968 L 1592 760 Z" fill={`url(#${id}-right)`} />
      <path d="M 328 760 H 1592 L 1398 968 H 522 Z" fill={`url(#${id}-floor)`} />
      <path d="M 328 174 H 1592 L 1756 244 H 164 Z" fill="#2d3450" opacity="0.66" />
      <path d="M 616 174 H 844 L 724 760 H 514 Z" fill={`url(#${id}-shaft)`} opacity={0.44 + audio.calmEnergy * 0.1} />
      <path d="M 1160 174 H 1334 L 1482 760 H 1272 Z" fill={`url(#${id}-shaft)`} opacity={0.18 + audio.calmHigh * 0.08} />

      <g transform={`translate(${reflectionX} 0)`} opacity={glow}>
        <ellipse cx="960" cy="765" rx="530" ry="102" fill={`url(#${id}-light)`} filter={`url(#${id}-blur)`} />
        <path d="M 548 804 C 762 716 1150 716 1372 804 C 1180 862 748 862 548 804 Z" fill="#d7eeef" opacity="0.07" />
      </g>

      <rect x="391" y="234" width="1138" height="465" fill={`url(#${id}-light)`} opacity={0.18 + audio.calmHigh * 0.09} />
      <path d="M 522 762 C 744 700 1182 700 1398 762" fill="none" stroke="#edfaf2" strokeWidth="2" opacity={0.13 + audio.calmEnergy * 0.08} />
      <path d="M 328 174 H 1592 V 760 H 328 Z" fill="none" stroke="#e2e3ef" strokeWidth="2" opacity={rim} />
      <path d="M 391 234 H 1529" stroke="#c5d6e2" strokeWidth="1" opacity={0.13 + audio.calmHigh * 0.08} />
      <path d="M 522 968 L 328 760 M 1398 968 L 1592 760" stroke="#d6d9e5" strokeWidth="1" opacity="0.17" />
      <Grain id={`${id}-noise`} opacity={0.055} />
    </svg>
  );
};

const Aperture: React.FC<{ audio: AudioSignal; cycle: number; id: string }> = ({ audio, cycle, id }) => {
  const scanX = -520 + cycle * 980;
  const scanOpacity = 0.16 + audio.calmHigh * 0.11;
  const coreOpacity = 0.36 + audio.calmEnergy * 0.12 + audio.pulse * 0.045;
  const cells = Array.from({ length: 24 }, (_, index) => ({
    x: 530 + (index % 6) * 140,
    y: 256 + Math.floor(index / 6) * 138,
    row: Math.floor(index / 6),
    column: index % 6,
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-background`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eeece6" />
          <stop offset="0.52" stopColor="#cfd2d3" />
          <stop offset="1" stopColor="#aeb8bd" />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#334451" />
          <stop offset="0.42" stopColor="#111923" />
          <stop offset="1" stopColor="#465960" />
        </linearGradient>
        <linearGradient id={`${id}-scan`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c0f1dc" stopOpacity="0" />
          <stop offset="0.44" stopColor="#dffcf5" stopOpacity="0.04" />
          <stop offset="0.5" stopColor="#f5d5ab" stopOpacity="0.8" />
          <stop offset="0.56" stopColor="#b6eaf0" stopOpacity="0.04" />
          <stop offset="1" stopColor="#cf9fe9" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-cell`} cx="48%" cy="28%" r="85%">
          <stop offset="0" stopColor="#a9e2e0" />
          <stop offset="0.3" stopColor="#7899b3" />
          <stop offset="1" stopColor="#14212a" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      <rect width={W} height={H} fill={`url(#${id}-background)`} />
      <ellipse cx="984" cy="846" rx="690" ry="116" fill="#405058" opacity="0.23" filter={`url(#${id}-soft)`} />
      <g transform="matrix(1 0.08 -0.26 1 280 -66)">
        <rect x="392" y="168" width="1048" height="672" rx="24" fill={`url(#${id}-body)`} />
        <rect x="423" y="198" width="985" height="612" rx="12" fill="#101720" stroke="#e1e8e7" strokeOpacity="0.27" strokeWidth="2" />
        {cells.map(({ x, y, row, column }) => {
          const band = column / 5;
          const bandGlow = Math.max(0, 1 - Math.abs(band - cycle));
          const staticShade = 0.34 + row * 0.05 + column * 0.018;
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="102"
              height="100"
              rx="13"
              fill={`url(#${id}-cell)`}
              opacity={staticShade + bandGlow * (0.08 + audio.calmEnergy * 0.05)}
              stroke="#e1f2e9"
              strokeWidth="1"
              strokeOpacity={0.08 + bandGlow * (0.04 + audio.calmHigh * 0.05)}
            />
          );
        })}
        <rect x={scanX} y="198" width="560" height="612" fill={`url(#${id}-scan)`} opacity={scanOpacity} />
        <rect x="423" y="198" width="985" height="612" rx="12" fill="none" stroke="#ffffff" strokeOpacity={0.18 + audio.pulse * 0.06} strokeWidth="2" />
      </g>
      <path d="M 468 898 H 1452" stroke="#213039" strokeWidth="2" opacity={coreOpacity} />
      <path d="M 576 930 H 1344" stroke="#ffffff" strokeWidth="1" opacity="0.3" />
    </svg>
  );
};

const PrismGarden: React.FC<{ audio: AudioSignal; cycle: number; id: string }> = ({ audio, cycle, id }) => {
  const shadeX = 260 + cycle * 1260;
  const haze = 0.2 + audio.calmEnergy * 0.14;
  const glint = 0.18 + audio.calmHigh * 0.16 + audio.pulse * 0.05;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#171723" />
          <stop offset="0.52" stopColor="#24202a" />
          <stop offset="1" stopColor="#0c1119" />
        </linearGradient>
        <linearGradient id={`${id}-plate-a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e8c1f1" stopOpacity="0.8" />
          <stop offset="0.48" stopColor="#657ad0" stopOpacity="0.28" />
          <stop offset="1" stopColor="#273d63" stopOpacity="0.09" />
        </linearGradient>
        <linearGradient id={`${id}-plate-b`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bdecd9" stopOpacity="0.72" />
          <stop offset="0.5" stopColor="#628a9d" stopOpacity="0.26" />
          <stop offset="1" stopColor="#2d315c" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id={`${id}-plate-c`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#fae0bb" stopOpacity="0.65" />
          <stop offset="0.48" stopColor="#a85d8f" stopOpacity="0.34" />
          <stop offset="1" stopColor="#344991" stopOpacity="0.14" />
        </linearGradient>
        <radialGradient id={`${id}-haze`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#d8d2ff" stopOpacity="0.72" />
          <stop offset="0.34" stopColor="#8ab8db" stopOpacity="0.2" />
          <stop offset="1" stopColor="#21284b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-sweep`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff4dd" stopOpacity="0" />
          <stop offset="0.48" stopColor="#fff5d8" stopOpacity="0.05" />
          <stop offset="0.5" stopColor="#fff8e9" stopOpacity="0.92" />
          <stop offset="0.52" stopColor="#d8edff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#b7a5ff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="38" />
        </filter>
      </defs>

      <rect width={W} height={H} fill={`url(#${id}-bg)`} />
      <ellipse cx="972" cy="540" rx="820" ry="410" fill={`url(#${id}-haze)`} opacity={haze} filter={`url(#${id}-blur)`} />
      <path d="M 188 832 L 642 182 L 1052 364 L 632 940 Z" fill={`url(#${id}-plate-a)`} stroke="#f7eeff" strokeOpacity="0.2" strokeWidth="2" />
      <path d="M 626 940 L 1052 364 L 1694 532 L 1274 1002 Z" fill={`url(#${id}-plate-b)`} stroke="#e8ffff" strokeOpacity="0.19" strokeWidth="2" />
      <path d="M 642 182 L 1334 114 L 1694 532 L 1052 364 Z" fill={`url(#${id}-plate-c)`} stroke="#fff1dc" strokeOpacity="0.17" strokeWidth="2" />
      <path d="M 398 806 L 732 326 L 980 430 L 668 858 Z" fill="#c7d8f0" opacity="0.08" />
      <path d="M 1072 410 L 1510 530 L 1244 826 L 868 734 Z" fill="#e7c7ea" opacity="0.08" />
      <rect x={shadeX} y="96" width="360" height="900" fill={`url(#${id}-sweep)`} opacity={glint} transform="rotate(-16 960 540)" />
      <path d="M 188 832 L 642 182 L 1334 114 L 1694 532 L 1274 1002" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.25" />
      <path d="M 626 940 L 1052 364 L 1694 532" fill="none" stroke="#d9e8f4" strokeWidth="1" opacity={0.23 + audio.calmHigh * 0.08} />
    </svg>
  );
};

export const DigitalSpaces: React.FC<DigitalSpacesProps> = ({
  variant,
  durationSec,
  seed = 114,
  audioAnalysis,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const audio = signalAt(audioAnalysis, frame, durationInFrames, seed);
  const cycle = loopWave(frame, durationInFrames, variant === "aperture" ? 0.12 : 0);
  const id = `digital-space-${variant}-${seed}`;

  // durationSec remains an explicit public prop so an 18-second study can be
  // rendered as an exact repeatable loop or expanded into a longer programme.
  void durationSec;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0c13", overflow: "hidden" }}>
      {variant === "lightwell" ? <Lightwell audio={audio} cycle={cycle} id={id} /> : null}
      {variant === "aperture" ? <Aperture audio={audio} cycle={cycle} id={id} /> : null}
      {variant === "prism-garden" ? <PrismGarden audio={audio} cycle={cycle} id={id} /> : null}
      {variant === "tideglass" ? <Tideglass audio={audio} /> : null}
      {variant === "resonance-fabric" ? <ResonanceFabric audio={audio} /> : null}
      {variant === "spectral-sanctum" ? <SpectralSanctum audio={audio} /> : null}
    </AbsoluteFill>
  );
};
