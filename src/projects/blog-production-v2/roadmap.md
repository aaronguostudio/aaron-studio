---
type: project
date: 2026-08-22
tags: [blog-production, content-system, skills, roadmap]
status: draft
related:
  - "[[content/strategy/video-style-baseline]]"
  - "[[brain/development-philosophy/project-harness-is-ai-autonomy-infrastructure]]"
  - "[[brain/agent-decisions/README]]"
---

# blog-production v2 Roadmap

> 2026-08-22。基于对 `tiles/blog-production` 全链（10 个 skill、08-19 黄金样本、9 个排队包、growth 数据库、外部 benchmark）的多 agent 审计 + 两轮对抗性 critic。证据文件在 [audit-2026-08-22/](audit-2026-08-22/)。所有 file:line 引用以审计当天的 working tree 为准。
>
> 目标（Aaron 原话）：把 blog-production 做成 No.1 的全产业链专业内容 skill——内容、图片、视频、分发；视频质量对标老高与小茉、小林说；人驱动、系统化、可复制；最终可产品化，作为"skill 是未来软件"这个战略判断的实践。

## 0. 一句话诊断

**一个过度建设的编辑官僚 + 一部手工打造的片子 + 一个两头都没闭合的反馈回路。**

| 事实 | 数字 |
|---|---|
| 08-19 之后排队的 9 个包 | 8/9 有 claim ledger PASS、scorecard 88–95；**1/9 有封面；0/9 有视频** |
| 08-19 黄金样本成本 | idea → 上传 **24h03m** 连续 agent 运行；13 版稿；3 版音频；5 个 mp4 master（~230 MB）；**TTS 计费 3.5× 成片时长**；视频阶段 ~10h |
| 黄金片子的可复用性 | `LedgerHarnessFilm.tsx` **1,582 行一次性代码，0 行 import 自 `remotion/src/editorial/`**；仓库里**没有任何命令能重现 video-v3**——SKILL.md 的"标准命令"渲染的是被否掉的 legacy slideshow |
| Gate 的真实覆盖 | 23 个 named gate，≈5 个被自己的脚本真正检查；**三个 Production Lock 没有任何脚本读** |
| 反馈回路 | 19 个包 **0 个** postmortem 有真实数字；08-19 的 `distribution.json` 用了错的 key（`url/video_id/publish_date` vs ingest 读的 `channel_post_id/channel_url/published_at`），growth DB 里查不到这篇；brand-sales agent **35 天写了 32 份一样的"什么都没发生"** |
| 黄金样本里决定性的一刻 | v4 在 scorecard 89、red-team、prose-polish 全部通过之后被 Aaron 15 分钟否掉（"过于表面"）；red-team 和 prose-polish **从未在 v5–v13 上重跑**，至今仍评的是死稿 |
| 硬约束 | `routine.md`：博客 + 视频 **~3-4h/周**；"rhythm beats spikes"；OrgNext 占 5-7h/周 CEO 时段 |

结论：编辑前半段已经是专业级但**过重**，媒体后半段**不可复现**，测量层**有管道没有水**。下一版的 80/20 不是再加基础设施，而是：砍 gate、把人工停靠点放对、让第二部片子比第一部便宜一半、把口播脚本当产品、拿到第一条真实 retention 数据。

## 1. 必须保护的东西（已经是专业级，重构时不能碰坏）

