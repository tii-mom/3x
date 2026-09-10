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
import {
  calculateMilestoneProgress,
  calculateInvestmentPnL,
  advanceToNextMilestone,
} from '../../services/goalService';

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
  advanceMilestone: () => void;
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
      const newNetContributions = +(state.portfolio.netContributions + amount).toFixed(2);
      const newMilestoneProgress = calculateMilestoneProgress(newNav, state.portfolio.nextMilestone);

      const newActivity: ActivityEvent = {
        id: `act-${Date.now()}`,
        type: 'CAPITAL_ADDED',
        title: 'Capital Added by User',
        description: `Funded +$${amount.toFixed(2)} ${asset} into AI Wallet. Total user capital: $${newNetContributions.toFixed(2)}.`,
        amount,
        timestamp: 'Just now',
        status: 'Confirmed',
        evidence: {
          source: 'User Deposit',
          apy: 'N/A',
          confidence: 100,
          trigger: 'User added capital to AI Wallet.',
        },
      };

      return {
        portfolio: {
          ...state.portfolio,
          nav: newNav,
          netContributions: newNetContributions,
          milestoneProgress: newMilestoneProgress,
        },
        goal: {
          ...state.goal,
          currentNav: newNav,
          progress: newMilestoneProgress,
        },
        wallet: {
          ...state.wallet,
          subWalletAllocatedUsd: newNav,
        },
        activities: [newActivity, ...state.activities],
      };
    }),

  withdrawCapital: (amount: number) =>
    set((state) => {
      const newNav = Math.max(0, +(state.portfolio.nav - amount).toFixed(2));
      const newNetContributions = Math.max(0, +(state.portfolio.netContributions - amount).toFixed(2));
      const newInvestmentPnL = calculateInvestmentPnL(newNav, newNetContributions);
      const newMilestoneProgress = calculateMilestoneProgress(newNav, state.portfolio.nextMilestone);

      const newActivity: ActivityEvent = {
        id: `act-${Date.now()}`,
        type: 'WITHDRAWAL',
        title: 'Withdrawn to Main Wallet',
        description: `Returned $${amount.toFixed(2)} from AI Wallet back to primary wallet. Remaining balance: $${newNav.toFixed(2)}.`,
        amount,
        timestamp: 'Just now',
        status: 'Confirmed',
      };

      return {
        portfolio: {
          ...state.portfolio,
          nav: newNav,
          netContributions: newNetContributions,
          investmentPnL: newInvestmentPnL,
          pnlSinceStart: newInvestmentPnL,
          milestoneProgress: newMilestoneProgress,
        },
        goal: {
          ...state.goal,
          currentNav: newNav,
          progress: newMilestoneProgress,
        },
        wallet: {
          ...state.wallet,
          subWalletAllocatedUsd: newNav,
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
      const progress = calculateMilestoneProgress(state.portfolio.nav, newTarget);

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
    set((state) => {
      const progress = calculateMilestoneProgress(startingAmount, target);
      return {
        isOnboarded: true,
        portfolio: {
          ...state.portfolio,
          nav: startingAmount,
          startingCapital: startingAmount,
          netContributions: startingAmount,
          investmentPnL: 0,
          pnlSinceStart: 0,
          nextMilestone: target,
          milestoneProgress: progress,
          autopilotStatus: 'RUNNING',
        },
        goal: {
          ...state.goal,
          currentLevel: 1,
          levelStartNav: startingAmount,
          startingNav: startingAmount,
          currentNav: startingAmount,
          targetNav: target,
          progress,
          status: 'ACTIVE',
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
      };
    }),

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
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const state = get();
    const yieldIncrement = 0.68;
    const newNav = +(state.portfolio.nav + yieldIncrement).toFixed(2);
    const newInvestmentPnL = calculateInvestmentPnL(newNav, state.portfolio.netContributions);
    const newProgress = calculateMilestoneProgress(newNav, state.portfolio.nextMilestone);

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      type: 'REBALANCING',
      title: 'Autonomous Scan & Yield Rebalance',
      description: 'AI detected 18.4% APY opportunity on DeDust TON/USDT LP and captured +$0.68 yield.',
      amount: yieldIncrement,
      timestamp: 'Just now',
      status: 'Confirmed',
      evidence: {
        source: 'AI Live Monitoring',
        apy: '18.4% APY',
        confidence: 97,
        trigger: 'Surge in liquidity pool trading fees detected.',
      },
      reasoningSnippet: 'Rebalancing routed under platform risk rules with automatic yield compounding.',
    };

    set({
      isSimulatingScan: false,
      portfolio: {
        ...state.portfolio,
        nav: newNav,
        investmentPnL: newInvestmentPnL,
        pnlSinceStart: newInvestmentPnL,
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
      const newPnl = calculateInvestmentPnL(targetNav, state.portfolio.netContributions);
      const newActivity: ActivityEvent = {
        id: `act-${Date.now()}`,
        type: 'MILESTONE',
        title: `Level ${state.goal.currentLevel} Milestone Complete (3x Target)`,
        description: `Autonomous portfolio reached target milestone of $${targetNav.toFixed(2)} USD!`,
        amount: targetNav,
        timestamp: 'Just now',
        status: 'Confirmed',
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
          investmentPnL: newPnl,
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

  advanceMilestone: () =>
    set((state) => {
      const advancedGoal = advanceToNextMilestone(state.goal, state.portfolio.nav);
      const newActivity: ActivityEvent = {
        id: `act-${Date.now()}`,
        type: 'MILESTONE',
        title: `Level ${advancedGoal.currentLevel} Milestone Started`,
        description: `Goal updated to $${advancedGoal.targetNav.toFixed(2)}. Your AI continues compounding toward this milestone.`,
        amount: advancedGoal.targetNav,
        timestamp: 'Just now',
        status: 'Confirmed',
      };

      return {
        portfolio: {
          ...state.portfolio,
          nextMilestone: advancedGoal.targetNav,
          milestoneProgress: advancedGoal.progress,
        },
        goal: advancedGoal,
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
