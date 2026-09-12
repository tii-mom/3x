# Testnet Operations Runbook

## Pre-deploy

- Confirm `MAINNET_EXECUTION=false`.
- Confirm Testnet RPC/config.
- Confirm signer isolated and test-only keys.
- Run DB migration.
- Run ledger invariant tests.
- Run contract unit/integration tests.
- Verify allowlist.
- Verify environment badge in UI.

## Daily checks

- signer health
- chain index lag
- reconciliation count
- failed simulation rate
- denied intent rate
- economic ledger imbalance (must be zero)
- premium compute spend anomaly
- Sybil signals

## Incident

If signer/chain/accounting uncertainty:

1. set sensitive execution pause;
2. preserve owner revoke/pause path;
3. stop new claims if attestation compromised;
4. reconcile ledger vs chain;
5. issue incident id;
6. no silent retroactive balance edits; use compensating entries.
