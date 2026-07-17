<script setup lang="ts">
type Locale = "en" | "zh";
type Tone = "quiet" | "active" | "conflict";
type Strategy = "optimistic" | "pessimistic";
type Scenario = "profile" | "inventory" | "document";

interface ActorState {
  title: string;
  version: string;
  status: string;
  tone: Tone;
}

interface SimulationState {
  databaseTitle: string;
  databaseVersion: string;
  alice: ActorState;
  bob: ActorState;
  explanation: string;
  next: string;
}

interface VisualCopy {
  labEyebrow: string;
  labTitle: string;
  labDescription: string;
  database: string;
  localCopy: string;
  reset: string;
  ready: string;
  states: SimulationState[];
  compareEyebrow: string;
  compareTitle: string;
  compareDescription: string;
  strategies: Record<
    Strategy,
    {
      label: string;
      title: string;
      description: string;
      best: string;
      risk: string;
    }
  >;
  bestWhen: string;
  mainRisk: string;
  neighborsEyebrow: string;
  neighborsTitle: string;
  neighborsDescription: string;
  neighbors: Array<{
    name: string;
    fullName: string;
    type: string;
    description: string;
  }>;
  practiceEyebrow: string;
  practiceTitle: string;
  practiceDescription: string;
  choose: string;
  scenarios: Record<
    Scenario,
    { label: string; title: string; description: string; answer: string }
  >;
}

const props = defineProps<{ locale: Locale }>();

