import React from "react";
import {AbsoluteFill, Img, staticFile} from "remotion";

const palette = {
  paper: "#f4f3ef",
  paperBright: "#fbfaf7",
  ink: "#0a2346",
  text: "#182334",
  muted: "#6e7783",
  pale: "#c7ccd3",
  mist: "#dfe7ed",
  warmPale: "#ead7c3",
  warm: "#c9783f",
} as const;

const type = {
  serif: 'Georgia, "Times New Roman", serif',
  sans: 'Arial, Helvetica, sans-serif',
  mono: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
} as const;

const Brand: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 110,
      top: 65,
      color: palette.muted,
      fontFamily: type.mono,
      fontSize: 24,
      fontWeight: 750,
      letterSpacing: 3.4,
    }}
  >
    AARON GUO
  </div>
);

export const AuthorityBoundaryThumbnailA: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: palette.paper, overflow: "hidden"}}>
    <Brand />
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 190,
        width: 1050,
        color: palette.ink,
        fontFamily: type.serif,
        fontSize: 152,
        fontWeight: 700,
        lineHeight: 0.84,
        letterSpacing: -7,
      }}
    >
      AI WROTE IT.
      <br />
      DO YOU
      <br />
      READ IT?
    </div>

    <div
      style={{
        position: "absolute",
        right: 110,
        top: 178,
        width: 510,
        bottom: 90,
        borderLeft: `3px solid ${palette.ink}`,
        paddingLeft: 58,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 72,
      }}
    >
      <div>
        <div
          style={{
            color: palette.muted,
            fontFamily: type.mono,
            fontSize: 22,
            fontWeight: 750,
            letterSpacing: 2.3,
          }}
        >
          MITCHELL HASHIMOTO
        </div>
        <div
          style={{
            marginTop: 12,
            color: palette.ink,
            fontFamily: type.serif,
            fontSize: 91,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          “Read.”
        </div>
      </div>
      <div>
        <div
          style={{
            color: palette.muted,
            fontFamily: type.mono,
            fontSize: 22,
            fontWeight: 750,
            letterSpacing: 2.3,
          }}
        >
          UNCLE BOB
        </div>
        <div
          style={{
            marginTop: 12,
            color: palette.text,
            fontFamily: type.serif,
            fontSize: 91,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          “Don’t.”
        </div>
      </div>
    </div>
  </AbsoluteFill>
);

export const AuthorityBoundaryThumbnailB: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: palette.paper, overflow: "hidden"}}>
    <Brand />
    <div
      style={{
        position: "absolute",
        left: 110,
        right: 110,
        top: 180,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 86,
      }}
    >
      <div>
        <div
          style={{
            color: palette.muted,
            fontFamily: type.mono,
            fontSize: 22,
            fontWeight: 750,
            letterSpacing: 2.3,
          }}
        >
          MITCHELL HASHIMOTO
        </div>
        <div
          style={{
            marginTop: 28,
            color: palette.ink,
            fontFamily: type.serif,
            fontSize: 118,
            fontWeight: 700,
            lineHeight: 0.91,
            letterSpacing: -4.5,
          }}
        >
          READ THE
          <br />
          CODE.
        </div>
      </div>
      <div style={{borderLeft: `2px solid ${palette.pale}`, paddingLeft: 82}}>
        <div
          style={{
            color: palette.muted,
            fontFamily: type.mono,
            fontSize: 22,
            fontWeight: 750,
            letterSpacing: 2.3,
          }}
        >
          UNCLE BOB
        </div>
        <div
          style={{
            marginTop: 28,
            color: palette.text,
            fontFamily: type.serif,
            fontSize: 118,
            fontWeight: 700,
            lineHeight: 0.91,
            letterSpacing: -4.5,
          }}
        >
          DON’T
          <br />
          READ IT.
        </div>
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 110,
        right: 110,
        bottom: 75,
        minHeight: 180,
        backgroundColor: palette.ink,
        color: palette.paperBright,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: type.sans,
        fontSize: 86,
        fontWeight: 850,
        letterSpacing: -3,
      }}
    >
      WHO’S RIGHT?
    </div>
  </AbsoluteFill>
);

const portraitStyle: React.CSSProperties = {
  position: "absolute",
  objectFit: "contain",
  objectPosition: "bottom center",
  filter: "drop-shadow(0 18px 22px rgba(10, 35, 70, 0.12))",
};

