import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { buildCaptionSegments } from "./components/WordCaption";
import { fdeFullWordTimingsV5 } from "./data/fdeFullWordTimingsV5";
import {
  FDE_FULL_FILM_DURATION_SEC,
  FDE_FULL_FILM_FPS,
} from "./FdeFullFilmV1";

/**
 * A private, full-length FDE study that applies the Guizang presentation
 * discipline to a Remotion film. The layouts are intentionally finite:
 * they provide stable geometry for the story instead of inventing a new
 * dashboard at every beat.
 */
export const GUIZANG_HYBRID_FULL_FPS = FDE_FULL_FILM_FPS;
export const GUIZANG_HYBRID_FULL_DURATION_SEC = FDE_FULL_FILM_DURATION_SEC;

export const guizangHybridFullDurationFrames = (
  fps = GUIZANG_HYBRID_FULL_FPS,
): number => Math.ceil(GUIZANG_HYBRID_FULL_DURATION_SEC * fps);

const narrationOffsetSec = 2.5;
const speed = 1.04;

const retime = (time: number): number =>
  time <= narrationOffsetSec
    ? time
    : narrationOffsetSec + (time - narrationOffsetSec) / speed;

const chapters = {
  signal: { start: 0, end: retime(32.267982), label: "Signal", number: "01" },
  system: {
    start: retime(32.267982),
    end: retime(82.887483),
    label: "System",
    number: "02",
  },
  decision: {
    start: retime(82.887483),
    end: retime(136.246939),
    label: "Decision",
    number: "03",
  },
  learning: {
    start: retime(136.246939),
    end: retime(188.770476),
    label: "Learning",
    number: "04",
  },
  practice: {
    start: retime(188.770476),
    end: retime(257.501542),
    label: "Practice",
    number: "05",
  },
  model: {
    start: retime(257.501542),
    end: retime(309.421361),
    label: "Model",
    number: "06",
  },
  ownership: {
    start: retime(309.421361),
    end: retime(356.279229),
    label: "Ownership",
    number: "07",
  },
  framework: {
    start: retime(356.279229),
    end: retime(424.545896),
    label: "Framework",
    number: "08",
  },
  outcome: {
    start: retime(424.545896),
    end: GUIZANG_HYBRID_FULL_DURATION_SEC,
    label: "Outcome",
    number: "09",
  },
} as const;

const palette = {
  paper: "#F5F0E7",
  paperSoft: "#EEE7DC",
  ink: "#1B1916",
  inkSoft: "#29251F",
  muted: "#716B62",
  rule: "#D7CFC2",
  cyan: "#157A8A",
  coral: "#C65C48",
  amber: "#D08A24",
  olive: "#78843E",
  inverseText: "#F5F0E7",
  inverseMuted: "#C9C0B3",
};

const ease = Easing.bezier(0.23, 1, 0.32, 1);
const easeInOut = Easing.bezier(0.77, 0, 0.175, 1);

