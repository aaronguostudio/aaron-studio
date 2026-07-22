<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

type Locale = 'en' | 'zh'

interface Settings {
  startingAssets: number
  annualWithdrawal: number
  years: number
  stockWeight: number
  stockReturn: number
  stockVolatility: number
  bondReturn: number
  bondVolatility: number
  correlation: number
  inflation: number
  fee: number
}

interface SimulationResult {
  paths: number[][]
  p10: number[]
  p25: number[]
  median: number[]
  p75: number[]
  p90: number[]
  successRate: number
  medianEnd: number
  p10End: number
  medianFailureYear: number | null
}

interface Copy {
  eyebrow: string
  title: string
  description: string
  fixedSeed: string
  newPaths: string
  reset: string
  primary: string
  assumptions: string
  assumptionsNote: string
  changed: string
  labels: Record<keyof Settings, string>
  metrics: {
    success: string
    median: string
    lower: string
    failure: string
    noFailure: string
  }
  chartTitle: string
  chartDescription: string
  legend: {
    paths: string
    middle: string
    current: string
    baseline: string
    depleted: string
  }
  yearsLabel: string
  conditionalLead: string
  conditionalTail: string
  baselineSame: string
  lower: string
  higher: string
  insightEyebrow: string
  insightTitle: string
  insights: Array<{ index: string; title: string; body: string }>
  disclosure: string
}

