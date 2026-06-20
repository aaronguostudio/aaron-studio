import test from 'node:test';
import assert from 'node:assert/strict';
import { executeTursoPipeline, normalizeTursoHttpUrl, rowsFromTursoResult, splitSqlStatements } from '../lib/sql.mjs';

test('splitSqlStatements drops comments and empty chunks', () => {
  const statements = splitSqlStatements(`
    -- comment
    CREATE TABLE demo(id INTEGER);

    INSERT INTO demo VALUES (1);
  `);

  assert.deepEqual(statements, [
    'CREATE TABLE demo(id INTEGER)',
    'INSERT INTO demo VALUES (1)',
  ]);
});

test('executeTursoPipeline sends SQL through Turso pipeline without exposing token in URL', async () => {
  const calls = [];
  const result = await executeTursoPipeline({
    databaseUrl: 'https://example.turso.io',
    authToken: 'secret',
    statements: ['CREATE TABLE demo(id INTEGER)'],
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ baton: null, results: [] }),
      };
    },
  });

  assert.equal(calls[0].url, 'https://example.turso.io/v2/pipeline');
  assert.equal(calls[0].url.includes('secret'), false);
  assert.equal(calls[0].options.headers.Authorization, 'Bearer secret');
  assert.deepEqual(result, { baton: null, results: [] });
});

test('normalizeTursoHttpUrl converts libsql URLs to HTTPS pipeline hosts', () => {
  assert.equal(
    normalizeTursoHttpUrl('libsql://demo.aws-us-east-1.turso.io').toString(),
    'https://demo.aws-us-east-1.turso.io/',
  );
  assert.equal(
    normalizeTursoHttpUrl('https://demo.aws-us-east-1.turso.io').toString(),
    'https://demo.aws-us-east-1.turso.io/',
  );
});

test('rowsFromTursoResult maps Turso typed cells to plain objects', () => {
  const rows = rowsFromTursoResult({
    response: {
      result: {
        cols: [{ name: 'id' }, { name: 'slug' }],
        rows: [[{ value: '12' }, { value: 'fable' }]],
      },
    },
  });

  assert.deepEqual(rows, [{ id: '12', slug: 'fable' }]);
});
