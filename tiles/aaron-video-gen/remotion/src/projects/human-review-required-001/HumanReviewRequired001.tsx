import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const HUMAN_REVIEW_REQUIRED_001_FPS = 30;
export const HUMAN_REVIEW_REQUIRED_001_DURATION_FRAMES = 23 * HUMAN_REVIEW_REQUIRED_001_FPS;

const SOURCE_VIDEO = "human-review-required-001/source-codex-demo.mp4";
const NARRATION = "human-review-required-001/narration.mp3";
const MUSIC = "human-review-required-001/music-selected.mp3";

const timeline = {
  quality: {from: 0, duration: 234},
  forensic: {from: 234, duration: 87},
  quoteOne: {from: 321, duration: 61},
  quoteTwo: {from: 382, duration: 62},
  verdict: {from: 444, duration: 51},
  principles: {from: 495, duration: 123},
  end: {from: 618, duration: 72},
} as const;

const palette = {
  canvas: "#090c0b",
  surface: "#111714",
  surfaceRaised: "#19211d",
  paper: "#f1eee6",
  text: "#f7f5ee",
  ink: "#151917",
  muted: "#9ca69f",
  line: "#2b3631",
  signal: "#58d1a3",
  tension: "#ef765f",
  brandBlue: "#7ca7ff",
  brandPurple: "#8f6df6",
} as const;

const fonts = {
  sans: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"SFMono-Regular", Menlo, Monaco, Consolas, monospace',
} as const;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeMove = Easing.bezier(0.45, 0, 0.55, 1);

const progress = (frame: number, start: number, end: number, easing = easeOut) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

type Responsive = {
  vertical: boolean;
  width: number;
  height: number;
  safeX: number;
  safeTop: number;
  safeBottom: number;
};

const useResponsive = (): Responsive => {
  const {width, height} = useVideoConfig();
  const vertical = height > width;
  return {
    vertical,
    width,
    height,
    safeX: vertical ? 76 : 112,
    safeTop: vertical ? 164 : 64,
    safeBottom: vertical ? 292 : 154,
  };
};

const SeriesChrome: React.FC<{dark?: boolean}> = ({dark = false}) => {
  const {vertical, safeX, safeTop} = useResponsive();
  return (
    <div
      style={{
        position: "absolute",
        top: safeTop - (vertical ? 80 : 22),
        left: safeX,
        right: safeX,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: dark ? palette.ink : palette.muted,
        fontFamily: fonts.mono,
        fontSize: vertical ? 20 : 16,
        fontWeight: 760,
        letterSpacing: vertical ? 2 : 1.6,
      }}
    >
      <span>HUMAN REVIEW REQUIRED</span>
      <span style={{color: dark ? palette.ink : palette.signal}}>001 / 23 SEC</span>
    </div>
  );
};

const Disclosure: React.FC<{compact?: boolean}> = ({compact = false}) => (
  <div
    style={{
      position: "absolute",
      top: compact ? 12 : 18,
      right: compact ? 12 : 18,
      padding: compact ? "8px 10px" : "10px 14px",
      border: `1px solid ${palette.signal}`,
      backgroundColor: palette.canvas,
      color: palette.signal,
      fontFamily: fonts.mono,
      fontSize: compact ? 11 : 14,
      fontWeight: 800,
      letterSpacing: compact ? 1.1 : 1.5,
      lineHeight: 1,
      whiteSpace: "nowrap",
    }}
  >
    RECREATED DEMO · SOURCE-BACKED
  </div>
);

