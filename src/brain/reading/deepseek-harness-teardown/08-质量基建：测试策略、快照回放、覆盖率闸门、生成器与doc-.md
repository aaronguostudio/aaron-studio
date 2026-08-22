# 质量基建：测试策略、快照回放、覆盖率闸门、生成器与 doc-sync

DeepSeek Harness 的质量基建是为"代码主要由 coding agent 编写"这一前提专门设计的防腐系统（这句话明文写在 .agents/notes/implemented/process/2026-06-11-quality-gates.md:11）。它分四层测试（unit / per-file 100% 覆盖率 / 真实 API e2e / keyless 快照回放）加上约 40 个机械化门禁（27 个 verify-* 脚本 + 12 个生成器中 10 个带 --check 新鲜度校验 + knip/publint/jscpd/oxlint/workspace constraints），全部由一个手写的 DAG 调度器 scripts/run-gates.ts 按 CI lane 编排。核心发明是 keyless snapshot 回放：录一次真实 API，把产品自己持久化的 session JSONL 同时用作回放脚本和行为断言，之后整条 ACP/headless/Web transcript 无 key 确定性重放。整套体系的经济学假设是"agent 干活时人力不是成本"，因此可以把每一条 AGENTS.md 承诺都变成 exit 非零的命令。

## Keyless 快照回放：fixture 就是产品自己的 session 日志

机制：记录阶段用真实 llm-deepseek adapter 跑一次场景，收割产品正常持久化的 session.jsonl；回放阶段 deriveReplayScript() 从日志的 assistant/chunk 事件按 finish chunk 切分重建每次模型调用（turn/step 变化检测未终止的流，缺 finish 则强制要求 replay.override.json 显式 sidecar），然后 installLlmReplay() 通过 cordis.snapshot.yml overlay 短路 llm/stream waterfall——只换掉模型这一个不确定性边界，Loader、真实工具、真实 bash、真实子进程全部照跑。每次运行断言两个面：stdout 的 JSON-RPC transcript（外部协议契约）和重新持久化的 JSONL（loop/工具/边界结构），后者与作为回放源的同一个 fixture 对比。ReplayHandle.assertConsumed() 在 teardown 时检查每个录制脚本都被绑定、每条录制调用都被消费——'场景比录制时少调了模型'这种静默回归会被抓住。replay 模式绝不加载 .env，误留的 key 不可能触发真实调用。

证据：packages/test-support/llm-replay/src/index.ts:206-263（deriveReplayScript）、:697-770（positional 绑定 + assertConsumed）；vitest.snapshot.config.ts:24-37、:58-66；.agents/notes/implemented/testing/2026-06-19-acp-snapshot-tests.md；docs/testing.md:12

价值：这是 agent 产品测试最难的问题的干净解法：模型是唯一不确定边界，在 capability seam（而非 HTTP 层）冻结它，就得到全保真 + 全确定 + 免 key 的 CI。Agent Note 里明确记录了被否决的替代方案——Polly/nock 式 HTTP 录制被拒是因为'adapter 特定、对 streaming SSE 别扭、层次低于被测对象'。fixture 复用产品自己的持久化格式意味着回放测试同时在验证'model-visible ⟺ logged'这条架构不变量：任何到达模型的输入必须能从日志重建，否则根本回放不了。

## "fix fixtures, not normalizers"：归一化器是封闭集合

机制：normalizer 是一组固定的纯函数（packages/test-support/acp-snapshot/src/normalize.ts）：JSON-RPC id 映射为首见序号、生成的 cwd 及其所有文件系统别名（macOS /private 等）token 化为 {{cwd}}、时间戳归零但保留 seq、system prompt 和 tool schema 压缩成 {{system}}/{{tools}}。每个 header class 只有一个 pin 场景把完整 prompt/tool-schema 内容固定进可读的 sidecar（system-prompt.expected.md），其余场景全部 token 化——改一次 prompt 只 churn 一行 diff。跨平台策略是修 fixture 而非扩 normalizer：命令约束到稳定子集、posixOnly 跳过 Windows、pinsNativeWindowsStdout 提供 Windows 专用期望文件。

