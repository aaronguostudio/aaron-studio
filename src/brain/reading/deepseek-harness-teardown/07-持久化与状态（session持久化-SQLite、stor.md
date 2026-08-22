# 持久化与状态（session 持久化/SQLite、storage、spill、session-query、identity、settings、credentials、telemetry/成本核算）

这个子系统的核心是一条 append-only 的 SessionEvent 日志作为唯一事实源，配合仓库级不变量"model-visible ⟺ logged"：凡是进过模型请求的内容都必须能从日志重建。持久化是一个 capability seam（抽象 SessionPersistence + JSONL/SQLite 两个可互换后端，共享契约测试套件），其余状态各归其位——非日志数据走 storage、大 tool 输出外溢走 spill、全文检索走可丢弃的派生 SQLite 索引、用户配置走 settings、密钥走 credentials 引用。版本策略是全仓最有辨识度的设计：源数据（session log）对不兼容格式做方向感知的响亮拒绝且预发布期不提供迁移，派生数据（query index）则原地重建；未知事件类型默认拒绝重建，除非事件显式标记 ignorable。成本与缓存被当作持久化问题对待：token usage 直接挂在 assistant/message 事件上随日志落盘，prompt cache 前缀稳定性既有真 API e2e 断言（每个非首请求必须有缓存命中）又有 README 必填申报卡的文档 gate。整体是一套为"agent 大规模维护自身代码库"处境优化的、护栏密度极高的事件溯源架构。

## 双版本正交：容器 schema 版本 vs 内容格式版本，且按数据角色选择拒绝或重建

机制：SQLite 后端有两个互不相干的版本号。SCHEMA_VERSION=15 管表结构，写在 PRAGMA user_version 里，openDatabase 在 BEGIN IMMEDIATE 写锁内同时校验 user_version、application_id（0x44534850，防止误写别人的 SQLite 文件）和用户表计数，任何不匹配直接抛错、绝不原地迁移。SESSION_FORMAT_VERSION=0 管事件词汇和信封结构，存在每个 session 的 header 行里，由抽象层的 sessionFormatVersionRefusal 做方向感知拒绝：版本比本 build 新→报'由更新的 harness 写入，请升级 harness'；比本 build 旧→报'本 build 无升级路径'，并且 SessionFormatUnsupportedError 与 SessionPersistenceCorruptionError 严格分开（数据没坏，只是读不懂）。关键对照：session-query-sqlite 是派生的全文索引，同样的版本不匹配策略却是'reset in place'原地重建——源数据拒绝、派生数据重建，两种策略按数据角色分派而不是一刀切。

证据：packages/session/session-persistence-sqlite/src/schema.ts:20,92-172; packages/core/session/src/types.ts:33-56; packages/session/session-persistence/src/coordinator.ts:36-81; packages/session-query/session-query-sqlite/src/schema.ts:7-8; .agents/notes/implemented/architecture/2026-08-10-session-log-version-mechanism.md

价值：多数系统把'数据库版本'当一个数字管，这里认识到表布局的演进节奏和事件语义的演进节奏完全不同。Agent Note 里的决策更值得学：单调整数、不搞 major/minor（'某一步能否自动升级'是该步 upgrader 是否存在的属性，不该预先编码进版本号形状）；bump 由 writer 决定而非 reader（标准是'旧运行时能否语义完整地读新日志'，'能 parse 不报错'不算）；升级链推迟到第一个真实 v0→v1 出现才写——不为不存在的需求造机器。

## 未知事件默认拒绝（ignorable 标记）：把遗忘的失败模式从静默腐化翻转成吵闹的过度拒绝

机制：事件词汇由挂载了哪些插件决定，单个版本号描述不了，所以版本机制之外补了一个逐事件的信封标记：读取端遇到不认识的 event type 时，除非该事件带 ignorable:true，否则整个日志拒绝重建（SessionFormatUnsupportedError）。已知词汇表 KNOWN_SESSION_EVENT_TYPES 由 gen-persistence-catalog 从所有 SessionEventMap declaration merge 生成，verify-persistence-catalog 在 doc-sync 里保鲜。默认方向是刻意选的：writer 忘记打标记 → 读取端过度拒绝（不便，但可见）；如果默认 ignorable → 同样的疏忽会静默恢复一个被掏空的 session（安全失败）。词汇检查只在读侧：append 时不做，因为 append 时拒绝会让活 session 的持久化中途卡死，代价大于下次加载时的响亮拒绝。

