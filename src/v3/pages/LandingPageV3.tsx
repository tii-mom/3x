import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, ShieldCheck, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';

export const LandingPageV3: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* Top Bar */}
      <header className="max-w-4xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-blue-glow">
            3X
          </div>
          <span className="font-bold text-lg tracking-tight">3X Living Agent</span>
        </div>
        <SimulationBadge environment="simulation" />
      </header>

      {/* Hero Section */}
      <main className="max-w-3xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center text-center">
        {/* Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-400 text-xs font-semibold mx-auto mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>V3.1 Living Agent Architecture</span>
        </div>

        {/* Headlines */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 mb-6 leading-tight sm:leading-none">
          Raise an AI. <br className="hidden sm:inline" />
          Give it skills. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
            Let it work. Watch it grow.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          免费领一个会工作的 AI。只有在产生正向预期收益时才消耗算力，替你创造可验证的经济价值并在真实任务中持续进化。
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/claim"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-base shadow-blue-glow hover:shadow-cyan-glow transition-all scale-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Claim Free AI Agent</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/app"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-base border border-slate-700 transition-colors"
          >
            <span>Explore Dashboard</span>
          </Link>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-100 mb-1">Day 0 Zero Barrier</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              第一只 AI 免费领取，无需钱包和 Gas 即可开始体验模拟工作与成长回路。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-100 mb-1">No Value, No Compute</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Value Router 预先验证经济正期望。绝不为无意义的思考或低质机会空耗高级 Energy。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-100 mb-1">Immutable Risk Gate</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              硬风控规则永远不可被模型学习或覆盖。私钥与签名环境严格物理隔离。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-100 mb-1">Qualified Net Earnings</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              等级与 Growth 解锁由真实的外部生产净产出（QNE）决定，不依赖 Token 炒作。
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-500 border-t border-slate-800/80">
        3X V3.1 Living Agent • TON Testnet Preview • All simulation balances are risk-free
      </footer>
    </div>
  );
};
