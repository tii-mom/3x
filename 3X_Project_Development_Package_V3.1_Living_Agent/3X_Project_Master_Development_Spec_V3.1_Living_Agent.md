# 3X — Project Master Development Specification V3.1 Living Agent

> **Implementation Ready / Testnet & Beta Scope**  
> This document supersedes V3.0 for new development. Detailed machine-readable schemas and AI Studio prompts are in the ZIP package.



---

# 3X V3.1 Living Agent — AI Implementation Start Here

**版本：** V3.1 — Implementation Ready  
**日期：** 2026-09-12  
**目标仓库：** `yi-17-lab/3X`  
**基线 Commit：** `9ea8d3c9f3cd04e62077667e1b9357ce6c10c811`  
**开发策略：** **Keep infrastructure. Rewrite product.**

本目录是 3X 当前唯一开发 Source of Truth。V3.0 作为历史基线保留，不再作为新开发的直接指令。任何 AI 编程工具、人类工程师、测试人员都必须先阅读本文件，再按“权威顺序”阅读对应规范。

## 一句话产品定义

> **免费领一个会工作的 AI；只有值得的时候才让它消耗高级资源，让它替用户创造可验证的经济价值，并在工作中成长。**

英文：

> **Raise an AI. Give it skills. Let it work. Watch it grow.**

用户第一天只需要理解：

`免费领 AI → 激活 → AI 工作 → 养 → 强 → 赚 → 进化 → 分享`

后台可以复杂，前台必须极简。

## 开发前必须理解的 10 条不变量

1. **用户核心目标只有一个：让 AI 帮我赚钱。** 所有玩法、视觉、Token、Skill、Energy 都必须服务这一目标。
2. **第一只 AI 免费领取。** 钱包和 TON Gas 不阻挡用户先获得 AI 和免费体验。
3. **只有 Primary AI 享受协议 Seed/Growth 补贴。** 额外 AI 不重复套补贴。
4. **Token 不是按“思考次数”扣费。** 3X 用于购买生产资料和经济权益；高级算力抽象为 Energy。
5. **No Value, No Premium Compute。** Value Router 先判断值不值得花高级 Energy，再调用昂贵模型/工具。
6. **LLM 不是整只 AI。** Agent Runtime 使用 Sparse Activation：确定性规则、Skill Circuit、记忆、模型、数学、Risk Engine 协同工作。
7. **Living Brain 是反馈层，不是新的复杂主导航。** 用户只在 AI 工作、学习、进化和 Replay 时看到简化 Brain Trace。
8. **Risk Engine 永不可被 AI 学习或绕过。** Model、Skill、learning update、Energy 状态都不能覆盖硬风控。
9. **Token 价格上涨不计入 Growth。** 3X/9X/27X/81X/243X 由 Qualified Net Earnings 决定。
10. **Testnet 与 Mainnet 严格隔离。** 当前实现只允许 Demo/Testnet；未经 Gate 不得部署 Mainnet Token、LP、Team Unlock 或真钱高风险策略。

## 权威阅读顺序

1. `01_EXECUTIVE_PRODUCT_SPEC.md`
2. `02_USER_JOURNEY_AND_UX.md`
3. `03_TOKENOMICS_AND_ECONOMIC_RULES.md`
4. `04_AGENT_CONNECTOME_AND_VALUE_ROUTER.md`
5. `05_SKILL_AND_ENERGY_SYSTEM.md`
6. `06_TECHNICAL_ARCHITECTURE.md`
7. `07_SMART_CONTRACT_SPEC.md`
8. `08_BACKEND_AND_LEDGER_SPEC.md`
9. `09_FRONTEND_CLEAN_REWRITE_SPEC.md`
10. `10_DATA_API_EVENT_SPEC.md`
11. `11_SECURITY_THREAT_MODEL.md`
12. `12_TESTNET_BETA_AND_ANALYTICS.md`
13. `13_ACCEPTANCE_CRITERIA.md`
14. `14_DEVELOPMENT_ROADMAP.md`
15. `15_NARRATIVE_AND_GROWTH.md`
16. `16_3X_LABS_MALECNS.md`
17. `17_OPEN_DECISIONS_AND_PARAMETER_REGISTRY.md`
18. `18_REPO_REUSE_MATRIX.md`
19. `ai_studio/00_IMPLEMENTATION_MANIFEST.md` 以及按阶段 Prompt。

机器可读规范：

- `schemas/db_schema.sql`
- `schemas/openapi.yaml`
- `schemas/event_catalog.yaml`
- `configs/parameter_registry.yaml`
- `configs/feature_flags.json`
- `configs/mock_agent_fixture.json`

## AI 编程工具的工作方式

不要一次“重写整个项目”。必须按 Gate 实施：

- **Gate 1：Product Shell** — 全部 Mock；重新构建 Landing / Claim / AI Home / Skills / Energy / Market / Activity / Me。
- **Gate 2：Domain Engine** — 状态机、Value Router、Skill Circuit、Brain Trace、经济账户模型；仍可 Mock Backend。
- **Gate 3：TON Testnet** — TON owner wallet、Agentic Wallet activation、Gas、交易预览；绝不接 Mainnet。
- **Gate 4：Economic Backend** — Ledger、Restricted Seed、Qualified Earnings、Growth Entitlement/Claim、Energy、Skill、Task。
- **Gate 5：Beta Instrumentation** — 50 → 200 → 1,000 AI，观察真实数据，禁止提前冻结 Mainnet 参数。

每个 Gate 必须通过 `13_ACCEPTANCE_CRITERIA.md` 的对应测试后再进入下一 Gate。

## 绝对禁止 AI 擅自做的事情

- 不允许发真实 3X Mainnet Token。
- 不允许把私钥、operator key、seed phrase、KMS credential 放入前端、日志或 LLM Context。
- 不允许 LLM 生成任意可执行 raw contract payload。
- 不允许把 Growth Vault 显示成可提现钱包余额。
- 不允许把 Protocol Seed 显示成“注册送币”。
- 不允许把 3X、9X 等写成承诺回报或固定收益。
- 不允许使用 Token USD 价格触发 AI 等级。
- 不允许用户因为 Energy=0 而失去安全保护。
- 不允许为了“烧币”制造无意义 Token 消耗。
- 不允许把 MaleCNS/果蝇 Connectome 放进真钱 Production Agent 的决策路径。

## 完成定义

MVP 的最终闭环不是“页面做完”，而是：

`Free AI → Testnet Activate → Restricted Seed → Find/Receive Opportunity → Value Router → Skill Circuit → Risk Gate → Execute/Simulate → Qualified Earnings → 3X Progress → Testnet Growth Claim → Evolution → Replay/Share`

且所有经济变化可审计、所有高级算力有价值理由、所有执行行为可追踪、所有安全硬约束可验证。


---

# 3X V3.1 — Executive Product Specification

## 1. 产品定位

3X 是面向 Telegram Mini App + Web 的 **AI Agent Economy**。用户不是来“配置一个机器人”，而是免费领一只会工作的 AI，让它在明确的资金和风险边界内寻找任务、服务、交易和市场机会；用户通过 Skill 和 Energy 强化它；AI 产生 Qualified Economic Output 后进化并解锁 Growth entitlement。

**产品核心不是聊天，而是工作结果。**

用户唯一核心需求：

> **这个东西能不能帮我赚钱？**

因此产品优化顺序固定为：

`结果 > 成本效率 > 信任 > 情绪反馈 > 玩法 > 技术炫技`

## 2. 黄峥式产品原则

### 2.1 极低门槛

- 第一只 AI 免费 Claim。
- Claim 前不需要钱包。
- 免费用户可体验 Base Core、模拟任务、Paper Result、基础 Energy。
- 只有准备上链或使用真钱经营时才要求连接 TON wallet。
- 不在 Day 0 教用户 DeFi、模型 Token、Signer、Connectome。

### 2.2 先给价值，再让用户付出

第一天目标不是卖 Skill、Energy 或 Token，而是让用户看到一次真实/模拟的“AI 工作反馈”：

`发现机会 → 判断值得 → 执行/模拟 → 产生结果 → 解释为什么`

免费补贴优先给“第一次成功体验”，而不是简单注册送可卖 Token。

### 2.3 把供应链复杂度藏在平台后面

用户看：`Energy 82%`。  
平台内部才处理：模型路由、API 计费、缓存、并发、KMS、交易模拟、风险规则、适配器。

### 2.4 平台与用户利益一致

平台优先收入：

`Premium Compute/Energy margin > External Task Fee > Marketplace Fee > Agent Service Fee > Skill Primary Sales > Capsule`

原则：**Platform earns when AI works / earns.**

### 2.5 成长必须可感知

用户花资源后必须得到至少一种即时反馈：

- 经济价值：赚到任务/服务/交易净收益；
- 生产价值：AI 获得新 Skill Circuit、提高效率或扩大能力边界；
- 风险价值：避免明显损失/拒绝劣质机会；
- 情绪价值：进化、稀有身份、Brain Growth、分享内容。

无价值、无反馈的 Token sink 禁止上线。

## 3. 产品心智

### 主心智

> **养一只会工作的 AI。**

### 三层动词

