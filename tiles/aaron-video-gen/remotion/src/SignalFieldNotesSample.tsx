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

const DURATION_SEC = 50;
const AUDIO_FILE = "signal-field-notes-v2/narration.mp3";

type SceneKey = "signal" | "feature" | "workflow" | "verdict" | "next";

type FieldScene = {
  key: SceneKey;
  start: number;
  end: number;
  eyebrow: string;
  phrase: string;
  note: string;
  accent: string;
};

const colors = {
  ink: "#F7F3EA",
  paper: "#111317",
  paper2: "#171B20",
  muted: "#A9B1B9",
  teal: "#5BE0D1",
  amber: "#FFD166",
  green: "#9AE66E",
  line: "rgba(247,243,234,0.16)",
};

const scenes: FieldScene[] = [
  {
    key: "signal",
    start: 0,
    end: 8,
    eyebrow: "Signal field note",
    phrase: "Signal caught this",
    note: "Perplexity Deep Research is moving deeper into Computer.",
    accent: colors.teal,
  },
  {
    key: "feature",
    start: 8,
    end: 18,
    eyebrow: "Translation",
    phrase: "The feature name is not the point",
    note: "The only useful question: does it change the work?",
    accent: colors.amber,
  },
  {
    key: "workflow",
    start: 18,
    end: 34,
    eyebrow: "Workflow implication",
    phrase: "Less copy-paste",
    note: "Research briefs break when sources, summaries, and drafts live in five places.",
    accent: colors.teal,
  },
  {
    key: "verdict",
    start: 34,
    end: 44,
    eyebrow: "Verdict",
    phrase: "Use for drafts",
    note: "Do not use it as the final answer. Use it to reach structured material faster.",
    accent: colors.green,
  },
  {
    key: "next",
    start: 44,
    end: DURATION_SEC,
    eyebrow: "Next test",
    phrase: "Same brief. Same sources. Stopwatch on.",
    note: "One signal becomes one workflow test.",
    accent: colors.amber,
  },
];

export const SignalFieldNotesSample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.paper,
        color: colors.ink,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflow: "hidden",
      }}
    >
      <Audio src={staticFile(AUDIO_FILE)} />
      <FieldBackdrop time={time} />
      <Header time={time} />
      {scenes.map((scene) => (
        <SceneFrame key={scene.key} scene={scene} time={time} />
      ))}
      <BottomCaption time={time} />
      <Progress time={time} />
    </AbsoluteFill>
  );
};

export const signalFieldNotesSampleDurationFrames = (fps: number) =>
  Math.ceil(DURATION_SEC * fps);

const sceneOpacity = (scene: FieldScene, time: number) => {
  const fadeIn =
    scene.start === 0
      ? 1
      : interpolate(time, [scene.start, scene.start + 0.7], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
  const fadeOut = interpolate(time, [scene.end - 0.55, scene.end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  return Math.min(fadeIn, fadeOut);
};

const FieldBackdrop: React.FC<{ time: number }> = ({ time }) => {
  const drift = interpolate(Math.sin(time * 0.65), [-1, 1], [-16, 16]);
  const sweep = (time * 34) % 360;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 18% 22%, rgba(91,224,209,0.16), transparent 34%), radial-gradient(circle at 84% 78%, rgba(255,209,102,0.11), transparent 30%), linear-gradient(145deg, #111317 0%, #171B20 58%, #101216 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 96 + drift,
          top: 178,
          width: 530,
          height: 530,
          borderRadius: "50%",
          border: `1px solid ${colors.line}`,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 244 + drift,
          top: 326,
          width: 235,
          height: 235,
          borderRadius: "50%",
          border: `1px solid ${colors.line}`,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 360 + drift,
          top: 442,
          width: 210,
          height: 3,
          transformOrigin: "0 50%",
          transform: `rotate(${sweep}deg)`,
          background: `linear-gradient(90deg, ${colors.teal}, transparent)`,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(247,243,234,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(247,243,234,0.028) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.06))",
        }}
      />
    </AbsoluteFill>
  );
};

const Header: React.FC<{ time: number }> = ({ time }) => {
  const glow = interpolate(Math.sin(time * 3), [-1, 1], [0.35, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        top: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: colors.muted,
        fontSize: 24,
        letterSpacing: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: colors.teal,
            boxShadow: `0 0 ${18 * glow}px ${colors.teal}`,
          }}
        />
        <span style={{ color: colors.ink, fontWeight: 780 }}>Signal Field Notes</span>
      </div>
      <span>one signal / one workflow / one verdict</span>
    </div>
  );
};

