#!/usr/bin/env node

import {readFileSync, writeFileSync} from "node:fs";
import {dirname, resolve} from "node:path";

function parseArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) continue;
    args[key.slice(2)] = argv[index + 1];
    index += 1;
  }
  return args;
}

function usage() {
  console.log("Usage: node create-youtube-photo-essay-metadata.mjs --title <title> --description <youtube-description.md> --output <youtube-metadata.yaml> --tags <comma-separated tags>");
}

const args = parseArgs(process.argv);
if (!args.title || !args.description || !args.output || !args.tags) {
  usage();
  process.exit(1);
}

const descriptionPath = resolve(args.description);
const outputPath = resolve(args.output);
const description = readFileSync(descriptionPath, "utf8").trimEnd();
const tags = args.tags.split(",").map((tag) => tag.trim()).filter(Boolean);

const yaml = [
  `title: ${JSON.stringify(args.title)}`,
  "description: |",
  ...description.split("\n").map((line) => `  ${line}`),
  "tags:",
  ...tags.map((tag) => `  - ${JSON.stringify(tag)}`),
  'category: "10"',
  "language: en",
  "privacy: unlisted",
  "",
].join("\n");

writeFileSync(outputPath, yaml);
console.log(`Wrote ${outputPath}`);
