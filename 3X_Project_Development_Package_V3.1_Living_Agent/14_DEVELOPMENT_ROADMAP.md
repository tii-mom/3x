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
