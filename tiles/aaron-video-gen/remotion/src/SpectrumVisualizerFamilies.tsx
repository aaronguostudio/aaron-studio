import React from "react";

export type ExtendedSpectrumVariant =
  | "waveform-line"
  | "mirrored-waveform"
  | "filled-spectrum"
  | "spectrum-dots"
  | "twin-spectrum"
  | "radial-waveform"
  | "radial-dots"
  | "spectrum-arc"
  | "filled-radial-spectrum"
  | "triangle-spectrum"
  | "x-spectrum"
  | "side-burst-ring";

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

type ExtendedSpectrumVisualizerProps = {
  variant: ExtendedSpectrumVariant;
  colors: SpectrumPalette;
  audio: SpectrumAudioFrame;
  opacity: number;
  seed: number;
  timeSec: number;
};

type Point = [number, number];

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const spectrumForFrame = (audio: SpectrumAudioFrame, timeSec: number, seed: number): number[] => {
  if (audio.spectrum?.length) return audio.spectrum.map(clamp01);
  return Array.from({ length: 48 }, (_, index) => {
    const position = index / 47;
    const lowShelf = Math.exp(-position * 2.8);
    const contour = 0.54 + Math.sin(index * 0.72 + timeSec * 0.8 + seed) * 0.14;
    return clamp01((0.14 + audio.energy * 0.44) * (0.5 + lowShelf * 0.5) * contour);
  });
};

const bandColor = (colors: SpectrumPalette, index: number, count: number): string => {
  if (index < count * 0.22) return colors.accent;
  if (index > count * 0.78) return colors.surfaceAlt;
  return colors.ink;
};

const pathFromPoints = (points: Point[], close = false): string => (
  points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ") + (close ? " Z" : "")
);

const pointOnCircle = (centerX: number, centerY: number, radius: number, angle: number): Point => ([
  centerX + Math.cos(angle) * radius,
  centerY + Math.sin(angle) * radius,
]);

const FamilyLabel: React.FC<{
  colors: SpectrumPalette;
  title: string;
  detail: string;
  x?: number;
  y?: number;
  anchor?: "start" | "middle" | "end";
}> = ({ colors, title, detail, x = 296, y = 324, anchor = "start" }) => (
  <g
    fill={colors.mutedInk}
    fontFamily="Georgia, 'Times New Roman', serif"
    textAnchor={anchor}
  >
    <text x={x} y={y} fontSize="13" letterSpacing="2.2">{title}</text>
    <text x={x} y={y + 24} fontSize="11" letterSpacing="1.6" opacity="0.72">{detail}</text>
  </g>
);

const HorizontalWaveform: React.FC<ExtendedSpectrumVisualizerProps & {
  mode: "line" | "mirrored" | "filled";
}> = ({ colors, audio, opacity, seed, timeSec, mode }) => {
  const bands = spectrumForFrame(audio, timeSec, seed);
  const left = 296;
  const right = 1624;
  const baseline = mode === "mirrored" ? 548 : 704;
  const width = right - left;
  const points = bands.map((value, index): Point => ([
    left + (index / Math.max(1, bands.length - 1)) * width,
    baseline - 12 - Math.pow(value, 0.92) * (mode === "mirrored" ? 224 : 300),
  ]));
  const mirrored = points.map(([x, y]): Point => ([x, baseline + (baseline - y) * 0.72]));
  const linePath = pathFromPoints(points);
  const mirroredPath = pathFromPoints(mirrored);
  const areaPath = `M ${left} ${baseline} ${points.map(([x, y]) => `L ${x} ${y}`).join(" ")} L ${right} ${baseline} Z`;
  const signalX = left + clamp01(audio.centroid) * width;
  const title = mode === "line" ? "WAVEFORM LINE" : mode === "mirrored" ? "MIRRORED WAVEFORM" : "FILLED SPECTRUM";
  const detail = mode === "filled" ? "AMPLITUDE AS SURFACE" : "48 BANDS / CONTINUOUS CONTOUR";

  return (
    <g opacity={opacity}>
      <path d={`M ${left} ${baseline} H ${right}`} stroke={colors.ink} strokeWidth="1" opacity="0.18" />
      {mode === "filled" && (
        <path d={areaPath} fill={colors.accent} fillOpacity="0.16" stroke={colors.accent} strokeWidth="2" strokeOpacity="0.72" />
      )}
      {mode !== "filled" && (
        <path d={linePath} fill="none" stroke={colors.ink} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" opacity="0.84" />
      )}
      {mode === "mirrored" && (
        <>
          <path d={mirroredPath} fill="none" stroke={colors.accent} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.46" />
          <path d={`${linePath} L ${right} ${baseline} ${[...mirrored].reverse().map(([x, y]) => `L ${x} ${y}`).join(" ")} Z`} fill={colors.surface} opacity="0.08" />
        </>
      )}
      <circle cx={signalX} cy={baseline} r={4 + audio.pulse * 4} fill={colors.accent} opacity={0.42 + audio.pulse * 0.16} />
      <FamilyLabel colors={colors} title={title} detail={detail} />
      <g fill={colors.mutedInk} fontFamily="Georgia, 'Times New Roman', serif" fontSize="11" letterSpacing="1.5">
        <text x={left} y={baseline + (mode === "mirrored" ? 218 : 44)}>43 HZ</text>
        <text x={right} y={baseline + (mode === "mirrored" ? 218 : 44)} textAnchor="end">10 KHZ</text>
      </g>
    </g>
  );
};

