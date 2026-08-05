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
import {
  editorialLayouts,
  EditorialStatement,
  layoutStyle,
} from "./editorial/EditorialLayoutEngine";
import {
  dependentReveal,
  editorial,
  FlowNode,
  FrameworkCard,
  SceneHeader,
} from "./editorial/EditorialMotionSystem";

export const AUTHORITY_BOUNDARY_FPS = 30;
export const AUTHORITY_BOUNDARY_AUDIO_END_SEC = 284.305125;
export const AUTHORITY_BOUNDARY_END_CARD_SEC = 6;
export const AUTHORITY_BOUNDARY_FULL_END_SEC =
  AUTHORITY_BOUNDARY_AUDIO_END_SEC + AUTHORITY_BOUNDARY_END_CARD_SEC;

export const AUTHORITY_BOUNDARY_CORE_START_SEC = 44.884317;
export const AUTHORITY_BOUNDARY_CORE_END_SEC = 128.963628;
export const AUTHORITY_BOUNDARY_CONTRACT_START_SEC = 128.963628;
export const AUTHORITY_BOUNDARY_CONTRACT_END_SEC = 216.224218;

export const authorityBoundaryFullDurationFrames = (
  fps = AUTHORITY_BOUNDARY_FPS,
): number => Math.ceil(AUTHORITY_BOUNDARY_FULL_END_SEC * fps);

export const authorityBoundaryCoreDurationFrames = (
  fps = AUTHORITY_BOUNDARY_FPS,
): number =>
  Math.ceil(
    (AUTHORITY_BOUNDARY_CORE_END_SEC - AUTHORITY_BOUNDARY_CORE_START_SEC) *
      fps,
  );

export const authorityBoundaryContractDurationFrames = (
  fps = AUTHORITY_BOUNDARY_FPS,
): number =>
  Math.ceil(
    (AUTHORITY_BOUNDARY_CONTRACT_END_SEC -
      AUTHORITY_BOUNDARY_CONTRACT_START_SEC) *
      fps,
  );

const scenes = {
  hook: { start: 0, end: 21.780317 },
  debate: { start: 21.780317, end: 60.418322 },
  status: { start: 60.418322, end: 101.424762 },
  rollback: { start: 101.424762, end: 128.963628 },
  evidence: { start: 128.963628, end: 165.883356 },
  ladder: { start: 165.883356, end: 216.224218 },
  objection: { start: 216.224218, end: 245.620681 },
  release: { start: 245.620681, end: AUTHORITY_BOUNDARY_AUDIO_END_SEC },
  endCard: {
    start: AUTHORITY_BOUNDARY_AUDIO_END_SEC,
    end: AUTHORITY_BOUNDARY_FULL_END_SEC,
  },
} as const;

export type CaptionSegment = {
  text: string;
  start: number;
  end: number;
};

