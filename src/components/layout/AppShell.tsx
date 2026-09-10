import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { DesktopNav } from './DesktopNav';
import { MobileBottomNav } from './MobileBottomNav';
import { Bot, ShieldCheck, Wallet } from 'lucide-react';
import { USE_MOCK_API } from '../../services/api';
import { TonWalletModal } from '../ui/TonWalletModal';
import { useAppStore } from '../../features/wallet/walletStore';
import { formatAddress } from '../../utils/formatters';

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const { wallet } = useAppStore();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9FF] text-[#11141C]">
      {/* Desktop Header */}
      <DesktopNav />

      {/* Mobile Top Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E2E7F0] px-4 py-3 flex md:hidden items-center justify-between">
        <Link to="/app" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#090B10] text-[#3AC8FF] flex items-center justify-center font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="font-headline font-bold text-[15px] text-[#11141C] tracking-tight">
              TON Wealth
            </span>
            <div className="text-[10px] text-[#64748B] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#00B074]" />
              Non-Custodial
            </div>
          </div>
        </Link>

        <button
          onClick={() => setIsWalletModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0F3FA] border border-[#E2E7F0] text-[11px] font-mono font-medium text-[#11141C] cursor-pointer"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#00B074] animate-pulse" />
          <Wallet className="w-3 h-3 text-[#2F6BFF]" />
          <span>{formatAddress(wallet.ownerAddress, 4, 3)}</span>
        </button>
      </header>

      {/* Main Outlet Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Mobile Wallet Modal */}
      <TonWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onOpenFund={() => navigate('/wallet/fund')}
        onOpenWithdraw={() => navigate('/app/controls')}
      />
    </div>
  );
};
