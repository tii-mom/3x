import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { app, ledger } from '../src/server/index.js';

async function runServerTests() {
  console.log('--- Running Backend & Persistent Ledger Tests ---');

  // Test 1: Initial grant of operating tokens
  const grantResult = ledger.postTransaction({
    agentId: 'test_agent_001',
    fromAccountType: 'EXTERNAL_SETTLEMENT',
    toAccountType: 'OPERATING_AVAILABLE',
    asset: 'TESTNET_3X',
    amountBaseUnits: 500000000000n, // 500 3X
    reasonCode: 'AGENT_INITIAL_OPERATING_GRANT',
    idempotencyKey: 'test_grant_001',
  });

  assert.equal(grantResult.entry.amountBaseUnits, 500000000000n);
  const bal = ledger.getAccountBalance('test_agent_001', 'OPERATING_AVAILABLE', 'TESTNET_3X');
  assert.equal(bal, 500000000000n);
  console.log('✓ Test 1 Passed: Initial operating grant posted.');

  // Test 2: Idempotency protection
  const dupGrant = ledger.postTransaction({
    agentId: 'test_agent_001',
    fromAccountType: 'EXTERNAL_SETTLEMENT',
    toAccountType: 'OPERATING_AVAILABLE',
    asset: 'TESTNET_3X',
    amountBaseUnits: 500000000000n,
    reasonCode: 'AGENT_INITIAL_OPERATING_GRANT',
    idempotencyKey: 'test_grant_001',
  });
  assert.equal(dupGrant.event.id, grantResult.event.id);
  const balAfterDup = ledger.getAccountBalance('test_agent_001', 'OPERATING_AVAILABLE', 'TESTNET_3X');
  assert.equal(balAfterDup, 500000000000n, 'Balance should NOT increase on duplicate idempotency key');
  console.log('✓ Test 2 Passed: Idempotency strictly enforced.');

  // Test 3: Restricted Seed Withdrawal Violation
  ledger.postTransaction({
    agentId: 'test_agent_001',
    fromAccountType: 'EXTERNAL_SETTLEMENT',
    toAccountType: 'PROTOCOL_SEED_RESTRICTED',
    asset: 'TESTNET_3X',
    amountBaseUnits: 200000000000n,
    reasonCode: 'PROTOCOL_SEED_GRANT',
    idempotencyKey: 'seed_grant_001',
  });

  assert.throws(
    () => {
      ledger.postTransaction({
        agentId: 'test_agent_001',
        fromAccountType: 'PROTOCOL_SEED_RESTRICTED',
        toAccountType: 'EARNED_AVAILABLE',
        asset: 'TESTNET_3X',
        amountBaseUnits: 50000000000n,
        reasonCode: 'OWNER_WITHDRAWAL',
        idempotencyKey: 'illegal_withdraw_001',
      });
    },
    /SECURITY VIOLATION/,
    'Direct withdrawal of Protocol Seed must throw security violation'
  );
  console.log('✓ Test 3 Passed: Restricted seed withdrawal blocked.');

  // Test 4: QNE Calculation with productive revenue vs internal
  ledger.postTransaction({
    agentId: 'test_agent_001',
    fromAccountType: 'EXTERNAL_SETTLEMENT',
    toAccountType: 'EARNED_AVAILABLE',
    asset: 'TESTNET_3X',
    amountBaseUnits: 100000000000n, // 100 3X
    reasonCode: 'EXTERNAL_TASK_REVENUE',
    idempotencyKey: 'productive_revenue_001',
    isQualified: true,
    qualificationReason: 'External AI compute task completed',
  });

  const qne = ledger.calculateQNE('test_agent_001');
  assert.equal(qne, 100000000000n);
  console.log('✓ Test 4 Passed: QNE accurately computed strictly from external revenue.');

  console.log('==========================================================');
  console.log('ALL BACKEND & LEDGER TESTS PASSED SUCCESSFULLY! 🛡️');
  console.log('==========================================================');
  process.exit(0);
}

runServerTests();
