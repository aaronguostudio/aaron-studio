# 工程过程资产：Agent Notes 制度、postmortem、skills、双语文档流水线、prose 标准

这个子系统不是代码，而是一套为"AI agent 是主要作者和主要读者"而设计的知识管理制度。它解决的核心问题是：LLM 编码 session 没有持久记忆，会反复重新提出已被否决的方案、重新踩已修复的坑、并在 prose 里留下推理残渣。DeepSeek 的答案是把决策上下文外置为文件系统里的结构化记录（683 篇 Agent Notes，lifecycle 和 class 双轴编码在路径中），把失败教训固化为机器可执行的 gate（4 篇 postmortem 每篇都以新 verifier/test 收尾），把反复教的 review 规则打包为 11 个可加载的 skill，并用 git blob hash 配对机制维持全语料中英双语同步。64 天 12293 次提交（日均约 192 次）说明产码主体是 agent，而整套制度的一致取向是：机器可检查性优先于人类阅读友好性——所有引用必须是相对 markdown 链接、所有格式由 verify-* 脚本裁决、所有"确认一致"的动作都留下可 diff 的哈希记录。

## Agent Note 三态生命周期 + rejected 作为"防谬误重犯"的一等公民

机制：每篇 note 的路径编码两个轴：{lifecycle}/{class}/yyyy-mm-dd-topic.md，lifecycle 为 proposed/implemented/rejected（外加冻结的 archived），class 为封闭六类（feature/bug-fix/simplification/architecture/process/testing，由 scripts/agent-note-tree.ts 持有封闭集合，gate 拒绝其他目录）。非平凡改动必须在同一 PR 附带或更新一篇 note（.agents/notes/README.md:46），这把决策记录从异步债务变成合并前置条件。rejected note 的保留标准极其明确："只在其 rationale 能阻止一个诱人的、有意义的错误时保留，否则删除完整三件套"（README.md:14）。格式由 94 行的 scripts/verify-agent-note-format.ts 机器裁决：头三行固定、Status 与所在目录交叉校验、implemented note 中出现 ## Proposal / ## Acceptance criteria 等 spec-speak 直接 gate 红（README.md:103）、Alternatives considered 一节强制存在（README.md:111，理由写得很透："没有记录它击败了什么的决策，是在邀请重新诉讼"）。

证据：/Users/aaronguo/Work/lab/deepseek-harness/.agents/notes/README.md:14,46,103,111; /Users/aaronguo/Work/lab/deepseek-harness/scripts/verify-agent-note-format.ts; /Users/aaronguo/Work/lab/deepseek-harness/scripts/agent-note-tree.ts

价值：这直接命中 AI 编码最贵的失效模式——上下文不跨 session 持久。一个新 agent session 最容易犯的错不是写错代码，而是重新提出三周前已被充分论证否决的"简化"。rejected/ 目录就是给未来 agent 的免疫系统。代表作是 2026-07-26-dependency-swaps-rejected-by-nih-audit.md：一次全仓 NIH 审计把约 30 个"看起来该换成现成依赖"的否决判词冻结在一篇里，status 行写明"未来重提任何一项必须击败其记录的理由，而不是重新引用政策"（该文件第 3 行），并且逐项给出定量证据（如 vscode-jsonrpc 只能替代约 1800 行中的 255 行、且是 ESM 仓库里的 CJS 包）。其 Alternatives considered 还解释了为何不一项一篇（30 篇仪式性文件 vs 共享一个证据标准，第 77 行）——制度本身也在做成本权衡。

## archived 冻结区：针对 agent 检索行为设计的"历史隔离"

