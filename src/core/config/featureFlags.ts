import { FeatureFlags } from '../../v3/models/types';

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  V3_PRODUCT_UI: true,
  TON_TESTNET_ACTIVATION: true,
  PREMIUM_ENERGY_PURCHASE: true,
  GROWTH_CLAIM_TESTNET: true,
  EXTERNAL_TASKS: true,
  ADVANCED_SKILLS: true,
  MULTI_AI: false,
  MALECNS_LABS: false,
  MAINNET_EXECUTION: false,
  PAID_RANDOM_CAPSULE: false,
};

let activeFlags = { ...DEFAULT_FEATURE_FLAGS };

export function getFeatureFlags(): FeatureFlags {
  return activeFlags;
}

export function setFeatureFlag<K extends keyof FeatureFlags>(key: K, value: FeatureFlags[K]): void {
  activeFlags[key] = value;
}
