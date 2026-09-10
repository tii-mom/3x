import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { formatUsd } from '../utils/formatters';

export const OnboardingCapitalPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCapital, setSelectedCapital] = useState<number>(100);
  const [customVal, setCustomVal] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const presets = [30, 100, 300];

  const handleSelectPreset = (amount: number) => {
    setIsCustom(false);
    setSelectedCapital(amount);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCustomVal(e.target.value);
    if (!isNaN(val) && val > 0) {
      setSelectedCapital(val);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#11141C] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      {/* Step Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-full bg-white border border-[#E2E7F0] flex items-center justify-center text-[#64748B] hover:text-[#11141C] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-[12px] font-mono text-[#64748B]">Step 1 of 4</span>
          <div className="w-9" />
        </div>

        <div>
          <h1 className="text-[24px] sm:text-[26px] font-extrabold text-[#11141C] font-headline tracking-tight">
            How much should your AI start with?
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1">
            Choose an amount you are comfortable putting at risk.
          </p>
        </div>
      </div>

      {/* Capital Preset Selector */}
      <div className="space-y-4 my-8">
        <div className="grid grid-cols-2 gap-3">
          {presets.map((amount) => (
            <button
              key={amount}
              onClick={() => handleSelectPreset(amount)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                !isCustom && selectedCapital === amount
                  ? 'bg-white border-[#2F6BFF] ring-2 ring-[#2F6BFF]/15 shadow-sm'
                  : 'bg-white border-[#E2E7F0] hover:border-[#CBD5E1]'
              }`}
            >
              {amount === 100 && (
                <span className="absolute top-2.5 right-2.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00B074]/15 text-[#00B074]">
                  Recommended
                </span>
              )}
              <div className="text-[12px] text-[#64748B]">Starting Capital</div>
              <div className="text-[24px] font-extrabold text-[#11141C] font-mono mt-1">
                {formatUsd(amount, 0, 0)}
              </div>
            </button>
          ))}

          {/* Custom Amount Button/Input */}
          <div
            onClick={() => setIsCustom(true)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
              isCustom
                ? 'bg-white border-[#2F6BFF] ring-2 ring-[#2F6BFF]/15 shadow-sm'
                : 'bg-white border-[#E2E7F0] hover:border-[#CBD5E1]'
            }`}
          >
            <div className="text-[12px] text-[#64748B]">Custom Amount</div>
            {isCustom ? (
              <div className="flex items-center mt-1">
                <span className="text-[18px] font-extrabold font-mono text-[#11141C] mr-1">$</span>
                <input
                  type="number"
                  autoFocus
                  value={customVal}
                  onChange={handleCustomChange}
                  placeholder="500"
                  className="w-full text-[20px] font-extrabold text-[#11141C] font-mono bg-transparent outline-none"
                />
              </div>
            ) : (
              <div className="text-[20px] font-extrabold text-[#64748B] font-mono mt-1">
                Custom...
              </div>
            )}
          </div>
        </div>

        {/* Clean Summary */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2E7F0] space-y-1 text-[13px]">
          <div className="flex justify-between items-center">
            <span className="text-[#64748B]">Starting capital:</span>
            <span className="font-bold text-[#11141C] font-mono text-[16px]">
              {formatUsd(selectedCapital, 0, 0)}
            </span>
          </div>
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-[#64748B]">Next step:</span>
            <span className="text-[#2F6BFF] font-medium">Choose your first milestone</span>
          </div>
        </div>
      </div>

      {/* Bottom Continue Action */}
      <div className="space-y-3">
        <PrimaryButton
          size="lg"
          onClick={() => {
            sessionStorage.setItem('onboarding_capital', selectedCapital.toString());
            navigate('/start/milestone');
          }}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Continue with {formatUsd(selectedCapital, 0, 0)}
        </PrimaryButton>

        <p className="text-[11px] text-center text-[#94A3B8] flex items-center justify-center gap-1.5 px-4 leading-normal">
          <ShieldAlert className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
          <span>Digital assets can lose value. Start with an amount you are comfortable risking.</span>
        </p>
      </div>
    </div>
  );
};
