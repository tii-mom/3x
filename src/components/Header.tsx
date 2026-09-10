import React, { useState } from 'react';
import { ArrowLeft, Check, Copy } from 'lucide-react';
import { AutopilotState, GuardrailsState, SubWalletState } from '../types';

interface HeaderProps {
  autopilot: AutopilotState;
  guardrails: GuardrailsState;
  subWallet: SubWalletState;
  onBack?: () => void;
  onOpenWalletDetails: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  autopilot,
  guardrails,
  subWallet,
  onBack,
  onOpenWalletDetails,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(subWallet.fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isRunning = autopilot.isActive && !guardrails.isEmergencyPaused;

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 bg-[#F9F9FF]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between min-h-[44px] shadow-[0_2px_8px_rgba(10,13,18,0.03)] border-b border-[#C3C5D8]/20"
    >
      <div className="flex items-center gap-3">
        <button
          id="btn-back"
          onClick={onBack}
          aria-label="Go Back"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F2F3FB] hover:bg-[#ECEDF5] text-[#191C21] transition-all active:scale-[0.98] cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-headline font-semibold text-[17px] leading-[22px] tracking-tight text-[#191C21]">
            AI Control Center
          </h1>
          <div className="flex items-center gap-1.5 text-[11px] leading-[14px] text-[#434655]">
            <span className="font-medium">Sub-Wallet</span>
            <span className="inline-block w-1 h-1 rounded-full bg-[#C3C5D8]"></span>
            <button
              id="btn-copy-subwallet"
              onClick={handleCopy}
              className="text-[#0051DF] font-tabular font-medium hover:underline flex items-center gap-1 cursor-pointer"
              title="Click to copy full address"
            >
              <span>{subWallet.shortAddress}</span>
              {copied ? (
                <Check className="w-3 h-3 text-[#00885B]" />
              ) : (
                <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Running Status Indicator Pill */}
      <button
        id="btn-status-indicator"
        onClick={onOpenWalletDetails}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECEDF5] border border-[#C3C5D8]/40 hover:bg-[#E6E8EF] transition-all cursor-pointer"
      >
        {guardrails.isEmergencyPaused ? (
          <>
            <span className="h-2 w-2 rounded-full bg-[#BA1A1A]"></span>
            <span className="font-mono-data text-[11px] text-[#BA1A1A] font-semibold">
              Halted
            </span>
          </>
        ) : isRunning ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00885B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006C48]"></span>
            </span>
            <span className="font-mono-data text-[11px] text-[#006C48] font-semibold">
              Running
            </span>
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-[#737687]"></span>
            <span className="font-mono-data text-[11px] text-[#434655] font-semibold">
              Paused
            </span>
          </>
        )}
      </button>
    </header>
  );
};
