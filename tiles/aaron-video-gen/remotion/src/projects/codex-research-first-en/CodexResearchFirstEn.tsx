import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const CODEX_RESEARCH_FIRST_FPS = 60;
export const CODEX_RESEARCH_FIRST_DURATION_FRAMES = Math.round(
  18.5 * CODEX_RESEARCH_FIRST_FPS,
);

const palette = {
  canvas: "#090c0b",
  surface: "#111714",
  paper: "#f1eee6",
  text: "#f7f5ee",
  muted: "#9ca69f",
  signal: "#58d1a3",
  tension: "#ef765f",
  uiCanvas: "#f7f8f5",
  uiSidebar: "#eef0ec",
  uiPanel: "#ffffff",
  uiText: "#1d211f",
  uiMuted: "#6f7772",
  uiBorder: "#dfe4df",
  purple: "#8b79e8",
};

const fontFamily =
  'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const smooth = (
  frame: number,
  start: number,
  duration: number,
  from = 0,
  to = 1,
) =>
  interpolate(frame, [start, start + duration], [from, to], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const fade = (
  frame: number,
  start: number,
  duration: number,
  from = 0,
  to = 1,
) =>
  interpolate(frame, [start, start + duration], [from, to], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const SoftMark: React.FC<{size?: number}> = ({size = 48}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background:
        "radial-gradient(circle at 34% 32%, #a8c8ff 0%, #8583f1 34%, #6f57cd 60%, #182a3b 100%)",
      boxShadow: "0 0 40px rgba(124, 112, 235, 0.3)",
      flex: "0 0 auto",
    }}
  />
);

const GitHubMark: React.FC<{size?: number}> = ({size = 42}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "#151917",
      color: "#fff",
      display: "grid",
      placeItems: "center",
      fontSize: size * 0.38,
      fontWeight: 760,
      letterSpacing: "-0.06em",
    }}
  >
    GH
  </div>
);

const Check: React.FC<{size?: number; color?: string}> = ({
  size = 18,
  color = palette.signal,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12.5L9.1 16.5L19 6.8"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HookScene: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: palette.canvas,
      color: palette.text,
      padding: "76px 108px 72px",
      fontFamily,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.28,
        backgroundImage:
          "linear-gradient(rgba(88,209,163,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(88,209,163,0.08) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    />
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{display: "flex", alignItems: "center", gap: 18}}>
        <SoftMark size={48} />
        <div>
          <div style={{fontSize: 20, fontWeight: 760, letterSpacing: "0.04em"}}>
            AARON GUO
          </div>
          <div style={{fontSize: 16, color: palette.muted, marginTop: 5}}>
            AI-NATIVE BUILDER · HUMAN-FIRST THINKER
          </div>
        </div>
      </div>
      <div
        style={{
          border: "1px solid rgba(88,209,163,0.45)",
          color: palette.signal,
          padding: "10px 14px",
          fontSize: 16,
          fontWeight: 760,
          letterSpacing: "0.08em",
        }}
      >
        BUILD NOTE 01
      </div>
    </div>
    <div
      style={{
        position: "relative",
        marginTop: 168,
        maxWidth: 1500,
        fontSize: 112,
        lineHeight: 0.96,
        fontWeight: 820,
        letterSpacing: "-0.055em",
      }}
    >
      STOP ASKING CODEX
      <br />
      TO <span style={{color: palette.tension}}>CODE FIRST.</span>
    </div>
    <div
      style={{
        position: "absolute",
        left: 108,
        right: 108,
        bottom: 70,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        color: palette.muted,
        fontSize: 22,
      }}
    >
      <div>Research the proven patterns before choosing the architecture.</div>
      <div style={{color: palette.signal, fontWeight: 740}}>18.5 SEC DEMO</div>
    </div>
  </AbsoluteFill>
);