// Generated from audio-generation-manifest.json.timeline.wordTimings using the
// production caption grouper. Slide-boundary phrases are split explicitly so a
// prototype never begins with words from the preceding chapter.
export const AUTHORITY_BOUNDARY_CAPTIONS: CaptionSegment[] = [
  { text: "Two AI-generated patches can both be five lines.", start: 0, end: 3.32 },
  { text: "One cleans a copied CSV.", start: 3.715, end: 5.782 },
  { text: "The other changes customer status in a system", start: 6.177, end: 9.207 },
  { text: "of record. If both tests are green,", start: 9.311, end: 12.713 },
  { text: "should we review them the same way?", start: 13.119, end: 15.035 },
  { text: "I don't. The hidden variable is what the", start: 15.894, end: 18.901 },
  { text: "code is allowed to turn into truth.", start: 18.982, end: 21.78 },
  { text: "Mitchell Hashimoto's answer to the recent debate was", start: 21.780317, end: 24.648317 },
  { text: "simple: “I read the code.” Even in a", start: 24.729317, end: 28.665317 },
  { text: "multi-model workflow, source comprehension remained his final gate.", start: 28.734317, end: 33.053317 },
  { text: "Uncle Bob takes another route.", start: 34.005317, end: 35.782317 },
  { text: "He emphasizes specifications, tests,", start: 36.467317, end: 39.520317 },
  { text: "mutation testing, QA, metrics,", start: 39.671317, end: 42.469317 },
  { text: "and final verification.", start: 42.620317, end: 44.083317 },
  { text: "His line is just as", start: 44.884317, end: 45.976317 },
  { text: "direct: “I am the engineer because I am", start: 46.045317, end: 49.122317 },
  { text: "accountable.” They agree on ownership.", start: 49.215317, end: 52.524317 },
  { text: "They disagree on where understanding lives.", start: 53.116317, end: 55.670317 },
  { text: "The debate hides one variable: authority.", start: 56.262317, end: 60.418322 },
  { text: "Consider a hypothetical change.", start: 60.418322, end: 62.229322 },
  { text: "A system has two customer states:", start: 63.286322, end: 65.259322 },
  { text: "paused and inactive. An agent maps paused to", start: 65.666322, end: 69.520322 },
  { text: "inactive, then writes tests around the same assumption.", start: 69.613322, end: 72.922322 },
  { text: "CI goes green. But paused may mean stop", start: 73.572322, end: 76.475322 },
  { text: "billing and preserve access.", start: 76.568322, end: 78.681322 },
  { text: "Inactive may remove access and trigger notifications.", start: 79.621322, end: 83.557322 },
  { text: "The tests prove that the implementation and the", start: 84.497322, end: 87.110322 },
  { text: "tests agree. They do not prove that either", start: 87.191322, end: 91.103322 },
  { text: "one matches the business.", start: 91.173322, end: 92.775322 },
  { text: "Once that value enters a system of record,", start: 93.878322, end: 96.734322 },
  { text: "one wrong word can become several real actions.", start: 97.431322, end: 101.425322 },
  { text: "Here is my quickest risk test.", start: 101.424762, end: 103.595762 },
  { text: "If we revert this commit at noon,", start: 104.303762, end: 106.463762 },
  { text: "what is still wrong at 12:01?", start: 106.741762, end: 109.191762 },
  { text: "The next bad write may stop.", start: 110.015762, end: 111.757762 },
  { text: "But records may already be changed.", start: 112.210762, end: 114.183762 },
  { text: "Copies may have spread.", start: 114.787762, end: 116.204762 },
  { text: "Emails may have gone out.", start: 116.726762, end: 118.177762 },
  { text: "Access may have disappeared.", start: 118.619762, end: 120.325762 },
  { text: "Someone may have acted on the wrong state.", start: 120.836762, end: 123.344762 },
  { text: "Rolling back code and restoring reality are different jobs.", start: 124.644762, end: 128.963628 },
  { text: "Source reading and tests are not substitutes.", start: 128.963628, end: 132.283628 },
  { text: "Reading builds the system model needed for maintenance", start: 133.235628, end: 136.521628 },
  { text: "and unusual failures. It does not prove correctness.", start: 136.579628, end: 140.805628 },
  { text: "Tests create repeatable evidence.", start: 141.246628, end: 143.836628 },
  { text: "They only exercise the expectations we encoded.", start: 144.277628, end: 147.261628 },
  { text: "When one AI context produces the implementation,", start: 148.271628, end: 151.661628 },
  { text: "tests, and review summary,", start: 151.800628, end: 154.029628 },
  { text: "it can repeat the same mistaken premise three", start: 154.378628, end: 156.990628 },
  { text: "times. The goal is not to choose reading", start: 157.036628, end: 160.276628 },
  { text: "or evidence. It is to match both to", start: 160.380628, end: 163.491628 },
  { text: "the authority of the change.", start: 163.561628, end: 165.883628 },
  { text: "I use four cumulative levels.", start: 165.883356, end: 168.112356 },
  { text: "Outcome: for private, disposable,", start: 168.646356, end: 171.433356 },
  { text: "reversible work, verify the result.", start: 171.618356, end: 174.207356 },
  { text: "Evidence: when another person or process depends on", start: 175.043356, end: 178.364356 },
  { text: "it, inspect tests, logs,", start: 178.445356, end: 180.721356 },
  { text: "CI, and checks that bring a different method", start: 180.837356, end: 183.367356 },
  { text: "or context. System Model:", start: 183.437356, end: 186.374356 },
  { text: "when a change enters production or writes authoritative", start: 187.094356, end: 189.973356 },
  { text: "state, someone accountable must explain the data flow,", start: 190.020356, end: 194.431356 },
  { text: "invariants, failure propagation, observability,", start: 194.722356, end: 198.216356 },
  { text: "and recovery. Critical Path:", start: 198.251356, end: 201.235356 },
  { text: "for permissions, money, privacy,", start: 201.862356, end: 204.787356 },
  { text: "deletion, migrations, security, or system-of-record", start: 204.996356, end: 209.396356 },
  { text: "writes, understand the relevant source path.", start: 209.431356, end: 212.694356 },
  { text: "Each level keeps the ones before it.", start: 213.390356, end: 216.223356 },
  { text: "The fair objection is obvious.", start: 216.224218, end: 218.163218 },
  { text: "Apply this to every generated script and we", start: 218.976218, end: 221.634218 },
  { text: "erase the productivity gain.", start: 221.704218, end: 223.306218 },
  { text: "Agreed. A disposable prototype should stay fast.", start: 223.898218, end: 228.008218 },
  { text: "The deeper gate turns on when code writes", start: 228.600218, end: 230.621218 },
  { text: "truth, grants capability, moves value,", start: 230.679218, end: 234.336218 },
  { text: "deletes history, or creates a consequence that is", start: 234.661218, end: 238.585218 },
  { text: "hard to repair. The discipline is proportional.", start: 238.678218, end: 242.904218 },
  { text: "So is the attention.", start: 243.078218, end: 245.621218 },
  { text: "For a critical write,", start: 245.620681, end: 246.897681 },
  { text: "the change contract can fit in the pull", start: 247.164681, end: 249.428681 },
  { text: "request. Name the allowed state transition.", start: 249.521681, end: 252.911681 },
  { text: "Name the invariant that must remain true.", start: 253.492681, end: 256.417681 },
  { text: "Name the signal that reveals divergence.", start: 257.079681, end: 259.901681 },
  { text: "Name the reconciliation path that restores reality.", start: 260.319681, end: 263.720681 },
  { text: "And name the owner.", start: 264.022681, end: 265.323681 },
  { text: "If those answers do not exist,", start: 265.891681, end: 267.981681 },
  { text: "green tests are not enough.", start: 268.179681, end: 269.897681 },
  { text: "AI lowers implementation cost.", start: 270.791681, end: 273.043681 },
  { text: "It does not lower consequence cost.", start: 273.357681, end: 275.539681 },
  { text: "Before shipping, ask: if every test passes and", start: 276.573681, end: 280.021681 },
  { text: "the world is still wrong,", start: 280.068681, end: 281.287681 },
  { text: "who can explain why—and restore the truth?", start: 281.310681, end: 284.305681 },
];

const theme = {
  evidence: "#78bfd2",
  evidenceDark: "#17323a",
  graphite: "#2a302d",
  paperShadow: "rgba(20, 24, 21, 0.22)",
} as const;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

