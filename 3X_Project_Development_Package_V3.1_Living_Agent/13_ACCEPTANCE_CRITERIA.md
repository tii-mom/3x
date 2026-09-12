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