证据：AGENTS.md:123（'Fixtures must replay on macOS/Linux; fix fixtures, not normalizers'）；packages/test-support/acp-snapshot/README.md 第 11-12 段（normalizer 清单与 pin 机制）；.agents/notes/archived/testing/2026-07-06-pin-request-header-content-in-one-scenario.md

价值：这条纪律防的是快照测试最常见的死法：normalizer 正则逐渐膨胀成有损的'差异消化器'，最终把真实回归也归一化掉。把归一化器锁死为封闭集合、把平台差异推回 fixture 声明（skip 或专用 sidecar），保证了 diff 永远语义可读。pin-one-tokenize-rest 是 review 人体工学上的聪明取舍：既有一份完整可读的 prompt 快照，又不让每次 prompt 微调污染 78 个场景。

## Per-file 100% 覆盖率闸门及其配套的诚实机制

机制：vitest.config.ts:273-279 设 perFile:true 且 statements/branches/functions/lines 全 100，作用域为 packages/*/*/src（:166）。per-file 的理由写在 :269-270：'大文件的高覆盖不能补贴裸奔的文件'。docs/testing.md:10 给出关键重构：未覆盖的行通常是该删的死代码，不是该补的测试。配套两个机制：(1) coverage-exempt.ts 把编译器/子进程重的套件挪到并行的无插桩 gate（v8 插桩使其运行时间翻数倍），准入规则是'它触碰的每个被测文件已被其他套件覆盖满'，正确性信号不变、只省插桩税；(2) 每个 v8 ignore 注释必须写理由。但同一文件里有约 100 行排除清单（:169-268），大量 client/UI 文件挂着 TODO(gui) 债务标记。已知失效模式被明文记录：100% 压力会产生无断言测试，mutation testing 是计划中的对冲（quality-gates note :28）——但至今仍是 proposed 状态。

证据：vitest.config.ts:160-283；scripts/coverage-exempt.ts 头注释；docs/testing.md:10；.agents/notes/implemented/process/2026-06-11-quality-gates.md:20,28

价值：值得注意的不是 100% 本身，而是围绕它的三层诚实：把未覆盖行重新定义为死代码信号（对 AI 生成代码尤其对——AI 爱写用不上的分支）；用排除清单公开承认哪里守不住而不是降低全局阈值；把'指标会被无断言测试糊弄'这个失效模式写进决策记录。同时排除清单本身就是反面证据：连他们自己都无法对 GUI 代码执行这条纪律。

## 生成器 + --check 新鲜度校验：文档不能漂移

机制：12 个 gen-*.ts 从源码（TypeScript Program、package.json peerDependencies、工具注册表）生成目录文档：cordis-catalog、tool-catalog、config-catalog、persistence-catalog、module-graph、doc-graphs、scoped-events resolver、third-party notices 等。每个生成器同时是校验器：package.json 里 verify-cordis-catalog 就是 'gen-cordis-catalog.ts --check'，生成物过期即 CI 红。gen-scoped-events 最激进：对全仓类型图扫描每个事件 payload 找 scope 路由键的等价类型，零匹配必须显式标注 @dshScopeScan unsupported，多匹配直接 fail loud。doc-sync 聚合共 28 个叶子 gate（run-gates.ts:571-616），涵盖 export JSDoc 强制（fail closed）、doc 字数预算（manifest 定 ceiling、只降不升需论证、降时留 5% 余量）、Markdown 段落单物理行、链接/路径/VitePress fragment 完整性、docs 里代码块与真实源码声明的等价性（verify-type-equiv）、中英文档配对（记录 git blob hash）、Agent Note 格式/分类/归档封存。

证据：package.json:104-125（gen/verify 成对映射）；scripts/run-gates.ts:571-616；scripts/verify-doc-budgets.ts 头注释；scripts/doc-budgets.manifest.json；scripts/gen-scoped-events.ts 头注释；scripts/verify-export-jsdoc.ts 头注释

