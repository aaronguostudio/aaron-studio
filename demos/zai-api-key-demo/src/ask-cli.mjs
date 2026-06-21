#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { checkZaiApiKey } from './zai-client.mjs';

const DEFAULT_ASK_MODEL = 'glm-5.2';
const DEFAULT_ASK_MAX_TOKENS = 4096;
const DEFAULT_ASK_TIMEOUT_MS = 120_000;
const DEFAULT_ASK_SYSTEM_PROMPT =
  '你是一个资深工程师。请直接给出可运行、完整、清晰的答案。';

export function parseAskArgs(argv) {
  const options = {};
  const promptParts = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--model') {
      options.model = readOptionValue(argv, (index += 1), '--model');
    } else if (arg === '--max-tokens') {
      options.maxTokens = parsePositiveInteger(
        readOptionValue(argv, (index += 1), '--max-tokens'),
        '--max-tokens'
      );
    } else if (arg === '--timeout-ms') {
      options.timeoutMs = parsePositiveInteger(
        readOptionValue(argv, (index += 1), '--timeout-ms'),
        '--timeout-ms'
      );
    } else if (arg === '--output' || arg === '-o') {
      options.outputPath = readOptionValue(argv, (index += 1), arg);
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      promptParts.push(arg);
    }
  }

  const prompt = promptParts.join(' ').trim();
  if (prompt) options.prompt = prompt;

  return options;
}

export async function runAskCli({
  argv = process.argv.slice(2),
  cwd = process.cwd(),
  env = process.env,
  stdout = process.stdout,
  stderr = process.stderr
} = {}) {
  const options = parseAskArgs(argv);

  if (options.help || !options.prompt) {
    stdout.write(usage());
    return options.help ? 0 : 1;
  }

  try {
    const result = await checkZaiApiKey({
      cwd,
      env,
      model: options.model || env.ZAI_MODEL || DEFAULT_ASK_MODEL,
      prompt: options.prompt,
      systemPrompt: DEFAULT_ASK_SYSTEM_PROMPT,
      maxTokens:
        options.maxTokens ||
        parseOptionalPositiveInteger(env.ZAI_MAX_TOKENS) ||
        DEFAULT_ASK_MAX_TOKENS,
      timeoutMs:
        options.timeoutMs ||
        parseOptionalPositiveInteger(env.ZAI_TIMEOUT_MS) ||
        DEFAULT_ASK_TIMEOUT_MS
    });

    stdout.write(`ZAI request succeeded.\n`);
    stdout.write(`Model: ${result.model}\n`);
    if (result.requestId) stdout.write(`Request ID: ${result.requestId}\n`);

    if (options.outputPath) {
      const outputPath = path.resolve(cwd, options.outputPath);
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, result.message, 'utf8');
      stdout.write(`Saved reply: ${outputPath}\n`);
    } else {
      stdout.write(`${result.message}\n`);
    }

    return 0;
  } catch (error) {
    stderr.write('ZAI request failed.\n');
    stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return 1;
  }
}

function usage() {
  return `Usage:
  npm run ask -- [--model glm-5.2] [--max-tokens 4096] [--output reply.md] "your prompt"
  npm run ask -- [--timeout-ms 120000] "your prompt"

Examples:
  npm run ask -- --model glm-5.2 "解释一下递归"
  npm run ask -- --model glm-5.2 --max-tokens 8192 --timeout-ms 120000 --output output/flappy-bird.html "写一个单文件 HTML Flappy Bird 游戏"
`;
}

function readOptionValue(argv, index, optionName) {
  const value = argv[index];
  if (!value || value.startsWith('-')) {
    throw new Error(`${optionName} requires a value.`);
  }
  return value;
}

function parsePositiveInteger(value, optionName) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${optionName} must be a positive integer.`);
  }
  return parsed;
}

function parseOptionalPositiveInteger(value) {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = await runAskCli();
}