const SourceFootage: React.FC<{
  sourceStart?: number;
  annotated?: boolean;
}> = ({sourceStart = 0, annotated = false}) => {
  const {vertical} = useResponsive();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: palette.canvas,
      }}
    >
      <OffthreadVideo
        src={staticFile(SOURCE_VIDEO)}
        startFrom={sourceStart}
        muted
        style={{width: "100%", height: "100%", objectFit: "contain"}}
      />
      <Disclosure compact={vertical} />
      {annotated ? (
        <>
          <div
            style={{
              position: "absolute",
              top: vertical ? 4 : 8,
              right: vertical ? 4 : 8,
              width: vertical ? "43%" : "24%",
              height: vertical ? 56 : 54,
              border: `${vertical ? 4 : 5}px solid ${palette.tension}`,
              borderRadius: "50%",
              transform: "rotate(-4deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: vertical ? 62 : 68,
              right: vertical ? 12 : 18,
              color: palette.tension,
              fontFamily: fonts.mono,
              fontSize: vertical ? 14 : 18,
              fontWeight: 820,
              letterSpacing: 1.1,
              transform: "rotate(-2deg)",
            }}
          >
            DISCLOSED ≠ CONVINCING
          </div>
        </>
      ) : null}
    </div>
  );
};

const Stamp: React.FC<{
  text: string;
  tone: "signal" | "tension";
  size: number;
  rotation?: number;
  filled?: boolean;
  opacity?: number;
  transform?: string;
}> = ({text, tone, size, rotation = -5, filled = false, opacity = 1, transform = ""}) => {
  const color = tone === "signal" ? palette.signal : palette.tension;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `${Math.round(size * 0.16)}px ${Math.round(size * 0.28)}px`,
        border: `${Math.max(5, Math.round(size * 0.08))}px solid ${color}`,
        backgroundColor: filled ? color : palette.canvas,
        color: filled ? palette.canvas : color,
        fontFamily: fonts.mono,
        fontSize: size,
        lineHeight: 0.92,
        fontWeight: 900,
        letterSpacing: -Math.max(1, size * 0.025),
        opacity,
        transform: `rotate(${rotation}deg) ${transform}`,
        transformOrigin: "center center",
        boxShadow: `0 0 0 5px ${palette.canvas}`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

const MetricCard: React.FC<{value: string; label: string; active?: boolean}> = ({
  value,
  label,
  active = false,
}) => {
  const {vertical} = useResponsive();
  return (
    <div
      style={{
        minWidth: 0,
        padding: vertical ? "24px 20px" : "25px 28px",
        border: `1px solid ${active ? palette.signal : palette.line}`,
        backgroundColor: active ? palette.surfaceRaised : palette.surface,
      }}
    >
      <div
        style={{
          color: active ? palette.signal : palette.text,
          fontFamily: fonts.sans,
          fontSize: vertical ? 38 : 42,
          fontWeight: 880,
          letterSpacing: vertical ? -1.8 : -2,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 12,
          color: palette.muted,
          fontFamily: fonts.mono,
          fontSize: vertical ? 13 : 15,
          fontWeight: 700,
          letterSpacing: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const QualityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {vertical, safeX, safeTop} = useResponsive();
  const heroStampExit = 1 - progress(frame, 45, 58, easeMove);
  const receiptEntry = progress(frame, 54, 70);
  const activeMetric = frame < 118 ? 0 : frame < 166 ? 1 : 2;
  const mediaRect = vertical
    ? {left: safeX, right: safeX, top: safeTop + 92, height: 522}
    : {left: 0, right: 0, top: 0, height: 1080};

  return (
    <AbsoluteFill style={{backgroundColor: palette.canvas, color: palette.text, fontFamily: fonts.sans}}>
      <div style={{position: "absolute", ...mediaRect}}>
        <SourceFootage />
      </div>
      {vertical ? <SeriesChrome /> : null}
      <div
        style={{
          position: "absolute",
          left: vertical ? safeX + 36 : undefined,
          right: vertical ? undefined : 126,
          top: vertical ? safeTop + 500 : 170,
          opacity: heroStampExit,
        }}
      >
        <Stamp text="PASSED QA" tone="signal" size={vertical ? 72 : 102} />
      </div>
      <div
        style={{
          position: "absolute",
          left: safeX,
          right: safeX,
          top: vertical ? safeTop + 704 : 760,
          opacity: receiptEntry,
          transform: `translateY(${(1 - receiptEntry) * 22}px)`,
        }}
      >
        <div
          style={{
            color: palette.text,
            fontSize: vertical ? 54 : 47,
            fontWeight: 880,
            letterSpacing: vertical ? -2.8 : -2.2,
            lineHeight: 1,
          }}
        >
          Every machine check passed.
        </div>
        <div
          style={{
            marginTop: vertical ? 34 : 26,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: vertical ? 10 : 16,
          }}
        >
          <MetricCard value="1080p" label="60 FPS" active={activeMetric === 0} />
          <MetricCard value="0" label="DECODE ERRORS" active={activeMetric === 1} />
          <MetricCard value="−16.2" label="LUFS" active={activeMetric === 2} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const QuoteScene: React.FC<{quote: string; index: "01" | "02"}> = ({quote, index}) => {
  const frame = useCurrentFrame();
  const {vertical, safeX, safeTop, safeBottom} = useResponsive();
  const focus = progress(frame, 0, 14);
  return (
    <AbsoluteFill style={{backgroundColor: palette.paper, color: palette.ink, fontFamily: fonts.sans}}>
      <SeriesChrome dark />
      <div
        style={{
          position: "absolute",
          top: safeTop + (vertical ? 114 : 102),
          left: safeX,
          right: safeX,
          bottom: safeBottom,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: palette.tension,
            fontFamily: fonts.mono,
            fontSize: vertical ? 21 : 19,
            fontWeight: 820,
            letterSpacing: 2,
          }}
        >
          AARON · HUMAN REVIEW {index}
        </div>
        <div
          style={{
            marginTop: vertical ? 58 : 42,
            maxWidth: vertical ? 900 : 1540,
            color: palette.ink,
            fontSize: vertical ? (quote.length > 24 ? 110 : 128) : quote.length > 24 ? 140 : 166,
            fontWeight: 900,
            lineHeight: 0.98,
            letterSpacing: vertical ? -6 : -8,
            opacity: 0.78 + focus * 0.22,
            transform: `translateY(${(1 - focus) * 12}px)`,
          }}
        >
          “{quote}”
        </div>
        <div
          style={{
            marginTop: vertical ? 62 : 46,
            width: vertical ? 180 : 240,
            height: 9,
            backgroundColor: palette.tension,
          }}
        />
        <div
          style={{
            marginTop: 24,
            color: palette.muted,
            fontFamily: fonts.mono,
            fontSize: vertical ? 20 : 18,
            fontWeight: 700,
            letterSpacing: 1.2,
          }}
        >
          TRANSLATED FEEDBACK · TYPESET, NOT A PRIVATE SCREENSHOT
        </div>
      </div>
    </AbsoluteFill>
  );
};

const QaReceipt: React.FC<{focused?: boolean}> = ({focused = false}) => {
  const {vertical} = useResponsive();
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        padding: vertical ? "30px 28px" : "34px 36px",
        border: `1px solid ${focused ? palette.tension : palette.line}`,
        backgroundColor: palette.paper,
        color: palette.ink,
        fontFamily: fonts.sans,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          fontFamily: fonts.mono,
          fontSize: vertical ? 15 : 16,
          fontWeight: 800,
          letterSpacing: 1.3,
        }}
      >
        <span>ENCODED MASTER QA</span>
        <span style={{color: palette.signal}}>PASSED</span>
      </div>
      <div
        style={{
          marginTop: vertical ? 24 : 30,
          display: "grid",
          gridTemplateColumns: vertical ? "repeat(3, 1fr)" : "1fr",
          gap: vertical ? 14 : 21,
        }}
      >
        {[
          ["1920 × 1080", "H.264 / 60 FPS"],
          ["−16.2 LUFS", "FINAL ENCODED MIX"],
          ["0 ERRORS", "FULL DECODE CHECK"],
        ].map(([value, label]) => (
          <div key={value} style={{borderTop: `2px solid ${palette.ink}`, paddingTop: 13}}>
            <div
              style={{
                fontSize: vertical ? 22 : 35,
                lineHeight: 1,
                fontWeight: 880,
                letterSpacing: -1,
                whiteSpace: "nowrap",
              }}
            >
              {value}
            </div>
            <div
              style={{
                marginTop: 9,
                color: palette.muted,
                fontFamily: fonts.mono,
                fontSize: vertical ? 10 : 12,
                fontWeight: 700,
                letterSpacing: 0.8,
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          right: vertical ? 7 : 10,
          bottom: vertical ? 5 : 14,
          width: vertical ? "31%" : "88%",
          height: vertical ? 76 : 74,
          border: `${vertical ? 4 : 5}px solid ${palette.tension}`,
          borderRadius: "50%",
          transform: "rotate(2deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: vertical ? 15 : 20,
          bottom: vertical ? -31 : -20,
          color: palette.tension,
          fontFamily: fonts.mono,
          fontSize: vertical ? 13 : 16,
          fontWeight: 850,
          letterSpacing: 1,
          transform: "rotate(1deg)",
        }}
      >
        STILL NOT A TASTE TEST
      </div>
    </div>
  );
};

const ForensicScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {vertical, safeX, safeTop, safeBottom} = useResponsive();
  const shift = progress(frame, 34, 58, easeMove);
  const mediaStyle: React.CSSProperties = vertical
    ? {left: safeX, right: safeX, top: safeTop + 160, height: 522}
    : {left: safeX, width: 1080, top: safeTop + 150, height: 608};
  const receiptStyle: React.CSSProperties = vertical
    ? {left: safeX, right: safeX, top: safeTop + 734, height: 255}
    : {right: safeX, width: 490, top: safeTop + 150, height: 608};

  return (
    <AbsoluteFill style={{backgroundColor: palette.canvas, color: palette.text, fontFamily: fonts.sans}}>
      <SeriesChrome />
      <div
        style={{
          position: "absolute",
          top: safeTop + (vertical ? 28 : 18),
          left: safeX,
          right: safeX,
          fontSize: vertical ? 66 : 70,
          lineHeight: 1,
          fontWeight: 890,
          letterSpacing: vertical ? -3.5 : -4,
        }}
      >
        Then the human watched it.
      </div>
      <div
        style={{
          position: "absolute",
          ...mediaStyle,
          border: `1px solid ${shift < 0.5 ? palette.tension : palette.line}`,
          opacity: 1 - shift * 0.18,
        }}
      >
        <SourceFootage sourceStart={Math.round(4.2 * HUMAN_REVIEW_REQUIRED_001_FPS)} annotated />
      </div>
      <div
        style={{
          position: "absolute",
          ...receiptStyle,
          opacity: 0.72 + shift * 0.28,
          transform: `translateY(${(1 - shift) * (vertical ? 12 : 0)}px)`,
        }}
      >
        <QaReceipt focused={shift > 0.45} />
      </div>
      {vertical ? (
        <div
          style={{
            position: "absolute",
            left: safeX,
            right: safeX,
            bottom: safeBottom - 66,
            color: palette.muted,
            fontFamily: fonts.mono,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 1.1,
          }}
        >
          REAL EXPORT · REAL QA · REAL HUMAN REJECTION
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const VerdictScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {vertical, safeX, safeTop, safeBottom} = useResponsive();
  const handoff = progress(frame, 10, 28, easeMove);
  const receipt = progress(frame, 22, 38);
  return (
    <AbsoluteFill style={{backgroundColor: palette.canvas, color: palette.text, fontFamily: fonts.sans}}>
      <SeriesChrome />
      <div
        style={{
          position: "absolute",
          top: safeTop + (vertical ? 80 : 82),
          left: safeX,
          right: safeX,
          bottom: safeBottom,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            opacity: 1 - handoff,
            transform: `translateY(${-handoff * 22}px)`,
          }}
        >
          <Stamp
            text={vertical ? "TECHNICALLY\nCORRECT" : "TECHNICALLY CORRECT"}
            tone="signal"
            size={vertical ? 72 : 92}
            rotation={-3}
          />
        </div>
        <div
          style={{
            position: "absolute",
            opacity: handoff,
            transform: `translateY(${(1 - handoff) * 18}px)`,
          }}
        >
          <Stamp
            text={vertical ? "HUMANLY\nWRONG" : "HUMANLY WRONG"}
            tone="tension"
            size={vertical ? 84 : 106}
            rotation={2}
            filled
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: vertical ? 36 : 16,
            right: vertical ? 0 : 60,
            padding: vertical ? "13px 16px" : "14px 20px",
            border: `1px solid ${palette.signal}`,
            color: palette.signal,
            backgroundColor: palette.surface,
            fontFamily: fonts.mono,
            fontSize: vertical ? 15 : 17,
            fontWeight: 800,
            letterSpacing: 1.2,
            opacity: receipt,
          }}
        >
          QA: PASSED · SHIP: BLOCKED
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Principle: React.FC<{
  word: string;
  note: string;
  active: number;
}> = ({word, note, active}) => {
  const {vertical} = useResponsive();
  return (
    <div
      style={{
        minWidth: 0,
        minHeight: vertical ? 260 : 350,
        padding: vertical ? "38px 36px" : "46px 42px",
        borderTop: `${active > 0.5 ? 8 : 3}px solid ${active > 0.5 ? palette.signal : palette.line}`,
        backgroundColor: active > 0.5 ? palette.surfaceRaised : palette.surface,
        opacity: 0.48 + active * 0.52,
        transform: `translateY(${(1 - active) * 8}px)`,
      }}
    >
      <div
        style={{
          color: active > 0.5 ? palette.text : palette.muted,
          fontSize: vertical ? 82 : 104,
          lineHeight: 0.9,
          fontWeight: 900,
          letterSpacing: vertical ? -4 : -6,
        }}
      >
        {word}
      </div>
      <div
        style={{
          marginTop: vertical ? 28 : 36,
          color: active > 0.5 ? palette.signal : palette.muted,
          fontFamily: fonts.mono,
          fontSize: vertical ? 16 : 18,
          fontWeight: 720,
          letterSpacing: 1,
          lineHeight: 1.35,
        }}
      >
        {note}
      </div>
    </div>
  );
};

const PrinciplesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {vertical, safeX, safeTop, safeBottom} = useResponsive();
  const taste = 1 - progress(frame, 31, 43, easeMove);
  const trust = Math.min(progress(frame, 31, 43, easeMove), 1 - progress(frame, 70, 82, easeMove));
  const truth = progress(frame, 70, 82, easeMove);
  return (
    <AbsoluteFill style={{backgroundColor: palette.canvas, color: palette.text, fontFamily: fonts.sans}}>
      <SeriesChrome />
      <div
        style={{
          position: "absolute",
          top: safeTop + (vertical ? 30 : 34),
          left: safeX,
          right: safeX,
        }}
      >
        <div
          style={{
            color: palette.muted,
            fontFamily: fonts.mono,
            fontSize: vertical ? 20 : 18,
            fontWeight: 760,
            letterSpacing: 1.8,
          }}
        >
          MISSING FROM THE CHECKLIST
        </div>
        <div
          style={{
            marginTop: vertical ? 30 : 20,
            fontSize: vertical ? 62 : 64,
            fontWeight: 880,
            letterSpacing: vertical ? -3 : -3.5,
            lineHeight: 1,
          }}
        >
          Those weren’t in the checklist.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: vertical ? safeTop + 270 : safeTop + 230,
          left: safeX,
          right: safeX,
          bottom: safeBottom,
          display: "grid",
          gridTemplateColumns: vertical ? "1fr" : "repeat(3, minmax(0, 1fr))",
          gap: vertical ? 16 : 20,
          alignContent: "center",
        }}
      >
        <Principle word="TASTE" note="Does it feel authored?" active={taste} />
        <Principle word="TRUST" note="Does the viewer believe it?" active={trust} />
        <Principle word="TRUTH" note="Does the evidence survive scrutiny?" active={truth} />
      </div>
    </AbsoluteFill>
  );
};

const SoftMark: React.FC<{size: number}> = ({size}) => (
  <div style={{position: "relative", width: size * 1.45, height: size}}>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: palette.brandBlue,
      }}
    />
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: palette.brandPurple,
        opacity: 0.82,
      }}
    />
  </div>
);

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {vertical, safeX, safeTop, safeBottom} = useResponsive();
  const identity = progress(frame, 0, 14);
  const exit = 1 - progress(frame, 60, 71, easeMove);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.paper,
        color: palette.ink,
        fontFamily: fonts.sans,
        opacity: exit,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: safeTop - (vertical ? 64 : 8),
          left: safeX,
          color: palette.tension,
          fontFamily: fonts.mono,
          fontSize: vertical ? 19 : 17,
          fontWeight: 820,
          letterSpacing: 1.9,
        }}
      >
        HUMAN REVIEW REQUIRED · 001
      </div>
      <div
        style={{
          position: "absolute",
          top: vertical ? safeTop + 210 : safeTop + 135,
          left: safeX,
          right: safeX,
          bottom: safeBottom + (vertical ? 140 : 90),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: vertical ? 900 : 1540,
            fontSize: vertical ? 94 : 112,
            lineHeight: 0.98,
            fontWeight: 900,
            letterSpacing: vertical ? -5 : -7,
          }}
        >
          If only the machine likes it,
          <br />
          <span style={{color: palette.tension}}>it doesn’t ship.</span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: safeX,
          right: safeX,
          bottom: vertical ? safeBottom + 24 : 66,
          display: "flex",
          alignItems: "center",
          gap: vertical ? 22 : 18,
          opacity: 0.72 + identity * 0.28,
          transform: `translateY(${(1 - identity) * 10}px)`,
        }}
      >
        <SoftMark size={vertical ? 46 : 38} />
        <div>
          <div style={{fontSize: vertical ? 24 : 21, fontWeight: 860, letterSpacing: -0.4}}>AARON GUO</div>
          <div
            style={{
              marginTop: 6,
              color: palette.muted,
              fontFamily: fonts.mono,
              fontSize: vertical ? 13 : 12,
              fontWeight: 700,
              letterSpacing: 1.1,
            }}
          >
            AI-NATIVE BUILDER · HUMAN-FIRST THINKER
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export type HumanReviewRequired001Props = {
  includeAudio?: boolean;
};