证据：docs/persistence-catalog.md:66-76（信封 ignorable JSDoc）; .agents/notes/implemented/architecture/2026-08-10-session-log-version-mechanism.md（'默认 required'的完整论证与 Alternatives considered）; packages/session/session-persistence/src/coordinator.ts:12（KNOWN_SESSION_EVENT_TYPES 导入）

价值：这是'为失败模式选方向'的教科书案例：两种默认都会有人犯错，设计者显式选择让错误以哪种形态暴露。对任何 event-sourced agent 系统直接可搬——你的 session log 迟早会遇到新旧版本混跑，'不认识就跳过'是最诱人也最危险的默认。

## 崩溃恢复不截断：合成闭合事件保住被打断的 turn，torn tail 以最后一个 turn/end 为界

机制：长任务的单个 turn 可能巨大（多 step、大 tool 输出），崩溃前这些事件已经持久化了，所以恢复策略是补一个合成的 turn/end{reason:'interrupted'}（这是唯一没有任何 loop 会主动发出的 TurnEndReason，天然可辨识）而不是回滚整个 turn。物理层 scanRows 的规则：先找最后一个有效 turn/end，它之前的任何洞（JSON 解析失败、seq 断裂）是已提交区腐化→报错；它之后的洞是从未提交的 torn tail→容忍并在 commitRepair 里用一个事务 DELETE 掉。repair 只对冷 session 生效，活 session 的 load 等待内存快照落盘。批量 append 本身也是单事务：会话行的惰性物化（首次 append 才写 sessions 行，弃用的空 session 零残留）+ 全部事件 INSERT + revision 自增，要么全成要么全滚。

证据：packages/session/session-persistence-sqlite/src/schema.ts:232-270（scanRows）; packages/session/session-persistence-sqlite/src/index.ts:284-338（appendBatch/commitRepair 事务）; docs/subsystems/persistence.md（'Crash recovery preserves an interrupted turn'）

价值：agent 系统的崩溃恢复常见做法是'回滚到最后完整 turn'，这里论证了为什么那是错的：被打断的工作本身就是昂贵的模型输出和 tool 结果，用户恢复 session 时应该看到它。'已提交区的洞是腐化、未提交尾巴的洞是可容忍'这条分界线（以业务事件 turn/end 而非物理标记为界）是可以直接抄的判据。

## spill：大 tool 输出外溢到文件，且'替换文本永不超 cap'是被证明的不变量

机制：spill-policy 挂在 tools/post-execute waterfall 上（prepend + 先 next() 委托，让 hook 的替换结果也被限制）：纯文本结果超过 maxInlineBytes 时，全文存入 session 隔离的本地文件（'wx'+0o600 独占创建防 symlink planting、目录 0700、suggestedName 消毒为单一路径段），模型上下文里换成 head/tail 预览 + locator + 检索提示（'Use read with offset/limit, or grep this path'）——即教模型用自己的工具按需取回。精妙处一：通知文本的字节成本预先从 cap 里扣除，且用最坏情况省略计数的位数做上界，数学上保证'预览+空行+通知'永不超过承诺的 cap；连通知本身超 cap 的极端情形也宁可保留原文不 spill。精妙处二：双 arm——模型面 arm 跳过 read 工具（防 read→spill→read 循环），但持久化日志 arm 照样限制 read 子调用（日志拷贝不进模型上下文，无循环风险，而 read 恰恰是产生巨型日志的工具）。失败语义 best-effort：无 backend、存储失败一律保留原文，spill 失败绝不能把成功的 tool call 变成 isError。

证据：packages/spill/spill-policy/src/index.ts:110-231（两个 arm、cap 预留、best-effort）; packages/spill/spill-local/src/store.ts:99-119（安全创建）; packages/spill/spill-local/src/index.ts:60（retrievalHint）; packages/spill/spill/src/types.ts（SpillLocator 品牌类型、owner/source 分离）

价值：这是'上下文预算是硬约束'的完整工程化：不是 truncate 扔掉数据，而是全量落盘+给模型一个可执行的取回路径。cap 预留计算和'失败不降级为工具错误'这两个细节是大多数自研实现会踩的坑。三个决策注释都写明了 why（为什么跳过 read、为什么日志 arm 不跳、为什么 load 时校验 config），可直接当设计模板。

## credentials 凭据引用：配置面永远只见引用名，值在操作点按分层信任度解析

