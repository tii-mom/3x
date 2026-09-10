import {
  PortfolioOverview,
  PortfolioCategoryData,
  Goal,
  ActivityEvent,
  WalletInfo,
  WealthControls,
} from '../types';

export const initialPortfolioOverview: PortfolioOverview = {
  nav: 184.28,
  startingCapital: 100.0,
  pnlSinceStart: 84.28,
  nextMilestone: 300.0,
  milestoneProgress: 0.614,
  autopilotStatus: 'RUNNING',
  aiMode: 'GROW',
  lastReviewMinutes: 8,
  allocation: {
    reserve: 0.42,
    yield: 0.33,
    growth: 0.25,
  },
  protectedWealth: 32.0,
  risk: 'BALANCED',
};

export const initialPortfolioCategories: PortfolioCategoryData[] = [
  {
    category: 'RESERVE',
    name: 'Liquid Reserve & Principal',
    description: 'Safe assets providing downside capital preservation and immediate liquidity buffer.',
    valueUsd: 77.40,
    percentage: 42,
    assets: [
      {
        id: 'res-1',
        symbol: 'USDT',
        name: 'Tether USD (TON native)',
        amount: '45.00 USDT',
        valueUsd: 45.00,
        sharePercent: 24.4,
        protocol: 'Native Safe Vault',
        status: 'Safe Reserve',
      },
      {
        id: 'res-2',
        symbol: 'TON',
        name: 'TON Liquid Reserve',
        amount: '6.00 TON',
        valueUsd: 32.40,
        sharePercent: 17.6,
        protocol: 'Sub-Wallet Balance',
        status: 'Gas & Execution',
      },
    ],
  },
  {
    category: 'YIELD',
    name: 'Yield Generating Vaults',
    description: 'Autonomous yield farming and liquid staking producing daily compounded cashflow.',
    valueUsd: 60.81,
    percentage: 33,
    assets: [
      {
        id: 'yld-1',
        symbol: 'stTON',
        name: 'Bemo Liquid Staking',
        amount: '5.20 stTON',
        valueUsd: 31.20,
        apy: 8.4,
        sharePercent: 16.9,
        protocol: 'Bemo Protocol',
        status: 'Active Auto-Compound',
      },
      {
        id: 'yld-2',
        symbol: 'LP-TON/USDT',
        name: 'DeDust Stable LP Vault',
        amount: '29.61 LP',
        valueUsd: 29.61,
        apy: 18.2,
        sharePercent: 16.1,
        protocol: 'DeDust V2',
        status: 'Autonomous Range',
      },
    ],
  },
  {
    category: 'GROWTH',
    name: 'Opportunistic Growth',
    description: 'Dynamic liquidity pools capturing fee volume with active risk guardrails.',
    valueUsd: 46.07,
    percentage: 25,
    assets: [
      {
        id: 'gro-1',
        symbol: 'STON/TON',
        name: 'STON.fi Dynamic Pool',
        amount: '46.07 USD',
        valueUsd: 46.07,
        apy: 24.6,
        sharePercent: 25.0,
        protocol: 'STON.fi DEX',
        status: 'Scanning Depth',
      },
    ],
  },
];

export const initialGoal: Goal = {
  currentLevel: 1,
  startingNav: 100.0,
  currentNav: 184.28,
  targetNav: 300.0,
  progress: 0.614,
  status: 'ACTIVE',
  levels: [
    { level: 1, target: 300.0, label: 'First Tripling', achieved: false, multiplier: '3x' },
    { level: 2, target: 900.0, label: 'Capital Accretion', achieved: false, multiplier: '9x' },
    { level: 3, target: 2700.0, label: 'Autonomous Scale', achieved: false, multiplier: '27x' },
    { level: 4, target: 8100.0, label: 'Financial Freedom', achieved: false, multiplier: '81x' },
  ],
};

