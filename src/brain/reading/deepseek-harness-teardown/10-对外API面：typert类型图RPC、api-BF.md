# 对外 API 面：typert 类型图 RPC、api/BFF、sdk(JSON-RPC)、acp、client connection、apps/cli、apps/web、Python SDK

这个子系统解决的问题是：一个由 219 个插件组成、可热插拔的 agent core，如何以五种产品表面（CLI、Web GUI、ACP、JSON-RPC SDK、Python SDK）安全地暴露给外部调用方。核心是 typert——一个自研的构建期 TypeScript 类型图编译器加运行时注册表：业务方法用装饰器标记后，构建期从 ts.Program 严格分析出 compiler 无关的类型图并投影成 Zod schema 与调用描述符，运行时网关据此做入参/返回值双向校验、Host 对象水合（lookup）和活 service 分发，源码开发时另有一条永不进客户端的弱回退路径。BFF 边界收敛在 api-remotes 一个包：Agent/Session 的冷恢复与所有权策略在此单点配置，legacy 代理与新 Remote 共享同一身份语义。ACP 和 JSON-RPC server 都是极窄的『serving 插件』——协议桥只是 cordis.yml 组合里的一个条目，因此五种表面的差异完全落在配置 patch 层而非代码分支；Python SDK 则把整个 Node runtime 以单文件 exe 塞进 wheel，依赖清单即分发内容定义。总体判断：边界校验、卸载不降级、身份策略单点化、surface-as-plugin 四个思想高度可借鉴，但 typert 自研编译器管线本身是只有 DeepSeek 这种规模与处境才付得起、也才回收得了的投资。

## Typert：从 TypeScript 类型图编译出 RPC 协议，而不是从 schema 或 IDL

机制：业务 service 用 @Remote/@RemoteScope 装饰器标记方法（docs/api-gateway.md:9-56）。构建时 typert-generator 以 Host 的 tsconfig.host.json 为唯一 ts.Program 种子，把 ts.Type 递归转换成 compiler 无关的 TypeGraph（analyzer.ts 的 convert() 逐 TypeFlags 分派，遇到未解析泛型参数或无法投影的类型直接 fail 而非降级，见 packages/typert/generator/src/analyzer.ts:1443-1516）；emitter 再把类型图投影成可执行的 Zod schema + InvocationDescriptor，写进各业务包自己的 lib/typert.host.js 与 typert.remote-client.*（generator/README.md:17-21）。运行时 ctx.typert registry 持有描述符；Host 端 TypertGatewayService 对每次调用做五重校验：args 字段与描述符精确匹配（不多不少，packages/api/gateway/src/index.ts:586-612）、Zod 解码、lookup/Context 解析、调用活 Cordis service、返回值再走一次 Zod + JSON-safe 断言（index.ts:145-184, 640-673）。客户端不用 JavaScript Proxy，而是把生成的描述符 mount 成具体方法对象（gateway/src/client/index.ts:1-5），最终走 connection.rpc.call('/api', '<ns>/<method>', {args})（client/index.ts:406），HTTP 上就是 POST /api/<ns>/<method>。

证据：packages/typert/generator/src/analyzer.ts:1443-1516; packages/typert/generator/src/emitter.ts:194-235; packages/api/gateway/src/index.ts:145-184,586-612,640-673; packages/api/gateway/src/client/index.ts:1-5,406; docs/api-gateway.md:95-117

价值：与 tRPC 的关键差异：tRPC 的 runtime 校验来自你手写的 zod validator，类型只是推断出来的；typert 反过来，schema 是从 TypeScript 类型自动生成的，类型即协议，且服务端和客户端各自独立持有校验（返回值也校验，防御被入侵的对端）。与 OpenAPI 差异：没有中间 IDL，也没有 codegen 出的 stub client——生成的 .d.ts.map 让编辑器从客户端调用直接跳回 Host 源码方法（api-gateway.md:115）。代价见 tradeoffs：这等于自研了一个 3000+ 行的编译器插件。

## Lookup 机制：把 BFF 的『对象水合』做成类型系统一等公民

