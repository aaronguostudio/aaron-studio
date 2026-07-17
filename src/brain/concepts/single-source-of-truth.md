---
type: concept
date: 2026-07-16
updated: 2026-07-16
title: "Single Source of Truth"
aliases: [SSOT, Single Source of Truth, 单一事实来源, 唯一可信来源, 权威数据源]
domain: [information-architecture, data-systems, knowledge-management]
tags: [authority, data-lineage, synchronization, derived-artifacts, drift]
status: active
maturity: growing
related:
  - "[[concepts/data-lineage]]"
  - "[[concepts/event-sourcing]]"
  - "[[concepts/cqrs]]"
  - "[[concepts/idempotency]]"
---

# Single Source of Truth · 单一事实来源

> **一句话：同一个事实可以有很多副本，但必须有且只有一个被授权回答“现在是什么”的来源；其他版本都要声明自己如何从它产生、多久会过期、怎样重新生成。**

[打开互动解释页](pages/single-source-of-truth.html)

## 它在解决什么问题？

当同一条信息出现在数据库、缓存、搜索索引、报表、文档和生产页面里，真正危险的不是“有副本”，而是：**每个副本都看起来可以被直接修改，却没有人知道冲突时该信谁。**

于是系统会出现一种很常见的失败：

```text
source.md       says v3
blog copy       says v4
search index    says v2
production      says v3 + one manual hotfix

Question: which one is true?
Answer: nobody knows.
```

这叫 **drift（漂移）**：本来应该由同一源头派生的表示逐渐分叉，最后任何一次同步都可能覆盖正确修改。

Single Source of Truth（SSOT，单一事实来源）不是要求全世界只保存一份数据，而是建立一个 **authority contract（权威契约）**：

1. 谁拥有这个事实的写入权？
2. 更新应该从哪里流向哪里？
3. 下游副本允许落后多久？
4. 发生分叉时，以谁为准、怎样修复？

## 为什么来自最近的交付？

我们刚建立的 Learn / Pattern Atlas 流程本身就是一个 SSOT 例子：

```text
Brain Markdown                 Public package               Blog repo                 Production
语义权威源            ──────►  双语发布包          ──────►  站点内容副本      ──────►  Git-triggered deploy
src/brain/concepts             src/content/concepts          content/learn              public site
```

- Brain Markdown 决定概念真正表达什么。
- Public package 是准备发布的双语投影。
- Blog repo 保存站点可以消费的副本。
- Production 是某个已提交 `main` revision 的部署结果。

如果只在 blog copy 里改一句简介，页面暂时看起来正确，但源头仍然是旧内容。下一次 publish 很可能把修改覆盖掉。正确修复不是“再复制一次”，而是：**先确定权威源，在源头修正，再重新生成下游。**

这个 pattern 同样出现在配置、设计 token、人物设定、任务状态和发布规则里。凡是出现“到底该改哪一个文件”的问题，通常都应该先检查 SSOT 是否清楚。

## 先用一个生活类比：旅行行程表

一家人准备旅行，群里出现了很多行程副本：

- 一份共享行程表；
- 三张旧截图；
- 一封航空公司确认邮件；
- 每个人日历里的航班事件。

副本多没有问题。真正重要的是先约定：

- 航班是否存在，以航空公司订单为准；
- 家庭集合时间，以共享行程表为准；
- 截图只是方便查看，不能拿它反向修改行程；
- 订单变化后，由谁更新共享表与日历。

这里甚至没有一个文件统治所有事实。**SSOT 的粒度应该是“某一类事实由谁拥有”，而不是强迫整个世界进入一张巨型表。**

## 它怎样工作？

### 1. 先定义事实边界

不要问“整个系统的 source of truth 是哪个数据库”，而要问：

- 客户法定姓名由哪个系统拥有？
- 商品可售库存由哪个服务拥有？
- 页面内容由哪个文件拥有？
- 生产版本由哪个 commit 与部署记录拥有？

一个服务可以拥有客户订单，却不应该顺便拥有客户的全部身份资料。边界越含糊，双向同步越容易出现。

### 2. 指定唯一写入路径

SSOT 的核心不是“读都去一个地方”，而是 **同一事实的权威修改只有一条入口**。

其他系统可以：

