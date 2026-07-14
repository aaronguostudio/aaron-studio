import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type SpectralSanctumAudio = {
  calmEnergy: number;
  calmLow: number;
  calmHigh: number;
  pulse: number;
};

const W = 1920;
const H = 1080;
const TAU = Math.PI * 2;

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

// A still architectural plate gives the space real material detail. Remotion
// owns every moving part: transmitted light, floor caustics and edge shimmer.
// The panels themselves stay fixed, so the piece reads as an installation.
export const SpectralSanctum: React.FC<{ audio: SpectralSanctumAudio }> = ({ audio }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / Math.max(durationInFrames, 1);
  const loop = 0.5 - 0.5 * Math.cos(progress * TAU);
  const slowLight = 0.5 + 0.5 * Math.sin(progress * TAU - 0.62);
  const energy = clamp01(audio.calmEnergy);
  const low = clamp01(audio.calmLow);
  const high = clamp01(audio.calmHigh);
  const pulse = clamp01(audio.pulse);
  const cyanBloom = 0.10 + high * 0.12 + pulse * 0.035;
  const violetBloom = 0.075 + energy * 0.10;
  const roseBloom = 0.055 + low * 0.085;
  const floorCaustic = 0.08 + energy * 0.085 + pulse * 0.025;
  const edgeShimmer = 0.08 + high * 0.13;
  const cyanX = 435 + slowLight * 178;
  const violetX = 804 + loop * 285;
  const roseX = 1180 - loop * 120;

  return (
    <AbsoluteFill style={{ backgroundColor: "#020308", overflow: "hidden" }}>
      <Img
        src={staticFile("music-visualizer/spectral-sanctum/prismatic-installation-v1.png")}
        style={{ height: "100%", objectFit: "cover", position: "absolute", width: "100%" }}
      />
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="sanctum-cyan" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#dffcff" stopOpacity="0.96" />
            <stop offset="0.22" stopColor="#7ddaff" stopOpacity="0.38" />
            <stop offset="1" stopColor="#4ab4ef" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sanctum-violet" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fff2ff" stopOpacity="0.72" />
            <stop offset="0.24" stopColor="#c58bff" stopOpacity="0.34" />
            <stop offset="1" stopColor="#714dff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sanctum-rose" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fff8ee" stopOpacity="0.78" />
            <stop offset="0.27" stopColor="#ff9db6" stopOpacity="0.34" />
            <stop offset="1" stopColor="#ef5f9e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sanctum-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d7fbff" stopOpacity="0" />
            <stop offset="0.46" stopColor="#efffff" stopOpacity="0.06" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.78" />
            <stop offset="0.54" stopColor="#d9edff" stopOpacity="0.08" />
            <stop offset="1" stopColor="#bdc7ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sanctum-floor" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#49d2ff" stopOpacity="0" />
            <stop offset="0.32" stopColor="#90e6ff" stopOpacity="0.7" />
            <stop offset="0.56" stopColor="#ff9fc7" stopOpacity="0.58" />
            <stop offset="1" stopColor="#bb75ff" stopOpacity="0" />
          </linearGradient>
          <filter id="sanctum-blur-26" x="-45%" y="-55%" width="190%" height="210%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <filter id="sanctum-blur-64" x="-55%" y="-70%" width="210%" height="240%">
            <feGaussianBlur stdDeviation="64" />
          </filter>
          <filter id="sanctum-edge" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <clipPath id="sanctum-cyan-clip">
            <path d="M 311 221 L 673 93 L 491 762 Z" />
          </clipPath>
          <clipPath id="sanctum-violet-clip">
            <path d="M 618 242 L 1368 74 L 1248 488 L 594 313 Z" />
          </clipPath>
          <clipPath id="sanctum-rose-clip">
            <path d="M 1044 588 L 1514 335 L 1381 928 L 1140 930 Z" />
          </clipPath>
        </defs>

        <g clipPath="url(#sanctum-cyan-clip)" style={{ mixBlendMode: "screen" }}>
          <ellipse cx={cyanX} cy="358" rx="224" ry="352" fill="url(#sanctum-cyan)" opacity={cyanBloom} filter="url(#sanctum-blur-26)" />
          <rect x={cyanX - 56} y="60" width="120" height="740" fill="url(#sanctum-sweep)" opacity={edgeShimmer * 0.72} transform={`rotate(-19 ${cyanX} 430)`} />
        </g>
        <g clipPath="url(#sanctum-violet-clip)" style={{ mixBlendMode: "screen" }}>
          <ellipse cx={violetX} cy="258" rx="362" ry="164" fill="url(#sanctum-violet)" opacity={violetBloom} filter="url(#sanctum-blur-26)" />
          <rect x={violetX - 88} y="24" width="156" height="550" fill="url(#sanctum-sweep)" opacity={edgeShimmer * 0.46} transform={`rotate(-12 ${violetX} 250)`} />
        </g>
        <g clipPath="url(#sanctum-rose-clip)" style={{ mixBlendMode: "screen" }}>
          <ellipse cx={roseX} cy="664" rx="260" ry="358" fill="url(#sanctum-rose)" opacity={roseBloom} filter="url(#sanctum-blur-26)" />
          <rect x={roseX - 62} y="254" width="116" height="706" fill="url(#sanctum-sweep)" opacity={edgeShimmer * 0.60} transform={`rotate(17 ${roseX} 602)`} />
        </g>

        <ellipse cx="970" cy="934" rx="710" ry="138" fill="url(#sanctum-floor)" opacity={floorCaustic} filter="url(#sanctum-blur-64)" style={{ mixBlendMode: "screen" }} />
        <path d="M 320 222 L 672 95 L 492 760" fill="none" stroke="#e5fbff" strokeWidth="3" opacity={edgeShimmer * 0.42} filter="url(#sanctum-edge)" />
        <path d="M 618 242 L 1368 74 L 1248 488" fill="none" stroke="#f5e9ff" strokeWidth="3" opacity={edgeShimmer * 0.25} filter="url(#sanctum-edge)" />
        <path d="M 1046 589 L 1513 336 L 1382 928" fill="none" stroke="#fff0f6" strokeWidth="3" opacity={edgeShimmer * 0.29} filter="url(#sanctum-edge)" />
        <rect width={W} height={H} fill="#02040b" opacity="0.08" />
      </svg>
    </AbsoluteFill>
  );
};
