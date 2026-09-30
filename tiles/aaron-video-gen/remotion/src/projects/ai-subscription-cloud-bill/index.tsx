import React from 'react';
import {AbsoluteFill, Audio, Composition, Easing, Img, Sequence, interpolate, registerRoot, staticFile, useCurrentFrame} from 'remotion';
import {data, type SceneData} from './data';
import {ColdOpen3D, Reread3D, type ColdCues, type RereadCues} from './ledger-3d';

/**
 * AiBillFilm — "OpenAI Halved My $200 Plan. So I Priced My Own AI Bill."
 * Inherits ledger-editorial-v1 (src/content/blogs/2026-08-19): porcelain field, serif claims,
 * mono ledger rows that append and never erase, phrase captions, quiet brand end card.
 * Deliberate deviation: the single accent is receipt amber and means only "cache reads / the re-read".
 * Storyboard: src/content/blogs/2026-09-30-ai-bill/video-storyboard.json. Timing: build-data.py.
 */

const FPS = data.fps;
const T = {
  canvas: '#F6F4EF',
  paper: '#FCFBF7',
  ink: '#1E2124',
  ink2: '#565A60',
  muted: '#8B8E93',
  faint: '#CFCAC0',
  rule: '#D9D5CC',
  amber: '#D2701C',
  serif: "Georgia, 'Times New Roman', serif",
  sans: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
  mono: "'SF Mono', Menlo, 'Courier New', monospace",
};
const SAFE_L = 112;
const SAFE_W = 1920 - 2 * SAFE_L;
const CAPTION_TOP = 1080 - 154;
const media = (name: string) => staticFile(`ai-subscription-cloud-bill/${name}`);

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);
/** Progress of a cue that starts at absolute second `at` and settles over `dur` seconds. */
const pr = (g: number, at: number, dur = 0.6, easing = easeOut): number =>
  interpolate(g, [at, at + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});
const settle = (p: number): React.CSSProperties => ({opacity: p, transform: `translateY(${(1 - p) * 10}px)`});
const mix = (p: number, a: number, b: number) => a + (b - a) * p;
const sceneById = (id: string): SceneData => {
  const s = data.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`missing scene ${id}`);
  return s;
};

type SceneProps = {s: SceneData; g: number};
type SceneFC = React.FC<SceneProps>;

// ---------------------------------------------------------------- primitives
const Porcelain: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{backgroundColor: T.canvas}}>{children}</AbsoluteFill>
);

const Abs: React.FC<{x?: number; y: number; w?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({
  x = SAFE_L,
  y,
  w = SAFE_W,
  style,
  children,
}) => <div style={{position: 'absolute', left: x, top: y, width: w, ...style}}>{children}</div>;

const Serif: React.FC<{children: React.ReactNode; size?: number; color?: string; p?: number; italic?: boolean; style?: React.CSSProperties}> = ({
  children,
  size = 62,
  color = T.ink,
  p = 1,
  italic = false,
  style,
}) => (
  <div style={{fontFamily: T.serif, fontSize: size, lineHeight: 1.14, letterSpacing: -0.5, color, fontStyle: italic ? 'italic' : 'normal', ...settle(p), ...style}}>
    {children}
  </div>
);

const Sans: React.FC<{children: React.ReactNode; size?: number; color?: string; p?: number; style?: React.CSSProperties}> = ({
  children,
  size = 32,
  color = T.ink2,
  p = 1,
  style,
}) => <div style={{fontFamily: T.sans, fontSize: size, lineHeight: 1.4, color, ...settle(p), ...style}}>{children}</div>;

const Mono: React.FC<{children: React.ReactNode; size?: number; color?: string; p?: number; style?: React.CSSProperties}> = ({
  children,
  size = 20,
  color = T.muted,
  p = 1,
  style,
}) => (
  <div style={{fontFamily: T.mono, fontSize: size, letterSpacing: 2, color, whiteSpace: 'nowrap', ...settle(p), ...style}}>{children}</div>
);

type RowState = 'active' | 'dim' | 'archive' | 'amber';
/** One receipt line: label · dotted leader · value. Appends; never erased (strike marks what is going away). */
const Row: React.FC<{
  label: React.ReactNode;
  value?: React.ReactNode;
  p?: number;
  state?: RowState;
  size?: number;
  width?: number;
  valueColor?: string;
  strike?: number;
  bold?: boolean;
}> = ({label, value, p = 1, state = 'active', size = 28, width = SAFE_W, valueColor, strike = 0, bold = false}) => {
  const color = state === 'amber' ? T.amber : state === 'dim' ? T.muted : state === 'archive' ? T.faint : T.ink;
  return (
    <div
      style={{
        position: 'relative',
        width,
        display: 'flex',
        alignItems: 'baseline',
        fontFamily: T.mono,
        fontSize: size,
        lineHeight: 1.95,
        color,
        fontWeight: bold ? 700 : 400,
        borderBottom: `1px solid ${T.rule}`,
        ...settle(p),
      }}
    >
      <span style={{whiteSpace: 'nowrap'}}>{label}</span>
      <span style={{flex: 1, minWidth: 24, margin: '0 16px', borderBottom: `2px dotted ${T.faint}`, transform: 'translateY(-0.28em)'}} />
      {value !== undefined ? <span style={{whiteSpace: 'nowrap', color: valueColor ?? color}}>{value}</span> : null}
      {strike > 0 ? (
        <div style={{position: 'absolute', left: 0, top: '50%', height: 3, width: `${strike * 100}%`, background: T.ink}} />
      ) : null}
    </div>
  );
};

const Stamp: React.FC<{children: React.ReactNode; p: number; color?: string}> = ({children, p, color = T.ink}) => (
  <div
    style={{
      display: 'inline-block',
      border: `2px solid ${color}`,
      padding: '8px 16px',
      fontFamily: T.mono,
      fontSize: 22,
      letterSpacing: 3,
      color,
      opacity: p,
      transform: `scale(${mix(p, 1.04, 1)})`,
      transformOrigin: 'left center',
    }}
  >
    {children}
  </div>
);

const Struck: React.FC<{children: React.ReactNode; p: number}> = ({children, p}) => (
  <span style={{position: 'relative', color: p > 0.5 ? T.muted : 'inherit'}}>
    {children}
    <span style={{position: 'absolute', left: -4, top: '52%', height: 3, width: `calc(${p * 100}% + ${8 * p}px)`, background: T.ink, opacity: p > 0 ? 1 : 0}} />
  </span>
);

/** Numbered slot for checklists: visible scaffold before it fills. */
const Slot: React.FC<{n: string; p: number; y: number; title: React.ReactNode; sub?: React.ReactNode; subP?: number; size?: number}> = ({
  n,
  p,
  y,
  title,
  sub,
  subP = 0,
  size = 46,
}) => (
  <Abs y={y}>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 36, borderTop: `1px solid ${p > 0 ? T.rule : T.faint}`, paddingTop: 18}}>
      <div style={{fontFamily: T.mono, fontSize: 26, color: p > 0.05 ? T.ink : T.faint, width: 46}}>{n}</div>
      <div style={{flex: 1}}>
        <Serif size={size} p={p}>
          {title}
        </Serif>
        {sub ? (
          <div style={{marginTop: 12}}>
            <Mono size={21} color={T.ink2} p={subP}>
              {sub}
            </Mono>
          </div>
        ) : null}
      </div>
    </div>
  </Abs>
);

/** Framed evidence plate (a chart or still) with ledger-style margin notes that append. */
const Exhibit: React.FC<{
  src: string;
  g: number;
  s: SceneData;
  notes: {text: React.ReactNode; at: number; color?: string}[];
  graphite?: boolean;
  aspect?: number;
}> = ({src, g, s, notes, graphite = false, aspect = 16 / 9}) => {
  const w = 1250;
  const h = Math.round(w / aspect);
  return (
    <Porcelain>
      <div
        style={{
          position: 'absolute',
          left: SAFE_L,
          top: 118,
          width: w,
          height: h,
          background: T.canvas,
          border: `1px solid ${T.rule}`,
          boxShadow: '0 18px 50px rgba(30,33,36,0.13)',
          overflow: 'hidden',
        }}
      >
        <Img src={media(src)} style={{width: '100%', height: '100%', objectFit: 'contain', filter: graphite ? 'grayscale(1) contrast(1.06)' : undefined}} />
      </div>
      <Abs x={SAFE_L + w + 60} y={150} w={1920 - SAFE_L - w - 60 - SAFE_L}>
        {notes.map((n, i) => (
          <div key={i} style={{marginBottom: 18, ...settle(pr(g, n.at, 0.6))}}>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 19,
                lineHeight: 1.55,
                letterSpacing: 1.5,
                color: n.color ?? T.ink2,
                borderBottom: `1px solid ${T.rule}`,
                paddingBottom: 12,
              }}
            >
              {n.text}
            </div>
          </div>
        ))}
      </Abs>
      <Mono size={17} p={pr(g, s.start + 0.3, 0.6)} style={{position: 'absolute', left: SAFE_L, top: 118 + h + 22}}>
        {graphite ? 'EXHIBIT · SHOWN IN GRAPHITE · AMBER IN THIS FILM MEANS CACHE READS' : 'EXHIBIT · AMBER = CACHE READS'}
      </Mono>
    </Porcelain>
  );
};