export const AuthorityBoundaryThumbnailC: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: palette.paper, overflow: "hidden"}}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        right: 1160,
        backgroundColor: palette.ink,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 60,
        color: palette.paperBright,
        fontFamily: type.mono,
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: 3.2,
      }}
    >
      AARON GUO
    </div>
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 180,
        color: palette.warmPale,
        fontFamily: type.mono,
        fontSize: 26,
        fontWeight: 800,
        letterSpacing: 3.4,
      }}
    >
      AI WROTE IT.
    </div>
    <div
      style={{
        position: "absolute",
        left: 65,
        top: 245,
        width: 630,
        color: palette.paperBright,
        fontFamily: type.serif,
        fontSize: 160,
        fontWeight: 700,
        lineHeight: 0.82,
        letterSpacing: -7,
      }}
    >
      READ
      <br />
      THE
      <br />
      CODE?
    </div>
    <div
      style={{
        position: "absolute",
        left: 70,
        bottom: 62,
        color: palette.paperBright,
        fontFamily: type.mono,
        fontSize: 20,
        fontWeight: 750,
        letterSpacing: 2.5,
      }}
    >
      ONE QUESTION · TWO ANSWERS
    </div>

    <div
      style={{
        position: "absolute",
        left: 795,
        top: 150,
        width: 610,
        height: 610,
        borderRadius: "50%",
        backgroundColor: palette.mist,
      }}
    />
    <div
      style={{
        position: "absolute",
        right: -60,
        top: 175,
        width: 650,
        height: 650,
        borderRadius: "50%",
        backgroundColor: palette.warmPale,
      }}
    />
    <Img
      src={staticFile("authority-boundary/editorial/mitchell-portrait-v1.png")}
      style={{...portraitStyle, left: 755, bottom: -18, width: 690, height: 860}}
    />
    <Img
      src={staticFile("authority-boundary/editorial/uncle-bob-portrait-v1.png")}
      style={{...portraitStyle, right: -10, bottom: -5, width: 670, height: 835}}
    />

    <div
      style={{
        position: "absolute",
        left: 845,
        top: 86,
        padding: "15px 26px 12px",
        backgroundColor: palette.ink,
        color: palette.paperBright,
        fontFamily: type.serif,
        fontSize: 54,
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      READ.
    </div>
    <div
      style={{
        position: "absolute",
        right: 76,
        top: 86,
        padding: "15px 26px 12px",
        backgroundColor: palette.warm,
        color: palette.paperBright,
        fontFamily: type.serif,
        fontSize: 54,
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      DON’T.
    </div>
    <div
      style={{
        position: "absolute",
        left: 1328,
        top: 96,
        color: palette.muted,
        fontFamily: type.mono,
        fontSize: 23,
        fontWeight: 850,
        letterSpacing: 3,
      }}
    >
      VS
    </div>
  </AbsoluteFill>
);

export const AuthorityBoundaryThumbnailD: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: palette.paper, overflow: "hidden"}}>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 700,
        backgroundColor: palette.mist,
      }}
    />
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: 700,
        backgroundColor: palette.warmPale,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 700,
        top: 0,
        bottom: 0,
        width: 520,
        backgroundColor: palette.ink,
      }}
    />

    <div
      style={{
        position: "absolute",
        left: 70,
        top: 58,
        color: palette.ink,
        fontFamily: type.mono,
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: 3,
      }}
    >
      MITCHELL HASHIMOTO
    </div>
    <div
      style={{
        position: "absolute",
        right: 70,
        top: 58,
        color: palette.ink,
        fontFamily: type.mono,
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: 3,
      }}
    >
      UNCLE BOB
    </div>

    <Img
      src={staticFile("authority-boundary/editorial/mitchell-portrait-v1.png")}
      style={{...portraitStyle, left: -45, bottom: -12, width: 770, height: 920}}
    />
    <Img
      src={staticFile("authority-boundary/editorial/uncle-bob-portrait-v1.png")}
      style={{...portraitStyle, right: -20, bottom: -2, width: 750, height: 900}}
    />

    <div
      style={{
        position: "absolute",
        left: 730,
        right: 730,
        top: 120,
        color: palette.warmPale,
        fontFamily: type.mono,
        fontSize: 24,
        fontWeight: 800,
        letterSpacing: 3,
        textAlign: "center",
      }}
    >
      AI WROTE IT.
    </div>
    <div
      style={{
        position: "absolute",
        left: 730,
        top: 230,
        width: 460,
        color: palette.paperBright,
        fontFamily: type.serif,
        fontSize: 116,
        fontWeight: 700,
        lineHeight: 0.86,
        letterSpacing: -5,
        textAlign: "center",
      }}
    >
      READ
      <br />
      AI
      <br />
      CODE?
    </div>
    <div
      style={{
        position: "absolute",
        left: 94,
        bottom: 58,
        minWidth: 235,
        padding: "17px 25px 13px",
        backgroundColor: palette.ink,
        color: palette.paperBright,
        fontFamily: type.serif,
        fontSize: 68,
        fontWeight: 700,
        lineHeight: 1,
        textAlign: "center",
      }}
    >
      READ.
    </div>
    <div
      style={{
        position: "absolute",
        right: 94,
        bottom: 58,
        minWidth: 250,
        padding: "17px 25px 13px",
        backgroundColor: palette.warm,
        color: palette.paperBright,
        fontFamily: type.serif,
        fontSize: 68,
        fontWeight: 700,
        lineHeight: 1,
        textAlign: "center",
      }}
    >
      DON’T.
    </div>
  </AbsoluteFill>
);
