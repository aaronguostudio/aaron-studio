import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { buildCaptionSegments } from "./components/WordCaption";
import { fdePrototypeWordTimings } from "./data/fdePrototypeWordTimings";

export const FDE_PROTOTYPE_FPS = 30;
export const FDE_PROTOTYPE_DURATION_SEC = 84.04;

export const fdePrototypeDurationFrames = (fps = FDE_PROTOTYPE_FPS): number =>
  Math.ceil(FDE_PROTOTYPE_DURATION_SEC * fps);

const narrationOffsetSec = 2.5;

const scenes = {
  prelude: { start: 0, end: 2.5 },
  convergence: { start: 2.5, end: 21.22 },
  deployment: { start: 21.22, end: 37.66 },
  comparison: { start: 37.66, end: 58.19 },
  actor: { start: 58.19, end: FDE_PROTOTYPE_DURATION_SEC },
} as const;

const palette = {
  field: "#0a0c0b",
  fieldRaised: "#121513",
  paper: "#eee9dd",
  ink: "#111210",
  white: "#f5f2e9",
  muted: "#9b9f99",
  green: "#69c7a4",
  greenDark: "#173c31",
  amber: "#e5b75a",
  red: "#d8644e",
  cyan: "#65b8c1",
  lime: "#a9be67",
  line: "rgba(245, 242, 233, 0.15)",
};

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

const sceneOpacity = (time: number, start: number, end: number): number => {
  const fadeIn =
    start === 0 ? 1 : progress(time, start - 0.42, start, easeInOut);
  const fadeOut =
    end >= FDE_PROTOTYPE_DURATION_SEC
      ? 1
      : 1 - progress(time, end - 0.28, end + 0.42, easeInOut);
  return Math.min(fadeIn, fadeOut);
};

const liftStyle = (
  localTime: number,
  start: number,
  duration = 0.65,
  distance = 28,
): React.CSSProperties => {
  const value = progress(localTime, start, start + duration);
  return {
    opacity: value,
    transform: `translateY(${(1 - value) * distance}px)`,
  };
};

const sectionForTime = (time: number): string => {
  if (time < scenes.convergence.end) return "01 / SIGNAL";
  if (time < scenes.deployment.end) return "02 / SYSTEM";
  if (time < scenes.comparison.end) return "03 / PRACTICE";
  return "04 / FRAMEWORK";
};

const musicVolume = (frame: number): number => {
  const time = frame / FDE_PROTOTYPE_FPS;
  if (time < 2.15) return 0.72;
  if (time < 3.2) {
    return interpolate(time, [2.15, 3.2], [0.72, 0.13], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  if (time < scenes.actor.start) return 0.13;
  if (time < 80.5) return 0.15;
  return interpolate(time, [80.5, FDE_PROTOTYPE_DURATION_SEC], [0.15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const FieldBackdrop: React.FC<{ time: number }> = ({ time }) => {
  const route = progress(time, 0, FDE_PROTOTYPE_DURATION_SEC, easeInOut);

  return (
    <AbsoluteFill style={{ backgroundColor: palette.field }}>
      <AbsoluteFill
        style={{
          opacity: 0.22,
          backgroundImage:
            "linear-gradient(rgba(245,242,233,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(245,242,233,0.08) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          transform: `translateX(${interpolate(route, [0, 1], [0, -18])}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: palette.red,
          opacity: 0.8,
        }}
      />
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d="M 66 900 C 320 900 330 846 570 846 S 920 910 1160 872 S 1500 820 1854 856"
          fill="none"
          stroke="rgba(105, 199, 164, 0.22)"
          strokeWidth="2"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - route}
        />
      </svg>
    </AbsoluteFill>
  );
};

const FrameChrome: React.FC<{ time: number }> = ({ time }) => {
  const route = progress(time, 0, FDE_PROTOTYPE_DURATION_SEC, easeInOut);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 96,
          display: "flex",
          alignItems: "center",
          gap: 18,
          color: palette.white,
          fontSize: 18,
          fontWeight: 650,
          letterSpacing: 0,
          width: 430,
          whiteSpace: "nowrap",
          zIndex: 100,
          transform: "translateZ(500px)",
          backfaceVisibility: "hidden",
        }}
      >
        <span
          style={{
            color: palette.green,
            flexShrink: 0,
            display: "flex",
            transform: "translateZ(0)",
          }}
        >
          {Array.from("AARON GUO").map((letter, index) => (
            <span key={`${letter}-${index}`}>
              {letter === " " ? "\u00a0" : letter}
            </span>
          ))}
        </span>
        <span style={{ color: palette.muted, flexShrink: 0 }}>
          {sectionForTime(time)}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 49,
          right: 96,
          width: 342,
          display: "flex",
          alignItems: "center",
          gap: 18,
          color: palette.muted,
          fontSize: 16,
          fontVariantNumeric: "tabular-nums",
          zIndex: 100,
          transform: "translateZ(500px)",
          backfaceVisibility: "hidden",
        }}
      >
        <div
          style={{
            width: 270,
            height: 3,
            backgroundColor: "rgba(245,242,233,0.14)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${route * 100}%`,
              backgroundColor: palette.green,
            }}
          />
        </div>
        <span>{String(Math.min(84, Math.floor(time))).padStart(2, "0")}</span>
      </div>
    </>
  );
};

