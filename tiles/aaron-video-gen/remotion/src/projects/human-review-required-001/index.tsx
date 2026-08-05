import React from "react";
import {Composition, registerRoot} from "remotion";
import {
  HUMAN_REVIEW_REQUIRED_001_DURATION_FRAMES,
  HUMAN_REVIEW_REQUIRED_001_FPS,
  HumanReviewRequired001,
} from "./HumanReviewRequired001";

const Root: React.FC = () => (
  <>
    <Composition
      id="HumanReviewRequired001Vertical"
      component={HumanReviewRequired001}
      durationInFrames={HUMAN_REVIEW_REQUIRED_001_DURATION_FRAMES}
      fps={HUMAN_REVIEW_REQUIRED_001_FPS}
      width={1080}
      height={1920}
      defaultProps={{includeAudio: true}}
    />
    <Composition
      id="HumanReviewRequired001Landscape"
      component={HumanReviewRequired001}
      durationInFrames={HUMAN_REVIEW_REQUIRED_001_DURATION_FRAMES}
      fps={HUMAN_REVIEW_REQUIRED_001_FPS}
      width={1920}
      height={1080}
      defaultProps={{includeAudio: true}}
    />
  </>
);

registerRoot(Root);

