<script setup lang="ts">
type Locale = 'en' | 'zh'
type Scenario = 'healthy' | 'drift' | 'split'
type Tone = 'authority' | 'derived' | 'warning' | 'conflict'

interface NodeState {
  name: string
  role: string
  version: string
  detail: string
  tone: Tone
}

interface ScenarioState {
  tab: string
  title: string
  description: string
  verdict: string
  nodes: NodeState[]
}

interface VisualCopy {
  labEyebrow: string
  labTitle: string
  labDescription: string
  authority: string
  derived: string
  scenarios: Record<Scenario, ScenarioState>
  repair: string
  repairReset: string
  repairReady: string
  repairSteps: Array<{ label: string; title: string; description: string }>
  contractEyebrow: string
  contractTitle: string
  contractDescription: string
  contractItems: Array<{ question: string; answer: string; tag: string }>
  boundaryEyebrow: string
  boundaryTitle: string
  boundaryDescription: string
  misconceptions: Array<{
    myth: string
    correction: string
    label: string
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

const COPY: Record<Locale, VisualCopy> = {
  en: {
    labEyebrow: '01 · Drift lab',
    labTitle: 'Four copies. Only one gets to define the fact.',
    labDescription:
      'Switch between a healthy pipeline, an edited derivative, and two competing authorities. The files are not the problem; ambiguous write ownership is.',
    authority: 'authoritative',
    derived: 'derived',
    scenarios: {
      healthy: {
        tab: 'Healthy flow',
        title: 'One authority, reproducible projections',
        description:
          'The source advances to version 4. Every downstream representation is regenerated in one direction and records the same source version.',
        verdict: 'Many physical copies; one unambiguous correction path.',
        nodes: [
          {
            name: 'Brain Markdown',
            role: 'Meaning lives here',
            version: 'source · v4',
            detail: 'The only place that originates editorial changes.',
            tone: 'authority',
          },
          {
            name: 'Public package',
            role: 'Bilingual projection',
            version: 'from v4',
            detail: 'Generated from the source and safe to rebuild.',
            tone: 'derived',
          },
          {
            name: 'Blog copy',
            role: 'Site input',
            version: 'from v4',
            detail: 'Optimized for the publishing application.',
            tone: 'derived',
          },
          {
            name: 'Production',
            role: 'Published evidence',
            version: 'main · v4',
            detail: 'Serves the committed revision produced by the pipeline.',
            tone: 'derived',
          },
        ],
      },
      drift: {
        tab: 'Edit a copy',
        title: 'A convenient hotfix creates hidden drift',
        description:
          'The blog copy receives a direct version-4 edit while the authority remains at version 3. The next sync cannot preserve both intentions automatically.',
        verdict: 'The page may look correct now, but the repair is living in the wrong layer.',
        nodes: [
          {
            name: 'Brain Markdown',
            role: 'Declared authority',
            version: 'source · v3',
            detail: 'Still contains the old wording.',
            tone: 'authority',
          },
          {
            name: 'Public package',
            role: 'Bilingual projection',
            version: 'from v3',
            detail: 'Consistent with the source, but not with the hotfix.',
            tone: 'derived',
          },
          {
            name: 'Blog copy',
            role: 'Edited derivative',
            version: 'local · v4',
            detail: 'A useful correction exists only in a rebuildable output.',
            tone: 'warning',
          },
          {
            name: 'Production',
            role: 'Published evidence',
            version: 'main · v3',
            detail: 'The site and local blog copy no longer prove the same state.',
            tone: 'warning',
          },
        ],
      },
      split: {
        tab: 'Two writers',
        title: 'Two systems both believe they own the fact',
        description:
          'The source changes the title while the blog changes the description. A circular sync now needs ordering, merge rules, and conflict ownership.',
        verdict:
          'This is not synchronization yet. It is a distributed-authority protocol that has not been designed.',
        nodes: [
          {
            name: 'Brain Markdown',
            role: 'Writer A',
            version: 'branch A · v4',
            detail: 'Originated a valid title change.',
            tone: 'conflict',
          },
          {
            name: 'Public package',
            role: 'Mixed projection',
            version: 'from v3',
            detail: 'Cannot represent both unseen branches.',
            tone: 'warning',
          },
          {
            name: 'Blog copy',
            role: 'Writer B',
            version: 'branch B · v4',
            detail: 'Originated a valid description change.',
            tone: 'conflict',
          },
          {
            name: 'Production',
            role: 'Ambiguous output',
            version: 'unknown',
            detail: 'Deploying either branch silently discards the other.',
            tone: 'warning',
          },
        ],
      },
    },
    repair: 'Start repair',
    repairReset: 'Reset',
    repairReady: 'Choose a broken scenario, then restore authority before consistency.',
    repairSteps: [
      {
        label: '01 · Freeze',
        title: 'Stop widening the split.',
        description: 'Pause direct edits and releases while the evidence is collected.',
      },
      {
        label: '02 · Name',
        title: 'Name the exact fact in conflict.',
        description:
          'Separate the title, description, deployment revision, and other independently owned facts.',
      },
      {
        label: '03 · Choose',
        title: 'Confirm the authority.',
        description:
          'Use ownership, completeness, timeline, and audit history to select the judge.',
      },
      {
        label: '04 · Reconcile',
        title: 'Bring valid changes back to the source.',
        description:
          'Do not discard downstream-only intent merely because it occurred in the wrong layer.',
      },
      {
        label: '05 · Regenerate',
        title: 'Rebuild every projection.',
        description:
          'One source version now produces the public package, site copy, and deployment again.',
      },
      {
        label: '06 · Guard',
        title: 'Make the direction executable.',
        description: 'Add lineage, diff checks, permissions, and a deterministic publish path.',
      },
    ],
    contractEyebrow: '02 · Authority contract',
    contractTitle: 'An SSOT becomes real when four questions have answers.',
    contractDescription:
      'Naming a file ‘canonical’ is only a promise. The surrounding system must make ownership, freshness, and recovery visible.',
    contractItems: [
      {
        question: 'Who may originate a correction?',
        answer: 'Name the owner and the one accepted write path for this bounded fact.',
        tag: 'authority',
      },
      {
        question: 'Which way do updates flow?',
        answer: 'Prefer one-way generation unless the domain truly requires multiple writers.',
        tag: 'direction',
      },
      {
        question: 'How stale may a copy be?',
        answer: 'Declare the source version, refresh trigger, and acceptable delay.',
        tag: 'freshness',
      },
      {
        question: 'How do we rebuild it?',
        answer: 'A derivative needs a deterministic, repeatable recovery path.',
        tag: 'recovery',
      },
    ],
    boundaryEyebrow: '03 · Boundary check',
    boundaryTitle: 'The word ‘single’ causes three predictable mistakes.',
    boundaryDescription:
      'SSOT centralizes decision authority for a fact. It does not require one physical copy, one database, or an infallible owner.',
    misconceptions: [
      {
        label: 'Physical storage',
        myth: 'One source means only one copy.',
        correction:
          'Replicas, caches, reports, and indexes are expected; their authority is what must remain explicit.',
      },
      {
        label: 'System design',
        myth: 'One source means one giant database.',
        correction:
          'Different domains should own different facts. The unit of authority is bounded, not universal.',
      },
      {
        label: 'Data quality',
        myth: 'The source is automatically correct.',
        correction:
          'It can be wrong. SSOT tells everyone where the correction belongs and how it propagates.',
      },
    ],
    neighborsEyebrow: '04 · Concept neighborhood',
    neighborsTitle: 'Know whether a neighbor owns, traces, or projects the fact.',
    neighborsDescription:
      'The nearby concepts solve different parts of the authority problem. Their relationship type matters more than their acronym.',
    neighbors: [
      {
        name: 'Canonical Source',
        fullName: 'Canonical Source',
        type: 'authority mechanism',
        description: 'The concrete representation formally selected as authoritative.',
      },
      {
        name: 'Lineage',
        fullName: 'Data Lineage',
        type: 'provenance',
        description: 'Traces a projection back through versions and transformations.',
      },
      {
        name: 'Materialized View',
        fullName: 'Materialized View',
        type: 'derived projection',
        description: 'Stores a read-friendly result that may lag and can be rebuilt.',
      },
      {
        name: 'Event Sourcing',
        fullName: 'Event Sourcing',
        type: 'implementation pattern',
        description: 'Uses an ordered event log as the authority and replays it into views.',
      },
      {
        name: 'CQRS',
        fullName: 'Command Query Responsibility Segregation',
        type: 'architecture pattern',
        description: 'Separates authoritative writes from read-optimized models.',
      },
      {
        name: 'SVOT',
        fullName: 'Single Version of Truth',
        type: 'consumption agreement',
        description: 'Aligns people on one definition or result rather than locating its owner.',
      },
    ],
  },
  zh: {
    labEyebrow: '01 · 漂移实验室',
    labTitle: '四份副本，只有一个可以定义事实。',
    labDescription:
      '切换健康发布链、被直接修改的派生物，以及两个同时自称权威的写入者。问题不是文件太多，而是写入所有权含糊。',
    authority: '权威源',
    derived: '派生物',
    scenarios: {
      healthy: {
        tab: '健康流动',
        title: '一个权威源，可重复生成多个投影',
        description:
          '源头前进到 version 4。所有下游表示沿一个方向重新生成，并记录同一个 source version。',
        verdict: '物理副本可以很多，修正路径只有一条，而且没有歧义。',
        nodes: [
          {
            name: 'Brain Markdown',
            role: '语义在这里',
            version: 'source · v4',
            detail: '唯一可以发起内容修改的地方。',
            tone: 'authority',
          },
          {
            name: 'Public package',
            role: '双语投影',
            version: 'from v4',
            detail: '从源头生成，随时可以重建。',
            tone: 'derived',
          },
          {
            name: 'Blog copy',
            role: '站点输入',
            version: 'from v4',
            detail: '为发布应用准备的内容副本。',
            tone: 'derived',
          },
          {
            name: 'Production',
            role: '发布证据',
            version: 'main · v4',
            detail: '服务由发布链产生的已提交 revision。',
            tone: 'derived',
          },
        ],
      },
      drift: {
        tab: '直接改副本',
        title: '一次方便的 hotfix 制造了隐形漂移',
        description:
          'Blog copy 被直接改成 version 4，权威源仍停在 version 3。下一次同步无法自动保留两边的意图。',
        verdict: '页面现在也许是对的，但修复发生在了错误的层。',
        nodes: [
          {
            name: 'Brain Markdown',
            role: '声明的权威源',
            version: 'source · v3',
            detail: '仍然保存旧文案。',
            tone: 'authority',
          },
          {
            name: 'Public package',
            role: '双语投影',
            version: 'from v3',
            detail: '与源一致，却不知道 hotfix。',
            tone: 'derived',
          },
          {
            name: 'Blog copy',
            role: '被编辑的派生物',
            version: 'local · v4',
            detail: '有价值的修改只存在于一个可重建输出里。',
            tone: 'warning',
          },
          {
            name: 'Production',
            role: '发布证据',
            version: 'main · v3',
            detail: '站点与本地 blog copy 已经不再证明同一个状态。',
            tone: 'warning',
          },
        ],
      },
      split: {
        tab: '两个写入者',
        title: '两个系统都认为自己拥有事实',
        description:
          '源头修改标题，blog 修改简介。环形同步现在必须处理顺序、合并规则与冲突所有权。',
        verdict: '这还不是同步，而是一个尚未设计的分布式权威协议。',
        nodes: [
          {
            name: 'Brain Markdown',
            role: 'Writer A',
            version: 'branch A · v4',
            detail: '产生了一次有效标题修改。',
            tone: 'conflict',
          },
          {
            name: 'Public package',
            role: '混合投影',
            version: 'from v3',
            detail: '无法表达两个尚未合并的分支。',
            tone: 'warning',
          },
          {
            name: 'Blog copy',
            role: 'Writer B',
            version: 'branch B · v4',
            detail: '产生了一次有效简介修改。',
            tone: 'conflict',
          },
          {
            name: 'Production',
            role: '含糊输出',
            version: 'unknown',
            detail: '发布任何一边都会静默丢掉另一边。',
            tone: 'warning',
          },
        ],
      },
    },
    repair: '开始修复',
    repairReset: '重置',
    repairReady: '选择一个损坏场景，先恢复权威，再恢复一致。',
    repairSteps: [
      {
        label: '01 · Freeze',
        title: '停止扩大分叉。',
        description: '暂停直接修改与发布，先收集证据。',
      },
      {
        label: '02 · Name',
        title: '说清楚哪一个事实冲突。',
        description: '把标题、简介、部署 revision 等各自独立拥有的事实拆开。',
      },
      {
        label: '03 · Choose',
        title: '确认权威源。',
        description: '根据所有权、完整性、时间线与审计历史选择裁判。',
      },
      {
        label: '04 · Reconcile',
        title: '把有效修改带回源头。',
        description: '修改发生在错误层，不代表它表达的意图应该被丢弃。',
      },
      {
        label: '05 · Regenerate',
        title: '重新生成每一个投影。',
        description: '同一个 source version 再次产生公开包、站点副本与部署。',
      },
      {
        label: '06 · Guard',
        title: '让方向变成可执行规则。',
        description: '增加 lineage、diff check、写权限与确定性发布路径。',
      },
    ],
    contractEyebrow: '02 · 权威契约',
    contractTitle: '四个问题都有答案，SSOT 才真正存在。',
    contractDescription:
      '把文件命名为 canonical 只是承诺。周围的系统还必须让所有权、新鲜度与恢复路径都可以看见。',
    contractItems: [
      {
        question: '谁可以发起一次修正？',
        answer: '为这类有边界的事实，明确拥有者与唯一被接受的写入路径。',
        tag: 'authority',
      },
      {
        question: '更新朝哪个方向流动？',
        answer: '除非领域真的需要多个写入者，否则优先单向生成。',
        tag: 'direction',
      },
      {
        question: '副本允许落后多久？',
        answer: '声明 source version、刷新触发条件与可接受延迟。',
        tag: 'freshness',
      },
      {
        question: '怎样重新生成？',
        answer: '每个派生物都需要确定、可重复的恢复路径。',
        tag: 'recovery',
      },
    ],
    boundaryEyebrow: '03 · 边界检查',
    boundaryTitle: '“单一”这个词最容易制造三种误会。',
    boundaryDescription:
      'SSOT 集中的是某类事实的裁决权。它不要求一个物理副本、一个数据库，也不假设权威拥有者永远正确。',
    misconceptions: [
      {
        label: '物理存储',
        myth: '一个源，就只能有一份副本。',
        correction: 'replica、缓存、报表与索引都应该存在；需要明确的是它们有没有权威。',
      },
      {
        label: '系统设计',
        myth: '一个源，就是一个巨大数据库。',
        correction: '不同领域应该拥有不同事实。权威的单位有边界，而不是统治一切。',
      },
      {
        label: '数据质量',
        myth: '权威源一定自动正确。',
        correction: '它仍然会错。SSOT 告诉所有人修改应该落在哪里，又怎样传播出去。',
      },
    ],
    neighborsEyebrow: '04 · 概念邻居',
    neighborsTitle: '看清邻居是在拥有、追踪，还是投影这个事实。',
    neighborsDescription: '周边概念分别解决权威问题的不同部分。它们的关系类型，比记住缩写更重要。',
    neighbors: [
      {
        name: 'Canonical Source',
        fullName: 'Canonical Source · 规范源',
        type: '权威机制',
        description: '被正式选为权威的具体表示。',
      },
      {
        name: 'Lineage',
        fullName: 'Data Lineage · 数据血缘',
        type: '来源追踪',
        description: '沿着版本与转换，把一个投影追溯回源头。',
      },
      {
        name: 'Materialized View',
        fullName: 'Materialized View · 物化视图',
        type: '派生投影',
        description: '保存适合读取的结果；它可以落后，也可以重建。',
      },
      {
        name: 'Event Sourcing',
        fullName: 'Event Sourcing · 事件溯源',
        type: '实现模式',
        description: '把有序事件日志作为权威，再重放到各种视图。',
      },
      {
        name: 'CQRS',
        fullName: 'Command Query Responsibility Segregation · 命令查询职责分离',
        type: '架构模式',
        description: '把权威写入与为读取优化的模型分开。',
      },
      {
        name: 'SVOT',
        fullName: 'Single Version of Truth · 单一版本的真相',
        type: '消费共识',
        description: '让人们对一个定义或结果达成一致，而不是定位它的拥有者。',
      },
    ],
  },
}

const content = computed(() => COPY[props.locale])
const scenario = ref<Scenario>('healthy')
const repairStep = ref(-1)
const currentScenario = computed(() => content.value.scenarios[scenario.value])
const repairMessage = computed(() =>
  repairStep.value < 0
    ? content.value.repairReady
    : `${content.value.repairSteps[repairStep.value].title} ${content.value.repairSteps[repairStep.value].description}`,
)

function selectScenario(next: Scenario) {
  scenario.value = next
  repairStep.value = -1
}

function advanceRepair() {
  repairStep.value =
    repairStep.value >= content.value.repairSteps.length - 1 ? 0 : repairStep.value + 1
}

function resetRepair() {
  repairStep.value = -1
}
</script>

<template>
  <div class="learn-visual">
    <section class="visual-section" aria-labelledby="drift-lab-title">
      <p class="eyebrow">{{ content.labEyebrow }}</p>
      <h2 id="drift-lab-title">{{ content.labTitle }}</h2>
      <p class="section-description">{{ content.labDescription }}</p>

      <div class="lab-frame">
        <div class="scenario-tabs" role="tablist" aria-label="Source of truth scenarios">
          <button
            v-for="key in ['healthy', 'drift', 'split'] as Scenario[]"
            :key="key"
            type="button"
            role="tab"
            :aria-selected="scenario === key"
            :class="{ selected: scenario === key }"
            @click="selectScenario(key)"
          >
            {{ content.scenarios[key].tab }}
          </button>
        </div>

        <div class="scenario-intro" aria-live="polite">
          <div>
            <h3>{{ currentScenario.title }}</h3>
            <p>{{ currentScenario.description }}</p>
          </div>
          <span :class="['health-badge', scenario]">{{ currentScenario.tab }}</span>
        </div>

        <div class="pipeline">
          <template v-for="(node, index) in currentScenario.nodes" :key="node.name">
            <article :class="['pipeline-node', node.tone]">
              <header>
                <span>{{ node.role }}</span>
                <strong>{{
                  node.tone === 'authority' ? content.authority : content.derived
                }}</strong>
              </header>
              <h4>{{ node.name }}</h4>
              <code>{{ node.version }}</code>
              <p>{{ node.detail }}</p>
            </article>
            <span
              v-if="index < currentScenario.nodes.length - 1"
              class="pipeline-arrow"
              aria-hidden="true"
              >→</span
            >
          </template>
        </div>

        <p :class="['verdict', scenario]" aria-live="polite">
          {{ currentScenario.verdict }}
        </p>

        <div v-if="scenario !== 'healthy'" class="repair-panel">
          <ol aria-label="Repair sequence">
            <li
              v-for="(item, index) in content.repairSteps"
              :key="item.label"
              :class="{
                active: repairStep === index,
                complete: repairStep > index,
              }"
            >
              <span>{{ item.label }}</span>
            </li>
          </ol>
          <p aria-live="polite">{{ repairMessage }}</p>
          <div class="button-row">
            <button type="button" class="button secondary" @click="resetRepair">
              {{ content.repairReset }}
            </button>
            <button type="button" class="button primary" @click="advanceRepair">
              {{ content.repair }} →
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="visual-section" aria-labelledby="contract-title">
      <p class="eyebrow">{{ content.contractEyebrow }}</p>
      <h2 id="contract-title">{{ content.contractTitle }}</h2>
      <p class="section-description">{{ content.contractDescription }}</p>
      <div class="contract-grid">
        <article v-for="(item, index) in content.contractItems" :key="item.tag">
          <header>
            <span>0{{ index + 1 }}</span>
            <code>{{ item.tag }}</code>
          </header>
          <h3>{{ item.question }}</h3>
          <p>{{ item.answer }}</p>
        </article>
      </div>
    </section>