1. **Claim ledger + 独立 HEAD recheck**（`claim-ledger.md` C1–C31；`head-recheck-2026-08-15.md` 22 agent / 68 项 / 9 MISMATCH / 7 处修正）。全链唯一一个被证明抓住过"发布级错误"的机制，也是换模型、换渲染器、换 host 都能活下来的部分。
2. **系列文章的"先在自己 stack 落地再写"规则**（`handoff.md:44`、`09-02/entry-fee-experiment.md`、`src/brain/agent-decisions/rejected/`）。这是内容-实践飞轮，是真正的 moat；没有一个审计 agent 主动点名它，几个分层方案会把它当 ceremony 砍掉。
3. **从真实失败长出来的确定性媒体 gate**：`verify-narration-fidelity.ts`（抓到 3 种静默 TTS 拼接错误）、`audio-review.ts`（-16 LUFS / -1.5 dBTP / 静音 / 结尾归零）、`youtube-upload.ts` 缩略图 2 MB 自动转换、`director-plan-audit.ts` 缺 style_reference 即拒绝。**"失败变成脚本而不是一段话"**——这个模式是所有其他 gate 的样板。
4. **Director plan / fact-pack / asset-decision-log 的来源纪律**：每个画面有 narrative job、provenance、fallback。
5. **图片的 concept-before-style 纪律 + exact-text 缩略图预算**：08-19 六张成图一次过、零重抽、47 分钟。全链最便宜的专业级阶段，不要在这里加工具。
6. **Prototype 切片先于全片渲染**（08-19 两次全片 vs 08-02 六次）。
7. **永不覆盖 bootstrap + `revisions/` 快照**每一次 pivot。
8. **中文版是改编不是翻译**（08-19 ZH 把定价切换本地化成北京时间；C31 记录了这个刻意分叉）。任何 ZH 语音实验都不能把它退化成直译 TTS。
9. **`scripts/blog-growth`**：1,309 行、67 个测试、Turso 里有 5,626 行 Rybbit + 264 行 YouTube Analytics。难做的集成已经做完了——**接上它，不要重建**。
10. **agent-decisions 的"退役测试"模式**（`rejected/2026-08-16-no-legacy-video-fallback.md` 点名了执行它的 audit）。未来每一条 lesson 都该这样晋升，否则不记。
11. **研究底稿跨篇摊销**（`src/brain/reading/deepseek-harness-teardown/` 14 份笔记喂 4 篇文章）。
12. **6:30 / 23:00 两个固定人工时段 + overnight delegation 模式**（`video-qa-report.md:3`）。这是正确的运行模型，gate 应该设计成塞进这两个时段的"晨报包"，而不是反过来要求 Aaron 随时在线。

## 2. 三个需要纠正的认知

### 2.1 与老高/小林说的差距不在画面密度，而在叙事、选题、语音和"招牌装置"

视频审计 agent 量出 08-19 成片 **57% 的秒与下一秒像素相同、10 分钟 0 个 scene cut、60s/180s/450s 的帧都是奶油底上一行衬线字**，然后推论"和目标是相反的产品"，建议做第二套高运动量的 illustrated-story 视觉家族（角色圣经、co-host 第二声线、AI b-roll）。

Benchmark 研究把这个推论打回来了：**老高 2026 年起是黑底白字幕、纯口播**；小 Lin 是真人 + PPT 级图表；回形针（最接近"无脸动态图形解说"的中文样本）的规则是"**画面信息密度 > 口播信息密度**"，不是运动密度；Lemmino 的暗灰 + 三色 + 慢推 Ken Burns 是 TTS 口播最能驾驭的"高级感"。他们共同的东西是：**一个 curiosity gap 在 0:20 前抛出、层层递进（每个答案打开更大的问题）、每 3 句一个具体细节、一个替代"脸"的招牌装置（小 Lin 的奶茶店、Kurzgesagt 的鸟）、TTS 能演好的冷静第二/三人称语气、可见的来源卡。**

所以：**保留 ledger-editorial 视觉系统**（它和目标兼容），把预算花在口播脚本、选题和语音 prosody 上。但 57% 静止仍是工艺缺陷——解法是"每个静帧要么慢镜头要么一次可见状态变化，像素完全相同的连续时长 ≤3s"，而不是第二套视觉家族。等两条 retention 曲线进仓库之后再用 ADR 决定要不要更多。

### 2.2 决定性的人工干预发生在工作流不停的地方

工作流正式停下来等 Aaron 的地方是：听音频、对外发布。而 08-19 真正改变结果的一刻——否掉 v4 的 market-frame 角度、转向 teardown——发生在六份预写作产物、red-team、prose-polish 和一个 89 分之后，工作流没有任何一行要求在那里停。prototype gate 则是 agent"代为"通过的。

修法不是加 gate，是**把两个真正重要的停靠点放到 Aaron 已经在的时段，并把产物压缩到 10 分钟能读完**：Argument Lock（200 字，23:00 批）和 Treatment Lock（一页 + 60–90s prototype，6:30 批）。评审类产物绑定被评审稿的 sha256，validator 拒绝"评的是死稿"。

### 2.3 可产品化的是 harness，不是内容；而且它和 OrgNext 抢同一个时间槽

这条链的价值是 Aaron 的 taste gate 和 lived experiments；registry 排名奖励的是通用、装一次就走的 skill。追 skills.sh 安装量会把系统拉向 benchmark 研究描述的"AI slop 中位数"。可卖的单元是 **content-production harness**：状态机、validator、audit、Remotion 编辑系统、research recheck 模块，+ 一个 profile 模板让第二个 operator 填自己的声音、taxonomy、策略文件。

