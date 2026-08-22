# 会话日志作为单一事实源（append-only 事件日志、model-visible⟺logged 不变量、压缩）

DeepSeek Harness 把一个 agent 会话的全部历史建成一条 append-only 的类型化事件日志（SessionEvent，seq 严格连续），模型看到的消息数组不是独立存储的状态，而是日志的一种投影：三类"产消息"事件通过 surfaceOp 标记维护一个有序 surface，deriveMessages() 对其折叠得到 LLM 上下文。同一条日志同时喂养五类消费者——模型上下文推导、UI 转录回放、fork/resume、telemetry、持久化——各自用不同的折叠规则读同一份字节。架构口号"model-visible means logged"（任何到达模型请求的内容必须可从日志重建）不是纸面约定，而是由一个 prepend 的运行时断言在每次 LLM 请求前逐字节验证。压缩（compaction）不删除任何历史：摘要作为一条普通 user/message 以 surface replace 操作遮蔽旧区间，原始事件永久留在日志里。向前兼容靠一个单调整数 SESSION_FORMAT_VERSION（只管结构变化）加逐事件 ignorable 标记（管词汇表增长）的双轨机制，默认语义是"读到不认识的必需事件就拒绝重建"。这套设计将事件溯源（event sourcing）在 agent 运行时场景做到了教科书级完整度，代价是不小的机制复杂度和存储开销。

## 日志 + surface 双层结构：append-only 的日志，可变的是投影

机制：日志本体永远只追加（seq = log.length 连续性契约），但每个产生消息的事件（仅 user/message、assistant/message、tool/result 三种 SurfaceEventType）必须在 append 时声明 surfaceOp：'append'（接到尾部）或 {op:'replace', start, end}（遮蔽一段现有 surface 节点）。surface 是一个有序的 seq 数组，模型上下文 deriveMessages() 只对 surface 节点逐个应用纯函数 deriveEventMessage() 折叠得到。也就是说：'发生过什么'（log）和'模型现在看到什么'（surface）被拆成两个正交概念，压缩、剪枝等所有'改写历史'的操作都变成 surface 层的 replace，日志层零删除。replace 事件还被强制要求 sourceEventSeqs 完整列出所有被遮蔽节点（assertProvenance），形成可审计的引用链。

证据：/Users/aaronguo/Work/lab/deepseek-harness/packages/core/session/src/surface.ts:15-19,83-114,211-243,387-395; /Users/aaronguo/Work/lab/deepseek-harness/packages/core/session/src/index.ts:726-747; /Users/aaronguo/Work/lab/deepseek-harness/docs/subsystems/session.md

价值：这是整个子系统最核心的一步抽象。常见做法是直接改 message 数组（丢历史）或复制一份归档（双写漂移）。这里把'改写'表达为带出处引用的日志事件，一份数据同时满足模型视图（surface 折叠）、人类转录（isAppendSurfaceEvent 只读 append 起源事件，用户已看过的对话不会被压缩抹掉，surface.ts:51-55）、审计（replacements 历史）三种互相矛盾的需求。

## "model-visible ⟺ logged" 靠运行时断言守住，不是靠纪律

机制：agent-loop 的 invariant 伴生插件在 llm/stream 事件上以 {global: true, prepend: true} 注册 waterfall 监听器（prepend 防止某个短路的 replay 监听器把检查挡掉）。对每个 loop 构建的请求：取出 sessionId 对应的活 session，用 JSON.stringify(options.messages) !== JSON.stringify(session.deriveMessages()) 判定实际发给模型的消息数组是否与'从日志重新推导'的结果逐字节一致，不一致即报 'log-reconstruction desync'；同时把 model/system/temperature/maxTokens/stop/tools 与 foldRequestHeader(events)（日志中最新 request/header 快照）逐字段比对。生产路径 agent.ts:341 与断言各自独立调用 deriveMessages()，共享同一个纯函数 deriveEventMessage，因此缓存实现和断言不可能'一起错'到互相掩盖。

证据：/Users/aaronguo/Work/lab/deepseek-harness/packages/core/agent-loop/src/invariant.ts:21-54（消息比对在 39-42 行，header 比对在 44-52 行）; /Users/aaronguo/Work/lab/deepseek-harness/packages/core/agent-loop/src/agent.ts:341; /Users/aaronguo/Work/lab/deepseek-harness/docs/architecture.md:92-96

