# Cordis 内核与组合层（vendored 插件框架 + profile/bundle/patch 分层组合）

DeepSeek Harness 的底座是 Cordis——源自 Koishi 聊天机器人生态的通用插件框架（Koishi 作者将其 v4 插件内核抽象为独立的 "Meta-Framework"，cordiverse 组织维护），提供 Context/Service/Fiber、依赖注入驱动的激活顺序、类型化事件和"注册即可回卷效果"的生命周期模型。DeepSeek 没有直接依赖 npm 上的 4.0.0-rc.7，而是把 cordis 及 8 个基础库整体 vendor 进 monorepo 并 rescope 到 @deepseek-ai scope，付出了 18 条本地修改（含多条深水区并发/生命周期修复）的持续维护成本，换来对框架层的完全所有权。其上的组合层把"默认配置"本身做成数据：每个 bundle 就是一个对空树的 patch 文件，profile 按序叠 bundle patch、用户 patch、命令行 overlay，任何一行默认配置都能被用户按 id 整体替换。这套设计解决的核心问题是：一个要发布给外部用户、且承诺"没有特权核心、一切可替换"的 agent 产品，如何让组合机制本身可审计（--dump-config 与实际 boot 共用同一个 patch 算法）、可热替换（effect/disposer 回卷）、甚至可被 agent 自我修改（cordis_run/stop 动态挂载）。

## Vendor 整个框架而非依赖 npm：所有权换维护债，且用制度防止 vendor 变成暗 fork

机制：cordis 4.0.0-rc.7 及 cosmokit/schemastery/loader/include/group/timer/hmr/logger-console 共 9 个包以源码形式复制进 vendor/，全部改名到 @deepseek-ai scope（pnpm linkWorkspacePackages 让原 semver range 解析到 pinned workspace）。直接动机很具体：每个 harness 包都把 cordis 声明为 peerDependency，发布 harness 就必须连带发布框架层，用上游原名发布等于在 registry 上抢注（squat）别人的包名。防暗 fork 的制度是三件套：vendor/README.md 强制 exhaustive 的本地修改日志（现有 18 条）、scripts/rescope-vendor.ts 机械化执行且可逆的改名（--apply --reverse）、hygiene gate（verify-vendored-links、rescope-vendor:check）持续断言 vendored 名字只解析到 workspace link。

证据：/Users/aaronguo/Work/lab/deepseek-harness/vendor/README.md:3-5（squat 理由与 link 断言）、:13-23（manifest 表）、:29-50（18 条修改日志）、:52-60（sync 程序）; /Users/aaronguo/Work/lab/deepseek-harness/docs/rescope.md:5,44-53

价值：这是"选第三方框架但不放弃控制权"的完整方案样本。值得注意的是修改日志暴露了真实代价：#6（fiber.ts 可重入 disposal 加固）、#8（Loader/Include 事务化配置 reconciliation）、#11（修复 inserted rows 不可 patch 的上游 bug）、#12（序列化 include 子树变更修死锁）、#15（移植上游 PR#41 的 lazy config resolution）——DeepSeek 实际承担了框架级并发正确性的工程责任，说明选一个 RC 阶段的框架时，vendor 不是省事而是把失控风险变成可见的维护账。

## 唯一的 patch 算法贯穿 boot 与工具链：--dump-config 结构性不可能与实际 boot 漂移

机制：cordis.yml 的 patch 语义是：按 id 定位行并整体替换其 config（不 deep-merge）、insert 追加行、name 不匹配则拒绝。这套语义的实现 applyEntryPatches 被从 include 插件的私有方法提取为导出纯函数（vendor 本地修改 #11），boot 时的挂载、profile 组合（composeEntries 对空列表应用全部层）、离线 dump（renderConfigDump）全部调用同一个函数。关键细节在 include/src/index.ts:96-101：patch 应用循环中边插入边重建 id 索引（buildMap(insert)），使后一层能定位前一层刚插入的行——上游原实现只在循环前建一次索引，bundle 插入的行对用户层是静默不可达的，这个 bug 会直接击穿"每一行可替换"的产品承诺。

证据：/Users/aaronguo/Work/lab/deepseek-harness/vendor/include/src/index.ts:43-128（applyEntryPatches，96-101 增量索引，121-124 整体替换）; /Users/aaronguo/Work/lab/deepseek-harness/packages/boot/app-boot/src/profile.ts:405-420（composeEntries 复用）; /Users/aaronguo/Work/lab/deepseek-harness/vendor/README.md:43（修改 #11 及其动机）