const props = defineProps<{ locale: Locale }>()

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: '01 · Conditional futures lab',
    title: 'Change an assumption. Watch the whole distribution move.',
    description:
      'Every control is wired into the same 2,000-path model. The dashed line preserves the example assumptions so you can distinguish a real effect from a freshly rescaled chart.',
    fixedSeed: 'Seed',
    newPaths: 'Draw new paths',
    reset: 'Restore example',
    primary: 'Decision setup',
    assumptions: 'Model assumptions · return, volatility, dependence, inflation & fees',
    assumptionsNote:
      'These inputs define which synthetic worlds can exist. They are assumptions, not forecasts.',
    changed: 'changed',
    labels: {
      startingAssets: 'Starting assets',
      annualWithdrawal: 'First annual withdrawal',
      years: 'Time horizon',
      stockWeight: 'Stock allocation',
      stockReturn: 'Stock expected return',
      stockVolatility: 'Stock annual volatility',
      bondReturn: 'Bond expected return',
      bondVolatility: 'Bond annual volatility',
      correlation: 'Stock–bond correlation',
      inflation: 'Annual inflation',
      fee: 'Annual fee',
    },
    metrics: {
      success: 'Lasts full horizon',
      median: 'Median ending assets',
      lower: '10th percentile ending assets',
      failure: 'Median depletion year',
      noFailure: 'Not reached',
    },
    chartTitle: '2,000 synthetic paths',
    chartDescription:
      'The shaded fan contains the middle 80% and 50% of outcomes. Faint lines are sampled paths; the solid line is the current median.',
    legend: {
      paths: 'sample paths',
      middle: 'middle 80% / 50%',
      current: 'current median',
      baseline: 'example median',
      depleted: 'depletion floor',
    },
    yearsLabel: 'years',
    conditionalLead: 'Accurate reading:',
    conditionalTail:
      'of 2,000 synthetic paths lasted the full horizon under the visible return, volatility, correlation, inflation, fee, timing, and withdrawal assumptions.',
    baselineSame: 'same as example',
    lower: 'lower',
    higher: 'higher',
    insightEyebrow: '02 · Reading discipline',
    insightTitle: 'The chart becomes useful when its limits stay visible.',
    insights: [
      {
        index: 'A',
        title: 'A range is not a forecast',
        body: 'The fan describes outcomes allowed by the model. It does not identify which path will occur.',
      },
      {
        index: 'B',
        title: 'More runs solve one error',
        body: 'Iterations reduce sampling noise. They do not repair omitted risks, weak data, or unrealistic distributions.',
      },
      {
        index: 'C',
        title: 'Compare rules, not destiny scores',
        body: 'Results are strongest for comparing decisions under consistent assumptions and inspecting the paths that fail.',
      },
    ],
    disclosure:
      'Educational, hypothetical illustration only. It does not provide personalized investment advice or predict actual results.',
  },
  zh: {
    eyebrow: '01 · 条件式未来实验室',
    title: '改变一个假设，观察整个分布怎样移动。',
    description:
      '每个控件都直接进入同一个 2,000 路径模型。虚线保留示例假设，帮助你分辨真实影响与图表自动缩放。',
    fixedSeed: 'Seed',
    newPaths: '换一批路径',
    reset: '恢复示例',
    primary: '决策设定',
    assumptions: '模型假设 · 回报、波动、依赖关系、通胀与费用',
    assumptionsNote: '这些输入决定哪些合成世界可以存在。它们是假设，不是预测。',
    changed: '已改变',
    labels: {
      startingAssets: '初始资产',
      annualWithdrawal: '第一年提款',
      years: '期间',
      stockWeight: '股票配置',
      stockReturn: '股票预期回报',
      stockVolatility: '股票年度波动',
      bondReturn: '债券预期回报',
      bondVolatility: '债券年度波动',
      correlation: '股票–债券相关性',
      inflation: '年度通胀',
      fee: '年度费用',
    },
    metrics: {
      success: '撑完整个期间',
      median: '期末资产中位数',
      lower: '期末资产第 10 百分位',
      failure: '失败路径耗尽年份中位数',
      noFailure: '未达到',
    },
    chartTitle: '2,000 条合成路径',
    chartDescription: '阴影扇形包含中间 80% 与 50% 的结果。浅线是抽样路径；实线是当前中位数。',
    legend: {
      paths: '抽样路径',
      middle: '中间 80% / 50%',
      current: '当前中位数',
      baseline: '示例中位数',
      depleted: '耗尽底线',
    },
    yearsLabel: '年',
    conditionalLead: '准确读法：',
    conditionalTail:
      '的 2,000 条合成路径，在页面可见的回报、波动、相关性、通胀、费用、时点与提款假设下撑完整个期间。',
    baselineSame: '与示例相同',
    lower: '更低',
    higher: '更高',
    insightEyebrow: '02 · 阅读纪律',
    insightTitle: '只有当限制也保持可见，这张图才真正有用。',
    insights: [
      {
        index: 'A',
        title: '范围不是预测',
        body: '扇形描述模型允许的结果，不会指出哪一条路径将真实发生。',
      },
      {
        index: 'B',
        title: '更多运行只解决一种误差',
        body: '迭代减少抽样噪音，无法修复遗漏风险、薄弱数据或不现实的分布。',
      },
      {
        index: 'C',
        title: '比较规则，不给命运打分',
        body: '最可靠的用法，是在一致假设下比较决策，并检查哪些路径、何时、为何失败。',
      },
    ],
    disclosure: '仅为教育用途的假设性示意，不提供个性化投资建议，也不预测实际结果。',
  },
}

const copy = computed(() => COPY[props.locale])

const defaults: Settings = {
  startingAssets: 1000000,
  annualWithdrawal: 40000,
  years: 30,
  stockWeight: 60,
  stockReturn: 7,
  stockVolatility: 16,
  bondReturn: 4,
  bondVolatility: 6,
  correlation: 15,
  inflation: 2,
  fee: 0.6,
}

const settings = reactive<Settings>({ ...defaults })
const seed = ref(20260722)

