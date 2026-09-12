import assert from 'node:assert/strict';
import { EconomicLedger } from '../ledger/economicLedger';

console.log('--- Running Gate 4 Unit Tests ---');

const ledger = new EconomicLedger();
const agentId = 'agent_test_401';
const asset = 'TESTNET_3X';

// 1. Double Entry Balance Consistency
console.log('Test 1: Double-Entry Balance Consistency...');
// Grant initial seed: from external settlement to PROTOCOL_SEED_RESTRICTED
ledger.postTransaction({
  agentId,
  fromAccountType: 'EXTERNAL_SETTLEMENT',
  toAccountType: 'PROTOCOL_SEED_RESTRICTED',
  asset,
  amountBaseUnits: 5000000000000n, // 5,000 3X
  reasonCode: 'PROTOCOL_SEED_GRANT',
  idempotencyKey: 'tx_seed_001',
  isQualified: false,
});

assert.equal(
  ledger.getAccountBalance(agentId, 'PROTOCOL_SEED_RESTRICTED', asset),
  5000000000000n
);
console.log('✓ Test 1 Passed: Double-entry grant posted.');

// 2. Idempotency Enforcement
console.log('Test 2: Idempotency Enforcement...');
const repeatTx = ledger.postTransaction({
  agentId,
  fromAccountType: 'EXTERNAL_SETTLEMENT',
  toAccountType: 'PROTOCOL_SEED_RESTRICTED',
  asset,
  amountBaseUnits: 5000000000000n,
  reasonCode: 'PROTOCOL_SEED_GRANT',
  idempotencyKey: 'tx_seed_001', // Same key
});
assert.equal(
  ledger.getAccountBalance(agentId, 'PROTOCOL_SEED_RESTRICTED', asset),
  5000000000000n, // Must not double
  'Idempotent transaction must not duplicate balances'
);
console.log('✓ Test 2 Passed: Idempotency protected against duplication.');

// 3. Restricted Seed Invariant 1: Direct withdrawal to owner/earned denied
console.log('Test 3: Restricted Seed Withdrawal Rejection...');
assert.throws(() => {
  ledger.postTransaction({
    agentId,
    fromAccountType: 'PROTOCOL_SEED_RESTRICTED',
    toAccountType: 'EARNED_AVAILABLE', // Attempting to turn seed into withdrawable balance
    asset,
    amountBaseUnits: 100000000000n,
    reasonCode: 'USER_WITHDRAWAL',
    idempotencyKey: 'tx_bad_withdraw',
  });
}, /SECURITY VIOLATION.*Direct withdrawal to owner or earned balance is prohibited/);
console.log('✓ Test 3 Passed: Illegal seed withdrawal rejected.');

// 4. Restricted Seed Invariant 2: Non-allowlisted reason code denied
console.log('Test 4: Restricted Seed Non-Allowlisted Reason Rejection...');
assert.throws(() => {
  ledger.postTransaction({
    agentId,
    fromAccountType: 'PROTOCOL_SEED_RESTRICTED',
    toAccountType: 'OPERATING_AVAILABLE',
    asset,
    amountBaseUnits: 50000000000n,
    reasonCode: 'RANDOM_UNAPPROVED_EXPENSE',
    idempotencyKey: 'tx_bad_reason',
  });
}, /SECURITY VIOLATION.*is not in the allowlist/);
console.log('✓ Test 4 Passed: Unapproved seed reason code rejected.');

// 5. Restricted Seed Valid Spend: Approved reason succeeds
console.log('Test 5: Approved Seed Spend (Premium Energy Purchase)...');
ledger.postTransaction({
  agentId,
  fromAccountType: 'PROTOCOL_SEED_RESTRICTED',
  toAccountType: 'OPERATING_AVAILABLE',
  asset,
  amountBaseUnits: 100000000000n, // 100 3X
  reasonCode: 'PREMIUM_ENERGY_PURCHASE',
  idempotencyKey: 'tx_energy_buy_01',
});
assert.equal(
  ledger.getAccountBalance(agentId, 'PROTOCOL_SEED_RESTRICTED', asset),
  4900000000000n
);
assert.equal(
  ledger.getAccountBalance(agentId, 'OPERATING_AVAILABLE', asset),
  100000000000n
);
console.log('✓ Test 5 Passed: Approved seed spend succeeded.');

// 6. QNE Calculation: strictly only external verified revenue
console.log('Test 6: Qualified Net Earnings (QNE) Engine...');
// Post external qualified task revenue
ledger.postTransaction({
  agentId,
  fromAccountType: 'EXTERNAL_SETTLEMENT',
  toAccountType: 'EARNED_AVAILABLE',
  asset,
  amountBaseUnits: 250000000000n, // 250 3X
  reasonCode: 'EXTERNAL_TASK_REVENUE',
  idempotencyKey: 'tx_task_rev_01',
  isQualified: true,
  qualificationReason: 'Solved external TON Testnet bounty',
});

// Post deposit (NOT qualified)
ledger.postTransaction({
  agentId,
  fromAccountType: 'EXTERNAL_SETTLEMENT',
  toAccountType: 'OPERATING_AVAILABLE',
  asset,
  amountBaseUnits: 800000000000n, // 800 3X
  reasonCode: 'USER_DEPOSIT',
  idempotencyKey: 'tx_deposit_01',
  isQualified: false, // User deposits never count as QNE
});

const calculatedQne = ledger.calculateQNE(agentId);
assert.equal(
  calculatedQne,
  250000000000n,
  'QNE must only sum external task revenue, excluding deposits and seeds'
);
console.log('✓ Test 6 Passed: QNE strictly includes external productive revenue.');

// 7. Growth Stage Claim Replay Protection
console.log('Test 7: Growth Stage Claim & Replay Protection...');
const claim1 = ledger.claimGrowthStage({
  agentId,
  stage: '3X',
  amountBaseUnits: 7500000000000n,
  nonce: 'nonce_claim_3x_01',
  ownerAddress: 'EQC_owner_wallet',
});
assert.equal(claim1.success, true);

// Attempting duplicate claim of same stage must fail with REPLAY ERROR
assert.throws(() => {
  ledger.claimGrowthStage({
    agentId,
    stage: '3X',
    amountBaseUnits: 7500000000000n,
    nonce: 'nonce_claim_3x_02',
    ownerAddress: 'EQC_owner_wallet',
  });
}, /REPLAY ERROR: Stage 3X has already been claimed/);
console.log('✓ Test 7 Passed: Stage claim replay protection verified.');

console.log('\nALL GATE 4 UNIT TESTS PASSED SUCCESSFULLY! 💎');