并且 routine.md 里产品化要用的是 OrgNext 的 5-7h/周 CEO 时段。**建议明确"Aaron-only 两个季度"**：先让这条链每周无痛跑起来（No.1 的第一个定义：packages shipped per month），用一个外部 operator 验证 harness 能被别人跑通，再谈 registry。

## 3. Roadmap

约定：S <1 天、M 1–3 天、L 1–2 周（agent 时间）；每项都有验收指标。**一个月内冻结新增 gate 和新增 prose**——任何未列在这里的提案，必须由接下来两个包里观察到的缺陷触发，并先记进 `src/brain/agent-decisions/`。

### Phase 0 — 止血 + 拿到第一条真实数据（本周，全部 S）

| # | 做什么 | 为什么 | 验收 |
|---|---|---|---|
| 0.1 | 修 08-19 `distribution.json` 的 key 为 registrar 读的 `channel_post_id / channel_url / published_at`；register + ingest 08-19（`5vEEBhbfUWw`）；拉 08-02 与 08-19 的 7 天 YouTube Analytics（AVD、30s retention、CTR、retention curve）；把曲线叠在 `video-storyboard.json` 的场景边界上；手填两份 postmortem | 0/19 个包有真实结果；这两条曲线是唯一能裁决"冷静页面到底丢不丢人"的数据，成本是一个下午 | 两份 postmortem 的 Actual 7d 非空；存在一张 retention-vs-scene 表；growth DB 里查得到 deepseek-harness-teardown |
| 0.2 | 版权与披露：把 Eleven Music 商业权利确认写进 asset-library（一次，带 plan tier 和日期），去掉 QA 里的 "publication-gated"；`youtube-upload.ts` 暴露并设置 YouTube 的 synthetic/altered content 标记；在 `aaron-video-gen/references/` 加一页 rights lane（voice clone、生成图、音乐、引语） | 片子已公开而它自己的 QA 说评分母带 publication-gated；克隆声道没有任何披露机制；产品化没有 rights model 就不可能 | `asset-library` 有 score-a/score-b 的权利记录；上传脚本能设 synthetic 标记；没有任何 package-state 在发布后仍是 rights: pending |
| 0.3 | 停掉 brand-sales 每日 shift，或把章程改成只做 "close the loop"（nightly ingest + postmortem-fill） | 35 天 32 份相同的 no-op 报告是负信号 | reports/ 停止增长，或下一份报告里有数字 |
| 0.4 | 修 validator 三个缺陷：`artifacts.video.canonical` 仅在视频在范围内时要求（`blog-package-quality.ts:353-357`，现在 text-only 包永远过不了 `--require-release`）；拒绝 08-21 那种 schema 漂移；从 `editorial-scorecard.md` 解析三个 Lock 行写入 `package-state.locks` | 这是 Aaron 想要的模式（prose 意图晋升为确定性检查）里最便宜的三项 | 08-21 通过 `--require-release`；新增 ≥3 个测试 |
| 0.5 | 一页内容 OKR 写进 `src/brain/goals/current-quarter.md`：posts/月、videos/季、**单一 headline KPI**、ZH yes/no、哪些系列拍片；恢复从 2026-W16 停掉的周回顾 | 所有分层、拍片、产品化决策今天都没有可以诉诸的权威；goals 文件还是空的 Q2 模板；x.md 是二月的 | 3 个带数字的 KR；接下来 4 周每周一份 review；08-26 → 10-07 每个包有 Aaron 决定的 tier 与 video yes/no |
| 0.6 | ZH 一小时实验：用现有 `aaron-pvc-identity-v1`（已是 `eleven_multilingual_v2`，会说普通话）念 08-19 ZH 脚本前 60 秒，给两个母语听众；把决定写进 x.md | 每篇都出 ZH 版但零 ZH 分发；benchmark 都是中文频道；两个审计 agent 提了 L 级 ZH lane——没人注意到现有 voice 已经多语 | 60s 样本 + 两个听众结论；x.md 有带日期的 ZH 受众决定 |
| 0.7 | 备份 08-19（573 MB，0 commits）：决定 render root 在内容树内还是 config 指定的外部目录；manifest + sha256 留在内容目录 | 全 studio 最有价值的包既没 commit 也没有备份策略；.gitignore 不排除 mp3 母带（~110 MB）和 PNG 源（~165 MB） | 一个 ADR + 08-19 的非媒体产物进 git |

### Phase 1 — 瘦身 + 把人工停靠点放对（2–4 周）