    <section class="visual-section" aria-labelledby="boundary-title">
      <p class="eyebrow">{{ content.boundaryEyebrow }}</p>
      <h2 id="boundary-title">{{ content.boundaryTitle }}</h2>
      <p class="section-description">{{ content.boundaryDescription }}</p>
      <div class="misconception-list">
        <article v-for="item in content.misconceptions" :key="item.label">
          <span>{{ item.label }}</span>
          <h3>{{ item.myth }}</h3>
          <p>{{ item.correction }}</p>
        </article>
      </div>
    </section>

    <section class="visual-section" aria-labelledby="neighbors-title">
      <p class="eyebrow">{{ content.neighborsEyebrow }}</p>
      <h2 id="neighbors-title">{{ content.neighborsTitle }}</h2>
      <p class="section-description">{{ content.neighborsDescription }}</p>
      <div class="neighbor-grid">
        <article v-for="neighbor in content.neighbors" :key="neighbor.name">
          <header>
            <h3>{{ neighbor.name }}</h3>
            <span>{{ neighbor.type }}</span>
          </header>
          <p class="full-name">{{ neighbor.fullName }}</p>
          <p>{{ neighbor.description }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.learn-visual {
  --visual-blue: #70c7ee;
  --visual-lime: #b9db45;
  --visual-coral: #ed7968;
  --visual-amber: #d6a13f;
}

.visual-section {
  padding: 4rem 0;
  border-top: 1px solid var(--line-subtle);
}

.visual-section:first-child {
  border-top: 0;
}

.eyebrow {
  margin: 0 0 1rem;
  color: var(--notes-accent);
  font:
    600 0.64rem/1.4 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.visual-section > h2 {
  max-width: 52rem;
  margin: 0;
  color: var(--foreground);
  font-size: clamp(2.1rem, 5vw, 3.8rem);
  font-weight: 650;
  letter-spacing: -0.05em;
  line-height: 1.02;
}

.section-description {
  max-width: 48rem;
  margin: 1.25rem 0 2.25rem;
  color: var(--muted-foreground);
  font-size: 1.08rem;
  line-height: 1.75;
}

.lab-frame {
  overflow: hidden;
  border: 1px solid var(--line-card);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--card) 76%, transparent);
}

.scenario-tabs {
  display: flex;
  gap: 0.35rem;
  padding: 0.75rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--line-subtle);
}