机制：CredentialRef 是 branded 的 POSIX env-var 名。为什么不直接 process.env.X：(1) resolve 是每操作一次的，契约明文禁止跨操作缓存——换 key 后下一个请求即生效，零重启；(2) describe() 向配置 UI 提供 {configured, source, writable} 而值永不过线；(3) 分层优先级每层有 why：进程环境只读且最高（DEEPSEEK_API_KEY=… dsh 是本次运行的显式意图，改不了所以必须'可见地只读'而非静默遮蔽写入）> $DSH_HOME/.credentials.yaml（产品可写托管层，UI 写的 key 立即生效不被旧 .env 压住）> cwd/.env > $DSH_HOME/.env；(4) set/unset 在引用被只读层 shadow 时直接拒绝——否则'写成功但读出来还是旧值'；(5) 文件 group/other 权限位非零拒绝启动（提示 chmod 600）；(6) 空字符串处处视为未配置，防止空值伪装成密钥。托管文件是严格的 ref→value YAML 而非 dotenv，注释解释了为何不能兼作环境层：会把非密钥条目静默压到不可达。

证据：packages/credentials/credentials/src/index.ts:60-99（resolve/describe/set 契约）; packages/credentials/credentials-local/src/index.ts:1-35（分层及每层理由）、87-122（权限强制）; packages/credentials/credentials/src/types.ts:13（品牌类型）

价值：'配置携带引用而非值'让 settings 序列化、telemetry、日志、UI 全链路结构性地无密钥可漏，而不是靠事后 redact 正则。shadow 拒写和'空值即缺席'是两个几乎所有人都会漏掉但一旦踩坑极难排查的语义。

## 成本核算 = 日志的推论：usage 与消息同事件落盘，辅助调用也各有日志事件

机制：仓库级不变量'model-visible ⟺ logged'（任何进模型请求的内容必须能从 session log 重建）之上，token 核算走同一条路：assistant/message 事件直接携带该 step 的 TokenUsage——'模型输出和它的计账同行，没有独立的 usage 记录'。TokenUsage 三元 disjoint：inputTokens 只含未缓存输入，cacheRead/cacheWrite 单列，计费=三者之和；DeepSeek adapter 负责把 provider 折叠进 prompt_tokens 的缓存命中减出来，归一化跨 provider 语义。主循环之外的每次模型调用也有日志事件：compaction/summary 记 provider/model/maxTokens/usage（'哪个模型写的这段摘要'有持久答案），session/title-llm-request、web/deepseek-search-llm-request 同理。session-stats 是纯折叠 projection，从事件流算 turns/steps/llmMs/toolMs/ttft/decode，并论证了为何用 step/end 而非 assistant/message 计步（后者会多算 max-tokens 空消息、漏算取消的 step）。

证据：docs/persistence-catalog.md:224-236（assistant/message usage）、340-390（compaction/summary 的 model/usage 字段）; packages/llm/llm/src/types.ts:127-141（TokenUsage disjoint 语义）; packages/session/session-stats/src/projection.ts:1-25,105-170

价值：per-run 成本可核算不是加一个 metrics 上报实现的，而是事件溯源架构的免费推论：单一日志既是 replay 源、又是账本、又是缓存行为的观测点。'计账与产物同事件'避免了双写不一致这类 metrics 系统的经典病。

## prompt cache 稳定性是被断言的生产不变量：真 API e2e 测'每个非首请求必有缓存命中'+ README 必填 KV Cache 申报卡

机制：两层强制。运行时层：request-cache.e2e.ts 用真 DeepSeek API 跑一个多 step 工具 turn + 追加 turn，断言除第一个请求外每个 assistant/message 的 usage.cacheReadTokens > 0——因为日志推导的请求让每个后续请求与前驱共享字节级相同前缀，provider 必须报告缓存命中；注释点明 per-step usage 就是缓存行为的生产观测点，'prefix stability is corollary #1'（可重建性的第一推论）。文档层：doc-sync 的 verify-package-readme-model-experience.ts 强制每个包 README 有 '## Model Experience' 段，含三张必填卡 '#### What the model sees' / '#### Token effect' / '#### KV Cache effect'；豁免必须在脚本里登记可审计理由（如'类型级原语，编译期擦除'），缺席不能被误认为遗忘。

证据：packages/core/agent-loop/tests/request-cache.e2e.ts:13-31,88-94; scripts/verify-package-readme-model-experience.ts:13-18,27-44

