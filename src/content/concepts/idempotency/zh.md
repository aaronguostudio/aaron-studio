---
title: '幂等性'
fullName: 'Idempotency'
shortName: '幂等性'
description: '让结果未知的操作可以安全重试：同一个意图可以到达多次，但只产生一次业务效果。'
mentalModel: '同一个意图可以被重复送达；系统只让它产生一次业务效果，后续重试复用第一次的结果。'
date: '2026-07-16'
updated: '2026-07-16'
domain: '软件系统'
domainKey: 'software-systems'
tags: ['可靠性', '重试', '分布式系统', 'API 设计']
maturity: 'growing'
published: true
featured: false
translationKey: 'idempotency'
interaction: 'idempotency'
cardImage: '/learn-img/idempotency/card-4x5.jpg'
cardImageAlt: '三张具有相同订单编号的纸质收据汇入一张完成收据，表示多次尝试只产生一次业务效果。'
neighbors:
  - name: 'Retry'
    fullName: 'Retry（重试）'
    category: '恢复策略'
    summary: '决定何时、怎样再次尝试；幂等性决定再次尝试会不会重复产生业务效果。'
  - name: 'Idempotency Key'
    fullName: 'Idempotency Key（幂等键）'
    category: '请求身份机制'
    summary: '为一个业务意图命名，让系统把每次重试识别为同一次操作。'
  - name: 'Deduplication'
    fullName: 'Deduplication（去重）'
    category: '重复检测机制'
    summary: '检测或压制重复，是实现幂等行为的一种技术机制。'
  - name: 'At-least-once Delivery'
    fullName: 'At-least-once Delivery（至少一次交付）'
    category: '交付保证'
    summary: '消息可能被重复投递，因此消费者需要用幂等处理安全吸收重复。'
  - name: 'Transactional Outbox'
    fullName: 'Transactional Outbox（事务发件箱）'
    category: '一致性模式'
    summary: '消除数据库变更与消息发布之间的不安全缝隙，同时仍要求消费者处理重复。'
  - name: 'Exactly-once'
    fullName: 'Exactly-once Processing（恰好一次处理）'
    category: '更强保证'
    summary: '常被过度宣称的端到端保证；幂等性通常只让效果收敛，并不阻止重复投递或执行。'
sources:
  - title: 'RFC 9110 · Idempotent Methods'
    url: 'https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2'
  - title: 'Stripe · Idempotent requests'
    url: 'https://docs.stripe.com/api/idempotent_requests'
  - title: "AWS Builders' Library · Making retries safe with idempotent APIs"
    url: 'https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/'
  - title: 'Amazon EC2 · Ensuring idempotency in API requests'
    url: 'https://docs.aws.amazon.com/ec2/latest/devguide/ec2-api-idempotency.html'
---

# 幂等性

Idempotency（幂等性）解决的是分布式系统里最棘手的一类失败：不是明确成功或失败，而是 **unknown outcome（结果未知）**。

客户端发起支付；服务端已经扣款，但响应在网络中消失。客户端只看到超时。如果放弃重试，本该完成的支付可能被误认为失败；如果直接重试，用户又可能被扣两次。

幂等契约把恢复与重复分开：**请求可以再次尝试，但同一个业务意图不能再次产生业务效果。**

## 餐厅取餐号

想象你把编号 `A-842` 的点菜单递给厨房，却没有听见确认，于是又递了一次。

- 没有订单号，厨房可能做两顿饭。
- 有稳定订单号，厨房查到 `A-842`，只返回原订单状态。
- 真正的新订单必须使用新编号。
- 仍用 `A-842` 却换了菜品，厨房应该拒绝，而不是猜测。

取餐号只是身份。厨房仍然需要可靠账本，而且登记号码与接单之间不能有不安全的缝隙。

## 数学定义与系统定义

数学里的幂等函数满足：

```text
f(f(x)) = f(x)
```

软件系统更关心语义：同一请求执行多次，其 **intended effect（预期效果）** 与执行一次相同。它不要求响应字节完全相同，也不禁止额外的日志、指标和时间戳。

例如，第一次 `DELETE /documents/42` 返回 `204`，第二次返回 `404`。响应不同，但资源最终都处于“不存在”的状态。

## 两种获得幂等性的方式

### 让操作自然幂等

状态设定通常会收敛：

```text
SET order.status = "PAID"     repeated → still PAID
DELETE document 42            repeated → still absent
PUT /profile { name: "Li" }   repeated → same representation
```

相对变化通常不会：

```text
balance = balance + 10
toggle subscription
send welcome email
create a new charge
```

一个很实用的判断是：能否把“再变化一次”改写成“让它等于这个状态”？

### 增加 Idempotency Key（幂等键）

创建支付、预约或云资源不能总被改写成简单赋值。这时客户端为一个业务意图生成稳定 key，并在每次重试中复用。

```text
Idempotency-Key: order-842-payment
POST /payments { amount: 42, currency: "CAD" }
```

完整协议通常要做到：

