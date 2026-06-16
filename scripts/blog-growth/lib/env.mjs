import { existsSync, readFileSync } from 'node:fs';

export function loadEnvText(text) {
  const env = {};

  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const normalized = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed;
    const eq = normalized.indexOf('=');
    if (eq === -1) continue;

    const key = normalized.slice(0, eq).trim();
    let value = normalized.slice(eq + 1).trim();
    if (!key) continue;

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

export function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  return loadEnvText(readFileSync(filePath, 'utf8'));
}

export function mergeEnv(envObjects) {
  const merged = {};

  for (const env of envObjects) {
    for (const [key, value] of Object.entries(env)) {
      if (merged[key] === undefined && value !== undefined) {
        merged[key] = value;
      }
    }
  }

  return merged;
}

export function redactEnv(env) {
  const redacted = {};

  for (const [key, value] of Object.entries(env)) {
    redacted[key] = value ? '[set]' : '[empty]';
  }

  return redacted;
}
