import { PortfolioOverview, PortfolioCategoryData } from '../types';
import { useAppStore } from '../features/wallet/walletStore';
import { simulateNetworkDelay } from './api';

export interface PortfolioService {
  getPortfolio(): Promise<PortfolioOverview>;
  getCategories(): Promise<PortfolioCategoryData[]>;
}

export const portfolioService: PortfolioService = {
  async getPortfolio(): Promise<PortfolioOverview> {
    const portfolio = useAppStore.getState().portfolio;
    return simulateNetworkDelay({ ...portfolio });
  },

  async getCategories(): Promise<PortfolioCategoryData[]> {
    const categories = useAppStore.getState().categories;
    return simulateNetworkDelay([...categories]);
  },
};
