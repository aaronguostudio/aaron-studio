<script setup lang="ts">
import { computed, reactive, ref } from "vue";

type Locale = "en" | "zh";
type AxisKey = "temperature" | "geometry" | "density" | "expression";
type GenreKey = "report" | "proposal" | "manual" | "essay";
type PresetFamily = "theme" | "lineage" | "archetype";
type FamilyFilter = "all" | PresetFamily;
type PresetKey =
  | "alder"
  | "granite"
  | "swiss"
  | "bauhaus"
  | "deco"
  | "nouveau"
  | "editorial"
  | "luxury"
  | "institutional"
  | "technical"
  | "organic"
  | "minimal";

interface Palette {
  paper: string;
  ink: string;
  muted: string;
  accent: string;
  soft: string;
}

interface PresetSpec {
  family: PresetFamily;
  lineage: string;
  archetype: string;
  temperature: number;
  geometry: number;
  density: number;
  expression: number;
  titleFont: string;
  bodyFont: string;
  palette: Palette;
}

interface PresetCopy {
  label: string;
  descriptor: string;
  note: string;
  signature: string[];
}

interface DocumentCopy {
  type: string;
  period: string;
  title: string;
  deck: string;
  metrics: Array<{ label: string; value: string }>;
  quote: string;
  rows: Array<{ label: string; value: string }>;
  source: string;
}

interface Copy {
  eyebrow: string;
  title: string;
  description: string;
  libraryLabel: string;
  libraryHint: string;
  filters: Record<FamilyFilter, string>;
  familyNames: Record<PresetFamily, string>;
  genreLabel: string;
  genreHint: string;
  genres: Record<GenreKey, { label: string; job: string; rule: string }>;
  axes: Record<AxisKey, { label: string; left: string; right: string }>;
  presets: Record<PresetKey, PresetCopy>;
  custom: string;
  customBasedOn: (base: string) => string;
  summary: (
    name: string,
    temperature: string,
    geometry: string,
    density: string,
    expression: string,
  ) => string;
  signatureLabel: string;
  accessibilityLabel: string;
  accessibilityPass: string;
  exportTitle: string;
  exportHint: string;
  previewBrief: string;
  copyBrief: string;
  downloadJson: string;
  copied: string;
  copyFailed: string;
  downloaded: string;
  words: {
    warm: string;
    neutral: string;
    cool: string;
    soft: string;
    balanced: string;
    hard: string;
    sparse: string;
    moderate: string;
    dense: string;
    restrained: string;
    rhythmic: string;
    expressive: string;
  };
  documents: Record<GenreKey, DocumentCopy>;
  stackEyebrow: string;
  stackTitle: string;
  stackDescription: string;
  stack: Array<{ index: string; name: string; role: string }>;
  compareEyebrow: string;
  compareTitle: string;
  compareDescription: string;
  families: Array<{
    key: PresetFamily;
    count: string;
    title: string;
    summary: string;
  }>;
  notStandard: string;
}

const props = defineProps<{ locale: Locale }>();

