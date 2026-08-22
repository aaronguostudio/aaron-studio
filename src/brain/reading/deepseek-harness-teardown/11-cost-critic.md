# cost-critic

DeepSeek Harness 是建立在 vendored Cordis 之上的"一切皆插件"agent 框架：219 个 workspace 包（find packages -name package.json 计数），agent loop、工具注册表、会话日志、模型适配器全部是可从 YAML 配置替换的插件，模型上下文完全从 append-only 会话日志投影而来。这套架构换来了极强的可替换性和可回放性，但仓库自己的证据（4 篇 postmortem、rejected notes、guard 包的存在本身）显示它付出的真实代价集中在三处：动态组合把大量错误从编译期推到运行期甚至"静默不发生"；插件化的服务解析语义（fiber walk / shadow proxy / 永久 pending）有足以让 100% 覆盖率测试全绿而产品完全不能用的陷阱；以及为了压住这些风险而堆起来的流程重械（每包 invariant、几十个 verify-* gate、双语文档镜像）本身成为第二重税。

## 风险一：测试全绿、产品崩溃——插件加载路径与测试路径的系统性分叉

机制：ACP 服务器带着 178 个绿色单测和 100% 行覆盖上线，真实编辑器一连接立即崩溃，且藏着两个独立 bug。Bug#1：多写一行 export default apply，Cordis Loader 的 unwrapExports 优先取 .default，把 name/inject/Config 等同级命名导出全部丢弃，插件在无注入服务的 fiber 里运行，load 时即抛错；Bug#2：可选服务用 ctx.sessionPersistence 属性读取，经 shadow proxy 触发 ancestor-only fiber walk，服务在兄弟分支上永远找不到——而测试从顶层 context 调用时走 !ctx.fiber.runtime 的旁路直查全局 store，所以只在真实插件拓扑里炸。所有测试都用 ctx.plugin({name,inject,apply}) 手工挂载，永远不经过 Loader；唯一驱动 session/new 的 e2e 被 API key 门控，CI 跳过，本地'通过'还是因为陈旧的 built lib/ 恰好满足了模块解析。

证据：docs/postmortem/0001-acp-default-export-drops-inject.md:39-54（unwrapExports 丢弃 namespace）、:62-85（shadow walk 与测试旁路）、:93-98（手工挂载与 stale lib/）；事后规则沉淀在 packages/CLAUDE.md（AGENTS.md）'Plugin exports'与'Optional services use ctx.get(name)'两条

价值：这不是普通 bug，是'一切皆插件'范式的结构性弱点：插件的正确性取决于它被加载和被调用的拓扑，而单元测试天然绕过拓扑。ctx.foo 与 ctx.get('foo') 语义不同这种陷阱，只能靠事故后写进 AGENTS.md 的纪律来防，框架类型系统防不住。

## 风险二：配置层的静默失败——一个 YAML 标签写错位置，文件系统工具集体消失且被快照固化

机制：团队想用 disabled: !!js 条件启用 fs 插件，但 Cordis 只在 entry.options.config 内求值 !!js 表达式，entry 元数据（disabled）直接按原值消费——未求值的表达式对象恒为 truthy，于是 read/write/edit 在所有模式下都被禁用。七个文件系统快照场景全部返回 UNKNOWN_TOOL，但快照 refresh 把这些错误结果重写为新的期望输出，全部 gate 通过：快照套件证明的是'回归的确定性重放'而非正确行为。同类静默还有 inject 声明缺失时插件永久 pend 而无任何诊断（docs/cordis-primer.md:11 'waits until those services exist'——等待没有超时也没有报错，postmortem 0001:60 明确说注入 sessionPersistence 会让无持久化的 demo 'pend forever'）。

证据：docs/postmortem/0002-js-expression-disabled-filesystem-tools.md:15,19,32-34,41；docs/cordis-primer.md:11；docs/postmortem/0001-acp-default-export-drops-inject.md:60

价值：配置驱动组合把'工具存在与否'从代码事实变成了四层 YAML patch（bundle 顺序→profile patch→home patch→--patch overlay，docs/architecture.md:27）叠加后的运行时结果。语法合法但语义无效的配置不报错，是这类系统最典型的失败面；他们的修法是加 verify-cordis-config 静态 gate + 快照框架拒绝 UNKNOWN_TOOL——即每发现一种静默都要再造一个专用 gate。

