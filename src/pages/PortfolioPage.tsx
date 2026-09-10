import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioCategory } from '../components/portfolio/PortfolioCategory';
import { AllocationBar } from '../components/wealth/AllocationBar';
import { useAppStore } from '../features/wallet/walletStore';
import { formatUsd } from '../utils/formatters';
import { ArrowUpRight, Lock, Plus, ShieldCheck } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const navigate = useNavigate();
  const { portfolio, categories } = useAppStore();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#11141C] font-headline tracking-tight">
            Portfolio Allocations
          </h1>
          <p className="text-[13px] text-[#64748B]">
            Autonomous three-tier risk structure governed by your mandate.
          </p>
        </div>

        <button
          onClick={() => navigate('/wallet/fund')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F6BFF] text-white text-[13px] font-semibold hover:bg-[#1E56E0] cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Capital</span>
        </button>
      </div>

      {/* Overview Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E7F0] shadow-sm space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
            Total Allocated Wealth
          </span>
          <span className="text-[12px] font-bold text-[#00B074] bg-[#00B074]/10 px-2 py-0.5 rounded-full">
            Autonomous Balancing
          </span>
        </div>

        <div className="text-[36px] font-black text-[#11141C] font-headline tabular-nums">
          {formatUsd(portfolio.nav)}
        </div>

        <AllocationBar allocation={portfolio.allocation} showLabels={true} />
      </div>

      {/* Categories List (Reserve, Yield, Growth) */}
      <div className="space-y-4">
        {categories.map((cat, idx) => (
          <PortfolioCategory
            key={cat.category}
            data={cat}
            defaultExpanded={idx === 0}
          />
        ))}
      </div>

      {/* Safety Notice */}
      <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E7F0] flex items-center gap-3 text-[12px] text-[#64748B]">
        <ShieldCheck className="w-5 h-5 text-[#00B074] shrink-0" />
        <span>
          Assets are never locked in lockups. You can withdraw or reallocate anytime via the Controls tab.
        </span>
      </div>
    </div>
  );
};
