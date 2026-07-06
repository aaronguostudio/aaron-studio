import { execFile } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { parseArgs, buildCommandPlan } from './cli.mjs';
import { loadEnvFile, mergeEnv, redactEnv } from './lib/env.mjs';
import { parseCsvText } from './lib/csv.mjs';
import { scanBlogMarkdown } from './lib/content.mjs';
import {
  buildAiReviewInsertStatement,
  buildChannelPostUpsertStatements,
  buildContentEvaluation,
  buildContentEvaluationInsertStatement,
  buildContentIngestStatements,
  buildLessonUpsertStatement,
  buildLessonUpsertStatements,
  buildLinkedInCsvImportPlan,
  buildMetricSnapshotUpsertStatement,
  buildNextBriefContext,
  buildPostmortemReview,
  buildRybbitPathMetricStatements,
  buildRewardVersionSeedStatement,
  contentIdentitySlug,
  metricWindowFromPublishedAt,
  selectContentItems,
} from './lib/ingest.mjs';
import { executeTursoPipeline, rowsFromTursoResult, splitSqlStatements, sqlLiteral } from './lib/sql.mjs';
import { buildUtmUrl } from './lib/utm.mjs';
import {
  buildYoutubeAnalyticsUrl,
  fetchYoutubeJson,
  normalizeYoutubeAnalyticsRows,
} from './lib/youtube.mjs';
import {
  DEFAULT_LINKEDIN_API_VERSION,
  LINKEDIN_ORG_ANALYTICS_SCOPES,
  buildLinkedInAuthUrl,
  buildLinkedInShareStatisticsUrl,
  diagnoseLinkedInAccess,
  exchangeLinkedInAccessToken,
  fetchLinkedInJson,
  linkedInShareUrnFromPost,
  normalizeLinkedInShareStatisticsRows,
  parseLinkedInScopes,
} from './lib/linkedin.mjs';
import {
  buildRybbitEventsUrl,
  buildRybbitOverviewUrl,
  fetchRybbitJson,
  normalizeEventRowsByDay,
} from './lib/rybbit.mjs';

