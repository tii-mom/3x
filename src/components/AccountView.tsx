import React from 'react';
import { User, ShieldCheck, ExternalLink, KeyRound, Bell, Globe, Check } from 'lucide-react';
import { SubWalletState } from '../types';

interface AccountViewProps {
  subWallet: SubWalletState;
  onBackToAI: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ subWallet }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 p-4 rounded-[20px] bg-white border border-[#C3C5D8]/30">
        <div className="w-12 h-12 rounded-full bg-[#2F6BFF]/10 text-[#0051DF] flex items-center justify-center font-bold font-headline text-[18px]">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-headline font-bold text-[16px] text-[#191C21]">TON Executive Tier</h2>
          <p className="text-[12px] text-[#434655] font-mono-data">{subWallet.shortAddress}</p>
        </div>
      </div>

      {/* Network & Protocol Status */}
      <div className="p-4 rounded-[20px] bg-white border border-[#C3C5D8]/30 space-y-3">
        <h3 className="font-semibold text-[14px] text-[#191C21]">Network Architecture</h3>

        <div className="space-y-2 text-[12px]">
          <div className="flex justify-between py-1 border-b border-[#C3C5D8]/20">
            <span className="text-[#434655]">Consensus Network</span>
            <span className="font-semibold text-[#191C21] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> TON Mainnet
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#C3C5D8]/20">
            <span className="text-[#434655]">Contract Version</span>
            <span className="font-mono-data text-[#191C21]">v4.8-guardian-release</span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#C3C5D8]/20">
            <span className="text-[#434655]">Security Audit</span>
            <span className="text-[#006C48] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> CertiK &amp; SlowMist Verified
            </span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-[#434655]">Execution RPC</span>
            <span className="font-mono-data text-[#0051DF]">toncenter.com/api/v2</span>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="p-4 rounded-[20px] bg-white border border-[#C3C5D8]/30 space-y-3">
        <h3 className="font-semibold text-[14px] text-[#191C21]">Agent Preferences</h3>

        <div className="flex items-center justify-between py-1 text-[13px]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#737687]" />
            <span className="text-[#191C21]">Rebalance Push Notifications</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
        </div>

        <div className="flex items-center justify-between py-1 text-[13px] border-t border-[#C3C5D8]/20 pt-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#737687]" />
            <span className="text-[#191C21]">MEV Frontrunning Protection</span>
          </div>
          <span className="text-[11px] font-mono-data font-bold text-[#006C48]">Active</span>
        </div>
      </div>
    </div>
  );
};