const DotSpectrum: React.FC<ExtendedSpectrumVisualizerProps> = ({ colors, audio, opacity, seed, timeSec }) => {
  const bands = spectrumForFrame(audio, timeSec, seed);
  const left = 296;
  const right = 1624;
  const baseline = 704;
  const width = right - left;

  return (
    <g opacity={opacity}>
      <path d={`M ${left} ${baseline} H ${right}`} stroke={colors.ink} strokeWidth="1" opacity="0.12" />
      {bands.map((value, index) => {
        const x = left + (index / Math.max(1, bands.length - 1)) * width;
        const y = baseline - 12 - Math.pow(value, 0.9) * 310;
        return (
          <g key={index}>
            <line x1={x} y1={baseline} x2={x} y2={y} stroke={bandColor(colors, index, bands.length)} strokeWidth="1" opacity={0.05 + value * 0.12} />
            <circle cx={x} cy={y} r={2.5 + value * 4.2} fill={bandColor(colors, index, bands.length)} opacity={0.34 + value * 0.58} />
          </g>
        );
      })}
      <FamilyLabel colors={colors} title="DOT MATRIX" detail="DISCRETE BAND ENERGY" />
    </g>
  );
};

const TwinSpectrum: React.FC<ExtendedSpectrumVisualizerProps> = ({ colors, audio, opacity, seed, timeSec }) => {
  const bands = spectrumForFrame(audio, timeSec, seed);
  const left = 330;
  const right = 1590;
  const width = right - left;
  const baselines = [470, 680];
  const rows = [bands, [...bands].reverse()];

  return (
    <g opacity={opacity}>
      {rows.map((row, rowIndex) => {
        const baseline = baselines[rowIndex];
        const points = row.map((value, index): Point => ([
          left + (index / Math.max(1, row.length - 1)) * width,
          baseline - Math.pow(value, 0.92) * 150,
        ]));
        return (
          <g key={rowIndex}>
            <path d={`M ${left} ${baseline} H ${right}`} stroke={rowIndex === 0 ? colors.ink : colors.accent} strokeWidth="1" opacity="0.24" />
            <path d={pathFromPoints(points)} fill="none" stroke={rowIndex === 0 ? colors.ink : colors.accent} strokeWidth={rowIndex === 0 ? 3.5 : 2.5} strokeLinecap="round" strokeLinejoin="round" opacity={rowIndex === 0 ? 0.82 : 0.52} />
          </g>
        );
      })}
      <FamilyLabel colors={colors} title="TWIN TRACK" detail="STACKED / REVERSED SPECTRUM" x={330} y={276} />
    </g>
  );
};

