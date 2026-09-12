import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgentStore } from '../services/agentService';
import { Bot, Sparkles, Check, ArrowRight, Shield } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';

const AVATAR_OPTIONS = [
  { id: 'blue', label: 'Tactician', color: 'from-blue-600 to-indigo-600', icon: '🤖' },
  { id: 'cyan', label: 'Analyst', color: 'from-cyan-500 to-blue-500', icon: '⚡' },
  { id: 'emerald', label: 'Guardian', color: 'from-emerald-500 to-teal-600', icon: '🛡️' },
  { id: 'amber', label: 'Pioneer', color: 'from-amber-500 to-orange-500', icon: '🚀' },
];

export const ClaimPageV3: React.FC = () => {
  const navigate = useNavigate();
  const { claimAgent } = useAgentStore();
  const [name, setName] = useState('MOMO');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create zero-wallet demo agent immediately
    setTimeout(() => {
      claimAgent(name, selectedAvatar);
      navigate('/app');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Header */}
      <header className="max-w-md w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
            3X
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-800">Claim Free AI</span>
        </div>
        <SimulationBadge environment="simulation" />
      </header>

      {/* Main Claim Card */}
      <main className="max-w-md w-full mx-auto px-6 py-6 flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-3xl mx-auto mb-3 shadow-md">
              {AVATAR_OPTIONS.find((a) => a.id === selectedAvatar)?.icon || '🤖'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hatch Your Free AI</h1>
            <p className="text-xs text-slate-500 mt-1">
              No wallet required • Free daily base energy • Zero risk sandbox
            </p>
          </div>

          <form onSubmit={handleClaim} className="space-y-6">
            {/* Agent Name */}
            <div>
              <label htmlFor="agent-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Agent Name
              </label>
              <input
                id="agent-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium bg-slate-50/50"
                placeholder="e.g. MOMO"
              />
            </div>

            {/* Archetype Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Core Archetype
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {AVATAR_OPTIONS.map((item) => {
                  const isSelected = selectedAvatar === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedAvatar(item.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-semibold text-slate-800 truncate">
                          {item.label}
                        </span>
                        <span className="block text-[10px] text-slate-400">Gen 0 Primary</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Starter Benefits List */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Primary AI Generation: <strong>GENESIS</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Bot className="w-3.5 h-3.5 text-cyan-600" />
                <span>Starter Skills: <strong>Task Hunter + Value Hunter</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Risk Engine: <strong>Always Active (Protected)</strong></span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-blue-glow transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Hatching Agent...' : 'Hatch Free AI & Start Working'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md w-full mx-auto px-6 py-6 text-center text-xs text-slate-400">
        You can connect a TON Testnet wallet later when you are ready to put MOMO on-chain.
      </footer>
    </div>
  );
};
