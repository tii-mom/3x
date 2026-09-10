import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';

export const MandatePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#11141C] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/start/milestone')}
            className="w-9 h-9 rounded-full bg-white border border-[#E2E7F0] flex items-center justify-center text-[#64748B] hover:text-[#11141C] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-[12px] font-mono text-[#64748B]">Step 3 of 4</span>
          <div className="w-9" />
        </div>

        <div>
          <h1 className="text-[24px] sm:text-[26px] font-extrabold text-[#11141C] font-headline tracking-tight leading-snug">
            You set the capital.<br />
            AI handles the work.
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1.5">
            Your AI operates autonomously within strict non-custodial boundaries.
          </p>
        </div>
      </div>

      <div className="space-y-5 my-6">
        {/* Three Core Guarantees */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E7F0] space-y-3.5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#EBF2FF] text-[#2F6BFF] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-[#11141C]">Your main wallet stays yours</div>
              <p className="text-[12px] text-[#64748B] mt-0.5 leading-relaxed">
                AI has zero access to your primary wallet keys, personal funds, or other tokens.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-3 border-t border-[#F1F5F9]">
            <div className="w-7 h-7 rounded-lg bg-[#E6F9F2] text-[#00B074] flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-[#11141C]">AI manages only the AI Wallet</div>
              <p className="text-[12px] text-[#64748B] mt-0.5 leading-relaxed">
                Actions are strictly restricted to the specific capital you deposit into your AI Wallet.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-3 border-t border-[#F1F5F9]">
            <div className="w-7 h-7 rounded-lg bg-[#F0F3FA] text-[#11141C] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-[#11141C]">You can pause or withdraw anytime</div>
              <p className="text-[12px] text-[#64748B] mt-0.5 leading-relaxed">
                Take full control back in one tap. Pause autopilot or sweep funds back to your wallet instantly.
              </p>
            </div>
          </div>
        </div>

        {/* What AI may do */}
        <div className="bg-white rounded-2xl p-4.5 border border-[#E2E7F0] space-y-2.5">
          <div className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
            What your AI is permitted to do
          </div>
          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAFC]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00B074] shrink-0" />
              <span className="font-medium text-[#11141C]">Research yield pools</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAFC]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00B074] shrink-0" />
              <span className="font-medium text-[#11141C]">Capture & compound gains</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAFC]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00B074] shrink-0" />
              <span className="font-medium text-[#11141C]">Rebalance risk</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAFC]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00B074] shrink-0" />
              <span className="font-medium text-[#11141C]">Protect profits</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <PrimaryButton
          size="lg"
          onClick={() => {
            sessionStorage.setItem('onboarding_strategy', 'GROW');
            sessionStorage.setItem('onboarding_profit', 'COMPOUND_ALL');
            navigate('/wallet/activate');
          }}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Activate my AI
        </PrimaryButton>
      </div>
    </div>
  );
};
