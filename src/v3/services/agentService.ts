import { create } from 'zustand';
import { AgentHomeData, ActivityEvent, SkillItem, DecisionTrace, OpportunityItem, Environment } from '../models/types';
import { INITIAL_MOCK_AGENT_HOME, MOCK_ACTIVITY_FEED, MOCK_OPPORTUNITIES, MOCK_SKILL_CATALOG } from '../mocks/fixtures';

interface AgentStateStore {
  data: AgentHomeData;
  activity: ActivityEvent[];
  opportunities: OpportunityItem[];
  skillsCatalog: SkillItem[];
  isWalletConnected: boolean;
  ownerAddress: string | null;
  agenticWalletAddress: string | null;
  isActivatedTestnet: boolean;
  
  // Actions
  claimAgent: (name: string, avatarKey?: string) => void;
  prepareActivation: () => Promise<{ environment: string; networkFeeEstimate: string; request: Record<string, unknown> }>;
  confirmActivation: (txHash: string) => Promise<void>;
  togglePause: () => void;
  learnSkill: (skillId: string) => void;
  unbindSkill: (skillId: string) => void;
  updateEnergyBudget: (dailyBudget: number, maxEnergyPerOp: number, autoSpendHighValue: boolean) => void;
  setEnvironment: (env: Environment) => void;
  executeOpportunitySimulation: (oppId: string) => Promise<DecisionTrace>;
  revokeOperator: () => void;
  connectOwnerWallet: (address: string) => void;
  disconnectOwnerWallet: () => void;
}

