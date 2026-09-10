export type AutopilotStatus =
  | 'RUNNING'
  | 'OBSERVING'
  | 'RESEARCHING'
  | 'REBALANCING'
  | 'PROTECTING'
  | 'PAUSED';

export type AiMode = 'GROW' | 'PRESERVE' | 'SHIELDED';
export type RiskProfile = 'CONSERVATIVE' | 'BALANCED' | 'GROWTH';
export type ProfitPreference = 'COMPOUND_ALL' | 'WITHDRAW_PROFIT' | 'SPLIT_PROFIT';

export interface PortfolioAllocation {
  reserve: number; // e.g. 0.42
  yield: number;   // e.g. 0.33
  growth: number;  // e.g. 0.25
}

export interface PortfolioOverview {
  nav: number;
  startingCapital: number;
  pnlSinceStart: number;
  nextMilestone: number;
  milestoneProgress: number;
  autopilotStatus: AutopilotStatus;
  aiMode: AiMode;
  lastReviewMinutes: number;
  allocation: PortfolioAllocation;
  protectedWealth: number;
  risk: RiskProfile;
}

export interface AssetPosition {
  id: string;
  symbol: string;
  name: string;
  amount: string;
  valueUsd: number;
  apy?: number;
  sharePercent: number;
  protocol?: string;
  status?: string;
}

export interface PortfolioCategoryData {
  category: 'RESERVE' | 'YIELD' | 'GROWTH';
  name: string;
  description: string;
  valueUsd: number;
  percentage: number;
  assets: AssetPosition[];
}

export interface MilestoneLevel {
  level: number;
  target: number;
  label: string;
  achieved: boolean;
  multiplier: string;
}

export interface Goal {
  currentLevel: number;
  startingNav: number;
  currentNav: number;
  targetNav: number;
  progress: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  levels: MilestoneLevel[];
}

export type ActivityEventType =
  | 'OBSERVED'
  | 'RESEARCHED'
  | 'INVESTED'
  | 'EXITED'
  | 'PROTECTED'
  | 'RISK_CHANGED'
  | 'MILESTONE'
  | 'REBALANCING';

export type ActivityFilter = 'All' | 'Money' | 'AI' | 'Risk';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  description: string;
  amount?: number;
  timestamp: string;
  status?: string;
  txHash?: string;
  evidence?: {
    source: string;
    apy: string;
    confidence: number;
    trigger: string;
  };
  execution?: {
    route: string;
    slippage: string;
    gasFeeTon: string;
    timestampExact: string;
  };
  reasoningSnippet?: string;
}

export interface WalletInfo {
  isConnected: boolean;
  ownerAddress: string;
  subWalletAddress: string;
  balanceTon: number;
  balanceUsdt: number;
  network: string;
  isSubWalletActive: boolean;
  subWalletAllocatedUsd: number;
}

export interface WealthControls {
  autopilotStatus: AutopilotStatus;
  profitPreference: ProfitPreference;
  safeReserveFloor: number;
  singleActionCapPercent: number;
  slippageTolerancePercent: number;
  isEmergencyPaused: boolean;
}

// Stitch prototype backwards compatibility types
export type StrategyOperationalMode = 'grow' | 'preserve' | 'shielded';
export type ReinvestmentRule = 'auto-compound' | 'take-usdt' | 'split-50-50';
export type ActiveTab = 'home' | 'ai' | 'activity' | 'account';

export interface AutopilotState {
  isActive: boolean;
  version: string;
  poolsLive: number;
  lastAuditMinutesAgo: number;
  currentApy: number;
  volatilityRate: number;
  pair: string;
  reasoningSnippet: string;
}

export interface MilestoneState {
  currentValue: number;
  originValue: number;
  targetValue: number;
  step: number;
  totalSteps: number;
  strategyMode: StrategyOperationalMode;
  reinvestmentRule: ReinvestmentRule;
}

export interface GuardrailsState {
  maxCapPercent: number;
  safeReserveFloor: number;
  slippageMaxPercent: number;
  isEmergencyPaused: boolean;
}

export interface SubWalletState {
  shortAddress: string;
  fullAddress: string;
  mainWalletAddress: string;
  allocatedCapital: number;
  isolated: boolean;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: 'rebalance' | 'yield' | 'guardrail' | 'capital';
  amount?: string;
  txHash: string;
  verified: boolean;
}
