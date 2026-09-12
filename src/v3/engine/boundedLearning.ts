export interface LearningUpdatePayload {
  parameterKey: string;
  previousValue: number | string;
  newValue: number | string;
  reason: string;
  evidenceWindowHours: number;
}

export const FORBIDDEN_LEARNING_KEYS = new Set([
  'risk_limit',
  'max_drawdown',
  'contract_allowlist',
  'signer_policy',
  'asset_verification',
  'withdrawal_rule',
  'operator_key',
  'risk_guardian',
]);

export class BoundedLearningEngine {
  private activeParameters: Map<string, number | string> = new Map([
    ['routing_weight_arbitrage', 0.5],
    ['routing_weight_data_tasks', 0.8],
    ['confidence_threshold', 0.75],
    ['memory_retrieval_priority', 1],
  ]);

  public applyUpdate(update: LearningUpdatePayload): void {
    const normalizedKey = update.parameterKey.toLowerCase();

    // INVARIANT: Risk Engine and Security Policies are strictly IMMUTABLE against AI learning
    for (const forbidden of FORBIDDEN_LEARNING_KEYS) {
      if (normalizedKey.includes(forbidden)) {
        throw new Error(
          `SECURITY VIOLATION: Bounded learning update rejected for forbidden parameter "${update.parameterKey}". Risk Engine and security policies are immutable.`
        );
      }
    }

    this.activeParameters.set(update.parameterKey, update.newValue);
  }

  public getParameter(key: string): number | string | undefined {
    return this.activeParameters.get(key);
  }
}
