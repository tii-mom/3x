# Prompt 02 — Domain Engine, Value Router & Trace

Implement Gate 2 only after Gate 1 review.

Add typed V3 domain models and mock services for:
- Agent state machine
- Skill lifecycle and Skill Circuit manifest
- Base/Premium Energy and budgets
- Value Router
- Growth progression
- Brain Trace
- Bounded learning update model

Rules:
- negative expected net value cannot use Premium Energy;
- Risk Guardian node is system capability, not removable paid Skill;
- Growth reward does not count as future QNE;
- Token price changes do not affect Growth level;
- Brain graph must derive from trace steps;
- no model/learning code may alter Risk policy.

Do not connect chain. Add unit tests for state machines and Value Router. Stop after Gate 2.