const COPY: Record<Locale, VisualCopy> = {
  en: {
    labEyebrow: "01 · Conflict lab",
    labTitle: "Create one stale write on purpose.",
    labDescription:
      "Alice and Bob begin from the same version. Step through the moment an invisible overwrite becomes a visible, recoverable conflict.",
    database: "Database · current record",
    localCopy: "Local copy",
    reset: "Reset",
    ready: "Simulation ready",
    states: [
      {
        databaseTitle: "Q3 Plan",
        databaseVersion: "version 7",
        alice: {
          title: "Not read yet",
          version: "—",
          status: "Waiting",
          tone: "quiet",
        },
        bob: {
          title: "Not read yet",
          version: "—",
          status: "Waiting",
          tone: "quiet",
        },
        explanation:
          "The database is at version 7. Neither editor has read it yet.",
        next: "Both read v7",
      },
      {
        databaseTitle: "Q3 Plan",
        databaseVersion: "version 7",
        alice: {
          title: "Q3 Growth Plan",
          version: "read v7",
          status: "Editing the title",
          tone: "active",
        },
        bob: {
          title: "Q3 Plan + new owner",
          version: "read v7",
          status: "Editing the owner",
          tone: "active",
        },
        explanation:
          "Both editors work in parallel from version 7. Nobody holds a long-lived exclusive lock.",
        next: "Alice commits",
      },
      {
        databaseTitle: "Q3 Growth Plan",
        databaseVersion: "version 8",
        alice: {
          title: "Q3 Growth Plan",
          version: "saved v8",
          status: "Commit succeeded",
          tone: "active",
        },
        bob: {
          title: "Q3 Plan + new owner",
          version: "read v7",
          status: "Still based on stale data",
          tone: "quiet",
        },
        explanation:
          "Alice finds version 7, writes successfully, and advances the record to version 8.",
        next: "Bob submits stale v7",
      },
      {
        databaseTitle: "Q3 Growth Plan",
        databaseVersion: "version 8",
        alice: {
          title: "Q3 Growth Plan",
          version: "saved v8",
          status: "Her change is preserved",
          tone: "quiet",
        },
        bob: {
          title: "Q3 Plan + new owner",
          version: "stale v7",
          status: "Conflict: zero rows affected",
          tone: "conflict",
        },
        explanation:
          "Bob’s version-7 condition no longer matches. The system rejects the stale write instead of erasing Alice’s title.",
        next: "Bob reloads and merges",
      },
      {
        databaseTitle: "Q3 Growth Plan + new owner",
        databaseVersion: "version 9",
        alice: {
          title: "Q3 Growth Plan",
          version: "saved v8",
          status: "Her change remains",
          tone: "quiet",
        },
        bob: {
          title: "Q3 Growth Plan + new owner",
          version: "saved v9",
          status: "Merged from fresh v8",
          tone: "active",
        },
        explanation:
          "Bob reloads version 8, preserves Alice’s title, merges his owner change, and commits version 9.",
        next: "Run again",
      },
    ],
    compareEyebrow: "02 · Strategy switch",
    compareTitle: "Optimistic and pessimistic systems pay different costs.",
    compareDescription:
      "The choice is not “safe versus unsafe.” It is whether ordinary work should pay with waiting or rare conflicts should pay with rework.",
    strategies: {
      optimistic: {
        label: "Optimistic · parallel first",
        title: "Everyone works; the commit point checks the ticket.",
        description:
          "No conflict means almost no waiting. A collision means at least one participant must retry, merge, or stop.",
        best: "Low contention",
        risk: "Retry storms",
      },
      pessimistic: {
        label: "Pessimistic · queue first",
        title: "One participant takes the lock; everyone else waits.",
        description:
          "Less completed work is discarded, but every operation pays for locks, waiting, timeouts, and possible deadlocks.",
        best: "Hot, short transactions",
        risk: "Waiting / deadlock",
      },
    },
    bestWhen: "Best when",
    mainRisk: "Main risk",
    neighborsEyebrow: "03 · Concept neighborhood",
    neighborsTitle:
      "Acronyms become useful when you know what kind of thing each one is.",
    neighborsDescription:
      "OCC is a strategy. Its neighbors include a storage model, an atomic primitive, transaction semantics, retry safety, and merge models.",
    neighbors: [
      {
        name: "MVCC",
        fullName: "Multi-Version Concurrency Control",
        type: "storage model",
        description: "Keeps versions so readers can see consistent snapshots.",
      },
      {
        name: "CAS",
        fullName: "Compare-and-Swap / Compare-and-Set",
        type: "atomic primitive",
        description:
          "Changes a value only while it still equals the expected value.",
      },
      {
        name: "Isolation",
        fullName: "Transaction Isolation",
        type: "semantics",
        description: "Defines what concurrent transactions may observe.",
      },
      {
        name: "Idempotency",
        fullName: "Idempotent Operation",
        type: "retry safety",
        description: "Makes retrying safe from duplicate effects.",
      },
      {
        name: "OT / CRDT",
        fullName:
          "Operational Transformation / Conflict-free Replicated Data Type",
        type: "merge model",
        description:
          "Transforms or converges concurrent intent instead of only rejecting it.",
      },
      {
        name: "PCC",
        fullName: "Pessimistic Concurrency Control",
        type: "strategy",
        description: "Secures exclusive access before doing critical work.",
      },
    ],
    practiceEyebrow: "04 · Judgment practice",
    practiceTitle: "Read the shape of the conflict, not just the definition.",
    practiceDescription:
      "Choose a scenario. The strongest design is often a hybrid, because different parts of the system have different contention and failure costs.",
    choose: "Choose a scenario to reveal the design judgment.",
    scenarios: {
      profile: {
        label: "Scenario A",
        title: "A user occasionally edits a profile",
        description: "Reads dominate writes; editing can last minutes.",
        answer:
          "Lean optimistic. A version or ETag avoids holding a lock through a human editing session; refresh or merge when the rare conflict occurs.",
      },
      inventory: {
        label: "Scenario B",
        title: "1,000 people want the final item",
        description: "One hot record; collisions are the normal case.",
        answer:
          "Use an atomic decrement and often serialize the hotspot with a short transaction, reservation, or queue. Pure retries can become a storm.",
      },
      document: {
        label: "Scenario C",
        title: "Many people edit one document live",
        description: "Concurrent intent is valuable and should be preserved.",
        answer:
          "Simple reject-and-retry OCC is not enough. Operational Transformation or a CRDT usually owns merging, while versions still define synchronization boundaries.",
      },
    },
  },
  zh: {
    labEyebrow: "01 · 冲突实验室",
    labTitle: "亲手制造一次过期写入。",
    labDescription:
      "Alice 和 Bob 从同一个版本开始。一步步推进，看看一次原本会悄悄发生的覆盖，怎样变成可以看见、可以恢复的冲突。",
    database: "数据库 · 当前记录",
    localCopy: "本地副本",
    reset: "重置",
    ready: "实验已准备",
    states: [
      {
        databaseTitle: "Q3 Plan",
        databaseVersion: "version 7",
        alice: {
          title: "尚未读取",
          version: "—",
          status: "等待开始",
          tone: "quiet",
        },
        bob: {
          title: "尚未读取",
          version: "—",
          status: "等待开始",
          tone: "quiet",
        },
        explanation: "数据库当前是 version 7，两位编辑者都还没有读取。",
        next: "两人读取 v7",
      },
      {
        databaseTitle: "Q3 Plan",
        databaseVersion: "version 7",
        alice: {
          title: "Q3 Growth Plan",
          version: "read v7",
          status: "正在修改标题",
          tone: "active",
        },
        bob: {
          title: "Q3 Plan + new owner",
          version: "read v7",
          status: "正在修改 owner",
          tone: "active",
        },
        explanation: "两个人都基于 version 7 并行工作，没有人长期持有排他锁。",
        next: "Alice 提交",
      },
      {
        databaseTitle: "Q3 Growth Plan",
        databaseVersion: "version 8",
        alice: {
          title: "Q3 Growth Plan",
          version: "saved v8",
          status: "提交成功",
          tone: "active",
        },
        bob: {
          title: "Q3 Plan + new owner",
          version: "read v7",
          status: "仍然依赖旧数据",
          tone: "quiet",
        },
        explanation:
          "Alice 检查到 version 7 仍然有效，写入成功，并把记录推进到 version 8。",
        next: "Bob 提交旧 v7",
      },
      {
        databaseTitle: "Q3 Growth Plan",
        databaseVersion: "version 8",
        alice: {
          title: "Q3 Growth Plan",
          version: "saved v8",
          status: "她的修改仍被保留",
          tone: "quiet",
        },
        bob: {
          title: "Q3 Plan + new owner",
          version: "stale v7",
          status: "冲突：影响 0 行",
          tone: "conflict",
        },
        explanation:
          "Bob 的 version-7 条件已经不成立。系统拒绝旧写入，没有让它覆盖 Alice 的标题。",
        next: "Bob 重读并合并",
      },
      {
        databaseTitle: "Q3 Growth Plan + new owner",
        databaseVersion: "version 9",
        alice: {
          title: "Q3 Growth Plan",
          version: "saved v8",
          status: "她的修改仍然存在",
          tone: "quiet",
        },
        bob: {
          title: "Q3 Growth Plan + new owner",
          version: "saved v9",
          status: "基于最新 v8 合并",
          tone: "active",
        },
        explanation:
          "Bob 重读 version 8，保留 Alice 的标题，合并自己的 owner 修改，再提交为 version 9。",
        next: "再看一次",
      },
    ],
    compareEyebrow: "02 · 策略切换",
    compareTitle: "乐观与悲观，只是在支付不同的成本。",
    compareDescription:
      "这不是“安全”和“不安全”的选择，而是让普通工作承担等待，还是让少数冲突承担返工。",
    strategies: {
      optimistic: {
        label: "乐观 · 先并行",
        title: "大家同时工作，提交点负责验票。",
        description:
          "没有冲突时几乎没人等待；发生碰撞时，至少一方需要重试、合并或停止。",
        best: "低争用",
        risk: "重试风暴",
      },
      pessimistic: {
        label: "悲观 · 先排队",
        title: "一个人先拿锁，其他人等待。",
        description:
          "已经完成的工作更少被丢弃，但每次操作都要支付锁、等待、超时与潜在死锁的成本。",
        best: "热点短事务",
        risk: "等待 / 死锁",
      },
    },
    bestWhen: "最适合",
    mainRisk: "主要风险",
    neighborsEyebrow: "03 · 概念邻居",
    neighborsTitle: "知道每个缩写属于哪一类，它们才真正有用。",
    neighborsDescription:
      "OCC 是策略。它旁边有存储模型、原子原语、事务语义、重试安全和合并模型。",
    neighbors: [
      {
        name: "MVCC",
        fullName: "Multi-Version Concurrency Control · 多版本并发控制",
        type: "存储模型",
        description: "保存多个版本，让读者看见一致快照。",
      },
      {
        name: "CAS",
        fullName: "Compare-and-Swap / Compare-and-Set · 比较并交换",
        type: "原子原语",
        description: "只有当前值仍等于 expected 时才替换。",
      },
      {
        name: "Isolation",
        fullName: "Transaction Isolation · 事务隔离",
        type: "事务语义",
        description: "决定并发事务能够观察什么。",
      },
      {
        name: "Idempotency",
        fullName: "Idempotent Operation · 幂等操作",
        type: "重试安全",
        description: "让重试不会重复产生副作用。",
      },
      {
        name: "OT / CRDT",
        fullName:
          "Operational Transformation / Conflict-free Replicated Data Type · 操作转换 / 无冲突复制数据类型",
        type: "合并模型",
        description: "转换或收敛并发意图，而不是只拒绝其中一方。",
      },
      {
        name: "PCC",
        fullName: "Pessimistic Concurrency Control · 悲观并发控制",
        type: "策略",
        description: "开始关键工作前先取得排他访问权。",
      },
    ],
    practiceEyebrow: "04 · 判断练习",
    practiceTitle: "判断冲突的形状，而不只是背诵定义。",
    practiceDescription:
      "选择一个场景。最强的设计经常是混合方案，因为系统不同部分的争用程度与失败成本并不相同。",
    choose: "选择一个场景，查看更合适的设计判断。",
    scenarios: {
      profile: {
        label: "场景 A",
        title: "用户偶尔编辑个人资料",
        description: "读多写少，一次编辑可能持续几分钟。",
        answer:
          "倾向乐观。version 或 ETag 避免在用户编辑期间长期持锁；少数冲突发生时再刷新或合并。",
      },
      inventory: {
        label: "场景 B",
        title: "1,000 人抢最后一件库存",
        description: "单一热点，碰撞本身就是常态。",
        answer:
          "使用原子扣减，并经常配合短事务、库存预留或队列串行化热点。纯重试可能形成风暴。",
      },
      document: {
        label: "场景 C",
        title: "多人实时编辑同一份文档",
        description: "并发意图很有价值，希望尽量保留。",
        answer:
          "简单的拒绝和重试不够。通常由 Operational Transformation 或 CRDT 负责合并，version 仍可定义同步边界。",
      },
    },
  },
};

