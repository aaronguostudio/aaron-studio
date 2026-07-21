import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { DatabaseSync } from "node:sqlite";

const AUDIO_EXTENSIONS = new Set([".mp3", ".m4a", ".wav", ".aac", ".flac", ".ogg"]);
const VALID_TYPES = new Set(["music", "sound-effect", "image", "video", "visualizer-preset", "template"]);
const VALID_STATUSES = new Set(["experimental", "candidate", "approved", "archived"]);
const VALID_RIGHTS = new Set(["owned", "licensed", "public-source", "needs-verification", "restricted", "unknown"]);

const DEFAULT_CONFIG = {
  catalogRoot: "src/content/asset-library",
  databasePath: ".cache/asset-library/assets.sqlite",
  scanRoots: ["src/content/music-visualizer"],
  spectrumCatalog: "src/content/music-visualizer/spectrum-demos-v1/catalog.json",
  defaultStatuses: ["approved", "candidate"],
  hashConcurrency: 4,
  excludePathSegments: ["node_modules", ".git", "render-tmp", ".video-gen-cache"],
};

const MOOD_PATTERNS = {
  calm: /\b(calm|quiet|gentle|soft|peaceful|restful|serene|tranquil)\b/i,
  intimate: /\b(intimate|close-miked|personal|tender)\b/i,
  reflective: /\b(reflective|contemplative|meditative|thoughtful|reading)\b/i,
  minimal: /\b(minimal|minimalist|sparse|restrained|spacious)\b/i,
  warm: /\b(warm|cozy|felt|amber|earthy)\b/i,
  nocturnal: /\b(night|nocturne|midnight|afterhours|after-hours|moon)\b/i,
  cinematic: /\b(cinematic|film|score|soundtrack|dramatic)\b/i,
  dreamy: /\b(dream|dreamy|ethereal|floating|hazy|liminal)\b/i,
  dark: /\b(dark|obsidian|shadow|tense|ominous)\b/i,
  uplifting: /\b(uplifting|hopeful|bright|joyful|optimistic)\b/i,
  melancholic: /\b(melanchol|wistful|sad|longing)\b/i,
  energetic: /\b(energetic|driving|punchy|propulsive|intense)\b/i,
  lofi: /\b(lo-?fi|vinyl|tape|coffee)\b/i,
  ambient: /\b(ambient|atmosphere|soundscape|drone|texture)\b/i,
};

const QUERY_SYNONYMS = new Map([
  ["安静", ["calm", "quiet", "gentle", "minimal"]],
  ["平静", ["calm", "quiet", "ambient"]],
  ["钢琴", ["piano", "felt", "upright"]],
  ["短", ["short", "sting", "short-form"]],
  ["长", ["long", "long-form", "master"]],
  ["背景", ["background", "underscore", "narration-bed"]],
  ["旁白", ["narration", "underscore", "bed"]],
  ["声波", ["visualizer", "waveform", "spectrum"]],
  ["频谱", ["visualizer", "spectrum", "frequency"]],
  ["科技", ["technology", "digital", "system"]],
  ["循环", ["loop", "loopable"]],
  ["无人声", ["instrumental", "no vocals"]],
  ["高能量", ["energetic", "high energy", "driving"]],
  ["低能量", ["calm", "low energy", "gentle"]],
]);

function unique(values) {
  return [...new Set(values.filter((value) => value !== undefined && value !== null && value !== ""))];
}

function normalizeSlash(value) {
  return value.split(sep).join("/");
}

function safeJson(path, fallback = null) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJsonAtomic(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const temp = `${path}.tmp-${process.pid}`;
  writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(temp, path);
}

function writeTextAtomic(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const temp = `${path}.tmp-${process.pid}`;
  writeFileSync(temp, value);
  renameSync(temp, path);
}

function titleize(value) {
  return value
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "asset";
}

export function findRepoRoot(start = process.cwd()) {
  let current = resolve(start);
  while (true) {
    if (existsSync(join(current, "config", "aaron-studio.json"))) return current;
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  const fallback = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
  if (existsSync(join(fallback, "config", "aaron-studio.json"))) return fallback;
  throw new Error("Could not find Aaron Studio root (config/aaron-studio.json is missing)");
}

export function loadLibraryConfig(repoRoot = findRepoRoot()) {
  const studio = safeJson(join(repoRoot, "config", "aaron-studio.json"), {});
  const config = { ...DEFAULT_CONFIG, ...(studio.assetLibrary || {}) };
  return {
    ...config,
    repoRoot,
    catalogRootAbs: resolve(repoRoot, config.catalogRoot),
    databasePathAbs: resolve(repoRoot, config.databasePath),
    scanRootsAbs: config.scanRoots.map((root) => resolve(repoRoot, root)),
    spectrumCatalogAbs: resolve(repoRoot, config.spectrumCatalog),
  };
}

function walkFiles(root, excludedSegments = []) {
  if (!existsSync(root)) return [];
  const excluded = new Set(excludedSegments);
  const output = [];
  const stack = [root];
  while (stack.length) {
    const directory = stack.pop();
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith(".") && entry.name !== ".well-known") continue;
      if (excluded.has(entry.name)) continue;
      const path = join(directory, entry.name);
      if (entry.isDirectory()) stack.push(path);
      else if (entry.isFile()) output.push(path);
    }
  }
  return output;
}

function repoPath(repoRoot, path) {
  const absolute = resolve(path);
  const rel = relative(repoRoot, absolute);
  return rel.startsWith("..") ? normalizeSlash(absolute) : normalizeSlash(rel);
}

