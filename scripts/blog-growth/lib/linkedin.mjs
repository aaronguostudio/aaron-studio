const LINKEDIN_API_BASE_URL = 'https://api.linkedin.com';
export const DEFAULT_LINKEDIN_API_VERSION = '202606';
export const LINKEDIN_ORG_ANALYTICS_SCOPES = [
  'rw_organization_admin',
];

const LINKEDIN_SHARE_STAT_METRICS = [
  ['impressionCount', 'linkedin_impressions', 'count'],
  ['uniqueImpressionsCount', 'linkedin_members_reached', 'count'],
  ['uniqueImpressionsCounts', 'linkedin_members_reached', 'count'],
  ['likeCount', 'linkedin_reactions', 'count'],
  ['commentCount', 'linkedin_comments', 'count'],
  ['shareCount', 'linkedin_reshares', 'count'],
  ['clickCount', 'linkedin_link_clicks', 'count'],
];

export function parseLinkedInScopes(value = LINKEDIN_ORG_ANALYTICS_SCOPES) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return String(value)
    .split(/[,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildLinkedInAuthUrl({
  clientId,
  redirectUri,
  state = 'blog-growth',
  scopes = LINKEDIN_ORG_ANALYTICS_SCOPES,
} = {}) {
  if (!clientId) throw new Error('LINKEDIN_CLIENT_ID is required');
  if (!redirectUri) throw new Error('LINKEDIN_REDIRECT_URI is required');

  const url = new URL('https://www.linkedin.com/oauth/v2/authorization');
  url.search = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: parseLinkedInScopes(scopes).join(' '),
  }).toString();
  return url;
}

export function buildLinkedInOrganizationAclsUrl({ role, state } = {}) {
  const url = new URL('/rest/organizationAcls', LINKEDIN_API_BASE_URL);
  url.searchParams.set('q', 'roleAssignee');
  if (role) url.searchParams.set('role', role);
  if (state) url.searchParams.set('state', state);
  return url;
}

export async function exchangeLinkedInAccessToken({
  code,
  clientId,
  clientSecret,
  redirectUri,
  fetchImpl = fetch,
} = {}) {
  if (!code) throw new Error('LinkedIn authorization code is required');
  if (!clientId) throw new Error('LINKEDIN_CLIENT_ID is required');
  if (!clientSecret) throw new Error('LINKEDIN_CLIENT_SECRET is required');
  if (!redirectUri) throw new Error('LINKEDIN_REDIRECT_URI is required');

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
  });
  const response = await fetchImpl('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(json?.error_description || json?.message || `LinkedIn token exchange failed with HTTP ${response.status}`);
  }
  return json;
}

export function buildLinkedInSocialMetadataUrl({ entityUrn }) {
  if (!entityUrn) throw new Error('LinkedIn social metadata entityUrn is required');
  return new URL(`/rest/socialMetadata/${encodeURIComponent(entityUrn)}`, LINKEDIN_API_BASE_URL);
}

export function buildLinkedInShareStatisticsUrl({
  organizationUrn,
  shareUrns = [],
  ugcPostUrns = [],
  start,
  end,
  granularity = 'DAY',
} = {}) {
  if (!organizationUrn) throw new Error('LINKEDIN_ORGANIZATION_URN is required');

  const url = new URL('/rest/organizationalEntityShareStatistics', LINKEDIN_API_BASE_URL);
  url.searchParams.set('q', 'organizationalEntity');
  url.searchParams.set('organizationalEntity', organizationUrn);

  const shares = parseLinkedInScopes(shareUrns);
  if (shares.length > 0) {
    url.searchParams.set('shares', `List(${shares.join(',')})`);
  }

  const ugcPosts = parseLinkedInScopes(ugcPostUrns);
  if (ugcPosts.length > 0) {
    url.searchParams.set('ugcPosts', `List(${ugcPosts.join(',')})`);
  }

  if (start || end) {
    const range = [
      start ? `start:${dateToEpochMs(start)}` : null,
      end ? `end:${dateToEpochMs(end)}` : null,
    ].filter(Boolean).join(',');
    url.searchParams.set('timeIntervals', `(timeRange:(${range}),timeGranularityType:${granularity})`);
  }

  return url;
}