const progress = (
  time: number,
  start: number,
  end: number,
  easing = easeOut,
): number =>
  interpolate(time, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

const isActive = (time: number, range: { start: number; end: number }): boolean =>
  time >= range.start && time < range.end;

const lift = (
  time: number,
  start: number,
  duration = 0.55,
  distance = 18,
): React.CSSProperties => {
  const value = progress(time, start, start + duration);
  return {
    opacity: value,
    transform: `translateY(${(1 - value) * distance}px)`,
  };
};

const formatTime = (time: number): string => {
  const seconds = Math.max(0, Math.floor(time));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60,
  ).padStart(2, "0")}`;
};

const sectionForTime = (time: number): string => {
  if (time < scenes.debate.end) return "01 / AUTHORITY";
  if (time < scenes.rollback.end) return "02 / CONSEQUENCE";
  if (time < scenes.ladder.end) return "03 / REVIEW";
  if (time < scenes.release.end) return "04 / RELEASE";
  return "";
};

const FieldBackdrop: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: editorial.color.canvas }}>
    <AbsoluteFill
      style={{
        opacity: 0.1,
        backgroundImage: `linear-gradient(${editorial.color.grid} 1px, transparent 1px), linear-gradient(90deg, ${editorial.color.grid} 1px, transparent 1px)`,
        backgroundSize: "128px 128px",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: editorial.safe.left,
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: editorial.color.grid,
      }}
    />
    <div
      style={{
        position: "absolute",
        right: editorial.safe.right,
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: editorial.color.grid,
      }}
    />
  </AbsoluteFill>
);

const BrandLockup: React.FC<{
  darkText?: boolean;
  compact?: boolean;
}> = ({ darkText = false, compact = false }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: compact ? 14 : 18,
      color: darkText ? editorial.color.ink : editorial.color.text,
    }}
  >
    <Img
      src={staticFile("authority-boundary/ag-logo.png")}
      style={{
        width: compact ? 56 : 72,
        height: compact ? 56 : 72,
        objectFit: "cover",
        borderRadius: editorial.radius,
      }}
    />
    <div>
      <div style={{ fontSize: compact ? 20 : 26, fontWeight: 800 }}>Aaron Guo</div>
      <div
        style={{
          marginTop: 5,
          fontSize: compact ? 12 : 15,
          fontWeight: 720,
          letterSpacing: 1.2,
          opacity: 0.72,
        }}
      >
        AI-NATIVE BUILDER · HUMAN-FIRST THINKER
      </div>
    </div>
  </div>
);

const FrameChrome: React.FC<{ time: number; hidden?: boolean }> = ({
  time,
  hidden = false,
}) => {
  if (hidden) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: editorial.safe.left,
        right: editorial.safe.right,
        top: 42,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 14px",
        boxSizing: "border-box",
        color: editorial.color.text,
        backgroundColor: "rgba(9, 12, 11, 0.78)",
        borderRadius: editorial.radius,
        fontSize: 16,
        fontWeight: 720,
        letterSpacing: 0.7,
        zIndex: 110,
      }}
    >
      <span>AG / FIELD NOTES</span>
      <span style={{ color: editorial.color.muted }}>{sectionForTime(time)}</span>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatTime(time)}</span>
    </div>
  );
};

const PhraseCaption: React.FC<{ time: number; hidden?: boolean }> = ({
  time,
  hidden = false,
}) => {
  if (hidden) return null;
  let active: CaptionSegment | undefined;
  for (let index = AUTHORITY_BOUNDARY_CAPTIONS.length - 1; index >= 0; index -= 1) {
    const segment = AUTHORITY_BOUNDARY_CAPTIONS[index];
    if (time >= segment.start && time <= segment.end + 0.28) {
      active = segment;
      break;
    }
  }
  if (!active) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 290,
        right: 290,
        bottom: 36,
        minHeight: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 28px 14px",
        boxSizing: "border-box",
        color: editorial.color.text,
        backgroundColor: editorial.color.captionSurface,
        boxShadow: "0 -10px 28px rgba(0, 0, 0, 0.24)",
        borderRadius: editorial.radius,
        fontSize: editorial.type.caption,
        lineHeight: 1.28,
        fontWeight: 620,
        textAlign: "center",
        zIndex: 120,
      }}
    >
      {active.text}
    </div>
  );
};

const CoverScene: React.FC<{ time: number }> = ({ time }) => {
  if (!isActive(time, scenes.hook)) return null;
  const coverStory = progress(time, 2.75, 3.55, easeInOut);
  const csv = progress(time, 3.715, 4.2);
  const record = progress(time, 6.177, 6.72);
  const authority = progress(time, 17.38, 18.05);
  return (
    <AbsoluteFill>
      <Img
        src={staticFile("authority-boundary/00-cover.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Img
        src={staticFile("authority-boundary/00-cover-thumbnail.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 1 - coverStory,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 88,
          top: 58,
          padding: "12px 16px",
          backgroundColor: "rgba(241, 238, 230, 0.91)",
          border: "1px solid rgba(17, 20, 17, 0.18)",
          borderRadius: editorial.radius,
        }}
      >
        <BrandLockup darkText compact />
      </div>
      <div
        style={{
          position: "absolute",
          right: 112,
          bottom: 184,
          width: 650,
          padding: "22px 26px",
          boxSizing: "border-box",
          backgroundColor: "rgba(241, 238, 230, 0.92)",
          borderLeft: `7px solid ${editorial.color.tension}`,
          color: editorial.color.ink,
          fontSize: 29,
          lineHeight: 1.18,
          fontWeight: 760,
        }}
      >
        Review depth should follow authority—not authorship.
      </div>
      <div
        style={{
          position: "absolute",
          right: 122,
          top: 246,
          width: 620,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
        }}
      >
        <div
          style={{
            padding: "18px 20px",
            backgroundColor: "rgba(241, 238, 230, 0.94)",
            border: `1px solid ${theme.evidence}`,
            color: editorial.color.ink,
            opacity: csv,
            transform: `translateY(${(1 - csv) * 12}px)`,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 780, color: theme.evidenceDark }}>
            COPIED CSV
          </div>
          <div style={{ marginTop: 8, fontSize: 25, fontWeight: 800 }}>Disposable</div>
        </div>
        <div
          style={{
            padding: "18px 20px",
            backgroundColor: "rgba(241, 238, 230, 0.94)",
            border: `1px solid ${editorial.color.tension}`,
            color: editorial.color.ink,
            opacity: record,
            transform: `translateY(${(1 - record) * 12}px)`,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 780, color: editorial.color.tension }}>
            SYSTEM OF RECORD
          </div>
          <div style={{ marginTop: 8, fontSize: 25, fontWeight: 800 }}>Authoritative</div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 112,
          top: 510,
          width: 650,
          textAlign: "center",
          color: editorial.color.tension,
          fontSize: 38,
          fontWeight: 860,
          opacity: authority,
          transform: `translateY(${(1 - authority) * 12}px)`,
        }}
      >
        WHAT CAN THIS CHANGE MAKE TRUE?
      </div>
    </AbsoluteFill>
  );
};

type QuoteLaneProps = {
  source: string;
  quote: string;
  detail: string;
  accent: string;
  focus: number;
};

const QuoteLane: React.FC<QuoteLaneProps> = ({
  source,
  quote,
  detail,
  accent,
  focus,
}) => (
  <div
    style={{
      height: 376,
      padding: "30px 34px",
      boxSizing: "border-box",
      backgroundColor: editorial.color.surface,
      border: `1px solid ${focus > 0.6 ? accent : editorial.color.lineStrong}`,
      borderRadius: editorial.radius,
      opacity: 0.48 + focus * 0.52,
      transform: `translateY(${(1 - focus) * 8}px)`,
    }}
  >
    <div style={{ color: accent, fontSize: 18, fontWeight: 780 }}>{source}</div>
    <div
      style={{
        marginTop: 34,
        color: editorial.color.text,
        fontSize: 42,
        lineHeight: 1.08,
        fontWeight: 820,
      }}
    >
      “{quote}”
    </div>
    <div
      style={{
        marginTop: 30,
        color: editorial.color.muted,
        fontSize: 21,
        lineHeight: 1.35,
        fontWeight: 560,
      }}
    >
      {detail}
    </div>
  </div>
);

const DebateScene: React.FC<{ time: number }> = ({ time }) => {
  if (!isActive(time, scenes.debate)) return null;
  const uncleFocus = progress(time, 34.005317, 36.1);
  const ownership = progress(time, 51.014317, 51.7);
  const cardsExit = progress(time, 55.72, 56.22, easeInOut);
  const statement = progress(time, 56.262317, 56.86);
  return (
    <AbsoluteFill>
      <div style={{ opacity: 1 - cardsExit }}>
        <SceneHeader
          eyebrow="PUBLIC DEBATE / TWO QUALITY GATES"
          title="They agree on ownership."
          aside="They disagree on where understanding should live."
        />
        <div
          style={{
            position: "absolute",
            left: editorial.safe.left,
            right: editorial.safe.right,
            top: 334,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
          }}
        >
          <QuoteLane
            source="MITCHELL HASHIMOTO · X"
            quote="I read the code."
            detail="Source comprehension remains the final gate."
            accent={theme.evidence}
            focus={Math.max(0.42, 1 - uncleFocus * 0.48)}
          />
          <QuoteLane
            source="ROBERT C. MARTIN · X"
            quote="I am the engineer because I am accountable."
            detail="Specifications, tests, mutation testing, QA, metrics, and verification carry assurance."
            accent={editorial.color.signal}
            focus={Math.max(0.42, uncleFocus)}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: editorial.safe.left,
            right: editorial.safe.right,
            top: 790,
            height: 86,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTop: `1px solid ${editorial.color.lineStrong}`,
            color: editorial.color.text,
            fontSize: 30,
            fontWeight: 760,
            opacity: ownership,
          }}
        >
          Same responsibility. Different location of understanding.
        </div>
      </div>
      <EditorialStatement
        eyebrow="THE MISSING VARIABLE"
        title={<span style={{ color: editorial.color.tension }}>AUTHORITY</span>}
        supporting="What is this code allowed to turn into truth?"
        opacity={statement}
        transform={`translateY(${(1 - statement) * 16}px)`}
      />
    </AbsoluteFill>
  );
};

const StatusScene: React.FC<{ time: number }> = ({ time }) => {
  if (!isActive(time, scenes.status)) return null;
  const local = time - scenes.status.start;
  const bridge = progress(local, 0, 0.8);
  const assumption = progress(time, 68.081322, 69.2);
  const ci = progress(time, 73.572322, 74.4);
  const semanticContrast = progress(time, 75.128322, 80.1);
  const agreement = progress(time, 84.497322, 85.6);
  const authorityPath = progress(time, 93.878322, 98.2, easeInOut);
  const consequences = ["BILLING", "ACCESS", "NOTIFICATIONS", "REPORTING"];
  const yPositions = [356, 476, 596, 716];
  return (
    <AbsoluteFill>
      <SceneHeader
        eyebrow="HYPOTHETICAL / SYSTEM OF RECORD"
        title="Green tests. Wrong status."
        aside="A consistent assumption is not independent evidence."
        opacity={bridge}
      />
      <div
        style={{
          position: "absolute",
          left: 112,
          top: 332,
          width: 650,
          height: 462,
          padding: "28px 30px",
          boxSizing: "border-box",
          backgroundColor: editorial.color.surface,
          border: `1px solid ${editorial.color.lineStrong}`,
          borderRadius: editorial.radius,
        }}
      >
        <div style={{ color: editorial.color.muted, fontSize: 17, fontWeight: 760 }}>
          ONE SHARED ASSUMPTION
        </div>
        <div style={{ marginTop: 26, display: "flex", gap: 22 }}>
          <FlowNode label="PAUSED" tone="paper" width={270} height={102} fontSize={30} />
          <FlowNode
            label="INACTIVE"
            tone={semanticContrast > 0.35 ? "tension" : "neutral"}
            width={270}
            height={102}
            fontSize={30}
          />
        </div>
        <div
          style={{
            marginTop: 30,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
          }}
        >
          <div
            style={{
              padding: "18px 20px",
              border: `1px solid ${assumption > 0.2 ? editorial.color.tension : editorial.color.line}`,
              color: editorial.color.text,
              opacity: 0.42 + assumption * 0.58,
            }}
          >
            <div style={{ fontSize: 17, color: editorial.color.muted }}>IMPLEMENTATION</div>
            <div style={{ marginTop: 8, fontSize: 23, fontWeight: 760 }}>paused → inactive</div>
          </div>
          <div
            style={{
              padding: "18px 20px",
              border: `1px solid ${agreement > 0.2 ? editorial.color.tension : editorial.color.line}`,
              color: editorial.color.text,
              opacity: 0.42 + Math.max(assumption, agreement) * 0.58,
            }}
          >
            <div style={{ fontSize: 17, color: editorial.color.muted }}>TESTS</div>
            <div style={{ marginTop: 8, fontSize: 23, fontWeight: 760 }}>expect inactive</div>
          </div>
        </div>
        <div
          style={{
            marginTop: 28,
            height: 54,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: ci > 0.02 ? editorial.color.signalDark : editorial.color.surfaceStrong,
            border: `1px solid ${ci > 0.02 ? editorial.color.signal : editorial.color.line}`,
            color: editorial.color.text,
            fontSize: 24,
            fontWeight: 800,
            opacity: 0.5 + ci * 0.5,
          }}
        >
          CI: GREEN
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 886,
          top: 302,
          width: 10,
          height: 554,
          backgroundColor: editorial.color.tension,
          opacity: 0.38 + authorityPath * 0.62,
          transformOrigin: "top center",
          transform: `scaleY(${0.16 + bridge * 0.84})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 824,
          top: 272,
          color: editorial.color.tension,
          fontSize: 16,
          fontWeight: 820,
          letterSpacing: 1,
        }}
      >
        AUTHORITY BOUNDARY
      </div>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        {yPositions.map((y) => {
          const length = 520;
          return (
            <React.Fragment key={y}>
              <line
                x1="896"
                y1="536"
                x2="1130"
                y2={y + 48}
                stroke={editorial.color.lineStrong}
                strokeWidth="3"
              />
              <line
                x1="896"
                y1="536"
                x2="1130"
                y2={y + 48}
                stroke={editorial.color.tension}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={length}
                strokeDashoffset={length * (1 - authorityPath)}
              />
            </React.Fragment>
          );
        })}
      </svg>
      {consequences.map((label, index) => {
        const active = dependentReveal(authorityPath, 0.56 + index * 0.1);
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: 1130,
              top: yPositions[index],
            }}
          >
            <FlowNode
              label={label}
              tone={active > 0.01 ? "tension" : "neutral"}
              width={520}
              height={96}
              fontSize={25}
              opacity={0.42 + active * 0.58}
              transform={`translateX(${(1 - active) * 8}px)`}
            />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 1090,
          top: 824,
          width: 600,
          color: editorial.color.tension,
          fontSize: 25,
          lineHeight: 1.25,
          fontWeight: 780,
          textAlign: "center",
          opacity: authorityPath,
        }}
      >
        ONE WORD → SEVERAL REAL ACTIONS
      </div>
    </AbsoluteFill>
  );
};