机制：复杂 Host 对象（如 Agent）不能过 wire。业务包通过 TypertLookupMap 声明合并把参数类型与 wire 身份关联（Agent 参数 → wire 上的 agentId 字段，packages/typert/protocol/src/types.ts:14-23），并在运行时注册默认 resolver；Host 组合层可用 ctx.typert.lookups.configure() 替换解析策略而不改 wire 契约（types.ts:395-408）。Gateway 调用业务方法前把 id 换回活对象，resolver 抛出的 TypertLookupFailure 原样透传为 RPC 错误而不折叠成 internal（gateway/src/index.ts:447-467,478-480）。api-remotes 是唯一配置这套策略的 BFF 包：createApiRemoteAgentResolver 实现『复用活 Agent → 冷 session 自动 resume（按 identity 用 Map 去重并发恢复，finally 清理）→ subagent 所有权 fence 拒绝』的统一语义，然后一次 configure 注入所有含 agent/session 参数的 Remote 方法，legacy API Proxy 也消费同一个 resolver（packages/api/remotes/src/agent-lookup.ts:121-211）。

证据：packages/typert/protocol/src/types.ts:14-23,262-291,395-408; packages/api/remotes/src/agent-lookup.ts:62-85,143-173,199-208; packages/api/gateway/src/index.ts:407-468

价值：这回答了『web 前端与 harness core 的边界在哪』：边界就是 api-remotes 这一个包——身份/恢复/所有权策略集中一处，RPC 方法签名可以直接写业务对象（Agent），不必在每个 handler 里手写 sessionId→agent 解析。冷恢复去重 + 所有权 fence 的写法本身就值得抄。风险是策略按 lookup key 全局生效（所有 agent 参数共享冷恢复语义），文档明确承认没有 per-endpoint 策略（api-gateway.md:164）。

## 双模描述符：strict 构建产物 + SRC 源码弱回退，且『卸载不降级』

机制：源码启动（tsx）不跑编译器插件，装饰器只在模块私有 WeakMap 里记方法名；Gateway 用 Function.prototype.toString 解析参数名构造弱描述符（拒绝解构/默认值/rest，packages/api/gateway/src/index.ts:542-576），参数名恰好匹配注册 lookup 的 parameter 时用其 wire 字段解析对象，其余只做 JSON-safe 检查（index.ts:285-318）。三条不对称防线：(1) registry 的 hasSeen() 记住 strict 描述符曾经存在，热卸载后拒绝退回 SRC 推断，防止 hot unload 静默削弱校验（index.ts:224-235; packages/typert/registry/src/service.ts:169）；(2) 客户端永远拒绝 mount 无 strict codec 的描述符（docs/api-gateway.md:137）；(3) SRC 只解决 Host 进程内 dispatch，不生成类型。

证据：packages/api/gateway/src/index.ts:224-235,237-357,542-576; packages/typert/registry/src/service.ts:169; docs/api-gateway.md:132-137

价值：『编译期协议生成』最大的痛点是开发迭代慢（改签名要重跑生成）。这个设计用弱模式换开发速度，同时用 hasSeen 和客户端拒绝 SRC 保住安全底线——『协议描述符被撤下后不允许降级到推断』是任何支持热重载的 RPC 系统都值得抄的模式。反面是同一调用存在两条校验路径都要测；Function.toString 解析参数名依赖『参数名==lookup 名』的隐式命名耦合，且在转译/压缩下脆弱（靠钉死 tsx ESM 源码启动方式来控制）。

## ACP 是刻意收窄的 automation-only 适配器，主要服务 agent 间互操作而非编辑器

机制：整个包 436 行（packages/acp/acp/src/index.ts），inject 只有 ['agents']（index.ts:42-44）——协议桥只负责创建/持有 agent，其余能力全由组合提供。协议面收到最窄：只支持 fresh session、纯文本 prompt、committed assistant text（不流式 delta，『用 token 级延迟换干净的自动化结果』，README:34）、one-shot 权限决策；load/resume/编辑器能力/MCP 全部显式 reject（acp/README.md:76-81）。仓库内的主要客户不是 Zed 这类编辑器，而是 subagent-acp——把另一个 harness 进程当 subagent 驱动（packages/acp/README.md:5）。生命周期上，连接断开与插件卸载共享一个 memoized teardown，只 drain 本连接 exact-owned 的 agent 树，不动共享 Context 里其他 frontend 的 agent（acp/README.md:38）。

证据：packages/acp/acp/src/index.ts:42-44,105-136; packages/acp/acp/README.md:5,27,34,38,76-81; examples/acp-agent/cordis.yml

价值：回答了『ACP 服务什么场景』：选一个行业标准协议（agentclientprotocol.com）做进程间 agent 委托的 transport，编辑器兼容是顺带收益而非目标。文档纪律值得学：README 逐条列出不支持什么、为什么（committed-only 的取舍写明了）。但要注意它与自家 SDK JSON-RPC 高度重叠（都是程序化驱动 agent 进程）——这是『标准互操作』与『自有协议』的双押注。

