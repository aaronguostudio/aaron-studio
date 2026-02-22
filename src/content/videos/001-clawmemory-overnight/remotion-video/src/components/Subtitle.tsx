import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

interface SubtitleProps {
  text: string;
  startFrame: number;
}

export const Subtitle: React.FC<SubtitleProps> = ({ text, startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const opacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "30px 60px",
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity,
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 52,
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.3,
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
