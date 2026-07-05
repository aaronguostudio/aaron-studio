import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const SAMPLE_DURATION_SEC = 68;
const AUDIO_FILE = "signal-workflow-brief-sample/narration.mp3";

type SceneName = "signal" | "change" | "workflow" | "verdict" | "next";

type Scene = {
  name: SceneName;
  start: number;
  end: number;
};

const scenes: Scene[] = [
  { name: "signal", start: 0, end: 8 },
  { name: "change", start: 8, end: 20 },
  { name: "workflow", start: 20, end: 42 },
  { name: "verdict", start: 42, end: 57 },
  { name: "next", start: 57, end: SAMPLE_DURATION_SEC },
];

const palette = {
  bg: "#0B0F14",
  panel: "#111923",
  panel2: "#162333",
  text: "#F4F7FA",
  muted: "#9CA9B7",
  teal: "#3BD6C6",
  blue: "#78A7FF",
  amber: "#F6C762",
  green: "#72E08D",
  red: "#FF7A7A",
  line: "rgba(255,255,255,0.14)",
};

export const SignalWorkflowBriefSample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.bg,
        color: palette.text,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflow: "hidden",
      }}
    >
      <Audio src={staticFile(AUDIO_FILE)} />
      <Backdrop time={t} />
      <TopBar time={t} />
      <SceneSlot scene="signal" time={t}>
        <SignalScene time={t} />
      </SceneSlot>
      <SceneSlot scene="change" time={t}>
        <ChangeScene time={t} />
      </SceneSlot>
      <SceneSlot scene="workflow" time={t}>
        <WorkflowScene time={t} />
      </SceneSlot>
      <SceneSlot scene="verdict" time={t}>
        <VerdictScene time={t} />
      </SceneSlot>
      <SceneSlot scene="next" time={t}>
        <NextScene time={t} />
      </SceneSlot>
      <Progress time={t} />
      <Caption time={t} />
    </AbsoluteFill>
  );
};

export const signalWorkflowBriefSampleDurationFrames = (fps: number) =>
  Math.ceil(SAMPLE_DURATION_SEC * fps);

const getScene = (name: SceneName) => scenes.find((scene) => scene.name === name)!;

const sceneOpacity = (scene: Scene, time: number) => {
  const fadeIn =
    scene.start === 0
      ? 1
      : interpolate(time, [scene.start, scene.start + 0.8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
  const fadeOut = interpolate(time, [scene.end - 0.6, scene.end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  return Math.min(fadeIn, fadeOut);
};

const SceneSlot: React.FC<{
  scene: SceneName;
  time: number;
  children: React.ReactNode;
}> = ({ scene: sceneName, time, children }) => {
  const scene = getScene(sceneName);
  const opacity = sceneOpacity(scene, time);
  const y = interpolate(opacity, [0, 1], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        pointerEvents: "none",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Backdrop: React.FC<{ time: number }> = ({ time }) => {
  const rotation = time * 5;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 22% 20%, rgba(59,214,198,0.20), transparent 30%), radial-gradient(circle at 82% 78%, rgba(246,199,98,0.12), transparent 28%), linear-gradient(135deg, #0B0F14 0%, #101722 50%, #0B0F14 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 104,
          top: 134,
          width: 560,
          height: 560,
          borderRadius: "50%",
          border: `1px solid ${palette.line}`,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 204,
          top: 234,
          width: 360,
          height: 360,
          borderRadius: "50%",
          border: `1px solid ${palette.line}`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 384,
          top: 414,
          width: 220,
          height: 3,
          background: `linear-gradient(90deg, ${palette.teal}, transparent)`,
          transformOrigin: "0 50%",
          transform: `rotate(${rotation}deg)`,
          opacity: 0.42,
        }}
      />
      <Grid />
    </AbsoluteFill>
  );
};

const Grid: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      backgroundSize: "64px 64px",
      maskImage:
        "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.12))",
    }}
  />
);

