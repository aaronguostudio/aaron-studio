<script setup lang="ts">
import { computed, ref } from 'vue'

type Locale = 'en' | 'zh'
type Mode = 'progressive' | 'all'
type ScenarioKey = 'export' | 'agent' | 'payment'
type Placement = 'first' | 'later' | 'neverHide'

interface Setting {
  label: string
  value: string
  layer: 1 | 2 | 3
  note: string
}

interface ScenarioItem {
  name: string
  placement: Placement
  reason: string
}

interface Copy {
  eyebrow: string
  title: string
  description: string
  modes: Record<Mode, { label: string; note: string }>
  previewLabel: string
  windowTitle: string
  settings: Setting[]
  export: string
  advanced: string
  expert: string
  collapse: string
  visibleDecisions: string
  layersOpen: string
  commonTask: string
  commonOutcome: Record<Mode, string>
  liveSummary: (count: number, level: number, mode: Mode) => string
  rubricEyebrow: string
  rubricTitle: string
  rubricDescription: string
  rubric: Array<{
    key: string
    title: string
    question: string
    disposition: string
  }>
  scenarioEyebrow: string
  scenarioTitle: string
  scenarioDescription: string
  scenarios: Record<
    ScenarioKey,
    { tab: string; context: string; items: ScenarioItem[]; verdict: string }
  >
  placement: Record<Placement, string>
  failuresEyebrow: string
  failuresTitle: string
  failures: Array<{ name: string; signal: string; fix: string }>
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
    eyebrow: '01 · Complexity timing lab',
    title: 'The same capability can feel light or heavy.',
    description:
      'Compare one export task when every control arrives at once versus when options appear only as the user expresses deeper intent.',
    modes: {
      progressive: {
        label: 'Progressive disclosure',
        note: 'Start complete; reveal depth on demand.',
      },
      all: {
        label: 'Everything at once',
        note: 'Every possible decision competes immediately.',
      },
    },
    previewLabel: 'EXPORT REPORT',
    windowTitle: 'Quarterly review',
    settings: [
      {
        label: 'File name',
        value: 'quarterly-review',
        layer: 1,
        note: 'Required to identify the result.',
      },
      {
        label: 'Format',
        value: 'PDF (Portable Document Format)',
        layer: 1,
        note: 'A visible default makes the outcome predictable.',
      },
      {
        label: 'Save to',
        value: 'Downloads',
        layer: 1,
        note: 'The destination belongs in the common task.',
      },
      {
        label: 'Page range',
        value: 'All pages',
        layer: 2,
        note: 'Useful sometimes, but not required for a normal export.',
      },
      {
        label: 'Image quality',
        value: 'High · 144 dpi',
        layer: 2,
        note: 'A readable adjustment after the primary intent is clear.',
      },
      {
        label: 'Metadata',
        value: 'Include title and author',
        layer: 2,
        note: 'Secondary control with a safe default.',
      },
      {
        label: 'Color profile',
        value: 'Display P3',
        layer: 3,
        note: 'Domain-specific control for production workflows.',
      },
      {
        label: 'Font embedding',
        value: 'Subset fonts',
        layer: 3,
        note: 'Important to specialists, noise to most exports.',
      },
      {
        label: 'Compression',
        value: 'Adaptive · medium',
        layer: 3,
        note: 'Implementation detail with a sensible default.',
      },
    ],
    export: 'Export',
    advanced: 'Show export options',
    expert: 'Show production controls',
    collapse: 'Return to essentials',
    visibleDecisions: 'Visible decisions',
    layersOpen: 'Layers open',
    commonTask: 'Common-task signal',
    commonOutcome: {
      progressive: 'Three decisions are enough to export. Depth remains one clear action away.',
      all: 'Nine decisions compete before the common task can feel complete.',
    },
    liveSummary: (count, level, mode) =>
      `${mode === 'progressive' ? 'Progressive' : 'All-at-once'} mode. ${count} decisions visible across ${level} layer${level === 1 ? '' : 's'}.`,
    rubricEyebrow: '02 · Layering rubric',
    rubricTitle: 'Frequency is only one signal.',
    rubricDescription:
      'Place an element by combining task necessity, usage frequency, dependency, and consequence. A rare risk can still belong in plain sight.',
    rubric: [
      {
        key: '01',
        title: 'Necessity',
        question: 'Can the current task succeed without it?',
        disposition: 'Required information tends to stay in layer one.',
      },
      {
        key: '02',
        title: 'Frequency',
        question: 'How often does this decision actually occur?',
        disposition: 'Frequent controls earn visibility; rare ones can wait.',
      },
      {
        key: '03',
        title: 'Dependency',
        question: 'Does it matter only after another choice?',
        disposition: 'Reveal dependent controls when their condition becomes true.',
      },
      {
        key: '04',
        title: 'Consequence',
        question: 'Could hiding it change cost, permission, or reversibility?',
        disposition: 'High-consequence facts must not disappear into “Advanced.”',
      },
    ],
    scenarioEyebrow: '03 · Placement judgment',
    scenarioTitle: 'What should be visible first?',
    scenarioDescription:
      'Switch contexts. The same frequency rule produces bad designs unless consequence and task meaning are considered too.',
    scenarios: {
      export: {
        tab: 'Export a report',
        context: 'A reversible, familiar task with safe defaults.',
        items: [
          {
            name: 'File name and format',
            placement: 'first',
            reason: 'They define the common result.',
          },
          {
            name: 'Color profile',
            placement: 'later',
            reason: 'It matters to a specialized production intent.',
          },
          {
            name: 'Overwrite warning',
            placement: 'neverHide',
            reason: 'A destructive consequence must appear at the decision point.',
          },
        ],
        verdict: 'Safe defaults make this task a strong fit for progressive disclosure.',
      },
      agent: {
        tab: 'Run an Artificial Intelligence agent',
        context: 'A flexible task whose tools may cross system boundaries.',
        items: [
          {
            name: 'Goal and input scope',
            placement: 'first',
            reason: 'They define what the run is meant to do and know.',
          },
          {
            name: 'Sampling controls',
            placement: 'later',
            reason: 'Most runs can use a tested default.',
          },
          {
            name: 'External write permission',
            placement: 'neverHide',
            reason: 'Low frequency does not reduce its consequence.',
          },
        ],
        verdict:
          'Reveal tuning gradually, but surface authority and irreversible actions before execution.',
      },
      payment: {
        tab: 'Confirm a payment',
        context: 'A high-consequence task where informed consent matters more than visual calm.',
        items: [
          {
            name: 'Recipient and amount',
            placement: 'first',
            reason: 'They are the essence of the transaction.',
          },
          {
            name: 'Optional note',
            placement: 'later',
            reason: 'It enriches the transfer but does not define it.',
          },
          {
            name: 'Fee and final total',
            placement: 'neverHide',
            reason: 'Cost cannot be traded away for a cleaner screen.',
          },
        ],
        verdict:
          'Progressive disclosure may organize extras, never the facts required for informed consent.',
      },
    },
    placement: {
      first: 'Keep visible',
      later: 'Reveal later',
      neverHide: 'Never hide',
    },
    failuresEyebrow: '04 · Failure signals',
    failuresTitle: 'When the layers stop helping',
    failures: [
      {
        name: 'Click tunnel',
        signal: 'People open More → Advanced → Customize every time.',
        fix: 'Promote the repeated path or remember expert state.',
      },
      {
        name: 'Mystery trigger',
        signal: 'The feature exists, but people never discover the icon.',
        fix: 'Use a descriptive label and preview what will appear.',
      },
      {
        name: 'Hidden consequence',
        signal: 'A fee, permission, or destructive effect lives in a collapsed panel.',
        fix: 'Move consequence to the decision point, even if it is rare.',
      },
      {
        name: 'Invisible default',
        signal: 'The visible choice depends on a hidden value people cannot predict.',
        fix: 'Expose the current default as a summary or first-layer state.',
      },
    ],
    neighborsEyebrow: '05 · Concept neighborhood',
    neighborsTitle: 'Strategy, mechanism, structure, and access are different jobs.',
    neighborsDescription:
      'The relationship label prevents every collapsed interface from being mistaken for progressive disclosure.',
    neighbors: [
      {
        name: 'Disclosure widget',
        fullName: 'Disclosure Widget',
        type: 'implementation mechanism',
        description: 'How does one control show and hide one region?',
      },
      {
        name: 'Contextual disclosure',
        fullName: 'Contextual Disclosure',
        type: 'triggered variant',
        description: 'What becomes relevant after a state or choice changes?',
      },
      {
        name: 'Staged disclosure',
        fullName: 'Staged Disclosure',
        type: 'flow variant',
        description: 'How is information sequenced across steps or pages?',
      },
      {
        name: 'Information architecture',
        fullName: 'Information Architecture',
        type: 'structural foundation',
        description: 'How is the information classified, named, and connected?',
      },
      {
        name: 'Defaults',
        fullName: 'Defaults',
        type: 'decision shortcut',
        description: 'Which answer can safely work before more choices appear?',
      },
      {
        name: 'Feature gating',
        fullName: 'Feature Gating',
        type: 'access policy',
        description: 'Is the capability available at all, rather than merely hidden?',
      },
    ],
  },
  zh: {
    eyebrow: '01 · 复杂度时机实验室',
    title: '同一组能力，可以显得轻，也可以显得重。',
    description:
      '对比同一个导出任务：所有控件一次出现，和选项随着用户表达更深意图逐层出现，会带来怎样不同的开始成本。',
    modes: {
      progressive: {
        label: '渐进披露',
        note: '第一层完整可用，深度按需出现。',
      },
      all: {
        label: '全部一次显示',
        note: '所有可能的决策立刻争夺注意力。',
      },
    },
    previewLabel: '导出报告',
    windowTitle: '季度复盘',
    settings: [
      {
        label: '文件名',
        value: 'quarterly-review',
        layer: 1,
        note: '识别结果所必需。',
      },
      {
        label: '格式',
        value: 'PDF（Portable Document Format，便携式文档格式）',
        layer: 1,
        note: '看得见的默认值让结果可以预测。',
      },
      {
        label: '保存到',
        value: 'Downloads',
        layer: 1,
        note: '目标位置属于常见任务。',
      },
      {
        label: '页面范围',
        value: '全部页面',
        layer: 2,
        note: '有时有用，但普通导出并不需要先决定。',
      },
      {
        label: '图像质量',
        value: '高 · 144 dpi',
        layer: 2,
        note: '主意图明确以后容易理解的调整。',
      },
      {
        label: '元数据',
        value: '包含标题与作者',
        layer: 2,
        note: '拥有安全默认值的次要控制。',
      },
      {
        label: '颜色配置',
        value: 'Display P3',
        layer: 3,
        note: '面向专业生产流程的领域控制。',
      },
      {
        label: '字体嵌入',
        value: '嵌入所用字符',
        layer: 3,
        note: '专家需要，多数导出任务不需要先看。',
      },
      {
        label: '压缩方式',
        value: '自适应 · 中等',
        layer: 3,
        note: '可以由合理默认值承担的实现细节。',
      },
    ],
    export: '导出',
    advanced: '显示导出选项',
    expert: '显示专业生产控制',
    collapse: '返回必要设置',
    visibleDecisions: '可见决策',
    layersOpen: '已开层级',
    commonTask: '常见任务信号',
    commonOutcome: {
      progressive: '三个决定已经足够完成导出；更深能力仍然只差一次明确操作。',
      all: '九个决定同时竞争，常见任务在开始前就显得复杂。',
    },
    liveSummary: (count, level, mode) =>
      `${mode === 'progressive' ? '渐进披露' : '全部显示'}模式：当前显示 ${count} 个决定，共 ${level} 层。`,
    rubricEyebrow: '02 · 分层量表',
    rubricTitle: '频率只是其中一个信号。',
    rubricDescription:
      '把任务必要性、使用频率、选项依赖与行为后果放在一起判断。一个很少出现的风险，仍然可能必须始终可见。',
    rubric: [
      {
        key: '01',
        title: '必要性',
        question: '没有它，当前任务还能完成吗？',
        disposition: '任务必需的信息通常留在第一层。',
      },
      {
        key: '02',
        title: '频率',
        question: '这个决定实际出现得有多频繁？',
        disposition: '高频控制获得可见性，低频控制可以等待。',
      },
      {
        key: '03',
        title: '依赖',
        question: '它是否只有在另一个选择后才有意义？',
        disposition: '当条件成立时，再显露依赖控制。',
      },
      {
        key: '04',
        title: '后果',
        question: '隐藏它会不会改变费用、权限或可恢复性？',
        disposition: '高后果事实不能消失在“高级设置”里。',
      },
    ],
    scenarioEyebrow: '03 · 放置判断',
    scenarioTitle: '什么应该首先可见？',
    scenarioDescription: '切换情境。只按使用频率分层会产生坏设计，因为后果和任务含义同样重要。',
    scenarios: {
      export: {
        tab: '导出报告',
        context: '拥有安全默认值、熟悉并且可恢复的任务。',
        items: [
          {
            name: '文件名与格式',
            placement: 'first',
            reason: '它们定义了常见结果。',
          },
          {
            name: '颜色配置',
            placement: 'later',
            reason: '它只在专业生产意图中变得重要。',
          },
          {
            name: '覆盖文件警告',
            placement: 'neverHide',
            reason: '破坏性后果必须出现在决定发生的位置。',
          },
        ],
        verdict: '安全默认值让导出任务非常适合渐进披露。',
      },
      agent: {
        tab: '运行人工智能 Agent',
        context: '灵活的任务，但工具可能跨越系统边界。',
        items: [
          {
            name: '目标与输入范围',
            placement: 'first',
            reason: '它们定义本次运行要做什么、可以知道什么。',
          },
          {
            name: '采样控制',
            placement: 'later',
            reason: '大多数运行可以使用经过测试的默认值。',
          },
          {
            name: '外部写入权限',
            placement: 'neverHide',
            reason: '低频不会降低它的行为后果。',
          },
        ],
        verdict: '调优可以逐层出现，但权限和不可逆动作必须在执行前显露。',
      },
      payment: {
        tab: '确认付款',
        context: '高后果任务，知情决定比视觉安静更重要。',
        items: [
          {
            name: '收款人和金额',
            placement: 'first',
            reason: '它们就是交易本身。',
          },
          {
            name: '可选备注',
            placement: 'later',
            reason: '它丰富转账，但不定义转账。',
          },
          {
            name: '手续费与最终总额',
            placement: 'neverHide',
            reason: '费用不能为了干净界面而消失。',
          },
        ],
        verdict: '渐进披露可以整理附加项，不能隐藏知情同意所必需的事实。',
      },
    },
    placement: {
      first: '保持可见',
      later: '稍后显露',
      neverHide: '绝不隐藏',
    },
    failuresEyebrow: '04 · 失败信号',
    failuresTitle: '层级什么时候不再帮忙？',
    failures: [
      {
        name: '点击隧道',
        signal: '用户每次都打开 More → Advanced → Customize。',
        fix: '提升这条高频路径，或记住专家的展开状态。',
      },
      {
        name: '神秘入口',
        signal: '功能存在，但用户从未发现那个图标。',
        fix: '使用描述性标签，并预告将出现什么。',
      },
      {
        name: '隐藏后果',
        signal: '费用、权限或破坏性效果住在折叠面板里。',
        fix: '即使低频，也要把后果放回决定发生的位置。',
      },
      {
        name: '隐形默认值',
        signal: '可见选择依赖一个用户无法预测的隐藏值。',
        fix: '用摘要或第一层状态暴露当前默认值。',
      },
    ],
    neighborsEyebrow: '05 · 概念邻居',
    neighborsTitle: '策略、机制、结构与访问，分别做不同的工作。',
    neighborsDescription: '记住关系类型，才能避免把每一个折叠界面都误认为渐进披露。',
    neighbors: [
      {
        name: '披露控件',
        fullName: 'Disclosure Widget · 披露控件',
        type: '实现机制',
        description: '一个控件怎样显示或隐藏一块区域？',
      },
      {
        name: '情境披露',
        fullName: 'Contextual Disclosure · 情境披露',
        type: '触发变体',
        description: '状态或选择改变后，什么内容才变得相关？',
      },
      {
        name: '分阶段披露',
        fullName: 'Staged Disclosure · 分阶段披露',
        type: '流程变体',
        description: '信息怎样分布在多个步骤或页面中？',
      },
      {
        name: '信息架构',
        fullName: 'Information Architecture · 信息架构',
        type: '结构基础',
        description: '信息怎样分类、命名和连接？',
      },
      {
        name: '默认值',
        fullName: 'Defaults · 默认值',
        type: '决策捷径',
        description: '更多选项出现前，哪个答案可以安全工作？',
      },
      {
        name: '功能门控',
        fullName: 'Feature Gating · 功能门控',
        type: '访问策略',
        description: '功能究竟不可用，还是仅仅暂时没显示？',
      },
    ],
  },
}

