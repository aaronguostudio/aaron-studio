#!/usr/bin/env node

import {mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {dirname, resolve} from "node:path";

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) continue;
    args[key.slice(2)] = argv[index + 1];
    index += 1;
  }
  return args;
}

function safeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function sourcePage(photo) {
  return photo.links?.html ?? `https://unsplash.com/photos/${photo.id}`;
}

function assertLandscape4k(photo) {
  const width = Number(photo.width);
  const height = Number(photo.height);
  const cropHeight = width * 9 / 16;
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 4000 || height + 2 < cropHeight) {
    throw new Error(`${photo.id} does not have enough landscape pixels for a 4K 16:9 master (${width}x${height}).`);
  }
  if (!photo.urls?.raw?.includes("images.unsplash.com")) {
    throw new Error(`${photo.id} does not have a standard Unsplash image endpoint.`);
  }
}

async function fetchPhoto(id) {
  const response = await fetch(`https://unsplash.com/napi/photos/${encodeURIComponent(id)}`);
  if (!response.ok) throw new Error(`Unable to load Unsplash metadata for ${id}: ${response.status}`);
  const photo = await response.json();
  assertLandscape4k(photo);
  return photo;
}

async function downloadImage(rawUrl, file) {
  const url = new URL(rawUrl);
  url.searchParams.set("w", "5120");
  url.searchParams.set("auto", "format");
  url.searchParams.set("q", "90");
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Image download failed (${response.status}): ${url}`);
  writeFileSync(file, Buffer.from(await response.arrayBuffer()));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.manifest) {
    console.error("Usage: node prepare-unsplash-photo-essay.mjs --manifest <batch-manifest.json>");
    process.exit(1);
  }

  const manifestPath = resolve(args.manifest);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (!manifest.project || !manifest.title || !Array.isArray(manifest.slides) || manifest.slides.length < 2) {
    throw new Error("Manifest requires project, title, and at least two selected slides.");
  }

  const projectDir = resolve(dirname(manifestPath));
  const imageDir = resolve(projectDir, "images");
  mkdirSync(imageDir, {recursive: true});

  const sources = [];
  const slides = [];
  for (const [index, chosen] of manifest.slides.entries()) {
    const photo = await fetchPhoto(chosen.id);
    const fileName = `${String(index + 1).padStart(2, "0")}-${safeName(chosen.caption)}.jpg`;
    const localImage = resolve(imageDir, fileName);
    await downloadImage(photo.urls.raw, localImage);
    const credit = {
      caption: chosen.caption,
      photographer: photo.user?.name ?? "Unsplash contributor",
      location: photo.location?.title ?? undefined,
      camera: photo.exif?.model ?? undefined,
      sourcePage: sourcePage(photo),
    };
    sources.push({
      file: `images/${fileName}`,
      id: photo.id,
      caption: chosen.caption,
      photographer: credit.photographer,
      photographerHandle: photo.user?.username ? `@${photo.user.username}` : undefined,
      location: credit.location,
      camera: credit.camera,
      sourcePage: credit.sourcePage,
      imageEndpoint: photo.urls.raw,
      originalWidth: photo.width,
      originalHeight: photo.height,
      license: "Unsplash License",
    });
    slides.push({
      image: `images/${fileName}`,
      durationSec: 48,
      motion: chosen.motion ?? "static",
      ...(chosen.motionAmount ? {motionAmount: chosen.motionAmount} : {}),
      credit,
    });
  }

  const config = {
    title: manifest.title,
    width: 3840,
    height: 2160,
    fps: 30,
    transitionSec: 2,
    crf: 18,
    captionStyle: {
      fontName: "Avenir Next",
      titleSize: 46,
      detailSize: 30,
      left: 144,
      titleBottom: 224,
      detailBottom: 168,
      initialDelaySec: 0.8,
      fadeSec: 0.7,
      exitLeadSec: 0.45,
    },
    slides,
  };
  writeJson(resolve(projectDir, "photo-sources.json"), {project: manifest.project, license: "Unsplash License", sources});
  writeJson(resolve(projectDir, "photo-essay-config.json"), config);
  console.log(`Prepared ${slides.length} new Unsplash images for ${manifest.project}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
