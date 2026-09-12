import { SkillTier } from '../models/types';

export type SkillLifecycleState =
  | 'PLATFORM_DRAFT'
  | 'TESTING'
  | 'AUDITED'
  | 'SEALED_ITEM'
  | 'OWNED'
  | 'LEARNED_BOUND';

export interface SkillManifest {
  skillId: string;
  name: string;
  tier: SkillTier;
  version: string;
  codeHash: string;
  inputs: string[];
  modules: string[];
  outputs: string[];
  toolPermissions: string[];
  riskClass: 'LOW' | 'MEDIUM' | 'HIGH';
  energyProfile: {
    baseEnergyCost: number;
    maxEnergyCost: number;
  };
  isSystemImmutable?: boolean; // e.g. Risk Guardian
}

export const SYSTEM_SKILL_RISK_GUARDIAN: SkillManifest = {
  skillId: 'sys_risk_immutable',
  name: 'Risk Guardian',
  tier: 'COMMON',
  version: '1.0.0',
  codeHash: 'sha256_immutable_risk_guard_001',
  inputs: ['ExecutionIntent', 'PortfolioLimits'],
  modules: ['AllowlistCheck', 'ExposureLimiter', 'SimulationVerifier'],
  outputs: ['RiskApprovalToken'],
  toolPermissions: ['READ_LEDGER', 'SIMULATE_INTENT'],
  riskClass: 'LOW',
  energyProfile: {
    baseEnergyCost: 0,
    maxEnergyCost: 0,
  },
  isSystemImmutable: true,
};

export class SkillCircuitManager {
  private boundSkills: Map<string, SkillManifest> = new Map();

  constructor() {
    // Risk Guardian is ALWAYS bound and cannot be removed
    this.boundSkills.set(SYSTEM_SKILL_RISK_GUARDIAN.skillId, SYSTEM_SKILL_RISK_GUARDIAN);
  }

  public getBoundSkills(): SkillManifest[] {
    return Array.from(this.boundSkills.values());
  }

  public isSkillBound(skillId: string): boolean {
    return this.boundSkills.has(skillId);
  }

  public bindSkill(manifest: SkillManifest): void {
    this.boundSkills.set(manifest.skillId, manifest);
  }

  public unbindSkill(skillId: string): void {
    // INVARIANT: Risk Guardian is system capability and cannot be unbound
    if (skillId === SYSTEM_SKILL_RISK_GUARDIAN.skillId) {
      throw new Error('Risk Guardian is an immutable system capability and cannot be removed.');
    }
    this.boundSkills.delete(skillId);
  }
}
