import React from 'react';
import {
  Activity,
  Bot,
  ChevronRight,
  Eye,
  Pause,
  Play,
  Radar,
  Shield,
  Sparkles,
} from 'lucide-react';
import { AutopilotStatus } from '../../types';
import { agentStatusMessages } from './AgentStatus';
import { useAppStore } from '../../features/wallet/walletStore';

interface AutopilotCardProps {
  status: AutopilotStatus;
  onToggleStatus: () => void;
  onOpenReasoning?: () => void;
  onOpenScanner?: () => void;
  className?: string;
}

export const AutopilotCard: React.FC<AutopilotCardProps> = ({
  status,
  onToggleStatus,
  onOpenReasoning,
  onOpenScanner,
  className = '',
}) => {
  const { portfolio } = useAppStore();
  const isRunning = status === 'RUNNING';

  const statusDisplayMap: Record<AutopilotStatus, { label: string; desc: string; color: string }> = {
    RUNNING: {
      label: 'Running',
      desc: 'Your AI is monitoring opportunities.',
      color: '#3AC8FF',
    },
    OBSERVING: {
      label: 'Observing',
      desc: 'Scanning market depth and yield spreads.',
      color: '#3AC8FF',
    },
    RESEARCHING: {
      label: 'Researching',
      desc: 'Evaluating risk-adjusted pools.',
      color: '#A855F7',
    },
    REBALANCING: {
      label: 'Rebalancing',
      desc: 'Executing disciplined position adjustments.',
      color: '#00B074',
    },
    PROTECTING: {
      label: 'Protecting',
      desc: 'Capital preservation rules active.',
      color: '#F59E0B',
    },
    PAUSED: {
      label: 'Paused',
      desc: 'AI is idle. Your capital remains safe.',
      color: '#94A3B8',
    },
  };

  const currentDisplay = statusDisplayMap[status] || statusDisplayMap.RUNNING;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-[#090B10] text-white p-6 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)] ${className}`}
    >
      {/* Background Intelligence Halo */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#3AC8FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#2F6BFF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#3AC8FF] shadow-[0_0_15px_rgba(58,200,255,0.25)]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold tracking-tight text-white font-headline">
                AI Autopilot
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3AC8FF]/15 text-[#3AC8FF] border border-[#3AC8FF]/30 font-mono">
                {currentDisplay.label}
              </span>
            </div>
            <p className="text-[12px] text-white/60">Autonomous Wealth Agent</p>
          </div>
        </div>

        {/* Master Control Button */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleStatus}
            className={`px-3 py-1.5 rounded-xl font-semibold text-[12px] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              isRunning
                ? 'bg-white/10 hover:bg-white/15 text-white border border-white/20 active:scale-95'
                : 'bg-[#00B074] hover:bg-[#059669] text-white border border-transparent shadow-[0_0_20px_rgba(0,176,116,0.4)] active:scale-95'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause AI</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Autonomous Status Box */}
      <div className="relative z-10 mt-5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentDisplay.color }}
              />
              {isRunning && (
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-75"
                  style={{ backgroundColor: currentDisplay.color }}
                />
              )}
            </div>
            <div>
              <div className="text-[11px] text-white/50 uppercase font-mono tracking-wider">
                Current Activity
              </div>
              <div className="text-[13px] font-semibold text-white">
                {currentDisplay.desc}
              </div>
            </div>
          </div>

          {onOpenReasoning && (
            <button
              onClick={onOpenReasoning}
              className="text-[12px] font-semibold text-[#3AC8FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Why AI did this
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-white/60 pt-1 border-t border-white/5 font-mono">
          <span>Current mode: <strong className="text-white">Grow</strong></span>
          <span>Last review: <strong className="text-white">{portfolio.lastReviewMinutes || 8} min ago</strong></span>
        </div>
      </div>

      {/* Non-manual Telemetry Grid */}
      <div className="relative z-10 mt-4 grid grid-cols-3 gap-2.5">
        <div
          onClick={onOpenScanner}
          className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-1 text-[11px] text-white/50 group-hover:text-white/80">
            <Radar className="w-3.5 h-3.5 text-[#3AC8FF]" />
            <span className="truncate">Opportunities</span>
          </div>
          <div className="text-[16px] font-bold text-white font-mono mt-1">124 Live</div>
          <div className="text-[10px] text-[#00B074] mt-0.5">Monitored</div>
        </div>

        <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5">
          <div className="flex items-center gap-1 text-[11px] text-white/50">
            <Activity className="w-3.5 h-3.5 text-[#00B074]" />
            <span className="truncate">Current focus</span>
          </div>
          <div className="text-[15px] font-bold text-[#00B074] font-mono mt-1">Balanced</div>
          <div className="text-[10px] text-white/50 mt-0.5">Auto-compounding</div>
        </div>

        <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5">
          <div className="flex items-center gap-1 text-[11px] text-white/50">
            <Shield className="w-3.5 h-3.5 text-[#2F6BFF]" />
            <span className="truncate">Portfolio risk</span>
          </div>
          <div className="text-[15px] font-bold text-white font-mono mt-1">Balanced</div>
          <div className="text-[10px] text-[#00B074] mt-0.5">5% Max Action</div>
        </div>
      </div>
    </div>
  );
};
