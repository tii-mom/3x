import React from 'react';
import { Lock, Shield, ShieldCheck, Zap } from 'lucide-react';
import { formatUsd } from '../../utils/formatters';

interface ProtectionCardProps {
  safeFloor?: number;
  maxCapPercent?: number;
  slippage?: number;
  onEmergencyHalt?: () => void;
  className?: string;
}

export const ProtectionCard: React.FC<ProtectionCardProps> = ({
  safeFloor = 32.0,
  maxCapPercent = 5.0,
  slippage = 0.05,
  onEmergencyHalt,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-3xl p-5 border border-[#E2E7F0] shadow-sm space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#00B074]/10 text-[#00B074] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#11141C]">Institutional Guardrails</h3>
            <p className="text-[11px] text-[#64748B]">Hardcoded sub-wallet safety bounds</p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-[#00B074] bg-[#00B074]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Enforced
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E7F0]">
          <div className="text-[11px] text-[#64748B]">Action Cap</div>
          <div className="text-[15px] font-bold text-[#11141C] font-mono mt-0.5">{maxCapPercent}%</div>
          <div className="text-[10px] text-[#64748B]">Per rebalance</div>
        </div>

        <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E7F0]">
          <div className="text-[11px] text-[#64748B]">Safe Floor</div>
          <div className="text-[15px] font-bold text-[#00B074] font-mono mt-0.5">{formatUsd(safeFloor)}</div>
          <div className="text-[10px] text-[#00B074]">Untouchable</div>
        </div>

        <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E7F0]">
          <div className="text-[11px] text-[#64748B]">Slippage Max</div>
          <div className="text-[15px] font-bold text-[#11141C] font-mono mt-0.5">&lt; {slippage}%</div>
          <div className="text-[10px] text-[#64748B]">Zero sandwich</div>
        </div>
      </div>

      <div className="p-3 bg-[#F0F3FA] rounded-2xl text-[12px] text-[#334155] flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-[#2F6BFF] shrink-0 mt-0.5" />
        <span>
          <strong>100% Primary Wallet Isolation:</strong> The AI Agent can never touch your main wallet balance or sign arbitrary messages.
        </span>
      </div>
    </div>
  );
};
