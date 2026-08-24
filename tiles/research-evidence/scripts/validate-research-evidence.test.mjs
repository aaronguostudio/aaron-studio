import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { validateResearchEvidence } from "./validate-research-evidence.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const fixturePath = join(here, "../fixtures/uncle-bob-agents/research-evidence.json");

function fixture() {
  return JSON.parse(readFileSync(fixturePath, "utf8"));
}

test("accepts the Uncle Bob X and YouTube evidence fixture", () => {
  assert.deepEqual(validateResearchEvidence(fixture()), []);
});

test("rejects secret-bearing keys", () => {
  const bundle = fixture();
  bundle.sources[0].auth_token = "do-not-store-this";
  assert.ok(validateResearchEvidence(bundle).some((issue) => issue.includes("secret-bearing keys")));
});

test("requires integrity metadata for an available transcript", () => {
  const bundle = fixture();
  delete bundle.sources[1].transcript.sha256;
  assert.ok(validateResearchEvidence(bundle).some((issue) => issue.includes("SHA-256 required")));
});

test("rejects claims that cite an unknown source", () => {
  const bundle = fixture();
  bundle.claims[0].source_ids = ["youtube:missing"];
  assert.ok(validateResearchEvidence(bundle).some((issue) => issue.includes("unknown source youtube:missing")));
});

