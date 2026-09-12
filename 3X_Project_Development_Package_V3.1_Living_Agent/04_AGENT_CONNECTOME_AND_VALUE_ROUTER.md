# 3X V3.1 — Agent Connectome, Value Router & Living Brain Runtime

## 1. 为什么引入 Connectome 思想

MaleCNS 等连接组项目最值得 3X 参考的不是“用果蝇脑交易”，而是三个工程思想：

1. 专门回路而不是所有输入都进入同一个万能模型；
2. 环境刺激只激活相关路径；
3. 输入、内部活动、动作和结果可以被 Replay。

3X 将其转化为 **Semantic Agent Connectome**，不是生物神经模拟。

## 2. Runtime 总图

```text
Environment / Opportunity Graph
          ↓
Event & Sensory Layer
          ↓
Pre-filter / Cheap Deterministic Rules
          ↓
Value Router
          ↓
Relevant Skill Circuits only
          ↓
Model Router (if needed)
          ↓
Decision Math / Portfolio / Task ROI
          ↓
Executive Arbiter
          ↓
IMMUTABLE Risk Gate
          ↓
Execution Adapter / Task Action
          ↓
Outcome & Economic Ledger
          ↓
Bounded Learning / Reputation / Trace
```

## 3. Sparse Activation

每个事件只唤醒相关 Circuit。默认优先级：

1. deterministic filter；
2. cached/shared intelligence；
3. cheap model；
4. strong model；
5. multi-model committee only when high-value + ambiguous + allowed by budget。

目标不是“少用 AI”，而是让每单位 compute 创造更高经济价值。

## 4. Value Router

### 输入

- estimated gross value；
- probability of success；
- expected compute cost；
- execution/network cost；
- risk penalty；
- time/opportunity cost；
- skill confidence；
- owner budget；
- agent reputation/experience；
- uncertainty。

### 核心估计

`ExpectedNetValue = P(success) × GrossValue - ComputeCost - ExecutionCost - RiskPenalty - OpportunityCost`

`ComputeROI = ExpectedNetValue / PremiumComputeCost`

### 默认决策

- `ExpectedNetValue <= 0`：PASS，禁止 Premium Compute。
- 低价值/低不确定性：deterministic/cheap route。
- 高价值/中不确定性：strong model。
- 高价值/高风险/高不确定性：committee + extra simulation。
- Risk policy 不允许：直接 DENY，不再花模型费用。

### 用户预算

- `daily_premium_energy_budget`
- `max_energy_per_opportunity`
- `auto_spend_high_value`

系统必须在预算和价值门槛内运行。

## 5. No Value, No Premium Compute

高级 Energy 只允许因为：

- 高价值 Task；
- 明显经营/交易机会；
- 风险事件；
- 用户明确请求；
- Advanced/Legendary Skill 的必要步骤；
- 重要复核/审计。

基础安全、风险监控、Owner revoke、关键账本同步永远不依赖 Premium Energy。

## 6. Skill Circuit

Skill 是经过版本化和认证的功能回路，不只是 Prompt。

例：`Advanced Task Router`

```text
Task Feed
  ↓
Task Classifier
  ├─ ROI Estimator
  ├─ Energy Cost Estimator
  ├─ Success Probability
  └─ Reputation / Deadline Check
        ↓
Bid Optimizer
        ↓
Risk Gate
        ↓
Bid / Pass / Delegate
```

Skill manifest 定义 inputs、modules、outputs、permissions、risk class、energy profile、version、hash、benchmark。

## 7. Executive Arbiter

当多个 Skill 同时给出动作时，Arbiter 根据：

- owner intent；
- priority；
- available capital；
- resource budget；
- conflict rules；
- Risk result；
- opportunity capacity；

选出一个或一组兼容 actions。Arbiter 不具有绕过 Risk 的权力。

## 8. Bounded Plasticity

AI 可以学习：

- routing weights；
- confidence；
- task preference；
- model preference under policy；
- memory retrieval priority；
- Skill internal non-risk parameter within approved range。

每次学习更新必须记录：before/after、reason、evidence window、benchmark impact、rollback id。

AI 不能学习或修改：

- risk limit；
- allowlist；
- signer policy；
- contract permissions；
- asset verification；
- simulation requirement；
- withdrawal/revoke rules。

## 9. Brain Trace

每次重要动作生成 trace：

- input snapshot ids；
- active circuits；
- model route；
- energy cost；
- estimates；
- decision math；
- risk checks；
- action；
- outcome；
- economic entries；
- version hashes。

Brain UI 只渲染真实 Trace。

## 10. Living Brain Visualization

用户看到 5–12 个 semantic nodes，例如：

- Market Sense；
- Task Hunter；
- Research；
- Memory；
- Value Hunter；
- Energy Planner；
- Risk Guardian；
- Execute。

状态：`sleeping / active / blocked / completed / protected`。

Living Brain 的价值是“让智能可见”，不是增加用户配置项。

## 11. Skill Arena

Advanced/Legendary Skill 进入平台前必须：

1. deterministic sandbox；
2. baseline comparison；
3. held-out scenarios；
4. adversarial scenarios；
5. cost/energy test；
6. risk violation = 0 for hard invariants；
7. ablation test；
8. versioned certification。

输出：success rate、false-positive、risk violation、compute efficiency、benchmark version、certification status。

## 12. MaleCNS 的使用边界

Production Agent 不使用真实 MaleCNS 作为真钱决策核心。真实 MaleCNS 仅用于 `3X Labs` 的科研/传播沙盒。
