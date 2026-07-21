#!/usr/bin/env bun
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";

export type SourceVerification = "verified" | "needs-review";
export type SourceRights =
  | "public-source"
  | "licensed"
  | "owned"
  | "generated"
  | "commentary-review"
  | "prototype-only";

export interface FactSource {
  id: string;
  url: string;
  publisher: string;
  published_at?: string;
  source_type: "official" | "primary" | "secondary" | "community";
  verification_status: SourceVerification;
  rights: SourceRights;
  notes: string;
}

export interface FactItem {
  id: string;
  claim: string;
  source_ids: string[];
  confidence: "high" | "medium" | "low";
  usable_in_script: boolean;
  sensitivity?: string;
}

export interface FactPack {
  schema_version: number;
  topic: string;
  thesis: string;
  sources: FactSource[];
  facts: FactItem[];
}

export type VisualRole = "evidence" | "explanation" | "emphasis";
export type AssetType =
  | "screen-capture"
  | "source-screenshot"
  | "source-video"
  | "generated-layout"
  | "generated-still"
  | "generated-video"
  | "stock"
  | "none";
export type AssetStatus = "planned" | "ready" | "rejected";
export type EditorialApproval = "not-required" | "pending" | "approved" | "rejected";

export interface AssetBeat {
  id: string;
  start_sec: number;
  end_sec: number;
  copy: string;
  visual_role: VisualRole;
  asset_type: AssetType;
  fact_ids: string[];
  source_ids: string[];
  asset_path?: string;
  library_asset_id?: string;
  status: AssetStatus;
  provenance: string;
  rights: SourceRights;
  license_url?: string;
  creator?: string;
  retrieved_at?: string;
  source_start_sec?: number;
  source_end_sec?: number;
  editorial_approval?: EditorialApproval;
  fallback: string;
}

export interface AssetPlan {
  schema_version: number;
  title: string;
  duration_sec: number;
  aspect_ratio: "9:16" | "16:9" | "1:1";
  asset_library?: {
    queries: string[];
    selected_asset_ids: string[];
  };
  beats: AssetBeat[];
}

export interface ContentEvidenceAuditResult {
  passed: boolean;
  failures: string[];
  warnings: string[];
  summaryMarkdown: string;
}