const Sidebar: React.FC<{active: "plugins" | "task"}> = ({active}) => {
  const nav = [
    ["＋", "New task", "task"],
    ["◇", "Code review", "review"],
    ["⌁", "Automations", "automations"],
    ["⌘", "Skills", "skills"],
    ["⬡", "Plugins", "plugins"],
  ] as const;
  return (
    <div
      style={{
        width: 294,
        background: palette.uiSidebar,
        borderRight: "1px solid " + palette.uiBorder,
        padding: "24px 18px",
        color: palette.uiText,
        boxSizing: "border-box",
      }}
    >
      <div style={{display: "flex", alignItems: "center", gap: 12, padding: "4px 10px 28px"}}>
        <SoftMark size={30} />
        <div style={{fontSize: 24, fontWeight: 760}}>Codex</div>
      </div>
      <div style={{display: "grid", gap: 6}}>
        {nav.map(([icon, label, id]) => {
          const isActive = active === id;
          return (
            <div
              key={id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                height: 46,
                padding: "0 12px",
                background: isActive ? "#dde1dc" : "transparent",
                border: isActive ? "1px solid #d3d8d2" : "1px solid transparent",
                borderRadius: 6,
                fontSize: 19,
                fontWeight: isActive ? 700 : 540,
              }}
            >
              <span style={{width: 22, color: isActive ? palette.uiText : palette.uiMuted}}>
                {icon}
              </span>
              {label}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 40,
          padding: "0 12px 12px",
          color: palette.uiMuted,
          fontSize: 14,
          fontWeight: 740,
          letterSpacing: "0.09em",
        }}
      >
        RECENT TASKS
      </div>
      <div style={{display: "grid", gap: 4}}>
        {["Agent workflow research", "Map a product brief", "Audit a launch plan"].map(
          (item, index) => (
            <div
              key={item}
              style={{
                padding: "11px 12px",
                fontSize: 16,
                color: index === 0 && active === "task" ? palette.uiText : palette.uiMuted,
                fontWeight: index === 0 && active === "task" ? 700 : 500,
              }}
            >
              {item}
            </div>
          ),
        )}
      </div>
      <div
        style={{
          position: "absolute",
          left: 28,
          bottom: 28,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 16,
          color: palette.uiMuted,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            background: "#dce3dc",
            color: palette.uiText,
            fontWeight: 760,
          }}
        >
          A
        </div>
        Aaron
      </div>
    </div>
  );
};

const WindowFrame: React.FC<{
  active: "plugins" | "task";
  children: React.ReactNode;
}> = ({active, children}) => (
  <AbsoluteFill
    style={{
      background: "#0c100e",
      padding: 32,
      fontFamily,
      color: palette.uiText,
    }}
  >
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: palette.uiCanvas,
        border: "1px solid #252a27",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 28px 90px rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          height: 52,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid " + palette.uiBorder,
          background: "#f4f5f2",
          position: "relative",
          zIndex: 4,
        }}
      >
        <div style={{display: "flex", gap: 10, marginLeft: 18}}>
          {["#f06b5f", "#e8bd58", "#59bd72"].map((color) => (
            <div key={color} style={{width: 13, height: 13, borderRadius: "50%", background: color}} />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 15,
            color: palette.uiMuted,
            fontWeight: 620,
          }}
        >
          Codex · Agent workflow research
        </div>
        <div
          style={{
            marginLeft: "auto",
            marginRight: 18,
            border: "1px solid #cad2ca",
            color: palette.uiMuted,
            padding: "7px 10px",
            fontSize: 12,
            fontWeight: 760,
            letterSpacing: "0.07em",
            background: "rgba(255,255,255,0.8)",
          }}
        >
          RECREATED DEMO · SOURCE-BACKED
        </div>
      </div>
      <div style={{display: "flex", height: "calc(100% - 52px)", position: "relative"}}>
        <Sidebar active={active} />
        <div style={{position: "relative", flex: 1, overflow: "hidden"}}>{children}</div>
      </div>
    </div>
  </AbsoluteFill>
);

