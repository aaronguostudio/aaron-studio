import React from "react";
import {
  ExtendedSpectrumVisualizer,
  type ExtendedSpectrumVariant,
} from "./SpectrumVisualizerFamilies";

export const SPECTRUM_VISUALIZER_VARIANTS = [
  "spectrum-bars",
  "mirrored-spectrum",
  "waveform-line",
  "mirrored-waveform",
  "filled-spectrum",
  "spectrum-dots",
  "twin-spectrum",
  "radial-spectrum",
  "radial-waveform",
  "radial-dots",
  "spectrum-arc",
  "filled-radial-spectrum",
  "triangle-spectrum",
  "x-spectrum",
  "side-burst-ring",
] as const;

export type SpectrumVisualizerVariant = typeof SPECTRUM_VISUALIZER_VARIANTS[number];

export const isSpectrumVisualizerVariant = (value: string): value is SpectrumVisualizerVariant => (
  (SPECTRUM_VISUALIZER_VARIANTS as readonly string[]).includes(value)
);

type SpectrumPalette = {
  background: string;
  surface: string;
  surfaceAlt: string;
  ink: string;
  mutedInk: string;
  accent: string;
};

type SpectrumAudioFrame = {
  spectrum?: number[];
  centroid: number;
  pulse: number;
  energy: number;
  calmEnergy: number;
};

type SpectrumVisualizerProps = {
  variant: SpectrumVisualizerVariant;
  colors: SpectrumPalette;
  audio: SpectrumAudioFrame;
  opacity: number;
  seed: number;
  timeSec: number;
};

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const fallbackSpectrum = (audio: SpectrumAudioFrame, timeSec: number, seed: number): number[] => (
  Array.from({ length: 48 }, (_, index) => {
    const position = index / 47;
    const lowShelf = Math.exp(-position * 2.8);
    const contour = 0.54 + Math.sin(index * 0.72 + timeSec * 0.8 + seed) * 0.14;
    return clamp01((0.14 + audio.energy * 0.44) * (0.5 + lowShelf * 0.5) * contour);
  })
);

const spectrumForFrame = (audio: SpectrumAudioFrame, timeSec: number, seed: number): number[] => {
  if (audio.spectrum?.length) return audio.spectrum.map(clamp01);
  return fallbackSpectrum(audio, timeSec, seed);
};

const bandColor = (colors: SpectrumPalette, index: number, count: number): string => {
  if (index < count * 0.22) return colors.accent;
  if (index > count * 0.78) return colors.surfaceAlt;
  return colors.ink;
};

const LinearSpectrum: React.FC<Omit<SpectrumVisualizerProps, "variant">> = ({
  colors,
  audio,
  opacity,
  seed,
  timeSec,
}) => {
  const bands = spectrumForFrame(audio, timeSec, seed);
  const left = 296;
  const right = 1624;
  const baseline = 704;
  const width = right - left;
  const step = width / bands.length;
  const barWidth = Math.max(5, step * 0.46);
  const signalX = left + clamp01(audio.centroid) * width;

  return (
    <g opacity={opacity}>
      <path d={`M ${left} ${baseline} H ${right}`} stroke={colors.ink} strokeWidth="1" opacity="0.22" />
      <path d={`M ${left} 354 H ${right}`} stroke={colors.ink} strokeWidth="1" opacity="0.07" />
      {bands.map((value, index) => {
        const height = 10 + Math.pow(value, 0.92) * 330;
        const x = left + index * step + (step - barWidth) / 2;
        return (
          <g key={index}>
            <rect
              x={x}
              y={baseline - height}
              width={barWidth}
              height={height}
              rx={barWidth / 2}
              fill={bandColor(colors, index, bands.length)}
              opacity={0.28 + value * 0.62}
            />
            <rect
              x={x + barWidth * 0.32}
              y={baseline - height}
              width={barWidth * 0.36}
              height={Math.min(height, 18)}
              rx={barWidth / 3}
              fill={colors.surface}
              opacity={0.22 + value * 0.24}
            />
          </g>
        );
      })}
      <circle
        cx={signalX}
        cy={baseline + 1}
        r={4 + audio.pulse * 5}
        fill={colors.accent}
        opacity={0.38 + audio.pulse * 0.2}
      />
      <circle
        cx={signalX}
        cy={baseline + 1}
        r={13 + audio.pulse * 8}
        fill="none"
        stroke={colors.accent}
        strokeWidth="1"
        opacity={0.08 + audio.pulse * 0.12}
      />
      <g fill={colors.mutedInk} fontFamily="Georgia, 'Times New Roman', serif" fontSize="13" letterSpacing="2">
        <text x={left} y="324">LINEAR FIELD / 48 LOG BANDS</text>
        <text x={left} y={baseline + 42}>43 HZ</text>
        <text x={right} y={baseline + 42} textAnchor="end">10 KHZ</text>
      </g>
    </g>
  );
};