| # | 做什么 | 为什么 | 验收 |
|---|---|---|---|
| 1.1 **分层**（M） | `package-state.json` 加 `tier: note \| essay \| film`，在 idea.md 时决定。note → `blog-notes`，无 ledger；essay → plan、EN/ZH、style gate、cover、x-post，ledger 可选；film → 现 Workflow 3 + Video 2.0 + postmortem。validator 吃 `--tier` 取代 `--serious/--require-images/--require-distribution/--require-release` 这串 flag。"teardown" 是研究方法，不是层级，做成正交字段 | "serious essay" 从未定义；1,290 字的希腊游记也背着 20 个产物和 claim ledger；努力全压在编辑前半段 | 9 个排队包各自声明 tier 且零 schema 错误；workflow3 产物只为 serious/film 生成；不再写 handoff.md |
| 1.2 **编排器瘦身**（M） | `blog-production/SKILL.md` ≤150 行；named gate ≤10；gate 正文移到 `references/gates/<phase>.md`，`next step` 指出该读哪份。**删除**：video richness gate（`SKILL.md:276`，20-30 张图/每 15-20s 切图——它直接制造了被否的 12:42 v1 slide render，且与 `aaron-video-gen:626` "没有图片配额"矛盾）、detect 表里的 legacy slideshow 行、`x-teaser.md`、有 plan.md 时的 `content-plan.md`、`memory-reflection.md`（并入 canon-alignment）、`handoff.md`、Reinforcement gate 的两次 blog-growth 调用（lessons 表只有 2 行手写的七月条目，每个包返回一样的 prompt）。artifact contract 补上 aaron-video-gen 实际要求的 10 个 Video 2.0 产物。"Aaron 默认风格"段落删掉（与 blog-write 和 strategy 文件三处重复） | 352 行 + 23 个 gate + 全链 >1,500 行 prose，agent 已经跟不住；列表里其他任何一项都要先让编排器短到能装进 context | 行数 ≤150；gate ≤10；下一篇 essay 级文章 ≤12 个产物、无 ledger；film 级包 bootstrap 出 10 个 Video 2.0 产物 |
| 1.3 **两个真正的人工停靠点**（S） | **Argument Lock**：Aaron 批准 200 字 argument memo（thesis、开场具体事实、原创贡献、3 个标题候选）后才能写正文；它取代 editorial-brief + argument-memo + headline-sheet 三份；放在 23:00 sync。**Treatment Lock**：一页 treatment + 60–90s prototype，6:30 批准后才能全片渲染；新视觉系统时是硬人工 gate，只有 style_reference 原样继承已接受 baseline 时才允许代批。两者写入 `package-state.locks{status, approver, date, sha256}`，`next` 拒绝越过。red-team / prose-polish / scorecard **绑定被评审稿的 sha256**，不匹配 validator 失败。scorecard 从 19 KB 加权评分改成 10 行 contract diff（reader / promise / contribution + 编号必改项）——同一个 rubric 给被否的 v4 和锁定的 v12 打了同样的 89 | 08-19 唯一改变结果的干预发生在工作流不停的地方；13 轮稿里 0 轮由自动 gate 触发 | film 级文章草稿轮次 13 → ≤6；零评审产物的 sha 与成稿不符；前三个包的两个 lock 时间戳落在 6:30 或 23:00 时段 |
| 1.4 **把口播脚本当产品**（M） | 重写 `script-audit.ts`：0:20 前抛出 curiosity gap；每 3 句一个具体（名字/数字/日期/file:line）；每 35 秒窗口一个 retention beat（现在只是 warning）；每个 beat 命名 visual anchor；反思式结尾而非 CTA；8–12 分钟目标；用 voice profile 校准的 **110–115 wpm** 估时（现在用 150，把 597s 的脚本估成 515s 还 PASS）；超出 brief 15% 硬失败。脚本必须从 argument memo 为"耳朵"写，不是把文章压缩。新增 `src/content/strategy/voice-samples.md`：从 08-19 EN/ZH 摘 15–20 句范例，每句一行注明它的"动作"（第一手计数、成本段落、点名来源的反方、当场解释的比喻）+ 禁用动作（格言对句结尾、"It is X. It is Y." 三连、不解释的自造标签——希腊系列已经漂成这种腔调而 gate 全给 100 分）；把 handoff.md:48-50 的四条未晋升写作规则晋升进 blog-writing-language.md | 每个 benchmark 频道的人力都花在脚本上；老高黑屏也能留住人。08-19 脚本是 4,215 字文章的 1,408 字朗读版。这是 craft，是 Aaron 的小时该去的地方 | 估时与实测差 ≤10%；下一部片首 30 秒留存 >65%；scanner 降级为 pre-commit slop 过滤器 |
| 1.5 **时间/成本账本**（S） | `package-state.json` 加 `runs[]`：Aaron 触点数与分钟、agent 各阶段 wall-clock、TTS 字符、图片候选数、音乐生成次数、API 估算成本。先从 08-19 的 mtime 和 cache 回填 | 系统的真正约束是每周 3-4 个 Aaron 小时，没人量它；API 花费小（~22k TTS 字符、23 张图、2 首歌），agent token 和 Aaron 分钟未知。09-02 那篇本来就是量自己 stack 的 entry fee——pipeline 应该自己成为证据 | 08-19 和接下来两个包有填好的 runs[]；完成报告打印 Aaron minutes / agent hours / API cost；写下上限（essay ≤90 Aaron-min，film ≤4h）并对照 |
| 1.6 **视觉家族 ADR + brand tokens**（S） | ADR 确认 ledger-editorial（暖纸 + 衬线 + mono 边注 + 纸艺静帧）为频道身份；退役 `blog-illustrate/SKILL.md:77` 和 `visual-language.md:29` 里的 Soft Glass Narrative；`src/content/strategy/brand-tokens.json` 成为色板/字体/wordmark 的唯一定义，`layout-manifest.json`、Remotion theme、image prompt 前缀、缩略图模板都从它读。修 08-19 `director-plan.json`（clean-indigo）vs `package-state.json`（ledger-editorial）的矛盾 | 六张封面六个互不相关的视觉世界、策略文件里三个互相竞争的 baseline；不一致是 AI 频道的头号破绽，无脸频道没有别的可被认出的东西 | 一个 ADR；grep 不到 brand-tokens 之外的色值定义；接下来三个包的封面、缩略图、frame 0 共享色板与字体 |