const RYBBIT_EVENT_METRIC_NAMES = {
  scroll_75: 'scroll_75',
  scroll_100: 'scroll_100',
  outbound_click: 'outbound_clicks',
};
const execFileAsync = promisify(execFile);

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

  if (parsed.command === 'normalize-content-dates') {
    const root = parsed.options.root || defaultBlogContentRoot(cwd, config);
    const items = scanBlogMarkdown(root);
    const statements = buildContentIngestStatements(items, {
      siteUrl: parsed.options.siteUrl || env.BLOG_SITE_URL || 'https://www.aaronguo.com',
    });
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    const summary = summarizeContentDates(items);

    if (parsed.options.dryRun) {
      stdout(JSON.stringify({
        ...plan,
        root,
        ...summary,
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
      root,
      ...summary,
      statementCount: statements.length,
      resultCount: Array.isArray(result.results) ? result.results.length : null,
      env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
    }, null, 2));
    return;
  }

  if (parsed.command === 'register-channel-posts') {
    const file = requireOption(parsed.options, 'file');
    const distribution = JSON.parse(readFileSync(file, 'utf8'));
    const statements = buildChannelPostUpsertStatements(distribution);
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    const posts = Array.isArray(distribution.posts) ? distribution.posts : [];

    if (parsed.options.dryRun) {
      stdout(JSON.stringify({
        ...plan,
        file,
        slug: distribution.slug || null,
        postCount: posts.length,
        statementCount: statements.length,
        sample: posts.slice(0, Number(parsed.options.limit || 5)).map((post) => ({
          channel: post.channel,
          channelPostId: post.channel_post_id || post.channelPostId || null,
          channelUrl: post.channel_url || post.channelUrl || null,
          publishedAt: post.published_at || post.publishedAt || null,
        })),
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
      file,
      slug: distribution.slug || null,
      postCount: posts.length,
      statementCount: statements.length,
      resultCount: Array.isArray(result.results) ? result.results.length : null,
      env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
    }, null, 2));
    return;
  }

  if (parsed.command === 'linkedin-auth-url') {
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    const scopes = parseLinkedInScopes(
      parsed.options.scopes || env.LINKEDIN_SCOPES || LINKEDIN_ORG_ANALYTICS_SCOPES,
    );
    const url = buildLinkedInAuthUrl({
      clientId: parsed.options.clientId || env.LINKEDIN_CLIENT_ID,
      redirectUri: parsed.options.redirectUri || env.LINKEDIN_REDIRECT_URI,
      state: parsed.options.state || 'blog-growth-linkedin',
      scopes,
    });

    stdout(JSON.stringify({
      ...plan,
      url: url.toString(),
      scopes,
      env: redactEnv(pick(env, [
        'LINKEDIN_CLIENT_ID',
        'LINKEDIN_REDIRECT_URI',
        'LINKEDIN_SCOPES',
      ])),
    }, null, 2));
    return;
  }

  if (parsed.command === 'linkedin-diagnose') {
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    const version = parsed.options.version || env.LINKEDIN_API_VERSION || DEFAULT_LINKEDIN_API_VERSION;
    const organizationUrn = parsed.options.organizationUrn || env.LINKEDIN_ORGANIZATION_URN || '';
    const shareUrn = parsed.options.shareUrn || '';
    const probes = await diagnoseLinkedInAccess({
      accessToken: env.LINKEDIN_ACCESS_TOKEN,
      version,
      organizationUrn,
      shareUrn,
    });

    stdout(JSON.stringify({
      ...plan,
      version,
      organizationUrn: organizationUrn || null,
      shareUrn: shareUrn || null,
      probes,
      env: redactEnv(pick(env, [
        'LINKEDIN_ACCESS_TOKEN',
        'LINKEDIN_API_VERSION',
        'LINKEDIN_ORGANIZATION_URN',
      ])),
    }, null, 2));
    return;
  }

  if (parsed.command === 'linkedin-exchange-code') {
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    const token = await exchangeLinkedInAccessToken({
      code: requireOption(parsed.options, 'code'),
      clientId: parsed.options.clientId || env.LINKEDIN_CLIENT_ID,
      clientSecret: parsed.options.clientSecret || env.LINKEDIN_CLIENT_SECRET,
      redirectUri: parsed.options.redirectUri || env.LINKEDIN_REDIRECT_URI,
    });

    stdout(JSON.stringify({
      ...plan,
      accessToken: parsed.options.showToken ? token.access_token : redactTokenValue(token.access_token),
      expiresIn: token.expires_in || null,
      scope: token.scope || null,
      envHint: parsed.options.showToken
        ? 'Set LINKEDIN_ACCESS_TOKEN to the returned accessToken in your local .env.'
        : 'Re-run with --show-token only when you are ready to copy the token into local .env.',
      env: redactEnv(pick(env, [
        'LINKEDIN_CLIENT_ID',
        'LINKEDIN_CLIENT_SECRET',
        'LINKEDIN_REDIRECT_URI',
      ])),
    }, null, 2));
    return;
  }

  if (parsed.command === 'ingest-linkedin') {
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    const version = parsed.options.version || env.LINKEDIN_API_VERSION || DEFAULT_LINKEDIN_API_VERSION;
    const organizationUrn = parsed.options.organizationUrn || env.LINKEDIN_ORGANIZATION_URN;
    const metricDate = parsed.options.metricDate || todayIsoDate();
    const selectedSlugs = new Set(parseList(parsed.options.slugs));
    const query = [
      'SELECT cp.id, cp.channel_post_id, cp.channel_url, ci.slug',
      'FROM growth_channel_posts cp',
      'JOIN growth_content_items ci ON ci.id = cp.content_item_id',
      "WHERE cp.channel = 'linkedin'",
      'ORDER BY ci.published_at DESC, cp.published_at DESC',
    ].join('\n');
    const queryResult = await executeTursoPipeline({
      databaseUrl: env.TURSO_URL,
      authToken: env.TURSO_AUTH_TOKEN,
      statements: [query],
    });
    const registeredPosts = rowsFromTursoResult(queryResult.results?.[0] || {});
    const selectedPosts = registeredPosts
      .filter((post) => selectedSlugs.size === 0 || selectedSlugs.has(post.slug))
      .map((post) => ({
        ...post,
        id: Number(post.id),
        shareUrn: linkedInShareUrnFromPost(post),
      }))
      .filter((post) => post.shareUrn);
    const shareUrns = selectedPosts
      .map((post) => post.shareUrn)
      .filter((urn) => urn.startsWith('urn:li:share:'));
    const ugcPostUrns = selectedPosts
      .map((post) => post.shareUrn)
      .filter((urn) => urn.startsWith('urn:li:ugcPost:'));
    const statisticsUrl = organizationUrn && selectedPosts.length > 0
      ? buildLinkedInShareStatisticsUrl({ organizationUrn, shareUrns, ugcPostUrns })
      : null;

    if (parsed.options.dryRun) {
      stdout(JSON.stringify({
        ...plan,
        version,
        metricDate,
        registeredLinkedinPostCount: registeredPosts.length,
        selectedLinkedinPostCount: selectedPosts.length,
        selectedShareCount: shareUrns.length,
        selectedUgcPostCount: ugcPostUrns.length,
        statisticsUrl: statisticsUrl ? statisticsUrl.toString() : null,
        sample: selectedPosts.slice(0, Number(parsed.options.limit || 10)).map((post) => ({
          slug: post.slug,
          channelPostId: post.channel_post_id,
          channelUrl: post.channel_url,
          shareUrn: post.shareUrn,
        })),
        env: redactEnv(pick(env, [
          'LINKEDIN_ACCESS_TOKEN',
          'LINKEDIN_API_VERSION',
          'LINKEDIN_ORGANIZATION_URN',
          'TURSO_URL',
          'TURSO_AUTH_TOKEN',
        ])),
      }, null, 2));
      return;
    }

    if (!statisticsUrl) {
      throw new Error('No LinkedIn organization share statistics URL could be built; check LINKEDIN_ORGANIZATION_URN and registered LinkedIn channel posts');
    }

    const raw = await fetchLinkedInJson({
      accessToken: env.LINKEDIN_ACCESS_TOKEN,
      version,
      url: statisticsUrl,
    });
    const metricRows = normalizeLinkedInShareStatisticsRows({
      metricDate,
      channelPosts: selectedPosts,
      raw,
    });
    const statements = metricRows.map((row) => buildMetricSnapshotUpsertStatement(row));
    const result = statements.length > 0
      ? await executeTursoPipeline({
        databaseUrl: env.TURSO_URL,
        authToken: env.TURSO_AUTH_TOKEN,
        statements,
      })
      : { results: [] };

    stdout(JSON.stringify({
      ...plan,
      version,
      metricDate,
      registeredLinkedinPostCount: registeredPosts.length,
      selectedLinkedinPostCount: selectedPosts.length,
      metricRowCount: metricRows.length,
      statementCount: statements.length,
      resultCount: Array.isArray(result.results) ? result.results.length : null,
      env: redactEnv(pick(env, [
        'LINKEDIN_ACCESS_TOKEN',
        'LINKEDIN_API_VERSION',
        'LINKEDIN_ORGANIZATION_URN',
        'TURSO_URL',
        'TURSO_AUTH_TOKEN',
      ])),
    }, null, 2));
    return;
  }

  if (parsed.command === 'ingest-youtube') {
    const start = requireOption(parsed.options, 'start');
    const end = requireOption(parsed.options, 'end');
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    const selectedSlugs = new Set(parseList(parsed.options.slugs));
    const query = [
      'SELECT cp.id, cp.channel_post_id, cp.content_item_id, ci.slug',
      'FROM growth_channel_posts cp',
      'JOIN growth_content_items ci ON ci.id = cp.content_item_id',
      "WHERE cp.channel = 'youtube'",
      'ORDER BY ci.published_at DESC, cp.published_at DESC',
    ].join('\n');
    const queryResult = await executeTursoPipeline({
      databaseUrl: env.TURSO_URL,
      authToken: env.TURSO_AUTH_TOKEN,
      statements: [query],
    });
    const rows = rowsFromTursoResult(queryResult.results?.[0] || {});
    const posts = rows.filter((row) => (
      row.channel_post_id
      && (selectedSlugs.size === 0 || selectedSlugs.has(row.slug))
    ));
    const selectedVideos = posts.map((row) => ({
      slug: row.slug,
      channelPostRowId: Number(row.id),
      videoId: row.channel_post_id,
    }));

    if (parsed.options.dryRun) {
      stdout(JSON.stringify({
        ...plan,
        start,
        end,
        registeredYoutubePostCount: rows.length,
        selectedVideoCount: selectedVideos.length,
        selectedVideos: selectedVideos.slice(0, Number(parsed.options.limit || 10)),
        env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
      }, null, 2));
      return;
    }

    const metricRows = [];
    const accessToken = selectedVideos.length > 0 ? await getYoutubeAccessToken(cwd) : null;

    for (const video of selectedVideos) {
      const report = await fetchYoutubeJson({
        accessToken,
        url: buildYoutubeAnalyticsUrl({
          start,
          end,
          videoId: video.videoId,
        }),
      });
      metricRows.push(...normalizeYoutubeAnalyticsRows({
        channelPostId: video.channelPostRowId,
        videoId: video.videoId,
        report,
      }));
    }

    const statements = metricRows.map((row) => buildMetricSnapshotUpsertStatement(row));
    const result = statements.length > 0
      ? await executeTursoPipeline({
        databaseUrl: env.TURSO_URL,
        authToken: env.TURSO_AUTH_TOKEN,
        statements,
      })
      : { results: [] };

    stdout(JSON.stringify({
      ...plan,
      start,
      end,
      registeredYoutubePostCount: rows.length,
      selectedVideoCount: selectedVideos.length,
      metricRowCount: metricRows.length,
      statementCount: statements.length,
      resultCount: Array.isArray(result.results) ? result.results.length : null,
      env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
    }, null, 2));
    return;
  }

  if (parsed.command === 'import-linkedin') {
    const file = requireOption(parsed.options, 'file');
    const inputRows = parseCsvText(readFileSync(file, 'utf8'));
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    const query = [
      'SELECT cp.id, cp.channel_post_id, cp.channel_url, ci.slug',
      'FROM growth_channel_posts cp',
      'JOIN growth_content_items ci ON ci.id = cp.content_item_id',
      "WHERE cp.channel = 'linkedin'",
      'ORDER BY ci.published_at DESC, cp.published_at DESC',
    ].join('\n');
    const queryResult = await executeTursoPipeline({
      databaseUrl: env.TURSO_URL,
      authToken: env.TURSO_AUTH_TOKEN,
      statements: [query],
    });
    const registeredPosts = rowsFromTursoResult(queryResult.results?.[0] || {});
    const importPlan = buildLinkedInCsvImportPlan({ inputRows, registeredPosts });

    if (parsed.options.dryRun) {
      stdout(JSON.stringify({
        ...plan,
        file,
        rowCount: inputRows.length,
        registeredLinkedinPostCount: registeredPosts.length,
        matchedCount: importPlan.matchedRows.length,
        unmatchedRows: importPlan.unmatchedRows,
        channelPostStatementCount: importPlan.channelPostStatementCount,
        metricStatementCount: importPlan.metricStatementCount,
        statementCount: importPlan.statementCount,
        sample: importPlan.matchedRows.slice(0, Number(parsed.options.limit || 5)).map(({ row, post }) => ({
          slug: post.slug,
          channelPostId: post.channel_post_id || null,
          channelUrl: post.channel_url || null,
          metricDate: row.metric_date,
        })),
        env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
      }, null, 2));
      return;
    }

    if (importPlan.unmatchedRows.length > 0) {
      throw new Error(`Unmatched LinkedIn CSV rows: ${JSON.stringify(importPlan.unmatchedRows)}`);
    }

    const result = importPlan.statements.length > 0
      ? await executeTursoPipeline({
        databaseUrl: env.TURSO_URL,
        authToken: env.TURSO_AUTH_TOKEN,
        statements: importPlan.statements,
      })
      : { results: [] };

    stdout(JSON.stringify({
      ...plan,
      file,
      rowCount: inputRows.length,
      matchedCount: importPlan.matchedRows.length,
      channelPostStatementCount: importPlan.channelPostStatementCount,
      metricStatementCount: importPlan.metricStatementCount,
      statementCount: importPlan.statementCount,
      resultCount: Array.isArray(result.results) ? result.results.length : null,
      env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
    }, null, 2));
    return;
  }

  if (parsed.command === 'seed-reward-version') {
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    const statement = buildRewardVersionSeedStatement({
      version: parsed.options.version || 'v0.1',
      description: parsed.options.description || 'Initial qualified engaged audience score weights.',
      activeFrom: parsed.options.activeFrom || '2026-06-20',
    });

    if (parsed.options.dryRun) {
      stdout(JSON.stringify({
        ...plan,
        statementCount: 1,
        env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
      }, null, 2));
      return;
    }

    const result = await executeTursoPipeline({
      databaseUrl: env.TURSO_URL,
      authToken: env.TURSO_AUTH_TOKEN,
      statements: [statement],
    });

    stdout(JSON.stringify({
      ...plan,
      statementCount: 1,
      resultCount: Array.isArray(result.results) ? result.results.length : null,
      env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
    }, null, 2));
    return;
  }

  if (parsed.command === 'evaluate-content') {
    const slug = requireOption(parsed.options, 'slug');
    const root = parsed.options.root || defaultBlogContentRoot(cwd, config);
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    const item = findContentItemBySlug(scanBlogMarkdown(root), slug);
    const articleText = item?.filePath && existsSync(item.filePath) ? readFileSync(item.filePath, 'utf8') : '';
    const evaluation = buildContentEvaluation({
      slug,
      title: item?.title || parsed.options.title || slug,
      stage: parsed.options.stage || 'prepublish',
      rubricVersion: parsed.options.rubricVersion || 'blog-writing-v1',
      evaluator: parsed.options.evaluator || 'codex',
      scores: parsed.options.scores ? JSON.parse(parsed.options.scores) : heuristicRubricScores({ item, articleText }),
      hypothesis: parsed.options.hypothesis || 'This content should create qualified engaged audience if the hook, thesis, and distribution angle match the target reader.',
      targetAudience: parsed.options.targetAudience || 'AI-native builders and operators',
      successMetrics: parsed.options.successMetrics || 'scroll_75,scroll_100,outbound_clicks,linkedin_comments',
      recommendations: [
        'Compare this pre-publish prediction with the 24h and 7d postmortems before changing the writing workflow.',
      ],
      rawContext: {
        source_path: item?.filePath || null,
        canonical_path: item?.canonicalPath || null,
        word_count: item?.wordCount || null,
      },
    });
    const statement = buildContentEvaluationInsertStatement({
      ...evaluation,
      content_item_id_sql: `(SELECT id FROM growth_content_items WHERE slug = ${sqlLiteral(slug)})`,
    });

    if (parsed.options.dryRun) {
      stdout(JSON.stringify({
        ...plan,
        root,
        foundContent: Boolean(item),
        evaluation,
        statementCount: 1,
        env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
      }, null, 2));
      return;
    }

    const result = await executeTursoPipeline({
      databaseUrl: env.TURSO_URL,
      authToken: env.TURSO_AUTH_TOKEN,
      statements: [statement],
    });

    stdout(JSON.stringify({
      ...plan,
      root,
      foundContent: Boolean(item),
      evaluation,
      resultCount: Array.isArray(result.results) ? result.results.length : null,
      env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
    }, null, 2));
    return;
  }

  if (parsed.command === 'register-lessons') {
    const file = requireOption(parsed.options, 'file');
    const payload = JSON.parse(readFileSync(file, 'utf8'));
    const slug = payload.slug || parsed.options.slug;
    if (!slug) throw new Error('lesson payload slug is required');
    const lessons = Array.isArray(payload.lessons) ? payload.lessons : [];
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    const statements = lessons.map((lesson, index) => buildLessonUpsertStatement({
      lesson_key: lesson.lesson_key || lesson.lessonKey || `${slug}:manual_${index + 1}`,
      content_item_id_sql: `(SELECT id FROM growth_content_items WHERE slug = ${sqlLiteral(slug)})`,
      lesson_type: lesson.lesson_type || lesson.lessonType || 'keep',
      lesson_text: lesson.lesson_text || lesson.lessonText,
      confidence: lesson.confidence || 'medium',
      priority: lesson.priority || 'medium',
      evidence_json: {
        slug,
        source: 'manual',
        ...(lesson.evidence || {}),
      },
      status: lesson.status || 'active',
    }));

    if (parsed.options.dryRun) {
      stdout(JSON.stringify({
        ...plan,
        file,
        slug,
        lessonCount: lessons.length,
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
      file,
      slug,
      lessonCount: lessons.length,
      resultCount: Array.isArray(result.results) ? result.results.length : null,
      env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
    }, null, 2));
    return;
  }

  if (parsed.command === 'next-brief-context') {
    const limit = Number(parsed.options.limit || 5);
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    const reviewsQuery = [
      'SELECT review_type, summary, insights_json, recommended_actions_json, raw_context_json, created_at',
      'FROM growth_ai_reviews',
      'ORDER BY datetime(created_at) DESC',
      `LIMIT ${Number.isFinite(limit) && limit > 0 ? limit : 5}`,
    ].join('\n');
    const topContentQuery = [
      'SELECT slug, title, qualified_engaged_audience_score',
      'FROM growth_content_lifetime_scorecard',
      'ORDER BY qualified_engaged_audience_score DESC',
      `LIMIT ${Number.isFinite(limit) && limit > 0 ? limit : 5}`,
    ].join('\n');
    const lessonsQuery = [
      'SELECT lesson_key, lesson_type, lesson_text, confidence, priority, evidence_json, updated_at',
      'FROM growth_lessons',
      "WHERE status = 'active'",
      "ORDER BY CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END,",
      "  CASE confidence WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END,",
      '  datetime(updated_at) DESC',
      `LIMIT ${Number.isFinite(limit) && limit > 0 ? limit : 5}`,
    ].join('\n');
    const result = await executeTursoPipeline({
      databaseUrl: env.TURSO_URL,
      authToken: env.TURSO_AUTH_TOKEN,
      statements: [reviewsQuery, topContentQuery, lessonsQuery],
    });
    const reviews = rowsFromTursoResult(result.results?.[0] || {});
    const topContent = rowsFromTursoResult(result.results?.[1] || {});
    const lessons = rowsFromTursoResult(result.results?.[2] || {});
    const context = buildNextBriefContext({
      reviews,
      topContent,
      lessons,
      caveats: knownGapsFromReviews(reviews),
    });

    stdout(JSON.stringify({
      ...plan,
      reviewCount: reviews.length,
      topContentCount: topContent.length,
      lessonCount: lessons.length,
      context,
      env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
    }, null, 2));
    return;
  }

  if (parsed.command === 'postmortem') {
    const slug = requireOption(parsed.options, 'slug');
    const window = parsed.options.window || '7d';
    const plan = buildCommandPlan({ command: parsed.command, options: parsed.options, env });
    const contentQuery = [
      'SELECT id, slug, title, published_at',
      'FROM growth_content_items',
      `WHERE slug = ${sqlLiteral(slug)}`,
      'LIMIT 1',
    ].join('\n');
    const contentResult = await executeTursoPipeline({
      databaseUrl: env.TURSO_URL,
      authToken: env.TURSO_AUTH_TOKEN,
      statements: [contentQuery],
    });
    const content = rowsFromTursoResult(contentResult.results?.[0] || {})[0];
    if (!content) throw new Error(`No content item found for slug: ${slug}`);

    const { periodStart, periodEnd } = metricWindowFromPublishedAt(content.published_at, window);
    const scorecardQuery = [
      'SELECT',
      '  COALESCE(SUM(pageviews), 0) AS pageviews,',
      '  COALESCE(SUM(unique_visitors), 0) AS unique_visitors,',
      '  COALESCE(SUM(scroll_75), 0) AS scroll_75,',
      '  COALESCE(SUM(scroll_100), 0) AS scroll_100,',
      '  COALESCE(SUM(newsletter_subscribes), 0) AS newsletter_subscribes,',
      '  COALESCE(SUM(outbound_clicks), 0) AS outbound_clicks,',
      '  COALESCE(SUM(linkedin_impressions), 0) AS linkedin_impressions,',
      '  COALESCE(SUM(linkedin_reactions), 0) AS linkedin_reactions,',
      '  COALESCE(SUM(linkedin_comments), 0) AS linkedin_comments,',
      '  COALESCE(SUM(linkedin_reshares), 0) AS linkedin_reshares,',
      '  COALESCE(SUM(linkedin_link_clicks), 0) AS linkedin_link_clicks,',
      '  COALESCE(SUM(youtube_views), 0) AS youtube_views,',
      '  COALESCE(SUM(youtube_watch_minutes), 0) AS youtube_watch_minutes,',
      '  COALESCE(SUM(youtube_subscribers_gained), 0) AS youtube_subscribers_gained,',
      '  COALESCE(SUM(qualified_engaged_audience_score), 0) AS qualified_engaged_audience_score',
      'FROM growth_content_daily_scorecard',
      `WHERE content_item_id = ${sqlLiteral(content.id)}`,
      `  AND date(metric_date) >= date(${sqlLiteral(periodStart)})`,
      `  AND date(metric_date) < date(${sqlLiteral(periodEnd)})`,
    ].join('\n');
    const channelQuery = [
      'SELECT',
      '  channel,',
      '  COALESCE(SUM(linkedin_impressions), 0) AS linkedin_impressions,',
      '  COALESCE(SUM(linkedin_members_reached), 0) AS linkedin_members_reached,',
      '  COALESCE(SUM(linkedin_reactions), 0) AS linkedin_reactions,',
      '  COALESCE(SUM(linkedin_comments), 0) AS linkedin_comments,',
      '  COALESCE(SUM(linkedin_reshares), 0) AS linkedin_reshares,',
      '  COALESCE(SUM(linkedin_link_clicks), 0) AS linkedin_link_clicks,',
      '  COALESCE(SUM(youtube_views), 0) AS youtube_views,',
      '  COALESCE(SUM(youtube_watch_minutes), 0) AS youtube_watch_minutes,',
      '  COALESCE(SUM(youtube_subscribers_gained), 0) AS youtube_subscribers_gained,',
      '  COALESCE(SUM(youtube_likes), 0) AS youtube_likes,',
      '  COALESCE(SUM(youtube_comments), 0) AS youtube_comments',
      'FROM growth_channel_metric_rollup',
      `WHERE content_item_id = ${sqlLiteral(content.id)}`,
      `  AND date(metric_date) >= date(${sqlLiteral(periodStart)})`,
      `  AND date(metric_date) < date(${sqlLiteral(periodEnd)})`,
      'GROUP BY channel',
    ].join('\n');
    const metricsResult = await executeTursoPipeline({
      databaseUrl: env.TURSO_URL,
      authToken: env.TURSO_AUTH_TOKEN,
      statements: [scorecardQuery, channelQuery],
    });
    const scorecard = rowsFromTursoResult(metricsResult.results?.[0] || {})[0] || {};
    const channelMetrics = rowsFromTursoResult(metricsResult.results?.[1] || {});
    const knownGaps = inferPostmortemGaps(channelMetrics);
    const review = buildPostmortemReview({
      slug: content.slug,
      title: content.title,
      window,
      periodStart,
      periodEnd,
      scorecard,
      channelMetrics,
      knownGaps,
      rewardVersion: parsed.options.rewardVersion || 'v0.1',
    });
    const lessonStatements = buildLessonUpsertStatements({
      slug: content.slug,
      review,
    });

    if (parsed.options.dryRun) {
      stdout(JSON.stringify({
        ...plan,
        slug,
        periodStart,
        periodEnd,
        review,
        lessonCount: lessonStatements.length,
        env: redactEnv(pick(env, ['TURSO_URL', 'TURSO_AUTH_TOKEN'])),
      }, null, 2));
      return;
    }

    const statement = buildAiReviewInsertStatement({
      ...review,
      content_item_id: content.id,
    });
    const result = await executeTursoPipeline({
      databaseUrl: env.TURSO_URL,
      authToken: env.TURSO_AUTH_TOKEN,
      statements: [statement, ...lessonStatements],
    });

    stdout(JSON.stringify({
      ...plan,
      slug,
      periodStart,
      periodEnd,
      reviewType: review.review_type,
      lessonCount: lessonStatements.length,
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
      overviewUrl: buildRybbitOverviewUrl({
        siteId: env.RYBBIT_SITE_ID,
        start,
        end,
        timeZone,
        path: item.canonicalPath,
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

async function getYoutubeAccessToken(cwd) {
  const authModulePath = join(cwd, 'tiles/aaron-yt-pipeline/scripts/youtube-auth.ts');
  const script = [
    `const auth = await import(${JSON.stringify(authModulePath)});`,
    'console.log(await auth.getAccessToken());',
  ].join('\n');
  const { stdout } = await execFileAsync('npx', ['-y', 'bun', '-e', script], {
    cwd,
    maxBuffer: 1024 * 1024,
  });
  const token = stdout.trim().split('\n').at(-1);
  if (!token) throw new Error('Could not read YouTube access token from auth helper');
  return token;
}

function summarizeContentDates(items) {
  const unparseable = items
    .filter((item) => item.rawDate && !item.date)
    .map((item) => ({
      slug: contentIdentitySlug(item),
      rawDate: item.rawDate,
      sourcePath: item.filePath,
    }));

  return {
    total: items.length,
    normalized: items.filter((item) => item.date).length,
    nullDates: items.filter((item) => !item.rawDate).length,
    unparseable,
  };
}

function inferPostmortemGaps(channelMetrics) {
  const channels = new Set(channelMetrics.map((row) => row.channel));
  const gaps = [];
  if (!channels.has('linkedin')) gaps.push('linkedin_manual_import_missing');
  if (!channels.has('youtube')) gaps.push('youtube_metrics_missing');
  return gaps;
}

function findContentItemBySlug(items, slug) {
  return items.find((item) => contentIdentitySlug(item) === slug || item.slug === slug);
}

function heuristicRubricScores({ item, articleText = '' } = {}) {
  const text = String(articleText || '');
  const wordCount = Number(item?.wordCount || text.split(/\s+/).filter(Boolean).length || 0);
  const linkCount = (text.match(/\]\(https?:\/\//g) || []).length;
  const firstPersonCount = (text.match(/\b(I|my|we|our)\b/g) || []).length;
  const lower = text.toLowerCase();

  return {
    thesis: item?.title && wordCount >= 1200 ? 4 : 3,
    evidence: Math.min(5, 3 + Math.min(2, linkCount > 0 ? 1 : 0) + (firstPersonCount > 0 ? 1 : 0)),
    mechanism: /because|why|cost structure|bottleneck|constraint|mechanism|therefore/.test(lower) ? 4 : 3,
    stakes: /risk|quality|team|ship|business|owner|boundary/.test(lower) ? 4 : 3,
    nuance: /not |but |however|risk|counter|bad version|limitation/.test(lower) ? 4 : 3,
    frame: /model|framework|rule|lens|questions|boundary|evidence/.test(lower) ? 4 : 3,
    ending: /the teams that|my current answer|operating rule|what evidence/i.test(text.slice(-1200)) ? 5 : 3,
    voice: firstPersonCount > 0 ? 4 : 3,
    distribution: item?.title && item?.rawMetadata?.description ? 4 : 3,
  };
}

function knownGapsFromReviews(reviews) {
  return [...new Set(reviews.flatMap((review) => {
    try {
      const raw = JSON.parse(review.raw_context_json || '{}');
      return Array.isArray(raw.known_gaps) ? raw.known_gaps : [];
    } catch {
      return [];
    }
  }))];
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

function redactTokenValue(value) {
  return value ? `[set length=${String(value).length}]` : '[empty]';
}

function defaultBlogContentRoot(cwd, config) {
  if (config.blogRepo) return join(config.blogRepo, 'content', 'blogs');
  return join(cwd, config.contentRoot || 'src/content', 'blogs');
}

function requireOption(options, key) {
  if (!options[key]) throw new Error(`--${key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)} is required`);
  return options[key];
}

function parseList(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function helpText() {
  return `Usage:
  node scripts/blog-growth.mjs scan-content --dry-run
  node scripts/blog-growth.mjs utm-url --url https://www.aaronguo.com/blogs/example --channel linkedin --campaign example
  node scripts/blog-growth.mjs init-schema --dry-run
  node scripts/blog-growth.mjs ingest-content --dry-run
  node scripts/blog-growth.mjs ingest-content
  node scripts/blog-growth.mjs normalize-content-dates --dry-run
  node scripts/blog-growth.mjs normalize-content-dates
  node scripts/blog-growth.mjs register-channel-posts --file distribution.json --dry-run
  node scripts/blog-growth.mjs register-channel-posts --file distribution.json
  node scripts/blog-growth.mjs ingest-youtube --start YYYY-MM-DD --end YYYY-MM-DD --slugs slug-a --dry-run
  node scripts/blog-growth.mjs ingest-youtube --start YYYY-MM-DD --end YYYY-MM-DD --slugs slug-a
  node scripts/blog-growth.mjs linkedin-auth-url
  node scripts/blog-growth.mjs linkedin-exchange-code --code AUTH_CODE
  node scripts/blog-growth.mjs linkedin-diagnose --share-urn urn:li:share:123
  node scripts/blog-growth.mjs ingest-linkedin --metric-date YYYY-MM-DD --slugs slug-a --dry-run
  node scripts/blog-growth.mjs ingest-linkedin --metric-date YYYY-MM-DD --slugs slug-a
  node scripts/blog-growth.mjs import-linkedin --file linkedin.csv --dry-run
  node scripts/blog-growth.mjs import-linkedin --file linkedin.csv
  node scripts/blog-growth.mjs evaluate-content --slug slug-a --dry-run
  node scripts/blog-growth.mjs evaluate-content --slug slug-a
  node scripts/blog-growth.mjs register-lessons --file lessons.json --dry-run
  node scripts/blog-growth.mjs register-lessons --file lessons.json
  node scripts/blog-growth.mjs postmortem --slug slug-a --window 7d --dry-run
  node scripts/blog-growth.mjs postmortem --slug slug-a --window 7d
  node scripts/blog-growth.mjs next-brief-context --limit 5
  node scripts/blog-growth.mjs seed-reward-version --dry-run
  node scripts/blog-growth.mjs seed-reward-version
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
