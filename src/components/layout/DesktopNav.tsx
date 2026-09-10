import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Bot,
  Home,
  PieChart,
  Settings,
  Share2,
  Sparkles,
  Target,
  Wallet,
} from 'lucide-react';
import { WalletStatus } from '../ui/WalletStatus';
import { TonWalletModal } from '../ui/TonWalletModal';
import { useAppStore } from '../../features/wallet/walletStore';
import { USE_MOCK_API } from '../../services/api';

export const DesktopNav: React.FC = () => {
  const navigate = useNavigate();
  const { wallet, controls } = useAppStore();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const navItems = [
    { to: '/app', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { to: '/app/ai', label: 'Your AI', icon: <Bot className="w-4 h-4" /> },
    { to: '/app/portfolio', label: 'My Assets', icon: <PieChart className="w-4 h-4" /> },
    { to: '/app/goal', label: 'Wealth Journey', icon: <Target className="w-4 h-4" /> },
    { to: '/app/activity', label: 'What AI Did', icon: <Activity className="w-4 h-4" /> },
    { to: '/app/controls', label: 'Controls', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-[#E2E7F0] hidden md:block">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/app" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#090B10] text-[#3AC8FF] flex items-center justify-center font-bold shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline font-bold text-[16px] text-[#11141C] tracking-tight">
                    TON AI Wealth Agent
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F0F3FA] text-[#2F6BFF] border border-[#2F6BFF]/20">
                    DEMO • Simulated
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] -mt-0.5 font-medium">Personal AI Wealth Agent</p>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-1 ml-4" aria-label="Desktop navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/app'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
                      isActive
                        ? 'bg-[#F0F3FA] text-[#2F6BFF] font-semibold'
                        : 'text-[#64748B] hover:text-[#11141C] hover:bg-[#F8FAFC]'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.to === '/app/ai' && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        controls.autopilotStatus === 'RUNNING' ? 'bg-[#3AC8FF] animate-pulse' : 'bg-[#64748B]'
                      }`}
                    />
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right Action & Wallet */}
          <div className="flex items-center gap-3">
            <Link
              to="/app/share"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-[#64748B] hover:text-[#11141C] hover:bg-[#F0F3FA] transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </Link>

            <WalletStatus
              ownerAddress={wallet.ownerAddress}
              subWalletAddress={wallet.subWalletAddress}
              isConnected={wallet.isConnected}
              onClick={() => setIsWalletModalOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* Ton Wallet Manager Modal */}
      <TonWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onOpenFund={() => navigate('/wallet/fund')}
        onOpenWithdraw={() => navigate('/app/controls')}
      />
    </>
  );
};
