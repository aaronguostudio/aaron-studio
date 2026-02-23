export type Animation =
  | "slowZoomIn"
  | "slowZoomOut"
  | "panRight"
  | "panLeft"
  | "none";

export interface WordTiming {
  word: string;
  start: number; // seconds relative to slide audio start
  end: number;   // seconds
}

export interface SlideData {
  index: number;
  title: string;
  narration: string;
  imageFile: string;
  audioFile: string;
  audioDuration: number;
  animation: Animation;
  wordTimings?: WordTiming[];
}

export interface VideoInputProps {
  videoTitle: string;
  slides: SlideData[];
  fps: number;
  transitionDurationSec: number;
  paddingSec: number;
  musicFile?: string;
  musicVolume?: number;
}
