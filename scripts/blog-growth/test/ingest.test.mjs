import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAiReviewInsertStatement,
  buildChannelPostUpsertStatements,
  buildContentIngestStatements,
  buildLinkedInMetricStatements,
  buildMetricSnapshotUpsertStatement,
  buildNextBriefContext,
  buildPostmortemReview,
  buildRybbitPathMetricStatements,
  buildRewardVersionSeedStatement,
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

test('buildChannelPostUpsertStatements upserts registered distribution posts', () => {
  const statements = buildChannelPostUpsertStatements({
    slug: 'fable-5-managing-ai-autonomy',
    posts: [
      {
        channel: 'youtube',
        channel_post_id: 'jPHR-73HJa8',
        channel_url: 'https://www.youtube.com/watch?v=jPHR-73HJa8',
        title: 'Fable 5 Changed the Unit of AI Work',
        language: 'en',
        post_type: 'video',
        cta_type: 'blog_click',
        published_at: '2026-06-15',
      },
    ],
  });

  assert.equal(statements.length, 1);
  assert.match(statements[0], /INSERT INTO growth_channel_posts/);
  assert.match(statements[0], /SELECT id FROM growth_content_items WHERE slug = 'fable-5-managing-ai-autonomy'/);
  assert.match(statements[0], /'youtube'/);
  assert.match(statements[0], /'jPHR-73HJa8'/);
  assert.match(statements[0], /ON CONFLICT\(channel, channel_post_id\)/);
  assert.match(statements[0], /WHERE channel_post_id IS NOT NULL/);
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

test('buildLinkedInMetricStatements maps CSV row values to canonical metrics', () => {
  const statements = buildLinkedInMetricStatements({
    channelPostId: 22,
    channelPostExternalId: 'urn:li:share:123',
    row: {
      metric_date: '2026-06-15',
      impressions: '100',
      members_reached: '80',
      reactions: '5',
      comments: '',
      reshares: '1',
      link_clicks: '3',
      followers_gained: '0',
    },
  });

  const sql = statements.join('\n');
  assert.match(sql, /'linkedin_impressions'/);
  assert.match(sql, /'linkedin_members_reached'/);
  assert.match(sql, /'linkedin_reactions'/);
  assert.doesNotMatch(sql, /'linkedin_comments'/);
  assert.match(sql, /'linkedin_reshares'/);
  assert.match(sql, /'linkedin_link_clicks'/);
  assert.match(sql, /'linkedin_followers_gained'/);
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

test('buildPostmortemReview creates compact review from metrics', () => {
  const review = buildPostmortemReview({
    slug: 'fable-5-managing-ai-autonomy',
    title: 'Fable 5 Changed the Unit of AI Work',
    window: '7d',
    periodStart: '2026-06-15',
    periodEnd: '2026-06-22',
    scorecard: {
      pageviews: 16,
      unique_visitors: 9,
      scroll_75: 4,
      scroll_100: 4,
      qualified_engaged_audience_score: 29,
    },
    channelMetrics: [],
    knownGaps: ['linkedin_manual_import_missing'],
    rewardVersion: 'v0.1',
  });

  assert.match(review.summary, /Fable 5 Changed the Unit of AI Work/);
  assert.equal(review.review_type, 'postmortem_7d');
  assert.equal(review.raw_context.reward_version, 'v0.1');
  assert.equal(review.insights.some((item) => item.type === 'content_pattern'), true);
  assert.equal(review.recommended_actions.some((item) => item.owner === 'blog-growth'), true);
});

test('buildAiReviewInsertStatement writes postmortem JSON fields', () => {
  const sql = buildAiReviewInsertStatement({
    review_type: 'postmortem_7d',
    period_start: '2026-06-15',
    period_end: '2026-06-22',
    content_item_id_sql: "(SELECT id FROM growth_content_items WHERE slug = 'fable-5-managing-ai-autonomy')",
    summary: 'Review summary',
    insights: [{ type: 'content_pattern' }],
    recommended_actions: [{ action: 'Repeat pattern' }],
    raw_context: { reward_version: 'v0.1' },
  });

  assert.match(sql, /INSERT INTO growth_ai_reviews/);
  assert.match(sql, /'postmortem_7d'/);
  assert.match(sql, /'Review summary'/);
});

test('buildNextBriefContext summarizes recent reviews and top content', () => {
  const context = buildNextBriefContext({
    reviews: [
      {
        review_type: 'postmortem_7d',
        summary: 'Practical AI explainers performed best.',
        insights_json: JSON.stringify([{ type: 'content_pattern', label: 'practical_ai_explainer' }]),
        recommended_actions_json: JSON.stringify([{ action: 'Write another concrete AI explainer', priority: 'high' }]),
      },
    ],
    topContent: [
      {
        slug: 'chatgpt-explained-kitchen-metaphor',
        title: 'No Magic: How ChatGPT Actually Works, Explained in One Kitchen',
        qualified_engaged_audience_score: 69,
      },
    ],
    caveats: ['LinkedIn manual import missing'],
  });

  assert.equal(context.winning_patterns.includes('practical_ai_explainer'), true);
  assert.equal(context.recommended_actions[0], 'Write another concrete AI explainer');
  assert.equal(context.top_content[0].slug, 'chatgpt-explained-kitchen-metaphor');
});

test('buildRewardVersionSeedStatement upserts reward weight versions', () => {
  const sql = buildRewardVersionSeedStatement({
    version: 'v0.1',
    metricWeights: {
      unique_visitors: 1,
      scroll_100: 3,
    },
    activeFrom: '2026-06-20',
  });

  assert.match(sql, /INSERT INTO growth_reward_versions/);
  assert.match(sql, /'v0.1'/);
  assert.match(sql, /unique_visitors/);
  assert.match(sql, /ON CONFLICT\(version\) DO UPDATE SET/);
});
