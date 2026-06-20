import { sqlLiteral } from './sql.mjs';
import { normalizeBlogDate } from './content.mjs';

export function contentIdentitySlug(item) {
  if (!item?.slug) throw new Error('content item slug is required');
  return item.language && item.language !== 'en' ? `${item.slug}-${item.language}` : item.slug;
}

export function readingMinutes(wordCount, wordsPerMinute = 220) {
  const count = Number(wordCount || 0);
  if (!Number.isFinite(count) || count <= 0) return 0;
  return Math.ceil(count / wordsPerMinute);
}

export function selectContentItems(items, { slugs = '', paths = '', limit } = {}) {
  let selected = [...items];
  const wantedSlugs = parseCsv(slugs);
  const wantedPaths = parseCsv(paths);

  if (wantedSlugs.length > 0) {
    const wanted = new Set(wantedSlugs);
    selected = selected.filter((item) => wanted.has(contentIdentitySlug(item)));
  }

  if (wantedPaths.length > 0) {
    const wanted = new Set(wantedPaths);
    selected = selected.filter((item) => wanted.has(item.canonicalPath));
  }

  const count = Number(limit || selected.length);
  return Number.isFinite(count) && count >= 0 ? selected.slice(0, count) : selected;
}

export function buildContentIngestStatements(items, { siteUrl = 'https://www.aaronguo.com' } = {}) {
  return items.flatMap((item) => [
    buildContentItemUpsertStatement(item, { siteUrl }),
    buildWebPathMapUpsertStatement(item),
  ]);
}

export function buildContentItemUpsertStatement(item, { siteUrl = 'https://www.aaronguo.com' } = {}) {
  const rawMetadata = {
    ...(item.rawMetadata || {}),
    ...(item.rawDate !== undefined ? { rawDate: item.rawDate } : {}),
  };
  const topics = Array.isArray(rawMetadata.topics) ? rawMetadata.topics : [];
  const status = normalizeStatus(rawMetadata.status || rawMetadata.published);
  const identitySlug = contentIdentitySlug(item);
  const baseUrl = siteUrl.replace(/\/+$/, '');
  const canonicalPath = item.canonicalPath || `/blogs/${item.slug}`;

  const row = {
    slug: identitySlug,
    canonical_url: `${baseUrl}${canonicalPath}`,
    source_path: item.filePath || null,
    title: item.title || item.slug,
    language: normalizeLanguage(item.language),
    content_kind: 'blog',
    content_pillar: rawMetadata.category || null,
    primary_topic: topics[0] || null,
    secondary_topics_json: JSON.stringify(topics.slice(1)),
    status,
    published_at: item.date || null,
    word_count: Number.isFinite(Number(item.wordCount)) ? Number(item.wordCount) : null,
    reading_minutes: readingMinutes(item.wordCount),
    raw_metadata_json: JSON.stringify(rawMetadata),
  };

  const columns = Object.keys(row);
  const values = columns.map((column) => sqlLiteral(row[column]));
  const updateColumns = columns.filter((column) => column !== 'slug');
  const assignments = [
    ...updateColumns.map((column) => `${column} = excluded.${column}`),
    'updated_at = datetime(\'now\')',
  ];

  return [
    `INSERT INTO growth_content_items (${columns.join(', ')})`,
    `VALUES (${values.join(', ')})`,
    'ON CONFLICT(slug) DO UPDATE SET',
    assignments.map((assignment) => `  ${assignment}`).join(',\n'),
  ].join('\n');
}

export function buildWebPathMapUpsertStatement(item) {
  const path = item.canonicalPath || `/blogs/${item.slug}`;
  const identitySlug = contentIdentitySlug(item);
  const locale = normalizeLocale(item.language);

  return [
    'INSERT INTO growth_web_path_map (path, content_item_id, locale)',
    `VALUES (${sqlLiteral(path)}, (SELECT id FROM growth_content_items WHERE slug = ${sqlLiteral(identitySlug)}), ${sqlLiteral(locale)})`,
    'ON CONFLICT(path) DO UPDATE SET',
    '  content_item_id = excluded.content_item_id,',
    '  locale = excluded.locale',
  ].join('\n');
}

export function buildChannelPostUpsertStatements(distribution) {
  if (!distribution?.slug) throw new Error('distribution slug is required');
  if (!Array.isArray(distribution.posts)) throw new Error('distribution posts must be an array');

  return distribution.posts.map((post) => buildChannelPostUpsertStatement(distribution.slug, post));
}

