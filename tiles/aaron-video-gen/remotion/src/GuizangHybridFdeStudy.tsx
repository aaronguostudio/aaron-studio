import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const GUIZANG_HYBRID_FDE_FPS = 30;
export const GUIZANG_HYBRID_FDE_DURATION_SEC = 25;

export const guizangHybridFdeStudyDurationFrames = (
  fps = GUIZANG_HYBRID_FDE_FPS,
): number => Math.round(GUIZANG_HYBRID_FDE_DURATION_SEC * fps);

const palette = {
  paper: "#F5F0E7",
  ink: "#1B1916",
  muted: "#716B62",
  rule: "#D8D0C3",
  cyan: "#157A8A",
  coral: "#C65C48",
  amber: "#D78B23",
};

const frameAt = (seconds: number, fps: number) => seconds * fps;

const ease = Easing.bezier(0.23, 1, 0.32, 1);

const ramp = (
  frame: number,
  start: number,
  end: number,
  from = 0,
  to = 1,
): number =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

const sceneVisibility = (
  frame: number,
  start: number,
  end: number,
  fps: number,
): number => {
  const enter = ramp(frame, start, start + frameAt(0.45, fps));
  const exit = 1 - ramp(frame, end - frameAt(0.36, fps), end);
  return Math.min(enter, exit);
};

const Meta: React.FC<{ label: string; index: string; inverse?: boolean }> = ({
  label,
  index,
  inverse = false,
}) => (
  <div
    style={{
      position: "absolute",
      top: 56,
      left: 120,
      right: 120,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: inverse ? "rgba(245,240,231,0.78)" : palette.muted,
      fontFamily: "SFMono-Regular, Menlo, monospace",
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: 2.1,
      textTransform: "uppercase",
    }}
  >
    <span>Aaron Guo / Field Note</span>
    <span>{index} / {label}</span>
  </div>
);

const PaperField: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: palette.paper }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.26,
        backgroundImage: `linear-gradient(90deg, transparent 0, transparent 49.95%, ${palette.rule} 50%, transparent 50.05%), linear-gradient(${palette.rule} 1px, transparent 1px)`,
        backgroundSize: "160px 100%, 100% 132px",
      }}
    />
  </AbsoluteFill>
);

const CoverScene: React.FC<{ visible: number }> = ({ visible }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const settle = ramp(frame, 0, frameAt(3.2, fps));

  return (
    <AbsoluteFill style={{ opacity: visible, overflow: "hidden" }}>
      <Img
        src={staticFile("fde-v5/cover-hero.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${1.035 - settle * 0.035})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(245,240,231,0.1)",
        }}
      />
      <Meta label="Editorial Study" index="01" />
      <div
        style={{
          position: "absolute",
          left: 120,
          bottom: 98,
          width: 760,
          padding: "34px 40px 38px",
          backgroundColor: "rgba(245,240,231,0.94)",
          color: palette.ink,
          boxShadow: "0 14px 38px rgba(27,25,22,0.12)",
        }}
      >
        <div
          style={{
            color: palette.coral,
            fontFamily: "SFMono-Regular, Menlo, monospace",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 2.3,
            textTransform: "uppercase",
          }}
        >
          Enterprise AI / Field Study
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: "Georgia, Times New Roman, serif",
            fontSize: 58,
            lineHeight: 1.01,
            fontWeight: 700,
          }}
        >
          Expensive tokens will not change the work.
        </div>
        <div
          style={{
            marginTop: 18,
            color: palette.muted,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 23,
            lineHeight: 1.35,
          }}
        >
          Forward deployed engineering turns model capability into operating capacity.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const LedgerRow: React.FC<{
  label: string;
  detail: string;
  color: string;
  order: number;
  start: number;
}> = ({ label, detail, color, order, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = ramp(
    frame,
    start + frameAt(0.28 * order, fps),
    start + frameAt(0.28 * order + 0.54, fps),
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "250px 1fr 184px",
        alignItems: "center",
        columnGap: 30,
        minHeight: 91,
        borderTop: `1px solid ${palette.rule}`,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 18}px)`,
      }}
    >
      <div
        style={{
          fontFamily: "Georgia, Times New Roman, serif",
          fontSize: 31,
          lineHeight: 1,
          fontWeight: 700,
          color: palette.ink,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: palette.muted,
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 20,
          lineHeight: 1.2,
        }}
      >
        {detail}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ width: 116, height: 5, backgroundColor: color }} />
      </div>
    </div>
  );
};

const ConvergenceScene: React.FC<{ visible: number; start: number }> = ({
  visible,
  start,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const conclusion = ramp(frame, start + frameAt(1.55, fps), start + frameAt(2.15, fps));

  return (
    <AbsoluteFill style={{ opacity: visible, color: palette.ink }}>
      <PaperField />
      <Meta label="Signal" index="02" />
      <div style={{ position: "absolute", top: 164, left: 120, right: 120 }}>
        <div
          style={{
            color: palette.cyan,
            fontFamily: "SFMono-Regular, Menlo, monospace",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 2.3,
            textTransform: "uppercase",
          }}
        >
          Four announcements. One underlying move.
        </div>
        <div
          style={{
            marginTop: 18,
            width: 1320,
            fontFamily: "Georgia, Times New Roman, serif",
            fontSize: 72,
            lineHeight: 0.98,
            fontWeight: 700,
          }}
        >
          The investment is not only in models. It is in deployment capacity.
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 450 }}>
        <LedgerRow label="Anthropic" detail="Enterprise services company" color={palette.coral} order={0} start={start} />
        <LedgerRow label="OpenAI" detail="Forward deployment capacity" color={palette.cyan} order={1} start={start} />
        <LedgerRow label="AWS" detail="Agentic delivery teams" color={palette.amber} order={2} start={start} />
        <LedgerRow label="Microsoft" detail="AI transformation delivery" color={palette.ink} order={3} start={start} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          bottom: 82,
          color: palette.coral,
          fontFamily: "SFMono-Regular, Menlo, monospace",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 2.1,
          opacity: conclusion,
          transform: `translateY(${(1 - conclusion) * 12}px)`,
          textTransform: "uppercase",
        }}
      >
        The bottleneck is the work around the model.
      </div>
    </AbsoluteFill>
  );
};

const LoopNode: React.FC<{
  label: string;
  description: string;
  color: string;
  order: number;
  start: number;
}> = ({ label, description, color, order, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = ramp(
    frame,
    start + frameAt(0.24 + 0.34 * order, fps),
    start + frameAt(0.72 + 0.34 * order, fps),
  );

  return (
    <div
      style={{
        flex: 1,
        minHeight: 226,
        padding: "28px 30px",
        backgroundColor: palette.paper,
        borderTop: `8px solid ${color}`,
        boxShadow: "0 12px 28px rgba(27,25,22,0.12)",
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 24}px)`,
      }}
    >
      <div
        style={{
          color,
          fontFamily: "SFMono-Regular, Menlo, monospace",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 2.2,
        }}
      >
        0{order + 1}
      </div>
      <div
        style={{
          marginTop: 19,
          fontFamily: "Georgia, Times New Roman, serif",
          fontSize: 45,
          lineHeight: 1,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 18,
          color: palette.muted,
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 20,
          lineHeight: 1.26,
        }}
      >
        {description}
      </div>
    </div>
  );
};

