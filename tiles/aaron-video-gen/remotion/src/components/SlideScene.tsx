import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
  AbsoluteFill,
} from "remotion";
import type { Animation } from "../types";

interface SlideSceneProps {
  imageFile: string;
  animation: Animation;
  children?: React.ReactNode;
}

export const SlideScene: React.FC<SlideSceneProps> = ({
  imageFile,
  animation,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const progress = spring({
    fps,
    frame,
    config: { damping: 200, stiffness: 10, mass: 1 },
    durationInFrames,
  });

  let transform = "";

  switch (animation) {
    case "slowZoomIn": {
      const scale = interpolate(progress, [0, 1], [1.0, 1.08], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      transform = `scale(${scale})`;
      break;
    }
    case "slowZoomOut": {
      const scale = interpolate(progress, [0, 1], [1.08, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      transform = `scale(${scale})`;
      break;
    }
    case "panRight": {
      const tx = interpolate(progress, [0, 1], [-2, 2], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      transform = `scale(1.06) translateX(${tx}%)`;
      break;
    }
    case "panLeft": {
      const tx = interpolate(progress, [0, 1], [2, -2], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      transform = `scale(1.06) translateX(${tx}%)`;
      break;
    }
    case "none":
    default:
      transform = "scale(1)";
      break;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile(imageFile)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform,
            willChange: "transform",
          }}
        />
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
};
