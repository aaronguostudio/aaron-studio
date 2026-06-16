const CHANNEL_DEFAULTS = {
  linkedin: { source: 'linkedin', medium: 'social' },
  youtube: { source: 'youtube', medium: 'video' },
  newsletter: { source: 'newsletter', medium: 'email' },
  x: { source: 'x', medium: 'social' },
  blog: { source: 'blog', medium: 'owned' },
};

export function channelUtmDefaults(channel) {
  const key = String(channel || '').toLowerCase();
  return CHANNEL_DEFAULTS[key] || { source: key || 'unknown', medium: 'referral' };
}

export function normalizeCampaign(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildUtmUrl(rawUrl, { channel, source, medium, campaign, content } = {}) {
  if (!rawUrl) throw new Error('url is required');
  const defaults = channelUtmDefaults(channel || source);
  const url = new URL(rawUrl);
  const normalizedCampaign = normalizeCampaign(campaign || url.pathname.split('/').filter(Boolean).at(-1) || 'content');

  url.searchParams.set('utm_source', source || defaults.source);
  url.searchParams.set('utm_medium', medium || defaults.medium);
  url.searchParams.set('utm_campaign', normalizedCampaign);
  if (content) url.searchParams.set('utm_content', normalizeCampaign(content));

  return url.toString();
}
