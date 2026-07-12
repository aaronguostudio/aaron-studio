# 论证备忘录

## 核心论点

ChatGPT Work 与 Claude Cowork 的竞争不是“哪个模型更聪明”，而是谁能拥有并连接知识工作的四个平面：上下文、执行、交付物与控制；ChatGPT Work 当前赢在产品表面积，Claude Cowork 当前赢在文件、插件和 Office 工作流的成熟证据，但金融团队真正应该选择的是能把来源、例外、审批和恢复贯穿整次 run 的系统。

## 为什么现在值得写

- 2026-07-07，Claude Cowork 从桌面扩展到 web/mobile 云端；2026-07-09，OpenAI 推出 ChatGPT Work。两家公司在 48 小时内把产品边界推到几乎相同的位置。
- 市场报道仍停留在“AI coworker”“谁会替代白领”“功能数量”，缺少对实际工作架构的判断。
- Aaron 二月的金融插件文章已经证明读者关心真实产物、数据连接、技能文件和合规，而不是抽象模型新闻。这篇文章可以把那个结论升级到 workspace 层。

## 机制解释

1. **模型能力被产品架构放大或削弱。** 同一个模型如果不能访问正确文件、应用或数据，只能给出答案，无法完成工作。
2. **长任务把状态变成核心资产。** agent 一旦跨应用、跨设备、跨时间运行，上下文、记忆、权限、任务历史和恢复路径都会成为工作的一部分。
3. **金融价值最终落在交付物。** 研究、模型、commentary 和 deck 必须形成可编辑、可复核、可追溯的文件，而不是只在聊天窗口里看起来正确。
4. **控制面决定能否部署。** 机构需要知道谁授权、什么被读取、哪些步骤需要批准、错误如何暴露、输出如何复原、流程资产归谁所有。
5. **因此产品竞争从模型层上移。** 插件、skills、浏览器、local/cloud runtime、Office 集成、定时任务和治理共同构成 work control plane。

## 证据地图

### 事实

- OpenAI 官方：Work 连接 apps/files，支持插件、内置浏览器、Sites、scheduled/event tasks，desktop 可操作本地文件和应用；cloud 与 desktop Work 会话在发布时仍割裂。
- Anthropic 官方：Cowork 已支持 web/mobile 云端、后台与离线 scheduled tasks、file-native desktop、plugins、computer use；金融插件覆盖 Excel/PowerPoint 与机构数据连接器。
- 两家都已经把 finance 作为核心工作场景，并分别提供 Excel 产品和金融数据集成。

### 可见案例

- ChatGPT Work launch-day walkthrough：约 15 分钟产生带来源的 10 页 `.pptx`。
- Jeff Su Cowork walkthrough：100+ 收据变成含 84 行、两张表、公式和 VERIFY 例外的 `.xlsx`；另一任务把图片式 slides 重建为可编辑 PowerPoint。
- Claude 官方：云端定时 QBR prep 从 email/Slack 拉取上下文并在设备离线时运行。

### 成熟度摩擦

- Cowork 社区出现 weekly limit 抱怨。
- 更新后历史/工作丢失的单个事故引发“把 memory 放进 files/git/cloud”的高赞建议。
- ChatGPT Work 只有一天观察窗口，几乎没有足够的长期失败样本；这不是没有问题，而是证据尚未成熟。

## 需要承认的反方观点

1. 两者会快速趋同，今天的 feature lead 很快过时。
2. 同时使用两个产品可能比选一个更现实。
3. YouTube demo 不能代表生产级金融工作。
4. 真正区别可能只是底层模型，workspace 功能最终商品化。

## 对反方的回应

- 快速趋同正是不能按静态功能表选型的理由；四平面方法比较的是组织工作结构。
- 混合栈仍需定义数据、审批、日志和责任边界，否则只是把碎片化从应用层搬到 agent 层。
- 文章把 demo 限定为“可见的单次产物”，不把它写成稳定性、ROI 或普遍质量。
- 模型可以更换，但组织的 skills、评估集、权限、审计历史、runbooks 和可恢复流程会长期积累。

## 可复用框架

### AI workspace 的四个平面

1. **Context plane**：来源数据、历史、项目规则和机构知识在哪里，能否版本化与迁移。
2. **Execution plane**：任务在 cloud 还是 local 运行，能访问哪些工具，能否定时、并行、跨设备继续。
3. **Artifact plane**：输出是否是公式、链接、文本框和来源仍可编辑的真实交付物，是否显式暴露例外。
4. **Control plane**：权限、批准、lineage、日志、成本、恢复与流程所有权由谁控制。

框架只保留这一个，不再叠加 ACTOR 或第二套 checklist。

## 对读者的启发

- 不要采购“最聪明的 agent”，先选择一个真实工作流做对照试验。
- 金融 pilot 应覆盖：模拟月结资料 → 数据核对 → 模型更新 → variance commentary → deck → exception log。
- 评估时记录每个平面：来源是否完整、工具调用是否可见、产物是否可编辑、例外是否被标记、审批与恢复是否存在。
- 真正可复用的资产应留在组织手里：skills、模板、评估集、权限规则、审计历史和运行手册。