export const useAgentStore = create<AgentStateStore>((set, get) => ({
  data: INITIAL_MOCK_AGENT_HOME,
  activity: MOCK_ACTIVITY_FEED,
  opportunities: MOCK_OPPORTUNITIES,
  skillsCatalog: MOCK_SKILL_CATALOG,
  isWalletConnected: false,
  ownerAddress: null,
  agenticWalletAddress: null,
  isActivatedTestnet: false,

  claimAgent: (name: string, avatarKey?: string) => {
    set((state) => ({
      data: {
        ...state.data,
        agent: {
          ...state.data.agent,
          name: name.trim() || 'MOMO',
          avatarKey: avatarKey || 'default',
          state: 'WORKING',
          statusLabel: 'Working',
        },
      },
    }));
  },

  prepareActivation: async () => {
    return {
      environment: 'testnet',
      networkFeeEstimate: '0.045 TON (~$0.18)',
      request: {
        action: 'DEPLOY_AGENTIC_SUBWALLET',
        targetContract: 'kQCe8...91aZ',
        policy: 'OPERATOR_LIMITED_SUBWALLET',
        revocableByOwner: true,
      },
    };
  },

  confirmActivation: async (txHash: string) => {
    set((state) => ({
      isActivatedTestnet: true,
      data: {
        ...state.data,
        environment: 'testnet',
        agent: {
          ...state.data.agent,
          generation: 'GENESIS',
          level: '1X_PIONEER',
          today: {
            ...state.data.agent.today,
            asset: 'TESTNET_3X',
          },
        },
      },
      agenticWalletAddress: 'EQBvW8...K29f',
      activity: [
        {
          id: `act_${Date.now()}`,
          timestamp: 'Just now',
          type: 'SECURITY_ACTION',
          title: 'Agentic Wallet Activated on TON Testnet',
          summary: `Owner linked operator split-key. Tx: ${txHash.slice(0, 10)}... Network fee: 0.045 TON.`,
          environment: 'testnet',
          isSimulation: false,
        },
        ...state.activity,
      ],
    }));
  },

  togglePause: () => {
    const current = get().data.agent.state;
    const nextState = current === 'PAUSED' ? 'WORKING' : 'PAUSED';
    const nextLabel = nextState === 'PAUSED' ? 'Paused by Owner' : 'Working';
    set((state) => ({
      data: {
        ...state.data,
        agent: {
          ...state.data.agent,
          state: nextState,
          statusLabel: nextLabel,
        },
      },
      activity: [
        {
          id: `act_${Date.now()}`,
          timestamp: 'Just now',
          type: 'SECURITY_ACTION',
          title: nextState === 'PAUSED' ? 'Agent Paused by Owner' : 'Agent Resumed',
          summary: nextState === 'PAUSED' 
            ? 'Execution halted immediately. Zero compute or gas will be consumed.' 
            : 'Operational circuits reactivated.',
          environment: state.data.environment,
          isSimulation: state.data.environment === 'simulation',
        },
        ...state.activity,
      ],
    }));
  },

  learnSkill: (skillId: string) => {
    set((state) => {
      const skills = state.data.agent.skills.map((s) => (s.id === skillId ? { ...s, bound: true } : s));
      const found = state.skillsCatalog.find((s) => s.id === skillId);
      if (!skills.some((s) => s.id === skillId) && found) {
        skills.push({ ...found, bound: true });
      }

      return {
        data: {
          ...state.data,
          agent: {
            ...state.data.agent,
            skills,
          },
        },
        activity: [
          {
            id: `act_${Date.now()}`,
            timestamp: 'Just now',
            type: 'SKILL_BOUND',
            title: `Bound Skill Circuit: ${found?.name || skillId}`,
            summary: `Equipped ${found?.tier || 'COMMON'} circuit. Expanded semantic decision connectome.`,
            environment: state.data.environment,
            isSimulation: state.data.environment === 'simulation',
          },
          ...state.activity,
        ],
      };
    });
  },

  unbindSkill: (skillId: string) => {
    set((state) => ({
      data: {
        ...state.data,
        agent: {
          ...state.data.agent,
          skills: state.data.agent.skills.map((s) => (s.id === skillId ? { ...s, bound: false } : s)),
        },
      },
    }));
  },

  updateEnergyBudget: (dailyBudget: number, maxEnergyPerOp: number, autoSpendHighValue: boolean) => {
    set((state) => ({
      data: {
        ...state.data,
        agent: {
          ...state.data.agent,
          energy: {
            ...state.data.agent.energy,
            dailyBudget,
            maxEnergyPerOp,
            autoSpendHighValue,
          },
        },
      },
    }));
  },

  setEnvironment: (env: Environment) => {
    set((state) => ({
      data: {
        ...state.data,
        environment: env,
      },
    }));
  },

  executeOpportunitySimulation: async (oppId: string) => {
    const opp = get().opportunities.find((o) => o.id === oppId);
    const gross = opp ? opp.expectedGrossUsd : 2.0;
    const pSuccess = opp ? opp.probabilityOfSuccess : 0.9;
    const computeCost = opp ? opp.estimatedComputeCost : 0.2;
    const riskPenalty = opp ? opp.riskPenalty : 0.1;
    const net = Number((pSuccess * gross - computeCost - riskPenalty).toFixed(2));

    const newTrace: DecisionTrace = {
      id: `trace_${Date.now()}`,
      title: opp ? `Evaluating: ${opp.title}` : 'Evaluating Opportunity',
      opportunityId: oppId,
      expectedNetValueUsd: net,
      premiumEnergyBudget: computeCost * 2,
      actualEnergyUsed: computeCost,
      status: net > 0 ? 'COMPLETED' : 'REJECTED',
      createdAt: new Date().toISOString(),
      steps: [
        {
          id: 'step_1',
          seq: 1,
          node: 'Market Sense',
          circuitId: 'sys_sensory',
          state: 'completed',
          summary: `Identified candidate opportunity. Gross value: $${gross.toFixed(2)}`,
          energyCost: 0,
        },
        {
          id: 'step_2',
          seq: 2,
          node: 'Value Hunter',
          circuitId: 'crc_value_hunter_v1',
          state: 'completed',
          summary: `Calculated Expected Net Value: $${net.toFixed(2)}. ${net > 0 ? 'Formula approved premium route.' : 'Negative expected value. Denied premium compute.'}`,
          energyCost: computeCost * 0.5,
        },
        {
          id: 'step_3',
          seq: 3,
          node: 'Risk Guardian',
          circuitId: 'sys_risk_immutable',
          state: 'completed',
          summary: 'Verified immutable safety bounds, zero unauthorized exposure.',
          energyCost: 0,
        },
        {
          id: 'step_4',
          seq: 4,
          node: 'Execute',
          circuitId: 'sys_execution',
          state: net > 0 ? 'completed' : 'blocked',
          summary: net > 0 ? 'Executed successfully via verified adapter.' : 'Execution bypassed due to negative expected value.',
          energyCost: net > 0 ? computeCost * 0.5 : 0,
        },
        {
          id: 'step_5',
          seq: 5,
          node: 'Ledger Settlement',
          circuitId: 'sys_ledger',
          state: 'completed',
          summary: net > 0 ? `Credited +$${net} Qualified Earnings to ledger.` : 'Zero state mutation recorded.',
          energyCost: 0,
        },
      ],
    };

    set((state) => {
      const isSim = state.data.environment === 'simulation';
      const addedEarned = net > 0 ? Math.round(net * 10) : 0;
      return {
        data: {
          ...state.data,
          currentTrace: newTrace,
          agent: {
            ...state.data.agent,
            today: {
              ...state.data.agent.today,
              earned: state.data.agent.today.earned + addedEarned,
              net: state.data.agent.today.net + addedEarned,
            },
            energy: {
              ...state.data.agent.energy,
              usedToday: Number((state.data.agent.energy.usedToday + computeCost).toFixed(1)),
              premiumPct: Math.max(0, state.data.agent.energy.premiumPct - Math.round(computeCost * 2)),
            },
          },
        },
        activity: [
          {
            id: `act_${Date.now()}`,
            timestamp: 'Just now',
            type: net > 0 ? 'TASK_COMPLETED' : 'OPPORTUNITY_EVALUATED',
            title: opp ? opp.title : 'Evaluated Opportunity',
            summary: net > 0 
              ? `Executed opportunity with net return of $${net.toFixed(2)}.` 
              : 'Safely passed on negative expected value.',
            deltaMoney: net > 0 ? { amount: addedEarned, asset: isSim ? 'DEMO_3X' : 'TESTNET_3X' } : undefined,
            deltaEnergy: -computeCost,
            traceId: newTrace.id,
            environment: state.data.environment,
            isSimulation: isSim,
          },
          ...state.activity,
        ],
      };
    });

    return newTrace;
  },

  revokeOperator: () => {
    set((state) => ({
      agenticWalletAddress: null,
      isActivatedTestnet: false,
      data: {
        ...state.data,
        agent: {
          ...state.data.agent,
          state: 'PAUSED',
          statusLabel: 'Operator Revoked',
        },
      },
      activity: [
        {
          id: `act_${Date.now()}`,
          timestamp: 'Just now',
          type: 'SECURITY_ACTION',
          title: 'Operator Permissions Revoked',
          summary: 'Owner revoked the operator key on TON Testnet. Agent cannot sign or execute transactions.',
          environment: state.data.environment,
          isSimulation: state.data.environment === 'simulation',
        },
        ...state.activity,
      ],
    }));
  },

  connectOwnerWallet: (address: string) => {
    set({
      isWalletConnected: true,
      ownerAddress: address,
    });
  },

  disconnectOwnerWallet: () => {
    set({
      isWalletConnected: false,
      ownerAddress: null,
    });
  },
}));
