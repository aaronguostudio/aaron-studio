---
type: concept
date: 2026-07-16
updated: 2026-07-16
title: "Idempotency"
aliases: [幂等性, 幂等操作, Idempotent Operation, Idempotency Key]
domain: [software-systems, distributed-systems, api-design]
tags: [retry, duplicate-delivery, unknown-outcome, payments, reliability]
status: active
maturity: growing
related:
  - "[[concepts/retry]]"
  - "[[concepts/deduplication]]"
  - "[[concepts/transactional-outbox]]"
  - "[[concepts/exactly-once]]"
  - "[[concepts/optimistic-concurrency]]"
---

# Idempotency · 幂等性

> **一句话：同一个业务意图即使被重复送达，系统也只让它产生一次预期的业务效果；后续重复请求复用、确认或收敛到第一次的结果。**

[打开互动解释页](pages/idempotency.html)

## 它在解决什么问题？

分布式系统里最棘手的情况，往往不是明确的成功或失败，而是 **unknown outcome（结果未知）**。

```text
client                     payment service
  │ POST /payments               │
  ├─────────────────────────────►│
  │                              │ charge $42 ✓
  │        response lost   ×─────┤
  │                              │
  │ timeout: did it happen?      │
```

客户端只知道自己没有收到响应，却不知道服务端是在扣款前失败，还是扣款后丢了响应。如果不重试，可能漏掉一笔本该完成的支付；如果直接重试，又可能重复扣款。

Idempotency（幂等性）让系统可以把“恢复动作”和“重复业务效果”分开：**允许请求被重试，但不允许同一个意图重复生效。**

## 先用一个生活类比：餐厅取餐号

你把写有 `A-842` 的点菜单递给厨房，但没有听见厨房确认，于是又递了一次。

- 没有取餐号：厨房可能以为是两份新订单，做两顿饭。
- 有稳定取餐号：厨房查到 `A-842` 已经接单，只告诉你原订单的状态。
- 如果你想再点一份：必须使用新的取餐号。
- 如果仍用 `A-842`，却把牛肉面改成披萨：厨房应该拒绝，而不是猜你的意思。

取餐号不是魔法。厨房仍然需要一个可靠账本，而且“登记号码”和“开始做饭”之间不能留下会产生双份订单的缝隙。

## 数学定义与系统定义

数学里的幂等函数满足：

```text
f(f(x)) = f(x)
```

例如，对一个数不断取绝对值，第一次以后状态就不会再变化。

软件系统里的定义更偏业务语义：对同一个请求执行多次，其 **intended effect（预期效果）** 与执行一次相同。它并不要求每次响应字节完全相同，也不要求日志、指标、时间戳等所有附带行为都只发生一次。

例如，第一次 `DELETE /documents/42` 返回 `204`，第二次返回 `404`，资源最终都处于“不存在”的状态。响应不同，预期效果仍然幂等。

## 两种幂等

### 1. 操作本身自然幂等

有些操作会反复收敛到同一状态：

```text
SET order.status = "PAID"     repeated → still PAID
DELETE document 42            repeated → still absent
PUT /profile { name: "Li" }   repeated → same representation
```

而这些操作通常不是自然幂等：

```text
balance = balance + 10
toggle subscription
send welcome email
create a new charge
```

“设置为某个值”和“在当前值上再做一次变化”之间，是很有用的判断边界。

### 2. 用 Idempotency Key（幂等键）赋予幂等性

创建支付、订单或预约通常不能改写成简单的 `SET`。这时客户端为一个业务意图生成稳定的 key，例如 UUID（Universally Unique Identifier，通用唯一标识符），并在所有重试中复用它。

```text
Idempotency-Key: order-842-payment
POST /payments { amount: 42, currency: "CAD" }
```

一个完整协议通常要做八件事：

