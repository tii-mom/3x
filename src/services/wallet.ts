import { WalletInfo } from '../types';
import { useAppStore } from '../features/wallet/walletStore';
import { simulateNetworkDelay } from './api';

export interface WalletService {
  getWalletInfo(): Promise<WalletInfo>;
  connect(): Promise<WalletInfo>;
  disconnect(): Promise<void>;
  fundSubWallet(amount: number, asset: string): Promise<boolean>;
  withdrawToOwner(amount: number): Promise<boolean>;
}

export const walletService: WalletService = {
  async getWalletInfo(): Promise<WalletInfo> {
    const wallet = useAppStore.getState().wallet;
    return simulateNetworkDelay({ ...wallet });
  },

  async connect(): Promise<WalletInfo> {
    useAppStore.getState().connectWallet();
    const wallet = useAppStore.getState().wallet;
    return simulateNetworkDelay({ ...wallet });
  },

  async disconnect(): Promise<void> {
    useAppStore.getState().disconnectWallet();
    await simulateNetworkDelay(null);
  },

  async fundSubWallet(amount: number, asset = 'USDT'): Promise<boolean> {
    useAppStore.getState().addCapital(amount, asset);
    return simulateNetworkDelay(true, 400);
  },

  async withdrawToOwner(amount: number): Promise<boolean> {
    useAppStore.getState().withdrawCapital(amount);
    return simulateNetworkDelay(true, 400);
  },
};
