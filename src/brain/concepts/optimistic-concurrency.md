---
type: concept
date: 2026-07-16
updated: 2026-07-16
title: "Optimistic Concurrency"
aliases: [Optimistic Concurrency Control, OCC, 乐观并发控制, 乐观锁]
domain: [software-engineering, databases, distributed-systems]
tags: [concurrency, transactions, locking, mvcc, compare-and-swap, etag]
status: active
maturity: growing
related:
  - "[[concepts/pessimistic-concurrency]]"
  - "[[concepts/mvcc]]"
  - "[[concepts/compare-and-swap]]"
  - "[[concepts/idempotency]]"
---

# Optimistic Concurrency · 乐观并发控制

> **一句话：先让多个参与者自由读取和处理，等到提交修改时，再检查自己看到的数据是否已经被别人改过；没变就提交，变了就拒绝、重试或合并。**

[打开互动解释页](pages/optimistic-concurrency.html)

## 它在解决什么问题？

只要两个人、两个请求或两个服务可能同时修改同一份数据，就有一个危险：**后写入的人可能在不知情的情况下覆盖先写入的人。** 这叫 **Lost Update（丢失更新）**。

想象数据库里有一条记录：

```text
Document #42
title   = "Q3 Plan"
owner   = "Aaron"
version = 7
```

Alice 和 Bob 都在 10:00 读到了 `version = 7`：

1. Alice 把标题改为 “Q3 Growth Plan”，并保存。
2. Bob 的页面仍然是旧版本 7。他只想修改 owner，却把整个旧对象保存回去。
3. 如果系统直接接受 Bob 的写入，Alice 的新标题可能悄悄消失。

真正的问题不是“同时读取”，而是：**Bob 提交时，系统没有确认他的前提还成立。**

Optimistic Concurrency 就是在提交点补上这个确认。

## 先用一个生活类比：共享白板

### 乐观方式

大家先各自在白板照片上构思，不需要排队。贴回白板之前，检查真实白板是否仍和照片一致：

- 一致：直接贴上去。
- 不一致：说明有人先改了；重新看最新版，再决定重做、合并还是放弃。

### 悲观方式

第一个人拿走唯一的白板笔，或者锁上会议室。其他人必须等他结束后才能开始。

两种方式都在保护正确性，只是对冲突概率做了不同判断：

- **Optimistic**：冲突不常发生，先并行更划算。
- **Pessimistic**：冲突很可能发生，先排队更划算。

“乐观 / 悲观”不是情绪，而是系统对 **contention（争用程度）** 的成本判断。

## 它怎样工作？

一个标准 **OCC（Optimistic Concurrency Control，乐观并发控制）** 流程有三段：

```text
READ                    WORK                     VALIDATE + WRITE
读 value + version  ──► 本地计算，不长期持锁  ──► version 仍相同？
                                                      │
                                         ┌────────────┴────────────┐
                                         │                         │
                                       YES                        NO
                                         │                         │
                                  写入并 version + 1          冲突：拒绝/重试/合并
```

### 1. Read

读取业务数据，同时读取一个能代表“这份数据版本”的标记：

- 整数版本号：`version = 7`
- 更新时间：`updated_at = ...`（有精度和时钟风险）
- 内容哈希
- HTTP `ETag`（Entity Tag，实体标签）
- 数据库事务或存储引擎内部的版本标记

### 2. Work

参与者在本地计算或编辑。关键点是：**这段时间不长期占有排他锁**，所以其他人仍可读取、编辑甚至先提交。

### 3. Validate and write

写入必须是“检查 + 修改”不可分割的一次原子操作：

```sql
UPDATE documents
SET title = 'Q3 Growth Plan',
    version = version + 1
WHERE id = 42
  AND version = 7;
```

- 影响 1 行：版本仍是 7，写入成功，现在是 8。
- 影响 0 行：版本已不是 7，说明有人抢先改过；这是一个明确的冲突。

如果先 `SELECT` 检查、过一会儿再单独 `UPDATE`，两者之间仍可能被别人插入修改。这叫 **TOCTOU（time-of-check to time-of-use）race**。所以验证与写入必须绑定。

## 冲突以后怎么办？

检测冲突只完成了一半。系统还必须定义冲突策略：

| 策略 | 适合场景 | 风险 / 代价 |
|---|---|---|
| 拒绝并提示刷新 | 人工编辑、后台管理 | 用户需要重新操作 |
| 自动重读并重试 | 短小、确定性的服务端操作 | 高争用时可能形成 retry storm |
| 合并不同字段 | Profile、文档元数据 | 字段独立不代表业务语义独立 |
| 交给用户三方合并 | 代码、长文档 | 准确但交互成本高 |
| 以某一方为准 | 可丢弃的派生数据 | 可能掩盖真实业务冲突 |

