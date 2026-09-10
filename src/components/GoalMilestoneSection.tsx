import React from 'react';
import { Flag, ArrowRight, Edit3 } from 'lucide-react';
import { MilestoneState, StrategyOperationalMode, ReinvestmentRule } from '../types';

interface GoalMilestoneSectionProps {
  milestone: MilestoneState;
  onSelectStrategy: (mode: StrategyOperationalMode) => void;
  onSelectReinvestment: (rule: ReinvestmentRule) => void;
  onEditTarget: () => void;
}

export const GoalMilestoneSection: React.FC<GoalMilestoneSectionProps> = ({
  milestone,
  onSelectStrategy,
  onSelectReinvestment,
  onEditTarget,
}) => {
  // Calculate percentage complete
  const range = milestone.targetValue - milestone.originValue;
  const progress = Math.max(
    0,
    Math.min(100, ((milestone.currentValue - milestone.originValue) / (range || 1)) * 100)
  );

  const formattedCurrent = milestone.currentValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const formattedOrigin = milestone.originValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const formattedTarget = milestone.targetValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <section
      id="section-goal-milestone"
      className="rounded-[24px] bg-white p-6 border border-[#C3C5D8]/30 shadow-[0_2px_8px_rgba(10,13,18,0.02)] space-y-5"
    >
      {/* Milestone Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#F2F3FB] flex items-center justify-center text-[#0051DF]">
            <Flag className="w-4 h-4" />
          </div>
          <h3 className="font-headline font-semibold text-[17px] text-[#191C21]">
            Goal &amp; Milestone Engine
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#C0E8FF] text-[#004D66] font-mono-data text-[11px] font-semibold">
          Step {milestone.step} of {milestone.totalSteps}
        </span>
      </div>

      {/* Progress Progression Pathway */}
      <div className="p-4 rounded-[18px] bg-[#F2F3FB]/70 border border-[#C3C5D8]/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono-data text-[11px] text-[#434655]">Current Value:</span>
            <span className="font-tabular text-[15px] text-[#191C21] font-bold">
              {formattedCurrent}
            </span>
          </div>
          <span className="font-mono-data text-[11px] text-[#0051DF] font-bold">
            {progress.toFixed(1)}% Complete
          </span>
        </div>

        {/* Dual Endpoint Milestone Track */}
        <div className="relative w-full h-3 bg-[#ECEDF5] rounded-full overflow-hidden mb-2.5">
          <div
            className="absolute left-0 top-0 h-full bg-[#0051DF] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-[#434655] font-tabular text-[12px]">
          <span className="flex items-center gap-1 text-[#434655]">
            <span className="text-[11px]">Origin:</span>
            <strong className="text-[#191C21] font-semibold">{formattedOrigin}</strong>
          </span>

          <ArrowRight className="w-3.5 h-3.5 text-[#C3C5D8]" />

          <button
            type="button"
            onClick={onEditTarget}
            className="flex items-center gap-1 text-[#0051DF] hover:underline cursor-pointer group"
            title="Edit target goal"
          >
            <span className="text-[11px]">Target:</span>
            <strong className="text-[#0051DF] font-semibold">{formattedTarget}</strong>
            <Edit3 className="w-3 h-3 opacity-60 group-hover:opacity-100 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Strategy Mode Selector */}
      <div>
        <label className="block text-[12px] font-semibold text-[#434655] mb-2">
          Strategy Operational Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          {/* Grow Mode */}
          <button
            type="button"
            onClick={() => onSelectStrategy('grow')}
            className={`py-2.5 px-2 rounded-[14px] text-[11px] text-center transition-all cursor-pointer ${
              milestone.strategyMode === 'grow'
                ? 'bg-[#2F6BFF] text-white shadow-[0_2px_6px_rgba(47,107,255,0.25)] border border-[#0051DF]'
                : 'bg-[#F2F3FB] hover:bg-[#ECEDF5] text-[#191C21] border border-[#C3C5D8]/30'
            }`}
          >
            <span className="block font-bold">Grow Mode</span>
            <span
              className={`text-[10px] block ${
                milestone.strategyMode === 'grow' ? 'text-white/80' : 'text-[#434655]'
              }`}
            >
              Default (Aggressive)
            </span>
          </button>

          {/* Preserve & Harvest */}
          <button
            type="button"
            onClick={() => onSelectStrategy('preserve')}
            className={`py-2.5 px-2 rounded-[14px] text-[11px] text-center transition-all cursor-pointer ${
              milestone.strategyMode === 'preserve'
                ? 'bg-[#2F6BFF] text-white shadow-[0_2px_6px_rgba(47,107,255,0.25)] border border-[#0051DF]'
                : 'bg-[#F2F3FB] hover:bg-[#ECEDF5] text-[#191C21] border border-[#C3C5D8]/30'
            }`}
          >
            <span className="block font-bold">Preserve</span>
            <span
              className={`text-[10px] block ${
                milestone.strategyMode === 'preserve' ? 'text-white/80' : 'text-[#434655]'
              }`}
            >
              &amp; Harvest
            </span>
          </button>

          {/* Shielded Fixed Staking */}
          <button
            type="button"
            onClick={() => onSelectStrategy('shielded')}
            className={`py-2.5 px-2 rounded-[14px] text-[11px] text-center transition-all cursor-pointer ${
              milestone.strategyMode === 'shielded'
                ? 'bg-[#2F6BFF] text-white shadow-[0_2px_6px_rgba(47,107,255,0.25)] border border-[#0051DF]'
                : 'bg-[#F2F3FB] hover:bg-[#ECEDF5] text-[#191C21] border border-[#C3C5D8]/30'
            }`}
          >
            <span className="block font-bold">Shielded</span>
            <span
              className={`text-[10px] block ${
                milestone.strategyMode === 'shielded' ? 'text-white/80' : 'text-[#434655]'
              }`}
            >
              Fixed Staking
            </span>
          </button>
        </div>
      </div>

      {/* Reinvestment & Profit Handling */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-semibold text-[#434655]">
            Reinvestment &amp; Profit Rule
          </span>
          <span className="font-mono-data text-[11px] text-[#006C48] font-medium">
            Daily Compounding
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {/* Auto-Compound */}
          <button
            type="button"
            onClick={() => onSelectReinvestment('auto-compound')}
            className={`py-2.5 px-2 rounded-[14px] text-[11px] text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
              milestone.reinvestmentRule === 'auto-compound'
                ? 'bg-[#E1E2EA]/80 border-2 border-[#0051DF] text-[#191C21]'
                : 'bg-[#F2F3FB] hover:bg-[#ECEDF5] text-[#191C21] border border-[#C3C5D8]/30'
            }`}
          >
            <span
              className={`font-bold ${
                milestone.reinvestmentRule === 'auto-compound' ? 'text-[#0051DF]' : 'text-[#191C21]'
              }`}
            >
              Auto-Compound
            </span>
            <span className="text-[9px] text-[#434655] font-normal">100% Retained</span>
          </button>

          {/* Take to USDT */}
          <button
            type="button"
            onClick={() => onSelectReinvestment('take-usdt')}
            className={`py-2.5 px-2 rounded-[14px] text-[11px] text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
              milestone.reinvestmentRule === 'take-usdt'
                ? 'bg-[#E1E2EA]/80 border-2 border-[#0051DF] text-[#191C21]'
                : 'bg-[#F2F3FB] hover:bg-[#ECEDF5] text-[#191C21] border border-[#C3C5D8]/30'
            }`}
          >
            <span
              className={`font-bold ${
                milestone.reinvestmentRule === 'take-usdt' ? 'text-[#0051DF]' : 'text-[#191C21]'
              }`}
            >
              Take to USDT
            </span>
            <span className="text-[9px] text-[#434655] font-normal">Stash in Vault</span>
          </button>

          {/* Split 50/50 */}
          <button
            type="button"
            onClick={() => onSelectReinvestment('split-50-50')}
            className={`py-2.5 px-2 rounded-[14px] text-[11px] text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
              milestone.reinvestmentRule === 'split-50-50'
                ? 'bg-[#E1E2EA]/80 border-2 border-[#0051DF] text-[#191C21]'
                : 'bg-[#F2F3FB] hover:bg-[#ECEDF5] text-[#191C21] border border-[#C3C5D8]/30'
            }`}
          >
            <span
              className={`font-bold ${
                milestone.reinvestmentRule === 'split-50-50' ? 'text-[#0051DF]' : 'text-[#191C21]'
              }`}
            >
              Split 50/50
            </span>
            <span className="text-[9px] text-[#434655] font-normal">Balanced yield</span>
          </button>
        </div>
      </div>
    </section>
  );
};