- 读取权威源；
- 订阅事件；
- 保存缓存或只读副本；
- 构建搜索索引、materialized view（物化视图）或报表。

但它们不应悄悄成为第二个可以独立改写同一事实的主人。

### 3. 给派生物加上 lineage

Data Lineage（数据血缘）回答“它从哪里来”。一个健康的派生物至少应该知道：

```text
derived_from = source identifier
source_version = commit / offset / version
generated_at = timestamp
refresh_policy = on commit / every 5 min / nightly
rebuild_command = deterministic procedure
```

这样看到旧数据时，系统知道它是“允许落后”，还是已经断掉。

### 4. 让同步尽量单向、可重复

最稳的结构通常是：

```text
one authority ──► many projections
```

而不是：

```text
A ⇄ B ⇄ C ⇄ A
```

派生过程最好具备 Idempotency（幂等性）：用同一个源版本重复生成，结果仍然相同。这样重试和重建不会不断制造新差异。

### 5. 定期检测 drift

SSOT 不能只靠团队记忆。可以使用：

- 内容 diff 或 checksum；
- schema / config validation；
- Git dirty check；
- source version 标记；
- reconciliation job（对账任务）；
- 写权限与 code-owner 规则。

目标不是禁止所有临时操作，而是让偏离可以被看见、解释和恢复。

## 一个技术例子：服务、缓存和搜索索引

假设 Order Service 拥有订单状态：

```text
Order Service / write model        authoritative
              │ order.updated event
              ├────────► Search index      derived, searchable
              ├────────► Analytics table   derived, delayed
              └────────► Recommendation    derived, partial
```

退款时必须问 Order Service，因为它拥有完整交易历史。推荐服务里的 `last_order_status` 即使更快，也只是 eventually consistent（最终一致）的副本。

这个设计允许多个物理副本，也允许下游使用不同 schema。它只坚持一件事：**副本不能因为更方便查询，就获得定义订单事实的权力。**

## SSOT 不是“永远正确”

Authority（权威性）与 correctness（正确性）是两件事。

SSOT 可能因为 bug、错误录入或过期规则而记录错误。它的价值是：发生问题时，团队知道应该在哪里修正，并能有方向地重新生成下游。没有 SSOT 时，同一个错误要在许多地方分别修，而且没人知道是否漏掉了某个副本。

所以更准确的说法是：

> SSOT 保证“冲突时知道由谁裁决”，不保证“裁决者永远不会犯错”。

## 什么时候适合？

### 很适合

- 同一实体被多个系统读取或展示。
- 数据需要审计、追踪或稳定发布。
- 存在缓存、报表、搜索索引和本地副本。
- 团队经常不知道“这次修改应该落在哪个文件”。
- 下游可以从权威源重新生成。

### 要谨慎

- 全球多主写入、离线优先协作或 partition（网络分区）期间必须继续写入。
- 一个中央系统会成为不可接受的延迟、可用性或组织瓶颈。
- 事实本身来自多个独立主体，不能由单方裁决。
- “一个巨大数据库”正在破坏 domain boundary（领域边界）。

这些场景不等于放弃权威，而是可能要把 authority 按领域切分，或显式使用 conflict resolution（冲突解决）、CRDT（Conflict-free Replicated Data Type，无冲突复制数据类型）等多写者模型。

## 发生分叉时怎样修复？

一个实用恢复流程：

1. **Freeze**：暂停会继续扩大分叉的写入或发布。
2. **Name the fact**：明确冲突的是哪一类事实，不要一上来比较整个系统。
3. **Choose authority**：根据所有权、完整性、时间线和审计证据确认权威源。
4. **Reconcile**：把下游独有且正确的修改带回源头，而不是直接抹掉。
5. **Regenerate**：从已修复的源重新生成所有派生物。
6. **Guard**：补上版本标记、diff check、写权限或单向发布脚本。

关键是先找回 **authority**，再恢复 **consistency**。如果不先决定谁有裁决权，所谓“同步”只是随机选择一个覆盖另一个。

## 相关概念地图

### Canonical Source（规范源）

被正式选为权威表示的具体来源。Canonical source 更像“哪个文件 / 表 / 日志是标准版本”；SSOT 是围绕它建立的所有权、同步和恢复原则。