.scenario-tabs button {
  flex: 0 0 auto;
  padding: 0.65rem 0.9rem;
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--muted-foreground);
  background: transparent;
  font: inherit;
  font-size: 0.82rem;
  cursor: pointer;
}

.scenario-tabs button:hover,
.scenario-tabs button:focus-visible {
  color: var(--foreground);
  background: color-mix(in srgb, var(--muted) 28%, transparent);
}

.scenario-tabs button.selected {
  border-color: var(--line-card);
  color: var(--foreground);
  background: var(--background);
}

.scenario-intro {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  padding: 1.5rem;
}

.scenario-intro h3 {
  margin: 0;
  color: var(--foreground);
  font-size: 1.35rem;
  letter-spacing: -0.025em;
}

.scenario-intro p {
  max-width: 46rem;
  margin: 0.65rem 0 0;
  color: var(--muted-foreground);
  line-height: 1.65;
}

.health-badge {
  flex: 0 0 auto;
  padding: 0.45rem 0.65rem;
  border-radius: 999px;
  color: var(--foreground);
  background: color-mix(in srgb, var(--visual-lime) 28%, transparent);
  font:
    650 0.6rem/1 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.health-badge.drift {
  background: color-mix(in srgb, var(--visual-amber) 26%, transparent);
}

.health-badge.split {
  background: color-mix(in srgb, var(--visual-coral) 24%, transparent);
}

.pipeline {
  display: grid;
  grid-template-columns:
    minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr)
    auto minmax(0, 1fr);
  align-items: stretch;
  gap: 0.5rem;
  padding: 0 1.5rem 1.5rem;
}

