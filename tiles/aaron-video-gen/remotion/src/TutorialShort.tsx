import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type TutorialStepKind =
  | "title"
  | "comparison"
  | "clip"
  | "evidence"
  | "workflow"
  | "approval"
  | "end";

export interface TutorialStep {
  id: string;
  startSec: number;
  endSec: number;
  kind: TutorialStepKind;
  eyebrow: string;
  title: string;
  subtitle?: string;
  items?: string[];
  labels?: string[];
  actions?: string[];
  assetFile?: string;
  sourceStartSec?: number;
  sourceLabel?: string;
  badge?: string;
}

export interface TutorialShortProps {
  brandName: string;
  seriesLabel: string;
  durationSec: number;
  narrationFile?: string;
  narrationVolume?: number;
  musicFile?: string;
  musicVolume?: number;
  accent?: string;
  steps: TutorialStep[];
}

const palette = {
  canvas: "#EEE8DD",
  surface: "#E5DCCE",
  surface2: "#D9CEBE",
  paper: "#FAF7F0",
  text: "#1A1916",
  ink: "#1A1916",
  muted: "#746E64",
  signal: "#C65F47",
  tension: "#8D6258",
  line: "rgba(26,25,22,0.16)",
};

const fontFamily =
  '"PingFang SC", "Noto Sans CJK SC", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const defaultSteps: TutorialStep[] = [
  {
    id: "title",
    startSec: 0,
    endSec: 4,
    kind: "title",
    eyebrow: "AUTOMATION TUTORIAL",
    title: "每天找选题？\n别每天重做。",
    subtitle: "把重复执行交给系统，把判断留给自己。",
  },
  {
    id: "workflow",
    startSec: 4,
    endSec: 12,
    kind: "workflow",
    eyebrow: "REVIEWABLE WORKFLOW",
    title: "每天交付一批\n可以审阅的工作",
    items: ["扫描信号", "排名选题", "等待批准"],
  },
];

export const defaultTutorialShortProps: TutorialShortProps = {
  brandName: "Aaron Guo",
  seriesLabel: "AI-NATIVE EXECUTION",
  durationSec: 12,
  narrationVolume: 1,
  musicVolume: 0.18,
  accent: palette.signal,
  steps: defaultSteps,
};

export const TutorialShort: React.FC<TutorialShortProps> = ({
  brandName,
  seriesLabel,
  narrationFile,
  narrationVolume = 1,
  musicFile,
  musicVolume = 0.18,
  accent = palette.signal,
  steps,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const time = frame / fps;
  const progress = durationInFrames > 1 ? frame / (durationInFrames - 1) : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.canvas,
        color: palette.text,
        fontFamily,
        overflow: "hidden",
      }}
    >
      {musicFile ? <Audio src={staticFile(musicFile)} volume={musicVolume} /> : null}
      {narrationFile ? (
        <Audio src={staticFile(narrationFile)} volume={narrationVolume} />
      ) : null}
      <Background accent={accent} time={time} />
      {steps.map((step) => (
        <StepSlot key={step.id} step={step} time={time}>
          <StepScene step={step} accent={accent} time={time} />
        </StepSlot>
      ))}
      <PersistentChrome
        brandName={brandName}
        seriesLabel={seriesLabel}
        progress={progress}
        accent={accent}
      />
    </AbsoluteFill>
  );
};

const Background: React.FC<{ accent: string; time: number }> = ({ accent, time }) => {
  const y = Math.sin(time * 0.35) * 18;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 12% 8%, ${accent}18 0%, transparent 30%), radial-gradient(circle at 92% 82%, rgba(121,92,67,0.10) 0%, transparent 32%), linear-gradient(160deg, ${palette.canvas}, #F3EEE5 56%, #E9E1D5)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.45,
          transform: `translateY(${y}px)`,
          backgroundImage:
            "linear-gradient(rgba(26,25,22,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(26,25,22,0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, black, transparent 88%)",
        }}
      />
    </AbsoluteFill>
  );
};