1. **一个意图一个 key**：同一次支付的重试复用 key；新支付使用新 key。
2. **明确作用域**：通常按调用者、账户和操作类型共同限定，避免不同租户互相碰撞。
3. **原子占位**：用唯一约束或事务抢占 key，不能先查再插入。
4. **绑定请求指纹**：保存关键参数，防止同一个 key 被拿去表达另一个意图。
5. **执行业务效果**：创建支付、订单或预约。
6. **记录状态与结果**：保存处理中、成功、失败以及可以重放的结果。
7. **处理重复请求**：已完成就返回原结果；处理中则等待或明确报冲突；参数不同则拒绝。
8. **声明有效期**：TTL（Time to Live，存活时间）结束后，旧 key 可能被当作新请求，API（Application Programming Interface，应用程序编程接口）必须说明保证窗口。

## 真正困难的是原子边界

下面的实现看起来有去重，实际上有竞态：

```text
if key does not exist:
  charge_card()
  save(key, result)
```

两个并发请求可能同时看到 key 不存在，于是都扣款；或者系统扣款成功后、保存 key 之前崩溃，重试仍然会再次扣款。

理想情况下，“占用 key、改变业务状态、记录结果”要处在同一个事务边界里。如果效果跨越数据库、消息队列和第三方支付系统，就需要 Transactional Outbox（事务发件箱）、Inbox（收件箱）、状态机，或让每一段边界都拥有自己的幂等协议。

**只有一个 header，没有原子状态机，不等于拥有幂等性。**

## 四个必须写进契约的边界

### 已完成的重复请求

返回第一次保存的结果或语义等价的结果，而不是再次执行业务动作。

### 相同 key，不同参数

必须拒绝。否则系统无法判断这是一次重试，还是调用者错误地复用了 key。Stripe 与 Amazon Elastic Compute Cloud（Amazon EC2）都把参数不匹配视为错误。

### 同时到达的重复请求

第二个请求不应也开始执行。系统可以等待第一个完成、返回 `in progress`，或报告冲突；具体选择要写进接口契约。

### key 已过期

幂等性通常有时间范围，不是永久记忆。清理记录以后，同一个 key 可能再次产生效果。客户端的最长重试周期不能超过服务端承诺的去重窗口。

## HTTP 里“幂等”是什么意思？

HTTP（Hypertext Transfer Protocol，超文本传输协议）语义把 safe method（安全方法）和 idempotent method（幂等方法）分开：

| Method | Safe? | Idempotent by semantics? | 说明 |
|---|---:|---:|---|
| `GET` | yes | yes | 只请求读取，不应要求状态变化 |
| `PUT` | no | yes | 用给定表示替换目标；重复提交仍收敛到它 |
| `DELETE` | no | yes | 会改变状态，但重复删除的预期效果相同 |
| `POST` | no | no, by default | 常表达“再创建一次”，需要业务协议赋予幂等性 |

幂等不等于 safe。`DELETE` 会产生真实改变，但它仍可以是幂等的。

## 它和相邻概念是什么关系？

### Retry（重试）· 恢复策略

Retry 决定失败后何时再尝试，通常配合 timeout、次数上限、exponential backoff（指数退避）和 jitter（抖动）。Idempotency 决定再次尝试是否会重复产生效果。一个负责恢复节奏，一个负责业务语义。

### Deduplication（去重）· 检测机制

去重是识别、丢弃或合并重复消息的技术动作；幂等性是“重复发生以后业务效果仍然正确”的契约。去重可以实现幂等性，但二者不是同义词。

### At-least-once Delivery（至少一次交付）· 交付保证

消息可能被交付多次，但不会因为一次暂时失败就轻易丢失。消费者必须幂等，才能安全吸收重复交付。

### At-most-once Delivery（至多一次交付）· 交付保证

宁可漏掉也避免重复投递。它限制尝试次数，却不能告诉调用者结果未知时业务是否已经发生。

### Exactly-once（恰好一次）· 更强、也常被误用的保证

幂等性并不让网络只交付一次，也不让处理器只运行一次。它允许传输与执行重复，但让一个被定义范围内的业务效果收敛为一次。因此更准确的说法通常是 **at-least-once attempt, effectively-once effect（至少一次尝试，效果上一次）**。

