import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Freeze,
  Img,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";

export const QA_FACTORY_FPS = 30;
export const QA_FACTORY_DURATION_FRAMES = 8 * QA_FACTORY_FPS;

const BACKGROUND = "qa-factory-prototype/factory-background.png";
const HAND = "qa-factory-prototype/human-hand.png";
const AUDIO = "qa-factory-prototype/factory-audio.m4a";
const SOURCE_VIDEO = "human-review-required-001/source-codex-demo.mp4";
const STATIC_FALLBACK_FRAME = 102;
const SOURCE_POSTER_FRAME = 84;

const palette = {
  canvas: "#090c0b",
  surface: "#111714",
  surfaceRaised: "#19211d",
  paper: "#f1eee6",
  ink: "#151917",
  muted: "#9ca69f",
  line: "#2b3631",
  signal: "#58d1a3",
  tension: "#ef765f",
} as const;

const fonts = {
  sans: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"SFMono-Regular", Menlo, Monaco, Consolas, monospace',
} as const;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeMove = Easing.bezier(0.45, 0, 0.55, 1);
const easeIn = Easing.bezier(0.45, 0, 1, 1);

const progress = (
  frame: number,
  start: number,
  end: number,
  curve: (value: number) => number = easeOut,
) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: curve,
  });

const CssWorkshopFallback: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: palette.canvas,
      backgroundImage: `
        radial-gradient(circle at 13% 18%, ${palette.paper}16 0 110px, transparent 112px),
        radial-gradient(circle at 87% 73%, ${palette.paper}10 0 145px, transparent 147px),
        linear-gradient(90deg, transparent 0 27%, ${palette.line} 27.2% 27.8%, transparent 28% 72%, ${palette.line} 72.2% 72.8%, transparent 73%)
      `,
    }}
  >
    {[150, 540, 1010, 1460].map((top, index) => (
      <React.Fragment key={top}>
        <div
          style={{
            position: "absolute",
            left: index % 2 === 0 ? 28 : 54,
            top,
            width: 240,
            height: 250,
            border: `2px solid ${palette.line}`,
            backgroundColor: palette.surface,
            boxShadow: `14px 16px 0 ${palette.canvas}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: index % 2 === 0 ? 48 : 24,
            top: top + 90,
            width: 218,
            height: 280,
            border: `2px solid ${palette.line}`,
            backgroundColor: palette.surfaceRaised,
            boxShadow: `-14px 16px 0 ${palette.canvas}`,
          }}
        />
      </React.Fragment>
    ))}
  </AbsoluteFill>
);

const Conveyor: React.FC<{frame: number}> = ({frame}) => {
  const slatOffset = (frame * 8) % 80;
  return (
    <div
      style={{
        position: "absolute",
        left: 350,
        top: 78,
        width: 380,
        height: 1788,
        overflow: "hidden",
        borderLeft: `12px solid ${palette.paper}88`,
        borderRight: `12px solid ${palette.paper}88`,
        backgroundColor: `${palette.surface}e8`,
        boxShadow: `0 0 0 3px ${palette.canvas}99, 0 24px 40px ${palette.canvas}88`,
      }}
    >
      {Array.from({length: 26}, (_, index) => {
        const y = index * 80 - 80 - slatOffset;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: 18,
              right: 18,
              top: y,
              height: 3,
              backgroundColor: `${palette.muted}25`,
              boxShadow: `0 5px 0 ${palette.canvas}55`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: `${palette.paper}12`,
        }}
      />
    </div>
  );
};

type QaSensorProps = {
  frame: number;
  y: number;
  arrival: number;
  label: string;
};

const QaSensor: React.FC<QaSensorProps> = ({frame, y, arrival, label}) => {
  const reset = 1 - progress(frame, 176, 194, easeMove);
  const active = progress(frame, arrival, arrival + 5) * reset;
  const pulse =
    progress(frame, arrival - 2, arrival + 2, easeMove) *
    (1 - progress(frame, arrival + 3, arrival + 15, easeMove));
  const beamOpacity = 0.12 + pulse * 0.88;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 260,
          top: y - 27,
          width: 100,
          height: 54,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `3px solid ${palette.paper}aa`,
          backgroundColor: palette.surface,
          color: active > 0.5 ? palette.signal : palette.muted,
          fontFamily: fonts.mono,
          fontSize: 15,
          fontWeight: 900,
          letterSpacing: -0.5,
          boxShadow: `8px 9px 0 ${palette.canvas}77`,
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "absolute",
          left: 730,
          top: y - 31,
          width: 64,
          height: 62,
          border: `3px solid ${palette.paper}aa`,
          backgroundColor: palette.surface,
          boxShadow: `-8px 9px 0 ${palette.canvas}77`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 15,
            top: 14,
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: active > 0.5 ? palette.signal : palette.line,
            boxShadow: active > 0.5 ? `0 0 24px ${palette.signal}` : "none",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 360,
          top: y - 4,
          width: 370,
          height: 8,
          backgroundColor: palette.signal,
          opacity: beamOpacity,
          boxShadow: pulse > 0.05 ? `0 0 ${12 + pulse * 30}px ${palette.signal}` : "none",
        }}
      />
    </>
  );
};

const ProductCassette: React.FC<{
  frame: number;
  top: number;
  opacity: number;
  drop?: number;
  stamped?: boolean;
}> = ({frame, top, opacity, drop = 0, stamped = false}) => {
  const wobble = Math.sin(frame / 8) * 0.7;
  const scale = 1 - drop * 0.78;
  const stampInk = stamped ? progress(frame, 95, 99) : 0;
  const dropOpacity = 1 - progress(drop, 0.7, 1, easeIn);

  return (
    <div
      style={{
        position: "absolute",
        left: 540,
        top,
        width: 330,
        height: 242,
        opacity: opacity * dropOpacity,
        transform: `translate(-50%, -50%) rotate(${wobble + drop * 20}deg) scale(${scale})`,
        transformOrigin: "center center",
        filter: `drop-shadow(0 ${12 - drop * 8}px ${16 - drop * 8}px ${palette.canvas}cc)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `8px solid ${palette.paper}`,
          backgroundColor: palette.paper,
          boxShadow: `inset 0 0 0 3px ${palette.ink}55`,
          clipPath: "polygon(0 0, 96% 0, 100% 7%, 100% 100%, 4% 100%, 0 93%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          top: 18,
          height: 166,
          overflow: "hidden",
          border: `5px solid ${palette.ink}`,
          backgroundColor: palette.canvas,
        }}
      >
        <Freeze frame={SOURCE_POSTER_FRAME}>
          <OffthreadVideo
            src={staticFile(SOURCE_VIDEO)}
            muted
            style={{width: "100%", height: "100%", objectFit: "cover"}}
          />
        </Freeze>
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: `inset 0 0 34px ${palette.canvas}99`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 22,
          bottom: 19,
          color: palette.ink,
          fontFamily: fonts.mono,
          fontSize: 14,
          fontWeight: 900,
          letterSpacing: 1.1,
        }}
      >
        VIDEO · 001
      </div>
      <div
        style={{
          position: "absolute",
          right: 20,
          bottom: 13,
          padding: "6px 9px",
          border: `4px solid ${palette.signal}`,
          color: palette.signal,
          fontFamily: fonts.mono,
          fontSize: 19,
          fontWeight: 950,
          lineHeight: 0.9,
          letterSpacing: -0.8,
          opacity: stampInk,
          transform: "rotate(-6deg)",
        }}
      >
        PASSED
      </div>
      {[0, 1].map((side) => (
        <div
          key={side}
          style={{
            position: "absolute",
            left: side === 0 ? -13 : undefined,
            right: side === 1 ? -13 : undefined,
            top: 88,
            width: 26,
            height: 66,
            backgroundColor: palette.paper,
            border: `3px solid ${palette.ink}`,
          }}
        />
      ))}
    </div>
  );
};