### Phase 2 — 让第二部片子比第一部便宜一半（对象：08-26 或 09-02 那部）

> 唯一值得现在做的 L 项。验收是"同样的样子、一半的成本"，不是"更好看"。两者这个季度不可兼得。

| # | 做什么 | 验收 |
|---|---|---|
| 2.1 **可复用的 ledger 系统 + render-film.ts**（L） | 抽出 `LedgerHarnessFilm.tsx:37-369`（tokens、HeaderRail、CaptionBar、LedgerRow、SerifTitle、EvidenceStill、Connector/MapNode、CoverCard、EndCard）到 `remotion/src/editorial/ledger/`，theme token 参数化（ledger-editorial 与 clean-indigo 成为同一组件的两个主题）；把 08-19 实际用到的 3 个模板（editorial-statement ×12、system-map ×10、image-sequence ×4 = 26/27 场景）做成读 `video-storyboard.json` 的 data-driven 组件；`scripts/render-film.ts`：输入包目录 → 读 storyboard + 已验证 narration manifest → 生成 scenes/captions 数据 → 渲染命名 composition → 应用 `sound-cue-map.json` 包络（08-02 已有 v5 格式，替换手写 `vol-expr*.txt`）→ mux。SlideshowVideo 从"标准命令"块隔离到 `references/legacy-slideshow.md`。**不实现**另外 13 个 registry 模板；scene-registry 每项加 `component` 字段，`available` 但无实现的模板让 audit 失败 | `render-film.ts` 能从 08-19 storyboard 复现 video-v3（时长、场景数、loudness ±0.5 LU）；下一部片 ≤300 行专属 .tsx；视频阶段 agent ≤5h（08-19 ~10h）；`Root.tsx` 注册一个 ledger composition 而非 37 个 |
| 2.2 **动起来，不堆密度**（S） | 删除 `aaron-video-gen/SKILL.md:59` 的 no-Ken-Burns 禁令；每个静帧和排版页要么持续慢镜头要么一次可见状态变化，**像素完全相同的连续时长 ≤3s**；保留 calm 语气和 no-overshoot；storyboard audit 的 9–14s 间隙 warning 升为 ≥10s error（08-19 带着 17 个未处理 warning PASS）；渲染 CRF 18 或 8–12 Mb/s（现在视频流 208 kb/s，衬线会被 YouTube 二压糊掉） | 最长静止段 ≤3s；静止秒占比 <25%；视频流 ≥8 Mb/s；下一部片 storyboard audit 0 个 beat-gap warning |
| 2.3 **preflight-master.ts**（S） | 把 QA 报告手打的数字脚本化：frame 0 vs 批准封面的像素差、末 0.5s RMS < −60 dB、时长 = narration + cover + end card ±0.5s、缩略图 <2 MB、loudness / true peak、最长静止段；`verify-narration-fidelity.ts` 作为 `remotion-render.ts` 的硬前置。结果写进 `video-qa-report.md` | 08-19 四个 repeat-class miss（漏封面卡、尾音硬切、3.7 MB 缩略图、重复旁白）全由 Aaron 的眼睛或 API 抓到——下一部片 0 个；QA 报告技术段为脚本输出 |
| 2.4 **TTS 缓存修正**（S） | 脚本审计时分段一次，cache key 只含（段文本, voice profile）；邻居失效改 opt-in；一段重录不重排 27 个场景（pad 到锁定时长，只 re-mux） | TTS 计费 ≤1.3× 成片（08-19：3.5×） |
| 2.5 **缩略图成系统**（S–M） | 一个 Remotion still 模板（封面物件槽 + 3 行 exact-text + 角落 wordmark）同一 composition 产出 YouTube 缩略图（1280×720 JPEG <2 MB）、0–3s cover card、frame 0 hero，共享 1.6 的 tokens；附 320×180 contact sheet；手记上传的变体与 7 天 CTR 到 distribution.json | 缩略图、cover card、frame 0 由同一 composition 派生（08-19 开场是两套互不相关的身份背靠背）；从下一部片起每次上传都记 CTR |
| 2.6 **音乐**（S） | 0.2 的权利记录完成后，把 score-a/score-b 注册为 library 资产；`sound-cue-map.json` 取代手写包络。**不**建 stem 库 | 下一部片不重新生成整首配乐 |