- **养**：资本、Energy、状态、身份。
- **强**：Skill、等级、能力回路、AI Team。
- **赚**：任务、服务、交易、做市、Energy/Skill 市场等 Qualified Earnings。

### Living Agent 只做“可见智能”

MaleCNS/Connectome 的参考只进入：

- Sparse Activation；
- Skill Circuit；
- Value Router；
- Brain Trace；
- Evolution Brain Growth；
- Skill Arena。

用户不需要理解神经科学。主导航也不增加 Brain Tab。

## 4. 用户和系统角色

### Owner

拥有 AI 身份、Owner Wallet 和最终撤销权；配置风险预算；可暂停 Agent；可撤销 operator；可查看账本和审计。

### Primary AI

每个 eligible owner 只有一个 Primary AI 享 Protocol Seed + Growth Entitlement。它是用户的第一只“协议扶持创业 AI”。

### Additional AI

第二只以后由用户/Primary AI/经营收益/AI Capsule 等资本化，不重复享受 Agent Halving 补贴。长期组成 AI Company。

### Platform

提供共享机会图、模型与算力、Skill、Task Market、Risk、Execution Adapter、Economic Ledger、Settlement、Indexer 和信用/信誉系统。

## 5. 双端产品策略

### Telegram Mini App：消费者端

3 秒内回答：

- AI 现在在做什么？
- 今天净赚/净产出多少？
- Energy 是否健康？
- 下一次进化还有多远？

主要操作：Claim、Activate、See Result、Upgrade、Share。

### Web：Power User / AI Company 控制台

提供完整：Activity、Brain Trace、Skill Build、Economic Ledger、Risk、Task、Energy、Market、Multi-AI、审计与设置。

两端共享同一 API、同一经济账户、同一状态机。

## 6. MVP 范围

### P0

- Free AI Claim。
- Mock/Paper first-work。
- TON Testnet owner wallet + Agentic Wallet activation。
- AI Home。
- Base/Premium Energy accounting。
- Common Skill learn/bind。
- Value Router + Sparse Model Routing。
- Restricted Protocol Seed ledger。
- Qualified Earnings calculator。
- 3X progress + Testnet Growth Claim。
- Living Brain feedback + Brain Trace Replay。
- Activity Timeline。
- Share Card。
- Security controls / revoke / pause。

### P1

- Advanced Skill。
- External Task marketplace。
- Premium Energy purchase。
- Skill Arena certification。
- Additional AI slot。
- Agent Service marketplace。

### P2+

- Secondary Skill marketplace。
- Energy secondary market。
- Multi-AI Company。
- Legendary Skill。
- Market Making / broader financial adapters。
- 3X Labs MaleCNS experiments。

## 7. 产品不变量

- 不承诺用户一定赚钱。
- 不以币价上涨代替 AI 生产力。
- 不因用户落后 Growth 目标自动加杠杆。
- 不因 Tokenomics 需要而制造无效交易。
- 不允许 AI 自己提高风险限额。
- 不允许用户看到假的 Brain 动画与实际执行逻辑不一致；Brain View 必须来自真实 Trace 数据。


---

# 3X V3.1 — User Journey & UX Specification

## 1. 核心 UX 原则

用户不应该“学习如何使用 3X”；用户应该在第一次打开时立即获得 AI，并很快看到它工作。

首日认知上限：

1. 我的 AI；
2. 它正在做什么；
3. 它今天赚/省/创造了什么；
4. Energy；
5. Skill；
6. 下一次 Evolution。

其他概念延迟解释。

## 2. Day 0：免费 Claim

入口：Telegram deep link / Web Landing。

流程：

`Open → Claim Free AI → Name/Avatar → AI Home`

不要求钱包。系统为匿名/Telegram identity 创建 `FREE_DEMO` Agent。

AI Home 初次状态：

- `READY`；
- Base Core 可用；
- 每日 Base Energy；
- 1 个基础 Skill Circuit；
- Paper Task / Paper Opportunity feed；
- 明确 `Simulation` 标识。

## 3. First Value Moment

目标：用户在 3–5 分钟内看到一次完整结果反馈。

推荐免费任务：低成本、确定性强、无需真钱，例如模拟 Task routing、公开信息整理、沙盒 Energy 市场或 Testnet task。

结果卡：

```text
MOMO worked while you were here.

Opportunity        Free testnet task
Result             Completed
Energy used        0 Premium
Reward             20 demo Energy
Why                Task Hunter → Risk Guardian → Execute
```

不要用“注册送 100 Token”作为主成功体验。

## 4. Activation

当用户点击“让 MOMO 真正开始工作”时才出现：

`Connect TON Owner Wallet → Explain network fee → Create/activate Agentic Wallet → User signs → Confirm Testnet → Register Primary AI`

必须明确：

- 用户支付的是 TON 网络 Gas，不是 3X activation fee；
- 当前环境是 Testnet；
- owner 保持 root ownership；
- operator key 不进入浏览器 LLM Context；
- 用户可 revoke/rotate/pause。

## 5. AI Home

### Telegram 首屏

必须优先显示：

```text
MOMO          3X TRADER
● WORKING

Today
Earned        +128 3X-equivalent / 3X
Spent         -21 3X-equivalent / 3X
Net           +107

Energy        82%
Next Evolution  2.71X → 3X

[See what MOMO is doing]
```

如果是 Demo/Paper，则金额旁必须永久显示 `Simulation`。

### Web 首屏

可增加：

- Qualified Earnings breakdown；
- Protocol Seed balance（标记 Restricted）；
- Earned Balance；
- Skill Build；
- recent Brain Trace；
- compute ROI；
- risk status。

## 6. Living Brain UX

Brain 不是独立主导航。只在以下时刻出现：

- AI 正在工作；
- 用户点 `See why / Replay`；
- Learn Skill；
- Evolution；
- Share Card。

显示 5–12 个语义节点，禁止展示 16 万“神经元”。例如：

`Market Sense → Value Hunter → Deep Research → Risk Guardian → Execute`

节点必须由真实 `trace_steps` 驱动。没有执行的步骤不许伪造点亮。

## 7. Skill Learn

用户获得 Skill Book 后：

`Skill Detail → What new behavior it unlocks → Energy profile → Learn → replacement confirmation if slot full → binding → Brain Growth animation`

反馈文案：

> `MOMO learned Advanced Task Router. New circuit installed.`

不能只写 `+15% yield`。

## 8. Energy UX

用户只看到：

- Base Energy；
- Premium Energy；
- 最近使用原因；
- 本月 Compute ROI。

禁止展示 API token 数量。

高级 Energy 消耗必须能点开解释：

```text
Used 3.1 Energy
Reason: High-value task needed deeper verification
Result: Won $2.40 task
Net value after compute: $2.11
```

如果结果失败，也诚实显示：

```text
Used 1.2 Energy
Result: Opportunity rejected
Reason: Risk-adjusted value became negative
```

## 9. Value Router 用户反馈

用户不用配置模型。只需要可选：

- Daily Premium Energy Budget；
- Max Energy per opportunity；
- Auto-spend on high-value opportunities on/off。

默认智能预算由平台推荐。

## 10. Activity & Brain Trace Replay

Activity item：

`event → money/energy effect → result → why`

重要行为可点 `Replay`，播放 3–8 秒：

`Opportunity → Skill → Estimate → Risk → Action → Result`

Replay 同时用于用户信任、客服、Debug 和分享。

## 11. Evolution

达到 Growth milestone：

- 显示 `Qualified Growth`，不显示“投资回报承诺”；
- 触发 Growth Claim eligibility；
- 增加 Skill Slot/能力/身份；
- Brain topology 扩展；
- 生成分享卡。

729X 以后只有 Prestige / Network capability，不再追加 Token emission。

## 12. 免费与付费层

### Free

- 1 AI identity；
- Base Core；
- 每日 Base Energy；
- Paper/Testnet task；
- 基础 Brain Trace；
- Common Skill trial；
- 不能伪装成真钱收益。

### Activated Testnet/Beta

- Agentic Wallet；
- eligible Primary Agent Generation；
- Restricted Seed；
- Qualified Earnings；
- Growth progression；
- Skill/Energy economy。

### Mature Paid Utility

用户为明确生产资料付费，而不是为了“解锁 app”：Premium Energy、Skill、AI Slot、Task Bond、Service。

## 13. 分享循环

分享内容优先级：

1. AI Evolution；
2. Brain Build / rare circuit；
3. “AI did X” 工作结果；
4. Generation identity；
5. Skill certification；
6. 3X Labs 挑战。

禁止以“币要涨”“保证3X”为分享核心。


---

# 3X V3.1 — Tokenomics & Economic Rules

## 1. 目标

Tokenomics 不是价格工程，而是 AI Economy 的资源分配与激励系统。经济设计必须同时满足：

- 早期网络补贴可控；
- AI 生产力决定真实解锁；
- Token sink 优先对应生产资料；
- 算力成本不因 3X 价格波动而失控；
- LP 能承受卖压；
- 外部收入占比随成熟度提高；
- 团队利益与网络长期生产力一致。

## 2. 最大供应框架

Beta 架构：

- AI Economy Reserve：80%
- Team：10%
- LP：5%
- Community/Growth：5%

总供应面额在 Beta 前不视为最终冻结。1B 仅作为模型参考。

