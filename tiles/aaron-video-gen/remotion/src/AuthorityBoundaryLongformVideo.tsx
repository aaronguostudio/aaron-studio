import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SemanticSprite } from "./editorial/SemanticSprite";
import { AUTHORITY_LEDGER_LONGFORM_RUNTIME_ASSET } from "./editorial/SemanticSpriteRuntimeRegistry";

export const AUTHORITY_BOUNDARY_LONGFORM_FPS = 30;
export const AUTHORITY_BOUNDARY_LONGFORM_NARRATION_SEC = 579.342517;
export const AUTHORITY_BOUNDARY_LONGFORM_END_CARD_SEC = 5;
export const AUTHORITY_BOUNDARY_LONGFORM_DURATION_SEC =
  AUTHORITY_BOUNDARY_LONGFORM_NARRATION_SEC +
  AUTHORITY_BOUNDARY_LONGFORM_END_CARD_SEC;
export const AUTHORITY_BOUNDARY_LONGFORM_V4_COVER_SEC = 2.8;
export const AUTHORITY_BOUNDARY_LONGFORM_V4_DURATION_SEC =
  AUTHORITY_BOUNDARY_LONGFORM_DURATION_SEC +
  AUTHORITY_BOUNDARY_LONGFORM_V4_COVER_SEC;

export const authorityBoundaryLongformDurationFrames = (): number =>
  Math.ceil(
    AUTHORITY_BOUNDARY_LONGFORM_DURATION_SEC *
      AUTHORITY_BOUNDARY_LONGFORM_FPS,
  );

export const authorityBoundaryLongformV4DurationFrames = (): number =>
  Math.ceil(
    AUTHORITY_BOUNDARY_LONGFORM_V4_DURATION_SEC *
      AUTHORITY_BOUNDARY_LONGFORM_FPS,
  );

type WordTiming = { word: string; start: number; end: number };
type AudioManifest = {
  timeline: { wordTimings: WordTiming[] };
};
type CaptionPhrase = { start: number; end: number; text: string };

const palette = {
  paper: "#f4f3ef",
  paperBright: "#fbfaf7",
  ink: "#0a2346",
  text: "#182334",
  muted: "#6e7783",
  pale: "#c7ccd3",
  ghost: "#e7e7e2",
  softInk: "#8190a7",
} as const;

const type = {
  serif: 'Georgia, "Times New Roman", serif',
  sans: 'Arial, Helvetica, sans-serif',
  mono: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
} as const;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

const ramp = (
  value: number,
  start: number,
  end: number,
  easing = easeOut,
): number =>
  interpolate(value, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

const appear = (time: number, at: number, duration = 0.55): number =>
  ramp(time, at, at + duration);

const scoreVolume = (time: number): number =>
  interpolate(
    time,
    [
      0,
      1.2,
      21.5,
      22.5,
      113,
      114.5,
      253.5,
      255,
      358.5,
      360,
      443.5,
      445,
      535.5,
      537.2,
      578.5,
      AUTHORITY_BOUNDARY_LONGFORM_NARRATION_SEC,
      582.6,
      AUTHORITY_BOUNDARY_LONGFORM_DURATION_SEC,
    ],
    [
      0,
      0.085,
      0.085,
      0.065,
      0.065,
      0.07,
      0.07,
      0.08,
      0.08,
      0.068,
      0.068,
      0.085,
      0.085,
      0.073,
      0.073,
      0.13,
      0.09,
      0,
    ],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeInOut,
    },
  );

type ChapterScoreCueProps = {
  durationSec: number;
  sourceStartSec: number;
  baseVolume: number;
  fadeInSec: number;
  fadeOutSec: number;
  openingVolume?: number;
  postNarrationAtSec?: number;
  postNarrationVolume?: number;
};

const ChapterScoreCue: React.FC<ChapterScoreCueProps> = ({
  durationSec,
  sourceStartSec,
  baseVolume,
  fadeInSec,
  fadeOutSec,
  openingVolume,
  postNarrationAtSec,
  postNarrationVolume,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;

  let target = baseVolume;
  if (openingVolume !== undefined) {
    if (time < 0.25) {
      target = interpolate(time, [0, 0.25], [0, openingVolume], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeInOut,
      });
    } else if (time < 2.15) {
      target = openingVolume;
    } else if (time < 3.35) {
      target = interpolate(time, [2.15, 3.35], [openingVolume, baseVolume], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeInOut,
      });
    }
  } else if (time < fadeInSec) {
    target = interpolate(time, [0, fadeInSec], [0, baseVolume], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeInOut,
    });
  }

  if (
    postNarrationAtSec !== undefined &&
    postNarrationVolume !== undefined &&
    time >= postNarrationAtSec
  ) {
    target = interpolate(
      time,
      [postNarrationAtSec, postNarrationAtSec + 0.8],
      [baseVolume, postNarrationVolume],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeInOut,
      },
    );
  }

  if (time >= durationSec - fadeOutSec) {
    target = interpolate(
      time,
      [durationSec - fadeOutSec, durationSec],
      [target, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeInOut,
      },
    );
  }

  return (
    <Audio
      src={staticFile("fde-full-film/music-full-v1.mp3")}
      startFrom={Math.round(sourceStartSec * fps)}
      volume={target}
    />
  );
};

