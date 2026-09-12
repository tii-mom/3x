# Prompt 04 — Economic Backend & Growth

Implement Gate 4 using `schemas/db_schema.sql`, `schemas/openapi.yaml`, and `schemas/event_catalog.yaml`.

Build:
- PostgreSQL Economic Ledger
- agent economic accounts
- Restricted Protocol Seed
- generation assignment
- QNE calculator
- Growth entitlement/status
- Testnet claim prepare/confirm
- chain index/reconciliation
- activity read model
- Trace linkage to economic result

Invariants:
- Seed cannot withdraw to owner;
- deposit/Seed/Growth reward/airdrop/referral/token appreciation excluded from QNE;
- every economic mutation uses idempotency and double-entry entries;
- corrections are compensating entries;
- Growth stage claim cannot replay.

Stop after Gate 4 acceptance.