### Phase 3 — 产品化地基（2–3 部片子能从数据复现之后）

| # | 做什么 | 备注 |
|---|---|---|
| 3.1 单一 state | `package-state.json` schema v2（tier、locks{status, date, sha256}、artifacts map、runs[]）；detect-next-step 表由它生成或测试一致。**不做** 5 子命令 CLI、不做 `artifacts.json` 第四份真相 | 三个审计各提了一份 contract 文件——合并成一份 |
| 3.2 共享层归位 | `scripts/blog-growth` → `tiles/blog-growth`；`editorial-system.md`、`voice-profiles.json`、`scene-registry.json` → `tiles/_shared/` 或 `config/`；`config/aaron-studio.json` 拆成 portable 默认 + gitignored `aaron-studio.local.json`；`publish-to-blog` 删掉硬编码 `/Users/aaronguo` 表 | |
| 3.3 Skill 工程 DoD | 20 行 `tiles/CONTRIBUTING.md`（bump tile.json、CHANGELOG、跑 validate-workflows + tile tests + golden 回归）；`skill-lint`（行数、死引用、编排器与阶段矛盾、"每个 MUST 有 because"）；golden-package fixture 回归（08-19 去媒体版）；每个 pipeline skill 一个 eval（muse 已有 task.md + criteria.json 格式）；删掉钉死具体短语的 string-contains 测试（它们挡住所有人都要的行数缩减） | |
| 3.4 分发自动化 | **仅在** 3 个包有手记 URL 且有人因为某个数字改过决定之后；顺序 LinkedIn（重授权 `w_member_social`，`/rest/posts`）→ Beehiiv（确认 plan 支持 posts API）→ X（Free tier 1,500 writes/月够用）；Facebook 个人主页无 API，保持手动 + `record-post`。repurpose tile（Shorts / X clip / quote card / thread）在 retention 数据说明哪些章节被看之后 | 现在先加一个 2 分钟的 `record-post --channel --url` |
| 3.5 ZH lane | 仅在 0.6 实验通过后；第一步是给现有片子换 voice + captions（timeline 已按词对齐），作为第二个 YouTube 视频或 Bilibili 上传；`youtube-script-zh.md` 从 ZH 文章写，不是翻译 EN 脚本；CJK 字体栈 + 字幕每行 14–18 字 | |
| 3.6 产品化 | `profile-template/`（10 个 strategy 文件的空白版）+ `scripts/doctor.sh`（秘钥 / 二进制 / node 版本清单，现在 20+ 个 env 变量无清单）+ 一页 rights/consent 模型；**先找一个外部 operator 跑通全链**，再谈 agentskills.io / skills.sh / plugin marketplace / Tessl evals | |

## 4. 明确不做 / 推迟

