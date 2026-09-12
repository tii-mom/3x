import assert from 'node:assert/strict';
import { AgentStateMachine } from '../engine/stateMachine';
import { ValueRouter } from '../engine/valueRouter';
import { SkillCircuitManager, SYSTEM_SKILL_RISK_GUARDIAN } from '../engine/skillCircuit';
import { BoundedLearningEngine } from '../engine/boundedLearning';
import { GrowthEngine } from '../engine/growthEngine';
import { OpportunityItem, AgentProfile } from '../models/types';

const mockAgent: AgentProfile = {
  id: 'test_agent',
  name: 'TEST_MOMO',
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
    usedToday: 2.0,
    maxEnergyPerOp: 4.0,
    autoSpendHighValue: true,
  },
  today: { earned: 0, spent: 0, net: 0, asset: 'DEMO_3X' },
  skills: [],
};

console.log('--- Running Gate 2 Unit Tests ---');

// 1. Agent State Machine Tests
console.log('Test 1: Agent State Machine transitions...');
const sm = new AgentStateMachine('READY');
assert.equal(sm.getState(), 'READY');
assert.equal(sm.transitionTo('EVALUATING'), 'EVALUATING');
assert.equal(sm.transitionTo('WORKING'), 'WORKING');
assert.equal(sm.transitionTo('SETTLING'), 'SETTLING');
assert.equal(sm.transitionTo('READY'), 'READY');
assert.equal(sm.transitionTo('PAUSED'), 'PAUSED');
assert.equal(sm.transitionTo('READY'), 'READY');

// Invalid transition check: READY -> WORKING directly should fail
assert.throws(() => {
  sm.transitionTo('WORKING');
}, /Invalid agent state transition/);

console.log('✓ Test 1 Passed: Agent State Machine validated.');

// 2. Value Router Tests (Invariants)
console.log('Test 2: Value Router Invariants...');

// Test 2a: Positive opportunity
const goodOpp: OpportunityItem = {
  id: 'opp_good',
  title: 'Profitable Task',
  source: 'TESTNET_TASK',
  expectedGrossUsd: 3.0,
  probabilityOfSuccess: 0.95,
  estimatedComputeCost: 0.2,
  executionCost: 0.05,
  riskPenalty: 0.1,
  timeWindowSec: 1800,
  status: 'OPEN',
};
const evalGood = ValueRouter.evaluate(goodOpp, mockAgent);
assert.equal(evalGood.allowPremiumCompute, true);
assert.equal(evalGood.decision, 'STRONG_EVALUATE');
assert.ok(evalGood.expectedNetValueUsd > 0);
assert.ok(evalGood.allocatedEnergy > 0);

// Test 2b: Negative opportunity (No Value, No Premium Compute)
const badOpp: OpportunityItem = {
  id: 'opp_bad',
  title: 'Unprofitable Opportunity',
  source: 'MARKET_MAKING',
  expectedGrossUsd: 0.5,
  probabilityOfSuccess: 0.4,
  estimatedComputeCost: 0.5,
  executionCost: 0.2,
  riskPenalty: 0.5,
  timeWindowSec: 600,
  status: 'OPEN',
};
const evalBad = ValueRouter.evaluate(badOpp, mockAgent);
assert.equal(evalBad.decision, 'PASS');
assert.equal(evalBad.allowPremiumCompute, false);
assert.equal(evalBad.allocatedEnergy, 0);

// Test 2c: High Risk Opportunity (DENY)
const riskyOpp: OpportunityItem = {
  id: 'opp_risky',
  title: 'Dangerous Exploit Candidate',
  source: 'MARKET_MAKING',
  expectedGrossUsd: 50.0,
  probabilityOfSuccess: 0.99,
  estimatedComputeCost: 0.1,
  executionCost: 0.1,
  riskPenalty: 12.0, // > $5 limit
  timeWindowSec: 60,
  status: 'OPEN',
};
const evalRisky = ValueRouter.evaluate(riskyOpp, mockAgent);
assert.equal(evalRisky.decision, 'DENY');
assert.equal(evalRisky.allowPremiumCompute, false);

console.log('✓ Test 2 Passed: Value Router invariants validated.');

// 3. Skill Circuit Manager & Risk Guardian Invariance
console.log('Test 3: Skill Circuit Manager & Risk Guardian Invariance...');
const skillMgr = new SkillCircuitManager();
assert.ok(skillMgr.isSkillBound(SYSTEM_SKILL_RISK_GUARDIAN.skillId));

// Attempt to unbind Risk Guardian must fail
assert.throws(() => {
  skillMgr.unbindSkill(SYSTEM_SKILL_RISK_GUARDIAN.skillId);
}, /Risk Guardian is an immutable system capability/);

console.log('✓ Test 3 Passed: Risk Guardian invariance validated.');

// 4. Bounded Learning Invariance
console.log('Test 4: Bounded Learning Engine...');
const learning = new BoundedLearningEngine();

// Safe update
learning.applyUpdate({
  parameterKey: 'routing_weight_arbitrage',
  previousValue: 0.5,
  newValue: 0.7,
  reason: 'Positive task attribution',
  evidenceWindowHours: 24,
});
assert.equal(learning.getParameter('routing_weight_arbitrage'), 0.7);

// Forbidden Risk Policy modification must be rejected
assert.throws(() => {
  learning.applyUpdate({
    parameterKey: 'max_drawdown_risk_limit',
    previousValue: 0.05,
    newValue: 0.20,
    reason: 'Trying to increase risk limit',
    evidenceWindowHours: 1,
  });
}, /SECURITY VIOLATION/);

console.log('✓ Test 4 Passed: Bounded learning security boundaries validated.');

// 5. Growth Engine Milestone Progression
console.log('Test 5: Growth Engine Milestones...');
const growth1 = GrowthEngine.calculateGrowth(0, 5000);
assert.equal(growth1.stage, '1X');
assert.equal(growth1.multiple, 1.0);

const growth2 = GrowthEngine.calculateGrowth(10000, 5000); // 1 + 10000/5000 = 3.0X
assert.equal(growth2.stage, '3X');
assert.equal(growth2.multiple, 3.0);
assert.equal(growth2.unlockedVaultPct, 10);

console.log('✓ Test 5 Passed: Growth Engine milestone formulas validated.');

console.log('\nALL GATE 2 UNIT TESTS PASSED SUCCESSFULLY! 🎉');
