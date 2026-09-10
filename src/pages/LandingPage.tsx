import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, CheckCircle2, ChevronRight, Lock, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { formatUsd } from '../utils/formatters';

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
            Live Agent Demo
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-8 sm:py-16 text-center space-y-8 flex-1 flex flex-col items-center justify-center">
        {/* Semantic Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E7F0] shadow-xs text-[12px] font-medium text-[#11141C]">
          <span className="w-2 h-2 rounded-full bg-[#3AC8FF] animate-pulse" />
          <span>Non-Custodial Liquidity Agent</span>
          <span className="text-[#94A3B8]">|</span>
          <span className="text-[#00B074] font-semibold">Guardian v4.8</span>
        </div>

        {/* Calm Display Headline */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-[34px] sm:text-[48px] font-extrabold tracking-tight text-[#11141C] font-headline leading-[1.15]">
            Autonomous Wealth Management for TON
          </h1>
          <p className="text-[15px] sm:text-[17px] text-[#64748B] leading-relaxed max-w-xl mx-auto">
            Set your capital goal. Your AI agent continuously scans 120+ liquidity pools, captures yield, and protects principal under strict mathematical guardrails.
          </p>
        </div>

        {/* 4-Step User Journey Visual */}
        <div className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E7F0] shadow-sm">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-[#F0F3FA] text-[#2F6BFF] font-bold text-[12px] flex items-center justify-center mx-auto">
                01
              </div>
              <div className="text-[12px] font-bold text-[#11141C]">Activate</div>
              <div className="text-[10px] text-[#64748B] hidden sm:block">Sub-Wallet</div>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-[#F0F3FA] text-[#2F6BFF] font-bold text-[12px] flex items-center justify-center mx-auto">
                02
              </div>
              <div className="text-[12px] font-bold text-[#11141C]">Fund</div>
              <div className="text-[10px] text-[#64748B] hidden sm:block">$100 Principal</div>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-[#F0F3FA] text-[#2F6BFF] font-bold text-[12px] flex items-center justify-center mx-auto">
                03
              </div>
              <div className="text-[12px] font-bold text-[#11141C]">Goal</div>
              <div className="text-[10px] text-[#64748B] hidden sm:block">3x Milestone</div>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-[#090B10] text-[#3AC8FF] font-bold text-[12px] flex items-center justify-center mx-auto shadow-sm">
                04
              </div>
              <div className="text-[12px] font-bold text-[#11141C]">Autopilot</div>
              <div className="text-[10px] text-[#00B074] font-semibold hidden sm:block">18.2% APY</div>
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
            Start with $100
          </PrimaryButton>
          <SecondaryButton
            size="lg"
            onClick={() => navigate('/app')}
          >
            Explore Dashboard
          </SecondaryButton>
        </div>

        {/* Safety Assurances */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[12px] text-[#64748B] pt-4">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00B074]" />
            Non-custodial isolation
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#2F6BFF]" />
            5% Single-action cap
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#64748B]" />
            Instant exit anytime
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-[12px] text-[#94A3B8] border-t border-[#E2E7F0] max-w-6xl mx-auto w-full">
        TON AI Wealth Agent • Production Architecture V2.0 • Verifiable on TON Mainnet
      </footer>
    </div>
  );
};