const StepSlot: React.FC<{
  step: TutorialStep;
  time: number;
  children: React.ReactNode;
}> = ({ step, time, children }) => {
  const enter = step.startSec === 0
    ? 1
    : interpolate(time, [step.startSec, step.startSec + 0.22], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
  const exit = interpolate(time, [step.endSec - 0.18, step.endSec], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(enter, exit);
  if (time < step.startSec - 0.25 || time > step.endSec + 0.25) return null;
  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${(1 - enter) * 24}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const StepScene: React.FC<{
  step: TutorialStep;
  accent: string;
  time: number;
}> = ({ step, accent, time }) => {
  const local = Math.max(0, time - step.startSec);
  if (step.kind === "title") return <TitleScene step={step} accent={accent} local={local} />;
  if (step.kind === "comparison") return <ComparisonScene step={step} accent={accent} local={local} />;
  if (step.kind === "clip") return <ClipScene step={step} accent={accent} local={local} />;
  if (step.kind === "evidence") return <EvidenceScene step={step} accent={accent} local={local} />;
  if (step.kind === "workflow") return <WorkflowScene step={step} accent={accent} local={local} />;
  if (step.kind === "approval") return <ApprovalScene step={step} accent={accent} local={local} />;
  return <EndScene step={step} accent={accent} local={local} />;
};

const SceneFrame: React.FC<{
  eyebrow: string;
  title: string;
  accent: string;
  children?: React.ReactNode;
}> = ({ eyebrow, title, accent, children }) => (
  <div
    style={{
      position: "absolute",
      inset: "190px 82px 170px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Eyebrow text={eyebrow} accent={accent} />
    <div
      style={{
        marginTop: 30,
        fontSize: 76,
        lineHeight: 1.1,
        fontWeight: 820,
        letterSpacing: -3.2,
        whiteSpace: "pre-line",
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

const Eyebrow: React.FC<{ text: string; accent: string; dark?: boolean }> = ({
  text,
  accent,
  dark = false,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 42, height: 6, borderRadius: 10, backgroundColor: accent }} />
    <div
      style={{
        color: dark ? "rgba(16,20,17,0.62)" : palette.muted,
        fontSize: 23,
        lineHeight: 1,
        fontWeight: 760,
        letterSpacing: 2.2,
      }}
    >
      {text}
    </div>
  </div>
);

const TitleScene: React.FC<{ step: TutorialStep; accent: string; local: number }> = ({
  step,
  accent,
  local,
}) => {
  const reveal = interpolate(local, [0, 0.65], [0.82, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: "150px 62px 150px",
        borderRadius: 34,
        backgroundColor: palette.paper,
        color: palette.ink,
        padding: "92px 72px",
        overflow: "hidden",
        border: `1px solid ${palette.line}`,
        boxShadow: "0 30px 80px rgba(73,57,43,0.14)",
      }}
    >
      <Eyebrow text={step.eyebrow} accent={accent} dark />
      <div
        style={{
          marginTop: 116,
          fontSize: 102,
          lineHeight: 1.05,
          fontWeight: 880,
          letterSpacing: -6,
          whiteSpace: "pre-line",
          transform: `translateY(${(1 - reveal) * 42}px)`,
          opacity: reveal,
        }}
      >
        {step.title}
      </div>
      {step.subtitle ? (
        <div
          style={{
            marginTop: 54,
            maxWidth: 780,
            fontSize: 36,
            lineHeight: 1.45,
            color: "rgba(16,20,17,0.62)",
            fontWeight: 560,
          }}
        >
          {step.subtitle}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 22,
          backgroundColor: accent,
          transformOrigin: "left center",
          transform: `scaleX(${reveal})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          right: -170,
          bottom: -110,
          borderRadius: "50%",
          border: `2px solid ${accent}`,
          opacity: 0.32,
        }}
      />
    </div>
  );
};

const ComparisonScene: React.FC<{ step: TutorialStep; accent: string; local: number }> = ({
  step,
  accent,
  local,
}) => {
  const items = step.items ?? [];
  const left = items[0] ?? "一键全自动发布";
  const right = items[1] ?? "每天交付可审阅工作";
  return (
    <SceneFrame eyebrow={step.eyebrow} title={step.title} accent={accent}>
      {step.subtitle ? <Subtitle>{step.subtitle}</Subtitle> : null}
      <div style={{ marginTop: 84, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        <CompareCard
          label={step.labels?.[0] ?? "NOT THIS"}
          value={left}
          color={palette.tension}
          progress={interpolate(local, [0.25, 0.75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
        <CompareCard
          label={step.labels?.[1] ?? "THIS"}
          value={right}
          color={accent}
          progress={interpolate(local, [0.5, 1.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      </div>
      {step.badge ? <Badge text={step.badge} color={accent} /> : null}
    </SceneFrame>
  );
};

const CompareCard: React.FC<{
  label: string;
  value: string;
  color: string;
  progress: number;
}> = ({ label, value, color, progress }) => (
  <div
    style={{
      minHeight: 440,
      borderRadius: 28,
      padding: "38px 34px",
      backgroundColor: "rgba(250,247,240,0.72)",
      border: `1px solid ${color}60`,
      transform: `translateY(${(1 - progress) * 34}px)`,
      opacity: progress,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <div style={{ color, fontSize: 24, fontWeight: 800, letterSpacing: 2 }}>{label}</div>
    <div style={{ fontSize: 47, lineHeight: 1.25, fontWeight: 760, letterSpacing: -1.8 }}>{value}</div>
    <div style={{ width: 58, height: 8, borderRadius: 8, backgroundColor: color }} />
  </div>
);

const ClipScene: React.FC<{ step: TutorialStep; accent: string; local: number }> = ({
  step,
  accent,
  local,
}) => {
  const { fps } = useVideoConfig();
  const reveal = interpolate(local, [0, 0.65], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const from = Math.round(step.startSec * fps);
  const durationInFrames = Math.max(1, Math.round((step.endSec - step.startSec) * fps));
  const sourceStart = Math.max(0, Math.round((step.sourceStartSec ?? 0) * fps));

  return (
    <Sequence from={from} durationInFrames={durationInFrames} layout="none">
      <div
        style={{
          position: "absolute",
          inset: "150px 62px 150px",
          borderRadius: 34,
          backgroundColor: palette.paper,
          border: `1px solid ${palette.line}`,
          boxShadow: "0 30px 80px rgba(73,57,43,0.18)",
          overflow: "hidden",
        }}
      >
        {step.assetFile ? (
          <OffthreadVideo
            src={staticFile(step.assetFile)}
            startFrom={sourceStart}
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${reveal})`,
            }}
          />
        ) : (
          <div style={{ padding: 48, color: palette.muted, fontSize: 34 }}>Video source</div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(18,16,13,0.05) 0%, rgba(18,16,13,0.02) 44%, rgba(18,16,13,0.78) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 42,
            right: 42,
            top: 42,
            borderRadius: 24,
            backgroundColor: "rgba(250,247,240,0.93)",
            color: palette.ink,
            padding: "28px 30px 30px",
            boxShadow: "0 16px 42px rgba(26,25,22,0.14)",
          }}
        >
          <Eyebrow text={step.eyebrow} accent={accent} dark />
          <div
            style={{
              marginTop: 22,
              fontSize: 58,
              lineHeight: 1.08,
              fontWeight: 850,
              letterSpacing: -2.8,
              whiteSpace: "pre-line",
            }}
          >
            {step.title}
          </div>
          {step.subtitle ? (
            <div style={{ marginTop: 18, color: palette.muted, fontSize: 28, lineHeight: 1.35 }}>
              {step.subtitle}
            </div>
          ) : null}
        </div>
        <div
          style={{
            position: "absolute",
            left: 42,
            right: 42,
            bottom: 42,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: palette.paper,
            fontSize: 22,
            fontWeight: 730,
            letterSpacing: 0.5,
          }}
        >
          <span>{step.sourceLabel ?? "LICENSED SOURCE"}</span>
          <span style={{ color: "#F4B59E" }}>{step.labels?.[0] ?? "SOURCE RECORDED ✓"}</span>
        </div>
      </div>
    </Sequence>
  );
};

const EvidenceScene: React.FC<{ step: TutorialStep; accent: string; local: number }> = ({
  step,
  accent,
  local,
}) => {
  const crop = interpolate(local, [0, 1.2], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <SceneFrame eyebrow={step.eyebrow} title={step.title} accent={accent}>
      {step.subtitle ? <Subtitle>{step.subtitle}</Subtitle> : null}
      <div
        style={{
          marginTop: 54,
          height: 650,
          borderRadius: 28,
          padding: 18,
          backgroundColor: palette.paper,
          border: `1px solid ${accent}60`,
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(73,57,43,0.16)",
        }}
      >
        {step.assetFile ? (
          <Img
            src={staticFile(step.assetFile)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 14%",
              transform: `scale(${crop})`,
            }}
          />
        ) : (
          <div style={{ color: palette.ink, fontSize: 34, padding: 42 }}>Source image</div>
        )}
      </div>
      <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", color: palette.muted, fontSize: 23 }}>
        <span>{step.sourceLabel ?? "SOURCE"}</span>
        <span style={{ color: accent }}>{step.labels?.[0] ?? "VERIFIED ✓"}</span>
      </div>
    </SceneFrame>
  );
};

const WorkflowScene: React.FC<{ step: TutorialStep; accent: string; local: number }> = ({
  step,
  accent,
  local,
}) => (
  <SceneFrame eyebrow={step.eyebrow} title={step.title} accent={accent}>
    {step.subtitle ? <Subtitle>{step.subtitle}</Subtitle> : null}
    <div style={{ marginTop: 66, display: "flex", flexDirection: "column", gap: 18 }}>
      {(step.items ?? []).map((item, index) => {
        const enter = interpolate(local, [0.2 + index * 0.28, 0.65 + index * 0.28], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div key={item} style={{ display: "grid", gridTemplateColumns: "96px 1fr", alignItems: "stretch", minHeight: 170, opacity: enter, transform: `translateX(${(1 - enter) * 26}px)` }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <div style={{ width: 58, height: 58, borderRadius: 20, backgroundColor: index === (step.items?.length ?? 1) - 1 ? accent : palette.surface2, border: `1px solid ${index === (step.items?.length ?? 1) - 1 ? accent : palette.line}`, color: index === (step.items?.length ?? 1) - 1 ? palette.paper : palette.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 25, fontWeight: 850 }}>{String(index + 1).padStart(2, "0")}</div>
              {index < (step.items?.length ?? 0) - 1 ? <div style={{ position: "absolute", left: 28, top: 116, width: 2, height: 72, backgroundColor: palette.line }} /> : null}
            </div>
            <div style={{ borderRadius: 26, backgroundColor: palette.surface, border: `1px solid ${palette.line}`, padding: "38px 42px", display: "flex", alignItems: "center", fontSize: 41, fontWeight: 710, letterSpacing: -1 }}>{item}</div>
          </div>
        );
      })}
    </div>
    {step.badge ? <Badge text={step.badge} color={accent} /> : null}
  </SceneFrame>
);

const ApprovalScene: React.FC<{ step: TutorialStep; accent: string; local: number }> = ({
  step,
  accent,
  local,
}) => {
  const pulse = 0.96 + interpolate(Math.sin(local * 3.2), [-1, 1], [0, 0.04]);
  return (
    <SceneFrame eyebrow={step.eyebrow} title={step.title} accent={accent}>
      {step.subtitle ? <Subtitle>{step.subtitle}</Subtitle> : null}
      <div style={{ marginTop: 82, borderRadius: 34, backgroundColor: palette.paper, color: palette.ink, padding: "58px 54px", minHeight: 490, display: "flex", flexDirection: "column", justifyContent: "space-between", transform: `scale(${pulse})`, boxShadow: `0 30px 100px ${accent}1F` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: "rgba(16,20,17,0.56)", fontSize: 25, fontWeight: 760, letterSpacing: 1.8 }}>{step.labels?.[0] ?? "EDITORIAL GATE"}</div>
          <div style={{ color: accent, backgroundColor: `${accent}20`, borderRadius: 999, padding: "12px 20px", fontSize: 22, fontWeight: 820 }}>{step.labels?.[1] ?? "WAITING"}</div>
        </div>
        <div style={{ fontSize: 56, lineHeight: 1.2, fontWeight: 850, letterSpacing: -2.8 }}>{step.items?.[0] ?? "批准这个选题？"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ borderRadius: 20, border: "1px solid rgba(26,25,22,0.16)", padding: "24px 18px", textAlign: "center", fontSize: 28, fontWeight: 720 }}>{step.actions?.[0] ?? "Revise"}</div>
          <div style={{ borderRadius: 20, backgroundColor: accent, color: palette.paper, padding: "24px 18px", textAlign: "center", fontSize: 28, fontWeight: 820 }}>{step.actions?.[1] ?? "Approve →"}</div>
        </div>
      </div>
      {step.badge ? <Badge text={step.badge} color={accent} /> : null}
    </SceneFrame>
  );
};

const EndScene: React.FC<{ step: TutorialStep; accent: string; local: number }> = ({
  step,
  accent,
  local,
}) => {
  const reveal = interpolate(local, [0.1, 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div style={{ position: "absolute", inset: "190px 82px 170px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Eyebrow text={step.eyebrow} accent={accent} />
      <div style={{ marginTop: 52, fontSize: 94, lineHeight: 1.08, fontWeight: 870, letterSpacing: -5.5, whiteSpace: "pre-line", transform: `translateY(${(1 - reveal) * 40}px)`, opacity: reveal }}>{step.title}</div>
      {step.subtitle ? <div style={{ marginTop: 56, color: palette.muted, fontSize: 37, lineHeight: 1.46, maxWidth: 820 }}>{step.subtitle}</div> : null}
      <div style={{ marginTop: 76, width: `${Math.round(reveal * 100)}%`, maxWidth: 820, height: 8, borderRadius: 8, backgroundColor: accent }} />
      {step.badge ? <Badge text={step.badge} color={accent} /> : null}
    </div>
  );
};

const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ marginTop: 30, color: palette.muted, fontSize: 34, lineHeight: 1.45, fontWeight: 520 }}>{children}</div>
);

const Badge: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <div style={{ marginTop: 36, alignSelf: "flex-start", borderRadius: 999, border: `1px solid ${color}80`, backgroundColor: `${color}14`, color, padding: "15px 22px", fontSize: 23, fontWeight: 780, letterSpacing: 0.5 }}>{text}</div>
);

const PersistentChrome: React.FC<{
  brandName: string;
  seriesLabel: string;
  progress: number;
  accent: string;
}> = ({ brandName, seriesLabel, progress, accent }) => (
  <>
    <div style={{ position: "absolute", top: 70, left: 82, right: 82, display: "flex", alignItems: "center", justifyContent: "space-between", color: palette.muted, fontSize: 21, fontWeight: 700, letterSpacing: 1.6 }}>
      <span>{seriesLabel}</span>
      <span>{brandName}</span>
    </div>
    <div style={{ position: "absolute", left: 82, right: 82, bottom: 78, height: 4, borderRadius: 4, backgroundColor: palette.line, overflow: "hidden" }}>
      <div style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%`, height: "100%", backgroundColor: accent }} />
    </div>
  </>
);
