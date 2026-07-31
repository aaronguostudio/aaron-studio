<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";

type Locale = "en" | "zh";
type LayerKey =
  | "contract"
  | "context"
  | "tools"
  | "state"
  | "evals"
  | "permissions"
  | "recovery";
type ScenarioKey = "copy" | "coding" | "account";
type PresetKey = "model" | "prototype" | "production";
type ComparisonPhase =
  | "coordinates"
  | "permission"
  | "handshake"
  | "recovery"
  | "verification";
type ComparisonSourceKey =
  | "openai-harness"
  | "openai-safety"
  | "openai-durable"
  | "anthropic-long"
  | "anthropic-evaluator"
  | "anthropic-managed"
  | "anthropic-sandbox"
  | "anthropic-evals"
  | "spacex-flight-13"
  | "spacex-flight-6"
  | "spacex-flight-5"
  | "nasa-mission-control"
  | "faa-starship";
interface LayerCopy {
  name: string;
  short: string;
  role: string;
  success: string;
  failure: string;
}

interface Scenario {
  name: string;
  task: string;
  consequence: string;
  recommendation: string;
  required: LayerKey[];
}

interface ComparisonFrameCopy {
  shortLabel: string;
  label: string;
  narration: string;
  noCopy: string;
  noState: string;
  yesCopy: string;
  yesState: string;
  sources: ComparisonSourceKey[];
}

interface MissionCopy {
  accessibleHeading: string;
  eyebrow: string;
  heading: string;
  description: string;
  noHarness: string;
  withHarness: string;
  noHarnessMeta: string;
  withHarnessMeta: string;
  clarification: string;
  play: string;
  pause: string;
  resume: string;
  replay: string;
  staticView: string;
  loading: string;
  unsupported: string;
  finalConclusion: string;
  memoryLine: string;
  practiceLabel: string;
  synthesisLabel: string;
  phases: Record<ComparisonPhase, ComparisonFrameCopy>;
}

type MissionPlayback = "idle" | "playing" | "paused" | "complete";

interface MissionControllerState {
  stage: ComparisonPhase;
  index: number;
  playback: MissionPlayback;
  progress: number;
  stageSettled: boolean;
  completed: boolean;
  reason: string;
}

interface MissionController {
  play(options: { from: ComparisonPhase }): void;
  pause(): void;
  resume(): void;
  select(
    stage: ComparisonPhase,
    options: {
      animate: boolean;
      autoplay: boolean;
      reason: "pointer" | "keyboard" | "programmatic";
    },
  ): void;
  reset(options: { animate: boolean }): void;
  setReducedMotion(reduced: boolean): void;
  resize(): void;
  getState(): MissionControllerState;
  destroy(): void;
}

interface HarnessMissionRuntime {
  VERSION: string;
  STAGES: readonly {
    key: ComparisonPhase;
    duration: number;
  }[];
  create(options: {
    canvas: HTMLCanvasElement;
    host: HTMLElement;
    initialStage: ComparisonPhase;
    reducedMotion: boolean;
    locale: Locale;
    onReady: () => void;
    onStateChange: (state: MissionControllerState) => void;
    onUnsupported: (error?: unknown) => void;
  }): MissionController;
}

interface Copy {
  eyebrow: string;
  title: string;
  description: string;
  taskLabel: string;
  task: string;
  presets: Record<PresetKey, string>;
  presetHelp: Record<PresetKey, string>;
  layersHeading: string;
  layersDescription: string;
  on: string;
  off: string;
  model: string;
  modelRole: string;
  output: string;
  verifiable: string;
  plausible: string;
  coverage: string;
  risk: string;
  evidence: string;
  low: string;
  medium: string;
  high: string;
  strong: string;
  partial: string;
  weak: string;
  runHeading: string;
  runDescription: string;
  start: string;
  next: string;
  replay: string;
  notStarted: string;
  complete: string;
  blocked: string;
  recovered: string;
  runSteps: Array<{
    label: string;
    withHarness: string;
    withoutHarness: string;
    requires?: LayerKey;
  }>;
  scenarioHeading: string;
  scenarioDescription: string;
  scenarioLabel: string;
  enough: string;
  missing: string;
  scenarios: Record<ScenarioKey, Scenario>;
  selectedLayer: string;
  whyItMatters: string;
  whenMissing: string;
  distinction: string;
  distinctionBody: string;
  layers: Record<LayerKey, LayerCopy>;
}

const props = defineProps<{ locale: Locale }>();

const layerOrder: LayerKey[] = [
  "contract",
  "context",
  "tools",
  "state",
  "evals",
  "permissions",
  "recovery",
];

const comparisonPhases: ComparisonPhase[] = [
  "coordinates",
  "permission",
  "handshake",
  "recovery",
  "verification",
];

const comparisonSources: Record<
  ComparisonSourceKey,
  {
    organization: string;
    label: Record<Locale, string>;
    title: string;
    url: string;
  }
