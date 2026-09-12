# 3X V3.1 — User Journey & UX Specification

## 1. 核心 UX 原则

用户不应该“学习如何使用 3X”；用户应该在第一次打开时立即获得 AI，并很快看到它工作。

首日认知上限：

1. 我的 AI；
2. 它正在做什么；
3. 它今天赚/省/创造了什么；
4. Energy；
5. Skill；
6. 下一次 Evolution。

其他概念延迟解释。

## 2. Day 0：免费 Claim

入口：Telegram deep link / Web Landing。

流程：

`Open → Claim Free AI → Name/Avatar → AI Home`

不要求钱包。系统为匿名/Telegram identity 创建 `FREE_DEMO` Agent。

AI Home 初次状态：

- `READY`；
- Base Core 可用；
- 每日 Base Energy；
- 1 个基础 Skill Circuit；
- Paper Task / Paper Opportunity feed；
- 明确 `Simulation` 标识。

## 3. First Value Moment

目标：用户在 3–5 分钟内看到一次完整结果反馈。

推荐免费任务：低成本、确定性强、无需真钱，例如模拟 Task routing、公开信息整理、沙盒 Energy 市场或 Testnet task。

结果卡：

```text
MOMO worked while you were here.

Opportunity        Free testnet task
Result             Completed
Energy used        0 Premium
Reward             20 demo Energy
Why                Task Hunter → Risk Guardian → Execute
```

不要用“注册送 100 Token”作为主成功体验。

## 4. Activation

当用户点击“让 MOMO 真正开始工作”时才出现：

`Connect TON Owner Wallet → Explain network fee → Create/activate Agentic Wallet → User signs → Confirm Testnet → Register Primary AI`

必须明确：

- 用户支付的是 TON 网络 Gas，不是 3X activation fee；
- 当前环境是 Testnet；
- owner 保持 root ownership；
- operator key 不进入浏览器 LLM Context；
- 用户可 revoke/rotate/pause。

## 5. AI Home

### Telegram 首屏

必须优先显示：

```text
MOMO          3X TRADER
● WORKING

Today
Earned        +128 3X-equivalent / 3X
Spent         -21 3X-equivalent / 3X
Net           +107

Energy        82%
Next Evolution  2.71X → 3X

[See what MOMO is doing]
```

如果是 Demo/Paper，则金额旁必须永久显示 `Simulation`。

### Web 首屏

可增加：

- Qualified Earnings breakdown；
- Protocol Seed balance（标记 Restricted）；
- Earned Balance；
- Skill Build；
- recent Brain Trace；
- compute ROI；
- risk status。

## 6. Living Brain UX

Brain 不是独立主导航。只在以下时刻出现：

- AI 正在工作；
- 用户点 `See why / Replay`；
- Learn Skill；
- Evolution；
- Share Card。

显示 5–12 个语义节点，禁止展示 16 万“神经元”。例如：

`Market Sense → Value Hunter → Deep Research → Risk Guardian → Execute`

节点必须由真实 `trace_steps` 驱动。没有执行的步骤不许伪造点亮。

## 7. Skill Learn

用户获得 Skill Book 后：

`Skill Detail → What new behavior it unlocks → Energy profile → Learn → replacement confirmation if slot full → binding → Brain Growth animation`

反馈文案：

> `MOMO learned Advanced Task Router. New circuit installed.`

不能只写 `+15% yield`。

## 8. Energy UX

用户只看到：

- Base Energy；
- Premium Energy；
- 最近使用原因；
- 本月 Compute ROI。

禁止展示 API token 数量。

高级 Energy 消耗必须能点开解释：

```text
Used 3.1 Energy
Reason: High-value task needed deeper verification
Result: Won $2.40 task
Net value after compute: $2.11
```

如果结果失败，也诚实显示：

```text
Used 1.2 Energy
Result: Opportunity rejected
Reason: Risk-adjusted value became negative
```

## 9. Value Router 用户反馈

用户不用配置模型。只需要可选：

- Daily Premium Energy Budget；
- Max Energy per opportunity；
- Auto-spend on high-value opportunities on/off。

默认智能预算由平台推荐。

## 10. Activity & Brain Trace Replay

Activity item：

`event → money/energy effect → result → why`

重要行为可点 `Replay`，播放 3–8 秒：

`Opportunity → Skill → Estimate → Risk → Action → Result`

Replay 同时用于用户信任、客服、Debug 和分享。

## 11. Evolution

达到 Growth milestone：

- 显示 `Qualified Growth`，不显示“投资回报承诺”；
- 触发 Growth Claim eligibility；
- 增加 Skill Slot/能力/身份；
- Brain topology 扩展；
- 生成分享卡。

729X 以后只有 Prestige / Network capability，不再追加 Token emission。

## 12. 免费与付费层

### Free

- 1 AI identity；
- Base Core；
- 每日 Base Energy；
- Paper/Testnet task；
- 基础 Brain Trace；
- Common Skill trial；
- 不能伪装成真钱收益。

### Activated Testnet/Beta

- Agentic Wallet；
- eligible Primary Agent Generation；
- Restricted Seed；
- Qualified Earnings；
- Growth progression；
- Skill/Energy economy。

### Mature Paid Utility

用户为明确生产资料付费，而不是为了“解锁 app”：Premium Energy、Skill、AI Slot、Task Bond、Service。

## 13. 分享循环

分享内容优先级：

1. AI Evolution；
2. Brain Build / rare circuit；
3. “AI did X” 工作结果；
4. Generation identity；
5. Skill certification；
6. 3X Labs 挑战。

禁止以“币要涨”“保证3X”为分享核心。
