import React from 'react';
import { X, ShieldCheck, Check } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, topic }) => {
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
          <div className="w-10 h-10 rounded-full bg-[#006686]/10 text-[#006686] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-[18px] text-[#191C21]">
              Institutional Guardrails
            </h3>
            <p className="text-[12px] text-[#434655]">Smart contract safety verification</p>
          </div>
        </div>

        <div className="p-4 rounded-[16px] bg-[#F2F3FB] border border-[#C3C5D8]/20 space-y-3 text-[13px] text-[#434655] mb-5 leading-relaxed">
          <div>
            <h4 className="font-semibold text-[#191C21]">Max Single-Action Cap (5.0%)</h4>
            <p className="text-[12px] mt-0.5">
              The autonomous agent is cryptographically restricted from deploying more than 5.0% of total
              portfolio equity in any single swap or liquidity position. This mathematically prevents systemic
              loss from sudden pool drainage.
            </p>
          </div>

          <div className="border-t border-[#C3C5D8]/30 pt-2">
            <h4 className="font-semibold text-[#191C21]">Safe Reserve Floor ($500.00)</h4>
            <p className="text-[12px] mt-0.5">
              An inviolable capital cushion that smart contract logic cannot touch, allocate, or leverage.
              This reserve ensures complete solvency under any market volatility regime.
            </p>
          </div>

          <div className="border-t border-[#C3C5D8]/30 pt-2">
            <h4 className="font-semibold text-[#191C21]">Slippage &amp; Execution Shield (&lt;0.05%)</h4>
            <p className="text-[12px] mt-0.5">
              Strict MEV-resistant routing. Transactions exceeding 5 basis points of slippage are automatically
              reverted at the consensus layer before block inclusion.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-full bg-[#191C21] hover:bg-[#2E3036] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Understood</span>
        </button>
      </div>
    </div>
  );
};
