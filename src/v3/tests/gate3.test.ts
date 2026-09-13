import assert from 'node:assert/strict';
import { AgenticWalletManager } from '../ton/agenticWallet';
import { TransactionIntentPipeline, TypedTransactionIntent } from '../ton/intentPipeline';

console.log('--- Running Gate 3 Unit Tests (Local Prototype Stubs) ---');

// 1. Test Agentic Wallet Preparation
console.log('Test 1: Agentic Wallet Preparation & Network Fee Disclosure...');
const ownerAddr = 'EQC88192_owner_wallet_address';
const payload = AgenticWalletManager.prepareActivation(ownerAddr);
assert.equal(payload.network, 'testnet');
assert.equal(payload.action, 'DEPLOY_AGENTIC_SUBWALLET');
assert.equal(payload.networkFeeTon, '0.045');
assert.equal(payload.revocationGuaranteed, true);
console.log('✓ Test 1 Passed: Network fee and payload validated.');

// 2. Test Activation & Key Isolation
console.log('Test 2: Activation & KMS Key Boundary...');
const activatedWallet = AgenticWalletManager.activate(ownerAddr, '0x991823abce8812');
assert.equal(activatedWallet.status, 'ACTIVE');
assert.ok(activatedWallet.agenticWalletAddress?.includes('agentic'));
// Key isolation check: operatorKeyRef must NOT contain private key material
assert.ok(activatedWallet.operatorKeyRef.startsWith('kms_slot_ref_'));
assert.ok(!JSON.stringify(activatedWallet).includes('privateKey'));
console.log('✓ Test 2 Passed: Key isolation boundary verified.');

// 3. Test Owner Revocation
console.log('Test 3: Owner Revocation...');
const revokedWallet = AgenticWalletManager.revoke(activatedWallet);
assert.equal(revokedWallet.status, 'REVOKED');
assert.equal(revokedWallet.agenticWalletAddress, undefined);
console.log('✓ Test 3 Passed: Immediate revocation capability verified.');

// 4. Test Transaction Intent Pipeline (Approved Case - Local Prototype Stub)
console.log('Test 4: Prototype Intent Risk-Gate Simulation...');
const approvedIntent: TypedTransactionIntent = {
  id: 'int_001',
  network: 'testnet',
  targetContract: 'kQ_task_bounty_registry',
  actionName: 'CLAIM_TASK_BOUNTY',
  asset: 'TESTNET_3X',
  amountBaseUnits: '10000000000',
  maxSlippageBps: 50,
  state: 'CREATED',
};
const processedApproved = TransactionIntentPipeline.processIntent(approvedIntent);
// State remains CONFIRMED for compatibility with local prototype stub
assert.equal(processedApproved.state, 'CONFIRMED');
assert.equal(processedApproved.simulatedSuccess, true);
console.log('✓ Test 4 Passed: Prototype approved intent passed local simulated pipeline.');

// 5. Test Unknown Contract Rejection
console.log('Test 5: Rejection of Unapproved Contract...');
const maliciousContractIntent: TypedTransactionIntent = {
  id: 'int_002',
  network: 'testnet',
  targetContract: 'kQ_unknown_unverified_drainer',
  actionName: 'TRANSFER_ALL',
  asset: 'TESTNET_3X',
  amountBaseUnits: '50000000000',
  maxSlippageBps: 50,
  state: 'CREATED',
};
const processedMalicious = TransactionIntentPipeline.processIntent(maliciousContractIntent);
assert.equal(processedMalicious.state, 'DENIED');
assert.ok(processedMalicious.denialReason?.includes('not on the approved adapter allowlist'));
console.log('✓ Test 5 Passed: Malicious contract DENIED.');

// 6. Test Unverified Asset Rejection
console.log('Test 6: Rejection of Unverified Asset...');
const unverifiedAssetIntent: TypedTransactionIntent = {
  id: 'int_003',
  network: 'testnet',
  targetContract: 'kQ_task_bounty_registry',
  actionName: 'STAKE_MEMECOIN',
  asset: 'SHADY_INFLATION_COIN',
  amountBaseUnits: '100000',
  maxSlippageBps: 50,
  state: 'CREATED',
};
const processedAsset = TransactionIntentPipeline.processIntent(unverifiedAssetIntent);
assert.equal(processedAsset.state, 'DENIED');
assert.ok(processedAsset.denialReason?.includes('is unverified'));
console.log('✓ Test 6 Passed: Unverified asset DENIED.');

// 7. Test Slippage Exceed Rejection
console.log('Test 7: Slippage Exceed Rejection...');
const highSlippageIntent: TypedTransactionIntent = {
  id: 'int_004',
  network: 'testnet',
  targetContract: 'kQ_dex_swap_testnet_v1',
  actionName: 'SWAP',
  asset: 'TON',
  amountBaseUnits: '1000000000',
  maxSlippageBps: 500, // 5% > 2% max
  state: 'CREATED',
};
const processedSlippage = TransactionIntentPipeline.processIntent(highSlippageIntent);
assert.equal(processedSlippage.state, 'DENIED');
assert.ok(processedSlippage.denialReason?.includes('Slippage tolerance exceeds'));
console.log('✓ Test 7 Passed: Excessive slippage DENIED.');

console.log('\nALL GATE 3 PROTOTYPE UNIT TESTS PASSED SUCCESSFULLY! 🚀');