const content = computed(() => COPY[props.locale]);
const step = ref(0);
const strategy = ref<Strategy>("optimistic");
const selectedScenario = ref<Scenario | null>(null);
const currentState = computed(() => content.value.states[step.value]);
const currentStrategy = computed(
  () => content.value.strategies[strategy.value],
);
const currentAnswer = computed(() =>
  selectedScenario.value
    ? content.value.scenarios[selectedScenario.value].answer
    : content.value.choose,
);

function nextStep() {
  step.value =
    step.value === content.value.states.length - 1 ? 0 : step.value + 1;
}

function reset() {
  step.value = 0;
}
</script>

<template>
  <div class="learn-visual">
    <section class="visual-section" aria-labelledby="conflict-lab-title">
      <p class="eyebrow">{{ content.labEyebrow }}</p>
      <h2 id="conflict-lab-title">{{ content.labTitle }}</h2>
      <p class="section-description">{{ content.labDescription }}</p>

      <div class="lab-frame">
        <header class="lab-header">
          <span>DOCUMENT #42</span>
          <span class="live-dot">{{ content.ready }}</span>
        </header>

        <div class="lab-stage">
          <article class="actor-card" :class="currentState.alice.tone">
            <header>
              <span class="avatar">A</span>
              <strong>Alice</strong>
              <span class="version">{{ currentState.alice.version }}</span>
            </header>
            <small>{{ content.localCopy }}</small>
            <p class="record-title">{{ currentState.alice.title }}</p>
            <p class="status">{{ currentState.alice.status }}</p>
          </article>

          <article class="database-card">
            <small>{{ content.database }}</small>
            <p class="record-title">{{ currentState.databaseTitle }}</p>
            <span class="database-version">{{
              currentState.databaseVersion
            }}</span>
          </article>

          <article class="actor-card" :class="currentState.bob.tone">
            <header>
              <span class="avatar">B</span>
              <strong>Bob</strong>
              <span class="version">{{ currentState.bob.version }}</span>
            </header>
            <small>{{ content.localCopy }}</small>
            <p class="record-title">{{ currentState.bob.title }}</p>
            <p class="status">{{ currentState.bob.status }}</p>
          </article>
        </div>

        <p class="lab-explanation" aria-live="polite">
          {{ currentState.explanation }}
        </p>

        <footer class="lab-controls">
          <div class="step-dots" aria-hidden="true">
            <span
              v-for="(_, index) in content.states"
              :key="index"
              :class="{ current: index === step }"
            ></span>
          </div>
          <div class="button-row">
            <button type="button" class="button secondary" @click="reset">
              {{ content.reset }}
            </button>
            <button type="button" class="button primary" @click="nextStep">
              {{ currentState.next }} →
            </button>
          </div>
        </footer>
      </div>
    </section>

    <section class="visual-section" aria-labelledby="strategy-title">
      <p class="eyebrow">{{ content.compareEyebrow }}</p>
      <h2 id="strategy-title">{{ content.compareTitle }}</h2>
      <p class="section-description">{{ content.compareDescription }}</p>

      <div class="strategy-frame">
        <div
          class="strategy-tabs"
          role="tablist"
          aria-label="Concurrency strategy"
        >
          <button
            v-for="option in ['optimistic', 'pessimistic'] as Strategy[]"
            :key="option"
            type="button"
            role="tab"
            :aria-selected="strategy === option"
            :class="{ selected: strategy === option }"
            @click="strategy = option"
          >
            {{ content.strategies[option].label }}
          </button>
        </div>

        <div class="strategy-panel" :class="strategy">
          <div class="lanes" aria-hidden="true">
            <div class="lane"><span>Alice</span><i></i></div>
            <div class="lane"><span>Bob</span><i></i></div>
          </div>
          <div aria-live="polite">
            <h3>{{ currentStrategy.title }}</h3>
            <p>{{ currentStrategy.description }}</p>
            <dl>
              <div>
                <dt>{{ content.bestWhen }}</dt>
                <dd>{{ currentStrategy.best }}</dd>
              </div>
              <div>
                <dt>{{ content.mainRisk }}</dt>
                <dd>{{ currentStrategy.risk }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <section class="visual-section" aria-labelledby="neighbors-visual-title">
      <p class="eyebrow">{{ content.neighborsEyebrow }}</p>
      <h2 id="neighbors-visual-title">{{ content.neighborsTitle }}</h2>
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

    <section class="visual-section" aria-labelledby="practice-title">
      <p class="eyebrow">{{ content.practiceEyebrow }}</p>
      <h2 id="practice-title">{{ content.practiceTitle }}</h2>
      <p class="section-description">{{ content.practiceDescription }}</p>

      <div class="scenario-grid">
        <button
          v-for="key in ['profile', 'inventory', 'document'] as Scenario[]"
          :key="key"
          type="button"
          :class="{ selected: selectedScenario === key }"
          @click="selectedScenario = key"
        >
          <span>{{ content.scenarios[key].label }}</span>
          <strong>{{ content.scenarios[key].title }}</strong>
          <p>{{ content.scenarios[key].description }}</p>
        </button>
      </div>
      <p class="scenario-answer" aria-live="polite">{{ currentAnswer }}</p>
    </section>
  </div>
</template>

<style scoped>
.learn-visual {
  --visual-blue: #70c7ee;
  --visual-lime: #b9db45;
  --visual-coral: #ed7968;
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
  max-width: 46rem;
  margin: 1.25rem 0 2.25rem;
  color: var(--muted-foreground);
  font-size: 1.08rem;
  line-height: 1.75;
}

.lab-frame,
.strategy-frame {
  overflow: hidden;
  border: 1px solid var(--line-card);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--card) 76%, transparent);
}

