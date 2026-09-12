import React, { useState } from 'react';
import { useAgentStore } from '../services/agentService';
import { Zap, Shield, TrendingUp, CheckCircle2, Sliders, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EnergyPageV3: React.FC = () => {
  const { data, updateEnergyBudget } = useAgentStore();
  const { energy } = data.agent;

  const [dailyBudget, setDailyBudget] = useState(energy.dailyBudget || 20);
  const [maxEnergyPerOp, setMaxEnergyPerOp] = useState(energy.maxEnergyPerOp || 4);
  const [autoSpend, setAutoSpend] = useState(energy.autoSpendHighValue ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    updateEnergyBudget(dailyBudget, maxEnergyPerOp, autoSpend);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Compute ROI metric: Qualified Value Created / Premium Compute Cost
  const computeRoi = (data.agent.today.earned / Math.max(1, energy.usedToday * 10)).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/app"
          className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Energy & Compute</h1>
          <p className="text-xs text-slate-500">
            Cost-anchored compute resource system. Decoupled from token volatility.
          </p>
        </div>
      </div>

      {/* Two-Tier Energy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Base Energy */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tier 1</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Refreshed Daily
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>Base Energy</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Maintains sensory pre-filtering, basic sandbox tasks, and immutable security checks.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 tabular-nums">{energy.basePct}%</span>
            <span className="text-xs text-slate-400 font-medium">Free • Non-transferable</span>
          </div>
        </div>

        {/* Premium Energy */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tier 2</span>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Commodity Compute
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Premium Energy</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Powers deep reasoning, multi-step verification, and advanced task execution circuits.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-600 tabular-nums">{energy.premiumPct}%</span>
            <span className="text-xs text-slate-500 font-mono font-medium">
              Used today: {energy.usedToday}⚡
            </span>
          </div>
        </div>
      </div>

      {/* Compute ROI Summary Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-200 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Economic Productivity Metric</span>
          </div>
          <h3 className="text-base font-bold text-white mt-1">
            Compute ROI: {computeRoi}x
          </h3>
          <p className="text-xs text-blue-100 mt-0.5 max-w-md">
            For every 1 unit of Premium Energy consumed today, MOMO has produced {computeRoi}x in verified economic output.
          </p>
        </div>

        <div className="text-right sm:border-l sm:border-blue-400/40 sm:pl-6">
          <span className="text-[11px] text-blue-200 block">Today's Qualified Net</span>
          <span className="text-xl font-extrabold text-white tabular-nums">
            +{data.agent.today.net} {data.agent.today.asset}
          </span>
        </div>
      </div>

      {/* Energy Usage Log / Audit Reasons */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
          Recent Premium Energy Spend Reasons
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Every Premium Energy expenditure is cryptographically recorded with a verifiable reason and outcome.
        </p>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">High-Value Task Evaluation</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Outcome: Won $2.40 Task
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Deep research and risk analysis circuit run for cross-protocol verification.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-600 shrink-0">-0.9 Energy</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">DEX Opportunity Sanity Pre-check</span>
                <span className="text-[10px] font-semibold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded">
                  Outcome: Rejected (Saved Capital)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Value Router detected high volatility penalty (-$4.50). Prevented loss.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 shrink-0">-0.1 Energy</span>
          </div>
        </div>
      </div>

      {/* Value Router Budget Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
        <div className="flex items-center gap-2 mb-1">
          <Sliders className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Value Router Energy Budgets
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Set strict guardrails for MOMO's autonomous compute expenditure.
        </p>

        <form onSubmit={handleSaveBudget} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="daily-budget-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Daily Premium Budget (Energy units)
              </label>
              <input
                id="daily-budget-input"
                type="number"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(Number(e.target.value))}
                min={1}
                max={100}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="max-energy-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Max Energy Per Opportunity
              </label>
              <input
                id="max-energy-input"
                type="number"
                value={maxEnergyPerOp}
                onChange={(e) => setMaxEnergyPerOp(Number(e.target.value))}
                min={0.1}
                max={20}
                step={0.1}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSpend}
                onChange={(e) => setAutoSpend(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-xs font-medium text-slate-700">
                Auto-spend Premium Energy on high-value opportunities ($1.00+ net expected)
              </span>
            </label>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Save Budgets
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Energy budgets updated successfully. Value Router updated.</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
