import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight, Lock, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { useAppStore } from '../features/wallet/walletStore';
import { formatUsd } from '../utils/formatters';

export const FundingPage: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding, wallet } = useAppStore();

  const capitalStr = sessionStorage.getItem('onboarding_capital') || '100';
  const targetStr = sessionStorage.getItem('onboarding_target') || '300';
  const capital = parseFloat(capitalStr);
  const target = parseFloat(targetStr);

  const [selectedAsset, setSelectedAsset] = useState<'USDT' | 'TON'>('USDT');
  const [isFunding, setIsFunding] = useState(false);

  const handleFund = () => {
    setIsFunding(true);
    setTimeout(() => {
      completeOnboarding(capital, target);
      setIsFunding(false);
      navigate('/app');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#11141C] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/wallet/activate')}
            className="w-9 h-9 rounded-full bg-white border border-[#E2E7F0] flex items-center justify-center text-[#64748B] hover:text-[#11141C] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-[12px] font-mono text-[#64748B]">Final Step: Fund Agent</span>
          <div className="w-9" />
        </div>

        <div>
          <h1 className="text-[24px] font-extrabold text-[#11141C] font-headline tracking-tight">
            Deposit Starting Capital
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1">
            Authorize a transfer of {formatUsd(capital)} from your wallet to fund your autonomous agent.
          </p>
        </div>
      </div>

      <div className="space-y-4 my-6">
        {/* Deposit Summary Box */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E7F0] space-y-4 shadow-sm text-center">
          <div className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
            Deposit Amount
          </div>
          <div className="text-[40px] font-black text-[#11141C] font-headline">
            {formatUsd(capital)}
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
              USDT (Native TON)
            </button>
            <button
              onClick={() => setSelectedAsset('TON')}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                selectedAsset === 'TON'
                  ? 'bg-[#2F6BFF] text-white shadow-sm'
                  : 'bg-[#F0F3FA] text-[#64748B] hover:text-[#11141C]'
              }`}
            >
              TON Coin
            </button>
          </div>

          <div className="pt-4 border-t border-[#F1F5F9] space-y-2 text-[12px] text-left">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Destination:</span>
              <span className="font-mono font-semibold text-[#11141C]">{wallet.subWalletAddress} (Sub-Wallet)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Target Goal:</span>
              <span className="font-mono font-semibold text-[#2F6BFF]">{formatUsd(target)} (Level 1)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Network Fee:</span>
              <span className="font-mono text-[#00B074]">&lt; 0.005 TON (~$0.02)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <PrimaryButton
          size="lg"
          onClick={handleFund}
          disabled={isFunding}
          icon={isFunding ? undefined : <Sparkles className="w-4 h-4" />}
        >
          {isFunding ? 'Confirming On-Chain Transfer...' : `Deposit ${formatUsd(capital)} & Launch Autopilot`}
        </PrimaryButton>

        <p className="text-[11px] text-center text-[#64748B]">
          Signing this transaction approves isolated sub-wallet custody only.
        </p>
      </div>
    </div>
  );
};
