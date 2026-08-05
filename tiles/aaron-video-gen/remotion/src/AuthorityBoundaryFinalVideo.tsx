import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  AuthorityBoundaryConceptPrototype,
  AUTHORITY_BOUNDARY_CONCEPT_FPS,
  authorityBoundaryConceptDurationFrames,
} from "./AuthorityBoundaryConceptPrototype";
import {
  AUTHORITY_BOUNDARY_FINAL_RUNTIME,
  AUTHORITY_LEDGER_FINAL_RUNTIME_ASSET,
} from "./editorial/SemanticSpriteRuntimeRegistry";

export const AUTHORITY_BOUNDARY_FINAL_FPS =
  AUTHORITY_BOUNDARY_FINAL_RUNTIME.fps;
export const AUTHORITY_BOUNDARY_END_CARD_DURATION_SEC = 5;

const mainDurationFrames = authorityBoundaryConceptDurationFrames(
  AUTHORITY_BOUNDARY_CONCEPT_FPS,
);
const endCardDurationFrames = Math.round(
  AUTHORITY_BOUNDARY_END_CARD_DURATION_SEC * AUTHORITY_BOUNDARY_FINAL_FPS,
);
const finalWashDurationFrames = 18;

export const AUTHORITY_BOUNDARY_FINAL_DURATION_SEC =
  (mainDurationFrames + endCardDurationFrames) / AUTHORITY_BOUNDARY_FINAL_FPS;

export const authorityBoundaryFinalDurationFrames = (): number =>
  mainDurationFrames + endCardDurationFrames;

const paper = "#f4f3ef";
const ink = "#0a2346";
const text = "#182334";
const muted = "#6e7783";
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

const progress = (
  frame: number,
  start: number,
  end: number,
  easing = easeOut,
): number =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

const FinalWash: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = progress(
    frame,
    mainDurationFrames - finalWashDurationFrames,
    mainDurationFrames - 1,
    easeInOut,
  );

  return <AbsoluteFill style={{ backgroundColor: paper, opacity }} />;
};

const BrandEndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const entry = progress(frame, 0, 24);
  const rule = progress(frame, 10, 34, easeInOut);
  const site = progress(frame, 24, 42);
  const exit = progress(frame, endCardDurationFrames - 15, endCardDurationFrames - 1, easeInOut);
  const visibility = entry * (1 - exit);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: paper,
        color: text,
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: visibility,
          transform: `translateY(${(1 - entry) * 14}px)`,
        }}
      >
        <Img
          src={staticFile("authority-boundary/ag-logo.png")}
          style={{ width: 112, height: 112, objectFit: "cover", borderRadius: 10 }}
        />
        <div
          style={{
            marginTop: 28,
            color: ink,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 58,
            fontWeight: 700,
            letterSpacing: -1.4,
            lineHeight: 1,
          }}
        >
          Aaron Guo
        </div>
        <div
          style={{
            marginTop: 18,
            color: muted,
            fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: 16,
            fontWeight: 650,
            letterSpacing: 2.1,
          }}
        >
          AI-NATIVE BUILDER · HUMAN-FIRST THINKER
        </div>
        <div
          style={{
            marginTop: 34,
            width: 360,
            height: 3,
            backgroundColor: ink,
            transform: `scaleX(${rule})`,
            transformOrigin: "center center",
          }}
        />
        <div
          style={{
            marginTop: 24,
            color: muted,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 0.4,
            opacity: site,
          }}
        >
          aaronguo.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AuthorityBoundaryFinalVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: paper }}>
    <Sequence durationInFrames={mainDurationFrames}>
      <AuthorityBoundaryConceptPrototype
        spriteRuntimeAsset={AUTHORITY_LEDGER_FINAL_RUNTIME_ASSET}
      />
      <FinalWash />
    </Sequence>
    <Sequence from={mainDurationFrames} durationInFrames={endCardDurationFrames}>
      <BrandEndCard />
    </Sequence>
  </AbsoluteFill>
);
