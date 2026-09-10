import React from 'react';
import { PortfolioAllocation } from '../../types';

interface AllocationBarProps {
  allocation: PortfolioAllocation;
  className?: string;
  showLabels?: boolean;
}

export const AllocationBar: React.FC<AllocationBarProps> = ({
  allocation,
  className = '',
  showLabels = false,
}) => {
  const reservePct = Math.round(allocation.reserve * 100);
  const yieldPct = Math.round(allocation.yield * 100);
  const growthPct = Math.round(allocation.growth * 100);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Visual Multi-segment bar */}
      <div className="h-3 w-full rounded-full bg-[#F0F3FA] flex overflow-hidden p-0.5 gap-1">
        <div
          style={{ width: `${reservePct}%` }}
          className="bg-[#2F6BFF] h-full rounded-full transition-all duration-500"
          title={`Reserve: ${reservePct}%`}
        />
        <div
          style={{ width: `${yieldPct}%` }}
          className="bg-[#00B074] h-full rounded-full transition-all duration-500"
          title={`Yield: ${yieldPct}%`}
        />
        <div
          style={{ width: `${growthPct}%` }}
          className="bg-[#F59E0B] h-full rounded-full transition-all duration-500"
          title={`Growth: ${growthPct}%`}
        />
      </div>

      {showLabels && (
        <div className="flex items-center justify-between text-[11px] font-medium text-[#64748B] pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2F6BFF]"></span>
            Reserve {reservePct}%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00B074]"></span>
            Yield {yieldPct}%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
            Growth {growthPct}%
          </span>
        </div>
      )}
    </div>
  );
};
