import React, { useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  Lock,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import { useAppStore } from '../../features/wallet/walletStore';
import { formatAddress, formatUsd } from '../../utils/formatters';
import { useToast } from '../feedback/Toast';

interface TonWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFund?: () => void;
  onOpenWithdraw?: () => void;
}

export const TonWalletModal: React.FC<TonWalletModalProps> = ({
  isOpen,
  onClose,
  onOpenFund,
  onOpenWithdraw,
}) => {
  const { wallet, portfolio, controls, connectWallet, disconnectWallet } = useAppStore();
  const { showToast } = useToast();
  const [copiedPrimary, setCopiedPrimary] = useState(false);
  const [copiedSub, setCopiedSub] = useState(false);

  if (!isOpen) return null;

  const fullPrimaryAddress = 'EQBxt_P38LmvNk4w0V9l8X_1yqZaC0N8_LmNo994821';
  const fullSubAddress = 'EQD9tPj4xZ9Q9c_42a09kLmPq0w8zYmU2x1v5a0b89f';

  const copyToClipboard = (text: string, isSub: boolean) => {
    navigator.clipboard.writeText(text);
    if (isSub) {
      setCopiedSub(true);
      setTimeout(() => setCopiedSub(false), 2000);
    } else {
      setCopiedPrimary(true);
      setTimeout(() => setCopiedPrimary(false), 2000);
    }
    showToast(`Copied ${isSub ? 'sub-wallet' : 'primary wallet'} address`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E2E7F0] relative space-y-5 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#090B10] text-[#3AC8FF] flex items-center justify-center font-bold shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-[17px] text-[#11141C]">
                TON Wallet Connection
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-[#00B074] font-medium font-mono">
                <span className="w-2 h-2 rounded-full bg-[#00B074] animate-pulse" />
                <span>Connected to TON Mainnet</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0F3FA] hover:bg-[#E2E7F0] flex items-center justify-center text-[#64748B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Wallet Section */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E7F0] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              Primary Wallet (Owner)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E2E7F0] text-[#11141C] font-semibold">
              Personal Sovereign
            </span>
          </div>

          <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#E2E7F0]">
            <span className="font-mono text-[13px] text-[#11141C] font-semibold">
              {formatAddress(fullPrimaryAddress, 8, 6)}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => copyToClipboard(fullPrimaryAddress, false)}
                className="p-1.5 rounded-lg hover:bg-[#F0F3FA] text-[#64748B] hover:text-[#11141C] transition-colors cursor-pointer"
                title="Copy Address"
              >
                {copiedPrimary ? (
                  <Check className="w-3.5 h-3.5 text-[#00B074]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <a
                href={`https://tonscan.org/address/${fullPrimaryAddress}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg hover:bg-[#F0F3FA] text-[#64748B] hover:text-[#2F6BFF] transition-colors"
                title="View on Tonscan"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <div className="bg-white p-2.5 rounded-xl border border-[#E2E7F0]">
              <div className="text-[10px] text-[#64748B]">TON Balance</div>
              <div className="font-mono font-bold text-[#11141C] mt-0.5">
                {wallet.balanceTon.toFixed(1)} TON
              </div>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#E2E7F0]">
              <div className="text-[10px] text-[#64748B]">USDT Balance</div>
              <div className="font-mono font-bold text-[#11141C] mt-0.5">
                ${wallet.balanceUsdt.toFixed(2)} USDT
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Wallet Security Isolation Box */}
        <div className="p-4 rounded-2xl bg-[#090B10] text-white border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#3AC8FF]">
              <ShieldCheck className="w-4 h-4" />
              <span>Isolated Smart Sub-Wallet</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#3AC8FF]/20 text-[#3AC8FF] font-semibold border border-[#3AC8FF]/30">
              Contract Active
            </span>
          </div>

          <div className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-xl border border-white/10">
            <span className="font-mono text-[13px] text-white/90">
              {formatAddress(fullSubAddress, 8, 6)}
            </span>
            <button
              onClick={() => copyToClipboard(fullSubAddress, true)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Copy Sub-Wallet Address"
            >
              {copiedSub ? (
                <Check className="w-3.5 h-3.5 text-[#00B074]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="space-y-1.5 text-[11px] text-white/70 pt-1">
            <div className="flex justify-between">
              <span>Managed Capital:</span>
              <span className="font-mono font-bold text-white">{formatUsd(portfolio.nav)}</span>
            </div>
            <div className="flex justify-between">
              <span>Max Single Action Cap:</span>
              <span className="font-mono text-[#3AC8FF]">5% ({formatUsd(portfolio.nav * 0.05)})</span>
            </div>
            <div className="flex justify-between">
              <span>Downside Reserve Floor:</span>
              <span className="font-mono text-[#00B074]">{formatUsd(portfolio.protectedWealth)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1 gap-2">
          <button
            onClick={() => {
              if (wallet.isConnected) {
                disconnectWallet();
                showToast('Wallet disconnected', 'warning');
              } else {
                connectWallet();
                showToast('Wallet reconnected', 'success');
              }
              onClose();
            }}
            className="px-3.5 py-2 rounded-xl border border-[#E2E7F0] text-[12px] font-bold text-[#64748B] hover:text-[#EF4444] hover:border-[#EF4444]/30 hover:bg-[#EF4444]/5 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{wallet.isConnected ? 'Disconnect' : 'Connect'}</span>
          </button>

          <div className="flex items-center gap-2">
            {onOpenWithdraw && (
              <button
                onClick={() => {
                  onClose();
                  onOpenWithdraw();
                }}
                className="px-3.5 py-2 rounded-xl border border-[#E2E7F0] text-[12px] font-bold text-[#11141C] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                Withdraw
              </button>
            )}
            {onOpenFund && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFund();
                }}
                className="px-3.5 py-2 rounded-xl bg-[#2F6BFF] text-white text-[12px] font-bold hover:bg-[#1E56E0] transition-colors cursor-pointer shadow-xs"
              >
                Add Money
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
