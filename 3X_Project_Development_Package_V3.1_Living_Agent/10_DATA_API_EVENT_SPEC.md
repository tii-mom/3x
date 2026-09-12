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
