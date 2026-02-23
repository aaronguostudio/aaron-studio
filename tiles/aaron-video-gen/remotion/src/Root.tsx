import React from "react";
import { Composition } from "remotion";
import { SlideshowVideo } from "./SlideshowVideo";
import { getIntroHookDuration } from "./components/IntroHook";
import type { VideoInputProps } from "./types";

const defaultProps: VideoInputProps = {
  videoTitle: "Untitled Video",
  slides: [],
  fps: 24,
  transitionDurationSec: 2,
  paddingSec: 1,
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SlideshowVideo"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component={SlideshowVideo as any}
      calculateMetadata={({ props: rawProps }) => {
        const props = rawProps as unknown as VideoInputProps;
        const fps = props.fps || 24;
        const transitionSec = props.transitionDurationSec || 2;
        const paddingSec = props.paddingSec || 1;

        const numSlides = props.slides.length;
        const lastIndex = numSlides - 1;

        // Intro hook adds frames before the main content
        const introHookFrames = getIntroHookDuration(numSlides, fps);

        // Each slide's duration includes buffers so audio doesn't overlap
        // during transitions:
        //   audioDelay (incoming transition buffer) + audioDuration + padding + endBuffer (outgoing)
        const totalSlideFrames = props.slides.reduce((sum, s, i) => {
          const audioDelay = i === 0 ? 0 : transitionSec;
          const endBuffer = i === lastIndex ? 0 : transitionSec;
          return sum + audioDelay + s.audioDuration + paddingSec + endBuffer;
        }, 0);

        // TransitionSeries overlaps: each transition removes transitionSec
        const transitionOverlap =
          Math.max(0, numSlides - 1) * transitionSec;

        const totalDuration = totalSlideFrames - transitionOverlap;
        const mainContentFrames = Math.ceil(Math.max(1, totalDuration) * fps);

        const durationInFrames = introHookFrames + mainContentFrames;

        return {
          durationInFrames,
          fps,
          width: 1920,
          height: 1080,
        };
      }}
      defaultProps={defaultProps}
    />
  );
};