const mode = ref<Mode>('progressive')
const level = ref<1 | 2 | 3>(1)
const activeScenario = ref<ScenarioKey>('export')

const copy = computed(() => COPY[props.locale])
const visibleSettings = computed(() =>
  mode.value === 'all'
    ? copy.value.settings
    : copy.value.settings.filter((setting) => setting.layer <= level.value),
)
const openLayers = computed(() => (mode.value === 'all' ? 3 : level.value))
const liveSummary = computed(() =>
  copy.value.liveSummary(visibleSettings.value.length, openLayers.value, mode.value),
)

function setMode(next: Mode) {
  mode.value = next
  level.value = next === 'all' ? 3 : 1
}

function revealNext() {
  if (level.value < 3) level.value = (level.value + 1) as 2 | 3
}

function collapseLayers() {
  mode.value = 'progressive'
  level.value = 1
}
</script>

<template>
  <div class="disclosure-visual">
    <section class="concept-section" aria-labelledby="disclosure-lab-title">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h2 id="disclosure-lab-title">{{ copy.title }}</h2>
        <p>{{ copy.description }}</p>
      </div>

      <div class="lab-shell">
        <div class="mode-switch" role="group" :aria-label="copy.title">
          <button
            v-for="modeName in ['progressive', 'all'] as Mode[]"
            :key="modeName"
            type="button"
            :aria-pressed="mode === modeName"
            :class="{ active: mode === modeName }"
            @click="setMode(modeName)"
          >
            <span>{{ copy.modes[modeName].label }}</span>
            <small>{{ copy.modes[modeName].note }}</small>
          </button>
        </div>

        <div class="lab-grid">
          <article class="export-window" aria-label="Export settings demonstration">
            <header class="window-header">
              <div>
                <small>{{ copy.previewLabel }}</small>
                <strong>{{ copy.windowTitle }}</strong>
              </div>
              <span aria-hidden="true">•••</span>
            </header>

            <div class="setting-list">
              <div
                v-for="setting in visibleSettings"
                :key="setting.label"
                class="setting-row"
                :class="'layer-' + setting.layer"
              >
                <span class="layer-mark" :aria-label="`Layer ${setting.layer}`">{{
                  setting.layer
                }}</span>
                <div>
                  <small>{{ setting.label }}</small>
                  <strong>{{ setting.value }}</strong>
                  <p>{{ setting.note }}</p>
                </div>
              </div>
            </div>

            <footer class="window-actions">
              <div class="disclosure-actions">
                <button
                  v-if="mode === 'progressive' && level < 3"
                  type="button"
                  class="reveal-action"
                  :aria-expanded="level > 1"
                  @click="revealNext"
                >
                  <span aria-hidden="true">＋</span>
                  {{ level === 1 ? copy.advanced : copy.expert }}
                </button>
                <button
                  v-else-if="level > 1"
                  type="button"
                  class="reveal-action"
                  aria-expanded="true"
                  @click="collapseLayers"
                >
                  <span aria-hidden="true">−</span>
                  {{ copy.collapse }}
                </button>
              </div>
              <button type="button" class="primary-action">{{ copy.export }} <span>→</span></button>
            </footer>
          </article>

          <aside class="signal-card">
            <div class="signal-orbit" aria-hidden="true">
              <span
                v-for="n in 9"
                :key="n"
                :class="{ visible: n <= visibleSettings.length }"
              ></span>
            </div>
            <div class="metric">
              <span>{{ copy.visibleDecisions }}</span>
              <strong>{{ visibleSettings.length }}</strong>
            </div>
            <div class="metric">
              <span>{{ copy.layersOpen }}</span>
              <strong>{{ openLayers }} / 3</strong>
            </div>
            <div class="signal-copy">
              <small>{{ copy.commonTask }}</small>
              <p>{{ copy.commonOutcome[mode] }}</p>
            </div>
          </aside>
        </div>

        <p class="live-region" aria-live="polite">{{ liveSummary }}</p>
      </div>
    </section>

    <section class="concept-section" aria-labelledby="disclosure-rubric-title">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.rubricEyebrow }}</p>
        <h2 id="disclosure-rubric-title">{{ copy.rubricTitle }}</h2>
        <p>{{ copy.rubricDescription }}</p>
      </div>

      <div class="rubric-grid">
        <article v-for="item in copy.rubric" :key="item.key">
          <span>{{ item.key }}</span>
          <h3>{{ item.title }}</h3>
          <strong>{{ item.question }}</strong>
          <p>{{ item.disposition }}</p>
        </article>
      </div>
    </section>

    <section class="concept-section" aria-labelledby="disclosure-scenario-title">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.scenarioEyebrow }}</p>
        <h2 id="disclosure-scenario-title">{{ copy.scenarioTitle }}</h2>
        <p>{{ copy.scenarioDescription }}</p>
      </div>

      <div class="scenario-tabs" role="tablist" :aria-label="copy.scenarioTitle">
        <button
          v-for="scenarioName in ['export', 'agent', 'payment'] as ScenarioKey[]"
          :id="'scenario-tab-' + scenarioName"
          :key="scenarioName"
          type="button"
          role="tab"
          :aria-selected="activeScenario === scenarioName"
          :aria-controls="'scenario-panel-' + scenarioName"
          :class="{ active: activeScenario === scenarioName }"
          @click="activeScenario = scenarioName"
        >
          {{ copy.scenarios[scenarioName].tab }}
        </button>
      </div>

      <article
        :id="'scenario-panel-' + activeScenario"
        class="scenario-panel"
        role="tabpanel"
        :aria-labelledby="'scenario-tab-' + activeScenario"
        tabindex="0"
      >
        <p class="scenario-context">
          {{ copy.scenarios[activeScenario].context }}
        </p>
        <div class="placement-list">
          <div v-for="item in copy.scenarios[activeScenario].items" :key="item.name">
            <span :class="['placement-label', item.placement]">
              {{ copy.placement[item.placement] }}
            </span>
            <strong>{{ item.name }}</strong>
            <p>{{ item.reason }}</p>
          </div>
        </div>
        <p class="scenario-verdict" aria-live="polite">
          <span aria-hidden="true">◆</span>
          {{ copy.scenarios[activeScenario].verdict }}
        </p>
      </article>
    </section>

    <section class="concept-section" aria-labelledby="disclosure-failures-title">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.failuresEyebrow }}</p>
        <h2 id="disclosure-failures-title">{{ copy.failuresTitle }}</h2>
      </div>

      <div class="failure-grid">
        <article v-for="(failure, index) in copy.failures" :key="failure.name">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <h3>{{ failure.name }}</h3>
          <p>{{ failure.signal }}</p>
          <strong>{{ failure.fix }}</strong>
        </article>
      </div>
    </section>

    <section class="concept-section neighbors-section" aria-labelledby="disclosure-neighbors-title">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.neighborsEyebrow }}</p>
        <h2 id="disclosure-neighbors-title">{{ copy.neighborsTitle }}</h2>
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
.disclosure-visual {
  --pd-ink: var(--foreground);
  --pd-muted: var(--muted-foreground);
  --pd-surface: var(--card);
  --pd-soft: var(--secondary);
  --pd-border: var(--line-card);
  --pd-accent: color-mix(in srgb, #6d5dfc 82%, var(--foreground));
  --pd-accent-soft: color-mix(in srgb, var(--pd-accent) 10%, var(--pd-surface));
  --pd-blue: #83d9ff;
  --pd-lime: #d9ff66;
  --pd-coral: #ff846f;
  --pd-violet: #b7a5ff;
  color: var(--pd-ink);
}

.concept-section {
  margin-block: clamp(4.5rem, 9vw, 8.5rem);
}

.section-heading {
  max-width: 800px;
  margin-bottom: 2rem;
}

.section-heading .eyebrow {
  margin: 0 0 0.7rem;
  color: var(--pd-accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.section-heading h2 {
  max-width: 780px;
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.8rem);
  letter-spacing: -0.05em;
  line-height: 1.02;
}

.section-heading > p:last-child {
  max-width: 710px;
  margin: 1rem 0 0;
  color: var(--pd-muted);
  font-size: clamp(1rem, 2vw, 1.15rem);
  line-height: 1.75;
}

.lab-shell {
  padding: clamp(1rem, 3vw, 1.75rem);
  border: 1px solid var(--pd-border);
  border-radius: 1.75rem;
  background:
    radial-gradient(
      circle at 92% 8%,
      color-mix(in srgb, var(--pd-blue) 20%, transparent),
      transparent 22rem
    ),
    linear-gradient(145deg, var(--pd-soft), var(--pd-surface));
}

.mode-switch {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
  margin-bottom: 1rem;
}

.mode-switch button {
  display: grid;
  gap: 0.18rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--pd-border);
  border-radius: 1rem;
  color: var(--pd-muted);
  text-align: left;
  background: color-mix(in srgb, var(--pd-surface) 88%, transparent);
  cursor: pointer;
}

.mode-switch button span {
  color: var(--pd-ink);
  font-weight: 760;
}

.mode-switch button small {
  line-height: 1.45;
}

.mode-switch button.active {
  border-color: var(--pd-accent);
  background: var(--pd-accent-soft);
  box-shadow: inset 0 0 0 1px var(--pd-accent);
}

.lab-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(230px, 0.34fr);
  gap: 1rem;
}