const RadialWaveform: React.FC<ExtendedSpectrumVisualizerProps> = ({ colors, audio, opacity, seed, timeSec }) => {
  const bands = spectrumForFrame(audio, timeSec, seed);
  const centerX = 960;
  const centerY = 522;
  const baseRadius = 206;
  const points = bands.map((value, index) => {
    const angle = -Math.PI / 2 + (index / bands.length) * Math.PI * 2;
    return pointOnCircle(centerX, centerY, baseRadius + 18 + Math.pow(value, 0.92) * 152, angle);
  });

  return (
    <g opacity={opacity}>
      <circle cx={centerX} cy={centerY} r={baseRadius} fill={colors.surface} opacity={0.045 + audio.calmEnergy * 0.035} />
      <circle cx={centerX} cy={centerY} r={baseRadius} fill="none" stroke={colors.ink} strokeWidth="1" opacity="0.18" />
      <path d={pathFromPoints(points, true)} fill={colors.accent} fillOpacity="0.06" stroke={colors.ink} strokeWidth="3" strokeLinejoin="round" opacity="0.82" />
      <circle cx={centerX} cy={centerY} r={138 + audio.pulse * 6} fill="none" stroke={colors.accent} strokeWidth="1" opacity={0.08 + audio.pulse * 0.08} />
      <FamilyLabel colors={colors} title="RADIAL WAVEFORM" detail="CLOSED CONTOUR / 360°" x={centerX} y={centerY - 8} anchor="middle" />
    </g>
  );
};

const RadialDots: React.FC<ExtendedSpectrumVisualizerProps> = ({ colors, audio, opacity, seed, timeSec }) => {
  const bands = spectrumForFrame(audio, timeSec, seed);
  const centerX = 960;
  const centerY = 522;
  const baseRadius = 220;

  return (
    <g opacity={opacity}>
      <circle cx={centerX} cy={centerY} r={baseRadius} fill="none" stroke={colors.ink} strokeWidth="1" opacity="0.14" />
      {bands.map((value, index) => {
        const angle = -Math.PI / 2 + (index / bands.length) * Math.PI * 2;
        const inner = pointOnCircle(centerX, centerY, baseRadius, angle);
        const dot = pointOnCircle(centerX, centerY, baseRadius + 14 + Math.pow(value, 0.9) * 130, angle);
        return (
          <g key={index}>
            <line x1={inner[0]} y1={inner[1]} x2={dot[0]} y2={dot[1]} stroke={bandColor(colors, index, bands.length)} strokeWidth="1" opacity={0.05 + value * 0.1} />
            <circle cx={dot[0]} cy={dot[1]} r={2.6 + value * 3.4} fill={bandColor(colors, index, bands.length)} opacity={0.32 + value * 0.58} />
          </g>
        );
      })}
      <FamilyLabel colors={colors} title="RADIAL DOTS" detail="ORBITAL BAND ENERGY" x={centerX} y={centerY - 8} anchor="middle" />
    </g>
  );
};

const ArcSpectrum: React.FC<ExtendedSpectrumVisualizerProps> = ({ colors, audio, opacity, seed, timeSec }) => {
  const bands = spectrumForFrame(audio, timeSec, seed);
  const centerX = 960;
  const centerY = 690;
  const baseRadius = 265;
  const arcPoints = bands.map((_, index) => {
    const angle = Math.PI + (index / Math.max(1, bands.length - 1)) * Math.PI;
    return pointOnCircle(centerX, centerY, baseRadius, angle);
  });

  return (
    <g opacity={opacity}>
      <path d={pathFromPoints(arcPoints)} fill="none" stroke={colors.ink} strokeWidth="1.5" opacity="0.22" />
      {bands.map((value, index) => {
        const angle = Math.PI + (index / Math.max(1, bands.length - 1)) * Math.PI;
        const inner = pointOnCircle(centerX, centerY, baseRadius + 4, angle);
        const outer = pointOnCircle(centerX, centerY, baseRadius + 16 + Math.pow(value, 0.9) * 150, angle);
        return (
          <line
            key={index}
            x1={inner[0]}
            y1={inner[1]}
            x2={outer[0]}
            y2={outer[1]}
            stroke={bandColor(colors, index, bands.length)}
            strokeWidth={4 + value * 1.8}
            strokeLinecap="round"
            opacity={0.28 + value * 0.6}
          />
        );
      })}
      <circle cx={centerX} cy={centerY} r={5 + audio.pulse * 4} fill={colors.accent} opacity={0.38 + audio.pulse * 0.18} />
      <FamilyLabel colors={colors} title="HALF ARC" detail="180° SPECTRUM FAN" x={centerX} y={centerY - 48} anchor="middle" />
    </g>
  );
};