const buildCaptionPhrases = (words: WordTiming[]): CaptionPhrase[] => {
  const phrases: CaptionPhrase[] = [];
  let buffer: WordTiming[] = [];
  for (const word of words) {
    buffer.push(word);
    const punctuation = /[.!?,;:][”"]?$/.test(word.word);
    if (buffer.length >= 8 || (buffer.length >= 4 && punctuation)) {
      phrases.push({
        start: buffer[0].start,
        end: buffer[buffer.length - 1].end,
        text: buffer.map((item) => item.word).join(" "),
      });
      buffer = [];
    }
  }
  if (buffer.length > 0) {
    phrases.push({
      start: buffer[0].start,
      end: buffer[buffer.length - 1].end,
      text: buffer.map((item) => item.word).join(" "),
    });
  }
  return phrases;
};

const useAudioManifest = (): AudioManifest | null => {
  const [manifest, setManifest] = useState<AudioManifest | null>(null);
  const handle = useRef<number | null>(null);
  const initiated = useRef(false);

  if (!initiated.current) {
    handle.current = delayRender("Loading long-form narration timings");
    initiated.current = true;
  }

  useEffect(() => {
    let cancelled = false;
    fetch(staticFile("authority-boundary/longform-manifest.json"))
      .then((response) => {
        if (!response.ok) throw new Error(`Manifest HTTP ${response.status}`);
        return response.json() as Promise<AudioManifest>;
      })
      .then((value) => {
        if (!cancelled) setManifest(value);
      })
      .finally(() => {
        if (handle.current !== null) {
          continueRender(handle.current);
          handle.current = null;
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return manifest;
};

const Header: React.FC<{ chapter: string; index: number }> = ({
  chapter,
  index,
}) => (
  <>
    <div
      style={{
        position: "absolute",
        left: 124,
        top: 46,
        color: palette.muted,
        fontFamily: type.mono,
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: 2.5,
        zIndex: 200,
      }}
    >
      AARON GUO
    </div>
    <div
      style={{
        position: "absolute",
        right: 124,
        top: 46,
        color: palette.muted,
        fontFamily: type.mono,
        fontSize: 14,
        fontWeight: 650,
        letterSpacing: 1.8,
        textTransform: "uppercase",
        zIndex: 200,
      }}
    >
      {String(index).padStart(2, "0")} · {chapter}
    </div>
  </>
);

const CaptionBar: React.FC<{
  time: number;
  phrases: CaptionPhrase[];
}> = ({ time, phrases }) => {
  if (time >= AUTHORITY_BOUNDARY_LONGFORM_NARRATION_SEC) return null;
  const active = phrases.find(
    (phrase) => time >= phrase.start - 0.06 && time <= phrase.end + 0.22,
  );
  if (!active) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 250,
        right: 250,
        bottom: 31,
        minHeight: 55,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: palette.text,
        fontFamily: type.sans,
        fontSize: 27,
        fontWeight: 500,
        lineHeight: 1.25,
        textAlign: "center",
        zIndex: 300,
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
      fontWeight: 700,
      letterSpacing: 2.4,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const SourceLine: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      color: palette.muted,
      fontFamily: type.mono,
      fontSize: 14,
      fontWeight: 650,
      letterSpacing: 1.3,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const SceneLayer: React.FC<{
  time: number;
  start: number;
  end: number;
  children: React.ReactNode;
}> = ({ time, start, end, children }) => {
  const overlap = 0.42;
  if (time < start - overlap || time >= end) return null;
  const entry = start === 0 ? 1 : ramp(time, start - overlap, start, easeInOut);
  const exit = ramp(time, end - 0.32, end, easeInOut);
  const opacity = entry * (1 - exit);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.paper,
        opacity,
        transform: `translateY(${(1 - entry) * 14 - exit * 8}px)`,
        overflow: "hidden",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const FlowNode: React.FC<{
  label: string;
  x: number;
  y: number;
  active?: number;
  width?: number;
  size?: number;
}> = ({ label, x, y, active = 1, width = 220, size = 20 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      color: active > 0.55 ? palette.ink : palette.muted,
      fontFamily: type.mono,
      fontSize: size,
      fontWeight: 750,
      letterSpacing: 1.4,
      textAlign: "center",
      opacity: 0.25 + active * 0.75,
      transform: `translateY(${(1 - active) * 12}px)`,
    }}
  >
    {label}
  </div>
);

const HorizontalRail: React.FC<{
  x: number;
  y: number;
  width: number;
  progress: number;
}> = ({ x, y, width, progress }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      height: 2,
      backgroundColor: palette.pale,
    }}
  >
    <div
      style={{
        width: `${progress * 100}%`,
        height: "100%",
        backgroundColor: palette.ink,
      }}
    />
  </div>
);

const OppositeAnswers: React.FC<{ time: number }> = ({ time }) => {
  const left = 0.28 + appear(time, 0.35) * 0.72;
  const right = 0.28 + appear(time, 6.1) * 0.72;
  const falseFight = appear(time, 16.1);
  const correction = appear(time, 20.8, 0.35);
  const portraitQuiet = 1 - correction * 0.48;
  return (
    <>
      <Header chapter="The debate" index={1} />
      <Img
        src={staticFile("authority-boundary/editorial/mitchell-portrait-v1.png")}
        style={{
          position: "absolute",
          left: 275,
          top: 485,
          width: 400,
          height: 355,
          objectFit: "contain",
          opacity: left * portraitQuiet * 0.88,
          transform: `translateX(${(1 - left) * -12}px)`,
        }}
      />
      <Img
        src={staticFile("authority-boundary/editorial/uncle-bob-portrait-v1.png")}
        style={{
          position: "absolute",
          right: 265,
          top: 485,
          width: 400,
          height: 355,
          objectFit: "contain",
          opacity: right * portraitQuiet * 0.88,
          transform: `translateX(${(1 - right) * 12}px)`,
        }}
      />
      <div style={{ position: "absolute", left: 124, right: 124, top: 146 }}>
        <Kicker>Two respected programmers</Kicker>
        <div style={{ display: "flex", gap: 100, marginTop: 58 }}>
          <div style={{ flex: 1, opacity: left }}>
            <SourceLine>Mitchell Hashimoto · X · Jul 2026</SourceLine>
            <div
              style={{
                marginTop: 22,
                color: palette.ink,
                fontFamily: type.serif,
                fontSize: 92,
                fontWeight: 700,
                lineHeight: 0.98,
                letterSpacing: -3,
              }}
            >
              “I read
              <br />
              the code.”
            </div>
          </div>
          <div style={{ flex: 1, opacity: right }}>
            <SourceLine>Robert C. Martin · X · Jul 2026</SourceLine>
            <div
              style={{
                marginTop: 22,
                color: palette.text,
                fontFamily: type.serif,
                fontSize: 70,
                fontWeight: 700,
                lineHeight: 1.01,
                letterSpacing: -2.4,
              }}
            >
              <span style={{ display: "block", whiteSpace: "nowrap" }}>
                “I do not read
              </span>
              <span style={{ display: "block", whiteSpace: "nowrap" }}>
                the implementation.”
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          top: 860,
          display: "flex",
          alignItems: "center",
          opacity: falseFight * (1 - correction),
        }}
      >
        <div
          style={{
            color: palette.muted,
            fontFamily: type.mono,
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          DISCIPLINE
        </div>
        <div
          style={{
            flex: 1,
            height: 2,
            margin: "0 30px",
            backgroundColor: palette.pale,
          }}
        />
        <div
          style={{
            color: palette.muted,
            fontFamily: type.mono,
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          BLIND FAITH?
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 146,
          color: palette.ink,
          fontFamily: type.serif,
          fontSize: 54,
          fontWeight: 700,
          textAlign: "center",
          opacity: correction,
        }}
      >
        Not that simple.
      </div>
    </>
  );
};

const AccountabilityQuestion: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 22;
  const accountable = appear(local, 0.4);
  const locations = appear(local, 6.5);
  const question = appear(local, 13.2);
  return (
    <>
      <Header chapter="The real question" index={2} />
      <div style={{ position: "absolute", left: 124, right: 124, top: 160 }}>
        <Kicker>Shared ground</Kicker>
        <div
          style={{
            marginTop: 42,
            color: palette.ink,
            fontFamily: type.serif,
            fontSize: 136,
            fontWeight: 700,
            letterSpacing: -4.5,
            opacity: accountable,
          }}
        >
          ACCOUNTABLE.
        </div>
      </div>
      <HorizontalRail x={250} y={540} width={1420} progress={locations} />
      <FlowNode label="SOURCE" x={210} y={500} active={locations} />
      <FlowNode
        label="SPEC + EVIDENCE"
        x={1490}
        y={500}
        active={locations}
        width={260}
      />
      <div
        style={{
          position: "absolute",
          left: 230,
          right: 230,
          top: 650,
          color: palette.text,
          fontFamily: type.serif,
          fontSize: 68,
          fontWeight: 700,
          letterSpacing: -2.1,
          lineHeight: 1.05,
          textAlign: "center",
          opacity: question,
        }}
      >
        Where should human understanding live?
      </div>
    </>
  );
};

const MitchellGate: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 44.365894;
  const steps = [0.5, 5.6, 10.7, 15.8];
  const labels = ["PLAN", "IMPLEMENT", "JUDGE", "READ"];
  const source = appear(local, 0.2);
  const boundary = appear(local, 22.5);
  return (
    <>
      <Header chapter="Mitchell's gate" index={3} />
      <div style={{ position: "absolute", left: 124, top: 144 }}>
        <Kicker>Source comprehension</Kicker>
        <div
          style={{
            marginTop: 18,
            color: palette.text,
            fontFamily: type.serif,
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: -2.4,
          }}
        >
          Multiple models. One human gate.
        </div>
      </div>
      <SourceLine>
        <span
          style={{
            position: "absolute",
            left: 124,
            top: 282,
            opacity: source,
          }}
        >
          MITCHELL HASHIMOTO · X · JUL 2, 2026
        </span>
      </SourceLine>
      <HorizontalRail x={220} y={520} width={1480} progress={appear(local, 0.5, 16)} />
      {labels.map((label, index) => {
        const value = appear(local, steps[index]);
        return (
          <React.Fragment key={label}>
            <div
              style={{
                position: "absolute",
                left: 260 + index * 420,
                top: 493,
                width: 54,
                height: 54,
                borderRadius: "50%",
                backgroundColor: palette.paper,
                border: `5px solid ${value > 0.6 ? palette.ink : palette.pale}`,
                boxSizing: "border-box",
                opacity: 0.3 + value * 0.7,
              }}
            />
            <FlowNode
              label={label}
              x={177 + index * 420}
              y={584}
              width={220}
              active={value}
            />
          </React.Fragment>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 1210,
          top: 654,
          color: palette.ink,
          fontFamily: type.serif,
          fontSize: 56,
          fontWeight: 700,
          opacity: appear(local, 15.8),
        }}
      >
        “I read the code.”
      </div>
      <div
        style={{
          position: "absolute",
          left: 220,
          right: 220,
          top: 755,
          display: "flex",
          justifyContent: "space-between",
          color: palette.muted,
          fontFamily: type.mono,
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: 1.5,
          opacity: boundary,
        }}
      >
        <span>EXPLAIN</span>
        <span>MAINTAIN</span>
        <span>FIX</span>
        <span>HUMANS INHERIT THE CODE</span>
      </div>
    </>
  );
};

const UncleBobGate: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 78.079;
  const labels = ["SPEC", "UNIT + GHERKIN", "MUTATION + QA", "METRICS", "FINAL VERIFY"];
  const marks = [0.5, 5.5, 10.5, 15.5, 20.5];
  return (
    <>
      <Header chapter="Uncle Bob's gate" index={4} />
      <div style={{ position: "absolute", left: 124, top: 144 }}>
        <Kicker>Assurance system</Kicker>
        <div
          style={{
            marginTop: 18,
            color: palette.text,
            fontFamily: type.serif,
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: -2.4,
          }}
        >
          Intent and evidence surround the implementation.
        </div>
        <div style={{ marginTop: 20 }}>
          <SourceLine>Robert C. Martin · X · Jul 23, 2026</SourceLine>
        </div>
      </div>
      <HorizontalRail x={180} y={516} width={1560} progress={appear(local, 0.5, 20)} />
      {labels.map((label, index) => {
        const value = appear(local, marks[index]);
        const x = 150 + index * 342;
        return (
          <React.Fragment key={label}>
            <div
              style={{
                position: "absolute",
                left: x + 112,
                top: 490,
                width: 54,
                height: 54,
                borderRadius: "50%",
                backgroundColor: value > 0.65 ? palette.ink : palette.paper,
                border: `4px solid ${value > 0.65 ? palette.ink : palette.pale}`,
                opacity: 0.3 + value * 0.7,
              }}
            />
            <FlowNode label={label} x={x} y={580} width={278} active={value} size={17} />
          </React.Fragment>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 250,
          right: 250,
          top: 704,
          color: palette.ink,
          fontFamily: type.serif,
          fontSize: 58,
          fontWeight: 700,
          textAlign: "center",
          opacity: appear(local, 25),
        }}
      >
        “I am the engineer because I am accountable.”
      </div>
    </>
  );
};

const SharedGround: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 113.890496;
  const center = appear(local, 0.4);
  const left = appear(local, 8);
  const right = appear(local, 15);
  const question = appear(local, 27);
  return (
    <>
      <Header chapter="Shared ground" index={5} />
      <div style={{ position: "absolute", left: 124, right: 124, top: 145 }}>
        <Kicker>What they actually agree on</Kicker>
        <div
          style={{
            marginTop: 22,
            color: palette.ink,
            fontFamily: type.serif,
            fontSize: 112,
            fontWeight: 700,
            letterSpacing: -3.7,
            opacity: center,
          }}
        >
          Same owner.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 124,
          top: 490,
          width: 720,
          opacity: left,
        }}
      >
        <SourceLine>MITCHELL</SourceLine>
        <div style={{ marginTop: 18, color: palette.text, fontFamily: type.serif, fontSize: 56, fontWeight: 700 }}>
          Understanding stays close
          <br />
          to the implementation.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 124,
          top: 490,
          width: 760,
          opacity: right,
        }}
      >
        <SourceLine>UNCLE BOB</SourceLine>
        <div style={{ marginTop: 18, color: palette.text, fontFamily: type.serif, fontSize: 56, fontWeight: 700 }}>
          Understanding moves into
          <br />
          contract + evidence.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 180,
          right: 180,
          top: 765,
          color: palette.ink,
          fontFamily: type.mono,
          fontSize: 22,
          fontWeight: 750,
          letterSpacing: 1.7,
          textAlign: "center",
          opacity: question,
        }}
      >
        WHAT MUST A HUMAN UNDERSTAND?
      </div>
    </>
  );
};

