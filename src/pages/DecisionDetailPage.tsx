import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { useAppStore } from '../features/wallet/walletStore';
import { DecisionReasoning } from '../components/agent/DecisionReasoning';
import { EmptyState } from '../components/feedback/EmptyState';
import { formatUsd } from '../utils/formatters';

export const DecisionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activities } = useAppStore();

  const event = activities.find((a) => a.id === id) || activities[0];

  if (!event) {
    return (
      <EmptyState
        title="Decision Record Not Found"
        description="The requested AI decision record could not be located in local memory."
        actionText="Back to Activity"
        onAction={() => navigate('/app/activity')}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white border border-[#E2E7F0] flex items-center justify-center text-[#64748B] hover:text-[#11141C] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="text-[12px] font-mono text-[#64748B]">Decision Audit Log</div>
          <h1 className="text-[20px] sm:text-[22px] font-extrabold text-[#11141C] font-headline">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Decision Summary Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E7F0] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#090B10] text-[#3AC8FF] flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#64748B] uppercase">Decision Type</span>
              <div className="text-[14px] font-bold text-[#11141C]">{event.type}</div>
            </div>
          </div>

          <div className="text-right">
            {event.amount && (
              <div className="text-[16px] font-bold text-[#11141C] font-mono">
                {formatUsd(event.amount)}
              </div>
            )}
            <div className="text-[11px] font-mono text-[#64748B]">{event.timestamp}</div>
          </div>
        </div>

        <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E7F0] text-[13.5px] text-[#334155] leading-relaxed">
          {event.description}
        </div>
      </div>

      {/* Layered Disclosure Reasoning Component */}
      <DecisionReasoning event={event} />
    </div>
  );
};