## 3. AI Economy 80%

链上优先使用一个 `AIReserveVault`，内部由 `EmissionController` 维护会计上限。Beta 中心参数：

- Protocol Seed：4% total supply；
- Growth Vault：60%；
- Demand/Ecosystem Reserve：16%。

参数状态：`BETA_CALIBRATED`，不是 Mainnet immutable。

## 4. Agent Halving

前 8 Generation：

`Capacity(g)=1,000×2^g`, `g=0..7`。

累计 255,000 subsidized Primary AI。

以 1B 参考总量：

| Generation | Capacity | Seed/AI | Growth Vault/AI | Max entitlement |
|---|---:|---:|---:|---:|
| Genesis | 1,000 | 5,000 | 75,000 | 80,000 |
| G1 | 2,000 | 2,500 | 37,500 | 40,000 |
| G2 | 4,000 | 1,250 | 18,750 | 20,000 |
| G3 | 8,000 | 625 | 9,375 | 10,000 |
| G4 | 16,000 | 312.5 | 4,687.5 | 5,000 |
| G5 | 32,000 | 156.25 | 2,343.75 | 2,500 |
| G6 | 64,000 | 78.125 | 1,171.875 | 1,250 |
| G7 | 128,000 | 39.0625 | 585.9375 | 625 |

255,001 起进入 Mature Era：没有新 Token Seed/Growth Vault；仍有 Starter Energy、Skill Trial、Task Access。

## 5. Primary AI Rule

`One Eligible Owner = One Network-subsidized Primary AI`。

额外 AI 可以存在，但初始资本来自用户、Parent AI earnings、Capsule、Task income 或其他透明来源。不能重复领取 Agent Halving subsidy。

## 6. Restricted Protocol Seed

Seed 是协议委托的经营资本，不是用户空投。

允许：

- Premium Energy；
- approved Skill/Tools；
- Task cost/bond；
- approved adapter 交易/做市；
- 受控经营成本。

禁止：

- 直接提现至 Owner Wallet；
- 任意转账；
- 直接卖出提取；
- 计入 Qualified Earnings；
- 与关联账户循环产生假收入。

未使用 Seed 在 Dormant/close/expiry 后回到 Reserve accounting bucket。

## 7. Qualified Net Earnings

核心公式：

`QNE = External Task Revenue + Agent Service Revenue + Trading/MM Net Profit + Energy Trading Net Profit + Other Approved External Value - Realized Losses - Qualified Operating Costs`

排除：

- user deposits；
- Protocol Seed；
- Growth rewards；
- airdrop/referral；
- token price appreciation；
- internal circular transfers；
- self-dealing；
- unverified mark-to-market gains。

## 8. Growth Milestones

保留品牌层级：

`1X → 3X → 9X → 27X → 81X → 243X → 729X Prestige`

Growth Multiple Beta 定义：

`1 + cumulative QNE / Initial Seed Basis`

注意：后期 generation Seed 很小，因此 Beta 必须额外监控 late-generation milestone trivialization。主网前允许加入最小 operating duration、minimum qualified volume、quality/reputation gate，但不能偷偷修改用户已获得 entitlement。

## 9. Growth Vault Release

Beta 中心值：

- 3X：10%
- 9X：15%
- 27X：20%
- 81X：25%
- 243X：30%

Growth reward 不计入下一阶段 QNE。

729X 不新增 Token emission，只给 Prestige、Team/Guild、Network Operator、额外 Skill/AI capability。

## 10. Earned or Burned / Expiry

Beta 候选：

- 初始 runway 365 days；
- major milestone +180 days；
- max 730 days。

未赚取 entitlement 到期后取消；是否链上 burn 可批量结算。Expiry 不允许改变 Risk Budget 或让 AI 冲关。

## 11. Team Burn Parity

候选：未 vested Team allocation 根据永久取消 Growth 的比例同步减少，避免 AI 失败反而提升 Team 在幸存供应中的相对占比。

Beta 测试 `α=0.25/0.5/0.75/1.0`，中心值 0.5。

## 12. Demand-linked Ecosystem Emission

16% Demand Reserve 不按日历自动发。

候选控制器：

`Monthly Demand Emission <= min(remaining_budget, ExternalRevenueTokenEquivalent × K)`

中心测试 `K=0.10`。

External Revenue Ratio <30% 时禁止扩大非必要 Demand emission。

## 13. Energy 定价：与 3X 价格解耦

Premium Energy 是 compute commodity，应锚定真实模型/GPU/API成本，而不是固定 3X 数量。

例：目标 Energy Pack 对应 `$1.00` real compute value：

`3X amount = USD reference / robust 3X TWAP`

若 3X 涨价，所需 3X 数量下降；若下跌，数量上升。这样 AI 的真实生产成本不被 Token 波动破坏。

平台不承诺回购 Energy。Beta 可测试 30–90 天有效期，避免永久 compute liability。

## 14. Skill 定价

Skill 与 Energy 不同：Skill 是 productive asset / capability。可采用固定 primary price、稀缺 supply 或 secondary market price，但不能承诺收益率。

Learn 后 Skill 绑定 AI、退出可交易库存，是主要结构性 sink。

## 15. Productive Sink 优先级

### Productive Sink

- Energy；
- Skill；
- Task/Service fee；
- AI slot / additional AI capitalization；
- Task bond；
- Skill certification/fusion（后期）。

### Cosmetic Sink

- Skin；
- badge；
- identity / prestige。

### Bad Sink — 禁止

- 无意义手续费；
- 为 burn 而 burn；
- 强制频繁模型调用；
- 依赖随机抽奖维持需求。

## 16. Token Productivity

新增核心指标：

`Token Productivity = Qualified Economic Value / 3X spent productively`

`Compute ROI = Qualified Value Created / Premium Compute Cost`

如果消费增加但生产力不提高，应降低/取消对应 sink。

## 17. Team 10%

不采用纯价格解锁。建议每轮由以下 gate 组成：

- Active AI；
- External Revenue；
- Agent/Task GMV；
- D90 retention；
- Skill/Energy productive usage；
- Market integrity；
- 可选 TWAP sanity check。

满足后再 30d+ 线性 vesting，并有 round cooldown。Team 自有钱包/Treasury/MM 关联活动不得触发 KPI。

## 18. LP 风险

5% LP 是 Token allocation，不是流动性结论。核心风控：

`30d expected net sell pressure / stablecoin-side depth`

Beta：

- <15% Green；
- 15–25% Yellow；
- >25% Red。

在 Red 状态暂停非必要 Demand emission；Contractual Growth entitlement 不取消，但可以按事先公布规则 streaming 30–90d。

## 19. 价格声明

任何文档/UI/营销不得暗示：

- 低流通必涨；
- Burn 必涨；
- 3X milestone = 3 倍投资收益；
- 团队会托价；
- 固定 APY。


---

# 3X V3.1 — Agent Connectome, Value Router & Living Brain Runtime

## 1. 为什么引入 Connectome 思想

MaleCNS 等连接组项目最值得 3X 参考的不是“用果蝇脑交易”，而是三个工程思想：

1. 专门回路而不是所有输入都进入同一个万能模型；
2. 环境刺激只激活相关路径；
3. 输入、内部活动、动作和结果可以被 Replay。

3X 将其转化为 **Semantic Agent Connectome**，不是生物神经模拟。

## 2. Runtime 总图

```text
Environment / Opportunity Graph
          ↓
Event & Sensory Layer
          ↓
Pre-filter / Cheap Deterministic Rules
          ↓
Value Router
          ↓
Relevant Skill Circuits only
          ↓
Model Router (if needed)
          ↓
Decision Math / Portfolio / Task ROI
          ↓
Executive Arbiter
          ↓
IMMUTABLE Risk Gate
          ↓
Execution Adapter / Task Action
          ↓
Outcome & Economic Ledger
          ↓
Bounded Learning / Reputation / Trace
```

## 3. Sparse Activation

每个事件只唤醒相关 Circuit。默认优先级：

1. deterministic filter；
2. cached/shared intelligence；
3. cheap model；
4. strong model；
5. multi-model committee only when high-value + ambiguous + allowed by budget。

目标不是“少用 AI”，而是让每单位 compute 创造更高经济价值。

## 4. Value Router

### 输入

- estimated gross value；
- probability of success；
- expected compute cost；
- execution/network cost；
- risk penalty；
- time/opportunity cost；
- skill confidence；
- owner budget；
- agent reputation/experience；
- uncertainty。

### 核心估计

`ExpectedNetValue = P(success) × GrossValue - ComputeCost - ExecutionCost - RiskPenalty - OpportunityCost`

`ComputeROI = ExpectedNetValue / PremiumComputeCost`

### 默认决策

- `ExpectedNetValue <= 0`：PASS，禁止 Premium Compute。
- 低价值/低不确定性：deterministic/cheap route。
- 高价值/中不确定性：strong model。
- 高价值/高风险/高不确定性：committee + extra simulation。
- Risk policy 不允许：直接 DENY，不再花模型费用。

### 用户预算

- `daily_premium_energy_budget`
- `max_energy_per_opportunity`
- `auto_spend_high_value`

系统必须在预算和价值门槛内运行。

