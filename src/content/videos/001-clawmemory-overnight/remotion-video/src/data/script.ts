export type Animation = "slowZoomIn" | "slowZoomOut" | "panRight" | "panLeft";

export interface SceneData {
  id: string;
  image: string;
  subtitle: string;
  startFrame: number;
  endFrame: number;
  animation: Animation;
}

export const scenes: SceneData[] = [
  {
    id: "hook",
    image: "scene-01.png",
    subtitle: "Last night before bed, I gave my AI agent one instruction.",
    startFrame: 0,
    endFrame: 150,
    animation: "slowZoomIn",
  },
  {
    id: "task",
    image: "scene-05.png",
    subtitle: "Build these 5 features. I'll check tomorrow.",
    startFrame: 150,
    endFrame: 300,
    animation: "panRight",
  },
  {
    id: "sleep",
    image: "scene-02.png",
    subtitle: "Then I went to sleep.",
    startFrame: 300,
    endFrame: 510,
    animation: "slowZoomOut",
  },
  {
    id: "wakeup",
    image: "scene-03.png",
    subtitle: "Six hours later...",
    startFrame: 510,
    endFrame: 660,
    animation: "slowZoomIn",
  },
  {
    id: "dashboard",
    image: "scene-04.png",
    subtitle: "Health dashboard. Knowledge graph. Semantic search.",
    startFrame: 660,
    endFrame: 960,
    animation: "panLeft",
  },
  {
    id: "features",
    image: "scene-04.png",
    subtitle: "Memory templates. Smart filters. All done.",
    startFrame: 960,
    endFrame: 1200,
    animation: "slowZoomIn",
  },
  {
    id: "insight",
    image: "scene-06.png",
    subtitle: "You stop being a coder. You start being a builder.",
    startFrame: 1200,
    endFrame: 1530,
    animation: "slowZoomOut",
  },
  {
    id: "cta",
    image: "scene-06.png",
    subtitle: "ClawMemory. Open source. Link in description.",
    startFrame: 1530,
    endFrame: 1800,
    animation: "slowZoomIn",
  },
];
