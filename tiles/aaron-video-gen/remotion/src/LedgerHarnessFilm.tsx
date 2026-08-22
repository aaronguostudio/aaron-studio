import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  harnessScenes,
  harnessChapters,
  NARRATION_END_SEC,
  END_CARD_SEC,
  FILM_END_SEC,
} from "./data/harnessTeardownScenes";
import { ledgerCaptions } from "./data/harnessTeardownCaptions";

/**
 * LedgerHarnessFilm — "What I Learned From DeepSeek's Harness" (v2)
 * Graphite Ledger Editorial (ledger-editorial-v0.1).
 * The film behaves like the append-only session log it describes: chapters
 * append as mono ledger lines, nothing is erased, model-visible moments carry
 * the single cyan accent. Storyboard: src/content/blogs/2026-08-19/video-storyboard.json.
 */

export const LEDGER_HARNESS_FPS = 30;
/** Approved cover card shown before the film begins (the past miss we don't repeat). */
export const COVER_CARD_SEC = 3.0;

export const ledgerHarnessFilmDurationFrames = (): number =>
  Math.round((FILM_END_SEC + COVER_CARD_SEC) * LEDGER_HARNESS_FPS);

// ---------------------------------------------------------------- tokens
const T = {
  canvas: "#f4f1e9",
  paper: "#faf8f2",
  ink: "#2b2e2c",
  muted: "#8a8f8a",
  faint: "#c9c8bf",
  signal: "#4fb3bf",
  tension: "#c96f5a",
  inkPage: "#232624",
  serif: "Georgia, 'Times New Roman', serif",
  sans: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
  mono: "'SF Mono', Menlo, 'Courier New', monospace",
};

const SAFE_L = 112;
const SAFE_R = 112;
const SAFE_W = 1920 - SAFE_L - SAFE_R;
const CAPTION_TOP = 1080 - 154;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

const P = (
  frame: number,
  start: number,
  end: number,
  easing = easeOut,
): number =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** seconds → local frames at film fps */
const S = (sec: number): number => Math.round(sec * LEDGER_HARNESS_FPS);