自动重试通常还需要三个搭档：

1. **Idempotency（幂等性）**：重试不会重复扣款、重复发消息或重复创建资源。
2. **Backoff + jitter（退避与抖动）**：冲突时不要所有请求立刻同时再撞一次。
3. **Retry limit（重试上限）**：系统必须有退出方式，而不是无限循环。

## 一个 HTTP API 例子：ETag + If-Match

这里的 HTTP 是 **Hypertext Transfer Protocol（超文本传输协议）**，API 是 **Application Programming Interface（应用程序编程接口）**，ETag 是 **Entity Tag（实体标签）**。

第一次读取：

```http
GET /documents/42

HTTP/1.1 200 OK
ETag: "v7"
```

客户端更新时声明：“只有它仍是我看到的 v7 才修改”：

```http
PUT /documents/42
If-Match: "v7"
Content-Type: application/json

{"title":"Q3 Growth Plan"}
```

如果资源已经变成 v8，服务端可以返回：

```http
HTTP/1.1 412 Precondition Failed
```

这就是把 OCC 语义放进 HTTP 协议。它比“客户端自己先 GET 一次再决定 PUT”可靠，因为最终条件由服务端在写入点执行。

## Optimistic vs. Pessimistic

| 维度 | Optimistic Concurrency | Pessimistic Concurrency |
|---|---|---|
| 默认假设 | 冲突少 | 冲突很可能发生或代价极高 |
| 控制时机 | 提交时检测 | 开始工作前先加锁 / 排队 |
| 无冲突时 | 吞吐高，等待少 | 仍有锁和等待成本 |
| 冲突时 | 工作可能作废，需要重试 / 合并 | 等待增加，但通常不用重做 |
| 长时间交互 | 很适合，不会长时间持锁 | 危险，锁可能被人或故障长期占住 |
| 常见风险 | 活锁、重试风暴、用户改动丢失 | 死锁、锁超时、吞吐下降 |
| 常见工具 | version、ETag、CAS（Compare-and-Swap）、validation | mutex、row lock、`SELECT … FOR UPDATE` |

一个粗略的成本模型：

```text
乐观成本 ≈ 验证成本 + 冲突概率 × 重做成本
悲观成本 ≈ 加锁成本 + 等待成本 + 死锁/超时处理成本
```

如果冲突概率很低，乐观方式通常胜出；如果热点数据被频繁修改，重做成本会迅速吞掉它的优势。

## 什么时候适合？

### 很适合

- 读远多于写，写冲突少。
- 用户可能编辑几分钟，不适合一直锁住数据库行。
- API 跨网络调用，锁不能安全地跨长时间请求持有。
- 可以明确告诉调用方“你的版本过期了”。
- 操作可安全重试，或可以可靠合并。

### 要谨慎

- 热门库存最后一件、同一竞拍品、全局计数器等热点数据。
- 冲突后重做非常昂贵，例如已经调用多个外部系统。
- 失败不能轻易暴露给用户，也没有合理的合并体验。
- 所有请求读到同一版本后同时提交，可能产生 livelock 或 retry storm。
- 业务 invariant 跨多行、多表，单条记录的 `version` 检查保护不完整。

### 常见的最佳答案：Hybrid

真实系统经常混合使用：

- 普通编辑使用 OCC。
- 极少数热点资源通过短事务、队列或行锁串行化。
- 读路径使用 MVCC（Multi-Version Concurrency Control，多版本并发控制），写路径使用 OCC validation。
- 外部副作用使用 idempotency key，内部状态使用 version check。

不是选一个宗教，而是把不同冲突成本放到合适的机制里。

## 相关概念地图

### Pessimistic Concurrency Control（悲观并发控制）

先取得访问权，再开始关键操作。典型方式有 mutex、semaphore、数据库行锁和 `SELECT ... FOR UPDATE`。它减少重做，却引入等待、死锁和锁管理。

### MVCC（Multi-Version Concurrency Control，多版本并发控制）

MVCC 通过保存多个数据版本，让读取者看到一个一致快照，并减少“读阻塞写、写阻塞读”。

**MVCC 不等于 OCC。** 它们回答不同问题：

- MVCC 主要回答：“读者应该看见哪个版本？”
- OCC 主要回答：“写者提交时，如何知道自己的前提已过期？”

