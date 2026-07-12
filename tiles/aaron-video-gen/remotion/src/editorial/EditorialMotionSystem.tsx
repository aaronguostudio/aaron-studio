import React from "react";

// remotion-static-primitives: parent scenes supply all frame-driven values.

export const editorial = {
  color: {
    canvas: "#090c0b",
    surface: "#111714",
    surfaceStrong: "#17201c",
    paper: "#f1eee6",
    ink: "#111411",
    paperMuted: "#697069",
    paperBody: "#454a45",
    text: "#f7f5ee",
    muted: "#9ca69f",
    quiet: "#66716a",
    signal: "#58d1a3",
    signalDark: "#14372b",
    tension: "#ef765f",
    tensionDark: "#3a1e1a",
    line: "rgba(247, 245, 238, 0.14)",
    lineStrong: "rgba(247, 245, 238, 0.24)",
    grid: "rgba(247, 245, 238, 0.07)",
    shadowSoft: "rgba(0, 0, 0, 0.28)",
    shadowStrong: "rgba(0, 0, 0, 0.38)",
    captionSurface: "rgba(9, 12, 11, 0.94)",
  },
  safe: {
    left: 112,
    right: 112,
    top: 126,
    bottom: 154,
    width: 1696,
  },
  type: {
    display: 82,
    sceneTitle: 64,
    panelTitle: 46,
    label: 19,
    body: 24,
    caption: 31,
    micro: 16,
  },
  space: {
    xs: 8,
    sm: 12,
    md: 20,
    lg: 28,
    xl: 40,
    xxl: 64,
  },
  radius: 4,
} as const;

export const editorialMotionBounds = {
  maxInformationalRotateYDeg: 36,
  minProjectedWidthRatio: 0.8,
  maxInformationalTranslateXPx: 36,
  maxInformationalTranslateZPx: 24,
  protectedZoneGapPx: 64,
} as const;

const clampUnit = (value: number): number =>
  Math.min(1, Math.max(0, value));

export const informationalPlaneTurn = (
  progressValue: number,
  direction: -1 | 1 = -1,
): {
  transform: string;
  rotateYDeg: number;
  projectedWidthRatio: number;
} => {
  const value = clampUnit(progressValue);
  const rotateYDeg =
    direction * editorialMotionBounds.maxInformationalRotateYDeg * value;
  const translateXPx =
    direction * editorialMotionBounds.maxInformationalTranslateXPx * value;
  const translateZPx =
    editorialMotionBounds.maxInformationalTranslateZPx * value;

  return {
    transform: `translateX(${translateXPx}px) rotateY(${rotateYDeg}deg) translateZ(${translateZPx}px)`,
    rotateYDeg,
    projectedWidthRatio: Math.cos((Math.abs(rotateYDeg) * Math.PI) / 180),
  };
};

export const signalWithAlpha = (alpha: number): string =>
  `rgba(88, 209, 163, ${alpha})`;

export const dependentReveal = (
  parentProgress: number,
  startAt = 0.94,
): number =>
  Math.min(1, Math.max(0, (parentProgress - startAt) / (1 - startAt)));

type SceneHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  top?: number;
  titleSize?: number;
  opacity?: number;
  transform?: string;
};