const PreludeScene: React.FC<{ time: number }> = ({ time }) => {
  const local = time - scenes.prelude.start;
  const title = progress(local, 0.18, 0.95);
  const route = progress(local, 0.15, 2.15, easeInOut);

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity(time, scenes.prelude.start, scenes.prelude.end),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 112,
          top: 186,
          color: palette.green,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 0,
        }}
      >
        FIELD NOTE 01
      </div>
      <div
        style={{
          position: "absolute",
          left: 112,
          top: 246,
          width: 1690,
          height: 2,
          backgroundColor: palette.line,
        }}
      >
        <div
          style={{
            width: `${route * 100}%`,
            height: "100%",
            backgroundColor: palette.green,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 104,
          top: 286,
          color: palette.white,
          fontSize: 196,
          lineHeight: 0.98,
          fontWeight: 820,
          letterSpacing: 0,
          opacity: 0.28 + title * 0.72,
        }}
      >
        FDE
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 515,
          color: palette.muted,
          fontSize: 34,
          fontWeight: 520,
          ...liftStyle(local, 1.05, 0.75),
        }}
      >
        Forward deployed engineering
      </div>
      <div
        style={{
          position: "absolute",
          right: 112,
          bottom: 154,
          width: 420,
          color: palette.muted,
          fontSize: 20,
          lineHeight: 1.5,
          textAlign: "right",
          ...liftStyle(local, 1.45, 0.7),
        }}
      >
        The missing layer between model capability and operating change.
      </div>
    </AbsoluteFill>
  );
};

interface CompanyMarker {
  name: string;
  index: string;
  at: number;
  accent: string;
}

const companyMarkers: CompanyMarker[] = [
  { name: "Anthropic", index: "01", at: 1.8, accent: palette.amber },
  { name: "OpenAI", index: "02", at: 2.9, accent: palette.green },
  { name: "AWS", index: "03", at: 4.25, accent: palette.cyan },
  { name: "Microsoft", index: "04", at: 5.75, accent: palette.red },
];