### Data Lineage（数据血缘）

记录数据从哪里来、经过哪些转换、由哪个版本产生。SSOT 决定源头；lineage 让我们沿着派生链找到源头。

### Materialized View（物化视图）与 Cache（缓存）

为了读性能而保存的派生表示。它们可以非常重要、甚至持久化，但通常不拥有事实；理想情况下可以失效并从源头重建。

### Event Sourcing（事件溯源）

把按时间排序的事件日志作为权威记录，再通过 replay（重放）计算当前状态和读取模型。它是实现 SSOT 的一种方式，不是 SSOT 的同义词。

### CQRS（Command Query Responsibility Segregation，命令查询职责分离）

把写入模型与读取模型分开。写侧可以是权威源，读侧是为查询优化的 projection（投影）。分离之后要显式处理同步延迟与 stale read（过期读取）。

### MDM（Master Data Management，主数据管理）

在组织层面治理客户、产品、供应商等核心实体的定义、所有权、质量与分发。它常常使用 SSOT 思想，但范围更偏企业数据治理。

### Single Version of Truth（SVOT，单一版本的真相）

常用于分析和管理语境，强调所有人看到同一套经过统一口径处理的结果。SSOT 更强调 authority 在哪里；SVOT 更强调消费端对定义与结果达成一致。二者相关，但不完全相同。

### Replication（复制）

为了可用性、容灾或读扩展保存多个物理副本。复制节点可以接管服务，但系统仍需要明确 leader、quorum（法定人数）或冲突解决协议；“有很多 replica”不等于“有很多互不相关的真相”。

## 常见误区

### “SSOT 就是所有东西放进一个数据库”

不是。一个数据库可以包含互相矛盾的表；多个数据库也可以通过清晰的领域所有权形成健康的 SSOT。关键是 authority，不是物理集中。

### “有了 SSOT，就不应该有副本”

副本对性能、可用性、搜索、分析和发布都很重要。真正要避免的是 **undeclared authority（未经声明的权威）**。

### “离用户最近的版本就是最新、最可信的”

缓存可能更新更快，也可能落后；生产页面可能有临时 hotfix。可见性和权威性不能混为一谈。

### “双向同步最灵活”

双向同步意味着两个系统都能产生新事实，于是需要冲突检测、合并语义、顺序和删除传播。若业务并不真正需要多主写入，单向派生通常更容易推理和恢复。

### “把文件命名为 canonical 就完成了”

如果团队仍然可以绕过它直接改下游，而且没有 drift check 或重建路径，这只是标签，不是系统保证。

## 最小记忆卡

- **一个事实可以有多个副本，但只能有一个明确的裁决者。**
- SSOT 是 authority contract，不是“一张巨型表”或“只存一份”。
- 每个派生物都应知道 source、version、freshness 和 rebuild path。
- 最稳的方向通常是一个权威源向多个 projection 单向流动。
- 先在源头修，再重新生成下游；直接改派生物会制造 drift。
- SSOT 让错误可以集中修复，但不会让权威源自动变正确。

## 自测

1. 你的系统里哪三类事实最容易出现“到底信谁”的争论？
2. 哪些页面、缓存或报表其实是派生物，却可以被直接编辑？
3. 如果删除一个搜索索引，能否只靠权威源完整重建？
4. 当生产与 Git 内容不一致时，你的恢复方向是什么？
5. 一个事实需要多主写入时，你是否显式定义了冲突语义？

## Further reading

- [Microsoft Azure Architecture Center · Data considerations for microservices](https://learn.microsoft.com/en-us/azure/architecture/microservices/design/data-considerations) — 解释一个服务拥有实体权威、其他服务保存最终一致副本的边界。
- [Microsoft Azure Architecture Center · CQRS pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs) — 写模型、读取模型、物化视图与 Event Sourcing 的关系。
- [HashiCorp · Purpose of Terraform State](https://developer.hashicorp.com/terraform/language/state/purpose) — state 如何映射配置与真实资源，以及团队为什么需要共享状态与锁。
- [Kubernetes · Declarative Management Using Configuration Files](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/) — configuration files、live objects 与 declarative writer 之间的关系。
- [Microsoft · Maintain an architecture decision record](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record) — 用可追踪的统一资料库保存关键决策与变更历史。
