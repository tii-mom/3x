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