价值："配置工具绝不重新实现（从而漂移于）挂载算法"是所有 agent 配置系统都该抄的原则：dump/审计/flag 推导与真实 boot 共享同一个实现，等价性由结构保证而非测试保证。同时展示了整体替换 vs deep-merge 的刻意取舍：替换语义简单可预测、dump 可读，代价是覆盖方必须重述保留的所有字段（README 明确列入 Known Limitations），且迫使 bundle 作者把随 mode 变化的行放进 mode bundle 而非 base（base patch 文件头注释 6-10 行明确此规则）。

## 默认配置不是特权代码而是第一层 patch：profile→bundle→patch 的全数据化组合

机制：dsh-base bundle 的全部内容就是一个 cordis.patch.yml——对空 profile 根的单个 insert，插入约 60 行插件配置（模型适配器、工具、持久化、沙箱、遥测……）。bundle 是普通 npm 包，靠 package.json 的 dsh.bundle.patch 字段声明自己的 patch 文件；profile 是 $DSH_HOME/profiles/<name> 目录，manifest 的 dsh.profile.bundles 列出有序 bundle 层。boot 时层序固定：各 bundle 按序 → profile 自己的 cordis.patch.yml → home 级 cordis.patch.yml（覆盖所有 profile，故排后）→ --patch overlays（apps/cli/src/profile-boot.ts:132-151）。行激活顺序与行在文件中的顺序无关，由 inject 声明的服务可用性驱动。失败语义分级：patch 未命中 id 只 warn（允许 bundle 升级不炸用户旧 patch），bundle 缺 dsh.bundle 声明、patch 文件为空（应写 [] 而非留空）则直接 throw。

证据：/Users/aaronguo/Work/lab/deepseek-harness/packages/bundle/base/cordis.patch.yml:1-15,180,186; /Users/aaronguo/Work/lab/deepseek-harness/packages/bundle/headless/cordis.patch.yml:7-15（id 定位覆盖 base 行）; /Users/aaronguo/Work/lab/deepseek-harness/apps/cli/src/profile-boot.ts:132-170; /Users/aaronguo/Work/lab/deepseek-harness/packages/boot/app-boot/src/profile.ts:385-402; /Users/aaronguo/Work/lab/deepseek-harness/docs/architecture.md "Profiles and bundles" 一节; /Users/aaronguo/Work/lab/deepseek-harness/packages/boot/app-boot/README.md:38,43-45

价值：把"产品默认值"降格为与用户配置同构的一层数据，是"没有特权核心"承诺的真正落地：dsh --profile web --dump-config 打印的每一行都注明来源文件与所经 patch 层，用户覆盖任何一行与官方定义它用的是同一机制、同一语法。对比常见的"内置默认在代码里 + 配置文件浅覆盖"方案，这里默认值可 diff、可整层禁用、可被第三方 bundle 插队。

## effect/disposer 递归模型：插件挂载本身是父 fiber 的一个 effect，热替换与 self-modification 是同一机制的两个消费者

机制：ctx.effect(execute) 立即运行 execute、收集其产出的 disposer（支持单个、Promise、以及保证 teardown 顺序的 generator 逐个 yield），fiber 卸载或显式 dispose 时逆序执行（fiber.ts:427-442）；UNLOADING 状态拒绝新 effect（:420-422，本地加固，防止 cleanup 期注册逃逸卸载快照）。递归根基在 fiber.ts:265：ctx.plugin() 挂载子插件时，把子 fiber 的整个生命周期注册为父 fiber 上的一个 effect——于是整棵插件树的卸载就是一次普通的 disposer 逆序回卷。上层消费者一：watchUserPatches 监听 cordis.patch.yml，每次变更事务化重组 patch 层，候选失败则保留 last good tree 运行（app-boot README:45）。消费者二：extensions/tool-cordis 的五个模型可见工具（cordis_inspect/define/run/stop/undefine）让 agent 在运行时向自己的进程挂载/卸载插件，cordis_stop 就是 dispose 到 quiescence。测试政策强制闭环：任何 registry 贡献必须通过 HMR-safety 测试——dispose fiber 并观察注册消失。

