import { GrowthStage } from '../models/types';

export interface GrowthStatus {
  stage: GrowthStage;
  multiple: number;
  cumulativeQne: number;
  initialSeedBasis: number;
  nextMilestoneMultiple: number;
  progressPct: number;
  unlockedVaultPct: number;
}

export const GROWTH_MILESTONES: { stage: GrowthStage; targetMultiple: number; vaultUnlockPct: number }[] = [
  { stage: '1X', targetMultiple: 1.0, vaultUnlockPct: 0 },
  { stage: '3X', targetMultiple: 3.0, vaultUnlockPct: 10 },
  { stage: '9X', targetMultiple: 9.0, vaultUnlockPct: 15 },
  { stage: '27X', targetMultiple: 27.0, vaultUnlockPct: 20 },
  { stage: '81X', targetMultiple: 81.0, vaultUnlockPct: 25 },
  { stage: '243X', targetMultiple: 243.0, vaultUnlockPct: 30 },
  { stage: '729X_PRESTIGE', targetMultiple: 729.0, vaultUnlockPct: 0 },
];

export class GrowthEngine {
  public static calculateGrowth(cumulativeQne: number, initialSeedBasis: number): GrowthStatus {
    const basis = Math.max(1, initialSeedBasis);
    const multiple = Number((1 + Math.max(0, cumulativeQne) / basis).toFixed(2));

    let currentMilestone = GROWTH_MILESTONES[0];
    let nextMilestone = GROWTH_MILESTONES[1];

    for (let i = 0; i < GROWTH_MILESTONES.length; i++) {
      if (multiple >= GROWTH_MILESTONES[i].targetMultiple) {
        currentMilestone = GROWTH_MILESTONES[i];
        nextMilestone = GROWTH_MILESTONES[i + 1] || GROWTH_MILESTONES[i];
      } else {
        nextMilestone = GROWTH_MILESTONES[i];
        break;
      }
    }

    const prevTarget = currentMilestone.targetMultiple;
    const nextTarget = nextMilestone.targetMultiple;
    const progressPct =
      nextTarget > prevTarget
        ? Math.min(100, Math.max(0, Math.round(((multiple - prevTarget) / (nextTarget - prevTarget)) * 100)))
        : 100;

    return {
      stage: currentMilestone.stage,
      multiple,
      cumulativeQne,
      initialSeedBasis: basis,
      nextMilestoneMultiple: nextMilestone.targetMultiple,
      progressPct,
      unlockedVaultPct: currentMilestone.vaultUnlockPct,
    };
  }
}