.lab-header,
.lab-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  color: var(--muted-foreground);
  font:
    600 0.62rem/1.4 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.lab-header {
  border-bottom: 1px solid var(--line-subtle);
}

.live-dot {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}
.live-dot::before {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  content: "";
  background: var(--visual-lime);
  box-shadow: 0 0 0 0.25rem
    color-mix(in srgb, var(--visual-lime) 14%, transparent);
}

.lab-stage {
  display: grid;
  grid-template-columns: 1fr 1.15fr 1fr;
  gap: 0.75rem;
  padding: 1.25rem;
}

.actor-card,
.database-card {
  min-width: 0;
  min-height: 14rem;
  padding: 1.1rem;
  border: 1px solid var(--line-card);
  border-radius: 0.8rem;
  background: color-mix(in srgb, var(--background) 84%, transparent);
  transition:
    border-color 180ms ease,
    transform 180ms ease,
    background 180ms ease;
}

.actor-card.active {
  border-color: color-mix(in srgb, var(--visual-lime) 70%, var(--line-control));
  background: color-mix(in srgb, var(--visual-lime) 8%, var(--background));
  transform: translateY(-0.18rem);
}

.actor-card.conflict {
  border-color: color-mix(
    in srgb,
    var(--visual-coral) 74%,
    var(--line-control)
  );
  background: color-mix(in srgb, var(--visual-coral) 9%, var(--background));
}