一个数据库完全可以用 MVCC 提供快照读取，同时用乐观验证发现写冲突。

### CAS（Compare-and-Swap / Compare-and-Set）

CAS 是一种原子原语：“只有当前位置仍等于 expected，才替换成 new value。”

```text
CAS(version, expected=7, new=8)
```

它经常是实现 OCC 的底层积木。**OCC 是策略，CAS 是可以实现该策略的一种原子机制。**

### Transactions and Isolation Levels（事务与隔离级别）

事务提供原子性等保证；隔离级别决定并发事务能观察到什么。OCC 可以在应用层实现，也可以在数据库内部实现。使用事务不自动意味着不会丢失更新，具体取决于数据库、隔离级别、SQL 写法和冲突处理。

### Optimistic Lock（乐观锁）

工程语境里常把 `version` 方案叫“乐观锁”。但它通常并没有真的把资源锁住，更精确的名字是 **optimistic concurrency control / optimistic validation**。

### Optimistic UI（乐观 UI）

界面先假装请求成功，立即更新画面，失败再回滚。它改善的是感知速度；OCC 保护的是并发正确性。两者都叫 optimistic，但不是一回事，而且可以同时使用。

### Git

Git 是很好的心智类比：每个人基于某个版本独立工作，整合时才发现冲突并合并。但 Git 不是所有 OCC 实现的严格模板；它有自己的提交图和合并语义。

### OT / CRDT（Operational Transformation / Conflict-free Replicated Data Type）

多人实时编辑常用 **Operational Transformation（操作转换）** 或 **Conflict-free Replicated Data Type（无冲突复制数据类型）**，让并发操作能够转换或自动收敛。它们不只是“检测冲突后拒绝”，而是更进一步定义并发更改如何合并。

### Lease（租约）

租约是会过期的临时所有权，常用于分布式协调。它比永久锁更能容忍持有者崩溃，但必须处理过期、续租、时钟和 fencing token 等问题。

## 常见误区

### “乐观并发就是 Last Write Wins”

不是。Last Write Wins 直接接受最后一次写入，可能静默覆盖。OCC 的核心恰恰是：**发现写入基于过期版本时，不要静默成功。**

### “加一个 version 字段就完成了”

不够。你必须：

- 在读取时把 version 交给写入者；
- 在原子写入条件中验证它；
- 检查 affected rows / 返回值；
- 为冲突定义重试、合并或失败体验。

漏掉任何一步，version 都可能只是装饰。

### “自动重试永远没问题”

如果一次操作包含发邮件、扣款、调用第三方 API 等副作用，盲目重跑可能重复执行。先保证幂等，再谈自动重试。

### “冲突少，所以不需要并发控制”

冲突少是采用 OCC 的理由，不是取消控制的理由。越罕见的 silent data loss 越难复现和排查。

## 最小记忆卡

- **Optimistic Concurrency = 不预先阻塞，提交时验证前提。**
- 检查与写入必须原子化；`version`、`ETag`、CAS 都只是载体。
- 冲突不是异常边角，而是协议的一部分：必须设计失败、重试或合并。
- OCC 适合低争用和长交互；PCC（Pessimistic Concurrency Control，悲观并发控制）适合高争用或冲突代价极高的短临界区。
- MVCC、事务、隔离级别、CAS、幂等性与 OCC 相关，但都不等同于 OCC。

## 自测

1. 为什么“先 SELECT version，再 UPDATE”仍可能有 race condition？
2. 如果冲突后自动重试，为什么操作需要幂等？
3. MVCC 和 OCC 分别在回答什么问题？
4. 当 1,000 个请求争抢同一个库存记录时，OCC 可能出现什么退化？
5. 你的系统遇到冲突时，是显式失败，还是悄悄 Last Write Wins？

## Further reading

- [RFC 9110 · HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html#name-if-match) — `If-Match`、conditional requests 与 `412 Precondition Failed` 的协议定义。
- [PostgreSQL · Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html) — MVCC、transaction isolation、explicit locking 与 serialization failure。
- [Microsoft · Handling Concurrency Conflicts in EF Core](https://learn.microsoft.com/en-us/ef/core/saving/concurrency) — concurrency token、条件 `UPDATE`、affected rows 与冲突处理的完整例子。
- [AWS · Optimistic locking with version number](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/BestPractices_OptimisticLocking.html) — 分布式数据存储中的 version attribute、conditional write 与 retry trade-off。
- Martin Kleppmann, *Designing Data-Intensive Applications* — transactions, isolation, distributed consistency。
