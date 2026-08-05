import React, { type CSSProperties } from "react";
import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { editorialMotion, semanticSettle } from "./EditorialMotionSystem";

type SemanticSpriteStyle = Omit<CSSProperties, "opacity" | "transform">;

export type SemanticSpriteProps = {
  src: string;
  startFrame: number;
  endFrame: number;
  enterFrames?: number;
  exitFrames?: number;
  translateY?: number;
  exitTranslateY?: number;
  maxOpacity?: number;
  style?: SemanticSpriteStyle;
};

export const clampSemanticSpriteFrameTimings = (
  enterFrames: number,
  exitFrames: number,
): { enterFrames: number; exitFrames: number } => {
  const roundedEnterFrames = Number.isFinite(enterFrames)
    ? Math.round(enterFrames)
    : 2;
  const safeEnterFrames = Math.max(2, roundedEnterFrames);
  const roundedExitFrames = Number.isFinite(exitFrames)
    ? Math.round(exitFrames)
    : 1;
  const safeExitFrames = Math.max(
    1,
    Math.min(roundedExitFrames, safeEnterFrames - 1),
  );

  return { enterFrames: safeEnterFrames, exitFrames: safeExitFrames };
};

/**
 * A single-use, narration-synced transparent visual mnemonic.
 * It deliberately supports only opacity and a small vertical settle: no
 * rotation, bounce, autonomous loop, or scale-from-zero behavior.
 */
export const SemanticSprite: React.FC<SemanticSpriteProps> = ({
  src,
  startFrame,
  endFrame,
  enterFrames,
  exitFrames,
  translateY = editorialMotion.semanticSettle.defaultTranslatePx,
  exitTranslateY = 6,
  maxOpacity = 0.95,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < startFrame || frame >= endFrame) return null;

  const defaultEnterFrames = Math.round(
    editorialMotion.semanticSettle.defaultDurationSec * fps,
  );
  const defaultExitFrames = Math.round(
    editorialMotion.semanticSettle.defaultExitDurationSec * fps,
  );
  const timings = clampSemanticSpriteFrameTimings(
    enterFrames ?? defaultEnterFrames,
    exitFrames ?? defaultExitFrames,
  );
  const enterProgress = interpolate(
    frame,
    [startFrame, startFrame + timings.enterFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const settled = semanticSettle(enterProgress, translateY);
  const exitProgress = interpolate(
    frame,
    [endFrame - timings.exitFrames, endFrame],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: editorialMotion.easing.exit,
    },
  );

  return (
    <Img
      src={src}
      style={{
        ...style,
        opacity: settled.opacity * (1 - exitProgress) * maxOpacity,
        transform: `translateY(${settled.translateY - exitProgress * exitTranslateY}px)`,
      }}
    />
  );
};
