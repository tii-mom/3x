import React from 'react';
import { X, Layers, TrendingUp, ShieldCheck } from 'lucide-react';

interface MarketScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  poolsCount: number;
}

const samplePools = [
  { pair: 'TON / USDT', dex: 'DeDust.io', apy: '18.2%', tvl: '$48.2M', score: '99/100', status: 'Allocated' },
  { pair: 'TON / USDT', dex: 'STON.fi', apy: '17.8%', tvl: '$62.1M', score: '98/100', status: 'Active' },
  { pair: 'tsTON / TON', dex: 'Tonstakers', apy: '4.8%', tvl: '$210M', score: '100/100', status: 'Protected' },
  { pair: 'TON / NOT', dex: 'DeDust.io', apy: '24.6%', tvl: '$12.4M', score: '89/100', status: 'Scanned' },
  { pair: 'TON / DOGS', dex: 'STON.fi', apy: '31.1%', tvl: '$8.9M', score: '84/100', status: 'Filtered' },
];

export const MarketScannerModal: React.FC<MarketScannerModalProps> = ({
  isOpen,
  onClose,
  poolsCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[480px] bg-white rounded-[28px] p-6 shadow-2xl border border-[#C3C5D8]/30 relative max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F2F3FB] hover:bg-[#ECEDF5] flex items-center justify-center text-[#434655] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#2F6BFF]/10 text-[#0051DF] flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-[18px] text-[#191C21]">
              Market Scanner ({poolsCount} Pools)
            </h3>
            <p className="text-[12px] text-[#434655]">
              Real-time liquidity and yield telemetry across TON
            </p>
          </div>
        </div>

        <div className="space-y-2.5 mb-5">
          {samplePools.map((pool, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-[16px] bg-[#F2F3FB] border border-[#C3C5D8]/20 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-headline font-bold text-[14px] text-[#191C21]">
                    {pool.pair}
                  </span>
                  <span className="text-[10px] font-mono-data text-[#434655] px-2 py-0.5 rounded bg-white border border-[#C3C5D8]/30">
                    {pool.dex}
                  </span>
                </div>
                <div className="text-[11px] text-[#434655] mt-0.5 flex items-center gap-2">
                  <span>TVL: {pool.tvl}</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5 text-[#006C48]">
                    <ShieldCheck className="w-3 h-3" /> Score {pool.score}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-tabular font-bold text-[15px] text-[#0051DF] flex items-center gap-0.5 justify-end">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {pool.apy}
                </span>
                <span
                  className={`text-[10px] font-mono-data font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                    pool.status === 'Allocated'
                      ? 'bg-[#2F6BFF]/15 text-[#0051DF]'
                      : pool.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-[#E1E2EA] text-[#434655]'
                  }`}
                >
                  {pool.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-full bg-[#191C21] text-white font-semibold text-[13px] hover:bg-[#2E3036] transition-all cursor-pointer"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
