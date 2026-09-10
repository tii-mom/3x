import React from 'react';
import { X, Cpu, ShieldCheck, CheckCircle, Activity, ExternalLink } from 'lucide-react';
import { AutopilotState } from '../types';

interface ReasoningModalProps {
  isOpen: boolean;
  onClose: () => void;
  autopilot: AutopilotState;
}

export const ReasoningModal: React.FC<ReasoningModalProps> = ({
  isOpen,
  onClose,
  autopilot,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[480px] bg-[#090B10] text-[#EFF0F8] rounded-[28px] p-6 shadow-2xl border border-white/10 relative max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#3AC8FF]/20 text-[#3AC8FF] flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-headline font-bold text-[18px] text-white">
                Autonomous Telemetry
              </h3>
              <span className="text-[10px] font-mono-data text-[#3AC8FF] px-2 py-0.5 rounded-full bg-[#3AC8FF]/10 border border-[#3AC8FF]/20">
                Live
              </span>
            </div>
            <p className="text-[12px] text-white/60">
              {autopilot.version} Real-time execution reasoning
            </p>
          </div>
        </div>

        {/* Metrics Box */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="bg-[#11151D] p-3 rounded-[16px] border border-white/5">
            <span className="text-[11px] font-mono-data text-white/40 block">Pair Allocation</span>
            <span className="text-[15px] font-bold text-white font-tabular">{autopilot.pair}</span>
          </div>
          <div className="bg-[#11151D] p-3 rounded-[16px] border border-white/5">
            <span className="text-[11px] font-mono-data text-white/40 block">Live APY</span>
            <span className="text-[15px] font-bold text-[#3AC8FF] font-tabular">
              {autopilot.currentApy}%
            </span>
          </div>
          <div className="bg-[#11151D] p-3 rounded-[16px] border border-white/5">
            <span className="text-[11px] font-mono-data text-white/40 block">Volatility</span>
            <span className="text-[15px] font-bold text-emerald-400 font-tabular">&lt;0.04% (Safe)</span>
          </div>
          <div className="bg-[#11151D] p-3 rounded-[16px] border border-white/5">
            <span className="text-[11px] font-mono-data text-white/40 block">Audit Status</span>
            <span className="text-[15px] font-bold text-white font-tabular flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#3AC8FF]" /> Verified
            </span>
          </div>
        </div>

        {/* Reasoning Pipeline Steps */}
        <div className="space-y-3 mb-6">
          <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono-data block">
            Execution Decision Pipeline
          </span>

          <div className="space-y-2.5">
            <div className="p-3 rounded-[14px] bg-[#11151D] border border-white/5 flex gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div className="text-[12px]">
                <strong className="text-white block font-medium">1. Real-Time Oracle Sync</strong>
                <span className="text-white/60 leading-relaxed">
                  Ingested sub-second pricing telemetry across DeDust &amp; STON.fi. No divergence detected.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-[14px] bg-[#11151D] border border-white/5 flex gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div className="text-[12px]">
                <strong className="text-white block font-medium">2. Strict Slippage Shield</strong>
                <span className="text-white/60 leading-relaxed">
                  Calculated transaction route with 0.018% expected impact, safely below the 0.05% institutional ceiling.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-[14px] bg-[#11151D] border border-white/5 flex gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div className="text-[12px]">
                <strong className="text-white block font-medium">3. Guardrail Enforcement</strong>
                <span className="text-white/60 leading-relaxed">
                  5.0% single action cap ($62.40 max) validated against $500.00 untouchable safe reserve floor.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TON Explorer link */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#3AC8FF]" />
            <span>Block #41,920,118 · TON Mainnet</span>
          </span>
          <span className="flex items-center gap-1 text-[#3AC8FF] hover:underline cursor-pointer">
            <span>tonscan.org</span>
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
