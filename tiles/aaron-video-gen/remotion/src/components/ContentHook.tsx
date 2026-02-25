import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
  Img,
} from "remotion";
import { WordCaption } from "./WordCaption";
import { GradientOverlay } from "./GradientOverlay";
import type { WordTiming } from "../types";

interface ContentHookProps {
  imageFile: string;
  audioFile: string;
  audioDuration: number;
  wordTimings?: WordTiming[];
}

const PADDING_SEC = 1;

/**
 * Content hook: attention-grabbing teaser before the branding intro.
 * Shows a key image with narration and word captions.
 */
export const ContentHook: React.FC<ContentHookProps> = ({
  imageFile,
  audioFile,
  audioDuration,
  wordTimings,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade in from black (0.3s)
  const fadeIn = interpolate(
    frame,
    [0, fps * 0.3],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Fade out to black (0.5s before end)
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.5, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <AbsoluteFill style={{ opacity }}>
        {/* Background image */}
        <AbsoluteFill>
          <Img
            src={staticFile(imageFile)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>

        {/* Gradient overlay for text readability */}
        <GradientOverlay opacity={0.6} height="50%" />

        {/* Narration audio */}
        <Audio src={staticFile(audioFile)} />

        {/* Word-by-word captions */}
        {wordTimings && wordTimings.length > 0 && (
          <WordCaption wordTimings={wordTimings} audioDelay={0} />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Calculate the total duration in frames for the content hook.
 */
export function getContentHookDuration(
  hookAudioDuration: number | undefined,
  fps: number
): number {
  if (!hookAudioDuration) return 0;
  return Math.ceil((hookAudioDuration + PADDING_SEC) * fps);
}
