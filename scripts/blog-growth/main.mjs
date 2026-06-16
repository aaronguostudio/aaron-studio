import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs, buildCommandPlan } from './cli.mjs';
import { loadEnvFile, mergeEnv, redactEnv } from './lib/env.mjs';
import { scanBlogMarkdown } from './lib/content.mjs';
import { buildContentIngestStatements, buildRybbitPathMetricStatements, contentIdentitySlug, selectContentItems } from './lib/ingest.mjs';
import { executeTursoPipeline, splitSqlStatements } from './lib/sql.mjs';
import { buildUtmUrl } from './lib/utm.mjs';
import {
  buildRybbitEventsUrl,
  buildRybbitUrl,
  fetchRybbitJson,
  normalizeEventRowsByDay,
  pathnameFilter,
} from './lib/rybbit.mjs';

const RYBBIT_EVENT_METRIC_NAMES = {
  scroll_75: 'scroll_75',
  scroll_100: 'scroll_100',
  outbound_click: 'outbound_clicks',
};

export async function main(argv, { cwd = process.cwd(), stdout = console.log } = {}) {
  const parsed = parseArgs(argv);
  const config = loadStudioConfig(cwd);
  const env = loadGrowthEnv(cwd, config.blogRepo);

  if (parsed.command === 'help') {
    stdout(helpText());
    return;
  }

  if (parsed.command === 'utm-url') {
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    const url = buildUtmUrl(requireOption(parsed.options, 'url'), {
      channel: parsed.options.channel || parsed.options.source,
      source: parsed.options.source,
      medium: parsed.options.medium,
      campaign: parsed.options.campaign,
      content: parsed.options.content,
    });
    stdout(JSON.stringify({ ...plan, url }, null, 2));
    return;
  }

  if (parsed.command === 'scan-content') {
    const root = parsed.options.root || defaultBlogContentRoot(cwd, config);
    const items = scanBlogMarkdown(root);
    stdout(JSON.stringify({
      command: parsed.command,
      mode: parsed.options.dryRun ? 'dry-run' : 'live',
      root,
      count: items.length,
      sample: items.slice(0, Number(parsed.options.limit || 5)),
    }, null, 2));
    return;
  }

  if (parsed.command === 'init-schema') {
    const schemaPath = parsed.options.schema || join(cwd, 'docs/blog-growth/schema.sql');
    const statements = splitSqlStatements(readFileSync(schemaPath, 'utf8'));
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    if (parsed.options.dryRun) {
      stdout(JSON.stringify({
        ...plan,
        schemaPath,
        statementCount: statements.length,
        env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
      }, null, 2));
      return;
    }

    const result = await executeTursoPipeline({
      databaseUrl: env.TURSO_URL,
      authToken: env.TURSO_AUTH_TOKEN,
      statements,
    });

    stdout(JSON.stringify({
      ...plan,
      schemaPath,
      statementCount: statements.length,
      resultCount: Array.isArray(result.results) ? result.results.length : null,
      env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
    }, null, 2));
    return;
  }

  if (parsed.command === 'ingest-content') {
    const root = parsed.options.root || defaultBlogContentRoot(cwd, config);
    const items = scanBlogMarkdown(root);
    const statements = buildContentIngestStatements(items, {
      siteUrl: parsed.options.siteUrl || env.BLOG_SITE_URL || 'https://www.aaronguo.com',
    });
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });

    if (parsed.options.dryRun) {
      stdout(JSON.stringify({
        ...plan,
        root,
        itemCount: items.length,
        statementCount: statements.length,
        sample: items.slice(0, Number(parsed.options.limit || 5)).map((item) => ({
          slug: contentIdentitySlug(item),
          path: item.canonicalPath,
          title: item.title,
          language: item.language,
        })),
      }, null, 2));
      return;
    }

    const result = await executeTursoPipeline({
      databaseUrl: env.TURSO_URL,
      authToken: env.TURSO_AUTH_TOKEN,
      statements,
    });

    stdout(JSON.stringify({
      ...plan,
      root,
      itemCount: items.length,
      statementCount: statements.length,
      resultCount: Array.isArray(result.results) ? result.results.length : null,
      env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
    }, null, 2));
    return;
  }

  if (parsed.command === 'ingest-rybbit') {
    const root = parsed.options.root || defaultBlogContentRoot(cwd, config);
    const limit = parsed.options.all ? undefined : Number(parsed.options.limit || 10);
    const start = requireOption(parsed.options, 'start');
    const end = requireOption(parsed.options, 'end');
    const timeZone = parsed.options.timeZone || env.TZ || 'America/Edmonton';
    const includeEvents = parsed.options.skipEvents !== true;
    const eventsPageSize = Number(parsed.options.eventsPageSize || 500);
    const delayMs = Number(parsed.options.delayMs || 3500);
    const retries = Number(parsed.options.retries || 2);
    const retryDelayMs = Number(parsed.options.retryDelayMs || 65000);
    const items = selectContentItems(scanBlogMarkdown(root), {
      limit,
      slugs: parsed.options.slugs,
      paths: parsed.options.paths,
    });
    const contentStatements = buildContentIngestStatements(items, {
      siteUrl: parsed.options.siteUrl || env.BLOG_SITE_URL || 'https://www.aaronguo.com',
    });
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    const requests = items.map((item) => ({
      slug: contentIdentitySlug(item),
      path: item.canonicalPath,
      overviewUrl: buildRybbitUrl({
        siteId: env.RYBBIT_SITE_ID,
        endpoint: '/overview-bucketed',
        query: {
          bucket: 'day',
          start_date: start,
          end_date: end,
          time_zone: timeZone,
          filters: pathnameFilter(item.canonicalPath),
        },
      }).toString(),
      eventsUrl: includeEvents ? buildRybbitEventsUrl({
        siteId: env.RYBBIT_SITE_ID,
        start,
        end,
        timeZone,
        path: item.canonicalPath,
        pageSize: eventsPageSize,
      }).toString() : null,
    }));

    if (parsed.options.dryRun) {
      stdout(JSON.stringify({
        ...plan,
        root,
        start,
        end,
        timeZone,
        limit,
        includeEvents,
        eventNames: RYBBIT_EVENT_METRIC_NAMES,
        delayMs,
        retries,
        retryDelayMs,
        contentStatementCount: contentStatements.length,
        rybbitOverviewRequestCount: requests.length,
        rybbitEventInitialRequestCount: includeEvents ? requests.length : 0,
        sample: requests.slice(0, 5).map(({ slug, path }) => ({ slug, path })),
        env: redactEnv(pick(env, ['RYBBIT_SITE_ID', 'RYBBIT_API_KEY', 'TURSO_URL', 'TURSO_AUTH_TOKEN'])),
      }, null, 2));
      return;
    }

    const metricStatements = [];
    let eventRowCount = 0;
    for (const [index, request] of requests.entries()) {
      if (index > 0 && delayMs > 0) await sleep(delayMs);
      const raw = await fetchRybbitJson({
        apiKey: env.RYBBIT_API_KEY,
        url: new URL(request.overviewUrl),
        retries,
        retryDelayMs,
      });
      if (includeEvents && delayMs > 0) await sleep(delayMs);
      const eventRows = includeEvents ? normalizeEventRowsByDay(await fetchRybbitEventRows({
        apiKey: env.RYBBIT_API_KEY,
        siteId: env.RYBBIT_SITE_ID,
        start,
        end,
        timeZone,
        path: request.path,
        pageSize: eventsPageSize,
        retries,
        retryDelayMs,
      }), RYBBIT_EVENT_METRIC_NAMES) : [];
      eventRowCount += eventRows.length;
      metricStatements.push(...buildRybbitPathMetricStatements({
        path: request.path,
        raw,
        eventRows,
      }));
    }

    const statements = [...contentStatements, ...metricStatements];
    const result = await executeTursoPipeline({
      databaseUrl: env.TURSO_URL,
      authToken: env.TURSO_AUTH_TOKEN,
      statements,
    });

    stdout(JSON.stringify({
      ...plan,
      root,
      start,
      end,
      timeZone,
      contentItemCount: items.length,
      eventRowCount,
      delayMs,
      metricStatementCount: metricStatements.length,
      statementCount: statements.length,
      resultCount: Array.isArray(result.results) ? result.results.length : null,
      env: redactEnv(pick(env, ['RYBBIT_SITE_ID', 'RYBBIT_API_KEY', 'TURSO_URL', 'TURSO_AUTH_TOKEN'])),
    }, null, 2));
    return;
  }

  if (parsed.command === 'ingest-after-publish') {
    const root = parsed.options.root || defaultBlogContentRoot(cwd, config);
    const siteUrl = parsed.options.siteUrl || env.BLOG_SITE_URL || 'https://www.aaronguo.com';
    const allItems = scanBlogMarkdown(root);
    const selectedItems = selectContentItems(allItems, {
      limit: parsed.options.all ? undefined : parsed.options.limit,
      slugs: parsed.options.slugs,
      paths: parsed.options.paths,
    });
    const contentStatements = buildContentIngestStatements(allItems, { siteUrl });
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    const includeRybbit = Boolean(parsed.options.start && parsed.options.end);

    if (parsed.options.dryRun) {
      stdout(JSON.stringify({
        ...plan,
        root,
        itemCount: allItems.length,
        selectedItemCount: selectedItems.length,
        contentStatementCount: contentStatements.length,
        rybbitWindow: includeRybbit ? {
          start: parsed.options.start,
          end: parsed.options.end,
          timeZone: parsed.options.timeZone || env.TZ || 'America/Edmonton',
        } : null,
        sample: selectedItems.slice(0, Number(parsed.options.sample || 5)).map((item) => ({
          slug: contentIdentitySlug(item),
          path: item.canonicalPath,
          title: item.title,
          language: item.language,
        })),
        env: redactEnv(pick(env, ['RYBBIT_SITE_ID', 'RYBBIT_API_KEY', 'TURSO_URL', 'TURSO_AUTH_TOKEN'])),
      }, null, 2));
      return;
    }

    const result = await executeTursoPipeline({
      databaseUrl: env.TURSO_URL,
      authToken: env.TURSO_AUTH_TOKEN,
      statements: contentStatements,
    });

    if (!includeRybbit) {
      stdout(JSON.stringify({
        ...plan,
        root,
        itemCount: allItems.length,
        contentStatementCount: contentStatements.length,
        resultCount: Array.isArray(result.results) ? result.results.length : null,
        env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
      }, null, 2));
      return;
    }

    await main([
      'ingest-rybbit',
      '--start',
      parsed.options.start,
      '--end',
      parsed.options.end,
      '--root',
      root,
      ...(parsed.options.timeZone ? ['--time-zone', parsed.options.timeZone] : []),
      ...(parsed.options.slugs ? ['--slugs', parsed.options.slugs] : []),
      ...(parsed.options.paths ? ['--paths', parsed.options.paths] : []),
      ...(parsed.options.all ? ['--all'] : []),
      ...(parsed.options.limit ? ['--limit', parsed.options.limit] : []),
    ], { cwd, stdout });
    return;
  }

  if (parsed.command === 'rybbit-preview') {
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    if (parsed.options.dryRun) {
      stdout(JSON.stringify({
        ...plan,
        env: redactEnv(pick(env, ['RYBBIT_SITE_ID', 'RYBBIT_API_KEY'])),
      }, null, 2));
      return;
    }

    const raw = await fetchRybbitJson({
      apiKey: env.RYBBIT_API_KEY,
      url: plan.url,
    });

    stdout(JSON.stringify({
      ...plan,
      env: redactEnv(pick(env, ['RYBBIT_SITE_ID', 'RYBBIT_API_KEY'])),
      rows: Array.isArray(raw.data) ? raw.data.length : null,
      firstRow: Array.isArray(raw.data) ? raw.data[0] : undefined,
      dataShape: raw.data && !Array.isArray(raw.data) ? Object.keys(raw.data) : undefined,
    }, null, 2));
    return;
  }

  if (parsed.command === 'env-check') {
    stdout(JSON.stringify({
      command: parsed.command,
      env: redactEnv(pick(env, ['RYBBIT_SITE_ID', 'RYBBIT_API_KEY'])),
    }, null, 2));
    return;
  }

  throw new Error(`Unknown command: ${parsed.command}`);
}