## 风险三：guard 包是失控模式的化石记录——模型死循环与工具挂死真实发生过

机制：packages/guard/repeat-tool-reminder 存在的唯一理由是模型会连续用完全相同的参数重复调同一工具（默认阈值 3/5/8 次），只能靠注入劝告性提醒打断——且 README 自认六条局限：仅精确匹配（改一个空格即逃逸检测）、compaction 不重置计数链、纯 advisory 不阻断、超过最高阈值后 chain 彻底静默、合法轮询也会被误提醒。timeout-policy 则只提供 cooperative 超时：deadline 只通过 exec.signal 通知，无视信号的工具不会停；且 bash/read/write/edit 刻意不声明任何 timeoutMs——挂死的 bash 调用没有任何兜底预算。

证据：packages/guard/repeat-tool-reminder/README.md:5,85-90；packages/guard/timeout-policy/README.md:32,56-57；packages/guard/timeout-policy/src/index.ts:6 还留着 FIXME（包名 rename 未定）

价值：guard 包的配置面精确暴露了 DeepSeek 模型在自家 harness 里的真实行为缺陷（重复调用、不收敛），这是任何营销材料里看不到的。同时'advisory-only + cooperative-only'说明这套无特权架构里连守护插件都没有强制力——它只能追加上下文，不能杀进程。

## 风险四：token/延迟成本——KV-cache 纪律严格，但历史只增不减且零基准数据

机制：架构对每请求固定开销的控制是认真的：deriveMessages() 有 O(新节点) 增量缓存（packages/core/session/src/index.ts:717-746），append-only 投影天然保持请求前缀稳定，每个包 README 被 gate 强制声明 Model Experience（Token effect / KV Cache effect）。但代价在另一侧：(1) 会话日志按 token 级 chunk 持久化，rejected note 自认'JSONL fixtures 被微小 delta 记录支配'，为回放保真度拒绝了瘦身；(2) guard 提醒作为注入 user/message 永久留在历史里，compaction 不重置 chain；(3) 默认组合的工具目录列出约 26 个工具包（docs/tool-catalog.md），每个 schema 都是每请求固定 token；(4) BENCHMARK.md 全文 3 行，仅指向 Python SDK 运行方式——整个仓库没有发布任何端到端 token/延迟开销测量。

证据：packages/core/session/src/index.ts:701-747；.agents/notes/rejected/simplification/2026-06-20-assembled-assistant-messages-only.md（'JSONL fixtures are dominated by tiny delta records'）；BENCHMARK.md:1-3；docs/tool-catalog.md 章节计数

价值：'每包声明 KV-cache 效果'是值得抄的纪律；但'声明'不等于'测量'——一个以 harness 为卖点的仓库没有任何 overhead benchmark，说明成本论证目前停留在定性层面，固定开销随插件数线性增长这件事没有量化护栏。

## 风险五：复杂度税有明码标价——流程重械是架构复杂度的对冲成本

机制：219 个包 × 每包强制：src/invariant.ts（verify-package-invariants）、README 含 Model Experience 与 Known Limitations 章节（各有专用 verify gate）、100% per-file 覆盖率门（docs/testing.md:10——即便 postmortem 0001:98 刚论证过'100% 覆盖证明不了任何东西'，门槛照旧保留，于是每个产品可见插件还要再加一个真实 Loader 组合测试，双重测试税）。文档侧：1078 个 .zh.md 双语镜像文件 + i18n.yaml 三件套，scripts/run-gates.ts 列出十几种 CI 模式和几十个 verify-* gate（module-graph、cordis-config、doc-budgets、export-jsdoc、readme-limitations…）。rejected notes 里 collapse-workflow-to-foreground-core 自认 workflow 的六个事件'没有任何生产监听者'、payload 缺少可路由身份、纯投机 API——即使有这么重的流程，投机性抽象仍然溜进了主干。

