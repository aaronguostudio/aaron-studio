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
import { fdePrototypeWordTimingsV3 } from "./data/fdePrototypeWordTimingsV3";
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

export const FDE_PROTOTYPE_V3_FPS = 30;
export const FDE_PROTOTYPE_V3_SPEECH_RATE = 1.04;

const narrationOffsetSec = 2.5;
const narrationSegments = {
  convergence: 18.715283,
  deployment: 16.439728,
  comparison: 20.52644,
  actor: 26.702948,
} as const;
const narrationEndBaseSec =
  narrationOffsetSec +
  narrationSegments.convergence +
  narrationSegments.deployment +
  narrationSegments.comparison +
  narrationSegments.actor;
const finalTailSec = 0.6286;

const retimeAbsolute = (time: number): number =>
  time <= narrationOffsetSec
    ? time
    : narrationOffsetSec +
      (time - narrationOffsetSec) / FDE_PROTOTYPE_V3_SPEECH_RATE;

export const FDE_PROTOTYPE_V3_DURATION_SEC =
  retimeAbsolute(narrationEndBaseSec) + finalTailSec;

export const fdePrototypeV3DurationFrames = (
  fps = FDE_PROTOTYPE_V3_FPS,
): number => Math.ceil(FDE_PROTOTYPE_V3_DURATION_SEC * fps);

const scenes = {
  prelude: { start: 0, end: narrationOffsetSec },
  convergence: {
    start: narrationOffsetSec,
    end: retimeAbsolute(
      narrationOffsetSec + narrationSegments.convergence,
    ),
  },
  deployment: {
    start: retimeAbsolute(
      narrationOffsetSec + narrationSegments.convergence,
    ),
    end: retimeAbsolute(
      narrationOffsetSec +
        narrationSegments.convergence +
        narrationSegments.deployment,
    ),
  },
  comparison: {
    start: retimeAbsolute(
      narrationOffsetSec +
        narrationSegments.convergence +
        narrationSegments.deployment,
    ),
    end: retimeAbsolute(
      narrationOffsetSec +
        narrationSegments.convergence +
        narrationSegments.deployment +
        narrationSegments.comparison,
    ),
  },
  actor: {
    start: retimeAbsolute(
      narrationOffsetSec +
        narrationSegments.convergence +
        narrationSegments.deployment +
        narrationSegments.comparison,
    ),
    end: FDE_PROTOTYPE_V3_DURATION_SEC,
  },
} as const;

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

const sceneLocal = (time: number, start: number): number =>
  (time - start) * FDE_PROTOTYPE_V3_SPEECH_RATE;

const sceneOpacity = (time: number, start: number, end: number): number => {
  const fadeIn = start === 0 ? 1 : progress(time, start, start + 0.16);
  const fadeOut =
    end >= FDE_PROTOTYPE_V3_DURATION_SEC
      ? 1
      : 1 - progress(time, end - 0.18, end, easeInOut);
  return Math.min(fadeIn, fadeOut);
};

