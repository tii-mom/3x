import { create } from 'zustand';
import {
  PortfolioOverview,
  PortfolioCategoryData,
  Goal,
  ActivityEvent,
  WalletInfo,
  WealthControls,
  AutopilotStatus,
  ProfitPreference,
  AiMode,
} from '../../types';
import {
  initialPortfolioOverview,
  initialPortfolioCategories,
  initialGoal,
  initialActivities,
  initialWallet,
  initialControls,
} from '../../mocks';

interface AppStoreState {
  portfolio: PortfolioOverview;
  categories: PortfolioCategoryData[];
  goal: Goal;
  activities: ActivityEvent[];
  wallet: WalletInfo;
  controls: WealthControls;
  isOnboarded: boolean;
  isSimulatingScan: boolean;

  // Actions
  toggleAutopilot: () => void;
  setAutopilotStatus: (status: AutopilotStatus) => void;
  setAiMode: (mode: AiMode) => void;
  setProfitPreference: (pref: ProfitPreference) => void;
  addCapital: (amount: number, asset?: string) => void;
  withdrawCapital: (amount: number) => void;
  setEmergencyPause: (paused: boolean) => void;
  revokeSubWallet: () => void;
  updateTargetGoal: (newTarget: number) => void;
  completeOnboarding: (startingAmount: number, target: number) => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
  triggerAiRebalance: () => Promise<void>;
  simulateMilestoneReach: () => void;
  resetToInitialState: () => void;
}