/** settle: opacity + 10px vertical settle from a progress value */
const settle = (p: number): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * 10}px)`,
});

// ---------------------------------------------------------------- shared
const Porcelain: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: T.canvas }}>{children}</AbsoluteFill>
);

const MarginLabel: React.FC<{ text: string; y?: number; p?: number }> = ({
  text,
  y = 856,
  p = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: SAFE_L,
      top: y,
      fontFamily: T.mono,
      fontSize: 18,
      letterSpacing: 2,
      color: T.muted,
      ...settle(p),
    }}
  >
    {text}
  </div>
);

/** One mono ledger row. state: archive | active | visible(cyan) | refused(coral) */
const LedgerRow: React.FC<{
  text: string;
  state?: "archive" | "active" | "visible" | "refused";
  p?: number;
  width?: number;
  fontSize?: number;
}> = ({ text, state = "active", p = 1, width = SAFE_W, fontSize = 24 }) => {
  const color =
    state === "visible"
      ? T.signal
      : state === "refused"
        ? T.tension
        : state === "archive"
          ? T.faint
          : T.ink;
  return (
    <div
      style={{
        width,
        fontFamily: T.mono,
        fontSize,
        lineHeight: 1.7,
        color,
        borderBottom: `1px solid ${state === "archive" ? "#e4e1d6" : "#d8d5c9"}`,
        whiteSpace: "nowrap",
        overflow: "hidden",
        ...settle(p),
      }}
    >
      {text}
    </div>
  );
};

const SerifTitle: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  p?: number;
  align?: "left" | "center";
}> = ({ children, size = 62, color = T.ink, p = 1, align = "left" }) => (
  <div
    style={{
      fontFamily: T.serif,
      fontSize: size,
      lineHeight: 1.12,
      color,
      textAlign: align,
      ...settle(p),
    }}
  >
    {children}
  </div>
);

const SansBody: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  p?: number;
}> = ({ children, size = 26, color = T.muted, p = 1 }) => (
  <div
    style={{
      fontFamily: T.sans,
      fontSize: size,
      lineHeight: 1.5,
      color,
      ...settle(p),
    }}
  >
    {children}
  </div>
);

/** Full-slot evidence still with margin label; static, crossfade entry only. */
const EvidenceStill: React.FC<{
  src: string;
  label: string;
  f: number;
}> = ({ src, label, f }) => {
  const enter = P(f, 0, 14, easeInOut);
  return (
    <Porcelain>
      <div
        style={{
          position: "absolute",
          left: SAFE_L,
          top: 96,
          width: SAFE_W,
          height: 730,
          opacity: enter,
          boxShadow: "0 18px 60px rgba(43,46,44,0.18)",
        }}
      >
        <Img
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <MarginLabel text={label} p={P(f, 8, 22)} />
    </Porcelain>
  );
};

/** SVG connector that draws with progress; arrowhead appears at p >= 0.98. */
const Connector: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  p: number;
  color?: string;
}> = ({ x1, y1, x2, y2, p, color = T.ink }) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const head = p >= 0.98 ? 1 : 0;
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={3}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
      <g
        opacity={head}
        transform={`translate(${x2}, ${y2}) rotate(${angle})`}
      >
        <path d="M -14 -7 L 0 0 L -14 7 Z" fill={color} />
      </g>
    </g>
  );
};

/** Node box for map scenes. */
const MapNode: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  p?: number;
  accent?: "none" | "signal" | "tension";
  mono?: boolean;
}> = ({ x, y, w, h, label, p = 1, accent = "none", mono = false }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: T.paper,
      border: `2px solid ${accent === "signal" ? T.signal : accent === "tension" ? T.tension : T.ink}`,
      borderRadius: 4,
      fontFamily: mono ? T.mono : T.sans,
      fontSize: 24,
      fontWeight: 600,
      color: accent === "tension" ? T.tension : T.ink,
      textAlign: "center",
      padding: "0 16px",
      boxShadow: "0 6px 18px rgba(43,46,44,0.08)",
      ...settle(p),
    }}
  >
    {label}
  </div>
);

// ---------------------------------------------------------------- chrome
/** Persistent header: AARON GUO + current chapter ledger marker (appends). */
const HeaderRail: React.FC<{ absSec: number }> = ({ absSec }) => {
  const current = [...harnessChapters].reverse().find((c) => absSec >= c.at);
  if (!current) return null;
  const sinceAppend = absSec - current.at;
  const p = P(sinceAppend * LEDGER_HARNESS_FPS, 0, 18, easeInOut);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_L,
        right: SAFE_R,
        top: 34,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}
    >
      <div
        style={{
          fontFamily: T.sans,
          fontSize: 19,
          letterSpacing: 4,
          fontWeight: 700,
          color: T.ink,
        }}
      >
        AARON GUO
      </div>
      <div
        style={{
          fontFamily: T.mono,
          fontSize: 18,
          letterSpacing: 2,
          color: T.muted,
          overflow: "hidden",
        }}
      >
        <div style={{ transform: `translateY(${(1 - p) * 16}px)`, opacity: p }}>
          {current.seq} · {current.label}
        </div>
      </div>
    </div>
  );
};

/** Phrase captions in the protected bottom zone. */
const CaptionBar: React.FC<{ absSec: number }> = ({ absSec }) => {
  const active = ledgerCaptions.find(
    (c) => absSec >= c.start && absSec <= c.end + 0.12,
  );
  if (!active) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: CAPTION_TOP,
        height: 154,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          padding: "10px 26px",
          borderRadius: 6,
          backgroundColor: "rgba(43,46,44,0.82)",
          color: "#f6f4ec",
          fontFamily: T.sans,
          fontSize: 31,
          lineHeight: 1.35,
          textAlign: "center",
        }}
      >
        {active.text}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- scenes
type SceneFC = React.FC<{ f: number; dur: number }>;

/** s01 — cover-hero identity + 47/67 statement (frame zero carries identity). */
const S01ColdOpen: SceneFC = ({ f }) => {
  const brand = 1; // readable at frame zero per cover-hero contract
  const n47 = P(f, S(0.8), S(2.2));
  const n67 = P(f, S(6.0), S(7.4));
  const cost = P(f, S(14.0), S(15.4));
  return (
    <Porcelain>
      <div style={{ position: "absolute", left: SAFE_L, top: 150, opacity: brand }}>
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 20,
            letterSpacing: 3,
            color: T.muted,
          }}
        >
          AN ENGINEER'S TEARDOWN · PINNED AT 47f9438
        </div>
        <div style={{ marginTop: 18 }}>
          <SerifTitle size={84}>What I Learned From DeepSeek's Harness</SerifTitle>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE_L,
          top: 470,
          width: SAFE_W,
          display: "flex",
          gap: 120,
          alignItems: "baseline",
        }}
      >
        <div style={{ fontFamily: T.serif, fontSize: 190, color: T.muted, ...settle(n47) }}>
          47<span style={{ fontSize: 84 }}>%</span>
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 190, color: T.ink, ...settle(n67) }}>
          67<span style={{ fontSize: 84 }}>%</span>
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 40, color: T.tension, ...settle(cost) }}>
          cost ×7
        </div>
      </div>
      <MarginLabel text="SAME MODEL · THIRTY REAL TASKS · EIGHT HARNESSES" y={800} p={n47} />
    </Porcelain>
  );
};

/** s02 — you / harness / model system line; the ledger rail debuts. */
const S02InvisibleLayer: SceneFC = ({ f }) => {
  const scaffold = 0.28 + 0.72 * P(f, S(0.9), S(2.2));
  const c1 = P(f, S(3), S(6.5), easeInOut);
  const c2 = P(f, S(6.5), S(10), easeInOut);
  const duty1 = P(f, S(12), S(13.4));
  const duty2 = P(f, S(18), S(19.4));
  const duty3 = P(f, S(23), S(24.4));
  const rail = P(f, S(26), S(28));
  return (
    <Porcelain>
      <svg
        style={{ position: "absolute", inset: 0 }}
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
      >
        <Connector x1={480} y1={400} x2={790} y2={400} p={c1} />
        <Connector x1={1130} y1={400} x2={1440} y2={400} p={c2} />
      </svg>
      <div style={{ opacity: scaffold }}>
        <MapNode x={260} y={355} w={220} h={90} label="you" />
        <MapNode x={790} y={340} w={340} h={120} label="the harness" accent="signal" />
        <MapNode x={1440} y={355} w={220} h={90} label="the model" />
      </div>
      <div style={{ position: "absolute", left: 560, top: 520, width: 800 }}>
        <LedgerRow text="assembles everything the model sees" p={duty1} fontSize={22} />
        <LedgerRow text="runs its tools" p={duty2} fontSize={22} />
        <LedgerRow text="decides when to stop" p={duty3} fontSize={22} />
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 730, width: SAFE_W }}>
        <LedgerRow
          text="SEQ 00 · session opened · append-only"
          state="visible"
          p={rail}
          fontSize={22}
        />
      </div>
      <MarginLabel text="MIT · RELEASED 2026-08-13 · READ END TO END" y={806} p={rail} />
    </Porcelain>
  );
};

/** s03 — Ronacher quotation page. */
const S03Winner: SceneFC = ({ f }) => {
  const attr = P(f, S(0.6), S(1.8));
  const l1 = P(f, S(1.5), S(3.2));
  const l2 = P(f, S(8), S(9.6));
  const l3 = P(f, S(15), S(16.6));
  const focus = P(f, S(27), S(29));
  return (
    <Porcelain>
      <div
        style={{
          position: "absolute",
          left: 240,
          top: 200,
          width: 1440,
          fontFamily: T.serif,
          fontSize: 54,
          lineHeight: 1.35,
          color: T.ink,
        }}
      >
        <div style={settle(l1)}>“I don't think the DeepSeek Harness is perfect —</div>
        <div style={settle(l2)}>but this is the first time something new in this space</div>
        <div style={settle(l3)}>made me want to revisit some of our own choices.”</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 240,
          top: 620,
          opacity: 0.55 + 0.45 * focus,
        }}
      >
        <LedgerRow
          text="ARMIN RONACHER · CO-FOUNDER, EARENDIL (THE COMPANY BEHIND PI)"
          p={attr}
          fontSize={20}
          width={1200}
        />
        <LedgerRow text="THE REGISTER · 2026-08-14" p={attr} fontSize={20} width={1200} />
      </div>
    </Porcelain>
  );
};

/** s04 — method + promise. */
const S04WentInside: SceneFC = ({ f }) => {
  const m1 = P(f, S(0.8), S(2.2));
  const m2 = P(f, S(6), S(7.4));
  const m3 = P(f, S(12), S(13.4));
  const promise = P(f, S(18), S(19.6));
  return (
    <Porcelain>
      <div style={{ position: "absolute", left: SAFE_L, top: 200 }}>
        <SerifTitle size={58} p={m1}>
          So I went inside.
        </SerifTitle>
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 360, width: 1200 }}>
        <LedgerRow text="fourteen analysis passes over the source tree" p={m1} />
        <LedgerRow text="everything pinned to one commit · 47f9438" p={m2} />
        <LedgerRow text="a few hundred claims checked, file by file" p={m3} />
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 640 }}>
        <SerifTitle size={44} color={T.signal} p={promise}>
          Four designs came out the other side.
        </SerifTitle>
      </div>
    </Porcelain>
  );
};

/** s05 — billing ledger: prefix rows + discount column. */
const S05CachingBills: SceneFC = ({ f }) => {
  const rows = [
    "system prompt ................. cached",
    "tool schemas .................. cached",
    "conversation so far ........... cached",
    "the new tail .................. full price",
  ];
  const disc = P(f, S(14), S(16));
  const qual = P(f, S(17), S(18.6));
  return (
    <Porcelain>
      <div style={{ position: "absolute", left: SAFE_L, top: 190 }}>
        <SerifTitle size={54} p={P(f, S(0.8), S(2))}>
          The provider caches what it already read.
        </SerifTitle>
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 350, width: 1300 }}>
        {rows.map((r, i) => (
          <LedgerRow
            key={r}
            text={r}
            state={i === 3 ? "refused" : "active"}
            p={P(f, S(2 + i * 2.5), S(3.4 + i * 2.5))}
          />
        ))}
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 650, ...settle(disc) }}>
        <span style={{ fontFamily: T.serif, fontSize: 72, color: T.signal }}>
          1/50 — 1/120
        </span>
        <span
          style={{ fontFamily: T.sans, fontSize: 24, color: T.muted, marginLeft: 26 }}
        >
          a cache hit vs a miss, at launch-week list prices
        </span>
      </div>
      <MarginLabel text="PRICING DATE-QUALIFIED · CHANGED 2026-08-17" y={796} p={qual} />
    </Porcelain>
  );
};

/** s06 — the lawyer evidence still. */
const S06Lawyer: SceneFC = ({ f }) => (
  <EvidenceStill
    src="harness-teardown/02-metaphor-contract-reread.png"
    label="GENERATED ILLUSTRATION · ONE CHANGED WORD RE-PRICES EVERYTHING AFTER IT"
    f={f}
  />
);

/** s07 — safe and key. */
const S07SafeKey: SceneFC = ({ f }) => (
  <Porcelain>
    <div
      style={{
        position: "absolute",
        left: SAFE_L,
        top: 380,
        width: SAFE_W,
        textAlign: "center",
      }}
    >
      <SerifTitle size={72} align="center" p={P(f, S(0.5), S(1.6))}>
        The provider holds the safe.
      </SerifTitle>
      <div style={{ marginTop: 30 }}>
        <SerifTitle size={72} align="center" color={T.signal} p={P(f, S(2.5), S(3.8))}>
          Your harness holds the key.
        </SerifTitle>
      </div>
    </div>
  </Porcelain>
);

/** s08 — the timestamp that breaks the prefix. */
const S08Timestamp: SceneFC = ({ f }) => {
  const strike = P(f, S(4), S(5.2), easeInOut);
  return (
    <Porcelain>
      <div style={{ position: "absolute", left: SAFE_L, top: 190, width: 1400 }}>
        <div style={{ position: "relative" }}>
          <LedgerRow
            text={'system prompt line 1 · "Current time: 09:32:07"'}
            p={P(f, S(0.7), S(1.8))}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 24,
              width: `${strike * 62}%`,
              borderTop: `4px solid ${T.tension}`,
            }}
          />
        </div>
        {["tool schemas", "conversation history", "everything below the clock"].map(
          (r, i) => (
            <LedgerRow
              key={r}
              text={`${r} ........ re-read at full price`}
              state={P(f, S(7 + i * 1.6), S(7.7 + i * 1.6)) > 0.5 ? "refused" : "archive"}
              p={P(f, S(1.4 + i * 0.4), S(2.4 + i * 0.4))}
            />
          ),
        )}
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 610 }}>
        <SerifTitle size={54} color={T.tension} p={P(f, S(11.5), S(13))}>
          Every request. Full price. Forever.
        </SerifTitle>
      </div>
    </Porcelain>
  );
};

/** s09 — gross margin discipline rows. */
const S09Margin: SceneFC = ({ f }) => (
  <Porcelain>
    <div style={{ position: "absolute", left: SAFE_L, top: 210 }}>
      <SerifTitle size={54} p={P(f, S(0.8), S(2))}>
        They sell the tokens. This is their margin.
      </SerifTitle>
    </div>
    <div style={{ position: "absolute", left: SAFE_L, top: 380, width: 1250 }}>
      <LedgerRow text="no clock in the prompt" p={P(f, S(3), S(4.4))} />
      <LedgerRow text="tool order · fixed, canonical, locale-independent" p={P(f, S(6.5), S(7.9))} />
      <LedgerRow
        text="cache discipline · an invariant with a test, not a hope"
        state="visible"
        p={P(f, S(11), S(12.4))}
      />
    </div>
  </Porcelain>
);

/** s10 — the test that refuses: check column + coral refusal. */
const S10TestRefuses: SceneFC = ({ f, dur }) => {
  const entries = 7;
  const refuse = P(f, S(12), S(13.4), easeInOut);
  const tease = P(f, S(20), S(21.6));
  return (
    <Porcelain>
      <div style={{ position: "absolute", left: SAFE_L, top: 170, width: 1250 }}>
        {Array.from({ length: entries }).map((_, i) => (
          <LedgerRow
            key={i}
            text={`request ${i + 2} · cacheReadTokens > 0 ........ pass`}
            state="active"
            p={0.3 + 0.7 * P(f, S(0.7 + i * 1.4), S(1.6 + i * 1.4))}
            fontSize={22}
          />
        ))}
        <LedgerRow
          text="request 9 · prefix broke ................ REFUSE — build red"
          state="refused"
          p={refuse}
          fontSize={22}
        />
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 660 }}>
        <SerifTitle size={46} p={tease}>
          How can they dare to promise that?
        </SerifTitle>
      </div>
      <MarginLabel text="A LIVE-API TEST, IN CI · RED BEFORE THE MONEY BURNS" y={790} p={refuse} />
    </Porcelain>
  );
};

/** s11 — SIGNATURE: 44 rows accumulate; 3 flip cyan and advance. */
const S11Cascade: SceneFC = ({ f }) => {
  const inkHold = 1 - P(f, S(1.6), S(2.4), easeInOut);
  const kinds = [
    "user/message",
    "assistant/message",
    "tool/result",
    "approval/decision",
    "turn/end",
    "config/patched",
    "billing/usage",
    "compaction/applied",
    "plan/updated",
    "session/forked",
  ];
  const three = new Set([0, 1, 2]);
  const dim = P(f, S(15), S(17), easeInOut);
  const advance = P(f, S(10), S(12.5), easeInOut);
  return (
    <Porcelain>
      {/* 44-row texture: 4 columns x 11 rows */}
      <div
        style={{
          position: "absolute",
          left: SAFE_L,
          top: 130,
          width: SAFE_W,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          columnGap: 28,
        }}
      >
        {Array.from({ length: 44 }).map((_, i) => {
          const isVisible = three.has(i);
          const appear = P(f, S(2 + i * 0.16), S(2.5 + i * 0.16));
          const rowOpacity = isVisible
            ? appear
            : appear * (1 - dim * 0.72);
          return (
            <div
              key={i}
              style={{
                fontFamily: T.mono,
                fontSize: 17,
                lineHeight: 2.0,
                color: isVisible ? T.signal : T.muted,
                borderBottom: "1px solid #e6e3d8",
                opacity: rowOpacity,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {`seq ${101 + i}  ${kinds[i % kinds.length]}`}
            </div>
          );
        })}
      </div>
      {/* the three advanced rows */}
      <div
        style={{
          position: "absolute",
          left: SAFE_L,
          top: 700,
          width: SAFE_W,
          opacity: advance,
          transform: `translateY(${(1 - advance) * 26}px)`,
        }}
      >
        {["user/message → the model sees it", "assistant/message → the model sees it", "tool/result → the model sees it"].map(
          (t) => (
            <LedgerRow key={t} text={t} state="visible" fontSize={26} />
          ),
        )}
      </div>
      {/* ink page punctuation on entry */}
      <AbsoluteFill
        style={{
          backgroundColor: T.inkPage,
          opacity: inkHold,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 30,
            letterSpacing: 6,
            color: "#efece2",
          }}
        >
          SEQ 04 · 44 KINDS OF EVENTS · 3 VISIBLE
        </div>
      </AbsoluteFill>
    </Porcelain>
  );
};

/** s12 — derive → gate → request map. */
const S12DeriveMap: SceneFC = ({ f }) => {
  const scaffold = 0.26 + 0.74 * P(f, S(0.9), S(2));
  const c1 = P(f, S(3), S(7), easeInOut);
  const c2 = P(f, S(7), S(11), easeInOut);
  const c3 = P(f, S(11), S(13.5), easeInOut);
  const strike = P(f, S(14), S(15.4), easeInOut);
  const inter = P(f, S(20), S(21.6));
  return (
    <Porcelain>
      <svg
        style={{ position: "absolute", inset: 0 }}
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
      >
        <Connector x1={430} y1={430} x2={700} y2={430} p={c1} />
        <Connector x1={1000} y1={430} x2={1210} y2={430} p={c2} />
        <Connector x1={1400} y1={430} x2={1590} y2={430} p={c3} />
        {/* mismatch branch, blocked before the gate */}
        <g opacity={strike}>
          <line x1={1100} y1={210} x2={1100} y2={330} stroke={T.tension} strokeWidth={3} strokeDasharray="8 8" />
          <line x1={1040} y1={336} x2={1160} y2={336} stroke={T.tension} strokeWidth={6} />
        </g>
      </svg>
      <div style={{ opacity: scaffold }}>
        <MapNode x={200} y={380} w={230} h={100} label="the ledger" mono />
        <MapNode x={700} y={368} w={300} h={124} label="derived context" accent="signal" />
        <MapNode x={1210} y={380} w={190} h={100} label="gate" />
        <MapNode x={1590} y={380} w={210} h={100} label="request" />
        <MapNode x={1010} y={130} w={180} h={72} label="mismatch" accent="tension" mono />
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 640 }}>
        <SerifTitle size={44} p={inter}>
          That's why the cache test can exist.
        </SerifTitle>
      </div>
      <MarginLabel text="RECOMPUTED BEFORE EVERY REQUEST · REFUSE ON MISMATCH" y={780} p={c3} />
    </Porcelain>
  );
};

/** s13 — replay: scrub the rail. */
const S13Replay: SceneFC = ({ f }) => {
  const rows = [
    "seq 143  tool/result",
    "seq 142  assistant/message",
    "seq 141  user/message",
    "seq 140  assistant/message",
    "seq 139  tool/result",
  ];
  const scrub = P(f, S(4), S(9), easeInOut);
  const target = P(f, S(9), S(10.4));
  const cont = P(f, S(14), S(19), easeInOut);
  return (
    <Porcelain>
      <div style={{ position: "absolute", left: SAFE_L, top: 200, width: 1250 }}>
        {rows.map((r, i) => {
          const highlighted = i === Math.round(scrub * (rows.length - 1));
          return (
            <LedgerRow
              key={r}
              text={r + (highlighted && target > 0.5 ? "   ← exactly what the model saw" : "")}
              state={highlighted ? "visible" : "active"}
              p={P(f, S(0.6 + i * 0.3), S(1.4 + i * 0.3))}
            />
          );
        })}
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 620, width: 1250, opacity: cont }}>
        <LedgerRow text="crash at step 80 → recompute from the same log → continue" state="visible" />
      </div>
    </Porcelain>
  );
};

/** s14 — five lines. */
const S14FiveLines: SceneFC = ({ f }) => (
  <Porcelain>
    <div
      style={{
        position: "absolute",
        left: 420,
        top: 200,
        width: 1080,
        backgroundColor: T.paper,
        border: `1px solid #ddd9cc`,
        borderRadius: 6,
        padding: "48px 64px",
        boxShadow: "0 14px 44px rgba(43,46,44,0.10)",
      }}
    >
      {[
        "before each model call:",
        "  expected = derive(session_log)",
        "  if expected != outgoing.messages:",
        "      refuse()",
        "  send()",
      ].map((l, i) => (
        <div
          key={l}
          style={{
            fontFamily: T.mono,
            fontSize: 30,
            lineHeight: 1.9,
            whiteSpace: "pre",
            color: i === 3 ? T.tension : T.ink,
            ...settle(P(f, S(0.6 + i * 0.9), S(1.5 + i * 0.9))),
          }}
        >
          {l}
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 420, top: 700 }}>
      <SerifTitle size={44} color={T.signal} p={P(f, S(7), S(8.4))}>
        Copy this week.
      </SerifTitle>
    </div>
  </Porcelain>
);

