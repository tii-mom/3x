import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert, ShieldCheck, Wallet } from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { useAppStore } from '../features/wallet/walletStore';
import { formatAddress } from '../utils/formatters';
import { USE_MOCK_API } from '../mocks';

export const WalletActivationPage: React.FC = () => {
  const navigate = useNavigate();
  const { wallet, connectWallet } = useAppStore();
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = () => {
    setIsActivating(true);
    setTimeout(() => {
      connectWallet();
      setIsActivating(false);
      navigate('/wallet/fund');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#11141C] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/start/mandate')}
            className="w-9 h-9 rounded-full bg-white border border-[#E2E7F0] flex items-center justify-center text-[#64748B] hover:text-[#11141C] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-[12px] font-mono text-[#64748B]">Step 4 of 4</span>
          <div className="w-9" />
        </div>

        <div>
          <h1 className="text-[24px] font-extrabold text-[#11141C] font-headline tracking-tight">
            Activate Your AI Wallet
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1">
            An isolated smart contract sub-wallet for your agent. Your main wallet balance is never exposed.
          </p>
        </div>

        {USE_MOCK_API && (
          <div className="px-3 py-1.5 rounded-xl bg-[#F0F3FA] border border-[#2F6BFF]/20 flex items-center gap-2 text-[12px] text-[#2F6BFF]">
            <span className="font-bold font-mono">DEMO WALLET</span>
            <span className="text-[#64748B]">• No real blockchain transaction required</span>
          </div>
        )}
      </div>

      <div className="space-y-4 my-6">
        {/* Architecture Isolation Diagram */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E7F0] space-y-4 shadow-sm">
          <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E7F0]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2F6BFF]/10 text-[#2F6BFF] flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-[#64748B] font-mono uppercase">User-Controlled Owner Wallet</div>
                <div className="text-[13px] font-bold text-[#11141C] font-mono">
                  {formatAddress(wallet.ownerAddress)}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#00B074] bg-[#00B074]/10 px-2 py-0.5 rounded-full">
              Protected
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 text-[12px] font-mono text-[#64748B]">
            <span className="w-6 h-px bg-[#CBD5E1]" />
            <span>Separate AI Wallet</span>
            <span className="w-6 h-px bg-[#CBD5E1]" />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-[#090B10] text-white rounded-2xl border border-white/10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#3AC8FF]/20 text-[#3AC8FF] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-white/50 font-mono uppercase">Dedicated AI Wallet</div>
                <div className="text-[13px] font-bold text-white font-mono">
                  {formatAddress(wallet.subWalletAddress)}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#3AC8FF] bg-[#3AC8FF]/15 px-2 py-0.5 rounded-full font-mono">
              AI Managed
            </span>
          </div>
        </div>

        {/* Guarantees list */}
        <div className="space-y-2 text-[13px] text-[#334155] px-1">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#00B074] shrink-0 mt-0.5" />
            <span>Zero access to your main wallet private keys or personal balance.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#00B074] shrink-0 mt-0.5" />
            <span>AI execution is protected by platform risk rules and limits.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#00B074] shrink-0 mt-0.5" />
            <span>You can pause autopilot or revoke AI access at any time.</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <PrimaryButton
          size="lg"
          onClick={handleActivate}
          disabled={isActivating}
          icon={isActivating ? undefined : <ShieldCheck className="w-4 h-4" />}
        >
          {isActivating ? 'Activating AI Wallet...' : 'Activate AI Wallet & Continue'}
        </PrimaryButton>
      </div>
    </div>
  );
};
