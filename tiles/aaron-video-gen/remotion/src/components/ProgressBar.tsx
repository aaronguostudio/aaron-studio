import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from "remotion";

interface SectionInfo {
  title: string;
  startFrame: number;
}

interface ProgressBarProps {
  sections: SectionInfo[];
}

/**
 * Section-based progress indicator at the top of the video.
 * Shows all chapter segments as pill-shaped blocks. The current
 * section fills up as it progresses, completed sections are solid,
 * and upcoming sections are dim. Includes a label for the active section.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({ sections }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  if (sections.length <= 1) return null;

  // Fade in after intro hook
  const opacity = interpolate(frame, [0, fps * 2, fps * 2.5], [0, 0, 0.9], {
    extrapolateRight: "clamp",
  });

  // Find which section is currently active
  let activeSectionIndex = 0;
  for (let i = sections.length - 1; i >= 0; i--) {
    if (frame >= sections[i].startFrame) {
      activeSectionIndex = i;
      break;
    }
  }

  // Calculate section end frames
  const sectionEndFrames = sections.map((_, i) =>
    i < sections.length - 1 ? sections[i + 1].startFrame : durationInFrames
  );

  // Active section label animation
  const labelSpring = spring({
    fps,
    frame: frame - sections[activeSectionIndex].startFrame,
    config: { damping: 20, stiffness: 120, mass: 0.6 },
  });

  const labelOpacity = interpolate(labelSpring, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "14px 40px 0",
          width: "100%",
        }}
      >
        {/* Section segments row */}
        <div
          style={{
            display: "flex",
            gap: 4,
            width: "100%",
            maxWidth: "92%",
          }}
        >
          {sections.map((section, i) => {
            const isCompleted = i < activeSectionIndex;
            const isActive = i === activeSectionIndex;

            // Fill progress for the active section
            let fillPercent = 0;
            if (isCompleted) {
              fillPercent = 100;
            } else if (isActive) {
              const sectionStart = sections[i].startFrame;
              const sectionEnd = sectionEndFrames[i];
              fillPercent = interpolate(
                frame,
                [sectionStart, sectionEnd],
                [0, 100],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
            }

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: `${fillPercent}%`,
                    backgroundColor: isActive
                      ? "#FFFFFF"
                      : "rgba(255, 255, 255, 0.6)",
                    borderRadius: 2,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Active section label */}
        <div
          style={{
            opacity: labelOpacity,
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              color: "rgba(255, 255, 255, 0.45)",
              fontSize: 13,
              fontFamily:
                'Inter, -apple-system, "Segoe UI", sans-serif',
              fontWeight: 500,
              letterSpacing: 0.5,
            }}
          >
            {activeSectionIndex + 1}/{sections.length}
          </span>
          <span
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 13,
              fontFamily:
                'Inter, -apple-system, "Segoe UI", sans-serif',
              fontWeight: 500,
            }}
          >
            {sections[activeSectionIndex].title}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
