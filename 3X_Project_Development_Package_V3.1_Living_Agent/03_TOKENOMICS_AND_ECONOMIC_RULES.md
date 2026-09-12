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