const MirroredSpectrum: React.FC<Omit<SpectrumVisualizerProps, "variant">> = ({
  colors,
  audio,
  opacity,
  seed,
  timeSec,
}) => {
  const bands = spectrumForFrame(audio, timeSec, seed);
  const left = 270;
  const right = 1650;
  const baseline = 548;
  const width = right - left;
  const step = width / bands.length;
  const barWidth = Math.max(5, step * 0.42);
  const signalX = left + clamp01(audio.centroid) * width;

  return (
    <g opacity={opacity}>
      <path d={`M ${left} ${baseline} H ${right}`} stroke={colors.accent} strokeWidth="1.5" opacity="0.46" />
      <path d={`M ${left} ${baseline - 260} H ${right}`} stroke={colors.ink} strokeWidth="1" opacity="0.06" />
      <path d={`M ${left} ${baseline + 260} H ${right}`} stroke={colors.ink} strokeWidth="1" opacity="0.06" />
      {bands.map((value, index) => {
        const topHeight = 8 + Math.pow(value, 0.9) * 238;
        const bottomHeight = 6 + Math.pow(value, 0.94) * 174;
        const x = left + index * step + (step - barWidth) / 2;
        const color = bandColor(colors, index, bands.length);
        return (
          <g key={index}>
            <rect
              x={x}
              y={baseline - topHeight}
              width={barWidth}
              height={topHeight}
              rx={barWidth / 2}
              fill={color}
              opacity={0.32 + value * 0.58}
            />
            <rect
              x={x}
              y={baseline + 3}
              width={barWidth}
              height={bottomHeight}
              rx={barWidth / 2}
              fill={color}
              opacity={0.16 + value * 0.34}
            />
          </g>
        );
      })}
      <circle cx={signalX} cy={baseline} r={5} fill={colors.surface} opacity="0.9" />
      <circle
        cx={signalX}
        cy={baseline}
        r={12 + audio.pulse * 7}
        fill="none"
        stroke={colors.accent}
        strokeWidth="1"
        opacity={0.08 + audio.pulse * 0.1}
      />
      <g fill={colors.mutedInk} fontFamily="Georgia, 'Times New Roman', serif" fontSize="13" letterSpacing="2">
        <text x={left} y="254">MIRRORED FIELD / ONE SIGNAL, TWO DIRECTIONS</text>
        <text x={right} y="844" textAnchor="end">ATTACK 46% · RELEASE 14%</text>
      </g>
    </g>
  );
};

const pointOnCircle = (centerX: number, centerY: number, radius: number, angle: number): [number, number] => ([
  centerX + Math.cos(angle) * radius,
  centerY + Math.sin(angle) * radius,
]);

const RadialSpectrum: React.FC<Omit<SpectrumVisualizerProps, "variant">> = ({
  colors,
  audio,
  opacity,
  seed,
  timeSec,
}) => {
  const bands = spectrumForFrame(audio, timeSec, seed);
  const centerX = 960;
  const centerY = 522;
  const baseRadius = 214;
  const rotation = -Math.PI / 2;
  const outerPoints = bands.map((value, index) => {
    const angle = rotation + (index / bands.length) * Math.PI * 2;
    return pointOnCircle(centerX, centerY, baseRadius + 24 + Math.pow(value, 0.92) * 142, angle);
  });
  const outerPath = outerPoints.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ") + " Z";
  const pulseRadius = 150 + audio.pulse * 7;

  return (
    <g opacity={opacity}>
      <circle cx={centerX} cy={centerY} r={baseRadius} fill="none" stroke={colors.ink} strokeWidth="1" opacity="0.16" />
      <circle cx={centerX} cy={centerY} r={baseRadius - 28} fill={colors.surface} opacity={0.05 + audio.calmEnergy * 0.035} />
      <path d={outerPath} fill={colors.accent} fillOpacity="0.025" stroke={colors.accent} strokeWidth="1" strokeOpacity="0.16" />
      {bands.map((value, index) => {
        const angle = rotation + (index / bands.length) * Math.PI * 2;
        const inner = pointOnCircle(centerX, centerY, baseRadius + 6, angle);
        const outer = pointOnCircle(centerX, centerY, baseRadius + 22 + Math.pow(value, 0.92) * 136, angle);
        return (
          <line
            key={index}
            x1={inner[0]}
            y1={inner[1]}
            x2={outer[0]}
            y2={outer[1]}
            stroke={bandColor(colors, index, bands.length)}
            strokeWidth={3.5 + value * 1.8}
            strokeLinecap="round"
            opacity={0.3 + value * 0.55}
          />
        );
      })}
      <circle
        cx={centerX}
        cy={centerY}
        r={pulseRadius}
        fill="none"
        stroke={colors.accent}
        strokeWidth="1.5"
        opacity={0.07 + audio.pulse * 0.09}
      />
      <circle cx={centerX} cy={centerY} r="5" fill={colors.accent} opacity={0.4 + audio.pulse * 0.16} />
      <g fill={colors.mutedInk} fontFamily="Georgia, 'Times New Roman', serif" textAnchor="middle">
        <text x={centerX} y={centerY - 10} fontSize="13" letterSpacing="2.4">RADIAL FIELD</text>
        <text x={centerX} y={centerY + 18} fontSize="11" letterSpacing="1.8">48 LOG BANDS</text>
      </g>
    </g>
  );
};

export const SpectrumVisualizer: React.FC<SpectrumVisualizerProps> = (props) => {
  if (props.variant === "mirrored-spectrum") return <MirroredSpectrum {...props} />;
  if (props.variant === "radial-spectrum") return <RadialSpectrum {...props} />;
  if (props.variant === "spectrum-bars") return <LinearSpectrum {...props} />;
  return <ExtendedSpectrumVisualizer {...props} variant={props.variant as ExtendedSpectrumVariant} />;
};