const liftStyle = (
  localTime: number,
  start: number,
  duration = 0.62,
  distance = 22,
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
  const time = frame / FDE_PROTOTYPE_V3_FPS;
  if (time < 2.15) return 0.72;
  if (time < 3.15) {
    return interpolate(time, [2.15, 3.15], [0.72, 0.13], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  if (time < scenes.actor.start) return 0.13;
  if (time < FDE_PROTOTYPE_V3_DURATION_SEC - 3.5) return 0.15;
  return interpolate(
    time,
    [FDE_PROTOTYPE_V3_DURATION_SEC - 3.5, FDE_PROTOTYPE_V3_DURATION_SEC],
    [0.15, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
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
    <div
      style={{
        position: "absolute",
        left: editorial.safe.left,
        right: editorial.safe.right,
        top: 96,
        height: 1,
        backgroundColor: editorial.color.line,
      }}
    />
  </AbsoluteFill>
);

const FrameChrome: React.FC<{ time: number }> = ({ time }) => {
  const route = progress(time, 0, FDE_PROTOTYPE_V3_DURATION_SEC, easeInOut);

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
          fontSize: 18,
          fontWeight: 650,
          width: 430,
          whiteSpace: "nowrap",
          zIndex: 100,
        }}
      >
        <span
          style={{
            color: editorial.color.signal,
            display: "flex",
            flexShrink: 0,
          }}
        >
          {Array.from("AARON GUO").map((letter, index) => (
            <span key={`${letter}-${index}`}>
              {letter === " " ? "\u00a0" : letter}
            </span>
          ))}
        </span>
        <span style={{ color: editorial.color.muted }}>
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
          color: editorial.color.muted,
          fontSize: 16,
          fontVariantNumeric: "tabular-nums",
          zIndex: 100,
        }}
      >
        <div
          style={{
            width: 270,
            height: 3,
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
          {String(
            Math.floor(Math.min(time, FDE_PROTOTYPE_V3_DURATION_SEC)),
          ).padStart(2, "0")}
        </span>
      </div>
    </>
  );
};

const PreludeScene: React.FC<{ time: number }> = ({ time }) => {
  const local = time;
  const title = progress(local, 0.12, 0.88);
  const route = progress(local, 0.18, 2.18, easeInOut);
  const labels = [
    { name: "MODEL", note: "capability", x: 1058 },
    { name: "FIELD", note: "workflow", x: 1324 },
    { name: "PRODUCT", note: "learning", x: 1590 },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity(time, scenes.prelude.start, scenes.prelude.end),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          top: 174,
          color: editorial.color.signal,
          fontSize: editorial.type.label,
          fontWeight: 760,
        }}
      >
        FIELD SIGNAL / 01
      </div>
      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          top: 274,
          color: editorial.color.text,
          fontSize: 190,
          lineHeight: 0.9,
          fontWeight: 840,
          opacity: 0.52 + title * 0.48,
          transform: `translateY(${(1 - title) * 12}px)`,
        }}
      >
        FDE
      </div>
      <div
        style={{
          position: "absolute",
          left: editorial.safe.left + 8,
          top: 492,
          width: 680,
          color: editorial.color.text,
          fontSize: 35,
          lineHeight: 1.2,
          fontWeight: 650,
          ...liftStyle(local, 0.72, 0.58, 18),
        }}
      >
        Forward deployed engineering
      </div>
      <div
        style={{
          position: "absolute",
          left: editorial.safe.left + 8,
          top: 558,
          width: 650,
          color: editorial.color.muted,
          fontSize: 23,
          lineHeight: 1.45,
          ...liftStyle(local, 1.02, 0.62, 16),
        }}
      >
        The engineering layer that turns model capability into operating change.
      </div>

      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d="M 1170 456 L 1688 456"
          fill="none"
          stroke={editorial.color.lineStrong}
          strokeWidth="2"
        />
        <path
          d="M 1170 456 L 1688 456"
          fill="none"
          stroke={editorial.color.signal}
          strokeWidth="4"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - route}
        />
      </svg>

      {labels.map((item, index) => {
        const active = progress(route, index * 0.32, index * 0.32 + 0.3);
        return (
          <div
            key={item.name}
            style={{
              position: "absolute",
              left: item.x,
              top: 402,
              width: 200,
              height: 108,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                item.name === "FIELD"
                  ? editorial.color.signalDark
                  : editorial.color.surface,
              border: `1px solid ${
                active > 0.02
                  ? editorial.color.signal
                  : editorial.color.lineStrong
              }`,
              borderRadius: editorial.radius,
              opacity: 0.48 + active * 0.52,
              transform: `translateY(${(1 - active) * 8}px)`,
            }}
          >
            <div
              style={{
                color: editorial.color.text,
                fontSize: 23,
                fontWeight: 780,
              }}
            >
              {item.name}
            </div>
            <div
              style={{
                marginTop: 7,
                color: editorial.color.muted,
                fontSize: 17,
              }}
            >
              {item.note}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 1058,
          top: 552,
          width: 732,
          color: editorial.color.muted,
          fontSize: 18,
          lineHeight: 1.45,
          textAlign: "center",
          opacity: 0.28 + route * 0.72,
        }}
      >
        Capability enters the field. Field learning returns to the product.
      </div>
    </AbsoluteFill>
  );
};