.export-window,
.signal-card {
  border: 1px solid var(--pd-border);
  border-radius: 1.35rem;
  background: var(--pd-surface);
}

.export-window {
  overflow: hidden;
}

.window-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid var(--pd-border);
}

.window-header div {
  display: grid;
  gap: 0.2rem;
}

.window-header small,
.signal-copy small,
.setting-row small {
  color: var(--pd-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.setting-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem;
  padding: 1rem;
}

.setting-row {
  display: grid;
  grid-template-columns: 1.6rem 1fr;
  gap: 0.65rem;
  min-width: 0;
  padding: 0.85rem;
  border: 1px solid var(--pd-border);
  border-radius: 0.9rem;
  background: var(--pd-soft);
}

.setting-row.layer-2 {
  background: color-mix(in srgb, var(--pd-blue) 14%, var(--pd-surface));
}

.setting-row.layer-3 {
  background: color-mix(in srgb, var(--pd-violet) 14%, var(--pd-surface));
}

.layer-mark {
  display: grid;
  width: 1.55rem;
  height: 1.55rem;
  place-items: center;
  border-radius: 50%;
  color: #171717;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.66rem;
  font-weight: 800;
  background: var(--pd-lime);
}

.layer-2 .layer-mark {
  background: var(--pd-blue);
}

.layer-3 .layer-mark {
  background: var(--pd-violet);
}

.setting-row > div {
  min-width: 0;
}

.setting-row strong {
  display: block;
  margin-top: 0.3rem;
  overflow-wrap: anywhere;
  font-size: 0.9rem;
  line-height: 1.35;
}

.setting-row p {
  margin: 0.45rem 0 0;
  color: var(--pd-muted);
  font-size: 0.75rem;
  line-height: 1.45;
}

.window-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 4.5rem;
  padding: 0.9rem 1rem;
  border-top: 1px solid var(--pd-border);
}

