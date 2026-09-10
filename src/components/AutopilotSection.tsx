import React from 'react';
import { Zap, Cpu, ShieldCheck } from 'lucide-react';
import { AutopilotState, GuardrailsState } from '../types';

interface AutopilotSectionProps {
  autopilot: AutopilotState;
  guardrails: GuardrailsState;
  onToggleAutopilot: () => void;
  onOpenReasoning: () => void;
  onOpenPools: () => void;
}

export const AutopilotSection: React.FC<AutopilotSectionProps> = ({
  autopilot,
  guardrails,
  onToggleAutopilot,
  onOpenReasoning,
  onOpenPools,
}) => {
  const isEffectivelyActive = autopilot.isActive && !guardrails.isEmergencyPaused;

  return (
    <section
      id="section-autopilot"
      className="rounded-[28px] bg-[#090B10] text-[#EFF0F8] p-6 border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.35)] relative overflow-hidden transition-all"
    >
      {/* Ambient radial glow behind AI engine */}
      <div className="absolute -top-24 -right-24 w-52 h-52 bg-[#3AC8FF]/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Telemetry Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              isEffectivelyActive
                ? 'bg-[#3AC8FF] shadow-[0_0_8px_#3AC8FF]'
                : 'bg-amber-400/80 shadow-[0_0_6px_#f59e0b]'
            }`}
          ></span>
          <span
            className={`font-mono-data text-[11px] tracking-wider uppercase font-semibold transition-colors ${
              isEffectivelyActive ? 'text-[#3AC8FF]' : 'text-amber-400'
            }`}
          >
            {isEffectivelyActive
              ? 'Autonomous Agent Active'
              : guardrails.isEmergencyPaused
              ? 'Agent Halted (Emergency)'
              : 'Autonomous Agent Paused'}
          </span>
        </div>
        <span className="text-[11px] font-mono-data text-white/50 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
          {autopilot.version}
        </span>
      </div>

      {/* Engine Title & Toggle */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="font-headline text-[24px] leading-[32px] text-white font-bold tracking-tight">
            Autopilot Engine
          </h2>
          <p className="text-[13px] leading-[18px] text-white/70 mt-1 max-w-[260px]">
            Disciplined allocation active across TON ecosystem liquidity vaults.
          </p>
        </div>

        {/* Master State Toggle Control */}
        <div className="flex flex-col items-end">
          <button
            id="autopilot-toggle"
            type="button"
            role="switch"
            aria-checked={autopilot.isActive}
            onClick={onToggleAutopilot}
            disabled={guardrails.isEmergencyPaused}
            className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              guardrails.isEmergencyPaused
                ? 'bg-red-950/60 opacity-60 cursor-not-allowed'
                : autopilot.isActive
                ? 'bg-[#2F6BFF]'
                : 'bg-[#2A303C]'
            }`}
          >
            <span className="sr-only">Toggle Autopilot Engine</span>
            <span
              className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                autopilot.isActive && !guardrails.isEmergencyPaused
                  ? 'translate-x-6'
                  : 'translate-x-0'
              }`}
            >
              <Zap
                className={`w-4 h-4 transition-colors ${
                  autopilot.isActive && !guardrails.isEmergencyPaused
                    ? 'text-[#0051DF]'
                    : 'text-[#737687]'
                }`}
              />
            </span>
          </button>
          <span className="font-mono-data text-[10px] text-white/40 mt-1 uppercase tracking-wider">
            {guardrails.isEmergencyPaused
              ? 'Safety Locked'
              : autopilot.isActive
              ? 'Tap to Pause'
              : 'Tap to Resume'}
          </span>
        </div>
      </div>

      {/* Telemetry Data Grid */}
      <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={onOpenPools}
          className="bg-[#11151D] hover:bg-[#181E29] rounded-[16px] p-3 border border-white/5 flex flex-col justify-between text-left transition-all cursor-pointer group"
        >
          <span className="font-mono-data text-[11px] text-white/40 group-hover:text-white/60">
            Market Scanner
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-tabular text-[16px] text-white font-semibold">
              {autopilot.poolsLive}
            </span>
            <span className="text-[12px] text-white/60">Pools Live</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenReasoning}
          className="bg-[#11151D] hover:bg-[#181E29] rounded-[16px] p-3 border border-white/5 flex flex-col justify-between text-left transition-all cursor-pointer group"
        >
          <span className="font-mono-data text-[11px] text-white/40 group-hover:text-white/60 flex items-center gap-1">
            <span>Audit Telemetry</span>
            <ShieldCheck className="w-3 h-3 text-[#3AC8FF]" />
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-tabular text-[16px] text-[#3AC8FF] font-semibold">
              {autopilot.lastAuditMinutesAgo}m ago
            </span>
            <span className="text-[12px] text-white/60">Verified</span>
          </div>
        </button>
      </div>

      {/* Live Autonomous Reasoning Snippet */}
      <button
        type="button"
        onClick={onOpenReasoning}
        className="mt-4 w-full bg-[#11151D] hover:bg-[#181E29] rounded-[14px] p-3 border border-white/5 flex items-center gap-3 text-left transition-all cursor-pointer group"
        title="View Autonomous Decision Tree"
      >
        <div className="w-8 h-8 rounded-lg bg-[#3AC8FF]/10 flex items-center justify-center shrink-0">
          <Cpu className="w-4 h-4 text-[#3AC8FF] group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex-1">
          <p className="text-[12px] leading-tight text-white/80 group-hover:text-white line-clamp-2">
            {autopilot.reasoningSnippet}
          </p>
        </div>
      </button>
    </section>
  );
};