const TopBar: React.FC<{ time: number }> = ({ time }) => (
  <div
    style={{
      position: "absolute",
      top: 44,
      left: 64,
      right: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      color: palette.muted,
      fontSize: 26,
      letterSpacing: 0,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <RadarDot time={time} />
      <span style={{ color: palette.text, fontWeight: 750 }}>Signal Workflow Brief</span>
      <span>/</span>
      <span>AI product updates that matter</span>
    </div>
    <span>June 2026 sample</span>
  </div>
);

const RadarDot: React.FC<{ time: number }> = ({ time }) => {
  const glow = interpolate(Math.sin(time * 4), [-1, 1], [0.45, 1]);
  return (
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        backgroundColor: palette.teal,
        boxShadow: `0 0 ${22 * glow}px ${palette.teal}`,
      }}
    />
  );
};

const SignalScene: React.FC<{ time: number }> = ({ time }) => {
  const local = time - getScene("signal").start;
  const cardScale = interpolate(local, [0.4, 1.2], [0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <MainLayout
      eyebrow="Signal found it"
      title="Perplexity Deep Research moves into Computer"
      subtitle="The question is not what shipped. The question is what workflow changed."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
          marginTop: 52,
        }}
      >
        <Panel style={{ transform: `scale(${cardScale})` }}>
          <Label>Source card</Label>
          <h3 style={h3Style}>Perplexity changelog</h3>
          <p style={bodyStyle}>June 19, 2026</p>
          <p style={{ ...bodyStyle, color: palette.text, marginTop: 26 }}>
            Deep Research, command panel, and enterprise controls
          </p>
          <div style={{ marginTop: 36 }}>
            <StatusLine label="Signal score" value="High workflow impact" color={palette.teal} />
            <StatusLine label="Audience" value="research-heavy operators" color={palette.amber} />
          </div>
        </Panel>
        <Panel>
          <Label>Operator question</Label>
          <div style={{ fontSize: 64, fontWeight: 820, lineHeight: 1.05 }}>
            Does this remove a step from real work?
          </div>
        </Panel>
      </div>
    </MainLayout>
  );
};