/** s15 — the hanging machine still. */
const S15Machine: SceneFC = ({ f }) => (
  <EvidenceStill
    src="harness-teardown/s05-01-one-row-machine.png"
    label="GENERATED ILLUSTRATION · THE WHOLE MACHINE HANGS FROM ONE ROW"
    f={f}
  />
);

/** s16 — disabled: true. */
const S16DisabledTrue: SceneFC = ({ f }) => {
  const typed = P(f, S(4), S(6.5), easeInOut);
  const compare = P(f, S(12), S(13.6));
  const typedText = "disabled: true".slice(
    0,
    Math.round(typed * "disabled: true".length),
  );
  return (
    <Porcelain>
      <div
        style={{
          position: "absolute",
          left: 380,
          top: 240,
          width: 1160,
          backgroundColor: T.paper,
          border: `1px solid #ddd9cc`,
          borderRadius: 6,
          padding: "44px 60px",
        }}
      >
        <div style={{ fontFamily: T.mono, fontSize: 32, lineHeight: 2, whiteSpace: "pre", color: T.ink }}>
          - id: agent-loop
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 32, lineHeight: 2, whiteSpace: "pre", color: T.muted }}>
          {"  name: '@deepseek-ai/dsh-agent-loop'"}
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 32, lineHeight: 2, whiteSpace: "pre", color: T.tension }}>
          {"  "}
          {typedText}
          <span style={{ opacity: typed > 0 && typed < 1 ? 1 : 0 }}>▍</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 380, top: 620, width: 1200 }}>
        <SansBody size={30} color={T.ink} p={typed}>
          …and there is no agent.
        </SansBody>
        <div style={{ marginTop: 22 }}>
          <SansBody size={26} p={compare}>
            code mode = standard, plus one appended row.
          </SansBody>
        </div>
      </div>
    </Porcelain>
  );
};

