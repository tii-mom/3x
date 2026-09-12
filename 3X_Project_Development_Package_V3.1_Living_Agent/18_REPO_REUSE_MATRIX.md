# 3X V3.1 — Existing Repo Reuse Matrix

目标 Repo：`yi-17-lab/3X`  
基线：`9ea8d3c9f3cd04e62077667e1b9357ce6c10c811`

## 1. 当前工程基础

现有 Repo 使用 React 19、TypeScript、Vite、React Router、TanStack Query、Zustand、Tailwind、Motion、Recharts。继续保留。

## 2. Reuse

| Area | Action |
|---|---|
| package/toolchain | KEEP |
| Vite/TS config | KEEP / tighten |
| design tokens/layout primitives | REVIEW + KEEP |
| generic formatters | KEEP |
| query/state infrastructure | KEEP |
| wallet abstractions | REVIEW before reuse |
| old mocks | REPLACE for V3 domain |
| Wealth business models | DO NOT USE as source of truth |

## 3. Replace / Exit Primary Routes

旧 Router 的 Funding / Portfolio / Goal / Mandate / milestone-oriented wealth flow 不再作为 V3 主产品。

第一阶段可以保留源文件但不 import，不要求大规模移动/删除，降低 rewrite 风险。

## 4. New Product Layer

新增 `src/v3/`，所有新业务从这里开始。建议新 `router.v3.tsx` 或直接替换 router import 指向 V3 tree，但保留 legacy 文件以便回滚。

## 5. Branch Strategy

1. `main` 保持当前稳定版本；
2. 创建 `feature/v3-1-living-agent`；
3. Gate 1–5 每阶段形成 checkpoint commit/PR；
4. 不在 main 上让 AI Studio 一次性批量重写。

## 6. Clean Rewrite Definition

**Keep infrastructure; rewrite domain, IA, pages, state machines, copy and economic UI.**