证据：/Users/aaronguo/Work/lab/deepseek-harness/vendor/cordis/src/fiber.ts:265-297,402-454; /Users/aaronguo/Work/lab/deepseek-harness/vendor/README.md:38（修改 #6 加固清单）; /Users/aaronguo/Work/lab/deepseek-harness/packages/extensions/tool-cordis/README.md:11-19; /Users/aaronguo/Work/lab/deepseek-harness/packages/boot/app-boot/README.md:45; /Users/aaronguo/Work/lab/deepseek-harness/packages/CLAUDE.md（"Registry contributions prove disposal"）

价值：这是全仓库杠杆率最高的一个抽象：热重载、配置回滚、subagent isolate 隔离、agent 自我修改，全部不是独立特性而是"注册可回卷"的自然推论。但 vendor 修改 #6 那一大段可重入 disposal 加固同时证明：这个模型的正确性成本极高——setup 内触发 unload、异步 cleanup 与新注册竞态、teardown 通知互相饿死，每一个都是上游没堵住的洞。借鉴模型容易，低估它的并发深水区会翻车。

## !!js 惰性表达式：配置文件里受限的图灵完备，插值点被精确限定

机制：include 把 YAML 里的 !!js 解析为表达式节点但不立即求值。求值时机与上下文被精确规定：entry 的 config 在其声明的注入服务全部激活后、以该插件自己的 ctx 求值（本地修改 #15 移植的 lazy resolution：headless bundle 里 task: !!js ctx.headlessStartup.task 能引用另一个插件提供的服务）；disabled 在每次 mount 决策时以 loader 上下文求值（base bundle 用 disabled: !!js process.platform === 'win32' 实现一份 patch 文件按平台恰好挂一套 shell 栈），且 disabled 是唯一被插值的 metadata 字段——id/name/inject 等保持字面量，保证组合结构静态可分析。dump 工具原样打印表达式而非求值结果。

证据：/Users/aaronguo/Work/lab/deepseek-harness/vendor/loader/src/config/entry.ts:101-107; /Users/aaronguo/Work/lab/deepseek-harness/docs/cordis-primer.md:36-38; /Users/aaronguo/Work/lab/deepseek-harness/vendor/README.md:47,50（修改 #15、#18）; /Users/aaronguo/Work/lab/deepseek-harness/packages/bundle/base/cordis.patch.yml:101,151,180,186; /Users/aaronguo/Work/lab/deepseek-harness/packages/bundle/headless/cordis.patch.yml:35

价值：值得注意的是边界划法而非机制本身：表达式只允许出现在"值"的位置（config、disabled），组合拓扑（哪些插件、什么依赖）永远是字面数据，所以 dump/组合图/静态 gate 仍然可靠。这是"配置需要一点动态性"时比模板字符串或全量 JS 配置文件都更克制的中间点——但它仍意味着配置可执行任意代码，仓库另用规则限死 !!js（禁 !js）的许可位置。

## tradeoffs
- 框架正确性责任内化：18 条 vendor 本地修改中至少 5 条是并发/生命周期/事务性的深度修复（fiber 可重入 disposal、include 子树变更死锁、配置 reconciliation 回滚），相当于养了一个小型框架团队；每次 upstream sync 都要逐条 re-apply 或论证退役，且已出现文档漂移迹象（manifest 表记 cordis 4.0.0-rc.7，vendor/cordis/package.json 实为 4.0.1）。
- 概念负担陡峭：fiber/effect/waterfall/inject/isolate/entry/patch/overlay/profile/bundle 十来个必须先学会的概念，仓库为此写了 primer、tutorial、生成式 API catalog 和 composition graph——文档本身成了需要 gate（doc-sync、budgets）维护的第二套代码。
- 整体替换 patch 语义把负担转给覆盖方：用户改一个字段必须重述该行全部保留字段，bundle 升级新增字段时旧用户 patch 会静默丢掉新默认值（patch 未命中只 warn 不 fail 的宽松语义加剧了这一点——换来的是 bundle 演进不炸用户，代价是用户 patch 可能静默失效）。
- 配置获得图灵完备性：!!js 让 cordis.yml 可执行任意 Node 代码，信任模型上配置文件等同于代码，供应链/审计视角必须把 patch 文件当可执行物对待；仓库靠 verify-cordis-config 等 gate 兜底，脱离这些 gate 单独照搬语法是危险的。
- boot 路径本身成为一个子系统：两锚点 bundle 解析、profiles/node_modules symlink 自愈（healProfilesModuleFallback）、entries loaded/activated 双重审计、fail-loud 与 teardown 竞态处理——灵活组合把复杂度从"改代码"移到了"启动与解析"，这部分代码的失败模式（插件解析不到、服务永远 pending）比硬编码 import 难诊断得多。

