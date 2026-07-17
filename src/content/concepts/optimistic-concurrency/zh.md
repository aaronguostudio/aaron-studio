---
title: "乐观并发控制"
fullName: "Optimistic Concurrency Control · 乐观并发控制"
shortName: "OCC"
description: "允许并行工作，在提交时拒绝会覆盖新修改的旧版本。"
mentalModel: "先让大家并行工作；有人提交时，再验证他开始工作时所依赖的前提是否仍然成立。"
date: "2026-07-16"
updated: "2026-07-16"
domain: "软件系统"
domainKey: "software-systems"
tags: ["并发控制", "数据库", "分布式系统"]
maturity: "持续生长"
published: true
featured: true
translationKey: "optimistic-concurrency"
interaction: "optimistic-concurrency"
neighbors:
  - name: "PCC"
    fullName: "Pessimistic Concurrency Control · 悲观并发控制"
    category: "策略"
    summary: "在关键工作开始前先取得排他访问权，用等待和锁管理换取更少的返工。"
  - name: "MVCC"
    fullName: "Multi-Version Concurrency Control · 多版本并发控制"
    category: "存储模型"
    summary: "保留多个数据版本，让读者看到一致快照，并减少读取者与写入者互相阻塞。"
  - name: "CAS"
    fullName: "Compare-and-Swap / Compare-and-Set · 比较并交换"
    category: "原子原语"
    summary: "只有当前值仍等于 expected 时才替换，是实现 OCC 的常见底层积木。"
  - name: "Isolation"
    fullName: "Transaction Isolation · 事务隔离"
    category: "事务语义"
    summary: "决定并发事务能够观察什么，以及数据库会阻止哪些并发异常。"
  - name: "Idempotency"
    fullName: "Idempotent Operation · 幂等操作"
    category: "重试安全"
    summary: "让重复请求仍只产生预期的一次效果，是自动重试之前必须解决的问题。"
  - name: "OT / CRDT"
    fullName: "Operational Transformation / Conflict-free Replicated Data Type · 操作转换 / 无冲突复制数据类型"
    category: "合并模型"
    summary: "通过转换或收敛并发操作来保留多方意图，而不是简单拒绝其中一个写入者。"
sources:
  - title: "RFC 9110 · HTTP Semantics：If-Match"
    url: "https://www.rfc-editor.org/rfc/rfc9110.html#name-if-match"
  - title: "PostgreSQL · Concurrency Control"
    url: "https://www.postgresql.org/docs/current/mvcc.html"
  - title: "Microsoft · Handling Concurrency Conflicts in EF Core"
    url: "https://learn.microsoft.com/en-us/ef/core/saving/concurrency"
  - title: "AWS · Optimistic locking with version number"
    url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/BestPractices_OptimisticLocking.html"
---

# 乐观并发控制

Optimistic Concurrency Control（OCC，乐观并发控制）解决的是一个很容易被低估的问题：两个人读到了同一份记录、分别做了修改，然后在不知情的情况下抹掉了对方的工作。

它最关键的动作不是在大家思考和编辑时锁住记录，而是在真正提交的那一刻验证：写入者开始工作时所依赖的前提，现在是否仍然成立？

## 它要阻止的失败：Lost Update

假设 Alice 和 Bob 都读取了文档 `#42` 的 version 7：

- Alice 修改标题并率先保存，数据库前进到 version 8。
- Bob 仍在编辑旧的 version 7。他修改 owner，然后把整个旧对象提交回来。
- 如果系统直接接受 Bob 的写入，Alice 的新标题就可能悄悄消失。

这叫 **Lost Update（丢失更新）**。危险的不是两个人同时读取，而是 Bob 的写入所依赖的前提已经过期，系统却仍然允许它成功。

## 它怎样工作

OCC 通常分成三个阶段：

1. **Read**：读取业务数据，同时带走 version、Entity Tag（ETag，实体标签）等并发 token。
2. **Work**：在本地编辑或计算，不长期持有排他锁。
3. **Validate and write**：把验证与写入做成一次原子操作。token 仍一致就提交并递增；不一致就报告冲突。