function storedPath(repoRoot, manifestDirectory, value) {
  if (!value || typeof value !== "string") return null;
  if (isAbsolute(value)) return resolve(value);
  const fromManifest = resolve(manifestDirectory, value);
  if (existsSync(fromManifest)) return fromManifest;
  return resolve(repoRoot, value);
}

function collectFileReferences(value, manifestDirectory, repoRoot, output = []) {
  if (!value) return output;
  if (Array.isArray(value)) {
    for (const item of value) collectFileReferences(item, manifestDirectory, repoRoot, output);
    return output;
  }
  if (typeof value !== "object") return output;
  for (const [key, item] of Object.entries(value)) {
    if ((key === "file" || key.endsWith("Path") || key.endsWith("_path")) && typeof item === "string") {
      const candidate = storedPath(repoRoot, manifestDirectory, item);
      if (candidate && AUDIO_EXTENSIONS.has(extname(candidate).toLowerCase())) output.push(candidate);
    } else {
      collectFileReferences(item, manifestDirectory, repoRoot, output);
    }
  }
  return output;
}

function manifestPriority(path) {
  if (path.endsWith("generation-manifest.json")) return 0;
  if (path.includes(".generation-manifest.json")) return 1;
  if (path.includes("stitch-manifest.json")) return 2;
  return 3;
}

function discoverManifests(config, allFiles) {
  const manifests = [];
  const byAudioPath = new Map();
  for (const path of allFiles) {
    const name = basename(path);
    if (!/manifest\.json$/i.test(name)) continue;
    const data = safeJson(path);
    if (!data || typeof data !== "object") continue;
    const item = { path, relPath: repoPath(config.repoRoot, path), data };
    manifests.push(item);
    for (const audioPath of unique(collectFileReferences(data, dirname(path), config.repoRoot))) {
      const list = byAudioPath.get(resolve(audioPath)) || [];
      list.push(item);
      byAudioPath.set(resolve(audioPath), list);
    }
  }
  for (const list of byAudioPath.values()) list.sort((a, b) => manifestPriority(a.path) - manifestPriority(b.path));
  return { manifests, byAudioPath };
}

function siblingManifests(audioPath, manifests) {
  const directory = dirname(audioPath);
  const stem = basename(audioPath, extname(audioPath));
  return manifests
    .filter((item) => {
      if (dirname(item.path) !== directory) return false;
      const name = basename(item.path);
      return name === "generation-manifest.json" || name === `${stem}.generation-manifest.json` || name.startsWith(`${stem}.`);
    })
    .sort((a, b) => manifestPriority(a.path) - manifestPriority(b.path));
}

async function hashFile(path) {
  return new Promise((resolveHash, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(path);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolveHash(hash.digest("hex")));
  });
}