> = {
  "openai-harness": {
    organization: "OpenAI",
    label: { en: "repository map + review", zh: "仓库地图 + 评审" },
    title: "Harness engineering: leveraging Codex in an agent-first world",
    url: "https://openai.com/index/harness-engineering/",
  },
  "openai-safety": {
    organization: "OpenAI",
    label: { en: "sandbox + approvals", zh: "沙箱 + 审批" },
    title: "Running Codex safely at OpenAI",
    url: "https://openai.com/index/running-codex-safely/",
  },
  "openai-durable": {
    organization: "OpenAI",
    label: { en: "externalized state", zh: "外部持久状态" },
    title: "The next evolution of the Agents SDK",
    url: "https://openai.com/index/the-next-evolution-of-the-agents-sdk/",
  },
  "anthropic-long": {
    organization: "Anthropic",
    label: { en: "progress artifacts", zh: "进度产物" },
    title: "Effective harnesses for long-running agents",
    url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
  },
  "anthropic-evaluator": {
    organization: "Anthropic",
    label: {
      en: "sprint contract + evaluator",
      zh: "Sprint 契约 + 独立评审",
    },
    title: "Harness design for long-running application development",
    url: "https://www.anthropic.com/engineering/harness-design-long-running-apps",
  },
  "anthropic-managed": {
    organization: "Anthropic",
    label: { en: "durable session log", zh: "持久 Session 轨迹" },
    title: "Scaling Managed Agents: Decoupling the brain from the hands",
    url: "https://www.anthropic.com/engineering/managed-agents",
  },
  "anthropic-sandbox": {
    organization: "Anthropic",
    label: { en: "sandboxed credentials", zh: "沙箱外凭证" },
    title: "Beyond permission prompts: Claude Code sandboxing",
    url: "https://www.anthropic.com/engineering/claude-code-sandboxing",
  },
  "anthropic-evals": {
    organization: "Anthropic",
    label: { en: "outcome grading", zh: "结果评估" },
    title: "Demystifying evals for AI agents",
    url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
  },
  "spacex-flight-13": {
    organization: "SpaceX",
    label: {
      en: "Flight 13 planned objectives",
      zh: "Flight 13 计划目标",
    },
    title: "Starship's Thirteenth Flight Test",
    url: "https://www.spacex.com/launches/starship-flight-13",
  },
  "spacex-flight-6": {
    organization: "SpaceX",
    label: {
      en: "health check → catch abort → divert",
      zh: "健康检查 → 放弃捕获 → 改道",
    },
    title: "Starship's Sixth Flight Test",
    url: "https://www.spacex.com/launches/starship-flight-6",
  },
  "spacex-flight-5": {
    organization: "SpaceX",
    label: {
      en: "thousands of catch criteria",
      zh: "数千项捕获条件",
    },
    title: "Starship's Fifth Flight Test",
    url: "https://www.spacex.com/launches/starship-flight-5",
  },
  "nasa-mission-control": {
    organization: "NASA",
    label: { en: "mission-control operations", zh: "任务控制职责" },
    title:
      "National Aeronautics and Space Administration (NASA) · Johnson Space Center Spaceflight Operations",
    url: "https://www.nasa.gov/reference/jsc-spaceflight-operations/",
  },
  "faa-starship": {
    organization: "FAA",
    label: { en: "external launch authorization", zh: "外部发射许可" },
    title:
      "Federal Aviation Administration (FAA) · SpaceX Starship/Super Heavy License Review Process",
    url: "https://www.faa.gov/space/stakeholder_engagement/spacex_starship/license_review_process",
  },
};

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: "01 · Build the runtime",
    title: "Turn model capability into dependable work.",
    description:
      "Toggle each harness layer, then run the same checkout-bug task. Every layer changes what the system can know, do, prove, or recover.",
    taskLabel: "Running example",
    task: "Fix the negative checkout total, add a regression test, and open a pull request.",
    presets: {
      model: "Model only",
      prototype: "Prototype",
      production: "Production",
    },
    presetHelp: {
      model: "A capable model with no durable operating system around it.",
      prototype:
        "Enough structure to act and test in a low-risk development loop.",
      production: "A complete evidence, authority, and recovery loop.",
    },
    layersHeading: "Explore what created the difference",
    layersDescription:
      "The model is the capability core. Open each layer to see which guarantee changed the output you just watched.",
    on: "included",
    off: "missing",
    model: "MODEL",
    modelRole: "reason · decide · generate",
    output: "WORK",
    verifiable: "verifiable",
    plausible: "plausible",
    coverage: "Harness coverage",
    risk: "Operational risk",
    evidence: "Completion evidence",
    low: "low",
    medium: "medium",
    high: "high",
    strong: "strong",
    partial: "partial",
    weak: "weak",
    runHeading: "Run one task through the system",
    runDescription:
      "The third event injects a sandbox crash. State and recovery determine whether work resumes or starts over.",
    start: "Start run",
    next: "Next event",
    replay: "Replay",
    notStarted: "Ready to run",
    complete: "Delivered with evidence",
    blocked: "Progress lost",
    recovered: "Recovered from durable state",
    runSteps: [
      {
        label: "Specify",
        withHarness:
          "Acceptance criteria bind “done” to a non-negative total, regression coverage, and a verified pull request.",
        withoutHarness:
          "The task remains an interpretation. The model can optimize for a plausible patch instead of the observable result.",
        requires: "contract",
      },
      {
        label: "Observe",
        withHarness:
          "The agent follows the repository map to checkout rules, tests, and the current run command.",
        withoutHarness:
          "It guesses from nearby filenames and whichever documents happen to fit in context.",
        requires: "context",
      },
      {
        label: "Act",
        withHarness:
          "The patch and failing regression test are created inside an isolated worktree.",
        withoutHarness:
          "Without controlled tools, the model can only suggest a patch; with broad tools, the blast radius is undefined.",
        requires: "tools",
      },
      {
        label: "Crash",
        withHarness:
          "The sandbox disappears. The external session still holds the plan, patch checkpoint, and completed events.",
        withoutHarness:
          "The only copy of progress lived in the interrupted process. The next run cannot distinguish finished work from intention.",
        requires: "state",
      },
      {
        label: "Recover",
        withHarness:
          "A clean sandbox is rebuilt and the run resumes after the last durable event without duplicating side effects.",
        withoutHarness:
          "The agent starts over, risks redoing edits, and cannot safely retry any external action.",
        requires: "recovery",
      },
      {
        label: "Verify",
        withHarness:
          "Regression, existing tests, browser checkout, logs, and static rules produce independent evidence.",
        withoutHarness:
          "The generator reviews its own patch and promotes “looks right” into “complete.”",
        requires: "evals",
      },
      {
        label: "Deliver",
        withHarness:
          "A scoped gate allows one pull request only after evidence passes; the external result is queried after creation.",
        withoutHarness:
          "Authority is either absent or overly broad, and a lost response can create a duplicate pull request.",
        requires: "permissions",
      },
    ],
    scenarioHeading: "How much harness is enough?",
    scenarioDescription:
      "Depth should follow duration, side effects, repeatability, and failure cost—not fashion.",
    scenarioLabel: "Choose a scenario",
    enough: "Proportionate coverage",
    missing: "Missing for this risk level",
    scenarios: {
      copy: {
        name: "One-off copy edit",
        task: "Rewrite a public paragraph with no sensitive data or external side effects.",
        consequence: "A human can inspect the complete output immediately.",
        recommendation:
          "A clear instruction and human reading are usually enough. A production harness would add ceremony without useful risk reduction.",
        required: ["contract", "context"],
      },
      coding: {
        name: "Six-hour coding task",
        task: "Implement a multi-file feature, run the app, and produce a reviewable pull request.",
        consequence:
          "Context will shift, tools can change the repository, and a crash can erase hours of work.",
        recommendation:
          "Use an isolated environment, durable progress, executable verification, scoped delivery, and recovery.",
        required: [
          "contract",
          "context",
          "tools",
          "state",
          "evals",
          "permissions",
          "recovery",
        ],
      },
      account: {
        name: "Recurring account workflow",
        task: "Read invoices, update customer accounts, and send notices every day.",
        consequence:
          "The workflow is repeated and creates real external side effects involving customer data.",
        recommendation:
          "Use the full harness plus idempotency, audited permissions, confirmations, regression evals, and ongoing monitoring.",
        required: [
          "contract",
          "context",
          "tools",
          "state",
          "evals",
          "permissions",
          "recovery",
        ],
      },
    },
    selectedLayer: "Selected layer",
    whyItMatters: "What it contributes",
    whenMissing: "Failure when missing",
    distinction: "The key distinction",
    distinctionBody:
      "An agent framework gives you parts. An agent harness is the runtime you assemble. Harness Engineering is the practice of deciding which guarantees belong in context, tools, code, evaluators, permissions, and durable state.",
    layers: {
      contract: {
        name: "Task contract",
        short: "CONTRACT",
        role: "Defines observable outcomes, constraints, and the evidence required before “done.”",
        success:
          "The system knows what result to optimize and how completion will be judged.",
        failure:
          "A fluent patch can satisfy the wording while missing the real business result.",
      },
      context: {
        name: "Context map",
        short: "CONTEXT",
        role: "Selects relevant knowledge and points to versioned sources of truth.",
        success:
          "The agent can find current architecture, domain rules, and run instructions without flooding context.",
        failure:
          "It guesses from stale or nearby information and may never discover the authoritative rule.",
      },
      tools: {
        name: "Tools & sandbox",
        short: "TOOLS",
        role: "Turns intent into scoped action inside a legible, isolated environment.",
        success:
          "The agent can reproduce, edit, run, inspect, and attribute failures.",
        failure:
          "It can only propose work—or acts through broad, opaque tools with an undefined blast radius.",
      },
      state: {
        name: "Durable state",
        short: "STATE",
        role: "Persists events, progress, decisions, artifacts, and side effects beyond one context window.",
        success:
          "A later run can resume from facts instead of reconstructing memory.",
        failure:
          "Compaction or process loss erases the boundary between completed work and intended work.",
      },
      evals: {
        name: "Verification & evals",
        short: "VERIFY",
        role: "Grades observable outcomes with deterministic checks, calibrated review, and human judgment.",
        success:
          "“Done” is supported by reproducible evidence from the environment.",
        failure:
          "The generator becomes its own lenient judge and mistakes confidence for correctness.",
      },
      permissions: {
        name: "Permissions",
        short: "AUTHORITY",
        role: "Grants the narrow capabilities needed and gates consequential actions.",
        success:
          "The agent has enough authority to finish, with a bounded blast radius and an audit trail.",
        failure:
          "It is either powerless or dangerously overprivileged; untrusted content can redirect broad authority.",
      },
      recovery: {
        name: "Recovery & trace",
        short: "RECOVERY",
        role: "Explains failures, rebuilds disposable infrastructure, and resumes without duplicating side effects.",
        success:
          "Failure becomes another state transition instead of a lost task.",
        failure:
          "“Try again” may restart hours of work or repeat an external action.",
      },
    },
  },
  zh: {
    eyebrow: "01 · 组装运行系统",
    title: "把模型能力变成可靠工作。",
    description:
      "逐层打开 Harness，再运行同一个结账 Bug 任务。每一层都会改变系统能知道什么、做什么、证明什么，以及怎样恢复。",
    taskLabel: "贯穿案例",
    task: "修复负数结账总额，补回归测试，并创建一个 Pull Request。",
    presets: {
      model: "只有模型",
      prototype: "原型 Harness",
      production: "生产 Harness",
    },
    presetHelp: {
      model: "模型有能力，但周围没有持久运行系统。",
      prototype: "足以在低风险开发循环中行动和测试。",
      production: "完整的证据、权限与恢复闭环。",
    },
    layersHeading: "拆开刚才的差异",
    layersDescription:
      "模型是能力核心；逐层打开运行系统，理解刚才哪一种保证改变了最终输出。",
    on: "已加入",
    off: "缺失",
    model: "MODEL",
    modelRole: "推理 · 决策 · 生成",
    output: "WORK",
    verifiable: "可验证",
    plausible: "看似合理",
    coverage: "Harness 覆盖",
    risk: "运行风险",
    evidence: "完成证据",
    low: "低",
    medium: "中",
    high: "高",
    strong: "强",
    partial: "部分",
    weak: "弱",
    runHeading: "让一个任务穿过系统",
    runDescription:
      "第三个行动后会注入一次沙箱崩溃；状态与恢复层决定工作能否继续。",
    start: "开始运行",
    next: "下一个事件",
    replay: "重新运行",
    notStarted: "等待运行",
    complete: "带证据交付",
    blocked: "进度丢失",
    recovered: "已从持久状态恢复",
    runSteps: [
      {
        label: "定义",
        withHarness:
          "验收条件把“完成”绑定到非负总额、回归覆盖和经过验证的 Pull Request。",
        withoutHarness:
          "任务仍是一种解释；模型可能优化一个看似合理的补丁，而不是真实结果。",
        requires: "contract",
      },
      {
        label: "观察",
        withHarness: "智能体沿仓库地图找到结账规则、测试和当前运行命令。",
        withoutHarness: "它从附近文件名和碰巧进入上下文的文档中猜测。",
        requires: "context",
      },
      {
        label: "行动",
        withHarness: "补丁和先失败的回归测试在隔离工作树中产生。",
        withoutHarness:
          "没有受控工具时只能建议补丁；工具过宽时影响范围又无法定义。",
        requires: "tools",
      },
      {
        label: "崩溃",
        withHarness:
          "沙箱消失，外部 Session 仍保存计划、补丁检查点和已完成事件。",
        withoutHarness:
          "唯一进度在中断进程里；下一次运行无法区分已完成工作与原有意图。",
        requires: "state",
      },
      {
        label: "恢复",
        withHarness:
          "干净沙箱被重建，运行从最后一个持久事件继续，并避免复制副作用。",
        withoutHarness:
          "智能体从头开始，可能重复修改，也无法安全重试外部动作。",
        requires: "recovery",
      },
      {
        label: "验证",
        withHarness:
          "回归测试、现有测试、浏览器结账、日志与静态规则形成独立证据。",
        withoutHarness: "生成者审查自己的补丁，把“看起来对”提升成“已完成”。",
        requires: "evals",
      },
      {
        label: "交付",
        withHarness:
          "证据通过后，受限权限只允许创建一个 Pull Request，并查询外部结果。",
        withoutHarness: "权限要么缺失，要么过宽；响应丢失时还可能重复创建。",
        requires: "permissions",
      },
    ],
    scenarioHeading: "多深的 Harness 才够？",
    scenarioDescription:
      "深度应该跟随持续时间、副作用、重复频率与失败成本，而不是潮流。",
    scenarioLabel: "选择场景",
    enough: "与风险相称的覆盖",
    missing: "此风险等级仍缺失",
    scenarios: {
      copy: {
        name: "一次性文案改写",
        task: "改写一个不含敏感信息、没有外部副作用的公开段落。",
        consequence: "人可以立即阅读完整输出。",
        recommendation:
          "清晰指令与人工阅读通常已经足够；生产 Harness 只会增加仪式，而没有明显降低风险。",
        required: ["contract", "context"],
      },
      coding: {
        name: "六小时编码任务",
        task: "实现跨文件功能、运行应用，并产出可评审的 Pull Request。",
        consequence: "上下文会变化，工具会改变仓库，崩溃可能抹去数小时工作。",
        recommendation: "使用隔离环境、持久进度、可执行验证、受限交付与恢复。",
        required: [
          "contract",
          "context",
          "tools",
          "state",
          "evals",
          "permissions",
          "recovery",
        ],
      },
      account: {
        name: "重复账户工作流",
        task: "每天读取发票、更新客户账户并发送通知。",
        consequence: "工作流重复运行，并对客户数据产生真实副作用。",
        recommendation:
          "使用完整 Harness，再加入幂等、可审计权限、确认、回归评估与持续监控。",
        required: [
          "contract",
          "context",
          "tools",
          "state",
          "evals",
          "permissions",
          "recovery",
        ],
      },
    },
    selectedLayer: "当前层",
    whyItMatters: "它带来什么",
    whenMissing: "缺失时怎样失败",
    distinction: "最关键的区分",
    distinctionBody:
      "Agent Framework 给你零件；Agent Harness 是你组装出的运行系统；Harness Engineering 是决定哪些保证应该放进上下文、工具、代码、评估器、权限和持久状态的实践。",
    layers: {
      contract: {
        name: "任务契约",
        short: "CONTRACT",
        role: "定义可观察结果、约束，以及宣布完成前必须出现的证据。",
        success: "系统知道要优化什么结果，也知道怎样判断完成。",
        failure: "流畅补丁可能满足字面要求，却错过真实业务结果。",
      },
      context: {
        name: "上下文地图",
        short: "CONTEXT",
        role: "选择相关知识，并指向版本化的权威来源。",
        success: "智能体不用淹没上下文，也能找到当前架构、领域规则和运行说明。",
        failure: "它从陈旧或邻近信息中猜测，甚至从未发现权威规则。",
      },
      tools: {
        name: "工具与沙箱",
        short: "TOOLS",
        role: "把意图变成在可读、隔离环境中的受限行动。",
        success: "智能体可以复现、编辑、运行、观察并归因失败。",
        failure: "它只能建议工作，或通过影响范围不明的宽泛工具行动。",
      },
      state: {
        name: "持久状态",
        short: "STATE",
        role: "把事件、进度、决定、产物与副作用保存到单次上下文之外。",
        success: "后续运行可以从事实继续，而不是重建记忆。",
        failure: "压缩或进程丢失会抹去已完成工作与计划工作之间的边界。",
      },
      evals: {
        name: "验证与评估",
        short: "VERIFY",
        role: "用确定性检查、校准评审与人类判断评价可观察结果。",
        success: "“完成”由环境中的可复现证据支持。",
        failure: "生成者成为自己宽松的裁判，把自信误认为正确。",
      },
      permissions: {
        name: "权限",
        short: "AUTHORITY",
        role: "只授予必要能力，并为后果重大的动作设置闸门。",
        success: "智能体拥有足够但有限的权限，影响范围受控，过程可审计。",
        failure: "它要么无力完成，要么权限过大；不可信内容可以重定向广泛权力。",
      },
      recovery: {
        name: "恢复与轨迹",
        short: "RECOVERY",
        role: "解释失败、重建可丢弃设施，并在不复制副作用的前提下继续。",
        success: "失败成为另一个状态转移，而不是一个丢失的任务。",
        failure: "“再试一次”可能重跑数小时工作，或复制外部动作。",
      },
    },
  },
};

