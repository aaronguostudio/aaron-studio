import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { SlideScene } from "./components/SlideScene";
import { TitleCard } from "./components/TitleCard";
import { GradientOverlay } from "./components/GradientOverlay";
import { ChapterIndicator } from "./components/ChapterIndicator";
import { WordCaption } from "./components/WordCaption";
import { ProgressBar } from "./components/ProgressBar";
import { IntroHook, getIntroHookDuration } from "./components/IntroHook";
import type { VideoInputProps } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITION_PRESENTATIONS: any[] = [fade(), slide(), wipe(), fade()];

export const SlideshowVideo: React.FC<VideoInputProps> = ({
  videoTitle,
  slides,
  fps,
  transitionDurationSec,
  paddingSec,
  musicFile,
  musicVolume = 0.1,
}) => {
  const transitionFrames = Math.round(transitionDurationSec * fps);
  const lastIndex = slides.length - 1;
  const introHookDuration = getIntroHookDuration(slides.length, fps);

  // Calculate cumulative slide start frames (for progress bar markers)
  const slideStartFrames: number[] = [];
  let cumulativeFrame = introHookDuration;
  for (let i = 0; i < slides.length; i++) {
    slideStartFrames.push(cumulativeFrame);
    const isFirst = i === 0;
    const isLast = i === lastIndex;
    const audioDelay = isFirst ? 0 : transitionFrames;
    const endBuffer = isLast ? 0 : transitionFrames;
    const slideDuration =
      audioDelay +
      Math.ceil(slides[i].audioDuration * fps) +
      Math.ceil(paddingSec * fps) +
      endBuffer;
    // TransitionSeries overlaps eat transitionFrames from total
    cumulativeFrame += slideDuration - (i < lastIndex ? transitionFrames : 0);
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Intro hook montage */}
      {introHookDuration > 0 && (
        <Sequence durationInFrames={introHookDuration}>
          <IntroHook slides={slides} videoTitle={videoTitle} />
        </Sequence>
      )}

      {/* Main slide content */}
      <Sequence from={introHookDuration}>
        <TransitionSeries>
          {slides.map((slideData, i) => {
            const isFirst = i === 0;
            const isLast = i === lastIndex;

            const audioDelay = isFirst ? 0 : transitionFrames;
            const endBuffer = isLast ? 0 : transitionFrames;
            const audioDurationFrames = Math.ceil(
              slideData.audioDuration * fps
            );
            const paddingFrames = Math.ceil(paddingSec * fps);

            const slideDurationFrames =
              audioDelay + audioDurationFrames + paddingFrames + endBuffer;

            const presentation =
              TRANSITION_PRESENTATIONS[i % TRANSITION_PRESENTATIONS.length];

            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <TransitionSeries.Transition
                    timing={linearTiming({
                      durationInFrames: transitionFrames,
                    })}
                    presentation={presentation}
                  />
                )}
                <TransitionSeries.Sequence
                  durationInFrames={slideDurationFrames}
                >
                  {isFirst ? (
                    <TitleCard
                      title={videoTitle}
                      imageFile={slideData.imageFile}
                      animation={slideData.animation}
                    />
                  ) : (
                    <SlideScene
                      imageFile={slideData.imageFile}
                      animation={slideData.animation}
                    >
                      <GradientOverlay />
                      <ChapterIndicator title={slideData.title} />
                    </SlideScene>
                  )}
                  <Sequence from={audioDelay}>
                    <Audio src={staticFile(slideData.audioFile)} />
                    {/* Word-by-word captions */}
                    {slideData.wordTimings &&
                      slideData.wordTimings.length > 0 && (
                        <WordCaption
                          wordTimings={slideData.wordTimings}
                          audioDelay={0}
                        />
                      )}
                  </Sequence>
                </TransitionSeries.Sequence>
              </React.Fragment>
            );
          })}
        </TransitionSeries>
      </Sequence>

      {/* Section progress indicator (always on top) */}
      <ProgressBar
        sections={slides.map((s, i) => ({
          title: s.title,
          startFrame: slideStartFrames[i],
        }))}
      />

      {/* Background music with auto-ducking */}
      {musicFile && (
        <BackgroundMusic
          musicFile={musicFile}
          slides={slides}
          fps={fps}
          introHookDuration={introHookDuration}
          transitionFrames={transitionFrames}
          paddingSec={paddingSec}
          baseVolume={musicVolume}
        />
      )}
    </AbsoluteFill>
  );
};

/**
 * Background music component with auto-ducking.
 * Volume rises during transitions and dips during narration.
 */
const BackgroundMusic: React.FC<{
  musicFile: string;
  slides: VideoInputProps["slides"];
  fps: number;
  introHookDuration: number;
  transitionFrames: number;
  paddingSec: number;
  baseVolume: number;
}> = ({
  musicFile,
  slides,
  fps,
  introHookDuration,
  transitionFrames,
  paddingSec,
  baseVolume,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Build a list of narration time ranges (global frame numbers)
  // to know when to duck the music
  const narrationRanges: Array<{ start: number; end: number }> = [];
  let pos = introHookDuration;

  for (let i = 0; i < slides.length; i++) {
    const isFirst = i === 0;
    const isLast = i === slides.length - 1;
    const audioDelay = isFirst ? 0 : transitionFrames;
    const audioDurationFrames = Math.ceil(slides[i].audioDuration * fps);
    const endBuffer = isLast ? 0 : transitionFrames;
    const paddingFrames = Math.ceil(paddingSec * fps);
    const slideTotal = audioDelay + audioDurationFrames + paddingFrames + endBuffer;

    // Narration plays from (pos + audioDelay) to (pos + audioDelay + audioDurationFrames)
    narrationRanges.push({
      start: pos + audioDelay,
      end: pos + audioDelay + audioDurationFrames,
    });

    pos += slideTotal - (i < slides.length - 1 ? transitionFrames : 0);
  }

  // Check if narration is active at current frame
  const isNarrating = narrationRanges.some(
    (r) => frame >= r.start - 12 && frame <= r.end + 6
  );

  // Smooth ducking: lower during narration, higher during transitions
  const duckVolume = isNarrating ? baseVolume : baseVolume * 3;

  // Fade in at start, fade out at end
  const envelope = interpolate(
    frame,
    [0, fps * 2, durationInFrames - fps * 3, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Audio
      src={staticFile(musicFile)}
      volume={duckVolume * envelope}
      loop
    />
  );
};
