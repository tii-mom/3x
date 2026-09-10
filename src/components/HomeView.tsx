import React from 'react';
import { Wallet, Bot, ArrowUpRight, TrendingUp, ShieldCheck, ChevronRight } from 'lucide-react';
import { SubWalletState, MilestoneState } from '../types';

interface HomeViewProps {
  subWallet: SubWalletState;
  milestone: MilestoneState;
  onNavigateToAI: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  subWallet,
  milestone,
  onNavigateToAI,
}) => {
  const totalNetWorth = 14890.25;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Total Balance Card */}
      <div className="p-6 rounded-[24px] bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[12px] font-mono-data text-white/60">Primary Portfolio</span>
          <span className="text-[11px] font-mono-data bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% (30d)
          </span>
        </div>

        <div className="mb-4">
          <span className="font-headline text-[32px] font-bold tracking-tight">
            ${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <p className="text-[12px] text-white/70 mt-0.5">2,640.85 TON · Main Custody</p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
          <div>
            <span className="text-[11px] text-white/50 block">Liquid Assets</span>
            <span className="text-[14px] font-bold font-tabular text-white">$13,641.83</span>
          </div>
          <div>
            <span className="text-[11px] text-white/50 block">AI Sub-Wallet</span>
            <span className="text-[14px] font-bold font-tabular text-[#3AC8FF]">
              ${milestone.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Autonomous Sub-Wallet Hero Banner */}
      <div
        onClick={onNavigateToAI}
        className="p-5 rounded-[24px] bg-white border-2 border-[#2F6BFF]/40 shadow-lg relative cursor-pointer hover:border-[#2F6BFF] transition-all group"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#2F6BFF]/10 text-[#0051DF] flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-[15px] text-[#191C21]">
                Autonomous Yield Engine
              </h3>
              <span className="text-[11px] text-[#434655]">
                Sub-Wallet · {subWallet.shortAddress}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#737687] group-hover:translate-x-1 transition-transform" />
        </div>

        <div className="bg-[#F2F3FB] p-3 rounded-[16px] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#434655] block">Allocated Yield</span>
            <span className="text-[16px] font-bold font-tabular text-[#0051DF]">
              ${milestone.currentValue.toFixed(2)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#006C48] font-semibold block">18.2% APY Live</span>
            <span className="text-[11px] text-[#434655]">Auto-Compounding</span>
          </div>
        </div>
      </div>

      {/* Security Overview */}
      <div className="p-4 rounded-[20px] bg-white border border-[#C3C5D8]/30 space-y-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#006C48]" />
          <h4 className="font-semibold text-[13px] text-[#191C21]">Cryptographic Isolation Active</h4>
        </div>
        <p className="text-[12px] text-[#434655] leading-relaxed">
          Smart sub-wallet architecture ensures zero exposure to primary cold assets. The AI executor
          cannot drain or access tokens outside of its designated sandbox.
        </p>
      </div>
    </div>
  );
};