async function fetchRybbitEventRows({ apiKey, siteId, start, end, timeZone, path, pageSize, retries, retryDelayMs }) {
  const rows = [];
  let beforeTimestamp;

  for (let page = 0; page < 20; page += 1) {
    const raw = await fetchRybbitJson({
      apiKey,
      url: buildRybbitEventsUrl({
        siteId,
        start,
        end,
        timeZone,
        path,
        pageSize,
        beforeTimestamp,
      }),
      retries,
      retryDelayMs,
    });

    rows.push(...(Array.isArray(raw.data) ? raw.data : []));

    const cursor = raw.cursor || {};
    if (!cursor.hasMore || !cursor.oldestTimestamp || cursor.oldestTimestamp === beforeTimestamp) break;
    beforeTimestamp = cursor.oldestTimestamp;
  }

  return rows;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, Number(ms || 0))));
}

export function loadStudioConfig(cwd) {
  const configPath = join(cwd, 'config/aaron-studio.json');
  if (!existsSync(configPath)) return {};
  return JSON.parse(readFileSync(configPath, 'utf8'));
}

export function loadGrowthEnv(cwd, blogRepo) {
  return mergeEnv([
    process.env,
    loadEnvFile(join(cwd, '.env')),
    blogRepo ? loadEnvFile(join(blogRepo, '.env')) : {},
  ]);
}

