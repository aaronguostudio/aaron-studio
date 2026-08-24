#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const SOURCE_TYPES = new Set([
  "x_post",
  "youtube_video",
  "web",
  "paper",
  "reddit",
  "github",
  "hn",
  "operator_artifact",
]);
const ACCESS_METHODS = new Set([
  "public_web",
  "public_api",
  "yt_dlp",
  "browser_session",
  "browser_transcript_export",
  "manual",
  "local_artifact",
]);
const SECRET_KEYS = /^(api[_-]?key|auth[_-]?token|access[_-]?token|refresh[_-]?token|cookie|cookies|ct0|password|secret)$/i;
const SHA256 = /^[a-f0-9]{64}$/;
const ID = /^[a-z0-9][a-z0-9:._-]+$/;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isIsoDate(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function scanSecrets(value, path, issues) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanSecrets(item, `${path}[${index}]`, issues));
    return;
  }
  if (!isObject(value)) return;
  for (const [key, child] of Object.entries(value)) {
    if (SECRET_KEYS.test(key)) issues.push(`${path}.${key}: secret-bearing keys are forbidden`);
    scanSecrets(child, `${path}.${key}`, issues);
  }
}

export function validateResearchEvidence(bundle) {
  const issues = [];
  if (!isObject(bundle)) return ["$: bundle must be an object"];
  scanSecrets(bundle, "$", issues);

  if (bundle.schema_version !== "0.1") issues.push("$.schema_version: expected 0.1");
  if (!ID.test(bundle.bundle_id ?? "")) issues.push("$.bundle_id: invalid or missing ID");
  if (typeof bundle.topic !== "string" || !bundle.topic.trim()) issues.push("$.topic: required");
  if (!isIsoDate(bundle.created_at)) issues.push("$.created_at: valid date-time required");
  if (!["complete", "partial", "blocked"].includes(bundle.status)) issues.push("$.status: invalid status");

  if (!isObject(bundle.producer)) {
    issues.push("$.producer: required object");
  } else {
    if (bundle.producer.skill !== "research-evidence") issues.push("$.producer.skill: expected research-evidence");
    if (!/^\d+\.\d+\.\d+$/.test(bundle.producer.skill_version ?? "")) issues.push("$.producer.skill_version: semver required");
    if (typeof bundle.producer.run_id !== "string" || !bundle.producer.run_id) issues.push("$.producer.run_id: required");
    for (const key of ["started_at", "completed_at"]) {
      if (bundle.producer[key] !== undefined && !isIsoDate(bundle.producer[key])) issues.push(`$.producer.${key}: invalid date-time`);
    }
  }

  const sourceIds = new Set();
  if (!Array.isArray(bundle.sources) || bundle.sources.length === 0) {
    issues.push("$.sources: at least one source required");
  } else {
    bundle.sources.forEach((source, index) => {
      const path = `$.sources[${index}]`;
      if (!isObject(source)) {
        issues.push(`${path}: source must be an object`);
        return;
      }
      if (!ID.test(source.id ?? "")) issues.push(`${path}.id: invalid or missing ID`);
      if (sourceIds.has(source.id)) issues.push(`${path}.id: duplicate source ID ${source.id}`);
      sourceIds.add(source.id);
      if (!SOURCE_TYPES.has(source.type)) issues.push(`${path}.type: invalid source type`);
      try {
        const url = new URL(source.canonical_url);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error("protocol");
      } catch {
        issues.push(`${path}.canonical_url: valid HTTP(S) URL required`);
      }
      if (!isIsoDate(source.retrieved_at)) issues.push(`${path}.retrieved_at: valid date-time required`);
      if (!ACCESS_METHODS.has(source.access_method)) issues.push(`${path}.access_method: invalid method`);
      if (source.metrics !== undefined) {
        if (!isObject(source.metrics)) issues.push(`${path}.metrics: must be an object`);
        else for (const [key, value] of Object.entries(source.metrics)) {
          if (!["views", "replies", "reposts", "likes", "bookmarks"].includes(key) || !Number.isInteger(value) || value < 0) {
            issues.push(`${path}.metrics.${key}: expected a supported non-negative integer metric`);
          }
        }
      }
      if (source.transcript !== undefined) {
        const transcript = source.transcript;
        if (!isObject(transcript) || !["available", "missing", "not_applicable"].includes(transcript.status)) {
          issues.push(`${path}.transcript.status: invalid or missing`);
        } else if (transcript.status === "available") {
          if (typeof transcript.language !== "string" || !transcript.language) issues.push(`${path}.transcript.language: required when available`);
          if (!["human", "auto_generated", "translated", "unknown"].includes(transcript.caption_kind)) issues.push(`${path}.transcript.caption_kind: required when available`);
          if (!["public_api", "yt_dlp", "browser_export", "manual", "third_party"].includes(transcript.retrieval_method)) issues.push(`${path}.transcript.retrieval_method: required when available`);
          for (const key of ["word_count", "line_count", "byte_count"]) {
            if (!Number.isInteger(transcript[key]) || transcript[key] < 1) issues.push(`${path}.transcript.${key}: positive integer required when available`);
          }
          if (!SHA256.test(transcript.sha256 ?? "")) issues.push(`${path}.transcript.sha256: SHA-256 required when available`);
        }
      }
    });
  }

  if (Array.isArray(bundle.sources)) {
    bundle.sources.forEach((source, index) => {
      for (const linkedId of source?.linked_source_ids ?? []) {
        if (!sourceIds.has(linkedId)) issues.push(`$.sources[${index}].linked_source_ids: unknown source ${linkedId}`);
      }
    });
  }

  const claimIds = new Set();
  if (!Array.isArray(bundle.claims)) {
    issues.push("$.claims: array required");
  } else {
    bundle.claims.forEach((claim, index) => {
      const path = `$.claims[${index}]`;
      if (!isObject(claim)) {
        issues.push(`${path}: claim must be an object`);
        return;
      }
      if (!ID.test(claim.id ?? "")) issues.push(`${path}.id: invalid or missing ID`);
      if (claimIds.has(claim.id)) issues.push(`${path}.id: duplicate claim ID ${claim.id}`);
      claimIds.add(claim.id);
      if (!["source_fact", "inference", "operator_observation"].includes(claim.kind)) issues.push(`${path}.kind: invalid claim kind`);
      if (typeof claim.text !== "string" || !claim.text.trim()) issues.push(`${path}.text: required`);
      if (!Array.isArray(claim.source_ids)) issues.push(`${path}.source_ids: array required`);
      else {
        if (claim.kind !== "operator_observation" && claim.source_ids.length === 0) issues.push(`${path}.source_ids: external claims require a source`);
        for (const sourceId of claim.source_ids) {
          if (!sourceIds.has(sourceId)) issues.push(`${path}.source_ids: unknown source ${sourceId}`);
        }
      }
      if (!["verified", "partial", "unverified"].includes(claim.verification_status)) issues.push(`${path}.verification_status: invalid`);
      if (!["high", "medium", "low"].includes(claim.confidence)) issues.push(`${path}.confidence: invalid`);
      if (claim.kind === "operator_observation" && claim.source_ids?.length === 0 && (typeof claim.notes !== "string" || !claim.notes.trim())) {
        issues.push(`${path}.notes: source-free operator observations must name the observed artifact or run`);
      }
    });
  }

  if (!isObject(bundle.coverage) || !Array.isArray(bundle.coverage.discovery_methods) || !Array.isArray(bundle.coverage.unresolved_gaps)) {
    issues.push("$.coverage: discovery_methods and unresolved_gaps arrays required");
  }
  if (!isObject(bundle.privacy)) {
    issues.push("$.privacy: required object");
  } else {
    for (const key of ["api_keys_added", "cookie_values_persisted", "account_mutations"]) {
      if (bundle.privacy[key] !== false) issues.push(`$.privacy.${key}: must be false`);
    }
  }

  return issues;
}

export function loadAndValidate(path) {
  return validateResearchEvidence(JSON.parse(readFileSync(path, "utf8")));
}

function main() {
  const path = process.argv[2];
  if (!path) {
    console.error("Usage: node validate-research-evidence.mjs <research-evidence.json>");
    process.exit(2);
  }
  let issues;
  try {
    issues = loadAndValidate(path);
  } catch (error) {
    console.error(`FAIL ${path}: ${error.message}`);
    process.exit(1);
  }
  if (issues.length) {
    console.error(`FAIL ${path}: ${issues.length} issue(s)`);
    issues.forEach((issue) => console.error(`- ${issue}`));
    process.exit(1);
  }
  console.log(`PASS ${path}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();

