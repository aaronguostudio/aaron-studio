import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
  Img,
  AbsoluteFill,
} from "remotion";
import type { ImageChangeTiming } from "../types";

interface SlideSceneProps {
  imageFile: string;
  children?: React.ReactNode;
  /** All images in order for progressive builds */
  imageFiles?: string[];
  /** When to crossfade to each sub-image (seconds into audio) */
  imageChangeTimings?: ImageChangeTiming[];
  /** Frame offset for when audio starts within the sequence */
  audioDelay?: number;
}

// Static slides — no Ken Burns micro-movements.
// Between-slide transitions (fade, wipe, flip, etc.) handled by SlideshowVideo.

const CROSSFADE_SEC = 0.5;

export const SlideScene: React.FC<SlideSceneProps> = ({
  imageFile,
  children,
  imageFiles,
  imageChangeTimings,
  audioDelay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const hasMultipleImages =
    imageFiles &&
    imageFiles.length > 1 &&
    imageChangeTimings &&
    imageChangeTimings.length > 1;

  // Current time relative to audio start (for image change sync)
  const currentTimeSec = Math.max(0, (frame - audioDelay) / fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {hasMultipleImages ? (
          // Multi-image progressive reveal: stack images with crossfade
          <>
            {imageFiles!.map((imgFile, imgIdx) => {
              const timing = imageChangeTimings![imgIdx];

              // First image is always fully visible (base layer)
              if (imgIdx === 0) {
                return (
                  <AbsoluteFill key={imgIdx}>
                    <Img src={staticFile(imgFile)} style={imgStyle} />
                  </AbsoluteFill>
                );
              }

              // Subsequent images fade in when their time arrives
              const fadeStart = timing?.startAtSec ?? 0;
              const opacity = interpolate(
                currentTimeSec,
                [fadeStart, fadeStart + CROSSFADE_SEC],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );

              return (
                <AbsoluteFill key={imgIdx} style={{ opacity }}>
                  <Img src={staticFile(imgFile)} style={imgStyle} />
                </AbsoluteFill>
              );
            })}
          </>
        ) : (
          // Single image
          <Img src={staticFile(imageFile)} style={imgStyle} />
        )}
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
};
