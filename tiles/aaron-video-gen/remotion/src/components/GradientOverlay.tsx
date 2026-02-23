import React from "react";
import { AbsoluteFill } from "remotion";

interface GradientOverlayProps {
  opacity?: number;
  height?: string;
}

export const GradientOverlay: React.FC<GradientOverlayProps> = ({
  opacity = 0.7,
  height = "45%",
}) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
      }}
    >
      <div
        style={{
          height,
          background: `linear-gradient(to top, rgba(0,0,0,${opacity}), transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