价值：prompt cache 命中率直接决定 agent 的成本和延迟，但绝大多数框架把它当运气。这里把'谁可能打破前缀'变成 CI 强制的申报义务——任何新插件必须回答'你对 KV cache 有什么影响'——并用真 API 测试把前缀稳定性钉死。这是我见过把缓存当一等工程约束最彻底的做法，两层各自可单独借鉴。

## settings 作为 capability seam：schema 注册 + 三层解析 + 结构化 secret redaction

机制：插件向 ctx.settings 注册 namespace（kebab-case 品牌 id）+ schemastery schema，绑定在插件 fiber 上，fiber 卸载即注销。解析三层：schema defaults < 组合层 base（cordis.yml 子集）< 用户层；组合配置留在 cordis.yml，namespace 只装用户可编辑子集。validate 钩子处理 schema 表达不了的跨字段约束，在产生该值的写入点拒绝（而非存下一个会静默瘫痪 owner 的值）；已注册后外部编辑坏文档则保留 last good value + warn。describe({redactSecrets:true}) 在一切 wire 面强制：role('secret') 字段从值里结构化移除，侧车列出每个 {path, set}，UI 据此渲染 write-only 输入而永不接收密钥——与 credentials 的引用机制形成双保险。watch 回调按提交序串行、失败被包含。applies:'live'|'restart' 只是 UI 徽章提示，不是机制——restart owner 单纯不 watch。

证据：docs/subsystems/settings.md（Registration/Owner scope/Descriptors 节）; packages/settings/settings/src/redact.ts:1-42; packages/settings/settings/src/index.ts

价值：把'设置'建成 capability 的意义：存储 provider 可换（settings-file 只是其一）、设置 UI 从 schema 自动生成、热更新语义统一（每个插件不必自己发明 watch/校验/回滚）。'validate 在写入点拒绝 vs 运行期保留 last good'的两段式失败策略解决了外部可编辑配置文件的经典难题：既不让坏写入成功，也不让外部编辑搞垮运行中的进程。

## source-qualified revision token 与匿名身份的最小化设计

机制：listSnapshots 返回的 revision 是 storeId(库级随机 UUID) + incarnation(session 物化时的随机 UUID) + 单调计数 拼成的不透明品牌字符串，调用方只做相等比较——三段拼接使不同 store 的本地计数器、同 id 重物化的 session 都不可能误判相等，派生读模型（projection cache、query index）据此廉价判断'日志变了没'而不加载全文。身份侧：anonymous-user-id 是 per-$DSH_HOME 的随机 UUID 存为裸文件行，注释明确承诺'绝不从 hostname、网络地址、git remote 等可识别源派生'，删文件即换身份；并发首启用独占创建裁决。telemetry 默认 DISABLED，sharing 状态（full/feedback-only/disabled）必须由 backend 向用户可见面披露。

证据：packages/session/session-persistence-sqlite/src/index.ts:46-49,361-364; packages/identity/anonymous-user-id/src/index.ts:1-17; packages/session/session-telemetry-otel/src/index.ts:44-80; packages/session/session-telemetry/src/index.ts:140-160

价值：revision token 的三段设计防的是分布式系统里最阴的 bug——两个来源的本地计数器碰巧相等。身份设计则展示了隐私姿态如何落到代码承诺：'不从何处派生'写进 JSDoc，默认关闭写进常量。

## tradeoffs
- 事件溯源全量落盘（含 assistant/chunk token 级流）换回放保真与可核算性，代价是日志体积和每事件一行 SQLite 的写放大；spill 只对 tool 结果减负。
- 预发布'拒绝不迁移'姿态把兼容性成本推迟到首个发布，换来当下自由重构；但升级链、writer 端 ignorable 标记等机制只设计未实装，首发前是硬债。
- capability seam 三角（Definition/Provider/Consumer 必须齐全）保证了可替换性和测试面统一，代价是包数爆炸（219 个）与每包固定开销（invariant manifest、README 必填段、tsconfig 引用、双语文档）。
- 写路径 200ms 批处理窗口降低 IO 压力，代价是崩溃窗口内事件可丢，需要 checkpoint-policy 插件在每请求前显式 flush 兜底——durability 语义被拆到两个插件间协作。
- 未知事件默认拒绝保住了语义完整性，代价是 out-of-repo 插件写的事件在第一方读取端无法恢复 session（注册面被显式推迟），预发布期接受响亮拒绝。
- 同进程类型边界不做运行时校验（信任 TypeScript），只在 parser/durable/wire 边界校验——省了大量防御代码，但要求全员严守边界分类纪律，混入一个 any 即破防。

