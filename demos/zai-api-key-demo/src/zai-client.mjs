import { access, readFile } from 'node:fs/promises';
import https from 'node:https';
import path from 'node:path';

export const DEFAULT_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';
export const DEFAULT_MODEL = 'glm-4.5-flash';

export function parseDotEnv(contents) {
  const values = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const equalsIndex = line.indexOf('=');
    if (equalsIndex === -1) continue;

    const key = line.slice(0, equalsIndex).trim();
    let value = line.slice(equalsIndex + 1).trim();
    if (!key) continue;

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

export async function findEnvFile(startDir = process.cwd()) {
  let currentDir = path.resolve(startDir);

  while (true) {
    const candidate = path.join(currentDir, '.env');

    try {
      await access(candidate);
      return candidate;
    } catch {
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) return null;
      currentDir = parentDir;
    }
  }
}

export async function loadZaiApiKey({
  cwd = process.cwd(),
  env = process.env,
  envFilePath
} = {}) {
  const fromEnv = normalizeSecret(env.ZAI_API_KEY);
  if (fromEnv) return fromEnv;

  const filePath = envFilePath ?? (await findEnvFile(cwd));
  if (filePath) {
    const parsed = parseDotEnv(await readFile(filePath, 'utf8'));
    const fromFile = normalizeSecret(parsed.ZAI_API_KEY);
    if (fromFile) return fromFile;
  }

  throw new Error(
    'ZAI_API_KEY is missing. Add ZAI_API_KEY=... to .env or export it in your shell.'
  );
}

export function buildChatCompletionRequest({
  apiKey,
  prompt = '只回复 pong，用来验证 API key。',
  systemPrompt = '你是一个有用的 AI 助手。请直接回答用户问题。',
  model = DEFAULT_MODEL,
  baseUrl = DEFAULT_BASE_URL,
  maxTokens = 64,
  timeoutMs = 30_000
}) {
  if (!normalizeSecret(apiKey)) {
    throw new Error('apiKey is required.');
  }

  const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
  const body = {
    model,
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    stream: false,
    do_sample: false,
    thinking: { type: 'disabled' },
    max_tokens: maxTokens
  };

  return {
    url,
    init: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      timeoutMs
    }
  };
}

export async function checkZaiApiKey({
  cwd = process.cwd(),
  env = process.env,
  httpPost,
  fetchImpl,
  model = env.ZAI_MODEL || DEFAULT_MODEL,
  baseUrl = env.ZAI_BASE_URL || DEFAULT_BASE_URL,
  prompt,
  systemPrompt,
  maxTokens,
  timeoutMs
} = {}) {
  const sendRequest = httpPost ?? fetchImpl ?? postJson;
  if (typeof sendRequest !== 'function') {
    throw new Error('No HTTP transport is available.');
  }

  const apiKey = await loadZaiApiKey({ cwd, env });
  const request = buildChatCompletionRequest({
    apiKey,
    model,
    baseUrl,
    prompt,
    systemPrompt,
    maxTokens,
    timeoutMs
  });

  const response = await sendRequest(request.url, request.init);
  const responseText = await response.text();
  const parsed = parseJsonSafely(responseText);

  if (!response.ok) {
    const detail = responseText ? `: ${redactSecret(responseText, apiKey)}` : '';
    throw new Error(
      `ZAI API request failed: ${response.status} ${response.statusText}${detail}`
    );
  }

  const message = parsed?.choices?.[0]?.message?.content;
  if (!message) {
    throw new Error(
      `ZAI API response did not include choices[0].message.content: ${redactSecret(
        responseText,
        apiKey
      )}`
    );
  }

  return {
    ok: true,
    status: response.status,
    requestId: parsed.request_id || parsed.id || null,
    model: parsed.model || model,
    message
  };
}

export async function postJson(url, init) {
  return new Promise((resolve, reject) => {
    const body = init.body ?? '';
    const timeoutMs = init.timeoutMs ?? 30_000;
    const headers = {
      ...init.headers,
      'Content-Length': Buffer.byteLength(body)
    };

    const request = https.request(
      url,
      {
        method: init.method,
        headers,
        timeout: timeoutMs
      },
      response => {
        let responseText = '';
        response.setEncoding('utf8');
        response.on('data', chunk => {
          responseText += chunk;
        });
        response.on('end', () => {
          resolve({
            ok: response.statusCode >= 200 && response.statusCode < 300,
            status: response.statusCode,
            statusText: response.statusMessage,
            text: async () => responseText
          });
        });
      }
    );

    request.on('timeout', () => {
      request.destroy(new Error(`Request timed out after ${timeoutMs}ms.`));
    });
    request.on('error', reject);
    request.end(body);
  });
}

export function redactSecret(text, secret) {
  if (!text || !secret) return text;
  return text.replaceAll(secret, '[REDACTED]');
}

function normalizeSecret(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function parseJsonSafely(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
