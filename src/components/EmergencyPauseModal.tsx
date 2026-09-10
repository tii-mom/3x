import React from 'react';
import { X, AlertOctagon, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface EmergencyPauseModalProps {
  isOpen: boolean;
  isPaused: boolean;
  onClose: () => void;
  onConfirmToggle: () => void;
}

export const EmergencyPauseModal: React.FC<EmergencyPauseModalProps> = ({
  isOpen,
  isPaused,
  onClose,
  onConfirmToggle,
}) => {
  if (!isOpen) return null;

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
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isPaused ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
            }`}
          >
            {isPaused ? <CheckCircle2 className="w-6 h-6" /> : <AlertOctagon className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-headline font-bold text-[18px] text-[#191C21]">
              {isPaused ? 'Resume Autonomous Agent?' : 'Trigger Emergency Pause?'}
            </h3>
            <p className="text-[12px] text-[#434655]">
              {isPaused ? 'Reinstate algorithmic pool rebalancing' : 'Institutional circuit breaker'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-[16px] bg-[#F2F3FB] border border-[#C3C5D8]/30 text-[13px] leading-relaxed text-[#434655] mb-5 space-y-2">
          {isPaused ? (
            <p>
              Resuming will reactivate the autonomous trading agent across TON liquidity vaults. The
              v4.8 Guardian telemetry will resume scanning 124 pools with the 5.0% single-action cap
              active.
            </p>
          ) : (
            <>
              <p className="font-semibold text-[#BA1A1A] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Instant on-chain freeze</span>
              </p>
              <p>
                All ongoing orders, liquidity swaps on DeDust and STON.fi, and compounding cycles will
                freeze immediately. Your sub-wallet capital remains safe and untouched.
              </p>
            </>
          )}
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
            onClick={() => {
              onConfirmToggle();
              onClose();
            }}
            className={`py-3 px-4 rounded-full text-white font-semibold text-[13px] transition-all cursor-pointer ${
              isPaused ? 'bg-[#00885B] hover:bg-[#006C48]' : 'bg-[#BA1A1A] hover:bg-[#93000A]'
            }`}
          >
            {isPaused ? 'Confirm Resume' : 'Halt Everything'}
          </button>
        </div>
      </div>
    </div>
  );
};