价值：'能从源码推导的文档必须生成，生成的必须 --check'把文档从'会腐烂的散文'变成'编译产物'。对 agent 开发尤其关键：这些文档同时是喂给 agent 的上下文，文档漂移直接毒化后续所有 agent 的决策。字数预算 ratchet 是对 LLM 文档膨胀（doc slop）的直接机械对抗，这在人类团队里几乎不需要。

## run-gates.ts：手写 DAG 调度器承载 CI lane 拓扑

机制：约 890 行：Gate 有 id/needs/env/allowFailure，图先验证（重复 id、未知依赖、环检测 :649-699）再执行；有界并发调度，依赖失败传播为 skip；按 mode 组装不同聚合（ci-primary/ci-consumers/ci-windows-*/doc-sync/check-all，:192-243）。build 显式 needs typecheck+lint+doc-typecheck 以避免 tsbuildinfo 竞争；本地 mode 把并发 cap 到 4（多个 doc gate 各建完整 ts.Program，内存会爆）。本地 hook 刻意薄：lefthook 只做 staged lint 自动修复、whitespace、vendor manifest 守卫、pre-push 增量 typecheck——'CI owns the full matrix'。

证据：scripts/run-gates.ts:1-7,130-146,192-243,256-284,649-699；lefthook.yml:1-3,52-56

价值：值得学的是分层哲学：本地 checkpoint 只留低延迟高命中的检查，穷举矩阵完全交给 CI，且'跑哪些检查'由 diff 决定（dsh-pre-push-checks skill）而非反射性全量。值得质疑的是自研调度器本身——见 questionable。

## 防腐四件套各拦一种腐化

机制：jscpd（.jscpd.json：minTokens 60 / minLines 6，tests 排除，例外只能用显式 ignore-start 区间标注'刻意平行的实现'）拦跨文件克隆；knip --treat-config-hints-as-errors 拦死文件/死依赖/死导出，knip.json 里每个包显式声明 entry/project 而非全局放宽；publint + verify-node-next-types 拦发布面：后者用一个外部 NodeNext 项目真实消费构建出的 d.ts；check-workspace-constraints.ts 拦工作区规则（vendored 包 private、cordis 全员 peer+dev、版本统一、ESM）。另有 built-bin smoke（run-gates.ts:618-643）：构建产物在 plain Node 下真实启动，抓 tsx 掩盖的模块解析/settle 竞争失败。

证据：.jscpd.json；knip.json；scripts/check-workspace-constraints.ts；scripts/publint-all.ts；scripts/verify-node-next-types.ts；scripts/run-gates.ts:618-643

价值：四者精确对应 AI 编码的四种典型腐化：复制粘贴而非抽取（jscpd）、改完留尸体（knip）、源码测试全绿但发布物坏掉（publint/node-next/built-bin smoke，动机是 postmortem 0001：default export 静默丢弃 inject，单测全绿产品全坏）、monorepo 约定靠 review 记不住（constraints）。

## tradeoffs
- Fixture 审阅负担真实存在：examples/acp-agent 下 78 个场景目录 + headless 11 个 + apps/web 约 60 个，每个含 input.json / session.jsonl / stdout.expected.jsonl / 可选 override 与 workspace；政策要求 review 每一处 JSONL diff。positional replay 意味着调用顺序一变就必须重录（需要 key），并发 subagent 场景当前无法表达（llm-replay/src/index.ts:545 的 XXX 标记）。
- 闸门本身是要养的代码：scripts/ 下 27 个 verify + 12 个 gen + run-gates 调度器 + 各自的 spec 文件，是一个不小的自有代码库；acp-snapshot 的 fixture 稳定化机制（stabilizeFixtureMessageIds 的 UUID 保留、refresh 的双射复用判定）已经深到 README 需要整段解释，能调试它的人很少。
- per-file 100% 的排除清单（vitest.config.ts:169-268 约百行）本身成为持续维护点，且'无断言测试刷覆盖率'的对冲手段（mutation testing）至今停留在 proposed——闸门的已知漏洞开着口。
- 重插桩套件的 coverage-exempt 双 gate、worker 预算切分（run-gates.ts:472-495）等都是为压 CI 墙钟时间付出的复杂度，说明这套穷举矩阵的算力成本已经高到需要专门工程。
- record 模式串行且花真实 API 配额；快照 tier 明确不提供 OS 级隔离（靠生成 cwd + 环境清洗 + 命令约束换确定性），沙箱隔离被推迟到 capability seam 的未来替换。

