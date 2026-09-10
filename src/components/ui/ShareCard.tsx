import React from 'react';
import { Bot, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { formatUsd } from '../../utils/formatters';

interface ShareCardProps {
  aspectRatio?: '1:1' | '9:16';
  startedAmount?: number;
  currentNav?: number;
  nextMilestone?: number;
  level?: number;
  autopilotStatus?: string;
  className?: string;
}

export const ShareCard: React.FC<ShareCardProps> = ({
  aspectRatio = '1:1',
  startedAmount = 100,
  currentNav = 184.28,
  nextMilestone = 300,
  level = 1,
  autopilotStatus = 'Running',
  className = '',
}) => {
  const isSquare = aspectRatio === '1:1';

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-[#090B10] text-white p-6 border border-white/10 shadow-2xl flex flex-col justify-between ${
        isSquare ? 'aspect-square w-full max-w-[360px]' : 'aspect-[9/16] w-full max-w-[340px] min-h-[540px]'
      } ${className}`}
    >
      {/* Background glow effects */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#3AC8FF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#2F6BFF]/25 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#2F6BFF] flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[13px] font-bold text-white font-headline tracking-tight">
              TON AI Wealth Agent
            </div>
            <div className="text-[10px] text-[#3AC8FF] font-mono">
              Autonomous Liquidity Engine
            </div>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
          Level 0{level}
        </span>
      </div>

      {/* Centerpiece NAV Metric */}
      <div className="relative z-10 my-auto text-center py-4 space-y-2">
        <div className="text-[11px] font-semibold text-white/60 tracking-wider uppercase font-mono">
          My Autonomous Wealth Journey
        </div>
        <div className="text-[40px] sm:text-[46px] font-black tracking-tight text-white font-headline">
          {formatUsd(currentNav)}
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00B074]/15 border border-[#00B074]/30 text-[#00B074] text-[12px] font-bold font-mono">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+{formatUsd(currentNav - startedAmount)} Growth</span>
        </div>
      </div>

      {/* Metric Breakdown Grid */}
      <div className="relative z-10 space-y-3">
        <div className="grid grid-cols-2 gap-2 bg-white/[0.04] p-3 rounded-2xl border border-white/10 text-[12px]">
          <div>
            <div className="text-[10px] text-white/50 uppercase font-mono">Started Principal</div>
            <div className="text-[15px] font-bold text-white font-mono">{formatUsd(startedAmount)}</div>
          </div>
          <div>
            <div className="text-[10px] text-white/50 uppercase font-mono">Next Milestone</div>
            <div className="text-[15px] font-bold text-[#3AC8FF] font-mono">{formatUsd(nextMilestone)}</div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] text-white/60 px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3AC8FF] animate-pulse" />
            Autopilot: <strong className="text-white font-semibold">{autopilotStatus}</strong>
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00B074]" />
            Non-Custodial
          </span>
        </div>
      </div>
    </div>
  );
};