async function mapLimit(values, limit, worker) {
  const results = new Array(values.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.max(1, Math.min(limit, values.length || 1)) }, async () => {
    while (cursor < values.length) {
      const index = cursor++;
      results[index] = await worker(values[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

function probeAudio(path) {
  const result = spawnSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration,bit_rate,format_name:stream=codec_name,sample_rate,channels",
    "-of", "json",
    path,
  ], { encoding: "utf8", timeout: 60_000 });
  if (result.status !== 0) return { error: String(result.stderr || "ffprobe failed").trim() };
  const data = JSON.parse(result.stdout || "{}");
  const stream = data.streams?.[0] || {};
  return {
    durationSec: Number(data.format?.duration || 0),
    bitRate: Number(data.format?.bit_rate || 0),
    format: data.format?.format_name || extname(path).slice(1),
    codec: stream.codec_name || undefined,
    sampleRate: Number(stream.sample_rate || 0),
    channels: Number(stream.channels || 0),
  };
}

function mimeFor(path) {
  return {
    ".mp3": "audio/mpeg",
    ".m4a": "audio/mp4",
    ".wav": "audio/wav",
    ".aac": "audio/aac",
    ".flac": "audio/flac",
    ".ogg": "audio/ogg",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".mp4": "video/mp4",
  }[extname(path).toLowerCase()] || "application/octet-stream";
}

function durationBucket(durationSec) {
  if (durationSec <= 8) return "sting";
  if (durationSec <= 60) return "short";
  if (durationSec <= 240) return "medium";
  return "long";
}

function inferAudioSubtype(paths, durationSec) {
  const text = paths.join(" ").toLowerCase();
  if (/sample|preview/.test(text)) return "preview";
  if (/section|movement|chapter/.test(text)) return "section";
  if (/master|10min|long-night/.test(text) || durationSec > 240) return "long-form-master";
  if (durationSec <= 8) return "sting";
  if (durationSec <= 60) return "short-track";
  return "track";
}

function inferSemantics(text, durationSec, subtype) {
  const moods = Object.entries(MOOD_PATTERNS).filter(([, pattern]) => pattern.test(text)).map(([mood]) => mood);
  const high = /\b(energetic|driving|intense|punchy|propulsive|high energy|crescendo)\b/i.test(text);
  const low = /\b(calm|quiet|gentle|soft|sparse|minimal|low dynamic|sleep|reading)\b/i.test(text);
  const dynamic = /\b(crescendo|build|climax|dynamic|movement)\b/i.test(text) && high;
  const energy = dynamic ? "dynamic" : high ? "high" : low ? "low" : "medium";
  const useCases = [durationSec <= 60 ? "short-form" : durationSec > 240 ? "long-form" : "medium-form", "audio-visualization"];
  if (/\b(reading|deep work|focus|study)\b/i.test(text)) useCases.push("deep-work", "reading");
  if (/\b(sleep|rest|night preparation)\b/i.test(text)) useCases.push("sleep");
  if (/\b(background|underscore|narration|low dynamic|ambient)\b/i.test(text)) useCases.push("narration-bed");
  if (subtype === "preview" || durationSec <= 60) useCases.push("audition", "short-video");
  const topics = [];
  if (/\b(ai|artificial intelligence|system|digital|technology)\b/i.test(text)) topics.push("technology");
  if (/\b(nature|forest|water|rain|tide|garden|moss|field)\b/i.test(text)) topics.push("nature");
  if (/\b(city|urban|transit|architecture|room)\b/i.test(text)) topics.push("place");
  const tags = [];
  for (const word of ["piano", "guitar", "synth", "strings", "drone", "percussion", "lofi", "ambient", "cinematic", "acoustic"]) {
    if (new RegExp(`\\b${word}\\b`, "i").test(text)) tags.push(word);
  }
  const instrumental = /instrumental only|no vocals|without vocals/i.test(text) ? true : /\bvocal|lyrics|singer\b/i.test(text) ? false : null;
  return {
    semantics: { moods: unique(moods), energy, use_cases: unique(useCases), topics: unique(topics), tags: unique(tags) },
    instrumental,
  };
}

function inferRights(manifests) {
  const note = manifests.map((item) => item.data.commercialUseNote || item.data.rightsNote || "").find(Boolean) || "";
  const explicit = manifests.map((item) => item.data.rights).find((value) => typeof value === "string");
  if (explicit && VALID_RIGHTS.has(explicit)) {
    return { status: explicit, commercial_use: explicit === "owned" || explicit === "licensed", ...(note ? { note } : {}) };
  }
  if (/verify|confirm|check|needs? review|before commercial/i.test(note)) {
    return { status: "needs-verification", commercial_use: null, note };
  }
  return { status: "unknown", commercial_use: null, ...(note ? { note } : {}) };
}

function canonicalPathScore(path) {
  const normalized = normalizeSlash(path).toLowerCase();
  let score = normalized.length / 1000;
  if (normalized.includes("/spectrum-demos-v1/")) score += 100;
  if (normalized.includes("/render-tmp")) score += 80;
  if (normalized.includes("/exports/")) score += 40;
  if (normalized.includes("/preview")) score += 20;
  if (basename(normalized).includes("sample")) score += 20;
  return score;
}

function chooseTitle(canonicalPath, manifests) {
  const manifestTitle = manifests.map((item) => item.data.title).find((value) => typeof value === "string" && value.trim());
  const stem = basename(canonicalPath, extname(canonicalPath));
  const parent = titleize(basename(dirname(canonicalPath)).replace(/-v\d+$/i, ""));
  if (manifestTitle && !/^(frequency field|music visualizer)/i.test(manifestTitle)) return manifestTitle.trim();
  if (/^(music|audio|master)$/i.test(stem)) return parent;
  if (/^(section|movement|chapter)[-_ ]?\d+/i.test(stem)) return `${parent} / ${titleize(stem)}`;
  return titleize(stem);
}

function usageMapFromEvents(events) {
  const map = new Map();
  for (const event of events) {
    if (!event?.asset_id || !event?.project || !event?.recorded_at) continue;
    const current = map.get(event.asset_id) || [];
    current.push({ project: event.project, ...(event.role ? { role: event.role } : {}), recorded_at: event.recorded_at });
    map.set(event.asset_id, current);
  }
  return map;
}

function readJsonLines(path) {
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8").split(/\r?\n/).filter(Boolean).flatMap((line) => {
    try { return [JSON.parse(line)]; } catch { return []; }
  });
}

function applyUsage(asset, usageMap) {
  const usedIn = usageMap.get(asset.id) || [];
  asset.usage = {
    use_count: usedIn.length,
    last_used_at: usedIn.length ? usedIn.map((item) => item.recorded_at).sort().at(-1) : null,
    used_in: usedIn,
  };
  return asset;
}

function applyCuration(asset, curation) {
  const override = curation?.assets?.[asset.id];
  if (!override) return asset;
  if (override.title) asset.title = override.title;
  if (override.summary !== undefined) asset.summary = override.summary;
  if (override.subtype) asset.subtype = override.subtype;
  if (override.status) asset.quality.status = override.status;
  if (override.rating) asset.quality.rating = Number(override.rating);
  if (override.approved_at) asset.quality.approved_at = override.approved_at;
  if (override.note) asset.quality.qa_notes = unique([...asset.quality.qa_notes, override.note]);
  for (const key of ["moods", "use_cases", "topics", "tags"]) {
    if (Array.isArray(override[key])) asset.semantics[key] = unique(override[key]);
  }
  if (override.energy) asset.semantics.energy = override.energy;
  if (override.rights) asset.rights = { ...asset.rights, ...override.rights };
  return asset;
}

function rebuildSearchText(asset) {
  asset.search_text = unique([
    asset.id,
    asset.type,
    asset.subtype,
    asset.title,
    asset.summary,
    asset.semantics.energy,
    ...asset.semantics.moods,
    ...asset.semantics.use_cases,
    ...asset.semantics.topics,
    ...asset.semantics.tags,
    asset.rights.status,
    asset.provenance.provider,
    asset.provenance.model,
    asset.provenance.prompt,
    ...asset.files.map((file) => file.path),
  ]).join(" ");
  return asset;
}

function createAudioAsset(group, config, manifestIndex, indexedAt) {
  const paths = group.items.map((item) => item.path).sort((a, b) => canonicalPathScore(a) - canonicalPathScore(b));
  const canonicalPath = paths[0];
  const linkedManifests = unique(paths.flatMap((path) => [
    ...(manifestIndex.byAudioPath.get(resolve(path)) || []),
    ...siblingManifests(path, manifestIndex.manifests),
  ]).map((item) => item.relPath)).map((relPath) => manifestIndex.manifests.find((item) => item.relPath === relPath)).filter(Boolean);
  const prompt = linkedManifests.map((item) => item.data.prompt).find((value) => typeof value === "string" && value.trim()) || "";
  const title = chooseTitle(canonicalPath, linkedManifests);
  const durationSec = group.items.map((item) => item.probe.durationSec).find((value) => Number.isFinite(value) && value > 0) || 0;
  const subtype = inferAudioSubtype(paths, durationSec);
  const inferred = inferSemantics(`${title} ${prompt} ${paths.join(" ")}`, durationSec, subtype);
  const primary = group.items.find((item) => item.path === canonicalPath) || group.items[0];
  const provider = linkedManifests.map((item) => item.data.provider).find(Boolean);
  const model = linkedManifests.map((item) => item.data.model).find(Boolean);
  const generatedAt = linkedManifests.map((item) => item.data.generatedAt || item.data.createdAt).find(Boolean);
  const status = subtype === "preview" ? "experimental" : "candidate";
  const relPaths = paths.map((path) => repoPath(config.repoRoot, path));
  const files = paths.map((path, index) => {
    const item = group.items.find((candidate) => candidate.path === path);
    return {
      role: index === 0 ? "master" : "alternate",
      path: repoPath(config.repoRoot, path),
      sha256: group.sha256,
      mime_type: mimeFor(path),
      size_bytes: item?.size || statSync(path).size,
    };
  });
  const source = linkedManifests.map((item) => item.data.source).find(Boolean);
  const asset = {
    schema_version: 1,
    id: `music:${group.sha256.slice(0, 16)}`,
    type: "music",
    subtype,
    title,
    summary: inferred.semantics.moods.length
      ? `${inferred.semantics.moods.join(", ")} ${subtype.replaceAll("-", " ")}`
      : subtype.replaceAll("-", " "),
    files,
    technical: {
      duration_sec: Number(durationSec.toFixed(3)),
      duration_bucket: durationBucket(durationSec),
      format: primary.probe.format || extname(canonicalPath).slice(1),
      ...(primary.probe.codec ? { codec: primary.probe.codec } : {}),
      ...(primary.probe.sampleRate ? { sample_rate_hz: primary.probe.sampleRate } : {}),
      ...(primary.probe.channels ? { channels: primary.probe.channels } : {}),
      ...(primary.probe.bitRate ? { bit_rate_bps: primary.probe.bitRate } : {}),
      loopable: /loop/i.test(`${title} ${prompt} ${relPaths.join(" ")}`) ? true : null,
      instrumental: inferred.instrumental,
    },
    semantics: inferred.semantics,
    quality: {
      status,
      qa_notes: unique(group.items.flatMap((item) => item.probe.error ? [`ffprobe: ${item.probe.error}`] : [])),
    },
    rights: inferRights(linkedManifests),
    provenance: {
      source_type: prompt || provider || model ? "generated" : source === "local-audio" ? "local" : "unknown",
      ...(provider ? { provider } : {}),
      ...(model ? { model } : {}),
      ...(prompt ? { prompt } : {}),
      ...(generatedAt ? { created_at: generatedAt } : {}),
      manifest_paths: linkedManifests.map((item) => item.relPath),
    },
    relations: { derived_from: [], variants: [], demonstrated_with: [], paired_with: [] },
    usage: { use_count: 0, last_used_at: null, used_in: [] },
    search_text: "",
    indexed_at: indexedAt,
  };
  return rebuildSearchText(asset);
}

function existingFileRecord(config, path, role) {
  if (!existsSync(path)) return null;
  return {
    role,
    path: repoPath(config.repoRoot, path),
    mime_type: mimeFor(path),
    size_bytes: statSync(path).size,
  };
}

function createSpectrumAssets(config, audioByPath, indexedAt) {
  if (!existsSync(config.spectrumCatalogAbs)) return [];
  const catalog = safeJson(config.spectrumCatalogAbs, {});
  const root = dirname(config.spectrumCatalogAbs);
  const skins = (catalog.availableSkins || []).map((skin) => skin.theme);
  return (catalog.styles || []).map((style) => {
    const directory = join(root, style.slug);
    const audioPath = join(directory, "music.mp3");
    const audioAsset = audioByPath.get(resolve(audioPath));
    const configPath = join(directory, "render-config.json");
    const previewPath = join(directory, "preview.png");
    const contactSheetPath = join(directory, "contact-sheet.jpg");
    const renderPath = join(directory, `${style.slug}.mp4`);
    const analysisPath = join(directory, "audio-analysis.json");
    const files = [
      existingFileRecord(config, configPath, "config"),
      existingFileRecord(config, previewPath, "preview"),
      existingFileRecord(config, contactSheetPath, "image"),
      existingFileRecord(config, analysisPath, "analysis"),
      existingFileRecord(config, renderPath, "render"),
    ].filter(Boolean);
    const durationSec = audioAsset?.technical?.duration_sec || Number(catalog.sourceReference?.reviewedDurationSec || 0);
    const asset = {
      schema_version: 1,
      id: `visualizer:${slugify(style.id)}:v1`,
      type: "visualizer-preset",
      subtype: style.family || "spectrum",
      title: style.name || titleize(style.slug),
      summary: style.sourceEvidence || `${style.family || "spectrum"} audio visualizer preset`,
      files,
      technical: {
        ...(durationSec ? { duration_sec: Number(durationSec.toFixed(3)), duration_bucket: durationBucket(durationSec) } : {}),
        width: 1920,
        height: 1080,
        aspect_ratio: "16:9",
        fps: Number(catalog.sharedAnalysis?.fps || 30),
        loopable: null,
        instrumental: null,
      },
      semantics: {
        moods: [],
        energy: "dynamic",
        use_cases: ["audio-visualization", "music-video", "video-background"],
        topics: ["sound", "frequency"],
        tags: unique([style.family, style.id, style.slug, ...skins]),
      },
      quality: { status: "candidate", qa_notes: ["Spectrum library render QA passed; creative polish remains reviewable."] },
      rights: { status: "owned", commercial_use: true, source_url: catalog.sourceReference?.url || "" },
      provenance: {
        source_type: "derived",
        generator: "tiles/music-visualizer/scripts/render-spectrum-library.mjs",
        source_url: catalog.sourceReference?.url || "",
        manifest_paths: [repoPath(config.repoRoot, config.spectrumCatalogAbs)],
      },
      relations: {
        derived_from: [],
        variants: [],
        demonstrated_with: audioAsset ? [audioAsset.id] : [],
        paired_with: [],
      },
      usage: { use_count: 0, last_used_at: null, used_in: [] },
      search_text: "",
      indexed_at: indexedAt,
    };
    return rebuildSearchText(asset);
  });
}

function loadHashCache(config) {
  const path = join(dirname(config.databasePathAbs), "hash-cache.json");
  return { path, data: safeJson(path, { version: 1, files: {} }) };
}

async function inspectAudioFiles(config, paths) {
  const cache = loadHashCache(config);
  const inspected = await mapLimit(paths, Number(config.hashConcurrency || 4), async (path) => {
    const stat = statSync(path);
    const key = repoPath(config.repoRoot, path);
    const cached = cache.data.files[key];
    const sha256 = cached && cached.size === stat.size && cached.mtimeMs === stat.mtimeMs
      ? cached.sha256
      : await hashFile(path);
    cache.data.files[key] = { size: stat.size, mtimeMs: stat.mtimeMs, sha256 };
    return { path, size: stat.size, sha256, probe: probeAudio(path) };
  });
  writeJsonAtomic(cache.path, cache.data);
  return inspected;
}

function groupAudioByHash(inspected) {
  const groups = new Map();
  for (const item of inspected) {
    const group = groups.get(item.sha256) || { sha256: item.sha256, items: [] };
    group.items.push(item);
    groups.set(item.sha256, group);
  }
  return [...groups.values()];
}

function catalogPaths(config) {
  return {
    assets: join(config.catalogRootAbs, "assets.jsonl"),
    summary: join(config.catalogRootAbs, "summary.json"),
    curation: join(config.catalogRootAbs, "curation.json"),
    usage: join(config.catalogRootAbs, "usage.jsonl"),
    gallery: join(config.catalogRootAbs, "index.html"),
  };
}

function ensureCatalogSources(config) {
  const paths = catalogPaths(config);
  mkdirSync(config.catalogRootAbs, { recursive: true });
  if (!existsSync(paths.curation)) writeJsonAtomic(paths.curation, { schema_version: 1, assets: {} });
  if (!existsSync(paths.usage)) writeFileSync(paths.usage, "");
  return paths;
}

function sortedAssets(assets) {
  return assets.sort((a, b) => a.type.localeCompare(b.type) || a.title.localeCompare(b.title) || a.id.localeCompare(b.id));
}

function writeAssetsJsonl(path, assets) {
  writeTextAtomic(path, assets.map((asset) => JSON.stringify(asset)).join("\n") + (assets.length ? "\n" : ""));
}

function buildSummary(assets, extra = {}) {
  const countBy = (key) => Object.fromEntries([...new Set(assets.map((asset) => key(asset)))].sort().map((value) => [value, assets.filter((asset) => key(asset) === value).length]));
  return {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    asset_count: assets.length,
    by_type: countBy((asset) => asset.type),
    by_status: countBy((asset) => asset.quality.status),
    by_rights: countBy((asset) => asset.rights.status),
    total_source_files: assets.reduce((sum, asset) => sum + asset.files.length, 0),
    duplicate_source_files: assets.filter((asset) => asset.type === "music").reduce((sum, asset) => sum + Math.max(0, asset.files.length - 1), 0),
    ...extra,
  };
}

function createDatabase(config, assets, events) {
  mkdirSync(dirname(config.databasePathAbs), { recursive: true });
  rmSync(config.databasePathAbs, { force: true });
  const db = new DatabaseSync(config.databasePathAbs);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE assets (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      subtype TEXT,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      rating INTEGER,
      rights_status TEXT NOT NULL,
      duration_sec REAL,
      duration_bucket TEXT,
      energy TEXT,
      aspect_ratio TEXT,
      use_count INTEGER NOT NULL,
      last_used_at TEXT,
      search_text TEXT NOT NULL,
      record_json TEXT NOT NULL
    );
    CREATE VIRTUAL TABLE assets_fts USING fts5(id UNINDEXED, title, summary, search_text, tokenize='unicode61');
    CREATE TABLE usages (asset_id TEXT NOT NULL, project TEXT NOT NULL, role TEXT, recorded_at TEXT NOT NULL);
    CREATE INDEX idx_assets_filters ON assets(type, status, rights_status, duration_sec);
    CREATE INDEX idx_usages_asset ON usages(asset_id, recorded_at);
  `);
  const insertAsset = db.prepare(`INSERT INTO assets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertFts = db.prepare(`INSERT INTO assets_fts VALUES (?, ?, ?, ?)`);
  const insertUsage = db.prepare(`INSERT INTO usages VALUES (?, ?, ?, ?)`);
  db.exec("BEGIN");
  try {
    for (const asset of assets) {
      insertAsset.run(
        asset.id,
        asset.type,
        asset.subtype || null,
        asset.title,
        asset.quality.status,
        asset.quality.rating || null,
        asset.rights.status,
        asset.technical.duration_sec || null,
        asset.technical.duration_bucket || null,
        asset.semantics.energy,
        asset.technical.aspect_ratio || null,
        asset.usage.use_count,
        asset.usage.last_used_at,
        asset.search_text,
        JSON.stringify(asset),
      );
      insertFts.run(asset.id, asset.title, asset.summary, asset.search_text);
    }
    for (const event of events) insertUsage.run(event.asset_id, event.project, event.role || null, event.recorded_at);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    db.close();
    throw error;
  }
  db.close();
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[char]);
}

