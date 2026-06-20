import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildContentIngestStatements,
  buildMetricSnapshotUpsertStatement,
  buildRybbitPathMetricStatements,
  contentIdentitySlug,
  readingMinutes,
  selectContentItems,
} from '../lib/ingest.mjs';

test('contentIdentitySlug keeps English slug and suffixes localized variants', () => {
  assert.equal(contentIdentitySlug({ slug: 'fable-5-managing-ai-autonomy', language: 'en' }), 'fable-5-managing-ai-autonomy');
  assert.equal(contentIdentitySlug({ slug: 'fable-5-managing-ai-autonomy', language: 'zh' }), 'fable-5-managing-ai-autonomy-zh');
});

test('readingMinutes rounds up and handles empty content', () => {
  assert.equal(readingMinutes(0), 0);
  assert.equal(readingMinutes(1), 1);
  assert.equal(readingMinutes(440), 2);
  assert.equal(readingMinutes(441), 3);
});

test('selectContentItems filters by identity slugs or canonical paths before applying limit', () => {
  const items = [
    { slug: 'a', language: 'en', canonicalPath: '/blogs/a' },
    { slug: 'b', language: 'zh', canonicalPath: '/zh/blogs/b' },
    { slug: 'c', language: 'en', canonicalPath: '/blogs/c' },
  ];

  assert.deepEqual(selectContentItems(items, { slugs: 'b-zh,c', limit: 5 }).map(contentIdentitySlug), ['b-zh', 'c']);
  assert.deepEqual(selectContentItems(items, { slugs: 'b', limit: 5 }).map(contentIdentitySlug), []);
  assert.deepEqual(selectContentItems(items, { paths: '/blogs/a,/blogs/c', limit: 1 }).map(contentIdentitySlug), ['a']);
});

test('buildContentIngestStatements upserts content and maps canonical paths', () => {
  const statements = buildContentIngestStatements([
    {
      filePath: '/repo/content/blogs/zh/25.fable.md',
      slug: 'fable',
      title: 'Fable 5',
      date: '2026-06-15',
      language: 'zh',
      canonicalPath: '/zh/blogs/fable',
      wordCount: 441,
      rawMetadata: {
        published: 'true',
        category: 'ai-native-systems',
        topics: ['agents', 'workflow'],
      },
    },
  ], { siteUrl: 'https://www.aaronguo.com' });

  assert.equal(statements.length, 2);
  assert.match(statements[0], /INSERT INTO growth_content_items/);
  assert.match(statements[0], /ON CONFLICT\(slug\) DO UPDATE SET/);
  assert.match(statements[0], /'fable-zh'/);
  assert.match(statements[0], /'2026-06-15'/);
  assert.equal(statements[0].includes("'https://www.aaronguo.com/zh/blogs/fable'"), true);
  assert.match(statements[0], /'published'/);
  assert.match(statements[0], /'ai-native-systems'/);
  assert.match(statements[0], /'agents'/);
  assert.equal(statements[0].includes('\'["workflow"]\''), true);
  assert.match(statements[1], /INSERT INTO growth_web_path_map/);
  assert.match(statements[1], /SELECT id FROM growth_content_items WHERE slug = 'fable-zh'/);
});

test('buildRybbitPathMetricStatements includes overview and custom event metrics', () => {
  const statements = buildRybbitPathMetricStatements({
    path: '/blogs/fable',
    raw: {
      data: [
        { time: '2026-06-15T00:00:00.000Z', pageviews: 12, users: 5 },
      ],
    },
    eventRows: [
      { metricDate: '2026-06-15', metricName: 'scroll_75', metricValue: 2 },
      { metricDate: '2026-06-15', metricName: 'scroll_100', metricValue: 1 },
      { metricDate: '2026-06-15', metricName: 'outbound_clicks', metricValue: 1 },
    ],
  });

  const sql = statements.join('\n');
  assert.equal(statements.length, 5);
  assert.match(sql, /'pageviews'/);
  assert.match(sql, /'unique_visitors'/);
  assert.match(sql, /'scroll_75'/);
  assert.match(sql, /'scroll_100'/);
  assert.match(sql, /'outbound_clicks'/);
});

test('buildMetricSnapshotUpsertStatement uses content path subquery and upserts metric value', () => {
  const sql = buildMetricSnapshotUpsertStatement({
    metric_date: '2026-06-15',
    source: 'rybbit',
    entity_type: 'content_item',
    entity_id_sql: "(SELECT content_item_id FROM growth_web_path_map WHERE path = '/blogs/fable')",
    external_entity_id: '/blogs/fable',
    metric_name: 'pageviews',
    metric_value: 12,
    unit: 'count',
    dimension_json: '{"path":"/blogs/fable"}',
    raw_json: '{"pageviews":12}',
  });

  assert.match(sql, /INSERT INTO growth_metric_snapshots/);
  assert.match(sql, /SELECT content_item_id FROM growth_web_path_map/);
  assert.match(sql, /'pageviews'/);
  assert.match(sql, /ON CONFLICT DO UPDATE SET/);
  assert.match(sql, /metric_value = excluded\.metric_value/);
});
