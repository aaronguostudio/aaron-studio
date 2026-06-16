export function buildRybbitUrl({ baseUrl = 'https://app.rybbit.io', siteId, endpoint, query = {} }) {
  if (!siteId) throw new Error('siteId is required');
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`/api/sites/${siteId}${normalizedEndpoint}`, baseUrl);

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

export function buildRybbitEventsUrl({
  baseUrl = 'https://app.rybbit.io',
  siteId,
  start,
  end,
  timeZone,
  path,
  pageSize = 500,
  sinceTimestamp,
  beforeTimestamp,
}) {
  return buildRybbitUrl({
    baseUrl,
    siteId,
    endpoint: '/events',
    query: {
      page_size: pageSize,
      start_date: start,
      end_date: end,
      time_zone: timeZone,
      filters: path ? pathnameFilter(path) : undefined,
      since_timestamp: sinceTimestamp,
      before_timestamp: beforeTimestamp,
    },
  });
}

export async function fetchRybbitJson({ apiKey, url, fetchImpl = fetch, retries = 0, retryDelayMs = 1000 }) {
  if (!apiKey) throw new Error('RYBBIT_API_KEY is required');

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const response = await fetchImpl(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
    });

    const text = await response.text();
    const json = text ? JSON.parse(text) : {};
    if (response.ok) return json;

    const message = json?.error || `Rybbit request failed with HTTP ${response.status}`;
    const rateLimited = response.status === 429 || /rate limit/i.test(message);
    if (rateLimited && attempt < retries) {
      await sleep(retryDelayMs);
      continue;
    }

    throw new Error(message);
  }

  throw new Error('Rybbit request failed');
}

export function pathnameFilter(pathname) {
  return JSON.stringify([
    {
      parameter: 'pathname',
      type: 'equals',
      value: [pathname],
    },
  ]);
}

export function normalizeOverviewBucketed({ contentItemId, raw }) {
  const rows = Array.isArray(raw?.data) ? raw.data : [];
  const snapshots = [];

  for (const row of rows) {
    const metricDate = String(row.time || '').slice(0, 10);
    if (!metricDate) continue;

    if (row.pageviews !== undefined) {
      snapshots.push(metricSnapshot({
        contentItemId,
        metricDate,
        metricName: 'pageviews',
        metricValue: Number(row.pageviews),
        raw: row,
      }));
    }

    if (row.users !== undefined) {
      snapshots.push(metricSnapshot({
        contentItemId,
        metricDate,
        metricName: 'unique_visitors',
        metricValue: Number(row.users),
        raw: row,
      }));
    }
  }

  return snapshots;
}

export function normalizeEventRowsByDay(rows, eventNameMap) {
  const counts = new Map();
  const metricOrder = new Map(Object.values(eventNameMap).map((metricName, index) => [metricName, index]));

  for (const row of rows || []) {
    const metricName = eventNameMap[row.event_name];
    const metricDate = String(row.timestamp || '').slice(0, 10);
    if (!metricName || !metricDate) continue;

    const key = `${metricDate}\t${metricName}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return [...counts.entries()]
    .map(([key, metricValue]) => {
      const [metricDate, metricName] = key.split('\t');
      return { metricDate, metricName, metricValue };
    })
    .sort((left, right) => {
      const dateOrder = left.metricDate.localeCompare(right.metricDate);
      if (dateOrder !== 0) return dateOrder;
      return (metricOrder.get(left.metricName) ?? 999) - (metricOrder.get(right.metricName) ?? 999);
    });
}

function metricSnapshot({ contentItemId, metricDate, metricName, metricValue, raw }) {
  return {
    metric_date: metricDate,
    source: 'rybbit',
    entity_type: 'content_item',
    entity_id: contentItemId,
    external_entity_id: null,
    metric_name: metricName,
    metric_value: metricValue,
    unit: 'count',
    dimension_json: '{}',
    raw_json: JSON.stringify(raw),
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, Number(ms || 0))));
}
