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
  AUTHORITY_BOUNDARY_CAPTIONS,
  type CaptionSegment,
} from "./AuthorityBoundaryVideo";

export const AUTHORITY_BOUNDARY_INDIGO_FPS = 30;
export const AUTHORITY_BOUNDARY_INDIGO_START_SEC = 60.418322;
export const AUTHORITY_BOUNDARY_INDIGO_END_SEC = 148.271628;

export const authorityBoundaryIndigoDurationFrames = (
  fps = AUTHORITY_BOUNDARY_INDIGO_FPS,
): number =>
  Math.ceil(
    (AUTHORITY_BOUNDARY_INDIGO_END_SEC -
      AUTHORITY_BOUNDARY_INDIGO_START_SEC) *
      fps,
  );

const palette = {
  ink: "#0a1f3d",
  inkSoft: "#203650",
  paper: "#f1f3f5",
  paperWarm: "#f7f7f4",
  paperTint: "#e4e8ec",
  text: "#162334",
  muted: "#66717e",
  faint: "#9aa5b0",
  rule: "rgba(10, 31, 61, 0.18)",
  ruleStrong: "rgba(10, 31, 61, 0.42)",
  white: "#f7f8f8",
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

const isActive = (
  time: number,
  start: number,
  end: number,
): boolean => time >= start && time < end;

const PaperField: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <AbsoluteFill
    style={{
      backgroundColor: dark ? palette.ink : palette.paper,
      color: dark ? palette.paper : palette.text,
    }}
  >
    <AbsoluteFill
      style={{
        opacity: dark ? 0.08 : 0.26,
        backgroundImage: dark
          ? "repeating-linear-gradient(0deg, rgba(241,243,245,0.11) 0px, rgba(241,243,245,0.11) 1px, transparent 1px, transparent 8px)"
          : "repeating-linear-gradient(0deg, rgba(10,31,61,0.045) 0px, rgba(10,31,61,0.045) 1px, transparent 1px, transparent 8px)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 96,
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: dark
          ? "rgba(241,243,245,0.13)"
          : "rgba(10,31,61,0.11)",
      }}
    />
    <div
      style={{
        position: "absolute",
        right: 96,
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: dark
          ? "rgba(241,243,245,0.13)"
          : "rgba(10,31,61,0.11)",
      }}
    />
  </AbsoluteFill>
);

const Folio: React.FC<{
  section: string;
  index: string;
  dark?: boolean;
}> = ({ section, index, dark = false }) => {
  const color = dark ? "rgba(247,248,248,0.7)" : palette.muted;
  const rule = dark ? "rgba(247,248,248,0.24)" : palette.rule;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          top: 46,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color,
          fontFamily: type.mono,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 2.1,
          textTransform: "uppercase",
          zIndex: 30,
        }}
      >
        <span>Aaron Guo · Field Journal</span>
        <span>
          {section} · {index}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          top: 84,
          height: 1,
          backgroundColor: rule,
          zIndex: 30,
        }}
      />
    </>
  );
};