const PRESET_SPECS: Record<PresetKey, PresetSpec> = {
  alder: {
    family: "theme",
    lineage: "Classical editorial + humanist modernism",
    archetype: "Organic Humanist",
    temperature: 22,
    geometry: 28,
    density: 35,
    expression: 48,
    titleFont: "humanist",
    bodyFont: "book",
    palette: {
      paper: "f0e4ca",
      ink: "30382d",
      muted: "6a614f",
      accent: "8b7953",
      soft: "e4d6b8",
    },
  },
  granite: {
    family: "theme",
    lineage: "Swiss-inspired information design",
    archetype: "Institutional Modern + Technical Functional",
    temperature: 82,
    geometry: 76,
    density: 66,
    expression: 24,
    titleFont: "neutral",
    bodyFont: "neutral",
    palette: {
      paper: "edf2f3",
      ink: "202a31",
      muted: "596771",
      accent: "416f8b",
      soft: "d9e3e6",
    },
  },
  swiss: {
    family: "lineage",
    lineage: "Swiss / International Typographic Style",
    archetype: "Institutional Modern",
    temperature: 68,
    geometry: 92,
    density: 62,
    expression: 56,
    titleFont: "neutral",
    bodyFont: "neutral",
    palette: {
      paper: "f7f7f3",
      ink: "111111",
      muted: "60605c",
      accent: "e53935",
      soft: "e7e7e2",
    },
  },
  bauhaus: {
    family: "lineage",
    lineage: "Bauhaus typography",
    archetype: "Geometric Functional",
    temperature: 46,
    geometry: 88,
    density: 58,
    expression: 84,
    titleFont: "geometric",
    bodyFont: "neutral",
    palette: {
      paper: "f4ecd9",
      ink: "171717",
      muted: "625b4d",
      accent: "cf2e26",
      soft: "efc833",
    },
  },
  deco: {
    family: "lineage",
    lineage: "Art Deco",
    archetype: "Luxury Editorial",
    temperature: 34,
    geometry: 82,
    density: 40,
    expression: 78,
    titleFont: "display",
    bodyFont: "book",
    palette: {
      paper: "171714",
      ink: "f3ead5",
      muted: "bdb59f",
      accent: "c5a358",
      soft: "2a2923",
    },
  },
  nouveau: {
    family: "lineage",
    lineage: "Art Nouveau",
    archetype: "Organic Editorial",
    temperature: 18,
    geometry: 18,
    density: 34,
    expression: 72,
    titleFont: "decorative",
    bodyFont: "book",
    palette: {
      paper: "f0e9d8",
      ink: "283b2d",
      muted: "5f6657",
      accent: "9a5c52",
      soft: "d8cdb5",
    },
  },
  editorial: {
    family: "archetype",
    lineage: "Modern editorial practice",
    archetype: "Modern Editorial",
    temperature: 42,
    geometry: 38,
    density: 48,
    expression: 82,
    titleFont: "editorial",
    bodyFont: "book",
    palette: {
      paper: "f7f3ec",
      ink: "242222",
      muted: "6d6861",
      accent: "a64b3c",
      soft: "e8ddd1",
    },
  },
  luxury: {
    family: "archetype",
    lineage: "High-contrast editorial typography",
    archetype: "Luxury Editorial",
    temperature: 30,
    geometry: 56,
    density: 20,
    expression: 64,
    titleFont: "display",
    bodyFont: "book",
    palette: {
      paper: "151411",
      ink: "f2eadc",
      muted: "bcb3a4",
      accent: "b89455",
      soft: "28251f",
    },
  },
  institutional: {
    family: "archetype",
    lineage: "Swiss-inspired information design",
    archetype: "Institutional Modern",
    temperature: 74,
    geometry: 70,
    density: 58,
    expression: 22,
    titleFont: "neutral",
    bodyFont: "neutral",
    palette: {
      paper: "f3f6f8",
      ink: "1f2d3d",
      muted: "5d6a78",
      accent: "2f5f8f",
      soft: "dce6ef",
    },
  },
  technical: {
    family: "archetype",
    lineage: "Technical publishing + modernist grid",
    archetype: "Technical Functional",
    temperature: 70,
    geometry: 84,
    density: 78,
    expression: 18,
    titleFont: "mono",
    bodyFont: "mono",
    palette: {
      paper: "eff1ef",
      ink: "172019",
      muted: "5d685f",
      accent: "536b5a",
      soft: "dbe0db",
    },
  },
  organic: {
    family: "archetype",
    lineage: "Humanist modernism + book typography",
    archetype: "Organic Humanist",
    temperature: 12,
    geometry: 16,
    density: 28,
    expression: 44,
    titleFont: "humanist",
    bodyFont: "book",
    palette: {
      paper: "f2ead9",
      ink: "2e392f",
      muted: "656854",
      accent: "8b6e45",
      soft: "dfd4bc",
    },
  },
  minimal: {
    family: "archetype",
    lineage: "Modernist reduction",
    archetype: "Minimal Contemporary",
    temperature: 58,
    geometry: 64,
    density: 16,
    expression: 14,
    titleFont: "neutral",
    bodyFont: "neutral",
    palette: {
      paper: "f9f9f7",
      ink: "171717",
      muted: "707070",
      accent: "171717",
      soft: "eeeeea",
    },
  },
};

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: "01 · Visual-language simulator",
    title: "Change the grammar. Feel the document change.",
    description:
      "Explore twelve declared interpretations across named themes, historical lineages, and working archetypes. Each preset changes the palette, typography, spacing, geometry, and component behavior—not just the label.",
    libraryLabel: "Preset library · 12 starting points",
    libraryHint:
      "Filter by identity, then tune any preset with the four continuous axes.",
    filters: {
      all: "All 12",
      theme: "Named themes",
      lineage: "Lineages",
      archetype: "Archetypes",
    },
    familyNames: {
      theme: "Named theme",
      lineage: "Historical lineage",
      archetype: "Working archetype",
    },
    genreLabel: "Start with the reading job",
    genreHint:
      "The same visual language should adapt to the document’s function, not force every document into one layout.",
    genres: {
      report: {
        label: "Analytical report",
        job: "Scan evidence and compare performance",
        rule: "Prioritize retrieval, comparison, and stable data rhythm.",
      },
      proposal: {
        label: "Decision proposal",
        job: "Choose among credible options",
        rule: "Make the decision, trade-offs, and evidence path unmistakable.",
      },
      manual: {
        label: "Operating manual",
        job: "Act accurately under pressure",
        rule: "Keep sequence, warnings, checkpoints, and recovery steps predictable.",
      },
      essay: {
        label: "Long-form essay",
        job: "Read continuously and develop an idea",
        rule: "Protect reading rhythm while giving key turns enough contrast.",
      },
    },
    axes: {
      temperature: { label: "Temperature", left: "Warm", right: "Cool" },
      geometry: { label: "Geometry", left: "Soft", right: "Hard" },
      density: { label: "Density", left: "Sparse", right: "Dense" },
      expression: {
        label: "Expression",
        left: "Restrained",
        right: "Expressive",
      },
    },
    presets: {
      alder: {
        label: "Alder",
        descriptor: "Warm editorial",
        note: "A product-local theme: calm, tactile, and approachable.",
        signature: ["warm paper", "humanist title", "soft cards"],
      },
      granite: {
        label: "Granite",
        descriptor: "Cool institutional",
        note: "A product-local theme: stable, reviewed, and precise.",
        signature: ["cool paper", "neutral sans", "firm grid"],
      },
      swiss: {
        label: "Swiss International",
        descriptor: "Objective grid",
        note: "A lineage translated into an asymmetric grid, sans-serif hierarchy, and disciplined contrast.",
        signature: ["asymmetric grid", "sans serif", "red accent"],
      },
      bauhaus: {
        label: "Bauhaus",
        descriptor: "Geometric clarity",
        note: "A lineage translated into clear blocks, strong scale, and primary geometric contrast.",
        signature: ["geometric type", "primary color", "strong scale"],
      },
      deco: {
        label: "Art Deco",
        descriptor: "Geometric glamour",
        note: "A lineage translated into symmetry, dark lacquer, fine rules, and restrained gold.",
        signature: ["symmetry", "high contrast", "gold detail"],
      },
      nouveau: {
        label: "Art Nouveau",
        descriptor: "Organic ornament",
        note: "A lineage translated into flowing geometry, crafted type, and botanical warmth.",
        signature: ["curved frame", "organic rhythm", "crafted serif"],
      },
      editorial: {
        label: "Modern Editorial",
        descriptor: "Narrative rhythm",
        note: "A working archetype for annual reports, magazines, and image-led stories.",
        signature: ["serif contrast", "large title", "rhythmic modules"],
      },
      luxury: {
        label: "Luxury Editorial",
        descriptor: "Quiet prestige",
        note: "A working archetype built from space, high-contrast type, and very limited color.",
        signature: ["wide space", "display serif", "quiet gold"],
      },
      institutional: {
        label: "Institutional Modern",
        descriptor: "Sober authority",
        note: "A working archetype for governance, finance, consulting, and policy.",
        signature: ["stable hierarchy", "cool blue", "repeatable grid"],
      },
      technical: {
        label: "Technical Functional",
        descriptor: "Dense precision",
        note: "A working archetype for specifications, audits, manuals, and research records.",
        signature: ["monospace", "hard rules", "dense modules"],
      },
      organic: {
        label: "Organic Humanist",
        descriptor: "Warm clarity",
        note: "A working archetype for education, health, sustainability, and personal narratives.",
        signature: ["earth palette", "soft geometry", "humane rhythm"],
      },
      minimal: {
        label: "Minimal Contemporary",
        descriptor: "Radical restraint",
        note: "A working archetype that relies on hierarchy, whitespace, and almost no decoration.",
        signature: ["monochrome", "wide space", "single emphasis"],
      },
    },
    custom: "Custom mix",
    customBasedOn: (base) =>
      "A custom variation that keeps the structural grammar of " + base + ".",
    summary: (name, temperature, geometry, density, expression) =>
      name +
      ": " +
      temperature +
      ", " +
      geometry +
      ", " +
      density +
      ", and " +
      expression +
      ".",
    signatureLabel: "Visible rules",
    accessibilityLabel: "Contrast guard",
    accessibilityPass: "Text colors are held above 4.5:1 on their surfaces",
    exportTitle: "Take the system with you",
    exportHint:
      "The current choices compile into a readable brief and a machine-readable token manifest.",
    previewBrief: "Visual Language Brief",
    copyBrief: "Copy brief",
    downloadJson: "Download JSON",
    copied: "Brief copied",
    copyFailed: "Copy failed. Select the brief and copy it manually.",
    downloaded: "JSON downloaded",
    words: {
      warm: "warm",
      neutral: "neutral",
      cool: "cool",
      soft: "soft",
      balanced: "balanced",
      hard: "hard",
      sparse: "sparse",
      moderate: "moderate density",
      dense: "dense",
      restrained: "restrained",
      rhythmic: "rhythmic",
      expressive: "expressive",
    },
    documents: {
      report: {
        type: "Quarterly operating review",
        period: "2026 · Q2",
        title: "What changed in the business?",
        deck: "Revenue grew, but review capacity became the constraint. The document should make the bottleneck visible before it celebrates output.",
        metrics: [
          { label: "Revenue", value: "+18%" },
          { label: "Cycle time", value: "−24%" },
          { label: "Review load", value: "+41%" },
        ],
        quote: "The bottleneck moved from generation to judgment.",
        rows: [
          { label: "Generate", value: "2.4× faster" },
          { label: "Review", value: "1.1× faster" },
          { label: "Rework", value: "+16%" },
        ],
        source: "Internal operating data · illustrative",
      },
      proposal: {
        type: "Decision proposal",
        period: "Decision draft · 03",
        title: "Should we fund the second launch?",
        deck: "The proposal puts the decision first, then makes the cost, timing, and uncertainty easy to compare.",
        metrics: [
          { label: "Investment", value: "$480k" },
          { label: "Payback", value: "14 mo" },
          { label: "Confidence", value: "Medium" },
        ],
        quote:
          "The question is not whether growth is possible, but which risk we are willing to own.",
        rows: [
          { label: "Focused launch", value: "Recommended" },
          { label: "Full launch", value: "Higher upside" },
          { label: "Hold", value: "Lowest risk" },
        ],
        source: "Decision model · illustrative",
      },
      manual: {
        type: "Operating manual",
        period: "Runbook · v2.1",
        title: "Restore service without losing state",
        deck: "A calm sequence helps the operator act, verify, and recover without inventing the next step under pressure.",
        metrics: [
          { label: "Target", value: "12 min" },
          { label: "Checks", value: "4" },
          { label: "Rollback", value: "< 2 min" },
        ],
        quote:
          "Do not restart until the snapshot and ownership check are both complete.",
        rows: [
          { label: "01 · Isolate", value: "Stop writes" },
          { label: "02 · Snapshot", value: "Verify state" },
          { label: "03 · Restore", value: "Resume slowly" },
        ],
        source: "Recovery runbook · illustrative",
      },
      essay: {
        type: "Long-form essay",
        period: "Field note · 06",
        title: "When speed moves the bottleneck",
        deck: "Faster generation changes the shape of work. The scarce resource becomes the judgment needed to decide what deserves to survive.",
        metrics: [
          { label: "Drafting", value: "Minutes" },
          { label: "Review", value: "Hours" },
          { label: "Trust", value: "Earned" },
        ],
        quote:
          "Abundance does not remove judgment; it makes judgment more valuable.",
        rows: [
          { label: "Generate", value: "Expand options" },
          { label: "Judge", value: "Choose well" },
          { label: "Publish", value: "Own the result" },
        ],
        source: "Field observation · illustrative",
      },
    },
    stackEyebrow: "02 · Five-layer stack",
    stackTitle: "A preset is still only one layer.",
    stackDescription:
      "A durable visual language starts with the reading job and ends with executable rules. The simulator exposes the middle layers without confusing their identities.",
    stack: [
      { index: "01", name: "Document Genre", role: "reading job" },
      { index: "02", name: "Design Lineage", role: "historical grammar" },
      { index: "03", name: "Style Archetype", role: "working character" },
      { index: "04", name: "Theme Preset", role: "memorable instance" },
      { index: "05", name: "Tokens + Rules", role: "executable behavior" },
    ],
    compareEyebrow: "03 · Read the taxonomy",
    compareTitle: "Three identities share one simulator.",
    compareDescription:
      "The groups tell you what kind of claim each name makes. They are deliberately not presented as peers or universal standards.",
    families: [
      {
        key: "theme",
        count: "2 presets",
        title: "Named themes",
        summary:
          "Local names for a declared implementation. Alder and Granite belong here.",
      },
      {
        key: "lineage",
        count: "4 presets",
        title: "Historical lineages",
        summary:
          "Documented traditions translated into a teaching model, never copied as a costume.",
      },
      {
        key: "archetype",
        count: "6 presets",
        title: "Working archetypes",
        summary:
          "Practical clusters for recurring communication jobs and review conversations.",
      },
    ],
    notStandard:
      "The historical names have documented roots; every simulator mapping is still a contemporary, declared interpretation. The working archetypes and named themes are useful vocabulary, not an industry registry.",
  },
  zh: {
    eyebrow: "01 · 视觉语言模拟器",
    title: "切换设计语法，感受文档怎样变化。",
    description:
      "探索十二种声明过边界的解释：产品主题、历史谱系和工作型原型。每次切换都会改变配色、字体、留白、几何与组件行为，而不只是换一个名字。",
    libraryLabel: "预设库 · 12 个起点",
    libraryHint: "先按身份筛选，再用四条连续轴微调任意预设。",
    filters: {
      all: "全部 12",
      theme: "产品主题",
      lineage: "历史谱系",
      archetype: "工作原型",
    },
    familyNames: {
      theme: "产品内主题",
      lineage: "历史设计谱系",
      archetype: "工作型原型",
    },
    genreLabel: "先选择阅读任务",
    genreHint:
      "同一套视觉语言应该适应文档功能，而不是把所有文档强塞进同一种版式。",
    genres: {
      report: {
        label: "分析报告",
        job: "扫描证据并比较表现",
        rule: "优先保证检索、比较和稳定的数据节奏。",
      },
      proposal: {
        label: "决策提案",
        job: "在可信选项之间做选择",
        rule: "让决策、取舍与证据路径一眼可见。",
      },
      manual: {
        label: "操作手册",
        job: "在压力下准确行动",
        rule: "让顺序、警告、检查点和恢复步骤保持可预测。",
      },
      essay: {
        label: "长篇文章",
        job: "连续阅读并展开一个观点",
        rule: "保护阅读节奏，同时让关键转折拥有足够对比。",
      },
    },
    axes: {
      temperature: { label: "Temperature · 温度", left: "温暖", right: "冷静" },
      geometry: { label: "Geometry · 几何", left: "柔和", right: "硬朗" },
      density: { label: "Density · 密度", left: "疏朗", right: "紧凑" },
      expression: {
        label: "Expression · 表现力",
        left: "克制",
        right: "强表达",
      },
    },
    presets: {
      alder: {
        label: "Alder",
        descriptor: "温暖编辑式",
        note: "产品内部主题：平静、有材料感、容易接近。",
        signature: ["暖纸色", "人文标题", "柔和卡片"],
      },
      granite: {
        label: "Granite",
        descriptor: "冷静机构式",
        note: "产品内部主题：稳定、经过审查、精确。",
        signature: ["冷纸色", "中性无衬线", "稳定网格"],
      },
      swiss: {
        label: "Swiss International",
        descriptor: "客观网格",
        note: "把历史谱系转译为非对称网格、无衬线层级与有纪律的对比。",
        signature: ["非对称网格", "无衬线", "红色强调"],
      },
      bauhaus: {
        label: "Bauhaus",
        descriptor: "几何清晰",
        note: "把历史谱系转译为清楚文字块、强字号跨度与原色几何对比。",
        signature: ["几何字体", "原色", "强字号跨度"],
      },
      deco: {
        label: "Art Deco",
        descriptor: "几何华丽",
        note: "把历史谱系转译为对称、深色漆面、细线与克制金色。",
        signature: ["对称", "高反差", "金色细节"],
      },
      nouveau: {
        label: "Art Nouveau",
        descriptor: "有机装饰",
        note: "把历史谱系转译为流动几何、手工字体感与植物式温暖。",
        signature: ["曲线边框", "有机节奏", "手工衬线"],
      },
      editorial: {
        label: "Modern Editorial",
        descriptor: "叙事节奏",
        note: "适合年报、杂志与图像主导故事的工作型原型。",
        signature: ["衬线对比", "大标题", "节奏模块"],
      },
      luxury: {
        label: "Luxury Editorial",
        descriptor: "安静高级",
        note: "由留白、高反差字体与极少颜色构成的工作型原型。",
        signature: ["大量留白", "展示衬线", "克制金色"],
      },
      institutional: {
        label: "Institutional Modern",
        descriptor: "稳重权威",
        note: "适合治理、金融、咨询与政策文档的工作型原型。",
        signature: ["稳定层级", "冷蓝色", "重复网格"],
      },
      technical: {
        label: "Technical Functional",
        descriptor: "高密精确",
        note: "适合规范、审计、手册与研究记录的工作型原型。",
        signature: ["等宽字体", "硬边界", "高密模块"],
      },
      organic: {
        label: "Organic Humanist",
        descriptor: "温暖清晰",
        note: "适合教育、健康、可持续与个人叙事的工作型原型。",
        signature: ["土地配色", "柔和几何", "人文节奏"],
      },
      minimal: {
        label: "Minimal Contemporary",
        descriptor: "极度克制",
        note: "依靠层级、留白与几乎没有装饰成立的工作型原型。",
        signature: ["单色", "大量留白", "单一强调"],
      },
    },
    custom: "自定义混合",
    customBasedOn: (base) => "保留 " + base + " 结构语法的自定义变体。",
    summary: (name, temperature, geometry, density, expression) =>
      name +
      "：当前是" +
      temperature +
      "、" +
      geometry +
      "、" +
      density +
      "、" +
      expression +
      "。",
    signatureLabel: "可见规则",
    accessibilityLabel: "对比度保护",
    accessibilityPass: "文字与所在表面的对比度保持在 4.5:1 以上",
    exportTitle: "把这套系统带走",
    exportHint:
      "当前选择会被编译成一份可读说明，以及一份机器可读的 token 清单。",
    previewBrief: "视觉语言说明",
    copyBrief: "复制说明",
    downloadJson: "下载 JSON",
    copied: "说明已复制",
    copyFailed: "复制失败，请展开说明并手动复制。",
    downloaded: "JSON 已下载",
    words: {
      warm: "温暖",
      neutral: "中性",
      cool: "冷静",
      soft: "柔和",
      balanced: "平衡",
      hard: "硬朗",
      sparse: "疏朗",
      moderate: "密度适中",
      dense: "紧凑",
      restrained: "克制",
      rhythmic: "有节奏",
      expressive: "强表达",
    },
    documents: {
      report: {
        type: "季度运营复盘",
        period: "2026 · Q2",
        title: "业务究竟发生了什么变化？",
        deck: "收入增长了，但评审能力变成新的约束。文档应该先让读者看见瓶颈，再欣赏产出。",
        metrics: [
          { label: "收入", value: "+18%" },
          { label: "周期", value: "−24%" },
          { label: "评审负荷", value: "+41%" },
        ],
        quote: "瓶颈已经从生成转移到判断。",
        rows: [
          { label: "生成", value: "快 2.4×" },
          { label: "评审", value: "快 1.1×" },
          { label: "返工", value: "+16%" },
        ],
        source: "内部运营数据 · 示意",
      },
      proposal: {
        type: "决策提案",
        period: "决策草案 · 03",
        title: "我们应该投入第二次发布吗？",
        deck: "提案先把决策摆出来，再让成本、时机与不确定性能够被快速比较。",
        metrics: [
          { label: "投入", value: "$480k" },
          { label: "回收期", value: "14 个月" },
          { label: "置信度", value: "中等" },
        ],
        quote: "问题不是增长是否可能，而是我们愿意承担哪一种风险。",
        rows: [
          { label: "聚焦发布", value: "建议采用" },
          { label: "全面发布", value: "更高上限" },
          { label: "暂缓", value: "最低风险" },
        ],
        source: "决策模型 · 示意",
      },
      manual: {
        type: "操作手册",
        period: "Runbook · v2.1",
        title: "在不丢失状态的前提下恢复服务",
        deck: "稳定的步骤让操作者可以执行、核验并恢复，而不必在压力下临时发明下一步。",
        metrics: [
          { label: "目标", value: "12 分钟" },
          { label: "检查点", value: "4" },
          { label: "回滚", value: "< 2 分钟" },
        ],
        quote: "快照和责任人检查都完成之前，不要重启。",
        rows: [
          { label: "01 · 隔离", value: "停止写入" },
          { label: "02 · 快照", value: "核验状态" },
          { label: "03 · 恢复", value: "逐步放量" },
        ],
        source: "恢复手册 · 示意",
      },
      essay: {
        type: "长篇文章",
        period: "观察札记 · 06",
        title: "当速度把瓶颈移到别处",
        deck: "更快的生成改变了工作的形状。真正稀缺的资源，变成判断什么值得留下。",
        metrics: [
          { label: "起草", value: "几分钟" },
          { label: "评审", value: "几小时" },
          { label: "信任", value: "要赢得" },
        ],
        quote: "丰裕不会消除判断；它只会让判断更有价值。",
        rows: [
          { label: "生成", value: "扩大选项" },
          { label: "判断", value: "做出选择" },
          { label: "发布", value: "承担结果" },
        ],
        source: "工作观察 · 示意",
      },
    },
    stackEyebrow: "02 · 五层视觉语言栈",
    stackTitle: "预设仍然只是其中一层。",
    stackDescription:
      "稳定的视觉语言从阅读任务开始，以可执行规则结束。模拟器让中间层变得可感知，同时不混淆它们的身份。",
    stack: [
      { index: "01", name: "Document Genre", role: "阅读任务" },
      { index: "02", name: "Design Lineage", role: "历史语法" },
      { index: "03", name: "Style Archetype", role: "工作性格" },
      { index: "04", name: "Theme Preset", role: "记忆实例" },
      { index: "05", name: "Tokens + Rules", role: "可执行行为" },
    ],
    compareEyebrow: "03 · 读懂分类",
    compareTitle: "三种身份，共用一个模拟器。",
    compareDescription:
      "分类说明每个名字究竟在做什么性质的声明；它们不是同一级别，也不是一套行业标准。",
    families: [
      {
        key: "theme",
        count: "2 个预设",
        title: "产品内主题",
        summary: "给一次具体实现起的本地名字。Alder 和 Granite 属于这一层。",
      },
      {
        key: "lineage",
        count: "4 个预设",
        title: "历史设计谱系",
        summary: "把有记录的传统转译为教学模型，而不是把历史当成外观服装。",
      },
      {
        key: "archetype",
        count: "6 个预设",
        title: "工作型原型",
        summary: "服务于反复出现的沟通任务，也帮助团队讨论与评审。",
      },
    ],
    notStandard:
      "历史名称拥有可追溯来源，但模拟器里的映射仍是当代、声明过边界的解释。工作型原型和产品主题是实用词汇，不是行业注册表。",
  },
};

