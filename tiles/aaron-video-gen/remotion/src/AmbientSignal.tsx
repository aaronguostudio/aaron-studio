import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  drawAmbientScene,
  getAmbientSceneMeta,
  type AmbientAudioSignal,
  type AmbientPaletteName,
  type AmbientScene,
} from "./ambient/ambient-engine.js";

export type AmbientSignalProps = {
  scene: AmbientScene;
  durationSec: number;
  cycleDurationSec?: number;
  seed?: number;
  intensity?: number;
  palette?: AmbientPaletteName;
  showChrome?: boolean;
  audioAnalysis?: {
    fps: number;
    frames: AmbientAudioSignal[];
  };
};

export const defaultAmbientSignalProps: AmbientSignalProps = {
  scene: "focus",
  durationSec: 18,
  cycleDurationSec: 18,
  seed: 2718,
  intensity: 0.82,
  palette: "signal",
  showChrome: false,
};

const signalAt = (
  analysis: AmbientSignalProps["audioAnalysis"],
  frame: number,
  fps: number,
): AmbientAudioSignal => {
  if (!analysis?.frames.length) return { energy: 0.42, low: 0.44, high: 0.32 };
  const index = Math.max(
    0,
    Math.min(
      analysis.frames.length - 1,
      Math.round((frame / Math.max(fps, 1)) * analysis.fps),
    ),
  );
  return analysis.frames[index] ?? { energy: 0.42, low: 0.44, high: 0.32 };
};

export const AmbientSignal: React.FC<AmbientSignalProps> = ({
  scene,
  durationSec,
  cycleDurationSec,
  seed = 2718,
  intensity = 0.82,
  palette,
  showChrome = false,
  audioAnalysis,
}) => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const meta = getAmbientSceneMeta(scene);
  const loopDuration = Math.max(1, cycleDurationSec ?? meta.durationSec);
  const audio = signalAt(audioAnalysis, frame, fps);

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context) return;
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    drawAmbientScene(context, {
      audio,
      durationSec: loopDuration,
      height,
      intensity,
      palette: palette ?? meta.palette,
      scene,
      seed,
      timeSec: frame / fps,
      width,
    });
  }, [audio, frame, fps, height, intensity, loopDuration, meta.palette, palette, scene, seed, width]);

  // durationSec is the programme length. cycleDurationSec is the short,
  // mathematically seamless loop, so the same scene can render for hours.
  void durationSec;

  return (
    <AbsoluteFill style={{ backgroundColor: "#030706", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{ display: "block", height: "100%", width: "100%" }}
      />
      {showChrome ? (
        <AbsoluteFill
          style={{
            color: "rgba(239,255,248,0.82)",
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            padding: 58,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              letterSpacing: 3,
              textTransform: "uppercase",
              fontSize: 16,
            }}
          >
            <span>Ambient Signal Engine</span>
            <span>{meta.title}</span>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
