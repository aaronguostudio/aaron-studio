// Original continuous score for the Ledger Harness film (ledger-editorial-v0.1).
// Strategy per video-treatment.md: cello=consequence/money, felt piano=judgment,
// quiet analog pulse=the fleet; near-dry at the 44/3 signature; held chord end card.
import { writeFileSync } from "fs";

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) throw new Error("ELEVENLABS_API_KEY required");

const ARC = `Instrumental only. Compose an original restrained editorial technology documentary score for a 10 minute 6 second spoken essay about an open-source AI agent harness, its append-only ledger design, and what builders should own. One coherent palette: sustained low cello and warm bass harmonics for consequence and money, sparse felt-piano notes for human judgment, a very quiet soft analog pulse for a fleet of coding agents, warm paper-room texture. Keep generous spectral and rhythmic space for continuous narration; low energy, intelligent, precise, authored rather than generic ambient. Structural arc: 0:00-0:53 cello and pulse establish stakes under a numeric contradiction; 0:53-1:46 felt piano alone for a quiet quotation page; 1:46-3:39 piano leads with one low cello entrance as billing and a lawyer metaphor are examined; 3:39-4:19 the score thins to pulse only, preparing a dry precise passage; 4:19-5:02 nearly dry, the lowest pulse alone under the film's signature ledger scene; 5:02-6:19 cello returns under two crash stories, one deliberate silence, then piano answers as checks are counted; 6:19-7:45 the pulse steps forward for the fleet that built the system, piano answering on a payoff line; 7:45-8:46 near-silence for honest limits, then soft strings for a strategy comparison; 8:46-9:59 piano and cello resolve calmly as the conclusion sorts what travels from what is locked in; 9:59-10:06 a single held warm chord alone, fading to silence for the brand card. No drums, no stings, no trailer lifts, no melody competing with speech.`;

async function gen(prompt, ms, out) {
  const url = new URL("https://api.elevenlabs.io/v1/music");
  url.searchParams.set("output_format", "auto");
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "xi-api-key": KEY },
    body: JSON.stringify({ prompt, model_id: "music_v2", music_length_ms: ms, force_instrumental: true }),
  });
  if (!r.ok) {
    const body = await r.text();
    throw new Error(`HTTP ${r.status}: ${body.slice(0, 300)}`);
  }
  writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  return { songId: r.headers.get("song-id"), type: r.headers.get("content-type") };
}

const dir = new URL(".", import.meta.url).pathname;
const manifest = { generatedAt: null, model: "music_v2", strategy: "continuous original score", segments: [] };
try {
  const meta = await gen(ARC, 606000, dir + "score-full.audio");
  manifest.segments.push({ file: "score-full.audio", ms: 606000, ...meta, arc: "full film" });
  console.log("full-length generation succeeded");
} catch (e) {
  console.log("full-length failed:", e.message);
  console.log("falling back to two segments stitched at 301.6s chapter seam");
  const A = ARC.replace("10 minute 6 second", "5 minute 2 second") + " This is part one, ending on the dry precise passage with the low pulse still sounding.";
  const B = `Instrumental only. Part two of a restrained editorial documentary score (same palette: low cello, felt piano, quiet analog pulse, paper-room texture; no drums, no stings). 0:00-1:18 cello under two crash stories with one deliberate silence, piano answers as checks are counted; 1:18-2:44 the pulse steps forward for a fleet of coding agents, piano answering a payoff line; 2:44-3:45 near-silence for honest limits, then soft strings for a strategy comparison; 3:45-4:58 piano and cello resolve calmly; 4:58-5:05 a single held warm chord alone fading to silence.`;
  const a = await gen(A, 302000, dir + "score-a.audio");
  manifest.segments.push({ file: "score-a.audio", ms: 302000, ...a, arc: "0-301.6s" });
  const b = await gen(B, 305000, dir + "score-b.audio");
  manifest.segments.push({ file: "score-b.audio", ms: 305000, ...b, arc: "301.6-605.7s" });
}
manifest.generatedAt = new Date().toISOString();
writeFileSync(dir + "generation-manifest.json", JSON.stringify(manifest, null, 2));
console.log("done", JSON.stringify(manifest.segments.map(s => s.file)));
