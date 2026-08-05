import React from "react";
import {Composition, registerRoot} from "remotion";
import {
  CodexResearchFirstEn,
  CODEX_RESEARCH_FIRST_DURATION_FRAMES,
  CODEX_RESEARCH_FIRST_FPS,
} from "./CodexResearchFirstEn";

const Root: React.FC = () => (
  <Composition
    id="CodexResearchFirstEn"
    component={CodexResearchFirstEn}
    durationInFrames={CODEX_RESEARCH_FIRST_DURATION_FRAMES}
    fps={CODEX_RESEARCH_FIRST_FPS}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
