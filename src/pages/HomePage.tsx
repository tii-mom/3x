import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WealthHero } from '../components/wealth/WealthHero';
import { WealthChart } from '../components/wealth/WealthChart';
import { AllocationCard } from '../components/wealth/AllocationCard';
import { LatestDecisionCard } from '../components/agent/LatestDecisionCard';
import { AutopilotCard } from '../components/agent/AutopilotCard';
import { ProtectionCard } from '../components/agent/ProtectionCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { useAppStore } from '../features/wallet/walletStore';
import { ArrowUpRight, Plus, Settings, Share2, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { portfolio, activities, toggleAutopilot } = useAppStore();

  const latestDecision = activities.find(
    (a) => a.type === 'INVESTED' || a.type === 'REBALANCING' || a.type === 'PROTECTED'
  ) || activities[0];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#11141C] font-headline tracking-tight">
            Your Wealth
          </h1>
          <p className="text-[13px] text-[#64748B]">
            Your AI is actively monitoring opportunities to grow and protect your assets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/wallet/fund')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2F6BFF] text-white text-[13px] font-semibold hover:bg-[#1E56E0] transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Money</span>
          </button>
          <button
            onClick={() => navigate('/app/controls')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E2E7F0] text-[#11141C] text-[13px] font-semibold hover:bg-[#F8FAFC] transition-all cursor-pointer shadow-2xs"
          >
            <Settings className="w-4 h-4 text-[#64748B]" />
            <span>Controls</span>
          </button>
        </div>
      </div>

      {/* Responsive Grid: Intentional 2-column layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Primary Column: Financial Trajectory */}
        <div className="lg:col-span-7 space-y-6">
          <WealthHero
            portfolio={portfolio}
            onNavigateGoal={() => navigate('/app/goal')}
            onNavigateAI={() => navigate('/app/ai')}
          />

          <WealthChart currentNav={portfolio.nav} />

          <AllocationCard
            totalNav={portfolio.nav}
            allocation={portfolio.allocation}
            onExplorePortfolio={() => navigate('/app/portfolio')}
          />
        </div>

        {/* Right Intelligence Column: Agent Engine & Latest Decision */}
        <div className="lg:col-span-5 space-y-6">
          <AutopilotCard
            status={portfolio.autopilotStatus}
            onToggleStatus={toggleAutopilot}
            onOpenReasoning={() => navigate(`/app/decision/${latestDecision?.id || 'act-001'}`)}
            onOpenScanner={() => navigate('/app/ai')}
          />

          <LatestDecisionCard
            decision={latestDecision}
            onViewDetails={() => navigate(`/app/decision/${latestDecision?.id || 'act-001'}`)}
          />

          <ProtectionCard
            safeFloor={portfolio.protectedWealth}
            maxCapPercent={5.0}
            slippage={0.05}
          />
        </div>
      </div>
    </div>
  );
};
