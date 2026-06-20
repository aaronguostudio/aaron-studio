import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsvText } from '../lib/csv.mjs';

test('parseCsvText parses quoted commas and blank metric cells', () => {
  const rows = parseCsvText('slug,channel_post_id,metric_date,impressions,comments\n"fable,post",abc,2026-06-15,120,\n');

  assert.deepEqual(rows, [
    {
      slug: 'fable,post',
      channel_post_id: 'abc',
      metric_date: '2026-06-15',
      impressions: '120',
      comments: '',
    },
  ]);
});