const copy = computed(() => COPY[props.locale]);
const axisKeys: AxisKey[] = [
  "temperature",
  "geometry",
  "density",
  "expression",
];
const genreKeys: GenreKey[] = ["report", "proposal", "manual", "essay"];
const presetKeys = Object.keys(PRESET_SPECS) as PresetKey[];
const familyFilters: FamilyFilter[] = ["all", "theme", "lineage", "archetype"];
const activeGenre = ref<GenreKey>("report");
const activeFamily = ref<FamilyFilter>("all");
const activePreset = ref<PresetKey | null>("alder");
const basePreset = ref<PresetKey>("alder");
const exportStatus = ref("");
const values = reactive<Record<AxisKey, number>>({
  temperature: PRESET_SPECS.alder.temperature,
  geometry: PRESET_SPECS.alder.geometry,
  density: PRESET_SPECS.alder.density,
  expression: PRESET_SPECS.alder.expression,
});

const visiblePresetKeys = computed(() =>
  activeFamily.value === "all"
    ? presetKeys
    : presetKeys.filter(
        (key) => PRESET_SPECS[key].family === activeFamily.value,
      ),
);
const currentSpec = computed(() => PRESET_SPECS[basePreset.value]);
const currentDocument = computed(() => copy.value.documents[activeGenre.value]);