const MISSION_COPY: Record<Locale, MissionCopy> = {
  en: {
    accessibleHeading:
      "What if artificial intelligence (AI) ran one Starship-class mission through two mission systems?",
    eyebrow: "01 · One vehicle, two mission systems",
    heading: "What if AI ran a Starship-class mission?",
    description:
      "Mission: deliver a payload to a specified orbit; if recovery conditions fail, enter a safe contingency and leave independently verifiable evidence.",
    noHarness: "Model only",
    withHarness: "Model + Harness",
    noHarnessMeta: "CAPABILITY WITHOUT MISSION CONTROL",
    withHarnessMeta: "CAPABILITY INSIDE MISSION CONTROL",
    clarification:
      "Conceptual demonstration inspired by public Starship flight-test and mission-control practices; not a reconstruction of SpaceX's internal software. Flight 13 is cited only for the planned objectives and timeline on its official page. The two observer icons abstract six V3 satellites listed there as modified with camera suites; they do not imply those objectives were completed. Both lanes use the same vehicle capability, geometry, and performance.",
    play: "Play mission",
    pause: "Pause",
    resume: "Resume",
    replay: "Replay",
    staticView: "Static view",
    loading: "Preparing 3D mission control…",
    unsupported:
      "3D is unavailable here. The same five comparisons remain available below.",
    finalConclusion:
      "A good Harness does not guarantee the vehicle will succeed. It makes errors visible, authority bounded, failure convergent, and results evidenced.",
    memoryLine:
      "Same vehicle. The difference is not capability; it is the mission system.",
    practiceLabel: "OFFICIAL PUBLIC SOURCES",
    synthesisLabel: "CONCEPTUAL ANALOGY",
    phases: {
      coordinates: {
        shortLabel: "Target",
        label: "01 · Target / flight corridor",
        narration:
          "“Put the payload up there” can produce a plausible route; a mission contract turns orbit, launch window, payload, and safety bounds into a decidable target.",
        noState: "TARGET VAGUE",
        noCopy:
          "A plausible route reaches a neighboring orbit, but not the contracted one.",
        yesState: "TARGET DECIDABLE",
        yesCopy:
          "Orbit, window, payload, and return zone lock before the corridor opens.",
        sources: [
          "openai-harness",
          "anthropic-long",
          "spacex-flight-13",
          "nasa-mission-control",
        ],
      },
      permission: {
        shortLabel: "Permission",
        label: "02 · Permission / staged authority",
        narration:
          "Permission to ignite is not permission to operate everything at once; a Harness authorizes only the current phase, object, and time window.",
        noState: "AUTHORITY TOO BROAD",
        noCopy:
          "A wildcard unlocks propellant, ignition, clamps, and payload together.",
        yesState: "AUTHORITY BOUNDED",
        yesCopy:
          "Scoped tokens sequence propellant, ignition, and clamps while payload stays locked.",
        sources: [
          "openai-safety",
          "anthropic-sandbox",
          "spacex-flight-5",
          "faa-starship",
        ],
      },
      handshake: {
        shortLabel: "Handshake",
        label: "03 · Handshake / hot staging",
        narration:
          "Sending the command is only half the job; engine state, separation confirmation, and the next phase must return through the protocol.",
        noState: "ASSUMED EXECUTED",
        noCopy:
          "Separation occurs, but no receipt returns; the controller assumes success too early and repeats the command.",
        yesState: "TOOLS REPLY",
        yesCopy:
          "Engine-ready and separation acknowledgements return before the mission advances.",
        sources: [
          "openai-harness",
          "anthropic-evaluator",
          "spacex-flight-13",
          "nasa-mission-control",
        ],
      },
      recovery: {
        shortLabel: "Recovery",
        label: "04 · Recovery / NO-GO → DIVERT",
        narration:
          "Recovery does not rewind the physical world; it preserves current state, rejects a stale plan, and enters a predefined safe path.",
        noState: "STALE PLAN CONTINUES",
        noCopy:
          "The controller follows stale tower state and reaches a closed catch envelope.",
        yesState: "FAILURE CONVERGES",
        yesCopy:
          "A NO-GO reply preserves state and opens the authorized offshore divert.",
        sources: [
          "openai-durable",
          "anthropic-managed",
          "spacex-flight-6",
          "nasa-mission-control",
        ],
      },
      verification: {
        shortLabel: "Verification",
        label: "05 · Verification / external evidence",
        narration:
          "A Harness does not promise a perfect mission; independent observers test the opening contract as ORBIT / TRAJECTORY, PAYLOAD, CATCH NO-GO, and DIVERT PASS.",
        noState: "SELF-REPORTED SUCCESS",
        noCopy:
          "The vehicle's own DONE check remains bright while external rows are missing.",
        yesState: "COMPLETION HAS EVIDENCE",
        yesCopy:
          "Independent observers resolve ORBIT / TRAJECTORY, PAYLOAD, CATCH NO-GO, and DIVERT PASS.",
        sources: [
          "anthropic-evaluator",
          "anthropic-evals",
          "spacex-flight-13",
          "faa-starship",
        ],
      },
    },
  },
  zh: {
    accessibleHeading:
      "如果人工智能（Artificial Intelligence，AI）通过两套任务系统执行一场星舰级任务",
    eyebrow: "01 · 同一枚飞船，两套任务系统",
    heading: "如果 AI 来执行一场星舰级任务",
    description:
      "任务：将载荷送入指定轨道；若回收条件不满足，进入安全预案，并留下可独立验收的证据。",
    noHarness: "只有模型",
    withHarness: "模型 + Harness",
    noHarnessMeta: "有能力，没有任务控制",
    withHarnessMeta: "能力运行在任务控制内",
    clarification:
      "概念演示：借用公开的 Starship 试飞与航天任务控制作为隐喻，并非 SpaceX 实际软件架构或产品复刻。Flight 13 仅作为其官方页面所列 planned objectives / timeline 的参考；画面中的两颗观察卫星抽象代表页面所列六颗配备相机组件的 V3 卫星，不表示这些目标已经完成。两侧飞船的能力、几何与性能完全相同。",
    play: "播放任务",
    pause: "暂停",
    resume: "继续",
    replay: "重播",
    staticView: "静态浏览",
    loading: "正在准备 3D 任务控制…",
    unsupported: "当前无法运行 3D；下方仍可完整查看五组对比。",
    finalConclusion:
      "好的 Harness 不保证飞船一定成功。它让错误被看见、权限被限制、失败可收敛、结果有证据。",
    memoryLine: "同一枚飞船。差别不是能力，而是任务系统。",
    practiceLabel: "官方公开来源",
    synthesisLabel: "概念类比",
    phases: {
      coordinates: {
        shortLabel: "目标",
        label: "01 · 目标 / 飞行走廊",
        narration:
          "一句“把载荷送上去”可以产生合理路线；任务契约把轨道、时间窗、载荷与安全边界变成可判定目标。",
        noState: "目标模糊",
        noCopy: "一条合理路线抵达邻近轨道，但不是契约指定轨道。",
        yesState: "目标可判定",
        yesCopy: "轨道、时间窗、载荷和返回区锁定后，飞行走廊才打开。",
        sources: [
          "openai-harness",
          "anthropic-long",
          "spacex-flight-13",
          "nasa-mission-control",
        ],
      },
      permission: {
        shortLabel: "权限",
        label: "02 · 权限 / 分阶段授权",
        narration:
          "能点火不等于能同时操作所有系统；Harness 只授权当前阶段、当前对象和当前时间窗。",
        noState: "权限过宽",
        noCopy: "通配授权同时解锁推进剂、点火、夹臂和载荷舱。",
        yesState: "权限有边界",
        yesCopy: "作用域令牌依次授权推进剂、点火和夹臂，载荷舱继续锁定。",
        sources: [
          "openai-safety",
          "anthropic-sandbox",
          "spacex-flight-5",
          "faa-starship",
        ],
      },
      handshake: {
        shortLabel: "握手",
        label: "03 · 握手 / 热分级",
        narration:
          "命令发出去只完成了一半；点火状态、分离确认与下一阶段必须沿协议返回执行循环。",
        noState: "默认已执行",
        noCopy:
          "分离动作已经发生，但没有回执返回；控制器过早默认成功并重复发送。",
        yesState: "工具会回话",
        yesCopy: "发动机就绪和分离确认返回后，任务才进入下一阶段。",
        sources: [
          "openai-harness",
          "anthropic-evaluator",
          "spacex-flight-13",
          "nasa-mission-control",
        ],
      },
      recovery: {
        shortLabel: "恢复",
        label: "04 · 恢复 / NO-GO → DIVERT",
        narration:
          "恢复不是让物理世界回滚；它是保留当前状态、拒绝过期计划，并进入预先定义的安全路径。",
        noState: "继续旧计划",
        noCopy: "控制器仍读取过期的塔台状态，继续进入关闭的捕获包线。",
        yesState: "失败可收敛",
        yesCopy: "NO-GO 回执保留当前状态，并打开预授权的海上改道。",
        sources: [
          "openai-durable",
          "anthropic-managed",
          "spacex-flight-6",
          "nasa-mission-control",
        ],
      },
      verification: {
        shortLabel: "验收",
        label: "05 · 验收 / 外部证据",
        narration:
          "Harness 不保证每次任务完美；独立观察者把第一幕契约逐项验收为 ORBIT / TRAJECTORY、PAYLOAD、CATCH NO-GO 与 DIVERT PASS。",
        noState: "自报成功",
        noCopy: "飞船自己的 DONE 保持亮起，外部证据行却仍然缺失。",
        yesState: "完成有证据",
        yesCopy:
          "独立观察者给出 ORBIT / TRAJECTORY、PAYLOAD、CATCH NO-GO 和 DIVERT PASS。",
        sources: [
          "anthropic-evaluator",
          "anthropic-evals",
          "spacex-flight-13",
          "faa-starship",
        ],
      },
    },
  },
};

const copy = computed(() => COPY[props.locale]);
const missionCopy = computed(() => MISSION_COPY[props.locale]);

const enabled = reactive<Record<LayerKey, boolean>>({
  contract: true,
  context: true,
  tools: true,
  state: false,
  evals: true,
  permissions: false,
  recovery: false,
});

const selectedLayer = ref<LayerKey>("contract");
const activePreset = ref<PresetKey>("prototype");
const activeScenario = ref<ScenarioKey>("coding");
const comparisonPhase = ref<ComparisonPhase>(comparisonPhases[0]);
const missionHost = ref<HTMLElement | null>(null);
const missionCanvas = ref<HTMLCanvasElement | null>(null);
const missionPlayback = ref<MissionPlayback>("idle");
const comparisonProgress = ref(0);
const comparisonCompleted = ref(false);
const missionStageSettled = ref(true);
const missionSceneReady = ref(false);
const missionRuntimeFailed = ref(false);
const prefersReducedMotion = ref(false);
let reducedMotionQuery: MediaQueryList | null = null;
let missionController: MissionController | null = null;
let runtimeGeneration = 0;
let componentUnmounted = false;

const enabledCount = computed(
  () => layerOrder.filter((key) => enabled[key]).length,
);
const coverage = computed(() =>
  Math.round((enabledCount.value / layerOrder.length) * 100),
);
const evidenceStrength = computed(() => {
  const evidenceLayers: LayerKey[] = ["contract", "state", "evals", "recovery"];
  const score = evidenceLayers.filter((key) => enabled[key]).length;
  return score >= 4
    ? copy.value.strong
    : score >= 2
      ? copy.value.partial
      : copy.value.weak;
});
const riskLevel = computed(() => {
  if (!enabled.permissions || !enabled.tools) return copy.value.high;
  if (!enabled.state || !enabled.evals || !enabled.recovery)
    return copy.value.medium;
  return copy.value.low;
});
const isVerifiable = computed(
  () =>
    enabled.contract && enabled.evals && enabled.tools && enabled.permissions,
);
const selectedCopy = computed(() => copy.value.layers[selectedLayer.value]);
const scenario = computed(() => copy.value.scenarios[activeScenario.value]);
const scenarioMissing = computed(() =>
  scenario.value.required.filter((key) => !enabled[key]),
);
const comparisonIndex = computed(() =>
  comparisonPhases.indexOf(comparisonPhase.value),
);
const comparisonFrame = computed(
  () => missionCopy.value.phases[comparisonPhase.value],
);
const comparisonPhaseSources = computed(() =>
  comparisonFrame.value.sources.map((key) => comparisonSources[key]),
);
const missionStaticMode = computed(
  () =>
    prefersReducedMotion.value ||
    missionRuntimeFailed.value ||
    !missionSceneReady.value ||
    missionController === null,
);
const comparisonControlLabel = computed(() => {
  if (missionStaticMode.value) return missionCopy.value.staticView;
  if (missionPlayback.value === "paused") return missionCopy.value.resume;
  if (missionPlayback.value === "playing") return missionCopy.value.pause;
  if (missionPlayback.value === "complete" || comparisonCompleted.value)
    return missionCopy.value.replay;
  return missionCopy.value.play;
});
const missionHasLiveScene = computed(
  () =>
    missionSceneReady.value &&
    !missionRuntimeFailed.value &&
    !prefersReducedMotion.value,
);

function setPreset(preset: PresetKey) {
  activePreset.value = preset;
  const presets: Record<PresetKey, LayerKey[]> = {
    model: [],
    prototype: ["contract", "context", "tools", "evals"],
    production: [...layerOrder],
  };
  for (const key of layerOrder) enabled[key] = presets[preset].includes(key);
}

function toggleLayer(key: LayerKey) {
  enabled[key] = !enabled[key];
  selectedLayer.value = key;
  activePreset.value = "prototype";
}

function isComparisonPhase(value: string): value is ComparisonPhase {
  return comparisonPhases.includes(value as ComparisonPhase);
}

function applyMissionState(state: MissionControllerState) {
  if (!isComparisonPhase(state.stage)) return;
  comparisonPhase.value = state.stage;
  missionPlayback.value = state.playback;
  comparisonProgress.value = Math.min(1, Math.max(0, state.progress));
  missionStageSettled.value = state.stageSettled;
  comparisonCompleted.value = state.completed;
}

async function initializeMissionRuntime(generation: number) {
  try {
    await import("./harness-engineering-three.runtime.js");
    if (
      componentUnmounted ||
      generation !== runtimeGeneration ||
      prefersReducedMotion.value
    )
      return;

    const runtime = (
      globalThis as typeof globalThis & {
        HarnessMission3D?: HarnessMissionRuntime;
      }
    ).HarnessMission3D;
    const canvas = missionCanvas.value;
    const host = missionHost.value;
    if (!runtime || !canvas || !host)
      throw new Error("HarnessMission3D did not initialize.");

    missionController?.destroy();
    missionController = runtime.create({
      canvas,
      host,
      initialStage: comparisonPhase.value,
      reducedMotion: false,
      locale: props.locale,
      onReady: () => {
        if (componentUnmounted || generation !== runtimeGeneration) return;
        missionRuntimeFailed.value = false;
        missionSceneReady.value = true;
      },
      onStateChange: (state) => {
        if (componentUnmounted || generation !== runtimeGeneration) return;
        applyMissionState(state);
      },
      onUnsupported: () => {
        if (componentUnmounted || generation !== runtimeGeneration) return;
        missionSceneReady.value = false;
        missionRuntimeFailed.value = true;
        missionPlayback.value = "idle";
      },
    });
    applyMissionState(missionController.getState());
  } catch {
    if (componentUnmounted || generation !== runtimeGeneration) return;
    missionController = null;
    missionSceneReady.value = false;
    missionRuntimeFailed.value = true;
    missionPlayback.value = "idle";
  }
}

