import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

type AudioSignal = {
  energy: number;
  low: number;
  high: number;
  pulse: number;
  calmEnergy: number;
  calmLow: number;
  calmHigh: number;
};

export type PrismRoomsProps = {
  durationSec: number;
  seed?: number;
  roomSet?: PrismRoomSet;
  audioAnalysis?: {
    fps: number;
    frames: AudioSignal[];
  };
};

export const defaultPrismRoomsProps: PrismRoomsProps = {
  durationSec: 54,
  seed: 246,
  roomSet: "prism-rooms",
};

const W = 1920;
const H = 1080;
const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const signalAt = (
  analysis: PrismRoomsProps["audioAnalysis"],
  frame: number,
  durationInFrames: number,
  seed: number,
): AudioSignal => {
  if (analysis?.frames?.length) {
    const index = Math.max(0, Math.min(analysis.frames.length - 1, Math.round((frame * analysis.fps) / 30)));
    return analysis.frames[index];
  }

  const seconds = frame / 30;
  const energy = clamp01(0.36 + Math.sin(seconds * 0.14 + seed) * 0.08 + Math.sin(seconds * 0.05) * 0.04);
  return {
    energy,
    low: clamp01(0.42 + Math.sin(seconds * 0.08) * 0.08),
    high: clamp01(0.32 + Math.sin(seconds * 0.12 + 0.8) * 0.06),
    pulse: clamp01(0.18 + Math.max(0, Math.sin(seconds * 0.72 + seed)) * 0.12),
    calmEnergy: energy,
    calmLow: clamp01(0.42 + Math.sin(seconds * 0.04) * 0.06),
    calmHigh: clamp01(0.32 + Math.sin(seconds * 0.06 + 0.8) * 0.04),
  };
};

type Room = {
  image: string;
  cyan: { x: number; y: number; rx: number; ry: number };
  violet: { x: number; y: number; rx: number; ry: number };
  rose: { x: number; y: number; rx: number; ry: number };
  sweepAngle: number;
  accentTone?: "rose" | "amber";
};

export type PrismRoomSet = "prism-rooms" | "obsidian-relay" | "nocturne-glasshouse";

const ROOM_SETS: Record<PrismRoomSet, Room[]> = {
  "prism-rooms": [
    {
      image: "music-visualizer/prism-rooms/scene-01-suspended.png",
      cyan: { x: 550, y: 470, rx: 320, ry: 438 },
      violet: { x: 1030, y: 320, rx: 426, ry: 214 },
      rose: { x: 1290, y: 660, rx: 290, ry: 388 },
      sweepAngle: -18,
    },
    {
      image: "music-visualizer/prism-rooms/scene-02-aperture.png",
      cyan: { x: 508, y: 430, rx: 314, ry: 478 },
      violet: { x: 936, y: 290, rx: 472, ry: 168 },
      rose: { x: 1298, y: 520, rx: 312, ry: 478 },
      sweepAngle: -10,
    },
    {
      image: "music-visualizer/prism-rooms/scene-03-quiet-field.png",
      cyan: { x: 1020, y: 206, rx: 620, ry: 180 },
      violet: { x: 632, y: 722, rx: 422, ry: 120 },
      rose: { x: 1470, y: 692, rx: 180, ry: 108 },
      sweepAngle: 14,
    },
  ],
  "obsidian-relay": [
    {
      image: "music-visualizer/obsidian-relay/scene-01-monoliths.png",
      cyan: { x: 510, y: 522, rx: 286, ry: 438 },
      violet: { x: 910, y: 246, rx: 660, ry: 142 },
      rose: { x: 1540, y: 730, rx: 184, ry: 106 },
      sweepAngle: -13,
      accentTone: "amber",
    },
    {
      image: "music-visualizer/obsidian-relay/scene-02-aperture.png",
      cyan: { x: 484, y: 506, rx: 302, ry: 436 },
      violet: { x: 964, y: 208, rx: 682, ry: 118 },
      rose: { x: 1022, y: 758, rx: 188, ry: 82 },
      sweepAngle: 8,
      accentTone: "amber",
    },
    {
      image: "music-visualizer/obsidian-relay/scene-03-release.png",
      cyan: { x: 484, y: 756, rx: 522, ry: 138 },
      violet: { x: 1260, y: 202, rx: 570, ry: 176 },
      rose: { x: 1460, y: 652, rx: 190, ry: 126 },
      sweepAngle: -22,
      accentTone: "amber",
    },
  ],
  "nocturne-glasshouse": [
    {
      image: "music-visualizer/nocturne-glasshouse/scene-01-stillness.png",
      cyan: { x: 476, y: 562, rx: 274, ry: 406 },
      violet: { x: 1084, y: 296, rx: 464, ry: 176 },
      rose: { x: 1462, y: 710, rx: 234, ry: 120 },
      sweepAngle: -9,
    },
    {
      image: "music-visualizer/nocturne-glasshouse/scene-02-interval.png",
      cyan: { x: 1540, y: 474, rx: 310, ry: 470 },
      violet: { x: 360, y: 308, rx: 386, ry: 286 },
      rose: { x: 1032, y: 708, rx: 226, ry: 106 },
      sweepAngle: 16,
    },
    {
      image: "music-visualizer/nocturne-glasshouse/scene-03-release.png",
      cyan: { x: 564, y: 252, rx: 612, ry: 164 },
      violet: { x: 850, y: 760, rx: 550, ry: 140 },
      rose: { x: 1524, y: 646, rx: 162, ry: 182 },
      sweepAngle: -13,
    },
  ],
};

