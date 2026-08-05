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
import { SemanticSprite } from "./editorial/SemanticSprite";
import {
  AUTHORITY_BOUNDARY_CONCEPT_RUNTIME,
  AUTHORITY_LEDGER_RUNTIME_ASSET,
  type SemanticSpriteRuntimeAsset,
} from "./editorial/SemanticSpriteRuntimeRegistry";

export const AUTHORITY_BOUNDARY_CONCEPT_FPS =
  AUTHORITY_BOUNDARY_CONCEPT_RUNTIME.fps;
export const AUTHORITY_BOUNDARY_CONCEPT_DURATION_SEC = 55.635012;

export const authorityBoundaryConceptDurationFrames = (
  fps = AUTHORITY_BOUNDARY_CONCEPT_FPS,
): number => Math.ceil(AUTHORITY_BOUNDARY_CONCEPT_DURATION_SEC * fps);

const palette = {
  paper: "#f4f3ef",
  ink: "#0a2346",
  text: "#182334",
  muted: "#6e7783",
  pale: "#c8cdd3",
  white: "#fbfbf8",
} as const;

const type = {
  serif: 'Georgia, "Times New Roman", serif',
  sans: 'Arial, Helvetica, sans-serif',
  mono: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
} as const;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

const ramp = (
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

const between = (time: number, start: number, end: number): boolean =>
  time >= start && time < end;

type CaptionSegment = {
  start: number;
  end: number;
  text: string;
};

const captions: CaptionSegment[] = [
  {
    start: 0,
    end: 5.85,
    text: "The debate over reading AI-generated code starts with the wrong question.",
  },
  {
    start: 6.502,
    end: 13.421,
    text: "Writing code does not grant authority over what a business treats as true.",
  },
  {
    start: 13.421,
    end: 17.926,
    text: "For disposable work, I may judge the result and move on.",
  },
  {
    start: 17.926,
    end: 24.3,
    text: "But when an agent touches a critical system or a system of record, the decision changes.",
  },
  {
    start: 24.904,
    end: 29.931,
    text: "The question is not who wrote it. It is what the code is allowed to change.",
  },
  {
    start: 30.651,
    end: 33.72,
    text: "My rule: review depth follows authority.",
  },
  {
    start: 34.075,
    end: 36.42,
    text: "Low-risk work can move fast.",
  },
  {
    start: 36.746,
    end: 44.675,
    text: "Critical changes need a named human who understands the intent, risk, and recovery plan.",
  },
  {
    start: 44.675,
    end: 46.94,
    text: "AI can propose the change.",
  },
  {
    start: 47.148,
    end: 49.52,
    text: "It cannot own the consequence.",
  },
  {
    start: 50.213,
    end: 55.635,
    text: "Before you ship, ask: what can this code change—and who owns the result?",
  },
];

const Header: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 124,
      top: 48,
      color: palette.muted,
      fontFamily: type.mono,
      fontSize: 15,
      fontWeight: 650,
      letterSpacing: 2.6,
      zIndex: 100,
    }}
  >
    AARON GUO
  </div>
);

const QuietCaptions: React.FC<{ time: number }> = ({ time }) => {
  const active = captions.find(
    (caption) => time >= caption.start && time <= caption.end,
  );
  if (!active) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 250,
        right: 250,
        bottom: 34,
        minHeight: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: palette.text,
        fontFamily: type.sans,
        fontSize: 29,
        fontWeight: 500,
        lineHeight: 1.28,
        textAlign: "center",
        zIndex: 120,
      }}
    >
      {active.text}
    </div>
  );
};