机制：implemented note 的义务是与 shipped reality 保持同步（路径、符号、默认值改了必须同 PR 更新），这是持续维护税。当一个决策不再指导未来工作时，整个三件套移入 archived/{class}/ 并永久冻结：verify-archived-agent-notes.ts 用 append-only 的 SHA-256 内容清单密封每个文件，--write 模式先证明所有既有密封未变才允许追加；所有演进中的文档 gate（格式、翻译、链接、换行）跳过 archive，使未来的规则变化不会产生"改写历史"的压力。最关键的一手：根 .rgignore 把 archive 排除出默认搜索——理由明确写在 Alternatives 里："归档事实可能刻意过时，且可能在词面匹配上压过现行结果"（frozen-agent-note-archive.md:33）。同理，他们否决了生成式 INDEX.md（2026-07-19-remove-generated-agent-note-index.md）：中心化索引是可预测的合并热点，路径+文件名+H1 已编码全部索引信息，"文件系统树就是清单"。

证据：/Users/aaronguo/Work/lab/deepseek-harness/.agents/notes/implemented/process/2026-07-26-frozen-agent-note-archive.md:17,21,33; /Users/aaronguo/Work/lab/deepseek-harness/scripts/verify-archived-agent-notes.ts; /Users/aaronguo/Work/lab/deepseek-harness/.agents/notes/implemented/process/2026-07-19-remove-generated-agent-note-index.md

价值：这是我见过的第一个明确针对"agent 用 grep 检索仓库"这一行为模式设计的知识衰减机制。人类文档系统靠读者判断力过滤过时信息；agent 没有这个判断力，过时的 note 在 ripgrep 结果里和现行权威长得一模一样。用 .rgignore 做检索隔离、用内容哈希密封防篡改、用 gate 豁免防止规则演进腐蚀历史——三件事共同定义了"冻结"的操作语义，而不是靠一句"请勿引用旧文档"的口头约定。

## postmortem 的产出物是 gate，不是教训清单

机制：四篇 postmortem 各自的因果链与固化物：(1) 0001：ACP 插件多写了一行 export default，Cordis Loader 的 unwrapExports 优先取 .default，把携带 inject/name 的模块命名空间整个丢弃，178 个绿色单测和 100% 行覆盖全部失守，因为所有测试都手工挂载插件（ctx.plugin({...})）从未走真实 Loader 路径；第二个 bug（shadow fiber walk 的 ancestor-only 服务解析）被第一个 bug 的同一错误字符串掩盖。固化：keyless 真 Loader e2e（验证过恢复 bug 后测试确实变红）+ testing.md 规则"test the real entry path"。最锋利的教训在第 113 行："Trust the trace, not the theory"——优雅的 shadow 理论是真的，但它是第二个 bug；数小时的合理推理输给了几分钟的 fiber-walk console.error。(2) 0002：!!js 表达式只在插件 config 字段求值，disabled 字段拿到的是 truthy 的表达式对象，文件系统工具被永久禁用；snapshot refresh 把 UNKNOWN_TOOL 错误录成了新的期望输出。教训（第 46 行）："snapshot refresh 是 fixture 生产，不是正确性审查"。固化：verify-cordis-config 静态拒绝 entry metadata 里的表达式节点 + snapshot 工具拒绝 UNKNOWN_TOOL 进 fixture。(3) 0003：web agent 改了 GUI 源码却不知道自己的 session 跑在哪个 URL/进程上，先把 bare Vite 的 HTTP 200 当成功（页面实际白屏），再起了一个 3334 端口的替身服务器去验证，而用户的 3081 页面早已自己更新。固化：把 canonical URL 和运行模式做成 model-visible 的 prompt section + $DSH_WEB_URL/$DSH_WEB_MODE 环境变量——把"agent 该知道什么"当成产品接口设计。证据链全部用持久化 session log 的 event sequence 编号（30939、31865、34309…）而非事后叙述重构。(4) 0004：Landlock 部分实施的提示行与致命错误共享 landlock-run: 前缀，harness 用单一子串+非零退出码做归因，ripgrep 的 exit 1（正常的无匹配）被误报为 SANDBOX_UNAVAILABLE。教训（第 52 行）："进程归因需要多重独立证据的合取；共享前缀不是协议"。固化：RunnerFailureRule 结构化规则（退出码约束+精确 informational 排除）+ keyless assembled snapshot。postmortem README 定义了写作门槛三条件：subtle（机制非显然）+ systemic（逃逸原因是流程缺口）+ costly to rediscover。

