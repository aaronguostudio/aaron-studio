-- Blog Growth Analytics schema for Aaron Studio.
-- Target: SQLite / Turso libSQL.
-- Purpose: connect blog posts, distribution posts, channel metrics, experiments,
-- and AI review outputs into one content-learning loop.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS growth_content_items (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  canonical_url TEXT,
  source_path TEXT,
  title TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  content_kind TEXT NOT NULL DEFAULT 'blog',
  content_pillar TEXT,
  primary_topic TEXT,
  secondary_topics_json TEXT NOT NULL DEFAULT '[]',
  thesis TEXT,
  hook_type TEXT,
  format_type TEXT,
  cta_type TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT,
  word_count INTEGER,
  reading_minutes INTEGER,
  production_minutes INTEGER,
  raw_metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK (language IN ('en', 'zh', 'bilingual', 'other')),
  CHECK (content_kind IN ('blog', 'video', 'newsletter', 'social', 'other')),
  CHECK (status IN ('idea', 'draft', 'published', 'archived'))
);

CREATE INDEX IF NOT EXISTS idx_growth_content_items_published_at
  ON growth_content_items(published_at);

CREATE INDEX IF NOT EXISTS idx_growth_content_items_topic
  ON growth_content_items(content_pillar, primary_topic);

CREATE TABLE IF NOT EXISTS growth_channel_posts (
  id INTEGER PRIMARY KEY,
  content_item_id INTEGER NOT NULL,
  channel TEXT NOT NULL,
  channel_post_id TEXT,
  channel_url TEXT,
  title TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  post_type TEXT,
  hook_text TEXT,
  cta_type TEXT,
  published_at TEXT,
  raw_metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (content_item_id) REFERENCES growth_content_items(id) ON DELETE CASCADE,
  CHECK (channel IN ('blog', 'linkedin', 'youtube', 'x', 'newsletter', 'rss', 'other')),
  CHECK (language IN ('en', 'zh', 'bilingual', 'other'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_growth_channel_posts_external_id
  ON growth_channel_posts(channel, channel_post_id)
  WHERE channel_post_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_growth_channel_posts_content
  ON growth_channel_posts(content_item_id, channel, published_at);

CREATE UNIQUE INDEX IF NOT EXISTS idx_growth_channel_posts_content_url
  ON growth_channel_posts(content_item_id, channel, channel_url)
  WHERE channel_post_id IS NULL AND channel_url IS NOT NULL;

CREATE TABLE IF NOT EXISTS growth_metric_catalog (
  metric_name TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  metric_group TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'count',
  direction TEXT NOT NULL DEFAULT 'up',
  reward_weight REAL NOT NULL DEFAULT 0,
  definition TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK (direction IN ('up', 'down', 'neutral'))
);

CREATE TABLE IF NOT EXISTS growth_metric_snapshots (
  id INTEGER PRIMARY KEY,
  metric_date TEXT NOT NULL,
  source TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id INTEGER,
  external_entity_id TEXT,
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL,
  unit TEXT NOT NULL DEFAULT 'count',
  dimension_json TEXT NOT NULL DEFAULT '{}',
  collected_at TEXT NOT NULL DEFAULT (datetime('now')),
  raw_json TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY (metric_name) REFERENCES growth_metric_catalog(metric_name),
  CHECK (entity_type IN ('site', 'content_item', 'channel_post', 'experiment', 'account'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_growth_metric_snapshots_unique
  ON growth_metric_snapshots(
    metric_date,
    source,
    entity_type,
    COALESCE(entity_id, -1),
    COALESCE(external_entity_id, ''),
    metric_name,
    dimension_json
  );

CREATE INDEX IF NOT EXISTS idx_growth_metric_snapshots_lookup
  ON growth_metric_snapshots(entity_type, entity_id, metric_date, metric_name);

CREATE INDEX IF NOT EXISTS idx_growth_metric_snapshots_source_date
  ON growth_metric_snapshots(source, metric_date);

CREATE TABLE IF NOT EXISTS growth_web_path_map (
  path TEXT PRIMARY KEY,
  content_item_id INTEGER NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (content_item_id) REFERENCES growth_content_items(id) ON DELETE CASCADE,
  CHECK (locale IN ('en', 'zh', 'other'))
);

CREATE TABLE IF NOT EXISTS growth_experiments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  hypothesis TEXT NOT NULL,
  area TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned',
  start_date TEXT,
  end_date TEXT,
  primary_metric_name TEXT,
  guardrail_metric_name TEXT,
  expected_lift_pct REAL,
  decision_rule TEXT,
  result_summary TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (primary_metric_name) REFERENCES growth_metric_catalog(metric_name),
  FOREIGN KEY (guardrail_metric_name) REFERENCES growth_metric_catalog(metric_name),
  CHECK (area IN ('topic', 'hook', 'title', 'visual', 'video', 'cta', 'distribution', 'cadence', 'other')),
  CHECK (status IN ('planned', 'running', 'won', 'lost', 'inconclusive', 'abandoned'))
);

CREATE TABLE IF NOT EXISTS growth_experiment_assignments (
  id INTEGER PRIMARY KEY,
  experiment_id INTEGER NOT NULL,
  content_item_id INTEGER,
  channel_post_id INTEGER,
  variant TEXT NOT NULL DEFAULT 'control',
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (experiment_id) REFERENCES growth_experiments(id) ON DELETE CASCADE,
  FOREIGN KEY (content_item_id) REFERENCES growth_content_items(id) ON DELETE CASCADE,
  FOREIGN KEY (channel_post_id) REFERENCES growth_channel_posts(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_growth_experiment_assignments_unique
  ON growth_experiment_assignments(
    experiment_id,
    COALESCE(content_item_id, -1),
    COALESCE(channel_post_id, -1),
    variant
  );

CREATE TABLE IF NOT EXISTS growth_ai_reviews (
  id INTEGER PRIMARY KEY,
  review_type TEXT NOT NULL,
  period_start TEXT,
  period_end TEXT,
  content_item_id INTEGER,
  experiment_id INTEGER,
  summary TEXT NOT NULL,
  insights_json TEXT NOT NULL DEFAULT '[]',
  recommended_actions_json TEXT NOT NULL DEFAULT '[]',
  raw_context_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (content_item_id) REFERENCES growth_content_items(id) ON DELETE SET NULL,
  FOREIGN KEY (experiment_id) REFERENCES growth_experiments(id) ON DELETE SET NULL,
  CHECK (review_type IN ('postmortem_24h', 'postmortem_7d', 'postmortem_30d', 'weekly_review', 'monthly_strategy', 'experiment_review'))
);

CREATE TABLE IF NOT EXISTS growth_kpi_targets (
  id INTEGER PRIMARY KEY,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  target_value REAL NOT NULL,
  target_type TEXT NOT NULL DEFAULT 'minimum',
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (metric_name) REFERENCES growth_metric_catalog(metric_name),
  CHECK (target_type IN ('minimum', 'maximum', 'range_midpoint'))
);

CREATE TABLE IF NOT EXISTS growth_ingest_runs (
  id INTEGER PRIMARY KEY,
  source TEXT NOT NULL,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT,
  status TEXT NOT NULL DEFAULT 'running',
  rows_read INTEGER NOT NULL DEFAULT 0,
  rows_written INTEGER NOT NULL DEFAULT 0,
  cursor_json TEXT NOT NULL DEFAULT '{}',
  warning_json TEXT NOT NULL DEFAULT '[]',
  error_message TEXT,
  CHECK (source IN ('content_repo', 'rybbit', 'linkedin', 'youtube', 'beehiiv', 'manual', 'other')),
  CHECK (status IN ('running', 'success', 'partial', 'failed'))
);

INSERT INTO growth_metric_catalog
  (metric_name, source, metric_group, unit, direction, reward_weight, definition)
VALUES
  ('pageviews', 'rybbit', 'reach', 'count', 'up', 0.20, 'Blog page views for a content URL or path.'),
  ('unique_visitors', 'rybbit', 'reach', 'count', 'up', 1.00, 'Unique visitors for a content URL or path.'),
  ('scroll_75', 'rybbit', 'engagement', 'count', 'up', 2.00, 'Rybbit custom event fired when a reader reaches 75% scroll depth.'),
  ('scroll_100', 'rybbit', 'engagement', 'count', 'up', 3.00, 'Rybbit custom event fired when a reader reaches 100% scroll depth.'),
  ('newsletter_subscribes', 'rybbit', 'owned_audience', 'count', 'up', 25.00, 'Successful newsletter subscriptions attributed to a page, CTA, or session where available.'),
  ('outbound_clicks', 'rybbit', 'activation', 'count', 'up', 3.00, 'Outbound clicks from the blog to external channels.'),
  ('linkedin_impressions', 'linkedin', 'social_reach', 'count', 'up', 0.05, 'LinkedIn post impressions.'),
  ('linkedin_members_reached', 'linkedin', 'social_reach', 'count', 'up', 0.10, 'LinkedIn unique members reached when available.'),
  ('linkedin_reactions', 'linkedin', 'social_engagement', 'count', 'up', 1.50, 'LinkedIn post reactions.'),
  ('linkedin_comments', 'linkedin', 'social_engagement', 'count', 'up', 4.00, 'LinkedIn post comments.'),
  ('linkedin_reshares', 'linkedin', 'social_engagement', 'count', 'up', 5.00, 'LinkedIn post reshares or reposts.'),
  ('linkedin_link_clicks', 'linkedin', 'social_activation', 'count', 'up', 3.00, 'LinkedIn link clicks when available.'),
  ('linkedin_followers_gained', 'linkedin', 'owned_audience', 'count', 'up', 10.00, 'LinkedIn followers gained from content when available.'),
  ('youtube_views', 'youtube', 'video_reach', 'count', 'up', 0.40, 'YouTube video views.'),
  ('youtube_impressions', 'youtube', 'video_reach', 'count', 'up', 0.02, 'YouTube thumbnail impressions.'),
  ('youtube_impressions_ctr', 'youtube', 'video_quality', 'ratio', 'up', 10.00, 'YouTube impressions click-through rate as a decimal, e.g. 0.05.'),
  ('youtube_watch_minutes', 'youtube', 'video_engagement', 'minutes', 'up', 0.02, 'Estimated minutes watched.'),
  ('youtube_average_view_duration_seconds', 'youtube', 'video_quality', 'seconds', 'up', 0.05, 'Average view duration in seconds.'),
  ('youtube_subscribers_gained', 'youtube', 'owned_audience', 'count', 'up', 15.00, 'Subscribers gained from a YouTube video.'),
  ('youtube_likes', 'youtube', 'video_engagement', 'count', 'up', 1.00, 'YouTube likes.'),
  ('youtube_comments', 'youtube', 'video_engagement', 'count', 'up', 4.00, 'YouTube comments.')
ON CONFLICT(metric_name) DO UPDATE SET
  source = excluded.source,
  metric_group = excluded.metric_group,
  unit = excluded.unit,
  direction = excluded.direction,
  reward_weight = excluded.reward_weight,
  definition = excluded.definition;

DROP VIEW IF EXISTS growth_channel_metric_rollup;
CREATE VIEW growth_channel_metric_rollup AS
SELECT
  cp.id AS channel_post_id,
  cp.content_item_id,
  cp.channel,
  ms.metric_date,
  SUM(CASE WHEN ms.metric_name = 'linkedin_impressions' THEN ms.metric_value ELSE 0 END) AS linkedin_impressions,
  SUM(CASE WHEN ms.metric_name = 'linkedin_members_reached' THEN ms.metric_value ELSE 0 END) AS linkedin_members_reached,
  SUM(CASE WHEN ms.metric_name = 'linkedin_reactions' THEN ms.metric_value ELSE 0 END) AS linkedin_reactions,
  SUM(CASE WHEN ms.metric_name = 'linkedin_comments' THEN ms.metric_value ELSE 0 END) AS linkedin_comments,
  SUM(CASE WHEN ms.metric_name = 'linkedin_reshares' THEN ms.metric_value ELSE 0 END) AS linkedin_reshares,
  SUM(CASE WHEN ms.metric_name = 'linkedin_link_clicks' THEN ms.metric_value ELSE 0 END) AS linkedin_link_clicks,
  SUM(CASE WHEN ms.metric_name = 'linkedin_followers_gained' THEN ms.metric_value ELSE 0 END) AS linkedin_followers_gained,
  SUM(CASE WHEN ms.metric_name = 'youtube_views' THEN ms.metric_value ELSE 0 END) AS youtube_views,
  SUM(CASE WHEN ms.metric_name = 'youtube_impressions' THEN ms.metric_value ELSE 0 END) AS youtube_impressions,
  SUM(CASE WHEN ms.metric_name = 'youtube_impressions_ctr' THEN ms.metric_value ELSE 0 END) AS youtube_impressions_ctr,
  SUM(CASE WHEN ms.metric_name = 'youtube_watch_minutes' THEN ms.metric_value ELSE 0 END) AS youtube_watch_minutes,
  SUM(CASE WHEN ms.metric_name = 'youtube_average_view_duration_seconds' THEN ms.metric_value ELSE 0 END) AS youtube_average_view_duration_seconds,
  SUM(CASE WHEN ms.metric_name = 'youtube_subscribers_gained' THEN ms.metric_value ELSE 0 END) AS youtube_subscribers_gained,
  SUM(CASE WHEN ms.metric_name = 'youtube_likes' THEN ms.metric_value ELSE 0 END) AS youtube_likes,
  SUM(CASE WHEN ms.metric_name = 'youtube_comments' THEN ms.metric_value ELSE 0 END) AS youtube_comments
FROM growth_channel_posts cp
JOIN growth_metric_snapshots ms
  ON ms.entity_type = 'channel_post'
 AND ms.entity_id = cp.id
GROUP BY cp.id, cp.content_item_id, cp.channel, ms.metric_date;

DROP VIEW IF EXISTS growth_content_metric_rollup;
CREATE VIEW growth_content_metric_rollup AS
SELECT
  ci.id AS content_item_id,
  ci.slug,
  ci.title,
  ci.language,
  ci.content_pillar,
  ci.primary_topic,
  ci.published_at,
  ms.metric_date,
  SUM(CASE WHEN ms.metric_name = 'pageviews' THEN ms.metric_value ELSE 0 END) AS pageviews,
  SUM(CASE WHEN ms.metric_name = 'unique_visitors' THEN ms.metric_value ELSE 0 END) AS unique_visitors,
  SUM(CASE WHEN ms.metric_name = 'scroll_75' THEN ms.metric_value ELSE 0 END) AS scroll_75,
  SUM(CASE WHEN ms.metric_name = 'scroll_100' THEN ms.metric_value ELSE 0 END) AS scroll_100,
  SUM(CASE WHEN ms.metric_name = 'newsletter_subscribes' THEN ms.metric_value ELSE 0 END) AS newsletter_subscribes,
  SUM(CASE WHEN ms.metric_name = 'outbound_clicks' THEN ms.metric_value ELSE 0 END) AS outbound_clicks
FROM growth_content_items ci
JOIN growth_metric_snapshots ms
  ON ms.entity_type = 'content_item'
 AND ms.entity_id = ci.id
GROUP BY
  ci.id,
  ci.slug,
  ci.title,
  ci.language,
  ci.content_pillar,
  ci.primary_topic,
  ci.published_at,
  ms.metric_date;

DROP VIEW IF EXISTS growth_content_daily_scorecard;
CREATE VIEW growth_content_daily_scorecard AS
WITH dates AS (
  SELECT content_item_id, metric_date FROM growth_content_metric_rollup
  UNION
  SELECT content_item_id, metric_date FROM growth_channel_metric_rollup
),
daily AS (
  SELECT
    d.content_item_id,
    d.metric_date,
    ci.slug,
    ci.title,
    ci.language,
    ci.content_pillar,
    ci.primary_topic,
    ci.published_at,
    COALESCE(cm.pageviews, 0) AS pageviews,
    COALESCE(cm.unique_visitors, 0) AS unique_visitors,
    COALESCE(cm.scroll_75, 0) AS scroll_75,
    COALESCE(cm.scroll_100, 0) AS scroll_100,
    COALESCE(cm.newsletter_subscribes, 0) AS newsletter_subscribes,
    COALESCE(cm.outbound_clicks, 0) AS outbound_clicks,
    COALESCE(SUM(ch.linkedin_impressions), 0) AS linkedin_impressions,
    COALESCE(SUM(ch.linkedin_members_reached), 0) AS linkedin_members_reached,
    COALESCE(SUM(ch.linkedin_reactions), 0) AS linkedin_reactions,
    COALESCE(SUM(ch.linkedin_comments), 0) AS linkedin_comments,
    COALESCE(SUM(ch.linkedin_reshares), 0) AS linkedin_reshares,
    COALESCE(SUM(ch.linkedin_link_clicks), 0) AS linkedin_link_clicks,
    COALESCE(SUM(ch.linkedin_followers_gained), 0) AS linkedin_followers_gained,
    COALESCE(SUM(ch.youtube_views), 0) AS youtube_views,
    COALESCE(SUM(ch.youtube_impressions), 0) AS youtube_impressions,
    COALESCE(SUM(ch.youtube_watch_minutes), 0) AS youtube_watch_minutes,
    COALESCE(SUM(ch.youtube_subscribers_gained), 0) AS youtube_subscribers_gained,
    COALESCE(SUM(ch.youtube_likes), 0) AS youtube_likes,
    COALESCE(SUM(ch.youtube_comments), 0) AS youtube_comments
  FROM dates d
  JOIN growth_content_items ci
    ON ci.id = d.content_item_id
  LEFT JOIN growth_content_metric_rollup cm
    ON cm.content_item_id = d.content_item_id
   AND cm.metric_date = d.metric_date
  LEFT JOIN growth_channel_metric_rollup ch
    ON ch.content_item_id = d.content_item_id
   AND ch.metric_date = d.metric_date
  GROUP BY
    d.content_item_id,
    d.metric_date,
    ci.slug,
    ci.title,
    ci.language,
    ci.content_pillar,
    ci.primary_topic,
    ci.published_at,
    cm.pageviews,
    cm.unique_visitors,
    cm.scroll_75,
    cm.scroll_100,
    cm.newsletter_subscribes,
    cm.outbound_clicks
)
SELECT
  *,
  (
    unique_visitors * 1.00 +
    scroll_75 * 2.00 +
    scroll_100 * 3.00 +
    newsletter_subscribes * 25.00 +
    outbound_clicks * 3.00 +
    linkedin_impressions * 0.05 +
    linkedin_members_reached * 0.10 +
    linkedin_reactions * 1.50 +
    linkedin_comments * 4.00 +
    linkedin_reshares * 5.00 +
    linkedin_link_clicks * 3.00 +
    linkedin_followers_gained * 10.00 +
    youtube_views * 0.40 +
    youtube_watch_minutes * 0.02 +
    youtube_subscribers_gained * 15.00 +
    youtube_likes * 1.00 +
    youtube_comments * 4.00
  ) AS qualified_engaged_audience_score
FROM daily;

DROP VIEW IF EXISTS growth_content_lifetime_scorecard;
CREATE VIEW growth_content_lifetime_scorecard AS
SELECT
  content_item_id,
  slug,
  title,
  language,
  content_pillar,
  primary_topic,
  published_at,
  COUNT(DISTINCT metric_date) AS metric_days,
  SUM(pageviews) AS pageviews,
  SUM(unique_visitors) AS unique_visitors,
  SUM(scroll_75) AS scroll_75,
  SUM(scroll_100) AS scroll_100,
  SUM(newsletter_subscribes) AS newsletter_subscribes,
  SUM(outbound_clicks) AS outbound_clicks,
  SUM(linkedin_impressions) AS linkedin_impressions,
  SUM(linkedin_members_reached) AS linkedin_members_reached,
  SUM(linkedin_reactions) AS linkedin_reactions,
  SUM(linkedin_comments) AS linkedin_comments,
  SUM(linkedin_reshares) AS linkedin_reshares,
  SUM(linkedin_link_clicks) AS linkedin_link_clicks,
  SUM(linkedin_followers_gained) AS linkedin_followers_gained,
  SUM(youtube_views) AS youtube_views,
  SUM(youtube_impressions) AS youtube_impressions,
  SUM(youtube_watch_minutes) AS youtube_watch_minutes,
  SUM(youtube_subscribers_gained) AS youtube_subscribers_gained,
  SUM(youtube_likes) AS youtube_likes,
  SUM(youtube_comments) AS youtube_comments,
  SUM(qualified_engaged_audience_score) AS qualified_engaged_audience_score
FROM growth_content_daily_scorecard
GROUP BY
  content_item_id,
  slug,
  title,
  language,
  content_pillar,
  primary_topic,
  published_at;

DROP VIEW IF EXISTS growth_content_7d_postmortem;
CREATE VIEW growth_content_7d_postmortem AS
SELECT
  ds.content_item_id,
  ds.slug,
  ds.title,
  ds.language,
  ds.content_pillar,
  ds.primary_topic,
  ds.published_at,
  SUM(ds.pageviews) AS pageviews_7d,
  SUM(ds.unique_visitors) AS unique_visitors_7d,
  SUM(ds.scroll_75) AS scroll_75_7d,
  SUM(ds.scroll_100) AS scroll_100_7d,
  SUM(ds.newsletter_subscribes) AS newsletter_subscribes_7d,
  SUM(ds.linkedin_impressions) AS linkedin_impressions_7d,
  SUM(ds.linkedin_reactions + ds.linkedin_comments + ds.linkedin_reshares) AS linkedin_engagements_7d,
  SUM(ds.linkedin_link_clicks) AS linkedin_link_clicks_7d,
  SUM(ds.youtube_views) AS youtube_views_7d,
  SUM(ds.youtube_watch_minutes) AS youtube_watch_minutes_7d,
  SUM(ds.youtube_subscribers_gained) AS youtube_subscribers_gained_7d,
  SUM(ds.qualified_engaged_audience_score) AS qualified_engaged_audience_score_7d
FROM growth_content_daily_scorecard ds
WHERE ds.published_at IS NOT NULL
  AND date(ds.metric_date) >= date(ds.published_at)
  AND date(ds.metric_date) < date(ds.published_at, '+8 days')
GROUP BY
  ds.content_item_id,
  ds.slug,
  ds.title,
  ds.language,
  ds.content_pillar,
  ds.primary_topic,
  ds.published_at;

DROP VIEW IF EXISTS growth_weekly_scorecard;
CREATE VIEW growth_weekly_scorecard AS
SELECT
  strftime('%Y-W%W', metric_date) AS week_key,
  date(metric_date, 'weekday 0', '-6 days') AS week_start,
  date(metric_date, 'weekday 0') AS week_end,
  COUNT(DISTINCT content_item_id) AS content_items_with_metrics,
  SUM(pageviews) AS pageviews,
  SUM(unique_visitors) AS unique_visitors,
  SUM(scroll_75) AS scroll_75,
  SUM(scroll_100) AS scroll_100,
  SUM(newsletter_subscribes) AS newsletter_subscribes,
  SUM(linkedin_impressions) AS linkedin_impressions,
  SUM(linkedin_reactions + linkedin_comments + linkedin_reshares) AS linkedin_engagements,
  SUM(linkedin_link_clicks) AS linkedin_link_clicks,
  SUM(youtube_views) AS youtube_views,
  SUM(youtube_watch_minutes) AS youtube_watch_minutes,
  SUM(youtube_subscribers_gained) AS youtube_subscribers_gained,
  SUM(qualified_engaged_audience_score) AS qualified_engaged_audience_score
FROM growth_content_daily_scorecard
GROUP BY strftime('%Y-W%W', metric_date), date(metric_date, 'weekday 0', '-6 days'), date(metric_date, 'weekday 0');

DROP VIEW IF EXISTS growth_topic_scorecard;
CREATE VIEW growth_topic_scorecard AS
SELECT
  COALESCE(content_pillar, 'uncategorized') AS content_pillar,
  COALESCE(primary_topic, 'uncategorized') AS primary_topic,
  COUNT(DISTINCT content_item_id) AS content_count,
  SUM(pageviews) AS pageviews,
  SUM(unique_visitors) AS unique_visitors,
  SUM(newsletter_subscribes) AS newsletter_subscribes,
  SUM(linkedin_impressions) AS linkedin_impressions,
  SUM(youtube_views) AS youtube_views,
  SUM(qualified_engaged_audience_score) AS qualified_engaged_audience_score,
  AVG(qualified_engaged_audience_score) AS avg_score_per_content
FROM growth_content_lifetime_scorecard
GROUP BY COALESCE(content_pillar, 'uncategorized'), COALESCE(primary_topic, 'uncategorized');