.actor-card header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.7rem;
}
.avatar {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border-radius: 999px;
  color: var(--background);
  background: var(--foreground);
  font-size: 0.7rem;
  font-weight: 800;
}
.version,
.database-version {
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--line-control);
  border-radius: 999px;
  color: var(--muted-foreground);
  font:
    0.58rem ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
}
.actor-card small,
.database-card small {
  display: block;
  margin-bottom: 0.45rem;
  color: var(--muted-foreground);
  font:
    0.56rem ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.record-title {
  margin: 0;
  color: var(--foreground);
  font-size: 1.05rem;
  font-weight: 650;
  line-height: 1.35;
}
.status {
  margin: 1.5rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.72rem;
  line-height: 1.5;
}

.database-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #f5f5f4;
  background: #18181b;
}
.database-card .record-title {
  color: #fafafa;
  font-size: 1.25rem;
}
.database-card small {
  color: #a1a1aa;
}
.database-version {
  align-self: flex-start;
  margin-top: 1.2rem;
  color: #d4a64a;
  border-color: #52525b;
}

.lab-explanation {
  min-height: 5rem;
  margin: 0;
  padding: 1.1rem 1.25rem;
  border-block: 1px solid var(--line-subtle);
  color: var(--muted-foreground);
  font-size: 0.9rem;
  line-height: 1.65;
  background: color-mix(in srgb, var(--secondary) 55%, transparent);
}