const RoomScene: React.FC<{
  audio: AudioSignal;
  room: Room;
  roomIndex: number;
  roomDurationInFrames: number;
}> = ({ audio, room, roomIndex, roomDurationInFrames }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(roomDurationInFrames - 1, 1));
  const entryOpacity = interpolate(frame, [0, 18], [0.78, 1], { extrapolateRight: "clamp" });
  const energy = clamp01(audio.calmEnergy);
  const low = clamp01(audio.calmLow);
  const high = clamp01(audio.calmHigh);
  const pulse = clamp01(audio.pulse);
  const sweepX = -250 + progress * 2360;
  const cyanOpacity = 0.055 + high * 0.065 + pulse * 0.018;
  const violetOpacity = 0.04 + energy * 0.075;
  const roseOpacity = 0.032 + low * 0.062;
  const floorOpacity = 0.045 + energy * 0.052 + pulse * 0.014;
  const edgeOpacity = 0.046 + high * 0.062;
  const id = `prism-room-${roomIndex}`;
  const accentIsAmber = room.accentTone === "amber";

  return (
    <AbsoluteFill style={{ backgroundColor: "#020308", opacity: entryOpacity, overflow: "hidden" }}>
      <Img
        src={staticFile(room.image)}
        style={{ height: "100%", objectFit: "cover", position: "absolute", width: "100%" }}
      />
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`${id}-cyan`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#edffff" stopOpacity="0.72" />
            <stop offset="0.22" stopColor="#82e8ff" stopOpacity="0.26" />
            <stop offset="1" stopColor="#5bc8ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-violet`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fff2ff" stopOpacity="0.54" />
            <stop offset="0.24" stopColor="#c592ff" stopOpacity="0.25" />
            <stop offset="1" stopColor="#714dff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-rose`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor={accentIsAmber ? "#fff5d6" : "#fff4f4"} stopOpacity="0.52" />
            <stop offset="0.26" stopColor={accentIsAmber ? "#ffbd69" : "#ff9dbb"} stopOpacity="0.22" />
            <stop offset="1" stopColor={accentIsAmber ? "#dc8d27" : "#e94f91"} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-sweep`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d7fbff" stopOpacity="0" />
            <stop offset="0.46" stopColor="#eefeff" stopOpacity="0.02" />
            <stop offset="0.50" stopColor="#ffffff" stopOpacity="0.46" />
            <stop offset="0.54" stopColor="#dcefff" stopOpacity="0.03" />
            <stop offset="1" stopColor="#bdc7ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#54ddff" stopOpacity="0" />
            <stop offset="0.32" stopColor="#9fe7ff" stopOpacity="0.68" />
            <stop offset="0.60" stopColor="#ff9ec9" stopOpacity="0.54" />
            <stop offset="1" stopColor="#bb77ff" stopOpacity="0" />
          </linearGradient>
          <filter id={`${id}-blur-22`} x="-40%" y="-50%" width="180%" height="200%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <filter id={`${id}-blur-70`} x="-55%" y="-70%" width="210%" height="240%">
            <feGaussianBlur stdDeviation="70" />
          </filter>
          <filter id={`${id}-edge`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        <g style={{ mixBlendMode: "screen" }}>
          <ellipse cx={room.cyan.x} cy={room.cyan.y} rx={room.cyan.rx} ry={room.cyan.ry} fill={`url(#${id}-cyan)`} opacity={cyanOpacity} filter={`url(#${id}-blur-22)`} />
          <ellipse cx={room.violet.x} cy={room.violet.y} rx={room.violet.rx} ry={room.violet.ry} fill={`url(#${id}-violet)`} opacity={violetOpacity} filter={`url(#${id}-blur-22)`} />
          <ellipse cx={room.rose.x} cy={room.rose.y} rx={room.rose.rx} ry={room.rose.ry} fill={`url(#${id}-rose)`} opacity={roseOpacity} filter={`url(#${id}-blur-22)`} />
          <rect x={sweepX} y="-210" width="190" height="1500" fill={`url(#${id}-sweep)`} opacity={edgeOpacity} transform={`rotate(${room.sweepAngle} ${sweepX} 540)`} />
          <ellipse cx="970" cy="946" rx="786" ry="132" fill={`url(#${id}-floor)`} opacity={floorOpacity} filter={`url(#${id}-blur-70)`} />
        </g>
        <path d="M 214 900 C 614 816 1284 816 1710 902" fill="none" stroke="#eaf8ff" strokeWidth="2" opacity={edgeOpacity * 0.38} filter={`url(#${id}-edge)`} />
        <rect width={W} height={H} fill="#010207" opacity="0.07" />
      </svg>
    </AbsoluteFill>
  );
};

export const PrismRooms: React.FC<PrismRoomsProps> = ({ durationSec, seed = 246, roomSet = "prism-rooms", audioAnalysis }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const transitionFrames = 90;
  const rooms = ROOM_SETS[roomSet];
  const roomDurationInFrames = Math.max(1, Math.round((durationInFrames + transitionFrames * (rooms.length - 1)) / rooms.length));
  const audio = signalAt(audioAnalysis, frame, durationInFrames, seed);

  void durationSec;

  return (
    <AbsoluteFill style={{ backgroundColor: "#020308" }}>
      <TransitionSeries>
        {rooms.map((room, index) => (
          <React.Fragment key={room.image}>
            {index > 0 ? (
              <TransitionSeries.Transition timing={linearTiming({ durationInFrames: transitionFrames })} presentation={fade()} />
            ) : null}
            <TransitionSeries.Sequence durationInFrames={roomDurationInFrames}>
              <RoomScene audio={audio} room={room} roomIndex={index} roomDurationInFrames={roomDurationInFrames} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
