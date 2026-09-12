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
