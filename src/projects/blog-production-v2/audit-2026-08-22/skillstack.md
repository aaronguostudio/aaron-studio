# Audit: Skill engineering & productization

> Generated 2026-08-22 by a multi-agent audit of tiles/blog-production and its chain. Evidence cites working-tree file:line at audit time.

## Summary

The tiles/ system is further along as an engineering artifact than most "skill" repos: 30 test files, 172 bun tests + 5 node tests all green in about one second, seven JSON templates and 45 scripts (10.6k lines) behind aaron-video-gen, a real aggregate preflight, a scene registry with available/prototype/experimental statuses, a package-state.json record, and a shared asset-library service with a JSON schema. The golden package (2026-08-19) proves the chain can produce a published bilingual article plus a 10-minute film, but the directory also shows what it cost: 131 files, 11 article revisions, three narration versions, five MP4 masters (~225 MB), a storyboard audit that "passed" with 17 warnings, and a legacy slide render that had to be thrown away. The weak layer is skill engineering itself: the orchestrator's Artifact Contract is already out of sync with aaron-video-gen's Video 2.0 artifact list, artifact shapes exist only as TypeScript interfaces or prose heading lists duplicated across two SKILL.md files, tile.json versions are mostly 0.1.0 and drift from tessl.json, nine tiles have no tile.json at all, .tessl/RULES.md is not installed, there is no changelog anywhere, and the only "regression tests" for SKILL.md prose are string-contains assertions. Multi-harness portability is mostly symlink theater: all five surfaces get the same 28 links, but the skills call AskUserQuestion/WebSearch/WebFetch, an undefined ${SKILL_DIR} variable, Codex-only image_gen, and repo-root-relative script paths. Productization is blocked less by Aaron-specific taste (which is cleanly isolated in strategy files, voice-profiles.json, and scene-registry.json) than by hard-coded paths, a root-level scripts/blog-growth.mjs that is not a tile, 20+ environment secrets with no manifest, and the absence of any definition of done for a skill change. Against Aaron's own harness philosophy, the system scores well on recovery (package-state.json) and verification for video, middling on task contract and trusted context, and only prose-level on permissions.

## Strengths

- **Real executable gates, not just prose, for the video stage** — tiles/aaron-video-gen/scripts has 45 scripts (10,604 lines) and 20 test files; `npx -y bun test tiles/aaron-video-gen/scripts` -> 111 pass / 0 fail in 699 ms. production-preflight.ts aggregates director, evidence, asset, sprite and storyboard audits (SKILL.md:181-189). The golden package carries director-plan-audit.md, youtube-script-audit.md, video-storyboard-audit.md and production artefacts that these scripts actually emitted.
  - Why it matters: This is the part of the system that matches the harness philosophy's 'verification closed loop' (project-harness doc, section 5) and is the most defensible core of any future product.
- **package-state.json as a single authoritative state record** — src/content/blogs/2026-08-19/package-state.json records phase, three locks, canonical video `video-v3.mp4` with sha256, release URLs and production commit. blog-package-quality.ts:334-372 validates it (schema_version, slug, canonical video existence + hash, release.blog provenance). handoff.md explicitly defers to it: '当前状态以 package-state.json 为准'.
  - Why it matters: Directly implements the philosophy's 'persistent state and trajectory' requirement and solves the real failure seen in this package (stale video.mp4 vs v3).