.step-dots {
  display: flex;
  gap: 0.4rem;
}
.step-dots span {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 999px;
  background: var(--line-control);
  transition: width 180ms ease;
}
.step-dots span.current {
  width: 1.5rem;
  background: var(--notes-accent);
}
.button-row {
  display: flex;
  gap: 0.5rem;
}
.button {
  min-height: 2.6rem;
  padding: 0 1rem;
  cursor: pointer;
  border: 1px solid var(--line-control);
  border-radius: 0.55rem;
  color: var(--foreground);
  font-size: 0.78rem;
  font-weight: 650;
  background: transparent;
}
.button.primary {
  color: var(--background);
  border-color: var(--foreground);
  background: var(--foreground);
}
.button:focus-visible {
  outline: 2px solid var(--notes-accent);
  outline-offset: 2px;
}

.strategy-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  padding: 0.6rem;
  border-bottom: 1px solid var(--line-subtle);
}
.strategy-tabs button {
  min-height: 3rem;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 0.65rem;
  color: var(--muted-foreground);
  font-size: 0.82rem;
  font-weight: 650;
  background: transparent;
}
.strategy-tabs button.selected {
  color: var(--background);
  border-color: var(--foreground);
  background: var(--foreground);
}
.strategy-tabs button:focus-visible {
  outline: 2px solid var(--notes-accent);
  outline-offset: 2px;
}