function selectComparisonPhase(
  phase: ComparisonPhase,
  reason: "pointer" | "keyboard" | "programmatic",
) {
  comparisonPhase.value = phase;
  comparisonProgress.value = missionStaticMode.value
    ? comparisonPhases.indexOf(phase) / (comparisonPhases.length - 1)
    : 0;
  comparisonCompleted.value = false;
  missionPlayback.value = "idle";
  missionStageSettled.value = true;

  if (!missionController || missionStaticMode.value) return;
  missionController.select(phase, {
    animate: reason === "pointer",
    autoplay: false,
    reason,
  });
}

function activateComparisonPhase(event: MouseEvent, phase: ComparisonPhase) {
  selectComparisonPhase(phase, event.detail === 0 ? "keyboard" : "pointer");
}

function toggleComparisonPlayback() {
  if (!missionController || missionStaticMode.value) return;

  if (missionPlayback.value === "playing") {
    missionController.pause();
    return;
  }
  if (missionPlayback.value === "paused") {
    missionController.resume();
    return;
  }

  comparisonCompleted.value = false;
  missionController.play({ from: comparisonPhases[0] });
}

function handleComparisonKeydown(event: KeyboardEvent) {
  const keyMap: Record<string, number> = {
    ArrowLeft: Math.max(0, comparisonIndex.value - 1),
    ArrowUp: Math.max(0, comparisonIndex.value - 1),
    ArrowRight: Math.min(
      comparisonPhases.length - 1,
      comparisonIndex.value + 1,
    ),
    ArrowDown: Math.min(comparisonPhases.length - 1, comparisonIndex.value + 1),
    Home: 0,
    End: comparisonPhases.length - 1,
  };
  if (!(event.key in keyMap)) return;

  event.preventDefault();
  const nextIndex = keyMap[event.key];
  selectComparisonPhase(comparisonPhases[nextIndex], "keyboard");
  const nav = event.currentTarget as HTMLElement;
  const buttons = nav.querySelectorAll<HTMLButtonElement>(
    "[data-mission-stage]",
  );
  buttons[nextIndex]?.focus();
}

function handleReducedMotionChange(event: MediaQueryListEvent) {
  prefersReducedMotion.value = event.matches;
  missionController?.setReducedMotion(event.matches);

  if (event.matches) {
    missionSceneReady.value = false;
    missionPlayback.value = "idle";
    return;
  }

  if (missionController) {
    missionSceneReady.value = true;
    missionController.select(comparisonPhase.value, {
      animate: false,
      autoplay: false,
      reason: "programmatic",
    });
    return;
  }

  missionRuntimeFailed.value = false;
  const generation = ++runtimeGeneration;
  void initializeMissionRuntime(generation);
}

onMounted(() => {
  componentUnmounted = false;
  reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  prefersReducedMotion.value = reducedMotionQuery.matches;
  reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

  if (!prefersReducedMotion.value) {
    const generation = ++runtimeGeneration;
    void initializeMissionRuntime(generation);
  }
});

onBeforeUnmount(() => {
  componentUnmounted = true;
  runtimeGeneration += 1;
  reducedMotionQuery?.removeEventListener("change", handleReducedMotionChange);
  missionController?.destroy();
  missionController = null;
});
</script>

<template>
  <section class="harness-lab">
    <header class="lab-header">
      <div>
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h2>{{ copy.title }}</h2>
        <p class="lede">{{ copy.description }}</p>
      </div>
    </header>

    <section
      class="comparison-panel relay-panel"
      :class="{
        'has-live-scene': missionHasLiveScene,
        'is-playing': missionPlayback === 'playing',
        'is-paused': missionPlayback === 'paused',
        'is-complete': comparisonCompleted,
      }"
      :data-phase="comparisonPhase"
      :data-reduced-motion="prefersReducedMotion"
      aria-labelledby="comparison-title"
    >
      <header class="comparison-head">
        <div>
          <p class="section-index">{{ missionCopy.eyebrow }}</p>
          <h3 id="comparison-title" :aria-label="missionCopy.accessibleHeading">
            {{ missionCopy.heading }}
          </h3>
          <p>{{ missionCopy.description }}</p>
        </div>
        <button
          type="button"
          class="comparison-control primary"
          :aria-pressed="missionPlayback === 'playing'"
          :disabled="missionStaticMode"
          @click="toggleComparisonPlayback"
        >
          {{ comparisonControlLabel }}
        </button>
      </header>

      <nav
        class="relay-steps"
        :aria-label="
          props.locale === 'zh' ? '五个任务阶段' : 'Five mission stages'
        "
        @keydown="handleComparisonKeydown"
      >
        <button
          v-for="(phase, index) in comparisonPhases"
          :key="phase"
          type="button"
          data-mission-stage
          :class="{
            reached: index <= comparisonIndex,
            current: index === comparisonIndex,
            settled: index === comparisonIndex && missionStageSettled,
          }"
          :aria-label="
            String(index + 1).padStart(2, '0') +
            ' ' +
            missionCopy.phases[phase].shortLabel
          "
          :aria-current="index === comparisonIndex ? 'step' : undefined"
          @click="activateComparisonPhase($event, phase)"
        >
          <span>{{ String(index + 1).padStart(2, "0") }}</span>
          <strong>{{ missionCopy.phases[phase].shortLabel }}</strong>
        </button>
      </nav>

      <div
        class="mission-progress"
        role="progressbar"
        :aria-label="
          props.locale === 'zh' ? '完整任务进度' : 'Full mission progress'
        "
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="Math.round(comparisonProgress * 100)"
      >
        <i :style="{ transform: 'scaleX(' + comparisonProgress + ')' }"></i>
      </div>

      <div
        ref="missionHost"
        class="mission-viewport"
        :class="{ 'show-fallback': !missionHasLiveScene }"
      >
        <canvas
          ref="missionCanvas"
          class="mission-canvas"
          aria-hidden="true"
        ></canvas>

        <p
          v-if="!prefersReducedMotion && !missionSceneReady"
          class="mission-runtime-note"
          aria-live="polite"
        >
          {{
            missionRuntimeFailed ? missionCopy.unsupported : missionCopy.loading
          }}
        </p>

        <div class="mission-overlay-grid">
          <article class="mission-overlay-bay without-harness">
            <header>
              <strong>{{ missionCopy.noHarness }}</strong>
            </header>
            <footer>
              <strong>{{ comparisonFrame.noState }}</strong>
            </footer>
          </article>

          <article class="mission-overlay-bay with-harness">
            <header>
              <strong>{{ missionCopy.withHarness }}</strong>
            </header>
            <footer>
              <strong>{{ comparisonFrame.yesState }}</strong>
            </footer>
          </article>
        </div>

        <div
          class="mission-fallback"
          :aria-hidden="missionHasLiveScene ? 'true' : undefined"
        >
          <article
            v-for="phase in comparisonPhases"
            v-show="phase === comparisonPhase"
            :key="phase"
            class="fallback-stage"
            :class="'fallback-' + phase"
          >
            <h4 class="sr-only">{{ missionCopy.phases[phase].label }}</h4>
            <div class="fallback-pair">
              <div
                class="fallback-diagram fallback-mission without-harness"
                :class="[
                  'mission-' + phase,
                  phase === 'coordinates'
                    ? 'vague-route'
                    : phase === 'permission'
                      ? 'wildcard-authority'
                      : phase === 'handshake'
                        ? 'assumed-executed'
                        : phase === 'recovery'
                          ? 'stale-plan'
                          : 'self-reported',
                ]"
                role="img"
                :aria-label="
                  missionCopy.noHarness +
                  ': ' +
                  missionCopy.phases[phase].noCopy
                "
              >
                <template v-if="phase === 'coordinates'">
                  <i class="static-earth"></i>
                  <i class="static-orbit orbit-near"></i>
                  <i class="static-orbit orbit-target"></i>
                  <i class="static-route"></i>
                  <i class="static-rocket"></i>
                  <b class="static-command">PAYLOAD → SPACE</b>
                  <b class="static-symbol">?</b>
                </template>
                <template v-else-if="phase === 'permission'">
                  <i class="static-pad"></i>
                  <i class="static-tower"></i>
                  <i class="static-rocket on-pad"></i>
                  <i class="static-control control-propellant">PROP</i>
                  <i class="static-control control-ignition">IGN</i>
                  <i class="static-control control-clamps">CLAMP</i>
                  <i class="static-control control-payload">PAYLOAD</i>
                  <b class="wildcard-token">*</b>
                </template>
                <template v-else-if="phase === 'handshake'">
                  <i class="static-rocket ascent-stack"></i>
                  <i class="static-interstage"></i>
                  <i class="signal-arrow command-out">SEP</i>
                  <i class="signal-arrow repeat-out">SEP</i>
                  <b class="controller-node">CTRL</b>
                </template>
                <template v-else-if="phase === 'recovery'">
                  <i class="static-tower catch-tower"></i>
                  <i class="tower-health">NO-GO</i>
                  <i class="return-route"></i>
                  <i class="static-rocket returning"></i>
                  <i class="rough-landing">~</i>
                  <b class="stale-state">STALE: GO</b>
                </template>
                <template v-else>
                  <i class="static-rocket review-rocket"></i>
                  <b class="done-badge">DONE ✓</b>
                  <i class="evidence-row row-orbit">ORBIT / TRAJECTORY —</i>
                  <i class="evidence-row row-payload">PAYLOAD —</i>
                  <i class="evidence-row row-catch">CATCH —</i>
                  <i class="evidence-row row-divert">DIVERT —</i>
                </template>
              </div>
              <div
                class="fallback-diagram fallback-mission with-harness"
                :class="[
                  'mission-' + phase,
                  phase === 'coordinates'
                    ? 'locked-route'
                    : phase === 'permission'
                      ? 'scoped-authority'
                      : phase === 'handshake'
                        ? 'protocol-closed'
                        : phase === 'recovery'
                          ? 'safe-divert'
                          : 'evidence-backed',
                ]"
                role="img"
                :aria-label="
                  missionCopy.withHarness +
                  ': ' +
                  missionCopy.phases[phase].yesCopy
                "
              >
                <template v-if="phase === 'coordinates'">
                  <i class="static-earth"></i>
                  <i class="static-orbit orbit-near"></i>
                  <i class="static-orbit orbit-target"></i>
                  <i class="static-route"></i>
                  <i class="static-rocket"></i>
                  <b class="static-spec spec-orbit">ORBIT</b>
                  <b class="static-spec spec-window">WINDOW</b>
                  <b class="static-spec spec-payload">PAYLOAD</b>
                  <b class="static-spec spec-return">RETURN</b>
                  <i class="static-lock"></i>
                </template>
                <template v-else-if="phase === 'permission'">
                  <i class="static-pad"></i>
                  <i class="static-tower"></i>
                  <i class="static-rocket on-pad"></i>
                  <i class="static-control control-propellant">PROP</i>
                  <i class="static-control control-ignition">IGN</i>
                  <i class="static-control control-clamps">CLAMP</i>
                  <i class="static-control control-payload">PAYLOAD</i>
                  <b class="scope-token token-a">1</b>
                  <b class="scope-token token-b">2</b>
                  <b class="scope-token token-c">3</b>
                </template>
                <template v-else-if="phase === 'handshake'">
                  <i class="static-rocket ascent-stack"></i>
                  <i class="static-interstage"></i>
                  <i class="signal-arrow command-out">SEP</i>
                  <i class="signal-arrow ack-ready">READY</i>
                  <i class="signal-arrow ack-separation">ACK</i>
                  <b class="controller-node">CTRL</b>
                </template>
                <template v-else-if="phase === 'recovery'">
                  <i class="static-tower catch-tower"></i>
                  <i class="tower-health">NO-GO</i>
                  <i class="return-route"></i>
                  <i class="divert-route"></i>
                  <i class="static-rocket returning"></i>
                  <i class="offshore-zone">DIVERT</i>
                  <b class="retained-state">STATE</b>
                </template>
                <template v-else>
                  <i class="static-rocket review-rocket"></i>
                  <i class="observer-satellite observer-a"></i>
                  <i class="observer-satellite observer-b"></i>
                  <i class="radar-sweep"></i>
                  <i class="evidence-row row-orbit"
                    >ORBIT / TRAJECTORY · PASS</i
                  >
                  <i class="evidence-row row-payload">PAYLOAD · PASS</i>
                  <i class="evidence-row row-catch">CATCH · NO-GO</i>
                  <i class="evidence-row row-divert">DIVERT · PASS</i>
                </template>
              </div>
            </div>
          </article>
        </div>
      </div>

      <aside class="relay-caption" aria-live="polite" aria-atomic="true">
        <div>
          <strong>{{ comparisonFrame.label }}</strong>
          <p class="relay-caption-outcomes">
            {{ missionCopy.noHarness }}: {{ comparisonFrame.noState }} ·
            {{ missionCopy.withHarness }}: {{ comparisonFrame.yesState }}
          </p>
          <p>{{ comparisonFrame.narration }}</p>
        </div>
      </aside>

      <p
        v-if="comparisonCompleted"
        class="mission-conclusion"
        aria-live="polite"
      >
        <strong>{{ missionCopy.finalConclusion }}</strong>
        <span>{{ missionCopy.memoryLine }}</span>
      </p>

      <footer class="relay-sources">
        <span>
          {{ missionCopy.practiceLabel }} ·
          {{ missionCopy.synthesisLabel }}
        </span>
        <div>
          <a
            v-for="source in comparisonPhaseSources"
            :key="source.url"
            :href="source.url"
            target="_blank"
            rel="noreferrer"
            :title="source.title"
          >
            {{ source.organization }} · {{ source.label[props.locale] }}
            <span class="sr-only"> — {{ source.title }}</span>
          </a>
        </div>
      </footer>

      <p class="comparison-clarification">
        {{ missionCopy.clarification }}
      </p>
    </section>
    <nav class="preset-row" aria-label="Harness presets">
      <button
        v-for="preset in ['model', 'prototype', 'production'] as PresetKey[]"
        :key="preset"
        type="button"
        :class="{ active: activePreset === preset }"
        :aria-pressed="activePreset === preset"
        @click="setPreset(preset)"
      >
        <strong>{{ copy.presets[preset] }}</strong>
        <span>{{ copy.presetHelp[preset] }}</span>
      </button>
    </nav>

    <section class="builder" aria-labelledby="builder-title">
      <div class="builder-head">
        <div>
          <h3 id="builder-title">{{ copy.layersHeading }}</h3>
          <p>{{ copy.layersDescription }}</p>
        </div>
        <div class="coverage-chip">
          <span>{{ copy.coverage }}</span>
          <strong>{{ coverage }}%</strong>
        </div>
      </div>

      <div class="builder-grid">
        <div class="layer-controls">
          <button
            v-for="key in layerOrder"
            :key="key"
            type="button"
            class="layer-button"
            :class="{ enabled: enabled[key], selected: selectedLayer === key }"
            :aria-pressed="enabled[key]"
            @click="toggleLayer(key)"
          >
            <span class="layer-index">{{
              String(layerOrder.indexOf(key) + 1).padStart(2, "0")
            }}</span>
            <span class="layer-name">
              <strong>{{ copy.layers[key].name }}</strong>
              <small>{{ copy.layers[key].short }}</small>
            </span>
            <span class="toggle-state">{{
              enabled[key] ? copy.on : copy.off
            }}</span>
          </button>
        </div>

        <div
          class="system-map"
          :class="{ complete: enabledCount === layerOrder.length }"
        >
          <div class="rail-label input-label">INTENT</div>
          <div class="system-rail" aria-hidden="true">
            <span
              v-for="key in layerOrder"
              :key="key"
              :class="{ active: enabled[key] }"
            ></span>
          </div>
          <div class="model-core">
            <span>{{ copy.model }}</span>
            <small>{{ copy.modelRole }}</small>
          </div>
          <div class="layer-rings" aria-label="Active harness layers">
            <div
              v-for="key in layerOrder"
              :key="key"
              class="ring"
              :class="{ active: enabled[key], selected: selectedLayer === key }"
              @click="selectedLayer = key"
            >
              <span>{{ copy.layers[key].short }}</span>
            </div>
          </div>
          <div class="output-node" :class="{ verified: isVerifiable }">
            <span>{{ copy.output }}</span>
            <strong>{{
              isVerifiable ? copy.verifiable : copy.plausible
            }}</strong>
          </div>
        </div>

        <aside class="layer-detail" aria-live="polite">
          <span class="detail-label">{{ copy.selectedLayer }}</span>
          <h4>{{ selectedCopy.name }}</h4>
          <div>
            <strong>{{ copy.whyItMatters }}</strong>
            <p>{{ selectedCopy.role }}</p>
            <p class="success-note">{{ selectedCopy.success }}</p>
          </div>
          <div>
            <strong>{{ copy.whenMissing }}</strong>
            <p class="failure-note">{{ selectedCopy.failure }}</p>
          </div>
        </aside>
      </div>

      <div class="metrics" aria-live="polite">
        <article>
          <span>{{ copy.coverage }}</span>
          <strong>{{ enabledCount }} / {{ layerOrder.length }}</strong>
        </article>
        <article>
          <span>{{ copy.risk }}</span>
          <strong>{{ riskLevel }}</strong>
        </article>
        <article>
          <span>{{ copy.evidence }}</span>
          <strong>{{ evidenceStrength }}</strong>
        </article>
      </div>
    </section>

    <section class="scenario-panel" aria-labelledby="scenario-title">
      <header>
        <p class="section-index">03 · PROPORTIONALITY</p>
        <h3 id="scenario-title">{{ copy.scenarioHeading }}</h3>
        <p>{{ copy.scenarioDescription }}</p>
      </header>

      <div
        class="scenario-tabs"
        role="tablist"
        :aria-label="copy.scenarioLabel"
      >
        <button
          v-for="key in ['copy', 'coding', 'account'] as ScenarioKey[]"
          :key="key"
          type="button"
          role="tab"
          :aria-selected="activeScenario === key"
          :class="{ active: activeScenario === key }"
          @click="activeScenario = key"
        >
          {{ copy.scenarios[key].name }}
        </button>
      </div>

      <div class="scenario-card">
        <div class="scenario-copy">
          <span>{{ scenario.name }}</span>
          <h4>{{ scenario.task }}</h4>
          <p>{{ scenario.consequence }}</p>
          <p class="recommendation">{{ scenario.recommendation }}</p>
        </div>
        <div class="scenario-fit" aria-live="polite">
          <span>{{
            scenarioMissing.length === 0 ? copy.enough : copy.missing
          }}</span>
          <strong
            >{{ scenario.required.length - scenarioMissing.length }} /
            {{ scenario.required.length }}</strong
          >
          <div class="fit-bar" aria-hidden="true">
            <i
              :style="{
                width: `${((scenario.required.length - scenarioMissing.length) / scenario.required.length) * 100}%`,
              }"
            ></i>
          </div>
          <div v-if="scenarioMissing.length" class="missing-list">
            <button
              v-for="key in scenarioMissing"
              :key="key"
              type="button"
              @click="toggleLayer(key)"
            >
              + {{ copy.layers[key].name }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <aside class="distinction">
      <span>{{ copy.distinction }}</span>
      <p>{{ copy.distinctionBody }}</p>
    </aside>
  </section>
</template>

<style scoped>
.harness-lab {
  --lab-line: color-mix(in srgb, var(--foreground) 18%, transparent);
  --lab-soft: color-mix(in srgb, var(--secondary) 72%, var(--card));
  --orange: #ff735a;
  --violet: #7567f6;
  --lime: #d8ff68;
  --blue: #84d8ff;
  --motion-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --motion-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --motion-fast: 180ms;
  --motion-step: 240ms;
  --motion-travel: 480ms;
  --motion-stagger: 60ms;
  overflow: hidden;
  border: 1px solid var(--lab-line);
  border-radius: 1.6rem;
  color: var(--foreground);
  background: var(--background);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.lab-header {
  display: grid;
  gap: 1.2rem;
  padding: clamp(1.25rem, 4vw, 2.6rem);
  border-bottom: 1px solid var(--lab-line);
  background:
    radial-gradient(
      circle at 92% 0%,
      color-mix(in srgb, var(--violet) 26%, transparent),
      transparent 34%
    ),
    var(--card);
}

.eyebrow,
.section-index,
.task-card span,
.detail-label,
.comparison-task span,
.lane-label span,
.comparison-model span,
.artifact-state,
.comparison-output > span,
.scenario-copy > span,
.scenario-fit > span {
  margin: 0;
  color: var(--orange);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.lab-header h2 {
  max-width: 14ch;
  margin: 0.65rem 0 0;
  font-size: clamp(2rem, 6vw, 4.5rem);
  line-height: 0.94;
  letter-spacing: -0.065em;
}

.lede {
  max-width: 48rem;
  margin: 1rem 0 0;
  color: var(--muted-foreground);
  font-size: clamp(0.9rem, 2vw, 1.08rem);
  line-height: 1.65;
}

.task-card {
  align-self: end;
  padding: 1.05rem;
  border: 1px solid var(--lab-line);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--lime) 24%, var(--card));
}

.task-card strong {
  display: block;
  margin-top: 0.55rem;
  font-size: 0.88rem;
  line-height: 1.45;
}

.preset-row {
  display: grid;
  gap: 1px;
  padding: 1px 0;
  background: var(--lab-line);
}

.preset-row button {
  min-width: 0;
  padding: 1rem;
  border: 0;
  color: var(--foreground);
  background: var(--card);
  text-align: left;
  cursor: pointer;
}

.preset-row button:hover,
.preset-row button:focus-visible,
.preset-row button.active {
  outline: none;
  background: color-mix(in srgb, var(--violet) 16%, var(--card));
}

.preset-row button.active {
  box-shadow: inset 0 -0.22rem 0 var(--violet);
}

.preset-row strong,
.preset-row span {
  display: block;
}

.preset-row strong {
  font-size: 0.78rem;
}

.preset-row span {
  margin-top: 0.35rem;
  color: var(--muted-foreground);
  font-size: 0.66rem;
  line-height: 1.4;
}

.builder,
.scenario-panel {
  padding: clamp(1.1rem, 4vw, 2.2rem);
  border-bottom: 1px solid var(--lab-line);
}

.builder-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.builder-head h3,
.scenario-panel h3 {
  margin: 0;
  font-size: clamp(1.25rem, 3vw, 2rem);
  letter-spacing: -0.04em;
}

.builder-head p,
.scenario-panel header > p:not(.section-index) {
  max-width: 45rem;
  margin: 0.55rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.78rem;
  line-height: 1.55;
}

.coverage-chip {
  flex: 0 0 auto;
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--lab-line);
  border-radius: 0.9rem;
  background: var(--card);
}

