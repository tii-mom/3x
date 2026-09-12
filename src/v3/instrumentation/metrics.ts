export interface ProductivityMetrics {
  computeRoi: number; // Qualified Value Created / Premium Compute Cost
  tokenProductivity: number; // Qualified Value Created / Productive 3X Spent
  isHealthy: boolean;
}

export interface FunnelStats {
  claimedCount: number;
  firstWorkCompletedCount: number;
  testnetActivatedCount: number;
  growthUnlockedCount: number;
}

export interface AntiSybilSignal {
  riskScore: number; // 0 (clean) to 100 (high risk sybil)
  flags: string[];
  isSubsidizedEligible: boolean;
}

export class BetaInstrumentation {
  /**
   * Calculate Compute ROI and Token Productivity.
   * Target: Compute ROI > 1.2x, Token Productivity > 1.0x.
   */
  public static calculateProductivity(params: {
    qualifiedValueCreatedUsd: number;
    premiumComputeCostUsd: number;
    productiveTokenSpent: number;
  }): ProductivityMetrics {
    const computeCost = Math.max(0.01, params.premiumComputeCostUsd);
    const tokenSpent = Math.max(0.01, params.productiveTokenSpent);

    const computeRoi = Number((params.qualifiedValueCreatedUsd / computeCost).toFixed(2));
    const tokenProductivity = Number((params.qualifiedValueCreatedUsd / tokenSpent).toFixed(2));

    return {
      computeRoi,
      tokenProductivity,
      isHealthy: computeRoi >= 1.0 && tokenProductivity >= 0.8,
    };
  }

  /**
   * Evaluate anti-sybil signals before releasing primary subsidy.
   */
  public static evaluateAntiSybil(params: {
    ipSubnetFrequency: number;
    hasCompletedFirstTask: boolean;
    walletAgeDays: number;
    isPrimaryAgent: boolean;
  }): AntiSybilSignal {
    const flags: string[] = [];
    let riskScore = 0;

    if (!params.isPrimaryAgent) {
      flags.push('NON_PRIMARY_AGENT_EXCLUDED');
      riskScore += 50;
    }

    if (params.ipSubnetFrequency > 5) {
      flags.push('HIGH_IP_SUBNET_CONCENTRATION');
      riskScore += 40;
    }

    if (!params.hasCompletedFirstTask) {
      flags.push('ZERO_PROVED_ACTIVITY');
      riskScore += 25;
    }

    if (params.walletAgeDays < 1) {
      flags.push('FRESH_TESTNET_WALLET');
      riskScore += 15;
    }

    const isSubsidizedEligible = riskScore < 50;

    return {
      riskScore,
      flags,
      isSubsidizedEligible,
    };
  }
}
