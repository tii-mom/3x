import React from 'react';
import { ActivityEvent } from '../../types';
import { ArrowRight, Bot, ShieldCheck, Sparkles } from 'lucide-react';

interface LatestDecisionCardProps {
  decision?: ActivityEvent;
  onViewDetails?: () => void;
  className?: string;
}

export const LatestDecisionCard: React.FC<LatestDecisionCardProps> = ({
  decision,
  onViewDetails,
  className = '',
}) => {
  if (!decision) return null;

  return (
    <div className={`bg-white rounded-3xl p-5 border border-[#E2E7F0] shadow-sm space-y-3.5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#090B10] text-[#3AC8FF] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Latest AI Decision
            </span>
            <div className="text-[14px] font-bold text-[#11141C]">
              {decision.title}
            </div>
          </div>
        </div>

        <span className="text-[11px] font-mono text-[#64748B] bg-[#F0F3FA] px-2 py-0.5 rounded-full">
          {decision.timestamp}
        </span>
      </div>

      <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E7F0] text-[13px] text-[#334155] leading-relaxed">
        {decision.description}
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2 text-[12px] text-[#00B074] font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>Executed safely within 5% risk cap</span>
        </div>

        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-[12px] font-bold text-[#2F6BFF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Why AI did this
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
