export type AccountType =
  | 'PROTOCOL_SEED_RESTRICTED'
  | 'OPERATING_AVAILABLE'
  | 'EARNED_AVAILABLE'
  | 'GROWTH_REWARD'
  | 'ENERGY_BASE'
  | 'ENERGY_PREMIUM'
  | 'EXTERNAL_SETTLEMENT';

export interface EconomicAccount {
  id: string;
  agentId: string;
  accountType: AccountType;
  asset: string;
  balanceBaseUnits: bigint;
}

export interface LedgerEntry {
  id: string;
  eventId: string;
  debitAccountId: string;
  creditAccountId: string;
  asset: string;
  amountBaseUnits: bigint;
  reasonCode: string;
  timestamp: string;
}

export interface EconomicEvent {
  id: string;
  agentId: string;
  eventType: string;
  reasonCode: string;
  qualified: boolean;
  qualificationReason?: string;
  externalValueUsd?: number;
  idempotencyKey: string;
  createdAt: string;
}

export const ALLOWED_SEED_SPEND_REASONS = new Set([
  'PREMIUM_ENERGY_PURCHASE',
  'TASK_OPERATION_COST',
  'APPROVED_ADAPTER_GAS',
  'COMPUTE_ALLOCATION',
]);

export class EconomicLedger {
  private accounts: Map<string, EconomicAccount> = new Map();
  private entries: LedgerEntry[] = [];
  private processedEvents: Map<string, EconomicEvent> = new Map();
  private claimedStages: Set<string> = new Set(); // agentId:stage for replay protection

  public getOrCreateAccount(agentId: string, accountType: AccountType, asset: string): EconomicAccount {
    const key = `${agentId}:${accountType}:${asset}`;
    if (!this.accounts.has(key)) {
      this.accounts.set(key, {
        id: key,
        agentId,
        accountType,
        asset,
        balanceBaseUnits: 0n,
      });
    }
    return this.accounts.get(key)!;
  }

  public getAccountBalance(agentId: string, accountType: AccountType, asset: string): bigint {
    return this.getOrCreateAccount(agentId, accountType, asset).balanceBaseUnits;
  }

  /**
   * Post a double-entry transaction.
   * INVARIANT 1: Double-entry debit = credit.
   * INVARIANT 2: Seed cannot withdraw to owner.
   * INVARIANT 3: Idempotency enforced.
   */
  public postTransaction(params: {
    agentId: string;
    fromAccountType: AccountType;
    toAccountType: AccountType;
    asset: string;
    amountBaseUnits: bigint;
    reasonCode: string;
    idempotencyKey: string;
    isQualified?: boolean;
    qualificationReason?: string;
    externalValueUsd?: number;
  }): { event: EconomicEvent; entry: LedgerEntry } {
    // Idempotency check
    if (this.processedEvents.has(params.idempotencyKey)) {
      const existingEvent = this.processedEvents.get(params.idempotencyKey)!;
      const existingEntry = this.entries.find((e) => e.eventId === existingEvent.id)!;
      return { event: existingEvent, entry: existingEntry };
    }

    if (params.amountBaseUnits <= 0n) {
      throw new Error('Transaction amount must be strictly positive');
    }

    // INVARIANT: Restricted Protocol Seed cannot be transferred directly to owner or external withdrawal!
    if (params.fromAccountType === 'PROTOCOL_SEED_RESTRICTED') {
      if (params.toAccountType === 'EARNED_AVAILABLE' || params.toAccountType === 'EXTERNAL_SETTLEMENT') {
        throw new Error(
          'SECURITY VIOLATION: Protocol Seed is restricted operating capital. Direct withdrawal to owner or earned balance is prohibited.'
        );
      }

      if (!ALLOWED_SEED_SPEND_REASONS.has(params.reasonCode)) {
        throw new Error(
          `SECURITY VIOLATION: Reason code "${params.reasonCode}" is not in the allowlist for Protocol Seed expenditure.`
        );
      }
    }

    const fromAccount = this.getOrCreateAccount(params.agentId, params.fromAccountType, params.asset);
    const toAccount = this.getOrCreateAccount(params.agentId, params.toAccountType, params.asset);

    // Balance sufficiency check
    if (fromAccount.accountType !== 'EXTERNAL_SETTLEMENT' && fromAccount.balanceBaseUnits < params.amountBaseUnits) {
      throw new Error(
        `Insufficient balance in ${fromAccount.accountType}: requested ${params.amountBaseUnits}, available ${fromAccount.balanceBaseUnits}`
      );
    }

    // Double-entry state updates
    fromAccount.balanceBaseUnits -= params.amountBaseUnits;
    toAccount.balanceBaseUnits += params.amountBaseUnits;

    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const event: EconomicEvent = {
      id: eventId,
      agentId: params.agentId,
      eventType: 'LEDGER_SETTLEMENT',
      reasonCode: params.reasonCode,
      qualified: params.isQualified ?? false,
      qualificationReason: params.qualificationReason,
      externalValueUsd: params.externalValueUsd,
      idempotencyKey: params.idempotencyKey,
      createdAt: new Date().toISOString(),
    };

    const entry: LedgerEntry = {
      id: `entry_${Date.now()}_${this.entries.length + 1}`,
      eventId,
      debitAccountId: toAccount.id,
      creditAccountId: fromAccount.id,
      asset: params.asset,
      amountBaseUnits: params.amountBaseUnits,
      reasonCode: params.reasonCode,
      timestamp: event.createdAt,
    };

    this.processedEvents.set(params.idempotencyKey, event);
    this.entries.push(entry);

    return { event, entry };
  }

