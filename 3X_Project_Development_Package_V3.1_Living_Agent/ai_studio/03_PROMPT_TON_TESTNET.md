# Prompt 03 — TON Testnet Integration

Implement Gate 3 only after security review of Gate 2.

Integrate TON owner wallet and Testnet Agentic Wallet activation behind `TON_TESTNET_ACTIVATION` flag.

Requirements:
- Testnet only;
- explicit network fee message;
- owner retains root control;
- operator secret never in LLM/browser-visible state;
- typed transaction intents only;
- quote/simulate before sign;
- unknown contract/unverified asset/failed simulation = DENY;
- owner pause/revoke;
- environment badge.

Do not implement Mainnet execution. Do not create a generic arbitrary contract-call form. Stop after Gate 3 tests.