## learnables
- "同一算法只许一个实现"：dump/审计/组合工具必须复用挂载路径的真实算法（applyEntryPatches 提取为导出纯函数），让"打印的配置 = 实际生效的配置"由结构保证。这条不依赖 Cordis，任何 agent 配置系统当天就能采用。
- "注册即效果、返回 disposer"作为统一底座：把 prompt 段、工具 schema、事件监听、子插件全部走同一个 effect/disposer 通道，热重载、失败回滚、子 agent 隔离、运行时自我修改就从四个特性坍缩成一个机制的四个调用方。哪怕手写一个 50 行的 DisposableList 也值得先立这个约定。
- 把产品默认值做成与用户配置同构的数据层（bundle = patch 文件），而不是代码里的隐式默认 + 浅覆盖：换来完全透明的 --dump-config 和"官方与用户用同一种覆盖机制"的对称性。
- patch 语义选整体替换而非 deep-merge：可预测性优先，宁可让覆盖方重述字段，也不让读者猜 merge 规则；配合"未命中 warn、结构错误 throw"的分级失败语义，区分层间松耦合与真正的配置错误。
- vendor 第三方代码的最低纪律三件套：exhaustive 修改日志（每条含动机与覆盖测试）、机械化且可逆的改名/同步脚本、CI gate 持续断言 vendored 状态——缺任何一件，vendor 都会退化为无法跟 upstream 的暗 fork。
- 动态表达式只放在值位置、组合拓扑保持字面量：需要环境自适应配置时，限定插值点（config/disabled）比全量 JS 配置文件保留了静态可分析性。
- 自我修改能力的安全分层可以抄：cordis_define 只记录不执行、cordis_run 显式执行且动态包只活在进程内存、绝不写盘不改 cordis.yml 不跨重启——"实验"与"持久化"之间强制人手介入，README 并直言 sandbox 是对诚实代码的 containment 而非安全边界。

## questionable
- vendor + rescope 全套只在 DeepSeek 的处境下成立：它要发布 harness、框架是 peerDependency（发布即连带发布框架层，原名会 squat registry）、上游还在 RC、且有人力持续 sync。一个不发布框架层、或框架已 stable 的团队，pin npm 精确版本 + patch-package 处理个别 bug 的成本低一个数量级——不要把这里的 vendor 当通用最佳实践。
- 选择 4.0.0-rc.7 这个未发布的 RC 作为产品地基本身值得质疑：18 条本地修改里的多条并发修复正是 RC 成熟度的直接后果，等 stable 或选更成熟框架可能省掉其中大半。它成立的前提是 DeepSeek 有能力也有意愿实质上共同维护这个框架（部分基础库已在 deepseek-harness 组织下 fork）。
- "一切皆插件"推到 219 个 package 的粒度（todo 工具、plan mode、session 标题生成各自成包）服务于"每一行可替换"的产品承诺，但每个包都背 README 双语、invariant、100% per-file coverage、JSDoc gate——小团队照搬这个粒度而不搬配套纪律，只会得到 219 个没人维护的目录；把插件边界画在"确有替换需求"的缝上即可。
- !!js 可执行配置对多租户/托管场景基本不可用（配置提交者即代码执行者）；DeepSeek 的 CLI 单机信任模型里成立，搬到服务端 agent 平台前必须先替换为受限表达式语言。
- patch 未命中只 warn 的宽松语义是双刃剑：用户 patch 引用已被 bundle 删除/改名的行时静默失效，长期运行的用户配置会悄悄腐烂；如果你的用户更少、升级更集中，未命中直接 fail 可能是更诚实的选择。
- 整体替换无 deep-merge 在行 config 膨胀后会恶化：base bundle 的 telemetry 行已有十余个嵌套字段，用户只想改 endpoint 也得整段重述——仓库自己都把它列进 Known Limitations，说明这是已知痛点而非终态设计。