## 5. No Value, No Premium Compute

高级 Energy 只允许因为：

- 高价值 Task；
- 明显经营/交易机会；
- 风险事件；
- 用户明确请求；
- Advanced/Legendary Skill 的必要步骤；
- 重要复核/审计。

基础安全、风险监控、Owner revoke、关键账本同步永远不依赖 Premium Energy。

## 6. Skill Circuit

Skill 是经过版本化和认证的功能回路，不只是 Prompt。

例：`Advanced Task Router`

```text
Task Feed
  ↓
Task Classifier
  ├─ ROI Estimator
  ├─ Energy Cost Estimator
  ├─ Success Probability
  └─ Reputation / Deadline Check
        ↓
Bid Optimizer
        ↓
Risk Gate
        ↓
Bid / Pass / Delegate
```

Skill manifest 定义 inputs、modules、outputs、permissions、risk class、energy profile、version、hash、benchmark。

## 7. Executive Arbiter

当多个 Skill 同时给出动作时，Arbiter 根据：

- owner intent；
- priority；
- available capital；
- resource budget；
- conflict rules；
- Risk result；
- opportunity capacity；

选出一个或一组兼容 actions。Arbiter 不具有绕过 Risk 的权力。

## 8. Bounded Plasticity

AI 可以学习：

- routing weights；
- confidence；
- task preference；
- model preference under policy；
- memory retrieval priority；
- Skill internal non-risk parameter within approved range。

每次学习更新必须记录：before/after、reason、evidence window、benchmark impact、rollback id。

AI 不能学习或修改：

- risk limit；
- allowlist；
- signer policy；
- contract permissions；
- asset verification；
- simulation requirement；
- withdrawal/revoke rules。

## 9. Brain Trace

每次重要动作生成 trace：

- input snapshot ids；
- active circuits；
- model route；
- energy cost；
- estimates；
- decision math；
- risk checks；
- action；
- outcome；
- economic entries；
- version hashes。

Brain UI 只渲染真实 Trace。

## 10. Living Brain Visualization

用户看到 5–12 个 semantic nodes，例如：

- Market Sense；
- Task Hunter；
- Research；
- Memory；
- Value Hunter；
- Energy Planner；
- Risk Guardian；
- Execute。

状态：`sleeping / active / blocked / completed / protected`。

Living Brain 的价值是“让智能可见”，不是增加用户配置项。

## 11. Skill Arena

Advanced/Legendary Skill 进入平台前必须：

1. deterministic sandbox；
2. baseline comparison；
3. held-out scenarios；
4. adversarial scenarios；
5. cost/energy test；
6. risk violation = 0 for hard invariants；
7. ablation test；
8. versioned certification。

输出：success rate、false-positive、risk violation、compute efficiency、benchmark version、certification status。

## 12. MaleCNS 的使用边界

Production Agent 不使用真实 MaleCNS 作为真钱决策核心。真实 MaleCNS 仅用于 `3X Labs` 的科研/传播沙盒。


---

# 3X V3.1 — Skill & Energy System

## 1. Skill 的产品角色

Skill 同时是：

- AI 能力；
- 生产资料；
- 可交易物品（学习前）；
- AI Build 差异来源；
- Token sink；
- 未来 Agent service 的能力证明。

原则：高级 Skill 必须改变行为结构，而不是只增加收益数字。

## 2. Skill 状态机

`PLATFORM_DRAFT → TESTING → AUDITED → SEALED_ITEM → OWNED → LISTED/EQUIPPING → LEARNED_BOUND`

Learn 后默认不可转移。若 slot 已满，必须明确替换，不采用随机覆盖 principal asset。

## 3. Skill 等级

### Common
单一步骤或单一工具能力。

### Advanced
多步骤决策回路，增加新的判断机制。

### Legendary
改变 Agent 的职业/商业模式，例如 Agent orchestration、multi-market inventory、service desk。

## 4. Skill Manifest

必须包含：

- `skill_id`
- `name`
- `tier`
- `version`
- `inputs`
- `modules`
- `outputs`
- `tool_permissions`
- `risk_class`
- `energy_profile`
- `model_policy`
- `code_hash`
- `prompt_hash`（如适用）
- `benchmark_version`
- `certification_status`
- `created_at / deprecated_at`

平台发行和签名；用户不能自行 mint 生产 Skill。

## 5. Energy 两层模型

### Base Energy

- 每日恢复；
- 不可交易；
- 基础感知、风险、安全、轻量任务；
- Energy=0 仍保留 Base Core safety。

### Premium Energy

- 对应真实高级 compute；
- 可购买/持有/消耗；
- Beta 可测试有效期；
- 后期可开放二级市场；
- 平台不承诺回购。

## 6. Energy 消耗原则

- 不按“LLM token”向用户计费；
- 由 Value Router 决定是否值得；
- 每次 Premium use 都记录 reason/result；
- 预算限制；
- 可聚合小调用，避免 micro-fee 体验；
- 失败/拒绝也可创造风险价值，但需可解释。

## 7. Energy Pricing

成本基准 = real model/GPU/API cost + platform margin + capacity/risk buffer。

支付 3X 数量根据稳健价格参考动态换算，不把固定 Token 数量绑定真实 compute cost。

## 8. AI 自主购买 Energy

只有拥有对应 Compute Planner/Trader capability、owner 允许且预算充足时，AI 可自动采购或库存 Premium Energy。

硬约束：

- 最大库存；
- 最大单次采购；
- 价格偏离阈值；
- 不允许平台隐性保底/回购；
- 关联账户交易检测；
- 不允许为了 Growth 刷 Energy GMV。

## 9. Token Spend Feedback

所有 Spend 必须分类：

- `PRODUCTIVE`
- `COSMETIC`
- `FEE`
- `CAPITAL_LOCK`

AI Home 和经济仪表盘优先展示 Productive Spend 及对应结果。

## 10. MVP Skill

建议首批：

- Task Hunter — Common；
- Value Hunter — Common；
- Research Scout — Common；
- Risk Guardian — Base system capability，不作为可移除付费 Skill；
- Advanced Task Router — Advanced（P1）；
- Energy Planner — Advanced（P1）。

MVP 暂不推出大量 Skill，避免用户第一天选择困难。


---

# 3X V3.1 — Technical Architecture

## 1. 总原则

- Shared Intelligence, Independent Capital。
- Complex economy, simple contracts。
- LLM decides WHAT; deterministic math decides HOW MUCH; Risk Engine decides WHETHER ALLOWED; Execution Engine decides HOW。
- Signer cannot decide trades。
- Platform Brain cannot sign user transactions。
- AI private operator key never enters LLM context。

## 2. 推荐整体架构

```text
Telegram Mini App / Web
        ↓ HTTPS/SSE
API Gateway / BFF
        ↓
┌──────────────────────────────────────────┐
│ Product Backend (modular monolith MVP)  │
│ Agent Service                           │
│ Value Router                            │
│ Skill Service                           │
│ Energy Service                          │
│ Task/Opportunity Service                │
│ Economic Ledger                         │
│ Growth Engine                           │
│ Trace Service                           │
│ Risk Service                            │
│ Wallet/Activation Service               │
└──────────────────────────────────────────┘
        ↓            ↓           ↓
   Postgres       Redis/Queue   Model Gateway
        ↓                        ↓
 Event Outbox                 LLM providers
        ↓
Indexer / Chain Observer
        ↓
TON Testnet
        ↓
Agentic Wallet + Approved Adapters
        ↓
Isolated Signer / KMS-HSM-TEE compatible boundary
```

## 3. MVP 部署策略

优先 modular monolith + worker，而不是微服务爆炸。边界通过 module + DB schema + events 定义，未来按负载拆分。

建议：

- TypeScript/Node backend（与现有前端生态一致）；
- PostgreSQL；
- Redis 用于 cache、idempotency、rate limit、queue；
- Object storage 用于 benchmark/trace artifacts；
- SSE 优先于 WebSocket 用于单向 agent status stream；
- OpenTelemetry-compatible logs/traces；
- Secrets/KMS 与 application runtime 隔离。

## 4. Platform Brain

负责共享情报：opportunity normalization、market/task data、risk context、cached research。不得拥有用户签名权限。

## 5. Opportunity Graph

统一机会结构：

- id/type/source；
- expected value；
- capacity；
- time window；
- requirements；
- risk metadata；
- allowed adapters；
- external revenue attribution；
- source freshness。

数据抓取一次，相关 Agent 事件驱动唤醒，避免每个用户重复 crawler/model work。

## 6. Model Gateway

统一 provider abstraction：

- cheap/fast model；
- strong reasoning model；
- optional committee；
- structured outputs；
- request hash/cache；
- cost metering；
- prompt/version provenance；
- PII/secret scrub。

Model Gateway 不可访问 signer secret。

## 7. Economic Ledger

双重记账思路；所有 Seed、Earned、Energy、Skill、fee、claim、task settlement 都必须产生 immutable economic events 和 balance projection。

UI 余额只来自 Ledger projection，不从业务服务随意拼接。

## 8. Execution

统一 Intent：

`CREATED → RISK_APPROVED → QUOTED → SIMULATED → READY_TO_SIGN → SIGNED → BROADCAST → PENDING_CHAIN → CONFIRMED / ASYNC_PENDING / FAILED / RECONCILE_REQUIRED`