.disclosure-actions {
  min-width: 0;
}

.reveal-action,
.primary-action {
  min-height: 2.75rem;
  border-radius: 99px;
  font: inherit;
  font-weight: 720;
  cursor: pointer;
}

.reveal-action {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  padding: 0.55rem 0.85rem;
  border: 1px solid var(--pd-border);
  color: var(--pd-ink);
  background: var(--pd-surface);
}

.reveal-action span {
  color: var(--pd-accent);
  font-size: 1.05rem;
}

.primary-action {
  display: flex;
  gap: 1.2rem;
  align-items: center;
  padding: 0.6rem 1rem;
  border: 1px solid var(--pd-ink);
  color: var(--pd-surface);
  background: var(--pd-ink);
}

.signal-card {
  position: relative;
  display: flex;
  min-height: 22rem;
  overflow: hidden;
  flex-direction: column;
  padding: 1.2rem;
}

.signal-orbit {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.38rem;
  width: 5.2rem;
  margin-bottom: 1.8rem;
}

.signal-orbit span {
  aspect-ratio: 1;
  border: 1px solid var(--pd-border);
  border-radius: 50%;
  background: var(--pd-soft);
}

.signal-orbit span.visible {
  border-color: transparent;
  background: var(--pd-lime);
}

.signal-orbit span.visible:nth-child(n + 4) {
  background: var(--pd-blue);
}

