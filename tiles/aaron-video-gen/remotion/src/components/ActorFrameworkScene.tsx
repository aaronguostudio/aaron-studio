import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { WordTiming } from "../types";

interface ActorFrameworkSceneProps {
  imageFile: string;
  currentTimeSec: number;
  audioDuration?: number;
  wordTimings?: WordTiming[];
  children?: React.ReactNode;
}

interface ActorStep {
  letter: "A" | "C" | "T" | "O" | "R";
  label: string;
  detail: string;
  color: string;
  accent: string;
  cue: string;
}

const STEPS: ActorStep[] = [
  {
    letter: "A",
    label: "Action",
    detail: "What work changes?",
    color: "#f3b44e",
    accent: "rgba(243, 180, 78, 0.18)",
    cue: "action",
  },
  {
    letter: "C",
    label: "Context",
    detail: "What must it know?",
    color: "#7fc7d9",
    accent: "rgba(127, 199, 217, 0.18)",
    cue: "context",
  },
  {
    letter: "T",
    label: "Trust",
    detail: "Draft, recommend, decide, act?",
    color: "#8fbd83",
    accent: "rgba(143, 189, 131, 0.2)",
    cue: "trust",
  },
  {
    letter: "O",
    label: "Outcome",
    detail: "What proves improvement?",
    color: "#8bb7e8",
    accent: "rgba(139, 183, 232, 0.18)",
    cue: "outcome",
  },
  {
    letter: "R",
    label: "Responsibility",
    detail: "Who owns the learning loop?",
    color: "#e58d71",
    accent: "rgba(229, 141, 113, 0.18)",
    cue: "responsibility",
  },
];

const BRIDGE_POINTS = [
  {
    label: "Map how work moves",
    detail: "before choosing the tool",
    cue: "understanding",
    fallback: 8.5,
  },
  {
    label: "Find the cost shift",
    detail: "where AI changes the loop",
    cue: "cost",
    fallback: 15,
  },
  {
    label: "Make it measurable",
    detail: "useful, safe, and repeatable",
    cue: "useful",
    fallback: 20,
  },
];

const editorialEase = Easing.bezier(0.16, 1, 0.3, 1);

function normalizedWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z]/g, "");
}

function findCueTime(
  cue: string,
  wordTimings: WordTiming[] | undefined,
  fallback: number
): number {
  if (!wordTimings?.length) return fallback;
  const match = wordTimings.find((timing) => normalizedWord(timing.word) === cue);
  return match ? Math.max(0, match.start - 0.2) : fallback;
}

function cardProgress(currentTimeSec: number, startAtSec: number): number {
  return interpolate(currentTimeSec, [startAtSec, startAtSec + 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: editorialEase,
  });
}

function fadeProgress(
  currentTimeSec: number,
  startAtSec: number,
  durationSec = 0.65
): number {
  return interpolate(currentTimeSec, [startAtSec, startAtSec + durationSec], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: editorialEase,
  });
}

function BridgePoint({
  label,
  detail,
  progress,
}: {
  label: string;
  detail: string;
  progress: number;
}) {
  const lift = interpolate(progress, [0, 1], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        alignItems: "center",
        opacity: progress,
        transform: `translateY(${lift}px)`,
      }}
    >
      <div
        style={{
          width: 13,
          height: 13,
          borderRadius: 999,
          background: "#f3b44e",
          boxShadow: "0 0 0 7px rgba(243, 180, 78, 0.18)",
          flex: "0 0 auto",
        }}
      />
      <div>
        <div
          style={{
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: 27,
            lineHeight: 1.05,
            fontWeight: 760,
            color: "#fff8ea",
          }}
        >
          {label}
        </div>
        <div
          style={{
            marginTop: 5,
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: 19,
            lineHeight: 1.15,
            fontWeight: 560,
            color: "rgba(255, 248, 234, 0.72)",
          }}
        >
          {detail}
        </div>
      </div>
    </div>
  );
}

