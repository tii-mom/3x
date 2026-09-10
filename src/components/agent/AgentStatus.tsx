import React from 'react';
import { AutopilotStatus } from '../../types';
import { AlertCircle, Eye, Loader2, PauseCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface AgentStatusProps {
  status: AutopilotStatus;
  className?: string;
  showDescription?: boolean;
}

export const agentStatusMessages: Record<AutopilotStatus, string> = {
  RUNNING: 'Your AI is monitoring the market.',
  OBSERVING: 'No action needed right now.',
  RESEARCHING: 'Your AI is evaluating a new opportunity.',
  REBALANCING: 'Your portfolio is being adjusted.',
  PROTECTING: 'AI is reducing risk.',
  PAUSED: 'No new investments will be opened.',
};

export const AgentStatus: React.FC<AgentStatusProps> = ({
  status,
  className = '',
  showDescription = true,
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'RUNNING':
        return {
          bg: 'bg-[#3AC8FF]/10',
          text: 'text-[#3AC8FF]',
          border: 'border-[#3AC8FF]/30',
          dot: 'bg-[#3AC8FF]',
          icon: <Sparkles className="w-3.5 h-3.5 animate-pulse" />,
        };
      case 'OBSERVING':
        return {
          bg: 'bg-[#2F6BFF]/10',
          text: 'text-[#2F6BFF]',
          border: 'border-[#2F6BFF]/30',
          dot: 'bg-[#2F6BFF]',
          icon: <Eye className="w-3.5 h-3.5" />,
        };
      case 'RESEARCHING':
        return {
          bg: 'bg-[#A855F7]/10',
          text: 'text-[#A855F7]',
          border: 'border-[#A855F7]/30',
          dot: 'bg-[#A855F7]',
          icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
        };
      case 'REBALANCING':
        return {
          bg: 'bg-[#F59E0B]/10',
          text: 'text-[#F59E0B]',
          border: 'border-[#F59E0B]/30',
          dot: 'bg-[#F59E0B]',
          icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
        };
      case 'PROTECTING':
        return {
          bg: 'bg-[#00B074]/10',
          text: 'text-[#00B074]',
          border: 'border-[#00B074]/30',
          dot: 'bg-[#00B074]',
          icon: <ShieldAlert className="w-3.5 h-3.5" />,
        };
      case 'PAUSED':
        return {
          bg: 'bg-[#64748B]/10',
          text: 'text-[#64748B]',
          border: 'border-[#64748B]/30',
          dot: 'bg-[#64748B]',
          icon: <PauseCircle className="w-3.5 h-3.5" />,
        };
      default:
        return {
          bg: 'bg-[#64748B]/10',
          text: 'text-[#64748B]',
          border: 'border-[#64748B]/30',
          dot: 'bg-[#64748B]',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[12px] font-semibold ${badge.bg} ${badge.text} ${badge.border}`}
      >
        <span className={`w-2 h-2 rounded-full ${badge.dot} ${status === 'RUNNING' ? 'animate-pulse' : ''}`} />
        <span>{status}</span>
        {badge.icon}
      </div>

      {showDescription && (
        <p className="text-[13px] text-[#64748B] font-medium leading-normal">
          {agentStatusMessages[status]}
        </p>
      )}
    </div>
  );
};