const controls: Array<{
  key: keyof Settings
  min: number
  max: number
  step: number
  group: 'primary' | 'advanced'
  format: 'money' | 'percent' | 'years' | 'correlation'
}> = [
  {
    key: 'startingAssets',
    min: 300000,
    max: 2000000,
    step: 50000,
    group: 'primary',
    format: 'money',
  },
  {
    key: 'annualWithdrawal',
    min: 20000,
    max: 100000,
    step: 2500,
    group: 'primary',
    format: 'money',
  },
  {
    key: 'years',
    min: 10,
    max: 40,
    step: 1,
    group: 'primary',
    format: 'years',
  },
  {
    key: 'stockWeight',
    min: 0,
    max: 100,
    step: 5,
    group: 'primary',
    format: 'percent',
  },
  {
    key: 'stockReturn',
    min: 2,
    max: 12,
    step: 0.5,
    group: 'advanced',
    format: 'percent',
  },
  {
    key: 'stockVolatility',
    min: 4,
    max: 28,
    step: 1,
    group: 'advanced',
    format: 'percent',
  },
  {
    key: 'bondReturn',
    min: 0,
    max: 8,
    step: 0.5,
    group: 'advanced',
    format: 'percent',
  },
  {
    key: 'bondVolatility',
    min: 1,
    max: 14,
    step: 1,
    group: 'advanced',
    format: 'percent',
  },
  {
    key: 'correlation',
    min: -50,
    max: 80,
    step: 5,
    group: 'advanced',
    format: 'correlation',
  },
  {
    key: 'inflation',
    min: 0,
    max: 6,
    step: 0.25,
    group: 'advanced',
    format: 'percent',
  },
  {
    key: 'fee',
    min: 0,
    max: 2,
    step: 0.1,
    group: 'advanced',
    format: 'percent',
  },
]

const primaryControls = controls.filter((control) => control.group === 'primary')
const advancedControls = controls.filter((control) => control.group === 'advanced')

