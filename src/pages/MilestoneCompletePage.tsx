import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, CheckCircle2, Sparkles, TrendingUp, Trophy, ArrowRight } from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { useAppStore } from '../features/wallet/walletStore';
import { formatUsd } from '../utils/formatters';

export const MilestoneCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const { goal, portfolio, setProfitPreference, setAiMode } = useAppStore();
  const [selectedAction, setSelectedAction] = useState<
    'CONTINUE' | 'TAKE_PROFIT' | 'SPLIT'
  >('CONTINUE');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    if (selectedAction === 'CONTINUE') {
      setProfitPreference('COMPOUND_ALL');
      setAiMode('GROW');
    } else if (selectedAction === 'TAKE_PROFIT') {
      setProfitPreference('WITHDRAW_PROFIT');
      setAiMode('PRESERVE');
    } else {
      setProfitPreference('SPLIT_PROFIT');
    }
    setIsConfirmed(true);
    setTimeout(() => {
      navigate('/app');
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto min-h-[80vh] flex flex-col justify-between py-6 px-4 space-y-6">
      <div className="text-center space-y-4 my-auto">
        {/* Trophy visual */}
        <div className="w-16 h-16 rounded-3xl bg-[#090B10] text-[#F59E0B] border border-white/10 flex items-center justify-center mx-auto shadow-xl relative">
          <Trophy className="w-8 h-8" />
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00B074] border-2 border-white flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        </div>

        <div>
          <span className="text-[12px] font-mono text-[#2F6BFF] uppercase tracking-wider font-semibold">
            Milestone 1 Completed
          </span>
          <h1 className="text-[28px] font-black text-[#11141C] font-headline tracking-tight mt-1">
            Target Reached!
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1 max-w-xs mx-auto">
            Your portfolio successfully grew from {formatUsd(portfolio.startingCapital)} to{' '}
            <strong className="text-[#11141C]">{formatUsd(goal.targetNav)}</strong>.
          </p>
        </div>

        {/* Milestone Choice Cards */}
        <div className="space-y-3 text-left pt-4">
          <div
            onClick={() => setSelectedAction('CONTINUE')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              selectedAction === 'CONTINUE'
                ? 'bg-white border-[#2F6BFF] ring-2 ring-[#2F6BFF]/10 shadow-sm'
                : 'bg-white border-[#E2E7F0] hover:border-[#CBD5E1]'
            }`}
          >
            <div>
              <div className="text-[14px] font-bold text-[#11141C] flex items-center gap-2">
                <span>Continue Growing</span>
                <span className="text-[10px] bg-[#2F6BFF]/10 text-[#2F6BFF] px-2 py-0.5 rounded-full font-bold">
                  Next: $900
                </span>
              </div>
              <div className="text-[12px] text-[#64748B] mt-0.5">
                Automatically roll 100% of profit into Level 2 trajectory.
              </div>
            </div>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedAction === 'CONTINUE' ? 'border-[#2F6BFF] bg-[#2F6BFF]' : 'border-[#CBD5E1]'
              }`}
            >
              {selectedAction === 'CONTINUE' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>

          <div
            onClick={() => setSelectedAction('TAKE_PROFIT')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              selectedAction === 'TAKE_PROFIT'
                ? 'bg-white border-[#2F6BFF] ring-2 ring-[#2F6BFF]/10 shadow-sm'
                : 'bg-white border-[#E2E7F0] hover:border-[#CBD5E1]'
            }`}
          >
            <div>
              <div className="text-[14px] font-bold text-[#11141C]">
                Take Some Profit
              </div>
              <div className="text-[12px] text-[#64748B] mt-0.5">
                Lock profit gains into safe USDT floor; compound original capital.
              </div>
            </div>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedAction === 'TAKE_PROFIT' ? 'border-[#2F6BFF] bg-[#2F6BFF]' : 'border-[#CBD5E1]'
              }`}
            >
              {selectedAction === 'TAKE_PROFIT' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>

          <div
            onClick={() => setSelectedAction('SPLIT')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              selectedAction === 'SPLIT'
                ? 'bg-white border-[#2F6BFF] ring-2 ring-[#2F6BFF]/10 shadow-sm'
                : 'bg-white border-[#E2E7F0] hover:border-[#CBD5E1]'
            }`}
          >
            <div>
              <div className="text-[14px] font-bold text-[#11141C]">
                Split Profit 50/50
              </div>
              <div className="text-[12px] text-[#64748B] mt-0.5">
                50% preserved in safe floor, 50% accelerated towards Level 2.
              </div>
            </div>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedAction === 'SPLIT' ? 'border-[#2F6BFF] bg-[#2F6BFF]' : 'border-[#CBD5E1]'
              }`}
            >
              {selectedAction === 'SPLIT' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <PrimaryButton
          size="lg"
          onClick={handleConfirm}
          disabled={isConfirmed}
          icon={<Sparkles className="w-4 h-4" />}
        >
          {isConfirmed ? 'Updating Agent Mandate...' : 'Confirm Next Phase'}
        </PrimaryButton>

        <SecondaryButton size="md" onClick={() => navigate('/app')}>
          Return to Overview
        </SecondaryButton>
      </div>
    </div>
  );
};
