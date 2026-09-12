import React, { useState } from 'react';
import { useAgentStore } from '../services/agentService';
import { ShoppingBag, Zap, Cpu, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MarketPageV3: React.FC = () => {
  const { opportunities, skillsCatalog, executeOpportunitySimulation } = useAgentStore();
  const [activeTab, setActiveTab] = useState<'OPPORTUNITIES' | 'SKILLS' | 'ENERGY'>('OPPORTUNITIES');
  const [purchasedPack, setPurchasedPack] = useState<string | null>(null);
  const [evaluatingOppId, setEvaluatingOppId] = useState<string | null>(null);

  const handleRunOpp = async (oppId: string) => {
    setEvaluatingOppId(oppId);
    try {
      await executeOpportunitySimulation(oppId);
    } finally {
      setEvaluatingOppId(null);
    }
  };

  const handleBuyEnergy = (packName: string) => {
    setPurchasedPack(packName);
    setTimeout(() => setPurchasedPack(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Platform Market</h1>
          <p className="text-xs text-slate-500">
            Open opportunity graph, certified skill circuits, and cost-anchored compute packs
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-2xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('OPPORTUNITIES')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'OPPORTUNITIES'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Opportunities
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SKILLS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'SKILLS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skill Catalog
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ENERGY')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ENERGY'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Energy Packs
          </button>
        </div>
      </div>

      {/* 1. Opportunities Tab */}
      {activeTab === 'OPPORTUNITIES' && (
        <div className="space-y-3">
          <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
            <h2 className="text-base font-bold text-slate-900 tracking-tight mb-1">
              Active Opportunity Feed
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Discovered by platform crawlers. Only tasks with positive risk-adjusted expected net value will be accepted.
            </p>

            <div className="space-y-3">
              {opportunities.map((opp) => {
                const expectedNet = (
                  opp.probabilityOfSuccess * opp.expectedGrossUsd -
                  opp.estimatedComputeCost -
                  opp.riskPenalty
                ).toFixed(2);
                const isPositive = Number(expectedNet) > 0;
                const isRunning = evaluatingOppId === opp.id;

                return (
                  <div
                    key={opp.id}
                    className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {opp.source}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Expires in {Math.round(opp.timeWindowSec / 60)}m
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{opp.title}</h3>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                        <span>
                          Gross: <strong>${opp.expectedGrossUsd.toFixed(2)}</strong>
                        </span>
                        <span>
                          P(success): <strong>{Math.round(opp.probabilityOfSuccess * 100)}%</strong>
                        </span>
                        <span>
                          Compute: <strong>${opp.estimatedComputeCost.toFixed(2)}</strong>
                        </span>
                        <span>
                          Expected Net:{' '}
                          <strong className={isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                            ${expectedNet}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleRunOpp(opp.id)}
                        disabled={isRunning}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs ${
                          isPositive
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-slate-800 hover:bg-slate-900 text-white'
                        } disabled:opacity-50`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isRunning ? 'Dispatching...' : isPositive ? 'Run Task' : 'Simulate Rejection'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. Skills Tab */}
      {activeTab === 'SKILLS' && (
        <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Certified Skill Catalog</h2>
              <p className="text-xs text-slate-500">
                All skills are versioned and audited. Learn a skill to expand MOMO's decision circuits.
              </p>
            </div>
            <Link to="/app/skills" className="text-xs font-semibold text-blue-600 hover:underline">
              Manage Equipped Slots →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skillsCatalog.map((skill) => (
              <div key={skill.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                      {skill.tier}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{skill.energyCostEst}⚡ / op</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{skill.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{skill.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">ID: {skill.id}</span>
                  <Link
                    to="/app/skills"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Energy Packs Tab */}
      {activeTab === 'ENERGY' && (
        <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Cost-Anchored Premium Energy Packs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Energy is a physical compute commodity anchored in real LLM provider costs ($1.00 USD equivalent). It is not subject to token inflation.
            </p>
          </div>

          {purchasedPack && (
            <div className="p-3.5 mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Purchased <strong>{purchasedPack}</strong>. Added to agent's Premium Energy pool.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Starter Pack</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">10 Energy</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ideal for small verification tasks and basic deep evaluations.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-slate-900">$1.00</span>
                  <span className="text-[10px] text-slate-400 block font-mono">10 DEMO_3X</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleBuyEnergy('Starter Pack')}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  Acquire
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl border-2 border-blue-500 bg-blue-50/20 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Growth Pack (Popular)</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">50 Energy</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enables multi-step reasoning, research, and high-frequency task routing.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-slate-900">$4.50</span>
                  <span className="text-[10px] text-blue-700 block font-mono">45 DEMO_3X</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleBuyEnergy('Growth Pack')}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-blue-glow"
                >
                  Acquire
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Syndicate Pack</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">200 Energy</h3>
                <p className="text-xs text-slate-500 mt-1">
                  High-capacity compute for multi-market market making and agent teams.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-slate-900">$16.00</span>
                  <span className="text-[10px] text-slate-400 block font-mono">160 DEMO_3X</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleBuyEnergy('Syndicate Pack')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  Acquire
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