1. 一个意图一个 key；新意图使用新 key；
2. 按调用者、账户和操作限定 key 的作用域；
3. 用唯一约束或事务原子占位；
4. 绑定请求指纹，参数变化时拒绝；
5. 记录处理中、完成或失败状态；
6. 向已完成的重复请求重放原结果或语义等价结果；
7. 定义并发重复请求看到什么；
8. 声明 TTL（Time to Live，存活时间），说明 key 何时可能被当作新请求。

## 原子缝隙才是真正危险的地方

下面的实现存在竞态：

```text
if key does not exist:
  charge_card()
  save(key, result)
```

两个并发请求可能同时看到 key 不存在，于是都扣款；服务也可能在扣款后、保存记录前崩溃，让重试无法与新请求区分。

只要可能，key 占位、业务状态变化与结果记录就应该共享一个原子边界。如果效果跨过数据库、队列、邮件或第三方支付系统，每段边界都要有自己的幂等策略，通常需要状态机、Transactional Outbox（事务发件箱）或消费者 Inbox（收件箱）。

**只有一个 header，没有原子状态机，只是装饰，不是保证。**

## 契约必须说明的四种情况

### 已完成的重复请求

返回第一次记录的结果，或语义等价的当前结果；不要再次执行业务动作。

### 相同 key，不同参数

必须拒绝，否则服务无法判断这是一次重试，还是一次错误的 key 复用。Stripe 与 Amazon Elastic Compute Cloud（Amazon EC2）都把参数不匹配视为错误。

### 同时到达的重复请求

第二个请求不能也开始产生效果。它可以等待、收到 `in progress`，或收到冲突响应；API（Application Programming Interface，应用程序编程接口）契约必须做出选择。

### 已过期的 key

幂等记录通常不会永久保存。记录清理后，同一个 key 可能再次执行。服务端承诺的保证窗口必须覆盖客户端最长的重试周期。

## HTTP：安全不等于幂等

HTTP（Hypertext Transfer Protocol，超文本传输协议）把 safe method（安全方法）与 idempotent method（幂等方法）分开。

| Method   | Safe? | 语义上幂等？ | 含义                                           |
| -------- | ----- | ------------ | ---------------------------------------------- |
| `GET`    | yes   | yes          | 请求读取，不应要求状态变化。                   |
| `PUT`    | no    | yes          | 用给定表示替换目标，重复提交仍然收敛。         |
| `DELETE` | no    | yes          | 会改变一次状态，但重复删除的预期效果相同。     |
| `POST`   | no    | 默认 no      | 常表示“再创建一个”，需要业务层协议赋予幂等性。 |

所以，一个操作可以改变状态，同时仍然幂等。幂等不等于无害或只读。

## 看清相邻概念

- **Retry（重试）是恢复策略。** 它控制 timeout、尝试上限、exponential backoff（指数退避）与 jitter（抖动）；幂等性让这些尝试不会重复产生业务效果。
- **Deduplication（去重）是检测机制。** 它可以帮助实现幂等性，但语义契约不只是丢弃重复。
- **At-least-once Delivery（至少一次交付）是交付保证。** 它可能重复投递，所以消费者需要幂等处理。
- **Exactly-once（恰好一次）是更强、也常被误用的保证。** 幂等性不阻止重复投递或执行，只让限定范围内的效果收敛得像发生一次。
- **Optimistic Concurrency Control（OCC，乐观并发控制）保护陈旧写入。** OCC 区分互相竞争的不同意图；幂等性识别同一意图的再次送达。
- **Transactional Outbox（事务发件箱）关闭跨系统一致性缝隙。** 它仍然允许重复发布，所以消费者仍需幂等。

## 它不能解决什么？

- 不能阻止重试风暴；仍需次数上限、backoff、jitter、限流与熔断。
- 不能自动跨越数据库、队列、邮件和第三方 API。
- 不能阻止两个不同 key 同时争抢同一份库存。
- 不能替 API 决定是否缓存并重放第一次 `500`。
- 不能创造全局 exactly-once processing（恰好一次处理）。

## 最后记住五件事

1. 幂等性回应的是结果未知：可以重试这次尝试，不能重复这个意图的效果。
2. 领域允许时，优先把动作改成自然幂等的状态设定。
3. 一个意图一个 key；重试复用它；新意图换新 key。
4. 相同 key + 不同参数必须拒绝，并明确并发与过期行为。
5. 最危险的 bug 位于副作用与幂等记录之间的非原子缝隙。

## 自测

1. 支付已经提交但响应消失时，什么证据能让重试安全？
2. 你的 key 识别业务意图，还是只对 payload 做 hash？
3. 相同 key 携带不同金额时会发生什么？
4. 两个重复请求同时到达时，谁获得执行权？
5. key 的寿命是否覆盖客户端最长的重试周期？

## Further reading

- [RFC 9110 · HTTP Semantics §9.2.2 Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2)
- [Stripe API · Idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [AWS Builders' Library · Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)
- [Amazon EC2 · Ensuring idempotency in API requests](https://docs.aws.amazon.com/ec2/latest/devguide/ec2-api-idempotency.html)