- **删除**：video richness gate；legacy slideshow 命令块；x-teaser.md；有 plan.md 时的 content-plan.md；memory-reflection.md（并入 canon-alignment）；handoff.md；Reinforcement gate 的两次 CLI 调用；钉死短语的 SKILL.md string 测试。
- **停止**：brand-sales 每日 agent；在 renderer 读它之前生成 35 KB 的 `video-storyboard.json` + audit（现在是双重记账）；对 essay 级文章（希腊系列）跑 Workflow 3 全套。
- **推迟到 2–3 部片可复现之后**：package-state CLI、per-artifact JSON schema、telemetry 以外的产品化 hygiene、CONTRIBUTING/CHANGELOG 全套、openai.yaml 补齐、多 harness 抽象改写、config 拆分。
- **推迟到两条 retention 曲线进仓库之后**：第二套 illustrated-story 视觉家族、角色圣经、co-host 声线、AI b-roll 提取脚本、encoded-master 密度评分器、15–30 分钟时长。
- **推迟到受众决定之后**：ZH lane、Bilibili/公众号分发、录制普通话 PVC（先测现有多语 voice）。
- **推迟到 3 个包有手记 URL 之后**：四渠道发帖自动化、nightly postmortem-fill launchd、"上一篇没填 postmortem 就拒绝开新包"的阻断规则（这正是让编排器跟不住的 gate-bloat 模式）。
- **推迟**：blog-repurpose tile；Remotion 重做博客机制图；3 变体缩略图 A/B、OG/方图派生、contact-sheet.ts、safe-zone 遮罩、illustration-package-check.ts（只保留 2 MB 与 320px 可读两项检查——图片阶段没出过问题）；`tiles/source-teardown/` 作为独立 tile（把 dsh-head-recheck 脚本搬进 `tiles/blog-production/scripts` 当 fact-recheck 工具即止）；独立判官 subagent / 不同厂商模型（三个盲评已给 v4 和 v12 同样的 89——独立性不修不敏感的 rubric）；scanner 语料基线分析器（voice-samples.md 更便宜更有用）；音乐 stem 库；另外 13 个 registry 模板；Root.tsx 里 13 个一次性 composition（归档，不移植）。
- **希腊系列不拍片**：off-pillar（记忆规则：深思类文章也要锚到 tech），且紧接旗舰片后连续四周；不该用它测试可复用系统。

## 5. 战略线：skill 是未来的软件，skill-dev stack 是不是一个市场

生态现状（2026-08，来源见 benchmark.md）：Anthropic Agent Skills 规范 2025-12-18 开放（agentskills.io，40+ 客户端）；skills.sh 二十天 50 → 40K，年中 ~670K 条目，安装量是事实上的流行度指标但质量审核很薄；Tessl 2026-02-17 上线 Task Evals（有/无 skill 跑生成场景算 delta），是目前最可信的第三方 eval 工具；Anthropic skill-creator 2026-03-03 加了 Create/Eval/Improve/Benchmark；Claude Code plugin 是分发单元，skill 是内容；学术界 SkillsBench 等在研究 skill 检索歧义和生成。**真实但未定型的部分**："skill dev stack" 作为商业品类目前 = registry + eval CLI，没有主导玩家，尤其没有人做**非代码、有状态、多阶段、带人工 gate 的生产型 skill** 的工具。

这正是这条链十周摸出来的东西，也和 DSH 那篇文章的论点同构——**harness 决定 skill 能不能跑完**。一个 production-class skill 需要的、而 registry 不提供的六样：

1. **状态机 + 产物契约**（package-state、locks、stale 失效）——而不是 prose 里的"检测下一步"表；
2. **gate 晋升纪律**："失败变成脚本，不是一段话"（narration-fidelity、thumbnail guard 是范本）；
3. **golden-package 回归 + eval**：SKILL.md 是 prose，prose 的改动今天零回归保护；
4. **telemetry / 成本账本**：Aaron 分钟、agent 小时、API 单位——没有它"系统化、可复制"无法证明，产品化没有定价基础；
5. **人工停靠点的放置**：停在人真正会改变结果的地方（Argument Lock），并把产物压到一个时段能读完；
6. **taste 与 mechanism 的分离**：profile（声音、taxonomy、策略文件、brand tokens）vs harness（validator、audit、render system）。

**建议的打法**：不追 registry。把这六样在自己这条链上做实（Phase 1–3 就是），每一步按 DSH 系列的"先在自己 stack 落地再写"规则写成文章——这本身就是 build-in-public 的产品验证，而且每篇都有第一手数据。两个季度后用**一个外部 operator**（一个朋友的博客）检验 harness 能不能被别人配置着跑通；通过了，才是 agentskills.io 打包 + plugin marketplace + Tessl evals 的时候。"No.1" 的第一个可测定义：**这条链 Aaron 自己每周跑而不发怵——packages shipped per month**。