证据：/Users/aaronguo/Work/lab/deepseek-harness/docs/postmortem/0001-acp-default-export-drops-inject.md:93-98,104,113; /Users/aaronguo/Work/lab/deepseek-harness/docs/postmortem/0002-js-expression-disabled-filesystem-tools.md:40-46; /Users/aaronguo/Work/lab/deepseek-harness/docs/postmortem/0003-web-agent-gui-feedback-loop.md:17,42; /Users/aaronguo/Work/lab/deepseek-harness/docs/postmortem/0004-landlock-partial-notice-misclassified-child-failures.md:43-48,52; /Users/aaronguo/Work/lab/deepseek-harness/docs/postmortem/README.md:9

价值：四篇有一个共同结构值得注意：Guardrails 一节里没有一条是"下次注意"式的行为规范，每条都是机器可执行物（一个新 verifier、一个证明过会变红的测试、一条进 AGENTS.md 的 standing order）。且其中两篇（0001、0003）的根因本质上是"agent 的世界模型与运行时现实脱节"——修复方式不是教育 agent，而是把缺失的运行时事实注入 model-visible 上下文。这是把 postmortem 制度从人类组织移植到 AI 开发时最重要的适配。

## 双语配对：git blob hash 做段落级同步契约 + word budget 防膨胀

机制：每个 in-scope 文档是三件套：foo.md、foo.zh.md、foo.i18n.yaml。yaml 记录两侧最后一次"确认一致"时的 git blob hash（刻意不用 commit hash——blob hash 可对同 PR 内未提交的工作树内容用 git hash-object 计算，使一致性成为纯内容比较；docs/i18n/README.md:18）。改任一侧而不重新确认，CI 即红；--write 会把快照 blob pin 在 refs/dsh/translation-pairing/snapshots/ 下防 GC，于是记录的哈希永远能恢复"上次确认的原文"，使得失同步的修复方式是"按编辑侧的 diff 最小化 patch 对侧"，而非整篇重翻。结构签名（标题深度与顺序、表格行列数、列表种类与项数、代码块字节级一致、链接目标）由 gate 机器比对；甚至有自定义 git merge driver 处理两个分支各自合法确认过同一 pair 的合并（README.md:20）。文档诚实声明了 gate 的极限（README.md:40）："绿色只证明这对内容曾被确认一致，不证明确认本身是对的"——机器管结构，review 管语义。word budget 由 scripts/doc-budgets.manifest.json 给每篇 standing doc 定词数天花板（根 AGENTS.md 1900、docs/AGENTS.md 1320 等），gate 红时的处置顺序固定：先 relocate（内容搬去它的 tier）、再 condense、最后才 raise（须在 PR 里论证清单 diff）；"ceiling 是护栏不是缩减目标"，配合 tier 表格的"one home per fact"（每个事实只有一个家，别处只放链接，docs/AGENTS.md:17）与 slop checklist（docs/AGENTS.md:59-71，猎杀重复陈述、叙事历史、状态标注、强调通胀）。

证据：/Users/aaronguo/Work/lab/deepseek-harness/docs/i18n/README.md:11-22,40; /Users/aaronguo/Work/lab/deepseek-harness/scripts/verify-translation-pairing.ts; /Users/aaronguo/Work/lab/deepseek-harness/scripts/doc-budgets.manifest.json; /Users/aaronguo/Work/lab/deepseek-harness/docs/AGENTS.md:17,47-57,59-71

价值：blob-hash 配对是一个通用模式，翻译只是它的一个实例：任何"两个必须一起演进的 artifact"（代码↔文档、schema↔生成类型、prompt↔snapshot）都能用"记录上次确认一致时的内容哈希 + CI 校验漂移 + 确认动作本身是可 review 的 diff"来治理。word budget 则是对 AI 时代文档特有病的对症药：LLM 生成 prose 的边际成本趋零，文档膨胀从人类时代的"懒得写"翻转为"写太多"，词数天花板把稀缺资源从写作时间正确地重定义为读者（包括未来 agent 的 context window）注意力。