export const SceneHeader: React.FC<SceneHeaderProps> = ({
  eyebrow,
  title,
  aside,
  top = editorial.safe.top,
  titleSize = editorial.type.sceneTitle,
  opacity = 1,
  transform,
}) => (
  <div
    style={{
      position: "absolute",
      left: editorial.safe.left,
      right: editorial.safe.right,
      top,
      opacity,
      transform,
    }}
  >
    {eyebrow ? (
      <div
        style={{
          color: editorial.color.signal,
          fontSize: editorial.type.label,
          fontWeight: 760,
          textTransform: "uppercase",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {eyebrow}
      </div>
    ) : null}
    <div
      style={{
        marginTop: eyebrow ? 18 : 0,
      }}
    >
      <div
        style={{
          color: editorial.color.text,
          fontSize: titleSize,
          lineHeight: 1.02,
          fontWeight: 810,
          letterSpacing: 0,
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </div>
      {aside ? (
        <div
          style={{
            marginTop: 18,
            maxWidth: 1100,
            color: editorial.color.muted,
            fontSize: 22,
            lineHeight: 1.35,
            fontWeight: 560,
            textAlign: "left",
          }}
        >
          {aside}
        </div>
      ) : null}
    </div>
  </div>
);

type FlowNodeProps = {
  label: React.ReactNode;
  tone?: "neutral" | "signal" | "tension" | "paper";
  width?: number;
  height?: number;
  fontSize?: number;
  opacity?: number;
  transform?: string;
};

const flowTone = {
  neutral: {
    background: editorial.color.surfaceStrong,
    border: editorial.color.lineStrong,
    color: editorial.color.text,
  },
  signal: {
    background: editorial.color.signalDark,
    border: editorial.color.signal,
    color: editorial.color.text,
  },
  tension: {
    background: editorial.color.tensionDark,
    border: editorial.color.tension,
    color: editorial.color.text,
  },
  paper: {
    background: editorial.color.paper,
    border: editorial.color.paper,
    color: editorial.color.ink,
  },
} as const;

export const FlowNode: React.FC<FlowNodeProps> = ({
  label,
  tone = "neutral",
  width = 220,
  height = 96,
  fontSize = 22,
  opacity = 1,
  transform,
}) => {
  const colors = flowTone[tone];
  return (
    <div
      style={{
        width,
        height,
        padding: "0 24px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: editorial.radius,
        color: colors.color,
        fontSize,
        lineHeight: 1.15,
        fontWeight: 750,
        textAlign: "center",
        opacity,
        transform,
      }}
    >
      {label}
    </div>
  );
};

type FrameworkCardProps = {
  letter: string;
  label: string;
  question: string;
  reveal: number;
};

export const FrameworkCard: React.FC<FrameworkCardProps> = ({
  letter,
  label,
  question,
  reveal,
}) => (
  <div
    style={{
      position: "relative",
      height: 286,
      padding: "28px 26px",
      boxSizing: "border-box",
      backgroundColor: editorial.color.surface,
      border: `1px solid ${
        reveal > 0.01 ? editorial.color.signal : editorial.color.lineStrong
      }`,
      borderRadius: editorial.radius,
      color: editorial.color.text,
      opacity: 0.42 + reveal * 0.58,
      transform: `translateY(${(1 - reveal) * 10}px)`,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 6,
        backgroundColor: editorial.color.signal,
        transformOrigin: "bottom center",
        transform: `scaleY(${reveal})`,
      }}
    />
    <div
      style={{
        fontSize: 82,
        lineHeight: 0.9,
        fontWeight: 840,
        letterSpacing: 0,
      }}
    >
      {letter}
    </div>
    <div style={{ marginTop: 30, fontSize: 29, fontWeight: 780 }}>{label}</div>
    <div
      style={{
        marginTop: 18,
        color: editorial.color.muted,
        fontSize: 19,
        lineHeight: 1.32,
        fontWeight: 560,
      }}
    >
      {question}
    </div>
  </div>
);

type OutcomeBandProps = {
  label: string;
  left: React.ReactNode;
  right: React.ReactNode;
  opacity?: number;
  transform?: string;
};

export const OutcomeBand: React.FC<OutcomeBandProps> = ({
  label,
  left,
  right,
  opacity = 1,
  transform,
}) => (
  <div
    style={{
      position: "absolute",
      left: editorial.safe.left,
      width: editorial.safe.width,
      height: 108,
      display: "grid",
      gridTemplateColumns: "250px 1fr 1fr",
      alignItems: "center",
      borderTop: `1px solid ${editorial.color.lineStrong}`,
      borderBottom: `1px solid ${editorial.color.lineStrong}`,
      opacity,
      transform,
    }}
  >
    <div
      style={{
        color: editorial.color.muted,
        fontSize: editorial.type.label,
        fontWeight: 760,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
    <div
      style={{
        color: editorial.color.tension,
        fontSize: 28,
        fontWeight: 760,
        textAlign: "center",
      }}
    >
      {left}
    </div>
    <div
      style={{
        color: editorial.color.signal,
        fontSize: 28,
        fontWeight: 760,
        textAlign: "center",
      }}
    >
      {right}
    </div>
  </div>
);