## learnables
- 在 capability seam（provider adapter 层）而非 HTTP 层做录制回放，且让产品自己的持久化 session log 兼任回放脚本和行为断言——前提是你有 append-durable 的事件日志且坚持'model-visible ⟺ logged'。这是本仓库最值得搬走的单项设计，也顺带把'日志完整性'变成被每次快照测试反复验证的性质。
- 回放器必须带 assertConsumed 式的欠消费检查：场景比录制时少发起了模型调用，同样是回归，静默通过的回放测试比没有更危险（llm-replay/src/index.ts:752-768）。
- 把 normalizer 定为封闭集合，跨平台差异用 fixture 声明（skip / 专用 sidecar）解决——'fix fixtures, not normalizers'一句话可以直接抄进任何快照测试规范。
- pin-one-tokenize-rest：每类 request header 只在一个场景 pin 完整内容到可读 sidecar，其余 token 化，让 prompt 变更的 diff 收敛到一处。
- 生成器与校验器合一（gen-x.ts 与 gen-x.ts --check），凡可从源码推导的文档一律生成，CI 卡新鲜度——这比'记得更新文档'可靠一个数量级。
- '未覆盖行优先怀疑是死代码'这个重构，对审 AI 生成代码特别有效：先问能不能删，再问要不要测。
- 'Verify the world, not the self-report'（docs/testing.md:27-29）：e2e 断言必须外部重读文件/重跑命令，对 agent 输出做关键词探测会被会作弊的 agent 骗过——这是 agent 产品测试特有的对抗性设计。
- 把闸门的已知失效模式和对冲计划写进决策记录（100% 覆盖 → 无断言测试 → mutation testing），让后人知道指标的边界在哪。
- 本地 hook 只留低延迟检查 + 按 diff 选择性跑检查，穷举矩阵完全归 CI——避免'每次 push 全量跑一遍'的反射。

## questionable
- 整套经济学建立在'agent 干活、劳动力近乎免费'之上（quality-gates note :11 原话：'a lot of work is not a cost argument when agents do the labor'）。小团队若人手维护 28 个 doc-sync gate、中英双语配对校验、字数预算 ratchet、Mermaid 解析校验、VitePress fragment 校验，会得到纯粹的仪式成本。这些只在'文档同时是 agent 上下文、且有 agent 无限劳动力'时成立。
- 'We are DeepSeek — do not ration real-API tests'（docs/testing.md:19）是典型的只在自家处境成立：推理对他们边际成本趋零，外部团队照抄 with-key 全场景 e2e 会烧钱。self-skip 机制值得抄，'不设预算'的态度不值得。
- per-file 100% 对小团队大概率是负资产：连本仓库都要靠百行排除清单 + TODO(gui) 债务标记才能维持，而防糊弄的 mutation testing 一直没落地。90-95% + 认真 review 未覆盖行的性价比更高；真正可迁移的是'per-file 防止互相补贴'和'未覆盖=死代码信号'两个思想，不是数字 100。
- 手写 890 行 DAG 调度器（run-gates.ts）与仓库自己的'prefer maintained dependencies over hand-rolling'政策存在张力——turborepo/nx 覆盖了大部分需求。他们的辩护理由（图校验、skip 传播、gate 级 env 注入是领域特定的）勉强成立，但小团队没必要重演。
- fixture 稳定化机制（refresh 时的 UUID 保留双射判定、packed timing envelope 展开对齐）为'最小化 review churn'付出了极深的算法复杂度，属于在 78 个场景规模下才回本的优化；场景少时直接全量重录更便宜。
- 快照 corpus 骑在 ACP transport 上是他们自己承认的历史包袱（acp-snapshot README 'Known Limitations'与 automation-only ACP 决策注记）：大部分场景测的是 assembled backend 而非 ACP 本身，理想形态是 transport 中立的 headless 套件——学的时候应直接从 transport 中立设计起步。