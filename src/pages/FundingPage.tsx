import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { useAppStore } from '../features/wallet/walletStore';
import { formatUsd } from '../utils/formatters';
import { USE_MOCK_API } from '../mocks';

export const FundingPage: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding, wallet } = useAppStore();

  const capitalStr = sessionStorage.getItem('onboarding_capital') || '100';
  const targetStr = sessionStorage.getItem('onboarding_target') || '300';
  const capital = parseFloat(capitalStr);
  const target = parseFloat(targetStr);

  const [selectedAsset, setSelectedAsset] = useState<'USDT' | 'TON'>('USDT');
  const [fundingState, setFundingState] = useState<'IDLE' | 'SIMULATING' | 'CONFIRMED'>('IDLE');

  const handleFund = () => {
    setFundingState('SIMULATING');
    setTimeout(() => {
      completeOnboarding(capital, target);
      setFundingState('CONFIRMED');
    }, 700);
  };

  const handleStartAutopilot = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#11141C] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/wallet/activate')}
            disabled={fundingState !== 'IDLE'}
            className="w-9 h-9 rounded-full bg-white border border-[#E2E7F0] flex items-center justify-center text-[#64748B] hover:text-[#11141C] cursor-pointer disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-[12px] font-mono text-[#64748B]">Step 4 of 4</span>
          <div className="w-9" />
        </div>

        <div>
          <h1 className="text-[24px] font-extrabold text-[#11141C] font-headline tracking-tight">
            {fundingState === 'CONFIRMED' ? 'Your AI is ready.' : 'Give your AI its starting capital.'}
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1">
            {fundingState === 'CONFIRMED'
              ? 'Your AI Wallet is funded and ready to launch autonomous operations.'
              : `Deposit ${formatUsd(capital, 0, 0)} to enable your agent to work toward your milestone.`}
          </p>
        </div>

        {USE_MOCK_API && (
          <div className="px-3 py-1.5 rounded-xl bg-[#F0F3FA] border border-[#2F6BFF]/20 flex items-center gap-2 text-[12px] text-[#2F6BFF]">
            <span className="font-bold font-mono">DEMO</span>
            <span className="text-[#64748B]">• Simulated funds • No real crypto required</span>
          </div>
        )}
      </div>

      <div className="space-y-4 my-6">
        {fundingState === 'CONFIRMED' ? (
          <div className="bg-[#090B10] text-white rounded-3xl p-6 text-center space-y-4 shadow-xl relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-[#00B074]/20 text-[#00B074] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <div className="text-[12px] font-mono uppercase text-[#3AC8FF] tracking-wider">AI Wallet Funded</div>
              <div className="text-[32px] font-black text-white font-headline mt-1">
                {formatUsd(capital, 0, 0)}
              </div>
            </div>
            <p className="text-[13px] text-white/70 max-w-xs mx-auto">
              Your AI Autopilot is primed to monitor liquidity pools and compound yields toward Level 1 ({formatUsd(target, 0, 0)}).
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 border border-[#E2E7F0] space-y-4 shadow-sm text-center">
            <div className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
              Starting Capital
            </div>
            <div className="text-[40px] font-black text-[#11141C] font-headline">
              {formatUsd(capital, 0, 0)}
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setSelectedAsset('USDT')}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                  selectedAsset === 'USDT'
                    ? 'bg-[#00B074] text-white shadow-sm'
                    : 'bg-[#F0F3FA] text-[#64748B] hover:text-[#11141C]'
                }`}
              >
                USDT
              </button>
              <button
                onClick={() => setSelectedAsset('TON')}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                  selectedAsset === 'TON'
                    ? 'bg-[#2F6BFF] text-white shadow-sm'
                    : 'bg-[#F0F3FA] text-[#64748B] hover:text-[#11141C]'
                }`}
              >
                TON
              </button>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9] space-y-2.5 text-[12px] text-left">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Destination:</span>
                <span className="font-mono font-semibold text-[#11141C]">{wallet.subWalletAddress} (AI Wallet)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">First Milestone:</span>
                <span className="font-mono font-semibold text-[#2F6BFF]">{formatUsd(target, 0, 0)} (Level 1)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Non-Custodial:</span>
                <span className="font-medium text-[#00B074]">Revocable anytime</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {fundingState === 'CONFIRMED' ? (
          <PrimaryButton
            size="lg"
            onClick={handleStartAutopilot}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Start Autopilot
          </PrimaryButton>
        ) : (
          <PrimaryButton
            size="lg"
            onClick={handleFund}
            disabled={fundingState === 'SIMULATING'}
            icon={fundingState === 'SIMULATING' ? undefined : <Sparkles className="w-4 h-4" />}
          >
            {fundingState === 'SIMULATING' ? 'Simulating wallet funding...' : `Fund AI Wallet (${formatUsd(capital, 0, 0)})`}
          </PrimaryButton>
        )}

        <p className="text-[11px] text-center text-[#64748B]">
          AI only manages the funded balance in your AI Wallet. Pause or withdraw anytime.
        </p>
      </div>
    </div>
  );
};
