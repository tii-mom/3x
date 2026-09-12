import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BottomNavigation, DesktopHeaderNav } from './Navigation';
import { SimulationBadge } from './SimulationBadge';
import { useAgentStore } from '../services/agentService';
import { Zap, ShieldCheck } from 'lucide-react';

export const AppShellV3: React.FC = () => {
  const { data, isActivatedTestnet } = useAgentStore();
  const { agent, environment } = data;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Logo & Agent Name */}
          <div className="flex items-center gap-3">
            <Link to="/app" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
                3X
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-sm tracking-tight text-slate-900 block leading-tight">
                  {agent.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block leading-tight">
                  {agent.generation} • {agent.level}
                </span>
              </div>
            </Link>

            {/* Environment Badge */}
            <SimulationBadge environment={environment} />
          </div>

          {/* Desktop Navigation */}
          <DesktopHeaderNav />

          {/* Right Header Status / Quick Links */}
          <div className="flex items-center gap-2">
            {/* Quick Energy Pill */}
            <Link
              to="/app/energy"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-xs font-semibold text-slate-700 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{agent.energy.premiumPct}%</span>
            </Link>

            {/* Activation status pill */}
            {!isActivatedTestnet ? (
              <Link
                to="/activate"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Activate Testnet</span>
              </Link>
            ) : (
              <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Testnet Active</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};