const ChangeScene: React.FC<{ time: number }> = ({ time }) => {
  const local = time - getScene("change").start;
  const chips = ["Deep Research", "Command panel", "Forking", "Inline actions", "Enterprise controls"];

  return (
    <MainLayout
      eyebrow="What changed"
      title="Release notes are inputs. Workflow impact is the output."
      subtitle="The product language is noisy. The useful translation is smaller."
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 60 }}>
        {chips.map((chip, index) => {
          const opacity = interpolate(local, [index * 0.28, index * 0.28 + 0.6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const y = interpolate(opacity, [0, 1], [26, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={chip}
              style={{
                opacity,
                transform: `translateY(${y}px)`,
                border: `1px solid ${palette.line}`,
                background:
                  index === 0
                    ? "rgba(59,214,198,0.15)"
                    : "rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: "24px 30px",
                fontSize: 32,
                fontWeight: 760,
              }}
            >
              {chip}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 70, display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 28 }}>
        <Panel>
          <Label>Product claim</Label>
          <p style={quoteStyle}>More agentic research inside Computer.</p>
        </Panel>
        <Panel>
          <Label>Workflow translation</Label>
          <p style={quoteStyle}>Can I get from sources to a brief with fewer copy-paste loops?</p>
        </Panel>
      </div>
    </MainLayout>
  );
};

const WorkflowScene: React.FC<{ time: number }> = ({ time }) => {
  const local = time - getScene("workflow").start;
  const before = ["Search", "Save sources", "Summarize", "Compare", "Write", "Review"];
  const after = ["Run research", "Fork thread", "Inline action", "Draft brief", "Review"];
  const reveal = interpolate(local, [1.2, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <MainLayout
      eyebrow="Workflow test"
      title="Market brief: before vs. after"
      subtitle="The win is not magic. The win is fewer handoffs before human review."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 48 }}>
        <WorkflowColumn title="Old flow" steps={before} color={palette.red} dim />
        <WorkflowColumn title="New promise" steps={after} color={palette.teal} reveal={reveal} />
      </div>
    </MainLayout>
  );
};

const VerdictScene: React.FC<{ time: number }> = ({ time }) => {
  const local = time - getScene("verdict").start;
  const scores = [
    { label: "Impact", value: 8, color: palette.teal },
    { label: "Maturity", value: 6, color: palette.blue },
    { label: "Cost", value: 5, color: palette.amber },
    { label: "Trust", value: 7, color: palette.green },
  ];

  return (
    <MainLayout
      eyebrow="Verdict"
      title="Use it for draft research. Do not outsource judgment."
      subtitle="The point is speed to structured material, not a final answer machine."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 56 }}>
        <Panel>
          <Label>Use / Wait / Skip</Label>
          <div
            style={{
              display: "inline-flex",
              marginTop: 18,
              padding: "22px 30px",
              borderRadius: 8,
              color: "#071011",
              backgroundColor: palette.teal,
              fontSize: 52,
              fontWeight: 850,
            }}
          >
            USE
          </div>
          <p style={{ ...bodyStyle, marginTop: 34, color: palette.text }}>
            For first-pass research briefs where sources still get reviewed before publishing.
          </p>
        </Panel>
        <Panel>
          <Label>Scorecard</Label>
          <div style={{ marginTop: 24, display: "grid", gap: 18 }}>
            {scores.map((score, index) => {
              const width = interpolate(local, [index * 0.35 + 0.8, index * 0.35 + 1.5], [0, score.value * 10], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              });
              return (
                <div key={score.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 25 }}>
                    <span>{score.label}</span>
                    <span>{score.value}/10</span>
                  </div>
                  <div
                    style={{
                      height: 14,
                      borderRadius: 999,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      overflow: "hidden",
                      marginTop: 8,
                    }}
                  >
                    <div
                      style={{
                        width: `${width}%`,
                        height: "100%",
                        backgroundColor: score.color,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </MainLayout>
  );
};

const NextScene: React.FC<{ time: number }> = ({ time }) => {
  const local = time - getScene("next").start;
  const pulse = interpolate(Math.sin(local * 4), [-1, 1], [0.55, 1]);
  return (
    <MainLayout
      eyebrow="Next experiment"
      title="Same brief. Same sources. Stopwatch on."
      subtitle="This is how Signal becomes content: release note in, workflow test out."
    >
      <Panel
        style={{
          marginTop: 60,
          display: "grid",
          gridTemplateColumns: "1fr 90px 1fr",
          alignItems: "center",
          gap: 26,
        }}
      >
        <ExperimentCard title="Perplexity Computer" lines={["agentic research", "source trail", "inline actions"]} />
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            backgroundColor: `rgba(59,214,198,${0.18 * pulse})`,
            border: `1px solid ${palette.teal}`,
            display: "grid",
            placeItems: "center",
            color: palette.teal,
            fontSize: 30,
            fontWeight: 820,
          }}
        >
          VS
        </div>
        <ExperimentCard title="Normal workflow" lines={["search", "documents", "manual synthesis"]} />
      </Panel>
      <div style={{ marginTop: 44, color: palette.muted, fontSize: 30 }}>
        Pilot format: one signal, one workflow, one verdict.
      </div>
    </MainLayout>
  );
};

const MainLayout: React.FC<{
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ eyebrow, title, subtitle, children }) => (
  <div style={{ position: "absolute", left: 160, right: 160, top: 170 }}>
    <div
      style={{
        color: palette.teal,
        fontSize: 28,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: 0,
        marginBottom: 18,
      }}
    >
      {eyebrow}
    </div>
    <h1
      style={{
        fontSize: 74,
        lineHeight: 1.02,
        margin: 0,
        maxWidth: 1360,
        fontWeight: 850,
      }}
    >
      {title}
    </h1>
    <p
      style={{
        color: palette.muted,
        fontSize: 32,
        lineHeight: 1.35,
        marginTop: 24,
        maxWidth: 1240,
      }}
    >
      {subtitle}
    </p>
    {children}
  </div>
);

const Panel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      minHeight: 250,
      padding: 34,
      borderRadius: 8,
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.045))",
      border: `1px solid ${palette.line}`,
      boxShadow: "0 22px 70px rgba(0,0,0,0.24)",
      ...style,
    }}
  >
    {children}
  </div>
);

