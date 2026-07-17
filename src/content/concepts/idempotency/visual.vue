<script setup lang="ts">
import { computed, ref } from 'vue'

type Locale = 'en' | 'zh'
type Mode = 'plain' | 'keyed'
type EdgeCase = 'complete' | 'mismatch' | 'concurrent' | 'expired'

interface Copy {
  eyebrow: string
  title: string
  description: string
  modes: Record<Mode, string>
  modeNotes: Record<Mode, string>
  stepLabel: string
  reset: string
  steps: Array<{
    stage: string
    client: string
    service: string
    ledger: string
    verdict: string
  }>
  keyedFinal: {
    client: string
    service: string
    ledger: string
    verdict: string
  }
  total: string
  attempts: string
  effects: string
  contractEyebrow: string
  contractTitle: string
  contractDescription: string
  cases: Record<
    EdgeCase,
    {
      tab: string
      request: string
      decision: string
      result: string
      rule: string
    }
  >
  judgeEyebrow: string
  judgeTitle: string
  judgeDescription: string
  operations: Array<{
    operation: string
    type: string
    description: string
    tone: 'natural' | 'key' | 'unsafe'
  }>
  neighborsEyebrow: string
  neighborsTitle: string
  neighborsDescription: string
  neighbors: Array<{
    name: string
    fullName: string
    type: string
    description: string
  }>
}

