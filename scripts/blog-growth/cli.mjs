import { buildRybbitOverviewUrl } from './lib/rybbit.mjs';
import { LINKEDIN_ORG_ANALYTICS_SCOPES, parseLinkedInScopes } from './lib/linkedin.mjs';

export function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};

  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];
    if (!token.startsWith('--')) continue;

    const name = toCamelCase(token.slice(2));
    const next = rest[i + 1];
    if (!next || next.startsWith('--')) {
      options[name] = true;
    } else {
      options[name] = next;
      i += 1;
    }
  }

  return {
    command: command || 'help',
    options,
  };
}

export function buildCommandPlan({ command, options = {}, env = {} }) {
  if (command === 'utm-url') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'utm',
      channel: options.channel || options.source || '',
      hasUrl: Boolean(options.url),
    };
  }

  if (command === 'rybbit-preview') {
    const siteId = env.RYBBIT_SITE_ID;
    const url = buildRybbitOverviewUrl({
      siteId,
      start: options.start,
      end: options.end,
      timeZone: options.timeZone || env.TZ || 'America/Edmonton',
    });

    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'rybbit',
      endpoint: 'overview/time-series',
      url: url.toString(),
      hasApiKey: Boolean(env.RYBBIT_API_KEY),
      hasSiteId: Boolean(siteId),
    };
  }

  if (command === 'init-schema') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'turso',
      hasTursoUrl: Boolean(env.TURSO_URL),
      hasTursoAuthToken: Boolean(env.TURSO_AUTH_TOKEN),
    };
  }

  if (command === 'scan-content') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'content_repo',
    };
  }

  if (command === 'ingest-content') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'content_repo',
      hasTursoUrl: Boolean(env.TURSO_URL),
      hasTursoAuthToken: Boolean(env.TURSO_AUTH_TOKEN),
    };
  }

  if (command === 'normalize-content-dates') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'content_repo',
      hasTursoUrl: Boolean(env.TURSO_URL),
      hasTursoAuthToken: Boolean(env.TURSO_AUTH_TOKEN),
    };
  }

  if (command === 'register-channel-posts') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'manual',
      hasFile: Boolean(options.file),
      hasTursoUrl: Boolean(env.TURSO_URL),
      hasTursoAuthToken: Boolean(env.TURSO_AUTH_TOKEN),
    };
  }

  if (command === 'ingest-youtube') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'youtube',
      hasStart: Boolean(options.start),
      hasEnd: Boolean(options.end),
      hasSlugs: Boolean(options.slugs),
      hasTursoUrl: Boolean(env.TURSO_URL),
      hasTursoAuthToken: Boolean(env.TURSO_AUTH_TOKEN),
    };
  }

  if (command === 'import-linkedin') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'linkedin',
      hasFile: Boolean(options.file),
      hasTursoUrl: Boolean(env.TURSO_URL),
      hasTursoAuthToken: Boolean(env.TURSO_AUTH_TOKEN),
    };
  }

  if (command === 'linkedin-auth-url') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'linkedin',
      endpoint: 'oauth/authorization',
      hasClientId: Boolean(options.clientId || env.LINKEDIN_CLIENT_ID),
      hasRedirectUri: Boolean(options.redirectUri || env.LINKEDIN_REDIRECT_URI),
      scopeCount: parseLinkedInScopes(options.scopes || env.LINKEDIN_SCOPES || LINKEDIN_ORG_ANALYTICS_SCOPES).length,
    };
  }

  if (command === 'linkedin-diagnose') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'linkedin',
      endpoint: 'diagnostics',
      hasAccessToken: Boolean(env.LINKEDIN_ACCESS_TOKEN),
      hasOrganizationUrn: Boolean(options.organizationUrn || env.LINKEDIN_ORGANIZATION_URN),
      hasShareUrn: Boolean(options.shareUrn),
    };
  }

  if (command === 'linkedin-exchange-code') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'linkedin',
      endpoint: 'oauth/accessToken',
      hasCode: Boolean(options.code),
      hasClientId: Boolean(options.clientId || env.LINKEDIN_CLIENT_ID),
      hasClientSecret: Boolean(options.clientSecret || env.LINKEDIN_CLIENT_SECRET),
      hasRedirectUri: Boolean(options.redirectUri || env.LINKEDIN_REDIRECT_URI),
    };
  }

  if (command === 'ingest-linkedin') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'linkedin',
      endpoint: 'organizationalEntityShareStatistics',
      hasAccessToken: Boolean(env.LINKEDIN_ACCESS_TOKEN),
      hasOrganizationUrn: Boolean(options.organizationUrn || env.LINKEDIN_ORGANIZATION_URN),
      hasSlugs: Boolean(options.slugs),
      hasTursoUrl: Boolean(env.TURSO_URL),
      hasTursoAuthToken: Boolean(env.TURSO_AUTH_TOKEN),
    };
  }

  if (command === 'postmortem') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'turso',
      hasSlug: Boolean(options.slug),
      window: options.window || '7d',
      hasTursoUrl: Boolean(env.TURSO_URL),
      hasTursoAuthToken: Boolean(env.TURSO_AUTH_TOKEN),
    };
  }

  if (command === 'evaluate-content') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'turso',
      hasSlug: Boolean(options.slug),
      stage: options.stage || 'prepublish',
      rubricVersion: options.rubricVersion || 'blog-writing-v1',
      hasTursoUrl: Boolean(env.TURSO_URL),
      hasTursoAuthToken: Boolean(env.TURSO_AUTH_TOKEN),
    };
  }

  if (command === 'register-lessons') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'manual',
      hasFile: Boolean(options.file),
      hasTursoUrl: Boolean(env.TURSO_URL),
      hasTursoAuthToken: Boolean(env.TURSO_AUTH_TOKEN),
    };
  }

  if (command === 'next-brief-context') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'turso',
      limit: Number(options.limit || 5),
      hasTursoUrl: Boolean(env.TURSO_URL),
      hasTursoAuthToken: Boolean(env.TURSO_AUTH_TOKEN),
    };
  }

  if (command === 'seed-reward-version') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'turso',
      version: options.version || 'v0.1',
      hasTursoUrl: Boolean(env.TURSO_URL),
      hasTursoAuthToken: Boolean(env.TURSO_AUTH_TOKEN),
    };
  }

  if (command === 'ingest-rybbit') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'rybbit',
      hasApiKey: Boolean(env.RYBBIT_API_KEY),
      hasSiteId: Boolean(env.RYBBIT_SITE_ID),
      hasTursoUrl: Boolean(env.TURSO_URL),
      hasTursoAuthToken: Boolean(env.TURSO_AUTH_TOKEN),
    };
  }

  if (command === 'ingest-after-publish') {
    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'post_publish',
      hasApiKey: Boolean(env.RYBBIT_API_KEY),
      hasSiteId: Boolean(env.RYBBIT_SITE_ID),
      hasTursoUrl: Boolean(env.TURSO_URL),
      hasTursoAuthToken: Boolean(env.TURSO_AUTH_TOKEN),
      includesRybbit: Boolean(options.start && options.end),
    };
  }

  return {
    mode: 'help',
    source: 'local',
  };
}

function toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}
