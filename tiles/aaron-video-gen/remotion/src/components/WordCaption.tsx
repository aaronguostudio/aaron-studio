import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
} from "remotion";

export interface WordTimingData {
  word: string;
  start: number; // seconds
  end: number;   // seconds
}

interface WordCaptionProps {
  wordTimings: WordTimingData[];
  /** Frame offset for when audio starts within the sequence */
  audioDelay?: number;
  maxWordsPerLine?: number;
}

/**
 * Subtle word-by-word caption overlay.
 * Shows a group of words near the bottom, highlighting the current word
 * with a color change. No scale animation to avoid overlap.
 */
export const WordCaption: React.FC<WordCaptionProps> = ({
  wordTimings,
  audioDelay = 0,
  maxWordsPerLine = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!wordTimings || wordTimings.length === 0) return null;

  // Current time relative to audio start
  const currentTime = Math.max(0, (frame - audioDelay) / fps);

  // Group words into lines of maxWordsPerLine
  const lines: WordTimingData[][] = [];
  for (let i = 0; i < wordTimings.length; i += maxWordsPerLine) {
    lines.push(wordTimings.slice(i, i + maxWordsPerLine));
  }

  // Find which line group is currently active
  const activeLineIndex = lines.findIndex((line) => {
    const lineStart = line[0].start;
    const lineEnd = line[line.length - 1].end;
    return currentTime >= lineStart - 0.1 && currentTime <= lineEnd + 0.3;
  });

  if (activeLineIndex < 0) return null;

  const activeLine = lines[activeLineIndex];
  const lineStart = activeLine[0].start;
  const lineEnd = activeLine[activeLine.length - 1].end;

  // Fade in/out the line group
  const lineOpacity = interpolate(
    currentTime,
    [lineStart - 0.1, lineStart, lineEnd, lineEnd + 0.3],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 40px 60px 40px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity: lineOpacity,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "3px 8px",
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          backdropFilter: "blur(10px)",
          padding: "10px 24px",
          borderRadius: 8,
          maxWidth: "80%",
        }}
      >
        {activeLine.map((wordData, wi) => {
          const isActive =
            currentTime >= wordData.start && currentTime <= wordData.end + 0.15;
          const isPast = currentTime > wordData.end + 0.15;

          let color = "rgba(255, 255, 255, 0.35)"; // upcoming: dim
          let fontWeight = 500;
          if (isActive) {
            color = "#FFDD00"; // active: yellow
            fontWeight = 700;
          } else if (isPast) {
            color = "rgba(255, 255, 255, 0.85)"; // past: bright white
            fontWeight = 500;
          }

          return (
            <span
              key={wi}
              style={{
                color,
                fontSize: 28,
                fontFamily:
                  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontWeight,
                display: "inline-block",
                lineHeight: 1.4,
              }}
            >
              {wordData.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
