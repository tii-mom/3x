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