const RollbackScene: React.FC<{ time: number }> = ({ time }) => {
  if (!isActive(time, scenes.rollback)) return null;
  const local = time - scenes.rollback.start;
  const bridge = progress(local, 0, 0.8);
  const clock = progress(time, 104.303762, 106.9);
  const commitStops = progress(time, 110.015762, 110.62);
  const realityStarts = [112.210762, 114.787762, 116.726762, 118.619762, 120.836762];
  const realityItems = [
    ["RECORDS", "already changed"],
    ["COPIES", "already spread"],
    ["EMAILS", "already sent"],
    ["ACCESS", "already removed"],
    ["ACTION", "already taken"],
  ] as const;
  const conclusion = progress(time, 124.644762, 125.4);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("authority-boundary/01-authority-ripple.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.33,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(9,12,11,0.98) 0%, rgba(9,12,11,0.9) 51%, rgba(9,12,11,0.5) 100%)",
        }}
      />
      <SceneHeader
        eyebrow="THE 12:01 TEST"
        title="Rollback stops code—not consequence."
        aside="Reverting a commit and restoring reality are different jobs."
        opacity={bridge}
      />
      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          top: 350,
          width: 570,
          height: 408,
          padding: "30px 32px",
          boxSizing: "border-box",
          backgroundColor: "rgba(17, 23, 20, 0.94)",
          border: `1px solid ${editorial.color.lineStrong}`,
          borderRadius: editorial.radius,
          opacity: bridge,
        }}
      >
        <div style={{ color: editorial.color.muted, fontSize: 17, fontWeight: 780 }}>
          IF WE REVERT AT NOON...
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 104,
            lineHeight: 0.95,
            color: editorial.color.text,
            fontWeight: 840,
            fontVariantNumeric: "tabular-nums",
            opacity: 0.38 + clock * 0.62,
          }}
        >
          12:01
        </div>
        <div
          style={{
            marginTop: 38,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor:
              commitStops > 0.01 ? editorial.color.signalDark : editorial.color.surfaceStrong,
            border: `1px solid ${
              commitStops > 0.01 ? editorial.color.signal : editorial.color.line
            }`,
            color: editorial.color.text,
            opacity: 0.46 + commitStops * 0.54,
          }}
        >
          <span style={{ fontSize: 21, fontWeight: 730 }}>NEXT BAD WRITE</span>
          <span style={{ color: editorial.color.signal, fontSize: 24, fontWeight: 840 }}>
            STOPS
          </span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 778,
          top: 350,
          width: 1030,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
        }}
      >
        {realityItems.map(([label, detail], index) => {
          const reveal = progress(time, realityStarts[index], realityStarts[index] + 0.58);
          return (
            <div
              key={label}
              style={{
                minHeight: 106,
                padding: "20px 22px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "rgba(58, 30, 26, 0.9)",
                border: `1px solid ${
                  reveal > 0.02 ? editorial.color.tension : editorial.color.lineStrong
                }`,
                borderRadius: editorial.radius,
                opacity: 0.34 + reveal * 0.66,
                transform: `translateX(${(1 - reveal) * 12}px)`,
              }}
            >
              <span style={{ color: editorial.color.text, fontSize: 24, fontWeight: 790 }}>
                {label}
              </span>
              <span style={{ color: editorial.color.tension, fontSize: 18, fontWeight: 700 }}>
                {detail}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 778,
          top: 716,
          width: 1030,
          minHeight: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 42px",
          boxSizing: "border-box",
          color: editorial.color.text,
          backgroundColor: editorial.color.tensionDark,
          borderLeft: `7px solid ${editorial.color.tension}`,
          fontSize: 31,
          lineHeight: 1.2,
          fontWeight: 820,
          textAlign: "center",
          opacity: conclusion,
          transform: `translateY(${(1 - conclusion) * 12}px)`,
        }}
      >
        RESTORING REALITY IS A SEPARATE JOB.
      </div>
    </AbsoluteFill>
  );
};

