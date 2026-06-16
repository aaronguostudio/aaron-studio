# Blog Growth Research Run - 2026-06-15

## Decision Frame

This run answers two questions:

1. Are the current data connections enough to support a recurring blog growth review?
2. What does the first live data pull suggest Aaron should optimize next?

Period: 2026-05-16 to 2026-06-15, America/Edmonton.

Raw run output: `docs/blog-growth/runs/growth-research-2026-06-15.json`.

## Data Readiness

| Source | Status | Notes |
| --- | --- | --- |
| Blog content repo | Ready | 38 markdown content items scanned from the configured blog repo. |
| Turso growth schema | Ready and seeded | Schema and views are present. Content catalog and the first Rybbit metric snapshots are now written. |
| Rybbit | Ready | Live API read succeeded for overview, paths, referrers, channels, countries, devices, and events. |
| YouTube Data API | Partially ready | Channel/video metadata and public stats are readable. |
| YouTube Analytics API | Blocked | Google Cloud project `245465686932` has not enabled `youtubeanalytics.googleapis.com`. |
| LinkedIn OAuth | Partially ready | Token works for identity and posting scope. Reading personal posts is blocked by missing read permission. |

## Rybbit Summary

Last 30 days:

- Sessions: 595, up 53.4% vs previous 30 days.
- Pageviews: 971, up 69.8%.
- Users: 547, up 64.3%.
- Pages per session: 1.63.
- Bounce rate: 74.3%.
- Average session duration: 62.0 seconds.
- Peak day: 2026-06-14, with 37 sessions and 209 pageviews.

Top blog pages:

| Rank | Page | Sessions | Pageviews | Bounce |
| --- | --- | ---: | ---: | ---: |
| 1 | No Magic: How ChatGPT Actually Works, Explained in One Kitchen | 74 | 173 | 43.2% |
| 2 | Anthropic Just Handed Finance Teams a Complete AI Stack | 37 | 79 | 56.8% |
| 3 | Naval Ravikant - Specific Knowledge, Responsibility, and Assets | 31 | 43 | 87.1% |
| 4 | I Chased Goals for 15 Years. Chamath Showed Me What I Got Wrong. | 11 | 22 | 72.7% |
| 5 | Fable 5 Changed the Unit of AI Work | 9 | 33 | 33.3% |
| 6 | In the Age of AI, Look Up at the Stars | 7 | 20 | 42.9% |

Top channels:

- Direct: 496 sessions, 83.4%.
- Referral: 61 sessions, 10.3%.
- Organic Search: 26 sessions, 4.4%.
- Organic Social: 11 sessions, 1.9%.
- AI: 1 session, 0.2%.

Top referrers:

- Disqus/disq.us: 61 combined sessions.
- Google: 21 sessions.
- LinkedIn web/app: 12 sessions.
- Bing variants: 4 sessions.
- X/t.co: 1 session.

Audience/device shape:

- Countries by sessions: Singapore 184, China 132, Hong Kong 79, US 73, Canada 59.
- Device split: Desktop 505 sessions, Mobile 90 sessions.
- Singapore and Hong Kong traffic show very high bounce, while US and Canada are much more engaged.

Events:

- `scroll_25`: 90
- `scroll_50`: 73
- `scroll_75`: 54
- `scroll_100`: 44
- `outbound_click`: 3
- `channel_click`: 1

## YouTube Summary

Channel: Aaron - AI-native builder.

- Lifetime views: 333.
- Subscribers: 14.
- Videos: 7.

Recent videos from the Data API:

| Video | Published | Views | Likes | Comments |
| --- | --- | ---: | ---: | ---: |
| Fable 5 Changed the Unit of AI Work | 2026-06-15 | 4 | 1 | 0 |
| In the Age of AI, Look Up at the Stars | 2026-06-14 | 2 | 0 | 0 |
| I Engineered the Law of Attraction with AI | 2026-03-09 | 45 | 5 | 0 |
| No Magic: How ChatGPT Actually Works, Explained in One Kitchen | 2026-03-02 | 114 | 11 | 2 |
| I Chased Goals for 15 Years. Chamath Showed Me What I Got Wrong. | 2026-02-24 | 60 | 6 | 0 |
| The Camera Didn't Make Everyone a Spielberg. AI Won't Either. | 2026-02-24 | 61 | 7 | 0 |
| AI Made Me 10x More Productive. Then I Almost Burned Out. | 2026-02-23 | 53 | 7 | 0 |

