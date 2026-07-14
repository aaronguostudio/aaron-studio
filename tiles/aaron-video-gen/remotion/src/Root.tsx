import React from "react";
import { Composition } from "remotion";
import { SlideshowVideo } from "./SlideshowVideo";
import {
  MusicVisualizer,
  defaultMusicVisualizerProps,
} from "./MusicVisualizer";
import type { MusicVisualizerProps } from "./MusicVisualizer";
import { DigitalSpaces, defaultDigitalSpacesProps } from "./DigitalSpaces";
import type { DigitalSpacesProps } from "./DigitalSpaces";
import { KnowledgeShort } from "./KnowledgeShort";
import type { KnowledgeShortProps } from "./KnowledgeShort";
import {
  SignalWorkflowBriefSample,
  signalWorkflowBriefSampleDurationFrames,
} from "./SignalWorkflowBriefSample";
import {
  SignalFieldNotesSample,
  signalFieldNotesSampleDurationFrames,
} from "./SignalFieldNotesSample";
import {
  FdeFieldSignalPrototype,
  FDE_PROTOTYPE_FPS,
  fdePrototypeDurationFrames,
} from "./FdeFieldSignalPrototype";
import {
  FdeFieldSignalPrototypeV2,
  FDE_PROTOTYPE_V2_FPS,
  fdePrototypeV2DurationFrames,
} from "./FdeFieldSignalPrototypeV2";
import {
  FdeFieldSignalPrototypeV3,
  FDE_PROTOTYPE_V3_FPS,
  fdePrototypeV3DurationFrames,
} from "./FdeFieldSignalPrototypeV3";
import {
  FdeFullFilmV1,
  FdeFullFilmV4,
  FdeFullFilmV5,
  FdeFullFilmV5Branded,
  FDE_FULL_FILM_FPS,
  fdeFullFilmDurationFrames,
  fdeFullFilmV5BrandedDurationFrames,
} from "./FdeFullFilmV1";
import { getIntroHookDuration } from "./components/IntroHook";
import { getContentHookDuration } from "./components/ContentHook";
import { getCoverCardDuration } from "./components/CoverCard";
import { OUTRO_DURATION_SEC } from "./components/Outro";
import type { VideoInputProps } from "./types";

