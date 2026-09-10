import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityTimeline } from '../components/activity/ActivityTimeline';
import { useAppStore } from '../features/wallet/walletStore';
import { Activity } from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const { activities } = useAppStore();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#11141C] font-headline tracking-tight">
          Audit & Activity Logs
        </h1>
        <p className="text-[13px] text-[#64748B]">
          Verifiable on-chain decisions, rebalances, and protective actions taken by your AI.
        </p>
      </div>

      <ActivityTimeline
        activities={activities}
        onSelectEvent={(event) => navigate(`/app/decision/${event.id}`)}
      />
    </div>
  );
};
