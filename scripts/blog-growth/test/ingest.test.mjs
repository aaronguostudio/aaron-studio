import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAiReviewInsertStatement,
  buildChannelPostUpsertStatements,
  buildContentEvaluation,
  buildContentEvaluationInsertStatement,
  buildContentIngestStatements,
  buildLessonUpsertStatements,
  buildLinkedInCsvImportPlan,
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

test('buildLinkedInCsvImportPlan registers missing LinkedIn posts before metrics', () => {
  const plan = buildLinkedInCsvImportPlan({
    inputRows: [
      {
        slug: 'one-person-project-ai-coding',
        channel_post_id: '7478437128545181697',
        channel_url: 'https://www.linkedin.com/feed/update/urn:li:share:7478437128545181697/',
        title: 'The One-Person Project',
        published_at: '2026-07-02',
        metric_date: '2026-07-02',
        impressions: '1,200',
        reactions: '12',
        comments: '3',
      },
      {
        slug: 'one-person-project-ai-coding',
        channel_post_id: '7478437128545181697',
        metric_date: '2026-07-03',
        impressions: '300',
        reactions: '4',
      },
    ],
    registeredPosts: [],
  });

  const sql = plan.statements.join('\n');
  assert.equal(plan.unmatchedRows.length, 0);
  assert.equal(plan.channelPostStatementCount, 1);
  assert.equal(plan.metricStatementCount, 5);
  assert.match(sql, /INSERT INTO growth_channel_posts/);
  assert.match(sql, /'linkedin'/);
  assert.match(sql, /'7478437128545181697'/);
  assert.match(sql, /SELECT id FROM growth_channel_posts/);
  assert.match(sql, /'linkedin_impressions'/);
  assert.match(sql, /1200/);
  assert.match(sql, /'linkedin_comments'/);
});

test('buildLinkedInCsvImportPlan accepts already registered LinkedIn posts', () => {
  const plan = buildLinkedInCsvImportPlan({
    inputRows: [
      {
        channel_post_id: 'existing-post',
        metric_date: '2026-07-02',
        impressions: '100',
        link_clicks: '5',
      },
    ],
    registeredPosts: [
      {
        id: 44,
        slug: 'ai-became-my-operating-system',
        channel_post_id: 'existing-post',
        channel_url: 'https://www.linkedin.com/feed/update/urn:li:share:existing-post/',
      },
    ],
  });

  const sql = plan.statements.join('\n');
  assert.equal(plan.unmatchedRows.length, 0);
  assert.equal(plan.channelPostStatementCount, 0);
  assert.equal(plan.metricStatementCount, 2);
  assert.doesNotMatch(sql, /INSERT INTO growth_channel_posts/);
  assert.match(sql, /44/);
  assert.match(sql, /'linkedin_link_clicks'/);
});

test('buildLinkedInCsvImportPlan reports rows missing a registered post identity', () => {
  const plan = buildLinkedInCsvImportPlan({
    inputRows: [
      {
        metric_date: '2026-07-02',
        impressions: '100',
      },
    ],
    registeredPosts: [],
  });

  assert.deepEqual(plan.unmatchedRows, [
    {
      row: 1,
      slug: null,
      channelPostId: null,
      channelUrl: null,
      reason: 'missing_channel_post_identity',
    },
  ]);
  assert.equal(plan.statementCount, 0);
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
    lessons: [
      {
        lesson_key: 'hook.concrete_bottleneck',
        lesson_type: 'keep',
        lesson_text: 'Open with a concrete operating bottleneck before naming the framework.',
        confidence: 'high',
        priority: 'high',
        evidence_json: JSON.stringify({ slugs: ['one-person-project-ai-coding'] }),
      },
    ],
    caveats: ['LinkedIn manual import missing'],
  });

  assert.equal(context.winning_patterns.includes('practical_ai_explainer'), true);
  assert.equal(context.recommended_actions[0], 'Write another concrete AI explainer');
  assert.equal(context.top_content[0].slug, 'chatgpt-explained-kitchen-metaphor');
  assert.equal(context.lessons[0].lesson_key, 'hook.concrete_bottleneck');
  assert.equal(context.next_experiment, 'Open with a concrete operating bottleneck before naming the framework.');
});

test('buildContentEvaluation creates a rubric-backed pre-publish evaluation', () => {
  const evaluation = buildContentEvaluation({
    slug: 'one-person-project-ai-coding',
    title: 'The One-Person Project',
    stage: 'prepublish',
    rubricVersion: 'blog-writing-v1',
    scores: {
      thesis: 5,
      evidence: 4,
      mechanism: 5,
      stakes: 5,
      nuance: 4,
      frame: 5,
      ending: 5,
      voice: 4,
      distribution: 4,
    },
    hypothesis: 'Owner-loop framing will resonate with builders managing AI coding workflows.',
    targetAudience: 'AI-native software builders and engineering leaders',
    successMetrics: ['scroll_75', 'scroll_100', 'linkedin_comments'],
    recommendations: ['Use a teaser that names the workflow collapse without over-indexing on QA.'],
  });

  assert.equal(evaluation.stage, 'prepublish');
  assert.equal(evaluation.rubric_version, 'blog-writing-v1');
  assert.equal(evaluation.overall_score, 91);
  assert.equal(evaluation.hypothesis.includes('Owner-loop'), true);
  assert.equal(evaluation.raw_context.success_metrics[0], 'scroll_75');
});

test('buildContentEvaluationInsertStatement writes evaluation JSON fields', () => {
  const sql = buildContentEvaluationInsertStatement({
    content_item_id_sql: "(SELECT id FROM growth_content_items WHERE slug = 'one-person-project-ai-coding')",
    stage: 'prepublish',
    rubric_version: 'blog-writing-v1',
    evaluator: 'codex',
    overall_score: 91,
    scores: { thesis: 5, evidence: 4 },
    summary: 'Strong owner-loop thesis with clear implementation pressure.',
    recommendations: ['Keep the concrete QA queue opening.'],
    raw_context: { hypothesis: 'Owner-loop framing will resonate.' },
  });

  assert.match(sql, /INSERT INTO growth_content_evaluations/);
  assert.match(sql, /'prepublish'/);
  assert.match(sql, /'blog-writing-v1'/);
  assert.match(sql, /ON CONFLICT\(content_item_id, stage, rubric_version\)/);
});

test('buildLessonUpsertStatements converts postmortem insights into reusable lessons', () => {
  const statements = buildLessonUpsertStatements({
    slug: 'one-person-project-ai-coding',
    review: {
      review_type: 'postmortem_7d',
      insights: [
        {
          type: 'content_pattern',
          label: 'deep_reader_signal',
          evidence: 'The article reached 12 deep-read events in 7d.',
          confidence: 'medium',
        },
      ],
      recommended_actions: [
        {
          action: 'Reuse the concrete bottleneck opening in the next AI-native systems post.',
          owner: 'blog-production',
          priority: 'high',
        },
      ],
    },
  });

  const sql = statements.join('\n');
  assert.equal(statements.length, 1);
  assert.match(sql, /INSERT INTO growth_lessons/);
  assert.match(sql, /'one-person-project-ai-coding:deep_reader_signal'/);
  assert.match(sql, /'keep'/);
  assert.match(sql, /ON CONFLICT\(lesson_key\) DO UPDATE SET/);
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