interface CompanyMarker {
  name: string;
  index: string;
  at: number;
}

const companyMarkers: CompanyMarker[] = [
  { name: "Anthropic", index: "01", at: 1.8 },
  { name: "OpenAI", index: "02", at: 2.9 },
  { name: "AWS", index: "03", at: 4.25 },
  { name: "Microsoft", index: "04", at: 5.75 },
];

const CompanyCard: React.FC<{
  marker: CompanyMarker;
  local: number;
  x: number;
}> = ({ marker, local, x }) => {
  const enter = progress(local, marker.at, marker.at + 0.68);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 298,
        width: 330,
        height: 232,
        padding: "26px 26px",
        boxSizing: "border-box",
        backgroundColor: editorial.color.surface,
        color: editorial.color.text,
        border: `1px solid ${editorial.color.lineStrong}`,
        borderTop: `5px solid ${editorial.color.signal}`,
        borderRadius: editorial.radius,
        opacity: 0.24 + enter * 0.76,
        transformOrigin: "left center",
        transform: `perspective(1000px) rotateY(${(1 - enter) * -12}deg) translateY(${(1 - enter) * 10}px)`,
        boxShadow: `0 30px 72px ${editorial.color.shadowSoft}`,
      }}
    >
      <div
        style={{
          color: editorial.color.quiet,
          fontSize: 16,
          fontWeight: 720,
          fontVariantNumeric: "tabular-nums",
          opacity: 0.6 + enter * 0.4,
        }}
      >
        SIGNAL {marker.index} / 04
      </div>
      <div
        style={{
          marginTop: 58,
          fontSize: 41,
          fontWeight: 790,
          lineHeight: 1.05,
          opacity: 0.26 + enter * 0.74,
        }}
      >
        {marker.name}
      </div>
      <div
        style={{
          marginTop: 22,
          width: 52,
          height: 4,
          backgroundColor: editorial.color.signal,
          transformOrigin: "left center",
          transform: `scaleX(${enter})`,
        }}
      />
    </div>
  );
};

const ConvergenceScene: React.FC<{ time: number }> = ({ time }) => {
  const local = sceneLocal(time, scenes.convergence.start);
  const converge = progress(local, 8.7, 11.55, easeInOut);
  const stageShift = progress(local, 11.9, 12.7, easeInOut);
  const question = progress(local, 13.0, 13.72);
  const cardXs = [112, 524, 936, 1348];
  const evidenceOpacity = 1 - stageShift;

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity(
          time,
          scenes.convergence.start,
          scenes.convergence.end,
        ),
      }}
    >
      <SceneHeader
        title="Four companies."
        aside={
          <>
            <span style={{ color: editorial.color.signal }}>59 days</span>
            <br />
            one deployment move
          </>
        }
        opacity={progress(local, 0, 0.52)}
        transform={`translateY(${(1 - progress(local, 0, 0.52)) * 18}px)`}
      />

      <div style={{ opacity: evidenceOpacity }}>
        {companyMarkers.map((marker, index) => (
          <CompanyCard
            key={marker.name}
            marker={marker}
            local={local}
            x={cardXs[index]}
          />
        ))}

        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", inset: 0 }}
        >
          {cardXs.map((x) => (
            <path
              key={x}
              d={`M ${x + 165} 550 C ${x + 165} 646 900 638 960 712`}
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
            left: 690,
            top: 690,
            width: 540,
            height: 88,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: editorial.color.signalDark,
            border: `1px solid ${editorial.color.signal}`,
            borderRadius: editorial.radius,
            color: editorial.color.text,
            fontSize: 25,
            fontWeight: 740,
            textTransform: "uppercase",
            opacity: converge,
            transform: `scale(${0.95 + converge * 0.05})`,
          }}
        >
          Engineers closer to customers
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          top: 286,
          width: editorial.safe.width,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 18,
          opacity: stageShift,
          transform: `translateY(${(1 - stageShift) * 12}px)`,
        }}
      >
        {companyMarkers.map((marker) => (
          <div
            key={marker.name}
            style={{
              height: 58,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 18px",
              boxSizing: "border-box",
              backgroundColor: editorial.color.surface,
              borderTop: `2px solid ${editorial.color.signal}`,
              color: editorial.color.text,
              fontSize: 20,
              fontWeight: 720,
            }}
          >
            <span>{marker.name}</span>
            <span style={{ color: editorial.color.quiet }}>{marker.index}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 240,
          right: 240,
          top: 430,
          textAlign: "center",
          opacity: question,
          transform: `translateY(${(1 - question) * 22}px)`,
        }}
      >
        <div
          style={{
            color: editorial.color.muted,
            fontSize: 23,
            fontWeight: 720,
            textTransform: "uppercase",
          }}
        >
          If models were the whole product
        </div>
        <div
          style={{
            marginTop: 30,
            color: editorial.color.text,
            fontSize: 82,
            lineHeight: 1.04,
            fontWeight: 830,
          }}
        >
          Why spend billions on people?
        </div>
      </div>
    </AbsoluteFill>
  );
};