const props = defineProps<{ locale: Locale }>()

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: '01 · Unknown-outcome lab',
    title: 'The charge succeeded. The response disappeared.',
    description:
      'The client has no proof of success or failure. Step through its retry with and without a stable identity for the business intent.',
    modes: { plain: 'Without a key', keyed: 'With an idempotency key' },
    modeNotes: {
      plain: 'Each POST looks like a new instruction.',
      keyed: 'Both attempts carry order-842-payment.',
    },
    stepLabel: 'Advance request',
    reset: 'Reset lab',
    steps: [
      {
        stage: 'Ready',
        client: 'A $42 payment is ready to send.',
        service: 'No request has arrived.',
        ledger: 'No payment record.',
        verdict: 'One intent is waiting to begin.',
      },
      {
        stage: 'First attempt',
        client: 'POST /payments is sent.',
        service: 'The server accepts the request.',
        ledger: 'Payment pay_701 is created: $42.',
        verdict: 'The business effect has happened once.',
      },
      {
        stage: 'Response lost',
        client: 'Timeout. Did the payment happen?',
        service: 'The success response vanished in transit.',
        ledger: 'pay_701 still exists: $42.',
        verdict: 'This is the dangerous state: the outcome is unknown to the client.',
      },
      {
        stage: 'Retry',
        client: 'The client sends the request again.',
        service: 'No identity links it to the first attempt.',
        ledger: 'A second payment pay_702 is created: +$42.',
        verdict: 'Two attempts became two effects. The customer paid $84.',
      },
    ],
    keyedFinal: {
      client: 'The client retries with order-842-payment.',
      service: 'Key hit: replay the completed pay_701 result.',
      ledger: 'No new charge. pay_701 remains $42.',
      verdict: 'Two attempts, one business effect. Recovery is now safe.',
    },
    total: 'Charged total',
    attempts: 'Attempts',
    effects: 'Effects',
    contractEyebrow: '02 · Key contract',
    contractTitle: 'A key is useful only when the uncomfortable cases have rules.',
    contractDescription:
      'Choose a case. The important design work happens around identity, atomic ownership, concurrency, and time.',
    cases: {
      complete: {
        tab: 'Completed duplicate',
        request: 'Same caller · same key · same parameters',
        decision: 'Look up the completed record and do not run the effect again.',
        result: 'Replay the original or a semantically equivalent result.',
        rule: 'A retry is recognized by intent, not by arrival count.',
      },
      mismatch: {
        tab: 'Changed parameters',
        request: 'Same key · amount changes from $42 to $84',
        decision: 'Reject the request as a key misuse.',
        result: 'Return a parameter-mismatch error; never guess which intent is real.',
        rule: 'A request fingerprint protects the meaning bound to the key.',
      },
      concurrent: {
        tab: 'Concurrent duplicate',
        request: 'Two copies of the same key arrive before either finishes',
        decision: 'Only one atomically owns execution.',
        result: 'The other waits, sees in-progress, or receives a documented conflict.',
        rule: 'Check-then-insert is racy; reservation needs a unique or transactional boundary.',
      },
      expired: {
        tab: 'Expired key',
        request: 'The retry arrives after the stored record was pruned',
        decision: 'The server may treat it as a new operation.',
        result: 'A second effect is possible unless another business identifier prevents it.',
        rule: 'The server guarantee window must cover the client retry horizon.',
      },
    },
    judgeEyebrow: '03 · Operation judgment',
    judgeTitle: 'First ask whether the operation can converge by itself.',
    judgeDescription:
      'Natural idempotency is simpler than a ledger. Relative changes and external effects need an explicit protocol.',
    operations: [
      {
        operation: 'SET status = PAID',
        type: 'Naturally idempotent',
        description: 'Every repetition converges to the same named state.',
        tone: 'natural',
      },
      {
        operation: 'DELETE document 42',
        type: 'Naturally idempotent',
        description: 'Responses may differ, but the resource remains absent.',
        tone: 'natural',
      },
      {
        operation: 'POST create payment',
        type: 'Needs an intent key',
        description: 'A repeated creation is a new charge unless retries share identity.',
        tone: 'key',
      },
      {
        operation: 'balance = balance + 10',
        type: 'Not naturally idempotent',
        description: 'Every execution changes the state again.',
        tone: 'unsafe',
      },
    ],
    neighborsEyebrow: '04 · Concept neighborhood',
    neighborsTitle: 'Do not confuse recovery, detection, delivery, and effect.',
    neighborsDescription:
      'They work together, but each answers a different question. The relationship type is the useful part.',
    neighbors: [
      {
        name: 'Retry',
        fullName: 'Retry',
        type: 'recovery policy',
        description: 'When should another attempt be made, and with what backoff?',
      },
      {
        name: 'Idempotency Key',
        fullName: 'Idempotency Key',
        type: 'request identity',
        description: 'Which attempts express the same business intent?',
      },
      {
        name: 'Deduplication',
        fullName: 'Deduplication',
        type: 'detection mechanism',
        description: 'How are repeated deliveries detected or suppressed?',
      },
      {
        name: 'At-least-once',
        fullName: 'At-least-once Delivery',
        type: 'delivery guarantee',
        description: 'May a message arrive more than once so it is less likely to be lost?',
      },
      {
        name: 'Outbox',
        fullName: 'Transactional Outbox',
        type: 'consistency pattern',
        description: 'How is a database change coupled to eventual message publication?',
      },
      {
        name: 'Exactly-once',
        fullName: 'Exactly-once Processing',
        type: 'stronger guarantee',
        description: 'Can a scoped effect appear once even when delivery and execution repeat?',
      },
    ],
  },
  zh: {
    eyebrow: '01 · 结果未知实验室',
    title: '扣款已经成功，响应却消失了。',
    description:
      '客户端没有成功或失败的证据。分别在没有稳定身份和使用幂等键时推进重试，观察同一个业务意图怎样走向两个不同结果。',
    modes: { plain: '没有幂等键', keyed: '使用幂等键' },
    modeNotes: {
      plain: '每次 POST 看起来都是一条新指令。',
      keyed: '两次尝试都携带 order-842-payment。',
    },
    stepLabel: '推进请求',
    reset: '重置实验',
    steps: [
      {
        stage: '准备',
        client: '一笔 $42 支付等待发送。',
        service: '尚未收到请求。',
        ledger: '没有支付记录。',
        verdict: '一个业务意图正在等待开始。',
      },
      {
        stage: '第一次尝试',
        client: '发送 POST /payments。',
        service: '服务端接受请求。',
        ledger: '创建支付 pay_701：$42。',
        verdict: '业务效果已经发生一次。',
      },
      {
        stage: '响应丢失',
        client: '超时。支付到底发生了吗？',
        service: '成功响应在传输途中消失。',
        ledger: 'pay_701 仍然存在：$42。',
        verdict: '最危险的状态出现了：客户端面对的是结果未知。',
      },
      {
        stage: '重试',
        client: '客户端再次发送请求。',
        service: '没有任何身份把它和第一次尝试关联。',
        ledger: '再次创建 pay_702：+$42。',
        verdict: '两次尝试变成两次效果，用户总共支付 $84。',
      },
    ],
    keyedFinal: {
      client: '客户端使用 order-842-payment 重试。',
      service: '命中 key：重放已完成的 pay_701 结果。',
      ledger: '没有新扣款，仍然只有 pay_701：$42。',
      verdict: '两次尝试，一次业务效果；现在可以安全恢复。',
    },
    total: '累计扣款',
    attempts: '尝试次数',
    effects: '效果次数',
    contractEyebrow: '02 · Key 契约',
    contractTitle: '只有难处理的情况都有规则，幂等键才真正有用。',
    contractDescription:
      '选择一种情况。真正的设计工作发生在意图身份、原子所有权、并发和时间边界上。',
    cases: {
      complete: {
        tab: '已完成的重复',
        request: '相同调用者 · 相同 key · 相同参数',
        decision: '查到完成记录，不再执行业务效果。',
        result: '重放第一次结果，或返回语义等价结果。',
        rule: '重试靠业务意图识别，不靠它是第几次到达。',
      },
      mismatch: {
        tab: '参数发生改变',
        request: '相同 key · 金额从 $42 变成 $84',
        decision: '把它作为 key 误用直接拒绝。',
        result: '返回参数不匹配错误，不猜测哪个意图才是真的。',
        rule: '请求指纹保护已经绑定到 key 的含义。',
      },
      concurrent: {
        tab: '并发重复',
        request: '同一个 key 的两个副本在任何一个完成前同时到达',
        decision: '只有一个请求可以原子地获得执行权。',
        result: '另一个等待、看到处理中，或收到契约定义的冲突。',
        rule: '先查再插入有竞态；占位必须依靠唯一约束或事务边界。',
      },
      expired: {
        tab: 'Key 已过期',
        request: '重试在历史记录被清理后才到达',
        decision: '服务端可能把它当作新操作。',
        result: '除非还有业务标识保护，否则可能再次产生效果。',
        rule: '服务端保证窗口必须覆盖客户端的最长重试周期。',
      },
    },
    judgeEyebrow: '03 · 操作判断',
    judgeTitle: '先问：这个操作能否自己收敛？',
    judgeDescription: '自然幂等比维护账本更简单。相对变化和外部副作用才需要完整的身份协议。',
    operations: [
      {
        operation: 'SET status = PAID',
        type: '自然幂等',
        description: '每次重复都收敛到同一个被明确命名的状态。',
        tone: 'natural',
      },
      {
        operation: 'DELETE document 42',
        type: '自然幂等',
        description: '响应可以不同，但资源最终始终不存在。',
        tone: 'natural',
      },
      {
        operation: 'POST create payment',
        type: '需要意图 key',
        description: '如果重试没有共享身份，每次创建都会成为一笔新扣款。',
        tone: 'key',
      },
      {
        operation: 'balance = balance + 10',
        type: '非自然幂等',
        description: '每次执行都会再次改变状态。',
        tone: 'unsafe',
      },
    ],
    neighborsEyebrow: '04 · 概念邻居',
    neighborsTitle: '不要混淆恢复、检测、交付和业务效果。',
    neighborsDescription: '它们经常一起出现，但分别回答不同问题。关系类型比缩写本身更值得记住。',
    neighbors: [
      {
        name: 'Retry',
        fullName: 'Retry（重试）',
        type: '恢复策略',
        description: '什么时候再次尝试，退避节奏是什么？',
      },
      {
        name: 'Idempotency Key',
        fullName: 'Idempotency Key（幂等键）',
        type: '请求身份',
        description: '哪些尝试表达的是同一个业务意图？',
      },
      {
        name: 'Deduplication',
        fullName: 'Deduplication（去重）',
        type: '检测机制',
        description: '怎样检测或压制重复交付？',
      },
      {
        name: 'At-least-once',
        fullName: 'At-least-once Delivery（至少一次交付）',
        type: '交付保证',
        description: '为了降低丢失，消息是否可能到达多次？',
      },
      {
        name: 'Outbox',
        fullName: 'Transactional Outbox（事务发件箱）',
        type: '一致性模式',
        description: '怎样把数据库变化与最终消息发布可靠地连接起来？',
      },
      {
        name: 'Exactly-once',
        fullName: 'Exactly-once Processing（恰好一次处理）',
        type: '更强保证',
        description: '即使交付和执行重复，限定范围内的效果能否表现为一次？',
      },
    ],
  },
}

