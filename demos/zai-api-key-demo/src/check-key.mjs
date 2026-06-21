#!/usr/bin/env node
import { checkZaiApiKey } from './zai-client.mjs';

try {
  const result = await checkZaiApiKey();

  console.log('ZAI API key works.');
  console.log(`Model: ${result.model}`);
  if (result.requestId) console.log(`Request ID: ${result.requestId}`);
  console.log(`Reply: ${result.message}`);
} catch (error) {
  console.error('ZAI API key check failed.');
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
