import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MilestoneProgress } from '../components/controls/MilestoneProgress';
import { MilestonePath } from '../components/controls/MilestonePath';
import { useAppStore } from '../features/wallet/walletStore';
import { useToast } from '../components/feedback/Toast';
import {
  Calculator,
  Check,
  ChevronRight,
  Edit3,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { formatUsd } from '../utils/formatters';

export const GoalJourneyPage: React.FC = () => {
  const navigate = useNavigate();
  const { goal, updateTargetGoal, simulateMilestoneReach, resetToInitialState } = useAppStore();
  const { showToast } = useToast();

  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [customTarget, setCustomTarget] = useState(goal.targetNav.toString());

  const handleSaveTarget = () => {
    const val = parseFloat(customTarget);
    if (isNaN(val) || val <= goal.currentNav) {
      showToast(`Target must be greater than current portfolio (${formatUsd(goal.currentNav)})`, 'warning');
      return;
    }
    updateTargetGoal(val);
    setIsEditingTarget(false);
    showToast(`Target milestone updated to ${formatUsd(val)}`, 'success');
  };

  const handleTestMilestone = () => {
    simulateMilestoneReach();
    showToast('Milestone achieved! Launching celebration...', 'success');
    navigate('/app/milestone-complete');
  };

  const handleReset = () => {
    resetToInitialState();
    showToast('Reset milestone state to default baseline', 'info');
  };

  // Projected days to milestone based on current APY (~18.2%)
  const dailyRate = 0.182 / 365;
  const remainingMultiplier = goal.targetNav / Math.max(1, goal.currentNav);
  const estimatedDays = remainingMultiplier > 1
    ? Math.round(Math.log(remainingMultiplier) / Math.log(1 + dailyRate))
    : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#11141C] font-headline tracking-tight">
            Milestone Journey
          </h1>
          <p className="text-[13px] text-[#64748B]">
            Autonomous compounding trajectory toward geometric growth milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleTestMilestone}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2F6BFF] text-white text-[12px] font-bold hover:bg-[#1E56E0] transition-colors cursor-pointer shadow-xs"
          >
            <Trophy className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Simulate Level 1 Win</span>
          </button>

          {goal.progress >= 1 && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-[#E2E7F0] text-[12px] font-semibold text-[#64748B] hover:text-[#11141C] cursor-pointer"
              title="Reset progress to default baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Milestone Progress Box */}
      <MilestoneProgress goal={goal} />

      {/* Interactive Goal Target Adjuster */}
      <div className="bg-white rounded-3xl p-5 border border-[#E2E7F0] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00B074]/10 text-[#00B074] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#11141C]">
                Milestone Target Multiplier
              </h3>
              <p className="text-[11px] text-[#64748B]">Set your next geometric checkpoint</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingTarget(!isEditingTarget)}
            className="text-[12px] font-semibold text-[#2F6BFF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingTarget ? 'Close' : 'Adjust Target'}</span>
          </button>
        </div>

        {isEditingTarget ? (
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E7F0] space-y-3 animate-fade-in">
            <div className="text-[12px] text-[#64748B]">
              Quick Presets:
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[250, 300, 500, 1000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setCustomTarget(preset.toString())}
                  className={`py-1.5 rounded-xl text-[12px] font-mono font-bold border transition-colors cursor-pointer ${
                    customTarget === preset.toString()
                      ? 'bg-[#2F6BFF] text-white border-[#2F6BFF]'
                      : 'bg-white text-[#11141C] border-[#E2E7F0] hover:border-[#2F6BFF]'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] font-mono font-bold">$</span>
                <input
                  type="number"
                  value={customTarget}
                  onChange={(e) => setCustomTarget(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-[#E2E7F0] text-[14px] font-mono font-bold text-[#11141C] focus:outline-hidden focus:border-[#2F6BFF]"
                  placeholder="Custom target"
                />
              </div>

              <button
                onClick={handleSaveTarget}
                className="px-4 py-2 rounded-xl bg-[#2F6BFF] text-white text-[13px] font-bold hover:bg-[#1E56E0] flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E7F0]">
            <span className="text-[12px] text-[#64748B]">Current Checkpoint Target:</span>
            <span className="font-mono font-bold text-[14px] text-[#11141C]">
              {formatUsd(goal.targetNav)} USD ({Math.round(goal.targetNav / goal.startingNav)}x of Starting Capital)
            </span>
          </div>
        )}
      </div>

      {/* Autonomous Projection Calculator Widget */}
      <div className="bg-white rounded-3xl p-5 border border-[#E2E7F0] shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#090B10] text-[#3AC8FF] flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#11141C]">
              Autonomous Trajectory Projection
            </h3>
            <p className="text-[11px] text-[#64748B]">Calm geometric compounding estimate</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[12px] pt-1">
          <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E7F0]">
            <div className="text-[10px] text-[#64748B] uppercase font-mono">Current Yield APY</div>
            <div className="font-mono font-extrabold text-[15px] text-[#00B074] mt-0.5">18.2% APY</div>
            <div className="text-[10px] text-[#64748B] mt-0.5">Compounded 24/7</div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E7F0]">
            <div className="text-[10px] text-[#64748B] uppercase font-mono">Est. Time to Goal</div>
            <div className="font-mono font-extrabold text-[15px] text-[#2F6BFF] mt-0.5">
              {estimatedDays > 0 ? `~${estimatedDays} days` : 'Goal Reached!'}
            </div>
            <div className="text-[10px] text-[#64748B] mt-0.5">At constant rate</div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E7F0] col-span-2 sm:col-span-1">
            <div className="text-[10px] text-[#64748B] uppercase font-mono">Next Level Check</div>
            <div className="font-mono font-extrabold text-[15px] text-[#11141C] mt-0.5">Level 2 (9x)</div>
            <div className="text-[10px] text-[#64748B] mt-0.5">$900.00 Checkpoint</div>
          </div>
        </div>
      </div>

      {/* Milestone Path Progression Map */}
      <MilestonePath goal={goal} />
    </div>
  );
};
