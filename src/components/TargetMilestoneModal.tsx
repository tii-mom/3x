import React, { useState } from 'react';
import { X, Target, Check } from 'lucide-react';
import { MilestoneState } from '../types';

interface TargetMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: MilestoneState;
  onSave: (origin: number, target: number) => void;
}

export const TargetMilestoneModal: React.FC<TargetMilestoneModalProps> = ({
  isOpen,
  onClose,
  milestone,
  onSave,
}) => {
  const [origin, setOrigin] = useState<string>(milestone.originValue.toString());
  const [target, setTarget] = useState<string>(milestone.targetValue.toString());

  if (!isOpen) return null;

  const handleSave = () => {
    const numOrigin = parseFloat(origin);
    const numTarget = parseFloat(target);
    if (!isNaN(numOrigin) && !isNaN(numTarget) && numTarget > numOrigin) {
      onSave(numOrigin, numTarget);
      onClose();
    }
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
          <div className="w-10 h-10 rounded-full bg-[#2F6BFF]/10 text-[#0051DF] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-[18px] text-[#191C21]">
              Customize Target Goal
            </h3>
            <p className="text-[12px] text-[#434655]">
              Adjust growth roadmap and milestone endpoints
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-[12px] font-semibold text-[#434655] mb-1.5">
              Origin Starting Capital ($)
            </label>
            <input
              type="number"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F2F3FB] border border-[#C3C5D8]/40 rounded-[14px] text-[16px] font-tabular font-bold text-[#191C21] focus:outline-none focus:border-[#0051DF]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#434655] mb-1.5">
              Target Milestone Goal ($)
            </label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F2F3FB] border border-[#C3C5D8]/40 rounded-[14px] text-[16px] font-tabular font-bold text-[#0051DF] focus:outline-none focus:border-[#0051DF]"
            />
          </div>

          <div className="flex gap-2">
            {[2000, 3000, 5000, 10000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setTarget(val.toString())}
                className="flex-1 py-1.5 text-[11px] font-tabular font-semibold rounded-lg bg-[#F2F3FB] hover:bg-[#E6E8EF] text-[#434655] border border-[#C3C5D8]/20 cursor-pointer"
              >
                ${val.toLocaleString()}
              </button>
            ))}
          </div>
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
            onClick={handleSave}
            className="py-3 px-4 rounded-full bg-[#2F6BFF] hover:bg-[#0051DF] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Milestone</span>
          </button>
        </div>
      </div>
    </div>
  );
};