const visualRoles: VisualRole[] = ["evidence", "explanation", "emphasis"];
const assetTypes: AssetType[] = [
  "screen-capture",
  "source-screenshot",
  "source-video",
  "generated-layout",
  "generated-still",
  "generated-video",
  "stock",
  "none",
];
const statuses: AssetStatus[] = ["planned", "ready", "rejected"];
const rightsValues: SourceRights[] = [
  "public-source",
  "licensed",
  "owned",
  "generated",
  "commentary-review",
  "prototype-only",
];
const fileBackedAssets = new Set<AssetType>([
  "screen-capture",
  "source-screenshot",
  "source-video",
  "generated-still",
  "generated-video",
  "stock",
]);

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isWebUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function auditContentEvidence(
  factPack: FactPack,
  assetPlan: AssetPlan,
  options: { production?: boolean; baseDir?: string } = {},
): ContentEvidenceAuditResult {
  const failures: string[] = [];
  const warnings: string[] = [];
  const production = options.production ?? false;
  const baseDir = options.baseDir ?? process.cwd();
  const sources = Array.isArray(factPack?.sources) ? factPack.sources : [];
  const facts = Array.isArray(factPack?.facts) ? factPack.facts : [];
  const beats = Array.isArray(assetPlan?.beats) ? assetPlan.beats : [];
  const sourceIds = new Set<string>();
  const factIds = new Set<string>();

  if (factPack?.schema_version !== 1) failures.push("fact pack schema_version must be 1");
  if (!hasText(factPack?.topic)) failures.push("fact pack topic is missing");
  if (!hasText(factPack?.thesis)) failures.push("fact pack thesis is missing");
  if (sources.length === 0) failures.push("fact pack has no sources");
  if (facts.length === 0) failures.push("fact pack has no facts");

  sources.forEach((source, index) => {
    const label = source?.id || `source-${index + 1}`;
    if (!hasText(source?.id)) failures.push(`source ${index + 1} is missing id`);
    else if (sourceIds.has(source.id)) failures.push(`duplicate source id ${source.id}`);
    else sourceIds.add(source.id);
    if (!hasText(source?.url) || !isWebUrl(source.url)) failures.push(`${label} has an invalid url`);
    if (!hasText(source?.publisher)) failures.push(`${label} is missing publisher`);
    if (!hasText(source?.notes)) failures.push(`${label} is missing notes`);
    if (!(["official", "primary", "secondary", "community"] as const).includes(source?.source_type)) {
      failures.push(`${label} has an invalid source_type`);
    }
    if (!(["verified", "needs-review"] as const).includes(source?.verification_status)) {
      failures.push(`${label} has an invalid verification_status`);
    }
    if (!rightsValues.includes(source?.rights)) failures.push(`${label} has invalid rights`);
    if (source?.verification_status === "needs-review") warnings.push(`${label} still needs verification`);
  });

  facts.forEach((fact, index) => {
    const label = fact?.id || `fact-${index + 1}`;
    if (!hasText(fact?.id)) failures.push(`fact ${index + 1} is missing id`);
    else if (factIds.has(fact.id)) failures.push(`duplicate fact id ${fact.id}`);
    else factIds.add(fact.id);
    if (!hasText(fact?.claim)) failures.push(`${label} is missing claim`);
    if (!(["high", "medium", "low"] as const).includes(fact?.confidence)) {
      failures.push(`${label} has invalid confidence`);
    }
    const refs = Array.isArray(fact?.source_ids) ? fact.source_ids : [];
    if (refs.length === 0) failures.push(`${label} has no source_ids`);
    const missing = refs.filter((id) => !sourceIds.has(id));
    if (missing.length > 0) failures.push(`${label} references unknown sources: ${missing.join(", ")}`);
    if (fact?.usable_in_script && fact?.confidence === "low") {
      failures.push(`${label} cannot be script-usable with low confidence`);
    }
    if (fact?.usable_in_script) {
      const hasVerifiedSource = sources.some(
        (source) => refs.includes(source.id) && source.verification_status === "verified",
      );
      if (!hasVerifiedSource) failures.push(`${label} has no verified source`);
    }
  });

  if (assetPlan?.schema_version !== 1) failures.push("asset plan schema_version must be 1");
  if (!hasText(assetPlan?.title)) failures.push("asset plan title is missing");
  if (!(assetPlan?.duration_sec > 0)) failures.push("asset plan duration_sec must be positive");
  if (!(["9:16", "16:9", "1:1"] as const).includes(assetPlan?.aspect_ratio)) {
    failures.push("asset plan aspect_ratio is invalid");
  }
  if (beats.length === 0) failures.push("asset plan has no beats");

  const selectedLibraryIds = new Set(
    Array.isArray(assetPlan?.asset_library?.selected_asset_ids) ? assetPlan.asset_library.selected_asset_ids : [],
  );
  if (assetPlan?.asset_library) {
    if (!Array.isArray(assetPlan.asset_library.queries)) failures.push("asset library queries must be an array");
    if (!Array.isArray(assetPlan.asset_library.selected_asset_ids)) failures.push("asset library selected_asset_ids must be an array");
  }

  const beatIds = new Set<string>();
  beats.forEach((beat, index) => {
    const label = beat?.id || `beat-${index + 1}`;
    if (!hasText(beat?.id)) failures.push(`asset beat ${index + 1} is missing id`);
    else if (beatIds.has(beat.id)) failures.push(`duplicate asset beat id ${beat.id}`);
    else beatIds.add(beat.id);
    if (!(beat?.start_sec >= 0) || !(beat?.end_sec > beat?.start_sec)) {
      failures.push(`${label} has an invalid time range`);
    }
    if (index === 0 && Math.abs(beat.start_sec) > 0.25) failures.push(`${label} must begin at 0 seconds`);
    if (index > 0) {
      const delta = beat.start_sec - beats[index - 1].end_sec;
      if (Math.abs(delta) > 0.25) {
        failures.push(`${label} has a ${delta > 0 ? "gap" : "overlap"} of ${Math.abs(delta).toFixed(2)}s`);
      }
    }
    if (!hasText(beat?.copy)) failures.push(`${label} is missing copy`);
    if (!visualRoles.includes(beat?.visual_role)) failures.push(`${label} has invalid visual_role`);
    if (!assetTypes.includes(beat?.asset_type)) failures.push(`${label} has invalid asset_type`);
    if (!statuses.includes(beat?.status)) failures.push(`${label} has invalid status`);
    if (!hasText(beat?.provenance)) failures.push(`${label} is missing provenance`);
    if (!rightsValues.includes(beat?.rights)) failures.push(`${label} has invalid rights`);
    if (!hasText(beat?.fallback)) failures.push(`${label} is missing fallback`);
    if (beat?.library_asset_id && !/^[a-z0-9-]+:[a-z0-9][a-z0-9:._-]*$/.test(beat.library_asset_id)) {
      failures.push(`${label} has an invalid library_asset_id`);
    }
    if (beat?.library_asset_id && selectedLibraryIds.size > 0 && !selectedLibraryIds.has(beat.library_asset_id)) {
      warnings.push(`${label} library_asset_id is not listed in asset_library.selected_asset_ids`);
    }

    if (beat?.rights === "licensed") {
      if (!hasText(beat.license_url) || !isWebUrl(beat.license_url)) {
        failures.push(`${label} licensed asset is missing a valid license_url`);
      }
      if (!hasText(beat.creator)) failures.push(`${label} licensed asset is missing creator`);
      if (!hasText(beat.retrieved_at)) failures.push(`${label} licensed asset is missing retrieved_at`);
    }
    if (beat?.asset_type === "source-video" && beat?.rights === "public-source") {
      failures.push(`${label} source-video cannot treat a public URL as media permission`);
    }
    if (beat?.rights === "commentary-review") {
      if (beat.editorial_approval !== "approved") {
        const message = `${label} commentary excerpt needs explicit editorial approval`;
        if (production) failures.push(message);
        else warnings.push(message);
      }
      if (!(beat.source_end_sec! > beat.source_start_sec!)) {
        failures.push(`${label} commentary excerpt needs a valid source time range`);
      }
    }

    const beatFacts = Array.isArray(beat?.fact_ids) ? beat.fact_ids : [];
    const beatSources = Array.isArray(beat?.source_ids) ? beat.source_ids : [];
    const unknownFacts = beatFacts.filter((id) => !factIds.has(id));
    const unknownSources = beatSources.filter((id) => !sourceIds.has(id));
    if (unknownFacts.length > 0) failures.push(`${label} references unknown facts: ${unknownFacts.join(", ")}`);
    if (unknownSources.length > 0) failures.push(`${label} references unknown sources: ${unknownSources.join(", ")}`);
    if (beat.visual_role === "evidence") {
      if (beatFacts.length === 0 || beatSources.length === 0) {
        failures.push(`${label} evidence needs fact_ids and source_ids`);
      }
      if (beat.asset_type === "generated-still" || beat.asset_type === "generated-video") {
        failures.push(`${label} cannot use generated media as factual evidence`);
      }
    }
    if (production && beat.status !== "ready") failures.push(`${label} is not ready for production`);
    if (production && beat.rights === "prototype-only") failures.push(`${label} has prototype-only rights`);
    if (production && fileBackedAssets.has(beat.asset_type)) {
      if (!hasText(beat.asset_path)) failures.push(`${label} is missing asset_path`);
      else if (!existsSync(resolve(baseDir, beat.asset_path))) failures.push(`${label} asset does not exist: ${beat.asset_path}`);
    }
  });

  const finalBeat = beats[beats.length - 1];
  if (finalBeat && assetPlan?.duration_sec > 0 && Math.abs(finalBeat.end_sec - assetPlan.duration_sec) > 0.5) {
    failures.push("asset plan duration_sec does not match the final beat");
  }

  const passed = failures.length === 0;
  return {
    passed,
    failures,
    warnings,
    summaryMarkdown: [
      "# Content Evidence Audit",
      "",
      `Status: ${passed ? "PASS" : "FAIL"}`,
      `Mode: ${production ? "production" : "prototype"}`,
      `Sources: ${sources.length}`,
      `Facts: ${facts.length}`,
      `Asset beats: ${beats.length}`,
      "",
      "## Failures",
      "",
      ...(failures.length > 0 ? failures.map((item) => `- ${item}`) : ["- None"]),
      "",
      "## Warnings",
      "",
      ...(warnings.length > 0 ? warnings.map((item) => `- ${item}`) : ["- None"]),
      "",
    ].join("\n"),
  };
}

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

if (import.meta.main) {
  const factPackPath = argValue("--fact-pack");
  const assetPlanPath = argValue("--asset-plan");
  const outputPath = argValue("--output");
  if (!factPackPath || !assetPlanPath) {
    console.error("Usage: bun content-evidence-audit.ts --fact-pack <file> --asset-plan <file> [--production] [--output <file>]");
    process.exit(2);
  }
  const factPack = JSON.parse(readFileSync(resolve(factPackPath), "utf8")) as FactPack;
  const assetPlan = JSON.parse(readFileSync(resolve(assetPlanPath), "utf8")) as AssetPlan;
  const result = auditContentEvidence(factPack, assetPlan, {
    production: process.argv.includes("--production"),
    baseDir: dirname(resolve(assetPlanPath)),
  });
  if (outputPath) {
    const target = resolve(outputPath);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, result.summaryMarkdown);
  }
  console.log(result.summaryMarkdown);
  process.exit(result.passed ? 0 : 1);
}