const CompanyCard: React.FC<{
  marker: CompanyMarker;
  local: number;
  x: number;
  focus: number;
}> = ({ marker, local, x, focus }) => {
  const enter = progress(local, marker.at, marker.at + 0.72);
  const rotate = (1 - enter) * -58;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 292 - focus * 44,
        width: 330,
        height: 244,
        padding: "24px 26px",
        boxSizing: "border-box",
        backgroundColor: palette.paper,
        color: palette.ink,
        borderTop: `7px solid ${marker.accent}`,
        borderRadius: 4,
        opacity: enter * (1 - focus * 0.55),
        transformOrigin: "left center",
        transform: `perspective(1000px) rotateY(${rotate}deg) translateY(${(1 - enter) * 24}px) scale(${1 - focus * 0.08})`,
        boxShadow: "0 28px 70px rgba(0,0,0,0.32)",
      }}
    >
      <div
        style={{
          color: "#696b66",
          fontSize: 17,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        SIGNAL {marker.index} / 04
      </div>
      <div
        style={{
          marginTop: 62,
          fontSize: 42,
          fontWeight: 790,
          lineHeight: 1.05,
          letterSpacing: 0,
        }}
      >
        {marker.name}
      </div>
      <div
        style={{
          marginTop: 20,
          width: 48,
          height: 5,
          backgroundColor: marker.accent,
        }}
      />
    </div>
  );
};

const ConvergenceScene: React.FC<{ time: number }> = ({ time }) => {
  const local = time - scenes.convergence.start;
  const converge = progress(local, 8.7, 11.6, easeInOut);
  const question = progress(local, 12.75, 13.65);
  const bridgeOut = 1 - progress(local, 17.85, 18.55, easeInOut);
  const cardXs = [112, 524, 936, 1348];

  return (
    <AbsoluteFill
      style={{
        opacity:
          sceneOpacity(time, scenes.convergence.start, scenes.convergence.end) *
          bridgeOut,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 112,
          top: 134,
          display: "flex",
          alignItems: "baseline",
          gap: 24,
          ...liftStyle(local, 0, 0.55),
        }}
      >
        <span
          style={{
            color: palette.white,
            fontSize: 64,
            fontWeight: 790,
            letterSpacing: 0,
          }}
        >
          Four companies.
        </span>
        <span style={{ color: palette.green, fontSize: 30, fontWeight: 690 }}>
          59 days. One move.
        </span>
      </div>

      {companyMarkers.map((marker, index) => (
        <CompanyCard
          key={marker.name}
          marker={marker}
          local={local}
          x={cardXs[index]}
          focus={question}
        />
      ))}

      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, opacity: 1 - question * 0.42 }}
      >
        {cardXs.map((x, index) => (
          <path
            key={x}
            d={`M ${x + 165} 554 C ${x + 165} 650 ${960 + (index - 1.5) * 44} 640 960 724`}
            fill="none"
            stroke={companyMarkers[index].accent}
            strokeWidth="3"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - converge}
            opacity={0.88}
          />
        ))}
      </svg>

      <div
        style={{
          position: "absolute",
          left: 672,
          top: 702,
          width: 576,
          height: 92,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: palette.greenDark,
          border: `1px solid ${palette.green}`,
          borderRadius: 4,
          color: palette.white,
          fontSize: 27,
          fontWeight: 720,
          textTransform: "uppercase",
          opacity: converge * (1 - question),
          transform: `scale(${0.94 + converge * 0.06})`,
        }}
      >
        Engineers closer to customers
      </div>

      <div
        style={{
          position: "absolute",
          left: 210,
          right: 210,
          top: 350,
          textAlign: "center",
          opacity: question,
          transform: `translateY(${(1 - question) * 30}px)`,
        }}
      >
        <div
          style={{
            color: palette.muted,
            fontSize: 25,
            fontWeight: 680,
            textTransform: "uppercase",
          }}
        >
          If models were the whole product
        </div>
        <div
          style={{
            marginTop: 22,
            color: palette.white,
            fontSize: 90,
            lineHeight: 1.02,
            fontWeight: 820,
            letterSpacing: 0,
          }}
        >
          Why spend billions on people?
        </div>
      </div>
    </AbsoluteFill>
  );
};

const operatingLayers = [
  { label: "Data", at: 5.35, color: palette.cyan },
  { label: "Permissions", at: 6.2, color: palette.amber },
  { label: "Approvals", at: 7.1, color: palette.lime },
  { label: "Exceptions", at: 8.15, color: palette.red },
  { label: "Recovery", at: 9.35, color: palette.green },
];

