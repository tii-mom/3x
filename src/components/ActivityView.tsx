import React, { useState } from 'react';
import { ActivityItem } from '../types';
import { ArrowUpRight, TrendingUp, ShieldCheck, ArrowDownLeft, ExternalLink, Check, Copy } from 'lucide-react';

interface ActivityViewProps {
  activities: ActivityItem[];
  onBackToAI: () => void;
}

export const ActivityView: React.FC<ActivityViewProps> = ({ activities, onBackToAI }) => {
  const [filter, setFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = activities.filter((act) => {
    if (filter === 'all') return true;
    return act.category === filter;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'yield':
        return <TrendingUp className="w-4 h-4 text-[#006C48]" />;
      case 'rebalance':
        return <ArrowUpRight className="w-4 h-4 text-[#0051DF]" />;
      case 'guardrail':
        return <ShieldCheck className="w-4 h-4 text-[#006686]" />;
      case 'capital':
        return <ArrowDownLeft className="w-4 h-4 text-[#2F6BFF]" />;
      default:
        return <ArrowUpRight className="w-4 h-4 text-[#737687]" />;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline font-bold text-[20px] text-[#191C21]">Audit Activity</h2>
          <p className="text-[12px] text-[#434655]">Autonomous agent execution history</p>
        </div>
        <span className="font-mono-data text-[11px] text-[#006C48] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold">
          100% On-Chain
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {['all', 'yield', 'rebalance', 'guardrail', 'capital'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`py-1.5 px-3 rounded-full text-[12px] font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
              filter === cat
                ? 'bg-[#2F6BFF] text-white shadow-sm'
                : 'bg-[#F2F3FB] hover:bg-[#ECEDF5] text-[#434655] border border-[#C3C5D8]/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Activities List */}
      <div className="space-y-2.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-[18px] bg-white border border-[#C3C5D8]/30 shadow-[0_2px_6px_rgba(10,13,18,0.02)] flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-full bg-[#F2F3FB] flex items-center justify-center shrink-0 mt-0.5">
              {getIcon(item.category)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-[13px] text-[#191C21] truncate">{item.title}</h4>
                {item.amount && (
                  <span className="font-tabular font-bold text-[13px] text-[#006C48] shrink-0">
                    {item.amount}
                  </span>
                )}
              </div>

              <p className="text-[12px] text-[#434655] mt-0.5 leading-relaxed">{item.description}</p>

              <div className="mt-2 flex items-center justify-between text-[11px] text-[#737687]">
                <span className="font-mono-data">{item.timestamp}</span>

                <button
                  type="button"
                  onClick={() => handleCopy(item.id, item.txHash)}
                  className="font-mono-data flex items-center gap-1 hover:text-[#0051DF] cursor-pointer"
                  title="Copy transaction hash"
                >
                  <span>Tx: {item.txHash}</span>
                  {copiedId === item.id ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-60" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