function pick(env, keys) {
  return Object.fromEntries(keys.map((key) => [key, env[key] || '']));
}

function defaultBlogContentRoot(cwd, config) {
  if (config.blogRepo) return join(config.blogRepo, 'content', 'blogs');
  return join(cwd, config.contentRoot || 'src/content', 'blogs');
}

function requireOption(options, key) {
  if (!options[key]) throw new Error(`--${key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)} is required`);
  return options[key];
}

function helpText() {
  return `Usage:
  node scripts/blog-growth.mjs scan-content --dry-run
  node scripts/blog-growth.mjs utm-url --url https://www.aaronguo.com/blogs/example --channel linkedin --campaign example
  node scripts/blog-growth.mjs init-schema --dry-run
  node scripts/blog-growth.mjs ingest-content --dry-run
  node scripts/blog-growth.mjs ingest-content
  node scripts/blog-growth.mjs ingest-after-publish --dry-run
  node scripts/blog-growth.mjs ingest-after-publish
  node scripts/blog-growth.mjs ingest-after-publish --start YYYY-MM-DD --end YYYY-MM-DD --slugs slug-a
  node scripts/blog-growth.mjs ingest-rybbit --start YYYY-MM-DD --end YYYY-MM-DD --limit 10 --dry-run
  node scripts/blog-growth.mjs ingest-rybbit --start YYYY-MM-DD --end YYYY-MM-DD --limit 10
  node scripts/blog-growth.mjs ingest-rybbit --start YYYY-MM-DD --end YYYY-MM-DD --slugs slug-a,slug-b
  node scripts/blog-growth.mjs ingest-rybbit --start YYYY-MM-DD --end YYYY-MM-DD --all
  node scripts/blog-growth.mjs rybbit-preview --start YYYY-MM-DD --end YYYY-MM-DD --dry-run
  node scripts/blog-growth.mjs rybbit-preview --start YYYY-MM-DD --end YYYY-MM-DD`;
}
