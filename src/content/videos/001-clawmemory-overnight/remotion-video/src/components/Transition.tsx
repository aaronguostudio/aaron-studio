import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

interface TransitionProps {
  startFrame: number;
  durationFrames?: number;
  children: React.ReactNode;
}

export const FadeIn: React.FC<TransitionProps> = ({
  startFrame,
  durationFrames = 15,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