const ReviewProducts: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 152.530304;
  const items = [
    { label: "FIND DEFECTS", x: 180, y: 360, at: 1 },
    { label: "BUILD A MENTAL MODEL", x: 1230, y: 360, at: 7 },
    { label: "CREATE SHARED LANGUAGE", x: 180, y: 690, at: 14 },
    { label: "MAKE RESPONSIBILITY EXPLICIT", x: 1230, y: 690, at: 21 },
  ];
  const automation = appear(local, 27);
  return (
    <>
      <Header chapter="Why review matters" index={6} />
      <div style={{ position: "absolute", left: 124, top: 144 }}>
        <Kicker>Code review produces four things</Kicker>
      </div>
      <div
        style={{
          position: "absolute",
          left: 820,
          top: 474,
          width: 280,
          height: 130,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: palette.paperBright,
          backgroundColor: palette.ink,
          fontFamily: type.mono,
          fontSize: 25,
          fontWeight: 750,
          letterSpacing: 2,
        }}
      >
        CHANGE
      </div>
      {items.map((item) => {
        const value = appear(local, item.at);
        return (
          <div
            key={item.label}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y,
              width: 510,
              color: palette.text,
              fontFamily: type.serif,
              fontSize: 44,
              fontWeight: 700,
              opacity: value,
              transform: `translateY(${(1 - value) * 12}px)`,
            }}
          >
            <div style={{ width: 72, height: 3, backgroundColor: palette.ink, marginBottom: 20 }} />
            {item.label}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          top: 860,
          display: "flex",
          alignItems: "center",
          gap: 26,
          opacity: automation,
        }}
      >
        <span style={{ color: palette.ink, fontFamily: type.mono, fontSize: 17, fontWeight: 750, letterSpacing: 1.4 }}>
          AUTOMATION
        </span>
        <div style={{ width: `${automation * 290}px`, height: 3, backgroundColor: palette.ink }} />
        <span style={{ color: palette.muted, fontFamily: type.sans, fontSize: 23 }}>
          can replace part of one function — not automatically the other three.
        </span>
      </div>
    </>
  );
};