const FilledRadialSpectrum: React.FC<ExtendedSpectrumVisualizerProps> = ({ colors, audio, opacity, seed, timeSec }) => {
  const bands = spectrumForFrame(audio, timeSec, seed);
  const centerX = 960;
  const centerY = 522;
  const baseRadius = 160;
  const points = bands.map((value, index) => {
    const angle = -Math.PI / 2 + (index / bands.length) * Math.PI * 2;
    return pointOnCircle(centerX, centerY, baseRadius + 30 + Math.pow(value, 0.88) * 176, angle);
  });

  return (
    <g opacity={opacity}>
      <path d={pathFromPoints(points, true)} fill={colors.accent} fillOpacity="0.18" stroke={colors.ink} strokeWidth="2.5" strokeLinejoin="round" opacity="0.84" />
      <circle cx={centerX} cy={centerY} r={baseRadius - 22} fill={colors.background} opacity="0.9" />
      <circle cx={centerX} cy={centerY} r={baseRadius - 22} fill="none" stroke={colors.accent} strokeWidth="1" opacity={0.18 + audio.pulse * 0.08} />
      <FamilyLabel colors={colors} title="FILLED RADIAL" detail="SPECTRAL MASS / CUTOUT" x={centerX} y={centerY - 8} anchor="middle" />
    </g>
  );
};

const pointAndNormalOnPolyline = (vertices: Point[], progress: number): { point: Point; normal: Point } => {
  const lengths = vertices.slice(0, -1).map(([x, y], index) => {
    const next = vertices[index + 1];
    return Math.hypot(next[0] - x, next[1] - y);
  });
  const total = lengths.reduce((sum, value) => sum + value, 0);
  let remaining = clamp01(progress) * total;
  let segmentIndex = 0;
  while (segmentIndex < lengths.length - 1 && remaining > lengths[segmentIndex]) {
    remaining -= lengths[segmentIndex];
    segmentIndex += 1;
  }
  const start = vertices[segmentIndex];
  const end = vertices[segmentIndex + 1];
  const length = Math.max(1, lengths[segmentIndex]);
  const local = remaining / length;
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  return {
    point: [start[0] + dx * local, start[1] + dy * local],
    normal: [-dy / length, dx / length],
  };
};

const TriangleSpectrum: React.FC<ExtendedSpectrumVisualizerProps> = ({ colors, audio, opacity, seed, timeSec }) => {
  const bands = spectrumForFrame(audio, timeSec, seed);
  const vertices: Point[] = [[960, 264], [650, 746], [1270, 746], [960, 264]];

  return (
    <g opacity={opacity}>
      <path d={pathFromPoints(vertices)} fill={colors.surface} fillOpacity="0.04" stroke={colors.ink} strokeWidth="1.5" opacity="0.3" />
      {bands.map((value, index) => {
        const { point, normal } = pointAndNormalOnPolyline(vertices, index / Math.max(1, bands.length - 1));
        const length = 8 + Math.pow(value, 0.9) * 96;
        return (
          <line
            key={index}
            x1={point[0]}
            y1={point[1]}
            x2={point[0] + normal[0] * length}
            y2={point[1] + normal[1] * length}
            stroke={bandColor(colors, index, bands.length)}
            strokeWidth={3.4 + value * 1.2}
            strokeLinecap="round"
            opacity={0.28 + value * 0.58}
          />
        );
      })}
      <circle cx="960" cy="584" r={5 + audio.pulse * 4} fill={colors.accent} opacity={0.38 + audio.pulse * 0.16} />
      <FamilyLabel colors={colors} title="TRIANGLE TRACE" detail="SPECTRUM ON A CLOSED PATH" x={960} y={560} anchor="middle" />
    </g>
  );
};

