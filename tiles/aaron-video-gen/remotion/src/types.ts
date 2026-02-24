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

export interface ImageChangeTiming {
  imageFile: string;    // path relative to public/ (e.g., "slides/01b.png")
  startAtSec: number;   // seconds into slide audio when this image appears
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
  imageFiles?: string[];                   // all images in order for progressive builds
  imageChangeTimings?: ImageChangeTiming[]; // when to crossfade to each sub-image
}

export interface VideoInputProps {
  videoTitle: string;
  slides: SlideData[];
  fps: number;
  transitionDurationSec: number;
  paddingSec: number;
  musicFile?: string;
  musicVolume?: number;
  logoFile?: string;
  slogan?: string;
  website?: string;
  hookAudioFile?: string;
  hookAudioDuration?: number;
  hookImageFile?: string;
  hookWordTimings?: WordTiming[];
  coverImageFile?: string;
}
