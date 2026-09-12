import { OpportunityItem, AgentProfile, AgentEnergy } from '../models/types';

export type ValueRouterDecisionType = 'PASS' | 'CHEAP_EVALUATE' | 'STRONG_EVALUATE' | 'DENY';

export interface ValueRouterEvaluation {
  decision: ValueRouterDecisionType;
  expectedNetValueUsd: number;
  allowPremiumCompute: boolean;
  allocatedEnergy: number;
  reason: string;
  computeRoi: number;
}

export class ValueRouter {
  public static evaluate(
    opportunity: OpportunityItem,
    agent: AgentProfile,
    energyBudget?: Partial<AgentEnergy>
  ): ValueRouterEvaluation {
    const pSuccess = Math.max(0, Math.min(1, opportunity.probabilityOfSuccess));
    const gross = Math.max(0, opportunity.expectedGrossUsd);
    const computeCost = Math.max(0, opportunity.estimatedComputeCost);
    const execCost = Math.max(0, opportunity.executionCost);
    const riskPenalty = Math.max(0, opportunity.riskPenalty);
    const oppCost = 0.05; // Base opportunity cost

    // Immutable Risk Pre-check: high risk penalties reject immediately
    if (riskPenalty > 5.0) {
      return {
        decision: 'DENY',
        expectedNetValueUsd: 0,
        allowPremiumCompute: false,
        allocatedEnergy: 0,
        reason: 'Risk penalty exceeds safety threshold ($5.00 limit). Immutable Risk Gate DENIED execution.',
        computeRoi: 0,
      };
    }

    // Core Expected Net Value calculation
    const expectedGross = pSuccess * gross;
    const totalCosts = computeCost + execCost + riskPenalty + oppCost;
    const expectedNetValue = Number((expectedGross - totalCosts).toFixed(2));

    // INVARIANT 1: No Value, No Premium Compute
    // If ExpectedNetValue <= 0, decision is PASS and Premium compute is strictly FORBIDDEN.
    if (expectedNetValue <= 0) {
      return {
        decision: 'PASS',
        expectedNetValueUsd: expectedNetValue,
        allowPremiumCompute: false,
        allocatedEnergy: 0,
        reason: `Expected net value ($${expectedNetValue.toFixed(2)}) is non-positive. Premium compute strictly prohibited.`,
        computeRoi: 0,
      };
    }

    // Check Energy Budgets
    const currentEnergy = agent.energy;
    const maxPerOp = energyBudget?.maxEnergyPerOp ?? currentEnergy.maxEnergyPerOp ?? 4.0;
    const dailyRemaining = Math.max(
      0,
      (energyBudget?.dailyBudget ?? currentEnergy.dailyBudget) - currentEnergy.usedToday
    );

    // If budget exhausted
    if (dailyRemaining < 0.2) {
      return {
        decision: 'PASS',
        expectedNetValueUsd: expectedNetValue,
        allowPremiumCompute: false,
        allocatedEnergy: 0,
        reason: 'Daily premium energy budget exhausted. Operation passed to preserve resources.',
        computeRoi: 0,
      };
    }

    // Compute energy allocation bounded by max per op and remaining daily budget
    const targetEnergy = Math.min(computeCost * 2, maxPerOp, dailyRemaining);

    // Compute ROI metric
    const computeRoi = targetEnergy > 0 ? Number((expectedNetValue / targetEnergy).toFixed(2)) : 0;

    // Route selection: high value requires strong reasoning, low value uses cheap route
    const decision: ValueRouterDecisionType =
      expectedNetValue >= 1.5 ? 'STRONG_EVALUATE' : 'CHEAP_EVALUATE';

    return {
      decision,
      expectedNetValueUsd: expectedNetValue,
      allowPremiumCompute: true,
      allocatedEnergy: Number(targetEnergy.toFixed(2)),
      reason: `Approved ${decision} route. Positive expected net value ($${expectedNetValue.toFixed(2)}).`,
      computeRoi,
    };
  }
}
