import test from 'node:test';
import assert from 'node:assert/strict';
import { loadEnvText, mergeEnv } from '../lib/env.mjs';

test('loadEnvText parses comments, quoted values, and empty values', () => {
  const parsed = loadEnvText(`
    # comment
    RYBBIT_SITE_ID=82289e0e12a1
    QUOTED_VALUE="example"
    EMPTY=
  `);

  assert.deepEqual(parsed, {
    RYBBIT_SITE_ID: '82289e0e12a1',
    QUOTED_VALUE: 'example',
    EMPTY: '',
  });
});

test('mergeEnv preserves earlier values by default', () => {
  const merged = mergeEnv([{ A: 'first' }, { A: 'second', B: 'two' }]);
  assert.deepEqual(merged, { A: 'first', B: 'two' });
});