function relativeMediaPath(config, stored) {
  const absolute = isAbsolute(stored) ? stored : resolve(config.repoRoot, stored);
  return normalizeSlash(relative(config.catalogRootAbs, absolute));
}

function createGallery(config, assets) {
  const cards = assets.map((asset) => {
    const preview = asset.files.find((file) => file.role === "preview" || file.role === "image");
    const audio = asset.type === "music" ? asset.files.find((file) => file.role === "master") : null;
    const media = preview
      ? `<img loading="lazy" src="${escapeHtml(relativeMediaPath(config, preview.path))}" alt="">`
      : audio
        ? `<audio controls preload="none" src="${escapeHtml(relativeMediaPath(config, audio.path))}"></audio>`
        : `<div class="placeholder">${escapeHtml(asset.type)}</div>`;
    const duration = asset.technical.duration_sec ? `${Math.round(asset.technical.duration_sec)}s` : "";
    return `<article class="card" data-search="${escapeHtml(asset.search_text.toLowerCase())}" data-type="${escapeHtml(asset.type)}" data-status="${escapeHtml(asset.quality.status)}">
      <div class="media">${media}</div>
      <div class="body">
        <div class="eyebrow"><span>${escapeHtml(asset.type)}</span><span>${escapeHtml(asset.quality.status)}</span><span>rights:${escapeHtml(asset.rights.status)}</span><span>${escapeHtml(duration)}</span></div>
        <h2>${escapeHtml(asset.title)}</h2>
        <p>${escapeHtml(asset.summary)}</p>
        <div class="tags">${asset.semantics.moods.concat(asset.semantics.use_cases).slice(0, 6).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        <code>${escapeHtml(asset.id)}</code>
      </div>
    </article>`;
  }).join("\n");
  const counts = buildSummary(assets);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Aaron Studio Asset Library</title>
<style>
:root{color-scheme:dark;--bg:#0d0e0f;--panel:#17191b;--line:#2b2e31;--ink:#f3eee3;--muted:#a6a49f;--accent:#d9b36c}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 ui-sans-serif,system-ui,-apple-system,sans-serif}header{position:sticky;top:0;z-index:2;padding:28px clamp(20px,5vw,72px);background:rgba(13,14,15,.92);backdrop-filter:blur(18px);border-bottom:1px solid var(--line)}h1{margin:0 0 6px;font:500 clamp(28px,4vw,48px)/1.05 ui-serif,Georgia,serif}header p{margin:0 0 18px;color:var(--muted)}.controls{display:grid;grid-template-columns:minmax(220px,1fr) auto auto;gap:10px}input,select{border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);padding:11px 13px}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;padding:28px clamp(20px,5vw,72px) 72px}.card{overflow:hidden;border:1px solid var(--line);border-radius:16px;background:var(--panel)}.media{display:grid;place-items:center;min-height:150px;background:#111315}.media img{display:block;width:100%;height:190px;object-fit:cover}.media audio{width:90%}.placeholder{color:var(--muted);font-size:12px;letter-spacing:.15em;text-transform:uppercase}.body{padding:18px}.eyebrow{display:flex;gap:8px;color:var(--accent);font-size:11px;text-transform:uppercase;letter-spacing:.08em}.eyebrow span+span:before{content:"·";margin-right:8px;color:var(--muted)}h2{margin:10px 0 7px;font:500 23px/1.15 ui-serif,Georgia,serif}.body p{min-height:44px;margin:0 0 13px;color:var(--muted)}.tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}.tags span{padding:3px 7px;border:1px solid var(--line);border-radius:999px;color:#c9c6bf;font-size:11px}code{display:block;overflow:hidden;text-overflow:ellipsis;color:#817f7a;font-size:10px}.hidden{display:none}@media(max-width:640px){.controls{grid-template-columns:1fr}header{position:static}}
</style></head>
<body><header><h1>Aaron Studio Asset Library</h1><p>${counts.asset_count} assets · generated ${escapeHtml(counts.generated_at)}</p><div class="controls"><input id="q" type="search" placeholder="Search mood, use case, title, ID…"><select id="type"><option value="">All types</option>${Object.keys(counts.by_type).map((type) => `<option>${escapeHtml(type)}</option>`).join("")}</select><select id="status"><option value="">All statuses</option>${Object.keys(counts.by_status).map((status) => `<option>${escapeHtml(status)}</option>`).join("")}</select></div></header>
<main>${cards}</main>
<script>const q=document.querySelector('#q'),t=document.querySelector('#type'),s=document.querySelector('#status'),cards=[...document.querySelectorAll('.card')];function filter(){const text=q.value.toLowerCase().trim();for(const card of cards){card.classList.toggle('hidden',!!((text&&!card.dataset.search.includes(text))||(t.value&&card.dataset.type!==t.value)||(s.value&&card.dataset.status!==s.value)))}}[q,t,s].forEach(el=>el.addEventListener('input',filter));</script></body></html>`;
}

function writeDerived(config, assets, events, summaryExtra = {}) {
  const paths = ensureCatalogSources(config);
  sortedAssets(assets);
  writeAssetsJsonl(paths.assets, assets);
  writeJsonAtomic(paths.summary, buildSummary(assets, summaryExtra));
  createDatabase(config, assets, events);
  writeTextAtomic(paths.gallery, createGallery(config, assets));
  return paths;
}

export async function scanLibrary(options = {}) {
  const config = loadLibraryConfig(options.repoRoot || findRepoRoot());
  const indexedAt = new Date().toISOString();
  const paths = ensureCatalogSources(config);
  const allFiles = config.scanRootsAbs.flatMap((root) => walkFiles(root, config.excludePathSegments));
  const audioPaths = allFiles.filter((path) => AUDIO_EXTENSIONS.has(extname(path).toLowerCase()));
  const manifestIndex = discoverManifests(config, allFiles);
  const inspected = await inspectAudioFiles(config, audioPaths);
  const groups = groupAudioByHash(inspected);
  const audioAssets = groups.map((group) => createAudioAsset(group, config, manifestIndex, indexedAt));
  const audioByPath = new Map();
  for (const asset of audioAssets) {
    for (const file of asset.files) audioByPath.set(resolve(config.repoRoot, file.path), asset);
  }
  const spectrumAssets = createSpectrumAssets(config, audioByPath, indexedAt);
  for (const visualizer of spectrumAssets) {
    for (const musicId of visualizer.relations.demonstrated_with) {
      const music = audioAssets.find((asset) => asset.id === musicId);
      if (music) music.relations.demonstrated_with = unique([...music.relations.demonstrated_with, visualizer.id]);
    }
  }
  const curation = safeJson(paths.curation, { schema_version: 1, assets: {} });
  const events = readJsonLines(paths.usage);
  const usageMap = usageMapFromEvents(events);
  const assets = [...audioAssets, ...spectrumAssets].map((asset) => rebuildSearchText(applyUsage(applyCuration(asset, curation), usageMap)));
  const validation = validateAssets(assets, config);
  if (validation.errors.length) throw new Error(`Asset validation failed:\n${validation.errors.join("\n")}`);
  writeDerived(config, assets, events, {
    scanned_audio_files: audioPaths.length,
    unique_audio_files: audioAssets.length,
    spectrum_presets: spectrumAssets.length,
    warnings: validation.warnings,
  });
  return { config, assets, summary: buildSummary(assets, { scanned_audio_files: audioPaths.length, unique_audio_files: audioAssets.length, spectrum_presets: spectrumAssets.length, warnings: validation.warnings }) };
}

export function loadAssets(repoRoot = findRepoRoot()) {
  const config = loadLibraryConfig(repoRoot);
  const path = catalogPaths(config).assets;
  if (!existsSync(path)) throw new Error("Asset catalog is missing. Run `node tiles/asset-library/scripts/asset-library.mjs scan` first.");
  return { config, assets: readJsonLines(path) };
}

function expandQuery(query) {
  const base = String(query || "").toLowerCase().trim();
  const expansions = [];
  for (const [term, synonyms] of QUERY_SYNONYMS) if (base.includes(term)) expansions.push(...synonyms);
  return unique([base, ...base.split(/\s+/), ...expansions]).filter(Boolean);
}

function daysSince(value) {
  if (!value) return Infinity;
  return (Date.now() - new Date(value).getTime()) / 86_400_000;
}

function scoreAsset(asset, queryTerms) {
  const title = asset.title.toLowerCase();
  const text = asset.search_text.toLowerCase();
  let score = asset.quality.status === "approved" ? 12 : asset.quality.status === "candidate" ? 6 : 0;
  score += Number(asset.quality.rating || 0) * 2;
  if (["owned", "licensed"].includes(asset.rights.status)) score += 3;
  const matches = [];
  for (const term of queryTerms) {
    if (!term) continue;
    if (title.includes(term)) { score += 10; matches.push(`title:${term}`); }
    else if (text.includes(term)) { score += 4; matches.push(term); }
  }
  score -= Math.min(asset.usage.use_count * 0.35, 3);
  if (daysSince(asset.usage.last_used_at) < 30) score -= 2;
  return { score, matches: unique(matches) };
}

function parseCsv(value, fallback = []) {
  if (!value) return fallback;
  return unique(String(value).split(",").map((item) => item.trim()).filter(Boolean));
}

export function searchAssets(options = {}) {
  const { assets } = loadAssets(options.repoRoot || findRepoRoot());
  const statuses = parseCsv(options.status, options.defaultStatuses || ["approved", "candidate"]);
  const types = parseCsv(options.type);
  const rights = parseCsv(options.rights);
  const terms = expandQuery(options.query || "");
  const filtered = assets.filter((asset) => {
    if (statuses.length && !statuses.includes(asset.quality.status)) return false;
    if (types.length && !types.includes(asset.type)) return false;
    if (rights.length && !rights.includes(asset.rights.status)) return false;
    if (options.energy && asset.semantics.energy !== options.energy) return false;
    if (options.durationBucket && asset.technical.duration_bucket !== options.durationBucket) return false;
    if (options.aspectRatio && asset.technical.aspect_ratio !== options.aspectRatio) return false;
    if (options.minDuration !== undefined && Number(asset.technical.duration_sec || 0) < Number(options.minDuration)) return false;
    if (options.maxDuration !== undefined && Number(asset.technical.duration_sec || Infinity) > Number(options.maxDuration)) return false;
    if (terms.length && !terms.some((term) => asset.search_text.toLowerCase().includes(term))) return false;
    return true;
  });
  return filtered
    .map((asset) => ({ asset, ...scoreAsset(asset, terms) }))
    .sort((a, b) => b.score - a.score || a.asset.title.localeCompare(b.asset.title))
    .slice(0, Number(options.limit || 10));
}

export function showAsset(id, repoRoot = findRepoRoot()) {
  const { assets } = loadAssets(repoRoot);
  const asset = assets.find((item) => item.id === id);
  if (!asset) throw new Error(`Unknown asset: ${id}`);
  return asset;
}

function rebuildFromCatalog(config) {
  const paths = ensureCatalogSources(config);
  const curation = safeJson(paths.curation, { schema_version: 1, assets: {} });
  const events = readJsonLines(paths.usage);
  const usageMap = usageMapFromEvents(events);
  const assets = readJsonLines(paths.assets).map((asset) => rebuildSearchText(applyUsage(applyCuration(asset, curation), usageMap)));
  const validation = validateAssets(assets, config);
  if (validation.errors.length) throw new Error(`Asset validation failed:\n${validation.errors.join("\n")}`);
  writeDerived(config, assets, events, { warnings: validation.warnings });
  return assets;
}

export function recordUsage({ id, project, role, repoRoot = findRepoRoot() }) {
  if (!id || !project) throw new Error("Usage requires --id and --project");
  const config = loadLibraryConfig(repoRoot);
  showAsset(id, repoRoot);
  const paths = ensureCatalogSources(config);
  const event = { schema_version: 1, asset_id: id, project: normalizeSlash(project), ...(role ? { role } : {}), recorded_at: new Date().toISOString() };
  appendFileSync(paths.usage, `${JSON.stringify(event)}\n`);
  rebuildFromCatalog(config);
  return event;
}

export function curateAsset({ id, status, rating, note, title, rightsStatus, commercialUse, repoRoot = findRepoRoot() }) {
  if (!id) throw new Error("Curation requires --id");
  if (status && !VALID_STATUSES.has(status)) throw new Error(`Invalid status: ${status}`);
  if (rightsStatus && !VALID_RIGHTS.has(rightsStatus)) throw new Error(`Invalid rights status: ${rightsStatus}`);
  if (rating !== undefined && (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5)) throw new Error("Rating must be an integer from 1 to 5");
  const config = loadLibraryConfig(repoRoot);
  showAsset(id, repoRoot);
  const paths = ensureCatalogSources(config);
  const curation = safeJson(paths.curation, { schema_version: 1, assets: {} });
  const current = curation.assets[id] || {};
  const next = {
    ...current,
    ...(title ? { title } : {}),
    ...(status ? { status } : {}),
    ...(rating !== undefined ? { rating: Number(rating) } : {}),
    ...(note ? { note } : {}),
    ...(status === "approved" && !current.approved_at ? { approved_at: new Date().toISOString() } : {}),
  };
  if (rightsStatus || commercialUse !== undefined) {
    next.rights = {
      ...(current.rights || {}),
      ...(rightsStatus ? { status: rightsStatus } : {}),
      ...(commercialUse !== undefined ? { commercial_use: commercialUse } : {}),
    };
  }
  curation.assets[id] = next;
  writeJsonAtomic(paths.curation, curation);
  rebuildFromCatalog(config);
  return { id, ...next };
}

export function validateAssets(assets, config = loadLibraryConfig()) {
  const errors = [];
  const warnings = [];
  const ids = new Set();
  for (const [index, asset] of assets.entries()) {
    const prefix = asset?.id || `record ${index + 1}`;
    if (asset?.schema_version !== 1) errors.push(`${prefix}: schema_version must be 1`);
    if (!asset?.id || ids.has(asset.id)) errors.push(`${prefix}: missing or duplicate ID`);
    ids.add(asset?.id);
    if (!VALID_TYPES.has(asset?.type)) errors.push(`${prefix}: invalid type`);
    if (!asset?.title) errors.push(`${prefix}: title is required`);
    if (!Array.isArray(asset?.files) || !asset.files.length) errors.push(`${prefix}: at least one file is required`);
    if (!VALID_STATUSES.has(asset?.quality?.status)) errors.push(`${prefix}: invalid quality status`);
    if (!VALID_RIGHTS.has(asset?.rights?.status)) errors.push(`${prefix}: invalid rights status`);
    if (!asset?.semantics || !Array.isArray(asset.semantics.use_cases)) errors.push(`${prefix}: semantics are required`);
    for (const file of asset?.files || []) {
      const absolute = isAbsolute(file.path) ? file.path : resolve(config.repoRoot, file.path);
      if (!existsSync(absolute)) warnings.push(`${prefix}: missing file ${file.path}`);
    }
    if (asset?.quality?.status === "approved" && ["unknown", "needs-verification", "restricted"].includes(asset?.rights?.status)) {
      warnings.push(`${prefix}: approved asset has unresolved rights (${asset.rights.status})`);
    }
  }
  return { errors, warnings };
}

export function validateCatalog(repoRoot = findRepoRoot()) {
  const { config, assets } = loadAssets(repoRoot);
  const result = validateAssets(assets, config);
  return { ...result, asset_count: assets.length };
}

export function catalogStats(repoRoot = findRepoRoot()) {
  const { assets } = loadAssets(repoRoot);
  return buildSummary(assets);
}

export function regenerateGallery(repoRoot = findRepoRoot()) {
  const { config, assets } = loadAssets(repoRoot);
  const path = catalogPaths(config).gallery;
  writeTextAtomic(path, createGallery(config, assets));
  return path;
}
