# World — Aaron's Digital Twin

Aaron 世界的结构化 ontology。由 GG 维护，跨设备、跨 agent 共享的认知地图。

## 用途
- 快速回答"如果 X 发生会怎样"类的假设推演
- 跟踪关系、项目、决策的演化时间线
- 为 strategic 决策提供 graph-level 视角
- 人类可读 + grep-able + git versioned

## 结构
```
world/
├── INDEX.md           ← 整个图的地图 + 快速索引
├── people/            ← 人物节点
├── orgs/              ← 组织节点
├── projects/          ← 项目节点
└── themes/            ← 长期主题（横跨人和项目的线）
```

## 维护约定
- 节点 = markdown 文件
- 关系 = 文件内 `[[link]]` 引用
- 每次重要事件后更新相关节点的 Observations timeline
- INDEX.md 作为导航，不作为事实 source of truth
- 每月 review 一次结构，必要时重构

## 访问
- Canonical: `aaron-studio/src/brain/world/`
- OpenClaw symlink: `~/.openclaw/workspace/memory/world/`

## 隐私
这个目录包含敏感的人物观察和 political analysis。**aaron-studio 必须保持 private repo。** 不要 fork、不要邀请 collaborator 而不隔离这个目录。