价值："上下文必须可从日志重建"这类不变量在多数系统里只是文档约定，任何插件悄悄往请求里塞一段文本就默默破坏了 resume/replay。这里把它变成每次真实请求上的机械检查：违规在开发期第一次请求就炸，而不是三个月后某个用户 resume 出一个'缺了一半上下文'的会话。这是'架构约定可执行化'的教科书案例。

## append 即校验点：一次递归遍历完成 JSON 校验、快照、深冻结

机制：Session.append() 在事件进日志前完成全部把关：snapshotJsonValue 用一次递归遍历同时读取、校验（拒绝 BigInt/undefined/循环引用/Date/Map 等一切非无损 JSON）并复制每个嵌套值——单遍设计明确防御'有状态 getter 给校验一个值、给存储另一个值'；然后 deepFreeze 整个事件，surfaceManager.validateNext() 预检 surface 转移合法性；监听器快照在 log.push 之前解析、在 push 之后调用且逐个 contain 失败，并有重入保护。返回给调用者的是进入日志的那份快照而非调用者仍可变的原对象。

证据：/Users/aaronguo/Work/lab/deepseek-harness/packages/core/session/src/index.ts:604-655（校验 614-622，冻结+预检 627-634，commit 点 643）

价值：因为日志是唯一事实源，坏事件的失败点必须在 append 现场（有调用栈、可归因），而不是几秒后持久化 flush 时（只剩'序列化失败'）。深冻结让'通过投影改写历史'在 JS 层面不可表达——deriveMessages 的缓存因此可以直接共享事件内嵌对象，省掉第二次深拷贝。这是'把不变量前移到提交点'的完整示范。

## 版本机制：一个单调整数管结构，per-event ignorable 管词汇表

机制：两轨分治。结构轨：SESSION_FORMAT_VERSION 是单个单调整数（types.ts:56，当前 0），只有结构性变化（事件信封、surface 机制、核心语义）才 bump，由写方决定；读侧按方向处理——更新的版本直接拒绝并明说'由更新的 harness 写入，请升级'（SessionFormatUnsupportedError，与 corruption 错误刻意区分：数据没坏，raw log 路径仍给用户），更旧的走 n→n+1 升级链且只在真正续写时落盘。词汇轨：普通新增事件类型永不 bump 版本，读方遇到不认识的类型时，除非事件信封带 ignorable:true，否则拒绝重建整个会话——默认值是 required，因为忘写标记只会'过度拒绝'（不便），而默认可忽略会'静默 resume 一个被掏空的会话'（安全故障）。已知类型清单 KNOWN_SESSION_EVENT_TYPES 由脚本从所有 SessionEventMap merge 生成并有 gate 保鲜；该守卫只在读侧（load）执行，append 不查——append 时拒绝会卡死活会话的持久化。

证据：/Users/aaronguo/Work/lab/deepseek-harness/packages/core/session/src/types.ts:56,422; /Users/aaronguo/Work/lab/deepseek-harness/packages/session/session-persistence/src/coordinator.ts:55-81,1063-1064; /Users/aaronguo/Work/lab/deepseek-harness/packages/core/session/src/known-event-types.ts:19; /Users/aaronguo/Work/lab/deepseek-harness/.agents/notes/implemented/architecture/2026-08-10-session-log-version-mechanism.md

价值：两个洞察值得单独记：(1) '首个发布的读取器是所有后续决策的地板'——旧运行时缺失的拒绝行为永远补不上，所以拒绝语义必须先于任何实际格式演进发船；(2) 拒绝 major/minor 的理由——'这一步可否自动升级'是每一步升级器存在与否的属性，设计时预先承诺进数字里几乎必然承诺错。Agent Note 里连被否掉的方案（默认可忽略、看即迁移、按插件运行时注册）都写了否决理由，这份决策记录本身就是可借鉴的工程实践。

## 压缩 = 带锁事务 + surface replace，原文一个字节不删

