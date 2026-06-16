import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUtmUrl, channelUtmDefaults, normalizeCampaign } from '../lib/utm.mjs';

test('channelUtmDefaults maps distribution channels to source and medium', () => {
  assert.deepEqual(channelUtmDefaults('linkedin'), { source: 'linkedin', medium: 'social' });
  assert.deepEqual(channelUtmDefaults('youtube'), { source: 'youtube', medium: 'video' });
  assert.deepEqual(channelUtmDefaults('newsletter'), { source: 'newsletter', medium: 'email' });
  assert.deepEqual(channelUtmDefaults('x'), { source: 'x', medium: 'social' });
  assert.deepEqual(channelUtmDefaults('blog'), { source: 'blog', medium: 'owned' });
});

test('normalizeCampaign creates lowercase campaign ids', () => {
  assert.equal(normalizeCampaign('Fable 5 Changed the Unit of AI Work'), 'fable-5-changed-the-unit-of-ai-work');
});

test('buildUtmUrl appends default UTM params without overwriting existing query params', () => {
  assert.equal(
    buildUtmUrl('https://www.aaronguo.com/blogs/fable?lang=en', {
      channel: 'linkedin',
      campaign: 'Fable 5',
      content: 'brief',
    }),
    'https://www.aaronguo.com/blogs/fable?lang=en&utm_source=linkedin&utm_medium=social&utm_campaign=fable-5&utm_content=brief',
  );
});
