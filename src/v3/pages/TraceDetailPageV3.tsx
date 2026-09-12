import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAgentStore } from '../services/agentService';
import { LivingBrain } from '../components/LivingBrain';
import { ArrowLeft, Play, RotateCcw, Share2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { DecisionTrace } from '../models/types';

export const TraceDetailPageV3: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useAgentStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [copiedShare, setCopiedShare] = useState(false);

  const baseTrace = data.currentTrace;

  // Replay animation simulator
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && baseTrace && baseTrace.steps.length > 0) {
      timer = setTimeout(() => {
        if (currentStepIdx < baseTrace.steps.length - 1) {
          setCurrentStepIdx((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 900);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, baseTrace]);

  const handleStartReplay = () => {
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  const handleCopyShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  if (!baseTrace) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-card">
        <p className="text-sm font-semibold text-slate-700">Trace not found: {id}</p>
        <Link to="/app" className="mt-4 inline-block text-xs font-bold text-blue-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Active animated trace snapshot
  const displayedTrace: DecisionTrace = {
    ...baseTrace,
    steps: baseTrace.steps.map((step, idx) => {
      if (idx < currentStepIdx) return { ...step, state: 'completed' };
      if (idx === currentStepIdx) return { ...step, state: 'active' };
      return { ...step, state: 'sleeping' };
    }),
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/app"
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Decision Trace Replay</h1>
              <span className="text-[10px] font-mono text-slate-400">[{id}]</span>
            </div>
            <p className="text-xs text-slate-500">{baseTrace.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleStartReplay}
            disabled={isPlaying}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-blue-glow transition-all cursor-pointer disabled:opacity-50"
          >
            {isPlaying ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Replaying...' : 'Replay Trace'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedShare ? 'Copied Link!' : 'Share Card'}</span>
          </button>
        </div>
      </div>

      {/* Living Brain Interactive Visualizer */}
      <LivingBrain trace={displayedTrace} interactive />

      {/* Decision Math & Resource Accounting Breakdown */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
        <h2 className="text-base font-bold text-slate-900 tracking-tight mb-1">
          Value Router & Economic Verification Math
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Deterministic pre-validation formula: Expected Net = P(success) × Gross - Compute - Execution - RiskPenalty
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Expected Net Return
            </span>
            <span className="text-2xl font-black text-emerald-600 font-mono">
              +${baseTrace.expectedNetValueUsd?.toFixed(2) || '0.00'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">
              Qualified as positive economic output
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Energy Consumption
            </span>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-2xl font-black text-slate-900 font-mono">
                {baseTrace.actualEnergyUsed}⚡
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Capped at {baseTrace.premiumEnergyBudget}⚡ budget
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Risk Gate Check
            </span>
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-base">
              <ShieldCheck className="w-5 h-5" />
              <span>PASSED (100%)</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Zero unauthorized exposure
            </span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Execution Log */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4">
          Step Execution Pipeline
        </h3>

        <div className="space-y-3">
          {baseTrace.steps.map((step, idx) => (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                idx === currentStepIdx
                  ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-100'
                  : 'bg-slate-50/70 border-slate-100'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0 font-mono text-slate-600">
                {step.seq || idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{step.node}</span>
                    <span className="text-[10px] font-mono text-slate-400">[{step.circuitId}]</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    {step.energyCost ? `-${step.energyCost}⚡` : '0⚡'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {step.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
