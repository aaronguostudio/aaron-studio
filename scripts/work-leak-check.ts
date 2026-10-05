#!/usr/bin/env bun
// Fails when client-work identifiers appear in the generic tools that must stay free of them.
//
//   npx -y bun scripts/work-leak-check.ts            # scan the scoped paths below
//   npx -y bun scripts/work-leak-check.ts <path>...  # scan these paths instead
//
// The denylist is .work-denylist at the repo root: one term per line, # for comments, matched
// case-insensitively as a whole word. It is gitignored on purpose, because committing the list
// would itself be the leak. A missing or empty denylist is a failure, never a pass.
import { execFileSync } from "child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { dirname, join, relative, resolve } from "path";

export const REPO = resolve(import.meta.dir, "..");

// A worktree has no untracked files of its own, so fall back to the main checkout's copy.
function findDenylist(): string {
  const local = join(REPO, ".work-denylist");
  if (existsSync(local)) return local;
  try {
    const common = execFileSync("git", ["-C", REPO, "rev-parse", "--path-format=absolute", "--git-common-dir"], { encoding: "utf8" }).trim();
    return join(dirname(common), ".work-denylist");
  } catch {
    return local;
  }
}

export const DENYLIST = findDenylist();

// Generic tools that may be used for client work but must never carry its names.
export const SCOPED_PATHS = [
  "tiles/paste-ready-update",
  "tiles/aaron-video-gen/remotion/src/projects/walkthrough-video",
  "tiles/aaron-video-gen/scripts/walkthrough",
  "tiles/aaron-video-gen/references/walkthrough-capture.md",
  "scripts/work-leak-check.ts",
  "scripts/work-leak-check.test.ts",
];

const SKIP_DIRS = new Set(["node_modules", ".git", "__pycache__"]);

export type Hit = { file: string; line: number; term: string };

export function loadDenylist(path = DENYLIST): string[] {
  if (!existsSync(path)) throw new Error(`${path} is missing. Create it (it is gitignored) with one client identifier per line.`);
  const terms = readFileSync(path, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
  if (terms.length === 0) throw new Error(`${path} has no terms; an empty denylist would pass anything.`);
  return terms;
}

const escape = (term: string) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function matcher(terms: string[]): RegExp {
  return new RegExp(`(?<![A-Za-z0-9])(?:${terms.map(escape).join("|")})(?![A-Za-z0-9])`, "i");
}

function files(path: string): string[] {
  if (!existsSync(path)) return [];
  if (statSync(path).isFile()) return [path];
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) =>
    SKIP_DIRS.has(entry.name) ? [] : files(join(path, entry.name)),
  );
}

export function scan(paths: string[], terms: string[], root = REPO): Hit[] {
  const re = matcher(terms);
  const hits: Hit[] = [];
  for (const file of paths.flatMap((p) => files(resolve(root, p)))) {
    const buffer = readFileSync(file);
    if (buffer.includes(0)) continue; // binary
    buffer
      .toString("utf8")
      .split("\n")
      .forEach((text, i) => {
        const m = re.exec(text);
        if (m) hits.push({ file: relative(root, file), line: i + 1, term: m[0] });
      });
  }
  return hits;
}

if (import.meta.main) {
  let terms: string[];
  try {
    terms = loadDenylist();
  } catch (error) {
    console.error(`[leak-check] ${(error as Error).message}`);
    process.exit(2);
  }
  const args = process.argv.slice(2);
  const hits = scan(args.length ? args : SCOPED_PATHS, terms);
  for (const hit of hits) console.error(`[leak-check] ${hit.file}:${hit.line} contains a denylisted term`);
  if (hits.length) process.exit(1);
  console.log(`[leak-check] clean: ${terms.length} terms, ${(args.length ? args : SCOPED_PATHS).length} paths`);
}
