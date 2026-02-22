import React from "react";
import {
  useCurrentFrame,
  interpolate,
  staticFile,
  Img,
  AbsoluteFill,
} from "remotion";
import { Animation } from "../data/script";

interface SceneProps {
  image: string;
  animation: Animation;
  startFrame: number;
  endFrame: number;
  children?: React.ReactNode;
}

export const Scene: React.FC<SceneProps> = ({
  image,
  animation,
  startFrame,
  endFrame,
  children,
}) => {
  const frame = useCurrentFrame();
  const duration = endFrame - startFrame;
  const progress = (frame - startFrame) / duration;

  let transform = "";

  switch (animation) {
    case "slowZoomIn": {
      const scale = interpolate(progress, [0, 1], [1.0, 1.15], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      transform = `scale(${scale})`;
      break;
    }
    case "slowZoomOut": {
      const scale = interpolate(progress, [0, 1], [1.15, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      transform = `scale(${scale})`;
      break;
    }
    case "panRight": {
      const tx = interpolate(progress, [0, 1], [-3, 3], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      transform = `scale(1.1) translateX(${tx}%)`;
      break;
    }
    case "panLeft": {
      const tx = interpolate(progress, [0, 1], [3, -3], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      transform = `scale(1.1) translateX(${tx}%)`;
      break;
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile(image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform,
          }}
        />
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
};
