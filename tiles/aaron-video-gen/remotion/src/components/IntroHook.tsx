import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
  AbsoluteFill,
  Sequence,
} from "remotion";
import type { SlideData } from "../types";

interface IntroHookProps {
  slides: SlideData[];
  videoTitle: string;
}

/** Duration of each flash clip in frames */
const CLIP_FRAMES = 15; // ~0.6s at 24fps
/** Overlap between clips for crossfade */
const OVERLAP_FRAMES = 4;

/**
 * Quick-fire montage of slide images as a hook before the main content.
 * Shows 4-5 rapid clips with zoom-in + slight rotation, ending with a
 * title flash.
 */
export const IntroHook: React.FC<IntroHookProps> = ({
  slides,
  videoTitle,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Pick evenly-spaced slides for the montage (skip first = cover)
  const hookSlides = slides
    .filter((_, i) => i > 0)
    .filter((_, i, arr) => {
      const step = Math.max(1, Math.floor(arr.length / 4));
      return i % step === 0;
    })
    .slice(0, 4);

  const effectiveClip = CLIP_FRAMES - OVERLAP_FRAMES;
  const montageEnd = hookSlides.length * effectiveClip + OVERLAP_FRAMES;
  const titleStart = montageEnd;
  const titleDuration = durationInFrames - titleStart;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Rapid image montage */}
      {hookSlides.map((slide, i) => {
        const clipStart = i * effectiveClip;
        const clipEnd = clipStart + CLIP_FRAMES;
        const localFrame = frame - clipStart;

        if (localFrame < 0 || localFrame >= CLIP_FRAMES) return null;

        const zoomProgress = interpolate(
          localFrame,
          [0, CLIP_FRAMES],
          [1.15, 1.35],
          { extrapolateRight: "clamp" }
        );

        const opacity = interpolate(
          localFrame,
          [0, 3, CLIP_FRAMES - 4, CLIP_FRAMES],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const rotation = interpolate(
          localFrame,
          [0, CLIP_FRAMES],
          [-0.5, 0.5],
          { extrapolateRight: "clamp" }
        );

        return (
          <AbsoluteFill key={i} style={{ opacity }}>
            <Img
              src={staticFile(slide.imageFile)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${zoomProgress}) rotate(${rotation}deg)`,
              }}
            />
            {/* Dark vignette */}
            <AbsoluteFill
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
              }}
            />
          </AbsoluteFill>
        );
      })}

      {/* Title flash at the end */}
      {frame >= titleStart && (
        <AbsoluteFill
          style={{
            backgroundColor: "#0a0a0a",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {(() => {
            const titleFrame = frame - titleStart;
            const titleScale = spring({
              fps,
              frame: titleFrame,
              config: { damping: 12, stiffness: 180, mass: 0.5 },
            });

            const titleOpacity = interpolate(
              titleFrame,
              [0, 8, titleDuration - 6, titleDuration],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                style={{
                  opacity: titleOpacity,
                  transform: `scale(${interpolate(titleScale, [0, 1], [0.7, 1])})`,
                  textAlign: "center",
                  padding: "0 120px",
                }}
              >
                <div
                  style={{
                    color: "#FFDD00",
                    fontSize: 18,
                    fontFamily:
                      'Montserrat, Inter, -apple-system, "Segoe UI", sans-serif',
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 4,
                    marginBottom: 16,
                  }}
                >
                  COMING UP
                </div>
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
            );
          })()}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/**
 * Calculate the total duration in frames for the intro hook.
 */
export function getIntroHookDuration(slideCount: number, fps: number): number {
  const hookSlideCount = Math.min(4, Math.max(0, slideCount - 1));
  if (hookSlideCount === 0) return 0;
  const effectiveClip = CLIP_FRAMES - OVERLAP_FRAMES;
  const montageFrames = hookSlideCount * effectiveClip + OVERLAP_FRAMES;
  const titleFrames = Math.round(fps * 1.5); // 1.5s title card
  return montageFrames + titleFrames;
}
