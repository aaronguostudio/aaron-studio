<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

type Locale = 'en' | 'zh'

interface Settings {
  baseCashFlow: number
  growth: number
  discountRate: number
  terminalGrowth: number
  netDebt: number
  years: number
}

interface Control {
  key: keyof Settings
  min: number
  max: number
  step: number
  format: 'money' | 'percent' | 'years'
}

interface Copy {
  eyebrow: string
  title: string
  description: string
  reset: string
  changed: string
  assumptions: string
  labels: Record<keyof Settings, string>
  metrics: {
    explicit: string
    terminal: string
    enterprise: string
    equity: string
    terminalShare: string
  }
  chart: {
    title: string
    description: string
    future: string
    present: string
    year: string
    scale: string
  }
  bridge: {
    title: string
    enterprise: string
    debt: string
    equity: string
  }
  sensitivity: {
    title: string
    description: string
    discountRate: string
    terminalGrowth: string
  }
  reading: {
    healthy: string
    terminalHeavy: string
    terminalDominant: string
    invalid: string
    conditional: string
  }
  notes: Array<{ index: string; title: string; body: string }>
  disclosure: string
}

const props = defineProps<{ locale: Locale }>()

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: '01 · Valuation translator',
    title: 'Change an assumption. Watch the value sentence rewrite itself.',
    description:
      'Every control enters the same Free Cash Flow to the Firm model. The chart, valuation bridge, and terminal-value share update together.',
    reset: 'Restore example',
    changed: 'changed',
    assumptions: 'Visible assumptions',
    labels: {
      baseCashFlow: 'Current FCFF',
      growth: 'Explicit FCFF growth',
      discountRate: 'WACC',
      terminalGrowth: 'Stable growth',
      netDebt: 'Net debt',
      years: 'Forecast horizon',
    },
    metrics: {
      explicit: 'Explicit-period PV',
      terminal: 'Terminal-value PV',
      enterprise: 'Enterprise value',
      equity: 'Equity value',
      terminalShare: 'Terminal share',
    },
    chart: {
      title: 'Future cash translated into present value',
      description:
        'Each pale bar is a future cash flow. The solid bar inside it is what remains after discounting it to today.',
      future: 'future cash',
      present: 'present value',
      year: 'Y',
      scale: 'Fixed cash-flow scale · $280m',
    },
    bridge: {
      title: 'Enterprise-to-equity bridge',
      enterprise: 'Enterprise value',
      debt: 'Net debt',
      equity: 'Equity value',
    },
    sensitivity: {
      title: 'WACC × stable-growth sensitivity',
      description:
        'The same cash-flow forecast can support a wide range of values. The outlined cell is the current model.',
      discountRate: 'WACC',
      terminalGrowth: 'stable growth',
    },
    reading: {
      healthy:
        'The explicit forecast carries a meaningful share of value, but the answer still depends on the steady state.',
      terminalHeavy:
        'Most value sits in the terminal period. Research the long-run growth, reinvestment, and return assumptions before refining decimals.',
      terminalDominant:
        'The terminal period dominates this valuation. Treat the result as highly sensitive to distant assumptions.',
      invalid:
        'The model stops here: WACC must remain above stable growth. A non-positive spread makes the stable-growth formula economically invalid.',
      conditional:
        'Accurate reading: under the visible assumptions, the estimated equity value is',
    },
    notes: [
      {
        index: 'A',
        title: 'Match the claim',
        body: 'This lab discounts Free Cash Flow to the Firm at WACC, then subtracts net debt to reach equity value.',
      },
      {
        index: 'B',
        title: 'Growth is not free',
        body: 'A complete model must connect growth to margins, working capital, capital expenditure, and return on reinvestment.',
      },
      {
        index: 'C',
        title: 'Read a conditional sentence',
        body: 'The output is useful because the assumptions are visible and challengeable—not because the arithmetic is precise.',
      },
    ],
    disclosure:
      'Educational, hypothetical illustration only. It does not value any real company or provide investment advice.',
  },
  zh: {
    eyebrow: '01 · 估值翻译器',
    title: '改变一个假设，观察价值这句条件句怎样改写。',
    description:
      '每个控件都进入同一个企业自由现金流模型。现金流图、价值桥梁与终值占比会同步更新。',
    reset: '恢复示例',
    changed: '已改变',
    assumptions: '可见假设',
    labels: {
      baseCashFlow: '当前 FCFF',
      growth: '显性期 FCFF 增长',
      discountRate: 'WACC',
      terminalGrowth: '稳定增长',
      netDebt: '净债务',
      years: '预测期',
    },
    metrics: {
      explicit: '显性期现值',
      terminal: '终值现值',
      enterprise: '企业价值',
      equity: '股权价值',
      terminalShare: '终值占比',
    },
    chart: {
      title: '把未来现金翻译成今天的现值',
      description: '浅色柱是未来现金流，里面的实色柱是折回今天以后剩下的现值。',
      future: '未来现金',
      present: '现值',
      year: '第',
      scale: '固定现金流刻度 · $280m',
    },
    bridge: {
      title: '企业价值到股权价值的桥梁',
      enterprise: '企业价值',
      debt: '净债务',
      equity: '股权价值',
    },
    sensitivity: {
      title: 'WACC × 稳定增长敏感度',
      description: '同一条现金流预测可能支持很宽的价值范围。描边格是当前模型。',
      discountRate: 'WACC',
      terminalGrowth: '稳定增长',
    },
    reading: {
      healthy: '显性预测期承担了有意义的价值，但答案仍然取决于稳定状态。',
      terminalHeavy: '大部分价值位于终值期。先研究长期增长、再投资与回报假设，再精修小数。',
      terminalDominant: '终值期主导了估值。应把结果理解为对远期假设高度敏感。',
      invalid:
        '模型在这里停止：WACC 必须高于稳定增长率。非正的差值会让稳定增长公式在经济上失效。',
      conditional: '准确读法：在页面可见的假设下，估计股权价值为',
    },
    notes: [
      {
        index: 'A',
        title: '匹配资本请求权',
        body: '本实验用 WACC 折现企业自由现金流，再扣除净债务得到股权价值。',
      },
      {
        index: 'B',
        title: '增长不是免费的',
        body: '完整模型必须把增长连接到利润率、营运资本、资本支出与再投资回报。',
      },
      {
        index: 'C',
        title: '把输出读成条件句',
        body: '结果之所以有用，是因为假设可见且可以挑战，而不是因为算术精确。',
      },
    ],
    disclosure: '本页只用于通用、假设性的概念学习，不估计任何真实公司，也不构成投资建议。',
  },
}