const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      color: palette.ink,
      fontFamily: type.mono,
      fontSize: 16,
      fontWeight: 650,
      letterSpacing: 2.4,
      lineHeight: 1.2,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const SharedAuthorityAxis: React.FC<{ time: number }> = ({ time }) => {
  const visible = ramp(time, 6.15, 7.2) * (1 - ramp(time, 30.15, 31.25));
  const bridge = ramp(time, 12.55, 14.35, easeInOut);
  const authorityMove = ramp(time, 17.93, 23.95, easeInOut);
  const markerPosition =
    (1 - bridge) * 0.49 + bridge * (0.13 + authorityMove * 0.71);

  return (
    <div
      style={{
        position: "absolute",
        left: 210,
        right: 210,
        top: 604,
        height: 90,
        opacity: visible,
        zIndex: 30,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 35,
          height: 2,
          backgroundColor: palette.pale,
          transform: `scaleX(${ramp(time, 6.15, 7.2)})`,
          transformOrigin: "center center",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 35,
          width: `${markerPosition * 100}%`,
          height: 2,
          backgroundColor: palette.ink,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${markerPosition * 100}%`,
          top: 22,
          width: 28,
          height: 28,
          borderRadius: "50%",
          backgroundColor: palette.paper,
          border: `5px solid ${palette.ink}`,
          boxSizing: "border-box",
          transform: "translateX(-14px)",
        }}
      />
    </div>
  );
};

const OpeningScene: React.FC<{ time: number }> = ({ time }) => {
  if (!between(time, 0, 13.7)) return null;

  const questionExit = ramp(time, 4.75, 5.85, easeInOut);
  const strike = ramp(time, 3.35, 4.75, easeInOut);
  const authorityIn = ramp(time, 5.85, 7.05);
  const authorityExit = ramp(time, 12.42, 13.12, easeInOut);
  const truthIn = ramp(time, 9.15, 10.45);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          top: 156,
          opacity: 1 - questionExit,
          transform: `translateY(${-18 * questionExit}px)`,
        }}
      >
        <Kicker>The public debate</Kicker>
        <div
          style={{
            position: "relative",
            marginTop: 24,
            maxWidth: 1510,
            color: palette.text,
            fontFamily: type.serif,
            fontSize: 112,
            fontWeight: 700,
            letterSpacing: -3.8,
            lineHeight: 0.96,
          }}
        >
          Should we read
          <br />
          AI-generated code?
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 51,
              width: "88%",
              height: 8,
              backgroundColor: palette.ink,
              transform: `scaleX(${strike})`,
              transformOrigin: "left center",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 42,
            color: palette.muted,
            fontFamily: type.sans,
            fontSize: 27,
            fontWeight: 500,
            opacity: ramp(time, 1.25, 2.1),
          }}
        >
          Read the source&nbsp;&nbsp;·&nbsp;&nbsp;Trust the evidence
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          top: 166,
          opacity: authorityIn * (1 - authorityExit),
          transform: `translateY(${(1 - authorityIn) * 22 - authorityExit * 18}px)`,
        }}
      >
        <Kicker>The missing distinction</Kicker>
        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "1fr 180px 1fr",
            alignItems: "end",
          }}
        >
          <div
            style={{
              color: palette.text,
              fontFamily: type.serif,
              fontSize: 108,
              fontWeight: 700,
              letterSpacing: -3.3,
              lineHeight: 0.93,
            }}
          >
            Writing
            <br />
            code
          </div>
          <div
            style={{
              alignSelf: "center",
              color: palette.ink,
              fontFamily: type.serif,
              fontSize: 82,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            ≠
          </div>
          <div
            style={{
              color: palette.ink,
              fontFamily: type.serif,
              fontSize: 108,
              fontWeight: 700,
              letterSpacing: -3.3,
              lineHeight: 0.93,
              textAlign: "right",
            }}
          >
            Authority
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 340,
            width: 570,
            color: palette.muted,
            fontFamily: type.sans,
            fontSize: 25,
            lineHeight: 1.3,
            textAlign: "right",
            opacity: truthIn,
          }}
        >
          over what a business treats as <b style={{ color: palette.ink }}>true</b>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ContinuumScene: React.FC<{
  time: number;
  spriteRuntimeAsset: SemanticSpriteRuntimeAsset;
}> = ({ time, spriteRuntimeAsset }) => {
  if (!between(time, 12.65, 31.3)) return null;

  const bridgeIn = ramp(time, 13.18, 14.05, easeInOut);
  const lowRiskExit = ramp(time, 17.42, 18.08, easeInOut);
  const authorityIn = ramp(time, 18.08, 18.86);
  const systemsIn = ramp(time, 19.0, 21.85, easeInOut);
  const authorityOut = ramp(time, 23.95, 24.48, easeInOut);
  const questionIn = ramp(time, 24.56, 25.45);
  const secondLineIn = ramp(time, 27.25, 28.12);
  const sceneExit = ramp(time, 29.72, 30.38, easeInOut);

  return (
    <AbsoluteFill style={{ opacity: 1 - sceneExit }}>
      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          top: 154,
        }}
      >
        <div
          style={{
            opacity: bridgeIn * (1 - lowRiskExit),
            transform: `translateY(${(1 - bridgeIn) * 16 - lowRiskExit * 14}px)`,
          }}
        >
          <Kicker>Low consequence</Kicker>
          <div
            style={{
              marginTop: 26,
              maxWidth: 1200,
              color: palette.text,
              fontFamily: type.serif,
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: -3.1,
              lineHeight: 0.95,
            }}
          >
            Move fast where
            <br />
            failure is cheap.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: authorityIn * (1 - authorityOut),
            transform: `translateY(${(1 - authorityIn) * 18}px)`,
          }}
        >
          <Kicker>Authority changes the decision</Kicker>
          <div
            style={{
              marginTop: 26,
              color: palette.text,
              fontFamily: type.serif,
              fontSize: 100,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 0.94,
            }}
          >
            Critical system.
            <br />
            System of record.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: questionIn,
            transform: `translateY(${(1 - questionIn) * 18}px)`,
          }}
        >
          <Kicker>Ask before authorship</Kicker>
          <div
            style={{
              marginTop: 28,
              color: palette.muted,
              fontFamily: type.serif,
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1,
              textDecoration: "line-through",
              textDecorationThickness: 3,
            }}
          >
            Who wrote it?
          </div>
          <div
            style={{
              marginTop: 30,
              maxWidth: 1480,
              color: palette.text,
              fontFamily: type.serif,
              fontSize: 106,
              fontWeight: 700,
              letterSpacing: -3.2,
              lineHeight: 0.95,
              opacity: secondLineIn,
              clipPath: `inset(0 ${(1 - secondLineIn) * 100}% 0 0)`,
            }}
          >
            What is this code
            <br />
            allowed to change?
          </div>
        </div>
      </div>

      <SemanticSprite
        src={staticFile(spriteRuntimeAsset.staticFilePath)}
        startFrame={Math.round(
          spriteRuntimeAsset.visibleFromSec * AUTHORITY_BOUNDARY_CONCEPT_FPS,
        )}
        endFrame={Math.round(
          spriteRuntimeAsset.visibleUntilSec * AUTHORITY_BOUNDARY_CONCEPT_FPS,
        )}
        enterFrames={Math.round(
          spriteRuntimeAsset.enterDurationSec * AUTHORITY_BOUNDARY_CONCEPT_FPS,
        )}
        exitFrames={Math.round(
          spriteRuntimeAsset.exitDurationSec * AUTHORITY_BOUNDARY_CONCEPT_FPS,
        )}
        translateY={spriteRuntimeAsset.translateY}
        exitTranslateY={spriteRuntimeAsset.exitTranslateY}
        maxOpacity={spriteRuntimeAsset.maxOpacity}
        style={{
          position: "absolute",
          right: 124,
          top: 290,
          width: 390,
          height: "auto",
          filter: "saturate(0.72) contrast(0.92)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 210,
          right: 210,
          top: 662,
          display: "flex",
          justifyContent: "space-between",
          color: palette.muted,
          fontFamily: type.mono,
          fontSize: 15,
          fontWeight: 650,
          letterSpacing: 2,
          opacity: bridgeIn * (1 - questionIn * 0.72),
        }}
      >
        <span>DISPOSABLE</span>
        <div
          style={{
            display: "flex",
            gap: 44,
            color: palette.ink,
            opacity: systemsIn,
          }}
        >
          <span>CRITICAL SYSTEM</span>
          <span>SYSTEM OF RECORD</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const RuleScene: React.FC<{ time: number }> = ({ time }) => {
  if (!between(time, 30.2, 45.4)) return null;

  const entry = ramp(time, 30.44, 31.2);
  const lowRisk = ramp(time, 33.9, 34.52);
  const owner = ramp(time, 36.58, 37.38);
  const intent = ramp(time, 39.28, 39.92);
  const risk = ramp(time, 41.12, 41.72);
  const recovery = ramp(time, 42.7, 43.38);
  const exit = ramp(time, 43.95, 44.62, easeInOut);

  const responsibilities = [
    ["INTENT", intent],
    ["RISK", risk],
    ["RECOVERY", recovery],
  ] as const;

  return (
    <AbsoluteFill
      style={{
        opacity: entry * (1 - exit),
        transform: `translateY(${(1 - entry) * 18 - exit * 16}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          top: 154,
        }}
      >
        <Kicker>One operating rule</Kicker>
        <div
          style={{
            marginTop: 28,
            maxWidth: 1600,
            color: palette.text,
            fontFamily: type.serif,
            fontSize: 110,
            fontWeight: 700,
            letterSpacing: -3.4,
            lineHeight: 0.94,
          }}
        >
          Review depth
          <br />
          follows <span style={{ color: palette.ink }}>authority.</span>
        </div>

        <div
          style={{
            marginTop: 52,
            color: palette.muted,
            fontFamily: type.mono,
            fontSize: 17,
            fontWeight: 650,
            letterSpacing: 2.1,
            opacity: lowRisk,
          }}
        >
          LOW RISK&nbsp;&nbsp;→&nbsp;&nbsp;MOVE FAST
        </div>

        <div
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "410px 1fr",
            alignItems: "end",
            columnGap: 84,
            opacity: owner,
          }}
        >
          <div>
            <div
              style={{
                color: palette.ink,
                fontFamily: type.mono,
                fontSize: 15,
                fontWeight: 650,
                letterSpacing: 2.2,
              }}
            >
              CRITICAL CHANGE
            </div>
            <div
              style={{
                marginTop: 13,
                color: palette.text,
                fontFamily: type.serif,
                fontSize: 54,
                fontWeight: 700,
              }}
            >
              Named human
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              columnGap: 54,
            }}
          >
            {responsibilities.map(([label, progress]) => (
              <div
                key={label}
                style={{
                  color: palette.ink,
                  fontFamily: type.serif,
                  fontSize: 41,
                  fontWeight: 700,
                  opacity: progress,
                  transform: `translateY(${(1 - progress) * 12}px)`,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FinalScene: React.FC<{ time: number }> = ({ time }) => {
  if (!between(time, 44.35, AUTHORITY_BOUNDARY_CONCEPT_DURATION_SEC + 0.1)) {
    return null;
  }

  const entry = ramp(time, 44.68, 45.25);
  const panel = ramp(time, 46.8, 47.8, easeInOut);
  const statementExit = ramp(time, 49.15, 49.52, easeInOut);
  const reset = ramp(time, 49.65, 50.28, easeInOut);
  const finalIn = ramp(time, 50.28, 51.08);

  return (
    <AbsoluteFill style={{ opacity: entry }}>
      <div
        style={{
          position: "absolute",
          left: 124,
          top: 180,
          width: 1030,
          opacity: 1 - statementExit,
          transform: `translateY(${(1 - entry) * 18 - statementExit * 18}px)`,
        }}
      >
        <Kicker>Capability is not ownership</Kicker>
        <div
          style={{
            marginTop: 28,
            color: palette.text,
            fontFamily: type.serif,
            fontSize: 112,
            fontWeight: 700,
            letterSpacing: -3.4,
            lineHeight: 0.94,
          }}
        >
          AI can propose
          <br />
          the change.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 650,
          backgroundColor: palette.ink,
          clipPath: `inset(0 0 0 ${(1 - panel * (1 - reset)) * 100}%)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 66,
            right: 66,
            top: 280,
            color: palette.white,
            fontFamily: type.serif,
            fontSize: 66,
            fontWeight: 700,
            lineHeight: 0.98,
            opacity: ramp(time, 47.1, 47.9) * (1 - statementExit),
          }}
        >
          Cannot own
          <br />
          the consequence.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 152,
          bottom: 164,
          width: 3,
          backgroundColor: palette.ink,
          opacity: reset,
          transform: "translateX(-1.5px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          top: 196,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: 120,
          opacity: finalIn,
          transform: `translateY(${(1 - finalIn) * 18}px)`,
        }}
      >
        <div>
          <Kicker>Before you ship</Kicker>
          <div
            style={{
              marginTop: 28,
              color: palette.text,
              fontFamily: type.serif,
              fontSize: 77,
              fontWeight: 700,
              letterSpacing: -2.2,
              lineHeight: 0.96,
            }}
          >
            What can this
            <br />
            code change?
          </div>
        </div>
        <div style={{ paddingLeft: 60 }}>
          <Kicker>Accountability</Kicker>
          <div
            style={{
              marginTop: 28,
              color: palette.ink,
              fontFamily: type.serif,
              fontSize: 77,
              fontWeight: 700,
              letterSpacing: -2.2,
              lineHeight: 0.96,
            }}
          >
            Who owns
            <br />
            the result?
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AuthorityBoundaryConceptPrototype: React.FC<{
  spriteRuntimeAsset?: SemanticSpriteRuntimeAsset;
}> = ({ spriteRuntimeAsset = AUTHORITY_LEDGER_RUNTIME_ASSET }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: palette.paper,
        color: palette.text,
        fontFamily: type.sans,
      }}
    >
      <Audio src={staticFile("authority-boundary/narration-concept-v3.mp3")} />
      <Header />
      <SharedAuthorityAxis time={time} />
      <OpeningScene time={time} />
      <ContinuumScene time={time} spriteRuntimeAsset={spriteRuntimeAsset} />
      <RuleScene time={time} />
      <FinalScene time={time} />
      <QuietCaptions time={time} />
    </AbsoluteFill>
  );
};
