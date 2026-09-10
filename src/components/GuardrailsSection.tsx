import React from 'react';
import { ShieldCheck, Lock, Info, Shield, PauseCircle, PlayCircle } from 'lucide-react';
import { GuardrailsState } from '../types';

interface GuardrailsSectionProps {
  guardrails: GuardrailsState;
  currentValue: number;
  onOpenInfo: (topic: string) => void;
  onEmergencyHalt: () => void;
}

export const GuardrailsSection: React.FC<GuardrailsSectionProps> = ({
  guardrails,
  currentValue,
  onOpenInfo,
  onEmergencyHalt,
}) => {
  // Dynamically compute the single action max dollar amount
  const maxTxnAmount = (currentValue * (guardrails.maxCapPercent / 100)).toFixed(2);

  return (
    <section
      id="section-guardrails"
      className="rounded-[24px] bg-white p-6 border border-[#C3C5D8]/30 shadow-[0_2px_8px_rgba(10,13,18,0.02)] space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#F2F3FB] flex items-center justify-center text-[#006686]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-headline font-semibold text-[17px] text-[#191C21]">
              Institutional Guardrails
            </h3>
            <p className="text-[12px] text-[#434655]">Immutable smart contract limitations</p>
          </div>
        </div>
        <Lock className="w-5 h-5 text-[#737687]" />
      </div>

      {/* Guardrail 1: Max Single Action Cap */}
      <div className="p-3.5 rounded-[16px] bg-[#F2F3FB] border border-[#C3C5D8]/25 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-semibold text-[#191C21]">Max Single-Action Cap</span>
            <button
              type="button"
              onClick={() => onOpenInfo('single_action')}
              className="text-[#737687] hover:text-[#0051DF] cursor-pointer"
              title="Learn about single action exposure cap"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[12px] text-[#434655]">Limits single rebalance exposure</p>
        </div>
        <div className="text-right">
          <span className="font-tabular text-[15px] font-bold text-[#191C21]">
            {guardrails.maxCapPercent.toFixed(1)}%
          </span>
          <p className="font-mono-data text-[11px] text-[#434655]">Max ${maxTxnAmount} / txn</p>
        </div>
      </div>

      {/* Guardrail 2: Safe Reserve Minimum Floor */}
      <div className="p-3.5 rounded-[16px] bg-[#F2F3FB] border border-[#C3C5D8]/25 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-semibold text-[#191C21]">
              Safe Reserve Minimum Floor
            </span>
            <Shield className="w-3.5 h-3.5 text-[#006C48]" />
          </div>
          <p className="text-[12px] text-[#434655]">Inviolable untouchable cushion</p>
        </div>
        <div className="text-right">
          <span className="font-tabular text-[15px] font-bold text-[#191C21]">
            ${guardrails.safeReserveFloor.toFixed(2)}
          </span>
          <p className="font-mono-data text-[11px] text-[#006C48] font-semibold">Locked Floor</p>
        </div>
      </div>

      {/* Guardrail 3: Slippage & Execution Shield */}
      <div className="p-3.5 rounded-[16px] bg-[#F2F3FB] border border-[#C3C5D8]/25 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[13px] font-semibold text-[#191C21]">
            Slippage &amp; Volatility Guard
          </span>
          <p className="text-[12px] text-[#434655]">Strict Shield active</p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7BFABE] text-[#002113] font-mono-data text-[11px] font-bold">
            &lt;{guardrails.slippageMaxPercent.toFixed(2)}% Max
          </span>
        </div>
      </div>

      {/* Emergency Pause Single-Tap Button */}
      <button
        id="btn-emergency-pause"
        type="button"
        onClick={onEmergencyHalt}
        className={`w-full min-h-[44px] py-2.5 px-4 rounded-full border text-[13px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
          guardrails.isEmergencyPaused
            ? 'border-[#00885B]/40 bg-[#7BFABE]/20 hover:bg-[#7BFABE]/30 text-[#006C48]'
            : 'border-[#BA1A1A]/30 bg-[#FFDAD6]/20 hover:bg-[#FFDAD6]/40 text-[#BA1A1A]'
        }`}
      >
        {guardrails.isEmergencyPaused ? (
          <>
            <PlayCircle className="w-4 h-4" />
            <span>Resume Algorithmic Execution</span>
          </>
        ) : (
          <>
            <PauseCircle className="w-4 h-4" />
            <span>Emergency Pause Execution</span>
          </>
        )}
      </button>
    </section>
  );
};
