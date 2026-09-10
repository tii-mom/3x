import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Flag, Info, Sparkles } from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { formatUsd } from '../utils/formatters';

export const MilestonePage: React.FC = () => {
  const navigate = useNavigate();
  const capitalStr = sessionStorage.getItem('onboarding_capital') || '100';
  const capital = parseFloat(capitalStr);

  // Core 3X milestone product
  const multiplier = 3;
  const target = capital * multiplier;

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#11141C] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/start')}
            className="w-9 h-9 rounded-full bg-white border border-[#E2E7F0] flex items-center justify-center text-[#64748B] hover:text-[#11141C] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-[12px] font-mono text-[#64748B]">Step 2 of 4</span>
          <div className="w-9" />
        </div>

        <div>
          <h1 className="text-[24px] sm:text-[26px] font-extrabold text-[#11141C] font-headline tracking-tight">
            Your first milestone
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1">
            Your AI will work toward this milestone while adapting to market conditions.
          </p>
        </div>
      </div>

      {/* Target Display Card */}
      <div className="space-y-4 my-8">
        <div className="bg-[#090B10] text-white rounded-3xl p-6 border border-white/10 text-center relative overflow-hidden shadow-xl">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#3AC8FF]/20 rounded-full blur-2xl" />
          <div className="text-[11px] font-mono uppercase text-[#3AC8FF] tracking-wider">
            Level 1 Target (3x)
          </div>
          <div className="text-[46px] font-black text-white font-headline tracking-tight mt-1">
            {formatUsd(target, 0, 0)}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[12px] font-mono text-white/80 mt-2">
            <Sparkles className="w-3.5 h-3.5 text-[#3AC8FF]" />
            <span>Target: 3x Starting Capital</span>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between text-[13px] text-white/70">
            <span>Starting: <strong className="text-white font-mono">{formatUsd(capital, 0, 0)}</strong></span>
            <span>Milestone: <strong className="text-white font-mono">Level 1</strong></span>
          </div>
        </div>

        {/* Milestone Path Preview */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E7F0] space-y-2">
          <div className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
            Progression Roadmap
          </div>
          <div className="flex items-center justify-between text-[13px] pt-1">
            <span className="font-semibold text-[#11141C]">Level 1: {formatUsd(target, 0, 0)} (Next)</span>
            <span className="text-[#64748B]">Level 2: {formatUsd(target * 3, 0, 0)}</span>
            <span className="text-[#94A3B8]">Level 3: {formatUsd(target * 9, 0, 0)}</span>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="space-y-3">
        <PrimaryButton
          size="lg"
          onClick={() => {
            sessionStorage.setItem('onboarding_target', target.toString());
            navigate('/start/mandate');
          }}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Continue
        </PrimaryButton>

        <p className="text-[11px] text-center text-[#94A3B8] flex items-center justify-center gap-1.5 px-4 leading-normal">
          <Info className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
          <span>Milestones are goals, not guaranteed returns.</span>
        </p>
      </div>
    </div>
  );
};
