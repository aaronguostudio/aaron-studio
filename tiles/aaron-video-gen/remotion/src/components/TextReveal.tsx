import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface TextRevealProps {
  text: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  delay?: number;
  style?: React.CSSProperties;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  fontSize = 48,
  color = "white",
  fontWeight = 700,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const springValue = spring({
    fps,
    frame: frame - delay,
    config: { damping: 30, stiffness: 120, mass: 0.8 },
  });

  const opacity = interpolate(springValue, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(springValue, [0, 1], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontSize,
        color,
        fontWeight,
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        lineHeight: 1.3,
        textShadow: "0 2px 12px rgba(0,0,0,0.6)",
        ...style,
      }}
    >
      {text}
    </div>
  );
};
