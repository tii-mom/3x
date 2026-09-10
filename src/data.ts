import { ActivityItem, AutopilotState, GuardrailsState, MilestoneState, SubWalletState } from './types';

export const initialAutopilot: AutopilotState = {
  isActive: true,
  version: 'v4.8 Guardian',
  poolsLive: 124,
  lastAuditMinutesAgo: 4,
  currentApy: 18.2,
  volatilityRate: 0.04,
  pair: 'TON/USDT',
  reasoningSnippet: 'Holding TON/USDT liquidity at 18.2% APY. Volatility threshold stable at <0.04%.',
};

export const initialMilestone: MilestoneState = {
  currentValue: 1248.42,
  originValue: 100.0,
  targetValue: 3000.0,
  step: 1,
  totalSteps: 3,
  strategyMode: 'grow',
  reinvestmentRule: 'auto-compound',
};

export const initialGuardrails: GuardrailsState = {
  maxCapPercent: 5.0,
  safeReserveFloor: 500.0,
  slippageMaxPercent: 0.05,
  isEmergencyPaused: false,
};

export const initialSubWallet: SubWalletState = {
  shortAddress: 'EQD9...42a0',
  fullAddress: 'EQD9tPj4xZ9Q9c_42a09kLmPq0w8zYmU2x1v5a0b89f',
  mainWalletAddress: 'EQBx7m2R_911e3pLaK89m0uTwXyZaBcDeFgHiJkLmNo',
  allocatedCapital: 1248.42,
  isolated: true,
};

export const initialActivities: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'DeDust Liquidity Harvested',
    description: 'Auto-compounded daily yield into TON/USDT LP vault.',
    timestamp: '4m ago',
    category: 'yield',
    amount: '+$4.12 USDT',
    txHash: '9e8a...32f1',
    verified: true,
  },
  {
    id: 'act-2',
    title: 'Dynamic Exposure Rebalance',
    description: 'Adjusted single-action cap to maintain 5.0% risk parameter across 124 scanned pools.',
    timestamp: '22m ago',
    category: 'rebalance',
    amount: '62.40 USDT',
    txHash: 'c4b1...889a',
    verified: true,
  },
  {
    id: 'act-3',
    title: 'Smart Guardian Telemetry Check',
    description: 'v4.8 Guardian verified zero contract anomalies on TON Mainnet.',
    timestamp: '1h ago',
    category: 'guardrail',
    txHash: '77f0...d20a',
    verified: true,
  },
  {
    id: 'act-4',
    title: 'Capital Inflow Recorded',
    description: 'Transferred from main wallet into isolated sub-wallet.',
    timestamp: '3h ago',
    category: 'capital',
    amount: '+$250.00 USDT',
    txHash: '319d...e54c',
    verified: true,
  },
  {
    id: 'act-5',
    title: 'Ston.fi Curve Re-pegging',
    description: 'Optimized swap route avoiding 0.08% slippage spike.',
    timestamp: '7h ago',
    category: 'rebalance',
    amount: '180.20 TON',
    txHash: 'fa20...91b8',
    verified: true,
  },
];
