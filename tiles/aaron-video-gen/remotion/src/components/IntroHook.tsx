import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
  AbsoluteFill,
} from "remotion";
import type { SlideData } from "../types";

interface IntroHookProps {
  slides: SlideData[];
  videoTitle: string;
  logoFile?: string;
  slogan?: string;
  website?: string;
}

/**
 * Clean intro card: logo + slogan fades in, then video title appears below.
 * No montage — straight to branding.
 */
export const IntroHook: React.FC<IntroHookProps> = ({
  videoTitle,
  logoFile,
  slogan,
  website,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Phase 1: Logo + slogan fade in (0 → 1s)
  const logoOpacity = interpolate(
    frame,
    [0, fps * 0.5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phase 2: Title fades in (0.6s → 1.2s)
  const titleOpacity = interpolate(
    frame,
    [fps * 0.6, fps * 1.2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const titleY = interpolate(
    frame,
    [fps * 0.6, fps * 1.2],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Fade out everything at the end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.4, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
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
              opacity: logoOpacity,
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: 16,
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
              opacity: logoOpacity,
              color: "rgba(255, 255, 255, 0.35)",
              fontSize: 14,
              fontFamily:
                'Inter, -apple-system, "Segoe UI", sans-serif',
              fontWeight: 400,
              letterSpacing: 1,
            }}
          >
            {website}
          </div>
        )}

        {/* Video title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
            padding: "0 120px",
            marginTop: 16,
          }}
        >
          <div
            style={{
              color: "#FFFFFF",
              fontSize: 48,
              fontFamily:
                'Inter, -apple-system, "Segoe UI", sans-serif',
              fontWeight: 800,
              lineHeight: 1.2,
              maxWidth: "70%",
              margin: "0 auto",
            }}
          >
            {videoTitle}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Calculate the total duration in frames for the intro hook.
 */
export function getIntroHookDuration(slideCount: number, fps: number): number {
  if (slideCount === 0) return 0;
  // 3.5 seconds: logo+slogan fade in, title appears, hold, fade out
  return Math.round(fps * 3.5);
}
