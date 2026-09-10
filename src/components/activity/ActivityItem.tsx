import React from 'react';
import { ActivityEvent } from '../../types';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  Eye,
  Flag,
  FileSearch,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { formatUsd } from '../../utils/formatters';

interface ActivityItemProps {
  event: ActivityEvent;
  onClick?: () => void;
  className?: string;
}

export const ActivityItemComponent: React.FC<ActivityItemProps> = ({
  event,
  onClick,
  className = '',
}) => {
  const getTypeBadge = () => {
    switch (event.type) {
      case 'INVESTED':
        return {
          icon: <ArrowUpRight className="w-4 h-4 text-[#2F6BFF]" />,
          bg: 'bg-[#2F6BFF]/10',
          label: 'Invested',
        };
      case 'EXITED':
        return {
          icon: <ArrowDownLeft className="w-4 h-4 text-[#F59E0B]" />,
          bg: 'bg-[#F59E0B]/10',
          label: 'Exited',
        };
      case 'PROTECTED':
        return {
          icon: <ShieldCheck className="w-4 h-4 text-[#00B074]" />,
          bg: 'bg-[#00B074]/10',
          label: 'Protected',
        };
      case 'OBSERVED':
        return {
          icon: <Eye className="w-4 h-4 text-[#64748B]" />,
          bg: 'bg-[#64748B]/10',
          label: 'Observed',
        };
      case 'RESEARCHED':
        return {
          icon: <FileSearch className="w-4 h-4 text-[#A855F7]" />,
          bg: 'bg-[#A855F7]/10',
          label: 'Researched',
        };
      case 'RISK_CHANGED':
        return {
          icon: <Zap className="w-4 h-4 text-[#3AC8FF]" />,
          bg: 'bg-[#3AC8FF]/10',
          label: 'Risk Config',
        };
      case 'MILESTONE':
        return {
          icon: <Flag className="w-4 h-4 text-[#2F6BFF]" />,
          bg: 'bg-[#2F6BFF]/15',
          label: 'Milestone',
        };
      default:
        return {
          icon: <ShieldCheck className="w-4 h-4 text-[#2F6BFF]" />,
          bg: 'bg-[#F0F3FA]',
          label: event.type,
        };
    }
  };

  const badge = getTypeBadge();

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl bg-white border border-[#E2E7F0] shadow-2xs hover:border-[#CBD5E1] transition-all flex items-center justify-between cursor-pointer ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${badge.bg}`}>
          {badge.icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-[14px] font-bold text-[#11141C]">{event.title}</h4>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B] font-semibold">
              {badge.label}
            </span>
          </div>
          <p className="text-[12px] text-[#64748B] mt-0.5 line-clamp-1">{event.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-3">
        <div className="text-right">
          {event.amount !== undefined && (
            <div className="text-[13px] font-bold text-[#11141C] font-mono">
              {formatUsd(event.amount)}
            </div>
          )}
          <div className="text-[11px] text-[#94A3B8] font-mono">{event.timestamp}</div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
      </div>
    </div>
  );
};