.coverage-chip span,
.coverage-chip strong {
  display: block;
  text-align: right;
}

.coverage-chip span {
  color: var(--muted-foreground);
  font-size: 0.6rem;
}

.coverage-chip strong {
  margin-top: 0.2rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 1.15rem;
}

.builder-grid {
  display: grid;
  gap: 1rem;
  margin-top: 1.25rem;
}

.layer-controls {
  display: grid;
  gap: 0.5rem;
}

.layer-button {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.72rem;
  border: 1px solid var(--lab-line);
  border-radius: 0.8rem;
  color: var(--foreground);
  background: var(--card);
  text-align: left;
  cursor: pointer;
}

.layer-button:hover,
.layer-button:focus-visible,
.layer-button.selected {
  outline: none;
  border-color: color-mix(in srgb, var(--violet) 70%, var(--lab-line));
}

.layer-button.enabled {
  background: color-mix(in srgb, var(--lime) 16%, var(--card));
}

.layer-index {
  color: var(--muted-foreground);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.62rem;
}

.layer-name strong,
.layer-name small {
  display: block;
}

.layer-name strong {
  font-size: 0.72rem;
}

.layer-name small {
  margin-top: 0.14rem;
  color: var(--muted-foreground);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.52rem;
  letter-spacing: 0.08em;
}

.toggle-state {
  padding: 0.3rem 0.46rem;
  border-radius: 99px;
  color: var(--muted-foreground);
  background: var(--lab-soft);
  font-size: 0.55rem;
  font-weight: 750;
}

.enabled .toggle-state {
  color: var(--foreground);
  background: var(--lime);
}

.system-map {
  position: relative;
  min-height: 30rem;
  overflow: hidden;
  border: 1px solid var(--lab-line);
  border-radius: 1.25rem;
  background:
    linear-gradient(var(--lab-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--lab-line) 1px, transparent 1px), var(--card);
  background-size: 2.25rem 2.25rem;
}

.system-map::after {
  position: absolute;
  inset: 1rem;
  border: 1px dashed var(--lab-line);
  border-radius: 1rem;
  content: "";
  pointer-events: none;
}