机制：compaction-basic 的完整序列：先 append 日志级锁 compaction/start（region.ts:189），再跑摘要 LLM 调用，然后 append 纯记录性的 compaction/summary（含 summary、被遮蔽 seq 集、token 计数、以及摘要调用自己的 provider/model/rawOutput——连压缩请求本身都可从日志重建），紧接着 append 一条普通 user/message 携带 surfaceOp:{op:'replace',start,end} 完成真正的上下文替换（region.ts:462-465，sourceEventSeqs 必须引用 start 事件、summary 事件和全部被遮蔽节点），最后才 append compaction/end 释放锁。锁最后释放使崩溃在中途留下'孤儿 start'这种可检测状态，而不是一个谎称完成的 end；孤儿锁是上一个生命周期的残留还是当前活操作，由 session/end-seed 边界事件区分。compaction/* 三个事件全部 log-only，不扩展 SurfaceEventType——摘要复用 user/message 进入 surface，模型可见面保持只有三种消息事件。

证据：/Users/aaronguo/Work/lab/deepseek-harness/packages/compaction/compaction-basic/src/region.ts:189,215-223,447-465; /Users/aaronguo/Work/lab/deepseek-harness/docs/subsystems/compaction.md:11-21

价值：不删原文换来的东西是具体的：人类转录完整（用户看过的对话不消失）、'模型在第 N 步到底看到了什么'永远可回答（调 agent bug 的刚需）、token 记账不断链、压缩本身可审计可重放。把'摘要内容'（log-only 事件）和'上下文变更'（surface replace）拆成两个事件，还让失败的压缩尝试也留下完整记录（changed/summary 失败不动 surface 但照样落日志）。

## 一份日志、多个消费者，各自持独立游标

机制：五种读法各有明确的读取协议：(1) 模型上下文——deriveMessages() 增量缓存，replaceGeneration 变化才整体重建，O(新节点)；(2) 人类转录——只读 isAppendSurfaceEvent 过滤的 append 起源事件，与模型面刻意分叉；(3) fork/resume——SessionStore.fork 取稳定前缀做 seed，边界不许落在开着的 turn 内，session/end-seed 事件是 seed 与活写入的持久分界；(4) telemetry——采纳 session 时从 firstLiveSeq 起重放日志充当错过的发布流（coordinator.ts:139：'日志重放是发布的替代品'），token 级 assistant/chunk 保证重放保真；(5) 持久化——订阅 session/event 异步缓冲、session/flush 做检查点，chunk 必须入库（seq 连续性禁止过滤），但 JSONL 后端可把 delta-chunk run 打包成存储行——存储编码自由，只要 load 还原逐字节相同的事件。另有 session-projection 提供 init/apply/view 三纯函数的投影注册表，框架统一驱动、缓存水位、通知变更。

证据：/Users/aaronguo/Work/lab/deepseek-harness/packages/session/session-telemetry/src/coordinator.ts:139,155; /Users/aaronguo/Work/lab/deepseek-harness/packages/session/session-projection/src/index.ts:1-60; /Users/aaronguo/Work/lab/deepseek-harness/packages/session/session-persistence-jsonl/src/format.ts:221-222; /Users/aaronguo/Work/lab/deepseek-harness/docs/subsystems/session.md

价值：事件溯源的经典收益在 agent 场景被兑现得很完整：新读法（标题生成、统计、OTel）不需要核心配合，订阅同一条流即可。projection 注册表里'状态事件必须携带完整变更后状态、绝不发裸 delta'（whole-value event rule）和'不关心的事件必须返回同一引用'这两条规则，是把事件溯源做得可维护的关键细节。

## tradeoffs
- 每个模型可见的新输入都必须先设计一个持久化事件（扩展 SessionEventMap、定义 surface 行为、过 JSON 可序列化关卡）——功能开发的'仪式成本'显著高于直接改 message 数组；换来的是任何请求都可从日志+代码重建。
- 读路径没有'免费的数组'：所有消费者都必须实现或复用折叠逻辑（surface fold、header fold、投影 apply），为把读做成 O(增量) 又催生了一整层增量缓存机器（derived cache、headerFold、SurfaceManager 的 pending plan），这些代码在朴素方案里根本不存在。
- 正典日志必须无损保留每个 assistant/chunk（seq 连续性契约不许过滤），逐 token 回放保真直接换存储体积和 append 频率；JSONL 后端只能靠'打包 chunk 行'的存储编码缓解，SQLite 后端同理。
- 压缩不回收任何存储：surface replace 之后日志反而更长（原文+摘要+三个记录事件），长会话的磁盘与加载成本单调上涨，只省模型上下文 token，不省任何本地资源。
- 深冻结+单遍 JSON 校验发生在每次 append 的热路径上；同步发布模型（监听器在 append 内被调用）逼出重入守卫、回调快照、失败 containment、延迟 detach 等一批防御代码。
- merge-extensible 的事件联合类型使 switch 不能用 assertNever 收尾（插件可注入未知变体），牺牲了封闭联合的穷尽性检查，未知类型的安全只能靠读侧的 ignorable 守卫兜底。

## learnables
- 最值得抄的一件事：给你的 agent 加一条'请求前断言'——在发 LLM 请求的最后关口，把即将发出的 messages 与'从持久化日志重新推导'的结果做深比较，不一致就炸（invariant.ts:39-42 模式）。即使你的系统不是事件溯源，只要有'日志应能重建上下文'的诉求，这个断言就能把静默漂移变成开发期的显式失败，成本极低。
- 把'改写历史'建模为带出处的追加事件而不是删除：replace 操作必须引用所有被遮蔽节点（sourceEventSeqs），压缩摘要与上下文替换拆成两个事件。这让压缩天然可审计、可撤销、可调试，而且人类视图和模型视图可以合法分叉。
- 未知事件的默认语义选 required-on-read 而非 skip：宁可过度拒绝（用户被提示升级）也不静默恢复一个缺内容的会话。设计任何可扩展的持久格式时，先问'忘了标记时哪种失败模式更安全'。
- 版本号用单个单调整数，'能否自动升级'交给每一步升级器的存在与否，不要用 major/minor 预先承诺；拒绝信息要分方向（'太新请升级' vs '太旧无升级路径'），并与'数据损坏'错误严格区分。
- 校验放在 append 现场而非 flush 时：一次递归遍历同时校验+快照+深冻结，返回快照而非调用者的可变对象。事实源的写入点就是唯一的把关点。
- 跨进程/崩溃安全的操作锁可以直接用日志事件对（start/end 括号）表达，配合一个'seed 结束'边界事件区分残留锁与活锁——不需要额外的锁存储。
- 衍生视图全部走'增量折叠 + 代际失效'（headerFold、derived cache、SurfaceManager 都是同一模式：记录已消费位置，读时补折叠，结构性改写时按 generation 整体重建），这是让事件溯源读路径保持 O(增量) 的标准配方。
- 让生产路径和断言共享同一个纯投影函数（deriveEventMessage 既被缓存折叠用、也被外部重建器和 invariant 用），从构造上排除'实现与检查各错一半互相掩盖'。

## questionable
- token 级 assistant/chunk 强制入正典日志（seq 连续性契约禁止过滤）是重决策：换来逐 token 回放保真和失败请求的用量记账，但日志体积和每 token 一次 append（校验+冻结+发布）的开销都不小。小团队若只需要 resume 和转录，日志只存装配后的 assistant/message、chunk 走旁路流即可——不必照搬。
- JSON.stringify 深比较的 invariant 每次请求 O(上下文长度)，且依赖键序稳定。作为可选 dev 伴生插件成立（这套 invariant 体系本来就是可拔插的），照搬到生产热路径前要想清楚开关策略。
- surface 位置与 seq 的语义分裂是真实的复杂度税：多次 replace 叠加后 shadowedRange 的 start seq 可以大于 end seq（compaction.md 特意警告'是位置区间不是数字区间'）。这是允许'对 replace 结果再 replace'买来的坑，你的系统若限制压缩只对原始事件做一层，可以避开整个陷阱。
- assertToolResultRewrite 把'tool/result 替换只许改 content、只许单节点'这条消费者（pruner）的策略硬编码进了核心 surface 折叠（surface.ts:287-318），与'行为归属其拥有插件'的自家原则有张力——核心为一个下游做了特判。
- 整套设计的成立依赖重型 gate 文化：KNOWN_SESSION_EVENT_TYPES 由脚本生成并有 verify gate 保鲜，每包强制 ./invariant 伴生、类型-文档同步校验、快照测试体系。抄机制不抄 gate，清单过期后'拒绝未知事件'会反过来拒绝自己人写的日志。这是 DeepSeek 有专职基建投入才撑得起的运维面。
- '一切皆插件'到会话核心也不例外（持久化、telemetry、invariant 全是订阅者）优雅但引入真实的生命周期复杂度——append 里的重入保护、回调快照先解析后调用、detach 延迟到发布解卷，都是同步发布模型逼出来的防御代码。自建系统直接用显式的持久化调用点可能更简单。
- 升级链机制目前是'设计完成、实现推迟'（等第一个真实 v0→v1 步骤来检验），ignorable 也尚无写入者——机制的关键部分未经实战验证，引用其经验时要注意这一点。