const DEFAULTS: Settings = {
  baseCashFlow: 100,
  growth: 7,
  discountRate: 9,
  terminalGrowth: 3,
  netDebt: 250,
  years: 5,
}

const settings = reactive<Settings>({ ...DEFAULTS })
const copy = computed(() => COPY[props.locale])
const labRoot = ref<HTMLElement | null>(null)
const isSummaryPinned = ref(false)
const summaryLeft = ref('1rem')
const summaryWidth = ref('calc(100vw - 2rem)')

const controls: Control[] = [
  { key: 'baseCashFlow', min: 40, max: 200, step: 10, format: 'money' },
  { key: 'growth', min: -5, max: 20, step: 1, format: 'percent' },
  { key: 'discountRate', min: 5, max: 16, step: 0.5, format: 'percent' },
  { key: 'terminalGrowth', min: 0, max: 6, step: 0.5, format: 'percent' },
  { key: 'netDebt', min: 0, max: 800, step: 25, format: 'money' },
  { key: 'years', min: 3, max: 10, step: 1, format: 'years' },
]

function valueAt(discountRate: number, terminalGrowth: number) {
  const r = discountRate / 100
  const g = terminalGrowth / 100
  if (r <= g) return null

  const flows = Array.from({ length: settings.years }, (_, index) => {
    const year = index + 1
    const cash = settings.baseCashFlow * (1 + settings.growth / 100) ** year
    const present = cash / (1 + r) ** year
    return { year, cash, present }
  })

  const explicitValue = flows.reduce((sum, item) => sum + item.present, 0)
  const finalCash = flows.at(-1)?.cash ?? settings.baseCashFlow
  const terminalAtHorizon = (finalCash * (1 + g)) / (r - g)
  const terminalValue = terminalAtHorizon / (1 + r) ** settings.years
  const enterpriseValue = explicitValue + terminalValue
  const equityValue = enterpriseValue - settings.netDebt

  return {
    flows,
    explicitValue,
    terminalValue,
    enterpriseValue,
    equityValue,
    terminalShare: terminalValue / enterpriseValue,
  }
}