export const useAppStore = create<AppStoreState>((set, get) => ({
  portfolio: initialPortfolioOverview,
  categories: initialPortfolioCategories,
  goal: initialGoal,
  activities: initialActivities,
  wallet: initialWallet,
  controls: initialControls,
  isOnboarded: true,
  isSimulatingScan: false,

  toggleAutopilot: () =>
    set((state) => {
      const isCurrentlyRunning = state.controls.autopilotStatus === 'RUNNING';
      const nextStatus: AutopilotStatus = isCurrentlyRunning ? 'PAUSED' : 'RUNNING';
      const newActivity: ActivityEvent = {
        id: `act-${Date.now()}`,
        type: 'RISK_CHANGED',
        title: nextStatus === 'RUNNING' ? 'Autopilot Resumed' : 'Autopilot Paused',
        description:
          nextStatus === 'RUNNING'
            ? 'Autonomous market scanning and rebalancing resumed.'
            : 'AI placed in standby. No new positions will be opened.',
        timestamp: 'Just now',
        status: nextStatus,
        evidence: {
          source: 'User Command',
          apy: 'N/A',
          confidence: 100,
          trigger: 'Direct user toggle in Control Center.',
        },
      };

      return {
        controls: { ...state.controls, autopilotStatus: nextStatus },
        portfolio: { ...state.portfolio, autopilotStatus: nextStatus },
        activities: [newActivity, ...state.activities],
      };
    }),

  setAutopilotStatus: (status: AutopilotStatus) =>
    set((state) => ({
      controls: { ...state.controls, autopilotStatus: status },
      portfolio: { ...state.portfolio, autopilotStatus: status },
    })),

  setAiMode: (mode: AiMode) =>
    set((state) => ({
      portfolio: { ...state.portfolio, aiMode: mode },
    })),

  setProfitPreference: (pref: ProfitPreference) =>
    set((state) => {
      const descriptions = {
        COMPOUND_ALL: 'All daily yield is automatically reinvested back into top vaults.',
        WITHDRAW_PROFIT: 'Realized gains are swept into protected safe USDT reserve.',
        SPLIT_PROFIT: '50% of profits compounded, 50% routed to safe floor.',
      };

      const newActivity: ActivityEvent = {
        id: `act-${Date.now()}`,
        type: 'RISK_CHANGED',
        title: `Profit Mandate: ${pref.replace('_', ' ')}`,
        description: descriptions[pref],
        timestamp: 'Just now',
        status: 'Active',
      };

      return {
        controls: { ...state.controls, profitPreference: pref },
        activities: [newActivity, ...state.activities],
      };
    }),

  addCapital: (amount: number, asset = 'USDT') =>
    set((state) => {
      const newNav = +(state.portfolio.nav + amount).toFixed(2);
      const newMilestoneProgress = Math.min(
        1,
        +(
          (newNav - state.portfolio.startingCapital) /
          (state.portfolio.nextMilestone - state.portfolio.startingCapital)
        ).toFixed(3)
      );

      const newActivity: ActivityEvent = {
        id: `act-${Date.now()}`,
        type: 'INVESTED',
        title: 'Capital Added to Sub-Wallet',
        description: `Funded +$${amount.toFixed(2)} ${asset} into isolated autopilot balance.`,
        amount,
        timestamp: 'Just now',
        status: 'Confirmed',
        txHash: `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
        evidence: {
          source: 'TON Connect Transaction',
          apy: 'N/A',
          confidence: 100,
          trigger: 'User approved deposit from primary wallet.',
        },
      };

      return {
        portfolio: {
          ...state.portfolio,
          nav: newNav,
          milestoneProgress: newMilestoneProgress,
        },
        goal: {
          ...state.goal,
          currentNav: newNav,
          progress: newMilestoneProgress,
        },
        wallet: {
          ...state.wallet,
          subWalletAllocatedUsd: +(state.wallet.subWalletAllocatedUsd + amount).toFixed(2),
        },
        activities: [newActivity, ...state.activities],
      };
    }),

  withdrawCapital: (amount: number) =>
    set((state) => {
      const newNav = Math.max(state.portfolio.startingCapital, +(state.portfolio.nav - amount).toFixed(2));
      const newMilestoneProgress = Math.max(
        0,
        +(
          (newNav - state.portfolio.startingCapital) /
          (state.portfolio.nextMilestone - state.portfolio.startingCapital)
        ).toFixed(3)
      );

      const newActivity: ActivityEvent = {
        id: `act-${Date.now()}`,
        type: 'EXITED',
        title: 'Withdrawn to Primary Wallet',
        description: `Returned $${amount.toFixed(2)} USD from isolated sub-wallet back to main wallet.`,
        amount,
        timestamp: 'Just now',
        status: 'Confirmed',
        txHash: `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
      };

      return {
        portfolio: {
          ...state.portfolio,
          nav: newNav,
          milestoneProgress: newMilestoneProgress,
        },
        goal: {
          ...state.goal,
          currentNav: newNav,
          progress: newMilestoneProgress,
        },
        wallet: {
          ...state.wallet,
          subWalletAllocatedUsd: Math.max(0, +(state.wallet.subWalletAllocatedUsd - amount).toFixed(2)),
        },
        activities: [newActivity, ...state.activities],
      };
    }),

  setEmergencyPause: (paused: boolean) =>
    set((state) => {
      const newActivity: ActivityEvent = {
        id: `act-${Date.now()}`,
        type: 'PROTECTED',
        title: paused ? 'Emergency Circuit Breaker Engaged' : 'Circuit Breaker Released',
        description: paused
          ? 'Autonomous sub-wallet actions halted instantly. Zero contract executions permitted.'
          : 'Normal autonomous monitoring resumed under institutional guardrails.',
        timestamp: 'Just now',
        status: paused ? 'HALTED' : 'RUNNING',
      };

      return {
        controls: {
          ...state.controls,
          isEmergencyPaused: paused,
          autopilotStatus: paused ? 'PAUSED' : 'RUNNING',
        },
        portfolio: {
          ...state.portfolio,
          autopilotStatus: paused ? 'PAUSED' : 'RUNNING',
        },
        activities: [newActivity, ...state.activities],
      };
    }),

  revokeSubWallet: () =>
    set((state) => {
      const liquidatedAmount = state.portfolio.nav;
      const newActivity: ActivityEvent = {
        id: `act-${Date.now()}`,
        type: 'PROTECTED',
        title: 'Sub-Wallet Access Revoked',
        description: `Full autonomous contract access revoked. Swept $${liquidatedAmount.toFixed(2)} to primary wallet.`,
        timestamp: 'Just now',
        status: 'Revoked',
      };

      return {
        portfolio: {
          ...state.portfolio,
          nav: 0,
          milestoneProgress: 0,
          autopilotStatus: 'PAUSED',
        },
        wallet: {
          ...state.wallet,
          isSubWalletActive: false,
          subWalletAllocatedUsd: 0,
        },
        controls: {
          ...state.controls,
          autopilotStatus: 'PAUSED',
        },
        activities: [newActivity, ...state.activities],
      };
    }),

  updateTargetGoal: (newTarget: number) =>
    set((state) => {
      const progress = Math.min(
        1,
        +(
          (state.portfolio.nav - state.portfolio.startingCapital) /
          (newTarget - state.portfolio.startingCapital)
        ).toFixed(3)
      );

      return {
        portfolio: {
          ...state.portfolio,
          nextMilestone: newTarget,
          milestoneProgress: progress,
        },
        goal: {
          ...state.goal,
          targetNav: newTarget,
          progress,
        },
      };
    }),

  completeOnboarding: (startingAmount: number, target: number) =>
    set((state) => ({
      isOnboarded: true,
      portfolio: {
        ...state.portfolio,
        nav: startingAmount,
        startingCapital: startingAmount,
        pnlSinceStart: 0,
        nextMilestone: target,
        milestoneProgress: 0,
        autopilotStatus: 'RUNNING',
      },
      goal: {
        ...state.goal,
        startingNav: startingAmount,
        currentNav: startingAmount,
        targetNav: target,
        progress: 0,
      },
      wallet: {
        ...state.wallet,
        isConnected: true,
        isSubWalletActive: true,
        subWalletAllocatedUsd: startingAmount,
      },
      controls: {
        ...state.controls,
        autopilotStatus: 'RUNNING',
      },
    })),

  connectWallet: () =>
    set((state) => ({
      wallet: {
        ...state.wallet,
        isConnected: true,
      },
    })),

  disconnectWallet: () =>
    set((state) => ({
      wallet: {
        ...state.wallet,
        isConnected: false,
      },
    })),

  triggerAiRebalance: async () => {
    set({ isSimulatingScan: true });
    // Realistic telemetry scan interval
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const state = get();
    const yieldIncrement = 0.68;
    const newNav = +(state.portfolio.nav + yieldIncrement).toFixed(2);
    const newPnl = +(state.portfolio.pnlSinceStart + yieldIncrement).toFixed(2);
    const newProgress = Math.min(
      1,
      +(
        (newNav - state.portfolio.startingCapital) /
        (state.portfolio.nextMilestone - state.portfolio.startingCapital)
      ).toFixed(3)
    );

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      type: 'REBALANCING',
      title: 'Autonomous Scan & Yield Rebalance',
      description: 'AI detected 18.4% APY opportunity on DeDust TON/USDT LP and captured +$0.68 yield.',
      amount: yieldIncrement,
      timestamp: 'Just now',
      status: 'Completed',
      txHash: `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
      evidence: {
        source: 'Guardian Engine Live Audit',
        apy: '18.4% APY',
        confidence: 97,
        trigger: 'Surge in liquidity pool trading fees detected.',
      },
      execution: {
        route: 'USDT -> DeDust LP Vault',
        slippage: '0.01%',
        gasFeeTon: '0.006 TON',
        timestampExact: 'Just now',
      },
      reasoningSnippet: 'Rebalancing routed under strict 5% single-action limit with instant profit compounding.',
    };

    set({
      isSimulatingScan: false,
      portfolio: {
        ...state.portfolio,
        nav: newNav,
        pnlSinceStart: newPnl,
        milestoneProgress: newProgress,
        lastReviewMinutes: 0,
      },
      goal: {
        ...state.goal,
        currentNav: newNav,
        progress: newProgress,
      },
      wallet: {
        ...state.wallet,
        subWalletAllocatedUsd: newNav,
      },
      activities: [newActivity, ...state.activities],
    });
  },

  simulateMilestoneReach: () =>
    set((state) => {
      const targetNav = state.portfolio.nextMilestone;
      const newPnl = +(targetNav - state.portfolio.startingCapital).toFixed(2);
      const newActivity: ActivityEvent = {
        id: `act-${Date.now()}`,
        type: 'MILESTONE',
        title: 'Level 1 Milestone Complete (3x Target)',
        description: `Autonomous portfolio reached target milestone of $${targetNav.toFixed(2)} USD!`,
        amount: targetNav,
        timestamp: 'Just now',
        status: 'Milestone',
        evidence: {
          source: 'Goal Milestone Sentinel',
          apy: 'Cumulative +200%',
          confidence: 100,
          trigger: 'Target goal reached.',
        },
      };

      return {
        portfolio: {
          ...state.portfolio,
          nav: targetNav,
          pnlSinceStart: newPnl,
          milestoneProgress: 1.0,
        },
        goal: {
          ...state.goal,
          currentNav: targetNav,
          progress: 1.0,
          status: 'COMPLETED',
        },
        wallet: {
          ...state.wallet,
          subWalletAllocatedUsd: targetNav,
        },
        activities: [newActivity, ...state.activities],
      };
    }),

  resetToInitialState: () =>
    set({
      portfolio: initialPortfolioOverview,
      categories: initialPortfolioCategories,
      goal: initialGoal,
      activities: initialActivities,
      wallet: initialWallet,
      controls: initialControls,
      isOnboarded: true,
      isSimulatingScan: false,
    }),
}));