function StepCard({
  step,
  index,
  progress,
  frameworkProgress,
}: {
  step: ActorStep;
  index: number;
  progress: number;
  frameworkProgress: number;
}) {
  const lift = interpolate(progress, [0, 1], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(progress, [0, 1], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const placeholderOpacity =
    frameworkProgress *
    interpolate(progress, [0, 0.45], [0.34, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const connectorOpacity = Math.max(placeholderOpacity * 0.85, progress * 0.8);

  return (
    <div
      style={{
        width: 270,
        minHeight: 310,
        position: "relative",
        flex: "0 0 270px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 22,
          border: `1.5px solid ${step.color}`,
          background: "rgba(255, 252, 243, 0.18)",
          boxShadow: "0 18px 50px rgba(45, 36, 26, 0.08)",
          opacity: placeholderOpacity,
          padding: "28px 24px",
        }}
      >
        <div
          style={{
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: 94,
            lineHeight: 0.9,
            fontWeight: 840,
            color: "rgba(47, 42, 36, 0.24)",
            letterSpacing: 0,
          }}
        >
          {step.letter}
        </div>
        <div
          style={{
            marginTop: 20,
            width: 116,
            height: 12,
            borderRadius: 999,
            background: "rgba(49, 44, 38, 0.14)",
          }}
        />
        <div
          style={{
            marginTop: 76,
            width: 176,
            height: 10,
            borderRadius: 999,
            background: "rgba(49, 44, 38, 0.1)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 22,
          border: `2px solid ${step.color}`,
          background: `linear-gradient(180deg, rgba(255,252,243,0.94), ${step.accent})`,
          boxShadow: `0 24px 70px rgba(20, 16, 10, ${0.12 + progress * 0.1})`,
          padding: "28px 24px",
          opacity: progress * frameworkProgress,
          transform: `translateY(${lift}px) scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.32,
            background:
              "radial-gradient(circle at 25% 18%, rgba(255,255,255,0.9), transparent 26%), linear-gradient(135deg, rgba(255,255,255,0.35), transparent)",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: 108,
              lineHeight: 0.9,
              fontWeight: 860,
              color: "#2f2a24",
              letterSpacing: 0,
            }}
          >
            {step.letter}
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: 28,
              fontWeight: 760,
              color: "#312c26",
            }}
          >
            {step.label}
          </div>
        </div>
        <div
          style={{
            position: "relative",
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: 21,
            lineHeight: 1.25,
            fontWeight: 560,
            color: "rgba(49, 44, 38, 0.76)",
            minHeight: 56,
          }}
        >
          {step.detail}
        </div>
        <div
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            width: 34,
            height: 34,
            borderRadius: 999,
            background: step.color,
            opacity: 0.9,
            transform: `scale(${interpolate(progress, [0, 1], [0.4, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })})`,
          }}
        />
      </div>

      {index < STEPS.length - 1 && (
        <div
          style={{
            position: "absolute",
            right: -54,
            top: 142,
            width: 78,
            height: 4,
            borderRadius: 999,
            background: "rgba(105, 188, 205, 0.72)",
            opacity: frameworkProgress * connectorOpacity,
          }}
        />
      )}
    </div>
  );
}

export const ActorFrameworkScene: React.FC<ActorFrameworkSceneProps> = ({
  imageFile,
  currentTimeSec,
  audioDuration = 34,
  wordTimings,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 90, mass: 0.8 },
  });

  const actorCueTime = findCueTime(
    "actor",
    wordTimings,
    Math.max(7, audioDuration * 0.42)
  );
  const frameworkStart = Math.max(0, actorCueTime - 1.2);
  const frameworkProgress = fadeProgress(currentTimeSec, frameworkStart, 0.85);
  const bridgeOpacity = Math.min(
    fadeProgress(currentTimeSec, 0.2, 0.9),
    interpolate(
      currentTimeSec,
      [frameworkStart - 0.8, frameworkStart + 0.45],
      [1, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: editorialEase,
      }
    )
  );

  const imageOpacity = interpolate(
    currentTimeSec,
    [frameworkStart - 0.8, frameworkStart + 1.2],
    [0.95, 0.24],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: editorialEase,
    }
  );
  const imageBlur = interpolate(
    currentTimeSec,
    [frameworkStart - 0.6, frameworkStart + 1],
    [0, 1.2],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const revealTimes = STEPS.map((step, index) => {
    const cueTime = findCueTime(
      step.cue,
      wordTimings,
      actorCueTime + 1.5 + index * 2.1
    );

    return index === 0 ? Math.min(cueTime, actorCueTime + 0.35) : cueTime;
  });
  const finalReveal = revealTimes[revealTimes.length - 1] ?? actorCueTime + 8;
  const feedbackProgress = interpolate(
    currentTimeSec,
    [finalReveal + 1.0, finalReveal + 3.1],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: editorialEase,
    }
  );

  const titleOpacity = interpolate(
    currentTimeSec,
    [frameworkStart + 0.1, frameworkStart + 0.95],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const subtitleOpacity = interpolate(
    currentTimeSec,
    [finalReveal + 2.2, finalReveal + 4.1],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const bridgePointTimes = BRIDGE_POINTS.map((point) =>
    findCueTime(point.cue, wordTimings, Math.min(point.fallback, frameworkStart - 2))
  );

  return (
    <AbsoluteFill style={{ background: "#1f2420", overflow: "hidden" }}>
      <AbsoluteFill>
        <Img
          src={staticFile(imageFile)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imageOpacity,
            filter: `saturate(0.9) blur(${imageBlur}px)`,
            transform: `scale(${interpolate(intro, [0, 1], [1.035, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })})`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(9, 11, 9, 0.72), rgba(9, 11, 9, 0.18) 54%, rgba(9, 11, 9, 0.1))",
          opacity: bridgeOpacity,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(255,250,238,0.94), rgba(239,230,213,0.9))",
          opacity: frameworkProgress,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 104,
          top: 92,
          width: 720,
          opacity: bridgeOpacity,
          transform: `translateY(${interpolate(bridgeOpacity, [0, 1], [18, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px)`,
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ fontSize: 29, fontWeight: 740, color: "#7fd1df" }}>
          WORKFLOW ENGINEERING
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 68,
            lineHeight: 0.98,
            fontWeight: 850,
            color: "#fff8ea",
            letterSpacing: 0,
          }}
        >
          Turn AI into an operating loop
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 27,
            lineHeight: 1.28,
            fontWeight: 560,
            color: "rgba(255, 248, 234, 0.76)",
          }}
        >
          The durable skill is not the prompt. It is the work design around the
          model.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 108,
          bottom: 178,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          opacity: bridgeOpacity,
        }}
      >
        {BRIDGE_POINTS.map((point, index) => (
          <BridgePoint
            key={point.label}
            label={point.label}
            detail={point.detail}
            progress={
              bridgeOpacity *
              fadeProgress(currentTimeSec, bridgePointTimes[index] ?? point.fallback, 0.65)
            }
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 106,
          top: 76,
          opacity: titleOpacity,
          transform: `translateY(${interpolate(titleOpacity, [0, 1], [18, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px)`,
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          color: "#2d2922",
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 720, color: "#338a9a" }}>
          DEPLOYMENT-NATIVE LENS
        </div>
        <div style={{ marginTop: 6, fontSize: 54, fontWeight: 820 }}>
          ACTOR turns AI into operating capacity
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 106,
          right: 106,
          top: 278,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: 26,
          opacity: frameworkProgress,
        }}
      >
        {STEPS.map((step, index) => (
          <StepCard
            key={step.letter}
            step={step}
            index={index}
            progress={cardProgress(currentTimeSec, revealTimes[index])}
            frameworkProgress={frameworkProgress}
          />
        ))}
      </div>

      <svg
        viewBox="0 0 1920 1080"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: feedbackProgress * frameworkProgress,
        }}
      >
        <path
          d="M 1580 720 C 1450 915, 470 915, 330 720"
          fill="none"
          stroke="#d28a37"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${interpolate(feedbackProgress, [0, 1], [0, 1180], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })} 1180`}
        />
        <path
          d="M 330 720 L 356 692 L 366 732 Z"
          fill="#d28a37"
          opacity={feedbackProgress}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 116,
          right: 116,
          bottom: 178,
          display: "flex",
          justifyContent: "center",
          opacity: subtitleOpacity * frameworkProgress,
        }}
      >
        <div
          style={{
            borderRadius: 999,
            border: "1px solid rgba(65, 55, 42, 0.18)",
            background: "rgba(255, 252, 243, 0.78)",
            boxShadow: "0 18px 50px rgba(45, 36, 26, 0.12)",
            padding: "14px 30px",
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: 25,
            fontWeight: 680,
            color: "#3b352d",
          }}
        >
          Responsibility closes the loop: evidence, evals, runbooks, reusable
          patterns.
        </div>
      </div>

      {children}
    </AbsoluteFill>
  );
};
