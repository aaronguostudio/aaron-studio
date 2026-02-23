import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
  Img,
  AbsoluteFill,
} from "remotion";

interface OutroProps {
  logoFile?: string;
  slogan?: string;
  website?: string;
}

/** Duration of the outro in seconds */
export const OUTRO_DURATION_SEC = 4;

/**
 * Outro card: fade to black, then logo + slogan appear.
 */
export const Outro: React.FC<OutroProps> = ({ logoFile, slogan, website }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Fade from black (0 → 0.8s)
  const bgOpacity = interpolate(
    frame,
    [0, fps * 0.8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phase 2: Logo fades in (0.6s → 1.2s)
  const logoOpacity = interpolate(
    frame,
    [fps * 0.6, fps * 1.2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phase 3: Slogan fades in (1.0s → 1.6s)
  const sloganOpacity = interpolate(
    frame,
    [fps * 1.0, fps * 1.6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        opacity: bgOpacity,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* Logo */}
        {logoFile && (
          <div style={{ opacity: logoOpacity }}>
            <Img
              src={staticFile(logoFile)}
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
              }}
            />
          </div>
        )}

        {/* Slogan */}
        {slogan && (
          <div
            style={{
              opacity: sloganOpacity,
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: 18,
              fontFamily:
                'Inter, -apple-system, "Segoe UI", sans-serif',
              fontWeight: 400,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {slogan}
          </div>
        )}

        {/* Website */}
        {website && (
          <div
            style={{
              opacity: sloganOpacity,
              color: "rgba(255, 255, 255, 0.35)",
              fontSize: 15,
              fontFamily:
                'Inter, -apple-system, "Segoe UI", sans-serif',
              fontWeight: 400,
              letterSpacing: 1,
              marginTop: 4,
            }}
          >
            {website}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
