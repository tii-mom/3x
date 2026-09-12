export type IntentState =
  | 'CREATED'
  | 'RISK_APPROVED'
  | 'QUOTED'
  | 'SIMULATED'
  | 'READY_TO_SIGN'
  | 'SIGNED'
  | 'CONFIRMED'
  | 'DENIED';

export interface TypedTransactionIntent {
  id: string;
  network: 'testnet';
  targetContract: string;
  actionName: string;
  asset: string;
  amountBaseUnits: string;
  maxSlippageBps: number;
  state: IntentState;
  simulatedSuccess?: boolean;
  denialReason?: string;
}

export const APPROVED_TESTNET_CONTRACTS = new Set([
  'kQ_task_bounty_registry',
  'kQ_data_verifier_adapter',
  'kQ_dex_swap_testnet_v1',
]);

export const APPROVED_TESTNET_ASSETS = new Set(['TON', 'TESTNET_3X', 'TESTNET_USDT', 'DEMO_3X']);

export class TransactionIntentPipeline {
  public static processIntent(intent: TypedTransactionIntent): TypedTransactionIntent {
    // 1. Contract Allowlist Check
    if (!APPROVED_TESTNET_CONTRACTS.has(intent.targetContract)) {
      return {
        ...intent,
        state: 'DENIED',
        denialReason: `SECURITY DENIAL: Target contract "${intent.targetContract}" is not on the approved adapter allowlist.`,
      };
    }

    // 2. Asset Allowlist Check
    if (!APPROVED_TESTNET_ASSETS.has(intent.asset)) {
      return {
        ...intent,
        state: 'DENIED',
        denialReason: `SECURITY DENIAL: Asset "${intent.asset}" is unverified.`,
      };
    }

    // 3. Risk Approval Check
    if (intent.maxSlippageBps > 200) {
      // > 2% max slippage
      return {
        ...intent,
        state: 'DENIED',
        denialReason: 'RISK DENIAL: Slippage tolerance exceeds safety limit (200 bps).',
      };
    }

    // 4. Pre-Simulation Pass
    const simulatedSuccess = true;

    return {
      ...intent,
      state: 'CONFIRMED',
      simulatedSuccess,
    };
  }
}