function mixHex(from: string, to: string, amount: number) {
  const start = from
    .replace("#", "")
    .match(/\w\w/g)
    ?.map((value) => Number.parseInt(value, 16)) || [0, 0, 0];
  const end = to
    .replace("#", "")
    .match(/\w\w/g)
    ?.map((value) => Number.parseInt(value, 16)) || [0, 0, 0];
  const channels = start.map((value, index) =>
    Math.round(value + (end[index] - value) * amount),
  );
  return (
    "#" + channels.map((value) => value.toString(16).padStart(2, "0")).join("")
  );
}

function tuneHex(
  base: string,
  warm: string,
  cool: string,
  delta: number,
  strength = 0.55,
) {
  const target = delta >= 0 ? cool : warm;
  return mixHex(
    base,
    target,
    Math.min((Math.abs(delta) / 100) * strength, 0.5),
  );
}

function relativeLuminance(hex: string) {
  const channels = hex
    .replace("#", "")
    .match(/\w\w/g)
    ?.map((value) => Number.parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    ) || [0, 0, 0];
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(foreground: string, background: string) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function ensureContrast(
  foreground: string,
  backgrounds: string[],
  minimum = 4.5,
) {
  const minimumRatio = (candidate: string) =>
    Math.min(
      ...backgrounds.map((background) => contrastRatio(candidate, background)),
    );

  if (minimumRatio(foreground) >= minimum) return foreground;

  let best = { color: foreground, amount: Number.POSITIVE_INFINITY };
  for (const target of ["#000000", "#ffffff"]) {
    if (minimumRatio(target) < minimum) continue;

    let low = 0;
    let high = 1;
    for (let step = 0; step < 18; step += 1) {
      const amount = (low + high) / 2;
      if (minimumRatio(mixHex(foreground, target, amount)) >= minimum)
        high = amount;
      else low = amount;
    }

    if (high < best.amount)
      best = { color: mixHex(foreground, target, high), amount: high };
  }
  return best.color;
}

function fontStack(mode: string) {
  const stacks: Record<string, string> = {
    humanist: "ui-sans-serif, system-ui, Segoe UI, sans-serif",
    neutral: "ui-sans-serif, system-ui, Arial, sans-serif",
    geometric: "Century Gothic, Trebuchet MS, ui-sans-serif, sans-serif",
    mono: "SFMono-Regular, Menlo, Consolas, ui-monospace, monospace",
    book: "ui-serif, Georgia, Times New Roman, serif",
    editorial: "Georgia, ui-serif, Times New Roman, serif",
    display: "Georgia, ui-serif, Times New Roman, serif",
    decorative: "Palatino Linotype, Book Antiqua, ui-serif, serif",
  };
  return stacks[mode] || stacks.neutral;
}

function applyPreset(key: PresetKey) {
  const preset = PRESET_SPECS[key];
  axisKeys.forEach((axis) => {
    values[axis] = preset[axis];
  });
  basePreset.value = key;
  activePreset.value = key;
}

function markCustom() {
  activePreset.value = null;
}

function wordFor(value: number, low: string, middle: string, high: string) {
  if (value < 40) return low;
  if (value > 65) return high;
  return middle;
}

const temperatureWord = computed(() =>
  wordFor(
    values.temperature,
    copy.value.words.warm,
    copy.value.words.neutral,
    copy.value.words.cool,
  ),
);
const geometryWord = computed(() =>
  wordFor(
    values.geometry,
    copy.value.words.soft,
    copy.value.words.balanced,
    copy.value.words.hard,
  ),
);
const densityWord = computed(() =>
  wordFor(
    values.density,
    copy.value.words.sparse,
    copy.value.words.moderate,
    copy.value.words.dense,
  ),
);
const expressionWord = computed(() =>
  wordFor(
    values.expression,
    copy.value.words.restrained,
    copy.value.words.rhythmic,
    copy.value.words.expressive,
  ),
);
const currentName = computed(() =>
  activePreset.value
    ? copy.value.presets[activePreset.value].label
    : copy.value.custom,
);
const currentDescriptor = computed(() =>
  activePreset.value
    ? copy.value.presets[activePreset.value].descriptor
    : copy.value.presets[basePreset.value].label,
);
const currentNote = computed(() =>
  activePreset.value
    ? copy.value.presets[activePreset.value].note
    : copy.value.customBasedOn(copy.value.presets[basePreset.value].label),
);
const currentSignature = computed(() =>
  activePreset.value
    ? copy.value.presets[activePreset.value].signature
    : props.locale === "zh"
      ? [
          `温度 · ${temperatureWord.value}`,
          `几何 · ${geometryWord.value}`,
          `密度 · ${densityWord.value}`,
          `表现力 · ${expressionWord.value}`,
        ]
      : [
          `Temperature · ${temperatureWord.value}`,
          `Geometry · ${geometryWord.value}`,
          `Density · ${densityWord.value}`,
          `Expression · ${expressionWord.value}`,
        ],
);
const liveSummary = computed(() =>
  copy.value.summary(
    currentName.value,
    temperatureWord.value,
    geometryWord.value,
    densityWord.value,
    expressionWord.value,
  ),
);

function axisValueText(axis: AxisKey) {
  const words: Record<AxisKey, string> = {
    temperature: temperatureWord.value,
    geometry: geometryWord.value,
    density: densityWord.value,
    expression: expressionWord.value,
  };
  return `${values[axis]} / 100 · ${words[axis]}`;
}

function presetSwatchStyle(key: PresetKey) {
  const palette = PRESET_SPECS[key].palette;
  return {
    "--swatch-paper": "#" + palette.paper,
    "--swatch-accent": "#" + palette.accent,
    "--swatch-ink": "#" + palette.ink,
  };
}

const compiledTokens = computed(() => {
  const spec = currentSpec.value;
  const palette = spec.palette;
  const delta = values.temperature - spec.temperature;
  const hard = values.geometry / 100;
  const dense = values.density / 100;
  const expressive = values.expression / 100;
  const paper = tuneHex(palette.paper, "f2dfbc", "e8f1f5", delta);
  const soft = tuneHex(palette.soft, "e9d5b4", "d6e5ea", delta);
  const ink = ensureContrast(
    tuneHex(palette.ink, "3a2c22", "172c3a", delta, 0.28),
    [paper],
    7,
  );
  const muted = ensureContrast(
    tuneHex(palette.muted, "806c55", "5d7482", delta, 0.34),
    [paper, soft],
  );
  const accent = ensureContrast(
    tuneHex(palette.accent, "b26d32", "31749b", delta, 0.42),
    [paper, soft],
  );

  return {
    palette: { paper, ink, muted, accent, soft },
    radius: `${Math.round(24 - hard * 22)}px`,
    border: `${(0.7 + hard * 1.45).toFixed(2)}px`,
    gap: `${Math.round(27 - dense * 13)}px`,
    padding: `${Math.round(50 - dense * 21)}px`,
    mobilePadding: `${Math.round(24 - dense * 8)}px`,
    titleFont: fontStack(spec.titleFont),
    bodyFont: fontStack(spec.bodyFont),
    titleSize: `${(1.65 + expressive * 0.9).toFixed(2)}rem`,
    titleTracking: `${(-0.02 + expressive * -0.035).toFixed(3)}em`,
  };
});

const previewStyle = computed<Record<string, string>>(() => ({
  "--preview-paper": compiledTokens.value.palette.paper,
  "--preview-ink": compiledTokens.value.palette.ink,
  "--preview-muted": compiledTokens.value.palette.muted,
  "--preview-accent": compiledTokens.value.palette.accent,
  "--preview-soft": compiledTokens.value.palette.soft,
  "--preview-radius": compiledTokens.value.radius,
  "--preview-border": compiledTokens.value.border,
  "--preview-gap": compiledTokens.value.gap,
  "--preview-padding": compiledTokens.value.padding,
  "--preview-padding-mobile": compiledTokens.value.mobilePadding,
  "--preview-title": compiledTokens.value.titleFont,
  "--preview-body": compiledTokens.value.bodyFont,
  "--preview-title-size": compiledTokens.value.titleSize,
  "--preview-title-tracking": compiledTokens.value.titleTracking,
}));

const minimumContrast = computed(() => {
  const palette = compiledTokens.value.palette;
  return Math.min(
    contrastRatio(palette.ink, palette.paper),
    contrastRatio(palette.muted, palette.paper),
    contrastRatio(palette.muted, palette.soft),
    contrastRatio(palette.accent, palette.paper),
    contrastRatio(palette.accent, palette.soft),
  );
});

const tokenManifest = computed(() => ({
  version: 1,
  name: currentName.value,
  genre: {
    key: activeGenre.value,
    label: copy.value.genres[activeGenre.value].label,
    readerJob: copy.value.genres[activeGenre.value].job,
  },
  taxonomy: {
    startingPoint: copy.value.presets[basePreset.value].label,
    kind: currentSpec.value.family,
    lineage: currentSpec.value.lineage,
    archetype: currentSpec.value.archetype,
  },
  axes: { ...values },
  tokens: compiledTokens.value,
  componentRules: [
    copy.value.genres[activeGenre.value].rule,
    props.locale === "zh"
      ? `使用${geometryWord.value}几何、${densityWord.value}节奏与${expressionWord.value}层级。`
      : `Use ${geometryWord.value} geometry, ${densityWord.value} spacing, and ${expressionWord.value} hierarchy.`,
    copy.value.accessibilityPass,
  ],
  accessibility: {
    minimumTextContrast: "4.5:1",
    measuredMinimum: `${minimumContrast.value.toFixed(2)}:1`,
    status: "pass",
  },
}));

const visualLanguageBrief = computed(() => {
  const manifest = tokenManifest.value;
  const palette = manifest.tokens.palette;
  if (props.locale === "zh") {
    return `# 视觉语言说明\n\n## 阅读任务\n${manifest.genre.label} — ${manifest.genre.readerJob}\n\n## 视觉栈\n- 设计谱系：${manifest.taxonomy.lineage}\n- 风格原型：${manifest.taxonomy.archetype}\n- 当前主题：${manifest.name}\n\n## 四条坐标轴\n- 温度：${values.temperature}/100（${temperatureWord.value}）\n- 几何：${values.geometry}/100（${geometryWord.value}）\n- 密度：${values.density}/100（${densityWord.value}）\n- 表现力：${values.expression}/100（${expressionWord.value}）\n\n## 核心 Token\n- 纸张：${palette.paper}\n- 正文：${palette.ink}\n- 次要文字：${palette.muted}\n- 强调色：${palette.accent}\n- 圆角：${manifest.tokens.radius}\n- 间距：${manifest.tokens.gap}\n\n## 组件规则\n${manifest.componentRules.map((rule) => `- ${rule}`).join("\n")}\n`;
  }

  return `# Visual Language Brief\n\n## Reader job\n${manifest.genre.label} — ${manifest.genre.readerJob}\n\n## Visual stack\n- Design lineage: ${manifest.taxonomy.lineage}\n- Style archetype: ${manifest.taxonomy.archetype}\n- Current theme: ${manifest.name}\n\n## Four axes\n- Temperature: ${values.temperature}/100 (${temperatureWord.value})\n- Geometry: ${values.geometry}/100 (${geometryWord.value})\n- Density: ${values.density}/100 (${densityWord.value})\n- Expression: ${values.expression}/100 (${expressionWord.value})\n\n## Core tokens\n- Paper: ${palette.paper}\n- Ink: ${palette.ink}\n- Muted text: ${palette.muted}\n- Accent: ${palette.accent}\n- Radius: ${manifest.tokens.radius}\n- Spacing: ${manifest.tokens.gap}\n\n## Component rules\n${manifest.componentRules.map((rule) => `- ${rule}`).join("\n")}\n`;
});

function fallbackCopy(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

async function handleCopyBrief() {
  try {
    if (navigator.clipboard?.writeText)
      await navigator.clipboard.writeText(visualLanguageBrief.value);
    else if (!fallbackCopy(visualLanguageBrief.value))
      throw new Error("Clipboard unavailable");
    exportStatus.value = copy.value.copied;
  } catch {
    exportStatus.value = copy.value.copyFailed;
  }
}

function downloadManifest() {
  const blob = new Blob([JSON.stringify(tokenManifest.value, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `document-visual-language-${activeGenre.value}-${basePreset.value}.json`;
  link.click();
  URL.revokeObjectURL(url);
  exportStatus.value = copy.value.downloaded;
}
</script>

<template>
  <div class="dvl-visual">
    <section class="section-heading">
      <p>{{ copy.eyebrow }}</p>
      <h2>{{ copy.title }}</h2>
      <p>{{ copy.description }}</p>
    </section>

    <section class="theme-lab">
      <div class="genre-selector">
        <div class="genre-heading">
          <p class="panel-label">{{ copy.genreLabel }}</p>
          <p>{{ copy.genreHint }}</p>
        </div>
        <div class="genre-grid" role="group" :aria-label="copy.genreLabel">
          <button
            v-for="genre in genreKeys"
            :key="genre"
            type="button"
            class="genre-button"
            :class="{ active: activeGenre === genre }"
            :aria-pressed="activeGenre === genre"
            @click="activeGenre = genre"
          >
            <strong>{{ copy.genres[genre].label }}</strong>
            <span>{{ copy.genres[genre].job }}</span>
          </button>
        </div>
      </div>

      <div class="preset-library">
        <div class="library-heading">
          <div>
            <p class="panel-label">{{ copy.libraryLabel }}</p>
            <p>{{ copy.libraryHint }}</p>
          </div>
          <div
            class="family-filters"
            role="group"
            :aria-label="copy.libraryLabel"
          >
            <button
              v-for="family in familyFilters"
              :key="family"
              type="button"
              class="filter-button"
              :class="{ active: activeFamily === family }"
              :aria-pressed="activeFamily === family"
              @click="activeFamily = family"
            >
              {{ copy.filters[family] }}
            </button>
          </div>
        </div>

        <div class="preset-grid" role="group" :aria-label="copy.libraryLabel">
          <button
            v-for="key in visiblePresetKeys"
            :key="key"
            type="button"
            class="preset-button"
            :class="{ active: activePreset === key }"
            :aria-pressed="activePreset === key"
            @click="applyPreset(key)"
          >
            <span class="preset-swatches" :style="presetSwatchStyle(key)"
              ><i></i><i></i><i></i
            ></span>
            <small>{{ copy.familyNames[PRESET_SPECS[key].family] }}</small>
            <strong>{{ copy.presets[key].label }}</strong>
            <span>{{ copy.presets[key].descriptor }}</span>
          </button>
        </div>
      </div>

      <div class="lab-workspace">
        <div class="control-panel">
          <div class="axis-list">
            <label v-for="axis in axisKeys" :key="axis" class="axis-control">
              <span class="axis-heading"
                ><strong>{{ copy.axes[axis].label }}</strong
                ><output :for="'dvl-' + axis"
                  >{{ values[axis] }} / 100</output
                ></span
              >
              <input
                :id="'dvl-' + axis"
                v-model.number="values[axis]"
                type="range"
                min="0"
                max="100"
                :aria-label="copy.axes[axis].label"
                :aria-valuetext="axisValueText(axis)"
                @input="markCustom"
              />
              <span class="axis-ends"
                ><span>{{ copy.axes[axis].left }}</span
                ><span>{{ copy.axes[axis].right }}</span></span
              >
            </label>
          </div>

          <div class="compiler-output">
            <span>{{ currentName }}</span>
            <strong>{{ currentDescriptor }}</strong>
            <p>{{ currentNote }}</p>
            <div class="signature-tags" :aria-label="copy.signatureLabel">
              <small>{{ copy.signatureLabel }}</small>
              <span v-for="item in currentSignature" :key="item">{{
                item
              }}</span>
            </div>
            <div class="accessibility-status">
              <span aria-hidden="true">✓</span>
              <p>
                <strong>{{ copy.accessibilityLabel }}</strong
                >{{ copy.accessibilityPass }} ·
                {{ minimumContrast.toFixed(2) }}:1
              </p>
            </div>
            <p class="sr-only">{{ liveSummary }}</p>
          </div>
        </div>

        <div class="preview-stage">
          <article
            class="document-preview"
            :class="'layout-' + basePreset"
            :style="previewStyle"
          >
            <div class="document-meta">
              <span>{{ currentDocument.type }}</span
              ><span>{{ currentDocument.period }}</span>
            </div>
            <div class="document-kicker">
              {{ currentName }} · {{ currentDescriptor }}
            </div>
            <h3>{{ currentDocument.title }}</h3>
            <p class="document-deck">{{ currentDocument.deck }}</p>
            <div class="metric-grid">
              <div
                v-for="metric in currentDocument.metrics"
                :key="metric.label"
                class="metric-card"
              >
                <span>{{ metric.label }}</span
                ><strong>{{ metric.value }}</strong>
              </div>
            </div>
            <blockquote>{{ currentDocument.quote }}</blockquote>
            <table class="document-table">
              <tbody>
                <tr v-for="row in currentDocument.rows" :key="row.label">
                  <th scope="row">{{ row.label }}</th>
                  <td>
                    <strong>{{ row.value }}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <footer>{{ currentDocument.source }}</footer>
          </article>
        </div>
      </div>

      <div class="export-panel">
        <div>
          <p class="panel-label">{{ copy.exportTitle }}</p>
          <p>{{ copy.exportHint }}</p>
        </div>
        <div class="export-actions">
          <button
            type="button"
            class="export-button primary"
            data-dvl-export="brief"
            @click="handleCopyBrief"
          >
            {{ copy.copyBrief }}
          </button>
          <button
            type="button"
            class="export-button"
            data-dvl-export="json"
            @click="downloadManifest"
          >
            {{ copy.downloadJson }}
          </button>
        </div>
        <details class="brief-preview">
          <summary>{{ copy.previewBrief }}</summary>
          <pre>{{ visualLanguageBrief }}</pre>
        </details>
        <p class="export-status" aria-live="polite">{{ exportStatus }}</p>
      </div>
    </section>

    <section class="stack-section">
      <div class="section-heading compact">
        <p>{{ copy.stackEyebrow }}</p>
        <h2>{{ copy.stackTitle }}</h2>
        <p>{{ copy.stackDescription }}</p>
      </div>
      <ol class="stack-list">
        <li v-for="layer in copy.stack" :key="layer.index">
          <span>{{ layer.index }}</span
          ><strong>{{ layer.name }}</strong
          ><small>{{ layer.role }}</small>
        </li>
      </ol>
    </section>

    <section class="compare-section">
      <div class="section-heading compact">
        <p>{{ copy.compareEyebrow }}</p>
        <h2>{{ copy.compareTitle }}</h2>
        <p>{{ copy.compareDescription }}</p>
      </div>
      <div class="family-grid">
        <article
          v-for="family in copy.families"
          :key="family.key"
          class="family-card"
          :class="'family-' + family.key"
        >
          <span>{{ family.count }}</span>
          <h3>{{ family.title }}</h3>
          <p>{{ family.summary }}</p>
        </article>
      </div>
      <p class="standard-note">{{ copy.notStandard }}</p>
    </section>
  </div>
</template>

<style scoped>
.dvl-visual {
  --dvl-ink: var(--foreground);
  --dvl-muted: var(--muted-foreground);
  --dvl-card: var(--card);
  --dvl-secondary: var(--secondary);
  --dvl-border: var(
    --line-card,
    color-mix(in srgb, var(--foreground) 14%, transparent)
  );
  --dvl-amber: #d69b49;
  --dvl-olive: #758264;
  --dvl-blue: #356171;
  display: grid;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  gap: clamp(2.4rem, 7vw, 5rem);
  color: var(--dvl-ink);
}

:global(.dark) .dvl-visual {
  --dvl-blue: #8fbacc;
}

.section-heading {
  max-width: 60rem;
}
.section-heading > p:first-child,
.panel-label {
  margin: 0 0 0.8rem;
  color: var(--dvl-blue);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.76rem;
  font-weight: 760;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.section-heading h2 {
  max-width: 18ch;
  margin: 0;
  color: var(--dvl-ink);
  font-size: clamp(2rem, 5vw, 4.2rem);
  line-height: 0.98;
  letter-spacing: -0.055em;
}
.section-heading > p:last-child {
  max-width: 50rem;
  margin: 1.2rem 0 0;
  color: var(--dvl-muted);
  font-size: clamp(1rem, 2vw, 1.18rem);
  line-height: 1.7;
}
.section-heading.compact h2 {
  max-width: 24ch;
  font-size: clamp(1.8rem, 4vw, 3.25rem);
}

.theme-lab,
.genre-selector,
.preset-library,
.lab-workspace,
.control-panel,
.preview-stage,
.export-panel {
  min-width: 0;
  max-width: 100%;
}
.theme-lab {
  display: grid;
  gap: 1rem;
  padding: clamp(0.7rem, 2vw, 1.2rem);
  border: 1px solid var(--dvl-border);
  border-radius: 2rem;
  background:
    radial-gradient(
      circle at 88% 8%,
      color-mix(in srgb, var(--dvl-blue) 14%, transparent),
      transparent 30%
    ),
    color-mix(in srgb, var(--dvl-secondary) 64%, transparent);
}
.genre-selector {
  padding: clamp(1rem, 3vw, 1.5rem);
  border: 1px solid var(--dvl-border);
  border-radius: 1.45rem;
  background: color-mix(in srgb, var(--dvl-card) 92%, transparent);
}
.genre-heading {
  display: grid;
  grid-template-columns: minmax(10rem, 0.45fr) minmax(0, 1fr);
  align-items: end;
  gap: 1rem;
  margin-bottom: 1rem;
}
.genre-heading p {
  margin: 0;
}
.genre-heading > p:last-child {
  color: var(--dvl-muted);
  font-size: 0.82rem;
  line-height: 1.5;
}
.genre-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.58rem;
}
.genre-button {
  min-height: 5.5rem;
  padding: 0.85rem;
  border: 1px solid var(--dvl-border);
  border-radius: 1rem;
  color: var(--dvl-ink);
  text-align: left;
  background: color-mix(in srgb, var(--dvl-secondary) 70%, transparent);
  cursor: pointer;
}
.genre-button strong,
.genre-button span {
  display: block;
}
.genre-button strong {
  font-size: 0.82rem;
}
.genre-button span {
  margin-top: 0.38rem;
  color: var(--dvl-muted);
  font-size: 0.68rem;
  line-height: 1.35;
}
.genre-button.active {
  border-color: var(--dvl-blue);
  background: color-mix(in srgb, var(--dvl-blue) 12%, var(--dvl-card));
  box-shadow: inset 0 0 0 1px var(--dvl-blue);
}
.preset-library,
.control-panel {
  padding: clamp(1rem, 3vw, 1.5rem);
  border: 1px solid var(--dvl-border);
  border-radius: 1.45rem;
  background: color-mix(in srgb, var(--dvl-card) 92%, transparent);
}
.library-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.library-heading p {
  margin: 0;
}
.library-heading > div:first-child > p:last-child {
  max-width: 42rem;
  color: var(--dvl-muted);
  font-size: 0.82rem;
  line-height: 1.5;
}
.family-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.38rem;
}
.filter-button {
  min-height: 2.75rem;
  padding: 0.48rem 0.78rem;
  border: 1px solid var(--dvl-border);
  border-radius: 99px;
  color: var(--dvl-muted);
  background: color-mix(in srgb, var(--dvl-secondary) 70%, transparent);
  cursor: pointer;
  font-size: 0.72rem;
}
.filter-button.active {
  border-color: color-mix(in srgb, var(--dvl-blue) 70%, var(--dvl-border));
  color: var(--dvl-ink);
  background: color-mix(in srgb, var(--dvl-blue) 13%, var(--dvl-card));
}
.preset-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.58rem;
}
.preset-button {
  min-width: 0;
  min-height: 7.4rem;
  padding: 0.82rem;
  border: 1px solid var(--dvl-border);
  border-radius: 1rem;
  color: var(--dvl-ink);
  text-align: left;
  background: color-mix(in srgb, var(--dvl-secondary) 70%, transparent);
  cursor: pointer;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    transform 180ms ease;
}
.preset-button:hover {
  transform: translateY(-2px);
}
.preset-button.active {
  border-color: color-mix(in srgb, var(--dvl-blue) 72%, var(--dvl-border));
  background: color-mix(in srgb, var(--dvl-blue) 13%, var(--dvl-card));
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--dvl-blue) 32%, transparent);
}
.preset-button strong,
.preset-button > span:last-child,
.preset-button small {
  display: block;
}
.preset-button small {
  margin-top: 0.62rem;
  color: var(--dvl-blue);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.58rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.preset-button strong {
  margin-top: 0.28rem;
  overflow-wrap: anywhere;
  font-size: 0.9rem;
  line-height: 1.15;
}
.preset-button > span:last-child {
  margin-top: 0.3rem;
  color: var(--dvl-muted);
  font-size: 0.68rem;
  line-height: 1.3;
}
.preset-swatches {
  display: flex;
  height: 0.58rem;
  overflow: hidden;
  border-radius: 99px;
}
.preset-swatches i {
  flex: 1;
  background: var(--swatch-paper);
}
.preset-swatches i:nth-child(2) {
  background: var(--swatch-accent);
}
.preset-swatches i:nth-child(3) {
  background: var(--swatch-ink);
}

.lab-workspace {
  display: grid;
  grid-template-columns: minmax(18rem, 0.72fr) minmax(0, 1.28fr);
  gap: clamp(1rem, 3vw, 1.8rem);
}
.axis-list {
  display: grid;
  gap: 1.18rem;
}
.axis-control {
  display: grid;
  gap: 0.52rem;
}
.axis-heading,
.axis-ends {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.axis-heading strong {
  font-size: 0.82rem;
}
.axis-heading output,
.axis-ends {
  color: var(--dvl-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.68rem;
}
.axis-control input {
  width: 100%;
  min-height: 2.75rem;
  margin: -0.72rem 0;
  accent-color: var(--dvl-blue);
  cursor: pointer;
  touch-action: pan-y;
}
.compiler-output {
  margin-top: 1.5rem;
  padding: 1rem;
  border-left: 4px solid var(--dvl-amber);
  border-radius: 0 1rem 1rem 0;
  background: color-mix(in srgb, var(--dvl-amber) 10%, var(--dvl-card));
}
.compiler-output > span,
.compiler-output > strong {
  display: block;
}
.compiler-output > span {
  color: var(--dvl-muted);
  font-size: 0.72rem;
  text-transform: uppercase;
}
.compiler-output > strong {
  margin-top: 0.26rem;
  font-size: 1.05rem;
}
.compiler-output > p {
  margin: 0.65rem 0 0;
  color: var(--dvl-muted);
  font-size: 0.82rem;
  line-height: 1.5;
}
.signature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.36rem;
  margin-top: 0.9rem;
}
.signature-tags small {
  width: 100%;
  color: var(--dvl-muted);
  font-size: 0.62rem;
  text-transform: uppercase;
}
.signature-tags span {
  padding: 0.28rem 0.48rem;
  border: 1px solid var(--dvl-border);
  border-radius: 99px;
  color: var(--dvl-muted);
  font-size: 0.65rem;
  background: color-mix(in srgb, var(--dvl-card) 70%, transparent);
}
.accessibility-status {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  margin-top: 0.95rem;
  padding-top: 0.8rem;
  border-top: 1px solid var(--dvl-border);
  color: var(--dvl-muted);
}
.accessibility-status > span {
  display: grid;
  width: 1.3rem;
  height: 1.3rem;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: var(--dvl-card);
  background: var(--dvl-olive);
  font-size: 0.7rem;
  font-weight: 800;
}
.accessibility-status p {
  margin: 0;
  font-size: 0.7rem;
  line-height: 1.45;
}
.accessibility-status strong {
  display: block;
  color: var(--dvl-ink);
  font-size: 0.68rem;
  text-transform: uppercase;
}

.preview-stage {
  display: grid;
  min-width: 0;
  place-items: center;
  padding: clamp(0.7rem, 3vw, 2.2rem);
  border: 1px solid color-mix(in srgb, var(--dvl-border) 70%, transparent);
  border-radius: 1.45rem;
  background:
    linear-gradient(
      color-mix(in srgb, var(--dvl-ink) 4%, transparent) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--dvl-ink) 4%, transparent) 1px,
      transparent 1px
    );
  background-size: 34px 34px;
}
.document-preview {
  position: relative;
  width: min(100%, 44rem);
  padding: var(--preview-padding);
  overflow: hidden;
  border: var(--preview-border) solid
    color-mix(in srgb, var(--preview-ink) 24%, transparent);
  border-radius: var(--preview-radius);
  color: var(--preview-ink);
  background: var(--preview-paper);
  box-shadow: 0 2.4rem 5rem color-mix(in srgb, var(--dvl-ink) 18%, transparent);
  transition:
    color 220ms ease,
    background 220ms ease,
    border-radius 220ms ease,
    padding 220ms ease,
    box-shadow 220ms ease;
}
.document-preview > * {
  position: relative;
  z-index: 1;
}
.document-preview::before {
  position: absolute;
  z-index: 0;
  content: "";
  pointer-events: none;
}
.document-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid
    color-mix(in srgb, var(--preview-ink) 22%, transparent);
  color: var(--preview-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.62rem;
  text-transform: uppercase;
}
.document-kicker {
  margin-top: var(--preview-gap);
  color: var(--preview-accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}
.document-preview h3 {
  max-width: 14ch;
  margin: 0.65rem 0 0;
  font-family: var(--preview-title);
  font-size: var(--preview-title-size);
  line-height: 0.98;
  letter-spacing: var(--preview-title-tracking);
}
.document-deck {
  max-width: 52ch;
  margin: 0.85rem 0 0;
  color: var(--preview-muted);
  font-family: var(--preview-body);
  font-size: 0.78rem;
  line-height: 1.55;
}
.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: calc(var(--preview-gap) * 0.48);
  margin-top: var(--preview-gap);
}
.metric-card {
  padding: 0.75rem;
  border: var(--preview-border) solid
    color-mix(in srgb, var(--preview-ink) 19%, transparent);
  border-radius: calc(var(--preview-radius) * 0.48);
  background: color-mix(in srgb, var(--preview-soft) 76%, transparent);
}
.metric-card span,
.metric-card strong {
  display: block;
}
.metric-card span {
  color: var(--preview-muted);
  font-size: 0.58rem;
}
.metric-card strong {
  margin-top: 0.3rem;
  font-family: var(--preview-title);
  font-size: 1.15rem;
}
.document-preview blockquote {
  margin: var(--preview-gap) 0 0;
  padding: 0.8rem 0 0.8rem 1rem;
  border-left: 3px solid var(--preview-accent);
  color: var(--preview-ink);
  font-family: var(--preview-title);
  font-size: 0.9rem;
  line-height: 1.4;
}
.document-table {
  width: 100%;
  margin-top: calc(var(--preview-gap) * 0.72);
  border-collapse: collapse;
  border-top: 1px solid color-mix(in srgb, var(--preview-ink) 24%, transparent);
  font-family: var(--preview-body);
  font-size: 0.68rem;
}
.document-table th,
.document-table td {
  padding: 0.58rem 0;
  border-bottom: 1px solid
    color-mix(in srgb, var(--preview-ink) 16%, transparent);
}
.document-table th {
  color: var(--preview-muted);
  font-weight: 400;
  text-align: left;
}
.document-table td {
  text-align: right;
}
.document-preview footer {
  margin-top: var(--preview-gap);
  color: var(--preview-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.56rem;
}

.export-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem 1.5rem;
  padding: clamp(1rem, 3vw, 1.5rem);
  border: 1px solid var(--dvl-border);
  border-radius: 1.45rem;
  background: color-mix(in srgb, var(--dvl-card) 92%, transparent);
}
.export-panel p {
  margin: 0;
}
.export-panel > div:first-child > p:last-child {
  max-width: 42rem;
  color: var(--dvl-muted);
  font-size: 0.82rem;
  line-height: 1.5;
}
.export-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}
.export-button {
  min-height: 2.75rem;
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--dvl-border);
  border-radius: 0.8rem;
  color: var(--dvl-ink);
  background: color-mix(in srgb, var(--dvl-secondary) 70%, transparent);
  cursor: pointer;
  font-size: 0.76rem;
  font-weight: 700;
}
.export-button.primary {
  border-color: var(--dvl-ink);
  color: var(--dvl-card);
  background: var(--dvl-ink);
}
.brief-preview {
  grid-column: 1 / -1;
  min-width: 0;
  border-top: 1px solid var(--dvl-border);
}
.brief-preview summary {
  width: fit-content;
  padding: 0.9rem 0 0;
  color: var(--dvl-blue);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 750;
}
.brief-preview pre {
  max-height: 22rem;
  margin: 0.85rem 0 0;
  padding: 1rem;
  overflow: auto;
  border: 1px solid var(--dvl-border);
  border-radius: 0.9rem;
  color: var(--dvl-ink);
  background: color-mix(in srgb, var(--dvl-secondary) 64%, transparent);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.7rem;
  line-height: 1.65;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.export-status {
  grid-column: 1 / -1;
  min-height: 1.25rem;
  color: var(--dvl-muted);
  font-size: 0.7rem;
}

.layout-swiss {
  border-top: 0.52rem solid var(--preview-accent);
  border-radius: 0;
}
.layout-swiss h3 {
  max-width: 10ch;
  font-family: var(--preview-title);
  text-transform: lowercase;
}
.layout-swiss .document-kicker {
  display: inline-block;
  padding: 0.24rem 0.36rem;
  color: var(--preview-paper);
  background: var(--preview-accent);
}
.layout-swiss blockquote {
  margin-left: 14%;
}
.layout-bauhaus::before {
  top: -5rem;
  right: -4rem;
  width: 12rem;
  height: 12rem;
  border: 2.4rem solid var(--preview-soft);
  border-radius: 50%;
  opacity: 0.82;
}
.layout-bauhaus {
  border-radius: 0;
  box-shadow: 1rem 1rem 0
    color-mix(in srgb, var(--preview-ink) 92%, transparent);
}
.layout-bauhaus h3 {
  max-width: 11ch;
  text-transform: lowercase;
}
.layout-bauhaus .metric-card {
  border: 0;
  border-radius: 0;
}
.layout-deco {
  border: 0.32rem double var(--preview-accent);
  border-radius: 0.15rem;
  box-shadow: 0 2rem 5rem color-mix(in srgb, #000 42%, transparent);
}
.layout-deco .document-meta,
.layout-deco .document-kicker,
.layout-deco h3,
.layout-deco .document-deck {
  text-align: center;
}
.layout-deco h3,
.layout-deco .document-deck {
  margin-left: auto;
  margin-right: auto;
}
.layout-deco h3 {
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.layout-deco .metric-card {
  border-width: 1px;
  background: transparent;
}
.layout-nouveau::before {
  inset: -22% -18% auto auto;
  width: 19rem;
  height: 19rem;
  border: 1.4rem double var(--preview-soft);
  border-radius: 45% 55% 36% 64%;
  transform: rotate(24deg);
}
.layout-nouveau {
  border-radius: calc(var(--preview-radius) * 2.4)
    calc(var(--preview-radius) * 0.8);
}
.layout-nouveau h3 {
  font-style: italic;
}
.layout-nouveau blockquote {
  border-left: 0;
  border-bottom: 2px solid var(--preview-accent);
  font-style: italic;
}
.layout-editorial h3 {
  max-width: 12ch;
  font-size: calc(var(--preview-title-size) * 1.12);
}
.layout-editorial .metric-card {
  border-width: 0 0 1px;
  border-radius: 0;
  background: transparent;
}
.layout-editorial blockquote {
  max-width: 75%;
  margin-left: auto;
  font-size: 1.05rem;
}
.layout-luxury .document-meta,
.layout-luxury .document-kicker,
.layout-luxury h3,
.layout-luxury .document-deck {
  text-align: center;
}
.layout-luxury h3,
.layout-luxury .document-deck {
  margin-left: auto;
  margin-right: auto;
}
.layout-luxury h3 {
  max-width: 16ch;
  letter-spacing: 0.075em;
  text-transform: uppercase;
}
.layout-luxury .metric-card {
  border: 0;
  background: transparent;
}
.layout-institutional {
  box-shadow:
    inset 0.42rem 0 var(--preview-accent),
    0 2.4rem 5rem color-mix(in srgb, var(--dvl-ink) 18%, transparent);
}
.layout-technical * {
  font-family: var(--preview-body) !important;
}
.layout-technical {
  border-radius: 0;
}
.layout-technical .metric-card {
  border-radius: 0;
}
.layout-technical h3 {
  text-transform: uppercase;
  letter-spacing: -0.02em;
}
.layout-organic::before {
  right: -5rem;
  bottom: -7rem;
  width: 17rem;
  height: 17rem;
  border-radius: 57% 43% 61% 39%;
  background: color-mix(in srgb, var(--preview-soft) 72%, transparent);
  transform: rotate(-18deg);
}
.layout-organic {
  border-radius: calc(var(--preview-radius) * 1.8);
}
.layout-organic .metric-card {
  border-color: transparent;
}
.layout-minimal {
  border-color: transparent;
  box-shadow: 0 1.2rem 3.5rem
    color-mix(in srgb, var(--dvl-ink) 10%, transparent);
}
.layout-minimal .document-kicker {
  color: var(--preview-ink);
}
.layout-minimal .metric-card {
  padding-left: 0;
  border-width: 1px 0 0;
  border-radius: 0;
  background: transparent;
}
.layout-minimal blockquote {
  border-left-width: 1px;
}

.stack-section,
.compare-section {
  padding: clamp(1.2rem, 4vw, 2.2rem);
  border: 1px solid var(--dvl-border);
  border-radius: 1.8rem;
  background: color-mix(in srgb, var(--dvl-card) 86%, transparent);
}
.stack-list {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.62rem;
  margin: 2rem 0 0;
  padding: 0;
  list-style: none;
}
.stack-list li {
  position: relative;
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--dvl-border);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--dvl-secondary) 68%, transparent);
}
.stack-list li:not(:last-child)::after {
  content: "→";
  position: absolute;
  z-index: 2;
  top: 50%;
  right: -0.66rem;
  color: var(--dvl-blue);
  font-weight: 800;
  transform: translateY(-50%);
}
.stack-list span,
.stack-list strong,
.stack-list small {
  display: block;
}
.stack-list span {
  color: var(--dvl-blue);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.66rem;
}
.stack-list strong {
  margin-top: 1rem;
  overflow-wrap: anywhere;
  font-size: 0.86rem;
}
.stack-list small {
  margin-top: 0.34rem;
  color: var(--dvl-muted);
  font-size: 0.7rem;
  line-height: 1.4;
}
.family-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.72rem;
  margin-top: 2rem;
}
.family-card {
  padding: 1.15rem;
  border: 1px solid var(--dvl-border);
  border-radius: 1.1rem;
  background: color-mix(in srgb, var(--dvl-secondary) 64%, transparent);
}
.family-card > span {
  color: var(--dvl-blue);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.66rem;
  text-transform: uppercase;
}
.family-card h3 {
  margin: 0.72rem 0 0;
  font-size: 1rem;
}
.family-card p {
  margin: 0.48rem 0 0;
  color: var(--dvl-muted);
  font-size: 0.78rem;
  line-height: 1.55;
}
.family-theme {
  box-shadow: inset 0 3px var(--dvl-amber);
}
.family-lineage {
  box-shadow: inset 0 3px var(--dvl-blue);
}
.family-archetype {
  box-shadow: inset 0 3px var(--dvl-olive);
}
.standard-note {
  max-width: 55rem;
  margin: 1rem 0 0;
  color: var(--dvl-muted);
  font-size: 0.84rem;
  line-height: 1.55;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
button:focus-visible,
input:focus-visible {
  outline: 3px solid var(--dvl-blue);
  outline-offset: 3px;
}

@media (max-width: 1000px) {
  .preset-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .lab-workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .genre-heading {
    grid-template-columns: 1fr;
  }
  .genre-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .library-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .family-filters {
    justify-content: flex-start;
  }
  .export-panel {
    grid-template-columns: 1fr;
  }
  .export-actions {
    justify-content: flex-start;
  }
  .stack-list,
  .family-grid {
    grid-template-columns: 1fr;
  }
  .stack-list li:not(:last-child)::after {
    top: auto;
    right: 1rem;
    bottom: -0.78rem;
    transform: rotate(90deg);
  }
}

@media (max-width: 560px) {
  .theme-lab {
    padding: 0.55rem;
    border-radius: 1.35rem;
  }
  .genre-grid {
    grid-template-columns: 1fr;
  }
  .genre-button {
    min-height: 4.7rem;
  }
  .genre-selector,
  .preset-library,
  .control-panel,
  .preview-stage,
  .export-panel {
    border-radius: 1rem;
  }
  .family-filters {
    width: 100%;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.2rem;
  }
  .filter-button {
    flex: 0 0 auto;
  }
  .preset-grid {
    display: flex;
    width: 100%;
    max-width: 100%;
    gap: 0.58rem;
    overflow-x: auto;
    margin: 0;
    padding-right: 1rem;
    padding-bottom: 0.5rem;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
  }
  .preset-button {
    flex: 0 0 min(72vw, 14rem);
    scroll-snap-align: start;
  }
  .export-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .export-button {
    width: 100%;
  }
  .document-preview {
    padding: var(--preview-padding-mobile) !important;
  }
  .document-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.3rem;
  }
  .metric-grid {
    grid-template-columns: 1fr;
  }
  .layout-editorial blockquote {
    max-width: 100%;
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