const DeploymentScene: React.FC<{ time: number }> = ({ time }) => {
  const local = time - scenes.deployment.start;
  const turn = progress(local, 3.1, 5.4, easeInOut);
  const system = progress(local, 4.3, 5.5);
  const closeGap = progress(local, 11.1, 12.2);
  const bridgeOut = 1 - progress(local, 15.6, 16.3, easeInOut);

  return (
    <AbsoluteFill
      style={{
        opacity:
          sceneOpacity(time, scenes.deployment.start, scenes.deployment.end) *
          bridgeOut,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 112,
          top: 132,
          color: palette.white,
          fontSize: 68,
          fontWeight: 800,
          letterSpacing: 0,
          ...liftStyle(local, 0, 0.55),
        }}
      >
        A demo is not a working system.
      </div>
      <div
        style={{
          position: "absolute",
          left: 112,
          top: 220,
          color: palette.muted,
          fontSize: 24,
          ...liftStyle(local, 0.3, 0.55),
        }}
      >
        The polished surface hides the operating work.
      </div>

      <div
        style={{
          position: "absolute",
          left: 126,
          top: 310,
          width: 1670,
          height: 472,
          perspective: 1600,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 600,
            top: 16,
            width: 880,
            height: 410,
            padding: "38px 42px",
            boxSizing: "border-box",
            backgroundColor: palette.fieldRaised,
            border: `1px solid rgba(105, 199, 164, ${0.28 + system * 0.48})`,
            borderRadius: 6,
            opacity: system,
            transform: `translateX(${(1 - system) * -70}px)`,
          }}
        >
          <div
            style={{
              color: palette.green,
              fontSize: 19,
              fontWeight: 760,
              textTransform: "uppercase",
            }}
          >
            Operating system
          </div>
          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            {operatingLayers.map((layer, index) => {
              const reveal = progress(local, layer.at, layer.at + 0.62);
              return (
                <div
                  key={layer.label}
                  style={{
                    minHeight: 92,
                    padding: "18px 20px",
                    boxSizing: "border-box",
                    backgroundColor: "rgba(245,242,233,0.045)",
                    borderLeft: `5px solid ${layer.color}`,
                    borderRadius: 3,
                    color: palette.white,
                    opacity: reveal,
                    transform: `translateX(${(1 - reveal) * 26}px)`,
                  }}
                >
                  <div style={{ color: palette.muted, fontSize: 15 }}>
                    0{index + 1}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 27, fontWeight: 690 }}>
                    {layer.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 210 - turn * 78,
            top: 0,
            width: 500,
            height: 442,
            padding: "40px 42px",
            boxSizing: "border-box",
            backgroundColor: palette.paper,
            color: palette.ink,
            borderRadius: 6,
            transformOrigin: "left center",
            transform: `rotateY(${-58 * turn}deg) translateZ(${turn * 42}px)`,
            boxShadow: "0 42px 90px rgba(0,0,0,0.42)",
          }}
        >
          <div style={{ color: "#6a6d67", fontSize: 18, fontWeight: 720 }}>
            MODEL LAYER
          </div>
          <div
            style={{
              marginTop: 78,
              fontSize: 92,
              fontWeight: 840,
              lineHeight: 0.95,
              letterSpacing: 0,
            }}
          >
            AI
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 29,
              fontWeight: 640,
              color: "#444640",
            }}
          >
            Capability through an API
          </div>
          <div
            style={{
              position: "absolute",
              left: 42,
              right: 42,
              bottom: 38,
              height: 8,
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: 8,
            }}
          >
            <span style={{ backgroundColor: palette.green }} />
            <span style={{ backgroundColor: palette.amber }} />
            <span style={{ backgroundColor: palette.red }} />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 112,
          right: 112,
          top: 795,
          display: "flex",
          alignItems: "center",
          gap: 26,
          opacity: closeGap,
          transform: `translateY(${(1 - closeGap) * 22}px)`,
        }}
      >
        <span style={{ color: palette.red, fontSize: 24, fontWeight: 780 }}>
          DEPLOYMENT GAP
        </span>
        <span style={{ flex: 1, height: 2, backgroundColor: palette.red }} />
        <span style={{ color: palette.white, fontSize: 32, fontWeight: 680 }}>
          Intelligence -&gt; operations
        </span>
      </div>
    </AbsoluteFill>
  );
};

