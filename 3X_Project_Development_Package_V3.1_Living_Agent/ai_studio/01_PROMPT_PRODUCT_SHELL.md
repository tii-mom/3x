# Prompt 01 — Build V3 Product Shell

Implement Gate 1 only.

Use existing repo infrastructure, but create a clean V3 product layer. Do not connect real TON or backend. Use `configs/mock_agent_fixture.json`.

Required routes:
`/`, `/claim`, `/app`, `/app/skills`, `/app/energy`, `/app/market`, `/app/activity`, `/app/me`, `/app/trace/:id`.

Mobile nav: AI / Market / Activity / Me.

Build:
- Landing with free claim CTA.
- Claim flow requiring no wallet.
- AI Home with agent status, simulated net result, Energy, Skills, Growth progress, current work.
- Living Brain component driven by trace steps.
- Skills inventory/equipped slots.
- Energy page with Base/Premium and mock Compute ROI.
- Market shell.
- Activity timeline and Trace Replay.
- Me page with environment/security placeholders.

Keep Simulation label prominent. Remove legacy Wealth IA from V3 routes. Do not delete legacy source files yet.

Acceptance: `13_ACCEPTANCE_CRITERIA.md` Gate 1. Run `npm/bun` project build and TypeScript checks. Stop after Gate 1.