证据：packages/CLAUDE.md（AGENTS.md）invariant/README 条款；docs/testing.md:10；scripts/run-gates.ts:192-345；find 计数：219 个 package.json、1078 个 .zh.md；.agents/notes/rejected/simplification/2026-07-12-collapse-workflow-to-foreground-core.md

价值：这是'一切皆插件'的真实账单：动态组合牺牲了编译器能免费提供的整体性检查，只能用海量定制 gate 一条条买回来。gate 数量本身就是架构风险面的间接测量。

## 风险六：无特权内核的暗面——agent 连'自己是谁、跑在哪'都不是内建事实

机制：postmortem 0003：Web agent 改了 GUI 源码后，不知道自己的会话由哪个 URL/进程/模式承载，于是先把验收推回给用户，再把裸 Vite 的 HTTP 200 当成功（实际白屏），最后另起一个替代服务器在别的端口上'验证成功'，而用户原页面早已自行热更新。根因：无特权内核意味着连'当前 GUI 的身份、canonical URL、运行模式'都不是运行时的内建事实，必须由某个插件专门做成 model-visible 的 prompt section 并写进日志才存在。修复正是新增 app:web-surface prompt 段和 $DSH_WEB_URL 环境变量——每一类'agent 该知道的自身事实'都要单独立项。

证据：docs/postmortem/0003-web-agent-gui-feedback-loop.md:9,34-38,42-43

价值：这揭示了'model-visible ⟺ logged'原则的反面：任何没人显式注入的运行时事实，模型就彻底不知道，且没有默认兜底。自省能力在无特权架构里不是免费的，是逐条付费的。

## 风险七：承认了但未修复的静默失败面清单

机制：文档自曝的不出声失败：(1) hooks 桥接中 Claude Code/Codex 的 {"continue": false} '被记录但不中止运行'，systemMessage '记日志+警告但不呈现'，Codex 十种 hook 事件有五种配置被'解析时静默丢弃'；(2) sandbox stderr 是 in-band 归因信道，postmortem 0004 明说被限制的子进程可以伪造 runner 的 fatal line + 退出码造成误归因，'out-of-band status protocol 仍是未做的 hardening'；(3) apiproxy 里 XXX 注明网关对外暴露前需要 redact provider 细节（尚未做）；(4) repeat-reminder 超过最高阈值后永久静默；(5) jobs-local 承认'静默无效的 cancel 会占住容量槽直到服务生命周期结束'。

证据：packages/hooks/hooks-claude-code/README.md:96；packages/hooks/hooks-codex/README.md:93-99；docs/postmortem/0004-landlock-partial-notice-misclassified-child-failures.md:39；packages/host/apiproxy/src/api-proxy.ts:2157；packages/jobs/jobs-local/README.md:34

价值：这份清单的价值在于它是仓库自己写下的：'Known Limitations' 被 gate 强制存在，所以静默面是可枚举的。但 hook 的 continue:false 不生效属于会让集成方产生错误安全感的一类——用户以为 hook 能拦截，实际只是记了一笔。

## tradeoffs
- 可替换性 vs 编译期保证：一切从 YAML 组合意味着'工具存在、服务可达、配置生效'全部变成运行期事实；四篇 postmortem 里有两篇（0001、0002）的根因是纯粹的组合期错误，而修复手段全是新增专用静态 gate——用几十个 verify-* 脚本手工赎回 TypeScript 本可免费给出的整体性。
- 回放保真度 vs 存储/处理成本：坚持持久化每个 assistant/chunk 使 fork/resume/快照回放精确到 token，但 rejected note 承认 JSONL 被微小 delta 记录支配，且任何日志读取方都要自行区分'持久历史'与'token 级 trace'。
- 流程护栏 vs 迭代速度：每包 invariant + 双语 README（1078 个 .zh.md 镜像）+ Model Experience 章节 + 100% per-file 覆盖 + 真实组合测试 + Agent Note，意味着'加一个小插件'的固定成本极高；这在 DeepSeek 这种把 harness 本身当产品、且大量用 agent 自己写代码的团队里成立，在普通团队会直接压死迭代。
- 守护无强制力 vs 架构纯度：guard 只能注入劝告、timeout 只能 cooperative 通知，保住了'无特权内核、注册即效果'的纯度，代价是失控模式（死循环、挂死工具）没有硬性兜底，最高阈值之后系统彻底沉默。
- pre-release 无兼容承诺（AGENTS.md 'Pre-release stance'、SESSION_FORMAT_VERSION=0，后端直接拒绝旧格式）：现在换来了随意重构的自由，但也意味着今天所有持久化会话在任何格式变更后一律作废——这个立场必须在第一个 tagged release 时切换，而切换那天 append-only 日志 + 快照 fixture 的全部迁移成本会一次性到账。

