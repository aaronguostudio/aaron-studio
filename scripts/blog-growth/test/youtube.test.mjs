import test from 'node:test';
import assert from 'node:assert/strict';
import { buildYoutubeAnalyticsUrl, normalizeYoutubeAnalyticsRows } from '../lib/youtube.mjs';

test('buildYoutubeAnalyticsUrl creates day and video query', () => {
  const url = buildYoutubeAnalyticsUrl({
    start: '2026-06-15',
    end: '2026-06-22',
    videoId: 'jPHR-73HJa8',
  });

  assert.equal(url.origin, 'https://youtubeanalytics.googleapis.com');
  assert.equal(url.searchParams.get('ids'), 'channel==MINE');
  assert.equal(url.searchParams.get('filters'), 'video==jPHR-73HJa8');
  assert.equal(url.searchParams.get('dimensions'), 'day,video');
});

test('normalizeYoutubeAnalyticsRows maps API rows to canonical metric rows', () => {
  const rows = normalizeYoutubeAnalyticsRows({
    channelPostId: 12,
    videoId: 'jPHR-73HJa8',
    report: {
      columnHeaders: [
        { name: 'day' },
        { name: 'video' },
        { name: 'views' },
        { name: 'estimatedMinutesWatched' },
        { name: 'averageViewDuration' },
        { name: 'subscribersGained' },
        { name: 'likes' },
        { name: 'comments' },
      ],
      rows: [['2026-06-15', 'jPHR-73HJa8', 5, 2, 24, 1, 1, 0]],
    },
  });

  assert.deepEqual(rows.map((row) => row.metric_name), [
    'youtube_views',
    'youtube_watch_minutes',
    'youtube_average_view_duration_seconds',
    'youtube_subscribers_gained',
    'youtube_likes',
    'youtube_comments',
  ]);
  assert.equal(rows[0].entity_type, 'channel_post');
  assert.equal(rows[0].entity_id, 12);
});