const Kicker: React.FC<{
  children: React.ReactNode;
  dark?: boolean;
}> = ({ children, dark = false }) => (
  <div
    style={{
      color: dark ? "rgba(247,248,248,0.72)" : palette.ink,
      fontFamily: type.mono,
      fontSize: 15,
      fontWeight: 650,
      letterSpacing: 2.25,
      lineHeight: 1.2,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const QuietCaption: React.FC<{ time: number }> = ({ time }) => {
  let active: CaptionSegment | undefined;
  for (
    let index = AUTHORITY_BOUNDARY_CAPTIONS.length - 1;
    index >= 0;
    index -= 1
  ) {
    const segment = AUTHORITY_BOUNDARY_CAPTIONS[index];
    if (time >= segment.start && time <= segment.end + 0.28) {
      active = segment;
      break;
    }
  }
  if (!active) return null;

  const inverse = time >= 124.18 && time < 128.963628;
  return (
    <div
      style={{
        position: "absolute",
        left: 260,
        right: 260,
        bottom: 30,
        minHeight: 76,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "13px 28px 10px",
        boxSizing: "border-box",
        borderTop: `1px solid ${
          inverse ? "rgba(247,248,248,0.34)" : palette.ruleStrong
        }`,
        color: inverse ? palette.white : palette.text,
        backgroundColor: inverse
          ? "rgba(10,31,61,0.9)"
          : "rgba(241,243,245,0.94)",
        fontFamily: type.sans,
        fontSize: 29,
        fontWeight: 500,
        lineHeight: 1.27,
        textAlign: "center",
        zIndex: 120,
      }}
    >
      {active.text}
    </div>
  );
};

const ProofRow: React.FC<{
  label: string;
  value: string;
  opacity: number;
}> = ({ label, value, opacity }) => (
  <div
    style={{
      minHeight: 82,
      display: "grid",
      gridTemplateColumns: "240px 1fr",
      alignItems: "center",
      borderTop: `1px solid ${palette.ruleStrong}`,
      opacity,
      transform: `translateY(${(1 - opacity) * 12}px)`,
    }}
  >
    <div
      style={{
        color: palette.muted,
        fontFamily: type.mono,
        fontSize: 15,
        fontWeight: 650,
        letterSpacing: 1.8,
      }}
    >
      {label}
    </div>
    <div
      style={{
        color: palette.text,
        fontFamily: type.serif,
        fontSize: 35,
        fontWeight: 700,
      }}
    >
      {value}
    </div>
  </div>
);

const StatusVocabulary: React.FC<{ time: number; opacity: number }> = ({
  time,
  opacity,
}) => {
  const mapping = ramp(time, 65.666322, 69.520322, easeInOut);
  const implementation = ramp(time, 69.613322, 70.25);
  const tests = ramp(time, 71.15, 72.25);
  const ci = ramp(time, 73.572322, 74.15);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${(1 - opacity) * 10}px)`,
      }}
    >
      <div style={{ position: "absolute", left: 124, right: 124, top: 126 }}>
        <Kicker>Case file 17 · Customer status</Kicker>
        <div
          style={{
            marginTop: 16,
            color: palette.text,
            fontFamily: type.serif,
            fontSize: 67,
            fontWeight: 700,
            lineHeight: 1.02,
          }}
        >
          Two states. One consequential shortcut.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          top: 328,
          display: "grid",
          gridTemplateColumns: "1fr 180px 1fr",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              color: palette.muted,
              fontFamily: type.mono,
              fontSize: 14,
              fontWeight: 650,
              letterSpacing: 2,
            }}
          >
            ORIGINAL STATE
          </div>
          <div
            style={{
              position: "relative",
              marginTop: 18,
              width: 590,
              color: palette.text,
              fontFamily: type.serif,
              fontSize: 108,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 0.9,
            }}
          >
            PAUSED
            <div
              style={{
                position: "absolute",
                left: -4,
                top: 50,
                width: 594,
                height: 4,
                backgroundColor: palette.ink,
                transform: `scaleX(${mapping})`,
                transformOrigin: "left center",
              }}
            />
          </div>
        </div>

        <div
          style={{
            position: "relative",
            height: 92,
            opacity: 0.28 + mapping * 0.72,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 22,
              top: 44,
              height: 2,
              backgroundColor: palette.ink,
              transform: `scaleX(${mapping})`,
              transformOrigin: "left center",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 34,
              width: 22,
              height: 22,
              borderTop: `2px solid ${palette.ink}`,
              borderRight: `2px solid ${palette.ink}`,
              transform: "rotate(45deg)",
              opacity: ramp(mapping, 0.86, 1),
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 22,
              top: 2,
              color: palette.ink,
              fontFamily: type.serif,
              fontSize: 19,
              fontStyle: "italic",
            }}
          >
            mapped as
          </div>
        </div>

        <div>
          <div
            style={{
              color: palette.ink,
              fontFamily: type.mono,
              fontSize: 14,
              fontWeight: 650,
              letterSpacing: 2,
            }}
          >
            WRITTEN STATE
          </div>
          <div
            style={{
              marginTop: 18,
              color: palette.ink,
              fontFamily: type.serif,
              fontSize: 108,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 0.9,
              opacity: 0.35 + mapping * 0.65,
              transform: `translateX(${(1 - mapping) * 16}px)`,
            }}
          >
            INACTIVE
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 124, right: 124, top: 586 }}>
        <ProofRow
          label="IMPLEMENTATION"
          value="paused → inactive"
          opacity={implementation}
        />
        <ProofRow
          label="TEST EXPECTATION"
          value="expect inactive"
          opacity={tests}
        />
        <div
          style={{
            minHeight: 86,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${palette.ruleStrong}`,
            borderBottom: `1px solid ${palette.ruleStrong}`,
            opacity: ci,
            transform: `translateY(${(1 - ci) * 10}px)`,
          }}
        >
          <div
            style={{
              color: palette.muted,
              fontFamily: type.mono,
              fontSize: 15,
              fontWeight: 650,
              letterSpacing: 1.8,
            }}
          >
            CONTINUOUS INTEGRATION
          </div>
          <div
            style={{
              color: palette.ink,
              fontFamily: type.serif,
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            PASS
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SemanticColumn: React.FC<{
  title: string;
  eyebrow: string;
  rows: string[];
  opacity: number;
  active: number;
}> = ({ title, eyebrow, rows, opacity, active }) => (
  <div style={{ opacity }}>
    <div
      style={{
        color: palette.muted,
        fontFamily: type.mono,
        fontSize: 14,
        fontWeight: 650,
        letterSpacing: 2,
      }}
    >
      {eyebrow}
    </div>
    <div
      style={{
        marginTop: 18,
        color: palette.text,
        fontFamily: type.serif,
        fontSize: 76,
        fontWeight: 700,
        letterSpacing: -1.5,
        lineHeight: 0.95,
      }}
    >
      {title}
    </div>
    <div style={{ marginTop: 42 }}>
      {rows.map((row, index) => {
        const rowReveal = ramp(active, index * 0.24, index * 0.24 + 0.35);
        return (
          <div
            key={row}
            style={{
              minHeight: 74,
              display: "grid",
              gridTemplateColumns: "52px 1fr",
              alignItems: "center",
              borderTop: `1px solid ${palette.rule}`,
              opacity: 0.4 + rowReveal * 0.6,
            }}
          >
            <span
              style={{
                color: palette.ink,
                fontFamily: type.mono,
                fontSize: 14,
                fontWeight: 650,
              }}
            >
              0{index + 1}
            </span>
            <span
              style={{
                color: palette.text,
                fontFamily: type.sans,
                fontSize: 25,
                fontWeight: 500,
              }}
            >
              {row}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

const StatusSemantics: React.FC<{ time: number; opacity: number }> = ({
  time,
  opacity,
}) => {
  const paused = ramp(time, 76.568322, 78.681322, easeInOut);
  const inactive = ramp(time, 79.621322, 83.557322, easeInOut);
  const agreement = ramp(time, 84.497322, 87.110322, easeInOut);
  const authority = ramp(time, 87.191322, 92.775322, easeInOut);

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: "absolute", left: 124, right: 124, top: 126 }}>
        <Kicker>Passing tests · semantic review</Kicker>
        <div
          style={{
            marginTop: 16,
            color: palette.text,
            fontFamily: type.serif,
            fontSize: 67,
            fontWeight: 700,
            lineHeight: 1.02,
          }}
        >
          Agreement is not business authority.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          top: 338,
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
          gap: 58,
        }}
      >
        <SemanticColumn
          eyebrow="STATE A"
          title="PAUSED"
          rows={["Stop billing", "Preserve access", "Keep customer context"]}
          opacity={0.56 + paused * 0.44}
          active={paused}
        />
        <div style={{ backgroundColor: palette.ruleStrong, minHeight: 406 }} />
        <SemanticColumn
          eyebrow="STATE B"
          title="INACTIVE"
          rows={["Remove access", "Trigger notifications", "Change downstream reports"]}
          opacity={0.46 + inactive * 0.54}
          active={inactive}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          top: 830,
          minHeight: 96,
          display: "grid",
          gridTemplateColumns: "1fr 180px 1fr",
          alignItems: "center",
          borderTop: `1px solid ${palette.ruleStrong}`,
          opacity: agreement,
        }}
      >
        <div
          style={{
            color: palette.text,
            fontFamily: type.mono,
            fontSize: 19,
            fontWeight: 650,
            letterSpacing: 1.3,
          }}
        >
          IMPLEMENTATION = TESTS
        </div>
        <div
          style={{
            color: palette.ink,
            fontFamily: type.serif,
            fontSize: 45,
            fontWeight: 700,
            textAlign: "center",
            opacity: authority,
          }}
        >
          ≠
        </div>
        <div
          style={{
            color: palette.ink,
            fontFamily: type.mono,
            fontSize: 19,
            fontWeight: 650,
            letterSpacing: 1.3,
            textAlign: "right",
            opacity: authority,
          }}
        >
          BUSINESS TRUTH
        </div>
      </div>
    </AbsoluteFill>
  );
};

const StatusConsequences: React.FC<{ time: number; opacity: number }> = ({
  time,
  opacity,
}) => {
  const path = ramp(time, 93.878322, 98.2, easeInOut);
  const items = [
    ["BILLING", "a charge changes"],
    ["ACCESS", "a capability disappears"],
    ["NOTIFICATION", "a message becomes action"],
    ["REPORTING", "a record becomes evidence"],
  ] as const;

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: "absolute", left: 124, right: 124, top: 126 }}>
        <Kicker>System of record · authority boundary</Kicker>
        <div
          style={{
            marginTop: 16,
            color: palette.text,
            fontFamily: type.serif,
            fontSize: 67,
            fontWeight: 700,
            lineHeight: 1.02,
          }}
        >
          One word becomes several real actions.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 124,
          top: 354,
          width: 490,
        }}
      >
        <div
          style={{
            color: palette.muted,
            fontFamily: type.mono,
            fontSize: 14,
            fontWeight: 650,
            letterSpacing: 2,
          }}
        >
          AUTHORITATIVE VALUE
        </div>
        <div
          style={{
            marginTop: 24,
            color: palette.ink,
            fontFamily: type.serif,
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 0.92,
          }}
        >
          INACTIVE
        </div>
        <div
          style={{
            marginTop: 42,
            width: 440,
            color: palette.muted,
            fontFamily: type.sans,
            fontSize: 24,
            lineHeight: 1.38,
          }}
        >
          The value crosses from an implementation detail into a record the
          world is allowed to trust.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 664,
          top: 314,
          bottom: 164,
          width: 2,
          backgroundColor: palette.ink,
          transform: `scaleY(${path})`,
          transformOrigin: "top center",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 310,
          color: palette.ink,
          fontFamily: type.mono,
          fontSize: 12,
          fontWeight: 650,
          letterSpacing: 1.8,
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          opacity: path,
        }}
      >
        AUTHORITY BOUNDARY
      </div>

      <div
        style={{
          position: "absolute",
          left: 760,
          right: 124,
          top: 316,
        }}
      >
        {items.map(([label, detail], index) => {
          const item = ramp(path, 0.35 + index * 0.13, 0.56 + index * 0.13);
          return (
            <div
              key={label}
              style={{
                position: "relative",
                minHeight: 134,
                display: "grid",
                gridTemplateColumns: "90px 290px 1fr",
                alignItems: "center",
                borderTop: `1px solid ${palette.ruleStrong}`,
                opacity: 0.28 + item * 0.72,
                transform: `translateX(${(1 - item) * 16}px)`,
              }}
            >
              <span
                style={{
                  color: palette.ink,
                  fontFamily: type.mono,
                  fontSize: 14,
                  fontWeight: 650,
                }}
              >
                0{index + 1}
              </span>
              <span
                style={{
                  color: palette.text,
                  fontFamily: type.serif,
                  fontSize: 35,
                  fontWeight: 700,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  color: palette.muted,
                  fontFamily: type.sans,
                  fontSize: 22,
                  lineHeight: 1.3,
                }}
              >
                {detail}
              </span>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: -1,
                  width: "100%",
                  height: 3,
                  backgroundColor: palette.ink,
                  transform: `scaleX(${item})`,
                  transformOrigin: "left center",
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const StatusScene: React.FC<{ time: number }> = ({ time }) => {
  if (!isActive(time, 60.418322, 101.424762)) return null;
  // The three dense layouts switch cleanly. Crossfading complete reading
  // hierarchies creates an illegible double exposure at chapter boundaries.
  const vocabulary = time < 73.9 ? 1 : 0;
  const semantics = time >= 73.9 && time < 93.7 ? 1 : 0;
  const consequences = time >= 93.7 ? 1 : 0;

  return (
    <AbsoluteFill>
      <PaperField />
      <Folio section="Consequence" index="02 / 04" />
      <StatusVocabulary time={time} opacity={vocabulary} />
      <StatusSemantics time={time} opacity={semantics} />
      <StatusConsequences time={time} opacity={consequences} />
    </AbsoluteFill>
  );
};

const ResidueLedger: React.FC<{ time: number; reveal: number }> = ({
  time,
  reveal,
}) => {
  // Let the new paper surface finish covering the illustration before its
  // typography appears. Clipping the complete ledger made the title look like
  // an unfinished layout during the wipe.
  const contentReveal = ramp(time, 111.08, 111.52, easeInOut);
  const rows = [
    ["RECORDS", "already changed", 112.210762],
    ["COPIES", "already spread", 114.787762],
    ["EMAILS", "already sent", 116.726762],
    ["ACCESS", "already removed", 118.619762],
    ["ACTION", "already taken", 120.836762],
  ] as const;

  return (
    <div
      style={{
        position: "absolute",
        left: 818,
        right: 124,
        top: 282,
        bottom: 150,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(247,247,244,0.98)",
          borderLeft: `2px solid ${palette.ink}`,
          clipPath: `inset(0 0 0 ${(1 - reveal) * 100}%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "30px 42px 0",
          boxSizing: "border-box",
          opacity: contentReveal,
          transform: `translateY(${(1 - contentReveal) * 8}px)`,
        }}
      >
        <Kicker>Reality ledger · after revert</Kicker>
        <div
          style={{
            marginTop: 22,
            color: palette.text,
            fontFamily: type.serif,
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          What the commit cannot erase
        </div>
        <div style={{ marginTop: 30 }}>
          {rows.map(([label, detail, start], index) => {
            const row = ramp(time, start, start + 0.58);
            return (
              <div
                key={label}
                style={{
                  minHeight: 85,
                  display: "grid",
                  gridTemplateColumns: "70px 220px 1fr",
                  alignItems: "center",
                  borderTop: `1px solid ${palette.ruleStrong}`,
                  opacity: 0.26 + row * 0.74,
                  transform: `translateX(${(1 - row) * 14}px)`,
                }}
              >
                <span
                  style={{
                    color: palette.ink,
                    fontFamily: type.mono,
                    fontSize: 13,
                    fontWeight: 650,
                  }}
                >
                  0{index + 1}
                </span>
                <span
                  style={{
                    color: palette.text,
                    fontFamily: type.serif,
                    fontSize: 30,
                    fontWeight: 700,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    color: palette.muted,
                    fontFamily: type.sans,
                    fontSize: 20,
                  }}
                >
                  {detail}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const RollbackScene: React.FC<{ time: number }> = ({ time }) => {
  if (!isActive(time, 101.424762, 128.963628)) return null;
  const entry = 1;
  const clock = ramp(time, 104.303762, 106.9, easeInOut);
  const strike = ramp(time, 110.015762, 110.72, easeInOut);
  const ledger = ramp(time, 110.15, 111.2, easeInOut);
  const bodyExit = ramp(time, 124.78, 124.96, easeInOut);
  const conclusion = ramp(time, 124.18, 124.78, easeInOut);

  return (
    <AbsoluteFill>
      <PaperField />
      <div style={{ opacity: 1 - bodyExit }}>
        <Folio section="The 12:01 test" index="03 / 04" />
        <div style={{ position: "absolute", left: 124, top: 126 }}>
          <Kicker>Revert the commit at noon</Kicker>
          <div
            style={{
              marginTop: 16,
              width: 1020,
              color: palette.text,
              fontFamily: type.serif,
              fontSize: 67,
              fontWeight: 700,
              lineHeight: 1.02,
              opacity: entry,
            }}
          >
            What is still wrong one minute later?
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 124,
            top: 326,
            width: 610,
          }}
        >
          <div
            style={{
              color: palette.ink,
              fontFamily: type.serif,
              fontSize: 186,
              fontWeight: 700,
              letterSpacing: -7,
              lineHeight: 0.82,
              fontVariantNumeric: "tabular-nums",
              opacity: 0.26 + clock * 0.74,
            }}
          >
            12:01
          </div>
          <div
            style={{
              marginTop: 54,
              color: palette.muted,
              fontFamily: type.mono,
              fontSize: 14,
              fontWeight: 650,
              letterSpacing: 1.8,
            }}
          >
            SOURCE CONTROL / CUSTOMER STATUS
          </div>
          <div
            style={{
              position: "relative",
              marginTop: 18,
              padding: "20px 0",
              borderTop: `1px solid ${palette.ruleStrong}`,
              borderBottom: `1px solid ${palette.ruleStrong}`,
              color: palette.text,
              fontFamily: type.mono,
              fontSize: 21,
              lineHeight: 1.3,
            }}
          >
            revert customer-status mapping
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                width: "100%",
                height: 3,
                backgroundColor: palette.ink,
                transform: `scaleX(${strike})`,
                transformOrigin: "left center",
              }}
            />
          </div>
          <div
            style={{
              marginTop: 25,
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              opacity: strike,
            }}
          >
            <span
              style={{
                color: palette.muted,
                fontFamily: type.mono,
                fontSize: 14,
                fontWeight: 650,
                letterSpacing: 1.6,
              }}
            >
              NEXT BAD WRITE
            </span>
            <span
              style={{
                color: palette.ink,
                fontFamily: type.serif,
                fontSize: 39,
                fontWeight: 700,
              }}
            >
              stopped
            </span>
          </div>
        </div>

        <figure
          style={{
            position: "absolute",
            left: 818,
            right: 124,
            top: 282,
            height: 610,
            margin: 0,
            overflow: "hidden",
            opacity: entry,
          }}
        >
          <Img
            src={staticFile("authority-boundary/01-authority-ripple.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "58% center",
              filter: "grayscale(1) contrast(0.96) brightness(1.04)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(10,31,61,0.16)",
              mixBlendMode: "multiply",
            }}
          />
          <figcaption
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "17px 22px",
              backgroundColor: "rgba(247,247,244,0.9)",
              borderTop: `1px solid ${palette.ruleStrong}`,
              color: palette.muted,
              fontFamily: type.mono,
              fontSize: 13,
              fontWeight: 650,
              letterSpacing: 1.7,
              textTransform: "uppercase",
            }}
          >
            Consequence survives the edit · article illustration
          </figcaption>
        </figure>
        <ResidueLedger time={time} reveal={ledger} />
      </div>

      <AbsoluteFill
        style={{
          clipPath: `inset(0 ${(1 - conclusion) * 100}% 0 0)`,
          zIndex: 70,
        }}
      >
        <PaperField dark />
        <Folio section="The 12:01 test" index="03 / 04" dark />
        <div
          style={{
            position: "absolute",
            left: 124,
            right: 124,
            top: 192,
            bottom: 148,
            display: "grid",
            gridTemplateRows: "1fr 1px 1fr",
            alignItems: "center",
          }}
        >
          <div
            style={{
              alignSelf: "end",
              color: palette.white,
              fontFamily: type.serif,
              fontSize: 138,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 0.9,
            }}
          >
            ROLLBACK
          </div>
          <div style={{ width: "100%", height: 1, backgroundColor: "rgba(247,248,248,0.34)" }} />
          <div
            style={{
              alignSelf: "start",
              paddingTop: 28,
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                color: palette.white,
                fontFamily: type.serif,
                fontSize: 138,
                fontWeight: 700,
                letterSpacing: -4,
                lineHeight: 0.9,
              }}
            >
              ≠ RESTORATION
            </div>
            <div
              style={{
                width: 350,
                color: "rgba(247,248,248,0.68)",
                fontFamily: type.sans,
                fontSize: 23,
                lineHeight: 1.35,
              }}
            >
              Code stops. Records, copies, messages, access, and action may
              remain.
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const EvidencePage: React.FC<{
  side: "left" | "right";
  eyebrow: string;
  title: string;
  rows: string[];
  focus: number;
  rowProgress: number;
}> = ({ side, eyebrow, title, rows, focus, rowProgress }) => (
  <div
    style={{
      position: "relative",
      minHeight: 548,
      padding: side === "left" ? "0 56px 0 0" : "0 0 0 56px",
      boxSizing: "border-box",
      opacity: 0.46 + focus * 0.54,
    }}
  >
    <div
      style={{
        color: palette.muted,
        fontFamily: type.mono,
        fontSize: 14,
        fontWeight: 650,
        letterSpacing: 2,
      }}
    >
      {eyebrow}
    </div>
    <div
      style={{
        marginTop: 18,
        color: palette.text,
        fontFamily: type.serif,
        fontSize: 62,
        fontWeight: 700,
        lineHeight: 0.98,
      }}
    >
      {title}
    </div>
    <div
      style={{
        marginTop: 36,
        height: 4,
        width: "100%",
        backgroundColor: palette.ink,
        transform: `scaleX(${focus})`,
        transformOrigin: side === "left" ? "left center" : "right center",
      }}
    />
    <div style={{ marginTop: 22 }}>
      {rows.map((row, index) => {
        const item = ramp(rowProgress, index * 0.24, index * 0.24 + 0.38);
        return (
          <div
            key={row}
            style={{
              minHeight: 92,
              display: "grid",
              gridTemplateColumns: "62px 1fr",
              alignItems: "center",
              borderTop: `1px solid ${palette.ruleStrong}`,
              opacity: 0.3 + item * 0.7,
              transform: `translateY(${(1 - item) * 10}px)`,
            }}
          >
            <span
              style={{
                color: palette.ink,
                fontFamily: type.mono,
                fontSize: 13,
                fontWeight: 650,
              }}
            >
              0{index + 1}
            </span>
            <span
              style={{
                color: palette.text,
                fontFamily: type.sans,
                fontSize: 24,
                lineHeight: 1.3,
              }}
            >
              {row}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

const EvidenceScene: React.FC<{ time: number }> = ({ time }) => {
  if (!isActive(time, 128.963628, 148.271628)) return null;
  const entry = 1;
  const reading = ramp(time, 133.235628, 140.805628, easeInOut);
  const tests = ramp(time, 141.246628, 147.261628, easeInOut);
  const focusShift = ramp(time, 140.65, 142.0, easeInOut);
  const synthesis = ramp(time, 144.277628, 145.1, easeInOut);

  return (
    <AbsoluteFill>
      <PaperField />
      <Folio section="Evidence" index="04 / 04" />
      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          top: 126,
          opacity: entry,
        }}
      >
        <Kicker>Two quality gates · one accountable decision</Kicker>
        <div
          style={{
            marginTop: 16,
            color: palette.text,
            fontFamily: type.serif,
            fontSize: 67,
            fontWeight: 700,
            lineHeight: 1.02,
          }}
        >
          Understanding and evidence do different work.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          top: 320,
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
          opacity: entry,
        }}
      >
        <EvidencePage
          side="left"
          eyebrow="SOURCE READING"
          title="SYSTEM MODEL"
          rows={["Data flow and invariants", "Unusual failures", "Maintenance and recovery"]}
          focus={1 - focusShift * 0.46}
          rowProgress={reading}
        />
        <div style={{ backgroundColor: palette.ruleStrong, minHeight: 548 }} />
        <EvidencePage
          side="right"
          eyebrow="TESTS · LOGS · CHECKS"
          title="REPEATABLE EVIDENCE"
          rows={["Encoded expectations", "Observable behavior", "Independent method or context"]}
          focus={0.34 + focusShift * 0.66}
          rowProgress={tests}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          top: 864,
          minHeight: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${palette.ruleStrong}`,
          opacity: 0.34 + synthesis * 0.66,
        }}
      >
        <span
          style={{
            color: palette.ink,
            fontFamily: type.mono,
            fontSize: 15,
            fontWeight: 650,
            letterSpacing: 1.8,
          }}
        >
          COMPLEMENTARY
        </span>
        <span
          style={{
            color: palette.text,
            fontFamily: type.serif,
            fontSize: 36,
            fontStyle: "italic",
          }}
        >
          Not substitutes.
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const AuthorityBoundaryIndigoPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const globalTime = AUTHORITY_BOUNDARY_INDIGO_START_SEC + frame / fps;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.paper,
        overflow: "hidden",
        fontFamily: type.sans,
      }}
    >
      <Audio
        src={staticFile("authority-boundary/narration.mp3")}
        trimBefore={Math.floor(AUTHORITY_BOUNDARY_INDIGO_START_SEC * fps)}
        trimAfter={Math.ceil(AUTHORITY_BOUNDARY_INDIGO_END_SEC * fps)}
      />
      <StatusScene time={globalTime} />
      <RollbackScene time={globalTime} />
      <EvidenceScene time={globalTime} />
      <QuietCaption time={globalTime} />
    </AbsoluteFill>
  );
};
