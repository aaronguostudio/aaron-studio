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
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { iris } from "@remotion/transitions/iris";
import { SlideScene } from "./components/SlideScene";
import { TitleCard } from "./components/TitleCard";
import { GradientOverlay } from "./components/GradientOverlay";
import { ChapterIndicator } from "./components/ChapterIndicator";
import { WordCaption } from "./components/WordCaption";
import { ProgressBar } from "./components/ProgressBar";
import { IntroHook, getIntroHookDuration } from "./components/IntroHook";
import { ContentHook, getContentHookDuration } from "./components/ContentHook";
import { CoverCard, getCoverCardDuration } from "./components/CoverCard";
import { Outro, OUTRO_DURATION_SEC } from "./components/Outro";
import type { VideoInputProps } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITION_PRESENTATIONS: any[] = [
  fade(),
  slide(),
  wipe(),
  flip(),
  clockWipe({ width: 1920, height: 1080 }),
  fade(),
  slide({ direction: "from-top" }),
  iris({ width: 1920, height: 1080 }),
];

export const SlideshowVideo: React.FC<VideoInputProps> = ({
  videoTitle,
  slides,
  fps,
  transitionDurationSec,
  paddingSec,
  musicFile,
  musicVolume = 0.1,
  logoFile,
  slogan,
  website,
  hookAudioFile,
  hookAudioDuration,
  hookImageFile,
  hookWordTimings,
  coverImageFile,
}) => {
  const transitionFrames = Math.round(transitionDurationSec * fps);
  const lastIndex = slides.length - 1;
  const coverCardDuration = getCoverCardDuration(coverImageFile, fps);
  const contentHookDuration = getContentHookDuration(hookAudioDuration, fps);
  const introHookDuration = getIntroHookDuration(slides.length, fps, !!coverImageFile);
  const preContentFrames = coverCardDuration + contentHookDuration + introHookDuration;
  const outroDurationFrames = Math.round(OUTRO_DURATION_SEC * fps);

  // Calculate cumulative slide start frames (for progress bar markers)
  const slideStartFrames: number[] = [];
  let cumulativeFrame = preContentFrames;
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
      {/* Cover card: thumbnail image as opening frame */}
      {coverCardDuration > 0 && coverImageFile && (
        <Sequence durationInFrames={coverCardDuration}>
          <CoverCard imageFile={coverImageFile} />
        </Sequence>
      )}

      {/* Content hook: attention-grabbing teaser before branding */}
      {contentHookDuration > 0 && hookAudioFile && hookImageFile && (
        <Sequence from={coverCardDuration} durationInFrames={contentHookDuration}>
          <ContentHook
            imageFile={hookImageFile}
            audioFile={hookAudioFile}
            audioDuration={hookAudioDuration!}
            wordTimings={hookWordTimings}
          />
        </Sequence>
      )}

      {/* Intro: logo + slogan (+ title when no cover) */}
      {introHookDuration > 0 && (
        <Sequence from={coverCardDuration + contentHookDuration} durationInFrames={introHookDuration}>
          <IntroHook
            slides={slides}
            videoTitle={videoTitle}
            logoFile={logoFile}
            slogan={slogan}
            website={website}
            hasCover={!!coverImageFile}
          />
        </Sequence>
      )}

      {/* Main slide content */}
      <Sequence from={preContentFrames}>
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
                    />
                  ) : (
                    <SlideScene
                      imageFile={slideData.imageFile}
                      imageFiles={slideData.imageFiles}
                      imageChangeTimings={slideData.imageChangeTimings}
                      audioDelay={audioDelay}
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

      {/* Outro: fade to black with logo + slogan */}
      {(logoFile || slogan) && (
        <Sequence
          from={cumulativeFrame + preContentFrames - outroDurationFrames}
          durationInFrames={outroDurationFrames}
        >
          <Outro logoFile={logoFile} slogan={slogan} website={website} />
        </Sequence>
      )}

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
          preContentDuration={preContentFrames}
          contentHookDuration={contentHookDuration}
          hookAudioDuration={hookAudioDuration}
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
  preContentDuration: number;
  contentHookDuration: number;
  hookAudioDuration?: number;
  transitionFrames: number;
  paddingSec: number;
  baseVolume: number;
}> = ({
  musicFile,
  slides,
  fps,
  preContentDuration,
  contentHookDuration,
  hookAudioDuration,
  transitionFrames,
  paddingSec,
  baseVolume,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Build a list of narration time ranges (global frame numbers)
  // to know when to duck the music
  const narrationRanges: Array<{ start: number; end: number }> = [];

  // Duck during content hook narration
  if (contentHookDuration > 0 && hookAudioDuration) {
    narrationRanges.push({
      start: 0,
      end: Math.ceil(hookAudioDuration * fps),
    });
  }

  let pos = preContentDuration;

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