  /**
   * Calculate cumulative Qualified Net Earnings (QNE).
   * INVARIANT: Excludes deposits, seed allotments, growth rewards, and token price appreciation.
   */
  public calculateQNE(agentId: string): bigint {
    let qne = 0n;

    for (const entry of this.entries) {
      const event = Array.from(this.processedEvents.values()).find((e) => e.id === entry.eventId);
      if (!event || event.agentId !== agentId) continue;

      // Only include transactions flagged as Qualified from external productive output
      if (event.qualified) {
        if (entry.reasonCode === 'EXTERNAL_TASK_REVENUE' || entry.reasonCode === 'SERVICE_FEE_EARNED') {
          qne += entry.amountBaseUnits;
        } else if (entry.reasonCode === 'TASK_OPERATION_COST') {
          qne -= entry.amountBaseUnits;
        }
      }
    }

    return qne > 0n ? qne : 0n;
  }

  /**
   * Claim a Growth stage reward with nonce and replay protection.
   */
  public claimGrowthStage(params: {
    agentId: string;
    stage: string;
    amountBaseUnits: bigint;
    nonce: string;
    ownerAddress: string;
  }): { success: boolean; txNonce: string } {
    const claimKey = `${params.agentId}:${params.stage}`;
    if (this.claimedStages.has(claimKey)) {
      throw new Error(`REPLAY ERROR: Stage ${params.stage} has already been claimed for agent ${params.agentId}.`);
    }

    // Post to ledger: from GROWTH_REWARD pool to EARNED_AVAILABLE
    this.postTransaction({
      agentId: params.agentId,
      fromAccountType: 'EXTERNAL_SETTLEMENT',
      toAccountType: 'EARNED_AVAILABLE',
      asset: 'TESTNET_3X',
      amountBaseUnits: params.amountBaseUnits,
      reasonCode: `GROWTH_STAGE_UNLOCK_${params.stage}`,
      idempotencyKey: `claim_${claimKey}_${params.nonce}`,
      isQualified: false, // INVARIANT: Growth reward does not count as future QNE!
      qualificationReason: 'Growth reward entitlement release',
    });

    this.claimedStages.add(claimKey);
    return { success: true, txNonce: params.nonce };
  }
}
