import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Bot,
  Brain,
  CheckCircle2,
  ChevronRight,
  Eye,
  HelpCircle,
  MessageSquare,
  Radar,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useAppStore } from '../features/wallet/walletStore';
import { formatUsd } from '../utils/formatters';

export const AIPage: React.FC = () => {
  const navigate = useNavigate();
  const { portfolio, activities, controls } = useAppStore();
  const isRunning = controls.autopilotStatus === 'RUNNING';

  const [isAskOpen, setIsAskOpen] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    {
      role: 'ai',
      text: "I'm your autonomous wealth agent. I actively monitor liquidity across the TON ecosystem and protect your capital against volatility. What would you like to know?",
    },
  ]);

  const handleAsk = (q?: string) => {
    const query = q || userQuestion;
    if (!query.trim()) return;

    const newChat = [...chatHistory, { role: 'user' as const, text: query }];
    setChatHistory(newChat);
    setUserQuestion('');

    setTimeout(() => {
      let reply = "I'm currently maintaining balanced growth. All positions are held within your 5% max risk parameters.";
      const lower = query.toLowerCase();
      if (lower.includes('ton') || lower.includes('buy')) {
        reply = "I hold 33% in liquid staking (bemo stTON) and 42% in USDT reserve. I avoid chasing short-term price spikes to protect your baseline capital.";
      } else if (lower.includes('milestone') || lower.includes('goal') || lower.includes('300')) {
        reply = `We are at ${formatUsd(portfolio.nav)}, which is ${Math.round(portfolio.milestoneProgress * 100)}% toward Level 1 ($300). Yield is being auto-compounded toward this goal.`;
      } else if (lower.includes('safe') || lower.includes('protect') || lower.includes('risk')) {
        reply = "Your funds are held inside your dedicated AI Wallet. I have zero access to your primary wallet, and you can pause me or withdraw your capital at any time.";
      }

      setChatHistory((prev) => [...prev, { role: 'ai', text: reply }]);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#11141C] font-headline tracking-tight">
            Your AI
          </h1>
          <p className="text-[13px] text-[#64748B]">
            See how your autonomous agent monitors opportunities, analyzes risk, and compounds returns.
          </p>
        </div>

        <button
          onClick={() => setIsAskOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2F6BFF] text-white text-[13px] font-semibold hover:bg-[#1E56E0] transition-all cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask my AI</span>
        </button>
      </div>

      {/* Top Dark Card: YOUR AI AT WORK */}
      <div className="relative overflow-hidden rounded-3xl bg-[#090B10] text-white p-6 sm:p-7 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#3AC8FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#2F6BFF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#3AC8FF] shadow-[0_0_20px_rgba(58,200,255,0.25)]">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[18px] font-extrabold tracking-tight text-white font-headline">
                  YOUR AI
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#00B074]/15 text-[#00B074] border border-[#00B074]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B074] animate-ping" />
                  {isRunning ? 'Observing' : 'Paused'}
                </span>
              </div>
              <p className="text-[12px] text-white/60">Autonomous TON Wealth Guardian</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[12px] font-mono text-white/70">
            <div>
              <div className="text-white/40 uppercase text-[10px]">Watching</div>
              <div className="text-white font-bold text-[14px]">124 opportunities</div>
            </div>
            <div>
              <div className="text-white/40 uppercase text-[10px]">Mode</div>
              <div className="text-[#3AC8FF] font-bold text-[14px]">Grow (Balanced)</div>
            </div>
            <div>
              <div className="text-white/40 uppercase text-[10px]">Last review</div>
              <div className="text-white font-bold text-[14px]">{portfolio.lastReviewMinutes || 8}m ago</div>
            </div>
          </div>
        </div>

        {/* Current AI Message */}
        <div className="relative z-10 mt-5 p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#3AC8FF] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-[11px] uppercase font-mono text-[#3AC8FF] font-semibold">
              Current AI Status
            </div>
            <p className="text-[14px] text-white font-medium leading-relaxed">
              &ldquo;AI is watching. No action needed right now — your current positions are healthy, earning ongoing yield, and compounding steadily within target risk limits.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Current View & Focused Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section: Current View */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E7F0] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F1F5F9]">
            <Eye className="w-4 h-4 text-[#2F6BFF]" />
            <h2 className="text-[15px] font-bold text-[#11141C]">Current View</h2>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E7F0] flex items-center justify-between">
              <div>
                <div className="text-[13px] font-bold text-[#11141C]">Market Condition</div>
                <div className="text-[12px] text-[#64748B]">TON DEX liquidity depth is stable</div>
              </div>
              <span className="text-[12px] font-bold text-[#2F6BFF] bg-[#2F6BFF]/10 px-2.5 py-1 rounded-full font-mono">
                Neutral
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E7F0] flex items-center justify-between">
              <div>
                <div className="text-[13px] font-bold text-[#11141C]">Portfolio Health</div>
                <div className="text-[12px] text-[#64748B]">Cash reserve intact, yields compounding</div>
              </div>
              <span className="text-[12px] font-bold text-[#00B074] bg-[#00B074]/10 px-2.5 py-1 rounded-full font-mono">
                Healthy
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E7F0] flex items-center justify-between">
              <div>
                <div className="text-[13px] font-bold text-[#11141C]">Risk Exposure</div>
                <div className="text-[12px] text-[#64748B]">No single position exceeds 5% limit</div>
              </div>
              <span className="text-[12px] font-bold text-[#00B074] bg-[#00B074]/10 px-2.5 py-1 rounded-full font-mono">
                Balanced
              </span>
            </div>
          </div>
        </div>

        {/* Section: What AI is focused on */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E7F0] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F1F5F9]">
            <Radar className="w-4 h-4 text-[#3AC8FF]" />
            <h2 className="text-[15px] font-bold text-[#11141C]">What AI is focused on</h2>
          </div>

          <div className="space-y-3 text-[13px]">
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E7F0] space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#11141C]">
                <span className="w-2 h-2 rounded-full bg-[#2F6BFF]" />
                <span>TON Ecosystem Depth</span>
              </div>
              <p className="text-[12px] text-[#64748B] pl-4">
                Tracking DeDust, STON.fi, and liquid staking contracts (bemo stTON) for risk-adjusted returns.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E7F0] space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#11141C]">
                <span className="w-2 h-2 rounded-full bg-[#00B074]" />
                <span>Stable Opportunities</span>
              </div>
              <p className="text-[12px] text-[#64748B] pl-4">
                Prioritizing USDT-TON deep pools that provide low slippage and dependable fee yields.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E7F0] space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#11141C]">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span>New Opportunities</span>
              </div>
              <p className="text-[12px] text-[#64748B] pl-4">
                Evaluating newly verified vaults for risk-adjusted suitability before allocating any capital.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Recent Reasoning */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E7F0] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-[#2F6BFF]" />
            <h2 className="text-[15px] font-bold text-[#11141C]">Recent AI Reasoning</h2>
          </div>
          <button
            onClick={() => navigate('/app/activity')}
            className="text-[12px] font-semibold text-[#2F6BFF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Full Activity
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {activities.slice(0, 3).map((act) => (
            <div
              key={act.id}
              onClick={() => navigate(`/app/decision/${act.id}`)}
              className="p-4 rounded-2xl border border-[#E2E7F0] hover:border-[#CBD5E1] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-[#11141C] group-hover:text-[#2F6BFF] transition-colors">
                    {act.title}
                  </span>
                  <span className="text-[10px] font-mono text-[#64748B]">
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-[12px] text-[#64748B] leading-relaxed">
                  {act.reasoningSnippet || act.description}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <span className="text-[12px] font-semibold text-[#2F6BFF] flex items-center gap-1">
                  Why AI did this
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ask My AI Modal / Drawer */}
      {isAskOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-[#E2E7F0] shadow-xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#090B10] text-[#3AC8FF] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#11141C]">Ask My AI</h3>
                  <p className="text-[11px] text-[#64748B]">Transparent answers about your capital & strategies</p>
                </div>
              </div>
              <button
                onClick={() => setIsAskOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#64748B] hover:text-[#11141C] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Chat message stream */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-[13px] ${
                      msg.role === 'user'
                        ? 'bg-[#2F6BFF] text-white rounded-br-xs'
                        : 'bg-[#F8FAFC] border border-[#E2E7F0] text-[#11141C] rounded-bl-xs leading-relaxed'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {[
                'Why aren’t you buying more TON?',
                'How close are we to $300?',
                'Is my principal protected?',
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleAsk(chip)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-[#F0F3FA] text-[#2F6BFF] hover:bg-[#E2E7F0] transition-colors cursor-pointer font-medium"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9]"
            >
              <input
                type="text"
                placeholder="Ask about risk, holdings, or decisions..."
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E7F0] text-[13px] text-[#11141C] focus:outline-none focus:border-[#2F6BFF]"
              />
              <button
                type="submit"
                disabled={!userQuestion.trim()}
                className="p-2.5 rounded-xl bg-[#2F6BFF] text-white hover:bg-[#1E56E0] transition-colors cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
