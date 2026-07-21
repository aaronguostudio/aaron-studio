#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const MEDIA_EXTENSIONS = new Set([".mp3", ".m4a", ".wav", ".aac", ".flac", ".ogg", ".png", ".jpg", ".jpeg", ".webp", ".mp4", ".mov"]);
const AUDIO_EXTENSIONS = new Set([".mp3", ".m4a", ".wav", ".aac", ".flac", ".ogg"]);
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov"]);
const DEFAULT_EXCLUDES = ["node_modules", ".git", ".cache", ".video-gen-cache", "render-tmp", "qa-frames", "frames", "caption-assets"];

function normalizeSlash(value) {
  return value.split(sep).join("/");
}

function safeJson(path, fallback = null) {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return fallback; }
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function readJsonLines(path) {
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8").split(/\r?\n/).filter(Boolean).flatMap((line) => {
    try { return [JSON.parse(line)]; } catch { return []; }
  });
}

async function readStdin() {
  let value = "";
  for await (const chunk of process.stdin) value += chunk;
  if (!value.trim()) return {};
  try { return JSON.parse(value); } catch { return {}; }
}

export function findHookRepoRoot(start = process.cwd()) {
  let current = resolve(start);
  while (true) {
    if (existsSync(join(current, "config", "aaron-studio.json"))) return current;
    const parent = dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function loadHookConfig(repoRoot) {
  const studio = safeJson(join(repoRoot, "config", "aaron-studio.json"), {});
  const library = studio.assetLibrary || {};
  const hook = library.hook || {};
  return {
    enabled: hook.enabled !== false,
    repoRoot,
    catalogRoot: resolve(repoRoot, library.catalogRoot || "src/content/asset-library"),
    stateRoot: resolve(repoRoot, ".cache/asset-library/hook-turns"),
    inboxPath: resolve(repoRoot, library.catalogRoot || "src/content/asset-library", "inbox.jsonl"),
    candidateRoots: (hook.candidateRoots || ["src/content/music-visualizer", "src/content/blogs", "src/content/videos"]).map((path) => resolve(repoRoot, path)),
    maxCandidatesPerTurn: Number(hook.maxCandidatesPerTurn || 20),
    clockSkewMs: Number(hook.clockSkewMs || 100),
    excludePathSegments: new Set([...(library.excludePathSegments || []), ...(hook.excludePathSegments || []), ...DEFAULT_EXCLUDES]),
  };
}

function stateKey(input) {
  return createHash("sha256").update(`${input.session_id || "session"}:${input.turn_id || "turn"}`).digest("hex").slice(0, 24);
}

function statePath(config, input) {
  return join(config.stateRoot, `${stateKey(input)}.json`);
}

function repoPath(repoRoot, path) {
  const rel = relative(repoRoot, resolve(path));
  return rel.startsWith("..") ? normalizeSlash(resolve(path)) : normalizeSlash(rel);
}

function isCandidateFilename(path) {
  const name = basename(path).toLowerCase();
  const extension = extname(name);
  return MEDIA_EXTENSIONS.has(extension) || /(^|\.)generation-manifest\.json$/.test(name) || name === "render-config.json";
}

function changedCandidateFiles(config, startedAtMs) {
  const output = [];
  const threshold = startedAtMs - config.clockSkewMs;
  const stack = config.candidateRoots.filter(existsSync);
  while (stack.length) {
    const directory = stack.pop();
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (config.excludePathSegments.has(entry.name)) continue;
      const path = join(directory, entry.name);
      if (path === config.catalogRoot || path.startsWith(`${config.catalogRoot}${sep}`)) continue;
      if (entry.isDirectory()) {
        stack.push(path);
        continue;
      }
      if (!entry.isFile() || !isCandidateFilename(path)) continue;
      const stat = statSync(path);
      if (stat.size > 0 && stat.mtimeMs >= threshold) output.push({ path, stat });
    }
  }
  return output;
}

function manifestForMedia(path) {
  const directory = dirname(path);
  const stem = basename(path, extname(path));
  const candidates = [
    join(directory, `${stem}.generation-manifest.json`),
    join(directory, "generation-manifest.json"),
  ];
  return candidates.find(existsSync) || null;
}

function policyFromManifest(path) {
  if (!path) return null;
  const data = safeJson(path);
  if (!data || typeof data !== "object") return null;
  const policy = data.asset_library || data.assetLibrary;
  if (!policy || typeof policy !== "object") return { data, policy: null };
  return { data, policy };
}

function firstMediaReference(data, manifestPath, repoRoot) {
  const values = [
    data?.audioPath,
    data?.audio_path,
    data?.master?.file,
    ...(Array.isArray(data?.inputs) ? data.inputs.map((item) => item?.file) : []),
    data?.outputPath,
    data?.output_path,
  ].filter((value) => typeof value === "string");
  for (const value of values) {
    const path = isAbsolute(value) ? resolve(value) : resolve(dirname(manifestPath), value);
    if (existsSync(path) && MEDIA_EXTENSIONS.has(extname(path).toLowerCase())) return path;
    const fromRoot = resolve(repoRoot, value);
    if (existsSync(fromRoot) && MEDIA_EXTENSIONS.has(extname(fromRoot).toLowerCase())) return fromRoot;
  }
  return null;
}

function rightsStatus(data) {
  const explicit = data?.rights?.status || data?.rights;
  if (typeof explicit === "string") return explicit;
  const note = String(data?.commercialUseNote || data?.rightsNote || "");
  if (/verify|confirm|check|before commercial|needs? review/i.test(note)) return "needs-verification";
  return "unknown";
}

function kindForPath(path) {
  const extension = extname(path).toLowerCase();
  if (AUDIO_EXTENSIONS.has(extension)) return "music";
  if (IMAGE_EXTENSIONS.has(extension)) return "image";
  if (VIDEO_EXTENSIONS.has(extension)) return "video";
  if (basename(path) === "render-config.json") return "visualizer-preset";
  return "manifest";
}

function classifyChangedFile(config, item) {
  const relPath = repoPath(config.repoRoot, item.path);
  const inMusicVisualizer = relPath.startsWith("src/content/music-visualizer/");
  const name = basename(item.path).toLowerCase();
  const isManifest = /(^|\.)generation-manifest\.json$/.test(name);
  const manifestPath = isManifest ? item.path : manifestForMedia(item.path);
  const manifest = policyFromManifest(manifestPath);
  const explicit = manifest?.policy;
  if (explicit?.policy === "ignore" || explicit?.scope === "project-specific") return null;

  let candidatePath = item.path;
  let policy = explicit?.policy;
  let scope = explicit?.scope;
  let kind = explicit?.kind;
  let reason = "Explicit asset_library manifest policy";

  if (isManifest && manifest?.data) candidatePath = firstMediaReference(manifest.data, manifestPath, config.repoRoot) || item.path;

  if (!policy) {
    const extension = extname(candidatePath).toLowerCase();
    if (inMusicVisualizer && AUDIO_EXTENSIONS.has(extension) && manifestPath) {
      policy = "auto";
      scope = "generic";
      kind = "music";
      reason = "New music-visualizer audio with a generation manifest";
    } else if (inMusicVisualizer && isManifest && firstMediaReference(manifest?.data, manifestPath, config.repoRoot)) {
      policy = "auto";
      scope = "generic";
      kind = "music";
      reason = "New music generation manifest with a local media output";
    } else if (inMusicVisualizer && name === "render-config.json") {
      policy = "suggest";
      scope = "generic";
      kind = "visualizer-preset";
      reason = "New reusable visualizer configuration";
    } else {
      return null;
    }
  }

  if (!new Set(["auto", "suggest"]).has(policy)) return null;
  const candidateStat = existsSync(candidatePath) ? statSync(candidatePath) : item.stat;
  return {
    candidatePath,
    manifestPath,
    policy,
    scope: scope || "generic",
    kind: kind || kindForPath(candidatePath),
    reason,
    rightsStatus: rightsStatus(manifest?.data),
    stat: candidateStat,
  };
}

export function detectHookCandidates({ repoRoot, startedAtMs, sessionId = "", turnId = "" }) {
  const config = loadHookConfig(repoRoot);
  if (!config.enabled) return [];
  const candidatesByPath = new Map();
  for (const item of changedCandidateFiles(config, startedAtMs)) {
    const classified = classifyChangedFile(config, item);
    if (!classified) continue;
    const relPath = repoPath(repoRoot, classified.candidatePath);
    const manifestRel = classified.manifestPath ? repoPath(repoRoot, classified.manifestPath) : undefined;
    const fingerprint = `${relPath}:${classified.stat.size}:${classified.stat.mtimeMs}`;
    const candidate = {
      schema_version: 1,
      candidate_id: `candidate:${createHash("sha256").update(fingerprint).digest("hex").slice(0, 16)}`,
      path: relPath,
      ...(manifestRel ? { manifest_path: manifestRel } : {}),
      kind: classified.kind,
      policy: classified.policy,
      scope: classified.scope,
      status: "pending",
      rights_status: classified.rightsStatus,
      reason: classified.reason,
      source: "codex-hook",
      detected_at: new Date().toISOString(),
      ...(sessionId ? { session_id: sessionId } : {}),
      ...(turnId ? { turn_id: turnId } : {}),
    };
    candidatesByPath.set(relPath, candidate);
  }
  return [...candidatesByPath.values()].slice(0, config.maxCandidatesPerTurn);
}

export function enqueueHookCandidates(repoRoot, candidates) {
  if (!candidates.length) return [];
  const config = loadHookConfig(repoRoot);
  mkdirSync(dirname(config.inboxPath), { recursive: true });
  const existing = new Set(readJsonLines(config.inboxPath).map((item) => item.candidate_id));
  const added = candidates.filter((candidate) => !existing.has(candidate.candidate_id));
  for (const candidate of added) appendFileSync(config.inboxPath, `${JSON.stringify(candidate)}\n`);
  return added;
}

export function listHookInbox(repoRoot) {
  const config = loadHookConfig(repoRoot);
  return readJsonLines(config.inboxPath);
}

export function handleHookStart(input, now = Date.now()) {
  const repoRoot = findHookRepoRoot(input.cwd || process.cwd());
  if (!repoRoot) return { handled: false };
  const config = loadHookConfig(repoRoot);
  if (!config.enabled) return { handled: false };
  const path = statePath(config, input);
  writeJson(path, {
    schema_version: 1,
    session_id: input.session_id || "",
    turn_id: input.turn_id || "",
    cwd: input.cwd || repoRoot,
    started_at_ms: now,
  });
  return { handled: true, statePath: path };
}

export function handleHookStop(input) {
  const repoRoot = findHookRepoRoot(input.cwd || process.cwd());
  if (!repoRoot) return { handled: false, added: [] };
  const config = loadHookConfig(repoRoot);
  if (!config.enabled) return { handled: false, added: [] };
  const path = statePath(config, input);
  const state = safeJson(path);
  if (!state?.started_at_ms) return { handled: false, added: [] };
  const candidates = detectHookCandidates({
    repoRoot,
    startedAtMs: state.started_at_ms,
    sessionId: input.session_id || "",
    turnId: input.turn_id || "",
  });
  const added = enqueueHookCandidates(repoRoot, candidates);
  rmSync(path, { force: true });
  return { handled: true, added };
}

function printInbox(items, json) {
  if (json) {
    process.stdout.write(`${JSON.stringify(items, null, 2)}\n`);
    return;
  }
  if (!items.length) {
    console.log("Asset Inbox is empty.");
    return;
  }
  for (const item of items) {
    console.log(`${item.candidate_id} · ${item.kind} · ${item.policy} · rights:${item.rights_status}`);
    console.log(`  ${item.path}`);
    console.log(`  ${item.reason}`);
  }
}

async function main() {
  const command = process.argv[2] || "help";
  if (command === "inbox") {
    const repoRoot = findHookRepoRoot(process.cwd());
    if (!repoRoot) throw new Error("Aaron Studio root not found");
    printInbox(listHookInbox(repoRoot), process.argv.includes("--json"));
    return;
  }
  const input = await readStdin();
  if (command === "start") {
    handleHookStart(input);
    return;
  }
  if (command === "stop") {
    const result = handleHookStop(input);
    if (result.added.length) {
      const auto = result.added.filter((item) => item.policy === "auto").length;
      const suggest = result.added.length - auto;
      process.stdout.write(`${JSON.stringify({
        continue: true,
        systemMessage: `Asset Library: detected ${result.added.length} reusable candidate(s); ${auto} auto-candidate, ${suggest} review suggestion. Saved to the Asset Inbox; nothing was auto-approved.`,
      })}\n`);
    }
    return;
  }
  console.log("Usage: node asset-hook.mjs start|stop < hook-input.json, or node asset-hook.mjs inbox [--json]");
}

if (resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
