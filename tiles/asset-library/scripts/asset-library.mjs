#!/usr/bin/env node

import {
  catalogStats,
  curateAsset,
  findRepoRoot,
  loadLibraryConfig,
  recordUsage,
  regenerateGallery,
  scanLibrary,
  searchAssets,
  showAsset,
  validateCatalog,
} from "./library.mjs";

function parseArgs(argv) {
  const [command = "help", ...rest] = argv;
  const options = { command };
  for (let index = 0; index < rest.length; index++) {
    const value = rest[index];
    if (!value.startsWith("--")) {
      options.query = options.query ? `${options.query} ${value}` : value;
      continue;
    }
    const [rawKey, inline] = value.slice(2).split("=", 2);
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (inline !== undefined) options[key] = inline;
    else if (rest[index + 1] && !rest[index + 1].startsWith("--")) options[key] = rest[++index];
    else options[key] = true;
  }
  return options;
}

function boolValue(value) {
  if (value === undefined) return undefined;
  if (value === true || value === "true" || value === "yes" || value === "1") return true;
  if (value === false || value === "false" || value === "no" || value === "0") return false;
  throw new Error(`Expected a boolean, received: ${value}`);
}

function help() {
  console.log(`Aaron Studio Asset Library

Usage:
  node tiles/asset-library/scripts/asset-library.mjs scan
  node tiles/asset-library/scripts/asset-library.mjs search --query "calm piano" [filters]
  node tiles/asset-library/scripts/asset-library.mjs show --id <asset-id> [--json]
  node tiles/asset-library/scripts/asset-library.mjs use --id <asset-id> --project <path> [--role <role>]
  node tiles/asset-library/scripts/asset-library.mjs curate --id <asset-id> [curation options]
  node tiles/asset-library/scripts/asset-library.mjs validate
  node tiles/asset-library/scripts/asset-library.mjs stats [--json]
  node tiles/asset-library/scripts/asset-library.mjs gallery

Search filters:
  --type music,visualizer-preset
  --status approved,candidate
  --rights owned,licensed
  --min-duration <seconds>
  --max-duration <seconds>
  --duration-bucket sting|short|medium|long
  --energy low|medium|high|dynamic
  --aspect-ratio 16:9
  --limit <count>
  --json

Curation options:
  --status experimental|candidate|approved|archived
  --rating 1..5
  --note <review note>
  --title <curated title>
  --rights-status owned|licensed|public-source|needs-verification|restricted|unknown
  --commercial-use true|false
`);
}

function formatDuration(seconds) {
  if (!Number.isFinite(Number(seconds))) return "—";
  const total = Math.round(Number(seconds));
  const minutes = Math.floor(total / 60);
  return minutes ? `${minutes}:${String(total % 60).padStart(2, "0")}` : `${total}s`;
}

function printSearch(results) {
  if (!results.length) {
    console.log("No matching assets.");
    return;
  }
  for (const [index, result] of results.entries()) {
    const { asset, score, matches } = result;
    console.log(`${index + 1}. ${asset.title}`);
    console.log(`   ${asset.id}`);
    console.log(`   ${asset.type} · ${asset.quality.status} · rights:${asset.rights.status} · ${formatDuration(asset.technical.duration_sec)} · score:${score.toFixed(1)}`);
    console.log(`   ${asset.summary}`);
    if (matches.length) console.log(`   matched: ${matches.join(", ")}`);
    console.log(`   file: ${asset.files.find((file) => file.role === "master" || file.role === "config")?.path || asset.files[0]?.path}`);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const repoRoot = findRepoRoot(options.repoRoot || process.cwd());
  switch (options.command) {
    case "scan": {
      const { summary, config } = await scanLibrary({ repoRoot });
      console.log(`Indexed ${summary.asset_count} assets (${summary.unique_audio_files} unique audio files, ${summary.spectrum_presets} visualizer presets).`);
      console.log(`Deduplicated ${summary.duplicate_source_files} copied audio files.`);
      console.log(`Catalog: ${config.catalogRoot}`);
      console.log(`Search DB: ${config.databasePath}`);
      break;
    }
    case "search": {
      const config = loadLibraryConfig(repoRoot);
      const results = searchAssets({
        repoRoot,
        query: options.query || "",
        type: options.type,
        status: options.status,
        rights: options.rights,
        minDuration: options.minDuration,
        maxDuration: options.maxDuration,
        durationBucket: options.durationBucket,
        energy: options.energy,
        aspectRatio: options.aspectRatio,
        limit: options.limit,
        defaultStatuses: config.defaultStatuses,
      });
      if (options.json) console.log(JSON.stringify(results, null, 2));
      else printSearch(results);
      break;
    }
    case "show": {
      if (!options.id) throw new Error("show requires --id");
      const asset = showAsset(options.id, repoRoot);
      console.log(JSON.stringify(asset, null, 2));
      break;
    }
    case "use": {
      const event = recordUsage({ id: options.id, project: options.project, role: options.role, repoRoot });
      console.log(`Recorded use of ${event.asset_id} in ${event.project}.`);
      break;
    }
    case "curate": {
      const result = curateAsset({
        id: options.id,
        status: options.status,
        rating: options.rating,
        note: options.note,
        title: options.title,
        rightsStatus: options.rightsStatus,
        commercialUse: boolValue(options.commercialUse),
        repoRoot,
      });
      console.log(`Updated curation for ${result.id}.`);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case "validate": {
      const result = validateCatalog(repoRoot);
      for (const warning of result.warnings) console.warn(`warning: ${warning}`);
      if (result.errors.length) {
        for (const error of result.errors) console.error(`error: ${error}`);
        process.exitCode = 1;
      } else {
        console.log(`Validated ${result.asset_count} assets with ${result.warnings.length} warning(s).`);
      }
      break;
    }
    case "stats": {
      const stats = catalogStats(repoRoot);
      console.log(options.json ? JSON.stringify(stats, null, 2) : [
        `${stats.asset_count} assets`,
        `types: ${Object.entries(stats.by_type).map(([key, value]) => `${key}=${value}`).join(", ")}`,
        `status: ${Object.entries(stats.by_status).map(([key, value]) => `${key}=${value}`).join(", ")}`,
        `rights: ${Object.entries(stats.by_rights).map(([key, value]) => `${key}=${value}`).join(", ")}`,
      ].join("\n"));
      break;
    }
    case "gallery": {
      console.log(`Regenerated ${regenerateGallery(repoRoot)}`);
      break;
    }
    case "help":
    case "--help":
    case "-h":
      help();
      break;
    default:
      throw new Error(`Unknown command: ${options.command}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
