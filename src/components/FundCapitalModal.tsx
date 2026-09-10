import React, { useState } from 'react';
import { X, ArrowDownRight, Check, AlertCircle } from 'lucide-react';
import { SubWalletState } from '../types';

interface FundCapitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  subWallet: SubWalletState;
  onConfirmFund: (amount: number, asset: string) => void;
}

export const FundCapitalModal: React.FC<FundCapitalModalProps> = ({
  isOpen,
  onClose,
  subWallet,
  onConfirmFund,
}) => {
  const [selectedAsset, setSelectedAsset] = useState<'USDT' | 'TON'>('USDT');
  const [amount, setAmount] = useState<string>('250');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const presets = [100, 250, 500, 1000];

  const handleFund = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg(true);
      onConfirmFund(numericAmount, selectedAsset);
      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
      }, 1000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[460px] bg-white rounded-[28px] p-6 shadow-2xl border border-[#C3C5D8]/30 relative animate-scale-up">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F2F3FB] hover:bg-[#ECEDF5] flex items-center justify-center text-[#434655] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#2F6BFF]/10 text-[#0051DF] flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-[18px] text-[#191C21]">
              Fund Sub-Wallet
            </h3>
            <p className="text-[12px] text-[#434655]">
              Allocate isolated capital for algorithmic yield
            </p>
          </div>
        </div>

        {/* Isolation reminder */}
        <div className="p-3 rounded-[14px] bg-[#F2F3FB] border border-[#C3C5D8]/20 text-[12px] text-[#434655] mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#0051DF] shrink-0" />
          <span>Transfers from your primary TON wallet are non-custodial and instant.</span>
        </div>

        {/* Asset Selection */}
        <div className="mb-4">
          <label className="block text-[12px] font-semibold text-[#434655] mb-2">
            Select Deposit Asset
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedAsset('USDT')}
              className={`py-2 px-3 rounded-[14px] flex items-center justify-center gap-2 border font-semibold text-[13px] transition-all cursor-pointer ${
                selectedAsset === 'USDT'
                  ? 'border-[#0051DF] bg-[#2F6BFF]/10 text-[#0051DF]'
                  : 'border-[#C3C5D8]/30 bg-[#F2F3FB] text-[#191C21]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#00885B]"></span>
              <span>USD Tether (USDT)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedAsset('TON')}
              className={`py-2 px-3 rounded-[14px] flex items-center justify-center gap-2 border font-semibold text-[13px] transition-all cursor-pointer ${
                selectedAsset === 'TON'
                  ? 'border-[#0051DF] bg-[#2F6BFF]/10 text-[#0051DF]'
                  : 'border-[#C3C5D8]/30 bg-[#F2F3FB] text-[#191C21]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#0051DF]"></span>
              <span>The Open Network (TON)</span>
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[12px] font-semibold text-[#434655]">Amount ({selectedAsset})</label>
            <span className="text-[11px] font-mono-data text-[#434655]">
              Main Wallet Balance: 4,820 {selectedAsset}
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-[#F2F3FB] border border-[#C3C5D8]/40 rounded-[16px] text-[18px] font-tabular font-bold text-[#191C21] focus:outline-none focus:border-[#0051DF]"
            />
            <button
              type="button"
              onClick={() => setAmount('1000')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#0051DF] px-2 py-1 bg-white rounded-md border border-[#0051DF]/20 hover:bg-[#0051DF]/5 cursor-pointer"
            >
              MAX
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="grid grid-cols-4 gap-1.5 mt-2.5">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAmount(p.toString())}
                className="py-1.5 text-[11px] font-tabular font-semibold rounded-lg bg-[#F2F3FB] hover:bg-[#E6E8EF] text-[#434655] border border-[#C3C5D8]/20 transition-all cursor-pointer"
              >
                +${p}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Target */}
        <div className="bg-[#F2F3FB] p-3 rounded-[14px] text-[11px] text-[#434655] flex justify-between items-center mb-5">
          <span>Sub-Wallet Destination:</span>
          <span className="font-mono-data font-bold text-[#0051DF]">{subWallet.shortAddress}</span>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={handleFund}
          disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
          className="w-full py-3.5 rounded-full bg-[#2F6BFF] hover:bg-[#0051DF] text-white font-semibold text-[14px] shadow-[0_4px_12px_rgba(47,107,255,0.25)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          {successMsg ? (
            <>
              <Check className="w-5 h-5 text-white" />
              <span>Capital Allocated Successfully!</span>
            </>
          ) : isSubmitting ? (
            <span>Processing Blockchain Transaction...</span>
          ) : (
            <span>Confirm &amp; Fund Capital</span>
          )}
        </button>
      </div>
    </div>
  );
};
