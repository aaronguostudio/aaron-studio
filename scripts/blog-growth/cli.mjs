import { buildRybbitUrl } from './lib/rybbit.mjs';

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
    const url = buildRybbitUrl({
      siteId,
      endpoint: '/overview-bucketed',
      query: {
        bucket: 'day',
        start_date: options.start,
        end_date: options.end,
        time_zone: options.timeZone || env.TZ || 'America/Edmonton',
      },
    });

    return {
      mode: options.dryRun ? 'dry-run' : 'live',
      source: 'rybbit',
      endpoint: 'overview-bucketed',
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
