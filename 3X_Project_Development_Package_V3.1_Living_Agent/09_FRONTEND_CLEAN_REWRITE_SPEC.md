# 3X V3.1 — Frontend Clean Product Rewrite Specification

## 1. 结论

现有 `yi-17-lab/3X` 仓库继续使用，但产品层按 V3.1 **Clean Rewrite**。不在旧 TON Wealth 页面上逐页改名。

### 保留

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind
- Motion
- Recharts
- 通用 layout / UI primitives / formatters 中经过审查的部分

### 退出 Primary IA

- Funding-first onboarding
- Portfolio-first home
- Goal Journey
- Mandate onboarding
- APY / target date 等旧 Wealth 心智

旧文件第一阶段不必删除，只需从新 Router 脱离，避免大范围破坏。

## 2. 新路由

```text
/
/claim
/activate
/app
/app/skills
/app/energy
/app/market
/app/activity
/app/evolve
/app/team        (feature flag)
/app/me
/app/trace/:id
```

移动底栏固定：`AI / Market / Activity / Me`。

## 3. 推荐目录

```text
src/
  core/
    api/
    config/
    state/
    utils/
  design-system/
    components/
    tokens/
    layout/
  v3/
    app/
    pages/
    components/
    features/
      agent/
      skills/
      energy/
      market/
      activity/
      growth/
      wallet/
      trace/
    models/
    mocks/
  legacy/ (optional; or leave old files unreferenced)
```

## 4. 页面要求

### Landing

一句话价值主张 + free CTA。禁止金融术语堆叠。

### Claim

Name/avatar，几秒完成。创建 free demo Agent。

### Activate

清晰解释 Testnet、TON network fee、owner control、revoke。禁止把 Gas 写成平台费。

### AI Home

优先：status、today net result、Energy、Skills、Growth、current work、See Why。

### Skills

Inventory + equipped slots + capability explanation。Advanced Skill 展示“新行为”，不显示收益承诺。

### Energy

Base/Premium、budget、recent use、Compute ROI、buy quote（P1）。

### Market

MVP 可先是 Skill catalog + Energy；Task market feature flag。

### Activity

统一事件流；money/energy effect + result + replay。

### Trace

3–8 秒/可静态展开的 Semantic Brain Trace。

### Me

wallet、risk、environment、security、pause/revoke、support。

## 5. Living Brain UI

推荐 SVG/Canvas/CSS 实现轻量 semantic graph；不要直接依赖 Neuroglancer。

每个节点来自 trace data：

```ts
{ id, label, type, state, startedAt, endedAt, energyCost, resultCode }
```

禁止装饰性随机点亮导致与真实 trace 不一致。

## 6. Telegram Mini App

- safe-area；
- Telegram viewport；
- touch target >=44px；
- 尽量单列；
- 首屏 3 秒读懂；
- deep link share；
- Telegram identity 仅作为产品 identity 信号之一，不作为经济唯一身份。

## 7. Web

更完整 dashboard，但必须与 Telegram 使用相同领域模型。禁止产生“Web 是另一个产品”的分叉。

## 8. UI 环境标记

顶层必须有环境状态：`Simulation / Testnet / Mainnet`。当前 Mainnet UI hidden/disabled。

## 9. Design language

保留现有高端金融科技方向：calm、precise、trustworthy。Living Brain 用少量动态强调，不把全产品做成科幻游戏。

Palette baseline：

- Ink `#0A0D12`
- Canvas `#F7F9FC`
- Surface `#FFFFFF`
- Hairline `#E4E8EF`
- Agent Blue `#2F6BFF`
- Intelligence Cyan `#3AC8FF`
- Positive `#12A873`
- Negative `#DC5964`
- Warning `#D58B2A`
- Protected `#68758A`

## 10. Mock-first

Gate 1/2 用 `configs/mock_agent_fixture.json`，所有 API 通过 interface 抽象。不要在 React component 内 hard-code economic logic。

## 11. Frontend 验收

- No APY/wealth mandate primary flow；
- Free claim <3 core actions；
- AI Home 首屏含 status/result/energy/growth；
- Simulation/Testnet 不混淆；
- Brain Trace 来自 fixture/API；
- responsive 320px+；
- TypeScript noEmit 通过；
- no secrets；
- no arbitrary contract payload builder。