type EvidenceLaneProps = {
  eyebrow: string;
  title: string;
  points: string[];
  accent: string;
  focus: number;
};

const EvidenceLane: React.FC<EvidenceLaneProps> = ({
  eyebrow,
  title,
  points,
  accent,
  focus,
}) => (
  <div
    style={{
      height: "100%",
      padding: "28px 32px",
      boxSizing: "border-box",
      backgroundColor: editorial.color.surface,
      borderTop: `6px solid ${accent}`,
      borderLeft: `1px solid ${editorial.color.lineStrong}`,
      borderRight: `1px solid ${editorial.color.lineStrong}`,
      borderBottom: `1px solid ${editorial.color.lineStrong}`,
      borderRadius: editorial.radius,
      opacity: 0.46 + focus * 0.54,
      transform: `translateY(${(1 - focus) * 10}px)`,
    }}
  >
    <div style={{ color: accent, fontSize: 17, fontWeight: 790 }}>{eyebrow}</div>
    <div
      style={{
        marginTop: 14,
        color: editorial.color.text,
        fontSize: 41,
        lineHeight: 1.05,
        fontWeight: 820,
      }}
    >
      {title}
    </div>
    <div style={{ marginTop: 28, display: "grid", gap: 17 }}>
      {points.map((point) => (
        <div
          key={point}
          style={{
            paddingTop: 14,
            borderTop: `1px solid ${editorial.color.line}`,
            color: editorial.color.muted,
            fontSize: 21,
            lineHeight: 1.25,
            fontWeight: 580,
          }}
        >
          {point}
        </div>
      ))}
    </div>
  </div>
);

