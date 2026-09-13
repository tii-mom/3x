// 3X Protocol — Centralized Beta Tokenomics Test Fixtures
// These values mirror 3X_Project_Development_Package_V3.1_Living_Agent/configs/parameter_registry.yaml.
// They are Beta/reference values only. They are not frozen Mainnet tokenomics.

const BETA_REFERENCE_SUPPLY: coins = 1000000000000000000 // 1,000,000,000 * 10^9 (1B 3X)

// Outer Allocation:
// AI Economy: 80%
// Team: 10%
// LP: 5%
// Community: 5%
const BETA_AI_RESERVE_CAP: coins = 800000000000000000 // 800,000,000 * 10^9 (80%)
const BETA_TEAM_ALLOCATION: coins = 100000000000000000 // 100,000,000 * 10^9 (10%)
const BETA_LP_ALLOCATION: coins = 50000000000000000 // 50,000,000 * 10^9 (5%)
const BETA_COMMUNITY_ALLOCATION: coins = 50000000000000000 // 50,000,000 * 10^9 (5%)

// AI Economy Internal Accounting (relative to 1B Reference Supply):
// Seed: 4%
// Growth: 60%
// Demand: 16%
const BETA_SEED_CAP: coins = 40000000000000000 // 40,000,000 * 10^9 (4%)
const BETA_GROWTH_CAP: coins = 600000000000000000 // 600,000,000 * 10^9 (60%)
const BETA_DEMAND_CAP: coins = 160000000000000000 // 160,000,000 * 10^9 (16%)

// G0–G7 Per-Generation Entitlements (in nanotokens, 9 decimals)
// Total Capacity: 255,000 Primary AIs
const GENESIS_SEED_ENTITLEMENT: coins = 5000000000000 // 5,000 * 10^9
const GENESIS_GROWTH_ENTITLEMENT: coins = 75000000000000 // 75,000 * 10^9
