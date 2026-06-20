const YOUTUBE_METRIC_MAP = {
  views: ['youtube_views', 'count'],
  estimatedMinutesWatched: ['youtube_watch_minutes', 'minutes'],
  averageViewDuration: ['youtube_average_view_duration_seconds', 'seconds'],
  subscribersGained: ['youtube_subscribers_gained', 'count'],
  likes: ['youtube_likes', 'count'],
  comments: ['youtube_comments', 'count'],
};

export function buildYoutubeAnalyticsUrl({ start, end, videoId }) {
  const url = new URL('https://youtubeanalytics.googleapis.com/v2/reports');
  url.search = new URLSearchParams({
    ids: 'channel==MINE',
    startDate: start,
    endDate: end,
    metrics: Object.keys(YOUTUBE_METRIC_MAP).join(','),
    dimensions: 'day,video',
    filters: `video==${videoId}`,
    sort: 'day',
  }).toString();
  return url;
}

export function normalizeYoutubeAnalyticsRows({ channelPostId, videoId, report }) {
  const columns = (report?.columnHeaders || []).map((column) => column.name);
  const rows = Array.isArray(report?.rows) ? report.rows : [];
  const metricRows = [];

  for (const row of rows) {
    const values = Object.fromEntries(row.map((value, index) => [columns[index], value]));
    const metricDate = values.day;
    if (!metricDate) continue;

    for (const [sourceName, [metricName, unit]] of Object.entries(YOUTUBE_METRIC_MAP)) {
      if (values[sourceName] === undefined || values[sourceName] === null || values[sourceName] === '') continue;
      metricRows.push({
        metric_date: metricDate,
        source: 'youtube',
        entity_type: 'channel_post',
        entity_id: Number(channelPostId),
        external_entity_id: videoId,
        metric_name: metricName,
        metric_value: Number(values[sourceName]),
        unit,
        dimension_json: JSON.stringify({ videoId }),
        raw_json: JSON.stringify(values),
      });
    }
  }

  return metricRows;
}

export async function fetchYoutubeJson({ accessToken, url, fetchImpl = fetch }) {
  const response = await fetchImpl(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(json?.error?.message || `YouTube request failed with HTTP ${response.status}`);
  }
  return json;
}
