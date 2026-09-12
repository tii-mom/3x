import React, { useState } from 'react';
import { DecisionTrace, TraceStep, NodeState } from '../models/types';
import { Shield, Zap, CheckCircle2, AlertCircle, Clock, PlayCircle } from 'lucide-react';

interface Props {
  trace?: DecisionTrace;
  interactive?: boolean;
  onReplay?: () => void;
  className?: string;
}

export const LivingBrain: React.FC<Props> = ({ trace, interactive = true, onReplay, className = '' }) => {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  if (!trace || !trace.steps || trace.steps.length === 0) {
    return (
      <div className={`p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center ${className}`}>
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-2">
          <Zap className="w-5 h-5" />
        </div>
        <p className="text-sm font-medium text-slate-600">Brain is resting</p>
        <p className="text-xs text-slate-400 mt-1">No active trace steps being processed</p>
      </div>
    );
  }

  const steps = trace.steps;
  const activeStep = steps.find((s) => s.id === selectedStepId) || steps.find((s) => s.state === 'active') || steps[steps.length - 1];

  const getNodeColor = (state: NodeState, nodeName: string) => {
    if (nodeName.toLowerCase().includes('risk') || state === 'protected') {
      return {
        bg: 'bg-emerald-500',
        text: 'text-emerald-700',
        ring: 'ring-emerald-200',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.35)]',
      };
    }
    switch (state) {
      case 'active':
        return {
          bg: 'bg-blue-600',
          text: 'text-blue-700',
          ring: 'ring-blue-300 ring-4 animate-pulse',
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          glow: 'shadow-[0_0_16px_rgba(47,107,255,0.45)]',
        };
      case 'completed':
        return {
          bg: 'bg-indigo-600',
          text: 'text-indigo-700',
          ring: 'ring-indigo-100',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          glow: 'shadow-xs',
        };
      case 'blocked':
        return {
          bg: 'bg-rose-500',
          text: 'text-rose-700',
          ring: 'ring-rose-200',
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          glow: 'shadow-[0_0_12px_rgba(244,63,94,0.35)]',
        };
      case 'sleeping':
      default:
        return {
          bg: 'bg-slate-300',
          text: 'text-slate-500',
          ring: 'ring-transparent',
          badge: 'bg-slate-50 text-slate-500 border-slate-200',
          glow: 'shadow-none',
        };
    }
  };

  const getStateIcon = (state: NodeState, nodeName: string) => {
    if (nodeName.toLowerCase().includes('risk')) return <Shield className="w-3.5 h-3.5" />;
    switch (state) {
      case 'active':
        return <Zap className="w-3.5 h-3.5 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'blocked':
        return <AlertCircle className="w-3.5 h-3.5" />;
      case 'sleeping':
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white shadow-card border border-slate-800 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
          <h3 className="text-sm font-semibold tracking-tight text-slate-100 flex items-center gap-2">
            Living Brain Trace
            <span className="text-xs font-normal text-slate-400">({steps.length} semantic circuits)</span>
          </h3>
        </div>
        {onReplay && (
          <button
            onClick={onReplay}
            className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-950/60 hover:bg-cyan-900/60 px-2.5 py-1 rounded-full border border-cyan-800/60"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        )}
      </div>

      {/* Semantic Node Graph Ribbon */}
      <div className="relative py-3 px-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[380px] relative">
          {/* Connecting Circuit Bus Line */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500/30 via-cyan-400/40 to-indigo-500/30 -translate-y-1/2 z-0" />

          {steps.map((step) => {
            const colors = getNodeColor(step.state, step.node);
            const isSelected = activeStep?.id === step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setSelectedStepId(step.id)}
                className={`relative z-10 flex flex-col items-center group transition-transform ${interactive ? 'cursor-pointer hover:scale-105' : ''}`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold transition-all ${colors.bg} ${colors.ring} ${colors.glow} ${
                    isSelected ? 'ring-2 ring-cyan-300 scale-110' : ''
                  }`}
                >
                  {getStateIcon(step.state, step.node)}
                </div>
                <span className="text-[11px] font-medium text-slate-300 mt-2 whitespace-nowrap max-w-[70px] truncate text-center">
                  {step.node}
                </span>
                {step.energyCost && step.energyCost > 0 ? (
                  <span className="text-[9px] text-cyan-400 font-mono">
                    -{step.energyCost}⚡
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspector Drawer */}
      {activeStep && (
        <div className="mt-4 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm animate-fade-in">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-200">{activeStep.node}</span>
              <span className="text-slate-400 font-mono text-[10px]">[{activeStep.circuitId || 'core'}]</span>
            </div>
            <span className="capitalize text-cyan-400 font-medium text-[11px] flex items-center gap-1">
              {activeStep.state}
              {activeStep.energyCost !== undefined && (
                <span className="text-slate-400 font-normal">| Cost: {activeStep.energyCost} Energy</span>
              )}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{activeStep.summary}</p>
        </div>
      )}

      {/* Bottom Summary Bar */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div>
          <span className="text-slate-500">Expected Net: </span>
          <span className="font-mono font-medium text-emerald-400">
            {trace.expectedNetValueUsd !== undefined ? `+$${trace.expectedNetValueUsd.toFixed(2)}` : 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-slate-500">Actual Energy: </span>
          <span className="font-mono font-medium text-cyan-400">
            {trace.actualEnergyUsed !== undefined ? `${trace.actualEnergyUsed}⚡` : '0⚡'}
          </span>
        </div>
      </div>
    </div>
  );
};
