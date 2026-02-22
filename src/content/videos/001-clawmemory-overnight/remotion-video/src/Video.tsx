import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { scenes } from "./data/script";
import { Scene } from "./components/Scene";
import { Subtitle } from "./components/Subtitle";
import { FadeIn } from "./components/Transition";

const TRANSITION_FRAMES = 15;

interface VideoProps {
  audioSrc?: string;
}

export const Video: React.FC<VideoProps> = ({ audioSrc }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {scenes.map((scene, i) => {
        const isFirst = i === 0;

        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.endFrame - scene.startFrame}
          >
            {isFirst ? (
              <Scene
                image={scene.image}
                animation={scene.animation}
                startFrame={scene.startFrame}
                endFrame={scene.endFrame}
              >
                <Subtitle
                  text={scene.subtitle}
                  startFrame={scene.startFrame}
                />
              </Scene>
            ) : (
              <FadeIn startFrame={0} durationFrames={TRANSITION_FRAMES}>
                <Scene
                  image={scene.image}
                  animation={scene.animation}
                  startFrame={scene.startFrame}
                  endFrame={scene.endFrame}
                >
                  <Subtitle
                    text={scene.subtitle}
                    startFrame={scene.startFrame}
                  />
                </Scene>
              </FadeIn>
            )}
          </Sequence>
        );
      })}

      {audioSrc && <Audio src={staticFile(audioSrc)} />}
    </AbsoluteFill>
  );
};
