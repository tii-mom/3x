import React from 'react';
import { Wallet, BadgeCheck, Plus, ArrowUpRight, KeyRound } from 'lucide-react';
import { SubWalletState } from '../types';

interface SubWalletSectionProps {
  subWallet: SubWalletState;
  onFundCapital: () => void;
  onWithdraw: () => void;
  onRevokePermissions: () => void;
}

export const SubWalletSection: React.FC<SubWalletSectionProps> = ({
  subWallet,
  onFundCapital,
  onWithdraw,
  onRevokePermissions,
}) => {
  return (
    <section
      id="section-subwallet"
      className="rounded-[24px] bg-white p-6 border border-[#C3C5D8]/30 shadow-[0_2px_8px_rgba(10,13,18,0.02)] space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[#C0E8FF] flex items-center justify-center text-[#004D66]">
          <Wallet className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-headline font-semibold text-[17px] text-[#191C21]">
            Sub-Wallet Permissions
          </h3>
          <p className="text-[12px] text-[#434655]">Non-custodial smart architecture</p>
        </div>
      </div>

      {/* Non-Custodial Ownership Clarification Card */}
      <div className="p-3.5 rounded-[16px] bg-[#F2F3FB]/90 border border-[#C3C5D8]/30 flex gap-3 items-start">
        <BadgeCheck className="w-5 h-5 text-[#0051DF] shrink-0 mt-0.5" />
        <p className="text-[13px] leading-relaxed text-[#434655]">
          Your AI operates strictly within this dedicated smart sub-wallet. Your personal main TON wallet is{' '}
          <strong className="text-[#191C21] font-semibold">100% isolated</strong> and cannot be drained.
        </p>
      </div>

      {/* Action Pill Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Fund Capital (Agent Blue) */}
        <button
          id="btn-fund-capital"
          type="button"
          onClick={onFundCapital}
          className="min-h-[44px] w-full rounded-full bg-[#2F6BFF] hover:bg-[#0051DF] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(47,107,255,0.25)] transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Fund Capital</span>
        </button>

        {/* Withdraw to Main Wallet */}
        <button
          id="btn-withdraw"
          type="button"
          onClick={onWithdraw}
          className="min-h-[44px] w-full rounded-full bg-[#E6E8EF] hover:bg-[#E1E2EA] text-[#191C21] text-[13px] font-semibold flex items-center justify-center gap-1.5 border border-[#C3C5D8]/30 transition-all active:scale-[0.98] cursor-pointer"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Withdraw</span>
        </button>
      </div>

      {/* Revoke AI Permissions Action */}
      <div className="pt-2 text-center">
        <button
          id="btn-revoke-permissions"
          type="button"
          onClick={onRevokePermissions}
          className="inline-flex items-center gap-1.5 text-[12px] text-[#737687] hover:text-[#BA1A1A] transition-colors duration-150 py-1 px-3 cursor-pointer"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Revoke AI Permissions &amp; Liquidate to Main</span>
        </button>
      </div>
    </section>
  );
};
