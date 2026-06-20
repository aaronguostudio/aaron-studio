import { sqlLiteral } from './sql.mjs';
import { normalizeBlogDate } from './content.mjs';

const LINKEDIN_METRIC_MAP = {
  impressions: ['linkedin_impressions', 'count'],
  members_reached: ['linkedin_members_reached', 'count'],
  reactions: ['linkedin_reactions', 'count'],
  comments: ['linkedin_comments', 'count'],
  reshares: ['linkedin_reshares', 'count'],
  link_clicks: ['linkedin_link_clicks', 'count'],
  followers_gained: ['linkedin_followers_gained', 'count'],
};

export const DEFAULT_REWARD_WEIGHTS = {
  unique_visitors: 1.00,
  scroll_75: 2.00,
  scroll_100: 3.00,
  newsletter_subscribes: 25.00,
  outbound_clicks: 3.00,
  linkedin_impressions: 0.05,
  linkedin_members_reached: 0.10,
  linkedin_reactions: 1.50,
  linkedin_comments: 4.00,
  linkedin_reshares: 5.00,
  linkedin_link_clicks: 3.00,
  linkedin_followers_gained: 10.00,
  youtube_views: 0.40,
  youtube_watch_minutes: 0.02,
  youtube_subscribers_gained: 15.00,
  youtube_likes: 1.00,
  youtube_comments: 4.00,
};

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

export function buildLinkedInMetricStatements({ channelPostId, channelPostExternalId, row }) {
  if (!row?.metric_date) throw new Error('LinkedIn metric row metric_date is required');

  return Object.entries(LINKEDIN_METRIC_MAP)
    .filter(([sourceName]) => row[sourceName] !== undefined && row[sourceName] !== null && row[sourceName] !== '')
    .map(([sourceName, [metricName, unit]]) => buildMetricSnapshotUpsertStatement({
      metric_date: row.metric_date,
      source: 'linkedin',
      entity_type: 'channel_post',
      entity_id: Number(channelPostId),
      external_entity_id: channelPostExternalId,
      metric_name: metricName,
      metric_value: Number(String(row[sourceName]).replaceAll(',', '')),
      unit,
      dimension_json: JSON.stringify({ channelPostId: channelPostExternalId }),
      raw_json: JSON.stringify(row),
    }));
}

export function buildPostmortemReview({
  slug,
  title,
  window = '7d',
  periodStart,
  periodEnd,
  scorecard = {},
  channelMetrics = [],
  knownGaps = [],
  rewardVersion = 'v0.1',
}) {
  const score = Number(scorecard.qualified_engaged_audience_score || 0);
  const uniqueVisitors = Number(scorecard.unique_visitors || 0);
  const scroll75 = Number(scorecard.scroll_75 || 0);
  const scroll100 = Number(scorecard.scroll_100 || 0);
  const pageviews = Number(scorecard.pageviews || 0);
  const hasReaderSignal = uniqueVisitors > 0 || pageviews > 0 || score > 0;
  const reviewType = windowToReviewType(window);
  const insights = [];
  const recommendedActions = [];

  if (hasReaderSignal) {
    insights.push({
      type: 'content_pattern',
      label: scroll75 + scroll100 > 0 ? 'deep_reader_signal' : 'initial_reader_signal',
      evidence: `${title} reached ${uniqueVisitors} unique visitors and ${score} reward score in ${window}.`,
      confidence: score > 0 ? 'medium' : 'low',
    });
    recommendedActions.push({
      action: 'Reuse the strongest reader-facing angle in a future article brief.',
      owner: 'blog-production',
      priority: score >= 25 ? 'high' : 'medium',
    });
  } else {
    insights.push({
      type: 'measurement_gap',
      label: 'no_metrics_in_window',
      evidence: `No metrics were found for ${slug} between ${periodStart} and ${periodEnd}.`,
      confidence: 'low',
    });
    recommendedActions.push({
      action: 'Verify content, Rybbit path mapping, and channel post registration before judging performance.',
      owner: 'blog-growth',
      priority: 'high',
    });
  }

  if (knownGaps.length > 0 || channelMetrics.length === 0) {
    insights.push({
      type: 'distribution_gap',
      label: knownGaps[0] || 'channel_metrics_missing',
      evidence: 'Some distribution channel data is missing or not yet imported.',
      confidence: knownGaps.length > 0 ? 'high' : 'medium',
    });
    recommendedActions.push({
      action: 'Register channel posts and import missing LinkedIn or YouTube metrics before the next postmortem.',
      owner: 'blog-growth',
      priority: 'high',
    });
  }

  return {
    review_type: reviewType,
    period_start: periodStart,
    period_end: periodEnd,
    summary: `${title} ${window} postmortem: ${pageviews} pageviews, ${uniqueVisitors} unique visitors, ${scroll75 + scroll100} deep-read events, and ${score} reward score.`,
    insights,
    recommended_actions: recommendedActions,
    raw_context: {
      slug,
      reward_version: rewardVersion,
      metric_window: window,
      metric_date_start: periodStart,
      metric_date_end: periodEnd,
      sources: ['growth_content_daily_scorecard', 'growth_channel_metric_rollup'],
      known_gaps: knownGaps,
      scorecard,
      channel_metrics: channelMetrics,
    },
  };
}

