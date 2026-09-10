import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShareCard } from '../components/ui/ShareCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { useAppStore } from '../features/wallet/walletStore';
import { Check, Copy, Download, Share2, Sparkles } from 'lucide-react';
import { formatUsd } from '../utils/formatters';

export const SharePage: React.FC = () => {
  const navigate = useNavigate();
  const { portfolio, goal, controls } = useAppStore();
  const [ratio, setRatio] = useState<'1:1' | '9:16'>('1:1');
  const [copied, setCopied] = useState(false);

  const shareText = `🚀 My Autonomous AI Wealth Journey on TON:\n• Started: ${formatUsd(
    portfolio.startingCapital
  )}\n• Current: ${formatUsd(portfolio.nav)}\n• Level: 0${
    goal.currentLevel
  }\n• Next Milestone: ${formatUsd(
    portfolio.nextMilestone
  )}\n• Autopilot: ${controls.autopilotStatus}\n\nManaged safely by non-custodial AI Guardian!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#11141C] font-headline tracking-tight">
            Share Your Journey
          </h1>
          <p className="text-[13px] text-[#64748B]">
            Deterministic share cards formatted for social stories and updates.
          </p>
        </div>

        {/* Aspect Ratio Toggle */}
        <div className="flex bg-[#F0F3FA] p-1 rounded-xl">
          <button
            onClick={() => setRatio('1:1')}
            className={`px-3 py-1 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
              ratio === '1:1' ? 'bg-white text-[#11141C] shadow-2xs' : 'text-[#64748B]'
            }`}
          >
            1:1 Square
          </button>
          <button
            onClick={() => setRatio('9:16')}
            className={`px-3 py-1 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
              ratio === '9:16' ? 'bg-white text-[#11141C] shadow-2xs' : 'text-[#64748B]'
            }`}
          >
            9:16 Story
          </button>
        </div>
      </div>

      {/* Share Card Display */}
      <div className="flex justify-center py-4">
        <ShareCard
          aspectRatio={ratio}
          startedAmount={portfolio.startingCapital}
          currentNav={portfolio.nav}
          nextMilestone={portfolio.nextMilestone}
          level={goal.currentLevel}
          autopilotStatus={controls.autopilotStatus === 'RUNNING' ? 'Running' : 'Standby'}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <PrimaryButton
          size="lg"
          onClick={handleCopy}
          icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        >
          {copied ? 'Copied Summary to Clipboard!' : 'Copy Summary Message'}
        </PrimaryButton>
        <SecondaryButton
          size="lg"
          onClick={() => navigate('/app')}
        >
          Back to Overview
        </SecondaryButton>
      </div>
    </div>
  );
};
