import { ActivityEvent, ActivityFilter } from '../types';
import { useAppStore } from '../features/wallet/walletStore';
import { simulateNetworkDelay } from './api';

export interface ActivityService {
  listActivity(filter?: ActivityFilter): Promise<ActivityEvent[]>;
  getActivityById(id: string): Promise<ActivityEvent | null>;
}

export const activityService: ActivityService = {
  async listActivity(filter: ActivityFilter = 'All'): Promise<ActivityEvent[]> {
    const activities = useAppStore.getState().activities;
    let filtered = activities;

    if (filter === 'Money') {
      filtered = activities.filter(
        (a) => a.type === 'INVESTED' || a.type === 'EXITED' || a.type === 'PROTECTED'
      );
    } else if (filter === 'AI') {
      filtered = activities.filter(
        (a) => a.type === 'OBSERVED' || a.type === 'RESEARCHED' || a.type === 'REBALANCING'
      );
    } else if (filter === 'Risk') {
      filtered = activities.filter(
        (a) => a.type === 'PROTECTED' || a.type === 'RISK_CHANGED'
      );
    }

    return simulateNetworkDelay([...filtered]);
  },

  async getActivityById(id: string): Promise<ActivityEvent | null> {
    const activities = useAppStore.getState().activities;
    const found = activities.find((a) => a.id === id) || null;
    return simulateNetworkDelay(found);
  },
};
