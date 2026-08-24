---
type: reading
date: 2026-08-22
updated: 2026-08-22
title: "TypeScript 7.0 Native Toolchain"
aliases: [TS 7, TypeScript 原生工具链]
domain: [compiler, developer-tooling, javascript]
tags: [typescript, go, compiler, lsp, parallelism, migration]
status: active
maturity: growing
related: []
---

# TypeScript 7.0 · Native Toolchain

> **一句话：** TypeScript 7.0 的核心不是增加一批语言语法，而是把 TypeScript 编译器与语言服务移植到 Go；它以原生执行、共享内存并行与 LSP 换来了数量级更短的反馈回路，同时暂时牺牲了稳定的编程 API。

## 为什么值得学

在大型 TypeScript 仓库里，类型检查、编辑器加载、自动补全、跳转与 CI 往往是同一条反馈链上的等待。TS 7 改变的是这条链的基础设施，而不是把某个 type trick 再变得花哨一些。

微软在 2026-07-08 发布稳定版。官方基准中，完整构建常见加速为约 8–12 倍：VS Code 从 125.7 秒到 10.6 秒，Sentry 从 139.8 秒到 15.7 秒。把这些数字理解为**特定项目与机器上的方向性证据**，不是所有仓库都能照抄的 SLA。

## 它实际改变了什么

### 1. JavaScript 实现 → Go 原生实现

移植并不是从零重写类型系统。团队尽量维持 TS 6.0 的结构与逻辑，让同一输入得到相同的检查结果；对已开启 `stableTypeOrdering`、且不依赖 TS 6 过时选项的项目，目标是与 TS 6.0 行为一致。

收益来自三件事：原生代码速度、共享内存多线程，以及为新实现重做的一些性能路径。重要推论是：**TS 7 的价值主要是让既有正确性检查更快发生，而不是让类型规则本身大幅改变。**

### 2. 并行成为编译器的一等能力

解析、检查与 emit 中可独立的工作会并行执行。三个新的实验性控制项值得知道：

- `--checkers`：类型检查 worker 数，默认 4。增大通常有利于大项目与高核机器，但会增加内存，也可能暴露极少数依赖检查顺序的结果。
- `--builders`：`--build` / project references 下并行构建的项目数。它与 `--checkers` 相乘；例如 4 × 4 最多可能同时运行 16 个 checker，不应盲目开满。
- `--singleThreaded`：关闭全局并行，用于调试、低资源 CI，或已在外部编排并行的场景。

这里的心智模型不是「CPU 越多就永远越快」，而是 **wall-clock time、memory pressure 与依赖图并行度之间的取舍**。CI 应先量测，再为不同 runner 固定一个可复现配置。

### 3. `--watch` 与编辑器体验被重建

`--watch` 使用了从 Parcel watcher 移植到 Go 的跨平台文件监听基础，避免纯轮询在大 `node_modules` 树上的资源消耗。语言服务改用标准 Language Server Protocol（LSP），所以快的不只是 `npx tsc`：项目首次加载、diagnostics、find references、completion、hover 和导航也都在加速范围内。

对 agentic coding 也有实际含义：当「修改 → 类型检查 → 再修改」变短，验证可以更频繁嵌入任务循环；但它仍然只验证类型和 TS emit，不能替代单元测试、真实浏览器验证或生产检查。

### 4. 少量直接可见的语言 / 分析变化

- **Unicode template-literal inference**：`"😀abc"` 在 `${infer Head}${infer Tail}` 中会得到 `["😀", "abc"]`，不再把一个 emoji 分成 UTF-16 surrogate halves。大多数人会觉得更自然；刻意按 UTF-16 code units 实现字符串长度的 type-level 工具需要重审。
- **`.js` + JSDoc 规则更接近 `.ts`**：不再接受一些宽松 / Closure 风格写法，例如把 value 当 type、特殊 `@enum`、裸 `?`、以 `@class` 让 function 成为 constructor、postfix `!`、旧式 `function(string): void`。纯 JS 仓库的升级测试要比纯 TS 仓库更谨慎。

## 7.0 的真正边界：工具生态，而非类型检查

TS 7.0 **不提供稳定的 programmatic compiler API**；微软预计从 7.1 开始提供新的、且不同的 API。因此不能直接假设「任何依赖 `typescript` 包的工具都可升级」。

特别需要审计的对象：

- `typescript-eslint`、自定义 ESLint rule、TS transformer、代码生成器、Webpack loader、文档生成器；
- Vue / Volar、MDX、Astro、Svelte 等把 TS 嵌入自己的编译或语言服务的工作流；
- Angular template type-checking（官方建议可先用 7 跑 CLI 全项目检查、保留 6 提供编辑器支持）。

