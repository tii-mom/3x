import { Goal, MilestoneLevel } from '../types';

/**
 * Calculates milestone progress clamped to [0, 1].
 * Formula: currentNav / targetNav
 */
export function calculateMilestoneProgress(currentNav: number, targetNav: number): number {
  if (targetNav <= 0) return 0;
  const raw = currentNav / targetNav;
  return Math.min(1, Math.max(0, +raw.toFixed(4)));
}

/**
 * Calculates investment PnL strictly distinguishing user deposits from AI earnings.
 * Formula: currentNav - netContributions
 */
export function calculateInvestmentPnL(currentNav: number, netContributions: number): number {
  return +(currentNav - netContributions).toFixed(2);
}

/**
 * Default 3x geometric milestone progression:
 * Level 1: 100 -> 300
 * Level 2: 300 -> 900
 * Level 3: 900 -> 2,700
 * Level 4: 2,700 -> 8,100
 */
export const DEFAULT_3X_LEVELS: MilestoneLevel[] = [
  { level: 1, target: 300.0, label: 'First Tripling', achieved: false, multiplier: '3x' },
  { level: 2, target: 900.0, label: 'Capital Accretion', achieved: false, multiplier: '9x' },
  { level: 3, target: 2700.0, label: 'Autonomous Scale', achieved: false, multiplier: '27x' },
  { level: 4, target: 8100.0, label: 'Financial Freedom', achieved: false, multiplier: '81x' },
];

/**
 * Advance goal to the next milestone level (Level 1 -> Level 2 -> Level 3 -> etc.)
 */
export function advanceToNextMilestone(currentGoal: Goal, currentNav: number): Goal {
  const nextLevel = currentGoal.currentLevel + 1;
  const previousTarget = currentGoal.targetNav;
  const nextTarget = +(previousTarget * 3).toFixed(2);

  const updatedLevels: MilestoneLevel[] = currentGoal.levels.map((lvl) => {
    if (lvl.level < nextLevel) {
      return { ...lvl, achieved: true };
    }
    return lvl;
  });

  // If level not yet in levels array, generate it
  if (!updatedLevels.some((l) => l.level === nextLevel)) {
    updatedLevels.push({
      level: nextLevel,
      target: nextTarget,
      label: `Level ${nextLevel} Milestone`,
      achieved: false,
      multiplier: `${Math.pow(3, nextLevel)}x`,
    });
  }

  const progress = calculateMilestoneProgress(currentNav, nextTarget);

  return {
    ...currentGoal,
    currentLevel: nextLevel,
    levelStartNav: previousTarget,
    startingNav: currentGoal.startingNav,
    currentNav: currentNav,
    targetNav: nextTarget,
    progress,
    status: 'ACTIVE',
    levels: updatedLevels,
  };
}

/**
 * Validate withdrawal amount
 */
export function validateWithdrawal(amount: number, currentNav: number): { isValid: boolean; error?: string } {
  if (amount <= 0) {
    return { isValid: false, error: 'Withdrawal amount must be greater than zero.' };
  }
  if (amount > currentNav) {
    return { isValid: false, error: 'Cannot withdraw more than current AI Wallet balance.' };
  }
  return { isValid: true };
}