const result = computed(() => valueAt(settings.discountRate, settings.terminalGrowth))
const changedCount = computed(
  () =>
    (Object.keys(DEFAULTS) as Array<keyof Settings>).filter(
      (key) => settings[key] !== DEFAULTS[key],
    ).length,
)

const cashRows = computed(() =>
  (result.value?.flows ?? []).map((item) => ({
    ...item,
    cashHeight: Math.min(100, (item.cash / 280) * 100),
    presentHeight: Math.min(100, (item.present / 280) * 100),
  })),
)

const bridge = computed(() => {
  if (!result.value) return { equity: 0, debt: 0 }
  const enterprise = Math.max(result.value.enterpriseValue, 1)
  const equity = Math.max(0, result.value.equityValue)
  return {
    equity: Math.min(100, (equity / enterprise) * 100),
    debt: Math.min(100, (settings.netDebt / enterprise) * 100),
  }
})

const sensitivityGrowths = computed(() =>
  [-1, 0, 1].map((offset) => Math.max(0, settings.terminalGrowth + offset)),
)
const sensitivityRates = computed(() =>
  [-1.5, -0.75, 0, 0.75, 1.5].map((offset) =>
    Math.max(1, settings.discountRate + offset),
  ),
)

const sensitivity = computed(() =>
  sensitivityGrowths.value.map((growth) =>
    sensitivityRates.value.map((rate) => {
      const cell = valueAt(rate, growth)
      const current =
        Math.abs(rate - settings.discountRate) < 0.001 &&
        Math.abs(growth - settings.terminalGrowth) < 0.001
      const ratio =
        cell && result.value ? cell.enterpriseValue / result.value.enterpriseValue : null
      const tone =
        ratio === null
          ? 'invalid'
          : ratio > 1.12
            ? 'high'
            : ratio < 0.88
              ? 'low'
              : 'middle'
      return { rate, growth, value: cell?.enterpriseValue ?? null, current, tone }
    }),
  ),
)

const reading = computed(() => {
  if (!result.value) return copy.value.reading.invalid
  if (result.value.terminalShare >= 0.82) return copy.value.reading.terminalDominant
  if (result.value.terminalShare >= 0.65) return copy.value.reading.terminalHeavy
  return copy.value.reading.healthy
})

function isChanged(key: keyof Settings) {
  return settings[key] !== DEFAULTS[key]
}

function restoreExample() {
  Object.assign(settings, DEFAULTS)
}

function updateSummaryPin() {
  if (!labRoot.value || window.innerWidth >= 980) {
    isSummaryPinned.value = false
    return
  }

  const bounds = labRoot.value.getBoundingClientRect()
  isSummaryPinned.value = bounds.top < 72 && bounds.bottom > 150
  summaryLeft.value = `${Math.max(16, bounds.left)}px`
  summaryWidth.value = `${Math.min(bounds.width, window.innerWidth - 32)}px`
}

onMounted(() => {
  updateSummaryPin()
  window.addEventListener('scroll', updateSummaryPin, { passive: true })
  window.addEventListener('resize', updateSummaryPin)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateSummaryPin)
  window.removeEventListener('resize', updateSummaryPin)
})

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return '—'
  const sign = value < 0 ? '−' : ''
  const absolute = Math.abs(value)
  if (absolute >= 1000) return `${sign}$${(absolute / 1000).toFixed(2)}b`
  return `${sign}$${Math.round(absolute)}m`
}