```sql
UPDATE documents
SET title = 'Q3 Growth Plan',
    version = version + 1
WHERE id = 42
  AND version = 7;
```

影响 1 行代表 version 7 仍然有效；影响 0 行代表这份记录在读取之后已经被别人修改。

比较与写入必须是原子的。如果先单独 `SELECT`，过一会儿再无条件 `UPDATE`，两步之间仍然存在 Time of Check to Time of Use（TOCTOU，检查时刻到使用时刻）race。

## HTTP 里的同一个思想

Hypertext Transfer Protocol（HTTP，超文本传输协议）通过 Entity Tag（ETag，实体标签）和 `If-Match` 表达同样的协议：

```http
GET /documents/42
ETag: "v7"

PUT /documents/42
If-Match: "v7"
```

如果资源已经不是 version 7，服务端可以返回 `412 Precondition Failed`。最终条件由真正执行写入的服务端验证，而不是让客户端根据更早的一次读取自行猜测。

## 乐观与悲观

| 维度       | Optimistic Concurrency Control        | Pessimistic Concurrency Control |
| ---------- | ------------------------------------- | ------------------------------- |
| 默认判断   | 冲突不常发生                          | 冲突很可能发生，或代价极高      |
| 控制时机   | 提交时验证                            | 开始工作前加锁或排队            |
| 无冲突成本 | 等待很少                              | 仍然承担锁与等待                |
| 冲突成本   | 重试、合并或丢弃工作                  | 通常等待，而不是返工            |
| 常见风险   | Retry storm、livelock、糟糕的冲突体验 | Deadlock、timeout、吞吐下降     |

可以用一个粗略模型理解：

```text
乐观成本 ≈ 验证成本 + 冲突概率 × 重做成本
悲观成本 ≈ 加锁成本 + 等待成本 + 死锁 / 超时处理成本
```

真实系统经常混合使用：普通记录用乐观编辑；少数热点资源使用短锁或队列；外部副作用再配合 idempotency key（幂等键）。

## 冲突本身就是协议的一部分

发现冲突只完成了一半。产品还必须决定接下来怎样退出：

- 拒绝并要求用户刷新；
- 重新读取后重试一个确定性操作；
- 合并互不冲突的字段；
- 展示三方合并；
- 通过队列或短事务把热点资源串行化。

自动重试还需要 Idempotency（幂等性）、有限重试次数，以及带 jitter（抖动）的 backoff（退避）。如果一次操作涉及转账、发邮件或第三方请求，盲目重试可能重复执行副作用。

## 它适合在哪里

OCC 最适合读多写少、冲突罕见、用户编辑时间长，而且重试或合并成本可控的场景。

当大量请求争抢同一个热点记录、冲突会让昂贵工作全部作废，或者业务 invariant（不变量）跨越了单个 version token 无法保护的多条记录时，它会明显退化。

## 它不是什么

- **不是 Last Write Wins。** OCC 会让过期写入显性失败，而不是静默接受最后到达的人。
- **不是 Multi-Version Concurrency Control（MVCC，多版本并发控制）。** MVCC 主要回答读者应该看见哪个版本；OCC 回答写者的前提是否仍然有效。
- **不是 Compare-and-Swap（CAS，比较并交换）。** CAS 是可以实现 OCC 策略的一种原子原语。
- **不是 Optimistic User Interface（乐观式界面）。** Optimistic UI 优化感知速度；OCC 保护并发正确性。

## 最后记住五件事

1. OCC 的核心是“不预先阻塞，在提交时验证前提”。
2. 检查与写入必须原子化。
3. version、ETag、CAS 是载体或机制，不是完整策略。
4. 冲突必须有被设计过的出口：拒绝、重试、合并或串行化。
5. 应该根据争用程度与失败成本，在“等待”和“返工”之间做选择，而不是把某一种方案当成信仰。
