import React from 'react';
import { RiskProfile } from '../../types';
import { ShieldCheck } from 'lucide-react';

interface RiskBadgeProps {
  risk: RiskProfile;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ risk, className = '' }) => {
  const configs = {
    CONSERVATIVE: {
      label: 'CONSERVATIVE',
      color: 'text-[#00B074] bg-[#00B074]/10 border-[#00B074]/30',
    },
    BALANCED: {
      label: 'BALANCED',
      color: 'text-[#2F6BFF] bg-[#2F6BFF]/10 border-[#2F6BFF]/30',
    },
    GROWTH: {
      label: 'GROWTH',
      color: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
    },
  };

  const config = configs[risk] || configs.BALANCED;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold font-mono ${config.color} ${className}`}
    >
      <ShieldCheck className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
};