## Python SDK 分发：wheel 即 runtime 载体，依赖清单即插件集

机制：deepseek-harness-runtime-bin wheel 里装一个 pkg 打包的单文件 Node exe（目标机无需装 Node），macOS 附带 node-pty 的 spawn-helper sidecar 且缺失即硬启动错误；sdk-runtime 根部的 package.json 是纯依赖清单，其依赖闭包同时定义 exe 的编译内容和 dev 用 node 载体的物化树——『给分发加一个插件=加一行依赖再重建』（python/sdk-runtime/README.md:9-18）。dev-only node 载体永不被自动选择，必须显式 DSH_RUNTIME_MODE=node，防止生产部署悄悄跑在源码 build 上（README.md:22）。zero-config 也是显式的：runtime 二进制坚持要求显式配置并大声退出，Python wrapper 只是可见地注入打包的 cordis.yml 路径（README.md:29）——serving 接口（stdio JSON-RPC server）本身就是那份配置里的一个插件条目。协议本体极小：initialize / session/prompt / shutdown 三个方法加四种通知（packages/sdk/server/src/server.ts:190-201,71-103）。

证据：python/sdk-runtime/README.md:9-29; python/development.md; packages/sdk/server/src/server.ts:71-103,190-201; examples/jsonrpc-agent/cordis.yml

价值：『wheel 作为二进制载体 + 依赖清单定义分发内容 + dev 通道永不自动选择』是给非 Node 生态包装 Node runtime 的干净方案：查找接口与获取策略分离（以后可换成按需下载不动调用方），版本由仓库根 package.json 单点供给并与 python-v 标签强校验。代价是每个平台 wheel 几十 MB 且平台矩阵（manylinux x64/arm64 + macOS arm64）要 CI 养。

## 五种表面复用一个 core：surface = serving 插件 + cordis.yml 组合层

机制：CLI headless、Web、ACP、JSON-RPC、Python 五种表面共享同一 agent spine（agent/agent-loop/session/tools/llm 等约 80 个插件的 dsh-base bundle，apps/cli/composition.md:9-166），差异只在组合：jsonrpc-agent 的 cordis.yml 第一条就是 sdk-jsonrpc-server 插件；acp-agent 换成 acp 桥；web 是 bundle/web-app patch 在 base 上加 webserver+connection+api-remotes（packages/bundle/web-app/cordis.patch.yml:100-166）；Python runtime 就是 jsonrpc 组合打进 exe。apps/web/src/main.ts 只有 10 行（一切都在包里），apps/cli 是 profile 启动器——profile 是 bundle patch 层的有序栈，用户自己的 cordis.patch.yml 叠在最上（apps/cli/README.md:30-40）。协议 server 是插件带来一个具体纪律：stdout 被协议帧占用时，连 console logger 都要在配置层拿掉（examples/jsonrpc-agent/cordis.yml 头部注释）。

证据：apps/cli/composition.md:9-166; apps/web/src/main.ts:1-10; packages/bundle/web-app/cordis.patch.yml:100-166; examples/jsonrpc-agent/cordis.yml; examples/acp-agent/cordis.yml; apps/cli/README.md:30-43

价值：这就是『harness 即产品家族』的机制含义：产品差异全部下沉到配置 patch 层，不存在每表面一个 fork 的 server 代码，出一个新表面=写一个 serving 插件+一份 cordis.yml。前提是核心不变式撑得住——『model-visible ⟺ logged』让任何表面都能从 session log 重建模型可见状态，五个表面才能安全共享一份持久化。

## tradeoffs
- 自研编译器管线的养护成本：typert generator 是 3113 行的 TypeScript checker 分析器加 934 行 Zod emitter，Zod 投影只支持刻意选定的子集（泛型 schema、条件/映射类型根、enum 都直接 fail），每次 TypeScript 版本升级和新类型形态都是维护负担（generator/README.md:37-41 自列限制）。
- 构建拓扑复杂化：协议正确性依赖 build:lib:host → build:lib:client → build:web 的严格顺序，Host tsdown 期间跑生成器、Client 消费新生成的声明；改契约必须重跑有序构建，api-remotes 因此成为全仓唯一 split-faces 特例（docs/api-gateway.md:95-101）。
- 双模校验路径：strict 与 SRC 是两条都要测试、文档化、维护的 dispatch 路径；SRC 的 Function.toString 参数名解析是对 JS 运行时表示的脆弱依赖，靠限定源码启动方式（tsx ESM hook）间接保障。
- 协议面二元分裂：Remote 严格限定 unary，一切流式/增量/分页需要完全独立的数据协议与注册模型（api-gateway.md:160），意味着长期并存两套 wire 机制和两套演进节奏。
- Python 分发重量：每平台 wheel 内嵌完整 Node 24 单文件 exe（几十 MB），三平台矩阵、macOS spawn-helper sidecar、私有发布仓与 Trusted Publishing 的流程都要 CI 长期供养。
- 极限 process 纪律的税：每包 100% per-file 覆盖率门禁、强制 invariant 文件、双语 README、Agent Note 制度——这是让 219 包插件化不失控的必要代价，也是照搬该架构时最容易被低估的隐性成本。

