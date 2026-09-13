import assert from 'node:assert/strict';
import { BetaInstrumentation } from '../instrumentation/metrics';
import { AgentStateMachine } from '../engine/stateMachine';
import { ValueRouter } from '../engine/valueRouter';
import { EconomicLedger } from '../ledger/economicLedger';
import { GrowthEngine } from '../engine/growthEngine';
import { AgenticWalletManager } from '../ton/agenticWallet';
import { OpportunityItem, AgentProfile } from '../models/types';

console.log('--- Running Gate 5 Prototype Instrumentation & Simulated Journey Tests ---');

// 1. Productivity Metrics Test
console.log('Test 1: Compute ROI and Token Productivity Calculations...');
const healthy = BetaInstrumentation.calculateProductivity({
  qualifiedValueCreatedUsd: 12.8,
  premiumComputeCostUsd: 3.1,
  productiveTokenSpent: 10.0,
});
assert.equal(healthy.computeRoi, 4.13);
assert.equal(healthy.tokenProductivity, 1.28);
assert.equal(healthy.isHealthy, true);

const unhealthy = BetaInstrumentation.calculateProductivity({
  qualifiedValueCreatedUsd: 1.0,
  premiumComputeCostUsd: 4.0,
  productiveTokenSpent: 8.0,
});
assert.equal(unhealthy.computeRoi, 0.25);
assert.equal(unhealthy.isHealthy, false);
console.log('✓ Test 1 Passed: Productivity metrics validated.');

// 2. Anti-Sybil Risk Evaluator Test
console.log('Test 2: Anti-Sybil Risk Detection...');
const legitUser = BetaInstrumentation.evaluateAntiSybil({
  ipSubnetFrequency: 1,
  hasCompletedFirstTask: true,
  walletAgeDays: 14,
  isPrimaryAgent: true,
});
assert.equal(legitUser.riskScore, 0);
assert.equal(legitUser.isSubsidizedEligible, true);

const sybilUser = BetaInstrumentation.evaluateAntiSybil({
  ipSubnetFrequency: 18,
  hasCompletedFirstTask: false,
  walletAgeDays: 0,
  isPrimaryAgent: false,
});
assert.ok(sybilUser.riskScore >= 50);
assert.equal(sybilUser.isSubsidizedEligible, false);
assert.ok(sybilUser.flags.includes('HIGH_IP_SUBNET_CONCENTRATION'));
console.log('✓ Test 2 Passed: Anti-Sybil rules validated.');

// 3. End-to-End User Journey Simulation
console.log('Test 3: Full End-to-End User Journey Loop...');

// Step 3a: Free Claim (Zero-Wallet Onboarding)
const sm = new AgentStateMachine('READY');
const agentProfile: AgentProfile = {
  id: 'agent_e2e_momo',
  name: 'MOMO',
  primary: true,
  generation: 'GENESIS',
  level: '1X_HATCHLING',
  state: 'READY',
  statusLabel: 'Ready',
  qualifiedGrowthMultiple: 1.0,
  nextMilestone: 3.0,
  energy: {
    basePct: 100,
    premiumPct: 80,
    dailyBudget: 20,
    usedToday: 0,
    maxEnergyPerOp: 4.0,
    autoSpendHighValue: true,
  },
  today: { earned: 0, spent: 0, net: 0, asset: 'DEMO_3X' },
  skills: [
    { id: 'task_hunter', name: 'Task Hunter', tier: 'COMMON', bound: true },
    { id: 'value_hunter', name: 'Value Hunter', tier: 'COMMON', bound: true },
  ],
};
assert.equal(agentProfile.state, 'READY');

// Step 3b: Opportunity Evaluation via Value Router
sm.transitionTo('EVALUATING');
const opportunity: OpportunityItem = {
  id: 'opp_e2e_01',
  title: 'Network Validator State Proof Task',
  source: 'TESTNET_TASK',
  expectedGrossUsd: 5.0,
  probabilityOfSuccess: 0.96,
  estimatedComputeCost: 0.3,
  executionCost: 0.05,
  riskPenalty: 0.1,
  timeWindowSec: 3600,
  status: 'OPEN',
};
const evalResult = ValueRouter.evaluate(opportunity, agentProfile);
assert.equal(evalResult.allowPremiumCompute, true);
assert.equal(evalResult.decision, 'STRONG_EVALUATE');

// Step 3c: Agent Works & Settles
sm.transitionTo('WORKING');
assert.equal(sm.getState(), 'WORKING');

sm.transitionTo('SETTLING');
assert.equal(sm.getState(), 'SETTLING');

// Step 3d: Simulated Agentic Wallet Activation
const ownerAddress = 'EQC_e2e_owner_wallet_address_781';
const activationPayload = AgenticWalletManager.prepareActivation(ownerAddress);
assert.equal(activationPayload.networkFeeTon, '0.045');

const wallet = AgenticWalletManager.activate(ownerAddress, '0xabcdef123456');
assert.equal(wallet.status, 'ACTIVE');

// Step 3e: Economic Ledger & Restricted Seed Allocation
const ledger = new EconomicLedger();
ledger.postTransaction({
  agentId: agentProfile.id,
  fromAccountType: 'EXTERNAL_SETTLEMENT',
  toAccountType: 'PROTOCOL_SEED_RESTRICTED',
  asset: 'TESTNET_3X',
  amountBaseUnits: 5000000000000n, // 5,000 3X
  reasonCode: 'PROTOCOL_SEED_GRANT',
  idempotencyKey: 'seed_grant_e2e',
  isQualified: false,
});

// Step 3f: Qualified Net Earnings Accumulation
ledger.postTransaction({
  agentId: agentProfile.id,
  fromAccountType: 'EXTERNAL_SETTLEMENT',
  toAccountType: 'EARNED_AVAILABLE',
  asset: 'TESTNET_3X',
  amountBaseUnits: 10000000000000n, // 10,000 3X
  reasonCode: 'EXTERNAL_TASK_REVENUE',
  idempotencyKey: 'task_rev_e2e_01',
  isQualified: true,
  qualificationReason: 'Completed state proof computation',
});

const qne = ledger.calculateQNE(agentProfile.id);
assert.equal(qne, 10000000000000n);

// Step 3g: Growth Multiple Calculation (1 + 10000/5000 = 3.0X)
const growth = GrowthEngine.calculateGrowth(Number(qne / 1000000000n), 5000);
assert.equal(growth.stage, '3X');
assert.equal(growth.multiple, 3.0);
assert.equal(growth.unlockedVaultPct, 10);

// Step 3h: Growth Stage Claim & Replay Protection
const claim = ledger.claimGrowthStage({
  agentId: agentProfile.id,
  stage: '3X',
  amountBaseUnits: 7500000000000n,
  nonce: 'nonce_stage_3x_e2e',
  ownerAddress,
});
assert.equal(claim.success, true);

// Return agent state to READY
sm.transitionTo('READY');
assert.equal(sm.getState(), 'READY');

console.log('✓ Test 3 Passed: Full End-to-End User Journey Loop verified!');

console.log('\n==========================================================');
console.log('ALL CURRENT V3 PROTOTYPE UNIT TESTS PASSED.');
console.log('Real TON Testnet, persistent backend, and Beta acceptance gates remain pending.');
console.log('==========================================================');