## 6. 需要你拍板的决定

这些只有你能答，答案直接改变 Phase 1–3 的顺序：

1. **受众**：YouTube 频道是给英文 operator，还是要吃中文受众（老高/小林说的市场）？每个视频产物都是 EN-only 而 benchmark 是 ZH。这一个答案决定 ZH lane 是第一优先还是永远不做。→ 0.6 的一小时实验先做。
2. **ledger-editorial 是品牌还是过渡？** `video-style-baseline.md:10` 已把它锁成下一部片的 baseline。如果是品牌，目标是 Lemmino/Wendover 式"冷静但在动"，不是老高式密度——请明说。
3. **注意力上限**：一个 essay 级包、一个 film 级包，你各接受多少自己的分钟数？工作流要不要在超出时拒绝继续？6:30 / 23:00 是不是现在真实的两个时段？
4. **08-19 你真正从头读完的产物是哪些**（scorecard、red-team、claim-ledger、head-recheck、director-memo、storyboard）？没读的就是 agent-to-agent 脚手架，候选删除或机器化。
5. **v4 被否的那一刻**：teardown 角度是你一开始就想要的，还是读了 v4 才发现的？前者 Argument Lock 一份 memo 够；后者停靠点需要给你看两个角度。
6. **接下来三篇 DSH（08-26 / 09-02 / 09-09）要不要拍片**，并复用 ledger 代码？Phase 2 只有在"是"的时候才回本。
7. **08-19 的 X / LinkedIn / Facebook / newsletter 草稿手动发了吗？URL 在哪？** 仓库里没有记录，无法归因。
8. **Eleven Music 商业权利确认完成了吗？** 片子已公开。同意在上传时打 synthetic-voice 标记吗？
9. **主 host 是 Codex 还是 Claude Code？** 图片路径有 Codex-only 分支；可移植性只该做一个次要 host，不是四个。
10. **产品化形态**：别人装进自己仓库的 pack（需要 profile 模板 + doctor），还是你替客户跑的服务（需要 telemetry + 成本模型）？它在 CEO 时段里排在 OrgNext 前还是后？如果在后，roadmap 就明写 "Aaron-only 两个季度"。
11. **"先在自己 stack 落地再写"** 是 DSH 系列专属规则，还是 serious 文章的永久法则？它改变 "serious" 的定义。
12. 你要**下一部片同样的样子、一半的成本**，还是**不同的样子、同样的成本**？这个季度只能选一个。

## 7. 证据索引

- [audit-2026-08-22/orchestrator.md](audit-2026-08-22/orchestrator.md) — 23 gate 的逐条覆盖分类、三份 state 真相、artifact contract 漂移、分层缺失
- [audit-2026-08-22/archaeology.md](audit-2026-08-22/archaeology.md) — 08-19 逐小时时间线、返工归因、TTS 3.5×、发布后补写的 gate 产物
- [audit-2026-08-22/writing.md](audit-2026-08-22/writing.md) — 评审产物评的是死稿、scanner 饱和、声音只有禁令没有范例、ZH 在希腊系列回退
- [audit-2026-08-22/images.md](audit-2026-08-22/images.md) — 跨篇无视觉身份、三个竞争 baseline、缩略图不是系统、片头两套身份
- [audit-2026-08-22/video.md](audit-2026-08-22/video.md) — 1,582 行一次性片子、registry 9/16 无实现、57% 静止测量、无 ZH 路径、208 kb/s
- [audit-2026-08-22/distribution.md](audit-2026-08-22/distribution.md) — distribution.json key 错配、0/19 postmortem、next-brief-context 冻结、brand-sales 35 天 no-op、分支错误与编号冲突
- [audit-2026-08-22/skillstack.md](audit-2026-08-22/skillstack.md) — 172 测试全绿但 prose 零回归、tile.json 漂移、多 harness 是 symlink theater、20+ 秘钥无清单
- [audit-2026-08-22/benchmark.md](audit-2026-08-22/benchmark.md) — 8 个频道拆解（老高 / 小Lin / 回形针 / Harris / Kurzgesagt / Wendover / Fireship / Lemmino）、AI 解说频道现状与平台政策、skill 生态现状（带日期与置信度）
- [audit-2026-08-22/critic-pushback.md](audit-2026-08-22/critic-pushback.md) — 对八份审计的反驳、过度工程风险、top 10
- [audit-2026-08-22/critic-completeness.md](audit-2026-08-22/critic-completeness.md) — 审计遗漏：人的时间模型、休眠的战略层、成本、版权、ZH、评估校准、产品化 vs 个人声音
