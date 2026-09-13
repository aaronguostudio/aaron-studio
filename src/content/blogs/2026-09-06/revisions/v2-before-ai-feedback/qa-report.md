# QA report — continuation, 2026-09-06

Article approved by Aaron. Argument and article locks pass. Earlier article-only QA preserved in revisions/article-phase-qa.md. Current authority: package-state.json.

## Blog
- EN/ZH manuscripts and four compressed images copied into isolated target worktree, codex/dhh-blog-2026-09-06 from origin/main 2846c8c. Original dirty worktree preserved.
- Target link validator: PASS, 2 files, 18 Markdown links, 50 known routes.
- Nuxt production build: PASS with Node 24, exit 0. Existing duplicate-route and outdated Browserslist warnings remain.
- Local built server initially missed optional @libsql/darwin-arm64; linked the already installed native module inside disposable .output only. No application code or dependencies changed. This verifies local preview, not production deployment.
- Browser rendered both exact H1s, route/title, cover and three lazy body images. English-to-Chinese and Chinese-to-English menu switches work. No captured console errors.
- Desktop layout checked at actual width 1391px; narrow viewport override requested 390px, backend DOM reported 424px. At both actual widths, scrollWidth equals clientWidth. Narrow screenshots inspected; no cut-off title, text or images.
- Canonical domain confirmed from rendered DOM: https://www.aaronguo.com.
- One Chinese source-label typo corrected after article approval; no argument or narration changes. Final build includes the correction.
- No push, merge, production deployment, email, or social post.

## Visuals
- Two cover and two thumbnail candidates compared, final selection B/B.
- Clean cover, three distinct body metaphors, and separate English YouTube thumbnail. PNGs preserved; accepted WebP copies compressed.
- All conceptual, not evidence of real product/customer outcomes. Visual critique PASS.

## Video
- Video-native script and 22-scene storyboard cover 289.088 seconds of narration plus a five-second brand end card.
- Script, director, storyboard planning, and content-evidence planning audits pass. This is planning validation, not rendered-video QA.
- Text-normalized script, audio transcript, provider word stream, and manifest SHA-256 checks match exactly. No independent ASR or human listening is claimed.
- Aaron PVC default: eleven_multilingual_v2. Technical audio QA: 44.1kHz mono, 192kbps, -16.58 LUFS, -1.63dBTP, no long silences.
- Full narration plus opening/middle/late samples are ready. Human listening decision pending. No video render started.
- Candidate music was researched for an internal audition; rights remain unresolved and no scored public output exists.

## Remaining gates
Aaron's listening decision; production visual implementation and QA after audio approval; explicit approval for push/publication. Package lock remains pending.

Final serious package gate with images/distribution: PASS; 1,349 English words (intentional concise length). Final Chinese style scan: 100/100 PASS. Asset-library scan: completed, project-specific illustrations not promoted to reusable approved assets.