function mulberry32(initialSeed: number) {
  let value = initialSeed >>> 0
  return () => {
    value += 0x6d2b79f5
    let t = value
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function normalPair(random: () => number): [number, number] {
  const u1 = Math.max(random(), Number.EPSILON)
  const u2 = random()
  const radius = Math.sqrt(-2 * Math.log(u1))
  const angle = 2 * Math.PI * u2
  return [radius * Math.cos(angle), radius * Math.sin(angle)]
}

function quantile(sorted: number[], probability: number) {
  if (sorted.length === 0) return 0
  const position = (sorted.length - 1) * probability
  const lower = Math.floor(position)
  const upper = Math.ceil(position)
  const weight = position - lower
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

function runSimulation(input: Settings, simulationSeed: number): SimulationResult {
  const runs = 2000
  const random = mulberry32(simulationSeed)
  const allPaths: number[][] = []
  const failureYears: number[] = []
  const stockWeight = input.stockWeight / 100
  const stockMean = input.stockReturn / 100
  const stockVolatility = input.stockVolatility / 100
  const bondMean = input.bondReturn / 100
  const bondVolatility = input.bondVolatility / 100
  const correlation = input.correlation / 100
  const correlationRoot = Math.sqrt(Math.max(0, 1 - correlation ** 2))
  const inflation = input.inflation / 100
  const fee = input.fee / 100

  for (let run = 0; run < runs; run += 1) {
    let balance = input.startingAssets
    let failed = false
    const path = [balance]

    for (let year = 1; year <= input.years; year += 1) {
      const withdrawal = input.annualWithdrawal * (1 + inflation) ** (year - 1)
      if (balance <= withdrawal) {
        balance = 0
        if (!failed) failureYears.push(year)
        failed = true
        path.push(0)
        continue
      }

      balance -= withdrawal
      const [zStock, zIndependent] = normalPair(random)
      const zBond = correlation * zStock + correlationRoot * zIndependent
      const stockReturn = Math.max(-0.95, Math.min(2, stockMean + stockVolatility * zStock))
      const bondReturn = Math.max(-0.95, Math.min(1, bondMean + bondVolatility * zBond))
      const portfolioReturn = stockWeight * stockReturn + (1 - stockWeight) * bondReturn - fee
      balance = Math.max(0, balance * (1 + Math.max(-0.95, portfolioReturn)))
      path.push(balance)
    }

    allPaths.push(path)
  }

  const seriesAt = (year: number) => allPaths.map((path) => path[year]).sort((a, b) => a - b)
  const p10: number[] = []
  const p25: number[] = []
  const median: number[] = []
  const p75: number[] = []
  const p90: number[] = []

  for (let year = 0; year <= input.years; year += 1) {
    const values = seriesAt(year)
    p10.push(quantile(values, 0.1))
    p25.push(quantile(values, 0.25))
    median.push(quantile(values, 0.5))
    p75.push(quantile(values, 0.75))
    p90.push(quantile(values, 0.9))
  }

  const ending = seriesAt(input.years)
  const sortedFailureYears = [...failureYears].sort((a, b) => a - b)

  return {
    paths: allPaths,
    p10,
    p25,
    median,
    p75,
    p90,
    successRate: (runs - failureYears.length) / runs,
    medianEnd: quantile(ending, 0.5),
    p10End: quantile(ending, 0.1),
    medianFailureYear: sortedFailureYears.length
      ? Math.round(quantile(sortedFailureYears, 0.5))
      : null,
  }
}

function snapshot(value: Settings): Settings {
  return { ...value }
}

const currentResult = computed(() => runSimulation(snapshot(settings), seed.value))
const baselineResult = computed(() => runSimulation({ ...defaults }, seed.value))

const changedKeys = computed(() =>
  (Object.keys(defaults) as Array<keyof Settings>).filter(
    (key) => Math.abs(settings[key] - defaults[key]) > Number.EPSILON,
  ),
)

function isChanged(key: keyof Settings) {
  return changedKeys.value.includes(key)
}

function restoreExample() {
  Object.assign(settings, defaults)
  seed.value = 20260722
}

function drawNewPaths() {
  seed.value = (Math.imul(seed.value, 1664525) + 1013904223) >>> 0
}

const moneyFormatter = computed(
  () =>
    new Intl.NumberFormat(props.locale === 'zh' ? 'zh-CN' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }),
)

const compactFormatter = computed(
  () =>
    new Intl.NumberFormat(props.locale === 'zh' ? 'zh-CN' : 'en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }),
)

const percentFormatter = computed(
  () =>
    new Intl.NumberFormat(props.locale === 'zh' ? 'zh-CN' : 'en-US', {
      style: 'percent',
      maximumFractionDigits: 1,
    }),
)

function formatControl(control: (typeof controls)[number]) {
  const value = settings[control.key]
  if (control.format === 'money') return moneyFormatter.value.format(value)
  if (control.format === 'years') return `${value} ${copy.value.yearsLabel}`
  if (control.format === 'correlation') {
    const correlation = value / 100
    return `${correlation > 0 ? '+' : ''}${correlation.toFixed(2)}`
  }
  return `${value}%`
}

function formatMetricMoney(value: number) {
  return moneyFormatter.value.format(Math.round(value / 1000) * 1000)
}

function deltaLabel(current: number, baseline: number, kind: 'percent' | 'money' | 'year') {
  const delta = current - baseline
  if (Math.abs(delta) < (kind === 'money' ? 500 : 0.0005)) return copy.value.baselineSame
  const direction = delta > 0 ? copy.value.higher : copy.value.lower
  if (kind === 'percent') return `${direction} ${Math.abs(delta * 100).toFixed(1)} pp`
  if (kind === 'money') return `${direction} ${compactFormatter.value.format(Math.abs(delta))}`
  return `${direction} ${Math.abs(delta).toFixed(0)} ${copy.value.yearsLabel}`
}

const chartWidth = 1000
const chartHeight = 470
const plot = { left: 54, right: 974, top: 28, bottom: 420 }
const chartYears = computed(() => Math.max(settings.years, defaults.years))

const chartMax = computed(() => {
  const peak = Math.max(
    ...currentResult.value.p90,
    ...baselineResult.value.p90,
    settings.startingAssets,
    defaults.startingAssets,
  )
  return Math.max(1500000, Math.ceil((peak * 1.08) / 500000) * 500000)
})

function point(year: number, value: number, totalYears: number) {
  const x = plot.left + (year / totalYears) * (plot.right - plot.left)
  const clipped = Math.min(chartMax.value, Math.max(0, value))
  const y = plot.bottom - (clipped / chartMax.value) * (plot.bottom - plot.top)
  return `${x.toFixed(1)},${y.toFixed(1)}`
}

function linePoints(values: number[], totalYears = chartYears.value) {
  return values.map((value, year) => point(year, value, totalYears)).join(' ')
}

function bandPoints(upper: number[], lower: number[], totalYears = chartYears.value) {
  const top = upper.map((value, year) => point(year, value, totalYears))
  const bottom = lower.map((value, year) => point(year, value, totalYears)).reverse()
  return [...top, ...bottom].join(' ')
}

const samplePaths = computed(() => {
  const step = Math.max(1, Math.floor(currentResult.value.paths.length / 30))
  return currentResult.value.paths
    .filter((_, index) => index % step === 0)
    .slice(0, 30)
    .map((path) => linePoints(path))
})

const currentOuterBand = computed(() =>
  bandPoints(currentResult.value.p90, currentResult.value.p10),
)
const currentInnerBand = computed(() =>
  bandPoints(currentResult.value.p75, currentResult.value.p25),
)
const currentMedian = computed(() => linePoints(currentResult.value.median))
const baselineMedian = computed(() => linePoints(baselineResult.value.median))

const yTicks = computed(() =>
  [0, 0.5, 1].map((ratio) => ({
    y: plot.bottom - ratio * (plot.bottom - plot.top),
    label: compactFormatter.value.format(chartMax.value * ratio),
  })),
)

const reading = computed(
  () =>
    `${copy.value.conditionalLead} ${percentFormatter.value.format(currentResult.value.successRate)} ${copy.value.conditionalTail}`,
)
</script>

<template>
  <section class="monte-lab" aria-labelledby="monte-lab-title">
    <header class="lab-header">
      <div>
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h2 id="monte-lab-title">{{ copy.title }}</h2>
        <p class="intro">{{ copy.description }}</p>
      </div>
      <div class="header-actions">
        <span class="seed">{{ copy.fixedSeed }} · {{ seed }}</span>
        <button type="button" class="button button-quiet" @click="restoreExample">
          {{ copy.reset }}
        </button>
        <button type="button" class="button button-solid" @click="drawNewPaths">
          {{ copy.newPaths }} ↻
        </button>
      </div>
    </header>

    <div class="control-section" aria-labelledby="primary-controls-title">
      <div class="section-heading">
        <h3 id="primary-controls-title">{{ copy.primary }}</h3>
        <span v-if="changedKeys.length" class="change-count"
          >{{ changedKeys.length }} {{ copy.changed }}</span
        >
      </div>
      <div class="control-grid primary-grid">
        <label
          v-for="control in primaryControls"
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
          <span v-if="isChanged(control.key)" class="changed-dot">{{ copy.changed }}</span>
        </label>
      </div>
    </div>

    <details class="assumptions" open>
      <summary>
        <span>{{ copy.assumptions }}</span>
        <span aria-hidden="true" class="summary-icon">+</span>
      </summary>
      <p class="assumptions-note">{{ copy.assumptionsNote }}</p>
      <div class="control-grid advanced-grid">
        <label
          v-for="control in advancedControls"
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
          <span v-if="isChanged(control.key)" class="changed-dot">{{ copy.changed }}</span>
        </label>
      </div>
    </details>

    <div class="metric-grid" aria-live="polite">
      <article class="metric metric-signal">
        <span>{{ copy.metrics.success }}</span>
        <strong>{{ percentFormatter.format(currentResult.successRate) }}</strong>
        <small>{{
          deltaLabel(currentResult.successRate, baselineResult.successRate, 'percent')
        }}</small>
      </article>
      <article class="metric">
        <span>{{ copy.metrics.median }}</span>
        <strong>{{ formatMetricMoney(currentResult.medianEnd) }}</strong>
        <small>{{ deltaLabel(currentResult.medianEnd, baselineResult.medianEnd, 'money') }}</small>
      </article>
      <article class="metric">
        <span>{{ copy.metrics.lower }}</span>
        <strong>{{ formatMetricMoney(currentResult.p10End) }}</strong>
        <small>{{ deltaLabel(currentResult.p10End, baselineResult.p10End, 'money') }}</small>
      </article>
      <article class="metric">
        <span>{{ copy.metrics.failure }}</span>
        <strong>
          {{
            currentResult.medianFailureYear === null
              ? copy.metrics.noFailure
              : `${currentResult.medianFailureYear} ${copy.yearsLabel}`
          }}
        </strong>
        <small
          v-if="
            currentResult.medianFailureYear !== null && baselineResult.medianFailureYear !== null
          "
        >
          {{
            deltaLabel(currentResult.medianFailureYear, baselineResult.medianFailureYear, 'year')
          }}
        </small>
        <small v-else>{{ copy.baselineSame }}</small>
      </article>
    </div>

    <figure class="chart-card">
      <figcaption>
        <div>
          <h3>{{ copy.chartTitle }}</h3>
          <p>{{ copy.chartDescription }}</p>
        </div>
        <div class="legend" aria-label="Chart legend">
          <span><i class="legend-path"></i>{{ copy.legend.paths }}</span>
          <span><i class="legend-band"></i>{{ copy.legend.middle }}</span>
          <span><i class="legend-current"></i>{{ copy.legend.current }}</span>
          <span><i class="legend-baseline"></i>{{ copy.legend.baseline }}</span>
        </div>
      </figcaption>

      <div class="chart-scroll">
        <svg
          :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
          role="img"
          :aria-label="copy.chartDescription"
          preserveAspectRatio="xMidYMid meet"
        >
          <g class="chart-grid">
            <g v-for="tick in yTicks" :key="tick.y">
              <line :x1="plot.left" :x2="plot.right" :y1="tick.y" :y2="tick.y" />
              <text :x="plot.left - 10" :y="tick.y + 4" text-anchor="end">
                {{ tick.label }}
              </text>
            </g>
            <line
              v-for="year in [0, Math.round(chartYears / 2), chartYears]"
              :key="`x-${year}`"
              :x1="plot.left + (year / chartYears) * (plot.right - plot.left)"
              :x2="plot.left + (year / chartYears) * (plot.right - plot.left)"
              :y1="plot.top"
              :y2="plot.bottom"
            />
            <text :x="plot.left" :y="chartHeight - 18" text-anchor="start">0</text>
            <text :x="(plot.left + plot.right) / 2" :y="chartHeight - 18" text-anchor="middle">
              {{ Math.round(chartYears / 2) }}
            </text>
            <text :x="plot.right" :y="chartHeight - 18" text-anchor="end">
              {{ chartYears }} {{ copy.yearsLabel }}
            </text>
          </g>

          <polygon class="outer-band" :points="currentOuterBand" />
          <polygon class="inner-band" :points="currentInnerBand" />

          <polyline
            v-for="(path, index) in samplePaths"
            :key="index"
            class="sample-path"
            :points="path"
          />

          <line
            :x1="plot.left"
            :x2="plot.right"
            :y1="plot.bottom"
            :y2="plot.bottom"
            class="depletion-line"
          />
          <polyline class="baseline-line" :points="baselineMedian" />
          <polyline class="median-line" :points="currentMedian" />
        </svg>
      </div>

      <p class="reading" aria-live="polite">{{ reading }}</p>
    </figure>

    <section class="insight-section" aria-labelledby="simulation-reading-title">
      <p class="eyebrow">{{ copy.insightEyebrow }}</p>
      <h3 id="simulation-reading-title">{{ copy.insightTitle }}</h3>
      <div class="insight-grid">
        <article v-for="insight in copy.insights" :key="insight.index">
          <span>{{ insight.index }}</span>
          <h4>{{ insight.title }}</h4>
          <p>{{ insight.body }}</p>
        </article>
      </div>
      <p class="disclosure">{{ copy.disclosure }}</p>
    </section>
  </section>
</template>

<style scoped>
.monte-lab {
  --orange: #ff5c35;
  --orange-soft: color-mix(in srgb, var(--orange) 14%, var(--card));
  --violet: #7667f6;
  --lime: #d8ff68;
  margin: 2.5rem 0 0;
  color: var(--foreground);
}

.lab-header {
  display: grid;
  gap: 1.75rem;
  padding: clamp(1.5rem, 4vw, 2.75rem);
  border: 1px solid var(--line-card);
  border-radius: 1.5rem 1.5rem 0 0;
  background:
    radial-gradient(
      circle at 90% 10%,
      color-mix(in srgb, var(--violet) 14%, transparent),
      transparent 35%
    ),
    var(--card);
}

@media (min-width: 900px) {
  .lab-header {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
  }
}

.eyebrow,
.seed,
.change-count,
.changed-dot {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.eyebrow {
  margin: 0;
  color: var(--orange);
  font-size: 0.68rem;
  font-weight: 800;
}

.lab-header h2,
.insight-section > h3 {
  margin: 0.75rem 0 0;
  color: var(--foreground);
  font-size: clamp(2rem, 5vw, 4.3rem);
  font-weight: 690;
  line-height: 0.98;
  letter-spacing: -0.055em;
}

.intro {
  max-width: 47rem;
  margin: 1rem 0 0;
  color: var(--muted-foreground);
  font-size: 1rem;
  line-height: 1.75;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
}

.seed {
  color: var(--muted-foreground);
  font-size: 0.66rem;
}

.button {
  min-height: 2.75rem;
  padding: 0 1rem;
  border: 1px solid var(--line-control);
  border-radius: 999px;
  color: var(--foreground);
  background: transparent;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.button:hover,
.button:focus-visible {
  border-color: var(--orange);
  outline: none;
}

.button-solid {
  border-color: var(--foreground);
  color: var(--card);
  background: var(--foreground);
}

.control-section,
.assumptions {
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid var(--line-card);
  border-top: 0;
  background: color-mix(in srgb, var(--card) 72%, transparent);
}

.section-heading,
.control-top,
.assumptions summary,
.chart-card figcaption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.section-heading h3,
.assumptions summary,
.chart-card h3 {
  margin: 0;
  color: var(--foreground);
  font-size: 1rem;
  font-weight: 760;
}

.change-count,
.changed-dot {
  color: var(--orange);
  font-size: 0.58rem;
  font-weight: 800;
}

.control-grid {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
}

@media (min-width: 620px) {
  .primary-grid,
  .advanced-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1000px) {
  .primary-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .advanced-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.control-card {
  position: relative;
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--line-card);
  border-radius: 1rem;
  background: var(--card);
  transition:
    border-color 160ms ease,
    background 160ms ease;
}

.control-card.is-changed {
  border-color: color-mix(in srgb, var(--orange) 72%, var(--line-card));
  background: var(--orange-soft);
}

.control-top {
  align-items: baseline;
  min-height: 2.5rem;
  color: var(--muted-foreground);
  font-size: 0.76rem;
  line-height: 1.35;
}

.control-top output {
  flex: 0 0 auto;
  color: var(--foreground);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
  font-weight: 800;
}

.control-card input[type='range'] {
  width: 100%;
  margin-top: 0.8rem;
  accent-color: var(--orange);
  cursor: pointer;
}

.changed-dot {
  display: block;
  margin-top: 0.45rem;
}

.assumptions summary {
  list-style: none;
  cursor: pointer;
}

.assumptions summary::-webkit-details-marker {
  display: none;
}

.summary-icon {
  font-size: 1.4rem;
  transition: transform 180ms ease;
}

.assumptions[open] .summary-icon {
  transform: rotate(45deg);
}

.assumptions-note {
  margin: 0.55rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.78rem;
  line-height: 1.55;
}

.metric-grid {
  display: grid;
  gap: 1px;
  border: 1px solid var(--line-card);
  border-top: 0;
  background: var(--line-card);
}

@media (min-width: 700px) {
  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1000px) {
  .metric-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.metric {
  min-width: 0;
  padding: 1.25rem;
  background: var(--card);
}

.metric-signal {
  color: #171713;
  background: var(--lime);
}

.metric span,
.metric small {
  display: block;
  color: var(--muted-foreground);
  font-size: 0.7rem;
  line-height: 1.35;
}

.metric-signal span,
.metric-signal small {
  color: rgba(23, 23, 19, 0.7);
}

.metric strong {
  display: block;
  overflow: hidden;
  margin-top: 0.45rem;
  color: inherit;
  font-size: clamp(1.25rem, 2.5vw, 2rem);
  line-height: 1.05;
  text-overflow: ellipsis;
}

.metric small {
  margin-top: 0.55rem;
}

.chart-card {
  margin: 0;
  padding: clamp(1rem, 3vw, 2rem);
  border: 1px solid var(--line-card);
  border-top: 0;
  border-radius: 0 0 1.5rem 1.5rem;
  background: var(--card);
}

.chart-card figcaption {
  align-items: flex-start;
  flex-direction: column;
}

.chart-card figcaption p {
  max-width: 42rem;
  margin: 0.4rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.76rem;
  line-height: 1.5;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  color: var(--muted-foreground);
  font-size: 0.65rem;
}

.legend span {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.legend i {
  display: inline-block;
  width: 1.25rem;
  height: 0.35rem;
  border-radius: 999px;
}

.legend-path {
  background: color-mix(in srgb, var(--orange) 28%, transparent);
}
.legend-band {
  background: color-mix(in srgb, var(--orange) 28%, var(--card));
}
.legend-current {
  height: 0.12rem !important;
  background: var(--orange);
}
.legend-baseline {
  height: 0 !important;
  border-top: 2px dashed var(--violet);
}

.chart-scroll {
  overflow-x: auto;
  margin-top: 1.25rem;
  border: 1px solid var(--line-subtle);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--card) 82%, var(--foreground) 2%);
}

.chart-scroll svg {
  display: block;
  width: 100%;
  min-width: 42rem;
  height: auto;
}

.chart-grid line {
  stroke: var(--line-subtle);
  stroke-width: 1;
}

.chart-grid text {
  fill: var(--muted-foreground);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
}

.outer-band {
  fill: color-mix(in srgb, var(--orange) 10%, transparent);
}
.inner-band {
  fill: color-mix(in srgb, var(--orange) 18%, transparent);
}
.sample-path {
  fill: none;
  stroke: color-mix(in srgb, var(--orange) 30%, transparent);
  stroke-width: 1.15;
}
.median-line,
.baseline-line {
  fill: none;
  vector-effect: non-scaling-stroke;
}
.median-line {
  stroke: var(--orange);
  stroke-width: 3.5;
}
.baseline-line {
  stroke: var(--violet);
  stroke-width: 2.2;
  stroke-dasharray: 9 8;
}
.depletion-line {
  stroke: #e23d48;
  stroke-width: 2;
  stroke-dasharray: 3 6;
}

.reading {
  margin: 1rem 0 0;
  padding: 1rem 1.1rem;
  border-left: 4px solid var(--orange);
  color: var(--foreground);
  background: var(--orange-soft);
  font-size: 0.82rem;
  line-height: 1.65;
}

.insight-section {
  margin-top: 1.25rem;
  padding: clamp(1.5rem, 4vw, 2.75rem);
  border: 1px solid var(--line-card);
  border-radius: 1.5rem;
  background: var(--card);
}

.insight-section > h3 {
  max-width: 48rem;
  font-size: clamp(1.8rem, 4vw, 3.4rem);
}

.insight-grid {
  display: grid;
  gap: 1px;
  overflow: hidden;
  margin-top: 1.75rem;
  border: 1px solid var(--line-card);
  border-radius: 1rem;
  background: var(--line-card);
}

@media (min-width: 850px) {
  .insight-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.insight-grid article {
  padding: 1.25rem;
  background: color-mix(in srgb, var(--card) 88%, var(--foreground) 2%);
}

.insight-grid article > span {
  color: var(--orange);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.72rem;
  font-weight: 800;
}

.insight-grid h4 {
  margin: 1.5rem 0 0;
  color: var(--foreground);
  font-size: 1.05rem;
}

.insight-grid p,
.disclosure {
  color: var(--muted-foreground);
  font-size: 0.78rem;
  line-height: 1.65;
}

.insight-grid p {
  margin: 0.55rem 0 0;
}
.disclosure {
  margin: 1.25rem 0 0;
  padding-top: 1rem;
  border-top: 1px solid var(--line-subtle);
}

@media (prefers-reduced-motion: reduce) {
  .control-card,
  .summary-icon {
    transition: none;
  }
}
</style>
