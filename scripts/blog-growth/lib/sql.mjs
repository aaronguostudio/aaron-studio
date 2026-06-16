export function splitSqlStatements(sql) {
  return sql
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('--'))
    .join('\n')
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);
}

export function sqlLiteral(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL';
  return `'${String(value).replaceAll("'", "''")}'`;
}

export function buildInsertStatement(table, row) {
  const columns = Object.keys(row);
  const values = columns.map((column) => sqlLiteral(row[column]));
  return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.join(', ')})`;
}

export function buildTursoPipeline(statements) {
  return {
    requests: [
      ...statements.map((sql) => ({
        type: 'execute',
        stmt: { sql },
      })),
      { type: 'close' },
    ],
  };
}

export async function executeTursoPipeline({
  databaseUrl,
  authToken,
  statements,
  fetchImpl = fetch,
}) {
  if (!databaseUrl) throw new Error('TURSO_URL is required');
  if (!authToken) throw new Error('TURSO_AUTH_TOKEN is required');

  const response = await fetchImpl(new URL('/v2/pipeline', normalizeTursoHttpUrl(databaseUrl)), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(buildTursoPipeline(statements)),
  });

  const text = await response.text();
  const json = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(json?.error || `Turso request failed with HTTP ${response.status}`);
  }

  return json;
}

export function normalizeTursoHttpUrl(databaseUrl) {
  const url = new URL(databaseUrl);
  if (url.protocol === 'libsql:') {
    return new URL(`https://${url.host}${url.pathname || '/'}`);
  }
  return url;
}
