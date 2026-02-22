// Ken Burns utilities - the actual implementation is in Scene.tsx
// This file exists as a reference for the Ken Burns effect types

export type KenBurnsEffect = "slowZoomIn" | "slowZoomOut" | "panRight" | "panLeft";

export const kenBurnsConfig = {
  slowZoomIn: { startScale: 1.0, endScale: 1.15 },
  slowZoomOut: { startScale: 1.15, endScale: 1.0 },
  panRight: { startX: -3, endX: 3, scale: 1.1 },
  panLeft: { startX: 3, endX: -3, scale: 1.1 },
};
