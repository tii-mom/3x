import React, { useState } from 'react';
import { useAgentStore } from '../services/agentService';
import { Activity, Zap, PlayCircle, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ActivityPageV3: React.FC = () => {
  const { activity } = useAgentStore();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = activity.filter((act) => {
    if (filterType === 'ALL') return true;
    return act.type === filterType;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'TASK_COMPLETED':
        return <Activity className="w-4 h-4 text-emerald-600" />;
      case 'OPPORTUNITY_EVALUATED':
        return <Cpu className="w-4 h-4 text-blue-600" />;
      case 'SKILL_BOUND':
        return <Cpu className="w-4 h-4 text-purple-600" />;
      case 'ENERGY_CONSUMED':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'SECURITY_ACTION':
      default:
        return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Activity & Audit Timeline</h1>
          <p className="text-xs text-slate-500">
            Immutable log of all autonomous decisions, energy expenditures, and economic settlements
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {['ALL', 'TASK_COMPLETED', 'OPPORTUNITY_EVALUATED', 'SKILL_BOUND', 'SECURITY_ACTION'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterType === type
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {type === 'ALL' ? 'All Events' : type.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80 space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">No events found for this filter.</div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                  {getEventIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">• {item.timestamp}</span>
                    {item.isSimulation ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        SIMULATION
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        TESTNET
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl">
                    {item.summary}
                  </p>

                  {/* Financial & Energy Badges */}
                  <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                    {item.deltaMoney && (
                      <span
                        className={`font-bold ${
                          item.deltaMoney.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {item.deltaMoney.amount >= 0 ? '+' : ''}
                        {item.deltaMoney.amount} {item.deltaMoney.asset}
                      </span>
                    )}
                    {item.deltaEnergy !== undefined && (
                      <span className="text-amber-600 font-medium">
                        {item.deltaEnergy}⚡ Energy
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Replay Button if Trace exists */}
              {item.traceId && (
                <div className="flex items-center justify-end">
                  <Link
                    to={`/app/trace/${item.traceId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-blue-600 border border-slate-200 text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Replay Trace</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