const EvidenceScene: React.FC<{ time: number }> = ({ time }) => {
  if (!isActive(time, scenes.evidence)) return null;
  const local = time - scenes.evidence.start;
  const bridge = progress(local, 0, 0.8);
  const testFocus = progress(time, 141.246628, 142.1);
  const sharedContext = progress(time, 148.271628, 149.15);
  const lanesExit = progress(time, 157.1, 158.0, easeInOut);
  // Begin the conclusion before the evidence lanes fully disappear so the
  // handoff keeps a meaningful visual on screen without overlapping two
  // fully readable, text-heavy layouts.
  const conclusion = progress(time, 157.9, 158.8);
  const split = editorialLayouts["split-loop"].slots;

  return (
    <AbsoluteFill>
      <SceneHeader
        eyebrow="TWO DIFFERENT QUALITY GATES"
        title="Understanding and evidence are complementary."
        aside="Neither source reading nor tests can independently certify truth."
        opacity={bridge * (1 - lanesExit)}
      />
      <div
        style={{
          ...layoutStyle(split.comparison.rect),
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          opacity: 1 - lanesExit,
        }}
      >
        <EvidenceLane
          eyebrow="SOURCE READING"
          title="SYSTEM MODEL"
          points={["Data flow and invariants", "Unusual failures", "Maintenance and recovery"]}
          accent={theme.evidence}
          focus={Math.max(0.44, bridge * (1 - testFocus * 0.36))}
        />
        <EvidenceLane
          eyebrow="TESTS · LOGS · CHECKS"
          title="REPEATABLE EVIDENCE"
          points={["Encoded expectations", "Observable behavior", "Independent methods and contexts"]}
          accent={editorial.color.signal}
          focus={Math.max(0.44, testFocus)}
        />
      </div>
      <div
        style={{
          ...layoutStyle(split.outcome.rect),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
          boxSizing: "border-box",
          backgroundColor: editorial.color.tensionDark,
          border: `1px solid ${editorial.color.tension}`,
          color: editorial.color.text,
          fontSize: 25,
          fontWeight: 760,
          opacity: sharedContext * (1 - lanesExit),
        }}
      >
        <span style={{ color: editorial.color.tension, fontWeight: 840 }}>SAME AI CONTEXT</span>
        <span>can repeat one mistaken premise three times.</span>
      </div>
      <EditorialStatement
        eyebrow="THE REVIEW RULE"
        title={
          <>
            MATCH BOTH TO <span style={{ color: editorial.color.signal }}>AUTHORITY</span>
          </>
        }
        supporting="Review depth follows the consequence a change is allowed to create."
        opacity={conclusion}
        transform={`translateY(${(1 - conclusion) * 16}px)`}
      />
    </AbsoluteFill>
  );
};

const LadderScene: React.FC<{ time: number }> = ({ time }) => {
  if (!isActive(time, scenes.ladder)) return null;
  const local = time - scenes.ladder.start;
  const bridge = progress(local, 0, 0.8);
  const activationTimes = [168.646356, 175.043356, 185.376356, 200.213356];
  const levels = [
    {
      letter: "1",
      label: "OUTCOME",
      question: "Is the result right for private, disposable, reversible work?",
    },
    {
      letter: "2",
      label: "EVIDENCE",
      question: "Do independent checks support the expected behavior?",
    },
    {
      letter: "3",
      label: "SYSTEM MODEL",
      question: "Can an owner explain flow, invariants, failure, and recovery?",
    },
    {
      letter: "4",
      label: "CRITICAL PATH",
      question: "Is the authoritative source path understood?",
    },
  ] as const;
  const retain = progress(time, 213.390356, 214.08);

  return (
    <AbsoluteFill>
      <SceneHeader
        eyebrow="A CUMULATIVE REVIEW LADDER"
        title="Four levels. Each keeps the ones before it."
        aside="Authority rises from disposable output to critical state."
        opacity={bridge}
      />
      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          right: editorial.safe.right,
          top: 342,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
        }}
      >
        {levels.map((level, index) => {
          const reveal = progress(time, activationTimes[index], activationTimes[index] + 0.72);
          return <FrameworkCard key={level.label} {...level} reveal={reveal} />;
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          right: editorial.safe.right,
          top: 682,
          height: 8,
          backgroundColor: editorial.color.lineStrong,
          overflow: "hidden",
          opacity: bridge,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: editorial.color.signal,
            transformOrigin: "left center",
            transform: `scaleX(${retain})`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          right: editorial.safe.right,
          top: 720,
          display: "flex",
          justifyContent: "space-between",
          color: editorial.color.muted,
          fontSize: 18,
          fontWeight: 730,
          letterSpacing: 0.4,
          opacity: 0.4 + retain * 0.6,
        }}
      >
        <span>PRIVATE + REVERSIBLE</span>
        <span style={{ color: editorial.color.signal }}>AUTHORITATIVE + HARD TO REPAIR</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 510,
          right: 510,
          top: 798,
          minHeight: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: editorial.color.text,
          borderTop: `1px solid ${editorial.color.lineStrong}`,
          borderBottom: `1px solid ${editorial.color.lineStrong}`,
          fontSize: 28,
          fontWeight: 790,
          opacity: retain,
          transform: `translateY(${(1 - retain) * 10}px)`,
        }}
      >
        CUMULATIVE, NOT OPTIONAL
      </div>
    </AbsoluteFill>
  );
};

