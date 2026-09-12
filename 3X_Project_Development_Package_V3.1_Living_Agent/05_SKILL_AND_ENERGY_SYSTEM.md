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