const Cursor: React.FC<{x: number; y: number; click?: number}> = ({x, y, click = 0}) => (
  <div style={{position: "absolute", left: x, top: y, zIndex: 20, pointerEvents: "none"}}>
    <div
      style={{
        position: "absolute",
        left: -14,
        top: -14,
        width: 34,
        height: 34,
        borderRadius: "50%",
        border: "2px solid rgba(88,209,163,0.7)",
        opacity: click,
        transform: "scale(" + (1 + click * 0.55) + ")",
      }}
    />
    <svg width="30" height="38" viewBox="0 0 30 38" fill="none">
      <path
        d="M3 2L25 23H14L9 34L3 31V2Z"
        fill="#151917"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const ConnectorScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const click = 1 - Math.abs(smooth(localFrame, 56, 9, -1, 1));
  return (
    <WindowFrame active="plugins">
      <div style={{padding: "72px 88px"}}>
        <div style={{fontSize: 16, color: palette.uiMuted, marginBottom: 30}}>
          Plugins&nbsp;&nbsp;/&nbsp;&nbsp;GitHub
        </div>
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <div style={{display: "flex", gap: 18, alignItems: "center"}}>
            <GitHubMark size={54} />
            <div>
              <div style={{fontSize: 48, fontWeight: 800, letterSpacing: "-0.035em"}}>GitHub</div>
              <div style={{fontSize: 20, color: palette.uiMuted, marginTop: 7}}>
                Inspect repositories, issues, pull requests, and code.
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#e8f6ef",
              color: "#1f6c4e",
              border: "1px solid #b8dfcc",
              padding: "13px 18px",
              borderRadius: 6,
              fontSize: 18,
              fontWeight: 760,
            }}
          >
            <Check size={20} color="#2b8b64" /> Connected
          </div>
        </div>
        <div
          style={{
            marginTop: 62,
            background: palette.uiPanel,
            border: "1px solid " + palette.uiBorder,
            borderRadius: 7,
            padding: "32px 34px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 30,
          }}
        >
          <div>
            <div style={{fontSize: 16, color: palette.uiMuted, fontWeight: 740}}>CONNECTION</div>
            <div style={{fontSize: 26, fontWeight: 760, marginTop: 12}}>Available to this workspace</div>
            <div style={{fontSize: 18, color: palette.uiMuted, marginTop: 10, lineHeight: 1.5}}>
              Codex can inspect public repositories and return source-linked findings.
            </div>
          </div>
          <div style={{borderLeft: "1px solid " + palette.uiBorder, paddingLeft: 30}}>
            <div style={{fontSize: 16, color: palette.uiMuted, fontWeight: 740}}>BEST FOR</div>
            <div style={{fontSize: 21, lineHeight: 1.65, marginTop: 10}}>
              Architecture research · Proven patterns · Maintenance signals
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 28,
            borderLeft: "4px solid " + palette.purple,
            background: "#f2f0fb",
            padding: "20px 24px",
            fontSize: 21,
            color: "#49435f",
          }}
        >
          Ask Codex to research first — before it creates files or writes code.
        </div>
      </div>
      <Cursor x={1402} y={208} click={Math.max(0, click)} />
    </WindowFrame>
  );
};

const PromptScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const move = smooth(localFrame, 24, 62);
  const x = interpolate(move, [0, 1], [860, 1380]);
  const y = interpolate(move, [0, 1], [760, 794]);
  const click = Math.max(0, 1 - Math.abs(smooth(localFrame, 92, 8, -1, 1)));
  const sent = fade(localFrame, 100, 20);
  return (
    <WindowFrame active="task">
      <div
        style={{
          height: 70,
          display: "flex",
          alignItems: "center",
          padding: "0 48px",
          borderBottom: "1px solid " + palette.uiBorder,
          background: "rgba(255,255,255,0.75)",
        }}
      >
        <div style={{fontSize: 22, fontWeight: 760}}>Research AI agent workflow platforms</div>
        <div style={{marginLeft: "auto", fontSize: 15, color: palette.uiMuted}}>main · local workspace</div>
      </div>
      <div style={{padding: "70px 70px 0"}}>
        <div style={{display: "flex", justifyContent: "center"}}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: palette.uiMuted,
              fontSize: 17,
            }}
          >
            <SoftMark size={34} />
            Ready to work in this project
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 74,
          right: 74,
          bottom: 70,
          background: palette.uiPanel,
          border: "1px solid #cfd6cf",
          borderRadius: 7,
          padding: "26px 82px 24px 28px",
          boxShadow: "0 16px 44px rgba(30,40,34,0.08)",
        }}
      >
        <div style={{fontSize: 25, lineHeight: 1.48, color: palette.uiText, maxWidth: 1270}}>
          Find 5 strong open-source projects similar to an AI agent workflow platform. Compare their
          architecture and tradeoffs, then recommend an approach. Don’t write code yet.
        </div>
        <div
          style={{
            marginTop: 24,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: palette.uiMuted,
            fontSize: 15,
          }}
        >
          <span style={{border: "1px solid " + palette.uiBorder, padding: "7px 9px", borderRadius: 5}}>
            GitHub connected
          </span>
          <span>No files will be changed</span>
        </div>
        <div
          style={{
            position: "absolute",
            right: 22,
            bottom: 20,
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#151917",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontSize: 24,
            opacity: 1 - sent * 0.35,
          }}
        >
          ↑
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 18,
          textAlign: "center",
          fontSize: 15,
          color: palette.uiMuted,
          opacity: sent,
        }}
      >
        Sending research brief…
      </div>
      <Cursor x={x} y={y} click={click} />
    </WindowFrame>
  );
};