.rail-label {
  position: absolute;
  z-index: 2;
  top: 1.3rem;
  left: 1.3rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.system-rail {
  position: absolute;
  z-index: 2;
  top: 4.1rem;
  left: 1.5rem;
  display: grid;
  gap: 0.36rem;
}

.system-rail span {
  width: 0.46rem;
  height: 1.25rem;
  border-radius: 99px;
  background: var(--lab-line);
}

.system-rail span.active {
  background: var(--violet);
}

.model-core {
  position: absolute;
  z-index: 5;
  top: 50%;
  left: 50%;
  display: grid;
  place-items: center;
  width: 7.5rem;
  height: 7.5rem;
  padding: 1rem;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  color: var(--background);
  background: var(--foreground);
  box-shadow: 0 1rem 3rem color-mix(in srgb, var(--foreground) 20%, transparent);
  text-align: center;
}

.model-core span {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.model-core small {
  font-size: 0.48rem;
  opacity: 0.72;
}

.layer-rings {
  position: absolute;
  inset: 0;
}

.ring {
  position: absolute;
  z-index: 3;
  top: 50%;
  left: 50%;
  width: calc(8.8rem + var(--ring-size));
  height: calc(8.8rem + var(--ring-size));
  transform: translate(-50%, -50%);
  border: 1px dashed var(--lab-line);
  border-radius: 50%;
  opacity: 0.55;
  cursor: pointer;
}

.ring:nth-child(1) {
  --ring-size: 1.7rem;
}
.ring:nth-child(2) {
  --ring-size: 4.6rem;
}
.ring:nth-child(3) {
  --ring-size: 7.5rem;
}
.ring:nth-child(4) {
  --ring-size: 10.4rem;
}
.ring:nth-child(5) {
  --ring-size: 13.3rem;
}
.ring:nth-child(6) {
  --ring-size: 16.2rem;
}
.ring:nth-child(7) {
  --ring-size: 19.1rem;
}

.ring.active {
  border-style: solid;
  border-color: color-mix(in srgb, var(--violet) 58%, var(--lab-line));
  background: color-mix(in srgb, var(--violet) 2.8%, transparent);
  opacity: 1;
}

.ring.selected {
  border-width: 2px;
  border-color: var(--orange);
}

.ring span {
  position: absolute;
  top: 50%;
  right: -0.35rem;
  padding: 0.22rem 0.36rem;
  transform: translateY(-50%);
  border: 1px solid var(--lab-line);
  border-radius: 0.35rem;
  color: var(--muted-foreground);
  background: var(--card);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.42rem;
  font-weight: 800;
}

.ring.active span {
  color: var(--foreground);
}

.output-node {
  position: absolute;
  z-index: 8;
  right: 1.35rem;
  bottom: 1.35rem;
  min-width: 7rem;
  padding: 0.7rem;
  border: 1px solid var(--lab-line);
  border-radius: 0.75rem;
  background: var(--card);
}

.output-node.verified {
  color: var(--foreground);
  background: var(--lime);
}

.output-node span,
.output-node strong {
  display: block;
}

.output-node span {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.55rem;
}

.output-node strong {
  margin-top: 0.18rem;
  font-size: 0.72rem;
}

.layer-detail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.1rem;
  border: 1px solid var(--lab-line);
  border-radius: 1.1rem;
  background: var(--card);
}

.layer-detail h4 {
  margin: -0.45rem 0 0;
  font-size: 1.35rem;
  letter-spacing: -0.04em;
}

.layer-detail div {
  padding-top: 0.9rem;
  border-top: 1px solid var(--lab-line);
}

.layer-detail div > strong {
  font-size: 0.68rem;
}

.layer-detail p {
  margin: 0.45rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.72rem;
  line-height: 1.55;
}

.layer-detail .success-note {
  padding: 0.65rem;
  border-radius: 0.65rem;
  color: var(--foreground);
  background: color-mix(in srgb, var(--lime) 22%, var(--card));
}

.layer-detail .failure-note {
  padding-left: 0.65rem;
  border-left: 0.24rem solid var(--orange);
  color: var(--foreground);
}

.metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  overflow: hidden;
  margin-top: 1rem;
  border: 1px solid var(--lab-line);
  border-radius: 0.9rem;
  background: var(--lab-line);
}

.metrics article {
  padding: 0.75rem;
  background: var(--card);
}

.metrics span,
.metrics strong {
  display: block;
}

.metrics span {
  color: var(--muted-foreground);
  font-size: 0.58rem;
}

.metrics strong {
  margin-top: 0.25rem;
  font-size: 0.85rem;
}

.section-index {
  margin-bottom: 0.55rem;
}

.comparison-panel {
  overflow: hidden;
  border-bottom: 1px solid var(--lab-line);
  background: var(--background);
}

.comparison-head {
  display: grid;
  gap: 1rem;
  align-items: end;
  padding: clamp(1.35rem, 4vw, 2.2rem);
  border-bottom: 1px solid var(--lab-line);
  background: color-mix(in srgb, var(--background) 94%, transparent);
}

.comparison-head h3 {
  max-width: 58rem;
  margin: 0;
  color: var(--foreground);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2rem, 5vw, 3.35rem);
  font-weight: 500;
  letter-spacing: -0.045em;
}

.comparison-head p:not(.section-index) {
  max-width: 50rem;
  margin: 0.7rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.82rem;
  line-height: 1.62;
}

.comparison-control {
  min-height: 2.75rem;
  min-width: 7.4rem;
  padding: 0.7rem 1rem;
  border: 1px solid var(--foreground);
  border-radius: 99px;
  color: var(--background);
  background: var(--foreground);
  font-size: 0.7rem;
  font-weight: 850;
  cursor: pointer;
  transition:
    transform var(--motion-fast) var(--motion-ease-out),
    color var(--motion-fast) var(--motion-ease-out),
    background-color var(--motion-fast) var(--motion-ease-out),
    border-color var(--motion-fast) var(--motion-ease-out);
}

.comparison-control:not(:disabled):hover,
.comparison-control:not(:disabled):focus-visible {
  outline: 3px solid color-mix(in srgb, var(--orange) 18%, transparent);
  outline-offset: 2px;
  border-color: var(--orange);
}

.comparison-control:not(:disabled):active {
  transform: scale(0.97);
}

.comparison-control:disabled {
  color: var(--muted-foreground);
  background: var(--secondary);
  border-color: var(--lab-line);
  cursor: default;
}

.relay-steps {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  border-bottom: 1px solid var(--lab-line);
  background: color-mix(in srgb, var(--card) 88%, transparent);
}

.relay-steps button {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.48rem;
  align-items: center;
  min-width: 0;
  min-height: 4.6rem;
  padding: 0.7rem clamp(0.45rem, 1.5vw, 0.85rem);
  border: 0;
  border-right: 1px solid var(--lab-line);
  color: var(--muted-foreground);
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition:
    color var(--motion-fast) var(--motion-ease-out),
    background-color var(--motion-fast) var(--motion-ease-out),
    transform var(--motion-fast) var(--motion-ease-out);
}

.relay-steps button:last-child {
  border-right: 0;
}

.relay-steps button::after {
  position: absolute;
  right: 0.55rem;
  bottom: -1px;
  left: 0.55rem;
  height: 2px;
  background: var(--orange);
  content: "";
  opacity: 0;
  transform: scaleX(0.3);
  transform-origin: left;
  transition:
    opacity var(--motion-fast) var(--motion-ease-out),
    transform var(--motion-fast) var(--motion-ease-out);
}

.relay-steps button:hover,
.relay-steps button:focus-visible,
.relay-steps button.current {
  color: var(--foreground);
  background: color-mix(in srgb, var(--secondary) 82%, transparent);
}

.relay-steps button:focus-visible {
  z-index: 1;
  outline: 2px solid var(--orange);
  outline-offset: -3px;
}

.relay-steps button:active {
  transform: scale(0.97);
}

.relay-steps button.reached span {
  color: var(--foreground);
  border-color: color-mix(in srgb, var(--foreground) 42%, transparent);
}

.relay-steps button.current::after {
  opacity: 1;
  transform: scaleX(1);
}

.relay-steps button > span {
  display: grid;
  width: 1.8rem;
  height: 1.8rem;
  place-items: center;
  border: 1px solid var(--lab-line);
  border-radius: 50%;
  color: var(--muted-foreground);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.56rem;
  font-weight: 800;
}

.relay-steps button > strong {
  min-width: 0;
  overflow: hidden;
  color: currentColor;
  font-size: clamp(0.56rem, 1vw, 0.7rem);
  letter-spacing: 0.035em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mission-progress {
  height: 3px;
  overflow: hidden;
  background: color-mix(in srgb, var(--line-card) 70%, var(--background));
}

.mission-progress i {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--orange), var(--violet));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 100ms linear;
}

.mission-viewport {
  position: relative;
  isolation: isolate;
  min-height: clamp(38.75rem, 56.25vw, 42rem);
  overflow: hidden;
  color: #f7f8fb;
  background:
    radial-gradient(
      circle at 50% 45%,
      rgba(89, 91, 154, 0.16),
      transparent 34%
    ),
    #080b13;
}

.mission-canvas,
.mission-fallback,
.mission-overlay-grid {
  position: absolute;
  inset: 0;
}

.mission-canvas {
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 180ms var(--motion-ease-out);
}

.comparison-panel.has-live-scene .mission-canvas {
  opacity: 1;
}

.mission-runtime-note {
  position: absolute;
  z-index: 5;
  top: 50%;
  left: 50%;
  max-width: min(28rem, calc(100% - 2rem));
  margin: 0;
  padding: 0.55rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 99px;
  color: rgba(247, 248, 251, 0.7);
  background: rgba(8, 11, 19, 0.74);
  font-size: 0.62rem;
  line-height: 1.4;
  text-align: center;
  transform: translate(-50%, -50%);
}

.mission-overlay-grid {
  z-index: 3;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  pointer-events: none;
}

.mission-overlay-bay {
  display: flex;
  min-width: 0;
  padding: 1.1rem;
  flex-direction: column;
  justify-content: space-between;
}

.mission-overlay-bay:first-child {
  border-right: 1px solid rgba(255, 255, 255, 0.11);
}

.mission-overlay-bay header,
.mission-overlay-bay footer {
  width: fit-content;
  max-width: min(25rem, 88%);
  padding: 0.62rem 0.72rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0.65rem;
  background: rgba(8, 11, 19, 0.72);
  backdrop-filter: blur(10px);
}

.mission-overlay-bay.with-harness header,
.mission-overlay-bay.with-harness footer {
  margin-left: auto;
  text-align: right;
}

.mission-overlay-bay header strong,
.mission-overlay-bay footer strong {
  display: block;
}

.mission-overlay-bay header strong {
  color: #ffffff;
  font-size: clamp(0.72rem, 1.4vw, 0.9rem);
  letter-spacing: 0.02em;
}

.mission-overlay-bay footer strong {
  color: #ff8a66;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: clamp(0.62rem, 1.25vw, 0.78rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mission-overlay-bay.with-harness footer strong {
  color: #a8e5ba;
}

.mission-fallback {
  z-index: 2;
  opacity: 1;
  visibility: visible;
  background:
    linear-gradient(rgba(255, 255, 255, 0.028) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.028) 1px, transparent 1px);
  background-size: 2.5rem 2.5rem;
  transition:
    opacity 180ms var(--motion-ease-out),
    visibility 0s linear;
}

.comparison-panel.has-live-scene .mission-fallback {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 180ms var(--motion-ease-out),
    visibility 0s linear 180ms;
}

.fallback-stage,
.fallback-pair {
  height: 100%;
}

.fallback-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.fallback-diagram {
  position: relative;
  min-width: 0;
  margin: 6.4rem clamp(0.75rem, 2vw, 1.4rem) 7.2rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1rem;
  background:
    radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.06),
      transparent 48%
    ),
    rgba(255, 255, 255, 0.02);
}

.fallback-diagram:first-child {
  border-color: rgba(255, 112, 90, 0.2);
}

.fallback-diagram:last-child {
  border-color: rgba(168, 229, 186, 0.25);
}

.fallback-diagram i {
  position: absolute;
  display: block;
  box-sizing: border-box;
}

.diagram-path {
  top: 50%;
  left: 14%;
  width: 72%;
  height: 1px;
  border-top: 1px dashed rgba(247, 248, 251, 0.26);
  transform-origin: left;
}

.diagram-craft {
  top: calc(50% - 0.65rem);
  left: 18%;
  z-index: 2;
  width: 2.2rem;
  height: 1.3rem;
  border: 2px solid rgba(247, 248, 251, 0.78);
  border-radius: 48% 58% 48% 58%;
  background: #101624;
  transform: rotate(-8deg);
}

.diagram-craft::before,
.diagram-craft::after {
  position: absolute;
  top: 0.22rem;
  width: 0.8rem;
  height: 0.56rem;
  border: 1px solid rgba(247, 248, 251, 0.5);
  background: rgba(110, 128, 175, 0.18);
  content: "";
}

.diagram-craft::before {
  right: calc(100% + 0.14rem);
}

.diagram-craft::after {
  left: calc(100% + 0.14rem);
}

.diagram-node {
  width: 1rem;
  height: 1rem;
  border: 1px solid rgba(247, 248, 251, 0.44);
  border-radius: 50%;
  background: #111827;
}

.diagram-signal,
.diagram-checkpoint,
.diagram-verifier {
  opacity: 0;
}

.fallback-coordinates .node-a {
  top: 38%;
  left: 75%;
  box-shadow: 0 0 0 0.45rem rgba(168, 229, 186, 0.08);
}

.fallback-coordinates .node-b {
  top: 61%;
  left: 68%;
}

.fallback-coordinates .node-c {
  top: 25%;
  left: 61%;
  opacity: 0.55;
}

.fallback-coordinates .without-harness .diagram-path {
  transform: rotate(13deg);
}

.fallback-coordinates .without-harness .diagram-craft {
  top: 59%;
  left: 55%;
}

.fallback-coordinates .without-harness .node-b {
  border-color: #ff8066;
  box-shadow: 0 0 0 0.45rem rgba(255, 128, 102, 0.09);
}