.pipeline-node {
  min-width: 0;
  min-height: 13rem;
  padding: 1rem;
  border: 1px solid var(--line-card);
  border-radius: 0.8rem;
  background: color-mix(in srgb, var(--background) 84%, transparent);
}

.pipeline-node.authority {
  border-color: color-mix(in srgb, var(--visual-blue) 62%, var(--line-card));
  box-shadow: inset 0 0.2rem 0 color-mix(in srgb, var(--visual-blue) 70%, transparent);
}

.pipeline-node.warning {
  border-color: color-mix(in srgb, var(--visual-amber) 64%, var(--line-card));
  background: color-mix(in srgb, var(--visual-amber) 8%, var(--background));
}

.pipeline-node.conflict {
  border-color: color-mix(in srgb, var(--visual-coral) 68%, var(--line-card));
  background: color-mix(in srgb, var(--visual-coral) 8%, var(--background));
}

.pipeline-node header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  color: var(--muted-foreground);
  font:
    600 0.56rem/1.35 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.pipeline-node header strong {
  color: var(--notes-accent);
  font-weight: 650;
}

.pipeline-node h4 {
  margin: 1.4rem 0 0.7rem;
  color: var(--foreground);
  font-size: 1rem;
  letter-spacing: -0.02em;
}

.pipeline-node code {
  display: inline-block;
  padding: 0.3rem 0.45rem;
  border-radius: 0.3rem;
  color: var(--foreground);
  background: color-mix(in srgb, var(--muted) 42%, transparent);
  font-size: 0.66rem;
}

