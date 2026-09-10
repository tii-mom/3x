import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Flag, Sparkles } from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { formatUsd } from '../utils/formatters';

export const MilestonePage: React.FC = () => {
  const navigate = useNavigate();
  const capitalStr = sessionStorage.getItem('onboarding_capital') || '100';
  const capital = parseFloat(capitalStr);

  const [multiplier, setMultiplier] = useState<number>(3);
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
          <span className="text-[12px] font-mono text-[#64748B]">Step 2 of 4: Milestone</span>
          <div className="w-9" />
        </div>

        <div>
          <h1 className="text-[24px] font-extrabold text-[#11141C] font-headline tracking-tight">
            Target Wealth Milestone
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1">
            Define your first autonomous target milestone. Your AI Agent will structure risks to hit this goal.
          </p>
        </div>
      </div>

      {/* Target Display Card */}
      <div className="space-y-4 my-8">
        <div className="bg-[#090B10] text-white rounded-3xl p-6 border border-white/10 text-center relative overflow-hidden shadow-xl">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#3AC8FF]/20 rounded-full blur-2xl" />
          <div className="text-[11px] font-mono uppercase text-[#3AC8FF] tracking-wider">
            Level 01 Milestone Target
          </div>
          <div className="text-[42px] font-black text-white font-headline tracking-tight mt-1">
            {formatUsd(target)}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[12px] font-mono text-white/80 mt-2">
            <Sparkles className="w-3.5 h-3.5 text-[#3AC8FF]" />
            <span>{multiplier}x Geometric Growth</span>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between text-[12px] text-white/60">
            <span>Starting: {formatUsd(capital)}</span>
            <span>Target Profit: +{formatUsd(target - capital)}</span>
          </div>
        </div>

        {/* Multiplier options */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[2, 3, 5].map((m) => (
            <button
              key={m}
              onClick={() => setMultiplier(m)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                multiplier === m
                  ? 'bg-white border-[#2F6BFF] ring-2 ring-[#2F6BFF]/15 font-bold text-[#2F6BFF]'
                  : 'bg-white border-[#E2E7F0] text-[#64748B] hover:border-[#CBD5E1]'
              }`}
            >
              <div className="text-[15px] font-mono">{m}x Goal</div>
              <div className="text-[11px] text-[#64748B] mt-0.5">{formatUsd(capital * m, 0, 0)}</div>
            </button>
          ))}
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
          Lock In {formatUsd(target, 0, 0)} Goal
        </PrimaryButton>
      </div>
    </div>
  );
};