export function buildAiReviewInsertStatement(review) {
  const columns = [
    'review_type',
    'period_start',
    'period_end',
    'content_item_id',
    'experiment_id',
    'summary',
    'insights_json',
    'recommended_actions_json',
    'raw_context_json',
  ];
  const values = [
    sqlLiteral(review.review_type),
    sqlLiteral(review.period_start),
    sqlLiteral(review.period_end),
    review.content_item_id_sql || sqlLiteral(review.content_item_id || null),
    review.experiment_id_sql || sqlLiteral(review.experiment_id || null),
    sqlLiteral(review.summary),
    sqlLiteral(JSON.stringify(review.insights || [])),
    sqlLiteral(JSON.stringify(review.recommended_actions || [])),
    sqlLiteral(JSON.stringify(review.raw_context || {})),
  ];

  return `INSERT INTO growth_ai_reviews (${columns.join(', ')})\nVALUES (${values.join(', ')})`;
}

export function buildNextBriefContext({ reviews = [], topContent = [], caveats = [] } = {}) {
  const insights = reviews.flatMap((review) => parseJsonArray(review.insights_json));
  const actions = reviews.flatMap((review) => parseJsonArray(review.recommended_actions_json));
  const winningPatterns = unique(insights
    .filter((insight) => insight.type === 'content_pattern' || insight.type === 'distribution_pattern')
    .map((insight) => insight.label)
    .filter(Boolean));
  const weakPatterns = unique(insights
    .filter((insight) => insight.type === 'weak_pattern' || insight.type === 'distribution_gap' || insight.type === 'measurement_gap')
    .map((insight) => insight.label)
    .filter(Boolean));
  const recommendedActions = unique(actions
    .map((action) => action.action)
    .filter(Boolean));

  return {
    winning_patterns: winningPatterns,
    weak_patterns: weakPatterns,
    recommended_actions: recommendedActions,
    top_content: topContent.map((item) => ({
      slug: item.slug,
      title: item.title,
      qualified_engaged_audience_score: Number(item.qualified_engaged_audience_score || 0),
    })),
    measurement_caveats: caveats,
    next_experiment: recommendedActions[0] || 'Publish one article with a clear hypothesis and measure the first seven days.',
  };
}

export function buildRewardVersionSeedStatement({
  version = 'v0.1',
  description = 'Initial qualified engaged audience score weights.',
  metricWeights = DEFAULT_REWARD_WEIGHTS,
  activeFrom = '2026-06-20',
  activeTo = null,
} = {}) {
  const columns = ['version', 'description', 'metric_weights_json', 'active_from', 'active_to'];
  const values = [
    sqlLiteral(version),
    sqlLiteral(description),
    sqlLiteral(JSON.stringify(metricWeights)),
    sqlLiteral(activeFrom),
    sqlLiteral(activeTo),
  ];

  return [
    `INSERT INTO growth_reward_versions (${columns.join(', ')})`,
    `VALUES (${values.join(', ')})`,
    'ON CONFLICT(version) DO UPDATE SET',
    '  description = excluded.description,',
    '  metric_weights_json = excluded.metric_weights_json,',
    '  active_from = excluded.active_from,',
    '  active_to = excluded.active_to',
  ].join('\n');
}

export function windowToReviewType(window) {
  if (window === '24h') return 'postmortem_24h';
  if (window === '7d') return 'postmortem_7d';
  if (window === '30d') return 'postmortem_30d';
  throw new Error(`unsupported postmortem window: ${window || ''}`);
}

export function metricWindowFromPublishedAt(publishedAt, window = '7d') {
  if (!publishedAt) throw new Error('published_at is required for postmortem window');
  windowToReviewType(window);

  const days = window === '24h' ? 1 : Number(window.replace('d', ''));
  const start = new Date(`${publishedAt}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime())) throw new Error(`published_at is not an ISO date: ${publishedAt}`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + days);

  return {
    periodStart: start.toISOString().slice(0, 10),
    periodEnd: end.toISOString().slice(0, 10),
  };
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

function parseJsonArray(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function unique(values) {
  return [...new Set(values)];
}