.strategy-panel {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 2rem;
  min-height: 17rem;
  align-items: center;
  padding: 2rem;
}
.lanes {
  display: grid;
  gap: 0.75rem;
}
.lane {
  position: relative;
  height: 3.2rem;
  overflow: hidden;
  border: 1px solid var(--line-card);
  border-radius: 999px;
  background: color-mix(in srgb, var(--background) 72%, transparent);
}
.lane span {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  z-index: 1;
  color: var(--muted-foreground);
  font:
    0.58rem ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  transform: translateY(-50%);
}
.lane i {
  position: absolute;
  top: 0.48rem;
  bottom: 0.48rem;
  left: 3.8rem;
  width: 62%;
  border-radius: 999px;
  background: var(--visual-blue);
}
.lane:nth-child(2) i {
  left: 5.1rem;
  width: 52%;
  background: var(--visual-lime);
}
.strategy-panel.pessimistic .lane:nth-child(2) i {
  left: 54%;
  width: 36%;
  background: repeating-linear-gradient(
    135deg,
    var(--visual-coral),
    var(--visual-coral) 0.45rem,
    transparent 0.45rem,
    transparent 0.9rem
  );
}
.strategy-panel h3 {
  margin: 0;
  color: var(--foreground);
  font-size: 1.5rem;
  letter-spacing: -0.03em;
  line-height: 1.25;
}
.strategy-panel p {
  margin: 0.8rem 0 1.5rem;
  color: var(--muted-foreground);
  font-size: 0.9rem;
  line-height: 1.65;
}
.strategy-panel dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  margin: 0;
}
.strategy-panel dl div {
  padding: 0.8rem;
  border: 1px solid var(--line-card);
  border-radius: 0.65rem;
  background: color-mix(in srgb, var(--background) 65%, transparent);
}
.strategy-panel dt {
  color: var(--muted-foreground);
  font:
    0.54rem ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.strategy-panel dd {
  margin: 0.4rem 0 0;
  color: var(--foreground);
  font-size: 0.9rem;
  font-weight: 650;
}

.neighbor-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}
.neighbor-grid article {
  position: relative;
  min-height: 11.5rem;
  overflow: hidden;
  padding: 1.2rem;
  border: 1px solid var(--line-card);
  border-radius: 0.8rem;
  background: color-mix(in srgb, var(--card) 70%, transparent);
}
.neighbor-grid article::after {
  position: absolute;
  top: -1.5rem;
  right: -1.5rem;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 999px;
  content: "";
  background: color-mix(in srgb, var(--visual-blue) 25%, transparent);
}
.neighbor-grid article:nth-child(3n + 2)::after {
  background: color-mix(in srgb, var(--visual-lime) 28%, transparent);
}
.neighbor-grid article:nth-child(3n + 3)::after {
  background: color-mix(in srgb, var(--visual-coral) 24%, transparent);
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
  font-size: 1.35rem;
  letter-spacing: -0.03em;
}
.neighbor-grid header span {
  position: relative;
  z-index: 1;
  color: var(--muted-foreground);
  font:
    0.52rem ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.neighbor-grid .full-name {
  max-width: calc(100% - 2rem);
  margin: 0.35rem 0 1rem;
  color: var(--notes-accent);
  font:
    0.62rem/1.55 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
}
.neighbor-grid article > p:last-child {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.78rem;
  line-height: 1.55;
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}
.scenario-grid button {
  min-height: 12.5rem;
  padding: 1.15rem;
  cursor: pointer;
  border: 1px solid var(--line-card);
  border-radius: 0.8rem;
  text-align: left;
  color: inherit;
  background: color-mix(in srgb, var(--card) 70%, transparent);
  transition:
    border-color 180ms ease,
    transform 180ms ease;
}
.scenario-grid button:hover {
  border-color: var(--line-control);
  transform: translateY(-0.15rem);
}
.scenario-grid button.selected {
  border-color: var(--notes-accent);
  background: color-mix(in srgb, var(--notes-accent) 7%, var(--card));
}
.scenario-grid button:focus-visible {
  outline: 2px solid var(--notes-accent);
  outline-offset: 2px;
}
.scenario-grid span {
  display: block;
  margin-bottom: 2rem;
  color: var(--notes-accent);
  font:
    0.56rem ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.scenario-grid strong {
  display: block;
  color: var(--foreground);
  font-size: 1rem;
  line-height: 1.35;
}
.scenario-grid p {
  margin: 0.65rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.75rem;
  line-height: 1.55;
}
.scenario-answer {
  min-height: 5.5rem;
  margin: 0.75rem 0 0;
  padding: 1rem 1.2rem;
  border: 1px dashed var(--line-control);
  border-radius: 0.8rem;
  color: var(--muted-foreground);
  font-size: 0.88rem;
  line-height: 1.65;
  background: color-mix(in srgb, var(--secondary) 35%, transparent);
}

@media (max-width: 760px) {
  .lab-stage {
    grid-template-columns: 1fr 1fr;
  }
  .database-card {
    grid-column: 1 / -1;
    grid-row: 1;
    min-height: 10rem;
  }
  .strategy-panel {
    grid-template-columns: 1fr;
  }
  .neighbor-grid {
    grid-template-columns: 1fr;
  }
  .scenario-grid {
    grid-template-columns: 1fr;
  }
  .scenario-grid button {
    min-height: 9rem;
  }
}

@media (max-width: 520px) {
  .visual-section {
    padding: 3rem 0;
  }
  .lab-stage {
    grid-template-columns: 1fr;
  }
  .database-card {
    grid-column: auto;
  }
  .lab-controls {
    align-items: flex-end;
  }
  .button-row {
    flex-direction: column-reverse;
  }
  .strategy-tabs {
    grid-template-columns: 1fr;
  }
  .strategy-panel {
    padding: 1.25rem;
  }
  .strategy-panel dl {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .actor-card,
  .step-dots span,
  .scenario-grid button {
    transition: none;
  }
}
</style>