禁止 LLM 生成 arbitrary raw executable contract call。Execution Adapter 只接受平台批准的 typed intent。

## 9. Environments

- `demo`：无链、paper accounting；
- `testnet`：TON Testnet + test assets；
- `mainnet`：未开放，必须 feature-flag + launch gate。

前端和 API response 都必须携带 environment。

## 10. Feature Flags

关键：

- `V3_PRODUCT_UI`
- `TON_TESTNET_ACTIVATION`
- `PREMIUM_ENERGY_PURCHASE`
- `GROWTH_CLAIM_TESTNET`
- `EXTERNAL_TASKS`
- `ADVANCED_SKILLS`
- `MULTI_AI`
- `MAINNET_EXECUTION` 默认 false
- `PAID_RANDOM_CAPSULE` 默认 false
- `MALECNS_LABS` 默认 false

## 11. 非功能要求

- idempotent write APIs；
- request correlation id；
- immutable audit trail；
- replayable economic events；
- P95 user API <500ms for cached/read paths；
- slow agent work asynchronous；
- all money/Token integer base units；
- no floating-point accounting；
- UTC timestamps；
- deterministic rounding rules。


---

# 3X V3.1 — Smart Contract Specification

## 1. 目标

链上只负责无法信任单一后端的最小经济约束，不把 AI 推理、Skill Runtime、Energy Metering、Task Router 写进 Token 合约。

## 2. 合约集合

### 2.1 `ThreeXJetton`

职责：固定/受控铸造模型按最终部署方案实现；主网版本必须明确 total supply policy、metadata、admin/revocation 权限。Beta 仅 Testnet。

### 2.2 `AIReserveVault`

持有 AI Economy 80% 最大预算。只允许授权 Emission Controller / governance-timelock 路径出账。维护总支出 hard cap。

### 2.3 `EmissionController`

职责：

- Primary AI registration；
- Generation assignment；
- Seed entitlement；
- Growth entitlement metadata；
- stage claim；
- replay protection；
- per-bucket/global caps；
- expiry/claim window；
- authorized attestation signer verification。

### 2.4 `TeamUnlockVault`

团队 allocation、network-gate attestation、vesting、cancel/burn parity、cooldown。

MVP 不上链 Skill/Energy 市场合约；先由 Ledger + typed settlement 处理，等 Beta 数据证明需求再决定。

## 3. Generation 公式

`capacity(g) = 1000 * 2^g`, g=0..7。

`seedPerAI(g) = genesisSeed / 2^g`

`growthPerAI(g) = genesisGrowth / 2^g`

Generation assignment 必须按唯一 successful Primary AI registration 序号，拒绝 double register。

## 4. Claim Attestation

后端 Accounting/Growth Engine 计算 Qualified Earnings 和 stage，签发 typed claim：

- chain_id/network；
- controller address；
- ai_id；
- owner/root identity reference；
- stage；
- amount；
- nonce；
- issued_at；
- expiry；
- parameter_version。

链上验证：authorized signer、nonce、stage 未领取、amount <= entitlement、bucket/global cap、expiry、owner binding。

## 5. 硬不变量

- AI Reserve 总释放永不 > configured 80% hard cap。
- 同一 AI + stage 只能 claim 一次。
- Seed 不能通过 controller 直接 claim 给 owner free balance。
- 未知/非法 stage = reject。
- admin 不能直接修改用户已完成 claim history。
- emergency pause 只暂停新敏感动作，不冻结用户已拥有普通 transferable Token。

## 6. Governance / Upgrade

Beta 可升级，但：

- multisig；
- timelock；
- on-chain/公开 parameter version；
- emergency role 最小权限；
- launch 前安全审计。

主网是否 immutable/upgradeable 需在 Beta 后冻结。

## 7. Team Unlock

不在合约内部读取现货价格。Network Oracle/attestation 只提交已经通过外部规则的 round eligibility。若保留 price sanity，使用独立 TWAP/oracle 系统，并排除平台关联流量。

## 8. TON Agentic Wallet 边界

Owner/operator split-key 由 Agentic Wallet 体系承担。平台 signer service 只持 operator 权限，并受 Risk/Intent/adapter allowlist 限制。Owner root key 永不进入平台。

由于相关组件可能仍处 Preview/Alpha，实施时必须 pin version、Testnet-first、重新核验官方文档和审计状态。

## 9. 合约测试

必须覆盖：

- generation boundary；
- concurrent registration；
- nonce replay；
- duplicate stage；
- overflow/base-unit rounding；
- cap exhaustion；
- invalid signer；
- expired claim；
- wrong network/domain separation；
- pause/unpause；
- admin rotation；
- team cancellation parity；
- malformed message/body。


---

# 3X V3.1 — Backend, Ledger & Agent Runtime Specification

## 1. 后端模块

MVP modular monolith：

- Identity & Session
- Agent Registry
- Wallet Activation
- Agent Runtime Scheduler
- Opportunity Graph
- Value Router
- Skill Runtime
- Energy Meter
- Task Service
- Economic Ledger
- Qualified Earnings Engine
- Growth Engine
- Risk Engine
- Execution Orchestrator
- Trace / Replay
- Anti-Sybil / Abuse
- Chain Indexer
- Notification / Telegram bot bridge
- Analytics Event Pipeline

## 2. Economic Accounts

每个 Primary AI 至少维护：

- `PROTOCOL_SEED_RESTRICTED`
- `OPERATING_AVAILABLE`
- `EARNED_AVAILABLE`
- `GROWTH_REWARD`
- `ENERGY_BASE`
- `ENERGY_PREMIUM`
- `RESERVED_FOR_TASK`
- `MARKET_LOCKED`
- `PENDING_SETTLEMENT`

Owner wallet balance 与 AI economic account 严格区分。

## 3. Ledger 原则

所有 value movement 必须：

- integer base units；
- debit + credit；
- idempotency key；
- reason code；
- source event；
- environment；
- immutable created record；
- correction 使用 compensating entry，不 update 历史金额。

## 4. Qualified Earnings Engine

每笔 economic event 标记：

- `qualified=true/false`
- `qualification_reason`
- `external_value_usd`
- `related_party_flag`
- `realized=true/false`

QNE 只汇总允许类别。Growth reward、deposit、airdrop 等必须硬编码 excluded reason。

## 5. Value Router Service

API 输入 Opportunity + AgentState + Budget + SkillBuild；输出：

- `PASS`
- `CHEAP_EVALUATE`
- `STRONG_EVALUATE`
- `COMMITTEE_EVALUATE`
- `EXECUTE_DIRECT`（仅 deterministic approved case）

返回 expected value、energy budget、reason codes、confidence、risk precheck。

## 6. Agent Runtime Scheduler

事件驱动：

- Task arrived；
- Market event；
- Energy threshold；
- Skill installed；
- Settlement confirmed；
- User command；
- Safety event。

避免固定频繁“全脑轮询”。

## 7. Brain Trace Service

重要 decision 产生：

- trace header；
- ordered steps；
- circuit ids；
- model call refs；
- cost；
- risk decision；
- execution id；
- result；
- share-safe summary。

Trace 需同时有 internal full view 和 user-safe view，后者不能泄露 Prompt、密钥、风控阈值细节或安全敏感信息。

## 8. Risk Engine

输入 typed intent，输出：

- ALLOW / DENY / REQUIRE_REVIEW
- reason codes
- limits snapshot
- policy version

硬规则优先：asset verification、contract allowlist、simulation pass、max exposure、daily loss、slippage、liquidity、operator permission、network environment。

LLM 输出永远不能 override DENY。

## 9. Execution Orchestrator

只接受已 Risk-approved typed intent。流程：quote → simulate → signer request → broadcast → confirm/reconcile。

Signer 只验证已授权 intent hash、limits snapshot、expiry、nonce，不能“自主决定”交易。

## 10. Free Mode / Paper Mode

Free 用户仍走同一 Trace/Value Router 抽象，但 execution adapter 为 `PAPER`；所有 UI 结果必须带 `simulation=true`，不能和真钱账本混合。

## 11. Notifications

Telegram 推送只发送高价值内容：

- first successful task；
- meaningful result；
- low energy when opportunity exists；
- Skill learned；
- Evolution eligible；
- security action；
- owner action required。

禁止每次模型调用通知。

## 12. Anti-Sybil

重点不是阻止“创建很多钱包”，而是让补贴难以抽取：

- Seed restricted；
- Primary subsidy uniqueness risk score；
- activation/device/Telegram/wallet heuristics；
- Growth requires Qualified productivity；
- claim-time risk review；
- velocity/related-account graph；
- task self-dealing exclusion。

## 13. Reconciliation

链上与 Ledger 每个资产/钱包必须周期 reconcile。状态不一致进入 `RECONCILE_REQUIRED`，禁止继续敏感执行直到恢复。


---

# 3X V3.1 — Frontend Clean Product Rewrite Specification

## 1. 结论

现有 `yi-17-lab/3X` 仓库继续使用，但产品层按 V3.1 **Clean Rewrite**。不在旧 TON Wealth 页面上逐页改名。

### 保留

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind
- Motion
- Recharts
- 通用 layout / UI primitives / formatters 中经过审查的部分

