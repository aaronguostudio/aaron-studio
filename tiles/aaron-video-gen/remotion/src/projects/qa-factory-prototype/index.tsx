import React from "react";
import {Composition, registerRoot} from "remotion";
import {
  QA_FACTORY_DURATION_FRAMES,
  QA_FACTORY_FPS,
  QaFactoryPrototype,
  QaFactoryPrototypeFallback,
} from "./QaFactoryPrototype";

const Root: React.FC = () => (
  <>
    <Composition
      id="QaFactoryPrototype"
      component={QaFactoryPrototype}
      durationInFrames={QA_FACTORY_DURATION_FRAMES}
      fps={QA_FACTORY_FPS}
      width={1080}
      height={1920}
      defaultProps={{includeAudio: true, useBackgroundAsset: true, staticFallback: false}}
    />
    <Composition
      id="QaFactoryPrototypeFallback"
      component={QaFactoryPrototypeFallback}
      durationInFrames={QA_FACTORY_DURATION_FRAMES}
      fps={QA_FACTORY_FPS}
      width={1080}
      height={1920}
    />
  </>
);

registerRoot(Root);