这不是「TS 7 不成熟」的泛泛结论，而是 7.0 的刻意过渡设计：CLI、emit、watch、project references 与多数 editor 功能已可用；**直接 import compiler API 的生态仍是升级闸门**。

## 从 TS 5.x / 6.0 迁移时，哪些不是 7.0 新语法而是硬错误

TS 7 将 TS 6 的过时项变为不能再忽略的错误。最容易影响配置的项目是：

- 默认值已改为：`strict: true`、`module: esnext`、动态 `target`、`noUncheckedSideEffectImports: true`、`libReplacement: false`、固定开启 `stableTypeOrdering`；
- `rootDir` 默认是 `./`，所以 `tsconfig` 与 `src/` 分离时通常要显式设为 `./src`；
- `types` 默认是 `[]`，依赖 Node/Jest/Bun 等全局类型时应显式列出（如 `types: ["node", "jest"]`），而不是依赖整个 `@types` 树被自动纳入；
- 已移除：`target: es5`、`downlevelIteration`、`moduleResolution: node/node10/classic`、`module: amd/umd/systemjs/none`、`baseUrl`、`outFile`；
- 不再允许将 `esModuleInterop`、`allowSyntheticDefaultImports` 或 `alwaysStrict` 设为 `false`；namespace 必须用 `namespace`，不是旧的 `module`；import attributes 使用 `with`，不是 `assert`；在存在 `tsconfig.json` 的目录中，不能直接 `tsc file.ts`，除非显式 `--ignoreConfig`。

因此最平滑的路线不是 5.x → 7.0 一步跳，而是先让项目通过 TS 6 且**没有** `ignoreDeprecations` 依赖，再切 7.0。

## 对 Aaron Studio 的当前判断

当前仓库明确声明 TypeScript 的两处 Remotion 子项目仍使用 `typescript: ^5.0.0`；它们的 `tsconfig` 已显式设置 `target: ES2018`、`module: commonjs`、`strict: true`、`esModuleInterop: true`，因此不直接受「默认值改变」影响。

但这并不等于可以现在批量升级：它们仍跨过 TS 6 的过渡层，而且视频渲染链会调用 Remotion CLI。正确下一步是隔离一个升级试验，先确认 Remotion 及相关 lint/build 工具是否依赖 TypeScript 的编程 API，再比较 TS 6 与 TS 7 的 `--noEmit` / render 行为。没有性能瓶颈时，现阶段不应为版本号本身付迁移成本。

## 可重复的采用实验

先在独立分支或临时工作目录进行，不改生产锁文件：

1. 升到 TS 6，移除 / 修复全部 deprecation，并固定显式的 `rootDir` 与 `types`。
2. 用当前 TypeScript 记录基线：`npx tsc --noEmit --extendedDiagnostics`；有 project references 时也记录 `npx tsc -b --extendedDiagnostics`。
3. 安装 TS 7，再运行同一命令；对错误数、wall-clock time、峰值内存和 output diff 作比较。
4. 若工具需要旧 API，按官方方式并装兼容包：让 `typescript` 指向 `@typescript/typescript6`（提供 `tsc6` 和 6.0 API），另把 TS 7 作为别名安装以提供默认 `tsc`。这能把「构建加速」与「依赖旧 API 的工具」分开验证。
5. 若使用 Vue / Svelte / Astro / MDX / Angular 模板检查，分别验证 CLI 与 editor；不要只看 CLI 绿灯。

只有同一仓库的类型检查、测试、构建 / render 与编辑器工作流都通过后，才值得把升级带到 CI。

## 可复习的记忆卡

- TS 7 = Go 原生工具链 + 并行 + LSP；不是 TypeScript 语法大版本。
- 8–12× 是官方真实项目的基准范围，不是对任意项目的承诺。
- `--checkers`、`--builders` 的快来自并行，也用内存付费；两者会相乘。
- 最大风险不是业务 TS 代码，而是**调用 TypeScript API 的工具链**。
- 先过 TS 6 的配置迁移，再上 TS 7；需要旧 API 时可并装 6 与 7。

## Sources

- Microsoft TypeScript Team, [Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) (2026-07-08).
- Microsoft TypeScript Team, [Announcing TypeScript 6.0](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) (2026-03-23).
- Microsoft, [TypeScript 7 staging repository README](https://github.com/microsoft/typescript-go/blob/main/README.md) (reviewed 2026-08-22).
- Anders Hejlsberg, [A 10x Faster TypeScript](https://devblogs.microsoft.com/typescript/typescript-native-port/) (2025-03-11).