.signal-orbit span.visible:nth-child(n + 7) {
  background: var(--pd-violet);
}

.metric {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
  border-top: 1px solid var(--pd-border);
  color: var(--pd-muted);
}

.metric strong {
  color: var(--pd-ink);
  font-size: 1.4rem;
}

.signal-copy {
  margin-top: auto;
  padding: 1rem;
  border-radius: 1rem;
  background: var(--pd-soft);
}

.signal-copy p {
  margin: 0.55rem 0 0;
  line-height: 1.55;
}

.live-region {
  margin: 0.8rem 0 0;
  color: var(--pd-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
}

.rubric-grid,
.failure-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.rubric-grid article,
.failure-grid article {
  position: relative;
  min-height: 14rem;
  overflow: hidden;
  padding: 1.35rem;
  border: 1px solid var(--pd-border);
  border-radius: 1.2rem;
  background: var(--pd-surface);
}

.rubric-grid article > span,
.failure-grid article > span {
  color: var(--pd-accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
  font-weight: 800;
}

.rubric-grid h3,
.failure-grid h3 {
  margin: 2rem 0 0.65rem;
  font-size: 1.35rem;
}

.rubric-grid strong {
  display: block;
  max-width: 28rem;
  line-height: 1.45;
}

.rubric-grid p,
.failure-grid p {
  margin: 0.7rem 0 0;
  color: var(--pd-muted);
  line-height: 1.55;
}

.rubric-grid article::after {
  position: absolute;
  right: -2rem;
  bottom: -2rem;
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  background: color-mix(in srgb, var(--pd-blue) 23%, transparent);
  content: '';
}

.rubric-grid article:nth-child(2)::after {
  background: color-mix(in srgb, var(--pd-lime) 27%, transparent);
}

.rubric-grid article:nth-child(3)::after {
  background: color-mix(in srgb, var(--pd-violet) 24%, transparent);
}

.rubric-grid article:nth-child(4)::after {
  background: color-mix(in srgb, var(--pd-coral) 24%, transparent);
}

.scenario-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.7rem;
}

.scenario-tabs button {
  flex: 0 0 auto;
  padding: 0.7rem 0.95rem;
  border: 1px solid var(--pd-border);
  border-radius: 99px;
  color: var(--pd-muted);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 720;
  background: var(--pd-surface);
  cursor: pointer;
}

.scenario-tabs button.active {
  border-color: var(--pd-ink);
  color: var(--pd-surface);
  background: var(--pd-ink);
}

.scenario-panel {
  padding: clamp(1.2rem, 4vw, 2.2rem);
  border: 1px solid var(--pd-border);
  border-radius: 1.5rem;
  outline: none;
  background: var(--pd-soft);
}

.scenario-context {
  margin: 0 0 1.2rem;
  color: var(--pd-muted);
  font-size: 1.05rem;
}

.placement-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
}