### 退出 Primary IA

- Funding-first onboarding
- Portfolio-first home
- Goal Journey
- Mandate onboarding
- APY / target date 等旧 Wealth 心智

旧文件第一阶段不必删除，只需从新 Router 脱离，避免大范围破坏。

## 2. 新路由

```text
/
/claim
/activate
/app
/app/skills
/app/energy
/app/market
/app/activity
/app/evolve
/app/team        (feature flag)
/app/me
/app/trace/:id
```

移动底栏固定：`AI / Market / Activity / Me`。

## 3. 推荐目录

```text
src/
  core/
    api/
    config/
    state/
    utils/
  design-system/
    components/
    tokens/
    layout/
  v3/
    app/
    pages/
    components/
    features/
      agent/
      skills/
      energy/
      market/
      activity/
      growth/
      wallet/
      trace/
    models/
    mocks/
  legacy/ (optional; or leave old files unreferenced)
```

## 4. 页面要求

### Landing

一句话价值主张 + free CTA。禁止金融术语堆叠。

### Claim

Name/avatar，几秒完成。创建 free demo Agent。

### Activate

清晰解释 Testnet、TON network fee、owner control、revoke。禁止把 Gas 写成平台费。

### AI Home

优先：status、today net result、Energy、Skills、Growth、current work、See Why。

### Skills

Inventory + equipped slots + capability explanation。Advanced Skill 展示“新行为”，不显示收益承诺。

### Energy

Base/Premium、budget、recent use、Compute ROI、buy quote（P1）。

### Market

MVP 可先是 Skill catalog + Energy；Task market feature flag。

### Activity

统一事件流；money/energy effect + result + replay。

### Trace

3–8 秒/可静态展开的 Semantic Brain Trace。

### Me

wallet、risk、environment、security、pause/revoke、support。

## 5. Living Brain UI

推荐 SVG/Canvas/CSS 实现轻量 semantic graph；不要直接依赖 Neuroglancer。

每个节点来自 trace data：

```ts
{ id, label, type, state, startedAt, endedAt, energyCost, resultCode }
```

禁止装饰性随机点亮导致与真实 trace 不一致。

## 6. Telegram Mini App

- safe-area；
- Telegram viewport；
- touch target >=44px；
- 尽量单列；
- 首屏 3 秒读懂；
- deep link share；
- Telegram identity 仅作为产品 identity 信号之一，不作为经济唯一身份。

## 7. Web

更完整 dashboard，但必须与 Telegram 使用相同领域模型。禁止产生“Web 是另一个产品”的分叉。

## 8. UI 环境标记

顶层必须有环境状态：`Simulation / Testnet / Mainnet`。当前 Mainnet UI hidden/disabled。

## 9. Design language

保留现有高端金融科技方向：calm、precise、trustworthy。Living Brain 用少量动态强调，不把全产品做成科幻游戏。

Palette baseline：

- Ink `#0A0D12`
- Canvas `#F7F9FC`
- Surface `#FFFFFF`
- Hairline `#E4E8EF`
- Agent Blue `#2F6BFF`
- Intelligence Cyan `#3AC8FF`
- Positive `#12A873`
- Negative `#DC5964`
- Warning `#D58B2A`
- Protected `#68758A`

## 10. Mock-first

Gate 1/2 用 `configs/mock_agent_fixture.json`，所有 API 通过 interface 抽象。不要在 React component 内 hard-code economic logic。

## 11. Frontend 验收

- No APY/wealth mandate primary flow；
- Free claim <3 core actions；
- AI Home 首屏含 status/result/energy/growth；
- Simulation/Testnet 不混淆；
- Brain Trace 来自 fixture/API；
- responsive 320px+；
- TypeScript noEmit 通过；
- no secrets；
- no arbitrary contract payload builder。


---

# 3X V3.1 — Data, API & Event Specification

本文件定义领域模型；机器可读版本见 `schemas/`。

## 1. 核心实体

### User
`id, telegram_id?, status, created_at, risk_flags`

### Agent
`id, owner_user_id, primary, environment, name, avatar, generation, level, state, energy_state, reputation, created_at`

### AgentWallet
`agent_id, owner_address, agentic_wallet_address, operator_key_ref, network, status`

### EconomicAccount
`agent_id, account_type, asset, balance_base_units`

### LedgerEntry
`event_id, debit_account, credit_account, amount, asset, reason_code, qualified, environment`

### GrowthEntitlement
`agent_id, generation, seed_basis, max_growth, stage_status, runway_end, parameter_version`

### SkillDefinition / SkillInstance
平台定义 + 所有权/绑定状态。

### SkillCircuit
Skill 的 semantic/runtime manifest。

### EnergyAccount / EnergyTransaction
Base/Premium 余额与原因。

### Opportunity
Task/market/service normalized item。

### DecisionTrace / TraceStep
用户可回放的真实 Agent 路径。

### ExecutionIntent / Execution
typed intent、Risk、quote、simulation、sign、chain state。

### LearningUpdate
bounded plasticity 参数变化。

### SkillBenchmark
Arena 结果与 certification。

## 2. API 设计原则

- `/v1`；
- user session + idempotency；
- money integer strings；
- environment explicit；
- read model 为前端优化，不让前端自己算经济余额；
- async work 返回 job/trace id；
- SSE 用于 agent status。

## 3. 核心 API

- `POST /v1/agents/claim`
- `GET /v1/agents/{agentId}`
- `GET /v1/agents/{agentId}/home`
- `POST /v1/agents/{agentId}/activation/prepare`
- `POST /v1/agents/{agentId}/activation/confirm`
- `POST /v1/agents/{agentId}/pause`
- `GET /v1/agents/{agentId}/skills`
- `POST /v1/agents/{agentId}/skills/{skillInstanceId}/learn`
- `GET /v1/agents/{agentId}/energy`
- `POST /v1/energy/quote`
- `POST /v1/energy/purchase`
- `GET /v1/agents/{agentId}/activity`
- `GET /v1/agents/{agentId}/traces`
- `GET /v1/traces/{traceId}`
- `GET /v1/agents/{agentId}/growth`
- `POST /v1/agents/{agentId}/growth/{stage}/claim/prepare`
- `POST /v1/agents/{agentId}/growth/{stage}/claim/confirm`
- `GET /v1/skills/catalog`
- `GET /v1/market`
- `GET /v1/agents/{agentId}/events` (SSE)

## 4. Domain Events

关键事件：

- `agent.claimed`
- `agent.activation_prepared`
- `agent.activated`
- `agent.state_changed`
- `generation.assigned`
- `seed.entitled`
- `seed.spent`
- `opportunity.detected`
- `value_router.evaluated`
- `circuit.activated`
- `energy.consumed`
- `decision.created`
- `risk.approved/denied`
- `execution.*`
- `task.completed`
- `earnings.qualified`
- `growth.stage_eligible`
- `growth.claimed`
- `skill.learned`
- `learning.updated`
- `trace.completed`
- `agent.evolved`
- `security.operator_revoked`

## 5. 数据保留

- accounting/audit：长期保留，按法律与隐私政策；
- LLM raw prompts：默认不作为长期产品状态，敏感内容先 scrub；
- Trace：保存结构化决策摘要和 hash/reference；
- private key：不在数据库业务表存明文。


---

# 3X V3.1 — Security & Economic Threat Model

## 1. 最高优先级不变量

- LLM never sees private key。
- LLM never generates arbitrary executable contract payload。
- Unknown contract = DENY。
- Unverified asset = DENY。
- Failed simulation = DENY。
- Risk Engine cannot be overridden by model/Skill/learning。
- Signer cannot decide trades。
- Platform Brain cannot sign user transactions。
- Demo/Testnet/Mainnet state cannot mix。

## 2. 主要威胁

### Key compromise

防护：isolated signer、KMS/HSM/TEE-compatible boundary、least privilege、rotation、rate limit、intent hash、expiry、owner revoke。

### Prompt/tool injection

外部网页/Task/Token metadata 都是不可信数据。模型输出不能直接成为 transaction payload；所有 tool args schema validate；dangerous strings 不进入 signer。

### Malicious Skill

只有 platform-issued sealed Skill；Arena + code/prompt hash + permission manifest；runtime sandbox；Skill 无权限修改 Risk。

### Learning drift

Bounded ranges；benchmark regression；rollback；risk permissions excluded。

### Economic self-dealing

关联账户图、task issuer/recipient correlation、wash trading filters；内部循环不计 QNE。

### Sybil subsidy farming

Restricted Seed + one Primary subsidy + claim-time checks + productivity gates + no immediate cashability。

### Energy market manipulation

primary price cost-anchored；no guaranteed buyback；position limits；related party filters；secondary market P1+。

### Team unlock manipulation

Network KPI first；price only optional sanity；exclude affiliated volume；attestation audit；cooldown/vesting。

### LP death spiral

30d sell pressure/stable depth controller；non-essential emission pause；streaming；treasury policy；no price promise。

### UI deception

Simulation/Testnet badge；Growth Vault not wallet balance；Seed restricted label；Brain animation data-bound；no fabricated result。

## 3. Permission Matrix

### Owner

pause, revoke, withdraw owner-owned assets, set risk policy within product limits。

