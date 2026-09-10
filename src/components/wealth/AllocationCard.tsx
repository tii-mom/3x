import React from 'react';
import { ArrowRight, PieChart } from 'lucide-react';
import { PortfolioAllocation } from '../../types';
import { AllocationBar } from './AllocationBar';
import { formatUsd } from '../../utils/formatters';

interface AllocationCardProps {
  totalNav: number;
  allocation: PortfolioAllocation;
  onExplorePortfolio?: () => void;
  className?: string;
}

export const AllocationCard: React.FC<AllocationCardProps> = ({
  totalNav,
  allocation,
  onExplorePortfolio,
  className = '',
}) => {
  const reserveUsd = totalNav * allocation.reserve;
  const yieldUsd = totalNav * allocation.yield;
  const growthUsd = totalNav * allocation.growth;

  return (
    <div className={`bg-white rounded-3xl p-5 border border-[#E2E7F0] shadow-sm space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#F0F3FA] text-[#2F6BFF] flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#11141C]">My Assets</h3>
            <p className="text-[11px] text-[#64748B]">Organized into Reserve, Yield & Growth</p>
          </div>
        </div>

        {onExplorePortfolio && (
          <button
            onClick={onExplorePortfolio}
            className="text-[12px] font-semibold text-[#2F6BFF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            All Assets
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <AllocationBar allocation={allocation} showLabels={false} />

      {/* 3 Categories columns */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
        <div className="bg-[#F8FAFC] rounded-2xl p-2.5 border border-[#E2E7F0]">
          <div className="text-[11px] font-medium text-[#64748B] flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF]"></span>
            Reserve
          </div>
          <div className="text-[13px] font-bold text-[#11141C] font-mono mt-0.5">
            {formatUsd(reserveUsd)}
          </div>
          <div className="text-[10px] text-[#64748B] font-mono">Lower risk</div>
        </div>

        <div className="bg-[#F8FAFC] rounded-2xl p-2.5 border border-[#E2E7F0]">
          <div className="text-[11px] font-medium text-[#64748B] flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00B074]"></span>
            Yield
          </div>
          <div className="text-[13px] font-bold text-[#11141C] font-mono mt-0.5">
            {formatUsd(yieldUsd)}
          </div>
          <div className="text-[10px] text-[#00B074] font-semibold font-mono">Ongoing yield</div>
        </div>

        <div className="bg-[#F8FAFC] rounded-2xl p-2.5 border border-[#E2E7F0]">
          <div className="text-[11px] font-medium text-[#64748B] flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
            Growth
          </div>
          <div className="text-[13px] font-bold text-[#11141C] font-mono mt-0.5">
            {formatUsd(growthUsd)}
          </div>
          <div className="text-[10px] text-[#64748B] font-mono">Higher growth</div>
        </div>
      </div>
    </div>
  );
};