const defaultProps: VideoInputProps = {
  videoTitle: "Untitled Video",
  slides: [],
  fps: 24,
  transitionDurationSec: 1.2,
  paddingSec: 1,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SignalWorkflowBriefSample"
        component={SignalWorkflowBriefSample}
        durationInFrames={signalWorkflowBriefSampleDurationFrames(30)}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="SignalFieldNotesSample"
        component={SignalFieldNotesSample}
        durationInFrames={signalFieldNotesSampleDurationFrames(30)}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="FdeFieldSignalPrototype"
        component={FdeFieldSignalPrototype}
        durationInFrames={fdePrototypeDurationFrames(FDE_PROTOTYPE_FPS)}
        fps={FDE_PROTOTYPE_FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="FdeFieldSignalPrototypeV2"
        component={FdeFieldSignalPrototypeV2}
        durationInFrames={fdePrototypeV2DurationFrames(FDE_PROTOTYPE_V2_FPS)}
        fps={FDE_PROTOTYPE_V2_FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="FdeFieldSignalPrototypeV3"
        component={FdeFieldSignalPrototypeV3}
        durationInFrames={fdePrototypeV3DurationFrames(FDE_PROTOTYPE_V3_FPS)}
        fps={FDE_PROTOTYPE_V3_FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="FdeFullFilmV1"
        component={FdeFullFilmV1}
        durationInFrames={fdeFullFilmDurationFrames(FDE_FULL_FILM_FPS)}
        fps={FDE_FULL_FILM_FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="FdeFullFilmV4"
        component={FdeFullFilmV4}
        durationInFrames={fdeFullFilmDurationFrames(FDE_FULL_FILM_FPS)}
        fps={FDE_FULL_FILM_FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="FdeFullFilmV5"
        component={FdeFullFilmV5}
        durationInFrames={fdeFullFilmDurationFrames(FDE_FULL_FILM_FPS)}
        fps={FDE_FULL_FILM_FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="FdeFullFilmV5Branded"
        component={FdeFullFilmV5Branded}
        durationInFrames={fdeFullFilmV5BrandedDurationFrames(FDE_FULL_FILM_FPS)}
        fps={FDE_FULL_FILM_FPS}
        width={1920}
        height={1080}
      />

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

          // Cover card + content hook + branding intro add frames before main content
          const coverCardFrames = getCoverCardDuration(
            props.coverImageFile,
            fps,
          );
          const contentHookFrames = getContentHookDuration(
            props.hookAudioDuration,
            fps,
          );
          const introHookFrames = getIntroHookDuration(
            numSlides,
            fps,
            !!props.coverImageFile,
          );

          // Each slide's duration includes buffers so audio doesn't overlap
          // during transitions:
          //   audioDelay (incoming transition buffer) + audioDuration + padding + endBuffer (outgoing)
          const totalSlideFrames = props.slides.reduce((sum, s, i) => {
            const audioDelay = i === 0 ? 0 : transitionSec;
            const endBuffer = i === lastIndex ? 0 : transitionSec;
            return sum + audioDelay + s.audioDuration + paddingSec + endBuffer;
          }, 0);

          // TransitionSeries overlaps: each transition removes transitionSec
          const transitionOverlap = Math.max(0, numSlides - 1) * transitionSec;

          const totalDuration = totalSlideFrames - transitionOverlap;
          const mainContentFrames = Math.ceil(Math.max(1, totalDuration) * fps);

          // Outro overlaps with the tail of the last slide, but we need
          // enough total frames so the outro's fade-to-black can play out
          const hasOutro = props.logoFile || props.slogan;
          const outroExtraFrames = hasOutro
            ? Math.round(OUTRO_DURATION_SEC * fps * 0.5)
            : 0;

          const durationInFrames =
            coverCardFrames +
            contentHookFrames +
            introHookFrames +
            mainContentFrames +
            outroExtraFrames;

          return {
            durationInFrames,
            fps,
            width: 1920,
            height: 1080,
          };
        }}
        defaultProps={defaultProps}
      />

      {/* Music Visualizer — 16:9 music-led minimal motion */}
      <Composition
        id="MusicVisualizer"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={MusicVisualizer as any}
        calculateMetadata={({ props: rawProps }) => {
          const props = rawProps as unknown as MusicVisualizerProps;
          const fps = 30;
          return {
            durationInFrames: Math.max(1, Math.ceil((props.durationSec || 45) * fps)),
            fps,
            width: 1920,
            height: 1080,
          };
        }}
        defaultProps={defaultMusicVisualizerProps}
      />

      {/* Experimental digital-space studies: fixed 2.5D geometry with audio-lit material. */}
      <Composition
        id="DigitalSpaces"
        component={DigitalSpaces as any}
        calculateMetadata={({ props: rawProps }) => {
          const props = rawProps as unknown as DigitalSpacesProps;
          const fps = 30;
          return {
            durationInFrames: Math.max(1, Math.ceil((props.durationSec || 18) * fps)),
            fps,
            width: 1920,
            height: 1080,
          };
        }}
        defaultProps={defaultDigitalSpacesProps}
      />

      {/* Knowledge Shorts — 9:16 vertical, 15s */}
      <Composition
        id="KnowledgeShort"
        component={KnowledgeShort as any}
        calculateMetadata={({ props: rawProps }) => {
          const props = rawProps as unknown as KnowledgeShortProps;
          const fps = props.fps || 30;
          const durationSec = props.durationSec || 15;
          return {
            durationInFrames: Math.ceil(durationSec * fps),
            fps,
            width: 1080,
            height: 1920,
          };
        }}
        defaultProps={
          {
            title: "Knowledge Short",
            videoFile: "video.mp4",
            audioFile: "narration.mp3",
            wordTimings: [],
            fps: 30,
            durationSec: 15,
          } as KnowledgeShortProps
        }
      />
    </>
  );
};
