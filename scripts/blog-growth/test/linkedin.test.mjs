import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LINKEDIN_ORG_ANALYTICS_SCOPES,
  buildLinkedInAuthUrl,
  buildLinkedInOrganizationAclsUrl,
  buildLinkedInShareStatisticsUrl,
  exchangeLinkedInAccessToken,
  linkedInShareUrnFromPost,
  normalizeLinkedInShareStatisticsRows,
  normalizeLinkedInSocialMetadataRows,
  sanitizeLinkedInProbeResponse,
} from '../lib/linkedin.mjs';

test('default LinkedIn org analytics scopes only request organization statistics access', () => {
  assert.deepEqual(LINKEDIN_ORG_ANALYTICS_SCOPES, ['rw_organization_admin']);
});

test('buildLinkedInAuthUrl creates org analytics consent URL without secrets', () => {
  const url = buildLinkedInAuthUrl({
    clientId: 'client-123',
    redirectUri: 'http://localhost:4173/linkedin/callback',
    state: 'state-abc',
  });

  assert.equal(url.origin, 'https://www.linkedin.com');
  assert.equal(url.pathname, '/oauth/v2/authorization');
  assert.equal(url.searchParams.get('response_type'), 'code');
  assert.equal(url.searchParams.get('client_id'), 'client-123');
  assert.equal(url.searchParams.get('redirect_uri'), 'http://localhost:4173/linkedin/callback');
  assert.equal(url.searchParams.get('state'), 'state-abc');
  assert.equal(url.searchParams.get('scope'), LINKEDIN_ORG_ANALYTICS_SCOPES.join(' '));
  assert.equal(url.toString().includes('secret'), false);
});

test('buildLinkedInOrganizationAclsUrl targets the roleAssignee finder', () => {
  const url = buildLinkedInOrganizationAclsUrl({
    role: 'ADMINISTRATOR',
    state: 'APPROVED',
  });

  assert.equal(url.origin, 'https://api.linkedin.com');
  assert.equal(url.pathname, '/rest/organizationAcls');
  assert.equal(url.searchParams.get('q'), 'roleAssignee');
  assert.equal(url.searchParams.get('role'), 'ADMINISTRATOR');
  assert.equal(url.searchParams.get('state'), 'APPROVED');
});

test('exchangeLinkedInAccessToken posts authorization code form data', async () => {
  const calls = [];
  const token = await exchangeLinkedInAccessToken({
    code: 'auth-code',
    clientId: 'client-123',
    clientSecret: 'secret-456',
    redirectUri: 'http://localhost:4173/linkedin/callback',
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({
          access_token: 'access-token',
          expires_in: 5184000,
          scope: 'openid profile',
        }),
      };
    },
  });

  assert.equal(calls[0].url, 'https://www.linkedin.com/oauth/v2/accessToken');
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[0].options.headers['Content-Type'], 'application/x-www-form-urlencoded');
  const body = new URLSearchParams(calls[0].options.body);
  assert.equal(body.get('grant_type'), 'authorization_code');
  assert.equal(body.get('code'), 'auth-code');
  assert.equal(body.get('client_id'), 'client-123');
  assert.equal(body.get('client_secret'), 'secret-456');
  assert.equal(body.get('redirect_uri'), 'http://localhost:4173/linkedin/callback');
  assert.equal(token.access_token, 'access-token');
});

test('buildLinkedInShareStatisticsUrl supports specific organization share urns', () => {
  const url = buildLinkedInShareStatisticsUrl({
    organizationUrn: 'urn:li:organization:2414183',
    shareUrns: [
      'urn:li:share:7132564752928563200',
      'urn:li:share:7132402731377438720',
    ],
  });

  assert.equal(url.pathname, '/rest/organizationalEntityShareStatistics');
  assert.equal(url.searchParams.get('q'), 'organizationalEntity');
  assert.equal(url.searchParams.get('organizationalEntity'), 'urn:li:organization:2414183');
  assert.equal(
    url.searchParams.get('shares'),
    'List(urn:li:share:7132564752928563200,urn:li:share:7132402731377438720)',
  );
});

test('linkedInShareUrnFromPost extracts share urns from ids or urls', () => {
  assert.equal(
    linkedInShareUrnFromPost({ channel_post_id: '7478437128545181697' }),
    'urn:li:share:7478437128545181697',
  );
  assert.equal(
    linkedInShareUrnFromPost({ channel_post_id: 'urn:li:ugcPost:7478437128545181697' }),
    'urn:li:ugcPost:7478437128545181697',
  );
  assert.equal(
    linkedInShareUrnFromPost({
      channel_url: 'https://www.linkedin.com/feed/update/urn:li:share:7478437128545181697/',
    }),
    'urn:li:share:7478437128545181697',
  );
});

test('normalizeLinkedInShareStatisticsRows maps org stats to canonical metrics', () => {
  const rows = normalizeLinkedInShareStatisticsRows({
    metricDate: '2026-07-05',
    channelPosts: [
      {
        id: 22,
        shareUrn: 'urn:li:share:7478437128545181697',
      },
    ],
    raw: {
      elements: [
        {
          share: 'urn:li:share:7478437128545181697',
          totalShareStatistics: {
            impressionCount: 1200,
            uniqueImpressionsCount: 900,
            likeCount: 18,
            commentCount: 4,
            shareCount: 2,
            clickCount: 11,
          },
        },
      ],
    },
  });

  assert.deepEqual(rows.map((row) => [row.metric_name, row.metric_value]), [
    ['linkedin_impressions', 1200],
    ['linkedin_members_reached', 900],
    ['linkedin_reactions', 18],
    ['linkedin_comments', 4],
    ['linkedin_reshares', 2],
    ['linkedin_link_clicks', 11],
  ]);
  assert.equal(rows[0].source, 'linkedin');
  assert.equal(rows[0].entity_type, 'channel_post');
  assert.equal(rows[0].entity_id, 22);
});

test('normalizeLinkedInSocialMetadataRows sums reactions and comments', () => {
  const rows = normalizeLinkedInSocialMetadataRows({
    metricDate: '2026-07-05',
    channelPostId: 22,
    entityUrn: 'urn:li:share:7478437128545181697',
    raw: {
      reactionSummaries: {
        LIKE: { reactionType: 'LIKE', count: 7 },
        EMPATHY: { reactionType: 'EMPATHY', count: 3 },
      },
      commentSummary: { count: 4, topLevelCount: 3 },
    },
  });

  assert.deepEqual(rows.map((row) => [row.metric_name, row.metric_value]), [
    ['linkedin_reactions', 10],
    ['linkedin_comments', 4],
  ]);
});

test('sanitizeLinkedInProbeResponse keeps diagnostic errors but drops personal fields', () => {
  const sanitized = sanitizeLinkedInProbeResponse({
    status: 403,
    code: 'ACCESS_DENIED',
    serviceErrorCode: 100,
    message: 'Not enough permissions',
    name: 'Aaron',
    email: 'aaron@example.com',
    elements: [
      {
        role: 'ADMINISTRATOR',
        state: 'APPROVED',
        organization: 'urn:li:organization:2414183',
      },
    ],
  });

  assert.deepEqual(sanitized, {
    status: 403,
    code: 'ACCESS_DENIED',
    serviceErrorCode: 100,
    message: 'Not enough permissions',
    elementCount: 1,
    elements: [
      {
        role: 'ADMINISTRATOR',
        state: 'APPROVED',
        organization: 'urn:li:organization:2414183',
      },
    ],
  });
});