.fallback-coordinates .with-harness .diagram-path {
  border-color: rgba(168, 229, 186, 0.58);
  transform: rotate(-7deg);
}

.fallback-coordinates .with-harness .diagram-craft {
  top: 36%;
  left: 62%;
  border-color: #a8e5ba;
}

.fallback-coordinates .with-harness .node-a {
  border-color: #a8e5ba;
  box-shadow:
    0 0 0 0.45rem rgba(168, 229, 186, 0.1),
    0 0 1.5rem rgba(168, 229, 186, 0.2);
}

.fallback-permission .diagram-node {
  left: 70%;
  width: 1.6rem;
  height: 2.35rem;
  border-radius: 0.15rem 0.15rem 0.08rem 0.08rem;
}

.fallback-permission .node-a {
  top: 18%;
}

.fallback-permission .node-b {
  top: calc(50% - 1.18rem);
}

.fallback-permission .node-c {
  bottom: 18%;
}

.fallback-permission .without-harness .diagram-node {
  border-color: #ff8066;
  background: rgba(255, 128, 102, 0.08);
  box-shadow: inset -0.4rem 0 rgba(255, 128, 102, 0.09);
}

.fallback-permission .with-harness .node-a,
.fallback-permission .with-harness .node-c {
  border-color: rgba(247, 248, 251, 0.18);
  opacity: 0.38;
}

.fallback-permission .with-harness .node-b {
  border-color: #a8e5ba;
  background: rgba(168, 229, 186, 0.09);
  box-shadow: inset -0.4rem 0 rgba(168, 229, 186, 0.12);
}

.fallback-permission .with-harness .diagram-path {
  border-color: rgba(168, 229, 186, 0.58);
}

.fallback-handshake .diagram-node {
  top: calc(50% - 1.3rem);
  left: 74%;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 0.42rem;
}

.fallback-handshake .node-b,
.fallback-handshake .node-c {
  display: none;
}

.fallback-handshake .diagram-signal {
  display: block;
  left: 38%;
  width: 31%;
  height: 0.38rem;
  border-radius: 99px;
  opacity: 1;
}

