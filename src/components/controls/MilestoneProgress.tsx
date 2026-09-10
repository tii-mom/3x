import React from 'react';
import { Goal } from '../../types';
import { Flag, Sparkles, TrendingUp } from 'lucide-react';
import { formatUsd } from '../../utils/formatters';

interface MilestoneProgressProps {
  goal: Goal;
  className?: string;
}

export const MilestoneProgress: React.FC<MilestoneProgressProps> = ({
  goal,
  className = '',
}) => {
  const progressPercent = Math.round(goal.progress * 100);
  const remaining = Math.max(0, goal.targetNav - goal.currentNav);

  return (
    <div className={`bg-white rounded-3xl p-5 border border-[#E2E7F0] shadow-sm space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#2F6BFF]/10 text-[#2F6BFF] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#11141C]">
              Level {goal.currentLevel} Goal Progress
            </h3>
            <p className="text-[11px] text-[#64748B]">Autonomous tripling trajectory</p>
          </div>
        </div>

        <span className="text-[13px] font-bold text-[#2F6BFF] font-mono bg-[#F0F3FA] px-2.5 py-1 rounded-full">
          {progressPercent}% Done
        </span>
      </div>

      {/* Progress Track */}
      <div className="space-y-1.5">
        <div className="h-3 w-full rounded-full bg-[#F0F3FA] overflow-hidden p-0.5">
          <div
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            className="h-full rounded-full bg-gradient-to-r from-[#2F6BFF] to-[#3AC8FF] transition-all duration-700 shadow-sm"
          />
        </div>

        <div className="flex justify-between text-[12px] font-mono text-[#64748B]">
          <span>Start: {formatUsd(goal.startingNav)}</span>
          <span className="font-bold text-[#11141C]">{formatUsd(goal.currentNav)}</span>
          <span className="text-[#2F6BFF] font-bold">Target: {formatUsd(goal.targetNav)}</span>
        </div>
      </div>

      {/* Distance Remaining Box */}
      <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E7F0] flex items-center justify-between text-[12px]">
        <span className="text-[#64748B] flex items-center gap-1.5">
          <Flag className="w-4 h-4 text-[#2F6BFF]" />
          Remaining to achieve milestone
        </span>
        <span className="font-bold text-[#11141C] font-mono">
          {formatUsd(remaining)}
        </span>
      </div>
    </div>
  );
};