.placement-list > div {
  padding: 1rem;
  border: 1px solid var(--pd-border);
  border-radius: 1rem;
  background: var(--pd-surface);
}

.placement-label {
  display: inline-flex;
  padding: 0.22rem 0.48rem;
  border-radius: 99px;
  color: #171717;
  font-size: 0.67rem;
  font-weight: 780;
  background: var(--pd-lime);
}

.placement-label.later {
  background: var(--pd-blue);
}

.placement-label.neverHide {
  background: var(--pd-coral);
}

.placement-list strong {
  display: block;
  margin-top: 1rem;
  line-height: 1.35;
}

.placement-list p {
  margin: 0.55rem 0 0;
  color: var(--pd-muted);
  font-size: 0.88rem;
  line-height: 1.5;
}

.scenario-verdict {
  display: flex;
  gap: 0.7rem;
  align-items: flex-start;
  margin: 1rem 0 0;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  line-height: 1.55;
  background: color-mix(in srgb, var(--pd-lime) 25%, var(--pd-surface));
}

.scenario-verdict span {
  color: var(--pd-accent);
}

.failure-grid article {
  display: flex;
  flex-direction: column;
}

.failure-grid article:nth-child(3) {
  border-color: color-mix(in srgb, var(--pd-coral) 58%, var(--pd-border));
}

