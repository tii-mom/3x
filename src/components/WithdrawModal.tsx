import React, { useState } from 'react';
import { X, ArrowUpRight, Shield, Check, AlertTriangle } from 'lucide-react';
import { SubWalletState } from '../types';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  subWallet: SubWalletState;
  currentValue: number;
  safeReserveFloor: number;
  onConfirmWithdraw: (amount: number) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  subWallet,
  currentValue,
  safeReserveFloor,
  onConfirmWithdraw,
}) => {
  const maxAvailable = Math.max(0, currentValue - safeReserveFloor);
  const [amount, setAmount] = useState<string>(maxAvailable > 100 ? '100' : maxAvailable.toFixed(2));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleWithdraw = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;
    if (numericAmount > maxAvailable) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg(true);
      onConfirmWithdraw(numericAmount);
      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
      }, 1000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[460px] bg-white rounded-[28px] p-6 shadow-2xl border border-[#C3C5D8]/30 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F2F3FB] hover:bg-[#ECEDF5] flex items-center justify-center text-[#434655] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#E6E8EF] text-[#191C21] flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-[18px] text-[#191C21]">
              Withdraw to Main Wallet
            </h3>
            <p className="text-[12px] text-[#434655]">
              Return capital from sub-wallet to personal vault
            </p>
          </div>
        </div>

        {/* Floor Cushion Info */}
        <div className="p-3.5 rounded-[16px] bg-[#F2F3FB] border border-[#C3C5D8]/30 mb-4 space-y-1.5">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#434655]">Sub-Wallet Balance:</span>
            <span className="font-tabular font-bold text-[#191C21]">${currentValue.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#434655] flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#006C48]" />
              <span>Safe Reserve Floor:</span>
            </span>
            <span className="font-tabular font-bold text-[#006C48]">${safeReserveFloor.toFixed(2)} (Locked)</span>
          </div>
          <div className="border-t border-[#C3C5D8]/30 pt-1.5 flex items-center justify-between text-[12px]">
            <span className="text-[#191C21] font-semibold">Available to Withdraw:</span>
            <span className="font-tabular font-bold text-[#0051DF]">${maxAvailable.toFixed(2)}</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[12px] font-semibold text-[#434655]">Withdrawal Amount (USD)</label>
            <button
              type="button"
              onClick={() => setAmount(maxAvailable.toFixed(2))}
              className="text-[11px] font-bold text-[#0051DF] hover:underline cursor-pointer"
            >
              Set Max (${maxAvailable.toFixed(2)})
            </button>
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              max={maxAvailable}
              className="w-full px-4 py-3 bg-[#F2F3FB] border border-[#C3C5D8]/40 rounded-[16px] text-[18px] font-tabular font-bold text-[#191C21] focus:outline-none focus:border-[#0051DF]"
            />
          </div>

          {/* Quick preset chips */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[0.25, 0.5, 1].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setAmount((maxAvailable * pct).toFixed(2))}
                className="py-1.5 text-[11px] font-tabular font-semibold rounded-lg bg-[#F2F3FB] hover:bg-[#E6E8EF] text-[#434655] border border-[#C3C5D8]/20 cursor-pointer"
              >
                {pct === 1 ? '100% (Max)' : `${pct * 100}%`}
              </button>
            ))}
          </div>

          {parseFloat(amount) > maxAvailable && (
            <div className="mt-2 text-[12px] text-[#BA1A1A] flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Cannot withdraw below the $500.00 inviolable reserve floor.</span>
            </div>
          )}
        </div>

        {/* Destination Target */}
        <div className="bg-[#F2F3FB] p-3 rounded-[14px] text-[11px] text-[#434655] flex justify-between items-center mb-5">
          <span>Destination (Personal Main Wallet):</span>
          <span className="font-mono-data font-bold text-[#191C21]">{subWallet.mainWalletAddress.slice(0, 8)}...</span>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={handleWithdraw}
          disabled={
            isSubmitting ||
            !amount ||
            parseFloat(amount) <= 0 ||
            parseFloat(amount) > maxAvailable
          }
          className="w-full py-3.5 rounded-full bg-[#191C21] hover:bg-[#2E3036] text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          {successMsg ? (
            <>
              <Check className="w-5 h-5 text-emerald-400" />
              <span>Withdrawal Sent to Main Wallet!</span>
            </>
          ) : isSubmitting ? (
            <span>Authorizing Zero-Slippage Transfer...</span>
          ) : (
            <span>Execute Withdrawal</span>
          )}
        </button>
      </div>
    </div>
  );
};
