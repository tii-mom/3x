import { Goal } from '../types';
import { useAppStore } from '../features/wallet/walletStore';
import { simulateNetworkDelay } from './api';

export interface GoalService {
  getCurrentGoal(): Promise<Goal>;
  updateGoalTarget(target: number): Promise<Goal>;
}

export const goalService: GoalService = {
  async getCurrentGoal(): Promise<Goal> {
    const goal = useAppStore.getState().goal;
    return simulateNetworkDelay({ ...goal });
  },

  async updateGoalTarget(target: number): Promise<Goal> {
    useAppStore.getState().updateTargetGoal(target);
    const updated = useAppStore.getState().goal;
    return simulateNetworkDelay({ ...updated });
  },
};