export const HumanReviewRequired001: React.FC<HumanReviewRequired001Props> = ({
  includeAudio = true,
}) => {
  const frame = useCurrentFrame();
  const musicLevel = interpolate(
    frame,
    [0, 600, 618, 689],
    [1, 1, 0.65, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  return (
    <AbsoluteFill style={{backgroundColor: palette.canvas}}>
      {includeAudio ? (
        <>
          <Audio src={staticFile(MUSIC)} volume={musicLevel} />
          <Audio src={staticFile(NARRATION)} volume={1.1} />
        </>
      ) : null}

      <Sequence from={timeline.quality.from} durationInFrames={timeline.quality.duration}>
        <QualityScene />
      </Sequence>
      <Sequence from={timeline.forensic.from} durationInFrames={timeline.forensic.duration}>
        <ForensicScene />
      </Sequence>
      <Sequence from={timeline.quoteOne.from} durationInFrames={timeline.quoteOne.duration}>
        <QuoteScene quote="The music sucks." index="01" />
      </Sequence>
      <Sequence from={timeline.quoteTwo.from} durationInFrames={timeline.quoteTwo.duration}>
        <QuoteScene quote="It obviously looks fake." index="02" />
      </Sequence>
      <Sequence from={timeline.verdict.from} durationInFrames={timeline.verdict.duration}>
        <VerdictScene />
      </Sequence>
      <Sequence from={timeline.principles.from} durationInFrames={timeline.principles.duration}>
        <PrinciplesScene />
      </Sequence>
      <Sequence from={timeline.end.from} durationInFrames={timeline.end.duration}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
