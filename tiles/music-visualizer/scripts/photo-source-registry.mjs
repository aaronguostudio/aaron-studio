#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {dirname, resolve} from "node:path";

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const [key, inlineValue] = token.slice(2).split("=", 2);
    if (inlineValue !== undefined) args[key] = inlineValue;
    else if (argv[index + 1] && !argv[index + 1].startsWith("--")) args[key] = argv[++index];
    else args[key] = true;
  }
  return args;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function sourceId(sourcePage) {
  const url = new URL(sourcePage);
  return `${url.origin}${url.pathname}`.replace(/\/$/, "");
}

function usageFromSlide(slide, project) {
  const credit = slide.credit || {};
  if (!credit.sourcePage) throw new Error(`Slide ${slide.image} is missing credit.sourcePage.`);
  return {
    sourceId: sourceId(credit.sourcePage),
    sourcePage: credit.sourcePage,
    image: slide.image,
    caption: credit.caption || null,
    photographer: credit.photographer || null,
    location: credit.location || null,
    camera: credit.camera || null,
    project,
  };
}

function initialRegistry() {
  return {version: 1, sources: []};
}

function loadRegistry(path) {
  if (!existsSync(path)) return initialRegistry();
  const registry = readJson(path);
  if (!Array.isArray(registry.sources)) throw new Error(`Registry ${path} must contain a sources array.`);
  return registry;
}

function report({registry, usages}) {
  const known = new Map(registry.sources.map((source) => [source.sourceId, source]));
  const repeats = usages
    .filter((usage) => known.has(usage.sourceId))
    .map((usage) => ({
      image: usage.image,
      sourcePage: usage.sourcePage,
      previousProjects: known.get(usage.sourceId).uses.map((item) => item.project),
    }));
  return {checked: usages.length, newSources: usages.length - repeats.length, repeats};
}

function record({registry, usages}) {
  const now = new Date().toISOString();
  const known = new Map(registry.sources.map((source) => [source.sourceId, source]));
  for (const usage of usages) {
    const existing = known.get(usage.sourceId);
    const use = {
      project: usage.project,
      image: usage.image,
      caption: usage.caption,
      recordedAt: now,
    };
    if (existing) {
      existing.sourcePage = usage.sourcePage;
      existing.photographer = usage.photographer;
      existing.location = usage.location;
      existing.camera = usage.camera;
      if (!existing.uses.some((item) => item.project === usage.project && item.image === usage.image)) {
        existing.uses.push(use);
      }
      existing.lastUsedAt = now;
      continue;
    }
    const source = {
      sourceId: usage.sourceId,
      sourcePage: usage.sourcePage,
      photographer: usage.photographer,
      location: usage.location,
      camera: usage.camera,
      firstUsedAt: now,
      lastUsedAt: now,
      uses: [use],
    };
    registry.sources.push(source);
    known.set(source.sourceId, source);
  }
  registry.sources.sort((left, right) => left.sourceId.localeCompare(right.sourceId));
  registry.updatedAt = now;
  return registry;
}

function usage() {
  console.log(`Photo source registry\n\nUsage:\n  node photo-source-registry.mjs --check --registry <registry.json> --config <photo-essay.json> --project <slug>\n  node photo-source-registry.mjs --record --registry <registry.json> --config <photo-essay.json> --project <slug>\n\n--check reports previously-used source pages. --record adds the config's source credits to the registry.`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || (!args.check && !args.record)) return usage();
  if (!args.registry || !args.config || !args.project) throw new Error("--registry, --config, and --project are required.");
  const registryPath = resolve(args.registry);
  const config = readJson(resolve(args.config));
  if (!Array.isArray(config.slides)) throw new Error("Photo essay config must contain slides.");
  const usages = config.slides.map((slide) => usageFromSlide(slide, args.project));
  const registry = loadRegistry(registryPath);
  const result = report({registry, usages});

  if (args.record) {
    mkdirSync(dirname(registryPath), {recursive: true});
    writeFileSync(registryPath, `${JSON.stringify(record({registry, usages}), null, 2)}\n`);
  }

  console.log(JSON.stringify({...result, mode: args.record ? "record" : "check", registryPath}, null, 2));
}

main();