/** s17 — 178 green tests, torn. */
const S17GreenHollow: SceneFC = ({ f }) => {
  const tear = P(f, S(8), S(9.6), easeInOut);
  return (
    <Porcelain>
      <div
        style={{
          position: "absolute",
          left: SAFE_L,
          top: 180,
          width: SAFE_W,
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 10,
        }}
      >
        {Array.from({ length: 48 }).map((_, i) => {
          const torn = tear > 0.5 && i >= 18 && i <= 21;
          return (
            <div
              key={i}
              style={{
                height: 44,
                borderRadius: 4,
                backgroundColor: torn ? T.inkPage : T.paper,
                border: `1px solid ${torn ? T.inkPage : "#ddd9cc"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: T.mono,
                fontSize: 18,
                color: torn ? T.canvas : T.muted,
                opacity: P(f, S(0.5 + i * 0.06), S(1 + i * 0.06)),
              }}
            >
              {torn ? "" : "✓"}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 520 }}>
        <SerifTitle size={50} p={P(f, S(2), S(3.4))}>
          178 green tests. 100% coverage.
        </SerifTitle>
        <div style={{ marginTop: 20 }}>
          <SerifTitle size={50} color={T.tension} p={tear}>
            Dead on the first real connection.
          </SerifTitle>
        </div>
      </div>
      <MarginLabel text="TWO SILENT CONFIG CRASHES · THE REPO'S OWN POSTMORTEMS" y={790} p={tear} />
    </Porcelain>
  );
};

/** s18 — 27 checks. */
const S18Checks: SceneFC = ({ f }) => {
  const stampsP = P(f, S(0.7), S(4.5));
  const numP = P(f, S(5), S(7), easeInOut);
  const shown = Math.round(numP * 27);
  return (
    <Porcelain>
      <div
        style={{
          position: "absolute",
          left: SAFE_L,
          top: 210,
          width: SAFE_W,
          display: "flex",
          gap: 14,
        }}
      >
        {Array.from({ length: 27 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 44,
              height: 84,
              borderRadius: 4,
              backgroundColor: T.paper,
              border: "1px solid #d5d2c5",
              borderTop: `6px solid ${T.signal}`,
              opacity: P(f, S(0.5 + i * 0.12), S(1 + i * 0.12)),
            }}
          />
        ))}
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 420 }}>
        <span style={{ fontFamily: T.serif, fontSize: 200, color: T.ink }}>
          {shown}
        </span>
        <span style={{ fontFamily: T.sans, fontSize: 30, color: T.muted, marginLeft: 30 }}>
          pre-release checks
        </span>
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 720 }}>
        <SerifTitle size={40} p={P(f, S(11), S(12.4))}>
          The bill for “everything is configuration” — paid one crash at a time.
        </SerifTitle>
      </div>
    </Porcelain>
  );
};

/** s19 — fleet still + stat rail. */
const S19Fleet: SceneFC = ({ f }) => {
  const enter = P(f, 0, 14, easeInOut);
  const stats = P(f, S(6), S(10));
  return (
    <Porcelain>
      <div
        style={{
          position: "absolute",
          left: SAFE_L,
          top: 96,
          width: SAFE_W,
          height: 640,
          opacity: enter,
          boxShadow: "0 18px 60px rgba(43,46,44,0.18)",
        }}
      >
        <Img
          src={staticFile("harness-teardown/03-metaphor-rules-table-fleet.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 764, width: SAFE_W, opacity: stats }}>
        <LedgerRow
          text="12,293 commits · 64 days · top author 5,235 · worktree/ 210 · codex/ 209"
          fontSize={24}
        />
      </div>
      <MarginLabel text="GENERATED ILLUSTRATION · COUNTED FIRST-PARTY IN THE MERGE HISTORY" y={834} p={stats} />
    </Porcelain>
  );
};

/** s20 — markdown outnumbers TypeScript. */
const S20Markdown: SceneFC = ({ f }) => {
  const b1 = P(f, S(1), S(5), easeInOut);
  const b2 = P(f, S(1.6), S(5.6), easeInOut);
  const claim = P(f, S(7), S(8.4));
  return (
    <Porcelain>
      <div style={{ position: "absolute", left: SAFE_L, top: 260, width: 1300 }}>
        <div style={{ fontFamily: T.mono, fontSize: 24, color: T.ink, marginBottom: 10 }}>
          markdown files
        </div>
        <div
          style={{
            height: 66,
            width: `${b1 * 82}%`,
            backgroundColor: T.ink,
            borderRadius: 4,
          }}
        />
        <div style={{ fontFamily: T.mono, fontSize: 24, color: T.muted, margin: "34px 0 10px" }}>
          typescript files
        </div>
        <div
          style={{
            height: 66,
            width: `${b2 * 80}%`,
            backgroundColor: T.faint,
            borderRadius: 4,
          }}
        />
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 640 }}>
        <SerifTitle size={50} p={claim}>
          Most of this code was not typed by humans.
        </SerifTitle>
      </div>
    </Porcelain>
  );
};

/** s21 — the process OS as ledger entries. */
const S21ProcessOS: SceneFC = ({ f }) => {
  const e1 = P(f, S(0.9), S(2.3));
  const e2 = P(f, S(14), S(15.4));
  const e3 = P(f, S(26), S(27.4));
  const payoff = P(f, S(40), S(41.8));
  return (
    <Porcelain>
      <div style={{ position: "absolute", left: SAFE_L, top: 170, width: 1500 }}>
        <LedgerRow text="DAY 2 · agents follow enforced checks, not prose conventions" p={e1} fontSize={26} />
        <div style={{ height: 26 }} />
        <LedgerRow text="REJECTED/ · frozen with its reasoning · kept while it still blocks a mistake" state="visible" p={e2} fontSize={26} />
        <div style={{ height: 26 }} />
        <LedgerRow text="POSTMORTEM · doesn't count until its check is proven to turn red" p={e3} fontSize={26} />
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 620 }}>
        <SerifTitle size={56} p={payoff}>
          The writer never gets tired.
        </SerifTitle>
      </div>
    </Porcelain>
  );
};

/** s22 — the catch: quietest page. */
const S22Catch: SceneFC = ({ f }) => {
  const focus = P(f, S(8), S(18), easeInOut);
  const idx = Math.round(focus * 2);
  const rows = [
    "the loop guard: reminders only — then silence",
    "read / write / edit: no timeout at all",
    "daily experience: still trails Claude Code and Codex",
  ];
  const verdict = P(f, S(20), S(21.6));
  return (
    <Porcelain>
      <div style={{ position: "absolute", left: 300, top: 280, width: 1320 }}>
        {rows.map((r, i) => (
          <div
            key={r}
            style={{
              fontFamily: T.sans,
              fontSize: 34,
              lineHeight: 2.1,
              color: i === idx ? T.ink : T.muted,
              opacity: 0.5 + 0.5 * P(f, S(0.9 + i * 0.5), S(1.9 + i * 0.5)),
            }}
          >
            {r}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 300, top: 640, ...settle(verdict) }}>
        <SansBody size={28} color={T.ink}>
          If you need work done this week — not your first choice.
        </SansBody>
      </div>
      <MarginLabel text="ALL OF IT FROM DSH'S OWN DOCS" y={780} p={verdict} />
    </Porcelain>
  );
};

/** s23 — moat vs funnel, labeled as Aaron's read. */
const S23MoatFunnel: SceneFC = ({ f }) => {
  const label = 0.4 + 0.6 * P(f, S(0.8), S(2));
  const lane1 = P(f, S(4), S(9), easeInOut);
  const lane2 = P(f, S(13), S(18), easeInOut);
  const band = P(f, S(26), S(28), easeInOut);
  return (
    <Porcelain>
      <div style={{ position: "absolute", left: SAFE_L, top: 130, opacity: label }}>
        <LedgerRow text="MY READ · INTENT DOESN'T LIVE IN A REPO" fontSize={19} width={700} />
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 230, width: 800, opacity: lane1 }}>
        <SerifTitle size={46}>Anthropic — the moat</SerifTitle>
        <div style={{ marginTop: 20 }}>
          <LedgerRow text="closed harness · wired to a subscription" fontSize={23} width={760} />
          <LedgerRow text="the harness protects the model" fontSize={23} width={760} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 1010, top: 230, width: 800, opacity: lane2 }}>
        <SerifTitle size={46} color={T.signal}>DeepSeek — the funnel</SerifTitle>
        <div style={{ marginTop: 20 }}>
          <LedgerRow text="harness given away · reads rivals' formats" fontSize={23} width={760} />
          <LedgerRow text="everything funnels to what they sell: tokens" fontSize={23} width={760} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE_L,
          top: 620,
          width: SAFE_W,
          borderTop: `2px solid ${T.ink}`,
          paddingTop: 28,
          opacity: band,
        }}
      >
        <SerifTitle size={48}>Portability cuts both ways.</SerifTitle>
      </div>
    </Porcelain>
  );
};

/** s24 — what travels: three slips. */
const S24WhatTravels: SceneFC = ({ f }) => {
  const slips = [
    ["the five-line assertion", "context checked against the log, every call"],
    ["the cache trio", "fixed order · nothing volatile · one watching test"],
    ["a rejected/ folder", "your agents also re-pitch dead ideas"],
  ];
  return (
    <Porcelain>
      <div
        style={{
          position: "absolute",
          left: SAFE_L,
          top: 210,
          width: SAFE_W,
          display: "flex",
          gap: 32,
        }}
      >
        {slips.map(([title, sub], i) => {
          const p = P(f, S(1 + i * 8), S(2.4 + i * 8));
          return (
            <div
              key={title}
              style={{
                flex: 1,
                backgroundColor: T.paper,
                border: "1px solid #ddd9cc",
                borderTop: `6px solid ${T.signal}`,
                borderRadius: 6,
                padding: "38px 34px",
                minHeight: 250,
                boxShadow: "0 12px 34px rgba(43,46,44,0.08)",
                ...settle(p),
              }}
            >
              <div style={{ fontFamily: T.serif, fontSize: 38, color: T.ink }}>{title}</div>
              <div
                style={{
                  marginTop: 18,
                  fontFamily: T.mono,
                  fontSize: 21,
                  lineHeight: 1.6,
                  color: T.muted,
                }}
              >
                {sub}
              </div>
            </div>
          );
        })}
      </div>
      <MarginLabel text="WHOEVER'S MODEL YOU RUN" y={700} p={P(f, S(18), S(19.4))} />
    </Porcelain>
  );
};

/** s25 — rented / churning / yours. */
const S25RentChurnOwn: SceneFC = ({ f }) => (
  <Porcelain>
    <div style={{ position: "absolute", left: 300, top: 260, width: 1320 }}>
      {[
        ["models", "rented — designed to be swapped", T.muted],
        ["harnesses", "still churning — compatibility will break", T.muted],
        ["yours", "skills · instruction files · your decisions", T.signal],
      ].map(([k, v, c], i) => (
        <div
          key={k as string}
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 44,
            marginBottom: 44,
            ...settle(P(f, S(0.7 + i * 6), S(2.1 + i * 6))),
          }}
        >
          <div style={{ fontFamily: T.serif, fontSize: 64, color: T.ink, width: 360 }}>{k}</div>
          <div style={{ fontFamily: T.mono, fontSize: 26, color: c as string }}>{v}</div>
        </div>
      ))}
    </div>
  </Porcelain>
);

/** s26 — two shelves close + series pointer. */
const S26TwoShelves: SceneFC = ({ f }) => {
  const enter = P(f, 0, 14, easeInOut);
  const cols = P(f, S(8), S(9.6));
  const series = P(f, S(18), S(19.6));
  return (
    <Porcelain>
      <div
        style={{
          position: "absolute",
          left: SAFE_L,
          top: 96,
          width: SAFE_W,
          height: 600,
          opacity: enter,
          boxShadow: "0 18px 60px rgba(43,46,44,0.18)",
        }}
      >
        <Img
          src={staticFile("harness-teardown/04-metaphor-two-shelves.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE_L,
          top: 724,
          width: SAFE_W,
          display: "flex",
          gap: 60,
          opacity: cols,
        }}
      >
        <div style={{ fontFamily: T.serif, fontSize: 40, color: T.ink }}>
          One hour. Two columns.
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 24, color: T.muted, alignSelf: "center" }}>
          what travels with you · what's locked in
        </div>
      </div>
      <div style={{ position: "absolute", left: SAFE_L, top: 812, width: SAFE_W, opacity: series }}>
        <LedgerRow text="SEQ 09 · NEXT — THE ENTRY FEE · measured on my own stack" state="visible" fontSize={21} />
      </div>
    </Porcelain>
  );
};

/** Brand end card. */
const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const enter = P(f, 0, 26, easeInOut);
  const site = P(f, 20, 40);
  const exit = P(f, S(END_CARD_SEC) - 16, S(END_CARD_SEC) - 2, easeInOut);
  const vis = enter * (1 - exit);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: T.canvas,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", opacity: vis }}>
        <Img
          src={staticFile("harness-teardown/ag-logo.png")}
          style={{ width: 120, height: 120, objectFit: "contain", margin: "0 auto" }}
        />
        <div
          style={{
            marginTop: 28,
            fontFamily: T.sans,
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: 6,
            color: T.ink,
          }}
        >
          AARON GUO
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: T.mono,
            fontSize: 20,
            letterSpacing: 4,
            color: T.muted,
            opacity: site,
          }}
        >
          AI-NATIVE BUILDER · HUMAN-FIRST THINKER
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: T.mono,
            fontSize: 18,
            letterSpacing: 3,
            color: T.muted,
            opacity: site,
          }}
        >
          aaronguo.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- assembly
const SCENE_COMPONENTS: Record<string, SceneFC> = {
  "s01-cold-open": S01ColdOpen,
  "s02-invisible-layer": S02InvisibleLayer,
  "s03-winner-blinked": S03Winner,
  "s04-i-went-inside": S04WentInside,
  "s05-how-caching-bills": S05CachingBills,
  "s06-the-lawyer": S06Lawyer,
  "s07-safe-and-key": S07SafeKey,
  "s08-timestamp": S08Timestamp,
  "s09-gross-margin": S09Margin,
  "s10-test-refuses": S10TestRefuses,
  "s11-ledger-cascade": S11Cascade,
  "s12-derive-refuse": S12DeriveMap,
  "s13-replay": S13Replay,
  "s14-five-lines": S14FiveLines,
  "s15-one-row-machine": S15Machine,
  "s16-disabled-true": S16DisabledTrue,
  "s17-green-hollow": S17GreenHollow,
  "s18-27-checks": S18Checks,
  "s19-fleet": S19Fleet,
  "s20-markdown": S20Markdown,
  "s21-process-os": S21ProcessOS,
  "s22-the-catch": S22Catch,
  "s23-moat-funnel": S23MoatFunnel,
  "s24-what-travels": S24WhatTravels,
  "s25-rent-churn-own": S25RentChurnOwn,
  "s26-two-shelves": S26TwoShelves,
};

const SceneHost: React.FC<{ id: string; durSec: number }> = ({ id, durSec }) => {
  const f = useCurrentFrame();
  const C = SCENE_COMPONENTS[id];
  if (!C) return null;
  const fadeIn = P(f, 0, 13, easeInOut); // 0.42s crossfade continuity
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <C f={f} dur={S(durSec)} />
    </AbsoluteFill>
  );
};

const FilmChrome: React.FC<{ offsetSec?: number }> = ({ offsetSec = 0 }) => {
  const f = useCurrentFrame();
  const absSec = offsetSec + f / LEDGER_HARNESS_FPS;
  if (absSec < 0 || absSec >= NARRATION_END_SEC) return null;
  return (
    <>
      <HeaderRail absSec={absSec} />
      <CaptionBar absSec={absSec} />
    </>
  );
};

/** Approved article cover (exact-text thumbnail) as the opening card. */
const CoverCard: React.FC = () => {
  const f = useCurrentFrame();
  const exit = P(f, S(COVER_CARD_SEC) - 13, S(COVER_CARD_SEC) - 1, easeInOut);
  return (
    <AbsoluteFill style={{ backgroundColor: T.canvas, opacity: 1 - exit }}>
      <Img
        src={staticFile("harness-teardown/cover-card.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

/** Full film: cover card + narration timeline + end card. */
export const LedgerHarnessFilm: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: T.canvas }}>
    <Sequence from={S(COVER_CARD_SEC)}>
      <Audio src={staticFile("harness-teardown/narration-v2.mp3")} />
    </Sequence>
    {harnessScenes.map((s) => (
      <Sequence
        key={s.id}
        from={S(s.start + COVER_CARD_SEC)}
        durationInFrames={S(s.end) - S(s.start)}
      >
        {s.id === "s27-end-card" ? (
          <EndCard />
        ) : (
          <SceneHost id={s.id} durSec={s.end - s.start} />
        )}
      </Sequence>
    ))}
    <FilmChrome offsetSec={-COVER_CARD_SEC} />
    <Sequence from={0} durationInFrames={S(COVER_CARD_SEC)}>
      <CoverCard />
    </Sequence>
  </AbsoluteFill>
);

/** Prototype slice: the full log chapter (219.1 – 301.6s) — signature + structured + calm + emphasis. */
export const LEDGER_HARNESS_PROTO_START_SEC = 219.1;
export const LEDGER_HARNESS_PROTO_END_SEC = 301.6;
export const ledgerHarnessPrototypeDurationFrames = (): number =>
  S(LEDGER_HARNESS_PROTO_END_SEC) - S(LEDGER_HARNESS_PROTO_START_SEC);

export const LedgerHarnessPrototype: React.FC = () => {
  const start = LEDGER_HARNESS_PROTO_START_SEC;
  const slice = harnessScenes.filter(
    (s) => s.start >= start - 0.01 && s.end <= LEDGER_HARNESS_PROTO_END_SEC + 0.01,
  );
  return (
    <AbsoluteFill style={{ backgroundColor: T.canvas }}>
      <Audio
        src={staticFile("harness-teardown/narration-v2.mp3")}
        trimBefore={S(start)}
      />
      {slice.map((s) => (
        <Sequence
          key={s.id}
          from={S(s.start - start)}
          durationInFrames={S(s.end) - S(s.start)}
        >
          <SceneHost id={s.id} durSec={s.end - s.start} />
        </Sequence>
      ))}
      <FilmChrome offsetSec={start} />
    </AbsoluteFill>
  );
};