## dsh-trim-cot-leakage：承认并工程化对抗"AI 写作残渣"

机制：11 个 .agents/skills 里最能说明开发形态的一个：专门定义了"chain-of-thought leakage"这个缺陷类别——视角停留在写作 session 而非仓库的 prose：引用只有那个 session 能看到的 artifact（"(decision 7)"、"audit C2"、未提交草稿的 §4）、叙述变更而非状态（"used to"、"this cut"）、对早已离场的 reviewer 辩护（"the cast is safe because…"）。裁决标准是一个测试（SKILL.md:12）："一个在 HEAD 上、看不到任何 session 记录/PR 讨论/草稿的读者，能否解析每个引用、验证每个断言？"配套八类 taxonomy、防过度矫正的 keep 规则清单（issue 引用、抑制说明、测量数据、反事实回归 pin 都不是 leakage），以及 fix owner-first 的流程（先改生成源再重新生成）。

证据：/Users/aaronguo/Work/lab/deepseek-harness/.agents/skills/dsh-trim-cot-leakage/SKILL.md:8,12,16-23,27-37; /Users/aaronguo/Work/lab/deepseek-harness/.agents/skills/dsh-prose-standard/SKILL.md:30-42

价值：这个 skill 的存在本身就是最有力的实证：当 agent 产码到日均近 200 commits 的规模，AI prose 污染真实到需要一个带 taxonomy、recall battery 和过度矫正陷阱清单的专用工具来治理。配套的 dsh-prose-standard 提出了"complete proposition"规则（删改前枚举段落里每个命题的 actor/条件/情态/负向保证，全部存活才许删）——这是给"让 AI 精简文档"这类任务的安全带，直接可移植。

## tradeoffs
- 写作税成倍放大：每篇 note/文档是三件套（英文+中文+哈希记录），且结构必须镜像到表格行列数和代码块字节级；683 篇 note × 双语 × implemented note 须与 shipped reality 持续同步——这个维护义务只有在"写作者也是 agent、token 近乎免费"的前提下才付得起。制度隐含的经济学假设是：人类 review 时间是唯一稀缺资源，agent 劳动力无限。
- Gate 数量爆炸：scripts/ 下仅文档相关就有近 30 个 verify-*/translation-* 脚本（格式、分类、归档密封、配对、链接、换行、词数预算、prompt 渲染……），doc-sync 是一个 gate 全家桶。每个 gate 都有自己的豁免清单和 manifest，规则系统本身成为需要理解成本的子系统——根 AGENTS.md 里相当篇幅在解释规则的元规则。
- "确认一致"与"实际一致"的缺口被诚实声明但依然存在：翻译 gate 只验哈希和结构，语义一致性靠 review；同理，AI 生成的 Agent Note 可能格式完全合规但内容空洞（他们用 slop checklist 对抗，但这是持续的猫鼠游戏，且 checklist 的执行者往往也是 AI）。
- postmortem 的 guardrail 全部机器化有一个副作用：每次事故都让 gate 森林更密。0002 之后多了 verify-cordis-config，0004 之后多了结构化 RunnerFailureRule——单看每条都对，累积起来是新贡献者（无论人还是 agent）面对的规则总量单调递增，没有看到对称的"gate 退役"机制（notes 有 archive，gates 没有）。
- rejected note 的"保留到不再防谬误为止然后删除"依赖主观判断且删除即永久（三件套一起删，git history 是唯一副本）——与 archived 的密封保存形成刻意的不对称，赌的是"不再诱人的谬误不会再诱人"，这个赌未必总赢。

