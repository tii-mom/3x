import React, { useState } from 'react';
import { PortfolioCategoryData } from '../../types';
import { ChevronDown, ChevronUp, Layers, Sparkles } from 'lucide-react';
import { formatUsd } from '../../utils/formatters';

interface PortfolioCategoryProps {
  data: PortfolioCategoryData;
  defaultExpanded?: boolean;
  className?: string;
}

export const PortfolioCategory: React.FC<PortfolioCategoryProps> = ({
  data,
  defaultExpanded = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getCategoryTheme = () => {
    switch (data.category) {
      case 'RESERVE':
        return {
          pill: 'bg-[#2F6BFF]/10 text-[#2F6BFF]',
          bar: 'bg-[#2F6BFF]',
        };
      case 'YIELD':
        return {
          pill: 'bg-[#00B074]/10 text-[#00B074]',
          bar: 'bg-[#00B074]',
        };
      case 'GROWTH':
        return {
          pill: 'bg-[#F59E0B]/10 text-[#F59E0B]',
          bar: 'bg-[#F59E0B]',
        };
    }
  };

  const theme = getCategoryTheme();

  return (
    <div className={`bg-white rounded-3xl border border-[#E2E7F0] shadow-sm overflow-hidden transition-all ${className}`}>
      {/* Category Summary Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#F8FAFC] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold font-mono text-[14px] ${theme.pill}`}>
            {data.percentage}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-bold text-[#11141C] font-headline">{data.name}</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${theme.pill}`}>
                {data.category}
              </span>
            </div>
            <p className="text-[12px] text-[#64748B] mt-0.5 line-clamp-1">{data.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[15px] font-bold text-[#11141C] font-mono">
              {formatUsd(data.valueUsd)}
            </div>
            <div className="text-[11px] text-[#64748B]">
              {data.assets.length} positions
            </div>
          </div>
          <div className="text-[#64748B] p-1 rounded-full hover:bg-black/5">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Assets Breakdown */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-1 border-t border-[#F1F5F9] bg-[#FAFCFF] space-y-2.5 animate-fade-in">
          <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider py-1">
            Autonomous Asset Allocations
          </div>

          {data.assets.map((asset) => (
            <div
              key={asset.id}
              className="p-3.5 bg-white rounded-2xl border border-[#E2E7F0] flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F0F3FA] text-[#11141C] font-bold text-[12px] flex items-center justify-center font-mono">
                  {asset.symbol.slice(0, 3)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#11141C]">{asset.name}</span>
                    {asset.apy && (
                      <span className="text-[10px] font-mono font-bold bg-[#00B074]/10 text-[#00B074] px-1.5 py-0.5 rounded">
                        {asset.apy}% APY
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#64748B] flex items-center gap-2 mt-0.5 font-mono">
                    <span>{asset.amount}</span>
                    <span>•</span>
                    <span className="text-[#2F6BFF]">{asset.protocol}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[14px] font-bold text-[#11141C] font-mono">
                  {formatUsd(asset.valueUsd)}
                </div>
                <div className="text-[11px] text-[#64748B] font-mono">
                  {asset.sharePercent}% of portfolio
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
