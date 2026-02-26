import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
} from "remotion";

export interface KnowledgeWordTiming {
  word: string;
  start: number; // seconds
  end: number;   // seconds
}

export interface KnowledgeShortProps {
  /** Title displayed at top (e.g. "AI 有多费电？⚡") */
  title: string;
  /** Background video file (relative to public/) */
  videoFile: string;
  /** Narration audio file (relative to public/) */
  audioFile: string;
  /** Word-level timings from ElevenLabs */
  wordTimings: KnowledgeWordTiming[];
  /** FPS */
  fps: number;
  /** Total duration in seconds */
  durationSec: number;
  /** Optional second video to extend (if using two 10s clips for 15s+) */
  videoFile2?: string;
  /** When to switch to second video (seconds) */
  videoSwitchAt?: number;
}

/**
 * KnowledgeShort — 9:16 vertical knowledge short with:
 * - Full-screen background video (Kling AI)
 * - Fixed title banner at top
 * - Word-by-word captions at bottom synced to audio
 * - ElevenLabs narration audio
 */
export const KnowledgeShort: React.FC<KnowledgeShortProps> = ({
  title,
  videoFile,
  audioFile,
  wordTimings,
  fps: _fps,
  durationSec: _durationSec,
  videoFile2,
  videoSwitchAt = 10,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentTime = frame / fps;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Background video */}
      <BackgroundVideo
        videoFile={videoFile}
        videoFile2={videoFile2}
        videoSwitchAt={videoSwitchAt}
        currentTime={currentTime}
        fps={fps}
        width={width}
        height={height}
      />

      {/* Dim overlay for text readability */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.1) 65%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Title banner — top, always visible */}
      <TitleBanner title={title} currentTime={currentTime} />

      {/* Word-by-word captions — bottom */}
      <ShortCaption wordTimings={wordTimings} currentTime={currentTime} />

      {/* Audio */}
      <Audio src={staticFile(audioFile)} />
    </AbsoluteFill>
  );
};

// ─── Background Video ────────────────────────────────────────────

const BackgroundVideo: React.FC<{
  videoFile: string;
  videoFile2?: string;
  videoSwitchAt: number;
  currentTime: number;
  fps: number;
  width: number;
  height: number;
}> = ({ videoFile, videoFile2, videoSwitchAt, currentTime, fps, width, height }) => {
  // If we have a second clip, crossfade at videoSwitchAt
  if (videoFile2) {
    const showSecond = currentTime >= videoSwitchAt;
    return (
      <AbsoluteFill>
        <AbsoluteFill
          style={{
            opacity: showSecond
              ? interpolate(currentTime, [videoSwitchAt, videoSwitchAt + 0.5], [1, 0], {
                  extrapolateLeft: "clamp", extrapolateRight: "clamp",
                })
              : 1,
          }}
        >
          <OffthreadVideo src={staticFile(videoFile)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            opacity: showSecond
              ? interpolate(currentTime, [videoSwitchAt, videoSwitchAt + 0.5], [0, 1], {
                  extrapolateLeft: "clamp", extrapolateRight: "clamp",
                })
              : 0,
          }}
        >
          <OffthreadVideo src={staticFile(videoFile2)} startFrom={0} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // Single video: OffthreadVideo for precise frame-level rendering
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile(videoFile)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

// ─── Title Banner ────────────────────────────────────────────────

const TitleBanner: React.FC<{ title: string; currentTime: number }> = ({
  title,
  currentTime,
}) => {
  // Fade in during first 0.5s
  const opacity = interpolate(currentTime, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Subtle slide down
  const translateY = interpolate(currentTime, [0, 0.5], [-20, 0], {
    extrapolateRight: "clamp",
  });

  // Dynamic font size: shrink for long titles, wrap to 2 lines
  const titleLen = title.length;
  const fontSize = titleLen > 25 ? 42 : 52;
  const maxWidth = titleLen > 25 ? 850 : undefined;

  return (
    <div
      style={{
        position: "absolute",
        top: 320,
        left: 60,
        right: 60,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(12px)",
          padding: "18px 36px",
          borderRadius: 16,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          ...(maxWidth ? { maxWidth } : {}),
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize,
            fontFamily: 'Inter, -apple-system, "Segoe UI", sans-serif',
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.3,
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            display: "block",
            wordWrap: "break-word",
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
};

// ─── Word-by-word Captions ───────────────────────────────────────

const ShortCaption: React.FC<{
  wordTimings: KnowledgeWordTiming[];
  currentTime: number;
}> = ({ wordTimings, currentTime }) => {
  if (!wordTimings || wordTimings.length === 0) return null;

  const maxWordsPerLine = 4;

  // Group words into lines
  const lines: KnowledgeWordTiming[][] = [];
  for (let i = 0; i < wordTimings.length; i += maxWordsPerLine) {
    lines.push(wordTimings.slice(i, i + maxWordsPerLine));
  }

  // Find active line (no overlap — only one line visible at a time)
  const activeLineIndex = lines.findIndex((line) => {
    const lineStart = line[0].start;
    const lineEnd = line[line.length - 1].end;
    return currentTime >= lineStart - 0.05 && currentTime <= lineEnd + 0.15;
  });

  if (activeLineIndex < 0) return null;

  const activeLine = lines[activeLineIndex];
  const lineStart = activeLine[0].start;
  const lineEnd = activeLine[activeLine.length - 1].end;

  // Fade in/out
  const lineOpacity = interpolate(
    currentTime,
    [lineStart - 0.05, lineStart + 0.1, lineEnd, lineEnd + 0.15],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 380,
        left: 30,
        right: 30,
        display: "flex",
        justifyContent: "center",
        opacity: lineOpacity,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(10px)",
          padding: "14px 28px",
          borderRadius: 12,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "4px 10px",
          maxWidth: "95%",
        }}
      >
        {activeLine.map((wordData, wi) => {
          const isActive =
            currentTime >= wordData.start && currentTime <= wordData.end + 0.12;
          const isPast = currentTime > wordData.end + 0.12;

          let color = "rgba(255, 255, 255, 0.35)"; // upcoming
          if (isActive) color = "#FFDD00";           // active: yellow highlight
          else if (isPast) color = "rgba(255, 255, 255, 0.9)"; // past: white

          return (
            <span
              key={wi}
              style={{
                color,
                fontSize: 44,
                fontFamily: 'Inter, -apple-system, "Segoe UI", sans-serif',
                fontWeight: 600,
                lineHeight: 1.4,
                textShadow: "0 2px 6px rgba(0,0,0,0.5)",
                transition: "color 0.1s ease",
              }}
            >
              {wordData.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
