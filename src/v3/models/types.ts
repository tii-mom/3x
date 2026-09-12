// 3X V3.1 Living Agent — Domain Types & Schemas
// Source of truth: schemas/openapi.yaml, schemas/db_schema.sql, schemas/event_catalog.yaml

export type Environment = 'simulation' | 'testnet' | 'mainnet';

export type AgentState = 
  | 'READY' 
  | 'EVALUATING' 
  | 'WORKING' 
  | 'SETTLING' 
  | 'PAUSED' 
  | 'EVOLVING';

export type GrowthStage = '1X' | '3X' | '9X' | '27X' | '81X' | '243X' | '729X_PRESTIGE';

export type Generation = 'GENESIS' | 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6' | 'G7' | 'MATURE';

export type SkillTier = 'COMMON' | 'ADVANCED' | 'LEGENDARY';

export type NodeState = 'sleeping' | 'active' | 'blocked' | 'completed' | 'protected';

export interface AgentEnergy {
  basePct: number;        // 0 - 100%
  premiumPct: number;     // 0 - 100%
  dailyBudget: number;    // In energy units
  usedToday: number;      // In energy units
  maxEnergyPerOp?: number;
  autoSpendHighValue?: boolean;
}

export interface TodayEarnings {
  earned: number;
  spent: number;
  net: number;
  asset: string;
}

export interface SkillItem {
  id: string;
  name: string;
  tier: SkillTier;
  bound: boolean;
  description?: string;
  circuitId?: string;
  energyCostEst?: number;
  unlockedAt?: string;
}

export interface TraceStep {
  id: string;
  seq?: number;
  node: string;
  circuitId?: string;
  state: NodeState;
  summary: string;
  energyCost?: number;
  startedAt?: string;
  endedAt?: string;
  resultCode?: string;
  details?: Record<string, unknown>;
}

export interface DecisionTrace {
  id: string;
  title: string;
  opportunityId?: string;
  expectedNetValueUsd?: number;
  premiumEnergyBudget?: number;
  actualEnergyUsed?: number;
  status?: 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'FAILED';
  createdAt?: string;
  steps: TraceStep[];
}

export interface AgentProfile {
  id: string;
  name: string;
  avatarKey?: string;
  primary: boolean;
  generation: Generation;
  level: string;
  state: AgentState;
  statusLabel: string;
  qualifiedGrowthMultiple: number;
  nextMilestone: number;
  energy: AgentEnergy;
  today: TodayEarnings;
  skills: SkillItem[];
  reputation?: number;
  createdAt?: string;
}

export interface AgentHomeData {
  environment: Environment;
  agent: AgentProfile;
  currentTrace?: DecisionTrace;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'TASK_COMPLETED' | 'OPPORTUNITY_EVALUATED' | 'ENERGY_CONSUMED' | 'SKILL_BOUND' | 'GROWTH_MILESTONE' | 'SECURITY_ACTION';
  title: string;
  summary: string;
  deltaMoney?: {
    amount: number;
    asset: string;
  };
  deltaEnergy?: number;
  traceId?: string;
  environment: Environment;
  isSimulation: boolean;
}

export interface OpportunityItem {
  id: string;
  title: string;
  source: 'TESTNET_TASK' | 'SERVICE_ROUTER' | 'MARKET_MAKING' | 'DATA_SYNTHESIS';
  expectedGrossUsd: number;
  probabilityOfSuccess: number;
  estimatedComputeCost: number;
  executionCost: number;
  riskPenalty: number;
  timeWindowSec: number;
  status: 'OPEN' | 'IN_REVIEW' | 'COMPLETED' | 'EXPIRED';
}

export interface FeatureFlags {
  V3_PRODUCT_UI: boolean;
  TON_TESTNET_ACTIVATION: boolean;
  PREMIUM_ENERGY_PURCHASE: boolean;
  GROWTH_CLAIM_TESTNET: boolean;
  EXTERNAL_TASKS: boolean;
  ADVANCED_SKILLS: boolean;
  MULTI_AI: boolean;
  MALECNS_LABS: boolean;
  MAINNET_EXECUTION: boolean;
  PAID_RANDOM_CAPSULE: boolean;
}