YouTube Analytics API remains blocked until the API is enabled in Google Cloud. That prevents watch time, average view duration, impressions, CTR, and subscriber attribution from entering the reward score.

## LinkedIn Summary

LinkedIn OAuth is configured for:

- `openid`
- `profile`
- `email`
- `w_member_social`

The token successfully reads identity data and can support posting. A read attempt against the Posts API failed with HTTP 403 because the current app lacks the required read permission for authored posts. LinkedIn's current Posts API documentation says retrieving all posts authored by a person requires `r_member_social`; the Social Metadata API similarly gates member social reads behind restricted read permissions.

Practical implication: LinkedIn analytics should start with manual CSV / screenshot export or a third-party tool export unless we obtain restricted read access.

## First Interpretation

1. The blog is already getting signal, but distribution attribution is weak.
   Direct traffic dominates at 83.4%, which usually means links are not tagged or referrers are being lost. This makes it hard to know whether LinkedIn, YouTube, email, or direct sharing is driving growth.

2. The best content signal is practical AI explainers, not generic reflection.
   The ChatGPT kitchen metaphor article is the clear winner by both sessions and pageviews, with a much better bounce rate than most pages. The Anthropic finance/plugins article also performs well. These suggest that concrete AI-native systems, finance/product operator takes, and understandable metaphors are working.

3. New posts have enough early engagement to track, but not enough to judge.
   Fable 5 had only 9 sessions but 33 pageviews and a 33.3% bounce rate, which is promising for early depth. It needs more distribution before the content quality can be judged.

4. International traffic quality is uneven.
   Singapore, China, and Hong Kong account for a large share of traffic, but Singapore and Hong Kong bounce rates are extremely high. US and Canada are smaller but much more engaged. This is a good candidate for bot/self-traffic/referrer-quality investigation.

5. The reward model now has its first persisted feedback layer.
   The schema exists, the 38 scanned content items are in Turso, and the first 310 daily Rybbit metric snapshots for priority posts are written. The next step is to make the ingestion scheduled and broaden the metrics beyond pageviews and unique visitors.

## Recommended Next Actions

1. Enable the YouTube Analytics API in Google Cloud project `245465686932`.
2. Schedule `blog-growth ingest-content` so the content catalog stays current after each publish.
3. Expand `blog-growth ingest-rybbit` beyond the first five priority posts and add engagement events such as `scroll_75`, `scroll_100`, and outbound clicks.
4. Add UTM defaults to every generated LinkedIn/YouTube/blog distribution artifact.
5. Use manual LinkedIn export as the first version of LinkedIn analytics ingestion.

## Execution Update

As of 2026-06-15:

- `ingest-after-publish` is implemented and live-tested. It updates the content catalog after each publishing run.
- `publish-to-blog` now includes a required post-publish growth catalog update step.
- `ingest-rybbit` now ingests pageviews, unique visitors, `scroll_75`, `scroll_100`, and `outbound_clicks`; it supports `--all`, path/slug selection, request delay, and rate-limit retry.
- A 10-post Rybbit live ingestion run completed with 626 metric statements; `growth_metric_snapshots` now has 876 rows, including `scroll_75` and `scroll_100` facts.
- UTM defaults are implemented through `blog-growth utm-url` and documented for LinkedIn, YouTube, newsletter, X, and blog-owned links.
- The current Fable LinkedIn, newsletter, and YouTube metadata files now use UTM-tagged blog URLs.
- YouTube token refresh and channel auth check succeeded, but Google Cloud API enablement remains blocked because the active Chrome account lacks access to project `245465686932`.

## Source Notes

- Rybbit API docs: `https://rybbit.com/docs/api/getting-started` and `https://rybbit.com/docs/api/stats/overview`.
- YouTube Analytics reports API: `https://developers.google.com/youtube/analytics/reference/reports/query`.
- LinkedIn Posts API: `https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api`.
- LinkedIn Social Metadata API: `https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/social-metadata-api`.
