import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, CheckCircle2, ChevronRight, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#11141C] flex flex-col justify-between">
      {/* Top Simple Header */}
      <header className="px-6 py-4 max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#090B10] text-[#3AC8FF] flex items-center justify-center font-bold shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-[17px] text-[#11141C] tracking-tight">
            TON AI Wealth Agent
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/app')}
            className="text-[13px] font-semibold text-[#2F6BFF] hover:underline px-3 py-1.5 rounded-xl cursor-pointer"
          >
            See how it works
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-8 sm:py-16 text-center space-y-8 flex-1 flex flex-col items-center justify-center">
        {/* Visible DEMO environment indicator */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E7F0] shadow-xs text-[12px] font-medium text-[#11141C]">
          <span className="w-2 h-2 rounded-full bg-[#2F6BFF] animate-pulse" />
          <span className="text-[#2F6BFF] font-semibold">DEMO</span>
          <span className="text-[#CBD5E1]">•</span>
          <span className="text-[#64748B]">Simulated portfolio</span>
          <span className="text-[#CBD5E1]">•</span>
          <span className="text-[#64748B]">No real funds are being used</span>
        </div>

        {/* Calm Display Headline */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-[36px] sm:text-[54px] font-extrabold tracking-tight text-[#11141C] font-headline leading-[1.12]">
            Give your AI<br />
            a wallet and a goal.
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#64748B] leading-relaxed max-w-xl mx-auto">
            Start with a small amount. Your AI researches opportunities, manages risk and works toward your next wealth milestone — automatically.
          </p>
        </div>

        {/* 4-Step User Journey Visual */}
        <div className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E7F0] shadow-sm">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-[#F0F3FA] text-[#2F6BFF] font-bold text-[12px] flex items-center justify-center mx-auto">
                01
              </div>
              <div className="text-[12px] font-bold text-[#11141C]">Start</div>
              <div className="text-[10px] text-[#64748B] hidden sm:block">$100 Capital</div>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-[#F0F3FA] text-[#2F6BFF] font-bold text-[12px] flex items-center justify-center mx-auto">
                02
              </div>
              <div className="text-[12px] font-bold text-[#11141C]">Set Goal</div>
              <div className="text-[10px] text-[#64748B] hidden sm:block">3x Milestone</div>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-[#F0F3FA] text-[#2F6BFF] font-bold text-[12px] flex items-center justify-center mx-auto">
                03
              </div>
              <div className="text-[12px] font-bold text-[#11141C]">Activate</div>
              <div className="text-[10px] text-[#64748B] hidden sm:block">AI Wallet</div>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-[#090B10] text-[#3AC8FF] font-bold text-[12px] flex items-center justify-center mx-auto shadow-sm">
                04
              </div>
              <div className="text-[12px] font-bold text-[#11141C]">Autopilot</div>
              <div className="text-[10px] text-[#00B074] font-semibold hidden sm:block">Active AI</div>
            </div>
          </div>
        </div>

        {/* Primary Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm pt-2">
          <PrimaryButton
            size="lg"
            onClick={() => navigate('/start')}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Start my AI
          </PrimaryButton>
          <SecondaryButton
            size="lg"
            onClick={() => navigate('/app')}
          >
            See how it works
          </SecondaryButton>
        </div>

        {/* Safety Assurances */}
        <div className="p-4 bg-white/70 rounded-2xl border border-[#E2E7F0] max-w-xl text-[13px] text-[#64748B] leading-relaxed">
          <span className="font-semibold text-[#11141C]">Your main wallet stays yours.</span> AI only manages the money you place in your AI Wallet. Pause or withdraw anytime.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[12px] text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00B074]" />
            Separate AI Wallet
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#2F6BFF]" />
            Risk Guardrails
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#64748B]" />
            Withdraw anytime
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-[12px] text-[#94A3B8] border-t border-[#E2E7F0] max-w-6xl mx-auto w-full">
        TON AI Wealth Agent • Autonomous Wealth Management
      </footer>
    </div>
  );
};
