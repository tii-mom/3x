import React, { useState } from 'react';
import { useAppStore } from '../features/wallet/walletStore';
import { useToast } from '../components/feedback/Toast';
import { AutopilotSection } from '../components/AutopilotSection';
import { GoalMilestoneSection } from '../components/GoalMilestoneSection';
import { GuardrailsSection } from '../components/GuardrailsSection';
import { SubWalletSection } from '../components/SubWalletSection';

// Modals
import { FundCapitalModal } from '../components/FundCapitalModal';
import { WithdrawModal } from '../components/WithdrawModal';
import { EmergencyPauseModal } from '../components/EmergencyPauseModal';
import { ReasoningModal } from '../components/ReasoningModal';
import { MarketScannerModal } from '../components/MarketScannerModal';
import { TargetMilestoneModal } from '../components/TargetMilestoneModal';
import { RevokePermissionsModal } from '../components/RevokePermissionsModal';
import { InfoModal } from '../components/InfoModal';
import {
  AutopilotState,
  GuardrailsState,
  MilestoneState,
  ReinvestmentRule,
  StrategyOperationalMode,
  SubWalletState,
} from '../types';

export const AIPage: React.FC = () => {
  const {
    portfolio,
    goal,
    controls,
    wallet,
    toggleAutopilot,
    addCapital,
    withdrawCapital,
    setEmergencyPause,
    revokeSubWallet,
    updateTargetGoal,
    setAiMode,
    setProfitPreference,
  } = useAppStore();

  const { showToast } = useToast();

  // Modals visibility
  const [isFundOpen, setIsFundOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isReasoningOpen, setIsReasoningOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [infoTopic, setInfoTopic] = useState<string | null>(null);

  // Adapters for Stitch sub-components
  const autopilotState: AutopilotState = {
    isActive: controls.autopilotStatus === 'RUNNING',
    version: 'v4.8 Guardian',
    poolsLive: 124,
    lastAuditMinutesAgo: portfolio.lastReviewMinutes,
    currentApy: 18.2,
    volatilityRate: 0.04,
    pair: 'TON/USDT',
    reasoningSnippet: 'Holding TON/USDT liquidity at 18.2% APY. Volatility threshold stable at <0.04%.',
  };

  const milestoneState: MilestoneState = {
    currentValue: portfolio.nav,
    originValue: portfolio.startingCapital,
    targetValue: portfolio.nextMilestone,
    step: goal.currentLevel,
    totalSteps: goal.levels.length,
    strategyMode: portfolio.aiMode.toLowerCase() as StrategyOperationalMode,
    reinvestmentRule:
      controls.profitPreference === 'COMPOUND_ALL'
        ? 'auto-compound'
        : controls.profitPreference === 'WITHDRAW_PROFIT'
        ? 'take-usdt'
        : 'split-50-50',
  };

  const guardrailsState: GuardrailsState = {
    maxCapPercent: controls.singleActionCapPercent,
    safeReserveFloor: controls.safeReserveFloor,
    slippageMaxPercent: controls.slippageTolerancePercent,
    isEmergencyPaused: controls.isEmergencyPaused,
  };

  const subWalletState: SubWalletState = {
    shortAddress: wallet.subWalletAddress,
    fullAddress: 'EQD9tPj4xZ9Q9c_42a09kLmPq0w8zYmU2x1v5a0b89f',
    mainWalletAddress: wallet.ownerAddress,
    allocatedCapital: wallet.subWalletAllocatedUsd,
    isolated: true,
  };

  const handleSelectStrategy = (mode: StrategyOperationalMode) => {
    setAiMode(mode.toUpperCase() as any);
    showToast(`AI Operational Strategy updated to ${mode.toUpperCase()}`, 'ai');
  };

  const handleSelectReinvestment = (rule: ReinvestmentRule) => {
    const pref =
      rule === 'auto-compound'
        ? 'COMPOUND_ALL'
        : rule === 'take-usdt'
        ? 'WITHDRAW_PROFIT'
        : 'SPLIT_PROFIT';
    setProfitPreference(pref);
    showToast(
      rule === 'auto-compound'
        ? 'Profit Reinvestment set to 100% Auto-Compound'
        : rule === 'take-usdt'
        ? 'Profit Reinvestment set to Take USDT to Main Wallet'
        : 'Profit Reinvestment set to 50% Compound / 50% USDT',
      'success'
    );
  };

  const handleToggleAutopilot = () => {
    toggleAutopilot();
    const nextStatus = controls.autopilotStatus === 'RUNNING' ? 'Paused' : 'Running';
    showToast(
      `Autopilot ${nextStatus}: ${nextStatus === 'Running' ? 'Guardian active' : 'Holding positions'}`,
      nextStatus === 'Running' ? 'success' : 'warning'
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#11141C] font-headline tracking-tight">
          AI Strategy Control Center
        </h1>
        <p className="text-[13px] text-[#64748B]">
          Institutional Guardian engine, milestone trajectory, and sub-wallet permissioning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Autopilot & Milestones */}
        <div className="lg:col-span-7 space-y-6">
          <AutopilotSection
            autopilot={autopilotState}
            guardrails={guardrailsState}
            onToggleAutopilot={handleToggleAutopilot}
            onOpenReasoning={() => setIsReasoningOpen(true)}
            onOpenPools={() => setIsScannerOpen(true)}
          />

          <GoalMilestoneSection
            milestone={milestoneState}
            onSelectStrategy={handleSelectStrategy}
            onSelectReinvestment={handleSelectReinvestment}
            onEditTarget={() => setIsTargetOpen(true)}
          />
        </div>

        {/* Right Column: Guardrails & Sub-Wallet */}
        <div className="lg:col-span-5 space-y-6">
          <GuardrailsSection
            guardrails={guardrailsState}
            currentValue={portfolio.nav}
            onOpenInfo={(topic) => setInfoTopic(topic)}
            onEmergencyHalt={() => setIsEmergencyOpen(true)}
          />

          <SubWalletSection
            subWallet={subWalletState}
            onFundCapital={() => setIsFundOpen(true)}
            onWithdraw={() => setIsWithdrawOpen(true)}
            onRevokePermissions={() => setIsRevokeOpen(true)}
          />
        </div>
      </div>

      {/* Modals & Drawers */}
      <FundCapitalModal
        isOpen={isFundOpen}
        onClose={() => setIsFundOpen(false)}
        subWallet={subWalletState}
        onConfirmFund={(amount, asset) => {
          addCapital(amount, asset);
          showToast(`Successfully added $${amount} to sub-wallet`, 'success');
        }}
      />

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        subWallet={subWalletState}
        currentValue={portfolio.nav}
        safeReserveFloor={guardrailsState.safeReserveFloor}
        onConfirmWithdraw={(amount) => {
          withdrawCapital(amount);
          showToast(`Withdrew $${amount} to main wallet`, 'success');
        }}
      />

      <EmergencyPauseModal
        isOpen={isEmergencyOpen}
        isPaused={controls.isEmergencyPaused}
        onClose={() => setIsEmergencyOpen(false)}
        onConfirmToggle={() => {
          const next = !controls.isEmergencyPaused;
          setEmergencyPause(next);
          showToast(
            next ? 'EMERGENCY HALT ACTIVATED - Execution frozen' : 'Emergency pause released',
            next ? 'error' : 'success'
          );
        }}
      />

      <ReasoningModal
        isOpen={isReasoningOpen}
        onClose={() => setIsReasoningOpen(false)}
        autopilot={autopilotState}
      />

      <MarketScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        poolsCount={autopilotState.poolsLive}
      />

      <TargetMilestoneModal
        isOpen={isTargetOpen}
        onClose={() => setIsTargetOpen(false)}
        milestone={milestoneState}
        onSave={(origin, target) => {
          updateTargetGoal(target);
          showToast(`Updated target milestone to $${target}`, 'success');
        }}
      />

      <RevokePermissionsModal
        isOpen={isRevokeOpen}
        onClose={() => setIsRevokeOpen(false)}
        subWallet={subWalletState}
        currentValue={portfolio.nav}
        onConfirmRevoke={() => {
          revokeSubWallet();
          showToast('Smart contract permissions revoked and capital recalled', 'warning');
        }}
      />

      <InfoModal
        isOpen={!!infoTopic}
        onClose={() => setInfoTopic(null)}
        topic={infoTopic || ''}
      />
    </div>
  );
};
