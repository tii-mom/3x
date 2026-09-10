import React, { useState } from 'react';
import { X, KeyRound, AlertTriangle, Check } from 'lucide-react';
import { SubWalletState } from '../types';

interface RevokePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subWallet: SubWalletState;
  currentValue: number;
  onConfirmRevoke: () => void;
}

export const RevokePermissionsModal: React.FC<RevokePermissionsModalProps> = ({
  isOpen,
  onClose,
  subWallet,
  currentValue,
  onConfirmRevoke,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [done, setDone] = useState(false);

  if (!isOpen) return null;

  const handleRevoke = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setDone(true);
      setTimeout(() => {
        onConfirmRevoke();
        setDone(false);
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[440px] bg-white rounded-[28px] p-6 shadow-2xl border border-[#C3C5D8]/30 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F2F3FB] hover:bg-[#ECEDF5] flex items-center justify-center text-[#434655] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 text-[#BA1A1A] flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-[18px] text-[#191C21]">
              Revoke &amp; Liquidate
            </h3>
            <p className="text-[12px] text-[#434655]">
              Terminate autonomous sub-wallet contract
            </p>
          </div>
        </div>

        <div className="p-4 rounded-[16px] bg-red-50 border border-red-200/60 mb-5 space-y-2">
          <div className="flex items-center gap-2 text-[#BA1A1A] font-semibold text-[13px]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Full Liquidation to Main Wallet</span>
          </div>
          <p className="text-[12px] text-[#434655] leading-relaxed">
            This operation will immediately liquidate all active pool shares (${currentValue.toFixed(2)} USD),
            unwind liquidity pairs, revoke AI signing keys, and sweep 100% of funds back into your
            main wallet <span className="font-mono-data font-bold text-[#191C21]">{subWallet.mainWalletAddress.slice(0, 10)}...</span>.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-full bg-[#E6E8EF] hover:bg-[#E1E2EA] text-[#191C21] font-semibold text-[13px] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRevoke}
            disabled={isProcessing}
            className="py-3 px-4 rounded-full bg-[#BA1A1A] hover:bg-[#93000A] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {done ? (
              <>
                <Check className="w-4 h-4" />
                <span>Liquidated!</span>
              </>
            ) : isProcessing ? (
              <span>Executing Liquidation...</span>
            ) : (
              <span>Confirm Liquidation</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
