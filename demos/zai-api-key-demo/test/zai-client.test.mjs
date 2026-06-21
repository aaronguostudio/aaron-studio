import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  buildChatCompletionRequest,
  checkZaiApiKey,
  loadZaiApiKey,
  parseDotEnv,
  redactSecret
} from '../src/zai-client.mjs';
import { parseAskArgs } from '../src/ask-cli.mjs';

test('parseDotEnv reads unquoted and quoted ZAI_API_KEY values', () => {
  assert.deepEqual(
    parseDotEnv(`
      # local secrets
      OPENAI_API_KEY=ignored
      ZAI_API_KEY="zai.test.key"
      ZAI_MODEL='glm-4.5-flash'
    `),
    {
      OPENAI_API_KEY: 'ignored',
      ZAI_API_KEY: 'zai.test.key',
      ZAI_MODEL: 'glm-4.5-flash'
    }
  );
});

test('loadZaiApiKey prefers process env over .env files', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'zai-demo-'));
  await writeFile(path.join(root, '.env'), 'ZAI_API_KEY=file-key\n');

  const apiKey = await loadZaiApiKey({
    cwd: root,
    env: { ZAI_API_KEY: 'env-key' }
  });

  assert.equal(apiKey, 'env-key');
});

test('loadZaiApiKey finds .env in a parent directory', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'zai-demo-'));
  const nested = path.join(root, 'a', 'b');
  await mkdir(nested, { recursive: true });
  await writeFile(path.join(root, '.env'), 'ZAI_API_KEY=file-key\n');

  const apiKey = await loadZaiApiKey({ cwd: nested, env: {} });

  assert.equal(apiKey, 'file-key');
});

test('buildChatCompletionRequest matches the documented chat completions API', () => {
  const request = buildChatCompletionRequest({
    apiKey: 'secret-key',
    prompt: '只回复 pong',
    model: 'glm-4.5-flash'
  });

  assert.equal(
    request.url,
    'https://open.bigmodel.cn/api/paas/v4/chat/completions'
  );
  assert.equal(request.init.method, 'POST');
  assert.equal(request.init.headers.Authorization, 'Bearer secret-key');
  assert.equal(request.init.headers['Content-Type'], 'application/json');

  const body = JSON.parse(request.init.body);
  assert.equal(body.model, 'glm-4.5-flash');
  assert.equal(body.stream, false);
  assert.equal(body.messages.at(-1).content, '只回复 pong');
});

test('buildChatCompletionRequest lets practical prompts request more tokens', () => {
  const request = buildChatCompletionRequest({
    apiKey: 'secret-key',
    prompt: '写一个 flappy bird 游戏',
    model: 'glm-5.2',
    maxTokens: 4096
  });

  const body = JSON.parse(request.init.body);
  assert.equal(body.model, 'glm-5.2');
  assert.equal(body.max_tokens, 4096);
  assert.equal(body.messages.at(-1).content, '写一个 flappy bird 游戏');
});

test('parseAskArgs reads model, max tokens, output path, and prompt text', () => {
  assert.deepEqual(
    parseAskArgs([
      '--model',
      'glm-5.2',
      '--max-tokens',
      '4096',
      '--timeout-ms',
      '120000',
      '--output',
      'output/flappy-bird.html',
      '写一个 flappy bird 游戏'
    ]),
    {
      model: 'glm-5.2',
      maxTokens: 4096,
      timeoutMs: 120000,
      outputPath: 'output/flappy-bird.html',
      prompt: '写一个 flappy bird 游戏'
    }
  );
});

test('checkZaiApiKey passes custom timeout to the HTTP transport', async () => {
  const calls = [];
  const httpPost = async (url, init) => {
    calls.push({ url, init });
    return new Response(
      JSON.stringify({
        request_id: 'req-timeout',
        model: 'glm-5.2',
        choices: [{ message: { content: 'ok' } }]
      })
    );
  };

  await checkZaiApiKey({
    env: { ZAI_API_KEY: 'secret-key' },
    httpPost,
    timeoutMs: 120000
  });

  assert.equal(calls[0].init.timeoutMs, 120000);
});

test('checkZaiApiKey returns a small success summary without exposing the key', async () => {
  const calls = [];
  const httpPost = async (url, init) => {
    calls.push({ url, init });
    return new Response(
      JSON.stringify({
        request_id: 'req-123',
        model: 'glm-4.5-flash',
        choices: [{ message: { content: 'pong' } }]
      }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    );
  };

  const result = await checkZaiApiKey({
    env: { ZAI_API_KEY: 'secret-key' },
    httpPost
  });

  assert.equal(result.ok, true);
  assert.equal(result.requestId, 'req-123');
  assert.equal(result.model, 'glm-4.5-flash');
  assert.equal(result.message, 'pong');
  assert.equal(calls.length, 1);
  assert.doesNotMatch(JSON.stringify(result), /secret-key/);
});

test('checkZaiApiKey redacts the key from API error bodies', async () => {
  const httpPost = async () =>
    new Response('bad token secret-key', { status: 401, statusText: 'Unauthorized' });

  await assert.rejects(
    checkZaiApiKey({
      env: { ZAI_API_KEY: 'secret-key' },
      httpPost
    }),
    error => {
      assert.match(error.message, /401 Unauthorized/);
      assert.doesNotMatch(error.message, /secret-key/);
      assert.match(error.message, /\[REDACTED\]/);
      return true;
    }
  );
});

test('redactSecret leaves unrelated text alone', () => {
  assert.equal(redactSecret('hello world', 'secret-key'), 'hello world');
  assert.equal(redactSecret('hello secret-key', 'secret-key'), 'hello [REDACTED]');
});