### Optimistic Concurrency Control（OCC，乐观并发控制）· 并发写保护

OCC 检查“我写入的数据是否已经被别人更新”，防止 stale write（陈旧写入）覆盖新版本；Idempotency 检查“这是不是同一个意图的再次送达”，防止重试重复生效。一个保护不同意图之间的并发，一个识别同一意图的重复。

## 它不能替你解决什么？

- **不能阻止重试风暴。** 仍需要 timeout、backoff、jitter、rate limit 和熔断。
- **不能自动跨越所有系统。** 数据库幂等不代表邮件、消息和第三方 API 也幂等。
- **不能保证 key 永不碰撞或永不误用。** key 生成、作用域、参数指纹与存储都属于协议。
- **不能代替并发控制。** 两个不同 key 仍可能同时争抢同一份库存。
- **不能自动给出错误缓存策略。** 是否重放第一次的 `500`、哪些验证错误不记录，由具体 API 定义。

## 什么时候应该优先考虑？

- 支付、下单、订票、发券、创建云资源等“多做一次代价很高”的动作。
- 客户端会因为超时、断线或进程重启而重试。
- 队列提供 at-least-once delivery。
- Webhook（网络回调）可能重复投递。
- 定时任务、批处理或工作流可能从 checkpoint（检查点）重新运行。

如果操作本身可以改写成自然幂等的状态设定，通常先这样做；需要表达“创建一个新东西”时，再设计完整的 idempotency-key 协议。

## 常见误区

### “相同请求一定返回完全相同的 HTTP 状态码”

不一定。幂等性约束的是预期效果。具体协议可以选择重放原响应，也可以返回当前等价状态；契约要明确。

### “把 payload 做 hash 就够了”

两个在业务上独立的相同订单可能拥有相同 payload。key 应表达调用者的业务意图；fingerprint 用来检查 key 是否被误用，不能取代 intent identity（意图身份）。

### “服务端只要先查 key 就安全”

先查再写会产生 race condition（竞态条件）。必须使用原子插入、唯一约束、锁或事务状态机。

### “有了幂等键就获得 exactly-once”

没有。请求仍可能被发送、接收和执行多次；得到的是特定作用域与时间窗口内的效果收敛。

## 最小记忆卡

- **幂等性处理的是结果未知：允许重试，不允许同一意图重复产生业务效果。**
- 自然幂等优先；非幂等动作可以用稳定 key、请求指纹和原子状态记录构造幂等。
- 一个意图一个 key；重试复用 key；新意图换新 key。
- 相同 key + 不同参数必须拒绝；并发重复与过期 key 必须有明确契约。
- 幂等性不是 safe、去重、重试或 exactly-once 的同义词。
- 最危险的 bug 位于副作用与幂等记录之间的非原子缝隙。

## 自测

1. 支付已经成功但响应丢失时，调用者能用什么证据安全重试？
2. 你的 key 表达的是业务意图，还是仅仅对 payload 做了 hash？
3. 相同 key 携带不同金额时，服务端会怎样处理？
4. 两个重复请求同时到达时，谁能获得执行权？
5. key 的有效期是否覆盖客户端可能发生的最长重试周期？
6. 数据库提交成功、消息发送失败时，幂等边界在哪里？

## Further reading

- [RFC 9110 · HTTP Semantics §9.2.2 Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2) — HTTP 对幂等方法、预期效果与自动重试的正式定义。
- [Stripe API · Idempotent requests](https://docs.stripe.com/api/idempotent_requests) — key、参数比较、结果重放与有效期的具体 API 契约。
- [AWS Builders' Library · Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) — caller-provided request identifier、late request 与语义等价结果。
- [Amazon EC2 · Ensuring idempotency in API requests](https://docs.aws.amazon.com/ec2/latest/devguide/ec2-api-idempotency.html) — client token、作用域与参数不匹配的生产例子。
