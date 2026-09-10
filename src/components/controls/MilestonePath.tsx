import React from 'react';
import { Goal } from '../../types';
import { CheckCircle2, Circle, Flag, Lock } from 'lucide-react';
import { formatUsd } from '../../utils/formatters';

interface MilestonePathProps {
  goal: Goal;
  onSelectLevel?: (level: number) => void;
  className?: string;
}

export const MilestonePath: React.FC<MilestonePathProps> = ({
  goal,
  onSelectLevel,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-[13px] font-bold text-[#11141C] uppercase tracking-wider">
          Milestone Sequence
        </h4>
        <span className="text-[12px] text-[#64748B]">Geometric 3x Scale</span>
      </div>

      <div className="space-y-2.5">
        {goal.levels.map((item) => {
          const isCurrent = item.level === goal.currentLevel;
          const isPassed = item.target <= goal.currentNav;

          return (
            <div
              key={item.level}
              onClick={() => onSelectLevel && onSelectLevel(item.level)}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                isCurrent
                  ? 'bg-white border-[#2F6BFF] shadow-md ring-2 ring-[#2F6BFF]/10'
                  : isPassed
                  ? 'bg-white border-[#00B074]/30'
                  : 'bg-[#F8FAFC] border-[#E2E7F0] opacity-80'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[13px] font-mono ${
                    isCurrent
                      ? 'bg-[#2F6BFF] text-white shadow-sm'
                      : isPassed
                      ? 'bg-[#00B074] text-white'
                      : 'bg-[#E2E7F0] text-[#64748B]'
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-5 h-5" /> : `0${item.level}`}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#11141C]">
                      {item.label}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#F0F3FA] text-[#2F6BFF] font-semibold">
                      {item.multiplier}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#64748B]">
                    Target Net Asset Value: <span className="font-semibold text-[#11141C] font-mono">{formatUsd(item.target)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                {isCurrent ? (
                  <span className="text-[12px] font-bold text-[#2F6BFF] bg-[#2F6BFF]/10 px-2.5 py-1 rounded-full">
                    In Progress
                  </span>
                ) : isPassed ? (
                  <span className="text-[12px] font-bold text-[#00B074] bg-[#00B074]/10 px-2.5 py-1 rounded-full">
                    Achieved
                  </span>
                ) : (
                  <span className="text-[12px] font-medium text-[#94A3B8] flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