## learnables
- 至少一条测试必须走真实加载路径：手工构造插件对象的测试永远无法验证插件如何被加载（postmortem 0001 的核心教训）——对任何插件/DI 系统，'无 key 也能跑的真实入口 e2e'应进 CI 而非藏在 key 门后。
- 快照 refresh 是 fixture 生产，不是正确性评审：必须有独立于期望输出的语义断言（如'被调用的工具必须已注册'）拦住语义上不可能的转录被固化为基线（postmortem 0002）。
- 配置系统要明确声明哪些字段会被求值：语法接受 ≠ 该位置生效；若做不到求值位置统一，就用静态 gate 拒绝错位的表达式节点。
- 依赖等待必须可诊断：Cordis 式'inject 缺失就静默 pend'是极危险的默认——依赖解析失败要么超时报错，要么在启动摘要里可见。
- 进程间归因不要用 stderr 子串：需要退出码 + 精确诊断行的合取，且未知 fatal 行 fail-closed（postmortem 0004）；适配层必须透传下层的结构化错误，不许换成自己最近似的泛型错误码。
- 每个模型可见组件强制声明 Token effect / KV Cache effect 是值得直接抄的文档纪律，成本极低而让'上下文预算'成为评审对象。
- Known Limitations 作为 gate 强制的 README 章节，把静默失败面变成可枚举清单——比'代码里散落 TODO'可审计得多。
- rejected notes 目录本身值得抄：把否决的简化连同证据冻结下来（如 NIH 审计的逐项否决理由），防止同一个'看起来显然'的重构被反复提出。

## questionable
- '无特权内核'在小团队不成立：它的前提是有能力为每一类运行时事实（自身 URL、运行模式、GUI 身份）单独立项做成插件化 prompt section，并用几十个定制 gate 补回整体性检查。postmortem 0001/0002/0003 显示连 DeepSeek 自己都在为此连续付费；小团队用一个有特权的、类型闭合的核心 + 少量显式扩展点，能免掉这里的大部分事故类别。
- 100% per-file 覆盖门与'覆盖率证明不了行为'的自我矛盾：postmortem 0001 刚论证过 100% 覆盖全绿而产品完全不能用，testing.md 仍保留该门并叠加真实组合测试——等于承认覆盖门主要用途是'标记死代码'，却让所有包永久支付双重测试税。
- token 级 chunk 持久化的性价比存疑：为'精确重放历史 token 流'保留全部 delta 记录，主要消费者是快照测试和 ACP load；rejected note 提出的 sidecar fixture 方案被否的理由是'当前合同依赖它'——这是被自己的测试基建反向锁定的典型案例，外部借鉴者不应默认跟随。
- guard 永远 advisory 的赌注：如果模型行为不改善（repeat-tool-reminder 的存在证明会死循环），超过最高阈值后系统静默、bash 无超时预算意味着失控 agent 的最终兜底只剩用户手动打断——把安全阀完全押在'模型看到提醒会自省'上，对无人值守/headless 部署是真实风险。
- 1078 个 .zh.md 双语镜像 + i18n.yaml 三件套只有在'文档本身是产品且有 agent 流水线维护翻译'时成立；BENCHMARK.md 只有 3 行却维护着 77 节的工具目录，说明文档投入的优先级排序（形式合规 > 性能证据）值得警惕。
- sandbox 归因信道未认证：postmortem 0004 明确承认被限制的子进程可伪造 runner 诊断行造成误归因，out-of-band 协议'仍是未做的 hardening'——在把该 sandbox 用于对抗性场景（运行不可信代码并依据失败分类做决策）之前，这是一个已知未修的口子。