.fallback-handshake .signal-out {
  top: 45%;
  background: linear-gradient(90deg, #8095cc, #ff8066);
}

.fallback-handshake .signal-back {
  top: 55%;
  background: linear-gradient(90deg, #a8e5ba, #8095cc);
}

.fallback-handshake .without-harness .signal-back {
  width: 8%;
  opacity: 0.22;
}

.fallback-handshake .without-harness .node-a {
  border-color: #ff8066;
}

.fallback-handshake .with-harness .node-a {
  border-color: #a8e5ba;
  box-shadow: 0 0 1.3rem rgba(168, 229, 186, 0.18);
}

.fallback-handshake .with-harness .signal-back {
  opacity: 1;
}

.fallback-recovery .diagram-path {
  border-style: dotted;
}

.fallback-recovery .node-a {
  top: calc(50% - 0.65rem);
  left: 14%;
  width: 1.3rem;
  height: 1.3rem;
}

.fallback-recovery .node-b,
.fallback-recovery .node-c {
  display: none;
}

.fallback-recovery .without-harness .diagram-craft {
  left: 18%;
  border-color: #ff8066;
  opacity: 0.72;
}

.fallback-recovery .with-harness .diagram-craft {
  left: 65%;
  border-color: #a8e5ba;
}

.fallback-recovery .diagram-checkpoint {
  top: calc(50% - 1.05rem);
  left: 51%;
  width: 2.1rem;
  height: 2.1rem;
  border: 1px solid #a8e5ba;
  border-radius: 50%;
  opacity: 1;
  box-shadow:
    0 0 0 0.45rem rgba(168, 229, 186, 0.08),
    0 0 1.4rem rgba(168, 229, 186, 0.18);
}

.fallback-recovery .without-harness .diagram-checkpoint {
  opacity: 0.12;
}

.fallback-verification .node-a {
  top: calc(50% - 1.45rem);
  left: 38%;
  width: 2.9rem;
  height: 2.9rem;
  border-radius: 50%;
}

.fallback-verification .node-b,
.fallback-verification .node-c {
  display: none;
}

.fallback-verification .diagram-craft {
  top: calc(50% - 0.55rem);
  left: 41%;
  width: 1.85rem;
  height: 1.1rem;
}

.fallback-verification .diagram-verifier {
  top: calc(50% - 1.35rem);
  left: 73%;
  display: grid;
  width: 2.7rem;
  height: 2.7rem;
  place-items: center;
  border: 1px solid #a8e5ba;
  border-radius: 0.55rem;
  opacity: 1;
  background: rgba(168, 229, 186, 0.08);
}

.fallback-verification .diagram-verifier::after {
  color: #a8e5ba;
  content: "✓";
  font:
    800 1rem/1 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
}

.fallback-verification .without-harness .diagram-verifier {
  left: 48%;
  border-color: #ff8066;
  opacity: 0.4;
  background: rgba(255, 128, 102, 0.08);
}

.fallback-verification .without-harness .diagram-verifier::after {
  color: #ff8066;
  content: "?";
}

.fallback-verification .with-harness .diagram-path {
  border-color: rgba(168, 229, 186, 0.58);
}

.fallback-mission {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.fallback-mission b,
.fallback-mission i {
  position: absolute;
  display: block;
  box-sizing: border-box;
  font-style: normal;
}

.static-rocket {
  z-index: 5;
  width: 1.35rem;
  height: 6.5rem;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 55% 55% 18% 18% / 17% 17% 9% 9%;
  background: linear-gradient(
    90deg,
    #677181 0 18%,
    #d9dde1 42%,
    #838d9a 70%,
    #4b5360
  );
  box-shadow:
    inset -0.25rem 0 rgba(8, 11, 19, 0.22),
    0 0 1.1rem rgba(217, 221, 225, 0.12);
}

.static-rocket::before {
  position: absolute;
  top: 42%;
  right: -0.3rem;
  left: -0.3rem;
  height: 0.25rem;
  border-top: 1px solid #080b13;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  content: "";
}

.static-rocket::after {
  position: absolute;
  right: 0.18rem;
  bottom: -0.68rem;
  left: 0.18rem;
  height: 0.75rem;
  clip-path: polygon(0 0, 100% 0, 72% 100%, 28% 100%);
  background: linear-gradient(#84d8ff, rgba(100, 124, 255, 0.08));
  content: "";
}

.static-earth {
  right: -18%;
  bottom: -66%;
  width: 136%;
  aspect-ratio: 1;
  border: 2px solid rgba(132, 216, 255, 0.34);
  border-radius: 50%;
  background: radial-gradient(
    circle at 45% 38%,
    #1b3150,
    #0c1627 58%,
    #080b13 59%
  );
  box-shadow: 0 -0.75rem 1.75rem rgba(132, 216, 255, 0.08);
}

.static-orbit {
  z-index: 2;
  right: 10%;
  width: 66%;
  height: 38%;
  border: 1px dashed rgba(233, 237, 242, 0.28);
  border-radius: 50%;
  transform: rotate(-10deg);
}

.orbit-near {
  top: 21%;
}

.orbit-target {
  top: 7%;
}

.mission-coordinates .static-rocket {
  bottom: 12%;
  left: 13%;
  height: 4.9rem;
  transform: rotate(22deg);
}

.mission-coordinates .static-route {
  z-index: 3;
  top: 46%;
  left: 23%;
  width: 55%;
  height: 1px;
  border-top: 2px dotted #ff8b65;
  transform: rotate(-16deg);
  transform-origin: left;
}

.mission-coordinates.locked-route .static-route {
  top: 49%;
  width: 62%;
  border-color: #84d8ff;
  box-shadow: 0 0 0.65rem rgba(132, 216, 255, 0.2);
  transform: rotate(-35deg);
}

.mission-coordinates.vague-route .orbit-near {
  border-color: #ff8b65;
  box-shadow: 0 0 0.75rem rgba(255, 139, 101, 0.14);
}

.mission-coordinates.locked-route .orbit-target {
  border-style: solid;
  border-color: #c9ff64;
  box-shadow: 0 0 0.85rem rgba(201, 255, 100, 0.14);
}

.static-command,
.static-spec {
  z-index: 6;
  padding: 0.22rem 0.3rem;
  border-radius: 0.28rem;
  background: rgba(8, 11, 19, 0.82);
  font-size: 0.38rem;
  letter-spacing: 0.04em;
}

.static-command {
  top: 0.6rem;
  left: 0.6rem;
  border: 1px solid rgba(255, 139, 101, 0.48);
  color: #ffad92;
}

.static-symbol {
  z-index: 6;
  top: 31%;
  right: 24%;
  color: #ff8b65;
  font-size: 1.5rem;
}

.static-spec {
  border: 1px solid rgba(132, 216, 255, 0.42);
  color: #b9e9ff;
}

.spec-orbit {
  top: 8%;
  right: 8%;
}

.spec-window {
  top: 23%;
  left: 7%;
}

.spec-payload {
  top: 39%;
  right: 3%;
}

.spec-return {
  right: 21%;
  bottom: 8%;
}

.static-lock {
  z-index: 6;
  top: 11%;
  right: 18%;
  width: 2.1rem;
  height: 1.25rem;
  border: 2px solid #c9ff64;
  border-radius: 50%;
  box-shadow: 0 0 0.85rem rgba(201, 255, 100, 0.25);
}

.static-pad {
  right: 11%;
  bottom: 11%;
  left: 11%;
  height: 0.3rem;
  background: rgba(233, 237, 242, 0.34);
}

.static-tower {
  right: 20%;
  bottom: 13%;
  width: 0.85rem;
  height: 66%;
  border: 1px solid rgba(233, 237, 242, 0.38);
  background: repeating-linear-gradient(
    135deg,
    transparent 0 0.5rem,
    rgba(233, 237, 242, 0.18) 0.56rem 0.62rem
  );
}

.mission-permission .on-pad {
  bottom: 13%;
  left: calc(50% - 0.68rem);
  height: 5.75rem;
}

.static-control {
  z-index: 7;
  display: grid !important;
  width: 2.5rem;
  height: 1.12rem;
  place-items: center;
  border: 1px solid rgba(233, 237, 242, 0.3);
  border-radius: 0.25rem;
  color: rgba(233, 237, 242, 0.62);
  background: rgba(8, 11, 19, 0.88);
  font-size: 0.36rem;
  font-weight: 850;
}

.control-propellant {
  top: 9%;
  left: 5%;
}

.control-ignition {
  top: 9%;
  left: calc(50% - 1.25rem);
}

.control-clamps {
  top: 9%;
  right: 5%;
}

.control-payload {
  top: 32%;
  right: 5%;
}

.wildcard-authority .static-control {
  border-color: #ff8b65;
  color: #ffad92;
  box-shadow: inset 0 -0.2rem rgba(255, 139, 101, 0.18);
}

.wildcard-token {
  z-index: 8;
  top: 28%;
  left: 12%;
  display: grid !important;
  width: 1.85rem;
  height: 1.85rem;
  place-items: center;
  border: 1px solid #ff8b65;
  border-radius: 50%;
  color: #ff8b65;
  background: rgba(255, 139, 101, 0.12);
  font-size: 1.1rem;
}

.scoped-authority .static-control:not(.control-payload) {
  border-color: #c9ff64;
  color: #c9ff64;
  box-shadow: inset 0 -0.2rem rgba(201, 255, 100, 0.14);
}

.scoped-authority .control-payload {
  opacity: 0.42;
}

.scope-token {
  z-index: 8;
  top: 28%;
  display: grid !important;
  width: 1.1rem;
  height: 1.1rem;
  place-items: center;
  border: 1px solid #84d8ff;
  border-radius: 50%;
  color: #84d8ff;
  background: rgba(132, 216, 255, 0.1);
  font-size: 0.42rem;
}

.token-a {
  left: 12%;
}

.token-b {
  left: calc(50% - 0.55rem);
}

.token-c {
  right: 12%;
}

.mission-handshake .ascent-stack {
  top: 19%;
  left: calc(50% - 0.68rem);
  height: 7.25rem;
}

.static-interstage {
  z-index: 7;
  top: 47%;
  left: calc(50% - 0.94rem);
  width: 1.88rem;
  height: 0.38rem;
  border: 1px solid #84d8ff;
  border-radius: 50%;
  background: #080b13;
}

.controller-node {
  z-index: 7;
  bottom: 14%;
  left: 8%;
  padding: 0.3rem 0.42rem;
  border: 1px solid rgba(233, 237, 242, 0.32);
  border-radius: 0.3rem;
  color: rgba(233, 237, 242, 0.66);
  background: rgba(8, 11, 19, 0.86);
  font-size: 0.42rem;
}

.signal-arrow {
  z-index: 8;
  height: 1rem;
  padding: 0.18rem 0.3rem;
  border-radius: 99px;
  font-size: 0.36rem;
  font-weight: 850;
  line-height: 0.58rem;
}

.signal-arrow::after {
  position: absolute;
  top: 0.25rem;
  border: 0.25rem solid transparent;
  content: "";
}

.command-out {
  top: 37%;
  left: 13%;
  color: #b9e9ff;
  background: rgba(132, 216, 255, 0.16);
}

.command-out::after,
.repeat-out::after {
  right: -0.5rem;
  border-left-color: currentColor;
}

.repeat-out {
  top: 58%;
  left: 17%;
  color: #ffad92;
  background: rgba(255, 139, 101, 0.12);
  opacity: 0.72;
}

.ack-ready,
.ack-separation {
  right: 10%;
  color: #c9ff64;
  background: rgba(201, 255, 100, 0.12);
}

.ack-ready {
  top: 55%;
}

.ack-separation {
  top: 69%;
}

.ack-ready::after,
.ack-separation::after {
  left: -0.5rem;
  border-right-color: #c9ff64;
}

.catch-tower {
  right: 15%;
  bottom: 12%;
  height: 72%;
}

.tower-health {
  z-index: 8;
  top: 10%;
  right: 6%;
  padding: 0.24rem 0.34rem;
  border: 1px solid #ff4f64;
  border-radius: 0.25rem;
  color: #ff7180;
  background: rgba(255, 79, 100, 0.1);
  font-size: 0.42rem;
  font-weight: 850;
}

.mission-recovery .returning {
  top: 33%;
  left: 25%;
  height: 5.4rem;
  transform: rotate(19deg);
}

.return-route,
.divert-route {
  z-index: 3;
  top: 61%;
  left: 17%;
  width: 61%;
  border-top: 2px dashed #ff8b65;
  transform: rotate(-23deg);
  transform-origin: left;
}

.safe-divert .return-route {
  width: 32%;
  opacity: 0.28;
}

.safe-divert .divert-route {
  top: 66%;
  width: 58%;
  border-color: #84d8ff;
  transform: rotate(18deg);
}

.rough-landing {
  right: 11%;
  bottom: 10%;
  color: #ff8b65;
  font-size: 1.5rem;
}

.stale-state,
.retained-state {
  z-index: 8;
  bottom: 9%;
  left: 6%;
  padding: 0.24rem 0.34rem;
  border: 1px solid currentColor;
  border-radius: 0.25rem;
  font-size: 0.36rem;
}

.stale-state {
  color: #ff8b65;
}

.retained-state {
  color: #c9ff64;
}

.offshore-zone {
  z-index: 6;
  right: 7%;
  bottom: 8%;
  display: grid !important;
  width: 3.85rem;
  height: 1.75rem;
  place-items: center;
  border: 1px dashed #84d8ff;
  border-radius: 50%;
  color: #b9e9ff;
  background: rgba(132, 216, 255, 0.08);
  font-size: 0.36rem;
  font-weight: 850;
}

.mission-verification .review-rocket {
  top: 16%;
  left: 12%;
  height: 5rem;
}

.done-badge {
  z-index: 8;
  top: 13%;
  right: 9%;
  padding: 0.3rem 0.42rem;
  border: 1px solid #c9ff64;
  border-radius: 0.3rem;
  color: #c9ff64;
  background: rgba(201, 255, 100, 0.1);
  font-size: 0.48rem;
}

.evidence-row {
  z-index: 7;
  right: 7%;
  left: 35%;
  height: 1.25rem;
  padding: 0.24rem 0.34rem;
  overflow: hidden;
  border: 1px solid rgba(233, 237, 242, 0.18);
  border-radius: 0.25rem;
  color: rgba(233, 237, 242, 0.38);
  background: rgba(8, 11, 19, 0.72);
  font-size: 0.36rem;
  font-weight: 850;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row-orbit {
  top: 34%;
}

.row-payload {
  top: 48%;
}

.row-catch {
  top: 62%;
}

.row-divert {
  top: 76%;
}

.evidence-backed .evidence-row {
  border-color: rgba(201, 255, 100, 0.38);
  color: #c9ff64;
}

.evidence-backed .row-catch {
  border-color: rgba(255, 139, 101, 0.42);
  color: #ffad92;
}

.observer-satellite {
  z-index: 8;
  width: 0.8rem;
  height: 0.8rem;
  border: 1px solid #84d8ff;
  border-radius: 50%;
  background: rgba(132, 216, 255, 0.16);
  box-shadow: 0 0 0.55rem rgba(132, 216, 255, 0.28);
}

.observer-satellite::before,
.observer-satellite::after {
  position: absolute;
  top: 0.18rem;
  width: 0.5rem;
  height: 0.32rem;
  border: 1px solid rgba(132, 216, 255, 0.55);
  content: "";
}

.observer-satellite::before {
  right: 0.75rem;
}

.observer-satellite::after {
  left: 0.75rem;
}

.observer-a {
  top: 10%;
  left: 42%;
}

.observer-b {
  top: 19%;
  right: 12%;
}

.radar-sweep {
  z-index: 3;
  bottom: -1.3rem;
  left: -1.3rem;
  width: 6rem;
  height: 6rem;
  border: 1px solid rgba(132, 216, 255, 0.46);
  border-radius: 50%;
  background: conic-gradient(
    from 270deg,
    rgba(132, 216, 255, 0.2),
    transparent 24%
  );
}

.relay-caption {
  display: grid;
  gap: 0.45rem;
  padding: 1rem clamp(1rem, 3vw, 1.5rem);
  border-top: 1px solid var(--lab-line);
  border-bottom: 1px solid var(--lab-line);
  background: color-mix(in srgb, var(--card) 88%, transparent);
}

.relay-caption strong {
  color: var(--foreground);
  font-size: 0.72rem;
}

.relay-caption p {
  max-width: 54rem;
  margin: 0.3rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.72rem;
  line-height: 1.55;
}

.relay-caption .relay-caption-outcomes {
  color: var(--foreground);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.62rem;
  font-weight: 720;
  letter-spacing: 0.02em;
}

.mission-conclusion {
  display: grid;
  gap: 0.35rem;
  margin: 0;
  padding: 1rem clamp(1rem, 3vw, 1.5rem);
  border-bottom: 1px solid var(--lab-line);
  color: var(--foreground);
  background: color-mix(in srgb, var(--lime) 24%, var(--card));
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1rem, 2vw, 1.3rem);
  line-height: 1.5;
}

.mission-conclusion strong,
.mission-conclusion span {
  display: block;
}

.mission-conclusion span {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.62em;
  letter-spacing: 0.06em;
}

.relay-sources {
  display: flex;
  gap: 0.7rem 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem clamp(1rem, 3vw, 1.5rem);
  border-bottom: 1px solid var(--lab-line);
  background: color-mix(in srgb, var(--card) 92%, transparent);
}

.relay-sources > span {
  color: var(--muted-foreground);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.47rem;
  font-weight: 760;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.relay-sources > div {
  display: flex;
  gap: 0.42rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.relay-sources a {
  padding: 0.32rem 0.48rem;
  border: 1px solid var(--lab-line);
  border-radius: 99px;
  color: var(--muted-foreground);
  background: var(--background);
  font-size: 0.5rem;
  font-weight: 720;
  text-decoration: none;
}

.relay-sources a:hover,
.relay-sources a:focus-visible {
  color: var(--foreground);
  border-color: var(--violet);
  outline: 2px solid color-mix(in srgb, var(--violet) 28%, transparent);
  outline-offset: 1px;
}

.comparison-clarification {
  margin: 0;
  padding: 0.6rem clamp(1rem, 3vw, 1.5rem) 1rem;
  color: var(--muted-foreground);
  background: color-mix(in srgb, var(--card) 92%, transparent);
  font-size: 0.58rem;
  line-height: 1.5;
}
.missing-list button {
  margin-top: 0.75rem;
  padding: 0.48rem 0.62rem;
  border: 1px solid var(--orange);
  border-radius: 0.55rem;
  color: var(--foreground);
  background: color-mix(in srgb, var(--orange) 10%, var(--card));
  font-size: 0.62rem;
  font-weight: 760;
  cursor: pointer;
}

.scenario-tabs {
  display: grid;
  gap: 0.5rem;
  margin-top: 1.2rem;
}

.scenario-tabs button {
  padding: 0.72rem;
  border: 1px solid var(--lab-line);
  border-radius: 0.7rem;
  color: var(--foreground);
  background: var(--card);
  font-size: 0.68rem;
  font-weight: 760;
  cursor: pointer;
}

.scenario-tabs button:hover,
.scenario-tabs button:focus-visible,
.scenario-tabs button.active {
  outline: none;
  border-color: var(--violet);
  background: color-mix(in srgb, var(--violet) 14%, var(--card));
}

.scenario-card {
  display: grid;
  gap: 1px;
  overflow: hidden;
  margin-top: 0.7rem;
  border: 1px solid var(--lab-line);
  border-radius: 1rem;
  background: var(--lab-line);
}

.scenario-copy,
.scenario-fit {
  padding: 1.1rem;
  background: var(--card);
}

.scenario-copy h4 {
  max-width: 34rem;
  margin: 0.55rem 0 0;
  font-size: 1.1rem;
  line-height: 1.25;
  letter-spacing: -0.03em;
}

.scenario-copy p {
  margin: 0.65rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.73rem;
  line-height: 1.55;
}

.scenario-copy .recommendation {
  padding: 0.75rem;
  border-left: 0.28rem solid var(--lime);
  color: var(--foreground);
  background: var(--lab-soft);
}

.scenario-fit > strong {
  display: block;
  margin-top: 0.45rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 1.35rem;
}

.fit-bar {
  height: 0.55rem;
  margin-top: 0.8rem;
  overflow: hidden;
  border-radius: 99px;
  background: var(--lab-soft);
}

.fit-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--violet);
  transition: width 220ms ease;
}

.missing-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.35rem;
}

.distinction {
  display: grid;
  gap: 0.65rem;
  padding: clamp(1.1rem, 4vw, 2rem);
  background: color-mix(in srgb, var(--lime) 28%, var(--card));
}

.distinction span {
  color: var(--foreground);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.62rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.distinction p {
  max-width: 58rem;
  margin: 0;
  font-size: clamp(0.88rem, 2vw, 1.08rem);
  font-weight: 650;
  line-height: 1.55;
}

@media (min-width: 620px) {
  .comparison-head {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
  }

  .preset-row,
  .scenario-tabs {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .scenario-card {
    grid-template-columns: minmax(9rem, 0.32fr) minmax(0, 1fr);
  }
}

@media (min-width: 980px) {
  .builder-grid {
    grid-template-columns: minmax(13rem, 0.78fr) minmax(27rem, 1.55fr) minmax(
        13rem,
        0.8fr
      );
    align-items: stretch;
  }

  .system-map {
    min-height: 34rem;
  }

  .scenario-card {
    grid-template-columns: minmax(0, 1.5fr) minmax(14rem, 0.55fr);
  }
}

@media (max-width: 680px) {
  .comparison-head {
    grid-template-columns: 1fr;
    padding: 1.1rem;
  }

  .comparison-control {
    width: 100%;
  }

  .relay-steps button {
    grid-template-columns: 1fr;
    justify-items: center;
    min-height: 3.8rem;
    padding: 0.32rem 0.18rem;
    text-align: center;
  }

  .relay-steps button > span {
    width: 1.55rem;
    height: 1.55rem;
    font-size: 0.42rem;
  }

  .relay-steps button > strong {
    display: none;
  }

  .mission-viewport {
    min-height: 37.5rem;
  }

  .mission-overlay-grid,
  .fallback-pair {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, minmax(0, 1fr));
  }

  .mission-overlay-bay {
    padding: 0.72rem;
  }

  .mission-overlay-bay:first-child {
    border-right: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.11);
  }

  .mission-overlay-bay header,
  .mission-overlay-bay footer {
    max-width: 78%;
    padding: 0.45rem 0.55rem;
  }

  .mission-overlay-bay.with-harness header,
  .mission-overlay-bay.with-harness footer {
    margin-left: auto;
  }

  .fallback-diagram {
    margin: 4.25rem 0.72rem 4.6rem;
    border-radius: 0.75rem;
  }

  .mission-runtime-note {
    top: 50%;
    font-size: 0.55rem;
  }

  .relay-caption {
    padding: 0.72rem;
  }

  .relay-caption p {
    font-size: 0.67rem;
  }

  .relay-sources {
    align-items: stretch;
    flex-direction: column;
    padding: 0.65rem 0.75rem;
  }

  .relay-sources > div {
    justify-content: flex-start;
  }

  .comparison-clarification {
    padding: 0.45rem 0.75rem 0.85rem;
  }
}

@media (max-width: 619px) {
  .builder-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .coverage-chip {
    align-self: stretch;
  }

  .coverage-chip span,
  .coverage-chip strong {
    text-align: left;
  }

  .system-map {
    min-height: 27rem;
  }

  .ring:nth-child(6),
  .ring:nth-child(7) {
    display: none;
  }

  .metrics {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fit-bar i,
  .mission-progress i,
  .mission-canvas,
  .mission-fallback {
    transition: none;
  }

  .mission-canvas {
    opacity: 0;
  }

  .mission-fallback {
    opacity: 1;
    visibility: visible;
  }
}
</style>
