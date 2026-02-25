import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
  Img,
  AbsoluteFill,
} from "remotion";

interface CoverCardProps {
  imageFile: string;
}

const COVER_DURATION_SEC = 2.5;

export const CoverCard: React.FC<CoverCardProps> = ({ imageFile }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(
    frame,
    [0, fps * 0.3],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.5, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <AbsoluteFill style={{ opacity }}>
        <Img
          src={staticFile(imageFile)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export function getCoverCardDuration(
  coverImageFile: string | undefined,
  fps: number
): number {
  if (!coverImageFile) return 0;
  return Math.round(COVER_DURATION_SEC * fps);
}