.pipeline-node p {
  margin: 1rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.82rem;
  line-height: 1.55;
}

.pipeline-arrow {
  align-self: center;
  color: var(--muted-foreground);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.verdict {
  margin: 0;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--line-subtle);
  color: var(--foreground);
  background: color-mix(in srgb, var(--visual-lime) 10%, transparent);
  line-height: 1.6;
}

.verdict.drift {
  background: color-mix(in srgb, var(--visual-amber) 10%, transparent);
}

.verdict.split {
  background: color-mix(in srgb, var(--visual-coral) 10%, transparent);
}

.repair-panel {
  padding: 1.25rem 1.5rem 1.5rem;
  border-top: 1px solid var(--line-subtle);
}

.repair-panel ol {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.repair-panel li {
  padding-top: 0.55rem;
  border-top: 0.16rem solid var(--line-card);
  color: var(--muted-foreground);
  font:
    600 0.55rem/1.3 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.repair-panel li.complete,
.repair-panel li.active {
  border-color: var(--visual-lime);
  color: var(--foreground);
}

.repair-panel li.active {
  border-color: var(--visual-blue);
}

.repair-panel > p {
  min-height: 3.4rem;
  margin: 1.25rem 0;
  color: var(--muted-foreground);
  line-height: 1.65;
}

.button-row {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
}

.button {
  padding: 0.72rem 0.95rem;
  border: 1px solid var(--line-card);
  border-radius: 0.55rem;
  font: inherit;
  font-size: 0.78rem;
  cursor: pointer;
}

.button.primary {
  border-color: var(--foreground);
  color: var(--background);
  background: var(--foreground);
}

.button.secondary {
  color: var(--foreground);
  background: transparent;
}

.contract-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.contract-grid article {
  min-height: 12rem;
  padding: 1.35rem;
  border: 1px solid var(--line-card);
  border-radius: 0.85rem;
  background: color-mix(in srgb, var(--card) 72%, transparent);
}

.contract-grid header {
  display: flex;
  justify-content: space-between;
  color: var(--muted-foreground);
  font:
    600 0.62rem/1.3 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.contract-grid header code {
  color: var(--notes-accent);
}

.contract-grid h3,
.misconception-list h3 {
  margin: 2.2rem 0 0.65rem;
  color: var(--foreground);
  font-size: 1.2rem;
  letter-spacing: -0.025em;
}

.contract-grid p,
.misconception-list p {
  margin: 0;
  color: var(--muted-foreground);
  line-height: 1.65;
}

.misconception-list {
  border-top: 1px solid var(--line-card);
}

.misconception-list article {
  display: grid;
  grid-template-columns: 0.45fr 1fr 1.3fr;
  gap: 1.5rem;
  align-items: baseline;
  padding: 1.4rem 0;
  border-bottom: 1px solid var(--line-card);
}

.misconception-list article > span {
  color: var(--notes-accent);
  font:
    600 0.6rem/1.3 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.misconception-list h3,
.misconception-list p {
  margin: 0;
}

.neighbor-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.neighbor-grid article {
  padding: 1.25rem;
  border: 1px solid var(--line-card);
  border-radius: 0.8rem;
  background: color-mix(in srgb, var(--card) 72%, transparent);
}

.neighbor-grid header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.neighbor-grid h3 {
  margin: 0;
  color: var(--foreground);
  font-size: 1rem;
}

.neighbor-grid header span {
  color: var(--notes-accent);
  font:
    600 0.55rem/1.3 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  letter-spacing: 0.06em;
  text-align: right;
  text-transform: uppercase;
}

.neighbor-grid p {
  margin: 0.8rem 0 0;
  color: var(--muted-foreground);
  line-height: 1.6;
}

.neighbor-grid .full-name {
  color: var(--foreground);
  font-size: 0.78rem;
}

button:focus-visible {
  outline: 2px solid var(--notes-accent);
  outline-offset: 2px;
}

@media (max-width: 900px) {
  .pipeline {
    grid-template-columns: 1fr;
  }

  .pipeline-arrow {
    justify-self: center;
    transform: rotate(90deg);
  }

  .pipeline-node {
    min-height: auto;
  }
}

@media (max-width: 700px) {
  .visual-section {
    padding: 3rem 0;
  }

  .scenario-intro {
    flex-direction: column;
    gap: 1rem;
  }

  .repair-panel ol {
    grid-template-columns: repeat(3, 1fr);
    row-gap: 0.8rem;
  }

  .contract-grid,
  .neighbor-grid {
    grid-template-columns: 1fr;
  }

  .misconception-list article {
    grid-template-columns: 1fr;
    gap: 0.55rem;
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
