import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowDownLeft,
  Bot,
  LogOut,
  Pause,
  Play,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { ConfirmationDialog } from '../components/feedback/ConfirmationDialog';
import { BottomSheet } from '../components/feedback/BottomSheet';
import { useAppStore } from '../features/wallet/walletStore';
import { ProfitPreference } from '../types';
import { formatUsd } from '../utils/formatters';

export const ControlsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    controls,
    portfolio,
    wallet,
    toggleAutopilot,
    setProfitPreference,
    setEmergencyPause,
    withdrawCapital,
    revokeSubWallet,
  } = useAppStore();

  // Dialog states
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(50);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [isEmergencyHaltOpen, setIsEmergencyHaltOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const isRunning = controls.autopilotStatus === 'RUNNING';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#191C21] text-white text-[12px] font-medium shadow-xl border border-white/10 animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3AC8FF]"></span>
          <span>{toastMsg}</span>
        </div>
      )}

      <div>
        <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#11141C] font-headline tracking-tight">
          Safety & Controls
        </h1>
        <p className="text-[13px] text-[#64748B]">
          Direct governance over autonomous operations, profit sweeps, and emergency breakers.
        </p>
      </div>

      {/* 1. Autopilot Engine Master State */}
      <div className="bg-white rounded-3xl p-5 border border-[#E2E7F0] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#090B10] text-[#3AC8FF] flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#11141C]">Autonomous Engine</h3>
              <p className="text-[12px] text-[#64748B]">
                {isRunning ? 'Currently monitoring and executing trades' : 'AI placed on standby'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              toggleAutopilot();
              triggerToast(isRunning ? 'Autopilot paused' : 'Autopilot running');
            }}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isRunning
                ? 'bg-[#F0F3FA] text-[#11141C] hover:bg-[#E2E7F0]'
                : 'bg-[#00B074] text-white shadow-sm hover:bg-[#059669]'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRunning ? 'Pause AI' : 'Resume AI'}</span>
          </button>
        </div>
      </div>

      {/* 2. Profit Preference Selector */}
      <div className="bg-white rounded-3xl p-5 border border-[#E2E7F0] shadow-sm space-y-3.5">
        <div>
          <h3 className="text-[15px] font-bold text-[#11141C]">Profit Reinvestment Preference</h3>
          <p className="text-[12px] text-[#64748B]">
            Determines where autonomous yields and rewards are routed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            {
              id: 'COMPOUND_ALL' as ProfitPreference,
              title: 'Compound All',
              desc: '100% daily yield reinvested back into top pools.',
            },
            {
              id: 'WITHDRAW_PROFIT' as ProfitPreference,
              title: 'Take to Safe Floor',
              desc: 'Harvested gains swept into safe USDT reserve.',
            },
            {
              id: 'SPLIT_PROFIT' as ProfitPreference,
              title: 'Split 50/50',
              desc: 'Balanced half compounded, half preserved.',
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setProfitPreference(item.id);
                triggerToast(`Profit preference set to ${item.title}`);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                controls.profitPreference === item.id
                  ? 'bg-[#F0F3FA] border-[#2F6BFF] ring-2 ring-[#2F6BFF]/10 font-semibold text-[#11141C]'
                  : 'bg-white border-[#E2E7F0] text-[#64748B] hover:border-[#CBD5E1]'
              }`}
            >
              <div className="text-[13px] font-bold text-[#11141C]">{item.title}</div>
              <div className="text-[11px] text-[#64748B] mt-1 leading-normal">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Capital Management (Add / Withdraw) */}
      <div className="bg-white rounded-3xl p-5 border border-[#E2E7F0] shadow-sm space-y-4">
        <div>
          <h3 className="text-[15px] font-bold text-[#11141C]">Sub-Wallet Capital</h3>
          <p className="text-[12px] text-[#64748B]">
            Deposit additional capital or withdraw back to your primary TON wallet.
          </p>
        </div>

        <div className="flex gap-3">
          <PrimaryButton
            size="md"
            onClick={() => navigate('/wallet/fund')}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Capital
          </PrimaryButton>
          <SecondaryButton
            size="md"
            onClick={() => setIsWithdrawOpen(true)}
            icon={<ArrowDownLeft className="w-4 h-4" />}
          >
            Withdraw to Wallet
          </SecondaryButton>
        </div>
      </div>

      {/* 4. Emergency Circuit Breaker & Revoke Permissions */}
      <div className="bg-white rounded-3xl p-5 border border-[#E2E7F0] shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#EF4444]">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-[15px] font-bold text-[#11141C]">Emergency & Revocation</h3>
        </div>
        <p className="text-[12px] text-[#64748B]">
          Emergency controls execute instantly without approval delays. You always retain complete sovereign authority over your capital.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsEmergencyHaltOpen(true)}
            className="flex-1 py-3 px-4 rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#B45309] hover:bg-[#F59E0B]/20 font-bold text-[13px] transition-all cursor-pointer text-center"
          >
            {controls.isEmergencyPaused ? 'Release Emergency Breaker' : 'Emergency Circuit Breaker'}
          </button>
          <button
            onClick={() => setIsRevokeOpen(true)}
            className="flex-1 py-3 px-4 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 text-[#DC2626] hover:bg-[#EF4444]/20 font-bold text-[13px] transition-all cursor-pointer text-center"
          >
            Revoke AI & Liquidate
          </button>
        </div>
      </div>

      {/* Withdraw Modal */}
      <BottomSheet
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        title="Withdraw Capital"
        subtitle={`Available Sub-Wallet Balance: ${formatUsd(portfolio.nav)}`}
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-[#64748B]">Amount to Withdraw (USD)</label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Math.max(1, parseFloat(e.target.value) || 0))}
              max={portfolio.nav}
              className="w-full px-4 py-3 rounded-xl border border-[#E2E7F0] text-[16px] font-mono font-bold"
            />
          </div>

          <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E7F0] space-y-1.5 text-[12px]">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Destination:</span>
              <span className="font-mono text-[#11141C] font-semibold">{wallet.ownerAddress} (Main)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Remaining Sub-Wallet Balance:</span>
              <span className="font-mono text-[#11141C]">{formatUsd(Math.max(0, portfolio.nav - withdrawAmount))}</span>
            </div>
          </div>

          <PrimaryButton
            size="lg"
            onClick={() => {
              withdrawCapital(withdrawAmount);
              setIsWithdrawOpen(false);
              triggerToast(`Withdrew ${formatUsd(withdrawAmount)} to main wallet`);
            }}
          >
            Confirm Withdrawal
          </PrimaryButton>
        </div>
      </BottomSheet>

      {/* Emergency Breaker Confirmation */}
      <ConfirmationDialog
        isOpen={isEmergencyHaltOpen}
        onClose={() => setIsEmergencyHaltOpen(false)}
        onConfirm={() => {
          setEmergencyPause(!controls.isEmergencyPaused);
          triggerToast(
            controls.isEmergencyPaused
              ? 'Emergency breaker released'
              : 'Emergency circuit breaker engaged!'
          );
        }}
        title={controls.isEmergencyPaused ? 'Resume Autonomous Execution?' : 'Engage Emergency Halt?'}
        description={
          controls.isEmergencyPaused
            ? 'This will release the circuit breaker and allow the agent to resume monitoring.'
            : 'Instantly halts all pending executions and trading across all 124 pools.'
        }
        confirmLabel={controls.isEmergencyPaused ? 'Resume Operations' : 'Engage Halt Now'}
        isDestructive={!controls.isEmergencyPaused}
      />

      {/* Revoke AI Confirmation */}
      <ConfirmationDialog
        isOpen={isRevokeOpen}
        onClose={() => setIsRevokeOpen(false)}
        onConfirm={() => {
          revokeSubWallet();
          triggerToast('AI access revoked. All funds returned to primary wallet.');
        }}
        title="Revoke AI Access & Liquidate?"
        description="This will cancel the smart contract operator permissions and sweep all sub-wallet assets back into your main personal TON wallet."
        confirmLabel="Revoke & Sweep Funds"
        isDestructive={true}
        details={[
          { label: 'Total Amount Swept', value: formatUsd(portfolio.nav) },
          { label: 'Destination', value: wallet.ownerAddress },
          { label: 'Sub-Wallet Status', value: 'Terminated' },
        ]}
      />
    </div>
  );
};