- **Taste is already separated from mechanism** — Voice identity lives in tiles/aaron-video-gen/config/voice-profiles.json (versioned profile `aaron-pvc-identity-v1`, selection reason, source test). Visual grammar lives in config/scene-registry.json (12 available / 17 prototype / 6 experimental templates) and src/content/strategy/*.md (1,580 lines across 10 files). SKILL.md files reference these by path rather than inlining them (aaron-video-gen/SKILL.md:23-34, blog-production/SKILL.md:88-91).
  - Why it matters: This is exactly the split a product needs: the orchestrator + audits + registry are the engine; the strategy files are the user's profile. The template for a profile already exists.
- **Agent-decision memory with retirement tests** — src/brain/agent-decisions/README.md requires that a record 'points to a concrete check'; rejected/2026-08-16-no-legacy-video-fallback.md names the audit (`director-plan-audit.ts fails when that reference is missing`) and an explicit 'Evidence limit' admitting it has not yet been validated by a later run.
  - Why it matters: This is the rare case where a lesson was promoted to an automated check rather than another paragraph of prose; it is the pattern the whole skill-dev stack should follow.
- **asset-library is a properly built shared service** — tiles/asset-library/scripts/library.mjs (973 lines) with references/asset.schema.json, node:sqlite FTS, hash-dedup, append-only usage.jsonl, 5 passing node tests; config surface in config/aaron-studio.json `assetLibrary` block; zero npm deps (SKILL.md:77).
  - Why it matters: It is the one tile that already looks like a library with a contract (schema + CLI + tests + config), the model the others should converge on.
- **Skill surface sync is complete and verified** — scripts/sync-agent-skills.sh produces 28 symlinks in each of .agents/.codex/.claude/.cursor/.gemini (verified: 28/28/28/28/28). validate-workflows.sh checks symlink -> SKILL.md exposure and gitignore hygiene.
  - Why it matters: Distribution plumbing is solved; the portability problem is in the skill content, not the wiring.

## Gaps

### [high/structure/M] Orchestrator's Artifact Contract has drifted from the video stage it orchestrates

- Evidence: tiles/blog-production/SKILL.md:29-68 lists video artifacts as video-brief.md, youtube-script.md, youtube-script-audit.md, audio*, video.mp4, youtube-metadata.md. tiles/aaron-video-gen/SKILL.md:63-76 ('Video Workflow 2.0 Standard') requires fact-pack.json, video-treatment.md, director-plan.json, director-memo.md, asset-decision-log.md, asset-plan.json, video-storyboard.json, video-qa-report.md. None appear in blog-production's detect-next-step table (SKILL.md:121-151) and blog-package-quality.ts has no check for them (SERIOUS_ARTIFACTS/VISUAL_ARTIFACTS at :20-41 contain only article/image artefacts). The golden package contains all of them, produced by hand-navigating aaron-video-gen.
- Recommendation: Make the artifact contract machine-readable: one `tiles/blog-production/contracts/package-manifest.json` listing every artifact, producing skill, phase, required-for-lock, and schema path. Generate the SKILL.md table and the detect-next-step table from it (or test that they match). Add the Video 2.0 artifacts and a `video-locked` phase to blog-package-quality.ts.

### [high/structure/M] Artifact shapes are defined in prose and duplicated, not in schemas

- Evidence: video-brief.md required headings are listed twice verbatim: tiles/blog-write/SKILL.md:307-308 and tiles/aaron-video-gen/SKILL.md:433-446. package-state.json shape exists only as a TS interface (blog-package-quality.ts:73-92). director-plan.json, video-storyboard.json, fact-pack.json, asset-plan.json have templates (tiles/aaron-video-gen/templates/) but no JSON Schema; the only schema in the repo is tiles/asset-library/references/asset.schema.json. Taxonomy categories are hard-coded in both blog-write/SKILL.md:72-78 and blog-package-quality.ts:12-18.
- Recommendation: Add `schemas/*.schema.json` per JSON artifact (package-state, director-plan, storyboard, fact-pack, asset-plan, audio-generation-manifest) and a markdown-heading schema for video-brief/editorial-scorecard. Validate in the existing audit scripts; reference the schema path from SKILL.md instead of re-listing headings. Derive the taxonomy list from config/aaron-studio.json.

### [high/automation/S] No definition of done or versioning discipline for a skill change

- Evidence: tile.json versions: 22 of 26 tiles absent or 0.1.0; aaron-video-gen is 0.2.0 in tile.json but 0.1.0 in tessl.json; 9 tiles (asset-library, ai-video-lab, pattern-atlas, music-visualizer, 5 shorts) have no tile.json; tessl.json omits blog-canon-alignment, blog-prose-editor, asset-library, blog-notes, pattern-atlas. No CHANGELOG in any tile. .tessl/ contains only a .gitignore; RULES.md that AGENTS.md points to is not installed. SKILL.md line counts grew blog-production 109->352, blog-write 131->402, aaron-video-gen 130->775 with no release notes. scripts/validate-workflows.sh covers only 12 tiles and currently fails in this environment ('FAIL: agent docs do not mention Codex compatibility' because `rg` resolves to a shell wrapper, not ripgrep).
- Recommendation: Write a one-page `tiles/CONTRIBUTING.md` DoD: bump tile.json version, add CHANGELOG entry, run `scripts/validate-workflows.sh` + all tile tests, run golden-package regression. Make validate-workflows.sh iterate over sync-agent-skills.sh MAPPINGS instead of a hand list, require tile.json for every mapped tile, diff tessl.json versions against tile.json, and replace `rg` with `grep -q`.

### [high/quality/M] Prose changes to SKILL.md have only string-contains regression tests

- Evidence: tiles/blog-write/scripts/blog-write-workflow.test.ts:29-78 and tiles/blog-illustrate/scripts/blog-illustration-workflow.test.ts assert that SKILL.md and strategy files `toContain` specific phrases ('Style is pacing, not skin', 'blog-style-quality'). No test exercises a skill end-to-end against a fixture package; the only evals are tiles/muse/evals (4 cases, weighted_checklist) with no runner script found anywhere in tiles/ or scripts/.
- Recommendation: Build a golden-package regression: copy src/content/blogs/2026-08-19 metadata (minus media) into `tiles/blog-production/fixtures/golden-deepseek/`, and test that blog-package-quality --serious --require-images --require-distribution --require-release passes, that every audit script passes on the committed JSON, and that detect-next-step on the fixture returns 'complete'. Then add eval task.md + criteria.json per pipeline skill (muse already has the format) and a runner that can be invoked from any harness.

### [medium/structure/S] Multi-harness compatibility is asserted, not true

- Evidence: `AskUserQuestion` is invoked in blog-brainstorm/SKILL.md:43,108, muse/SKILL.md:88, yt-video-producer:60,101,157, yt-publish:104,140, yt-script-writer:171, yt-trend-scout:38,102. `WebSearch`/`WebFetch` named in blog-brainstorm:70,118, muse:173, weekly-review:66,161, yt-trend-scout:51, yt-script-writer:37. `${SKILL_DIR}` is used 19 times in aaron-video-gen/SKILL.md (:41,164,168,...) and in yt-publish/yt-video-producer but no harness defines that variable. `image_gen` is Codex-only (blog-illustrate:111, blog-production:232). Only 8 of 26 tiles have agents/openai.yaml. Asset-library and blog-growth commands use repo-root-relative paths (`node tiles/asset-library/scripts/...`, `node scripts/blog-growth.mjs`) that break if cwd is not the repo root.
- Recommendation: Adopt a tool-abstraction paragraph in each SKILL.md ('confirm with the user using the host's question tool or plain text'; 'search the web with the host's search tool or skip and report') and a single `tiles/_shared/harness.md` reference. Replace `${SKILL_DIR}` with paths relative to repo root or a documented resolution step. Add openai.yaml to the 10 pipeline tiles. Add a validate-workflows check that greps SKILL.md for AskUserQuestion/WebSearch/image_gen without a fallback sentence.

### [medium/structure/M] Three shared services are not tiles and not portable

- Evidence: scripts/blog-growth.mjs (7-line shim to scripts/blog-growth/, 1,563 lines) is referenced 19 times across SKILL.md files and needs TURSO_URL/TURSO_AUTH_TOKEN, RYBBIT_API_KEY/SITE_ID, LINKEDIN_* (6 vars), BLOG_SITE_URL. voice-profiles.json and scene-registry.json live inside tiles/aaron-video-gen/config but are referenced by knowledge-shorts and music-visualizer. blog-write reads tiles/blog-production/references/editorial-system.md (blog-write/SKILL.md:40,225) and its tests assert on blog-production/SKILL.md content (blog-write-workflow.test.ts:77-78).
- Recommendation: Promote blog-growth to `tiles/blog-growth/` with a SKILL.md and tile.json; move editorial-system.md, voice-profiles.json and scene-registry.json into a `tiles/_shared/` or `config/` location owned by no single stage; make every cross-tile reference go through config/aaron-studio.json keys.

### [medium/product/S] Secrets and external dependencies have no manifest

- Evidence: Scripts read OPENAI_API_KEY (11 sites), ELEVENLABS_API_KEY (5), KLING_ACCESS_KEY/SECRET_KEY/API_KEY, GOOGLE_API_KEY, GEMINI_API_KEY, YOUTUBE_CLIENT_ID/SECRET + ~/youtube-tokens.json, ARK_API_KEY (Seedance), plus the 11 blog-growth vars. aaron-video-gen/SKILL.md:339-344 loads env from `.baoyu-skills/.env` — a third-party skill's convention. Runtime needs bun via `npx -y bun`, Node >= 22.5 (node:sqlite), ffmpeg/ffprobe, python edge-tts, Remotion npm install. None of this is enumerated in one place; config/aaron-studio.json has absolute `/Users/aaronguo/...` paths (blogRepo, shortsReadyDir, homeDecorReferenceImagesDir).
- Recommendation: Add `config/requirements.json` (or extend tile.json) listing per-tile env vars, binaries, node version and optional providers; add a `scripts/doctor.sh` that checks them and prints what each missing key disables. Split config/aaron-studio.json into portable defaults + a gitignored `aaron-studio.local.json` for absolute paths.

### [medium/product/S] Aaron-specific constants are baked into SKILL.md prose

- Evidence: aaron-video-gen/SKILL.md:45-47 and :704-706 hard-code `--logo assets/aaron-logo-assets/ag-logo.png --slogan "AI-native builder. Human-first thinker." --website aaronguo.com`; :53 prints the ElevenLabs voice ID. blog-production/SKILL.md:106-115 and blog-write/SKILL.md:56-66 inline 'Aaron's default blog style' paragraphs that duplicate src/content/strategy/blog-writing-language.md. notion-task-intake and publish-to-blog contain 7 and 6 user-path references respectively.
- Recommendation: Move brand (logo, slogan, website), voice profile id and default style pointer into config/aaron-studio.json `brand` and `voice` keys; have SKILL.md say 'use brand from config'. The strategy files stay as the user's profile; ship a `profile-template/` with blank versions of the 10 strategy files so a second user has a fill-in surface.

### [medium/quality/M] Editorial gates are self-graded and overwhelmingly prose

- Evidence: blog-production/SKILL.md:164-316 defines ~20 gates; only 5 have a script (style-quality, package-quality, script audit, preflight, asset search). The editorial scorecard is scored by the same model that wrote the draft (blog-write/SKILL.md:223-230); the golden package's handoff.md records that a stale 89/100 from v4 was still on file after v11 ('现有 89 分是 v4 的，不可沿用'). The storyboard audit PASSed with 17 warnings including 'ends with 12.4s without a meaningful visual beat' (video-storyboard-audit.md). 'Serious essay', which switches ~10 gates on, is never defined or recorded in package-state.
- Recommendation: Add `serious: true|false` and `scorecard.draft_sha` to package-state.json so a stale score is detectable; make blog-package-quality fail when the scorecard hash differs from the article hash. Promote warnings that recur across packages into errors with a threshold (e.g. >10s without a visual beat). Keep the rest of the gate prose but move it to references/ with a 2-line summary in SKILL.md.

### [medium/measurement/M] No telemetry: cost, time and token spend per phase are unknown

- Evidence: Nothing in tiles/ or scripts/ records duration or tokens per phase. The golden package's QA report is the only trace ('overnight delegated run', 2026-08-16) and is free text. Audio manifests record hashes but not API cost; music-score/generation-manifest.json records song ids only.
- Recommendation: Add a `package-state.json.runs[]` array appended by every audit/generation script (phase, started_at, duration_ms, provider, units, estimated_cost). Start with the scripts that already write manifests (main.ts, audio, music). Without this, 'systematic, repeatable' cannot be demonstrated and productization has no pricing basis.

### [medium/craft/S] SKILL.md files exceed progressive-disclosure limits and mix reference with procedure

- Evidence: aaron-video-gen/SKILL.md is 775 lines (Anthropic guidance: <500); it includes a 40-row CLI options table (:229-268), TTS cache internals (:317-327), EXTEND.md docs (:346-365) and three example invocations. blog-write is 402, blog-production 352, blog-illustrate 330, blog-brainstorm 318. Rules are phrased as absolutes ('must', 'never') with the rationale often omitted (e.g. blog-production:276 'should normally use 20-30 total images' contradicts aaron-video-gen:626 'There is no image quota').
- Recommendation: Target <=250 lines per pipeline SKILL.md: keep pipeline, artifact pointer, commands, and gate names; move options tables, cache notes, V5 rules and example blocks to references/. Add a `skill-lint` script: line count, dead file references (every backticked path must exist), duplicated heading lists, contradictions between orchestrator and stage (image quota), and an 'every MUST has a because' heuristic.

### [low/automation/S] Permission boundaries are stated but not enforced

- Evidence: blog-production/SKILL.md:289 'Push, YouTube upload, LinkedIn posting ... require explicit user approval unless already clearly authorized'. yt-publish and publish-to-blog scripts have no dry-run/approval token; the video QA report shows an overnight delegated run executed the prototype gate 'in his stead'. The rights lanes (aaron-video-gen:651-676) are good but only prose.
- Recommendation: Have publish scripts require `package-state.locks.package == pass` and a `release.approved_by` field before side effects; add `--dry-run` default to youtube-upload.ts and publish-to-blog.mjs.

## Metrics observed

- 26 tiles; 28 skills synced to 5 surfaces (28 symlinks each in .agents/.codex/.claude/.cursor/.gemini)
- SKILL.md sizes: aaron-video-gen 775, blog-write 402, blog-production 352, blog-illustrate 330, blog-brainstorm 318, muse 221; blog-prose-editor 63, blog-canon-alignment 55
- SKILL.md growth: blog-production 109 (2026-06-07) -> 352; blog-write 131 -> 402; aaron-video-gen 130 (2026-02-15) -> 775
- Tests: 30 test files; bun test results: blog-production 11 pass/0 fail (37 ms), blog-write 39/0 (25 ms), aaron-video-gen 111/0 across 20 files (699 ms), blog-illustrate+publish-to-blog 11/0 (23 ms); asset-library node --test 5/0
- scripts/validate-workflows.sh: 1 FAIL in this environment (rg wrapper), covers 12 tiles + 14 skills per surface
- tile.json: 17 present, 9 missing; versions: 0.1.0 x14, 0.2.0 x2 (aaron-video-gen, blog-notes), 0.2.1 x1 (muse); tessl.json lists aaron-video-gen as 0.1.0 (drift); .tessl/ has no RULES.md
- Evals: 4 muse eval cases only; 0 eval runners found
- Schemas: 1 (asset.schema.json); templates: aaron-video-gen 7, blog-production 12 (workflow2 10 + workflow3 2), blog-illustrate 6
- aaron-video-gen scripts: 45 files, 10,604 lines; main.ts 1,272 lines; scene-registry: 12 available / 17 prototype / 6 experimental
- Shared code outside tiles: scripts/blog-growth 1,563 lines, referenced 19x from SKILL.md files
- Strategy files: 10 files, 1,580 lines; blog-writing-language.md referenced 6x, x.md 5x
- Env vars read by scripts: OPENAI_API_KEY (11 sites), ELEVENLABS_API_KEY (5), KLING_* (3 keys), GOOGLE/GEMINI_API_KEY, YOUTUBE_CLIENT_ID/SECRET, ARK_API_KEY, TURSO_URL/TOKEN, RYBBIT_API_KEY/SITE_ID, LINKEDIN_* (6)
- Golden package 2026-08-19: 131 entries; 11 article revisions (v3..v12 in revisions/); 3 audio manifests (~133 KB each); 5 MP4 masters (video.mp4 72 MB, v2/v3 ~35-40 MB each, prototype 5.7 MB); storyboard audit PASS with 17 warnings; 27 scenes, 606 s
- Git: 175 commits total, 76 touching tiles/; aaron-video-gen 25 commits, blog-production 12, blog-write 12, asset-library 1
- Runtime: bun not installed locally (runs via npx -y bun 1.4.0); node v22.22.3; tsx absent

## Open questions

- Is 'serious essay' meant to be a per-package flag Aaron sets, or should the orchestrator infer it? It gates ~10 steps and is currently undefined.
- Which harness is the primary production target today (the video QA report and 'In Codex' branches suggest Codex; CLAUDE.md suggests Claude Code)? Portability work should optimize for the real second harness, not all four.
- Is the product a pack someone installs into their own repo (needs profile-template + doctor), or a hosted service where Aaron's team runs the pipeline for clients (needs telemetry + cost model first)? The roadmap differs materially.
- How much of the 2026-08-19 film was produced by the skill chain versus hand-driven engineering on Remotion compositions (layout-manifest.json, music-score/generate.mjs)? That ratio determines whether a second user could reproduce it.
- Should scripts/blog-growth (Turso, Rybbit, LinkedIn analytics) be part of the product, or is measurement intentionally Aaron-only?
- Is Aaron willing to cap SKILL.md sizes and accept that some gate prose moves to references/, given the tests that pin specific phrases in those files?
