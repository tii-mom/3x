import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bot, DollarSign, ShieldCheck, Sparkles } from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { formatUsd } from '../utils/formatters';

export const OnboardingCapitalPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCapital, setSelectedCapital] = useState<number>(100);

  const presets = [50, 100, 250, 500];

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#11141C] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      {/* Step Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-full bg-white border border-[#E2E7F0] flex items-center justify-center text-[#64748B] hover:text-[#11141C] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-[12px] font-mono text-[#64748B]">Step 1 of 4: Capital</span>
          <div className="w-9" />
        </div>

        <div>
          <h1 className="text-[24px] font-extrabold text-[#11141C] font-headline tracking-tight">
            Select Starting Capital
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1">
            Choose how much capital to assign to your isolated autonomous agent.
          </p>
        </div>
      </div>

      {/* Capital Preset Selector */}
      <div className="space-y-4 my-8">
        <div className="grid grid-cols-2 gap-3">
          {presets.map((amount) => (
            <button
              key={amount}
              onClick={() => setSelectedCapital(amount)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                selectedCapital === amount
                  ? 'bg-white border-[#2F6BFF] ring-2 ring-[#2F6BFF]/15 shadow-sm'
                  : 'bg-white border-[#E2E7F0] hover:border-[#CBD5E1]'
              }`}
            >
              {amount === 100 && (
                <span className="absolute top-2 right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00B074]/15 text-[#00B074]">
                  Recommended
                </span>
              )}
              <div className="text-[12px] text-[#64748B]">Initial Principal</div>
              <div className="text-[24px] font-extrabold text-[#11141C] font-mono mt-1">
                {formatUsd(amount, 0, 0)}
              </div>
            </button>
          ))}
        </div>

        {/* Breakdown preview */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E7F0] space-y-2.5 text-[13px]">
          <div className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
            Agent Execution Plan
          </div>
          <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
            <span className="text-[#64748B]">Reserve Buffer (42%)</span>
            <span className="font-semibold text-[#11141C] font-mono">{formatUsd(selectedCapital * 0.42)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
            <span className="text-[#64748B]">Yield Harvesting (33%)</span>
            <span className="font-semibold text-[#00B074] font-mono">{formatUsd(selectedCapital * 0.33)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#64748B]">Opportunistic Growth (25%)</span>
            <span className="font-semibold text-[#F59E0B] font-mono">{formatUsd(selectedCapital * 0.25)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Continue Action */}
      <div className="space-y-3">
        <PrimaryButton
          size="lg"
          onClick={() => {
            sessionStorage.setItem('onboarding_capital', selectedCapital.toString());
            navigate('/start/milestone');
          }}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Continue with {formatUsd(selectedCapital, 0, 0)}
        </PrimaryButton>

        <p className="text-[11px] text-center text-[#64748B] flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00B074]" />
          Funds remain in your isolated non-custodial smart contract.
        </p>
      </div>
    </div>
  );
};