const ramp = (
  value: number,
  start: number,
  end: number,
  from = 0,
  to = 1,
  easing = ease,
): number =>
  interpolate(value, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

const reveal = (local: number, start: number, duration = 0.5): number =>
  ramp(local, start, start + duration);

const inRange = (time: number, start: number, end: number): boolean =>
  time >= start && time < end;

const formatTime = (time: number): string => {
  const seconds = Math.max(0, Math.floor(time));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60,
  ).padStart(2, "0")}`;
};

const PaperField: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <AbsoluteFill
    style={{ backgroundColor: dark ? palette.ink : palette.paper, overflow: "hidden" }}
  >
    <AbsoluteFill
      style={{
        opacity: dark ? 0.13 : 0.4,
        backgroundImage: dark
          ? "linear-gradient(90deg, rgba(245,240,231,0.16) 1px, transparent 1px), linear-gradient(rgba(245,240,231,0.16) 1px, transparent 1px)"
          : `linear-gradient(90deg, transparent 0, transparent 49.95%, ${palette.rule} 50%, transparent 50.05%), linear-gradient(${palette.rule} 1px, transparent 1px)`,
        backgroundSize: dark ? "144px 144px" : "160px 100%, 100% 132px",
      }}
    />
  </AbsoluteFill>
);

const Header: React.FC<{
  chapter: { label: string; number: string };
  time: number;
  dark?: boolean;
}> = ({ chapter, time, dark = false }) => {
  const foreground = dark ? palette.inverseText : palette.ink;
  const muted = dark ? palette.inverseMuted : palette.muted;

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 120,
          right: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 20,
          fontFamily: "SFMono-Regular, Menlo, monospace",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ display: "block", width: 8, height: 8, backgroundColor: palette.coral }} />
          <span style={{ color: foreground }}>Aaron Guo</span>
          <span style={{ color: muted }}>/ FDE field study</span>
        </div>
        <div style={{ color: muted }}>
          {chapter.number} / {chapter.label} / {formatTime(time)}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 91,
          left: 120,
          right: 120,
          height: 1,
          backgroundColor: dark ? "rgba(245,240,231,0.22)" : palette.rule,
          zIndex: 20,
        }}
      />
    </>
  );
};

const Kicker: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = palette.cyan,
}) => (
  <div
    style={{
      color,
      fontFamily: "SFMono-Regular, Menlo, monospace",
      fontSize: 16,
      fontWeight: 700,
      letterSpacing: 2.1,
      lineHeight: 1.2,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const Title: React.FC<{
  children: React.ReactNode;
  dark?: boolean;
  width?: number;
  size?: number;
}> = ({ children, dark = false, width = 1380, size = 76 }) => (
  <div
    style={{
      width,
      marginTop: 19,
      color: dark ? palette.inverseText : palette.ink,
      fontFamily: "Georgia, Times New Roman, serif",
      fontSize: size,
      fontWeight: 700,
      letterSpacing: 0,
      lineHeight: 0.98,
    }}
  >
    {children}
  </div>
);

const Note: React.FC<{ children: React.ReactNode; dark?: boolean; width?: number }> = ({
  children,
  dark = false,
  width = 480,
}) => (
  <div
    style={{
      color: dark ? palette.inverseMuted : palette.muted,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 23,
      fontWeight: 500,
      lineHeight: 1.32,
      width,
    }}
  >
    {children}
  </div>
);

const Surface: React.FC<{
  children: React.ReactNode;
  dark?: boolean;
  accent?: string;
  style?: React.CSSProperties;
}> = ({ children, dark = false, accent, style }) => (
  <div
    style={{
      boxSizing: "border-box",
      backgroundColor: dark ? "rgba(245,240,231,0.06)" : "rgba(255,255,255,0.55)",
      border: `1px solid ${dark ? "rgba(245,240,231,0.25)" : palette.rule}`,
      borderTop: accent ? `8px solid ${accent}` : undefined,
      boxShadow: dark ? "none" : "0 14px 30px rgba(27,25,22,0.08)",
      ...style,
    }}
  >
    {children}
  </div>
);

const Caption: React.FC<{ time: number }> = ({ time }) => {
  const active = React.useMemo(
    () => buildCaptionSegments(fdeFullWordTimingsV5, 8),
    [],
  ).find((segment) => time >= segment.start - 0.08 && time <= segment.end + 0.34);

  if (!active) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 380,
        right: 380,
        bottom: 38,
        minHeight: 62,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 26px",
        boxSizing: "border-box",
        backgroundColor: "rgba(27,25,22,0.9)",
        color: palette.paper,
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 27,
        fontWeight: 600,
        lineHeight: 1.26,
        textAlign: "center",
        zIndex: 120,
      }}
    >
      {active.text}
    </div>
  );
};

const Cover: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const settle = reveal(frame / fps, 0, 2.6);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile("fde-v5/cover-hero.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${1.035 - settle * 0.035})`,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(245,240,231,0.08)" }} />
      <div
        style={{
          position: "absolute",
          top: 54,
          left: 90,
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: palette.ink,
          fontFamily: "SFMono-Regular, Menlo, monospace",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: 1.9,
          textTransform: "uppercase",
        }}
      >
        <span style={{ display: "block", width: 8, height: 8, backgroundColor: palette.coral }} />
        Aaron Guo / Field Note 01
      </div>
      <div
        style={{
          position: "absolute",
          left: 100,
          bottom: 102,
          width: 790,
          color: palette.ink,
        }}
      >
        <Kicker color={palette.coral}>Enterprise AI / FDE</Kicker>
        <div
          style={{
            marginTop: 20,
            fontFamily: "Georgia, Times New Roman, serif",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 0.94,
          }}
        >
          Expensive Tokens Won&apos;t Save Enterprise AI
        </div>
        <div
          style={{
            marginTop: 24,
            color: palette.muted,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 26,
            fontWeight: 550,
            lineHeight: 1.28,
          }}
        >
          Why forward deployed engineering is becoming an operating discipline.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SignalLedger: React.FC<{ local: number; time: number }> = ({ local, time }) => {
  const question = reveal(local, 17.6, 0.7);
  const rows = [
    ["Anthropic", "Enterprise services company", palette.coral],
    ["OpenAI", "Deployment capacity", palette.cyan],
    ["AWS", "Agentic delivery teams", palette.amber],
    ["Microsoft", "AI transformation delivery", palette.olive],
  ];

  return (
    <AbsoluteFill>
      <PaperField />
      <Header chapter={chapters.signal} time={time} />
      <div style={{ position: "absolute", top: 154, left: 120, right: 120 }}>
        <Kicker>Four announcements. One underlying move.</Kicker>
        <Title width={1280}>Engineers are moving closer to customer operations.</Title>
        <div style={{ position: "absolute", right: 0, top: 49 }}>
          <Note width={390}>The shared signal is not another benchmark. It is deployment capacity.</Note>
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 426 }}>
        {rows.map(([name, detail, color], index) => {
          const row = reveal(local, 0.35 + index * 0.45, 0.48);
          return (
            <div
              key={name}
              style={{
                display: "grid",
                gridTemplateColumns: "290px 1fr 148px",
                alignItems: "center",
                minHeight: 91,
                borderTop: `1px solid ${palette.rule}`,
                opacity: row,
                transform: `translateY(${(1 - row) * 18}px)`,
              }}
            >
              <div style={{ color: palette.ink, fontFamily: "Georgia, Times New Roman, serif", fontSize: 34, fontWeight: 700 }}>
                {name}
              </div>
              <div style={{ color: palette.muted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 22 }}>
                {detail}
              </div>
              <div style={{ justifySelf: "end", width: 120, height: 6, backgroundColor: color }} />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          bottom: 156,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          opacity: question,
          transform: `translateY(${(1 - question) * 20}px)`,
        }}
      >
        <div style={{ color: palette.ink, fontFamily: "Georgia, Times New Roman, serif", fontSize: 67, lineHeight: 0.98, fontWeight: 700 }}>
          If models were the whole problem,<br />why spend billions on people?
        </div>
        <div style={{ color: palette.coral, fontFamily: "SFMono-Regular, Menlo, monospace", fontSize: 17, fontWeight: 700, letterSpacing: 1.8, textTransform: "uppercase" }}>
          The delivery gap
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SystemChapter: React.FC<{ local: number; time: number }> = ({ local, time }) => {
  const operatingPhase = local >= 17.6;
  const turn = reveal(local, 19.1, 0.8);
  const items = ["Data", "Permissions", "Approvals", "Exceptions", "Recovery"];

  return (
    <AbsoluteFill>
      <PaperField />
      <Header chapter={chapters.system} time={time} />
      {!operatingPhase ? (
        <>
          <div style={{ position: "absolute", top: 154, left: 120, right: 120 }}>
            <Kicker color={palette.coral}>A scale signal, not a single accounting category</Kicker>
            <Title width={1160}>The numbers are not a clean comparison.</Title>
            <div style={{ position: "absolute", top: 48, right: 0 }}>
              <Note width={450}>But the strategic direction is clear: model companies are building deployment capacity.</Note>
            </div>
          </div>
          <Surface accent={palette.coral} style={{ position: "absolute", left: 120, top: 420, width: 610, height: 326, padding: "38px 42px" }}>
            <Kicker color={palette.coral}>Combined signal</Kicker>
            <div style={{ marginTop: 30, fontFamily: "Georgia, Times New Roman, serif", fontSize: 126, lineHeight: 0.8, fontWeight: 700 }}>$7.5B+</div>
            <div style={{ marginTop: 24, color: palette.cyan, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 26, fontWeight: 700 }}>Scale signal, not a comparable spending total.</div>
          </Surface>
          <div style={{ position: "absolute", left: 820, right: 120, top: 420, display: "grid", gap: 18 }}>
            {[
              ["OpenAI", "Investment in a new company", palette.coral],
              ["AWS", "Organizational commitment", palette.cyan],
              ["Microsoft", "Organizational commitment", palette.olive],
            ].map(([company, note, color], index) => {
              const item = reveal(local, 1.1 + index * 0.5, 0.45);
              return (
                <Surface key={company} style={{ height: 86, padding: "0 28px", display: "flex", alignItems: "center", gap: 34, opacity: item, transform: `translateX(${(1 - item) * 24}px)` }}>
                  <span style={{ width: 5, height: 44, backgroundColor: color, flexShrink: 0 }} />
                  <span style={{ width: 170, fontFamily: "Georgia, Times New Roman, serif", fontSize: 31, fontWeight: 700 }}>{company}</span>
                  <span style={{ color: palette.muted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 22 }}>{note}</span>
                </Surface>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div style={{ position: "absolute", top: 154, left: 120, right: 120 }}>
            <Kicker>Capability is not a working system</Kicker>
            <Title width={1440}>The operating work lives behind the model surface.</Title>
          </div>
          <div style={{ position: "absolute", top: 430, left: 120, width: 340, height: 314 }}>
            <Surface
              accent={palette.amber}
              style={{
                width: "100%",
                height: "100%",
                padding: "32px 34px",
                // A bounded plane reveal: it can suggest the model surface moving
                // aside without ever escaping into the title's protected zone.
                transform: `translateX(${turn * 58}px) scaleX(${1 - turn * 0.14})`,
                transformOrigin: "left center",
                boxShadow: "0 22px 42px rgba(27,25,22,0.15)",
              }}
            >
              <Kicker color={palette.amber}>Surface</Kicker>
              <div style={{ marginTop: 64, fontFamily: "Georgia, Times New Roman, serif", fontSize: 64, fontWeight: 700, lineHeight: 0.92 }}>Model</div>
              <div style={{ marginTop: 20, color: palette.muted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 21, lineHeight: 1.3 }}>Useful intelligence, visible in a demo.</div>
            </Surface>
          </div>
          <Surface accent={palette.cyan} style={{ position: "absolute", left: 620, right: 120, top: 410, minHeight: 360, padding: "33px 42px" }}>
            <Kicker>Operating layer</Kicker>
            <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 50, rowGap: 0 }}>
              {items.map((item, index) => {
                const itemReveal = reveal(local, 20 + index * 0.32, 0.42);
                return (
                  <div key={item} style={{ borderTop: `1px solid ${palette.rule}`, padding: "20px 0", opacity: itemReveal, transform: `translateY(${(1 - itemReveal) * 12}px)` }}>
                    <span style={{ color: palette.cyan, fontFamily: "SFMono-Regular, Menlo, monospace", fontSize: 15, fontWeight: 700, letterSpacing: 1.6 }}>0{index + 1}</span>
                    <span style={{ marginLeft: 18, color: palette.ink, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 28, fontWeight: 700 }}>{item}</span>
                  </div>
                );
              })}
            </div>
          </Surface>
          <div style={{ position: "absolute", bottom: 154, left: 120, color: palette.coral, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 29, fontWeight: 700 }}>
            FDE closes the distance between intelligence and operations.
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

const OperatorStrip: React.FC<{ local: number }> = ({ local }) => {
  const clipIndex = Math.min(3, Math.floor(local / 3));
  const frames = ["frame-07.jpg", "frame-17.jpg", "frame-28.jpg", "frame-38.jpg"];
  return (
    <Surface style={{ position: "absolute", top: 398, right: 120, width: 690, height: 365, overflow: "hidden" }}>
      <Img src={staticFile(`fde-v5/operators-frames/${frames[Math.max(0, clipIndex)]}`)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.8) contrast(1.02)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "18px 24px", backgroundColor: "rgba(27,25,22,0.78)", color: palette.paper, fontFamily: "SFMono-Regular, Menlo, monospace", fontSize: 15, fontWeight: 700, letterSpacing: 1.8, textTransform: "uppercase" }}>
        Operator context / illustrative
      </div>
    </Surface>
  );
};

const DecisionNode: React.FC<{ label: string; order: number; local: number; accent: string }> = ({ label, order, local, accent }) => {
  const node = reveal(local, 19 + order * 0.44, 0.4);
  return (
    <Surface accent={accent} style={{ height: 136, padding: "24px 25px", opacity: node, transform: `translateY(${(1 - node) * 18}px)` }}>
      <div style={{ color: accent, fontFamily: "SFMono-Regular, Menlo, monospace", fontSize: 14, fontWeight: 700, letterSpacing: 1.7 }}>0{order + 1}</div>
      <div style={{ marginTop: 20, color: palette.ink, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 27, fontWeight: 700, lineHeight: 1.08 }}>{label}</div>
    </Surface>
  );
};

const DecisionChapter: React.FC<{ local: number; time: number }> = ({ local, time }) => {
  const decision = local >= 17.2;
  const path = reveal(local, 21.2, 1.05);
  const nodes = [
    ["Orders at risk", palette.coral],
    ["Planner options", palette.amber],
    ["Approval authority", palette.cyan],
    ["Committed action", palette.olive],
  ];
  return (
    <AbsoluteFill>
      <PaperField />
      <Header chapter={chapters.decision} time={time} />
      {!decision ? (
        <>
          <div style={{ position: "absolute", top: 154, left: 120, right: 120 }}>
            <Kicker color={palette.coral}>Inside the factory</Kicker>
            <Title width={900}>A chatbot is not the useful question.</Title>
            <div style={{ position: "absolute", top: 52, right: 0 }}><Note width={460}>Supplier data, production capacity, customer orders, and approval knowledge rarely live in one place.</Note></div>
          </div>
          <div style={{ position: "absolute", top: 430, left: 120, width: 650, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {["Supplier data", "Production capacity", "Customer orders", "Approval knowledge"].map((label, index) => {
              const item = reveal(local, 0.4 + index * 0.35, 0.42);
              return <Surface key={label} accent={[palette.coral, palette.amber, palette.cyan, palette.olive][index]} style={{ height: 114, padding: "24px", opacity: item, transform: `translateX(${(1 - item) * 18}px)` }}><div style={{ color: palette.ink, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 24, fontWeight: 700, lineHeight: 1.15 }}>{label}</div><div style={{ marginTop: 11, color: palette.muted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 17 }}>Separate source of truth</div></Surface>;
            })}
          </div>
          <OperatorStrip local={local} />
          <div style={{ position: "absolute", left: 120, bottom: 154, color: palette.ink, fontFamily: "Georgia, Times New Roman, serif", fontSize: 51, fontWeight: 700, lineHeight: 0.98 }}>Which orders are at risk, and who may approve the change?</div>
        </>
      ) : (
        <>
          <div style={{ position: "absolute", top: 154, left: 120, right: 120 }}>
            <Kicker>Deployment work begins with a real decision</Kicker>
            <Title width={1440}>Connect the data. Define the action. Govern the change.</Title>
          </div>
          <div style={{ position: "absolute", top: 466, left: 120, right: 120, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 26 }}>
            {nodes.map(([label, accent], index) => <DecisionNode key={label} label={label} accent={accent} order={index} local={local} />)}
          </div>
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <path d="M 330 680 H 1590" fill="none" stroke={palette.cyan} strokeWidth="5" strokeDasharray="1260" strokeDashoffset={1260 * (1 - path)} opacity={path > 0 ? 1 : 0} />
          </svg>
          <div style={{ position: "absolute", left: 120, bottom: 154, color: palette.muted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 26, opacity: path }}>Permissions, approvals, exceptions, and recovery are part of the action, not an afterthought.</div>
        </>
      )}
    </AbsoluteFill>
  );
};

const LearningChapter: React.FC<{ local: number; time: number }> = ({ local, time }) => {
  const loop = local >= 13.2;
  const line = reveal(local, 18.4, 1.15);
  const cards = [
    ["Field failure", "The exception appears in real work.", palette.coral],
    ["Local fix", "The team unblocks the current operation.", palette.amber],
    ["Repeat pattern", "Someone asks if it will happen again.", palette.cyan],
    ["Product primitive", "The next deployment begins better.", palette.olive],
  ];
  return (
    <AbsoluteFill>
      <PaperField dark />
      <Header chapter={chapters.learning} time={time} dark />
      {!loop ? (
        <div style={{ position: "absolute", top: 214, left: 180, right: 180, textAlign: "center" }}>
          <Kicker color={palette.amber}>Palantir calls it human backpropagation</Kicker>
          <Title dark width={1560} size={92}>The phrase sounds academic.<br />The work is practical.</Title>
          <div style={{ margin: "46px auto 0", width: 980, color: palette.inverseMuted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 30, lineHeight: 1.36 }}>An operator finds an exception. The engineer fixes the local system, then asks whether the lesson belongs in the product.</div>
        </div>
      ) : (
        <>
          <div style={{ position: "absolute", top: 154, left: 120, right: 120 }}>
            <Kicker color={palette.amber}>How field work compounds</Kicker>
            <Title dark width={1440}>The correction has to travel back to the product.</Title>
          </div>
          <div style={{ position: "absolute", top: 454, left: 120, right: 120, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {cards.map(([label, note, accent], index) => {
              const card = reveal(local, 14 + index * 0.42, 0.45);
              return <Surface key={label} dark accent={accent} style={{ height: 218, padding: "26px", opacity: card, transform: `translateY(${(1 - card) * 20}px)` }}><div style={{ color: accent, fontFamily: "SFMono-Regular, Menlo, monospace", fontSize: 14, fontWeight: 700, letterSpacing: 1.7 }}>0{index + 1}</div><div style={{ marginTop: 22, color: palette.inverseText, fontFamily: "Georgia, Times New Roman, serif", fontSize: 37, lineHeight: 0.98, fontWeight: 700 }}>{label}</div><div style={{ marginTop: 16, color: palette.inverseMuted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 19, lineHeight: 1.25 }}>{note}</div></Surface>;
            })}
          </div>
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
            <path d="M 1560 722 C 1450 895, 470 895, 360 722" fill="none" stroke={palette.cyan} strokeWidth="5" strokeDasharray="1500" strokeDashoffset={1500 * (1 - line)} opacity={line > 0 ? 1 : 0} />
          </svg>
          <div style={{ position: "absolute", left: 120, right: 120, bottom: 154, color: palette.inverseText, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 27, fontWeight: 700, opacity: line, textAlign: "center" }}>The next deployment starts with a better connector, rule, evaluation, or workflow primitive.</div>
        </>
      )}
    </AbsoluteFill>
  );
};

const WorkflowChapter: React.FC<{ local: number; time: number }> = ({ local, time }) => {
  const gates = local >= 28;
  const gateItems = [
    ["Evidence", "Challenge the claim", palette.coral],
    ["Argument", "Reject weak logic", palette.amber],
    ["Language", "Read it again", palette.cyan],
    ["Visual", "Compare directions", palette.olive],
    ["Package", "Validate the whole", palette.coral],
  ];
  const stages = ["Research", "Outline", "Write", "Translate", "Images", "Audio", "Video", "Publish"];
  return (
    <AbsoluteFill>
      <PaperField />
      <Header chapter={chapters.practice} time={time} />
      {!gates ? (
        <>
          <div style={{ position: "absolute", top: 154, left: 120, right: 120 }}>
            <Kicker color={palette.coral}>A smaller version of the same pattern</Kicker>
            <Title width={1220} size={58}>Five minutes can generate a draft.<br />It cannot generate a production system.</Title>
            <div style={{ position: "absolute", right: 0, top: 54 }}><Note width={420}>A complete workflow is a maintained system of research, judgment, production, and review.</Note></div>
          </div>
          <Surface style={{ position: "absolute", top: 440, left: 120, width: 680, height: 320, overflow: "hidden" }}>
            <Img src={staticFile("fde-v5/personal-workflow.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "18px 22px", backgroundColor: "rgba(245,240,231,0.92)", color: palette.ink, fontFamily: "SFMono-Regular, Menlo, monospace", fontSize: 14, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase" }}>Aaron&apos;s publishing workflow / field-scale example</div>
          </Surface>
          <div style={{ position: "absolute", top: 440, left: 860, right: 120 }}>
            <Kicker>First version</Kicker>
            <div style={{ marginTop: 29, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {["Research", "Outline", "Writing", "Translation", "Images", "Audio", "Video", "Publishing"].map((label, index) => {
                const item = reveal(local, 0.5 + index * 0.24, 0.36);
                return <Surface key={label} accent={[palette.coral, palette.amber, palette.cyan, palette.olive][index % 4]} style={{ height: 74, padding: "0 20px", display: "flex", alignItems: "center", opacity: item, transform: `translateX(${(1 - item) * 16}px)` }}><span style={{ color: palette.ink, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 21, fontWeight: 700 }}>{label}</span></Surface>;
              })}
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 154, left: 120, color: palette.muted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 26 }}>Without review, weak evidence, awkward language, and broken links can travel all the way to the end.</div>
        </>
      ) : (
        <>
          <div style={{ position: "absolute", top: 154, left: 120, right: 120 }}>
            <Kicker>Participation becomes infrastructure</Kicker>
            <Title width={1250}>Judgment turns into gates, rules, and validators.</Title>
          </div>
          <div style={{ position: "absolute", top: 425, left: 120, right: 120, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18 }}>
            {gateItems.map(([label, note, accent], index) => {
              const card = reveal(local, 28.4 + index * 0.34, 0.42);
              return <Surface key={label} accent={accent} style={{ height: 230, padding: "26px", opacity: card, transform: `translateY(${(1 - card) * 18}px)` }}><div style={{ color: accent, fontFamily: "SFMono-Regular, Menlo, monospace", fontSize: 14, fontWeight: 700, letterSpacing: 1.6 }}>GATE 0{index + 1}</div><div style={{ marginTop: 28, color: palette.ink, fontFamily: "Georgia, Times New Roman, serif", fontSize: 39, lineHeight: 0.98, fontWeight: 700 }}>{label}</div><div style={{ marginTop: 18, color: palette.muted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 19, lineHeight: 1.24 }}>{note}</div></Surface>;
            })}
          </div>
          <div style={{ position: "absolute", left: 120, right: 120, top: 747, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 10 }}>
            {stages.map((label, index) => {
              const item = reveal(local, 30.3 + index * 0.2, 0.28);
              return <div key={label} style={{ borderTop: `2px solid ${palette.rule}`, paddingTop: 14, color: palette.muted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 17, fontWeight: 700, opacity: item }}><span style={{ display: "block", color: palette.cyan, fontFamily: "SFMono-Regular, Menlo, monospace", fontSize: 12, letterSpacing: 1.2 }}>0{index + 1}</span><span style={{ display: "block", marginTop: 8 }}>{label}</span></div>;
            })}
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

const ComparisonChapter: React.FC<{ local: number; time: number }> = ({ local, time }) => {
  const comparison = local >= 14.5;
  const line = reveal(local, 20.6, 0.9);
  return (
    <AbsoluteFill>
      <PaperField dark={comparison} />
      <Header chapter={chapters.model} time={time} dark={comparison} />
      {!comparison ? (
        <div style={{ position: "absolute", left: 180, right: 180, top: 272, textAlign: "center" }}>
          <Kicker color={palette.coral}>A fair objection</Kicker>
          <Title width={1560} size={92}>Do not simply equate FDE with consulting.</Title>
          <div style={{ margin: "42px auto 0", width: 970, color: palette.muted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 30, lineHeight: 1.36 }}>Consultants and systems integrators already do essential work: workflows, regulation, organizational change, and implementation at scale.</div>
        </div>
      ) : (
        <>
          <div style={{ position: "absolute", top: 154, left: 120, right: 120 }}>
            <Kicker color={palette.amber}>The useful distinction</Kicker>
            <Title dark width={1460}>What compounds after the engagement?</Title>
          </div>
          <div style={{ position: "absolute", left: 120, top: 440, width: 720 }}>
            <Kicker color={palette.inverseMuted}>Recommendation path</Kicker>
            <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 28 }}>
              <Surface dark accent={palette.coral} style={{ width: 276, height: 132, padding: "28px" }}><div style={{ color: palette.inverseText, fontFamily: "Georgia, Times New Roman, serif", fontSize: 33, fontWeight: 700, lineHeight: 0.96 }}>Custom code</div></Surface>
              <div style={{ width: 86, height: 3, backgroundColor: palette.coral }} />
              <Surface dark accent={palette.coral} style={{ width: 230, height: 132, padding: "28px" }}><div style={{ color: palette.inverseText, fontFamily: "Georgia, Times New Roman, serif", fontSize: 33, fontWeight: 700, lineHeight: 0.96 }}>Handoff</div></Surface>
            </div>
            <div style={{ marginTop: 30, color: palette.inverseMuted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 22, lineHeight: 1.32 }}>Useful work can still end as a project artifact or deeper dependence.</div>
          </div>
          <div style={{ position: "absolute", top: 395, left: 970, right: 120, borderLeft: "1px solid rgba(245,240,231,0.28)", paddingLeft: 76 }}>
            <Kicker>Production and product learning</Kicker>
            <div style={{ marginTop: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {["Production", "Field learning", "Product"].map((label, index) => {
                const node = reveal(local, 16 + index * 0.42, 0.36);
                return <Surface key={label} dark accent={palette.cyan} style={{ width: index === 1 ? 236 : 200, height: 106, padding: "20px", opacity: node, transform: `translateY(${(1 - node) * 14}px)` }}><div style={{ color: palette.inverseText, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 23, fontWeight: 700, lineHeight: 1.06 }}>{label}</div></Surface>;
              })}
            </div>
            <svg width="830" height="250" viewBox="0 0 830 250" style={{ marginTop: -8, overflow: "visible" }}>
              <path d="M 110 70 C 220 220, 610 220, 720 70" fill="none" stroke={palette.cyan} strokeWidth="5" strokeDasharray="780" strokeDashoffset={780 * (1 - line)} opacity={line > 0 ? 1 : 0} />
            </svg>
            <div style={{ marginTop: -72, color: palette.cyan, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 25, fontWeight: 700, opacity: line }}>The lesson compounds into reusable capability.</div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

const OwnershipChapter: React.FC<{ local: number; time: number }> = ({ local, time }) => {
  const library = local >= 18.4;
  const assets = ["Data contracts", "Evaluation sets", "Permission rules", "Audit history", "Runbooks", "Failure modes", "Model interface"];
  return (
    <AbsoluteFill>
      <PaperField />
      <Header chapter={chapters.ownership} time={time} />
      {!library ? (
        <>
          <div style={{ position: "absolute", top: 154, left: 120, right: 120 }}>
            <Kicker color={palette.coral}>A deployment can work and still fail strategically</Kicker>
            <Title width={980}>Success can hide lock-in.</Title>
            <div style={{ position: "absolute", right: 0, top: 50 }}><Note width={470}>A critical workflow may become useful and integrated while the customer&apos;s ability to change it gets weaker.</Note></div>
          </div>
          <Surface accent={palette.coral} style={{ position: "absolute", left: 120, top: 415, width: 720, height: 350, overflow: "hidden" }}>
            <Img src={staticFile("fde-v5/token-to-owned-workflow.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Surface>
          <div style={{ position: "absolute", left: 930, top: 435, width: 740 }}>
            <Kicker color={palette.coral}>Vendor boundary</Kicker>
            <div style={{ marginTop: 24, color: palette.ink, fontFamily: "Georgia, Times New Roman, serif", fontSize: 52, lineHeight: 0.98, fontWeight: 700 }}>The provider can be capable without owning the operating system.</div>
            <div style={{ marginTop: 30, color: palette.muted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 25, lineHeight: 1.36 }}>Connectors, evaluations, permission models, and agent runtime should not turn into a black box the customer cannot understand or amend.</div>
          </div>
        </>
      ) : (
        <>
          <div style={{ position: "absolute", top: 154, left: 120, right: 120 }}>
            <Kicker>The ownership rule</Kicker>
            <Title width={1460}>The customer must keep the durable parts.</Title>
          </div>
          <Surface accent={palette.cyan} style={{ position: "absolute", left: 120, top: 406, width: 1180, minHeight: 374, padding: "30px 38px" }}>
            <Kicker>Customer-owned workflow assets</Kicker>
            <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 48 }}>
              {assets.map((asset, index) => {
                const item = reveal(local, 19 + index * 0.26, 0.32);
                return <div key={asset} style={{ borderTop: `1px solid ${palette.rule}`, padding: "16px 0", opacity: item, transform: `translateY(${(1 - item) * 11}px)` }}><span style={{ color: palette.cyan, fontFamily: "SFMono-Regular, Menlo, monospace", fontSize: 14, fontWeight: 700, letterSpacing: 1.5 }}>0{index + 1}</span><span style={{ marginLeft: 18, color: palette.ink, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 24, fontWeight: 700 }}>{asset}</span></div>;
              })}
            </div>
          </Surface>
          <Surface accent={palette.amber} style={{ position: "absolute", left: 1340, right: 120, top: 406, minHeight: 374, padding: "30px" }}>
            <Kicker color={palette.amber}>Replaceable plug</Kicker>
            <div style={{ marginTop: 65, fontFamily: "Georgia, Times New Roman, serif", fontSize: 44, fontWeight: 700, lineHeight: 0.98 }}>Model / provider</div>
            <div style={{ marginTop: 25, color: palette.muted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 22, lineHeight: 1.3 }}>Important capability, not the owner of the operating system.</div>
          </Surface>
        </>
      )}
    </AbsoluteFill>
  );
};

const ActorCard: React.FC<{ letter: string; label: string; question: string; accent: string; index: number; local: number }> = ({ letter, label, question, accent, index, local }) => {
  const card = reveal(local, 1 + index * 0.48, 0.48);
  return <Surface accent={accent} style={{ height: 292, padding: "26px", opacity: card, transform: `translateY(${(1 - card) * 24}px)` }}><div style={{ color: palette.ink, fontFamily: "Georgia, Times New Roman, serif", fontSize: 78, fontWeight: 700, lineHeight: 0.8 }}>{letter}</div><div style={{ marginTop: 32, color: palette.ink, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 30, fontWeight: 700 }}>{label}</div><div style={{ marginTop: 18, color: palette.muted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 20, lineHeight: 1.28 }}>{question}</div></Surface>;
};

const ActorChapter: React.FC<{ local: number; time: number }> = ({ local, time }) => {
  const loop = reveal(local, 44.6, 1.3);
  const cards = [
    ["A", "Action", "What decision, handoff, or task changes?", palette.coral],
    ["C", "Context", "What must the system know and access?", palette.cyan],
    ["T", "Trust", "When may the system recommend or act?", palette.amber],
    ["O", "Outcome", "What proves that work improved?", palette.olive],
    ["R", "Recursive", "How does this run improve the next one?", palette.coral],
  ];
  return (
    <AbsoluteFill>
      <PaperField />
      <Header chapter={chapters.framework} time={time} />
      <div style={{ position: "absolute", top: 154, left: 120, right: 120 }}>
        <Kicker>My deployment framework</Kicker>
        <Title width={1420}>ACTOR makes a deployment framework concrete.</Title>
      </div>
      <div style={{ position: "absolute", top: 402, left: 120, right: 120, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18 }}>
        {cards.map(([letter, label, question, accent], index) => <ActorCard key={letter} letter={letter} label={label} question={question} accent={accent} index={index} local={local} />)}
      </div>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path d="M 1640 770 C 1600 890, 400 890, 360 770" fill="none" stroke={palette.cyan} strokeWidth="5" strokeDasharray="1420" strokeDashoffset={1420 * (1 - loop)} opacity={loop > 0 ? 1 : 0} />
      </svg>
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 152, color: palette.ink, fontFamily: "Georgia, Times New Roman, serif", fontSize: 49, lineHeight: 0.98, fontWeight: 700, textAlign: "center", opacity: loop, transform: `translateY(${(1 - loop) * 16}px)` }}>A loop in a diagram is not self-improvement.<br />Good judgment still has to compound.</div>
    </AbsoluteFill>
  );
};

const OutcomeChapter: React.FC<{ local: number; time: number }> = ({ local, time }) => {
  const conclusion = local >= 19;
  const resolve = reveal(local, 20, 0.6);
  return (
    <AbsoluteFill>
      <PaperField dark={conclusion} />
      <Header chapter={chapters.outcome} time={time} dark={conclusion} />
      {!conclusion ? (
        <>
          <div style={{ position: "absolute", top: 154, left: 120, right: 120 }}>
            <Kicker color={palette.coral}>Tokens are inputs</Kicker>
            <Title width={1320}>Model consumption is not the same as operating value.</Title>
          </div>
          <div style={{ position: "absolute", top: 436, left: 180, right: 180, display: "grid", gridTemplateColumns: "1fr 120px 1fr", alignItems: "center" }}>
            <Surface accent={palette.coral} style={{ height: 220, padding: "32px" }}><Kicker color={palette.coral}>Input</Kicker><div style={{ marginTop: 34, color: palette.ink, fontFamily: "Georgia, Times New Roman, serif", fontSize: 58, fontWeight: 700, lineHeight: 0.9 }}>Token usage</div><div style={{ marginTop: 17, color: palette.muted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 22 }}>Measures consumption.</div></Surface>
            <div style={{ height: 5, backgroundColor: palette.cyan }} />
            <Surface accent={palette.cyan} style={{ height: 220, padding: "32px" }}><Kicker>Outcome</Kicker><div style={{ marginTop: 34, color: palette.ink, fontFamily: "Georgia, Times New Roman, serif", fontSize: 58, fontWeight: 700, lineHeight: 0.9 }}>Operating capability</div><div style={{ marginTop: 17, color: palette.muted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 22 }}>Measures changed work and learning.</div></Surface>
          </div>
        </>
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "130px 190px 110px", color: palette.inverseText }}>
          <Kicker color={palette.amber}>The operating rule</Kicker>
          <div style={{ marginTop: 30, width: 1480, fontFamily: "Georgia, Times New Roman, serif", fontSize: 83, fontWeight: 700, lineHeight: 0.96, opacity: resolve, transform: `translateY(${(1 - resolve) * 20}px)` }}>Judge AI by the workflow it changes and the capability the customer keeps.</div>
          <div style={{ marginTop: 42, width: 920, color: palette.inverseMuted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 29, lineHeight: 1.32, opacity: resolve }}>The title FDE may change. The operating rule will not.</div>
          <div style={{ marginTop: 68, display: "flex", alignItems: "center", gap: 18, opacity: resolve }}><Img src={staticFile("fde-v5/ag-monogram.png")} style={{ width: 54, height: 54, objectFit: "contain" }} /><div style={{ textAlign: "left" }}><div style={{ color: palette.inverseText, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 22, fontWeight: 700 }}>Aaron Guo</div><div style={{ marginTop: 4, color: palette.inverseMuted, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 17 }}>AI-native builder. Human-first thinker.</div></div></div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const HybridStage: React.FC<{ time: number }> = ({ time }) => {
  if (time < 3.25) return <Cover />;
  if (inRange(time, 3.25, chapters.signal.end)) return <SignalLedger local={time - 3.25} time={time} />;
  if (inRange(time, chapters.system.start, chapters.system.end)) return <SystemChapter local={time - chapters.system.start} time={time} />;
  if (inRange(time, chapters.decision.start, chapters.decision.end)) return <DecisionChapter local={time - chapters.decision.start} time={time} />;
  if (inRange(time, chapters.learning.start, chapters.learning.end)) return <LearningChapter local={time - chapters.learning.start} time={time} />;
  if (inRange(time, chapters.practice.start, chapters.practice.end)) return <WorkflowChapter local={time - chapters.practice.start} time={time} />;
  if (inRange(time, chapters.model.start, chapters.model.end)) return <ComparisonChapter local={time - chapters.model.start} time={time} />;
  if (inRange(time, chapters.ownership.start, chapters.ownership.end)) return <OwnershipChapter local={time - chapters.ownership.start} time={time} />;
  if (inRange(time, chapters.framework.start, chapters.framework.end)) return <ActorChapter local={time - chapters.framework.start} time={time} />;
  return <OutcomeChapter local={time - chapters.outcome.start} time={time} />;
};

const musicVolume = (time: number): number => {
  if (time < 2.15) return 0.72;
  if (time < 3.15) return ramp(time, 2.15, 3.15, 0.72, 0.11, easeInOut);
  if (time >= chapters.framework.start && time < chapters.outcome.start) return 0.14;
  if (time < GUIZANG_HYBRID_FULL_DURATION_SEC - 4.5) return 0.11;
  return ramp(time, GUIZANG_HYBRID_FULL_DURATION_SEC - 4.5, GUIZANG_HYBRID_FULL_DURATION_SEC, 0.12, 0, easeInOut);
};

export const FdeGuizangHybridFullFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const finalFade = 1 - reveal(time, GUIZANG_HYBRID_FULL_DURATION_SEC - 0.45, 0.45);

  return (
    <AbsoluteFill style={{ backgroundColor: palette.ink, overflow: "hidden" }}>
      <Audio src={staticFile("fde-full-film/music-full-v1.mp3")} volume={musicVolume(time)} />
      <Sequence from={Math.round(narrationOffsetSec * fps)}>
        <Audio src={staticFile("fde-v5/narration-full-v5.mp3")} />
      </Sequence>
      <HybridStage time={time} />
      {time >= narrationOffsetSec ? <Caption time={time} /> : null}
      <AbsoluteFill style={{ backgroundColor: palette.ink, opacity: 1 - finalFade, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
