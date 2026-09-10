import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ProfitPreference, AiMode } from '../types';

export const MandatePage: React.FC = () => {
  const navigate = useNavigate();
  const [strategyMode, setStrategyMode] = useState<AiMode>('GROW');
  const [profitPref, setProfitPref] = useState<ProfitPreference>('COMPOUND_ALL');

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
          <span className="text-[12px] font-mono text-[#64748B]">Step 3 of 4: Mandate</span>
          <div className="w-9" />
        </div>

        <div>
          <h1 className="text-[24px] font-extrabold text-[#11141C] font-headline tracking-tight">
            AI Operating Mandate
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1">
            Choose how your agent navigates opportunities and handles captured yield.
          </p>
        </div>
      </div>

      <div className="space-y-6 my-6">
        {/* Strategy Mode */}
        <div className="space-y-2.5">
          <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
            Operational Strategy
          </label>
          <div className="space-y-2">
            {[
              {
                mode: 'GROW' as AiMode,
                title: 'Grow Mode (Balanced)',
                desc: 'Dynamically rebalances across top 120+ pools with 5% risk guardrails.',
                badge: 'Recommended',
              },
              {
                mode: 'PRESERVE' as AiMode,
                title: 'Preserve & Harvest',
                desc: 'Prioritizes stable yields and keeps higher cash reserves in USDT.',
              },
              {
                mode: 'SHIELDED' as AiMode,
                title: 'Shielded Fixed Staking',
                desc: 'Allocates strictly to verified liquid staking (bemo stTON).',
              },
            ].map((item) => (
              <div
                key={item.mode}
                onClick={() => setStrategyMode(item.mode)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  strategyMode === item.mode
                    ? 'bg-white border-[#2F6BFF] ring-2 ring-[#2F6BFF]/10 shadow-xs'
                    : 'bg-white border-[#E2E7F0] hover:border-[#CBD5E1]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#11141C]">{item.title}</span>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00B074]/15 text-[#00B074] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#64748B] mt-0.5">{item.desc}</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    strategyMode === item.mode ? 'border-[#2F6BFF] bg-[#2F6BFF]' : 'border-[#CBD5E1]'
                  }`}
                >
                  {strategyMode === item.mode && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profit Preference */}
        <div className="space-y-2.5">
          <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
            Profit Preference
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'COMPOUND_ALL' as ProfitPreference, label: 'Auto Compound', sub: 'Maximize APY' },
              { id: 'WITHDRAW_PROFIT' as ProfitPreference, label: 'Safe Floor', sub: 'Route to USDT' },
              { id: 'SPLIT_PROFIT' as ProfitPreference, label: 'Split 50/50', sub: 'Balanced' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setProfitPref(p.id)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  profitPref === p.id
                    ? 'bg-white border-[#2F6BFF] ring-2 ring-[#2F6BFF]/10 font-bold text-[#2F6BFF]'
                    : 'bg-white border-[#E2E7F0] text-[#64748B] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="text-[13px] font-semibold">{p.label}</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">{p.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <PrimaryButton
          size="lg"
          onClick={() => {
            sessionStorage.setItem('onboarding_strategy', strategyMode);
            sessionStorage.setItem('onboarding_profit', profitPref);
            navigate('/wallet/activate');
          }}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Proceed to Wallet Activation
        </PrimaryButton>
      </div>
    </div>
  );
};