const ObjectionScene: React.FC<{ time: number }> = ({ time }) => {
  if (!isActive(time, scenes.objection)) return null;
  const local = time - scenes.objection.start;
  const bridge = progress(local, 0, 0.8);
  const disposableFocus = progress(time, 223.898218, 224.55);
  const authorityFocus = progress(time, 228.600218, 229.35);
  const answer = progress(time, 238.678218, 239.45);
  const rightFocus = Math.max(0.38, authorityFocus);
  const leftFocus = Math.max(0.38, disposableFocus * (1 - authorityFocus * 0.48));

  return (
    <AbsoluteFill>
      <SceneHeader
        eyebrow="THE FAIR OBJECTION"
        title="Deep review everywhere would erase the gain."
        aside="Agreed. The gate should turn on with authority—not generation."
        opacity={bridge}
      />
      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          right: editorial.safe.right,
          top: 348,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
        }}
      >
        <div
          style={{
            height: 386,
            padding: "34px 38px",
            boxSizing: "border-box",
            backgroundColor: editorial.color.surface,
            border: `1px solid ${
              leftFocus > 0.65 ? theme.evidence : editorial.color.lineStrong
            }`,
            opacity: 0.46 + leftFocus * 0.54,
            transform: `translateY(${(1 - leftFocus) * 10}px)`,
          }}
        >
          <div style={{ color: theme.evidence, fontSize: 18, fontWeight: 800 }}>
            DISPOSABLE
          </div>
          <div style={{ marginTop: 22, color: editorial.color.text, fontSize: 50, fontWeight: 830 }}>
            STAY FAST
          </div>
          <div style={{ marginTop: 42, color: editorial.color.muted, fontSize: 23, lineHeight: 1.45 }}>
            Private prototype<br />Easy to discard<br />Easy to reverse
          </div>
        </div>
        <div
          style={{
            height: 386,
            padding: "34px 38px",
            boxSizing: "border-box",
            backgroundColor: editorial.color.surface,
            border: `1px solid ${
              rightFocus > 0.65 ? editorial.color.tension : editorial.color.lineStrong
            }`,
            opacity: 0.46 + rightFocus * 0.54,
            transform: `translateY(${(1 - rightFocus) * 10}px)`,
          }}
        >
          <div style={{ color: editorial.color.tension, fontSize: 18, fontWeight: 800 }}>
            AUTHORITATIVE
          </div>
          <div style={{ marginTop: 22, color: editorial.color.text, fontSize: 50, fontWeight: 830 }}>
            GO DEEP
          </div>
          <div style={{ marginTop: 42, color: editorial.color.muted, fontSize: 23, lineHeight: 1.45 }}>
            Writes truth · Grants capability<br />Moves value · Deletes history<br />Hard to repair
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 440,
          right: 440,
          top: 796,
          minHeight: 76,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: editorial.color.text,
          backgroundColor: editorial.color.signalDark,
          border: `1px solid ${editorial.color.signal}`,
          fontSize: 31,
          fontWeight: 820,
          opacity: answer,
          transform: `translateY(${(1 - answer) * 12}px)`,
        }}
      >
        THE DISCIPLINE IS PROPORTIONAL.
      </div>
    </AbsoluteFill>
  );
};