const OperatingLoopScene: React.FC<{ visible: number; start: number }> = ({
  visible,
  start,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const nodesReady = start + frameAt(1.42, fps);
  const loop = ramp(frame, nodesReady, nodesReady + frameAt(1.15, fps));
  const loopLength = 1120;

  return (
    <AbsoluteFill style={{ opacity: visible, overflow: "hidden", backgroundColor: palette.ink }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          backgroundImage: `linear-gradient(90deg, rgba(245,240,231,0.18) 1px, transparent 1px), linear-gradient(rgba(245,240,231,0.18) 1px, transparent 1px)`,
          backgroundSize: "140px 140px",
        }}
      />
      <Meta label="Operating Loop" index="03" inverse />
      <div style={{ position: "absolute", top: 165, left: 120, right: 120 }}>
        <div
          style={{
            color: palette.amber,
            fontFamily: "SFMono-Regular, Menlo, monospace",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 2.3,
            textTransform: "uppercase",
          }}
        >
          FDE is a feedback system, not a handoff.
        </div>
        <div
          style={{
            marginTop: 18,
            width: 1400,
            color: palette.paper,
            fontFamily: "Georgia, Times New Roman, serif",
            fontSize: 70,
            lineHeight: 0.98,
            fontWeight: 700,
          }}
        >
          Product learns from the field. The next deployment begins better.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 505,
          left: 120,
          right: 120,
          display: "flex",
          gap: 28,
          color: palette.ink,
        }}
      >
        <LoopNode label="Model" description="General capability" color={palette.amber} order={0} start={start} />
        <LoopNode label="Field" description="Context and real work" color={palette.cyan} order={1} start={start} />
        <LoopNode label="Product" description="Reusable capability" color={palette.coral} order={2} start={start} />
      </div>
      <svg
        width={width}
        height={1080}
        viewBox={`0 0 ${width} 1080`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <path
          d="M 355 805 C 600 965, 1320 965, 1565 805"
          fill="none"
          stroke={palette.cyan}
          strokeWidth={5}
          strokeDasharray={loopLength}
          strokeDashoffset={loopLength * (1 - loop)}
          opacity={loop > 0 ? 1 : 0}
        />
        <circle cx="355" cy="805" r="7" fill={palette.cyan} opacity={loop} />
        <circle cx="1565" cy="805" r="7" fill={palette.cyan} opacity={loop} />
      </svg>
      <div
        style={{
          position: "absolute",
          bottom: 91,
          left: 120,
          color: "rgba(245,240,231,0.72)",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 24,
          opacity: loop,
        }}
      >
        The field is where a model becomes an operating capability.
      </div>
    </AbsoluteFill>
  );
};

export const GuizangHybridFdeStudy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const coverEnd = frameAt(8, fps);
  const signalEnd = frameAt(17, fps);
  const end = frameAt(GUIZANG_HYBRID_FDE_DURATION_SEC, fps);
  const coverExit = 1 - ramp(
    frame,
    coverEnd - frameAt(0.36, fps),
    coverEnd,
  );
  const musicFadeIn = ramp(frame, 0, frameAt(0.7, fps));
  const musicFadeOut = 1 - ramp(frame, end - frameAt(1.3, fps), end);

  return (
    <AbsoluteFill>
      <Audio
        src={staticFile("fde-full-film/music-full-v1.mp3")}
        volume={0.2 * Math.min(musicFadeIn, musicFadeOut)}
      />
      <CoverScene visible={coverExit} />
      <ConvergenceScene
        visible={sceneVisibility(
          frame,
          coverEnd - frameAt(0.36, fps),
          signalEnd,
          fps,
        )}
        start={coverEnd}
      />
      <OperatingLoopScene
        visible={sceneVisibility(
          frame,
          signalEnd - frameAt(0.36, fps),
          end,
          fps,
        )}
        start={signalEnd}
      />
    </AbsoluteFill>
  );
};
