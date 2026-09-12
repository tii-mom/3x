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