export function linkedInShareUrnFromPost(post = {}) {
  const externalId = post.channel_post_id || post.channelPostId || '';
  if (/^urn:li:(share|ugcPost):\d+$/.test(externalId)) return externalId;
  if (/^\d+$/.test(externalId)) return `urn:li:share:${externalId}`;

  const channelUrl = post.channel_url || post.channelUrl || '';
  const match = String(channelUrl).match(/urn:li:(share|ugcPost):\d+/);
  return match ? match[0] : null;
}

export function normalizeLinkedInShareStatisticsRows({ metricDate, channelPosts = [], raw = {} } = {}) {
  if (!metricDate) throw new Error('LinkedIn metricDate is required');
  const postsByUrn = new Map(channelPosts
    .map((post) => ({ ...post, shareUrn: post.shareUrn || linkedInShareUrnFromPost(post) }))
    .filter((post) => post.shareUrn)
    .map((post) => [post.shareUrn, post]));
  const elements = Array.isArray(raw.elements) ? raw.elements : [];
  const rows = [];

  for (const element of elements) {
    const entityUrn = element.share || element.ugcPost;
    if (!entityUrn || !postsByUrn.has(entityUrn)) continue;
    const post = postsByUrn.get(entityUrn);
    const stats = element.totalShareStatistics || {};
    const emittedMetrics = new Set();

    for (const [sourceName, metricName, unit] of LINKEDIN_SHARE_STAT_METRICS) {
      if (emittedMetrics.has(metricName)) continue;
      const value = stats[sourceName];
      if (value === undefined || value === null || value === '') continue;
      emittedMetrics.add(metricName);
      rows.push(linkedInMetricRow({
        metricDate,
        channelPostId: post.id,
        entityUrn,
        metricName,
        metricValue: value,
        unit,
        raw: element,
      }));
    }
  }

  return rows;
}

export function normalizeLinkedInSocialMetadataRows({
  metricDate,
  channelPostId,
  entityUrn,
  raw = {},
} = {}) {
  if (!metricDate) throw new Error('LinkedIn metricDate is required');
  if (!entityUrn) throw new Error('LinkedIn entityUrn is required');

  const rows = [];
  const reactions = Object.values(raw.reactionSummaries || {})
    .reduce((sum, item) => sum + Number(item?.count || 0), 0);
  if (Object.keys(raw.reactionSummaries || {}).length > 0) {
    rows.push(linkedInMetricRow({
      metricDate,
      channelPostId,
      entityUrn,
      metricName: 'linkedin_reactions',
      metricValue: reactions,
      unit: 'count',
      raw,
    }));
  }

  if (raw.commentSummary?.count !== undefined) {
    rows.push(linkedInMetricRow({
      metricDate,
      channelPostId,
      entityUrn,
      metricName: 'linkedin_comments',
      metricValue: raw.commentSummary.count,
      unit: 'count',
      raw,
    }));
  }

  return rows;
}

export async function fetchLinkedInJson({
  accessToken,
  url,
  version = DEFAULT_LINKEDIN_API_VERSION,
  rest = true,
  fetchImpl = fetch,
}) {
  if (!accessToken) throw new Error('LINKEDIN_ACCESS_TOKEN is required');
  const response = await fetchImpl(url, {
    headers: linkedInHeaders({ accessToken, version, rest }),
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const error = new Error(json?.message || json?.error_description || `LinkedIn request failed with HTTP ${response.status}`);
    error.status = response.status;
    error.details = sanitizeLinkedInProbeResponse(json);
    throw error;
  }
  return json;
}

export async function probeLinkedInEndpoint({
  name,
  accessToken,
  url,
  version = DEFAULT_LINKEDIN_API_VERSION,
  rest = true,
  fetchImpl = fetch,
}) {
  if (!accessToken) {
    return {
      name,
      ok: false,
      status: null,
      permissionProblem: false,
      sanitized: { message: 'LINKEDIN_ACCESS_TOKEN is missing' },
    };
  }

  const response = await fetchImpl(url, {
    headers: linkedInHeaders({ accessToken, version, rest }),
  });
  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text.slice(0, 300) };
  }

  return {
    name,
    ok: response.ok,
    status: response.status,
    permissionProblem: response.status === 403 || json?.code === 'ACCESS_DENIED',
    sanitized: sanitizeLinkedInProbeResponse(json),
  };
}