const operatingLayers = [
  { label: "Data", at: 5.35 },
  { label: "Permissions", at: 6.2 },
  { label: "Approvals", at: 7.1 },
  { label: "Exceptions", at: 8.15 },
  { label: "Recovery", at: 9.35 },
];

const DeploymentScene: React.FC<{ time: number }> = ({ time }) => {
  const local = sceneLocal(time, scenes.deployment.start);
  const turn = progress(local, 3.1, 5.35, easeInOut);
  const modelTurn = informationalPlaneTurn(turn);
  const system = progress(local, 4.25, 5.45);
  const closeGap = progress(local, 11.1, 12.15);
  const stageTop = 306;
  const modelTop = 12;
  const modelHeight = 400;
  const deploymentBandTop =
    stageTop +
    modelTop +
    modelHeight +
    editorialMotionBounds.protectedZoneGapPx +
    24;

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity(
          time,
          scenes.deployment.start,
          scenes.deployment.end,
        ),
      }}
    >
      <SceneHeader
        title="A demo is not a working system."
        aside="The operating work lives behind the surface."
        opacity={progress(local, 0, 0.52)}
        transform={`translateY(${(1 - progress(local, 0, 0.52)) * 18}px)`}
      />

      <div
        style={{
          position: "absolute",
          left: 126,
          top: stageTop,
          width: 1670,
          height: 438,
          perspective: 1600,
          transformStyle: "preserve-3d",
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
            border: `1px solid ${signalWithAlpha(0.22 + system * 0.5)}`,
            borderRadius: editorial.radius,
            opacity: system,
            transform: `translateX(${(1 - system) * -58}px)`,
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
            {operatingLayers.map((layer, index) => {
              const reveal = progress(local, layer.at, layer.at + 0.56);
              return (
                <div
                  key={layer.label}
                  style={{
                    minHeight: 92,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    borderTop: `1px solid ${editorial.color.lineStrong}`,
                    color: editorial.color.text,
                    opacity: 0.24 + reveal * 0.76,
                    transform: `translateX(${(1 - reveal) * 18}px)`,
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
                  <span style={{ fontSize: 27, fontWeight: 690 }}>
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
          top: deploymentBandTop,
          display: "grid",
          gridTemplateColumns: "230px 1fr 420px",
          alignItems: "center",
          gap: 24,
          opacity: closeGap,
          transform: `translateY(${(1 - closeGap) * 18}px)`,
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

const PanelHeader: React.FC<{
  eyebrow: string;
  title: string;
  signal?: boolean;
}> = ({ eyebrow, title, signal = false }) => (
  <div style={{ height: 154 }}>
    <div
      style={{
        color: signal ? editorial.color.signal : editorial.color.muted,
        fontSize: editorial.type.label,
        fontWeight: 760,
        textTransform: "uppercase",
      }}
    >
      {eyebrow}
    </div>
    <div
      style={{
        marginTop: 18,
        width: 720,
        color: editorial.color.text,
        fontSize: editorial.type.panelTitle,
        lineHeight: 1.08,
        fontWeight: 770,
      }}
    >
      {title}
    </div>
  </div>
);

const ComparisonScene: React.FC<{ time: number }> = ({ time }) => {
  const local = sceneLocal(time, scenes.comparison.start);
  const leftReveal = progress(local, 3.2, 4.05);
  const handoff = progress(local, 4.7, 6.25, easeInOut);
  const handoffNode = dependentReveal(handoff, 0.82);
  const rightReveal = progress(local, 7.55, 8.45);
  const loop = progress(local, 9.6, 16.85, easeInOut);
  const loopArrow = dependentReveal(loop, 0.985);
  const resolution = progress(local, 17.85, 18.72);

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity(
          time,
          scenes.comparison.start,
          scenes.comparison.end,
        ),
      }}
    >
      <SceneHeader
        eyebrow="Same customer proximity. Different center of gravity."
        title="Do not draw an equals sign."
        titleSize={60}
        opacity={progress(local, 0, 0.52)}
        transform={`translateY(${(1 - progress(local, 0, 0.52)) * 18}px)`}
      />

      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          top: 292,
          width: 780,
        }}
      >
        <PanelHeader eyebrow="Consulting" title="Recommendation and handoff" />
        <div
          style={{
            marginTop: 38,
            height: 248,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: leftReveal,
          }}
        >
          <FlowNode label="RECOMMENDATION" tone="paper" width={270} />
          <div
            style={{
              width: 148,
              height: 3,
              backgroundColor: editorial.color.tension,
              transformOrigin: "left center",
              transform: `scaleX(${handoff})`,
            }}
          />
          <FlowNode
            label="HANDOFF"
            tone="tension"
            width={180}
            opacity={handoffNode}
            transform={`translateX(${(1 - handoffNode) * -10}px)`}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1028,
          top: 292,
          width: 780,
        }}
      >
        <PanelHeader
          eyebrow="Forward deployed engineering"
          title="Production and product learning"
          signal
        />
        <div
          style={{
            position: "relative",
            marginTop: 38,
            width: 780,
            height: 248,
            opacity: rightReveal,
          }}
        >
          <svg
            width="780"
            height="248"
            viewBox="0 0 780 248"
            style={{ position: "absolute", inset: 0 }}
          >
            <path
              d="M 118 112 C 230 18 518 18 648 112 C 706 154 646 220 510 218 L 154 218 C 56 218 40 154 118 112"
              fill="none"
              stroke={editorial.color.lineStrong}
              strokeWidth="2"
            />
            <path
              d="M 118 112 C 230 18 518 18 648 112 C 706 154 646 220 510 218 L 154 218 C 56 218 40 154 118 112"
              fill="none"
              stroke={editorial.color.signal}
              strokeWidth="4"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={1 - loop}
            />
            <path
              d="M 112 110 L 132 100 L 130 123"
              fill="none"
              stroke={editorial.color.signal}
              strokeWidth="4"
              opacity={loopArrow}
            />
          </svg>
          {[
            { label: "PRODUCTION", left: 22, top: 70, at: 0 },
            { label: "FIELD LEARNING", left: 280, top: 20, at: 0.3 },
            { label: "PRODUCT", left: 548, top: 132, at: 0.62 },
          ].map((node) => {
            const active = progress(loop, node.at, node.at + 0.2);
            return (
              <div
                key={node.label}
                style={{
                  position: "absolute",
                  left: node.left,
                  top: node.top,
                }}
              >
                <FlowNode
                  label={node.label}
                  tone="signal"
                  width={node.label === "FIELD LEARNING" ? 220 : 190}
                  height={88}
                  fontSize={20}
                  opacity={0.34 + active * 0.66}
                  transform={`translateY(${(1 - active) * 6}px)`}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 960,
          top: 292,
          height: 520,
          width: 1,
          backgroundColor: editorial.color.lineStrong,
        }}
      />

      <div style={{ position: "absolute", top: 800 }}>
        <OutcomeBand
          label="What compounds?"
          left="PROJECT ARTIFACT"
          right="REUSABLE CAPABILITY"
          opacity={resolution}
          transform={`translateY(${(1 - resolution) * 14}px)`}
        />
      </div>
    </AbsoluteFill>
  );
};

const actorItems = [
  {
    letter: "A",
    label: "Action",
    question: "What work changes?",
    at: 2.95,
  },
  {
    letter: "C",
    label: "Context",
    question: "What may the system know?",
    at: 5.32,
  },
  {
    letter: "T",
    label: "Trust",
    question: "When may it act?",
    at: 8.3,
  },
  {
    letter: "O",
    label: "Outcome",
    question: "What proves value?",
    at: 12.5,
  },
  {
    letter: "R",
    label: "Recursive",
    question: "How does the next run improve?",
    at: 15.1,
  },
];

const ActorScene: React.FC<{ time: number }> = ({ time }) => {
  const local = sceneLocal(time, scenes.actor.start);
  const title = progress(local, 0.35, 1.0);
  const recursive = progress(local, 15.1, 18.5, easeInOut);
  const arrowHead = dependentReveal(recursive, 0.985);
  const resolution = progress(local, 19.05, 20.05);

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity(time, scenes.actor.start, scenes.actor.end),
      }}
    >
      <SceneHeader
        eyebrow="My deployment framework"
        title="ACTOR"
        aside="Five questions before AI becomes operating capacity."
        titleSize={82}
        opacity={title}
        transform={`translateY(${(1 - title) * 18}px)`}
      />

      <div
        style={{
          position: "absolute",
          left: editorial.safe.left,
          top: 300,
          width: editorial.safe.width,
          height: 286,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 20,
          transform: `translateY(${-resolution * 46}px) scale(${1 - resolution * 0.08})`,
          transformOrigin: "center top",
        }}
      >
        {actorItems.map((item) => {
          const reveal = progress(local, item.at, item.at + 0.68);
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
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - resolution,
        }}
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
          left: 300,
          right: 300,
          top: 640,
          textAlign: "center",
          opacity: resolution,
          transform: `translateY(${(1 - resolution) * 22}px)`,
        }}
      >
        <div
          style={{
            color: editorial.color.muted,
            fontSize: 26,
            fontWeight: 680,
          }}
        >
          Tokens are inputs.
        </div>
        <div
          style={{
            marginTop: 16,
            color: editorial.color.text,
            fontSize: 66,
            lineHeight: 1.03,
            fontWeight: 820,
          }}
        >
          Value appears when the workflow changes.
        </div>
        <div
          style={{
            marginTop: 18,
            color: editorial.color.signal,
            fontSize: 32,
            fontWeight: 760,
          }}
        >
          The customer keeps the capability.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const retimedWordTimings = fdePrototypeWordTimingsV3.map((timing) => ({
  ...timing,
  start: retimeAbsolute(timing.start),
  end: retimeAbsolute(timing.end),
}));

const captionSegments = buildCaptionSegments(retimedWordTimings, 8);

const EditorialCaption: React.FC<{ time: number }> = ({ time }) => {
  const active = captionSegments.find(
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
        backgroundColor: editorial.color.captionSurface,
        borderTop: `2px solid ${editorial.color.signal}`,
        color: editorial.color.text,
        fontSize: editorial.type.caption,
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

export const FdeFieldSignalPrototypeV3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const endFade =
    1 -
    progress(
      time,
      FDE_PROTOTYPE_V3_DURATION_SEC - 0.7,
      FDE_PROTOTYPE_V3_DURATION_SEC,
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
      <Audio
        src={staticFile("fde-field-signal-prototype/music-edit-v3.mp3")}
        volume={musicVolume}
      />
      <Sequence from={Math.round(narrationOffsetSec * fps)}>
        <Audio
          src={staticFile("fde-field-signal-prototype/narration-v3.mp3")}
        />
      </Sequence>

      <FieldBackdrop />
      <PreludeScene time={time} />
      <ConvergenceScene time={time} />
      <DeploymentScene time={time} />
      <ComparisonScene time={time} />
      <ActorScene time={time} />
      <FrameChrome time={time} />
      <EditorialCaption time={time} />

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