.failure-grid strong {
  margin-top: auto;
  padding-top: 1.2rem;
  line-height: 1.5;
}

.neighbors-section {
  padding: clamp(1.2rem, 4vw, 2.2rem);
  border-radius: 1.75rem;
  background: var(--pd-ink);
}

.neighbors-section .section-heading h2 {
  color: var(--pd-surface);
}

.neighbors-section .section-heading > p:last-child {
  color: color-mix(in srgb, var(--pd-surface) 68%, transparent);
}

.neighbor-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.neighbor-grid article {
  padding: 1.1rem;
  border: 1px solid color-mix(in srgb, var(--pd-surface) 17%, transparent);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--pd-surface) 7%, transparent);
}

.neighbor-grid article > div {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  justify-content: space-between;
}

.neighbor-grid strong {
  color: var(--pd-surface);
}

.neighbor-grid span {
  padding: 0.18rem 0.42rem;
  border-radius: 99px;
  color: #171717;
  font-size: 0.67rem;
  font-weight: 760;
  background: var(--pd-lime);
}

.neighbor-grid small {
  display: block;
  margin-top: 0.45rem;
  color: color-mix(in srgb, var(--pd-surface) 52%, transparent);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.neighbor-grid p {
  margin: 0.85rem 0 0;
  color: color-mix(in srgb, var(--pd-surface) 72%, transparent);
  line-height: 1.55;
}

button:focus-visible,
.scenario-panel:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--pd-accent) 45%, transparent);
  outline-offset: 2px;
}

@media (max-width: 820px) {
  .lab-grid,
  .rubric-grid,
  .failure-grid,
  .neighbor-grid {
    grid-template-columns: 1fr;
  }

  .setting-list,
  .placement-list {
    grid-template-columns: 1fr;
  }

  .signal-card {
    min-height: 18rem;
  }
}

@media (max-width: 560px) {
  .mode-switch {
    grid-template-columns: 1fr;
  }

  .window-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .primary-action,
  .reveal-action {
    width: 100%;
    justify-content: space-between;
  }

  .neighbor-grid article > div {
    align-items: flex-start;
    flex-direction: column;
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