const CommunitySplit: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 187.101;
  const left = appear(local, 0.5);
  const right = appear(local, 18.5);
  const conclusion = appear(local, 39);
  return (
    <>
      <Header chapter="The community split" index={7} />
      <div style={{ position: "absolute", left: 124, right: 124, top: 145 }}>
        <Kicker>Two real costs</Kicker>
        <div style={{ display: "flex", gap: 120, marginTop: 38 }}>
          <div style={{ flex: 1, opacity: left }}>
            <div style={{ color: palette.ink, fontFamily: type.serif, fontSize: 72, fontWeight: 700, lineHeight: 1 }}>
              Read for
              <br />
              maintenance.
            </div>
            <div style={{ marginTop: 22, color: palette.muted, fontFamily: type.mono, fontSize: 16, fontWeight: 700, letterSpacing: 1.2 }}>
              MENTAL MODEL · UNUSUAL FAILURE · HANDOFF
            </div>
          </div>
          <div style={{ width: 2, height: 220, backgroundColor: palette.ghost }} />
          <div style={{ flex: 1, opacity: right }}>
            <div style={{ color: palette.ink, fontFamily: type.serif, fontSize: 72, fontWeight: 700, lineHeight: 1 }}>
              Verify for
              <br />
              scale.
            </div>
            <div style={{ marginTop: 22, color: palette.muted, fontFamily: type.mono, fontSize: 16, fontWeight: 700, letterSpacing: 1.2 }}>
              TESTS · RUNTIME CHECKS · OBSERVABILITY
            </div>
          </div>
        </div>
      </div>
      <Img
        src={staticFile("authority-boundary/editorial/read-verify-instruments-v1.png")}
        style={{
          position: "absolute",
          left: 285,
          top: 320,
          width: 1350,
          height: 760,
          objectFit: "contain",
          clipPath: "inset(0 50% 0 0)",
          opacity: left * (1 - conclusion * 0.58),
          transform: `translateY(${(1 - left) * 10}px)`,
        }}
      />
      <Img
        src={staticFile("authority-boundary/editorial/read-verify-instruments-v1.png")}
        style={{
          position: "absolute",
          left: 285,
          top: 320,
          width: 1350,
          height: 760,
          objectFit: "contain",
          clipPath: "inset(0 0 0 50%)",
          opacity: right * (1 - conclusion * 0.58),
          transform: `translateY(${(1 - right) * 10}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 300,
          right: 300,
          bottom: 135,
          color: palette.ink,
          fontFamily: type.serif,
          fontSize: 45,
          fontWeight: 700,
          textAlign: "center",
          opacity: conclusion,
        }}
      >
        Neither cost is imaginary.
      </div>
    </>
  );
};

const LearningCost: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 231.41;
  const progress = appear(local, 0.4, 14);
  return (
    <>
      <Header chapter="The third cost" index={8} />
      <div style={{ position: "absolute", left: 124, top: 148 }}>
        <Kicker>Learning is not throughput</Kicker>
        <div style={{ marginTop: 24, color: palette.text, fontFamily: type.serif, fontSize: 82, fontWeight: 700, letterSpacing: -2.8 }}>
          Who produces the next maintainer?
        </div>
      </div>
      <HorizontalRail x={230} y={570} width={1460} progress={progress} />
      {[
        ["READ", 180, 0.5],
        ["CHANGE", 630, 5],
        ["JUDGMENT", 1080, 10],
        ["FUTURE MAINTAINER", 1480, 15],
      ].map(([label, x, at]) => (
        <FlowNode
          key={String(label)}
          label={String(label)}
          x={Number(x)}
          y={520}
          width={260}
          active={appear(local, Number(at))}
          size={18}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 250,
          right: 250,
          top: 710,
          color: palette.ink,
          fontFamily: type.serif,
          fontSize: 56,
          fontWeight: 700,
          textAlign: "center",
          opacity: appear(local, 18),
        }}
      >
        Different costs arrive at different times.
      </div>
    </>
  );
};

const OpenAIExperiment: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 254.788279;
  const metrics = appear(local, 10);
  const role = appear(local, 24);
  const caveat = appear(local, 35);
  return (
    <>
      <Header chapter="Industry experiments" index={9} />
      <div style={{ position: "absolute", left: 124, right: 124, top: 138 }}>
        <SourceLine>OPENAI · HARNESS ENGINEERING · FEB 11, 2026</SourceLine>
        <div style={{ marginTop: 25, color: palette.text, fontFamily: type.serif, fontSize: 74, fontWeight: 700, letterSpacing: -2.5 }}>
          A product from an empty repository.
        </div>
      </div>
      <div style={{ position: "absolute", left: 124, right: 124, top: 380, display: "flex", alignItems: "flex-end", justifyContent: "space-between", opacity: metrics }}>
        {[
          ["5", "MONTHS"],
          ["~1M", "LINES"],
          ["~1,500", "MERGED PRs"],
        ].map(([value, label]) => (
          <div key={label} style={{ width: 480 }}>
            <div style={{ color: palette.ink, fontFamily: type.serif, fontSize: 112, fontWeight: 700, letterSpacing: -4 }}>{value}</div>
            <div style={{ marginTop: 10, color: palette.muted, fontFamily: type.mono, fontSize: 17, fontWeight: 700, letterSpacing: 2 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 124, top: 660, opacity: role }}>
        <SourceLine>HUMAN ROLE</SourceLine>
        <div style={{ marginTop: 18, color: palette.text, fontFamily: type.serif, fontSize: 49, fontWeight: 700 }}>
          specify intent · build the environment · create feedback loops
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          top: 805,
          paddingTop: 20,
          borderTop: `2px solid ${palette.pale}`,
          color: palette.muted,
          fontFamily: type.sans,
          fontSize: 23,
          opacity: caveat,
        }}
      >
        Company-reported · greenfield · not proof for every mature system
      </div>
    </>
  );
};

const CloudflareReview: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 300.214;
  const connect = appear(local, 0.4, 7);
  const risk = appear(local, 10);
  const migration = appear(local, 16);
  const points = [
    [820, 335], [1030, 360], [1190, 485], [1120, 670],
    [820, 740], [520, 670], [450, 485],
  ];
  return (
    <>
      <Header chapter="Industry experiments" index={10} />
      <div style={{ position: "absolute", left: 124, top: 138 }}>
        <SourceLine>CLOUDFLARE · AI CODE REVIEW · APR 20, 2026</SourceLine>
        <div style={{ marginTop: 20, color: palette.text, fontFamily: type.serif, fontSize: 68, fontWeight: 700 }}>
          Up to seven specialists. One coordinator.
        </div>
      </div>
      <div style={{ position: "absolute", left: 820, top: 500, width: 280, height: 120, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: palette.ink, color: palette.paperBright, fontFamily: type.mono, fontSize: 19, fontWeight: 750, letterSpacing: 1.4 }}>
        COORDINATOR
      </div>
      {points.map(([x, y], index) => (
        <div key={`${x}-${y}`} style={{ position: "absolute", left: x, top: y, width: 96, height: 96, borderRadius: "50%", border: `4px solid ${palette.ink}`, backgroundColor: palette.paper, opacity: connect, transform: `scale(${0.75 + connect * 0.25})` }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: palette.ink, fontFamily: type.mono, fontSize: 23, fontWeight: 800 }}>{index + 1}</div>
        </div>
      ))}
      <div style={{ position: "absolute", right: 124, top: 755, color: palette.ink, fontFamily: type.mono, fontSize: 18, fontWeight: 750, letterSpacing: 1.5, opacity: risk }}>
        REVIEW DEPTH BY RISK TIER
      </div>
      <div style={{ position: "absolute", right: 124, top: 815, color: palette.text, fontFamily: type.serif, fontSize: 38, fontWeight: 700, opacity: migration }}>
        Generated migration ≠ unimportant migration.
      </div>
    </>
  );
};

const GodotScarcity: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 322.949;
  const left = appear(local, 0.5);
  const right = appear(local, 8);
  const owner = appear(local, 18);
  const synthesis = appear(local, 29);
  return (
    <>
      <Header chapter="Industry experiments" index={11} />
      <div style={{ position: "absolute", left: 124, top: 138 }}>
        <SourceLine>GODOT FOUNDATION · CONTRIBUTION POLICY · JUN 30, 2026</SourceLine>
        <div style={{ marginTop: 20, color: palette.text, fontFamily: type.serif, fontSize: 72, fontWeight: 700 }}>
          Generation got cheaper. Review did not.
        </div>
      </div>
      <div style={{ position: "absolute", left: 180, right: 180, top: 430, display: "flex", alignItems: "flex-end", gap: 90 }}>
        <div style={{ flex: 1, opacity: left }}>
          <SourceLine>PR GENERATION EFFORT</SourceLine>
          <div style={{ marginTop: 24, color: palette.ink, fontFamily: type.serif, fontSize: 100, fontWeight: 700 }}>↓</div>
        </div>
        <div style={{ flex: 1, opacity: right }}>
          <SourceLine>QUALIFIED REVIEW CAPACITY</SourceLine>
          <div style={{ marginTop: 24, color: palette.ink, fontFamily: type.serif, fontSize: 100, fontWeight: 700 }}>≈</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 180, right: 180, top: 675, paddingTop: 22, borderTop: `2px solid ${palette.pale}`, color: palette.text, fontFamily: type.serif, fontSize: 45, fontWeight: 700, opacity: owner }}>
        Human approval · someone who can explain, maintain, and fix the work
      </div>
      <div style={{ position: "absolute", left: 180, right: 180, top: 805, color: palette.ink, fontFamily: type.mono, fontSize: 21, fontWeight: 800, letterSpacing: 1.5, opacity: synthesis }}>
        ABUNDANT CODE · SCARCE VERIFICATION, ATTENTION, OWNERSHIP
      </div>
    </>
  );
};

const AaronBoundary: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 359.841666;
  const marker = interpolate(local, [2, 18, 33, 45], [0.08, 0.28, 0.68, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const critical = appear(local, 18);
  const record = appear(local, 31);
  return (
    <>
      <Header chapter="My working boundary" index={12} />
      <div style={{ position: "absolute", left: 124, top: 142 }}>
        <Kicker>Not every artifact deserves the same attention</Kicker>
        <div style={{ marginTop: 22, color: palette.text, fontFamily: type.serif, fontSize: 72, fontWeight: 700 }}>
          My posture changes at authority.
        </div>
      </div>
      <div style={{ position: "absolute", left: 170, right: 170, top: 455 }}>
        <div style={{ position: "relative", height: 150 }}>
          <HorizontalRail x={0} y={64} width={1580} progress={1} />
          <div style={{ position: "absolute", left: `${marker * 100}%`, top: 43, width: 44, height: 44, borderRadius: "50%", border: `6px solid ${palette.ink}`, backgroundColor: palette.paper, transform: "translateX(-22px)" }} />
          <div style={{ position: "absolute", left: 0, top: 96, color: palette.muted, fontFamily: type.mono, fontSize: 17, fontWeight: 750, letterSpacing: 1.5 }}>DISPOSABLE</div>
          <div style={{ position: "absolute", right: 0, top: 96, color: palette.ink, fontFamily: type.mono, fontSize: 17, fontWeight: 750, letterSpacing: 1.5 }}>AUTHORITATIVE</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 170, top: 650, width: 730, opacity: critical }}>
        <SourceLine>CRITICAL SYSTEM · DEFINED BY CONSEQUENCE</SourceLine>
        <div style={{ marginTop: 18, color: palette.text, fontFamily: type.serif, fontSize: 42, fontWeight: 700, lineHeight: 1.25 }}>
          permissions · money · privacy · deletion · security
        </div>
      </div>
      <div style={{ position: "absolute", right: 170, top: 650, width: 730, opacity: record }}>
        <SourceLine>SYSTEM OF RECORD · DEFINED BY AUTHORITY</SourceLine>
        <div style={{ marginTop: 18, width: 480, color: palette.text, fontFamily: type.serif, fontSize: 42, fontWeight: 700, lineHeight: 1.25 }}>
          customer · order · balance · contractual state
        </div>
      </div>
      <SemanticSprite
        src={staticFile(AUTHORITY_LEDGER_LONGFORM_RUNTIME_ASSET.staticFilePath)}
        startFrame={Math.round(
          AUTHORITY_LEDGER_LONGFORM_RUNTIME_ASSET.visibleFromSec *
            AUTHORITY_BOUNDARY_LONGFORM_FPS,
        )}
        endFrame={Math.round(
          AUTHORITY_LEDGER_LONGFORM_RUNTIME_ASSET.visibleUntilSec *
            AUTHORITY_BOUNDARY_LONGFORM_FPS,
        )}
        enterFrames={Math.round(
          AUTHORITY_LEDGER_LONGFORM_RUNTIME_ASSET.enterDurationSec *
            AUTHORITY_BOUNDARY_LONGFORM_FPS,
        )}
        exitFrames={Math.round(
          AUTHORITY_LEDGER_LONGFORM_RUNTIME_ASSET.exitDurationSec *
            AUTHORITY_BOUNDARY_LONGFORM_FPS,
        )}
        translateY={AUTHORITY_LEDGER_LONGFORM_RUNTIME_ASSET.translateY}
        exitTranslateY={
          AUTHORITY_LEDGER_LONGFORM_RUNTIME_ASSET.exitTranslateY
        }
        maxOpacity={AUTHORITY_LEDGER_LONGFORM_RUNTIME_ASSET.maxOpacity}
        style={{
          position: "absolute",
          right: 78,
          top: 590,
          width: 405,
          height: 285,
          objectFit: "contain",
        }}
      />
    </>
  );
};

const AuthorityRecovery: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 408.57;
  const contrast = appear(local, 0.4);
  const rollback = appear(local, 14);
  const effects = appear(local, 20);
  return (
    <>
      <Header chapter="Authority, not line count" index={13} />
      <div style={{ position: "absolute", left: 124, right: 124, top: 148 }}>
        <Kicker>Five lines can outweigh a thousand</Kicker>
        <div style={{ display: "flex", gap: 80, marginTop: 52, opacity: contrast }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: palette.ink, fontFamily: type.serif, fontSize: 118, fontWeight: 700 }}>5</div>
            <SourceLine>LINES THAT WRITE AUTHORITATIVE STATE</SourceLine>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: palette.pale, fontFamily: type.serif, fontSize: 118, fontWeight: 700 }}>1,000</div>
            <SourceLine>LINES OF DISPOSABLE INTERFACE</SourceLine>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 160, right: 160, top: 610 }}>
        <div style={{ color: palette.text, fontFamily: type.mono, fontSize: 21, fontWeight: 750, letterSpacing: 1.4, opacity: 1 - rollback * 0.72, textDecoration: rollback > 0.5 ? "line-through" : "none" }}>
          ROLLBACK CODE
        </div>
        <div style={{ marginTop: 26, width: `${(1 - rollback) * 100}%`, height: 3, backgroundColor: palette.ink }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 72, opacity: effects }}>
          {["RECORDS", "MESSAGES", "ACCESS", "DECISIONS"].map((item) => (
            <div key={item} style={{ color: palette.ink, fontFamily: type.mono, fontSize: 20, fontWeight: 800, letterSpacing: 1.4 }}>{item}</div>
          ))}
        </div>
        <div style={{ marginTop: 52, color: palette.text, fontFamily: type.serif, fontSize: 48, fontWeight: 700, textAlign: "center", opacity: effects }}>
          Rollback code ≠ restore reality
        </div>
      </div>
    </>
  );
};

const ThreeLevelRule: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 444.245074;
  const levels = [
    { at: 4, n: "01", title: "OUTCOME", copy: "Disposable work" },
    { at: 10, n: "02", title: "EVIDENCE + SYSTEM MODEL", copy: "Shared or production work" },
    { at: 17, n: "03", title: "CRITICAL PATH + RECOVERY + OWNER", copy: "Critical / system-of-record write" },
  ];
  return (
    <>
      <Header chapter="The operating rule" index={14} />
      <div style={{ position: "absolute", left: 124, top: 138 }}>
        <Kicker>My rule</Kicker>
        <div style={{ marginTop: 20, color: palette.ink, fontFamily: type.serif, fontSize: 92, fontWeight: 700, letterSpacing: -3.2 }}>
          Review depth follows authority.
        </div>
      </div>
      <div style={{ position: "absolute", left: 124, right: 124, top: 390 }}>
        {levels.map((level, index) => {
          const active = appear(local, level.at);
          return (
            <div key={level.n} style={{ display: "grid", gridTemplateColumns: "110px 660px 1fr", alignItems: "center", minHeight: 150, borderTop: `2px solid ${index === 0 ? palette.ink : palette.pale}`, opacity: 0.25 + active * 0.75 }}>
              <div style={{ color: palette.muted, fontFamily: type.mono, fontSize: 17, fontWeight: 750 }}>{level.n}</div>
              <div style={{ color: active > 0.55 ? palette.ink : palette.muted, fontFamily: type.serif, fontSize: index === 2 ? 43 : 50, fontWeight: 700 }}>{level.title}</div>
              <div style={{ color: palette.text, fontFamily: type.sans, fontSize: 25 }}>{level.copy}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 124, bottom: 145, color: palette.ink, fontFamily: type.mono, fontSize: 18, fontWeight: 800, letterSpacing: 1.7, opacity: appear(local, 31) }}>
        CUMULATIVE — READING AND TESTS STAY TOGETHER
      </div>
    </>
  );
};

const ResponsibilityChain: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 486.729;
  const labels = ["INTENT", "IMPLEMENTATION", "EVIDENCE", "EFFECT", "RECOVERY"];
  return (
    <>
      <Header chapter="The review unit" index={15} />
      <div style={{ position: "absolute", left: 124, top: 150 }}>
        <Kicker>Not just the diff</Kicker>
        <div style={{ marginTop: 24, color: palette.text, fontFamily: type.serif, fontSize: 82, fontWeight: 700 }}>
          Review the responsibility chain.
        </div>
      </div>
      <HorizontalRail x={180} y={590} width={1560} progress={appear(local, 0.4, 7)} />
      {labels.map((label, index) => (
        <FlowNode key={label} label={label} x={90 + index * 380} y={530} width={280} active={appear(local, 0.4 + index * 1.6)} size={index === 1 ? 17 : 19} />
      ))}
      <div style={{ position: "absolute", left: 690, right: 690, top: 720, height: 3, backgroundColor: palette.ink, transform: `scaleX(${appear(local, 8)})` }} />
    </>
  );
};

const BoundaryMoves: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 500.06314;
  const motion = interpolate(local, [4, 13, 21], [0.06, 0.5, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const learning = appear(local, 26);
  return (
    <>
      <Header chapter="The objection" index={16} />
      <div style={{ position: "absolute", left: 124, top: 140 }}>
        <Kicker>Risk tiers can become bureaucracy</Kicker>
        <div style={{ marginTop: 22, color: palette.text, fontFamily: type.serif, fontSize: 76, fontWeight: 700 }}>
          The boundary has to move.
        </div>
      </div>
      <div style={{ position: "absolute", left: 180, right: 180, top: 490 }}>
        <HorizontalRail x={0} y={55} width={1560} progress={1} />
        <div style={{ position: "absolute", left: `${motion * 100}%`, top: 20, width: 210, height: 70, display: "flex", alignItems: "center", justifyContent: "center", color: palette.paperBright, backgroundColor: palette.ink, fontFamily: type.mono, fontSize: 15, fontWeight: 800, letterSpacing: 1.2, transform: "translateX(-105px)" }}>
          TEMPORARY SCRIPT
        </div>
        <div style={{ position: "absolute", left: 0, top: 110, color: palette.muted, fontFamily: type.mono, fontSize: 16, fontWeight: 750 }}>PRIVATE</div>
        <div style={{ position: "absolute", left: "45%", top: 110, color: palette.muted, fontFamily: type.mono, fontSize: 16, fontWeight: 750 }}>TEAM DEPENDENCY</div>
        <div style={{ position: "absolute", right: 0, top: 110, color: palette.ink, fontFamily: type.mono, fontSize: 16, fontWeight: 750 }}>PRODUCTION WRITE</div>
      </div>
      <div style={{ position: "absolute", left: 180, right: 180, top: 730, opacity: learning }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <SourceLine>SEPARATE AXIS</SourceLine>
          <div style={{ flex: 1, height: 2, backgroundColor: palette.pale }} />
          <div style={{ color: palette.ink, fontFamily: type.serif, fontSize: 43, fontWeight: 700 }}>Learning value</div>
        </div>
        <div style={{ marginTop: 26, color: palette.text, fontFamily: type.sans, fontSize: 26, textAlign: "right" }}>
          Low shipping risk can still deserve deep reading when the goal is judgment.
        </div>
      </div>
    </>
  );
};

const FourQuestions: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 537.215067;
  const questions = [
    { at: 14.1, label: "01", text: "What can this code change?" },
    { at: 16.1, label: "02", text: "Who or what inherits the result?" },
    { at: 19.1, label: "03", text: "Can reality also be restored?" },
    { at: 23.5, label: "04", text: "Who can explain and repair the failure?" },
  ];
  const intro = appear(local, 0.4);
  return (
    <>
      <Header chapter="The better question" index={17} />
      <div style={{ position: "absolute", left: 124, top: 140, opacity: intro }}>
        <Kicker>Should you read it?</Kicker>
        <div style={{ marginTop: 20, color: palette.text, fontFamily: type.serif, fontSize: 68, fontWeight: 700 }}>
          Every relevant line · critical path · outcome
        </div>
      </div>
      <div style={{ position: "absolute", left: 160, right: 160, top: 350 }}>
        {questions.map((question, index) => {
          const active = appear(local, question.at, 0.38);
          return (
            <div key={question.label} style={{ display: "grid", gridTemplateColumns: "90px 1fr", alignItems: "center", minHeight: 123, borderTop: `2px solid ${index === 0 ? palette.ink : palette.pale}`, opacity: active }}>
              <div style={{ color: palette.muted, fontFamily: type.mono, fontSize: 16, fontWeight: 750 }}>{question.label}</div>
              <div style={{ color: palette.ink, fontFamily: type.serif, fontSize: 43, fontWeight: 700 }}>{question.text}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const Consequence: React.FC<{ time: number }> = ({ time }) => {
  const local = time - 568.382;
  const artifacts = appear(local, 0.3);
  const consequence = appear(local, 5);
  const job = appear(local, 8.8);
  return (
    <>
      <Header chapter="Ownership" index={18} />
      <div style={{ position: "absolute", left: 124, right: 124, top: 170 }}>
        <div style={{ color: palette.muted, fontFamily: type.mono, fontSize: 20, fontWeight: 800, letterSpacing: 2.2, opacity: artifacts }}>
          IMPLEMENTATION · TESTS · REVIEW
        </div>
        <div style={{ marginTop: 100, color: palette.ink, fontFamily: type.serif, fontSize: 112, fontWeight: 700, lineHeight: 0.98, letterSpacing: -4, opacity: consequence }}>
          It cannot own
          <br />
          the consequence.
        </div>
        <div style={{ marginTop: 64, color: palette.text, fontFamily: type.serif, fontSize: 58, fontWeight: 700, opacity: job }}>
          That is still our job.
        </div>
      </div>
    </>
  );
};

const EndCard: React.FC<{ time: number }> = ({ time }) => {
  const local = time - AUTHORITY_BOUNDARY_LONGFORM_NARRATION_SEC;
  const entry = appear(local, 0.3, 0.7);
  const rule = appear(local, 0.8, 0.7);
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: entry,
          transform: `translateY(${(1 - entry) * 14}px)`,
        }}
      >
        <Img src={staticFile("authority-boundary/ag-logo.png")} style={{ width: 106, height: 106, objectFit: "cover", borderRadius: 10 }} />
        <div style={{ marginTop: 28, color: palette.ink, fontFamily: type.serif, fontSize: 58, fontWeight: 700 }}>
          Aaron Guo
        </div>
        <div style={{ marginTop: 17, color: palette.muted, fontFamily: type.mono, fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>
          AI-NATIVE BUILDER · HUMAN-FIRST THINKER
        </div>
        <div style={{ marginTop: 34, width: 360, height: 3, backgroundColor: palette.ink, transform: `scaleX(${rule})` }} />
        <div style={{ marginTop: 23, color: palette.muted, fontFamily: type.sans, fontSize: 20, fontWeight: 650 }}>
          aaronguo.com
        </div>
      </div>
    </>
  );
};

const LongformSceneStack: React.FC<{
  time: number;
  phrases: CaptionPhrase[];
}> = ({time, phrases}) => (
  <>
      <SceneLayer time={time} start={0} end={22}>
        <OppositeAnswers time={time} />
      </SceneLayer>
      <SceneLayer time={time} start={22} end={44.365894}>
        <AccountabilityQuestion time={time} />
      </SceneLayer>
      <SceneLayer time={time} start={44.365894} end={78.079}>
        <MitchellGate time={time} />
      </SceneLayer>
      <SceneLayer time={time} start={78.079} end={113.890496}>
        <UncleBobGate time={time} />
      </SceneLayer>
      <SceneLayer time={time} start={113.890496} end={152.530304}>
        <SharedGround time={time} />
      </SceneLayer>
      <SceneLayer time={time} start={152.530304} end={187.101}>
        <ReviewProducts time={time} />
      </SceneLayer>
      <SceneLayer time={time} start={187.101} end={231.41}>
        <CommunitySplit time={time} />
      </SceneLayer>
      <SceneLayer time={time} start={231.41} end={254.788279}>
        <LearningCost time={time} />
      </SceneLayer>
      <SceneLayer time={time} start={254.788279} end={300.214}>
        <OpenAIExperiment time={time} />
      </SceneLayer>
      <SceneLayer time={time} start={300.214} end={322.949}>
        <CloudflareReview time={time} />
      </SceneLayer>
      <SceneLayer time={time} start={322.949} end={359.841666}>
        <GodotScarcity time={time} />
      </SceneLayer>
      <SceneLayer time={time} start={359.841666} end={408.57}>
        <AaronBoundary time={time} />
      </SceneLayer>
      <SceneLayer time={time} start={408.57} end={444.245074}>
        <AuthorityRecovery time={time} />
      </SceneLayer>
      <SceneLayer time={time} start={444.245074} end={486.729}>
        <ThreeLevelRule time={time} />
      </SceneLayer>
      <SceneLayer time={time} start={486.729} end={500.06314}>
        <ResponsibilityChain time={time} />
      </SceneLayer>
      <SceneLayer time={time} start={500.06314} end={537.215067}>
        <BoundaryMoves time={time} />
      </SceneLayer>
      <SceneLayer time={time} start={537.215067} end={568.382}>
        <FourQuestions time={time} />
      </SceneLayer>
      <SceneLayer
        time={time}
        start={568.382}
        end={AUTHORITY_BOUNDARY_LONGFORM_NARRATION_SEC}
      >
        <Consequence time={time} />
      </SceneLayer>
      <SceneLayer
        time={time}
        start={AUTHORITY_BOUNDARY_LONGFORM_NARRATION_SEC}
        end={AUTHORITY_BOUNDARY_LONGFORM_DURATION_SEC}
      >
        <EndCard time={time} />
      </SceneLayer>

      <CaptionBar time={time} phrases={phrases} />
  </>
);

const V4CoverHero: React.FC<{time: number}> = ({time}) => {
  const opacity = 1 - ramp(
    time,
    AUTHORITY_BOUNDARY_LONGFORM_V4_COVER_SEC - 0.44,
    AUTHORITY_BOUNDARY_LONGFORM_V4_COVER_SEC,
    easeInOut,
  );
  if (opacity <= 0) return null;

  return (
    <AbsoluteFill style={{backgroundColor: palette.paper, opacity}}>
      <Img
        src={staticFile("authority-boundary/cover-youtube-v2-c.png")}
        style={{width: "100%", height: "100%", objectFit: "cover"}}
      />
    </AbsoluteFill>
  );
};

export const AuthorityBoundaryLongformVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const manifest = useAudioManifest();
  const phrases = useMemo(
    () => buildCaptionPhrases(manifest?.timeline.wordTimings ?? []),
    [manifest],
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.paper,
        overflow: "hidden",
        color: palette.text,
      }}
    >
      <Audio
        src={staticFile(
          "authority-boundary/authority-in-the-loop-score-v1.m4a",
        )}
        volume={scoreVolume(time)}
      />
      <Audio src={staticFile("authority-boundary/longform-audio.mp3")} />
      <LongformSceneStack time={time} phrases={phrases} />
    </AbsoluteFill>
  );
};

type AuthoredScoreCueProps = {
  src: string;
  sourceStartSec: number;
  volumePoints: ReadonlyArray<readonly [number, number]>;
};

const AuthoredScoreCue: React.FC<AuthoredScoreCueProps> = ({
  src,
  sourceStartSec,
  volumePoints,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const volume = interpolate(
    time,
    volumePoints.map(([pointTime]) => pointTime),
    volumePoints.map(([, pointVolume]) => pointVolume),
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeInOut,
    },
  );

  return (
    <Audio
      src={staticFile(src)}
      startFrom={Math.round(sourceStartSec * fps)}
      volume={volume}
    />
  );
};

export const AuthorityBoundaryLongformVideoV4: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const globalTime = frame / fps;
  const contentTime = Math.max(
    0,
    globalTime - AUTHORITY_BOUNDARY_LONGFORM_V4_COVER_SEC,
  );
  const coverFrames = Math.round(
    AUTHORITY_BOUNDARY_LONGFORM_V4_COVER_SEC * fps,
  );
  const manifest = useAudioManifest();
  const phrases = useMemo(
    () => buildCaptionPhrases(manifest?.timeline.wordTimings ?? []),
    [manifest],
  );
  const cues = [
    {
      fromSec: 0,
      durationSec: AUTHORITY_BOUNDARY_LONGFORM_V4_COVER_SEC + 70,
      sourceStartSec: 0,
      baseVolume: 0.12,
      fadeInSec: 0.25,
      fadeOutSec: 3,
      openingVolume: 0.55,
    },
    {
      fromSec: AUTHORITY_BOUNDARY_LONGFORM_V4_COVER_SEC + 113.890496,
      durationSec: 231.41 - 113.890496,
      sourceStartSec: 95,
      baseVolume: 0.1,
      fadeInSec: 2,
      fadeOutSec: 3,
    },
    {
      fromSec: AUTHORITY_BOUNDARY_LONGFORM_V4_COVER_SEC + 254.788279,
      durationSec: 444.245074 - 254.788279,
      sourceStartSec: 190,
      baseVolume: 0.095,
      fadeInSec: 2.5,
      fadeOutSec: 3.5,
    },
    {
      fromSec: AUTHORITY_BOUNDARY_LONGFORM_V4_COVER_SEC + 500.06314,
      durationSec: AUTHORITY_BOUNDARY_LONGFORM_DURATION_SEC - 500.06314,
      sourceStartSec: 363.8,
      baseVolume: 0.11,
      fadeInSec: 2.5,
      fadeOutSec: 2,
      postNarrationAtSec:
        AUTHORITY_BOUNDARY_LONGFORM_NARRATION_SEC - 500.06314,
      postNarrationVolume: 0.2,
    },
  ] as const;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.paper,
        overflow: "hidden",
        color: palette.text,
      }}
    >
      {cues.map((cue) => (
        <Sequence
          key={`${cue.fromSec}-${cue.sourceStartSec}`}
          from={Math.round(cue.fromSec * fps)}
          durationInFrames={Math.round(cue.durationSec * fps)}
        >
          <ChapterScoreCue {...cue} />
        </Sequence>
      ))}
      <Sequence from={coverFrames}>
        <Audio src={staticFile("authority-boundary/longform-audio.mp3")} />
      </Sequence>
      <LongformSceneStack time={contentTime} phrases={phrases} />
      <V4CoverHero time={globalTime} />
    </AbsoluteFill>
  );
};

export const AuthorityBoundaryLongformVideoV5: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const globalTime = frame / fps;
  const contentTime = Math.max(
    0,
    globalTime - AUTHORITY_BOUNDARY_LONGFORM_V4_COVER_SEC,
  );
  const coverFrames = Math.round(
    AUTHORITY_BOUNDARY_LONGFORM_V4_COVER_SEC * fps,
  );
  const manifest = useAudioManifest();
  const phrases = useMemo(
    () => buildCaptionPhrases(manifest?.timeline.wordTimings ?? []),
    [manifest],
  );
  const scoreCues = [
    {
      id: "opening-ground",
      fromSec: 0,
      durationSec: 72.8,
      src: "fde-full-film/music-full-v1.mp3",
      sourceStartSec: 0,
      volumePoints: [
        [0, 0],
        [0.25, 0.55],
        [2.15, 0.55],
        [3.35, 0.12],
        [55, 0.11],
        [65.8, 0.075],
        [72.8, 0],
      ],
    },
    {
      id: "common-ground-breath",
      fromSec: 108,
      durationSec: 46.032,
      src: "authority-boundary-v5/calm-chamber.mp3",
      sourceStartSec: 0,
      volumePoints: [
        [0, 0],
        [8, 0.11],
        [28, 0.12],
        [38, 0.09],
        [46.032, 0],
      ],
    },
    {
      id: "industry-pressure",
      fromSec: 260,
      durationSec: 110,
      src: "authority-boundary-v5/industry-strings.mp3",
      sourceStartSec: 0,
      volumePoints: [
        [0, 0],
        [10, 0.07],
        [35, 0.1],
        [60, 0.13],
        [84, 0.17],
        [100, 0.13],
        [110, 0],
      ],
    },
    {
      id: "questions-resolution",
      fromSec: 496,
      durationSec: AUTHORITY_BOUNDARY_LONGFORM_V4_DURATION_SEC - 496,
      src: "authority-boundary-v5/resolution-strings.mp3",
      sourceStartSec: 0,
      volumePoints: [
        [0, 0],
        [10, 0.075],
        [35, 0.105],
        [60, 0.14],
        [78, 0.16],
        [86.142517, 0.18],
        [88, 0.22],
        [AUTHORITY_BOUNDARY_LONGFORM_V4_DURATION_SEC - 496, 0],
      ],
    },
  ] as const;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.paper,
        overflow: "hidden",
        color: palette.text,
      }}
    >
      {scoreCues.map(({id, fromSec, durationSec, ...cue}) => (
        <Sequence
          key={id}
          from={Math.round(fromSec * fps)}
          durationInFrames={Math.round(durationSec * fps)}
        >
          <AuthoredScoreCue {...cue} />
        </Sequence>
      ))}
      <Sequence from={coverFrames}>
        <Audio src={staticFile("authority-boundary/longform-audio.mp3")} />
      </Sequence>
      <LongformSceneStack time={contentTime} phrases={phrases} />
      <V4CoverHero time={globalTime} />
    </AbsoluteFill>
  );
};