function formatPercent(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`
}

function formatControl(control: Control) {
  const value = settings[control.key]
  if (control.format === 'money') return `$${value}m`
  if (control.format === 'percent') return formatPercent(value)
  return props.locale === 'zh' ? `${value} 年` : `${value} years`
}
</script>

<template>
  <section ref="labRoot" class="dcf-lab" aria-labelledby="dcf-lab-title">
    <header class="lab-header">
      <div>
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h2 id="dcf-lab-title">{{ copy.title }}</h2>
        <p class="intro">{{ copy.description }}</p>
      </div>
      <button type="button" class="reset-button" @click="restoreExample">
        {{ copy.reset }}
      </button>
    </header>

    <div class="mobile-summary-shell">
      <div
        class="mobile-summary"
        :class="{ 'is-pinned': isSummaryPinned }"
        :style="
          isSummaryPinned
            ? { left: summaryLeft, width: summaryWidth }
            : undefined
        "
        aria-live="polite"
      >
        <span>
          {{ copy.metrics.enterprise }}
          <strong>{{ result ? formatMoney(result.enterpriseValue) : '—' }}</strong>
        </span>
        <span>
          {{ copy.metrics.equity }}
          <strong>{{ result ? formatMoney(result.equityValue) : '—' }}</strong>
        </span>
        <span>
          {{ copy.metrics.terminalShare }}
          <strong>{{ result ? formatPercent(result.terminalShare * 100) : '—' }}</strong>
        </span>
      </div>
    </div>

    <div class="workspace">
      <aside class="control-panel" aria-labelledby="dcf-assumptions-title">
        <div class="control-heading">
          <h3 id="dcf-assumptions-title">{{ copy.assumptions }}</h3>
          <span v-if="changedCount">{{ changedCount }} {{ copy.changed }}</span>
        </div>

        <div class="control-grid">
          <label
            v-for="control in controls"
            :key="control.key"
            class="control-card"
            :class="{ 'is-changed': isChanged(control.key) }"
          >
            <span class="control-top">
              <span>{{ copy.labels[control.key] }}</span>
              <output>{{ formatControl(control) }}</output>
            </span>
            <input
              v-model.number="settings[control.key]"
              type="range"
              :min="control.min"
              :max="control.max"
              :step="control.step"
              :aria-label="copy.labels[control.key]"
            />
          </label>
        </div>
      </aside>

      <div class="result-panel">
        <div v-if="result" class="metric-grid" aria-live="polite">
          <article>
            <span>{{ copy.metrics.explicit }}</span>
            <strong>{{ formatMoney(result.explicitValue) }}</strong>
          </article>
          <article class="metric-terminal">
            <span>{{ copy.metrics.terminal }}</span>
            <strong>{{ formatMoney(result.terminalValue) }}</strong>
          </article>
          <article>
            <span>{{ copy.metrics.enterprise }}</span>
            <strong>{{ formatMoney(result.enterpriseValue) }}</strong>
          </article>
          <article class="metric-equity">
            <span>{{ copy.metrics.equity }}</span>
            <strong>{{ formatMoney(result.equityValue) }}</strong>
          </article>
        </div>

        <div v-else class="guardrail" role="alert" aria-live="assertive">
          <b>r ≤ g</b>
          <p>{{ copy.reading.invalid }}</p>
        </div>

        <figure v-if="result" class="cash-chart">
          <figcaption>
            <div>
              <h3>{{ copy.chart.title }}</h3>
              <p>{{ copy.chart.description }}</p>
            </div>
            <span>{{ copy.chart.scale }}</span>
          </figcaption>

          <div class="cash-chart-scroll">
            <div class="cash-bars">
              <div v-for="item in cashRows" :key="item.year" class="cash-column">
                <div class="bar-zone">
                  <div class="cash-future" :style="{ height: `${item.cashHeight}%` }">
                    <div
                      class="cash-present"
                      :style="{ height: `${item.presentHeight}%` }"
                    ></div>
                  </div>
                </div>
                <b>{{ formatMoney(item.present) }}</b>
                <span>{{ copy.chart.year }}{{ item.year }}</span>
              </div>
            </div>
          </div>

          <div class="chart-legend">
            <span><i class="legend-future"></i>{{ copy.chart.future }}</span>
            <span><i class="legend-present"></i>{{ copy.chart.present }}</span>
          </div>
        </figure>

        <section v-if="result" class="bridge-card" aria-live="polite">
          <header>
            <h3>{{ copy.bridge.title }}</h3>
            <strong>{{ formatPercent(result.terminalShare * 100) }} {{ copy.metrics.terminalShare }}</strong>
          </header>
          <div class="bridge-bar" aria-hidden="true">
            <span class="equity-bar" :style="{ width: `${bridge.equity}%` }"></span>
            <span class="debt-bar" :style="{ width: `${bridge.debt}%` }"></span>
          </div>
          <div class="bridge-labels">
            <span>{{ copy.bridge.enterprise }} · {{ formatMoney(result.enterpriseValue) }}</span>
            <span>{{ copy.bridge.debt }} · {{ formatMoney(settings.netDebt) }}</span>
            <b>{{ copy.bridge.equity }} · {{ formatMoney(result.equityValue) }}</b>
          </div>
        </section>

        <p class="reading" aria-live="polite">
          {{ reading }}
          <template v-if="result">
            {{ copy.reading.conditional }} <b>{{ formatMoney(result.equityValue) }}</b>.
          </template>
        </p>
      </div>
    </div>

    <section class="sensitivity-section" aria-labelledby="dcf-sensitivity-title">
      <div class="sensitivity-copy">
        <p class="eyebrow">02 · Sensitivity</p>
        <h3 id="dcf-sensitivity-title">{{ copy.sensitivity.title }}</h3>
        <p>{{ copy.sensitivity.description }}</p>
      </div>

      <div class="matrix-scroll">
        <div class="matrix" :style="{ '--columns': sensitivityRates.length }">
          <span class="matrix-corner">
            {{ copy.sensitivity.terminalGrowth }} ↓<br />{{ copy.sensitivity.discountRate }} →
          </span>
          <span v-for="rate in sensitivityRates" :key="`rate-${rate}`" class="matrix-head">
            {{ formatPercent(rate) }}
          </span>
          <template v-for="(row, rowIndex) in sensitivity" :key="`row-${rowIndex}`">
            <span class="matrix-head">{{ formatPercent(sensitivityGrowths[rowIndex]) }}</span>
            <span
              v-for="cell in row"
              :key="`${cell.rate}-${cell.growth}`"
              class="matrix-cell"
              :class="[`is-${cell.tone}`, { 'is-current': cell.current }]"
            >
              {{ cell.value === null ? 'r ≤ g' : formatMoney(cell.value) }}
            </span>
          </template>
        </div>
      </div>
    </section>

    <section class="reading-section" aria-labelledby="dcf-reading-title">
      <p class="eyebrow">03 · Reading discipline</p>
      <h3 id="dcf-reading-title">
        {{ props.locale === 'zh' ? '公式有用，因为假设保持可见。' : 'The formula is useful because the assumptions stay visible.' }}
      </h3>
      <div class="note-grid">
        <article v-for="note in copy.notes" :key="note.index">
          <span>{{ note.index }}</span>
          <h4>{{ note.title }}</h4>
          <p>{{ note.body }}</p>
        </article>
      </div>
      <p class="disclosure">{{ copy.disclosure }}</p>
    </section>
  </section>
</template>

<style scoped>
.dcf-lab {
  --orange: #ff6948;
  --violet: #7567f6;
  --lime: #d8ff68;
  --teal: #35a7a0;
  margin: 2.5rem 0 0;
  color: var(--foreground);
}

.lab-header {
  display: grid;
  gap: 1.25rem;
  padding: clamp(1.5rem, 4vw, 2.75rem);
  border: 1px solid var(--line-card);
  border-radius: 1.5rem 1.5rem 0 0;
  background:
    radial-gradient(
      circle at 88% 10%,
      color-mix(in srgb, var(--violet) 14%, transparent),
      transparent 35%
    ),
    var(--card);
}

@media (min-width: 860px) {
  .lab-header {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
  }
}

.eyebrow,
.control-heading span,
.cash-chart figcaption > span,
.matrix-head,
.matrix-corner {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  text-transform: uppercase;
  letter-spacing: 0.13em;
}

.eyebrow {
  margin: 0;
  color: var(--orange);
  font-size: 0.68rem;
  font-weight: 800;
}

.lab-header h2,
.sensitivity-copy h3,
.reading-section > h3 {
  margin: 0.75rem 0 0;
  color: var(--foreground);
  font-size: clamp(2rem, 5vw, 4.25rem);
  font-weight: 690;
  line-height: 0.98;
  letter-spacing: -0.055em;
}

.intro {
  max-width: 49rem;
  margin: 1rem 0 0;
  color: var(--muted-foreground);
  font-size: 1rem;
  line-height: 1.7;
}

.reset-button {
  min-height: 2.75rem;
  padding: 0 1.1rem;
  border: 1px solid var(--foreground);
  border-radius: 999px;
  color: var(--card);
  background: var(--foreground);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 750;
  cursor: pointer;
}

.reset-button:hover,
.reset-button:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--orange) 50%, transparent);
  outline-offset: 2px;
}

.mobile-summary-shell {
  min-height: 3.7rem;
  border-right: 1px solid var(--line-card);
  border-left: 1px solid var(--line-card);
  background: var(--line-card);
}

.mobile-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: var(--line-card);
}

.mobile-summary.is-pinned {
  position: fixed;
  z-index: 40;
  top: 4.5rem;
  border: 1px solid var(--line-card);
  border-radius: 0 0 0.85rem 0.85rem;
  box-shadow: 0 0.9rem 2rem color-mix(in srgb, var(--foreground) 14%, transparent);
}

.mobile-summary span {
  min-width: 0;
  padding: 0.65rem 0.55rem;
  color: var(--muted-foreground);
  background: var(--card);
  font-size: 0.61rem;
  line-height: 1.3;
}

.mobile-summary strong {
  display: block;
  overflow: hidden;
  margin-top: 0.25rem;
  color: var(--foreground);
  font-size: clamp(0.95rem, 4vw, 1.25rem);
  text-overflow: ellipsis;
}

.workspace {
  display: grid;
  border: 1px solid var(--line-card);
  border-top: 0;
  border-radius: 0 0 1.5rem 1.5rem;
  background: var(--card);
}

.control-panel {
  padding: clamp(1.1rem, 3vw, 1.5rem);
  border-bottom: 1px solid var(--line-card);
  background: color-mix(in srgb, var(--secondary) 72%, var(--card));
}

.control-heading,
.control-top,
.cash-chart figcaption,
.bridge-card header,
.bridge-labels {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.control-heading h3,
.cash-chart h3,
.bridge-card h3 {
  margin: 0;
  color: var(--foreground);
  font-size: 0.95rem;
}

.control-heading span {
  color: var(--orange);
  font-size: 0.57rem;
  font-weight: 800;
}

.control-grid {
  display: grid;
  gap: 0.7rem;
  margin-top: 1rem;
}

@media (min-width: 560px) and (max-width: 979px) {
  .control-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.control-card {
  min-width: 0;
  padding: 0.9rem;
  border: 1px solid var(--line-card);
  border-radius: 0.95rem;
  background: var(--card);
  transition:
    border-color 160ms ease,
    background 160ms ease;
}

.control-card.is-changed {
  border-color: color-mix(in srgb, var(--orange) 72%, var(--line-card));
  background: color-mix(in srgb, var(--orange) 10%, var(--card));
}

.control-top {
  align-items: baseline;
  min-height: 2.15rem;
  color: var(--muted-foreground);
  font-size: 0.73rem;
  line-height: 1.35;
}

.control-top output {
  flex: 0 0 auto;
  color: var(--foreground);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.78rem;
  font-weight: 800;
}

.control-card input[type='range'] {
  width: 100%;
  margin-top: 0.65rem;
  accent-color: var(--orange);
  cursor: pointer;
}

.result-panel {
  min-width: 0;
  padding: clamp(0.85rem, 2.4vw, 1.35rem);
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  overflow: hidden;
  border: 1px solid var(--line-card);
  border-radius: 1rem;
  background: var(--line-card);
}

.metric-grid article {
  min-width: 0;
  padding: 0.75rem;
  background: var(--card);
}

.metric-grid .metric-terminal {
  color: #171713;
  background: var(--lime);
}

.metric-grid .metric-equity {
  color: #fff;
  background: var(--violet);
}

.metric-grid span {
  display: block;
  color: var(--muted-foreground);
  font-size: 0.66rem;
}

.metric-terminal span {
  color: rgba(23, 23, 19, 0.68);
}

.metric-equity span {
  color: rgba(255, 255, 255, 0.74);
}

.metric-grid strong {
  display: block;
  overflow: hidden;
  margin-top: 0.35rem;
  color: inherit;
  font-size: clamp(1.15rem, 3vw, 1.65rem);
  line-height: 1;
  text-overflow: ellipsis;
}

.guardrail {
  padding: clamp(1.5rem, 5vw, 3rem);
  border: 1px solid color-mix(in srgb, var(--orange) 70%, var(--line-card));
  border-radius: 1rem;
  background: color-mix(in srgb, var(--orange) 11%, var(--card));
}

.guardrail b {
  color: var(--orange);
  font-size: clamp(2.5rem, 8vw, 5.5rem);
  letter-spacing: -0.07em;
}

.guardrail p {
  max-width: 38rem;
  margin: 0.75rem 0 0;
  color: var(--foreground);
  line-height: 1.65;
}

.cash-chart {
  margin: 0.85rem 0 0;
  padding: 0.85rem;
  border: 1px solid var(--line-card);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--card) 93%, var(--foreground) 1%);
}

.cash-chart figcaption {
  align-items: flex-start;
}

.cash-chart figcaption p {
  max-width: 34rem;
  margin: 0.3rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.7rem;
  line-height: 1.45;
}

.cash-chart figcaption > span {
  flex: 0 0 auto;
  color: var(--muted-foreground);
  font-size: 0.54rem;
}

.cash-chart-scroll {
  overflow-x: auto;
  margin-top: 0.65rem;
  scrollbar-width: thin;
}

.cash-bars {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(2.65rem, 1fr);
  gap: 0.45rem;
  min-width: max(100%, 30rem);
  height: 12rem;
  padding-top: 0.35rem;
  border-bottom: 1px solid var(--line-subtle);
}

.cash-column {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto auto;
  align-items: end;
  gap: 0.2rem;
  min-width: 0;
  text-align: center;
}

.bar-zone {
  display: flex;
  align-items: end;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.cash-future {
  position: relative;
  width: min(70%, 2.35rem);
  min-height: 0.2rem;
  border: 1px solid color-mix(in srgb, var(--violet) 48%, var(--line-card));
  border-radius: 0.55rem 0.55rem 0.2rem 0.2rem;
  background: color-mix(in srgb, var(--violet) 12%, var(--card));
}

.cash-present {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  max-height: 100%;
  border-radius: 0.48rem 0.48rem 0.12rem 0.12rem;
  background: var(--orange);
  transition: height 160ms ease;
}

.cash-column b {
  overflow: hidden;
  color: var(--foreground);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.56rem;
  text-overflow: ellipsis;
}

.cash-column > span {
  color: var(--muted-foreground);
  font-size: 0.57rem;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  margin-top: 0.65rem;
  color: var(--muted-foreground);
  font-size: 0.64rem;
}

.chart-legend span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.chart-legend i {
  width: 1.2rem;
  height: 0.45rem;
  border-radius: 999px;
}

.legend-future {
  border: 1px solid color-mix(in srgb, var(--violet) 48%, var(--line-card));
  background: color-mix(in srgb, var(--violet) 12%, var(--card));
}

.legend-present {
  background: var(--orange);
}

.bridge-card {
  margin-top: 0.85rem;
  padding: 0.8rem;
  border: 1px solid var(--line-card);
  border-radius: 1rem;
  background: var(--card);
}

.bridge-card header {
  align-items: baseline;
}

.bridge-card header strong {
  color: var(--orange);
  font-size: 0.7rem;
}

.bridge-bar {
  display: flex;
  overflow: hidden;
  height: 1.1rem;
  margin-top: 0.65rem;
  border: 1px solid var(--line-card);
  border-radius: 999px;
  background: var(--secondary);
}

.equity-bar {
  background: var(--violet);
  transition: width 160ms ease;
}

.debt-bar {
  margin-left: auto;
  background: var(--orange);
  transition: width 160ms ease;
}

.bridge-labels {
  flex-wrap: wrap;
  margin-top: 0.55rem;
  color: var(--muted-foreground);
  font-size: 0.59rem;
}

.bridge-labels b {
  color: var(--foreground);
}

.reading {
  margin: 0.85rem 0 0;
  padding: 0.75rem 0.85rem;
  border-left: 4px solid var(--orange);
  color: var(--foreground);
  background: color-mix(in srgb, var(--orange) 10%, var(--card));
  font-size: 0.72rem;
  line-height: 1.55;
}

@media (min-width: 980px) {
  .mobile-summary-shell {
    display: none;
  }

  .workspace {
    grid-template-columns: minmax(17rem, 0.72fr) minmax(0, 1.65fr);
  }

  .control-panel {
    border-right: 1px solid var(--line-card);
    border-bottom: 0;
    border-radius: 0 0 0 1.5rem;
  }

  .metric-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .result-panel {
    position: sticky;
    top: 5.25rem;
    align-self: start;
  }

  .metric-grid article {
    padding: 0.8rem;
  }

  .cash-bars {
    min-width: 100%;
    height: 13.5rem;
  }
}

.sensitivity-section,
.reading-section {
  margin-top: 1.25rem;
  padding: clamp(1.5rem, 4vw, 2.75rem);
  border: 1px solid var(--line-card);
  border-radius: 1.5rem;
  background: var(--card);
}

.sensitivity-section {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 920px) {
  .sensitivity-section {
    grid-template-columns: minmax(15rem, 0.72fr) minmax(0, 1.5fr);
    align-items: center;
  }
}

.sensitivity-copy h3,
.reading-section > h3 {
  font-size: clamp(1.75rem, 4vw, 3.15rem);
}

.sensitivity-copy > p:last-child {
  margin: 0.85rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.82rem;
  line-height: 1.65;
}

.matrix-scroll {
  overflow-x: auto;
  scrollbar-width: thin;
}

.matrix {
  --columns: 5;
  display: grid;
  grid-template-columns: minmax(6rem, 0.9fr) repeat(var(--columns), minmax(5.1rem, 1fr));
  gap: 1px;
  min-width: 39rem;
  overflow: hidden;
  border: 1px solid var(--line-card);
  border-radius: 1rem;
  background: var(--line-card);
}

.matrix-head,
.matrix-corner,
.matrix-cell {
  display: grid;
  min-height: 3.15rem;
  place-items: center;
  padding: 0.45rem;
  text-align: center;
}

.matrix-head,
.matrix-corner {
  color: var(--muted-foreground);
  background: var(--secondary);
  font-size: 0.54rem;
  line-height: 1.45;
}

.matrix-cell {
  position: relative;
  color: var(--foreground);
  background: var(--card);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.68rem;
  font-weight: 750;
}

.matrix-cell.is-high {
  background: color-mix(in srgb, var(--lime) 48%, var(--card));
}

.matrix-cell.is-low {
  background: color-mix(in srgb, var(--orange) 17%, var(--card));
}

.matrix-cell.is-invalid {
  color: var(--orange);
  background:
    repeating-linear-gradient(
      -45deg,
      color-mix(in srgb, var(--orange) 8%, var(--card)) 0 0.35rem,
      var(--card) 0.35rem 0.7rem
    );
}

.matrix-cell.is-current::after {
  position: absolute;
  inset: 0.22rem;
  border: 2px solid var(--violet);
  border-radius: 0.55rem;
  content: '';
  pointer-events: none;
}

.note-grid {
  display: grid;
  gap: 1px;
  overflow: hidden;
  margin-top: 1.5rem;
  border: 1px solid var(--line-card);
  border-radius: 1rem;
  background: var(--line-card);
}

@media (min-width: 820px) {
  .note-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.note-grid article {
  padding: 1.2rem;
  background: color-mix(in srgb, var(--card) 92%, var(--foreground) 1%);
}

.note-grid article > span {
  color: var(--orange);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.7rem;
  font-weight: 800;
}

.note-grid h4 {
  margin: 1.2rem 0 0;
  color: var(--foreground);
  font-size: 1rem;
}

.note-grid p,
.disclosure {
  color: var(--muted-foreground);
  font-size: 0.78rem;
  line-height: 1.65;
}

.note-grid p {
  margin: 0.5rem 0 0;
}

.disclosure {
  margin: 1.15rem 0 0;
  padding-top: 0.9rem;
  border-top: 1px solid var(--line-subtle);
}

@media (prefers-reduced-motion: reduce) {
  .control-card,
  .cash-present,
  .equity-bar,
  .debt-bar {
    transition: none;
  }
}
</style>