// ---------------------------------------------------------------- chrome
const HeaderRail: React.FC<{g: number}> = ({g}) => {
  const current = [...data.chapters].reverse().find((c) => g >= c.at);
  if (!current) return null;
  const p = pr(g, current.at, 0.6, easeInOut);
  return (
    <div style={{position: 'absolute', left: SAFE_L, right: SAFE_L, top: 34, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
      <div style={{fontFamily: T.sans, fontSize: 19, letterSpacing: 4, fontWeight: 700, color: T.ink}}>AARON GUO</div>
      <div style={{fontFamily: T.mono, fontSize: 18, letterSpacing: 2, color: T.muted, overflow: 'hidden'}}>
        <div style={{transform: `translateY(${(1 - p) * 16}px)`, opacity: p}}>
          {current.seq} · {current.label}
        </div>
      </div>
    </div>
  );
};

const CaptionBar: React.FC<{g: number}> = ({g}) => {
  const active = data.captions.find((c) => g >= c.start && g <= c.end + 0.12);
  if (!active) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: CAPTION_TOP, height: 154, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          maxWidth: 1400,
          padding: '10px 26px',
          borderRadius: 6,
          backgroundColor: 'rgba(30,33,36,0.84)',
          color: '#F6F4EC',
          fontFamily: T.sans,
          fontSize: 31,
          lineHeight: 1.35,
          textAlign: 'center',
        }}
      >
        {active.text}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- hook
const Cover: SceneFC = ({s, g}) => {
  const c = s.cues;
  const t = g - s.start;
  const meter = pr(g, c.meter, 0.7);
  const five = pr(g, c.five, 0.5);
  return (
    <AbsoluteFill style={{backgroundColor: T.canvas}}>
      <Img src={media('cover.png')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1 + 0.018 * Math.min(1, t / 7.75)})`, transformOrigin: '20% 60%'}} />
      <Abs x={760} y={138} w={1050}>
        <Mono size={22} color={T.ink} style={{letterSpacing: 4}}>
          AARON GUO · AI-NATIVE BUILDER
        </Mono>
        <div style={{marginTop: 30}}>
          <Serif size={70}>OpenAI Halved My $200 Plan.</Serif>
          <Serif size={70}>So I Priced My Own AI Bill.</Serif>
        </div>
        <Sans size={30} style={{marginTop: 26, maxWidth: 980}}>
          One heavy user's 30-day AI coding bill, priced line by line at API list.
        </Sans>
      </Abs>
      <Abs x={760} y={560} w={1000}>
        <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
          <div style={{flex: 1}}>
            <Row label="SEP 2026 · CODEX WEEKLY METER" value="99–100%" p={meter} size={24} width={700} />
          </div>
          <div style={{width: 250}}>
            <Stamp p={five}>5 OF 6 WEEKS</Stamp>
          </div>
        </div>
      </Abs>
    </AbsoluteFill>
  );
};

const Email: SceneFC = ({s, g}) => {
  const c = s.cues;
  return (
    <Porcelain>
      <Abs y={240}>
        <Mono size={22} p={pr(g, s.start, 0.45)}>
          FROM OPENAI · EMAIL TO PRO SUBSCRIBERS · 2026-09-29
        </Mono>
      </Abs>
      <Abs y={320} w={1500}>
        <Serif size={80} color={g >= c.headline ? T.ink : T.faint} style={{opacity: mix(pr(g, s.start, 0.4), 0, mix(pr(g, c.headline, 0.6), 0.6, 1))}}>
          From October 30, the same $200 buys half as much.
        </Serif>
      </Abs>
      <Abs y={610} w={1100}>
        <Row
          label="PRO 200 · CODEX + CHATGPT WORK"
          value={
            <span>
              <Struck p={pr(g, c.strike, 0.5, easeInOut)}>20× PLUS</Struck>
              <span style={{marginLeft: 22, fontWeight: 700, opacity: pr(g, c.strike + 0.3, 0.5)}}>10× PLUS</span>
            </span>
          }
          p={pr(g, c.email, 0.6)}
          size={28}
          width={1100}
        />
      </Abs>
    </Porcelain>
  );
};

const Priced: SceneFC = ({s, g}) => {
  const c = s.cues;
  const mystery = pr(g, c.mystery, 0.8);
  return (
    <Porcelain>
      <div style={{position: 'absolute', left: SAFE_L, top: 150, width: 620, height: 700, background: T.paper, boxShadow: '0 16px 44px rgba(30,33,36,0.12)'}} />
      <Abs x={SAFE_L + 44} y={190} w={532}>
        <Mono size={19} p={pr(g, s.start, 0.4)}>
          30 DAYS · EVERY TOKEN · API LIST PRICE
        </Mono>
        <div style={{marginTop: 34}}>
          <Row label="CODEX · SESSION LOGS" value="✓" size={23} width={532} p={pr(g, c.rows, 0.5)} />
          <Row label="CLAUDE CODE · SESSION LOGS" value="✓" size={23} width={532} p={pr(g, c.rows + 0.4, 0.5)} />
          <Row label="EVERY TOKEN × LIST PRICE" value="✓" size={23} width={532} p={pr(g, c.priced, 0.5)} />
        </div>
        <div style={{marginTop: 60, display: 'flex', alignItems: 'center', gap: 18, opacity: mystery}}>
          <div style={{height: 40, width: `${mystery * 440}px`, background: T.amber}} />
          <div style={{fontFamily: T.mono, fontSize: 30, color: T.amber}}>?</div>
        </div>
        <div style={{marginTop: 50}}>
          <Row label="" size={23} width={532} state="archive" p={0.6} />
          <Row label="" size={23} width={532} state="archive" p={0.6} />
        </div>
      </Abs>
      <Abs x={860} y={300} w={950}>
        <Serif size={58} color={g >= c.priced ? T.ink : T.ink2}>
          I priced every token I used in the last 30 days.
        </Serif>
        <div style={{marginTop: 60}}>
          <Serif size={52} italic p={mystery}>
            The expensive part wasn't what I expected.
          </Serif>
        </div>
      </Abs>
    </Porcelain>
  );
};

// ---------------------------------------------------------------- slide 01
const Terms: SceneFC = ({s, g}) => {
  const c = s.cues;
  const rows = [
    {at: c.r1, label: 'PRO 200 · CODEX + CHATGPT WORK', value: (
      <span>
        <Struck p={pr(g, c.r1b, 0.5, easeInOut)}>20× PLUS</Struck>
        <span style={{marginLeft: 22, fontWeight: 700, opacity: pr(g, c.r1b + 0.25, 0.5)}}>10× PLUS</span>
      </span>
    )},
    {at: c.r2, label: 'PRICE', value: '$200 / MONTH · UNCHANGED'},
    {at: c.r3, label: 'EXISTING SUBSCRIBERS', value: 'OLD LIMITS THROUGH OCT 29'},
    {at: c.r4, label: 'ONE-TIME CREDITS', value: 'WORTH $2,500 · EXPIRE DEC 31'},
  ];
  return (
    <Porcelain>
      <Abs y={170}>
        <Serif size={64} p={pr(g, s.start, 0.5)}>
          Here's what changed.
        </Serif>
      </Abs>
      <Abs y={320} w={1560}>
        {rows.map((r, i) => (
          <div key={i} style={{position: 'relative', height: 84}}>
            <div style={{position: 'absolute', inset: 0, borderBottom: `1px dashed ${T.faint}`, opacity: 1 - pr(g, r.at, 0.4)}} />
            <Row label={r.label} value={r.value} p={pr(g, r.at, 0.6)} size={30} width={1560} />
          </div>
        ))}
      </Abs>
      <Abs y={712}>
        <Mono size={18} p={pr(g, c.r1, 0.6)}>
          SOURCE · OPENAI EMAIL TO PRO SUBSCRIBERS · 2026-09-29
        </Mono>
      </Abs>
    </Porcelain>
  );
};

const Tibo: SceneFC = ({s, g}) => {
  const c = s.cues;
  const quote = pr(g, c.quote, 0.8);
  const echo = pr(g, c.echo, 0.7, easeInOut);
  return (
    <Porcelain>
      <Abs x={240} y={190} w={1440}>
        <Mono size={21} p={pr(g, s.start, 0.45)}>
          THE NIGHT BEFORE · 2026-09-28
        </Mono>
        <Sans size={32} p={quote} style={{marginTop: 40}}>
          He wrote that the new plan
        </Sans>
        <div style={{marginTop: 14}}>
          <Serif size={70} color={quote > 0.5 ? T.ink : T.faint} style={{lineHeight: 1.2, opacity: mix(pr(g, s.start, 0.4), 0, mix(quote, 0.6, 1))}}>
            “…will net out at half the dollar in{' '}
            <span style={{position: 'relative', whiteSpace: 'nowrap'}}>
              API spend
              <span style={{position: 'absolute', left: 0, bottom: -6, height: 4, width: `${echo * 100}%`, background: T.ink}} />
            </span>
            …”
          </Serif>
        </div>
      </Abs>
      <Abs x={240} y={640} w={1200}>
        <div style={{opacity: mix(pr(g, c.attr, 0.6), 0.55, 1)}}>
          <Row label="TIBO (THIBAULT SOTTIAUX)" value="LEADS CODEX" size={22} width={1200} p={pr(g, s.start + 0.2, 0.6)} />
          <Row label="POST ON X" value="2026-09-28" size={22} width={1200} p={pr(g, s.start + 0.35, 0.6)} />
        </div>
      </Abs>
    </Porcelain>
  );
};

const Unit: SceneFC = ({s, g}) => {
  const c = s.cues;
  return (
    <Porcelain>
      <Abs y={300}>
        <Mono size={21} p={pr(g, s.start, 0.45)}>
          THE NEW UNIT
        </Mono>
        <div style={{marginTop: 26}}>
          <Serif size={96} p={pr(g, s.start + 0.1, 0.6)}>
            The unit is now the API dollar.
          </Serif>
        </div>
      </Abs>
      <Abs y={560} w={1500}>
        <Sans size={40} p={pr(g, c.sub, 0.7)}>
          Your subscription is a prepaid budget, measured in API dollars.
        </Sans>
      </Abs>
    </Porcelain>
  );
};

// ---------------------------------------------------------------- slide 02
const PerUnit: SceneFC = ({s, g}) => {
  const c = s.cues;
  const col = pr(g, c.col, 0.6);
  const ten = pr(g, c.ten, 0.5);
  const gone = pr(g, c.gone, 0.9, easeInOut);
  const cols = [
    {x: 0, w: 760, align: 'left' as const},
    {x: 780, w: 220, align: 'right' as const},
    {x: 1030, w: 220, align: 'right' as const},
    {x: 1330, w: 230, align: 'right' as const},
  ];
  const Line: React.FC<{cells: string[]; p: number; y: number; state?: 'normal' | 'old'}> = ({cells, p, y, state = 'normal'}) => (
    <div style={{position: 'absolute', left: 0, top: y, width: 1590, height: 66, borderBottom: `1px solid ${T.rule}`, ...settle(p)}}>
      {cells.map((cell, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: cols[i].x,
            width: cols[i].w,
            top: 12,
            textAlign: cols[i].align,
            fontFamily: i === 0 ? T.sans : T.mono,
            fontSize: i === 0 ? 32 : 30,
            fontWeight: i === 3 && state === 'normal' && col > 0.5 ? 700 : i === 0 ? 500 : 400,
            color: state === 'old' && gone > 0.5 ? T.muted : T.ink,
          }}
        >
          {cell}
        </div>
      ))}
    </div>
  );
  const rows = [
    {at: c.r1, cells: ['Plus', '$20', '1×', '$20']},
    {at: c.r2, cells: ['Pro 100', '$100', '5×', '$20']},
    {at: c.r3, cells: ['Pro 200 · from Oct 30', '$200', '10×', '$20']},
    {at: c.r4, cells: ['Pro 500', '$500', '25×', '$20']},
  ];
  return (
    <Porcelain>
      <Abs y={150}>
        <Serif size={54} p={pr(g, s.start, 0.5)}>
          Once you see the unit, the price list reads differently.
        </Serif>
      </Abs>
      <div style={{position: 'absolute', left: SAFE_L + 50, top: 270, width: 1590, height: 560}}>
        {['TIER', 'PRICE / MONTH', '× PLUS USAGE', 'PER 1×'].map((h, i) => (
          <div key={h} style={{position: 'absolute', left: cols[i].x, width: cols[i].w, top: 0, textAlign: cols[i].align, fontFamily: T.mono, fontSize: 19, letterSpacing: 2, color: T.muted}}>
            {h}
          </div>
        ))}
        <div style={{position: 'absolute', left: 0, top: 40, width: 1590, borderTop: `2px solid ${T.ink}`}} />
        {rows.map((r, i) => (
          <Line key={i} cells={r.cells} p={pr(g, r.at, 0.55)} y={48 + i * 70} />
        ))}
        <div style={{position: 'absolute', left: 1330, top: 48, width: 260, height: 280, border: `2px solid ${T.ink}`, opacity: col * 0.9}} />
        <div style={{position: 'absolute', left: 900, top: 342, width: 690, textAlign: 'right', fontFamily: T.mono, fontSize: 20, letterSpacing: 2, color: T.ink, ...settle(col)}}>
          EVERY TIER · $20 PER UNIT
        </div>
        <div style={{position: 'absolute', left: 0, top: 400, width: 1590, borderTop: `2px solid ${T.rule}`, opacity: pr(g, c.old, 0.4)}} />
        <Line cells={['Pro 200 · until Oct 29', '$200', '20×', '$10']} p={pr(g, c.old, 0.6)} y={412} state="old" />
        <div style={{position: 'absolute', left: 1330 + 150, top: 412, width: 110, height: 66, border: `3px solid ${T.ink}`, opacity: ten * (1 - gone * 0.6)}} />
        <div style={{position: 'absolute', left: 0, top: 412 + 36, height: 3, width: `${gone * 1590}px`, background: T.ink}} />
        <div style={{position: 'absolute', left: 0, top: 500, fontFamily: T.mono, fontSize: 20, letterSpacing: 2, color: T.ink, ...settle(gone)}}>
          THE ONLY BULK DISCOUNT · GOING AWAY OCT 30
        </div>
      </div>
      <Abs y={840}>
        <Mono size={17} p={pr(g, c.r1, 0.6)}>
          1× = PLUS ALLOWANCE · ARITHMETIC FROM OPENAI PLAN TERMS
        </Mono>
      </Abs>
    </Porcelain>
  );
};

const FlatRate: SceneFC = ({s, g}) => {
  const c = s.cues;
  return (
    <Porcelain>
      <Abs y={220} w={1500}>
        <Row label="PRO 500" value="$500 · 25× PLUS · $20 PER 1×" p={pr(g, s.start, 0.5)} size={28} width={1500} />
        <Row label="WHAT IT ADDS" value="A HIGHER CEILING · ULTRAFAST SPEED" p={pr(g, c.speed, 0.6)} size={28} width={1500} />
      </Abs>
      <Abs y={470} w={1600}>
        <Serif size={76} p={pr(g, c.flat, 0.7)}>
          A flat rate, with a premium for performance.
        </Serif>
      </Abs>
      <Abs y={680}>
        <Sans size={40} p={pr(g, c.cloud, 0.7)}>
          That's how cloud providers price.
        </Sans>
      </Abs>
    </Porcelain>
  );
};

// ---------------------------------------------------------------- slide 03
const FiveWords: SceneFC = ({s, g}) => {
  const c = s.cues;
  const quote = pr(g, c.quote, 0.8);
  const five = pr(g, c.five, 0.5);
  return (
    <Porcelain>
      <Abs y={170}>
        <Serif size={50} p={pr(g, s.start, 0.5)}>
          A lot of the reaction was about delivery.
        </Serif>
      </Abs>
      <Abs y={262} w={1500}>
        <Row label="TIMING" value="ANNOUNCED ~10 HOURS BEFORE THE DEVDAY KEYNOTE" p={pr(g, c.timing, 0.6)} size={24} width={1500} />
      </Abs>
      <Abs x={200} y={390} w={1520}>
        <Serif size={70} p={quote} style={{lineHeight: 1.22}}>
          “Simply say ‘we're cutting limits in half.’{' '}
          <span style={{fontWeight: five > 0.5 ? 700 : 400}}>Five words.</span>”
        </Serif>
        <div style={{marginTop: 26}}>
          <Mono size={21} color={T.ink2} p={quote}>
            HACKER NEWS COMMENTER · THREAD OF 2026-09-28
          </Mono>
        </div>
      </Abs>
      <Abs y={740} w={1500}>
        <Row label="SEVERAL REPLIES" value="ALREADY MOVED TO CLAUDE OPUS 5.5" p={pr(g, c.moved, 0.6)} size={24} width={1500} />
      </Abs>
    </Porcelain>
  );
};

const OtherSide: SceneFC = ({s, g}) => {
  const c = s.cues;
  return (
    <Porcelain>
      <Abs y={160}>
        <Mono size={22} color={T.ink} p={pr(g, s.start, 0.45)}>
          ONE X USER'S ESTIMATE · API VALUE PER MONTH
        </Mono>
      </Abs>
      <Abs y={220} w={1100}>
        {[
          {at: c.r1, label: 'OLD PRO 200', value: '≈ $14,000'},
          {at: c.r2, label: 'NEW PRO 200', value: '≈ $7,000'},
          {at: c.r3, label: 'CLAUDE MAX', value: '≈ $8,000'},
        ].map((r, i) => (
          <div key={i} style={{position: 'relative'}}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 66, borderBottom: `1px dashed ${T.faint}`, opacity: 1 - pr(g, r.at, 0.4)}} />
            <Row label={r.label} value={r.value} p={pr(g, r.at, 0.6)} size={34} width={1100} />
          </div>
        ))}
        <Sans size={32} p={pr(g, c.barely, 0.6)} style={{marginTop: 24}}>
          Their conclusion: barely a difference.
        </Sans>
      </Abs>
      <Abs x={1300} y={300} w={520}>
        <Stamp p={pr(g, c.verify, 0.45)}>UNVERIFIED</Stamp>
        <Mono size={18} color={T.ink2} p={pr(g, c.verify + 0.2, 0.5)} style={{marginTop: 16}}>
          METHODOLOGY NOT SHOWN
        </Mono>
      </Abs>
      <Abs y={590} w={1600}>
        <Serif size={64} p={pr(g, c.both, 0.7)}>
          Both sides now argue in API dollars.
        </Serif>
      </Abs>
      <Abs y={760} w={900}>
        <Row label="SO I PULLED MY OWN" value="→" p={pr(g, c.mine, 0.6)} size={26} width={900} />
      </Abs>
    </Porcelain>
  );
};

// ---------------------------------------------------------------- slide 04
const Setup: SceneFC = ({s, g}) => {
  const c = s.cues;
  return (
    <Porcelain>
      <Abs y={160}>
        <Serif size={56} p={pr(g, s.start, 0.5)}>
          What I pay, and how I priced it.
        </Serif>
      </Abs>
      <Abs y={290} w={1500}>
        <Row label="CHATGPT PRO" value="$200 / MONTH" p={pr(g, c.r1, 0.5)} size={30} width={1500} />
        <Row label="CLAUDE MAX" value="$200 / MONTH" p={pr(g, c.r2, 0.6)} size={30} width={1500} />
        <Row label="BOTH TOOLS, EVERY DAY" value="SEVERAL AGENTS RUNNING" p={pr(g, c.r3, 0.6)} size={30} width={1500} />
        <Row label="SESSION LOGS ON DISK" value="TOKENS PER TURN" p={pr(g, c.r4, 0.6)} size={30} width={1500} />
        <Row label="30 DAYS · MAIN MACHINE" value="EVERY TOKEN × API LIST PRICE" p={pr(g, c.r5, 0.6)} size={30} width={1500} />
      </Abs>
      <Abs y={800}>
        <Mono size={19} color={T.ink} p={pr(g, c.r5 + 0.8, 0.6)}>
          API LIST PRICE, NOT WHAT I PAID · ONE MACHINE
        </Mono>
      </Abs>
    </Porcelain>
  );
};

const Totals: SceneFC = ({s, g}) => {
  const c = s.cues;
  const Col: React.FC<{x: number; label: string; value: string; p: number; sub: string}> = ({x, label, value, p, sub}) => (
    <Abs x={x} y={250} w={760}>
      <Mono size={24} color={T.ink} p={Math.max(0.35, p)}>
        {label}
      </Mono>
      <div style={{fontFamily: T.serif, fontSize: 168, lineHeight: 1.1, color: T.ink, marginTop: 20, ...settle(p)}}>{value}</div>
      <Mono size={21} color={T.ink2} p={p} style={{marginTop: 18}}>
        {sub}
      </Mono>
    </Abs>
  );
  return (
    <Porcelain>
      <Col x={SAFE_L} label="CLAUDE CODE" value="≈ $9,400" p={pr(g, c.n1, 0.6)} sub="ON A $200 / MONTH PLAN" />
      <Col x={1000} label="CODEX · PRO ACCOUNT" value="≈ $3,600" p={pr(g, c.n2, 0.6)} sub="ON A $200 / MONTH PLAN" />
      <div style={{position: 'absolute', left: 960, top: 260, height: 330, borderLeft: `1px solid ${T.rule}`}} />
      <Abs y={720}>
        <Mono size={20} color={T.ink} p={pr(g, s.start, 0.5)}>
          30 DAYS · API LIST PRICE, NOT WHAT I PAID · ONE MACHINE
        </Mono>
      </Abs>
    </Porcelain>
  );
};

const Meter: SceneFC = ({s, g}) => (
  <Exhibit
    src="chart-meter.png"
    g={g}
    s={s}
    graphite
    notes={[
      {text: 'MY CODEX WEEKLY METER · PRO ACCOUNT · FROM SESSION LOGS', at: s.cues.label},
      {text: 'FIVE OF SIX WEEKLY WINDOWS AT 99–100%', at: s.cues.five, color: T.ink},
    ]}
  />
);

const Caveats: SceneFC = ({s, g}) => {
  const c = s.cues;
  return (
    <Porcelain>
      <Abs y={200}>
        <Serif size={66} p={pr(g, s.start, 0.5)}>
          Two caveats.
        </Serif>
      </Abs>
      <Abs y={340} w={1696}>
        <Row label="01 · API LIST PRICE" value="WHAT THE WORK WOULD HAVE COST, NOT WHAT I PAID" p={pr(g, c.c1, 0.6)} size={27} />
        <Row label="02 · ONE MACHINE" value="SO CODEX IS A FLOOR" p={pr(g, c.c2, 0.6)} size={27} />
      </Abs>
      <Abs y={580}>
        <Serif size={60} p={pr(g, c.receipt, 0.7)}>
          One heavy user's receipt, not a benchmark.
        </Serif>
      </Abs>
    </Porcelain>
  );
};

const WhichMeter: SceneFC = ({s, g}) => {
  const c = s.cues;
  return (
    <Porcelain>
      <Abs y={220} w={1300}>
        <Row label="BOTH PLANS" value="HEAVILY SUBSIDIZED" p={pr(g, s.start, 0.5)} size={28} width={1300} />
      </Abs>
      <Abs y={370} w={1500}>
        <Serif size={80} p={pr(g, c.q, 0.7)}>
          The question is which meter runs out first.
        </Serif>
      </Abs>
      <Abs y={660} w={1300}>
        <Row label="FOR ME" value="CODEX — THE ONE GETTING CUT IN HALF" p={pr(g, c.codex, 0.6)} size={28} width={1300} bold />
      </Abs>
    </Porcelain>
  );
};

// ---------------------------------------------------------------- slide 05 · the re-read (s16 + s17 share one receipt)
const Receipt: SceneFC = ({g}) => {
  const a = sceneById('s16-line-items');
  const b = sceneById('s17-the-reveal');
  const ca = a.cues;
  const cb = b.cues;
  const reveal = pr(g, cb.amber, 0.35, easeInOut); // row turns amber
  const overflow = pr(g, cb.amber + 0.1, 1.4, easeInOut); // bar runs off the paper
  const out = 1 - pr(g, b.start - 0.05, 0.3, easeInOut); // s16 right-side copy clears before s17 copy
  const small = pr(g, ca.small, 0.8, easeInOut);
  const expect = pr(g, ca.expect, 0.5);
  const items = ['FRESH INPUT', 'CACHE WRITES', 'CACHE READS', 'OUTPUT'];
  const rowY = (i: number) => 290 + i * 120;
  return (
    <Porcelain>
      <div style={{position: 'absolute', left: SAFE_L, top: 150, width: 640, height: 710, background: T.paper, boxShadow: '0 16px 44px rgba(30,33,36,0.12)'}} />
      <Abs x={SAFE_L + 40} y={186} w={560}>
        <Mono size={19} color={T.ink2}>
          30-DAY BILL · BY LINE ITEM
        </Mono>
        <Mono size={16} style={{marginTop: 10}}>
          API LIST PRICE, NOT WHAT I PAID · ONE MACHINE
        </Mono>
      </Abs>
      {items.map((label, i) => {
        const isReads = i === 2;
        const isOut = i === 3;
        const color = isReads && reveal > 0.5 ? T.amber : isOut && expect > 0.5 && reveal < 0.5 ? T.ink : i === 3 || isReads ? T.ink : T.ink2;
        return (
          <React.Fragment key={label}>
            <div style={{position: 'absolute', left: SAFE_L + 40, top: rowY(i), width: 560, fontFamily: T.mono, fontSize: 28, color, fontWeight: (isOut && expect > 0.5 && reveal < 0.5) || (isReads && reveal > 0.5) ? 700 : 400}}>
              {label}
            </div>
            <div style={{position: 'absolute', left: SAFE_L + 40, top: rowY(i) + 50, width: 560, height: 14, background: '#EEEBE4'}} />
          </React.Fragment>
        );
      })}
      {/* expected-cost outline around OUTPUT, released once the reveal starts */}
      <div style={{position: 'absolute', left: SAFE_L + 24, top: rowY(3) - 14, width: 592, height: 92, border: `2px solid ${T.ink}`, opacity: expect * (1 - reveal)}} />
      {/* output: a small slice */}
      <div style={{position: 'absolute', left: SAFE_L + 40, top: rowY(3) + 50, height: 14, width: 56 * small, background: T.ink}} />
      <div style={{position: 'absolute', left: SAFE_L + 40 + 72, top: rowY(3) + 42, fontFamily: T.mono, fontSize: 18, letterSpacing: 2, color: T.ink2, opacity: small}}>SMALL SLICE</div>
      {/* cache reads: the amber line runs off the paper, like the cover */}
      <div style={{position: 'absolute', left: SAFE_L + 40, top: rowY(2) + 42, height: 30, width: mix(overflow, 0, 1920 - SAFE_L - 40), background: T.amber, opacity: reveal}} />
      {/* s16 right side */}
      <Abs x={860} y={210} w={948} style={{opacity: out}}>
        <Serif size={60} p={pr(g, a.start, 0.5)}>
          I split the bill by line item.
        </Serif>
        <Sans size={36} p={expect} style={{marginTop: 70}}>
          I expected output tokens to be the big cost.
        </Sans>
        <div style={{marginTop: 34}}>
          <Row label="ASTRA OUTPUT" value="$50 / 1M TOKENS" p={pr(g, ca.astra, 0.6)} size={26} width={900} />
        </div>
        <Sans size={36} color={T.ink} p={small} style={{marginTop: 34}}>
          It was a small slice.
        </Sans>
      </Abs>
      {/* s17 right side */}
      <Abs x={860} y={210} w={948}>
        <Serif size={66} p={pr(g, b.start + 0.1, 0.6)}>
          The big number was <span style={{color: T.amber}}>cache reads</span>.
        </Serif>
      </Abs>
      <Abs x={860} y={650} w={948}>
        {[
          {at: cb.astra, label: 'GPT-6 ASTRA', value: '78%'},
          {at: cb.opus5, label: 'CLAUDE OPUS 5', value: '76%'},
          {at: cb.opus55, label: 'CLAUDE OPUS 5.5', value: '58%'},
        ].map((r, i) => (
          <Row key={i} label={r.label} value={r.value} valueColor={T.amber} p={pr(g, r.at, 0.55)} size={30} width={948} bold />
        ))}
        <Mono size={17} p={pr(g, cb.astra + 0.4, 0.6)} style={{marginTop: 18}}>
          CACHE READS AS A SHARE OF EACH MODEL'S LIST-PRICE COST
        </Mono>
      </Abs>
    </Porcelain>
  );
};

const Loop: SceneFC = ({s, g}) => {
  const c = s.cues;
  const nodes = ['load repo context', 'call a tool', 'read the result', 'think', 'go again'];
  const nodeCues = [c.n1, c.n2, c.n3, c.n4, c.n5];
  const W = 270;
  const H = 104;
  const Y = 330;
  const xs = nodes.map((_, i) => SAFE_L + i * (W + 86.5));
  const arc = pr(g, c.arc, 1.4, easeInOut);
  const arcPath = `M ${xs[4] + W / 2} ${Y + H + 6} C ${xs[4] + W / 2} ${Y + H + 190}, ${xs[0] + W / 2} ${Y + H + 190}, ${xs[0] + W / 2} ${Y + H + 12}`;
  const arcLen = 1720;
  return (
    <Porcelain>
      <Abs y={150}>
        <Serif size={58} color={g >= c.title ? T.ink : T.ink2}>
          An agent doesn't answer once. It runs a loop.
        </Serif>
      </Abs>
      <svg style={{position: 'absolute', inset: 0}} width={1920} height={1080} viewBox="0 0 1920 1080">
        {nodes.slice(1).map((_, i) => {
          const end = nodeCues[i + 1];
          const gap = end - nodeCues[i];
          const dur = Math.min(0.4, Math.max(0.2, gap * 0.6));
          const p = pr(g, end - dur, dur, easeInOut);
          const x1 = xs[i] + W + 8;
          const x2 = xs[i + 1] - 8;
          const len = x2 - x1;
          return (
            <g key={i}>
              <line x1={x1} y1={Y + H / 2} x2={x2} y2={Y + H / 2} stroke={T.ink} strokeWidth={3} strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
              <path d={`M ${x2 - 12} ${Y + H / 2 - 7} L ${x2} ${Y + H / 2} L ${x2 - 12} ${Y + H / 2 + 7} Z`} fill={T.ink} opacity={p >= 0.98 ? 1 : 0} />
            </g>
          );
        })}
        <path d={arcPath} fill="none" stroke={T.amber} strokeWidth={5} strokeDasharray={arcLen} strokeDashoffset={arcLen * (1 - arc)} />
        <path
          d={`M ${xs[0] + W / 2 - 9} ${Y + H + 26} L ${xs[0] + W / 2} ${Y + H + 10} L ${xs[0] + W / 2 + 9} ${Y + H + 26} Z`}
          fill={T.amber}
          opacity={arc >= 0.98 ? 1 : 0}
        />
      </svg>
      {nodes.map((label, i) => {
        const on = pr(g, nodeCues[i], 0.35);
        return (
          <div
            key={label}
            style={{
              position: 'absolute',
              left: xs[i],
              top: Y,
              width: W,
              height: H,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: T.paper,
              border: `2px solid ${on > 0.5 ? T.ink : T.faint}`,
              borderRadius: 4,
              fontFamily: T.sans,
              fontSize: 28,
              fontWeight: 600,
              color: on > 0.5 ? T.ink : T.muted,
              opacity: mix(on, 0.45, 1),
              boxShadow: on > 0.5 ? '0 6px 18px rgba(30,33,36,0.08)' : 'none',
            }}
          >
            {label}
          </div>
        );
      })}
      <Abs y={Y + H + 212} w={SAFE_W} style={{textAlign: 'center'}}>
        <div style={{fontFamily: T.mono, fontSize: 22, letterSpacing: 3, color: T.amber, ...settle(pr(g, c.arc + 1.4, 0.5))}}>
          EVERY TURN · RE-READ THE CONVERSATION SO FAR
        </div>
      </Abs>
      <Abs y={720} w={1500} x={210}>
        <Row label="CACHED" value="EACH RE-READ IS CHEAPER THAN FRESH INPUT" p={pr(g, c.cache, 0.6)} size={25} width={1500} />
        <Row label="BUT" value="THE VOLUME IS ENORMOUS" p={pr(g, c.volume, 0.6)} size={25} width={1500} bold />
      </Abs>
    </Porcelain>
  );
};

const Billion: SceneFC = ({s, g}) => {
  const c = s.cues;
  const num = pr(g, c.num, 0.7);
  return (
    <Porcelain>
      <Abs y={250}>
        <Mono size={24} color={T.ink} p={pr(g, s.start, 0.45)}>
          CLAUDE CODE · 30 DAYS · READ FROM CACHE
        </Mono>
      </Abs>
      <Abs y={320}>
        <div style={{fontFamily: T.serif, fontSize: 190, lineHeight: 1.1, color: num > 0.5 ? T.amber : T.faint, opacity: mix(num, 0.35, 1)}}>≈ 17 billion</div>
        <Sans size={44} color={T.ink} p={pr(g, s.start + 0.2, 0.5)} style={{marginTop: 10}}>
          tokens re-read from cache
        </Sans>
      </Abs>
      <Abs y={760}>
        <Mono size={18} p={pr(g, s.start + 0.4, 0.5)}>
          ONE MACHINE · FROM SESSION LOGS
        </Mono>
      </Abs>
    </Porcelain>
  );
};

const AstraCallback: SceneFC = ({s, g}) => {
  const c = s.cues;
  const enter = pr(g, s.start, 0.45, easeInOut);
  const w = 1000;
  const h = Math.round((w * 941) / 1672);
  return (
    <Porcelain>
      <div style={{position: 'absolute', left: SAFE_L, top: 160, width: w, height: h, opacity: enter, boxShadow: '0 18px 50px rgba(30,33,36,0.2)', overflow: 'hidden'}}>
        <Img src={media('astra-post.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      <Abs y={160 + h + 22} w={w}>
        <Mono size={17} p={pr(g, c.label, 0.6)}>
          COVER OF MY EARLIER POST · GENERATED ILLUSTRATION
        </Mono>
      </Abs>
      <Abs x={1180} y={170} w={628}>
        <Mono size={19} p={pr(g, c.label, 0.6)}>
          FROM MY POST · 2026-09-06
        </Mono>
        <Serif size={38} p={pr(g, c.label + 0.15, 0.6)} style={{marginTop: 12}}>
          I Put GPT-6 Astra to Work
        </Serif>
        <Sans size={27} p={pr(g, c.label + 0.4, 0.6)} style={{marginTop: 14}}>
          Praised: carrying a whole deployment without handing it back.
        </Sans>
        <div style={{marginTop: 54}}>
          <Serif size={46} p={pr(g, c.carry, 0.7)}>
            Carrying the whole job means <span style={{color: T.amber}}>re-reading it</span>, hundreds of times.
          </Serif>
        </div>
        <div style={{marginTop: 40}}>
          <Serif size={36} color={T.ink2} p={pr(g, c.praised, 0.7)}>
            The capability I praised is exactly what the bill is made of.
          </Serif>
        </div>
      </Abs>
    </Porcelain>
  );
};

// ---------------------------------------------------------------- slide 06
const CachePrice: SceneFC = ({s, g}) => {
  const c = s.cues;
  const col = pr(g, c.col, 0.6);
  const five = pr(g, c.five, 0.9, easeInOut);
  const rows = [
    {at: c.r1, m: 'GPT-6 Astra', v: ['$10', '$1.00', '$50']},
    {at: c.r2, m: 'Claude Opus 5', v: ['$5', '$0.50', '$25']},
    {at: c.r3, m: 'Claude Fable 5.1', v: ['$10', '$0.25', '$50']},
    {at: c.r4, m: 'Claude Opus 5.5', v: ['$4', '$0.20', '$20']},
    {at: c.r5, m: 'GPT-6.1 Sol', v: ['$2', '$0.10', '$10']},
  ];
  const X = {model: 0, input: 820, cache: 1160, output: 1580};
  const top = 300;
  const rowH = 70;
  const sideColor = col > 0.5 ? T.faint : T.ink;
  const b1 = 50 + rowH / 2 - 4;
  const b2 = 50 + 3 * rowH + rowH / 2 - 4;
  return (
    <Porcelain>
      <Abs y={130} w={1696}>
        <Serif size={54} p={pr(g, s.start, 0.5)}>
          For agent work, the price that matters
        </Serif>
        <Serif size={54} color={T.amber} p={col}>
          is the cache-read price.
        </Serif>
      </Abs>
      <div style={{position: 'absolute', left: SAFE_L, top, width: 1696, height: 480}}>
        {[
          ['MODEL', X.model, 'left'],
          ['INPUT', X.input, 'right'],
          ['CACHE READ', X.cache, 'right'],
          ['OUTPUT', X.output, 'right'],
        ].map(([label, x, align], i) => (
          <div
            key={label as string}
            style={{
              position: 'absolute',
              left: i === 0 ? 0 : (x as number) - 300,
              width: 300,
              textAlign: align as 'left' | 'right',
              top: 0,
              fontFamily: T.mono,
              fontSize: 19,
              letterSpacing: 2,
              color: i === 2 && col > 0.5 ? T.amber : T.muted,
              fontWeight: i === 2 && col > 0.5 ? 700 : 400,
            }}
          >
            {label}
          </div>
        ))}
        <div style={{position: 'absolute', left: 0, top: 36, width: 1696, borderTop: `2px solid ${T.ink}`}} />
        <div style={{position: 'absolute', left: X.cache - 190, top: 40, width: 210, height: 5 * rowH + 14, background: '#F3E6D8', opacity: col * 0.8}} />
        {rows.map((r, i) => {
          const p = pr(g, r.at, 0.55);
          return (
            <div key={r.m} style={{position: 'absolute', left: 0, top: 50 + i * rowH, width: 1696, height: rowH - 6, borderBottom: `1px solid ${T.rule}`, ...settle(p)}}>
              <div style={{position: 'absolute', left: 0, top: 10, fontFamily: T.sans, fontSize: 32, fontWeight: 500, color: T.ink}}>{r.m}</div>
              {[X.input, X.cache, X.output].map((x, j) => (
                <div
                  key={j}
                  style={{
                    position: 'absolute',
                    left: x - 200,
                    width: 200,
                    textAlign: 'right',
                    top: 10,
                    fontFamily: T.mono,
                    fontSize: 32,
                    fontWeight: j === 1 ? 700 : 400,
                    color: j === 1 ? (col > 0.5 ? T.amber : T.ink) : sideColor,
                  }}
                >
                  {r.v[j]}
                </div>
              ))}
            </div>
          );
        })}
        {/* 5× bracket: Astra vs Opus 5.5 cache-read price */}
        <svg style={{position: 'absolute', left: 0, top: 0}} width={1696} height={480}>
          <path
            d={`M ${X.cache + 24} ${b1} L ${X.cache + 44} ${b1} L ${X.cache + 44} ${b2} L ${X.cache + 24} ${b2}`}
            fill="none"
            stroke={T.amber}
            strokeWidth={3}
            strokeDasharray={600}
            strokeDashoffset={600 * (1 - five)}
          />
        </svg>
        <div style={{position: 'absolute', left: X.cache + 62, top: (b1 + b2) / 2 - 40, fontFamily: T.serif, fontSize: 64, color: T.amber, opacity: five >= 0.98 ? 1 : 0}}>5×</div>
      </div>
      <Abs y={772}>
        <Mono size={19} color={T.ink} p={pr(g, c.landed, 0.6)}>
          WHERE SEPTEMBER'S PRICE CUTS LANDED: THE LINE ITEM AGENTS BURN
        </Mono>
        <Mono size={16} p={pr(g, s.start + 0.3, 0.5)} style={{marginTop: 14}}>
          USD PER 1M TOKENS · OFFICIAL LIST PRICES · 2026-09-30
        </Mono>
      </Abs>
    </Porcelain>
  );
};

// ---------------------------------------------------------------- slide 07
const Verdict: SceneFC = ({s, g}) => {
  const c = s.cues;
  const ans = pr(g, c.answer, 0.7);
  return (
    <Porcelain>
      <Abs y={230}>
        <Serif size={60} color={ans > 0.5 ? T.ink2 : T.ink} p={pr(g, s.start, 0.5)}>
          Which plan is the better deal?
        </Serif>
      </Abs>
      <Abs y={380} w={1650}>
        <Serif size={88} p={ans}>
          For my September workload:
        </Serif>
        <Serif size={88} p={ans} style={{fontWeight: 700}}>
          Claude Max.
        </Serif>
      </Abs>
      <Abs y={640}>
        <Sans size={40} p={pr(g, c.more, 0.6)}>
          By more than I expected.
        </Sans>
      </Abs>
    </Porcelain>
  );
};

const BillExhibit: SceneFC = ({s, g}) => (
  <Exhibit
    src="chart-bill.png"
    g={g}
    s={s}
    notes={[
      {text: '30 DAYS AT API LIST PRICE · BY MODEL', at: s.cues.label},
      {text: 'SAME $200 PLAN ON EACH SIDE', at: s.cues.label + 0.4, color: T.ink},
      {text: '≈ $9,400 VS ≈ $3,600 OF WORK', at: s.cues.label + 0.8, color: T.ink},
      {text: 'CODEX: BEFORE THE METER CAPPED OUT', at: s.cues.capped, color: T.ink},
      {text: 'NOT WHAT I PAID · ONE MACHINE', at: s.cues.label + 1.2},
    ]}
  />
);

const Lever: SceneFC = ({s, g}) => {
  const c = s.cues;
  const v = pr(g, c.vendor, 0.6);
  const m = pr(g, c.model, 0.6);
  return (
    <Porcelain>
      <Abs y={270}>
        <Mono size={22} color={T.ink} p={pr(g, s.start, 0.4)}>
          THE BIGGER LEVER IN MY LOGS
        </Mono>
      </Abs>
      <Abs y={350}>
        <Serif size={96} color={v > 0.5 ? T.ink2 : T.faint} style={{opacity: mix(v, 0.4, 1)}}>
          It wasn't the vendor.
        </Serif>
      </Abs>
      <Abs y={480}>
        <Serif size={96} p={m}>
          It was the <span style={{fontWeight: 700}}>model</span>.
        </Serif>
      </Abs>
    </Porcelain>
  );
};

const Repricing: SceneFC = ({s, g}) => (
  <Exhibit
    src="chart-repricing.png"
    g={g}
    s={s}
    graphite
    notes={[
      {text: 'SAME TOKENS, REPRICED AT A CHEAPER MODEL FROM THE SAME VENDOR', at: s.cues.label},
      {text: 'PRICE ONLY · QUALITY NOT COMPARED', at: s.cues.label + 0.5},
      {text: 'ASTRA TOKENS AT GPT-6.1 SOL ≈ 12% OF THE COST', at: s.cues.twelve, color: T.ink},
      {text: 'OPUS 5 TOKENS AT OPUS 5.5 ≈ HALF', at: s.cues.half, color: T.ink},
    ]}
  />
);

const Bet: SceneFC = ({s, g}) => {
  const c = s.cues;
  return (
    <Porcelain>
      <Abs y={220}>
        <Mono size={22} color={T.ink} p={pr(g, s.start, 0.4)}>
          OPENAI'S BET WITH THIS PLAN
        </Mono>
      </Abs>
      <Abs y={290} w={1560}>
        <Serif size={64} color={g >= c.move ? T.ink : T.faint} style={{opacity: mix(pr(g, c.move, 0.6), 0.45, 1)}}>
          Move the work to the cheaper model, and the halved allowance covers the same work.
        </Serif>
      </Abs>
      <Abs y={580} w={1500}>
        <Sans size={42} color={T.ink} p={pr(g, c.q, 0.6)}>
          Can Sol do the work I've been giving Astra?
        </Sans>
      </Abs>
      <Abs y={690}>
        <Stamp p={pr(g, c.untested, 0.45)}>UNTESTED · A HYPOTHESIS</Stamp>
      </Abs>
    </Porcelain>
  );
};

// ---------------------------------------------------------------- slides 08-10
const Moves: SceneFC = ({s, g}) => {
  const c = s.cues;
  return (
    <Porcelain>
      <Abs y={150}>
        <Serif size={56} p={pr(g, s.start, 0.5)}>
          What I'm doing before October 29
        </Serif>
      </Abs>
      <Slot n="01" y={290} p={pr(g, c.m1, 0.6)} title="Claude Max stays my main tool." />
      <Slot
        n="02"
        y={430}
        p={pr(g, c.m2, 0.6)}
        title="Keep Pro 200 through Dec 31 — use the credits before they expire."
        sub={
          <span>
            NOT BUYING PRO 500<span style={{opacity: pr(g, c.m2c, 0.5)}}> · SAME UNIT PRICE, +$300 / MONTH, MOSTLY FOR SPEED</span>
          </span>
        }
        subP={pr(g, c.m2b, 0.6)}
      />
      <Slot
        n="03"
        y={620}
        p={pr(g, c.m3, 0.6)}
        title="October: a week of Codex on GPT-6.1 Sol, watching the meter."
        sub="IF SOL CARRIES MOST OF THE WORK, 10× MIGHT BE ENOUGH"
        subP={pr(g, c.m3b, 0.6)}
      />
    </Porcelain>
  );
};

const Chip: React.FC<{children: React.ReactNode; p: number; amber?: boolean}> = ({children, p, amber = false}) => (
  <span
    style={{
      display: 'inline-block',
      marginRight: 14,
      padding: '6px 14px',
      border: `2px solid ${amber ? T.amber : T.ink2}`,
      color: amber ? T.amber : T.ink2,
      fontFamily: T.mono,
      fontSize: 21,
      letterSpacing: 2,
      fontWeight: amber ? 700 : 400,
      ...settle(p),
    }}
  >
    {children}
  </span>
);

const Guesses: SceneFC = ({s, g}) => {
  const c = s.cues;
  return (
    <Porcelain>
      <Abs y={140}>
        <Serif size={56} p={pr(g, s.start, 0.5)}>
          What comes next
        </Serif>
        <Mono size={19} color={T.ink} p={pr(g, c.label, 0.6)} style={{marginTop: 16}}>
          MY INFERENCES · NOT ANYTHING EITHER COMPANY HAS SAID
        </Mono>
      </Abs>
      <Slot n="01" y={300} p={pr(g, c.g1, 0.6)} size={42} title="The “20×” language fades; the dollar budget becomes visible." sub="OPENAI HAS ALREADY DONE THE CONVERSION" subP={pr(g, c.g1b, 0.6)} />
      <Abs x={SAFE_L} y={450}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 36, borderTop: `1px solid ${pr(g, c.g2, 0.4) > 0 ? T.rule : T.faint}`, paddingTop: 18}}>
          <div style={{fontFamily: T.mono, fontSize: 26, color: g >= c.g2 ? T.ink : T.faint, width: 46}}>02</div>
          <div style={{flex: 1}}>
            <Serif size={42} p={pr(g, c.g2, 0.6)}>
              The price war moves to what agents consume.
            </Serif>
            <div style={{marginTop: 14}}>
              <Chip p={pr(g, c.g2a, 0.5)} amber>
                CHEAPER CACHE READS
              </Chip>
              <Chip p={pr(g, c.g2b, 0.5)}>A PREMIUM FOR SPEED</Chip>
            </div>
          </div>
        </div>
      </Abs>
      <Slot
        n="03"
        y={620}
        p={pr(g, c.g3, 0.6)}
        size={42}
        title="Heavy-user subsidies keep shrinking."
        sub="PUBLISHING THE EXCHANGE RATE BUILT THE DIAL FOR THE NEXT CAPACITY SQUEEZE"
        subP={pr(g, c.g3b, 0.6)}
      />
    </Porcelain>
  );
};

const Prepaid: SceneFC = ({s, g}) => {
  const c = s.cues;
  return (
    <Porcelain>
      <Abs y={250} w={1696}>
        <Serif size={76} p={pr(g, s.start, 0.5)}>
          Plan as if your subscription
        </Serif>
        <Serif size={76} p={pr(g, s.start + 0.1, 0.5)}>
          is a prepaid API budget,
        </Serif>
      </Abs>
      <Abs y={500} w={1696}>
        <Serif size={76} p={pr(g, c.pass, 0.6)} style={{fontWeight: 700}}>
          not an unlimited pass.
        </Serif>
      </Abs>
    </Porcelain>
  );
};

const Steps: SceneFC = ({s, g}) => {
  const c = s.cues;
  const sub1 = (
    <span>
      <span style={{opacity: pr(g, c.codex, 0.5)}}>CODEX: SESSION FILES</span>
      <span style={{opacity: pr(g, c.claude, 0.5)}}> · CLAUDE CODE: PROJECT LOGS</span>
      <span style={{opacity: pr(g, c.s1b, 0.5)}}> · TOKENS PER TURN</span>
    </span>
  );
  return (
    <Porcelain>
      <Abs y={128}>
        <Serif size={52} p={pr(g, s.start, 0.5)}>
          Price your own bill in four steps
        </Serif>
      </Abs>
      <Slot n="01" y={236} size={40} p={pr(g, c.s1, 0.6)} title="Find the logs." sub={sub1} subP={pr(g, c.codex, 0.4)} />
      <Abs x={SAFE_L} y={392}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 36, borderTop: `1px solid ${T.rule}`, paddingTop: 18}}>
          <div style={{fontFamily: T.mono, fontSize: 26, color: g >= c.s2 ? T.ink : T.faint, width: 46}}>02</div>
          <div style={{flex: 1}}>
            <Serif size={40} p={pr(g, c.s2, 0.6)}>
              Pull four numbers per model.
            </Serif>
            <div style={{marginTop: 12}}>
              <Chip p={pr(g, c.chips, 0.45)}>FRESH INPUT</Chip>
              <Chip p={pr(g, c.chips + 0.45, 0.45)}>CACHE WRITES</Chip>
              <Chip p={pr(g, c.chips + 0.9, 0.45)} amber>
                CACHE READS
              </Chip>
              <Chip p={pr(g, c.chips + 1.5, 0.45)}>OUTPUT</Chip>
            </div>
          </div>
        </div>
      </Abs>
      <Slot
        n="03"
        y={556}
        size={40}
        p={pr(g, c.s3, 0.6)}
        title="Multiply each by that model's list price."
        sub="E.G. MY OPUS 5 CACHE READS: 9.96B TOKENS × $0.50 / 1M ≈ $4,980 AT LIST"
        subP={pr(g, c.s3 + 0.6, 0.6)}
      />
      <Slot
        n="04"
        y={712}
        size={40}
        p={pr(g, c.s4, 0.6)}
        title={
          <span>
            Find your biggest line.{' '}
            <span style={{color: T.amber, opacity: pr(g, c.mine, 0.6)}}>For me: the re-read.</span>
          </span>
        }
      />
    </Porcelain>
  );
};

const Habits: SceneFC = ({s, g}) => {
  const c = s.cues;
  return (
    <Porcelain>
      <Abs y={150}>
        <Serif size={56} p={pr(g, s.start, 0.5)}>
          Then three habits
        </Serif>
      </Abs>
      <Slot n="01" y={290} p={pr(g, c.h1, 0.6)} title="Route by task, not loyalty." />
      <Slot
        n="02"
        y={430}
        p={pr(g, c.h2, 0.6)}
        title="Treat context as a cost."
        sub="LONG SESSIONS DRAGGING STALE FILES THROUGH HUNDREDS OF TURNS ARE THE BILL"
        subP={pr(g, c.h2b, 0.6)}
      />
      <Slot n="03" y={620} p={pr(g, c.h3, 0.6)} title="Stay portable." sub="SWITCHING IS A PRICING DECISION, NOT A MIGRATION" subP={pr(g, c.h3b, 0.6)} />
    </Porcelain>
  );
};

// ---------------------------------------------------------------- slide 11
const MeterCallback: SceneFC = ({s, g}) => (
  <Exhibit
    src="chart-meter.png"
    g={g}
    s={s}
    graphite
    notes={[
      {text: 'THE SAME METER · FIVE TIMES AT 100% LAST MONTH', at: s.cues.label},
      {text: 'WHAT WAS 100% WORTH?', at: s.cues.worth, color: T.ink},
    ]}
  />
);

const ReadBill: SceneFC = ({s, g}) => {
  const c = s.cues;
  return (
    <Porcelain>
      <Abs y={250} w={1650}>
        <Serif size={84} p={pr(g, s.start, 0.5)}>
          Now I know the unit.
        </Serif>
        <Serif size={84} p={pr(g, c.read, 0.6)}>
          I've read the bill.
        </Serif>
      </Abs>
      <Abs y={560}>
        <Sans size={42} color={T.ink} p={pr(g, c.angry, 0.6)}>
          I'm not angry about the change.
        </Sans>
        <Sans size={36} p={pr(g, c.clumsy, 0.6)} style={{marginTop: 18}}>
          The timing was clumsy.
        </Sans>
        <Sans size={36} p={pr(g, c.worse, 0.6)} style={{marginTop: 8}}>
          And plain words would have landed better.
        </Sans>
      </Abs>
    </Porcelain>
  );
};

const Exchange: SceneFC = ({s, g}) => {
  const c = s.cues;
  return (
    <Porcelain>
      <Abs y={300} w={1650}>
        <Serif size={78} p={pr(g, s.start, 0.5)}>
          A subscription with a published exchange rate
        </Serif>
        <Serif size={78} p={pr(g, c.honest, 0.6)} style={{marginTop: 10}}>
          is more honest than a <span style={{fontStyle: 'italic'}}>magic multiple</span>.
        </Serif>
      </Abs>
    </Porcelain>
  );
};

const Final: SceneFC = ({s, g}) => {
  const c = s.cues;
  const enter = pr(g, s.start, 0.45, easeInOut);
  const l2 = pr(g, c.l2, 0.7);
  const l3 = pr(g, c.l3, 0.8);
  return (
    <AbsoluteFill style={{backgroundColor: T.canvas}}>
      <Img src={media('cover.png')} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: enter}} />
      <Abs x={760} y={150} w={1050}>
        <Serif size={44} color={l2 > 0.5 ? T.muted : T.ink} p={pr(g, c.l1, 0.7)}>
          Engineers learned to read cloud bills because the bill decided what they could build.
        </Serif>
        <div style={{marginTop: 40}}>
          <Serif size={44} color={l3 > 0.5 ? T.muted : T.ink} p={l2}>
            AI coding bills are becoming that same kind of document.
          </Serif>
        </div>
        <div style={{marginTop: 48}}>
          <Serif size={66} p={l3}>
            Reading yours is now part of the job.
          </Serif>
        </div>
      </Abs>
    </AbsoluteFill>
  );
};

const EndCard: SceneFC = ({s, g}) => {
  const t = g - s.start;
  const dur = s.end - s.start;
  const enter = pr(t, 0, 0.9, easeInOut);
  const line = pr(t, 0.7, 0.7);
  const exit = pr(t, dur - 0.55, 0.5, easeInOut);
  const vis = enter * (1 - exit);
  return (
    <AbsoluteFill style={{backgroundColor: T.canvas, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', opacity: vis}}>
        <Img src={media('ag-logo.png')} style={{width: 120, height: 120, objectFit: 'contain', margin: '0 auto'}} />
        <div style={{marginTop: 28, fontFamily: T.sans, fontSize: 40, fontWeight: 700, letterSpacing: 6, color: T.ink}}>AARON GUO</div>
        <div style={{marginTop: 16, fontFamily: T.mono, fontSize: 20, letterSpacing: 4, color: T.muted, opacity: line}}>AI-NATIVE BUILDER · HUMAN-FIRST THINKER</div>
        <div style={{marginTop: 10, fontFamily: T.mono, fontSize: 18, letterSpacing: 3, color: T.muted, opacity: line}}>aaronguo.com</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- assembly
const KINDS: Record<string, SceneFC> = {
  cover: Cover,
  email: Email,
  priced: Priced,
  terms: Terms,
  tibo: Tibo,
  unit: Unit,
  perunit: PerUnit,
  flatrate: FlatRate,
  fivewords: FiveWords,
  otherside: OtherSide,
  setup: Setup,
  totals: Totals,
  meter: Meter,
  caveats: Caveats,
  whichmeter: WhichMeter,
  receipt: Receipt,
  loop: Loop,
  billion: Billion,
  astra: AstraCallback,
  price: CachePrice,
  verdict: Verdict,
  billchart: BillExhibit,
  lever: Lever,
  repricing: Repricing,
  bet: Bet,
  moves: Moves,
  guesses: Guesses,
  prepaid: Prepaid,
  steps: Steps,
  habits: Habits,
  metercallback: MeterCallback,
  readbill: ReadBill,
  exchange: Exchange,
  final: Final,
  end: EndCard,
  coldopen3d: ({s, g}) => <ColdOpen3D g={g} c={{...(s.cues as Omit<ColdCues, 'end'>), end: s.end}} header={<HeaderRail g={g} />} />,
  reread3d: ({s, g}) => <Reread3D g={g} c={{...(s.cues as Omit<RereadCues, 'start' | 'end'>), start: s.start, end: s.end}} />,
};

/** One frame of the film at absolute time g (seconds), without audio. */
const FilmFrame: React.FC<{g: number}> = ({g}) => {
  const s = data.scenes.find((x) => g >= x.start && g < x.end) ?? data.scenes[data.scenes.length - 1];
  const C = KINDS[s.kind];
  // Scene entry: clear the outgoing stage, then fade the new layout up from porcelain (8 frames).
  const fadeIn = s.fade ? interpolate(g, [s.start, s.start + 8 / FPS], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut}) : 1;
  return (
    <AbsoluteFill style={{backgroundColor: T.canvas}}>
      <AbsoluteFill style={{opacity: fadeIn}}>
        <C s={s} g={g} />
      </AbsoluteFill>
      {s.header ? <HeaderRail g={g} /> : null}
      {s.captions && g < data.narrationEnd + 0.2 ? <CaptionBar g={g} /> : null}
    </AbsoluteFill>
  );
};

export const AiBillFilm: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: T.canvas}}>
      <FilmFrame g={frame / FPS} />
      <Sequence from={Math.round(data.audioOffset * FPS)}>
        <Audio src={media(data.audio)} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Prototype slice for review: the 3D scenes (plus a short lead-in/out) back to back, with their narration.
const PROTO_IDS = ['s01-cold-open-3d', 's18-reread-3d'];
const PROTO_SEGMENTS = data.scenes
  .filter((x) => PROTO_IDS.includes(x.id))
  .map((x) => ({from: Math.round(Math.max(0, x.start - 1.5) * FPS), to: Math.round(Math.min(data.filmEnd, x.end + 1.5) * FPS)}));
const PROTO_FRAMES = PROTO_SEGMENTS.reduce((n, x) => n + x.to - x.from, 0);

const ProtoSegment: React.FC<{from: number}> = ({from}) => {
  const frame = useCurrentFrame();
  return <FilmFrame g={(from + frame) / FPS} />;
};

export const AiBill3DPrototype: React.FC = () => {
  let offset = 0;
  return (
    <AbsoluteFill style={{backgroundColor: T.canvas}}>
      {PROTO_SEGMENTS.map((seg) => {
        const at = offset;
        offset += seg.to - seg.from;
        return (
          <Sequence key={seg.from} from={at} durationInFrames={seg.to - seg.from}>
            <ProtoSegment from={seg.from} />
            <Sequence from={Math.max(0, Math.round(data.audioOffset * FPS) - seg.from)}>
              <Audio src={media(data.audio)} trimBefore={Math.max(0, seg.from - Math.round(data.audioOffset * FPS))} />
            </Sequence>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const Root: React.FC = () => (
  <>
    <Composition id="AiBillFilm" component={AiBillFilm} durationInFrames={Math.round(data.filmEnd * FPS)} fps={FPS} width={1920} height={1080} />
    {PROTO_FRAMES > 0 ? <Composition id="AiBill3DPrototype" component={AiBill3DPrototype} durationInFrames={PROTO_FRAMES} fps={FPS} width={1920} height={1080} /> : null}
  </>
);
registerRoot(Root);