export const initialActivities: ActivityEvent[] = [
  {
    id: 'act-001',
    type: 'INVESTED',
    title: 'Allocated to DeDust LP',
    description: 'AI moved $18.40 into TON/USDT liquidity pool to capture 18.2% APY.',
    amount: 18.40,
    timestamp: '8m ago',
    status: 'Confirmed',
    txHash: '9e8a...32f1',
    evidence: {
      source: 'DeDust DEX Analytics',
      apy: '18.2% APY',
      confidence: 94,
      trigger: 'Pool trading volume surge exceeded 2.4x median threshold.',
    },
    execution: {
      route: 'USDT -> TON/USDT LP',
      slippage: '0.02%',
      gasFeeTon: '0.008 TON',
      timestampExact: 'Today at 19:21:40 UTC',
    },
    reasoningSnippet: 'DeDust pool volume surged while fee capture hit a 7-day peak with safe liquidity depth.',
  },
  {
    id: 'act-002',
    type: 'OBSERVED',
    title: 'Market Routine Scan Completed',
    description: 'AI inspected 124 TON liquidity pools. No risk anomalies detected.',
    timestamp: '28m ago',
    status: 'Verified',
    evidence: {
      source: 'Guardian Engine v4.8',
      apy: 'N/A',
      confidence: 99,
      trigger: 'Scheduled 30-minute state telemetry audit.',
    },
    execution: {
      route: 'On-chain read query',
      slippage: '0.00%',
      gasFeeTon: '0.000 TON',
      timestampExact: 'Today at 19:01:12 UTC',
    },
    reasoningSnippet: 'Market spreads and pool depth remained within safe bounds; no rebalance required.',
  },
  {
    id: 'act-003',
    type: 'PROTECTED',
    title: 'Protected Profit Sweep',
    description: 'AI locked $8.20 of realized yield into protected safe reserve.',
    amount: 8.20,
    timestamp: '2h ago',
    status: 'Protected',
    txHash: 'c4b1...889a',
    evidence: {
      source: 'Profit Ratchet Controller',
      apy: 'N/A',
      confidence: 96,
      trigger: 'Portfolio NAV gain achieved milestone sub-threshold.',
    },
    execution: {
      route: 'LP Yield -> USDT Floor',
      slippage: '0.01%',
      gasFeeTon: '0.005 TON',
      timestampExact: 'Today at 17:28:04 UTC',
    },
    reasoningSnippet: 'Secured gains to ensure the cumulative protected wealth never drops below safety floor.',
  },
  {
    id: 'act-004',
    type: 'RESEARCHED',
    title: 'Evaluated Storm Trade Hedging',
    description: 'AI analyzed perpetual funding rates; decided to pass due to volatility spread.',
    timestamp: '4h ago',
    status: 'Filtered',
    evidence: {
      source: 'Storm Trade Oracle',
      apy: '28.5% APY',
      confidence: 62,
      trigger: 'Funding rate dislocation signal.',
    },
    execution: {
      route: 'Simulated Execution',
      slippage: '0.14%',
      gasFeeTon: '0.000 TON',
      timestampExact: 'Today at 15:30:19 UTC',
    },
    reasoningSnippet: 'Projected net risk exceeded 5% institutional guardrail limit.',
  },
  {
    id: 'act-005',
    type: 'REBALANCING',
    title: 'Rebalanced STON.fi Exposure',
    description: 'Trimmed $12.50 to rebalance portfolio risk back to 25% growth cap.',
    amount: 12.50,
    timestamp: '7h ago',
    status: 'Completed',
    txHash: 'fa20...91b8',
    evidence: {
      source: 'Portfolio Risk Sentinel',
      apy: '22.1% APY',
      confidence: 91,
      trigger: 'Growth category rose to 28.4% of total NAV after price surge.',
    },
    execution: {
      route: 'STON.fi LP -> USDT Reserve',
      slippage: '0.03%',
      gasFeeTon: '0.009 TON',
      timestampExact: 'Today at 12:45:00 UTC',
    },
    reasoningSnippet: 'Rebalancing back to mandate prevents concentrated single-asset drawdowns.',
  },
  {
    id: 'act-006',
    type: 'MILESTONE',
    title: 'Crossed $180 Milestone Marker',
    description: 'Portfolio reached 60% of Level 1 journey toward $300 goal.',
    amount: 180.00,
    timestamp: '1d ago',
    status: 'Milestone',
    evidence: {
      source: 'Goal Engine',
      apy: 'Cumulative +80%',
      confidence: 100,
      trigger: 'Target progress marker achieved.',
    },
  },
];

export const initialWallet: WalletInfo = {
  isConnected: true,
  ownerAddress: 'EQBx...LmNo',
  subWalletAddress: 'EQD9...42a0',
  balanceTon: 42.5,
  balanceUsdt: 120.0,
  network: 'TON Mainnet',
  isSubWalletActive: true,
  subWalletAllocatedUsd: 184.28,
};

export const initialControls: WealthControls = {
  autopilotStatus: 'RUNNING',
  profitPreference: 'COMPOUND_ALL',
  safeReserveFloor: 50.0,
  singleActionCapPercent: 5.0,
  slippageTolerancePercent: 0.05,
  isEmergencyPaused: false,
};

// Historical chart data
export const chartData24H = [
  { time: '00:00', nav: 181.10, reserve: 76.5, yield: 59.8, growth: 44.8 },
  { time: '04:00', nav: 181.85, reserve: 76.6, yield: 60.1, growth: 45.15 },
  { time: '08:00', nav: 182.40, reserve: 76.8, yield: 60.3, growth: 45.3 },
  { time: '12:00', nav: 183.10, reserve: 77.0, yield: 60.5, growth: 45.6 },
  { time: '16:00', nav: 183.75, reserve: 77.2, yield: 60.7, growth: 45.85 },
  { time: '20:00', nav: 184.02, reserve: 77.3, yield: 60.75, growth: 45.97 },
  { time: 'Now', nav: 184.28, reserve: 77.4, yield: 60.81, growth: 46.07 },
];

export const chartData7D = [
  { time: 'Day 1', nav: 162.10, reserve: 70, yield: 54, growth: 38 },
  { time: 'Day 2', nav: 165.40, reserve: 71, yield: 55, growth: 39 },
  { time: 'Day 3', nav: 169.80, reserve: 72, yield: 57, growth: 40 },
  { time: 'Day 4', nav: 171.20, reserve: 73, yield: 57, growth: 41 },
  { time: 'Day 5', nav: 176.50, reserve: 74, yield: 59, growth: 43 },
  { time: 'Day 6', nav: 180.10, reserve: 76, yield: 60, growth: 44 },
  { time: 'Day 7', nav: 184.28, reserve: 77.4, yield: 60.8, growth: 46 },
];

export const chartData30D = [
  { time: 'Week 1', nav: 112.50 },
  { time: 'Week 2', nav: 134.20 },
  { time: 'Week 3', nav: 158.90 },
  { time: 'Week 4', nav: 184.28 },
];

export const chartDataALL = [
  { time: 'Start', nav: 100.00 },
  { time: 'M1', nav: 125.40 },
  { time: 'M2', nav: 148.90 },
  { time: 'Now', nav: 184.28 },
];
