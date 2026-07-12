import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { buildCaptionSegments } from "./components/WordCaption";
import {
  fdeFullBaseSegments,
  fdeFullWordTimings,
} from "./data/fdeFullWordTimings";
import { fdeFullWordTimingsV5 } from "./data/fdeFullWordTimingsV5";
import {
  dependentReveal,
  editorial,
  editorialMotionBounds,
  FlowNode,
  FrameworkCard,
  informationalPlaneTurn,
  OutcomeBand,
  SceneHeader,
  signalWithAlpha,
} from "./editorial/EditorialMotionSystem";
import {
  editorialLayouts,
  EditorialMediaSplit,
  EditorialStatement,
  layoutStyle,
} from "./editorial/EditorialLayoutEngine";

export const FDE_FULL_FILM_FPS = 30;
export const FDE_FULL_FILM_SPEECH_RATE = 1.04;

const narrationOffsetSec = 2.5;
const finalTailSec = 1.2;

const retimeBase = (time: number): number =>
  time <= narrationOffsetSec
    ? time
    : narrationOffsetSec +
      (time - narrationOffsetSec) / FDE_FULL_FILM_SPEECH_RATE;

const sceneRange = (id: keyof typeof fdeFullBaseSegments) => ({
  start: retimeBase(fdeFullBaseSegments[id].start),
  end: retimeBase(fdeFullBaseSegments[id].end),
});

const scenes = {
  prelude: { start: 0, end: narrationOffsetSec },
  hook: sceneRange("hook"),
  deployment: sceneRange("deployment"),
  factory: sceneRange("factory"),
  backprop: sceneRange("backprop"),
  workflow: sceneRange("workflow"),
  comparison: sceneRange("comparison"),
  ownership: sceneRange("ownership"),
  actor: sceneRange("actor"),
  tokens: sceneRange("tokens"),
} as const;

export const FDE_FULL_FILM_DURATION_SEC = scenes.tokens.end + finalTailSec;

const brandedEndCardExtraSec = 4.2;
export const FDE_FULL_FILM_V5_BRANDED_OUTRO_START_SEC =
  FDE_FULL_FILM_DURATION_SEC - finalTailSec;
export const FDE_FULL_FILM_V5_BRANDED_DURATION_SEC =
  FDE_FULL_FILM_DURATION_SEC + brandedEndCardExtraSec;

export const fdeFullFilmDurationFrames = (
  fps = FDE_FULL_FILM_FPS,
): number => Math.ceil(FDE_FULL_FILM_DURATION_SEC * fps);

export const fdeFullFilmV5BrandedDurationFrames = (
  fps = FDE_FULL_FILM_FPS,
): number => Math.ceil(FDE_FULL_FILM_V5_BRANDED_DURATION_SEC * fps);

const easeOut = Easing.bezier(0.23, 1, 0.32, 1);
const easeInOut = Easing.bezier(0.77, 0, 0.175, 1);

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

const localTime = (time: number, start: number): number =>
  (time - start) * FDE_FULL_FILM_SPEECH_RATE;

const sceneOpacity = (time: number, start: number, end: number): number => {
  const visibleEnd =
    end >= FDE_FULL_FILM_DURATION_SEC - finalTailSec
      ? FDE_FULL_FILM_DURATION_SEC
      : end;
  return time >= start && time < visibleEnd ? 1 : 0;
};

const liftStyle = (
  time: number,
  start: number,
  duration = 0.62,
  distance = 20,
): React.CSSProperties => {
  const reveal = progress(time, start, start + duration);
  return {
    opacity: reveal,
    transform: `translateY(${(1 - reveal) * distance}px)`,
  };
};

const stageOpacity = (
  local: number,
  enterStart: number,
  enterEnd: number,
  exitStart?: number,
  exitEnd?: number,
): number => {
  const enter = progress(local, enterStart, enterEnd);
  if (exitStart == null || exitEnd == null) return enter;
  return Math.min(enter, 1 - progress(local, exitStart, exitEnd, easeInOut));
};

const sectionForTime = (time: number): string => {
  if (time < scenes.hook.end) return "01 / SIGNAL";
  if (time < scenes.deployment.end) return "02 / SYSTEM";
  if (time < scenes.factory.end) return "03 / DECISION";
  if (time < scenes.backprop.end) return "04 / LEARNING";
  if (time < scenes.workflow.end) return "05 / PRACTICE";
  if (time < scenes.comparison.end) return "06 / MODEL";
  if (time < scenes.ownership.end) return "07 / OWNERSHIP";
  if (time < scenes.actor.end) return "08 / FRAMEWORK";
  return "09 / OUTCOME";
};