## learnables
- 把 'model-visible ⟺ logged' 定为系统级不变量：模型看到的一切必须能从单一 append-only 日志重建。成本核算、replay、缓存审计、telemetry 镜像全部变成推论而非独立子系统——这是本子系统最值得整体搬走的一条。
- 为失败模式选方向并写下理由：未知事件默认拒绝（吵闹的过度拒绝 > 静默的数据丢失）、spill 失败保留原文（绝不把成功调用变错误）、settings 坏编辑保留 last good value。每处都问'这个疏忽会以什么形态暴露'。
- 版本策略按数据角色分派：源数据（session log）拒绝不兼容格式且报错要有方向感（'升级 harness' vs '无升级路径'），派生数据（全文索引、projection cache）直接原地重建。给两类数据不同的 SCHEMA_VERSION 常量和不同的失败行为。
- 把 prompt cache 稳定性做成可断言的东西：一个真 API e2e 断言'非首请求 cacheReadTokens > 0'成本极低，却能抓住任何打破前缀字节稳定性的回归（时间戳进 system prompt、工具列表顺序抖动等经典事故）。
- 大 tool 输出外溢而非截断：全文落盘 + 模型面替换为预览+locator+'用 read/grep 取回'的提示，让模型自己决定要不要回读。实现时记住两个细节：通知的字节成本要预留在 cap 内；跳过 read 工具防自循环。
- 配置携带凭据引用（env-var 名）而非值，值在每次操作时解析：换 key 零重启生效、UI/日志/序列化结构性无密钥、被只读层 shadow 时拒绝写入。
- 崩溃恢复用合成闭合事件（turn/end{interrupted}）而不是截断，以'最后一个业务级提交边界（turn/end）'区分已提交区腐化与可容忍的 torn tail。
- usage 挂在产物事件上而非独立 metrics 流，辅助模型调用（摘要、标题、搜索）也各发日志事件——单一账本，无双写不一致。
- 跨来源比较的变更 token 用 '来源身份+物化身份+单调计数' 三段拼接的不透明字符串，杜绝本地计数器跨库误等。

## questionable
- 粒度对小团队不成立：spill 一个功能拆 3 个包（Definition/Provider/Consumer），settings、credentials、storage 同构，全仓 219 包。capability seam 三角在只有一个 provider 时是纯开销——他们自己的 packages/AGENTS.md 都承认'只有一个内部调用者的公共服务方法'是坏味道，但大量 seam 当前恰好只有一个 provider。这个结构只在'预期 provider 会被替换（本地/E2B/远端）且由 agent 大规模并行维护'的 DeepSeek 处境下摊销得起。
- 'backend 拒绝旧格式、无迁移'的预发布姿态只在零外部用户时成立，CLAUDE.md 也明说首个 tag 发布即删除该节。照搬这条到已有用户的产品是事故；真正可搬的是它的发布前准备（方向感知报错、ignorable 标记、推迟但已设计好的升级链），而非拒绝本身。
- 护栏基建的规模是 DeepSeek 特有的：per-file 100% 覆盖率 gate、每包 invariant manifest、README 必填 Model Experience 卡、生成式目录 + verify-* 保鲜、双语文档、Agent Notes 制度。这套东西的真实客户是维护仓库的 agent（防 agent 犯错的机器可读护栏），人肉小团队照搬会被 gate 淹死——学它的'把约束做成可执行检查'的方向，别抄它的密度。
- assistant/chunk token 级全量落盘换取回放保真，长 session 日志体积可观；spill 只救 tool 结果不救 chunk 流。写批处理默认 200ms 窗口意味着崩溃可丢最近约 200ms 事件（靠 checkpoint-policy 在每个请求前 flush 兜底）——这些取舍在他们的桌面/单机场景成立，高吞吐服务端场景需重新评估。
- JSONL 与 SQLite 双持久化后端并行维护 + 共享契约测试套件：对多数团队是双倍表面积，一个后端加导出命令足矣；它在这里成立是因为两后端各服务一个真实产品面（JSONL 供人类可读/工具互操作，SQLite 供查询）。
- node:sqlite（Node ^22.19||>=24）是激进的运行时下注，好处是零原生依赖，代价是版本地板极高；telemetry 默认 DISABLED 是隐私正确的选择，但意味着产品默认零可观测性，商业产品需要自己重新权衡。