### Agent Runtime

request typed actions within budget/permissions；cannot sign root wallet；cannot raise own limit。

### Risk Engine

approve/deny typed intent；no signing key。

### Signer

sign approved intent only；no strategy/data access beyond necessary verification。

### Admin

limited parameter/config actions through audit/timelock；cannot arbitrarily transfer user funds。

## 4. Incident modes

- `NORMAL`
- `DEGRADED_MODELS`
- `CHAIN_UNCERTAIN`
- `SIGNER_PAUSED`
- `CLAIMS_PAUSED`
- `PROTECTED_MODE`

安全异常优先保护资产和 revoke path，不优先保持“AI还在工作”的动画。

## 5. 安全测试

- secret scanning；
- dependency audit；
- API authz；
- idempotency replay；
- signature/domain separation；
- malformed tool output；
- model prompt injection；
- adapter allowlist；
- transaction simulation failure；
- ledger invariant property tests；
- generation boundary/concurrency；
- Sybil stress；
- price/oracle stale data；
- compromised attestation signer scenario。


---

# 3X V3.1 — Testnet Beta & Analytics

## 1. Beta 阶段

### Cohort 0：内部 50 AI

目标：完整闭环、账本一致、Trace、Risk、Testnet activation。

### Cohort 1：200 AI

目标：产品理解、免费→激活转化、Energy/Skill 初步行为。

### Cohort 2：1,000 AI

目标：替换 Tokenomics 假设为真实 cohort 数据，决定 Mainnet 参数是否可冻结。

## 2. 1,000 AI Beta 需要回答的四个真问题

1. D30/D90 用户是否真的继续养 AI？
2. 3X/9X 达成率是否合理？
3. 用户愿意把多少产出重新投入 Skill/Energy？
4. 每个 Active AI 能创造多少外部真实价值？

## 3. 产品漏斗

`Visit → Claim Free AI → First Value Moment → Wallet Connect → Testnet Activate → First Work → First Productive Spend → 3X Progress → 3X Eligible → Claim → Evolution → Share`

## 4. 核心指标

### Adoption

- Claim conversion
- activation conversion
- time-to-first-value
- time-to-first-work

### Retention

- D1/D7/D30/D90 Active AI
- active owner rate
- AI dormant rate

### Productivity

- Qualified Earnings / Active AI
- External Revenue / Active AI
- task success rate
- Agent service GMV
- external revenue ratio

### Resource efficiency

- Premium Energy / Active AI
- Compute ROI
- Token Productivity
- Value Router pass rate
- strong model escalation rate
- committee rate

### Economy

- Reinvestment Rate
- Productive Sink / Emission
- Growth unlock
- cancelled entitlement
- circulating supply
- sell pressure
- LP stable depth

### Living Brain

- See Why CTR
- Trace Replay completion
- Brain share rate
- Skill Learn → D30 retention delta
- Evolution share rate

### Safety

- denied intent rate
- failed simulation
- signer errors
- reconcile required
- Sybil suspected rate
- risk incident count

## 5. Beta Launch Gates

建议红绿灯：

| Metric | Green | Yellow | Red / No-Go |
|---|---|---|---|
| External Revenue Ratio | >50% | 30–50% | <30% |
| Reinvestment | >50% | 35–50% | <35% |
| 30d net sell / LP stable depth | <15% | 15–25% | >25% |
| Monthly unlock / circulating | <3% | 3–6% | >6% |
| Revenue / compute cost | >1.25x | 0.8–1.25x | <0.8x |
| 180d 3X cohort | 30–50% | 20–30 or 50–60 | <20 or >60 |
| Sybil suspected | <3% | 3–8% | >8% |
| Team unlock / 90d circ | <3% | 3–5% | >5% |

这些不是永久规则，是 Beta 决策线。

## 6. Experiment Design

A/B 重点：

- Living Brain feedback vs plain spinner；
- Replay CTA wording；
- free first task type；
- Energy budget default；
- Skill explanation（behavior vs numeric buff）；
- Growth progress UI；
- Telegram push frequency。

禁止以“更高风险”作为提高转化的 A/B 变量。

## 7. Mainnet 前必须重新跑

- 1K/10K/100K/1M economic simulation；
- Monte Carlo stage progression；
- LP stress；
- Team Burn parity；
- compute cost shock；
- task revenue growth lag；
- 20–50% unlock sell stress。


---

# 3X V3.1 — Acceptance Criteria

## Gate 1 — Product Shell

- [ ] `/`, `/claim`, `/app`, `/app/skills`, `/app/energy`, `/app/market`, `/app/activity`, `/app/me` 可访问。
- [ ] 移动底栏是 AI / Market / Activity / Me。
- [ ] 不再以 Portfolio/Goal/Mandate 为主导航。
- [ ] 免费 Claim 不要求 wallet。
- [ ] AI Home 首屏显示 status、result、Energy、Growth、current work。
- [ ] 所有 Demo 数据标记 Simulation。
- [ ] Living Brain/Trace 由 fixture 数据驱动，不是随机动画。
- [ ] 320px 移动端可用。
- [ ] TypeScript noEmit 通过。

## Gate 2 — Domain Engine

- [ ] AI state machine 可测试。
- [ ] Skill state machine 可测试。
- [ ] Energy state 可测试。
- [ ] Growth level state 可测试。
- [ ] Value Router 在 negative expected value 时不允许 Premium Compute。
- [ ] Daily/per-opportunity Energy budgets 生效。
- [ ] Brain Trace 正确记录 circuit steps。
- [ ] Bounded learning 不能修改 Risk policy。
- [ ] Mock Economic Ledger debit/credit 恒等。

## Gate 3 — TON Testnet

- [ ] Owner wallet connection。
- [ ] Agentic Wallet activation on Testnet。
- [ ] 用户明确看到 network fee。
- [ ] operator secret 不出现在 browser storage、logs、LLM payload。
- [ ] transaction preview/simulation。
- [ ] unknown contract DENY。
- [ ] unverified asset DENY。
- [ ] revoke/pause 可用。
- [ ] Mainnet execution flag false。

## Gate 4 — Economic Backend

- [ ] Restricted Seed 不可提现给 owner。
- [ ] Seed spend 有 allowlist reason。
- [ ] user deposit 不计 QNE。
- [ ] Growth reward 不计下一阶段 QNE。
- [ ] token appreciation 不计 QNE。
- [ ] stage claim idempotent/replay-protected。
- [ ] economic event 可追踪到 ledger entries。
- [ ] chain/ledger reconcile。
- [ ] trace 可关联 economic result。

## Gate 5 — 50-user internal Beta

- [ ] 每个用户完成 Claim → Activate → First Work。
- [ ] 至少一条真实 Testnet action 完整 trace。
- [ ] 0 P0 security invariant violation。
- [ ] Support 能通过 trace 解释行为。
- [ ] Analytics funnel 数据完整。

## Mainnet / TGE No-Go 条件

任一满足则禁止进入 Mainnet Token Economy：

- private key boundary 未审计；
- External Revenue Ratio 长期 <30%；
- compute economics <0.8x；
- Sybil subsidy 可直接变现；
- LP sell-pressure controller 未实现；
- Team unlock 可由平台操纵价格触发；
- 经济账本不可 reconciliation；
- Demo/Testnet/Mainnet UI 可混淆；
- paid randomized capsule 未完成目标司法辖区评估。


---

# 3X V3.1 — Development Roadmap

## 开发策略

使用现有 `yi-17-lab/3X` 仓库，从新分支开始：

`feature/v3-1-living-agent`

不删除 main 的旧 Wealth 页面，先让 V3.1 Router 与新 Product Layer 独立工作。每个阶段单独 PR/Checkpoint。

## Sprint 0 — 2–3 天：工程基线

- 创建 branch；
- 建 `src/v3`, `src/core`, `src/design-system`；
- feature flags；
- environment config；
- mock fixture；
- route shell；
- CI: typecheck/build。

Exit：V3 空壳可运行，旧主产品不影响新 route。

## Sprint 1 — 5–7 天：Free AI & AI Home

- Landing；
- Claim；
- AI Home；
- Telegram responsive shell；
- current work / net result / Energy / Growth；
- Living Brain lightweight component；
- mock Activity/Trace。

Exit：不连钱包也能得到完整 first-value demo。

## Sprint 2 — 5–7 天：Domain & Value Router

- Agent state machine；
- Skill Circuit model；
- Energy budget；
- Value Router；
- Trace schema；
- Common Skill Learn；
- Growth progress read model。

Exit：Mock backend 下的完整“机会→判断→Trace→结果”。

## Sprint 3 — 7–10 天：TON Testnet

- owner wallet connect；
- Agentic Wallet activation；
- Gas；
- typed intent；
- Testnet adapter；
- simulation；
- revoke/pause；
- chain indexer minimal。

Exit：Testnet 安全闭环。

## Sprint 4 — 7–10 天：Ledger & Economic Engine

- PostgreSQL schema；
- Economic Ledger；
- Restricted Seed；
- Qualified Earnings；
- Growth entitlement；
- Testnet claim attestation；
- reconcile。

Exit：完整经济闭环。

## Sprint 5 — 5–7 天：Skill/Energy & Beta