export function buildChannelPostUpsertStatement(slug, post) {
  const channel = normalizeChannel(post.channel);
  const rawPublishedAt = post.published_at || post.publishedAt || null;
  const publishedAt = normalizeBlogDate(rawPublishedAt) || rawPublishedAt;
  const row = {
    content_item_id: `(SELECT id FROM growth_content_items WHERE slug = ${sqlLiteral(slug)})`,
    channel,
    channel_post_id: post.channel_post_id || post.channelPostId || null,
    channel_url: post.channel_url || post.channelUrl || null,
    title: post.title || null,
    language: normalizeLanguage(post.language || 'en'),
    post_type: post.post_type || post.postType || null,
    hook_text: post.hook_text || post.hookText || null,
    cta_type: post.cta_type || post.ctaType || null,
    published_at: publishedAt || null,
    raw_metadata_json: JSON.stringify(post),
  };

  const columns = Object.keys(row);
  const values = columns.map((column) => {
    if (column === 'content_item_id') return row[column];
    return sqlLiteral(row[column]);
  });
  const updateColumns = columns.filter((column) => !['content_item_id', 'channel', 'channel_post_id'].includes(column));
  const assignments = [
    ...updateColumns.map((column) => `${column} = excluded.${column}`),
    'updated_at = datetime(\'now\')',
  ];
  const conflict = row.channel_post_id
    ? 'ON CONFLICT(channel, channel_post_id) WHERE channel_post_id IS NOT NULL DO UPDATE SET'
    : 'ON CONFLICT(content_item_id, channel, channel_url) WHERE channel_post_id IS NULL AND channel_url IS NOT NULL DO UPDATE SET';

  return [
    `INSERT INTO growth_channel_posts (${columns.join(', ')})`,
    `VALUES (${values.join(', ')})`,
    conflict,
    assignments.map((assignment) => `  ${assignment}`).join(',\n'),
  ].join('\n');
}

export function buildRybbitPathMetricStatements({ path, raw, eventRows = [] }) {
  const rows = Array.isArray(raw?.data) ? raw.data : [];
  const statements = [];

  for (const row of rows) {
    const metricDate = String(row.time || '').slice(0, 10);
    if (!metricDate) continue;

    if (row.pageviews !== undefined) {
      statements.push(buildMetricSnapshotUpsertStatement({
        metric_date: metricDate,
        source: 'rybbit',
        entity_type: 'content_item',
        entity_id_sql: contentIdForPathSql(path),
        external_entity_id: path,
        metric_name: 'pageviews',
        metric_value: Number(row.pageviews),
        unit: 'count',
        dimension_json: JSON.stringify({ path }),
        raw_json: JSON.stringify(row),
      }));
    }

    if (row.users !== undefined) {
      statements.push(buildMetricSnapshotUpsertStatement({
        metric_date: metricDate,
        source: 'rybbit',
        entity_type: 'content_item',
        entity_id_sql: contentIdForPathSql(path),
        external_entity_id: path,
        metric_name: 'unique_visitors',
        metric_value: Number(row.users),
        unit: 'count',
        dimension_json: JSON.stringify({ path }),
        raw_json: JSON.stringify(row),
      }));
    }
  }

  for (const row of eventRows) {
    statements.push(buildMetricSnapshotUpsertStatement({
      metric_date: row.metricDate,
      source: 'rybbit',
      entity_type: 'content_item',
      entity_id_sql: contentIdForPathSql(path),
      external_entity_id: path,
      metric_name: row.metricName,
      metric_value: Number(row.metricValue),
      unit: 'count',
      dimension_json: JSON.stringify({ path }),
      raw_json: JSON.stringify(row),
    }));
  }

  return statements;
}

export function buildMetricSnapshotUpsertStatement(row) {
  const columns = [
    'metric_date',
    'source',
    'entity_type',
    'entity_id',
    'external_entity_id',
    'metric_name',
    'metric_value',
    'unit',
    'dimension_json',
    'raw_json',
  ];

  const values = [
    sqlLiteral(row.metric_date),
    sqlLiteral(row.source),
    sqlLiteral(row.entity_type),
    row.entity_id_sql || sqlLiteral(row.entity_id),
    sqlLiteral(row.external_entity_id),
    sqlLiteral(row.metric_name),
    sqlLiteral(row.metric_value),
    sqlLiteral(row.unit || 'count'),
    sqlLiteral(row.dimension_json || '{}'),
    sqlLiteral(row.raw_json || '{}'),
  ];

  return [
    `INSERT INTO growth_metric_snapshots (${columns.join(', ')})`,
    `VALUES (${values.join(', ')})`,
    'ON CONFLICT DO UPDATE SET',
    '  metric_value = excluded.metric_value,',
    '  unit = excluded.unit,',
    '  raw_json = excluded.raw_json,',
    '  collected_at = datetime(\'now\')',
  ].join('\n');
}

function contentIdForPathSql(path) {
  return `(SELECT content_item_id FROM growth_web_path_map WHERE path = ${sqlLiteral(path)})`;
}

function normalizeLanguage(language) {
  if (language === 'en' || language === 'zh') return language;
  return 'other';
}

function normalizeChannel(channel) {
  if (['blog', 'linkedin', 'youtube', 'x', 'newsletter', 'rss', 'other'].includes(channel)) return channel;
  throw new Error(`unsupported channel: ${channel || ''}`);
}

function normalizeLocale(language) {
  if (language === 'en' || language === 'zh') return language;
  return 'other';
}

function normalizeStatus(value) {
  if (value === true || value === 'true' || value === 'published') return 'published';
  if (['idea', 'draft', 'archived'].includes(value)) return value;
  return 'draft';
}

function parseCsv(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
