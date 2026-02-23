import React from "react";
import { AbsoluteFill, staticFile, Img } from "remotion";
import { TextReveal } from "./TextReveal";
import { GradientOverlay } from "./GradientOverlay";
import type { Animation } from "../types";
import { SlideScene } from "./SlideScene";

interface TitleCardProps {
  title: string;
  imageFile: string;
  animation: Animation;
}

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  imageFile,
  animation,
}) => {
  return (
    <SlideScene imageFile={imageFile} animation={animation}>
      <GradientOverlay opacity={0.75} height="60%" />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 120px",
        }}
      >
        <TextReveal
          text={title}
          fontSize={64}
          fontWeight={800}
          delay={10}
          style={{ textAlign: "center", maxWidth: "80%" }}
        />
      </AbsoluteFill>
    </SlideScene>
  );
};