const formatFilmTime = (time: number): string => {
  const wholeSeconds = Math.floor(Math.min(time, FDE_FULL_FILM_DURATION_SEC));
  const minutes = Math.floor(wholeSeconds / 60);
  const seconds = wholeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const musicVolume = (frame: number): number => {
  const time = frame / FDE_FULL_FILM_FPS;
  if (time < 2.15) return 0.72;
  if (time < 3.15) {
    return interpolate(time, [2.15, 3.15], [0.72, 0.11], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  if (time >= scenes.actor.start && time < scenes.tokens.start) return 0.14;
  if (time < FDE_FULL_FILM_DURATION_SEC - 5) return 0.11;
  return interpolate(
    time,
    [FDE_FULL_FILM_DURATION_SEC - 5, FDE_FULL_FILM_DURATION_SEC],
    [0.12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
};

const FieldBackdrop: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: editorial.color.canvas }}>
    <AbsoluteFill
      style={{
        opacity: 0.12,
        backgroundImage: `linear-gradient(${editorial.color.grid} 1px, transparent 1px), linear-gradient(90deg, ${editorial.color.grid} 1px, transparent 1px)`,
        backgroundSize: "128px 128px",
      }}
    />
  </AbsoluteFill>
);

const FrameChrome: React.FC<{ time: number; hidden?: boolean }> = ({
  time,
  hidden = false,
}) => {
  if (hidden || time < scenes.hook.start) return null;
  const route = progress(time, 0, FDE_FULL_FILM_DURATION_SEC, easeInOut);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 42,
          left: 86,
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: 620,
          fontSize: 16,
          fontWeight: 700,
          whiteSpace: "nowrap",
          zIndex: 100,
        }}
      >
        <span
          style={{
            display: "block",
            width: 8,
            height: 8,
            backgroundColor: editorial.color.signal,
          }}
        />
        <span style={{ color: editorial.color.signal, flexShrink: 0 }}>
          AARON GUO
        </span>
        <span
          style={{
            width: 1,
            height: 16,
            backgroundColor: editorial.color.lineStrong,
          }}
        />
        <span style={{ color: editorial.color.muted }}>
          {sectionForTime(time)}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 45,
          right: 86,
          width: 312,
          display: "flex",
          alignItems: "center",
          gap: 14,
          color: editorial.color.muted,
          fontSize: 16,
          fontVariantNumeric: "tabular-nums",
          zIndex: 100,
        }}
      >
        <div
          style={{
            width: 238,
            height: 2,
            backgroundColor: editorial.color.line,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${route * 100}%`,
              backgroundColor: editorial.color.signal,
            }}
          />
        </div>
        <span>
          {formatFilmTime(time)}
        </span>
      </div>
    </>
  );
};

type PaperCardProps = {
  eyebrow: string;
  title: string;
  note?: string;
  width?: number;
  height?: number;
  opacity?: number;
  transform?: string;
};

const PaperCard: React.FC<PaperCardProps> = ({
  eyebrow,
  title,
  note,
  width = 320,
  height = 220,
  opacity = 1,
  transform,
}) => (
  <div
    style={{
      width,
      height,
      padding: "26px 28px",
      boxSizing: "border-box",
      backgroundColor: editorial.color.paper,
      color: editorial.color.ink,
      borderRadius: editorial.radius,
      opacity,
      transform,
      boxShadow: `0 28px 70px ${editorial.color.shadowSoft}`,
    }}
  >
    <div
      style={{
        color: editorial.color.paperMuted,
        fontSize: editorial.type.micro,
        fontWeight: 760,
        textTransform: "uppercase",
      }}
    >
      {eyebrow}
    </div>
    <div
      style={{
        marginTop: 40,
        fontSize: 40,
        lineHeight: 1.02,
        fontWeight: 810,
      }}
    >
      {title}
    </div>
    {note ? (
      <div
        style={{
          marginTop: 18,
          color: editorial.color.paperBody,
          fontSize: 20,
          lineHeight: 1.3,
          fontWeight: 620,
        }}
      >
        {note}
      </div>
    ) : null}
  </div>
);

const DarkPanel: React.FC<{
  eyebrow: string;
  title: string;
  note?: string;
  tone?: "signal" | "tension" | "neutral";
  opacity?: number;
}> = ({ eyebrow, title, note, tone = "neutral", opacity = 1 }) => {
  const border =
    tone === "signal"
      ? editorial.color.signal
      : tone === "tension"
        ? editorial.color.tension
        : editorial.color.lineStrong;
  return (
    <div
      style={{
        height: "100%",
        padding: "26px 28px",
        boxSizing: "border-box",
        backgroundColor: editorial.color.surface,
        border: `1px solid ${border}`,
        borderRadius: editorial.radius,
        opacity,
      }}
    >
      <div
        style={{
          color:
            tone === "tension"
              ? editorial.color.tension
              : tone === "signal"
                ? editorial.color.signal
                : editorial.color.muted,
          fontSize: editorial.type.micro,
          fontWeight: 760,
          textTransform: "uppercase",
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          marginTop: 24,
          color: editorial.color.text,
          fontSize: 34,
          lineHeight: 1.08,
          fontWeight: 760,
        }}
      >
        {title}
      </div>
      {note ? (
        <div
          style={{
            marginTop: 18,
            color: editorial.color.muted,
            fontSize: 21,
            lineHeight: 1.35,
          }}
        >
          {note}
        </div>
      ) : null}
    </div>
  );
};

const PreludeScene: React.FC<{ time: number }> = ({ time }) => {
  const layout = editorialLayouts["cover-hero"].slots;
  const exit = progress(time, 1.98, 2.48, easeInOut);
  return (
    <AbsoluteFill
      style={{ opacity: sceneOpacity(time, scenes.prelude.start, scenes.prelude.end) }}
    >
      <Img
        src={staticFile("fde-v5/cover-hero.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 1 - exit,
          transform: `scale(${1 + time * 0.012})`,
          transformOrigin: "center center",
        }}
      />
      <div
        style={{
          ...layoutStyle(layout.brand.rect),
          display: "flex",
          alignItems: "center",
          gap: 16,
          color: editorial.color.ink,
          opacity: 1 - exit,
          letterSpacing: 0,
          padding: "8px 14px 8px 8px",
          boxSizing: "border-box",
          backgroundColor: "rgba(250, 248, 240, 0.82)",
          border: "1px solid rgba(17, 20, 17, 0.12)",
        }}
      >
        <div
          style={{
            width: 66,
            height: 66,
            flexShrink: 0,
            overflow: "hidden",
            borderRadius: 17,
            border: "1px solid rgba(17, 20, 17, 0.16)",
            boxShadow: "0 10px 26px rgba(17, 20, 17, 0.14)",
          }}
        >
          <Img
            src={staticFile("fde-v5/aaron-brand-tile.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 820,
              lineHeight: 1,
            }}
          >
            AARON GUO
          </div>
          <div
            style={{
              color: "rgba(17, 20, 17, 0.72)",
              fontSize: 16,
              fontWeight: 720,
              lineHeight: 1.2,
            }}
          >
            AI-NATIVE BUILDER · HUMAN-FIRST THINKER
          </div>
        </div>
      </div>
      <div
        style={{
          ...layoutStyle(layout.title.rect),
          color: editorial.color.ink,
          fontSize: 92,
          lineHeight: 0.9,
          fontWeight: 860,
          opacity: 1 - exit,
        }}
      >
        <div>Expensive Tokens</div>
        <div>Won&apos;t Save</div>
        <div>Enterprise AI</div>
        <div
          style={{
            marginTop: 28,
            color: editorial.color.paperBody,
            fontSize: 30,
            lineHeight: 1.3,
            fontWeight: 700,
          }}
        >
          Forward deployed engineering
        </div>
      </div>
    </AbsoluteFill>
  );
};

const companies = [
  { name: "Anthropic", at: 1.7 },
  { name: "OpenAI", at: 2.8 },
  { name: "AWS", at: 4.2 },
  { name: "Microsoft", at: 5.8 },
];

const PeopleInvestmentHero: React.FC<{ opacity: number }> = ({ opacity }) => {
  const layout = editorialLayouts["people-hero"].slots;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clipPosition = Math.min(39, (frame / fps) * 8);
  const primaryFrame = Math.floor(clipPosition);
  const nextFrame = Math.min(39, primaryFrame + 1);
  const blend = clipPosition - primaryFrame;
  const framePath = (index: number): string =>
    staticFile(`fde-v5/operators-frames/frame-${String(index + 1).padStart(2, "0")}.jpg`);
  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          ...layoutStyle(layout.media.rect),
          overflow: "hidden",
          backgroundColor: editorial.color.surface,
          borderLeft: `3px solid ${editorial.color.signal}`,
          boxShadow: `0 36px 80px ${editorial.color.shadowStrong}`,
        }}
      >
        <Img
          src={framePath(primaryFrame)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {nextFrame !== primaryFrame ? (
          <Img
            src={framePath(nextFrame)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: blend,
            }}
          />
        ) : null}
        <AbsoluteFill style={{ backgroundColor: "rgba(9, 12, 11, 0.08)" }} />
        <div
          style={{
            position: "absolute",
            right: 18,
            bottom: 16,
            color: editorial.color.text,
            fontSize: 14,
            fontWeight: 720,
            textTransform: "uppercase",
            padding: "8px 10px",
            backgroundColor: "rgba(9, 12, 11, 0.72)",
          }}
        >
          Conceptual operations scene
        </div>
      </div>
      <div
        style={{
          ...layoutStyle(layout.copy.rect),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: editorial.color.signal,
            fontSize: editorial.type.label,
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          The missing layer
        </div>
        <div
          style={{
            marginTop: 22,
            color: editorial.color.text,
            fontSize: 76,
            lineHeight: 0.94,
            fontWeight: 850,
          }}
        >
          Why spend billions on people?
        </div>
        <div
          style={{
            marginTop: 28,
            maxWidth: 520,
            color: editorial.color.muted,
            fontSize: 26,
            lineHeight: 1.32,
            fontWeight: 590,
          }}
        >
          The investment is in deployment capacity: people who can turn a model into changed work.
        </div>
      </div>
      <div
        style={{
          ...layoutStyle(layout.roles.rect),
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
          alignItems: "end",
        }}
      >
        {["Operations", "Engineering", "Data", "Approvals"].map((role) => (
          <div
            key={role}
            style={{
              paddingTop: 12,
              borderTop: `1px solid ${editorial.color.lineStrong}`,
              color: editorial.color.text,
              fontSize: 15,
              fontWeight: 720,
              textTransform: "uppercase",
            }}
          >
            {role}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const HookScene: React.FC<{ time: number }> = ({ time }) => {
  const local = localTime(time, scenes.hook.start);
  const compact = progress(local, 19.8, 21.0, easeInOut);
  const companyExit = progress(local, 21.3, 21.9, easeInOut);
  const amount = progress(local, 12.8, 14.0);
  const question = progress(local, 22.0, 22.7, easeInOut);
  const converge = progress(local, 8.8, 12.0, easeInOut);
  const peopleStart = scenes.hook.start + 21.8 / FDE_FULL_FILM_SPEECH_RATE;
  const peopleDuration = scenes.hook.end - peopleStart;

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity(time, scenes.hook.start, scenes.hook.end) }}>
      <SceneHeader
        eyebrow="59 days"
        title="Four companies. One move."
        aside="Engineers closer to customer operations."
        opacity={progress(local, 0, 0.55) * (1 - question)}
      />
      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          top: 300 - compact * 24,
          width: editorial.safe.width,
          height: 260,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          transform: `scale(${1 - compact * 0.22})`,
          transformOrigin: "center top",
          opacity: (1 - compact * 0.45) * (1 - companyExit),
        }}
      >
        {companies.map((company, index) => {
          const reveal = progress(local, company.at, company.at + 0.7);
          return (
            <div
              key={company.name}
              style={{
                height: 224,
                padding: "28px 28px",
                boxSizing: "border-box",
                backgroundColor: editorial.color.surface,
                border: `1px solid ${editorial.color.lineStrong}`,
                borderTop: `5px solid ${editorial.color.signal}`,
                borderRadius: editorial.radius,
                opacity: 0.28 + reveal * 0.72,
                transform: `translateY(${(1 - reveal) * 12}px)`,
              }}
            >
              <div
                style={{
                  color: editorial.color.quiet,
                  fontSize: editorial.type.micro,
                  fontWeight: 740,
                }}
              >
                SIGNAL 0{index + 1} / 04
              </div>
              <div
                style={{
                  marginTop: 58,
                  color: editorial.color.text,
                  fontSize: 40,
                  fontWeight: 790,
                }}
              >
                {company.name}
              </div>
            </div>
          );
        })}
      </div>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, opacity: (1 - compact) * (1 - companyExit) }}
      >
        {[286, 698, 1110, 1522].map((x) => (
          <path
            key={x}
            d={`M ${x} 548 C ${x} 650 870 650 960 724`}
            fill="none"
            stroke={editorial.color.signal}
            strokeWidth="3"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - converge}
            opacity={0.72}
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 630,
          top: 694,
          width: 660,
          height: 92,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: editorial.color.signalDark,
          border: `1px solid ${editorial.color.signal}`,
          color: editorial.color.text,
          fontSize: 28,
          fontWeight: 760,
          textTransform: "uppercase",
          opacity: converge * (1 - compact) * (1 - companyExit),
        }}
      >
        Engineers closer to customers
      </div>
      <div
        style={{
          position: "absolute",
          left: 1420,
          top: 650,
          width: 360,
          textAlign: "right",
          opacity: amount * (1 - compact) * (1 - companyExit),
        }}
      >
        <div
          style={{
            color: editorial.color.signal,
            fontSize: 76,
            lineHeight: 1,
            fontWeight: 840,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          $7.5B+
        </div>
        <div
          style={{
            marginTop: 12,
            color: editorial.color.muted,
            fontSize: 20,
            lineHeight: 1.3,
          }}
        >
          Different commitments. One scale signal.
        </div>
      </div>
      <Sequence
        from={Math.round(peopleStart * FDE_FULL_FILM_FPS)}
        durationInFrames={Math.ceil(peopleDuration * FDE_FULL_FILM_FPS)}
      >
        <PeopleInvestmentHero opacity={question} />
      </Sequence>
    </AbsoluteFill>
  );
};

const deploymentLayers = [
  { label: "Data", at: 31.1 },
  { label: "Permissions", at: 33.2 },
  { label: "Approvals", at: 35.4 },
  { label: "Recovery", at: 39.4 },
  { label: "Responsibility", at: 42.0 },
];

const DeploymentScene: React.FC<{ time: number }> = ({ time }) => {
  const local = localTime(time, scenes.deployment.start);
  const systemPhase = progress(local, 24.8, 26.2, easeInOut);
  const scaleSignal = progress(local, 12.4, 14.0);
  const sharedPriority = progress(local, 19.5, 22.8);
  const modelTurn = informationalPlaneTurn(
    progress(local, 30.7, 35.2, easeInOut),
  );
  const operatingPanel = progress(local, 30.9, 34.2);
  const closeGap = progress(local, 45.2, 47.2);
  const stageTop = 306;
  const modelTop = 12;
  const modelHeight = 398;
  const bandTop =
    stageTop +
    modelTop +
    modelHeight +
    editorialMotionBounds.protectedZoneGapPx +
    24;

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity(time, scenes.deployment.start, scenes.deployment.end),
      }}
    >
      <SceneHeader
        eyebrow="A scale signal"
        title="The numbers are not a clean comparison."
        aside="The shared priority is deployment capacity."
        titleSize={58}
        opacity={progress(local, 0, 0.52) * (1 - systemPhase)}
      />
      <SceneHeader
        eyebrow="The deployment clue"
        title="A model is not a working system."
        aside="The operating work lives behind the surface."
        opacity={systemPhase}
        transform={`translateY(${(1 - systemPhase) * 16}px)`}
      />

      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          top: 310,
          width: editorial.safe.width,
          height: 470,
          display: "grid",
          gridTemplateColumns: "700px 1fr",
          gap: 80,
          opacity: 1 - systemPhase,
          transform: `translateY(${-systemPhase * 16}px)`,
        }}
      >
        <div
          style={{
            padding: "46px 52px",
            boxSizing: "border-box",
            backgroundColor: editorial.color.surface,
            border: `1px solid ${editorial.color.lineStrong}`,
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
            Combined signal
          </div>
          <div
            style={{
              marginTop: 48,
              color: editorial.color.text,
              fontSize: 126,
              lineHeight: 0.92,
              fontWeight: 850,
              opacity: 0.34 + scaleSignal * 0.66,
              transform: `translateY(${(1 - scaleSignal) * 16}px)`,
            }}
          >
            $7.5B+
          </div>
          <div
            style={{
              marginTop: 32,
              color: editorial.color.signal,
              fontSize: 27,
              lineHeight: 1.3,
              fontWeight: 720,
            }}
          >
            Scale signal, not a single accounting category.
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateRows: "repeat(3, 1fr)", gap: 14 }}>
          {[
            ["OpenAI", "Investment in a new company"],
            ["AWS", "Organizational commitment"],
            ["Microsoft", "Organizational commitment"],
          ].map(([name, description], index) => {
            const reveal = progress(local, 2.8 + index * 3.8, 3.6 + index * 3.8);
            return (
              <div
                key={name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "210px 1fr",
                  alignItems: "center",
                  padding: "0 34px",
                  backgroundColor: editorial.color.surface,
                  borderLeft: `4px solid ${
                    index === 0 ? editorial.color.tension : editorial.color.signal
                  }`,
                  opacity: 0.26 + reveal * 0.74,
                  transform: `translateX(${(1 - reveal) * 18}px)`,
                }}
              >
                <span
                  style={{
                    color: editorial.color.text,
                    fontSize: 29,
                    fontWeight: 770,
                  }}
                >
                  {name}
                </span>
                <span
                  style={{
                    color: editorial.color.muted,
                    fontSize: 23,
                    lineHeight: 1.25,
                  }}
                >
                  {description}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 500,
          right: 500,
          top: 824,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTop: `2px solid ${editorial.color.signal}`,
          color: editorial.color.text,
          fontSize: 25,
          fontWeight: 730,
          opacity: sharedPriority * (1 - systemPhase),
        }}
      >
        Different commitments. One deployment priority.
      </div>

      <div
        style={{
          position: "absolute",
          left: 126,
          top: stageTop,
          width: 1670,
          height: 438,
          perspective: 1600,
          transformStyle: "preserve-3d",
          opacity: systemPhase,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 630,
            top: 10,
            width: 862,
            height: 408,
            padding: "38px 44px",
            boxSizing: "border-box",
            backgroundColor: editorial.color.surface,
            border: `1px solid ${signalWithAlpha(0.22 + operatingPanel * 0.5)}`,
            borderRadius: editorial.radius,
            opacity: operatingPanel,
            transform: `translateX(${(1 - operatingPanel) * -54}px)`,
          }}
        >
          <div
            style={{
              color: editorial.color.signal,
              fontSize: editorial.type.label,
              fontWeight: 760,
              textTransform: "uppercase",
            }}
          >
            Operating layer
          </div>
          <div
            style={{
              marginTop: 30,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: 42,
            }}
          >
            {deploymentLayers.map((layer, index) => {
              const reveal = progress(local, layer.at, layer.at + 0.68);
              return (
                <div
                  key={layer.label}
                  style={{
                    minHeight: 88,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    borderTop: `1px solid ${editorial.color.lineStrong}`,
                    opacity: 0.22 + reveal * 0.78,
                    transform: `translateX(${(1 - reveal) * 16}px)`,
                  }}
                >
                  <span
                    style={{
                      color: editorial.color.signal,
                      fontSize: editorial.type.micro,
                      fontWeight: 760,
                    }}
                  >
                    0{index + 1}
                  </span>
                  <span
                    style={{
                      color: editorial.color.text,
                      fontSize: 26,
                      fontWeight: 690,
                    }}
                  >
                    {layer.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 176,
            top: modelTop,
            width: 480,
            height: modelHeight,
            padding: "36px 40px",
            boxSizing: "border-box",
            backgroundColor: editorial.color.paper,
            color: editorial.color.ink,
            borderRadius: editorial.radius,
            transformOrigin: "left center",
            transform: modelTurn.transform,
            boxShadow: `0 42px 90px ${editorial.color.shadowStrong}`,
          }}
        >
          <div
            style={{
              color: editorial.color.paperMuted,
              fontSize: 18,
              fontWeight: 720,
            }}
          >
            MODEL LAYER
          </div>
          <div
            style={{
              marginTop: 62,
              fontSize: 88,
              fontWeight: 840,
              lineHeight: 0.95,
            }}
          >
            AI
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 29,
              fontWeight: 640,
              color: editorial.color.paperBody,
            }}
          >
            Capability through an API
          </div>
          <div
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              bottom: 34,
              height: 7,
              backgroundColor: editorial.color.signal,
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          right: editorial.safe.right,
          top: bandTop,
          display: "grid",
          gridTemplateColumns: "230px 1fr 420px",
          alignItems: "center",
          gap: 24,
          opacity: closeGap * systemPhase,
          transform: `translateY(${(1 - closeGap) * 16}px)`,
        }}
      >
        <span
          style={{
            color: editorial.color.tension,
            fontSize: 22,
            fontWeight: 780,
          }}
        >
          DEPLOYMENT GAP
        </span>
        <span style={{ height: 2, backgroundColor: editorial.color.tension }} />
        <span
          style={{
            color: editorial.color.text,
            fontSize: 31,
            fontWeight: 680,
            textAlign: "right",
          }}
        >
          Intelligence -&gt; operations
        </span>
      </div>
    </AbsoluteFill>
  );
};

const fragmentedSystems = [
  { label: "Supplier data", note: "ERP", x: 130, at: 3.8 },
  { label: "Production capacity", note: "MES", x: 575, at: 7.1 },
  { label: "Customer orders", note: "CRM", x: 1020, at: 10.2 },
  { label: "Approval knowledge", note: "People", x: 1465, at: 13.1 },
];

const FactoryScene: React.FC<{ time: number }> = ({ time }) => {
  const local = localTime(time, scenes.factory.start);
  const decisionLayout = editorialLayouts["decision-row"].slots;
  const factoryEstablishing = stageOpacity(local, 0, 0.35, 4.7, 5.2);
  const factorySystem = progress(local, 5.2, 5.8, easeInOut);
  const governed = progress(local, 21.4, 22.8, easeInOut);
  const supplierShock = progress(local, 0, 1.0);
  const chatbot = progress(local, 18.5, 20.0);
  const connect = progress(local, 31.6, 45.0, easeInOut);
  const endpoint = dependentReveal(connect, 0.96);
  const result = progress(local, 50.2, 51.2);

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity(time, scenes.factory.start, scenes.factory.end) }}>
      <AbsoluteFill style={{ opacity: factoryEstablishing }}>
        <Img
          src={staticFile("fde-v4/factory-establishing-fallback.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.56 }}
        />
        <AbsoluteFill style={{ backgroundColor: "rgba(9, 12, 11, 0.38)" }} />
        <div
          style={{
            position: "absolute",
            left: editorial.safe.left,
            top: 812,
            color: editorial.color.text,
            fontSize: editorial.type.micro,
            fontWeight: 720,
            textTransform: "uppercase",
            padding: "10px 12px",
            backgroundColor: "rgba(9, 12, 11, 0.82)",
          }}
        >
          Conceptual factory operations scene
        </div>
      </AbsoluteFill>
      <SceneHeader
        eyebrow="Inside the factory"
        title="A critical supplier disappears."
        aside="The information is real. It is not organized for action."
        opacity={progress(local, 0, 0.52) * (1 - governed)}
      />
      <SceneHeader
        eyebrow="The useful question"
        title="Which decision must the system support?"
        titleSize={58}
        opacity={governed}
        transform={`translateY(${(1 - governed) * 16}px)`}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: (1 - governed) * factorySystem,
          transform: `translateY(${-governed * 18}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 720,
            top: 318,
            width: 480,
            height: 104,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: editorial.color.tensionDark,
            border: `1px solid ${editorial.color.tension}`,
            color: editorial.color.text,
            fontSize: 29,
            fontWeight: 770,
            opacity: supplierShock,
          }}
        >
          CRITICAL SUPPLIER LOST
        </div>
        <div
          style={{
            position: "absolute",
            left: editorial.safe.left,
            top: 510,
            width: editorial.safe.width,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
          }}
        >
          {fragmentedSystems.map((system) => {
            const reveal = progress(local, system.at, system.at + 0.76);
            return (
              <div
                key={system.label}
                style={{
                  height: 178,
                  opacity: 0.24 + reveal * 0.76,
                  transform: `translateY(${(1 - reveal) * 12}px)`,
                }}
              >
                <DarkPanel
                  eyebrow={system.note}
                  title={system.label}
                  tone={system.note === "People" ? "tension" : "neutral"}
                />
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 758,
            width: 640,
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTop: `2px solid ${editorial.color.tension}`,
            color: editorial.color.text,
            fontSize: 30,
            fontWeight: 720,
            opacity: chatbot,
          }}
        >
          "Can we add a chatbot?" is the wrong question.
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: governed }}>
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", inset: 0 }}
        >
          {[512, 944, 1376].map((x) => (
            <path
              key={x}
              d={`M ${x} 406 L ${x + 32} 406`}
              fill="none"
              stroke={editorial.color.signal}
              strokeWidth="4"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={1 - connect}
            />
          ))}
        </svg>
        <div
          style={{
            ...layoutStyle(decisionLayout.nodes.rect),
            display: "grid",
            gridTemplateColumns: "repeat(4, 400px)",
            gap: 32,
            alignItems: "center",
          }}
        >
          <FlowNode label="Orders at risk" tone="paper" width={400} height={132} />
          <FlowNode label="Planner options" width={400} height={132} />
          <FlowNode label="Approval authority" tone="signal" width={400} height={132} />
          <FlowNode label="Committed action" tone="signal" width={400} height={132} />
        </div>
        <div
          style={{
            ...layoutStyle(decisionLayout.detail.rect),
            opacity: endpoint,
          }}
        >
          <DarkPanel
            eyebrow="Built from the beginning"
            title="Permissions, exceptions, recovery"
            tone="signal"
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 720,
            top: 280,
            width: 480,
            color: editorial.color.signal,
            fontSize: 20,
            fontWeight: 760,
            textAlign: "center",
            textTransform: "uppercase",
            opacity: progress(local, 31.5, 33.0),
          }}
        >
          FDE + operators
        </div>
        <div
          style={{
            position: "absolute",
            top: decisionLayout.outcome.rect.y,
          }}
        >
          <OutcomeBand
            label="Deployment work"
            left="GENERAL MODEL CAPABILITY"
            right="GOVERNED BUSINESS ACTION"
            opacity={result}
            transform={`translateY(${(1 - result) * 14}px)`}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BackpropScene: React.FC<{ time: number }> = ({ time }) => {
  const local = localTime(time, scenes.backprop.start);
  const failures = progress(local, 12.5, 13.2);
  const loopPhase = progress(local, 20.8, 22.2, easeInOut);
  const question = progress(local, 21.2, 23.2);
  const loop = progress(local, 30.8, 45.2, easeInOut);
  const product = dependentReveal(loop, 0.94);
  const result = progress(local, 46.0, 47.2);

  return (
    <AbsoluteFill
      style={{ opacity: sceneOpacity(time, scenes.backprop.start, scenes.backprop.end) }}
    >
      <SceneHeader
        eyebrow="Palantir's phrase"
        title="Human backpropagation."
        aside="The phrase sounds academic. The job is practical."
        opacity={progress(local, 0, 0.52) * (1 - loopPhase)}
      />
      <SceneHeader
        eyebrow="The compounding question"
        title="Will this failure happen elsewhere?"
        aside="If yes, the lesson returns to the product."
        opacity={loopPhase}
        transform={`translateY(${(1 - loopPhase) * 16}px)`}
      />

      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          top: 332,
          width: editorial.safe.width,
          height: 410,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 28,
          opacity: failures * (1 - loopPhase),
          transform: `translateY(${-loopPhase * 18}px)`,
        }}
      >
        {[
          ["01 / EXCEPTION", "Planner finds an exception", 12.9],
          ["02 / DATA", "A source arrives late", 15.2],
          ["03 / APPROVAL", "The wrong person is blocked", 17.4],
        ].map(([eyebrow, title, at]) => {
          const reveal = progress(local, Number(at), Number(at) + 0.72);
          return (
            <div
              key={String(eyebrow)}
              style={{
                opacity: 0.22 + reveal * 0.78,
                transform: `translateY(${(1 - reveal) * 14}px)`,
              }}
            >
              <DarkPanel
                eyebrow={String(eyebrow)}
                title={String(title)}
                note="A local failure is field evidence."
                tone="tension"
              />
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: loopPhase }}>
        <div
          style={{
            position: "absolute",
            left: 180,
            top: 380,
            width: 1560,
            display: "grid",
            gridTemplateColumns: "280px 280px 280px 320px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FlowNode label="Field failure" tone="tension" width={280} height={126} />
          <FlowNode label="Local fix" width={280} height={126} />
          <FlowNode label="Repeated pattern?" width={280} height={126} />
          <FlowNode
            label="Reusable product primitive"
            tone="signal"
            width={320}
            height={126}
            opacity={0.24 + product * 0.76}
          />
        </div>
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", inset: 0 }}
        >
          <path
            d="M 460 443 L 610 443 M 890 443 L 1040 443 M 1320 443 L 1420 443"
            fill="none"
            stroke={editorial.color.signal}
            strokeWidth="4"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - loop}
          />
          <path
            d="M 1580 516 C 1580 682 1340 702 1110 702 L 510 702 C 330 702 290 632 330 540"
            fill="none"
            stroke={editorial.color.lineStrong}
            strokeWidth="2"
          />
          <path
            d="M 1580 516 C 1580 682 1340 702 1110 702 L 510 702 C 330 702 290 632 330 540"
            fill="none"
            stroke={editorial.color.signal}
            strokeWidth="4"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - loop}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 680,
            top: 580,
            width: 560,
            textAlign: "center",
            color: editorial.color.text,
            fontSize: 30,
            lineHeight: 1.25,
            fontWeight: 720,
            opacity: question,
          }}
        >
          Fix the customer now.
          <br />
          Improve the next deployment too.
        </div>
        <div style={{ position: "absolute", top: 810 }}>
          <OutcomeBand
            label="What compounds?"
            left="ENDLESS CUSTOM SERVICE"
            right="FIELD LEARNING -> PRODUCT"
            opacity={result}
            transform={`translateY(${(1 - result) * 14}px)`}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const workflowSteps = [
  "Research",
  "Outline",
  "Write",
  "Translate",
  "Images",
  "Audio",
  "Video",
  "Publish",
];

