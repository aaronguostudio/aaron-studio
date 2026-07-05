import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildRybbitEventsUrl,
  buildRybbitOverviewUrl,
  buildRybbitUrl,
  fetchRybbitJson,
  normalizeEventRowsByDay,
  normalizeOverviewBucketed,
} from '../lib/rybbit.mjs';

test('buildRybbitUrl builds a stats endpoint URL without leaking the key', () => {
  const url = buildRybbitUrl({
    baseUrl: 'https://app.rybbit.io',
    siteId: 'site123',
    endpoint: '/overview',
    query: {
      bucket: 'day',
      start_date: '2026-06-01',
      end_date: '2026-06-02',
      time_zone: 'America/Edmonton',
    },
  });

  assert.equal(
    url.toString(),
    'https://app.rybbit.io/api/sites/site123/overview?bucket=day&start_date=2026-06-01&end_date=2026-06-02&time_zone=America%2FEdmonton',
  );
});

test('buildRybbitOverviewUrl uses the current time-series endpoint for path metrics', () => {
  const url = buildRybbitOverviewUrl({
    baseUrl: 'https://app.rybbit.io',
    siteId: 'site123',
    start: '2026-06-01',
    end: '2026-06-02',
    timeZone: 'America/Edmonton',
    path: '/blogs/fable',
  });

  assert.equal(url.pathname, '/api/sites/site123/overview/time-series');
  assert.equal(url.searchParams.get('bucket'), 'day');
  assert.equal(url.searchParams.get('start_date'), '2026-06-01');
  assert.equal(url.searchParams.get('end_date'), '2026-06-02');
  assert.equal(url.searchParams.get('time_zone'), 'America/Edmonton');
  assert.match(url.searchParams.get('filters'), /"pathname"/);
  assert.match(url.searchParams.get('filters'), /"\/blogs\/fable"/);
});

test('normalizeOverviewBucketed converts Rybbit rows into metric snapshots', () => {
  const snapshots = normalizeOverviewBucketed({
    contentItemId: 7,
    raw: {
      data: [
        { time: '2026-06-01T00:00:00.000Z', pageviews: 10, users: 4 },
      ],
    },
  });

  assert.deepEqual(snapshots.map((row) => [row.metric_date, row.metric_name, row.metric_value]), [
    ['2026-06-01', 'pageviews', 10],
    ['2026-06-01', 'unique_visitors', 4],
  ]);
});

test('buildRybbitEventsUrl builds paginated event URLs for a path', () => {
  const url = buildRybbitEventsUrl({
    baseUrl: 'https://app.rybbit.io',
    siteId: 'site123',
    start: '2026-06-01',
    end: '2026-06-02',
    timeZone: 'America/Edmonton',
    path: '/blogs/fable',
    pageSize: 250,
    sinceTimestamp: '2026-06-01T00:00:00.000Z',
  });

  assert.equal(url.pathname, '/api/sites/site123/events');
  assert.equal(url.searchParams.get('page_size'), '250');
  assert.equal(url.searchParams.get('start_date'), '2026-06-01');
  assert.equal(url.searchParams.get('end_date'), '2026-06-02');
  assert.equal(url.searchParams.get('time_zone'), 'America/Edmonton');
  assert.equal(url.searchParams.get('since_timestamp'), '2026-06-01T00:00:00.000Z');
  assert.match(url.searchParams.get('filters'), /"pathname"/);
  assert.match(url.searchParams.get('filters'), /"\/blogs\/fable"/);
});

test('normalizeEventRowsByDay counts selected custom events by day', () => {
  const rows = [
    { timestamp: '2026-06-01T10:00:00.000Z', event_name: 'scroll_75' },
    { timestamp: '2026-06-01T10:05:00.000Z', event_name: 'scroll_75' },
    { timestamp: '2026-06-01T10:10:00.000Z', event_name: 'scroll_100' },
    { timestamp: '2026-06-02T10:15:00.000Z', event_name: 'outbound_click' },
    { timestamp: '2026-06-02T10:20:00.000Z', event_name: 'scroll_25' },
  ];

  assert.deepEqual(normalizeEventRowsByDay(rows, {
    scroll_75: 'scroll_75',
    scroll_100: 'scroll_100',
    outbound_click: 'outbound_clicks',
  }), [
    { metricDate: '2026-06-01', metricName: 'scroll_75', metricValue: 2 },
    { metricDate: '2026-06-01', metricName: 'scroll_100', metricValue: 1 },
    { metricDate: '2026-06-02', metricName: 'outbound_clicks', metricValue: 1 },
  ]);
});

test('fetchRybbitJson sends bearer auth and parses JSON', async () => {
  const calls = [];
  const json = await fetchRybbitJson({
    apiKey: 'secret',
    url: new URL('https://app.rybbit.io/api/sites/site123/overview'),
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ data: { pageviews: 10 } }),
      };
    },
  });

  assert.deepEqual(json, { data: { pageviews: 10 } });
  assert.equal(calls[0].options.headers.Authorization, 'Bearer secret');
});

test('fetchRybbitJson retries rate limited responses when configured', async () => {
  let attempts = 0;
  const json = await fetchRybbitJson({
    apiKey: 'secret',
    url: new URL('https://app.rybbit.io/api/sites/site123/events'),
    retries: 1,
    retryDelayMs: 0,
    fetchImpl: async () => {
      attempts += 1;
      if (attempts === 1) {
        return {
          ok: false,
          status: 429,
          text: async () => JSON.stringify({ error: 'Rate limit exceeded' }),
        };
      }
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ data: [] }),
      };
    },
  });

  assert.equal(attempts, 2);
  assert.deepEqual(json, { data: [] });
});