const Trapdoor: React.FC<{frame: number}> = ({frame}) => {
  const open =
    progress(frame, 138, 148, easeOut) *
    (1 - progress(frame, 178, 195, easeMove));
  const nope = progress(frame, 143, 154, easeOut) * (1 - progress(frame, 179, 190, easeMove));

  return (
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 400,
        width: 374,
        height: 262,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `9px solid ${palette.paper}88`,
          backgroundColor: palette.canvas,
          boxShadow: `inset 0 0 52px #000000, 0 15px 32px ${palette.canvas}aa`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: palette.tension,
            fontFamily: fonts.mono,
            fontSize: 67,
            fontWeight: 950,
            letterSpacing: -5,
            opacity: nope,
            transform: `rotate(${-2 + nope * 2}deg)`,
          }}
        >
          NOPE
        </div>
      </div>
      {[0, 1].map((side) => {
        const direction = side === 0 ? -1 : 1;
        return (
          <div
            key={side}
            style={{
              position: "absolute",
              left: side === 0 ? 0 : "50%",
              top: 0,
              width: "50%",
              height: "100%",
              border: `5px solid ${palette.paper}88`,
              backgroundColor: palette.surfaceRaised,
              boxShadow: `inset 0 0 0 2px ${palette.canvas}88, ${direction * 6}px 9px 16px ${palette.canvas}77`,
              transform: `translateX(${direction * open * 176}px) rotate(${direction * open * 5}deg)`,
              transformOrigin: side === 0 ? "left center" : "right center",
            }}
          >
            {Array.from({length: 5}, (_, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: 22,
                  right: 22,
                  top: 26 + index * 48,
                  height: 3,
                  backgroundColor: `${palette.muted}24`,
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

const CelebrationArm: React.FC<{frame: number}> = ({frame}) => {
  const approach = progress(frame, 82, 94, easeOut);
  const retreat = progress(frame, 98, 110, easeMove);
  const armProgress = approach * (1 - retreat);
  const rotation = 55 - armProgress * 50;
  const stamp = progress(frame, 92, 95, easeIn) * (1 - progress(frame, 97, 101, easeOut));

  return (
    <div
      style={{
        position: "absolute",
        left: 572,
        top: 484,
        width: 220,
        height: 220,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 168,
          top: 88,
          width: 72,
          height: 72,
          borderRadius: "50%",
          border: `8px solid ${palette.paper}`,
          backgroundColor: palette.surface,
          boxShadow: `0 10px 18px ${palette.canvas}aa`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 114,
          width: 186,
          height: 35,
          border: `6px solid ${palette.paper}`,
          backgroundColor: palette.surfaceRaised,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "168px center",
          boxShadow: `0 8px 10px ${palette.canvas}88`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -24,
            top: -18 + stamp * 28,
            width: 60,
            height: 70,
            border: `6px solid ${palette.paper}`,
            backgroundColor: palette.signal,
            color: palette.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.mono,
            fontSize: 13,
            fontWeight: 950,
            opacity: approach,
            transform: "rotate(90deg)",
          }}
        >
          PASS
        </div>
      </div>
    </div>
  );
};

const confetti = [
  [-142, -82, -18],
  [-98, -130, 24],
  [-48, -154, 55],
  [12, -166, -32],
  [72, -142, 18],
  [128, -96, 66],
  [-164, -20, 42],
  [158, -12, -48],
  [-118, 52, 70],
  [112, 64, -20],
] as const;

const Celebration: React.FC<{frame: number}> = ({frame}) => {
  const burst = progress(frame, 94, 114, easeOut);
  const visibility = progress(frame, 92, 96) * (1 - progress(frame, 116, 126, easeMove));
  return (
    <>
      {[414, 540, 666].map((x, index) => {
        const flash = Math.sin((frame - 94) * 1.25 + index * 1.7) > -0.15 ? 1 : 0.28;
        return (
          <div
            key={x}
            style={{
              position: "absolute",
              left: x - 16,
              top: 622,
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `5px solid ${palette.paper}`,
              backgroundColor: palette.signal,
              opacity: visibility * flash,
              boxShadow: `0 0 26px ${palette.signal}`,
            }}
          />
        );
      })}
      {confetti.map(([dx, dy, rotation], index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: 540 + dx * burst,
            top: 580 + dy * burst + burst * burst * 78,
            width: index % 2 === 0 ? 12 : 22,
            height: index % 2 === 0 ? 28 : 10,
            backgroundColor: index % 3 === 0 ? palette.signal : palette.paper,
            opacity: visibility,
            transform: `rotate(${rotation + burst * (index % 2 === 0 ? 150 : -130)}deg)`,
            boxShadow: `0 4px 5px ${palette.canvas}66`,
          }}
        />
      ))}
    </>
  );
};

const HumanLever: React.FC<{frame: number}> = ({frame}) => {
  const pull = progress(frame, 132, 138, easeIn);
  return (
    <div
      style={{
        position: "absolute",
        left: 776,
        top: 388,
        width: 112,
        height: 174,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 6,
          top: 58,
          width: 100,
          height: 108,
          border: `6px solid ${palette.paper}`,
          backgroundColor: palette.surface,
          boxShadow: `8px 10px 0 ${palette.canvas}88`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 9,
            right: 9,
            bottom: 11,
            color: palette.tension,
            fontFamily: fonts.mono,
            fontSize: 14,
            fontWeight: 950,
            textAlign: "center",
            letterSpacing: 0.2,
          }}
        >
          HUMAN
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 49,
          top: 0,
          width: 18,
          height: 112,
          border: `4px solid ${palette.paper}`,
          backgroundColor: palette.tension,
          transform: `rotate(${-24 + pull * 62}deg)`,
          transformOrigin: "center 91%",
          boxShadow: `0 7px 10px ${palette.canvas}99`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -12,
            top: -22,
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: `4px solid ${palette.paper}`,
            backgroundColor: palette.tension,
          }}
        />
      </div>
    </div>
  );
};

const HumanHand: React.FC<{frame: number}> = ({frame}) => {
  const entry = progress(frame, 108, 128, easeOut);
  const press = progress(frame, 132, 138, easeIn);
  const exit = progress(frame, 147, 162, easeIn);
  const top = 2200 - entry * 1990 + press * 48 + exit * 2050;
  const rotation = -8 + entry * 7 - press * 2 + exit * 7;

  return (
    <Img
      src={staticFile(HAND)}
      style={{
        position: "absolute",
        left: 485,
        top,
        width: 520,
        height: 924,
        objectFit: "contain",
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "62% 15%",
        filter: `drop-shadow(18px 24px 20px ${palette.canvas}aa)`,
      }}
    />
  );
};

const FactoryStage: React.FC<{
  includeAudio: boolean;
  useBackgroundAsset: boolean;
}> = ({includeAudio, useBackgroundAsset}) => {
  const frame = useCurrentFrame();
  const mainTop = interpolate(
    frame,
    [0, 21, 42, 63, 84, 110, 132, 138],
    [1790, 1370, 1090, 810, 600, 520, 400, 400],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  const drop = progress(frame, 138, 158, easeIn);
  const mainOpacity = 1 - progress(frame, 157, 166, easeIn);
  const nextEntry = progress(frame, 196, 239, Easing.linear);
  const nextTop = 2050 - nextEntry * 260;

  return (
    <AbsoluteFill style={{backgroundColor: palette.canvas, overflow: "hidden"}}>
      {includeAudio ? <Audio src={staticFile(AUDIO)} volume={1} /> : null}
      {useBackgroundAsset ? (
        <Img
          src={staticFile(BACKGROUND)}
          style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover"}}
        />
      ) : (
        <CssWorkshopFallback />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(ellipse at 50% 45%, transparent 38%, ${palette.canvas}88 100%)`,
          pointerEvents: "none",
        }}
      />
      <Conveyor frame={frame} />
      <Trapdoor frame={frame} />
      <QaSensor frame={frame} y={1370} arrival={21} label="1080p" />
      <QaSensor frame={frame} y={1090} arrival={42} label="0 ERR" />
      <QaSensor frame={frame} y={810} arrival={63} label="-16.2" />
      <CelebrationArm frame={frame} />
      <Celebration frame={frame} />
      <ProductCassette
        frame={frame}
        top={mainTop}
        opacity={mainOpacity}
        drop={drop}
        stamped={frame >= 95}
      />
      <ProductCassette frame={frame} top={nextTop} opacity={nextEntry} />
      <HumanLever frame={frame} />
      <HumanHand frame={frame} />
    </AbsoluteFill>
  );
};

export type QaFactoryPrototypeProps = {
  includeAudio?: boolean;
  useBackgroundAsset?: boolean;
  staticFallback?: boolean;
};

export const QaFactoryPrototype: React.FC<QaFactoryPrototypeProps> = ({
  includeAudio = true,
  useBackgroundAsset = true,
  staticFallback = false,
}) => {
  if (staticFallback) {
    return (
      <Freeze frame={STATIC_FALLBACK_FRAME}>
        <FactoryStage includeAudio={false} useBackgroundAsset={useBackgroundAsset} />
      </Freeze>
    );
  }

  return <FactoryStage includeAudio={includeAudio} useBackgroundAsset={useBackgroundAsset} />;
};

export const QaFactoryPrototypeFallback: React.FC = () => (
  <QaFactoryPrototype includeAudio={false} useBackgroundAsset={false} staticFallback />
);
