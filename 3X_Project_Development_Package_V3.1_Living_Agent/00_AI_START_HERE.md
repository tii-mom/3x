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