## learnables
- 立刻可抄且几乎零成本：建一个 rejected/ 目录，每次否决一个方案就写三行——status 行一句话判词 + 问题 + 为什么输。关键规则照抄 DeepSeek 的两条：判词必须让"未来重提者击败记录的理由而非重新引用政策"；不再能防止诱人错误的 rejected note 直接删除。这是对抗 AI（和新人）重提旧方案的最高性价比工具。
- 把"非平凡改动必须同 PR 附决策记录"做成 merge 门槛而不是事后补文档的号召。配一个几十行的格式校验脚本（状态与目录交叉校验、implemented 禁 spec-speak、Alternatives considered 强制）就够——DeepSeek 的 verify-agent-note-format.ts 只有 94 行。
- postmortem 三门槛照抄：subtle + systemic + costly to rediscover 才值得写；且每条 guardrail 必须是机器可执行物（gate/test/rule），并验证"恢复 bug 后测试确实变红"（0001 明确做了这一步）。两条可直接进团队守则的教训："信 trace 不信理论"（先加一行打印再构建优雅解释）、"snapshot refresh 是 fixture 生产不是正确性审查"（刷新快照前先有独立于期望输出的语义断言）。
- agent 的运行时事实是产品接口：0003 的修复方式——把 canonical URL 和运行模式注入 model-visible 的 prompt section 和环境变量——是通用模式。每次 agent 犯"世界模型与现实脱节"的错，先问"缺的事实能不能变成结构化上下文注入"，而不是在 prompt 里加一句告诫。
- blob-hash 配对机制可泛化到任何"必须同步演进的双 artifact"：i18n.yaml 记两侧内容哈希、CI 校验漂移、重新确认的动作本身是一个可 review 的 yaml diff。比"记得同时更新 X"的口头约定强一个数量级，实现只需 git hash-object。
- 给 standing 文档定词数天花板（一个 JSON manifest + 一个 wc 脚本），gate 红时的处置顺序固化为 relocate → condense → raise-with-justification。AI 时代文档的默认失效方向是膨胀而非缺失，词数预算是最简单的反向压力。
- 为 AI 检索设计知识衰减：过时但保留的文档要主动从默认搜索里隔离（.rgignore/明确的 archived 路径），因为 agent 不具备人类"这文档看着旧"的直觉，词面匹配会把冻结的历史当现行权威。

## questionable
- 双语全语料配对只在 DeepSeek 的处境下成立：中国公司、中英双语的内外受众、且有近乎免费的 agent 劳动力做翻译维护。小团队照抄是纯开销——但其底层的 blob-hash 配对机制值得剥离出来单独抄。
- 683 篇 note / 64 天 ≈ 每天 10 篇的产出节奏，说明 note 主要由 agent 撰写。小团队引入这套制度时要警惕通胀的方向盘：制度价值在于"决策被记录且可检索"，不在于篇数；人手写团队应该把门槛调高（比如只记"曾引起争论或可能被重提"的决策），否则合规负担会杀死制度本身。
- archived 的 SHA-256 append-only 密封清单对小团队是过度设计——git history 本身已是不可变记录，一个"此目录只读"的约定加简单 CI 检查就够。DeepSeek 需要密封是因为改写历史的主体是不知疲倦的 agent，它们会"好心地"把旧文档改到符合新规范。
- 封闭的六类 class 分类法和 gate 强制，价值存疑：分类的边际收益（浏览时按类过滤）远小于路径迁移和分类争议的成本；他们自己也承认 refactor 类被删是因为与 simplification 重叠。小团队用扁平目录 + 文件名日期即可。
- 词数预算的具体数字（1900/1320/600…）没有原理只有裁量，且需要一个有权威的人裁决 raise 请求——这在 DeepSeek 有效是因为有明确的 repo owner（第一作者占 43% 提交）；共识驱动的团队里这类 gate 容易变成扯皮点。
- 整套制度尚未经历过"暴涨之后的长期维护期"考验：仓库只有 64 天历史，pre-release 阶段明确写着不做兼容承诺。implemented note 与现实持续同步的义务、gate 森林的累积成本，在两年尺度上是否可持续，目前没有证据。