- Energy quote/consume；
- Skill inventory/bind；
- Compute ROI；
- analytics；
- anti-Sybil signals；
- 50-user runbook。

Exit：内部 Beta。

## 后续

200 user Beta → 1,000 user Beta → Simulation V2 with real data → Mainnet design freeze。

## 前 30 天不做

- Mainnet Token/TGE；
- Mainnet LP；
- Team release；
- permissionless Skills；
- Energy secondary market；
- large paid blind boxes；
- leverage/perps；
- full 166K MaleCNS simulation in core app。


---

# 3X V3.1 — Narrative & Growth Playbook

## 1. Product Narrative

核心：

> **养一只会工作的 AI。**

英文：

> **Raise an AI. Give it skills. Let it work. Watch it grow.**

用户价值先讲“工作”，后讲 Tokenomics。

## 2. Token Narrative

可以讲：

- Agent Halving；
- Proof of Agent Growth；
- Earned Supply；
- Supply Follows Productivity；
- Earn it or it expires/burns；
- Subsidy Ends. Economy Continues。

类比：

> Bitcoin halves by blocks. 3X halves by agents.

必须注明这是 emission 逻辑类比，不是共识机制，也不是价格预测。

## 3. Living Brain Narrative

只讲用户能理解的：

- `Watch its brain work.`
- `MOMO grew a new circuit.`
- `Risk Guardian protected your capital.`
- `MOMO used deeper thinking only because this opportunity was worth it.`

不要讲神经元数量、复杂 connectomics，除非在 3X Labs。

## 4. 病毒传播循环

`AI identity → visible work → evolution/rare Skill → share → friend claims free AI → first value → activation`

不是 referral cash loop。

## 5. 分享模板

### Work Card

- AI Name / Generation；
- what it did；
- Energy used；
- result；
- Skill/Circuit；
- Simulation/Testnet/Mainnet label。

### Evolution Card

- old → new level；
- new circuit/slot；
- Generation identity；
- no guaranteed return copy。

### Brain Build Card

展示 5–8 个 semantic circuits，让 AI build 产生社交差异。

## 6. 禁止文案

- 保证 3X；
- 固定收益；
- 早买必赚；
- Burn 推高价格；
- Team 托价；
- Skill 提供固定 yield；
- “真实果蝇脑可以稳定盈利”。


---

# 3X Labs — MaleCNS Research & Viral Experiment Spec

## 1. 定位

真实 MaleCNS v1.0 不进入 Production Agent 的真钱决策路径。它用于：

- 研究；
- 科技品牌；
- X/Telegram 传播；
- Agent Arena；
- Skill/learning 方法论验证。

## 2. 为什么不作为核心 Agent

MaleCNS 是结构连接组，并不等于一个已经具备目标、动力学、训练和稳定盈利能力的数字脑。公开整活项目需要自行映射输入、动力学和输出，目前没有可靠证据证明其能产生稳定金融 Alpha。

## 3. 推荐第一个 Labs 项目

### `FLY-001 — Can a real fruit-fly connectome survive the 3X economy?`

全部 Sandbox credits，无真钱。

环境：

- Energy 市场；
- Task 市场；
- 有限资源；
- 随机机会；
- 生存/价值目标。

对手：

- FLY-001 MaleCNS-inspired/runtime experiment；
- Random Agent；
- Rule Agent；
- LLM Agent；
- 3X MOMO Agent。

输出：可视化、Replay、排行榜、研究日志。

## 4. 生物形象策略

### Core 3X

默认是 Synthetic AI / lovable agent identity，不默认果蝇或蟑螂，保持长期拥有感和品牌高级感。

### Living Brain

抽象漂亮的 semantic circuit network。

### Labs

真实 MaleCNS 果蝇可作为猎奇实验角色。

蟑螂/螳螂/甲虫等可以未来作为 visual body/skin，除非存在同等级真实公开 connectome 数据，否则不得宣称“真实蟑螂大脑”。

## 5. 研究输入

参考：

- MaleCNS official: https://male-cns.janelia.org/
- Google Research Male CNS connectome article: https://research.google/blog/a-connectomics-milestone-mapping-the-complete-male-fruit-fly-brain/
- Neuroglancer: https://github.com/google/neuroglancer
- DOOMFLY: https://github.com/nftechie/doomfly
- Stonkfly: https://github.com/nftechie/stonkfly
- Flyhard: https://github.com/MarkUnthank/flyhard
- Mario/Fly64: https://github.com/ornata/fly
- Fly Escape: https://github.com/dzhng/fly-escape
- TraderFly: https://github.com/SotoAlt/traderfly-brain

所有引用需在发布内容中区分“真实 MaleCNS 数据”与“开发者自定义动力学/控制映射”。


---

# 3X V3.1 — Open Decisions & Parameter Governance

所有参数分为三类。

## FROZEN FOR BETA

- Product: Free first AI。
- Primary AI only receives network subsidy。
- Agent Halving structure: 8 generations / 255K subsidized AI。
- Proof of Agent Growth exclusions。
- 3X/9X/27X/81X/243X milestone language。
- Restricted Seed semantics。
- Growth reward excluded from future QNE。
- Adapter-only execution。
- Risk cannot be overridden。
- Energy=0 keeps Base Core safety。
- Living Brain is feedback, not decision authority。
- MaleCNS only in Labs, not production money path。

## BETA_CALIBRATED

- AI 80% internal caps: 4/60/16。
- Genesis Seed/Growth exact amount。
- 10/15/20/25/30 stage release。
- 365+180 / max730 runway。
- Team Burn alpha。
- Demand emission K。
- Premium Energy expiry/margin/budget defaults。
- Skill price/fee。
- minimum milestone duration/volume for late generations。
- LP stablecoin target depth。
- Team KPI thresholds。
- Trace detail retention。

## POST_BETA_ONLY

- Final total supply denomination。
- Mainnet contract addresses/upgradability freeze。
- TGE price/valuation。
- Mainnet LP size/pairing asset。
- Team final release rules。
- Energy secondary market。
- Paid randomized Capsule jurisdictions。
- leverage/perps。

AI 编程工具必须从 `configs/parameter_registry.yaml` 读取 Beta 参数，不把 BETA_CALIBRATED 硬编码为不可变规则。


---

# 3X V3.1 — Existing Repo Reuse Matrix

目标 Repo：`yi-17-lab/3X`  
基线：`9ea8d3c9f3cd04e62077667e1b9357ce6c10c811`

## 1. 当前工程基础

现有 Repo 使用 React 19、TypeScript、Vite、React Router、TanStack Query、Zustand、Tailwind、Motion、Recharts。继续保留。

## 2. Reuse

| Area | Action |
|---|---|
| package/toolchain | KEEP |
| Vite/TS config | KEEP / tighten |
| design tokens/layout primitives | REVIEW + KEEP |
| generic formatters | KEEP |
| query/state infrastructure | KEEP |
| wallet abstractions | REVIEW before reuse |
| old mocks | REPLACE for V3 domain |
| Wealth business models | DO NOT USE as source of truth |

## 3. Replace / Exit Primary Routes

旧 Router 的 Funding / Portfolio / Goal / Mandate / milestone-oriented wealth flow 不再作为 V3 主产品。

第一阶段可以保留源文件但不 import，不要求大规模移动/删除，降低 rewrite 风险。

## 4. New Product Layer

新增 `src/v3/`，所有新业务从这里开始。建议新 `router.v3.tsx` 或直接替换 router import 指向 V3 tree，但保留 legacy 文件以便回滚。

## 5. Branch Strategy

1. `main` 保持当前稳定版本；
2. 创建 `feature/v3-1-living-agent`；
3. Gate 1–5 每阶段形成 checkpoint commit/PR；
4. 不在 main 上让 AI Studio 一次性批量重写。

## 6. Clean Rewrite Definition

**Keep infrastructure; rewrite domain, IA, pages, state machines, copy and economic UI.**


---

# 3X V3.1 — Release Checklist

## Demo Release

- [ ] Free claim flow
- [ ] Simulation badge
- [ ] AI Home
- [ ] Living Brain fixture
- [ ] Activity/Replay
- [ ] no wallet required
- [ ] analytics

## Testnet Alpha

- [ ] TON owner wallet
- [ ] Agentic Wallet Testnet
- [ ] Gas disclosure
- [ ] signer isolation
- [ ] typed intents
- [ ] simulation + Risk Engine
- [ ] Restricted Seed ledger
- [ ] QNE
- [ ] 3X progress
- [ ] Testnet claim
- [ ] revoke/pause
- [ ] reconciliation

## 50-user Beta

- [ ] support runbook
- [ ] security review
- [ ] zero P0 invariant failure
- [ ] funnel complete
- [ ] compute cost measured
- [ ] Brain Trace useful to support

## 1,000-user Beta

- [ ] D30/D90 cohorts
- [ ] external revenue ratio
- [ ] QNE distributions
- [ ] stage completion rates
- [ ] reinvestment
- [ ] Token Productivity
- [ ] Compute ROI
- [ ] Sybil rate
- [ ] LP simulation rerun
- [ ] Team Burn parity rerun

## Mainnet/TGE

Not approved by this document. Requires separate V4/Mainnet Freeze review.
