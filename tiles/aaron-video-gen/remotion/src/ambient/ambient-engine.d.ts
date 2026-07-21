export type AmbientScene = "focus" | "sleep" | "relax";
export type AmbientPaletteName = "mono" | "signal" | "lunar";

export type AmbientAudioSignal = {
  energy?: number;
  low?: number;
  mid?: number;
  high?: number;
  pulse?: number;
  calmEnergy?: number;
  calmLow?: number;
  calmHigh?: number;
};

export type AmbientPalette = {
  background: string;
  backgroundAlt: string;
  primary: string;
  muted: string;
  accent: string;
  accentAlt: string;
};

export type AmbientSceneMeta = {
  id: AmbientScene;
  title: string;
  purpose: string;
  durationSec: number;
  palette: AmbientPaletteName;
};

export type DrawAmbientSceneOptions = {
  scene?: AmbientScene;
  timeSec?: number;
  durationSec?: number;
  width?: number;
  height?: number;
  seed?: number;
  intensity?: number;
  palette?: AmbientPaletteName | Partial<AmbientPalette>;
  audio?: AmbientAudioSignal;
};

export const AMBIENT_REFERENCE_SIZE: { width: number; height: number };
export const AMBIENT_SCENES: Record<AmbientScene, AmbientSceneMeta>;
export const AMBIENT_PALETTES: Record<AmbientPaletteName, AmbientPalette>;
export const getAmbientSceneMeta: (scene: AmbientScene) => AmbientSceneMeta;
export const drawAmbientScene: (
  ctx: CanvasRenderingContext2D,
  options?: DrawAmbientSceneOptions,
) => void;