const mode = ref<Mode>('keyed')
const step = ref(0)
const activeCase = ref<EdgeCase>('complete')

const copy = computed(() => COPY[props.locale])
const currentStep = computed(() => {
  if (step.value === 3 && mode.value === 'keyed') return copy.value.keyedFinal
  return copy.value.steps[step.value]
})
const attempts = computed(() => (step.value < 1 ? 0 : step.value < 3 ? 1 : 2))
const effects = computed(() => {
  if (step.value < 1) return 0
  if (step.value < 3 || mode.value === 'keyed') return 1
  return 2
})
const total = computed(() => effects.value * 42)

function setMode(next: Mode) {
  mode.value = next
  step.value = 0
}

function advance() {
  step.value = Math.min(step.value + 1, 3)
}

function reset() {
  step.value = 0
}
</script>

<template>
  <div class="idempotency-visual">
    <section class="concept-section lab-section" aria-labelledby="idempotency-lab-title">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h2 id="idempotency-lab-title">{{ copy.title }}</h2>
        <p>{{ copy.description }}</p>
      </div>

      <div class="lab-shell">
        <div class="mode-switch" role="group" :aria-label="copy.eyebrow">
          <button
            v-for="modeName in ['plain', 'keyed'] as Mode[]"
            :key="modeName"
            type="button"
            :class="{ active: mode === modeName }"
            :aria-pressed="mode === modeName"
            @click="setMode(modeName)"
          >
            <span>{{ copy.modes[modeName] }}</span>
            <small>{{ copy.modeNotes[modeName] }}</small>
          </button>
        </div>

        <div class="lab-grid">
          <div class="timeline-card">
            <div class="progress-row" aria-hidden="true">
              <span v-for="index in 4" :key="index" :class="{ active: step >= index - 1 }"></span>
            </div>

            <div class="stage-label">
              {{ step + 1 }} / 4 ·
              {{ step === 3 && mode === 'keyed' ? copy.steps[3].stage : copy.steps[step].stage }}
            </div>

            <div class="actors" aria-live="polite">
              <article>
                <span class="actor-icon client-icon" aria-hidden="true">C</span>
                <div>
                  <small>CLIENT</small>
                  <p>{{ currentStep.client }}</p>
                </div>
              </article>
              <span class="flow-arrow" aria-hidden="true">→</span>
              <article>
                <span class="actor-icon service-icon" aria-hidden="true">S</span>
                <div>
                  <small>SERVICE</small>
                  <p>{{ currentStep.service }}</p>
                </div>
              </article>
              <span class="flow-arrow" aria-hidden="true">→</span>
              <article>
                <span class="actor-icon ledger-icon" aria-hidden="true">L</span>
                <div>
                  <small>LEDGER</small>
                  <p>{{ currentStep.ledger }}</p>
                </div>
              </article>
            </div>

            <div
              class="verdict"
              :class="{
                danger: step === 3 && mode === 'plain',
                success: step === 3 && mode === 'keyed',
              }"
              aria-live="polite"
            >
              <span aria-hidden="true">{{
                step === 3 ? (mode === 'keyed' ? '✓' : '!') : '→'
              }}</span>
              {{ currentStep.verdict }}
            </div>

            <div class="lab-actions">
              <button type="button" class="primary-action" :disabled="step === 3" @click="advance">
                {{ copy.stepLabel }}
                <span aria-hidden="true">→</span>
              </button>
              <button type="button" class="text-action" :disabled="step === 0" @click="reset">
                {{ copy.reset }}
              </button>
            </div>
          </div>

          <aside class="meter-card" aria-live="polite">
            <div class="receipt-top">
              <span>PAYMENT / 842</span>
              <span :class="mode">{{ mode === 'keyed' ? 'KEYED' : 'PLAIN' }}</span>
            </div>
            <div class="total">
              <small>{{ copy.total }}</small>
              <strong><span aria-hidden="true">$</span>{{ total }}</strong>
            </div>
            <div class="meter-row">
              <span>{{ copy.attempts }}</span>
              <strong>{{ attempts }}</strong>
            </div>
            <div class="meter-row">
              <span>{{ copy.effects }}</span>
              <strong>{{ effects }}</strong>
            </div>
            <div class="receipt-rule"></div>
            <code v-if="mode === 'keyed'">key: order-842-payment</code>
            <code v-else>key: —</code>
            <p>f(f(x)) = f(x)</p>
          </aside>
        </div>
      </div>
    </section>

    <section class="concept-section" aria-labelledby="idempotency-contract-title">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.contractEyebrow }}</p>
        <h2 id="idempotency-contract-title">{{ copy.contractTitle }}</h2>
        <p>{{ copy.contractDescription }}</p>
      </div>

      <div class="case-tabs" role="tablist" :aria-label="copy.contractTitle">
        <button
          v-for="caseName in ['complete', 'mismatch', 'concurrent', 'expired'] as EdgeCase[]"
          :id="'case-tab-' + caseName"
          :key="caseName"
          type="button"
          role="tab"
          :aria-selected="activeCase === caseName"
          :aria-controls="'case-panel-' + caseName"
          :class="{ active: activeCase === caseName }"
          @click="activeCase = caseName"
        >
          {{ copy.cases[caseName].tab }}
        </button>
      </div>

      <article
        :id="'case-panel-' + activeCase"
        class="case-panel"
        role="tabpanel"
        :aria-labelledby="'case-tab-' + activeCase"
        tabindex="0"
      >
        <div class="request-line">
          <span>REQUEST</span>
          <code>{{ copy.cases[activeCase].request }}</code>
        </div>
        <div class="decision-flow">
          <div>
            <small>DECISION</small>
            <strong>{{ copy.cases[activeCase].decision }}</strong>
          </div>
          <span aria-hidden="true">→</span>
          <div>
            <small>RESULT</small>
            <strong>{{ copy.cases[activeCase].result }}</strong>
          </div>
        </div>
        <p class="case-rule">
          <span aria-hidden="true">◆</span>
          {{ copy.cases[activeCase].rule }}
        </p>
      </article>
    </section>

    <section class="concept-section" aria-labelledby="idempotency-judge-title">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.judgeEyebrow }}</p>
        <h2 id="idempotency-judge-title">{{ copy.judgeTitle }}</h2>
        <p>{{ copy.judgeDescription }}</p>
      </div>

      <div class="operation-grid">
        <article
          v-for="operation in copy.operations"
          :key="operation.operation"
          :class="['operation-card', operation.tone]"
        >
          <span class="operation-mark" aria-hidden="true"></span>
          <code>{{ operation.operation }}</code>
          <strong>{{ operation.type }}</strong>
          <p>{{ operation.description }}</p>
        </article>
      </div>
    </section>

    <section
      class="concept-section neighbors-section"
      aria-labelledby="idempotency-neighbors-title"
    >
      <div class="section-heading">
        <p class="eyebrow">{{ copy.neighborsEyebrow }}</p>
        <h2 id="idempotency-neighbors-title">{{ copy.neighborsTitle }}</h2>
        <p>{{ copy.neighborsDescription }}</p>
      </div>

      <div class="neighbor-grid">
        <article v-for="neighbor in copy.neighbors" :key="neighbor.name">
          <div>
            <strong>{{ neighbor.name }}</strong>
            <span>{{ neighbor.type }}</span>
          </div>
          <small>{{ neighbor.fullName }}</small>
          <p>{{ neighbor.description }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.idempotency-visual {
  --idem-ink: var(--foreground);
  --idem-muted: var(--muted-foreground);
  --idem-surface: var(--card);
  --idem-soft: var(--secondary);
  --idem-border: var(--line-card);
  --idem-accent: color-mix(in srgb, #6d5dfc 82%, var(--foreground));
  --idem-accent-soft: color-mix(in srgb, var(--idem-accent) 10%, var(--idem-surface));
  --idem-cyan: #72d7ee;
  --idem-lime: #c7f36a;
  --idem-coral: #ff907f;
  color: var(--idem-ink);
}

.concept-section {
  margin-block: clamp(4.5rem, 9vw, 8.5rem);
}

.section-heading {
  max-width: 780px;
  margin-bottom: 2rem;
}

.section-heading .eyebrow {
  margin: 0 0 0.7rem;
  color: var(--idem-accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.section-heading h2 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.75rem);
  letter-spacing: -0.045em;
  line-height: 1.02;
}

.section-heading > p:last-child {
  max-width: 690px;
  margin: 1rem 0 0;
  color: var(--idem-muted);
  font-size: clamp(1rem, 2vw, 1.15rem);
  line-height: 1.75;
}

.lab-shell {
  padding: clamp(1rem, 3vw, 1.75rem);
  border: 1px solid var(--idem-border);
  border-radius: 1.75rem;
  background:
    radial-gradient(
      circle at 90% 10%,
      color-mix(in srgb, var(--idem-cyan) 18%, transparent),
      transparent 24rem
    ),
    linear-gradient(135deg, var(--idem-soft), var(--idem-surface));
}

.mode-switch {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
  margin-bottom: 1rem;
}

.mode-switch button {
  display: grid;
  gap: 0.2rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--idem-border);
  border-radius: 1rem;
  color: var(--idem-muted);
  text-align: left;
  background: color-mix(in srgb, var(--idem-surface) 85%, transparent);
  cursor: pointer;
}

.mode-switch button span {
  color: var(--idem-ink);
  font-weight: 750;
}

.mode-switch button small {
  line-height: 1.45;
}

.mode-switch button.active {
  border-color: var(--idem-accent);
  background: var(--idem-accent-soft);
  box-shadow: inset 0 0 0 1px var(--idem-accent);
}

.lab-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 0.3fr);
  gap: 1rem;
}