const ReleaseScene: React.FC<{ time: number }> = ({ time }) => {
  if (!isActive(time, scenes.release)) return null;
  const local = time - scenes.release.start;
  const bridge = progress(local, 0, 0.8);
  const activationTimes = [250.706, 253.493, 257.08, 260.32, 264.023];
  const contractItems = [
    ["01", "ALLOWED TRANSITION", "What state change may occur?"],
    ["02", "INVARIANT", "What must remain true?"],
    ["03", "DIVERGENCE SIGNAL", "What reveals that reality drifted?"],
    ["04", "RECONCILIATION", "How is authoritative truth restored?"],
    ["05", "OWNER", "Who is accountable for recovery?"],
  ] as const;
  const contractExit = progress(time, 270.0, 270.72, easeInOut);
  const costStatement = progress(time, 270.791681, 271.55);
  const questionStatement = progress(time, 276.573681, 277.42);
  const costExit = progress(time, 275.65, 276.25, easeInOut);

  return (
    <AbsoluteFill>
      <div style={{ opacity: 1 - contractExit }}>
        <SceneHeader
          eyebrow="THE CHANGE CONTRACT"
          title="Five answers before a critical write ships."
          aside="Small enough for a pull request. Explicit enough to recover reality."
          opacity={bridge}
        />
        <div
          style={{
            position: "absolute",
            left: editorial.safe.left,
            right: editorial.safe.right,
            top: 330,
            display: "grid",
            gap: 14,
          }}
        >
          {contractItems.map(([number, label, question], index) => {
            const reveal = progress(
              time,
              activationTimes[index],
              activationTimes[index] + 0.58,
            );
            return (
              <div
                key={label}
                style={{
                  minHeight: 92,
                  display: "grid",
                  gridTemplateColumns: "86px 430px 1fr",
                  alignItems: "center",
                  padding: "0 28px",
                  boxSizing: "border-box",
                  backgroundColor:
                    reveal > 0.01 ? editorial.color.surfaceStrong : editorial.color.surface,
                  border: `1px solid ${
                    reveal > 0.01 ? editorial.color.signal : editorial.color.lineStrong
                  }`,
                  borderRadius: editorial.radius,
                  opacity: 0.42 + reveal * 0.58,
                  transform: `translateX(${(1 - reveal) * 10}px)`,
                }}
              >
                <span
                  style={{
                    color: reveal > 0.01 ? editorial.color.signal : editorial.color.quiet,
                    fontSize: 20,
                    fontWeight: 820,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {number}
                </span>
                <span style={{ color: editorial.color.text, fontSize: 24, fontWeight: 790 }}>
                  {label}
                </span>
                <span style={{ color: editorial.color.muted, fontSize: 21, fontWeight: 560 }}>
                  {question}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <EditorialStatement
        eyebrow="COST DOES NOT DISAPPEAR"
        title={
          <>
            IMPLEMENTATION <span style={{ color: editorial.color.signal }}>↓</span>
            <br />
            CONSEQUENCE <span style={{ color: editorial.color.tension }}>≠ ↓</span>
          </>
        }
        supporting="AI lowers the cost of producing code. It does not lower the cost of a wrong world."
        opacity={costStatement * (1 - costExit)}
        transform={`translateY(${(1 - costStatement) * 14}px)`}
      />
      <EditorialStatement
        eyebrow="BEFORE SHIPPING"
        title={
          <span style={{ fontSize: 78, lineHeight: 1.05, display: "inline-block" }}>
            WHO CAN EXPLAIN WHY—
            <br />
            AND RESTORE THE TRUTH?
          </span>
        }
        supporting="Assume every test passes and the world is still wrong."
        opacity={questionStatement}
        transform={`translateY(${(1 - questionStatement) * 14}px)`}
      />
    </AbsoluteFill>
  );
};

const BrandEndCard: React.FC<{ time: number }> = ({ time }) => {
  if (!isActive(time, scenes.endCard)) return null;
  const local = time - scenes.endCard.start;
  const entry = progress(local, 0, 1.15);
  const rule = progress(local, 0.45, 1.8, easeInOut);
  const exit = progress(local, 5.25, 6, easeInOut);
  const visibility = entry * (1 - exit);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: editorial.color.paper,
        color: editorial.color.ink,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 980,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: visibility,
          transform: `translateY(${(1 - entry) * 14}px)`,
        }}
      >
        <Img
          src={staticFile("authority-boundary/ag-logo.png")}
          style={{ width: 132, height: 132, objectFit: "cover", borderRadius: 12 }}
        />
        <div style={{ marginTop: 30, fontSize: 54, lineHeight: 1, fontWeight: 840 }}>
          Aaron Guo
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 19,
            lineHeight: 1.2,
            fontWeight: 780,
            letterSpacing: 2.2,
            color: theme.graphite,
          }}
        >
          AI-NATIVE BUILDER
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 25,
            lineHeight: 1.2,
            fontWeight: 600,
            color: editorial.color.paperBody,
          }}
        >
          Human-first thinker
        </div>
        <div
          style={{
            marginTop: 44,
            width: 420,
            height: 3,
            backgroundColor: editorial.color.ink,
            transformOrigin: "center center",
            transform: `scaleX(${rule})`,
            boxShadow: `0 10px 30px ${theme.paperShadow}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

type AuthorityBoundaryWindowProps = {
  windowStartSec: number;
  windowEndSec: number;
};

const AuthorityBoundaryWindow: React.FC<AuthorityBoundaryWindowProps> = ({
  windowStartSec,
  windowEndSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const globalTime = windowStartSec + frame / fps;
  const isCover = isActive(globalTime, scenes.hook);
  const isEndCard = isActive(globalTime, scenes.endCard);
  const audioTrimAfterSec = Math.min(windowEndSec, AUTHORITY_BOUNDARY_AUDIO_END_SEC);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: editorial.color.canvas,
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "hidden",
      }}
    >
      {windowStartSec < AUTHORITY_BOUNDARY_AUDIO_END_SEC ? (
        <Audio
          src={staticFile("authority-boundary/narration.mp3")}
          trimBefore={Math.floor(windowStartSec * fps)}
          trimAfter={Math.ceil(audioTrimAfterSec * fps)}
        />
      ) : null}
      <AbsoluteFill>
        <FieldBackdrop />
        <CoverScene time={globalTime} />
        <DebateScene time={globalTime} />
        <StatusScene time={globalTime} />
        <RollbackScene time={globalTime} />
        <EvidenceScene time={globalTime} />
        <LadderScene time={globalTime} />
        <ObjectionScene time={globalTime} />
        <ReleaseScene time={globalTime} />
        <BrandEndCard time={globalTime} />
        <FrameChrome time={globalTime} hidden={isCover || isEndCard} />
        <PhraseCaption time={globalTime} hidden={isEndCard} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const AuthorityBoundaryCorePrototype: React.FC = () => (
  <AuthorityBoundaryWindow
    windowStartSec={AUTHORITY_BOUNDARY_CORE_START_SEC}
    windowEndSec={AUTHORITY_BOUNDARY_CORE_END_SEC}
  />
);

export const AuthorityBoundaryContractPrototype: React.FC = () => (
  <AuthorityBoundaryWindow
    windowStartSec={AUTHORITY_BOUNDARY_CONTRACT_START_SEC}
    windowEndSec={AUTHORITY_BOUNDARY_CONTRACT_END_SEC}
  />
);

export const AuthorityBoundaryFullFilm: React.FC = () => (
  <AuthorityBoundaryWindow windowStartSec={0} windowEndSec={AUTHORITY_BOUNDARY_FULL_END_SEC} />
);