export async function diagnoseLinkedInAccess({
  accessToken,
  version = DEFAULT_LINKEDIN_API_VERSION,
  organizationUrn,
  shareUrn,
  fetchImpl = fetch,
} = {}) {
  const probes = [
    probeLinkedInEndpoint({
      name: 'userinfo',
      accessToken,
      url: new URL('/v2/userinfo', LINKEDIN_API_BASE_URL),
      rest: false,
      fetchImpl,
    }),
    probeLinkedInEndpoint({
      name: 'organizationAcls.roleAssignee',
      accessToken,
      url: buildLinkedInOrganizationAclsUrl(),
      version,
      fetchImpl,
    }),
    probeLinkedInEndpoint({
      name: 'organizationAcls.adminApproved',
      accessToken,
      url: buildLinkedInOrganizationAclsUrl({ role: 'ADMINISTRATOR', state: 'APPROVED' }),
      version,
      fetchImpl,
    }),
  ];

  if (organizationUrn) {
    probes.push(probeLinkedInEndpoint({
      name: 'organizationalEntityShareStatistics',
      accessToken,
      url: buildLinkedInShareStatisticsUrl({ organizationUrn }),
      version,
      fetchImpl,
    }));
  }

  if (shareUrn) {
    probes.push(probeLinkedInEndpoint({
      name: 'socialMetadata',
      accessToken,
      url: buildLinkedInSocialMetadataUrl({ entityUrn: shareUrn }),
      version,
      fetchImpl,
    }));
  }

  return Promise.all(probes);
}

export function sanitizeLinkedInProbeResponse(data = {}) {
  const out = {};
  for (const key of ['status', 'code', 'serviceErrorCode', 'message', 'error', 'error_description']) {
    if (data[key] !== undefined) out[key] = data[key];
  }

  if (Array.isArray(data.elements)) {
    out.elementCount = data.elements.length;
    out.elements = data.elements.slice(0, 10).map((item) => ({
      role: item.role,
      state: item.state,
      organization: item.organization || item.organizationTarget || item.organizationalTarget,
    })).filter((item) => item.role || item.state || item.organization);
  }

  return out;
}

function linkedInHeaders({ accessToken, version, rest }) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
  };
  if (rest) {
    headers['Linkedin-Version'] = version || DEFAULT_LINKEDIN_API_VERSION;
    headers['X-Restli-Protocol-Version'] = '2.0.0';
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

function linkedInMetricRow({ metricDate, channelPostId, entityUrn, metricName, metricValue, unit, raw }) {
  return {
    metric_date: metricDate,
    source: 'linkedin',
    entity_type: 'channel_post',
    entity_id: Number(channelPostId),
    external_entity_id: entityUrn,
    metric_name: metricName,
    metric_value: Number(metricValue),
    unit,
    dimension_json: JSON.stringify({ channelPostId: entityUrn }),
    raw_json: JSON.stringify(raw),
  };
}

function dateToEpochMs(value) {
  if (value === undefined || value === null || value === '') return null;
  if (/^\d+$/.test(String(value))) return Number(value);
  const parsed = Date.parse(`${String(value).slice(0, 10)}T00:00:00.000Z`);
  if (!Number.isFinite(parsed)) throw new Error(`Invalid LinkedIn date: ${value}`);
  return parsed;
}