const SceneFrame: React.FC<{ scene: FieldScene; time: number }> = ({
  scene,
  time,
}) => {
  const opacity = sceneOpacity(scene, time);
  const local = time - scene.start;
  const y = interpolate(opacity, [0, 1], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineWidth = interpolate(local, [0.25, 1.4], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 184,
          right: 184,
          top: 198,
          minHeight: 560,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: scene.accent,
            fontSize: 28,
            fontWeight: 820,
            textTransform: "uppercase",
            letterSpacing: 0,
            marginBottom: 28,
          }}
        >
          {scene.eyebrow}
        </div>
        <div
          style={{
            maxWidth: scene.key === "next" ? 1260 : 1120,
            fontSize: scene.key === "feature" || scene.key === "next" ? 86 : 106,
            lineHeight: 1.02,
            fontWeight: 860,
            letterSpacing: 0,
          }}
        >
          {scene.phrase}
        </div>
        <div
          style={{
            marginTop: 36,
            width: `${lineWidth}%`,
            maxWidth: 420,
            height: 6,
            borderRadius: 999,
            backgroundColor: scene.accent,
          }}
        />
        <p
          style={{
            maxWidth: 900,
            marginTop: 36,
            marginBottom: 0,
            color: colors.muted,
            fontSize: 34,
            lineHeight: 1.35,
            fontWeight: 560,
          }}
        >
          {scene.note}
        </p>
      </div>
      {scene.key === "workflow" && <WorkflowGlyph time={local} />}
      {scene.key === "verdict" && <VerdictBadge time={local} />}
    </AbsoluteFill>
  );
};

const WorkflowGlyph: React.FC<{ time: number }> = ({ time }) => {
  const dots = ["sources", "summary", "draft"];
  return (
    <div
      style={{
        position: "absolute",
        right: 180,
        top: 392,
        display: "flex",
        alignItems: "center",
        gap: 18,
      }}
    >
      {dots.map((dot, index) => {
        const opacity = interpolate(time, [index * 0.4 + 0.7, index * 0.4 + 1.2], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <React.Fragment key={dot}>
            <div
              style={{
                opacity,
                width: 152,
                height: 152,
                borderRadius: "50%",
                border: `1px solid ${colors.line}`,
                background: "rgba(247,243,234,0.06)",
                display: "grid",
                placeItems: "center",
                color: colors.ink,
                fontSize: 23,
                fontWeight: 750,
              }}
            >
              {dot}
            </div>
            {index < dots.length - 1 && (
              <div
                style={{
                  opacity,
                  width: 42,
                  height: 2,
                  backgroundColor: colors.line,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const VerdictBadge: React.FC<{ time: number }> = ({ time }) => {
  const scale = interpolate(time, [0.4, 1.2], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
      style={{
        position: "absolute",
        right: 220,
        top: 380,
        width: 240,
        height: 240,
        borderRadius: "50%",
        backgroundColor: colors.green,
        color: "#111317",
        display: "grid",
        placeItems: "center",
        fontSize: 62,
        fontWeight: 900,
        transform: `scale(${scale})`,
        boxShadow: "0 26px 90px rgba(154,230,110,0.18)",
      }}
    >
      USE
    </div>
  );
};

const BottomCaption: React.FC<{ time: number }> = ({ time }) => {
  const captions = [
    { start: 0, end: 8, text: "Signal caught a Perplexity update this week." },
    { start: 8, end: 18, text: "I care whether it changes the work." },
    { start: 18, end: 34, text: "The annoying part is moving sources, summaries, and drafts." },
    { start: 34, end: 44, text: "Use this for first drafts, not final answers." },
    { start: 44, end: DURATION_SEC, text: "That is how Signal becomes a workflow test." },
  ];
  const active = captions.find((caption) => time >= caption.start && time < caption.end);
  if (!active) return null;

  const opacity = interpolate(time, [active.start, active.start + 0.5, active.end - 0.4, active.end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 320,
        right: 320,
        bottom: 100,
        opacity,
        color: colors.ink,
        fontSize: 32,
        lineHeight: 1.25,
        textAlign: "center",
        fontWeight: 720,
        textShadow: "0 3px 28px rgba(0,0,0,0.6)",
      }}
    >
      {active.text}
    </div>
  );
};

const Progress: React.FC<{ time: number }> = ({ time }) => {
  const progress = Math.min(1, time / DURATION_SEC);
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        bottom: 48,
        height: 6,
        borderRadius: 999,
        backgroundColor: "rgba(247,243,234,0.10)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${colors.teal}, ${colors.amber})`,
          borderRadius: 999,
        }}
      />
    </div>
  );
};
