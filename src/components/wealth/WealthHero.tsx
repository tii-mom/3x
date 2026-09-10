import React from 'react';
import { ArrowUpRight, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { PortfolioOverview } from '../../types';
import { FinancialValue } from './FinancialValue';
import { formatUsd, formatPercent } from '../../utils/formatters';

interface WealthHeroProps {
  portfolio: PortfolioOverview;
  onNavigateGoal?: () => void;
  onNavigateAI?: () => void;
  className?: string;
}

export const WealthHero: React.FC<WealthHeroProps> = ({
  portfolio,
  onNavigateGoal,
  onNavigateAI,
  className = '',
}) => {
  const pnlPercent = (portfolio.pnlSinceStart / portfolio.startingCapital) * 100;

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-white border border-[#E2E7F0] p-6 shadow-sm ${className}`}>
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[#64748B] tracking-wider uppercase">
            Net Asset Value
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F0F3FA] text-[#2F6BFF] font-medium font-mono">
            {portfolio.risk} RISK
          </span>
        </div>

        <button
          onClick={onNavigateAI}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#090B10] text-white text-[12px] font-semibold shadow-xs hover:bg-[#1E2330] transition-all cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[#3AC8FF] animate-pulse" />
          <span className="text-[#3AC8FF]">{portfolio.autopilotStatus}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-white/70" />
        </button>
      </div>

      {/* Primary Value Display */}
      <div className="mt-3 flex items-baseline gap-2">
        <FinancialValue value={portfolio.nav} size="hero" />
        <span className="text-[14px] text-[#64748B] font-medium">USD</span>
      </div>

      {/* PnL & Growth Metrics */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
        <div className="inline-flex items-center gap-1 text-[#00B074] font-semibold bg-[#00B074]/10 px-2.5 py-1 rounded-lg">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+{formatUsd(portfolio.pnlSinceStart)}</span>
          <span className="text-[12px]">({formatPercent(pnlPercent, true)})</span>
        </div>
        <span className="text-[#64748B]">
          Since start: <span className="font-semibold text-[#11141C] font-mono">{formatUsd(portfolio.startingCapital)}</span>
        </span>
      </div>

      {/* Milestone Progress Sneak-peek */}
      <div
        onClick={onNavigateGoal}
        className="mt-6 pt-5 border-t border-[#F1F5F9] flex items-center justify-between cursor-pointer group hover:bg-[#F8FAFC] -mx-6 -mb-6 p-6 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F0F3FA] group-hover:bg-[#2F6BFF]/10 text-[#2F6BFF] flex items-center justify-center transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">
              Level 1 Milestone
            </div>
            <div className="text-[13px] font-bold text-[#11141C]">
              Target: {formatUsd(portfolio.nextMilestone)} (3x Goal)
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[13px] font-bold text-[#2F6BFF] font-mono">
            {Math.round(portfolio.milestoneProgress * 100)}%
          </span>
          <div className="text-[11px] text-[#64748B]">
            {formatUsd(portfolio.nextMilestone - portfolio.nav)} to go
          </div>
        </div>
      </div>
    </div>
  );
};