## learnables
- 『协议卸载不降级』模式（hasSeen）：热重载系统里，一个强校验的端点被撤下后必须拒绝服务而不是退回弱推断——一个 Set 记录『曾经 strict』就够了，成本极低，防的是 hot unload 静默削弱安全边界。
- 把身份/水合策略收进一个 BFF 包：RPC 方法签名直接写业务对象（Agent），wire 身份转换由集中注册的 lookup resolver 完成；冷恢复用『Map<id, Promise> + finally delete』去重并发，所有权 fence 在 resume 前后各查一次以关闭竞态窗口（agent-lookup.ts:143-173）。
- serving 界面做成插件而非应用外壳：协议 server（JSON-RPC/ACP/HTTP）只是组合里的一个 entry，新表面=新 serving 插件+一份配置，五个产品表面共享一个 core 就变成纯配置问题。
- unary RPC 与事件流严格分离：Remote 只做一请求一结果，session 事件流走独立协议（两条下行 WebSocket），不让流式伪装成方法调用进入描述符——这条边界让替换 transport 不碰业务协议。
- 边界校验做全套而且双向：args 字段精确匹配（多、少都拒）、入参 schema、返回值 schema、JSON-safe 断言（循环引用/稀疏数组/symbol/非 finite 数），服务端不信客户端，客户端也不信服务端。
- 给非 Node 生态包装 Node runtime 的分发模板：单文件 exe 进 wheel、纯依赖清单 package.json 定义分发内容、dev 载体永不自动选择、查找接口与获取策略分离、版本单点供给+发布标签强校验。
- 窄协议实现的文档纪律：ACP README 逐条列出不支持什么和为什么（committed-only 换自动化干净结果），比默默实现一半更可维护。
- 『model-visible ⟺ logged』不变式是多表面复用的地基：任何进入模型请求的输入必须可从 session log 重建，这让 CLI/Web/ACP/SDK 可以安全地 resume 彼此创建的会话。

## questionable
- typert 整条自研管线（3113 行 analyzer + 934 行 Zod emitter + 三段有序构建 host→client→web）只在 DeepSeek 的处境下划算：219 包 monorepo、协议面要随插件热插拔、有专人养编译工具链。小团队用 tRPC/ts-rest + 手写 zod，或 OpenAPI codegen，能拿到 80% 收益而零自研编译器成本；typert 的独有收益（declaration map 跳转回 Host 源码、类型符号级 provider 校验、per-package 产物）大都依赖他们自己的仓库结构。
- 改一个 Remote 签名就要重跑完整 build:lib（Host 生成先于 Client 编译），api-remotes 还是全仓唯一 split TypeScript faces 的特例包——文档自己承认这是复杂度热点。这是把『手写 schema 漂移』的风险换成了『构建拓扑复杂度』，不是免费的。
- SRC 弱回退用 Function.prototype.toString + 正则解析参数名，并靠『参数名==lookup parameter 名』的命名约定路由对象解析——隐式耦合，重命名参数就是改 wire 行为；他们靠钉死 tsx ESM 源码启动方式控制风险，照搬前要确认你的构建链不会转译参数名。
- ACP 与自家 SDK JSON-RPC 场景高度重叠（都是程序化驱动一个 agent 进程），同时养两套协议 server 是对『标准互操作』与『自有最小协议』的双押注；小团队选一个就够，除非确实需要接入 ACP 生态。
- 『一切皆插件』推到 UI 层（40+ 个 ui-* client 包，每包独立 README/invariant/测试）对小团队是巨大的包管理与 process 税；插件化的合理粒度在 capability seam（llm/bash/fs/subagent），不在每个 UI 面板。
- connection 层的 /api 信任 fence 是精细的 Host-header 可达性策略但明确不是认证（README 原文自认），dsh web --host 0.0.0.0 直接不支持——如果你的产品第一天就要远程多用户，这个架构里的认证层还不存在，不要以为抄了 fence 就有了安全。