const WorkflowScene: React.FC<{ time: number }> = ({ time }) => {
  const local = localTime(time, scenes.workflow.start);
  const layout = editorialLayouts["workflow-gates"].slots;
  const pipeline = progress(local, 12.0, 14.0);
  const myth = stageOpacity(local, 0, 0.8, 11.2, 12.4);
  const failures = progress(local, 23.6, 25.0);
  const gatesPhase = progress(local, 32.4, 33.8, easeInOut);
  const gateReveal = progress(local, 33.1, 49.8, easeInOut);
  const pattern = progress(local, 56.8, 58.2);
  const pipelineTop = interpolate(
    gatesPhase,
    [0, 1],
    [360, layout.workflowRail.rect.y],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut },
  );
  const pipelineHeight = interpolate(
    gatesPhase,
    [0, 1],
    [138, layout.workflowRail.rect.height],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut },
  );
  const pipelinePadding = interpolate(gatesPhase, [0, 1], [22, 14]);
  const pipelineTitleMargin = interpolate(gatesPhase, [0, 1], [30, 13]);

  return (
    <AbsoluteFill
      style={{ opacity: sceneOpacity(time, scenes.workflow.start, scenes.workflow.end) }}
    >
      <SceneHeader
        eyebrow="A smaller observable system"
        title="Five minutes can generate a draft."
        aside="It cannot generate a production workflow."
        opacity={progress(local, 0, 0.52) * (1 - gatesPhase)}
      />
      <SceneHeader
        eyebrow="Workflow V2"
        title="Participation becomes infrastructure."
        aside="Judgment turns into gates, rules, and validators."
        opacity={gatesPhase}
        transform={`translateY(${(1 - gatesPhase) * 16}px)`}
      />

      <div
        style={{
          position: "absolute",
          left: 330,
          right: 330,
          top: 360,
          textAlign: "center",
          opacity: myth,
        }}
      >
        <div
          style={{
            color: editorial.color.text,
            fontSize: 150,
            lineHeight: 0.9,
            fontWeight: 850,
          }}
        >
          5 MINUTES
        </div>
        <div
          style={{
            marginTop: 36,
            color: editorial.color.tension,
            fontSize: 34,
            fontWeight: 760,
          }}
        >
          The missing work is hidden, not eliminated.
        </div>
      </div>

      <div
        style={{
          ...layoutStyle(layout.workflowRail.rect),
          top: pipelineTop,
          height: pipelineHeight,
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: 12,
          opacity: pipeline * (1 - gatesPhase * 0.55),
          transform: `scale(${1 - gatesPhase * 0.12})`,
          transformOrigin: "center top",
        }}
      >
        {workflowSteps.map((step, index) => {
          const reveal = progress(local, 12.2 + index * 0.7, 12.8 + index * 0.7);
          return (
            <div
              key={step}
              style={{
                height: pipelineHeight,
                padding: `${pipelinePadding}px 16px`,
                boxSizing: "border-box",
                backgroundColor: editorial.color.surface,
                borderTop: `4px solid ${editorial.color.signal}`,
                opacity: 0.2 + reveal * 0.8,
              }}
            >
              <div
                style={{
                  color: editorial.color.quiet,
                  fontSize: 14,
                  fontWeight: 760,
                }}
              >
                0{index + 1}
              </div>
              <div
                style={{
                  marginTop: pipelineTitleMargin,
                  color: editorial.color.text,
                  fontSize: interpolate(gatesPhase, [0, 1], [21, 18]),
                  fontWeight: 720,
                }}
              >
                {step}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          top: 560,
          width: editorial.safe.width,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 18,
          opacity: failures * (1 - gatesPhase),
        }}
      >
        {["Weak evidence", "Awkward language", "Repeated visuals", "Broken links"].map(
          (failure) => (
            <div
              key={failure}
              style={{
                height: 88,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: editorial.color.tensionDark,
                border: `1px solid ${editorial.color.tension}`,
                color: editorial.color.text,
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {failure}
            </div>
          ),
        )}
      </div>

      <div
        style={{
          ...layoutStyle(layout.gates.rect),
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 20,
          opacity: gatesPhase,
        }}
      >
        {[
          ["Evidence", "Challenge the claim"],
          ["Argument", "Reject weak logic"],
          ["Language", "Read it again"],
          ["Visual", "Compare directions"],
          ["Package", "Validate the whole"],
        ].map(([label, note], index) => {
          const reveal = progress(
            gateReveal,
            index * 0.2,
            Math.min(1, index * 0.2 + 0.22),
          );
          return (
            <div
              key={label}
              style={{
                opacity: 0.22 + reveal * 0.78,
                transform: `translateY(${(1 - reveal) * 12}px)`,
              }}
            >
              <DarkPanel
                eyebrow={`GATE 0${index + 1}`}
                title={label}
                note={note}
                tone="signal"
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          ...layoutStyle(layout.pattern.rect),
          display: "grid",
          gridTemplateColumns: "1fr 80px 1fr 80px 1fr",
          alignItems: "center",
          opacity: pattern,
        }}
      >
        {[
          "Stay close to real work",
          "->",
          "Find what capability misses",
          "->",
          "Write correction back",
        ].map((item, index) => (
          <div
            key={`${item}-${index}`}
            style={{
              color:
                item === "->" ? editorial.color.signal : editorial.color.text,
              fontSize: item === "->" ? 34 : 24,
              lineHeight: 1.25,
              fontWeight: item === "->" ? 800 : 700,
              textAlign: "center",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const ComparisonScene: React.FC<{ time: number }> = ({ time }) => {
  const local = localTime(time, scenes.comparison.start);
  const layout = editorialLayouts["split-loop"].slots;
  // The statement owns the stage between the first comparison and the split
  // view. Keeping these windows disjoint prevents a dense cross-fade.
  const distinction = progress(local, 20.0, 20.9, easeInOut);
  const statement = stageOpacity(local, 21.1, 21.8, 24.8, 25.5);
  const comparisonReveal = progress(local, 25.5, 26.3, easeInOut);
  const shared = progress(local, 5.0, 16.2, easeInOut);
  const handoff = progress(local, 32.8, 41.8, easeInOut);
  const loop = progress(local, 27.0, 48.6, easeInOut);
  // Each node becomes active immediately after the travelling path reaches it.
  // `dependentReveal` is intentionally endpoint-oriented, so it is not the
  // right primitive for a path with several intermediate destinations.
  const productionReveal = progress(loop, 0.0, 0.025);
  const learningReveal = progress(loop, 0.14, 0.2);
  const productReveal = progress(loop, 0.48, 0.54);
  const outcome = progress(local, 43.2, 44.4);

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity(time, scenes.comparison.start, scenes.comparison.end),
      }}
    >
      <SceneHeader
        eyebrow="Do not build a straw man"
        title="FDE is not consulting with a new label."
        aside="Good consultants already understand complex work."
        opacity={progress(local, 0, 0.52) * (1 - distinction)}
      />
      <EditorialStatement
        eyebrow="The useful distinction"
        title="What compounds after the engagement?"
        supporting="Production and product learning change the model."
        opacity={statement}
        transform={`translateY(${(1 - statement) * 18}px)`}
      />

      <div
        style={{
          ...layoutStyle(layout.comparison.rect),
          height: 478,
          opacity: 1 - distinction,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 28,
          }}
        >
          <div
            style={{
              height: 94,
              display: "flex",
              alignItems: "center",
              padding: "0 30px",
              backgroundColor: editorial.color.surface,
              borderTop: `4px solid ${editorial.color.muted}`,
              color: editorial.color.text,
              fontSize: 32,
              fontWeight: 770,
            }}
          >
            Consulting and systems integration
          </div>
          <div
            style={{
              height: 94,
              display: "flex",
              alignItems: "center",
              padding: "0 30px",
              backgroundColor: editorial.color.surface,
              borderTop: `4px solid ${editorial.color.signal}`,
              color: editorial.color.text,
              fontSize: 32,
              fontWeight: 770,
            }}
          >
            Forward deployed engineering
          </div>
        </div>
        <div
          style={{
            marginTop: 34,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
          }}
        >
          {["Workflow", "Change", "Regulation", "Transformation"].map(
            (skill, index) => {
              const reveal = progress(shared, index * 0.22, index * 0.22 + 0.26);
              return (
                <div
                  key={skill}
                  style={{
                    height: 180,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: editorial.color.surface,
                    border: `1px solid ${editorial.color.lineStrong}`,
                    opacity: 0.24 + reveal * 0.76,
                  }}
                >
                  <div
                    style={{
                      color: editorial.color.text,
                      fontSize: 29,
                      fontWeight: 740,
                    }}
                  >
                    {skill}
                  </div>
                  <div
                    style={{
                      marginTop: 18,
                      color: editorial.color.muted,
                      fontSize: 18,
                    }}
                  >
                    Shared professional capability
                  </div>
                </div>
              );
            },
          )}
        </div>
        <div
          style={{
            marginTop: 30,
            color: editorial.color.muted,
            fontSize: 25,
            textAlign: "center",
            opacity: progress(local, 17.0, 18.0),
          }}
        >
          FDE does not own these skills.
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: comparisonReveal }}>
        <div
          style={{
            ...layoutStyle(layout.stageLabel.rect),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              color: editorial.color.signal,
              fontSize: editorial.type.label,
              fontWeight: 760,
              textTransform: "uppercase",
            }}
          >
            The useful distinction
          </div>
          <div
            style={{
              color: editorial.color.muted,
              fontSize: editorial.type.body,
              fontWeight: 560,
            }}
          >
            Production and product learning change the model.
          </div>
        </div>
        <div
          style={{
            ...layoutStyle(layout.comparison.rect),
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 72,
          }}
        >
          <div
            style={{
              paddingRight: 36,
              borderRight: `1px solid ${editorial.color.lineStrong}`,
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
              Recommendation path
            </div>
            <div
              style={{
                marginTop: 58,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <FlowNode label="Custom code" tone="paper" width={290} height={118} />
              <div
                style={{
                  width: 120,
                  height: 3,
                  backgroundColor: editorial.color.tension,
                  transformOrigin: "left center",
                  transform: `scaleX(${handoff})`,
                }}
              />
              <FlowNode
                label="Handoff"
                tone="tension"
                width={250}
                height={118}
                opacity={0.24 + handoff * 0.76}
              />
            </div>
            <div
              style={{
                marginTop: 42,
                color: editorial.color.muted,
                fontSize: 22,
                lineHeight: 1.4,
              }}
            >
              Useful work can still end as a project artifact or deeper dependence.
            </div>
          </div>
          <div style={{ position: "relative", height: 420, paddingLeft: 8 }}>
            <div
              style={{
                color: editorial.color.signal,
                fontSize: editorial.type.label,
                fontWeight: 760,
                textTransform: "uppercase",
              }}
            >
              Production and product learning
            </div>
            <svg
              width="780"
              height="330"
              viewBox="0 0 780 330"
              style={{ marginTop: 24 }}
            >
              <path
                d="M 120 170 C 120 72 306 52 430 84 C 570 120 646 200 564 262 C 490 318 242 300 150 230 C 120 208 106 188 120 170"
                fill="none"
                stroke={editorial.color.lineStrong}
                strokeWidth="2"
              />
              <path
                d="M 120 170 C 120 72 306 52 430 84 C 570 120 646 200 564 262 C 490 318 242 300 150 230 C 120 208 106 188 120 170"
                fill="none"
                stroke={editorial.color.signal}
                strokeWidth="4"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - loop}
              />
            </svg>
            {[
              ["Production", 34, 150, productionReveal],
              ["Field learning", 250, 72, learningReveal],
              ["Product", 530, 218, productReveal],
            ].map(([label, left, top, reveal]) => (
              <div
                key={String(label)}
                style={{
                  position: "absolute",
                  left: Number(left),
                  top: Number(top),
                  width: 210,
                  height: 88,
                }}
              >
                <FlowNode
                  label={String(label)}
                  tone="signal"
                  width={210}
                  height={88}
                  opacity={0.22 + Number(reveal) * 0.78}
                  transform={`scale(${0.98 + Number(reveal) * 0.02})`}
                />
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", top: layout.outcome.rect.y }}>
          <OutcomeBand
            label="The useful distinction"
            left="CUSTOM CODE + HANDOFF"
            right="CUSTOMER RUNS IT + PRODUCT LEARNS"
            opacity={outcome}
            transform={`translateY(${(1 - outcome) * 14}px)`}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const durableAssets = [
  "Data contracts",
  "Evaluation sets",
  "Permission rules",
  "Audit history",
  "Runbooks",
  "Failure modes",
  "Model interface",
];

const OwnershipScene: React.FC<{ time: number }> = ({ time }) => {
  const local = localTime(time, scenes.ownership.start);
  const ownershipMapLayout = editorialLayouts["ownership-map"].slots;
  const ownershipAssetsLayout = editorialLayouts["ownership-assets"].slots;
  const ownershipMedia = stageOpacity(local, 0, 0.28, 5.3, 5.7);
  const ownershipDiagram = progress(local, 5.7, 6.25, easeInOut);
  const assetsPhase = progress(local, 23.5, 24.9, easeInOut);
  const tighten = progress(local, 3.0, 16.0, easeInOut);
  const weaker = progress(local, 16.5, 18.0);
  const assets = progress(local, 24.0, 39.2, easeInOut);
  const outcome = progress(local, 39.2, 40.4);

  return (
    <AbsoluteFill
      style={{ opacity: sceneOpacity(time, scenes.ownership.start, scenes.ownership.end) }}
    >
      <SceneHeader
        eyebrow="A deployment can work and still fail strategically"
        title="Success can hide lock-in."
        aside="The customer's ability to change the system can get weaker."
        titleSize={58}
        opacity={progress(local, 0, 0.52) * ownershipDiagram * (1 - assetsPhase)}
      />
      <SceneHeader
        eyebrow="The ownership rule"
        title="The customer must keep the durable parts."
        aside="The model provider should remain replaceable."
        titleSize={56}
        opacity={assetsPhase}
        transform={`translateY(${(1 - assetsPhase) * 16}px)`}
      />
      <EditorialMediaSplit
        src={staticFile("fde-v4/customer-owned-workflow.png")}
        sourceLabel="Conceptual illustration"
        eyebrow="The ownership risk"
        title="A useful deployment can still leave the customer weaker."
        copy="The system can work, deliver value, and still make the durable workflow harder for the customer to understand or change."
        points={[
          "The workflow works.",
          "The vendor holds the durable parts.",
          "The customer loses room to change it.",
        ]}
        outcome="The ownership test: does the customer keep the workflow?"
        opacity={ownershipMedia}
        transform={`translateY(${(1 - ownershipMedia) * 14}px)`}
      />

      <div
        style={{
          ...layoutStyle(ownershipMapLayout.diagram.rect),
          opacity: (1 - assetsPhase) * ownershipDiagram,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 300,
            top: 0,
            width: 1020,
            height: 90,
            padding: "0 28px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: `rgba(58, 30, 26, ${0.1 + tighten * 0.28})`,
            borderTop: `3px solid ${editorial.color.tension}`,
            borderBottom: `1px solid ${signalWithAlpha(0.08 + tighten * 0.16)}`,
            opacity: 0.28 + tighten * 0.72,
            transform: `translateY(${(1 - tighten) * -14}px)`,
          }}
        >
          <div
            style={{
              color: editorial.color.tension,
              fontSize: editorial.type.micro,
              fontWeight: 760,
              textTransform: "uppercase",
            }}
          >
            Vendor-controlled layer
          </div>
          <div
            style={{
              color: editorial.color.muted,
              fontSize: 19,
              fontWeight: 620,
            }}
          >
            Useful at first. Harder to inspect or replace later.
          </div>
        </div>
        <svg
          width="1620"
          height="438"
          viewBox="0 0 1620 438"
          style={{ position: "absolute", inset: 0 }}
        >
          {[
            "M 310 197 C 400 197 430 224 530 224",
            "M 310 317 C 400 317 430 280 530 280",
            "M 1310 197 C 1220 197 1190 224 1090 224",
            "M 1310 317 C 1220 317 1190 280 1090 280",
          ].map((path) => (
            <path
              key={path}
              d={path}
              fill="none"
              stroke={editorial.color.tension}
              strokeWidth="2"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={1 - tighten}
              opacity={0.28 + tighten * 0.72}
            />
          ))}
        </svg>
        <div
          style={{
            position: "absolute",
            left: 530,
            top: 148,
            width: 560,
            height: 174,
            transform: `translateY(${(1 - tighten) * 14}px)`,
          }}
        >
          <DarkPanel
            eyebrow="Critical workflow"
            title="Customer operations"
            note="Useful, integrated, increasingly difficult to change"
            tone="signal"
          />
        </div>
        {[
          ["Connectors", 50, 160],
          ["Agent runtime", 50, 280],
          ["Evaluations", 1310, 160],
          ["Permission model", 1310, 280],
        ].map(([label, left, top]) => (
          <div
            key={String(label)}
            style={{
              position: "absolute",
              left: Number(left),
              top: Number(top),
              width: 260,
              height: 74,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: editorial.color.surface,
              border: `1px solid ${editorial.color.tension}`,
              color: editorial.color.text,
              fontSize: 20,
              fontWeight: 700,
              opacity: 0.32 + tighten * 0.68,
              transform: `translateY(${(1 - tighten) * 10}px)`,
            }}
          >
            {String(label)}
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: 440,
            top: 362,
            width: 740,
            textAlign: "center",
            color: editorial.color.tension,
            fontSize: 24,
            fontWeight: 740,
            opacity: weaker,
          }}
        >
          Ability to understand or change: weaker
        </div>
      </div>

      <div
        style={{
          ...layoutStyle(ownershipAssetsLayout.assets.rect),
          opacity: assetsPhase,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: "36px 42px",
            boxSizing: "border-box",
            backgroundColor: editorial.color.surface,
            border: `1px solid ${editorial.color.signal}`,
          }}
        >
          <div
            style={{
              color: editorial.color.signal,
              fontSize: editorial.type.label,
              fontWeight: 760,
              textTransform: "uppercase",
            }}
          >
            Customer-owned workflow assets
          </div>
          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: 40,
            }}
          >
            {durableAssets.map((asset, index) => {
              const reveal = progress(assets, index * 0.13, index * 0.13 + 0.18);
              return (
                <div
                  key={asset}
                  style={{
                    minHeight: 84,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    borderTop: `1px solid ${editorial.color.lineStrong}`,
                    opacity: 0.2 + reveal * 0.8,
                  }}
                >
                  <span
                    style={{
                      color: editorial.color.signal,
                      fontSize: editorial.type.micro,
                      fontWeight: 760,
                    }}
                  >
                    0{index + 1}
                  </span>
                  <span
                    style={{
                      color: editorial.color.text,
                      fontSize: 24,
                      fontWeight: 690,
                    }}
                  >
                    {asset}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        style={{
          ...layoutStyle(ownershipAssetsLayout.provider.rect),
          opacity: assetsPhase,
        }}
      >
        <DarkPanel
          eyebrow="Replaceable plug"
          title="Model / provider"
          note="Important capability, not the owner of the operating system"
          tone="neutral"
        />
      </div>
      <div
        style={{
          ...layoutStyle(ownershipAssetsLayout.outcome.rect),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTop: `1px solid ${editorial.color.lineStrong}`,
          color: editorial.color.text,
          fontSize: 31,
          fontWeight: 740,
          opacity: outcome * assetsPhase,
        }}
      >
        A good engagement leaves the customer more capable.
      </div>
    </AbsoluteFill>
  );
};

const actorItems = [
  {
    letter: "A",
    label: "Action",
    question: "What real work changes?",
    at: 9.1,
  },
  {
    letter: "C",
    label: "Context",
    question: "What may the system know?",
    at: 14.9,
  },
  {
    letter: "T",
    label: "Trust",
    question: "When may it act?",
    at: 21.6,
  },
  {
    letter: "O",
    label: "Outcome",
    question: "What proves improvement?",
    at: 31.9,
  },
  {
    letter: "R",
    label: "Recursive",
    question: "How does the next run improve?",
    at: 37.0,
  },
];

const ActorScene: React.FC<{ time: number }> = ({ time }) => {
  const local = localTime(time, scenes.actor.start);
  const title = progress(local, 0, 0.72);
  const recursive = progress(local, 37.0, 42.7, easeInOut);
  const arrowHead = dependentReveal(recursive, 0.985);
  const reflection = progress(local, 43.0, 44.6, easeInOut);
  const judgment = progress(local, 49.5, 59.8, easeInOut);
  const final = progress(local, 61.6, 62.8);

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity(time, scenes.actor.start, scenes.actor.end) }}>
      <SceneHeader
        eyebrow="My deployment framework"
        title="ACTOR"
        aside="Five questions before AI becomes operating capability."
        titleSize={82}
        opacity={title}
      />
      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          top: 314,
          width: editorial.safe.width,
          height: 286,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 20,
          transform: `translateY(${-reflection * 46}px) scale(${1 - reflection * 0.1})`,
          transformOrigin: "center top",
          opacity: 1 - final * 0.5,
        }}
      >
        {actorItems.map((item) => {
          const reveal = progress(local, item.at, item.at + 0.72);
          return (
            <FrameworkCard
              key={item.letter}
              letter={item.letter}
              label={item.label}
              question={item.question}
              reveal={reveal}
            />
          );
        })}
      </div>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, opacity: 1 - reflection }}
      >
        <path
          d="M 1646 600 C 1698 664 1656 724 1548 724 L 364 724 C 250 724 214 666 270 600"
          fill="none"
          stroke={editorial.color.lineStrong}
          strokeWidth="2"
        />
        <path
          d="M 1646 600 C 1698 664 1656 724 1548 724 L 364 724 C 250 724 214 666 270 600"
          fill="none"
          stroke={editorial.color.signal}
          strokeWidth="4"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - recursive}
        />
        <path
          d="M 270 600 L 260 624 L 287 618"
          fill="none"
          stroke={editorial.color.signal}
          strokeWidth="4"
          opacity={arrowHead}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 220,
          right: 220,
          top: 610,
          opacity: reflection * (1 - final),
        }}
      >
        <div
          style={{
            color: editorial.color.text,
            fontSize: 48,
            lineHeight: 1.05,
            fontWeight: 800,
            textAlign: "center",
          }}
        >
          A loop in a diagram is not self-improvement.
        </div>
        <div
          style={{
            marginTop: 44,
            display: "grid",
            gridTemplateColumns: "1fr 80px 1fr 80px 1fr",
            alignItems: "center",
          }}
        >
          {[
            ["NOTICE", "Failures become evidence"],
            ["->", ""],
            ["JUDGE", "Which patterns matter?"],
            ["->", ""],
            ["ENCODE", "Evaluations, rules, runbooks, tools"],
          ].map(([label, note], index) => {
            const reveal =
              label === "->"
                ? judgment
                : progress(judgment, Math.max(0, (index - 1) * 0.23), Math.min(1, index * 0.23 + 0.3));
            return (
              <div
                key={`${label}-${index}`}
                style={{
                  minHeight: label === "->" ? 0 : 132,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    label === "->" ? "transparent" : editorial.color.surface,
                  border:
                    label === "->"
                      ? "none"
                      : `1px solid ${editorial.color.signal}`,
                  color:
                    label === "->"
                      ? editorial.color.signal
                      : editorial.color.text,
                  fontSize: label === "->" ? 34 : 24,
                  fontWeight: 760,
                  textAlign: "center",
                  opacity: 0.2 + reveal * 0.8,
                }}
              >
                {label}
                {note ? (
                  <span
                    style={{
                      marginTop: 12,
                      color: editorial.color.muted,
                      fontSize: 18,
                      lineHeight: 1.3,
                      fontWeight: 560,
                    }}
                  >
                    {note}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 280,
          right: 280,
          top: 650,
          textAlign: "center",
          opacity: final,
          transform: `translateY(${(1 - final) * 18}px)`,
        }}
      >
        <div
          style={{
            color: editorial.color.muted,
            fontSize: 28,
            fontWeight: 680,
          }}
        >
          The goal is not permanent manual work.
        </div>
        <div
          style={{
            marginTop: 22,
            color: editorial.color.text,
            fontSize: 72,
            lineHeight: 1.02,
            fontWeight: 830,
          }}
        >
          Make good judgment compound.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TokensScene: React.FC<{ time: number }> = ({ time }) => {
  const local = localTime(time, scenes.tokens.start);
  const finalPhase = progress(local, 24.0, 25.2, easeInOut);
  const tokenCount = Math.round(progress(local, 0.2, 7.5) * 1_000_000);
  const outcomes = progress(local, 3.2, 12.2, easeInOut);
  const deployment = progress(local, 12.4, 23.8, easeInOut);
  const operatingRule = stageOpacity(local, 24.6, 25.6, 36.0, 37.2);
  const finalQuestion = progress(local, 36.5, 37.6);

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity(time, scenes.tokens.start, scenes.tokens.end) }}>
      <SceneHeader
        eyebrow="Input is not outcome"
        title="Tokens measure consumption."
        aside="They do not prove a better decision, faster workflow, or learning."
        opacity={progress(local, 0, 0.52) * (1 - finalPhase)}
      />
      <SceneHeader
        eyebrow="The operating rule"
        title="The title may change. The rule will not."
        aside="Judge the workflow changed and the capability kept."
        opacity={finalPhase * (1 - finalQuestion)}
        transform={`translateY(${(1 - finalPhase) * 16}px)`}
      />

      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          top: 318,
          width: editorial.safe.width,
          height: 470,
          display: "grid",
          gridTemplateColumns: "650px 1fr",
          gap: 78,
          opacity: 1 - finalPhase,
        }}
      >
        <div
          style={{
            padding: "42px 46px",
            boxSizing: "border-box",
            backgroundColor: editorial.color.surface,
            border: `1px solid ${editorial.color.lineStrong}`,
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
            Model input
          </div>
          <div
            style={{
              marginTop: 68,
              color: editorial.color.text,
              fontSize: 88,
              lineHeight: 1,
              fontWeight: 840,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {tokenCount.toLocaleString("en-US")}
          </div>
          <div
            style={{
              marginTop: 16,
              color: editorial.color.signal,
              fontSize: 28,
              fontWeight: 740,
            }}
          >
            tokens consumed
          </div>
          <div
            style={{
              marginTop: 54,
              height: 8,
              backgroundColor: editorial.color.lineStrong,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress(local, 0.2, 7.5) * 100}%`,
                height: "100%",
                backgroundColor: editorial.color.signal,
              }}
            />
          </div>
        </div>
        <div
          style={{
            padding: "38px 42px",
            boxSizing: "border-box",
            backgroundColor: editorial.color.surface,
            border: `1px solid ${editorial.color.lineStrong}`,
          }}
        >
          <div
            style={{
              color: editorial.color.tension,
              fontSize: editorial.type.label,
              fontWeight: 760,
              textTransform: "uppercase",
            }}
          >
            Outcome ledger
          </div>
          <div style={{ marginTop: 30 }}>
            {[
              ["Decision improved", "UNPROVEN"],
              ["Workflow faster", "UNPROVEN"],
              ["Organization learned", "UNPROVEN"],
            ].map(([label, status], index) => {
              const reveal = progress(outcomes, index * 0.3, index * 0.3 + 0.34);
              return (
                <div
                  key={label}
                  style={{
                    minHeight: 106,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: `1px solid ${editorial.color.lineStrong}`,
                    opacity: 0.2 + reveal * 0.8,
                  }}
                >
                  <span
                    style={{
                      color: editorial.color.text,
                      fontSize: 26,
                      fontWeight: 690,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      color: editorial.color.tension,
                      fontSize: 18,
                      fontWeight: 780,
                    }}
                  >
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 430,
          right: 430,
          top: 820,
          display: "grid",
          gridTemplateColumns: "1fr 70px 1fr 70px 1fr",
          alignItems: "center",
          opacity: deployment * (1 - finalPhase),
        }}
      >
        {["Intelligence", "->", "Deployment", "->", "Operations"].map(
          (item, index) => (
            <div
              key={`${item}-${index}`}
              style={{
                color:
                  item === "->" ? editorial.color.signal : editorial.color.text,
                fontSize: item === "->" ? 32 : 24,
                fontWeight: 740,
                textAlign: "center",
              }}
            >
              {item}
            </div>
          ),
        )}
      </div>

      <div
        style={{
          position: "absolute",
          left: 260,
          right: 260,
          top: 360,
          opacity: finalPhase * operatingRule,
          transform: `translateY(${(1 - operatingRule) * 18}px)`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 90px 1fr 90px 1fr",
            alignItems: "center",
          }}
        >
          {[
            "MODEL",
            "->",
            "WORKFLOW CHANGED",
            "->",
            "CAPABILITY KEPT",
          ].map((item, index) => (
            <div
              key={`${item}-${index}`}
              style={{
                minHeight: item === "->" ? 0 : 122,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  item === "->"
                    ? "transparent"
                    : item === "MODEL"
                      ? editorial.color.surface
                      : editorial.color.signalDark,
                border:
                  item === "->"
                    ? "none"
                    : `1px solid ${
                        item === "MODEL"
                          ? editorial.color.lineStrong
                          : editorial.color.signal
                      }`,
                color:
                  item === "->" ? editorial.color.signal : editorial.color.text,
                fontSize: item === "->" ? 34 : 23,
                fontWeight: 780,
                textAlign: "center",
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 64,
            color: editorial.color.text,
            fontSize: 58,
            lineHeight: 1.08,
            fontWeight: 820,
            textAlign: "center",
          }}
        >
          Judge AI by the workflow it changes
          <br />
          and the capability the customer keeps.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 220,
          right: 220,
          top: 336,
          textAlign: "center",
          opacity: finalQuestion,
          transform: `translateY(${(1 - finalQuestion) * 18}px)`,
        }}
      >
        <div
          style={{
            color: editorial.color.signal,
            fontSize: 22,
            fontWeight: 780,
            textTransform: "uppercase",
          }}
        >
          The real question
        </div>
        <div
          style={{
            marginTop: 34,
            color: editorial.color.text,
            fontSize: 64,
            lineHeight: 1.08,
            fontWeight: 830,
          }}
        >
          Do expensive tokens become an operating system
          <br />
          the company actually owns?
        </div>
        <div
          style={{
            margin: "54px auto 0",
            width: 920,
            height: 3,
            backgroundColor: editorial.color.signal,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const AuthorEndCard: React.FC<{ time: number; start: number; end: number }> = ({
  time,
  start,
  end,
}) => {
  const cardTime = Math.max(0, time - start);
  const cardOpacity = progress(cardTime, 0.04, 0.38, easeInOut);
  const tileReveal = progress(cardTime, 0.52, 1.0);
  const typeReveal = progress(cardTime, 0.82, 1.4);
  const exit = 1 - progress(time, end - 0.45, end, easeInOut);

  const brand = {
    canvas: "#080a11",
    grid: "rgba(218, 226, 255, 0.055)",
    text: "#f5f7ff",
    muted: "#a9b0c2",
    accent: "#a9b8fb",
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.canvas,
        opacity: cardOpacity * exit,
        zIndex: 180,
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 1,
          backgroundImage: `linear-gradient(${brand.grid} 1px, transparent 1px), linear-gradient(90deg, ${brand.grid} 1px, transparent 1px)`,
          backgroundSize: "160px 160px",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 72,
          border: "1px solid rgba(245, 247, 255, 0.08)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 260,
          right: 260,
          top: 176,
          bottom: 184,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 158,
            height: 158,
            boxSizing: "border-box",
            overflow: "hidden",
            borderRadius: 28,
            backgroundColor: "#f7f9ff",
            border: "1px solid rgba(255, 255, 255, 0.7)",
            boxShadow: "0 24px 72px rgba(126, 145, 231, 0.2)",
            opacity: tileReveal,
            transform: `translateY(${(1 - tileReveal) * 16}px) scale(${0.96 + tileReveal * 0.04})`,
          }}
        >
          <Img
            src={staticFile("fde-v5/aaron-brand-tile.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            marginTop: 42,
            color: brand.muted,
            fontSize: 20,
            fontWeight: 720,
            opacity: typeReveal,
            transform: `translateY(${(1 - typeReveal) * 14}px)`,
          }}
        >
          Aaron Guo
        </div>
        <div
          style={{
            marginTop: 14,
            color: brand.text,
            fontSize: 68,
            lineHeight: 1,
            fontWeight: 820,
            opacity: typeReveal,
            transform: `translateY(${(1 - typeReveal) * 18}px)`,
          }}
        >
          AI-NATIVE BUILDER
        </div>
        <div
          style={{
            marginTop: 20,
            color: brand.accent,
            fontSize: 29,
            lineHeight: 1.2,
            fontWeight: 620,
            opacity: typeReveal,
            transform: `translateY(${(1 - typeReveal) * 20}px)`,
          }}
        >
          Human-first thinker
        </div>
      </div>
    </AbsoluteFill>
  );
};

const retimedWordTimings = fdeFullWordTimings.map((timing) => ({
  ...timing,
  start: retimeBase(timing.start),
  end: retimeBase(timing.end),
}));

const captionSegments = buildCaptionSegments(retimedWordTimings, 8);
const captionSegmentsV5 = buildCaptionSegments(fdeFullWordTimingsV5, 8);

const EditorialCaption: React.FC<{
  time: number;
  version?: "v4" | "v5";
  hidden?: boolean;
}> = ({ time, version = "v4", hidden = false }) => {
  if (hidden) return null;
  const active = (version === "v5" ? captionSegmentsV5 : captionSegments).find(
    (segment) => time >= segment.start - 0.08 && time <= segment.end + 0.36,
  );
  if (!active) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 300,
        right: 300,
        bottom: 38,
        minHeight: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 26px 13px",
        boxSizing: "border-box",
        backgroundColor: "rgba(9, 12, 11, 0.82)",
        color: editorial.color.text,
        fontSize: editorial.type.caption,
        lineHeight: 1.3,
        fontWeight: 600,
        textAlign: "center",
        boxShadow: "0 -12px 28px rgba(9, 12, 11, 0.28)",
        zIndex: 120,
      }}
    >
      {active.text}
    </div>
  );
};

const FdeFullFilm: React.FC<{
  version: "v4" | "v5";
  brandedOutro?: boolean;
}> = ({ version, brandedOutro = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const totalDurationSec = brandedOutro
    ? FDE_FULL_FILM_V5_BRANDED_DURATION_SEC
    : FDE_FULL_FILM_DURATION_SEC;
  const brandedOutroActive =
    brandedOutro && time >= FDE_FULL_FILM_V5_BRANDED_OUTRO_START_SEC;
  const endFade =
    1 -
    progress(
      time,
      totalDurationSec - 0.45,
      totalDurationSec,
    );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: editorial.color.canvas,
        color: editorial.color.text,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        letterSpacing: 0,
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <Audio src={staticFile("fde-full-film/music-full-v1.mp3")} volume={musicVolume} />
      <Sequence from={Math.round(narrationOffsetSec * fps)}>
        <Audio
          src={staticFile(
            version === "v5"
              ? "fde-v5/narration-full-v5.mp3"
              : "fde-full-film/narration-full-v1.mp3",
          )}
        />
      </Sequence>

      <FieldBackdrop />
      <PreludeScene time={time} />
      <HookScene time={time} />
      <DeploymentScene time={time} />
      <FactoryScene time={time} />
      <BackpropScene time={time} />
      <WorkflowScene time={time} />
      <ComparisonScene time={time} />
      <OwnershipScene time={time} />
      <ActorScene time={time} />
      <TokensScene time={time} />
      <FrameChrome time={time} hidden={brandedOutroActive} />
      <EditorialCaption
        time={time}
        version={version}
        hidden={brandedOutroActive}
      />
      {brandedOutro ? (
        <AuthorEndCard
          time={time}
          start={FDE_FULL_FILM_V5_BRANDED_OUTRO_START_SEC}
          end={totalDurationSec}
        />
      ) : null}

      <AbsoluteFill
        style={{
          backgroundColor: editorial.color.canvas,
          opacity: 1 - endFade,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export const FdeFullFilmV4: React.FC = () => <FdeFullFilm version="v4" />;

export const FdeFullFilmV5: React.FC = () => <FdeFullFilm version="v5" />;

export const FdeFullFilmV5Branded: React.FC = () => (
  <FdeFullFilm version="v5" brandedOutro />
);

// Keep the approved V1 composition addressable while the current full-film
// implementation evolves. Published V1 exports remain immutable artifacts.
export const FdeFullFilmV1 = FdeFullFilmV4;