const WorkflowColumn: React.FC<{
  title: string;
  steps: string[];
  color: string;
  reveal?: number;
  dim?: boolean;
}> = ({ title, steps, color, reveal = 1, dim = false }) => (
  <Panel style={{ minHeight: 320, opacity: dim ? 0.74 : 1, padding: 28 }}>
    <Label>{title}</Label>
    <div style={{ marginTop: 18, display: "grid", gap: 9 }}>
      {steps.map((step, index) => {
        const visible = Math.min(1, Math.max(0, reveal * steps.length - index));
        return (
          <div
            key={step}
            style={{
              opacity: visible,
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 25,
              color: palette.text,
              padding: "10px 14px",
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.055)",
              border: `1px solid ${palette.line}`,
            }}
          >
            <span
              style={{
                height: 11,
                width: 11,
                borderRadius: "50%",
                backgroundColor: color,
                flex: "0 0 auto",
              }}
            />
            {step}
          </div>
        );
      })}
    </div>
  </Panel>
);

const ExperimentCard: React.FC<{ title: string; lines: string[] }> = ({ title, lines }) => (
  <div>
    <div style={{ fontSize: 42, fontWeight: 830, marginBottom: 24 }}>{title}</div>
    <div style={{ display: "grid", gap: 12 }}>
      {lines.map((line) => (
        <div key={line} style={{ color: palette.muted, fontSize: 28 }}>
          {line}
        </div>
      ))}
    </div>
  </div>
);

const StatusLine: React.FC<{ label: string; value: string; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      gap: 24,
      padding: "14px 0",
      borderTop: `1px solid ${palette.line}`,
      fontSize: 25,
    }}
  >
    <span style={{ color: palette.muted }}>{label}</span>
    <span style={{ color, fontWeight: 760 }}>{value}</span>
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      color: palette.muted,
      fontSize: 22,
      fontWeight: 780,
      textTransform: "uppercase",
      letterSpacing: 0,
      marginBottom: 16,
    }}
  >
    {children}
  </div>
);

const Progress: React.FC<{ time: number }> = ({ time }) => {
  const progress = Math.min(1, time / SAMPLE_DURATION_SEC);
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        right: 64,
        bottom: 48,
        height: 8,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.10)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          borderRadius: 999,
          background: `linear-gradient(90deg, ${palette.teal}, ${palette.amber})`,
        }}
      />
    </div>
  );
};

const Caption: React.FC<{ time: number }> = ({ time }) => {
  const captions = [
    { start: 0, end: 8, text: "Signal flagged a Perplexity update this week." },
    { start: 8, end: 20, text: "Does this remove a step from a real workflow?" },
    { start: 20, end: 42, text: "Market brief: search, sources, synthesis, draft, review." },
    { start: 42, end: 57, text: "Use it for first-pass research. Review before publishing." },
    { start: 57, end: 68, text: "One signal, one workflow, one verdict." },
  ];
  const active = captions.find((caption) => time >= caption.start && time < caption.end);
  if (!active) return null;

  const opacity = sceneOpacity({ name: "signal", start: active.start, end: active.end }, time);
  return (
    <div
      style={{
        position: "absolute",
        left: 280,
        right: 280,
        bottom: 94,
        opacity,
        textAlign: "center",
        color: palette.text,
        fontSize: 34,
        lineHeight: 1.25,
        fontWeight: 700,
        textShadow: "0 2px 22px rgba(0,0,0,0.55)",
      }}
    >
      {active.text}
    </div>
  );
};

const h3Style: React.CSSProperties = {
  fontSize: 42,
  lineHeight: 1.1,
  margin: 0,
  fontWeight: 820,
};

const bodyStyle: React.CSSProperties = {
  color: palette.muted,
  fontSize: 27,
  lineHeight: 1.35,
  margin: 0,
};

const quoteStyle: React.CSSProperties = {
  color: palette.text,
  fontSize: 38,
  lineHeight: 1.18,
  margin: 0,
  fontWeight: 760,
};
