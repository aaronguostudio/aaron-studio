#!/usr/bin/env bun
import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

export interface RemotionAuditResult {
  failures: string[];
  warnings: string[];
}

export function auditRemotionSourceText(
  file: string,
  text: string
): RemotionAuditResult {
  const failures: string[] = [];
  const warnings: string[] = [];

  if (/\btransition\s*:|animation\s*:|animate-/.test(text)) {
    failures.push(
      `${file} uses CSS transition/animation instead of frame-based Remotion animation`
    );
  }
  if (
    !/useCurrentFrame|interpolate|spring|TransitionSeries|Sequence/.test(text) &&
    file.endsWith(".tsx")
  ) {
    warnings.push(`${file} has no obvious Remotion timing primitive`);
  }
  if (/per-character opacity|split\(""\).*opacity/i.test(text)) {
    failures.push(`${file} appears to use per-character opacity for text animation`);
  }

  return { failures, warnings };
}

function listTsxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listTsxFiles(path);
    return entry.name.endsWith(".tsx") ? [path] : [];
  });
}

if (import.meta.main) {
  const root = join(import.meta.dir, "..", "remotion", "src");
  if (!existsSync(root)) {
    console.error(`[remotion-audit] missing ${root}`);
    process.exit(1);
  }

  const combined: RemotionAuditResult = { failures: [], warnings: [] };
  for (const file of listTsxFiles(root)) {
    const result = auditRemotionSourceText(file, readFileSync(file, "utf-8"));
    combined.failures.push(...result.failures);
    combined.warnings.push(...result.warnings);
  }

  for (const warning of combined.warnings) console.warn(`[warn] ${warning}`);
  for (const failure of combined.failures) console.error(`[fail] ${failure}`);
  process.exit(combined.failures.length ? 2 : 0);
}
