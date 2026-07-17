---
title: '单一事实来源'
fullName: 'Single Source of Truth · 单一事实来源'
shortName: 'SSOT'
description: '让每一类事实只有一个权威拥有者；其余副本都可追踪、可过期、可重建。'
mentalModel: '一个事实可以有很多副本，但只能有一个地方被授权回答“现在是什么”。'
date: '2026-07-16'
updated: '2026-07-16'
domain: '信息系统'
domainKey: 'information-systems'
tags: ['权威来源', '数据血缘', '同步', '知识系统']
maturity: '持续生长'
published: true
featured: false
translationKey: 'single-source-of-truth'
interaction: 'single-source-of-truth'
neighbors:
  - name: 'Canonical Source'
    fullName: 'Canonical Source · 规范源'
    category: '权威机制'
    summary: '被正式选为某类事实权威表示的具体文件、存储或日志。'
  - name: 'Data Lineage'
    fullName: 'Data Lineage · 数据血缘'
    category: '来源追踪'
    summary: '记录数据来自哪里、经过哪些转换，以及由哪个源版本产生。'
  - name: 'Materialized View'
    fullName: 'Materialized View · 物化视图'
    category: '派生投影'
    summary: '为查询保存的派生表示；它可以落后，并且应该能从源头重新生成。'
  - name: 'Event Sourcing'
    fullName: 'Event Sourcing · 事件溯源'
    category: '实现模式'
    summary: '把按顺序排列的事件日志作为权威记录，通过重放构建当前状态。'
  - name: 'CQRS'
    fullName: 'Command Query Responsibility Segregation · 命令查询职责分离'
    category: '架构模式'
    summary: '把权威命令与读优化投影分开，同时引入明确的同步边界。'
  - name: 'SVOT'
    fullName: 'Single Version of Truth · 单一版本的真相'
    category: '消费共识'
    summary: '让消费者对一套定义或结果达成一致；它与确定权威位置相关，但并不相同。'
sources:
  - title: 'Microsoft · 微服务的数据考量'
    url: 'https://learn.microsoft.com/en-us/azure/architecture/microservices/design/data-considerations'
  - title: 'Microsoft · CQRS 模式'
    url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs'
  - title: 'HashiCorp · Terraform State 的用途'
    url: 'https://developer.hashicorp.com/terraform/language/state/purpose'
  - title: 'Kubernetes · 声明式对象配置'
    url: 'https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/'
---

# 单一事实来源

Single Source of Truth（SSOT，单一事实来源）解决的是所有重复信息背后的同一个问题：**当多个副本互相矛盾时，谁有权决定“现在是什么”？**

它的答案不是“删除所有副本”。缓存、搜索索引、报表、replica（副本）、双语发布包和生产页面都很有用。这个 pattern 要做的是：让一个边界清楚的事实只有一个权威拥有者，其余表示都成为可追踪的派生物。

## 它要阻止的失败：drift

假设同一篇文章出现在四个地方：

```text
source.md       version 3
public package  version 3
blog copy       version 4
production      version 3 + 一次手工 hotfix
```

四个版本看起来都合理。下一次同步却可能删掉最好的修改，因为没有人知道更新应该朝哪个方向流动。这就是 **drift（漂移）**：本来应该一致的表示悄悄分叉。

一个健康的 SSOT 会明确四件事：

1. 谁可以定义这个事实？
2. 更新从哪里流向哪里？
3. 一个派生副本允许落后多久？
4. 分叉以后怎样重建或对账？

## 一个事实一个主人，不是所有东西一个数据库

Authority（权威）应该按事实或领域划分：

- Order Service 拥有订单生命周期；
- 身份系统拥有客户法定姓名；
- source Markdown 拥有一篇文章真正表达的意思；
- 已提交的 main revision 拥有生产 release。

这些事实不需要住在同一个物理存储里。相反，把无关领域强塞进一个巨大数据库，可能让所有权更模糊。

一个很好用的判断题是：**哪个系统有权发起一次修正？** 其他系统可以读取、订阅、缓存、索引、翻译或投影这个事实，但不能悄悄成为第二个独立写入者。

## 一个实用发布链

```text
权威源 ──► 公开内容包 ──► 站点副本 ──► 部署结果
在这里修改       派生          派生         发布证据
```

一个健康的派生物应该带有足够的 Data Lineage（数据血缘）：

```text
derived_from   = 源标识
source_version = commit / offset / version
generated_at   = 生成时间
refresh_policy = 每次提交 / 每五分钟 / 每晚
rebuild_path   = 可重复的命令或流程
```

最容易推理的默认结构，是单向、可重复地生成。`A ⇄ B ⇄ C ⇄ A` 这种环形同步会让每一方都可能成为权威，于是必须额外定义复杂的冲突语义。

## 一个服务例子

假设 Order Service 拥有订单状态。它发布更新事件，供搜索索引、分析表和推荐系统消费。

这些副本可以针对不同查询优化，也可以只有 eventual consistency（最终一致性）。但退款仍然必须询问 Order Service，因为它拥有完整交易历史。一个更快、更近的副本，不会因为方便就自动获得权威。

所以 SSOT 完全可以和复制、高读取吞吐同时存在：**物理副本可以很多，权威不能含糊。**

## 权威不等于永远正确

权威源仍可能包含 bug、错误录入或过期规则。SSOT 不会让它永不犯错；它让修复有方向：先修正拥有者，再重新生成或对账所有派生物。

如果没有这个方向，团队会在许多副本里分别打补丁，却永远无法确认修复是否完整。

## 分叉以后怎样恢复？

当两个副本都出现了看似有效的修改：

1. 暂停会继续扩大分叉的写入或发布。
2. 说清楚发生冲突的是哪一类事实。
3. 根据所有权、完整性、时间线和审计证据确认权威。
4. 把下游独有且正确的修改带回源头。
5. 从修复后的源重新生成所有派生物。
6. 增加 lineage、diff check、写权限或单向发布路径。

顺序很重要：先恢复 authority，再恢复 consistency（数据一致性）。如果不先选择裁判，同步只是随便让一个版本覆盖另一个。

## 它不是什么

- **不是一个巨大数据库。** SSOT 关心有边界的权威，而不是物理集中。
- **不是禁止副本。** 缓存、replica、materialized view（物化视图）和报表本来就应该存在。
- **不是自动保证正确。** 它告诉我们一次修正应该发生在哪里。
- **不是 Event Sourcing（事件溯源）。** 事件日志可以实现 SSOT，但只是其中一种实现模式。
- **不是 Single Version of Truth（SVOT，单一版本的真相）。** SVOT 强调消费者对统一定义或结果达成一致；SSOT 强调权威从哪里产生。

## 什么时候会变难？

离线优先协作、active-active（双活）多地域写入、network partition（网络分区），以及真正需要多个独立作者共同定义事实的系统，都会让简单的“单写者”模型变难。

这些系统仍然需要显式权威和冲突语义，只是可能通过 leader（领导者）、quorum（法定人数）、merge rule（合并规则）或 CRDT（Conflict-free Replicated Data Type，无冲突复制数据类型）来分布式地实现。“我们有多个写入者”不等于可以不定义分歧怎样解决。

## 最后记住五件事

1. 一个事实可以有很多副本，但需要一个被明确命名的权威。
2. 每个派生物都应该暴露 source、version、freshness 和 rebuild path。
3. 业务不需要多写者时，优先使用单向、幂等的生成流程。
4. 先修改源，再重新生成下游；直接编辑 projection（投影）会制造 drift。
5. SSOT 让错误可以修复、可以审计，而不是让错误从此不可能发生。
