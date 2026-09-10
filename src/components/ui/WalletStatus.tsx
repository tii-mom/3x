import React from 'react';
import { ShieldCheck, Wallet } from 'lucide-react';
import { formatAddress } from '../../utils/formatters';

interface WalletStatusProps {
  ownerAddress?: string;
  subWalletAddress?: string;
  isConnected?: boolean;
  network?: string;
  className?: string;
  onClick?: () => void;
}

export const WalletStatus: React.FC<WalletStatusProps> = ({
  ownerAddress = 'EQBx...LmNo',
  subWalletAddress = 'EQD9...42a0',
  isConnected = true,
  network = 'TON Mainnet',
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2E7F0] shadow-sm text-[12px] font-medium text-[#11141C] cursor-pointer hover:border-[#CBD5E1] transition-all ${className}`}
    >
      <div className="w-2 h-2 rounded-full bg-[#00B074] animate-pulse" />
      <span className="font-semibold flex items-center gap-1">
        <Wallet className="w-3.5 h-3.5 text-[#2F6BFF]" />
        {formatAddress(ownerAddress)}
      </span>
      <span className="text-[#94A3B8]">|</span>
      <span className="text-[11px] text-[#64748B] flex items-center gap-1 font-mono">
        <ShieldCheck className="w-3 h-3 text-[#00B074]" />
        Sub: {formatAddress(subWalletAddress, 4, 3)}
      </span>
    </div>
  );
};