const XSpectrum: React.FC<ExtendedSpectrumVisualizerProps> = ({ colors, audio, opacity, seed, timeSec }) => {
  const bands = spectrumForFrame(audio, timeSec, seed);
  const half = Math.ceil(bands.length / 2);
  const diagonals: [Point, Point][] = [
    [[690, 304], [1230, 760]],
    [[1230, 304], [690, 760]],
  ];

  return (
    <g opacity={opacity}>
      {diagonals.map(([start, end], diagonalIndex) => {
        const row = bands.slice(diagonalIndex * half, (diagonalIndex + 1) * half);
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const length = Math.hypot(dx, dy);
        const normal: Point = [-dy / length, dx / length];
        return (
          <g key={diagonalIndex}>
            <line x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]} stroke={colors.ink} strokeWidth="1" opacity="0.2" />
            {row.map((value, index) => {
              const progress = index / Math.max(1, row.length - 1);
              const x = start[0] + dx * progress;
              const y = start[1] + dy * progress;
              const radius = 7 + Math.pow(value, 0.9) * 54;
              return (
                <line
                  key={index}
                  x1={x - normal[0] * radius}
                  y1={y - normal[1] * radius}
                  x2={x + normal[0] * radius}
                  y2={y + normal[1] * radius}
                  stroke={bandColor(colors, index + diagonalIndex * half, bands.length)}
                  strokeWidth={3 + value * 1.3}
                  strokeLinecap="round"
                  opacity={0.24 + value * 0.58}
                />
              );
            })}
          </g>
        );
      })}
      <circle cx="960" cy="532" r={12 + audio.pulse * 7} fill="none" stroke={colors.accent} strokeWidth="1" opacity={0.08 + audio.pulse * 0.1} />
      <FamilyLabel colors={colors} title="X TRACE" detail="TWO CROSSED SPECTRUM PATHS" x={960} y={522} anchor="middle" />
    </g>
  );
};

const SideBurstRing: React.FC<ExtendedSpectrumVisualizerProps> = ({ colors, audio, opacity, seed, timeSec }) => {
  const bands = spectrumForFrame(audio, timeSec, seed);
  const centerX = 900;
  const centerY = 522;
  const baseRadius = 220;

  return (
    <g opacity={opacity}>
      <circle cx={centerX} cy={centerY} r={baseRadius} fill="none" stroke={colors.ink} strokeWidth="2" opacity="0.32" />
      <circle cx={centerX} cy={centerY} r={baseRadius - 18} fill={colors.surface} opacity="0.045" />
      {bands.map((value, index) => {
        const angle = -Math.PI / 2 + (index / bands.length) * Math.PI * 2;
        const sideEnvelope = Math.pow(Math.max(0, Math.cos(angle)), 3.5);
        const inner = pointOnCircle(centerX, centerY, baseRadius + 4, angle);
        const length = 10 + Math.pow(value, 0.9) * (54 + sideEnvelope * 154);
        const outer = pointOnCircle(centerX, centerY, baseRadius + length, angle);
        return (
          <line
            key={index}
            x1={inner[0]}
            y1={inner[1]}
            x2={outer[0]}
            y2={outer[1]}
            stroke={bandColor(colors, index, bands.length)}
            strokeWidth={3.5 + value * 1.4}
            strokeLinecap="round"
            opacity={0.25 + value * 0.6}
          />
        );
      })}
      <circle cx={centerX} cy={centerY} r={152 + audio.pulse * 6} fill="none" stroke={colors.accent} strokeWidth="1" opacity={0.07 + audio.pulse * 0.08} />
      <FamilyLabel colors={colors} title="SIDE BURST" detail="DIRECTIONAL RING ENVELOPE" x={centerX} y={centerY - 8} anchor="middle" />
    </g>
  );
};

export const ExtendedSpectrumVisualizer: React.FC<ExtendedSpectrumVisualizerProps> = (props) => {
  switch (props.variant) {
    case "waveform-line":
      return <HorizontalWaveform {...props} mode="line" />;
    case "mirrored-waveform":
      return <HorizontalWaveform {...props} mode="mirrored" />;
    case "filled-spectrum":
      return <HorizontalWaveform {...props} mode="filled" />;
    case "spectrum-dots":
      return <DotSpectrum {...props} />;
    case "twin-spectrum":
      return <TwinSpectrum {...props} />;
    case "radial-waveform":
      return <RadialWaveform {...props} />;
    case "radial-dots":
      return <RadialDots {...props} />;
    case "spectrum-arc":
      return <ArcSpectrum {...props} />;
    case "filled-radial-spectrum":
      return <FilledRadialSpectrum {...props} />;
    case "triangle-spectrum":
      return <TriangleSpectrum {...props} />;
    case "x-spectrum":
      return <XSpectrum {...props} />;
    case "side-burst-ring":
      return <SideBurstRing {...props} />;
  }
};