const repoRows = [
  ["langgenius/dify", "Full-stack AI app platform", "WORKFLOWS · RAG · AGENTS"],
  ["FlowiseAI/Flowise", "Visual agent builder", "NODE-FIRST · TYPESCRIPT"],
  ["langflow-ai/langflow", "Agent and workflow graphs", "PYTHON-NATIVE · COMPONENTS"],
  ["n8n-io/n8n", "Workflow automation runtime", "EXECUTION · INTEGRATIONS"],
  ["langfuse/langfuse", "LLM observability and evals", "TRACES · METRICS · PROMPTS"],
];

const ResearchScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const inspected = Math.min(5, Math.max(0, Math.floor((localFrame - 54) / 66) + 1));
  return (
    <WindowFrame active="task">
      <div
        style={{
          height: 70,
          display: "flex",
          alignItems: "center",
          padding: "0 48px",
          borderBottom: "1px solid " + palette.uiBorder,
          background: "rgba(255,255,255,0.75)",
        }}
      >
        <div style={{fontSize: 22, fontWeight: 760}}>Research AI agent workflow platforms</div>
        <div style={{marginLeft: "auto", display: "flex", gap: 10, alignItems: "center", color: palette.uiMuted}}>
          <GitHubMark size={26} /> GitHub research
        </div>
      </div>
      <div style={{padding: "34px 62px 0"}}>
        <div
          style={{
            marginLeft: "auto",
            width: 940,
            background: "#eceeea",
            border: "1px solid #dde1dc",
            borderRadius: 7,
            padding: "16px 20px",
            fontSize: 17,
            lineHeight: 1.45,
            color: "#4f5752",
          }}
        >
          Find 5 strong open-source projects. Compare architecture and tradeoffs, then recommend an
          approach. Don’t write code yet.
        </div>
        <div style={{display: "flex", alignItems: "center", gap: 14, marginTop: 24}}>
          <SoftMark size={34} />
          <div>
            <div style={{fontSize: 22, fontWeight: 760}}>Researching open-source implementations</div>
            <div style={{fontSize: 15, color: palette.uiMuted, marginTop: 4}}>
              {inspected} of 5 repositories inspected · source links retained
            </div>
          </div>
          <div style={{marginLeft: "auto", color: "#2a7c5a", fontSize: 16, fontWeight: 720}}>
            No code changes
          </div>
        </div>
        <div
          style={{
            marginTop: 18,
            background: palette.uiPanel,
            border: "1px solid " + palette.uiBorder,
            borderRadius: 7,
            overflow: "hidden",
          }}
        >
          {repoRows.map(([name, description, tags], index) => {
            const start = 42 + index * 66;
            const active = smooth(localFrame, start, 18);
            return (
              <div
                key={name}
                style={{
                  position: "relative",
                  height: 91,
                  borderBottom:
                    index === repoRows.length - 1 ? "none" : "1px solid " + palette.uiBorder,
                  display: "grid",
                  gridTemplateColumns: "58px 330px 1fr 190px",
                  alignItems: "center",
                  padding: "0 24px",
                  color: active > 0.02 ? palette.uiText : "#b4bbb6",
                  background: active > 0.02 ? "#fff" : "#fbfcfa",
                }}
              >
                <div style={{opacity: 0.28 + active * 0.72}}>
                  <GitHubMark size={34} />
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 740,
                    opacity: 0.28 + active * 0.72,
                    transform: "translateY(" + (1 - active) * 9 + "px)",
                  }}
                >
                  {name}
                </div>
                <div style={{fontSize: 18, color: active > 0.02 ? palette.uiMuted : "#c8ceca", opacity: 0.28 + active * 0.72}}>
                  {description}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: active > 0.02 ? "#3c765f" : "#c4cac6",
                    fontWeight: 760,
                    letterSpacing: "0.045em",
                    textAlign: "right",
                    opacity: 0.28 + active * 0.72,
                  }}
                >
                  {active > 0.98 ? tags : "PENDING"}
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background: palette.signal,
                    opacity: active,
                  }}
                />
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 15,
            display: "flex",
            gap: 10,
            alignItems: "center",
            color: palette.uiMuted,
            fontSize: 16,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: inspected === 5 ? palette.signal : palette.purple,
            }}
          />
          {inspected === 5 ? "Comparing architecture and tradeoffs…" : "Reading repositories…"}
        </div>
      </div>
    </WindowFrame>
  );
};

const RecommendationScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const card = smooth(localFrame, 8, 28);
  const result = smooth(localFrame, 62, 28);
  return (
    <WindowFrame active="task">
      <div
        style={{
          height: 70,
          display: "flex",
          alignItems: "center",
          padding: "0 48px",
          borderBottom: "1px solid " + palette.uiBorder,
          background: "rgba(255,255,255,0.75)",
        }}
      >
        <div style={{fontSize: 22, fontWeight: 760}}>Research AI agent workflow platforms</div>
        <div style={{marginLeft: "auto", color: "#2a7c5a", fontWeight: 720}}>Research complete</div>
      </div>
      <div style={{padding: "52px 62px"}}>
        <div style={{display: "flex", alignItems: "center", gap: 14}}>
          <SoftMark size={38} />
          <div>
            <div style={{fontSize: 30, fontWeight: 800, letterSpacing: "-0.025em"}}>
              Recommended MVP
            </div>
            <div style={{fontSize: 17, color: palette.uiMuted, marginTop: 4}}>
              A narrow execution core, informed by five proven systems
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 30,
            display: "grid",
            gridTemplateColumns: "1.55fr 0.8fr",
            gap: 22,
          }}
        >
          <div
            style={{
              background: palette.uiPanel,
              border: "1px solid " + palette.uiBorder,
              borderRadius: 7,
              padding: "30px 32px",
              opacity: 0.42 + card * 0.58,
              transform: "translateY(" + (1 - card) * 7 + "px)",
            }}
          >
            {[
              ["01", "Visual graph editor", "Start with a legible node model and explicit inputs and outputs."],
              ["02", "Versioned execution runtime", "Make every run repeatable before adding more surface area."],
              ["03", "Observability from day one", "Store traces, cost, latency, and outputs as first-class data."],
            ].map(([number, title, body], index) => (
              <div
                key={number}
                style={{
                  display: "grid",
                  gridTemplateColumns: "62px 330px 1fr",
                  alignItems: "center",
                  minHeight: 104,
                  borderBottom: index === 2 ? "none" : "1px solid " + palette.uiBorder,
                }}
              >
                <div style={{color: palette.signal, fontSize: 18, fontWeight: 800}}>{number}</div>
                <div style={{fontSize: 23, fontWeight: 760}}>{title}</div>
                <div style={{fontSize: 17, color: palette.uiMuted, lineHeight: 1.45}}>{body}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              background: "#f0f4f0",
              border: "1px solid #d9e2da",
              borderRadius: 7,
              padding: "28px 28px",
              opacity: 0.42 + card * 0.58,
              transform: "translateY(" + (1 - card) * 7 + "px)",
            }}
          >
            <div style={{fontSize: 14, color: palette.uiMuted, fontWeight: 780, letterSpacing: "0.08em"}}>
              BORROW
            </div>
            <div style={{fontSize: 19, lineHeight: 1.55, marginTop: 10}}>
              Dify’s product breadth
              <br />
              Flowise’s visual clarity
              <br />
              n8n’s execution discipline
              <br />
              Langfuse’s trace model
            </div>
            <div
              style={{
                marginTop: 26,
                paddingTop: 20,
                borderTop: "1px solid #d5ddd6",
                fontSize: 14,
                color: palette.uiMuted,
                fontWeight: 780,
                letterSpacing: "0.08em",
              }}
            >
              DELAY
            </div>
            <div style={{fontSize: 18, lineHeight: 1.5, marginTop: 9, color: "#4c554f"}}>
              Team collaboration until the execution model is stable.
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 22,
            background: "#e7f6ee",
            border: "1px solid #b9dfcc",
            color: "#205e47",
            borderRadius: 6,
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 18,
            fontWeight: 700,
            opacity: 0.3 + result * 0.7,
          }}
        >
          <Check size={22} color="#2b8b64" /> No files changed · Ready for your approval
        </div>
      </div>
    </WindowFrame>
  );
};

const EndScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const settle = smooth(localFrame, 8, 28);
  return (
    <AbsoluteFill
      style={{
        background: palette.canvas,
        color: palette.text,
        fontFamily,
        padding: "76px 108px 68px",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 86,
          top: 72,
          width: 620,
          height: 620,
          opacity: 0.2,
          background:
            "radial-gradient(circle, rgba(88,209,163,0.32) 0%, rgba(118,107,235,0.16) 36%, transparent 70%)",
        }}
      />
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{display: "flex", alignItems: "center", gap: 16}}>
          <SoftMark size={50} />
          <div>
            <div style={{fontSize: 20, fontWeight: 760, letterSpacing: "0.04em"}}>AARON GUO</div>
            <div style={{fontSize: 16, color: palette.muted, marginTop: 5}}>AI-NATIVE BUILDER</div>
          </div>
        </div>
        <div style={{fontSize: 16, color: palette.muted}}>Human-first thinker.</div>
      </div>
      <div
        style={{
          marginTop: 186,
          opacity: 0.82 + settle * 0.18,
          transform: "translateY(" + (1 - settle) * 14 + "px)",
        }}
      >
        <div style={{fontSize: 108, lineHeight: 0.98, fontWeight: 830, letterSpacing: "-0.055em"}}>
          <span style={{color: palette.signal}}>RESEARCH FIRST.</span>
          <br />
          CODE SECOND.
        </div>
        <div style={{fontSize: 26, color: palette.muted, marginTop: 34}}>
          Let proven systems sharpen the plan before implementation begins.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 108,
          right: 108,
          bottom: 66,
          height: 2,
          background: "linear-gradient(90deg, " + palette.signal + " 0%, rgba(88,209,163,0.08) 58%, transparent 100%)",
          transformOrigin: "left center",
          transform: "scaleX(" + settle + ")",
        }}
      />
    </AbsoluteFill>
  );
};

export const CodexResearchFirstEn: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hookEnd = Math.round(1.5 * fps);
  const connectorEnd = Math.round(3.2 * fps);
  const promptEnd = Math.round(5.6 * fps);
  const researchEnd = Math.round(12.6 * fps);
  const recommendationEnd = Math.round(16.2 * fps);

  let scene: React.ReactNode;
  if (frame < hookEnd) {
    scene = <HookScene />;
  } else if (frame < connectorEnd) {
    scene = <ConnectorScene localFrame={frame - hookEnd} />;
  } else if (frame < promptEnd) {
    scene = <PromptScene localFrame={frame - connectorEnd} />;
  } else if (frame < researchEnd) {
    scene = <ResearchScene localFrame={frame - promptEnd} />;
  } else if (frame < recommendationEnd) {
    scene = <RecommendationScene localFrame={frame - researchEnd} />;
  } else {
    scene = <EndScene localFrame={frame - recommendationEnd} />;
  }

  return (
    <AbsoluteFill style={{background: palette.canvas}}>
      <Audio src={staticFile("codex-research-first-en/original-ui-pulse.wav")} volume={1} />
      {scene}
    </AbsoluteFill>
  );
};