const ComparisonScene: React.FC<{ time: number }> = ({ time }) => {
  const local = time - scenes.comparison.start;
  const leftReveal = progress(local, 3.2, 4.1);
  const handoff = progress(local, 4.7, 6.3, easeInOut);
  const rightReveal = progress(local, 7.55, 8.55);
  const loop = progress(local, 9.6, 16.9, easeInOut);
  const resolution = progress(local, 17.85, 18.75);
  const bridgeOut = 1 - progress(local, 19.7, 20.4, easeInOut);

  return (
    <AbsoluteFill
      style={{
        opacity:
          sceneOpacity(time, scenes.comparison.start, scenes.comparison.end) *
          bridgeOut,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 112,
          top: 132,
          color: palette.white,
          fontSize: 66,
          fontWeight: 800,
          letterSpacing: 0,
          ...liftStyle(local, 0, 0.55),
        }}
      >
        Do not draw an equals sign.
      </div>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 248,
          bottom: 170,
          width: 1,
          backgroundColor: "rgba(245,242,233,0.22)",
        }}
      />

      <div style={{ position: "absolute", left: 112, top: 252, width: 760 }}>
        <div style={{ color: palette.muted, fontSize: 20, fontWeight: 720 }}>
          CONSULTING
        </div>
        <div
          style={{
            marginTop: 18,
            color: palette.white,
            fontSize: 54,
            lineHeight: 1.05,
            fontWeight: 760,
          }}
        >
          Recommendation and handoff
        </div>
        <div
          style={{
            marginTop: 96,
            display: "flex",
            alignItems: "center",
            opacity: leftReveal,
          }}
        >
          <div
            style={{
              width: 270,
              minHeight: 122,
              padding: "28px 24px",
              boxSizing: "border-box",
              backgroundColor: palette.paper,
              borderRadius: 4,
              color: palette.ink,
              fontSize: 25,
              fontWeight: 720,
              textAlign: "center",
            }}
          >
            RECOMMENDATION
          </div>
          <div
            style={{
              width: 170,
              height: 3,
              backgroundColor: palette.amber,
              transformOrigin: "left center",
              transform: `scaleX(${handoff})`,
            }}
          />
          <div
            style={{
              width: 150,
              height: 122,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid ${palette.amber}`,
              borderRadius: 4,
              color: palette.amber,
              fontSize: 24,
              fontWeight: 750,
              opacity: handoff,
            }}
          >
            HANDOFF
          </div>
        </div>
        <div
          style={{
            marginTop: 54,
            color: palette.muted,
            fontSize: 24,
            opacity: resolution,
          }}
        >
          Useful work can still end as a project artifact.
        </div>
      </div>

      <div style={{ position: "absolute", left: 1048, top: 252, width: 760 }}>
        <div style={{ color: palette.green, fontSize: 20, fontWeight: 760 }}>
          FORWARD DEPLOYED ENGINEERING
        </div>
        <div
          style={{
            marginTop: 18,
            color: palette.white,
            fontSize: 54,
            lineHeight: 1.05,
            fontWeight: 760,
          }}
        >
          Production and product learning
        </div>

        <div
          style={{
            position: "relative",
            marginTop: 62,
            width: 700,
            height: 288,
            opacity: rightReveal,
          }}
        >
          <svg
            width="700"
            height="288"
            viewBox="0 0 700 288"
            style={{ position: "absolute", inset: 0 }}
          >
            <path
              d="M 120 68 C 330 8 570 28 580 142 C 590 244 322 274 120 214 C 46 192 42 94 120 68"
              fill="none"
              stroke={palette.green}
              strokeWidth="4"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={1 - loop}
            />
          </svg>
          {[
            { label: "PRODUCTION", left: 16, top: 80, at: 0 },
            { label: "FIELD LEARNING", left: 250, top: 14, at: 0.26 },
            { label: "PRODUCT", left: 470, top: 158, at: 0.58 },
          ].map((node) => {
            const nodeReveal = progress(loop, node.at, node.at + 0.25);
            return (
              <div
                key={node.label}
                style={{
                  position: "absolute",
                  left: node.left,
                  top: node.top,
                  width: node.label === "FIELD LEARNING" ? 220 : 190,
                  height: 90,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: palette.greenDark,
                  border: `1px solid ${palette.green}`,
                  borderRadius: 4,
                  color: palette.white,
                  fontSize: 21,
                  fontWeight: 730,
                  opacity: nodeReveal,
                  transform: `scale(${0.92 + nodeReveal * 0.08})`,
                }}
              >
                {node.label}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 18,
            color: palette.green,
            fontSize: 29,
            fontWeight: 730,
            opacity: resolution,
          }}
        >
          The lesson compounds into reusable capability.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 704,
          top: 808,
          width: 512,
          padding: "16px 24px",
          boxSizing: "border-box",
          backgroundColor: palette.paper,
          borderRadius: 4,
          color: palette.ink,
          textAlign: "center",
          fontSize: 28,
          fontWeight: 790,
          opacity: resolution,
          transform: `translateY(${(1 - resolution) * 16}px)`,
        }}
      >
        WHAT COMPOUNDS?
      </div>
    </AbsoluteFill>
  );
};

interface ActorItem {
  letter: string;
  label: string;
  question: string;
  at: number;
  color: string;
}

const actorItems: ActorItem[] = [
  {
    letter: "A",
    label: "Action",
    question: "What work changes?",
    at: 2.65,
    color: palette.amber,
  },
  {
    letter: "C",
    label: "Context",
    question: "What may the system know?",
    at: 5.05,
    color: palette.cyan,
  },
  {
    letter: "T",
    label: "Trust",
    question: "When may it act?",
    at: 7.7,
    color: palette.red,
  },
  {
    letter: "O",
    label: "Outcome",
    question: "What proves value?",
    at: 11.95,
    color: palette.lime,
  },
  {
    letter: "R",
    label: "Recursive",
    question: "How does the next run improve?",
    at: 14.3,
    color: palette.green,
  },
];

const ActorScene: React.FC<{ time: number }> = ({ time }) => {
  const local = time - scenes.actor.start;
  const title = progress(local, 0.35, 1.05);
  const recursive = progress(local, 14.75, 17.4, easeInOut);
  const resolution = progress(local, 19.65, 20.6);

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity(time, scenes.actor.start, scenes.actor.end),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 112,
          top: 126,
          display: "flex",
          alignItems: "baseline",
          gap: 28,
          opacity: title,
          transform: `translateY(${(1 - title) * 24}px)`,
        }}
      >
        <span
          style={{
            color: palette.white,
            fontSize: 82,
            fontWeight: 830,
            letterSpacing: 0,
          }}
        >
          ACTOR
        </span>
        <span style={{ color: palette.green, fontSize: 29, fontWeight: 700 }}>
          My deployment test
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 112,
          top: 276 - resolution * 62,
          width: 1696,
          height: 310,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 22,
          transform: `scale(${1 - resolution * 0.1})`,
          transformOrigin: "center top",
        }}
      >
        {actorItems.map((item) => {
          const reveal = progress(local, item.at, item.at + 0.72);
          return (
            <div
              key={item.letter}
              style={{
                position: "relative",
                height: 286,
                padding: "26px 24px",
                boxSizing: "border-box",
                backgroundColor:
                  reveal > 0.01 ? palette.paper : "rgba(245,242,233,0.035)",
                border: `1px solid ${reveal > 0.01 ? item.color : "rgba(245,242,233,0.18)"}`,
                borderRadius: 4,
                color: reveal > 0.01 ? palette.ink : palette.muted,
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
                  width: 7,
                  backgroundColor: item.color,
                  transformOrigin: "bottom center",
                  transform: `scaleY(${reveal})`,
                }}
              />
              <div
                style={{
                  fontSize: 84,
                  lineHeight: 0.9,
                  fontWeight: 840,
                  letterSpacing: 0,
                }}
              >
                {item.letter}
              </div>
              <div style={{ marginTop: 30, fontSize: 30, fontWeight: 780 }}>
                {item.label}
              </div>
              <div
                style={{
                  marginTop: 20,
                  color: reveal > 0.01 ? "#62655f" : palette.muted,
                  fontSize: 19,
                  lineHeight: 1.32,
                  fontWeight: 560,
                }}
              >
                {item.question}
              </div>
            </div>
          );
        })}
      </div>

      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - resolution * 0.45,
        }}
      >
        <path
          d="M 1656 605 C 1702 680 1658 736 1550 736 L 364 736 C 250 736 210 678 258 605"
          fill="none"
          stroke={palette.green}
          strokeWidth="4"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - recursive}
        />
        <path
          d="M 258 605 L 245 630 L 274 626"
          fill="none"
          stroke={palette.green}
          strokeWidth="4"
          opacity={recursive}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 300,
          right: 300,
          top: 620,
          textAlign: "center",
          opacity: resolution,
          transform: `translateY(${(1 - resolution) * 28}px)`,
        }}
      >
        <div style={{ color: palette.muted, fontSize: 28, fontWeight: 680 }}>
          Tokens are inputs.
        </div>
        <div
          style={{
            marginTop: 14,
            color: palette.white,
            fontSize: 70,
            lineHeight: 1.02,
            fontWeight: 820,
            letterSpacing: 0,
          }}
        >
          Value appears when the workflow changes.
        </div>
        <div
          style={{
            marginTop: 18,
            color: palette.green,
            fontSize: 34,
            fontWeight: 770,
          }}
        >
          The customer keeps the capability.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const captionSegments = buildCaptionSegments(fdePrototypeWordTimings, 8);

const EditorialCaption: React.FC<{ time: number }> = ({ time }) => {
  const active = captionSegments.find(
    (segment) => time >= segment.start - 0.08 && time <= segment.end + 0.42,
  );
  if (!active) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 290,
        right: 290,
        bottom: 42,
        minHeight: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "13px 26px 14px",
        boxSizing: "border-box",
        backgroundColor: "rgba(8,10,9,0.9)",
        borderTop: `3px solid ${palette.green}`,
        color: palette.white,
        fontSize: 31,
        lineHeight: 1.3,
        fontWeight: 600,
        textAlign: "center",
        zIndex: 120,
      }}
    >
      {active.text}
    </div>
  );
};

export const FdeFieldSignalPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const endFade =
    1 -
    progress(
      time,
      FDE_PROTOTYPE_DURATION_SEC - 0.7,
      FDE_PROTOTYPE_DURATION_SEC,
    );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.field,
        color: palette.white,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        letterSpacing: 0,
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <Audio
        src={staticFile("fde-field-signal-prototype/music-edit.mp3")}
        volume={musicVolume}
      />
      <Sequence from={Math.round(narrationOffsetSec * fps)}>
        <Audio src={staticFile("fde-field-signal-prototype/narration.mp3")} />
      </Sequence>

      <FieldBackdrop time={time} />
      <PreludeScene time={time} />
      <ConvergenceScene time={time} />
      <DeploymentScene time={time} />
      <ComparisonScene time={time} />
      <ActorScene time={time} />
      <FrameChrome time={time} />
      <EditorialCaption time={time} />

      <AbsoluteFill
        style={{
          backgroundColor: palette.field,
          opacity: 1 - endFade,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