.timeline-card,
.meter-card {
  border: 1px solid var(--idem-border);
  border-radius: 1.35rem;
  background: var(--idem-surface);
}

.timeline-card {
  padding: clamp(1.2rem, 3vw, 2rem);
}

.progress-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.4rem;
}

.progress-row span {
  height: 0.25rem;
  border-radius: 99px;
  background: var(--idem-border);
  transition: background 180ms ease;
}

.progress-row span.active {
  background: var(--idem-accent);
}

.stage-label {
  margin: 1rem 0 1.5rem;
  color: var(--idem-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.actors {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: stretch;
  gap: 0.55rem;
}

.actors article {
  min-height: 10.5rem;
  padding: 1rem;
  border-radius: 1rem;
  background: var(--idem-soft);
}

.actors article small {
  color: var(--idem-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.actors article p {
  margin: 0.65rem 0 0;
  font-size: 0.9rem;
  line-height: 1.55;
}

.actor-icon {
  display: grid;
  width: 2rem;
  height: 2rem;
  margin-bottom: 0.85rem;
  place-items: center;
  border-radius: 0.65rem;
  color: #171717;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  font-weight: 800;
}

.client-icon {
  background: var(--idem-cyan);
}

.service-icon {
  background: var(--idem-lime);
}

.ledger-icon {
  background: #d8c7ff;
}

.flow-arrow {
  align-self: center;
  color: var(--idem-muted);
}

.verdict {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  min-height: 3.4rem;
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  color: var(--idem-muted);
  line-height: 1.5;
  background: var(--idem-soft);
}

.verdict span {
  font-weight: 800;
}

.verdict.danger {
  color: #7e281e;
  background: color-mix(in srgb, var(--idem-coral) 25%, var(--idem-surface));
}

.verdict.success {
  color: #2d5310;
  background: color-mix(in srgb, var(--idem-lime) 31%, var(--idem-surface));
}

.lab-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1rem;
}

.primary-action,
.text-action {
  min-height: 2.75rem;
  border-radius: 99px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.primary-action {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  min-width: 11rem;
  padding: 0.65rem 1rem;
  border: 1px solid var(--idem-ink);
  color: var(--idem-surface);
  background: var(--idem-ink);
}

.text-action {
  padding: 0.65rem 0.85rem;
  border: 0;
  color: var(--idem-muted);
  background: transparent;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

.meter-card {
  position: relative;
  overflow: hidden;
  padding: 1.25rem;
}

.meter-card::after {
  position: absolute;
  right: -2.5rem;
  bottom: -2.5rem;
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  background: color-mix(in srgb, var(--idem-cyan) 25%, transparent);
  content: '';
}

.receipt-top,
.meter-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.receipt-top {
  color: var(--idem-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
}

.receipt-top span:last-child {
  padding: 0.18rem 0.4rem;
  border-radius: 99px;
  color: #171717;
  background: var(--idem-coral);
}

.receipt-top span.keyed {
  background: var(--idem-lime);
}

.total {
  display: grid;
  gap: 0.15rem;
  margin: 2.5rem 0 2rem;
}

.total small {
  color: var(--idem-muted);
}

.total strong {
  font-size: clamp(3rem, 7vw, 5rem);
  letter-spacing: -0.08em;
  line-height: 1;
}

.meter-row {
  padding: 0.7rem 0;
  border-top: 1px solid var(--idem-border);
  color: var(--idem-muted);
}

.meter-row strong {
  color: var(--idem-ink);
}

.receipt-rule {
  margin: 1rem 0;
  border-top: 1px dashed var(--idem-border);
}

.meter-card code,
.meter-card p {
  position: relative;
  z-index: 1;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.meter-card code {
  font-size: 0.72rem;
}

.meter-card p {
  margin: 2rem 0 0;
  font-size: 0.82rem;
}

.case-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.7rem;
}

.case-tabs button {
  flex: 0 0 auto;
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--idem-border);
  border-radius: 99px;
  color: var(--idem-muted);
  font: inherit;
  font-size: 0.84rem;
  font-weight: 700;
  background: var(--idem-surface);
  cursor: pointer;
}

.case-tabs button.active {
  border-color: var(--idem-ink);
  color: var(--idem-surface);
  background: var(--idem-ink);
}

.case-panel {
  padding: clamp(1.2rem, 4vw, 2.4rem);
  border: 1px solid var(--idem-border);
  border-radius: 1.5rem;
  outline: none;
  background:
    linear-gradient(var(--idem-surface), var(--idem-surface)) padding-box,
    linear-gradient(135deg, var(--idem-accent), var(--idem-cyan)) border-box;
}

.case-panel:focus-visible {
  box-shadow: 0 0 0 3px var(--idem-accent-soft);
}

.request-line {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid var(--idem-border);
}

.request-line span,
.decision-flow small {
  color: var(--idem-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.request-line code {
  font-size: 0.82rem;
}

.decision-flow {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
  padding: 2rem 0;
}

.decision-flow div {
  display: grid;
  gap: 0.5rem;
}

.decision-flow strong {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  line-height: 1.45;
}

.case-rule {
  display: flex;
  gap: 0.7rem;
  align-items: flex-start;
  margin: 0;
  padding: 0.9rem 1rem;
  border-radius: 0.85rem;
  color: var(--idem-muted);
  line-height: 1.5;
  background: var(--idem-soft);
}

.case-rule span {
  color: var(--idem-accent);
}

.operation-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.operation-card {
  position: relative;
  display: grid;
  gap: 0.65rem;
  overflow: hidden;
  min-height: 12rem;
  padding: 1.35rem;
  border: 1px solid var(--idem-border);
  border-radius: 1.2rem;
  background: var(--idem-surface);
}

.operation-card code {
  width: fit-content;
  padding: 0.3rem 0.5rem;
  border-radius: 0.45rem;
  font-size: 0.78rem;
  background: var(--idem-soft);
}

.operation-card strong {
  margin-top: auto;
  font-size: 1.1rem;
}

.operation-card p {
  margin: 0;
  color: var(--idem-muted);
  line-height: 1.55;
}

.operation-mark {
  position: absolute;
  top: 0;
  right: 0;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0 1.2rem 0 100%;
  background: var(--idem-coral);
}

.operation-card.natural .operation-mark {
  background: var(--idem-lime);
}

.operation-card.key .operation-mark {
  background: var(--idem-cyan);
}

.neighbors-section {
  padding: clamp(1.2rem, 4vw, 2.2rem);
  border-radius: 1.75rem;
  background: var(--idem-ink);
}

.neighbors-section .section-heading h2 {
  color: var(--idem-surface);
}

.neighbors-section .section-heading > p:last-child {
  color: color-mix(in srgb, var(--idem-surface) 65%, transparent);
}

.neighbor-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.neighbor-grid article {
  padding: 1.1rem;
  border: 1px solid color-mix(in srgb, var(--idem-surface) 17%, transparent);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--idem-surface) 7%, transparent);
}

.neighbor-grid article > div {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  justify-content: space-between;
}

.neighbor-grid strong {
  color: var(--idem-surface);
}

.neighbor-grid span {
  padding: 0.18rem 0.4rem;
  border-radius: 99px;
  color: #171717;
  font-size: 0.67rem;
  font-weight: 750;
  background: var(--idem-lime);
}

.neighbor-grid small {
  display: block;
  margin-top: 0.45rem;
  color: color-mix(in srgb, var(--idem-surface) 52%, transparent);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.neighbor-grid p {
  margin: 0.85rem 0 0;
  color: color-mix(in srgb, var(--idem-surface) 72%, transparent);
  line-height: 1.55;
}

button:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--idem-accent) 45%, transparent);
  outline-offset: 2px;
}

@media (max-width: 760px) {
  .lab-grid,
  .operation-grid,
  .neighbor-grid {
    grid-template-columns: 1fr;
  }

  .actors {
    grid-template-columns: 1fr;
  }

  .actors article {
    min-height: auto;
  }

  .flow-arrow {
    justify-self: center;
    transform: rotate(90deg);
  }

  .decision-flow {
    grid-template-columns: 1fr;
  }

  .decision-flow > span {
    justify-self: center;
    transform: rotate(90deg);
  }
}

@media (max-width: 520px) {
  .mode-switch {
    grid-template-columns: 1fr;
  }

  .request-line {
    display: grid;
  }

  .lab-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .primary-action {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition: none !important;
  }
}
</style>
