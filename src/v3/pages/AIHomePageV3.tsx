import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAgentStore } from '../services/agentService';
import { LivingBrain } from '../components/LivingBrain';
import { Bot, Zap, TrendingUp, Sparkles, Play, Pause, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export const AIHomePageV3: React.FC = () => {
  const navigate = useNavigate();
  const {
    data,
    opportunities,
    togglePause,
    executeOpportunitySimulation,
    isActivatedTestnet,
  } = useAgentStore();

  const { agent, currentTrace, environment } = data;
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateWork = async () => {
    setIsSimulating(true);
    try {
      // Pick next open opportunity or default
      const opp = opportunities[0];
      await executeOpportunitySimulation(opp.id);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Primary AI Status Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-card border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-3xl shadow-sm">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">{agent.name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  {agent.generation}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {agent.level}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    agent.state === 'WORKING'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : agent.state === 'PAUSED'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      agent.state === 'WORKING' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span>{agent.statusLabel}</span>
                </span>
                <span className="text-xs text-slate-400">• Zero idle compute</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Pause / Testnet Activation) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePause}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                agent.state === 'PAUSED'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {agent.state === 'PAUSED' ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume AI</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Agent</span>
                </>
              )}
            </button>

            {!isActivatedTestnet && (
              <Link
                to="/activate"
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Go On-Chain</span>
              </Link>
            )}
          </div>
        </div>

        {/* 2. Today's Qualified Net Earnings & Energy Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          {/* Today Net */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Today Net Output
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black tabular-nums tracking-tight text-emerald-600">
                +{agent.today.net}
              </span>
              <span className="text-[11px] font-bold text-slate-500">{agent.today.asset}</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Earned +{agent.today.earned} / Cost -{agent.today.spent}
            </span>
          </div>

          {/* Energy Gauge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Premium Energy
              </span>
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black tabular-nums tracking-tight text-slate-900">
                {agent.energy.premiumPct}%
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                ({agent.energy.usedToday}⚡ used)
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Base Energy: {agent.energy.basePct}% (Free daily)
            </span>
          </div>

          {/* Qualified Growth */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Growth Multiple
              </span>
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black tabular-nums tracking-tight text-blue-600">
                {agent.qualifiedGrowthMultiple.toFixed(2)}X
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Target: {agent.nextMilestone}X Evolution
            </span>
          </div>

          {/* Installed Circuits */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Active Skills
              </span>
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black tabular-nums tracking-tight text-slate-900">
                {agent.skills.filter((s) => s.bound).length}
              </span>
              <span className="text-[11px] font-medium text-slate-500">circuits</span>
            </div>
            <Link to="/app/skills" className="text-[10px] text-blue-600 hover:underline block mt-1 font-medium">
              Manage slots →
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Live Work & Opportunity Simulation Trigger */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Current Work & Opportunity Dispatch</span>
              {environment === 'simulation' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                  Paper Sandbox
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Value Router assesses network tasks. Premium Energy is only spent when expected net value is positive.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSimulateWork}
            disabled={isSimulating || agent.state === 'PAUSED'}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-blue-glow transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Evaluating Circuit...' : 'Run Opportunity Evaluation'}</span>
          </button>
        </div>

        {/* Current Live Brain Visualizer */}
        <LivingBrain
          trace={currentTrace}
          onReplay={() => {
            if (currentTrace) {
              navigate(`/app/trace/${currentTrace.id}`);
            }
          }}
        />

        {currentTrace && (
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-600">
              Active Task: <strong>{currentTrace.title}</strong>
            </div>
            <Link
              to={`/app/trace/${currentTrace.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <span>See why & full trace replay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* 4. Equipped Skills Preview Card */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Equipped Skill Circuits</h3>
            <p className="text-xs text-slate-500">Verified capability circuits driving MOMO's decision pipeline</p>
          </div>
          <Link
            to="/app/skills"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Skill Inventory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {agent.skills.filter((s) => s.bound).map((skill) => (
            <div
              key={skill.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate">{skill.name}</span>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    {skill.tier}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {skill.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
