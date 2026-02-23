import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from "remotion";

interface ChapterIndicatorProps {
  title: string;
  showDurationFrames?: number;
}

export const ChapterIndicator: React.FC<ChapterIndicatorProps> = ({
  title,
  showDurationFrames = 72,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide in
  const slideIn = spring({
    fps,
    frame,
    config: { damping: 30, stiffness: 120, mass: 0.8 },
  });

  // Slide out
  const slideOut = spring({
    fps,
    frame: frame - showDurationFrames,
    config: { damping: 30, stiffness: 120, mass: 0.8 },
  });

  const translateX = interpolate(slideIn - slideOut, [0, 1], [-200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(slideIn - slideOut, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (opacity <= 0) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-start",
        padding: "0 0 80px 40px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateX(${translateX}px)`,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
          padding: "10px 24px",
          borderRadius: 8,
          borderLeft: "3px solid rgba(255, 255, 255, 0.8)",
        }}
      >
        <span
          style={{
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: 22,
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontWeight: 500,
            letterSpacing: 0.5,
          }}
        >
          {title}
        </span>
      </div>
    </AbsoluteFill>
  );
};
