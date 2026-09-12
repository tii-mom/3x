import React, { useState } from 'react';
import { useAgentStore } from '../services/agentService';
import { ShieldCheck, ShieldAlert, Lock, Pause, Play, AlertTriangle, Key, ArrowRight, ExternalLink } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';

export const MePageV3: React.FC = () => {
  const {
    data,
    isWalletConnected,
    ownerAddress,
    agenticWalletAddress,
    isActivatedTestnet,
    togglePause,
    revokeOperator,
    setEnvironment,
  } = useAgentStore();

  const { agent, environment } = data;
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  const handleConfirmRevoke = () => {
    revokeOperator();
    setShowRevokeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Security, Account & Controls</h1>
        <p className="text-xs text-slate-500">
          Owner root authority, key isolation parameters, and environment management
        </p>
      </div>

      {/* 1. Agent Profile Summary Card */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-2xl shadow-sm">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{agent.name}</h2>
                <SimulationBadge environment={environment} />
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                ID: {agent.id} • {agent.generation} • {agent.level}
              </p>
            </div>
          </div>

          {/* Environment Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setEnvironment('simulation')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                environment === 'simulation'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Simulation
            </button>
            <button
              type="button"
              onClick={() => setEnvironment('testnet')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                environment === 'testnet'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Testnet
            </button>
            <span
              className="px-3 py-1 rounded-lg text-xs font-medium text-slate-300 cursor-not-allowed"
              title="Mainnet token execution is strictly gated behind formal audit and beta milestones."
            >
              Mainnet (Locked)
            </span>
          </div>
        </div>

        {/* Wallet & Key Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Owner Root Wallet
            </span>
            <span className="text-xs font-mono font-medium text-slate-800 block truncate">
              {ownerAddress || 'Not connected (Demo Mode)'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">
              Holds master revocation authority
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Agentic Operator Subwallet
            </span>
            <span className="text-xs font-mono font-medium text-slate-800 block truncate">
              {agenticWalletAddress || (isActivatedTestnet ? 'kQCe8...91aZ' : 'Unactivated')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">
              Restricted execution operator key
            </span>
          </div>
        </div>
      </div>

      {/* 2. Owner Security Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
          Owner Root Actions
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Master cryptographic commands that immediately override agent behavior.
        </p>

        <div className="space-y-3">
          {/* Pause / Resume */}
          <div className="p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {agent.state === 'PAUSED' ? 'Resume Agent Operation' : 'Emergency Pause Agent'}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    agent.state === 'PAUSED'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  Status: {agent.state}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Halts all background task evaluations and prevents any transaction signing.
              </p>
            </div>

            <button
              type="button"
              onClick={togglePause}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs ${
                agent.state === 'PAUSED'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {agent.state === 'PAUSED' ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{agent.state === 'PAUSED' ? 'Resume' : 'Pause'}</span>
            </button>
          </div>

          {/* Revoke Operator Key */}
          <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/20 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-rose-900">Revoke Operator Key</span>
              </div>
              <p className="text-xs text-rose-700/80 mt-1">
                Permanently revokes the subwallet delegation on TON Testnet. Requires redeployment to reactivate.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowRevokeModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs shrink-0"
            >
              Revoke Key
            </button>
          </div>
        </div>
      </div>

      {/* 3. Immutable Risk Engine Invariants */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Immutable Risk Policy Invariants
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Hard invariants enforced by deterministic smart contracts. These can never be modified by AI reasoning or bounded plasticity.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Adapter Allowlist Only</span>
              <span className="text-slate-500 text-[11px]">
                Execution is strictly limited to verified platform adapters. Arbitrary calls are rejected with DENY.
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Zero Secret Exposure Boundary</span>
              <span className="text-slate-500 text-[11px]">
                Private operator keys never enter client browser storage, server logs, or LLM context windows.
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Restricted Protocol Seed</span>
              <span className="text-slate-500 text-[11px]">
                Seed capital cannot be transferred directly to user owner wallets; spend is limited to approved task costs.
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Simulation Before Sign</span>
              <span className="text-slate-500 text-[11px]">
                Every intent must simulate successfully and prove positive expected return before receiving signature.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Revocation Confirmation Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center mb-2">
              Confirm Operator Revocation?
            </h3>
            <p className="text-xs text-slate-600 text-center mb-5 leading-relaxed">
              This will revoke the operator key on TON Testnet. MOMO will no longer be able to autonomously execute verified opportunities until you re-activate.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowRevokeModal(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                Yes, Revoke Operator Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
