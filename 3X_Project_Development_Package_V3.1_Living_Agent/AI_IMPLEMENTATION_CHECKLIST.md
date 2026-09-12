# AI Implementation Checklist

Before coding: read `00_AI_START_HERE.md` and `ai_studio/00_IMPLEMENTATION_MANIFEST.md`.

- [ ] Branch from baseline main.
- [ ] Create V3 product layer, do not patch legacy Wealth IA.
- [ ] Gate 1 mock UI first.
- [ ] Gate 2 domain/value router/trace.
- [ ] Gate 3 TON Testnet only.
- [ ] Gate 4 ledger/growth.
- [ ] Gate 5 beta instrumentation.
- [ ] Never expose secrets or arbitrary contract calls.
- [ ] Never present simulation as real earnings.
- [ ] Never treat Growth Vault or Seed as withdrawable user money.
- [ ] Every Premium Energy spend has a reason/result trace.
- [ ] Every economic mutation is ledgered and idempotent.
- [ ] Stop after each Gate and request review.
